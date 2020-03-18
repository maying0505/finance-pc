/**
 * @desc还款管理第三方还款记录列表
 * */
import React from 'react';
import './ThirdRepayRecordList.less';
import {TitleLine, Http, DownloadFile} from '../../components';
import {ROOT_URL} from '../../utils';
import {Button, Col, Form, Input, Row, DatePicker, Select, message, Spin, Table} from 'antd';
import {ColConfig, PageSize, AmountFormat, allowClear} from '../../config';
import moment from 'moment';

const FormItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
    },
    colon: false,
};

const DateFormat = 'YYYY-MM-DD HH:mm:ss';
const Option = Select.Option;

class Main extends React.Component {

    state = {
        pagination: {pageSize: PageSize, showTotal: total => `共${total}条`},
        loading: false,
        queryObj: {},
        params: {},
        auditStatus: [],
        loanStatus: [],
        channelArr: [
            {
                id: 1,
                channelName: '富友支付'
            },
            {
                id: 2,
                channelName: '畅捷支付'
            },
            {
                id: 3,
                channelName: '支付宝支付'
            },
            {
                id: 4,
                channelName: '线下支付'
            },
            {
                id: 5,
                channelName: '平台减免'
            }
        ],
    };

    componentDidMount() {
        this._handleSubmit();
        this._allStatus();
    }

    columns = [
        {
            title: '订单id',
            dataIndex: 'id',
        },
        {
            title: '借款人id',
            dataIndex: 'userId',
            
        },
        {
            title: '借款人姓名',
            dataIndex: 'userName',
            
        },
        {
            title: '借款人手机号',
            dataIndex: 'mobile',
            
        },
        {
            title: '还款订单流水',
            dataIndex: 'orderId',
            
        },
        {
            title: '第三方支付流水',
            dataIndex: 'payOrderId',
            
        },
        {
            title: '金额',
            dataIndex: 'amount',
            render: text => AmountFormat(text),
        },
        {
            title: '状态',
            dataIndex: 'status',
            
        },
        {
            title: '还款渠道',
            dataIndex: 'payChannel',
            
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            
        },
        {
            title: '回调成功时间',
            dataIndex: 'notifyTime',
            
        },
        {
            title: '还款成功时间',
            dataIndex: 'successTime',
            
        },
        {
            title: '备注',
            dataIndex: 'remark',
            
        },
        {
            title: '操作人',
            dataIndex: 'creator',
            
        },
    ];

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                values.createStartTime = values.createStartTime ? values.createStartTime.format(DateFormat) : undefined;
                values.createEndTime = values.createEndTime	? values.createEndTime.format(DateFormat) : undefined;
                values.successStartTime = values.successStartTime ? values.successStartTime.format(DateFormat) : undefined;
                values.successEndTime = values.successEndTime ? values.successEndTime.format(DateFormat) : undefined;
                this.setState({queryObj: values});
                this._fetchData(1, values);
            }
        });
    };

    _fetchData = async (pageNum, queryObj = this.state.queryObj) => {
        try {
            this.setState({loading: true});
            const params = {
                size: PageSize,
                current: pageNum,
                ...queryObj,
            };
            this.setState({params: params});
            const {code, message: msg, data} = await Http.thirdRepayRecordList(params);
            const {pagination} = this.state;
            let dataArr = [];
            if (code === 200) {
                const {total, records} = data;
                pagination.total = total;
                pagination.current = pageNum;
                if (Array.isArray(records)) {
                    dataArr = records;
                }
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            this.setState({
                pagination,
                data: dataArr,
                loading: false,
                pageIndex: pageNum,
            });
        } catch (e) {
            console.log('e', e);
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _allStatus = async () => {
        try {
            const {code, message: msg, data} = await Http.allStatus();
            if (code === 200) {
                this.setState({
                    loanStatus: data ? data : [],
                });
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

    _handleReset = () => {
        const {form: {resetFields}} = this.props;
        resetFields();
        this.setState({queryObj: {}}, () => {
            this._fetchData(1);
        });
    };

    _handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        }, () => {
            this._fetchData(pagination.current);
        });
    };

    _handleExport = async () => {
        try {
            const {params} = this.state;
            const {code, message: msg, data} = await Http.thirdRepayRecordListExport({...params});
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

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {loading, data, pagination, channelArr} = this.state;
        const {clientHeight} = document.body;
        const tableHeight = clientHeight - 150;
        return (
            <div className='third-repay-record-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='第三方还款记录列表'
                        icon='yonghu'
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='借款人' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('user', {
                                        rules: [{required: false, message: '借款订单号/姓名/认证号码'},
                                        ],
                                    })(
                                        <Input placeholder='借款订单号/姓名/认证号码'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='还款成功时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('successStartTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
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
                                    {getFieldDecorator('successEndTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                                            format={DateFormat}
                                            style={{width: '46%'}}
                                            placeholder='选择结束时间'
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='还款创建时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('createStartTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
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
                                    {getFieldDecorator('createEndTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                                            format={DateFormat}
                                            style={{width: '46%'}}
                                            placeholder='选择结束时间'
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='状态' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('status', {
                                        rules: [{required: false, message: '状态'},
                                        ],
                                    })(
                                        <Select placeholder='请选择'  allowClear={allowClear}>
                                            <Option value={0}>订单创建初始化</Option>
                                            <Option value={1}>待支付</Option>
                                            <Option value={2}>支付完成待回调</Option>
                                            <Option value={3}>回调完成支付成功</Option>
                                            <Option value={4}>回调完成支付失败</Option>
                                            <Option value={5}>支付失败</Option>
                                            <Option value={6}>支付下单失败</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='订单id' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('id', {
                                        rules: [{required: false, message: '订单id'},
                                        ],
                                    })(
                                        <Input placeholder='订单id'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='还款订单流水' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('orderId', {
                                        rules: [{required: false, message: '还款订单流水'},
                                        ],
                                    })(
                                        <Input placeholder='还款订单流水'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='第三方支付流水' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('payOrderId', {
                                        rules: [{required: false, message: '第三方支付流水'},
                                        ],
                                    })(
                                        <Input placeholder='第三方支付流水'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='还款渠道' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('payChannel', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='还款渠道' allowClear={allowClear}>
                                            {channelArr.map(i => <Option value={i.id} key={i.id}>{i.channelName}</Option>)}
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
                                <Button
                                    className="right"
                                    htmlType="button"
                                    onClick={this._handleExport}
                                >
                                    导出Excel
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                    <Table
                        bordered
                        size='small'
                        columns={this.columns}
                        rowKey='id'
                        dataSource={data}
                        pagination={pagination}
                        loading={loading}
                        onChange={this._handleTableChange}
                        scroll={{x: 2000}}
                    />
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
