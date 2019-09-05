<template>
  <div class="news">
    <div class="news-banner">
      <img :src="`${$config.rootPath}news1.png`"/>
    </div>
    <div class="breadcrumb">
      <div v-for="(me, index) in menus" :key="index">{{me}}<span v-if="index !== menus.length - 1">>></span></div>
    </div>
    <div class="news-center">
      <div class="news-left">
        <div class="menus">
          <div class="title">新闻动态</div>
          <div class="menu-contene">
            <div v-for="(me, index) in menus" :key="index" @click="changeTag(index)"
              :class="active == index ? 'menu-active' : ''">{{me}}</div>
          </div>
        </div>
        <div class="hots">
          <div class="title">热门推荐</div>
          <div class="host-news">
            <div v-for="(ne, index) in news" @click="toDetail(index)" :key="index">{{ne.title}}</div>
          </div>
        </div>
      </div>
      <div class="news-right">
        <div class="title">{{menus[active]}}</div>
        <div class="news">
          <div v-for="(item, index) in news" :key="index">{{item.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {hostNews} from '@/views/datas/data';
export default {
  data() {
    return {
      id: '',
      breadcrumb: [
        {name: '首页'},
        {name: '新闻动态'}
      ],
      menus: ['公司新闻', '行业新闻', '常见问题'],
      active: '0',
      news: [],
    }
  },
  methods: {
    setBread() {
      if (this.breadcrumb.length === 3) {
        this.breadcrumb = this.breadcrumb.splice(0, this.breadcrumb.length -1);
      } 
      this.breadcrumb.push(this.menus[this.id]);
    },
    changeTag(index) {
      this.active = index;
    },
    toDetail(index) {

    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.setBread();
    this.news = hostNews;
    console.log(this.news);
  }
}
</script>

<style lang="less" scoped>
 .news {
   .news-banner {
      text-align: center;
   }
   .breadcrumb {
      display: flex;
      width: 1200px;
      margin: auto;
      margin-top: 40px;
      div {
        font-size: 14px;
        color: #666666;
        cursor: pointer;
        span {
          color: #0001CC;
          margin: 0 5px;
          cursor: default;
        }
      }
   }
   .news-center {
     width: 1200px;
     margin: auto;
      display: flex;
     .news-left {
       width: 270px;
       .menus, .hots {
         .title {
            height: 60px;
            background-color: #3399ff;
            margin-top: 10px;
            color: #fff;
            text-align: center;
            line-height: 60px;
            font-size: 24px;
         }
         .menu-contene {
            margin-top: 20px;
           div {
              height: 50px;
              font-size: 18px;
              background: #fff;
              line-height: 50px;
               color: #666;
              width: 200px;
              margin: auto;
              text-align: center;
              border: 1px solid #eee;
              cursor: pointer;
           }
           .menu-active {
            background: #3399ff;
            color: #fff;
           }
         }
         .host-news {
            color: #666666;
            font-size: 14px;
            div {
              cursor: pointer;
              margin: 10px 0;
              text-align: center;
            }
         }
       }
     }
     .news-right {
        margin-left: 20px;
        width: ~"calc(100% - 300px)";
        .title {
          color: #666666;
          font-size: 18px;
          text-align: center;
        }
        .news {
          margin-top: 20px;
          div {
            font-size: 14px;
            margin: 10px 0;
            color: #999999;
            cursor: pointer;
            padding-bottom: 10px;
            border-bottom: 1px dashed #eee;
          }
          div:hover {
            color: #3399ff;
            text-decoration: dashed;
          }
        }
     }
   }
 }
</style>