<template>
	<div class="setting-layout-wrap">
		<div class="pos-a nav-wrap">
			<router-link to="/admin/order/order-management/all-order/0">全部</router-link>
      <router-link to="/admin/order/order-management/wait-payment/1">待付款</router-link>
      <router-link to="/admin/order/order-management/wait-delivery/2">待发货</router-link>
      <router-link to="/admin/order/order-management/wait-take-delivery/3">待收货</router-link>
      <router-link to="/admin/order/order-management/wait-evaluation/4">待评价</router-link>
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
