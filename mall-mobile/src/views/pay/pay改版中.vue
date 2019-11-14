<template>
  <div class="pay">
    <!--商品总价-->
    <ul class="price-box clr">
      <li class="left">待支付</li>
      <li class="right">¥{{orderAmountInfo.orderTotalAmount | moneyFilter}}</li>
    </ul>
    <!--支付方式-->
    <ol class="payType-box">
      <li class="clr" :class="val.isDisabled ? 'noPay' : ''" v-for="(val, key) in payWay" @click="selectedPayFun(val, key)" v-if="val.showPay">
        <div class="left">
          <img :src="val.icon" >
        </div>
        <div class="mid">
          <div>
            {{val.name}}
            <span v-if="key == 'balancePay'">(可用余额: {{availableBbalance | moneyFilter}})</span>
          </div>
          <div v-if="key == 'balancePay'" class="balance-pay-tip">{{balancePayTip}}</div>
        </div>
        <div class="right">
          <icon v-if="key===currentPayType" type="success"></icon>
          <icon v-else type="circle"></icon>
        </div>
      </li>
    </ol>
    <div class="noPayWayTip" v-if="prohibitPay">没有可用支付方式</div>
    <vuePayKeyboard ref="pay" v-model="val" :is-pay='showPay' @close='showPay=false' @pas-end='pasEnd' :payStatusText="payStatusText" pay-title="身份认证"> </vuePayKeyboard>
    <!--提交按钮-->
    <div class="submit-btn" @click="prohibitPay ? '' : goPay()" :class="prohibitPay ? 'prohibit' : ''">立即支付</div>
  </div>
</template>

