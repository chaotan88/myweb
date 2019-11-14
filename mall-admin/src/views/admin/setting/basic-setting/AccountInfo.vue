<template>
  <div class="account-info-wrap">
    <div class="content-wrap">
      <el-form :model="userAccount" ref="userAccountForm" label-width="100px">
        <el-form-item label="登录名：">
          <el-input v-model="userAccount.userName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="userAccount.phone" :disabled="true"></el-input>
          <el-button type="text" @click="modify">修改</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 修改弹窗 -->
    <el-dialog
      title="手机号验证"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="dialog-body-content" v-show="firstDialogBodyVisible">
        <el-form :model="validationOne" :rules="validationOneRules" ref="validationOneForm" label-width="100px">
          <el-form-item label="手机号：">
            <el-input v-model="userAccount.phone" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="code">
            <el-input v-model="validationOne.code"></el-input>
            <el-button type="text" @click="getValidationCode(userAccount.phone)">获得验证码</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-body-content special" v-show="secondDialogBodyVisible">
        <el-form :model="validationTwo" :rules="validationTwoRules" ref="validationTwoForm" label-width="100px">
          <el-form-item label="新手机号：" prop="phone">
            <el-input v-model="validationTwo.phone"></el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="code">
            <el-input v-model="validationTwo.code"></el-input>
            <el-button type="text" @click="getValidationCode(validationTwo.phone)">获得验证码</el-button>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="firstDialogBodyVisible" @click="next('validationOneForm')">下一步</el-button>
        <el-button v-show="secondDialogBodyVisible" @click="confirm('validationTwoForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        userAccount: {
          userName: '',
          phone: ''
        },
        validationOne: {
          code: ''
        },
        validationTwo: {
          phone: '',
          code: ''
        },
        dialogVisible: false,
        firstDialogBodyVisible: true,
        secondDialogBodyVisible: false,
        validationOneRules: {
          code: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        validationTwoRules: {
          phone: [
            { required: true, message: '请输入新手机号码', trigger: 'blur' },
            { pattern: /^1(3[0-9]|4[579]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/g, message: '手机号码格式不合法', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        checkStatus: false
      }
    },
    methods: {
      getAdminUserById: function () {
        // 获取管理员详情
        this.$http.post('/admin/adminUser/getAdminUserById', this.qs.stringify({}))
        .then((res) => {
          if (res.data.res === 1) {
            this.userAccount = res.data.obj
          }
        })
      },
      modify: function () {
        // 修改
        this.validationOne.code = ''
        this.dialogVisible = true
      },
      getValidationCode: function (phone) {
        // 获取验证码
        this.$http.post('/admin/sms/sendSms', this.qs.stringify({
          phone: phone
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.$message.success('验证码发送成功')
          } else {
            this.$message.error('验证码发送失败')
          }
        })
      },
      next: function (formName) {
        // 下一步
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/admin/sms/checkCode', this.qs.stringify({
              phone: this.userAccount.phone,
              code: this.validationOne.code
            }))
            .then((res) => {
              if (res.data.res === 100) {
                this.firstDialogBodyVisible = false
                this.secondDialogBodyVisible = true
              } else {
                this.$message.error('验证码验证错误')
              }
            })
          }
        })
      },
      confirm: function (formName) {
        // 确定
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/admin/sms/checkCode', this.qs.stringify({
              phone: this.validationTwo.phone,
              code: this.validationTwo.code
            }))
            .then((res) => {
              if (res.data.res === 100) {
                this.dialogVisible = false
              } else {
                this.$message.error('修改成功')
                this.dialogVisible = false
              }
            })
          }
        })
      },
      save: function () {
        // 保存
        this.$http.post('/admin/adminUser/updateAdminUserById', this.qs.stringify({
          phone: this.validationTwo.phone
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.$message.success('保存成功')
          } else {
            this.$message.error('保存失败')
          }
        })
      }
    },
    mounted: function () {
      this.getAdminUserById()
    }
  }
</script>

<style lang="less" scoped>
  .account-info-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
    }
  }
</style>

<style lang="less">
  .account-info-wrap {
    .el-form {
      .el-input {
        width: 300px;
      }
    }
    .special
    .el-form-item__label::before {
      content: "*";
      color: #f56c6c;
      margin-right: 6px;
    }
  }
</style>
