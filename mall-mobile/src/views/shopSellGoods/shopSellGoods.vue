<template>
  <div style="padding-bottom: 1rem;">
    <topLucky></topLucky>
    <div class="sellGood">
      <div class="sellBg">
        <img src="../../assets/images/shopLucky/backSell.png" style="width: 7.1rem;height: 2.46rem;"/>
      </div>
      <div class="sellNav">
        <div class="titleText">我的商品销售情况 </div>
        <ul>
          <li>
            <div class="sell_dec">{{list.purchaseNumTotal}}</div>
            <div class="sell_num">批发数量</div>
          </li>
          <li>
            <div class="sell_dec">{{list.hasSellFlag}}</div>
            <div class="sell_num">已卖出</div>
          </li>
          <li>
            <div class="sell_dec">{{list.waitSellNum}}</div>
            <div class="sell_num">未卖出</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="sellGoodList">
      <ul>
        <li v-for="(item, index) in myShopList" :key="index" @click="goDetail(item)">
          <div class="sellGoodList_Top">
            <p>卖出预计收益：<span>{{item.hangRebate}}</span>元起</p>
          </div>
          <div class="sellGoodList_Center">
            <div class="sgl_l">
              <img :src="item.mainImage | filterImgUrl"/>
            </div>
            <div class="sgl_r">
              <div class="clamp2">{{item.goodsName}}</div>
              <div class="sell_Price">￥{{item.purchasePrice | moneyFilter}}</div>
              <div class="botList">
                <div> 批发<span>{{item.purchaseNumTotal}}</span>件</div>
                <div> 待售<span>{{item.waitSellNum}}</span>件</div>
                <div> 已售<span>{{item.hasSellNum}}</span>件</div>
              </div>
            </div>
          </div>
          <div class="sellGoodList_Bottom">
            <div class="pop_btn" @click.stop="share(item)">
              <span>
                <img src="../../assets/images/shopLucky01/aaaicon_sha.png"/>
              </span>
              <span>推广商品</span>
            </div>
            <div class="pop_btn" @click.stop="cancelSale(item)">
              <span>
              <img src="../../assets/images/shopLucky01/xiaoyuandian.png"/></span>
              <span>挂售管理</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!--创建的长按识别图片-->
    <create-share-img :shareData="shareCon" ref="imageWrapper" v-model="showToast"></create-share-img>

    <!-- 未成为超级会员弹窗及绑定邀请人信息弹窗 -->
    <div class="memberSte11">
      <x-dialog v-model="showMemberSte" :hide-on-blur="true">
        <svg class="icon close-icon" aria-hidden="true" @click="showMemberSte = false">
          <use xlink:href="#icon-tubiao-"></use>
        </svg>
        <svg class="icon sigh-icon" aria-hidden="true">
          <use xlink:href="#icon-gantanhao-copy"></use>
        </svg>
        <!-- 第一步 -->
        <template v-if="memberStep == 1">
          <div class="memberSte-tip">
            <p>您尚未成为超级会员，购买活动</p>
            <p>任意商品即可享受升级</p>
          </div>
          <div class="memberSte-btn" @click="showMemberSte = false">立即购买</div>
        </template>
        <!-- 第二步 -->
        <template v-if="memberStep == 2">
          <div class="update-hints">您需要绑定邀请人信息后才能进行分享</div>
          <ul>
            <li>
              <div>邀请人ID号:</div>
              <div><input type="text" v-model="formData.invitCode" v-on:input ="getInvitation" maxlength="5" placeholder="请输入邀请人ID号"></div>
            </li>
            <li>
              <div>您的邀请人:</div>
              <div><input type="text" disabled :value="formData.invitName"></div>
            </li>
            <li>
              <div>邀请人手机号:</div>
              <div><input type="text" disabled :value="formData.invitPhone"></div>
            </li>
          </ul>
          <div class="update-hints">注意：邀请人信息一旦绑定，将无法修改</div>
          <div class="memberSte-btn" @click="bindInvite">绑定邀请人</div>
        </template>
      </x-dialog>
    </div>
    <!--<div class="qupifa">-->
      <!--<div class="qupifa-left">-->
        <!--<img :src="aaasd"/>-->
        <!--<div>我的批发券:<span>{{pifaquan}}</span></div>-->
      <!--</div>-->
      <!--<div class="qupifa-right" @click="qpfgo">去批发</div>-->
    <!--</div>-->
    <comStoreFooter></comStoreFooter>
  </div>
