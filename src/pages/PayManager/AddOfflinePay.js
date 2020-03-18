/*
* @desc 新增线下打款
* */
import React from 'react';
import './AddOfflinePay.less';
import PropTypes from 'prop-types';
import {Button, Upload, Col, Form, Input, message, Modal, Icon, Row, Spin} from 'antd';
import {ColConfig, AmountFormat, InterestRateFormat} from "../../config";
import {Http, Apis} from "../../components";
import {ROOT_URL} from '../../utils';

const ModalFormItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
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

const ItemArr = [
    {id: 0, label: '借款人姓名', field: 'name', disabled: true},
    {id: 1, label: '认证号码', field: 'mobile', disabled: true},
    {id: 2, label: '申请时间', field: 'applyTime', disabled: true},
    {id: 3, label: '借款金额', field: 'amount', disabled: true},
    {id: 4, label: '借款产品', field: 'productId', disabled: true},
    {id: 5, label: '利息', field: 'interest', disabled: true},
    {id: 6, label: '手续费', field: 'serviceFee', disabled: true},
    {id: 7, label: '借款状态', field: 'orderStatus', disabled: true},
    {id: 8, label: '应打款额', field: 'shouldPayAmount', disabled: true},
    {id: 10, label: '绑定银行卡', field: 'bankName', disabled: true},
    {id: 11, label: '银行卡号', field: 'bankCard', disabled: true},
    {id: 12, label: '打款渠道', field: 'payChannel', disabled: true},
    {id: 13, label: '打款金额', field: 'actualPayAmount', disabled: false},
    {id: 14, label: '交易流水号', field: 'payOrderId', disabled: false},
    // {id: 15, label: '凭证图片', field: 'voucherUrl', disabled: false},
];

class Main extends React.Component {

    static propTypes = {
        visible: PropTypes.bool.isRequired,
        handleCancel: PropTypes.func.isRequired,
    };

    static defaultProps = {};

