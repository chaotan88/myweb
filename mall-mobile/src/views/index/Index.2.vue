<template>
  <div class="indexContainer">
    <!--serch-->
    <div>
      <div class='serch'>
        <div class="serch-bg" :style="{opacity: headerOptiy}"></div>
        <img src='../../assets/images/logo.png'>
        <div class='serch-inp' @click="goSearchPage">
          <x-icon type="ios-search" size="0.4rem"></x-icon>
          <span>全场八折放肆购</span>
        </div>
      </div>
    </div>
    <!--banner-->
     <swiper height="4.75rem" dots-position="center" :auto="true" class="banner">
      <swiper-item class="swiper-demo-img" v-for="(item, index) in bannertList" :key="index">
        <a :href="item.link">
          <img v-bind:src="item.image | filterImgUrl">
        </a>
      </swiper-item>
    </swiper>
    <!--nav-->
    <div class="nav">
      <swiper height="2.3rem" dots-position="center" :auto="false">
        <swiper-item class="swiper-demo-img" v-for="(ite, ind) in navList" :key="ind">
          <template v-for="(item, index) in ite">
            <!--跳转商品列表-->
            <div @click="goGoodsList(item)" v-if="item.columnType == 1" class="nav-option">
              <img :src="imgUrl+item.columnLogo">
              <span>{{item.columnName}}</span>
            </div>
            <!--商家指定跳转-->
            <div v-else class="nav-option">
              <a :href="item.relateUrl">
                <img :src="imgUrl+item.columnLogo">
                <span>{{item.columnName}}</span>
              </a>
            </div>
          </template>
        </swiper-item>
      </swiper>
      <!--无栏目数据时显示-->
      <!-- <template v-if="noColumn || AllColumnList.length <= 0">
        <div class="nav-empty" v-for="item in 4">
          <p></p>
          <span></span>
        </div>
      </template>
      <template v-for="(item) in AllColumnList" v-if="!noColumn"> -->
        <!--跳转商品列表-->
        <!-- <div @click="goGoodsList(item)" v-if="item.columnType == 1">
          <img :src="imgUrl+item.columnLogo">
          <span>{{item.columnName}}</span>
        </div> -->
        <!--商家指定跳转-->
        <!-- <div v-else>
          <a :href="item.relateUrl">
            <img :src="imgUrl+item.columnLogo">
            <span>{{item.columnName}}</span>
          </a>
        </div> -->
      <!-- </template> -->
    </div>
    <!--品牌商家-->
    <!-- <div class="brand-shop" v-if="shopList.length > 0">
      <div class='list-title'>
        <div>
          <span>品牌推荐</span>
        </div>
        <div @click="$router.push({path: '/brandList'})">
          <span>更多</span>
          <span class='list-title-icon'></span>
          <span class='list-title-icon'></span>
        </div>  
      </div>
      <ul>
        <li v-for="(item, index) in shopList" @click="$router.push({path: '/brandShop', query: { shopId: item.id}})" v-if="index <= 3">
          <img :src='item.logo | filterImgUrl'>
        </li>
      </ul>
    </div> -->
    <!--广告-->
    <!-- <div class='adv'  @click="$router.push({path: '/makerPlan'})">
      <img src='../../assets/images/adv.png'>
    </div> -->
    <!-- <div class='adv'>
      <a href="http://www.passpaygg.com/setmeal/">
        <img src='../../assets/images/adv.png'>
      </a>
    </div> -->
    <!--栅格-->
    <div class="grid">
      <div class="grid-title" v-if="advertList.length > 0">品牌区</div>
      <div class="grid-listbox" v-if="advertList.length > 0">
        <template v-for="item in advertList">
          <div>
            <a :href="item.link">
              <img v-bind:src="item.image | filterImgUrl">
            </a>
          </div>
        </template>
      </div>
    </div>
    <!--商品列表-->
    <div class='list-box' v-for="item in AllColumnList" v-if="item.goodsList.length > 0">
      <div class='list-title'>
        <div class="list-title-banner">
          <div>{{item.columnName}}</div>
          <img src='../../assets/images/test/column-ban.jpg'>
        </div>
        <div class="list-title-more" @click="goGoodsList(item)">
          <span>更多</span>
          <x-icon type="ios-arrow-right" size=".3rem"></x-icon>
        </div>
      </div>
      <div class='list'>
        <div class='list-lis' v-for="ite in item.goodsList" @click="$router.push({path: '/goodDetail', query: { goodsId: ite.id }})">
          <div class="list-img">
            <img :src='ite.mainImage | filterImgUrl'>
          </div>
          <div class='list-tit'>{{ite.goodsName}}</div>
          <div class='list-bot'>
            <div class='list-bot-lef'>
              <div>¥ {{ite.goodsSpecialPrice ? ite.goodsSpecialPrice : ite.goodsPrice }}</div>
              <div>¥ {{ite.goodsPrice}}</div>
            </div>
            <div class="list-bot-rig"><img src='../../assets/images/join-cart.png'></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import codeComponent from '../../components/codeComponent'
  import ComSearch from '../../components/ComSearch' // 搜索
  import { Swiper, SwiperItem } from 'vux' // 轮播图
  export default {
    components: {
      ComSearch,
      Swiper,
      SwiperItem,
      codeComponent
    },
    data () {
      return {
        headerOptiy: 0, // header背景颜色透明度
        values: '',
        code: '',
        navList: [], // nav集合
        bannertList: [],                     // banner集合
        advertList: [],                      // 广告集合
        noColumn: false,                     // 无栏目
        AllColumnList: [],                   // 栏目及栏目列表
        shopList: []                         // 商家列表
      }
    },
    mounted: function () {
      // 是否是扫码进来的--存储邀请码
      if (this.$route.query.invitationCode) {
        localStorage.setItem('invitationCode', this.$route.query.invitationCode)
      }
      this.getAllColumnList()                // 获取栏目
      this.getAdvert()                       // 获取广告
      // this.getShopList()                  // 获取推荐商家列表
      // 页面滚动顶部header变化
      window.onscroll = () => {
        var s = document.body.scrollTop || document.documentElement.scrollTop
        this.headerOptiy = s / 80 > 0.5 ? 0.5 : s / 80
      }
    },
    methods: {
      /**
       * 跳转到搜索页
      */
      goSearchPage () {
        // 存储路由 解决返回多层级问题
        localStorage.setItem('goSerchPath', this.$route.fullPath)
        this.$router.push('/serch')
      },
      /**
       * 获取推荐商家列表
      */
      getShopList () {
        this.$http.post(`${this.api.getShopList}`).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.shopList = res.data.data
        })
      },
      /**
       * 获取广告
      */
      getAdvert () {
        this.$http.post(`${this.api.advertList}`, {
          start: 1,
          pageSize: 10,
          applicationTerminal: 1
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          if (res.data.data.list.length > 0) {
            res.data.data.list.forEach((item) => {
              if (item.putLocation === 1) {
                this.bannertList = item.advertPositionDetailList
              } if (item.putLocation === 2) {
                this.advertList = item.advertPositionDetailList
              }
            })
          }
        })
      },
      /**
       * 获取栏目及栏目列表
      */
      getAllColumnList () {
        this.$http.get(this.api.getAllColumnList, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          let resData = res.data
          var result = []
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            this.noColumn = 1
            return false
          }
          this.noColumn = resData.data.length > 0 ? 0 : 1
          // 数据分组
          for (var i = 0, len = resData.data.length; i < len; i += 5) {
            result.push(resData.data.slice(i, i + 5))
          }
          this.navList = result
          this.AllColumnList = resData.data
          this.$nextTick(() => {
            window.scrollTo(0, 1)
            window.scrollTo(0, 0)
          })
        })
      },
      /**
       * 跳到商品列表页
      */
      goGoodsList (v) {
        localStorage.setItem('navCoumnName', v.columnName) // 存储栏目名称 方便列表页更新页面title
        this.$router.push({path: '/goodList', query: { searchType: 2, columnId: v.columnId }})
      }
    }
  }
