<template>
    <div class="fixed">
      <div class="footer-progress" v-show="(activeType == 1 || activeType == 4 || activeType == 5)">
        <div class="progressBox" :class="{'progressBox2':typeLucky ===9}">
          <div>
            <div class="wholesale" v-if="typeLucky ===10">
              <span class="botSled">批发中</span>
            </div>
            <div class="spree" v-if="typeLucky ===9">今日进度 </div>
          </div>
          <div>
            <div class="progress">
              <div class="progressLin" :style="'width:'+chartData.pa+'%'">
              </div>
            </div>
            <!--<div style="font-size: .28rem;">-->
              <!--{{chartData.luckyPurchaseNumNow - chartData.luckyTodaySnatchCount }}-->
            <!--</div>-->
            <div v-show="list.length > 0" style="font-size: 0.2rem;margin-left: .2rem">
              <Swiper auto height="30px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false">
                <swiper-item v-for="(item, index) in list" :key="index">
                  <p style="line-height: 30px">恭喜 {{item.phone | phoneSubstringTop}} {{ typeLucky === 9 ? '抢购成功': '批发成功'}}</p>
                </swiper-item>
              </Swiper>
            </div>
          </div>
          <div v-html="timeOutFn(timesOver)" style="margin-top: 0.25rem;"></div>
        </div>
      </div>
      <div class="footer-progress" v-show="activeType == 2">
        <p style="line-height: .8rem">活动未开始,请耐心等候 <span v-html="timeOutFn(times)"> </span></p>
      </div>
      <div class="footer-progress" v-show="activeType == 3">
        <p style="line-height: .8rem"> 本期活动暂停抢购,更多精彩敬请期待</p>
      </div>
      <div class="footer-progress" v-show="activeType == 6">
        <p style="line-height: .8rem;">
          <span class="botSled">待售</span> <span>商品未开始抢购，敬请期待！</span>
        </p>
      </div>
      <!-- 拼单情页显示 -->
      <ul class="footer-box footerBySpliceIn" v-show="activeType">
        <li class="right" v-if="typeLucky !=10">
          <div class="left">
            <div class="iconFor">
              <span class="iocnText">
              <img src="../../assets/images/shopLucky/quan2.png" />
              </span>
              <span style="margin-right: .1rem">赠 {{chartData.luckyAddPrice }} 批发券 </span></div>
          </div>
        </li>
        <li class="right" v-if="typeLucky ==10">
          <div class="left">
            <div class="iconFor">
             <span class="iocnText">
              <img src="../../assets/images/shopLucky/quan2.png" />
              </span>
              <span style="margin-right: .1rem">{{chartData.myPurchaseCoupon }} 批发券 </span></div>
          </div>
        </li>
        <li >
          <div class="left" v-if="typeLucky !=10">
            <p class="text">
              拥有此券可兑换<br/>
              商品的销售权益
            </p>
          </div>
          <div class="left" v-if="typeLucky ==10 && gostatus">
            <p class="text">
              批发券不足,<span @click="goPage()" style="color: #10aeff">去获取</span>
            </p>
          </div>
        </li>
        <!--活动开始-->
        <li class="conter conterErorr" v-show="activeType == 2 && !gostatus">
          <p class="name"  >{{textFiter(activeType)}}</p>
        </li>
        <li class="conter " v-show="activeType == 1 && !gostatus">
          <p class="name" @click="shooping()" >{{textFiter(activeType)}}</p>
        </li>
        <li class="conter conterErorr" v-show="activeType == 3 || gostatus">
          <p class="name" >{{textFiter(activeType)}}</p>
        </li>
        <li class="conter conterErorr" v-show="activeType == 4 && !gostatus">
          <p class="name" >{{textFiter(activeType)}}</p>
        </li>
        <li class="conter conterErorr" v-show="activeType == 5 && !gostatus">
          <p class="name" >{{textFiter(activeType)}}</p>
        </li>
        <li class="conter conterErorr" v-show="activeType == 6 && !gostatus">
          <p class="name" >{{textFiter(activeType)}}</p>
        </li>
      </ul>
    </div>
</template>

