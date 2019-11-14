import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
Vue.use(Vuex)
const state = {
  upgradeSte: '' // 升级弹窗状态
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
