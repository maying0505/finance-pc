/**
 * @desc 渠道数据汇总列表
 * */
import React from 'react';
import {TitleLine, Http} from '../../components';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table, Select} from 'antd';
import {ColConfig, allowClear, GetNowFormatDate} from '../../config';
import moment from 'moment';
import { func } from 'prop-types';

const Option = Select.Option;

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

class Main extends React.Component {

    state = {
        loading: false,
        visible: false,
        data: [],
        channelArr: [],
        startTime: GetNowFormatDate('0',0),
        endTime: GetNowFormatDate('1',0)
    };

    componentDidMount() {
        this._allChannel();
        this._handleSubmit();
    }

    columns = [
        {
            title: '日期',
            dataIndex: 'date',
        },
        {
            title: '渠道ID',
            dataIndex: 'channelId',
        },
        {
            title: '渠道',
            dataIndex: 'channelName',
        },
        {
            title: '注册人数',
            dataIndex: 'registerCount',
        },
        {
            title: '认证完成人数',
            dataIndex: 'authCount',
        },
        {
            title: '注册转化率（%）',
            dataIndex: 'registerRate',
        },
        {
            title: '转化静默人数',
            dataIndex: 'authNoCount',
        },
        {
            title: '申请借款人数',
            dataIndex: 'applyCount',
        },
        {
            title: '借款成功人数',
            dataIndex: 'successCount',
        },
        {
            title: '提交借款静默人数',
            dataIndex: 'authNotApplyCount',
        },
        {
            title: '新客批核率',
            dataIndex: 'firstSuccessRate',
        },
        {
            title: '借款率（%）',
            dataIndex: 'firstApplyRate',
        },
        // {
        //     title: '数据审核笔数',
        //     dataIndex: 'totalLoanMoney',
        // },
    ];

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                values.startTime = values.startTime ? values.startTime.format(DateFormat) : undefined;
                values.endTime = values.endTime ? values.endTime.format(DateFormat) : undefined;
                this.setState({
                    data: [],
                    queryObj: values
                },function(){
                    this._fetchData(values);
                });
            }
        });
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

    _fetchData = async (queryObj = this.state.queryObj) => {
        try {
            this.setState({loading: true});
            const params = {
                ...queryObj,
            };
            const {code, message: msg, data} = await Http.reportSummaryList(params);
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


    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {loading, data, channelArr, startTime, endTime} = this.state;
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='渠道数据汇总列表'
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
                                            {channelArr.map(i => <Option value={i.id}>{i.name}</Option>)}
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
                        rowKey='channelId'
                        dataSource={data}
                        loading={loading}
                        pagination={false}
                    />
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
