/**
 * @desc 渠道列表
 * */
import React from 'react';
import {TitleLine, Http} from '../../components';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table, Input, Select} from 'antd';
import {ColConfig} from '../../config';
import EditChannel from './EditChannel';

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

let ItemArr1 = [{id: 0, label: '渠道名称', field: 'name', disabled: false, required: true},
    {id: 1, label: '渠道组', type:'select', values: [], field: 'providerId', disabled: false, required: true},
    {id: 2, label: '结算类型', type:'select', values: [], field: 'type', disabled: false, required: true},
    {id: 3, label: '单价', field: 'price', disabled: false, required: true},
    {id: 4, label: '商户', type:'select', values: [], field: 'merchId', disabled: false, required: true},
    {id: 5, label: '状态', type:'select', values: [{name: '停用',id: '0'},{name: '启用',id: '1'},{name: '禁用',id: '2'}], field: 'statusStr', disabled: false, required: true},
    {id: 6, label: '产品', type:'select', values: [], field: 'productId', disabled: false, required: true},
    {id: 7, label: '额度下限', type:'number', field: 'minCreditLimit', disabled: false, required: true},
    {id: 8, label: '额度增加步长', type:'number', field: 'creditLimitIncStep', disabled: false, required: true},
    {id: 9, label: '额度上限', type:'number', field: 'maxCreditLimit', disabled: false, required: true},
    {id: 10, label: '新户风控', field: 'newUserRiskControl', disabled: false, required: true},
    {id: 11, label: '老户风控', field: 'oldUserRiskControl', disabled: false, required: true},
];
let ItemArr2 = [ItemArr1[0],ItemArr1[1],ItemArr1[2],ItemArr1[3],ItemArr1[4],
    {id: 5, label: '状态', type:'select', values: [{name: '启用',id: '1'}], field: 'statusStr', disabled: true, required: true, value: '1'},
    ItemArr1[6],ItemArr1[7],ItemArr1[8],ItemArr1[9],ItemArr1[10],ItemArr1[11]
];

class Main extends React.Component {

    state = {
        loading: false,
        title: '',
        httpUrl: ()=>{},
        data: [],
        allSettleType: [],
        allProvider: [],
        allMerch: [],
        allProduct: [],
        ItemArr: [],
        channelVisible: false,
        channelId: ''
    };

    componentDidMount() {
        this._allSettleTypeGet();//获取所有结算类型
        this._allProviderGet();//获取所有渠道组
        this._allMerchGet();//获取所有商户
        this._allProduct();//获取所有产品
        this._handleSubmit();
    }

    columns = [
        {
            title: '渠道ID',
            dataIndex: 'id',
        },
        {
            title: '渠道编码',
            dataIndex: 'code',
        },
        {
            title: '渠道名称',
            dataIndex: 'name',
        },
        {
            title: '渠道组',
            dataIndex: 'providerName',
        },
        {
            title: '结算类型',
            dataIndex: 'type',
        },
        {
            title: '单价（元）',
            dataIndex: 'price',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            render: (text) => text && text[0] + '-' + text[1] + '-' + text[2] + ' ' + text[3] + ':' + text[4] + ':' + text[5]
        },
        {
            title: '下线时间',
            dataIndex: 'disableTime',
            render: (text) => text && text[0] + '-' + text[1] + '-' + text[2] + ' ' + text[3] + ':' + text[4] + ':' + text[5]
        },
        {
            title: '状态',
            dataIndex: 'statusStr',
        },
        {
            title: '额度下限',
            dataIndex: 'minCreditLimit',
        },
        {
            title: '额度增加步长',
            dataIndex: 'creditLimitIncStep',
        },
        {
            title: '额度上限',
            dataIndex: 'maxCreditLimit',
        },
        {
            title: '新用户风控',
            dataIndex: 'newUserRiskControl',
        },
        {
            title: '老用户风控',
            dataIndex: 'oldUserRiskControl',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 80,
            render: (text, record) => <a onClick={() => this._handleChannelVisible(false,true,record.id,0)}>编辑</a>,
        },
    ];

