import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
Vue.use(Vuex)
const state = {
  cartSte: 'addd',                         // 购物车状态
  upgradeSte: '',                          // 升级弹窗状态
  upgradeIndAdverSte: '',                  // 首页弹窗广告
  applogin: '',                            // app登录成功
  active: ''                               // skuByLucky 活动状态
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
