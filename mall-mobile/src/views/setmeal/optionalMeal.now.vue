<template>
  <div class="optionalMeal-wrap">
    <!--内容区-->
    <div class="optionalMeal-content">
      <div class="optionalMeal-content-l">
        <ul>
          <li v-for="(item, index) in leftData" :class="tabBarIndex == index ? 'active' : ''" @click="getRightData(index, item)">
            <span>{{item.columnName}}</span>
          </li>
        </ul>
      </div>
      <div class="optionalMeal-content-r" v-infinite-scroll="loadMoreData" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
        <div class="banner">
          <img :src="rightMainImg | filterImgUrl">
        </div>
        <!--列表-->
        <ul>
          <template  v-for="item in 5" v-if="skeletonLoading">
            <vcl-facebook style="margin-bottom:.2rem;"></vcl-facebook>
          </template> 
          <li v-for="(item, index) in allDataList[tabBarIndex]" @click="$router.push({path: '/goodDetail', query: {goodsId: item.id}})">
            <div class="optionalMeal-list-l">
              <img :src="item.mainImage | filterImgUrl">
            </div>
            <div class="optionalMeal-list-r">
              <div class="optionalMeal-list-r-tit">{{item.goodsName}}</div>
              <div class="optionalMeal-list-r-point">获得：{{item.canGetPoint}}积分</div>
              <div class="optionalMeal-list-r-bot">
                <div class="optionalMeal-list-r-bot-price">¥{{item.goodsSpecialPrice ? item.goodsSpecialPrice : item.goodsPrice}}</div>
                <div class="cartcontrol">
                  <div class="cartcontrol-box" v-if="item.goodsNum">
                    <!--减-->
                    <div class="cart-decrease" @click.stop="goodsNumReduce(index, 1)">
                      <x-icon type="ios-minus-empty" size="20"></x-icon>
                    </div>
                    <!-- <li class="cart-count">{{count}}</li> -->
                    <input type="tel" class="cart-count" disabled v-model="item.goodsNum">
                    <!--加-->
                    <div class="cart-add" @click.stop="goodsNumIncrease(index, 1)">
                      <x-icon type="ios-plus-empty" size="20"></x-icon>
                    </div>
                  </div>
                  <div class="sing-plus" @click.stop="showPop(index, item)" v-else><x-icon type="ios-plus-empty" size="20"></x-icon></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <!--加载loading-->
        <load-more tip="数据加载中" v-if="showLoading"></load-more>
        <!--无数据-->
        <no-data-component v-if="noData"></no-data-component>
      </div>
    </div>
    <!--底部-->
    <div class="optionalMeal-footer">
      <div>
        <p>应付金额: <span>{{calculatPrice()[0]}}元</span></p>
        <p>累计积分: <span>{{calculatPrice()[1]}}个</span></p>
      </div>
      <div @click="buyNow">去购买</div>
    </div>
    <!--商品属性弹框-->
    <div>
      <popup v-model="attributeType" position="bottom" height="50%" @on-hide="ClosePop">
        <div class="attributeType-box" style="border-top:1px solid #fff;">
          <div class="fixedBox">
            <!--商品说明-->
            <div class="goodInfor-box">
              <ul class="goodInfor-ul">
                <li class="left">
                  <img :src="popUseData.mainImage | filterImgUrl">
                </li>
                <li class="right">
                  <span class="price">￥{{popUseData.goodsSpecialPrice ? popUseData.goodsSpecialPrice : popUseData.goodsPrice}}</span>
                  <p class="title">商品编号：{{popUseData.goodsNo}}</p>
                </li>
                <div class="del-box" @click="attributeType=false">
                  <x-icon type="ios-close-empty" size="30"></x-icon>
                </div>
              </ul>
            </div>
          </div>
          <div class="attrStyle" id="attrStyle">
          <!--尺码-颜色-->
          <div class="sizeColor-box">
            <div class="size-color" v-for="(v,index) in popUseData.goodsAttributeList" v-if="v.attributeValList.length > 0">
              <span class="type">{{v.attributeName}}</span>
              <ul class="options-ul clr">
                <!--选择属性-->
                <template v-if="v.goodsAttributeType==1">
                  <li :class="item.active ? 'attributeActive' : ''" v-for="(item,i) in v.attributeValList" @click="selectedAttributeFun(v.attributeValList, item)">{{item.attributeVal}}</li>
                </template>
                <!--文本属性-->
                <template v-if="v.goodsAttributeType==2">
                  <li class="textAttribute attributeActive">{{v.goodsAttributeVal}}</li>
                </template>
              </ul>
            </div>
          </div>
          <!--数量-->
          <ul class="num-box clr">
            <li class="left">数量</li>
            <li class="right">
              <div class="cartcontrol-box">
                <!--减-->
                <div class="cart-decrease" @click="goodsNumReduce('', 2)">
                  <x-icon type="ios-minus-empty" size="20"></x-icon>
                </div>
                <input type="tel" class="cart-count" disabled :value="popInpVal">
                <!--加-->
                <div class="cart-add" @click="goodsNumIncrease('', 2)">
                  <x-icon type="ios-plus-empty" size="20"></x-icon>
                </div>
              </div>
            </li>
          </ul>
          </div>
          <!--按钮-->
          <div class="btn" @click="popConfirmBtnTap">确认</div>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import noDataComponent from '../../components/noData'    // 暂无数据
  import comCartcontrol from '../../components/ComCartcontrol'
  import { Popup, LoadMore } from 'vux'       // 轮播图,底部弹框
  import { VclFacebook } from 'vue-content-loading'   // 加载骨架图
  export default {
    props: ['columnData', 'navIndex'],
    components: {
      comCartcontrol,
      Popup,
      LoadMore,
      noDataComponent,
      VclFacebook
    },
    data () {
      return {
        skeletonLoading: false,                   // 骨架加载loading
        noData: false,                            // 暂无数据
        showLoading: false,                       // 是否显示加载loading
        selectDataList: [],                       // 选中的数据集合
        popUseData: '',                           // 属性弹窗所需的数据
        popInpVal: 1,                             // 弹窗input的value
        attributeType: false,                     // 弹框的显示隐藏状态
        tabBarIndex: 0,                           // 左侧栏目选中状态
        leftData: [],                             // 左侧数据
        allDataList: [],                          // 所有分类数据集合
        goodsIndex: null,                         // 右侧列表的索引
        rightMainImg: '',                            // 右侧列表的主图
        cover: false,                             // 栏目是否点击
        busy: false,                              // 无限滚动状态
        pagesList: [],                            // 当前页与总页数集合
        pageSize: 10                              // 每页显示几条
      }
    },
    watch: {
      'navIndex' () {
        this.tabBarIndex = 0 // 重置左侧列表索引
        this.pagesList[this.tabBarIndex].start = 1 // 重置当前页数
        this.getLeftDatas()
      }
    },
    mounted: function () {
      // this.$router.push({query: {page: 'ddd'}})
      this.getLeftDatas()
    },
    methods: {
      /**
       * 打开属性弹窗
      */
      showPop (index, item) {
        this.attributeType = true
        this.goodsIndex = index
        this.popInpVal = 1
        this.popUseData = item
        // 默认选中
        if (this.popUseData.goodsAttributeList) {
          this.popUseData.goodsAttributeList.forEach((v, index) => {
            if (v.goodsAttributeType === 1) {
              // 给每个选项添加'active'属性
              v.attributeValList.forEach((item, i) => {
                this.$set(item, 'active', false)
              })
              if (v.attributeValList.length > 0) {
                v.attributeValList[0].active = true
              }
            }
          })
        }
      },
      /**
       * 获取左侧数据
      */
      getLeftDatas () {
        this.leftData = this.columnData[this.navIndex].columnResList
        this.columnId = this.leftData[0].id
        this.rightMainImg = this.leftData[0].mainImage
        this.allDataList = []
        let list = this.columnData[this.navIndex].columnResList
        list.forEach((item) => {
          this.allDataList.push([])          // 所有数据集合
          this.pagesList.push({              // 所有当前页集合
            start: 1,
            totalPage: 0
          })
        })
        this.RightData(this.columnId)   // 根据左侧加载右侧数据
      },
      /**
       * 获取右侧数据
      */
      RightData (columnId) {
        this.skeletonLoading = true
        this.$http.post(this.api.getSetmealGoodsListByColumnId, {
          start: this.pagesList[this.tabBarIndex].start,
          pageSize: this.pageSize,
          columnId: columnId
        }).then((res) => {
          this.busy = false // 重置busy状态
          this.showLoading = false
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          this.noData = res.data.data.list.length > 0 ? 0 : 1
          // 添加是否有数量属性
          res.data.data.list.forEach((item) => {
            this.$set(item, 'goodsNum', 0)
          })
          // 是否点击
          if (this.cover) {
            this.allDataList[this.tabBarIndex] = res.data.data.list
            this.$set(this.allDataList, this.tabBarIndex, this.allDataList[this.tabBarIndex])
          } else {
            this.allDataList[this.tabBarIndex] = this.allDataList[this.tabBarIndex].concat(res.data.data.list)
            this.$set(this.allDataList, this.tabBarIndex, this.allDataList[this.tabBarIndex])
            // this.allDataList[this.tabBarIndex] = this.allDataList[this.tabBarIndex].concat(res.data.data.list)
          }
          this.pagesList[this.tabBarIndex].start = this.pagesList[this.tabBarIndex].start + 1             // 当前页数
          this.pagesList[this.tabBarIndex].totalPage = res.data.data.pages                                // 总页数
          // this.totalPage = res.data.data.pages    // 总页数
        }).finally(() => {
          this.skeletonLoading = false
        })
      },
      /**
       * 根据左侧获取右侧数据
      */
      getRightData (index, item) {
        this.tabBarIndex = index
        this.cover = true
        this.showLoading = false
        this.start = 1
        this.busy = false // 重置busy状态
        this.columnId = item.id
        this.rightMainImg = item.mainImage
        if (this.allDataList[this.tabBarIndex].length <= 0) {
          this.pagesList[this.tabBarIndex].start = 1
          this.RightData(this.columnId)
        }
      },
      /**
       * 数量加
       * @types 1 列表数量点击 2 弹窗数量点击
      */
      goodsNumIncrease (index, types) {
        if (types === 1) {
          if (!this.allDataList[this.tabBarIndex][index].goodsNum) {
            this.allDataList[this.tabBarIndex][index].goodsNum = 1
          } else {
            this.allDataList[this.tabBarIndex][index].goodsNum++
          }
          this.calculatPrice()
        } else if (types === 2) {
          this.popInpVal++
        }
      },
      /**
       * 数量减
       * @types 1 列表数量点击 2 弹窗数量点击
      */
      goodsNumReduce (index, types) {
        if (types === 1) {
          this.allDataList[this.tabBarIndex][index].goodsNum--
          this.calculatPrice()
        } else if (types === 2) {
          if (this.popInpVal > 1) {
            this.popInpVal--
          }
        }
      },
      /**
       * 属性选择
      */
      selectedAttributeFun (arr, item) {
        // 清空当前属性组
        arr.forEach((v, index) => {
          this.$set(v, 'active', false)
        })
        // 选中当前属性
        this.$set(item, 'active', true)
      },
      /**
       * 弹窗确定按钮
      */
      popConfirmBtnTap () {
        this.attributeType = false
        this.allDataList[this.tabBarIndex][this.goodsIndex].goodsNum = this.popInpVal
        this.calculatPrice()
      },
      /**
       * 关闭弹窗
      */
      ClosePop () {
        this.attributeType = false
      },
      /**
       * 计算应付金额
      */
      calculatPrice () {
        let totalPrice = 0
        let totalPonts = 0
        this.allDataList.forEach((item) => {
          item.forEach((ite) => {
            if (ite.goodsNum) {
              totalPrice += (ite.goodsSpecialPrice ? ite.goodsSpecialPrice : ite.goodsPrice) * ite.goodsNum
              totalPonts += ite.canGetPoint * ite.goodsNum
            }
          })
        })
        return [totalPrice.toFixed(2), totalPonts]
      },
      /**
       * 立即购买
      */
      buyNow () {
        this.selectDataList = []
        let carArr = []
        let carParm = {}
        let obj = {}
        let selectArrt = []
        this.allDataList.forEach((item) => {
          item.forEach((ite) => {
            if (ite.goodsNum) {
              this.selectDataList.push(ite)
              ite.goodsAttributeList.forEach((v) => {
                v.attributeValList.forEach((vm) => {
                  if (vm.active) {
                    obj = {
                      goodsAttributeId: v.id,
                      goodsAttributeValId: vm.id
                    }
                    selectArrt.push(obj)
                  }
                })
              })
              carParm = {
                goodsId: ite.id,
                goodsNum: ite.goodsNum,
                shopId: ite.shopId,
                shopCartAttributeList: selectArrt
              }
              carArr.push(carParm)
            }
          })
        })
        if (this.selectDataList.length <= 0) {
          this.$vux.toast.text('请先选择商品')
          return false
        }
        // 批量加入购物车
        this.$http.post(this.api.saveShopCartList, carArr).then((res) => {
          let resData = res.data
          this.$vux.toast.text(resData.msg)
          if (resData.status !== this.api.ERR_OK) {
            return false
          }
          this.$router.push({name: 'shopCart'})
        })
      },
      /**
       * 分页
      */
      loadMoreData () {
        this.cover = false
        this.busy = true // 加载状态
        if (!this.showLoading) {
          this.showLoading = true
          if (this.pagesList[this.tabBarIndex].start > this.pagesList[this.tabBarIndex].totalPage) {
            this.showLoading = false
            return
          }
        }
        this.RightData(this.columnId) // 分页数据
      }
    }
  }