    state = {
        visible: false,
        loading: false,
        fileList: [],
        detailInfo: {}
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.visible !== prevState.visible) {
            return {visible: nextProps.visible};
        }
    }

    componentDidMount() {

    }

    _handleCancel = (e) => {
        const {handleCancel} = this.props;
        if (e) {
            handleCancel && handleCancel(false,true);
        } else {
            handleCancel && handleCancel(false);
        }
        this.setState({fileList: []});
    };

    _handleOk = (type) => {
        this._handleIdentification(type);
    };

    _handleIdentification = (type) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                const {bizId, payOrderId,actualPayAmount} = values;
                if (type === 'identification') {
                    // 根据接口订单号查详情
                    this._payRequestLoanInfo(bizId)
                } else if (type === 'submit') {
                    let detailInfo = this.state.detailInfo;
                    this._onAddOfflinePayment({
                        ...detailInfo,
                        payOrderId,
                        actualPayAmount,
                        payChannel: 4
                    });
                }
            }
        });
    };

    _payRequestLoanInfo = async (bizId) => {
        try {
            this.setState({loading: true});
            const {code, message: msg, data} = await Http.payRequestLoanInfo({bizId});
            if (code === 200) {
                this.props.form.setFieldsValue({
                    name: data['name'] ? data['name'] : undefined,
                    mobile: data['mobile'] ? data['mobile'] : undefined,
                    applyTime: data['applyTime'] ? data['applyTime'] : undefined,
                    amount: data['amount'] || data['amount'] === 0 ? AmountFormat(data['amount']) : undefined,
                    loanDay: data['loanDay'] ? data['loanDay'] : undefined,
                    interest: data['interest'] || data['interest'] === 0 ? InterestRateFormat(data['interest']) : undefined,
                    serviceFee: data['serviceFee'] || data['serviceFee'] === 0 ? AmountFormat(data['serviceFee']) : undefined,
                    orderStatus: data['orderStatus'] ? data['orderStatus'] : undefined,
                    shouldPayAmount: data['shouldPayAmount'] || data['shouldPayAmount'] === 0 ? AmountFormat(data['shouldPayAmount']) : undefined,
                    bankName: data['bankName'] ? data['bankName'] : undefined,
                    bankCard: data['bankCard'] ? data['bankCard'] : undefined,
                    payChannel: data['payChannel'] ? data['payChannel'] : undefined,
                });
                this.setState({
                    detailInfo: data ? data : {}
                })
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

    _onAddOfflinePayment = async (params) => {
        try {
            this.setState({loading: true});
            const {code, message: msg, data} = await Http.AddOfflinePayment(params);
            if (code === 200) {
                const msg = msg ? msg : '提交成功';
                message.success(msg);
                this._handleCancel(true);
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

    _handleFileChange = ({fileList}) => {
        let newFileList = [], urlArr = [];
        for (let i = 0; i < fileList.length; i++) {
            const {response, status} = fileList[i];
            if (status === 'done') {
                if (!response) {
                    return;
                }
                const {code, message: msg, data} = response;
                if (code === 200) {
                    const {url} = data;
                    urlArr.push(url);
                    newFileList.push(fileList[i]);
                } else {
                    const msg = msg ? msg : '上传失败';
                    message.warn(msg);
                }
            } else if (status === 'uploading') {
                newFileList.push(fileList[i]);
            }
        }
        this.setState({fileList: newFileList});
        const {form: {setFieldsValue}} = this.props;
        setFieldsValue({'voucherUrl': urlArr.toString()});
    };

    _handleFilePreview = () => {

    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {visible, loading} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <Modal
                centered
                width={800}
                destroyOnClose={true}
                title={`新增线下打款`}
                visible={visible}
                okText={'提交'}
                cancelText={'关闭'}
                onOk={() => this._handleOk('submit')}
                onCancel={()=>this._handleCancel()}
            >
                <Spin size={"large"} spinning={loading}>
                    <Form className='add-offline-pay'>
                        <Row type="flex" align="middle" justify="start">
                            <Col xs={24} sm={24} md={24}>
                                <Form.Item
                                    colon={false}
                                    labelCol={{xs: {span: 24}, sm: {span: 4}}}
                                    wrapperCol={{xs: {span: 24}, sm: {span: 16}}}
                                    label='借款订单号'
                                    style={{marginBottom: '0px'}}
                                >
                                    {getFieldDecorator('bizId', {

                                        rules: [{required: true, message: '请输入借款订单号'},
                                        ],
                                    })(
                                        <Input placeholder="请输入借款订单号" style={{width: '50%'}}/>
                                    )}
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="my-submit"
                                        onClick={() => this._handleIdentification('identification')}
                                    >
                                        识别
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} style={{display: 'none'}}>
                                <Form.Item
                                    colon={false}
                                    labelCol={{xs: {span: 24}, sm: {span: 4}}}
                                    wrapperCol={{xs: {span: 24}, sm: {span: 16}}}
                                    label='打款流水号'
                                    style={{marginBottom: '0px'}}
                                >
                                    {getFieldDecorator('payFlowId', {
                                        
                                        rules: [{required: false, message: '请输入打款流水号'},
                                        ],
                                    })(
                                        <Input placeholder="请输入打款流水号" style={{width: '50%'}}/>
                                    )}
                                </Form.Item>
                            </Col>
                            {
                                ItemArr.map(i => {
                                    const {id, label, field, disabled} = i;
                                    return (
                                        <Col {...ModalColConfig} key={id} style={id === 15 ? {display: 'none'} : {}}>
                                            <Form.Item {...ModalFormItemLayout} label={label}
                                                       style={{marginBottom: '0px'}}>
                                                {getFieldDecorator(field, {
                                                    rules: [{required: false, message: label},
                                                    ],
                                                })(
                                                    <Input disabled={disabled} placeholder={label}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    )
                                })
                            }

                        </Row>
                        {/* <Row>
                            <Col xs={24} sm={24} md={24}>
                                <Form.Item
                                    colon={false}
                                    labelCol={{xs: {span: 24}, sm: {span: 4}}}
                                    wrapperCol={{xs: {span: 24}, sm: {span: 16}}}
                                    label='凭证上传'
                                    style={{marginBottom: '0px'}}
                                >
                                    <Upload
                                        action={`${ROOT_URL}${Apis.fileUpload}`}
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={this._handleFilePreview}
                                        onChange={this._handleFileChange}
                                    >
                                        {fileList.length >= 3 ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row> */}
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(Main);