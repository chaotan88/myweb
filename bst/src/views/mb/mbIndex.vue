<template>
  <div class="mobile-index">
    <div class="index-content">
      <div>
        <!-- <div class="banner">
          <swiper
            loop
            auto
            dots-class="swiper-dots"
            dots-position="center"
            height="50vw"
            :interval="5000"
          >
            <swiper-item class="banner1">
              <img :src="`${$config.rootPath}baner1.png`">
            </swiper-item>
            <swiper-item class="banner1">
              <img :src="`${$config.rootPath}baner2.png`">
            </swiper-item>
          </swiper>
        </div> -->
         <video
        id="myVideo1"
        class="video-js"
        >
        <source
            src="http://112.74.203.16/static/bst.mp4"
            type="video/mp4"
        >
        </video>
        <div class="products container">
          <!-- <div class="search-input">
            <input v-model="value" placeholder="更多机票信息请点击咨询"/>
            <span>搜索</span>
          </div> -->
          <div class="content2">
            <div class="wrap" @click="toOtherRoute('/allAirTickets')">
              <img src="../../assets/images/icon1.png">
              <h4>国际机票</h4>
            </div>
            <div class="wrap" @click="toOtherRoute('/allAirTickets')">
              <img src="../../assets/images/icon3.png">
              <h4>机票信息</h4>
            </div>
            <div class="wrap" @click="toOtherRoute('/mbNews')">
              <img src="../../assets/images/icon4.png">
              <h4>新闻咨询</h4>
            </div>
            <div class="wrap" @click="toOtherRoute('/mbAboutMe')">
              <img src="../../assets/images/icon5.png">
              <h4>关于我们</h4>
            </div>
            <div class="wrap" @click="toOtherRoute('/mbConcatMe')">
              <img src="../../assets/images/icon6.png">
              <h4>联系我们</h4>
            </div>
            <div class="wrap">
              <img src="../../assets/images/icon2.png">
              <h4>更多优惠请咨询客服</h4>
            </div>
            <div class="wrap">
              <img src="../../assets/images/icon7.png">
              <h4>PC可查看完整版..</h4>
            </div>
          </div>
        </div>
        <div class="title"><span>热门购票</span><span @click="toOtherRoute('/allAirTickets')">更多</span></div>
        <div class="hot-product">
          <mbList :lists="hotList" @itemClick="itemClick"></mbList>
          <!-- <div class="banner1" v-for="item in hotList" @click="toDetail(item)">
            <img :src="`${$config.rootPath}airImage/${item.images[1]}.jpg`" v-if="item.images">
            <img :src="`${$config.rootPath}airImage/1.jpg`" v-else>
            <div class="price">{{item.to}} - &yen;{{item.offerPrice}}</div>
          </div> -->
      </div>
      <div class="title"><span>新闻咨询</span><span @click="toOtherRoute('/mbNews')">更多</span></div>
      <div class="new-list">
        <div v-for="(item, index) in newsList" :key="index" @click="toNewsDetail(item)">
          <p>{{item.title}}</p>
          <p>{{item.date}}</p>
        </div>
      </div>
      <!-- <div class="today-price">
        <div v-for="item in hotList">
          <img :src="`${$config.rootPath}airImage/${item.images[1]}.jpg`" v-if="item.images">
          <img :src="`${$config.rootPath}airImage/1.jpg`" v-else>
          <div>{{item.from}} - {{item.to}}</div>
          <div class="item-remark">{{item.remark}}</div>
        </div>
      </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { Swiper, SwiperItem } from "vux";