</template>
<script>
  import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem, Alert, Confirm, XDialog, TransferDomDirective as TransferDom } from 'vux'
  import createShareImg from '../../components/createShareImg'        // 分享图片组件
  import comStoreFooter from '../../components/dayTrade/comStoreFooter'
  import html2canvas from 'html2canvas'
  import topLucky from '../../components/shopLucky/shopLuckyTop'
  export default {
    name: 'shopSellGoods',
    directives: {
      TransferDom
    },
    components: {
      Tab,
      TabItem,
      Sticky,
      Divider,
      XButton,
      Swiper,
      SwiperItem,
      Alert,
      Confirm,
      XDialog,
      TransferDom,
      createShareImg,
      topLucky,
      comStoreFooter
    },
    data () {
      return {
        show: false,
        list: [],
        myShopList: [],
        cancelId: '',
        showToast: false,
        cancelNum: '',
        formData: {
          invitCode: '',          // 邀请码
          invitName: '',          // 邀请人
          invitPhone: ''          // 邀请人手机
        },
        shareCon: {},       // 分享数据
        bsbUserInfo: {},           // 存储的登录信息
        showMemberSte: false,      // 是否是超级会员状态
        memberStep: 1,             // 绑定邀请人步数
        codeIdIsTrue: false,      // 邀请人id是否正确
        mmeberGoodsNoSalesNum: '',
        quotaPrice: '',
        maskCover: false,
        maskInfo: false,
        aaaxxx: require('../../assets/images/shopLucky01/aaaaxxxxx.png'),
        aaasd: require('../../assets/images/shopLucky01/aaasdfsfs.jpg'),
        xyd: require('../../assets/images/shopLucky01/xiaoyuandian.png'),
        pifaquan: '',  // 上个页面传过来的批发券数量
        pageId: '',
        otherShareInvitationCode: '' // 别人的分享
      }
    },
    computed: {
    },
    mounted: function () {
      this.pageId = this.$route.query.pageId
      this.otherShareInvitationCode = this.$route.query.otherShareInvitationCode || ''
      this.getSalesQuotaData()
      this.getGoodsBuyUserId()
      this.getMemberPurchaseCoupon()
    },
    methods: {
      /**
       * 点击取消售卖
       * **/
      cancelSale (v) {
        // console.log('取消售卖-----这个功能留着下个版本做')
        // this.maskCover = true
        // this.maskInfo = true
        // this.cancelId = v.goodsId
        // this.mmeberGoodsNoSalesNum = v.mmeberGoodsNoSalesNum
        // this.quotaPrice = v.quotaPrice
        // this.cancelNum = v.mmeberGoodsTotalNum
        // console.log(v)
        // this.$router.push('/hallSellManagement')
        this.$router.push({path: '/hallSellManagement', query: {goodsId: v.goodsId}})
      },
      /**
       * 点击提取商品
       * **/
      tiqu (v) {
        // console.log('提取商品-----这个功能留着下个版本做')
      },
      /**
       * 我的批发券
       */
      getMemberPurchaseCoupon () {
        this.$http.post(`${this.api.getMemberPurchaseCoupon}`, {}).then((res) => {
          this.pifaquan = res.data.data
        })
      },
      /**
       * 去批发
       */
      qpfgo () {
        this.$router.push({path: '/shopLuckyStrike', query: {pageId: 8, shareInvitationCode: this.otherShareInvitationCode}})
      },
      /**
       * 跳转到商品详情
       * **/
      goDetail (v) {
        this.$router.push({name: 'goodDetail', query: {goodsId: v.goodsId, pageType: 10}})
      },
      /**
       * 关闭弹框
       * **/
      guanbi () {
        this.maskCover = false
        this.maskInfo = false
      },
      /**
       * 点击确定售卖
       * **/
      chooseTrue () {
        this.$http.post(`${this.api.cancleGoodsSalse}`, {
          goodsId: this.cancelId,
          cancleCount: this.cancelNum
        }).then((res) => {
          if (res.data.status === '1') {
            this.getSalesQuotaData()
            this.getGoodsBuyUserId()
          }
        })
        this.show = false
      },
      /**
       * 点击取消
       * **/
      chooseFalse () {
        this.show = false
      },
      /**
       * 销售我的商品统计
       * **/
      getSalesQuotaData () {
        this.$http.post(`${this.api.getSalesQuotaData}`, {}).then((res) => {
          if (res.data.status === '1') {
            let resData = res.data.data
            this.list = resData
            // console.log(this.list)
          }
        })
      },
      /**
       * 我的商品列表
       * **/
      getGoodsBuyUserId () {
        this.$http.post(`${this.api.getGoodsBuyUserId}`, {}).then((res) => {
          if (res.data.status === '1') {
            let resData = res.data.data
            this.myShopList = resData
            // console.log(this.myShopList)
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
        this.$vux.loading.show({
          text: '图片生成中...'
        })
//      console.log(v)
        let shopId = this.$route.query.shopId ? this.$route.query.shopId : localStorage.getItem('shopId') ? localStorage.getItem('shopId') : 1
        let codeUrl = window.location.href.match(/.*mshop/gi)[0]
        codeUrl += '/goodDetail?goodsId=' + v.goodsId + '&shareInvitationCode='
        codeUrl += v.invitationCode + '&pageType=' + 9 + '&shopId=' + shopId + '&purchaseCode=' + v.purchaseCode
//        let codeUrl = 'http://120.77.210.28/mshop' + '/share/goodDetail?goodsId=' + 6942 + '&shareInvitationCode=' + v.invitationCode + '&fromType=1&shopId=' + shopId
        this.shareCon = v
        this.shareCon.codeUrl = codeUrl
        this.shareCon.alertTpye = 'licheng'
//        this.shareCon.pageType = this.tabData[this.tabIndex].pageType
//        this.shareCon.tabIndex = this.tabIndex
        if (v.mainImage.indexOf('data:image') === -1) {
          v.mainImage = v.mainImage.match(/http/gi) ? v.mainImage : this.imgUrl + v.mainImage
        }
        if (v.mainImage && v.mainImage.match(/http/gi) && v.mainImage.indexOf('data:image') === -1) {
          this.getImageBase64ByUrl(v.mainImage, (res) => {
            this.shareCon.mainImage = 'data:image/png;base64,' + res.data.data
            // console.log(this.shareCon.mainImage)
            this.createImg()
          })
        } else {
          this.createImg()
        }
      },
      /**
       * 分享
       */
      share (v) {
        var bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
        if (bsbUserInfo && bsbUserInfo.token) {
          this.getPersonalInfo((res) => {
            v.invitationCode = res.invitationCode || ''
//             if (res.bindStatus === 1) {  // 已达到成为超级会员条件，已绑定邀请人信息
//               // console.log(res, 'getPersonalInfo')
//               this.toImage(v)
//             } else {  // 已达到成为超级会员条件，未绑定邀请人信息
//               this.showMemberSte = true
//               this.memberStep = 2
//             }
            this.toImage(v)
          })
        } else {
          localStorage.setItem('REDIRECT_URL', this.$router.currentRoute.fullPath)
          this.$router.push({
            path: '/login',
            query: {redirect: this.$route.fullPath}
          })
        }
      },
      /**
       * 检测邀请码ID是否正确
       */
      checkInvCodeId (fun) {
        if (!this.formData.invitCode.match(/^[A-Z]\d{4,}$/)) {
          this.$vux.toast.text('邀请码对应用户不存在')
          return false
        }
        this.$http.post(`${this.api.getInvitationInfo}`, {
          recommendCode: this.formData.invitCode
        }).then((res) => {
          fun(res)
        })
      },
      /**
       * 获取邀请人信息
       */
      getInvitation () {
        // 输入验证码够5位是请求接口验证
        if (this.formData.invitCode.length >= 5) {
          this.checkInvCodeId((res) => {
            let resData = res.data
            if (resData.status !== this.api.ERR_OK) {
              this.$vux.toast.text(resData.msg)
              this.codeIdIsTrue = false      // 邀请码是否正确
              return false
            } else {
              this.codeIdIsTrue = true       // 邀请码是否正确
              this.formData.invitName = resData.data.beCardName
              this.formData.invitPhone = resData.data.bePhone
            }
          })
        } else {
          this.formData.invitName = ''
          this.formData.invitPhone = ''
        }
      },
      /**
       * 绑定邀请人
       */
      // bindInvite () {
      //   if (!this.formData.invitCode) {
      //     this.$vux.toast.text('请输入邀请码')
      //     return false
      //   }
      //   if (!this.codeIdIsTrue && this.formData.invitCode.length > 0) {
      //     this.$vux.toast.text('邀请码对应用户不存在')
      //     return false
      //   } else {
      //     this.$http.post(`${this.api.bandRecommendRelation}`, {
      //       invitationCode: this.formData.invitCode,
      //       recommendCode: this.formData.invitCode
      //     }).then((res) => {
      //       this.$vux.toast.text(res.data.msg)
      //       if (res.data.status !== this.api.ERR_OK) {
      //         return false
      //       }
      //       this.showMemberSte = false
      //     })
      //   }
      // },
      /**
       * 获取个人信息
       */
      getPersonalInfo (fun) {
        this.$http.post(`${this.api.personalInfo}`, {
          id: this.bsbUserInfo ? this.bsbUserInfo.userId : ''
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            return false
          }
          return fun(res.data.data)
        })
      }
    },
    created () {
    }
  }
</script>
<style scoped lang="less">
.sellGood{
  width: 7.5rem;
  height: 2.46rem;
  position: relative;
  .sellBg{
    width: 7.1rem;
    height: 2.46rem;
    margin: auto;
  }
  .sellNav{
    width: 7.1rem;
    height: 2.46rem;
    margin: 0 0.2rem;
    top: 0px;
    height: 2.46rem;
    position: absolute;
    border-radius: 0.2rem;
    box-shadow: 0 0 10px #feeceb;

    .titleText{
      padding: .2rem .2rem .2rem .2rem;
      font-size: 0.30rem;
      color: #a56341;
      font-family: 'Adobe 黑体 Std R';
    }

    ul{
      display: flex;
      padding-top: .1rem;
      li{
        width: 33.33%;
        height: 0.8rem;
        text-align: center;
        border-right: 1px solid #fff;
        color: #a56341;
        .sell_dec{
          color: #a56341;
          font-size: 0.6rem;
          position: relative;
        }
        .sell_num{
          color: #a56341;
          font-size: 0.24rem;
          position: relative;
          bottom: -0.1rem;
          font-weight: 700;
        }
      }
      li:last-child{
        border-right: 0;
      }
    }
  }
}
.sellGoodList{
  width: 7.1rem;
  height: auto;
  margin: 0 0.2rem;
  ul{
    width: 100%;
    li{
      width: 100%;
      margin-top: 0.2rem;
      border-radius: 0.2rem;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      .sellGoodList_Top{
        display: flex;
        padding: 0.29rem 0.2rem 0.18rem 0.2rem;
        font-size: 0.27rem;
        color: #a56341;
        font-weight: 600;
        border-bottom: 1px solid #fafafa;
        justify-content: space-between;
        p{
          span{

          }
        }
        b{
          color: #666;
        }
      }
      .sellGoodList_Center{
        width: 6.5rem;
        height: 2.43rem;
        display: flex;
        margin: auto;
        border-top: 1px solid #cac3c3;
        .sgl_l{
          width: 2.24rem;
          height: 2.34rem;
          display: flex;
          justify-content: center;
          align-items: center;
          img{
            width: 1.6rem;
            height: 1.6rem
          }
        }
        .sgl_r{
          flex: 1;
          height: 2.14rem;
          background: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .clamp2{
            white-space:normal;
            overflow:hidden;
            display:-webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient:vertical;
            word-break:break-all;
            font-size: 0.26rem;
            color: #666;
            margin-top: 0.2rem;
          }
          .sell_Price{
            font-size: 0.27rem;
            color: #a56341;
            font-weight: 600;
            margin-top: 0.15rem;
            /*span{*/
              /*color: #999;*/
              /*font-size: 0.17rem;*/
              /*text-decoration: line-through;*/
              /*margin-left: 0.21rem;*/
            /*}*/
          }
          .botList{
            display: flex;
            flex-direction: row;
            font-size: .22rem;
            color: white;
            margin-top: .15rem;
            div{
              display: inline-block;
              border-radius: .2rem;
              background: #a56341;
              margin-right: .2rem;
              padding: 0.06rem 0.1rem;
              span{
                font-size: .22rem;
                position: relative;
                top: 0rem;
              }
            }
          }
        }
      }
      .sellGoodList_Bottom{
        display: flex;
        height: 1.09rem;
        box-sizing: border-box;
        justify-content: space-around;
        background: #fff;
        border-bottom-left-radius: 0.2rem;
        border-bottom-right-radius: 0.2rem;
        border-top:1px solid #eef3f6 ;
        p{
          color: #999999;
          font-size: 0.23rem;
          letter-spacing: 0.03rem;
          span{
            font-size: 0.19rem;
            color: #fc4e41;
          }
        }
        .pop_btn{
          width: 2.1rem;
          height: 1.09rem;
          line-height: 1.09rem;
          text-align: center;
          font-size: 0.24rem;

          span {
            display: inline-block;
            height: .56rem;
            margin-top: .1rem;
            line-height: .56rem;

            img{
              height: .56rem;
              width: .56rem;
              position: relative;
              top: .2rem;
              margin-right: .1rem;
            }
          }
        }
      }
    }
  }
}

.qupifa{
  width: 7.5rem;
  height: 0.98rem;
  line-height: 0.98rem;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  .qupifa-left{
    width: 4.74rem;
    height: 0.98rem;
    line-height: 0.98rem;
    background: #fff;
    display: flex;
    align-items: center;
    font-size: 0.28rem;
    color: #362a2e;
    img{
      width: 0.66rem;
      height: 0.66rem;
      margin: 0 0.14rem 0 0.34rem;
    }
  }
  .qupifa-right{
    width: 2.76rem;
    height: 0.98rem;
    line-height: 0.98rem;
    background: #362a2e;
    text-align: center;
    color: #fff;
  }
}
</style>

<style lang="less">
  .memberSte11{
    padding: .36rem;
  .weui-dialog{
    padding: .36rem;
    width: 6.2rem;
    max-width: 5.54rem;
    overflow: auto;
    box-sizing: border-box;
  }
  .close-icon{
    fill: #343233;
    width: .6rem;
    height: .6rem;
    position: absolute;
    right: -.3rem;
    top: -.2rem;
  }
  .sigh-icon{
    width: .63rem;
    height: .63rem;
  }
  .memberSte-tip{
    font-size: .26rem;
    color: #231c20;
    text-align: center;
    margin: .36rem 0;
  }
  .memberSte-btn{
    display: inline-block;
    padding: 0 .35rem;
    height: .67rem;
    background: #f4676b;
    border-radius: 5px;
    color: #fff;
    text-align: center;
    line-height: .67rem;
    margin: 0 auto;
    font-size: .28rem;
  }
  .update-hints{
    font-size: .24rem;
    color: #f4676b;
    margin: .3rem 0;
  }
  ul{
    width: 4.87rem;
  li{
    height: .6rem;
    display: flex;
    border-bottom: 1px solid #eae8e9;
    align-items: center;
  div:nth-child(1){
    width: 1.8rem;
    text-align: left;
    font-size: .26rem;
    color: #313030;
    white-space: nowrap;
    margin-right: .1rem;
  }
  div:nth-child(2){
    flex:1;
  input{
    height: .6rem;
    background: none;
    font-size: .26rem;
  }
  }
  }
  }
  }
</style>

