/**
 * @desc 小黑鱼摩羯运营商报告
 * */
import React from 'react';
import {Button, message, Modal, Table, Descriptions} from 'antd';
import './R360Report.less';
import PropTypes from 'prop-types';
import {Http} from "../../components";

class Main extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        handleCancel: PropTypes.func.isRequired,
        orderId: PropTypes.string.isRequired,
    };

    static defaultProps = {};

    state = {
        loading: true,
        visible: false,
        dataSource1: [],
        dataSource2: [],
        dataSource3: [],
        baseInfo: {},
        createTime: '', 
        blackfishOrderId: '',
    };

    columns1 = [
        {
            title: '月份',
            dataIndex: 'cell_mth',
            width: 100,
        },
        {
            title: '通话时长（s）',
            dataIndex: 'call_time',
            width: 100,
        },
        {
            title: '通话次数',
            dataIndex: 'call_cnt',
            width: 100,
        },
        {
            title: '主叫时长（s）',
            dataIndex: 'dial_time',
            width: 100,
        },
        {
            title: '主叫次数',
            dataIndex: 'dial_cnt',
            width: 100,
        },
        {
            title: '被叫时长（s）',
            dataIndex: 'dialed_time',
            width: 100,
        },
        {
            title: '被叫次数',
            dataIndex: 'dialed_cnt',
            width: 100,
        },
        {
            title: '短信总数',
            dataIndex: 'sms_cnt',
            width: 100,
        },
        {
            title: '流量（MB）',
            dataIndex: 'net_flow',
            width: 100,
        },
        {
            title: '消费金额',
            dataIndex: 'total_amount',
            width: 100,
        },
    ];

    columns2 = [
        {
            title: '地区',
            dataIndex: 'region_loc',
            width: 100,
        },
        {
            title: '通话总时长（s）',
            dataIndex: 'region_call_time',
            width: 100,
        },
        {
            title: '通话次数',
            dataIndex: 'region_call_cnt',
            width: 100,
        },
        {
            title: '主叫时长（s）',
            dataIndex: 'region_dial_time',
            width: 100,
        },
        {
            title: '主叫次数',
            dataIndex: 'region_dial_cnt',
            width: 100,
        },
        {
            title: '被叫时长（s）',
            dataIndex: 'region_dialed_time',
            width: 100,
        },
        {
            title: '被叫次数',
            dataIndex: 'region_dialed_cnt',
            width: 100,
        },
    ];

    columns3 = [
        {
            title: '姓名',
            dataIndex: 'name',
            width: 50,
        },
        {
            title: '号码',
            dataIndex: 'peer_num',
            width: 50,
        },
        {
            title: '号码归属地',
            dataIndex: 'city',
            width: 50,
        },
        {
            title: '首次联系时间',
            dataIndex: 'trans_start',
            width: 50,
        },
        {
            title: '最后联系时间',
            dataIndex: 'trans_end',
            width: 50,
        },
        {
            title: '近6月通话时长',
            dataIndex: 'call_time_6m',
            width: 50,
        },
        {
            title: '近6月主叫时长',
            dataIndex: 'dial_time_6m',
            width: 50,
        },
        {
            title: '近6月主叫次数',
            dataIndex: 'dial_cnt_6m',
            width: 50,
        },
        {
            title: '近6月被叫时长',
            dataIndex: 'dialed_time_6m',
            width: 50,
        },
        {
            title: '近6月被叫次数',
            dataIndex: 'dialed_cnt_6m',
            width: 50,
        },
        {
            title: '近一周联系次数',
            dataIndex: 'call_cnt_1w',
            width: 50,
        },
        {
            title: '近一个月联系次数',
            dataIndex: 'call_cnt_1m',
            width: 50,
        },
        {
            title: '近三个月联系次数',
            dataIndex: 'call_cnt_3m',
            width: 50,
        },
        {
            title: '近六个月以上联系次数',
            dataIndex: 'call_cnt_6m',
            width: 50,
        },
        {
            title: '早晨联系次数',
            dataIndex: 'call_cnt_morning_6m',
            width: 50,
        },
        {
            title: '中午联系次数',
            dataIndex: 'call_cnt_noon_6m',
            width: 50,
        },
        {
            title: '下午联系次数',
            dataIndex: 'call_cnt_afternoon_6m',
            width: 50,
        },
        {
            title: '傍晚联系次数',
            dataIndex: 'call_cnt_evening_6m',
            width: 50,
        },
        {
            title: '凌晨联系次数',
            dataIndex: 'call_cnt_night_6m',
            width: 50,
        },
        {
            title: '近6个月是否全天联系',
            dataIndex: 'call_if_whole_day_6m',
            width: 50,
            render: (text) => text ? '是': '否',
        },
        {
            title: '近6月工作日通话次数',
            dataIndex: 'call_cnt_weekday_6m',
            width: 50,
        },
        {
            title: '近6月周末通话次数',
            dataIndex: 'call_cnt_weekend_6m',
            width: 50,
        },
        {
            title: '近6月节假日通话次数',
            dataIndex: 'call_cnt_holiday_6m',
            width: 50,
        },
    ];

    componentDidMount() {
        this.propsGet(this.props.visible);
    }

   
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsGet(nextProps);
    }

    propsGet = (props) => {
        if (props.visible !== this.state.visible) {
            this.setState({
                visible: props.visible
            },function(){
                if(this.state.visible) {
                    this.r360ReportShow();
                }
            })
        }
    }

    r360ReportShow = async () => {
        this.setState({
            loading: true
        })
        try {
            const {code, message: msg, data} = await Http.blackFishReport({orderId: this.props.orderId});
            if (code === 200) {
                const {createTime, blackfishOrderId} = data;
                const {callLog,monthBill,contactRegion,baseInfo} = data.data;
                this.setState({
                    dataSource1: monthBill,
                    dataSource2: contactRegion,
                    dataSource3: callLog,
                    baseInfo,
                    createTime,
                    blackfishOrderId,
                })
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
        const {createTime, blackfishOrderId, visible, loading, dataSource1, dataSource2, dataSource3, baseInfo} = this.state;

        return (
            <div className='r360-report-box'>
                    <Modal
                        centered
                        width="96%"
                        destroyOnClose={true}
                        title={`小黑鱼摩羯运营商报告`}
                        visible={visible}
                        onCancel={this._handleCancel}
                        footer={[
                            <Button key="back" onClick={this._handleCancel}>取消</Button>,
                        ]}
                    >
                        <Descriptions bordered title="报告基本信息" border size="small" column={4} className="mar-bot15">
                            <Descriptions.Item label="报告编号">{blackfishOrderId}</Descriptions.Item>
                            <Descriptions.Item label="报告生成时间">{createTime}</Descriptions.Item>
                            <Descriptions.Item label="用户姓名">{baseInfo['userName']}</Descriptions.Item>
                            <Descriptions.Item label="身份证号">{baseInfo['idCardNo']}</Descriptions.Item>
                        </Descriptions>
                       <Table
                            title={()=><span>运营商月消费</span>}
                            bordered
                            size='small'
                            columns={this.columns1}
                            rowKey='id'
                            dataSource={dataSource1}
                            pagination={false}
                            loading={loading}
                            style={{ wordBreak: 'break-all' }}
                            scroll={{ y: 500 }}
                        />
                        <Table
                            title={()=><span>联系人地区分析</span>}
                            bordered
                            size='small'
                            columns={this.columns2}
                            rowKey='area'
                            dataSource={dataSource2}
                            pagination={false}
                            loading={loading}
                            style={{ wordBreak: 'break-all' }}
                            scroll={{ y: 500 }}
                        />
                        <Table
                            title={()=><span>通话记录</span>}
                            bordered
                            size='small'
                            columns={this.columns3}
                            rowKey='area'
                            dataSource={dataSource3}
                            pagination={false}
                            loading={loading}
                            style={{ wordBreak: 'break-all' }}
                            scroll={{ y: 500 }}
                        />
                    </Modal>
            </div>
        )
    }
}

export default Main;