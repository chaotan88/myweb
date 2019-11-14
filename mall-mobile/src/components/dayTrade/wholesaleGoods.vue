<template>
  <div>

    <div class="wholesalePage">
      <div class="wholesaleBanner" v-if="userToken">
        <div class="pfq"><span>{{pifaquan}}</span>批发券</div>
        <img src="../../assets/images/shopLucky01/pifaquan.png"/>
      </div>
      <div class="wholesaleMain">
        <div class="wholesale" v-for="(item, index) in pfData" :key="index" @click="goDetail(item)" :class="{'one':(index + 4) % 4 === 0,'two':(index + 4) % 4 === 1,'three':(index + 4) % 4 === 2,'four':(index + 4) % 4 === 3}">
          <!--头部-->
          <div class="wholesale_Top">
            <div class="uuids">
              <div class="luckyList_Top2Swiper">
                <swiper auto height="30px" :show-dots="false" :interval=2000 style="margin: 0 0.2rem;line-height: 30px;">
                  <swiper-item class="black" v-for="(ite, ind) in item.memberHasSellResList" :key="ind">
                    <p>Ta:{{ite.phone | phoneSubstringTop}}卖出此商品</p>
                    <div>赚：<span>{{ite.purchaseScaleCount}}</span>元</div>
                  </swiper-item>
                </swiper>
              </div>
            </div>
          </div>
          <!--中间商品信息-->
          <div class="wholesale_Center">
            <div class="lucky_l">
              <img :src="item.mainImage | filterImgUrl"/>
            </div>
            <div class="lucky_r">
              <div class="new_clamp2">{{item.goodsName}}</div>
              <div class="luckySell_Price">￥<span>{{item.purchaseBuyPrice}}</span> + <img :src="youhuiquan"/> <b>{{item.purchaseTicketNeed}}</b></div>
              <!--<div class="restOf">已批发数量：<b>{{item.hasPurchaseCount}}</b>件</div>-->
            </div>
          </div>
          <!--中下轮流判断-->
          <div class="wholesale-Dec">
            <!--未开始-->
            <div class="wholesale-Dec-main" v-if="item.flag === 1">
              <div class="djsText">活动未开始抢购，请耐心等待</div>
              <div v-html="timeOutFn(item.timeOut)"></div>
            </div>
            <!--已开始-->
            <div class="wholesale-Dec-main" v-if="item.flag === 2">
              <div class="hmp">批发中</div>
              <div class="wholesale_ProgressPulic" v-if="item.memberHasPurchaseResList">
                <div class="wholesalePro_Bar">
                <div class="wholesaleCover"><div class="wholesaleColor" :style="{width: item.progressColorWidth}"></div></div>
                </div>
                <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;">
                  <swiper-item v-for="(itx, inx) in item.memberHasPurchaseResList" :key="inx">
                    <p>恭喜{{itx.phone | phoneSubstringTop}}批发成功</p>
                  </swiper-item>
                </swiper>
              </div>
              <div class="wholesale_ProgressPulic" v-if="item.memberHasSellResList && !item.memberHasPurchaseResList">
                <div class="wholesalePro_Bar">
                  <div class="wholesaleCover"><div class="wholesaleColor" :style="{width: item.progressColorWidth}"></div></div>
                </div>
                <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;" v-if="item.memberHasSellResList">
                  <swiper-item v-for="(itx, inx) in item.memberHasSellResList" :key="inx">
                    <p>恭喜{{itx.phone | phoneSubstringTop}}批发成功</p>
                  </swiper-item>
                </swiper>
              </div>
              <div v-html="timeOutFn(item.timeOverD)" style="color: #000;"></div>
            </div>
            <!--已结束-->
            <div class="wholesale-Dec-main" v-if="item.flag === 3">
              <div class="wholesale_ProgressOver">本期活动暂停抢购，更多精彩敬请期待！！！</div>
            </div>
            <!--批发次数用完-->
            <div class="wholesale-Dec-main" v-if="item.flag === 4">
              <div class="hmp">批发中</div>
              <div class="wholesale_ProgressPulic" v-if="item.memberHasPurchaseResList">
                <div class="wholesalePro_Bar">
                  <div class="wholesaleCover"><div class="wholesaleColor" :style="{width: item.progressColorWidth}"></div></div>
                </div>
                <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;">
                  <swiper-item v-for="(itx, inx) in item.memberHasPurchaseResList" :key="inx">
                    <p>恭喜{{itx.phone | phoneSubstringTop}}批发成功</p>
                  </swiper-item>
                </swiper>
              </div>
              <div class="wholesale_ProgressPulic" v-if="item.memberHasSellResList && !item.memberHasPurchaseResList">
                <div class="wholesalePro_Bar">
                  <div class="wholesaleCover"><div class="wholesaleColor" :style="{width: item.progressColorWidth}"></div></div>
                </div>
                <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;" v-if="item.memberHasSellResList">
                  <swiper-item v-for="(itx, inx) in item.memberHasSellResList" :key="inx">
                    <p>恭喜{{itx.phone | phoneSubstringTop}}批发成功</p>
                  </swiper-item>
                </swiper>
              </div>
              <div v-html="timeOutFn(item.timeOverD)" style="color: #000;"></div>
            </div>
            <!--今日人数已满-->
            <div class="wholesale-Dec-main" v-if="item.flag === 5">
              <div class="hmp">批发中</div>
              <div class="wholesale_ProgressPulic" v-if="item.memberHasPurchaseResList">
                <div class="wholesalePro_Bar">
                  <div class="wholesaleCover"><div class="wholesaleColor" :style="{width: item.progressColorWidth}"></div></div>
                </div>
                <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;">
                  <swiper-item v-for="(itx, inx) in item.memberHasPurchaseResList" :key="inx">
                    <p>恭喜{{itx.phone | phoneSubstringTop}}批发成功</p>
                  </swiper-item>
                </swiper>
              </div>
              <div class="wholesale_ProgressPulic" v-if="item.memberHasSellResList && !item.memberHasPurchaseResList">
                <div class="wholesalePro_Bar">
                  <div class="wholesaleCover"><div class="wholesaleColor" :style="{width: item.progressColorWidth}"></div></div>
                </div>
                <swiper auto height="20px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" style="line-height: 20px;" v-if="item.memberHasSellResList">
                  <swiper-item v-for="(itx, inx) in item.memberHasSellResList" :key="inx">
                    <p>恭喜{{itx.phone | phoneSubstringTop}}批发成功</p>
                  </swiper-item>
                </swiper>
              </div>
              <div v-html="timeOutFn(item.timeOverD)" style="color: #000;"></div>
            </div>
          </div>
          <!--底部固定信息-->
          <div class="wholesale_Bottom">
            <div class="luckyList_Bottom2Left">
              <div class="luckyList_Bottom2LeftBigBox">赚</div>
              <div class="luckyList_Bottom2LeftMinBox">每售出1个商品，获{{item.hangRebate}}元</div>
            </div>
            <div class="luckyList_Bottom2Rightflag123" v-if="item.flag === 1" @click.stop="click1($event)">
              <div class="flag1" v-if="item.flag === 1">立即批发</div>
            </div>
            <div class="luckyList_Bottom2Rightflag123" v-if="item.flag === 2" @click.stop="click2(item)">
              <div class="flag2"  v-if="item.flag === 2">立即批发</div>
            </div>
            <div class="luckyList_Bottom2Rightflag123" v-if="item.flag === 3" @click.stop="click3($event)">
              <div class="flag3" v-if="item.flag === 3">立即批发</div>
            </div>
            <div class="luckyList_Bottom2Rightflag4" v-if="item.flag === 4" @click.stop="click4($event)">
              <div class="flag4" v-if="item.flag === 4">批发次数用完</div>
            </div>
            <div class="luckyList_Bottom2Rightflag5" v-if="item.flag === 5" @click.stop="click5($event)">
              <div class="flag5" v-if="item.flag === 5">今日人数已满</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <skuby-lucki :skuOrderSource="skuOrderSource" :activeTypeData="activeTypeData" :oderDate="skubasicGoodsInfor" :show = 'attributeType' @skuBack="skuBack"></skuby-lucki>
    <!--<div class="sellMyGoodsFoot" @click="myShop">-->
      <!--<div class="sellMyGoodsFootMain">销售我的商品</div>-->
    <!--</div>-->


  </div>
