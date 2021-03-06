/**
 * @desc 每日未还本金
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
        start: GetNowFormatDate('0',0),
        end: GetNowFormatDate('1',0)
    };

    componentDidMount() {
        this._handleSubmit();
    }

    columns = [
        {
            title: '借款日期',
            dataIndex: 'date',
        },
        {
            title: '借款本金',
            dataIndex: 'loanAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '实际打款金额',
            dataIndex: 'payAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '实际已还本金',
            dataIndex: 'repayedAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '未还本金',
            dataIndex: 'notRepayAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '未到期未还本金',
            dataIndex: 'normalNotRepayAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '逾期1-5天',
            dataIndex: 'overdueS1Amount',
            render: text => AmountFormat(text),
        },
        {
            title: '逾期6-15天',
            dataIndex: 'overdueS2Amount',
            render: text => AmountFormat(text),
        },
        {
            title: '逾期16-30天',
            dataIndex: 'overdueS3Amount',
            render: text => AmountFormat(text),
        },
        {
            title: 'M1',
            dataIndex: 'overdueM1Amount',
            render: text => AmountFormat(text),
        },
        {
            title: 'M1',
            dataIndex: 'overdueM2Amount',
            render: text => AmountFormat(text),
        },
        {
            title: 'M3',
            dataIndex: 'overdueM3Amount',
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

    _fetchData = async (queryObj = this.state.queryObj) => {
        try {
            this.setState({loading: true});
            const params = {
                ...queryObj,
                channelId: -1,
                userType: -1
            };
            const {code, message: msg, data} = await Http.reportPrincipalPaymentList(params);
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
                        title='每日未还本金'
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
