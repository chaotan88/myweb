import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home.vue'
import Index from '@/views/index.vue'
import AirTicketsList from '@/views/airTicketsList.vue'
import AirTicketsInfo from '@/views/airTicketsInfo.vue'
import Service from '@/views/service.vue'
import News from '@/views/news.vue'
import About from '@/views/about.vue'
import Concat from '@/views/concat.vue'
import AirDetail from '@/views/airDetail.vue'
import NewsDetai from '@/views/newsDetai.vue'

import MobileHome from '@/views/mobileHome.vue'
import MbIndex from '@/views/mb/mbIndex.vue'
import AllAirTickets from '@/views/mb/allAirTickets.vue'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'index',
          component: Index
        },
        {
          path: '/airTicketsList/:id',
          name: 'airTicketsList',
          component: AirTicketsList
        },
        {
          path: '/airTicketsInfo/:id',
          name: 'airTicketsInfo',
          component: AirTicketsInfo
        },
        {
          path: '/service',
          name: 'service',
          component: Service
        },
        {
          path: 'news/:id',
          name: 'news',
          component: News
        },
        {
          path: '/about',
          name: 'about',
          component: About
        },
        {
          path: '/concat',
          name: 'concat',
          component: Concat
        },
        {
          path: '/airDetail',
          name: 'airDetail',
          component: AirDetail
        },
        {
          path: '/newsDetail',
          name: 'newsDetai',
          component: NewsDetai
        }
      ]
    }, {
      path: '/moblie',
      name: 'mobile',
      component: MobileHome,
      redirect: '/mbIndex',
      children: [
        {
          path: '/mbIndex',
          name: 'mbIndex',
          component: MbIndex
        },
        {
          path: '/allAirTickets',
          name: 'allAirTickets',
          component: AllAirTickets
        }
      ]
    }
  ]
})

