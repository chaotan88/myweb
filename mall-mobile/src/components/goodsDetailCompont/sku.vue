<template>
    <div class="sku-wap">
      <!-- 商品属性弹框 -->
      <div v-transfer-dom>
        <popup v-model="attributeType" position="bottom" height="75%" @on-hide="ClosePop">
          <div class="attributeType-box" style="border-top:1px solid #fff;">
            <div class="fixedBox">
              <!--商品说明-->
              <div class="goodInfor-box">
                <ul class="goodInfor-ul">
                  <li class="left">
                    <img :src="basicGoodsInfor.mainImage | filterImgUrl" >
                  </li>
                  <li class="right">
                    <p>{{basicGoodsInfor.goodsName}}</p>
                    <!-- 正常商品 -->
                    <template v-if="orderSource ==1">
                      <span class="price">¥{{orderSource == 7 ? goodsPriceStock.goodsGroupPrice : goodsPriceStock.price | moneyFilter}}</span>
                      <!--price-->
                    </template>
                    <!-- 福利专区 -->
                      <p class="price" v-if="orderSource === 4 && goodsPriceStock.welfarewZoneData.whetherBonusPrice">
                        ¥{{goodsPriceStock.welfarewZoneData.goodsBonusPrice}}
                        <span v-if="goodsPriceStock.welfarewZoneData.goodsBonusPoints">
                        +{{goodsPriceStock.welfarewZoneData.goodsBonusPoints}}{{pageType | filterPointsTxt}}
                      </span>
                      </p>
                      <p class="price" v-if="orderSource === 5 && goodsPriceStock.welfarewZoneData.whetherLeaguePrice">
                        ¥{{goodsPriceStock.welfarewZoneData.goodsLeaguePrice}}
                        <span v-if="goodsPriceStock.welfarewZoneData.goodsLeaguePoints">
                        +{{goodsPriceStock.welfarewZoneData.goodsLeaguePoints}}{{pageType | filterPointsTxt}}
                      </span>
                      </p>
                      <p class="price" v-if="orderSource === 3 && goodsPriceStock.welfarewZoneData.whetherGoldBeanPrice">
                        ¥{{goodsPriceStock.welfarewZoneData.goodsGoldBeanPrice}}
                        <span v-if="goodsPriceStock.welfarewZoneData.goodsGoldBeanNum">
                        +{{goodsPriceStock.welfarewZoneData.goodsGoldBeanNum}}{{pageType | filterPointsTxt}}
                      </span>
                      </p>
                    <!--赠送积分 福利专区拼团不显示-->
                    <div class="exchangePoints" v-if="cangetPoints && orderSource !== 4 && orderSource == 5 && orderSource == 3 && orderSource == 7">
                      <div>
                        <span>赠送</span>
                        <span><i>{{cangetPoints}}</i>积分</span>
                      </div>
                    </div>
                    <!--库存-->
                    <p class="title">库存{{goodsPriceStock.stock}}件</p>
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
                <div class="size-color" v-for="(v,index) in basicGoodsInfor.goodsStandardList" v-if="v.goodsStandarValList.length > 0">
                  <span class="type">{{v.standardName}}</span>
                  <ul class="options-ul clr">
                    <!--选择属性-->
                    <template>
                      <li :class="{'attributeActive': item.active, 'disabled': item.disabled}" v-for="(item,i) in v.goodsStandarValList" @click="item.disabled ? '' : selectedAttributeFun(v.goodsStandarValList, 2, item.id, item)">{{item.standardValName}}</li>
                    </template>
                  </ul>
                </div>
              </div>
              <!--数量-->
              <ul class="num-box clr">
                <li class="left">数量</li>
                <li class="right">
                  <com-cartcontrol  v-model="goodsNum" :max="goodsPriceStock.stock"></com-cartcontrol>
                </li>
              </ul>
            </div>
            <!--按钮-->
            <div class="btn" :class="{'buyNoTap': noGoodSte || welfareBuySte}" @click="popConformBtn(typeNum)" v-if="orderSource !== 4 && orderSource == 5 && orderSource == 3 && orderSource == 7">{{orderSource | filterbuyBtnTxt2}}</div>
            <div class="btn" @click="popConformBtn(typeNum)" v-else>确认</div>
          </div>
        </popup>
      </div>
    </div>
</template>

