<!-- 转增管理容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/finance/giftGiving/list">转赠列表</router-link>
    </template>
  </third-menu>
</template>

<script>
export default {
  data () {
    return {
      statistics: {}
    }
  }
}
</script>
