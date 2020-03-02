<template>
	<div class="setting-layout-wrap">
    <div class="ta-c pos-a nav-list-wrap">
      <router-link class="d-ib" to="/admin/device/deviceAssign/assignList/all">全部</router-link>
      <router-link class="d-ib" to="/admin/device/deviceAssign/assignList/notAssign">未分配</router-link>
      <router-link class="d-ib" to="/admin/device/deviceAssign/assignList/assigned">已分配</router-link>
    </div>
		<router-view></router-view>
	</div>
</template>
