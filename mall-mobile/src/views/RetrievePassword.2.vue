<template>
  <div class="retrieve-password-wrap">

    <!-- 第一步 -->
    <template v-if="curStep === 0">
      <div class="ta-c tips-text">请填写您要找回的密码的账号</div>
      <div class="inp-item-wrap">
        <div class="pos-r inp-item">
          <input type="text" placeholder="请输入手机号" v-model="formData.phone" maxlength="11" @keyup="handlePhoneKeyup">
        </div>
      </div>

      <div class="sub-btn-wrap">
        <div class="ta-c sub-btn" :class="{active: nextBtnActive}" @click="handlevValidatePhone">下一步</div>
      </div>
    </template>

    <!-- 第二步 -->
    <template v-if="curStep === 1">
      <div class="ta-c inp-code-wrap">
        <div class="ta-c sended-text">我们已向<span class="d-ib phone">{{formData.phone}}</span>发送验证码短信，请查看短信并输入验证码</div>
        
        <input-password inputType="code" @input="handleInputCode"></input-password>

      </div>
      
      <div class="ta-c not-received" @click="showActionsheet = true">收不到验证码短信？</div>

      <actionsheet v-model="showActionsheet" :menus="actionsheetMenu" @on-click-menu="actionsheetClick" show-cancel></actionsheet>

      <div class="sub-btn-wrap">
        <div class="ta-c sub-btn" :class="{active: inputCodeSuccess}" @click="handlevValidateCode">下一步</div>
      </div>
    </template>

    <!-- 第三步 -->
    <template v-if="curStep === 2">
      <div class="ta-c sended-text">请为您的账号<span class="d-ib phone">{{formData.phone}}</span>设置一个新密码</div>
      <div class="inp-item-wrap">
        <div class="pos-r inp-item">
          <input type="password" placeholder="6-20个字符" v-model="formData.password" @keyup="handleInputPassword">
        </div>
      </div>

      <div class="sub-btn-wrap">
        <div class="ta-c sub-btn" :class="{active: saveBtnActive}" @click="handlevValidatePassword">保存新密码</div>
      </div>
    </template>

  </div>
</template>

<script>
import InputPassword from './public/InputPassword'
import {XDialog, XInput, Actionsheet} from 'vux'

export default {
  components: {InputPassword, XDialog, XInput, Actionsheet},
  data () {
    return {
      curStep: 0,                // 当前操作步骤
      formData: {
        // phone: '13800138003',               // 手机号
        phone: '',               // 手机号
        code: '',                // 验证码
        password: ''             // 密码
      },
      nextBtnActive: false,      // 下一步按钮高亮
      inputCodeSuccess: false,   // 验证码输入完成
      showActionsheet: false,    // 显示再次发送验证码
      actionsheetMenu: {
        list: '重新获取验证短信'
      },
      saveBtnActive: false       // 高亮显示保存密码
    }
  },

  methods: {
    /**
     * 校验验证码
     */
    handlePhoneKeyup () {
      this.nextBtnActive = (this.formData.phone && this.formData.phone.match(/^1\d{10}$/g)) ? !!true : !!false
    },

    /**
     * 过滤手机号
     */
    handlevValidatePhone () {
      if (!this.formData.phone) {
        this.$vux.toast.text('请输入手机号')
        return false
      } else if (!this.formData.phone.match(/^1\d{10}$/g)) {
        this.$vux.toast.text('手机号不正确')
        return false
      }
      this.handleSendCode()
    },

    /**
     * 发送验证码
     */
    handleSendCode () {
      // this.curStep = 1
      this.$http.post(this.api.getCode, {
        phone: this.formData.phone
      }).then((res) => {
        let resData = res.data
        this.$vux.toast.text(resData.msg)
        if (resData.status === this.api.ERR_OK) {
          this.curStep = 1
        }
      })
    },

    /**
     * 收不到验证码短信
     */
    actionsheetClick (value) {
      if (value !== 'cancel') this.handleSendCode()
    },

    /**
     * 输入验证码
     */
    handleInputCode (value) {
      this.formData.code = value
      this.inputCodeSuccess = (value.length === 4) ? !!true : !!false
    },

    /**
     * 校验验证码
     */
    handlevValidateCode () {
      if (this.inputCodeSuccess) {
        this.curStep = 2
      } else {
        this.$vux.toast.text('请输入完整密码')
      }
    },

    /**
     * 输入密码
     */
    handleInputPassword () {
      this.saveBtnActive = (this.formData.password.length >= 6 && this.formData.password.length <= 20) ? !!true : !!false
      return this.saveBtnActive
    },

    /**
     * 校验密码
     */
    handlevValidatePassword () {
      if (!this.formData.password) {
        this.$vux.toast.text('请输入密码')
        return false
      } else if (this.formData.password.length < 6 || this.formData.password.length > 20) {
        this.$vux.toast.text('密码6-20个字符')
        return false
      }
      this.$http.post(`${this.api.resetPassword}`, {
        phone: this.formData.phone,
        password: this.formData.password,
        confirmPwd: this.formData.password,
        verifyCode: this.formData.code
      }).then((res) => {
        let resData = res.data
        if (resData.status !== this.api.ERR_OK || !res) {
          this.$vux.toast.text(resData.msg)
          return false
        } else {
          this.$vux.toast.text(resData.msg)
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.retrieve-password-wrap{
  padding-top: 1rem;

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
        font-size: .3rem;
        border: none;
        margin-left: 0;
        padding-left: 0;
        background: none;
      }

      .code{
        color:#ed3738;
        height: .9rem;
        line-height: .9rem;
        font-size: .28rem;
        right: 0;
        bottom: 0;
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
  
  /* -------------------- { 提交按钮 } -------------------- */
  .sub-btn-wrap{
    padding: 0 .4rem;

    .sub-btn{
      color:#fff;
      width: 100%;
      height: .9rem;
      line-height: .9rem;
      font-size: 0.28rem;
      margin-top: 0.9rem;
      background:#f9b7b7;
      border-radius: .45rem;
      box-shadow: 0 3px 7px rgba(88, 148, 222, .1);
    }

    .sub-btn.active{
      background: linear-gradient(90deg,#f77574,#ed3638);
      -webkit-background: linear-gradient(90deg,#f77574,#ed3638);
    }

    span{
      color: #333;
      margin-top: .3rem;
    }
  }

  .tips-text{
    color: #999;
    margin-bottom: .4rem;
    padding: 0 .2rem;
  }

  .not-received{
    color: #3aa5ed;
    font-size: .28rem;
    margin-top: .4rem;
  }
}
</style>
