/**
 * @desc 用户列表
 * */
import React from 'react';
import './index.less';
import {TitleLine, Http, HandleModal} from '../../components';
import {Button, Col, Form, Input, Row, DatePicker, Select, message, Spin, Table} from 'antd';
import {ColConfig, PageSize, allowClear} from '../../config';
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
    {id: 0, label: '状态更改', type:'select', values: [{name: '启用',id: 1},{name: '禁用',id: 0},{name: '拉黑',id: 2}], field: 'status', disabled: false, required: true},
];
const ItemArr2 = [
    {id: 0, label: '可再借时间', type:'select', values: [{name: '随时可借',id: -1},{name: '永不再借',id: -2},{name: '1天后',id: 1},{name: '3天后',id: 3},{name: '7天后',id: 7},{name: '15天后',id: 15},{name: '30天后',id: 30},{name: '90天后',id: 90},{name: '180天后',id: 180},{name: '365天后',id: 365}], field: 'day', disabled: false, required: true},
];

class Main extends React.Component {

    state = {
        pagination: {pageSize: PageSize, showTotal: total => `共${total}条`},
        loading: false,
        userId: '',
        queryObj: {},
        channelArr: [],
        type: 0,
        visible: false,
        ItemArr: [],
        httpUrl: '',
        title: '',
    };

    componentDidMount() {
        this._handleSubmit();
        this._allChannel();
    }

