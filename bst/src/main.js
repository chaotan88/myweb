import Vue from 'vue'
import App from './App'
import router from './router'

// import "babel-polyfill";
// 第三方UI库
import Elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../static/css/base.css'
// import vueSwiper from 'vue-awesome-swiper'
// import 'swiper/dist/css/swiper.css'
// Vue.use(vueSwiper)
import carousel from '@/views/components/carousel.vue'
Vue.component('carousel', carousel)
Vue.use(Elementui)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
