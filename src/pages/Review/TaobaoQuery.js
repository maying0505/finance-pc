/**
 * @desc 淘宝查询
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
        dataSource2: []
    };

    columns1 = [
        {
            title: '订单id',
            dataIndex: 'order_id',
            width: 100,
        },
        {
            title: '订单状态',
            dataIndex: 'status',
            width: 150,
        },
        {
            title: '卖家id',
            dataIndex: 'seller_id',
            width: 150,
        },
        {
            title: '卖家昵称',
            dataIndex: 'seller_nick',
            width: 100,
        },
        {
            title: '店铺名称',
            dataIndex: 'seller_shopname',
            width: 100,
        },
        {
            title: '订单金额',
            dataIndex: 'actual_fee',
            width: 100,
        },
        {
            title: '是否手机订单',
            dataIndex: 'phone_order',
            width: 100,
            render: (text) => text ? <span>{text === 0 ? '否' : '是'}</span> :''
        },
        {
            title: '成交时间',
            dataIndex: 'transaction_time',
            width: 100,
        },
        {
            title: '付款时间',
            dataIndex: 'payment_time',
            width: 100,
        },
        {
            title: '确认时间',
            dataIndex: 'confirmation_time',
            width: 100,
        },
        {
            title: '收货人姓名',
            dataIndex: 'receiver_name',
            width: 100,
        },
        {
            title: '收货人手机号',
            dataIndex: 'receiver_telephone',
            width: 100,
        },
        {
            title: '收获地址',
            dataIndex: 'receiver_address',
            width: 150,
        },
    ];

    columns2 = [
        {
            title: '用户id',
            dataIndex: 'tb_user_id',
            width: 100,
        },
        {
            title: '收货人姓名',
            dataIndex: 'receiver_name',
            width: 150,
        },
        {
            title: '所在地区',
            dataIndex: 'area',
            width: 150,
        },
        {
            title: '详细地址',
            dataIndex: 'address',
            width: 100,
        },
        {
            title: '邮编',
            dataIndex: 'zip_code',
            width: 100,
        },
        {
            title: '电话/手机',
            dataIndex: 'phone',
            width: 100,
        },
        {
            title: '是否默认地址',
            dataIndex: 'is_default_address',
            width: 100,
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
                    this.phoneMessageShow();
                }
            })
        } 
    }

    phoneMessageShow = async () => {
        try {
            const {code, message: msg, data} = await Http.taobaoDetail({userId: this.props.userId});
            if (code === 200) {
                if (data && data.data && data.data.length > 0) {
                    this.setState({
                        dataSource1: data.data[0]['tb_orders'] ? data.data[0]['tb_orders'] : [],
                        dataSource2: data.data[0]['tb_deliver_addrs'] ? data.data[0]['tb_deliver_addrs'] : [],
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
        const {visible, loading, dataSource1, dataSource2} = this.state;

        return (
            <div className='artificial-audit-state-change'>
                    <Modal
                        centered
                        width="90%"
                        destroyOnClose={true}
                        title={`淘宝查询`}
                        visible={visible}
                        onCancel={this._handleCancel}
                        footer={[
                            <Button key="back" onClick={this._handleCancel}>取消</Button>,
                        ]}
                    >
                      <Table
                            title={()=><span>淘宝订单信息</span>}
                            bordered
                            size='small'
                            columns={this.columns1}
                            rowKey='id'
                            dataSource={dataSource1}
                            pagination={false}
                            loading={loading}
                            style={{ wordBreak: 'break-all' }}
                            // scroll={{y: 700 }}
                        />
                         <Table
                            title={()=><span>淘宝收货地址信息</span>}
                            bordered
                            size='small'
                            columns={this.columns2}
                            rowKey='id'
                            dataSource={dataSource2}
                            pagination={false}
                            loading={loading}
                            style={{ wordBreak: 'break-all' }}
                            // scroll={{y: 700 }}
                        />
                    </Modal>
            </div>
        )
    }
}

export default Main;