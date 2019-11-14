<template>
  <div class="orderDetail">
    <!--订单倒计时-->
    <div class="orderCountDown" v-if="orderDetailData.orderStatus === 1">
      <div>
        <p>等待买家付款</p>
        <p>
          剩{{countDownTxt}}自动关闭订单</p>
      </div>
      <div>
        <img src="../../assets/images/my/orderCountDown.png">
      </div>
    </div>
    <!--用户基本信息-->
    <ul class="userInfor-box">
      <li class="left">{{ orderDetailData.customerName }}</li>
      <li class="center">
        <span class="phone">{{ orderDetailData.customerPhone }}</span>
        <p class="addr">{{ orderDetailData.customerAddress }}</p>
      </li>
      <div class="color-line">
        <img src="../../assets/images/color-line.png">
      </div>
    </ul>
    <!--商品列表-->
    <div class="goodsListWrap">
      <!--标题-->
      <ol class="ol-title clr">
        <li class="left">订单</li>
        <li class="right" v-if="orderDetailData.payStatus == 4">付款审核中</li>
        <li class="right" v-if="orderDetailData.orderStatus != 10 && orderDetailData.payStatus != 4">{{orderDetailData.orderStatus | orderStatusFilter}}</li>
        <li class="right" v-if="orderDetailData.orderStatus == 10"> 待分享, 差 {{orderDetailData.groupFewNum}} 人</li>
      </ol>
      <!--列表-->
      <ul class="goodList-box">
        <li v-for="(v,index) in orderDetailData.orderDetailGoodsDtoList">
          <div class="goodList-list" @click="goPageDetail(v)">
            <div class="icon">
              <img :src="v.goodsImage | filterImgUrl">
            </div>
            <div class="text">
              <h2 class="infor">{{ v.goodsName }}</h2>
              <div class="attribute">{{ v.goodsAttribute }}</div>
              <div class="list-Label" v-if="orderDetailData.orderSource == 9 ">
                <div>
                    <span class="redByLuck" >
                      获得{{ v.purchaseCoupon }}批发券
                    </span>
                </div>
              </div>
              <div class="price-num clr">
                <p class="price">¥{{ v.goodsPrice | moneyFilter }}<span v-if="v.welfarePointsValue">+{{v.welfarePointsValue}}{{v.welfarePointsName}}</span></p>
                <!-- <p class="point" v-if="v.points">{{v.points}}积分可兑换</p> -->
                <p class="num">x {{v.goodsNum}}</p>
              </div>
            </div>
          </div>
          <div class="exchange" v-if="v.whetherPointsOrder == 1">积分兑换</div>
        </li>
      </ul>
    </div>
    <!--价格-->
    <div class="price-box">
      <p v-if="orderDetailData.orderDetailGoodsDtoList && orderDetailData.orderDetailGoodsDtoList.length > 0 && orderDetailData.orderDetailGoodsDtoList[0].welfarePointsValue">
        <span>{{orderDetailData.orderDetailGoodsDtoList[0].welfarePointsName}}:</span>
        <b>{{orderDetailData.orderDetailGoodsDtoList[0].welfarePointsValue}}</b>
      </p>
      <p>
        <span>商品总价:</span>
        <b>¥{{ orderDetailData.orderAmount | moneyFilter }}</b>
      </p>
      <p>
        <span>快递运费:</span>
        <b v-if="orderDetailData.logisticsType === 0">¥{{ orderDetailData.logisticsAmount | moneyFilter }}</b>
        <b v-else>{{orderDetailData.logisticsType | filterLogistics}}</b>
      </p>
      <div class="actualAmount">
        <span>实付合计:</span>
        <b>¥{{ orderDetailData.orderTotalAmount | moneyFilter }}</b>
      </div>
    </div>
    <!--时间-->
    <div class="time-box">
      <p>
        <span>订单编号:</span>
        <b>{{ orderDetailData.orderNo }}</b>
      </p>
      <p>
        <span>下单时间:</span>
        <b>{{ orderDetailData.orderTime | formatDate(1) }}</b>
      </p>
      <p>
        <span>支付时间:</span>
        <b>{{ orderDetailData.payTime | formatDate(1) || '-/-'}}</b>
      </p>
    </div>
    <div class="time-box">
      <p>
        <span>订单状态:</span>
        <b>{{ orderDetailData.orderStatus | orderDetailSteFilter}}</b>

      </p>
      <p>
        <span>支付方式:</span>
        <b>{{ orderDetailData.payType | payWayFilter }}</b>
      </p>
    </div>
    <!--按钮-list-->
    <ul class="btn clr">
      <template v-if="orderDetailData.orderStatus==7">
        <li @click="deleteOrder(orderDetailData.orderId)" class="cancelPay">删除订单</li>
      </template>
      <template v-if="orderDetailData.orderStatus==1">
        <li @click="goPay(orderDetailData)" class="pay" v-if="orderDetailData.payStatus != 4">付款</li>
        <li @click="cancelOrder(orderDetailData.orderId)" class="cancelPay">取消订单</li>
      </template>
      <template v-if="orderDetailData.orderStatus==2">
        <li @click="Reminding" class="pay">提醒发货</li>
      </template>
      <template v-if="orderDetailData.orderStatus==3">
        <li @click="confirmReceipt(orderDetailData.orderId)" class="cancelPay">确认收货</li>
        <li @click="lookLogistics(orderDetailData)" class="pay">查看物流</li>
      </template>
      <template v-if="orderDetailData.orderStatus==4">
        <li @click="goEvaluatePage(orderDetailData.orderDetailGoodsDtoList)" class="pay">评价订单</li>
      </template>
      <template v-if="orderDetailData.orderStatus==10">
        <li @click="goSplice(orderDetailData)" class="pay">邀请好友拼单</li>
      </template>
      <template v-if="orderDetailData.orderStatus > 1 && orderDetailData.orderSource == 9">
        <li @click="goShop(orderDetailData)" class="pay">销售我的商品</li>
      </template>
    </ul>
    <!--查看物流-弹框-->
    <x-dialog v-model="showLogisticsPop" class="dialog-demo" :hide-on-blur="true" :dialog-style="{'text-align': 'left', width: '80%', 'max-width': '7.5rem'}">
      <div class="look-logistics">
        <div class='look-logistics-title'>
          <div>物流信息</div>
          <x-icon type="ios-close-empty" size="30" @click.native="showLogisticsPop = false"></x-icon>
        </div>
        <div class='look-logistics-list'>
          <div>
            <span>快递类型: </span>
            <span>{{logisticsData.sendLogisticsName}}</span>
          </div>
          <div>
            <span>快递单号: </span>
            <span>{{logisticsData.logisticsNo}}</span>
          </div>
        </div>
        <div  class='look-logistics-btn' @click="showLogisticsPop = false"> 确定 </div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
  import { Confirm, TransferDomDirective as TransferDom, XDialog, Clocker } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Confirm,
      XDialog,
      Clocker
    },
    data () {
      return {
        timer: '',                      // 倒计时变量
        countDownTxt: '',               // 倒计时显示
        countDownTime: 0,               // 订单倒计时
        orderDetailData: [],            // 订单详情
        showLogisticsPop: false,        // 物流弹窗
        logisticsData: ''               // 物流数据
      }
    },
    mounted () {
      this.getOrderDetail()
    },
    methods: {
      goPageDetail (v) {
        var spk = {goodsId: v.goodsId}
        var parm = {
          9: {pageType: 9},
          11: {pageType: 9},
          12: {pageType: 12},
          13: {pageType: 12}
        }
        var parmT = Object.assign(spk, parm[this.orderDetailData.orderSource] || {})
        this.$router.push({name: 'goodDetail', query: parmT})
      },
      /**
       * 订单倒计时
      */
      FreshTime (endtimes) {
        var endtime = new Date(endtimes)        // 结束时间
        var nowtime = new Date()               // 当前时间
        var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000) // 剩余时间
        if (lefttime <= 0) {
          clearInterval(this.timer)
          this.$router.back()
        }
        // var d = parseInt(lefttime / 3600 / 24)     // 剩余天数
//        var h = parseInt((lefttime / 3600))           // 剩余小时数
        // var h = parseInt((lefttime / 3600) % 24)   // 剩余小时数
        var m = parseInt((lefttime / 60) % 60)        // 剩余分钟数
        var s = parseInt(lefttime % 60)               // 剩余秒数
        // this.countDownTxt = d + '天' + h + '小时' + m + '分' + s + '秒'
//        this.countDownTxt = h + '小时' + m + '分' + s + '秒'
        this.countDownTxt = m + '分' + s + '秒'
      },
      /**
       * 获取订单详情
      */
      getOrderDetail () {
        this.$http.post(`${this.api.getOrderDetail}`, {
          orderId: this.$route.query.orderId
        }).then((res) => {
          if (!parseInt(res.data.status) === parseInt(this.api.ERR_OK)) return false
          this.orderDetailData = res.data.data
          this.orderDetailData.orderDetailGoodsDtoList.forEach((ite) => {
            if (this.orderDetailData.orderSource === 3) {
              this.$set(ite, 'welfarePointsName', '芯豆')
              this.$set(ite, 'welfarePointsValue', ite.goodsGoldBeanNum)
            } if (this.orderDetailData.orderSource === 4) {
              this.$set(ite, 'welfarePointsName', '消费积分')
              this.$set(ite, 'welfarePointsValue', ite.goodsBonusPoints)
            } if (this.orderDetailData.orderSource === 5) {
              this.$set(ite, 'welfarePointsName', '联盟积分')
              this.$set(ite, 'welfarePointsValue', ite.goodsLeaguePoints)
            }
          })
          this.countDownTime = this.orderDetailData.orderTime + (10 * 60 * 1000)
          if (this.orderDetailData.orderSource === 9) {
            this.countDownTime = this.orderDetailData.orderTime + (10 * 60 * 1000)
          }
          if (this.orderDetailData.orderSource === 13 || this.orderDetailData.orderSource === 12) {
            this.countDownTime = this.orderDetailData.orderTime + (10 * 60 * 1000)
          }
          if (this.orderDetailData.orderStatus === 1) {
            this.FreshTime(this.countDownTime)
            this.timer = setInterval(() => {
              this.FreshTime(this.countDownTime)
            }, 1000) // 每秒钟执行一次
          }
        })
      },
      /**
       * 弹窗操作公共方法
       * @title 弹窗标题
       * @content 弹窗提示内容
       * @fun 弹窗回调方法
      */
      showModel (title, content, fun) {
        this.$vux.confirm.show({
          title: title || '提示',
          content: content || '弹窗提示',
          onConfirm () {
            fun()
          }
        })
      },
      /**
       * 取消订单
      */
      cancelOrder (orderId) {
        this.showModel('取消订单', '确定是否取消订单？', () => {
          this.$http.post(`${this.api.cancleOrder}`, {
            orderId: orderId
          }).then((res) => {
            if (res.data.status === this.api.ERR_OK) {
              this.$vux.toast.text('取消订单成功')
              this.getOrderDetail() // 重新加载数据
            } else {
              this.$vux.toast.text(res.data.msg)
            }
          })
        })
      },
      /**
       * 邀请好友拼单
       */
      goSplice (v) {
        if (v.orderSource === 12 || v.orderSource === 13) {
          this.$router.push({name: 'groupDoing', query: {orderNo: v.orderNo}})
        } else {
          this.$router.push({name: 'spliceSuccess', query: {orderNo: v.orderNo}})
        }
      },
      /**
       * 删除订单
      */
      deleteOrder (orderId) {
        this.showModel('删除订单', '确定是否删除订单？', () => {
          this.$http.get(`${this.api.deleteOrder}`, {
            params: {
              orderId: orderId
            }
          }).then((res) => {
            if (res.data.status === this.api.ERR_OK) {
              this.$vux.toast.text('删除订单成功')
              this.$router.back()
            } else {
              this.$vux.toast.text(res.data.msg)
            }
          })
        })
      },
      /**
        * 确认收货
      */
      confirmReceipt (orderId) {
        this.showModel('提示', '确认收货吗？', () => {
          this.$http.post(`${this.api.confirmRecieveGood}`, {
            orderId: orderId
          }).then((res) => {
            if (res.data.status === this.api.ERR_OK) {
              this.$vux.toast.text('确认收货成功')
              this.getOrderDetail() // 重新加载数据
            } else {
              this.$vux.toast.text(res.data.msg)
            }
          })
        })
      },
      /**
       * 查看物流
      */
      lookLogistics (v) {
        // this.logisticsData = {
        //   sendLogisticsName: v.sendLogisticsName,
        //   logisticsNo: v.logisticsNo
        // }
        // this.showLogisticsPop = true
        this.$router.push({path: '/viewLogistics', query: {orderId: v.orderId, logisticsNo: v.logisticsNo, sendLogisticsName: v.sendLogisticsName}})
      },
      /**
       * 提醒发货
      */
      Reminding () {
        this.$vux.toast.text('已提醒卖家发货！')
      },
      /**
       * 去付款
      */
      goPay (v) {
        localStorage.setItem('CONFIRM_ORDER_TYPE', v.orderSource)
        // localStorage.setItem('payOrderId', v.orderId)
        localStorage.setItem('payOrderNo', v.orderNo)
        window.location.href = window.location.href.match(/.*mshop/gi)[0] + '/pay/orderPay?redirect=gopay&payTyps=&buyType=1&shopId=1'
      },
      /**
       * 跳转评价页面
      */
      goEvaluatePage (data) {
        this.$router.push({name: 'commentsOrder'})
        localStorage.setItem('addEvaluateInfo', JSON.stringify(data)) // 评价页面所需的数据
      },
      /**
       * 倒计时完成
      */
      countDownFinsh () {
        // if (this.orderDetailData) {
        //   console.log(this.orderDetailData)
        // }
      },
      /**
       * 售卖商品
       */
      goShop () {
        this.$router.push({name: 'shopSellGoods'})
      }
    }
  }
