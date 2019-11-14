<template>
  <div class="account-security-wrap">
    <div class="content-wrap">
      <el-form :model="account" :rules="accountRules" ref="accountForm" label-width="120px">
        <el-form-item label="原密码：" prop="oldPassword">
          <el-input type="password" v-model="account.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input type="password" v-model="account.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="confirmNewPassword">
          <el-input type="password" v-model="account.confirmNewPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="updatePassword('accountForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        account: {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        },
        accountRules: {
          oldPassword: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          confirmNewPassword: [
            { required: true, message: '确认新密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      updatePassword: function (formName) {
        // 修改密码
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 新密码和确认密码是否相同
            if (this.account.newPassword === this.account.confirmNewPassword) {
              // 新密码和确认密码相同
              this.$http.post('/admin/adminUser/updatePassword', this.qs.stringify({
                oldPassword: this.account.oldPassword,
                newPassword: this.account.newPassword
              })).then((res) => {
                if (res.data.res === 1) {
                  this.$message.success('修改密码成功，下次登录时请使用新密码')
                  this.account = {}
                } else {
                  this.$message.error('修改密码失败')
                }
              })
            } else {
              // 新密码和确认密码不同
              this.$message.error('两次密码输入不一致，请重新输入')
            }
          } else {
            this.$message.error('表单填写不合法或者不能为空')
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .account-security-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
    }
  }
</style>

<style lang="less">
  .account-security-wrap {
    .el-form {
      width: 400px;
    }
    .el-form-item__label::before {
      content: "*";
      color: #f56c6c;
      margin-right: 6px;
    }
  }
</style>
