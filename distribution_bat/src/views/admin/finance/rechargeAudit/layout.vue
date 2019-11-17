<!-- 线下支付审核容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/finance/rechargeAudit/all">全部({{statistics.allNum ? statistics.allNum : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/rechargeAudit/index">待审核({{statistics.waitDeal ? statistics.waitDeal : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/rechargeAudit/pass">审核通过({{statistics.auditPass ? statistics.auditPass : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/rechargeAudit/reject">审核不通过({{statistics.auditFail ? statistics.auditFail : 0}})</router-link>
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
      let path = this.$route.path.match(/all|index|pass|reject/gi)
      if (path) this.getStatistics()
    },

    methods: {
      /**
       * 获取统计数据
       */
      getStatistics () {
        this.$http.post('@ROOT_API/recharge/getOnlineRechargeStatic', {}).then((res) => {
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
