<!-- 供应订单 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/order/supply/index">全部({{statistics.allNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/supply/payment">待付款({{statistics.waitPayNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/supply/delivery">待发货({{statistics.waitSendNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/supply/receipt">待收货({{statistics.waitReciveNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/supply/evaluate">待评价({{statistics.waitEvaluateNum || 0}})</router-link>
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
    this.getStatistics()
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatistics () {
      this.$http.get('@ROOT_API/order/getOrderListStatistics', {
        params: {
          orderType: 2
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
