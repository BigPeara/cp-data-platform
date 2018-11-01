import api from '../utils/request'

export default {
    manager(data) { // 添加用户
        return new Promise((resolve, reject) => {
            api.get('manager', data).then(res => {
                resolve(res.data)
            })
        })
    }
}
