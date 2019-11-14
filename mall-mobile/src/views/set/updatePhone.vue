<!-- 更换手机号 -->
<template>
  <div class="setup-phone-update-wrap">

    <div class="inp-item-wrap">
      <div class="inp-item phone">
        <span class="label">手机号</span>
        <input type="tel" placeholder="手机号" v-model="userInfo.phone" maxlength="11" @keyup="inputKeyup">
        <input type="tel" maxlength="11" placeholder='绑定新手机号' v-model="newPhone" v-if="nextSte">
        <div v-else>{{phoneData}}</div>
      </div>
      <div class="login-type-wrap">
        <div class="inp-item" >
          <span class="label">验证码</span>
          <input type="number" placeholder="输入动态验证码" minlength="4" maxlength="4" v-model="formData.code" @keyup="inputKeyup">
          <span v-if="!getCodeNoTap" class="code" @click="getCode">{{codeText}}</span>
          <span v-else class="code">{{codeText}}</span>
        </div>
      </div>
    </div>

    <div class="sub-btn-wrap">
      <div class="ta-c sub-btn" :class="{active: subBtnActive}" @click="confirmUpdate">确认修改</div>
    </div>

  </div>
</template>

<script>
import modifyPhone from '../public/modifyPhone'
export default {
  components: {
    modifyPhone
  },
  data () {
    return {
      getCodeNoTap: false, // 获取验证码按钮是否允许点击
      Time: 60,
      timer: null,            // 定时器
      CodeText: '点击获取', // 验证码文字
      newPhone: '', // 新手机号
      getCodeType: 1, // 获取验证码类型 1 原手机号获取，2 新手机号获取 默认为1
      codeVal: '', // 输入的验证码的值
      requestCodeVal: '', // 接口获取的验证码
      nextSte: false // 是否显示下一步
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
  },

  methods: {
    /**
     * 输入内容
     */
    inputKeyup () {
      this.subBtnActive = this.formData.phone && this.formData.code.length === 4 ? !!true : !!false
    }
  }
}
</script>

<style lang="less" scoped>
.setup-phone-update-wrap{
  padding: 0 .4rem;
  .inp-item{
    width: 100%;
    height: .9rem;
    line-height: .9rem;
    border-bottom: 1px solid #eee;
    margin-top:0.3rem;
    left: 0;
    transition: .3s ease-in-out;
    display: flex;

    .label{
      color: #3c3c3c;
      font-size: .3rem;
    }

    input{
      font-size: .3rem;
      border:none;
      background: none;
      height: 100%;
      flex: 1;
      margin-left: .6rem;
      margin-right: .2rem;
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
  }
  .sub-btn-wrap{
    .sub-btn{
      color: #fff !important;
      width: 100%;
      height: .9rem;
      line-height: .9rem;
      font-size: 0.28rem;
      margin-top: 0.9rem;
      background: #f9b7b7;
      border-radius: .45rem;
      box-shadow: 0 3px 7px rgba(88, 148, 222, .1);
    }

    .sub-btn.active{
      background: linear-gradient(to right, #f77574, #ed3638);
    }

    span{
      color: #333;
      margin-top: .3rem;
      display: block;
    }
  }
}
</style>
