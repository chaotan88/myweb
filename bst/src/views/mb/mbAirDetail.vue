<template>
  <div class="mb-air-detail">
		<div class="detail-header">
			<img :src="`${$config.rootPath}airImage/${mbAirInfo.images[0]}.jpg`" v-if="mbAirInfo.images">
			<img :src="`${$config.rootPath}airImage/1.jpg`" v-else>
		</div>
		<div class="detail-name">{{mbAirInfo.name}}</div>
		<div class="detail-address">{{mbAirInfo.from}} - {{mbAirInfo.to}}</div>
		<div class="detail-price">价格<span>&yen;{{mbAirInfo.price}}</span><span>&yen;{{mbAirInfo.offerPrice}}</span></div>
		<div class="detail-images">
			<img
				v-for="(img, index) in mbAirInfo.detais"
				:key="index"
				:src="`${$config.rootPath}airImage/${img}.jpg?version=${$config.version}`"
			/>
			<img
				v-for="(img, index) in 4"
				:src="`${$config.airDetailPath}/${index + 1}.jpg?version=${$config.version}`"
			/>
		</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mbAirInfo: {}
    };
  },
  mounted() {
    this.mbAirInfo = JSON.parse(sessionStorage.getItem('mbAirInfo'));
  },
  methods: {
    
  }
};
</script>
<style rel="stylesheet/less" lang="less" scoped>
	.mobile-home {
		overflow: hidden;
	}
	.mb-air-detail {
		height: ~'calc(100% - 115px)';
		margin-top: 75px;
		overflow-y: auto;
		.detail-header {
			width: 100%;
			img {
				width: ~'calc(100% - 20px)';
    		margin: 10px;
			}
		}
		.detail-name {
			margin: 0 20px;
			padding-bottom: 10px;
			border-bottom: 1px dashed #dddddd;
		}
		.detail-price, .detail-address {
			margin: 0 20px;
			padding: 10px 0;
			border-bottom: 1px dashed #dddddd;
			color: #666;
			span:nth-child(1) {
				margin: 0 20px;
				text-decoration: line-through;
			}
			span:nth-child(2) {
				color: red;
			}
		}
		.detail-images {
			img {
				width: 100%;
			}
		}
	}
</style>
