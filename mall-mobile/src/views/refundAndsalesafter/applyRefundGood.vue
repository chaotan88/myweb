<template>
  <div class="applyRefundMoney" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="1" infinite-scroll-immediate-check="false">
    <!--内容-->
    <ol class="content-wrap" v-for="(v,index) in orderList">
      <li class="content-li">
        <!--订单编号-->
        <ul class="orderNo clr">
          <li class="left">服务单号：{{ v.orderNo }}</li>
          <li class="right">退款</li>
        </ul>
        <!--列表-->
        <div class="content-box">
          <div class="content-food">
            <div class="icon">
              <img :src="v.goodsImage | filterImgUrl">
            </div>
            <div class="text">
              <h2 class="infor">{{ v.goodsName }}</h2>
              <div class="attribute">{{ v.goodsAttribute }}</div>
              <p class="priceNum">
                <span class="price">价格：¥{{ v.goodsPrice | moneyFilter }}</span>
                <span class="count">数量：{{ v.goodsNum }}</span>
              </p>
            </div>
          </div>
        </div>
        <!--订单状态 1退款中 2已退款 3撤销退款申请-->
        <ul v-if="v.refundStatus==1" class="orderStatus" @click="goRefundDetailPage(v)">
          <li class="left">
            <icon type="waiting-circle"></icon>
            <b>退款中</b>
            <span>|</span>
          </li>
          <li class="center">您的服务正在处理中，请耐心等待</li>
          <li class="right"><x-icon type="ios-arrow-right" size="20"></x-icon></li>
        </ul>
        <ul v-if="v.refundStatus==2" class="orderStatus" @click="goRefundDetailPage(v)">
          <li class="left">
            <icon type="success-circle"></icon>
            <b>已退款</b>
            <span>|</span>
          </li>
          <li class="center">您的服务单已退款，请您注意查收</li>
          <li class="right"><x-icon type="ios-arrow-right" size="20"></x-icon></li>
        </ul>
        <ul v-if="v.refundStatus==3" class="orderStatus" @click="goRefundDetailPage(v)">
          <li class="left">
            <icon type="info-circle"></icon>
            <b>撤回申请</b>
            <span>|</span>
          </li>
          <li class="center">您已经撤回了退款申请，请您注意查收</li>
          <li class="right"><x-icon type="ios-arrow-right" size="20"></x-icon></li>
        </ul>
        <!--按钮-->
        <ul class="btn clr">
          <li v-if="v.refundStatus==1" class="pay" @click="revokeRefundPop(v)">撤销申请</li>
        </ul>
      </li>
    </ol>
    <load-more :tip="loadingTitle" v-if="showLoading"></load-more>
    <!--没有数据-->
    <div v-if="noData" class="noData">没有数据</div>
  </div>
</template>

<script>
  import { Icon, Confirm, TransferDomDirective as TransferDom, LoadMore } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Confirm,
      Icon,
      LoadMore
    },
    data () {
      return {
        loadingTitle: '数据加载中',
        showLoading: false,                // 是否显示加载loading
        busy: false,
        orderList: [],                    // 列表
        noData: false,                    // 是否有数据
        start: 1,                        // 当前页
        pageSize: 10                     // 每页显示几条
      }
    },
    mounted: function () {
      this.$vux.loading.show({
        text: '数据加载中'
      })
      this.getRefundOrderList()
    },
    methods: {
      /**
       * 获取退款记录数据
      */
      getRefundOrderList () {
        this.$http.post(`${this.api.getRefundOrderList}`, {
          start: this.start,
          pageSize: this.pageSize
        }).then((res) => {
          this.busy = false // 重置busy状态
          this.$vux.loading.hide()
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          this.orderList = this.orderList.concat(res.data.data.list)
          this.noData = res.data.data.list.length > 0 ? 0 : 1
          this.start = this.start + 1 // 当前页数
          this.totalPage = res.data.data.pages // 总页数
        })
      },
      /**
       * 分页
      */
      loadMore () {
        this.busy = true // 加载状态
        this.showLoading = true
        if (this.start > this.totalPage) {
          this.showLoading = false
          return
        }
        this.getRefundOrderList() // 分页数据
      },
      /**
       * 撤销退款
      */
      revokeRefund (v) {
        this.$http.post(`${this.api.updateRefundOrderState}`, {
          id: v.id,
          orderDetailId: v.orderDetailId
        }).then((res) => {
          if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
            this.start = this.start - 1
            this.getRefundOrderList()
          }
          this.$vux.toast.text(res.data.msg)
        })
      },
      /**
       * 撤销退款弹窗
      */
      revokeRefundPop (v) {
        let that = this
        this.$vux.confirm.show({
          title: '撤销申请',
          content: '确定是否撤销申请',
          onConfirm () {
            that.revokeRefund(v)
          }
        })
      },
      /**
       * 跳转申请记录详情
      */
      goRefundDetailPage (v) {
        localStorage.setItem('refundRecordDetail', JSON.stringify(v)) // 存储每条退款记录的详情数据
        this.$router.push({path: '/applyRefundGoodDetail'})
      }
    }
  }
