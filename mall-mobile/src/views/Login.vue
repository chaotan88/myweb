<!-- 登录 -->
<template>
  <div class="login-wrap">
    <div class="login-box">
      <div>
        <!--表单-->
        <div class="input-box">
          <div class="title-box">
            <div class="pos-r nav-tab-wrap">
              <div class="d-ib ta-c fw-b fl-l nav-list" :class="{active: curStep === 0}" @click="curStep = 0">账号密码登录</div>
              <div class="d-ib ta-c fw-b fl-l nav-list" :class="{active: curStep === 1}" @click="curStep = 1">手机号快捷登录</div>
              <!-- <span class="d-b pos-a tab-bar" :style="{width: tabBarWidth, left: tabBarPos}"></span> -->
            </div>
          </div>

          <div class="inp-item-wrap">
            <div class="pos-r inp-item phone">
              <span class="pos-a label">手机号</span>
              <input type="tel" placeholder="请输入手机号" v-model="formData.phone" maxlength="11" autocomplete="off">
            </div>
            <div class="pos-r login-type-wrap" :class="{next: curStep === 1}">
              <div class="pos-a inp-item">
                <span class="pos-a label">密　码</span>
                <input type="password" placeholder="请输入登录密码" minlength="6" maxlength="20" v-model="formData.password" autocomplete="off">
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
        <!--记住密码-->
        <div class="remember-pwd" v-if="curStep === 0">
          <label>
            <input type="checkbox" id="remember" v-model="formData.rememberPwd">
            <span>记住密码</span>
          </label>
        </div>
        <!--登录-->
        <div class="login-btn-wrap">
          <div class="ta-c login-btn" :class="{active: subActive}" @click="loginCheck" v-if="noTap">登录</div>
          <div class="ta-c login-btn" :class="{active: subActive}" v-else>登录</div>
          <span class="fl-l" @click="$router.push('/retrieve-password')">忘记密码</span>
          <!--<span class="fl-r" @click="$router.push('/register')">注册账号</span>-->
          <span class="fl-r" @click="goRegister">注册账号</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XDialog } from 'vux'
import { setTimeout } from 'timers'