</script>
<style scoped lang=less>
  .optionalMeal-wrap{
    /**nav栏目**/
    .optionalMeal-nav{
      height: .78rem;
      background: linear-gradient(to right, #f05033, #fe8d33);
      ul{
        overflow: hidden;
        overflow-x: scroll;
        white-space: nowrap;
        line-height: .78rem;
        &::-webkit-scrollbar {
          height: 0px;
        }
        li{
          display: inline-block;
          margin: 0 .27rem;
          font-size: .28rem;
          color: rgba(255,255,255,0.7);
          position: relative;
          &.active{
            color: #fff;
            font-weight: bold;
            span{
              &::after{
                content: '';
                height: .06rem;
                background: #f6be99;
                display: block;
                position: absolute;
                left: 0;
                right: 0;
                margin: auto;
                bottom: .08rem;
                border-radius: 5px;
              }
            }
          }
        }
      }
    }
    /**内容区**/
    .optionalMeal-content{
      display: flex;
      height: calc(~"100vh - .78rem - 1rem ");
      overflow: hidden;
      /**左侧**/
      .optionalMeal-content-l{
        width: 1.77rem;
        background: #f6f6f6;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        ul{
          li{
            height: 0.9rem;
            text-align: center;
            line-height: 0.9rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333333;
            font-size: .26rem;
            position: relative;
            span{
              margin: 0 .1rem;
            }
            /*选中效果*/
            &.active{
              background: #fff;
              color:#333333;
              font-weight: bold;
              &::before{
                content: '';
                width: .07rem;
                height: .28rem;
                background: #f74d4d;
                display: block;
                position: absolute;
                left: 0;
                bottom: 0;
                top: 0;
                margin: auto;
              }
            }
          }
        }
      }
      /**右侧**/
      .optionalMeal-content-r{
        overflow: hidden;
        overflow-y: scroll;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        padding: 0.2rem;
        .banner{
          width:100%;
          height: 1.8rem;
          border-radius: 5px;
          img{
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
        }
        /**列表**/
        ul{
          margin-top: .1rem;
          li{
            display: flex;
            border-bottom: 1px solid #dddddd;
            padding: .27rem 0;
            align-items: center;
            .optionalMeal-list-l{
              width: 1.4rem;
              height: 1.4rem;
              margin-right: .28rem;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .optionalMeal-list-r{
              flex:1;
              .optionalMeal-list-r-tit{
                color: #333333;
                font-size: .24rem;
                display: -webkit-box;
                display: -moz-box;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
              }
              .optionalMeal-list-r-point{
                color: #ff9700;
                font-size: .22rem;
                background: rgba(255,151,0,0.2);
                border-radius: 40px;
                display: inline-block;
                padding: 1px .15rem;
                margin-top: .1rem;
              }
              .optionalMeal-list-r-bot{
                display: flex;
                margin-top: .2rem;
                align-items: center;
                .optionalMeal-list-r-bot-price{
                  color: #f23030;
                  font-size: .3rem;
                  flex: 1;
                }
                .cartcontrol {
                  .sing-plus{
                    width: .48rem;
                    height: .48rem;
                    border:1px solid #cccccc;
                    border-radius: 3px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .vux-x-icon {
                      fill: #333;
                      width: .4rem;
                      height: .4rem;
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
            }
          }
        }
      }
    }
    /**数量控制器**/
    .cartcontrol-box{
      width:1.8rem;
      height: 0.48rem;
      line-height: 0.48rem;
      border:1px solid #cccccc;
      border-radius: 3px;
      div, input{
        float: left;
        height: 0.5rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      input{
        background: none;
        height: 100%;
      }
      /*减*/
      .cart-decrease{
        width: 0.5rem;
      }
      .cart-count{
        width: 0.75rem;
        border-left: 1px solid #cccccc;
        border-right: 1px solid #cccccc;
        color:#333;
      }
      /*加*/
      .cart-add{
        width:0.5rem;
      }
      .vux-x-icon {
        fill: #333;
        width: .4rem;
        height: .4rem;
      }
    }
    /**底部**/
    .optionalMeal-footer{
      display: flex;
      width: 7.5rem;
      height: 1rem;
      background: #fff;
      padding-left: .4rem;
      align-items: center;
      box-sizing: border-box;
      -webkit-box-shadow: 0 0 10px 0 rgba(154, 141, 141, 0.6);
      position: relative;
      div:nth-child(1) {
        flex: 1;
        p{
          font-size: .24rem;
          color: #666666;
          span{
            color: #f23030;
            font-size: .28rem;
          }
        }
      }
      div:nth-child(2) {
        width: 1.9rem;
        height: 1rem;
        background: #f23030;
        text-align: center;
        line-height: 1rem;
        font-size: .3rem;
        color: #fff;
      }
    }
    /*弹框*/
    .vux-popup-dialog{
      background: #fff;
      left: 0;
      right: 0;
      margin: auto;  
      max-width: 7.5rem;   
      overflow-y:initial;
    }
    .swiper-wrap{
      background: #eee;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .vux-swiper-desc{
      background: red;
    }
    .attributeType-box{
      background: #fff;
      .fixedBox{
        width: 100%;
        /* position: fixed; */
        left: 0;
        z-index: 501;
        background: #fff;
        /*商品说明*/
        .goodInfor-box{
          padding-left:0.3rem;
          border-bottom: 1px solid #eee;
          .goodInfor-ul{
            display: flex;
            width: 100%;
            .left{
              width:1.6rem;
              height: 1.6rem;
              position: relative;
              img{
                width: 100%;
                height: 100%;
                /* position: absolute;
                top:-0.3rem;
                left: 0; */
                margin-top: -0.3rem;
                border-radius: 0.10rem;
              }
            }
            .right{
              display: flex;
              flex: 1;
              flex-direction: column;
              justify-content: center;
              margin-left: 0.2rem;
              padding-right: 0.3rem;
              .title{
                font-size: 0.24rem;
                color:#999;
                margin-top:0.1rem;
              }
              .price{
                color:#f23030;
                font-size: 0.34rem;
                margin-top:0.2rem;
              }
            }
            /*删除按钮*/
            .del-box{
              .vux-x-icon-ios-close-empty {
                fill: #999;
              }
            }
          }
        }
      }
      ::-webkit-scrollbar{width:0px}
      .attrStyle{
        width: 100%;
        border: none;
        position: absolute;
        top: 1.6rem;
        bottom:1rem;
        overflow-y: scroll;
      }
      /*尺码-颜色*/
      .sizeColor-box{
        padding-left: 0.3rem;
        /* margin-top: 1.6rem; */
        .size-color{
          border-bottom: 1px solid #eee;
          .type{
            display: inline-block;
            padding:0.3rem 0 0.3rem 0.3rem;
            font-size: 0.28rem;
          }
          .options-ul{
            li{
              min-width: 1.5rem;
              min-height: 0.5rem;
              text-align: center;
              line-height: 0.5rem;
              border-radius: 0.5rem;
              background: #eee;
              float: left;
              margin-left: 0.3rem;
              margin-bottom: 0.3rem;
              padding:0 0.2rem;
              font-size: .24rem;
            }
            .textAttribute{
              width: auto;
              text-align: left;
              padding:0 0.4rem;
            }
            .attributeActive{
              background: #f23030;
              color:#fff;
            }
          }
        }
      }
      /*数量*/
      .num-box{
        height: 1.7rem;
        padding:0.3rem;
        .left{
          float: left;
          font-size: .28rem;
        }
        .right{
          float: right;
        }
      }
      /*按钮*/
      .btn{
        width: 100%;
        max-width: 7.5rem;
        height: .8rem;
        line-height: .8rem;
        text-align: center;
        font-size: 0.32rem;
        background: #f23030;
        color:#fff;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 0;
        z-index: 999999;
      }
    }
  }
</style>