<template>
    <div class="login">
      <div class="login-box">
        <div>
          <!--表单-->
          <ul class="input-box">
            <li class="phone">
              <img src="../assets/images/phone.png" >
              <input type="tel" placeholder="手机号" v-model="phone" maxlength="11">
            </li>
            <li class="password">
              <img src="../assets/images/lock.png" >
              <input type="number" placeholder="动态验证码" class="pwdInput" v-model="code">
              <span v-if="!getCodeNoTap" class="code" @click="getCode">{{CodeText}}</span>
              <span v-else class="code">{{CodeText}}</span>
            </li>
          </ul>
          <!--登录-->
          <div class="loginBtn" @click="loginCheck">登录</div>
        </div>
        <!--条款-->
        <div class="infor">
          登录即代表您已阅读并同意 <span @click="showAgreement = true">《用户注册条款》</span>
        </div>
      </div>
      <!--协议-->
      <x-dialog  v-model="showAgreement"  :hide-on-blur="true" :dialog-style="{'text-align': 'left', width: '75%', 'max-width': '7.5rem'}">
        <div class="Agreement-con">
          <div v-html="agreementCon.content" v-if="agreementCon" class="Agreement-con-txt"></div>
          <div @click="showAgreement = false" class="agreeAgreement">同意协议</div>
        </div>
      </x-dialog>
    </div>
</template>

<script>
  import { XDialog } from 'vux'
  import { setTimeout } from 'timers'
  export default {
    components: {
      XDialog
    },
    data () {
      return {
        showAgreement: false,                    // 显示协议
        phone: '',                               // 手机号码
        code: '',                                // 验证码
        codeVal: '',                             // 获取到的验证码
        Time: 60,                                // 倒计时时间
        getCodeNoTap: false,                     // 获取验证码按钮是否允许点击
        CodeText: '发送验证码',                   // 验证码文字
        timer: null,                             // 定时器
        agreementCon: ''                         // 注册协议的内容
      }
    },
    mounted: function () {
      this.getAgreement() // 注册协议
    },
    methods: {
      /**
       * 倒计时
      */
      CountDown () {
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
        if (this.phone === '') {
          this.$vux.toast.text('请输入手机号')
          return false
        } if (!this.phone.match(/^((1[0-9]{1})+\d{9})$/)) {
          this.$vux.toast.text('请输入正确的手机号')
          return false
        }
        // 倒计时
        this.sendCode()
        this.CountDown()
        this.timer = setInterval(() => {
          this.CountDown()
        }, 1000)
      },
      /**
       * 发送验证码
      */
      sendCode () {
        this.$http.post(`${this.api.getCode}`, {
          phone: this.phone
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.data) {
            this.codeVal = res.data.data
          }
        })
      },
      /**
       * 检测手机验证码是否一致
      */
      checkCode (fun) {
        this.$http.post(`${this.api.checkCode}`, {
          phone: this.phone,
          verifyCode: this.code
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
        this.$http.post(`${this.api.login}`, {
          phone: this.phone,
          password: this.code,
          invitationCode: localStorage.getItem('invitationCode') || ''
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            this.$vux.toast.text(res.data.msg)
            return false
          } else {
            this.$vux.toast.text('登录成功')
            localStorage.setItem('bsbUserInfo', JSON.stringify(res.data.data))
            setTimeout(() => {
              if (this.$route.query.redirect) {
                // 登录成功后 往跳转的页面添加isLoginBtn参数 表示登录成功跳转过去的
                var pageUrl = this.$route.query.redirect
                pageUrl = pageUrl.indexOf('?') === -1 ? pageUrl : pageUrl + '&' + 'isLoginBtn=1'
                this.$router.replace(pageUrl)
              } else {
                this.$router.replace({path: '/my', query: {isLoginBtn: 1}})
              }
            }, 100)
          }
        })
      },
      /**
       * 登录验证
      */
      loginCheck () {
        if (this.phone === '') {
          this.$vux.toast.text('请输入手机号')
          return false
        } if (!this.phone.match(/^((1[0-9]{1})+\d{9})$/)) {
          this.$vux.toast.text('请输入正确的手机号')
          return false
        } if (this.code === '') {
          this.$vux.toast.text('请输入验证码')
          return false
        }
        // this.loginRuquest()
        // 检测验证码是否正确
        this.checkCode(() => {
          this.loginRuquest()
        })
      },
      /**
       * 用户协议
      */
      getAgreement () {
        this.$http.post(this.api.getContent, {
          type: 1
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.agreementCon = res.data.data
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
    .login {
      padding:0 0.4rem;
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
      }
      /*表单*/
      .input-box{
        li{
          width: 100%;
          border-bottom: 1px solid #eee;
          /* padding:0.2rem 0; */
          position: relative;
          margin-top:0.3rem;
          img{
            width: 0.25rem;
            height: 0.35rem;
            display: block;
            position: absolute;
            left: 0;
            bottom:0.2rem;
          }
          input{
            font-size: 0.28rem;
            margin-left: 0.4rem;
            width: 6.1rem;
            border:none;
            height: .8rem;
            background: none;
          }
          .pwdInput{
            width:4.0rem;
          }
          .code{
            display: block;
            position: absolute;
            right: 0;
            bottom: 0.2rem;
            border-left:1px solid #eee;
            padding:0.1rem 0 0.1rem 0.3rem;
            color:#ed3738;
            font-size: .28rem;
          }
        }
      }
      /* &:after{
        display: block;
        content: ".";
        height: 0;
        line-height: 0;
        clear: both;
        visibility: hidden;
      } */
      /*登录*/
      .loginBtn{
        width: 100%;
        height: .9rem;
        line-height: .9rem;
        text-align: center;
        font-size: 0.32rem;
        background: #ef4042;
        color:#fff;
        margin-top:0.9rem;
        border-radius: 0.10rem;
      }
      /*条款*/
      .infor{
        width: 100%;
        text-align: center;
        font-size: 0.24rem;
        color:#999;
        margin-bottom: 0.8rem;
        span{
          color:#3aa5ed;
        }
      }
      /*******协议*******/
      .Agreement-con{
        width: 100%;
        height: 6rem;
        background: #fff;
        z-index: 100;
        border-radius: 4px;
        font-size: .3rem;
        padding-top:.4rem;
        .Agreement-con-txt{
          color: #666;
          height: 5rem;
          overflow-y: scroll;
          padding: 0 .3rem;
          font-size: .28rem;
        }
        .agreeAgreement{
          height: 1rem;
          text-align: center;
          font-size: .3rem;
          color: #3aa5ed;
          line-height: 1rem;
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          margin: auto;
          z-index: 500;
        }
      }
    }
</style>
