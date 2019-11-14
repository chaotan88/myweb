import Vue from 'vue'
import Vuex from 'vuex'
import {global} from '../../config/utils'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    userInfo: JSON.parse(localStorage.getItem(global.USER_INFO)) || {}
  },
  getters: {
    userInfo: state => {
      return state.userInfo
    }
  },
  mutations: {
    userInfo: (state, args) => {
      state.userInfo = args
      return state.userInfo
    }
  },
  actions: {
    userInfo: (context, args) => {
      context.commit('userInfo', args)
    }
  }
})
