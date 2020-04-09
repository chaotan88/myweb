<template>
  <div class="login-wrap"
    v-loading="loading"
    element-loading-text="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- <el-select :value="currentLang" :placeholder="$t('common.pleaseSelect')"
      popper-class="dropdown" class="dropdown-menu" @change="languageChange">
      <template v-for="item in downList">
        <el-option :label="item.name" :value="item.id"></el-option>
      </template>
    </el-select> -->
    <div class="login-logo">
      <img src="../../../static/img/logo.png"/>
    </div>
    <div class="send-email-info" v-if="isSend">
      If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.
      <i class="icon-font el-icon-close" @click="isSend = false"></i>
    </div>
    <div class="login-cen">
      <!-- <h1><img src="../../../static/img/logo.png"></h1> -->
      <div class="change-tabs">
        <div @click="pageType = 'login'" :class="pageType === 'login' ? 'tab_checked' : ''"><a>{{$t('login.signIn')}}</a></div>
        <div @click="pageType = 'regist'" :class="pageType === 'regist' ? 'tab_checked' : ''"><a>{{$t('login.register')}}</a></div>
      </div>
      <el-form label-position="top" label-width="80px" :model="loginForm" border :rules="loginRules" ref="loginForm" v-show="pageType === 'login'">
        <el-form-item :label="$t('login.usernameOrEmail')" prop="usernameOrEmail">
          <el-input v-model="loginForm.usernameOrEmail"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <div class="remenber-me">
          <div class="left">
            <input type="checkbox" v-model="rememberMe"/>
            <span>{{$t('login.rememberMe')}}</span>
          </div>
          <div class="right" @click="toForget">{{$t('login.forgotYourPassword')}}</div>
        </div>
        <input  type="button" class="inp-sub" :value="$t('login.signIn')" @click="LoginHandle">
      </el-form>
      <el-form label-position="top" label-width="80px" :model="registForm" border :rules="registRules" ref="registForm" v-show="pageType === 'regist'">
        <el-form-item :label="$t('login.fullName')" prop="fullName">
          <el-input v-model="registForm.fullName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.username')" prop="userName">
          <el-input v-model="registForm.userName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.email')" prop="email">
          <el-input v-model="registForm.email"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.emailConfirmation')" prop="emailConfirmation">
          <el-input v-model="registForm.emailConfirmation"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input v-model="registForm.password" type="password"></el-input>
          <!-- <div class="tips">Minimum length is 8 characters.</div> -->
        </el-form-item>
        <input  type="button" class="inp-sub" :value="$t('login.register')" @click="registHandle">
      </el-form>
    </div>
    <!-- <div class="login-cen login-cen-regist" v-else-if="pageType === 'rePassword'">
      <p>{{$t("common.forgetPassword")}}</p>
      <input class="inp-text" :placeholder="$t('account.loginPhone')" ref="phone" v-model="rePasswordForm.phone">
      <div class="verifi-code">
        <input class="inp-text" :placeholder="$t('common.verificationCode')" ref="verifiCode" v-model="rePasswordForm.verifiCode">
        <span v-if="rePasswordCount < 1" class="verifi-title" @click="sendCode('repassword')">{{$t('common.Sendtheverificationcode')}}</span>
        <span v-else class="verifi-count">{{rePasswordCount}} {{$t('common.xmis')}}</span>
      </div>
      <input class="inp-text" type="password" :placeholder="$t('account.loginPassword')" ref="password" v-model="rePasswordForm.password">
      <input class="inp-text" type="password" :placeholder="$t('account.rolePermissionName')" v-model="rePasswordForm.rePassword">
      <input  type="button" class="inp-sub" :value="$t('common.save')" @click="savePassword">
      <div class="register"><span @click="pageType = 'login'" class="login">{{$t('common.login')}}</span></div>
    </div> -->
    <!-- 版权信息 -->
    <!-- <div class="ta-c pos-f copyright-wrap">
      <p>All Rights Reserved 2016-2017 版权所有</p>
      <p></p>
    </div> -->

  </div>
