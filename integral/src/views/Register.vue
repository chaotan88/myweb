<!-- 注册 -->
<template>
  <div class="register-wrap">

    <!-- 第一步 -->
    <template v-if="curStep === 0">

      <h2 class="ta-c sys-title">手机号注册</h2>

      <div class="inp-item-wrap">
        <div class="pos-r inp-item">
          <span class="pos-a label">+86</span>
          <input type="text" placeholder="请输入手机号" v-model="formData.phone" maxlength="11" v-on:input ="firstKeyup">
        </div>
        <div class="pos-r inp-item">
          <span class="pos-a label">*邀请人ID号</span>
          <input type="text" placeholder="请输入邀请人ID号" v-model="formData.invitCode" v-on:input ="firstKeyup" maxlength="5" onkeyup="value=value.toUpperCase()">
          <span class="invit-name pos-a" v-if="invitCodeFlag">{{formData.invitName}}</span>
        </div>
        <!--<div class="pos-r inp-item">-->
          <!--<span class="pos-a label">*朋友圈ID号</span>-->
          <!--<input type="text" placeholder="请输入朋友圈ID号" v-model="formData.friendsCode" v-on:input ="firstKeyup">-->
        <!--</div>-->
      </div>

      <div class="reg-agreement">注册即表示同意<span @click="agreementVisible = true">《用户服务协议》</span></div>

      <div class="register-btn-wrap">
        <div class="ta-c register-btn register-btn-first" :class="{active: subActive}" @click="handleSendCodeBefore">注册</div>
      </div>

      <div class="back-to-login ta-c" @click="$router.push('/login')">已有账号，去登录</div>

      <x-dialog  v-model="agreementVisible"  :hide-on-blur="true" :dialog-style="{'text-align': 'left', width: '75%', 'max-width': '7.5rem'}">
        <div class="agreement-con">
          <div v-if="agreementCon" class="agreement-con-txt">
            <p>尊敬的会员们，您好！</p>

          </div>
          <div @click="agreementVisible = false" class="ta-c pos-a agree-agreement">
            <span class="d-ib" @click="agreementVisible = false">同意协议</span>
            <span class="d-ib" @click="$router.push('/login')">不同意</span>
          </div>
        </div>
      </x-dialog>
    </template>

    <!-- 第二步 -->
    <template v-if="curStep === 1">
      <div class="ta-c inp-code-wrap">
        <div class="ta-c sended-text">我们已向<span class="d-ib phone">{{formData.phone}}</span>发送验证码短信，请查看短信并输入验证码</div>
        <input-password inputType="code" @input="codeChange"></input-password>
      </div>

      <div class="ta-c not-received" @click="showActionsheet = true">收不到验证码短信？</div>

      <actionsheet v-model="showActionsheet" :menus="actionsheetMenu" @on-click-menu="actionsheetClick" show-cancel></actionsheet>

      <div class="register-btn-wrap">
        <div class="ta-c register-btn" :class="{active: inputCodeSuccess}" @click="handlevValidateCode">下一步</div>
      </div>
    </template>

    <!-- 第三步 -->
    <template v-if="curStep === 2">
      <div class="ta-c inp-code-wrap">
        <div class="ta-c sended-text">请为您的账号<span class="d-ib phone">{{formData.phone}}</span>设置一个密码</div>
      </div>

      <div class="inp-item-wrap">
        <div class="pos-r inp-item">
          <span class="pos-a label">输入密码</span>
          <input type="password" placeholder="6-20个字符" v-model="formData.password" min="6" maxlength="20" @keyup="handlePasswordKeyup">
        </div>
        <div class="pos-r inp-item">
          <span class="pos-a label">确认密码</span>
          <input type="password" placeholder="6-20个字符" v-model="formData.passwordAgain" min="6" maxlength="20" @keyup="handlePasswordKeyup">
        </div>
      </div>

      <div class="register-btn-wrap">
        <div class="ta-c register-btn" :class="{active: saveBtnActive}" @click="handleSavePassword">保存密码</div>
      </div>
    </template>

    <!-- 其他 -->
    <x-dialog v-model="showToast" class="register-confirm-wrap">
      <div class="register-confirm-box">
        <div class="confirm-header">
          <span class="fl-r" @click="showToast = false">×</span>
          <h3 class="ta-l">确认您的邀请人信息</h3>
        </div>
        <div class="confirm-body">
          <p>请确认您的邀请人，一旦确认将无法修改</p>
          <div>
            <dl>
              <dt>邀请人ID号</dt>
              <dd>{{formData.invitCode}}</dd>
            </dl>
            <dl>
              <dt>邀请人姓名</dt>
              <dd>{{formData.invitName | filterEmpty}}</dd>
            </dl>
            <dl>
              <dt>邀请人手机</dt>
              <dd>{{formData.invitPhone}}</dd>
            </dl>
          </div>
        </div>
        <div class="confirm-footer">
          <div @click="showToast = false">修改邀请人</div>
          <div @click="getIsRegister">确认</div>
        </div>
      </div>
    </x-dialog>

  </div>
