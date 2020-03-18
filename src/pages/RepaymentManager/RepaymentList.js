/**
 * @desc还款管理还款计划列表
 * */
import React from 'react';
import './RepaymentList.less';
import {TitleLine, Http, DownloadFile} from '../../components';
import {ROOT_URL} from '../../utils';
import {Modal, Button, Col, Form, Input, Row, DatePicker, Select, message, Spin, Table} from 'antd';
import {ColConfig, PageSize, AmountFormat, allowClear} from '../../config';
import PartRepay from './PartRepay';
import Discount from './Discount';
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

const ItemArr1 = [
    {id: 0, label: '应还金额（元）', field: 'shouldRepayAmount', disabled: true, required: false},
    {id: 1, label: '实际已还金额（元）', field: 'actualRepayAmount', disabled: true, required: false},
    {id: 2, label: '本次还款金额（元）', field: 'amount', disabled: false, required: true},
    {id: 3, label: '还款方式', field: 'payChannel', disabled: false, required: true},
    {id: 4, label: '流水号', field: 'flowId', disabled: false, required: true},
    {id: 5, label: '还款备注', field: 'remark', disabled: false, required: false},
];
const ItemArr2 = [
    {id: 0, label: '应还金额（元）', field: 'shouldRepayAmount', disabled: true, required: false},
    {id: 1, label: '实际已还金额（元）', field: 'actualRepayAmount', disabled: true, required: false},
    {id: 2, label: '本次还款金额（元）', field: 'amount', disabled: false, required: true},
    {id: 3, label: '还款方式', field: 'payChannel', disabled: false, required: true},
    {id: 4, label: '还款备注', field: 'remark', disabled: false, required: false},
];
const ItemArr3 = [
    {id: 0, label: '应还金额（元）', field: 'shouldRepayAmount', disabled: true, required: false},
    {id: 1, label: '实际已还金额（元）', field: 'actualRepayAmount', disabled: true, required: false},
    {id: 2, label: '减免金额（元）', field: 'amount', disabled: false, required: true},
    {id: 4, label: '备注', field: 'remark', disabled: false, required: true},
];

class Main extends React.Component {

    state = {
        pagination: {pageSize: PageSize, showTotal: total => `共${total}条`},
        loading: false,
        queryObj: {},
        params: {},
        auditStatus: [],
        loanStatus: [],
        visible: false,
        discountVisible: false,
        partRepayVisible: false,
        repaymentId: undefined,
        shouldRepayAmount: undefined,
        actualRepayAmount: undefined,
        userId: undefined,
        id: undefined,
        title: '',
        httpUrl: ''
    };

    componentDidMount() {
        this._handleSubmit();
        this._allStatus();
    }

    columns = [
        {
            title: '还款ID',
            dataIndex: 'id',
            
        },
        {
            title: '借款ID',
            dataIndex: 'orderId',
            
        },
        {
            title: '借款人ID',
            dataIndex: 'userId',
            
        },
        {
            title: '借款人姓名',
            dataIndex: 'userName',
            
        },
        {
            title: '借款人手机号码',
            dataIndex: 'mobile',
            
        },
        {
            title: '本金',
            dataIndex: 'principal',
            render: text => AmountFormat(text),
        },
        {
            title: '利息',
            dataIndex: 'interest',
            render: text => AmountFormat(text),
        },
        {
            title: '滞纳金',
            dataIndex: 'overdueFee',
            render: text => AmountFormat(text),
        },
        {
            title: '已还金额',
            dataIndex: 'actualRepayAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '放款日期',
            dataIndex: 'orderLoanTime',
            
        },
        {
            title: '应还日期',
            dataIndex: 'shouldRepayTime',
            
        },
        {
            title: '实还日期',
            dataIndex: 'actualRepayTime',
            
        },
        {
            title: '是否逾期',
            dataIndex: 'isOverdue',
            
        },
        {
            title: '逾期天数',
            dataIndex: 'overdueDay',
            
        },
        {
            title: '备注',
            dataIndex: 'remark',
            
        },
        {
            title: '状态',
            dataIndex: 'status',
            
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            fixed: 'right',
            render: (text, record) => record.payStatus !== 2 && 
                <span>
                    <a style={{marginRight: '10px'}} onClick={() => this._handlePartRepayVisible(false,true,AmountFormat(record.shouldRepayAmount),AmountFormat(record.actualRepayAmount),record.userId,record.id,0)}>部分还</a>
                    {/* <Button size="small" onClick={() => this._handleDiscountVisible(false,true,record.id)}>减免还款</Button> */}
                    <a onClick={() => this._handlePartRepayVisible(false,true,AmountFormat(record.shouldRepayAmount),AmountFormat(record.actualRepayAmount),record.userId,record.id,2)}>减免还</a></span> 
        },
    ];

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                values.shouldRepayStartTime = values.shouldRepayStartTime ? values.shouldRepayStartTime.format(DateFormat) : undefined;
                values.shouldRepayEndTime = values.shouldRepayEndTime ? values.shouldRepayEndTime.format(DateFormat) : undefined;
                values.actualRepayStartTime = values.actualRepayStartTime ? values.actualRepayStartTime.format(DateFormat) : undefined;
                values.actualRepayEndTime = values.actualRepayEndTime ? values.actualRepayEndTime.format(DateFormat) : undefined;
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
            const {code, message: msg, data} = await Http.repayLoanList(params);
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
            const {code, message: msg, data} = await Http.repayLoanListExport({...params});
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

