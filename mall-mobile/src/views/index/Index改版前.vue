<template>
  <div class="indexContainer">
    <!--serch-->
    <div>
      <div class='serch'>
        <div class="serch-bg" :style="{opacity: headerOptiy}"></div>
        <img src='../../assets/images/logo.png'>
        <div class='serch-inp' @click="goSearchPage">
          <x-icon type="ios-search" size="0.4rem"></x-icon>
          <span>输入商品名称</span>
        </div>
      </div>
    </div>
    <!--banner-->
    <swiper height="4.75rem" dots-position="center" :auto="true" class="banner">
      <swiper-item class="swiper-demo-img" v-for="(item, index) in bannertList" :key="index">
        <a :href="item.link">
          <!-- <img src="../../assets/images/test/bannerNew.jpg" > -->
          <img v-bind:src="item.image | filterImgUrl">
        </a>
      </swiper-item>
    </swiper>
    <!--nav-->
    <div class="nav">
      <swiper dots-position="center" :auto="false"  :class="navClass" >
        <swiper-item class="swiper-demo-img" v-for="(ite, ind) in navList" :key="ind" >
          <template v-for="(item, index) in ite">
            <!--跳转商品列表-->
            <div @click="goGoodsList(item, 1)" v-if="item.columnType == 1" class="nav-option">
              <img v-lazy="item.columnLogo"  :data-srcset="item.columnLogo | filterImgUrl" v-if="item.columnLogo">
              <span>{{item.columnName}}</span>
            </div>
            <!--商家指定跳转-->
            <div v-else class="nav-option">
              <router-link v-if="item.relateUrl.indexOf('setmeal') > -1 && item.relateUrl.indexOf('http') === -1" :to="item.relateUrl">
                <img v-lazy="item.columnLogo" :data-srcset="item.columnLogo | filterImgUrl">
                <span>{{item.columnName}}</span>
              </router-link>
              <a :href="item.relateUrl" v-else>
                <img v-lazy="item.columnLogo" :data-srcset="item.columnLogo | filterImgUrl">
                <span>{{item.columnName}}</span>
              </a>
          </div>
          </template>
          <!--如果每组列表的个数小于5个组数小于2个-->
          <template v-if="ite.length < 5 && navList.length < 2">
            <div class="nav-option" v-for="v in (5-ite.length)"></div>
          </template>
          <!--如果每组列表的个数小于5个组数大于2个-->
          <template v-if="ite.length <= 5 && navList.length >= 2">
            <div class="nav-option" v-for="v in (10-ite.length)"></div>
          </template>
          <!--如果每组列表的个数大于5个小于10个-->
          <template v-if="ite.length > 5 && ite.length < 10">
            <div class="nav-option"  v-for="v in (10-ite.length)"></div>
          </template>
        </swiper-item>
      </swiper>
    </div>
    <!-- 限时抢购 -->
    <div class="flashSale" v-if="activityList.length > 0">
      <div class="flashSale-tit"><img src="../../assets/images/nav/flashSale.png"></div>
      <div class="flashSale-con">
        <!-- <swiper height="4rem" dots-position="center" :loop="true" :auto="false" class="shopFlashSale-con-option">
          <swiper-item class="swiper-demo-img" v-for="(item, index) in activityList" :key="index">
            <ul>
              <li v-for="(ite, ind) in item" @click="$router.push({path:'/goodDetail',query: {goodsId: ite.id}})">
                <div class="shopFlashSale-con-option-img">
                  <img v-lazy="ite.mainImage" :data-srcset="ite.mainImage | filterImgUrl">
                </div>
                <div class="shopFlashSale-con-option-new-price"><i>¥</i>{{ite.goodsMinPrice}}</div>
                <div class="shopFlashSale-con-option-original-price">¥{{ite.goodsMaxPrice}}</div>
                <div class="shopFlashSale-con-option-describe">{{ite.goodsName}}</div>
              </li>
            </ul>
          </swiper-item>
        </swiper> -->
        <swipers :options="swiperOption"  class="flashSale-con-option">
          <swiper-slides v-for="(item,index) in activityList" class="ticketPurchase-option" :key="index">
            <ul>
              <li v-for="(ite, ind) in item" @click="$router.push({path:'/goodDetail',query: {goodsId: ite.id}})" v-if="ite">
                <div class="flashSale-con-option-img">
                  <img  :src="ite.mainImage | filterImgUrl">
                </div>
                <div class="flashSale-con-option-new-price"><i>¥</i>{{ite.goodsMinPrice}}</div>
                <div class="flashSale-con-option-original-price">¥{{ite.goodsMaxPrice}}</div>
                <div class="flashSale-con-option-describe">{{ite.goodsName}}</div>
              </li>
            </ul>
          </swiper-slides>
          <div class="swiper-pagination" slot="pagination"></div>
        </swipers>
      </div>
    </div>
    <!--栅格-->
    <div class="grid" v-if="advertList.isShow">
      <div class="grid-title">
        <div class="grid-title-lbg">
          <img src="../../assets/images/coulm-title-lbg.png" >
        </div>
        <span>品 / 牌 / 区</span>
        <div class="grid-title-rbg">
          <img src="../../assets/images/coulm-title-rbg.png" >
        </div>
      </div>
      <div class="grid-listbox">
        <template v-for="item in advertList.advertPositionDetailList">
          <div @click="goGoodsList(item, 2)">
            <a :href="item.link">
              <img v-lazy="item.image" :data-srcset="item.image | filterImgUrl">
            </a>
          </div>
        </template>
      </div>
    </div>
    <!--商品列表-->
    <commonGoodsList goodsTypes="home" @getListData="getAllColumnList"></commonGoodsList>
    <!-- 广告弹窗 -->
    <div class="adver-pop">
      <x-dialog v-model="showAdver">
        <x-icon type="ios-close-outline" size="30" @click="closePop"></x-icon>
        <swiper dots-position="center" :auto="false" class="swiper">
          <swiper-item class="swiper-demo-img" v-for="(item, index) in adverPopList" :key="index" @click="goGoodsList(item, 2)">
            <a :href="item.link">
              <img :src="item.image | filterImgUrl">
            </a>
          </swiper-item>
        </swiper>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import commonGoodsList from '../../components/commonGoodsList' // 公共列表组件
  import codeComponent from '../../components/codeComponent'
  import serchHeader from '../../components/serchHeader' // 搜索
  import { Swiper, SwiperItem, XDialog } from 'vux' // 轮播图
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import swipcss from 'swiper/dist/css/swiper.css'
  export default {
    components: {
      serchHeader,
      Swiper,
      SwiperItem,
      codeComponent,
      commonGoodsList,
      XDialog,
      swipers: swiper,
      swiperSlides: swiperSlide,
      swipcss
    },
    data () {
      return {
        swiperOption: {
          loop: true,
          pagination: '.swiper-pagination'
        },
        showAdver: false,                    // 是否显示广告弹窗
        bsbUserInfo: '',                     // 存储的用户信息
        headerOptiy: 0,                      // header背景颜色透明度
        values: '',
        code: '',
        navClass: '',                        // nav class
        navList: [],                         // nav集合
        bannertList: [],                     // banner集合
        advertList: {},                      // 广告集合
        adverPopList: [],                    // app弹窗广告
        noColumn: false,                     // 无栏目
        AllColumnList: [],                   // 栏目及栏目列表
        shopList: [],                        // 商家列表
        activityList: []                     // 显示抢购列表
      }
    },
    computed: {
      ...mapState(['upgradeIndAdverSte'])
    },
    watch: {
      upgradeIndAdverSte: function (val) {
        if (this.upgradeIndAdverSte !== 'closed') {
          this.showAdver = true
        }
      }
    },
    mounted: function () {
      this.bsbUserInfo = localStorage.getItem('bsbUserInfo') ? JSON.parse(localStorage.getItem('bsbUserInfo')) : ''
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
              // 积分系统连接参数拼接
              item.advertPositionDetailList.forEach((ite) => {
                if (ite.link && ite.link.indexOf('points') > -1) {
                  let params = ''
                  if (this.bsbUserInfo) {
                    params = (ite.link.indexOf('?') === -1 ? '?' : '&') + 'phone=' + this.bsbUserInfo.phone + '&token=' + this.bsbUserInfo.token
                  }
                  ite.link = ite.link + params
                }
              })
              if (item.putLocation === 1) {
                this.bannertList = item.advertPositionDetailList
              } if (item.putLocation === 2) {
                this.advertList = item
              } if (item.putLocation === 5) {
                this.adverPopList = item.advertPositionDetailList
                if (item.isShow && this.adverPopList.length > 0 && this.upgradeIndAdverSte !== 'closed') {
                  this.$store.dispatch('upgradeIndAdverSte', Math.random())  // 更新vux中数据
                }
              }
            })
          }
        })
      },
      /**
       * 获取栏目及栏目列表
      */
      // getAllColumnList () {
      //   this.$http.get(this.api.getAllColumnList, {
      //     params: {
      //       shopId: ''
      //     }
      //   }).then((res) => {
      //     let resData = res.data
      //     var result = []
      //     if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
      //       this.noColumn = 1
      //       return false
      //     }
      //     this.noColumn = resData.data.length > 0 ? 0 : 1
      //     // url判断拼接

      //     // 数据分组
      //     for (var i = 0, len = resData.data.length; i < len; i += 10) {
      //       result.push(resData.data.slice(i, i + 10))
      //     }
      //     this.navList = result
      //     if (this.navList.length >= 2) {
      //       this.navClass = 'margTopTwo'
      //     } else if (this.navList.length < 2 && this.navList[0].length > 5) {
      //       this.navClass = 'margTopTwo'
      //     } else {
      //       this.navClass = 'margTopOne'
      //     }
      //     this.AllColumnList = resData.data
      //     this.AllColumnList.forEach((item, index) => {
      //       this.$set(item, 'columnNameStr', '')
      //       if (item.columnName) {
      //         var columnName = item.columnName.split('')
      //         columnName.forEach((ite, ind) => {
      //           item.columnNameStr += item.columnName[ind] + ' / '
      //         })
      //         item.columnNameStr = item.columnNameStr.substring(0, item.columnNameStr.length - 2)
      //       }
      //     })
      //     this.$nextTick(() => {
      //       window.scrollTo(0, 1)
      //       window.scrollTo(0, 0)
      //     })
      //   })
      // },
      getAllColumnList (val) {
        if (val && val.length > 0) {
          // 积分系统连接参数拼接
          val.forEach((item) => {
            if (item.relateUrl.indexOf('points') > -1) {
              let params = ''
              if (this.bsbUserInfo) {
                params = (item.relateUrl.indexOf('?') === -1 ? '?' : '&') + 'phone=' + this.bsbUserInfo.phone + '&token=' + this.bsbUserInfo.token
              }
              item.relateUrl = item.relateUrl + params
            }
          })
          var result = []
          var activityArr = []
          // nav栏目数据分组
          for (var i = 0, len = val.length; i < len; i += 10) {
            result.push(val.slice(i, i + 10))
          }
          this.navList = result
          // 显示抢购分组
          var firstData = val[0].goodsList  // 过滤列表为零的情况
          for (var j = 0, leng = firstData.length; j < leng; j += 3) {
            activityArr.push(firstData.slice(j, j + 3))
          }
          activityArr.forEach((item) => {
            if (item.length < 3) {
              for (var i = 0; i <= 3 - item.length; i++) {
                item.push(firstData[i])
              }
            }
          })
          this.activityList = activityArr
          if (this.activityList.length <= 1) {
            this.swiperOption.loop = false
          } else {
            this.swiperOption.loop = true
          }
          // nav栏目样式显示判断
          if (this.navList.length >= 2) {
            this.navClass = 'margTopTwo'
          } else if (this.navList.length < 2 && this.navList[0].length > 5) {
            this.navClass = 'margTopTwo'
          } else {
            this.navClass = 'margTopOne'
          }
          this.AllColumnList = val
          this.$nextTick(() => {
            window.scrollTo(0, 1)
            window.scrollTo(0, 0)
          })
        }
      },
      /**
       * 跳到商品列表页
      */
      goGoodsList (v, types) {
        if (types === 1) {
          localStorage.setItem('CoumnBanner', v.mainImage) // 存储栏目主图
          localStorage.setItem('navCoumnName', v.columnName) // 存储栏目名称 方便列表页更新页面title
          this.$router.push({path: '/goodList', query: { searchType: 2, columnId: v.columnId }})
        } else {
          if (v.link.indexOf('goodList') > -1) {
            localStorage.setItem('CoumnBanner', '') // 存储栏目主图
            localStorage.setItem('navCoumnName', '商品列表') // 存储栏目名称 方便列表页更新页面title
          }
        }
      },
      /**
       * 关闭弹窗
      */
      closePop () {
        this.$store.dispatch('upgradeIndAdverSte', 'closed') // 更新vux中数据
        this.showAdver = false
      }
    }
  }
