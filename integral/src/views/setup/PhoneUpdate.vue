<!-- 更换手机号 -->
<template>
  <div class="setup-phone-update-wrap">

    <div class="inp-item-wrap">
      <div class="pos-r inp-item phone">
        <span class="pos-a label">手机号</span>
        <input type="tel" placeholder="手机号" v-model="formData.phone" maxlength="11" @keyup="inputKeyup">
      </div>
      <div class="pos-r login-type-wrap">
        <div class="inp-item" >
          <span class="pos-a label">验证码</span>
          <input type="number" placeholder="输入动态验证码" minlength="4" maxlength="4" v-model="formData.code" @keyup="inputKeyup">
          <span v-if="!getCodeNoTap" class="pos-a code" @click="getCode">{{codeText}}</span>
          <span v-else class="pos-a code">{{codeText}}</span>
        </div>
      </div>
    </div>

    <div class="sub-btn-wrap">
      <div class="ta-c sub-btn" :class="{active: subBtnActive}" @click="confirmUpdate">确认修改</div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        phone: '',              // 手机号
        code: '',               // 验证码
        codeVal: ''             // 获取到的验证码
      },
      codeText: '获取验证码',    // 验证码文字
      getCodeNoTap: false,      // 获取验证码按钮是否允许点击
      Time: 60,                 // 倒计时时间
      timer: null,              // 定时器
      subBtnActive: false       // 按钮高亮
    }
  },

  methods: {
    /**
     * 输入内容
     */
    inputKeyup () {
      this.subBtnActive = this.formData.phone && this.formData.phone.match(/^1\d{10}$/gi) && this.formData.code.length === 4 ? !!true : !!false
    },

    /**
     * 倒计时
     */
    countDown () {
      if (this.Time > 0) {
        this.getCodeNoTap = true
        this.codeText = this.Time + 's'
        --this.Time
      } else {
        clearInterval(this.timer)
        this.Time = 60
        this.getCodeNoTap = false
        this.codeText = '重新获取'
      }
    },

    /**
     * 校验输入结果
     */
    validateInput () {
      if (!this.formData.phone) {
        this.$vux.toast.text('请输入手机号')
        return false
      } if (!this.formData.phone.match(/^1\d{10}$/g)) {
        this.$vux.toast.text('请输入正确的手机号')
        return false
      }
      return true
    },

    /**
     * 获取验证码
     */
    getCode () {
      if (this.validateInput()) {
        console.log('发送验证码')
        // 倒计时
        this.sendCode()
        this.countDown()
        this.timer = setInterval(() => {
          this.countDown()
        }, 1000)
      }
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
     * 确认修改
     */
    confirmUpdate () {
      if (this.validateInput()) {
        // 调用保存接口
        this.checkCode(() => {
          let userInfo = JSON.parse(localStorage.getItem('integralUserInfo'))
          this.$http.post(`${this.api.modifyPhone}`, {
            id: userInfo.userId,
            phone: this.formData.phone,
            verifyCode: this.formData.code
          }).then((res) => {
            this.$vux.toast.text(res.data.msg)
            if (res.data.status === this.api.ERR_OK) {
              userInfo.phone = this.formData.phone
              localStorage.setItem('integralUserInfo', JSON.stringify(userInfo))
              this.$router.back()
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.setup-phone-update-wrap{
  .sub-btn-wrap{
    padding: .4rem;
  }
}
</style>
