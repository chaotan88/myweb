<template>
  <div class="main">
    <div class="goodsDetail">
        <!--列表主体-->
        <div class="listCent">
          <!--拼团图片-->
         <div class="leftImg">
          <img :src="groupChart.mainImage"/>
         </div>
          <!--拼商品标题 价格-->
          <div class="rightText">
            <div class="textTitle">
              {{groupChart.goodsName}}
            </div>
            <!--价格-->
            <div class="moneyBox">
              <!--拼团价格 销售价格 -->
              <div class="money"><span class="price">¥ {{groupChart.goodsGroupPrice}}</span> <span class="linePrice">¥ {{groupChart.goodsPrice}}</span></div>
            </div>
          </div>

        </div>
      <div class="icon">
      </div>
    </div>
    <div class="listBox">
      <div class="listTitle">
        <!--列表top左-->
        <div class="topLeft">
          <p v-show="groupChart.status == 1"><span><img src="../../assets/images/groupBooking/tiem@2x.png"> </span> 拼团中,加油喔~</p>
          <p v-show="groupChart.status == 2" class="success"><span ><img src="../../assets/images/groupBooking/success@2x.png"> </span> 拼团成功</p>
          <p v-show="groupChart.status == 3" class="error"><span><img src="../../assets/images/groupBooking/error@2x.png"> </span> 拼团失败</p>
        </div>
        <!--列表top右-->
        <div class="topRight" v-show="groupChart.timeOut && groupChart.status == 1">
          <span>剩余</span>
          <!--<span class="number">0</span> <span>天</span> <span class="number">0</span> <span>:</span>-->
          <!--<span class="number">0</span> <span>:</span> <span class="number">0</span> -->
          <span v-html="timeOutFn(groupChart.timeOut)"></span>
          <span>结束</span>
        </div>
      </div>
      <div class="list">
        <div class="item" style="margin-bottom: .6rem">
          <div class="userBot">
            团长
          </div>
          <div class="leftImg">
            <img src="../../assets/images/groupImg/tz.png"/>
          </div>
          <div class="rightText">
            <div class="textTitle">
              <div>团长</div>
              <div><p>{{groupChart.createTime |publicTime}}开团</p></div>
            </div>
            <!--价格-->
            <div class="moneyBox">
              <div >{{groupChart.currentNum > 1 ? '已': ''}}邀请<span class="price">{{(groupChart.currentNum > 1 ? groupChart.currentNum : groupChart.groupNum) - 1 }}</span>人直接参团，预计最大收益<span class="price">{{groupChart.expectedReturn}}</span>元，到账<span class="price">{{groupChart.alreadyAccounted}}</span>元 </div>
            </div>
          </div>
        </div>
        <div class="item" v-for="(item, index) in superGroupDeailList" >
          <div class="leftImg">
            <!--是否有人参加 没人-->
            <img :src="item.img"/>
          </div>
          <div class="rightText">
            <div class="textTitle" >
              <div>
                <span v-if="item.status == 0" >
                  未领取
                </span>
                <span class="success" v-if="item.status == 2">
                  已领取
                </span>
                <span class="error" v-if="item.status == 3">
                  非好友
                </span>
                <span v-if="item.status == 1">
                  待付款
                </span>
              </div>
            </div>
          </div>
          <div class="icon" v-if="((index + 1) === groupChart.groupNum) && groupChart.status ===1">
          </div>
        </div>
        <div class="item" :class="{'successBox': groupChart.status ===2, 'error': groupChart.status ===3 || groupChart.status === 1}">
          <div class="icon">
          </div>
          <div class="leftImg ">
            发货
          </div>
          <div class="rightText">
            <div class="textTitle">
              <div><span :class="{'successBox': status ===1}">免费发货</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footerBot" @click="codeBot()" v-if="groupChart.status === 1">
      <div>邀请好友参团领取奖励 </div>
    </div>
    <div class="footerBot" @click="goDetail()" v-if="groupChart.status === 2 || (groupChart.status === 3 && groupChart.resurrectionNum >= resurrectionNum)">
      <div>再次开团 </div>
    </div>
    <div class="footerBot resurrection" @click="isResurrection = true" v-if="groupChart.status === 3 && groupChart.ifResurrection">
      <div>复活拼团 </div>
    </div>
    <div class="alertBox">
      <!--是否绑定邀请人-->
      <x-dialog v-model="showBind" class="dialog-demo ta-Bind">
        <div class="alert-wrap pos-r">
          <div class="alert-cen2">
            <div class="border">
              <div class="textBox">
                <div class="imgBox">
                  <img src="../../assets/images/groupBooking/bind.png"/>
                </div>
                <div class="text">
                  <h4 class="">您尚未绑定邀请人，需绑定后 </h4>
                  <h4 class="">才能获得邀请奖励。是否绑定？</h4>
                </div>
              </div>
              <div class="botBox" style="border: 1px solid #000; color: #1a1672">
                <div class="bot" @click="goBind(2)"> 不绑定 </div>
                <div class="bot2" @click="goBind(1)"> 立即绑定 </div>
              </div>
            </div>
          </div>
        </div>
        <div class="welcome-wrap pos-a ta-c">
          <div class="welcome-close2 pos-r ta-r" @click="showBind = false">
            <x-icon type="ios-close-outline" size="30"></x-icon>
          </div>
        </div>
      </x-dialog>
      <!--生成cancas图片-->
      <create-share-group-img :shareData="shareCon" ref="imageWrapper" v-model="showToast"></create-share-group-img>

      <x-dialog v-model="isResurrection" class="dialog-demo ta-Bind">
        <div class="alert-wrap pos-r">
          <div class="alert-cen2">
            <div class="border">
              <div class="textBox">
                <div class="text">
                  <h4 class="">复活后拼团将截止到</h4>
                  <h4 class="">{{groupChart.nextTime | publicTime('-')}}</h4>
                </div>
              </div>
              <div class="botBox">
                <div class="bot" @click="isResurrection = false"> 取消 </div>
                <div class="bot2" @click="resurrectionGroupFn"> 确认复活 </div>
              </div>
            </div>
          </div>
        </div>
        <div class="welcome-wrap pos-a ta-c">
          <div class="welcome-close2 pos-r ta-r" @click="isResurrection = false">
            <x-icon type="ios-close-outline" size="30"></x-icon>
          </div>
        </div>
      </x-dialog>
    </div>
    <!--排序-->
  </div>
