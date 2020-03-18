/**
 * @desc支付通道管理
 * */
import React from 'react';
import './PaymentChannelManager.less';
import {TitleLine, Http} from '../../components';
import {Button, Col, Form, InputNumber, Row, message, Spin} from 'antd';
import {ColConfig, AmountFormat} from '../../config';
import cloneDeep from 'lodash/cloneDeep';

class Main extends React.Component {

    state = {
        loading: false,
        repayList: [],
        payList: [],
        payStatus: '0',
        payListNew: [],
        idArray: [],
        repayStatus: '0'
    };

    componentDidMount() {
        this._fetchData();
    }

    _fetchData = async () => {
        try {
            this.setState({loading: true});
            const {code, message: msg, data} = await Http.financeTransChannel({});
            if (code === 200) {
                const {repay, pay} = data;
                this.setState({
                    repayList: repay,
                    payList: pay,
                    loading: false,
                });
               
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            this.setState({
                loading: false,
            });
        } catch (e) {
            console.log('e', e);
            this.setState({loading: false});
            console.log('e', e);
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    _changePayStatus = (status) => {
        this.setState({
            payStatus: status
        })
    }

    _changeRepayStatus = (status) => {
        this.setState({
            repayStatus: status
        })
    }

    passagewayStop = async (id, status) => {
        try {
            this.setState({loading: true});
            const {code, message: msg} = await Http.payChannelEnable({id,status});
            if (code === 200) {
                message.success('操作成功');
                this.setState({
                    payStatus: '0',
                    repayStatus: '0',
                    loading: true
                },function(){
                    this._fetchData();
                })
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            this.setState({
                loading: false,
            });
        } catch (e) {
            console.log('e', e);
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    balanceWarnValueChange = (id, value) => {
        console.log(id, value)
        let params = cloneDeep(this.state.payListNew);
        let ids = cloneDeep(this.state.idArray);
        if (ids.indexOf(id) !== -1) {
            for (let i in params) {
                if (params[i]['id'] === id) {
                    params[i]['balanceWarnValue'] =  value
                }
            }
        } else {
            params.push({
                id,
                balanceWarnValue: value
            })
            ids.push(id)
        }
        this.setState({
            payListNew: params,
            idArray: ids
        })
    }

    _balanceWarnValueSubmit = async () => {
        let params = this.state.payListNew;
        try {
            this.setState({loading: true});
            const {code, message: msg, data} = await Http.payChannelSave(params);
            if (code === 200) {
                message.success('操作成功');
                this.setState({
                    payStatus: '0',
                    repayStatus: '0',
                    loading: true
                },function(){
                    this._fetchData();
                })
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            this.setState({
                loading: false,
            });
        } catch (e) {
            console.log('e', e);
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };
  
    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {loading, payList, repayList, payStatus, repayStatus} = this.state;
        return (
            <div className='payment-channel-manager'>
                <Spin size='large' spinning={loading}>
                    <TitleLine
                        title='支付通道管理'
                        icon='yonghu'
                    />
                    {/* <Form onSubmit={this._handleSubmit}> */}
                    <div className="pay">
                        <div className="mag-top15">
                            <span className="module-title">
                                打款通道
                            </span>
                            {payStatus === '1' && <span className="module-submit">
                                <Button size="small" onClick={()=> this._balanceWarnValueSubmit()}>提交</Button>
                                <Button size="small" onClick={this._changePayStatus.bind(this,'0')}>关闭</Button>
                            </span>}
                            {payStatus === '0' && <span className="module-submit">
                                <Button size="small" onClick={this._changePayStatus.bind(this,'1')}>编辑状态</Button>
                            </span>}
                        </div>
                        <div className="module-box">
                            使用通道
                            {payList.map((item,index)=>
                                item.status === 1 && <div className="module-box-sm" key={index}>
                                    <div className="position-relative">
                                        <span>{item.channelName}</span>
                                        {payStatus === '1' && <Button size="small" className="module-right red-btn-style" onClick={()=>this.passagewayStop(item.id, 0)}>停用</Button>}
                                    </div>
                                    <Row className="mag-top15">
                                        <Col {...ColConfig}>   
                                            <span>账户余额预警值：{payStatus === '1' ? <InputNumber size="small" onChange={(value)=>this.balanceWarnValueChange(item.id, value)} defaultValue={AmountFormat(item.balanceWarnValue)}/> : AmountFormat(item.balanceWarnValue)}</span> 
                                        </Col>
                                        <Col {...ColConfig} className={`module-right ${item.balance < item.balanceWarnValue ? 'red-color' : ''}`}> 
                                            <span>当前账户余额：{AmountFormat(item.balance)}元， 更新时间：{item.updateTime ? item.updateTime : '--'}</span>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </div>
                        <div className="module-box">
                            备用通道
                            {payList.map((item,index)=>
                                item.status !== 1 && <div className="module-box-sm" key={index}>
                                    <div className="position-relative">
                                        <span>{item.channelName}</span>
                                        {payStatus === '1' && <Button size="small" className="module-right" onClick={()=>this.passagewayStop(item.id, 1)}>启用</Button>}
                                    </div>
                                    <Row className="mag-top15">
                                        <Col {...ColConfig}>   
                                            <span>账户余额预警值：{payStatus === '1' ? <InputNumber size="small" onChange={(value)=>this.balanceWarnValueChange(item.id, value)} defaultValue={AmountFormat(item.balanceWarnValue)}/> : AmountFormat(item.balanceWarnValue)}</span> 
                                        </Col>
                                        <Col {...ColConfig} className={`module-right ${item.balance < item.balanceWarnValue ? 'red-color' : ''}`}> 
                                            <span>当前账户余额：{AmountFormat(item.balance)}元， 更新时间：{item.updateTime ? item.updateTime : '--'}</span>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pay">
                        <div className="mag-top15">
                            <span className="module-title">
                                还款通道
                            </span>
                            {repayStatus === '1' && <span className="module-submit">
                                {/* <Button size="small">提交</Button> */}
                                <Button size="small" onClick={this._changeRepayStatus.bind(this,'0')}>关闭</Button>
                            </span>}
                            {repayStatus === '0' && <span className="module-submit">
                                <Button size="small" onClick={this._changeRepayStatus.bind(this,'1')}>编辑状态</Button>
                            </span>}
                        </div>
                        <div className="module-box">
                            使用通道
                            {repayList.map((item,index)=>
                                item.status === 1 && <div className="module-box-sm" key={index}>
                                    <div className="position-relative">
                                        <span>{item.channelName}</span>
                                        {repayStatus === '1' && <Button size="small" className="module-right red-btn-style" onClick={()=>this.passagewayStop(item.id, 0)}>停用</Button>}
                                    </div>
                                    <Row className="mag-top15">
                                        <Col {...ColConfig}>   
                                            {/* <span>账户余额预警值：{repayStatus === '1' ? <InputNumber size="small" onChange={()=>this._balanceWarnValueSubmit(item.id,'repay')} defaultValue={item.balanceWarnValue}/> : item.balanceWarnValue}</span>  */}
                                            <span>账户余额预警值：{AmountFormat(item.balanceWarnValue)}</span> 
                                        </Col>
                                        <Col {...ColConfig} className={`module-right ${item.balance < item.balanceWarnValue ? 'red-color' : ''}`}> 
                                            <span>当前账户余额：{AmountFormat(item.balance)}元， 更新时间：{item.updateTime ? item.updateTime : '--'}</span>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </div>
                        <div className="module-box">
                            备用通道
                            {repayList.map((item,index)=>
                                item.status !== 1 && <div className="module-box-sm" key={index}>
                                    <div className="position-relative">
                                        <span>{item.channelName}</span>
                                        {repayStatus === '1' && <Button size="small" className="module-right" onClick={()=>this.passagewayStop(item.id, 1)}>启用</Button>}
                                    </div>
                                    <Row className="mag-top15">
                                        <Col {...ColConfig}>   
                                            {/* <span>账户余额预警值：{repayStatus === '1' ? <InputNumber size="small" onChange={()=>this._balanceWarnValueSubmit(item.id,'repay')} defaultValue={item.balanceWarnValue}/> : item.balanceWarnValue}</span>  */}
                                            <span>账户余额预警值：{AmountFormat(item.balanceWarnValue)}</span> 
                                        </Col>
                                        <Col {...ColConfig} className={`module-right ${item.balance < item.balanceWarnValue ? 'red-color' : ''}`}> 
                                            <span>当前账户余额：{AmountFormat(item.balance)}元， 更新时间：{item.updateTime ? item.updateTime : '--'}</span>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* </Form> */}
                </Spin>
            </div>
        )
    }
}

export default Form.create()(Main);
