<template>
  <div class="auto-renewal">
    <el-form label-width="200px" class="demo-ruleForm">
      <ul>
        <li>
          <el-form-item :label="$t('recharge.autoRenewal')">
            <span><el-checkbox v-model="autoRenewStatus" true-label="1" false-label="0"></el-checkbox></span>
          </el-form-item>
        </li>
      </ul>
    </el-form>
    <div class="save-box">
      <el-button type="primary" @click="submitForm()">Save</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        autoRenewStatus: '0'
      }
    },
    mounted () {
      let deviceAdminInfo = JSON.parse(localStorage.deviceAdminInfo)
      this.autoRenewStatus = deviceAdminInfo.autoRenewStatus + ''
    },
    methods: {
      submitForm () {
        this.$http.post('@ROOT_API/login/cancleOrOpenRenew', { autoRenewStatus: this.autoRenewStatus }).then(res => {
          if (res.data.status === '1') {
            this.$message({
              type: 'success',
              message: res.data.msg || this.$t('common.errorMsg')
            })
            let deviceAdminInfo = JSON.parse(localStorage.deviceAdminInfo)
            deviceAdminInfo.autoRenewStatus = this.autoRenewStatus
            localStorage.setItem('deviceAdminInfo', JSON.stringify(deviceAdminInfo))
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
          }
        })
      }
    }
  }
</script>
<style lang='less' scoped>
.auto-renewal {
    background: #fff;
    padding: 20px;
    .save-box {
        text-align: center;
    }
}
</style>
