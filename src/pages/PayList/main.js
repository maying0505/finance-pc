/**
 * @Desc 还款列表
 * */
import React from 'react';
import './index.less';
import {TitleLine, Http} from '../../components';
import {Button, Col, Form, Input, Row, DatePicker, Select, message, Table} from 'antd';
import {ColConfig, PageSize, StateArr, InterestRateFormat, allowClear} from '../../config';
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

const {RangePicker} = DatePicker;
const DateFormat = 'YYYY-MM-DD HH:mm';
const Option = Select.Option;

class Main extends React.Component {

    state = {
        data: [],
        pagination: {pageSize: PageSize, showTotal: total => `共${total}条`},
        loading: false,
        pageIndex: 1,
        queryObj: {},
        caseSource: [],
        overdueStage: [],
        loadDay: [],
        overdueUser: [],
    };

    componentDidMount() {
        this._handleSubmit();
        this._dictByType();
        this._dictByTypeLoadDay();
        this._myDivisionOverdueStage();
        this._overdueUser();
    }

    columns = [
        {
            title: '案件ID',
            dataIndex: 'id',
        },
        {
            title: '案件来源',
            dataIndex: 'orderSource',
        },
        {
            title: '借款订单号',
            dataIndex: 'orderId',
        },
        {
            title: '借款人姓名',
            dataIndex: 'name',
        },
        {
            title: '认证号码',
            dataIndex: 'phone',
        },
        {
            title: '放款时间',
            dataIndex: 'loanTime',
        },
        {
            title: '借款金额',
            dataIndex: 'principal',
        },
        {
            title: '借款产品',
            dataIndex: 'productId',
        },
        {
            title: '应还时间',
            dataIndex: 'planFeeTime',
        },
        {
            title: '利息',
            dataIndex: 'interests',
        },
        {
            title: '手续费',
            dataIndex: 'counterFee',
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
            title: '逾期时段',
            dataIndex: 'stageName',
        },
        {
            title: '逾期罚息利率',
            dataIndex: 'lateFeeApr',
            render: text => InterestRateFormat(text),
        },
        {
            title: '逾期金额',
            dataIndex: 'lateFee',
        },
        {
            title: '还款状态',
            dataIndex: 'states',
        },
        {
            title: '应还金额',
            dataIndex: 'totalMoney',
        },
        {
            title: '实还金额',
            dataIndex: 'trueTotalMoney',
        },
        {
            title: '剩余未还金额',
            dataIndex: 'remainingMoeny',
        },
        {
            title: '结清日期',
            dataIndex: 'settleTime',
        },
        {
            title: '最近跟进日期',
            dataIndex: 'nearestDate',
        },
        {
            title: '查看',
            dataIndex: 'review',
            render: (text, record) => {
                const {id: caseId} = record;
                return (
                    <a
                        href="javascript:;"
                        onClick={() => this._onDetail({caseId})}
                    >
                        详情
                    </a>

                )
            },
        },
    ];

