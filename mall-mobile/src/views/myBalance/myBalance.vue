<template>
  <div class="myBalance">
    <div class="myBalance-bg-box">
      <div class="myBalance-bg">
        <div class="myBalance-t">
          <div class="myBalance-flex">
            <div class="myBalance-flex-l"><img src='../../assets/images/points.png'></div>
            <div class="myBalance-flex-r">
              <div>我的余额</div>
              <div>{{accountMessage.balance}}元</div>
            </div>
          </div>
          <div class="myBalance-code">
            <div>
              <img src='../../assets/images/qrcode.png'>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--列表-->
    <div class="Profit">
      <div class="list-title">
        <h3>交易记录</h3>
      </div>
      <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
        <li v-for="item in walletData">
          <div>{{item.addSource | integralSourceFilter}}</div>
          <div>{{item.addTime | formatDate(0)}}</div>
          <div>{{item.propertyType | propertyTypeFilter}}</div>
          <div>{{item.propertyAmount}}</div>
        </li>
        <!--loading-->
        <load-more tip="数据加载中" v-if="showLoading"></load-more>
        <!--暂无数据-->
        <div class="noData" v-if="noData">暂无数据</div>
      </ul>
    </div>
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
        accountMessage: {},                   // 个人账户信息
        walletData: [],                       // 钱包
        busy: false,
        showLoading: false,                   // 是否显示加载loading
        noData: false,                         // 列表是否有数据
        start: 1,                             // 当前页数
        pageSize: 10,                         // 每页显示10条
        totalPage: 0                          // 总页数
      }
    },
    mounted: function () {
      this.getMemberPoints()                 // 余额及消费积分
      this.getMemberPointsDetailList()       // 我的钱包
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
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.accountMessage = resData.data
        })
      },
      /**
       * 获取我的钱包信息
      */
      getMemberPointsDetailList () {
        this.$http.post(`${this.api.getMemberPointsDetailList}`, {
          start: this.start,
          pageSize: this.pageSize,
          propertyType: 3 // 空查询全部 1:消费积分 3:金额
        }).then((res) => {
          let resData = res.data
          this.busy = false // 重置busy状态
          this.showLoading = false
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          // resData.data.list = resData.data.list.filter((row) => row.propertyAmount > 0)
          if (resData.data.list.length > 0) {
            resData.data.list.forEach((item) => {
              if (item.propertyAmount.toString().indexOf('-') > -1) {
                item.propertyAmount = item.propertyAmount
              } else {
                item.propertyAmount = '+' + item.propertyAmount
              }
            })
          }
          this.noData = resData.data.list.length > 0 ? !!false : !!true
          this.walletData = this.walletData.concat(resData.data.list)
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
          if (parseInt(this.start) > parseInt(this.totalPage)) {
            this.showLoading = false
            return
          }
        }
        this.getMemberPointsDetailList() // 分页数据
      }
    }
  }
</script>

<style scoped lang=less>
  .myBalance{
    background: #eee;
    padding-bottom: .5rem;
    box-sizing: border-box;
    @media screen and (orientation:portrait) {
      height: calc(100vh);
      overflow: hidden;
    }
    @media screen and (orientation:landscape) {
      min-height: calc(100vh);
    }
    .myBalance-bg-box{
      padding: .3rem .2rem;
      .myBalance-bg{
        width: 7.1rem;
        height: 3rem;
        margin: 0 auto;
        padding: .46rem .39rem;
        box-sizing:border-box;
        background: url('../../assets/images/my/my-alance-bg.png') no-repeat;
        background-size: 100% 100%;
        .myBalance-t{
          display: flex;
          .myBalance-flex{
            display:flex;
            flex: 1;
            .myBalance-flex-l{
              width: 1.16rem;
              height: .81rem;
              margin-right: .2rem;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .myBalance-flex-r{
              color: #fff;
              font-size: .4rem;
              div:nth-child(1){
                font-size:.24rem;
                margin-bottom: .1rem;
              }
            }
          }
          .myBalance-code{
            margin-top: .47rem;
            img{
              width: .95rem;
              height: .95rem;
              vertical-align: sub;
            }
            .vux-x-icon{
              fill: #fff;
            }
            div:nth-child(2) {
              color: #fff;
              font-size: .24rem;
              margin-top: .2rem;
            }
          }
        }
      }
    }
    /*-------------交易记录----------------*/
    .Profit{
      width: 95%;
      margin: 0 auto;
      top: -0.5rem;
      background: #fff;
      border-radius: 7px;
      margin-top: .2rem;
      @media screen and (orientation:portrait) {
        height:  calc(~"100vh - 4.5rem");
        overflow-y: scroll;
      }
      @media screen and (orientation:landscape) {
        min-height:  calc(~"100vh - 4.5rem");
      }
      .list-title{
          color: #333333;
          font-size: .26rem;
          height: .9rem;
          border-bottom: .02rem solid #ececec;
          h3{
            color: #333;
            font-size: 0.3rem;
            height: 0.9rem;
            line-height: 0.9rem;
            padding-left: 0.5rem;
            span{
              font-size: .26rem;
            }
          }
      }   
      ul {
        .noData{
          text-align: center;
          font-size: .28rem;
          padding: 1rem 0;
        }
        li{
          height: .88rem;
          display: flex;
          align-items: center;
          font-size: 0.26rem;
          border-bottom: .02rem solid #ececec;
          &:last-child{
            border-bottom:none;
          }
          div{
            flex: 1;
            text-align: center;
            color:#666666;
            font-size: .24rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 .05rem;
            &:nth-child(4){
              color: #c8a86c;
            }
          }
        }
      }
    }
  }

</style>