<!-- 付款审核容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/order/payment/all">全部({{statistics.allNum ? statistics.allNum : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/payment/examine">待付款({{statistics.waitAudit ? statistics.waitAudit : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/payment/pass">待发货({{statistics.auditPass ? statistics.auditPass : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/payment/reject">待收货({{statistics.auditNotPass ? statistics.auditNotPass : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/payment/finished">已完成({{statistics.auditNotPass ? statistics.auditNotPass : 0}})</router-link>
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
    let path = this.$route.path.match(/all|examine|pass|reject/gi)
    if (path) this.getStatistics()
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatistics () {
      this.$http.get('@ROOT_API/distributeApplyManage/applyListStatistics', {}).then((res) => {
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
