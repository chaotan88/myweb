<template>
	<div class="setmealhome-wrap">
    <div class="banner-wrap">
      <swiper height="5.48rem" dots-position="center" :auto="true" :show-dots="false" class="banner">
        <!-- <swiper-item class="swiper-demo-img">
          <a>
            <img src="../../assets/images/setmeal/banner.jpg">
          </a>
        </swiper-item> -->
        <swiper-item class="swiper-demo-img" v-for="(item, index) in setmealBannerData.setMealImage" :key="index">
          <a :href="setmealBannerData.setMealUrl[index] || '#'">
            <img :src="item | filterImgUrl" v-if="item">
            <img src="../../assets/images/setmeal/banner.jpg" v-else>
          </a>
        </swiper-item>
      </swiper>
    </div>
    <div class="setmealhome-list">
      <ul>
        <template v-if="!noData">
          <li  v-for="(item, index) in setmealList">
            <!--标题样式-->
            <div class="setmeal-title">
              <div class="setmeal-title-triangle" :style="{ 'border-bottom': '.13rem solid' + shapColor[index = index <= 2 ? index : index % 3]}"></div>
              <div class="setmeal-title-shape" :style="{ background: BackgroundColor[index = index <= 2 ? index : index % 3]}">
                <span>{{item.columnName}}</span>
              </div>
              
            </div>
            <!--套餐图-->
            <img :src="item.mainImage | filterImgUrl" class="setmealhome-goodsimg">
            <!--商品-->
            <div class="setmeal-goods">
              <div class="setmeal-goods-list" v-for="ite in item.columnResList">
                <p><img :src="ite.columnLogo | filterImgUrl" class="setmealhome-goodsimg"></p>
                <p><strong>{{ite.columnName}}</strong></p>
              </div>
            </div>
            <!--底部-->
            <div class="setmeal-bot">
              <div><span>{{item.columnName}}</span>套餐专区，任选</div>
              <div @click="goMeal(item)">
                <span>立即选购</span>
                <x-icon type="ios-arrow-right" size="20"></x-icon>
              </div>
            </div>          
          </li>
        </template>
        <!--无数据-->
        <no-data-component v-if="noData"></no-data-component>
      </ul>
    </div>
	</div>
</template>
<script>
  import { Swiper, SwiperItem } from 'vux' // 轮播图
  import noDataComponent from '../../components/noData'    // 暂无数据
  export default {
    components: {
      noDataComponent,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        setmealList: [],                  // 套餐列表
        noData: false,                     // 暂无数据
        setmealBannerData: {},              // 规则banner数据
        BackgroundColor: ['#736ff6', '#f3b77b', '#95ca8f'],   // 标题背景颜色
        shapColor: ['#472b73', '#a5663b', '#6d7448']         // 标题三角颜色
      }
    },
    mounted: function () {
      this.getSetMealSet()
      this.getAllSetMealList()           // 获取套餐数据
    },
    methods: {
      /**
       * 获取套餐规则
      */
      getSetMealSet () {
        this.$http.get(`${this.api.getSetMealSet}`).then((res) => {
          let resData = res.data
          if (res.data.status === this.api.ERR_OK) {
            if (resData.data.setMealImage) {
              resData.data.setMealImage = resData.data.setMealImage.split('#')
            }
            if (resData.data.setMealUrl) {
              resData.data.setMealUrl = resData.data.setMealUrl.split('#')
            }
            this.setmealBannerData = resData.data
          }
        })
      },
      /**
       * 获取套餐数据
      */
      getAllSetMealList () {
        this.$http.get(`${this.api.allSetMealList}`, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          let resData = res.data
          if (res.data.status !== this.api.ERR_OK) {
            this.noData = true
            return false
          }
          resData.data = resData.data.filter((row) => row.columnResList && row.columnResList.length > 0)
          this.noData = resData.data.length > 0 ? !!false : !!true
          this.setmealList = resData.data
        })
      },
      /**
       * 跳到商品列表页
      */
      goGoodsList (v) {
        localStorage.setItem('CoumnBanner', v.mainImage) // 存储栏目主图
        localStorage.setItem('navCoumnName', v.columnName) // 存储栏目名称 方便列表页更新页面title
        this.$router.push({path: '/goodList', query: { searchType: 2, columnId: v.id }})
      },
      /**
       * 跳转到套餐页面
      */
      goMeal (v) {
        if (v.setmealType === 1) {   // 固定套餐
          localStorage.setItem('mealTypes', 1)
        } else { // 自选套餐
          localStorage.setItem('mealTypes', 2)
        }
        localStorage.setItem('mealId', v.id)     // 存储栏目id
        this.$router.push({path: '/mealAggregate'})
      }
    }
  }
