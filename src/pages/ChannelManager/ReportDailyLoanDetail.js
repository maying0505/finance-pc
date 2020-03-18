/**
 * @desc 平台放款数据
 * */
import React from 'react';
import {TitleLine, Http} from '../../components';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table} from 'antd';
import {ColConfig, GetNowFormatDate, AmountFormat} from '../../config';
import moment from 'moment';

const FormItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 4},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
    },
    colon: false,
};

const DateFormat = 'YYYY-MM-DD';

class Main extends React.Component {

    state = {
        loading: false,
        data: [],
        footer: '放款单数总计0笔，放款总额总计0元',
        start: GetNowFormatDate('0',6),
        end: GetNowFormatDate('1',0)
    };

    componentDidMount() {
        this._handleSubmit();
    }

    columns = [
        {
            title: '日期',
            children: [
                {
                    title: '放款日',
                    dataIndex: 'date',
                },
            ]
        },
        {
            title: '所有用户',
            children: [
                {
                    title: '放款单数',
                    dataIndex: 'payNum',
                },
                {
                    title: '放款总额',
                    dataIndex: 'payAmount',
                    render: text => AmountFormat(text),
                },
            ]
        },
        {
            title: '老用户',
            children: [
                {
                    title: '放款单数',
                    dataIndex: 'oldPayNum',
                },
                {
                    title: '放款总额',
                    dataIndex: 'oldPayAmount',
                    render: text => AmountFormat(text),
                },
            ]
        },
        {
            title: '新用户',
            children: [
                {
                    title: '放款单数',
                    dataIndex: 'newPayNum',
                },
                {
                    title: '放款总额',
                    dataIndex: 'newPayAmount',
                    render: text => AmountFormat(text),
                },
            ]
        },
    ];

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                values.start = values.start ? values.start.format(DateFormat) : undefined;
                values.end = values.end ? values.end.format(DateFormat) : undefined;
                this.setState({
                    data: [],
                    queryObj: values
                },function(){
                    this._fetchData(values);
                });
            }
        });
    };

    _fetchData = async (queryObj = this.state.queryObj) => {
        try {
            this.setState({loading: true});
            const params = {
                ...queryObj,
                channelId: -1,
                userType: -1
            };
            const {code, message: msg, data} = await Http.reportDailyLoanDetail(params);
            let dataArr = [];
            if (code === 200) {
                if (data && Array.isArray(data.data)) {
                    dataArr = data.data;
                    let count = data['totalPayNum'] ? data['totalPayNum'] : 0;
                    let amount = data['totalPayAmount'] ? data['totalPayAmount'] : 0;
                    this.setState({
                        footer: `放款单数总计`+ count +`笔，放款总额总计`+ AmountFormat(amount).toFixed(2) +`元`
                    })
                }
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            this.setState({
                data: dataArr,
                loading: false,
            });
        } catch (e) {
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _handleReset = () => {
        const {form: {resetFields}} = this.props;
        resetFields();
        this.setState({queryObj: {}}, () => {
            this._handleSubmit();
        });
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {loading, data, footer, end, start} = this.state;
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='平台放款数据'
                        icon='yonghu'
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='放款日期' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('start', {
                                        initialValue: moment(start, DateFormat),
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            format={DateFormat}
                                            style={{width: '46%'}}
                                            placeholder='选择开始时间'
                                        />
                                    )}
                                    <span style={{
                                        width: '8%',
                                        lineHeight: '32px',
                                        textAlign: 'center',
                                        color: 'rgba(0, 0, 0, 0.45)',
                                        display: 'inline-block',
                                    }}>至
                                </span>
                                    {getFieldDecorator('end', {
                                        initialValue: moment(end, DateFormat),
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            format={DateFormat}
                                            style={{width: '46%'}}
                                            placeholder='选择结束时间'
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item style={{marginBottom: '10px'}}>
                            <div className='button-view'>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="submit"
                                >
                                    查询
                                </Button>
                                <Button
                                    className="close"
                                    htmlType="button"
                                    onClick={this._handleReset}
                                >
                                    重置
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                    <Table
                        bordered
                        size='small'
                        columns={this.columns}
                        rowKey='date'
                        dataSource={data}
                        pagination={false}
                        loading={loading}
                        onChange={this._handleTableChange}
                        footer= {() => footer}
                    />
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
