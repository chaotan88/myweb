<template>
  <div class="shareDetail-wrap">
    <!-- 分享内容 -->
    <create-share-img :shareData="shareCon" ref="imageWrapper" v-model="showToast"></create-share-img>     
    <div class="goodDetail">
      <div class="baseInfo" id="baseInfo">   
        <!-- 列表切换 -->
        <div class="detail-share-list" v-if="remoedList.length > 0" id="detailShareList" :class="{'detailShareListNoImg' : marginTop > 25}">
          <ul>
            <li v-for="(item, index) in remoedList" :class="{'active' : item.active}" @click="shareListTap($event, index, item)">
              <div :style="{'display': marginTop > 25 ? 'none':'block'}">
                <img :src="item.mainImage | filterImgUrl">
              </div>
              <div>{{item.goodsName}}</div>
              <img src="../../assets/images/list-check.png" v-if="item.active" class="check">
            </li>
          </ul>
        </div>
        <div class="detail-share-list-hei" :class="{'detailShareListNoImg' : marginTop > 25}"></div>
        <!-- 轮播图 -->
        <div class="swiper-wrap">
          <swiper :aspect-ratio="800/800" dots-position="center">
            <swiper-item class="swiper-demo-img" v-for="(item, index) in basicGoodsInfor.imageList" :key="index">
              <img :src="item.imageUrl | filterImgUrl">
            </swiper-item>
          </swiper>
          <div class="goodsDetailMask"><img src="http://passpay.andes-hub.com/shopapp/goodsDetailMask.png"></div>
        </div>
        <!-- 基本信息 -->
        <div class="infor-box">
          <p class="infor-title">{{basicGoodsInfor.goodsName ? basicGoodsInfor.goodsName : '--'}}</p>
          <!-- <div class="infor-price">
            <span><i>¥</i>{{goodsPriceStock.price ? goodsPriceStock.price : '0' | moneyFilter}}</span>
          </div> -->
        </div>
        <!--规格-->
        <div class="specs-box" @click="modalDialogfun(1)">
          <div class="words-left">
            <i>选择: </i>
            <span class="defaultAttribute">
              <b v-for="(v,index) in defaultAttributeList">{{v}}</b>
            </span>
          </div>
          <div class="icon-right">
            <x-icon type="ios-arrow-right" size="20"></x-icon>
          </div>
        </div>
        <!-- 说明 -->
        <div class="Explain" @click="showExplain">
          <div>说明: </div>
          <ul>
            <!-- 购买进入的 -->
            <template v-if="fromType == 1">
              <li v-if="cangetPoints">
                <p>积</p>
                <p>赠送{{cangetPoints}}积分</p>
              </li>
              <li v-if="goodsPriceStock.whetherBlancePay">
                <p>余</p>
                <p>余额支付</p>
              </li>
              <li v-if="goodsPriceStock.isPoints">
                <p>兑</p>
                <p>积分兑换</p>
              </li>
              <li v-if="basicGoodsInfor.beInviterIfGetGoldPoints">
                <p>送</p>
                <p>{{basicGoodsInfor.beInviterGetGoldPoints}}金币</p>
              </li>
            </template>
            <!-- 分享进入的 -->
            <template v-if="fromType == 2">
              <li v-if="singShareDeta.oneIfGetCashPoints">
                <p>赚</p>
                <p>{{singShareDeta.oneGetCashPoints}}通用积分</p>
              </li>
              <li v-if="singShareDeta.oneIfGetBonusPoints">
                <p>获</p>
                <p>{{singShareDeta.oneGetBonusPoints}}消费积分</p>
              </li>
              <li v-if="singShareDeta.oneIfGetBalance">
                <p>赠</p>
                <p>{{singShareDeta.oneGetBalance}}余额</p>
              </li>
            </template>
          </ul>
        </div>

        <!-- 品牌 -->
        <div class="brand" v-if="basicGoodsInfor.brandLogo || basicGoodsInfor.brand">
          <div>品牌: </div>
          <div>
            <img :src="basicGoodsInfor.brandLogo | filterImgUrl" v-if="basicGoodsInfor.brandLogo">
            <img src="../../assets/images/shopLogo.png" v-else>
            <span>{{basicGoodsInfor.brand}}</span>
          </div>
        </div>

        <!-- 商品介绍容器 -->
        <div class="tab-content" id="tab-content">
          <specs-paramer :basicGoodsInfor="basicGoodsInfor" :isShowNoData="false" v-if="JSON.stringify(basicGoodsInfor) !== '{}'"></specs-paramer>
          <keep-alive>
            <component :basicGoodsInfor="basicGoodsInfor" is="goodInfor" ref="view"></component>
          </keep-alive>
        </div>
      </div>
      <!-- 底部 -->
      <div class="footer-hei"></div>
      <div class="footer-box">
        <div class="footer-box-img" @click="$router.push('/')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhuye"></use>
          </svg>
        </div>
        <div class="footer-box-price">
          <template v-if="singShareDeta.whetherShare">
            <span><i>¥</i>{{singShareDeta.goodsSharePrice | moneyFilter}}</span>
            <span><i>¥</i>{{singShareDeta.goodsPrice | moneyFilter}}</span>
          </template>
          <template v-else>
            <span><i>¥</i>{{singShareDeta.goodsPrice | moneyFilter}}</span>
          </template>
        </div>
        <div class="footer-box-btn" @click="modalDialogfun(3)" v-if="fromType == 1">立即购买</div>
        <div class="footer-box-btn" v-if="fromType == 2" @click="toImage(singShareDeta)">
          <p>分享赚</p>
          <p v-if="singShareDeta.oneIfGetCashPoints">赚{{singShareDeta.oneGetCashPoints}}通用积分</p>
        </div>
      </div>
      <!-- 说明弹窗 -->
      <div v-transfer-dom class="explain-pop-box">
        <popup height="70%" v-model="showExplainSte">
          <div class="explain-pop">
            <h2>说明</h2>
            <ul>
              <li>
                <div class="explain-pop-title">
                  <p>积</p>
                  <p>赠送积分</p>
                </div>
                <div class="explain-pop-con">一、根据真芯天下商城的业务形式，在使用现金支付的时候，商城会赠送一定数量的消费积分，消费积分可用于兑换商品或者兑换其他服务。现金支付（包括微信、支付宝、银联、线下支付）</div>
              </li>
              <li>
                <div class="explain-pop-title">
                  <p>余</p>
                  <p>可用余额支付</p>
                </div>
                <div class="explain-pop-con">二、“可用余额支付”是指商城内的部分指定商品可以支持余额支付购物，并不再产生积分。余额是用户充值的预购款。</div>
              </li>
              <li>
                <div class="explain-pop-title">
                  <p>兑</p>
                  <p>可用积分兑换</p>
                </div>
                <div class="explain-pop-con">三、“可用积分兑换”是指商城内的部分指定商品可以支持积分兑换，并不再产生积分。积分是在现金消费或者现金购买服务时产生的。</div>
              </li>
            </ul>
            <div class="explain-btn" @click="showExplainSte = false">关闭</div>
          </div>
        </popup>
      </div>
      <!-- 获得金币弹窗 -->
      <div class="get-coin-pop" v-if="fromType == 1 && basicGoodsInfor.beInviterIfGetGoldPoints">
        <x-dialog v-model="showGetCoinPop" class="dialog-demo" :hide-on-blur="true" :dialog-style="{'max-width': '5.7rem', width: '100%', height: '50%', 'background-color': 'transparent'}">
          <p class="pop-title">恭喜您</p>  
          <p class="pop-num">获得{{basicGoodsInfor.beInviterGetGoldPoints}}金币</p> 
          <div class="pop-btn" @click="showGetCoinPop = false">购买成功立即领取</div>         
        </x-dialog> 
      </div>
      <!-- 商品属性弹框 -->
      <div v-transfer-dom>
        <popup v-model="attributeType" position="bottom" height="75%" @on-hide="ClosePop" class="attributeType-box">
        <div style="border-top:1px solid #fff;">
          <div class="fixedBox">
            <!--商品说明-->
            <div class="goodInfor-box">
              <ul class="goodInfor-ul">
                <li class="left">
                  <img :src="basicGoodsInfor.mainImage | filterImgUrl" >
                </li>
                <li class="right">
                  <p>{{basicGoodsInfor.goodsName}}</p>
                  <span class="price">¥{{goodsPriceStock.price | moneyFilter}}</span>
                  <div class="exchangePoints" v-if="cangetPoints">
                    <div>
                      <span>赠送</span>
                      <span><i>{{cangetPoints}}</i>积分</span>
                    </div>  
                  </div>
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
          <div class="btn" @click="popConformBtn(typeNum)">确认</div>
        </div>
        </popup>
      </div>
    </div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'
  import { Swiper, TransferDom, Popup, Icon, XDialog, SwiperItem } from 'vux'       // 轮播图,底部弹框
  import createShareImg from '../../components/createShareImg'  // 分享图片组件
  import goodInfor from '../../components/GoodInfor'           // 商品介绍
  import specsParamer from '../../components/SpecsParamer'     // 规格参数
  import comments from '../../components/Comments'             // 评价
  import salesService from '../../components/SalesService'     // 售后服务
  import comCartcontrol from '../../components/ComCartcontrol' // 加减
  import { setTimeout } from 'timers'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Swiper,
      SwiperItem,
      goodInfor,
      specsParamer,
      comments,
      salesService,
      TransferDom,
      Popup,
      Icon,
      comCartcontrol,
      XDialog,
      createShareImg
    },
    data () {
      return {
        marginTop: 1,
        fromType: '',                             // 从哪个页面来 1 分享-购买页面 2 分享-分享页面
        busy: false,
        swiperList: [],                           // 图片轮播
        remoedList: [],                           // 分享列表
        shareCon: {},                             // 点击分享返回的内容
        showToast: false,                         // 分享图片弹窗
        showGetCoinPop: true,                     // 获得多少金币弹窗
        dataURL: '',                              // 生成的图片url
        shareListIndex: 0,                        // 分享列表切换索引
        singShareDeta: {},                        // 单个分享列表数据
        basicGoodsInfor: {},                      // 基本信息
        currentView: 'goodInfor',                 // 商品介绍为默认组件
        attributeType: false,                     // 弹框的显示隐藏状态
        typeNum: '',                              // 规格=1 购物车=2 立即购买=3
        goodSpecImg: '',                          // 商品规格图片
        defaultAttributeList: [],                 // 默认属性列表
        goodsNum: 1,                              // 商品数量
        maxGoodsNum: '',                          // 最大数量
        shopCartNumType: false,                   // 购物车数量的显示隐藏状态
        isCollectType: false,                     // 是否收藏
        tabFixed: false,                          // 栏目是否固定
        tabTap: false,                            // 栏目是否点击
        columnHeight: 0,                          // 栏目距离顶部的距离
        carListNums: 0,                           // 购物车总列表中的数量
        selectArrt: [],                           // 选中的商品属性
        integral: {},                             // 用户积分
        NfcMessage: '',                           // nfc信息
        showNfc: false,
        noGoodSte: false,                         // 无商品
        goodsPriceStock: {                        // 价格库存信息
          price: 0,
          stock: 0,
          points: 0,
          isPoints: false,
          whetherBlancePay: 0
        },
        baseTop: 0,
        cangetPoints: 0,                          // 能获得多少积分
        skuId: null,                              // 商品属性的skuId
        showExplainSte: false,                    // 是否显示说明弹窗
        showShareBg: false,
        shareInvitationCode: '',                 // 通过分享进来的code
        codeUrl: '',                             // 二维码code
        whetherShareGoods: ''                    // 商品是否是分享商品
      }
    },
    mounted: function () {
      this.shareInvitationCode = this.$route.query.shareInvitationCode             // 通过分享进来的code
      localStorage.setItem('invitationCode', this.shareInvitationCode)
      this.goodsId = this.$route.query.goodsId
      this.fromType = this.$route.query.fromType
      window.scrollTo(0, 0)           // 默认滚动条在顶部
      this.getWhetherShareGoods()     // 商品是否是分享商品
      this.getRemoedList()            // 获取分享列表
      this.goodsDetailFun()           // 获取详情页信息
      var baseInfo = document.getElementById('baseInfo')
      baseInfo.onscroll = () => {
        var s = baseInfo.scrollTop
        this.marginTop = s
      }
    },
    methods: {
      /**
       * 显示说明弹窗
      */
      showExplain () {
        this.showExplainSte = true
      },
      /**
       * 商品是否是分享商品
      */
      getWhetherShareGoods () {
        this.$http.get(this.api.getWhetherShareGoods, {
          params: {
            goodsId: this.goodsId
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.whetherShareGoods = resData.data
          if (this.whetherShareGoods === 0) {
            this.routerReplace({path: '/goodDetail', query: {goodsId: this.goodsId}})
          }
        })
      },
      /**
       * 获取数据列表
      */
      getRemoedList () {
        this.$http.post(this.api.getShareThemeGoodsPage, {
          start: 1,
          pageSize: 10000
        }).then((res) => {
          let resData = res.data
          var listIndex = ''
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.remoedList = resData.data.list
          this.remoedList.forEach((item, index) => {
            if (parseInt(item.goodsId) === parseInt(this.$route.query.goodsId)) {
              this.$set(item, 'active', true)
              this.singShareDeta = item
              listIndex = index
            }
          })
          this.$nextTick(() => {
            var el = document.getElementById('detailShareList')
            var elLeft = el.childNodes.item(0).childNodes.item(listIndex).offsetLeft
            document.getElementById('detailShareList').scrollLeft = elLeft - 30
          })
        })
      },
      /**
       * 分享列表切换
      */
      shareListTap (event, index, v) {
        var elLeft = event.currentTarget.offsetLeft     // 点击元素左边的距离
        document.getElementById('detailShareList').scrollLeft = elLeft - 30
        this.remoedList.forEach((item) => {
          this.$set(item, 'active', false)
        })
        this.goodsId = v.goodsId
        this.singShareDeta = v
        this.$set(v, 'active', true)
        this.goodsDetailFun()
      },
      /**
       * 商品详情
      */
      goodsDetailFun () {
        this.$http.post(`${this.api.getShareGoodsDetail}`, {
          id: this.goodsId
        }).then((res) => {
          let resData = res.data
          let attrId = null
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.goodsId = resData.data.id          // 重新赋值goodsId
          // 获取nfc信息
          if (this.$route.query.chk) {
            this.getNfcMessage()
          }
          // 初始化设置active属性
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
          // 判断所有商品是否都不可点击
          if (this.basicGoodsInfor.totalStock === 0) {
            this.goodsPriceStock = {
              price: this.filterMinMoney(this.basicGoodsInfor.goodsSkuList),
              stock: this.basicGoodsInfor.totalStock,
              points: '',
              isPoints: false,
              whetherBlancePay: 0
            }
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
        })
      },
      /**
       * 能获得多少积分
      */
      getPointsByGoodsSku () {
        this.$http.get(`${this.api.getPointsByShareGoodsSku}`, {
          params: {
            skuId: this.skuId
          }
        }).then((res) => {
          let resData = res.data
          this.cangetPoints = resData.data
        })
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
            if (item.goodsSkuValList.length > 0) {
              let len = this.basicGoodsInfor.goodsStandardList.length
              if (activeLen.length === len) {
                if (item.standardValIdArr.toString() === standardValIdArrs.toString()) {
                  this.goodsPriceStock = {
                    price: item.whetherShare ? item.goodsSharePrice : item.goodsPrice,
                    stock: item.currentGoodsNum,
                    points: item.points || 0,
                    isPoints: item.whetherPoints ? !!true : !!false,
                    whetherBlancePay: item.whetherBlancePay
                  }
                  this.skuId = item.id
                  this.getPointsByGoodsSku()   // 计算能获得多少积分
                }
              } else {
                this.goodsPriceStock = {
                  // ite.goodsSkuList | filterMinMoney | moneyFilter
                  price: this.filterMinMoney(basicGoodsInfor.goodsSkuList),
                  stock: basicGoodsInfor.totalStock,
                  points: '',
                  isPoints: false,
                  whetherBlancePay: 0
                }
                this.cangetPoints = 0
              }
            }
          })
          // 循环sku list通过standardValIdArr找到对应的库存、价格等
          this.defaultAttributeList = defaultAttribute
        } else {
          let bPrice = basicGoodsInfor.goodsSkuList[0]
          this.goodsPriceStock = {
            price: bPrice.whetherShare ? bPrice.goodsSharePrice : bPrice.goodsPrice,
            stock: basicGoodsInfor.totalStock,
            points: basicGoodsInfor.goodsSkuList[0].points,
            isPoints: basicGoodsInfor.goodsSkuList[0].whetherPoints ? !!true : !!false,
            whetherBlancePay: basicGoodsInfor.goodsSkuList[0].whetherBlancePay
          }
          this.skuId = basicGoodsInfor.goodsSkuList[0].id
          this.getPointsByGoodsSku()   // 计算能获得多少积分
        }
        // console.log(standardValIdArrs)
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
       * 显示属性弹窗
       * @v 规格1 购物车2 立即购买3
      */
      modalDialogfun (v) {
        if (this.noGoodSte || parseInt(this.basicGoodsInfor.saleStatus) === 2) {
          this.$vux.toast.text('商品已下架或删除')
          return false
        }
        this.attributeType = true
        this.typeNum = v
        document.getElementsByTagName('body')[0].style.cssText = 'position:fixed;overflow:hidden;left:0;right:0;margin:auto;'
      },
      /**
       * 关闭弹窗
      */
      ClosePop () {
        this.attributeType = false
        document.getElementsByTagName('body')[0].style.cssText = ''
        this.typeNum = ''
      },
      /**
       * 数量
      */
      countFun (v) {
        this.goodsNum = this.goodsNum
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
       * 弹窗确定按钮
      */
      popConformBtn (typeNum) {
        if (this.noGoodSte) {
          return false
        }
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
          if (typeNum === 1) {
            this.ClosePop()
          } if (typeNum === 3) {
            this.confirmOrder()
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
        this.$http.post(`${this.api.getBuySoon}`, {
          goodsId: this.goodsId,
          goodsNum: this.goodsNum,
          skuId: this.skuId,
          goodsAttribute: goodsAttribute.toString()
          // goodsAttriBySoonList: arr
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
            resData.orderSource = 2       // 1:普通购物，2：分享订单
            resData.goodsPrice = this.goodsPriceStock.price
            resData.shareInvitationCode = this.shareInvitationCode      // 推荐分享进来的code
            resData.orderAttributeRequest = orderAttributeRequest // 订单属性集合
            localStorage.setItem('confirmOrderInfo', JSON.stringify([resData])) // 存储确认订单页所需数据
            setTimeout(() => {
              this.routerReplace({path: '/confirmOrder'})
            }, 100)
          } else {
            this.$vux.toast.text(res.data.msg)
          }
        })
      },
      /**
       * 图片转base64
      */
      getImageBase64ByUrl (url, fun) {
        this.$http.get(this.api.getImageBase64ByUrl, {
          params: {
            fileUrl: url // 'http://oss-zxtx-test-img.oss-cn-shenzhen.aliyuncs.com/test-kaoshanji-20171103-111.jpg'
          }
        }).then((res) => {
          fun(res)
        })
      },
      /**
       * 创建图片
      */
      createImg () {
        setTimeout(() => {
          html2canvas(this.$refs.imageWrapper.$el.childNodes[0], {
            backgroundColor: null,
            logging: false
          }).then((canvas) => {
            this.$vux.loading.hide()
            let dataURL = canvas.toDataURL('image/png')
            this.shareCon.dataURL = dataURL
            this.showToast = true
          })
        }, 100)
      },
      /**
       * 生成图片
      */
      toImage (v) {
        if (this.noGoodSte || parseInt(this.basicGoodsInfor.saleStatus) === 2) {
          this.$vux.toast.text('商品已下架或删除')
          return false
        }
        this.$vux.loading.show({
          text: '图片生成中...'
        })
        let shopId = this.$route.query.shopId ? this.$route.query.shopId : localStorage.getItem('shopId') ? localStorage.getItem('shopId') : 1
        let codeUrl = window.location.href.match(/.*mshop/gi)[0] + '/share/goodDetail?goodsId=' + v.goodsId + '&shareInvitationCode=' + v.invitationCode + '&fromType=1&shopId=' + shopId
        this.shareCon = v
        this.shareCon.codeUrl = codeUrl
        if (v.mainImage && v.mainImage.match(/http/gi) && v.mainImage.indexOf('data:image') === -1) {
          this.getImageBase64ByUrl(v.mainImage, (res) => {
            this.shareCon.mainImage = 'data:image/png;base64,' + res.data.data
            this.createImg()
          })
        } else {
          this.createImg()
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      this.ClosePop()
      next()
    }
  }
</script>

<style  lang=less>
  .shareDetail-wrap{
    /* 获得金币弹窗 */
    .get-coin-pop{
      .weui-dialog{  
        background: url('../../assets/images/action/coin-bg.png') no-repeat;
        background-size: 100% 100%;
        .pop-title,.pop-num{
          font-size: .3rem;
          color: #ffd997;
        }
        .pop-title{
          margin-top: 4rem;
        }
        .pop-num{
          margin-top: .14rem;
          margin-bottom: .36rem;
        }
        .pop-btn{
          width: 3.42rem;
          height: .82rem;
          margin: 0 auto;
          line-height: .82rem;
          text-align: center;
          font-size: .28rem;
          color: #fff;
          border-radius: 30px;
          margin-bottom: .3rem;
          background: linear-gradient(#fdc953, #ff7827);
        }
      }
    }
    .detail-share-list-hei{
      height: 2.91rem;
      transition: all 0.3s;
      &.detailShareListNoImg{
        height: .87rem;
      }
    }
    .detail-share-list{
      width: 7.5rem;
      height: 2.91rem;
      padding: .13rem 0 .13rem .13rem;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      overflow-x: scroll;
      margin: .23rem 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 400;
      background: #fff;
      -webkit-box-shadow: 0 0 10px 0 hsla(0,6%,58%,.6);
      transition: all 0.3s;
      &::-webkit-scrollbar {
        height: 0px;
      }
      ul{
        li{
          width: 1.98rem;
          height: 2.62rem;
          overflow: hidden;
          display: inline-table;
          border: 1px solid #d2d2d2;
          margin-left: .24rem;
          border-radius: 6px;
          text-align: center;
          position:relative;
          transition: all 0.3s;
          box-sizing: border-box;
          &.active{
            border: 1px solid #fe002e;
          }
          div:nth-child(1){
            img{
              width: 1.68rem;
              height: 1.47rem;
              display: block;
              margin: 0 auto;
              margin-bottom: .3rem;
            }
          }
          div:nth-child(2){
            padding: 0 .12rem;
            font-size: .12rem;
            color: #6d6d6d;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            white-space: normal;
          }
          .check{
            position: absolute;
            right: 0;
            top: 0;
            width: .4rem;
            height: .33rem;;
          }
        }
      }
      &.detailShareListNoImg{
        height: .87rem;
        ul{
          li{
            height: .48rem;
            line-height: .48rem;
            &.active{
              div:nth-child(2){
                color: #fe002e;
              }
            }
            div:nth-child(2){
              -ms-line-clamp: 1;
              -moz-line-clamp: 1;
              -webkit-line-clamp: 1;
            }
          }
        }
      }
    }
    /**nfc信息**/
      .nfc-message{
        opacity: 0;
        z-index: -1;
        width: 7.5rem;
        padding: .23rem .3rem;
        background: rgba(0,0,0,0.6);
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        margin: auto;
        z-index: -1;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        font-size: .26rem;
        color: #fff;
        box-sizing:border-box;
        -webkit-box-sizing: border-box;
        .nfc-message-img{
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          margin-right: .2rem;
          &:empty{
            background: #eee;
          }
          img{
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            -webkit-border-radius: 50%;
          }
        }
        .nfc-message-mes{
          flex: 1;
          p{
            margin-bottom: .12rem;
            font-weight:normal;
            word-break:break-all;
          }
        }
      }
      .nfc-message-show{
        opacity: 1;
        z-index: 5000;
        -webkit-transition: opacity 400ms;
        transition: opacity 400ms;
      }
      /**header**/
      .detail-header-box{
        width: 7.5rem;  
        box-sizing: border-box;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 4000;
        .detail-header{
          height: 1rem;
          display: flex;
          align-items: center;
          padding: 0 .23rem;
          transition: background-color ease .3s;
          /* transition: border-color 0.01s; */
          border-bottom: 1px solid transparent;
          position: relative;
          z-index: 300;
          /* padding-bottom: .04rem; */
          .detail-header-back,.detail-header-home,.detail-header-share,.detail-header-blank{
            width: .6rem;
            height: .6rem;
            background: rgba(0,0,0,0.3);
            border-radius: .39rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color ease .3s;
            svg{
              width: .45rem;
              height: .45rem;
              fill: #fff;
            }
          }
          .detail-header-home{
            svg{
              width: .42rem;
              height: .42rem;
            }
          }
          .detail-header-blank{
            background: none;
            margin-left: .32rem;
          }
          .detail-header-share{
            margin-left: .32rem;
            svg{
              width: .35rem;
              height: .35rem;
              fill: #fff;
            }
          }
          .detail-header-option{
            flex: 1;
            margin: 0 5%;
            opacity: 0;
            transition: opacity ease .3s;
            ul{
              display: flex;
              align-items: center;
              li{
                height: 1rem;
                line-height: 1rem;
                flex: 1;
                text-align: center;
                font-size: .28rem;
                color: #9b9b9b;
                position: relative;
                border-bottom: 2px solid  transparent;
                &.active{
                  color: #a88d53;
                  border-bottom: 2px solid #a88d53;
                }
              }
            }
          }
        }
        .detail-paramer{
          opacity: 0;
          transition: opacity ease .3s;
          border-bottom: 1px solid#e5e5e5;
          ul{
            display: flex;
            background: #fff;
            height: 0.9rem;
            padding: 0 20%;
            li{
              flex: 1;
              line-height: 0.9rem;
              text-align: center;
              color: #9b9b9b;
              font-size: .28rem;
              &.active{
                color: #a88d53;
              }
            }
          }
        }
      }
      .detail-header-box.transparent{
        .detail-header{
          background: #fff;
          box-shadow: 0 1px 0 rgba(0,0,0,.05), 0 0.5px 0 rgba(0,0,0,.09);
          -webkit-box-shadow: 0 1px 0 rgba(0,0,0,.05), 0 0.5px 0 rgba(0,0,0,.09);
          /* border-bottom: 1px solid#e5e5e5; */
        }
        .detail-header-back,.detail-header-home,.detail-header-share,.detail-header-blank{
          background: none;
          svg{
            fill: #8c8c8c;
          }
        }
        .detail-header-option,.detail-paramer{
          opacity: 1;
        }
      }
      .goodDetail {
        height: calc(100vh);
        overflow: hidden;
        position: relative;
        z-index: 500;
        background: #fff;
        .baseInfo{
          height: calc(~"100vh - 1rem - 1px");
          padding-bottom: .5rem;
          box-sizing: border-box;
          overflow-y: scroll;
        }
        /*基本信息*/
        .infor-box{
          padding: 0.2rem 0.3rem;
          min-height: 0.9rem;
          border-bottom: .25rem solid #f8f8f8;
          .infor-title{
            font-size: 0.29rem;
            color:#333;
            line-height: 1.6em;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .infor-price{
            display: flex;
            align-items: center;
            justify-content:space-between;
            span:nth-child(1){
              display: block;
              color:#f23030;
              font-size: 0.4rem;
              padding:0.2rem 0;
              i{
                font-size: .28rem;
              }
            }
            span:nth-child(2){
              display: block;  
                margin-left: .15rem;
                background: #ffeacc;
                color: #ff9700;
                border-radius: 20px;
                padding: 1px .1rem;
                font-size: .24rem;          
            }
          }
          .integral-tip{
            font-size: .26rem;
            color: #999999;
          }
          li{
            flex: 1;
          }

        }
        /* 品牌 */
        .brand{
          display:flex;
          padding: 0 .3rem;
          font-size: .28rem;
          align-items: center;
          height: .8rem;
          border-bottom: .25rem solid #f8f8f8;
          div:nth-child(1){
            color: #999;
            margin-right: .32rem;
          }
          div:nth-child(2){
            display: flex;
            align-items: center;
            img{
              width: .35rem;
              /* height: .5rem; */
              display: block;
              margin-right: .2rem;
            }
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
          }
        }
        .shopGetPoint{
          padding: .2rem .3rem;
          font-size: .28rem;
          color: #999999;
          border-bottom: 1px solid #eee;
          div{
            height: .4rem;
            line-height: .4rem;
            border: 1px solid #f23030;
            border-radius: 5px;
            display: inline-flex;
            font-size: .26rem;
            color: #f23030;
            align-items: center;
            overflow: hidden;
            span:nth-child(1){
              height: 100%;
              background: #f23030;
              color: #fff;
              font-size: .24rem;
              padding: 0 .08rem;
            }
            span:nth-child(2){
              display: flex;
              align-items: center;
              padding: 0 .1rem;
              i{
                max-width: 5rem;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
        .interval{
          height: 0.2rem;
          background: #eee;
        }
        /*规格*/
        .specs-box{
          height: 0.8rem;
          line-height: 0.8rem;
          font-size: 0.28rem;
          padding-left: 0.3rem;
          padding-right: 0.15rem;
          border-bottom: .25rem solid #f8f8f8;
          .words-left{
            float: left;
            position: relative;
            height:100%;
            i{
              color:#999;
              display: inline-block;
              height: 0.8rem;
              line-height: 0.8rem;
              position: absolute;
              top:0;
              left: 0;
            }
            .defaultAttribute{
              display: inline-block;
              width: 5.5rem;
              height: 0.8rem;
              color:#333;
              margin-left: 0.7rem;
              overflow: hidden;
              white-space:nowrap;
              text-overflow:ellipsis;
              b{
                margin-left: 0.1rem;
              }
            }
          }
          .icon-right{
            float: right;
            position: relative;
            .vux-x-icon-ios-arrow-right {
              fill: #999;
              position: absolute;
              right: 0;
              top:0.2rem;
            }
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

        /* 说明 */
        .Explain{
          display: flex;
          align-items: center;
          height: auto;
          overflow: hidden;
          background: #fff;
          border-bottom: .25rem solid #f8f8f8;
          font-size: .28rem;
          padding:.2rem .1rem 0 0.3rem;
          div:nth-child(1){
            color: #999;
            margin-bottom: .2rem;
            margin-right: .32rem;
          }
          ul{
            flex:1;
            align-items: center;
            li{
              float: left;
              margin-right: .35rem;
              margin-bottom: .2rem;
              p{
                display: inline-block;
                vertical-align: middle;
                &:nth-child(1){
                  background: #fe002e;
                  border-radius: 6px;
                  color: #fff;
                  font-size:.24rem;
                  padding: .06rem .12rem;
                }
                &:nth-child(2){
                  margin-left: .1rem;                
                }
              }
            }
          }
        }
        /* 主页评价 */
        .evaluate-main{
          padding: 0 .3rem;
          .evaluate-main-title{
            height: 1.15rem;
            align-items: center;
            display: flex;
            font-size: .28rem;
            div:nth-child(1){
              flex: 1;
              color: #292929;
              font-weight: 400;
            }
            div:nth-child(2){
              color: #a88d53;
            }
          }  
          ul{
            height: 2.87rem;
            overflow: hidden;
            overflow-x: scroll;
            white-space: nowrap;
            &::-webkit-scrollbar {
              height: 0px;
            }
            li{
              height: 2.03rem;
              display: inline-table;
              width: 5rem;
              background: #f8f8f8;
              border:1px solid #e2e2e2;
              border-radius: 5px;
              padding: .4rem .33rem;
              margin-right: .8rem;
              &:last-child{
                margin-right: 0;
              }
              .evaluate-base{
                display: flex;
                align-items: center;
                .evaluate-base-portrait{
                  width: .87rem;
                  height: .87rem;
                  border-radius: 50%;
                  margin-right: .19rem;
                  background: #a88d53;
                  img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                  }
                }
                .evaluate-base-name{
                  color: #292929;
                  font-size: .28rem;
                  margin-right: .1rem;
                }
                .evaluate-base-score{
                  border: 1px solid #a88d53;
                  border-radius: 4px;
                  display: flex;
                  align-items: center;
                  padding: .05rem .12rem;
                  svg{
                    width: .32rem;
                    height: .34rem;
                    fill:#a88d53;
                    margin-right: .1rem;
                  }
                  span{
                    color: #a88d53;
                    font-size: .26rem;
                  }
                }
              }
              .evaluate-con{
                color: #292929;
                font-size: .26rem;
                margin-top: .3rem;
                display: -webkit-box;
                display: -moz-box;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                white-space: normal;
              }
            }
          }   
          .evaluate-more{
            display: flex;
            align-items: center;
            justify-content: center;
            margin: .42rem 0;
            svg{
              width: .3rem;
              height: .3rem;
              fill: #9b7e52;
            }
            span{
              display: block;
              color: #9b7e52;
              font-size: .28rem;
            }
          }  
        }

        /*tab切换*/
        .tabFixedClass{
          position: fixed;
          top:0;
          left: 0;
          right: 0;
          margin: auto;
          z-index: 3000;
        }
        .tabFixedHei{
          height: 0.9rem;;
        }
        .tab-title{
          display:flex;
          width:7.5rem;
          height: 0.8rem;
          line-height: 0.8rem;
          font-size: 14px;
          border-bottom: 1px solid #eee;
          background: #fff;
          li {
            width: 7.5rem;
            flex: 1;
            text-align: center;
            font-size: .28rem;
          }
          .active{
            color:#f23030;
          }
        }
        /**内容区**/
        .tab-content{
          width: 100%;
          /* height: 100%; */
          min-height: calc(~"100vh - 1rem - 3px - 0.9rem - 1rem - 0.8rem ");
          /* position: relative;
          overflow-y: scroll; */
        }
        .noGoodsTip{
          width: 7.5rem;
          display: flex;
          height: .43rem;
          justify-content: center;
          align-items: center;
          background: #fdf8ed;
          color: #ffaf30;
          font-size: .26rem;
          text-align: center;
          position: fixed;
          bottom: 1rem;
          left: 0;
          right: 0;
          margin: auto;
        }
        /* 参数、评价、售后容器 */
        .outer-wrap{
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          height: calc(~"100vh - 1rem - 10px - 1rem ");
          margin-top: 1rem;
          position: relative;
          overflow-y: scroll;
        }
        /*底部*/
        .footer-hei{
          height: 1rem;
        }
        .footer-box{
          width: 7.5rem;
          margin:auto;
          display:flex;
          align-items: center;
          height: 1rem;
          font-size: 0.28rem;
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          background: #fff;
          border-top:1px solid #eee;
          .footer-box-img{
            width: .94rem;
            text-align: center;
            svg{
              width: .6rem;
              height: .6rem;
              fill: #626262;
            }
          }
          .footer-box-price{
            flex:1;
            span:nth-child(1){
              font-size: .3rem;
              color: #fe002e;
              i{
                font-size: .18rem;
              }
            }
            span:nth-child(2){
              font-size: .2rem;
              color: #afafaf;
              text-decoration: line-through;
              i{
                font-size: .12rem;
              }
            }
          }
          .footer-box-btn{
            display: flex;
            flex-direction: column;
            width: 2.66rem;
            height: 1rem;
            color: #fff;
            text-align: center;
            background: #fe002e;
            font-size: .26rem;
            justify-content: center;
          }
          
        }
      }

      /*弹框*/
      .swiper-wrap{
        background: #eee;
        position: relative;
        img{
          width: 100%;
          height: 100%;
        }
        .goodsDetailMask{
          position: absolute;
          bottom: 0;
          left: 0;
          img{
            display: block;
          }
        }
      }
      .vux-swiper-desc{
        background: red;
      }
      /* 分享弹窗 */
      .share-box{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        margin: auto;
        background: rgba(0,0,0,0.5);
        width: 7.5rem;
        text-align: right;
        z-index: 4800;
        img{
          width: 60%;
        }
      }
  }
  /* 属性弹窗 */
  .attributeType-box{
    background: #fff !important;
    left: 0;
    right: 0;
    margin: auto;  
    max-width: 7.5rem;   
    overflow-y:initial !important;
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
              font-size: 0.3rem;
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
    .attribute-btn{
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: .2rem;
      display: flex;
      padding: 0 .2rem;
      div{
        flex: 1;
        text-align: center;
      }
      .btn-buy{
        background: #f23030;
        color: #fff;
        font-size: 0.28rem;
        height: .7rem;
        line-height: .7rem;
        border-radius: 30px;
        margin-right: .14rem;
      }
      .btn-join-cart{
        background: #a88d53;
        color: #fff;
        font-size: 0.28rem;
        height: .7rem;
        line-height: .7rem;
        border-radius: 30px;
      }
    }
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
  /*字体图标*/
  .shopCartIcon {
    fill: #999;
  }
  .shopCartIconChecked {
    fill: red;
  }
  /* 说明弹窗 */
  .explain-pop-box{
    .vux-popup-dialog{
      background: #fff;
      left: 0;
      right: 0;
      margin: auto;  
      max-width: 7.5rem; 
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;  
      padding: 0 .44rem;
      box-sizing: border-box;
    }
    .explain-pop{
      h2{
        font-size: .3rem;
        color: #fe002e;
        text-align: center;
        line-height: 1.2rem;
      }
      ul{
        position: absolute;
        top: 1.2rem;
        left: .44rem;
        right: .44rem;
        margin: auto;
        bottom: 1.2rem;
        overflow-y: scroll;
        li{
          margin-bottom: .6rem;
          .explain-pop-title{
            display: flex;
            align-items: center;
            p:nth-child(1){
              background: #fe002e;
              border-radius: 6px;
              color: #fff;
              font-size: .24rem;
              padding: .04rem .12rem;
            }
            p:nth-child(2){
              margin-left: .1rem;
              font-size:.28rem;
              color: #454545;
              margin-left: .2rem;
            }
          }
          .explain-pop-con{
            color: #454545;
            font-size: .28rem;
            margin-top: .22rem;
          }
        }
      }
      .explain-btn{
        height: .86rem;
        line-height: .86rem;
        color: #fff;
        text-align: center;
        border-radius: 30px;
        background: #fe002e;
        position: absolute;
        bottom: .34rem;
        left: .44rem;
        right: .44rem;
        margin: auto;
      }
    }
  }
</style>
