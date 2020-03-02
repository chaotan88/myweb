<template>
  <div class="recharge-vip-wrap"
    v-loading="loading"
    element-loading-text="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="recharge-list" v-if="!startPay">
      <!-- <div :class="['recharge-item', item.id === currentItem.id ? 'item-selected' : '']"
        v-for="item in rechargeList" :key="item.id" @click="currentItem = item">
        <div class="item-left">{{$t(`recharge.intercoms${item.intercoms}`)}}</div>
        <div class="item-right">
          <span class="price"><span class="dollor">$</span>{{item.price}}</span>
          <span class="price-rel">${{item.priceRel}}</span>
          <span v-if="item.isOffer" class="specialOffer">{{$t("recharge.specialOffer")}}</span>
        </div>
      </div>-->
      <el-form
        :inline="true"
        class="demo-form-inline"
        :label-width="$i18n.locale === 'zh' ? '120px' : '170px'"
        :rules="addRules"
        ref="addRules"
        :model="addForm"
      >
        <el-form-item :label="$t('recharge.deviceNumber')" prop="deviceNumber">
          <el-input placeholder="请输入内容" v-model.number="addForm.deviceNumber" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-else class="goods-info">
      <div>
        <span>{{$t("recharge.goodsName")}}:</span>
        <span>1年 {{orderInfo.deviceNumber}} 个设备</span>
      </div>
      <div>
        <span>{{$t("recharge.orderNumber")}}:</span>
        <span>{{orderInfo.orderNo}}</span>
      </div>
      <div>
        <span>{{$t("recharge.orderAccount")}}:</span>
        <span>{{orderInfo.phone}}</span>
      </div>
      <div>
        <span>{{$t("recharge.currentPrice")}}:</span>
        <span>{{orderInfo.currentPrice}}</span>
      </div>
      <div>
        <span>{{$t("recharge.beforeNumber")}}:</span>
        <span>{{orderInfo.beforeNumber}}</span>
      </div>
      <div>
        <span>{{$t("recharge.beforeRealNumber")}}:</span>
        <span>{{orderInfo.beforeRealNumber}}</span>
      </div>
      <div>
        <span>{{$t("recharge.beforeNoPayPrice")}}:</span>
        <span>{{orderInfo.beforeNoPayPrice}}</span>
      </div>
      <div>
        <span>{{$t("recharge.orderAmount")}}:</span>
        <span>{{orderInfo.currentPrice}}</span>
      </div>
    </div>
    <div class="item-desc" v-if="!startPay && addForm.deviceNumber > 0">
      {{$t("recharge.youCanManage")}}
      <span>{{addForm.deviceNumber}}{{$t("recharge.youCanManage2")}}</span>
      {{$t("recharge.youCanManage3")}}
      <span>{{$t("recharge.youCanManage4")}}</span>
      <span>{{$t("recharge.youCanManage5")}}</span>
    </div>
    <div class="pay-method" v-if="!startPay">
      <span>{{$t("recharge.paymentMethod")}}：</span>
      <div class="payment-method-val">
        <el-radio></el-radio>
        <img src="../../../../static/img/u7462.png" />
        Stripe
        <span class="tips">荐</span>
      </div>
    </div>
    <!-- <div id='payapp' v-else>
      <div class="form-row">
        <label for="card-element">
          Credit or debit card
        </label>
        <div id="card-element">
        </div>
        <div id="card-errors" role="alert"></div>
      </div>
      <button class='pay-with-stripe' @click='pay'>Submit Payment</button>
    </div> -->
    <div id='payapp' v-else>
      <p>Please give us your payment details:</p>
      <!-- <card class='stripe-card'
        :class='{ complete }'
        stripe='pk_test_ffVzg2f5DlxbDYXOHjh7CFQv00cHMSsuGI'
        :options='stripeOptions'
        @change='complete = $event.complete'
      /> -->
      <div class='credit-card-inputs' :class='{ complete }'>
        <card-number class='stripe-element card-number'
          ref='cardNumber'
          :stripe='stripe'
          :options='stripeOptions'
          @change='number = $event.complete'
        />
        <card-expiry class='stripe-element card-expiry'
          ref='cardExpiry'
          :stripe='stripe'
          :options='stripeOptions'
          @change='expiry = $event.complete'
        />
        <card-cvc class='stripe-element card-cvc'
          ref='cardCvc'
          :stripe='stripe'
          :options='stripeOptions'
          @change='cvc = $event.complete'
        />
      </div>
      <!-- <button class='pay-with-stripe' @click='pay' :disabled='!complete'>Pay with credit card</button> -->
    </div>
    <!-- <div class="payment-amount">
      <span>{{$t("recharge.paymentAmount")}}: </span>
      <span class="dollor">$</span>
      <span class="amount">{{currentItem.price}}</span>
    </div>-->
    <div class="save-box">
      <el-button type="primary" @click="payNow" v-if="!startPay">{{$t("recharge.createOrder")}}</el-button>
      <el-button type="primary" @click="pay" v-else>{{$t("recharge.payNow")}}</el-button>
      <el-button type="primary" @click="backTo" v-if="startPay" class="back-button">返回</el-button>
    </div>
  </div>
