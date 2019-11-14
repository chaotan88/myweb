<template>
  <div class="brand">
    <!--banner-->
     <swiper height="4rem" dots-position="center" :auto="true" class="banner">
      <swiper-item class="swiper-demo-img">
        <a>
          <img src='../../assets/images/test/shop.jpeg'>
        </a>
      </swiper-item>
    </swiper>
    <!--品牌商家-->
    <div class="brand-shop">
      <ul>
         <li v-for="(item, index) in shopList" @click="$router.push({path: '/brandShop', query: { shopId: item.id}})">
          <img :src='item.logo | filterImgUrl'>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { Swiper, SwiperItem } from 'vux' // 轮播图
  export default {
    components: {
      Swiper,
      SwiperItem
    },
    data () {
      return {
        shopList: [] // 商家列
      }
    },
    mounted: function () {
      this.getShopList() // 获取推荐商家列表
    },
    methods: {
      /**
       * 获取推荐商家列表
      */
      getShopList () {
        this.$http.post(`${this.api.getShopList}`).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.shopList = res.data.data
        })
      }
    }
  }
</script>
<style scoped lang=less>
  .brand{
    .banner{
      border-bottom: .3rem solid #f1f1f1;
      .swiper-demo-img{
        background: #eee;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    /**品牌店铺**/
    .brand-shop{
      height: auto;
      overflow: hidden;
      background: #e6e6e6;
      padding-top: .5rem;
      ul {
        li{
          width: 50%;
          height: 1.8rem;
          background: #fff;
          border-right: .1rem solid #e5e5e5;
          border-bottom: .1rem solid #e5e5e5;
          float: left;
          box-sizing: border-box;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          &:nth-child(2n){
            border-right: 0;
          }
          img {
            width: 50%;
          }
        }
      }
    }
  }
</style>