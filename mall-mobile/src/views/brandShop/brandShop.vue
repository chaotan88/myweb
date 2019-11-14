<template>
  <div class="indexContainer">
    <!--serch-->
    <div>
      <div class='serch'>
        <img src='../../assets/images/logo.png'>
        <div class='serch-inp' @click="goSearchPage">
          <x-icon type="ios-search" size="0.4rem"></x-icon>
          <span>输入商品名称</span>
        </div>
      </div>
      <div style="height:.93rem;"></div>
    </div>
    <!--banner-->
     <swiper height="3.5rem" dots-position="center" :auto="true">
      <swiper-item class="swiper-demo-img" v-for="(item, index) in bannertList" :key="index">
        <a :href="item.link">
          <img v-bind:src="item.image | filterImgUrl">
        </a>
      </swiper-item>
    </swiper>
    <!--nav-->
    <div class="nav">
      <template v-for="item in 5" v-if="AllColumnList.length <= 0">
        <div class="nav-empty">
          <p></p>
          <span></span>
        </div>
      </template>
      <template v-for="(item) in AllColumnList" v-else>
        <div @click="$router.push({path: '/goodList', query: { searchType: 2, columnId:item.columnId }})" v-if="item.columnType == 1">
          <img :src="item.columnLogo | filterImgUrl">
          <span>{{item.columnName}}</span>
        </div>
        <div v-else>
          <a :href="item.relateUrl">
            <img :src="item.columnLogo | filterImgUrl">
            <span>{{item.columnName}}</span>
          </a>
        </div>
      </template>
    </div>
    <!--栅格-->
    <div class="grid">
      <div class="grid-listbox">
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
        <div>
          <!-- <span>惠</span> -->
          <span>{{item.columnName}}</span>
        </div>
        <div @click="$router.push({path: '/goodList', query: { searchType: 2, columnId:item.columnId }})">
          <span>详情</span>
          <span class='list-title-icon'></span>
          <span class='list-title-icon'></span>
        </div>
      </div>
      <div class='list'>
        <div class='list-lis' v-for="ite in item.goodsList" @click="$router.push({path: '/goodDetail', query: { goodsId: ite.id }})">
          <!-- <div class='Discount'>
            <div>直降</div>
            <div>50</div>
          </div> -->
          <div class="list-img">
            <img :src='ite.mainImage | filterImgUrl'>
          </div>
          <div class='list-tit'>{{ite.goodsName}}</div>
          <div class='list-bot'>
            <div class='list-bot-lef'>
              <div>¥ {{ite.goodsPrice | moneyFilter}}</div>
              <div>¥ {{ite.goodsPrice | moneyFilter}}</div>
            </div>
            <div class="list-bot-rig"><img src='../../assets/images/join-cart.png'></div>
          </div>
        </div>
      </div>
    </div>
    <!--返回首页按钮-->
    <div class="go-home-btn" @click="$router.push({path: '/', query: { shopId: shopId}})">
      <img src='../../assets/images/nav/goHome.png'>
    </div>
  </div>
</template>

<script>
  import serchHeader from '../../components/serchHeader' // 搜索
  import { Swiper, SwiperItem } from 'vux' // 轮播图
  export default {
    components: {
      serchHeader,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        shopId: '', //
        bannertList: [], // banner集合
        advertList: [], // 广告集合
        AllColumnList: [] // 栏目及栏目列表
      }
    },
    mounted: function () {
      this.shopId = localStorage.getItem('shopId') // 获取百世贝首页存储的shopId
      this.getAllColumnList() // 获取栏目
      this.getAdvert() // 获取广告
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
       * 获取广告
      */
      getAdvert () {
        this.$http.post(`${this.api.advertList}`, {
          shopId: this.$route.query.shopId,
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
            shopId: this.$route.query.shopId
          }
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.AllColumnList = res.data.data
        })
      }
    }
  }
</script>

<style scoped lang=less>
.indexContainer{
 .swiper-demo-img  {
   background: #eee;
   img{
    width: 100%;
    height: 100%;
   }
  }
  /**搜索**/
  .serch{
    width: 100%;
    max-width: 7.5rem;
    height: .93rem;
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 500;
    background: #fff;
    box-shadow: 0 0 10px 0 hsla(0,6%,58%,.6);
    -webkit-box-shadow: 0 0 10px 0 hsla(0,6%,58%,.6);
    img {
      width: 1.24rem;
      height: .52rem;
      margin-left: .38rem;
      margin-right: .48rem;
    }
    .serch-inp{
      width: 4.64rem;
      height:.55rem;
      background:#f4f4f4;
      font-size: .24rem;
      color: #c4c4c4;
      display: flex;
      align-items: center;
      border-radius: 5px;
    }
    .serch-inp svg{
      margin-left: .16rem;
      margin-right: .15rem;
      fill: #c7c7c7;
    }
  }
  .vux-slider{
    background: #eee;
  }
  /**nav**/
  .nav{
    width: 7.5rem;
    min-height: 1.5rem;
    padding: .35rem 0 .2rem 0;
    overflow-x: auto;
    white-space: nowrap;
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
    div{
      width: 25%;
      display: inline-block;
      /* width: 1.72rem; */
      /* margin-right: .21rem; */
      color: #656565;
      font-size:.26rem;
      text-align:center;
      overflow: hidden;
      padding: 0 .1rem;
      box-sizing: border-box;
      /* margin-bottom: .15rem; */
      img{
        width:.9rem;
        height: .9rem;
        display: inline-block;
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
    overflow: hidden;
    padding: .3rem 0;
    border-top: .3rem solid #f1f1f1;
    &:empty{
      border-top: none;
    }
    .grid-listbox{
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
    overflow: hidden;
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
    .list{
      height: 100%;
      overflow: hidden;
      .list-lis{
        width: 49.5%;
        height: 4.67rem;
        overflow: hidden;
        margin-right: 1%;
        float: left;
        margin-bottom: .1rem;
        border: 1px solid #edeef1;
        box-sizing: border-box;
        position: relative;
        &:nth-child(2n){
          margin-right: 0;
        }
        .list-img{
          width: 100%;
          height: 2.98rem;
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
          background: #f95a58;
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
  .go-home-btn{
    position: fixed;
    right: .28rem;
    bottom: 2.8rem;
    img{
      width: 1.37rem;
      height: 1.37rem;
    }
  }
}
</style>
