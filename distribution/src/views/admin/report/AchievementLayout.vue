<!-- 会员中心容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/report/list/all" v-if="$route.path === '/admin/report/list/all'">业绩统计表</router-link>
    </template>
  </third-menu>
</template>
