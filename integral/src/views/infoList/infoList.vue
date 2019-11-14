<!-- 消息列表组件 -->
<template>
  <div class="info-list-wrap" v-infinite-scroll="loadMoreData" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <div class="info-list-cen">
      <h3>
      <svg class="icon icon-xiaolaba2 va-m" aria-hidden="true">
        <use xlink:href="#icon-xiaolaba2"></use>
      </svg>
        消息通知
        <router-link to="/infoList" v-if="path==='/home'">
          <span class="info-list-cen-title-more">更多 》</span>
        </router-link>
      </h3>
      <table>
        <tr v-for="item in InfomationList">
          <td>{{item.content}}</td>
          <td>{{item.infoTime | customTime}}</td>
        </tr>
      </table>
    </div>
    <load-more tip="数据加载中" v-if="showLoading && path !== '/home'"></load-more>
    <!--无数据-->
    <no-data-component v-if="noData"></no-data-component>
  </div>
</template>
<script>
  import noDataComponent from './../public/noData'    // 暂无数据
  import { LoadMore } from 'vux'
  export default {
    components: {
      noDataComponent,
      LoadMore
    },
    props: {
      pageSize: {
        type: Number,
        default: 20
      }
    },
    data () {
      return {
        path: '', // url,用来判断是否显示更多
        showLoading: false,                // 是否显示加载loading
        busy: false,
        noData: false,                     // 是否有数据
        InfomationList: [],                // 消息列表
        start: 1,                          // 当前页
        // pageSize: 20,                      // 每页显示几条
        totalPage: 0                       // 总页数
      }
    },
    mounted: function () {
      this.getInfomationList()
      this.path = this.$route.path
    },
    methods: {
      /**
       * 获取消息列表
      */
      getInfomationList () {
        this.$http.post(this.api.getInfomationList, {
          start: this.start,
          pageSize: this.$route.path === '/home' ? 10 : this.pageSize
        }).then((res) => {
          let resData = res.data
          this.busy = false // 重置busy状态
          this.showLoading = false
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          this.noData = resData.data.list.length > 0 ? 0 : 1
          this.InfomationList = this.InfomationList.concat(resData.data.list)
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
        if (this.path !== '/home') {
          this.getInfomationList() // 分页数据
        }
      }
    }
  }
</script>
<style lang="less">
.info-list-wrap{
  width: 100%;
  padding: 0.3rem 0;
  /*background: #f2f2f2;*/

  .info-list-cen{
    width: 90%;
    margin: 0 auto;
    background: #fff;
    border-radius: 5px;
    .info-list-cen-title-more{
      font-size: 0.24rem;
      color: #666666;
      float: right;
      margin-right: 0.36rem;
    }
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

    table{
      width: 100%;
      border-top: 1px solid #eee;
      table-layout: fixed;
      tr{
        padding: 0 .2rem;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.25rem;
        border-bottom: 1px solid #eee;
        display: flex;

        td:nth-child(1){
          color: #666;
          padding-left: 0.3rem;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: .2rem;
        }

        td:last-child{
          color: #999;
          font-size: 0.2rem;
        }
      }
    }
  }
  .noData{
    text-align: center;
    padding: 1rem 0;
  }
}
</style>
