<template>
    <div class="sku-wap">
      <!-- 商品属性弹框 -->
      <div>
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
                    <p >{{basicGoodsInfor.goodsName}}</p>
                    <!-- 正常商品 -->
                    <template>
                      <span class="price">¥{{goodsPriceStock.price | moneyFilter}}</span>
                      <!--price-->
                    </template>
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
                <li class="left">数量 {{orderSource}}</li>
                <li class="right">
                  <com-cartcontrol  v-model="goodsNum" :max="1" :min="1"></com-cartcontrol>
                </li>
              </ul>
            </div>
            <!--按钮-->
            <div class="bottom">
              <!--<p> 增加<span class="red">{{luckyData.luckyAddPrice || 0}}</span>元购买 <span class="red">{{luckyData.luckyPurchaseNum || 0}}</span> 个销售名额，商品售出获<span class="red">{{luckyData.luckyReturnPrice || 0}}</span>元</p>-->
              <div class="btn" @click="popConformBtn(typeNum)">立即购买</div>
            </div>
          </div>
        </popup>
      </div>
    </div>
</template>

<script>
  import {Popup, Icon} from 'vux'                     // 轮播图,底部弹框
  import comCartcontrol from '../../components/ComCartcontrol'
  import { mapState } from 'vuex'
  export default {
    components: {
      Popup,
      Icon,
      comCartcontrol
    },
    props: [
      'oderDate',
      'skuOrderSource',
      'skuGoodsId',               // 订单信息
      'show',                  // 弹框信息
      'activeTypeData'         // 活动状态
    ],
    data () {
      return {
        deft: false,                              // 判断是否suk组件触发的数据改变
        check: true,                              // 是否选择幸运拼盘名额
        skuId: '',                                 // 当前选中skuid
        defaultSkuId: this.sku || '',             // 默认sku
        goodsId: this.skuGoodsId || 0,            // 当前商品id
        attributeType: this.show,                 // 弹框的显示隐藏状态
        typeNum: this.typeNum || 3,              // 选规格:1 购物车:2  3:购物
        orderSource: this.skuOrderSource,        //  1:普通购物，2:分享订单,3:芯豆兑换,4:消费积分购买,5:联盟积分购买,6:一元购,7:拼团，8:限时抢购 9:幸运大抢购 10批发 11批发提货 12超级拼团 13参加超级拼团
        basicGoodsInfor: {},                      // 基本信息
        noGoodSte: false,                         // 无商品
        welfareBuySte: false,                     // 福利专区购买按钮是否可用
        goodsPriceStock: {                        //  价格库存信息
          price: 0,                               //  销售价
          linePrice: '',                          //  划线价
          stock: 0                               //  库存
        },
        goodsNum: 1,                             // 商品数量
        defaultAttributeList: [],                // 弹框规格显示
        luckyData: {}                           // luckyAddPrice
      }
    },

    mounted () {
//      console.log(this.basicGoodsInfor)
      this.shareInvitationCode = this.$route.query.shareInvitationCode || ''
    },

    methods: {
      goPage () {
        this.$router.push({name: 'shopLuckyStrike'})
      },
      /**
       * 关闭弹窗
       */
      ClosePop () {
        this.$emit('skuBack', false)
      },
      /**
       * 判断库存是否够
       */
      judgeGoodsStock (fun) {
        var obj = {}
        var arr = []
        obj = {
          goodsNum: this.goodsNum,
          skuId: this.skuId
        }
        arr.push(obj)
        this.$http.post(`${this.api.judgeGoodsStock}`, arr).then((res) => {
          if (res.data.status !== this.api.ERR_OK) {
            this.$vux.toast.text(res.data.msg)
            return false
          }
          fun()
        })
      },
      /**
       *解析商品详情数据
       */
      oderDateFn (res) {
        let resData = {
          data: res
        }
        let attrId = null
        this.goodsId = resData.data.id          // 重新赋值goodsId
        // 初始化设置active属性
        if (!res) return false
        if (resData.data.goodsStandardList.length > 0) {
          resData.data.goodsStandardList.forEach((item, index) => {
            item.goodsStandarValList.forEach((item, i) => {
              this.$set(item, 'active', false)    // 给每个选项添加'active'属性
            })
          })
        }
        // sku 列表id数据默认组合
        if (resData.data.goodsSkuList.length > 0) {
          resData.data.goodsSkuList.forEach((item, index) => {
            if (item.goodsSkuValList.length > 0) {
              // standardId集合
              var standardIdArr = []
              // standardValId集合
              var standardValIdArr = []
              item.goodsSkuValList.forEach((ite, ind) => {
                standardIdArr.push(ite.standardId)
                standardValIdArr.push(ite.standardValId)
                this.$set(item, 'standardIdArr', standardIdArr)
                this.$set(item, 'standardValIdArr', standardValIdArr)
              })
            }
          })
        }
        // 数据赋值
        this.basicGoodsInfor = resData.data
        // 打开时默认的attrid
        this.basicGoodsInfor.goodsStandardList.forEach((v, index) => {
          if (v.goodsStandarValList.length > 0) {
            // 默认进来的
            if (index === 0) {
              v.goodsStandarValList.forEach((ite) => {
                let lenArr = []
                let lenNoTapArr = []
                this.basicGoodsInfor.goodsSkuList.forEach((its) => {
                  if (its.standardValIdArr.indexOf(ite.id) > -1) {
                    this.$set(ite, 'lenArr', lenArr.push(ite))
                  }
                  if (its.standardValIdArr.indexOf(ite.id) > -1 && (its.disStatus === 1 || !its.currentGoodsNum || its.currentGoodsNum <= 0)) {
                    this.$set(ite, 'lenNoTapArr', lenNoTapArr.push(ite))
                  }
                })
                if (ite.lenNoTapArr && ite.lenNoTapArr === ite.lenArr) {
                  this.$set(ite, 'disabled', true)
                }
              })
              if (v.goodsStandarValList.filter((row) => row.lenArr !== row.lenNoTapArr).length > 0) {
                attrId = v.goodsStandarValList.filter((row) => row.lenArr !== row.lenNoTapArr)[0].id          // 第一个属性的id
              }
            }
          }
        })
        if (this.defaultSkuId && this.basicGoodsInfor.goodsSkuList.filter((row) => parseInt(row.id) === parseInt(this.defaultSkuId)).length > 0) {
          this.getDefaultSku()     // 获取默认sku数据
        } else {
          // 判断所有商品是否都不可点击
          if (this.basicGoodsInfor.totalStock === 0) {
            this.goodsPriceStock.price = this.filterMinMoney(this.basicGoodsInfor.goodsSkuList)
            this.goodsPriceStock.linePrice = ''
            this.goodsPriceStock.stock = this.basicGoodsInfor.totalStock
            this.goodsPriceStock.points = ''
            this.goodsPriceStock.isPoints = false
            this.goodsPriceStock.whetherBlancePay = 0
            this.welfarewZoneData = {}
            this.noGoodSte = true            // 无商品状态
            this.basicGoodsInfor.goodsStandardList.forEach((v, index) => {
              if (v.goodsStandarValList.length > 0) {
                // 默认进来的
                v.goodsStandarValList.forEach((ite) => {
                  this.$set(ite, 'disabled', true)
                })
              }
            })
          } else {
            this.noGoodSte = false            // 无商品状态
            this.arrValCombinat(1, attrId, true)          // 属性值组合
          }
        }
      },
      /**
       * 属性选择
       */
      selectedAttributeFun (arr, types, attrId, item) {
        // 清空当前属性组
        this.deft = true
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
                  var parm = v.standardName + ':' + v.goodsStandarValList.filter((row) => !row.disabled)[0].standardValName
                  defaultAttribute.push(parm)       // 选中属性值
                } else {
                  if (v.goodsStandarValList.filter((row) => row.active).length > 0) {
                    standardValIdArrs.push(v.goodsStandarValList.filter((row) => row.active)[0].id)                      // 选中的id集合
                    defaultAttribute.push(v.standardName + ':' + v.goodsStandarValList.filter((row) => row.active)[0].standardValName)       // 选中属性值
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
                this.skuId = basicGoodsInfor.id
                this.cangetPoints = 0
              }
            }
          })
          // 循环sku list通过standardValIdArr找到对应的库存、价格等
          this.defaultAttributeList = defaultAttribute
        } else {
          // basicGoodsInfor.goodsSkuList[0]
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
          this.getPointsByGoodsSku()   // 计算能获得多少积分
          this.coyPrice = this.goodsPriceStock.price
          this.goodsPriceStock.price = this.basicGoodsInfor.luckyData.purchasePrice
        }
      },
      /**
       * 弹窗确定按钮
       * @typeNum 2 加入购物车 3 普通确认订单  福利专区确认订单4
       */
      popConformBtn (typeNum) {
        // console.log('下单2', this.goodsPriceStock)

        if (this.noGoodSte || (this.pageType && this.welfareBuySte && parseInt(typeNum) === 4)) {
          if (this.noGoodSte) {
            this.$vux.toast.text('库存不足')
          }
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
          if (!this.orderSource) {
            this.$emit('skuBack', false)
            return false
          }
          if (typeNum === 2) {
            this.joinCart()
          }
          if (typeNum === 3 || typeNum === 4) {
            if (this.luckyData.typeLucky === 10) {
              // 批发下单
              this.addOrderByPurchase()
            } else {
              this.confirmOrder()
            }
          }
          if (typeNum === 7) {
            this.confirmOrder()
          }
          if (typeNum === 1) {
            this.$emit('skuBack', false)
          }
        })
      },
      /**
       * 批发订单提交
       */
      addOrderByPurchase () {
        var shopArr = {
          goodsId: this.goodsId,
          goodsNum: this.goodsNum,
          skuId: this.skuId
        }
        this.$vux.loading.show({
          text: '订单提交中'
        })
        this.confirmBtn = false
        this.$http.post(this.api.purchaseOrder, shopArr).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            localStorage.setItem('payOrderId', resData.data.orderId)
            localStorage.setItem('payOrderNo', resData.data.orderNo)
            localStorage.setItem('payOrderSzie', shopArr.length)
            localStorage.setItem('orderType', 1)
            var odr = {
              orderSource: 10,
              orderId: resData.data.orderId,
              orderNo: resData.data.orderNo,
              goodsId: this.goodsId
            }
            localStorage.setItem('confirmOrderInfo', JSON.stringify([odr]))
            setTimeout(() => {
              localStorage.setItem('skuIdsArr', JSON.stringify([this.goodsId])) // 存储商品id集合-付款页查询判断是否能用余额付款
              window.location.replace(window.location.href.match(/.*mshop/gi)[0] + '/pay/orderPay?redirect=gopay&payTyps=total&buyType=1&shopId=1' + '&orderSource=' + this.orderSource)
            }, 100)
          } else {
            this.$vux.toast.text(resData.msg)
          }
        }).finally(() => {
          this.$vux.loading.hide()
          setTimeout(() => {
            this.confirmBtn = true
          }, 100)
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
            resData.goodsNum = this.goodsNum
            // orderSource: 1:普通购物，2:分享订单,3:芯豆兑换,4:消费积分购买,5:联盟积分购买,6:一元购,7:拼团，8:限时抢购
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
                resData.goodsGroupPrice = this.goodsPriceStock.goodsGroupPrice
                localStorage.setItem('CONFIRM_ORDER_TYPE', 7)
              } else if (this.orderSource === 9) {
                resData.goodsPrice = this.luckyData.purchasePrice
                resData.luckyAddPrice = this.luckyData.luckyAddPrice || 0
                resData.canGetPoints = 0
                resData.whetherBlancePay = 0
                resData.whetherSpecial = 0
                if (this.purchaseCode) {
                  resData.purchaseCode = this.purchaseCode
                }
                localStorage.setItem('CONFIRM_ORDER_TYPE', 9)
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
       * 默认选中sku
       */
      getDefaultSku () {
        if (this.defaultSkuId) {
          this.basicGoodsInfor.goodsSkuList.some((item) => {
            if (parseInt(item.id) === parseInt(this.defaultSkuId)) {
              this.goodsPriceStock = {
                price: item.whetherSpecial && item.goodsSpecialPrice ? item.goodsSpecialPrice : item.goodsPrice,
                linePrice: item.whetherSpecial && item.goodsSpecialPrice ? item.goodsPrice : '',
                stock: item.currentGoodsNum,
                points: item.points || 0,
                isPoints: item.whetherPoints ? !!true : !!false,
                whetherBlancePay: item.whetherBlancePay,
                welfarewZoneData: item
              }
              this.skuId = item.id
              this.getPointsByGoodsSku()   // 计算能获得多少积分
              item.goodsSkuValList.forEach((ite, ind) => {
                this.basicGoodsInfor.goodsStandardList.forEach((ites, index) => {
                  ites.goodsStandarValList.forEach((v) => {
                    if (v.id === ite.standardValId) {
                      v.active = true
                      var str = v.standardName + ':' + v.standardValName
                      this.defaultAttributeList.push(str)       // 选中属性值
                    }
                  })
                })
              })
            }
          })
        }
      },
      /**
       * 商品过滤最小价格
       */
      filterMinMoney (v) {
        if (!v || v.length <= 0) return false
        let skuPriceArr = []
        v.forEach((el) => {
          el.whetherSpecial ? skuPriceArr.push(el.goodsSpecialPrice) : skuPriceArr.push(el.goodsPrice)
        })
        return Math.min.apply(Math, skuPriceArr)
      }
    },
    watch: {
      // sku显示隐藏
      show (curVal) {
        this.attributeType = curVal
        if (curVal) {
          this.oderDateFn(this.basicGoodsInfor)
          this.luckyData = this.basicGoodsInfor.luckyData
        } else {
          this.attributeType = false
          document.getElementsByTagName('body')[0].style.cssText = ''
        }
      },
      // sku默认
      sku (curval) {
        this.defaultSkuId = curval
      },
      skuOrderSource (curval) {
        this.orderSource = curval || ''
        if (curval === 9) {
        }
      },
      // sku数据 订单数据
      oderDate: {
        handler (curVal) {
          if (this.deft) {
            return false
          } else {
            this.basicGoodsInfor = curVal
          }
        },
        deep: true
      }
    },
    computed: {
      ...mapState(['active'])
    }
  }