<script>
  export default {
    components: {},
    props: [
      'oderData',               // 订单信息
      'show',                   // 弹框信息
      'skuOrderSource',         // 订单支付方式
      'typeNum'                 // 激活suk方式
    ],
    data () {
      return {
        skuId: '',                                 // 当前选中skuid
        attributeType:false,                      // 弹框的显示隐藏状态
        typeNum: this.typeNum || 3,              // 选规格:1 购物车:2  3:购物
        orderSource: this.skuOrderSource,        //  1:普通购物，2:分享订单,3:芯豆兑换,4:消费积分购买,5:联盟积分购买,6:一元购,7:拼团，8:限时抢购 9:幸运大抢购
        basicGoodsInfor: {},                      // 基本信息
        noGoodSte: false,                         // 无商品
        welfareBuySte: false,                     // 福利专区购买按钮是否可用
        goodsPriceStock: {                        //  价格库存信息
          price: 0,                               //  销售价
          linePrice: '',                          //  划线价
          stock: 0,                               //  库存
          points: 0,                              //  获得的积分
          isPoints: false,                        //  是否积分兑换
          whetherBlancePay: 0,                    //  是否余额支付
          welfarewZoneData: {}                    //  福利专区数据
        },
        goodsNum: 1,                              // 商品数量
        maxGoodsNum: '',                          // 最大数量
        cangetPoints: ''                          // 获得积分
      }
    },

    mounted () {

    },

    methods: {
      /**
       * 关闭弹窗
       */
      ClosePop () {
        this.attributeType = false
        document.getElementsByTagName('body')[0].style.cssText = ''
        this.typeNum = ''
      },
      /**
       *解析商品详情数据
       */
      oderDateFn () {

      },
      /**
       * 属性选择
       */
      selectedAttributeFun (arr, types, attrId, item) {
        // 清空当前属性组
        arr.forEach((v, index) => {
          if (v.id !== item.id) {
            this.$set(v, 'active', false)
          }
        })
        // 选中当前属性
        item.active = !item.active
        this.$set(item, 'active', item.active)
        this.arrValCombinat(2, attrId, item.active)
      },

      /**
       * 属性值组合
       * @types 1 默认进来选中 2 手动选中
       * @attrId 点击的第一个的id
       * @isActive  属性点击是 只有选中才执行
       */
      arrValCombinat (types, attrId, isActive) {
        let basicGoodsInfor = this.basicGoodsInfor
        let standardValIdArrs = []        // standardValId集合
        let overplus = []
        if (basicGoodsInfor.goodsStandardList.length > 0) {
          let defaultAttribute = []         // 默认值
          // 点击属性对应的属性
          basicGoodsInfor.goodsSkuList.forEach((item, ind) => {
            // 不是组合属性
            if (basicGoodsInfor.goodsStandardList.length <= 1) {
              overplus.push(item)
            } else {   // 是组合属性
              if (item.standardValIdArr.indexOf(attrId) > -1) {
                overplus.push(item)
              }
            }
          })
          // 属性设置是否可点击、获取选中值
          let arrEl = []
          basicGoodsInfor.goodsStandardList.forEach((v, index) => {
            if (v.goodsStandarValList.length > 0) {
              v.goodsStandarValList.forEach((ats, ind) => {
                if (overplus.length > 0) {
                  overplus.forEach((el) => {
                    // 不是组合属性
                    if (basicGoodsInfor.goodsStandardList.length <= 1) {
                      arrEl = el.standardValIdArr[0]
                    } else { // 是组合属性
                      var index = el.standardValIdArr.indexOf(attrId)
                      arrEl = el.standardValIdArr[el.standardValIdArr.length - 1 - index]
                    }
                    if (JSON.parse(ats.id) === JSON.parse(arrEl)) {
                      if (isActive && (el.disStatus === 1 || !el.currentGoodsNum || el.currentGoodsNum <= 0)) {
                        this.$set(ats, 'disabled', true)
                      } else {
                        if (basicGoodsInfor.goodsStandardList.length > 1) {
                          this.$set(ats, 'disabled', false)
                        }
                      }
                    }
                  })
                } else {
                  this.$set(ats, 'disabled', false)
                }
              })
              if (v.goodsStandarValList.filter((row) => !row.disabled).length > 0) {
                if (types === 1) {
                  v.goodsStandarValList.filter((row) => !row.disabled)[0].active = true                                // 第一个属性默认选中状态
                  standardValIdArrs.push(v.goodsStandarValList.filter((row) => !row.disabled)[0].id)                   // 选中的id集合
                  defaultAttribute.push(v.goodsStandarValList.filter((row) => !row.disabled)[0].standardValName)       // 选中属性值
                } else {
                  if (v.goodsStandarValList.filter((row) => row.active).length > 0) {
                    standardValIdArrs.push(v.goodsStandarValList.filter((row) => row.active)[0].id)                      // 选中的id集合
                    defaultAttribute.push(v.goodsStandarValList.filter((row) => row.active)[0].standardValName)       // 选中属性值
                  }
                }
              }
            }
          })
          if (types === 1) {
            if (standardValIdArrs[1]) {
              this.arrValCombinat(2, standardValIdArrs[1], true)          // 属性值组合
            }
          }
          // 获取选中的个数
          let activeLen = []
          this.basicGoodsInfor.goodsStandardList.forEach((item) => {
            item.goodsStandarValList.forEach((ite) => {
              if (ite.active) {
                activeLen.push(ite)
              }
            })
          })
          // 取出默认选中的属性对应的库存、价格
          basicGoodsInfor.goodsSkuList.forEach((item, index) => {
//            console.log(item, 'item')
            if (item.goodsSkuValList.length > 0) {
              let len = this.basicGoodsInfor.goodsStandardList.length
              if (activeLen.length === len) {
                if (item.standardValIdArr.toString() === standardValIdArrs.toString()) {
                  this.goodsPriceStock = {
                    price: item.whetherSpecial && item.goodsSpecialPrice ? item.goodsSpecialPrice : item.goodsPrice,
                    linePrice: item.whetherSpecial && item.goodsSpecialPrice ? item.goodsPrice : '',
                    stock: item.currentGoodsNum,
                    points: item.points || 0,
                    isPoints: item.whetherPoints ? !!true : !!false,
                    whetherBlancePay: item.whetherBlancePay,
                    welfarewZoneData: item,
                    goodsGroupPrice: item.goodsGroupPrice
                  }
                  this.skuId = item.id
                  this.welfarewBuyJudge()      // 福利购买按钮是否能点击
                  this.getPointsByGoodsSku()   // 计算能获得多少积分
                }
              } else {
                this.goodsPriceStock = {
                  price: this.filterMinMoney(basicGoodsInfor.goodsSkuList),
                  linePrice: '',
                  stock: basicGoodsInfor.totalStock,
                  points: '',
                  isPoints: false,
                  whetherBlancePay: 0,
                  welfarewZoneData: {},
                  goodsGroupPrice: basicGoodsInfor.goodsSkuList[0].goodsGroupPrice
                }
                this.cangetPoints = 0
              }
            }
          })
          // 循环sku list通过standardValIdArr找到对应的库存、价格等
          this.defaultAttributeList = defaultAttribute
        } else {
          // basicGoodsInfor.goodsSkuList[0]
//          console.log(basicGoodsInfor.goodsSkuList[0], 'item')
          let bPrice = basicGoodsInfor
          this.goodsPriceStock = {
            price: bPrice.whetherSpecial && bPrice.goodsSpecialPrice ? bPrice.goodsSpecialPrice : bPrice.goodsPrice,
            linePrice: bPrice.whetherSpecial && bPrice.goodsSpecialPrice ? bPrice.goodsPrice : '',
            stock: basicGoodsInfor.totalStock,
            points: basicGoodsInfor.goodsSkuList[0].points,
            isPoints: basicGoodsInfor.goodsSkuList[0].whetherPoints ? !!true : !!false,
            whetherBlancePay: basicGoodsInfor.goodsSkuList[0].whetherBlancePay,
            welfarewZoneData: bPrice.goodsSkuList[0],
            goodsGroupPrice: basicGoodsInfor.goodsSkuList[0].goodsGroupPrice
          }
          this.skuId = basicGoodsInfor.goodsSkuList[0].id
          this.welfarewBuyJudge()      // 福利购买按钮是否能点击
          this.getPointsByGoodsSku()   // 计算能获得多少积分
        }
      },
      /**
       * 弹窗确定按钮
       * @typeNum 2 加入购物车 3 普通确认订单  福利专区确认订单4
       */
      popConformBtn (typeNum) {
//        console.log(typeNum)
        if (this.noGoodSte || (this.pageType && this.welfareBuySte && parseInt(typeNum) === 4)) {
          return false
        }
        this.typeNum = typeNum
        let basicGoodsInfor = this.basicGoodsInfor
        // 没有属性
        if (basicGoodsInfor.goodsStandardList.length <= 0) {
          this.skuId = basicGoodsInfor.goodsSkuList[0].id        // 获取选中的skuId
        } else {    // 有属性
          let activeLen = []
          basicGoodsInfor.goodsStandardList.forEach((item) => {
            item.goodsStandarValList.forEach((ite) => {
              if (ite.active) {
                activeLen.push(ite.id)
              }
            })
          })
          let len = basicGoodsInfor.goodsStandardList.length
          if (activeLen.length === len) {
            basicGoodsInfor.goodsSkuList.forEach((item, index) => {
              if (item.standardValIdArr.toString() === activeLen.toString()) {
                this.skuId = item.id                  // 获取选中的skuId
              }
            })
          } else {
            this.$vux.toast.text('请选择属性')
            return false
          }
        }
        this.judgeGoodsStock(() => {
          if (typeNum === 2) {
            this.joinCart()
          } if (typeNum === 3 || typeNum === 4) {
            this.confirmOrder()
          }
          if (typeNum === 7) {
            this.confirmOrder()
//            console.log('拼单接口')
          }
          if (typeNum === 1) {
            this.attributeType = false
          }
        })
      },
      /**
       * 确认订单
       */
      confirmOrder () {
        // 属性拼接
        let goodsAttribute = []
        if (this.basicGoodsInfor.goodsStandardList.length > 0) {
          var obj = {}
          var arr = []
          this.basicGoodsInfor.goodsStandardList.forEach((ite) => {
            ite.goodsStandarValList.forEach((item) => {
              if (item.active) {
                goodsAttribute.push(ite.standardName + ': ' + item.standardValName)
                obj = {
                  attributeId: ite.attributeId,
                  attributeName: ite.attributeName,
                  attributeValId: item.attributeValId,
                  attributeValName: item.attributeVal
                }
                arr.push(obj)
              }
            })
          })
        }
        // 立即购买 请求
        this.$http.post(`${this.api.getBuySoon}`, {
          goodsId: this.goodsId,
          goodsNum: this.goodsNum,
          skuId: this.skuId,
          goodsAttribute: goodsAttribute.toString()
        }).then((res) => {
          if (res.data.status === this.api.ERR_OK) {
            this.$vux.toast.text('确认成功')
            let resData = res.data.data
            // 拼接属性id
            if (resData.goodsAttriBySoonList && resData.goodsAttriBySoonList.length > 0) {
              var attributeId = []
              var attributeValId = []
              var orderAttributeRequest = [] // 订单属性集合
              var arrtObj = {}
              resData.goodsAttriBySoonList.forEach((item) => {
                attributeId.push(item.attributeId)
                attributeValId.push(item.attributeValId)
                arrtObj = {
                  attributeId: item.attributeId,
                  attributeValId: item.attributeValId
                }
                orderAttributeRequest.push(arrtObj)
              })
              resData.attributeId = attributeId.toString()
              resData.attributeValId = attributeValId.toString()
            }
            resData.skuId = this.skuId
            resData.brand = this.basicGoodsInfor.brand
            resData.brandLogo = this.basicGoodsInfor.brandLogo
            resData.whetherBlancePay = this.goodsPriceStock.whetherBlancePay
            resData.storageName = this.basicGoodsInfor.storageName
            resData.canGetPoints = this.cangetPoints
            resData.shopId = this.basicGoodsInfor.shopId
            resData.shopName = this.basicGoodsInfor.shopName
            resData.orderSource = this.orderSource
            //orderSource: 1:普通购物，2:分享订单,3:芯豆兑换,4:消费积分购买,5:联盟积分购买,6:一元购,7:拼团，8:限时抢购
            // 福利区价格统计
            if (this.typeNum === 4) {
              localStorage.setItem('CONFIRM_ORDER_TYPE', resData.orderSource)
              if (this.orderSource === 4 && this.goodsPriceStock.welfarewZoneData.whetherBonusPrice) {
                resData.goodsPrice = this.goodsPriceStock.welfarewZoneData.goodsBonusPrice
                resData.typePonts = this.goodsPriceStock.welfarewZoneData.goodsBonusPoints
              } else if (this.orderSource === 5 && this.goodsPriceStock.welfarewZoneData.whetherLeaguePrice) {
                resData.goodsPrice = this.goodsPriceStock.welfarewZoneData.goodsLeaguePrice
                resData.typePonts = this.goodsPriceStock.welfarewZoneData.goodsLeaguePoints
              } else if (this.orderSource === 3 && this.goodsPriceStock.welfarewZoneData.whetherGoldBeanPrice) {
                resData.goodsPrice = this.goodsPriceStock.welfarewZoneData.goodsGoldBeanPrice
                resData.typePonts = this.goodsPriceStock.welfarewZoneData.goodsGoldBeanNum
              } else {
                resData.goodsPrice = resData.whetherSpecial && resData.goodsSpecialPrice ? resData.goodsSpecialPrice : resData.goodsPrice
              }
            } else {
              // 非福利区 价格
               if (this.orderSource === 7) {
                 // 非福利区 拼团价格统计
                 resData.themeId = parseInt(this.themeId)
                 resData.ifHeadUser = this.groupId ? 0 : 1
                 resData.groupId = resData.ifHeadUser ? null : parseInt(this.groupId)
                 resData.canGetPoints = 0
                 resData.whetherBlancePay = 0
//              console.log(resData)
                 resData.goodsGroupPrice = this.goodsPriceStock.goodsGroupPrice
                 localStorage.setItem('CONFIRM_ORDER_TYPE', 7)
               }else {
                 localStorage.setItem('CONFIRM_ORDER_TYPE', 7)
               }
            }
            resData.shareInvitationCode = this.shareInvitationCode                         // 推荐分享进来的code
            resData.orderAttributeRequest = orderAttributeRequest                          // 订单属性集合
            localStorage.setItem('confirmOrderInfo', JSON.stringify([resData]))            // 存储确认订单页所需数据
            setTimeout(() => {
              this.$router.replace({path: '/confirmOrder'})
            }, 100)
          } else {
            this.$vux.toast.text(res.data.msg)
          }
        })
      },

      /**
       * 能获得多少积分
       */
      getPointsByGoodsSku () {
        this.$http.get(`${this.api.getPointsByGoodsSku}`, {
          params: {
            skuId: this.skuId
          }
        }).then((res) => {
          let resData = res.data
          this.cangetPoints = resData.data
        })
      },
      /**
       * 福利购买按钮是否能点击
       */
      welfarewBuyJudge () {
        if (this.orderSource === 4) {
          this.welfareBuySte = this.totalIntegral.bonusPoints < this.goodsPriceStock.welfarewZoneData.goodsBonusPoints || !this.goodsPriceStock.welfarewZoneData.whetherBonusPrice ? !!true : !!false
        } if (this.orderSource === 5) {
          this.welfareBuySte = this.totalIntegral.leaguePoints < this.goodsPriceStock.welfarewZoneData.goodsLeaguePoints ||
          !this.goodsPriceStock.welfarewZoneData.whetherLeaguePrice ? !!true : !!false
        } if (this.orderSource === 3) {
          this.welfareBuySte = this.totalIntegral.goldPoints < this.goodsPriceStock.welfarewZoneData.goodsGoldBeanNum || !this.goodsPriceStock.welfarewZoneData.whetherGoldBeanPrice ? !!true : !!false
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .sku-wap{
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
              overflow: hidden;
              p{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .title{
                font-size: 0.2rem;
                color:#999;
                /* margin-top:0.1rem; */
              }
              .price{
                color:#f23030;
                font-size: 0.26rem;
                margin-top:0.18rem;
                margin-bottom: .03rem;
              }
              .exchangePoints{
                color:#ff9700;
                font-size: .24rem;
                position: absolute;
                right: .62rem;
                margin-top: .18rem;
                div{
                  height: .3rem;
                  line-height: .3rem;
                  border: 1px solid #f23030;
                  border-radius: 10px;
                  display: -webkit-inline-box;
                  display: -ms-inline-flexbox;
                  display: inline-flex;
                  font-size: .24rem;
                  color: #f23030;
                  -webkit-box-align: center;
                  -ms-flex-align: center;
                  align-items: center;
                  overflow: hidden;
                  span:nth-child(1){
                    height: 100%;
                    background: #f23030;
                    color: #fff;
                    font-size: .24rem;
                    border-top-left-radius: 8px;
                    border-bottom-left-radius: 8px;
                    padding: 0 .08rem;
                    display: flex;
                    align-items: center;
                    vertical-align: middle;
                  }
                  span:nth-child(2){
                    padding: 0 .08rem;
                    display: flex;
                    align-items: center;
                    i{
                      max-width: 2rem;
                      display: inline-block;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }
                }
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
            .disabled{
              background: #f5f5f5;
              color: #cfcfcf;
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
        &.buyNoTap{
          background: #ccc;
        }
      }
    }
  }
</style>
