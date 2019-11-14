<template>
	<div class="setting-layout-wrap">
		<div class="pos-a nav-wrap">
			<router-link to="/admin/setting/basic-setting/account-info">账户信息</router-link>
			<router-link to="/admin/setting/basic-setting/account-security">账户安全</router-link>
			<router-link to="/admin/setting/basic-setting/edit-service-and-agreement/2">售后服务</router-link>
			<router-link to="/admin/setting/basic-setting/edit-service-and-agreement/1">注册协议</router-link>
			<router-link to="/admin/setting/basic-setting/advertising-setting">广告位设置</router-link>
		</div>
		<router-view></router-view>
	</div>
</template>

<style lang="less" scoped>
  .nav-wrap {
    width: 100%;
    text-align: center;
    top: -40px;
    left: 0;
    z-index: 3;
    a {
      color: #33719b;
      font-size: 18px;
      padding:4px 27px;
      border: 1px solid #33719b;
      border-radius: 5px;
      margin-left: 16px;
    }
    a.active {
      color: #fff;
      background: #33719b;
    }
  }
</style>
