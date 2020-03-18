/**
 * @desc 多头查询
 * */
import React from 'react';
import {Button, message, Modal, Table} from 'antd';
import PropTypes from 'prop-types';
import {Http} from "../../components";

class Main extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        handleCancel: PropTypes.func.isRequired,
        userId: PropTypes.string.isRequired,
    };

    static defaultProps = {};

    state = {
        loading: true,
        visible: false,
        dataSource1: [],
        dataSource2: [],
        dataSource3: [],
        dataSource4: []
    };

    columns1 = [
        {
            title: '借款时间',
            dataIndex: 'loanDate',
            width: 100,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 150,
        },
        {
            title: '借款金额',
            dataIndex: 'loanAmount',
            width: 150,
        },
        {
            title: '借款类型',
            dataIndex: 'loanType',
            width: 100,
            render: (text) => <span>{this.loanTypeShow(text)}</span>
        },
        {
            title: '期数',
            dataIndex: 'periods',
            width: 100,
        },
        {
            title: '审批结果',
            dataIndex: 'approvalStatus',
            width: 100,
            render: (text) => <span>{this.approvalStatusShow(text)}</span>
        },
        {
            title: '还款状态',
            dataIndex: 'loanStatus',
            width: 100,
            render: (text) => <span>{this.loanStatusShow(text)}</span>
        },
        {
            title: '逾期金额',
            dataIndex: 'overdueAmount',
            width: 100,
        },
        {
            title: '逾期期数',
            dataIndex: 'overdueStatus',
            width: 100,
        },
        {
            title: '历史逾期总次数',
            dataIndex: 'overdueTotal',
            width: 100,
        },
        {
            title: 'M3+逾期次数',
            dataIndex: 'overdueM3',
            width: 100,
        },
        {
            title: 'M6+逾期次数',
            dataIndex: 'overdueM6',
            width: 100,
        },
    ];

    columns2 = [
        {
            title: '总共查询次数',
            dataIndex: 'orgCountTotal',
            width: 100,
        },
        {
            title: '总查询机构数',
            dataIndex: 'otherOrgCount',
            width: 150,
        },
    ];

    columns3 = [
        {
            title: '时间',
            dataIndex: 'time',
            width: 100,
        },
        {
            title: '类型',
            dataIndex: 'orgType',
            width: 150,
            render: (text) => <span>{this.orgTypeShow(text)}</span>

        },
        {
            title: '机构',
            dataIndex: 'orgName',
            width: 100,
        },
    ];

    columns4 = [
        {
            title: '风险最近时间',
            dataIndex: 'riskTime',
            width: 100,
        },
        {
            title: '命中项',
            dataIndex: 'riskItemType',
            width: 150,
            render: (text) => <span>{this.riskItemTypeShow(text)}</span>
        },
        {
            title: '命中内容',
            dataIndex: 'riskItemValue',
            width: 100,
        },
        {
            title: '风险明细',
            dataIndex: 'riskDetail',
            width: 100,
        },
    ];

    componentDidMount() {
        this.propsGet(this.props.visible);
    }

   
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsGet(nextProps);
    }
    
    orgTypeShow = (text) => {
        let showText = null;
        switch (text) {
            case 'P2P': showText = 'P2P';break;
            case 'P2P_CAR_LOAN': showText = 'P2P-车贷';break;
            case 'P2P_HOUSE_LOAN': showText = 'P2P-房贷';break;
            case 'NONE_LICENSED_CONSUMER_FINANCE': showText = '非持牌消金';break;
            case 'NONE_LICENSED_CASH_LOAN': showText = '非持牌消金-小额现金贷';break;
            case 'NONE_LICENSED_CONSUMPTION_PERIOD': showText = '非持牌消金-消费分期';break;
            case 'LICENSED_CONSUMER_FINANCE': showText = '持牌消费金融';break;
            case 'BANK': showText = '银行';break;
            case 'FINANCE_LEASING': showText = '融资租赁';break;
            case 'MICRO_FINANCE': showText = '小贷';break;
            case 'PAWN_SHOP': showText = '典当';break;
            case 'GUARANTEE': showText = '担保';break;
            case 'PORTAL': showText = '平台门户';break;
            case 'CAPITAL_PLATFORM': showText = '资金平台';break;
            case 'INSURANCE': showText = '保险';break;
            case 'FACTORING': showText = '保理';break;
            default: showText = '';
        }
        return showText;
    }

    riskItemTypeShow = (text) => {
        let showText = null;
        switch (text) {
            case 'ID_NO': showText = '证件号码';break;
            default: showText = '';
        }
        return showText;
    }

    loanTypeShow = (text) => {
        let showText = null;
        switch (text) {
            case 'CREDIT': showText = '信用';break;
            case 'MORTGAGE': showText = '抵押';break;
            case 'GUARANTEE': showText = '担保';break;
            default: showText = '';
        }
        return showText;
    }
    
    loanStatusShow = (text) => {
        let showText = null;
        switch (text) {
            case 'NORMAL': showText = '正常';break;
            case 'OVERDUE': showText = '逾期';break;
            case 'COMPLETED': showText = '结清';break;
            default: showText = '';
        }
        return showText;
    }

    approvalStatusShow = (text) => {
        let showText = null;
        switch (text) {
            case 'IN_PROGRESS': showText = '审核中';break;
            case 'ACCEPT': showText = '批贷已放款';break;
            case 'REJECT': showText = '拒贷';break;
            case 'CUSTOMER_REJECT': showText = '客户放弃';break;
            default: showText = '';
        }
        return showText;
    }

    propsGet = (props) => {
        if (props.visible !== this.state.visible) {
            this.setState({
                visible: props.visible
            },function(){
                if(this.state.visible) {
                    this.phoneMessageShow();
                }
            })
        } 
    }

    phoneMessageShow = async () => {
        try {
            const {code, message: msg, data} = await Http.slcDetail({userId: this.props.userId});
            if (code === 200) {
                if (data && data.data) {
                    this.setState({
                        dataSource1: data.data['loanRecords'] ? data.data['loanRecords'] : [],
                        dataSource3: data.data['queriedHistory'] && data.data['queriedHistory']['checkedRecords'] ? data.data['queriedHistory']['checkedRecords'] : [],
                        dataSource4: data.data['riskResults'] ? data.data['riskResults'] : [],
                        dataSource2: data.data['queriedHistory'] ? [{orgCountTotal: data.data['queriedHistory']['orgCountTotal'],otherOrgCount: data.data['queriedHistory']['otherOrgCount']}] : [],
                    })
                }
                
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

    changeState = (stateName, stateValue) => {
        this.setState({[stateName]: stateValue});
    };

    _handleCancel = () => {
        const { handleCancel } = this.props;
        handleCancel(false);
    };

    render() {
        const {visible, loading, dataSource1, dataSource2, dataSource3, dataSource4} = this.state;

        return (
            <div className='artificial-audit-state-change'>
                    <Modal
                        centered
                        width="90%"
                        destroyOnClose={true}
                        title={`多头查询`}
                        visible={visible}
                        onCancel={this._handleCancel}
                        footer={[
                            <Button key="back" onClick={this._handleCancel}>取消</Button>,
                        ]}
                    >
                      <Table
                            title={()=><span>借款与申请记录</span>}
                            bordered
                            size='small'
                            columns={this.columns1}
                            rowKey='id'
                            dataSource={dataSource1}
                            pagination={false}
                            loading={loading}
                            style={{ wordBreak: 'break-all' }}
                        />
                         <Table
                            title={()=><span>机构的查询次数</span>}
                            bordered
                            size='small'
                            columns={this.columns2}
                            rowKey='id'
                            dataSource={dataSource2}
                            pagination={false}
                            loading={loading}
                            style={{ wordBreak: 'break-all' }}
                        />
                        <Table
                            bordered
                            size='small'
                            columns={this.columns3}
                            rowKey='id'
                            dataSource={dataSource3}
                            pagination={false}
                            loading={loading}
                            style={{ wordBreak: 'break-all' }}
                        />
                        <Table
                            title={()=><span>风险项纪录</span>}
                            bordered
                            size='small'
                            columns={this.columns4}
                            rowKey='id'
                            dataSource={dataSource4}
                            pagination={false}
                            loading={loading}
                            style={{ wordBreak: 'break-all' }}
                        />
                    </Modal>
            </div>
        )
    }
}

export default Main;