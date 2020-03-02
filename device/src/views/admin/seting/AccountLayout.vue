<!-- 账户设置容器 -->
<template>
  <div class="setting-layout-wrap">
    <div class="ta-c pos-a nav-list-wrap">
      <router-link class="d-ib" to="/admin/seting/account/index">{{$t('common.accountManage')}}</router-link>
      <router-link class="d-ib" to="/admin/seting/account/update">{{$t('common.updatePassword')}}</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
