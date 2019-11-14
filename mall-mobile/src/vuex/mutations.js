import * as types from './mutation_type'
export default {
  // 购物车数量
  [types.cartSte] (state, payload) {
    state.cartSte = payload
  },
  // 升级弹窗
  [types.upgradeSte] (state, payload) {
    state.upgradeSte = payload
  },
  // 首页弹窗广告
  [types.upgradeIndAdverSte] (state, payload) {
    state.upgradeIndAdverSte = payload
  }
}
