<template>
  <section class="turntable-wap">
    <div class="min">
      <img class="back" src="../../assets/images/turntabel/back1.png"/>
      <!--top文本-->
      <div class="top">
        <div class="title">
          <!--<p>幸运大转盘</p>-->
        </div>
        <div class="text">

            <span>今天还剩</span>
            <span class="number"> {{turntableData.canJoinNum}} </span>
            <span>次抽奖机会</span>

        </div>
      </div>
      <!--转盘动画-->
      <div class="turntableBox">
        <div class="turntableImg" :style="'transform:rotate('+ transform +'deg);transition: transform 4s;'">
          <!---->
          <img class="turntableMain" src="../../assets/images/turntabel/turntable1.png" />
          <div class="eitm" v-for="(item,index) in obj" :key="index"
               :style="'transform:rotate('+ item.rat +'deg)'">
            <div class="eitmText">
              {{item.awardName}} {{statusBLottery2(item.prizeType)}}
            </div>
            <div class="eitmText">
              {{statusBLotteryBy(item.prizeType)}}
            </div>
            <div class="eitmImg" v-show="item.imageIsShow">
              <img :src="item.prizeImage">
            </div>
          </div>
        </div>
        <div class="pointerImg" @click="lottery(startLottery)" >
          <img src="../../assets/images/turntabel/pointer.png" />
        </div>
      </div>
      <!--活动规则-->
      <div class="activityAndRule">
        <!--活动规则Tab-->
        <div class="activityTab">
          <!--活动规则顶部切换按钮-->
          <div class="tabTop">
            <div class="bot activity" @click="clickTab(1)" :class="{'check': activityPage == 1 }">
              <P>活动规则</P>
              <img :src="activityPage == 1 ? botB : botF"/>
            </div>
            <div class="bot rule " @click="clickTab(2)" :class="{'check': activityPage == 2 }">
              <P>我的奖品</P>
              <img :src="activityPage == 2 ? botB : botF" height="96" width="261"/>
            </div>
          </div>
        </div>
        <!--活动规则页面page-->
        <div class="tabCent">
          <!--页面1-->
          <div v-show="activityPage == 1" class="page">
             <div class="pageCent" :class="{'scroll':turnRule.length>8}">
               <!--规则描述-->
               <p v-for="(item,index) in turnRule" :key="index">
                 {{item}}
               </p>
               <p v-show="fromType == 'iOS'">
                 所有奖品与活动由真芯天下发起,与苹果公司无关
               </p>
             </div>
          </div>
          <!--页面2-->
          <div v-show="activityPage == 2" class="page">
            <div class="pageTable">
              <!--表头-->
              <div class="th">
                <div class="td">
                  奖项
                </div>
                <div class="td">
                  数量
                </div>
                <div class="td td3">
                  奖品类型
                </div>
                <div class="td td2">
                  奖品
                </div>
              </div>
              <!--trBOX-->
              <div class="trBOX" @scroll="woListScroll($event)" id="trBOX" :class="{'scroll':WinList.length>=5}">
                <div class="trCard">
                  <div class="tr" v-for="(item,index) in WinList">
                    <div class="td">
                      {{item.awardName}}
                    </div>
                    <div class="td">
                      {{item.prizeNum}}
                    </div>
                    <div class="td td3">
                      {{item.prizeType | prizeType}}
                    </div>
                    <div class="td td2" @click="goChart(item.prizeType)">
                      {{item.prizeName}} {{item.prizeType == 3 ? '个': ''}}

                      <div class="icon" v-show="item.prizeType == 3">

                      </div>
                    </div>
                  </div>
                  <div class="tr" v-show="WinList.length<=0" style="border-bottom: 0px none">
                    <p style="text-align: center ;width: 100% ;line-height: 1rem ">暂无抽奖记录</p>
                  </div>
                </div>
              </div>
            </div>
            <p class="lodaingText">
              实物奖品将在活动结束后七个工作日内发放
            </p>
          </div>
          <!--分享活动-->
          <div class="share" @click="share()">
            分享活动有好礼
          </div>
        </div>
        <!--清除position塌陷-->
        <div class="clear"></div>
        <div class="blck">

        </div>
      </div>


    </div>

    <!--<login :showData="showData" @changeData="changeData"></login>-->
    <!--中奖-->
    <div class="showHideOnBlurByShare">
      <x-dialog v-model="showShare" class="dialog-demo" hide-on-blur>
        <div class="alertCent" v-show="Winning.prizeType != 0">
          <div class="title">
            <p>
             恭喜您中奖了
            </p>
          </div>
          <div class="form">
            <p class="p">奖品: <span> {{Winning.text}}</span></p>
            <p class="p">数量: <span> {{Winning.number}}</span></p>
          </div>
          <!---->
          <p class="cop" v-show="Winning.prizeType == 5 "> 实物奖品将在活动结束后七个工作日内发放。如有疑问，请与商城客服人员联系。</p>
          <div class="aletBot" @click="showShare = false">
            确定
          </div>
        </div>
        <div class="close" @click="showShare = false">
          <span class="vux-close">
            x
          </span>
        </div>
        <div class="alertCent" v-show="Winning.prizeType == 0">
          <div class="title" >
            <p>
              {{Winning.text}}
            </p>
          </div>
        </div>
      </x-dialog>
    </div>
    <!--<div class="guideShare">-->
      <!--<div >-->
        <!--<img src="../../assets/images/share-tips.png" />-->
      <!--</div>-->
    <!--</div>-->
    <!--<commonLoginAndBind :show="showHideOnBlurByShare" @changeShareData="changeShareData"></commonLoginAndBind>-->
    <div >
      <x-dialog v-model="isShare" :dialog-style="{'max-width': '100%', width: '100%', height: '100%', 'background-color': 'transparent'}" @click="isShare = false">
        <div class="guideShare">
        <img :src="shareTips" />
        </div>
        <p style="color:#fff;text-align:center;" @click="isShare = false">
          <br>
          <br>
          <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
        </p>
      </x-dialog>
    </div>
  </section>
