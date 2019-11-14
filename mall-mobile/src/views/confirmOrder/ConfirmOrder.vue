<template>
    <div class="confirmOrder">
      <!--用户基本信息-->
      <ul class="userInfor-box" @click="$router.push({path: '/receiveAddr', query: { confirmOrder: 'confirmOrder'}})">
       <!--无数据-->
        <template v-if="JSON.stringify(defaultReceiveAddrInfo) == '{}'">
         <li class="left-clues">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dingwei1"></use>
            </svg>
            没有地址信息，请点击后填写地址
          </li>
          <li class="right-clues">
            <x-icon type="ios-arrow-right" size="20"></x-icon>
          </li>
        </template>
        <!--有数据-->
        <template v-else>
          <li class="left">{{defaultReceiveAddrInfo.name}}</li>
          <li class="center">
              <span class="phone">{{defaultReceiveAddrInfo.phone}}</span>
              <p class="addr">{{addDetail}}</p>
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
        <div class="goodList-grop" v-for="(item, ind) in goodsList">
          <div class="goodList-shop">
            <!-- <img :src="item.list[0].brandLogo | filterImgUrl" v-if="item.list && item.list[0].brandLogo"> -->
            <img src="../../assets/images/warehouse.png">
            <p>{{item.list[0].storageName}}</p>
          </div>
          <li v-for="(v,index) in item.list">
            <div class="goodList-list">
              <div class="icon">
                <img :src="v.mainImage | filterImgUrl">
              </div>
              <div class="text">
                <h2 class="infor">{{ v.goodsName }}</h2>
                <div class="attribute ">{{ v.goodsAttribute }}</div>
                <div class="list-Label" v-if="v.orderSource !== 3 && v.orderSource !== 4 && v.orderSource !== 5 && v.orderSource !== 9 && v.orderSource !== 12 && v.orderSource !== 13">
                  <ul>
                    <template v-if="v.orderSource !== 2 && v.orderSource !=7 && v.orderSource !=9">
                      <li v-if="v.canGetPoints">
                        <p>积</p>
                        <p>赠送{{v.canGetPoints}}积分</p>
                      </li>
                      <li v-if="v.whetherBlancePay">
                        <p>余</p>
                        <p>余额支付</p>
                      </li>
                    </template>
                    <li v-if="v.whetherPoints" v-show="v.orderSource !=7">
                      <p>兑</p>
                      <p>积分兑换</p>
                    </li>
                  </ul>
                </div>
                <div class="list-Label" v-if="v.orderSource == 9 ">
                  <ul>
                    <li class="redByLuck" v-show="v.luckyAddPrice">
                     获得{{ v.luckyAddPrice * v.goodsNum}}批发券
                    </li>
                  </ul>
                </div>

                <div class="price-num clr">
                  <!-- 1:普通购物 -->
                  <p class="price" v-if="v.orderSource === 1">¥{{v.whetherSpecial && v.goodsSpecialPrice ? v.goodsSpecialPrice : v.goodsPrice | moneyFilter}}</p>
                  <!-- 2：分享订单 -->
                  <p class="price" v-if="v.orderSource === 2">¥{{v.goodsPrice | moneyFilter}}</p>
                  <!-- 3：芯豆订单、4：消费积分订单、5：联盟积分订单 -->
                  <p class="price" v-if="v.orderSource === 3 || v.orderSource === 4 || v.orderSource === 5">¥{{v.goodsPrice}} <span v-if="v.typePonts">+ {{v.typePonts}}{{pointsTxt[orderSource - 1]}}</span></p>
                  <!-- 1:买卖仓 抢购 -->
                  <p class="price" v-if="v.orderSource === 9">
                    ¥{{v.whetherSpecial && v.goodsSpecialPrice ? v.goodsSpecialPrice : v.goodsPrice | moneyFilter}}
                    <!--{{v.luckyAddPrice ? '+采购金额'+ v.luckyAddPrice : ''}}-->
                  </p>
                  <!--批发提货 固定0.1元-->
                  <p class="price" v-if="v.orderSource === 11">
                    ¥{{0 | moneyFilter}}
                    <!--{{v.luckyAddPrice ? '+采购金额'+ v.luckyAddPrice : ''}}-->
                  </p>
                  <!--超级拼团 goodsGroupPrice拼团价格-->
                  <p class="price" v-if="v.orderSource === 12 || v.orderSource === 13">
                    ¥{{v.goodsGroupPrice | moneyFilter}}
                    <!--{{v.luckyAddPrice ? '+采购金额'+ v.luckyAddPrice : ''}}-->
                  </p>
                  <p class="num">x {{v.goodsNum}}</p>
                </div>
              </div>
            </div>
            <!-- 能积分兑换 and 订单类型是正常的订单可用 -->
            <div class="exchange" v-if="v.whetherPoints == 1 && v.orderSource === 1">
              <p>积分兑换</p>
              <div>
                <span>{{v.points}}积分可兑换</span>
                <input type="checkbox" @change="pointChange(v)" v-model="v.inpCheckSte">
              </div>
            </div>
          </li>
          <!-- <div class="Postage">
            <div>邮费</div>
            <div><i>¥{{item.selectLogistics.price ? item.selectLogistics.price : 0}}</i></div>
          </div> -->
          <!--配送方式-->
          <div class="sendType">
            <div class="left">
              <!-- <template v-if="item.freeAdmission && item.totalPrice > item.freeAdmission.freeShipping">
                <span>免运费</span>
              </template>
              <template v-else> -->
                <span v-if="JSON.stringify(item.selectLogistics) != '{}'">{{item.selectLogistics.name}}</span>
              <!-- </template> -->
            </div>
            <!--商品总金额>运费基准点=免运费，否则选择运费方式-->
            <div @click="showLogisticPop(item.shopId, ind)" class="right">
              <span>
                <i v-if="JSON.stringify(item.selectLogistics) == '{}'">请选择配送方式</i>
                <i v-else>
                  <template v-if="item.selectLogistics.logisticsType === 0">
                    {{item.selectLogistics.price}}元
                  </template>
                  <template v-else>
                    {{item.selectLogistics.logisticsType | filterLogistics}}
                  </template>
                </i>
              </span>
              <x-icon type="ios-arrow-right" size="20" style="vertical-align: middle;"></x-icon>
            </div>
            <!-- <template v-if="item.totalPrice > freeAdmission.freeShipping">
              <div class="left">
                <span>免运费</span>
              </div>
            </template>
            <template v-else>
              <div class="left" v-if="item.totalPrice > freeAdmission.freeShipping">
                <span>{{item.selectLogistics.name}}</span>
              </div>
              <div @click="showLogisticPop(item.shopId, ind)" class="right">
                <span>
                  <i v-if="JSON.stringify(item.selectLogistics) == '{}'">请选择配送方式</i>
                  <i v-else>{{item.selectLogistics.price}}元</i>
                </span>
                <x-icon type="ios-arrow-right" size="20" style="vertical-align: middle;"></x-icon>
              </div>
            </template> -->
          </div>
        </div>
      </ul>
      <!--商品信息-->
      <ol class="goodInfor-box">
        <!-- <li class="integral-tip">
          <div class="left">我的积分</div>
          <div class="right"><span class="total-point">{{totalIntegral}}</span> 积分</div>
        </li> -->
        <li class="msg">
          <div>买家留言：</div>
          <input type="text" placeholder="选填：填写内容已和卖家协商确认" v-model="remark">
        </li>
        <!-- 分享订单不显示此行 -->
        <li class="integral-tip" v-if="orderSource !== 2 && orderSource !=7 && orderSource !=9 && orderSource != 12 && orderSource != 13">
          <div class="left">积分</div>
          <div class="right">购买此商品确认收货后可获得<span>{{integralData}}</span>积分</div>
        </li>
      </ol>
      <ol class="goodInfor-box">
       <li class="goodCalculate">
          <div class="left">邮费</div>
          <div class="right"><i>¥{{Total[1]}}</i></div>
        </li>
        <li class="goodCalculate" v-if="orderSource === 3 || orderSource === 4 || orderSource === 5">
          <div class="left">{{pointsTxt[orderSource - 1]}}</div>
          <div class="right" v-if="orderSource === 1"><i>{{useIntegral}}分</i></div>
          <div class="right" v-if="orderSource === 3 || orderSource === 4 ||orderSource === 5"><i>{{typePoints}}分</i></div>
        </li>
        <li class="goodCalculate">
          <div class="left">商品金额</div>
          <div class="right"><i>¥{{goodstotalPrice | moneyFilter(1)}}</i></div>
        </li>
        <li class="goodCalculate" v-if="orderSource === 12">
          <div class="left">团长减免</div>
          <div class="right"><i>- ¥{{goodstotalPrice | moneyFilter(1)}}</i></div>
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
              <div class='distribution-mode-list' :class="selextShopIndex >= 0 && goodsList[selextShopIndex] && goodsList[selextShopIndex].selectLogisticsIndex == index ? 'distribution-mode-select' : ''" v-for="(item, index) in logisticsList" @click="chooseLogistics(item, index)">
                <div>{{item.logisticsName}}</div>
                <div v-if="item.logisticsType === 0">¥{{item.logisticsCost}}</div>
                <div v-else>{{item.logisticsType | filterLogistics}}</div>
              </div>
            </div>
          </div>
        </popup>
      </div>
      <!--底部-->
      <div class="footer-hei"></div>
      <ol class="footer-box">
        <li class="left" v-if="orderSource != 9 && orderSource !=11 && orderSource !=12">
          合计：
          <span v-if="Total[0] - freeMoney <= 0">¥0.01</span>
          <span v-else>¥{{Total[0] - freeMoney | moneyFilter(1)}}</span>
        </li>
        <li class="left" v-if="orderSource === 12">
          合计：
          <span v-if="Total[1] - freeMoney <= 0">¥0.01</span>
          <span v-else>¥{{Total[1] - freeMoney | moneyFilter(1)}}</span>
        </li>
        <!--抢购-->
        <li class="left" v-if="orderSource === 9">
          合计：
          <span v-if="Total[0] - freeMoney <= 0">¥0.01</span>
          <span v-else>¥{{Total[0] - freeMoney  | moneyFilter(1)}}</span>
        </li>
        <!--批发提货-->
        <li class="left" v-if="orderSource === 11">
          合计：
          <span>¥0.00</span>
        </li>
        <li class="right" @click="confirmOrder" v-if="confirmBtn">提交订单</li>
        <!--<li class="right" @click="isSHareCode" v-if="confirmBtn && orderSource == 13">提交订单</li>-->
        <li class="right right-gray"  v-if="!confirmBtn" v-else>提交订单</li>
      </ol>
      <!--邀请好友绑定邀请人的弹框-->
      <div class="bindInviter">
        <x-dialog v-model="bindCodeShow" class="dialog-demo">
          <x-icon type="ios-close-outline" style="fill:#fff;top: -0.8rem;position: absolute;left: 50%;margin-left: -0.3rem;" @click="isInviter(1)"></x-icon>
          <div style="padding: 0.5rem;">
            <div class="bindTop">
              <!--<div class="bind-l"><img :src="people"/></div>-->
              <div class="bind-r">您尚未绑定邀请人，点击确定后将绑定该团团长邀请码。是否绑定？</div>
            </div>
            <div class="bindBottom">
              <div class="bind-yes" @click="isInviter(1)">取消</div>
              <div class="bind-no" @click="isInviter(2)">确定</div>
            </div>
          </div>
        </x-dialog>
      </div>
    </div>
