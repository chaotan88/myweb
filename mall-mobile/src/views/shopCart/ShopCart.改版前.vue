<template>
  <div class="shopCart">
    <div class="shopCart-con" :class="!isData&&isData!='2' ? 'hasDataHei' : 'noDataHei'">
    <!--列表-->
    <div class="shopCart-option" v-for="(ite, ind) in cartList">
      <!--店铺信息-->
      <div class="shopCart-shop">
        <div class="shopCart-shop-check" @click.stop.prevent="shopCheckFun(ite)">
          <icon type="success" v-if="ite.shopCheckSte"></icon>
          <icon type="circle" v-else></icon>
        </div>
        <div class="shopCart-shop-logo">
          <img :src="ite.list[0].shopLogo | filterImgUrl" v-if="ite.list[0].shopLogo">
          <img src="../../assets/images/shopLogo.png" v-else>
          <p>{{ite.list[0].shopName}}</p>
          <x-icon type="ios-arrow-forward" size=".3rem"></x-icon>
        </div>
      </div>
      <!--列表-->
      <swipeout class="shopCart-box">
        <swipeout-item transition-mode="reveal" v-for="(v,index) in ite.list" :key="index">
          <div slot="right-menu">
            <template v-if="v.saleStatus!=2 && v.delStatus!=1 && v.goodsSkuResponse.disStatus !== 1">
              <swipeout-button type="warn" class="moveCart" :width="70" @click.native="shopCartAddCollectFun(ind, index, v)"> 
                <p>移入</p>
                <p>收藏</p>
              </swipeout-button>
            </template>
            <swipeout-button @click.native="shopCartDelFun(ind, index, v)" type="primary" class="delCart" :width="70">删除</swipeout-button>
          </div>
          <!--内容-->
          <div slot="content" class="content" v-if="!isData">
            <div class="send-li-left" @click.stop.prevent="v.saleStatus!=2 && v.goodsSkuResponse.disStatus !== 1 && v.goodsSkuResponse.currentGoodsNum > 0  && v.delStatus!=1 ? oneCheckFun(v, ind) : ''">
              <icon v-if="v.checked"  type="success"></icon>
              <icon v-else type="circle"></icon>
            </div>
            <div class="send-li-content" @click="$router.push({path: '/goodDetail', query: { goodsId: v.goodsId }})">
              <!--白色遮罩-->
              <div class="Mask" v-if="v.saleStatus==2 || v.delStatus==1 || v.goodsSkuResponse.disStatus === 1 || v.goodsSkuResponse.currentGoodsNum <= 0"></div>
              <div class="send-li-center">
                <img :src="v.mainImage | filterImgUrl" >
                <!--已下架-->
                <div class="soldOut" v-if="v.saleStatus==2 || v.goodsSkuResponse.disStatus === 1">已下架</div>
                <div class="soldOut" v-else-if="v.goodsSkuResponse.currentGoodsNum <= 0">无货</div>
                <div class="soldOut" v-else-if="v.delStatus==1">已删除</div>
              </div>
              <div class="send-li-right">
                <div class="title">
                  <!-- <router-link :to="{ path: '/goodDetail', query: { goodsId: v.goodsId }}"> -->
                    {{v.goodsName}}
                  <!-- </router-link> -->
                </div>
                <div class="attr">{{v.goodsAttribute}}</div>
                <div class="calculate-box">
                  <p class="price">¥{{v.goodsSpecialPrice && v.whetherSpecial ? v.goodsSpecialPrice : v.goodsPrice | moneyFilter}}</p>
                  <div class="add-subtract">
                    <!-- <com-cartcontrol  @countFun="countFun" :ind="ind" :index="index" :good="cartList" v-model="v.goodsNum"></com-cartcontrol> -->
                    <com-cartcontrol v-model="v.goodsNum" :disableInput="false"  @change="countFun($event, v)" :max="v.currentGoodsNum" ></com-cartcontrol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </swipeout-item>
      </swipeout>
    </div>
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
    </div>
    <!--结算-->
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
          总计：<i>¥{{totalPrice | moneyFilter(1)}}</i>
        </div>
      </li>
      <!--提交按钮-->
      <li class="settlement-right" @click="submitFun">去结算({{selectNum}})</li>
    </ol>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Vue from 'vue'
  import commonGoodsList from '../../components/commonGoodsList' // 公共列表组件
  import comCartcontrol from '../../components/ComCartcontrol'
  import $ from 'jquery'
  import { Icon, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
  import { setTimeout } from 'timers'

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
        noCheckLen: [],                  // 不可点击的个数
        allListLen: 0,                  // 购物车中所有商品的个数
        allCarList: [],                  // 获取的购物车列表
        cartList: [],                   // 分组后购物车列表
        allCheckType: false,            // 选中状态
        totalPrice: 0,                  // 总金额
        isData: '2'                     // 是否有数据
      }
    },
    // watch: {
    //   cartList: {
    //     handler (val, oldVal) {
    //       console.log(val)
    //     },
    //     deep: true
    //   }
    // },
    computed: {
      selectNum () {
        var chooseNums = 0
        this.cartList.forEach((item, index) => {
          item.list.forEach((ite) => {
            if (ite.checked) {
              // chooseNums += 1
              chooseNums += ite.goodsNum
            }
          })
        })
        return chooseNums
      },
      ...mapState(['cartSte'])
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
       * 分组
       * @data 数据列表
       * @field 根据的字段分组
      */
      groupByShopId (data) {
        var obj = {}
        var arr = []
        this.noCheckLen = []
        data.forEach((item) => {
          if (!obj[item.shopId]) {
            arr.push({
              isTap: false,        // 是否可点击
              shopCheckSte: false, // 店铺是否全选
              shopId: item.shopId, // 店铺shopId
              list: [item]         // 店铺列表
            })
            obj[item.shopId] = item
          } else {
            arr.forEach((ite) => {
              if (ite.shopId === item.shopId) {
                ite.list.push(item)
              }
            })
          }
        })
        arr.forEach((item) => {
          var isTapArr = []
          item.list.forEach((ite) => {
            if (ite.saleStatus === 2 || ite.delStatus === 1 || !ite.goodsSkuResponse.currentGoodsNum || ite.goodsSkuResponse.disStatus === 1) {
              isTapArr.push(ite)
              this.noCheckLen.push(ite)
            }
          })
          if (item.list.length !== isTapArr.length) {
            item.isTap = false
          } else {
            item.isTap = true
          }
        })
        this.cartList = arr
      },
      /**
       * 获取购物车列表
      */
      ShopCartListFun () {
        this.$http.post(this.api.getShopCartList, {
        }).then((res) => {
          let resData = res.data
          this.$vux.loading.hide()
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.isData = true
            return false
          }
          this.isData = resData.data.list.length > 0 ? 0 : 1
          let datas = resData.data.list
          this.allListLen = datas.length
          this.allCarList = datas
          var arrtObj = {}
          datas.forEach((v, index) => {
            Vue.set(v, 'checked', false)
            var orderAttributeRequest = [] // 订单属性集合
            if (v.shopCartAttriList) {
              v.shopCartAttriList.forEach((ite) => {
                arrtObj = {
                  attributeId: ite.attributeId,
                  attributeValId: ite.attributeValId
                }
                orderAttributeRequest.push(arrtObj)
              })
            }
            Vue.set(v, 'orderAttributeRequest', orderAttributeRequest)
          })
          this.$nextTick(() => {
            this.groupByShopId(datas) // 数据分组
          })
        }).finally(() => {
          this.$vux.loading.hide()
        })
      },
      /**
       * 点击店铺或者单个按钮的时候是否满足全选条件
      */
      isAllCheck () {
        let arr = []
        var len = this.allCarList.filter((row) => row.saleStatus !== 2 && row.delStatus !== 1 && row.goodsSkuResponse.disStatus !== 1 && row.goodsSkuResponse.currentGoodsNum > 0).length
        this.cartList.forEach((item, index) => {
          item.list.forEach((ite) => {
            if (ite.checked) {
              arr.push(ite.checked)
            }
          })
        })
        this.allCheckType = arr.length === len ? !!true : !!false                 // 全选按钮状态
      },
      /**
       * 购物车店铺选择按钮点击
      */
      shopCheckFun (ite) {
        // ite.shopCheckSte = !ite.shopCheckSte
        // ite.list.forEach((item) => {
        //   item.checked = ite.shopCheckSte
        // })
        if (ite.isTap) {
          return false
        }
        ite.shopCheckSte = !ite.shopCheckSte
        ite.list.forEach((item) => {
          if (item.saleStatus !== 2 && item.goodsSkuResponse.disStatus !== 1 && item.goodsSkuResponse.currentGoodsNum > 0 && item.delStatus !== 1) {
            item.checked = ite.shopCheckSte
          }
        })
        this.isAllCheck() // 是否全选
        this.totalPriceFun()
      },
      /**
       * 购物车单个选择
      */
      oneCheckFun (v, ind) {
        let shopList = this.cartList[ind]
        let shopArr = []
        v.checked = !v.checked
        shopList.list.forEach((item) => {
          if (item.checked) {
            shopArr.push(item.checked)
          }
        })
        var shopListLen = shopList.list.filter((row) => row.saleStatus !== 2 && row.delStatus !== 1 && row.goodsSkuResponse.disStatus !== 1 && row.goodsSkuResponse.currentGoodsNum > 0).length
        shopList.shopCheckSte = shopArr.length === shopListLen ? !!true : !!false        // 店铺按钮状态
        this.isAllCheck() // 是否全选
        this.totalPriceFun()
      },
      /**
       * 全选
      */
      AllCheckedFun (val) {
        if (val === 1) {
          this.allCheckType = false
        } else {
          if (this.noCheckLen.length !== this.allListLen) {
            this.allCheckType = !this.allCheckType
          }
        }
        this.cartList.forEach((item) => {
          if (!item.isTap) {
            item.shopCheckSte = this.allCheckType
          }
          item.list.forEach((ite) => {
            if (ite.saleStatus !== 2 && ite.delStatus !== 1 && ite.goodsSkuResponse.disStatus !== 1 && ite.goodsSkuResponse.currentGoodsNum > 0) {
              ite.checked = this.allCheckType
            }
          })
        })
        this.totalPriceFun()
      },
      /**
       * 更新购物车数量
      */
      countFun (val, el) {
        this.$http.post(this.api.updateGoodsNumToShopCart, {
          id: el.id,
          goodsNum: val
        }).then((res) => {
          // 成功
        })
        this.totalPriceFun()
      },
      /**
       * 计算总金额
      */
      totalPriceFun () {
        this.totalPrice = 0
        this.cartList.forEach((item, index) => {
          item.list.forEach((ite) => {
            if (ite.checked) {
              if (ite.goodsSpecialPrice && ite.whetherSpecial) {
                this.totalPrice += ite.goodsSpecialPrice * ite.goodsNum
              } else {
                this.totalPrice += ite.goodsPrice * ite.goodsNum
              }
            }
          })
        })
      },
      /**
       * 判断库存是否够
      */
      judgeGoodsStock (fun) {
        var obj = {}
        var arr = []
        this.cartList.forEach((item) => {
          item.list.forEach((ite) => {
            if (ite.checked) {
              obj = {
                goodsNum: ite.goodsNum,
                skuId: ite.skuId
              }
              arr.push(obj)
            }
          })
        })
        this.$http.post(`${this.api.judgeGoodsStock}`, arr).then((res) => {
          if (res.data.status !== this.api.ERR_OK) {
            this.$vux.toast.text(res.data.msg)
            return false
          }
          fun()
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
          v.list.forEach((ite) => {
            if (ite.checked) {
              selectList.push(ite)
              selectListIds.push(ite.id)
            }
            if (ite.goodsNum) {
              arr.push(ite.checked)
            }
          })
        })
        // 若数组中没有false状态.全选，否则取消全选
        if ($.inArray(true, arr) === -1) {
          this.$vux.toast.text('请选择有效的订单')
        } else {
          this.judgeGoodsStock(() => {
            localStorage.setItem('confirmOrderInfo', JSON.stringify(selectList))
            this.$router.push({name: 'confirmOrder'})
          })
        }
      },
      /**
       * 更新购物车
      */
      updateCarList (ind, index, v) {
        // this.allCheckType = false
        // this.totalPrice = 0
        // this.cartList[ind].list.splice(index, 1)
        // this.cartList.forEach((item, index) => {
        //   item.list.forEach((ite) => {
        //     ite.checked = false
        //   })
        // })
        this.ShopCartListFun()
        setTimeout(() => {
          this.AllCheckedFun(1)
        }, 100)
        this.$store.dispatch('updateCarSte', v.id) // 更新vux中数据
        // this.cartList.splice(index, 1)
      },
      /**
       * 删除购物车
      */
      shopCartDelFun (ind, index, v) {
        this.$http.post(this.api.shopCartDel, {
          id: v.id
        }).then((res) => {
          if (res.data.status === this.api.ERR_OK) {
            this.$vux.toast.text('删除成功')
            this.updateCarList(ind, index, v)
          }
        })
      },
      /**
       * 加入收藏夹
      */
      shopCartAddCollectFun (ind, index, v) {
        this.$http.post(this.api.moveGoodsToCollection, {
          goodsId: v.goodsId,
          shopId: v.shopId,
          shopCartId: v.id
        }).then((res) => {
          if (res.data.status === this.api.ERR_OK) {
            this.$vux.toast.text('已入收藏成功')
            this.updateCarList(ind, index, v)
          } else {
            this.$vux.toast.text(res.data.msg)
          }
        })
      }
    }
  }
