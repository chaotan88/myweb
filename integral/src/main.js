// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import './assets/css/common.less' // 公共css
import './assets/js/common.js'    // 公共js
import Utils from './assets/js/Utils'

import store from './vuex/store' // 引入vuex
import infiniteScroll from 'vue-infinite-scroll' // 无限加载
import axios from 'axios' // 引入axios
import api from './assets/js/api' // 配置api接口文件
import './assets/js/httpres' // 配置axios请求拦截
import * as filters from './filters/filters.js' // 全局过滤器
import './assets/css/base.less'
import './assets/css/css-utils.css'
/**
 * 引入vux组件
 */
import { ToastPlugin, LoadingPlugin, DatetimePlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(infiniteScroll)
Vue.use(DatetimePlugin)
/**
 * 定义api接口全局变量
 * 使用:this.api.xx
 */
Vue.prototype.api = api
Vue.prototype.imgUrl = api.imgUrl   // 公共图片路径
Vue.prototype.pageUrl = api.pageUrl // 域名地址
Vue.prototype.baseUrl = api.baseUrl // 域名地址
// 给axios添加finally方法
require('promise.prototype.finally').shim()
/**
 * 定义axios请求全局变量
 * 使用:this.$http.get/post
 */
Vue.prototype.$http = axios
Vue.prototype.$Utils = Utils
/**
 * 添加Fastclick移除移动端点击延迟
 */
FastClick.attach(document.body)
/**
 * 设置页面标题插件
 */
Vue.use(require('vue-wechat-title'))
/**
 * 全局过滤器
 */
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
