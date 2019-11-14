<!-- 充值付款 -->
<template>
  <div class="payment-warp">
    <p class="payment-warp-showMoney">
      <span class="payment-warp-showMoney-title">待支付：</span>
      <span class="payment-warp-showMoney-icon">￥</span>
      <span class="payment-warp-showMoney-num">{{amount | money}}</span>
    </p>
    <p class="payment-warp-choicePayType">选择支付方式</p>
    <div class="payment-warp-payType" @click="payType=3">
      <img class="payment-warp-payType-logo" src="./../../assets/images/pointImg.png" alt="">
      <p :class="this.restOf >= this.amount ? 'payment-warp-payType-titleky' : 'vcvTitle'">通用积分支付(可用通用积分：{{restOf}})</p>
      <p :class="this.restOf >= this.amount ? 'payment-warp-payType-subheadky' : 'vcvSub'">通用积分不足</p>
      <div :class="this.restOf >= this.amount ? 'payment-warp-payType-radioky' : 'vcvradio'">
        <icon v-if="payType===3" type="success"></icon>
        <icon v-else type="circle"></icon>
      </div>
    </div>
    <div class="payment-warp-payType" @click="payType=1">
      <img class="payment-warp-payType-logo" src="./../../assets/images/logo_wechat.png" alt="">
      <p class="payment-warp-payType-title">微信支付</p>
      <p class="payment-warp-payType-subhead">亿万用户的选择，更快更安全</p>
      <div class="payment-warp-payType-radio">
        <icon v-if="payType===1" type="success"></icon>
        <icon v-else type="circle"></icon>
      </div>
    </div>
    <div class="payment-warp-payType" @click="payType=2">
      <img class="payment-warp-payType-logo" src="./../../assets/images/logo_alipay.png" alt="">
      <p class="payment-warp-payType-title">支付宝支付</p>
      <p class="payment-warp-payType-subhead">支持支付宝的用户使用</p>
      <div class="payment-warp-payType-radio">
        <icon v-if="payType===2" type="success"></icon>
        <icon v-else type="circle"></icon>
      </div>
    </div>
    <div class="payment-warp-payType" @click="payType=4">
      <img class="payment-warp-payType-logo" src="./../../assets/images/balancePaysss.png" alt="">
      <p class="payment-warp-payType-title">线下支付</p>
      <p class="payment-warp-payType-subhead">线下用户使用</p>
      <div class="payment-warp-payType-radio">
        <icon v-if="payType===4" type="success"></icon>
        <icon v-else type="circle"></icon>
      </div>
    </div>
    <div class="payment-warp-btn-warp">
      <button-item :title="buttonTitle" :path="path" @submit="handleSubmit"></button-item>
    </div>
  </div>
</template>
<script>
import ButtonItem from './ButtonItem'
import {wexinPayment} from '../../assets/js/wxpayment'
import {Icon} from 'vux'

