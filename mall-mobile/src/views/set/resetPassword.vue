<!-- 重置登录密码 -->
<template>
  <div class="password-login-wrap">

    <div class="inp-item-wrap">
      <div class="inp-item">
        <span class="label">旧密码</span>
        <input type="password" placeholder="请输入旧密码" v-model="formData.passwordOld" @keyup="inputKeyup">
      </div>
      <div class="pos-r inp-item">
        <span class="label">新密码</span>
        <input type="password" placeholder="请输入新密码" v-model="formData.passwordNew" @keyup="inputKeyup">
      </div>
      <div class="pos-r inp-item">
        <span class="label">确认密码</span>
        <input type="password" placeholder="请输入确认密码" v-model="formData.passwordConfirm" @keyup="inputKeyup">
      </div>
      <div class="gray-tips-text">密码必须至少6-20个字符，而且同时包含字母和数字。</div>

      <div class="sub-btn-wrap">
        <div class="ta-c sub-btn" :class="{active: btnAactive}" @click="handleSave" v-if="noTap">保存新密码</div>
        <div class="ta-c sub-btn" :class="{active: btnAactive}" v-else>保存新密码</div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      noTap: true,                  // 防止多次提交
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
    this.userInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
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
      this.noTap = false
      this.$http.post(`${this.api.updatePass}`, {
        id: this.userInfo.userId,
        password: this.formData.passwordOld,
        newPassword: this.formData.passwordNew,
        subNewPassword: this.formData.passwordConfirm
      }).then((res) => {
        let resData = res.data
        this.$vux.toast.text(resData.msg)
        if (resData.status !== this.api.ERR_OK || !res) {
          return false
        } else {
          this.$router.back()
        }
      }).finally(() => {
        this.$vux.loading.hide()
        setTimeout(() => {
          this.noTap = true
        }, 100)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .password-login-wrap{
    .inp-item-wrap{
      padding: 0 .3rem;
      .inp-item{
        display: flex;
        align-items: center;
        height: 1rem;
        border-bottom: 1px solid #eeeeee;
        span{
          display: block;
        }
        input{
          height: 100%;
          background: none;
          flex: 1;
          margin-left: .5rem;
          display: block;
        }
      }
      .gray-tips-text{
        color: #aaa;
        font-size: .24rem;
        margin-bottom: .3rem;
        margin-top: .3rem;
      }
      .sub-btn{
        color:#fff;
        width: 100%;
        height: .9rem;
        line-height: .9rem;
        font-size: 0.28rem;
        margin-top: 0.9rem;
        background: #f9b7b7;
        border-radius: .45rem;
        box-shadow: 0 3px 7px rgba(88, 148, 222, .1);
        &.active{
          background:  linear-gradient(left, #f77574, #ed3638);
        }
      }
    }
  }
</style>
