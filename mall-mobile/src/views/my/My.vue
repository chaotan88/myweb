<template>
  <div class="my" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <!--用户信息-->
    <div class="user-base">
      <!-- 用户基本信息 -->
      <div class="base-information" @click="personalData.user ? editPersonalData() : $router.push({path:'/login',query: {redirect: '/my'}})">
        <div class="information-himg">
          <div class="imgBox">
            <img :src="getUserRankData.avatar|| imgDate[personalData.rank] || defaultImg" />
          </div>
          <div class="text" v-show="personalData.rankName">
            {{personalData.rankName}}
          </div>
        </div>
        <div class="information-name">
          <template v-if="!isLogin">
            <p v-if="personalData.user">{{ personalData.user.phone | filterPhone}}</p>
            <div class="coveLBox"><div class="cover1"><p class="cover2" :style="'width:' + pat + '%'"></p></div>{{ (getUserRankData.userSumConsume) | numberToW}} / {{(getUserRankData.nextRankAgentFees) | numberToW}}</div>
            <div class="coveLBox" style="width: 3.5rem;padding: 0 .2rem">
              <div>拼团数：{{(getUserRankData.userGroupNum || 0) | numberToW}} / {{(getUserRankData.groupNum || 0) | numberToW}}</div>
              <div style="text-align: right">粉丝数：{{(getUserRankData.userFansNum || 0) | numberToW}} / {{(getUserRankData.fanNum || 0) | numberToW}}</div>
            </div>

          </template>
          <template v-else>
            <p>登录&nbsp;/&nbsp;注册</p>
          </template>
        </div>
        <!--<div class="information-icn">-->
          <!--<img src="../../assets/images/my/vip.png">-->
        <!--</div>-->
      </div>
      <!-- 设置按钮 -->
      <img src="../../assets/images/my/seting.png" class="user-set" @click.stop="$router.push('/set')" v-if="personalData.user">
      <!-- 我的钱包 -->
      <div class="my-wallet">
        <!-- 进度条 -->
        <!--<div class="Box">-->
          <!--<div class="gradeBox" >-->
            <!--&lt;!&ndash;- 消费会员 -&ndash;&gt;-->
            <!--<div class="text" >-->
            <!--<span>-->
              <!--<img src="../../assets/images/my/image_mine_vip_icon@2x.png"/>-->
            <!--</span>-->
              <!--<span v-if="!isLogin">-->
              <!--{{totalIntegral.disRuleName}}-->
            <!--</span>-->
              <!--<span v-else>-->
               <!--登录后可查看等级-->
             <!--</span>-->
            <!--</div>-->
