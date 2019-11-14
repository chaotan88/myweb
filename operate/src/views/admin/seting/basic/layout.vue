<!-- 商品管理容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/seting/basic/shoppingMall">商城设置</router-link>
      <router-link class='d-ib ta-c' to="/admin/seting/basic/registrationAgreement">注册协议</router-link>
      <router-link class='d-ib ta-c' to="/admin/seting/basic/afterSaleService">售后服务</router-link>
    </template>
  </third-menu>
</template>

<script>
export default {
  data () {
    return {
    }
  },

  mounted () {
    // ...
  },

  methods: {
  // ...
  }
}
</script>