</script>
<style>

</style>
<style lang="less" scoped>
  .sku-wap{
    .vux-popup-dialog{
      background: #fff;
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
          padding-top: .2rem;
          padding-bottom: .2rem;
          border-bottom: 1px solid #eee;
          .goodInfor-ul{
            display: flex;
            width: 100%;
            .left{
              width:1.6rem;
              height: 1.8rem;
              position: relative;
              img{
                width:1.6rem;
                height:1.6rem;
                /* position: absolute;
                top:-0.3rem;
                left: 0; */
                margin-top: 0.1rem;
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
                font-size: 0.28rem;
                margin-top:0.18rem;
                margin-bottom: .03rem;
                line-height: .6rem;

                .iconline{
                  text-decoration: line-through;
                  color:#999999;
                }
              }
              .icon{
              text-decoration:none;
              color: #fff;
              margin-left: .1rem;
              background: #f23030;
              font-size: .24rem;
              padding-left: .1rem;
              padding-right: .1rem;
              border-radius: 4px;
                img{
                  width: .25rem;
                  height: .25rem;
                  background:  #f23030;
                  border-radius: .2rem;
                }
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
        top: 2.2rem;
        bottom:1rem;
        overflow-y: scroll;
      }
      /*尺码-颜色*/
      .sizeColor-box{
        padding-left: 0.3rem;
        background: #fff;
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

        .red{
          color: #e64340;
        }
        .left{
          color: #999999;
          font-size: .28rem;
        }
        .right{
          float: right;
        }
        .clear{
          clear: both;
          padding-top: .2rem;

          .clearText{
            font-size: .24rem;

            span{
              color: #e64340;
            }
          }
        }
      }
      .odr{
        line-height: .6rem;
        .num{

        }

      }
      /*按钮*/
      .bottom{
        width: 85%;
        max-width: 7.5rem;
        text-align: center;
        font-size: 0.28rem;
        color:#999;
        position: absolute;
        left: 7.5%;
        right: 7.5%;
        margin: auto;
        bottom: .4rem;
        z-index: 600;
        p{ padding-bottom: .2rem}
        .red{
          color: #e64340;
        }
        .btn{
          width: 100%;
          height: .8rem;
          line-height: .8rem;
          text-align: center;
          font-size: 0.32rem;
          background: #f23030;
          color:#fff;
          margin: auto;
          border-radius: .4rem;
          &.buyNoTap{
            background: #ccc;
          }
        }

        .btnRrorr{
          background: #999;
        }
      }


      .goodsNum{
        width: 0.75rem;
        border: 1px solid #eee;
        color: #333;
        margin-left: .2rem;
        text-align: center;
        background: #f8f8f8;
        padding: 2px 5px 2px 5px;
      }
      .Ic {
        display: flex;
        flex-direction: row;
        line-height: .6rem;
        font-size: .24rem;
        .text{
          margin-right:.2rem ;
          color: #e64340;
          padding-top: .1rem;
          font-size: .24rem;
          position: relative;
          left: -.2rem;
        }
      }
      .fillicon{
        width: .34rem;
        height: auto;
        font-size: .24rem;
        img{
          width: .34rem;
          height: auto;
          position: relative;
          top: .05rem;
        }
      }
    }
    .defaultAttribute{
      display: inline-block;
      width: 5.5rem;
      height: 0.8rem;
      color:#333;
      overflow: hidden;
      white-space:nowrap;
      text-overflow:ellipsis;
      font-size: .24rem;
      b{
        margin-left: 0.1rem;
      }
    }
    .iconFor{
      background: linear-gradient(-65deg, transparent 1.5em, #e64340 0);
      height: .6rem;
      line-height: .6rem;
      font-size: .24rem;
      color: white;
      padding-right: .5rem;
      .iocnText{
        margin-left: .1rem;
        font-size: .24rem;
      }
      img{
        width: .4rem;
        height: .4rem;
        border-radius: .3rem;
        position: relative;
        top: .1rem;
        left: .1rem;
      }
    }
  }
</style>
