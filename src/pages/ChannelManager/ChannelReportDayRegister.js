/**
 * @desc 渠道每日注册列表（新）
 * */
import React from 'react';
import {TitleLine, Http,  DownloadFile} from '../../components';
import {ROOT_URL} from '../../utils';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table, Select, Modal} from 'antd';
import {ColConfig, allowClear, GetNowFormatDate} from '../../config';
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
const Option = Select.Option;

class Main extends React.Component {

    state = {
        loading: false,
        dataSource: [],
        params: {},
        channelArr: [],
        startTime: GetNowFormatDate('0',0),
        endTime: GetNowFormatDate('1',0),
        visible: false,
        detailLoading: false,
        detailInfo: [],
    };

    componentDidMount() {
        this._allChannel();
        this._handleSubmit();
    }

    columns = [
        {
            title: '渠道id',
            dataIndex: 'channelId',
        },
        {
            title: '日期',
            dataIndex: 'date',
        },
        {
            title: '渠道名称',
            dataIndex: 'channelName',
        },
        {
            title: '注册数量(未扣量)',
            dataIndex: 'registerNum',
        },
        {
            title: '注册数量(扣量)',
            dataIndex: 'viewRegisterNum',
        },
        {
            title: '认证数量(未扣量)',
            dataIndex: 'authNum',
        },
        {
            title: '认证数量(扣量)',
            dataIndex: 'viewAuthNum',
        },
        {
            title: '申请数量(未扣量)',
            dataIndex: 'applyNum',
        },
        {
            title: '申请数量(扣量)',
            dataIndex: 'viewApplyNum',
        },
        {
            title: '放款数量（未扣量）',
            dataIndex: 'loanNum',
        },
        {
            title: '放款数量（扣量）',
            dataIndex: 'viewLoanNum',
        },
        {
            title: '单价',
            dataIndex: 'price',
            render: (text) => <span>{text || text === 0 ? text/100 : ''}</span>
        },
        {
            title: '总价',
            dataIndex: 'totalMoney',
            render: (text) => <span>{text || text === 0 ? text/100 : ''}</span>
        },
        {
            title: 'UV数量',
            dataIndex: 'uvNum',
        },
        {
            title: '操作',
            dataIndex: 'channelId',
            width: 150,
            render: (text, record) => <span className="orange-color" onClick={() => this._showDetail(record.rateList)}>显示扣量详情</span>
        },
    ];

    detailColumns = [
        {
            title: '开始时间',
            dataIndex: 'start',
            render: (text) => <span>{this.dateShow(text)}</span>
        },
        {
            title: '结束时间',
            dataIndex: 'end',
            render: (text) => <span>{this.dateShow(text)}</span>
        },
        {
            title: '扣量比例',
            dataIndex: 'rate',
        },
        {
            title: '注册数量(未扣量)',
            dataIndex: 'registerNum',
        },
        {
            title: '注册数量(扣量)',
            dataIndex: 'viewRegisterNum',
        },
        {
            title: '认证数量(未扣量)',
            dataIndex: 'authNum',
        },
        {
            title: '认证数量(扣量)',
            dataIndex: 'viewAuthNum',
        },
        {
            title: '申请数量（未扣量）',
            dataIndex: 'applyNum',
        },
        {
            title: '申请数量（扣量）',
            dataIndex: 'viewApplyNum',
        },
        {
            title: '放款数量（未扣量）',
            dataIndex: 'loanNum',
        },
        {
            title: '放款数量（扣量）',
            dataIndex: 'viewLoanNum',
        },
    ];

    dateShow = (text) => {
        let textshow = '';
        if (Array.isArray(text)) {
            let num = text.length;
            for (let i in text) {
                i = Number(i);
                if (i === (num-1)) {
                    textshow = textshow + text[i]
                    return textshow
                }
                if (i < 2) {
                    textshow = textshow + text[i] + '-' 
                }
                if (i === 2) {
                    textshow = textshow + text[i] + ' ' 
                }
                if (i < 5 && i > 2) {
                    textshow = textshow + text[i] + ':' 
                }
                if (i === 5) {
                    textshow = textshow + text[i]
                }
            }

            return textshow
        }
    }

    _allChannel = async () => {
        try {
            const {code, message: msg, data} = await Http.allChannel();
            if (code === 200) {
                this.setState({channelArr: data});
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
        } catch (e) {
            console.log('e', e);
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                values.startTime = values.startTime ? values.startTime.format(DateFormat) : undefined;
                values.endTime = values.endTime ? values.endTime.format(DateFormat) : undefined;
                this.setState({
                    dataSource: [],
                    queryObj: values
                },function(){
                    this._fetchData(values);
                });
            }
        });
    };

    _fetchData = async (queryObj = this.state.queryObj) => {
        try {
            this.setState({loading: true,params: queryObj});
            const params = {
                ...queryObj,
            };
           
            const {code, message: msg, data} = await Http.channelReportDayRegister(params);
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
                dataSource: dataArr,
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
            this._fetchData();
        });
    };

    _handleExport = async () => {
        try {
            const {params} = this.state;
            const {code, message: msg, data} = await Http.dailyPeriodExcel({...params});
            if (code === 200) {
                DownloadFile(ROOT_URL + data);
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
        } catch (e) {
            console.log('e', e);
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _showDetail =(data) => {
        let dataArr = [];
        if (Array.isArray(data)) {
            dataArr = data;
        }
        this.setState({
            detailInfo: dataArr,
            detailLoading: false,
            visible: true
        });
    };

    handleCancel = e => {
        this.setState({
          visible: false,
        });
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {loading, dataSource, channelArr, startTime, endTime, visible, detailLoading, detailInfo,} = this.state;
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='渠道每日注册列表（新）'
                        icon='yonghu'
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='日期' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('startTime', {
                                        initialValue: moment(startTime, DateFormat),
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
                                    {getFieldDecorator('endTime', {
                                        initialValue: moment(endTime, DateFormat),
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
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='渠道' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('channel', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            {channelArr.map(i => <Option key={i.id} value={i.id}>{i.name}</Option>)}
                                        </Select>
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
                                {/* <Button
                                    className="right"
                                    htmlType="button"
                                    onClick={this._handleExport}
                                >
                                    导出Excel
                                </Button> */}
                            </div>
                        </Form.Item>
                    </Form>
                    <Table
                        bordered
                        size='small'
                        columns={this.columns}
                        rowKey='id'
                        dataSource={dataSource}
                        pagination={false}
                        loading={loading}
                    />
                </Spin>
                <Modal
                    title="扣量详情"
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
