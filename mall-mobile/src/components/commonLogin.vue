<template>
  <div class="com-login-wrap">
    <x-dialog v-model="dialogShow" class="dialog-demo" hide-on-blur>
      <div class="login-dialog">
        <ul>
          <li>
            <div>
              <input type="tel" placeholder="请输入手机号" v-model="formData.phone">
            </div>
          </li>
          <li>
            <div>
              <input type="tel" placeholder="请输入验证码" v-model="formData.code">
            </div>
            <div class="getCode" @click="getCode()">{{CodeText}}</div>
          </li>
          <li v-show="bindShouw">
            <div >
              <input type="text" placeholder="请输入邀请码" v-model="formData.beInvitationCode">
            </div>
          </li>
        </ul>
        <div class="login-btn" @click="loginPost()">手机快捷登录</div>
        <div class="close" @click="hide()">
          <span class="vux-close">
            x
          </span>
        </div>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import { XDialog } from 'vux'
  export default {
    components: {
      XDialog
    },
    props: [ 'showData' ],
    data () {
      return {
        bindShouw: false,         // 邀请码显示
        dialogShow: false,    // 弹框显示
        formData: {
          phone: '',              // 手机号码
          code: '',               // 验证码
          codeVal: '',            // 获取到的验证
          beInvitationCode: ''    // 邀请码
        },
        noTap: true,              // 防止多次提交
        Time: 60,                  // 倒计时时间
        getCodeNoTap: false,      // 获取验证码按钮是否允许点击
        CodeText: '发送验证码',   // 验证码文字
        timer: null,              // 定时器
        user: ''                  // 用户信息
      }
    },
    methods: {
      /**
       * 关闭弹窗
      */
      hide () {
        console.log({show: false, user: this.user})
        this.$emit('changeData', {show: false, user: this.user})
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
       * 关闭弹窗
       */
      loginPost () {
        if (!this.formData.phone) {
          this.$vux.toast.text('请输入手机号')
          return false
        } else if (!this.formData.phone.match(/^1\d{10}$/g)) {
          this.$vux.toast.text('请输入正确的手机号')
          return false
        } else if (!this.formData.code) {
          this.$vux.toast.text('请输入验证码')
          return false
        } else if (this.formData.code.length !== 4) {
          this.$vux.toast.text('验证码限4个字符')
          return false
        }
        this.checkCode(() => {
          this.loginRuquest()
        })
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
       * 登录请求
       */
      loginRuquest () {
        this.noTap = false
        this.$vux.loading.show({
          text: '正在登录中'
        })
        this.$http.post(`${this.api.login}`, {
          phone: this.formData.phone,
          password: this.formData.code,
          invitationCode: localStorage.getItem('invitationCode') || ''
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            this.$vux.toast.text(res.data.msg)
            return false
          } else {
            this.$vux.toast.text('登录成功')
            localStorage.setItem('bsbUserInfo', JSON.stringify(res.data.data))
            this.user = res.data.data
            this.postBind()
          }
        }).finally(() => {
          this.$vux.loading.hide()
          setTimeout(() => {
            this.noTap = true
          }, 100)
        })
      },

      postBind () {
        if (this.formData.beInvitationCode) { return false }
        this.$http.post(`${this.api.bandRecommendRelation}`, {
          beInvitationCode: this.formData.beInvitationCode,
          invitationCode: this.user.invitationCode
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            this.$vux.toast.text(res.data.msg)
            return false
          } else {
            this.$vux.toast.text('信息提交成功')
            this.hide(true)
          }
        })
      }
    },
    created () {
      var user = localStorage.getItem('bsbUserInfo') ? localStorage.getItem('bsbUserInfo') : ''
      if (user) {
        this.user = JSON.parse(user)
      }
      console.log(this.user)
    },
    watch: {
      showData: {
        handler (newValue) {
          console.log(newValue)
          this.dialogShow = newValue.showHideOnBlurByLottery
          this.bindShouw = newValue.isBind
        },
        deep: true
      }
    }
  }
</script>
<style lang="less">
  .com-login-wrap {
    .weui-dialog{
      overflow: visible;
      max-width: 7rem;
    }
  }
</style>
<style lang="less">
  .com-login-wrap{
    .login-mask{
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0,0,0,.5);
    }
    .login-dialog{
      position: relative;
      display: table;
      width: 100%;
      max-width: 7rem;
      margin: auto;
      background-color: #fff;
      text-align: center;
      border-radius: 3px;
      max-width: 7rem;
      width: 100%;

      ul{
        li{
          display: flex;
          align-items: center;
          height: .9rem;
          font-size: .28rem;
          color: #808080;
          border-bottom: 1px solid #eee;
          padding: 0 .2rem;
          div:nth-child(1){
            flex: 1;
          }
          input{
            width: 100%;
            height: 100%;
            background: none;
          }
          .getCode{
            text-align: center;
            padding: .1rem .15rem;
            font-size: .24rem;
            border: none;
            border: 1px solid #e7e7e7;
            border-radius: 3px;
            background: #f8f8f8;
          }
        }
      }

      .login-btn{
        width: 90%;
        height: .75rem;
        background: #ee3d3f;
        text-align: center;
        color: #fff;
        margin: 0 auto;
        line-height: .75rem;
        margin-top: .5rem;
        margin-bottom: .5rem;
        font-size: .28rem;
        border-radius: 5px;
      }

      .close{
        position: absolute;
        top: -0.4rem;
        right: 0rem;
        width: .6rem;
        height: .6rem;
        text-align: center;
        line-height: .55rem;
        border-radius: .3rem;
        background: #999999;
        color: white;
      }
    }
  }
</style>
