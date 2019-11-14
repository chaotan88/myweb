<template>
    <div class="myOrder">
      <!--标题-->
      <div class="title-wrap">
        <div class="orderTab">
          <ul class="title-box">
            <li v-for="(item, index) in tabBar" @click="orderBtnTap(index, item.id)" :class="tabBarIndex == item.id ? 'active' : ''">{{item.name}}</li>
          </ul>
        </div>
      </div>
      <div class="order-list-box" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
        <!--内容-有数据-->
        <div v-if="!noData" class="content-box" v-for="(v,index) in orderList">
           <!-- v-if="v.orderDetailGoodsDtoList.length > 0" -->
          <template>
            <!-- <div class="interval"></div> -->
            <ul class="orderNo clr">
              <li class="left">订单号: {{ v.orderNo }}</li>
              <li class="right" v-if="v.payStatus == 4">付款审核中</li>
              <li class="right" v-if="v.payStatus != 4 && v.orderStatus !=10">{{ v.orderStatus | orderStatusFilter }}</li>
              <li class="right" v-if="v.orderStatus == 10"><span>待分享, 差 {{v.groupFewNum}} 人</span></li>
            </ul>
            <!--列表-->
            <ul class="content-list" @click="$router.push({path: '/orderDetail', query: { orderId: v.orderId }})">
              <li class="content-li" v-for="(item,index) in v.orderDetailGoodsDtoList">
                <div class="goodList-list">
                  <div class="icon">
                    <img :src="item.goodsImage | filterImgUrl">
                  </div>
                  <div class="span">
                    <h2 class="infor">{{ item.goodsName }}</h2>
                    <div class="attribute">{{ item.goodsAttribute }}</div>
                    <div class="list-Label" v-if="v.orderSource == 9 ">
                      <div>
                        <span class="redByLuck" >
                          获得{{ item.purchaseCoupon }}批发券
                        </span>
                      </div>
                    </div>
                    <div class="price-num clr">
                      <p class="price">¥{{ item.trueGoodsPrice | moneyFilter }}<span v-if="item.welfarePointsArr[v.orderSource - 1].value && v.orderSource !=7 && v.orderSource !=9">+{{item.welfarePointsArr[v.orderSource - 1].value}}{{item.welfarePointsArr[v.orderSource - 1].name}}</span></p>
                      <!-- <p class="point" v-if="item.points">{{item.points}}积分可兑换</p> -->
                      <p class="num">x {{item.goodsNum}}</p>
                    </div>
                    <!-- <p class="price">
                      <span>价格：{{ item.goodsPrice | moneyFilter }}</span>
                      <span class="num">数量：{{item.goodsNum}}</span>
                    </p> -->
                  </div>
                </div>
                <div class="exchange" v-if="item.whetherPointsOrder == 1">积分兑换</div>
              </li>
            </ul>
            <!--合计-->
            <div class="combined-box">
              <div class="combined">
                共{{v.goodsNum}}种{{v.goodsPieces}}件商品 合计：<span>¥{{ v.orderTotalAmount | moneyFilter }}</span> ( 含运费:¥{{ v.logisticsAmount | moneyFilter }} )
              </div>
            </div>
            <!--按钮-->
            <ul class="btn clr">
              <template v-if="v.orderStatus==7">
                <li @click="deleteOrder(v.orderId)" class="cancelPay">删除订单</li>
              </template>
              <template v-if="v.orderStatus==1">
                <li @click="goPay(v)" class="pay" v-if="v.payStatus != 4">付款</li>
                <li @click="cancelOrder(v.orderId)" class="cancelPay">取消订单</li>
              </template>
              <template v-if="v.orderStatus==2">
                <li @click="Reminding" class="pay">提醒发货</li>
              </template>
              <template v-if="v.orderStatus==3">
                <li @click="confirmReceipt(v.orderId)" class="pay">确认收货</li>
                <li @click="lookLogistics(v)" class="cancelPay">查看物流</li>
              </template>
              <template v-if="v.orderStatus==4">
                <li @click="goEvaluatePage(v.orderDetailGoodsDtoList)" class="pay">评价订单</li>
              </template>
              <template v-if="v.orderStatus==10">
                <li @click="goSplice(v)" class="pay">邀请好友拼单</li>
              </template>
              <template v-if=" v.orderSource == 9 && v.orderStatus > 1">
                <li @click="goShop(v)" class="pay">销售我的商品</li>
              </template>
            </ul>
            <!--可获得的积分-->
            <div class="availablePoints" v-if="v.orderStatus == 3 && v.totalGetPoints > 0">
              <span>确认收货可获得{{v.totalGetPoints}}个积分</span>
            </div>
          </template>
        </div>
        <load-more :tip="loadingTitle" v-if="showLoading"></load-more>
        <!--内容-无数据-->
        <div v-if="noData" class="noDataContent-box">
          <img src=../../assets/images/maker/noOrder.png>
          <div>暂无相关订单</div>
        </div>
      </div>
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
  import { Confirm, XDialog, TransferDomDirective as TransferDom, LoadMore } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Confirm,
      XDialog,
      LoadMore
    },
    data () {
      return {
        loadingTitle: '数据加载中',
        showLoading: false,                       // 是否显示加载loading
        busy: false,
        orderList: [],                           // 订单列表
        noData: false,                           // 无数据状态
        orderState: '',                          // 订单状态
        showLogisticsPop: false,                 // 物流弹窗
        logisticsData: '',                       // 物流数据
        currentOrder: {},                        // 当前订单
        tabBarIndex: 0,
        start: 1,                                // 当前页
        pageSize: 5,                             // 每页显示几条
        totalPage: 0,                            // 总页数
        cover: false,                            // 是否是点击
        tabBar: [
          {
            name: '全部',
            id: ''
          },
          {
            name: '待付款',
            id: '1'
          },
          {
            name: '待分享',
            id: '10'
          },
          {
            name: '待发货',
            id: '2'
          },
          {
            name: '待收货',
            id: '3'
          },
          {
            name: '待评价',
            id: '4'
          }
        ]
      }
    },
    mounted: function () {
      var goOrderState = localStorage.getItem('goOrderState').toString()
      this.tabBarIndex = goOrderState || 0
      this.orderState = goOrderState || ''
      this.$vux.loading.show({
        text: '数据加载中'
      })
      this.getOrderList() // 获取订单列表
    },
    methods: {
      /**
       * 售卖商品
       */
      goShop () {
        this.$router.push({name: 'shopSellGoods'})
      },
      /**
       * tab切换
      */
      orderBtnTap (index, id) {
        this.start = 1
        this.cover = true
        this.tabBarIndex = id
        localStorage.setItem('goOrderState', id)
        this.orderState = id
        this.showLoading = false
        this.getOrderList() // 获取列表
      },
      /**
       * 获取订单列表
      */
      getOrderList () {
        this.$http.post(`${this.api.getOrderList}`, {
          start: this.start,
          pageSize: this.pageSize,
          orderStatus: this.orderState
        }).then((res) => {
          this.busy = false // 重置busy状态
          this.$vux.loading.hide()
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          this.orderList = this.cover ? res.data.data.list : this.orderList.concat(res.data.data.list)
          // 可获得积分相加
          this.orderList.forEach((item) => {
            let totalGetPoints = 0
            item.orderDetailGoodsDtoList.forEach((ite) => {
              if (ite.getPoints >= 0) {
                totalGetPoints += ite.getPoints
              }
              let pointsArr = [
                {
                  name: '',
                  value: ''
                },
                {
                  name: '',
                  value: ''
                },
                {
                  name: '芯豆',
                  value: ite.goodsGoldBeanNum
                },
                {
                  name: '消费积分',
                  value: ite.goodsBonusPoints
                },
                {
                  name: '联盟积分',
                  value: ite.goodsLeaguePoints
                },
                {
                  name: '一元购',
                  value: ite.goodsLeaguePoints
                },
                {
                  name: ' 拼团',
                  value: ite.goodsLeaguePoints
                },
                {
                  name: '限时抢购',
                  value: ite.goodsLeaguePoints
                },
                {
                  name: '',
                  value: ''
                },
                {
                  name: '',
                  value: ''
                },
                {
                  name: '批发商品提货',
                  value: ''
                },
                {
                  name: '',
                  value: ite.purchaseCoupon
                },
                {
                  name: '',
                  value: ite.purchaseCoupon
                },
                {
                  name: '',
                  value: ''
                }
              ]
              this.$set(ite, 'welfarePointsArr', pointsArr)
              this.$set(item, 'totalGetPoints', totalGetPoints)
            })
          })
          this.noData = res.data.data.list.length > 0 ? 0 : 1
          this.start = this.start + 1 // 当前页数
          this.totalPage = res.data.data.pages // 总页数
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
              this.start = 1
              this.cover = true
              this.getOrderList() // 重新加载数据
            } else {
              this.$vux.toast.text(res.data.msg)
            }
          })
        })
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
              this.start = 1
              this.cover = true
              this.getOrderList() // 重新加载数据
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
              this.start = 1
              this.cover = true
              this.getOrderList() // 重新加载数据
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
        this.$router.push({path: '/viewLogistics', query: {orderId: v.orderId, logisticsNo: v.logisticsNo, sendLogisticsName: v.sendLogisticsName}})
        // this.logisticsData = {
        //   sendLogisticsName: v.sendLogisticsName,
        //   logisticsNo: v.logisticsNo
        // }
        // this.showLogisticsPop = true
      },
      /**
       * 提醒发货
      */
      Reminding () {
        this.$vux.toast.text('已提醒卖家发货！')
      },
      /**
       * 分页
      */
      loadMore () {
        this.cover = false
        this.showLoading = true
        if (parseInt(this.start) > parseInt(this.totalPage)) {
          this.showLoading = false
          return
        }
        this.getOrderList() // 分页数据
      },
      /**
       * 去付款
      */
      goPay (v) {
        var skuIdsArr = []
        localStorage.setItem('CONFIRM_ORDER_TYPE', v.orderSource)
        localStorage.setItem('payOrderNo', v.orderNo)
        localStorage.setItem('payOrderSzie', 1)
        localStorage.setItem('payOrderId', v.orderId)
        localStorage.setItem('orderType', 1)
        v.orderDetailGoodsDtoList.forEach((item) => {
          skuIdsArr.push(item.skuId)
        })
        localStorage.setItem('skuIdsArr', JSON.stringify(skuIdsArr)) // 存储商品id集合-付款页查询判断是否能用余额付款
        window.location.href = window.location.href.match(/.*mshop/gi)[0] + '/pay/orderPay?redirect=gopay&payTyps=&buyType=1&shopId=1'
      },
      /**
       * 跳转评价页面
      */
      goEvaluatePage (data) {
        this.$router.push({name: 'commentsOrder'})
        localStorage.setItem('addEvaluateInfo', JSON.stringify(data)) // 评价页面所需的数据
      },
      // 拼团
      goSplice (v) {
        if (v.orderSource === 12 || v.orderSource === 13) {
          this.$router.push({name: 'groupDoing', query: {orderNo: v.orderNo}})
        } else {
          this.$router.push({name: 'spliceSuccess', query: {orderNo: v.orderNo}})
        }
      }
    }
  }
