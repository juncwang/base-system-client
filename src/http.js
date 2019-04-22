import axios from 'axios';
import { Loading, Message } from 'element-ui'
import router from './router'

let loading
function startLoading(){
    loading = Loading.service({
        lock: true,
        text: '拼命加载中 ... ',
        background: 'rgba(0,0,0,0.7)'
    })
}

function endLoading(){
    loading.close()
}

axios.interceptors.request.use(config => {
    startLoading()
    if (localStorage.getItem('baseSystem-Token')) {
        config.headers.token = localStorage.getItem('baseSystem-Token')
    }
    return config
}, err => {
    return Promise.reject(err)
})

axios.interceptors.response.use(res => {
    endLoading()
    Message.success(res.data.msg)
    return res
}, err => {
    endLoading()
    Message.error(err.response.data.msg)
    console.log(err)
    let status = err.response.status
    if(status == 401){
        localStorage.removeItem('baseSystem-Token')
        router.push('/login')
    }
    return Promise.reject(err)
})

export default axios