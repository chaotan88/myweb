<template>
    <div class="confirmOrder">
      <!--用户基本信息-->
      <ul class="userInfor-box" @click="$router.push({path: '/receiveAddr', query: { confirmOrder: 'confirmOrder'}})">
       <!--无数据-->
        <template v-if="JSON.stringify(defaultReceiveAddrInfo) == '{}'">
          <li class="left-clues">请添加收货地址</li>
          <li class="right-clues">
            <x-icon type="ios-arrow-right" size="20"></x-icon>
          </li>
        </template>
        <!--有数据-->
        <template v-else>
          <li class="left">{{defaultReceiveAddrInfo.name}}</li>
          <li class="center">
              <span class="phone">{{defaultReceiveAddrInfo.phone}}</span>
              <p class="addr">{{defaultReceiveAddrInfo.address}}</p>
          </li>
          <li class="right">
              <x-icon type="ios-arrow-right" size="20"></x-icon>
          </li>
        </template>
        <div class="color-line">
          <img src="../../assets/images/color-line.png">
        </div>
      </ul>
      <!--商品列表-->
      <ul class="goodList-box">
        <li v-for="(v,index) in goodsList">
          <div class="goodList-list">
            <div class="icon">
              <img :src="imgUrl+v.goodsImage">
            </div>
            <div class="text">
              <h2 class="infor">{{ v.goodsName }}</h2>
              <div class="attribute ">{{ v.goodsAttribute }}</div>
              <div class="price-num clr">
                <p class="price">{{ v.goodsPrice | moneyFilter }}</p>
                <p class="point" v-if="v.points">{{v.points}}积分可兑换</p>
                <p class="num">x {{v.goodsNum}}</p>
              </div>
            </div>
          </div>
          <div class="exchange" v-if="v.whetherPoints == 1">
            积分兑换
            <input type="checkbox" @change="pointChange(v)" v-model="v.inpCheckSte">
          </div>
        </li>
      </ul>
      <!--商品信息-->
      <ol class="goodInfor-box">
        <li class="integral-tip">
          <div class="left">我的积分</div>
          <div class="right"><span class="total-point">{{totalIntegral - useIntegral}}</span> 积分</div>
        </li>
        <li class="msg">
          <span>买家留言：</span>
          <input type="text" placeholder="选填：填写内容已和卖家协商确认" v-model="remark">
        </li>
        <li class="sendType">
          <div class="left">配送方式</div>
          <!--商品总金额>运费基准点=免运费，否则选择运费方式-->
          <div class="right" v-if="goodstotalPrice > freeAdmission.freeShipping">免运费</div>
          <div v-else @click="showPop = true" class="right">
            <span>
              <i v-if="!selectLogistics">请选择配送方式</i>
              <i v-else>{{selectLogistics.name}} {{selectLogistics.price}}元</i>
            </span>
            <x-icon type="ios-arrow-right" size="20"></x-icon>
          </div>
        </li>
        <li class="integral-tip">
          <div class="left">积分</div>
          <div class="right">购买此商品确认收货后可获得{{integralData}}积分</div>
        </li>
        <li class="goodCalculate Postage">
          <div class="left">邮费</div>
          <div class="right"><i>¥{{selectLogistics.price ? selectLogistics.price : 0}}</i></div>
        </li>
        <li class="goodCalculate">
          <div class="left">商品金额</div>
          <div class="right"><i>¥{{goodstotalPrice}}</i></div>
        </li>
      </ol>
      <!--快递方式-底部弹框-->
      <div v-transfer-dom>
        <popup position="bottom" max-height="6rem"  v-model="showPop">
          <div class="distribution-mode">
            <div class='distribution-mode-title' @click="showPop = false">
              <div>取消</div>
              <div>确定</div>
            </div>
            <div class='distribution-mode-list-box'>
              <div class='distribution-mode-list' :class="selectLogisticsIndex == index ? 'distribution-mode-select' : ''" v-for="(item, index) in logisticsList" @click="chooseLogistics(item, index)">
                <div>{{item.logisticsName}}</div>
                <div>¥{{item.logisticsCost}}</div>
              </div>
            </div>
          </div>
        </popup>
      </div>
      <!--底部-->
      <div class="footer-hei"></div>
      <ol class="footer-box">
        <li class="left">
          合计：
          <span>{{Total - freeMoney | moneyFilter}}</span>
        </li>
        <li class="right" @click="confirmOrder">提交订单</li>
      </ol>
    </div>
