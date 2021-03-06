import Vue from 'vue'
import App from './App'
import router from './router'
import {domain, global} from '../config/utils'
import axios from 'axios'
import * as Filters from './filters/'
import Utils from '@/global/Utils'  // 全局函数
import '@/global/Component'         // 全局组件
import '@/global/Directive'         // 全局指令

import Elementui from 'element-ui'
import 'vue-tree-halower/dist/halower-tree.min.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/base.less'
import './assets/css/css-utils.css'

Vue.use(Elementui)

// 给axios添加finally方法
require('promise.prototype.finally').shim()

/**
 * 全局过滤器
 */
Object.keys(Filters).forEach((key) => {
  Vue.filter(key, Filters[key])
})

let $http = axios.create()
/**
 * Ajax的request拦截
 */
$http.interceptors.request.use(config => {
  let userInfo = JSON.parse(localStorage.getItem(global.USER_INFO)) || {}
  /**
   * 转换请求地址
   * @ROOT_API: 根域名
   */
  config.url = config.url.replace(/@ROOT_API\//gi, domain.ROOT_API)
  config.url = config.url.replace(/@ROOT_PUBLIC\//gi, domain.ROOT_PUBLIC)
  let params = (config.url.indexOf('?') === -1 ? '?' : '&') + 'clientCode=4&versionNumber=v1.0&companyNo=PP008&belongSystem=7&token=' + (userInfo.token ? userInfo.token : '')
  if (config.url.indexOf('token') === -1) config.url = config.url + params
  return config
})

/**
 * Ajax的response拦截
 */
$http.interceptors.response.use(res => {
  let resData = res.data
  if (parseInt(resData.status) === 9997) {              // 登录超时 - 返回登录
    router.push('/login')
    localStorage.removeItem(global.USER_INFO)
    return false
  }
  // 校验通过 - 返回结果
  return res
})

/**
 * Vue的全局属性和方法
 */
Vue.prototype.$dm = domain      // api接口地址
Vue.prototype.$http = $http     // ajax请求方法
Vue.prototype.$Utils = Utils    // 全局函数
Vue.prototype.$global = global  // 全局属性

/**
 * Vue全局配置
 */
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
