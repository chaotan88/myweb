<!-- 账户设置容器 -->
<template>
  <div class="setting-layout-wrap">
    <div class="ta-c pos-a nav-list-wrap">
      <router-link class="d-ib" to="/admin/seting/auth/admin/index">{{$t('device.apartmentManager')}}</router-link>
      <router-link class="d-ib" to="/admin/seting/auth/admin/add">{{$t('common.addApartmentManager')}}</router-link>
      <router-link class="d-ib" to="/admin/seting/auth/group/index">{{$t('account.permissionGroup')}}</router-link>
      <!-- <router-link class="d-ib" to="/admin/seting/auth/group/add">{{$t('common.addPermissionGroup')}}</router-link> -->
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
