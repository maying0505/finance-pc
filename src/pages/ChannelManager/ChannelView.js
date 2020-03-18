/**
 * @desc 合作机构渠道观测
 * */
import React from 'react';
import {TitleLine, Http} from '../../components';
import {Button, Col, Form, Row, message, Spin, Table, Select, DatePicker} from 'antd';
import {ColConfig} from '../../config';

const DateFormat = 'YYYY-MM-DD';
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
const Option = Select.Option;

class Main extends React.Component {

    state = {
        loading: false,
        data: [],
        allChannel: []
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
            title: '注册数量',
            dataIndex: 'registerNum',
        },
        {
            title: '认证完成数量',
            dataIndex: 'authNum',
        },
        {
            title: '申请数量',
            dataIndex: 'applyNum',
        },
        {
            title: '放款数量',
            dataIndex: 'loanNum',
        },
    ];

    _allChannel = async () => {
        this.setState({loading: true});
        try {
            const {code, message: msg, data} = await Http.channelViewUserChannels();
            let dataArr = [];
            if (code === 200) {
                if (Array.isArray(data)) {
                    dataArr = data;
                    this.props.form.setFieldsValue({
                        channel: dataArr[0] && dataArr[0]['id'] ? dataArr[0]['id'] : '',
                    });
                }
                
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            this.setState({
                allChannel: dataArr,
            },function(){
                this._handleSubmit();
            });
        } catch (e) {
            this.setState({loading: false});
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
            const params = {
                ...queryObj,
            };
            this.setState({loading: true});
            const {code, message: msg, data} = await Http.channelView(params);
            if (code === 200) {
                this.setState({
                    data: data ? data : [],
                });
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            this.setState({
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
        let dataArr = this.state.allChannel;
        this.props.form.setFieldsValue({
            channel: dataArr[0] && dataArr[0]['id'] ? dataArr[0]['id'] : '',
        });
        this.setState({queryObj: {}}, () => {
            this._handleSubmit();
        });
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const { allChannel, loading, data} = this.state;
        
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='合作机构渠道观测'
                        icon='yonghu'
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='渠道' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('channel', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <Select placeholder="请选择">
                                            {allChannel.map((item,idenx) =>
                                                <Option key={item.id}value={item.id}>{item.name}</Option>
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='日期' style={{marginBottom: '0px'}}>
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
                        pagination={false}
                        loading={loading}
                    />
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