</script>

<style scoped lang=less>
    .look-logistics{
      width: 100%;
      height: 4.5rem;
      background: #fff;
      border-radius: .08rpx;
      .look-logistics-title{
        display: flex;
        height: .7rem;
        font-size: .28rem;
        border-bottom: 1px solid #eee;
        padding: 0 .3rem;
        align-items:center;
        div:first-child{
          flex: 1;
        }
      }
      .look-logistics-list{
        height: auto;
        overflow: hidden;
        border-bottom: 1px solid #eee;
        margin-top: .3rem;
        div{
          display: flex;
          padding:.3rem;
          font-size: .28rem;
          span{
            display: block;
            &:first-child{
              margin-right: .3rem;
              min-width: 1.2rem;
            }
          }
        }
      }
      .look-logistics-btn{
        width: 2rem;
        height: .6rem;
        display: block;
        margin: 0 auto;
        border: 1px solid #eee;
        border-radius: rpx;
        text-align: center;
        line-height: .6rem;
        font-size: .28rem;
        margin-top: .5rem;
      }
    }
  .orderDetail {
    height: 100vh;
    background: #eee;
    /***订单倒计时*/
    .orderCountDown{
      height: 1.78rem;
      background: linear-gradient(90deg,#ff8d07,#ff5213);
      -webkit-background: linear-gradient(90deg,#ff8d07,#ff5213);
      display: flex;
      align-items: center;
      padding: 0 .32rem;
      position: relative;
      div:nth-child(1){
        flex: 1;
        max-width: 4rem;
        color: #fff;
        p:nth-child(1){
          font-size: .32rem;
        }
        p:nth-child(2){
          font-size: .24rem;
          margin-top: .15rem;
        }
      }
      div:nth-child(2){
        position: absolute;
        right: .32rem;
        bottom: 0;
        img{
          width: 2.55rem;
          height: 1.57rem;
          display: block;
        }
      }
    }
    /*用户基本信息*/
    .userInfor-box{
      display: flex;
      align-items:center;
      background: #fffced;
      padding:0.3rem 0 0.5rem 0.3rem;
      position: relative;
      .left{
        color:#333;
        font-size: 15px;
      }
      .right{
        margin-right: 0.1rem;
        fill: #999;
      }
      .center{
        flex:1;
        padding:0 0.3rem;
        line-height: 1.6em;
        .phone{
          color:#333;
          font-size: 15px;
        }
        .addr{
          color:#999;
        }
      }
      .left-clues{
        flex:1;
      }
      .right-clues{
        margin-right: 0.1rem;
        fill: #999;
      }
      .color-line{
        position: absolute;
        left: 0;
        bottom: 0;
        img{
          height: 0.1rem;
          width: 7.5rem;
        }
      }
    }
    /*商品列表*/
    .goodsListWrap{
      background: #fff;
      margin-top:0.2rem;
      /*标题*/
      .ol-title{
        height: 0.8rem;
        line-height: 0.8rem;
        border-bottom: 1px solid #eee;
        padding:0 0.3rem;
        font-size: 0.32rem;
        .left{
          float: left;
        }
        .right{
          float: right;
          color:#f23030;
        }
      }
      /*列表*/
      .goodList-box{
        padding-left: 0.3rem;
        li{
          .goodList-list{
            display: flex;
            box-sizing: border-box;
            align-items: center;
            border-bottom: 1px solid #eee;
            padding:0.3rem 0.3rem 0.3rem 0;
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
              line-height: 1.4em;
              overflow: hidden;
              font-size: 12px;
              .infor{
                color: #333;
                word-break:break-all;
                font-size: .28rem;
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
                margin-top: .15rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .price-num{
                margin-top:0.2rem;
                .price{
                  float: left;
                  color: red;
                  font-size:17px;
                }
                .point{
                  float: left;
                  margin-left: .15rem;
                  background: #ffeacc;
                  color: #ff9700;
                  border-radius:20px;
                  padding: 1px .1rem;
                  font-size: .24rem;
                }
                .num{
                  float: right;
                  color:#999;
                }
              }
            }
          }
          .exchange{
            height: .7rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0 .3rem;
            font-size: .26rem;
            border-bottom: 1px solid #eee;
          }
        }
      }
    }
    /*价格*/
    .price-box{
      background: #fff;
      margin-top:0.2rem;
      padding-left: 0.3rem;
      padding-top:0.1rem;
      p{
        padding-top:0.2rem;
        span{
          color:#999;
        }
      }
      .actualAmount{
        height: 0.8rem;
        line-height: 0.8rem;
        border-top:1px solid #eee;
        margin-top:0.2rem;
        color:#f23030;
      }
    }
    /*时间*/
    .time-box{
      background: #fff;
      margin-top:0.2rem;
      padding:0.2rem 0.3rem;
      p{
        margin-top:0.2rem;
        span{
          color:#999;
        }
      }
    }
    /*按钮*/
    .btn{
      background: #fff;
      margin-top:0.2rem;
      li{
        float: right;
        width:1.6rem;
        height: 0.6rem;
        text-align: center;
        line-height: 0.6rem;
        font-size: 0.24rem;
        border-radius: 0.1rem;
        margin: 0.3rem 0.3rem 0.3rem 0;
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

    .redByLuck {
      width: auto;
      line-height: .4rem;
      border-radius: .3rem .3rem .3rem 0rem;
      border: 1px solid #e64340;
      background: #fff;
      color: #e64340;
      padding-left: .2rem;
      padding-right: .2rem;
    }
  }
</style>
