<template>
  <div class="goldCoin-warp">
    <!-- banner -->
    <div class="coin-ban">
      <img src="../../assets/images/wallet/core-bean.png">
    </div>
    <!-- 签到 -->
    <div class="sign-area" v-if="newRuleList.length > 0 && newRuleList[getRuleList.accountNum % 7].delStatus === 0">
      <h2>明日签到可领<span v-if="newRuleList.length > 0">{{newRuleList[getRuleList.accountNum % 7].handselNum}}芯豆</span></h2>
      <ul>
        <li v-for="(item, index) in signDataLen" :class="index <= (getRuleList.accountNum % 7) - 1 ? 'active' : ''"><span>{{getRuleList.ruleList[index].handselNum}}</span></li>
      </ul>
    </div>
    <!-- 使用芯豆的列表 -->
    <div class="exchanged-list" v-if="bugControl">
      <div class="list-title">
        <div>做任务，集芯豆，得福利</div>
      </div>
      <swiper :aspect-ratio="300/800" :show-dots="false" :auto="true" :loop="true">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in getWealList" :key="index">
            <ul>
              <li v-for="(items, index) in item" :class="index % 2 === 0 ? 'yellow' : 'gray'">
                <div class="list-img">
                <img :src="items.goodsImage"/>
                </div>
                <div class="list-phone">
                <p>{{items.userName | filterPhone}}</p>
                <p>使用芯豆购买</p>
                </div>
                <div class="list-pre" :class="index % 2 === 0 ? 'red' : 'violet'">
                <span>最高省{{items.thriftPrice}}</span>
                <img src="../../assets/images/wallet/bean.png">
                </div>
              </li>
          </ul>
        </swiper-item>
      </swiper>

    </div>
    <!-- 任务清单 -->
    <div class="task-list" v-if="showDelStatus5 === 0 || showDelStatus23 === 0 || showDelStatus30 === 0 || showDelStatus32 === 0">
      <div class="list-title">
        <div>任务清单</div>
        <span  @click="$router.push('/welfarewZone')">前往专区</span>
      </div>
      <ul>
        <li v-if="showDelStatus5 === 0">
          <div class="list-img">
            <img src="../../assets/images/wallet/task-register.png">
          </div>
          <div class="list-con">
            <p>注册送金币+{{showType5}}</p>
            <p>用户注册成功</p>
          </div>
          <div :class="noTake? 'list-btn red':'list-btn gray'">
            <span v-if="noTake" @click="getRegister">立即领取</span>
            <span v-if="Take">&nbsp;已领取&nbsp;&nbsp;</span>
            <img src="../../assets/images/wallet/bean.png">
          </div>
        </li>
        <li v-if="showDelStatus23 === 0">
          <div class="list-img">
            <img src="../../assets/images/wallet/task-share.png">
          </div>
          <div class="list-con">
            <p>分享商品送金币 +{{showType23}}</p>
            <p>分享给好友：微信、QQ、微博</p>
          </div>
          <div class="list-btn violet" @click="$router.push('/sharePurchase')">
            <span>分享商品</span>
            <img src="../../assets/images/wallet/bean.png">
          </div>
        </li>
        <li v-if="showDelStatus30 === 0">
          <div class="list-img">
            <img src="../../assets/images/wallet/task-browse.png">
          </div>
          <div class="list-con">
            <p>浏览商品 +{{showType30}}</p>
            <p>超过15S</p>
          </div>
          <div class="list-btn red" @click="$router.push('/classification')">
            <span>查看商品</span>
            <img src="../../assets/images/wallet/bean.png">
          </div>
        </li>
        <li v-if="showDelStatus32 === 0">
          <div class="list-img">
            <img src="../../assets/images/wallet/task-evaluate.png">
          </div>
          <div class="list-con">
            <p>商品评价 +{{showType32}}</p>
            <p>购买完成商品后进行商品评价反馈</p>
          </div>
          <div class="list-btn violet" @click="$router.push('/classification')">
            <span>&nbsp;去购物&nbsp;&nbsp;</span>
            <img src="../../assets/images/wallet/bean.png">
          </div>
        </li>
      </ul>
    </div>
    <div style="width: 100%;height: 100vh;background: rgba(0,0,0,0.7);position: fixed;top: 0;left: 0;z-index: 999" v-if="maskBat" @click="closeMask">
      <div style="width: 100%;height: 5rem;position: relative;margin-top: 60%;">
        <img :src="beanBg" style="width: 3rem;height: 3.4rem;position: absolute;left: 50%;margin-left: -1.5rem;"/>
        <p style="color: #fed84e;position: absolute;left: 44%;top: 21%;font-weight: 600;">+<span style="font-size: 0.25rem;font-weight: 800;">{{getDayBean}}</span></p>
      </div>
    </div>
    <div style="width: 100%;height: 100vh;background: rgba(0,0,0,0.7);position: fixed;top: 0;left: 0;z-index: 999" v-if="getRegisterMask" @click="closegetRegisterMask">
      <div style="width: 100%;height: 5rem;position: relative;margin-top: 60%;">
        <img :src="beanBg" style="width: 3rem;height: 3.4rem;position: absolute;left: 50%;margin-left: -1.5rem;"/>
        <p style="color: #fed84e;position: absolute;left: 44%;top: 21%;font-weight: 600;">+<span style="font-size: 0.25rem;font-weight: 800;">{{giveBean}}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperItem, GroupTitle, XButton, Divider } from 'vux'
  export default {
    components: {
      Swiper,
      SwiperItem,
      GroupTitle,
      XButton,
      Divider
    },
    data () {
      return {
        signDataLen: 0,
        noTake: true,  // 默认没有领取
        Take: false,   // 已领取
        getWealList: [],
        getRuleList: [],
        giveBean: null,
        newRuleList: [],
        ifLoginNum: null,
        getDayBean: null,
        maskBat: false,
        getRegisterMask: false,  // 注册领取芯豆弹窗
        bugControl: true,
        newLastList: [],
        beanBg: require('../../assets/images/wallet/beanBg.png'),
        showType5: null,        // 注册芯豆赠送量
        showType23: null,       // 分享商品赠送量
        showType30: null,      // 浏览商品赠送量
        showType32: null,       // 商品评价赠送量
        showDelStatus5: null,
        showDelStatus23: null,
        showDelStatus30: null,
        showDelStatus32: null
      }
    },
    mounted: function () {
      this.checkLogin()
      this.getXinRules()
      this.getXinGoodsList()
    },
    watch: {
      getRuleList () {
        if (this.getRuleList.nowNum === 0) {
          this.$http.get(`${this.api.getGoldBeanNum}?ruleType=29`, {
          }).then((res) => {
            if (res.data.data !== null) {
              this.getDayBean = res.data.data
              this.maskBat = true
            } else {
              this.$vux.toast.text('您获得芯豆已达上限')
              this.maskBat = false
            }
            if (res.data.status !== this.api.ERR_OK || !res) return false
            this.getXinRules()
          })
        }
      }
    },
    methods: {
      getXinRules () {
        this.$http.get(`${this.api.getXinRules}`, {
        }).then((res) => {
          // console.log(res)
          this.getRuleList = res.data.data
          this.newRuleList = this.getRuleList.ruleList.slice(0, 7)
          this.newLastList = this.getRuleList.ruleList.slice(7, 11)
          // console.log(this.newLastList)
          this.showType5 = this.newLastList[0].handselNum
          this.showType23 = this.newLastList[1].handselNum
          this.showType30 = this.newLastList[2].handselNum
          this.showType32 = this.newLastList[3].handselNum
          this.showDelStatus5 = this.newLastList[0].delStatus
          this.showDelStatus23 = this.newLastList[1].delStatus
          this.showDelStatus30 = this.newLastList[2].delStatus
          this.showDelStatus32 = this.newLastList[3].delStatus
          this.signDataLen = 7
          if (this.getRuleList.registerNum === 0 || this.getRuleList.registerNum === null) {
            this.noTake = true
            this.Take = false
          } else {
            this.Take = true
            this.noTake = false
          }
        })
      },
      /**
       * 检测是否登录
       */
      checkLogin () {
        this.$http.get(`${this.api.ifLogin}`, {
        }).then((res) => {
          this.ifLoginNum = res.data.data
          if (res.data.data === 0) {
            this.noTake = true
            this.Take = false
          }
        })
      },
      /**
       做任务，集芯豆，得福利
       **/
      getXinGoodsList () {
        this.$http.get(this.api.getXinGoodsList, {
        }).then((res) => {
          if (res.data.data === '' || res.data.data.length === 0) {
            this.bugControl = false
          }
          let getList = res.data
          let result = []
          for (var i = 0, len = getList.data.length; i < len; i += 2) {
            result.push(getList.data.slice(i, i + 2))
          }
          this.getWealList = result
        })
      },
      /**
       任务清单注册领取金币
       **/
      getRegister () {
        if (this.ifLoginNum === 0) {
          localStorage.setItem('REDIRECT_URL', this.$route.fullPath)           // 保存页面重定向url
          this.$router.push('/login')
        } else {
          this.$http.get(`${this.api.getGoldBeanNum}?ruleType=5`, {
          }).then((res) => {
            this.giveBean = res.data.data
            this.noTake = false
            this.Take = true
            this.maskBat = false
            this.getRegisterMask = true
          })
        }
      },
      closeMask () {
        this.maskBat = false
        this.getRegisterMask = false
      },
      closegetRegisterMask () {
        this.maskBat = false
        this.getRegisterMask = false
      }
    }
  }
