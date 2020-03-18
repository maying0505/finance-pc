/**
 * @desc 贷款余额统计
 * */
import React from 'react';
import {TitleLine, Http} from '../../components';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table} from 'antd';
import {ColConfig, AmountFormat, GetNowFormatDate} from '../../config';
import './ReportRemaining.less';
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
        start: GetNowFormatDate('0',7),
        end: GetNowFormatDate('1',0)
    };

    componentDidMount() {
        this._handleSubmit();
    }

    columns = [
        {
            title: '日期',
            dataIndex: 'date',
        },
        {
            title: '贷款余额',
            dataIndex: 'dueinAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '未到期余额',
            dataIndex: 'undueAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '逾期余额',
            dataIndex: 'overdueAmount',
            render: text => AmountFormat(text),
        },
        {
            title: 'M0逾期本金',
            dataIndex: 'overdueM0Amount',
            render: text => AmountFormat(text),
        },
        {
            title: 'M1逾期本金',
            dataIndex: 'overdueM1Amount',
            render: text => AmountFormat(text),
        },
        {
            title: 'M2逾期本金',
            dataIndex: 'overdueM2Amount',
            render: text => AmountFormat(text),
        },
        {
            title: 'M3逾期本金',
            dataIndex: 'overdueM3Amount',
            render: text => AmountFormat(text),
        },
        {
            title: '应收罚息总额',
            dataIndex: 'shouldOverdueFee',
            render: text => AmountFormat(text),
        },
        {
            title: '实收罚息总额',
            dataIndex: 'actualOverdueFee',
            render: text => AmountFormat(text),
        },
    ];

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                values.start = values.start ? values.start.format(DateFormat) : undefined;
                values.end = values.end ? values.end.format(DateFormat) : undefined;
                this.setState({queryObj: values});
                this._fetchData(values);
            }
        });
    };

    _fetchData = async ( queryObj = this.state.queryObj) => {
        try {
            this.setState({loading: true});
            const params = {
                ...queryObj,
                channelId: -1,
                userType: -1
            };
            const {code, message: msg, data} = await Http.reportRemainingList(params);
            let dataArr = [];
            if (code === 200) {
                if (Array.isArray(data)) {
                    dataArr = data;
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
        const {loading, data, start, end} = this.state;
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='贷款余额统计'
                        icon='yonghu'
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='日期' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('start', {
                                        initialValue: moment(start, DateFormat),
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            format={DateFormat}
                                            allowClear={false}
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
                                            allowClear={false}
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
                        rowKey='loanOrderId'
                        dataSource={data}
                        pagination={false}
                        loading={loading}
                    />
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
