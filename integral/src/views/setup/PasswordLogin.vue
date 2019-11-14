<!-- 重置登录密码 -->
<template>
  <div class="password-login-wrap">

    <div class="inp-item-wrap">
      <div class="pos-r inp-item">
        <span class="pos-a label">旧密码</span>
        <input type="password" placeholder="请输入旧密码" v-model="formData.passwordOld" @keyup="inputKeyup">
      </div>
      <div class="pos-r inp-item">
        <span class="pos-a label">新密码</span>
        <input type="password" placeholder="请输入新密码" v-model="formData.passwordNew" @keyup="inputKeyup">
      </div>
      <div class="pos-r inp-item">
        <span class="pos-a label">确认密码</span>
        <input type="password" placeholder="请输入确认密码" v-model="formData.passwordConfirm" @keyup="inputKeyup">
      </div>
      <div class="gray-tips-text">密码必须至少6-20个字符，而且同时包含字母和数字。</div>

      <div class="sub-btn-wrap">
        <div class="ta-c sub-btn" :class="{active: btnAactive}" @click="handleSave">保存新密码</div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      btnAactive: false,        // 按钮选中
      formData: {
        passwordOld: '',        // 旧密码
        passwordNew: '',        // 新密码
        passwordConfirm: ''     // 确认密码
      },
      rePwd: /^.{6,20}$/gi,
      matchTips: '密码必须至少6-20个字符，而且同时包含字母和数字。',
      userInfo: {}              // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('integralUserInfo'))
  },

  methods: {
    /**
     * 内容输入
     */
    inputKeyup () {
      let passwordOld = this.formData.passwordOld
      let passwordNew = this.formData.passwordNew
      let passwordConfirm = this.formData.passwordConfirm
      // let re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/gi
      this.btnAactive = (passwordOld.match(this.rePwd) && passwordNew.match(this.rePwd) && passwordConfirm.match(this.rePwd)) ? !!true : !!false
    },

    /**
     * 保存
     */
    handleSave () {
      if (!this.btnAactive) return false
      let passwordOld = this.formData.passwordOld
      let passwordNew = this.formData.passwordNew
      let passwordConfirm = this.formData.passwordConfirm
      if (!passwordOld) {
        this.$vux.toast.text('请输入旧密码')
        return false
      } else if (!passwordOld.match(this.rePwd)) {
        this.$vux.toast.text(this.matchTips)
        return false
      }
      if (!passwordNew) {
        this.$vux.toast.text('请输入新密码')
        return false
      } else if (!passwordNew.match(this.rePwd)) {
        this.$vux.toast.text(this.matchTips)
        return false
      }
      if (!passwordConfirm) {
        this.$vux.toast.text('请输入确认密码')
        return false
      } else if (!passwordConfirm.match(this.rePwd)) {
        this.$vux.toast.text(this.matchTips)
        return false
      }
      this.$vux.loading.show({
        text: '正在保存...'
      })
      this.$http.post(`${this.api.updatePass}`, {
        id: this.userInfo.userId,
        password: this.formData.passwordOld,
        newPassword: this.formData.passwordNew,
        subNewPassword: this.formData.passwordConfirm
      }).then((res) => {
        let resData = res.data
        if (resData.status !== this.api.ERR_OK || !res) {
          this.$vux.toast.text(resData.msg)
          return false
        } else {
          this.$vux.toast.text(resData.msg)
          this.$router.push('/setup/password')
        }
      }).finally(() => {
        this.$vux.loading.hide()
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
