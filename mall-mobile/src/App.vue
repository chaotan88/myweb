<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title"  :key="key" ></router-view>
    <!--footer-->
    <com-footer v-if="isShowFooter == 1 && !this.$route.query.isShop" :route="$route.path"></com-footer>
    <!--<comStoreFooter v-if="(this.$route.meta.isStoreFooter && this.$route.query.isShop) || (this.$route.meta.isStoreFooter && !this.$route.meta.isShowFooter)"></comStoreFooter>-->
    <group-footer v-if="isShowFooter == 2 "></group-footer>
    <barter-footer v-if="isShowFooter == 3 "></barter-footer>
    <x-dialog v-model="showPop" class="dialog-demo popImgc">
      <div class="popInfo">
        <div class="closeIng"><img src="./assets/images/groupImg/del1.png" @click="closethisPop"/></div>
        <div class="popImg"><img :src="popInfo.registerPopImg"/></div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog } from 'vux'
import Vue from 'vue'
import ComHeader from './components/ComHeader' // 页头
import ComFooter from './components/ComFooter' // 页脚
import groupFooter from './components/groupBooking/groupFooter' // 页脚
import barterFooter from './components/barterAreaFooter'
export default {
  name: 'app',
  data () {
    return {
      isShowFooter: 0, // 底部导航类型 1 首页  2 拼团
      user: {},
      showPop: false,
      popInfo: {}
    }
  },
  mounted () {
    var user = localStorage.getItem('bsbUserInfo') ? localStorage.getItem('bsbUserInfo') : ''
    if (user) {
      this.user = JSON.parse(user) || {}
    }
    window.exitFun = this.exitFun
    window.loginRuquest = this.loginRuquest
  },
  created () {
    // var v = this.urlFn('shareInvitationCode') || this.urlFn('invitationCode') || ''
    // if (v) {
    //   localStorage.setItem('invitationCode', v)
    // }
    let shareInvitationCode = this.urlFn('shareInvitationCode')
    let InvitationCode = this.urlFn('invitationCode')
    if (shareInvitationCode === '') {
      localStorage.removeItem('invitationCode')
    } else if (InvitationCode === '') {
      localStorage.removeItem('invitationCode')
    } else if (shareInvitationCode || InvitationCode) {
      localStorage.setItem('invitationCode', (shareInvitationCode || InvitationCode))
      localStorage.setItem('sharePath', location.pathname)
    }
  },
  methods: {
    urlFn (ename) {
      var url = location.search
      var Request = {}
      if (url.indexOf('?') !== -1) {
        // 截取掉?
        var str = url.substr(1)
        // 按照&切割
        let strs = str.split('&')
//          ['invitationCode=100', 'shopId=100']
        // 组装 Request{key: value}
        for (var i = 0; i < strs.length; i++) {
          Request[strs[i].split('=')[0]] = (strs[i].split('=')[1])
        }
        var res = ename ? Request[ename] : Request
        return res
      }
    },
    closethisPop () {
      this.showPop = false
      this.popInfo.popUpStatus = 2
      localStorage.setItem('bsbUserInfo', JSON.stringify(this.popInfo))
    },
    /**
     * 登录请求
     */
    loginRuquest (parm) {
//      alert(parseInt(parm.phone))
//      alert(this.user.phone)
//      if (parseInt(parm.phone) !== parseInt(this.user.phone)) {
//        localStorage.setItem('REDIRECT_URL', this.$route.fullPath)
//        localStorage.removeItem('bsbUserInfo')
//        this.$router.replace({path: '/login'})
//      }
//      return false
      this.$vux.loading.show({
        text: '正在登录中'
      })
      this.$http.post(`${this.api.login}?${this.api.allLogin}`, {
        phone: parm.phone,
        password: parm.code,
        invitationCode: ''
      }).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) {
          this.$vux.toast.text(res.data.msg)
          return false
        } else {
          localStorage.setItem('bsbUserInfo', JSON.stringify(res.data.data))
//          let fromType = this.$route.query.fromType
 //          this.$emit('userType', 1)
//           let token = this.$route.query.token
//          if (fromType === 'android') {
//            // 联合登录的回调
//             if (!window.java) {
//               window.java.loginSuccess(res.data.data.phone, res.data.data.token)
//             }
//          } else if (fromType === 'iOS') {
//             if (!window.webkit) {
//              window.webkit.messageHandlers.loginSuccess.postMessage({phone: res.data.data.phone, token: res.data.data.token})
//             }
//          }
        }
      }).finally(() => {
        this.$vux.loading.hide()
      })
    },
    /**
     * 退出登录
     */
    exitFun () {
      let user = localStorage.getItem('bsbUserInfo') ? localStorage.getItem('bsbUserInfo') : ''
      if (!user) {
        return false
      }
      user = JSON.parse(user)
      this.$http.post(`${this.api.logout}`, {
        phone: user.phone,
        token: user.token
      }).then((res) => {
        if (res.data.status === this.api.ERR_OK || !res) {
          localStorage.removeItem('bsbUserInfo')        // 移除保存的用户信息
          // 移除保存的记住密码
          var accountMes = JSON.parse(localStorage.getItem('accountMes'))
          accountMes.password = ''
          accountMes.rememberPwd = false
          localStorage.setItem('accountMes', JSON.stringify(accountMes))
          localStorage.removeItem('historyData')        // 移除用户搜索记录
          this.$store.dispatch('updateUpgradeSte', '')  // 更新vux中数据
        }
        this.$vux.toast.text(res.data.msg)
      })
    }
  },
  computed: {
    // 处理一个页面中的链接点击再次跳入当前页面(只是后面参数有变化)url变化页面不刷新问题
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  watch: {
    '$route' (to, from) {
      this.popInfo = localStorage.getItem('bsbUserInfo') ? JSON.parse(localStorage.getItem('bsbUserInfo')) : ''
      if (this.popInfo) {
        if (this.popInfo.popUpStatus === 1) {
          this.showPop = true
        }
      } else if (!this.popInfo) {
        this.showPop = false
      }
      /** ************************ *********************************/
      this.isShowFooter = this.$route.query.isGruop ? this.$route.query.isGruop : this.$route.meta.isShowFooter
      var integralUserInfo = JSON.parse(localStorage.getItem('integralUserInfo'))       // 积分系统存储的信息
      var webLoginSuccess = localStorage.getItem('webLoginSuccess')                     // 积分系统登录成功
      // var bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))              // 电商信系统存储的信息
      // 电商、积分系统自动登录
      if (webLoginSuccess) {
        this.$http.post(`${this.api.login}`, {
          phone: integralUserInfo.phone,
          password: integralUserInfo.token,
          invitationCode: localStorage.getItem('invitationCode') || ''
        }).then((res) => {
          if (res.data.status === this.api.ERR_OK || !res) {
            localStorage.setItem('bsbUserInfo', JSON.stringify(res.data.data))
            this.$store.dispatch('updateUpgradeSte', '')     // 更新vux中数据
            localStorage.removeItem('webLoginSuccess')      // 移除登录标识
          }
        })
      }
      // 电商、积分系统自动退出
      if (localStorage.getItem('webLogoutSuccess')) {
        if (JSON.parse(localStorage.getItem('bsbUserInfo')) && JSON.parse(localStorage.getItem('bsbUserInfo')).token) {
          this.$http.post(`${this.api.logout}`, {
            phone: JSON.parse(localStorage.getItem('bsbUserInfo')) ? JSON.parse(localStorage.getItem('bsbUserInfo')).phone : '',
            token: JSON.parse(localStorage.getItem('bsbUserInfo')) ? JSON.parse(localStorage.getItem('bsbUserInfo')).token : ''
          }).then((res) => {
            if (res.data.status === this.api.ERR_OK || !res) {
              localStorage.removeItem('bsbUserInfo')           // 移除保存的用户信息
              localStorage.removeItem('historyData')           // 移除用户搜索记录
              this.$store.dispatch('updateUpgradeSte', '')     // 更新vux中数据
              localStorage.removeItem('webLogoutSuccess')      // 移除退出登录标识
            }
          })
        }
      }
      // 百度商桥
      if (to.path === '/index' || to.path === '/my') {
        (function () {
          var hm = document.createElement('script')
          hm.src = 'https://hm.baidu.com/hm.js?3e7746d030a9b70db41becdd717cdade'
          var s = document.getElementsByTagName('script')[0]
          s.parentNode.insertBefore(hm, s)
        })()
      } else {
        var m = document.getElementById('newBridge')
        if (m) {
          m.parentNode.removeChild(m)
        }
      }
      // 获取积分来源
      if (to.path === '/myWallet' || to.path === '/serviceIntegral' || to.path === '/myPointsDetail' || to.path === '/myBalance') {
        this.$http.get(`${this.api.getSysDictionaryList}`, {
          params: {
            dataType: 1        // 1:积分来源
          }
        }).then((res) => {
          let resData = res.data
          if (res.data.status === this.api.ERR_OK || !res) {
            Vue.filter('integralSourceFilter', function (val) {
              let arr = []
              arr = resData.data.filter((row) => parseInt(row.dataCode) === parseInt(val))
              if (arr.length > 0) {
                return arr[0].dataValue
              } else {
                return val
              }
            })
          }
        })
      }
    }
  },
  components: {
    ComHeader,
    ComFooter,
    groupFooter,
    XDialog,
    barterFooter
  }
}
</script>

<style lang="less">
  .popInfo{
    width: 6rem;
    height: 8rem;
  }
  .closeIng{
    width: 5rem;
    height: 1.5rem;
    position: relative;
    img{
      width: 0.57rem;
      height: 0.57rem;
      position: absolute;
      right: -0.6rem;
    }
  }
  .popImg{
    width: 5rem;
    height: 6.5rem;
    background: transparent;
    img{
      width: 100%;
      height: 6.5rem;
    }
  }
</style>
<style lang="less">
  .popImgc{
    .weui-dialog {
      position: fixed;
      display: table;
      z-index: 5000;
      width: 70%;
      max-width: 325px;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      background-color: transparent!important;
      text-align: center;
      border-radius: 3px;
    }
  }
</style>
