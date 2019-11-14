<template>
  <div class="exchangeZone-warp" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
    <!-- tab切换 -->
    <div class="exchangeZone-tab">
      <ul>
        <li :class="{ 'active': tabIndex === index}" v-for="(item, index) in tabData" @click="tabTap(index, item.themeType)">
          <svg class="icon" aria-hidden="true" v-if="index === tabIndex">
            <use xlink:href="#icon-daohangdizhi"></use>
          </svg>
          <span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <!-- banner -->
    <div class="exchangeZone-ban">
      <img :src="banData.themeImage">
    </div>
    <!-- 列表 -->
    <div class="goods-list">
      <div class="exchanged-title">
        <img src="../../assets/images/wallet/exchange-title-icon.png">
        <span>{{welfwarewTitle[tabIndex]}}购物为您省，省，省！</span>
        <img src="../../assets/images/wallet/exchange-title-icon.png">
      </div>
      <ul>
        <li v-for="(item, index) in goodsList">
          <div class="list-tag" v-if="tabIndex === 0 && item.whetherLeaguePrice && item.goodsPrice - item.goodsLeaguePrice > 0">
            <span>省{{item.goodsPrice - item.goodsLeaguePrice}}</span>
          </div>
          <div class="list-tag" v-if="tabIndex === 1 && item.whetherBonusPrice && item.goodsPrice - item.goodsBonusPrice > 0">
            <span>省{{item.goodsPrice - item.goodsBonusPrice}}</span>
          </div>

          <div class="list-tag" v-if="tabIndex === 2 && item.whetherGoldBeanPrice && item.goodsPrice - item.goodsGoldBeanPrice > 0">
            <span v-if="tabIndex === 2 && item.goodsPrice - item.goodsGoldBeanPrice > 0">省{{item.goodsPrice - item.goodsGoldBeanPrice}}</span>
          </div>
          <div class="list-img">
            <img :src="item.activityImage | filterImgUrl">
            <!-- <div class="bean-tag">芯豆不足</div> -->
          </div>
          <div class="list-con">
            <p class="con-title">{{item.goodsName}}</p>
            <div style="text-align: right">
              <template v-if="tabIndex === 0">
                <p class="con-bean" v-if="item.whetherLeaguePrice">原价：{{item.goodsPrice}}元</p>
                <p class="con-price">
                  <template v-if="item.whetherLeaguePrice">
                    <i>￥</i>{{item.goodsLeaguePriceFormat}}
                    <span v-if="item.goodsLeaguePoints">
                    +{{item.goodsLeaguePoints}}
                    <img src="../../assets/images/wallet/point_league_iconss.png">
                  </span>
                  </template>
                  <template v-else>
                    ￥{{item.goodsPrice}}
                  </template>
                </p>
              </template>
              <template v-if="tabIndex === 1">
                <p class="con-bean" v-if="item.whetherBonusPrice">原价：{{item.goodsPrice}}元</p>
                <p class="con-price">
                  <template v-if="item.whetherBonusPrice">
                    <i>￥</i>{{item.goodsBonusPriceFormat}}
                    <span v-if="item.goodsBonusPoints">
                    +{{item.goodsBonusPoints}}
                    <img src="../../assets/images/wallet/point_consume_iconss.png">
                  </span>
                  </template>
                  <template v-else>
                    ￥{{item.goodsPrice}}
                  </template>
                </p>
              </template>
              <template v-if="tabIndex === 2">
                <p class="con-bean" v-if="item.whetherGoldBeanPrice">原价：{{item.goodsPrice}}元</p>
                <p class="con-price">
                  <template v-if="item.whetherGoldBeanPrice">
                    <i>￥</i>{{item.goodsGoldBeanPriceFormat}}
                    <span v-if="item.goodsGoldBeanNum">
                    +{{item.goodsGoldBeanNum}}
                    <img src="../../assets/images/wallet/icon_small_beanss.png">
                  </span>
                  </template>
                  <template v-else>
                    ￥{{item.goodsPrice}}
                  </template>
                </p>
              </template>
              <div class="botBox">
                <div class="con-btn" @click="$router.push({path:'/goodDetail',query: {goodsId: item.goodsId, pageType: tabData[tabIndex].pageType, sid: item.skuId}})">立即购买</div>
                <div class="con-btn" style="width: 1.4rem;margin-left: .2rem" @click="share(item)">分享赚</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <load-more tip="数据加载中..." v-if="showLoading"></load-more>
      <!--无数据-->
      <no-data v-if="noData"></no-data>
    </div>
    <create-share-img :shareData="shareCon" ref="imageWrapper" v-model="showToast"></create-share-img>
    <!-- 未成为超级会员弹窗及绑定邀请人信息弹窗 -->
    <div class="memberSte">
      <x-dialog v-model="showMemberSte" :hide-on-blur="true">
        <svg class="icon close-icon" aria-hidden="true" @click="showMemberSte = false">
          <use xlink:href="#icon-tubiao-"></use>
        </svg>
        <svg class="icon sigh-icon" aria-hidden="true">
          <use xlink:href="#icon-gantanhao-copy"></use>
        </svg>
        <!-- 第一步 -->
        <template v-if="memberStep == 1">
          <div class="memberSte-tip">
            <p>您尚未成为超级会员，购买活动</p>
            <p>任意商品即可享受升级</p>
          </div>
          <div class="memberSte-btn" @click="showMemberSte = false">立即购买</div>
        </template>
        <!-- 第二步 -->
        <template v-if="memberStep == 2">
          <div class="update-hints">您需要绑定邀请人信息后才能进行分享</div>
          <ul>
            <li>
              <div>邀请人ID号:</div>
              <div><input type="text" v-model="formData.invitCode" v-on:input ="getInvitation" maxlength="5" placeholder="请输入邀请人ID号"></div>
            </li>
            <li>
              <div>您的邀请人:</div>
              <div><input type="text" disabled :value="formData.invitName"></div>
            </li>
            <li>
              <div>邀请人手机号:</div>
              <div><input type="text" disabled :value="formData.invitPhone"></div>
            </li>
          </ul>
          <div class="update-hints">注意：邀请人信息一旦绑定，将无法修改</div>
          <div class="memberSte-btn" @click="bindInvite">绑定邀请人</div>
        </template>
      </x-dialog>
    </div>
  </div>
