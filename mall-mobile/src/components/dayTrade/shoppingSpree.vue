<template>
    <div>
      <div class="pageLucky1Page">
        <div class="pageLucky1List">
          <div class="earns">
            <img class="shopLuckyStrike_l" :src="shopLuckyStrike_l"/>
            <p>购买商品享受 <span>销售赚佣资格</span></p>
            <img class="shopLuckyStrike_R" :src="shopLuckyStrike_r"/>
          </div>
          <ul>
            <li v-for="(item, index) in luckyData" :key="index"  @click="goDetail(item)" :class="{'one':(index + 4) % 4 === 0,'two':(index + 4) % 4 === 1,'three':(index + 4) % 4 === 2,'four':(index + 4) % 4 === 3}">
              <!--头部-->
              <div class="luckyList_Top">
                <swiper auto height="30px" :show-dots="false" :interval=2000 style="padding: 0 0.2rem;line-height: 30px;border-bottom: 2px solid #655944;">
                  <swiper-item class="black" v-for="(ite, ind) in item.memberHasSellResList" :key="ind">
                    <div>Ta:{{ite.phone}}卖出此商品</div>
                    <div>赚：<span>{{ite.purchaseScaleCount}}</span>元</div>
                  </swiper-item>
                </swiper>
              </div>
              <!--中间商品信息-->
              <div class="luckyList_Center">
                <div class="lucky_l">
                  <img :src="item.mainImage | filterImgUrl"/>
                </div>
                <div class="lucky_r">
                  <p class="new_clamp2">{{item.goodsName}}</p>
                  <div class="luckySell_Price" >￥{{item.purchasePrice | moneyFilter}}<span>￥{{item.goodsPrice | moneyFilter}}</span></div>
                  <!--<div class="luckySell_Price" v-if="item.ifPurchasePrice === 0">￥{{item.goodsPrice | moneyFilter}}<span>￥{{item.purchasePrice | moneyFilter}}</span></div>-->
                  <!--<span class="restOf" v-if="item.hasSnatchCount !== 0">已抢购数量：{{item.hasSnatchCount}}件</span>-->
                </div>
              </div>
              <!--中下轮流判断-->
              <div class="shopping-Dec">
                <!--活动开始-->
                <div class="shopping-Dec-main" v-if="item.flag === 1">
                  <div class="cnm">今日进度</div>
                  <div class="shopping_ProgressPulic" v-if="item.memberHasGrabResList">
                    <div class="shoppingPro_Bar">
                      <div class="shoppingCover"><div class="shoppingColor" :style="'width:'+item.progressColorWidth + '%'"></div></div>
                    </div>
                    <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;">
                      <swiper-item v-for="(iten, indn) in item.memberHasGrabResList" :key="indn">
                        <p>恭喜{{iten.phone | phoneSubstringTop}}抢购成功</p>
                      </swiper-item>
                    </swiper>
                  </div>
                  <div class="shopping_ProgressPulic" v-if="item.memberHasSellResList && !item.memberHasGrabResList">
                    <div class="shoppingPro_Bar">
                      <div class="shoppingCover"><div class="shoppingColor" :style="'width:'+item.progressColorWidth + '%'"></div></div>
                    </div>
                    <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;" v-if="item.memberHasSellResList">
                      <swiper-item v-for="(iten, indn) in item.memberHasSellResList" :key="indn">
                        <p>恭喜{{iten.phone | phoneSubstringTop}}抢购成功</p>
                      </swiper-item>
                    </swiper>
                  </div>
                  <div v-html="timeOutFn(item.timeOverD)" style="color: #000;"></div>
                </div>
                <!--活动未开-->
                <div class="shopping-Dec-main" v-if="item.flag === 2">
                  <div class="luckyList_ProgressAwait">
                    <div class="djsText">活动未开始抢购，请耐心等待</div>
                    <div v-html="timeOutFn(item.timeOut)" style="color: #000;"></div>
                  </div>
                </div>
                <!--活动结束-->
                <div class="shopping-Dec-main" v-if="item.flag === 3">
                  <div class="shopping_ProgressOver">
                    本期活动暂停抢购，更多精彩敬请期待！
                  </div>
                </div>
                <!--当日次数用完-->
                <div class="shopping-Dec-main" v-if="item.flag === 4">
                  <div class="cnm">今日进度</div>
                  <div class="shopping_ProgressPulic" v-if="item.memberHasGrabResList">
                    <div class="shoppingPro_Bar">
                      <div class="shoppingCover"><div class="shoppingColor" :style="'width:'+item.progressColorWidth + '%'"></div></div>
                    </div>
                    <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;">
                      <swiper-item v-for="(iten, indn) in item.memberHasGrabResList" :key="indn">
                        <p>恭喜{{iten.phone | phoneSubstringTop}}抢购成功</p>
                      </swiper-item>
                    </swiper>
                  </div>
                  <div class="shopping_ProgressPulic" v-if="item.memberHasSellResList && !item.memberHasGrabResList">
                    <div class="shoppingPro_Bar">
                      <div class="shoppingCover"><div class="shoppingColor" :style="'width:'+item.progressColorWidth + '%'"></div></div>
                    </div>
                    <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;" v-if="item.memberHasSellResList">
                      <swiper-item v-for="(iten, indn) in item.memberHasSellResList" :key="indn">
                        <p>恭喜{{iten.phone | phoneSubstringTop}}抢购成功</p>
                      </swiper-item>
                    </swiper>
                  </div>
                  <div v-html="timeOutFn(item.timeOverD)" style="color: #000;"></div>
                </div>
                <!--今天人数已满-->
                <div class="shopping-Dec-main" v-if="item.flag === 5">
                  <div class="cnm">今日进度</div>
                  <div class="shopping_ProgressPulic" v-if="item.memberHasGrabResList">
                    <div class="shoppingPro_Bar">
                      <div class="shoppingCover"><div class="shoppingColor" :style="'width:'+item.progressColorWidth + '%'"></div></div>
                    </div>
                    <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;">
                      <swiper-item v-for="(iten, indn) in item.memberHasGrabResList" :key="indn">
                        <p>恭喜{{iten.phone | phoneSubstringTop}}抢购成功</p>
                      </swiper-item>
                    </swiper>
                  </div>
                  <div class="shopping_ProgressPulic" v-if="item.memberHasSellResList && !item.memberHasGrabResList">
                    <div class="shoppingPro_Bar">
                      <div class="shoppingCover"><div class="shoppingColor" :style="'width:'+item.progressColorWidth + '%'"></div></div>
                    </div>
                    <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;" v-if="item.memberHasSellResList">
                      <swiper-item v-for="(iten, indn) in item.memberHasSellResList" :key="indn">
                        <p>恭喜{{iten.phone | phoneSubstringTop}}抢购成功</p>
                      </swiper-item>
                    </swiper>
                  </div>
                  <div v-html="timeOutFn(item.timeOverD)" style="color: #000;"></div>
                </div>
                <!--活动结束-->
                <div class="shopping-Dec-main" v-if="item.flag === 6">
                  <div class="shopping_ProgressOver">
                   <span class="botSled">待售</span> <span>商品未开始抢购，敬请期待！</span>
                  </div>
                </div>
              </div>
              <!--底部固定信息-->
              <div class="luckyList_Bottom">
                <div class="swiperBot">
                  <div class="swiperBot_001">
                    <span class="quan">
                      <img src="../../assets/images/shopLucky/quan.png" height="26" width="26"/>
                    </span>
                    <span>赠</span>{{item.grabTicketGive || '0.00'}}批发券</div>
                  <div class="swiperBot_002">
                    <div>拥有此券可兑换商品</div>
                    <div>的销售权益</div>
                  </div>
                </div>
                <div class="botBack">
                  <div class="yks bot2" @click.stop="buyNow1(item)" v-if="item.flag === 1">立即抢购</div>
                  <div class="wks bot2" @click.stop="buyNow2($event)" v-if="item.flag === 2">立即抢购</div>
                  <div class="zrsm bot" @click.stop="buyNow3($event)" v-if="item.flag === 3">立即抢购</div>
                  <div class="rsm bot" @click.stop="buyNow4($event)" v-if="item.flag === 4">抢购次数用完</div>
                  <div class="rsm bot" @click.stop="buyNow5($event)" v-if="item.flag === 5">今天人数已满</div>
                  <div class="wks bot2" @click.stop="buyNow5($event)" v-if="item.flag === 6">立即抢购</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <skuby-lucki :skuOrderSource="skuOrderSource" :oderDate="skubasicGoodsInfor" :show = 'attributeType' @skuBack="skuBack" :activeTypeData="activeTypeData"></skuby-lucki>
        <!--<div class="sellMyGoods" @click="myShop">销售我的商品</div>-->
      </div>
    </div>
