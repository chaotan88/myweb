<!-- 提现容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/finance/reflect/all">全部({{statistics.allNum ? statistics.allNum : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/reflect/index">待打款({{statistics.waitDeal ? statistics.waitDeal : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/reflect/processed">已打款({{statistics.hasDeal ? statistics.hasDeal : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/reflect/back">已回退({{statistics.back ? statistics.back : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/reflect/transfer">打款中({{statistics.transfer ? statistics.transfer : 0}})</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/reflect/exception">打款异常({{statistics.exception ? statistics.exception : 0}})</router-link>
      <!-- <router-link class='tab-right-btn' to="/admin/finance/reflect/reflectSetting">提现设置</router-link> -->
      <div class='user-define-add-btn' @click="toSetting" style="float: right;">
        <el-button @click="toSetting()">提现设置</el-button>
      </div>
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
    let path = this.$route.path.match(/all|index|processed|back|transfer|exception/gi)
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
    },
    toSetting () {
      this.$router.push({
        path: '/admin/finance/setting'
      })
    }
  }
}
</script>