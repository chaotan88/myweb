import Vue from 'vue'
import Router from 'vue-router'
import  Home from '@/views/home.vue'
import  Index from '@/views/index.vue'
import  AirTicketsList from '@/views/airTicketsList.vue'
import  AirTicketsInfo from '@/views/airTicketsInfo.vue'
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'index',
          name: 'index',
          component: Index
        },
        {
          path: 'airTicketsList',
          name: 'airTicketsList',
          component: AirTicketsList
        },
        {
          path: 'airTicketsInfo',
          name: 'airTicketsInfo',
          component: AirTicketsInfo
        }
      ]
    }
  ]
})

