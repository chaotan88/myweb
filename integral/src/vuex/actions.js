import * as types from './mutation_type'
export default {
  // 更新购物车状态
  updateUpgradeSte ({ commit }, payload) {
    commit(types.upgradeSte, payload)
  }
}