</script>

<style  lang=less>
.indexContainer{
  .banner{
    background: #eee;
    .swiper-demo-img  {
      background: #eee;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .vux-indicator {
      bottom: .6rem;
      .vux-icon-dot{
        width: 8px;
        height: 8px;
        background: #460098;
        border-radius: 4px;
        &.active{
          width: .18rem;
          height: .09rem;
          background: #9e73cf;
        }
      }
    }
  }
  /**搜索**/
  .serch{
    width: 100%;
    max-width: 7.5rem;
    height: .84rem;
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 500;
    padding-left: .19rem;
    padding-right: .41rem;
    display: flex;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    margin: auto;
    img {
      width: 1.4rem;
      height: .41rem;
      margin-right: .25rem;
      /* height: .52rem; */
    }
    .serch-inp{
      flex: 1;
      /* width: 4.64rem; */
      height:.57rem;
      background:#fff;
      font-size: .24rem;
      color: #c4c4c4;
      display: flex;
      align-items: center;
      border-radius: 30px;
    }
    .serch-inp svg{
      margin-left: .16rem;
      margin-right: .15rem;
      fill: #c7c7c7;
    }
    .serch-bg{
      background: #000;
      height: .84rem;
      width: 7.5rem;
      position: absolute;
      left: 0;
      z-index: -1;
      opacity: 0;
    }
  }
  /**nav**/
  .nav{
    width: 7.5rem;
    height: 2.23rem;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: #fff;
    margin-top: -.38rem;
    position: relative;
    .vux-indicator {
      bottom: .2rem;
      .vux-icon-dot{
        width: 20px;
        height: 4px;
        background: #cccccc;
        border-radius: 4px;
        &.active{
          width: 5px;
          height: 5px;
          border-radius: 5px;
          border: 2px solid #666666;
          background: #fff;
        }
      }
    }
    &::-webkit-scrollbar {
      height: 0px;
    }
    .nav-empty{
      p:nth-child(1){
        width:.9rem;
        height: .9rem;
        background: #eee;
        display: inline-block;
      }
      span{
        width:40%;
        height: .2rem;
        background: #eee;
        margin: 0 auto;
        margin-top: 10px;
      }
    }
    .nav-option{
      width: 20%;
      display: inline-block;
      color: #656565;
      font-size:.26rem;
      text-align:center;
      overflow: hidden;
      padding: 0 .1rem;
      box-sizing: border-box;
      margin-top: .38rem;
      img{
        width:.8rem;
        height: .8rem;
        display: block;
        margin: 0 auto;
      }
      span{
        width: 100%;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top:5px;
      }
    }
    div:nth-child(4n){
      margin-right: 0
    }
  }
  /**品牌店铺**/
  .brand-shop{
    height: auto;
    overflow: hidden;
    background: #e5e5e5;
    padding-bottom: .3rem;
    .list-title{
      display: flex;
      height: .9rem;
      align-items: center;
      padding:0 .55rem 0 .3rem;
      border-top: .3rem solid #f1f1f1;
      div:first-child{
        flex: 1;
        font-size: .28rem;
        color: #656565;
        display: flex;
        align-items: center;
        span{
          display: block;
          }
        }
      }
      div:nth-child(2){
        font-size: .26rem;
        color: #909090;
      }
      .list-title-icon{
        width: .14rem;
        height:.14rem;
        border-top: 1px solid #cdcdcd;
        border-right: 1px solid #cdcdcd;
        transform: rotate(45deg);
        display: inline-block;
        &:last-child{
          margin-left: -7px;
        }
      }
    }
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
  /**adv**/
  .adv{
    width: 100%;
    height: 4rem;
    border-top: .32rem solid #f1f1f1;
    border-bottom: .32rem solid #f1f1f1;
    background: #eee;
    img{
      width: 100%;
      height: 100%;
    }
  }
  /**栅格**/
  .grid{
    width: 100%;
    height: 100%;
    padding-bottom: .32rem;
    /* padding: .32rem 0; */
    border-top: .32rem solid #fff;
    position: relative;
    &:empty{
      padding: 0;
      border:none;
    }
    .grid-title{
      color: #fff;
      font-size: .28rem;
      width: 1.91rem;
      height: .5rem;
      background: -webkit-linear-gradient(left, #ea3b5f , #eb5d6b); /* Safari 5.1 - 6.0 */
      background: linear-gradient(to right,#ea3b5f , #eb5d6b);
      border-top-right-radius: .4rem;
      border-bottom-right-radius: .4rem;
      text-align: center;
      line-height: .5rem;
      position: absolute;
      left: 0;
      top: -.26rem;
    }
    
    .grid-listbox{
      height: auto;
      overflow: hidden;
      div{
        float: left;
        background: #eee;
        img{
          width: 100%;
          height: 100%;
        }
      }
      div:nth-child(1){
        width: 3.7rem;
        height: 4.68rem;
        margin-right: .1rem;
      }
      div:nth-child(2){
        width: 3.7rem;
        height: 1.8rem;
        margin-bottom: .09rem;
      }
      div:nth-child(3){
        width: 3.7rem;
        height: 2.79rem;
      }
    }
  }
  /**列表**/
  .list-box{
    height: 100%;
    /* overflow: hidden; */
    /* border-bottom: .32rem solid #eee; */
    &:last-child{
      border-bottom: none;
    }
    .Discount{
      width: .86rem;
      height: .86rem;
      background: #f4918d;
      border-radius: 50%;
      position: absolute;
      top: .19rem;
      left: .3rem;
      color: #fff;
      font-size: .22rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      div{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
    .list{
      height: 100%;
      overflow: hidden;
      padding-bottom: .4rem;
      .list-lis{
        width: 3.69rem;
        height: 5.38rem;
        overflow: hidden;
        margin-right: .12rem;
        float: left;
        margin-bottom: .1rem;
        border: 1px solid #edeef1;
        box-sizing: border-box;
        position: relative;
        &:nth-child(2n-1) {
          border-left: none;
        }
        &:nth-child(2n){
          margin-right: 0;
          border-right: none;
        }
        .list-img{
          width: 3.69rem;
          height: 3.69rem;
          display: block;
          background: #eee;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .list-tit{
          display: -webkit-box;  
          display: -moz-box;  
          overflow: hidden;  
          text-overflow: ellipsis;  
          word-break: break-all;  
          -webkit-box-orient: vertical;  
          -webkit-line-clamp:2;  
          font-size: .24rem;
          color: #909090;
          margin: .12rem .23rem;
        }
        .list-bot{
          display: flex;
          align-items: center;
          position: absolute;
          bottom: .1rem;
          width: auto;
          left: .23rem;
          right: .23rem;
        }
        .list-bot-lef{
          overflow: hidden;
          margin-right: .05rem;
          flex: 1;
          div{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:nth-child(1){
              font-size: .28rem;
              color: #f74d4d;
            }
            &:nth-child(2){
              font-size: .24rem;
              color: #b8b8b8;
              text-decoration: line-through;
            }
          }
        }
        .list-bot-rig{
          width: .93rem;
          height: .46rem;
          border:1px solid #d4d4d4;
          border-radius:3px;
          margin-right: .1rem;
          text-align: center;
          line-height: .46rem;
          display: flex;
          align-items: center;
          justify-content: center;
          img{
            width: .34rem;
            height: .34rem;
            display: inline-block;
          }
        }
      }
    }
  }
  .list-title{
    height: auto;
    .list-title-banner{
      width: 100%;
      height: 3.92rem;
      position: relative;
      div{
        color: #fff;
        font-size: .28rem;
        min-width: 1.91rem;
        max-width:4rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 4rem;
        height: .5rem;
        background: #8f65e8;
        border-top-right-radius: .4rem;
        border-bottom-right-radius: .4rem;
        text-align: center;
        line-height: .5rem;
        position: absolute;
        left: 0;
        top: -.26rem;
      }
      img{
        width: 100%;
        height: 3.92rem;
      }
    }
    .list-title-more{
      padding: .1rem .24rem;
      background: #fff;
      display: flex;
      justify-content: flex-end;
      color: #8f65e8;
      font-size: .22rem;
      align-items: center;
      border-top: .04rem solid #f5f5f5;
      border-bottom: .06rem solid #f5f5f5;
      .vux-x-icon{
        fill: #fff;
        background: #8f65e8;
        border-radius: 50%;
        margin-left: .1rem;
      }
    }
  }
}
</style>