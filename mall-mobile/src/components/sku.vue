<template>
  <transition name="vux-popup-animate-bottom">
    <div v-show="show && !initialShow" class="sku-pop-dialog">
      <div class="sku-pop-mask" :class="show ? 'mask-show' : ''" @click="hide"></div>
      <div class="sku-pop-con">
        <div class="fixedBox">
          <!--商品说明-->
          <div class="goodInfor-box">
            <ul class="goodInfor-ul">
              <li class="left">
                <img :src="skuData.mainImage | filterImgUrl" >
              </li>
              <li class="right">
                <p>{{skuData.goodsName}}</p>
                <span class="price">￥{{selectedSkuData.price}}</span>
                <p class="exchangePoints" v-if="selectedSkuData.points">{{selectedSkuData.points}}积分可兑换</p>
                <p class="title">库存{{selectedSkuData.stock}}件</p>
              </li>
              <div class="del-box" @click="hide">
                <x-icon type="ios-close-empty" size="30"></x-icon>
              </div>
            </ul>
          </div>
        </div>
        <div class="attrStyle" id="attrStyle">
        <!--尺码-颜色-->
        <div class="sizeColor-box">
          <div class="size-color" v-for="(v,index) in skuData.goodsStandardList" v-if="v.goodsStandarValList.length > 0">
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
            <com-cartcontrol  v-model="num" :value="value" :integer="integer" :min="min" :max="max" :disabled="disabled" :disableInput="disableInput" @change="change"></com-cartcontrol>
          </li>
        </ul>
        </div>
        <!--按钮-->
        <div class="btn">
          <template v-if="btnData.btnNum === 1">
            <div @click="handleConfirm">{{btnData.btnTxt[0]}}</div>
          </template>
          <template v-else>
            <div @click="handleConfirm">{{btnData.btnTxt[0]}}</div>
            <div @click="handleConfirm">{{btnData.btnTxt[1]}}</div>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * @skuSelected sku选择完毕回调
 * @handleConfirm 底部按钮回调
