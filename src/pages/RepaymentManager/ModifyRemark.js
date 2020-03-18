/*
* @desc 修改备注
* */
import React from 'react';
import PropTypes from 'prop-types';
import {Col, Form, Input, message, Modal, Row, Spin, Select, Tooltip} from 'antd';
import {ColConfig} from "../../config";
import {Http} from "../../components";

const ModalFormItemLayout = {
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

const ModalColConfig = {
    ...ColConfig,
    xs: 24,
    sm: 24,
    md: 24,
};

const Option = Select.Option;

const ItemArr = [
    {id: 0, label: '备注', field: 'remark', disabled: false, required: true},
];

class Main extends React.Component {

    static propTypes = {
        visible: PropTypes.bool.isRequired,
        handleCancel: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        remark: PropTypes.string,
    };

    static defaultProps = {
        remark: ''
    };

    state = {
        visible: false,
        loading: false,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.visible !== prevState.visible) {
            return {visible: nextProps.visible};
        }
    }

    componentDidMount() {

    }

    _handleCancel = () => {
        const {handleCancel} = this.props;
        handleCancel && handleCancel(false,false);
    };

    _handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    id: this.props.id,
                    ...values
                };
                this._submit(params);
            }
        })
    }

    _submit = async (params) => {
            try {
                this.setState({loading: true});
                const {code, message: msg, data} = await Http.modifyRemark(params);
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

    _handleFilePreview = () => {

    };

    render() {
        const {remark, form: {getFieldDecorator}} = this.props;
        const {visible, loading} = this.state;

        return (
            <Modal
                centered
                width={500}
                destroyOnClose={true}
                title={'修改备注'}
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
                                    const {id, label, field, disabled, required} = i;
                                    return (
                                        <Col {...ModalColConfig} key={id} style={id === 15 ? {display: 'none'} : {}}>
                                            <Form.Item {...ModalFormItemLayout} label={label}
                                                       style={{marginBottom: '0px'}}>
                                                            <Tooltip placement="topLeft" title="姓名+电话号码，如：张三13*****">
                                                                {getFieldDecorator(field, {
                                                                    initialValue: remark,
                                                                    rules: [{required: required, message: label},
                                                                    ],
                                                                })(
                                                                    <Input disabled={disabled} placeholder={label}/>
                                                                )}
                                                            </Tooltip>
                                            </Form.Item>
                                        </Col>
                                    )
                                })
                        }
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(Main);