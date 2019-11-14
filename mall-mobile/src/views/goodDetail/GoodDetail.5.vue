<template>
    <div class="goodDetail" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
      <!--nfc信息-->
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
      <!--轮播图-->
      <div class="swiper-wrap">
        <swiper :aspect-ratio="800/800" dots-position="center">
          <swiper-item class="swiper-demo-img" v-for="(item, index) in basicGoodsInfor.imageList" :key="index">
            <img :src="item.imageUrl | filterImgUrl">
          </swiper-item>
        </swiper>
      </div>
      <!--基本信息-->
      <div class="infor-box">
        <p class="infor-title">{{basicGoodsInfor.goodsName}}</p>
        <div class="infor-price">
          <span v-if="basicGoodsInfor.goodsSpecialPrice || basicGoodsInfor.goodsPrice">¥{{basicGoodsInfor.goodsSpecialPrice ? basicGoodsInfor.goodsSpecialPrice : basicGoodsInfor.goodsPrice | moneyFilter }}</span>
          <span class="point" v-if="basicGoodsInfor.points">{{basicGoodsInfor.points}}积分可兑换</span>
        </div>
        <!-- <span class="integral-tip" v-if="basicGoodsInfor.canGetPoint">积分: 购买此商品可获得{{basicGoodsInfor.canGetPoint}}积分</span> -->
      </div>
      <div class="shopMessage">
        <div>
          <img :src="basicGoodsInfor.shopLogo | filterImgUrl" v-if="basicGoodsInfor.shopLogo">
          <img src="../../assets/images/shopLogo.png" v-else>
        </div>
        <div>{{basicGoodsInfor.shopName}}</div>
      </div>
      <div class="shopGetPoint" v-if="basicGoodsInfor.canGetPoint">积分: 购买此商品可获得{{basicGoodsInfor.canGetPoint}}积分</div> 
      <div class="interval"></div>
      <!--规格-->
      <div class="specs-box" @click="modalDialogfun(1)">
        <div class="words-left">
          <i>规格</i>
          <span class="defaultAttribute">
            <b v-for="(v,index) in defaultAttributeList">{{v}}</b>
          </span>
        </div>
        <div class="icon-right">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </div>
      </div>
      <div class="interval"></div>
      <!--tab切换-->
      <ul class="tab-title" id="tab-title" v-bind:class="tabFixed ? 'tabFixedClass' : ''">
       <li @click="tabContents('goodInfor')" :class="[{'active':(currentView=='goodInfor')}]">商品介绍</li>
       <li @click="tabContents('specsParamer')" :class="[{'active':(currentView=='specsParamer')}]">规格参数</li>
       <li @click="tabContents('comments')" :class="[{'active':(currentView=='comments')}]">评价</li>
       <li @click="tabContents('salesService')" :class="[{'active':(currentView=='salesService')}]">售后服务</li>
      </ul>
      <div v-bind:class="tabFixed ? 'tabFixedHei' : ''"></div>
      <div class="tab-content" id="tab-content">
        <keep-alive>
          <component :basicGoodsInfor="basicGoodsInfor" :is="currentView" ref="view"></component>
        </keep-alive>
      </div>
      <!--底部-->
      <div class="footer-hei"></div>
      <ol class="footer-box" :class="[{'footer-index':(typeNum==1)}]">
        <li class="left">
          <div>
            <img src="../../assets/images/back-home.png" @click="$router.push('/')">
            <span>首页</span>
          </div>
          <!--未收藏-->
          <div v-if="isCollectType == false">
            <img src="../../assets/images/Collection.png" @click="joinCalCollect(1)">
            <span>收藏</span>
          </div>
          <!--已收藏-->
          <div v-if="isCollectType == true" class="collect-box">
            <img src="../../assets/images/Collection-active.png" @click="joinCalCollect(2)">
            <span>收藏</span>
          </div>
          <div class="shopCart-box" @click="$router.push('/shopCart')">
            <img src="../../assets/images/shopCart.png" >
            <span>购物车</span>
            <div  class="shopCartNum" v-if="carListNums > 0">{{carListNums}}</div>
          </div>
        </li>
        <!--点击属性选择直接加入购物车、购买-->
        <template v-if="typeNum == 1">
          <li class="conter" @click="joinCart">加入购物车</li>
          <li class="right" @click="confirmOrder">立即购买</li>
        </template>
        <!--购物车、立即购买弹窗-->
        <template v-else>
          <li class="conter" @click="modalDialogfun(2)">加入购物车</li>
          <li class="right" @click="modalDialogfun(3)">立即购买</li>     
        </template>
      </ol>
      <!--商品属性弹框-->
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
                   <span class="price">￥{{goodsPriceStock.price}}</span>
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
                    <li :class="{'attributeActive': item.active, 'disabled': item.disabled}" v-for="(item,i) in v.goodsStandarValList" @click="item.disabled || item.active ? '' : selectedAttributeFun(v.goodsStandarValList, 2, item.id, item)">{{item.standardValName}}</li>
                  </template>
                </ul>
              </div>
            </div>
            <!--数量-->
            <ul class="num-box clr">
              <li class="left">数量</li>
              <li class="right">
                <com-cartcontrol  v-model="goodsNum"></com-cartcontrol>
              </li>
            </ul>
           </div>
           <!--按钮-->
           <div v-if="typeNum==2" class="btn" @click="joinCart">确认</div>
           <div v-if="typeNum==3" class="btn" @click="confirmOrder">确认</div>
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
        busy: false,
        swiperList: [],                           // 图片轮播
        basicGoodsInfor: {},                      // 基本信息
        currentView: 'goodInfor',                 // 商品介绍为默认组件
        attributeType: false,                     // 弹框的显示隐藏状态
        typeNum: '',                              // 规格=1 购物车=2 立即购买=3
        goodSpecImg: '',                          // 商品规格图片
        defaultAttributeList: [],                 // 默认属性列表
        goodsNum: 1,                              // 商品数量
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
        goodsPriceStock: {                        // 价格库存信息
          price: 0,
          stock: 0
        }
      }
    },
    mounted: function () {
      window.scrollTo(0, 0)    // 默认滚动条在顶部
      this.goodsDetailFun()    // 获取详情页信息
      // 获取nfc信息
      if (this.$route.query.chk) {
        this.getNfcMessage()
      }
    },
    methods: {
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
          goodsId: this.$route.query.goodsId
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
          id: this.$route.query.goodsId
        }).then((res) => {
          let resData = res.data
          let attrId = null
          if (resData.status !== this.api.ERR_OK || !res) return false
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
          // 固定栏目
          this.$nextTick(() => {
            this.columnFixed()
            this.isCollected() // 判断是否被收藏--需登录
            this.getCartNum() // 获取购物车信息--需登录
            // this.getMemberPoints() // 获取用户积分--需登录
          })
          // 数据赋值
          this.basicGoodsInfor = resData.data
          this.basicGoodsInfor.goodsStandardList.forEach((v, index) => {
            if (v.goodsStandarValList.length > 0) {
              // 默认进来的
              if (index === 0) {
                attrId = v.goodsStandarValList[0].id           // 第一个属性的id
              }
            }
          })
          this.arrValCombinat(1, attrId)          // 属性值组合
          // console.log(JSON.stringify(resData, null, 4))
        })
      },
      /**
       * 属性值组合
       * @types 1 默认进来选中 2 手动选中
       * @attrId 点击的第一个的id
      */
      arrValCombinat (types, attrId) {
        let basicGoodsInfor = this.basicGoodsInfor
        let standardValIdArrs = []        // standardValId集合
        let overplus = []
        if (basicGoodsInfor.goodsStandardList.length > 0) {
          let defaultAttribute = []         // 默认值
          // 不是组合属性
          if (basicGoodsInfor.goodsStandardList.length <= 1) {
            //
          } else {
            // 点击属性对应的属性
            console.log('attrId', attrId)
            basicGoodsInfor.goodsSkuList.forEach((item, ind) => {
              if (item.standardValIdArr.indexOf(attrId) > -1) {
                // console.log(JSON.stringify(item, null, 4))
                if (item.disStatus === 1) {
                  console.log('adfads')
                  var index = item.standardValIdArr.indexOf(attrId)
                  overplus.push(item.standardValIdArr[item.standardValIdArr.length - 1 - index])
                }
              }
            })
            console.log(overplus)
            // 属性设置是否可点击、获取选中值
            basicGoodsInfor.goodsStandardList.forEach((v, index) => {
              if (v.goodsStandarValList.length > 0) {
                v.goodsStandarValList.forEach((ats) => {
                  if (overplus.length > 0) {
                    console.log(ats.id)
                    overplus.forEach((el) => {
                      if (JSON.parse(ats.id) === JSON.parse(el)) {
                        this.$set(ats, 'disabled', true)
                      }
                    })
                  } else {
                    this.$set(ats, 'disabled', false)
                  }
                })
                if (types === 1) {
                  v.goodsStandarValList.filter((row) => !row.disabled)[0].active = true                            // 第一个属性默认选中状态
                  standardValIdArrs.push(v.goodsStandarValList.filter((row) => !row.disabled)[0].id)                   // 选中的id集合
                } else {
                  standardValIdArrs.push(v.goodsStandarValList.filter((row) => row.active)[0].id)                   // 选中的id集合
                }
                if (v.goodsStandarValList.filter((row) => !row.disabled).length > 0) {
                  defaultAttribute.push(v.goodsStandarValList.filter((row) => !row.disabled)[0].standardValName)       // 选中属性值
                }
              }
            })
          }
          // 取出默认选中的属性对应的库存、价格
          basicGoodsInfor.goodsSkuList.forEach((item, index) => {
            if (item.goodsSkuValList.length > 0) {
              if (item.standardValIdArr.toString() === standardValIdArrs.toString()) {
                // console.log(JSON.stringify(item, null, 4))
                this.goodsPriceStock = {
                  price: item.goodsPrice,
                  stock: item.goodsNum
                }
              }
            }
          })
          // 循环sku list通过standardValIdArr找到对应的库存、价格等
          this.defaultAttributeList = defaultAttribute
        }
        // console.log(standardValIdArrs)
      },
      /**
       * 属性选择
      */
      selectedAttributeFun (arr, types, attrId, item) {
        // 清空当前属性组
        arr.forEach((v, index) => {
          this.$set(v, 'active', false)
        })

        // 选中当前属性
        this.$set(item, 'active', true)
        this.arrValCombinat(2, attrId)
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
       * 加入购物车
      */
      joinCart () {
        // 选中属性拼接
        if (this.basicGoodsInfor.goodsAttributeList) {
          var obj = {}
          this.selectArrt = []
          this.basicGoodsInfor.goodsAttributeList.forEach((ite) => {
            ite.attributeValList.forEach((item) => {
              if (item.active) {
                obj = {
                  goodsAttributeId: ite.id,
                  goodsAttributeValId: item.id
                }
                this.selectArrt.push(obj)
              }
            })
          })
        }
        this.$http.post(`${this.api.addGoodsToShopCart}`, {
          goodsId: this.$route.query.goodsId,
          goodsNum: this.goodsNum,
          shopId: this.basicGoodsInfor.shopId,
          shopCartAttributeList: this.selectArrt
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
          goodsId: this.$route.query.goodsId,
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
          goodsId: this.$route.query.goodsId,
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
        if (this.basicGoodsInfor.goodsAttributeList) {
          var obj = {}
          var arr = []
          this.basicGoodsInfor.goodsAttributeList.forEach((ite) => {
            ite.attributeValList.forEach((item) => {
              if (item.active) {
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
          goodsId: this.$route.query.goodsId,
          goodsNum: this.goodsNum,
          goodsAttriBySoonList: arr
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
        if (this.currentView !== 'comments') return false
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
    .goodDetail {
      /*基本信息*/
      .infor-box{
        padding: 0.2rem 0.3rem;
        min-height: 1rem;
        border-bottom: 1px solid #eee;
        .infor-title{
          font-size: 0.3rem;
          color:#333;
          line-height: 1.6em;
        }
        .infor-price{
          display: flex;
          align-items: center;
          justify-content:space-between;
          span:nth-child(1){
            display: block;
            color:#f23030;
            font-size: 0.34rem;
            padding:0.2rem 0;
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
      .shopMessage{
        display:flex;
        padding: 0 .3rem;
        font-size: .28rem;
        align-items: center;
        height: .8rem;
        border-bottom: 1px solid #eee;
        img{
          width: .35rem;
          /* height: .5rem; */
          display: block;
          margin-right: .2rem;
        }
        div:nth-child(2){
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }
      }
      .shopGetPoint{
        padding: 0 .3rem;
        height: .8rem;
        line-height: .8rem;
        font-size: .28rem;
        color: #999999;
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
        .words-left{
          float: left;
          position: relative;
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
        height: 100%;
        min-height: calc(~"100vh - 0.8rem - 2px - 1rem ");
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
            border-right: 1px solid #eee;
            &:last-child{
              border-right: none;
            }
            img{
              width: 0.45rem;
              display: block;
              margin: 0 auto;
              margin-top: .1rem;
            }
            span{
              margin-top: .05rem;
              display: block;
            }
          }
          /*收藏夹*/
          .collect-box{
            border-right: 1px solid #eee;
            /*字体图标*/
            .shopCartIcon,.shopCartIconChecked{
              position: absolute;
              left: 0.4rem;
              top:0.05rem;
            }
          }
          /*购物车*/
          .shopCart-box{
            position: relative;
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
          background: #ff9700;
          color:#fff;
          font-size: 0.28rem;
          line-height: 1rem;
        }
        .right{
          background: #f23030;
          color:#fff;
          font-size: 0.28rem;
          line-height: 1rem;
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
                /* margin-top:0.1rem; */
              }
              .price{
                color:#f23030;
                font-size: 0.26rem;
                /* margin-top:0.2rem; */
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
</style>
