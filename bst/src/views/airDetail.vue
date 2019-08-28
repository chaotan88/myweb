<template>
  <div class="air-detail">
    <div class="banner-container">
      <img src="../../static/images/info1.png" class="detail-banner" />
    </div>
    <div class="detail-content">
      <div class="left">
        <div class="tree-menu">
					<p class="tree-title">国际机票</p>
          <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <div class="submit-form">
          <div class="title">
            <span>在线表单提交</span>
            <span>更多</span>
          </div>
          <div>如果您想要预订机票，请提交！</div>
          <div class="input-item">
            <span>姓名：</span>
            <el-input v-model="name"></el-input>
          </div>
          <div class="input-item">
            <span>电话：</span>
            <el-input v-model="phone"></el-input>
          </div>
          <div class="input-item">
            <span>邮箱：</span>
            <el-input v-model="email"></el-input>
          </div>
          <div class="input-item">
            <span>微信/QQ：</span>
            <el-input v-model="qq"></el-input>
          </div>
        </div>
        <div class="submit-form concat-me">
          <div class="title">
            <span>联系我们</span>
            <span>更多</span>
          </div>
          <div>
            客服QQ：
            <span>
              <a
                target="_blank"
                href="http://wpa.qq.com/msgrd?v=3&amp;uin=294519179&amp;site=qq&amp;menu=yes"
              >
                <img
                  border="0"
                  src="http://wpa.qq.com/pa?p=2:294519179:51"
                  alt="点击这里给我发消息"
                  title="点击这里给我发消息"
                />
              </a>
            </span>
          </div>
          <div>客服电话: 4006-888-888</div>
        </div>
      </div>
      <div class="right" v-if="airDetail.name">
        <div class="title">详细说明</div>
				<div class="details">
					<div class="left-img">
						<div class="pic-zoom" >
							<!-- <pic-zoom :scale="2" :url="`../../static/images/airImage/${airDetail.selectImg}.jpg`"
								v-if="airDetail.selectImg" :scroll="false"></pic-zoom>
							<pic-zoom :scale="2" :url="`../../static/images/airImage/${airDetail.images[0]}.jpg`"
								v-if="!airDetail.selectImg" :scroll="false"></pic-zoom> -->
								<img :src="`../../static/images/airImage/${airDetail.selectImg}.jpg`"
								v-if="airDetail.selectImg"/>
								<img :src="`../../static/images/airImage/${airDetail.images[0]}.jpg`"
								v-if="!airDetail.selectImg"/>
						</div>
						<div class="small-img">
							<img v-for="(img, index) in airDetail.images" :key="index" @click="changeSelectImg(img)"
								:src="`../../static/images/airImage/${img}.jpg`"/>
						</div>
					</div>
					<div class="right-desc">
						<p class="name">【包邮】{{airDetail.from}} - {{airDetail.to}} {{airDetail.name}}</p>
						<p class="price">价格<span>{{airDetail.offerPrice}}</span> 元</p>
						<p class="city"><span>城市</span>{{airDetail.from}}</p>
						<div class="qq-and-wechat">
							<div class="qq">
								<img src="../../static/images/qq.png"/>
								<div class="qq-content">
									<p>QQ</p>
									<div>
										<a
									target="_blank"
									href="http://wpa.qq.com/msgrd?v=3&amp;uin=294519179&amp;site=qq&amp;menu=yes"
								>
									<img
										border="0"
										src="http://wpa.qq.com/pa?p=2:294519179:51"
										alt="点击这里给我发消息"
										title="点击这里给我发消息"
									/>
								</a>
									</div>
								</div>
							</div>
							<div class="wechat" title="单击添加，并咨询客服" @click="showWechatQrCode">
								<img src="../../static/images/wechart.png"/>
								<p>微信</p>
							</div>
						</div>
					</div>
				</div>
				<div class="title">产品说明</div>
				<div class="detai-images">
					<img v-for="(img, index) in airDetail.detais" :key="index"
						:src="`../../static/images/airImage/${img}.jpg`"/>
				</div>
      </div>
    </div>
		<el-dialog
			title="微信扫一扫，添加客服"
			:visible.sync="showCode"
			width="30%"
			center
			:modal="true"
			:modal-append-to-body="false">
			<img src="../../static/images/concat-wechart.jpg"/>
		</el-dialog>
  </div>
</template>

