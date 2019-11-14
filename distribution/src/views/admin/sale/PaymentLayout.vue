<!-- 付款审核容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/sale/payment/all">全部({{statistics.allNum ? statistics.allNum : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/sale/payment/examine">付款审核中({{statistics.waitAudit ? statistics.waitAudit : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/sale/payment/pass">审核通过({{statistics.auditPass ? statistics.auditPass : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/sale/payment/reject">审核不通过({{statistics.auditNotPass ? statistics.auditNotPass : 0}})</router-link>
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
