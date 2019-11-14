<template>
    <div class="goodDetail">
      <!-- nfc信息 -->
      <div class="nfc-message" v-bind:class="showNfc ? 'nfc-message-show' : ''" @click="showNfc = false">
        <div class="nfc-message-img">
          <img src="../../assets/images/nfc.png" >
        </div>
        <div class="nfc-message-mes">
          <p>物联芯溯源防伪验证{{NfcMessage.verifyResult == true ? '通过 ' : NfcMessage.verifyResult == false ? '不通过' : '' }}</p>
          <p>云端动态验证码: {{NfcMessage.uid}}</p>
          <p>芯片已被: 验证{{NfcMessage.queryCount}}次</p>
          <!-- <p>芯片已被: 读取{{NfcMessage.readCount}}次/验证{{NfcMessage.queryCount}}次</p> -->
        </div>
      </div>
      <!-- headerbox -->
      <div class="detail-header-box" :class="showDetailHeader || showContainer === 2 ? 'transparent' : ''">
        <!-- header -->
        <div class="detail-header" >
          <div class="detail-header-back" @click="$router.back()">
            <x-icon type="ios-arrow-left" size="20"></x-icon>  
          </div>  
          <div class="detail-header-blank"></div>  
          <div class="detail-header-option">
            <ul>
              <li :class="headTabIndex == index ? 'active' : ''" @click="headTabChange(index, item.component)" v-for="(item, index) in headTabList">{{item.name}}</li>
            </ul>
          </div>
          <div class="detail-header-home" @click="$router.push('/')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shouye"></use>
            </svg>
          </div> 
          <div class="detail-header-share">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-13"></use>
            </svg>
          </div>       
        </div>
        <!-- 图文、参数 -->
        <div class="detail-paramer" v-if="showContainer === 1">
          <ul>
            <li :class="paramerTabIndex == index ? 'active' : ''" @click="paramerChange(index, item.component)" v-for="(item, index) in paramerTabList">{{item.name}}</li>
          </ul>
        </div>
      </div>
      <!-- 默认显示容器 -->
      <div v-show="showContainer === 1" class="baseInfo" id="baseInfo">      
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
          <div class="infor-price">
            <span><i>¥</i>{{goodsPriceStock.price ? goodsPriceStock.price : '0'}}</span>
            <!-- <span class="point" v-if="goodsPriceStock.isPoints">支持积分兑换</span> -->
          </div>
          <!-- <span class="integral-tip" v-if="basicGoodsInfor.canGetPoint">积分: 购买此商品可获得{{basicGoodsInfor.canGetPoint}}积分</span> -->
        </div>

        <!-- 赠送积分 -->
        <!-- <div class="shopGetPoint" v-if="cangetPoints">
          <div>
            <span>赠送</span>
            <span><i>{{cangetPoints}}</i>积分</span>
          </div>  
        </div>  -->

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
            <li v-if="cangetPoints">
              <p>积</p>
              <p>赠送{{cangetPoints}}积分</p>
            </li>
            <li>
              <p>余</p>
              <p>可用余额支付</p>
            </li>
            <li v-if="goodsPriceStock.isPoints">
              <p>兑</p>
              <p>可用积分兑换</p>
            </li>
          </ul>
        </div>

        <!-- 品牌 -->
        <div class="brand">
          <div>品牌: </div>
          <div>
            <img :src="basicGoodsInfor.shopLogo | filterImgUrl" v-if="basicGoodsInfor.shopLogo">
            <img src="../../assets/images/shopLogo.png" v-else>
            <span>{{basicGoodsInfor.shopName}}</span>
          </div>
        </div>

        <!-- 评价 -->
        <div class="evaluate-main" v-if="!commentsNoData">
          <div class="evaluate-main-title">
            <div>用户评价({{totalCommentNum}})</div>
            <div>90% 满意</div>
          </div>
          <ul>
            <li v-for="item in commentsList">
              <div class="evaluate-base">
                <div class="evaluate-base-portrait">
                  <!-- <img src="http://passpay.andes-hub.com//file/shopadmin/source/201808/1533349297985.jpg"> -->
                </div>
                <div class="evaluate-base-name">{{item.customerName || item.phone | filterName}}</div>
                <div class="evaluate-base-score">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-haopingganxie"></use>
                  </svg>
                  <span>{{ item.commentType | commentsFilter}}</span>
                </div>
              </div>
              <div class="evaluate-con">{{item.commentContent}}</div>
            </li>
          </ul>
          <div class="evaluate-more" @click="headTabIndex = 1, showContainer = 2, headTabComponent = 'comments'">
            <span>查看更多</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sanjiaoright"></use>
            </svg>
          </div>
        </div>

        <!-- tab切换 -->
        <!-- <ul class="tab-title" id="tab-title" v-bind:class="tabFixed ? 'tabFixedClass' : ''">
        <li @click="tabContents('goodInfor')" :class="[{'active':(currentView=='goodInfor')}]">商品介绍</li>
        <li @click="tabContents('specsParamer')" :class="[{'active':(currentView=='specsParamer')}]">规格参数</li>
        <li @click="tabContents('comments')" :class="[{'active':(currentView=='comments')}]">评价</li>
        <li @click="tabContents('salesService')" :class="[{'active':(currentView=='salesService')}]">售后服务</li>
        </ul>
        <div v-bind:class="tabFixed ? 'tabFixedHei' : ''"></div> -->
        <!-- 商品介绍容器 -->
        <div class="tab-content" id="tab-content">
          <keep-alive>
            <component :basicGoodsInfor="basicGoodsInfor" :is="paramerTabComponent" ref="view"></component>
          </keep-alive>
        </div>
      </div>
      <!-- 参数、评价、售后容器 -->
      <div v-show="showContainer === 2">
        <div class="outer-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
          <keep-alive>
            <component :basicGoodsInfor="basicGoodsInfor" :is="headTabComponent" ref="view"></component>
          </keep-alive>
        </div>
      </div>
      <!-- 商品无货提示 -->
      <div class="noGoodsTip" v-if="noGoodSte">所选商品暂时无货，非常抱歉</div>
      <!-- 底部 -->
      <div class="footer-hei"></div>
      <ol class="footer-box" :class="[{'footer-index':(typeNum==1)}]">
        <li class="left">
          <!--未收藏-->
          <div v-if="isCollectType == false" @click="joinCalCollect(1)">
            <!-- <img src="../../assets/images/Collection.png" @click="joinCalCollect(1)"> -->
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-aixin-ac-copy-copy"></use>
            </svg>
            <span>收藏</span>
          </div>
          <!--已收藏-->
          <div v-if="isCollectType == true" class="collect-box collect-box-active" @click="joinCalCollect(2)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-aixin-ac-copy"></use>
            </svg>
            <span>已收藏</span>
          </div>
          <div class="shopCart-box" @click="goShopCart()">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gouwuche"></use>
            </svg>
            <span>购物车</span>
            <div  class="shopCartNum" v-if="carListNums > 0">{{carListNums}}</div>
          </div>
        </li>
        <!--点击属性选择直接加入购物车、购买-->
        <template v-if="typeNum == 1">
          <li class="right" :class="noGoodSte ? 'buyNoTap' : ''" @click="popConformBtn(3)">立即购买</li>
          <li class="conter" :class="noGoodSte ? 'cartNoTap' : ''" @click="popConformBtn(2)">加入购物车</li>
        </template>
        <!--购物车、立即购买弹窗-->
        <template v-else>
          <li class="right" :class="noGoodSte ? 'buyNoTap' : ''" @click="modalDialogfun(3)">立即购买</li>    
          <li class="conter" :class="noGoodSte ? 'cartNoTap' : ''" @click="modalDialogfun(2)">加入购物车</li>  
        </template>
      </ol>
      <!-- 说明弹窗 -->
      <div v-transfer-dom class="explain-pop-box">
        <popup height="70%" v-model="showExplainSte">
          <div class="explain-pop">
            <h2>说明</h2>
            <ul>
              <li>
                <div class="explain-pop-title">
                  <p>积</p>
                  <p>赠送{{cangetPoints}}积分</p>
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
            <div class="explain-btn" @click="showExplainSte = false">完成</div>
          </div>
        </popup>
      </div>
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
</template>