</template>
<script>
import { LoadMore, XDialog } from 'vux'
import noData from '../../components/noData'                        // 暂无数据
import createShareImg from '../../components/createShareImg'        // 分享图片组件
import html2canvas from 'html2canvas'
export default {
  components: {
    LoadMore,
    noData,
    createShareImg,
    XDialog
  },
  data () {
    return {
      showToast: false,                                                   // 分享弹框
      banData: '',                                                        // banner图片
      goodsList: [],                                                      // 数据列表
      bsbUserInfo: {},           // 存储的登录信息
      showMemberSte: false,      // 是否是超级会员状态
      memberStep: 1,             // 绑定邀请人步数
      codeIdIsTrue: false,      // 邀请人id是否正确
      formData: {
        invitCode: '',          // 邀请码
        invitName: '',          // 邀请人
        invitPhone: ''          // 邀请人手机
      },
      welfwarewTitle: ['联盟积分消费积分', '消费积分', '芯豆'],
      tabData: [
        {
          name: '联盟积分区',
          themeType: 4,
          pageType: 2
        },
        {
          name: '消费积分区',
          themeType: 3,
          pageType: 1
        },
        {
          name: '芯豆区',
          themeType: 2,
          pageType: 3
        }
      ],                      // tab数据
      tabIndex: 0,                                                       // tab索引
      cover: false,                                                      // 是否点击
      showLoading: false,                                                // 是否显示加载loading
      busy: false,
      noData: false,                                                     // 无数据状态
      start: 1,                                                          // 当前页数
      pageSize: 10,                                                      // 每页显示条数
      totalPage: 0,                                                      // 总页数
      shareCon: {}                                                       // 分享数据
    }
  },
  mounted: function () {
    this.getBanData(this.tabData[0].themeType)
    this.getList(this.tabData[0].themeType)        // 获取数据列表
  },
  methods: {
    /**
     * tab点击
    */
    tabTap (index, themeType) {
      this.tabIndex = index
      this.start = 1
      this.cover = true
      this.showLoading = false
      this.goodsList = []
      // document.body.scrollTop = 0
      this.getBanData(themeType)
      setTimeout(() => {
        this.getList(themeType)
      }, 100)
    },
    /**
     * 获取banner图片
    */
    getBanData (themeType) {
      this.$http.get(this.api.getShareMes, {
        params: {
          themeType: themeType
        }
      }).then((res) => {
        let resData = res.data
        if (resData.status !== this.api.ERR_OK || !res) return false
        this.banData = resData.data
      })
    },
    /**
     * 获取数据列表
    */
    getList (themeType) {
      this.$http.post(`${this.api.getWelfareList}`, {
        themeId: themeType,
        start: this.start,
        pageSize: this.pageSize
      }).then((res) => {
        let resData = res.data
        this.busy = false            // 重置busy状态
        this.showLoading = false
        if (resData.status !== this.api.ERR_OK || !res) {
          this.noData = true
          return false
        }
        resData.data.list.forEach((item) => {
          this.$set(item, 'goodsBonusPriceFormat', '')
          this.$set(item, 'goodsLeaguePriceFormat', '')
          this.$set(item, 'goodsGoldBeanPriceFormat', '')
          item.goodsBonusPriceFormat = parseFloat(item.goodsBonusPrice) >= 10000 ? (item.goodsBonusPrice / 10000).toFixed(1) + 'w' : item.goodsBonusPrice
          item.goodsLeaguePriceFormat = parseFloat(item.goodsLeaguePrice) >= 10000 ? (item.goodsLeaguePrice / 10000).toFixed(1) + 'w' : item.goodsLeaguePrice
          item.goodsGoldBeanPriceFormat = parseFloat(item.goodsGoldBeanPrice) >= 10000 ? (item.goodsGoldBeanPrice / 10000).toFixed(1) + 'w' : item.goodsGoldBeanPrice
          // 格式化福利积分
          item.goodsBonusPoints = parseInt(item.goodsBonusPoints) >= 10000 ? (item.goodsBonusPoints / 10000).toFixed(1) + 'w' : item.goodsBonusPoints
          item.goodsLeaguePoints = parseInt(item.goodsLeaguePoints) >= 10000 ? (item.goodsLeaguePoints / 10000).toFixed(1) + 'w' : item.goodsLeaguePoints
          item.goodsGoldBeanNum = parseInt(item.goodsGoldBeanNum) >= 10000 ? (item.goodsGoldBeanNum / 10000).toFixed(1) + 'w' : item.goodsGoldBeanNum
        })
        this.goodsList = this.cover ? resData.data.list : this.goodsList.concat(resData.data.list)
        this.noData = resData.data.list.length > 0 ? 0 : 1
        this.start = this.start + 1                   // 当前页数
        this.totalPage = resData.data.pages           // 总页数
      })
    },
    /**
     * 分页
    */
    loadMore () {
      this.cover = false
      this.busy = true
      this.showLoading = true
      if (parseInt(this.start) > parseInt(this.totalPage)) {
        this.showLoading = false
        return
      }
      this.getList(this.tabData[this.tabIndex].themeType)        // 分页数据
    },
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
          this.showToast = true
        })
      }, 100)
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
      codeUrl += '/goodDetail?goodsId=' + v.goodsId + '&shareInvitationCode='
      codeUrl += v.invitationCode + '&pageType=' + this.tabData[this.tabIndex].pageType + '&sid=' + this.skuId + '&shopId=' + shopId
