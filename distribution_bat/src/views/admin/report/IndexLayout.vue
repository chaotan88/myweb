<!-- 会员中心容器 -->
<template>
  <third-menu>
    <template slot="main">
			<router-link class='d-ib ta-c' to="/admin/report/list/all" v-if="$route.path === '/admin/report/list/all'">业绩表</router-link>
			<router-link class='d-ib ta-c' to="/admin/report/list/details" v-if="$route.path === '/admin/report/list/details'">业绩明细</router-link>
    </template>
  </third-menu>
</template>
