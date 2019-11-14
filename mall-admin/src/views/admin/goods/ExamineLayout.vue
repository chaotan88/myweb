<!-- 商品审核容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/goods/examine/index">待审核({{statistics.waitReviewNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/goods/examine/pass">审核通过({{statistics.hasReviewNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/goods/examine/reject">审核不通过({{statistics.noReviewNum || 0}})</router-link>
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
    let path = this.$route.path.match(/index|pass|reject/gi)
    if (path) this.getStatistics()
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatistics () {
      this.$http.post('@ROOT_API/goods/getGoodsListStatistics', {}).then((res) => {
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
