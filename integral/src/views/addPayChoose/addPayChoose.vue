<template>
  <div>
    <div class="tx-aliPay" @click="goAliPay">提现到支付宝</div>
    <div class="tx-bank" @click="goBank">提现到银行卡</div>
  </div>
</template>

<script>
    export default {
      name: 'addPayChoose',
      data () {
        return {
        }
      },
      components: {
      },
      mounted () {
      },
      methods: {
        goAliPay () {
          // this.$router.push('/addAliPay')
          this.$router.push({path: '/addAlipay', query: {qf: 2}})
        },
        goBank () {
          this.$router.push({path: '/user/cardManger', query: {bk: 2}})
        }
      }
    }
</script>

<style lang="less" scoped>
  .tx-aliPay{
    width: 6.5rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: #fff;
    -webkit-border-radius: 0.2rem;
    -moz-border-radius: 0.2rem;
    border-radius: 0.2rem;
    background: #00bb9a;
    border: 1px solid #00bb9a;
    position: absolute;
    left: 50%;
    top: 20%;
    margin-left: -3.25rem;
  }

  .tx-bank{
    width: 6.5rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: #00bb9a;
    -webkit-border-radius: 0.2rem;
    -moz-border-radius: 0.2rem;
    border-radius: 0.2rem;
    background: #fff;
    border: 1px solid #00bb9a;
    position: absolute;
    left: 50%;
    top: 35%;
    margin-left: -3.25rem;
  }
</style>
