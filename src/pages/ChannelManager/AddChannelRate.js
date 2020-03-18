/*
* @desc 新增渠道流量
* */
import React from 'react';
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
        ItemArr: PropTypes.array,
    };

    static defaultProps = {
        ItemArr: [],
    };

    state = {
        visible: false,
        loading: false,
        dataInfo: {},
        channelId: ''
    };

    componentWillMount(){ //预加载数据
        this.propsGet(this.props);
        
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsGet(nextProps);
    }

    propsGet(nextProps) {
        if (nextProps.visible !== this.state.visible) {
            this.setState({
                visible: nextProps.visible,
            })
        }
    }

    _fetchData = async (channelId) => {
        try {
            this.setState({loading: true});
            const {code, message: msg, data} = await Http.getChannelDetail({channelId:channelId});
            let dataArr = [];
            if (code === 200) {
                if (data) {
                    dataArr = data;
                    this.props.form.setFieldsValue({
                        providerId: dataArr['providerId'],
                    });
                    this.props.form.setFieldsValue({
                        type: dataArr['type'],
                    });
                    this.props.form.setFieldsValue({
                        price: dataArr['price'],
                    });
                    this.props.form.setFieldsValue({
                        statusStr: dataArr['statusStr'],
                    });
                }
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            this.setState({
                dataInfo: dataArr,
                loading: false,
            });
        } catch (e) {
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _handleCancel = () => {
        const {handleCancel} = this.props;
        console.log(handleCancel)
        handleCancel && handleCancel(false,false);
    };

    _handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    remark: values['remark'],
                    ratio: values['ratio'],
                    merchId: this.state.dataInfo['merchId'] ? this.state.dataInfo['merchId'] : undefined,
                    channelId: this.state.channelId,
                };
                this._submit(params);
            }
        })
    }

    _submit = async (params) => {
            try {
                this.setState({loading: true});
                const {code, message: msg, data} = await Http.channelRateSave(params);
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

    _onChange = (value,field) => {
        if (field === 'name') {
            this.setState({
                channelId: value
            })
            this._fetchData(value);
        }
    };

    render() {
        const {ItemArr, form: {getFieldDecorator}} = this.props;
        const {dataInfo, visible, loading } = this.state;

        return (
            <Modal
                centered
                width={500}
                destroyOnClose={true}
                title={'添加渠道流量管理'}
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
                                    const {id, label, field, disabled, required, type, values, value} = i;
                                    return (
                                        <Col {...ModalColConfig} key={id} style={id === 15 ? {display: 'none'} : {}}>
                                            <Form.Item {...ModalFormItemLayout} label={label}
                                                       style={{marginBottom: '0px'}}>
                                                {getFieldDecorator(field, {
                                                    initialValue: dataInfo[field] ? dataInfo[field] : value,
                                                    rules: [{required: required, message: label},
                                                    ],
                                                })(
                                                    type === 'select' ? 
                                                    <Select onChange={(value)=>this._onChange(value,field)} disabled={disabled} placeholder='请选择' allowClear={allowClear}>
                                                        {values.map(i => <Option value={i.id ? i.id : i.type} key={i.id ? i.id : i.type}>{i.name ? i.name : i.value}</Option>)}
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