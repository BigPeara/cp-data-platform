import api from '../utils/request';

export default{
    companyList(data){
        return new Promise((resolve, reject) => {
            api.post('company/list', data).then(res => {
                resolve(res.data)
            })
        })
    },
    save(data){
        return new Promise((resolve, reject) => {
            api.post('company/save', data).then(res => {
                resolve(res.data)
            })
        })
    },
    view(data){
        return new Promise((resolve, reject) => {
            api.post('company/view', data).then(res => {
                resolve(res.data)
            })
        })
    }
}