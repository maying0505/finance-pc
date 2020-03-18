import React from 'react';
import './index.less';
import {Form, Input, Icon, Button, message, Spin} from 'antd';
import {Http} from '../../components';
import {SessionStorage} from '../../utils';
import {StorageKeys} from '../../config';

const TimeOut = 60;

class Main extends React.Component {

    state = {
        loading: false,
        userInput: null,
        hasSendCode: false,
        timeOut: TimeOut,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this._login(values);
            }
        });
    };

    _login = async (params) => {
        try {
            SessionStorage.removeAll();
            this.setState({loading: true});
            const {code, message: msg, data} = await Http.login(params);
            console.log('data',data)
            if (code === 200) {
                const {token, loginName, userId} = data;
                SessionStorage.set(StorageKeys.token, token);
                this._menuListGet(userId,loginName);
            } else {
                this.setState({loading: false});
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
        } catch (e) {
            console.log('login e', e);
            this.setState({loading: false});
            message.error('服务异常');
        }
    };

    _menuListGet  = async (id,name) => {
        console.log('id',id)
        try {
            const {code, message: msg, data} = await Http.menuList({userId: id});
            console.log('data',data)
            if (code === 200) {
                this.setState({loading: false});
                const userInfo = {menu: data && data[0] && data[0]['children'] ? data[0]['children'] : [], user: {id, name}};
                
                SessionStorage.set(StorageKeys.userInfo, userInfo);
                this.props.history.replace('/main');
            } else {
                this.setState({loading: false});
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
        } catch (e) {
            console.log('login e', e);
            this.setState({loading: false});
            message.error('服务异常');
        }
    };
    _onUserInputChange = (v) => {
        console.log('v', v);
        this.setState({userInput: v.target.value});
    };

    _onBtnClick = () => {
        this._onSendValidateCode();
        
    };

    _onSendValidateCode = async () => {
        try {
            const {userInput} = this.state;
            const {code, message: msg, data} =  await Http.loginCaptcha({},'mobile=' + userInput);
            if (code === 200) {
                message.info(msg);
                this.setState({hasSendCode: true, timeOut: TimeOut});
                let timeOut = TimeOut - 1;
                this.timer = setInterval(() => {
                    this.setState({timeOut: timeOut--});
                }, 1000);
            } else {
                const msg1 = msg ? msg : '发送失败';
                message.warn(msg1);
            }
        } catch (e) {
            message.error('服务异常');
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {loading, userInput, hasSendCode, timeOut} = this.state;
        const btnTxt = (() => {
            if (hasSendCode && timeOut !== 0) {
                return `${timeOut}秒后重新发送`;
            } else if (timeOut === 0 || hasSendCode === false) {
                return '点击发送验证码';
            }
        })();
        const buttonDisabled = (() => {
            if (/\d{11}/.test(userInput)) {
                if (hasSendCode && timeOut !== 0) {
                    return true;
                } else if (timeOut === 0 || hasSendCode === false) {
                    return false;
                }
            } else {
                return true;
            }
        })();
        return (
            <div className='login-cls'>
                <div className='login-box'>
                    <Spin size='large' spinning={loading}>
                        <h2>诚要金--贷前</h2>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('mobile', {
                                    rules: [{required: true, message: '请输入用户名！'},
                                    ],
                                })(
                                    <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                           placeholder="用户名" onChange={this._onUserInputChange}/>
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '请输入密码！'}],
                                })(
                                    <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                           type="password"
                                           placeholder="密码"/>
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('captcha', {
                                    rules: [{required: true, message: '请输入验证码！'}],
                                })(
                                    <Input prefix={<Icon type="block" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                           placeholder="验证码"
                                           suffix={
                                               <Button
                                                   onClick={this._onBtnClick}
                                                   disabled={buttonDisabled}
                                                   style={{width: '120px'}}
                                               >
                                                   {btnTxt}
                                               </Button>
                                           }
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </div>
            </div>
        )
    }
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(Main);
export default WrappedNormalLoginForm;