<!--            <div class="grade-speed" v-if="!isLogin">-->
<!--              <div class="speed-bar">-->
<!--                <div class="speed-bar-active" v-if="progressRatio">-->
<!--                  &lt;!&ndash;<span id="spedNum">{{totalIntegral.bonusPoints}}</span>&ndash;&gt;-->
<!--                  <div class="speed-bar-activeBack" :style="{ width: progressRatio}"></div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
          <!--</div>-->
          <!--<div class="speed-num">-->
            <!--<span>{{totalIntegral.bonusPoints}} </span>-->
            <!--<span>{{nextRulePoint.consumePoint ? ' / ' + nextRulePoint.consumePoint : ''}}</span>-->
          <!--</div>-->
        <!--</div>-->
        <div class="wallet-con">
          <!--<div class="con-img">-->
            <!--<img src="../../assets/images/my/wallet-icon.png">-->
          <!--</div>-->
          <!--<div class="con-price">-->
            <!--<p>我的钱包</p>-->
            <!--<p>{{totalIntegral.balance || 0 | moneyFilter}}余额</p>-->
          <!--</div>-->
          <!--<div class="con-ste">收益中</div>-->
          <div class="item" @click="$router.push('/myWallet')">
            <div class="con-img">
              <img src="../../assets/images/my/image_mine_wallet@2x.png">
            </div>
            <div class="con-price">
              <p>我的钱包</p>
            </div>
          </div>
          <div class="item item2" @click="checkCode">
            <div class="con-img">
              <img src="../../assets/images/my/image_mine_QR_code@2x.png">
            </div>
            <div class="con-price">
              <p>邀请赚佣</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 我的订单 -->
    <div class="my-type">
      <div class="type-title">
        <p>我的订单</p>
        <p @click="goOrderList('')">
          <span>全部</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-youjiantou1"></use>
          </svg>
        </p>
      </div>
      <ul>
        <li @click="goOrderList(1)">
            <div class="icon">
              <img src="../../assets/images/my/wait-pay.png" >
              <i v-if="orderNums.waitPay > 0">{{orderNums.waitPay}}</i>
            </div>
            <div>待付款</div>
          </li>
        <li @click="goOrderList(2)">
          <div class="icon">
            <img src="../../assets/images/my/wait-delivery.png" >
            <i v-if="orderNums.waitSendGoods > 0">{{ orderNums.waitSendGoods }}</i>
          </div>
          <div>待发货</div>
        </li>
        <li @click="goOrderList(3)">
          <div class="icon">
            <img src="../../assets/images/my/wait-back.png" >
            <i v-if="orderNums.waitReceiveGoods > 0">{{ orderNums.waitReceiveGoods }}</i>
          </div>
          <div>待收货</div>
        </li>
        <li @click="goOrderList(4)">
          <div class="icon">
            <img src="../../assets/images/my/wait-comments.png" >
            <i v-if="orderNums.waitComment > 0">{{ orderNums.waitComment }}</i>
          </div>
          <div>待评价</div>
        </li>
        <li @click="goAddressList">
          <div class="icon">
            <img src="../../assets/images/my/receive-address.png" >
          </div>
          <div>收货地址</div>
        </li>
        <li @click="$router.push('/myCollect')">
          <div class="icon">
            <img src="../../assets/images/my/commodity-collection.png" >
          </div>
          <div>商品收藏</div>
        </li>
        <li @click="$router.push('/myCoupons')">
          <div class="icon">
            <img src="../../assets/images/my/quan.png" >
          </div>
          <div>优惠券</div>
        </li>
      </ul>
    </div>
    <!-- 我的服务 -->
    <div class="my-type">
      <div class="type-title">
        <p>我的服务</p>
        <!-- <p>
          全部
          <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-youjiantou1"></use>
        </svg>
        </p> -->
      </div>
      <ul>
        <!--积分管理--->
        <li @click="goPointsSys">
          <div class="icon">
            <img src="../../assets/images/my/Integral-management.png" >
          </div>
          <div>积分管理</div>
        </li>
        <!--分享有奖--->
        <li @click="$router.push('/sharePurchase')">
          <div class="icon">
            <img src="../../assets/images/my/recommend-prize.png" >
          </div>
          <div>分享有奖</div>
        </li>
        <!--会务购票--->
        <!--<li @click="goTickets">-->
          <!--<div class="icon">-->
            <!--<img src="../../assets/images/my/ticket-purchase.png" >-->
          <!--</div>-->
          <!--<div>会务购票</div>-->
        <!--</li>-->
        <li>
          <div class="icon">
            <a :href="'tel:' + gsPhone">
              <img src="../../assets/images/my/tell.png" >
            </a>
          </div>
          <div>客服热线</div>
        </li>
        <!--任务获芯豆--->
        <li @click="$router.push('/getGoldCoin')">
          <div class="icon">
            <img src="../../assets/images/my/coreBean.png" >
          </div>
          <div>任务获芯豆</div>
        </li>
        <!--拉群助手--->
        <!--<li @click="pullGroup">-->
          <!--<div class="icon">-->
            <!--<img src="../../assets/images/my/erweima.png" >-->
          <!--</div>-->
          <!--<div>拉群助手</div>-->
        <!--</li>-->
      </ul>
    </div>
    <!--广告图-->
    <!-- <div class="my-adv">
      <img src="../../assets/images/my/my-ad.png" class="user-set">
    </div> -->
    <!--推荐商品列表-->
    <guss-like ref="gussLike"></guss-like>
    <!-- <commonGoodsList goodsTypes="my" :isShowMore="false" :isShowBanner="false"></commonGoodsList> -->
    <!-- 弹窗 -->
    <div>
      <!--<x-dialog v-model="showToast" class="dialog-demo ta-c">-->
        <!--<div class="alert-wrap pos-r">-->
          <!--<div class="alert-cen">-->
            <!--<h3 class="ta-c">您的积分已到达升级标准</h3>-->
            <!--<h4 class="ta-c">快去升级获取更多收益</h4>-->
            <!--<div class="upgrade-button ta-c pos-a" @click="upgradeImmediately">马上升级</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="welcome-wrap pos-a ta-c">-->
          <!--<div class="welcome-bg pos-a"></div>-->
          <!--<div class="welcome-close pos-r ta-r" @click="closePop">-->
            <!--<x-icon type="ios-close-outline" size="30"></x-icon>-->
          <!--</div>-->
        <!--</div>-->
        <!-- <div @click="showToast=false">
          <span class="vux-close"></span>
        </div> -->
      <!--</x-dialog>-->
      <x-dialog v-model="showBind" class="dialog-demo ta-Bind">
        <div class="alert-wrap pos-r">
          <div class="alert-cen2">
            <div class="border">
              <h4 class="">您需要绑定邀请人,才</h4>
              <h4 class="">允许邀请赚分佣</h4>
              <div class="bot" @click="goBind"> 立即绑定 </div>
            </div>
          </div>
        </div>
        <div class="welcome-wrap pos-a ta-c">
          <div class="welcome-close2 pos-r ta-r" @click="showBind = false">
            <x-icon type="ios-close-outline" size="30"></x-icon>
          </div>
        </div>
      </x-dialog>
    </div>
    <shaerDom :shareData="shareCon" ref="imageWrapper" v-model="wxCode"></shaerDom>
    <com-store-footer v-if="(this.$route.meta.isStoreFooter && this.$route.query.isShop) || (this.$route.meta.isStoreFooter && !this.$route.meta.isShowFooter)"></com-store-footer>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import gussLike from '../../components/gussLike' // 猜你喜欢
  import comStoreFooter from '../../components/dayTrade/comStoreFooter'
  import { Confirm, XDialog, TransferDomDirective as TransferDom } from 'vux'
  import shaerDom from '../../components/shaer/createShareImg.vue'
  import html2canvas from 'html2canvas'
  // import { setTimeout } from 'timers'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Confirm,
      gussLike,
      XDialog,
      comStoreFooter,
      shaerDom
    },
    data () {
      return {
        aaacreat: require('../../assets/images/my/alert.png'),
        showBind: false,                      // 提示绑定邀请人
        wxCode: false,                        // 邀请注册弹框
        isLogin: true,                        // 是否登录了
        bsbUserInfo: {},                      // 存储的个人信息
        showToast: false,
        adb: {},
        personalData: {},                      // 个人资料信息
        getUserRankData: {},                   // 个人等级  头像
        totalIntegral: {},                     // 积分
        nextRulePoint: '',                     // 下一等级信息
        pat: 0,                                // 进度百分比 (新)
        progressRatio: 0,                      // 进度百分比（旧)
        goodsNumList: [],                      // 商品数量
        customerServiceShow: false,            // 客服的显示隐藏
        orderNums: '',                         // 各个订单个数
        registerStatus: null,                  // 是否积分系统注册状态
        upgradeConditionSte: null,             // 用户是否满足升级条件状态
        gsPhone: '',
        shareCon: {
          mainImage: require('../../assets/images/my/alert.png')
        },
        imgDate: {
          0: require('../../assets/images/groupImg/ph.png'), // 普通会员
          1: require('../../assets/images/groupImg/yt.png'), // 一星团长
          2: require('../../assets/images/groupImg/2t.png'), // 二星团长
          3: require('../../assets/images/groupImg/st.png')  // 三星团长
          // 4: require('../../assets/images/groupImg/yd.png'), // 一星代言人
          // 5: require('../../assets/images/groupImg/ypd.png'), // 银牌代言人
          // 6: require('../../assets/images/groupImg/jd.png') // 金牌代言人
        },
        defaultImg: require('../../assets/images/default-avatar.png') // 默认头像
      }
    },
    mounted: function () {
      var timer = setInterval(() => {
        this.bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
        if (!this.bsbUserInfo) {
          this.isLogin = true
          return false
        }
        clearInterval(timer)
        this.getBaseInfo()                      // 首页基础设置，更改电话号码
        this.getMemberPoints()                  // 获取积分信息
        this.getOrderStatusStatic()             // 获取各订单个数
      }, 500)
    },
    computed: {
      ...mapState(['upgradeSte'])
    },
    watch: {
      upgradeSte: function (val) {
        if (this.upgradeSte !== 'closed') {
          this.showToast = true
        }
      }
    },
    created () {
      this.getPersonalInfo()                  // 获取个人信息
      this.getUserRank()
    },
    methods: {
      /**
       * 图片转base64
       */
      getImageBase64ByUrl (url, fun) {
        this.$http.get(this.api.getImageBase64ByUrl, {
          params: {
            fileUrl: url // 'http://oss-zxtx-test-img.oss-cn-shenzhen.aliyuncs.com/test-kaoshanji-20171103-111.jpg'
          }
        }).then((res) => {
          fun(res)
        })
      },
      /**
       * 创建图片
       */
      createImg () {
        setTimeout(() => {
          html2canvas(this.$refs.imageWrapper.$el.childNodes[0], {
            backgroundColor: null,
            logging: false
          }).then((canvas) => {
            this.$vux.loading.hide()
            let dataURL = canvas.toDataURL('image/png')
            this.shareCon.dataURL = dataURL
            console.log(this.shareCon)
            this.wxCode = true
          })
        }, 300)
      },
      /**
       * 生成图片
       */
      toImage (v) {
        this.$vux.loading.show({
          text: '图片生成中...'
        })
//      console.log(v)
        let shopId = this.$route.query.shopId ? this.$route.query.shopId : localStorage.getItem('shopId') ? localStorage.getItem('shopId') : 1
        let codeUrl = window.location.href.match(/.*mshop/gi)[0]
        codeUrl += '/register?&shareInvitationCode='
        codeUrl += v.invitationCode + '&yqId=' + 1 + '&shopId=' + shopId
        this.shareCon = v
        this.shareCon.codeUrl = codeUrl
        if (v.mainImage.indexOf('data:image') === -1) {
          v.mainImage = v.mainImage.match(/http/gi) ? v.mainImage : v.mainImage
        }
        if (v.mainImage && v.mainImage.match(/http/gi) && v.mainImage.indexOf('data:image') === -1) {
          this.getImageBase64ByUrl(v.mainImage, (res) => {
            this.shareCon.mainImage = 'data:image/png;base64,' + res.data.data
            // console.log(this.shareCon.mainImage)
            this.createImg()
          })
        } else {
          this.createImg()
        }
      },
      /**
       * 首页基础设置(type === 2售后服务)
       */
      getBaseInfo () {
        this.$http.post(this.api.getBaseInfoList, {}).then((res) => {
          let resData = res.data.data
          resData.forEach((item) => {
            if (item.type === 2) {
              this.gsPhone = item.customerPhone
            }
          })
        })
      },
      /**
       * 获取用户下一级积分
      */
      getNextDisRulelPoint () {
        this.$http.get(`${this.api.getNextDisRulelPoint}`).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.nextRulePoint = res.data.data
          let progressRatio = (this.totalIntegral.bonusPoints - this.nextRulePoint.currentRulePoint) / (this.nextRulePoint.consumePoint - this.nextRulePoint.currentRulePoint) * 100
          console.log(this.totalIntegral.bonusPoints - this.nextRulePoint.currentRulePoint)
          this.progressRatio = progressRatio >= 98 && progressRatio < 99 ? '98%' : progressRatio >= 99 && progressRatio < 100 ? '98.5%' : progressRatio > 100 ? '100%' : progressRatio + '%'
        })
      },
      /**
       * 关闭弹窗
      */
      closePop () {
        this.$store.dispatch('updateUpgradeSte', 'closed') // 更新vux中数据
        this.showToast = false
      },
      /**
       * 获取个人信息
      */
      getPersonalInfo () {
        this.userIfNeedUpgrade()                // 用户是否满足升级条件
        this.getRegisterStatus()                // 判断用户是否在系统中注册
        this.$http.post(`${this.api.personalInfo}`, {
          id: this.bsbUserInfo ? this.bsbUserInfo.userId : ''
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            this.isLogin = true
            return false
          }
          this.personalData = res.data.data
          this.isLogin = false
          this.$nextTick(() => {
            setTimeout(() => {
              // 可以升级 并且 没有地址 || 系统没有注册 ||  未绑定关系 给出提示
              if (this.upgradeConditionSte === 1 && (this.personalData.user.cardStatus === 1 || parseInt(this.registerStatus) === 0 || !this.personalData.user.userProvinceCode || parseInt(this.personalData.bindStatus) === 0)) {
                if (this.upgradeSte !== 'closed') {
                  this.$store.dispatch('updateUpgradeSte', Math.random()) // 更新vux中数据
                }
              }
              var sped = 0
              if (this.progressRatio.split('%')[0] >= 95) {
                sped = 0 + 'px'  // 进度条文字提示位置
              } else {
                sped = -document.getElementById('spedNum').clientWidth / 2 + 'px'  // 进度条文字提示位置
              }
              document.getElementById('spedNum').style.right = sped
            }, 150)
          })
        })
      },
      /***
       * 获取个人信息
       */
      getUserRank () {
        this.$http.post(`${this.api.getUserRank}`, {
          id: this.bsbUserInfo ? this.bsbUserInfo.userId : ''
        }).then((res) => {
          if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
            this.getUserRankData = res.data.data
            // 脏数据过滤
            if (!this.getUserRankData.userSumConsume) { this.getUserRankData.userSumConsume = 0 }
            if (!this.getUserRankData.nextRankAgentFees) { this.getUserRankData.nextRankAgentFees = 0 }
            // 计算进度条比例
            let p = this.getUserRankData.userSumConsume / this.getUserRankData.nextRankAgentFees
            //  等级到达代言商，未上传头像，提示上传头像
            if (this.getUserRankData.rank >= 4 && !this.getUserRankData.avatar) {
              this.showImg = true
            } else {
              this.showImg = false
            }
            if (p > 1) {
              this.pat = 100
            } else {
              this.pat = parseInt(p * 100)
            }
            this.isLogin = false
          } else if (parseInt(res.data.status) === 9997) {
            this.isLogin = true
          }
        })
      },
      /**
       * 判断用户是否在系统中注册
      */
      getRegisterStatus () {
        this.$http.get(`${this.api.getRegisterStatus}`, {
          params: {
            belongSystem: 5
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.registerStatus = resData.data
        })
      },
      /**
       * 用户是否满足升级条件
      */
      userIfNeedUpgrade () {
        this.$http.get(`${this.api.userIfNeedUpgrade}`).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.upgradeConditionSte = resData.data
        })
      },
      /**
       * 获取积分信息
      */
      getMemberPoints () {
        this.$http.get(`${this.api.getMemberPoints}`, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.totalIntegral = res.data.data
          this.getNextDisRulelPoint()             // 获取用户下一级积分
        })
      },
      /**
       * 获取个订单个数
      */
      getOrderStatusStatic () {
        this.$http.get(`${this.api.getOrderStatusStatic}`).then((res) => {
          if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
            this.orderNums = res.data.data
          }
        })
      },
      // 跳转到修改个人资料
      editPersonalData () {
        this.$router.push({name: 'personalInfor'})
      },
      /**
       * 绑定邀请人
       */
      goBind () {
        console.log('1111')
        this.$router.push({name: 'bindInviter'})
      },
      // 跳转到地址列表
      goAddressList () {
        this.$router.push({
          path: '/receiveAddr',
          query: {redirect: this.$router.currentRoute.fullPath}
        })
      },
      /**
       * 跳转到订单列表
      */
      goOrderList (v) {
        localStorage.setItem('goOrderState', v)
        this.$router.push({path: '/orderList'})
      },
      /**
       * 跳转购票页面
      */
      goTickets () {
        localStorage.setItem('ticketTabSte', 1)
        this.$router.push({path: '/ticketPurchase'})
      },
      /**
       * 马上升级
      */
      upgradeImmediately () {
        // 未认证
        if (parseInt(this.personalData.user.cardStatus) === 1) {
          // 是否设置了地区
          // if (!this.personalData.user.userProvinceCode || parseInt(this.personalData.bindStatus) === 0) {
          //   this.$router.push({path: '/region'})
          // } else {
          //   this.$router.push({path: '/realNameAuth', query: {types: 1, pageOrigin: 'upgrade'}})
          // }
          this.$router.push({path: '/region'})
        } else { // 已认证
          if (parseInt(this.registerStatus) === 0) { // 已认证未注册
            // 是否设置了地区
            if (!this.personalData.user.userProvinceCode || parseInt(this.personalData.bindStatus) === 0) {
              this.$router.push({path: '/region'})
            } else {
              window.location.href = window.location.href.split('mshop')[0] + 'points/register'
            }
          } else {
            if (!this.personalData.user.userProvinceCode || parseInt(this.personalData.bindStatus) === 0) {
              this.$router.push({path: '/region'})
            }
          }
        }
      },
      /**
       * 跳转积分系统
      */
      goPointsSys () {
        let phone = ''
        let token = ''
        if (this.bsbUserInfo) {
          phone = this.bsbUserInfo.phone
          token = this.bsbUserInfo.token
        }
        window.location.href = window.location.href.split('mshop')[0] + 'points/login?phone=' + phone + '&token=' + token
        // window.location.href = 'http://passpay.andes-hub.com/points/login?fromType=web&phone=' + this.bsbUserInfo.phone + '&token=' + this.bsbUserInfo.token
      },
      /**
       * 拉群助手
      */
      pullGroup () {
        this.checkLogin().then((res) => {
          this.$router.push('/pullGroupTool/pullGroupAssistant')
        })
      },
      /**
       * 分页
      */
      loadMore () {
        this.$refs.gussLike.loadMore()
      },
      /**
       * 是否绑定邀请人
       */
      checkCode () {
        if (this.isLogin) {
          this.$router.push({path: '/login', query: {redirect: '/my'}})
          return false
        }
        console.log(this.personalData)
        if (!this.personalData.beInvitationCode) {
          this.showBind = true
          this.wxCode = false
        } else {
          this.showBind = false
          var parm = {
            mainImage: this.aaacreat,
            invitationCode: this.personalData.invitationCode
          }
          this.toImage(parm)
        }
      }
    }
  }
