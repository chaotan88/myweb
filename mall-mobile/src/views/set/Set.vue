<template>
    <div class="set">
      <!--列表-->
      <ul>
        <li @click="$router.push('/phone')">
          <div>手机号</div>
          <div v-if="userInfo">{{userInfo.phone | filterPhone}}</div>
          <x-icon type="ios-arrow-forward" size=".4rem"></x-icon>
        </li>
        <li @click="$router.push('/password')">
          <div>密码设置</div>
          <x-icon type="ios-arrow-forward" size=".4rem"></x-icon>
        </li>
      </ul>
      <!--退出登录-->
      <div class="exit-box">
        <div class="exit-btn" @click="exitFun">退出登录</div>
      </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        userInfo: ''
      }
    },
    mounted: function () {
      this.userInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
    },
    methods: {
      /**
       * 退出登录
      */
      exitFun () {
        this.$http.post(`${this.api.logout}`, {
          phone: this.userInfo ? this.userInfo.phone : '',
          token: this.userInfo ? this.userInfo.token : ''
        }).then((res) => {
          if (res.data.status === this.api.ERR_OK || !res) {
            localStorage.removeItem('bsbUserInfo')        // 移除保存的用户信息
            localStorage.removeItem('popId')
            // 移除保存的记住密码
            var accountMes = JSON.parse(localStorage.getItem('accountMes'))
            accountMes.password = ''
            accountMes.rememberPwd = false
            localStorage.setItem('accountMes', JSON.stringify(accountMes))
            localStorage.removeItem('historyData')        // 移除用户搜索记录
            this.$store.dispatch('updateUpgradeSte', '')  // 更新vux中数据
            this.routerReplace({
              path: '/login'
            })
          }
          this.$vux.toast.text(res.data.msg)
        })
      }
    }
  }
</script>

<style scoped lang=less>
    .set {
      /*列表*/
      ul{
        li{
          display: flex;
          align-items: center;
          height:1rem;
          border-bottom: 1px solid #eee;
          padding:0 0.3rem;
          font-size: .28rem;
          div:nth-child(1){
            flex:1;
          }
          .vux-x-icon{
            fill: #999999;
            margin-left: .1rem;
          }
        }
      }
      /*退出登录*/
      .exit-box{
        /* position: absolute;
        left: 0;
        right: 0;
        bottom: 0.5rem;
        padding:0 0.3rem; */
        .exit-btn{
          width: 90%;
          margin: 0 auto;
          height: 0.8rem;
          line-height: 0.8rem;
          text-align: center;
          color:#fff;
          background: #f23030;
          font-size: 0.32rem;
          border-radius: 0.1rem;
          margin-top: 3rem;
          margin-bottom: 1rem;
        }
      }
    }
</style>
