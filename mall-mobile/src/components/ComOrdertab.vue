<template>
    <div class="orderTab">
      <ul class="title-box">
        <router-link tag='li' to="/orderList">全部</router-link>
        <router-link tag='li' :to="{path:'/waitPayOrder',query:{orderState:1}}">待付款</router-link>
        <router-link tag='li' :to="{path:'/waitDeliveryOrder',query:{orderState:2}}">待发货</router-link>
        <router-link tag='li' :to="{path:'/waitTakeOrder',query:{orderState:3}}">待收货</router-link>
        <router-link tag='li' :to="{path:'/waitCommentsOrder',query:{orderState:4}}">待评价</router-link>
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
  .orderTab {
    .title-box{
      display: flex;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      background: #fff;
      li{
        flex: 1;
      }
      .active{
        border-bottom: 2px solid #f23030;
      }
    }
  }
</style>
