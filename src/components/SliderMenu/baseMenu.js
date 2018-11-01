import React from 'react';
import Cookies from 'js-cookie';
import router from 'umi/router';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

export default class BaseMenu extends React.Component{
    state = {
        menuList: Cookies.get('myAdminMenu') || []
    }
    getKey() {
        let isCollapsed = Cookies.get('togglecollapsed') || false
        let hash = location.hash.substr(1);
        let menuList = this.state.menuList;
        if (menuList == '[]' || menuList == undefined || menuList == '' || menuList.length == 0) {
            // router.push('/login');
            return {
                currentKey: '',
                parentKey: ''
            }
        }
        menuList = JSON.parse(menuList);

        for (let i = 0; i < menuList.length; i++){
            let item = menuList[i];
            let children = item.children;
            if (hash == item.href) {
                return {
                    parentKey: '',
                    currentKey: item.id.toString()
                }
            } else if (children && children.length > 0) {
                for (let j = 0; j < children.length; j++){
                    if (children[j].href == hash) {
                        return {
                            parentKey: isCollapsed == 'true' ? '' : item.id.toString(),
                            currentKey: children[j].id.toString()
                        }
                    }
                }
            }
        }

        return {
            currentKey: '',
            parentKey: ''
        }
    }
    getMenuList() {
        let menuList = Cookies.get('myAdminMenu');
        // debugger
        if (menuList == undefined || menuList == '' || menuList.length == 0) {
            router.push('/login');
            return [];
        }
        let menu = JSON.parse(menuList);
        menu.unshift({ href: '/', icon: 'home', id: 155454, title: '首页' });

        return menu;
    }
    myLink(child, parent) {
        let hash = location.hash.substr(1);
        if (hash == child.href) {
            return;
        }
        // if (parent && parent.id) {
        //     Cookies.set(OPENKEYS, parent);
        // } else {
        //     Cookies.set(OPENKEYS, '');
        // }
        // Cookies.set(CURRENTMENUID, child);
        router.push(child.href)
    }
    render() {
        return (
            <div>
                <Menu
                    mode="inline"
                    theme="dark"
                    defaultSelectedKeys={[this.getKey().currentKey]}
                    defaultOpenKeys={[this.getKey().parentKey]}
                >
                    {
                        this.getMenuList().map(item => {
                            if (item.children && item.children.length > 0) {
                                return (
                                    <SubMenu key={item.id} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
                                        {
                                            item.children.map(childrenItem => {
                                                return (
                                                    <Menu.Item key={childrenItem.id} onClick={this.myLink.bind(this,childrenItem,item)}>
                                                        <Icon type={childrenItem.icon} />
                                                        <span>{childrenItem.title}</span>
                                                    </Menu.Item>
                                                )

                                            })
                                        }
                                    </SubMenu>
                                )
                            } else {
                                return (
                                    <Menu.Item key={item.id} onClick={this.myLink.bind(this, item)}>
                                        {/* <Link to={item.path}> */}
                                            <Icon type={item.icon} />
                                            <span>{item.title}</span>
                                        {/* </Link> */}
                                    </Menu.Item>
                                )
                            }

                        })
                    }
                </Menu>
            </div>
        )
    }
}
