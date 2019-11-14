<template>
  <div class="myCollect" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <!--列表-->
    <swipeout>
      <swipeout-item transition-mode="follow" v-for="(v,index) in collectList" :key="index">
        <div slot="right-menu">
          <swipeout-button @click.native="cancelCollection(v, index)" type="primary" :width="90">取消收藏</swipeout-button>
        </div>
        <!--内容-->
        <div slot="content" class="content" @click.stop="$router.push({path: '/goodDetail', query: { goodsId: v.goodsId }})">
          <template v-if="isData">
            <!--白色遮罩-->
            <div class="Mask" v-if="v.saleStatus==2 || v.delStatus==1 || v.totalStock == 0"></div>
            <div class="icon">
              <img :src="v.mainImage | filterImgUrl">
              <!--已下架-->
              <div class="soldOut" v-if="v.saleStatus==2">已下架</div>
              <div class="soldOut" v-else-if="v.delStatus==1">已删除</div>
              <div class="soldOut" v-else-if="v.totalStock==0">无货</div>
            </div>
            <div class="text" @click="$router.push({path: '/goodDetail', query: { goodsId: v.goodsId }})">
              <h2 class="infor">{{v.goodsName}}</h2>
              <p class="price">¥{{v.goodsMinPrice | moneyFilter}}</p>
            </div>
          </template>
        </div>
      </swipeout-item>
    </swipeout>
    <load-more :tip="loadingTitle" v-if="showLoading"></load-more>
    <!--没数据-->
    <div v-if="!isData" class="isData">收藏夹为空</div>

  </div>
</template>

<script>
  import { Swipeout, SwipeoutItem, SwipeoutButton, LoadMore } from 'vux'
  export default {
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      LoadMore
    },
    data () {
      return {
        loadingTitle: '数据加载中',
        showLoading: false, // 是否显示加载loading
        busy: false,
        collectList: [], // 商品列表
        isData: true, // 列表是否有数据
        start: 1, // 当前页
        pageSize: 15, // 每页显示几条
        totalPage: 0 // 总页数
      }
    },
    mounted: function () {
      this.getCollectList()
    },
    methods: {
      /**
       * 获取收藏列表
      */
      getCollectList () {
        this.$http.post(this.api.collectionList, {
          start: this.start,
          pageSize: this.pageSize
        }).then((res) => {
          this.busy = false // 重置busy状态
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK) || !res || !res.data || !res.data.data) {
            this.isData = false
            return false
          }
          this.isData = res.data.data.list.length > 0 ? 1 : 0
          this.collectList = this.collectList.concat(res.data.data.list)
          this.start = this.start + 1 // 当前页数
          this.totalPage = res.data.data.pages
        })
      },
      /**
       * 分页
      */
      loadMore () {
        // 防止重复请求
        this.busy = true // 加载状态
        this.showLoading = true
        if (this.start > this.totalPage) {
          this.showLoading = false
          return
        }
        this.getCollectList() // 分页数据
      },
      /**
       * 取消收藏
      */
      cancelCollection (v, index) {
        this.$http.post(this.api.cancelCollect, {
          goodsId: v.goodsId,
          shopId: ''
        }).then((res) => {
          if (res.data.status === this.api.ERR_OK) {
            this.collectList = []
            this.start = 1
            this.$vux.toast.text('取消收藏成功')
            this.getCollectList()
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
  .myCollect {
    /*搜索*/
    .search-wrap{
      border-bottom: 1px solid #eee;
    }
    .vux-swipeout-button-primary{
      background: #fe8c45;
    }
    /*商品列表*/
    .content{
      display: flex;
      box-sizing: border-box;
      align-items: center;
      padding: 0 0.2rem 0 0.2rem;
      position: relative;
      .icon{
        flex: 0 0 1.6rem;
        width: 1.6rem;
        padding-right: 0.2rem;
        position: relative;
        img{
          width: 1.6rem;
          height: 1.6rem;
        }
      }
      .text{
        flex: 1;
        height: 1.6rem;
        overflow: hidden;
        font-size: 0.28rem;
        border-bottom: 1px solid #eee;
        padding:0.2rem 0;
        position: relative;
      }
      .infor{
        margin-bottom: 0.1rem;
        color: #333;
        display: -webkit-box;
        display: -moz-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-size: .28rem;
        margin-top: .15rem;
      }
      .price{
        color: red;
        font-size:0.34rem;
        position: absolute;
        bottom: .2rem;
      }
      .Mask{
        position: absolute;
        width: 100%;
        height: 99%;
        left: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.5);
        z-index: 200;
        text-align: center;
        line-height: 1.5rem;
        color: #fff;
      }
      /*已下架、或无货*/
      .soldOut{
        position: absolute;
        width: 1rem;
        height: 1rem;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
        margin: auto;
        background: rgba(0, 0, 0, 0.6);
        z-index: 200;
        border-radius: 50%;
        color: #fff;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        font-size: .2rem;
      }
    }
    /*没有数据*/
    .isData{
      text-align: center;
      margin-top: 1rem;
    }
  }
</style>
