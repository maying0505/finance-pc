/*
* @desc 意见反馈、催收投诉处理
* */
import React from 'react';
import PropTypes from 'prop-types';
import {Col, Form, Input, message, Modal, Row, Spin, DatePicker, Select} from 'antd';
import {ColConfig,allowClear} from "../../config";
const { confirm } = Modal;
const DateFormat = 'YYYY-MM-DD HH:mm:ss';

const ModalFormItemLayout = {
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

const ModalColConfig = {
    ...ColConfig,
    xs: 24,
    sm: 24,
    md: 24,
};

const Option = Select.Option;
class HandleModalForm extends React.Component {

    static propTypes = {
        visible: PropTypes.bool.isRequired,
        handleCancel: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        httpUrl: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        style: PropTypes.string,
        ItemArr: PropTypes.array,
        type: PropTypes.number.isRequired,
    };

    static defaultProps = {
        ItemArr: [],
        style: ''
    };

    state = {
        visible: false,
        loading: false,
        type: -1
    };
    
    componentDidMount() {
        this.propsGet(this.props);
    }

    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsGet(nextProps);
    }

    propsGet(nextProps) {
        if (nextProps.visible !== this.state.visible) {
            if (nextProps.visible) {
                const {type} = nextProps;
                if (type === 1) {
                    this.showConfirm();
                }
                this.setState({
                    type: type,
                })
            }
            this.setState({
                visible: nextProps.visible
            });
        }
    }

    showConfirm() {
        let that = this;
        confirm({
          title: this.props.title,
          content: '',
          onOk() {
            that._handleOk();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

    _handleCancel = () => {
        const {handleCancel} = this.props;
        handleCancel && handleCancel(false,false);
    };

    _handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.createTime = values.createTime ? values.createTime.format(DateFormat) : undefined;
                let params = {};
                
                if (this.props.style === 'user') {
                    params = {
                        ...values,
                        userId: this.props.id,
                    };
                } else {
                    params = {
                        ...values,
                        id: this.props.id,
                    };
                }
                this._submit(params);
            }
        })
    }

    _submit = async (params) => {
            try {
                this.setState({loading: true});
                const {code, message: msg, data} = await this.props.httpUrl(params);
                if (code === 200) {
                    message.success('提交成功');
                    const {handleCancel} = this.props;
                    handleCancel && handleCancel(true,false);
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

    inputShow = (disabled,label,type,values) => {
        if (type === 'date') {
            return <DatePicker
                showTime
                style={{width: '100%'}}
                format={DateFormat}
            />
        } else if (type === 'select') {
            return <Select disabled={disabled} placeholder='请选择' allowClear={allowClear}>
                {values.map(i => <Option value={(i.id || i.id === 0) ? i.id : i.type} key={(i.id || i.id === 0) ? i.id : i.type}>{i.name ? i.name : i.value}</Option>)}
            </Select>
        } else {
            return <Input disabled={disabled} placeholder={label}/>
        }
    };

    render() {
        const {ItemArr, title, form: {getFieldDecorator}} = this.props;
        const {type, visible, loading } = this.state;

        return (<div>
            {type === 0 && <Modal
                centered
                width={500}
                destroyOnClose={true}
                title={title}
                visible={visible}
                okText={'提交'}
                cancelText={'关闭'}
                onOk={() => this._handleOk()}
                onCancel={this._handleCancel}
            >
                <Spin size={"large"} spinning={loading}>
                    <Form className='add-offline-pay'>
                        <Row type="flex" align="middle" justify="start">
                        {
                                ItemArr.map(i => {
                                    const {id, label, field, disabled, required, type, values} = i;
                                    return (
                                        <Col {...ModalColConfig} key={id} style={id === 15 ? {display: 'none'} : {}}>
                                            <Form.Item {...ModalFormItemLayout} label={label}
                                                       style={{marginBottom: '0px'}}>
                                                {getFieldDecorator(field, {
                                                    initialValue: this.props[field],
                                                    rules: [{required: required, message: label},
                                                    ],
                                                })(
                                                    this.inputShow(disabled,label,type,values)
                                                )}
                                            </Form.Item>
                                        </Col>
                                    )
                                })
                        }
                        </Row>
                    </Form>
                </Spin>
            </Modal>}
            </div>
        )
    }
}
let HandleModal = HandleModalForm
export default Form.create()(HandleModal);