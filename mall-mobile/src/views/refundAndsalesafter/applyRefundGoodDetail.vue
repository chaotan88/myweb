<template>
    <div class="applyRefundGoodDetail">
      <!--订单信息-->
      <div class="orderInfo">
        <!--服务单号和申请时间-->
        <p class="serviceNoAndTime">
          <span class="serviceNo">服务单号：{{ orderDetail.refundOrderNo }}</span>
          <span class="time">申请时间：{{ orderDetail.refundApplyTime | formatDate(1) }}</span>
        </p>
        <!--状态和价格-->
        <p class="statusAndPrice">
          <icon type="success-circle" class="green" v-if="orderDetail.refundStatus == 2"></icon>
          <icon type="waiting-circle" class="red" v-if="orderDetail.refundStatus == 1"></icon>
          <icon type="info-circle" class="violet" v-if="orderDetail.refundStatus == 3"></icon>
          <i class="status" :class="orderDetail.refundStatus == 1 ? 'red' : orderDetail.refundStatus == 2 ? 'green' : orderDetail.refundStatus == 3 ? 'violet' : ''">{{ orderDetail.refundStatus | refundStatusFilter }}</i>
          <b class="price">¥{{ orderDetail.refundPrice | moneyFilter }}</b>
        </p>
      </div>
      <!--问题描述-->
      <div class="problemDesc">
        <!--内容-->
        <div class="content">
          <p class="name">退款原因: {{ orderDetail.refundReason | refundReasonFilter}}</p>
          <p class="time">问题描述：{{ orderDetail.refundRemarks}}</p>
        </div>
      </div>
      <!--服务订单信息-->
      <div class="serviceNoInfo">
        <!--标题-->
        <p class="title">服务单信息</p>
        <!--内容-->
        <div class="content">
          <p>
            <span>服务类型：</span>
            <i>退货</i>
          </p>
          <p>
            <span>退款方式：</span>
            <i>原返</i>
          </p>
          <p>
            <span>联系人：</span>
            <i>{{ orderDetail.customerName}}</i>
          </p>
          <p>
            <span>联系电话：</span>
            <i>{{ orderDetail.customerPhone}}</i>
          </p>
        </div>
      </div>
    </div>
</template>

<script>
  import { Icon } from 'vux'
  export default {
    components: {
      Icon
    },
    data () {
      return {
        orderDetail: {} // 订单详情数据
      }
    },
    mounted: function () {
      this.orderDetail = JSON.parse(localStorage.getItem('refundRecordDetail')) || {}
    },
    methods: {
    }
  }
</script>

<style scoped lang=less>
    .applyRefundGoodDetail {
      height: calc(100vh);
      background: #eee;
      padding-top:0.2rem;
      overflow-y: scroll;
      box-sizing: border-box;
      /*订单信息*/
      .orderInfo{
        background: #fff;
        /*服务单号和申请时间*/
        .serviceNoAndTime{
          height: 0.8rem;
          line-height: 0.8rem;
          border-bottom: 1px solid #eee;
          font-size: 0.24rem;
          padding: 0 .3rem;
          display: flex;
          span{
            flex: 1;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow:ellipsis;
          }
          .time{
            color:#999;
            text-align: right;
            margin-left: .2rem;
          }
        }
        /*状态和价格*/
        .statusAndPrice{
          height: 1.6rem;
          line-height: 1.6rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content:center;
          .red{
            color: #f23030;
          }
          .green{
            color: #09BB07;
          }
          .violet{
            color: #7c55ca;
          }
          .weui-icon{
            font-size: .45rem;
            margin-bottom: 0;
          }
          .status{
            /* color:#50c65f; */
            font-size: 0.38rem;
          }
          .price{
            font-size: 0.4rem;
            margin-left: 0.3rem;
            font-weight: bold;
            margin-right: 0.15rem;
          }
          .weui-icon-waiting-circle{
            color:red;
            margin-bottom: 0.1rem;
            font-size: 0.4rem;
          }
        }
      }
      /*问题描述*/
      .problemDesc{
        background: #fff;
        margin-top:0.2rem;
        padding-left:0.3rem;
        /*标题*/
        .title{
          height: 1rem;
          line-height: 1rem;
          font-size: 0.32rem;
          border-bottom: 1px solid #eee;
        }
        /*内容*/
        .content{
          font-size: 0.28rem;
          padding-bottom: 0.3rem;
          padding-top: 0.1rem;
          color:#999;
          p{
            margin-top:0.3rem;
            word-break: break-all;
          }
        }
      }
      /*服务订单信息*/
      .serviceNoInfo{
        background: #fff;
        margin-top:0.2rem;
        padding-left:0.3rem;
        /*标题*/
        .title{
          height: 1rem;
          line-height: 1rem;
          font-size: 0.32rem;
          border-bottom: 1px solid #eee;
        }
        /*内容*/
        .content{
          font-size: 0.28rem;
          padding-bottom: 0.3rem;
          color:#999;
          p{
            margin-top:0.3rem;
            span{
              display: inline-block;
              width: 1.5rem;
            }
          }
        }
      }
      /*字体图标*/
      .weui-icon-success-circle {
        font-size: 0.32rem;
        color: #09BB07;
        margin-bottom: 0.1rem;
        margin-left:0.2rem;
      }
    }
</style>