</script>

<style  lang=less>
  .my {
    height: calc(~"100vh - .88rem");
    background: #f1f2f6;
    overflow-y: auto;
    /*用户信息*/
    .user-base{
      width: 100%;
      height: 3.5rem;
      /*background: url('../../assets/images/my/my-ban-bg.png') no-repeat;*/
      /*background-color: #292626;*/
      background-size: 4.6rem 3.03rem;
      background-position: right center;
      padding:0.6rem .4rem .2rem .4rem;
      align-items: center;
      box-sizing: border-box;
      position: relative;
      background: linear-gradient(to bottom,  #f75552 ,  #ffb74e);
      margin-bottom: 1rem;
      .base-information{
        display: flex;
        align-items: center;
        .information-himg{
          width: 1.36rem;
          height: 1rem;
          position: relative;
          .imgBox{
            width: 1rem;
            height: 1rem;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border-radius: 1rem;
            background: #e1e1e1;
            margin: auto;
            /*overflow: hidden;*/
            img{
              width: 100%;
              height: 100%;
              display: block;
              border-radius: 1rem;
            }
          }

          .text{
            width: 100%;
            position: absolute;
            left: 0;
            bottom: -.1rem;
            height: 0.3rem;
            line-height: 0.3rem;
            font-size: 0.24rem;
            color: #ffffff;
            background: linear-gradient(to right,  #eec87e ,  #d4a159);
            text-align: center;
            -webkit-border-radius: 0.08rem;
            -moz-border-radius: 0.08rem;
            border-radius: 0.2rem;
          }
        }
        .information-name{
          width: 5.67rem;
          img{
            width: 2.9rem;
            height: .5rem;
          }
          p:nth-child(1){
            color: #fff;
            font-size: .3rem;
            padding-bottom: .1rem;
          }
          p:nth-child(2){
            width: 5rem;
            color: #cfbd86;
            font-size: .28rem;
            margin-top: .2rem;
            span{
              min-width: 1.42rem;
              text-align: center;
              background: #ffffff;
              color: #564D4D;
              font-size: 0.24rem;
              -webkit-border-radius: 0.2rem;
              -moz-border-radius: 0.2rem;
              border-radius: 0.5rem;
              padding: 0.08rem 0.25rem;
              position: relative;
              &::after{
                content: "";
                width:0;
                height:0;
                border-right: 5px solid transparent;
                border-left: 5px solid transparent;
                border-bottom: 5px solid white;
                position: absolute;
                left: 0.3rem;
                top: -0.1rem;
              }
            }
          }
          .coveLBox{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            color: white;
            font-size: .24rem;
            .cover1{
              width: 3.8rem;
              height: 0.10rem;
              background: white;
              -webkit-border-radius: 0.2rem;
              -moz-border-radius: 0.2rem;
              border-radius: 0.2rem;
              position: relative;
              margin: 0 0.1rem;
              .cover2{
                width: 2.4rem;
                position: absolute;
                left: 0;
                top: 0;
                background: #caa256;
                -webkit-border-radius: 0.2rem;
                -moz-border-radius: 0.2rem;
                border-radius: 0.2rem;
              }
            }
          }
        }
        .information-icn{
          width: .82rem;
          height: .69rem;
          margin-left: .47rem;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
      /* 进度条 */
      .grade-speed{
        margin-top: .2rem;
        flex: 8;
        .speed-bar{
          width: 100%;
          height: .1rem;
          background: #969493;
          border-radius: 20px;
          margin-right: .1rem;
          position: relative;
          .speed-bar-active{
            width: 100%;
            height: .1rem;
            background: #969493;
            border-radius: 20px;
            /*position: absolute;*/
            overflow: hidden;
            /*left: 0;*/
            /*top: 0;*/
            .speed-bar-activeBack{
              background: #7a5e3e;
              border-radius: 20px;
              height: .12rem;
            }
            span{
              background: #969494;
              color: #fff;
              font-size: .2rem;
              border-radius: 40px;
              padding: 1px 5px;
              position: absolute;
              top: -.46rem;
              right: 0;
              &::before{
                position: absolute;
                content: "";
                width: 0;
                height: 0;
                left: 0;
                right: 0;
                bottom: -.06rem;
                margin: auto;
                border-left: .1rem solid transparent;
                border-top: .1rem solid #969494;
                border-right: .1rem solid transparent;
              }
            }
          }
        }
      }
      .speed-num{
        color: #7a5e3e;
        flex: 2;
        font-size: .24rem;
        text-align: right;
        line-height: 0.5rem;
        position: absolute;
        right:.2rem ;
        top: -.05rem;
      }
      .user-set{
        width:.45rem;
        height:.44rem;
        margin-right:.3rem;
        position: absolute;
        right: 0;
        top: .35rem;
      }
    }
    /* 我的钱包 */
    .my-wallet{
      /*background: #292626;*/
      /*width: 7rem;*/
      /*!*padding: 0 .2rem;*!*/
      /*padding-bottom: .4rem;*/
      /*position: absolute;*/
      margin-top: 0.5rem;
      .Box{
        position: relative;

      }
      .gradeBox{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;
        margin-top:.6rem;
        padding: .2rem .2rem;
        border-radius: 8px 8px 0px 0px;
        background: linear-gradient(to right bottom, #f2d49e, #dcb372);
        .text{
          flex: 3;
          font-size: .28rem;
          font-weight: bold;
          color: #7a5e3e;
          line-height: .5rem;
          img{
            width: .3rem;
            height: .3rem;
            position: relative;
            top: 0.04rem;
          }
        }
      }
      .wallet-con{
        /*background: url('../../assets/images/my/wallet-bg.png') no-repeat;*/
        /*background-size: 100% 100%;*/
        border-radius: 8px;
        height: 1.7rem;
        padding: .2rem .2rem .2rem .2rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        background: white;
        flex-direction: row;
        justify-content: center;
        .item{
          display: flex;
          align-items: center;
          background: white;
          flex-direction: row;
          justify-content: center;
          margin: 0  .7rem 0 .3rem;
          font-weight: bold;
        }
        .item2 {
          margin: 0  .3rem 0 .7rem;
        }
        .con-img{
          width: .6rem;
          height: .6rem;
          margin: 0 .2rem .0rem 0rem;
          img{
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .con-price{
          flex: 1;
          p:nth-child(1){
            font-size:.3rem;
            color: #666666;
          }
          p:nth-child(2){
            font-size: .4rem;
            color: #ad9768;
          }
        }
        .con-ste{
          background: linear-gradient(90deg, #dfb055, #cca554);
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
          color: #fff;
          font-size: .24rem;
          color: #fdf0c3;
          padding: .1rem .3rem;
          display: inline-block;
        }
      }
      .wallet-bg{
        width: 100%;
        vertical-align: top;
      }
    }
    /* 我的订单、我的服务 */
    .my-type{
      height: auto;
      overflow: hidden;
      background: #fff;
      margin: .26rem .2rem;
      border-radius: 6px;
      .type-title{
        padding: 0 .3rem;
        height: .7rem;
        border-bottom: 1px solid #ededed;
        display: flex;
        align-items: center;
        p:nth-child(1){
          flex: 1;
          font-size: .28rem;
          color: #333333;
        }
        p:nth-child(2){
          font-size: .24rem;
          color: #999999;
          display: flex;
          align-items: center;
          svg{
            width: .3rem;
            height: .3rem;
            fill: #999999;
            margin-left: .05rem;
          }
        }

      }
      ul{
        padding-top: .2rem;
        padding-bottom: .1rem;
        li{
          float: left;
          width: 25%;
          text-align: center;
          margin-bottom: .15rem;
          .icon{
            width: .48rem;
            height: .48rem;
            margin:0 auto;
            position: relative;
            img{
              width: .48rem;
              height: .48rem;
              display: block;
              margin: 0 auto;
            }
            i{
              display: block;
              text-align: center;
              background: #f23030;
              color: #fff;
              font-size: .22rem;
              height: .26rem;
              line-height: .26rem;
              border-radius: .2rem;
              padding: 0 .09rem;
              background-clip: padding-box;
              position: absolute;
              top: -.15rem;
              right:-.15rem;
            }
          }
          div:nth-child(2){
            color: #666666;
            font-size: .24rem;
            margin-top: .2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    /**订单、余额**/
    .orderBalance{
      margin: .19rem .2rem;
      height: auto;
      overflow: hidden;
      background: #fff;
      border-radius: 6px;
      padding: .05rem .2rem .3rem .2rem;
      -webkit-box-shadow: 0 0 13px 0 rgba(154, 141, 141, 0.3);
      /*order列表*/
      .orderBalance-order{
        display:flex;
        align-items: center;
        .type-ol{
          display: flex;
          height: 1.4rem;
          background: #fff;
          border-bottom: .04rem solid #f7f7f7;
          padding-bottom: .25rem;
          flex: 1;
          li{
            flex: 1;
            text-align: center;
            .icon{
              width: .57rem;
              height: .57rem;
              margin:0 auto;
              padding-top:0.3rem;
              position: relative;
              img{
                width: .57rem;
                height: .57rem;
              }
              i{
                display: block;
                text-align: center;
                background: #fff;
                border: 1px solid #f23030;
                color: #f23030;
                font-size: .22rem;
                height: .26rem;
                line-height: .26rem;
                border-radius: .18rem;
                padding: 0 .09rem;
                background-clip: padding-box;
                position: absolute;
                top: .12rem;
                left: .35rem;
              }
            }
            span{
              display: inline-block;
              margin-top:.18rem;
              font-size: .22rem;
              color: #333333;
            }
          }
        }
        .delimiter{
          img{
            width: .13rem;
            height: .97rem;
          }
        }
      }
      /**积分、金额**/
      .orderBalance-integral{
        display: flex;
        padding: .2rem 0;
        align-items: center;
        ul{
          flex: 1;
          display: flex;
          align-items: center;
          li{
            flex: 1;
            text-align: center;
            div:nth-child(1){
              color: #2c2c2c;
              font-size: .34rem;
            }
            div:nth-child(2){
              color: #333333;
              font-size: .22rem;
              margin-top: .2rem;
            }
          }
        }
        .delimiter{
          img{
            width: .13rem;
            height: .97rem;
          }
        }
      }
      .orderBalance-r{
        width: 1.36rem;
        text-align: center;
        img{
          display: block;
          width: .6rem;
          margin: 0 auto;
        }
        i{
          display: block;
          color: #333333;
          font-size: .22rem;
          margin-top: .1rem;
        }
      }
    }
    /**选项**/
    .my-option{
      margin: .19rem .2rem;
      height: auto;
      overflow: hidden;
      background: #fff;
      border-radius: 6px;
      padding-top: .32rem;
      padding-bottom: .17rem;
      -webkit-box-shadow: 0 0 13px 0 rgba(154, 141, 141, 0.3);
      ul{
        li{
          float: left;
          width: 25%;
          text-align: center;
          margin-bottom: .15rem;
          img{
            width: .67rem;
            height: .67rem;
            display: block;
            margin: 0 auto;
          }
          div{
            color: #333333;
            font-size: .22rem;
            margin-top: .24rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    /**我的广告banner**/
    .my-adv{
      img{
        width: 7.1rem;
        height: 2.09rem;
        border-radius: 7px;
        display: block;
        margin: 0 auto;
      }
    }
    /**弹窗**/
    .weui-mask{
      z-index: 3000;
    }
    .weui-dialog{
      width: 70%;
      max-width: 6rem;
      background-color: none;
      border-radius: 10px;
      overflow: visible;
      .welcome-wrap{
        width: 100%;
        height: 3.7rem;
        left: 0;
        top: -1.6rem;
        z-index: 667;

        .welcome-bg{
          width: 3.5rem;
          height: 3.7rem;
          left: 0;
          right: 0;
          margin: 0 auto;
          top: -0.5rem;
          background: url(../../assets/images/my/welcome.png) no-repeat -1rem 0;
          background-size: cover;
        }

        .welcome-close{
          right: 0;
          top: 0.3rem;
          z-index: 669;
           .vux-x-icon{
            fill: #fff;
            width: .6rem;
            height: .6rem;
            margin-right: .2rem;
            margin-top: .2rem;
          }
        }

        .welcome-close2{
          top: 5rem;
          z-index: 669;
          display: flex;
          flex-direction: row;
          justify-content: center;
          .vux-x-icon{
            fill: #fff;
            width: .6rem;
            height: .6rem;
            margin-right: .2rem;
            margin-top: .2rem;
          }
        }
      }

      .alert-wrap{
        background: #fff;
        z-index: 666;
        border-radius: 10px;
        .alert-cen{
          height: 4rem;
          h3{
            color: #f4ae52;
            font-size: 0.34rem;
            padding-top: 1.5rem;
            line-height: 0.6rem;
          }
          h4{
            color: #666666;
            font-size: 0.3rem;
            line-height: 0.6rem;
          }

          .upgrade-button{
            color: #fff;
            height: 0.95rem;
            line-height: 0.95rem;
            font-size: 0.34rem;
            width: 100%;
            bottom: -0.01rem;
            background: #fe9a01;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
          }
        }

        .alert-cen2{
          height: 3.3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #c09972;
          background: linear-gradient(90deg, #fef9f6, #f2e7da);
          border-radius: 4px;
          font-size: .3rem;
          letter-spacing:3px;
          line-height: .5rem;
          .border{
            width: 5rem;
            height: 3rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px solid #f1d8c4;
          }

          .bot{
            width: 2.6rem;
            height: .6rem;
            line-height: .6rem;
            background: black;
            color: white;
            border-radius: .6rem;
            margin-top: .2rem;
            font-size: .30rem;
          }
        }
      }
    }
  }
</style>
