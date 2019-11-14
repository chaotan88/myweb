<template>
  <div class="sharePurchase-box">
    <!-- 分享内容 -->
    <create-share-img :shareData="shareCon" ref="imageWrapper" v-model="showToast" v-if="remoedList.length > 0"></create-share-img>    
    <!-- 内容 -->
    <div class="sharePurchase-wrap">
      <!-- ban背景 -->
      <div class="share-bg">
        <img :src="shareConfigData.themeImage" v-if="shareConfigData.themeImage">
        <img src="../../assets/images/action/share-bg.png" v-if="shareConfigData && !shareConfigData.themeImage">
      </div>
      <template v-if="!noDataSte && remoedList.length > 0">
        <!-- step -->
        <div class="sharePurchase-step">
          <ul>
            <li>
              <p>购买商品成为会员</p>
            </li>
            <li>
              <p>分享商品</p>
            </li>
            <li>
              <p>购芯豆与返利</p>
            </li>
          </ul>
        </div>
        <!-- 分享说明 -->
        <div class="share-explain">
          <img src="../../assets/images/action/share-explain.png">
        </div>
      <!-- 列表样式一 -->
        <div class="list-type-one">
          <div class="list-title">推荐商品</div>
          <ul>
            <li v-for="(item, index) in remoedList" v-if="index < 3" @click="goDetail(item)">
              <div class="list-box" :class=" (index + 1)%2 == 0 ? 'evenNum' : ''">
                <div class="list-img">
                  <img :src="item.activityImage | filterImgUrl">
                </div>
                <div class="list-con">
                  <div class="con-remark">{{item.activityRemark}}</div>
                  <div class="con-title">{{item.goodsName}}</div>
                  <div class="con-tag">
                    <template v-if="pageType !== 'share'">
                      <!-- 默认显示 -->
                      <p v-if="item.beInviterIfGetGoldPoints">
                        <span>送</span>
                        <span>{{item.beInviterGetGoldPoints}}芯豆</span>
                      </p>
                      <p>
                        <span>获</span>
                        <span>{{item.canGetPoint}}消费积分</span>
                      </p>
                    </template>
                    <!-- 满足分享条件显示 -->
                    <template v-else>
                      <p v-if="item.oneIfGetCashPoints">
                        <span>赚</span>
                        <span>{{item.oneGetCashPoints}}通用积分</span>
                      </p>
                      <p v-if="item.oneIfGetBonusPoints">
                        <span>获</span>
                        <span>{{item.oneGetBonusPoints}}消费积分</span>
                      </p>
                      <p v-if="item.oneIfGetBalance">
                        <span>赠</span>
                        <span>{{item.oneGetBalance}}余额</span>
                      </p>
                    </template>
                  </div>
                  <div class="con-price">
                    <template v-if="item.whetherShare">
                      <span><i>¥</i>{{item.goodsSharePrice | moneyFilter}}/</span>
                      <span><i>¥</i>{{item.goodsPrice | moneyFilter}}</span>
                    </template>
                    <template v-else>
                      <span><i>¥</i>{{item.goodsPrice | moneyFilter}}</span>
                    </template>
                  </div>
                  <div class="con-btn"  @click.stop="btnTap($event, item)">
                    <div>
                      <img src="../../assets/images/action/coin-ico.png">
                      <!-- 默认显示 -->
                      <span v-if="pageType !== 'share'">立即购买</span>
                      <!-- 满足分享条件显示 -->
                      <span v-else>分享赚</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 列表样式二 -->
        <div class="list-type-two">
          <div class="list-title" v-if="remoedList.length > 3">推荐商品</div>
          <ul>
            <li v-for="(item, index) in remoedList" v-if="index >= 3" @click="goDetail(item)">
              <div class="list-img">
                <img :src="item.activityImage | filterImgUrl">
              </div>
              <div class="list-con">
                <div class="con-title">{{item.goodsName}}</div>
                <!-- 默认显示 -->
                <div class="con-tag" v-if="pageType !== 'share'">
                  <span v-if="item.beInviterIfGetGoldPoints"><i>送</i>.{{item.beInviterGetGoldPoints}}芯豆</span>
                  <span><i>获</i>.{{item.canGetPoint}}消费积分</span>
                </div>
                <!-- 满足分享条件显示 -->
                <div class="con-tag" v-else>
                  <span v-if="item.oneIfGetCashPoints"><i>赚</i>.{{item.oneGetCashPoints}}通用积分</span>
                  <span v-if="item.oneIfGetBonusPoints"><i>获</i>.{{item.oneGetBonusPoints}}消费积分</span>
                  <span v-if="item.oneIfGetBalance"><i>赠</i>.{{item.oneGetBalance}}余额</span>
                </div>
                <div class="con-bt">
                  <template v-if="item.whetherShare">
                    <p>
                      <span>¥{{item.goodsSharePrice | moneyFilter}}</span>
                      <span>¥{{item.goodsPrice | moneyFilter}}</span>
                    </p>
                  </template>
                   <template v-else>
                    <p>
                      <span>¥{{item.goodsPrice | moneyFilter}}</span>
                    </p>
                  </template>
                  <p @click.stop="btnTap($event, item)">
                    <!-- 默认显示 -->
                    <img src="../../assets/images/action/share-buy.png" v-if="pageType !== 'share'">
                    <!-- 满足分享条件显示 -->
                    <img src="../../assets/images/action/share-btn.png" v-else>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 分享说明按钮 -->
        <div class="share-ins-btn" @click="showIns = true">
          <span>会员福利</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gantanhao"></use>
          </svg>
        </div>
        <!-- 分享说明内容 -->
        <div class="share-ins-con">
          <x-dialog v-model="showIns" :hide-on-blur="true">
            <ul>
              <li>
                <!-- <div>
                  <p></p>
                  <p>一次邀请  永久收益</p>
                </div> -->
                <div>{{shareConfigData.themePresent}}</div>
              </li>
            </ul>
          </x-dialog>
        </div>
        <!-- 底部立即分享按钮 -->
        <div @click="isMemberJudgment" v-if="pageType !== 'share'">
          <div class="after-share-hei"></div>
          <div class="after-share-btn">
            <div>
              <img src="../../assets/images/action/an-rown.png">
            </div>
            <div>邀请赚</div>
          </div>
        </div>
        <!-- 未成为超级会员弹窗及绑定邀请人信息弹窗 -->
        <div class="memberSte">
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
              <div class="update-hints">您已经达到升级要求,请绑定邀请人信息</div>
              <ul>
                <li>
                  <div>邀请人ID号:</div>
                  <div><input type="text" v-model="formData.invitCode" v-on:input ="getInvitation" maxlength="5"></div>
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
              <div class="memberSte-btn" @click="bindInvite">绑定邀请人升级</div>
            </template>
          </x-dialog>
        </div>
      </template>
      <!-- 暂无数据 -->
      <no-data v-if="noDataSte"></no-data>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import { Swiper, SwiperItem, XDialog } from 'vux'           // 轮播图
