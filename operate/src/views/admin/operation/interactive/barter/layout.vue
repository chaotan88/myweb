<!-- 易货区容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/operation/interactive/barter/all">全部({{statistics.allAudit || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/operation/interactive/barter/wait">待审核({{statistics.waitAudit || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/operation/interactive/barter/pass">审核通过({{statistics.passAudit || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/operation/interactive/barter/reject">审核不通过({{statistics.noPassAudit || 0}})</router-link>
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
    let path = this.$route.path.match(/all|wait|pass|reject/gi)
    if (path) this.getStatistics()
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatistics () {
      this.$http.post('@ROOT_API/buyAttInfoController/getAttInfoStatic').then((res) => {
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
