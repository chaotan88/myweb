<template>
  <div class="ticketsOrder-wrap">
    <!-- 基本信息 -->
    <!-- <div class="ticketsOrder-base">
      <div class="base-mes">
        <p>{{orderData.meetingName}}</p>
        <p>时间：{{orderData.beginTime | formatDate(0)}}至{{orderData.endTime | formatDate(0)}}</p>
        <p>地址：{{orderData.address}}</p>
      </div>
      <div class="base-img">
        <img :src="orderData.mainImage | filterImgUrl">
      </div>
    </div>
    <div class="dotted-line"></div> -->
    <!-- 入场票 -->
    <div class="admission-ticket">
      <div class="admission-ticket-title">
        <p>入场票</p>
        <!-- <p>赠送给好友</p> -->
      </div>
      <swiper :options="swiperOption" class="admission-ticket-list">
        <swiper-slide v-for="(item,index) in orderData.ticketNoList" class="ticket-slide" :key="index">
          <img :src="orderData.ticketMainImage | filterImgUrl">
        </swiper-slide>
      </swiper>
      <!-- <div class="admission-ticket-num">
        <template v-if="orderData.ticketNoList">
          {{orderData.ticketNoList.length}}张入场票
        </template>
      </div> -->
      <div class="admission-ticket-vouchernum">
        <template v-if="orderData.ticketNoList">
          入场码：{{orderData.ticketNoList[activeIndex]}}
        </template>
      </div>
      <div class="admission-ticket-mes">
        <h2>{{orderData.meetingName}}</h2>
        <ul>
          <li v-if="!ticketNo">订单编号：{{orderData.orderNo}}</li>
          <li v-if="!ticketNo">购票时间：{{orderData.orderTime | formatDate(1)}}</li>
          <li>会议时间：{{orderData.beginTime | formatDate(1)}} 至 {{orderData.endTime | formatDate(1)}}</li>
          <li v-if="!ticketNo">订单金额：{{orderData.totalAmount}}元</li>
        </ul>
      </div>
    </div>
    <div class="dotted-line"></div>
    <!-- 地址 -->
    <div class="admission-add">
      <div class="add-con">
        <div class="add-con-l">
          <!-- <p>{{orderData.province}} {{orderData.city}} {{orderData.zone}}</p> -->
          <p>{{orderData.province}}{{orderData.city}}{{orderData.zone}}{{orderData.address}}</p>
        </div>
        <div class="add-con-r">
          <a :href="'tel:' + orderData.servicePhone">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dianhua"></use>
            </svg>
          </a>
        </div>
      </div>
      <!-- 地图 -->
      <baidu-map class="ticketsDetail-map" @click="openMap" :center="mapCenter" :zoom="15" ak="xOEq2wUHZjsgNQzZIw4FxDRBmMr88Luu">
        <bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
      </baidu-map>
      <div class="conference-note">
        <p>会议说明</p>
        <p v-html="orderData.description"></p>
      </div>
    </div>
  </div>
