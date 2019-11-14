<template>
  <div class="paySuccess">
    <template v-if="offlinePay">
      <div class="paySte">订单已提交，等待线下确认支付</div>
      <div class="paySuccess-lok" style="margin-top:1rem;">
        <router-link to='/home' replace>返回</router-link>
      </div>
    </template>
    <template v-else>
      <div class="paySte" v-if="payStaus !== 1">{{paySteTxt}}</div>
      <div class="paySuccess-log" v-if="payStaus == 1">
        <img src="../../assets/images/paySuccess.png">
        <div>订单支付成功</div>
      </div>
      <div class="paySuccess-lok" v-if="payStaus !== '' && payStaus !== 1">
        <router-link to='/pay/orderPay' replace>重新支付</router-link>
      </div>
      <div class="paySuccess-lok" v-if="payStaus !== ''">
        <router-link to='/home' replace>返回</router-link>
      </div>
    </template>
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
        paySteTxt: '正在查询支付结果,请稍后...',    // 状态文字
        payStaus: '',     // 支付状态
        payOrderNo: '',   // 订单编号
        offlinePay: ''    // 是否是线下支付
      }
    },
    mounted: function () {
      this.offlinePay = this.$route.query.offlinePay
      this.payOrderNo = localStorage.getItem('payOrderNo')                       // 订单orderNo
      setTimeout(() => {
        if (!this.offlinePay) {
          this.getOrderPayStaus()
        }
      }, 2000)
    },
    methods: {
      /**
       * 获取订单支付状态
      */
      getOrderPayStaus (path) {
        this.$http.get(this.api.getOrderStaus, {
          params: {
            orderNo: this.payOrderNo
          }
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            this.payStaus = 0
            this.paySteTxt = res.data.msg || '订单异常'
            if (parseInt(res.data.status) !== 9903) {
              return false
            }
          } else {
            this.payStaus = res.data.data
            this.paySteTxt = this.payStaus === 1 ? '' : '支付失败'
          }
        }).finally(() => {
          //
        })
      }
    }
  }
</script>
<style lang='less'>
  .paySuccess {
    padding-bottom: 2rem;
    box-sizing: border-box;
    .paySte{
      margin-top: .4rem;
      font-size: .28rem;
      letter-spacing: .01rem;
      color: #4ea5ee;
      text-align: center;
      margin-top: 25%;
    }
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
      div {
        font-size: .28rem;
        color: #4ea5ee;
        margin-top: .3rem;
      }
    }
    .paySuccess-lok {
      width: 6.89rem;
      height: .9rem;
      line-height: .9rem;
      border-radius: .45rem;
      -webkit-border-radius: .45rem;
      background: -webkit-gradient(linear, left top, right top, from(#7acde5), to(#5894de));
      background: linear-gradient(left, #7acde5, #5894de);
      /*background: linear-gradient(90deg,#f77574,#ed3638);*/
      /*-webkit-background: linear-gradient(90deg,#f77574,#ed3638);*/
      text-align: center;
      font-size: .3rem;
      color: #666666;
      margin: 0 auto;
      margin-top: 0.4rem;
      a {
        color: #fff;
        display: block;
      }
    }
  }
</style>
