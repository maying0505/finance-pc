/*
* @desc 复审审核详情
* */
import React from 'react';
import './ReviewDetail.less';
import {message, Spin, Row, Col, Table, Descriptions, Button} from 'antd';
import {Http, TitleLine} from '../../components';
import {ColConfig} from '../../config';
import {Sample} from '../../assets';
import RcViewer from '@hanyk/rc-viewer';
import R360Report from './R360Report';
import PhoneMailList from './PhoneMailList';
import PhoneMessage from './PhoneMessage';
import TaobaoQuery from './TaobaoQuery';
import AuditForm from './AuditForm';
import SlcQuery from './SlcQuery';
import BlackFishReport from './BlackFishReport';

export default class ReviewDetail extends React.PureComponent {

    state = {
        loading: true,
        loanInfo: [],
        personInfo: [],
        bankAccountInfo: [],
        phoneCallRecord: [],
        contactInfo: [],
        riskAuditDetail: [],
        historyLoan: [],
        headInfo: [],
        telephoneList: 0,
        messageList: 0,
        addressList: 0,
        r360ReportVisible: false,
        taoBaoVisible: false,
        slcVisible: false,
        phoneMailListVisible: false,
        phoneMessageVisible: false,
        blackFishReportVisible: false,
        userId: '',
        auditVisible: false,
        orderId: '',
        type: ''
    };

    componentDidMount() {
        const {match: {params: {userId, orderId, type}}} = this.props;
        this.setState({
            userId: userId,
            orderId: orderId,
            type: type
        })
        this._fetchData({userId, orderId});
    }

    contactInfoColumns = [
        {
            title: '紧急联系人姓名',
            dataIndex: 'contactName',
            width: 100,
        },
        {
            title: '关系',
            dataIndex: 'relation',
            width: 100,
        },
        {
            title: '电话',
            dataIndex: 'concactMobile',
            width: 120,
        },
        {
            title: '总联系次数',
            dataIndex: 'concactCount',
            width: 120,
        },
        {
            title: '添加时间',
            dataIndex: 'createTime',
            width: 120,
        },
    ];

    historyLoanColumns = [
        {
            title: '借款订单号',
            dataIndex: 'loanOrderId',
            width: 120,
        },
        {
            title: '借款人姓名',
            dataIndex: 'loanName',
            width: 120,
        },
        {
            title: '认证号码',
            dataIndex: 'mobile',
            width: 120,
        },
        {
            title: '借款金额',
            dataIndex: 'amount',
            width: 120,
        },
        {
            title: '借款产品',
            dataIndex: 'productName',
            width: 120,
        },
        {
            title: '借款时间',
            dataIndex: 'loanTime',
            width: 120,
        },
        {
            title: '应还时间',
            dataIndex: 'planRepayTime',
            width: 120,
        },
        {
            title: '实际还时间',
            dataIndex: 'actualRepayTime',
            width: 120,
        },
        {
            title: '借款状态',
            dataIndex: 'loanStatus',
            width: 120,
        },
        {
            title: '是否逾期',
            dataIndex: 'isOverdue',
            width: 120,
        },
        {
            title: '逾期天数',
            dataIndex: 'overdueDay',
            width: 120,
        },
        {
            title: '逾期金额',
            dataIndex: 'overdueFee',
            width: 120,
        },
        {
            title: '应还金额',
            dataIndex: 'planRepayAmount',
            width: 120,
        },
        {
            title: '实还金额',
            dataIndex: 'actualRepayAmount',
            width: 120,
        },
        {
            title: '催收建议',
            dataIndex: 'collectionAdvise',
            width: 120,
        },
    ];

    riskAuditDetailColumns = [
        {
            title: '借款订单号',
            dataIndex: 'loanOrderId',
            width: 120,
        },
        {
            title: '审核人',
            dataIndex: 'checkerName',
            width: 120,
        },
        {
            title: '审核时间',
            dataIndex: 'createTime',
            width: 120,
        },
        {
            title: '拒绝代码',
            dataIndex: 'checkCode',
            width: 120,
        },
        {
            title: '拒绝明细',
            dataIndex: 'checkRemark',
            width: 120,
        },
        {
            title: '审核结果',
            dataIndex: 'checkResult',
            width: 120,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width: 120,
        },
    ];

    _handleAudit = () => {
        this.setState({
            auditVisible: true,
        })
    };

    handleCancel = (e) => {
        if (e){
            this.props.history.go(-1);
        }
        this.setState({
            auditVisible: false
        })
    }

