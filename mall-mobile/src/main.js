import Vue from 'vue'
import FastClick from 'fastclick'
import App from 'src/App'
import router from 'src/router'

import store from 'src/vuex/store'                                     // 引入vuex
import 'src/assets/css/common.less'                                    // 公共css
import 'src/assets/css/css-utils.css'                                  // 公共css
import 'src/assets/js/common.js'                                       // 公共js
import axios from 'axios'                                            // axios
import api from 'src/assets/js/api'                                    // 配置api接口文件
import api2 from 'src/assets/js/apiComent'                             // 配置api接口文件2
import 'src/assets/js/httpres'                                         // 配置axios请求拦截
import * as filters from 'src/filters/index.js'                        // 全局过滤器
import infiniteScroll from 'vue-infinite-scroll'                     // 无限加载
import VueLazyload from 'vue-lazyload'                                // 懒加载
import vuescroll from 'vuescroll'                                    // 滚动
import qs from 'qs'                                                  // qs库
import { routerReplace } from 'src/assets/js/routerReplace.js'         // 路由跳转需要replace方式的
import { setTitle } from 'src/assets/js/setTitle.js'                   // 设置页面title
import { checkLogin } from 'src/assets/js/checkLogin.js'               // 检验是否登录
// 引入vux组件
import { ToastPlugin, ConfirmPlugin, LoadingPlugin } from 'vux'
import BaiduMap from 'vue-baidu-map'                                 // 百度地图
Vue.use(BaiduMap, {
  ak: 'xOEq2wUHZjsgNQzZIw4FxDRBmMr88Luu'
})

axios.create()

FastClick.attach(document.body)                                      // 添加Fastclick移除移动端点击延迟
Vue.use(require('vue-wechat-title'))                                 // 设置页面标题插件
Vue.prototype.qs = qs
Vue.prototype.api = Object.assign(api, api2)                         // 全局api
Vue.prototype.$http = axios                                          // ajax请求

Vue.prototype.imgUrl = api.imgUrl                                    // 公共图片路径
Vue.prototype.pageUrl = api.pageUrl                                  // 域名地址
Vue.prototype.$vm = new Vue()                                        // 兄弟组件通信
Vue.prototype.routerReplace = routerReplace                          // 路由跳转需要replace方式的
Vue.prototype.setTitle = setTitle                                    // 设置页面title
Vue.prototype.checkLogin = checkLogin                                // 检验是否登录

Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(qs)
Vue.use(infiniteScroll)
Vue.use(vuescroll)

// axios 添加finally方法
require('promise.prototype.finally').shim()
// 图片懒加载
Vue.use(VueLazyload, {
  preLoad: 1.5,
  attempt: 1
})

// 定义返回函数
Vue.directive('GoBack', {
  bind: function (el) {
    el.addEventListener('click', function () {
      router.go(-1)
    })
  }
})
Vue.config.productionTip = false

// 全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