<script>
  import { Icon } from 'vux'
  import {wexinPay} from '../../assets/js/wxpay'
  import vuePayKeyboard from '../../components/vue-pay-keyboard'
  import { setTimeout } from 'timers'
  export default {
    components: {
      Icon,
      vuePayKeyboard
    },
    data () {
      return {
        val: '',
        payStatusText: '',
        showPay: false,
        buyType: '',               // 订单购买类型
        orderType: '',             // 订单类型
        payOrderId: '',            // 订单id
        payOrderNo: '',            // 订单no
        arr: [],                   // 支付信息
        payWay: {
          weChatPay: {
            icon: require('../../assets/images/weChat.png'),                            // 支付图标
            name: '微信支付',                                                           // 支付名称
            isDisabled: false,                                                         // 支付方式是否禁用
            showPay: true                                                              // 是否显示此支付方式
          },
          aliPay: {
            icon: require('../../assets/images/payTreasure.png'),
            name: '支付宝支付',
            isDisabled: false,
            showPay: true
          },
          offlinePay: {
            icon: require('../../assets/images/offLinePay.png'),
            name: '线下支付',
            isDisabled: false,
            showPay: false
          },
          balancePay: {
            icon: require('../../assets/images/balancePay.png'),
            name: '余额支付',
            isDisabled: false,
            showPay: true
          }
        },
        prohibitPay: false,             // 禁止支付
        currentPayType: '',             // 当前支付方式：默认是微信支付
        token: '',                      // 用户token
        orderAmountInfo: {},            // 获取的订单信息
        limitMoney: 50000,              // 最大金额
        isPayPasswordSte: '',           // 是否设置交易密码
        balancePayFailMsg: '',          // 余额支付失败信息
        availableBbalance: 0,           // 可用余额
        balancePayTip: ''               // 余额支付文字提示
      }
    },
    mounted: function () {
      this.buyType = this.$route.query.buyType                                   // 订单购买类型 1 商品订单  2 票务订单
      this.orderType = parseInt(localStorage.getItem('orderType'))               // 订单类型 1商城订单 2 加盟费订单
      this.payOrderId = localStorage.getItem('payOrderId')                       // 订单id
      this.payOrderNo = localStorage.getItem('payOrderNo')                       // 订单orderNo
      this.token = JSON.parse(localStorage.getItem('bsbUserInfo')).token
      this.isSetPayPassword()                                                    // 是否设置交易密码
      this.getAccountBalance()                                                   // 获取账户余额及判断是否存在套餐商品
      this.getPayMoney()                                                         // 获取订单金额及订单编号
    },
    watch: {
      payWay: {
        handler () {
          let payArr = []
          Object.keys(this.payWay).forEach((key) => {
            if (this.payWay[key].isDisabled || !this.payWay[key].showPay) {
              payArr.push(key)
            }
          })
          if (payArr.length === Object.keys(this.payWay).length) {
            this.prohibitPay = true
          } else {
            this.prohibit = false
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      /**
       * 门票购买只能用微信和支付宝
      */
      ticketsBuy () {
        if (parseInt(this.buyType) === 2) {
          this.payWay.offlinePay.showPay = false         // 线下支付不可用
          this.payWay.balancePay.showPay = false         // 余额支付不可用
        }
      },
      /**
       * 判断余额支付是否设置了交易密码
      */
      isSetPayPassword () {
        this.$http.get(this.api.isSetPayPassword).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.isPayPasswordSte = resData.data
          }
          this.balancePayFailMsg = resData.msg
        })
      },
      /**
       * 是否支持余额支付
      */
      judgeIfSetmeat () {
        this.$http.get(this.api.getWhetherBlancePayBySkus, {
          params: {
            skus: JSON.parse(localStorage.getItem('skuIdsArr')).toString()
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            if (resData.data === 0) {
              this.payWay.balancePay.isDisabled = true          // 余额支付不可用
              this.balancePayTip = '订单不支持余额支付，请使用其他支付方式'
            } if (resData.data === 1) {
              if (this.orderAmountInfo.orderTotalAmount > this.availableBbalance) {
                this.payWay.balancePay.isDisabled = true        // 余额支付不可用
                this.balancePayTip = '余额不足'
              } else {
                this.payWay.balancePay.isDisabled = false       // 余额支付可用
              }
            }
          }
        })
      },
      /**
       * 获取账户余额
      */
      getAccountBalance () {
        this.$http.get(`${this.api.getMemberPoints}`, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.availableBbalance = resData.data.balance
          }
          if (this.orderType !== 2 && parseInt(this.buyType) !== 2) {
            this.judgeIfSetmeat()
          }
        })
      },
      /**
       * 获取合伙人提交申请 订单信息
      */
      /**
       * 查询订单信息
      */
      getPayMoney () {
        this.$http.get(this.api.getOrderAmount, {
          params: {
            orderNo: this.payOrderNo
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.orderAmountInfo = resData.data
            // 如果金额大于等于5万只能线下支付和余额支付
            if (this.orderAmountInfo.orderTotalAmount >= this.limitMoney) {
              this.payWay.weChatPay.isDisabled = true         // 微信支付不可用
              this.payWay.aliPay.isDisabled = true            // 支付宝支付不可用
              if (this.payWay.offlinePay.showPay && !this.payWay.offlinePay.isDisabled) {
                this.currentPayType = 'offlinePay'            // 默认勾选线下支付方式
              } else {
                this.currentPayType = ''
              }
            } else {
              this.currentPayType = 'weChatPay'               // 默认勾选微信支付方式
            }
            // 授权后自动支付
            if (!this.$route.query.redirect) {
              this.goPay()
            }
            this.ticketsBuy()                                 // 门票购买判断
          } else {
            Object.keys(this.payWay).forEach((key) => {
              this.payWay[key].isDisabled = true
            })
            this.currentPayType = ''
            this.balancePayTip = '失败'
          }
        })
      },
      /**
       * 选择支付方式
      */
      selectedPayFun (val, key) {
        var payTip = key === 'balancePay' ? this.balancePayTip : '超出在线支付范围'
        if (val.isDisabled) {
          this.$vux.toast.text(payTip)
          return false
        }
        this.currentPayType = key
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
            if (this.orderType === 1) {
              window.location.href = res.data.data.mweb_url + '&redirect_url=http%3A%2F%2F' + this.api.paySuccessUrl + '%2Fmshop%2FpaySuccess?buyType=' + this.buyType
            } if (this.orderType === 2) {
              window.location.href = res.data.data.mweb_url + '&redirect_url=http%3A%2F%2F' + this.api.paySuccessUrl + '%2Fmshop%2FpartnerPaySuccess'
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
          if (resData.status !== this.api.ERR_OK && parseInt(resData.status) !== 302) {
            this.$vux.toast.text(resData.msg)
          }
          if (resData.status === this.api.ERR_OK) {
            wexinPay(resData.data, this.buyType)
          } else if (parseInt(resData.status) === 302) {
            // 授权
            window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.api.appid}&redirect_uri=http%3A%2F%2F${this.api.paySuccessUrl}%2Fbehindshop%2FwxAuthor%2Fdefault&response_type=code&scope=snsapi_base&state=${this.token}-${this.buyType}&connect_redirect=1#wechat_redirect`
          }
        })
      },
      /**
       * 线下支付
      */
      offlinePay () {
        this.$http.get(this.api.offlinePay, {
          params: {
            orderNo: this.orderAmountInfo.orderNo
          }
        }).then((res) => {
          if (res.data.status === this.api.ERR_OK) {
            this.$router.replace({path: '/paySuccess', query: {offlinePay: 'offlinePay', buyType: this.buyType}})
          }
          this.$vux.toast.text(res.data.msg)
        })
      },
      /**
       * 余额支付
      */
      balancePay (val) {
        this.$http.post(this.api.balancePay, {
          orderNo: this.orderAmountInfo.orderNo,
          paymentPassword: val
        }).then((res) => {
          let resData = res.data
          setTimeout(() => { // 模拟请求接口验证密码中
            if (resData.status === this.api.ERR_OK) {
              this.$refs.pay.$payStatus(true) // 传递给子组件
              this.payStatusText = '成功'
              this.routerReplace({path: '/paySuccess', query: {buyType: this.buyType}})
            } else {
              this.$refs.pay.$payStatus(false)
              this.payStatusText = resData.msg
            }
          }, 1000)
        })
      },
      /**
       * 提交支付
       *
      */
      goPay () {
        if (this.currentPayType === 'weChatPay') {
          if (!this.isWeiXin()) { // 微信-web支付
            this.noWechat()
          } else { // 微信-微信支付
            this.isWechat()
          }
        } else if (this.currentPayType === 'aliPay') {  // 支付宝支付
          let resUrl = this.api.aliPay
          window.open(resUrl + '?orderNo=' + this.orderAmountInfo.orderNo + '&orderType=' + this.orderType + '&clientType=1' + '&token=' + this.token + '&buyType=' + this.buyType)
        } else if (this.currentPayType === 'offlinePay') { // 线下支付
          this.routerReplace({path: '/offlinePay', query: {orderNo: this.orderAmountInfo.orderNo, orderType: this.orderType}})
        } else if (this.currentPayType === 'balancePay') { // 余额支付
          if (this.isPayPasswordSte === 0) { // 未设置密码
            localStorage.setItem('setPawReturnPage', '/pay/orderPay')       // 设置支付密码完成后要跳转的页面
            localStorage.setItem('passwordType', 'set')                     // 是设置还是修改
            this.$router.push({path: '/verifyingPhone'})
          } if (this.isPayPasswordSte === 1) { // 已设置密码
            this.showPay = true
          } else {
            this.$vux.toast.text(this.balancePayFailMsg)
          }
        } else {
          this.$vux.toast.text('请选择支付方式')
          return false
        }
      },
      /**
       * 余额完成支付
      */
      pasEnd (val) {
        this.balancePay(val)
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
    .noPayWayTip{
      font-size: .26rem;
      padding: 0 .3rem;
      margin-top: .2rem;
      color: #f23030;
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
      &.prohibit{
        background: #ccc;
      }
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
