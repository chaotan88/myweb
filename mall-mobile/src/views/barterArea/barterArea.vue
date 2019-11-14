<template>
  <div class="barterPage">
    <div class="barter-swiper-wrap" v-if="isShow === 1">
      <swiper :aspect-ratio="300/800" :loop="true" auto :show-dots="false">
          <swiper-item class="swiper-demo-img" v-for="(item, index) in getAdvertData" :key="index">
            <a :href="item.link"><img :src="item.image"></a>
          </swiper-item>
      </swiper>
    </div>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
      <div class="barter-list-wrap" v-for="(item, index) in addAttInfoListData" :key="index" v-if="addAttInfoListData.length > 0">
        <div class="list-user-wrap">
          <div style="display: flex;">
            <!--<div class="list-user-img">-->
            <!--<img :src="item.goodsImageUrls"/>-->
            <!--</div>-->
            <div class="list-user-area">
              <p>{{item.phone | phoneSubstringTop}}</p>
              <p>{{item.address}}</p>
            </div>
          </div>
          <div class="list-user-tel" @click="callPhone">
            <a v-if="!bsbUserInfo">
              <img :src="boda"/>
              <p>拨打电话</p>
            </a>
            <a :href="'tel:' + item.phone" v-if="bsbUserInfo">
              <img :src="boda"/>
              <p>拨打电话</p>
            </a>
          </div>
        </div>
        <div @click="goDetail(item, index)">
          <div class="list-user-info">{{item.goodsTitle}}</div>
          <div class="list-user-nav">
            <ul>
              <li><img :src="item.mainImage"/></li>
              <li v-for="(itm, ind) in item.goodsImageUrls" v-if="ind <= 2 && itm.length > 0"><img :src="itm"/></li>
            </ul>
          </div>
          <div class="list-user-price">
            <span>{{item.publishTime | formatDate(1)}}&nbsp;&nbsp;发布</span><p>￥{{item.goodsPrice | moneyFilter}}</p>
          </div>
          <div class="list-user-foot">
            <div class="trian"></div>
            <!--<div class="viewer">-->
            <!--<img :src="liulan"/>-->
            <!--<span>{{item.viewCount}}</span>人浏览-->
            <!--</div>-->
            <div class="cover">
              <img :src="shoucang"/>
              <span>{{item.collectCount}}</span>人收藏
            </div>
            <div class="detail">
              查看详情
              <img :src="more"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="text-align: center;padding: 1rem 0;" v-if="noData">暂无数据</div>
    <load-more :tip="loadingTitle" v-if="showLoading"></load-more>
  </div>
</template>

<script>
  import { Swiper, SwiperItem, LoadMore, XDialog } from 'vux'
  // import { swiper, swiperSlide } from 'vue-awesome-swiper'
  // import swipcss from 'swiper/dist/css/swiper.css'
  export default {
    name: 'barterArea',
    data () {
      return {
        loadingTitle: '数据加载中',
        showLoading: false,                       // 是否显示加载loading
        busy: false,
        noData: false,                           // 无数据状态
        start: 1,                                // 当前页
        pageSize: 10,                             // 每页显示几条
        totalPage: 0,                            // 总页数
        bsbUserInfo: null,
        imgList: [
          {
            img: require('../../assets/images/aaacreat.png')
          },
          {
            img: require('../../assets/images/aaacreat.png')
          },
          {
            img: require('../../assets/images/aaacreat.png')
          }
        ],
        more: require('../../assets/images/att/asdasd_07.png'),
        shoucang: require('../../assets/images/att/asdasd_10.png'),
        liulan: require('../../assets/images/att/asdasd_18.png'),
        boda: require('../../assets/images/att/ATT_07.png'),
        addAttInfoListData: [],
        getAdvertData: [],
        isShow: null // 这个是顶部广告位的显示与隐藏
      }
    },
    mounted () {
      this.getAdvert()
      this.addAttInfoListData = []
      this.addAttInfoList()
    },
    methods: {
      /**
       * 分页
       */
      loadMore () {
        this.showLoading = true
        if (parseInt(this.start) > parseInt(this.totalPage)) {
          this.showLoading = false
          return
        }
        this.addAttInfoList() // 分页数据
      },
      /**
       * 易货区列表
       */
      addAttInfoList () {
        this.$http.post(`${this.api.getAttInfoList}`, {
          start: this.start,
          pageSize: this.pageSize
        }).then((res) => {
          if (res.data && res.data.status === '1') {
            let resDate = res.data.data.list
            // console.log(resDate)
            for (let i in resDate) {
              resDate[i].goodsImageUrls = resDate[i].goodsImageUrls.split(',')
            }
            this.addAttInfoListData = this.addAttInfoListData.concat(resDate)
            this.noData = res.data.data.list.length > 0 ? 0 : 1
            this.start = this.start + 1 // 当前页数
            this.totalPage = res.data.data.pages // 总页数
            // console.log(this.addAttInfoListData, 'this.addAttInfoListData[i].goodsImageUrls')
          }
        })
      },
      callPhone () {
        this.bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
        if (this.bsbUserInfo && this.bsbUserInfo.token) {
        } else {
          localStorage.setItem('REDIRECT_URL', '/barterArea')
          this.$router.push({
            path: '/login?attCode=' + 'A0001',
            query: {redirect: '/barterArea'}
          })
        }
      },
      /**
       * 获取ATT广告轮播图
       */
      getAdvert () {
        this.$http.post(`${this.api.advertList}`, {
          start: 1,
          pageSize: 10,
          applicationTerminal: 1
        }).then((res) => {
          // console.log(res)
          if (res.data && res.data.status === '1') {
            this.getAdvertData = res.data.data.list[9].advertPositionDetailList
            this.isShow = res.data.data.list[9].isShow
            // console.log(this.isShow)
          }
        })
      },
      goDetail (item, index) {
        console.log(item)
        this.$router.push({path: '/barterDetails', query: {path: 1}})
        localStorage.setItem('detailData', JSON.stringify(item))
      }
    },
    components: {
      Swiper,
      SwiperItem,
      LoadMore,
      XDialog
      // swiperSlides: swiperSlide,
      // swipcss
    }
  }
