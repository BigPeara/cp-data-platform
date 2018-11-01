import api from '../utils/request'

export default {
    ajaxgetmenu(data) { // 后台权限菜单
        return new Promise((resolve, reject) => {
            api.post('admin/ajaxgetmenu', data).then(res => {
                resolve(res.data)
            })
        })
    },
    login(data) { // 登录
        return new Promise((resolve, reject) => {
            api.post('login/index', data).then(res => {
                resolve(res.data)
            })
        })
    }
}
