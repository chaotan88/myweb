import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    fxUserInfo: JSON.parse(localStorage.getItem('fxUserInfo')) || {}
  },
  getters: {
    fxUserInfo: state => {
      return state.fxUserInfo
    }
  },
  mutations: {
    fxUserInfo: (state, args) => {
      state.fxUserInfo = args
      return state.fxUserInfo
    }
  },
  actions: {
    fxUserInfo: (context, args) => {
      context.commit('fxUserInfo', args)
    }
  }
})
