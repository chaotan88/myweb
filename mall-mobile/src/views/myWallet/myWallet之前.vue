<!-- 我的钱包 -->
<template>
  <div class="my-earning" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <!-- 积分基本信息 -->
    <div class="integral-base">
      <div class="base-price">
        <div class="base-price-icon">
          <img src="../../assets/images/wallet/balance.png">
        </div>
        <div class="base-price-num" @click="$router.push('/myBalance')">
          <p><i>¥ </i>{{accountMessage.balance}}</p>
          <p>我的余额(元)</p>
        </div>
      </div>
      <div class="base-points">
        <ul>
          <li @click="$router.push('/myPoints')">
            <p>{{accountMessage.bonusPoints}}</p>
            <p>消费积分(个)</p>
          </li>  
          <li @click="$router.push('/serviceIntegral')">
            <p>{{accountMessage.servicePoints}}</p>
            <p>服务积分(个)</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="integral-base-bg">
      <img src="../../assets/images/wallet/wallet-ban-bg.png">
    </div>
    <!-- 选项列表 -->
    <div class="option-list">
      <ul>
        <li @click="$router.push('/recommendPrize')">
          <div>
            <img src="../../assets/images/wallet/invitation.png">
          </div>
          <div>邀请好友享佣金</div>
          <div>推荐有奖</div>
        </li>
        <li @click="goTickets">
          <div>
            <img src="../../assets/images/wallet/society-tickets.png">
          </div>
          <div>会务购票享特服</div>
          <div>会场购票</div>
        </li>
      </ul>
    </div> 
    <!-- 交易记录 -->
    <div class="Profit pos-r">
      <div class="list-title">
        <img src="../../assets/images/wallet/record.png">
        <h3>交易记录</h3>
      </div>
      <ul>
        <li v-for="item in walletData">
          <div>{{item.addSource | integralSourceFilter}}</div>
          <div>{{item.addTime | formatDate(0)}}</div>
          <div>{{item.propertyType | propertyTypeFilter}}</div>
          <div>{{item.propertyAmount}}</div>
        </li>
      </ul>
      <!--暂无数据-->
      <div class="noData" v-if="noData">暂无数据</div>
    </div>
    <!--loading-->
    <load-more tip="数据加载中" v-if="showLoading"></load-more>
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
      },
      /**
       * 跳转购票页面
      */
      goTickets () {
        localStorage.setItem('ticketTabSte', 1)
        this.$router.push({path: '/ticketPurchase'})
      }
    }
  }
</script>
<style scoped lang=less>
  .my-earning{
    background: #eee;
    padding-bottom: 0.3rem;
    min-height: calc(100vh);
    box-sizing: border-box;
    /* padding-bottom: .3rem; */
    /* 基本信息 */
    .integral-base{
      padding: .45rem .3rem 0 .3rem;
      background: -webkit-linear-gradient(top, #ff5d62, #ff7c5a);
      .base-price{
        display: flex;
        justify-content: center;
        align-items: center;
        .base-price-icon{
          width: 1.11rem;
          height: 1.11rem;
          margin-right: .24rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .base-price-num{
          p{
            color: #fff;
            &:nth-child(1) {
              font-size: .4rem;
              i{
                font-size: .24rem;
              }
            }
            &:nth-child(2){
              font-size: .28rem;
            }
          }
        }
      }
      .base-points{
        margin-top: .45rem;
        padding-bottom: .24rem;
        ul{
          display: flex;
          li{
            flex: 1;
            text-align: center;
            &:nth-child(1){
              border-right: 1px solid #fff;
            }
            p:nth-child(1){
              font-size: .4rem;
              color: #fff;
            }      
            p:nth-child(2){
              font-size: .2rem;
              color: #fff;              
            }       
          }
        }
      }
    }
    .integral-base-bg{
      width: 100%;
      img{
        width: 100%;
      }
    }
    /* 选项列表 */
    .option-list{
      ul{
        li{
          width: 6.58rem;
          display: flex;
          height: 1.5rem;
          align-items: center;
          background: #fff;
          box-shadow: 0 0 13px 0 rgba(154, 141, 141, 0.3);
          -webkit-box-shadow: 0 0 13px 0 rgba(154, 141, 141, 0.3);
          margin: 0 auto;
          border-radius: 4px;
          margin-top: .21rem;
          padding: 0 .24rem;
          div:nth-child(1){
            width: .97rem;
            height: .97rem;
            margin-right: .28rem;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
            };
          }
          div:nth-child(2){
            color: #363434;
            font-size: .28rem;   
            flex:1;         
          }
          div:nth-child(3){
            width: 1.5rem;
            height: .54rem;
            text-align: center;
            line-height: .54rem;
            border-radius: 30px;
            font-size: .28rem;
          }
          &:nth-child(1){
            div:nth-child(3){
              border: .04rem solid #ff5465;
              background: linear-gradient(to right, #fd6e7e, #f88269);
              -webkit-background-clip: text;
              color: transparent;
            }
          }
          &:nth-child(2){
            div:nth-child(3){
              border: .04rem solid #fe9f41;
              background: linear-gradient(to right, #fe9f41, #fdbf39);
              -webkit-background-clip: text;
              color: transparent;
            }
          }
        }
      }
    }

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
      min-height: 4rem;
      overflow-y: hidden;
      background: #fff;
      border-radius: 9px;
      margin:0 auto;
      margin-top: .24rem;
      position: relative;
      .noData{
        text-align: center;
        font-size: .28rem;
        margin-top: 20%;
      }
      .list-title{
          color: #333333;
          font-size: .26rem;
          height: .9rem;
          border-bottom: .02rem solid #ececec;
          display: flex;
          align-items: center;
          padding: 0 .24rem;
          img{
            width: .47rem;
            height: .45rem;
            margin-right: .17rem;
          }
          h3{
            color: #333;
            font-size: 0.3rem;
            height: 0.9rem;
            line-height: 0.9rem;
            span{
              font-size: .26rem;
            }
          }
        }     
      ul {
        width: 100%;
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