<template>
  <div class="concat">
    <div class="banner-container">
      <img src="../../static/images/concat-banner.png" class="concat-banner" />
    </div>
    <div class="concat-map">
      <div class="title">联系我们</div>
			<div id="allmap" class="allmap"></div>
    </div>
		<div class="concat-icons">
			<div class="icon-item">
				<img src="../../static/images/concat-address.png"/>
				<div class="label">公司地址</div>
				<div class="val">{{conpanyInfo.address}}</div>
			</div>
			<div class="icon-item">
				<img src="../../static/images/concat-phone.png"/>
				<div class="label">客服热线</div>
				<div class="val">{{conpanyInfo.tel}}</div>
			</div>
			<div class="icon-item">
				<img src="../../static/images/concat-email.png"/>
				<div class="label">公司邮箱</div>
				<div class="val">{{conpanyInfo.address}}</div>
			</div>
			<div class="icon-item">
				<img src="../../static/images/concat-user.png"/>
				<div class="label">在线客服</div>
				<div class="val">{{conpanyInfo.qq}}</div>
			</div>
		</div>
		<div class="concat-wechart">
			<div class="wechart-item">
				<img src="../../static/images/concat-wechart.jpg"/>
				<div>官方微信</div>
			</div>
			<div class="wechart-item">
				<img src="../../static/images/concat-wechart.jpg"/>
				<div>官方微博</div>
			</div>
		</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
			conpanyInfo: {
				address: '上海普陀区光新路88号中一国际商务大厦18F',
				tel: '4006-888-878',
				emal: 'service@wanyouair.com',
				qq: '3244707232'
			}
		};
  },
  methods: {
    initMap() {
      let map = new BMap.Map("allmap");
      let point = new BMap.Point(113.948638, 22.554346);
      map.centerAndZoom(point, 15);

      let marker = new BMap.Marker(new BMap.Point(113.948638, 22.554346)); // 创建点
      //	marker.addEventListener("click",attribute);
      map.addOverlay(marker); //增加点
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      function attribute() {
        let p = marker.getPosition(); //获取marker的位置
        alert("marker的位置是" + p.lng + "," + p.lat);
      }
      let opts = {
        width: 340, // 信息窗口宽度
        height: 100, // 信息窗口高度
        title: "深圳市南山区xx街道xx大厦", // 信息窗口标题
        enableMessage: true, //设置允许信息窗发送短息
      };
      let infoWindow = new BMap.InfoWindow(
        '<div style="margin:0;line-height:20px;padding:2px;line-height: 24px;font-size: 16px;color: #333333;">' +
          "地址：深圳市南山区xx街道xx大厦"+
          "</div>",
        opts
      ); // 创建信息窗口对象
      map.openInfoWindow(infoWindow, point); //开启信息窗口
    }
  },
  mounted() {
		this.$nextTick((vm) => {
			this.initMap();
		})
  }
};
</script>

<style lang="less" scoped>
.concat {
  .banner-container {
    margin: 0 auto;
    width: 1200px;
    .concat-banner {
      width: 1200px;
      height: 100%;
      border-radius: 5%;
    }
  }
  .concat-map {
    .title {
      font-size: 26px;
      color: #333333;
      width: 104px;
      padding: 0 20px;
      border-left: 3px solid #cc3399;
      border-right: 3px solid #cc3399;
      margin: 0 auto;
      margin-top: 40px;
		}
		.allmap {
			width: 1200px;
			height: 266px;
			margin: 0 auto;
			margin-top: 20px;
			border-radius: 5px;
		}
	}
	.concat-icons {
		display: flex;
    justify-content: space-around;
		padding: 0 50px;
		margin-top: 40px;
		.icon-item {
			width: 172px;
			text-align: center;
			.label {
				font-size: 18px;
				color: #555555;
				margin-top: 25px;
				margin-bottom: 10px;
			}
			.val {
				line-height: 24px;
				font-size: 14px;
				color: #777777;
			}
		}
	}
	.concat-wechart {
		background-color: #fafafa;
		display: flex;
		justify-content: space-evenly;
		padding: 40px;
		div {
			text-align: center;
			margin-top: 20px;
			font-size: 18px;
			color: #cc3399;
		}
	}
}
</style>