</script>

<style  lang=less>
.indexContainer{
  background:#f8f8f8;
  .banner{
    background: #ecedf1;
    .swiper-demo-img  {
      background: #ecedf1;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .vux-indicator {
      bottom:1rem;
      .vux-icon-dot{
        width: .2rem;
        height: .08rem;
        background: #fff;
        border-radius: 5px;
        &.active{
          width: .47rem;
          height: .08rem;
          background: #fff;
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
    width: 7.1rem;
    height: auto;
    /* overflow:hidden; */
    border-radius: 10px;
    background: #fff;
    margin: 0 auto;
    margin-top: -1.75rem;
    /* margin-top: -1.61rem; */
    position: relative;
    .margTopOne{
      margin-top: -0.9rem;
      .vux-swiper{
        height:1.76rem !important;
      }
    }
    .margTopTwo{
      margin-top: -1.75rem;
      .vux-swiper{
        height:3.5rem !important;
      }
    }

    /* .vux-slider > .vux-swiper > .vux-swiper-item{
      position:relative;
    } */
    .vux-indicator {
      bottom: 0;
      .vux-icon-dot{
        width: .22rem;
        height: .05rem;
        background: #cccccc;
        border-radius: 5px;
        &.active{
          width: .22rem;
          height: .05rem;
          border-radius: 5px;
          background: #666666;
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
      height: 1.76rem;
      display: block;
      float: left;
      color: #656565;
      font-size:.24rem;
      text-align:center;
      overflow: hidden;
      border-right: .04rem solid #f5f5f5;
      border-bottom: .04rem solid #f5f5f5;
      padding: 0 .1rem;
      box-sizing: border-box;
      &:nth-child(5n){
        border-right: none;
      }
      &:nth-last-child(1){
        border-bottom:none
      }
      &:nth-last-child(2){
        border-bottom:none
      }
      &:nth-last-child(3){
        border-bottom:none
      }
      &:nth-last-child(4){
        border-bottom:none
      }
      &:nth-last-child(5){
        border-bottom:none
      }
      img{
        width:.8rem;
        height: .8rem;
        display: block;
        margin: 0 auto;
        margin-top: .22rem;
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

  /* 限时抢购 */
  .flashSale{
    margin-top: .31rem;
    .flashSale-tit{
      height: 2.71rem;
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .flashSale-con{
      height: 4rem;
      padding: .21rem .19rem;
      background: -webkit-linear-gradient(top, #fab4ad 35%, #fe7068);
      .swiper-container{
        height: 4rem;
      }
      .flashSale-con-option{
        .swiper-pagination {
          bottom: 0;
          .swiper-pagination-bullet{
            width: 8px;
            height: 8px;
            background: #fff;
            border-radius: 8px;
            opacity: 1;
            margin:0 3px;
            &.swiper-pagination-bullet-active{
              width: 4px;
              height: 4px;
              border-radius: 8px;
              background: #ee4d43;
              border: 2px solid #fff;
            }
          }
        }
        ul{
          display: flex;
          justify-content: space-between;
          li{
            /* float: left; */
            width: 2.3rem;
            /* margin-right: .1rem; */
            text-align: center;
            background: #fff;
            border-radius: 5px;
            padding: .2rem;
            padding-top: .1rem;
            height: 3.4rem;
            box-sizing: border-box;
            &:nth-child(3n){
              margin-right: 0;
            }
            .flashSale-con-option-img{
              width: 1.6rem;
              height: 1.6rem;
              margin: 0 auto;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .flashSale-con-option-new-price{
              font-size: .28rem;
              color: #fff;
              background: #fb0628;
              border-radius: 30px;
              display: inline-block;
              line-height: .3rem;
              padding: 1px .2rem;
              margin-top: .2rem;
              i{
                font-size: .24rem;
              }
            }
            .flashSale-con-option-original-price{
              color: #999999;
              font-size: .24rem;
              margin-top: .05rem;
              margin-bottom: .1rem;
              text-decoration: line-through;
            }
            .flashSale-con-option-describe{
              color: #333333;
              font-size: .24rem;
              display: -webkit-box;
              display: -moz-box;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
      }
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
    /* padding-bottom: .32rem; */
    position: relative;
    &:empty{
      padding: 0;
      border:none;
    }
    .grid-title{
      color: #ff57c1;
      font-size: .3rem;
      max-width: 5rem;
      height: .8rem;
      overflow:hidden;
      display:flex;
      align-items: center;
      justify-content: center;
      margin:0 auto;
      span{
        display:block;
        max-width:3rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .grid-title-lbg{
        width:.62rem;
      }
      .grid-title-rbg{
        width:.77rem;
      }
      img{
        width:100%
      }
    }

    .grid-listbox{
      height: auto;
      overflow: hidden;
      margin: 0 .2rem;
      div{
        float: left;
        /* background: #eee; */
        box-sizing: border-box;
        img{
          width: 100%;
          height: 100%;
        }
      }
      div:nth-child(1){
        width: 50%;
        height: 4.68rem;
        padding-right: 2px;
        border-top-left-radius:7px;
        border-bottom-left-radius:7px;
        img{
          border-top-left-radius:7px;
          border-bottom-left-radius:7px;
        }
      }
      div:nth-child(2){
        width: 50%;
        height: 1.89rem;
        padding-bottom: 4px;
        border-top-right-radius:7px;
        padding-left: 2px;
        img{
          border-top-right-radius:7px;
        }
      }
      div:nth-child(3){
        width: 50%;
        height: 2.79rem;
        border-bottom-right-radius:7px;
        padding-left: 2px;
        img{
          border-bottom-right-radius:7px;
        }
      }
    }
  }
  /* 广告弹窗 */
  .adver-pop{
    position: relative;
    z-index: 6000000000;
    svg{
      width: .55rem;
      height: .55rem;
      fill: #fff;
      position: absolute;
      right: -.3rem;
      top: -.7rem;
    }
    .weui-dialog{
      background: transparent;
      width: 80%;
      max-width: 80%;
      max-height: 6rem;
      overflow: unset;
      img{
        width: 100%;
        height: 100%;
        border-radius: 7px;
      }
      .vux-indicator {
        bottom: .2rem;
        .vux-icon-dot{
          width: 8px;
          height: 8px;
          background: #bbbbbb;
          border-radius: 8px;
          &.active{
            width: 4px;
            height: 4px;
            border-radius: 8px;
            background: #fff;
            border: 2px solid #bbbbbb;
          }
        }
      }
    }
    .vux-swiper{
      background: transparent;
      height: calc(60vh) !important;
    }
  }
}
</style>