<script>
  import { Swiper, SwiperItem } from 'vux'
  export default {
    components: {
      Swiper,
      SwiperItem
    },
    props: ['footerDate'],
    data () {
      return {
        chartData: this.footerDate || {},
        list: [],
        timer: '',
        times: '',
        timesOver: '',                  // 结束倒计时间
        activeType: '',                 //
        typeLucky: '',                  // 页面类型
        gostatus: '',
        shopText: ['立即抢购', '立即抢购', '立即抢购', '抢购次数用完', '今天人数已满', '立即抢购'],
        shopText1: ['立即批发', '立即批发', '立即批发', '批发次数用完', '今天人数已满', '总名额已满', '立即抢购']
      }
    },

    mounted () {

    },

    methods: {
      /**
       * 倒计时
       */
      textFiter (index) {
        if (this.typeLucky === 10) {
          return this.shopText1[index - 1]
        } else {
          return this.shopText[index - 1]
        }
      },
      goPage () {
        this.$router.push({name: 'shopLuckyStrike'})
      },
      /**
       * 倒计时
       */
      timeOutFn (time) {
        if (time < 0 || time === undefined) {
          return ''
        }
        if (time === 0) {
          return '00小时 00分 00秒'
        }
        var D = parseInt(time / 86400000)                                // 天
        var H = parseInt((time % 86400000) / 3600000)                   // 小时
        var T = parseInt(((time % 86400000) % 3600000) / 60000)           // 小时
        var S = parseInt((((time % 86400000) % 3600000) % 60000) / 1000)  // 秒
        if (D < 10 && D > 0) {
          D = '0' + D
        }
        if (H < 10) {
          H = '0' + H
        }
        if (T < 10) {
          T = '0' + T
        }
        if (S < 10) {
          S = '0' + S
        }
        var str = '<span class="djs">' + H + '</span>' + '时' + '<span class="djs">' + T + '</span>' + ' 分' + '<span class="djs">' + S + '</span>' + ' 秒'
        if (D > 0) {
          str = '<span class="djs">' + D + '</span>' + ' 天' + str
        }
        return str
      },

      shooping () {
        this.$emit('shoop', 9)
      },

      dataFn (res) {
        if (!res) return false
        var time = res.startDate - res.luckySysTime
        var end = res.endDate - res.luckySysTime
        this.typeLucky = res.typeLucky || ''
        this.gostatus = ''
        if (res.typeLucky === 10 && res.myPurchaseCoupon <= 0 && res.isLogin === 1) {
          this.gostatus = 10
        }
        if (res.typeLucky === 10 && res.myPurchaseCoupon < res.luckyAddPrice && res.isLogin === 1) {
          this.gostatus = 10
        }
        //      今日购买比例
        res.pa = '0'
        if (res.progressColorWidth > 0) {
          res.pa = res.progressColorWidth
        }
        this.chartData = res || {}
        this.timesOver = end
        //        activeType  1:未开始 2:开始 3;结束
        console.log(res)
        if (res.grabStatus === 2) {
          this.activeType = 6
          console.log('代售')
        } else if (end <= 0) {
          this.activeType = 3
        } else if (time > 0) {
          this.activeType = 2
          this.times = time
        } else if (time < 0) {
          if ((res.luckyHasSnatchCount - res.luckyPurchaseNumTotal >= 0) && res.typeLucky === 10) { // 总人数满
//            this.activeType = 3
//            this.$emit('active', this.activeType)
//            return false
          }
          if (res.progressColorWidth >= 100) {
            this.activeType = 5
            this.$emit('active', this.activeType)
            return false
          } else if (res.luckyUserTodaySnatchCount - res.luckyPurchaseNumLimit >= 0) {
            this.activeType = 4
            this.$emit('active', this.activeType)
            return false
          } else if (end >= 0) {
            this.activeType = 1
          }
        }

        // 提交状态
        this.$emit('active', this.activeType)
        console.log(this.activeType, 'this.activeType')
        //  活动未开始 跑计时器
        if (this.timer) {
          clearInterval(this.timer)
        }
        this.timer = setInterval(() => {
          if (this.activeType === 2) {
            // 如果倒计时时间戳小于等于0
            if (this.times <= 0) {
              if (end < 0) {
                this.activeType = 3
              } else {
                this.activeType = 1
                if (res.luckyUserTodaySnatchCount - res.luckyPurchaseNumLimit >= 0) {       // 当天次数用完
                  this.activeType = 4
                } else if (res.luckyTodaySnatchCount - res.luckyPurchaseNumNow >= 0) {   // 今天人数已满
                  this.activeType = 5
                }
              }
              clearInterval(this.timer)
            } else {

            }
            this.$emit('active', this.activeType)
            this.times -= 1000
          }
          this.timesOver -= 1000
          if (this.timesOver <= 0) {
            this.timesOver = 0
          }
          if (this.activeType === 1 || this.activeType === 5 || this.activeType === 4) {
            if (this.timesOver <= 0) {
              this.activeType = 3
            }
          }
        }, 1000)
      }
    },
    watch: {
      // list 订单数据
      footerDate: {
        handler (curVal) {
          this.dataFn(curVal)
          this.list = curVal.memberWaitSellResList || []
        },
        deep: true
      }
    },
    beforeDestroy () {
      // 清除定时器
      clearInterval(this.timer)
    }
  }
