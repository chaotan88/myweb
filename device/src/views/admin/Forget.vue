<template>
  <div class="forget-there">
    <div class="login-logo">
      <img src="../../../static/img/logo.png"/>
    </div>
    <div class="send-email" v-if="!showChangePassword">
      <div class="send-email-content">
        <div class="desc1">Reset Password</div>
        <el-form label-position="top" label-width="80px" :model="emailForm" border :rules="emailRules" ref="emailForm">
          <el-form-item :label="$t('login.email')" prop="email">
            <el-input v-model="emailForm.email"></el-input>
          </el-form-item>
          <input  type="button" class="resend-btn" :value="$t('login.resetPassword')" @click="reset">
        </el-form>
        <div class="to-sign-in">Already have login and password? <a @click="signIn">Sign in</a></div>
      </div>
    </div>
    <div class="send-email" v-else>
      <div class="send-email-content">
        <div class="desc1">Change your password</div>
        <div v-if="errArr.length > 0" class="change-error">{{errArr.length}}errors prohibited this user from being saved:
          <ul>
            <li v-for="(item, index) in errArr" :key="index">{{item}}</li>
          </ul>
        </div>
        <el-form label-position="top" label-width="80px" :model="changePassForm" border ref="changePassForm">
          <el-form-item label="New password" prop="password">
            <el-input v-model="changePassForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="Confirm new password" prop="conformPassword">
            <el-input v-model="changePassForm.conformPassword" type="password"></el-input>
          </el-form-item>
          <input  type="button" class="resend-btn" value="Change your password" @click="changePasswordSubmit">
        </el-form>
        <div class="to-sign-in">Didn't receive a confirmation email? <a @click="showChangePassword = false">Request a new one</a></div>
        <div class="to-sign-in">Already have login and password? <a @click="signIn">Sign in</a></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sendEmail: false,
      emailForm: {},
      emailRules: {
        email: [
          { required: true, message: 'Please provide a valid email address.' }
        ]
      },
      verifyCode: '',
      email: '',
      showChangePassword: false,
      changePassForm: {
        password: '',
        conformPassword: ''
      },
      errArr: []
    }
  },
  mounted () {
    if (this.$route.query.code) {
      this.verifyCode = this.$route.query.code
    }
    if (this.$route.query.email) {
      this.email = this.$route.query.email
    }
    if (this.verifyCode && this.email) {
      this.showChangePassword = true
    }
  },
  methods: {
    reset () {
      this.$refs['emailForm'].validate((valid) => {
        if (valid) {
          // let isEmail = this.isEmail(this.loginForm.usernameOrEmail)
          let params = {
            email: this.emailForm.email,
            type: 3
          }
          this.$http.post(this.$dm.AROOT_API + '/login/sendEmailCode', params).then((res) => {
            let resData = res.data
            if (resData.status !== '1') {
              this.$message({
                message: 'Invalid Email.',
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
            this.$router.push({
              path: '/login',
              query: {
                isSend: true
              }
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    signIn () {
      this.$router.push({
        path: '/login'
      })
    },
    changePasswordSubmit () {
      this.errArr = []
      if (this.changePassForm.password !== this.changePassForm.conformPassword) {
        this.errArr.push(`Password confirmation doesn't match Password`)
      }
      if (!this.changePassForm.password || this.changePassForm.password.length < 8) {
        this.errArr.push('Password is too short (minimum is 8 characters)')
      }
      if (this.errArr.length > 0) {
        return false
      }
      this.$http.post(this.$dm.AROOT_API + '/login/forgetPasswordEmail', {
        email: this.email,
        password: this.changePassForm.password,
        confirmPwd: this.changePassForm.conformPassword,
        verifyCode: this.verifyCode
      }).then((res) => {
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
        this.signIn()
      })
    }
  }
}
</script>

<style scoped lang="less">
.forget-there {
  .login-logo {
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #efefef;
  }
  .send-email {
    width: 960px;
    margin: auto;
    margin-top: 200px;
    .send-email-content {
      width: 400px;
      float: right;
      font-size: 14px;
      .desc1 {
        box-shadow: 0 0 0 1px #e5e5e5;
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
        padding: 10px 0;
        text-align: center;
      }
      .change-error {
        font-size: 14px;
        color: #a62d19;
        border-left: 1px solid #e5e5e5;
        border-right: 1px solid #e5e5e5;
        margin: 0 -1px;
        padding-left: 20px;
        padding-top: 10px;
        ul {
          margin-top: 10px;
          // margin-bottom: 10px;
          padding-bottom: 10px;
        }
        li {
          margin-left: 20px;
          font-weight: 400;
          line-height: 1.5;
          color: #2e2e2e;
          text-align: left;
          margin-top: 5px;
          list-style: outside;
        }
      }
      .el-form {
        border: 1px solid #e5e5e5;
        margin: 0 -1px;
        padding: 0 20px 20px 20px;
        .resend-btn {
          background-color: #1aaa55;
          border: 1px solid #168f48;
          color: #fff;
          padding: 6px 0;
          text-align: center;
          width: 100%;
          border-radius: 4px;
          cursor: pointer;
        }
      }
      .to-sign-in {
        color: #2e2e2e;
        font-size: 13px;
        margin-top: 30px;
        text-align: center;
        a {
          cursor: pointer;
          color: #1b69b6;
        }
        a:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>

