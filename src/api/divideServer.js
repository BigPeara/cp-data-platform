import api from '../utils/request';
import { message } from 'antd';

export default{
    monthList(data){
        return new Promise((resolve, reject) => {
            api.post('fall/monthlist', data).then(res => {
                resolve(res.data)
            })
        })
    },
    savemonth(data){
        return new Promise((resolve, reject) => {
            api.post('fall/savemonth', data).then(res => {
                resolve(res.data)
            })
        })
    },
    viewmonth(data){
        return new Promise((resolve, reject) => {
            api.post('fall/viewmonth', data).then(res => {
                resolve(res.data)
            })
        })
    },
    adList(data){
        return new Promise((resolve, reject) => {
            api.post('fall/adlist', data).then(res => {
                resolve(res.data)
            })
        })
    },
    savead(data){
        return new Promise((resolve, reject) => {
            api.post('fall/savead', data).then(res => {
                resolve(res.data)
            })
        })
    },
    viewad(data){
        return new Promise((resolve, reject) => {
            api.post('fall/viewad', data).then(res => {
                resolve(res.data)
            })
        })
    },
    bookList(data){
        return new Promise((resolve, reject) => {
            api.post('book/list', data).then(res => {
                resolve(res.data)
            })
        })
    },
    bookSave(data){
        return new Promise((resolve, reject) => {
            api.post('book/save', data).then(res => {
                resolve(res.data)
            })
        })
    },
    bookView(data){
        return new Promise((resolve, reject) => {
            api.post('book/view', data).then(res => {
                resolve(res.data)
            })
        })
    },
    calculate(data) {
        return new Promise((resolve, reject) => {
            api.post('fall/calculate', data).then(res => {
                message.success("计算成功!");
                resolve(res.data)
            })
        })
    }
}