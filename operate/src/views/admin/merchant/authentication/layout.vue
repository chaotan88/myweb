<!-- 商户认证容器容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/merchant/authentication/index">全部({{statistics.allNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/merchant/authentication/waitcheck">待审核({{statistics.waitNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/merchant/authentication/checkin">审核通过({{statistics.yesNum || 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/merchant/authentication/checkout">审核不通过({{statistics.noNum || 0}})</router-link>
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
      let path = this.$route.path.match(/index|waitcheck|checkin|checkout/gi)
      if (path) this.getStatistics()
    },

    methods: {
      /**
       * 获取统计数据
       */
      getStatistics () {
        this.$http.get('@ROOT_API/merchant/getMerchantCaStatus', {
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
