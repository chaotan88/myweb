<template>
  <div>
    <div class="pageBankPriceRange">
    <p class="headNav" v-if="toNextLevelPoints !== -1">您当前为{{iDentity || '消费会员'}}，再获得<span style="color: #fb5c5b;">{{toNextLevelPoints}}</span>消费积分即可升级{{nextLevelName}}！</p>
    <p class="headNav" v-if="toNextLevelPoints === -1">您当前为管理中心</p>
      <div class="payRangeTitle" style="color: #000;font-weight: 600; padding: 0.2rem;">选择金额</div>
      <div class="payView">
        <div class="payRangeList" v-bind:class="index === activeindex ? 'select' : ''" v-for="(item,index) in resData" :key="index" @click="btn_click(index),choosePrice(item)">
          <p>{{item.agentFee | price}}</p>
        </div>
        <input type="text" placeholder="其他金额，请输入100-1000000区间的数字"  v-on:keyup.enter="addThingEnter" v-model="value" maxlength="7" oninput = "value=value.replace(/[^\d]/g,'')"/>
        <div class="pointExplain"><span>您可获：</span>消费积分：<span>{{bonusPointsAmount}}</span>个&nbsp;余额：<span>{{balanceAmount}}</span>元</div>
      </div>
      <div class="provision">充值即代表您已同意<span @click="$router.push('/bankAgreement')">《充值条款》</span> </div>
      <div class="topUp" @click="goPay" :path="path"><span>充值</span></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'bankPriceRange',
    data () {
      return {
        index: 0,
        activeindex: 0,
        value: '',
        resData: [],               // 充值金额的列表
        amount: '',                // 充值的金额
        path: '/pay/payment',
        // rechargeRuleList: [],
        iDentity: '',              // 当前用户是什么身份
        nextLevelName: '',         // 用户身份升级到下一身份的名称
        toNextLevelPoints: '',     // 用户身份与管理中心的判断(等于-1就是最高等级，不等于-1就是在升级的路上)
        bonusPointsAmount: '',     // 用户的消费积分
        balanceAmount: ''          // 用户的金额
      }
    },
    components: {
    },
    mounted () {
      this.getUpStatus()
      this.getPartnerData()
      this.countNum()
      // this.getRechargeRuleList()
    },
    watch: {
      amount () {
        if (this.activeindex >= 0) {
          this.value = ''
        }
      },
      value () {
        if (this.value !== '') {
          this.activeindex = -1
          if (this.value >= 100 && this.value <= 1000000) {
            this.amount = this.value
            this.countNum()
          } else if (this.value < 100) {
            this.$vux.toast.text('充值金额要大于100元')
            this.amount = 0
            this.countNum()
          } else if (this.value > 1000000) {
            this.$vux.toast.text('充值金额要小于1000000元')
            this.amount = 0
            this.countNum()
          }
        } else if (this.value === '' && this.activeindex === -1) {
          this.amount = this.value
        }
      }
    },
    methods: {
      btn_click (index) {
        this.activeindex = index
      },
      choosePrice (event) {
        this.amount = event.agentFee
        this.countNum()
      },
      /**
       * 监听键盘的Enter事件(本页面没有用到)
       */
      addThingEnter (event) {
      },
      /**
       * 计算积分和余额
       */
      countNum () {
        this.$http.get(this.api.getRechareProperty, {
          params: {
            amount: this.amount
          }
        }).then((res) => {
          // console.log(res)
          this.bonusPointsAmount = res.data.data.bonusPointsAmount
          this.balanceAmount = res.data.data.balanceAmount
        })
      },
      /**
       * 获取会员升级列表(金额列表)
       */
      getUpStatus () {
        this.$http.post(this.api.getRuleList, {
        }).then((res) => {
          if (res.data.data[0].agentFee === 0) {
            let newArr = res.data.data.splice(1)
            this.resData = newArr
          } else {
            this.resData = res.data.data
          }
          this.amount = this.resData[0].agentFee
          this.countNum()
        })
      },
      /**
       * 获取会员升级数据(当前是什么会员)
       */
      getPartnerData () {
        this.$http.post(this.api.getApplyInfoListByCustomerId).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.iDentity = resData.data.ruleName
            this.nextLevelName = resData.data.nextLevelName
            this.toNextLevelPoints = resData.data.toNextLevelPoints
          }
        })
      },
      /**
       * 获取积分规则
       */
      // getRechargeRuleList () {
      //   this.$http.get(this.api.getRechargeRuleList).then((res) => {
      //     if (res.data.status !== this.api.ERR_OK || !res) {
      //       if (parseInt(res.data.status) !== 9903) {
      //         return false
      //       }
      //     } else {
      //       this.rechargeRuleList = res.data.data
            // console.log(this.rechargeRuleList)
            // console.log('最大值', this.rechargeRuleList[this.rechargeRuleList.length-1].endAmount)
      //     }
      //   })
      // },
      /**
       * 计算积分
       */
      // setPoints () {
      //   let amount = parseInt(this.amount)
      //   console.log(amount)
      //   let _this = this
      //   for (let i = 0; i < _this.rechargeRuleList.length; i++) {
      //     const element = _this.rechargeRuleList[i]
      //     _this.points = Math.round(amount * element.toConsumePointProportion)
          // if (amount >= element.beginAmount && amount <= element.endAmount) {
          //   _this.points = Math.round(amount * element.toConsumePointProportion)
          //   return
          // } else {
          //   _this.points = 0
          // }
      //   }
      // },
      /**
       * 提交充值订单
       */
      goPay () {
        if (!this.amount && this.value === '') {
          this.$vux.toast.text('请输入充值金额')
          return false
        } else if (this.amount > 0 && this.value === '') {
          this.amount = this.amount
        } else if (this.amount > 0 && this.value !== '') {
          if (this.value < 100) {
            this.$vux.toast.text('充值金额要大于100元')
            return false
          } else if (this.value > 1000000) {
            this.$vux.toast.text('充值金额要小于1000000元')
            return false
          } else {
            this.amount = this.value
          }
        } else if (!this.amount && this.value !== '') {
          if (this.value < 100) {
            this.$vux.toast.text('充值金额要大于100元')
            return false
          } else if (this.value > 1000000) {
            this.$vux.toast.text('充值金额要小于1000000元')
            return false
          } else {
            this.amount = this.value
          }
        }
        // console.log(this.amount)
        this.$vux.loading.show({
          text: '请稍后...'
        })
        this.$http.post(`${this.api.recharge}`, {
          // TODO:上线改为 this.amount
          amount: this.amount
        }).then((res) => {
          // console.log(res)
          if (res.data.status !== this.api.ERR_OK || !res) {
            if (parseInt(res.data.status) !== 9903) {
              this.$vux.toast.text(res.data.msg)
              return false
            }
          } else {
            setTimeout(() => {
              localStorage.setItem('rechargeData', JSON.stringify({amount: this.amount, points: this.bonusPointsAmount, rechargeNo: res.data.data.rechargeNo}))
              this.$router.push('pay/payment')
            }, 100)
          }
        }).finally(() => {
          this.$vux.loading.hide()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .pageBankPriceRange{
    width: 100%;
    height: 100vh;
    background: #fff;
    padding-top: 0.2rem;
    .headNav{
      width: 90%;
      border-radius: 0.2rem;
      font-size: 0.06rem;
      background: #fef1eb;
      margin-left: 5%;
      text-align: center;
      font-size: 0.3rem;
    }
    .payView{
      display:flex;
      flex-wrap:wrap;
      /*justify-content:space-around;*/
      .payRangeList{
        width: 30%;
        height: 0.6rem;
        line-height: 0.6rem;
        background: #ccc;
        border-radius: 0.1rem;
        background: #fff;
        border: 1px solid #ccc;
        margin-bottom: 0.2rem;
        text-align: center;
        margin-left: 2.2%;
      }
      .select {
        background: #dee7fd;
        color: #5888f5;
      }
      input{
        width: 94%;
        padding-left: 2%;
        margin: 3% 2% 1% 2%;
        background: #fff!important;
        border: 1px solid #ccc;
        height: 0.7rem;
        line-height: 0.7rem;
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
      }
      .pointExplain{
        width: 94%;
        padding-left: 2%;
        font-size: 0.2rem;
        color: #1e1e1e;
        span:first-child {
          color: #666;
        }
        span:nth-of-type(2){
          color: #ff0000;
        }
        span:nth-of-type(3){
          color: #ff0000;
        }
      }
    }
    .provision{
      width: 96%;
      padding: 0 2%;
      border-top: 0.15rem solid #f7f7f7;
      border-bottom: 0.15rem solid #f7f7f7;
      height: 1rem;
      line-height: 1rem;
      color: #a7a7a7;
      span{
        color: #75b3fb;
      }
    }
    .giving{
      width: 96%;
      padding: 4% 2%;
      color: #a7a7a7;
      span{
        color: #f87536;
      }
    }
    .topUp{
      width: 70%;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      background: #5582f4;
      color: #fff;
      -webkit-border-radius: 0.5rem;
      -moz-border-radius: 0.5rem;
      border-radius: 0.5rem;
      margin: 15%;
    }
  }
</style>