    _handleDiscountVisible = (Reset,stateValue,repaymentId) => {
        if (Reset) {
            this._handleReset();
        } 
        if (stateValue) {
            this.setState({repaymentId},function(){
                this.setState({discountVisible: stateValue});
            });
        } else {
            this.setState({discountVisible: stateValue});
        }
    }

    _handlePartRepayVisible = (Reset,stateValue,shouldRepayAmount,actualRepayAmount,userId,id,type) => {
        if (Reset) {
            this._handleReset();
        } 
        if (stateValue) {
            let title = '';
            let httpUrl = '';
            let ItemArr = [];
            if (type === 0) {
                title = '部分还款';
                httpUrl = Http.partialRepayment;
                ItemArr = ItemArr1;
            } else if (type === 1) {
                title = '置为已还款';
                httpUrl = Http.finishRepayment;
                ItemArr = ItemArr2;
            } else {
                title = '减免还款';
                httpUrl = Http.discountDo;
                ItemArr = ItemArr3;
            }
            this.setState({ItemArr, shouldRepayAmount, actualRepayAmount,userId,id,title,httpUrl},function(){
                this.setState({partRepayVisible: stateValue});
            });
        } else {
            this.setState({partRepayVisible: stateValue});
        }
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {ItemArr, discountVisible, repaymentId, title, httpUrl, userId, id, loading, data, pagination, partRepayVisible, shouldRepayAmount, actualRepayAmount} = this.state;
        return (
            <div className='repayment-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='还款计划列表'
                        icon='yonghu'
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='还款ID' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('repaymentId', {
                                        rules: [{required: false, message: '还款ID'},
                                        ],
                                    })(
                                        <Input placeholder='还款ID'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='借款ID' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('orderId', {
                                        rules: [{required: false, message: '借款ID'},
                                        ],
                                    })(
                                        <Input placeholder='借款ID'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='借款人' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('userName', {
                                        rules: [{required: false, message: '姓名或手机号'},
                                        ],
                                    })(
                                        <Input placeholder='借款人'/>
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
                                            <Option value={0}>还款中</Option>
                                            <Option value={2}>还款完成</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='逾期天数' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('overdueMinDay', {
                                        rules: [{required: false, message: '请输入起始逾期天数'}],
                                    })(
                                        <Input
                                            style={{width: '46%'}}
                                            placeholder='请输入起始逾期天数'
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
                                    {getFieldDecorator('overdueMaxDay', {
                                        rules: [{required: false, message: '请输入结束逾期天数'}],
                                    })(
                                        <Input
                                            style={{width: '46%'}}
                                            placeholder='请输入结束逾期天数'
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='应还日期' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('shouldRepayStartTime', {
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
                                    {getFieldDecorator('shouldRepayEndTime', {
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
                                <Form.Item {...FormItemLayout} label='实还日期' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('actualRepayStartTime', {
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
                                    {getFieldDecorator('actualRepayEndTime', {
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
                                <Form.Item {...FormItemLayout} label='是否逾期' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('isOverdue', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            <Option value='1'>是</Option>
                                            <Option value='0'>否</Option>
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
                    <PartRepay
                        visible={partRepayVisible}
                        shouldRepayAmount={shouldRepayAmount}
                        actualRepayAmount={actualRepayAmount}
                        ItemArr={ItemArr}
                        id={id}
                        userId={userId}
                        title={title}
                        httpUrl={httpUrl}
                        handleCancel={this._handlePartRepayVisible}
                    />
                    <Discount
                        visible={discountVisible}
                        repaymentId={repaymentId}
                        handleCancel={this._handleDiscountVisible}
                    />
                    
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