<script>
  import { Swiper, TransferDom, Popup, Icon, SwiperItem } from 'vux'       // 轮播图,底部弹框
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
      comCartcontrol
    },
    data () {
      return {
        headTabList: [
          {
            name: '商品',
            component: 'goodInfor'
          },
          {
            name: '评价',
            component: 'comments'
          },
          {
            name: '售后',
            component: 'salesService'
          }
        ],
        showContainer: 1,                         // 显示那个容器 默认显示商品 1 商品 2 其他容器
        headTabIndex: 0,                          // header tab索引
        headTabComponent: '',                     // header组件切换
        paramerTabList: [
          {
            name: '图文',
            component: 'goodInfor'
          },
          {
            name: '参数',
            component: 'specsParamer'
          }
        ],
        paramerTabIndex: 0,                       // 图文参数索引
        paramerTabComponent: 'goodInfor',            // 图文参数显示组件 默认goodInfor
        showDetailHeader: false,                  // 是否显示header
        goodsId: '',                              // 商品id
        busy: false,
        swiperList: [],                           // 图片轮播
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
          isPoints: false
        },
        cangetPoints: 0,                          // 能获得多少积分
        skuId: null,                              // 商品属性的skuId
        totalCommentNum: 0,                       // 总评论数
        commentsNoData: false,                    // 评论是否有数据
        commentsList: [],                         // 评论列表
        showExplainSte: false                     // 是否显示说明弹窗
      }
    },
    mounted: function () {
      var baseInfo = document.getElementById('baseInfo')
      baseInfo.onscroll = () => {
        var s = baseInfo.scrollTop
        if (this.showContainer === 1) {
          if (s > 100) {
            this.showDetailHeader = true
          } else {
            this.showDetailHeader = false
          }
        }
      }
      this.goodsId = this.$route.query.goodsId
      window.scrollTo(0, 0)      // 默认滚动条在顶部
      this.goodsDetailFun()      // 获取详情页信息
      this.getCommentStatic()    // 评论总数量
      this.goodsCommentsList()   // 评论列表
    },
    methods: {
      /**
       * header tab点击
      */
      headTabChange (index, component) {
        if (!this.showDetailHeader) return false
        this.headTabIndex = index
        if (index === 0) {   // 当商品选项点击时显示商品容器、其他则显示另一容器
          this.showContainer = 1
        } else {
          this.showContainer = 2
          this.headTabComponent = component
        }
      },
      /**
       * 图文、参数切换
      */
      paramerChange (index, component) {
        if (!this.showDetailHeader) return false
        var oDiv = document.getElementById('tab-content')
        var baseInfo = document.getElementById('baseInfo')
        var H = oDiv.offsetTop
        this.paramerTabIndex = index
        this.paramerTabComponent = component
        baseInfo.scrollTo(0, H)
      },
      /**
       * 显示说明弹窗
      */
      showExplain () {
        this.showExplainSte = true
      },
      /**
       * 获取评价数量
      */
      getCommentStatic () {
        this.$http.get(`${this.api.getCommentStatic}`, {
          params: {
            goodsId: this.$route.query.goodsId
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            var totalCommentNum = parseInt(resData.data.goodNum) + parseInt(resData.data.commonNum) + parseInt(resData.data.badNum) // 总数量
            this.totalCommentNum = totalCommentNum
          }
        })
      },
      /**
       * 商品评价列表
      */
      goodsCommentsList () {
        this.$http.post(`${this.api.getComment}`, {
          start: 1,
          pageSize: 5,
          goodsId: this.$route.query.goodsId,
          commentType: this.commentType ? this.commentType : ''
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            this.commentsNoData = true
            return false
          }
          this.commentsNoData = resData.data.list.length > 0 ? 0 : 1
          this.commentsList = resData.data.list
        })
      },
      /**
        * 获取nfc信息
      */
      getNfcMessage () {
        var obj = {
          location: '',
          uid: '***FA6895EJ97',
          readCount: '5',
          verifyResult: true,
          queryCount: '2'
        }
        this.$http.post(`${this.api.getNfcMessage}`, {
          chk: this.$route.query.chk ? this.$route.query.chk : '',
          goodsId: this.goodsId
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            if (res.data.data) {
              this.showNfc = true
              resData.data = JSON.parse(resData.data)
              resData.data.uid = this.$route.query.chk
              resData.data.uid = resData.data.uid ? '***' + resData.data.uid.substring(3) : ''
              this.NfcMessage = resData.data
            } else {
              this.NfcMessage = obj
            }
          } else {
            this.NfcMessage = obj
          }
          this.showNfc = true
        }).catch(() => {
          this.NfcMessage = obj
        })
      },
      /**
       *页面滚动栏目固定
      */
      columnFixed () {
        var oDiv = document.getElementById('tab-title')
        var H = 0
        H = oDiv.offsetTop
        this.columnHeight = H
        window.onscroll = () => {
          var s = document.body.scrollTop || document.documentElement.scrollTop
          if (s > H) {
            this.tabFixed = true
          } else {
            this.tabFixed = false
          }
        }
      },
      /**
       * 商品详情
      */
      goodsDetailFun () {
        this.$http.post(`${this.api.goodsDetail}`, {
          id: this.goodsId,
          chk: this.$route.query.chk ? this.$route.query.chk : ''
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
              isPoints: false
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
          // 固定栏目
          this.$nextTick(() => {
            this.isCollected()  // 判断是否被收藏--需登录
            this.getCartNum()   // 获取购物车信息--需登录
            setTimeout(() => {
              // this.columnFixed()  // 栏目固定
            }, 100)
          })
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
                    price: item.whetherSpecial ? item.goodsSpecialPrice ? item.goodsSpecialPrice : item.goodsPrice : item.goodsPrice,
                    stock: item.currentGoodsNum,
                    points: item.points || 0,
                    isPoints: item.whetherPoints ? !!true : !!false
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
                  isPoints: false
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
            price: bPrice.whetherSpecial ? bPrice.goodsSpecialPrice ? bPrice.goodsSpecialPrice : bPrice.goodsPrice : bPrice.goodsPrice,
            stock: basicGoodsInfor.totalStock,
            points: basicGoodsInfor.goodsSkuList[0].points,
            isPoints: basicGoodsInfor.goodsSkuList[0].whetherPoints ? !!true : !!false
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
       * 动态组件切换
      */
      tabContents (data) {
        this.currentView = data
      },
      /**
       * 显示属性弹窗
       * @v 规格1 购物车2 立即购买3
      */
      modalDialogfun (v) {
        if (v !== 1 && this.noGoodSte) {
          return false
        }
        if (parseInt(this.basicGoodsInfor.saleStatus) === 2) {
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
          if (typeNum === 2) {
            this.joinCart()
          } if (typeNum === 3) {
            this.confirmOrder()
          }
        })
      },
      /**
       * 加入购物车
      */
      joinCart () {
        // 选中属性拼接
        if (this.basicGoodsInfor.goodsStandardList) {
          // var obj = {}
          this.selectArrt = []
          var goodsAttribute = []
          var goodsAttributeIds = []
          this.basicGoodsInfor.goodsStandardList.forEach((ite) => {
            ite.goodsStandarValList.forEach((item) => {
              if (item.active) {
                goodsAttribute.push(ite.standardName + ': ' + item.standardValName)
                goodsAttributeIds.push(item.id)
                // obj = {
                //   goodsAttributeId: ite.id,
                //   goodsAttributeValId: item.id
                // }
                // this.selectArrt.push(obj)
              }
            })
          })
        }
        this.$http.post(`${this.api.addGoodsToShopCart}`, {
          goodsId: this.goodsId,
          goodsNum: this.goodsNum,
          skuId: this.skuId,
          shopId: this.basicGoodsInfor.shopId,
          goodsAttribute: goodsAttribute.toString(),
          goodsAttributeIds: goodsAttributeIds.toString()
          // shopCartAttributeList: this.selectArrt
        }).then((res) => {
          let resData = res.data
          this.$vux.toast.text(resData.msg)
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.attributeType = false
          this.getCartNum()
        })
      },
      /**
       * 获取购物车数量
      */
      getCartNum () {
        this.$http.post(`${this.api.getShopCartList}?noLogin=true`, {
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.carListNums = resData.data.total < 100 ? resData.data.total : '99+'
        })
      },
      /**
       * 跳转购物车页面
      */
      goShopCart () {
        this.$http.post(`${this.api.getShopCartList}`, {
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) {
            this.$router.push({path: '/login', query: {redirect: this.$route.fullPath}})
            return false
          }
          this.$router.push('/shopCart')
        })
      },
      /**
       * 获取积分信息
      */
      getMemberPoints () {
        this.$http.post(`${this.api.calculateGoodsPoints}?noLogin=true`, {
          orderAmount: this.basicGoodsInfor.goodsPrice
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.integral = res.data.data
        })
      },
      /**
       * 是否被收藏
      */
      isCollected () {
        this.$http.post(`${this.api.isCollect}?noLogin=true`, {
          goodsId: this.goodsId,
          shopId: this.basicGoodsInfor.shopId
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.isCollectType = res.data.data.isCollect
        })
      },
      /**
       * 加入、取消收藏
       * @num 1 加入收藏 2取消收藏
      */
      joinCalCollect (num) {
        var collectUrl = null // 添加收藏，取消收藏 url
        if (num === 1) {
          collectUrl = this.api.addCollect
        } else {
          collectUrl = this.api.cancelCollect
        }
        this.$http.post(collectUrl, {
          goodsId: this.goodsId,
          shopId: this.basicGoodsInfor.shopId
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.isCollected()
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
            resData.cangetPoints = this.cangetPoints
            resData.shopId = this.basicGoodsInfor.shopId
            resData.shopName = this.basicGoodsInfor.shopName
            resData.orderAttributeRequest = orderAttributeRequest // 订单属性集合
            localStorage.setItem('confirmOrderInfo', JSON.stringify([resData])) // 存储确认订单页所需数据
            setTimeout(() => {
              this.$router.replace({path: '/confirmOrder'})
            }, 100)
          } else {
            this.$vux.toast.text(res.data.msg)
          }
        })
      },
      /**
       * 评论加载更多
      */
      loadMore () {
        if (this.headTabComponent !== 'comments') return false
        this.$refs.view.loadMore()
      }
    },
    beforeRouteLeave (to, from, next) {
      this.ClosePop()
      next()
    }
  }
