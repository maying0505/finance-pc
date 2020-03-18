/*
* @desc 部分还款
* */
import React from 'react';
import './PartRepay.less';
import PropTypes from 'prop-types';
import {Col, Form, Input, message, Modal, Row, Spin, Select} from 'antd';
import {ColConfig, allowClear} from "../../config";
import {Http} from "../../components";

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

class Main extends React.Component {

    static propTypes = {
        visible: PropTypes.bool.isRequired,
        handleCancel: PropTypes.func.isRequired,
        shouldRepayAmount: PropTypes.number.isRequired,
        actualRepayAmount: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        httpUrl: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        ItemArr: PropTypes.array,
    };

    static defaultProps = {
        ItemArr: []
    };

    state = {
        visible: false,
        channelArr: [
            {
                id: 3,
                channelName: '支付宝支付'
            },
            {
                id: 4,
                channelName: '线下支付'
            },
        ],
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
                    ...values,
                    repaymentId: this.props.id,
                    userId: this.props.userId
                };
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

    _handleFilePreview = () => {

    };

    render() {
        const {ItemArr, title, form: {getFieldDecorator}} = this.props;
        const {visible, loading, channelArr } = this.state;

        return (
            <Modal
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
                                    const {id, label, field, disabled, required} = i;
                                    return (
                                        <Col {...ModalColConfig} key={id} style={id === 15 ? {display: 'none'} : {}}>
                                            <Form.Item {...ModalFormItemLayout} label={label}
                                                       style={{marginBottom: '0px'}}>
                                                {getFieldDecorator(field, {
                                                    initialValue: this.props[field],
                                                    rules: [{required: required, message: label},
                                                    ],
                                                })(
                                                    field === 'payChannel' ? 
                                                    <Select placeholder='请选择' allowClear={allowClear}>
                                                        {channelArr.map(i => <Option value={i.id} key={i.id}>{i.channelName}</Option>)}
                                                    </Select>:
                                                    <Input disabled={disabled} placeholder={label}/>
                                                    
                                                )}
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