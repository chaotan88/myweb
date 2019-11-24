// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {domain, global} from '../config/utils'
import axios from 'axios'
import * as Filters from './filters/'
import Utils from '@/global/Utils'  // 全局函数
import '@/global/Component'         // 全局组件

import Elementui from 'element-ui'
import qs from 'qs'
import VTree from 'vue-tree-halower'
import 'vue-tree-halower/dist/halower-tree.min.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/base.less'
import './assets/css/css-utils.css'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import SSKindEditor from 'ss-kindeditor'
import VueUeditorWrap from 'vue-ueditor-wrap'

// 给axios添加finally方法
require('promise.prototype.finally').shim()

Vue.component('vue-ueditor-wrap', VueUeditorWrap)
Vue.use(VueQuillEditor)
Vue.use(SSKindEditor)

Vue.use(Elementui)
Vue.use(qs)
Vue.use(VTree)

// 全局过滤器
Object.keys(Filters).forEach((key) => {
  Vue.filter(key, Filters[key])
})

// 请求头信息
axios.defaults.withCredentials = true
let $http = axios.create()
/**
 * 请求拦截
 */
$http.interceptors.request.use(config => {
  let userInfo = JSON.parse(localStorage.getItem(global.USER_INFO)) || {}
  /**
   * 转换请求地址
   * @ROOT_API: 根域名
   */
  config.url = config.url.replace(/@ROOT_API\//gi, domain.ROOT_API)
  config.url = config.url.replace(/@ROOT_PUBLIC\//gi, domain.ROOT_PUBLIC)
  let params = (config.url.indexOf('?') === -1 ? '?' : '&') + 'clientCode=4&companyNo=PP008&belongSystem=8&token=' + (userInfo.token ? userInfo.token : '')
  if (config.url.indexOf('token') === -1) config.url = config.url + params
  return config
})

/**
 * 回调拦截
 */
$http.interceptors.response.use(res => {
  let resData = res.data
  if (parseInt(resData.status) === 9997) {              // 登录超时 - 返回登录
    router.replace('/login')
    localStorage.removeItem(global.USER_INFO)
    return false
  }
  // 校验通过 - 返回结果
  return res
})

// 域名
Vue.prototype.$dm = domain

// axios
Vue.prototype.$http = $http

// 全局变量
Vue.prototype.$global = global

Vue.prototype.$Utils = Utils
Vue.prototype.qs = qs

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
