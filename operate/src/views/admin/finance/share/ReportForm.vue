<!-- 专区分佣 - 买卖仓分佣 - 分享收益/团队分佣/全球分红 -->
<template>
  <common-tpl class="shop-settlement-wrap">
    <template slot="main">

      <!-- 统计数据 -->
      <!-- <TeamTitle></TeamTitle> -->
      <div class="line"></div>
      <!-- <ShopSettlementLayout></ShopSettlementLayout> -->
      <ShopSettlementList></ShopSettlementList>
      <router-view></router-view>
    </template>
  </common-tpl>
</template>

<script>
// import TeamTitle from './TeamTitle'
import ShopSettlementList from './ShopSettlementList'
// import ShopSettlementLayout from './ShopSettlementLayout'
export default {
  components: {
    // TeamTitle,
    ShopSettlementList
    // ShopSettlementLayout
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
