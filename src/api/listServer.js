import api from '../utils/request';

export default{
    select(data){
        return new Promise((resolve, reject) => {
            api.post('cplist/alllist', data).then(res => {
                resolve(res.data)
            })
        })
    },
    clList(data){
        return new Promise((resolve, reject) => {
            api.post('cplist/list', data).then(res => {
                resolve(res.data)
            })
        })
    },
    save(data){
        return new Promise((resolve, reject) => {
            api.post('cplist/save', data).then(res => {
                resolve(res.data)
            })
        })
    },
    view(data){
        return new Promise((resolve, reject) => {
            api.post('cplist/view', data).then(res => {
                resolve(res.data)
            })
        })
    }
}