</script>

<style  lang=less>
  .shopCart {
    background: #f1f2f6;
    .shopCart-con{
       overflow-y: scroll;
      &.hasDataHei{
        height: calc(~"100vh - 1rem - .88rem");
      } 
      &.noDataHei{
        height: calc(~"100vh - .88rem");        
      }
    }
    .moveCart{
      background: #fe8c45 !important;
      font-size: .26rem;
    }
    .delCart{
      background: #f23030 !important;
      font-size: .28rem;
    }
    .shopCart-option{
      padding: 0 .2rem;
      .shopCart-shop{
        display: flex;
        height: .9rem;
        align-items: center;
        .shopCart-shop-check{
          margin-right: .2rem;
        }
        .shopCart-shop-logo{
          display: flex;
          align-items: center;
          color: #333333;
          font-size: .24rem;
          img{
            width: .3rem;
            height: .3rem;
            margin-right: .1rem;
          }
          p{
            max-width: 4rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .shopCart-box{
      overflow: unset;
      box-sizing: border-box;
      .vux-swipeout-item{
        height: auto;
        /* overflow: hidden; */
        margin-bottom: .2rem;
        .vux-swipeout-content{
          background: none;
          .send-li-content{
            box-shadow: 0 0 13px rgba(0,0,0,0.09);
            overflow: hidden;
            position: relative;
          }
        }
        .vux-swipeout-button-box{
          div{
            display: flex;
            justify-content: flex-end;
          }
        }
      }
    }
    /*商品列表*/
    .content{
      display: flex; 
      align-items:center;
      .send-li-left{
        width: 0.55rem;
        margin-right: 0.1rem;
      }
      .send-li-content{
        background:#fff;
        display: flex;
        flex:1;
        align-items: center;
        padding: .3rem .18rem .3rem .23rem;
      }
      .send-li-center{
        position: relative;
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
          .cartcontrol-box{
            border: none;
          }
          .cart-count{
            border: none;
            background: #eee;
          }
          .vux-x-icon{
            fill: #333333;
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
      .Mask{
        position: absolute;
        width: 100%;
        height: 99%;
        left: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.5);
        z-index: 200;
        text-align: center;
        line-height: 1.5rem;
        color: #fff;
      }
      .soldOut{
        position: absolute;
        width: 1rem;
        height: 1rem;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
        margin: auto;
        background: rgba(0, 0, 0, 0.6);
        z-index: 200;
        border-radius: 50%;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: .2rem;
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
      bottom:.88rem;
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