</template>

<script>
  import Vue from 'vue'
  import { TransferDom, Popup, XDialog } from 'vux'
  import { setTimeout } from 'timers'
  export default {
    directives: {
      TransferDom
    },
    components: {
      TransferDom,
      Popup,
      XDialog
    },
    data () {
      return {
        shareInvitationCode: '',            // 分享邀请码
        bindCodeShow: false,                // 绑定邀请人信息
        bsbUserInfo: {},                    // 登录个人信息
        times: null,                       // 定时器
        pointsTxt: ['积分', '分享', '芯豆', '消费积分', '联盟积分'],
        typePoints: 0,                     // 不同积分区进去相应的总和
        orderData: [],                     // 订单数据
        totalFreight: 0,                   // 总邮费
        showPop: false,                    // 显示物流列表弹窗
        goodsList: [],                     // 购物车过来的商品列表
        remark: '',                        // 买家留言
        addDetail: '',                     // 详细地址
        defaultReceiveAddrInfo: {},        // 默认地址信息
        logisticsList: [],                 // 物流列表
        selectLogistics: '',               // 选中的物流信息
        selectLogisticsIndex: null,        // 物流选中的索引
        freeAdmission: {},                 // 免邮费金额点
        totalIntegral: '0',                // 总积分
        goodstotalPrice: 0,                // 商品总价格
        freeMoney: 0,                      // 积分减免的金额总和
        useIntegral: 0,                    // 使用的积分总和
        integralData: '',                  // 积分信息
        goodsNum: 1,                       // 商品种数
        confirmBtn: true,                  // 提交按钮防止多次提交
        selextShopIndex: 0,                // 选中的店铺的下标
        skuIdsArr: [],                     // 商品id集合
        orderSource: 1                     // 订单类型
      }
    },
    mounted: function () {
      var user = localStorage.getItem('bsbUserInfo') ? localStorage.getItem('bsbUserInfo') : ''
      if (user) {
        this.bsbUserInfo = JSON.parse(user)
      }
      this.shareInvitationCode = localStorage.getItem('invitationCode') || ''                       // 通过分享进来的code
      this.sharePath = localStorage.getItem('sharePath') || ''                                      // 分享进来的路径
      this.orderData = JSON.parse(localStorage.getItem('confirmOrderInfo'))
      console.log(this.orderData, 'orderData')
      this.orderSource = this.orderData[0].orderSource
      // 初始化选中状态
      this.orderData.forEach((item, index) => {
        Vue.set(item, 'inpCheckSte', false)
      })
      // 数据根据shopId分组
      var obj = {}
      var arr = []
      this.orderData.forEach((item) => {
        this.skuIdsArr.push(item.skuId) // 所有商品的id集合
        if (!obj[item.shopId]) {
          arr.push({
            shopId: item.shopId,
            shopCartIds: [],
            goodsNum: 0,
            orderSource: '',               // 1:普通购物，2：分享订单 3： 芯豆购买 4： 消费积分购买 5：联盟积分购买
            totalPrice: 0,                 // 店铺下面所有商品的价格和
            orderDetailList: [],           // 店铺下面的商品列表
            selectLogistics: {},           // 店铺选中物流
            selectLogisticsIndex: null,    // 店铺选择index
            list: [item]
          })
          obj[item.shopId] = item
        } else {
          arr.forEach((ite) => {
            if (ite.shopId === item.shopId) {
              ite.list.push(item)
              return true
            }
          })
        }
      })
      this.goodsList = arr
      // 如果是从地址列表页跳过来的 就取本地地址数据 否则就获取默认地址
      if (this.$route.query.addType && this.$route.query.addType === 'byAddList') {
        this.defaultReceiveAddrInfo = JSON.parse(localStorage.getItem('addressData'))
        this.addDetail = this.defaultReceiveAddrInfo.province + ' ' + this.defaultReceiveAddrInfo.city + ' ' + this.defaultReceiveAddrInfo.zone + ' ' + this.defaultReceiveAddrInfo.address
      } else {
        this.getDefaultAdd()
      }
      this.getPostageMes()           // 获取免邮金额点
      this.getGoodstotalPrice()      // 计算总价
      this.getIntegral()             // 获取购买此商品能得到积分信息
      this.getMemberPoints()         // 用户总积分
      // 初始化物流信息
      this.goodsList.forEach((item) => {
        this.getLogisticsList(item.shopId, item)
      })
    },
    watch: {
      orderData: {
        handler (val) {
          val.forEach((item) => {
            this.typePoints += parseInt(item.typePonts) * item.goodsNum      // 消费积分、联盟积分、芯豆等不同类型进入的积分
          })
        },
        deep: true
      }
    },
    computed: {
      /**
       * 合计
      */
      Total () {
        // 有邮费
        var logisticsPrice = 0
        this.goodsList.forEach((item) => {
          if (JSON.stringify(item.selectLogistics) !== '{}') {
            if (item.selectLogistics.logisticsType !== 2) {
              logisticsPrice += parseFloat(item.selectLogistics.price)
            }
          }
        })
        return [parseFloat(this.goodstotalPrice) + logisticsPrice, logisticsPrice] // 数组[0] 总价格 数组[1] 总邮费
      }
    },
    methods: {
      /**
       * 获取用户积分信息
      */
      getMemberPoints () {
        this.$http.get(`${this.api.getMemberPoints}`, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.totalIntegral = res.data.data.bonusPoints
        })
      },
      /**
       * 获取能得到多少积分
      */
      getIntegral () {
        var obj = {}
        var arrList = []
        this.goodsList.forEach((item) => {
          item.list.forEach((ite) => {
            obj = {
              goodsNum: ite.goodsNum,
              goodsId: ite.goodsId || ite.id,
              skuId: ite.skuId
            }
            arrList.push(obj)
          })
        })
        if (this.orderData[0].orderSource === 1) {
          this.$http.post(this.api.calculateGoodsPoints, {
            goodsPointsList: arrList
          }).then((res) => {
            let resData = res.data
            if (resData.status === this.api.ERR_OK) {
              this.integralData = resData.data
            }
          })
        } else if (this.orderData[0].orderSource === 2) {
          this.$http.get(this.api.getPointsByShareGoodsSku, {
            params: {
              skuId: this.orderData[0].skuId
            }
          }).then((res) => {
            let resData = res.data
            if (resData.status === this.api.ERR_OK) {
              this.integralData = resData.data
            }
          })
        }
      },
      /**
       * 计算商品总金额
      */
      getGoodstotalPrice () {
        let goodsNum = 0 // 商品种数
        this.goodsList.forEach((v, index) => {
          v.list.forEach((ite) => {
             // 普通购物
            if (ite.goodsSpecialPrice && ite.whetherSpecial && ite.orderSource === 1) {
              this.goodstotalPrice += ite.goodsSpecialPrice * ite.goodsNum
            } else if (ite.orderSource === 7 || ite.orderSource === 13) {
//              console.log(ite, 'ite')
              this.goodstotalPrice += ite.goodsGroupPrice * ite.goodsNum
            } else if (ite.orderSource === 12) {
              this.goodstotalPrice += ite.goodsGroupPrice * ite.goodsNum
            } else if (ite.orderSource === 9) {
              this.goodstotalPrice += ite.goodsPrice * ite.goodsNum
            } else {
              this.goodstotalPrice += ite.goodsPrice * ite.goodsNum
            }
            v.totalPrice += ite.goodsPrice * ite.goodsNum // 每个店铺商品价格统计集合
            goodsNum++
          })
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
              this.addDetail = this.defaultReceiveAddrInfo.province + ' ' + this.defaultReceiveAddrInfo.city + ' ' + this.defaultReceiveAddrInfo.zone + ' ' + this.defaultReceiveAddrInfo.address
            }
          }
        })
      },
      /**
       * 获取免邮金额点
      */
      getPostageMes () {
        let shopIdArr = []
        this.goodsList.forEach((item) => {
          shopIdArr.push(item.shopId)
        })
        this.$http.post(`${this.api.getShopFreeShipList}`, shopIdArr).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            if (resData.data) {
              resData.data.forEach((item) => {
                this.goodsList.forEach((ite) => {
                  this.$set(ite, 'freeAdmission', item)
                })
              })
              // this.freeAdmission = resData.data
            }
          }
        })
      },
      /**
       * 获取物流列表
      */
      getLogisticsList (shopId, item, cb) {
        this.$http.get(`${this.api.getLogisticsList}`, {
          params: {
            shopId: shopId
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            if (resData.data && resData.data.length > 0) {
              // 如果是默认选择&满足需要邮费条件
              if (item) {
                item.selectLogistics = {
                  name: resData.data[0].logisticsName,
                  id: resData.data[0].id,
                  price: resData.data[0].logisticsCost,
                  logisticsType: resData.data[0].logisticsType
                }
                item.selectLogisticsIndex = 0     // 初始化物流选中状态
              }
            }
            this.logisticsList = resData.data
            if (cb) {
              return cb(resData.data)
            }
          }
        })
      },
      /**
       * 打开物流弹窗
      */
      showLogisticPop (shopId, index) {
        this.selextShopIndex = index
        // this.selectLogisticsIndex = null
        this.getLogisticsList(shopId, '', (res) => {
          if (res && res.length > 0) {
            this.showPop = true
          } else {
            this.$vux.toast.text('物流列表为空')
          }
        })
      },
      /**
       * 选择物流信息
      */
      chooseLogistics (item, index) {
        this.showPop = false
        this.goodsList[this.selextShopIndex].selectLogistics = {
          name: item.logisticsName,
          id: item.id,
          price: item.logisticsCost,
          logisticsType: item.logisticsType
        }
        this.goodsList[this.selextShopIndex].selectLogisticsIndex = index
        // this.selectLogisticsIndex = index
      },
      /**
       * 使用积分兑换
      */
      pointChange (v) {
        if (v.inpCheckSte) {
          // 判断积分是否足够
          if (this.totalIntegral - this.useIntegral < v.points * v.goodsNum) {
            v.inpCheckSte = false
            this.$vux.toast.text('没有足够积分')
            return false
          }
          this.freeMoney += parseFloat((v.whetherSpecial && v.goodsSpecialPrice ? v.goodsSpecialPrice : v.goodsPrice) * v.goodsNum)
          this.useIntegral += v.points * v.goodsNum
        } else {
          this.freeMoney = this.freeMoney - parseFloat((v.whetherSpecial && v.goodsSpecialPrice ? v.goodsSpecialPrice : v.goodsPrice) * v.goodsNum)
          this.useIntegral = this.useIntegral - (v.points * v.goodsNum)
        }
      },
      /**
       * 提交订单
      */
      confirmOrder () {
        var flag = true
        if (JSON.stringify(this.defaultReceiveAddrInfo) === '{}') {
          this.$vux.toast.text('请选择收货地址')
          return false
        }
        this.goodsList.forEach((item) => {
          // if (item.totalPrice < item.freeAdmission.freeShipping) {
          //   if (JSON.stringify(item.selectLogistics) === '{}') {
          //     this.$vux.toast.text('请选择配送方式')
          //     flag = false
          //   }
          // }
          if (JSON.stringify(item.selectLogistics) === '{}') {
            this.$vux.toast.text('请选择配送方式')
            flag = false
          }
        })
        if (!flag) return false
        this.$vux.loading.show({
          text: '订单提交中'
        })
        this.confirmBtn = false
        let orderDetailListObj = {}
        var shopArr = []
        let obj = {}
        var goodsNum = 0
        this.goodsList.forEach((item) => {
//          console.log(item)
          item.orderDetailList = []
          item.shopCartIds = []
          // 解析商品列表
          item.list.forEach((ite) => {
            orderDetailListObj = {
              goodsId: ite.goodsId || ite.id,
              skuId: ite.skuId,
              goodsNum: ite.goodsNum,
              goodsAttribute: ite.goodsAttribute,
              invicationCode: ite.shareInvitationCode || '',
              whetherPointsOrder: ite.inpCheckSte ? 1 : 0
            }
            // 重写 orderSource
            item.orderSource = ite.orderSource
            item.orderDetailList.push(orderDetailListObj)
            goodsNum++
//            item.goodsNum++
            item.shopCartIds.push(ite.id)
          })
          // 基础下单数据组装
          obj = {
            shopCartIds: item.shopCartIds.toString() || '',
            customerPhone: this.defaultReceiveAddrInfo.phone,
            customerAddress: this.addDetail,
            customerName: this.defaultReceiveAddrInfo.name,
            receiptAddressId: this.defaultReceiveAddrInfo.id,
            orderSource: item.orderSource,
            goodsNum: goodsNum, // 商品种数
            logisticsAmount: item.selectLogistics.price || 0,
            logisticsId: item.selectLogistics.id || 0,
            shopId: item.shopId,
            customerFeedback: this.remark,
            orderDetailList: item.orderDetailList
          }
          // 拼团注入拼主id,活动id
          if (item.orderSource === 7) {
            obj.ifHeadUser = item.list[0].ifHeadUser
            obj.groupId = item.list[0].groupId
            obj.themeId = item.list[0].themeId
          }
          if (item.orderSource === 12 || item.orderSource === 13) {
            obj.ifHeadUser = item.list[0].ifHeadUser
            obj.groupId = item.list[0].groupId
            if (item.orderSource === 12) {
              obj.isTerraceShow = item.list[0].isTerraceShow ? 1 : 0
            }
          }
          // 批发注入推广code
          if (item.orderSource === 9) {
            obj.purchaseCode = item.list[0].purchaseCode
          }
          // 批发提货 注入 提货商品主键
          if (item.orderSource === 11) {
            obj.hangId = item.list[0].hangId
          }
          shopArr.push(obj)
        })
        // 开始下单请求
//        console.log(JSON.stringify(shopArr))
        this.$http.post(this.api.addOrder, shopArr).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            // 记录订单id 订单编号 订单商品个数
            localStorage.setItem('payOrderId', resData.data.orderId)
            localStorage.setItem('payOrderNo', resData.data.orderNo)
            localStorage.setItem('payOrderSzie', shopArr.length)
            // 记录下单项目 1:商城h5 2:积分管理
            localStorage.setItem('orderType', 1)
            setTimeout(() => {
              // + '&orderPrice=' + (this.Total[0] - this.freeMoney)
              localStorage.setItem('skuIdsArr', JSON.stringify(this.skuIdsArr)) // 存储商品id集合-付款页查询判断是否能用余额付款
              // 提货商品 不参与付款 跳转商品详情
              if (this.orderData[0].orderSource === 11) {
                localStorage.setItem('goOrderState', '')
                window.location.replace(window.location.href.match(/.*mshop/gi)[0] + '/orderList')
              } else {
                // 其余跳转付款页面
                window.location.replace(window.location.href.match(/.*mshop/gi)[0] + '/pay/orderPay?redirect=gopay&payTyps=total&buyType=1&shopId=1' + '&orderSource=' + this.orderData[0].orderSource)
              }
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
       * 是否有存团长邀请码(app.vue地址栏存入本地的邀请码)
       */
      isSHareCode () {
        console.log(this.shareInvitationCode)
        console.log(this.sharePath)
        if (this.shareInvitationCode && this.sharePath === '/mshop/groupAdd') {
          this.isBandCodeFn()
        } else {
          this.confirmOrder()
        }
      },
       /**
       * 是否绑定邀请人(个人信息接口)
       */
      isBandCodeFn () {
        this.$http.post(`${this.api.personalInfo}`, {
          id: this.bsbUserInfo ? this.bsbUserInfo.userId : ''
        }).then((res) => {
          // console.log(res)
          this.personalData = res.data.data
          if (res.data.status !== this.api.ERR_OK || !res) {
            this.$vux.toast.text(res.data.msg)
            return false
          }
          if (!this.personalData.beInvitationCode) {
            this.bindCodeShow = true
          } else {
            this.confirmOrder()
          }
        })
      },
      /**
       * 关闭邀请人弹框
       */
      isInviter (n) {
        // console.log(v)this.bindCodeShow = false
        this.bindCodeShow = false
        if (n === 2) {
          console.log('绑定邀请人')
          this.checkInvCodeId((res) => {
            if (res.data.status !== this.api.ERR_OK) {
              this.$vux.toast.text(res.data.msg)
              return false
            } else {
              // 提交
              this.$http.post(`${this.api.bandRecommendRelation}`, {
                invitationCode: this.shareInvitationCode,
                recommendCode: this.shareInvitationCode
              }).then((res) => {
                this.$vux.toast.text(res.data.msg)
                if (res.data.status !== this.api.ERR_OK) {
                  return false
                }
                this.confirmOrder()
              })
            }
          })
        }
      },
      /**
       * 检测邀请码ID是否正确
       */
      checkInvCodeId (fun) {
        if (!this.shareInvitationCode.match(/^[A-Z]\d{4,}$/)) {
          this.$vux.toast.text('邀请码对应用户不存在')
          return false
        }
        this.$http.post(`${this.api.getInvitationInfo}`, {
          recommendCode: this.shareInvitationCode
        }).then((res) => {
          fun(res)
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
          display: flex;
          align-items: center;
          color: #999999;
          font-size: .28rem;
          flex:1;
          svg{
            width: .47rem;
            height: .61rem;
            margin-right: .3rem;
          }
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
      .sendType{
        padding: 0 0.3rem;
        height: .8rem;
        display: flex;
        align-items: center;
        font-size: .28rem;
        .left{
          font-size: .28rem;
          color: #333333;
          span{
            font-weight: bold;
          }
        }
        .right{
          flex: 1;
          text-align: right;
          color: #353535;
          i{
            color: #353535;
          }
        }
        span{
          /* margin-right: 0.5rem; */
          vertical-align: middle;
        }
      }
      /*商品信息*/
      .goodInfor-box{
        background: #fff;
        border-top: .2rem solid #eee;
        font-size: .28rem;
        li{
          padding:0 0.3rem;
          height: 0.8rem;
          line-height: 0.8rem;
          border-bottom: 1px solid #eee;
          position: relative;
          display: flex;
          justify-content: space-between;
          .right{
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
          div:nth-child(1){
            font-size: .28rem;
            color: #333333;
            font-weight: bold;
          }
          input{
            flex: 1;
            text-align: right;
            &::-webkit-input-placeholder {
              color: #999999;
            }
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
            color: #333;
            .total-point{
              color: #fbb269;
            }
            span{
              color: #f23030;
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
        .goodList-grop{
          height: auto;
          overflow: hidden;
          border-bottom: .2rem solid #eee;
          &:last-child{
            border-bottom: none;
          }
          .Postage{
            display: flex;
            align-items: center;
            height: .8rem;
            padding: 0 .3rem;
            border-bottom: 1px solid #eee;
            div:nth-child(1){
              flex:1;
              font-size: .28rem;
              color: #353535;
            }
            div:nth-child(2){
              color:#f23030;
              font-size: .28rem;
            }
          }
        }
        .goodList-shop{
          height: .77rem;
          display: flex;
          align-items: center;
          margin: 0 .3rem;
          border-bottom: 1px solid #eeeeee;
          color: #333333;
          font-size: .28rem;
          img{
            width: .32rem;
            height: .32rem;
            margin-right: .24rem;
            display: block;
          }
          p{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        li{
          padding-left: 0.3rem;
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
              padding-top: .3rem;
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
                /* min-height: .2rem; */
              }
              /* 标签 */
              .list-Label{
                min-height: .2rem;
                height: auto;
                overflow: hidden;
                ul{
                  li{
                    padding-left: 0;
                    p{
                      display:block;
                    }
                    p:nth-child(1){
                      padding: 0 .03rem;
                      background: #e82626;
                      border-radius: 3px;
                      font-size: .18rem;
                      color: #fff;
                    }
                    p:nth-child(2){
                      color: #eb1717;
                      font-size: .18rem;
                      margin-left: .1rem;
                    }
                    float: left;
                    display: flex;
                    align-items: center;
                    margin-right: .1rem;
                    margin-bottom: .1rem;
                    &:last-child{
                      margin-right: 0;
                    }
                  }
                  .redByLuck {
                    line-height: .4rem;
                    border-radius: .3rem .3rem .3rem .3rem;
                    border: 1px solid #e64340;
                    background: #e64340;
                    color: #fff;
                    padding-left: .2rem;
                    padding-right: .2rem;
                  }
                }
              }


              .price-num{
                /* margin-top:0.2rem; */
                font-size: .26rem;
                .price{
                  float: left;
                  color: red;
                  font-size:.28rem;
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
            justify-content: space-between;
            padding-right: .3rem;
            font-size: .26rem;
            border-bottom: 1px solid #eee;
            p{
              color: #333333;
              font-size: .28rem;
              font-weight: bold;
            }
            div{
              display: flex;
              align-items: center;
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
                  background-color: #f95a58;
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
          background: -webkit-linear-gradient(135deg, #f23230, #fe8c45);
          background: linear-gradient(135deg, #f23230, #fe8c45);
          text-align: center;
          font-size: 0.28rem;
          color:#fff;
        }
        .right-gray{
          background: #ccc;
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
