<!-- 预付款容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/finance/advancet/advancetlist">预付充值</router-link>
      <router-link class='d-ib ta-c' to="/admin/finance/advancet/set">充值设置</router-link>
    </template>
  </third-menu>
</template>

<script>
export default {
  data () {
    return {
      statistics: {}
    }
  }

  // mounted () {
  //   this.getgradeData()    // 获取等级列表数据
  // },

  // methods: {
  //   /**
  //    * 获取等级列表数据
  //    */
  //   getgradeData () {
  //     this.formData.tableData = []
  //     this.$http.get('@ROOT_API/rechargeRuleManageController/getRuleList', {}).then((res) => {
  //       let resData = res.data
  //       if (parseInt(resData.status) !== 1) {
  //         this.$message({
  //           message: resData.msg,
  //           duration: 1500,
  //           type: 'error'
  //         })
  //         return false
  //       }
  //       this.formData.tableData = resData.data
  //       console.log('this.gradeData: ', this.gradeData)
  //     }).finally(() => {
  //       this.loading = false
  //     })
  //   }
  // }
}
</script>