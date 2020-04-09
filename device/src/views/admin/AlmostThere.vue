<template>
  <div class="almost-there"
    v-loading="loading"
    element-loading-text="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="login-logo">
      <img src="../../../static/img/logo.png"/>
    </div>
    <div class="almost-show-button" v-if="!sendEmail">
      <div>Almost there...</div>
      <div>Please check your email to confirm your account</div>
      <div>No confirmation email received? Please check your spam folder or</div>
      <!-- <div class="to-sign-in">Already have login and password? <a @click="signIn">Sign in</a></div> -->
      <div><span @click="sendEmail = true">Request new confirmation email</span></div>
    </div>
    <div class="send-email" v-else>
      <div class="send-email-content">
        <div class="desc1">Resend confirmation instructions</div>
        <el-form label-position="top" label-width="80px" :model="emailForm" border :rules="emailRules" ref="emailForm">
          <el-form-item :label="$t('login.email')" prop="email">
            <el-input v-model="emailForm.email"></el-input>
          </el-form-item>
          <input  type="button" class="resend-btn" :value="$t('login.reSend')" @click="reSend" v-if="showBtn">
          <input  type="button" class="resend-btn" :value="count" v-else disabled
            style="background: #eee; color: #333; cursor: not-allowed;">
        </el-form>
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
      loading: false,
      showBtn: true,
      count: 300
    }
  },
  mounted () {},
  methods: {
    reSend () {
      this.loading = true
      this.$http.post(this.$dm.AROOT_API + '/login/sendEmailCode', {
        type: 1,
        email: this.emailForm.email
      }).then((response) => {
        let resData = response.data
        this.loading = false
        if (resData.status === '1') {
          this.$message({
            message: 'Success',
            type: 'success',
            duration: 1000
          })
          this.showBtn = false
          let counter = setInterval(() => {
            if (this.count > 0) {
              this.count--
            } else {
              this.showBtn = true
              this.count = 300
              clearInterval(counter)
            }
          }, 1000)
        } else {
          this.$message({
            type: 'error',
            message: resData.msg
          })
        }
      })
    },
    signIn () {
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>

<style scoped lang="less">
.almost-there {
  .login-logo {
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #efefef;
    img {
      width: 150px;
    }
  }
  .almost-show-button {
    width: 930px;
    margin: 0 auto;
    margin-top: 90px;
    div {
      text-align: center;
    }
    div:nth-child(1) {
      color: #2e2e2e;
      font-weight: 600;
      font-size: 30px;
    }
    div:nth-child(2) {
      color: #666;
      font-weight: 300;
      font-size: 13px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
      margin-top: 10px;
    }
    div:nth-child(3) {
      font-weight: 400;
      line-height: 1.5;
      color: #2e2e2e;
      font-size: 13px;
      margin-top: 20px;
    }
    div:nth-child(4) {
      margin-top: 30px;
      span {
        background-color: #168f48;
        border-color: #12753a;
        color: #fff;
        font-weight: 400;
        line-height: 1.5;
        padding: 12px 20px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
      }
      span:hover {
        background-color: #17934A !important;
        border-color: #17934A !important;
      }
    }
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
</style>

