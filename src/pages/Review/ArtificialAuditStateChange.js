/**
 * @desc 人工审核状态切换
 * */
import React from 'react';
import './ArtificialAuditStateChange.less';
import {Button, Col, DatePicker, Form, TimePicker, message, Modal, Row, Select, Spin} from 'antd';
import {Http, TitleLine} from "../../components";
import {LocalStorage, SessionStorage} from "../../utils";
import {StorageKeys, allowClear} from "../../config";

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
const DateFormat = 'YYYY-MM-DD';

class Main extends React.PureComponent {
    state = {
        loading: false,
        visible: false,
        id: null,
        artificialAuditState: null,
    };

    componentDidMount() {
        this._fetData();
    }

    _fetData = async () => {
        try {
            this.setState({loading: true});
            const {code, message: msg, data} = await Http.reviewConfigQuery();
            if (code === 200) {
                const {beforeStatus, id} = data;
                this.setState({
                    id,
                    loading: false,
                    artificialAuditState: beforeStatus
                });
            } else {
                this.setState({loading: false});
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
        } catch (e) {
            console.log('e', e);
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    changeState = (stateName, stateValue) => {
        this.setState({[stateName]: stateValue});
    };

    _handleCancel = () => {
        this.changeState('visible', false);
    };

    _handleOk = () => {
        this._onValidateFields();
    };

    _onValidateFields = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this._onSubmit(values);
            }
        });
    };

    _onSubmit = async (params) => {
        try {
            this.setState({loading: true});
            const {id, artificialAuditState} = this.state;
            const newParams = {
                ...params,
                id,
                beforeStatus: artificialAuditState === '开启' ? 1 : 0,
            };
            const {code, message: msg, data} = await Http.reviewAuditSubmit(newParams);
            if (code === 200) {
                this._fetData();
                this.setState({
                    loading: false,
                    visible: false,
                });
                const msg1 = msg ? msg : '服务异常';
                message.info(msg1);
            } else {
                this.setState({loading: false});
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
        } catch (e) {
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {loading, artificialAuditState, visible} = this.state;

        return (
            <div className='artificial-audit-state-change'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='复审审核管理'
                        icon='yonghu'
                    />
                    <div className='content'>
                        <h1>人工审核状态：<label>{artificialAuditState}</label></h1>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="submit"
                            onClick={() => this.changeState('visible', true)}
                        >
                            切换
                        </Button>
                    </div>
                    <Modal
                        centered
                        destroyOnClose={true}
                        title={`人工审核状态切换`}
                        visible={visible}
                        onCancel={this._handleCancel}
                        footer={[
                            <Button key="back" onClick={this._handleCancel}>取消</Button>,
                            <Button key="submit" type="primary" onClick={this._handleOk}>
                                提交
                            </Button>,
                        ]}
                    >
                        <Spin size={"large"} spinning={loading}>
                            <Form className='audit-form'>
                                <Row type="flex" align="middle" justify="start">
                                    <Col xs={24} sm={24} md={24}>
                                        <Form.Item label='当前状态'{...ModalFormItemLayout} style={{marginBottom: 0}}>
                                            <div>{artificialAuditState}</div>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24}>
                                        <Form.Item label='后续状态'{...ModalFormItemLayout} style={{marginBottom: 0}}>
                                            {getFieldDecorator('afterStatus', {
                                                rules: [{required: true, message: '请选择'},
                                                ],
                                            })(
                                                <Select placeholder='请选择' allowClear={allowClear}>
                                                    <Select.Option value='1'>开启</Select.Option>
                                                    <Select.Option value='0'>关闭</Select.Option>
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24}>
                                        <Form.Item {...ModalFormItemLayout} label='日期区间' style={{marginBottom: '0px'}}>
                                            {getFieldDecorator('dayStart', {
                                                rules: [{required: false, message: '请选择'}],
                                            })(
                                                <DatePicker
                                                    showTime={false}
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
                                            {getFieldDecorator('dayEnd', {
                                                rules: [{required: false, message: '请选择'}],
                                            })(
                                                <DatePicker
                                                    showTime={false}
                                                    format={DateFormat}
                                                    style={{width: '46%'}}
                                                    placeholder='选择结束时间'
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24}>
                                        <Form.Item {...ModalFormItemLayout} label='时间区间' style={{marginBottom: '0px'}}>
                                            {getFieldDecorator('timeStart', {
                                                rules: [{required: false, message: '请选择'}],
                                            })(
                                                <TimePicker format={'HH:mm'} style={{width: '46%'}}/>
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
                                            {getFieldDecorator('timeEnd', {
                                                rules: [{required: false, message: '请选择'}],
                                            })(
                                                <TimePicker format={'HH:mm'} style={{width: '46%'}}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Spin>
                    </Modal>
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);