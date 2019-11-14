<template>
    <div class="goodList">
      <!--搜索-->
      <template v-if="searchType == '1' || searchType == '3'">
        <serch-header @serchRightResult="serchRightResult" rightTxt="搜索" @inputTap="inputTap" @cleanVal="cleanVal" ref="serHead"></serch-header>
      </template>
      <div class="goodList-con" :style="{'padding-bottom': !showHistorySte ? '.2rem' : 0}">
        <history-data @serchRightResult="serchRightResult" v-if="showHistorySte"></history-data>
        <!--商品列表-列表显示-->
        <!-- <ul class="content-box"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false" v-if="this.searchType != 2">
          <li v-for="(v,index) in goodsList" @click="$router.push({path: '/goodDetail', query: { goodsId: v.id }})">
            <div class="icon">
              <img :src="v.mainImage | filterImgUrl">
            </div>
            <div class="text">
              <h2 class="infor">{{v.goodsName}}</h2>
              <p class="price">{{ v.goodsPrice | moneyFilter }}</p>
            </div>
          </li>
        </ul> -->
        <!--商品列表-大图显示-->
        <div v-show="!showHistorySte">
          <div class="list-banner" v-if="searchType == 2 && goodsList.length > 0 && CoumnBanner && CoumnBanner != 'null'">
            <img :src="CoumnBanner | filterImgUrl">
          </div>
          <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
            <div class='list-box' v-if="!isData && goodsList.length > 0">
              <ul class='list'>
                <li class='list-lis' v-for="(v,index) in goodsList">
                  <router-link :to="{path:'/goodDetail',query: {goodsId: v.id}}">
                    <div class="list-img">
                      <img :src="v.mainImage | filterImgUrl">
                    </div>
                    <div class='list-tit'>{{v.goodsName}}</div>
                    <div class='list-bot'>
                      <div class='list-bot-lef'>
                        <div>¥{{v.whetherSpecial && v.goodsSpecialPrice ? v.goodsSpecialPrice : v.goodsPrice | moneyFilter}}
                        </div>
                      </div>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <load-more :tip="loadingTitle" v-if="showLoading"></load-more>
          <!--没有数据-->
          <div v-if="isData" class="isData">没有数据</div>
        </div>
      </div>
    </div>
</template>

<script>
  import serchHeader from '../../components/serchHeader'   // 搜索
  import historyData from '../../components/historyData'   // 历史记录
  import { LoadMore } from 'vux'
  export default {
    components: {
      serchHeader,
      historyData,
      LoadMore
    },
    data () {
      return {
        goodsName: '',                            // 搜索关键字
        CoumnBanner: '',                          // 栏目主图
        searchType: '',                           // 搜索类型
        loadingTitle: '数据加载中',
        showLoading: false,                       // 是否显示加载loading
        goodsList: [],                            // 商品列表
        isData: false,                            // 是否有数据
        busy: false,
        start: 1,                                 // 当前页
        pageSize: 10,                             // 每页显示几条
        totalPage: 0,                             // 总页数
        showHistorySte: false                     // 是否显示历史记录
      }
    },
    mounted: function () {
      this.$vux.loading.show({
        text: '数据加载中'
      })
      this.goodsName = this.$route.query.goodsName
      if (localStorage.getItem('CoumnBanner')) {
        this.CoumnBanner = localStorage.getItem('CoumnBanner')        // 栏目主图
      }
      this.searchType = this.$route.query.searchType                  // 搜索列表的类型
      if (parseInt(this.searchType) === 2) {
        document.querySelector('.goodList-con').classList.add('noFor')
      }
      this.getGoodsListData()
    },
    methods: {
      /**
      /**
       * 搜索结果跳转
      */
      serchRightResult (val) {
        this.goodsName = val
        this.goodsList = []
        this.start = 1
        if (this.$route.query.goodsName === val) {
          this.showLoading = false
          this.$refs.serHead.setSerchTxt()
        } else {
          this.routerReplace({name: 'goodList', query: {searchType: 1, goodsName: val}})
        }
        this.showHistorySte = false
        document.querySelector('#foot-wrap').style.display = 'block'
        document.querySelector('.goodList-con').classList.remove('noFor')
        this.getGoodsListData()
      },
      /**
       * inputTap
      */
      inputTap () {
        this.showHistorySte = true
        document.querySelector('.goodList-con').classList.add('noFor')
        document.querySelector('#foot-wrap').style.display = 'none'
      },
      /**
       * inputTap
      */
      cleanVal () {
        this.showHistorySte = true
        document.querySelector('.goodList-con').classList.add('noFor')
        document.querySelector('#foot-wrap').style.display = 'none'
      },
      /**
       * 获取商品列表
       * @searchType 1 公共搜索 2 首页栏目点击捡进来 3 分类中小类点击进来
      */
      getGoodsListData () {
        var parmer = {} // 参数
        var resUrl = '' // 请求的地址
        if (parseInt(this.searchType) === 1) { // 公共搜索点击
          resUrl = this.api.getGoodsListBySerch
          parmer = {
            start: this.start,
            pageSize: this.pageSize,
            goodsName: this.goodsName
          }
        } if (parseInt(this.searchType) === 2) { // 首页栏目点击
          resUrl = this.api.getGoodsListByColumn
          parmer = {
            start: this.start,
            pageSize: this.pageSize,
            columnId: this.$route.query.columnId
          }
        } if (parseInt(this.searchType) === 3) { // 分类中点击
          resUrl = this.api.getGoodsListByClass
          parmer = {
            start: this.start,
            pageSize: this.pageSize,
            platformTypeId: this.$route.query.goodTypeId,
            goodsTypeAttriSearchReq: []
          }
        }
        this.$http.post(resUrl, parmer).then((res) => {
          this.busy = false // 重置busy状态
          this.$vux.loading.hide()
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.isData = true
            return false
          }
          this.isData = res.data.data.list.length > 0 ? 0 : 1
          this.goodsList = this.goodsList.concat(res.data.data.list)
          this.start = this.start + 1 // 当前页数
          this.totalPage = res.data.data.pages
        }).finally(() => {
          this.$vux.loading.hide()
        })
      },
      /**
       * 分页
      */
      loadMore () {
        // this.busy = true // 加载状态
        this.showLoading = true
        if (this.start > this.totalPage) {
          this.showLoading = false
          return
        }
        this.getGoodsListData() // 分页数据
      }
    },
    beforeRouteEnter (to, from, next) {
      if (parseInt(to.query.searchType) === 2) {
        to.meta.title = localStorage.getItem('navCoumnName')
      } else {
        to.meta.title = '商品列表'
      }
      next()
    }
  }
