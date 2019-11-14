<template>
    <div>
      <div class="pageRechargedSuccess">
        <img :src="pointSuccess"/>
        <p class="pointFul">充值成功</p>
        <p class="pointNum"><span>￥</span>{{amount | money}}</p>
        <p style="margin-top: 0.5rem;">已赠送<span style="color: #ff4d4d;">{{xxgs}}个</span>消费积分到您的账户，请注意查收</p>
        <button @click="$router.push('/home')">返回首页</button>
      </div>
    </div>
</template>

<script>
    export default {
      name: 'bankRechargedSuccess',
      data () {
        return {
          pointSuccess: require('../../assets/images/cg_page.png'),
          amount: '',
          xxgs: ''
        }
      },
      components: {
      },
      mounted () {
        this.amount = this.$route.query.successPrice
        this.xxgs = JSON.parse(localStorage.getItem('rechargeData')).points
      },
      methods: {
      }
    }
</script>

<style lang="less" scoped>
  .pageRechargedSuccess{
    width: 100%;
    height: 100vh;
    background: #fff;
  img{
    display: block;
    text-align: center;
    padding-top: 0.5rem;
    width: 2rem;
    height: 2rem;
    margin: 0 auto;
  }
  p{
    text-align: center;
    color: #333;
  &.pointFul{
     margin-top: 0.1rem;
    color: #4ea5ee;
   }
  &.pointNum{
     font-size: 0.45rem;
     font-weight: 500;
     margin-top: 0.2rem;
     color: #ff4f4f;
   }
  }
  button{
    width: 90%;
    height: 0.8rem;
    border: 0;
    color: #ffffff;
    -webkit-border-radius: 0.2rem;
    -moz-border-radius: 0.2rem;
    border-radius: 0.2rem;
    margin: 3% 5%;
    background: #5894de;
  }
  }
</style>