</template>
<script>
  import groupFooter from '../../components/groupBooking/groupFooter'
  import {XDialog} from 'vux'
  import createShareGroupImg from '../../components/groupBooking/createShareGroupImg'
  import html2canvas from 'html2canvas'
  export default {
    name: 'groupTrta',
    components: {
      groupFooter,
      XDialog,
      createShareGroupImg
    },
    data () {
      return {
        resurrectionNum: 3, // 可以复活次数
        showBind: false, // 是否绑定邀请人
        showToast: false, // 微信分享
        shareCon: {}, // 分享商品详情
        isResurrection: false, // 复活拼团弹框
        status: 2, // 状态
        superGroupId: '',  // 拼团id
        orderNo: '',       // 订单id
        superGroupDeailList: [], // 拼团中列表
        groupChart: {},           // 拼团详情
        personalData: {},         // 个人信息
        bsbUserInfo: {},          // 本地个人信息
        timer: '',                // 定时器
        timeC: 0,                  // 本地时间系统时间差
        tz: require('../../assets/images/groupImg/tz.png'), // 团长
        tzmx: require('../../assets/images/groupImg/tzmx.png'), // 团长名下
        fmx: require('../../assets/images/groupImg/fmx.png'), // 非团长名下
        dfk: require('../../assets/images/groupImg/dfk.png'), // 待付款
        deft: require('../../assets/images/groupImg/deflt.png') // 默认加号
      }
    },
    mounted: function () {
      this.getSuperGroupDetail()
      this.getPersonalInfo()
    },
    methods: {
      /**
       * 复活拼团
       */
      resurrectionGroupFn () {
        this.$http.get(`${this.api.resurrectionGroup}`, {
          params: {
            superGroupId: this.groupChart.superGroupId
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            this.isResurrection = false
            this.getSuperGroupDetail()
          }
        })
      },
      /**
       * 邀请好友
       */
      goDetail () {
        this.$router.push({path: '/goodDetail', query: {goodsId: this.groupChart.goodsId, pageType: 12}})
      },
      /**
       * 绑定邀请人
       */
      codeBot () {
        if (!this.personalData.beInvitationCode) {
          this.showBind = true
        } else {
          this.toImage(this.groupChart)
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
//        console.log(v)
        this.$vux.loading.show({
          text: '图片生成中...'
        })
        let shopId = this.$route.query.shopId ? this.$route.query.shopId : localStorage.getItem('shopId') ? localStorage.getItem('shopId') : 1
        let codeUrl = window.location.href.match(/.*mshop/gi)[0] + '/groupAdd?superGroupId=' + v.superGroupId + '&fromType=1&shareInvitationCode=' + this.personalData.invitationCode + '&shopId=' + shopId
        this.shareCon = v
        // console.log(this.shareCon)
        this.shareCon.codeUrl = codeUrl
        this.shareCon.alertTpye = 'group'
        if (v.mainImage && v.mainImage.match(/http/gi) && v.mainImage.indexOf('data:image') === -1) {
          this.getImageBase64ByUrl(v.mainImage, (res) => {
            this.shareCon.mainImage = 'data:image/png;base64,' + res.data.data
            this.createImg()
          })
        } else {
          this.createImg()
        }
      },
      /**
       * nav切换
       */
      getDate (v) {
      },
      /**
       * 绑定邀请人
       */
      goBind (v) {
//        console.log(v)
        if (v === 1) {
          this.$router.push({name: 'bindInviter'})
        }
        if (v === 2) {
          this.showBind = false
          this.toImage(this.groupChart)
        }
      },
      /**
       * 拼团详情 '/src/assets/js/getSuperGroupDetail.json'
       */
      getSuperGroupDetail () {
        // 默认superGroupId
        var parm = this.superGroupId ? {superGroupId: this.superGroupId} : {orderNo: this.orderNo}
        this.$http.get(`${this.api.getSuperGroupDetail}`, {
          params: parm
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
//            服务器---本地时间差
            this.timeC = resData.data.systemTime - new Date().getTime()
//            resData.data.endTime = 1553738984000
            let nextTime = resData.data.systemTime + (resData.data.groupTime || 0) * 60 * 60 * 1000
            let ifResurrection = (resData.data.ifResurrection && resData.data.resurrectionNum < this.resurrectionNum) ? !!true : !!false
            let data = {
              superGroupId: resData.data.superGroupId,    // 团Id
              goodsId: resData.data.goodsId,                // 商品Id
              mainImage: resData.data.mainImage,            // 商品主图
              goodsName: resData.data.goodsName,            // 商品名称
              goodsPrice: resData.data.goodsPrice,          // 销售价
              goodsGroupPrice: resData.data.goodsGroupPrice, // 拼团价
              systemTime: resData.data.systemTime,          // 系统时间
              endTime: resData.data.endTime,                // 结束时间
              createTime: resData.data.createTime,          // 开团时间
              groupNum: resData.data.groupNum,              // 开团人数
              currentNum: resData.data.currentNum,          // 当前人数
              expectedReturn: resData.data.expectedReturn,   // 预计收益
              goodsNetProfit: resData.data.goodsNetProfit,   // 预计收益单人
              alreadyAccounted: resData.data.alreadyAccounted,  // 到账收益
              status: resData.data.status,                      // 拼团状态（1：拼团中、2：拼团成功、3：拼团失败）
              groupDisseminate: resData.data.groupDisseminate,  // 分享宣传文案/营销短语
              timeOut: (resData.data.endTime - resData.data.systemTime) > 0 ? (resData.data.endTime - resData.data.systemTime) : 0,
              ifResurrection: ifResurrection,     // 是否可以复活
              resurrectionNum: resData.data.resurrectionNum, // 剩余复活次数
              nextTime: nextTime                                // 复活时间
            }
            this.groupChart = data
//            console.log(this.groupChart)
            let list = []
            let lenght = resData.data.groupNum - 1
            for (let i = 0; i < lenght; i++) {
              let itm = {
                img: !resData.data.superGroupDeailList[i] ? this.deft : (resData.data.superGroupDeailList[i].ifPay === 0) ? this.dfk : (resData.data.superGroupDeailList[i].ifAccounted === 1) ? this.tzmx : this.fmx
              }
              if (!resData.data.superGroupDeailList[i]) {
                itm = {img: this.deft, status: 0}
              } else if (resData.data.superGroupDeailList[i].ifPay === 0) {
                itm = {img: this.dfk, status: 1}
              } else if (resData.data.superGroupDeailList[i].ifAccounted === 1) {
                itm = {img: this.tzmx, status: 2}
              } else if (resData.data.superGroupDeailList[i].ifPay === 1) {
                itm = {img: this.fmx, status: 3}
              }
              list.push(itm)
            }
            this.superGroupDeailList = list
            // 统一刷新定时器
            this.timeOutFnRefresh()
          }
        })
      },
      /**
       * 获取个人信息
       */
      getPersonalInfo () {
        this.$http.post(`${this.api.personalInfo}`, {
          id: this.bsbUserInfo ? this.bsbUserInfo.userId : ''
        }).then((res) => {
          // console.log(res)
          this.personalData = res.data.data
          if (res.data.status !== this.api.ERR_OK || !res) {
            return false
          }
        })
      },
      /**
       * 倒计时
       */
      timeOutFn (time) {
        if (time >= 0) {
        } else {
          return ''
        }
        if (time === 0) {
          return '00小时 00分 00秒'
        }
        var D = parseInt(time / 86400000)                                // 天
        var H = parseInt((time % 86400000) / 3600000)                   // 小时
        var T = parseInt(((time % 86400000) % 3600000) / 60000)           // 小时
        var S = parseInt((((time % 86400000) % 3600000) % 60000) / 1000)  // 秒
        if (D < 10 && D > 0) {
          D = '0' + D
        }
        if (H < 10) {
          H = '0' + H
        }
        if (T < 10) {
          T = '0' + T
        }
        if (S < 10) {
          S = '0' + S
        }
        var str = '<span class="count-b">' + H + '</span>' + '<span class="count-a">' + ':' + '</span>' + '<span class="count-b">' + T + '</span>' + '<span class="count-a">' + ':' + '</span>' + '<span class="count-b">' + S + '</span>' + '<span class="count-a">' + '' + '</span>'
        if (D > 0) {
          str = '<span class="count-b">' + D + '</span>' + '<span class="count-a">' + '天' + '</span>' + str
        }
        return str
      },
      /****
       * 定时刷新列表定时器
       * ****/
      timeOutFnRefresh () {
        // console.log('执行')
        if (this.timer) {
          return false
        }
        this.timer = setInterval(() => {
          let severcTime = this.timeC + new Date().getTime()
          if (this.groupChart.timeOut > 0) {
            var time = this.groupChart.endTime - severcTime
            if (time <= 0) {
              this.groupChart.timeOut = 0
              // 刷新接口
              this.getSuperGroupDetail()
            } else {
              this.groupChart.timeOut = time
            }
          }
        }, 1000)
      }
    },
    destroyed () {
    },
    created () {
      this.superGroupId = this.$route.query.superGroupId
      this.orderNo = this.$route.query.orderNo
      // 提取本地个人信息
      let bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo') || '{}')
      if (bsbUserInfo && bsbUserInfo.token) {
        this.bsbUserInfo = bsbUserInfo
      } else {
        console.log('未登录')
      }
    },
    beforeDestroy () {
      // 清除定时器
      clearInterval(this.timer)
    }
  }