</script>
<style scoped lang="less">
  .setmealhome-wrap{
    min-height: calc(100vh);
    background: #f67665;
    .noDataTip{
      color: #fff;
    }
    .banner-wrap{
      width: 100%;
      height: 5.48rem;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .setmealhome-list{
      min-height: calc(~"100vh - 5.48rem");
      background: -webkit-linear-gradient( top,#f57464 35%,#df4439);
      ul{
        padding-top: .43rem;
        min-height: calc(~"100vh - 5.48rem");
        background-image: url('../../assets/images/setmeal/gradual-bg.png');
        background-size: 100% 2.55rem;
        background-repeat: no-repeat;
        overflow-y: scroll;
        li{
          background: #ffeed7;
          width: 6.9rem;
          height: 100%;
          border-radius: 6px;
          margin: 0 auto;
          margin-bottom: .4rem;
          .setmeal-title{
            position: relative;
            height: .6rem;
            line-height: .6rem;
            color: #fff;
            display: flex;
            margin-left: .5rem;
            &::after{
              content: '';
              display: block;
              flex:1;
              height: 1px;
              border-bottom: 1px dashed #e0d4c6;
              margin-right: .3rem;
              margin-top: .3rem;              
            }
            .setmeal-title-triangle{
                width: 0;
                height: 0;
                border-left: .065rem solid transparent;
                border-right: .065rem solid transparent;
                border-bottom: .13rem solid #1a1672;
                margin-top: -0.13rem;
                margin-right: .005rem;
            }
            .setmeal-title-shape{
              padding: 0 .48rem;
              height: .6rem;
              background: #736df9;
              -webkit-transform: skew(17deg);
              -moz-transform: skew(17deg);
              -o-transform: skew(17deg);
              border-radius: 2px;
              display: inline-block;
              overflow: hidden;
              max-width: 4rem;
              margin-top: -.13rem;
              span{
                display: block;
                -webkit-transform: skew(-17deg);
                -moz-transform: skew(-17deg);
                -o-transform: skew(-17deg);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .setmealhome-goodsimg{
            width: 6.28rem;
            height: 1.98rem;
            border-radius: 5px;
            display: block;
            margin: 0 auto;
            margin-top: .1rem;
          }
          /**商品**/
          .setmeal-goods{
            min-height: 2rem;
            overflow: hidden;
            overflow-x: scroll;
            white-space: nowrap;
            margin-top: .68rem;
            margin-bottom: .48rem;
            &::-webkit-scrollbar {
              height: 0px;
            }
            .setmeal-goods-list{
              display: inline-block;
              text-align: center;
              width: 33.33333%;
              font-size: .24rem;
              &:last-child{
                margin-right: 0;
              }
              p:nth-child(1){
                img{
                  width: 1.52rem;
                  height: 1.52rem;
                  border-radius: 50%;
                }
              }
              p:nth-child(2){
                margin-top: .2rem;
                color: #bc382e;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          /**底部**/
          .setmeal-bot{
            display: flex;
            height: .81rem;
            align-items: center;
            background: #fff;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            padding: 0 .3rem;
            div:nth-child(1){
              font-size: .28rem;
              flex:1;
              span{
                color: #f33531;
              }
            }
            div:nth-child(2){
              display: flex;
              align-items: center;
              justify-content: center;
              width: 1.84rem;
              height: .6rem;
              border-radius: 4px;
              text-align: center;
              line-height: .6rem;   
              background: -webkit-linear-gradient( top,#f43331,#fa6c35); 
              font-size: .24rem;
              color: #fff;         
              .vux-x-icon{
                fill: #fff;
                width: .35rem;
                height: .35rem;
              } 
            }
          }
        }
      }
    }
  }
</style>