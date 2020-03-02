<!-- 账户设置容器 -->
<template>
  <div class="setting-layout-wrap">
    <div class="ta-c pos-a nav-list-wrap">
      <router-link class="d-ib" to="/admin/seting/auth/admin/index">管理员</router-link>
      <router-link class="d-ib" to="/admin/seting/auth/admin/add">添加管理员</router-link>
      <router-link class="d-ib" to="/admin/seting/auth/group/index">权限组</router-link>
      <router-link class="d-ib" to="/admin/seting/auth/group/add">添加权限组</router-link>
    </div>
    <router-view :key="key"></router-view>
  </div>
</template>
<script>
export default {
  computed: {
    /**
     * 处理地址栏变化页面数据未变化
    */
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>
