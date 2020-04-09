import Vue from 'vue'
import App from './App'
import router from './router'
import {domain} from '../config/utils'
import axios from 'axios'
import Elementui from 'element-ui'
import fun from './assets/js/fun'
// 全局过滤器
import * as filters from './assets/js/filters'
import 'element-ui/lib/theme-chalk/index.css'
import './../static/css/base.less'
import '@/assets/css/style.less'
import './../static/css/css-utils.css'
// import VueKindEditor from 'vue-kindeditor'
// import 'kindeditor/kindeditor-all-min.js'
// import 'kindeditor/themes/default/default.css'
import echarts from 'echarts'
import VueI18n from 'vue-i18n'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

import format from 'date-fns/format'
import md5 from 'js-md5'

Vue.prototype.$formatDate = (value, formatStr) => {
  if (!formatStr) formatStr = 'YYYY-MM-DD HH:mm:ss'
  return format(value, formatStr)
}
// 设置语言
locale.use(lang)

Vue.config.productionTip = false
// Vue.use(VueKindEditor)
Vue.use(fun)
Vue.prototype.$echarts = echarts
Vue.use(Elementui)
Vue.use(VueI18n)

Vue.prototype.$toMd5 = (val) => {
  return md5(`${val}`)
}

Vue.prototype.$isVip = () => {
  let deviceAdminInfo = JSON.parse(localStorage.deviceAdminInfo)
  return deviceAdminInfo.payMemberStatus === md5('1')
}
// 请求头信息
let $http = axios.create()

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    'zh': require('@/assets/languages/zh.json'),
    'en': require('@/assets/languages/en.json')
  }
})

Vue.prototype.$isBindDevice = (deviceId) => {
  return new Promise((resolve, reject) => {
    $http.post('@ROOT_API/dfDevice/checkChannelAndToken', {
      deviceId: deviceId
    }).then((res) => {
      resolve(res)
    })
  })
}

/**
 * 请求拦截
 */
$http.interceptors.request.use(config => {
  let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo')) || {}
  /**
   * 转换请求地址
   * @ROOT_API: 根域名
   */
  config.url = config.url.replace(/@ROOT_API\//gi, domain.ROOT_API)
  let params = (config.url.indexOf('?') === -1 ? '?' : '&') + 'belongSystem=3&token=' + (adminInfo.token ? adminInfo.token : '')
  if (config.url.indexOf('token') === -1) config.url = config.url + params
  return config
})

/**
 * 回调拦截
 */
$http.interceptors.response.use(res => {
  let resData = res.data
  if (parseInt(resData.status) === 9997) {              // 登录超时 - 返回登录
    if (router.currentRoute.path === '/login') {
      router.push({path: '/login', query: {userName: router.currentRoute.query.userName, token: router.currentRoute.query.token}})
    } else {
      router.push('/login')
    }
    localStorage.removeItem('deviceAdminInfo')
    return false
  }
  // if (parseInt(resData.status) === 9998) return false   // 查询结果为空
  // // 查询结果错误，直接提示错误信息，then()回调为空
  // if ((parseInt(resData.status) !== 1 || parseInt(res.status) !== 1) && parseInt(resData.status) !== 0 && parseInt(resData.status) !== 9902) {
  //   Elementui.Message({
  //     message: resData.msg,
  //     type: 'error',
  //     duration: 1500
  //   })
  //   return false
  // }
  // 校验通过 - 返回结果
  return res
})

// 域名
Vue.prototype.$dm = domain
Vue.prototype.$http = $http
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  render: h => h(App)
})
