<template>
  <div class="pay">
    <!--商品总价-->
    <ul class="price-box clr">
      <li class="left">待支付</li>
      <li class="right">{{orderAmountInfo.orderTotalAmount}}</li>
    </ul>
    <!--支付方式-->
    <ol class="payType-box">
      <li class="clr" :class="v.noPay ? 'noPay' : ''" v-for="(v,index) in arr" @click="selectedPayFun(v)">
        <div class="left">
          <img v-if="v.type==1" src="../../assets/images/weChat.png" >
          <img v-if="v.type==2" src="../../assets/images/payTreasure.png" >
          <img v-if="v.type==3" src="../../assets/images/offLinePay.png" >
          <img v-if="v.type==4" src="../../assets/images/balancePay.png" >
        </div>
        <div class="mid">
          <div>
            {{v.name}}
            <span v-if="v.type==4">(可用余额: {{availableBbalance}})</span>
          </div>
          <div v-if="v.type==4" class="balance-pay-tip">{{balancePayTip}}</div>
        </div>
        <div class="right">
          <icon v-if="v.type===currentPayType" type="success"></icon>
          <icon v-else type="circle"></icon>
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
        fromType: '',             // ios 或android
        val: '',
        payStatusText: '',
        showPay: false,
        orderType: '',             // 订单类型
        payOrderNo: '',            // 订单no
        arr: [],                   // 支付信息
        payWay: [                  // 支付方式
          {type: 1, name: '微信支付', noPay: false},
          {type: 2, name: '支付宝支付', noPay: false},
          {type: 3, name: '线下支付', noPay: false}
        ],
        limitMoney: 50000,         // 最大金额
        currentPayType: 1,         // 当前支付方式：默认是微信支付
        token: '',                 // 用户token
        orderAmountInfo: {}       // 获取的订单信息
      }
    },
    mounted: function () {
      this.fromType = localStorage.getItem('fromType')
      this.orderType = parseInt(localStorage.getItem('orderType'))               // 订单类型 1商城订单 2 加盟费订单
      this.payOrderNo = localStorage.getItem('payOrderNo')                       // 订单orderNo
      this.token = JSON.parse(localStorage.getItem('integralUserInfo')).token
      this.getPayMoney()                                                         // 获取订单金额及订单编号
    },
    methods: {
      /**
       * 查询订单信息
      */
      getPayMoney () {
        this.$http.get(this.api.getOrderAmount, {
          params: {
            orderNo: this.payOrderNo
          }
        }).then((res) => {
          // console.log(res)
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.orderAmountInfo = resData.data
            // 如果金额大于等于5万只能线下支付
            if (this.orderAmountInfo.orderTotalAmount >= this.limitMoney) {
              // 支付方式不可用
              this.payWay.forEach((item) => {
                if (item.type === 1 || item.type === 2) {
                  item.noPay = true
                }
              })
              this.arr = this.payWay
              this.currentPayType = 3
            } else {
              this.payWay.forEach((item) => {
                // 隐藏不需要显示的支付方式
                // if (item.type !== 3) {
                //   this.arr.push(item)
                // }
                this.arr.push(item)
              })
              this.currentPayType = 1
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
        var payTip = v.type === 4 ? this.balancePayTip : '超出在线支付范围'
        if (v.noPay) {
          this.$vux.toast.text(payTip)
          return false
        }
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
        this.$http.post(this.api.wxPay, {
          orderNo: this.orderAmountInfo.orderNo,
          orderType: this.orderType,
          clientType: 2
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.status === this.api.ERR_OK) {
            if (this.fromType !== 'android') {
              window.location.href = res.data.data.mweb_url + '&redirect_url=http%3A%2F%2F' + this.api.paySuccessUrl + '%2Fpoints%2Fpay%2FpaySuccess'
            } else {
              // 安卓上支付的回调
              this.url = res.data.data.mweb_url + '&redirect_url=http%3A%2F%2F' + this.api.paySuccessUrl + '%2Fpoints%2Fpay%2FpaySuccess'
              window.java.payWaySelect(this.currentPayType, this.url)
            }
          }
        })
      },
      /**
       * 微信内部支付
      */
      isWechat () {
        this.$http.post(this.api.wxPay, {
          orderNo: this.orderAmountInfo.orderNo,
          orderType: this.orderType,
          clientType: 1
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK) {
            this.$vux.toast.text(resData.msg)
          }
          if (resData.status === this.api.ERR_OK) {
            wexinPay(resData.data)
          } else if (parseInt(resData.status) === 302) {
            // 授权
            window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx29ed774e4f21daca&redirect_uri=http%3A%2F%2F120.77.210.28%2Fbehindpoints%2FwxAuthor%2Fdefault&response_type=code&scope=snsapi_base&state=${this.token}&connect_redirect=1#wechat_redirect`
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
          let resUrl = this.api.aliPay
          if (this.fromType !== 'android') {
            window.open(resUrl + '?orderNo=' + this.orderAmountInfo.orderNo + '&orderType=' + this.orderType + '&clientType=1' + '&token=' + this.token)
          } else {
            this.url = resUrl + '?orderNo=' + this.orderAmountInfo.orderNo + '&orderType=' + this.orderType + '&clientType=1' + '&token=' + this.token
            window.java.payWaySelect(this.currentPayType, this.url)
          }
        } else if (this.currentPayType === 3) { // 线下支付
          this.$router.push({path: '/pay/offlinePay', query: {orderNo: this.orderAmountInfo.orderNo, orderType: this.orderType}})
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
          .balance-pay-tip{
            color: #999999;
            font-size: .2rem;
            margin-top: .1rem;
          }
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
