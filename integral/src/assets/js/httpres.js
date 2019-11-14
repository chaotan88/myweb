import Vue from 'vue'
import router from '../../.././src/router'
import axios from 'axios'

// http request 拦截器
axios.interceptors.request.use(config => {
  let integralUserInfo = JSON.parse(localStorage.getItem('integralUserInfo')) || {}
  /**
   * 请求发出前,在接口后面拼接参数
   */
  let params = (config.url.indexOf('?') === -1 ? '?' : '&') + 'clientType=1&belongSystem=9&token=' + (integralUserInfo.token ? integralUserInfo.token : '')
  if (config.url.indexOf('token') === -1) {
    config.url = config.url + params
  }
  return config
},
  error => {
    return Promise.reject(error)
  })

// http response 拦截器
axios.interceptors.response.use(res => {
  let resData = res.data
  if (parseInt(resData.status) === 9997) { // 登录超时 - 返回登录
    Vue.$vux.toast.text('请登录', 'middle')
    if (router.currentRoute.fullPath.indexOf('redirect') === -1) {
      router.push({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    } else {
      if (router.currentRoute.fullPath.indexOf('login') === -1) {
        router.push({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      } else {
        router.push({
          path: router.currentRoute.fullPath
        })
      }
    }
    return false
  }
  return res
},
  error => {
    return Promise.reject(error)
  })
