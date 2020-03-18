/**
 * @desc 打款列表
 * */
import React from 'react';
import './PayRecordList.less';
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

const columnsWidth = '';

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
        allLoanProduct: [],
        statusArr: [
            {
                id: 0,
                name: '订单创建初始化'
            },
            {
                id: 1,
                name: '待支付'
            },
            {
                id: 2,
                name: '支付完成待回调'
            },
            {
                id: 3,
                name: '回调完成支付成功'
            },
            {
                id: 4,
                name: '回调完成支付失败'
            },
            {
                id: 5,
                name: '支付失败'
            },
            {
                id: 6,
                name: '支付下单失败'
            },
        ],
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
        ],
    };

    componentDidMount() {
        this._handleSubmit();
        this._allStatus();
        this._allLoanProduct();
    }

    columns = [
        {
            title: '打款流水号',
            dataIndex: 'id',
            width: columnsWidth,
        },
        {
            title: '借款订单号',
            dataIndex: 'orderId',
            width: columnsWidth,
        },
        {
            title: '借款人姓名',
            dataIndex: 'userName',
            width: columnsWidth,
        },
        {
            title: '认证号码',
            dataIndex: 'mobile',
            width: columnsWidth,
        },
        {
            title: '申请时间',
            dataIndex: 'orderCreateTime',
            width: columnsWidth,
        },
        {
            title: '借款金额',
            dataIndex: 'orderAmount',
            width: columnsWidth,
            render: text => AmountFormat(text),
        },
        {
            title: '借款产品',
            dataIndex: 'productId',
            width: columnsWidth,
            render: (text) => <span>{this.productNameShow(text)}</span>
        },
        {
            title: '利息',
            dataIndex: 'interest',
            width: columnsWidth,
            render: text => AmountFormat(text),
        },
        {
            title: '手续费',
            dataIndex: 'serviceFee',
            width: columnsWidth,
            render: text => AmountFormat(text),
        },
        {
            title: '借款状态',
            dataIndex: 'orderStatus',
            width: columnsWidth,

        },
        {
            title: '应打款额',
            dataIndex: 'shouldPayAmount',
            width: columnsWidth,
            render: text => AmountFormat(text),
        },
        {
            title: '实际打款额',
            dataIndex: 'actualPayAmount',
            width: columnsWidth,
            render: text => AmountFormat(text),
        },
        {
            title: '绑定银行卡',
            dataIndex: 'cardNo',
            width: columnsWidth,
        },
        {
            title: '银行卡号',
            dataIndex: 'bankCard',
            width: columnsWidth,
        },
        {
            title: '打款渠道',
            dataIndex: 'payChannel',
            width: columnsWidth,
        },
        // {
        //     title: '生效时间',
        //     dataIndex: 'orderCreateTime',
        //     width: columnsWidth,
        // },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: columnsWidth,
        },
        {
            title: '打款时间',
            dataIndex: 'successTime',
            width: columnsWidth,
        },
        {
            title: '打款状态',
            dataIndex: 'status',
            width: columnsWidth,
        },
    ];

    // statusShow = (text) => {
    //     let showText = '';
    //     if (text === 0) {
    //         showText = '打款失败'
    //     } else if (text === 1) {
    //         showText = '打款成功'
    //     }
    //     return showText;
    // }

    // loanStatusShow = (text) => {
    //     let showText = '';
    //     for (let item of this.state.loanStatus) {
    //         if (item.code === text) {
    //             showText = item.name;
    //         }
    //     }
    //     return showText;
    // }

    // payChannelShow = (text) => {
    //     let showText = '';
    //     for (let item of this.state.channelArr) {
    //         if (item.id === text) {
    //             showText = item.channelName;
    //         }
    //     }
    //     return showText;
    // }

    productNameShow = (text) => {
        let textShow = '';
        let allLoanProduct = this.state.allLoanProduct;
        for (let item of allLoanProduct) {
            if (item.id === text) {
                textShow = item.name;
            }
        }
        return textShow;
    }

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                
                values.successStartTime = values.successStartTime ? values.successStartTime.format(DateFormat) : undefined;
                values.successEndTime = values.successEndTime ? values.successEndTime.format(DateFormat) : undefined;
                values.orderCreateStartTime = values.orderCreateStartTime ? values.orderCreateStartTime.format(DateFormat) : undefined;
                values.orderCreateEndTime = values.orderCreateEndTime ? values.orderCreateEndTime.format(DateFormat) : undefined;
                values.createStartTime = values.createStartTime ? values.createStartTime.format(DateFormat) : undefined;
                values.createEndTime = values.createEndTime ? values.createEndTime.format(DateFormat) : undefined;
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
            const {code, message: msg, data} = await Http.payRecordList(params);
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

    _allLoanProduct = async () => {
        try {
            const {code, message: msg, data} = await Http.allLoanProduct();
            if (code === 200) {
                this.setState({allLoanProduct: data});
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
            const {code, message: msg, data} = await Http.payRecordExport({...params});
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
        const {statusArr, loading, data, pagination, channelArr, loanStatus, allLoanProduct} = this.state;
        const {clientHeight} = document.body;
        const tableHeight = clientHeight - 150;
        return (
            <div className='pay-record-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='打款列表'
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
                                <Form.Item {...FormItemLayout} label='借款金额' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('orderStartAmount', {
                                        rules: [{required: false, message: '请输入起始借款金额'}],
                                    })(
                                        <Input
                                            style={{width: '46%'}}
                                            placeholder='请输入起始借款金额'
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
                                    {getFieldDecorator('orderEndAmount', {
                                        rules: [{required: false, message: '请输入结束借款金额'}],
                                    })(
                                        <Input
                                            style={{width: '46%'}}
                                            placeholder='请输入结束借款金额'
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='申请时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('orderCreateStartTime', {
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
                                    {getFieldDecorator('orderCreateEndTime', {
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
                            {/* <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='生效时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('orderReviewStartTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            showTime
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
                                    {getFieldDecorator('orderReviewEndTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            showTime
                                            format={DateFormat}
                                            style={{width: '46%'}}
                                            placeholder='选择结束时间'
                                        />
                                    )}
                                </Form.Item>
                            </Col> */}
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='打款流水号' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('flowId', {
                                        rules: [{required: false, message: '请输入'},
                                        ],
                                    })(
                                        <Input placeholder='请输入打款流水号'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='银行卡号' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('cardNo', {
                                        rules: [{required: false, message: '请输入'},
                                        ],
                                    })(
                                        <Input placeholder='请输入银行卡号'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='创建时间' style={{marginBottom: '0px'}}>
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
                                <Form.Item {...FormItemLayout} label='打款时间' style={{marginBottom: '0px'}}>
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
                                <Form.Item {...FormItemLayout} label='借款产品' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('productId', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            {allLoanProduct.map((item,index)=>
                                                <Option key={item.id} value={item.id}>{item.name}</Option>
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='借款状态' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('orderStatus', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            {loanStatus.map(i => <Option value={i.code} key={i.code}>{i.name}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='打款渠道' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('payChannel', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            {channelArr.map(i => <Option value={i.id} key={i.id}>{i.channelName}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            {/* <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='打款渠道类型' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('online', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择'>
                                            <Option value={1}>线上</Option>
                                            <Option value={0}>线下</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col> */}
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='打款状态' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('status', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                                {statusArr.map(i => <Option value={i.id} key={i.id}>{i.name}</Option>)}
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
