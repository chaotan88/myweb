<template>
	<div class="setting-layout-wrap">
		<div class="pos-a nav-wrap">
			<router-link to="/admin/goods/classification/classification-list">分类列表</router-link>
		</div>
		<router-view></router-view>
	</div>
</template>

<style lang="less" scoped>
  	.nav-wrap{
	  	width: 100%;
  		text-align: center;
	    top: -40px;
	    left: 0;
	    z-index: 3;

		a{
	        color: #33719b;
	        font-size: 16px;
	        padding:4px 27px;
	        border: 1px solid #33719b;
	        border-radius: 5px;
	        margin-left: 16px;
		}

		a.active{
			color: #fff;
	        background: #33719b;
		}
	}
</style>