</script>

<style scoped lang=less>
  .applyRefundMoney {
    height: 100vh;
    /*内容*/
    .content-wrap{
      background: #fff;
      border-top: .2rem solid #eee;
      &:first-child{
        border-top:none;
      }
      .content-li{
        /* margin-top:0.2rem; */
        /*订单编号*/
        .orderNo{
          height: 0.8rem;
          line-height: 0.8rem;
          border-bottom: 1px solid #eee;
          padding:0 0.3rem;
          color:#999;
          font-size:0.24rem;
          .left{
            float: left;
          }
          .right{
            float: right;
          }
        }
        /*列表*/
        .content-box{
          padding-left: 0.3rem;
          margin-top:0.2rem;
          margin-bottom: 0.1rem;
          .content-food{
            display: flex;
            box-sizing: border-box;
            align-items: center;
            padding: 0 0.3rem 0 0rem;
            .icon{
              flex: 0 0 1.6rem;
              width: 1.6rem;
              padding-right: 0.2rem;
              img{
                width: 1.6rem;
                height: 1.6rem;
              }
            }

            .text{
              display: flex;
              flex-direction: column;
              justify-content: center;
              flex: 1;
              line-height: 1.6em;
              overflow: hidden;
              font-size: 0.28rem;
              padding:0.2rem 0;
            }

            .infor{
              margin-bottom: 0.05rem;
              color: #333;
            }
            .attribute{
              font-size: .24rem;
              color: #999999;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .priceNum{
              font-size: .26rem;
              color:#999;
              .count{
                margin-left:0.2rem;
              }
            }
          }
        }
        /*按钮*/
        .btn{
          display:flex;
          align-items:center;
          height:1rem;
          background:#fff;
          justify-content:flex-end;
          padding:0 .3rem;
          li{
            float: right;
            width:1.6rem;
            height: 0.6rem;
            text-align: center;
            line-height: 0.6rem;
            font-size: 0.24rem;
            border-radius: 0.1rem;
            margin-left: .1rem;
          }
          .cancelOrder{
            border:1px solid #eee;
          }
          .pay{
            border:1px solid #f23030;
            color:#f23030;
            font-size: 0.24rem;
          }
          .cancelPay{
            border:1px solid #999;
            color:#999;
          }

        }
        /*订单状态*/
        .orderStatus{
          display: flex;
          height: 1rem;
          line-height: 1rem;
          background: #eee;
          .left{
            font-size: 0.28rem;
            span{
              margin:0 0.2rem;
              color:#999;
            }
          }
          .center{
            flex: 1;
            font-size: 0.28rem;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            color:#333333;
            font-size:24rpx;
          }
          .right{

          }
        }
      }
    }
    /*没有数据*/
    .noData{
      text-align: center;
      padding-top: 1rem;
    }
    /*字体图标*/
    .vux-x-icon {
      fill: #999;
      margin-top:0.3rem;
      margin-right: 0.1rem;
    }
    .weui_icon_waiting-circle {
      font-size: 0.32rem;
      color: #f23030;
      margin-bottom: 0.05rem;
      margin-left:0.2rem;
    }
    .weui-icon-success-circle {
      font-size: 0.32rem;
      color: #09BB07;
      margin-bottom: 0.05rem;
      margin-left:0.2rem;
    }
    .weui-icon-info-circle {
      font-size: 0.32rem;
      color: #7c55ca;
      margin-bottom: 0.05rem;
      margin-left:0.2rem;
    }
  }
</style>
