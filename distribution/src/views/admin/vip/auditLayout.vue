<!-- 会员中心容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/vip/upgrade/audit/index">全部({{statistics.upgradeAllNum ? statistics.upgradeAllNum : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/vip/upgrade/audit/stay">待审核({{statistics.upgradeVerifyNum ? statistics.upgradeVerifyNum : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/vip/upgrade/audit/adopt">审核通过({{statistics.upgradePassVerifyNum ? statistics.upgradePassVerifyNum : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/vip/upgrade/audit/regression">已打回({{statistics.upgradeNotVerifyNum ? statistics.upgradeNotVerifyNum : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/vip/upgrade/audit/revoke">已撤销({{statistics.upgradeRevokeNum ? statistics.upgradeRevokeNum : 0}})</router-link>
    </template>
  </third-menu>
</template>
<script>
export default {
  data () {
    return {
      statistics: {}
    }
  },

  mounted () {
    let path = this.$route.path.match(/index|stay|adopt|regression|revoke/gi)
    if (path) this.getStatistics()
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatistics () {
      this.$http.get('@ROOT_API/buyMemberAccountManageController/getMemberUpgradeStatistics', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.statistics = resData.data
      })
    }
  }
}
</script>