<!-- 优惠卷容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/operation/conversion/coupon/all">全部({{statistics.countAll || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/operation/conversion/coupon/ongoing">进行中({{statistics.countYes || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/operation/conversion/coupon/ended">已结束({{statistics.countNo || 0}})</router-link>
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
      let path = this.$route.path.match(/all|ongoing|ended/gi)
      if (path) this.getStatistics()
    },

    methods: {
      /**
       * 获取统计数据
       */
      getStatistics () {
        this.$http.get('@ROOT_API/coupon/getCouponCountByEnable', {
          params: {
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

