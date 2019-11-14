<template>
  <div class="ticketsDetail-wrap">
    <!-- 基本信息 -->
    <div class="ticketsDetail-base">
      <div class="base-img">
        <img :src="detailData.mainImage | filterImgUrl">
      </div>
      <div class="base-title">{{detailData.meetingName}}</div>
      <div class="base-price">
        <div class="base-price-pre"><i>¥</i>{{detailData.ticketPrice}}<span>赠送：{{detailData.getPointNum}}个{{detailData.getPointType | propertyTypeFilter}}</span></div>
        <div class="base-price-contorl">
          <div @click="changeNum(1)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jian"></use>
            </svg>
          </div>
          <div>
            <input type="number" v-model="buyNum" min="1" @input="handleInput($event)">
          </div>
          <div @click="changeNum(2)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jiahaob"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="ticketsDetail-con">
      <ul>
        <li>
          <div>
            <p>会议时间：{{detailData.beginTime | formatDate(1)}} 至 {{detailData.endTime | formatDate(1)}}</p>
          </div>
        </li>
        <li>
          <div>
            <p>剩余数量：{{detailData.ticketNum}}张</p>
          </div>
        </li>
        <li>
          <div>
            <p>售票时间：{{detailData.saleTicketBeginTime | formatDate(1)}} 至 {{detailData.saleTicketEndTime | formatDate(1)}}</p>
          </div>
        </li>
        <li>
          <div>
            <p>会议地点：{{detailData.province}}{{detailData.city}}{{detailData.zone}}{{detailData.address}}</p>
          </div>
          <div class="phone-icon">
            <a :href="'tel:' + detailData.servicePhone">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dianhua"></use>
              </svg>
            </a>
          </div>
        </li>
      </ul>
    </div>
    <!-- 地图 -->
    <baidu-map class="ticketsDetail-map" @click="openMap" :center="mapCenter" :zoom="15">
      <bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
      </bm-marker>
    </baidu-map>
    <!-- 会议说明 -->
    <div class="conference-note">
      <div class="conference-note-title">会议说明</div>
      <div class="conference-note-txt" v-html="detailData.description"></div>
    </div>
    <!-- 按钮 -->
    <div class="buy-hei"></div>
    <div class="buy-btn buy-btn-notap" v-if="detailData.ticketNum <= 0">余票不足</div>
    <div class="buy-btn" @click="submitOrder" v-else>立即购买</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      mapCenter: {
        lng: '',
        lat: ''
      },                            // 地图数据
      buyNum: 1,                    // 购买的数量
      detailData: {}                // 详情数据
    }
  },
  mounted: function () {
    this.getMeetingDetail()
  },
  methods: {
    /**
     * 会议详情
    */
    getMeetingDetail () {
      this.$http.get(this.api.getMeetingDetail, {
        params: {
          meetingId: this.$route.query.meetinId
        }
      }).then((res) => {
        let resData = res.data
        // console.log(resData)
        if (resData.status !== this.api.ERR_OK || !res) return false
        this.detailData = resData.data
        setTimeout(() => {
          this.mapCenter = {
            lng: this.detailData.longitude,
            lat: this.detailData.latitude
          }
        }, 100)
      })
    },
    /**
     * 修改购买数量
     * @typ 1减少 2增加
    */
    changeNum (type) {
      if (type === 1) {
        if (this.buyNum > 1) {
          this.buyNum--
        }
      } else {
        if (this.buyNum >= this.detailData.ticketNum) {
          this.$vux.toast.text('超出最大购买数量')
        } else {
          this.buyNum++
        }
      }
    },
    /**
     * 输入框键盘按下
    */
    handleInput (e) {
      var value = event.target.value
      if (value > this.detailData.ticketNum) {
        this.buyNum = this.detailData.ticketNum
        this.$vux.toast.text('超出最大购买数量')
      }
    },
    /**
     * 立即购买
    */
    submitOrder () {
      this.$vux.loading.show({
        text: '订单提交中'
      })
      this.$http.post(this.api.addTicketsOrder, {
        meetingId: this.$route.query.meetinId,
        ticketNum: this.buyNum
      }).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          localStorage.setItem('payOrderNo', resData.data.orderNo)
          localStorage.setItem('orderType', 1)
          // this.routerReplace({path: '/pay/orderPay', query: {redirect: 'gopay', payTyps: 'ticket', buyType: 2}})
          window.location.replace(window.location.href.match(/.*mshop/gi)[0] + '/pay/orderPay?redirect=gopay&payTyps=ticket&buyType=2&shopId=1')
        } else {
          this.$vux.toast.text(resData.msg)
        }
      }).finally(() => {
        this.$vux.loading.hide()
      })
    },
    /**
     * 打开地图
    */
    openMap () {
      window.location.href = 'http://api.map.baidu.com/geocoder?location=' + this.detailData.latitude + ',' + this.detailData.longitude + '&coord_type=gcj02&output=html&src=webapp.baidu.openAPIdemo'
    }
  }
}
</script>
<style lang=less>
  .ticketsDetail-wrap{
    /* 基本信息 */
    .ticketsDetail-base{
      /* margin-top: .5rem; */
      border-bottom: .14rem solid #f4f4f4;
      padding: 0 .3rem;
      padding-bottom: .2rem;
      .base-img{
        width: 6.94rem;
        height: 3.22rem;
        box-shadow: 0 0 30px 0 hsla(0,6%,58%,0.3);
        -webkit-box-shadow: 0 0 30px 0 hsla(0,6%,58%,0.3);
        img{
          width: 100%;
          height: 100%;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }
      }
      .base-title{
        color: #414040;
        font-size: .28rem;
        display: -webkit-box;
        display: -moz-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        margin: .3rem 0;
      }
      .base-price{
        display: flex;
        align-items: center;
        .base-price-pre{
          color: #f23030;
          font-size: .4rem;
          flex:1;
          i{
            font-size: .24rem;
          }
          span{
            font-size: .24rem;
            color: #898989;
            margin-left: .15rem;
          }
        }
        .base-price-contorl{
          display: flex;
          width: 1.4rem;
          height: .34rem;
          border: 1px solid #d1d1d1;
          div{
            text-align: center;
            width: .3rem;
            height: .34rem;
            background: #f4f4f4;
            svg{
              width: .25rem;
              height: .34rem;
              display: block;
              margin: 0 auto;
            }
          }
          div:nth-child(1){
            border-right: 1px solid #d1d1d1;
          }
          div:nth-child(3){
            border-left: 1px solid #d1d1d1;
          }
          div:nth-child(2){
            background: none;
            flex: 1;
            input{
              display: block;
              width: 100%;
              height: 100%;
              outline: none;
              text-align: center;
              font-size: .28rem;
              &::-webkit-inner-spin-button {
                -webkit-appearance: none !important;
                margin: 0;
              }
            }
          }
        }
      }
    }
    /* 内容 */
    .ticketsDetail-con{
      ul{
        li{
          display: flex;
          align-items: center;
          padding: .21rem 0;
          margin: 0 .3rem;
          border-bottom: 1px solid #dfdfdf;
          font-size: .26rem;
          color: #565656;
          &:last-child{
            border-bottom: 1px dashed #dfdfdf;
          }
          &::before{
            content: '';
            width: .06rem;
            height: .28rem;
            display: block;
            background: #ff3131;
            margin-right: .17rem;
          }
          div:nth-child(1){
            flex: 1;
            p:nth-child(2){
              color: #808080;
              font-size: .24rem;
              margin-top: .05rem;
            }
          }
          .phone-icon{
            svg{
              width: .8rem;
              height: .5rem;
              fill: #c8c8c8;
              transform: rotate(-10deg);
              -webkit-transform: rotate(-10deg);
            }
          }
        }
      }
    }
    /* 地图 */
    .ticketsDetail-map{
      width: 6.94rem;
      height: 3.35rem;
      background: #ccc;
      margin: 0 auto;
      margin-top: .37rem;
    }
    /* 会议说明 */
    .conference-note{
      padding: .2rem .3rem;
      .conference-note-title{
        display: flex;
        color: #3a3a3a;
        font-size: .28rem;
        &::before{
          content: '';
          width: .06rem;
          height: .28rem;
          display: block;
          background: #ff3131;
          margin-right: .17rem;
        }
      }
      .conference-note-txt{
        overflow-x: hidden;
        color: #808080;
        font-size: .24rem;
        margin-top: .25rem;
        text-indent: 2em;
        word-break: break-all;
        img{
          width: 100%;
          vertical-align: top;
        }
      }
    }
    /* 立即购买 */
    .buy-hei{
      height: .93rem;
    }
    .buy-btn{
      width: 7.5rem;
      height: .93rem;
      background: #ff6f70;
      text-align: center;
      line-height: .93rem;
      color: #fff;
      font-size: .28rem;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      &.buy-btn-notap{
        background: #ccc;
      }
    }
  }
</style>