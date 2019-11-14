<!-- 我的钱包 -->
<template>
  <div class="my-earning" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <!-- 积分基本信息 -->
    <div class="integral-base" @click="$router.push({path: '/myPointsDetail', query: {id: 3}})">
      <!--<div>¥ {{accountMessage.balance}}</div>-->
      <!--<div>账户余额</div>-->
      <!--<img :src="walletBg + '?' + new Date().getTime()">-->
      <div class="asd">
        <div>账户余额</div>
        <div>¥ {{accountMessage.balance}}</div>
      </div>
    </div>
    <!-- 音频 -->
    <audio src="../../assets/images/wallet/jinbi.mp3" id="audio" autoplay></audio>
    <!-- 选项列表 -->
    <div class="option-list">
      <ul>
        <li @click="$router.push('/consumePoints')">
          <div>
            <img src="../../assets/images/tcsj/12_06.jpg">
          </div>
          <div>
            <p>消费积分</p>
            <p>{{accountMessage.bonusPoints | moneyFilter}}</p>
          </div>
        </li>
        <li @click="$router.push({path: '/myPointsDetail', query: {id: 2}})">
          <div>
            <img src="../../assets/images/tcsj/12_03.jpg">
          </div>
          <div>
            <p>通用积分</p>
            <p>{{accountMessage.cashPoints | moneyFilter}}</p>
          </div>
        </li>
        <!--<li @click="$router.push({path: '/myPointsDetail', query: {id: 6}})">-->
          <!--<div>-->
            <!--<img src="../../assets/images/wallet/wallet-icon2.png">-->
          <!--</div>-->
          <!--<div>-->
            <!--<p>联盟积分</p>-->
            <!--<p>{{accountMessage.leaguePoints}}</p>-->
          <!--</div>-->
        <!--</li>-->
        <li @click="$router.push({path: '/myPointsDetail', query: {id: 6}})">
          <div>
            <img src="../../assets/images/tcsj/lvbao_03.jpg">
          </div>
          <div>
            <p>绿宝</p>
            <p>{{accountMessage.leaguePoints | moneyFilter}}</p>
          </div>
        </li>
        <li @click="$router.push({path: '/myPointsDetail', query: {id: 5}})">
          <div>
            <img src="../../assets/images/tcsj/xindou_03.jpg">
          </div>
          <div>
            <p>芯豆</p>
            <p>{{accountMessage.goldPoints | moneyFilter}}</p>
          </div>
        </li>
      </ul>
    </div>
    <!-- 交易记录 -->
    <div class="Profit pos-r">
      <div class="list-title">
        <!-- <img src="../../assets/images/wallet/record.png"> -->
        <h3><img src="../../assets/images/tcsj/12_16.jpg">交易记录</h3>
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
        walletBg: require('../../assets/images/wallet/jinbi.png'),
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
      var audio = document.getElementById('audio')
      document.addEventListener('WeixinJSBridgeReady', function () {
        audio.play()
      }, false)
      // document.addEventListener('touchstart', function(e) {
      //   audio.play()
      // })
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
      /*height: 3rem;*/
      /*padding:.3rem;*/
      /*background: url('../../assets/images/wallet/wallet-bg.png') no-repeat;*/
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      .asd{
        width: 7rem;
        height: 3rem;
        margin: .2rem .3rem 0 .3rem;
        background: url('../../assets/images/wallet/jinbi.png') no-repeat;
        background-size: 100% 100%;
        div{
          color: #ffffff;
          &:nth-of-type(1) {
            margin-top: 0.4rem;
            margin-left: 0.4rem;
            font-size: 0.30rem;
          }
          &:nth-of-type(2) {
            margin-top: 0.3rem;
            margin-left: 0.4rem;
            font-size: 0.54rem;
          }
        }
      }
      /*div{*/
        /*position: relative;*/
        /*z-index: 300;*/
      /*}*/
      /*img{*/
        /*width: 100%;*/
        /*!* height: 2.27rem; *!*/
        /*position: absolute;*/
        /*top: 0;*/
        /*left: 0;*/
        /*margin-top: -.8rem;*/
        /*z-index: 200;*/
      /*}*/
      /*div:nth-child(1){*/
        /*color: #fff;*/
        /*font-size: .7rem;*/
      /*}*/
      /*div:nth-child(2){*/
        /*color: #fff;*/
        /*font-size: .28rem;*/
      /*}*/
    }
    .integral-base-bg{
      width: 100%;
      img{
        width: 100%;
      }
    }
    /* 选项列表 */
    .option-list{
      height: auto;
      overflow: hidden;
      padding: .1rem .2rem .2rem .2rem;
      ul{
        li{
          float: left;
          width: 3.5rem;
          display: flex;
          height: 1.2rem;
          align-items: center;
          background: #fff;
          /* box-shadow: 0 0 13px 0 rgba(154, 141, 141, 0.3);
          -webkit-box-shadow: 0 0 13px 0 rgba(154, 141, 141, 0.3); */
          margin: 0 auto;
          border-radius: 6px;
          margin-top: .1rem;
          margin-right: .09rem;
          &:nth-child(2n){
            margin-right: 0;
          }
          div:nth-child(1){
            width: .5rem;
            height: .5rem;
            margin-right: .28rem;
            margin-left: .4rem;
            img{
              width: 100%;
              height: 100%;
              /* border-radius: 50%; */
            };
          }
          div:nth-child(2){
            color: #363434;
            font-size: .28rem;
            flex:1;
            p:nth-child(1){
              font-size: .24rem;
              color: #666666;
            }
            p:nth-child(2){
              color: #333333;
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
      /* margin-top: .24rem; */
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
            display: flex;
            align-items: center;
            img{
              width: 0.44rem;
              height: 0.49rem;
            }
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
