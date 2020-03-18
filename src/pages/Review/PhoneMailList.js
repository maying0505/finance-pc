/**
 * @desc 手机通讯录
 * */
import React from 'react';
import './PhoneMailList.less';
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
        dataSource: []
    };

    columns = [
        {
            title: '用户姓名/手机',
            dataIndex: 'id',
            width: 100,
        },
        {
            title: '联系人',
            dataIndex: 'name',
            width: 100,
        },
        {
            title: '联系人手机',
            dataIndex: 'mobile',
            width: 100,
        },
        {
            title: '上传时间',
            dataIndex: 'createTime',
            // width: 100,
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
                    this.phoneMailListShow();
                }
            })
        }
    }

    phoneMailListShow = async () => {
        try {
            const {code, message: msg, data} = await Http.phoneMailListGet({userId: this.props.userId});
            if (code === 200) {
                this.setState({
                    dataSource: data ? data : []
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
        const {dataSource, visible, loading} = this.state;
        return (
                <Modal
                    width="50%"
                    destroyOnClose={true}
                    title={`手机通讯录`}
                    visible={visible}
                    onCancel={this._handleCancel}
                    footer={[
                        <Button key="back" onClick={this._handleCancel}>取消</Button>,
                    ]}
                >
                    <Table
                        bordered
                        style={{ wordBreak: 'break-all' }}
                        size='small'
                        columns={this.columns}
                        rowKey='id'
                        dataSource={dataSource}
                        pagination={false}
                        loading={loading}
                        scroll={{ y: 500 }}
                    />
                </Modal>
        )
    }
}

export default Main;