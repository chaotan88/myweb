<!-- 登录 -->
<template>
  <div class="login-wrap">
    <div class="login-box">
      <div>
        <!--表单-->
        <div class="input-box">
          <div class="title-box">
            <h2 class="ta-c sys-title">
              <span class="d-ib">
                <svg class="icon icon-jifen1 va-m" aria-hidden="true">
                  <use xlink:href="#icon-jifen1"></use>
                </svg>
                积分管理系统
              </span>
            </h2>
            <div class="pos-r nav-tab-wrap">
              <div class="d-ib ta-c fw-b fl-l nav-list" :class="{active: curStep === 0}" @click="curStep = 0">账号密码登录</div>
              <div class="d-ib ta-c fw-b fl-r nav-list" :class="{active: curStep === 1}" @click="curStep = 1">手机号快捷登录</div>
              <span class="d-b pos-a tab-bar" :style="{width: tabBarWidth, left: tabBarPos}"></span>
            </div>
          </div>

          <div class="inp-item-wrap">
            <div class="pos-r inp-item phone">
              <span class="pos-a label">手机号</span>
              <input type="tel" placeholder="请输入手机号" v-model="formData.phone" maxlength="11">
            </div>
            <div class="pos-r login-type-wrap" :class="{next: curStep === 1}">
              <div class="pos-a inp-item">
                <span class="pos-a label">密　码</span>
                <input type="password" placeholder="请输入登录密码" minlength="6" maxlength="20" v-model="formData.password">
              </div>
              <div class="pos-a inp-item" >
                <span class="pos-a label">验证码</span>
                <input type="number" placeholder="动态验证码" v-model="formData.code">
                <span v-if="!getCodeNoTap" class="pos-a code" @click="getCode">{{CodeText}}</span>
                <span v-else class="pos-a code">{{CodeText}}</span>
              </div>
            </div>
          </div>
        </div>

        <!--登录-->
        <div class="login-btn-wrap">
          <div class="ta-c login-btn" :class="{active: subActive}" @click="loginCheck">登录</div>
          <span class="fl-l" @click="$router.push('/retrieve-password')">忘记密码</span>
          <span class="fl-r" @click="$router.push('/register')">注册账号</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XDialog } from 'vux'
import { setTimeout } from 'timers'
// import { log } from 'util'

