/**
 * @desc还款管理支付宝还款记录列表
 * */
import React from 'react';
import './RepayRecordAlipayList.less';
import {TitleLine, Http, DownloadFile} from '../../components';
import {ROOT_URL} from '../../utils';
import {Upload, Icon, Button, Col, Form, Input, Row, DatePicker, Modal, message, Spin, Table, Select} from 'antd';
import {ColConfig, PageSize, AmountFormat, allowClear} from '../../config';
import ModifyRemark from './ModifyRemark';
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
const confirm = Modal.confirm;
const Option = Select.Option;

class Main extends React.Component {

    state = {
        pagination: {pageSize: PageSize, showTotal: total => `共${total}条`},
        loading: false,
        queryObj: {},
        auditStatus: [],
        params: {},
        loanStatus: [],
        remarkVisible: false,
        id: '',
        remark: '',
        fileList: [],
        visible: false,
        loadingUpload: false,
    };

    componentDidMount() {
        this._handleSubmit();
        this._allStatus();
    }

    columns = [
        {
            title: '订单ID',
            dataIndex: 'id',
            
        },
        {
            title: '支付宝流水',
            dataIndex: 'orderId',
            
        },
        {
            title: '支付宝账号',
            dataIndex: 'accountNo',
            
        },
        {
            title: '用户姓名',
            dataIndex: 'accountName',
            
        },
        {
            title: '支付金额',
            dataIndex: 'amount',
            render: text => AmountFormat(text),
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: text => this.statusShow(text),
            
        },
        {
            title: '支付时间',
            dataIndex: 'payTime',
            
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            
        },
        {
            title: '备注',
            dataIndex: 'remark',
            
        },
        {
            title: '原因',
            dataIndex: 'result',
            
        },
        {
            title: '最后操作人',
            dataIndex: 'creator',
            
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 200,
            render: (text, record) => <span>
                {record.status === 0 && <a style={{marginRight: '10px'}} onClick={() => this._handleFinish(record.id)}>置为已处理</a>}
                {record.status === 2 && <a style={{marginRight: '10px'}} onClick={()=> this._handleAgain(record.id)}>重新处理</a>}
                {(record.status === 0 || record.status === 2) && <a onClick={() => this._handleRemarkVisible(false,true,record.id,record.remark)}>修改备注</a>}
            </span>
        },
    ];

    statusShow = (text) => {
        let showText = null;
        switch (text) {
            case 0: showText = '未处理';break;
            case 1: showText = '处理成功';break;
            case 2: showText = '处理失败';break;
            default: showText = '';
        }
        return showText;
    };

    _handleAgain = (id) => {
        let that = this;
        confirm({
            title: '重新处理？',
            content: '',
            onOk() {
                that.againSubmit(id);
            },
            onCancel() {},
          });
    }

    _handleFinish = (id) => {
        let that = this;
        confirm({
            title: '是否置为已处理？',
            content: '',
            onOk() {
                that.finishSubmit(id);
            },
            onCancel() {},
          });
    }

