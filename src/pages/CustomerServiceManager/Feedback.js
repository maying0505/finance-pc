/**
 * @desc 意见反馈
 * */
import React from 'react';
import {TitleLine, Http, HandleModal} from '../../components';
import {Button, Col, Form, Row, DatePicker, message, Spin, Table, Select, Input} from 'antd';
import {ColConfig, allowClear, PageSize} from '../../config';

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
        type: -1,
        visible: false,
        id: '', 
        ItemArr: [],
        httpUrl: '',
        title: '',
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
            title: '创建时间',
            dataIndex: 'createTime',
        },
        {
            title: '意见反馈内容',
            dataIndex: 'content',
        },
        {
            title: '备注',
            dataIndex: 'result',
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (text) => <span>{this.statusShow(text)}</span>
        },
        {
            title: '操作',
            dataIndex: 'id',
            render: (text, record) => record.status === 0 && <div>
                    <span className="orange-color" onClick={() => this._handleVisible(false,true,text,1)}>忽略</span>
                    <span className="orange-color" onClick={() => this._handleVisible(false,true,text,0)}>处理</span>
                </div>
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
                values.createTime = values.createTime ? values.createTime.format(DateFormat) : undefined;
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
            const {code, message: msg, data} = await Http.personalSearchOpinion(params);
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

    _handleVisible = (Reset,stateValue,id,type) => {
        if (Reset) {
            this._handleReset();
        } 
        if (stateValue) {
            let httpUrl = '';
            let title = '';
            let ItemArr = [];
            if (type === 1) {
                ItemArr= [];
                httpUrl= Http.personalIgnore;
                title= '确认忽略？';
            } else {
                ItemArr= [
                    {id: 0, label: '请填写处理备注', field: 'remark', disabled: false, required: true},
                ];
                httpUrl= Http.personalProcess;
                title= '意见反馈处理';
            }
            this.setState({type,id,httpUrl,title,ItemArr},function(){
                this.setState({visible: stateValue});
            });
        } else {
            this.setState({visible: stateValue});
        }
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {type, loading, data, statusArr, pagination, visible, id, ItemArr, httpUrl, title} = this.state;
        return (
            <div className='audit-first-trial-refuse-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='意见反馈'
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
                                <Form.Item {...FormItemLayout} label='创建时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('createTime', {
                                        rules: [{required: false, message: '请选择'}],
                                    })(
                                        <DatePicker
                                            style={{width: '100%'}}
                                            format={DateFormat}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='状态' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('status', {
                                        rules: [{required: false, message: '请选择'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            {statusArr.map(i => <Option value={i.id} key={i.id}>{i.name}</Option>)}
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
