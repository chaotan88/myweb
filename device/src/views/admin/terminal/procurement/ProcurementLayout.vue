<template>
	<div class="setting-layout-wrap">
    <div class="ta-c pos-a nav-list-wrap">
			<router-link class="d-ib" to="/admin/device/manage/deviceList">{{$t('menu.addressManage')}}</router-link>
			<!-- <router-link class="d-ib" to="/admin/device/manage/homeUserManage">家庭用户管理</router-link>
			<router-link class="d-ib" to="/admin/device/manage/vistorManage">访客管理</router-link>
			<router-link class="d-ib" to="/admin/device/manage/deviceSetting">设备设置</router-link> -->
		</div>
		<router-view></router-view>
	</div>
</template>
