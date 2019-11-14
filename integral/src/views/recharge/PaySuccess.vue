<template>
  <div class="paySuccess" v-if="payStaus === ''">
    <div class="paySuccess-log">
      <p class="paymentSuccess-warp-title">正在查询支付结果,请稍后...</p>
    </div>
  </div>
  <div class="paySuccess" v-else-if="payStaus === 1">
    <div class="paySuccess-log">
      <img src="../../assets/images/paymentSuccess.png">
      <p class="paymentSuccess-warp-title">充值成功</p>
      <p class="paymentSuccess-warp-money">￥{{amount | money}}</p>
      <p class="paymentSuccess-warp-tips">
        已赠送
        <span>{{points}}个</span>
        消费积分到您的账户，请注意查收
      </p>
    </div>
    <div class="paySuccess-warp-btn-warp">
      <button-item :title="buttonTitle" :path="path" @submit="handleSubmit"></button-item>
    </div>
  </div>
  <div class="paySuccess" v-else>
    <div class="paySuccess-log">
      <p class="paymentSuccess-warp-title">充值失败</p>
    </div>
    <div class="paySuccess-warp-btn-warp">
      <button-item title="重新支付" path="/pay/payment" @submit="handleSubmit"></button-item>
    </div>
    <div class="paySuccess-warp-btn-warp">
      <button-item :title="buttonTitle" :path="path" @submit="handleSubmit"></button-item>
    </div>
  </div>
</template>
<script>
  import ButtonItem from './ButtonItem'
  import { Icon } from 'vux'
  export default {
    components: {Icon, ButtonItem},
    data () {
      return {
        buttonTitle: '返回首页',
        path: '/home',
        rechargeData: {},
        amount: '',
        points: '',
        token: '',
        orderNo: '',
        payStaus: '',
        payType: ''
      }
    },
    mounted: function () {
      this.token = JSON.parse(localStorage.getItem('integralUserInfo')).token
      this.rechargeData = JSON.parse(localStorage.getItem('rechargeData'))
      this.amount = this.rechargeData.amount
      this.points = this.rechargeData.points
      this.orderNo = this.rechargeData.rechargeNo                    // 订单orderNo
      setTimeout(() => {
        this.getOrderPayStaus()
      }, 3000)
    },
    methods: {
      handleSubmit (path) {
        if (path === this.path) {
          localStorage.removeItem('rechargeData')
        }
        this.$router.push({path: path})
      },
      getOrderPayStaus (path) {
        this.$vux.loading.show({
          text: '请稍后...'
        })
        this.$http.get(this.api.getOrderStaus, {
          params: {
            orderNo: this.orderNo
          }
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            if (parseInt(res.data.status) !== 9903) {
              return false
            }
          } else {
            this.payStaus = res.data.data
            // if (res.data.data === '1') {
            //   this.payStaus = res.data.data
            //   return
            // } else {
            //   this.$vux.toast.text('支付失败')
            //   // this.$router.push({path: '/pay/payment'})
            //   // this.$router.go(-1)
            //   return
            // }
          }
        }).finally(() => {
          this.$vux.loading.hide()
        })
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
      margin-top: .8rem;
      img {
        width: 3.25rem;
        height: 3.1rem;
      }
      .paymentSuccess-warp-title{
        margin-top: .4rem;
        font-size: .28rem;
        letter-spacing: .01rem;
        color: #4ea5ee;
      }
      .paymentSuccess-warp-money{
        margin-top: .2rem;
        font-size: .4rem;
        color: #ff5050;
      }
      .paymentSuccess-warp-tips{
        margin-top: .7rem;
        font-size: .24rem;
        color: #999999;
        span {
          color: #ff5050;
        }
      }
    }
    .paySuccess-warp-btn-warp{
      text-align: center;
      margin-top: .4rem;
    }
  }
</style>
