<!-- 商品管理容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/mall/manage/index">全部</router-link>
      <router-link class='d-ib ta-c' to="/admin/mall/manage/wait">待审核</router-link>
      <router-link class='d-ib ta-c' to="/admin/mall/manage/pass">审核已通过</router-link>
      <router-link class='d-ib ta-c' to="/admin/mall/manage/reject">审核不通过</router-link>
    </template>
  </third-menu>
</template>
