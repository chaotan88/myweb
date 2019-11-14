<template>
  <div class="applyRefundMoneySubmit">
    <div>
      <!--商品信息-->
      <div class="goodsInfo">
          <div class="icon">
            <img :src="orderList.goodsImage | filterImgUrl">
          </div>
          <div class="text">
            <h2 class="infor">{{ orderList.goodsName }}</h2>
            <div class="attribute">{{ orderList.goodsAttribute }}</div>
            <p class="priceNum">
              <span class="price">价格：¥{{ orderList.goodsPrice*100/100 | moneyFilter }}</span>
              <span class="count">数量：{{ orderList.goodsNum }}</span>
            </p>
          </div>
        </div>
      <!--退款原因-问题描述-->
      <div class="whyDesc">
        <!--退款原因-->
        <div class="why">
          <h1>退款原因</h1>
          <select v-model="refundReason">
            <option value="">请选择</option>
            <option v-for="(item,index) in refundReasonList" :value="item.status">{{item.name}}</option>
          </select>
        </div>
        <!--问题描述-->
        <div class="problemDesc">
          <h1>问题描述</h1>
          <textarea rows="10" v-model="refundRemarks" placeholder="请在此描述问题"></textarea>
          <!--拍照-->
          <!--<div class="TakePictures">拍照</div>-->
        </div>
      </div>
      <!--金额-->
      <div class="money">
        <p>退款金额：¥{{ orderList.reundGoodsPrice*100/100 | moneyFilter }} 
          <span v-if="isLastGoods">(含运费 ¥{{ orderList.logisticsAmount*100/100 | moneyFilter }})</span>
        </p>
      </div>
    </div>
    <!--提交按钮-->
    <div class="submit-box">
      <div class="submit-btn" @click="confirmForm">提交</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isLastGoods: false, // 是否是最后一件商品
        orderList: {},        // 订单列表
        refundReasonList: [
          {
            name: '订单不能按预计时间送达',
            status: '1'
          },
          {
            name: '操作有误',
            status: '2'
          },
          {
            name: '重复下单',
            status: '3'
          },
          {
            name: '其他渠道价格更低',
            status: '4'
          },
          {
            name: '不想买了',
            status: '5'
          },
          {
            name: '其他原因',
            status: '6'
          }
        ],
        refundReason: '',     // 退款原因 1 订单不能按预计时间送达 2操作有误 3 重复下单 4 其他渠道价格更低 5 不想买了 6 其他原因
        refundRemarks: ''    // 问题描述
      }
    },
    mounted: function () {
      this.orderList = JSON.parse(localStorage.getItem('applyRefund'))
      this.isLastRefundGoods()
    },
    methods: {
      /**
       * 判断是否是最后一件商品申请的
      */
      isLastRefundGoods () {
        this.$http.get(this.api.isLastRefundGoods, {
          params: {
            orderId: this.orderList.orderId
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK) return false
          this.isLastGoods = resData.data
        })
      },
      /**
       * 提交申请
      */
      confirmForm () {
        if (this.refundReason === '') {
          this.$vux.toast.text('请选择退款原因')
          return
        }
        this.$http.post(this.api.refundOrder, {
          orderId: this.orderList.orderId,             // 订单id
          orderDetailId: this.orderList.orderDetailId, // 订单单品id
          refundReason: this.refundReason,             // 退款原因 1 订单不能按预计时间送达 2操作有误 3 重复下单 4其他渠道价格更低 5不想买了 6其他原因
          refundRemarks: this.refundRemarks,           // 退款备注说明
          image: ''
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.status === this.api.ERR_OK) {
            this.$router.replace('/applyRefundMoney')
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
  .applyRefundMoneySubmit {
    height: 100vh;
    background: #eee;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    /*商品信息*/
    .goodsInfo{
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0.2rem 0.3rem;
        background: #fff;
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
          margin-bottom: 0.1rem;
          color: #333;
          display: -webkit-box;
          display: -moz-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .attribute{
          font-size: .24rem;
          color: #999999;
          margin-top: .05rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .priceNum{
          color:#999;
          .count{
            margin-left:0.2rem;
          }
        }
      }
    /*退款原因-问题描述*/
    .whyDesc{
      background: #fff;
      margin-top:0.2rem;
      /*退款原因*/
      .why{
        padding:0 0.3rem;
        display:flex;
        height: .8rem;
        border-bottom: 1px solid #dddddd;
        align-items: center;
        h1{
          flex:1;
          /* margin-bottom: 0.2rem; */
        }
        select{
          direction: rtl;
          height: .8rem;
          background: none;
          border:none;
          appearance:none;  
          -moz-appearance:none;  
          -webkit-appearance:none;
          outline: none;
          flex:1;
        }
      }
      /*问题描述*/
      .problemDesc{
        border-bottom: 1px solid #dddddd;
        margin-top:0.5rem;
        padding:0 0.3rem;
        padding-bottom: 0.3rem;
        textarea{
          background: #fff;
          width:100%;
          border:none;
          outline:none;
          resize:none;
          font-family: '微软雅黑';
          color:#999;
          font-size: .28rem;
          height: 2rem;
          background: #eee;
          padding: .2rem;
          box-sizing: border-box;
        }
        h1{
          margin-bottom: 0.2rem;
        }
        /*拍照*/
        .TakePictures{
          margin-top:0.2rem;
        }
      }
    }
    /*金额*/
    .money{
      padding:0.3rem;
      background: #fff;
      border-bottom: 1px solid #dddddd;
    }
    /*提交*/
    .submit-box{
      margin-bottom: .41rem;
      /* position: absolute;
      left: 0;
      right: 0;
      bottom: 0.5rem; */
      padding:0 0.3rem;
      .submit-btn{
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: center;
        color:#fff;
        background: #f23030;
        font-size: 0.32rem;
        border-radius: 0.1rem;
      }
    }
  }
</style>

