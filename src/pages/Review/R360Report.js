/**
 * @desc 融360运营商报告
 * */
import React from 'react';
import './R360Report.less';
import {Button, message, Modal, Table, Descriptions} from 'antd';
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
        create_time: '',
        search_id: '',
        id_card: '',
        name: ''
    };

    columns1 = [
        {
            title: '月份',
            dataIndex: 'month',
            width: 100,
        },
        {
            title: '通话时长（s）',
            dataIndex: 'talk_seconds',
            width: 100,
        },
        {
            title: '通话次数',
            dataIndex: 'talk_cnt',
            width: 100,
        },
        {
            title: '主叫时长（s）',
            dataIndex: 'call_seconds',
            width: 100,
        },
        {
            title: '主叫次数',
            dataIndex: 'call_cnt',
            width: 100,
        },
        {
            title: '被叫时长（s）',
            dataIndex: 'called_seconds',
            width: 100,
        },
        {
            title: '被叫次数',
            dataIndex: 'called_cnt',
            width: 100,
        },
        {
            title: '短信总数',
            dataIndex: 'msg_cnt',
            width: 100,
        },
        {
            title: '发送短信数',
            dataIndex: 'send_cnt',
            width: 100,
        },
        {
            title: '接收短信数',
            dataIndex: 'receive_cnt',
            width: 100,
        },
        {
            title: '流量（MB）',
            dataIndex: 'net_flow',
            width: 100,
        },
        {
            title: '消费金额',
            dataIndex: 'call_consumption',
            width: 100,
        },
    ];

    columns2 = [
        {
            title: '地区',
            dataIndex: 'area',
            width: 100,
        },
        {
            title: '联系人号码数',
            dataIndex: 'contact_phone_cnt',
            width: 100,
        },
        {
            title: '通话时长（s）',
            dataIndex: 'talk_seconds',
            width: 100,
        },
        {
            title: '通话次数',
            dataIndex: 'talk_cnt',
            width: 100,
        },
        {
            title: '主叫时长（s）',
            dataIndex: 'call_seconds',
            width: 100,
        },
        {
            title: '主叫次数',
            dataIndex: 'call_cnt',
            width: 100,
        },
        {
            title: '被叫时长（s）',
            dataIndex: 'called_seconds',
            width: 100,
        },
        {
            title: '被叫次数',
            dataIndex: 'called_cnt',
            width: 100,
        },
        {
            title: '短信总数',
            dataIndex: 'msg_cnt',
            width: 100,
        },
        {
            title: '发送短信数',
            dataIndex: 'send_cnt',
            width: 100,
        },
        {
            title: '接收短信数',
            dataIndex: 'receive_cnt',
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
            dataIndex: 'phone',
            width: 50,
        },
        {
            title: '号码归属地',
            dataIndex: 'phone_location',
            width: 50,
        },
        {
            title: '首次联系时间',
            dataIndex: 'first_contact_date',
            width: 50,
        },
        {
            title: '最后联系时间',
            dataIndex: 'last_contact_date',
            width: 50,
        },
        {
            title: '通话时长（s）',
            dataIndex: 'talk_seconds',
            width: 50,
        },
        {
            title: '通话次数',
            dataIndex: 'talk_cnt',
            width: 50,
        },
        {
            title: '主叫时长（s）',
            dataIndex: 'call_seconds',
            width: 50,
        },
        {
            title: '主叫次数',
            dataIndex: 'call_cnt',
            width: 50,
        },
        {
            title: '被叫时长（s）',
            dataIndex: 'called_seconds',
            width: 50,
        },
        {
            title: '被叫次数',
            dataIndex: 'called_cnt',
            width: 50,
        },
        {
            title: '短信总数',
            dataIndex: 'msg_cnt',
            width: 50,
        },
        {
            title: '发送短信数',
            dataIndex: 'send_cnt',
            width: 50,
        },
        {
            title: '接收短信数',
            dataIndex: 'receive_cnt',
            width: 50,
        },
        {
            title: '近一周联系次数',
            dataIndex: 'contact_1w',
            width: 50,
        },
        {
            title: '近一个月联系次数',
            dataIndex: 'contact_1m',
            width: 50,
        },
        {
            title: '近三个月联系次数',
            dataIndex: 'contact_3m',
            width: 50,
        },
        {
            title: '三个月以上联系次数',
            dataIndex: 'contact_3m_plus',
            width: 50,
        },
        {
            title: '凌晨联系次数',
            dataIndex: 'contact_early_morning',
            width: 50,
        },
        {
            title: '早晨联系次数',
            dataIndex: 'contact_morning',
            width: 50,
        },
        {
            title: '上午联系次数',
            dataIndex: 'contact_forenoon',
            width: 50,
        },
        {
            title: '下午联系次数',
            dataIndex: 'contact_afternoon',
            width: 50,
        },
        {
            title: '夜晚联系次数',
            dataIndex: 'contact_evening',
            width: 50,
        },
        {
            title: '深夜联系次数',
            dataIndex: 'contact_midnight',
            width: 50,
        },
        {
            title: '是否全天联系',
            dataIndex: 'contact_all_day',
            width: 50,
            render: (text) => text ? '是': '否',
            
        },
        {
            title: '工作日练习次数',
            dataIndex: 'contact_weekday',
            width: 50,
        },
        {
            title: '周末联系次数',
            dataIndex: 'contact_weekend',
            width: 50,
        },
        {
            title: '节假日联系次数',
            dataIndex: 'contact_holiday',
            // width: 50,
        },
        // {
        //     title: '关系推测',
        //     dataIndex: '',
        //     width: 50,
        // },
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
        try {
            const {code, message: msg, data} = await Http.r360ReportGet({userId: this.props.userId});
            if (code === 200) {
                const {monthly_consumption,contact_area_analysis,call_log} = data.data;
                const {search_id,create_time} = data;
                const {id_card,name} = data.data.input_info;
                this.setState({
                    dataSource1: monthly_consumption,
                    dataSource2: contact_area_analysis,
                    dataSource3: call_log,
                    create_time,
                    search_id,
                    id_card,
                    name
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
        const {id_card, name, visible, loading, dataSource1, dataSource2, dataSource3, create_time, search_id} = this.state;

        return (
            <div className='r360-report-box'>
                    <Modal
                        centered
                        width="96%"
                        destroyOnClose={true}
                        title={`融360运营商报告`}
                        visible={visible}
                        onCancel={this._handleCancel}
                        footer={[
                            <Button key="back" onClick={this._handleCancel}>取消</Button>,
                        ]}
                    >
                        <Descriptions bordered title="报告基本信息" border size="small" column={4} className="mar-bot15">
                            <Descriptions.Item label="报告编号">{search_id}</Descriptions.Item>
                            <Descriptions.Item label="报告生成时间">{create_time}</Descriptions.Item>
                            <Descriptions.Item label="用户姓名">{name}</Descriptions.Item>
                            <Descriptions.Item label="身份证号">{id_card}</Descriptions.Item>
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