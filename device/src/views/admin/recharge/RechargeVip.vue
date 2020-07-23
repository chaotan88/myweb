<template>
  <!-- <div class="recharge-vip-wrap"
    v-loading="loading"
    element-loading-text="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="recharge-list" v-if="!startPay">
      <el-form
        :inline="true"
        class="demo-form-inline"
        :label-width="$i18n.locale === 'zh' ? '120px' : '170px'"
        :rules="addRules"
        ref="addRules"
        :model="addForm"
      >
        <el-form-item :label="$t('recharge.deviceNumber')" prop="deviceNumber">
          <el-input placeholder="Please enter" v-model.number="addForm.deviceNumber" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-else class="goods-info">
      <div>
        <span>{{$t("recharge.goodsName")}}:</span>
        <span>1 Years of {{orderInfo.deviceNumber}} PCS</span>
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
      <div>
        <span>{{$t("recharge.autoRenewal")}}:</span>
        <span><el-checkbox v-model="autoRenewal" true-label="1" false-label="0"></el-checkbox></span>
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
        <span class="tips">Hot</span>
      </div>
    </div>
    <div id='payapp' v-else>
      <p>Please give us your payment details:</p>
      <div class='credit-card-inputs' :class='{ complete }'>
        <div class="card-item">
          <span class="card-label">Card Number</span>
          <card-number class='stripe-element card-number'
            ref='cardNumber'
            :stripe='stripe'
            :options='Options'
            @change='number = $event.complete'
          />
        </div>
        <div class="card-item">
          <span class="card-label">Card Expiry</span>
          <card-expiry class='stripe-element card-expiry'
            ref='cardExpiry'
            :stripe='stripe'
            :options='expiryOptions'
            @change='expiry = $event.complete'
          />
        </div>
        <div class="card-item">
          <span class="card-label">Card Cvc</span>
          <card-cvc class='stripe-element card-cvc'
            ref='cardCvc'
            :stripe='stripe'
            :options='Options'
            @change='cvc = $event.complete'
          />
        </div>
      </div>
    </div>
    <div class="save-box">
      <el-button type="primary" @click="payNow" v-if="!startPay">{{$t("recharge.createOrder")}}</el-button>
      <el-button type="primary" @click="pay" v-else>{{$t("recharge.payNow")}}</el-button>
      <el-button type="primary" @click="backTo" v-if="startPay" class="back-button">{{$t("common.back")}}</el-button>
    </div>
  </div> -->
  <div class="recharge-vip-wrap"
    v-loading="loading"
    element-loading-text="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div v-if="packageStatus === 0 && !startPay">
      <div class="status-remark">You have not purchased any package, please select package</div>
      <div class="package-content">
        <div class="block-title">Select Package</div>
        <div class="package-list">
          <div :class="['package-item', item.id === currentPackage.id ? 'select-item' : '']"
            v-for="(item, index) in dfSoftPackagePriceList" :key="index" @click="selectPackage(item)">
            <i class="icon-font el-icon-circle-check" v-if="item.id === currentPackage.id"></i>
            <div>{{item.packageName}}</div>
            <div>{{item.packagePrice}} {{currency}}</div>
            <div>{{item.packageDeviceNum}} PCS</div>
          </div>
        </div>
      </div>
      <div class="date-content">
        <div class="block-title">Select Date</div>
        <div class="date-list">
          <div :class="['date-item', item.id === currentDate.id ? 'select-item' : '']"
            v-for="(item, index) in dfSoftPackageDateList" :key="index" @click="selectDate(item)"
            :title="index > 3 ? 'The longer the purchase period, the more discount' : ''">
            <!-- <i class="icon-font el-icon-circle-check" v-if="item.id === currentDate.id"></i> -->
            <div>{{item.dateName}}<span v-if="index > 3">hot</span></div>
            <!-- <div>{{item.detail}}</div>
            <div>{{item.remark}}</div> -->
          </div>
        </div>
      </div>
      <div class="price-content">
        Total Price: <span><span style="font-size: 20px">{{totalPrice}}</span> {{currency}}</span>
      </div>
    </div>
    <div v-else-if="packageStatus === 1 && !startPay">
      <div class="status-remark">Current package information</div>
      <div class="goods-info">
        <div>
          <span>{{$t("recharge.country")}}:</span>
          <span>{{currentInfo.country}}</span>
        </div>
        <div>
          <span>{{$t("recharge.pachageName")}}:</span>
          <span>{{currentInfo.packageName}}</span>
        </div>
        <div>
          <span>{{$t("recharge.deviceNumber")}}:</span>
          <span>{{currentInfo.packageDeviceNum}}</span>
        </div>
        <div>
          <span>{{$t("recharge.duration")}}:</span>
          <span>{{currentInfo.vipExpireDate | dateFilter}}</span>
        </div>
      </div>
      <div class="package-content" v-if="pageType === 'upgrade'">
        <div class="block-title">Select Package</div>
        <div class="package-list">
          <div :class="['package-item', item.id === currentPackage.id ? 'select-item' : '']"
            v-for="(item, index) in dfSoftPackagePriceListUpgrade" :key="index" @click="selectPackage(item)">
            <i class="icon-font el-icon-circle-check" v-if="item.id === currentPackage.id"></i>
            <div>{{item.packageName}}</div>
            <div>{{item.packagePrice}} {{currency}}</div>
            <div>{{item.packageDeviceNum}} PCS</div>
          </div>
        </div>
      </div>
      <div class="date-content" v-if="pageType === 'renew'">
        <div class="block-title">Select Date</div>
        <div class="date-list">
          <div :class="['date-item', item.id === currentDate.id ? 'select-item' : '']"
            v-for="(item, index) in dfSoftPackageDateList" :key="index" @click="selectDate(item)"
            :title="index > 3 ? 'The longer the purchase period, the more discount' : ''">
            <!-- <i class="icon-font el-icon-circle-check" v-if="item.id === currentDate.id"></i> -->
            <div>{{item.dateName}}<span v-if="index > 3">hot</span></div>
            <!-- <div>{{item.detail}}</div>
            <div>{{item.remark}}</div> -->
          </div>
        </div>
      </div>
      <div class="price-content">
        Total Price: <span><span style="font-size: 20px">{{totalPrice}}</span> {{currency}}</span>
      </div>
    </div>
    <div v-else-if="packageStatus === 2 && !startPay">
      <div class="status-remark">Current package information</div>
      <div class="goods-info">
        <div>
          <span>{{$t("recharge.country")}}:</span>
          <span>{{currentInfo.country}}</span>
        </div>
        <div>
          <span>{{$t("recharge.pachageName")}}:</span>
          <span>{{currentInfo.packageName}}</span>
        </div>
        <div>
          <span>{{$t("recharge.deviceNumber")}}:</span>
          <span>{{currentInfo.packageDeviceNum}}</span>
        </div>
        <div>
          <span>{{$t("recharge.duration")}}:</span>
          <span>{{currentInfo.vipExpireDate | dateFilter}}</span>
        </div>
      </div>
      <div class="date-content" v-if="pageType === 'renew'">
        <div class="block-title">Select Date</div>
        <div class="date-list">
          <div :class="['date-item', item.id === currentDate.id ? 'select-item' : '']"
            v-for="(item, index) in dfSoftPackageDateList" :key="index" @click="selectDate(item)"
            :title="index > 3 ? 'The longer the purchase period, the more discount' : ''">
            <!-- <i class="icon-font el-icon-circle-check" v-if="item.id === currentDate.id"></i> -->
            <div>{{item.dateName}}<span v-if="index > 3">hot</span></div>
            <!-- <div>{{item.detail}}</div>
            <div>{{item.remark}}</div> -->
          </div>
        </div>
      </div>
      <div class="price-content">
        Total Price: <span><span style="font-size: 20px">{{totalPrice}}</span> {{currency}}</span>
      </div>
    </div>
    <div id='payapp' v-else-if="startPay">
      <div class="goods-info">
        <div>
          <span>{{$t("recharge.orderNumber")}}:</span>
          <span>{{orderInfo.orderNo}}</span>
        </div>
        <div>
          <span>{{$t("recharge.country")}}:</span>
          <span>{{orderInfo.country}}</span>
        </div>
        <div>
          <span>{{$t("recharge.deviceNumber")}}:</span>
          <span>{{orderInfo.packageDeviceNum}}</span>
        </div>
        <div>
          <span>{{$t("recharge.pachageName")}}:</span>
          <span>{{orderInfo.packageName}}</span>
        </div>
        <div>
          <span>{{$t("recharge.duration")}}:</span>
          <span>{{orderInfo.packageDateName}}</span>
        </div>
        <div>
          <span>{{$t("recharge.currentPrice")}}:</span>
          <span>{{orderInfo.orderPrice}} {{orderInfo.currency}}</span>
        </div>
        <div>
          <span>{{$t("recharge.autoRenewal")}}:</span>
          <span><el-checkbox v-model="autoRenewal" true-label="1" false-label="0"></el-checkbox></span>
        </div>
      </div>
      <p>Please give us your payment details:</p>
      <div class='credit-card-inputs' :class='{ complete }'>
        <div class="card-item">
          <span class="card-label">Card Number</span>
          <card-number class='stripe-element card-number'
            ref='cardNumber'
            :stripe='stripe'
            :options='Options'
            @change='number = $event.complete'
          />
        </div>
        <div class="card-item">
          <span class="card-label">Card Expiry</span>
          <card-expiry class='stripe-element card-expiry'
            ref='cardExpiry'
            :stripe='stripe'
            :options='expiryOptions'
            @change='expiry = $event.complete'
          />
        </div>
        <div class="card-item">
          <span class="card-label">Card Cvc</span>
          <card-cvc class='stripe-element card-cvc'
            ref='cardCvc'
            :stripe='stripe'
            :options='Options'
            @change='cvc = $event.complete'
          />
        </div>
      </div>
    </div>
    <div class="save-box">
      <el-button type="primary" @click="payNow" v-if="!startPay && (totalPrice && packageStatus === 0)">{{$t("recharge.createOrder")}}</el-button>
      <el-button type="primary" @click="pageType='upgrade'" v-if="!startPay && packageStatus === 1 && !pageType">{{$t("recharge.upgrade")}}</el-button>
      <el-button type="primary" @click="pageType='renew'" v-if="!startPay && packageStatus === 1 && !pageType">{{$t("recharge.renew")}}</el-button>
      <el-button type="primary" @click="payNow" v-if="!startPay && totalPrice && pageType">{{$t("recharge.createOrder")}}</el-button>
      <el-button type="primary" @click="pay" v-if="startPay">{{$t("recharge.payNow")}}</el-button>
      <el-button type="primary" @click="backTo" v-if="startPay || pageType" class="back-button">{{$t("common.back")}}</el-button>
    </div>
  </div>