    againSubmit = async (id) => {
        try {
            this.setState({loading: true});
            const {code, message: msg, data} = await Http.alipayAgain({id});
            if (code === 200) {
                message.success('操作成功');
                this._handleReset();
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            this.setState({loading: false});
        } catch (e) {
            console.log('e', e);
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    finishSubmit = async (id) => {
        try {
            this.setState({loading: true});
            const {code, message: msg, data} = await Http.alipayFinish({id});
            if (code === 200) {
                message.success('操作成功');
                this._handleReset();
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            this.setState({loading: false});
        } catch (e) {
            console.log('e', e);
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _handleRemarkVisible = (Reset,stateValue,id,remark) => {
        if (Reset) {
            this._handleReset();
        } 
        if (stateValue) {
            remark = remark ? remark : '';
            this.setState({id,remark},function(){
                this.setState({remarkVisible: stateValue});
            });
        } else {
            this.setState({remarkVisible: stateValue});
        }
    };

    _handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                values.payStartTime = values.payStartTime ? values.payStartTime.format(DateFormat) : undefined;
                values.payEndTime = values.payEndTime	? values.payEndTime.format(DateFormat) : undefined;
                this.setState({queryObj: values});
                this._fetchData(1, values);
            }
        });
    };

    _fetchData = async (pageNum, queryObj = this.state.queryObj) => {
        try {
            this.setState({loading: true});
            const params = {
                size: PageSize,
                current: pageNum,
                ...queryObj,
            };
            this.setState({params: params});
            const {code, message: msg, data} = await Http.repayRecordAlipayList(params);
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
                pageIndex: pageNum,
            });
        } catch (e) {
            console.log('e', e);
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _allStatus = async () => {
        try {
            const {code, message: msg, data} = await Http.allStatus();
            if (code === 200) {
                this.setState({
                    loanStatus: data ? data : [],
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

    _handleExport = async () => {
        try {
            const {params} = this.state;
            const {code, message: msg, data} = await Http.repayRecordAlipayListExport({...params});
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

    showModal = () => {
        this.setState({
          visible: true,
        });
    };

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            fileList: [],
            visible: false
        });
    };

    beforeUpload = (file) => {
        this.setState(state => ({
            fileList: [file],
        }));
        return false;
    };
    onRemove = (file) => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
    };

    // _downloadTemplate = () => { //下载导入模板
    //     DownloadFile(cADownloadTemplate);
    // };

    handleOk = (e) => {
        console.log(e);
        this.setState({
            loadingUpload: true
        },function(){
            this._submit();
        })
    };

    _submit = async () => { //导入-提交
        console.log(this.state.fileList)
        if (this.state.fileList.length < 1) {
            message.warning('请先选择文件!');
            this.setState({
                loadingUpload: false
            })
            return;
        }
        try {
            const {code, message: msg, data} = await Http.alipayImport({
                excelfile: this.state.fileList
            });
            this.setState({
                loadingUpload: false,
            })
            if (code === 200) {
                message.success('提交成功!');
                this.handleCancel();
                this.handleFormReset();
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            
        } catch (e) {
            this.setState({
                loadingUpload: false
            })
        }
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {loading, data, pagination, remarkVisible, id, remark} = this.state;
        const {clientHeight} = document.body;
        const tableHeight = clientHeight - 150;
        return (
            <div className='repay-record-alipay-list'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='支付宝还款记录列表'
                        icon='yonghu'
                    />
                    <Form onSubmit={this._handleSubmit}>
                        <Row>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='订单ID' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('orderId', {
                                        rules: [{required: false, message: '订单ID'},
                                        ],
                                    })(
                                        <Input placeholder='订单ID'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='支付宝流水' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('alipayOrderId', {
                                        rules: [{required: false, message: '支付宝流水'},
                                        ],
                                    })(
                                        <Input placeholder='支付宝流水'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='用户姓名' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('userName', {
                                        rules: [{required: false, message: '用户姓名'},
                                        ],
                                    })(
                                        <Input placeholder='用户姓名'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='状态' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('status', {
                                        rules: [{required: false, message: '状态'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            <Option value={0}>未处理</Option>
                                            <Option value={1}>处理成功</Option>
                                            <Option value={2}>处理失败</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='支付时间' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('payStartTime', {
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
                                    }}>至
                                </span>
                                    {getFieldDecorator('payEndTime', {
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
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='支付宝账户' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('accountNo', {
                                        rules: [{required: false, message: '支付宝账户'},
                                        ],
                                    })(
                                        <Input placeholder='支付宝账户'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...ColConfig}>
                                <Form.Item {...FormItemLayout} label='备注' style={{marginBottom: '0px'}}>
                                    {getFieldDecorator('remark', {
                                        rules: [{required: false, message: '备注'},
                                        ],
                                    })(
                                        <Input placeholder='备注'/>
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
                                <Button onClick={this.showModal} type="primary"><span>导入</span></Button>
                                {/* <Button
                                    type="primary"
                                    className="add-refund"
                                >
                                    新增退款
                                </Button> */}
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
                        // scroll={{x: 2000}}
                    />
                    <ModifyRemark
                        visible={remarkVisible}
                        id={id}
                        remark={remark}
                        handleCancel={this._handleRemarkVisible}
                    />
                    <Modal
                            wrapClassName = "download_template"
                            title="导入"
                            destroyOnClose={true}
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            cancelText="取消"
                            okText= {'提交'}
                            width={'520px'}
                            >
                            <Spin spinning={this.state.loadingUpload}>
                                <div>
                                    {/* <Button onClick={this._downloadTemplate} type="primary">下载导入模板</Button> */}
                                    <span>
                                        <Upload 
                                            name= 'file'
                                            onRemove={this.onRemove}
                                            fileList={this.state.fileList}
                                            beforeUpload={this.beforeUpload}
                                        >
                                            <Button>
                                            <Icon type="upload" /> 选择文件
                                            </Button>
                                        </Upload>
                                    </span>
                                </div>
                            </Spin>
                        </Modal>
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
