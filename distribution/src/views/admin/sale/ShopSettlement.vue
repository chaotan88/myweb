<!-- 店补结算 -->
<template>
  <common-tpl class="shop-settlement-wrap">
    <template slot="main">
      <ShopSettlementStatistics></ShopSettlementStatistics>
      <div class="line"></div>
      <ShopSettlementLayout></ShopSettlementLayout>
      <router-view></router-view>
    </template>
  </common-tpl>
</template>

<script>
import ShopSettlementStatistics from './ShopSettlementStatistics'
import ShopSettlementLayout from './ShopSettlementLayout'
export default {
  components: {
    ShopSettlementStatistics,
    ShopSettlementLayout
  }
}
</script>

<style lang="less" scoped>
  .shop-settlement-wrap{
    .line{
      width: 100%;
      border: solid 1px #999999;
      opacity: 0.1;
    }
  }
</style>