//        let codeUrl = 'http://120.77.210.28/mshop' + '/share/goodDetail?goodsId=' + 6942 + '&shareInvitationCode=' + v.invitationCode + '&fromType=1&shopId=' + shopId
      this.shareCon = v
      this.shareCon.codeUrl = codeUrl
      this.shareCon.alertTpye = 'welfarew'
      this.shareCon.pageType = this.tabData[this.tabIndex].pageType
      this.shareCon.tabIndex = this.tabIndex
//      if (this.tabIndex === 0 && v.whetherLeaguePrice && v.goodsPrice - v.goodsLeaguePrice > 0) {
//        this.shareCon.zhuan = v.goodsPrice - v.goodsLeaguePrice
//      }
//      if (this.tabIndex === 1 && v.whetherBonusPrice && v.goodsPrice - v.goodsBonusPrice > 0) {
//        this.shareCon.zhuan = v.goodsPrice - v.goodsBonusPrice
//      }
//      if (this.tabIndex === 2 && v.whetherGoldBeanPrice && v.goodsPrice - v.goodsGoldBeanPrice > 0) {
//        this.shareCon.zhuan = v.goodsPrice - v.goodsGoldBeanPrice
//      }
//      console.log(codeUrl)
      if (v.activityImage && v.activityImage.match(/http/gi) && v.activityImage.indexOf('data:image') === -1) {
        this.getImageBase64ByUrl(v.activityImage, (res) => {
          this.shareCon.activityImage = 'data:image/png;base64,' + res.data.data
          this.createImg()
        })
      } else {
        this.createImg()
      }
    },
    /**
     * 分享
     */
    share (v) {
      var bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
      if (bsbUserInfo && bsbUserInfo.token) {
        this.getPersonalInfo((res) => {
          if (res.bindStatus === 1) {  // 已达到成为超级会员条件，已绑定邀请人信息
            v.invitationCode = res.invitationCode
            console.log(res, 'getPersonalInfo')
            var pageType = this.tabData[this.tabIndex].pageType
            var orderSource = pageType === 2 ? 5 : pageType === 1 ? 4 : pageType === 3 ? 3 : 1
//          orderSource  3:芯豆兑换区,4:消费积分区,5:联盟积分区,
            this.$http.get(`${this.api.getLevelOneInviterProfit}`, {
              params: {
                skuId: v.skuId,
                orderSource: orderSource
              }
            }).then((res) => {
              v.zhuan = res.data.data
              this.toImage(v)
            })
            this.toImage(v)
          } else {  // 已达到成为超级会员条件，未绑定邀请人信息
            this.showMemberSte = true
            this.memberStep = 2
          }
        })
      } else {
        localStorage.setItem('REDIRECT_URL', this.$router.currentRoute.fullPath)
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      }
    },
    /**
     * 检测邀请码ID是否正确
     */
    checkInvCodeId (fun) {
      if (!this.formData.invitCode.match(/^[A-Z]\d{4,}$/)) {
        this.$vux.toast.text('邀请码对应用户不存在')
        return false
      }
      this.$http.post(`${this.api.getInvitationInfo}`, {
        recommendCode: this.formData.invitCode
      }).then((res) => {
        fun(res)
      })
    },
    /**
     * 获取邀请人信息
     */
    getInvitation () {
      // 输入验证码够5位是请求接口验证
      if (this.formData.invitCode.length >= 5) {
        this.checkInvCodeId((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK) {
            this.$vux.toast.text(resData.msg)
            this.codeIdIsTrue = false      // 邀请码是否正确
            return false
          } else {
            this.codeIdIsTrue = true       // 邀请码是否正确
            this.formData.invitName = resData.data.beCardName
            this.formData.invitPhone = resData.data.bePhone
          }
        })
      } else {
        this.formData.invitName = ''
        this.formData.invitPhone = ''
      }
    },
    /**
     * 绑定邀请人
     */
    bindInvite () {
      if (!this.formData.invitCode) {
        this.$vux.toast.text('请输入邀请码')
        return false
      }
      if (!this.codeIdIsTrue && this.formData.invitCode.length > 0) {
        this.$vux.toast.text('邀请码对应用户不存在')
        return false
      } else {
        this.$http.post(`${this.api.bandRecommendRelation}`, {
          invitationCode: this.formData.invitCode,
          recommendCode: this.formData.invitCode
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.status !== this.api.ERR_OK) {
            return false
          }
          this.showMemberSte = false
        })
      }
    },
    /**
     * 获取个人信息
     */
    getPersonalInfo (fun) {
      this.$http.post(`${this.api.personalInfo}`, {
        id: this.bsbUserInfo ? this.bsbUserInfo.userId : ''
      }).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) {
          return false
        }
        return fun(res.data.data)
      })
    }
  }
}
</script>
<style lang="less">
.exchangeZone-warp{
  height: calc(100vh);
  background: #4b0176;
  overflow-y: auto;
  /* tab切换 */
  .exchangeZone-tab{
    width: 7.5rem;
    height: .8rem;
    background: rgba(99,16,171,0.7);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;
    margin: auto;
    ul{
      height: 100%;
      display: flex;
      align-items: center;
      li{
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.5);
        font-size: .28rem;
        &.active{
          color: #fff;
        }
        svg{
          fill: #fff;
          width: .3rem;
          height: .25rem;
        }
      }
    }
  }
  /* banner */
  .exchangeZone-ban{
    img{
      width: 100%;
      display: block;
    }
  }
  /* 公共title */
  .exchanged-title{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .4rem 0;
    background: url('../../assets/images/wallet/exchange-title-bg.png') no-repeat;
    background-size: 100% 100%;
    span{
      font-size: .36rem;
      color: #fff;
      display: inline-block;
      max-width: 4.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0 .1rem;
    }
    img{
      width: .79rem;
      height: .2rem;
      display: block;
      &:last-child{
        transform: rotate(180deg);
      }
    }
  }
  /* 商品列表 */
  .goods-list{
    ul{
      margin: 0 .2rem;
      li{
        height: 3.81rem;
        border-radius: 6px;
        padding: .4rem .35rem;
        box-sizing: border-box;
        background: -webkit-radial-gradient(top left, #6d45e4,#c426b9);
        position: relative;
        margin-bottom: .34rem;
        display: flex;
        align-items: center;
        .list-tag{
          width: 1.88rem;
          height: .66rem;
          background: url('../../assets/images/wallet/exchange-tag.png') no-repeat;
          background-size: 100% 100%;
          text-align: center;
          font-size: .26rem;
          color: #fff;
          line-height: .66rem;
          transform: rotate(-45deg);
          position: absolute;
          top: .68rem;
          left: 0;
          z-index: 300;
          transform-origin: 0% 100%;
          span{
            display: inline-block;
            max-width: 1rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        &.evenNum{
          -webkit-flex-flow: row-reverse wrap;
          flex-flow: row-reverse wrap;
          .list-con{
            margin-left: .38rem;
          }
        }
        &::after{
          width: 100%;
          content: '';
          display: block;
          height: .55rem;
          background: rgba(0,0,0,0.3);
          position: absolute;
          bottom: 0;
          left: 0;
        }
        .list-con{
          display: flex;
          flex-flow: column;
          align-items: flex-end;
          flex: 1;
          position: static;
          z-index: 100;
          height: 3.2rem;
          flex-direction: column;
          justify-content: space-between;

          .con-title{
            font-size: .36rem;
            color: #edd5a5;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .con-tag{
            span:nth-child(1){
              font-size: .18rem;
              color: #fff;
              background: #e72d84;
              border-radius: 50%;
              width: .3rem;
              height: .3rem;
              display: inline-block;
              text-align: center;
            }
            span:nth-child(2){
              font-size: .2rem;
              color: #fff;
            }
          }
          .con-bean{
            display: inline-block;
            font-size: .24rem;
            color: #391560;
            height: .36rem;
            line-height: .36rem;
            text-decoration: line-through;
            padding: 0 .1rem;
            background: linear-gradient(90deg, #deaf99, #fff, #deaf99);
            margin-top: .1rem;
          }
          .con-price{
            background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#fff), to(#d3bf82));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: .5rem;
            margin-bottom: .2rem;
            margin-top: .2rem;
            i{
              font-size: .3rem;
              color: #f9ffd9;
            }
            span{
              font-size: .26rem;
            }
            img{
              width: .26rem;
              height: .26rem;
            }
          }
          .con-btn{
            display: inline-block;
            width: 1.7rem;
            height: .55rem;
            border-radius: 5px;
            text-align: center;
            line-height: .55rem;
            font-size: .32rem;
            color: #bd0401;
            background: -webkit-linear-gradient(top, #fef7e7, #efceb3);
          }

          .botBox{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
          }
        }
        .list-img{
          width: 2.45rem;
          height: 3.08rem;
          margin-right: .38rem;
          position: static;
          z-index: 100;
          position: relative;
          display: flex;
          align-items: center;
          img{
            width: 100%;
            max-height: 100%;
          }
          .bean-tag{
            width: 1.68rem;
            height: .46rem;
            line-height: .46rem;
            text-align: center;
            background: rgba(0,0,0,0.5);
            color: rgba(255,255,255,0.7);
            font-size: .28rem;
            border-radius: 4px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
          }
        }
      }
    }
  }

  /* 分享后-未成为超级会员弹窗及绑定邀请人弹窗 */
  .memberSte{
    padding: .36rem;
    .weui-dialog{
      padding: .36rem;
      width: 6.2rem;
      max-width: 5.54rem;
      overflow: unset;
      box-sizing: border-box;
    }
    .close-icon{
      fill: #343233;
      width: .6rem;
      height: .6rem;
      position: absolute;
      right: -.3rem;
      top: -.2rem;
    }
    .sigh-icon{
      width: .63rem;
      height: .63rem;
    }
    .memberSte-tip{
      font-size: .26rem;
      color: #231c20;
      text-align: center;
      margin: .36rem 0;
    }
    .memberSte-btn{
      display: inline-block;
      padding: 0 .35rem;
      height: .67rem;
      background: #f4676b;
      border-radius: 5px;
      color: #fff;
      text-align: center;
      line-height: .67rem;
      margin: 0 auto;
      font-size: .28rem;
    }
    .update-hints{
      font-size: .24rem;
      color: #f4676b;
      margin: .3rem 0;
    }
    ul{
      width: 4.87rem;
      li{
        height: .6rem;
        display: flex;
        border-bottom: 1px solid #eae8e9;
        align-items: center;
        div:nth-child(1){
          width: 1.8rem;
          text-align: left;
          font-size: .26rem;
          color: #313030;
          white-space: nowrap;
          margin-right: .1rem;
        }
        div:nth-child(2){
          flex:1;
          input{
            height: .6rem;
            background: none;
            font-size: .26rem;
          }
        }
      }
    }
  }
}
</style>
