<template>
  <div class="paySuccess">
    <div class="paySuccess-log">
      <img src="../../assets/images/paySuccess.png">
      <template v-if="buyType == 1 || !buyType">
        <div v-if="offlinePay" class="paySuccess-ste">订单已提交，等待线下确认支付</div>
        <div v-else class="paySuccess-ste">订单支付成功</div>
        <div class="paySuccess-lok" @click="goOrderList(1)">我的订单</div>
      </template>
      <template v-if="buyType == 2">
        <div class="paySuccess-ste">您已成功 购买门票</div>
        <div class="paySuccess-lok" @click="goOrderList(2)">查看订单详情</div>
      </template>
    </div>
  </div>
</template>
<script>
  // import noResult from '../components/NoResult'
  import { Icon } from 'vux'

  export default {
    components: {
      Icon
    },
    data () {
      return {
        buyType: '',       // 订单购买类型    1 商品订单  2 票务订单
        offlinePay: '',    // 是否是线下支付
        orderSource: 0,    // 下单方式
        orderNo: ''        // 订单编号
      }
    },
    created () {
      // http://192.168.1.118:8088/mshop/paySuccess?buyType=1&charset=utf-8&out_trade_no=SO20181212263999817&method=alipay.trade.wap.pay.return&total_amount=0.02&sign=et8G8o4ES8Ikttcgw0I2QUKWVu5oKQTwmU4KQoP%2FVZzNg6zovw71ggCLQy%2FpU%2BNmTBoK4VkV6Ezt60fry7HDP2HSxyag3GhiL5h45DIXErxKiJYDSff1vR83gMROZ1Ll2l9CDhHnjWrXYyufjle07FezmAUVwpLfxoIurnFd3X8NydEasoQ7EzlNDZ4J1402YEhYxjX3cudFu8kJwkX387z5kPJCrhZ6ssirZJtKQxpcZYle1bPla2c%2Bmnt4new2UO9j5cY5T%2FKeH6aeHwyR8dtghmgJ52XXXPjQ5gbq10chxXGAd1j8vcW0tPiHIsTARQVMBw4GrwbV6uvW1X2V4A%3D%3D&trade_no=2018121222001439701017478981&auth_app_id=2018051860097897&version=1.0&app_id=2018051860097897&sign_type=RSA2&seller_id=2088131183547409&timestamp=2018-12-12%2015%3A45%3A33&shopId=1
      let dat = localStorage.getItem('confirmOrderInfo') || ''
      let oder = [{}]
      if (dat) {
        oder = JSON.parse(localStorage.getItem('confirmOrderInfo'))
      }
      this.orderSource = oder[0].orderSource
      this.themeId = oder[0].themeId
      this.goodsId = oder[0].goodsId
      this.orderNo = localStorage.getItem('payOrderNo')
      this.orderId = localStorage.getItem('payOrderId')
      if (this.orderSource) {
        localStorage.removeItem('confirmOrderInfo')
      } else {
        this.routerReplace({path: '/index'})
      }
      if (this.orderSource === 7) {
        this.routerReplace({path: '/spliceSuccess', query: {orderNo: this.orderNo}})
      }
      if (this.orderSource === 10) {
        this.routerReplace({path: '/hallSellManagement', query: {goodsId: this.goodsId}})
      }
      if (this.orderSource === 12) {
        this.routerReplace({path: '/groupDoing', query: {orderNo: this.orderNo}})
      }
    },

    mounted: function () {
      this.buyType = this.$route.query.buyType
      this.offlinePay = this.$route.query.offlinePay
    },
    methods: {
      /**
       * 跳转到订单列表
       * @typ 1商品订单  2购票订单
      */
      goOrderList (type) {
        if (type === 1) {
          localStorage.setItem('goOrderState', '') // 更新存储的订单状态 为全部订单
          this.routerReplace({path: '/orderList'})
        } else if (type === 2) {
          localStorage.setItem('ticketTabSte', type)
          this.routerReplace({path: '/ticketPurchase'})
        }
      }
    }
  }
</script>
<style lang='less'>
  .paySuccess {
    .paySuccessIco{
      font-size: 1.5rem;
    }
    .paySuccess-log {
      text-align: center;
      margin-top: 25%;
      img {
        width: 1.52rem;
        height: 1.67rem;
      }
      .paySuccess-ste {
        font-size: .28rem;
        color: #f95a58;
        margin-top: .3rem;
      }
    }
    .paySuccess-lok {
      width: 6.89rem;
      height: .8rem;
      color: #fff;
      line-height: .8rem;
      border-radius: 8px;
      -webkit-border-radius:8px;
      background: linear-gradient(90deg,#f77574,#ed3638);
      -webkit-background: linear-gradient(90deg,#f77574,#ed3638);
      text-align: center;
      font-size: .3rem;
      margin: 0 auto;
      margin-top: 1rem;
      margin-bottom: 2rem;
      a {
        color: #fff;
        display: block;
      }
    }
  }
</style>