</script>

<style scoped lang=less>
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
    .vux-popup-dialog{
      overflow-y:initial;
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
        transition: all 0.2s;
        /* transition: border-color 0.01s; */
        border-bottom: 1px solid transparent;
        /* padding-bottom: .04rem; */
        .detail-header-back,.detail-header-home,.detail-header-share,.detail-header-blank{
          width: .6rem;
          height: .6rem;
          background: rgba(0,0,0,0.3);
          border-radius: .39rem;
          display: flex;
          align-items: center;
          justify-content: center;
          svg{
            width: .45rem;
            height: .45rem;
            fill: #fff;
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
              border-bottom: .04rem solid  transparent;
              &.active{
                color: #a88d53;
                border-bottom: 2px solid #a88d53;
              }
            }
          }
        }
      }
      .detail-paramer{
        transition: all 0.2s;
        opacity: 0;
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
        /* -webkit-box-shadow: 0 1px 0 rgba(0,0,0,.05), 0 0.5px 0 rgba(0,0,0,.09); */
        border-bottom: 1px solid#e5e5e5;
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
      .baseInfo{
        height: calc(~"100vh - 1rem - 1px");
        padding-bottom: .5rem;
        box-sizing: border-box;
        overflow-y: scroll;
      }
      /*基本信息*/
      .infor-box{
        padding: 0.2rem 0.3rem;
        min-height: 1.2rem;
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
        li {
          flex: 1;
          text-align: center;
        }
        .left{
          display: flex;
          div{
            flex: 1;
            width: 1.05rem;
            font-size: 0.2rem;
            color:#999;
            position: relative;
            /* border-right: 1px solid #eee; */
            &:last-child{
              border-right: none;
            }
            svg{
              width: 0.45rem;
              height: 0.45rem;
              display: block;
              margin: 0 auto;
              margin-top: .1rem;
            }
            span{
              /* margin-top: .05rem; */
              display: block;
            }
          }
          /*收藏夹*/
          .collect-box{
            /* border-right: 1px solid #eee; */
            /*字体图标*/
            .shopCartIcon,.shopCartIconChecked{
              position: absolute;
              left: 0.4rem;
              top:0.05rem;
            }
          }
          .collect-box-active{
            span{
              color: #fe002e;
            }
          }
          /*购物车*/
          .shopCart-box{
            position: relative;
            svg{
              transform: scaleX(-1);
              -webkit-transform: scaleX(-1);
            }
            .shopCartNum{
              position: absolute;
              top:0rem;
              right: 0.15rem;
              width: 0.3rem;
              height: 0.3rem;
              background: #f23030;
              color:#fff;
              border-radius: 0.3rem;
              text-align: center;
              line-height: 0.3rem;
              font-size: 0.2rem;
              padding: 1px;
            }
          }
        }
        .conter{
          background: #a88d53;
          color:#fff;
          font-size: 0.28rem;
          height: .7rem;
          line-height: .7rem;
          border-radius: 30px;
        }
        .right{
          background: #f23030;
          color:#fff;
          font-size: 0.28rem;
          height: .7rem;
          line-height: .7rem;
          border-radius: 30px;
          margin-right: .14rem;
        }
        .cartNoTap{
          background: #c1c1c1;
        }
        .buyNoTap{
          background: #999999;
        }
      }
      .footer-index{
        z-index: 600;
      }
    }

    /*弹框*/
    .vux-popup-dialog{
      background: #fff;
      left: 0;
      right: 0;
      margin: auto;  
      max-width: 7.5rem;   
    }
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
