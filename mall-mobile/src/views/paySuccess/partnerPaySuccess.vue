<template>
  <div class="paySuccess">
    <div class="paySuccess-log">
      <img src="../../assets/images/paySuccess.png">
      <div v-if="offlinePay">订单已提交，等待线下确认支付</div>
      <div v-else>订单支付成功</div>
    </div>
    <div class="paySuccess-lok">
      <router-link to='/partnerPlan'>返回</router-link>
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
        offlinePay: '' // 是否是线下支付
      }
    },
    mounted: function () {
      this.offlinePay = this.$route.query.offlinePay
    },
    methods: {
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
      div {
        font-size: .28rem;
        color: #f95a58;
        margin-top: .3rem;
      }
    }
    .paySuccess-lok {
      width: 6.89rem;
      height: .8rem;
      line-height: .8rem;
      border-radius: 8px;
      -webkit-border-radius:8px;
      background: linear-gradient(90deg,#f77574,#ed3638);
      -webkit-background: linear-gradient(90deg,#f77574,#ed3638);
      text-align: center;
      font-size: .3rem;
      color: #666666;
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