</template>
<script>
// import { stripeKey, stripeOptions } from './stripeConfig.json'
// import { Card, createToken } from 'vue-stripe-elements'
import { CardNumber, CardExpiry, CardCvc, createToken } from 'vue-stripe-elements'

export default {
  data () {
    return {
      rechargeList: [
        {
          id: 1,
          intercoms: 5,
          price: 99.9,
          priceRel: 199.9,
          isOffer: true
        },
        {
          id: 2,
          intercoms: 10,
          price: 189.9,
          priceRel: 299.9
        },
        {
          id: 3,
          intercoms: 20,
          price: 269.9,
          priceRel: 399.9
        },
        {
          id: 4,
          intercoms: 50,
          price: 469.9,
          priceRel: 799.9
        }
      ],
      currentItem: {},
      startPay: false,
      // orderInfo: {
      //   goodsName: '1年5个设备VIP',
      //   orderNumber: '201904233455345345',
      //   orderAccount: '18717166601'
      // },
      addForm: {
        deviceNumber: ''
      },
      payType: 1,
      addRules: {
        deviceNumber: [
          { required: true, trigger: 'blur' },
          { type: 'number', message: '设备是数量必须为正整数' }
        ]
      },
      orderInfo: {},
      complete: false,
      stripeOptions: {},
      card: {},
      loading: false,
      number: false,
      expiry: false,
      cvc: false,
      stripe: 'pk_test_ffVzg2f5DlxbDYXOHjh7CFQv00cHMSsuGI'
    }
  },
  components: { CardNumber, CardExpiry, CardCvc },
  mounted () {
    // required('../../../../../static/stripe.js')
    this.currentItem = this.rechargeList[0]
    // this.$nextTick(() => {
    //   let style = {
    //     base: {
    //       // Add your base input styles here. For example:
    //       fontSize: '16px',
    //       color: '#32325d'
    //     }
    //   }
    //   let card = elements.create('card', { style: style })
    //   card.mount('#card-element')
    //   this.card = card
    // })
  },
  methods: {
    payNow () {
      this.$refs['addRules'].validate(valid => {
        if (valid) {
          this.$http
            .post('@ROOT_API/dfDeviceOrder/addOrder', {
              payType: this.payType,
              deviceNumber: this.addForm.deviceNumber
            })
            .then(res => {
              if (res.data.status === '1') {
                this.orderInfo = res.data.data
                if (!this.startPay) this.startPay = true
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg || this.$t('common.errorMsg')
                })
              }
            })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('common.deviceMumberMustIsNumber')
          })
        }
      })
    },
    backTo () {
      this.startPay = false
    },
    paySubmit () {
      this.$http
        .post('@ROOT_API/dfDeviceOrder/payNotify', {
          orderNo: this.orderInfo.orderNo
        })
        .then(res => {
          if (res.data.status === '1') {
            this.$message({
              type: 'success',
              message: '购买成功,重新登录后生效'
            })
            this.startPay = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
            return false
          }
        })
    },
    pay () {
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      this.loading = true
      let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
      createToken().then(data => {
        if (data && data.token) {
          let token = data.token
          this.$http.post('@ROOT_API/dfDeviceOrder/payNotify', {
            orderNo: this.orderInfo.orderNo,
            stripeToken: token.id,
            orderPrice: this.orderInfo.currentPrice,
            email: adminInfo.email,
            card: this.getValByName('cardnumber'),
            cvc: this.getValByName('cardnumber'),
            validTrueDate: this.getValByName('cardnumber')
          })
          .then(res => {
            this.loading = false
            if (res.data.status === '1') {
              this.$message({
                type: 'success',
                message: '购买成功,重新登录后生效'
              })
              this.startPay = false
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg || this.$t('common.errorMsg')
              })
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: 'Failed to get token'
          })
          this.loading = false
        }
      })
    },
    getValByName (name) {
      if (!name) return ''
      let elements = document.getElementsByName(name)
      if (elements && elements.length > 0) {
        return elements[0].value
      }
      return ''
    },
    update () {
      this.complete = this.number && this.expiry && this.cvc
      // field completed, find field to focus next
      if (this.number) {
        if (!this.expiry) {
          this.$refs.cardExpiry.focus()
        } else if (!this.cvc) {
          this.$refs.cardCvc.focus()
        }
      } else if (this.expiry) {
        if (!this.cvc) {
          this.$refs.cardCvc.focus()
        } else if (!this.number) {
          this.$refs.cardNumber.focus()
        }
      }
      // no focus magic for the CVC field as it gets complete with three
      // numbers, but can also have four
    }
  },
  watch: {
    number () {
      this.update()
    },
    expiry () {
      this.update()
    },
    cvc () {
      this.update()
    }
  }
}
</script>
<style lang="less">
// .InputElement {
//   background-color: #fff;
//   border-radius: 4px;
//   border: 1px solid #dcdfe6;
//   height: 40px;
//   width: 300px;
//   line-height: 40px;
// }
.recharge-vip-wrap {
  .recharge-list {
    .el-form {
      .el-form-item__label {
        margin-left: -23px;
      }
    }
  }
}
#payapp {
  background: #fff;
  padding: 20px;
  border-top: 1px dashed #ddd;
  p {
    margin: 10px 0;
  }
  .pay-with-stripe {
    margin-top: 10px;
    cursor: pointer;
    border-color: #33719b;
    background-color: #33719b;
    color: #fff;
    padding: 6px;
    border: 1px;
    border-radius: 4px;
  }
  .pay-with-stripe:hover {
    background: #1b8dda;
  }
}
.stripe-card {
  width: 300px;
  border: 1px solid grey;
}
.stripe-card.complete {
  border-color: green;
}
</style>
<style lang='less' scoped>
.recharge-vip-wrap {
  .save-box {
    text-align: center;
    margin-top: 30px;
    .el-button--primary {
      padding: 10px 30px;
    }
    .back-button {
      background: #fff !important;
      color: #333333;
      border: 1px solid #33719b;
    }
  }
  .recharge-list {
    display: flex;
    justify-content: space-around;
    background: #fff;
    // height: 120px;
    justify-content: left;
    .el-form {
      margin-top: 20px;
    }
    .recharge-item {
      width: 22%;
      height: 80px;
      border-radius: 5px;
      border: 1px solid #eee;
      display: flex;
      justify-content: space-around;
      position: relative;
      cursor: pointer;
      margin-top: 20px;
      .item-left {
        border-right: 1px solid #eee;
        width: 50px;
        padding-top: 17px;
        padding-right: 10px;
      }
      .item-right {
        margin: auto 0;
        .price {
          .dollor {
            font-size: 26px;
          }
        }
        .price-rel {
          color: #999999;
          text-decoration: line-through;
        }
        .specialOffer {
          background: #cc9900;
          position: absolute;
          top: 0;
          right: 0;
          width: 50px;
          color: #fff;
          text-align: center;
        }
      }
    }
    .item-selected {
      border: 1px solid #cc9900;
    }
  }
  .goods-info {
    background: #fff;
    padding: 20px;
    div {
      margin-bottom: 10px;
      display: flex;
      span:nth-child(1) {
        color: #999999;
        width: 220px;
        display: block;
        text-align: right;
        margin-right: 20px;
      }
    }
  }
  .item-desc {
    background: #fff;
    color: #666666;
    font-size: 13px;
    padding-left: 20px;
    span {
      color: red;
    }
    padding-bottom: 20px;
  }
  .pay-method {
    background: #fff;
    padding-top: 20px;
    display: flex;
    padding-bottom: 20px;
    padding-left: 20px;
    .payment-method-val {
      height: 45px;
      border: 1px solid #cc9900;
      border-radius: 5px;
      padding: 0 20px;
      line-height: 43px;
      position: relative;
      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
      .el-radio {
        margin-right: 0;
      }
    }
    span {
      line-height: 43px;
    }
    .tips {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 1;
      background: #cc9900;
      color: #fff;
      font-size: 15px;
      width: 32px;
      height: 17px;
      text-align: center;
    }
  }
  .payment-amount {
    background: #fff;
    padding-left: 20px;
    padding-bottom: 20px;
    .dollor {
      font-size: 26px;
      color: red;
    }
    .amount {
      color: red;
    }
  }
}
</style>
