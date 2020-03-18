import React from 'react';
import './Detail.less';
import {Http, TitleLine} from "../../components";
import {Col, message, Row, Spin, Table} from "antd";
import {ColConfig} from "../../config";
import RcViewer from '@hanyk/rc-viewer';

export default class AuditFirstDetail extends React.Component {

    state = {
        loading: true,
        loanInfo: [],
        personInfo: [],
        bankAccountInfo: [],
        riskAuditData: [],
    };

    componentDidMount() {
        this._fetData();
        console.log(this.props);
    }

    columns = [
        {
            title: '借款订单号',
            dataIndex: 'loanOrderId',
            width: 80,
        },
        {
            title: '审核人',
            dataIndex: 'checkerName',
            width: 80,
        },
        {
            title: '审核时间',
            dataIndex: 'createTime',
            width: 80,
        },
        {
            title: '拒绝代码',
            dataIndex: 'checkCode',
            width: 80,
        },
        {
            title: '拒绝明细',
            dataIndex: 'checkRemark',
            width: 80,
        },
        {
            title: '审核结果',
            dataIndex: 'checkResult',
            width: 80,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width: 80,
        },
    ];

    _fetData = async () => {
        try {
            const {match: {params: {userId, orderId}}} = this.props;
            const params = {
                userId,
                orderId,
            };
            const {code, message: msg, data} = await Http.auditFirstTrialDetail(params);
            if (code === 200) {
                const {loanInfo, personInfo, bankAccountInfo, riskAduitDetail} = data;
                let loanCreateTime = '';
                if (loanInfo.loanCreateTime) {
                    let year = loanInfo.loanCreateTime[0];
                    let month = loanInfo.loanCreateTime[1];
                    let day = loanInfo.loanCreateTime[2];
                    let hour = loanInfo.loanCreateTime[3];
                    let minute = loanInfo.loanCreateTime[4];
                    let second = loanInfo.loanCreateTime[5];
                    loanCreateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
                }
                
                const newLoanInfo = loanInfo ? [
                    {id: 0, label: '用户ID', value: loanInfo.userId},
                    {id: 1, label: '借款订单', value: loanInfo.loanOrderId},
                    {id: 2, label: '渠道', value: loanInfo.channelName},
                    {id: 3, label: '借款金额', value: loanInfo.amount},
                    {id: 4, label: '借款产品', value: loanInfo.productName},
                    {id: 5, label: '申请时间', value: loanCreateTime},
                    {id: 6, label: '利息', value: loanInfo.rate},
                    {id: 7, label: '手续费', value: loanInfo.serviceFee},
                    {id: 8, label: '总额度', value: loanInfo.creditLimit},
                ] : [];
                const newPersonInfo = personInfo ? [
                    // {
                        // id: 0,
                        // label: '图片信息',
                        // value: [
                            {id: 0, label: '身份证正面', value: personInfo.idNumberPositive, style: 'img'},
                            {id: 1, label: '身份证反面', value: personInfo.idNumberNegative, style: 'img'},
                            {id: 2, label: '人脸识别', value: personInfo.face, style: 'img'},
                        // ]
                    // },
                    {id: 3, label: '姓名', value: personInfo.name},
                    {id: 4, label: '认证号码', value: personInfo.mobile},
                    {id: 5, label: '身份证号', value: personInfo.idNumber},
                    {id: 6, label: '出生日期', value: personInfo.birthday},
                    {id: 7, label: '年龄', value: personInfo.age},
                    {id: 8, label: '婚姻状况', value: personInfo.marriage},
                    {id: 9, label: '学历', value: personInfo.degree},
                    {id: 10, label: '注册时间', value: personInfo.userCreateTime},
                    {id: 11, label: '户籍地址', value: personInfo.address},
                    {id: 12, label: '注册GPS地址', value: personInfo.registerGpsAddress},
                    {id: 13, label: '认证GPS地址', value: personInfo.validateGpsAddress},
                    {id: 14, label: '借款GPS地址', value: personInfo.loanGpsAddress},
                    {id: 15, label: '注册IP地址', value: personInfo.registerIpAddress},
                    {id: 16, label: '认证IP地址', value: personInfo.validateIpAddress},
                    {id: 17, label: '借款IP地址', value: personInfo.loanIpAddress},
                ] : [];
                const newBankAccountInfo = bankAccountInfo ? [
                    {id: 0, label: '开户行', value: bankAccountInfo.bankName},
                    {id: 1, label: '开户名', value: bankAccountInfo.userName},
                    {id: 2, label: '银行卡号', value: bankAccountInfo.cardNo},
                    {id: 3, label: '种类', value: bankAccountInfo.bankType},
                    {id: 4, label: '银行预留手机号', value: bankAccountInfo.mobile},
                    {id: 5, label: '添加时间', value: bankAccountInfo.createTime},
                ] : [];
                this.setState({
                    loading: false,
                    loanInfo: newLoanInfo,
                    personInfo: newPersonInfo,
                    bankAccountInfo: newBankAccountInfo,
                    riskAuditData: riskAduitDetail,
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

    render() {
        const {loanInfo, personInfo, bankAccountInfo, riskAuditData, loading} = this.state;
        const options={toolbar: false}
        return (
            <div className='audit-first-detail'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='借贷信息'
                        icon='yonghu'
                    />
                    <Row style={{padding: '10px'}}>
                        {
                            loanInfo.length > 0 ? loanInfo.map(i => {
                                const {id, label, value} = i;
                                return (
                                    <Col key={`loanInfo_${id}`} {...ColConfig}>
                                        {label}：{value}
                                    </Col>
                                )
                            }) : 
                            <span>
                                暂无信息
                            </span>
                        }
                    </Row>
                    <TitleLine
                        title='个人信息'
                        icon='yonghu'
                    />
                    <Row style={{padding: '10px'}}>
                        {
                            personInfo.length > 0 ? personInfo.map(i => {
                                const {id, label, value, style} = i;
                                // if (id === 0) {
                                //     let ele = value.map(ii => {
                                //         return (
                                //             <span key={`img_key_${ii.id}`}>
                                //                 {ii.label}：{ii.style === 'img' ? <img src={ii.value}/> : ii.value}
                                //             </span>
                                //         )
                                //     });
                                //     return (
                                //         <Col key={`personInfo_${id}`} xs={24} sm={24} md={24}>
                                //             <div className="flex flex-j-sa person-info">
                                //                 {ele}
                                //             </div>
                                            
                                //         </Col>
                                //     )
                                // }
                                return (
                                    <Col key={`personInfo_${id}`} {...ColConfig} className="person-info">
                                        {label}：{style === 'img' ? <RcViewer className="person-info-img" options={options} ref='viewer'>
                                            <img src={value}/>
                                        </RcViewer> : value}
                                    </Col>
                                )
                            }) : 
                            <span>暂无信息</span>
                        }
                    </Row>
                    <TitleLine
                        title='银行账户信息'
                        icon='yonghu'
                    />
                    <Row style={{padding: '10px'}}>
                        {
                            bankAccountInfo.length > 0 ? bankAccountInfo.map(i => {
                                const {id, label, value} = i;
                                return (
                                    <Col key={`bankAccountInfo_${id}`} {...ColConfig}>
                                        {label}：{value}
                                    </Col>
                                )
                            }) : <span>暂无信息</span>
                        }
                    </Row>
                    <TitleLine
                        title='风控审核详情'
                        icon='yonghu'
                    />
                    <Table
                        bordered
                        size='small'
                        columns={this.columns}
                        rowKey='id'
                        dataSource={riskAuditData}
                        style={{padding: '10px'}}
                        // pagination={pagination}
                        // loading={loading}
                        // onChange={this._handleTableChange}
                        // scroll={{x: 1500}}
                    />

                </Spin>
            </div>
        )
    }
}