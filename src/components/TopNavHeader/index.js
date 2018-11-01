import React from 'react';
import systemApi from '@/api/system';
import Cookies from 'js-cookie';
import store from '@/store/index'
import styles from './index.less';
import router from 'umi/router';
import { Menu, Dropdown, Icon, Avatar } from 'antd';

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
export default class TopNavHeader extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            color: colorList[0],
            collapsed: store.collapsed,
            userName: Cookies.get('mangerName') || 'Admin'
        };
    }
    
    handleMenuClick = (e) => {
        this.setState({ visible: false });
    }
    componentDidMount() {
        store.subscribe(() =>
            this.setState({
                collapsed: store.getState()
            })
        );
    }
    handleVisibleChange = (flag) => {
        this.setState({ visible: flag });
    }
    toggle() {
        store.dispatch({ type: 'togglecollapsed' });  
    }
    linkLogin() {
        systemApi.logout().then(res => {
            router.push('/login')
        })

    }
    linkPassword() {
        router.push('/system/password')
    }
    linkAccount() {
        router.push('/system/account')
    }
    render() {
         const menu = (
            <Menu onClick={this.handleMenuClick}>
                 <Menu.Item key="1" onClick={this.linkAccount}>
                     <Icon type="user" />个人资料
                </Menu.Item>
                 <Menu.Item key="2" onClick={this.linkPassword}>
                     <Icon type="setting" />修改密码
                </Menu.Item>
                 <Menu.Item key="3" onClick={this.linkLogin}>
                     <Icon type="logout" />退出
                </Menu.Item>
            </Menu>
        );
        return (
            <div className={styles.lcHeader}>
                <Icon className={styles.lcTrigger} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle.bind(this)} />
                <div className={styles.headerRight}>
                    <div className={styles.lcAction}>
                        <Dropdown overlay={menu}
                            onVisibleChange={this.handleVisibleChange}
                            visible={this.state.visible}
                        >
                            <div className={styles.lcDropdown}>
                                <Avatar style={{ backgroundColor: this.state.color, verticalAlign: 'middle' }} size="large">
                                    {this.state.userName.substring(0, 1)}
                                </Avatar>
                                <span className={styles.dropdownName}>{this.state.userName}</span>
                            </div>
                        </Dropdown>
                    </div>
                    
                </div>
            </div>
        )
    }
}