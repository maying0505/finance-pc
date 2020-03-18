/**
 * @desc 渠道还款数据列表
 * */
import React from 'react';
import {TitleLine, Http,  DownloadFile} from '../../components';
import {ROOT_URL} from '../../utils';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table, Select} from 'antd';
import {ColConfig, GetNowFormatDate, allowClear} from '../../config';
import moment from 'moment';

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

class Main extends React.Component {

    state = {
        userType: -1,
        loading: false,
        visible: false,
        data: [],
        params: {},
        channelArr: [],
        userTypeArr: [
            {id: -1,name:'汇总'},
            {id: 0,name:'新用户'},
            {id: 1,name:'老用户'},
        ],
        start: GetNowFormatDate('0',6),
        end: GetNowFormatDate('1',0)
    };

    componentDidMount() {
        this._allChannel();     
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
            title: '用户类型',
            dataIndex: 'userType',
            render: (text) => <span>{this.userTypeShow(text)}</span>
        },
        {
            title: '放款单数',
            dataIndex: 'loanNum',
        },
        {
            title: '应还款单数（不算当天）',
            dataIndex: 'repayNum',
        },
        {
            title: '已还单数',
            dataIndex: 'repayedNum',
        },
        {
            title: '首逾单数',
            dataIndex: 'overdue0Num',
        },
        {
            title: '首逾金额',
            dataIndex: 'overdue0Amount',
        },
        {
            title: '首逾率',
            dataIndex: 'overdue0Rate',
        },
        {
            title: '逾期单数',
            dataIndex: 'overdue1Num',
        },
        {
            title: '逾期金额',
            dataIndex: 'overdue1Amount',
        },
        {
            title: '逾期率',
            dataIndex: 'overdue1Rate',
        },
    ];

    userTypeShow = (text) => {
        let textShow = null;
        let userTypeArr = this.state.userTypeArr;
        for (let item of userTypeArr) {
            if (item.id == text) {
                textShow = item.name;
            }
        }
        return textShow;
    }

    _allChannel = async () => {
        try {
            const {code, message: msg, data} = await Http.allChannel();
            if (code === 200) {
                if (Array.isArray(data)) {
                    this.setState({
                        channelArr: data,
                    },function(){
                        this.props.form.setFieldsValue({
                            channelId: data[0] ? data[0]['id'] :''
                        });
                        this._handleSubmit();
                    });
                }
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

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                values.start = values.start ? values.start.format(DateFormat) : undefined;
                values.end = values.end ? values.end.format(DateFormat) : undefined;
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
            this.setState({
                params
            })
            const {code, message: msg, data} = await Http.channelRepaymentList(params);
            
            let dataArr = [];
            if (code === 200) {
                if (data && data.data && Array.isArray(data.data)) {
                    dataArr = data.data;
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

    _handleExport = async () => {
        try {
            const {params} = this.state;
            const {code, message: msg, data} = await Http.channelRepaymentListExcel({...params});
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
        const {loading, data, channelArr, userTypeArr, end, start, userType} = this.state;
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='渠道还款数据列表'
                        icon='yonghu'
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='日期' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('start', {
                                        initialValue: moment(start, DateFormat),
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
                                    {getFieldDecorator('end', {
                                        initialValue: moment(end, DateFormat),
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
                                    {getFieldDecorator('channelId', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            {channelArr.map(i => <Option value={i.id}>{i.name}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='用户类型' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('userType', {
                                        initialValue: userType,
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            {userTypeArr.map(i => <Option value={i.id}>{i.name}</Option>)}
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
                                {/* <Button
                                    className="right"
                                    htmlType="button"
                                    onClick={this._handleExport}
                                >
                                    导出Excel
                                </Button> */}
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
            </div>
        )
    }
}

export default Form.create()(Main);