</template>

<script>
    import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem, Countdown, Group, Cell, XSwitch, Popup } from 'vux'
    import skubyLucki from '../../components/goodsDetailCompont/skubyLucki'
    export default {
      name: 'shoppingSpree',
      components: {
        Tab,
        TabItem,
        Sticky,
        Divider,
        XButton,
        Swiper,
        SwiperItem,
        Countdown,
        Group,
        Cell,
        XSwitch,
        Popup,
        skubyLucki
      },
      props: [
        'zoneId'
      ],
      data () {
        return {
          shareInvitationCode: '',      // 推荐码
          timeC: 0,                     // 服务器和本机时间差
          shopLuckyStrike_l: require('../../assets/images/shopLucky/back2.png'),
          shopLuckyStrike_r: require('../../assets/images/shopLucky/back2.png'),
          progressColorWidth: '',
          flag: null,                  // 1,活动已开始  2,活动未开始  3,已结束  4，当日次数用完  5,今天人数已满
          luckyData: [],               // 大抢购页面接收数据数据
          timer: '',                   //  定时器
          goodsId: '',                 //  商品Id
          skuOrderSource: 9,           // 组件传值 OrderSource
          skubasicGoodsInfor: '',      // 组件传值 OrderDate
          attributeType: false,       // sku的状态判断
          skuId: '',                   // 当前skuId
          goodDetailByLuck: '',        // 当前详情
          userToken: '',               //  判断进入页面用户是否有token
          activeTypeData: ''
        }
      },
      computed: {
      },
      watch: {
        zoneId (value) {
          if (this.timer) {
            // console.log('存在定时器')
            clearTimeout(this.timer)
          }
          this.getGoodsPurchaseList(value)
        }
      },
      mounted: function () {
        this.userToken = JSON.parse(localStorage.getItem('bsbUserInfo'))
        this.shareInvitationCode = this.$route.query.shareInvitationCode || ''
//        this.getGoodsPurchaseList()
      },
      methods: {
        /**
         * 倒计时
         */
        timeOutFn (time) {
          if (time >= 0) {
          } else {
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
          var str = '<span class="djs1">' + H + '</span>' + '<span class="djs11">' + '时' + '</span>' + '<span class="djs1">' + T + '</span>' + '<span class="djs11">' + '分' + '</span>' + '<span class="djs1">' + S + '</span>' + '<span class="djs11">' + '秒' + '</span>'
          if (D > 0) {
            str = '<span class="djs1">' + D + '</span>' + '<span class="djs11">' + '天' + '</span>' + str
          }
          return str
        },
        skuBack (res) {
          this.attributeType = res
        },
        goDetail (v) {
          localStorage.setItem('goodDetailByLuck', JSON.stringify(v))
          this.$router.push({name: 'goodDetail', query: {goodsId: v.goodsId, pageType: 9, sid: v.skuId, shareInvitationCode: this.shareInvitationCode}})
        },
        buyNow1 (item) {
          if (this.userToken && this.userToken.token) {
            this.goodsId = item.goodsId
            this.goodDetailByLuck = item
            this.activeTypeData = 1
            this.goodsDetailFun()
          } else {
            localStorage.setItem('REDIRECT_URL', this.$route.fullPath)
            this.$router.push('/login')
          }
        },
        buyNow2 (e) {
          e.preventDefault()
        },
        buyNow3 (e) {
          e.preventDefault()
        },
        buyNow4 (e) {
          e.preventDefault()
        },
        buyNow5 (e) {
          e.preventDefault()
        },
        /****
         * 跳转到我的商品判断是否登录
         * ****/
        myShop () {
          if (this.userToken && this.userToken.token) {
            this.$router.push({path: '/shopSellGoods', query: {pageId: '7', otherShareInvitationCode: this.shareInvitationCode}})
          } else {
            localStorage.setItem('REDIRECT_URL', this.$route.fullPath)
            this.$router.push('/login')
          }
        },
        /****
         * 获取商品列表的数据
         * ****/
        getGoodsPurchaseList (value) {
          this.$http.post(`${this.api.getGoodsPurchaseList}`, {
            goodsGroupId: value
          }).then((res) => {
            if (res.data.status === '1') {
              this.luckyData = res.data.data
              this.luckyData.forEach((item, index) => {
                this.$set(
                  item, 'timeOut', ''
                )
//                let W = this.Percentage(item.todaySnatchCount, item.grabNumNow)
                let W = ((item.grabPercent && item.grabPercent >= 100) ? 100 : item.grabPercent) || 0
//                console.log(W, 'w')
                this.$set(item, 'progressColorWidth', W)
                let sysTime = item.sysTime // 系统时间
                if (index === 0) {
                  let T = new Date().getTime()
                  this.timeC = item.sysTime - T // 服务器与本机时间差,取一个就行
                }
                let startDate = item.grabStartDateNow > item.grabStartDate ? item.grabStartDateNow : item.grabStartDate // 开始时间
                let ifEnd = item.grabEndDateNow < item.grabEndDate ? item.grabEndDateNow : item.grabEndDate // 结束时间
                if (item.grabStartDate > sysTime) {
               // 2019 /1 /14  10: 00  => 10:00
               //  2019 /1/15  9:00  => 2019 /1/15
               //  2019 /1/15 +  10:00 => 2019 /1/15 10:00
               // 2019 /1/15 10:00 => 时间戳1 (明天开盘时间 10点)
               // 同理  => 时间戳2 明天结束时间 (结束 明天12点)
               // 明天的总开盘时间 晚于 明天结束时间 12点
               // 如果大于(ps: 14点 )  取 后天开盘时间 (+ 24小时)
               // 明天的总(9点)开盘时间 早于明天开抢时间 10点 取 明天开抢时间 10点
               // 明天的总开盘(11点)时间 晚于明天开抢时间10点 并且早于明天结束时间 取 明天总开抢时间 11点
                  let H = this.timeFn(item.grabStartDateNow, 1)
                  let Y = this.timeFn(item.grabStartDate)
                  let HY = new Date(Y + ' ' + H).getTime()
                  let Hen = this.timeFn(item.grabEndDateNow, 1)
                  let Yen = this.timeFn(item.grabStartDate)
                  let HYen = new Date(Yen + ' ' + Hen).getTime()
                  if (item.grabStartDate > HYen) {
                    let Ht = 60 * 60 * 24 * 1000 + HY
                    if (item.grabStartDate > HY && item.grabStartDate < HYen) {
                      Ht = 60 * 60 * 24 * 1000 + item.grabStartDate
                    }
                    startDate = Ht
                  } else if (item.grabStartDate > HY && item.grabStartDate < HYen) {
                    startDate = item.grabStartDate
                  } else if (item.grabStartDate < HY) {
                    startDate = HY
                  }
                  ifEnd = HYen
                }
                // 倒计时剩余时间戳
                var timeOverD = ifEnd - item.sysTime
                this.$set(
                  item, 'ifEnd', ifEnd
                )
                this.$set(
                  item, 'ifStart', startDate
                )
                this.$set(
                  item, 'timeOverD', timeOverD
                )
                // 已开始
                if (item.grabStatus === 2) {
                  this.$set(item, 'flag', 6)
                } else if (ifEnd < sysTime) {
                  // 已结束
                  this.$set(item, 'flag', 3)
                  return false
                } else if (sysTime >= startDate && sysTime < ifEnd) {
                  this.$set(item, 'flag', 1)
                  if (item.grabPercent >= 100) {                     // 今天人数已满
                    this.$set(item, 'flag', 5)
                  } else if (item.userTodaySnatchCount - item.grabNumLimit >= 0) {      // 今天次数用完
                    this.$set(item, 'flag', 4)
                  }
                } else if (sysTime < startDate) {
                  // 未开始
                  this.$set(item, 'flag', 2)
                  var time = startDate - item.sysTime
                  this.$set(
                    item, 'timeOut', time
                  )
                }
              })
              this.timeOutFnDoing2()
            }
          })
        },
        /****
         * 定时刷新列表定时器
         * ****/
        timeOutFnDoing () {
          // console.log('执行')
          this.timer = setTimeout(() => {
            for (let i in this.luckyData) {
              // h活动开始倒计时
              if (this.luckyData[i].timeOut && this.luckyData[i].timeOut > 0) {
                this.luckyData[i].timeOut -= 1000
                if (this.luckyData[i].timeOut <= 0) {
                  this.$set(this.luckyData[i], 'flag', 1)
                }
              } else if (this.luckyData[i].timeOut === '') {
              } else {
                this.$set(this.luckyData[i], 'flag', 1)
              }
              // 活动结束倒计时
              this.luckyData[i].timeOverD -= 1000
              // 过滤负数
              if (this.luckyData[i].timeOverD <= 0) {
                this.luckyData[i].timeOverD = 0
              }
              if (this.luckyData[i].flag === 1 || this.luckyData[i].flag === 5 || this.luckyData[i].flag === 4) {
                if (this.luckyData[i].timeOverD <= 0) {
                  this.$set(this.luckyData[i], 'flag', 3)
                }
              }
            }
            this.timeOutFnDoing()
          }, 1000)
        },
        /****
         * 定时刷新列表定时器
         * ****/
        timeOutFnDoing2 () {
//          console.log('执行')
          this.timer = setTimeout(() => {
            for (let i in this.luckyData) {
              // h活动开始倒计时
              if (this.luckyData[i].timeOut && this.luckyData[i].timeOut > 0) {
                // 过滤开始时间不存在问题
                if (this.luckyData[i].ifStart) {
                  // 计算倒计时时开始间差,  开始时间 - 服务器时间(本地时间戳 + 本地与服务器时间差值)
                  this.luckyData[i].timeOut = this.luckyData[i].ifStart - (this.timeC + new Date().getTime())
                }
                if (this.luckyData[i].timeOut <= 0) {
                  // 状态更改
                  this.$set(this.luckyData[i], 'flag', 1)
                }
              } else if (this.luckyData[i].timeOut === '') {
                // 第一次计算不存在倒计时 忽略
              } else if (this.luckyData[i].timeOut <= 0) {
                // 状态更改
                this.$set(this.luckyData[i], 'flag', 1)
              }
              // 活动结束倒计时
              if (this.luckyData[i].ifEnd) {
                // 活动结束时间 与当前服务器时间差
                this.luckyData[i].timeOverD = this.luckyData[i].ifEnd - (this.timeC + new Date().getTime())
              }
              // 过滤负数
              if (this.luckyData[i].timeOverD <= 0) {
                this.luckyData[i].timeOverD = 0
              }
              if (this.luckyData[i].flag === 1 || this.luckyData[i].flag === 5 || this.luckyData[i].flag === 4) {
                if (this.luckyData[i].timeOverD <= 0) {
                  this.$set(this.luckyData[i], 'flag', 3)
                }
              }
            }
            this.timeOutFnDoing2()
          }, 1000)
        },
        // 开始后 单个商品结束倒计时
        ovrTimeFn (res) {
          if (res.timeOverD) {
          }
        },
        /****
         * 封装倒计时方法
         * ****/
        InitTime (times) {
          var dd = Math.floor(times / 60 / 60 / 24)
          var hh = Math.floor((times / 60 / 60) % 24)
          var mm = Math.floor((times / 60) % 60)
          var ss = Math.floor(times % 60)
          var str = dd + '天' + hh + '小时' + mm + '分' + ss + '秒'
          // console.log(str)
          return str
        },
        /****
         * 封装百分比显示方法
         * ****/
        Percentage (num, total) {
          let res = Math.round(num / total * 10000) / 100.00 + '%'
          return res
//          this.progressColorWidth = '30%'
        },
        /**
         * 时间戳解析
         */
        timeFn (time, type) {
          var Time = new Date(time)
          var data = {
            Y: Time.getFullYear(),
            M: Time.getMonth() + 1,
            D: Time.getDate(),
            H: Time.getHours(),
            T: Time.getMinutes(),
            S: Time.getSeconds()
          }
          if (data.H < 10) {
            data.H = '0' + data.H
          }
          if (data.T < 10) {
            data.T = '0' + data.T
          }
          if (data.S < 10) {
            data.S = '0' + data.S
          }
          if (data.M < 10) {
            data.M = '0' + data.M
          }
          if (data.D < 10) {
            data.D = '0' + data.D
          }
          if (type === 1) {
            return data.H + ':' + data.T + ':' + data.S
          } else if (type === 2) {
            return data.Y + '/' + data.M + '/' + data.D + ' ' + data.H + ':' + data.T + ':' + data.S
          } else {
            return data.Y + '/' + data.M + '/' + data.D
          }
        },
        /****
         * 获取商品详情
         * ****/
        goodsDetailFun () {
          this.$http.post(`${this.api.goodsDetail}`, {
            id: this.goodsId
          }).then((res) => {
            if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) return false
            let skubasic = res.data.data
            var dt = this.goodDetailByLuck
            // console.log(dt, 'dt')
            var laukData = {
              luckyAddPrice: dt.grabTicketGive,                             // 券
              goodsPrice: dt.goodsPrice,                                    // 划线价格
              luckyTodaySnatchCount: dt.hasPaySnatchCount,                   // 当天抢购次数
              luckyPurchaseNumNow: dt.grabNumNow,                           // 商品当天名额数
              luckyPurchaseNumLimit: dt.grabNumLimit,                       // 每人当天购买上限
              luckyHasSnatchCount: dt.hasPaySnatchCount,                       // 已抢总次数次数
              luckyMemberHasSellResList: dt.memberHasSellResList,           // 出售人列表 memberHasSellResList
              luckySysTime: dt.sysTime,                                     // 系统时间
              luckyUserTodaySnatchCount: dt.userTodaySnatchCount,           // 用户当天已抢购次数
              startDate: dt.ifStart,                                          // 今天活动开抢时间 > 总活动结束时间
              endDate: dt.ifEnd,                                          // 今天活动结束时间 < 总活动结束时间
              memberWaitSellResList: dt.memberWaitSellResList,
              purchasePrice: dt.purchasePrice,                              // 采销价
              typeLucky: 9,                                                 // 界面类型
              linPrice: dt.goodsPrice,                                       // 划线价格
              progressColorWidth: dt.progressColorWidth                     // 进度条百分比
            }
            // console.log(laukData)
            skubasic.luckyData = laukData
            this.skubasicGoodsInfor = skubasic
            setTimeout(() => {
              this.attributeType = true
            }, 200)
          })
        },
        /****
         * 获取商品详情信息
         * ****/
        getGoodsInfo (skubasic) {
          this.$http.post(`${this.api.getGoodsInfo}`, {
            goodsId: this.goodsId,
            skuId: this.skuId
          }).then((res) => {
            let resData = res.data
            if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
              // console.log(this.skubasicGoodsInfor, '--')
            }
          })
        }
      },
      created () {
        // this.getDocumentTitle()
      },
      beforeDestroy () {
        // 清除定时器
        clearInterval(this.timer)
      }
    }