</template>

<script>

export default {
  data () {
    return {
      username: '13416890006',
      password: '123457',
      pageType: 'login',
      loginForm: {
        usernameOrEmail: '',
        password: ''
      },
      verifyCode: '',
      loginRules: {
        usernameOrEmail: [
          { required: true, message: 'This field is required.' }
        ],
        password: [
          { required: true, message: 'This field is required.' }
        ]
      },
      registForm: {},
      registRules: {
        fullName: [
          { required: true, message: 'This field is required.' }
        ],
        userName: [
          { required: true, message: 'Please create a username with only alphanumeric characters.' }
        ],
        email: [
          { required: true, message: 'Please provide a valid email address.' },
          { type: 'email', message: 'Please provide a valid email address.' }
        ],
        emailConfirmation: [
          { required: true, message: 'Please retype the email address.' }
        ],
        password: [
          { required: true, message: 'Minimum length is 6 characters.' },
          { min: 6, message: 'Minimum length is 6 characters.' }
        ]
      },
      rePasswordForm: {
        phone: '',
        verifiCode: '',
        password: '',
        rePassword: ''
      },
      regiestCount: 0,
      rePasswordCount: 0,
      downList: [
        {
          id: 'en',
          name: 'EN'
        },
        {
          id: 'zh',
          name: '中文'
        }
      ],
      currentLang: '中文',
      isSend: false,
      rememberMe: false,
      loading: false
    }
  },
  mounted () {
    if (this.getCookie('usernameOrEmail')) {
      this.loginForm.usernameOrEmail = this.getCookie('usernameOrEmail')
    }
    if (this.getCookie('password')) {
      this.loginForm.password = this.getCookie('password')
    }
    if (this.getCookie('rememberMe')) {
      this.rememberMe = this.getCookie('rememberMe')
    }
    if (this.$route.query.code) {
      this.verifyCode = this.$route.query.code
    }
    if (this.$route.query.isSend) {
      this.isSend = this.$route.query.isSend
    }
    if (this.$route.query.userName && this.$route.query.token) {
      this.username = this.$route.query.userName
      this.password = this.$route.query.token
      this.LoginHandle()
    }
  },
  methods: {
    /**
     * 登录
     */
    LoginHandle () {
      // 验证
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          // let isEmail = this.isEmail(this.loginForm.usernameOrEmail)
          let params = {
            password: this.loginForm.password,
            userNameOrEmail: this.loginForm.usernameOrEmail
          }
          // if (isEmail) {
          //   params.email = this.loginForm.usernameOrEmail
          // } else {
          //   params.userName = this.loginForm.usernameOrEmail
          // }
          if (this.verifyCode) {
            params.verifyCode = this.verifyCode
          }
          if (this.rememberMe) {
            this.setCookie('usernameOrEmail', this.loginForm.usernameOrEmail)
            this.setCookie('password', this.loginForm.password)
            this.setCookie('rememberMe', this.rememberMe)
          } else {
            this.delCookie('usernameOrEmail')
            this.delCookie('password')
            this.delCookie('rememberMe')
          }
          this.loading = true
          this.$http.post(this.$dm.AROOT_API + '/login/login', params).then((res) => {
            let resData = res.data
            this.loading = false
            if (resData.status !== '1') {
              this.$message({
                message: 'Invalid Login or password.',
                type: 'error',
                duration: 1500
              })
              return false
            }
            this.$message({
              message: 'Success',
              type: 'success',
              duration: 1000
            })
            resData.data.payMemberStatus = this.$toMd5(resData.data.payMemberStatus + '')
            localStorage.setItem('deviceAdminInfo', JSON.stringify(resData.data))
            setTimeout(() => {
              this.$router.push('/admin/device/manage/deviceList')
              // if (resData.data.userName === '超级管理员') {
              //   this.$router.push('/admin')
              // } else {
              //   this.$router.push('/admin/console/index2')
              // }
            }, 500)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    registHandle () {
      this.$refs['registForm'].validate((valid) => {
        if (valid) {
          let params = {
            fullName: this.registForm.fullName,
            userName: this.registForm.userName,
            email: this.registForm.email,
            password: this.registForm.password,
            confirmPwd: this.registForm.password
          }
          if (this.registForm.email !== this.registForm.emailConfirmation) {
            this.$message({
              type: 'error',
              message: this.$t('login.notMatchEmail')
            })
            return false
          }
          let checkArr = []
          this.loading = true
          checkArr.push(this.checkUserNameExist(this.registForm.userName))
          checkArr.push(this.checkEmailExist(this.registForm.email))
          Promise.all(checkArr).then((res) => {
            if (res[0].data.status !== '1') {
              this.$message({
                type: 'error',
                message: 'Username has already been taken'
              })
              this.loading = false
              return false
            }
            if (res[1].data.status !== '1') {
              this.$message({
                type: 'error',
                message: 'Email has already been taken'
              })
              this.loading = false
              return false
            }
            this.$http.post(this.$dm.AROOT_API + '/login/register', params).then((response) => {
              let resData = response.data
              this.loading = false
              if (resData.status === '1') {
                this.$router.push({
                  path: '/almostThere'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: resData.msg
                })
              }
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    isEmail (email) {
      let regex = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/
      return email.search(regex) !== -1
    },
    checkUserNameExist (userName) {
      return new Promise((resolve, reject) => {
        this.$http.post(this.$dm.AROOT_API + '/login/checkUserNameExist', {
          userName: userName
        }).then((res) => {
          resolve(res)
        })
      })
    },
    checkEmailExist (email) {
      return new Promise((resolve, reject) => {
        this.$http.post(this.$dm.AROOT_API + '/login/checkEmailExist', {
          email: email
        }).then((res) => {
          resolve(res)
        })
      })
    },
    checkEmailVerifyCode (verifyCode, type) {
      return new Promise((resolve, reject) => {
        this.$http.post(this.$dm.AROOT_API + '/login/checkEmailVerifyCode', {
          verifyCode: verifyCode,
          type: type
        }).then((res) => {
          resolve(res)
        })
      })
    },
    regist () {
      this.pageType = 'regist'
    },
    rePassword () {
      this.pageType = 'rePassword'
    },
    registSubmit () {
      // 验证
      if (!this.registForm.phone) {
        this.$message({
          message: '手机号码不能为空！',
          type: 'warning',
          duration: 1000
        })
        this.$refs.phone.focus()
        return false
      } else if (!this.registForm.verifiCode) {
        this.$message({
          message: '验证不能为空！',
          type: 'warning',
          duration: 1000
        })
        this.$refs.verifiCode.focus()
        return false
      } else if (!this.registForm.password) {
        this.$message({
          message: '密码不能为空！',
          type: 'warning',
          duration: 1000
        })
        this.$refs.password.focus()
        return false
      } else if (this.registForm.password !== this.registForm.rePassword) {
        this.$message({
          message: '两次密码输入不一致！',
          type: 'warning',
          duration: 1000
        })
        this.$refs.password.focus()
        return false
      }
      this.$http.post(this.$dm.AROOT_API + '/login/register', {
        phone: this.registForm.phone,
        password: this.registForm.password,
        confirmPwd: this.registForm.rePassword,
        verifyCode: this.registForm.verifiCode
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
        setTimeout(() => {
          this.pageType = 'login'
        }, 3000)
      })
    },
    sendCode (type) {
      if (type === 'regist') {
        if (!this.registForm.phone) {
          this.$message({
            type: 'error',
            message: '请输入正确的手机号码'
          })
          return false
        }
        this.getCode(this.registForm.phone, 'getVerifyCodeForRegister').then((res) => {
          if (res && res.data.status === '1') {
            this.setTimer('regiestCount')
          }
        })
      } else if (type === 'repassword') {
        if (!this.rePasswordForm.phone) {
          this.$message({
            type: 'error',
            message: '请输入正确的手机号码'
          })
          return false
        }
        this.getCode(this.rePasswordForm.phone, 'getVerifyCodeForForgetPassword').then((res) => {
          if (res && res.data.status === '1') {
            this.setTimer('rePasswordCount')
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
            return false
          }
        })
      }
    },
    getCode (phone, url) {
      return new Promise((resolve, reject) => {
        this.$http.post(this.$dm.AROOT_API + `/login/${url}`, {
          phone: phone
        }).then((res) => {
          resolve(res)
        })
      })
    },
    setTimer (key) {
      this[key] = 60
      let timer = window.setInterval(() => {
        if (this[key] < 1) {
          window.clearInterval(timer)
        } else {
          this[key]--
        }
      }, 1000)
    },
    savePassword () {
      if (!this.rePasswordForm.phone) {
        this.$message({
          message: '手机号码不能为空！',
          type: 'warning',
          duration: 1000
        })
        this.$refs.phone.focus()
        return false
      } else if (!this.rePasswordForm.verifiCode) {
        this.$message({
          message: '验证不能为空！',
          type: 'warning',
          duration: 1000
        })
        this.$refs.verifiCode.focus()
        return false
      } else if (!this.rePasswordForm.password) {
        this.$message({
          message: '密码不能为空！',
          type: 'warning',
          duration: 1000
        })
        this.$refs.password.focus()
        return false
      } else if (this.rePasswordForm.password !== this.rePasswordForm.rePassword) {
        this.$message({
          message: '两次密码输入不一致！',
          type: 'warning',
          duration: 1000
        })
        this.$refs.password.focus()
        return false
      }
      this.$http.post(this.$dm.AROOT_API + '/login/resetPassword', {
        phone: this.rePasswordForm.phone,
        password: this.rePasswordForm.password,
        confirmPwd: this.rePasswordForm.rePassword,
        verifyCode: this.rePasswordForm.verifiCode
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
        setTimeout(() => {
          this.pageType = 'login'
        }, 3000)
      })
    },
    languageChange (val) {
      this.$i18n.locale = val
      this.currentLang = this.$i18n.locale === 'zh' ? '中文' : '英文'
    },
    toForget () {
      this.$router.push({
        path: '/forget'
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-wrap{
  width: 100%;
  height: 100%;
  // background: url('../../../static/img/login-bg.png') no-repeat;
  position: absolute;
  background-size: cover;
  .send-email-info {
    background-color: #1f78d1;
    margin: 0;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.25);
    color: #fff;
    padding-right: 32px;
    position: relative;
    padding: 0.75rem 1.25rem;
    border: 1px solid transparent;
    width: 1000px;
    margin: auto;
    margin-top: 8px;
    border-radius: 4px;
    z-index: 999;
    i {
      text-align: right;
      cursor: pointer;
      margin-left: 25px;
    }
  }
  /* -------------------- { 版权信息 } -------------------- */
  .copyright-wrap{
    color: #aab5c8;
    width: 100%;
    padding: 15px 0;
    opacity: .3;
    bottom: 0;
    left: 0;

    p{
      height: 30px;
      line-height: 30px;
      font-size: 16px;
    }
  }
  .dropdown-menu {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 80px;
    input{
      background: none;
      border: none;
      color: #d7dadc;
      font-size: 12px;
    }
  }
  .login-logo {
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #efefef;
    img {
      height: 100px;
    }
  }
}

.login-cen{
  width: 360px;
  height: 264px;
  margin-left: -180px;
  margin-top: -120px;
  position: absolute;
  left: 50%;
  top: 250px;
  z-index: 10;
  border-radius: 6px;
  background: #fff;
  padding: 50px 30px;
  .change-tabs {
    display: flex;
    box-shadow: 0 0 0 1px #e5e5e5;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    padding: 0;
    margin: 0;
    list-style: none;
    height: auto;
    border-bottom: 1px solid #e5e5e5;
    div {
      background-color: #fafafa;
      border-left: 0;
      border-top-left-radius: 4px;
      text-align: center;
      padding: 8px;
      padding-bottom: 9px;
      font-size: 14px;
      line-height: 28px;
      flex: 1;
      transition: background-color 100ms linear, color 100ms linear, border 100ms linear;
      cursor: pointer;
    }
    div:nth-child(1) {
      border-right: 1px solid #e5e5e5;
    }
    div:hover {
      border-bottom: 2px solid #6666c4;
      background-color: #fff;
    }
    .tab_checked {
      border-bottom: 2px solid #6666c4;
      background-color: #fff;
      // border-bottom: 2px solid transparent;
    }
  }
  .el-form {
    border: 1px solid #e5e5e5;
    padding: 0 20px;
    font-size: 13px;
    color: #2e2e2e;
    label {
      font-weight: 600;
      line-height: 30px;
      padding: 0;
    }
    .el-form-item {
      margin-top: 15px;
      margin-bottom: 10px;
    }
    .remenber-me {
      display: flex;
      margin-top: 30px;
      justify-content: space-between;
      .right {
        color: #1b69b6;
        cursor: pointer;
      }
      .right:hover {
        text-decoration: underline;
      }
    }
  }

  h1{
    img{
      height: 50px;
      display: block;
      margin: 0 auto;
    }
  }

  input:focus{
    outline: none;
  }

  .inp-text{
    color: #666666;
    width: 100%;
    height: 40px;
    margin-top: 20px;
    padding-left: 20px;
    border-radius: 3px;
    font-size: 15px;
    box-sizing:border-box;
    background: rgba(255,255,255,.08);
    border: 1px solid #70757b ;
  }

  .inp-text:focus{
    border-color: #33719b;
    background: none;
  }

  .inp-text::-webkit-input-placeholder { /* WebKit browsers */
    color:#666666;
  }
  .inp-text:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:#666666;
  }
  .inp-text::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:#666666;
  }
  .inp-text:-ms-input-placeholder { /* Internet Explorer 10+ */
    color:#666666;
  }

  .inp-sub{
    width: 100%;
    height: 34px;
    margin-top: 30px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    background-color: #1aaa55;
    border-color: #168f48;
    color: #fff;
    padding: 6px 0;
    margin-bottom: 20px;
  }
  .inp-sub:hover {
    background-color: #17934A !important;
    border-color: #17934A !important;
  }
  .register {
    margin-top: 20px;
    margin-bottom: -30px;
    color: #409eff;
    font-size: 14px;
    span {
      cursor: pointer;
    }
    span:hover {
      color: #1989fa;
    }
    span:nth-child(2) {
      float: right;
    }
    .login {
      cursor: pointer;
    }
  }
  .verifi-code {
    input {
      width: 60%;
    }
    .verifi-title {
      font-size: 14px;
      margin-left: 10px;
      cursor: pointer;
      color: #409eff;
    }
    .verifi-title:hover {
      color: #1989fa;
    }
    .verifi-count {
      font-size: 14px;
      margin-left: 10px;
      color: #666;
    }
  }
}
.login-cen-regist {
  padding-top: 20px;
  height: 326px;
  margin-top: -168px;
  .register {
    margin-bottom: 0;
  }
  .inp-sub {
    margin-top: 20px;
  }
}
</style>

<style lang="less">
  .login-wrap{
    .el-input__inner{
      background: rgba(255, 255, 255, .3);
    }
    .el-button--primary{
      background: #33719b;
      border: none;
    }
    .el-button--primary:hover{
      background: #33719a;
    }
    // .el-form-item__label {
    //   margin-bottom: -10px;
    // }
  }
</style>
