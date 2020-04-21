<template>
	<div class="setting-layout-wrap">
    <div class="ta-c pos-a nav-list-wrap">
			<router-link class="d-ib" to="/admin/device/manage/deviceList">{{$t('common.defaultSettings')}}</router-link>
		</div>
		<router-view></router-view>
	</div>
</template>