*/
import comCartcontrol from './ComCartcontrol'      // 加减组件
export default {
  model: {
    prop: 'show',
    event: 'change'
  },
  components: {
    comCartcontrol
  },
  props: {
    show: Boolean,
    value: {
      type: [String, Number],
      default: 1
    },
    integer: {
      type: Boolean,
      default: true
    },
    min: {
      type: [String, Number],
      default: 1
    },
    max: {
      type: [String, Number],
      default: Infinity
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disableInput: {
      type: Boolean,
      default: false
    },
    skuData: {                      // sku所需的数据
      type: Object,
      default: function () {
        return {}
      }
    },
    btnData: {                     // sku底部按钮数据
      type: Object,
      default: function () {
        return {
          btnNum: 1,
          btnTxt: ['确定', '']
        }
      }
    }
  },
  data () {
    return {
      num: this.value,
      // 选中的skuData数据
      selectedSkuData: {
        price: 0,                                         // 价格
        stock: 0,                                         // 库存
        points: 0,                                        // 积分
        whetherPoints: false,                             // 是否积分兑换
        whetherBlancePay: false,                          // 是否余额支付
        noGoodSte: false,                                 // 商品下架或删除状态 默认false
        skuId: null,                                      // 商品属性z组合的skuId
        cangetPoints: 0
      }
    }
  },
  computed: {
  },
  watch: {
    'show' () {
      this.defSelect()
    },
    'num' () {
      this.$emit('input', this.num)
    }
  },
  mounted () {
    this.initialShow = false
  },
  methods: {
    change (val) {
      this.$emit('valChange', val)
    },
    /**
     * 选择完毕后请求
    */
    selectedRes (val) {
      this.selectedSkuData.cangetPoints = val
    },
    /**
     * 默认选中、id拼装
    */
    defSelect () {
      if (this.show) {
        let attrId = null
        if (this.skuData && this.skuData.goodsSkuList.length > 0) {
          this.skuData.goodsSkuList.forEach((item, index) => {
            if (item.goodsSkuValList.length > 0) {
              var standardIdArr = []        // standardId集合
              var standardValIdArr = []     // standardValId集合
              item.goodsSkuValList.forEach((ite, ind) => {
                standardIdArr.push(ite.standardId)
                standardValIdArr.push(ite.standardValId)
                this.$set(item, 'standardIdArr', standardIdArr)
                this.$set(item, 'standardValIdArr', standardValIdArr)
              })
            }
          })
        }
        // 打开时默认的attrid
        this.skuData.goodsStandardList.forEach((v, index) => {
          if (v.goodsStandarValList.length > 0) {
            // 默认进来的
            if (index === 0) {
              v.goodsStandarValList.forEach((ite) => {
                let lenArr = []
                let lenNoTapArr = []
                this.skuData.goodsSkuList.forEach((its) => {
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
        // 判断所有商品是否都不可点击
        if (this.skuData.totalStock === 0) {
          this.selectedSkuData.price = this.filterMinMoney(this.skuData.goodsSkuList)
          this.selectedSkuData.stock = this.skuData.totalStock
          this.selectedSkuData.points = ''
          this.selectedSkuData.whetherPoints = false
          this.selectedSkuData.whetherBlancePay = 0
          this.selectedSkuData.noGoodSte = true
          this.skuData.goodsStandardList.forEach((v, index) => {
            if (v.goodsStandarValList.length > 0) {
              // 默认进来的
              v.goodsStandarValList.forEach((ite) => {
                this.$set(ite, 'disabled', true)
              })
            }
          })
        } else {
          this.selectedSkuData.noGoodSte = false                        // 无商品状态
          this.arrValCombinat(1, attrId, true)                          // 属性值组合
        }
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
    },
    /**
     * 属性值组合
     * @types 1 弹窗弹出选中 2 手动选中
     * @attrId 点击的第一个的id
    */
    arrValCombinat (types, attrId, isActive) {
      let skuData = this.skuData
      let standardValIdArrs = []        // standardValId集合
      let overplus = []
      if (skuData.goodsStandardList.length > 0) {
        let defaultAttribute = []         // 默认值
        // 点击属性对应的属性
        skuData.goodsSkuList.forEach((item, ind) => {
          // 不是组合属性
          if (skuData.goodsStandardList.length <= 1) {
            overplus.push(item)
          } else {   // 是组合属性
            if (item.standardValIdArr.indexOf(attrId) > -1) {
              overplus.push(item)
            }
          }
        })
        // 属性设置是否可点击、获取选中值
        let arrEl = []
        skuData.goodsStandardList.forEach((v, index) => {
          if (v.goodsStandarValList.length > 0) {
            v.goodsStandarValList.forEach((ats, ind) => {
              if (overplus.length > 0) {
                overplus.forEach((el) => {
                  // 不是组合属性
                  if (skuData.goodsStandardList.length <= 1) {
                    arrEl = el.standardValIdArr[0]
                  } else { // 是组合属性
                    var index = el.standardValIdArr.indexOf(attrId)
                    arrEl = el.standardValIdArr[el.standardValIdArr.length - 1 - index]
                  }
                  if (JSON.parse(ats.id) === JSON.parse(arrEl)) {
                    if (isActive && (el.disStatus === 1 || !el.currentGoodsNum || el.currentGoodsNum <= 0)) {
                      this.$set(ats, 'disabled', true)
                    } else {
                      if (skuData.goodsStandardList.length > 1) {
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
                  standardValIdArrs.push(v.goodsStandarValList.filter((row) => row.active)[0].id)                    // 选中的id集合
                  defaultAttribute.push(v.goodsStandarValList.filter((row) => row.active)[0].standardValName)        // 选中属性值
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
        this.skuData.goodsStandardList.forEach((item) => {
          item.goodsStandarValList.forEach((ite) => {
            if (ite.active) {
              activeLen.push(ite)
            }
          })
        })
        // 取出默认选中的属性对应的库存、价格
        skuData.goodsSkuList.forEach((item, index) => {
          if (item.goodsSkuValList.length > 0) {
            let len = this.skuData.goodsStandardList.length
            if (activeLen.length === len) {
              if (item.standardValIdArr.toString() === standardValIdArrs.toString()) {
                this.selectedSkuData.price = item.whetherSpecial ? item.goodsSpecialPrice ? item.goodsSpecialPrice : item.goodsPrice : item.goodsPrice
                this.selectedSkuData.stock = item.currentGoodsNum
                this.selectedSkuData.points = item.points || 0
                this.selectedSkuData.whetherPoints = item.whetherPoints ? !!true : !!false
                this.selectedSkuData.whetherBlancePay = item.whetherBlancePay
                this.selectedSkuData.skuId = item.id
              }
            } else {
              this.selectedSkuData = {
                // ite.goodsSkuList | filterMinMoney | moneyFilter
                price: this.filterMinMoney(skuData.goodsSkuList),
                stock: skuData.totalStock,
                points: '',
                whetherPoints: false,
                whetherBlancePay: 0
              }
              this.selectedSkuData.price = this.filterMinMoney(skuData.goodsSkuList)
              this.selectedSkuData.stock = skuData.totalStock
              this.selectedSkuData.points = ''
              this.selectedSkuData.whetherPoints = false
              this.selectedSkuData.whetherBlancePay = 0
              this.selectedSkuData.skuId = item.skuId
              this.selectedSkuData.cangetPoints = 0
            }
          }
        })
        // 循环sku list通过standardValIdArr找到对应的库存、价格等
        this.selectedSkuData.defaultAttributeList = defaultAttribute
      } else {
        let bPrice = skuData.goodsSkuList[0]
        this.selectedSkuData.price = bPrice.whetherSpecial ? bPrice.goodsSpecialPrice ? bPrice.goodsSpecialPrice : bPrice.goodsPrice : bPrice.goodsPrice
        this.selectedSkuData.stock = skuData.totalStock
        this.selectedSkuData.points = skuData.goodsSkuList[0].points
        this.selectedSkuData.whetherPoints = skuData.goodsSkuList[0].whetherPoints ? !!true : !!false
        this.selectedSkuData.whetherBlancePay = skuData.goodsSkuList[0].whetherBlancePay
        this.selectedSkuData.skuId = skuData.goodsSkuList[0].id
      }
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
      this.$emit('skuSelected', this.selectedSkuData)
    },
    /**
     * 确认按钮
    */
    handleConfirm () {
      let skuData = this.skuData
      // 没有属性
      if (skuData.goodsStandardList.length <= 0) {
        this.selectedSkuData.skuId = skuData.goodsSkuList[0].id       // 获取选中的skuId
      } else {    // 有属性
        let activeLen = []
        skuData.goodsStandardList.forEach((item) => {
          item.goodsStandarValList.forEach((ite) => {
            if (ite.active) {
              activeLen.push(ite.id)
            }
          })
        })
        let len = skuData.goodsStandardList.length
        if (activeLen.length === len) {
          skuData.goodsSkuList.forEach((item, index) => {
            if (item.standardValIdArr.toString() === activeLen.toString()) {
              this.selectedSkuData.skuId = item.id              // 获取选中的skuId
            }
          })
        } else {
          this.$vux.toast.text('请选择属性dd')
          return false
        }
      }
      if (!this.num) {
        this.$vux.toast.text('请输入数字')
        return false
      }
      this.selectedSkuData.num = this.num
      this.$emit('handleConfirm', this.selectedSkuData)
    },
    /**
     * 关闭弹窗
    */
    hide () {
      this.num = 1
      this.$emit('change', false)
    }
  }
}
</script>

<style lang="less">
.sku-pop-dialog {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 7.5rem;
  z-index: 4000;
  height: 75%;
  transition-property: transform;
  transition-duration: 300ms;
  max-height: 100%;
  overflow-y: initial;
  background: #fff;
  -webkit-overflow-scrolling: touch;
  .sku-pop-mask{
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    tap-highlight-color: rgba(0,0,0,0);
    z-index: -1;
    transition: all .5s;
    &.mask-show{
      transition: all .5s;
      opacity: 1;
    }
  }
    .sku-pop-con{  
      height: 100%;
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
                /* margin-top:0.1rem; */
              }
              .price{
                color:#f23030;
                font-size: 0.24rem;
                /* margin-top:0.2rem; */
              }
              .exchangePoints{
                color:#ff9700;
                font-size: .24rem;
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
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 0;
        display: flex;
        div{
          flex: 1;
          max-width: 7.5rem;
          height: .8rem;
          line-height: .8rem;
          text-align: center;
          font-size: 0.32rem;
          background: #f23030;
          color:#fff;
          z-index: 999999;
          &:nth-child(2){
            background: #a88d53;
          }
        }
      }
    }
}
.vux-popup-animate-bottom-enter, .vux-popup-animate-bottom-leave-active {
  transform: translate3d(0, 100%, 0);
}
</style>
