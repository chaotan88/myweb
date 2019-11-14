<template>
  <div class="buy-sell-wrap">
    <!--头部导航切换-->
    <div class="titleTab">
      <div class="titleTabBox">
        <div :class="{'box2': tabList.length < 6, 'box': tabList.length >= 6}">
          <div class="item-tab" v-for="(item, index) in tabList" :key="index" @click="tabTap(item, index)" :class="tabMark === index ? 'tabMarkCss': ''">
          {{item.groupName}}
          </div>
        </div>
      </div>
    </div>
    <!--banner背景切换-->
    <div class="banner-wrap" v-if="isControl">
      <!-- 广告背景 -->
      <div class="headShow" v-if="isAdv">
        <img :src="mmcData.themeImage" v-if="mmcData.themeImage"/>
      </div>
      <!-- 素材背景 -->
      <div v-if="isMatter">
        <div class="headShow" v-if="bgControl">
          <img :src="sucaiList"/>
        </div>
        <div class="headShow" v-else></div>
      </div>
      <lucky-assistant v-if="isMatter && flyData" :goodsGroupId="goodsGroupId" :flyData="flyData"></lucky-assistant>
    </div>
    <!--抢购列表-->
    <shopping-spree v-if="page1" :zoneId="goodsGroupId"></shopping-spree>
    <!--批发列表-->
    <wholesale-goods v-if="page2" :zoneId="goodsGroupId"></wholesale-goods>
    <!--底部切换-->
    <com-store-footer></com-store-footer>
    <!--协议弹框-->
    <x-dialog v-model="showToast" class="dialog-demo">
      <div class="mmc-mask-wrap">
        <div class="mmc-mask-title">买卖仓抢批协议</div>
        <div class="mmc-mask-scroll" v-html="shareConfigData.agreement"></div>
        <div class="mmc-mask-foot">
          <div class="no-agreement" @click="agreementNo">不同意</div>
          <div class="agreement" @click="agreementYes">同意</div>
        </div>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem, Countdown, Group, Cell, XSwitch, Popup, XDialog } from 'vux'
  import shoppingSpree from '../../components/dayTrade/shoppingSpree'
  import wholesaleGoods from '../../components/dayTrade/wholesaleGoods'
  import luckyAssistant from '../../components/dayTrade/luckyAssistant'
  import smallCircle from '../../components/dayTrade/smallCircle'
  import comStoreFooter from '../../components/dayTrade/comStoreFooter'
  export default {
    name: 'shopLuckyStrike',
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
      XDialog,
      shoppingSpree,
      wholesaleGoods,
      luckyAssistant,
      smallCircle,
      comStoreFooter
    },
    data () {
      return {
        showToast: false,
        tabList: [],                    // 头部导航切换数据接收
        tabMark: 0,                     // 头部导航默认下标
        shopBg: require('../../assets/images/my/point-bg.png'),
        leftArrow: require('../../assets/images/shopLucky01/left-arrow.png'), // 导航上面的箭头
        page1: true,                    // 我要抢购控制按钮
        page2: false,                   // 批发商品控制按钮
        activeIndex: 0,                 // 默认显示我要抢购页面
        showType: null,                 // 判断是素材还是广告位的标识
        shareConfigData: '',            // 广告位数据
        mmcData: '',
        bgControl: true,                // 素材背景图是否展示
        sucaiList: '',                  // 素材背景图路径
        isControl: true,               // 素材控制显示控制(包括广告位和宣传素材)
        isAdv: false,                  // 广告位控制
        isMatter: false,               // 宣传素材控制
        luckyId: '',                    // 区分抢购页面，批发页面的唯一标识
        flyData: '',                    // 宣传素材数据接收
        shareInvitationCode: '',        // 分享code
        goodsGroupId: ''                // 分区Id
      }
    },
    computed: {
    },
    mounted: function () {
      this.getPurchaseDes()
      this.navList()
    },
    methods: {
      /**
       * 同意买卖仓协议与不同意(这是一个类似传销的项目，玩不起)
       */
      agreementYes () {
        this.showToast = false
        localStorage.removeItem('popId')
      },
      agreementNo () {
        this.$router.go(-1)
      },
      /**
       * 获取活动商品分区列表
       * this.$router.push({path: '/shopLuckyStrike', query: {pageId: 8, shareInvitationCode: this.shareInvitationCode}})
       */
      navList () {
        this.$http.get(`${this.api.getGoodsGroupList}`, {
          params: {
            buyType: this.luckyId === 7 || this.luckyId === '' || !this.luckyId ? 1 : 2
          }
        }).then((res) => {
          if (res.data.status === '1') {
            this.tabList = res.data.data
            // console.log(this.tabList)
            this.goodsGroupId = this.tabList[0].goodsGroupId
            this.tabTap(this.tabList[0], 0)
          }
        })
      },
      /**
       * 导航切换
       */
      tabTap (item, index) {
        this.tabMark = index
        this.goodsGroupId = item.goodsGroupId
        // console.log(this.goodsGroupId)
        this.$http.get(`${this.api.getGoodsGroupDetail}`, {
          params: {
            goodsGroupId: item.goodsGroupId
          }
        }).then((res) => {
          // console.log(res)
          this.mmcData = res.data.data
          // console.log(this.mmcData)
          this.showType = this.mmcData.disseminateType
          // console.log(this.showType)
          // 1：广告位 2：宣传素材
          // this.showType === 1直接显示广告位   this.showType === 2的时候才调用素材列表的接口
          if (this.showType === 1) {
            this.isAdv = true
            this.isMatter = false
            this.isControl = true
          } else if (this.showType === 2) {
            this.isMatter = true
            this.isAdv = false
            this.$http.post(this.api.getSourceList, {id: this.mmcData.buySourceId}).then((res) => {
              // console.log(res)
              this.flyData = res.data.data
              // console.log(this.flyData)
              // localStorage.setItem('flyData', JSON.stringify(this.flyData))
              this.sucaiList = this.flyData.backgroundImg
              // console.log(this.flyData)
              // 是否展示素材背景图 1表示开启 0表示关闭
              if (this.flyData.backgroundOpen === 1) {
                this.bgControl = true
              } else {
                this.bgControl = false
              }
              // 关闭素材展示 1表示开启 0表示关闭
              if (this.flyData.sourceStatus === 1) {
                this.isControl = true
              } else {
                this.isControl = false
              }
            })
          }
        })
      },
      getPurchaseDes () {
        // 查看本地缓存
        var bannerData = localStorage.getItem('bannerData') ? localStorage.getItem('bannerData') : ''
        if (bannerData) {
          let res = JSON.parse(bannerData) || {}
          let time = new Date().getTime()
          if (!res.time) {
            // 未记录到的数据 从新刷新接口
            this.getData()
            return false
          } else if (time - res.time > 0) {
            // 超过5分钟重新重新刷新接口
            this.getData()
          } else {
            // 不刷新 用本地缓存数据
            this.resFn(res)
          }
        } else {
//          不存在 本地数据 调用接口
          this.getData()
        }
      },
      // banner接口数据请求
      getData () {
        this.$http.get(`${this.api.getPurchaseDes}`, {}).then((res) => {
          this.resFn(res)
          // 记录当前时间戳 方便计算过期时间
          res.time = new Date().getTime()
          localStorage.setItem('bannerData', JSON.stringify(res))
        })
      },
      // 数据解析
      resFn (res) {
        if (res.data.status === '1') {
          let resData = res.data.data
          this.shareConfigData = resData
          // console.log(this.shareConfigData)
          document.title = this.shareConfigData.themeName
          localStorage.setItem('pulicData', JSON.stringify(this.shareConfigData))
        }
      }
    },
    created () {
      let popId = localStorage.getItem('popId')
      if (popId === '1') {
        this.showToast = false
      }
      this.luckyId = parseInt(this.$route.query.pageId) || ''
      this.shareInvitationCode = this.$route.query.shareInvitationCode || ''
      if (this.luckyId === '') {
      }
      if (this.luckyId === 7) {
        this.page1 = true
        this.page2 = false
      } if (this.luckyId === 8) {
        this.page2 = true
        this.page1 = false
      }
    },
    beforeDestroy () {
    }
  }
