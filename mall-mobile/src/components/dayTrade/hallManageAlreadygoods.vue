<template>
  <div>
    <div class="hallManage-alreadyGoods"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
      <div class="all-sold" v-for="(item, index) in listData" :key="index" v-if="listData.length > 0">
        <div class="sold-left">已提货</div>
        <div class="sold-right">
          <div class="sold-r-top">
            <span>{{item.hangAutoCarrySellTime | publicTimeNew}}</span>
            <span>提货成功</span>
          </div>
          <div class="sold-r-bot">
          </div>
        </div>
      </div>
      <div v-if="listData.length === 0" style="margin-top: 2.2rem;text-align: center;">
        <img src="../../assets/images/maker/noOrder.png" style="width: 4rem;height: 3.5rem;"/>
        <p>暂无相关订单</p>
      </div>
      <load-more tip="数据加载中" v-if="showLoading"></load-more>
    </div>
  </div>
</template>

<script>
  import {Loading, LoadMore} from 'vux'
  export default {
    name: 'hallManageAlreadygoods',
    data () {
      return {
        listData: [],
        busy: false,
        showLoading: false,                   // 是否显示加载loading
        noData: false,                         // 列表是否有数据
        start: 1,                             // 当前页数
        pageSize: 10,                         // 每页显示10条
        totalPage: 0                          // 总页数
      }
    },
    watch: {
    },
    methods: {
      loadMore () {
        this.busy = true // 加载状态
        if (!this.showLoading) {
          this.showLoading = true
          if (parseInt(this.start) > parseInt(this.totalPage)) {
            this.showLoading = false
            return
          }
        }
        console.log('分頁')
        this.start = this.start + 1 // 当前页数
        this.goodsHangPage() // 分页数据
      },
      /**
       * 获取挂售管理列表
       * hangType(1：全部 2:等待挂售 3:已挂售 4:已售出 5:等待提货 6:已提货)
       */
      goodsHangPage () {
        this.$vux.loading.show({
          text: 'Loading'
        })
        this.$http.post(`${this.api.goodsHangPage}`, {
//        this.$http.get('/src/assets/js/tsconfig.json', {
          start: this.start,
          pageSize: this.pageSize,
          goodsId: this.$route.query.goodsId,
          hangType: 6
        }).then((res) => {
          let resData = res.data
          this.$vux.loading.hide()
          this.busy = false // 重置busy状态
          this.showLoading = false
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          if (resData.status === '1') {
            // 数据渲染
            this.noData = resData.data.list.length > 0 ? !!false : !!true
            this.listData = this.listData.concat(resData.data.list)
            this.totalPage = Math.ceil(resData.data.total / resData.data.pageSize)
          }
        })
      }
    },
    mounted: function () {
      this.goodsHangPage()
    },
    created () {
    },
    components: {
      LoadMore,
      Loading
    }
  }
</script>

<style lang="less" scoped>
  .hallManage-alreadyGoods{
    padding: 0.2rem;
    .all-sold{
      background: #fff;
      -webkit-border-radius: 0.2rem;
      -moz-border-radius: 0.2rem;
      border-radius: 0.2rem;
      padding: 0.28rem 0.2rem;
      display: flex;
      justify-content: space-around;
      margin-top: 0.24rem;
      align-items: center;
      .sold-left{
        width: 1.68rem;
        height: 0.86rem;
        line-height: 0.86rem;
        font-size: 0.3rem;
        background: linear-gradient(to bottom,#b27e61 , #dbb093);
        text-align: center;
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
        color: #fff;
      }
      .sold-right{
        color: #a56341;
        .sold-r-top{

        }
        .sold-r-bot{
        }
      }
    }
  }
</style>
