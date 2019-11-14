<template>
    <div class="index">
      <ul class="list-box">
        <li @click="$router.push('/applyRefundMoney')">
          <div class="left">
            <img src="../../assets/images/my/icon-money.png">
            <span>申请退款</span>
          </div>
          <div class="right">
            <x-icon type="ios-arrow-right" size="20"></x-icon>
          </div>
        </li>
        <li @click="$router.push('/applyRefundGood')">
          <div class="left">
            <img src="../../assets/images/my/time.png">
            <span>售后记录</span>
          </div>
          <div class="right">
            <x-icon type="ios-arrow-right" size="20"></x-icon>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    mounted: function () {
    },
    methods: {}
  }
</script>

<style scoped lang=less>
    .index {
      height: 100vh;
      background: #eee;
      .list-box{
        background: #fff;
        li{
          height: 0.8rem;
          line-height: 0.8rem;
          display: flex;
          border-bottom: 1px solid #eee;
          padding:0 0.15rem 0 0.3rem;
          .left{
            width: 2rem;
            display: flex;
            align-items: center;
            img{
              width: 0.4rem;
            }
            span{
              margin-left: 0.2rem;
            }
          }
          .right{
            flex: 1;
            text-align: right;
            .vux-x-icon {
              fill: #999;
              margin-top:0.18rem;
            }
          }
        }
      }
    }
</style>
