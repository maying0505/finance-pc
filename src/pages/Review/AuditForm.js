import React from 'react';
import './AuditForm.less';
import PropTypes from 'prop-types';
import {Button, Col, Form, Input, Modal, Row, Spin, Select, message} from "antd";
import {Http} from '../../components';
import {ColConfig, StorageKeys, allowClear} from '../../config';
import {SessionStorage, LocalStorage} from '../../utils';

const ModalFormItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 4},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
    colon: false,
};

const ModalColConfig = {
    ...ColConfig,
    xs: 24,
    sm: 12,
    md: 12,
};

class Main extends React.PureComponent {

    static propTypes = {
        visible: PropTypes.bool.isRequired,
        handleCancel: PropTypes.func.isRequired,
        userId: PropTypes.string,
        orderId: PropTypes.string,
        type: PropTypes.number,
    };

    static defaultProps = {
        userId: null,
        orderId: null,
        type: 0
    };

    state = {
        visible: false,
        loading: false,
        checkCodeArr: [],
        initialValue: {},
        orderId: null,
        userId: null,
        ifPass: true
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.visible !== this.props.visible) {
            if (nextProps.visible) {
                const {userId, orderId} = nextProps;
                this.setState({
                    orderId: orderId,
                    userId: userId
                },function(){
                    this._detailGet();
                })
            }
            this.setState({
                visible: nextProps.visible
            });
        }
    }

    componentDidMount() {
        this._fetData();
    }

    _detailGet = async () => {
        const {userId, orderId} = this.state;
        const {type} = this.props;
        try {
            const {code, message: msg, data} = await Http.aduitDetail({userId,orderId,type});
            if (code === 200) {
                console.log('_detailGet',data)
                if (data && data.checkStatus === 0) {
                    this.setState({
                        ifPass: true
                    })
                } else if (data && data.checkStatus === 1) {
                    this.setState({
                        ifPass: false
                    })
                }
                this.setState({initialValue: data ? data : {}});
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
        } catch (e) {
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _fetData = async () => {
        try {
            const {code, message: msg, data} = await Http.allCheckCode();
            if (code === 200) {
                this.setState({checkCodeArr: data});
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
        } catch (e) {
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _handleOk = () => {
        this._onValidateFields('ok');
    };

    _onValidateFields = (type) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                
                type === 'ok' && this._onSubmit(values);
                type === 'save' && this._onSave(values);
            }
        });
    };

    _handleCancel = (e) => {
        const {handleCancel} = this.props;
        handleCancel && handleCancel(e);
    };

    _handleSave = () => {
        this._onValidateFields('save');
    };

    _onSave = async (values) => {
            try {
                const {userId, orderId} = this.state;
                const {type} = this.props;
                const newParams = {
                    ...values,
                    userId,
                    orderId,
                    type
                };
                console.log('_detailGet',newParams)
                const {code} = await Http.aduitSave(newParams);
                console.log('_detailGet',code)
                if (code === 200) {
                    message.info('已保存');
                    this._handleCancel();
                } else {
                    message.warn('保存失败');
                }
            } catch (e) {
                const msg1 = e && e.message ? e.message : '服务异常';
                message.warn(msg1);
            }
    };

    _onSubmit = async (params) => {
        try {
            const {userId, orderId} = this.state;
            const {type} = this.props;
            const newParams = {
                ...params,
                userId,
                orderId,
                type
            };
            const {code} = await Http.auditSubmit(newParams);
            if (code === 200) {
                message.info('提交成功');
                this._handleCancel(true);
            } else {
                message.warn('提交失败');
            }
        } catch (e) {
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _onChange = (value) => {
        if (value === 0) {
            this.setState({
                ifPass: true
            })
        } else if(value === 1) {
            this.setState({
                ifPass: false
            })
        }
    }

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {ifPass, visible, loading, checkCodeArr, initialValue} = this.state;
       
        return (
            <Modal
                centered
                destroyOnClose={true}
                title={`审核`}
                visible={visible}
                onCancel={()=>this._handleCancel()}
                footer={[
                    <Button key="back" onClick={this._handleSave}>保存</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={this._handleOk}>
                        提交
                    </Button>,
                ]}
            >
                <Spin size={"large"} spinning={loading}>
                    <Form className='audit-form'>
                        <Row type="flex" align="middle" justify="start">
                            <Col xs={24} sm={24} md={24}>
                                <Form.Item label='审核结果'{...ModalFormItemLayout} style={{marginBottom: 0}}>
                                    {getFieldDecorator('checkStatus', {
                                        initialValue: initialValue.checkStatus,
                                        rules: [{required: true, message: '请选择审核结果'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' onChange={this._onChange} allowClear={allowClear}>
                                            <Select.Option value={1}>通过</Select.Option>
                                            <Select.Option value={0}>拒绝</Select.Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            {ifPass && <Col xs={24} sm={24} md={24}>
                                <Form.Item label='审核代码'{...ModalFormItemLayout} style={{marginBottom: 0}}>
                                    {getFieldDecorator('checkCode', {
                                        initialValue: initialValue.checkCode ? initialValue.checkCode : undefined,
                                        rules: [{required: true, message: '请选择审核代码'},
                                        ],
                                    })(
                                        <Select placeholder='请选择' allowClear={allowClear}>
                                            {
                                                checkCodeArr.map(i => {
                                                    return (
                                                        <Select.Option
                                                            key={i.code}
                                                            value={i.code}
                                                        >
                                                            {i.desc}
                                                        </Select.Option>
                                                    )

                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>}
                            <Col xs={24} sm={24} md={24}>
                                <Form.Item label='审核备注'{...ModalFormItemLayout} style={{marginBottom: 0}}>
                                    {getFieldDecorator('remark', {
                                        initialValue: initialValue.remark ? initialValue.remark : undefined,
                                        rules: [{required: false, message: '请输入审核备注'},
                                        ],
                                    })(
                                        <Input.TextArea placeholder='请输入' autosize={{minRows: 4, maxRows: 8}}/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(Main);