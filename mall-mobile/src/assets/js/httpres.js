import router from '../../.././src/router'
import axios from 'axios'
import Vue from 'vue'
import { Toast } from 'vux'
Vue.use(Toast)

// 请求
axios.interceptors.request.use(config => {
  let bsbUserInfo = localStorage.getItem('bsbUserInfo') ? JSON.parse(localStorage.getItem('bsbUserInfo')) : {}
  let params = (config.url.indexOf('?') === -1 ? '?' : '&') + 'belongSystem=5&clientCode=1&versionNumber=v1.0&token=' + (bsbUserInfo.token ? bsbUserInfo.token : router.currentRoute.query.token ? router.currentRoute.query.token : '')
  if (config.url.indexOf('token') === -1) {
    config.url = config.url + params
  }
  // alert('请求' + config.url)
  return config
})

// 响应
axios.interceptors.response.use(res => {
  //  && router.currentRoute.path.indexOf('my') === -1 && router.currentRoute.path.indexOf('cart') === -1
  if (res.config.url.indexOf('noLogin') === -1 && router.currentRoute.path !== '/my' && router.currentRoute.path !== '/shopCart' && router.currentRoute.path !== '/comtoUpgrade') {    // 不拦截带有noLogin、购物车、我的页面的接口
    if (parseInt(res.data.status) === 9997) {                                      // 未登录或账号在其他地方登录
      Vue.$vux.loading.hide() // 隐藏loading
      localStorage.removeItem('bsbUserInfo')                                       // 移除保存的用户信息
      if (router.currentRoute.fullPath.indexOf('login') === -1) {
        localStorage.setItem('REDIRECT_URL', router.currentRoute.fullPath)           // 保存页面重定向url
        router.replace({
          path: '/login',
          query: {redirect: router.currentRoute.fullPath}
        })
      } else {
        router.replace({
          path: router.currentRoute.fullPath
        })
      }
    }
  }
  return res
})
