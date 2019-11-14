<!-- 结算管理容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/finance/balance/wait">待结算订单</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/balance/record">结算记录</router-link>
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
    // let path = this.$route.path.match(/all|wait|finish/gi)
    // if (path) this.getStatistics()
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatistics () {
      this.$http.post('@ROOT_API/accountRechargeController/getRechargeStatic', {}).then((res) => {
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
