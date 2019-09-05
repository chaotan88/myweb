<template>
  <div class="air-list">
    <div class="banner">
      <img :src="`${$config.rootPath}air1.png`"/>
    </div>
    <div class="breac">
      <span v-for="(item, index) in itemList" :key="index">{{item}}<span v-if="index !== itemList.length - 1">>></span></span>
    </div>
    <div class="search-condition">
      <div class="island">
        <span class="label">国际机票： </span>
        <span v-for="(item, index) in islands" :key="index" @click="changeIsland(item)"
          :class="selectIsland === item ? 'island-active' : ''">{{item}}</span>
      </div>
      <div class="city" v-if="selectIsland !== '全部'">
        <span class="label">{{selectIsland}}：</span>
        <span v-for="(item, index) in cityss" :key="index" @click="changeCity(item)"
          :class="selectCity === item ? 'city-active' : ''">{{item}}</span>
      </div>
      <div class="buttons">
        <span @click="searchChange('时间')" :class="selectButton === '时间' ? 'button-active' : ''">时间</span>
        <span @click="searchChange('关注度')" :class="selectButton === '关注度' ? 'button-active' : ''">关注度</span>
        <span @click="searchChange('价格从高到底')" :class="selectButton === '价格从高到底' ? 'button-active' : ''">价格从高到底</span>
        <span @click="searchChange('价格从低到高')" :class="selectButton === '价格从低到高' ? 'button-active' : ''">价格从低到高</span>
        <input v-model="startPrice"/>
        <input v-model="endPrice"/>
        <button @click="searchData">查询</button>
        <!-- <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
      </div>
    </div>
    <div class="air-content">
      <div class="air-item" v-for="(item, index) in tableData" :key="index">
        <img :src="`${$config.rootPath}airImage/${item.selectImg}.jpg`" v-if="item.selectImg" class="big-img" @click="toDetail(item)"/>
        <img :src="`${$config.rootPath}airImage/${item.images[0]}.jpg`" v-if="!item.selectImg" class="big-img" @click="toDetail(item)"/>
        <div class="small-img">
          <img v-for="(img, imgIndex) in item.images" :key="imgIndex" @click="selectSmallImg(index, imgIndex)"
           :src="`${$config.rootPath}airImage/${img}.jpg`" v-if="imgIndex < 3"/>
        </div>
        <p class="price">&yen;{{item.offerPrice}}</p>
        <div class="name" @click="toDetail(item)">{{item.from}}-{{item.to}} {{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {airs, citys} from '@/views/datas/airData';
export default {
  data() {
    return {
      itemList: [
        '首页', '国际机票'
      ],
      islands: [],
      cityss: [],
      selectIsland: '全部',
      selectCity: '全部',
      startPrice: '',
      endPrice: '',
      selectButton: '时间',
      value: '',
      tableData: [],
    }
  },
  methods: {
    groupData() {
      this.islands = citys.map(da => da.island);
      this.islands = ['全部'].concat(this.islands);
    },
    changeIsland(item) {
      this.selectIsland = item;
      this.selectCity = '全部';
      if (item === '全部') {
        this.cityss = [];
      } else {
        this.cityss = citys.filter(da => da.island === item)[0].citys;
        this.searchData();
      }
    },
    changeCity(item) {
      this.selectCity = item;
      this.searchData();
    },
    searchData() {
      this.getTableData();
      if (!this.startPrice && !this.endPrice) return false;
      this.tableData = this.tableData.filter(da => da.offerPrice > this.startPrice && da.offerPrice < this.endPrice);
    },
    searchChange(item) {
      this.selectButton = item;
      if (item === '价格从高到底') {
        const sort = (a, b) => a.offerPrice - b.offerPrice;
        this.getTableData();
        this.tableData.sort(sort);
      } else if (item === '价格从低到高') {
        const sort = (a, b) => b.offerPrice - a.offerPrice;
        this.getTableData();
        this.tableData.sort(sort);
      }
    },
    getTableData() {
      if (this.selectIsland === '全部') this.tableData = airs;
      else if (this.selectCity === '全部') this.tableData = airs.filter(da => da.island === this.selectIsland);
      else this.tableData = airs.filter(da => (da.island === this.selectIsland && da.to === this.selectCity));
      this.tableData.forEach(data => {
        if (!data.images) {
          data.images = ['1', '2', '3', '4'];
        }
        if (!data.detais) {
          data.detais = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
        }
      })
    },
    selectSmallImg(index, imgIndex) {
      let item = this.tableData[index];
      item.selectImg = item.images[imgIndex];
      this.$set(this.tableData, index, item);
    },
    toDetail(item) {
      sessionStorage.setItem('air_detail', JSON.stringify(item));
      this.$router.push({ path: '/airDetail' });
    },
  },
  mounted() {
    if (this.$route.params.id) {
      const islands = ['美洲', '澳洲', '欧洲', '亚洲'];
      this.selectIsland = islands[this.$route.params.id];
    }
    this.groupData();
    this.getTableData();
  }
}
</script>

<style lang="less" scoped>
  .air-list {
    .banner {
      width: 1200px;
      margin: auto;
    }
    .breac {
      width: 1200px;
      margin: auto;
      background-color: #f8f8f8;
      height: 35px;
      line-height: 35px;
      margin-top: 10px;
      padding-left: 10px;
      font-size: 14px;
      color: #333;
      span {
        span {
          color: #0001CC;
          margin: 0 8px;
        }
      }
    }
    .search-condition {
      width: 1200px;
      margin: auto;
      font-size: 14px;
      color: #333;
      .island {
        margin-top: 30px;
        border-bottom: 1px dashed #e5e4e4;
        padding-bottom: 8px;
      }
      .island-active, .city-active {
        background-color: #0001CC;
        width: auto;
        padding: 0 10px;
        height: 20px;
        line-height: 20px;
        color: #fff;
      }
      span:hover {
        // background-color: #eee;
        // color: #0001CC;
      }
      span {
        margin-right: 20px;
        cursor: pointer;
      }
      .label {
        margin-right: 20px;
        cursor: default;
      }
      .city {
        margin-top: 10px;
        border-bottom: 1px dashed #e5e4e4;
        padding-bottom: 8px;
      }
      .buttons {
        height: 38px;
        background-color: #f7f7f7;
        padding-top: 8px;
        padding-left: 20px;
        span {
          // background-color: #0001CC;
          border: 1px solid #eee;
          width: auto;
          padding: 5px 10px;
          height: 30px;
          line-height: 30px;
          color: #333;
          text-align: center;
          margin-top: 8px;
        }
        .button-active {
          background-color: #0001CC;
          color: #fff;
        }
        input {
          width: 50px;
        }
        button {
          cursor: pointer;
          margin-left: 20px;
        }
      }
    }
    .air-content {
      display: flex;
      flex-wrap: wrap;
      width: 1200px;
      margin: auto;
      margin-top: 20px;
      .air-item {
        width: 290px;
        height: 470px;
        border: 1px solid #eee;
        margin-left: 30px;
        margin-top: 20px;
        .big-img {
          width: 210px;
          height: 210px;
          margin-left: 30px;
          margin-top: 20px;
          cursor: pointer;
        }
        .small-img {
          display: flex;
          margin-top: 40px;
          margin-left: 20px;
          img {
            width: 65px;
            height: 65px;
            margin-right: 10px;
          }
        }
        .price {
          font-weight: 700;
          color: #ff3a3a;
          font-size: 18px;
          margin-top: 20px;
          margin-left: 20px;
        }
        .name {
          font-size: 14px;
          color: #555555;
          margin-left: 20px;
          margin-top: 20px;
          cursor: pointer;
        }
        .name:hover {
          color: #0001CC;
          text-decoration: underline;
        }
      }
    }
  }
</style>