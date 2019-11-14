<template>
  <div class="my">
    <!--用户信息-->
    <div class="user-box" @click="personalData.user ? editPersonalData() : $router.push({path:'/login',query: {redirect: '/my'}})">
      <ul class="user-ul">
        <li class="img-li">
          <img src="../../assets/images/default-avatar.png" >
        </li>
        <li class="infor-li" v-if="!isLogin">
          <!-- <span>{{ personalData.name}}</span> -->
          <div class="personmsg-t" v-if="personalData.user">
            <div class="infor-li-point" @click.stop="upgradeImmediately">
              <div v-if="totalIntegral.disRuleName">
                <span>{{totalIntegral.disRuleName}}</span>
              </div>
            </div>
            <span>{{ personalData.user.phone | filterPhone}}</span>
          </div>
          <!--进度条-->
          <div class="personmsg-m" v-if="personalData.user">
            <div class="pogress-bar">
              <div class="pogress-bar-active" :style="{ width: progressRatio}" v-if="progressRatio"></div>
            </div>
            <span v-if="nextRulePoint.ruleName">{{.ruleName}}</span>
          </div>
          <div class="personmsg-b" v-if="totalIntegral.bonusPoints || nextRulePoint.consumePoint">{{totalIntegral.bonusPoints}}/{{nextRulePoint.consumePoint}}积分</div>
        </li>
        <li v-else class="isLogin">未登录</li>
      </ul>
      <img src="../../assets/images/my/seting.png" class="user-set" @click.stop="$router.push('/set')" v-if="personalData.user">
    </div>
    <!--订单、余额-->
    <div class="orderBalance">
      <!--订单-->
      <div class="orderBalance-order">
        <ol class="type-ol">
          <li @click="goOrderList(1)">
            <div class="icon">
              <img src="../../assets/images/my/wait-pay.png" >
              <i v-if="orderNums.waitPay > 0">{{orderNums.waitPay}}</i>
            </div>
            <span>待付款</span>
          </li>
          <li @click="goOrderList(2)">
            <div class="icon">
              <img src="../../assets/images/my/wait-delivery.png" >
              <i v-if="orderNums.waitSendGoods > 0">{{ orderNums.waitSendGoods }}</i>
            </div>
            <span>待发货</span>
          </li>
          <li @click="goOrderList(3)">
            <div class="icon">
              <img src="../../assets/images/my/wait-back.png" >
              <i v-if="orderNums.waitReceiveGoods > 0">{{ orderNums.waitReceiveGoods }}</i>
            </div>
            <span>待收货</span>
          </li>
          <li @click="goOrderList(4)">
            <div class="icon">
              <img src="../../assets/images/my/wait-comments.png" >
              <i v-if="orderNums.waitComment > 0">{{ orderNums.waitComment }}</i>
            </div>
            <span>待评价</span>
          </li>
          <!-- <li @click="$router.push('/refundAndsalesafter')">
            <div class="icon">
              <img src="../../assets/images/my/after-sales.png" >
            </div>
            <span>退款/售后</span>
          </li> -->
        </ol>
        <div class="delimiter">
          <img src="../../assets/images/my/delimiter.png" >
        </div>
        <div class="orderBalance-r" @click="goOrderList('')">
          <img src="../../assets/images/my/my-order-icon.png" >
          <i>我的订单</i>
        </div>
      </div>
      <!--金额，积分-->
      <div class="orderBalance-integral">
        <ul>
          <li @click="$router.push('/myBalance')">
            <div>{{totalIntegral.balance || 0}}</div>
            <div>我的余额</div>
          </li>
          <li @click="$router.push('/myPoints')">
            <div>{{totalIntegral.bonusPoints || 0}}</div>
            <div>消费积分</div>
          </li>
        </ul>
        <div class="delimiter">
          <img src="../../assets/images/my/delimiter.png" >
        </div>
        <div class="orderBalance-r" @click="$router.push('/myWallet')">
          <img src="../../assets/images/my/my-wallet-icon.png" >
          <i>我的钱包</i>
        </div>
      </div>
    </div>
    <!--选项-->
    <div class="my-option">
      <ul>
        <li @click="goPointsSys">
          <img src="../../assets/images/my/Inte-mana.png" class="user-set">
          <div>积分管理</div>
        </li>
        <li @click="$router.push('/myCollect')">
          <img src="../../assets/images/my/collect.png" class="user-set">
          <div>商品收藏</div>
        </li>
        <li @click="goAddressList">
          <img src="../../assets/images/my/address.png" class="user-set">
          <div>收货地址</div>
        </li>
        <li>
          <a :href="'tel:' + personalData.customerPhone">
            <img src="../../assets/images/my/service-hotline.png" class="user-set">
            <div>客服热线</div>
          </a>
        </li>
      </ul>
    </div>
    <!--广告图-->
    <!-- <div class="my-adv">
      <img src="../../assets/images/my/my-ad.png" class="user-set">
    </div> -->
    <!--推荐商品列表-->
    <commonGoodsList goodsTypes="my" :isShowMore="false" :isShowBanner="false"></commonGoodsList>
    <!-- 弹窗 -->
    <div>
      <x-dialog v-model="showToast" class="dialog-demo ta-c">
        <div class="alert-wrap pos-r">
          <div class="alert-cen">
            <h3 class="ta-c">您的积分已到达升级标准</h3>
            <h4 class="ta-c">快去升级获取更多收益</h4>
            <div class="upgrade-button ta-c pos-a" @click="upgradeImmediately">马上升级</div>
          </div>
        </div>
        <div class="welcome-wrap pos-a ta-c">
          <div class="welcome-bg pos-a"></div>
          <div class="welcome-close pos-r ta-r" @click="closePop">
            <x-icon type="ios-close-outline" size="30"></x-icon>
          </div>
        </div>
        <!-- <div @click="showToast=false">
          <span class="vux-close"></span>
        </div> -->
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import commonGoodsList from '../../components/commonGoodsList' // 公共列表组件
  import { Confirm, XDialog, TransferDomDirective as TransferDom } from 'vux'
  // import { setTimeout } from 'timers'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Confirm,
      commonGoodsList,
      XDialog
    },
    data () {
      return {
        isLogin: true,                        // 是否登录了
        bsbUserInfo: {},                       // 存储的个人信息
        showToast: false,
        adb: {},
        personalData: {},                      // 个人资料信息
        totalIntegral: {},                     // 积分
        nextRulePoint: '',                     // 下一等级信息
        progressRatio: 0,                      // 进度百分比
        goodsNumList: [],                      // 商品数量
        customerServiceShow: false,            // 客服的显示隐藏
        orderNums: '',                         // 各个订单个数
        registerStatus: null,                  // 是否积分系统注册状态
        upgradeConditionSte: null              // 用户是否满足升级条件状态
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
        this.getPersonalInfo()                  // 获取个人信息
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
    methods: {
      /**
       * 获取用户下一级积分
      */
      getNextDisRulelPoint () {
        this.$http.get(`${this.api.getNextDisRulelPoint}`).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.nextRulePoint = res.data.data
          let progressRatio = this.totalIntegral.bonusPoints / this.nextRulePoint.consumePoint * 100
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
              if (this.upgradeConditionSte === 1 && (this.personalData.user.cardStatus === 1 || parseInt(this.registerStatus) === 0 || !this.personalData.user.userProvinceCode || parseInt(this.personalData.bindStatus) === 0)) {
                if (this.upgradeSte !== 'closed') {
                  this.$store.dispatch('updateUpgradeSte', Math.random()) // 更新vux中数据
                }
              }
            }, 150)
          })
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
    .user-box{
      width: 100%;
      background: url(../../assets/images/my-bg.png) no-repeat;
      background-size: 100% 100%;
      padding:0.6rem 0;
      align-items: center;
      box-sizing: border-box;
      position: relative;
      .user-set{
        width:.45rem;
        height:.44rem;
        margin-right:.3rem;
        position: absolute;
        right: 0;
        top: .35rem;
      }
      .user-ul{
        height: 1.2rem;
        display: flex;
        margin-left:0.4rem;
        position: relative;
        /* align-items: center; */
        .img-li{
          width:1.2rem;
          img{
            width: 100%;
          }
        }
        .infor-li{
          flex: 1;
          color:#fff;
          padding-left: 0.2rem;
          p:nth-child(2){
            font-size:.26rem;
          }
          .personmsg-t{
            display: flex;
            align-items: center;
            font-size: .28rem;
          }
          .infor-li-point{
            height: .34rem;
            /* border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: .18rem;
            background: rgba(255, 255, 255, 0.1); */
            display: flex;
            align-items: center;
            white-space: nowrap;
            margin-right: .2rem;
            div:nth-child(1){
              max-width: 2rem;
              height: .34rem;
              line-height: .34rem;
              background: #ec4a3d;
              border-radius: .18rem;
              display: inline-block;
              font-size: .24rem;
              color: #fff;
              /* width: 1.7rem; */
              padding:0 .2rem;
              text-align: center;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              border: 1px solid #c02c1e;
              position: relative;
              span{
                margin-right: .2rem;
                font-size: .2rem;
              }
              &::after{
                content: '';
                width: 0;
                height: 0;
                border: .08rem solid transparent;
                border-left-width: .13rem;
                border-left-style: solid;
                border-left-color: #fff;
                display: block;
                position: absolute;
                top: 0;
                bottom: 0;
                right: .05rem;
                margin: auto;
              }
            }
            div:nth-child(2) {
              color: #fff;
              font-size: .24rem;
              margin-left: .16rem;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .personmsg-m{
            display: flex;
            align-items: center;
            font-size: .2rem;
            margin-top: .15rem;
            .pogress-bar{
              width: 2.6rem;
              height: .2rem;
              background: #fe622e;
              border-radius: 20px;
              margin-right: .1rem;
              position: relative;
              box-shadow: 0 0 0 .02rem #ea3817, 0 0 0 .04rem #f64315;
              .pogress-bar-active{
                max-width: 2.6rem;
                height: .2rem;
                background: #f9a865;
                border-radius: 20px;
                position: absolute;
                left: 0;
                top: 0;
              }
            }
          }
          .personmsg-b{
            color: #ffffff;
            font-size: .2rem;
          }
        }
        .isLogin{
          color: #fff;
          display: flex;
          align-items: center;
          margin-left: .2rem;
        }
        .icon{
          .vux-x-icon {
            fill: #fff;
            margin-top:0.3rem;
            margin-right: 0.15rem;
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
      }
    }
  }
</style>
