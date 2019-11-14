<!-- 账户安全 -->
<template>
  <common-tpl class="account-pwd-wrap" footer>
    <template slot="header"></template>
    <template slot="main">
      <h2 class="fw-n admin-gray-title">修改密码</h2>
      <el-form :model="formData" :rules="rules" ref="form" label-width="160px">
        <el-form-item label="原　密　码：" prop="originalPwd">
          <el-input type='password' v-model="formData.originalPwd" placeholder='6-20位字符'></el-input>
        </el-form-item>
        <el-form-item label="新　密　码：" prop="newPwd">
          <el-input type='password' v-model="formData.newPwd" placeholder='6-20位字符'></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="confirmPwd">
          <el-input type='password' v-model="formData.confirmPwd" placeholder='6-20位字符'></el-input>
        </el-form-item>
      </el-form>
    </template>

    <template slot="footer">
      <el-button type="primary" @click="submitForm('form')">保存</el-button>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    var validatePwd = (rule, value, callback) => {
      if (!value) callback(new Error('请输入密码!'))
      if (value.length < 6 || value.length > 20) callback(new Error('6-20位字符'))
      callback()
    }
    var validateConfirmPwd = (rule, value, callback) => {
      if (!value) callback(new Error('请再次输入密码'))
      if (value.length < 6 || value.length > 20) callback(new Error('6-20位字符'))
      if (value !== this.formData.newPwd) callback(new Error('两次输入密码不一致!'))
      callback()
    }
    return {
      formData: {
        originalPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      userInfo: {},
      rules: {
        originalPwd: [{ required: true, validator: validatePwd, trigger: 'blur' }],
        newPwd: [{ required: true, validator: validatePwd, trigger: 'blur' }],
        confirmPwd: [{ required: true, validator: validateConfirmPwd, trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
  },
  methods: {
    /**
     * 提交表单
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$http.post('@ROOT_API/accountSetController/updatePass', {
          id: this.userInfo.userId,          // 用户id
          password: this.formData.originalPwd,      // 原密码
          newPassword: this.formData.newPwd,        // 新密码
          subNewPassword: this.formData.confirmPwd  // 新密码确认
        }).then((res) => {
          if (!res) return false
          let resData = res.data
          if (resData.status !== '1') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          setTimeout(() => {
            this.$router.push('/admin/seting/account/index')
          }, 500)
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.account-pwd-wrap{

  .el-form{
    border: 1px solid #eff2f6;
    border-bottom: 0;

    .el-form-item{
      padding: 15px;
      border-bottom: 1px solid #eff2f6;
      margin-bottom: 0;

      .el-input{
        width: 440px;
      }
    }
  }

}
</style>
