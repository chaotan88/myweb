<template>
  <div class="index">
    <carousel></carousel>
    <div class="content">
      <div class="title">
        <img :src="`${$config.rootPath}home1.png`"/>
        <span>特惠行程动态</span>
      </div>
      <div class="limited-time">
        <!-- <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="(item, index) in hots" :key="index">
            <img :src="`${$config.rootPath}airImage/${item.images[0]}.jpg`">
            <p @click="toDetail(item)">{{item.from}}-{{item.to}} {{item.name}}</p>
            <div><span>&yen;{{item.offerPrice}}</span><span>&yen;{{item.price}}</span></div>
          </el-carousel-item>
        </el-carousel> -->
        <!-- <div class="item" v-for="(item, index) in hots" :key="index">
          <img :src="`${$config.rootPath}airImage/${item.images[0]}.jpg`">
          <p @click="toDetail(item)">{{item.from}}-{{item.to}} {{item.name}}</p>
          <div><span>&yen;{{item.offerPrice}}</span><span>&yen;{{item.price}}</span></div>
        </div> -->
        <!-- <div class="item" v-for="(item, index) in hots" :key="index" @click="toList('0')">
          <img :src="`${$config.hotPath}/${item}.jpg?version=${$config.version}`">
        </div> -->
        <scorllList :lists="hotss" @itemClick="toList('0')"></scorllList>
      </div>
      <div class="air-type-list">
        <div class="left1">
          <div class="title1">
            <img :src="`${$config.rootPath}/index3.png`"/>
            <span>美洲机票</span>
          </div>
          <p class="title2">国际机票，天天享特价！</p>
          <p class="btn" @click="toList('0')">查看更多</p>
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
          <div v-for="(item, index) in meizhouAir" :key="index" class="right-item" v-if="index < 8">
            <img :src="`${$config.rootPath}airImage/${item.images[0]}.jpg?version=${$config.version}`"/>
            <div class="name" @click="toDetail(item)" :title="`${item.from}-${item.to} ${item.name}`">{{item.from}}-{{item.to}} {{item.name}}</div>
            <div class="price">&yen;{{item.offerPrice}}</div>
          </div>
        </div>
      </div>
      <div class="air-type-list">
        <div class="left2">
          <div class="title1">
            <img :src="`${$config.rootPath}index3.png`"/>
            <span>欧洲机票</span>
          </div>
          <p class="title2">国际机票，天天享特价！</p>
          <p class="btn" @click="toList(2)">查看更多</p>
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
          <div v-for="(item, index) in ouzhouAir" :key="index" class="right-item" v-if="index < 8">
            <img :src="`${$config.rootPath}airImage/${item.images[0]}.jpg?version=${$config.version}`"/>
            <div class="name" @click="toDetail(item)" :title="`${item.from}-${item.to} ${item.name}`">{{item.from}}-{{item.to}} {{item.name}}</div>
            <div class="price">&yen;{{item.offerPrice}}</div>
          </div>
        </div>
      </div>
      <div class="air-type-list">
        <div class="left3">
          <div class="title1">
            <img :src="`${$config.rootPath}/index3.png`"/>
            <span>澳洲机票</span>
          </div>
          <p class="title2">国际机票，天天享特价！</p>
          <p class="btn" @click="toList(1)">查看更多</p>
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
          <div v-for="(item, index) in aozhouAir" :key="index" class="right-item" v-if="index < 8">
            <img :src="`${$config.rootPath}/airImage/${item.images[0]}.jpg?version=${$config.version}`"/>
            <div class="name" @click="toDetail(item)" :title="`${item.from}-${item.to} ${item.name}`">{{item.from}}-{{item.to}} {{item.name}}</div>
            <div class="price">&yen;{{item.offerPrice}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="company-odds">
      <div class="title">互动专区</div>
      <oddList></oddList>
      <!-- <div class="gou-tong">
        <img :src="`${$config.chartPath}goutong1.png?version=${$config.version}`"/>
        <img :src="`${$config.chartPath}goutong2.png?version=${$config.version}`"/>
        <img :src="`${$config.chartPath}goutong3.png?version=${$config.version}`"/>
      </div> -->
    </div>
  </div>
</template>

<script>
import {airs, citys} from '@/views/datas/airData?version=1'
import scorllList from '@/views/components/scorllList.vue';
import oddList from '@/views/components/oddList.vue';
export default {
  data() {
    return {
      hots: [],
      meizhouCity: [],
      aozhouCity: [],
      ouzhouCity: [],
      meizhouAir: [],
      aozhouAir: [],
      ouzhouAir: [],
      start: 0,
      size: 3,
      hotss: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    }
  },
  components: {
    scorllList,
    oddList
  },
  methods: {
    groupData() {
      // this.hots = airs.filter(da => da.isHot);
      this.groupHotData()
      this.meizhouAir = airs.filter(da => (da.island === '美洲' && da.islandRecommend));
      this.aozhouAir = airs.filter(da => (da.island === '澳洲' && da.islandRecommend));
      this.ouzhouAir = airs.filter(da => (da.island === '欧洲' && da.islandRecommend));
      this.meizhouCity = citys.filter(da => da.island === '美洲')[0].citys;
      this.aozhouCity = citys.filter(da => da.island === '澳洲')[0].citys;
      this.ouzhouCity = citys.filter(da => da.island === '欧洲')[0].citys;
      this.meizhouAir.forEach(data => {
        if (!data.images) {
          data.images = ['1', '2', '3', '4'];
        }
        if (!data.detais) {
          data.detais = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
        }
      })
      this.aozhouAir.forEach(data => {
        if (!data.images) {
          data.images = ['1', '2', '3', '4'];
        }
        if (!data.detais) {
          data.detais = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
        }
      })
      this.ouzhouAir.forEach(data => {
        if (!data.images) {
          data.images = ['1', '2', '3', '4'];
        }
        if (!data.detais) {
          data.detais = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
        }
      })
    },
    toDetail(item) {
      sessionStorage.setItem('air_detail', JSON.stringify(item));
      this.$router.push({ path: '/airDetail' });
    },
    toList(item) {
      this.$router.push({ path: `/airTicketsList/${item}` })
    },
    groupHotData() {
      if ((this.start + 1) * this.size > this.hotss.length) {
        this.start = 0;
      }
      this.hots = this.hotss.filter((da, index) => index > this.start * this.size && index <= (this.start + 1) * this.size)
      this.start += 1
    }
  },
  mounted() {
    this.groupData();
    // setInterval(() => {
    //   this.groupHotData()
    // }, 8000)
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
        transition: width 200ms;
        transition: all 0.5s linear;
        transform: translate3d(0, 0, 0);
        // transform: translateX(205px) scale(1);
        // transform: translateX(785.15px) scale(0.83);
        .item {
          display: inline-block;
          // width: 285px;
          // height: 290px;
          border: 1px solid #eee;
          margin-right: 10px;
          cursor: pointer;
          img {
            width: 359px;
            height: 397px;
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
            cursor: pointer;
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
            width: 25%;
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
    .company-odds {
      width: 1200px;
      margin: auto;
      margin-top: 40px;
      margin-bottom: 40px;
      .title {
        font-size: 26px;
        color: #333;
        width: 1200px;
        margin: 0 auto;
        // border-left: 3px solid #39ABFF;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        position: relative;
      }
      .title:before {
        content: '';
        width: 5px;
        height: 30px;
        background: #39ABFF;
        position: absolute;
        top: 5px;
        left: -10px;
      }
      // .odds-cards {
      //   display: flex;
      //   .odds-item {
      //     position: relative;
      //     margin-right: 20px;
      //     img:nth-child(2) {
      //       position: absolute;
      //       top: 30px;
      //       left: 50%;
      //       margin-left: -40px;
      //     }
      //     div {
      //       position: absolute;
      //       font-size: 18px;
      //       color: #fff;
      //       font-weight: 400;
      //       bottom: 20px;
      //       left: 50%;
      //       margin-left: -28px;
      //     }
      //   }
      // }
      // .gou-tong {
      //   display: flex;
      // }
    }
  }
</style>