</script>
<style scoped lang=less>
  .main{
    min-height: 100vh;
    background: #f1f2f5;
  }
  /*商品详情*/
  .goodsDetail{
    margin: auto;
    width: 100%;
    /*列表主体*/
    .listCent{
      background: white;
      border-top: 1px solid #ebebeb;
      box-sizing: border-box;
      padding:.2rem .4rem;
      height: 2.1rem;
      display: flex;
      flex-direction: row;
      /*<!--拼团图片-->*/
      .leftImg{
        width: 1.59rem;
        height: 1.59rem;
        background: #e1e1e1;
        margin-right: .2rem;
        img{
          width: 1.59rem;
        }
      }

      .rightText{
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .textTitle{
          max-width: 4.78rem;
          max-height: .7rem;
          overflow: hidden;
          font-size: .28rem;
        }
        .moneyBox{
          width: 100%;
          display: flex;
          flex-direction: row;
          height: .6rem;
          font-size: .24rem;
          color: #999;
          .price{
            font-size: .28rem;
            color: #F82828;
            line-height: .39rem;
          }
          .linePrice{
            font-size: .24rem;
            color: #999999;
            line-height: .39rem;
            text-decoration: line-through;
          }
          span.money{
            color: #F82828;
          }
        }
      }
    }

  }
  .icon{
    width:0;
    height:0;
    border-width:.3rem .3rem 0;
    border-style:solid;
    border-color: white transparent transparent;/*灰 透明 透明 */
    margin:auto;
  }
  /*列表*/
  .listBox{
    width: 7.04rem;
    margin: auto;
    background: white;
    border-radius: 4px;
    box-sizing: border-box;
    padding: .2rem;
    margin-top: .2rem;
    margin-bottom: .4rem;
    /*列表top*/
    .listTitle{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: .24rem;
      height: .44rem;
      line-height: .44rem;
      border-bottom: solid 1px #BFBFBF;
      padding-bottom: .1rem;
      .topRight{
        flex: 5;
        color: #f82828;
        text-align: right;
        .number{
          display: inline-block;
          width: .3rem;
          height: .3rem;
          border: 1px solid #f82828;
          line-height: .3rem;
          border-radius: 4px;
          text-align: center;
        }
      }
      .topLeft{
        flex: 4;
        text-align: left;
        span{
          color: #FF8B03;
        }
        p{
          color: #FF8B03;
        }
        p.success{
          color: #60C940;
        }
        p.error{
          color: #f82828;
        }
        img{
          width: .25rem;
          height: .25rem;
          position: relative;
          top: .03rem;
        }
      }
    }

    .list{
      width: 6.1rem;
      margin-left: .6rem;
      box-sizing:border-box;
      margin-top: .2rem;
      padding-left: .6rem;
      border-left: 2px #e1e1e1 dashed;
      font-size: .28rem;
      .item{
        position: relative;
        margin-bottom: .45rem;
        height: .8rem;

        .userBot{
          color: white;
          background: #F82828;
          width: 1rem;
          height: .38rem;
          position: absolute;
          bottom: -.2rem;
          text-align: center;
          left: -1.1rem;
          border-radius: .2rem;
          line-height: .38rem;
          z-index: 1;
          font-size: .20rem;
        }
        .icon{
          width:0;
          height:0;
          border-width:.1rem .1rem 0;
          border-style:solid;
          border-color: #e1e1e1 transparent transparent;/*灰 透明 透明 */
          margin:auto;
          position: absolute;
          top: -.1rem;
          left: -0.71rem;
        }
      }

      .successBox{
        .leftImg{
          background: #60C940;
          text-align: center;
          line-height: .84rem;
          color: white;
          font-size: .20rem;
        }
      }
      .error{
        .leftImg{
          background: white;
          text-align: center;
          line-height: .84rem;
          color: #999;
          font-size: .20rem;
          border-radius: 50%;
          border: 2px #CCCCCC dashed;
          box-sizing: border-box;
        }
      }
      /*<!--拼团图片-->*/
      .leftImg{
        width: .84rem;
        height: .84rem;
        margin-right: .2rem;
        position: absolute;
        top: .0rem;
        background: white;
        left: -1.04rem;
        border-radius: 50%;
        img{
          width: .84rem;
        }
      }
      .rightText{
        width: 5.3rem;
        color: #03111d;
        padding-top: .3rem;
        .textTitle{
          display:flex;
          flex-direction: row;
          justify-content: space-between;
          span{
            color: #999;
            margin-left: .2rem;
          }
          .success{
            color: #60C940;
          }
          .error{
            color: #F82828;
          }
          p{
            color: #999;
          }
        }
        .money{
          font-size: .2rem;
          color: #999;
        }
        .moneyBox{
          width: 100%;
          display: flex;
          flex-direction: row;
          height: .6rem;
          font-size: .22rem;
          color: #999;
          .price{
            font-size: .22rem;
            color: #F82828;
            line-height: .39rem;
          }
          span.money{
            color: #F82828;
          }
        }
      }
    }
  }
  .footerBot{
    width: 100%;
    position: fixed;
    height: .68rem;
    left: 50%;
    margin-left: -50%;
    background: #F1F2F5;
    bottom: 0px;
    color: white;
    text-align: center;
    font-size: .28rem;
    line-height: .68rem;
    padding-top: .2rem;
    div{
      width: 5.55rem;
      background: #F82828;
      border-radius: .5rem;
      margin: auto;
    }
  }

  .resurrection{
    div{
      background: #FF8B03
    }
  }
  .dialog-demo{

    .alert-cen2{
      padding: .4rem .2rem;
      font-size: .28rem;

      .textBox{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;

        .imgBox{
          width: .75rem;
          height: .75rem;
          margin-right: .2rem;
          img{
            width: .75rem;
            height: .75rem;
          }
        }

        .text{
          font-size: .28rem;
          color: #333333;
          text-align: left;
        }
      }
    }
    .botBox{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: .4rem;
      .bot{
        width: 1.72rem;
        height: .54rem;
        line-height: .54rem;
        color: #F82828;
        background: #fff;
        margin-right: .9rem;
        box-sizing: border-box;
        border: 1px solid #F82828;
        border-radius: 4px;
      }
      .bot2{
        width: 1.72rem;
        height: .54rem;
        line-height: .54rem;
        color: #fff;
        background: #F82828;
        border-radius: 4px;
      }
    }
  }
</style>

<style lang="less">
  .weui-dialog {
    overflow: visible;
    .welcome-wrap{
      width: 100%;
      left: 0;
      top: -.9rem;
      z-index: 667;
    }
    .welcome-close2{
      position: absolute;
      top: 0rem;
      z-index: 669;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .vux-x-icon{
        fill: #fff;
        width: .6rem;
        height: .6rem;
        margin-right: .2rem;
        margin-top: .2rem;
      }
    }
  }
  .topRight{
    .count-b{
      background: #F82828;
      color: white;
      padding: 2px;
      border-radius: 4px;
      margin-left: 3px;
      margin-right: 3px;
    }
  }
</style>
