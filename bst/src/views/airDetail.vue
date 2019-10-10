<template>
  <div class="air-detail">
    <div class="banner-container">
      <img :src="`${$config.rootPath}info1.png?version=${$config.version}`" class="detail-banner" />
    </div>
    <div class="detail-content">
      <div class="left">
        <div class="tree-menu">
          <p class="tree-title">国际机票</p>
          <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <!-- <div class="submit-form">
          <div class="title">
            <span class="submit">在线表单提交</span>
          </div>
          <div>如果您想要预订机票，请提交！</div>
          <div class="input-item">
            <span>姓名：<span class="required">*</span></span>
            <el-input v-model="name" placeholder="您的姓名"></el-input>
            <p class="not-allowed" v-if="noName">姓名不能为空</p>
          </div>
          <div class="input-item">
            <span>电话：<span class="required">*</span></span>
            <el-input v-model="phone" placeholder="您的电话"></el-input>
            <p class="not-allowed" v-if="noPhone">电话不能为空</p>
          </div>
          <div class="input-item">
            <span>邮箱：<span class="required">*</span></span>
            <el-input v-model="email" placeholder="您的邮箱"></el-input>
            <p class="not-allowed" v-if="noEmail">邮箱不能为空</p>
          </div>
          <div class="input-item">
            <span>微信/QQ：<span class="required">*</span></span>
            <el-input v-model="qq" placeholder="您的微信/QQ"></el-input>
            <p class="not-allowed" v-if="noQQ">微信/QQ不能为空</p>
          </div>
            <el-button type="primary" @click="submitForm">提交</el-button>
        </div> -->
        <div class="wechart-img">
          <img :src="`${$config.rootPath}concat-wechart1.jpg`"/>
        </div>
        <div class="submit-form concat-me">
          <div class="title">
            <span>联系我们</span>
          </div>
          <div>
            客服QQ：
            <span>
              <a target="_blank" :href="`http://wpa.qq.com/msgrd?v=3&amp;uin=${$config.qq1}&amp;site=qq&amp;menu=yes`">
              <img border="0" :src="`http://wpa.qq.com/pa?p=2:${$config.qq1}:51 alt='点击这里给我发消息' title='点击这里给我发消息'`">
            </a>
            </span>
          </div>
          <div>客服电话: {{$config.phone}}</div>
        </div>
      </div>
      <div class="right" v-if="airDetail.name">
        <div class="title">详细说明</div>
        <div class="details">
          <div class="left-img">
            <div class="pic-zoom">
              <!-- <pic-zoom :scale="2" :url="`${config.rootPath}airImage/${airDetail.selectImg}.jpg`"
								v-if="airDetail.selectImg" :scroll="false"></pic-zoom>
							<pic-zoom :scale="2" :url="`${config.rootPath}airImage/${airDetail.images[0]}.jpg`"
              v-if="!airDetail.selectImg" :scroll="false"></pic-zoom>-->
              <img
                :src="`${$config.rootPath}airImage/${airDetail.selectImg}.jpg?version=${$config.version}`"
                v-if="airDetail.selectImg"
              />
              <img
                :src="`${$config.rootPath}airImage/${airDetail.images[0]}.jpg?version=${$config.version}`"
                v-if="!airDetail.selectImg"
              />
            </div>
            <div class="small-img">
              <img
                v-for="(img, index) in airDetail.images"
                :key="index"
                @click="changeSelectImg(img)"
                :src="`${$config.rootPath}airImage/${img}.jpg?version=${$config.version}`"
              />
            </div>
          </div>
          <div class="right-desc">
            <p class="name">【包邮】{{airDetail.from}} - {{airDetail.to}} {{airDetail.name}}</p>
            <p class="price">
              价格
              <span class="rel-price">{{airDetail.price}}元</span>
              <span>{{airDetail.offerPrice}}</span> 元
              
            </p>
            <p class="city">
              <span>城市</span>
              {{airDetail.from}}
            </p>
            <div class="qq-and-wechat">
              <div class="qq">
                <img :src="`${$config.rootPath}qq.png`" />
                <div class="qq-content">
                  <p>QQ</p>
                  <div>
                    <a target="_blank" :href="`http://wpa.qq.com/msgrd?v=3&amp;uin=${$config.qq1}&amp;site=qq&amp;menu=yes`">
                      <img border="0" :src="`http://wpa.qq.com/pa?p=2:${$config.qq1}:51 alt='点击这里给我发消息' title='点击这里给我发消息'`">
                    </a>
                  </div>
                </div>
              </div>
              <div class="wechat" title="单击添加，并咨询客服" @click="showWechatQrCode">
                <img :src="`${$config.rootPath}wechart.png`" />
                <p>微信</p>
              </div>
            </div>
          </div>
        </div>
        <div class="title">产品说明</div>
        <div class="detai-images">
          <img
            v-for="(img, index) in airDetail.detais"
            :key="index"
            :src="`${$config.rootPath}airImage/${img}.jpg?version=${$config.version}`"
          />
          <img
            v-for="(img, index) in detailImgList"
            :src="`${$config.airDetailPath}/${index + 1}.jpg?version=${$config.version}`"
          />
        </div>
      </div>
    </div>
    <el-dialog
      title="微信扫一扫，添加客服"
      :visible.sync="showCode"
      width="30%"
      center
      :modal="true"
      :modal-append-to-body="false"
    >
      <img :src="`${$config.rootPath}concat-wechart1.jpg`" style="width: 200px; height: 200px;"/>
    </el-dialog>
  </div>
