<!-- 推广拉新容器 -->
<template>
  <third-menu>
    <template slot="main">
			<router-link class='d-ib ta-c' :to="{path: '/admin/operation/interactive/exchange', query: {type: 2}}" query>兑换专区</router-link>
			<router-link class='d-ib ta-c' to="/admin/operation/interactive/rule">芯豆规则</router-link>
			<router-link class='d-ib ta-c' to="/admin/operation/interactive/record">交易记录</router-link>
    </template>
  </third-menu>
</template>