</template>

<script>
    import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem, Countdown, Group, Cell, XSwitch, Popup } from 'vux'
    import skubyLucki from '../../components/goodsDetailCompont/skubyLucki'
    export default {
      name: 'wholesaleGoods',
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
          youhuiquan: require('../../assets/images/aaayouhuiquana.png'),
          progressColorWidth: '',
          flag: null,                       // 1:未开始 2：已开始 3：总人数已满  4：批发次数用完  5： 今日人数已满
          pfData: [],                       // 批发列表
          timer: '',                        // 我的批发券
          pifaquan: '',                     // 我的批发券
          userToken: '',                    // 判断用户登录到的token
          goodDetailByLuck: {},             // 当前选中列表
          skuOrderSource: 10,               // 组件传值 OrderSource
          skubasicGoodsInfor: '',           // 组件传值 OrderDate
          attributeType: false,
          isLogin: 0,                       // 是否登录 0未登录 1登录
          activeTypeData: '',                //
          shareInvitationCode: ''
        }
      },
      computed: {
      },
      watch: {
        zoneId (value) {
//          console.log(value)
          this.getGoodsPurchaseListpf(value)
        }
      },
      mounted: function () {
        this.userToken = JSON.parse(localStorage.getItem('bsbUserInfo'))
        this.shareInvitationCode = this.$route.query.shareInvitationCode || ''
        this.checkLogin(() => {
          this.getMemberPurchaseCoupon()
        })
      },
      methods: {
        skuBack (res) {
          this.attributeType = res
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
        /**
         * 批发数据列表
         */
        getGoodsPurchaseListpf (value) {
          this.$http.post(`${this.api.getGoodsPurchaseListpf}`, {
            goodsGroupId: value
          }).then((res) => {
            let resData = res.data
            if (resData.status === '1') {
              this.pfData = resData.data
              // console.log(this.pfData)
              this.pfData.forEach((item, index) => {
                this.$set(
                  item, 'timeOut', ''
                )
//                let W = this.Percentage(item.todayPurchaseCount, item.purchaseNumNow)
                let W = (((item.purchasePercent && item.purchasePercent >= 100) ? 100 : item.purchasePercent) || 0) + '%'
//                console.log(W, 'w')
                this.$set(item, 'progressColorWidth', W)
                let sysTime = item.sysTime              // 系统时间
                let startDate = item.purchaseStartDateNow > item.purchaseStartDate ? item.purchaseStartDateNow : item.purchaseStartDate   // 开始时间
                let ifEnd = item.purchaseEndDateNow < item.purchaseEndDate ? item.purchaseEndDateNow : item.purchaseEndDate
                // 判断活动未开始 并且 当前时间 比 总结束时间早  比当天结束时间晚
                // 如果活动没开始 取 两个结束时间 取最大的 过滤掉当天结束时间始时间  (明天开枪 后天结束 过滤掉今天结束时间 取后天结束时间)
                if (item.purchaseStartDate > sysTime) {
                  // 2019 /1 /14  10: 00  => 10:00
                  //  2019 /1/15  9:00  => 2019 /1/15
                  //  2019 /1/15 +  10:00 => 2019 /1/15 10:00
                  // 2019 /1/15 10:00 => 时间戳1 (明天开盘时间 10点)
                  // 同理  => 时间戳2 明天结束时间 (结束 明天12点)
                  // 明天的总开盘时间 晚于 明天结束时间 12点
                  // 如果大于(ps: 14点 )  取 后天开盘时间 (+ 24小时)
                  // 明天的总(9点)开盘时间 早于明天开抢时间 10点 取 明天开抢时间 10点
                  // 明天的总开盘(11点)时间 晚于明天开抢时间10点 并且早于明天结束时间 取 明天总开抢时间 11点
                  let H = this.timeFn(item.purchaseStartDateNow, 1)
                  let Y = this.timeFn(item.purchaseStartDate)
                  let HY = new Date(Y + ' ' + H).getTime()
                  let Hen = this.timeFn(item.purchaseEndDateNow, 1)
                  let Yen = this.timeFn(item.purchaseStartDate)
                  let HYen = new Date(Yen + ' ' + Hen).getTime()
                  if (item.purchaseStartDate > HYen) {
                    let Ht = 60 * 60 * 24 * 1000 + HY
                    if (item.purchaseStartDate > HY && item.purchaseStartDate < HYen) {
                      Ht = 60 * 60 * 24 * 1000 + item.purchaseStartDate
                    }
                    startDate = Ht
                  } else if (item.purchaseStartDate > HY && item.purchaseStartDate < HYen) {
                    startDate = item.purchaseStartDate
                  } else if (item.purchaseStartDate < HY) {
                    startDate = HY
                  }
                  ifEnd = HYen
                }
                var timeOverD = ifEnd - item.sysTime
                this.$set(item, 'ifEnd', ifEnd)
                this.$set(item, 'ifStart', startDate)
                this.$set(
                  item, 'timeOverD', timeOverD
                )
                // 已开始
                if (ifEnd < sysTime) {
                  // 已结束
                  this.$set(item, 'flag', 3)
                } else if (sysTime >= startDate && sysTime < ifEnd) {
                  this.$set(item, 'flag', 2)
//                  if (item.hasPurchaseCount - item.purchaseNumTotal >= 0) {        }         // 总人数满
                  if (item.purchasePercent === 100) {         // 今天人数已满
                    this.$set(item, 'flag', 5)
                    return false
                  } else if (item.userTodayPurchaseCount - item.purchaseNumLimit >= 0) {   // 批发次数用完
                    this.$set(item, 'flag', 4)
                    return false
                  }
                } else if (sysTime < startDate) {
                  // 未开始
                  this.$set(item, 'flag', 1)
                  var time = startDate - item.sysTime
                  this.$set(
                    item, 'timeOut', time
                  )
                }
              })
              if (this.timer) {
                return
              }
              this.timer = setInterval(() => {
                for (let i in this.pfData) {
                  // 开始倒计时
                  if (this.pfData[i].timeOut && this.pfData[i].timeOut > 0) {
                    this.pfData[i].timeOut -= 1000
                    if (this.pfData[i].timeOut <= 0) {
                      this.$set(this.pfData[i], 'flag', 2)
                    }
                  } else if (this.pfData[i].timeOut === '') {
                  } else {
                    this.$set(this.pfData[i], 'flag', 2)
                  }
                  // 活动结束倒计时
                  this.pfData[i].timeOverD -= 1000
                  // 过滤负数
                  if (this.pfData[i].timeOverD <= 0) {
                    this.pfData[i].timeOverD = 0
                  }
                  if (this.pfData[i].flag === 2 || this.pfData[i].flag === 5 || this.pfData[i].flag === 4) {
                    if (this.pfData[i].timeOverD <= 0) {
                      this.$set(this.pfData[i], 'flag', 3)
                    }
                  }
                }
              }, 1000)
            }
          })
        },
        /**
         * 我的批发券
         */
        getMemberPurchaseCoupon () {
          this.$http.post(`${this.api.getMemberPurchaseCoupon}`, {}).then((res) => {
            this.pifaquan = res.data.data
          })
        },
        /**
         * sku弹出
         */
        click2 (item) {
          if (this.isLogin === 1) {
            this.goodsId = item.goodsId
            this.goodDetailByLuck = item
            this.activeTypeData = 1
            this.goodsDetailFun()
          } else {
            localStorage.setItem('REDIRECT_URL', this.$route.fullPath)
            this.$router.push('/login')
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
            var laukData = {
              luckyAddPrice: dt.purchaseTicketNeed,                 // 商品需要券
              purchasePrice: dt.purchaseBuyPrice,                   // 批发价格
              luckyTodaySnatchCount: dt.todaySnatchCount,           // 当天抢购次数
              luckyPurchaseNumNow: dt.purchaseNumNow,                   // 商品当天名额数
              luckyPurchaseNumLimit: dt.purchaseNumLimit,               // 每人当天购买上限
              luckyHasSnatchCount: dt.hasPaySnatchCount,               // 已抢总次数次数
              luckyMemberHasSellResList: dt.memberHasSellResList,   // 出售人列表 memberHasSellResList
              luckyPurchaseNumTotal: dt.purchaseNumTotal,           // 该商品可获得名额总数
              luckySysTime: dt.sysTime,                             // 系统时间
              luckyUserTodaySnatchCount: dt.userTodayPurchaseCount, // 用户当天已抢购次数
              startDate: dt.ifStart,                                // 今天活动开抢时间 > 总活动结束时间
              endDate: dt.ifEnd,                                    // 今天活动结束时间 < 总活动结束时间
              memberWaitSellResList: dt.memberWaitSellResList,
              myPurchaseCoupon: this.pifaquan,                     // 我的批发券
              typeLucky: 10,                                       // 9抢购 10批发
              hangRebate: dt.hangRebate,                            // 利润
              isLogin: this.isLogin
            }
            skubasic.luckyData = laukData
            this.skubasicGoodsInfor = skubasic
            setTimeout(() => {
              this.attributeType = true
            }, 200)
          })
        },
        /**
         * 阻止浏览器的默认行为
         */
        click1 (e) {
          e.preventDefault()
        },
        click3 (e) {
          e.preventDefault()
        },
        click4 (e) {
          e.preventDefault()
        },
        click5 (e) {
          e.preventDefault()
        },
        /****
         * 跳转到我的商品判断是否登录
         * ****/
        myShop () {
          if (this.userToken && this.userToken.token) {
            this.$router.push({path: '/shopSellGoods', query: {pageId: '8', otherShareInvitationCode: this.shareInvitationCode}})
          } else {
            localStorage.setItem('REDIRECT_URL', this.$route.fullPath)
            this.$router.push('/login')
          }
        },
        /**
         * 跳转到商品详情
         */
        goDetail (v) {
          localStorage.setItem('goodDetailByLuck', JSON.stringify(v))
          this.$router.push({name: 'goodDetail', query: {goodsId: v.goodsId, pageType: 10, sid: v.skuId, shareInvitationCode: this.shareInvitationCode}})
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
          var str = '<span class="djs2">' + H + '</span>' + '<span class="djs22">' + '时' + '</span>' + '<span class="djs2">' + T + '</span>' + '<span class="djs22">' + '分' + '</span>' + '<span class="djs2">' + S + '</span>' + '<span class="djs22">' + '秒' + '</span>'
          if (D > 0) {
            str = '<span class="djs2">' + D + '</span>' + '<span class="djs22">' + '天' + '</span>' + str
          }
          return str
        },
        /****
         * 封装百分比显示方法
         * ****/
        Percentage (num, total) {
          let res = Math.round(num / total * 10000) / 100.00 + '%'
          return res
        },
        /**
         * 检测是否登录
         */
        checkLogin (fun) {
          this.$http.get(`${this.api.ifLogin}`, {
          }).then((res) => {
            let resData = res.data
            this.isLogin = parseInt(resData.data)
            if (parseInt(resData.data) !== parseInt(this.api.ERR_OK)) {
              return false
            }
            fun()
          })
        }
      },
      created () {
      },
      beforeDestroy () {
        // 清除定时器
        clearInterval(this.timer)
      }
    }