</script>

<style scoped lang=less>
    .look-logistics{
      width: 100%;
      height: 4.5rem;
      background: #fff;
      border-radius: .08rem;
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
    .orderTab {
      .title-box{
        display: flex;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        background: #fff;
        border-bottom: 1px solid #eee;
        li{
          flex: 1;
        }
        .active{
          border-bottom: 2px solid #f23030;
        }
      }


    }
    .myOrder {
      /*内容-有数据*/
      .order-list-box{
        height: calc(~"100vh - 1rem - 1px");
        overflow-y: auto;
        border-top: .2rem solid #eee;
        box-sizing: border-box;
      }
      .content-box{
        border-bottom: .2rem solid #eee;
        .interval{
          height: 0.2rem;
          background: #eee;
        }
        .orderNo{
          height: 0.8rem;
          line-height: 0.8rem;
          border-bottom: 1px solid #eee;
          padding:0 0.3rem;
          font-size: .28rem;
          .left{
            float: left;
            max-width: 5rem;
            overflow: hidden;
            span-overflow: ellipsis;
            white-space: nowrap;
          }
          .right{
            float: right;
            color:#f23030;
          }
        }
        /*列表*/
        .content-list{
          padding-left: 0.3rem;
          .content-li{
            .goodList-list{
              display: flex;
              box-sizing: border-box;
              align-items: center;
              border-bottom: 1px solid #eee;
              padding: 0.3rem;
              .icon{
                flex: 0 0 1.6rem;
                width: 1.6rem;
                margin-right: 0.2rem;
                background: #eee;
                img{
                  width: 1.6rem;
                  height: 1.6rem;
                }
              }

              .span{
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                /* line-height: 1.6em; */
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
              .price-num{
                margin-top:0.2rem;
                font-size: .26rem;
                .price{
                  float: left;
                  color: red;
                  font-size:.28rem;
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
              /* .price{
                font-size:0.28rem;
                color:#999;
                .num{
                  margin-left: 0.5rem;
                }
              } */

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
        /*合计*/
        .combined-box{
          padding-left: 0.3rem;
          .combined{
            height: 0.8rem;
            line-height: 0.8rem;
            border-bottom: 1px solid #eee;
            text-align: right;
            padding-right: 0.3rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span{
              font-size: 0.3rem;
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
        /**可获得积分**/
        .availablePoints{
          height: .77rem;
          padding: 0 .3rem;
          border-top: 1px solid #dddddd;
          margin-left: .3rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          span{
            border: 1px dashed #ff2030;
            border-radius: 7px;
            font-size: .26rem;
            color:#ff2030;
            padding: .05rem .26rem;
          }
        }
      }
      /*内容-无数据*/
      .noDataContent-box{
        text-align: center;
        margin-top:3rem;
        color:#999;
        img{
          width: 3.2rem;
          margin-bottom: 0.3rem;
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
