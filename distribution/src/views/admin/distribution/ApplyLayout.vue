<!-- 会员申请容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/distribution/apply/all">全部</router-link>
      <router-link class='d-ib ta-c' to="/admin/distribution/apply/notopen">待激活</router-link>
      <router-link class='d-ib ta-c' to="/admin/distribution/apply/pass">已激活</router-link>
      <router-link class='d-ib ta-c' to="/admin/distribution/apply/reject">激活失败</router-link>
    </template>
  </third-menu>
</template>
