<template>
  <div class="footer">
    <div class="left">
      <div class="title">为什么选择我们?</div>
      <div class="icons">
        <div class="safe">
          <img src="../../../static/images/safe.png" />
          <div class="desc">
            <div>安心的服务</div>
            <div>领先的服务标准 独创的保障体系</div>
          </div>
        </div>
        <div class="price">
          <img src="../../../static/images/price.png" />
          <div class="desc">
            <div>透明的价格</div>
            <div>最优惠的价格 无任何隐形费用</div>
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <div v-for="(item, index) in channel" :key="index" class="center-item">
				<div class="item-title">{{item.title}}</div>
				<div class="item-child">
					<div v-for="(child, cIndex) in item.children" :key="cIndex">{{child.title}}</div>
				</div>
			</div>
    </div>
		<div class="right">
			<img src="../../../static/images/concat-wechart.jpg"/>
			<div>扫描关注微信公众号</div>
		</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      channel: [
        {
          title: "国际机票",
          path: "",
          children: [
            { title: "欧洲航线", path: "" },
            { title: "美洲航线", path: "" },
            { title: "澳洲在线", path: "" }
          ]
        },
        {
          title: "新闻动态",
          path: "",
          children: [
            { title: "公司新闻", path: "" },
            { title: "行业新闻", path: "" },
            { title: "常见问题", path: "" }
          ]
        },
        {
          title: "服务优势",
          path: "",
          children: [
            { title: "机票优势", path: "" },
            { title: "价格优势", path: "" },
            { title: "增值服务", path: "" },
            { title: "服务团队", path: "" }
          ]
        },
        {
          title: "关于我们",
          path: "",
          children: [
            { title: "公司文化", path: "" },
            { title: "公司优势", path: "" },
            { title: "联系我们", path: "" }
          ]
        }
      ]
    };
  },
  methods: {},
  mounted() {
    console.log("indexxxxx");
  }
};
</script>

<style lang="less" scoped>
.footer {
	display: flex;
	margin-top: 20px;
	padding: 0 120px;
	justify-content: space-between;
	.left {
		.title {
			font-family: 微软雅黑;
			font-size: 16px;
			color: #555555;
			line-height: 1.8;
		}
		.icons {
			.safe, .price {
				display: flex;
				img {
					margin-right: 10px;
				}
				.desc {
					div:nth-child(1) {
						font-family: 微软雅黑;
						font-size: 16px;
						color: #2577E3;
						line-height: 1.5;
					}
					div:nth-child(2) {
						font-size: 12px;
						color: #888888;
						line-height: 1.5;
					}
				}
			}
			.price {
				margin-top: 20px;
				.desc {
					div:nth-child(1) {
						color: #FF9913;
					}
				}
			}
		}
	}
	.center {
		display: flex;
		.center-item {
			width: 110px;
			text-align: center;
			.item-title {
				color: #555555;
				font-size: 16px;
				margin-bottom: 20px;
				cursor: pointer;
			}
			.item-child {
				color: #888888;
				font-size: 12px;
				cursor: pointer;
				div {
					margin-bottom: 15px;
				}
			}
		}
	}
	.right {
		img {
			width: 100px;
			height: 100px;
		}
		div {
			text-align: center;
			font-size: 12px;
			font-family: 微软雅黑;
			color: #888888;
			margin-top: 10px;
		}
	}
}
</style>