<template>
  <div class="pay">
    <!--商品总价-->
    <ul class="price-box clr">
      <li class="left">待支付</li>
      <li class="right">{{orderAmountInfo.orderTotalAmount}}</li>
    </ul>
    <!--支付方式-->
    <ol class="payType-box">
      <li class="clr" :class="(orderAmountInfo.orderTotalAmount > limitMoney && v.type!=3 ) || orderAmountInfo.orderTotalAmount < limitMoney && v.type==3 ? 'noPay' : ''" v-for="(v,index) in arr" @click="selectedPayFun(v)">
        <div class="left">
          <img v-if="v.type==1" src="../../assets/images/weChat.png" >
          <img v-if="v.type==2" src="../../assets/images/payTreasure.png" >
          <img v-if="v.type==3" src="../../assets/images/offLinePay.png" >
        </div>
        <div class="mid">{{v.name}}</div>
        <div class="right">
          <icon v-if="v.checked===false" type="circle"></icon>
          <icon v-if="v.checked===true" type="success"></icon>
        </div>
      </li>
    </ol>
    <!--提交按钮-->
    <div class="submit-btn" @click='goPay'>立即支付</div>
  </div>
</template>

<script>
  import { Icon } from 'vux'
  import {wexinPay} from '../../assets/js/wxpay'

  export default {
    components: {
      Icon
    },
    data () {
      return {
        payTyps: '',
        payOrderId: '',     // 订单id
        payOrderNo: '',     // 订单no
        payOrderSzie: '',   // 订单商品个数
        arr: [
          {'checked': true, type: 1, name: '微信支付'},
          {'checked': false, type: 2, name: '支付宝支付'},
          {'checked': false, type: 3, name: '线下支付'}
        ], // 支付信息
        currentPayType: 1, // 当前支付方式：默认是微信支付
        token: '', // 用户token
        orderAmountInfo: {}, // 获取的订单信息
        limitMoney: 500 // 最大金额
      }
    },
    mounted: function () {
      this.payOrderId = localStorage.getItem('payOrderId')      // 订单id
      this.payOrderNo = localStorage.getItem('payOrderNo')      // 订单orderNo
      this.payOrderSzie = parseInt(localStorage.getItem('payOrderSzie'))  // 订单个数
      this.payTyps = this.$route.query.payTyps // 是多订单提交还是单订单提交
      this.token = JSON.parse(localStorage.getItem('bsbUserInfo')).token
      this.getPayMoney() // 获取订单金额及订单编号
    },
    methods: {
      /**
       * 查询订单信息
      */
      getPayMoney () {
        var resUrl = ''
        var parm = ''
        if (this.payOrderSzie > 1) { // 是否是确认订单页支付
          resUrl = this.api.getMainOrderAmount
          parm = {
            mainOrderNo: this.payOrderNo
          }
        } else {
          resUrl = this.api.getOrderAmount
          parm = {
            orderId: this.payOrderId
          }
        }
        this.$http.get(resUrl, {
          params: parm
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.orderAmountInfo = resData.data
            // 如果金额大于5万只能线下支付
            if (this.orderAmountInfo.orderTotalAmount > this.limitMoney) {
              this.currentPayType = 3
              this.arr.forEach((v, index) => {
                v.checked = false
                if (v.type === 3) {
                  v.checked = true
                }
              })
            }
            // 授权后自动支付
            if (!this.$route.query.redirect) {
              this.goPay()
            }
          }
        })
      },
      /**
       * 选择支付方式
      */
      selectedPayFun (v) {
        if (this.orderAmountInfo.orderTotalAmount > this.limitMoney && v.type !== 3) {
          this.$vux.toast.text('超出在线支付范围')
          return false
        } if (this.orderAmountInfo.orderTotalAmount < this.limitMoney && v.type === 3) {
          return false
        }
        this.arr.forEach((v, index) => {
          v.checked = false
        })
        v.checked = true
        this.currentPayType = v.type
      },
      /**
       * 判断是否是微信浏览器
      */
      isWeiXin () {
        var ua = navigator.userAgent.toLowerCase()
        if (ua.indexOf('micromessenger') > -1) {
          return true
        } else {
          return false
        }
      },
      /**
       * 微信web支付
      */
      noWechat () {
        this.$http.post(this.payOrderSzie > 1 ? this.api.mainWxPay : this.api.wxPay, {
          orderNo: this.orderAmountInfo.orderNo,
          clientType: 2
        }).then((res) => {
          if (res.data.status === this.api.ERR_OK) {
            window.location.href = res.data.data.mweb_url + '&redirect_url=http%3A%2F%2F' + this.api.paySuccessUrl + '%2Fmshop%2FpaySuccess'
          }
        })
      },
      /**
       * 微信内部支付
      */
      isWechat () {
        this.$http.post(this.payOrderSzie > 1 ? this.api.mainWxPay : this.api.wxPay, {
          orderNo: this.orderAmountInfo.orderNo,
          clientType: 1
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            wexinPay(resData.data)
          } else if (parseInt(resData.status) === 302) {
            // 授权
            window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx469bdfbc524d0dec&redirect_uri=http%3A%2F%2Fwww.passpaygg.com%2Fbehindshop%2FwxAuthor%2Fdefault&response_type=code&scope=snsapi_base&state=${this.token}&connect_redirect=1#wechat_redirect`
          }
        })
      },
      /**
       * 提交支付
       *
      */
      goPay () {
        if (this.currentPayType === 1) {
          if (!this.isWeiXin()) { // 微信-web支付
            this.noWechat()
          } else { // 微信-微信支付
            this.isWechat()
          }
        } else if (this.currentPayType === 2) {  // 支付宝支付
          let resUrl = parseInt(this.payOrderSzie) > 1 ? this.api.mainAliPay : this.api.aliPay
          window.open(resUrl + '?orderNo=' + this.orderAmountInfo.orderNo + '&token=' + this.token)
        } else if (this.currentPayType === 3) { // 线下支付
          this.$http.get(this.api.offlinePay, {
            params: {
              orderNo: this.orderAmountInfo.orderNo
            }
          }).then((res) => {
            if (res.data.status === this.api.ERR_OK) {
              this.$router.push({path: '/paySuccess', query: {offlinePay: 'offlinePay'}})
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang=less>
  .pay {
    height: 100vh;
    background: #eee;
    /*商品总价*/
    .price-box{
      background: #fff;
      height: 0.8rem;
      line-height: 0.8rem;
      padding:0 0.3rem;
      .left{
        float: left;
      }
      .right{
        float: right;
        color:#f23030;
        font-size: 0.3rem;
      }
    }
    /*支付方式*/
    .payType-box{
      background: #fff;
      margin-top:0.2rem;
      overflow: hidden;
      li{
        padding:0.2rem 0.1rem 0.2rem 0.3rem;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        .left{
          img{
            width:0.8rem;
            display: block;
          }
        }
        .mid{
          flex: 1;
          margin-left: .25rem;
          color: #333333;
          font-size: .28rem;
        }
        .right{
          margin-right: 0.1rem;
        }
      }
      .noPay{
        background: #f7f4f4;
      }
    }
    /*支付按钮*/
    .submit-btn{
      width: 7.5rem;
      height: 1rem;
      text-align: center;
      line-height: 1rem;
      font-size: 0.32rem;
      color:#fff;
      position: fixed;
      left: 0;
      right: 0;
      bottom:0;
      margin: auto;
      background: #f23030;
    }
    .weui-icon-circle {
      font-size: 0.4rem;
      color: #C9C9C9;
    }
    .weui-icon-success {
      font-size: 0.4rem;
      color: #f23030;
    }
  }
</style>