</script>

<style lang="less" scoped>
  .wholesalePage{
    width: 7.5rem;
    /*background: #e1c9be;*/
    padding-bottom: 1.2rem;
    .wholesaleBanner{
      width: 6.42rem;
      height: 1.38rem;
      margin: 0.2rem 0 0.22rem 0.5rem;
      position: relative;
      .pfq{
        font-size: 0.62rem;
        color: #fff;
        position: absolute;
        width: 5.1rem;
        height: 1.34rem;
        line-height: 1.34rem;
        text-align: center;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
    .wholesaleMain{
      width: 7.5rem;
      height: auto;
      .wholesale{
        width: 7.1rem;
        margin: 0.2rem 0.2rem;
        -webkit-border-radius: 0.2rem;
        -moz-border-radius: 0.2rem;
        border-radius: 0.2rem;
        /*********************头部**********************/
        .wholesale_Top{

          border-top-left-radius: 0.2rem;
          border-top-right-radius: 0.2rem;
          display: flex;
          height: 0.6rem;
          line-height: 0.6rem;
          justify-content: space-between;
          .uuids{
            width: 7.1rem;
            height: auto;
            margin: 0 0.2rem;
            border-bottom: 2px solid #666666;
            display: flex;
            justify-content: space-between;
          }
          .luckyList_Top2Swiper{
            width: 6.7rem;
            font-size: 0.22rem;
            /*color: #340602;*/
          }
          .luckyList_Top2Price{
            font-size: 0.22rem;
            color: #ff707c;
          }
          .black{
            display: flex;
            p{
              font-size: 0.22rem;
              /*color: #340602;*/
            }
            div:nth-of-type(1){
              font-size: 0.23rem;
              color: #cf0644;
              margin-left: 2.2rem;
            }
          }
          .vux-swiper-item {
            display: flex;
            justify-content: space-between;
          }
        }
        /*********************中上**********************/
        .wholesale_Center{
          padding: 0.30rem 0 0 0;
          display: flex;

          .lucky_l{
            width: 2.36rem;
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
              color: #333;
              min-height: 0.6rem;
            }
            .luckySell_Price{
              font-size: 0.32rem;
              color: #fc493c;
              font-weight: 600;
              margin: 0.1rem 0 0.1rem 0;
              display: flex;
              align-items: center;
              span{
                /*color: #fc493c;*/
                font-size: 0.28rem;
                margin-right: 0.13rem;
              }
              img{
                width: 0.3rem;
                height: 0.3rem;
                margin-left: 0.10rem;
                margin-right: 0.1rem;
                border-radius: .4rem;
              }
              b{
                font-size: 0.28rem;
              }
            }
          }
          .restOf{
            color: #585858;
            font-size: 0.21rem;
          }
        }
        /*********************中下**********************/
        .wholesale-Dec{
          .wholesale-Dec-main{
            display: flex;
            padding: 0px 0.2rem;
            height: 1rem;
            line-height: 1rem;

            font-size: 0.22rem;
            color: #585858;
            justify-content: space-between;
            .hmp{
              display: inline-block;
              width: 0.98rem;
              height: 0.49rem;
              line-height: 0.53rem;
              color: #fff;
              border-radius: 4px;
              text-align: center;
              margin-top: 0.21rem;
              font-size: 0.26rem;
              margin-right: 0.15rem;
            }
            .wholesale_ProgressPulic{
              /*min-width: 3.8rem;*/
              .wholesalePro_Bar{
                margin: 0.15rem 0;
                .wholesaleCover{
                  width: 3.15rem;
                  height: 0.14rem;
                  background: #c0c0c0;
                  border-radius: 0.2rem;
                  overflow: hidden;
                  .wholesaleColor{
                    height: 0.14rem;
                    -webkit-border-radius: 0.2rem;
                    -moz-border-radius: 0.2rem;
                    border-radius: 0.2rem;
                    /*background: #ff707c;*/
                    background-size: 10px 10px;
                  }
                }
                span{
                  margin-left: 0.12rem;
                }
              }
            }
            .djsText{
              color: #585858;
              font-size: 0.24rem;
              height: 1rem;
              line-height: 1rem;
            }
            .wholesale_ProgressOver{
              color: #585858;
              font-size: 0.26rem;
            }
          }
        }
        /*********************底部**********************/
        .wholesale_Bottom{
          display: flex;
          justify-content: space-between;
          border-radius: 0.2rem;
          padding: 0 0.2rem;
          /*background: #ff707c;*/
          height: 0.77rem;
          line-height: 0.77rem;
          box-shadow: 0px 0px 16px -4px;
          .luckyList_Bottom2Left{
            height: 0.54rem;
            display: flex;
            .luckyList_Bottom2LeftBigBox{
              width: 0.55rem;
              height: 0.55rem;
              background: #fff;
              color: #e64340;
              float: left;
              border-radius: 0.1rem;
              margin-top: 0.12rem;
              line-height: 0.55rem;
              text-align: center;
              /*color: #f88b95;*/
              font-size: 0.31rem;
            }
            .luckyList_Bottom2LeftMinBox{
              height: 0.45rem;
              background: #fff;
              margin-top: 0.17rem;
              border-top-right-radius: 0.08rem;
              border-bottom-right-radius: 0.08rem;
              line-height: 0.45rem;
              font-size: 0.24rem;
              /*color: #f88b95;*/
              position: relative;
              left: -0.02rem;
              padding-right: 0.08rem;
              letter-spacing: 3px;
            }
          }
          .luckyList_Bottom2Rightflag123{
            width: 1.34rem;
            height: 0.44rem;
            /*background: #d25f68;*/
            margin-top: 0.2rem;
            /*box-shadow: 0 1px 0 #7c2017;*/
            border-radius: 4px;
            .flag1{
              width: 1.2rem;
              height: 0.4rem;
              background: #a7a7a7;
              font-size: 0.23rem;
              line-height: 0.4rem;
              text-align: center;
              position: relative;
              top: -0.05rem;
              left: 0.07rem;
              /*box-shadow: 0 1px 0 #760303;*/
              border-radius: 4px;
              color: #fff;
            }
            .flag2{
              width: 1.2rem;
              height: 0.4rem;
              color: #fff;
              // background: #ffffff;
              font-size: 0.23rem;
              line-height: 0.4rem;
              text-align: center;
              position: relative;
              top: -0.05rem;
              left: 0.07rem;
              /*box-shadow: 0 1px 0 #760303;*/
              border-radius: 4px;
            }
            .flag3{
              width: 1.2rem;
              height: 0.4rem;
              background: #a7a7a7;
              font-size: 0.23rem;
              line-height: 0.4rem;
              text-align: center;
              position: relative;
              top: -0.05rem;
              left: 0.07rem;
              /*box-shadow: 0 1px 0 #760303;*/
              border-radius: 4px;
              color: #fff;
            }
          }
          .luckyList_Bottom2Rightflag4{
            width: 1.9rem;
            height: 0.44rem;
            /*background: #d25f68;*/
            margin-top: 0.2rem;
            /*box-shadow: 0 1px 0 #7c2017;*/
            border-radius: 4px;
            .flag4{
              width: 1.72rem;
              height: 0.4rem;
              background: #a7a7a7;
              font-size: 0.23rem;
              line-height: 0.4rem;
              text-align: center;
              position: relative;
              top: -0.05rem;
              left: 0.08rem;
              /*box-shadow: 0 1px 0 #760303;*/
              border-radius: 4px;
              color: #fff;
            }
          }
          .luckyList_Bottom2Rightflag5{
            width: 1.9rem;
            height: 0.44rem;
            /*background: #d25f68;*/
            margin-top: 0.2rem;
            /*box-shadow: 0 1px 0 #7c2017;*/
            border-radius: 4px;
            .flag5{
              width: 1.72rem;
              height: 0.4rem;
              background: #a7a7a7;
              font-size: 0.23rem;
              line-height: 0.4rem;
              text-align: center;
              position: relative;
              top: -0.05rem;
              left: 0.08rem;
              /*box-shadow: 0 1px 0 #760303;*/
              border-radius: 4px;
              color: #fff;
            }
          }
        }
      }

      .one{
        background: linear-gradient(to right bottom,  #ffe9e9 ,  #fee8e8);
        .wholesaleColor, .hmp{
          background: #b48f8f;
        }
        .flag2{
          background: #6d4848;
        }
        .wholesale_Bottom{
          border-top: 1px solid #f7dfdd ;
          .swiperBot{
            .swiperBot_001{

            }
          }
        }

      }
      .two{
        background: linear-gradient(to right bottom,  #ecf0fc ,  #dfe7fe);
        .wholesaleColor, .hmp{
          background: #919ec5;
        }
        .flag2{
          background: #28396e;
        }
        .wholesale_Bottom{
          border-top: 1px solid #dfe7fe ;
          .swiperBot{
            .swiperBot_001{

            }
          }
        }

      }
      .three{
        background: linear-gradient(to right bottom,  #e2f4ff ,  #d0edfe);
        .wholesaleColor, .hmp{
          background: #7acaf9;
        }
        .flag2{
          background: #4f616b;
        }
        .wholesale_Bottom{
          border-top: 1px solid #d0edfe ;
          .swiperBot{
            .swiperBot_001{

            }
          }
        }

      }
      .four{
        background: linear-gradient(to right bottom,  #dcfab4 ,  #ddffb0);
        .wholesaleColor, .hmp{
          background: #94b26b;
        }
        .flag2{
          background: #485735;
        }
        .wholesale_Bottom{
          border-top: 1px solid #ddffb0 ;
          .swiperBot{
            .swiperBot_001{

            }
          }
        }

      }
    }
  }

  .sellMyGoodsFoot{
    width: 7rem;
    height: 0.88rem;
    line-height: 0.88rem;
    /*background: #bb4c55;*/
    /*color: #fff;*/
    font-size: 0.31rem;
    font-weight: 600;
    text-align: center;
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 0.16rem 0.25rem;
    z-index: 3;
    .sellMyGoodsFootMain{
      /*background: #ff707c;*/
    }
  }

</style>
<style lang="less">
  .djs2{
    /*background: #ff707c;*/
    /*color: #fff;*/
    padding: 0.14rem 0.08rem;
    -webkit-border-radius: 0.1rem;
    -moz-border-radius: 0.1rem;
    border-radius: 0.1rem;
    margin: 0 0.07rem;
    font-size: 0.24rem;
  }
  .djs22{
    font-size: 0.24rem;
    /*position: relative;*/
    /*top: 0.12rem;*/
  }
</style>
