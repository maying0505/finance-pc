/**
 * @desc 来电登记问题反馈
 * */
import React from 'react';
import {TitleLine, Http, HandleModal} from '../../components';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table, Input} from 'antd';
import {ColConfig, PageSize} from '../../config';
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

const DateFormat = 'YYYY-MM-DD HH:mm:ss';

class Main extends React.Component {

    state = {
        type: 0,
        visible: false,
        ItemArr: [
            {id: 0, label: '姓名', field: 'name', disabled: false, required: true},
            {id: 1, label: '联系方式', field: 'mobile', disabled: false, required: true},
            {id: 2, label: '登记时间', field: 'createTime', type: 'date', disabled: false, required: true},
            {id: 3, label: '来电登记内容', field: 'callContent', disabled: false, required: true},
            {id: 4, label: '短信发送内容', field: 'messageContent', disabled: false, required: true},
        ],
        httpUrl: Http.rollCallSave,
        title: '新增登记',
        pagination: {pageSize: PageSize, showTotal: total => `共${total}条`},
        loading: false,
        data: [],
        statusArr: [
            {
                id: 0,
                name: '未处理'
            },
            {
                id: 1,
                name: '已处理'
            },
            {
                id: 2,
                name: '已忽略'
            }
        ],
    };

    componentDidMount() {
        this._handleSubmit();
    }

    columns = [
        {
            title: '用户ID',
            dataIndex: 'userId',
        },
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '联系方式',
            dataIndex: 'mobile',
        },
        {
            title: '登记时间',
            dataIndex: 'createTime',
        },
        {
            title: '来电登记内容',
            dataIndex: 'callContent',
        },
        {
            title: '短信发送内容',
            dataIndex: 'messageContent',
        },
    ];

    statusShow = (text) => {
        let typeArr = this.state.statusArr;
        for (let item of typeArr) {
            if(item.id === text) {
                return item.name
            }
        }
    }

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
                type: 1,
                typeTwo: 1
            };
            const {code, message: msg, data} = await Http.rollCallList(params);
            let dataArr = [];
            const {pagination} = this.state;
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

    _handleVisible = (Reset,stateValue) => {
        if (Reset) {
            this._handleReset();
        } 
        this.setState({visible: stateValue});
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {type, loading, data, statusArr, pagination, visible, id, ItemArr, httpUrl, title} = this.state;
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='来电登记问题反馈'
                        icon='yonghu'
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='用户' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('userId')(
                                        <Input placeholder='用户ID/姓名/联系方式'/>
                                    )}
                                   
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='登记时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('startTime', {
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
                                    {getFieldDecorator('endTime', {
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
                                    className="right"
                                    htmlType="button"
                                    onClick={()=>this._handleVisible(false,true)}
                                >
                                    新增登记
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
                    />
                    <HandleModal
                        visible={visible}
                        ItemArr={ItemArr}
                        id={id}
                        title={title}
                        type={type}
                        httpUrl={httpUrl}
                        handleCancel={this._handleVisible}
                    />
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
