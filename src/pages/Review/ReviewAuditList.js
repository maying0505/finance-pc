/**
 * @desc 复审审核列表
 * */
import React from 'react';
import {TitleLine, Http} from '../../components';
import {Button, Col, Form, Input, Row, DatePicker, Select, message, Spin, Table, Icon} from 'antd';
import {ColConfig, PageSize, allowClear} from '../../config';
import './ReviewAuditList.less';
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
        aduitPerson: [],
        channelArr: [],
        userId: null,
        loanOrderId: null,
        noticeObj: {},
        allLoanProduct: []
    };

    componentDidMount() {
        this._allStatus();
        this._allAduitPerson();
        this._handleSubmit();
        this._allChannel();
        this._auditTrialNote();
        this._allLoanProduct();
    }

    columns = [
        {
            title: '借款订单号',
            dataIndex: 'loanOrderId',
            width: 80,
        },
        {
            title: '借款人姓名',
            dataIndex: 'loanName',
            width: 80,
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            width: 80,
        },
        {
            title: '身份证号',
            dataIndex: 'idNumber',
            width: 80,
        },
        {
            title: '借款金额',
            dataIndex: 'amount',
            width: 80,
        },
        {
            title: '借款产品',
            dataIndex: 'productId',
            width: 80,
            render: (text) => <span>{this.productNameShow(text)}</span>
        },
        {
            title: '渠道',
            dataIndex: 'channelName',
            width: 80,
        },
        {
            title: '注册时间',
            dataIndex: 'userCreateTime',
            width: 80,
        },
        {
            title: '申请时间',
            dataIndex: 'loanCreateTime',
            width: 80,
        },
        {
            title: '催收建议',
            dataIndex: 'collectionAdvise',
            width: 100,
        },
        {
            title: '操作',
            dataIndex: 'userId',
            width: 80,
            render: (text, record) => {
                const {loanOrderId, userId} = record;
                return (<span>
                            <a
                                href="javascript:;"
                                onClick={() => this._onDetail({userId, loanOrderId})}
                                style={{marginRight: '10px'}}
                            >
                                详情
                            </a>
                            
                        </span>
                )
            },
        },
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

    _allAduitPerson = async () => {
        try {
            const {code, message: msg, data} = await Http.allAduitPerson();
            if (code === 200) {
                this.setState({
                    aduitPerson: data,
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
                const {aduitStatus} = data;
                this.setState({
                    auditStatus: aduitStatus,
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

    _onDetail = ({userId, loanOrderId}) => {
        this.props.history.push(`/main/check-aduit/list/reviewDetail/${userId}/${loanOrderId}/1`);
    };

    

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                values.userCreateTimeStart = values.userCreateTimeStart ? values.userCreateTimeStart.format(DateFormat) : undefined;
                values.userCreateTimeEnd = values.userCreateTimeEnd ? values.userCreateTimeEnd.format(DateFormat) : undefined;
                values.loanCreateTimeStart = values.loanCreateTimeStart ? values.loanCreateTimeStart.format(DateFormat) : undefined;
                values.loanCreateTimeEnd = values.loanCreateTimeEnd ? values.loanCreateTimeEnd.format(DateFormat) : undefined;
                values.manReviewTimeStart = values.manReviewTimeStart ? values.manReviewTimeStart.format(DateFormat) : undefined;
                values.manReviewTimeEnd = values.manReviewTimeEnd ? values.manReviewTimeEnd.format(DateFormat) : undefined;
                this.setState({
                    queryObj: values,
                    data: []
                },function(){
                    this._fetchData(1, values);
                });
            }
        });
    };

    _fetchData = async (pageNum, queryObj = this.state.queryObj) => {
        try {
            this.setState({loading: true});
            const params = {
                current: pageNum,
                size: PageSize,
                ...queryObj,
            };
            const {code, message: msg, data} = await Http.auditCheckAuditList(params);
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
            });
        } catch (e) {
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

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

    changeState = (stateName, stateValue) => {
        this.setState({[stateName]: stateValue});
    };

    _auditTrialNote = async () => {
        try {
            const {code, message: msg, data} = await Http.checkAduitNotice();
            if (code === 200) {
                this.setState({noticeObj: data});
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
        const {noticeObj, loading, data, pagination, channelArr, allLoanProduct, aduitPerson, userId, loanOrderId} = this.state;
        const {clientHeight} = document.body;
        const tableHeight = clientHeight - 150;
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='复审审核列表'
                        icon='yonghu'
                        rightContent={() => {
                            return (
                                <div>
                                    <Icon
                                        type="sound"
                                        theme="filled"
                                        style={{fontSize: '16px', color: '#e0b788', marginRight: '10px'}}
                                    />
                                    今日待审核数量 <span style={{color: 'red'}}>{noticeObj.waitAduitCount ? noticeObj.waitAduitCount : 0}</span>，
                                    已审核数量 <span style={{color: 'red'}}>{noticeObj.aduitCount ? noticeObj.aduitCount : 0}</span>，
                                    审核通过数量 <span style={{color: 'red'}}>{noticeObj.aduitPassCount ? noticeObj.aduitPassCount : 0}</span>，
                                    审核拒绝数量 <span style={{color: 'red'}}>{noticeObj.aduitRefuseCount ? noticeObj.aduitRefuseCount : 0}</span>；
                                </div>
                            )
                        }}
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='借款人' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('loanPerson', {
                                        rules: [{required: false, message: '借款订单号/姓名/认证号码'},
                                        ],
                                    })(
                                        <Input placeholder='借款订单号/姓名/认证号码'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='借款金额' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('amountStart', {
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
                                    {getFieldDecorator('amountEnd', {
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
                                <Form.Item {...FormItemLayout} label='注册时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('userCreateTimeStart', {
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
                                    }}>
                                        至
                                    </span>
                                    {getFieldDecorator('userCreateTimeEnd', {
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
                                <Form.Item {...FormItemLayout} label='申请时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('loanCreateTimeStart', {
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
                                    {getFieldDecorator('loanCreateTimeEnd', {
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
                                <Form.Item {...FormItemLayout} label='复审时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('manReviewTimeStart', {
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
                                    {getFieldDecorator('manReviewTimeEnd', {
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
                                <Form.Item {...FormItemLayout} label='渠道' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('channelId', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            {channelArr.map(i => <Option key={i.id} value={i.id}>{i.name}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            {/* <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='审核状态' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('aduitStatus', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择'>
                                            {auditStatus.map(i => <Option key={i.code} value={i.code}>{i.name}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='审核人员' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('checkId', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择'>
                                            {aduitPerson.map(i => <Option key={i.id} value={i.id}>{i.name}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col> */}
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
                        pagination={pagination}
                        loading={loading}
                        onChange={this._handleTableChange}
                        // scroll={{x: 1800, y: tableHeight}}
                    />
                    
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