</template>

<script>
import { citys } from "@/views/datas/airData";
import PicZoom from "vue-piczoom";
export default {
  data() {
    return {
      menus: ["美洲机票信息", "欧洲机票信息", "澳洲机票信息"],
      name: "",
      phone: "",
      email: "",
      qq: "",
      noName: false,
      noPhone: false,
      noEmail: false,
      noQQ: false,
      activeTag: "0",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      airDetail: {
        selectImg: 0
      },
      detailImgList: ['','','',''],
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
            children: []
          });
        });
        newData.push({
          label: city.island,
          children: childData
        });
      });
      this.treeData = newData;
    },
    changeSelectImg(img) {
      this.airDetail.selectImg = img;
      this.$set(this.airDetail, "selectImg", img);
      console.log(this.airDetail.selectImg);
    },
    showWechatQrCode() {
      this.showCode = true;
    },
    submitForm() {
      if (!this.name) {
        this.noName = true;
        return false;
      } else {
        this.noName = false;
      }
      if (!this.phone) {
        this.noPhone = true;
        return false;
      } else {
        this.noPhone = false;
      }
      if (!this.email) {
        this.noEmail = true;
        return false;
      } else {
        this.noEmail = false;
      }
      if (!this.qq) {
        this.noQQ = true;
        return false;
      } else {
        this.noQQ = false;
      }
      this.$message({
        type: 'success',
        message: '提交成功'
      });
    }
  },
  mounted() {
    if (sessionStorage.getItem("air_detail"))
      this.airDetail = Object.assign(
        {},
        JSON.parse(sessionStorage.getItem("air_detail"))
			);
		if (!this.airDetail.images) {
			this.airDetail.images = ['1', '2', '3', '4'];
		}
		if (!this.airDetail.detais) {
			this.airDetail.detais = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
		}
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
          position: relative;
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
							width: 90px;
							height: 90px;
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
            font-family: Arial, "微软雅黑", "宋体";
            font-size: 12px;
            background: #eee;
            padding-left: 20px;
            line-height: 30px;
            span {
              color: #e53a3e;
              font-style: normal;
              font-size: 24px;
              margin-left: 30px;
            }
            .rel-price {
              color: #999999;
              font-size: 14px;
              text-decoration: line-through;
            }
          }
          .city {
            color: #545454;
            font-family: Arial, "微软雅黑", "宋体";
            font-size: 12px;
            margin-left: 20px;
            margin-top: 10px;
            span {
              margin-right: 30px;
              margin-top: 20px;
            }
          }
          .qq-and-wechat {
            padding-left: 20px;
            .qq,
            .wechat {
              border: 1px solid #eee;
              padding: 5px;
              font-size: 12px;
              font-weight: 400;
              color: #888;
              height: 70px;
              float: left;
              img,
              .qq-content {
                float: left;
              }
              img {
                vertical-align: middle;
              }
              p {
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
  .el-button {
    margin-top: 20px;
    margin-left: 90px;
  }
  .required {
    color: red;
  }
  .submit {
      cursor: pointer;
  }
  .submit:hover {
      color: blue;
  }
  .not-allowed {
    position: absolute;
    top: 40px;
    left: 70px;
    color: red;
  }
  .wechart-img {
    padding: 20px;
    width: calc(100% - 40px);
    img {
      width: 100%;
    }
  }
}
</style>