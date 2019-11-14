<template>
  <div class="shopCart">
    <!--列表-->
    <swipeout>
      <swipeout-item transition-mode="follow" v-for="(v,index) in cartList" :key="index">
        <div slot="right-menu">
          <swipeout-button @click.native="shopCartAddCollectFun(v)" type="warn" class="moveCart">移入收藏</swipeout-button>
          <swipeout-button @click.native="shopCartDelFun(v)" type="primary" class="delCart">删除</swipeout-button>
        </div>
        <!--内容-->
        <div slot="content" class="content" v-if="!isData">
          <div class="send-li-left" @click.stop.prevent="oneCheckFun(v)">
            <icon v-if="v.checked"  type="success"></icon>
            <icon v-else type="circle"></icon>
          </div>
          <div class="send-li-center">
            <router-link :to="{ path: '/goodDetail', query: { goodsId: v.goodsId }}">
              <img :src="v.mainImage | filterImgUrl" >
            </router-link>
          </div>
          <div class="send-li-right">
            <div class="title">
              <!-- <router-link :to="{ path: '/goodDetail', query: { goodsId: v.goodsId }}"> -->
                {{v.goodsName}}
              <!-- </router-link> -->
            </div>
            <div class="attr">{{v.goodsAttribute}}</div>
            <div class="calculate-box">
              <p class="price">¥{{v.goodsPrice | moneyFilter}}</p>
              <div class="add-subtract">
                <com-cartcontrol @countFun="countFun" :index="index" :good="cartList" :goodsNum="v.goodsNum"></com-cartcontrol>
              </div>
            </div>
          </div>
        </div>
      </swipeout-item>
    </swipeout>
    <!--数据为空-->
    <div class="dataEmpty" v-if="isData&&isData!=2">
      <div class="dataEmpty-icon">
        <img src="../../assets/images/noCart.png">
        <div>
          <p>购物车空空如也，</p>
          <p>去逛逛吧～</p>
        </div>
      </div>
      <div @click="$router.push('/classification')" class="dataEmpty-btn">去购物</div>
    </div>
    <!--推荐商品列表-->
    <commonGoodsList goodsTypes="cart" :isShowMore="false" :isShowBanner="false"></commonGoodsList>
    <!--结算-->
    <div style="height:1rem;"></div>
    <ol v-if="!isData&&isData!='2'" class="settlement-box clr">
      <!--总计-->
      <li class="settlement-left">
        <div class="all-select" @click="AllCheckedFun">
          <div class="allIcon">
            <icon v-if="allCheckType==false" type="circle"></icon>
            <icon v-else  type="success"></icon>
          </div>
          全选
        </div>
        <div class="total">
          总计：<i>¥{{totalPrice*100/100 | moneyFilter}}</i>
        </div>
      </li>
      <!--提交按钮-->
      <li class="settlement-right" @click="submitFun">去结算({{selectNum}})</li>
    </ol>
  </div>
</template>

