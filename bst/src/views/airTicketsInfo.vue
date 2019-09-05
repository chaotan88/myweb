<template>
  <div class="air-info">
    <div class="banner-container">
      <img :src="`${$config.rootPath}info1.png`" class="info-banner" />
    </div>
    <div class="info-content">
      <div class="left">
        <img :src="`${$config.rootPath}info2.jpg`"/>
        <div class="tabs">
          <p v-for="(item, index) in menus" :key="index" @click="changeTag(index)"
            :class="activeTag === index + '' ? 'tab-active' : ''">{{item}}</p>
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
          <div>客服QQ：<span>
            <a target="_blank" :href="`http://wpa.qq.com/msgrd?v=3&amp;uin=${$config.qq1}&amp;site=qq&amp;menu=yes`">
              <img border="0" :src="`http://wpa.qq.com/pa?p=2:${$config.qq1}:51 alt='点击这里给我发消息' title='点击这里给我发消息'`">
            </a>
          </span></div>
          <div>客服电话: {{$config.phone}}</div>
        </div>
      </div>
      <div class="right">
        <div v-if="activeTag === '0'">
          <div class="title">美洲机票信息</div>
          <div>上海出发</div>
          <img :src="`${$config.rootPath}meizhou1.png`"/>
          <div>北京出发</div>
          <img :src="`${$config.rootPath}meizhou2.png`"/>
          <div>其他城市出发</div>
          <img :src="`${$config.rootPath}meizhou3.png`"/>
        </div>
        <div v-else-if="activeTag === '1'">
          <div class="title">欧洲机票信息</div>
          <div>上海出发</div>
          <img :src="`${$config.rootPath}ouzhou1.png`"/>
          <div>其他城市出发</div>
          <img :src="`${$config.rootPath}ouzhou2.png`"/>
        </div>
        <div v-else>
          <div class="title">澳洲机票信息</div>
          <div></div>
          <img :src="`${$config.rootPath}aozhou1.png`"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menus: ['美洲机票信息', '欧洲机票信息', '澳洲机票信息'],
      name: '',
      phone: '',
      email: '',
      qq: '',
      activeTag: '0'
		};
  },
  methods: {
    changeTag(index) {
      this.activeTag = index + '';
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.activeTag = this.$route.params.id + '';
    }
  }
};
</script>

<style lang="less" scoped>
.air-info {
  .banner-container {
    margin: 0 auto;
    width: 1200px;
    .info-banner {
      width: 1200px;
      height: 100%;
      border-radius: 5%;
    }
  }
  .info-content {
    width: 1200px;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    .left {
      width: 320px;
      .tabs {
        border: 1px solid #eee;
        p {
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-weight: 400;
          font-size: 16px;
          color: #555555;
          border-bottom: 1px dashed #eee;
          cursor: pointer;
        }
        p:hover {
          color: #cc3399;
        }
        .tab-active {
          color: #cc3399;
        }
      }
      .submit-form {
        margin-top: 20px;
        border: 1px solid #eee;
        padding: 20px;
        font-size: 12px;
        color: #545454;
        .title {
          background-color: #E4E6FB;
          height: 30px;
          line-height: 30px;
          margin: -20px -20px;
          margin-bottom: 20px;
          color: #0001CC;
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
      .title {
        font-size: 26px;
        color: #333333;
        border-bottom: 1px dashed #eee;
        margin-bottom: 20px;
        padding-bottom: 20px;
        margin-top: -20px;
      }
      div {
        font-family: 微软雅黑;
        font-size: 20px;
        margin: 20px 0;
      }
    }
  }
}
</style>