    _onDetail = ({caseId}) => {
        this.props.history.push(`/main/divisionDetail/${caseId}`)
    };

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {loanTime, planFeeTime, settleTime, operatorTime, ...rest} = values;
                const params = {};
                const addParams = (timeArr, keyA, keyB) => {
                    if (timeArr) {
                        Object.assign(params, {
                            [keyA]: moment(timeArr[0]).format(DateFormat),
                            [keyB]: moment(timeArr[1]).format(DateFormat),
                        });
                    }
                };
                addParams(loanTime, 'loanTimeBegin', 'loanTimeEnd');
                addParams(planFeeTime, 'planFeeTimeBegin', 'planFeeTimeEnd');
                addParams(settleTime, 'settleTimeBegin', 'settleTimeEnd');
                addParams(operatorTime, 'operatorTimeBegin', 'operatorTimeEnd');
                const queryObj = {
                    ...rest,
                    ...params,
                };
                console.log('queryObj', queryObj);
                this.setState({queryObj});
                this._myDivisionList(1, queryObj);
            }
        });
    };

    _myDivisionList = async (pageIndex, params = this.state.queryObj) => {
        try {
            this.setState({loading: true});
            const {pagination} = this.state;
            const newParams = {
                ...params,
                pageSize: PageSize,
                pageNo: pageIndex,
            };
            const {errcode, errmsg, data} = await Http.payList(newParams);
            let dataArr = [];
            if (errcode === 0) {
                const {total, rows} = data;
                pagination.total = total;
                if (Array.isArray(rows)) {
                    dataArr = rows;
                }
            } else {
                const msg = errmsg ? errmsg : '请求服务失败';
                message.error(msg);
            }
            this.setState({
                pageIndex,
                pagination,
                data: dataArr,
                loading: false,
            });
        } catch (e) {
            this.setState({loading: false});
            message.error('请求服务异常');
        }
    };

    _dictByType = async () => {
        try {
            const {errcode, errmsg, data} = await Http.dictByType({type: 'order_source'});
            if (errcode === 0) {
                this.setState({caseSource: data});
            } else {
                const msg = errmsg ? errmsg : '请求服务失败';
                message.error(msg);
            }
        } catch (e) {
            message.error('请求服务异常');
        }
    };

    _dictByTypeLoadDay = async () => {
        try {
            const {errcode, errmsg, data} = await Http.dictByType({type: 'loan_day'});
            if (errcode === 0) {
                this.setState({loadDay: data});
            } else {
                const msg = errmsg ? errmsg : '请求服务失败';
                message.error(msg);
            }
        } catch (e) {
            message.error('请求服务异常');
        }
    };

    _myDivisionOverdueStage = async () => {
        try {
            const {errcode, errmsg, data} = await Http.myDivisionOverdueStage();
            if (errcode === 0) {
                this.setState({overdueStage: data});
            } else {
                const msg = errmsg ? errmsg : '请求服务失败';
                message.error(msg);
            }
        } catch (e) {
            message.error('请求服务异常');
        }
    };

    _overdueUser = async () => {
        try {
            const {errcode, errmsg, data} = await Http.overdueUser();
            if (errcode === 0) {
                this.setState({overdueUser: data});
            } else {
                const msg = errmsg ? errmsg : '请求服务失败';
                message.error(msg);
            }
        } catch (e) {
            message.error('请求服务异常');
        }
    };

    _handleReset = () => {
        const {form: {resetFields}} = this.props;
        resetFields();
        this.setState({queryObj: {}}, () => {
            this._myDivisionList(1);
        });
    };

    _handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        }, () => {
            this._myDivisionList(pagination.current);
        });
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {data, pagination, loading, caseSource, overdueStage, loadDay, overdueUser} = this.state;
        const {clientHeight} = document.body;
        const tableHeight = clientHeight - 420;
        return (
            <div>
                <TitleLine
                    title='还款列表'
                    icon='edit-1-copy'
                />
                <Form onSubmit={this._handleSubmit} className='pay-list'>
                    <Row>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='借款人' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('name', {
                                    rules: [{required: false, message: '请输入借款人订单号/姓名/认证号码'},
                                    ],
                                })(
                                    <Input placeholder="借款人订单号/姓名/认证号码"/>
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='借款金额' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('minPrincipal', {
                                    rules: [{required: false, message: '请输入最小借款金额'}],
                                })(
                                    <Input
                                        style={{width: '46%'}}
                                        placeholder='最小金额'
                                    />
                                )}
                                <span style={{
                                    width: '8%',
                                    lineHeight: '32px',
                                    textAlign: 'center',
                                    color: 'rgba(0, 0, 0, 0.45)',
                                    display: 'inline-block',
                                }}>~
                                </span>
                                {getFieldDecorator('maxPrincipal', {
                                    rules: [{required: false, message: '请输入最大借款金额'}],
                                })(
                                    <Input
                                        style={{width: '46%'}}
                                        placeholder='最大金额'
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='放款时间' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('loanTime', {
                                    rules: [{required: false, message: '请选择放款时间'}],
                                })(
                                    <RangePicker
                                        style={{width: '100%'}}
                                        format="YYYY-MM-DD"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='借款产品' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('productId', {
                                    rules: [{required: false, message: '请选择借款产品'}],
                                })(
                                    <Select placeholder='请选择借款产品' allowClear={allowClear}>
                                        {loadDay.map(i => <Option value={i.value}>{i.label}</Option>)}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='是否逾期' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('isOverdue', {
                                    rules: [{required: false, message: '请选择是否逾期'}],
                                })(
                                    <Select placeholder='请选择是否逾期' allowClear={allowClear}>
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='应还时间' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('planFeeTime', {
                                    rules: [{required: false, message: '应还时间'}],
                                })(
                                    <RangePicker
                                        style={{width: '100%'}}
                                        format="YYYY-MM-DD"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='结清时间' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('settleTime', {
                                    rules: [{required: false, message: '添加时间'}],
                                })(
                                    <RangePicker
                                        style={{width: '100%'}}
                                        format="YYYY-MM-DD"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='还款状态' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('states', {
                                    rules: [{required: false, message: '请选择还款状态'}],
                                })(
                                    <Select placeholder='请选择还款状态' allowClear={allowClear}>
                                        {StateArr.map(i => <Option key={i[0]} value={i[0]}>{i[1]}</Option>)}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='逾期时段' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('overdueStageId', {
                                    rules: [{required: false, message: '请选择逾期时段'}],
                                })(
                                    <Select placeholder='请选择逾期时段' allowClear={allowClear}>
                                        {overdueStage.map(i => <Option value={i.id}>{i.stageName}</Option>)}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='最近跟进日期' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('operatorTime', {
                                    rules: [{required: false, message: '最近跟进日期'}],
                                })(
                                    <RangePicker
                                        style={{width: '100%'}}
                                        format="YYYY-MM-DD"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='催收员' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('userOverdue', {
                                    rules: [{required: false, message: '请输入催收员'},
                                    ],
                                })(
                                    <Select placeholder='请选择逾期时段' allowClear={allowClear}>
                                        {overdueUser.map(i => <Option value={i.id}>{i.name}</Option>)}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='案件ID' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('id', {
                                    rules: [{required: false, message: '请输入案件ID'},
                                    ],
                                })(
                                    <Input placeholder="请输入案件ID"/>
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...ColConfig}>
                            <Form.Item {...FormItemLayout} label='案件来源' style={{marginBottom: '0px'}}>
                                {getFieldDecorator('orderSource', {
                                    rules: [{required: false, message: '请选择案件来源'}],
                                })(
                                    <Select placeholder='请选择案件来源' allowClear={allowClear}>
                                        {
                                            caseSource.map(i => {
                                                return (
                                                    <Option key={i.value} value={i.value}>{i.label}</Option>
                                                )
                                            })
                                        }
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
                    // scroll={{x: 2300}}
                />
            </div>
        )
    }
}

const PayListForm = Form.create()(Main);
export default PayListForm;