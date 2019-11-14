<!-- 订单审核容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/finance/order/all">全部({{statistics.allCount || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/order/examine">待审核({{statistics.waitCheck || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/order/pass">审核通过({{statistics.checkPass || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/order/reject">审核不通过({{statistics.checkNoPass || 0}})</router-link>
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
      this.$http.get('@ROOT_API/order/getOfflineCheckStatic', {}).then((res) => {
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
