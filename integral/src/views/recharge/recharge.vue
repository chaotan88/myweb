<!-- 预付充值 -->
<template>
<div class="recharge-warp">
  <div class="recharge-warp-content">
    <p class="recharge-warp-title">充值金额</p>
    <p class="recharge-warp-input-warp">
      ￥
      <!-- onkeyup="value=value.replace(^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$,'')" -->
      <input
        type="text"
        class="recharge-warp-input"
        placeholder="单笔限额：50,000元"
        v-model="amount"
        maxlength="8">
    </p>
    <p class="recharge-warp-tips">
      消费积分：
      <span class="recharge-warp-tips-num">{{points}}个</span>
    </p>
  </div>
  <div class="charge-tip">未实名用户,充值后需进行实名认证才能达到相应等级</div>
  <div class="recharge-warp-btn-warp">
    <!-- <button class="recharge-warp-btn-warp-button" @click="handleSubmit">充值</button> -->
    <button-item :title="buttonTitle" :path="path" @submit="handleRecharge"></button-item>
  </div>
</div>
</template>
<script>
import ButtonItem from './ButtonItem'

export default {
  components: {ButtonItem},
  data () {
    return {
      buttonTitle: '充值',
      path: '/pay/payment',
      amount: '',
      points: 0,
      rechargeRuleList: []
    }
  },
  mounted () {
    this.getRechargeRuleList()
  },
  watch: {
    amount () {
      // 修复第一个字符是小数点 的情况.
      if (this.amount !== '' && this.amount.substr(0, 1) === '.') {
        this.amount = ''
      }
      this.amount = this.amount.replace(/^0*(0\.|[1-9])/, '$1')// 解决 粘贴不生效
      this.amount = this.amount.replace(/[^\d.]/g, '')  // 清除“数字”和“.”以外的字符
      this.amount = this.amount.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      this.amount = this.amount.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      this.amount = this.amount.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 只能输入两个小数
      if (this.amount.indexOf('.') < 0 && this.amount !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (this.amount.substr(0, 1) === '0' && this.amount.length === 2) {
          this.amount = this.amount.substr(1, this.amount.length)
        }
      }
      // if (this.amount !== '') {
        // this.amount = parseInt(this.amount.toString().replace(/[^\d]/g,'')) // 匹配第一位不为零
        // value=value.replace(/[^\d]/g,'')  // 匹配正整数
      // }
      this.setPoints()
    }
  },
  methods: {
    handleRecharge (path) {
      if (!this.amount) {
        this.$vux.toast.text('请输入充值金额')
        return false
      } else if (this.amount < 100) {
        this.$vux.toast.text('充值金额不能低于100元')
        return false
      } else if (this.amount > 50000) {
        this.$vux.toast.text('单笔限额：50,000元')
        return false
      }

      this.$vux.loading.show({
        text: '请稍后...'
      })
      this.$http.post(`${this.api.recharge}`, {
        // TODO:上线改为 this.amount
        amount: this.amount
      }).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) {
          if (parseInt(res.data.status) !== 9903) {
            this.$vux.toast.text(res.data.msg)
            return false
          }
        } else {
          setTimeout(() => {
            localStorage.setItem('rechargeData', JSON.stringify({amount: this.amount, points: this.points, rechargeNo: res.data.data.rechargeNo}))
            this.$router.push(path)
          }, 100)
        }
      }).finally(() => {
        this.$vux.loading.hide()
      })
    },
    /**
     * 获取积分规则
     */
    getRechargeRuleList () {
      this.$http.get(this.api.getRechargeRuleList).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) {
          if (parseInt(res.data.status) !== 9903) {
            return false
          }
        } else {
          this.rechargeRuleList = res.data.data
          // console.log('最大值', this.rechargeRuleList[this.rechargeRuleList.length-1].endAmount)
        }
      })
    },
    /**
     * 计算积分
     */
    setPoints () {
      let amount = parseInt(this.amount)
      let _this = this

      for (let i = 0; i < _this.rechargeRuleList.length; i++) {
        const element = _this.rechargeRuleList[i]
        if (amount >= element.beginAmount && amount <= element.endAmount) {
          _this.points = Math.round(amount * element.toConsumePointProportion)
          return
        } else {
          _this.points = 0
        }
      }
    }
  }
}
</script>
<style lang="less">
  .recharge-warp{
    background: #eeeeee;
    height: calc(100vh);
    overflow-y: scroll;
    color: #333333;
    .recharge-warp-content{
      background: #ffffff;
      margin-top: .2rem;
      .recharge-warp-title{
        text-align: center;
        font-size: .24rem;
        line-height: .9rem;
      }
      .recharge-warp-input-warp{
        margin: 0 .28rem;
        font-size: .7rem;
        line-height: 1.3rem;
        border-bottom: 1px solid #dddddd;
        .recharge-warp-input{
          vertical-align: middle;
          width: 80%;
          font-size: .32rem;
          color: #666666;
        }
      }
      .recharge-warp-tips {
        padding-left: 1.2rem;
        line-height: .8rem;
        font-size: .24rem;
        color: #999999;
        .recharge-warp-tips-num {
          color: #ff5050;
        }
      }

    }
    .charge-tip{
      font-size: .24rem;
      color: #efbf3f;
      padding: .1rem .2rem;
    }
    .recharge-warp-btn-warp{
      text-align: center;
      margin-top: .4rem;
      .recharge-warp-btn-warp-button{
        width: 6.7rem;
        height: .8rem;
        background-image: linear-gradient(141deg,
          #7acce5 0%,
          #5894de 100%),
        linear-gradient(
          #f6f6f6,
          #f6f6f6);
        background-blend-mode: normal,
          normal;
        box-shadow: 0 .03rem .07rem 0
          rgba(88, 148, 222, 0.35);
        border-radius: .12rem;
        font-size: .36rem;
        color: #ffffff;
        //消除button的默认样式
        margin: 0;
        padding: 0;
        border: .01rem solid transparent;  //自定义边框
        outline: none;    //消除默认点击蓝色边框效果
      }
    }

  }
</style>
