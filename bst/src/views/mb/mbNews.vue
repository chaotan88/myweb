<template>
  <div class="mb-news">
    <div class="news-banner">
      <img :src="`${$config.rootPath}news1.png`" />
    </div>
    <div class="news-center">
      <div class="news">
        <div v-for="(item, index) in news" :key="index">
          <span @click="toDetail(item)">{{item.title}}</span>
          <span>{{item.date}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hostNews } from "@/views/datas/data.js";
export default {
  data() {
    return {
      id: "",
      breadcrumb: [{ name: "首页" }, { name: "新闻动态" }],
      menus: ["公司新闻", "行业新闻", "常见问题"],
      active: "0",
      news: []
    };
  },
  methods: {
    toDetail(item) {
      sessionStorage.setItem("mb-news-detail", JSON.stringify(item));
      this.$router.push({ path: "/newsDetail" });
    }
  },
  mounted() {
    this.news = hostNews;
  }
};
</script>

<style lang="less" scoped>
.mb-news {
  height: ~'calc(100% - 115px)';
  margin-top: 75px;
  overflow-y: auto;
  .news-banner {
    text-align: center;
    img {
      width: 100%;
    }
  }
  .news-center {
    padding: 0 10px;
    .news {
      margin-top: 20px;
      div {
        font-size: 14px;
        margin: 10px 0;
        color: #999999;
        cursor: pointer;
        padding-bottom: 10px;
        border-bottom: 1px dashed #eee;
        display: flex;
        span:nth-child(2) {
          flex: 1;
        }
        span:nth-child(1) {
          flex: 3;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      div:hover {
        color: #3399ff;
        text-decoration: dashed;
      }
    }
  }
}
</style>