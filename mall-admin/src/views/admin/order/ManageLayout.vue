<!-- 订单管理容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/order/self/index">全部({{statistics.allNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/self/payment">待付款({{statistics.waitPayNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/self/delivery">待发货({{statistics.waitSendNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/self/receipt">待收货({{statistics.waitReciveNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/self/evaluate">待评价({{statistics.waitEvaluateNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/self/complete">已完成({{statistics.completeNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/self/cancel">已取消({{statistics.cancelNum || 0}})</router-link>
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
    let path = this.$route.path.match(/index|payment|delivery|receipt|evaluate|complete|cancel/gi)
    if (path) this.getStatistics()
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatistics () {
      this.$http.get('@ROOT_API/order/getOrderListStatistics', {
        params: {
          orderType: 1
        }
      }).then((res) => {
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

<style lang="less" scoped>
.third-nav-wrap{
  a{
    width: 130px;
  }
}
</style>