</script>

<style scoped lang="less">
  .barterPage{
    width: 7.5rem;
    min-height: 100vh;
    background: #f3f3f3;
    .barter-swiper-wrap{
      /*height: 2.86rem;*/
      background: #ffffff;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .barter-list-wrap{
      margin-bottom: 0.24rem;
      background: #ffffff;
      height: 5.14rem;
      padding-left: 0.2rem;
      padding-top: 0.24rem;
      .list-user-wrap{
        width: 100%;
        height: 0.88rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .list-user-img{
          width: 0.88rem;
          height: 0.88rem;
          border-radius: 50%;
          img{
            width: 0.88rem;
            height: 0.88rem;
            border-radius: 50%;
          }
        }
        .list-user-area{
          font-size: 0.22rem;
          margin-left: 0.1rem;
          p{
            height: 0.42rem;
            line-height: 0.42rem;
          }
          p:nth-of-type(1) {
            color: #333333;
            font-size: 0.3rem;
          }
          p:nth-of-type(2) {
            color: #8f8f8f;
          }
        }
        .list-user-tel{
          margin-right: 0.2rem;
          a{
            display: block;
            width: 1.95rem;
            height: 0.75rem;
            background: #ff191d;
            line-height: 0.75rem;
            text-align: center;
            -webkit-border-radius: 0.15rem;
            -moz-border-radius: 0.15rem;
            border-radius: 0.15rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            /*margin-left: 2rem;*/
            font-size: 0.26rem;
            img{
              width: 0.4rem;
              height: 0.4rem;
              -webkit-border-radius: 0.15rem;
              -moz-border-radius: 0.15rem;
              border-radius: 0.15rem;
              margin-right: 0.17rem;
            }
          }
        }
      }
      .list-user-info{
        width: 6.5rem;
        margin: 0.4rem 0.3rem;
        color: #191919;
        font-size: 0.26rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .list-user-nav{
        margin-left: 0.18rem;
        ul{
          display: flex;
          li{
            width: 1.5rem;
            height: 1.3rem;
            margin-right: 0.24rem;
            img{
              width: 1.5rem;
              height: 1.3rem;
            }
          }
        }
      }
      .list-user-price{
        display: flex;
        color: #8f8f8f;
        font-size: 0.18rem;
        margin: 0.2rem 0 0.42rem 0.18rem;
        padding-right: 0.36rem;
        align-items: center;
        justify-content: space-between;
        p{
          color: #ff191d;
          font-size: 0.3rem;
          font-weight: 700;
        }
      }
      .list-user-foot{
        width: 6.8rem;
        height: 0.52rem;
        line-height: 0.52rem;
        background: #f3f3f3;
        margin-left: 0.18rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-around;
        font-size: 0.22rem;
        .trian{
          width:0;
          height:0;
          border-width:0 0.2rem 0.2rem;
          border-style:solid;
          border-color:transparent transparent #f3f3f3;
          left: 0.78rem;
          top: -0.2rem;
          position:absolute;
        }
        .viewer{
          display: flex;
          align-items: center;
          justify-content: center;
          img{
            width: 0.16rem;
            height: 0.16rem;
            margin-right: 0.1rem;
          }
          span{
            color: #5785d9;
          }
        }
        .cover{
          display: flex;
          align-items: center;
          justify-content: center;
          img{
            width: 0.16rem;
            height: 0.16rem;
            margin-right: 0.1rem;
          }
          span{
            color: #5785d9;
          }
        }
        .detail{
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5785d9;
          img{
            width: 0.16rem;
            height: 0.16rem;
            margin-left: 0.1rem;
          }
        }
      }
    }
  }

</style>
