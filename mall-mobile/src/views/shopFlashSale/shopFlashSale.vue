<template>
  <div class="flashPage">
    <div class="headNav">
      <ul>
        <li v-for="(item, index) in startTimes" :key="index">
          <div class="logic_time">
            <p>{{item.flash_time}}</p>
            <p>{{item.flash_tip}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="bannerPage">
      <div class="bannerCenter" :style="{backgroundImage: 'url(' + bannerAdvImg + ')', backgroundSize:'100% 100%'}">
        <div class="bannerSwiper" style="width: 7.5rem;height: 3rem;">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(ite, ind) in bannerImgList" :key="ind">
              <a>
               <img v-bind:src="ite | filterImgUrl">
              </a>
            </swiper-slide>
          </swiper>
          <!--以下看需要添加-->
          <div class="prevCover"><p class="swiper-button-prev swiper-button-white" slot="button-prev"></p></div>
          <div class="nextCover"><p class="swiper-button-next swiper-button-white" slot="button-next"></p></div>
        </div>
      </div>
      <div class="bannerTip">限时购商品</div>
    </div>
    <!--限时商品-->
    <flash-Goods></flash-Goods>
  </div>
</template>
<script>
  import { Swiper, SwiperItem, XDialog, LoadMore } from 'vux' // 轮播图
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import swipcss from 'swiper/dist/css/swiper.css'
  import flashGoods from '../../components/flashGoods'
  export default {
    name: 'shopFlashSale',
    components: {
      Swiper,
      SwiperItem,
      XDialog,
      LoadMore,
      swiper,
      swiperSlide,
      swipcss,
      flashGoods
    },
    data () {
      return {
        startTimes: [
          {
            flash_time: '13:00',
            flash_tip: '已开抢'
          },
          {
            flash_time: '15:00',
            flash_tip: '已开抢'
          },
          {
            flash_time: '18:00',
            flash_tip: '抢购中'
          },
          {
            flash_time: '20:00',
            flash_tip: '即将开抢'
          },
          {
            flash_time: '23:00',
            flash_tip: '即将开抢'
          }
        ],
        bannerAdvImg: require('../../assets/images/wallet/core-bean.png'),
        swiperOption: {
          notNextTick: true,
          loop: true,
          initialSlide: 0,
          autoplay: 3000,
          speed: 1000,
          // 左右点击
          prevButton: '.swiper-button-prev',
          nextButton: '.swiper-button-next'
        },
        bannerImgList: [
          'https://boweisou.oss-cn-shenzhen.aliyuncs.com/yy/images/911a7002e11608fb581fffcde05d5257.jpg',
          'https://boweisou.oss-cn-shenzhen.aliyuncs.com/yy/images/2_1536049430.jpg'
        ]
      }
    },
    omputed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    mounted: function () {
    },
    methods: {
    }
  }
</script>
<style scoped lang=less>
.flashPage{
  width: 7.5rem;
  height: 100vh;
  background: #f7cac4;
  /*头部导航*/
  .headNav{
  width: 7.5rem;
  height: 0.98rem;
  background: #f5ddc3;
  ul{
    li{
      float: left;
      text-align: center;
      &:first-child{
        width: 1.4rem;
        height: 0.78rem;
        padding: 0.1rem 0;
        .logic_time{
          width: 100%;
          height: 100%;
          border-right: 1px solid #d5bda2;
          display: flex;
          justify-content: center;
           align-items: center;
          flex-direction: column;
          p:first-child{
            font-size: 0.21rem;
            color: #343434;
          }
          p:nth-of-type(2){
            font-size: 0.21rem;
            color: #8a8888;
          }
        }
      }
      &:nth-of-type(2){
        width: 1.56rem;
        height: 0.78rem;
        padding: 0.1rem 0;
        .logic_time{
          width: 100%;
          height: 100%;
          border-right: 1px solid #d5bda2;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          p:first-child{
            font-size: 0.21rem;
            color: #343434;
          }
          p:nth-of-type(2){
            font-size: 0.21rem;
            color: #8a8888;
          }
        }
      }
      &:nth-of-type(3){
        width: 1.56rem;
        height: 0.78rem;
        padding: 0.1rem 0;
        .logic_time{
          width: 100%;
          height: 100%;
          border-right: 1px solid #d5bda2;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          p:first-child{
            font-size: 0.21rem;
            color: #343434;
          }
          p:nth-of-type(2){
            font-size: 0.21rem;
            color: #8a8888;
          }
        }
      }
      &:nth-of-type(4){
        width: 1.56rem;
        height: 0.78rem;
        padding: 0.1rem 0;
        .logic_time{
          width: 100%;
          height: 100%;
          border-right: 1px solid #d5bda2;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          p:first-child{
            font-size: 0.21rem;
            color: #343434;
          }
          p:nth-of-type(2){
            font-size: 0.21rem;
            color: #8a8888;
          }
        }
      }
      &:nth-of-type(5){
        width: 1.42rem;
        height: 0.78rem;
        padding: 0.1rem 0;
        .logic_time{
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          p:first-child{
            font-size: 0.21rem;
            color: #343434;
          }
          p:nth-of-type(2){
            font-size: 0.21rem;
            color: #8a8888;
          }
        }
      }
    }
  }
}
  /*中间banner轮播图*/
  .bannerPage{
    width: 7.5rem;
    height: 6.26rem;
    background: #fff;
    .bannerCenter{
      width: 7.5rem;
      height: 5.24rem;
      background: #ccc;
      .bannerSwiper{
        width: 7.5rem;
        height: 2.2rem;
        padding-top: 2.8rem;
        position: relative;
        .swiper-container{
          width: 6.2rem;
          height: 2.2rem;
          border-radius: 0.2rem;
          .swiper-slide{
            img{
              width: 100%;
              height: 100%;
              border-radius: 0.2rem;
            }
          }
        }
        .prevCover{
          left: 0;
          right: auto;
          position: absolute;
          top: 63%;
          width: 20px;
          height: 72px;
          margin-top: -22px;
          z-index: 10;
          cursor: pointer;
          background: rgba(0, 0, 0, 0.4);
          border-bottom-right-radius: 0.15rem;
          border-top-right-radius: 0.15rem;
          .swiper-button-prev{
            left: 2px;
            right: auto;
            position: absolute;
            top: 73%;
            width: 27px;
            height: 18px;
            margin-top: -22px;
            z-index: 10;
            cursor: pointer;
            background-size: 27px 44px;
            background-position: center;
            background-repeat: no-repeat;
          }
        }
        .nextCover{
          right: 0;
          left: auto;
          position: absolute;
          top: 63%;
          width: 20px;
          height: 72px;
          margin-top: -22px;
          z-index: 10;
          cursor: pointer;
          background: rgba(0, 0, 0, 0.4);
          border-bottom-left-radius: 0.15rem;
          border-top-left-radius: 0.15rem;
          .swiper-button-next{
            right: 3px;
            position: absolute;
            top: 73%;
            width: 27px;
            height: 18px;
            margin-top: -22px;
            z-index: 10;
            cursor: pointer;
            background-size: 27px 44px;
            background-position: center;
            background-repeat: no-repeat;
          }
        }
      }
    }
    .bannerTip{
      width: 7.5rem;
      height: 1.02rem;
      line-height: 1.02rem;
      font-size: 0.28rem;
      color: #3e3e3e;
      text-align: center;
      font-weight: 600;
    }
  }
}
</style>