</script>

<style scoped lang=less>
    .goodList {
      /* min-height: calc(100vh);
      overflow-y: auto;
      background: #f1f2f6; */
      /* min-height:calc(~"100vh"); */
      width: 7.5rem;
      /* background: #f1f2f6;
      min-height:calc(~"100vh"); */
      /* padding: .2rem 0; */
      box-sizing: border-box;
      /* overflow: hidden; */
      .goodList-con{
        width: 7.5rem;
        /* position: absolute;
        top: 1rem;
        bottom: .88rem;
        margin: auto; */
        background: #f1f2f6;
        padding: .2rem 0;
        min-height:calc(~"100vh - 1rem - 0.88rem - 1px");
        box-sizing: border-box;
        /* overflow-y: scroll; */
        &.noFor{
          min-height:calc(~"100vh - 1rem - 1px");
          background: none;
          bottom: 0;
        }
      }
      /*商品列表*/
      .content-box{
        li{
          height: 1.99rem;
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 0.3rem;
          .icon{
            flex: 0 0 1.6rem;
            width: 1.6rem;
            padding-right: 0.2rem;
            height: 1.6rem;
            img{
              width: 1.6rem;
              height: 1.6rem;
            }
          }

          .text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            overflow: hidden;
            font-size: 0.28rem;
            border-bottom: 1px solid #eee;
            height: 100%;
            overflow: hidden;
          }

          .infor{
            margin-bottom: 0.3rem;
            color: #333333;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: .28rem;
          }

          .price{
            color: #f23030;
            font-size:0.34rem;
          }

        }
      }
      /**大图样式**/
      .list-banner{
        padding: 0 .2rem;
        width: 7.1rem;
        height: 2.29rem;
        margin: 0 auto;
        margin-bottom: .23rem;
        img{
          width: 100%;
          height: 100%;
          border-radius: 7px;
        }
      }
      .list-box{
        /* height: 100%; */
        background:#f1f2f6;
        padding-bottom: .5rem;
      }
      .list{
        padding:0 .2rem;
        height: 100%;
        overflow: hidden;
        /* padding-bottom: .4rem; */
      .list-lis{
        width: 3.53rem;
        height: 5.38rem;
        overflow: hidden;
        margin-right: .04rem;
        float: left;
        margin-bottom: .04rem;
        box-sizing: border-box;
        border-radius:7px;
        position: relative;
        background:#fff;
        a{
          display: block;
          height: 100%;
        }
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
          bottom: .23rem;
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
      /*没有数据*/
      .isData{
        text-align: center;
        margin-top: 1rem;
      }
    }
</style>
