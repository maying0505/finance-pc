/**
 * @desc 每日各时段数据对比
 * */
import React from 'react';
import {TitleLine, Http,  DownloadFile} from '../../components';
import {ROOT_URL} from '../../utils';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table} from 'antd';
import {ColConfig, GetNowFormatDate, PageSize} from '../../config';
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

class Main extends React.Component {

    state = {
        pagination: {pageSize: PageSize, showTotal: total => `共${total}条`},
        loading: false,
        visible: false,
        data: [],
        startTime: GetNowFormatDate('0',0),
        endTime: GetNowFormatDate('1',0),
        params: {}
    };

    componentDidMount() {
        this._handleSubmit();
    }

    columns = [
        {
            title: '日期',
            dataIndex: 'createDate',
        },
        {
            title: '小时',
            dataIndex: 'period',
        },
        {
            title: '注册人数',
            dataIndex: 'registerCount',
        },
        {
            title: '认证人数',
            dataIndex: 'certificationCount',
        },
        {
            title: '认证完成人数占比',
            dataIndex: 'certificationCompleteCountRate',
        },
        {
            title: '申请借款人数',
            dataIndex: 'applyLoanCount',
        },
        {
            title: '借款成功人数',
            dataIndex: 'loanCompleteCount',
        },
        {
            title: '还款人数',
            dataIndex: 'loanGive',
        },
    ];

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
            this.setState({
                params
            })
            const {code, message: msg, data} = await Http.dailyPeriodList(params);
            
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
            const {code, message: msg, data} = await Http.dailyPeriodExcel({...params});
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
        const {loading, data, pagination, startTime, endTime} = this.state;
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='每日各时段数据对比'
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
                    />
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
