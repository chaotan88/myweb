<template>
  <div class="integral-box">
    <div class="integral-box-tit">您已获得<span>{{integral.bonusPoints}}</span>积分</div>
    <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="1" infinite-scroll-immediate-check="false">
      <li v-for="item in integralList" @click="loadMore">
        <div>
          <p>{{item.addSource}}</p>
          <p>{{item.addTime | formatDate(0)}}</p>
        </div>
        <div>+{{item.addBonusPoints}}</div>
      </li>
      <load-more :tip="loadingTitle" v-if="showLoading"></load-more>
    </ul>
    <!--没数据-->
    <div class="noData" v-if="noData">暂无积分</div>
  </div>
</template>
<script>
  import { LoadMore } from 'vux'
  export default {
    components: {
      LoadMore
    },
    data () {
      return {
        integral: '', // 总积分
        loadingTitle: '数据加载中',
        showLoading: false, // 是否显示加载loading
        busy: false,
        integralList: [], // 积分列表
        noData: false, // 列表是否有数据
        start: 1, // 当前页
        pageSize: 10, // 每页显示几条
        totalPage: 0 // 总页数
      }
    },
    mounted: function () {
      this.$vux.loading.show({
        text: '数据加载中'
      })
      this.getMemberPoints() // 获取总积分
      this.getIntegralList() // 获取积分列表
    },
    methods: {
      /**
       * 获取积分信息
      */
      getMemberPoints () {
        this.$http.get(`${this.api.getMemberPoints}`, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.integral = res.data.data
        })
      },
      /**
       * 获取积分列表
      */
      getIntegralList () {
        this.$http.post(this.api.getMemberPointsDetailList, {
          start: this.start,
          pageSize: this.pageSize,
          memberAccountId: 1
        }).then((res) => {
          this.busy = false // 重置busy状态
          this.$vux.loading.hide()
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = false
            return false
          }
          this.noData = res.data.data.list.length > 0 ? 0 : 1
          this.integralList = this.integralList.concat(res.data.data.list)
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
        this.getIntegralList() // 分页数据
      }
    }
  }
</script>
<style scoped lang=less>
.integral-box{
  width: 7.5rem;
  .integral-box-tit{
    height: .65rem;
    line-height: .65rem;
    background:#f9f9f9;
    border-bottom: 1px solid #e4e4e4;
    font-size: .26rem;
    padding: 0 .2rem;
    span{
      color: #f04448;
    }
  }
  ul{
    width: 7.5rem;
    height: calc(~"100vh - .65rem - 1px");
    overflow-y: scroll;
    li{
      display: -webkit-flex;
      align-items: center;
      border-bottom: 1px solid #e5e5e5;
      padding:.3rem .2rem;
      font-size: .26rem;
      div:nth-child(1){
        flex: 1;
        overflow: hidden;
        padding-right: .5rem;
        p{
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        p:nth-child(1){
          font-weight: bold;
          color: #5a5a5a;
          margin-bottom: .05rem;
        }
        p:nth-child(2){
          color: #919191;
        }
      }
      div:nth-child(2){
        color:#fd8e46;
      }
    }
  }
  /*没有数据*/
  .noData{
    text-align: center;
    margin-top: 1rem;
    font-size: .3rem;
  }
}
</style>