    _showDetail =(loanTime) => {
        this.setState({
            visible: true
        })
    };

    _allProduct = async () => {
        try {
            const {code, message: msg, data} = await Http.allProduct();
            let dataArr = [];
            if (code === 200) {
                if (Array.isArray(data)) {
                    dataArr = data;
                }
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            ItemArr1[6]['values'] = dataArr;
            this.setState({
                allProduct: dataArr,
            });
        } catch (e) {
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };


    _allMerchGet = async () => {
        try {
            const {code, message: msg, data} = await Http.allMerch();
            let dataArr = [];
            if (code === 200) {
                if (Array.isArray(data)) {
                    dataArr = data;
                }
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            ItemArr1[4]['values'] = dataArr;
            this.setState({
                allMerch: dataArr,
            });
        } catch (e) {
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _allProviderGet  = async () => {
        try {
            const {code, message: msg, data} = await Http.allProvider();
            let dataArr = [];
            if (code === 200) {
                if (Array.isArray(data)) {
                    dataArr = data;
                }
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            ItemArr1[1]['values'] = dataArr;
            this.setState({
                allProvider: dataArr,
            });
        } catch (e) {
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };


    _allSettleTypeGet  = async () => {
        try {
            const {code, message: msg, data} = await Http.allSettleType();
            let dataArr = [];
            if (code === 200) {
                if (Array.isArray(data)) {
                    dataArr = data;
                }
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            ItemArr1[2]['values'] = dataArr;
            this.setState({
                allSettleType: dataArr,
            });
        } catch (e) {
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
                values.endDisableTime = values.endDisableTime ? values.endDisableTime.format(DateFormat) : undefined;
                values.startDisableTime = values.startDisableTime ? values.startDisableTime.format(DateFormat) : undefined;
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
            };
            const {code, message: msg, data} = await Http.channelList(params);
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

    _handleChannelVisible = (Reset,stateValue,id,type) => {
        if (Reset) {
            this._handleReset();
        } 
        if (stateValue) {
            let title = '';
            let httpUrl = '';
            let ItemArr = [];
            let channelId = '';
            if (type === 0) {
                title = '编辑渠道';
                ItemArr = ItemArr1;
                
            } else if (type === 1) {
                title = '添加渠道';
                ItemArr = ItemArr2;
            } 
            httpUrl = Http.saveChannel;
            
            channelId = id;
            this.setState({ItemArr,title,httpUrl,channelId},function(){
                this.setState({channelVisible: stateValue});
            });
        } else {
            this.setState({channelVisible: stateValue});
        }
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {channelId, ItemArr, allProvider, loading, data, channelVisible, title, httpUrl, allSettleType} = this.state;
        
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='渠道列表'
                        icon='yonghu'
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='渠道' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('channelCode', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Input placeholder="渠道编号/渠道名称"/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='渠道组' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('providerId', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder="请选择" allowClear>
                                            {allProvider.map((item,idenx) =>
                                                <Option key={item.id}value={item.id}>{item.name}</Option>
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='结算类型' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('type', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder="请选择" allowClear>
                                            {allSettleType.map((item,idenx) =>
                                                <Option key={item.type}value={item.type}>{item.value}</Option>
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='创建时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('startTime', {
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
                                <Form.Item {...FormItemLayout} label='下线时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('startDisableTime', {
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
                                    {getFieldDecorator('endDisableTime', {
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
                                    type="primary"
                                    onClick={() => this._handleChannelVisible(false,true,'',1)}
                                >
                                    添加渠道
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
                        pagination={false}
                        loading={loading}
                    />
                </Spin>
                <EditChannel
                    visible={channelVisible}
                    ItemArr={ItemArr}
                    title={title}
                    httpUrl={httpUrl}
                    channelId={channelId}
                    handleCancel={this._handleChannelVisible}
                />
            </div>
        )
    }
}

export default Form.create()(Main);