</template>

<script>
  import Vue from 'vue'
  import { TransferDom, Popup } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      TransferDom,
      Popup
    },
    data () {
      return {
        showPop: false, // 显示物流列表弹窗
        goodsList: [],       // 购物车过来的商品列表
        remark: '', // 买家留言
        defaultReceiveAddrInfo: {},   // 默认地址信息
        logisticsList: [], // 物流列表
        selectLogistics: '', // 选中的物流信息
        selectLogisticsIndex: null, // 物流选中的索引
        freeAdmission: {}, // 免邮费金额点
        totalIntegral: '0', // 总积分
        goodstotalPrice: 0, // 商品总价格
        freeMoney: 0, // 积分减免的金额总和
        useIntegral: 0, // 使用的积分总和
        integralData: '', // 积分信息
        goodsNum: 1 // 商品种数
      }
    },
    mounted: function () {
      var orderData = JSON.parse(localStorage.getItem('confirmOrderInfo'))
      // 模拟订单中的积分等字段
      orderData.forEach((item, index) => {
        Vue.set(item, 'inpCheckSte', false) // 初始化选中状态
      })
      this.goodsList = orderData
      // 如果是从地址列表页跳过来的 就取本地地址数据 否则就获取默认地址
      if (this.$route.query.addType && this.$route.query.addType === 'byAddList') {
        this.defaultReceiveAddrInfo = JSON.parse(localStorage.getItem('addressData'))
      } else {
        this.getDefaultAdd()
      }
      this.getPostageMes() // 获取免邮金额点
      this.getLogisticsList() // 获取物流列表
      this.getGoodstotalPrice() // 计算总价
      this.getIntegral() // 获取购买此商品能得到积分信息
      this.getMemberPoints() // 用户总积分
    },
    computed: {
      /**
       * 合计
      */
      Total () {
        // 有邮费
        if (this.selectLogistics && this.selectLogistics.price) {
          return parseFloat(this.goodstotalPrice) + parseFloat(this.selectLogistics.price)
        } else {
          return this.goodstotalPrice
        }
      }
    },
    methods: {
      /**
       * 获取用户积分信息
      */
      getMemberPoints () {
        this.$http.post(`${this.api.getMemberPoints}`, {
          token: JSON.parse(localStorage.getItem('bsbUserInfo')).token
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.totalIntegral = res.data.data.bonusPoints
        })
      },
      /**
       * 获取能得到多少积分
      */
      getIntegral () {
        this.$http.post(this.api.calculateGoodsPoints, {
          orderAmount: this.goodstotalPrice
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.integralData = resData.data
          }
        })
      },
      /**
       * 计算商品总金额
      */
      getGoodstotalPrice () {
        let goodsNum = 0 // 商品种数
        this.goodsList.forEach((v, index) => {
          this.goodstotalPrice += v.goodsPrice * v.goodsNum
          goodsNum++
        })
        this.goodsNum = goodsNum
      },
      /**
       * 获取默认地址
      */
      getDefaultAdd () {
        this.$http.get(`${this.api.getDefaultAddress}`).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            if (resData.data) {
              this.defaultReceiveAddrInfo = resData.data
            }
          }
        })
      },
      /**
       * 获取免邮金额点
      */
      getPostageMes () {
        this.$http.get(`${this.api.getShop}`).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            if (resData.data) {
              this.freeAdmission = resData.data
            }
          }
        })
      },
      /**
       * 获取物流列表
      */
      getLogisticsList () {
        this.$http.get(`${this.api.getLogisticsList}`).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            if (resData.data) {
              this.logisticsList = resData.data
            }
          }
        })
      },
      /**
       * 选择物流信息
      */
      chooseLogistics (item, index) {
        this.showPop = false
        this.selectLogistics = {
          name: item.logisticsName,
          id: item.id,
          price: item.logisticsCost
        }
        this.selectLogisticsIndex = index
      },
      /**
       * 使用积分兑换
      */
      pointChange (v) {
        if (v.inpCheckSte) {
          // 判断积分是否足够
          if (this.totalIntegral - this.useIntegral < v.points) {
            v.inpCheckSte = false
            this.$vux.toast.text('没有足够积分')
            return false
          }
          this.freeMoney += parseFloat(v.goodsPrice)
          this.useIntegral += v.points
        } else {
          this.freeMoney = this.freeMoney - parseFloat(v.goodsPrice)
          this.useIntegral = this.useIntegral - v.points
        }
      },
      /**
       * 提交订单
      */
      confirmOrder () {
        if (JSON.stringify(this.defaultReceiveAddrInfo) === '{}') {
          this.$vux.toast.text('请选择收货地址')
          return false
        }
        if (this.goodstotalPrice < this.freeAdmission.freeShipping) {
          if (!this.selectLogistics) {
            this.$vux.toast.text('请选择配送方式')
            return false
          }
        }
        let orderDetailList = []
        let orderDetailListObj = {}
        this.goodsList.forEach((item) => {
          orderDetailListObj = {
            goodsId: item.goodsId,
            goodsNum: item.goodsNum,
            goodsAttribute: item.goodsAttribute,
            attributeIds: item.attributeId || item.goodsAttributeIds,
            goodsAttributeValIds: item.attributeValId || item.goodsAttributeValIds,
            whetherPointsOrder: item.inpCheckSte ? 1 : 0
          }
          orderDetailList.push(orderDetailListObj)
        })
        this.$http.post(this.api.addOrder, {
          customerPhone: this.defaultReceiveAddrInfo.phone,
          customerAddress: this.defaultReceiveAddrInfo.address,
          customerName: this.defaultReceiveAddrInfo.name,
          receiptAddressId: this.defaultReceiveAddrInfo.id,
          goodsNum: this.goodsNum, // 商品种数
          logisticsAmount: this.selectLogistics.price || 0,
          logisticsId: this.selectLogistics.id || 0,
          orderDetailList: orderDetailList
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            localStorage.setItem('payOrderId', resData.data.orderId)
            // this.$router.push({path: '/pay/orderPay', query: {redirect: 'gopay'}})
            // 提交订单跳转判断
            var isUrl = window.location.href.indexOf('http://www')
            if (isUrl === -1) {
              if (window.location.host.indexOf('http') === -1) {
                window.location.href = 'http://' + window.location.host + '/pay/orderPay?redirect=gopay&shopId=1'
              } else {
                window.location.href = window.location.host + '/pay/orderPay?redirect=gopay&shopId=1'
              }
            } else {
              window.location.href = this.pageUrl + '/pay/orderPay?redirect=gopay&shopId=1'
            }
          } else {
            this.$vux.toast.text(resData.msg)
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
    .confirmOrder {
      height: 100vh;
      background: #eee;
      /*用户基本信息*/
      .userInfor-box{
        min-height: 1rem;
        display: flex;
        align-items:center;
        background: #fffced;
        padding:0.3rem 0 0.5rem 0.3rem;
        position: relative;
        .left{
          color:#333;
          font-size: .24rem;
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
            font-size: .24rem;
          }
          .addr{
            color:#999;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: .28rem;
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
      /*商品信息*/
      .goodInfor-box{
        background: #fff;
        margin-top:0.2rem;
        font-size: .28rem;
        li{
          padding-left: 0.3rem;
          height: 0.8rem;
          line-height: 0.8rem;
          border-bottom: 1px solid #eee;
          position: relative;
          .left{
            float: left;
          }
          .right{
            float: right;
            color:#333;
            .vux-x-icon {
              fill: #999;
              position: absolute;
              right: 0.1rem;
              top:0.15rem;
            }
            i{
              color:#f23030;
            }
          }
          input{
            width: 70%;
          }
        }
        .sendType{
          padding-right: 0.3rem;
          display: flex;
          align-items: center;
          .right{
            flex: 1;
            text-align: right;
            color: #353535;
            i{
              color: #353535;
            }
          }
          span{
            margin-right: 0.5rem;
          }
        }
        .Postage{
          border-top: .2rem solid #eee;
        }
        .goodCalculate{
          padding-right: 0.3rem;
        }
        .integral-tip{
          font-size: .28rem;
          padding-right: 0.3rem;
          /* color: #999999; */
          .right{
            text-align: left;
            /* color: #999999; */
            .total-point{
              color: #fbb269;
            }
          }
        }
        li:last-child{
          /* border:none; */
        }
        &:after{
          display: block;
          content: ".";
          height: 0;
          line-height: 0;
          clear: both;
          visibility: hidden;
        }
      }
      /*商品列表*/
      .goodList-box{
        background: #fff;
        li{
          padding-left: 0.3rem;
          border-bottom: .2rem solid #eeeeee;
          &:last-child{
            border-bottom: none;
          }
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
              overflow: hidden;
              font-size: 12px;
              .infor{
                color: #333;
                word-break:break-all;
                display: -webkit-box;
                display: -moz-box;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                font-size: .28rem;
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
                  background: #fbb269;
                  color: #fff;
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
            height: .8rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0 .3rem;
            font-size: .26rem;
            input{
              width: .94rem;
              height: .48rem;
              margin-left: .1rem;
              position: relative;
              background-color: #dddddd;
              border-radius: 30px;
              background-clip: content-box;
              display: inline-block;
              -webkit-appearance: none;
              user-select: none;
              outline: none;
              transition: background-color ease 0.4s;
              -webkit-transition: background-color ease 0.4s;
              &:checked{
                background-color: #fbb269;
                transition: border-color 0.4s, background-color ease 0.4s;
                -webkit-transition: border-color 0.4s, background-color ease 0.4s;
              }
              &:checked::before{
                left: .48rem;
              }
              &::before{
                content: '';
                width: .4rem;
                height: .4rem;
                position: absolute;
                top: 0px;
                left: .03rem;
                bottom: 0;
                margin: auto;
                border-radius: 50%;
                background-color: #fff;
                transition: left 0.3s;
                -webkit-transition: left 0.3s;
              }
            }
          }
        }
      }
      /*底部*/
      .footer-hei{
        height: 1rem;
      }
      .footer-box{
        width: 7.5rem;
        display: flex;
        height: 1rem;
        line-height: 1rem;
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        .left{
          flex: 1;
          background: #fff;
          text-align: right;
          padding-right: 0.2rem;
          color:#999;
          span{
            color:#f23030;
            font-size: 0.32rem;
          }
        }
        .right{
          width: 2rem;
          background: #f23030;
          text-align: center;
          font-size: 0.28rem;
          color:#fff;
        }
      }
    }
    /*快递方式-底部弹框*/
    .distribution-mode{
      height: 100%;
      position: relative;
      .distribution-mode-title{
        height: .8rem;
        display: flex;
        font-size: .28rem;
        align-items: center;
        justify-content: flex-end;
        padding: 0 .3rem;
        background: #fbf9fe;
      }
      .distribution-mode-title div{
        margin-left: .3rem;
      }
      .distribution-mode-list-box{
        width: 100%;
        max-height: calc(6rem - 0.8rem);
        overflow-y: scroll;
        background: #fff;
        .distribution-mode-list{
          display: flex;
          height: .8rem;
          align-items: center;
          border-bottom: 1px solid #eee;
          font-size: .28rem;
          padding: 0 .3rem;
          div:nth-child(1){
            flex: 1;
          }
        }
        .distribution-mode-select{
          color: #E64340;
          background: #eee;
        }
      }
  }
</style>
