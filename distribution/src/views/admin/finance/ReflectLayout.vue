<!-- 提现容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/finance/reflect/all">全部({{statistics.allNum ? statistics.allNum : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/reflect/index">待处理({{statistics.waitDeal ? statistics.waitDeal : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/reflect/processed">已处理({{statistics.hasDeal ? statistics.hasDeal : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/reflect/back">回退({{statistics.back ? statistics.back : 0}})</router-link>
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
    let path = this.$route.path.match(/all|index|processed|back/gi)
    if (path) this.getStatistics()
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatistics () {
      this.$http.get('@ROOT_API/withdrawalManageController/getWithdrawalStatistics', {}).then((res) => {
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