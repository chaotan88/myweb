<!-- 订单审核容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/report/currency/list">通用积分流水表</router-link>
      <router-link class='d-ib ta-c' to="/admin/report/currency/cash">现金流水表</router-link>
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