</template>

<script>
import InputPassword from './public/InputPassword'
import {XDialog, XInput, Actionsheet} from 'vux'

export default {
  components: {InputPassword, XDialog, XInput, Actionsheet},

  data () {
    return {
      curStep: 0,                   // 当前步骤
      formData: {
        // phone: '13800138000',       // 手机号
        phone: '',                  // 手机号
        invitCode: '',              // 邀请码
        // friendsCode: '',              // 朋友圈ID
        invitName: '',              // 邀请人
        invitPhone: '',              // 邀请人
        code: '',                   // 验证码
        password: '',               // 密码
        passwordAgain: ''           // 确认密码
      },
      showToast: false,              // 确认注册信息弹框
      invitCodeFlag: false,           // 确认注册信息弹框
      curInvitCode: '',           // 当前输入验证码
      subActive: false,             // 提交按钮选中效果
      agreementVisible: false,      // 注册协议弹窗
      agreementCon: {},             // 用户协议内容
      inputCodeSuccess: false,      // 验证码输入完成
      showActionsheet: false,       // 显示再次发送验证码
      isRegister: false,             // 是否注册
      actionsheetMenu: {
        list: '重新获取验证短信'
      },
      saveBtnActive: false          // 高亮显示保存密码
    }
  },

  mounted () {
    this.formData.invitCode = this.$route.query.invitationCode || ''
    this.getAgreement()
  },

  methods: {
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
    },

    /**
     * 是否注册
     */
    getIsRegister () {
      this.$http.post(this.api.isRegister, {
        phone: this.formData.phone
      }).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          this.isRegister = false
          this.showToast = false
          this.handleCheckInvitcode()
        } else {
          this.isRegister = true
          this.$vux.toast.text(resData.msg)
          return false
        }
      })
    },

    /**
     * 校验注册
     */
    registerCheck () {
      if (!this.formData.phone) {
        this.$vux.toast.text('请输入手机号')
        return false
      } else if (!this.formData.phone.match(/^1\d{10}$/)) {
        this.$vux.toast.text('请输入正确的手机号')
        return false
      } else if (!this.formData.invitCode) {
        this.$vux.toast.text('请输入邀请人ID号')
        return false
      } else if (!this.formData.invitCode.match(/^[A-Z]\d{4,}$/)) {
        this.$vux.toast.text('邀请码对应用户不存在')
        return false
      }
      return true
    },

    /**
     * 第一步输入内容
     */
    firstKeyup () {
      if (this.formData.phone && this.formData.invitCode) {
        this.subActive = true
      } else {
        this.subActive = false
      }
      // 输入验证码够5位是请求接口验证
      if (this.formData.invitCode.length === 5) {
        this.checkInvCode()
      } else {
        this.formData.invitName = ''
        this.formData.invitPhone = ''
      }
    },

    /**
     * 验证邀请码
     */
    checkInvCode () {
      this.$http.post(`${this.api.checkInvitCode}`, {
        recommendCode: this.formData.invitCode
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$vux.toast.text(resData.msg)
          this.invitCodeFlag = false
          return false
        } else {
          this.formData.invitName = resData.data.beCardName
          this.formData.invitPhone = resData.data.bePhone
          this.invitCodeFlag = true
        }
      })
    },

    /**
     * 注册发送验证码
     */
    handleSendCodeBefore () {
      if (this.registerCheck() && this.invitCodeFlag) {
        this.showToast = true
        // if (this.curInvitCode === this.formData.invitCode && this.invitCodeFlag) {
        //   this.showToast = true
        //   return false
        // }
        // if (this.curInvitCode === this.formData.invitCode && !this.invitCodeFlag) {
        //   return false
        // }
        // if (!this.formData.invitCode.match(/^[A-Z]\d{4,}$/)) {
        //   this.$vux.toast.text('邀请码对应用户不存在')
        // } else {
        //   this.curInvitCode = this.formData.invitCode
        //   this.showToast = true
        // }
      }
    },

    /**
     * 校验邀请码
     */
    handleCheckInvitcode () {
      this.$http.post(this.baseUrl + 'login/checkInvicationCode', {
        invicationCode: this.formData.invitCode,
        recommendCode: this.formData.invitCode
      }).then((res) => {
        let resData = res.data
        if (resData.status !== this.api.ERR_OK) {
          this.$vux.toast.text(resData.msg)
          return false
        }
        this.handleSendCode()
      })
    },

    /**
     * 发送验证码
     */
    handleSendCode () {
      if (!this.formData.phone.match(/^1\d{10}$/)) {
        this.$vux.toast.text('请输入正确的手机号')
        return false
      }
      this.$http.post(this.api.getCode, {
        phone: this.formData.phone
      }).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) this.curStep = 1
        this.$vux.toast.text(res.data.msg)
      })
    },

    /**
     * 输入框值改变
     */
    codeChange (value) {
      this.formData.code = value
      if (value.length === 4) this.inputCodeSuccess = true
      this.handlevValidateCode()
    },

    /**
     * 收不到验证码短信
     */
    actionsheetClick (value) {
      if (value !== 'cancel') this.handleSendCode()
    },

    /**
     * 校验验证码
     */
    handlevValidateCode () {
      if (this.inputCodeSuccess) {
        this.$http.post(`${this.api.checkCode}`, {
          phone: this.formData.phone,
          verifyCode: this.formData.code
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            this.$vux.toast.text(res.data.msg)
            return false
          } else {
            this.curStep = 2
          }
        })
      }
    },

    /**
     * 密码输入
     */
    handlePasswordKeyup () {
      let password = this.formData.password
      let passwordAgain = this.formData.passwordAgain
      this.saveBtnActive = (password.match(/^.{6,20}$/) && passwordAgain.match(/^.{6,20}$/)) ? !!true : !!false
    },

    /**
     * 保存密码
     */
    handleSavePassword () {
      let pwd = this.formData.password
      let pwdAgain = this.formData.passwordAgain
      if (!pwd) {
        this.$vux.toast.text('请输入密码')
        return false
      } else if (pwd.length < 6 || pwd.length > 20) {
        this.$vux.toast.text('密码6-20位')
        return false
      }
      if (!pwdAgain) {
        this.$vux.toast.text('请输入确认密码')
        return false
      } else if (pwdAgain.length < 6 || pwdAgain.length > 20) {
        this.$vux.toast.text('确认密码6-20位')
        return false
      }
      if (pwd !== pwdAgain) {
        this.$vux.toast.text('密码输入不一致')
        return false
      }
      this.handleRegister()
    },

    /**
     * 注册
     */
    handleRegister () {
      this.$vux.loading.show({
        text: '正在保存...'
      })
      this.$http.post(`${this.api.register}`, {
        phone: this.formData.phone,
        password: this.formData.password,
        confirmPwd: this.formData.passwordAgain,
        verifyCode: this.formData.code,
        recommendCode: this.formData.invitCode,
        invitationCode: this.formData.invitCode
      }).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) {
          this.$vux.toast.text(res.data.msg)
          return false
        } else {
          this.$vux.toast.text('注册成功')
          this.$router.push('/login')
        }
      }).finally(() => {
        this.$vux.loading.hide()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.register-wrap{
  .sys-title{
    color: #666;
    font-size: .46rem;
    font-family: 'microsoft yahei';
    padding: .6rem 0;
  }

  /* -------------------- { 注册主体 } -------------------- */
  .register-confirm-wrap{
    width: 100%;

    .register-confirm-box{
      /*padding: .2rem .3rem;*/
      border-radius: .05rem;

      .confirm-header{
        padding: .2rem .3rem;
        border-bottom: 1px solid #d9d9d9;

        span{
          font-size: .4rem;
          line-height: .44rem;
        }
      }

      .confirm-body{
        font-size: .2rem;
        margin: 0 .3rem;

        p{
          margin: .2rem 0;
          text-align: left;
          color: #f74d4d;
        }

        dl{
          display: flex;
          border: 1px solid #d9d9d9;
          height: .6rem;
          line-height: .6rem;

          dt{
            width: 40%;
            border-right: 1px solid #d9d9d9;
            background: #ebeef5;
          }

          dd{
            width: 60%;
            text-align: center;
          }

        }

        dl:nth-child(2) {
          border-top: 0;
          border-bottom: 0;
        }
      }

      .confirm-footer{
        display: flex;
        margin-top: .2rem;
        border-top: 1px solid #d9d9d9;

        div{
          width: 50%;
          /*color: #f74d4d;*/
          padding: .2rem 0;
          font-size: .24rem;
        }

        div:last-child{
          color: #fff;
          background: #f74d4d;
        }
      }
    }
  }

  /* -------------------- { 注册主体 } -------------------- */
  .inp-item-wrap{
    padding: 0 .22rem;

    .inp-item{
      width: 100%;
      height: .9rem;
      line-height: .9rem;
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
        margin-left: 0;
        border:none;
        padding-left: 2rem;
        background: none;
        box-sizing: border-box;
      }

      .pwdInput{
        width:4.0rem;
      }

      .code{
        color:#ed3738;
        height: .9rem;
        line-height: .9rem;
        font-size: .28rem;
        right: 0;
        bottom: 0;
      }

      .invit-name{
        right: 0;
        bottom: 0;
      }
    }
  }

  .register-btn-wrap{
    padding: 0 .4rem;

    .register-btn{
      color:#fff;
      width: 100%;
      height: .9rem;
      line-height: .9rem;
      font-size: 0.28rem;
      margin-top: 0.9rem;
      background:  linear-gradient(left, #d3edf6, #c9ddf4);
      border-radius: .45rem;
      box-shadow: 0 3px 7px rgba(88, 148, 222, .1);
    }
    .register-btn-first{
      margin-top: .2rem;
    }

    .register-btn.active{
      background:  linear-gradient(left, #7acde5, #5894de);
    }

    span{
      color: #333;
      margin-top: .3rem;
    }
  }
  .back-to-login{
    margin-top: .2rem;
    font-size: .24rem;
    color: #3c7ac6;
  }

  /* -------------------- { 注册协议 } -------------------- */
  .reg-agreement{
    width: 100%;
    font-size: .24rem;
    color:#999;
    margin-top: .7rem;
    padding: 0 .4rem;
    bottom: .4rem;
    box-sizing: border-box;

    span{
      color: #3c7ac6;
    }
  }

  /* -------------------- { 注册协议弹窗 } -------------------- */
  .agreement-con{
    width: 100%;
    height: 6rem;
    font-size: .3rem;
    padding-top:.4rem;
    background: #fff;
    z-index: 100;
    border-radius: 4px;
    p:not(:first-child){
      margin-bottom: .15rem;
      text-indent: 2em;
    }
    p:first-child{
      margin-bottom: .3rem;
    }

    .agreement-con-txt{
      color: #666;
      height: 5rem;
      overflow-y: scroll;
      padding: 0 .3rem;
      font-size: .28rem;
    }

    .agree-agreement{
      color: #3aa5ed;
      height: 1rem;
      font-size: .3rem;
      margin: auto;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 500;

      span{
        height: .6rem;
        line-height: .62rem;
        margin: .2rem;
        padding: 0 .2rem;
        border-radius: .1rem;
      }

      span:first-child{
        color: #fff;
        background:  linear-gradient(left, #7acde5, #5894de);
      }

      span:last-child{
        color: #999;
        border: 1px solid #ccc;
      }
    }
  }

  /* -------------------- { 接收验证码 } -------------------- */
  .inp-code-wrap{
    padding: .5rem .4rem 0;

    .sended-text{
      color: #999;
      margin-bottom: .4rem;
      padding: 0 .2rem;

      .phone{
        color: #333;
        margin: 0 .1rem;
      }
    }

    .inp-code{
      width: .8rem;
      height: .8rem;
      border: 1px solid #e5e5e5;
      margin: .3rem .2rem;
    }

  }

  .not-received{
    color: #3aa5ed;
    font-size: .28rem;
    margin-top: .4rem;
  }
}
</style>
<style lang="less">
  .register-confirm-wrap{
    .weui-dialog{
      width: 100%;
      max-width: 6rem;
      border-radius: .1rem;
    }
  }
</style>
