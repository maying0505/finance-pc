/**
 * @desc还款管理借款列表
 * */
import React from 'react';
import './RepaymentLoanList.less';
import {TitleLine, Http, DownloadFile} from '../../components';
import {ROOT_URL} from '../../utils';
import {Button, Col, Form, Input, Row, DatePicker, Select, message, Spin, Table} from 'antd';
import {ColConfig, PageSize, AmountFormat, InterestRateFormat, allowClear} from '../../config';
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
        auditStatus: [],
        allLoanProduct: [],
        loanStatus: [],
        params: {},
    };

    componentDidMount() {
        this._handleSubmit();
        this._allStatus();
        this._allLoanProduct();
    }

    columns = [
        {
            title: '借款订单号',
            dataIndex: 'id',
            
        },
        {
            title: '借款人姓名',
            dataIndex: 'userName',
            
        },
        {
            title: '认证号码',
            dataIndex: 'mobile',
            
        },
        {
            title: '申请时间',
            dataIndex: 'createTime',
            
        },
        {
            title: '放款时间',
            dataIndex: 'loanTime',
            
        },
        {
            title: '借款金额',
            dataIndex: 'orderAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '借款产品',
            dataIndex: 'productId',
            render: (text) => <span>{this.productNameShow(text)}</span>
            
        },
        {
            title: '应还时间',
            dataIndex: 'shouldRepayTime',
            
        },
        {
            title: '利息',
            dataIndex: 'interest',
            render: text => AmountFormat(text),
        },
        {
            title: '手续费',
            dataIndex: 'serviceFee',
            render: text => AmountFormat(text),
        },
        {
            title: '是否逾期',
            dataIndex: 'isOverdue',
            render: (text, record) => text === 0 && text && <span>{text === 0 ? '是' : '否'}</span>
        },
        {
            title: '逾期天数',
            dataIndex: 'overdueDay',
            
        },
        {
            title: '逾期罚息利率',
            dataIndex: 'overdueFeeRate',
            render: text => InterestRateFormat(text),
        },
        {
            title: '逾期金额',
            dataIndex: 'overdueFee',
            render: text => AmountFormat(text),
        },
        {
            title: '借款状态',
            dataIndex: 'status',
            
        },
        {
            title: '应还金额',
            dataIndex: 'shouldRepayAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '实还金额',
            dataIndex: 'actualRepayAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '退款金额',
            dataIndex: 'refundAmount',
            render: text => AmountFormat(text),
        },
        {
            title: '剩余未还金额',
            dataIndex: 'createTime1',
            render: (text, record) => record.shouldRepayAmount && record.actualRepayAmount && <span>{AmountFormat(record.shouldRepayAmount)-AmountFormat(record.actualRepayAmount)}</span>
        },
        {
            title: '结清日期',
            dataIndex: 'actualFinishTime',
            
        }
    ];

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
                values.createStartTime = values.createStartTime ? values.createStartTime.format(DateFormat) : undefined;
                values.createEndTime = values.createEndTime	? values.createEndTime.format(DateFormat) : undefined;
                values.loanStartTime = values.loanStartTime ? values.loanStartTime.format(DateFormat) : undefined;
                values.loanEndTime = values.loanEndTime ? values.loanEndTime.format(DateFormat) : undefined;
                values.shouldRepayStartTime = values.shouldRepayStartTime ? values.shouldRepayStartTime.format(DateFormat) : undefined;
                values.shouldRepayEndTime = values.shouldRepayEndTime	? values.shouldRepayEndTime.format(DateFormat) : undefined;
                values.actutalFinishStartTime = values.actutalFinishStartTime ? values.actutalFinishStartTime.format(DateFormat) : undefined;
                values.actutalFinishEndTime = values.actutalFinishEndTime ? values.actutalFinishEndTime.format(DateFormat) : undefined;
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
            const {code, message: msg, data} = await Http.payLoanList(params);
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
            const {code, message: msg, data} = await Http.payLoanListExport({...params});
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
        const {loading, data, pagination, loanStatus, allLoanProduct} = this.state;
        const {clientHeight} = document.body;
        const tableHeight = clientHeight - 150;
        return (
            <div className='repayment-loan-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='借款列表'
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
                                    {getFieldDecorator('startAmount', {
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
                                    {getFieldDecorator('endAmount', {
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
                                <Form.Item {...FormItemLayout} label='放款时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('loanStartTime', {
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
                                    {getFieldDecorator('loanEndTime', {
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
                                <Form.Item {...FormItemLayout} label='是否逾期' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('isOverdue', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            <Option value={1}>是</Option>
                                            <Option value={0}>否</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='应还时间' style={{marginBottom: '0px'}}>
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
                                <Form.Item {...FormItemLayout} label='结清时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('actutalFinishStartTime', {
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
                                    {getFieldDecorator('actutalFinishEndTime', {
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
                                <Form.Item {...FormItemLayout} label='借款状态' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('status', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            {loanStatus.map(i => <Option value={i.code}>{i.name}</Option>)}
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
                        scroll={{x: 2220}}
                    />
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