    _fetchData = async (params) => {
        try {
            const {code, message: msg, data} = await Http.reviewDetail(params);
            if (code === 200) {
                const {
                    telephoneList, addressList, messageList, loanInfo, personInfo, bankAccountInfo, riskAduitDetail, contactInfo, headInfo, historyLoan,
                    phoneCallRecord
                } = data;
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
                    {id: 0, label: '用户Id', value: loanInfo.userId},
                    {id: 1, label: '借款订单号', value: loanInfo.loanOrderId},
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
                    //     id: 0,
                    //     label: '图片信息',
                    //     value: [
                            {id: 0, label: '身份证正面', value: personInfo.idNumberPositive, style: 'img'},
                            {id: 1, label: '身份证反面', value: personInfo.idNumberNegative, style: 'img'},
                            {id: 2, label: '人脸识别', value: personInfo.face, style: 'img'},
                    //     ]
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

                console.log('headInfo',headInfo)

                this.setState({
                    contactInfo: contactInfo ? contactInfo : [],
                    telephoneList: telephoneList ? telephoneList : 0,
                    messageList: messageList ? messageList : 0,
                    addressList: addressList ? addressList : 0,
                    historyLoan: historyLoan ? historyLoan : [],
                    phoneCallRecord: phoneCallRecord ? phoneCallRecord : [],
                    loanInfo: newLoanInfo,
                    personInfo: newPersonInfo,
                    bankAccountInfo: newBankAccountInfo,
                    riskAuditDetail: riskAduitDetail ? riskAduitDetail : [],
                    headInfo: headInfo ? headInfo : []
                });
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            this.setState({
                loading: false
            })
        } catch (e) {
            this.setState({
                loading: false
            })
            console.log('e', e);
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    }; 
    _handleTaoBaoVisible = (e) => {
        this.setState({
            taoBaoVisible: e,
        })
    }

    _handleSlcVisible = (e) => {
        this.setState({
            slcVisible: e,
        })
    }

    _handleR360ReportVisible = (e) => {
        this.setState({
            r360ReportVisible: e
        })
    }

    _handleBlackFishReportVisible = (e) => {
        this.setState({
            blackFishReportVisible: e
        })
    }

    _handlePhoneMailListVisible = (e) => {
        this.setState({
            phoneMailListVisible: e
        })
    }

    _handlePhoneMessageVisible = (e) => {
        this.setState({
            phoneMessageVisible: e
        })
    }

    phoneMessageShow = () => {
        this._handlePhoneMessageVisible(true);
    }

    phoneMailListShow = () => {
        this._handlePhoneMailListVisible(true);
    }
    

    r360ReportShow = () => {
        this._handleR360ReportVisible(true);
    }

    blackFishReportShow= () => {
        this._handleBlackFishReportVisible(true);
    }

    taoBaoShow = () => {
        this._handleTaoBaoVisible(true);
    }

    slcShow = () => {
        this._handleSlcVisible(true);
    }

    render() {
        const {
            orderId, blackFishReportVisible, slcVisible, type, auditVisible, taoBaoVisible, phoneMessageVisible, phoneMailListVisible, userId, r360ReportVisible, telephoneList, messageList, addressList, headInfo, loading, loanInfo, personInfo, bankAccountInfo, phoneCallRecord, contactInfo, historyLoan, riskAuditDetail
        } = this.state;
        const options={toolbar: false}
        return (
            <div className='review-detail'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='借贷信息'
                        icon='yonghu'
                    />
                    <Row className="pad10 mrg-b15">
                        {
                            loanInfo.length > 0 ? loanInfo.map(i => {
                                const {id, label, value} = i;
                                return (
                                    <Col key={`loanInfo_${id}`} {...ColConfig}>
                                        {label}：{value}
                                    </Col>
                                )
                            }) : <span>暂无信息</span>
                        }
                    </Row>
                    <TitleLine
                        title='个人信息'
                        icon='yonghu'
                    />
                    <Row className="pad10 mrg-b15">
                        {
                            personInfo.length > 0 ? personInfo.map(i => {
                                const {id, label, value, style} = i;
                                // if (id === 0) {
                                //     let ele = value.map(ii => {
                                //         return (
                                //             <span key={`img_key_${ii.id}`}>
                                //                 {ii.label}：{ii.value}
                                //             </span>
                                //         )
                                //     });
                                //     return (
                                //         <Col key={`personInfo_${id}`} xs={24} sm={24} md={24}>
                                //             {ele}
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
                            }) : <span>暂无信息</span>
                        }
                    </Row>
                    <TitleLine
                        title='银行账户信息'
                        icon='yonghu'
                    />
                    <Row className="pad10 mrg-b15">
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

                    {/* <TitleLine
                        title='来电记录'
                        icon='yonghu'
                    />
                    <Row className="pad10 mrg-b15">

                        {
                            phoneCallRecord.length > 0
                                ?
                                phoneCallRecord.map((i, index) => {
                                    const {mobile, createTime, reason} = i;
                                    return (
                                        <Col key={`${mobile}_${createTime}_${reason}`} sm={24} md={24} xs={24}>
                                            <span>
                                                <label>{index}、来电号码：{mobile}</label>
                                                <label>来电时间：{createTime}</label>
                                                <label>来点内容：{reason}</label>
                                            </span>
                                        </Col>
                                    )
                                })
                                : <Col key={`phoneCallRecord`} sm={24} md={24} xs={24}>
                                    <div className="ant-empty ant-empty-normal">
                                        <div className="ant-empty-image">
                                            <img alt='暂无数据' src={Sample}/>
                                        </div>
                                        <p className="ant-empty-description" style={{color: 'rgba(0,0,0,0.45)'}}>暂无数据</p>
                                    </div>
                                </Col>
                        }
                    </Row> */}
                    <TitleLine
                        title='联系人'
                        icon='yonghu'
                    />
                    <Table
                        bordered
                        size='small'
                        columns={this.contactInfoColumns}
                        rowKey='id'
                        dataSource={contactInfo}
                        pagination={{total: -1}}
                        className="pad10"
                        //loading={loading}
                        //onChange={this._handleTableChange}
                        //scroll={{x: 1500, y: tableHeight}}
                    />
                    <div className="contact-tip pad10 mrg-b15">
                        {/* <span>
                            通讯录&通话清单（{telephoneList}）
                        </span> */}
                        <span  onClick={()=>this.phoneMailListShow()}>
                            手机通讯录（{addressList}）
                        </span>
                        <span onClick={()=>this.r360ReportShow()}>
                            融360运营商报告
                        </span>
                        <span onClick={()=>this.phoneMessageShow()}>
                            手机短信（{messageList}）
                        </span>
                        <span onClick={()=>this.taoBaoShow()}>
                            淘宝查询
                        </span>
                        <span onClick={()=>this.slcShow()}>
                            多头查询
                        </span>
                        <span onClick={()=>this.blackFishReportShow()}>
                            小黑鱼摩羯运营商报告
                        </span>
                    </div>
                    {/* <TitleLine
                        title='多头信息'
                        icon='yonghu'
                    />
                    {headInfo.length > 0 ? <Descriptions className="head-info pad10 mrg-b15" bordered title="" border size={'small'}>
                        <Descriptions.Item label="分类" span={3}>结果</Descriptions.Item>
                            {headInfo.map((i,key) => {
                                const {sort, result} = i;
                                return (
                                    <Descriptions.Item key={key} label={sort} span={3}>{result}</Descriptions.Item>
                                )
                            })}
                        </Descriptions>
                        : <span className="pad10 mrg-b15 dis-b">暂无信息</span>
                    } */}
                    <TitleLine
                        title='历史借款'
                        icon='yonghu'
                    />
                    <Table
                        bordered
                        size='small'
                        columns={this.historyLoanColumns}
                        rowKey='id'
                        dataSource={historyLoan}
                        pagination={{total: -1}}
                        className="pad10 mrg-b15"
                        //loading={loading}
                        //onChange={this._handleTableChange}
                        //scroll={{x: 1500, y: tableHeight}}
                    />
                    <TitleLine
                        title='风控审核详情'
                        icon='yonghu'
                    />
                    <Table
                        bordered
                        size='small'
                        columns={this.riskAuditDetailColumns}
                        rowKey='id'
                        dataSource={riskAuditDetail}
                        pagination={{total: -1}}
                        className="pad10 mrg-b15"
                        //loading={loading}
                        //onChange={this._handleTableChange}
                        //scroll={{x: 1500, y: tableHeight}}
                    />                   
                </Spin>
                {type === '1' && <Button type="primary" className="review-audit-box"
                        onClick={() => this._handleAudit()}
                    >
                        审核
                </Button>}
                <AuditForm
                    visible={auditVisible}
                    userId={userId}
                    orderId={orderId}
                    type={1}
                    handleCancel={this.handleCancel}
                />
                <SlcQuery userId={userId} visible={slcVisible} handleCancel={this._handleSlcVisible}></SlcQuery>
                <TaobaoQuery userId={userId} visible={taoBaoVisible} handleCancel={this._handleTaoBaoVisible}></TaobaoQuery>
                <R360Report userId={userId} visible={r360ReportVisible} handleCancel={this._handleR360ReportVisible}></R360Report>
                <PhoneMailList userId={userId} visible={phoneMailListVisible} handleCancel={this._handlePhoneMailListVisible}></PhoneMailList>
                <PhoneMessage userId={userId} visible={phoneMessageVisible} handleCancel={this._handlePhoneMessageVisible}></PhoneMessage>
                <BlackFishReport orderId={orderId} visible={blackFishReportVisible} handleCancel={this._handleBlackFishReportVisible}></BlackFishReport>
            </div>
        )
    }
}