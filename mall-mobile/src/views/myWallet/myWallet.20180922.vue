<!-- 我的钱包 -->
<template>
  <div class="my-earning">

    <!-- 积分 -->
    <div class="Integral pos-r">
      <dl class="pos-r">
        <dt class="ta-c" @click="$router.push('/myBalance')">
          <h3><span>¥ </span>{{accountMessage.balance}}</h3>
          <h4>
            <!-- <svg class="icon icon-yue va-m" aria-hidden="true">
              <use xlink:href="#icon-yue"></use>
            </svg> -->
            我的余额
          </h4>
        </dt>
        <dd class="ta-c" @click="$router.push('/myPoints')">
          <h3>{{accountMessage.bonusPoints}}<span> 个</span></h3>
          <h4>
            <!-- <svg class="icon icon-jifen va-m" aria-hidden="true">
              <use xlink:href="#icon-jifen"></use>
            </svg> -->
            消费积分
          </h4>
        </dd>
      </dl>
    </div>

    <!-- 交易记录 -->
    <div class="Profit pos-r">
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
          propertyType: '' // 空查询全部 1:消费积分 3:金额
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
  .my-earning{
    background: #eee;
    padding-bottom: 0.3rem;
    height: calc(100vh);
    overflow: hidden;
    box-sizing: border-box;

    /*------------头部积分样式-------------*/
    .Integral{
      width: 100%;
      height: 2.83rem;
      background: url(../../assets/images/my/myWallet-bg.png) no-repeat;
      background-size: cover;
      padding-top: .6rem;
      box-sizing: border-box;
     
      dl{
        display: flex;
        align-items: center;
        justify-content: center;
        h3{
          color: #fff;
          font-weight: bold;
          /* letter-spacing:2px; */
          font-size: 0.42rem;
          margin-bottom: .05rem;

          span{
            font-size: 0.23rem;
          }
        }
        h4{
          color: rgba(255,255,255,0.79);
          font-size: 0.24rem;

          .icon{
            fill: #fff;
            width: 0.5rem;
            height: 0.5rem;
          }
        }
        dt{
          flex:1;
          left:0;
          border-right: 1px solid #f9a286;
          text-align: center;
        }

        dd{
          flex: 1;
          text-align: center;
        }

      }
    }

    /*-------------交易记录----------------*/
    .Profit{
      width: 95%;
      height: 73%;
      overflow-y: hidden;
      background: #fff;
      border-radius: 9px;
      margin:0 auto;
      margin-top: -.7rem;
      position: relative;
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
        width: 100%;
        position: absolute;
        top: .9rem;
        bottom: 0;
        overflow-y: scroll;
        .noData{
          text-align: center;
          font-size: .28rem;
          margin-top: 20%;
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