<!-- 退款管理容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/order/evaluate/index">全部({{statistics.allNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/evaluate/praise">好评({{statistics.goodNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/evaluate/center">中评({{statistics.midNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/order/evaluate/difference">差评({{statistics.badNum || 0}})</router-link>
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
    let path = this.$route.path.match(/index|praise|center|difference/gi)
    if (path) this.getStatistics()
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatistics () {
      this.$http.post('@ROOT_API/comment/getCommentListStatistics', {}).then((res) => {
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
