<!-- 设置首页 -->
<template>
  <div class="setup-wrap">
    <group>
      <cell is-link title="手机号" link="/setup/phone">{{userInfo.phone | filterPhone}}</cell>
      <cell is-link title="密码设置" link="/setup/password"></cell>
    </group>

    <div class="pos-f logout-wrap">
      <div class="ta-c logout-btn" @click="handleLogout">退出登录</div>
    </div>
  </div>
</template>

<script>
import {Group, Cell} from 'vux'

export default {
  components: {
    Group,
    Cell
  },

  data () {
    return {
      userInfo: {}      // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('integralUserInfo'))
  },

  methods: {
    /**
     * 退出登录
     */
    handleLogout () {
      this.$vux.loading.show({
        text: '正在退出...'
      })
      this.$http.post(`${this.api.logout}`, {
        phone: this.userInfo.phone,
        token: this.userInfo.token
      }).then((res) => {
        let fromType = localStorage.getItem('fromType')
        if (fromType === 'android') {
          // 联合登录的回调
          window.java.logoutSuccess()
          // localStorage.removeItem('fromType')
        } else if (fromType === 'iOS') {
          window.webkit.messageHandlers.logoutSuccess.postMessage({})
        } else {
          localStorage.setItem('webLogoutSuccess', 'true')
          if (localStorage.getItem('webLoginSuccess')) {
            localStorage.removeItem('webLoginSuccess')
          }
        }
        if (res.data.status !== this.api.ERR_OK || !res) {
          if (parseInt(res.data.status) !== 9903) {
            this.$vux.toast.text(res.data.msg)
            return false
          }
        } else {
          localStorage.removeItem('integralUserInfo')
          localStorage.removeItem('integralUpgradeState')
          this.$vux.toast.text('退出成功')
          if (localStorage.getItem('fromType')) {
            setTimeout(() => {
              this.$router.replace({path: '/login', query: {fromType: localStorage.getItem('fromType')}})
            }, 100)
          } else {
            setTimeout(() => {
              this.$router.replace({path: '/login'})
            }, 100)
          }
        }
      }).finally(() => {
        this.$vux.loading.hide()
      })
    }
  }
}
</script>

<style lang="less">
.setup-wrap{
  .weui-cells{
    margin: 0;
  }

  .vux-no-group-title{
    margin: 0;
  }

  /* -------------------- { 退出登录 } -------------------- */
  .logout-wrap{
    width: 100%;
    padding: 0 .4rem;
    bottom: .3rem;
    box-sizing: border-box;

    .logout-btn{
      color: #fff;
      width: 100%;
      height: .9rem;
      line-height: .9rem;
      font-size: 0.30rem;
      background: #ef4042;
      border-radius: .1rem;
    }
  }
}
</style>