</script>
<style scoped lang=less>
.buy-sell-wrap{
  background: white;
  position: relative;
  min-height: 100vh;
  padding-top: .75rem;
  .titleTab {
    display: flex;
    flex-direction:row;
    justify-content: space-between;
    width: 7.5rem;
    height: .75rem;
    overflow: hidden;
    box-shadow:0px 4px 8px #d1d1d1;
    background: #f1f1f1;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 5000;
    .titleTabBox{
      overflow-x: scroll;
      height: .75rem;
      line-height: .75rem;
      /*padding-left: .2rem;*/
      /*width: 6.5rem;*/
      &::-webkit-scrollbar {/*隐藏滚轮*/
        display: none;
      }
      .box{
        display: flex;
        flex-direction:row;
        line-height: .75rem;
        display: -webkit-box;
      }
      .box2{
        display: flex;
        flex-direction:row;
        justify-content: space-between;
        line-height: .75rem;
      }
      .item-tab{
        padding-left: .4rem;
        padding-right: .4rem;
        font-size: .28rem;
        color: #535353;
      }
      .tabMarkCss{
        color: #fd4a46;
      }
    }

    .rightNex{
      width: .75rem;
      height: .75rem;
      line-height: .75rem;
      text-align: center;
      background: white;
      box-shadow:0px 4px 8px #d1d1d1;
      img{
        width: 0.2rem;
        height: 0.35rem;
        vertical-align: middle;
      }
    }
  }

  /*头部图片*/
  .headShow{
    width: 7.5rem;
    /*height: 8.24rem;*/
    /*overflow: hidden;*/
    img{
      display: block;
      width: 100%;
    }
  }

  /*导航*/
  .nav-cover{
    width: 7.1rem;
    margin: 0 0.2rem;
    position: absolute;
    top: 6rem;
    .nav-title{
      width: 6.9rem;
      height: 0.5rem;
      line-height: 0.5rem;
      color: #fff;
      border-bottom: 1px solid #fff;
      margin: 0 0.1rem;
      font-size: 0.25rem;
      b{
        font-weight: 600;
      }
      span{
        font-size: 0.17rem;
      }
    }
    ul{
      display: flex;
      justify-content: space-around;
      margin-top: 0.34rem;
      li{
        width: 32%;
        height: 0.66rem;
        border: 1px solid #fff;
        border-radius: 0.1rem;
        background: #890c0f;
        color: #fff;
        display: flex;
        align-items: center;
        .li-lef{
          margin-left: 0.07rem;
          img{
            width: 0.37rem;
            height: 0.35rem;
          }
        }
        .li-rig{
          margin-left: 0.09rem;
          color: #fff;
          p:first-child{
            font-size: 0.2rem;
          }
          p:nth-of-type(2){
            font-size: 0.15rem;
          }
        }
      }
    }
  }

  /*tab切换*/
  #pageLuckyTab{
    position: relative;
    ul{
      display: flex;
      justify-content: space-between;
      li:first-child{
        width: 3.6rem;
        height: 1.35rem;
        line-height: 1.35rem;
        text-align: center;
        position: relative;
        top: -0.12rem;
        img{
          width: 100%;
          height: 100%;
        }
      }
      li:nth-of-type(2){
        width: 3.6rem;
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: center;
        position: relative;
        top: 0.18rem;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .circle-left{
      position: absolute;
      left: 0.5rem;
      top: 0.1rem;
      z-index: 1;
    }
    .circle-right{
      position: absolute;
      right: 3.7rem;
      top: 0.1rem;
      z-index: 1;
    }
  }
  .active{
    color: orange;
  }
}
</style>
<style lang="less">
  .djs{
    /*background: #fc4a3c;*/
    /*color: #fff;*/
    padding: 0.12rem 0.05rem;
     -webkit-border-radius: 0.1rem;
     -moz-border-radius: 0.1rem;
    border-radius: 0.1rem;
    margin: 0 0.05rem;
  }
  .mmc-mask-wrap{
    padding: 0 0.2rem;
    .mmc-mask-title{
      font-size: 0.3rem;
      color: #fd4245;
      margin: 0.25rem 0;
      font-weight: 800;
    }
    .mmc-mask-scroll{
      max-height: 5.4rem;
      overflow-y: scroll;
      background: #f7f7f7;
      overflow-x: hidden;
      p{
        img{
          width: 100%;
        }
      }
    }
    .mmc-mask-foot{
      display: flex;
      margin: 0.25rem 0 0.15rem 0;
      justify-content: space-around;
      .agreement{
        width: 1.9rem;
        height: 0.6rem;
        line-height: 0.6rem;
        background: #fd4245;
        -webkit-border-radius: 0.8rem;
        -moz-border-radius: 0.8rem;
        border-radius: 0.8rem;
        border: 1px solid #fd4245;
        color: #fff;
      }
      .no-agreement{
        width: 1.9rem;
        height: 0.6rem;
        line-height: 0.6rem;
        background: #fff;
        -webkit-border-radius: 0.8rem;
        -moz-border-radius: 0.8rem;
        border-radius: 0.8rem;
        border: 1px solid #fd4245;
        color: #fd4245;
      }
    }
  }
  .weui-dialog{
    -webkit-border-radius: 0.2rem;
    -moz-border-radius: 0.2rem;
    border-radius: 0.2rem;
  }
</style>
