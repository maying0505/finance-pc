import React from 'react';
import {Layout, Menu, Icon, Divider, Modal, Tooltip, Input, message, Button } from 'antd';
import {Route, Switch} from "react-router-dom";
import {Http, Iconfont} from '../../components';
import './index.less';
import {LALogo, LALogoName, IconArr} from '../../assets';
import {SessionStorage} from '../../utils';
import {StorageKeys} from '../../config';
import {LayoutRoute} from '../../route';
import {inject} from 'mobx-react';
import unfold from '../../assets/png/unfold.png';
import fold from '../../assets/png/fold.png';

const {Content, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class SiderDemo extends React.Component {

    state = {
        collapsed: false,
        defaultSelectedKeys: [],
        defaultOpenKeys: [],
        openKeys: [],
        oldPassword: null,
        password: null,
    };

    componentWillMount() {
        const {menu} = SessionStorage.get(StorageKeys.userInfo);
        let curPath = this.props.location.pathname;
        
        console.log('curPath',curPath)
        if (menu) {
            if (curPath === '/main') {
                let item = {};
                if (menu[0].children) {
                    item = menu[0].children[0];
                } else {
                    item = menu[0];
                }
                let key = null;
                const openKey = `${menu[0].id}`;
                if (Object.keys(item).length > 0) {
                    const {id, href} = item;
                    key = `${href}`;
                }
                if (!key && !openKey) {
                    return;
                }
                this._onClick({key})
                this.setState({
                    defaultSelectedKeys: [key],
                    defaultOpenKeys: [openKey],
                    openKeys: [openKey]
                });
            } else {
                let path = curPath.replace("/main/","");
                for (let item of LayoutRoute) {
                    if (curPath.indexOf(item.path) !== -1) {
                        console.log('sss:',curPath,item.path)
                        if (curPath === item.path) {
                            this.setState({
                                defaultSelectedKeys: [path],
                            });
                            this.props.history.push(item.path);
                        } else {
                            path = item.path.replace("/main/","");
                            this.setState({
                                defaultSelectedKeys: [path],
                            });
                            this.props.history.push(curPath);
                        }
                    }
                }
    
                for (let val of menu) {
                    if (val.children) {
                        for (let item of val.children) {
                            if (item.href === path) {
                                this.setState({
                                    defaultOpenKeys: [val.id],
                                    openKeys: [val.id]
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    // onCollapse = (collapsed) => {
    //     this.setState({collapsed});
    //     const {SideModel} = this.props;
    //     SideModel.updateCollapsed(collapsed);
    // };

    _onClick = ({item, key, keyPath}) => {
        console.log('_onClickkey', {item, key, keyPath});
        const target = key;
        SessionStorage.remove(StorageKeys.allDivisionQuery);
        SessionStorage.set(StorageKeys.currentMenuKey, target);
        
        const path = this._pathWithTarget(target);
        if (path) {
            this.props.history.push(path);
        }
    };

    onOpenChange = (openKeys) => {
        this.setState({
            openKeys: openKeys.length > 0 ? [openKeys[openKeys.length-1]] : []
        })
    }

    _pathWithTarget = (target) => {
        for (let item of LayoutRoute) {
            if (item.path === '/main/'+target) {
                return item.path
            }
        }
    };

    _renderMenuItem = (item,index) => {
        const {id, name, href, children} = item;
        const {collapsed} = this.state;
        if (children) {
            const icon = this._menuIcon(name);
            return (
                <SubMenu
                    key={`${id}`}
                    className={`${collapsed ? 'collapsedBox' : ''}`}
                    title={
                        <span>
                            <img className='anticon-icon' src={icon}/>
                            {!collapsed && <span>{name}</span>}
                        </span>
                    }
                >
                    {children.map((item,index) => this._renderMenuItem(item,index))}
                </SubMenu>
            )
        } else {
            return (
                <Menu.Item key={`${href}`} style={{paddingLeft: '20px'}}>
                    <span>{name}</span>
                </Menu.Item>
            )
        }
    };

    _menuIcon = (name) => {
        switch (name) {
            case '配置管理': {
                return IconArr[0];
            }
            case '打款管理': {
                return IconArr[1];
            }
            case '贷前管理': {
                return IconArr[2];
            }
            case '还款管理': {
                return IconArr[3];
            }
            case '运营数据分析': {
                return IconArr[4];
            }
            case '渠道管理': {
                return IconArr[5];
            }
            case '内容管理': {
                return IconArr[6];
            }
            case '客服管理': {
                return IconArr[7];
            }
            case '财务报表': {
                return IconArr[8];
            }
            default: {
                return '';
            }
        }
    };

    _showConfirm = () => {
        Modal.confirm({
            title: '提示',
            content: '退出登录？',
            onOk: this._loginOut,
            onCancel: () => null,
        });
    };

    _loginOut = async () => {
        try {
            const {code, message: msg} = await Http.logout();
            if (code === 200) {
                SessionStorage.removeAll();
                this.props.history.replace('/login');
                this._destroyAll();
            } else {
                const msg1 = msg ? msg : '退出失败，请重试';
                message.warn(msg1);
            }
        } catch (e) {
            this.setState({loading: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }

    };

    _destroyAll = () => {
        Modal.destroyAll();
    };

    _handleLayOut = () => {
        this._showConfirm();
    };

    _handleChangePassword = () => {
        const ele = (
            <div>
                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                       type="password"
                       placeholder="旧密码"
                       onChange={e => this.setState({oldPassword: e.target.value})}
                />
                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                       type="password"
                       style={{marginTop: '5px'}}
                       placeholder="新密码"
                       onChange={e => this.setState({password: e.target.value})}
                />
            </div>
        );
        Modal.confirm({
            title: '修改密码',
            content: ele,
            onOk: () => {
                const {oldPassword, password} = this.state;
                if (!oldPassword || !password) {
                    message.info('输入旧密码或新密码');
                    return;
                }
                const params = {
                    oldPassword,
                    password,
                };
                this._onChangePassword(params);
            },
            onCancel: () => null,
        });
    };

    _onChangePassword = async (params) => {
        try {
            const {code, message: msg} = await Http.changePassword(params);
            if (code === 200) {
                message.success('修改成功');
                this._loginOut();
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.error(msg1);
            }
            this.setState({
                oldPassword: null,
                password: null,
            });
        } catch (e) {
            this.setState({
                oldPassword: null,
                password: null,
            });
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };

    toggleCollapsed = () => {
        if (!this.state.collapsed) {
            this.setState({
                openKeys: [],
            },function(){
                this.setState({
                    collapsed: !this.state.collapsed,
                });
            })
        } else {
            this.setState({
                collapsed: !this.state.collapsed,
            });
        }
    };

    render() {
        const {collapsed, defaultSelectedKeys, defaultOpenKeys, openKeys} = this.state;
        const {user: {name}, menu} = SessionStorage.get(StorageKeys.userInfo);
        const ele = () => {
            // if (collapsed) {
            //     return  <div className="collapsed-icon" onClick={this.toggleCollapsed}><img src={collapsed ? unfold : fold}/></div>
            //     // return <Tooltip title='退出'><Icon onClick={this._handleLayOut} type="logout"/></Tooltip>
            // }
            return (
                <div>
                    <Tooltip title='修改密码'>
                        {!collapsed ? <span onClick={this._handleChangePassword}><Icon type="user"/>&nbsp;{name}</span> : <Icon type="user" onClick={this._handleChangePassword}/>}
                    </Tooltip>
                    <Divider type="vertical"/>
                    <Tooltip title='退出'>
                        {!collapsed ? <span onClick={this._handleLayOut}><Icon type="logout"/>&nbsp;退出</span> : <Icon type="logout"  onClick={this._handleLayOut}/>}
                    </Tooltip>
                    <div className="collapsed-icon" onClick={this.toggleCollapsed}><img src={collapsed ? fold : unfold}/></div>
                </div>
            );
        };
        return (
            <Layout className='my-layout' style={{minHeight: '100vh'}}>
                <Sider
                    // collapsible
                    collapsed={collapsed}
                    // onCollapse={this.onCollapse}
                    // inlineCollapsed={collapsed}
                    style={{
                        backgroundColor: '#222632',
                    }}
                    className='sider'
                >
                    <div className="logo">
                        <img src={collapsed ? LALogo : LALogoName} alt='诚要金'/>
                    </div>
                    <div className='menu-box'>
                        <div className='menu-view'>
                            <Menu
                                theme="dark"
                                defaultOpenKeys={defaultOpenKeys}
                                defaultSelectedKeys={defaultSelectedKeys}
                                openKeys={openKeys}
                                mode="inline"
                                onClick={this._onClick}
                                onOpenChange={this.onOpenChange}
                            >
                                {menu ? menu.map((item,index) => this._renderMenuItem(item,index)):null}
                            </Menu>
                        </div>
                    </div>
                    <div className='layout-button'>
                        {ele()}
                    </div>
                </Sider>
                <Layout>
                    <Content style={{padding: '8px', backgroundColor: '#f0f3f6'}}>
                        <div className='outer-content'>
                            <div className='inner-content'>
                                <Switch>
                                    {LayoutRoute.map((item, index) => <Route key={index} {...item}/>)}
                                </Switch>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

const InjectSiderDemo = inject('SideModel')(SiderDemo);
export default InjectSiderDemo;