</template>

<script>
  import { XDialog } from 'vux'
  import login from '../../components/commonLogin'
  import commonLoginAndBind from '../../components/commonLoginAndBind.vue'
  import shareTips from '../../assets/images/share-tips.png'
  import botF from '../../assets/images/turntabel/botF.png'
  import botB from '../../assets/images/turntabel/botB.png'
  export default {
    components: {
      XDialog,
      login,
      commonLoginAndBind
    },

    data () {
      return {
        fromType: '',
        botF: botF,
        botB: botB,
        noTap: true,               // 防止多次抽奖
        pages: {
          page: 1,                        // 当前页
          pageSize: 10,                   // 页面大小
          pageCunt: 0                     // 最多多少页面
        },
        formData: {                       // 登录信息
          phone: '',
          code: ''
        },
        loginOut: {                        // app分享同步登录状态
          phone: '',
          token: '',
          isLoginOut: false                  // 本地是否需要退出登录
        },
        shareTips: shareTips,
        activityPage: 1,                  // 活动规则/我的奖品 当前显示内容
        showData: {
          showHideOnBlurByLottery: false,  // 抽奖登录验证弹框
          showBind: false                  // 登录邀请码
        },
        showHideOnBlurByShare: false,    // 分享绑定邀请人弹框
        showShare: false,                // 抽奖完成
        isShare: false,                  // 引导分享
        user: {
          userId: '',
          beInvitationCode: '',          // 邀请码
          invitationCode: '',            // 注册码
          token: ''                      // 当前记录token
        },
        transform: 0,                      // 转盘旋转角度
        number: 0,                         // 当前指针指向奖项
        obj: [{
          awardName: '',                  // 奖品名称
          rat: 0
        }, {
          awardName: '',
          rat: 45
        }, {
          awardName: '',
          rat: 91
        }, {
          awardName: '',
          rat: 135
        }, {
          awardName: '',
          rat: 179
        }, {
          awardName: '',
          rat: 225
        }, {
          awardName: '',
          rat: 269
        }, {
          awardName: '',
          rat: 316
        }],
        turnRule: [],                     // 活动规则
        turnId: 0,                       // 大转盘id
        uuid: 0,                         // 大转盘分享id
        Winning: {
//          text: '谢谢参与',
//          number: 5000,
//          prizeType: 0
//          type; 0                       // 中奖类型
        },
        WinList: [],                      // 我的奖品列表
        turntableData: {                  // 大转盘详情
          turnName: '',                   // 大转盘名称
          beginTime: '',                  // 开始时间
          endTime: '',                    // 结束时间
          canJoinNum: 0                   // 当天参与次数
        }
      }
    },

    created () {
//      console.log(this.$router.currentRoute.fullPath)
      var user = localStorage.getItem('bsbUserInfo') ? localStorage.getItem('bsbUserInfo') : ''
      if (user) {
        this.user = JSON.parse(user)
      }
      this.uuid = this.$route.query.uuid
      let fromType = this.$route.query.fromType || ''
      let phone = this.$route.query.phone || ''
      let token = this.$route.query.token || ''
      this.fromType = fromType
      localStorage.setItem('fromType', this.fromType)
//      alert(this.user.token + '本地token')
//      localStorage.setItem('fromToken',this.token)
      if (fromType) {
//        console.log('来自app跳转')
        if (token && phone) {
          console.log('app已登录')
          this.formData.phone = phone
          this.formData.code = token
          if (token === this.user.token) {
            console.log('app,webview 登录同一个')
          }
        }
      } else {
//        console.log('手动进入')
      }
    },
    mounted () {
      this.getTurnDetail()
    },

    methods: {
      ptahChart (url) {
        var index = url.indexOf('?')
        var path = url.substring(0, index)
        var parm1 = url.substring(index + 1)
        var res = parm1.split('&')
        var parm = { }
        for (let i in res) {
          var list = res[i].split('=')
          parm[list[0]] = list[1]
        }
        parm.path = path
        return parm
      },
      /**
       * 弹框登录返回数据
       */
      changeData (data) {
        this.showData = {
          showHideOnBlurByLottery: data.show,
          isBind: false}
      },
      /**
       * 绑定邀请
       */
      changeShareData (data) {
//        console.log(data, 'data')
        this.showHideOnBlurByShare = data.open
        this.isShare = data.isShare
      },
      /**
       * 奖品分页
       */
      woListScroll (event) {
        var H = event.target.scrollTop
        var h = event.target.clientHeight
        var childrenH = event.target.children[0].offsetHeight
        if (childrenH - h <= H) {
          if (this.pages.page === this.pages.pageCunt) {
//            console.log('最后一页')
            return false
          } else {
            this.pages.page ++
            this.getTurnWinPage()
          }
        }
      },
      /**
       * 抽奖详情
       */
      getTurnDetail () {
        this.$http.get(`${this.api.getTurnDetail}?${this.api.allLogin}`, {
          params: {
            uuid: this.uuid
          }
        }).then((res) => {
          var data = res.data.data
          if (data) {
            this.turnId = data.id
            var turntableData = data.turnPrizeResponseList                    // 大转盘奖项
            for (let i in turntableData) {
//              this.obj[i].awardName = turntableData[i].awardName              // 大转盘奖项名称
              this.obj[i].awardName = turntableData[i].prizeName
              if (turntableData[i].prizeImage) {
                if (turntableData[i].prizeImage.indexOf('http') < 0) {
                  this.obj[i].prizeImage = this.api.imgUrl + turntableData[i].prizeImage
                } else {
                  this.obj[i].prizeImage = turntableData[i].prizeImage
                }
              }
              this.obj[i].prizeType = turntableData[i].prizeType
              this.obj[i].imageIsShow = turntableData[i].imageIsShow              // 是否显示图片
            }
            this.turnRule = []
            var turnRuleDate = data.turnRule                                  // 大转盘规则
            if (turnRuleDate) {
              turnRuleDate = turnRuleDate.split('\n')                        // 切割规则
              for (let i in turnRuleDate) {
                if (turnRuleDate[i]) {                                        // 切割后规则脏数据过滤
                  this.turnRule.push(turnRuleDate[i])
                }
              }
            }
            this.turntableData = {
              turnName: data.turnName,                   // 大转盘名称
              beginTime: data.beginTime,                 // 开始时间
              endTime: data.endTime,                     // 结束时间
              canJoinNum: data.fewNum                   // 当天参与次数
            }
          } else {
            this.$vux.loading.show({
              text: res.data.msg
            })
          }
        })
      },
      /**
       * 开始抽奖
       */
      lottery (fn) {
//        console.log(this.noTap, 'noTap')
        if (!this.noTap) {
          return false
        }
        this.noTap = false
        var that = this
        this.checkLogin().then(function (res) {
//          console.log(res, 'res')
          if (that.turntableData.canJoinNum <= 0) {
            that.$vux.toast.text('您今天的抽奖次数已经用完了喔！')
            this.noTap = true
            return false
          }
          fn()
        }).catch(function () {
          that.noTap = true
        })
//        if (!this.user.userId) {
//          this.showData = {
//            showHideOnBlurByLottery: true,
//            isBind: false}
//          console.log(this.showData)
//        } else {
//          this.startLottery()
//        }
      },
      /**
       * 分享
       */
      share () {
        var that = this
        this.checkLogin().then(function (res) {
          if (parseInt(res.data) !== parseInt(that.api.ERR_OK)) {
            that.personalInfo()
          }
        })
//        if (!this.user.userId) {
//          this.showData = {
//            showHideOnBlurByLottery: true,
//            isBind: true}
//        } else {
//          if (!this.user.invitationCode) {
//            this.showHideOnBlurByShare = true
//          } else {
//            this.isShare = true
//          }
//        }
      },
      /**
       * 切换tab
       */
      clickTab (index) {
        this.activityPage = index
        console.log(index)
        if (index === 2) {
          this.pages.page = 1
          this.getTurnWinPage()
        }
      },
      /**
       * 抽奖请求
       */
      startLottery () {
        var that = this
        this.$http.get(`${this.api.startLottery}?${this.api.allLogin}`, {
          params: {
            turnId: this.turnId
          }
        }).then((res) => {
//          console.log(res.data.status, this.api.ERR_OK, res.data.status !== parseInt(this.api.ERR_OK))
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            if (parseInt(res.data.status) === -3) {
              this.$vux.toast.text('太多人参与了,欢迎继续关注')
            } else {
              this.$vux.toast.text(res.data.msg)
            }
            this.noTap = true
            return
          }
          var data = res.data.data
          if (data) {
            this.startLotteryAnimation(data.awardNum)
            if (data.prizeImage) {
              if (data.prizeImage.indexOf('http') < 0) {
                this.obj.prizeImage = this.api.imgUrl + data.prizeImage
              } else {
                this.obj.prizeImage = data.prizeImage
              }
            }
            this.Winning = data
            var text = ''
            var number = ''
            if (data.prizeType === 0) {
              text = data.awardName
            }
            if (data.prizeType === 1) {
              text = '消费积分'
              number = data.prizeName
            }
            if (data.prizeType === 2) {
              text = '通用积分'
              number = data.prizeName
            }
            if (data.prizeType === 3) {
              text = '芯豆'
              number = data.prizeName
            }
            if (data.prizeType === 4) {
              text = '余额'
              number = data.prizeName
            }
            if (data.prizeType === 5) {
              text = data.prizeName
              number = 1
            }
            this.Winning.text = text
            this.Winning.number = number
            setTimeout(function () {
//              that.$vux.toast.text(text)
              that.showShare = true
              that.getTurnDetail()
              if (that.activityPage === 2) {
                that.pages.page = 1
                that.getTurnWinPage()
              }
            }, 4000)
          }
        }).catch(function () {
          that.noTap = true
        })
      },
      // 过滤器
      statusBLottery (index) {
        var list = ['谢谢参与', '消费积分', '通用积分', '芯豆', '余额', '礼品']
        return list[index]
      },
      // 过滤器
      statusBLottery2 (index) {
        var list = ['', '', '', '芯豆', '余额', '']
        return list[index]
      },
      statusBLotteryBy (index) {
        var list = ['', '消费积分', '通用积分', '', '', '']
        return list[index]
      },
      startLotteryAnimation (awardNum) {
//        console.log(awardNum)
        awardNum = awardNum - 1                                            // 计算中奖下标
        var AnimationNumber = awardNum - this.number                      // 计算动画移动几个奖项
        var AnimationDeg = Math.abs(3600 - parseInt(AnimationNumber * 45))// 计算当次动画移动角度
        this.transform = AnimationDeg + this.transform
        this.number = awardNum                                            // 记录当次动画下标进行下次计算
        var that = this
        setTimeout(function () {
          that.noTap = true
        }, 4000)
      },
      /**
       * 个人信息
       */
      personalInfo () {
        var user = localStorage.getItem('bsbUserInfo') ? localStorage.getItem('bsbUserInfo') : ''
        if (!user) {
          return false
        }
        user = JSON.parse(user)
        this.$http.post(`${this.api.personalInfo}?${this.api.allLogin}`, {
          id: user.userId
        }).then((res) => {
          var data = res.data.data
          if (data.beInvitationCode) {
            this.user.beInvitationCode = data.beInvitationCode
            console.log(window.location.href, 'path')
            var parm = {
              path: window.location.href,             // 浏览器地址
              turnName: this.turntableData.turnName, //  活动名称(大转盘名称)
              Description: ''                         // 转盘说明
            }
            console.log(parm)
            if (this.fromType === 'android') {
              // 联合分享回调
              window.java.turnbaleShare(parm.path, parm.turnName, parm.Description)
            } else if (this.fromType === 'iOS') {
              console.log('来自iOS')
              window.webkit.messageHandlers.turnbaleShare.postMessage(parm)
            } else {
              this.isShare = true
            }
          } else {
            this.$router.push({ path: '/bindInviter' })
//            this.routerReplace({path: '/bindInviter'})
          }
        })
      },
      /**
       * 是否登录
       */
      isLogin () {
        this.$http.post(`${this.api.ifLogin}?${this.api.allLogin}`, {}).then((res) => {
          let resData = res.data
          if (parseInt(resData.data) === parseInt(this.api.ERR_OK)) {
            this.getTurnWinPage()
          } else {
            this.user.userId = ''
          }
        })
      },
      /**
       * 我的奖品
       */
      getTurnWinPage () {
//        if (!this.user.userId) {
//          return false
//        }
        if (this.pages.page === 1) {
          this.WinList = []
        }
        this.$http.post(`${this.api.getTurnWinPage}`, {
          turnId: this.turnId,
          start: this.pages.page,
          pageSize: this.pages.pageSize
        }).then((res) => {
          var data = res.data.data
          if (data) {
            this.pages.pageCunt = Math.ceil(data.total / data.pageSize)
            for (let i in data.list) {
              this.WinList.push(data.list[i])
            }
          }
        })
      },
      /**
       * 去详情
       */
      goChart (index) {
        if (index === 1) {
          this.$router.push({path: '/consumePoints'})
        }
        if (index === 2) {
          this.$router.push({path: '/myPointsDetail', query: { id: 2 }})
        }
        if (index === 3) {
          this.$router.push({path: '/myPointsDetail', query: { id: 5 }})
        }
      }
    }
  }
