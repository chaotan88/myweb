<template>
  <div>
    <div class="guess-like">
      <div class="guess-like-title" v-if="gussLikeTitle.isShow">
        <a :href="gussLikeTitle.advertPositionDetailList[0].link">
          <img :src="gussLikeTitle.advertPositionDetailList[0].image | filterImgUrl">
        </a>
      </div>
      <ul>
        <li v-for="(item, index) in gussLikeData" @click="$router.push({path:'/goodDetail', query: {goodsId: item.id}})">
          <div class="list-box">
            <div class="list-img">
              <img :src="item.mainImage | filterImgUrl" >
            </div>
            <div class="list-tit">{{item.goodsName}}</div>
            <div class="list-bot">
              <div>¥{{item.whetherSpecial && item.goodsSpecialPrice ? item.goodsSpecialPrice : item.goodsPrice}}</div>
              <div>去看看</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <loading tip="数据加载中" v-if="showLoading"></loading>
  </div>
</template>
<script>
  import { Rater, LoadMore } from 'vux'
  export default {
    components: {
      Rater,
      loading: LoadMore
    },
    data () {
      return {
        gussLikeTitle: [],             // 猜你喜欢主图
        gussLikeData: [],                // 猜你喜欢数据
        showLoading: false,              // 是否显示加载loading
        busy: false,
        start: 1,                        // 当前页
        pageSize: 10,                    // 每页显示几条
        totalPage: 0                     // 总页数
      }
    },
    mounted: function () {
      this.getAdvert()                  // 广告
      this.gussLike()                   // 猜你喜欢
    },
    methods: {
      /**
       * 获取广告
      */
      getAdvert () {
        this.$http.post(`${this.api.advertList}`, {
          start: 1,
          pageSize: 10,
          applicationTerminal: 1
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          if (resData.data.list.length > 0) {
            resData.data.list.forEach((item) => {
              if (item.putLocation === 9) {         // 猜你喜欢主图
                if (item.advertPositionDetailList && item.advertPositionDetailList.length > 0) {
                  this.gussLikeTitle = item
                }
              }
            })
          }
        })
      },
      /**
       * 猜你喜欢
      */
      gussLike () {
        this.$http.post(`${this.api.getGoodsListByClass}`, {
          whetherRecommend: 1,
          start: this.start,
          pageSize: this.pageSize
        }).then((res) => {
          this.busy = false        // 重置busy状态
          this.showLoading = false
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.gussLikeData = this.gussLikeData.concat(resData.data.list)
          this.start = this.start + 1              // 当前页数
          this.totalPage = resData.data.pages
        })
      },
      /**
       * 分页
      */
      loadMore () {
        this.busy = true // 加载状态
        if (!this.showLoading) {
          this.showLoading = true
          if (this.start > this.totalPage) {
            this.showLoading = false
            return
          }
        }
        this.gussLike() // 分页数据
      }
    }
  }
</script>
<style lang=less>
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
</style>