export default {
  components: {
    Tab,
    TabItem,
    XDialog
  },
  data () {
    return {
      noTap: true,              // 防止多次提交
      curStep: 0,               // 当前步骤 [0、密码登录，1、短信验证码登录]
      tabBarWidth: '',          // 导航宽度
      tabBarPos: '',            // 导航定位
      showAgreement: false,     // 显示协议
      accountMes: '',           // 村粗的账户密码信息
      formData: {
        phone: '',              // 手机号码
        code: '',               // 验证码
        codeVal: '',            // 获取到的验证码
        password: '',           // 密码
        rememberPwd: false      // 是否记住密码 默认否
      },
      subActive: false,         // 提交按钮选中效果
      Time: 60,                 // 倒计时时间
      getCodeNoTap: false,      // 获取验证码按钮是否允许点击
      CodeText: '发送验证码',    // 验证码文字
      timer: null,              // 定时器
      agreementCon: ''          // 注册协议的内容
    }
  },

  watch: {
    'curStep' (value) {
      // this.tabBarWidth = value === 0 ? '1.8rem' : '0.2rem'
      // this.tabBarPos = value === 0 ? '25%' : '75%'
    },

    'formData': {
      handler () {
        this.subActive = (this.curStep === 0 && this.formData.phone && this.formData.password) || (this.curStep === 1 && this.formData.phone && this.formData.code) ? !!true : !!false
      },
      deep: true
    }
  },

  mounted () {
    var accountMes = JSON.parse(localStorage.getItem('accountMes'))
    if (accountMes && JSON.stringify(accountMes) !== '{}') {
      this.formData.phone = accountMes.userName             // 存储的账户
      this.formData.password = accountMes.password           // 存储的密码
      this.formData.rememberPwd = accountMes.rememberPwd    // 存储的是否记住密码状态
    }
  },

  methods: {
    goRegister () {
      let attCode = this.$route.query.attCode
      if (attCode) {
        this.$router.push({path: '/register', query: {attCode: 'A0001'}})
      } else {
        this.$router.push({path: '/register'})
      }
    },
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
     * 解析路径
     */
    ptahChart (url) {
      var index = url.indexOf('?')
      var path = url.substring(0, index)
      var parm1 = url.substring(index + 1)
      var res = parm1.split('&')
      var parm = { }
      for (let i in res) {
        var list = res[i].split('=')
        parm[list[0]] = list[1]
      }
      parm.path = path
      return parm
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
      var accountMes = {}    // 要存储的账户信息
      this.noTap = false
      this.$vux.loading.show({
        text: '正在登录中'
      })
      // 是否联合登陆
      let fromType = localStorage.getItem('fromType') || ''
      var url = (fromType === 'android' || fromType === 'iOS') ? '?clientName=bigTurn' : ''
      this.$http.post(`${this.api.login + url}`, {
        phone: this.formData.phone,
        password: this.curStep === 0 ? this.formData.password : this.formData.code,
        invitationCode: localStorage.getItem('invitationCode') || ''
      }).then((res) => {
        accountMes.userName = this.formData.phone
        localStorage.setItem('accountMes', JSON.stringify(accountMes))
        if (res.data.status !== this.api.ERR_OK || !res) {
          this.$vux.toast.text(res.data.msg)
          return false
        } else {
          this.$vux.toast.text('登录成功')
          localStorage.setItem('popId', '1')
          // 是否记住密码
          if (this.formData.rememberPwd) {
            accountMes.password = this.formData.password
          } else {
            accountMes.password = ''
          }
          accountMes.rememberPwd = this.formData.rememberPwd
          localStorage.setItem('accountMes', JSON.stringify(accountMes))
          localStorage.setItem('bsbUserInfo', JSON.stringify(res.data.data))
//          let token = localStorage.getItem('fromToken')
          if (fromType === 'android') {
            // 联合登录的回调
            console.log('安卓')
            if (window.java) {
              window.java.loginSuccess(res.data.data.phone, res.data.data.token)
            }
          } else if (fromType === 'iOS') {
            console.log('来自iOS')
            if (window.webkit) {
              window.webkit.messageHandlers.loginSuccess.postMessage({phone: res.data.data.phone, token: res.data.data.token})
            }
          }
          console.log('REDIRECT_URL', localStorage.getItem('REDIRECT_URL'))
          if (localStorage.getItem('REDIRECT_URL')) {
            setTimeout(() => {
              localStorage.removeItem('fromType')
              this.routerReplace({path: localStorage.getItem('REDIRECT_URL')})
              localStorage.removeItem('REDIRECT_URL')
            }, 100)
          } else {
            setTimeout(() => {
              localStorage.removeItem('fromType')
              this.routerReplace({path: '/index'})
            }, 100)
          }
        }
      }).finally(() => {
        this.$vux.loading.hide()
        setTimeout(() => {
          this.noTap = true
        }, 100)
      })
    },

    /**
     * 登录验证
     */
    loginCheck () {
      if (!this.subActive) return false
      if (!this.formData.phone) {
        this.$vux.toast.text('请输入手机号')
        return false
      } else if (!this.formData.phone.match(/^1\d{10}$/g)) {
        this.$vux.toast.text('请输入正确的手机号')
        return false
      } else if (this.curStep === 0) {
        if (!this.formData.password) {
          this.$vux.toast.text('请输入密码')
          return false
        } else if (this.formData.password.length < 6 || this.formData.password.length > 20) {
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
      background-size: 100%;
    }

    .sys-title{
      color: #fff;
      font-size: .46rem;
      font-family: 'microsoft yahei';
      padding: 1rem 0;

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
      height: 1rem;
      padding: 0 .2rem;
      .nav-list{
        // width: 50%;
        color: #666;
        height: .9rem;
        line-height: .9rem;
        font-size: .3rem;
        cursor: pointer;
        margin-right: .7rem;
      }

      .nav-list.active{
        color: #f23030;
        border-bottom: .04rem solid #f23030;
      }

      .tab-bar{
        width:0;
        height:0;
        border-width:0 0.2rem 0.2rem;
        border-style:solid;
        border-color:transparent transparent #fff;
        margin-left: -.2rem;
        position:absolute;
        bottom: 0;
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
        height: .8rem;
        font-size: .3rem;
        margin-left: 0.4rem;
        border:none;
        padding-left: 1.5rem;
        background: none;
        -webkit-box-shadow: 0 0 0 100px white inset
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
  /**记住密码**/
  .remember-pwd{
    font-size: .24rem;
    color: #666;
    padding:0 .2rem;
    margin: .2rem 0;
    label{
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    input{
      width: .3rem;
      height: .3rem;
      margin-right: .05rem;
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
      background:#f9b7b7;
      border-radius: .45rem;
      box-shadow: 0 3px 7px rgba(88, 148, 222, .1);
    }

    .login-btn.active{
      background: linear-gradient(90deg,#f77574,#ed3638);
      -webkit-background: linear-gradient(90deg,#f77574,#ed3638);
    }

    span{
      color: #666;
      font-size: .24rem;
      margin-top: .3rem;
    }

    span:active{
      color: #5894de;
    }
  }
}
</style>
