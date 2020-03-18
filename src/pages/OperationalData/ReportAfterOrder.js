/**
 * @desc 每日复借数据统计
 * */
import React from 'react';
import {TitleLine, Http} from '../../components';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table, Select} from 'antd';
import {ColConfig, allowClear, GetNowFormatDate, PageSize} from '../../config';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import ReportAfterUser from './ReportAfterUser';
import './index.less';

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
        pagination: {pageSize: PageSize, showTotal: total => `共${total}条`},
        loading: false,
        visible: false,
        dataX: [],
        dataY: [],
        data: [],
        queryObj: {},
        channelArr: [],
        loadingChart: true,
        startTime: GetNowFormatDate('0',0),
        endTime: GetNowFormatDate('1',0),
        isF: false
    };

    componentDidMount() {
        this._allChannel();
        this._afterPeoplePayment();
        this._handleSubmit();
    }

    columns = [
        {
            title: '日期',
            dataIndex: 'createDate',
        },
        {
            title: '渠道',
            dataIndex: 'channelName',
        },
        {
            title: '借款成功单数',
            dataIndex: 'orderCount',
        },
        {
            title: '复借成功单数',
            dataIndex: 'afterOrderCount',
        },
        {
            title: '复借率',
            dataIndex: 'afterLoanRate',
            render: (text) => text + '%'
        },
    ];

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                values.startTime = values.startTime ? values.startTime.format(DateFormat) : undefined;
                values.endTime = values.endTime ? values.endTime.format(DateFormat) : undefined;
                this.setState({queryObj: values, isF: true});
                this._fetchData(1, values);
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

    _afterPeoplePayment = async () => {
        try {
            const {code, message: msg, data} = await Http.afterPeoplePayment();
            if (code === 200) {
                this.setState({
                    loadingChart: false,
                    dataX: data.x ? data.x : [],
                    dataY: data.y ? data.y : []
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

    _handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        }, () => {
            this._fetchData(pagination.current);
        });
    };

    _fetchData = async (pageNum, queryObj = this.state.queryObj) => {
        try {
            this.setState({loading: true});
            const {pagination} = this.state;
            const params = {
                current: pageNum,
                size: PageSize,
                ...queryObj,
            };
            const {code, message: msg, data} = await Http.afterOrderList(params);
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
                isF: false
            });
        } catch (e) {
            this.setState({loading: false, isF: false});
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
        const {isF, queryObj, pagination, loading, data, channelArr, startTime, endTime, loadingChart, dataX, dataY} = this.state;
        const option = {
            tooltip: {
                trigger: 'axis',
                formatter:function (params, ticket, callback) {
                    console.log(params)
                    return  `<div style="text-align: left">
                                <div>平台复借次数人数分布</div>
                              <div>${params[0].name}次：${params[0].value}</div>
                            </div>`
                  }
            },
            xAxis: {
                type: 'category',
                data: dataX,
                axisLabel: {
                    formatter: '{value} 次'
                }
            },
            yAxis: {
                type: 'value',
            },
            title: {
                left: 'center',
                text: '平台复借次数人数分布'
            },
            series: [{
                data: dataY,
                type: 'line',
                // itemStyle: {
                //     normal: {
                //         label: {
                //             show: true, //开启显示
                //             position: 'top', //在上方显示
                //             textStyle: { //数值样式
                //                 color: 'black',
                //                 fontSize: 16
                //             }
                //         }
                //     }
                // },
            }]
        };
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='每日复借数据统计'
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
                        pagination={pagination}
                        loading={loading}
                        onChange={this._handleTableChange}
                    />
                   
                    <ReactEcharts className="echart-box" showLoading={loadingChart} option={option} style={{height:'300px',width:'50%'}}/>
                    <ReportAfterUser queryObj={queryObj} isF={isF}/>
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
