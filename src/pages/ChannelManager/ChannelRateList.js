/**
 * @desc 渠道流量配置
 * */
import React from 'react';
import {TitleLine, Http} from '../../components';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table, Input, Select} from 'antd';
import {ColConfig, PageSize} from '../../config';
import AddChannelRate from './AddChannelRate';

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

let ItemArr = [{id: 0, label: '渠道', type:'select', values: [], field: 'name', disabled: false, required: true},
    {id: 1, label: '渠道组', type:'select', values: [], field: 'providerId', disabled: true, required: false},
    {id: 2, label: '结算类型', type:'select', values: [], field: 'type', disabled: true, required: false},
    {id: 3, label: '单价', field: 'price', disabled: true, required: false},
    {id: 4, label: '扣量比例', field: 'ratio', disabled: false, required: true},
    {id: 5, label: '状态', type:'select', values: [{name: '停用',id: '0'},{name: '启用',id: '1'},{name: '禁用',id: '2'}], field: 'statusStr', disabled: true, required: false},
    {id: 6, label: '备注', field: 'remark', disabled: false, required: true},
];


class Main extends React.Component {

    state = {
        pagination: {pageSize: PageSize, showTotal: total => `共${total}条`},
        loading: false,
        httpUrl: '',
        data: [],
        allSettleType: [],
        allProvider: [],
        allChannel: [],
        ItemArr: [],
        channelVisible: false,
    };

    componentDidMount() {
        this._allSettleTypeGet();//获取所有结算类型
        this._allProviderGet();//获取所有渠道组
        this._allChannelGet();//获取所有渠道
        this._handleSubmit();
    }

    columns = [
        {
            title: '渠道',
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
            title: '状态',
            dataIndex: 'statusStr',
        },
        {
            title: '扣量比例',
            dataIndex: 'ratio',
        },
        {
            title: '备注',
            dataIndex: 'remark',
        },
    ];

    _showDetail =(loanTime) => {
        this.setState({
            visible: true
        })
    };

    _allChannelGet  = async () => {
        try {
            const {code, message: msg, data} = await Http.allChannel();
            let dataArr = [];
            if (code === 200) {
                if (Array.isArray(data)) {
                    dataArr = data;
                }
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            ItemArr[0]['values'] = dataArr;
            this.setState({
                allChannel: dataArr,
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
            ItemArr[1]['values'] = dataArr;
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
            ItemArr[2]['values'] = dataArr;
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
            const {code, message: msg, data} = await Http.ratelist(params);
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

    _handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        }, () => {
            this._fetchData(pagination.current);
        });
    };

    _handleReset = () => {
        const {form: {resetFields}} = this.props;
        resetFields();
        this.setState({queryObj: {}}, () => {
            this._fetchData(1);
        });
    };

    _handleChannelVisible = (Reset,stateValue) => {
        if (Reset) {
            this._handleReset();
        } 
        if (stateValue) {
            this.setState({ItemArr},function(){
                this.setState({channelVisible: stateValue});
            });
        } else {
            this.setState({channelVisible: stateValue});
        }
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {pagination, ItemArr, allProvider, loading, data, channelVisible, allSettleType} = this.state;
        
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='渠道流量配置'
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
                                <Form.Item {...FormItemLayout} label='扣量比例' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('ratio', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Input placeholder="扣量比例"/>
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
                                    onClick={() => this._handleChannelVisible(false,true)}
                                >
                                    添加渠道流量
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
                    />
                </Spin>
                <AddChannelRate
                    visible={channelVisible}
                    ItemArr={ItemArr}
                    handleCancel={this._handleChannelVisible}
                />
            </div>
        )
    }
}

export default Form.create()(Main);
