<template>
    <div class="comments">
      <div>
        <!--标题-->
        <ul class="typeTitle-box">
          <li @click="commentTap(0)" :class="{active: commentType == 0}">
            <span>全部({{commentsNum.totalNum}})</span>
          </li>
          <li @click="commentTap(1)" :class="{active: commentType == 1}">
            <span>好评({{commentsNum.goodNum}})</span>
          </li>
          <li @click="commentTap(2)" :class="{active: commentType == 2}">
            <span>中评({{commentsNum.commonNum}})</span>
          </li>
          <li @click="commentTap(3)" :class="{active: commentType == 3}">
            <span>差评({{commentsNum.badNum}})</span>
          </li>
        </ul>
        <!--内容-->
        <ol class="typeContent-box" v-if="noData == false && commentsList.length > 0">
          <li class="typeContent-li" v-for="(v,index) in commentsList">
            <!--姓名-评价-->
            <div class="nameFlower clr">
              <div class="left">{{ v.phone | filterPhone }}</div>
              <div class="right">
                <!-- <img src="../assets/images/my/c-flowers.png"> -->
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-haopingganxie"></use>
                </svg>
                <span>{{ v.commentType | commentsFilter}}</span>
              </div>
            </div>
            <!--时间-类型-->
            <div class="time-type">
              <span>{{v.createTime | formatDate(0)}}</span>
              <i>{{v.goodsAttribute}}</i>
            </div>
            <!--评论-->
            <p class="infor">{{v.commentContent}}</p>
            <!--图片-->
            <ul class="img-box clr">
              <li class="img-li" v-for="(item,index) in v.commentImage">
                <img :src="item | filterImgUrl" >
              </li>
            </ul>
          </li>
        </ol>
      </div>
      <load-more :tip="loadingTitle" v-if="showLoading"></load-more>
      <!--无数据-->
      <div class="noData" v-if="noData == true">暂无内容 </div>
    </div>
</template>

<script>
  // import noResult from '../components/NoResult'
  import { Rater, LoadMore } from 'vux'
  import Vue from 'vue'
  export default {
    components: {
      Rater,
      LoadMore
      // noResult
    },
    data () {
      return {
        commentType: 0,      // 评价等级
        loadingTitle: '数据加载中',
        showLoading: false, // 是否显示加载loading
        busy: false,
        commentsNum: {}, // 评论数量
        commentsList: [],     // 商品评价列表
        noData: false, // 是否有数据
        cover: false,  // 是否是点击
        start: 1, // 当前页
        pageSize: 5, // 每页显示几条
        totalPage: 0 // 总页数
      }
    },
    mounted: function () {
      this.goodsCommentsList() // 获取评价列表
      this.getCommentStatic() // 获取评价数
    },
    methods: {
      /**
       * 评价标签切换
      */
      commentTap (index) {
        this.start = 1
        this.cover = true
        this.showLoading = false
        this.commentType = index
        this.goodsCommentsList()
      },
      /**
       * 获取评价数量
      */
      getCommentStatic () {
        this.$http.get(`${this.api.getCommentStatic}`, {
          params: {
            goodsId: this.$route.query.goodsId
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            var totalNum = parseInt(resData.data.goodNum) + parseInt(resData.data.commonNum) + parseInt(resData.data.badNum) // 总数量
            Vue.set(resData.data, 'totalNum', totalNum)
            this.commentsNum = resData.data
          }
        })
      },
      /**
       * 商品评价列表
      */
      goodsCommentsList () {
        this.$http.post(`${this.api.getComment}`, {
          start: this.start,
          pageSize: this.pageSize,
          goodsId: this.$route.query.goodsId,
          commentType: this.commentType ? this.commentType : ''
        }).then((res) => {
          this.busy = false // 重置busy状态
          this.showLoading = false
          let resData = res.data
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          this.noData = resData.data.list.length > 0 ? 0 : 1
          resData.data.list.forEach((item) => {
            if (item.commentImage) {
              item.commentImage = item.commentImage.split(',')
            }
          })
          this.commentsList = this.cover ? resData.data.list : this.commentsList.concat(resData.data.list)
          this.start = this.start + 1 // 当前页数
          this.totalPage = resData.data.pages
        })
      },
      /**
       * 分页
      */
      loadMore () {
        this.cover = false
        this.busy = true // 加载状态
        if (!this.showLoading) {
          this.showLoading = true
          if (this.start > this.totalPage) {
            this.showLoading = false
            return
          }
        }
        this.goodsCommentsList() // 分页数据
      }
    }
  }
</script>

<style scoped lang=less>
    .noData{
      font-size: .28rem;
      text-align: center;
      margin-top: 1.5rem;
    }
    .comments {
      height: 100%;
      padding-bottom: 1rem;
      /*标题*/
      .typeTitle-box{
        background: #fff;
        display: flex;
        border-bottom: 1px solid #eee;
        li{
          flex: 1;
          text-align: center;
          overflow: hidden;
          padding:0.2rem 0;
          span{
            display: inline-block;
            border:1px solid #f19ea4;
            padding:0.05rem 0.2rem;
            border-radius: 0.3rem;
            font-size: .24rem;
            background: #fff3f3;
          }
          &.active{
            color: #f96967;
          }
        }
      }
      /*内容*/
      .typeContent-box{
        .typeContent-li{
          background: #fff;
          border-bottom: .2rem solid #eee;
          &:last-child{
            border-bottom: none;
          }
          /*姓名-评价*/
          .nameFlower{
            height: 0.6rem;
            padding:0.3rem 0.3rem 0 0.3rem;
            .left{
              float: left;
            }
            .right{
              float: right;
              position: relative;
              display: flex;
              svg{
                width: 0.4rem;
                height: .4rem;
                margin-right: .2rem;
                fill: #a88d53;
              }
              span{
                font-size: 0.24rem;
              }
            }
          }
          /*时间-类型*/
          .time-type{
            padding:0 0.3rem;
            color:#999;
            font-size: .24rem;
            i{
              margin-left: 0.3rem;
            }
          }
          /*评论*/
          .infor{
            padding:0 0.3rem;
            margin-top:0.2rem;
            margin-bottom: 0.2rem;
            line-height: 1.4em;
            font-size: .28rem;
          }
          /*图片*/
          .img-box{
            margin-left: 0.3rem;
            .img-li{
              float: left;
              margin-bottom:0.2rem;
              border:1px solid #eee;
              width: 1.5rem;
              height: 1.5rem;
              img{
                width: 1.5rem;
                height: 1.5rem;
              }
              margin-right: 0.3rem;
            }
          }
          .interval{
            height: 0.2rem;
            background: #eee;
          }
        }
      }
      /*没有数据*/
      .noData{
        padding-bottom: 2rem;
      }
    }
</style>
