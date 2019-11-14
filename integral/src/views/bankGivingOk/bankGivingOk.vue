<template>
    <div class="pageBankGivingOk">
      <img :src="bankSuccess"/>
      <p class="successFul">赠送成功</p>
      <p class="successNum">{{successNum}}个通用积分</p>
      <!--<p style="color: #999;margin-top: 0.5rem;">已赠送<span style="color: #ff4d4d;">{{successNum}}个</span>通用积分到您的账户，请注意查收</p>-->
      <button @click="$router.push('/home')">返回首页</button>
    </div>
</template>

<script>
    export default {
      name: 'bankGivingOk',
      data () {
        return {
          bankSuccess: require('../../assets/images/cg_page.png'),
          successNum: ''
        }
      },
      mounted () {
        this.successNum = this.$route.query.successNum
      }
    }
</script>

<style lang="less" scoped>
.pageBankGivingOk{
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
    &.successFul{
      margin-top: 0.1rem;
      color: #4ea5ee;
    }
    &.successNum{
      font-size: 0.45rem;
      font-weight: 500;
      margin-top: 0.2rem;
      color: #ff5050;
    }
  }
  button{
    width: 90%;
    height: 0.8rem;
    background: #5c9bdf;
    border: 0;
    color: #ffffff;
    -webkit-border-radius: 0.2rem;
    -moz-border-radius: 0.2rem;
    border-radius: 0.2rem;
    margin: 3% 5%;
  }
}
</style>