export default {
  components: {
    Tab,
    TabItem,
    XDialog
  },
  data () {
    return {
      curStep: 0,               // 当前步骤 [0、密码登录，1、短信验证码登录]
      tabBarWidth: '',          // 导航宽度
      tabBarPos: '',            // 导航定位
      showAgreement: false,     // 显示协议
      formData: {
        phone: '',              // 手机号码
        code: '',               // 验证码
        codeVal: '',            // 获取到的验证码
        password: ''            // 密码
      },
      subActive: false,         // 提交按钮选中效果
      Time: 60,                 // 倒计时时间
      getCodeNoTap: false,      // 获取验证码按钮是否允许点击
      CodeText: '发送验证码',    // 验证码文字
      timer: null,              // 定时器
      agreementCon: '',          // 注册协议的内容
      fromType: ''               // 用于联合登录
    }
  },

  watch: {
    'curStep' (value) {
      // this.tabBarWidth = value === 0 ? '1.8rem' : '0.2rem'
      this.tabBarPos = value === 0 ? '25%' : '75%'
    },

    'formData': {
      handler () {
        this.subActive = (this.curStep === 0 && this.formData.phone && this.formData.password) || (this.curStep === 1 && this.formData.phone && this.formData.code) ? !!true : !!false
      },
      deep: true
    }
  },

  mounted () {
    console.log('this.$route.query.fromType =', this.$route.query.fromType)
    /**
     * 处理从其他端跳转过来自动登录
     */
    if (localStorage.getItem('webLogoutSuccess')) {
      return
    }

    let fromType = this.$route.query.fromType
    let phone = this.$route.query.phone
    let token = this.$route.query.token

    if (fromType) {
      localStorage.setItem('fromType', fromType)
      console.log('来自app跳转')
    } else {
      console.log('手动进入')
    }

    if (token && phone) {
      console.log('app已登录')
      this.curStep = 1
      this.formData.phone = phone
      this.formData.code = token
      this.loginRuquest()
    } else {
      console.log('app未登录')
    }
  },

  methods: {
    /**
     * 倒计时
     */
    countDown () {
      if (this.Time > 0) {
        this.getCodeNoTap = true
        this.CodeText = this.Time + 's'
        --this.Time
      } else {
        clearInterval(this.timer)
        this.Time = 60
        this.getCodeNoTap = false
        this.CodeText = '重新获取'
      }
    },

    /**
     * 获取验证码
     */
    getCode () {
      if (!this.formData.phone) {
        this.$vux.toast.text('请输入手机号')
        return false
      } if (!this.formData.phone.match(/^1\d{10}$/g)) {
        this.$vux.toast.text('请输入正确的手机号')
        return false
      }
      // 倒计时
      this.sendCode()
      this.countDown()
      this.timer = setInterval(() => {
        this.countDown()
      }, 1000)
    },

    /**
     * 发送验证码
     */
    sendCode () {
      this.$http.post(`${this.api.getCode}`, {
        phone: this.formData.phone
      }).then((res) => {
        this.$vux.toast.text(res.data.msg)
        if (res.data.data) {
          this.formData.codeVal = res.data.data
        }
      })
    },

    /**
     * 检测手机验证码是否一致
     */
    checkCode (fun) {
      this.$http.post(`${this.api.checkCode}`, {
        phone: this.formData.phone,
        verifyCode: this.formData.code
      }).then((res) => {
        if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
          this.$vux.toast.text(res.data.msg)
          return false
        }
        fun()
      })
    },

    /**
     * 登录请求
     */
    loginRuquest () {
      this.$vux.loading.show({
        text: '正在登录...'
      })
      this.$http.post(`${this.api.login}`, {
        phone: this.formData.phone,
        password: this.curStep === 0 ? this.formData.password : this.formData.code,
        invitationCode: localStorage.getItem('invitationCode') || ''
      }).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) {
          if (parseInt(res.data.status) !== 9913) {
            this.$vux.toast.text(res.data.msg)
            return false
          } else {
            this.$vux.toast.text('您尚未完善邀请人信息，请点击注册按钮进行信息完善')
            return false
          }
        } else {
          this.$vux.toast.text('登录成功')
          localStorage.setItem('integralUserInfo', JSON.stringify(res.data.data))
          localStorage.setItem('token', res.data.data.token)
          // let fromType = localStorage.getItem('fromType')
          let fromType = this.$route.query.fromType
          let token = this.$route.query.token
          if (fromType === 'android') {
            // 联合登录的回调
            if (!token) {
              localStorage.removeItem('integralUpgradeState')
              window.java.loginSuccess(res.data.data.phone, res.data.data.token)
            }
          } else if (fromType === 'iOS') {
            console.log('来自iOS')
            if (!token) {
              localStorage.removeItem('integralUpgradeState')
              window.webkit.messageHandlers.loginSuccess.postMessage({phone: res.data.data.phone, token: res.data.data.token})
            }
          } else {
            console.log('else登录')
            localStorage.setItem('webLoginSuccess', 'true')
            if (localStorage.getItem('webLogoutSuccess')) {
              localStorage.removeItem('webLogoutSuccess')
            }
          }
          if (this.$route.query.redirect) {
            setTimeout(() => {
              this.$router.replace(this.$route.query.redirect)
            }, 100)
          } else {
            setTimeout(() => {
              this.$router.replace({path: '/home'})
            }, 100)
          }
        }
      }).finally(() => {
        this.$vux.loading.hide()
      })
    },

    /**
     * 登录验证
     */
    loginCheck () {
      if (!this.formData.phone) {
        this.$vux.toast.text('请输入手机号')
        return false
      } else if (!this.formData.phone.match(/^1\d{10}$/)) {
        this.$vux.toast.text('请输入正确的手机号')
        return false
      } else if (this.curStep === 0) {
        if (!this.formData.password) {
          this.$vux.toast.text('请输入密码')
          return false
        } else if ((this.formData.password.length < 6 || this.formData.password.length > 20) && this.formData.password.length !== 32) {
          this.$vux.toast.text('密码限6-20个字符')
          return false
        }
      } else if (this.curStep === 1) {
        if (!this.formData.code) {
          this.$vux.toast.text('请输入验证码')
          return false
        } else if (this.formData.code.length !== 4) {
          this.$vux.toast.text('验证码限4个字符')
          return false
        }
      }
      if (this.curStep === 0) {   // 密码登录
        this.loginRuquest()
      } else {
        // 检测验证码是否正确
        this.checkCode(() => {
          this.loginRuquest()
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap{

  .login-box{
    height: calc(100vh);
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    overflow: hidden;
  }

  /*表单*/
  .input-box{

    .title-box{
      width: 100%;
      height: 3rem;
      background: url(../assets/images/title-box-bg.png) no-repeat 0 -1rem;
      background-size: 100%;
    }

    .sys-title{
      color: #fff;
      font-size: .46rem;
      font-family: 'microsoft yahei';
      padding: .6rem 0;

      .icon{
        fill: #fff;
        width: 0.5rem;
        height: 0.5rem;
      }

      span{
        background: #5388ea;
        padding: 0.1rem 0.25rem;
        border-radius: 5px;
      }
    }

    .nav-tab-wrap{
      margin-bottom: 10px;

      .nav-list{
        width: 50%;
        color: #cad8fc;
        height: .9rem;
        line-height: .9rem;
        font-size: .3rem;
      }

      .nav-list.active{
        color: #fff;
      }

      .tab-bar{
        width:0;
        height:0;
        border-width:0 0.2rem 0.2rem;
        border-style:solid;
        border-color:transparent transparent #fff;
        margin-left: -.2rem;
        position:absolute;
        top: 0.7rem;
        left: 25%;
        transition: .3s ease-in-out;
      }
    }

    .inp-item-wrap{
      padding: 0 .2rem;
    }

    .inp-item{
      width: 100%;
      height: .9rem;
      line-height: .9rem;
      padding: 0 0.2rem;
      border-bottom: 1px solid #eee;
      margin-top:0.3rem;
      left: 0;
      transition: .3s ease-in-out;

      .label{
        color: #3c3c3c;
        font-size: .3rem;
      }

      input{
        width: 100%;
        height: 100%;
        font-size: .3rem;
        margin-left: 0.4rem;
        border:none;
        padding-left: 1.5rem;
        background: none;
      }

      .pwdInput{
        width:4.0rem;
      }

      .code{
        color:#ed3738;
        height: .9rem;
        line-height: .9rem;
        font-size: .28rem;
        right: 0.6rem;
        bottom: 0;
      }
    }

    .login-type-wrap{
      height: 1.22rem;
      overflow: hidden;

      .login-type{
        color: #0099cc;
        margin-top: 10px;
      }

      .inp-item:last-child{
        left: 100%;
      }
    }

    .login-type-wrap.next{
      .inp-item:first-child{
        left: -100%;
      }

      .inp-item:last-child{
        left: 0;
      }
    }
  }

  /*登录*/
  .login-btn-wrap{
    padding: 0 .25rem;

    .login-btn{
      color:#fff;
      width: 100%;
      height: .9rem;
      line-height: .9rem;
      font-size: 0.3rem;
      margin-top: 0.9rem;
      background:  linear-gradient(left, #d3edf6, #c9ddf4);
      border-radius: .45rem;
      box-shadow: 0 3px 7px rgba(88, 148, 222, .1);
    }

    .login-btn.active{
      background:  linear-gradient(left, #7acde5, #5894de);
    }

    span{
      color: #666;
      font-size: .24rem;
      margin-top: .3rem;
      cursor: default;
    }

    span:active{
      color: #5894de;
    }
  }
}
</style>
