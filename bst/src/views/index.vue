<template>
  <div class="index">
    <carousel></carousel>
    <div class="content">
      <div class="title">
        <img src="../../static/images/home1.png"/>
        <span>限时优惠</span>
      </div>
      <div class="limited-time">
        <div class="item" v-for="(item, index) in hots" :key="index">
          <img :src="`../../static/images/airImage/${item.images[0]}.jpg`">
          <p>{{item.from}}-{{item.to}} {{item.name}}</p>
          <div><span>&yen;{{item.offerPrice}}</span><span>&yen;{{item.price}}</span></div>
        </div>
      </div>
      <div class="air-type-list">
        <div class="left1">
          <div class="title1">
            <img src="../../static/images/index3.png"/>
            <span>美洲机票</span>
          </div>
          <p class="title2">国际机票，天天享特价！</p>
          <p class="btn">查看更多</p>
          <div class="title3">
            当季热门
          </div>
          <div class="city-buttons">
            <div v-for="(item, index) in meizhouCity" :key="index"  v-if="index < 6">
              <p>{{item}}</p>
            </div>
          </div>
        </div>
        <div class="right">
          <div v-for="(item, index) in meizhouAir" :key="index" class="right-item">
            <img :src="`../../static/images/airImage/${item.images[0]}.jpg`"/>
            <div class="name">{{item.from}}-{{item.to}} {{item.name}}</div>
            <div class="price">&yen;{{item.price}}</div>
          </div>
        </div>
      </div>
      <div class="air-type-list">
        <div class="left2">
          <div class="title1">
            <img src="../../static/images/index3.png"/>
            <span>欧洲机票</span>
          </div>
          <p class="title2">国际机票，天天享特价！</p>
          <p class="btn">查看更多</p>
          <div class="title3">
            当季热门
          </div>
          <div class="city-buttons">
            <div v-for="(item, index) in ouzhouCity" :key="index"  v-if="index < 6">
              <p>{{item}}</p>
            </div>
          </div>
        </div>
        <div class="right">
          <div v-for="(item, index) in ouzhouAir" :key="index" class="right-item">
            <img :src="`../../static/images/airImage/${item.images[0]}.jpg`"/>
            <div class="name">{{item.from}}-{{item.to}} {{item.name}}</div>
            <div class="price">&yen;{{item.price}}</div>
          </div>
        </div>
      </div>
      <div class="air-type-list">
        <div class="left3">
          <div class="title1">
            <img src="../../static/images/index3.png"/>
            <span>澳洲机票</span>
          </div>
          <p class="title2">国际机票，天天享特价！</p>
          <p class="btn">查看更多</p>
          <div class="title3">
            当季热门
          </div>
          <div class="city-buttons">
            <div v-for="(item, index) in aozhouCity" :key="index"  v-if="index < 6">
              <p>{{item}}</p>
            </div>
          </div>
        </div>
        <div class="right">
          <div v-for="(item, index) in aozhouAir" :key="index" class="right-item">
            <img :src="`../../static/images/airImage/${item.images[0]}.jpg`"/>
            <div class="name">{{item.from}}-{{item.to}} {{item.name}}</div>
            <div class="price">&yen;{{item.price}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {airs, citys} from '@/views/datas/airData';
export default {
  data() {
    return {
      hots: [],
      meizhouCity: [],
      aozhouCity: [],
      ouzhouCity: [],
      meizhouAir: [],
      aozhouAir: [],
      ouzhouAir: []
    }
  },
  methods: {
    groupData() {
      this.hots = airs.filter(da => da.isHot);
      this.meizhouAir = airs.filter(da => (da.island === '美洲' && da.islandRecommend));
      this.aozhouAir = airs.filter(da => (da.island === '澳洲' && da.islandRecommend));
      this.ouzhouAir = airs.filter(da => (da.island === '欧洲' && da.islandRecommend));
      this.meizhouCity = citys.filter(da => da.island === '美洲')[0].citys;
      this.aozhouCity = citys.filter(da => da.island === '澳洲')[0].citys;
      this.ouzhouCity = citys.filter(da => da.island === '欧洲')[0].citys;
    }
  },
  mounted() {
    this.groupData();
  }
}
</script>

<style lang="less" scoped>
  .index {
    .content {
      width: 1200px;
      margin: auto;
      margin-top: 20px;
      .title {
        font-family: 微软雅黑;
        font-size: 22px;
        color: #555555;
        font-weight: 400;
        line-height: 1.3;
      }
      .limited-time {
        margin-top: 20px;
        .item {
          display: inline-block;
          width: 285px;
          height: 290px;
          border: 1px solid #eee;
          margin-right: 10px;
          img {
            width: 269px;
            height: 192px;
            margin-left: 8px;
          }
          p {
            font: normal 400 16px/1 '微软雅黑';
            margin-top: 20px;
            margin-left: 20px;
            height: 20px;
            overflow: hidden;
            line-height: 20px;
            margin-bottom: 20px;
            cursor: pointer;
          }
          p:hover {
            color: #2577e3;
          }
          div {
            span:nth-child(1) {
              font-family: 微软雅黑;
              font-size: 22px;
              color: #FF9913;
              margin: 0 20px;
            }
            span:nth-child(2) {
              color: #999999;
              font-family: 微软雅黑;
              font-size: 14px;
              text-decoration: line-through;
            }
          }
        }
      }
      .air-type-list {
        margin-top: 30px;
        display: flex;
        .left1, .left2, .left3 {
          background-size: 100% 100%;
          width: 230px;
          height: 500px;
          color: #fff;
          .title1 {
            font-size: 22px;
            color: #FFFFFF;
            padding: 20px;
            span {
              line-height: 50px;
            }
          }
          .title2 {
            font-size: 14px;
            text-align: center;
          }
          .btn {
            width: 110px;
            height: 38px;
            border: 2px solid #fff;
            text-align: center;
            line-height: 38px;
            margin: auto;
            margin-top: 40px;
          }
          .title3 {
            font-weight: 700;
            font-size: 16px;
            margin-top: 70px;
            text-align: center;
          }
          .city-buttons {
            display: flex;
            flex-wrap: wrap;
            div {
              width: 90px;
              height: 36px;
              background-color: #faeed3;
              color: #ff403b;
              font-size: 14px;
              margin: 10px;
              text-align: center;
              line-height: 36px;
              cursor: pointer;
            }
          }
        }
        .left1 {
          background-image: url(../../static/images/meizhou-bg.jpg);
        }
        .left2 {
          background-image: url(../../static/images/ouzhou-bg.jpg);
        }
        .left3 {
          background-image: url(../../static/images/aozhou-bg.jpg);
        }
        .right {
          background: #fafafa;
          width: ~'calc(100% - 230px)';
          padding: 20px;
          display: flex;
          flex-wrap: wrap;
          height: 460px;
          .right-item {
            width: 280px;
            height: 250px;
            img {
              width: 220px;
              height: 150px;
            }
            .name {
              font-size: 14px;
              color: #555;
              cursor: pointer;
              height: 30px;
              line-height: 30px;
              overflow: hidden;
              width: 200px;
            }
            .name:hover {
              color: #ff3c3c;
              text-decoration: underline;
            }
            .price {
              font-size: 20px;
              color: #FF9913;
            }
          }
        }
      }
    }
  }
</style>