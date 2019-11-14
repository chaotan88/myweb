<template>
  <div class="indexContainer" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <!-- 顶部背景 -->
    <div class="h-bg" :class="!secondAdv.isShow ? 'noAdv' : ''">
      <!--serch-->
      <div>
        <div class='serch'>
          <div class="serch-bg" :style="{opacity: headerOptiy}"></div>
          <img src='../../assets/images/logo-n.png'>
          <div class='serch-inp' @click="goSearchPage">
            <x-icon type="ios-search" size="0.4rem"></x-icon>
            <span>输入商品名称</span>
          </div>
        </div>
        <div class="serch-hei"></div>
      </div>
      <!--banner-->
      <swipers :options="swiperOption" class="banner">
        <swiper-slides v-for="(item,index) in bannertList" class="banner-slide" :key="index">
          <a :href="item.link">
            <img v-bind:src="item.image | filterImgUrl">
          </a>
        </swiper-slides>
      </swipers>
    </div>
    <!-- 背景椭圆 -->
    <div class="h-bg-arc" v-if="secondAdv.isShow"></div>
    <!-- 广告条 -->
    <div class="h-adv" v-if="secondAdv.isShow">
      <a :href="secondAdv.advertPositionDetailList[0].link">
        <img :src="secondAdv.advertPositionDetailList[0].image | filterImgUrl">
      </a>
    </div>
    <!-- nav -->
    <div class="nav" :class="secondAdv.isShow ? '' : 'no-adv'">
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
    <!-- 活动 -->
    <home-action-component></home-action-component>
    <!-- 猜你喜欢 -->
    <guss-like ref="gussLike"></guss-like>
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
  import homeActionComponent from '../../components/homeActionComponent' // 首页活动组件
  import commonGoodsList from '../../components/commonGoodsList' // 公共列表组件
  import codeComponent from '../../components/codeComponent'
  import serchHeader from '../../components/serchHeader' // 搜索
  import gussLike from '../../components/gussLike' // 猜你喜欢
  import { Swiper, SwiperItem, XDialog, LoadMore } from 'vux' // 轮播图
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import swipcss from 'swiper/dist/css/swiper.css'
  export default {
    components: {
      serchHeader,
      Swiper,
      SwiperItem,
      codeComponent,
      commonGoodsList,
      homeActionComponent,
      XDialog,
      swipers: swiper,
      swiperSlides: swiperSlide,
      swipcss,
      LoadMore,
      gussLike
    },
    data () {
      return {
        swiperOption: {
          autoplay: 2000,
          slidesPerView: 'auto',
          initialSlide: 1,
          centeredSlides: true,
          watchSlidesProgress: true,
          paginationClickable: true,
          onProgress: function (swiper) {
            for (var i = 0; i < swiper.slides.length; i++) {
              var slide = swiper.slides[i]
              var progress = slide.progress
              var es = slide.style
              // es.opacity = 1 - Math.min(Math.abs(progress / 2), 1)
              es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0px, 0, ' + (-Math.abs(progress * 160)) + 'px)'
            }
          },
          onSetTransition: function (swiper, speed) {
            for (var i = 0; i < swiper.slides.length; i++) {
              var es = swiper.slides[i].style
              es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms'
            }
          }
        },
        busy: false,
        showLoading: false,                  // 是否显示加载loading
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
        activityList: [],                    // 显示抢购列表
        gussLikeData: [],                    // 猜你喜欢
        gussLikeMainImg: '',                 // 猜你喜欢主图
        secondAdv: {},                       // 二级广告位
        recommendAdv: '',                    // 推荐商品广告位
        start: 1,                            // 当前页
        totalPage: 0,                        // 总页数
        pageSize: 10                         // 每页显示几条
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
       * 获取栏目
      */
      getAllColumnList () {
        this.$http.get(this.api.getAllColumnList, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            return false
          }
          if (resData.data.length > 0) {
            // 积分系统连接参数拼接
            resData.data.forEach((item) => {
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
            for (var i = 0, len = resData.data.length; i < len; i += 10) {
              result.push(resData.data.slice(i, i + 10))
            }
            this.navList = result
            // 显示抢购分组
            var firstData = resData.data[0].goodsList  // 过滤列表为零的情况
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
            this.AllColumnList = resData.data
            this.$nextTick(() => {
              window.scrollTo(0, 1)
              window.scrollTo(0, 0)
            })
          }
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
              } if (item.putLocation === 9) {         // 猜你喜欢主图
                if (item.advertPositionDetailList.length > 0) {
                  this.gussLikeMainImg = item.advertPositionDetailList[0].image
                }
              } if (item.putLocation === 8) {         // 二级广告
                if (item.advertPositionDetailList && item.advertPositionDetailList.length > 0) {
                  this.secondAdv = item
                }
              }
            })
          }
        })
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
      },
      /**
       * 分页
      */
      loadMore () {
        this.$refs.gussLike.loadMore()
      }
    }
  }
