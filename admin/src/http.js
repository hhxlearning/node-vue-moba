import axios from 'axios'
import Vue from 'vue'

const http = axios.create({
    baseURL: 'http://localhost:3000/admin/api'
})

http.interceptors.request.use( function(config) {
    //设置请求头
    config.headers.Authorization = 'Bearer ' + localStorage.token
    return config
})

http.interceptors.response.use( res => {
    return res
}, err => {
    if(err.response.data.message) {
        Vue.prototype.$message.error({
            message: err.response.data.message
        })
    }
    // console.log(err.response.data.message)
    return Promise.reject(err)
})

export default http