</script>
<style lang="less">
  .turntable-wap{
    .showHideOnBlurByShare{
      .weui-dialog{
        max-width: 90%;
        width: 90%;
        overflow: visible;
      }
    }
  }
</style>
<style lang="less" scoped>
  .turntable-wap{
    width: 100%;
    padding: 0rem 0rem;
    position: absolute;
    max-width: 7.5rem;

    .back{
      position: absolute;
      z-index: -1;
      width: 100%;
      max-width: 7.5rem;
      margin: auto;
    }
    /*文本样式*/
    .top{
      text-align: center;

      .title{
        font-weight: 400;
        font-style: normal;
        font-size: .6rem;
        color: #FF9900;
        height: 3.3rem;
      }

      .text{
        font-size: .26rem;
        line-height: .6rem;
        color: white;

      }
    }

    /*转盘样式*/
    .turntableBox{
      position: relative;
      box-sizing: border-box;
      padding-bottom: .3rem;
      padding-top: .1rem;

      .turntableImg{
        width: 6.2rem;
        height: 6.2rem;
        padding: .2rem 0rem .4rem 0rem;
        margin: auto;
        display: flex;

        img.turntableMain{
          width: 6.2rem;
          height: 6.2rem;
          justify-content:center;
          align-items: center;
        }

        .eitm{
          width: 2.2rem;
          height: 6.2rem;
          position: absolute;
          /*background: rgba(250,250,250,.3);*/
          box-sizing: border-box;
          left:50%;
          margin-left: -1.05rem;
          padding-top: .4rem;
          color: white;

          .eitmText{
            width: 100%;
            text-align: center;
            font-size: .24rem;
            line-height: .3rem;
          }

          .eitmImg{
            width: .8rem;
            height: .55rem;
            margin: auto;
            margin-top: .2rem;

            img{
              width: .8rem;
              height: auto;
              margin: auto;
            }
          }
        }

        .eitm:nth-child(odd){
          padding-top: .2rem;
        }
      }

      .pointerImg{
        position: absolute;
        width: 1.76rem;
        height: 2.64rem;
        left: 50%;
        top: 50%;
        margin-left: -.90rem;
        margin-top: -1.4rem;

        img{
          width: 1.76rem;
          height: 2.64rem;
        }
      }
    }

    /*活动/规则*/
    .activityAndRule{
      width: 100%;
      position: relative;

      .activityTab{
        width: 100%;
        height: .94rem;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 2;
        /*活动规则tabl按钮*/
        .tabTop{
          width: 100%;
          display: flex;
          .bot{
            position: relative;
            flex-direction: row;
            width: 41% - .6rem;
            text-align: center;
            /*border: 1px rgba(255, 153, 0, 1) solid;*/
            height: .94rem;
            line-height: .94rem;
            /*border-radius: 5px;*/
            font-family: 'PingFangSC-Regular', 'PingFang SC';
            font-weight: 400;
            font-style: normal;
            font-size: .32rem;
            color: white;
            /*background-color: rgba(255, 255, 153, 1);*/
            p{
              position: absolute;
              top: 0px;
              left: 0px;
              width: 100%;
              text-align: center;
            }

            img{
              width: 2.61rem;
              height: .96rem;
            }
          }

          .activity{
            flex-direction: row;
            width: 41% - .6rem;
            text-align: center;
            margin-left: .8rem;
          }
          .rule{
            flex-direction: row;
            width: 41% - .6rem;
            text-align: center;
            margin-left: .4rem;
            margin-right: .8rem;
          }

          .check{
            /*background-color: rgba(255, 153, 0, 1);*/
            /*color: white;*/
          }
        }
      }

      /*活动page*/
      .tabCent{
        width: 86%;
        position: absolute;
        left: 7%;
        top: .6rem;
        background: inherit;
        background-color: #000010;
        box-sizing: border-box;
        border: 3px #5300b0 solid;
        border-radius: 5px;
        z-index: 1;
        padding-top: 1.2rem;
        padding-right: .22rem;
        padding-left: .22rem;
        padding-bottom: .4rem;

        .page{
          font-size: .26rem;
          color: #333333;

          /*规则*/
          .pageCent{
            max-height: 8rem;

            p{
              padding-bottom:.48rem ;
              color: white;
              word-break:break-all;
            }
          }
            /*奖品*/
          .pageTable{
            border: 1px #977fbe solid;
            border-radius: 4px;
            margin-bottom: 1rem;

            .th{
              width: 100%;
              display: flex;
              height: .98rem;
              background: #5c3798;
              color: white;

              .td{
                flex-direction: row;
                width: 23%;
                text-align: center;
                font-size: .28rem;
                font-family: 'PingFangSC-Regular', 'PingFang SC';
                font-weight: 400;
                line-height: .98rem;
              }

              .td3{

                width:27%;
              }
              .td2{

                width:27%;
              }
            }
            .trBOX{
              width: 100%;
              max-height: 5rem;
            }
            .tr{
              width: 100%;
              display: flex;
              height: .98rem;
              color: #333333;
              border-bottom:1px #977fbe solid;
              color: white;

              .td{
                flex-direction: row;
                width: 23%;
                text-align: center;
                font-size: .28rem;
                font-family: 'PingFangSC-Regular', 'PingFang SC';
                font-weight: 400;
                line-height: .98rem;
              }

              .td3{

                width:27%;
              }

              .td2{

                width:27%;
                position: relative;
                .icon{
                  position: absolute;
                  height: .2rem;
                  width: .6rem;
                  top: .4rem;
                  right: -.2rem;
                  background: url("../../assets/images/turntabel/next.png") no-repeat 0 0;
                  transform: rotate(90deg);
                  img{
                    max-width: 100%;
                  }
                }
              }
            }
          }
          .scroll{
            overflow: scroll;
          }
          .lodaingText{
            text-align: center;
            color: #fff;
            Letter-spacing: 2px;
          }
        }
      }

      /*清除position 塌陷*/
      .clear{
        width: 100%;
        height: 10.9rem;
      }
      .blck{
        width: 100%;
        height: 1.5rem;
        background: #000;
      }
    }

    //分享
    .share{
      width: 86%;
      height: .88rem;
      /*background-color: rgba(255, 153, 0, 1);*/
      box-sizing: border-box;
      /*border-width: 1px;*/
      /*border-style: solid;*/
      /*border-color: rgba(255, 153, 0, 1);*/
      border-radius: .47rem;
      margin: auto;
      line-height: .88rem;
      color: rgb(255, 255, 204);
      margin-top: .3rem ;
      margin-bottom: .3rem ;
      text-align: center;
      font-size: .42rem;
      Letter-spacing: 3px;
      background: linear-gradient(#f030ff, #b42efb,#7d2df8 );
    }

    // 弹框
    .alertCent{
      border-radius: .14rem;

      .title{
        width: 100%;
        text-align: center;
        font-size: .36rem;
        padding: .4rem 0rem .4rem .0rem;
        color: rgb(255, 0, 0);
      }

      .form{
        width: 100%;
        padding-bottom: .4rem;
        .p{
          width: 2.2rem;
          margin: auto;
          text-align: left;
          color: #b4b4b4;
        }

        img{
         width: 5rem;
         height: auto;
          margin: auto;
        }

        .card{
          display: flex;
          width: 90%;
          height: 1rem;
          margin: auto;
          flex-direction: row;
          background: rgba(242, 242, 242, 1);
          margin-bottom: .2rem;
          box-sizing: border-box;
          line-height: .6rem;
          padding: .2rem .2rem .2rem .2rem;
          .lable{
            width: 1.3rem;
            height: .8rem;
            text-align: right;
          }
          .formIput{
            width: 4.8rem;
            display: flex;
            flex-direction: row;
            margin-left: .2rem;
            .inputBox{
              border:1px solid #e1e1e1;
              width: 4.8rem;
              background: #ffffff;
              input{
                width: 100%;
                height: .5rem;
                line-height: .6rem;
                border: 0px none;
              }
            }
            .getCode{
              margin-left: .2rem;
            }
          }
        }

        .phone{
          .formIput{
            width: 4.8rem;
            .inputBox{
              width: 3rem;
            }
          }
        }
      }
      .cop{
        width: 90%;
        margin: auto;
        color: #f79172;
        text-align: left;
      }
      .aletBot{
        width: 90%;
        height: .8rem;
        background: rgba(255, 0, 0, 1);
        margin: auto;
        border-radius: .4rem;
        line-height: .8rem;
        color: white;
        text-align: center;
        font-size: .28rem;
        margin-bottom:.6rem ;
        margin-top: .4rem
      }
    }

    .close{
      position: absolute;
      top: -0.8rem;
      right: 50%;
      width:.6rem;
      height: .6rem;
      text-align: center;
      line-height: .55rem;
      border-radius: .5rem;
      border: 1px solid #ffffff;
      color: white;
      margin-right: -0.3rem;
    }

    .guideShare{
      width: 100%;
      height: 4rem;
      img{
        position: absolute;
        right: 0rem;
        top: 0rem;
        width: 3.4rem;
        height: 2.4rem;
        margin: auto;
      }
    }
  }
</style>
                   
 