</script>
<style lang="less">
  .goldCoin-warp{
    height: calc(100vh);
    overflow: hidden;
    overflow-y: scroll;
    background: #f8304a;
    /* banner */
    .coin-ban{
      width: 100%;
      height: 3.75rem;
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    /* 签到区 */
    .sign-area{
      background: rgba(177,43,54,0.77);
      margin: 0 .2rem;
      padding: 0 .29rem;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      position: relative;
      z-index: 200;
      margin-top: -.17rem;
      h2{
        text-align: center;
        font-size: .3rem;
        color: #ffe04e;
        padding-top: .2rem;
      }
      ul{
        white-space: nowrap;
        overflow-x: scroll;
        padding-top: .22rem;
        padding-bottom: .5rem;
        &::-webkit-scrollbar {
          width:0;
          height: 0;
        }
        li{
          width: .66rem;
          height: .66rem;
          border-radius: 50%;
          text-align: center;
          line-height: .66rem;
          font-size: .3rem;
          color: #f23256;
          background: #fff;
          display: inline-block;
          margin-right: .28rem;
          &:last-child{
            margin-right: 0;
          }
          &.active{
            background: #ffda4a;
          }
        }
      }
    }
    /* 已兑换列表 */
    .exchanged-list{
      height: auto;
      overflow: hidden;
      margin: 0 .2rem;
      margin-top: -.2rem;
      position: relative;
      z-index: 300;
      margin-bottom: .54rem;
      .list-title{
        height: .65rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background: linear-gradient(90deg, #cd41f8, #e46492, #f8813c);
        color: #fff;
        font-size: .26rem;
        padding: 0 .3rem;
        img{
          width: .2rem;
          height: .2rem;
          display: inline-block;
          vertical-align: middle;
        }
      }
      ul{
        height: auto;
        overflow: hidden;
        background: #fff;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        li{
          display: flex;
          align-items: center;
          height: 1.36rem;
          padding: 0 .2rem;
          margin-bottom: .06rem;
          &.yellow{
            background: #fcf8d2;
          }
          &.gray{
            background: #f9f9f9;
          }
          .list-img{
            width: .9rem;
            height: .9rem;
            margin-right: .2rem;
            img{
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .list-phone{
            flex: 1;
            color: #8a353c;
            p:nth-child(1){
              font-size: .3rem;
            }
            p:nth-child(2){
              font-size: .26rem;
            }
          }
          .list-pre{
            display: flex;
            align-items: center;
            height: .7rem;
            border-radius: 30px;
            color: #fff;
            font-size: .26rem;
            padding: 0 .2rem;
            img{
              width: .31rem;
              height: .31rem;
              display: block;
              margin-left: .1rem;
            }
            &.red{
              background: linear-gradient(90deg, #f7a83a, #f85921);
            }
            &.violet{
              background: linear-gradient(90deg, #dd43fc, #7337fe);
            }
          }
        }
      }
      .vux-swiper{
        max-height: 133px!important;
      }
    }
    /* 任务清单 */
    .task-list{
      height: auto;
      margin: 0 .2rem;
      margin-bottom: .36rem;
      .list-title{
        height: .8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background: linear-gradient(90deg, #cd41f8, #e46492, #f8813c);
        color: #fff;
        font-size: .26rem;
        padding: 0 .3rem;
        img{
          width: .2rem;
          height: .2rem;
          display: inline-block;
          vertical-align: middle;
        }
      }
      ul{
        background: #fff;
        padding: 0 .29rem;
        border-radius: 10px;
        margin-top: -.1rem;
        li{
          height: 1.4rem;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #d9d9d9;
          &:last-child{
            border-bottom: none;
          }
          .list-img{
            width: .82rem;
            height: .82rem;
            border-radius: 50%;
            margin-right: .19rem;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
              display: block;
            }
          }
          .list-con{
            flex: 1;
            overflow: hidden;
            p:nth-child(1){
              font-size: .3rem;
              color: #5d5d5d;
            }
            p:nth-child(2){
              font-size: .22rem;
              color: #a5a5a5;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .list-btn{
            display: flex;
            align-items: center;
            height: .7rem;
            border-radius: 30px;
            color: #fff;
            font-size: .26rem;
            padding: 0 .2rem;
            img{
              width: .31rem;
              height: .31rem;
              display: block;
              margin-left: .1rem;
            }
            &.red{
              background: linear-gradient(90deg, #f7a83a, #f85921);
            }
            &.violet{
              background: linear-gradient(90deg, #dd43fc, #7337fe);
            }
            &.gray{
              background: linear-gradient(90deg, #dddddd, #c9c9c9);
            }
          }
        }
      }
    }
  }
</style>
