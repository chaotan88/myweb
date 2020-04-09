<template>
	<div class="setting-layout-wrap">
    <div class="ta-c pos-a nav-list-wrap">
			<router-link class="d-ib" to="/admin/device/manage/deviceList">{{$t('menu.addressManage')}}</router-link>
			<router-link class="d-ib" :to="{path: `/admin/device/manage/homeUserManage/${this.$route.params.id}`}">{{$t('device.homeUserManage')}}</router-link>
			<router-link class="d-ib" :to="{path: `/admin/device/manage/vistorManage/${this.$route.params.id}`}">{{$t('device.visitorManage')}}</router-link>
			<router-link class="d-ib" :to="{path: `/admin/device/manage/deviceSetting/${this.$route.params.id}`}">{{$t('device.diviceSetting')}}</router-link>
		</div>
		<router-view></router-view>
	</div>
</template>