    columns = [
        {
            title: '用户ID',
            dataIndex: 'id',
        },
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '性别',
            dataIndex: 'gender',
        },
        {
            title: '出生年月',
            dataIndex: 'birthday',
        },
        {
            title: '认证号码',
            dataIndex: 'mobile',
        },
        {
            title: '渠道',
            dataIndex: 'channelName',
        },
        {
            title: '认证完成',
            dataIndex: 'auth',
        },
        {
            title: '申请借款',
            dataIndex: 'applyLoan',
        },
        {
            title: '初审状态',
            dataIndex: 'firstAduitStatus',
            render: (text) => <span>{this.aduitStatusShow(text)}</span>
        },
        {
            title: '复审状态',
            dataIndex: 'checkAduitStatus',
            render: (text) => <span>{this.aduitStatusShow(text)}</span>
        },
        {
            title: '注册时间',
            dataIndex: 'createTime',
        },
        {
            title: '首次借款时间',
            dataIndex: 'firstLoanTime',
        },
        {
            title: '首借成功时间',
            dataIndex: 'firstLoanSuccessTime',
        },
        {
            title: '借款成功次数',
            dataIndex: 'loanSuccessCount',
        },
        {
            title: '用户属性',
            dataIndex: 'userAttrInfo',
        },
        {
            title: '最近一次借款状态',
            dataIndex: 'lastLoanStatus',
            render: (text) => <span>{this.lastLoanStatusShow(text)}</span>
        },
        {
            title: '是否有逾期',
            dataIndex: 'whetherOverdue',
            render: (text) => <span>{this.whetherOverdueShow(text)}</span>
        },
        {
            title: '借款中',
            dataIndex: 'loan',
            render: (text) => <span>{this.whetherOverdueShow(text)}</span>
        },
        {
            title: '逾期中',
            dataIndex: 'overdue',
            render: (text) => <span>{this.whetherOverdueShow(text)}</span>
        },
        {
            title: '用户状态',
            dataIndex: 'status',
        },
        {
            title: '可再借时间',
            dataIndex: 'canLoanDay',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 200,
            fixed: 'right',
            render: (text, record) => <div>
                                <span className="orange-color" onClick={() => this._handleVisible(false,true,record.id,record.status,record.canLoanDay,1)}>名单状态更改</span>
                                <span className="orange-color" onClick={() => this._handleVisible(false,true,record.id,record.status,record.canLoanDay,2)}>重置可再借时间</span>
                            </div>
        },
    ];

    whetherOverdueShow = (text) => {
        if (text === 1) {
            return '是'
        } else if (text === 0) {
            return '否'
        }
    }

    lastLoanStatusShow = (text) => {
        if (text === 0) {
            return '失败'
        } else if (text === 1) {
            return '成功'
        }
    }

    aduitStatusShow = (text) => {
        if (text === 0) {
            return '拒绝'
        } else if (text === 1) {
            return '通过'
        }
    }

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.createStartTime = values.createStartTime ? values.createStartTime.format(DateFormat) : undefined;
                values.createEndTime = values.createEndTime ? values.createEndTime.format(DateFormat) : undefined;
                values.firstLoanStartTime = values.firstLoanStartTime ? values.firstLoanStartTime.format(DateFormat) : undefined;
                values.firstLoanEndTime = values.firstLoanEndTime ? values.firstLoanEndTime.format(DateFormat) : undefined;
                values.firstLoanSuccessStartTime = values.firstLoanSuccessStartTime ? values.firstLoanSuccessStartTime.format(DateFormat) : undefined;
                values.firstLoanSuccessEndTime = values.firstLoanSuccessEndTime ? values.firstLoanSuccessEndTime.format(DateFormat) : undefined;
                console.log('values', values);
                this.setState({queryObj: values});
                this._fetchData(1, values);
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
            const {code, message: msg, data} = await Http.userList(params);
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

    _handleVisible = (Reset,stateValue,userId,status,canLoanDay,type) => {
        if (Reset) {
            this._handleReset();
        } 
        if (stateValue) {
            let httpUrl = '';
            let title = '';
            let ItemArr = [];
            if (type === 1) {
                ItemArr= ItemArr1;
                httpUrl= Http.changeUserStats;
                title= '名单状态更改';
            } else {
                ItemArr= ItemArr2;
                httpUrl= Http.changeCanLoanTime;
                title= '重置可再借时间';
            }
            this.setState({userId,httpUrl,title,ItemArr},function(){
                this.setState({visible: stateValue});
            });
        } else {
            this.setState({visible: stateValue});
        }
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {loading, data, pagination, channelArr, visible, userId, ItemArr, httpUrl, title, type} = this.state;
        const {clientHeight} = document.body;
        const tableHeight = clientHeight - 375;

        return (
            <div className='user-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='用户列表'
                        icon='yonghu'
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='用户信息' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('userInfo', {
                                        rules: [{required: false, message: '用户名ID/姓名/认证号码'},
                                        ],
                                    })(
                                        <Input placeholder='用户名ID/姓名/认证号码'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='性别' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('gender', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            <Option value='1'>男</Option>
                                            <Option value='0'>女</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='渠道' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('channelId', {
                                        rules: [{required: false, message: '请输入'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            {channelArr.map(i => <Option value={i.id} key={i.id}>{i.name}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='注册时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('createStartTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            format={DateFormat}
                                            style={{width: '46%'}}
                                            placeholder='选择开始日期'
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
                                            placeholder='选择结束日期'
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='认证完成' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('auth', {
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
                                <Form.Item {...FormItemLayout} label='申请借款' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('applyLoan', {
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
                                <Form.Item {...FormItemLayout} label='初审状态' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('firstAduitStatus', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            <Option value='1'>通过</Option>
                                            <Option value='0'>拒绝</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='首次借款时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('firstLoanStartTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            format={DateFormat}
                                            style={{width: '46%'}}
                                            placeholder='选择开始日期'
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
                                    {getFieldDecorator('firstLoanEndTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                                            format={DateFormat}
                                            style={{width: '46%'}}
                                            placeholder='选择结束日期'
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='复审状态' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('checkAduitStatus', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            <Option value='1'>通过</Option>
                                            <Option value='0'>拒绝</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='借款成功次数' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('loanSuccessCountStart', {
                                        rules: [{required: false, message: '请输入最小借款金额'}],
                                    })(
                                        <Input
                                            style={{width: '46%'}}
                                            placeholder='起始次数'
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
                                    {getFieldDecorator('loanSuccessCountEnd', {
                                        rules: [{required: false, message: '请输入最大借款金额'}],
                                    })(
                                        <Input
                                            style={{width: '46%'}}
                                            placeholder='结束次数'
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='用户属性' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('userAttrInfo', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            <Option value={0}>新用户</Option>
                                            <Option value={1}>老用户</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='首借成功时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('firstLoanSuccessStartTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            format={DateFormat}
                                            style={{width: '46%'}}
                                            placeholder='选择开始日期'
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
                                    {getFieldDecorator('firstLoanSuccessEndTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                                            format={DateFormat}
                                            style={{width: '46%'}}
                                            placeholder='选择结束日期'
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='最近一次借款状态' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('lastLoanStatus', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            <Option value='1'>成功</Option>
                                            <Option value='0'>失败</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='是否逾期' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('whetherOverdue', {
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
                                <Form.Item {...FormItemLayout} label='借款中' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('loan', {
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
                                <Form.Item {...FormItemLayout} label='逾期中' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('overdue', {
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
                                <Form.Item {...FormItemLayout} label='用户状态' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('status', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            <Option value={1}>启用</Option>
                                            <Option value={0}>禁用</Option>
                                            <Option value={2}>拉黑</Option>
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
                        scroll={{ x: 2000}}
                    />
                    <HandleModal
                        visible={visible}
                        ItemArr={ItemArr}
                        id={userId}
                        title={title}
                        httpUrl={httpUrl}
                        handleCancel={this._handleVisible}
                        type={type}
                        style={'user'}
                    />
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