export default {
  components: {ButtonItem, Icon},
  data () {
    return {
      token: '',                 // 用户token
      buttonTitle: '立即支付',
      path: '/recharge/paySuccess',
      amount: '',
      payType: 3,
      rechargeNo: '',
      rechargeData: {},
      url: '',
      fromType: '',
      restOf: null
    }
  },
  mounted () {
    // this.amount = this.$route.query.amount
    // this.rechargeNo = this.$route.query.rechargeNo
    this.getPartnerData()
    this.rechargeData = JSON.parse(localStorage.getItem('rechargeData'))
    this.amount = this.rechargeData.amount               // 订单类型 1商城订单 2 加盟费订单
    this.rechargeNo = this.rechargeData.rechargeNo                    // 订单orderNo
    this.token = JSON.parse(localStorage.getItem('integralUserInfo')).token
    this.fromType = localStorage.getItem('fromType')
    if (localStorage.getItem('payType')) {
      localStorage.removeItem('payType')
    }
  },
  watch: {
  },
  methods: {
    handleSubmit () {
      localStorage.setItem('payType', this.payType)
      if (this.payType === 1) {
        console.log('WxPay')
        if (!this.isWeiXin()) {
          // 微信-web支付
          this.noWechat()
        } else {
          // 微信-微信支付
          this.isWechat()
        }
      } else if (this.payType === 2) {
        console.log('AliPay')
        this.rechargeAliPay()
      } else if (this.payType === 3) {
        console.log('积分支付')
        this.rechargeCashPay()
      } else if (this.payType === 4) {
        console.log('线下支付')
        this.$router.push('/pay/offlinePay1')
      } else {
        console.log('else')
      }
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
     * 微信内部支付
    */
    isWechat () {
      this.$http.post(this.api.rechargeWxPay, {
        rechargeNo: this.rechargeNo,
        clientType: 1
      }).then((res) => {
        let resData = res.data
        if (resData.status !== this.api.ERR_OK) {
          this.$vux.toast.text(resData.msg)
        }
        if (resData.status === this.api.ERR_OK) {
          wexinPayment(resData.data)
        } else if (parseInt(resData.status) === 302) {
          // 授权
          this.$vux.toast.text('正在授权...')
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx29ed774e4f21daca&redirect_uri=http%3A%2F%2F120.77.210.28%2Fbehindpoints%2FwxAuthor%2Fdefault&response_type=code&scope=snsapi_base&state=${this.token}AAA3&connect_redirect=1#wechat_redirect`
        }
      })
    },
    /**
       * 微信web支付
      */
    noWechat () {
      this.$http.post(this.api.rechargeWxPay, {
        rechargeNo: this.rechargeNo,
        clientType: 2
      }).then((res) => {
        if (res.data.status === this.api.ERR_OK) {
          if (this.fromType !== 'android') {
            window.location.href = res.data.data.mweb_url + '&redirect_url=http%3A%2F%2F' + this.api.paySuccessUrl + '%2Fpoints%2Frecharge%2FpaySuccess'
          } else {
            // 安卓上支付的回调
            this.url = res.data.data.mweb_url + '&redirect_url=http%3A%2F%2F' + this.api.paySuccessUrl + '%2Fpoints%2Frecharge%2FpaySuccess'
            window.java.payWaySelect(this.payType, this.url)
          }
        }
      })
    },
    /**
     * 支付宝支付
     */
    rechargeAliPay () {
      console.log('rechargeAliPay')
      if (this.fromType !== 'android') {
        window.open(this.api.rechargeAliPay + '?token=' + this.token + '&rechargeNo=' + this.rechargeNo)
      } else {
        this.url = this.api.rechargeAliPay + '?token=' + this.token + '&rechargeNo=' + this.rechargeNo
        window.java.payWaySelect(this.payType, this.url)
      }
    },
    /**
     * 通用积分支付
     */
    rechargeCashPay () {
      if (this.restOf >= this.amount) {
        this.$vux.loading.show({
          text: '正在支付...'
        })
        setTimeout(() => {
          this.$http.get(this.api.rechargeCashPay, {
            params: {
              rechargeNo: this.rechargeNo
            }
          }).then((res) => {
            console.log(res)
            if (res.data.status === '1') {
              this.$router.push({path: '/bankRechargedSuccess', query: {successPrice: this.amount}})
            }
          }).finally(() => {
            this.$vux.loading.hide()
          })
        }, 1000)
      } else {
        this.$vux.toast.text('积分不足')
      }
    },
    /**
     * 获取会员升级数据
     */
    getPartnerData () {
      this.$http.post(this.api.getApplyInfoListByCustomerId).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          this.restOf = resData.data.cashPoints
        }
      })
    }
  }
}
</script>
<style lang="less">
.payment-warp{
  background: #eeeeee;
  height: calc(100vh);
  overflow-y: scroll;
  color: #333333;
  .payment-warp-showMoney{
    line-height: 0.9rem;
    background: #ffffff;
    padding: 0 .4rem;
    .payment-warp-showMoney-title {
      font-size: .24rem;
      line-height: .36rem;
      color: #666666;
    }
    .payment-warp-showMoney-icon {
      font-size: .26rem;
      color: #ff2030;
    }

    .payment-warp-showMoney-num {
      font-size: .34rem;
      color: #ff2030;
    }
  }
  .payment-warp-choicePayType{
    line-height: 0.7rem;
    padding: 0 .4rem;
    font-size: .24rem;
    color: #333333;
  }
  .payment-warp-payType{
    height: 1.4rem;
    background: #ffffff;
    border-bottom: 1px solid #dddddd;
    padding: .4rem .4rem 0 .4rem;
    .payment-warp-payType-logo{
      width: .8rem;
      height: .8rem;
      float: left;
      margin-right: .3rem;
      margin-top: 0.05rem;
    }
    .payment-warp-payType-title{
      font-size: .28rem;
      line-height: .36rem;
      color: #333333;
      margin-top: 0.15rem;
    }
    .vcvTitle{
      font-size: .28rem;
      line-height: .36rem;
      color: #333333;
      margin-top: 0.15rem;
    }
    .payment-warp-payType-titleky{
      font-size: .28rem;
      line-height: .36rem;
      color: #333333;
      margin-top: 0.25rem;
    }
    .payment-warp-payType-subhead{
      font-size: .2rem;
      line-height: .36rem;
      color: #999999;
      /*margin-top: .2rem;*/
    }
    .vcvSub{
      font-size: .2rem;
      line-height: .36rem;
      color: #999999;
    }
    .payment-warp-payType-subheadky{
      font-size: .2rem;
      line-height: .36rem;
      color: #999999;
      display: none;
    }
    .payment-warp-payType-radio{
      float: right;
      margin-top: -.7rem;
      .weui-icon-circle {
        font-size: 0.4rem;
        color: #C9C9C9;
      }
      .weui-icon-success {
        font-size: 0.4rem;
        color: #65aae1;
      }
    }
    .payment-warp-payType-radioky{
      float: right;
      margin-top: -.4rem;
      .weui-icon-circle {
        font-size: 0.4rem;
        color: #C9C9C9;
      }
      .weui-icon-success {
        font-size: 0.4rem;
        color: #65aae1;
      }
    }
    .vcvradio{
      float: right;
      margin-top: -.6rem;
      .weui-icon-circle {
        font-size: 0.4rem;
        color: #C9C9C9;
      }
      .weui-icon-success {
        font-size: 0.4rem;
        color: #65aae1;
      }
    }
  }
  .payment-warp-btn-warp{
    text-align: center;
    margin-top: .4rem;
  }

}
input{-webkit-user-select:text;-ms-user-select:text;user-select:text;-webkit-appearance:none;font-size:1em;line-height:1.5em;list-style:none;}
input{outline:none;border:none;background:none;}
</style>
