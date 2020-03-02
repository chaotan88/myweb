<template>
  <div class="login-wrap">
    <el-select :value="currentLang" :placeholder="$t('common.pleaseSelect')"
      popper-class="dropdown" class="dropdown-menu" @change="languageChange">
      <template v-for="item in downList">
        <el-option :label="item.name" :value="item.id"></el-option>
      </template>
    </el-select>
    <div class="login-cen" v-if="pageType === 'login'">
      <!-- <h1><img src="../../../static/img/logo.png"></h1> -->
      <div class="change-tabs">
        <div>{{$t('login.signIn')}}</div>
        <div></div>
      </div>
      <input class="inp-text" type="text" :placeholder="$t('account.email')" ref="uname" v-model="email" @keyup.enter="LoginHandle()">
      <input class="inp-text" type="password" :placeholder="$t('account.loginPassword')" ref="pwd" v-model="password" @keyup.enter="LoginHandle()">
      <input  type="button" class="inp-sub" :value="$t('common.login')" @click="LoginHandle">
      <div class="register"><span @click="regist">{{$t("common.registered")}}</span><span @click="rePassword">{{$t("common.forgetPassword")}}</span></div>
    </div>
    <div class="login-cen login-cen-regist" v-else-if="pageType === 'regist'">
      <p>{{$t("common.registered")}}</p>
      <input class="inp-text" :placeholder="$t('account.loginPhone')" ref="phone" v-model="registForm.phone">
      <div class="verifi-code">
        <input class="inp-text" :placeholder="$t('common.verificationCode')" ref="verifiCode" v-model="registForm.verifiCode">
        <span v-if="regiestCount < 1" class="verifi-title" @click="sendCode('regist')">{{$t('common.Sendtheverificationcode')}}</span>
        <span v-else class="verifi-count">{{regiestCount}} {{$t('common.xmis')}}</span>
      </div>
      <input class="inp-text" type="password" :placeholder="$t('account.loginPassword')" ref="password" v-model="registForm.password">
      <input class="inp-text" type="password" :placeholder="$t('account.rolePermissionName')" v-model="registForm.rePassword">
      <input  type="button" class="inp-sub" :value="$t('common.registered')" @click="registSubmit">
      <div class="register"><span @click="pageType = 'login'" class="login">{{$t('common.login')}}</span></div>
    </div>
    <div class="login-cen login-cen-regist" v-else-if="pageType === 'rePassword'">
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
    </div>
    <!-- 版权信息 -->
    <div class="ta-c pos-f copyright-wrap">
      <p>All Rights Reserved 2016-2017 版权所有</p>
      <p></p>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // username: '13416890003',
      // password: '123457'
      username: '13416890006',
      password: '123457',
      pageType: 'login',
      registForm: {
        phone: '',
        verifiCode: '',
        password: '',
        rePassword: ''
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
      currentLang: '中文'
    }
  },
  mounted () {
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
      if (!this.username) {
        this.$message({
          message: '用户名不能为空！',
          type: 'warning',
          duration: 1000
        })
        this.$refs.uname.focus()
        return false
      } else if (!this.password) {
        this.$message({
          message: '密码不能为空！',
          type: 'warning',
          duration: 1000
        })
        this.$refs.pwd.focus()
        return false
      }
      /**
       * equipmentLoginController
      */
      this.$http.post(this.$dm.AROOT_API + '/login/login', {
        phone: this.username,
        password: this.password
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
        localStorage.setItem('deviceAdminInfo', JSON.stringify(resData.data))
        setTimeout(() => {
          if (resData.data.userName === '超级管理员') {
            this.$router.push('/admin')
          } else {
            this.$router.push('/admin/console/index2')
          }
        }, 500)
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
    }
  }
}
</script>

<style scoped lang="less">
.login-wrap{
  width: 100%;
  height: 100%;
  background: url('../../../static/img/login-bg.png') no-repeat;
  position: absolute;
  background-size: cover;

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
}

.login-cen{
  width: 360px;
  height: 264px;
  margin-left: -180px;
  margin-top: -132px;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 10;
  border-radius: 6px;
  background: #fff;
  padding: 50px 30px;

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
    height: 46px;
    margin-top: 40px;
    font-size: 16px;
    font-weight: inherit;
    letter-spacing: 5px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
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
  }
</style>
