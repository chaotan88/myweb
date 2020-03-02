<!-- 代理商授权容器 -->
<template>
  <div class="setting-layout-wrap">
    <div class="ta-c pos-a nav-list-wrap">
      <router-link class="d-ib" to="/admin/seting/authorization/all">全部</router-link>
      <router-link class="d-ib" to="/admin/seting/authorization/not">待授权</router-link>
      <router-link class="d-ib" to="/admin/seting/authorization/pass">已授权</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