</script>

<style lang="less" scoped>
  .fixed{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #dfe7fe;
  }
  .botSled{
    background: #919ec5;
    display: inline-block;
    width: 1.02rem;
    height: 0.42rem;
    line-height: 0.45rem;
    text-align: center;
    font-size: 0.26rem;
    border-radius: 4px;
    color: #ffffff;
    margin-right: 0.1rem;
  }
  .footer-progress{
    color: #606060;
    padding: 0rem .2rem 0rem .2rem;
    line-height: 30px;
    font-size: .28rem;
    line-height: .3rem;
    min-height: .5rem;

    .progressBox{
      display: flex;
      flex-direction: row;
      margin-bottom: .1rem;
      justify-content: space-between;
      .progressBoxTitle{
        position: relative;
        top: .2rem;
        left: -0.1rem;
        font-size: .28rem;
      }
      .progress{
        position: relative;
        width: 3.1rem;
        margin-left: .1rem;
        margin-right: .1rem;
        overflow: hidden;
        height: .18rem;
        margin-top: .1rem;
        background: #c0c0c0;
        border-radius: .15rem;
        line-height: .14rem;
        font-size: .24rem;
        .back{
          width: 2.48rem;
          height: .16rem;
        }
        .progressLin{
          position: absolute;
          top: 0px;
          left: 0px;
          width: 1.5rem;
          border-radius: 0rem .15rem .15rem 0rem;
          height: .18rem;
          line-height: .14rem;
          background: #919ec5 ;
          overflow: hidden;
        }
      }
      .progressText{
        color: #666666;
        font-size: .24rem;
      }
    }

    .progressBox2{
      .progress{
        background: #c0c0c0;
        .progressLin{
          background: #919ec5;
        }
      }
    }

  }
  .footer-box{
    width: 7.5rem;
    margin:auto;
    display:flex;
    align-items: center;
    height: 1rem;
    font-size: 0.24rem;
    background: #fff;
    border-top:1px solid #eee;
    li {
      text-align: center;
      flex: 1;
    }
    .conter{
      background: #f23030;
      color:#fff;
      font-size: 0.28rem;
      height: .64rem;
      line-height: .64rem;
      border-radius: 0px;
      width: 2.4rem;

      margin-right: .2rem;
      border-radius: .4rem;
    }

    .conterErorr{
      background: #999999;
    }
    .right{
      color:#FFF;
      font-size: 0.24rem;
      height: 1rem;
      line-height: .7rem;
      border-radius: 0px;
      margin-right: .0rem;
      text-align: left;
      padding-left: .2rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      .iconFor{
        background: linear-gradient(-65deg, transparent 1.5em, #ceaa63 0);
        height: .6rem;
        width: 2.4rem;
        line-height: .5rem;
        .iocnText{
          margin-left: .1rem;
          font-size: .28rem;
          img{
            height: .3rem;
            width: .3rem;
            position: relative;
            top: .08rem;
          }
        }
      }
      .left{

        display: flex;
        align-items: center;
      }
      .text{
        line-height: .35rem;
      }
    }
    .name{
      font-size: .30rem;
    }
    .nameErr{
    }
    .text{
      color: #999999;
      font-size: .24rem;
    }
  }

  .wholesale{height: .6rem; line-height: .8rem;text-align: center;font-size: .24rem;
  border-radius: 4px;
  }
  .spree{height: .6rem; line-height: .8rem;text-align: center;font-size: .24rem;
    border-radius: 4px;
  }
</style>

<style lang="less">
  .djs{
    /*color: #fff;*/
    padding: 0.12rem 0.05rem;
    -webkit-border-radius: 0.1rem;
    -moz-border-radius: 0.1rem;
    border-radius: 0.1rem;
    margin: 0 0.05rem;
  }
  .progressBox2{
    .djs{
    }
  }
</style>