import { airs } from '@/views/datas/airData';
import mbList from '@/views/mb/mbList.vue';
import { hostNews } from "@/views/datas/data.js";
function getResult (val) {
  let rs = []
  for (let i = 0; i < 20; i++) {
    rs.push({
      title: `${val} result: ${i + 1} `,
      other: i
    })
  }
  return rs
}
export default {
  components: {
    Swiper,
    SwiperItem,
    mbList
  },
  data() {
    return {
      newsList: [],
      value: '',
      hotList: [],
      showWechart: false
    };
  },
  mounted() {
    this.getNewsList();
    // this.hotList = airs.slice(0, 6);
    this.hotList = airs;
    this.initVideo();
  },
  methods: {
    toNews() {
      this.$router.push("/news");
    },
    /**
     *  新闻列表
     */
    getNewsList() {
      this.newsList = hostNews;
    },
    toNewsDetail(item) {
      sessionStorage.setItem('mb-news-detail', JSON.stringify(item));
      this.toOtherRoute('/mbNewsDetail');
    },
    itemClick(item) {
      sessionStorage.setItem('mbAirInfo', JSON.stringify(item));
      this.$router.push({
        path: '/mbAirDetail'
      });
    },
    callTel() {
      window.location.href = `tel:${this.$config.phone}`;
    },
    toQQ() {
      let qq = this.$config.qq1;
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if(isiOS){
        if(u.toLowerCase().match(/MicroMessenger/i) == "micromessenger"){
            window.open(`http://wpa.qq.com/msgrd?v=3&uin=${qq}&site=qq&menu=yes`);
        }else{
            window.open(`mqqwpa://im/chat?chat_type=wpa&uin=${qq}&version=1&src_type=web&web_src=oicqzone.com`)
        }
      }else{
        if(u.toLowerCase().match(/MicroMessenger/i) == "micromessenger"){
            window.open(`http://wpa.qq.com/msgrd?v=3&uin=${qq}&site=qq&menu=yes`);
        }else{
            window.open(`mqqwpa://im/chat?chat_type=wpa&uin=${qq}&version=1&src_type=web&web_src=oicqzone.com`);
        }    
      } 
    },
    toHome() {
      this.$router.push({
        path: '/moblie'
      });
    },
    handleClose() {
      this.showWechart = false;
    },
    toOtherRoute(name) {
      this.$router.push({
        path: name
      })
    },
    initVideo() {
        //初始化视频方法
        let myPlayer = this.$video(myVideo1, {
            //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
            controls: true,
            //自动播放属性,muted:静音播放
            autoplay: "muted",
            //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            preload: "auto",
            //设置视频播放器的显示宽度（以像素为单位）
            // width: "800px",
            //设置视频播放器的显示高度（以像素为单位）
            height: "400px",
            loop: true
        });
        }
  }
};
</script>
<style rel="stylesheet/less" lang="less">
.mobile-index {
  background-color: #ffffff;
  height: 100%;
  overflow: hidden;
  .video-js {
    width: 100%;
  }
  .index-content {
    height: ~'calc(100% - 115px)';
    overflow: auto;
    margin-top: 75px;
  }
  .container {
    padding: 0.65rem 0.25rem;
    .search-input {
      input {
        height: 28px;
        border: 1px solid #ff6600;
        width: 70%;
      }
      span {
        background-color: #ff6600;
        border-radius: 3px;
        text-align: center;
        line-height: 30px;
        // background: linear-gradient(to bottom, #D63C02 0%, #BF3502 100%);
        color: #fff;
        font-size: 16px;
        padding: 0px 15px !important;
        display: inline-block;
      }
    }
  }
  .title {
    padding: 0 10px;
    margin: 20px 0;
    span:nth-child(1) {
      color: #555555;
      font-size: 18px;
      border-left: 4px solid #FD4500;
      padding-left: 10px;
    }
    span:nth-child(2) {
      float: right;
      color: #a9a9a9;
      font-size: 14px;
    }
  }
  .hot-product {
    // display: flex;
    // flex-wrap: wrap;
    div {
      position: relative;
      // width: ~'calc((100% - 30px) / 3)';
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
        width: ~'calc(100% - 30px)';
      }
    }
  }
  .new-list {
    font-size: 14px;
    color: #666;
    padding: 0 10px;
    div {
      display: flex;
      justify-content: space-around;
      padding: 10px 0;
      text-decoration: underline;
      p:nth-child(1) {
        flex: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p:nth-child(2) {
        flex: 1;
      }
    }
  }
  .today-price {
    display: flex;
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    font-weight: normal;
  }
  h1 {
    font-size: 5.3vw;
    text-align: center;
    margin-bottom: 2.5vw;
    color: #000000;
  }
  .vux-slider > .vux-indicator {
    bottom: 0;
  }
  .vux-icon-dot {
    width: 0.32rem !important;
    height: 0.02rem !important;
    background-color: #ffffff !important;
    border-radius: 0.01rem !important;
  }
  .vux-icon-dot.active {
    background-color: #2dd5f3 !important;
  }
  .banner .banner1 {
    height: 50vw;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h1 {
      color: #2dd5f3;
      margin-bottom: 0;
      letter-spacing: 0.02rem;
      line-height: 0.72rem;
    }
    h2 {
      font-size: 0.2rem;
      color: #ffffff;
      width: 75%;
      text-align: center;
      line-height: 0.3rem;
    }
  }

  .banner img {
    width: 100%;
    height: 100%;
  }

  .products {
    h2 {
      font-size: 0.34rem;
      color: #333333;
    }
    h3 {
      font-size: 0.24rem;
      color: #888888;
    }
    h4 {
      font-size: 0.22rem;
      color: #333333;
    }
    h5 {
      font-size: 0.2rem;
      color: #888888;
      text-align: center;
    }

    .content1 {
      margin-top: 0.43rem;
      .wrap {
        display: flex;
        .image {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2rem;
          height: 2rem;
          border: solid 0.02rem #dddddd;
          // padding: .3rem;
          // box-sizing: border-box;

          img {
            width: 80%;
          }
        }
        .item {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 0.25rem;
          h4:nth-child(2) {
            color: #333333;
            opacity: 0.67;
          }
          h4 {
            display: flex;
            align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          h5 {
            width: 1.12rem;
            height: 0.4rem;
            border-radius: 0.04rem;
            border: solid 0.02rem #dddddd;
            color: #999999;
            // padding: .1rem .16rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .icon {
            margin-right: 0.05rem;
            display: inline-block;
            border-radius: 100%;
            width: 0.07rem;
            height: 0.07rem;
            background-color: #19a65a;
          }
        }
      }
      .wrap:first-child {
        margin-bottom: 0.44rem;
      }
    }
    .content2 {
      margin-top: 0.6rem;
      display: flex;
      flex-wrap: wrap;
      .wrap {
        margin-bottom: 20px;
        text-align: center;
        // flex: 1;
        width: 25%;
        img {
          width: 2.8125rem;
          height: 2.8125rem;
        }
        h4 {
          color: #000000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .solution {
    background-image: url(../../assets/images/index-soultion-bg.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    h1 {
      color: #ffffff;
    }
    h2 {
      font-size: 0.28rem;
      color: #000000;
    }
    h3 {
      font-size: 0.22rem;
      color: #888888;
    }
    h4 {
      font-size: 0.2rem;
      color: #000000;
    }
    h5 {
      font-size: 0.2rem;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0rem;
      color: #ffffff;
      text-align: center;
    }
    h5:nth-child(3) {
      margin-bottom: 0.44rem;
    }

    .content1 {
      .wrap {
        background-color: #ffffff;
        display: flex;
        margin-bottom: 0.22rem;
        .images {
          width: 2.17rem;
          height: 3.2rem;
        }
        .item {
          // width: 4.85rem;
          // height: 2.8rem;
          flex: 1;
          padding: 0.2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .icon {
            width: 0.78rem;
            height: 0.78rem;
          }
          .icon-wrap {
            margin-top: 0.1rem;
            display: flex;
            .icon-item {
              flex: 0 0 33.33%;
              text-align: center;
            }
          }
        }
      }
    }
    .content2 {
      display: flex;
      justify-content: space-between;
      h3 {
        color: #ffffff;
        text-align: center;
        padding: 0.15rem 0.1rem 0.18rem 0.1rem;
      }
      .wrap {
        flex: 0 0 30%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #1db7db;
        overflow: hidden;
        img {
          width: 2.18rem;
          height: 1.49rem;
        }
      }
    }
  }

  .news {
    .content {
      .wrap {
        display: flex;
        height: 1.6rem;
        margin-bottom: 0.32rem;
        img {
          height: 1.2rem;
          width: 1.8rem;
        }
        .item {
          flex: 1;
          padding: 0 0.2rem;
          width: 70%;
          h2 {
            font-size: 0.28rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          h3 {
            font-size: 0.2rem;
            color: #999999;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
        }
      }
    }
  }

  .partner {
    background-color: #27a4c1;
    h1 {
      color: #ffffff;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      img {
        width: 30%;
        margin-bottom: 0.24rem;
      }
    }
  }
}
</style>
