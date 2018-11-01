import api from '../utils/request';
import { message } from 'antd';

export default{
    dailyList(data){
        return new Promise((resolve, reject) => {
            api.post('book/dailylist', data).then(res => {
                resolve(res.data)
            })
        })
    },
    dailyPush(data){
        return new Promise((resolve, reject) => {
            api.post('book/dailypush', data).then(res => {
                message.success('审核成功！');
                resolve(res.data)
            })
        })
    },
    dailySave(data){
        return new Promise((resolve, reject) => {
            api.post('book/savedaily', data).then(res => {
                resolve(res.data)
            })
        })
    },
    monthlyPush(data){
        return new Promise((resolve, reject) => {
            api.post('book/monthlypush', data).then(res => {
                resolve(res.data)
            })
        })
    },
    monthlyList(data){
        return new Promise((resolve, reject) => {
            api.post('book/monthlylist', data).then(res => {
                resolve(res.data)
            })
        })
    },
    selectList(data){
        return new Promise((resolve, reject) => {
            api.post('cplist/select', data).then(res => {
                resolve(res.data)
            })
        })
    }
}