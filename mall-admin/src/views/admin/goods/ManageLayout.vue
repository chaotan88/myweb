<!-- 商品管理容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/goods/manage/all">全部({{statistics.total || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/goods/manage/unsubmit">未提交审核({{statistics.noSubmitNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/goods/manage/wait">待审核({{statistics.waitReviewNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/goods/manage/pass">审核通过({{statistics.hasReviewNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/goods/manage/reject">审核不通过({{statistics.noReviewNum || 0}})</router-link>
    </template>
  </third-menu>
</template>

<script>
export default {
  data () {
    return {
      pageType: '',   // 页面类型
      statistics: {}
    }
  },

  mounted () {
    let path = this.$route.path.match(/all|wait|pass|reject|unsubmit/gi)
    if (path) {
      switch (path[0]) {
        case 'all':
          this.pageType = -2
          break
        case 'wait':
          this.pageType = 0
          break
        case 'pass':
          this.pageType = 1
          break
        case 'reject':
          this.pageType = 2
          break
        case 'unsubmit':
          this.pageType = 3
          break
      }
      this.getStatistics()
    }
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatistics () {
      this.$http.post('@ROOT_API/goods/getGoodsListStatistics', {
        reviewStatus: this.pageType
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