</script>

<style  lang=less>
.indexContainer{
  background:#f3f4f5;
  /* 顶部背景 */
  .h-bg{
    width: 7.5rem;
    height: 4.5rem;
    /* height: 6rem; */
    background: -webkit-gradient(linear, left top, right top, from(#f1876c), to(#f45f64));
    /* background: url('../../assets/images/index-ban-bg.png') no-repeat; */
    background-size: 100% 100%;
    z-index: 300;
    &.noAdv{
      height: 4rem;
    }
  }
  .h-bg-arc{
    width: 7.5rem;
    overflow: hidden;    
    &::after{
      content: '';
      display: block;
      width: 8.5rem;
      height: 4rem;
      background: -webkit-gradient(linear, left top, right top, from(#f1876c), to(#f45f64));
      border-radius: 50% 50%;
      margin-top: -2.5rem;
      margin-left: -.5rem;
    }
  }
  /**搜索**/
  .serch-hei{
    height: .95rem;
  }
  .serch{
    width: 100%;
    max-width: 7.5rem;
    height: .95rem;
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 500;
    padding: 0 .2rem;
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
      display: block;
      /* height: .52rem; */
    }
    .serch-inp{
      flex: 1;
      height:.57rem;
      background:rgba(255,255,255,0.7);
      border: 5px;
      font-size: .24rem;
      color: #c4c4c4;
      display: flex;
      align-items: center;
      color: #b7888c;
      border-radius: 4px;
    }
    .serch-inp svg{
      margin-left: .16rem;
      margin-right: .15rem;
      fill: #b7888c;
    }
    .serch-bg{
      background: #000;
      height: 100%;
      width: 7.5rem;
      position: absolute;
      left: 0;
      z-index: -1;
      opacity: 1;
    }
  }
  /* banner */
  .banner{
    height: 2.8rem;
    width:100%;	
    -webkit-perspective: 1200px;
    -moz-perspective: 1200px;
    -ms-perspective: 1200px;
    perspective: 1200px;
    .swiper-wrapper{
      -webkit-transform-style: preserve-3d;
      -moz-transform-style: preserve-3d;
      -ms-transform-style: preserve-3d;
      transform-style: preserve-3d;
      .banner-slide{
        width: 98%;
        img{
          width:92%;
          height: 100%;
          margin:0 auto;
          display:block;
          border-radius: 15px;
        }
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
  /* 广告条 */
  .h-adv{
    /* height: 2.15rem; */
    margin-top: -2.2rem;
    img{
      width: 100%;
      display: block;
    }
  }
  /* nav */
  .nav{
    width: 7.5rem;
    height: auto;
    background: #fff;
    margin: 0 auto;
    position: relative;
    &.no-adv{
      /* margin-top: -2rem; */
    }
    .margTopOne{
      .vux-swiper{
        height:1.76rem !important;
      }
    }
    .margTopTwo{
      /* margin-top: -1.75rem; */
      .vux-swiper{
        height:3.5rem !important;
      }
    }

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
      /* border-right: .04rem solid #f5f5f5;
      border-bottom: .04rem solid #f5f5f5; */
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
  /* 猜你喜欢 */
  .weui-loadmore{
    margin: 0 auto;
    padding: 1.5em 0;
  }
  .guess-like{
    margin-top: .17rem;
    .guess-like-title{
      img{
        width: 100%;
        display: block;
        /* height: 2.64rem; */
      }
    }
    ul{
      height: auto;
      overflow: hidden;
      padding: .14rem .09rem;
      li{
        height: 5.38rem;
        overflow: hidden;
        box-sizing: border-box;
        float: left;
        width: 50%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding-bottom: .09rem;
        position: relative;
        &:nth-child(odd) {
          padding-right: .045rem;
        }
        &:nth-child(2n){
          padding-left: .045rem;
          border-right: none;
        }
        .list-box{
          height: 100%;
          background: #fff;
          padding: 0;
        }
        .list-img{
          width: 100%;
          height: 3.69rem;
          display: block;
          img{
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .list-tit{
          display: -webkit-box;
          display: -moz-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: .24rem;
          color: #909090;
          margin: .12rem .23rem;
        }
        .list-bot{
          display: flex;
          align-items: center;
          position: absolute;
          bottom: .23rem;
          width: auto;
          left: .23rem;
          right: .23rem;
          div:nth-child(1){
            flex: 1;
            font-size: .28rem;
            color: #ea5486;
          }
          div:nth-child(2){
            font-size: .2rem;
            color: #514f50;
            border: 1px solid #cccccc;
            border-radius: 4px;
            line-height: .3rem;
            padding: .06rem .2rem;
            
          }
        }
      }
    }
  }
}
</style>