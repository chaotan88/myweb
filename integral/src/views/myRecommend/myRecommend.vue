<!-- 我的推荐 -->
<template>
  <div class="my-recommend-wrap">
    <div class="my-recommend-cen pos-r">
      <div class="my-recommend-data pos-a">
        <h3 class="ta-c">{{totalNum || 0}}<span>人</span></h3>
        <h4 class="ta-c fw-n">累计推荐总人数</h4>
      </div>
      <span class="pos-a ta-c id-num">我的ID号：{{userInfo.invicationCode | filterEmpty}}</span>
    </div>
    <!-- 消息通知 -->
     <!-- <statistics-component></statistics-component> -->

     <!-- 我的推荐 -->
    <div class="info-list-wrap">
      <div class="info-list-cen">
        <h3>
          <svg class="icon icon-zan1 va-m" aria-hidden="true">
            <use xlink:href="#icon-zan1"></use>
          </svg>
          我的推荐
        </h3>
        <ul v-infinite-scroll="loadMoreData" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
          <li v-for="item in listData">
            <div>您在{{item.recommendTime | formatDate}}推荐了{{item.recommendCardName ? item.recommendCardName : item.recommendPhone}}</div>
            <div>{{item.recommendTime | formatDate}}</div>
          </li>
          <load-more tip="数据加载中" v-if="showLoading"></load-more>
        </ul>
        <!--无数据-->
        <no-data-component v-if="noData"></no-data-component>
      </div>
    </div>
  </div>
</template>

<script>
import noDataComponent from './../public/noData'    // 暂无数据
import StatisticsComponent from '../infoList/infoList'
import { LoadMore } from 'vux'
export default{
  components: {StatisticsComponent, noDataComponent, LoadMore},
  data () {
    return {
      // statisticsData: {},   // 统一数据
      listData: [],         // 列表数据
      showLoading: false,   // 是否显示加载loading
      busy: false,
      noData: false,        // 是否有数据
      InfomationList: [],   // 消息列表
      start: 1,             // 当前页
      pageSize: 20,         // 每页显示几条
      totalPage: 0,         // 总页数
      totalNum: '',         // 总人数
      pageData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {}          // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('integralUserInfo'))
    // this.getRecommendNumber()
    this.getListData()
  },

  methods: {
    /**
     * 累计统计
     */
    getRecommendNumber () {
      this.$http.post(this.baseUrl + 'points/profit/getProFitTotal').then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$vux.toast.text(resData.msg)
          return false
        }
        this.statisticsData = resData.data
      })
    },

    /**
     * 获取列表数据
     */
    getListData () {
      this.$http.post(this.baseUrl + 'points/recommend/getRecommendRelationList', {
        start: this.start,
        pageSize: this.pageData.pageSize
      }).then((res) => {
        let resData = res.data
        this.busy = false // 重置busy状态
        this.showLoading = false
        if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
          this.noData = true
          return false
        }
        this.totalNum = resData.data.total
        this.noData = resData.data.list.length > 0 ? 0 : 1
        this.listData = this.listData.concat(resData.data.list)
        this.start = this.start + 1 // 当前页数
        this.totalPage = resData.data.pages
      })
    },
    /**
     * 分页
    */
    loadMoreData () {
      this.busy = true // 加载状态
      if (!this.showLoading) {
        this.showLoading = true
        if (this.start > this.totalPage) {
          this.showLoading = false
          return
        }
      }
      this.getListData() // 分页数据
    }
  }
}
</script>

<style lang="less">
.my-recommend-wrap{
  .my-recommend-cen{
    width: 100%;
    height: 3.5rem;
    background: url(../../assets/images/my-recommend-bg.png) no-repeat;
    background-size: cover;

    .my-recommend-data{
      width: 5.3rem;
      height: 2.3rem;
      left: 0;
      right: 0;
      margin: 0 auto;
      bottom: 0.8rem;
      background: url(../../assets/images/my-recommend-cen.png) no-repeat;
      background-size: 100%;

      h3{
        color: #fff;
        font-size: 0.42rem;
        padding-top: 0.5rem;

        span{
          font-size: 0.24rem;
        }
      }

      h4{
        color: #dce3fe;
        font-size: 0.24rem;
      }
    }

    .id-num{
      color: #dce3fd;
      /*width: 2.6rem;*/
      height: 0.4rem;
      font-size: 0.24rem;
      line-height: 0.4rem;
      padding: 0 .3rem;
      right: 0;
      bottom: 0.15rem;
      background: #5c7bf5;
      border-radius: .3rem 0 0 .3rem;
    }
  }

  /*--------------------------我的推荐-----------------------*/
  .info-list-wrap{
    width: 100%;
    padding: 0.3rem 0;
    /*background: #f2f2f2;*/

    .info-list-cen{
      width: 95%;
      height: calc(~"100vh - 4.25rem");
      overflow-y: scroll;
      margin: 0 auto;
      background: #fff;
      border-radius:7px;
      -webkit-box-shadow: 0 0 20px 0 hsla(0,6%,58%,0.3);
      position: relative;
      h3{
        color: #333333;
        height: 0.9rem;
        line-height: 0.9rem;
        padding-left: 0.3rem;
        font-size: 0.3rem;

        .icon{
          fill: #f99946;
          width: 0.4rem;
          height: 0.4rem;
          margin-top: -0.1rem
        }
      }
      ul{
        width: 100%;
        border-top: 1px solid #eee;
        position: absolute;
        top: .9rem;
        bottom: 0;
        overflow-y: scroll;
        
        li{
          height: 0.8rem;
          line-height: 0.8rem;
          font-size: 0.25rem;
          border-bottom: 1px solid #eee;
          display: flex;
          padding:  0 .2rem;

          div:nth-child(1){
            color: #666;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: .2rem;
          }

          div:last-child{
            color: #999;
            font-size: 0.2rem;
          }
        }
      }
    }
  }

  .no-data-wrap{
    color: #999;
    padding: 1rem 0;
  }
}
</style>
