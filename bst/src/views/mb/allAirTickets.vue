<template>
  <div class="all-list">
      <div class="all-content">
          <div class="banner1" v-for="item in list" @click="toDetail(item)">
            <img :src="`${$config.rootPath}airImage/${item.images[0]}.jpg`" v-if="item.images">
            <img :src="`${$config.rootPath}airImage/1.jpg`" v-else>
            <div class="price">{{item.from}} - {{item.to}}  &yen;{{item.offerPrice}}</div>
          </div>
      </div>
  </div>
</template>
<script>
import { airs } from '@/views/datas/airData';
export default {
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.list = airs;
  },
  methods: {
    toDetail(item) {},
  }
};
</script>
<style rel="stylesheet/less" lang="less">
    .all-list {
      height: calc(100% - 115px);
      margin-top: 75px;
      overflow-y: auto;
      .all-content {
      display: flex;
      flex-wrap: wrap;
      div {
      position: relative;
      width: ~'calc((100% - 30px) / 3)';
      height: 120px;
      margin: 5px;
      img {
          width: 120px;
          height: 120px;
      }
      .price {
          height: 30px;
          position: absolute;
          background: #333;
          opacity: 0.9;
          color: #fff;
          font-size: 16px;
          text-align: center;
          line-height: 30px;
          bottom: 0px;
          left: -5px;
          width: ~'calc(100% - 3px)';
          font-size: 12px;
      }
      }
    }
    }
</style>
