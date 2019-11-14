<template>
  <div class="pay">
    <!--商品总价-->
    <ul class="price-box clr">
      <li class="left">待支付</li>
      <li class="right">¥{{orderAmountInfo.orderTotalAmount | moneyFilter}}</li>
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
            <span v-if="v.type==4">(可用余额: {{availableBbalance | moneyFilter}})</span>
          </div>
          <div v-if="v.type==4" class="balance-pay-tip">{{balancePayTip}}</div>
        </div>
        <div class="right">
          <icon v-if="v.type===currentPayType" type="success"></icon>
          <icon v-else type="circle"></icon>
        </div>
      </li>
    </ol>
    <div class="noPayWayTip" v-if="prohibitPay">没有可用支付方式</div>
    <vuePayKeyboard ref="pay" v-model="val" :is-pay='showPay' @close='showPay=false' @pas-end='pasEnd' :payStatusText="payStatusText" pay-title="身份认证"> </vuePayKeyboard>
    <!--提交按钮-->
    <div class="submit-btn" @click='goPay' :class="prohibitPay ? 'prohibit' : ''">立即支付</div>
  </div>
</template>

<script>
  import { Icon } from 'vux'
  import {wexinPay} from '../../assets/js/wxpay'
  // import vuePayKeyboard from '../../../node_modules/vue-pay-keyboard/src/lib/vue-pay-keyboard'
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
        payTyps: '',
        buyType: '',               // 订单购买类型
        orderType: '',             // 订单类型
        payOrderId: '',            // 订单id
        payOrderNo: '',            // 订单no
        arr: [],                   // 支付信息
        payWay: [                  // 支付方式
          {
            type: 1,
            name: '微信支付',
            noPay: false
          },
          {
            type: 2,
            name: '支付宝支付',
            noPay: false
          },
          // {
          //   type: 3,
          //   name: '线下支付',
          //   noPay: false
          // },
          {
            type: 4,
            name: '余额支付',
            noPay: false
          }
        ],
        prohibitPay: false,        // 禁止支付
        currentPayType: 1,         // 当前支付方式：默认是微信支付
        token: '',                 // 用户token
        orderAmountInfo: {},       // 获取的订单信息
        limitMoney: 50000,         // 最大金额
        isPayPasswordSte: '',      // 是否设置交易密码
        balancePayFailMsg: '',     // 余额支付失败信息
        availableBbalance: 0,      // 可用余额
        balancePayTip: ''          // 余额支付文字提示
      }
    },
    mounted: function () {
      this.buyType = this.$route.query.buyType                                   // 订单购买类型 1 商品订单  2 票务订单
      this.orderType = parseInt(localStorage.getItem('orderType'))               // 订单类型 1商城订单 2 加盟费订单
      this.payOrderId = localStorage.getItem('payOrderId')                       // 订单id
      this.payOrderNo = localStorage.getItem('payOrderNo')                       // 订单orderNo
      this.payTyps = this.$route.query.payTyps                                   // 是多订单提交还是单订单提交
      this.token = JSON.parse(localStorage.getItem('bsbUserInfo')).token
      this.isSetPayPassword()                                                    // 是否设置交易密码
      this.getAccountBalance()                                                   // 获取账户余额及判断是否存在套餐商品
      this.getPayMoney()                                                         // 获取订单金额及订单编号
    },
    methods: {
      /**
       * 门票购买只能用微信和支付宝
      */
      ticketsBuy () {
        if (parseInt(this.buyType) === 2) {
          this.arr.splice(2, 2)
          let payArr = []
          this.arr.forEach((item) => {
            if (item.noPay === true) {
              payArr.push(item)
            }
          })
          if (payArr.length === this.arr.length) {
            this.prohibitPay = true
          } else {
            this.prohibit = false
          }
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
              if (this.payWay[3]) {
                this.payWay[3].noPay = true
              }
              this.balancePayTip = '订单不支持余额支付，请使用其他支付方式'
              // this.payWay.splice(3, 1)
            } if (resData.data === 1) {
              if (this.orderAmountInfo.orderTotalAmount > this.availableBbalance) {
                if (this.payWay[3]) {
                  this.payWay[3].noPay = true
                }
                this.balancePayTip = '余额不足'
              } else {
                if (this.payWay[3]) {
                  this.payWay[3].noPay = false
                }
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
            // 如果金额大于等于5万只能线下支付
            if (this.orderAmountInfo.orderTotalAmount >= this.limitMoney) {
              // 支付方式不可用
              this.payWay.forEach((item) => {
                if (item.type === 1 || item.type === 2) {
                  item.noPay = true
                }
              })
              this.arr = this.payWay
              if (this.payTyps !== 'ticket') {
                this.currentPayType = 3
              } else {
                this.currentPayType = ''
              }
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
            // 加盟费订单不能用余额支付
            // if (this.orderType === 2) {
            //   this.payWay[3].noPay = true
            //   this.balancePayTip = '只适用于套餐区商品'
            // }
            // 授权后自动支付
            if (!this.$route.query.redirect) {
              this.goPay()
            }
            this.ticketsBuy()          // 门票购买判断
          } else {
            this.payWay[3].noPay = true
            this.balancePayTip = '失败'
            this.arr = this.payWay
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
              // this.$router.replace({path: '/paySuccess'})
              window.location.replace(window.location.href.match(/.*mshop/gi)[0] + '/paySuccess?shopId=1&buyType=' + this.buyType)
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
        if (this.currentPayType === 1) {
          if (!this.isWeiXin()) { // 微信-web支付
            this.noWechat()
          } else { // 微信-微信支付
            this.isWechat()
          }
        } else if (this.currentPayType === 2) {  // 支付宝支付
          let resUrl = this.api.aliPay
          window.open(resUrl + '?orderNo=' + this.orderAmountInfo.orderNo + '&orderType=' + this.orderType + '&clientType=1' + '&token=' + this.token + '&buyType=' + this.buyType)
        } else if (this.currentPayType === 3) { // 线下支付
          window.location.replace(window.location.href.match(/.*mshop/gi)[0] + '/offlinePay?orderNo=' + this.orderAmountInfo.orderNo + '&orderType=' + this.orderType + '&shopId=1')
          // this.$router.replace({path: '/offlinePay', query: {orderNo: this.orderAmountInfo.orderNo, orderType: this.orderType}})
        } else if (this.currentPayType === 4) { // 余额支付
          if (this.isPayPasswordSte === 0) { // 未设置密码
            localStorage.setItem('setPawReturnPage', '/pay/orderPay')       // 设置支付密码完成后要跳转的页面
            localStorage.setItem('passwordType', 'set')                     // 是设置还是修改
            this.$router.push({path: '/verifyingPhone'})
          } if (this.isPayPasswordSte === 1) { // 已设置密码
            this.showPay = true
          } else {
            this.$vux.toast.text(this.balancePayFailMsg)
          }
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
