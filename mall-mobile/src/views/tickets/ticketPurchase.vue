<template>
  <div class="ticketPurchase-wrap" :class="tabIndex === 1 ? 'redBg' : 'yellowBg'">
    <div class="ticketPurchase-tab" :class="tabIndex === 1 ? 'redBg' : 'yellowBg'">
      <ul>
        <li @click="tabTap(1)" :class="tabIndex === 1 ? 'active': ''">我要购票</li>
        <li  @click="tabTap(2)" :class="tabIndex === 2 ? 'active': ''">我的门票</li>
      </ul>
    </div>
    <div class="ticketPurchase-tab-h"></div>
    <!-- 门票内容 -->
    <div class="ticketPurchase-con">
      <swiper :options="swiperOption" ref="swipes">
        <swiper-slide v-for="(item,index) in ticketList" class="ticketPurchase-option" :key="index">
          <div  @click="goDetail(item)">
            <div class="ticketPurchase-option-base">
              <img :src="item.mainImage | filterImgUrl">
              <div class="ticketPurchase-option-base-title">{{item.meetingName}}</div>
              <div class="ticketPurchase-option-base-address">{{item.province}}{{item.city}}{{item.zone}}{{item.address}}</div>
              <div class="ticketPurchase-option-icon ticketPurchase-option-licon" :class="tabIndex === 1 ? 'redBg' : 'yellowBg'"></div>
              <div class="ticketPurchase-option-icon ticketPurchase-option-ricon" :class="tabIndex === 1 ? 'redBg' : 'yellowBg'"></div>
            </div>
            <div class="ticketPurchase-option-bot">
              <ul v-if="tabIndex==1">
                <li>
                  <p>会议时间：{{item.meetingDate}}</p>
                </li>
                <li>
                  <p>购票赠送：{{item.getPointNum}}个{{item.getPointType | propertyTypeFilter}}</p>
                  <p><i>¥</i>{{item.ticketPrice}}</p>
                </li>
                <li>
                  <p>数量：{{item.ticketNum}}张</p>
                </li>
              </ul>
               <ul v-else>
                <li>
                  <p>购票时间：{{item.orderTime | formatDate(1)}}</p>
                </li>
                <li>
                  <p>会议时间：{{item.beginTime | formatDate(1)}}</p>
                  <p><i>x</i>{{item.ticketNum}}</p>
                </li>
                <li>
                  <p>订单编号：{{item.orderNo}}</p>
                </li>
              </ul>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 暂无数据 -->
    <!-- <no-data v-if="noDataSte"></no-data> -->
    <div class="pageNumber" v-if="!noDataSte && ticketList.length > 0">
      <span>{{swiperIndex}}</span>
      <span>/</span>
      <span>{{ticketList.length}}</span>
      <div class="bg-num-wrap">
        <strong>{{swiperIndex}}</strong>
      </div>
    </div>
    <!-- 背景 -->
    <!-- <img src="../../assets/images/tickets-bg.png" class="tickets-bg" v-if="ticketList.length"> -->

    <div class="no-data-wrap" v-if="!ticketList.length">
      <div class="icon">
        <img src="../../assets/images/setmeal/no-ticket-icon.png">
      </div>
      <p>{{tabIndex === 1 ? '暂无会议' : '请前往购票'}}</p>
    </div>
  </div>