<script>
import {citys} from '@/views/datas/airData';
import PicZoom from 'vue-piczoom'
export default {
  data() {
    return {
      menus: ["美洲机票信息", "欧洲机票信息", "澳洲机票信息"],
      name: "",
      phone: "",
      email: "",
      qq: "",
      activeTag: "0",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
			},
			airDetail: {
				selectImg: 0,
			},
			showCode: false
    };
	},
	components: {
    PicZoom
  },
  methods: {
    changeTag(index) {
      this.activeTag = index + "";
    },
    handleNodeClick(data) {
      console.log(data);
		},
		groupTree() {
			let newData = [];
			citys.forEach(city => {
				let childData = [];
				city.citys.forEach(ci => {
					childData.push({
						label: ci,
						children: [],
					});
				});
				newData.push({
					label: city.island,
					children: childData
				});
			})
			this.treeData = newData;
		},
		changeSelectImg(img) {
			this.airDetail.selectImg = img;
			this.$set(this.airDetail, 'selectImg', img)
			console.log(this.airDetail.selectImg)
		},
		showWechatQrCode() {
			this.showCode = true;
		}
  },
  mounted() {
		if (sessionStorage.getItem('air_detail'))
			this.airDetail = Object.assign({}, JSON.parse(sessionStorage.getItem('air_detail')));
		this.groupTree();
  }
};
</script>

<style lang="less">
.magnifier-box {
    width: 100%;
    height: 100%;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    overflow: hidden;
    position: relative;
}
</style>
<style lang="less" scoped>
.air-detail {
  .banner-container {
    margin: 0 auto;
    width: 1200px;
    .detail-banner {
      width: 1200px;
      height: 100%;
      border-radius: 5%;
    }
  }
  .detail-content {
    width: 1200px;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    .left {
      width: 320px;
      .tree-menu {
				border: 1px solid #eee;
				.tree-title {
					padding: 10px;
    			border-bottom: 1px solid #eee;
				}
			}
      .submit-form {
        margin-top: 20px;
        border: 1px solid #eee;
        padding: 20px;
        font-size: 12px;
        color: #545454;
        .title {
          background-color: #e4e6fb;
          height: 30px;
          line-height: 30px;
          margin: -20px -20px;
          margin-bottom: 20px;
          color: #0001cc;
          font-size: 14px;
          padding: 0 20px;
          span:nth-child(2) {
            float: right;
            cursor: pointer;
          }
        }
        .input-item {
          display: flex;
          margin-top: 20px;
          .el-input {
            width: 200px;
          }
          span {
            line-height: 40px;
            width: 70px;
          }
        }
      }
      .concat-me {
        div:nth-child(2) {
          margin-bottom: 20px;
        }
      }
    }
    .right {
      width: 880px;
			margin-left: 20px;
			border: 1px solid #eee;
      .title {
        font-size: 18px;
        color: #333333;
				border-bottom: 1px dashed #eee;
				padding-left: 20px;
      }
      div {
        font-family: 微软雅黑;
        font-size: 20px;
        margin: 10px 0;
			}
			.details {
				display: flex;
				.left-img {
					.pic-zoom {
						width: 440;
						height: 440;
						border: 1px solid #eee;
						img {
							width: 420px;
							height: 420px;
							margin: 10px;
						}
					}
					.small-img {
						margin-left: 10px;
						img {
							margin-right: 15px;
							cursor: pointer; 
						}
					}
				}
				.right-desc {
					.name {
						font-size: 20px;
						color: #212121;
						font: bold 16px/2 "微软雅黑";
						margin-top: 10px;
					}
					.price {
							color: #545454;
							font-family: Arial,"微软雅黑","宋体";
							font-size: 12px;
							background: #eee;
    					padding-left: 20px;
						span {
							color: #E53A3E;	
							font-style: normal;
							font-size: 24px;
							margin-left: 30px;
						}
					}
					.city {
						color: #545454;
						font-family: Arial,"微软雅黑","宋体";
						font-size: 12px;
						margin-left: 20px;
						span {
							margin-right: 30px;
							margin-top: 20px;
						}
					}
					.qq-and-wechat {
						padding-left: 20px;
						.qq, .wechat {
							display: inline-block;
							border: 1px solid #eee;
							padding: 5px;
							font-size: 12px;
							font-weight: 400;
							color: #888;
							height: 70px;
							float: left;
							img, .qq-content {
								display: inline-block;
								float: left;
							}
							img {
								vertical-align: middle;
							}
							p{
								font-size: 12px;
								font-weight: 400;
								color: #888;
								margin: 0;
							}
						}
						.wechat {
							cursor: pointer;
							margin-left: 40px;
							width: 100px;
							padding-top: 30px;
							height: 40px;
							img {
								margin-right: 20px;
							}
						}
					}
				}
			}
    }
	}
	.el-dialog__wrapper {
		img {
			margin-left: 90px;
		}
	}
}
</style>