</script>

<style lang="less" scoped>
/*我要抢购样式*/
.pageLucky1Page{
  width: 7.5rem;
  height: auto;
  margin-bottom: 1rem;
  padding-bottom: .4rem;
  .pageLucky1List{
    width: 7.1rem;
    height: auto;
    margin: 0 0.2rem;
    /*头部线条*/
    .earns{
      display: block;
      text-align: center;
      color: #913b34;
      font-size: 0.27rem;
      align-items: center;
      margin: auto;
      display: flex;
      p{
        margin: 0 0.1rem;
        span{
          color: #913b34;
        }
      }
      img{
        width: 1.7rem;
        height: 0.2rem;
      }
      .shopLuckyStrike_R{
       transform: rotate(180deg);
      }
    }
    /*列表list*/
    ul{
      width: 100%;
      li{
        width: 100%;
        margin-top: 0.33rem;
        border-radius: 0.2rem;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        background: linear-gradient(to right bottom,  #fde8c8 ,  #fdda9f);
        color: #696a6b;
        /********************头部**********************/
        .luckyList_Top{
          width: 6.7rem;
          height: auto;
          margin: 0 0.2rem;
          .vux-swiper{
             border-bottom: 1px solid #655a48;
           }
          .black{
             div:nth-child(1){
               font-size: 0.22rem;
               /*color: #702e0c;*/
             }
              div:nth-child(2){
                font-size: 0.23rem;
                color: #fc493c;
                span{
                  color: #fc493c;
                }
              }
          }
          .vux-swiper-item {
            display: flex;
            justify-content: space-between;
          }
        }
        /*********************中上**********************/
        .luckyList_Center{
          /*height: 1.8rem;*/
          padding: 0.30rem 0 0 0;
          display: flex;
          .lucky_l{
            width: 2.36rem;
            /*height: 1.8rem;*/
            display: flex;
            justify-content: center;
            align-items: center;
            img{
              width: 1.77rem;
              height: 1.74rem;
            }
          }
          .lucky_r{
            flex: 1;
            .new_clamp2{
              white-space:normal;
              overflow:hidden;
              display:-webkit-box;
              -webkit-line-clamp:2;
              -webkit-box-orient:vertical;
              word-break:break-all;
              font-size: 0.28rem;
              min-height: 0.6rem;
              font-family: 'Adobe 黑体 Std R';
            }
            .luckySell_Price{
              font-size: 0.32rem;
              color: #cf0644;
              font-weight: 600;
              margin: 0.1rem 0 0.1rem 0;
              span{
                /*color: #924e2b;*/
                font-size: 0.20rem;
                text-decoration: line-through;
                margin-left: 0.21rem;
              }
            }
            .restOf{
              height: 0.27rem;
              /*color: #924e2b;*/
              font-size: 0.20rem;
              margin-top: 0.18rem;
            }
          }
        }
        /*********************中下**********************/
        .shopping-Dec{
          .shopping-Dec-main{
            display: flex;
            padding: 0px 0.2rem;
            /*color: #924e2b;*/
            height: 1rem;
            line-height: 1rem;
            font-size: 0.26rem;
            justify-content: space-between;
            .luckyList_ProgressAwait{
              text-align: center;
              font-size: 0.22rem;
              width: 100%;
              height: 1rem;
              line-height: 1rem;
              display: flex;
              .djsText{
                /*color: #924e2b;*/
                font-size: 0.24rem;
                margin-right: 0.1rem;
              }
            }
            .shopping_ProgressOver{
              /*color: #924e2b;*/
              font-size: 0.26rem;

              .botSled{
                background: #a5afb5;
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
            }
            .cnm{
              /*color: #924e2b;*/
              font-size: 0.26rem;
              height: 1rem;
              line-height: 1rem;
            }
            .shopping_ProgressPulic{
              font-size: 0.26rem;
              .shoppingPro_Bar{
                margin: 0.15rem 0;
                .shoppingCover{
                  width: 3.15rem;
                  height: 0.14rem;
                  background: #c0c0c0;
                  border-radius: 0.2rem;
                  overflow: hidden;
                  .shoppingColor{
                    height: 0.14rem;
                    -webkit-border-radius: 0.2rem;
                    -moz-border-radius: 0.2rem;
                    border-radius: 0.2rem;
                    background-size: 10px 10px;
                  }
                }
              }
            }
          }
        }

        /*********************底部**********************/
        .luckyList_Bottom{
          display: flex;
          padding: 0 0.2rem;
          justify-content: space-between;
          border-radius: 0.2rem;
          border-top: 1px solid #f6d6a3 ;
          box-shadow: 0px 0px 16px -4px;
          .swiperBot{
            height: 0.5rem;
            line-height: 0.5rem;
            margin: 0.17rem 0;
            font-size: 0.18rem;
            letter-spacing: 0.01rem;
            display: flex;
            .swiperBot_001{
              height: 0.45rem;
              min-width:2.2rem ;
              overflow: hidden;
              background: linear-gradient(-65deg, transparent 1.5em, #ffffff 0);
              margin-right: 0rem;
              line-height: 0.45rem;
              text-align: center;
              font-size: 0.22rem;
              padding-right: .4rem;
              img{width: .28rem;height: .28rem;position: relative;top: .05rem}
              span{
                font-size: 0.24rem;
                margin-right: 0.1rem;
              }
              .quan{
                border-radius: .4rem;
              }
            }
            .swiperBot_002{
              height: 0.45rem;
              line-height: 0.45rem;
              div{
                height: 0.28rem;
                line-height: 0.28rem;
              }
            }
          }
          .botBack{
            height: .49rem;
            position: relative;
            padding: 0rem .1rem .0rem .1rem;
            top: .2rem;

            border-radius: 4px;

            .bot{
              position: relative;
              max-height: .41rem;
              overflow: hidden;
              border-radius: 4px;
              padding: .05rem .1rem;
            }
            .bot2{
              max-height: .41rem;
              overflow: hidden;
              border-radius: 4px;
              padding: .05rem .1rem;
            }
            .yks{
              text-align: center;
              color: #fff;
              font-size: 0.24rem;
            }
            .wks{
              text-align: center;
              background: #a7a7a7;
              color: #fff;
              font-size: 0.24rem;
              margin: -0.05rem 0;
            }
            .zrsm{
              text-align: center;
              background: #a7a7a7;
              color: #fff;
              font-size: 0.24rem;
            }
            // .csyw{
            //   text-align: center;
            //   /*color: #fff;*/
            //   font-size: 0.24rem;
            //   margin: 0.17rem 0;
            //   background: #a7a7a7;
            //   padding: .05rem 0rem;
            // }
            .rsm{
              text-align: center;
              background: #a7a7a7;
              color: #fff;
              font-size: 0.24rem;
            }
          }
        }
      }
      .one{
        background: linear-gradient(to right bottom,  #ffe9e9 ,  #fee8e8);

        .shoppingColor{
          background: #b48f8f;
        }
        .yks {
          background: #6d4848;
        }
        .luckyList_Bottom{
          border-top: 1px solid #f7dfdd ;
          .swiperBot{
            .swiperBot_001{

            }
          }
        }
      }
      .two{
        background: linear-gradient(to right bottom,  #ecf0fc ,  #dfe7fe);
        .shoppingColor{
          background: #919ec5;
        }
        .yks{
          background: #28396e;
        }
        .luckyList_Bottom{
          border-top: 1px solid #dfe7fe ;
          .swiperBot{
            .swiperBot_001{

            }
          }
        }
      }
      .three{
        background: linear-gradient(to right bottom,  #e2f4ff ,  #d0edfe);
        .shoppingColor{
          background: #7acaf9;
        }
        .yks{
          background: #4f616b;
        }
        .luckyList_Bottom{
          border-top: 1px solid #d0edfe ;
          .swiperBot{
            .swiperBot_001{

            }
          }
        }
      }
      .four{
        background: linear-gradient(to right bottom,  #dcfab4 ,  #ddffb0);
        .shoppingColor{
          background: #94b26b;
        }
        .yks{
          background: #485735;
        }
        .luckyList_Bottom{
          border-top: 1px solid #ddffb0 ;
          .swiperBot{
            .swiperBot_001{

            }
          }
        }
      }
    }
  }
  /*****销售我的商品****/
  .sellMyGoods{
    box-sizing: border-box;
    width: 7.5rem;
    height: 1.24rem;

    line-height: 0.98rem;
    background: #ffc564;
    /*color: #4a2619;*/
    font-size: 0.31rem;
    font-weight: 600;
    text-align: center;
    position: fixed;
    bottom: 0;
    /*border: .2rem solid #9d643d;*/
    /*border-right: .25rem solid #9d643d;*/
    /*border-left: .25rem solid #9d643d;*/
    z-index: 3;
  }
  .mySku{
  width: 100%;
    .vux-popup-dialog{
      height: 50%!important;
    }
  }
}
</style>
<style lang="less">
  .djs1{
    /*background: #924e2b;*/
    /*color: #fff;*/
    padding: 0.14rem 0.07rem;
    -webkit-border-radius: 0.1rem;
    -moz-border-radius: 0.1rem;
    border-radius: 0.1rem;
    margin: 0 0.07rem;
    font-size: 0.24rem;
  }
  .djs11{
    font-size: 0.24rem;
  }
</style>