</template>
<script>
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import noData from '../../components/noData'    // 暂无数据
import swipcss from 'swiper/dist/css/swiper.css'
export default {
  components: {
    swiper,
    swiperSlide,
    swipcss,
    noData
  },
  data () {
    return {
      noDataSte: false,
      tabIndex: 1,
      swiperIndex: 0,
      ticketList: [],             // 会议列表
      swiperOption: {
        slidesPerView: 'auto',
        centeredSlides: true,
        watchSlidesProgress: true,
        paginationClickable: true,
        initialSlide: 0, // 默认从第几个显示
        loop: false,
        onProgress: function (swiper, progress) {
          for (var i = 0; i < swiper.slides.length; i++) {
            var slide = swiper.slides[i]
            var aProgress = slide.progress
            var es = slide.style
            es.opacity = 1 - Math.min(Math.abs(aProgress / 2), 1)
            // es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0px,0,' + (-Math.abs(aProgress * 150)) + 'px)'
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'scale(0.9)'
          }
        },
        onSetTransition: function (swiper, speed) {
          for (var i = 0; i < swiper.slides.length; i++) {
            var es = swiper.slides[i].style
            es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms'
          }
        },
        onInit: (swiper) => {
          this.swiperIndex = swiper.activeIndex + 1
        },
        // onSlideChangeEnd: (swiper) => {
        //   this.swiperIndex = swiper.activeIndex + 1
        // },
        onTransitionEnd: (swiper) => {
          this.swiperIndex = swiper.activeIndex + 1
        },
        onAfterResize: (swiper) => {
          this.swiper.update()
        }
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.swipes.swiper
    }
  },
  mounted: function () {
    var ticketTabSte = parseInt(localStorage.getItem('ticketTabSte'))
    this.tabIndex = ticketTabSte || 1
    this.getTicketList()
  },
  methods: {
    /**
     * tab点击
    */
    tabTap (type) {
      this.tabIndex = type
      localStorage.setItem('ticketTabSte', type)
      this.getTicketList()
    },
    /**
     * 获取会议列表
    */
    getTicketList () {
      this.$vux.loading.show({
        text: '数据加载中'
      })
      var resUrl = ''
      this.ticketList = []
      if (this.tabIndex === 1) {
        resUrl = this.api.getMeetingList
      } else {
        resUrl = this.api.getTicketOrderList
      }
      this.$http.get(resUrl, {
      }).then((res) => {
        let resData = res.data
        if (resData.status !== this.api.ERR_OK || !res) return false
        this.ticketList = resData.data
        this.noDataSte = resData.data.length > 0 ? !!false : !!true
        this.$nextTick(() => {
          if (this.ticketList.length > 0) {
            this.swiper.update()
            this.swiper.slideTo(0, 1, false)
            this.swiperIndex = 1
          }
        })
      }).finally(() => {
        this.$vux.loading.hide()
      })
    },
    /**
     * 跳入详情页
    */
    goDetail (v) {
      if (this.tabIndex === 1) {
        this.$router.push({path: '/ticketsDetail', query: { meetinId: v.id }})
      } else {
        this.$router.push({path: '/ticketsOrder', query: { orderId: v.id }})
      }
    }
  }
}
</script>

<style lang=less>
  .ticketPurchase-wrap{
    overflow: hidden;
    height: calc(100vh);
    overflow-y: scroll;

    .noDataTip{
      color: #fff;
    }
    &.redBg, .redBg{
      background: -webkit-linear-gradient(top, #ff8889 35%, #f87574);
    }

    &.yellowBg, .yellowBg{
      background: -webkit-linear-gradient(top, #c6a464 35%, #b99552);
    }

    .ticketPurchase-tab-h{
      height: .7rem;
    }
    .ticketPurchase-tab{
      width: 7.5rem;
      height: .7rem;
      position: fixed;
      top:0;
      left: 0;
      right: 0;
      z-index: 10;
      margin:  auto;
      border-bottom: .02rem solid #eeeeee;
      ul{
        height: 100%;
        display: flex;
        align-items: center;
        li{
          height: 100%;
          line-height: .7rem;
          flex:1;
          text-align: center;
          color: #fff;
          position: relative;
          &.active{
            &::after{
              content: '';
              width: .4rem;
              height: .03rem;
              background: #fff;
              display: block;
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
            }
          }
        }
      }
    }
    /* 门票列表 */
    .swiper-container{
      overflow: initial;
      .swiper-wrapper{
        -webkit-perspective: 7.5rem;
      }
    }
    .ticketPurchase-con{
      margin-top: 2rem;
      .ticketPurchase-option{
          -webkit-perspective: 1200px;
          -moz-perspective: 1200px;
          -ms-perspective: 1200px;
          perspective: 1200px;
        width: 5.62rem !important;
        box-sizing: border-box;
        /* transition: all 0.2s; */
        transform: scale(0.9) !important;
        transition-duration: 300ms !important;
        &.swiper-slide-active{
          transform: scale(1) !important;
        }
        .ticketPurchase-option-base{
          background: #fff;
          padding: 0 .3rem;
          position: relative;
          padding-bottom: .55rem;
          min-height: 4.5rem;
          .ticketPurchase-option-icon{
            &.redBg{
              background: #f97a7e;
            }
            &.yellowBg{
              background: #c09c59;
            }
          }
          .ticketPurchase-option-licon{
            width: .28rem;
            height: .28rem;
            display: block;
            position: absolute;
            bottom: 0;
            border-radius: 50%;
            left: -.14rem;
            bottom: -.14rem;
          }
          .ticketPurchase-option-ricon{
            width: .28rem;
            height: .28rem;
            display: block;
            position: absolute;
            bottom: 0;
            border-radius: 50%;
            right: -.14rem;
            bottom: -.14rem;
          }
          img{
            width: 5.04rem;
            height: 3.24rem;
            margin-top: -.93rem;
            display: inline-block;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            margin-bottom: .6rem;
            box-shadow: 0 0 50px 0 hsla(0,6%,58%,0.7);
            -webkit-box-shadow: 0 0 50px 0 hsla(0,6%,58%,0.7);
          }
          .ticketPurchase-option-base-title{
            color: #414040;
            font-size: .28rem;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .ticketPurchase-option-base-address{
            font-size: .26rem;
            color: #a9a9a9;
            margin-top: .4rem;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .ticketPurchase-option-base-time{
            color: #a9a9a9;
            font-size: .24rem;
            margin: .08rem 0;
          }
          .ticketPurchase-option-base-price{
            display: flex;
            align-items: center;
            p:nth-child(1){
              color: #a9a9a9;
              font-size: .24rem;
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            p:nth-child(2){
              color: #f23030;
              font-size: .4rem;
              i{
                font-size: .24rem;
              }
            }
          }
        }
      }
    }
    .ticketPurchase-option-bot{
      padding: .6rem .3rem;
      min-height: 1.2rem;
      background: #efefee;
      ul{
        li{
          display: flex;
          font-size: .26rem;
          color: #6d6d6d;
          align-items: center;
          margin: .1rem 0;
          p:nth-child(1){
            flex: 1;
          }
          p:nth-child(2){
            color: #f23030;
            font-size: .4rem;
            i{
              font-size: .26rem;
            }
          }
        }
      }
    }
    .pageNumber{
      text-align: center;
      display: flex;
      justify-content: center;
      margin-top: .9rem;
      margin-bottom: .2rem;
      position: relative;

      span{
        display: block;
        z-index: 2;
      }
      span:nth-child(1){
        font-size: .7rem;
        color: #fff;
        margin-top: -.34rem;
      }
      span:nth-child(2){
        font-size: .8rem;
        color: rgba(255,255,255,0.4);
      }
      span:nth-child(3){
        font-size: .52rem;
        color: rgba(255,255,255,0.4);
        margin-top: .34rem;
      }
    }

    .bg-num-wrap{
      height: 1.8rem;
      overflow: hidden;
      position: absolute;
      top: -20px;
      z-index: 1;

      strong{
        color: rgba(255, 255, 255, .1);
        line-height: 3.2rem;
        font-size: 4rem;
        font-family: 'Arial';
      }
    }

    .tickets-bg{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 1.71rem;
      height: 1.85rem;
    }

    .no-data-wrap{
      width: 100%;
      height: 1rem;
      margin-top: -0.5rem;
      position: absolute;
      left: 0;
      top: 50%;
      z-index: 99;

      .icon{
        height: .4rem;
        text-align: center;
        margin-bottom: .2rem;
      }

      img{
        height: 100%;
      }

      p{
        font-size: .3rem;
        text-align: center;
        color: rgba(255, 255, 255, .25);
      }
    }
  }
</style>
