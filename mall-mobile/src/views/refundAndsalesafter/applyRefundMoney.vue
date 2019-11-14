<template>
  <div class="applyRefundMoney" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="1" infinite-scroll-immediate-check="false">
    <!--内容-->
    <ol class="content-wrap" v-for="(v,index) in orderList">
        <li class="content-li">
          <!--订单编号-->
          <ul class="orderNo clr">
            <li class="left">订单号：{{ v.orderNo }}</li>
            <li class="right">下单时间：{{ v.orderTime }}</li>
          </ul>
          <!--列表-->
          <div class="content-box">
            <div class="content-food">
              <div class="icon">
                <img :src="v.goodsImage | filterImgUrl">
              </div>
              <div class="text">
                <h2 class="infor">{{ v.goodsName }}</h2>
                <div class="attribute">{{ v.goodsAttribute }}</div>
                <p class="priceNum">
                  <span class="price">价格：¥{{ v.goodsPrice | moneyFilter }}</span>
                  <span class="count">数量：{{ v.goodsNum }}</span>
                </p>
              </div>
            </div>
          </div>
          <!--按钮-->
          <ul class="btn clr">
            <li class="pay" @click="applyRefund(v)">申请退款</li>
          </ul>
        </li>
    </ol>
    <load-more :tip="loadingTitle" v-if="showLoading"></load-more>
    <!--没有数据-->
    <div v-if="isData" class="isData">没有数据</div>
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
        loadingTitle: '数据加载中',
        showLoading: false, // 是否显示加载loading
        busy: false,
        orderList: [], // 列表
        isData: false,  // 是否有数据
        start: 1, // 当前页
        pageSize: 10 // 每页显示几条
      }
    },
    mounted: function () {
      this.$vux.loading.show({
        text: '数据加载中'
      })
      this.getCanRefundOrderList()
    },
    methods: {
      /**
       * 申请退款列表
      */
      getCanRefundOrderList () {
        this.$http.post(this.api.getCanRefundOrderList, {
          start: this.start,
          pageSize: this.pageSize,
          customerId: JSON.parse(localStorage.getItem('bsbUserInfo')).userId || ''
        }).then((res) => {
          this.busy = false // 重置busy状态
          this.$vux.loading.hide()
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.isData = true
            return false
          }
          this.orderList = this.orderList.concat(res.data.data.list)
          this.isData = res.data.data.list.length > 0 ? 0 : 1
          this.start = this.start + 1 // 当前页数
          this.totalPage = res.data.data.pages // 总页数
        })
      },
      /**
       * 申请退款
      */
      applyRefund (v) {
        localStorage.setItem('applyRefund', JSON.stringify(v)) // 存储退款订单信息
        this.$router.push({name: 'applyRefundMoneySubmit'})
      },
      /**
       * 分页
      */
      loadMore () {
        this.busy = true // 加载状态
        this.showLoading = true
        if (this.start > this.totalPage) {
          this.showLoading = false
          return
        }
        this.getCanRefundOrderList() // 分页数据
      }
    }
  }
</script>

<style scoped lang=less>
  .applyRefundMoney {
    height: calc(100vh);
    background: #eee;
    overflow-y: scroll;
    .content-wrap{
      background: #fff;
      .content-li{
        margin-top:0.2rem;
        &:first-child{
          margin-top: 0;
        }
        /*订单编号*/
        .orderNo{
          height: 0.8rem;
          line-height: 0.8rem;
          border-bottom: 1px solid #eee;
          padding:0 0.3rem;
          color:#999;
          font-size:0.24rem;
          display: flex;
          justify-content: space-between;
          li{
            flex:1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .left{
            text-align: left;
          }
          .right{
            margin-left:0.15rem;
            text-align: right;
          }
        }
        /*列表*/
        .content-box{
          padding-left: 0.3rem;
          margin-top:0.2rem;
          margin-bottom: 0.1rem;
          .content-food{
            display: flex;
            box-sizing: border-box;
            align-items: center;
            padding: 0 0.3rem 0 0rem;
            .icon{
              flex: 0 0 1.6rem;
              width: 1.6rem;
              padding-right: 0.2rem;
              img{
                width: 1.6rem;
                height: 1.6rem;
              }
            }

            .text{
              display: flex;
              flex-direction: column;
              justify-content: center;
              flex: 1;
              line-height: 1.6em;
              overflow: hidden;
              font-size: 0.28rem;
              padding:0.2rem 0;
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
            }
            .attribute{
              font-size: .24rem;
              color: #999999;
              margin-top: .05rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .priceNum{
              color:#999;
              .count{
                margin-left:0.2rem;
              }
            }
          }
        }
        /*按钮*/
        .btn{
          li{
            float: right;
            width:1.6rem;
            height: 0.6rem;
            text-align: center;
            line-height: 0.6rem;
            font-size: 0.24rem;
            border-radius: 0.1rem;
            margin: 0.1rem 0.3rem 0.2rem 0;
          }
          .cancelOrder{
            border:1px solid #eee;
          }
          .pay{
            border:1px solid #f23030;
            color:#f23030;
          }
          .cancelPay{
            border:1px solid #999;
            color:#999;
          }

        }
      }
    }
    .isData{
      text-align: center;
      padding-top:1rem;
    }
  }
</style>
