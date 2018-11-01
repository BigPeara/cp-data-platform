import api from '../utils/request'
import {  message } from 'antd';

export default {
    login(data) { // 登录
        return new Promise((resolve, reject) => {
            api.post('login/index', data).then(res => {
                resolve(res.data)
            })
        })
    },
    logout(data) { // 登出
        return new Promise((resolve, reject) => {
            api.post('login/logout', data).then(res => {
                resolve(res.data)
            })
        })
    },
    manager(data) { // 用户列表
        return new Promise((resolve, reject) => {
            api.post('admin/manager', data).then(res => {
                resolve(res.data)
            })
        })
    },
    viewmanager(data) { // 查看用户信息
        return new Promise((resolve, reject) => {
            api.post('admin/viewmanager', data).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    savemanager(data) { // 新建and编辑用户信息
        return new Promise((resolve, reject) => {
            api.post('admin/savemanager', data).then(res => {
                resolve(res.data)
            })
        })
    },
    delmanager(data) {  //删除用户名
        return new Promise((resolve, reject) => {
            api.post('admin/delmanager', data).then(res => {
                resolve(res.data);
                message.success("删除成功！");
            })
        })
    },
    savepwd(data) { // 修改密码
        return new Promise((resolve, reject) => {
            api.post('admin/savepwd', data).then(res => {
                resolve(res.data)
            })
        })
    },
    group(data) { // 角色列表
        return new Promise((resolve, reject) => {
            api.post('admin/group', data).then(res => {
                resolve(res.data)
            })
        })
    },
    addgroupinfo(data) { // 新增角色信息
        return new Promise((resolve, reject) => {
            api.post('admin/addgroupinfo', data).then(res => {
                resolve(res.data)
            })
        })
    },
    viewgroupmenu(data){  //查看角色菜单权限
        return new Promise((resolve, reject) => {
            api.post('admin/viewgroupmenu', data).then(res => {
                resolve(res.data)
            })
        })
    },
    savegroupinfo(data) { // 编辑角色信息
        return new Promise((resolve, reject) => {
            api.post('admin/savegroupinfo', data).then(res => {
                resolve(res.data)
            })
        })
    },
    savegroupmenu(data) { // 编辑角色菜单权限
        return new Promise((resolve, reject) => {
            api.post('admin/savegroupmenu', data).then(res => {
                resolve(res.data)
            })
        })
    },
    menu(data) { // 菜单列表
        return new Promise((resolve, reject) => {
            api.post('admin/menu', data).then(res => {
                resolve(res.data)
            })
        })
    },
    savemenu(data) { // 新增菜单列表
        return new Promise((resolve, reject) => {
            api.post('admin/savemenu', data).then(res => {
                resolve(res.data)
            })
        })
    },
    viewmenu(data) { // 查看菜单信息
        return new Promise((resolve, reject) => {
            api.post('admin/viewmenu', data).then(res => {
                resolve(res.data)
            })
        })
    },
    savemenu(data) { // 编辑菜单信息
        return new Promise((resolve, reject) => {
            api.post('admin/savemenu', data).then(res => {
                resolve(res.data)
            })
        })
    }
}
