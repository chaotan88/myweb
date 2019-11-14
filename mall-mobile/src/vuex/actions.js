import * as types from './mutation_type'
export default {
  // 更新购物车状态
  updateCarSte ({ commit }, payload) {
    commit(types.cartSte, payload)
  },
  // 更新升级弹窗状态
  updateUpgradeSte ({ commit }, payload) {
    commit(types.upgradeSte, payload)
  },
  // 更新首页弹窗广告状态
  upgradeIndAdverSte ({ commit }, payload) {
    commit(types.upgradeIndAdverSte, payload)
  }
}