import createShareImg from '../../components/createShareImg'        // 分享图片组件
import noData from '../../components/noData'                        // 暂无数据
export default {
  components: {
    Swiper,
    SwiperItem,
    XDialog,
    noData,
    createShareImg
  },
  data () {
    return {
      pageType: '',              // 页面类型
      bsbUserInfo: {},           // 存储的登录信息
      showMemberSte: false,      // 是否是超级会员状态
      memberStep: 1,             // 绑定邀请人步数
      noDataSte: false,
      shareCon: {},             // 点击分享返回的内容
      remoedList: [],           // 推荐列表
      shareConfigData: '',      // 分享配置信息
      listSlideIndex: 0,
      codeIdIsTrue: false,      // 邀请人id是否正确
      formData: {
        invitCode: '',          // 邀请码
        invitName: '',          // 邀请人
        invitPhone: ''          // 邀请人手机
      },
      dataURL: '',
      showToast: false,
      showIns: false,
      codeUrl: ''
    }
  },
  mounted: function () {
    this.bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
    if (localStorage.getItem('sharePageType') && this.$route.query.type) {
      this.pageType = this.$route.query.type           // 获取type字段'share'是可分享页面空是购买页面
    } else {
      this.pageType = ''
    }
    this.getShareMes()                               // 分享配置信息
    this.getRemoedList()                             // 推荐列表
  },
  methods: {
    /**
     * 列表按钮点击
    */
    btnTap (e, v) {
      e.preventDefault()
      if (this.pageType === 'share') {
        this.toImage(v)      // 生成图片
      } else {
        this.goDetail(v)
      }
    },
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
    },
    /**
     * 获取分享页面配置信息
    */
    getShareMes () {
      this.$http.get(this.api.getShareMes, {}).then((res) => {
        let resData = res.data
        // console.log(resData)
        if (resData.status !== this.api.ERR_OK || !res) return false
        this.shareConfigData = resData.data
        this.setTitle(resData.data.themeName)
      })
    },
    /**
     * 获取数据列表
    */
    getRemoedList () {
      this.$vux.loading.show({
        text: '数据加载中'
      })
      this.$http.post(this.api.getShareThemeGoodsPage, {
        start: 1,
        pageSize: 10000
      }).then((res) => {
        let resData = res.data
        if (resData.status !== this.api.ERR_OK || !res) return false
        this.remoedList = resData.data.list
        this.noDataSte = resData.data.list.length > 0 ? !!false : !!true
      }).finally(() => {
        this.$vux.loading.hide()
      })
    },
    /**
     * 底部分享按钮点击
     */
    isMemberJudgment () {
      var bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
      if (bsbUserInfo && bsbUserInfo.token) {
        this.getPersonalInfo((res) => {
          // 没有达到成为超级会员条件
          if (this.shareConfigData.requireDisRuleIds.indexOf(res.disRuleId) === -1) {
            this.showMemberSte = true
            this.memberStep = 1
          } else {
            if (res.bindStatus === 1) {  // 已达到成为超级会员条件，已绑定邀请人信息
              localStorage.setItem('sharePageType', 'share')
              this.$router.push({path: '/sharePurchase', query: {type: 'share'}})
            } else {  // 已达到成为超级会员条件，未绑定邀请人信息
              this.showMemberSte = true
              this.memberStep = 2
            }
          }
        })
      } else {
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
    bindInvite () {
      if (!this.formData.invitCode) {
        this.$vux.toast.text('请输入邀请码')
        return false
      }
      if (!this.codeIdIsTrue && this.formData.invitCode.length > 0) {
        this.$vux.toast.text('邀请码对应用户不存在')
        return false
      } else {
        this.$http.post(`${this.api.bandRecommendRelation}`, {
          invitationCode: this.formData.invitCode,
          recommendCode: this.formData.invitCode
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.status !== this.api.ERR_OK) {
            return false
          }
          this.showMemberSte = false
        })
      }
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
      let shopId = this.$route.query.shopId ? this.$route.query.shopId : localStorage.getItem('shopId') ? localStorage.getItem('shopId') : 1
      let codeUrl = window.location.href.match(/.*mshop/gi)[0] + '/share/goodDetail?goodsId=' + v.goodsId + '&shareInvitationCode=' + v.invitationCode + '&fromType=1&shopId=' + shopId
      this.shareCon = v
      this.shareCon.codeUrl = codeUrl
      if (v.activityImage && v.activityImage.match(/http/gi) && v.activityImage.indexOf('data:image') === -1) {
        this.getImageBase64ByUrl(v.activityImage, (res) => {
          this.shareCon.activityImage = 'data:image/png;base64,' + res.data.data
          this.createImg()
        })
      } else {
        this.createImg()
      }
    },
    /**
     * 跳转详情页
    */
    goDetail (item) {
      var fromType = this.pageType !== 'share' ? 1 : 2         // fromType 1 购买页面 2 分享页面
      let shareInvitationCode = this.$route.query.shareInvitationCode
      if (shareInvitationCode) {
        this.$router.push({path: '/share/goodDetail', query: {goodsId: item.goodsId, shareInvitationCode: shareInvitationCode, fromType: fromType}})
      } else {
        this.$router.push({path: '/share/goodDetail', query: {goodsId: item.goodsId, fromType: fromType}})
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    localStorage.removeItem('PAGE_INV_CODE')      // 清除保存的邀请码-避免正常进入带有
    next()
  }
}
</script>
<style lang=less>
  .sharePurchase-box{
    height: calc(100vh);
    background-color: #3a2a2b;
    overflow: hidden;
    overflow-y: scroll;
    position: relative;
    z-index: 3000;
  }
  .sharePurchase-wrap{
    position: relative;
    background-color: #3a2a2b;
    z-index: 100;
    .share-bg{
      min-height: 6rem;
      img{
        width: 100%;
        min-height: 6rem;
        display: block;
      }
    }
    /* step */
    .sharePurchase-step{
      margin-top: .46rem;
      margin-bottom: .3rem;
      padding: 0 .2rem;
      &::before{
        content: '';
        display: block;
        width: 100%;
        height: 3px;
        background: #efd0c9;
      }
      ul{
        display: flex;
        margin-top: -.1rem;
        li{
          flex: 1;
          text-align: center;
          font-size: .18rem;
          color: #f8eeec;
          &::before{
            content: '';
            display: block;
            width: .15rem;
            height: .15rem;
            background: #fff;
            border-radius: 50%;
            margin: 0 auto;
            margin-bottom: .15rem;
          }
        }
      }
    }
    /* 分享说明 */
    .share-explain{
      padding: 0 .2rem;
      img{
        width: 100%;
        display: block;
      }
    }
    /* 列表样式一 */
    .list-type-one{
      padding: 0 .2rem;
      .list-title{
        font-size: .28rem;
        color: #3d292b;
        margin: .27rem 0;
        text-align: center;
        height: .56rem;
        line-height: .56rem;
        background: linear-gradient(90deg, #fae5d1, #ddad83);
        border-radius: 6px;
        display: -webkit-box;
        display: -moz-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
      ul{
        li{
          background: url('../../assets/images/action/list-bg.png') no-repeat;  
          background-size: 100% 100%;
          padding: .13rem;        
          margin-bottom: .23rem;
          background-color: #fff;
          .list-box{
            background: linear-gradient(#fefaf8, #fad9ce);
            -webkit-background: linear-gradient(#fefaf8, #fad9ce);
            display: flex;
            display: -webkit-flex;
            padding: .13rem .15rem;
            .list-img{
              width: 2.91rem;
              height: 3.86rem;
              margin-right: .15rem;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .list-con{
              flex: 1;
              color: #fff;
              margin-top: .15rem;
              .con-remark{
                font-size: .24rem;
                color: #a06d54;
                display: -webkit-box;
                display: -moz-box;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
              }
              .con-title{
                font-size: .3rem;
                color: #a86f63;
                display: -webkit-box;
                display: -moz-box;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;

              }
              .con-tag{
                margin: .28rem 0;
                p{
                  display: flex;
                  margin-bottom: .1rem;
                  span{
                    &:nth-child(1){
                      width: .29rem;
                      height: .29rem;
                      text-align: center;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background: #d41042;
                      border-radius: 50%;
                      color: #fff;
                      font-size: .18rem;
                      margin-right: .04rem;
                    }
                    &:nth-child(2){
                      font-size: .22rem;
                      color: #936048;                    
                    }
                  }
                }
              }
              .con-price{
                flex:1;
                padding-left: .08rem;
                margin-bottom: .18rem;
                span:nth-child(1){
                  font-size: .36rem;
                  color: #030303;
                  i{
                    font-size: .24rem;
                  }
                }
                span:nth-child(2){
                  font-size: .2rem;
                  text-decoration: line-through;
                  color: #7f7f7f;
                  i{
                    font-size: .14rem;
                  }                  
                }
              }
              .con-btn{
                width: 1.7rem;
                height: .56rem;
                display: flex;
                background: #fff;
                div{
                  display: flex;
                  flex: 1;
                  height: .56rem;
                  background: #d41148;  
                  color: #fff;  
                  align-items: center;
                  justify-content: center;
                  font-size: .28rem;
                  img{
                    width: .34rem;
                    height: .34rem;
                    margin-right: .1rem;
                  }            
                }
              }
            }
            &.evenNum{
              -webkit-flex-flow: row-reverse wrap;
              flex-flow: row-reverse wrap;
              .list-img{
                margin-right: 0;
              }
              .list-con{
                margin-right:.105rem; 
              }
            }
          }
        }
      }
    }
    /* 列表样式二 */
    .list-type-two{
      height: auto;
      overflow: hidden;
      padding: 0 .2rem;
      .list-title{
        font-size: .28rem;
        color: #3d292b;
        margin: .27rem 0;
        text-align: center;
        height: .56rem;
        line-height: .56rem;
        background: linear-gradient(90deg, #fae5d1, #ddad83);
        border-radius: 6px;
      }
      ul{
        li{
          height: 6rem;
          background: #fff;
          float: left;
          width: 3.52rem;
          margin-bottom: .06rem;
          margin-right: .06rem;
          padding-bottom: .2rem;
          position: relative;
          &:nth-child(2n){
            margin-right: 0;
          }
          .list-img{
            width: 100%;
            height: 3.49rem;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .list-con{
            padding: 0 .2rem;
            .con-title{
              font-size: .26rem;
              color: #3d292b;
              display: -webkit-box;
              display: -moz-box;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              margin: .25rem 0;
            }
            .con-tag{
              height: auto;
              overflow: hidden;
              position: absolute;
              top: 4.6rem;
              span{
                display: block;
                float: left;
                font-size: .14rem;
                color: #eb1449;
                background: #ffe4ea;
                margin-right: .09rem;
                margin-bottom: .09rem;
                padding: 1px 3px;
                border-radius: 3px;
                i{
                  font-size: .18rem;
                }
              }
            }
            .con-bt{
              display: flex;
              margin-top: .15rem;
              position: absolute;
              bottom: .26rem;
              left: .2rem;
              right: .2rem;
              p:nth-child(1){
                flex:1;
                span:nth-child(1){
                  font-size: .3rem;
                  color: #e12650;
                  margin-right: .1rem;
                }
                span:nth-child(2){
                  font-size: .24rem;
                  color: #9e9e9e;   
                  text-decoration: line-through;             
                }
              }
              p:nth-child(2){
                img{
                  width: .45rem;
                  height: .36rem;
                }              
              }
            }
          }
        }
      }
    }
    /* 分享说明按钮 */
    .share-ins-btn{
      width: .53rem;
      height: 1.98rem;
      background: #362932;
      position: fixed;
      right: 0;
      top: 30%;
      z-index: 30;
      text-align: center;
      color: #f9e2c0;
      font-size: .28rem;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      span{
        margin-top: .1rem;
        display: inline-block;
        line-height: .35rem;
      }
      svg{
        width: .3rem;
        height: .3rem;
      }
    }
    /* 分享说明内容 */
    .share-ins-con{
      .weui-dialog{
        max-width: 7.5rem;
        width: 100%;
        box-sizing: border-box; 
        background: linear-gradient(#fefaf8, #fad9ce);
        border-radius: 0px;
        padding: .2rem .25rem;
        box-sizing: border-box;
        text-align: left;
        ul{
          margin-top: .4rem;
          max-height: 4rem;
          overflow: hidden;
          overflow-y: scroll;
          li{
            div:nth-child(1){
              color: #845b45;
              font-size: .32rem;
              display: flex;
              align-items: center;
              p:nth-child(1){
                width: .1rem;
                height: .1rem;
                background: #da3a46;
                width: .38rem;
                height: .378rem;
                background: #fbe3c1;
                border-radius: 50%;
                margin-right: .16rem;
                position: relative;
                &::before{
                  content: '';
                  display: block;
                  width: .1rem;
                  height: .1rem;
                  background: #da3a46;
                  position: absolute;
                  left: 0;
                  right: 0;
                  top:0;
                  bottom: 0;
                  margin: auto;
                }
              }
            }
          }
        }
      }
    }
    /* 分享后页面显示按钮 */
    .after-share-hei{
      height: .98rem;
    }
    .after-share-btn{
      width: 7.5rem;
      height: .98rem;
      line-height: .98rem;
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      div:nth-child(1){
        width: 1rem;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: .57rem;
          height: .57rem;
          display: block;
        }
      }
      div:nth-child(2){
        background: #d53b53;
        flex: 1;
        text-align: center; 
        color: #fff;       
      }
    }
    /* 分享后-未成为超级会员弹窗及绑定邀请人弹窗 */
    .memberSte{
      padding: .36rem;
      .weui-dialog{
        padding: .36rem;
        width: 6.2rem;
        max-width: 5.54rem;
        overflow: unset;
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
  }
</style>
