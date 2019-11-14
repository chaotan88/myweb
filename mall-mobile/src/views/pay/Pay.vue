<template>
  <div class="pay">
    <!-- 商品总价 -->
    <ul class="price-box clr">
      <li class="left">待支付</li>
      <li class="right">¥{{orderPrice ? orderPrice : orderAmountInfo.orderTotalAmount | moneyFilter}}</li>
    </ul>
    <!-- 支付方式 -->
    <ol class="payType-box">
      <li class="clr" :class="val.isDisabled ? 'noPay' : ''" v-for="(val, key) in payWay" @click="selectedPayFun(val, key)" v-if="val.showPay">
        <div class="left">
          <img :src="val.icon" >
        </div>
        <div class="mid">
          <div>
            {{val.name}}
            <span v-if="key == 'balancePay'">(可用余额: {{accountAmount.balance | moneyFilter}})</span><!-- 余额支付 -->
            <span v-if="key == 'integralPay'">(可用积分: {{accountAmount.cashPoints | moneyFilter}})</span><!-- 通用积分支付 -->
          </div>
          <div  class="balance-pay-tip">{{val.prohibitTip}}</div> <!-- 禁止使用文字提示 -->
        </div>
        <div class="right">
          <icon v-if="key===currentPayType" type="success"></icon>
          <icon v-else type="circle"></icon>
        </div>
      </li>
    </ol>
    <div class="noPayWayTip" v-if="prohibitPay">没有可用支付方式</div>
    <!--v-if="currentPayType == 'integralPay' || currentPayType == 'balancePay'"-->
    <vuePayKeyboard  ref="pay" v-model="val" :is-pay='showPay' @close='showPay=false' @forget="forgetPwd" @pas-end='pasEnd' :payStatusText="payStatusText" pay-title="身份认证"> </vuePayKeyboard>
    <!--银联支付表单-->
    <form :method="unionPayData.formData.requestMethod" :action="unionPayData.formData.requestAction" :accept-charset="unionPayData.formData.requestCharset" v-if="JSON.stringify(unionPayData.formData) !== '{}'" ref="formSub" class="formSub">
      <template v-for="(val, key) in unionPayData.optionData">
        <input :name="key" :value="val"/>
      </template>
    </form>
    <!-- 提交按钮 -->
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
        orderPrice: 0,             // 订单金额
        val: '',
        payStatusText: '',
        showPay: false,
        buyType: '',               // 订单购买类型
        orderType: '',             // 订单类型
        payOrderId: '',            // 订单id
        payOrderNo: '',            // 订单no
        arr: [],                   // 支付信息
        payWay: {
          integralPay: {
            icon: require('../../assets/images/wallet/integralPay.png'),
            name: '通用积分支付',
            isDisabled: false,
            showPay: true,
            prohibitTip: ''
          },
          weChatPay: {
            icon: require('../../assets/images/weChat.png'),                            // 支付图标
            name: '微信支付',                                                           // 支付名称
            isDisabled: false,                                                         // 支付方式是否禁用
            showPay: true,                                                             // 是否显示此支付方式
            prohibitTip: '推荐微信用户使用'                                             // 禁止使用文字提示
          },
          aliPay: {
            icon: require('../../assets/images/payTreasure.png'),
            name: '支付宝支付',
            isDisabled: false,
            showPay: true,
            prohibitTip: '推荐支付宝用户使用'
          },
          unionPay: {
            icon: require('../../assets/images/unionPay.png'),
            name: '银联支付',
            isDisabled: false,
            showPay: true,
            prohibitTip: '推荐银联用户使用'
          },
          offlinePay: {
            icon: require('../../assets/images/offLinePay.png'),
            name: '线下支付',
            isDisabled: false,
            showPay: true,
            prohibitTip: '推荐线下支付用户使用'
          },
          balancePay: {
            icon: require('../../assets/images/balancePay.png'),
            name: '余额支付',
            isDisabled: false,
            showPay: true,
            prohibitTip: ''
          }
        },
        unionPayData: {
          formData: {},
          optionData: {}
        },                               // 银联支付数据
        confirmOrderType: '',            // 下单的类型
        prohibitPay: false,              // 禁止支付
        currentPayType: '',              // 当前支付方式：默认是微信支付
        token: '',                       // 用户token
        orderAmountInfo: {},             // 获取的订单信息
        limitMoney: 50000,               // 最大金额
        isPayPasswordSte: '',            // 是否设置交易密码
        balancePayFailMsg: '',           // 余额支付失败信息
        accountAmount: {}                // 账户金额
      }
    },
    mounted: function () {
      console.log(this.currentPayType, 'currentPayType1414')
      this.confirmOrderType = parseInt(localStorage.getItem('CONFIRM_ORDER_TYPE'))         // 下单的类型 1正常订单 2 享订单 3消费积分订单 4联盟积分订单 5芯豆订单
      this.orderPrice = this.$route.query.orderPrice                                       // 地址栏订单金额
      this.buyType = this.$route.query.buyType                                             // 订单购买类型 1 商品订单  2 票务订单
      this.orderType = parseInt(localStorage.getItem('orderType'))                         // 订单类型 1商城订单 2 加盟费订单
      this.payOrderId = localStorage.getItem('payOrderId')                                 // 订单id
      this.payOrderNo = localStorage.getItem('payOrderNo')                                 // 订单orderNo
      this.token = JSON.parse(localStorage.getItem('bsbUserInfo')).token
      this.isSetPayPassword()                                                              // 是否设置交易密码
      this.getPayMoney()                                                                   // 获取订单金额及订单编号
    },
    /**
     * 监控所有支付是否可用
    */
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
       * 获取支付方式配置
      */
      getPaySetting () {
        this.$http.get(this.api.paySetting, {
          params: {
            orderNo: this.orderAmountInfo.orderNo
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            // 分别是：通用积分支付、微信支付、支付宝支付、银联支付、线下支付、余额支付
            let iswe = this.isWeiXin()
            this.payWay.integralPay.showPay = resData.data.cashPointsPayStatus ? !!true : !!false
            this.payWay.weChatPay.showPay = resData.data.wxPayStatus ? !!true : !!false
            this.payWay.aliPay.showPay = (resData.data.aliPayStatus && !iswe) ? !!true : !!false
            this.payWay.unionPay.showPay = resData.data.chinapayPayStatus ? !!true : !!false
            this.payWay.offlinePay.showPay = resData.data.offlinePayStatus ? !!true : !!false
            this.payWay.balancePay.showPay = resData.data.balancePayStatus ? !!true : !!false
          }
          // 默认
          var deft = ''
          Object.keys(this.payWay).forEach((key) => {
            if (!this.payWay[key].isDisabled && this.payWay[key].showPay) {
              if (!deft) {
                deft = key // 重新指定默认付款方式
              }
            }
          })
          this.currentPayType = deft
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
            this.accountAmount = resData.data
            if (this.orderAmountInfo.orderTotalAmount > this.accountAmount.cashPoints && this.payWay.integralPay.showPay) {
              this.payWay.integralPay.isDisabled = true         // 通用积分支付不可用
              this.payWay.integralPay.prohibitTip = '通用积分不足'
            } else {
              this.currentPayType = ''               // 默认勾选通用积分支付
            }
            if (this.orderAmountInfo.orderTotalAmount > this.accountAmount.balance || this.payWay.integralPay.balancePay) {
              this.payWay.balancePay.isDisabled = true        // 余额支付不可用
              this.payWay.balancePay.prohibitTip = '余额不足'
            }
            this.getPaySetting()      // 支付配置
          }
        })
      },
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
            // 授权后自动支付
            if (!this.$route.query.redirect) {
              // 微信授权
              if (localStorage.getItem('payType') === 'weChatPay') {
                this.currentPayType = localStorage.getItem('payType')
              }
              this.goPay()
            }
            this.getAccountBalance()
          } else {
            Object.keys(this.payWay).forEach((key) => {
              this.payWay[key].isDisabled = true
            })
          }
        })
      },
      /**
       * 选择支付方式
      */
      selectedPayFun (val, key) {
        var payTip = val.prohibitTip
        if (val.isDisabled) {
          this.$vux.toast.text(payTip)
          return false
        }
        this.currentPayType = key
        localStorage.setItem('payType', this.currentPayType)
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
       * 银联支付
      */
      unionPay () {
        this.$http.get(this.api.unionPay, {
          params: {
            orderNo: this.orderAmountInfo.orderNo
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.unionPayData.formData = resData.data
            this.unionPayData.optionData = {...resData.data}
            delete this.unionPayData.optionData.requestAction
            delete this.unionPayData.optionData.requestCharset
            delete this.unionPayData.optionData.requestMethod
            setTimeout(() => {
              this.$refs.formSub.submit()
            }, 150)
          }
          this.$vux.toast.text(resData.msg)
        })
      },
      /**
       * 其他支付
      */
      othersPay (val) {
        var resUrl = ''
        if (this.currentPayType === 'balancePay') {      // 余额支付
          resUrl = this.api.balancePay
        } if (this.currentPayType === 'integralPay') {   // 通用积分支付
          resUrl = this.api.integralPay
        }
        this.$http.post(resUrl, {
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
       * 忘记支付密码
      */
      forgetPwd () {
        localStorage.setItem('setPawReturnPage', this.$route.fullPath)       // 设置支付密码完成后要跳转的页面
        localStorage.setItem('passwordType', 'edit')                        // 是设置还是修改
        this.$router.push('/verifyingPhone')
      },
      /**
       * 提交支付
       *
      */
      goPay () {
//        console.log(this.currentPayType, ' this.currentPayType')
        if (this.currentPayType === 'weChatPay') {
          localStorage.getItem('payType', 'weChatPay')
          if (!this.isWeiXin()) { // 微信-web支付
            this.noWechat()
          } else { // 微信-微信支付
            this.isWechat()
          }
        } else if (this.currentPayType === 'aliPay') {  // 支付宝支付
          localStorage.getItem('payType', 'aliPay')
          let resUrl = this.api.aliPay
          window.open(resUrl + '?orderNo=' + this.orderAmountInfo.orderNo + '&orderType=' + this.orderType + '&clientType=1' + '&token=' + this.token + '&buyType=' + this.buyType)
        } else if (this.currentPayType === 'unionPay') {   // 银联支付
          this.unionPay()
        } else if (this.currentPayType === 'offlinePay') { // 线下支付
          this.routerReplace({path: '/offlinePay', query: {orderNo: this.orderAmountInfo.orderNo, orderType: this.orderType}})
        } else if (this.currentPayType === 'balancePay' || this.currentPayType === 'integralPay') { // 余额支付和通用积分支付
//          console.log(this.currentPayType, ' this.currentPayTyp222e')
          if (this.isPayPasswordSte === 0) { // 未设置密码
            localStorage.setItem('setPawReturnPage', this.$route.fullPath)       // 设置支付密码完成后要跳转的页面
            localStorage.setItem('passwordType', 'set')                          // 是设置还是修改
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
        this.othersPay(val)
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
    .formSub{
      display: none;
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