</template>
<script>
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
      currentInfo: {},
      addForm: {
        deviceNumber: ''
      },
      payType: 1,
      addRules: {
        deviceNumber: [
          { required: true, trigger: 'blur' },
          { type: 'number', message: 'Must be a positive integer' }
        ]
      },
      orderInfo: {},
      complete: false,
      Options: {
        currency: 'hdk'
      },
      expiryOptions: {
        placeholder: 'MM / YY'
      },
      card: {},
      loading: false,
      stripe: 'pk_test_ffVzg2f5DlxbDYXOHjh7CFQv00cHMSsuGI',
      number: false,
      expiry: false,
      cvc: false,
      autoRenewal: '1',
      packageStatus: 0,
      dfSoftPackageDateList: [],
      dfSoftPackagePriceList: [],
      dfSoftPackagePriceListUpgrade: [],
      currency: 'usd',
      currentPackage: {},
      currentDate: {},
      totalPrice: 0,
      pageType: ''
    }
  },
  components: { CardNumber, CardExpiry, CardCvc },
  mounted () {
    // this.currentItem = this.rechargeList[0]
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
    this.getUserPackageInfo()
  },
  methods: {
    payNow () {
      this.loading = true
      let packageOrderType = 1
      if (this.pageType === 'upgrade') packageOrderType = 2
      else if (this.pageType === 'renew') packageOrderType = 3
      let params = {
        payType: this.payType,
        packageOrderType: packageOrderType,
        packagePriceId: this.currentPackage.id || '',
        packageDateId: this.currentDate.id || ''
      }
      if (!params.packagePriceId) delete params['packagePriceId']
      if (!params.packageDateId) delete params['packageDateId']
      this.$http
        .post('@ROOT_API/dfDeviceOrder/addOrder', params)
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
          this.loading = false
        })
    },
    backTo () {
      this.startPay = false
      this.pageType = ''
      this.currentPackage = {}
      this.currentDate = {}
      this.totalPrice = 0
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
              message: 'Purchase success, Please login again',
              duration: 0,
              showClose: true
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
      if (!this.number) {
        this.$message({
          type: 'error',
          duration: 3000,
          showClose: true,
          message: 'Card Number is Invalid,Please check.!'
        })
        return false
      }
      if (!this.expiry) {
        this.$message({
          type: 'error',
          duration: 3000,
          showClose: true,
          message: 'Card Expiry is Invalid,Please check.!'
        })
        return false
      }
      if (!this.cvc) {
        this.$message({
          type: 'error',
          duration: 3000,
          showClose: true,
          message: 'Card Cvc is Invalid,Please check.!'
        })
        return false
      }
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
            card: this.getValForName('cardnumber'),
            cvc: this.getValForName('cvc'),
            validTrueDate: this.getValForName('exp-date'),
            autoRenewStatus: this.autoRenewal
          })
          .then(res => {
            this.loading = false
            if (res.data.status === '1') {
              this.$message({
                type: 'success',
                message: 'Purchase success',
                duration: 5000,
                showClose: true
              })
              let deviceAdminInfo = JSON.parse(localStorage.deviceAdminInfo)
              deviceAdminInfo.payMemberStatus = this.$toMd5(1)
              localStorage.setItem('deviceAdminInfo', JSON.stringify(deviceAdminInfo))
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
    getValForName (name) {
      if (!name) return ''
      let eles = document.getElementsByName(name)
      if (eles && eles.length > 0) {
        return eles[0].value
      }
      return ''
    },
    update () {
      this.complete = this.number && this.expiry && this.cvc
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
    },
    getUserPackageInfo () {
      this.$http.post('@ROOT_API/dfDeviceOrder/getUserPackageInfo', {}).then((res) => {
        if (res) {
          let { data } = res.data
          this.packageStatus = data.packageStatus
          this.currency = data.currency
          this.dfSoftPackageDateList = data.dfSoftPackageDateList
          this.dfSoftPackagePriceList = data.dfSoftPackagePriceList
          if (data.packageName) {
            // let vipMappings = ['VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5', 'VIP6']
            // let index = vipMappings.indexOf(data.packageName)
            // this.dfSoftPackagePriceListUpgrade = data.dfSoftPackagePriceList.filter(df => vipMappings.indexOf(df.packageName) > index)
            this.dfSoftPackagePriceListUpgrade = data.dfSoftPackagePriceList.filter(df => df.packageNo > data.beforePackageNo)
          }
          this.currentInfo = data
        }
      })
    },
    selectPackage (item) {
      this.currentPackage = Object.assign({}, item)
      this.getTotalPrice()
    },
    selectDate (item) {
      this.currentDate = Object.assign({}, item)
      this.getTotalPrice()
    },
    getTotalPrice () {
      if ((this.currentPackage.id && this.currentDate.id) || this.packageStatus !== 0) {
        let packageOrderType = 1 // 首次下单
        if (this.pageType === 'upgrade') packageOrderType = 2
        else if (this.pageType === 'renew') packageOrderType = 3
        let params = {
          payType: 1,
          packageOrderType: packageOrderType,
          packagePriceId: this.currentPackage.id,
          packageDateId: this.currentDate.id
        }
        if (!params.packagePriceId) delete params['packagePriceId']
        if (!params.packageDateId) delete params['packageDateId']
        this.loading = true
        this.$http.post('@ROOT_API/dfDeviceOrder/getOrderPrice', params).then((res) => {
          if (res.data.status === '1') {
            let { orderPrice } = res.data.data
            this.totalPrice = orderPrice
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
          }
          this.loading = false
        })
      }
    }
  },
  watch: {
    number () { this.update() },
    expiry () { this.update() },
    cvc () { this.update() }
  }
}
</script>
<style lang="less">
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
.credit-card-inputs.complete {
  border: 2px solid green;
  padding: 10px;
}
.card-item {
  display: flex;
  .card-label {
    color: #999999;
    width: 120px;
    display: block;
    text-align: right;
    margin-right: 20px;
    position: relative;
  }
  .card-label:after {
    content: '*';
    color: red;
    position: absolute;
    top: 5px;
    right: -10px;
  }
  .stripe-element {
    width: 300px;
    border: 1px solid #ddd;
    margin-bottom: 20px;
    padding-left: 10px;
  }
}
</style>
<style lang='less' scoped>
.recharge-vip-wrap {
  background: #fff;
  padding: 20px;
  .select-item {
    // border: 1px solid #33719b !important;
    background: #33719b;
    color: #fff;
  }
  .package-list, .date-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    .package-item, .date-item {
      width: 150px;
      height: 100px;
      margin-right: 20px;
      border: 1px solid #eee;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      .el-icon-circle-check {
        width: 100%;
        text-align: right;
        color: #fff;
      }
      .el-icon-circle-check:before {
          margin-right: 6px;
      }
    }
    .package-item {
      div:nth-child(1) {
        margin-top: 15px;
      }
    }
    .date-item {
      div:nth-child(1) {
        line-height: 100px;
        span {
          background: #FF8A00;
          width: 12px;
          height: 12px;
          color: #fff;
          font-size: 9px;
          margin-left: 5px;
          border-radius: 50%;
          padding: 3px;
        }
      }
    }
    .package-item:hover, .date-item:hover {
      box-shadow: 10px 10px 10px 10px #eee;
      border: 1px solid #33719b;
      // color: #fff;
    }
  }
  .date-content {
    margin-top: 20px;
  }
  .price-content {
    margin-top: 20px;
    span {
      color: #ff7800;
    }
  }
  .status-remark {
    margin-bottom: 10px;
  }
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
  // .recharge-list {
  //   display: flex;
  //   justify-content: space-around;
  //   background: #fff;
  //   // height: 120px;
  //   justify-content: left;
  //   .el-form {
  //     margin-top: 20px;
  //   }
  //   .recharge-item {
  //     width: 22%;
  //     height: 80px;
  //     border-radius: 5px;
  //     border: 1px solid #eee;
  //     display: flex;
  //     justify-content: space-around;
  //     position: relative;
  //     cursor: pointer;
  //     margin-top: 20px;
  //     .item-left {
  //       border-right: 1px solid #eee;
  //       width: 50px;
  //       padding-top: 17px;
  //       padding-right: 10px;
  //     }
  //     .item-right {
  //       margin: auto 0;
  //       .price {
  //         .dollor {
  //           font-size: 26px;
  //         }
  //       }
  //       .price-rel {
  //         color: #999999;
  //         text-decoration: line-through;
  //       }
  //       .specialOffer {
  //         background: #cc9900;
  //         position: absolute;
  //         top: 0;
  //         right: 0;
  //         width: 50px;
  //         color: #fff;
  //         text-align: center;
  //       }
  //     }
  //   }
  //   .item-selected {
  //     border: 1px solid #cc9900;
  //   }
  // }
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
  // .item-desc {
  //   background: #fff;
  //   color: #666666;
  //   font-size: 13px;
  //   padding-left: 20px;
  //   span {
  //     color: red;
  //   }
  //   padding-bottom: 20px;
  // }
  // .pay-method {
  //   background: #fff;
  //   padding-top: 20px;
  //   display: flex;
  //   padding-bottom: 20px;
  //   padding-left: 20px;
  //   .payment-method-val {
  //     height: 45px;
  //     border: 1px solid #cc9900;
  //     border-radius: 5px;
  //     padding: 0 20px;
  //     line-height: 43px;
  //     position: relative;
  //     img {
  //       width: 20px;
  //       height: 20px;
  //       vertical-align: middle;
  //     }
  //     .el-radio {
  //       margin-right: 0;
  //     }
  //   }
  //   span {
  //     line-height: 43px;
  //   }
  //   .tips {
  //     position: absolute;
  //     top: 0;
  //     right: 0;
  //     line-height: 1;
  //     background: #cc9900;
  //     color: #fff;
  //     font-size: 15px;
  //     width: 32px;
  //     height: 17px;
  //     text-align: center;
  //   }
  // }
  // .payment-amount {
  //   background: #fff;
  //   padding-left: 20px;
  //   padding-bottom: 20px;
  //   .dollor {
  //     font-size: 26px;
  //     color: red;
  //   }
  //   .amount {
  //     color: red;
  //   }
  // }
}
</style>
