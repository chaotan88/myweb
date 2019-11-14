<!-- 会员中心容器 -->
<template>
  <third-menu>
    <template slot="main">
      <router-link class='d-ib ta-c' to="/admin/vip/upgrade/audit/index">全部</router-link>
      <router-link class='d-ib ta-c' to="/admin/vip/upgrade/audit/stay">待审核</router-link>
      <router-link class='d-ib ta-c' to="/admin/vip/upgrade/audit/adopt">审核通过</router-link>
      <router-link class='d-ib ta-c' to="/admin/vip/upgrade/audit/regression">已打回</router-link>
    </template>
  </third-menu>
</template>