</template>
<script>
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import swipcss from 'swiper/dist/css/swiper.css'
export default {
  components: {
    swiper,
    swiperSlide,
    swipcss
  },
  data () {
    return {
      activeIndex: 0,
      orderData: {},            // 订单详情数据
      mapCenter: {
        lng: '',
        lat: ''
      },
      ticketNo: '',
      swiperOption: {
        slidesPerView: 'auto',
        paginationClickable: true,
        spaceBetween: 25,
        centeredSlides: true,
        watchSlidesProgress: true,
        onInit: (swiper) => {
          this.activeIndex = swiper.activeIndex
        },
        onTransitionEnd: (swiper) => {
          this.activeIndex = swiper.activeIndex
        }
      }
    }
  },
  mounted: function () {
    this.ticketNo = this.$route.query.ticketNo        // 票号
    if (this.ticketNo) {
      this.getMetOrderDetailByTicketNo()                // 根据票号获取会议订单详情
    } else {
      this.getMeetingOrderDetail()                      // 根据订单id获取会议订单详情
    }
  },
  methods: {
    /**
     * 根据票号获取会议订单详情
    */
    getMetOrderDetailByTicketNo () {
      this.$http.get(this.api.getMetOrderDetailByTicketNo, {
        params: {
          ticketNo: this.ticketNo
        }
      }).then((res) => {
        let resData = res.data
        if (resData.status !== this.api.ERR_OK || !res) return false
        this.orderData = resData.data
        this.$nextTick(() => {
          setTimeout(() => {
            this.mapCenter = {
              lng: this.orderData.longitude,
              lat: this.orderData.latitude
            }
          }, 100)
        })
      })
    },
    /**
     * 获取订单详情
    */
    getMeetingOrderDetail () {
      this.$http.get(this.api.getMeetingOrderDetail, {
        params: {
          orderId: this.$route.query.orderId
        }
      }).then((res) => {
        let resData = res.data
        // console.log(resData)
        if (resData.status !== this.api.ERR_OK || !res) return false
        this.orderData = resData.data
        this.$nextTick(() => {
          setTimeout(() => {
            this.mapCenter = {
              lng: this.orderData.longitude,
              lat: this.orderData.latitude
            }
          }, 100)
        })
      })
    },
    /**
     * 打开地图
    */
    openMap () {
      // window.location.href = 'http://api.map.baidu.com/geocoder?location=39.990912172420714,116.32715863448607&coord_type=gcj02&output=html&src=webapp.baidu.openAPIdemo'
      window.location.href = 'http://api.map.baidu.com/geocoder?location=' + this.orderData.latitude + ',' + this.orderData.longitude + '&coord_type=gcj02&output=html&src=webapp.baidu.openAPIdemo'
    }
  }
}
</script>
<style lang=less>
  .ticketsOrder-wrap{
    min-height: calc(100vh);
    background: -webkit-linear-gradient(top, #ccab6f 35%, #c5a05e);
    overflow-y: scroll;
    padding: .25rem;
    /* 基本信息 */
    .ticketsOrder-base{
      display: flex;
      background: #fff;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      padding: .45rem .26rem;
      margin-top: .2rem;
      position: relative;
      &::before{
        content: '';
        width: .28rem;
        height: .28rem;
        display: block;
        position: absolute;
        bottom: 0;
        border-radius: 50%;
        left: -0.14rem;
        bottom: -0.14rem;
        background: #cbaa72;
        z-index: 300;
      }
      &::after{
        content: '';
        width: .28rem;
        height: .28rem;
        display: block;
        position: absolute;
        bottom: 0;
        border-radius: 50%;
        right: -0.14rem;
        bottom: -0.14rem;
        background: #cbaa72;
        z-index: 300;
      }
      .base-mes{
        flex: 1;
        margin-right: .45rem;
        p:nth-child(1){
          color: #333333;
          display: -webkit-box;
          display: -moz-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        p:nth-child(2){
          margin-top: .15rem;
          margin-bottom: .06rem;
        }
        p:nth-child(2),p:nth-child(3){
          color: #808080;
          font-size: .24rem;
          display: -webkit-box;
          display: -moz-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
      .base-img{
        width: 2.16rem;
        height: 1.61rem;
        img{
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }
    }
    /* 分割线 */
    .dotted-line{
      height: 1px;
      background: #fff;
      &::after{
        display: block;
        content: '';
        width: 6.34rem;
        border: 1px dashed #eee;
        margin: 0 auto;
      }
    }
    /* 入场票 */
    .admission-ticket{
      background: #fff;
      padding: .55rem 0;
      position: relative;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      &::before{
        content: '';
        width: .28rem;
        height: .28rem;
        display: block;
        position: absolute;
        bottom: 0;
        border-radius: 50%;
        left: -0.14rem;
        bottom: -0.14rem;
        background: #cbaa72;
        z-index: 300;
      }
      &::after{
        content: '';
        width: .28rem;
        height: .28rem;
        display: block;
        position: absolute;
        bottom: 0;
        border-radius: 50%;
        right: -0.14rem;
        bottom: -0.14rem;
        background: #cbaa72;
        z-index: 300;
      }
      .admission-ticket-title{
        display: flex;
        padding: 0 .26rem;
        p:nth-child(1){
          color: #3a3a3a;
          flex: 1;
        }
        p:nth-child(2){
          color: #c19c59;
          font-size: .26rem;                    
        }
      }
      .admission-ticket-list{
        height: 2.2rem;
        /* padding-left: .69rem; */
        margin-top: .35rem;
        .ticket-slide{
          width: 5.5rem;
          img{
            width: 5.5rem;
            height: 2.2rem;
            border-radius: 5px;
          }
        }
      }
      .admission-ticket-num{
        text-align: center;
        color: #c8c8c8;
        font-size: .28rem;
        margin: .36rem 0;
      }
      .admission-ticket-vouchernum{
        width: 5.84rem;
        height: .99rem;
        border-radius: 5px;
        background: #c5a05e;
        color: #fff;
        text-align: center;
        line-height: .99rem;
        margin: 0 auto;
        margin-top: .4rem;
        overflow: hidden;
        text-overflow: ellipsis;
        /* white-space: nowrap; */
        word-break: break-all;
        padding: 0 .2rem;
        box-sizing: border-box;
      }
      .admission-ticket-mes{
        padding: 0 .26rem;
        margin-top: .5rem;
        h2{
          color: #333333;
          display: -webkit-box;
          display: -moz-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        ul{
          li{
            font-size: .24rem;
            color: #808080;
            margin-top: .23rem;
          }
        }
      }
    } 
    /* 地址 */
    .admission-add{
      background: #fff;
      padding: .55rem .26rem;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      .add-con{
        display: flex;
        align-items: center;
        border-bottom: 1px dashed #eee;
        padding-bottom: .33rem;
        .add-con-l{
          flex: 1;
          p:nth-child(1){
            color: #3a3a3a;
            /* margin-bottom: .4rem; */
          }
          p:nth-child(2){
            color: #808080;
            font-size: .24rem;            
          }
        }
        .add-con-r{
          svg{
            width: .8rem;
            height: .5rem;
            fill: #c8c8c8;
            transform: rotate(-10deg);
            -webkit-transform: rotate(-10deg);
          }
        }
      }
      /* 地图 */
      .ticketsDetail-map{
        height: 3.35rem;
        /* background: #ccc; */
        margin: 0 auto;
        margin-top: .37rem;
        border-bottom: 1px dashed #eee;
        padding-bottom: .4rem;
      }
      .conference-note{
        word-break: break-all;
        img{
          width: 100%;
        }
        p:nth-child(1){
          color: #3a3a3a;
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          margin-top: .4rem;
          margin-bottom: .28rem;
        }
        p:nth-child(2){
          color: #808080;
          font-size: .24rem;
          text-indent: 2em;
        }
      }
    }
  }
</style>