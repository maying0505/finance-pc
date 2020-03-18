/**
 * @desc 收付款日表
 * */
import React from 'react';
import {TitleLine, Http} from '../../components';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table, Modal} from 'antd';
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
        visible: false,
        detailLoading: false,
        detailInfo: [],
        data: [],
        start: GetNowFormatDate('0',7),
        end: GetNowFormatDate('1',0)
    };

    componentDidMount() {
        this._handleSubmit();
    }

    detailColumns = [
        {
            title: '订单号',
            dataIndex: 'orderId',
        },
        {
            title: '打款成功时间',
            dataIndex: 'loanTime',
        },
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
        },
        {
            title: '借款申请金额',
            dataIndex: 'amount',
            render: text => AmountFormat(text),
        },
        {
            title: '实收还款总金额',
            dataIndex: 'actualRepayAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '实收还款本金',
            dataIndex: 'actualPrincipal',
            render: text => AmountFormat(text),
        },
        {
            title: '实收罚息',
            dataIndex: 'overdueFee',
            render: text => AmountFormat(text),
        },
    ];


    columns = [
        {
            title: '日期',
            dataIndex: 'date',
        },
        {
            title: '借款单数',
            dataIndex: 'loanNum',
        },
        {
            title: '借款申请金额',
            dataIndex: 'loanAmount',
        },
        {
            title: '银行打款金额',
            dataIndex: 'payAmount',
        },
        {
            title: '手续费',
            dataIndex: 'serviceFee',
        },
        {
            title: '实收还款总额',
            dataIndex: 'repayAmount',
        },
        {
            title: '实收还款本金',
            dataIndex: 'repayPrincipal',
        },
        {
            title: '实收罚息',
            dataIndex: 'repayOverdueFee',
        },
        {
            title: '详情',
            dataIndex: 'id',
            render: (text, record) => <Button type="primary" size="small" onClick={() => this._showDetail(record.date)}>明细</Button>,
        },
    ];

    _showDetail =(loanTime) => {
        this.setState({
            visible: true
        },function(){
            this._fetchDetailData(loanTime);
        })
    };

    _fetchDetailData = async (loanTime) => {
        try {
            this.setState({
                detailLoading: true
            });
            const {code, message: msg, data} = await Http.loanDetailGet({loanTime});
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
                detailInfo: dataArr,
                detailLoading: false
            });
        } catch (e) {
            this.setState({
                detailLoading: false
            });
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

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
            const {code, message: msg, data} = await Http.dailyReport(params);
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

    handleCancel = e => {
        this.setState({
          visible: false,
        });
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {loading, data, visible, detailLoading, detailInfo, start, end} = this.state;
        
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='收付款-日表'
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
                                            allowClear={false}
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
                                            allowClear={false}
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
                        rowKey='loanOrderId'
                        dataSource={data}
                        pagination={false}
                        loading={loading}
                    />
                </Spin>
                <Modal
                    title="收付款明细"
                    visible={visible}
                    width="70%"
                    onCancel={this.handleCancel}
                    footer={[
                        <Button onClick={() => this.handleCancel()}>关闭</Button>,
                    ]}
                    >
                    <Table
                        bordered
                        size='small'
                        columns={this.detailColumns}
                        rowKey='loanOrderId'
                        dataSource={detailInfo}
                        pagination={false}
                        loading={detailLoading}
                    />
                </Modal>
            </div>
        )
    }
}

export default Form.create()(Main);