<script>
  import Vue from 'vue'
  import commonGoodsList from '../../components/commonGoodsList' // 公共列表组件
  import comCartcontrol from '../../components/ComCartcontrol'
  import $ from 'jquery'
  import { Icon, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'

  export default {
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      Icon,
      comCartcontrol,
      commonGoodsList
    },
    data () {
      return {
        cartList: [],                   // 购物车列表
        allCheckType: false,            // 选中状态
        totalPrice: 0,                  // 总金额
        isData: '2'                     // 是否有数据
      }
    },
    computed: {
      selectNum () {
        var chooseNums = 0
        this.cartList.forEach((v, index) => {
          if (v.checked) {
            chooseNums += v.goodsNum
          }
        })
        return chooseNums
      }
    },
    mounted: function () {
      this.$vux.loading.show({
        text: '数据加载中'
      })
      this.ShopCartListFun()
      this.totalPriceFun()
    },
    methods: {
      /**
       * 获取购物车列表
      */
      ShopCartListFun () {
        this.$http.post(this.api.getShopCartList, {
        }).then((res) => {
          this.$vux.loading.hide()
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.isData = true
            return false
          }
          this.isData = res.data.data.list.length > 0 ? 0 : 1
          this.cartList = res.data.data.list
          this.cartList.forEach((v, index) => {
            Vue.set(v, 'checked', false)
          })
        })
      },
      /**
       * 购物车单个选择
      */
      oneCheckFun (v) {
        v.checked = !v.checked
        // 将checked的状态放在一个数组中
        let arr = []
        this.cartList.forEach((v, index) => {
          arr.push(v.checked)
        })
        // 若数组中没有false状态.全选，否则取消全选
        if ($.inArray(false, arr) === -1) {
          this.allCheckType = true
        } else {
          this.allCheckType = false
        }
        this.totalPriceFun()
      },
      /**
       * 全选
      */
      AllCheckedFun () {
        this.allCheckType = !this.allCheckType
        this.cartList.forEach((v, index) => {
          v.checked = this.allCheckType
        })
        this.totalPriceFun()
      },
      /**
       * 数量点击
      */
      countFun () {
        this.totalPriceFun()
      },
      /**
       * 计算总金额
      */
      totalPriceFun () {
        this.totalPrice = 0
        this.cartList.forEach((v, index) => {
          if (v.checked) {
            this.totalPrice += v.goodsPrice * v.goodsNum
          }
        })
      },
      /**
       * 提交
      */
      submitFun () {
        // 将checked的状态放在一个数组中
        let arr = []
        let selectList = []
        let selectListIds = []
        this.cartList.forEach((v, index) => {
          if (v.checked) {
            selectList.push(v)
            selectListIds.push(v.id)
          }
          arr.push(v.checked)
        })
        // 若数组中没有false状态.全选，否则取消全选
        if ($.inArray(true, arr) === -1) {
          this.$vux.toast.text('请选择订单')
        } else {
          localStorage.setItem('confirmOrderInfo', JSON.stringify(selectList))
          this.$router.push({name: 'confirmOrder'})
          // this.$http.get(`${this.api.getOrderSettlement}`, {
          //   params: {
          //     shopCartIds: selectListIds.toString()
          //   }
          // }).then((res) => {
          //   console.log(res)
          //   // if (res.data.status === this.api.ERR_OK) {
          //   //   localStorage.setItem('confirmOrderInfo', JSON.stringify(selectList))
          //   //   this.$router.push({name: 'confirmOrder'})
          //   // }
          // })
        }
      },
      /**
       * 删除购物车
      */
      shopCartDelFun (v) {
        this.$http.post(this.api.shopCartDel, {
          id: v.id
        }).then((res) => {
          if (res.data.status === this.api.ERR_OK) {
            this.$vux.toast.text('删除成功')
            this.ShopCartListFun()
          }
        })
      },
      /**
       * 加入收藏夹
      */
      shopCartAddCollectFun (v) {
        this.$http.post(this.api.moveGoodsToCollection, {
          goodsId: v.goodsId,
          shopId: v.shopId
        }).then((res) => {
          if (res.data.status === this.api.ERR_OK) {
            this.$vux.toast.text('已入收藏成功')
            this.ShopCartListFun()
          } else {
            this.$vux.toast.text(res.data.msg)
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
  .shopCart {
    .moveCart{
      background: #fe8c45 !important;
    }
    .delCart{
      background: #f23030 !important;
    }
    /*商品列表*/
    .content{
      display: flex; height: 2rem;
      align-items:center;
      padding:0 0.18rem;
      border-bottom: 1px solid #ddd;
      .send-li-left{
        width: 0.55rem;
        margin-right: 0.2rem;
      }
      .send-li-center{
        img{
          width:1.6rem;
          height: 1.6rem;
        }
      }
      .send-li-right{
        height: 1.6rem;
        font-size: 0.24rem;
        flex:1;
        margin-left: 0.2rem;
        position: relative;
        overflow: hidden;
        .title{
          line-height: 1.4em;
          display: -webkit-box;
          display: -moz-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: .24rem;
        }
        .attr{
          font-size: .2rem;
          color: #999;
          margin-top: .08rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .calculate-box{
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          align-items: center;
          .price{
            color:red;
            font-size: 0.34rem;
            flex: 1;
          }
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
    }
    /*数据为空*/
    .dataEmpty{
      text-align: center;
      margin-top:.5rem;
      .dataEmpty-icon{
        display:flex;
        justify-content: center;
        img{
          width: .69rem;
          height: .67rem;
          margin-bottom: .2rem;
          margin-right:.32rem;
        }
        div{
          text-align:left;
          color:#999999;
          font-size:.24rem;
          p{
            margin-top:.1rem;
          }
        }
      }
      .dataEmpty-btn{
        width:1.68rem;
        height:.51rem;
        border:1px solid #fdc9c9;
        border-radius:5px;
        text-align:center;
        line-height:.51rem;
        font-size:.26rem;
        color:#f74d4d;
        margin:0 auto;
        margin-top:.32rem;
        margin-bottom:.38rem;
      }
    }
    /*结算*/
    .settlement-box{
      width: 7.5rem;
      height: 1rem;
      line-height: 1rem;
      position: fixed;
      left: 0;
      bottom:0;
      right: 0;
      margin:auto;
      background: #fff;
      /*总计*/
      .settlement-left{
        float: left;
        width: 5.6rem;
        flex: 1;
        .all-select{
          float: left;
          padding-left: 1.0rem;
          color:#999;
          .allIcon{
            position: absolute;
            top:-0.03rem;
            left: 0.3rem;
          }
        }
        .total{
          float: right;
          padding-right: 0.2rem;
          color:#999;
          i{
            font-size: 0.34rem;
            color:#f23030;
          }
        }
        border-top: 1px solid #eee;
      }
      /*提交按钮*/
      .settlement-right{
        float: right;
        width:1.9rem;
        background: #f23030;
        color:#fff;
        text-align: center;
        border-top: 1px solid #eee;
      }
    }
    .weui-icon-circle {
      font-size: 0.4rem;
      color: #C9C9C9;
    }
    .weui-icon-success {
      font-size: 0.4rem;
      color: #f23030;
    }
  }
</style>
