<template>
  <div>
    <div class="groupAdd-wrap">
      <div class="groupInfo">
        <div class="group-top" @click="goPage('/goodDetail', oderDetail)">
          <!--商品图片-->
          <div class="group-img">
            <img :src="oderDetail.mainImage"/>
          </div>
          <div class="group-text">
            <div>{{oderDetail.goodsName}}</div>
            <div><span>{{oderDetail.groupNum}}</span>人拼单,已拼<span>{{oderDetail.hasGroupPeople}}</span>件</div>
            <div><span>￥{{oderDetail.goodsGroupPrice || 0 }}</span> <span> ￥{{oderDetail.goodsPrice}}</span></div>
          </div>
        </div>
        <div class="group-line"></div>
        <!--拼团进行中-->
        <div class="group-num" v-if="oderDetail.status == 1">
          <div class="group-head">
            <div class="head-next" v-for="(item, index) in userList" :key="index" :class="{'head-first': item.id === 3}">
              <div>
                <img :src="item.img"/>
              </div>
              <div v-if="item.id === 3">团长</div>
            </div>
          </div>
          <div class="group-status">
            <div style="color: #f98b38;">仅剩<span>{{oderDetail.fewNum}}</span>个名额,<span v-html="timeOutFn(timeOverD)"></span>结束</div>
          </div>
        </div>
        <!--参团人数已满-->
        <div class="group-num" v-if="oderDetail.status == 2">
          <div class="group-head">
            <div class="head-next" v-for="(item, index) in userList" :key="index" :class="{'head-first': item.id === 3}">
              <div>
                <img :src="item.img"/>
              </div>
              <div v-if="item.id === 3">团长</div>
            </div>
          </div>
          <div class="group-status">
            <div style="color: #f98b38;">哎呀亲,你来得太迟了~座无虚席</div>
            <div style="width: 1.24rem;height: 1.11rem;"><img :src="manyuan" style="width: 100%;height: 100%;"/></div>
          </div>
        </div>
        <!--拼团活动已结束-->
        <div class="group-num" v-if="(timeOverD < 0 && oderDetail.status == 1)|| oderDetail.status == 3">
          <div class="group-head">
            <div class="head-next" v-for="(item, index) in userList" :key="index" :class="{'head-first': item.id === 3}">
              <div>
                <img :src="item.img"/>
              </div>
              <div v-if="item.id === 3">团长</div>
            </div>
          </div>
          <div class="group-status">
            <div style="color: #999999;">很遗憾，此拼团已结束</div>
            <div style="width: 1.24rem;height: 1.11rem;"><img :src="jieshu" style="width: 100%;height: 100%;"/></div>
          </div>
        </div>
      </div>
      <div class="groupOther" v-if="newList.length > 0">
        <div class="other-title">Ta们都在拼</div>
        <div class="group-line"></div>
        <div class="group-swiper">
          <swiper auto height="110px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" auto loop>
            <swiper-item v-for="(item, index) in newList" :key="index">
             <div class="groupList" v-for="(ite, ind) in item" :key="ind">
               <div>{{ite.userPhone}}</div>
               <div>
                 <p>还差<span>{{ite.fewNum}}</span>人拼成</p>
                 <p>剩余<span> {{ite.D ? parseInt(ite.D) + ' 天 ': '' }}{{ ite.H + ':' + ite.T }}</span></p>
               </div>
               <!--<div @click="gopd(ite)">去拼单</div>-->
             </div>
            </swiper-item>
          </swiper>
        </div>
      </div>
      <div class="groupFooter">
        <div class="foot-left" :class="{'groupErorr': doningList[goodsId]}" @click="freeGroups(doningList[goodsId])">
          {{ doningList[goodsId] ? '拼团中' : '免费开团'}}
        </div>
        <div class="foot-right" @click = "bindCode" v-show="oderDetail.fewNum && oderDetail.status == 1">
          <p>￥<span>{{oderDetail.goodsGroupPrice}}</span></p>
          <p>参与拼团</p>
        </div>
        <div class="foot-right error"  v-show="!oderDetail.fewNum || oderDetail.status == 2 || oderDetail.status == 3">
          <p>￥<span>{{oderDetail.goodsGroupPrice}}</span></p>
          <p>参与拼团</p>
        </div>
      </div>
    </div>
    <!--// 免费拼单-->
    <x-dialog v-model="suprShow" class="dialog-demo">
      <x-icon type="ios-close-outline" style="fill:#fff;top: -0.8rem;position: absolute;left: 50%;margin-left: -0.3rem;" @click="iosClose"></x-icon>
      <div class="groupMask">
        <div class="mask-top">
          <div><img :src="qin"/></div>
          <div>您需要参与拼团后才能享受免
            费开团的机会并获取分佣喔～</div>
        </div>
        <div class="mask-bot">
          <div @click="iosClose">取消</div>
          <div @click="bindCode">参与拼团</div>
        </div>
      </div>
    </x-dialog>
    <!--二维码-->
    <skuDom :goodsDetail="goodsDetail" :show="skuShow" @sukBackByGroup="sukBackByGroup" :skuOrderSource="skuOrderSource" :pageType="pageType" :typeNum="typeNum" :groupId="groupId"></skuDom>
    <!--邀请好友绑定邀请人的弹框-->
    <div class="bindInviter">
      <x-dialog v-model="isPayShow" class="dialog-demo">
        <x-icon type="ios-close-outline" style="fill:#fff;top: -0.8rem;position: absolute;left: 50%;margin-left: -0.3rem;" @click="isInviter(1)"></x-icon>
        <div style="padding: 0.5rem;">
          <div class="bindTop">
            <div class="bind-l"><img :src="cnayu"/></div>
            <div class="bind-r">{{ magError}}}</div>
          </div>
          <div class="bindBottom">
            <div class="bind-yes" @click="isInviter(1)">取消</div>
            <div class="bind-no" @click="isInviter(2)">去付款</div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import { XSwitch, Group, Cell, Swiper, SwiperItem, XDialog } from 'vux'
  import skuDom from '../../components/sku/skuAll.vue'                      // 幸运抢购 sku
  export default {
    name: 'groupAdd',
    components: {
      XSwitch,
      Group,
      Cell,
      Swiper,
      SwiperItem,
      XDialog,
      skuDom
    },
    data () {
      return {
        goodsId: '',
        suprShow: false,
        status: 1,
        timeOverD: 0,
        defaultNum: 5, // 团长默认设置5人团
        realityNum: 3, // 实际已经参团人数
        newList: [],
        swiperList: [
          {
            phone: '11111111111',
            purchaseScaleCount: null
          },
          {
            phone: '22222222222',
            purchaseScaleCount: null
          },
          {
            phone: '3333333333',
            purchaseScaleCount: null
          },
          {
            phone: '44444444444',
            purchaseScaleCount: null
          },
          {
            phone: '55555555555',
            purchaseScaleCount: null
          },
          {
            phone: '66666666666',
            purchaseScaleCount: null
          }
        ],
        group03: require('../../assets/images/groupImg/tz.png'),
        group04: require('../../assets/images/groupImg/deflt.png'),
        group05: require('../../assets/images/groupImg/gd.png'),
        tzmx: require('../../assets/images/groupImg/tzmx.png'),
        fmx: require('../../assets/images/groupImg/fmx.png'),
        dfk: require('../../assets/images/groupImg/dfk.png'),
        group06: require('../../assets/images/groupBooking/group06.png'),
        manyuan: require('../../assets/images/groupBooking/manyuan.png'),
        jieshu: require('../../assets/images/groupBooking/jieshu.png'),
        qin: require('../../assets/images/groupBooking/qin.png'),
        oderDetail: {},               // 拼团订单详情
        superGroupDeailList: '',      // 拼团列表
        skuShow: false,              // 拼团sku显示隐藏
        goodsDetail: '',              // 拼团sku数据
        skuOrderSource: '',           // 下单类型(福利专区 拼团 )
        pageType: 12,                // sku页面类型
        typeNum: 12,                  // sku下单类型 (购物车 立即购买)
        userList: [],
        timeC: 0,                     // 服务器 - 本地时间 差
        groupId: '',                  // 拼团id
        isPayShow: false,                        // 提示未付款
        magError: '',                            // 提示未付款提示语
        people: require('../../assets/images/groupBooking/people.png'),
        cnayu: require('../../assets/images/goodsDietail/canyu.png'),
        personalData: {},
        doningList: {}                 // 平团中对象
      }
    },
    mounted: function () {
      console.log(this.$route.path)
    },
    methods: {
      /**
       * 获取个人信息
       */
      getPersonalInfo () {
//        this.$http.post(`${this.api.personalInfo}`, {
//          id: this.bsbUserInfo ? this.bsbUserInfo.userId : ''
//        }).then((res) => {
//          // console.log(res)
//          this.personalData = res.data.data
//          if (res.data.status !== this.api.ERR_OK || !res) {
//            return false
//          }
//          if (!this.personalData.beInvitationCode) {
//            this.bindCodeShow = true
//          } else {
//            this.modalDialogfun(13)
//          }
//        })
        this.suprShow = false
        this.modalDialogfun(13)
      },
      /**
       * 参与超级拼团 是否绑定邀请人
       */
      bindCode () {
        if (this.suprShow) {
          this.suprShow = false
        }
        // this.getPersonalInfo()
        this.checkSperGroupInfo(0)
      },
      /**
       * 关闭邀请人弹框
       */
      isInviter (n) {
        // console.log(v)this.bindCodeShow = false
        this.isPayShow = false
        if (n === 2) {
          localStorage.setItem('goOrderState', '1')
          this.$router.push({name: 'orderList'})
        }
      },
      /**
       *  拼团中列表
       */
      getSuperGroupIngList (id) {
//        `${this.api.getSuperGroupIngList}`
        this.$http.post(`${this.api.getSuperGroupIngList}`, {
          start: 1,
          pageSize: 20,
          goodsId: id
        }).then((res) => {
          this.swiperList = res.data.data.list
          this.GroupIngListFn(res)
        })
      },
      /**
       * 拼团中列表数据解析
       */
      GroupIngListFn (res) {
        var resData = res.data
        if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
          var listData = resData.data.list
//          console.log(listData)
          for (let i in listData) {
            var time = listData[i].endTime - resData.data.systemTime
            var resTime = this.timeOutBack(time)
//            console.log(resTime, 'resTime')
            listData[i].D = parseInt(resTime.D)
            listData[i].H = resTime.H
            listData[i].T = resTime.T
            listData[i].S = resTime.S
            listData[i].time = time
          }
          res.data = listData
//          console.log(res.data)
          this.swiperData()
        }
      },
      /**
       * 再次开团是否灰色
       */
      groupDoing (v) {
        this.$http.get(`${this.api.etSuperGroupingGoodsId}`, {
          params: {goodsId: this.goodsId}
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            var doning = {}
            for (let i in resData.data) {
              doning[resData.data[i]] = 1
            }
            this.doningList = doning
          }
        })
      },
      /**
       * 轮播数据
       */
      swiperData () {
        // console.log(this.swiperList)
        var list = []
        for (var i = 0, len = this.swiperList.length; i < len; i += 2) {
          list.push(this.swiperList.slice(i, i + 2))
        }
        this.newList = list
        // console.log(this.newList)
      },
      /**
       * 检测是否登录
       */
      checkLogin (fun, err) {
        this.$http.get(`${this.api.ifLogin}`, {
        }).then((res) => {
          let resData = res.data
          this.isLogin = res.data
          if (parseInt(resData.data) !== parseInt(this.api.ERR_OK)) {
            err()
            return false
          }
          fun()
        })
      },
      /**
       * 参与拼团
       */
      getGroupJoinInfo () {
        // `${this.api.getGroupJoinInfo}` '/src/assets/js/getGroupJoinInfo.json'
        this.$http.get(`${this.api.getGroupJoinInfo}`, {
          params: {
            superGroupId: this.superGroupId
          }
        }).then((res) => {
//          console.log(res)
          if (res.data.status === '1') {
            this.oderDetail = res.data.data
            // 时间差
            this.timeC = this.oderDetail.systemTime - new Date().getTime()
            // 倒计时时间戳
            this.timeOverD = this.oderDetail.endTime - this.oderDetail.systemTime
            this.getData()
            // 列表
            this.superGroupDeailList = res.data.data.superGroupDeailList
            this.goodsId = this.oderDetail.goodsId
            this.userList = []
            let line = res.data.data.groupNum > 6 ? 6 : res.data.data.groupNum
            for (let i = 0; i < line; i++) {
              // groupNum大于7个, 最后一个图片是group05 其它是 group04
              let pu = ((i === line - 1) && (res.data.data.groupNum >= 7)) ? {img: this.group05, id: 5} : {img: this.group04, id: 4}
              if (this.superGroupDeailList[i]) {
                pu = {img: this.tzmx, id: 'tzmx'}
              }
              if (this.superGroupDeailList[i] && this.superGroupDeailList[i].ifHeadUser === 1) {
                pu = {img: this.group03, id: 3}
              }
              if (this.superGroupDeailList[i] && this.superGroupDeailList[i].ifHeadUser === 0 && this.superGroupDeailList[i].ifAccounted === 1) {
                pu = {img: this.tzmx, id: 'tzmx'}
              }
              if (this.superGroupDeailList[i] && this.superGroupDeailList[i].ifHeadUser === 0 && this.superGroupDeailList[i].ifAccounted === 0) {
                pu = {img: this.fmx, id: 'fmx'}
              }
              if (this.superGroupDeailList[i] && this.superGroupDeailList[i].ifPay === 0) {
                pu = {img: this.dfk, id: 'dfk'}
              }
              this.userList.push(pu)
            }
//            console.log(this.userList)
//            拼团列表
            this.getSuperGroupIngList(this.oderDetail.goodsId)
//            拼团商品详情
            this.getGoodsDetail(this.oderDetail.goodsId)
            // 登陆后检测是否拼团中
            this.checkLogin(() => {
              this.groupDoing()
            }, () => {})
          }
        })
      },
      /**
       * 去拼单
       */
      gopd (v) {
        console.log(v)
        this.$router.push({path: '/goodDetail', query: {superGroupId: v.superGroupId, pageType: 12, goodsId: this.oderDetail.goodsId}})
      },
      /**
       * 点击免费开团按钮
       */
      freeGroups (isErorr) {
        if (isErorr) return
        this.groupId = ''
        this.checkSperGroupInfo(1)
      },
      /**
       * 是否可以拼团
       */
      checkSperGroupInfo (v, item) {
        let param = {
          goodsId: this.goodsId,
          ifHeadUser: v,
          superGroupId: ''
        }
        if (this.$route.query.superGroupId && v === 0) {
          param.superGroupId = parseInt(this.$route.query.superGroupId)
        }
        this.$http.post(`${this.api.checkSperGroupInfo}`, param).then((res) => {
          console.log(res.data.status)
          if (res.data.data === 1) {
            this.suprShow = false
            let ordertype = v ? 12 : 13
            let parm = item || ''
            this.modalDialogfun(ordertype, parm)
          } else if (parseInt(res.data.status) === 9950) {
            this.suprShow = true
          } else if (parseInt(res.data.status) === 9951) {
            this.magError = res.data.msg
            this.isPayShow = true
          } else {
            this.$vux.toast.text(res.data.msg)
          }
        })
      },
      /**
       * 点击关闭弹框
       */
      iosClose () {
        this.suprShow = false
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
        var str = '<span class="djs1">' + H + '</span>' + '<span class="djs11">' + '时' + '</span>' + '<span class="djs1">' + T + '</span>' + '<span class="djs11">' + '分' + '</span>' + '<span class="djs1">' + S + '</span>' + '<span class="djs11">' + '秒' + '</span>'
        if (D > 0) {
          str = '<span class="djs1">' + D + '</span>' + '<span class="djs11">' + '天' + '</span>' + str
        }
        return str
      },
      /**
       * 倒计时
       */
      timeOutBack (time) {
        if (time <= 0) {
          return {D: 0, H: '00', T: '00', S: '00'}
        }
        var D = parseInt(time / 86400000)                                // 天
        var H = parseInt((time % 86400000) / 3600000)                   // 小时
        var T = parseInt(((time % 86400000) % 3600000) / 60000)           // 小时
        var S = parseInt((((time % 86400000) % 3600000) % 60000) / 1000)  // 秒
        if (H < 10) {
          H = '0' + H
        }
        if (T < 10) {
          T = '0' + T
        }
        if (S < 10) {
          S = '0' + S
        }
        var res = {D, H, T, S}
        return res
      },
      // top倒计时
      getData () {
        if (this.timer) {
          return false
        }
        this.timer = setInterval((res) => {
          let sysTime = (new Date()).getTime() + this.timeC
          if (this.timeOverD > 0) {
            this.timeOverD = this.oderDetail.endTime - sysTime
            if (this.timeOverD <= 0) {
              console.log('刷新')
              this.getGroupJoinInfo()
            }
          }
        }, 1000)
      },
//       拼团sku callback
      sukBackByGroup (res) {
//        console.log(res)
        this.skuShow = res
      },
      /**
       * 商品详情 (sku 数据)
       */
      getGoodsDetail (id) {
        this.$http.post(`${this.api.goodsDetail}`, {
          id: id,
          chk: ''
        }).then((res) => {
          this.goodsDetail = res
        })
      },
      modalDialogfun (v, item) {
        this.skuOrderSource = v
        this.typeNum = v
        this.skuShow = true
      },
      /**
       * * 拼团商品列表
       * @param.path          路径
       * @v.id                 商品id
       * @item.goodsPrice    商品价格(拼团价格)
       * @item.linePrice     商品划线价格(销售价格)
       * @item.groupPeople   商品id(购买人数)
       * */
      goPage (path, v) {
        this.$router.push({path: path, query: {goodsId: v.goodsId, pageType: 12}})
      }
    },
    watch: {
    },
    created () {
      this.superGroupId = this.$route.query.superGroupId
      this.groupId = this.$route.query.superGroupId
      this.getGroupJoinInfo()
    },
    destroyed () {
      clearInterval(this.timer)
    }
  }
</script>
<style scoped lang=less>
  .groupAdd-wrap{
    width: 100%;
    max-width: 7.5rem;
    min-height: 100vh;
    background: #f1f2f5;
    overflow: hidden;
    .groupInfo{
      /*width: 6.62rem;*/
      margin: 0.2rem;
      padding: 0.32rem 0 0 0.24rem;
      -webkit-border-radius: 0.1rem;
      -moz-border-radius: 0.1rem;
      border-radius: 0.1rem;
      background: #fff;
      .group-top{
        display: flex;
        height: 2.18rem;
        .group-img{
          width: 1.92rem;
          height: 2.18rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .group-text{
          width: 3.93rem;
          height: 2.18rem;
          margin-left: 0.74rem;
          div{
            &:nth-of-type(1) {
              white-space: normal;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              font-size: 0.28rem;
              color: #333;
              line-height: 0.35rem;
            }
            &:nth-of-type(2) {
              width: 2.33rem;
              height: 0.3rem;
              /*line-height: 0.3rem;*/
              background: #F98B38;
              -webkit-border-radius: 0.06rem;
              -moz-border-radius: 0.06rem;
              border-radius: 0.06rem;
              color: #ffffff;
              font-size: 0.2rem;
              text-align: center;
              margin-top: 0.21rem;
            }
            &:nth-of-type(3) {
              margin-top: 0.65rem;
              span{
                line-height: 0.39rem;
                &:nth-of-type(1) {
                  font-size: 0.32rem;
                  color: #F82828;
                  font-weight: 600;
                }
                &:nth-of-type(2) {
                  font-size: 0.26rem;
                  color: #999999;
                  text-decoration: line-through;
                }
              }
            }
          }
        }
      }
      .group-line{
        width: 6.3rem;
        height: 0.02rem;
        background: #B5B5B5;
        margin: 0.15rem 0.155rem 0.38rem 0.155rem;
      }
      .group-num{
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
        background: #fff;
        .group-remain{
          text-align: center;
          color: #333333;
          font-size: 0.28rem;
          font-weight: 600;
          margin-bottom: 0.52rem;
          padding-top: 0.29rem;
          span{
            color: #F82828;
          }
        }
        .group-head{
          display: flex;
          margin: 0 0.44rem;
          justify-content: space-around;
          .head-first{
            /*width: 0.98rem;*/
            height: 1.06rem;
            div{
              &:nth-of-type(1) {
                width: 0.82rem;
                height: 0.82rem;
                /*margin: 0 0.08rem;*/
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                border-radius: 50%;
                img{
                  width: 100%;
                  height: 100%;
                  -webkit-border-radius: 50%;
                  -moz-border-radius: 50%;
                  border-radius: 50%;
                }
              }
              &:nth-of-type(2) {
                /*height: 0.35rem;*/
                /*line-height: 0.35rem;*/
                text-align: center;
                background: #F82828;
                color: #fff;
                -webkit-border-radius: 0.6rem;
                -moz-border-radius: 0.6rem;
                border-radius: 0.6rem;
                position: relative;
                top: -0.11rem;
                font-size: 0.24rem;
              }
            }
          }
          .head-next{
            width: 0.82rem;
            height: 0.82rem;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .head-last{
            width: 0.82rem;
            height: 0.82rem;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
        .group-dough{
          width: 6rem;
          height: 0.78rem;
          line-height: 0.78rem;
          text-align: center;
          color: #fff;
          font-size: 0.3rem;
          background: #F82828;
          margin-left: 0.51rem;
          -webkit-border-radius: 0.1rem;
          -moz-border-radius: 0.1rem;
          border-radius: 0.1rem;
          margin-top: 0.23rem;
        }
      }
      .group-status{
        height: 1.11rem;
        text-align: center;
        font-size: 0.24rem;
        color: #faa260;
        display: flex;
        justify-content: space-between;
        div{
          &:nth-of-type(1) {
            margin-left: 1.6rem;
            height: 1.11rem;
            line-height: 1.11rem;
          }
        }
      }
    }
    .groupOther{
      width: 6.62rem;
      height: 2.99rem;
      margin: 0.2rem;
      padding: 0.32rem 0.24rem;
      -webkit-border-radius: 0.1rem;
      -moz-border-radius: 0.1rem;
      border-radius: 0.1rem;
      background: #fff;
      .other-title{
        text-align: center;
        color: #333;
        line-height: 0.39rem;
        font-size: 0.26rem;
        font-weight: 500;
      }
      .group-line{
        width: 6.3rem;
        height: 0.02rem;
        background: #B5B5B5;
        margin: 0.15rem 0.155rem 0.38rem 0.155rem;
      }
      .group-swiper{
        width: 100%;
        .groupList{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.2rem;
          div{
            &:nth-of-type(1) {
              font-size: 0.26rem;
              color: #999999;
            }
            &:nth-of-type(2) {
              p{
                line-height: 0.39rem;
                &:nth-of-type(1) {
                  font-size: 0.24rem;
                  color: #999;
                  span{
                    color: #f98b38;
                  }
                }
                &:nth-of-type(2) {
                  font-size: 0.28rem;
                  color: #666;
                }
              }
            }
            &:nth-of-type(3) {
              width: 1.44rem;
              height: 0.54rem;
              line-height: 0.54rem;
              background: #F82828;
              color: #fff;
              text-align: center;
              -webkit-border-radius: 0.05rem;
              -moz-border-radius: 0.05rem;
              border-radius: 0.05rem;
            }
          }
        }
      }
    }
    .groupFooter{
      width: 100%;
      max-width: 7.5rem;
      height: 0.98rem;
      position: fixed;
      bottom: 0;
      left: 0;
      color: #fff;
      display: flex;
      text-align: center;
      .foot-left{
        width: 3.75rem;
        height: 0.98rem;
        line-height: 0.98rem;
        background: #F98B38;
      }
      .groupErorr{
        background: #999;
      }
      .foot-right{
        width: 3.75rem;
        height: 0.98rem;
        line-height: .40rem;
        background: #F82828;
        p{
          line-height: .40rem;
          &:nth-of-type(1) {
            margin-top: 0.1rem;
          }
        }
      }
      .error{
        line-height: .40rem;
        background: #999;
      }
    }
  }
</style>
<style>
  .weui-switch{
    /*border-color: #f82828!important;*/
    background-color: #f82828!important;
  }
  .weui-switch:checked{
    border-color: #f82828!important;
  }
  .weui-dialog {
    position: fixed;
    display: table;
    z-index: 5000;
    width: 72%;
    max-width: 300px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background-color: #FFFFFF;
    text-align: center;
    border-radius: 5px;
    overflow: auto;
  }
  .groupMask{
    width: 5.4rem;
  }
  .mask-top{
    margin-top: 0.62rem;
    font-size: 0.3rem;
    color: #333;
    display: flex;
  }
  .mask-top div:nth-of-type(1){
    width: 0.75rem;
    height: 0.75rem;
    margin-left: 0.64rem;
  }
  .mask-top div:nth-of-type(1) img{
    width: 100%;
    height: 100%;
  }
  .mask-top div:nth-of-type(2){
    max-width: 3.55rem;
    color: #333;
    font-size: 0.26rem;
    line-height: 0.39rem;
    text-align: left;
    margin-left: 0.2rem;
  }
  .mask-bot{
    display: flex;
    justify-content: space-around;
    margin-top: 0.67rem;
    margin-bottom: 0.5rem;
  }
  .mask-bot div:nth-of-type(1){
    width: 1.72rem;
    height: 0.54rem;
    line-height: 0.54rem;
    background: #fff;
    color: #F82828;
    border-radius: 0.08rem;
    border: 1px solid #F82828;
  }
  .mask-bot div:nth-of-type(2){
    width: 1.72rem;
    height: 0.54rem;
    line-height: 0.54rem;
    background: #F82828;
    color: #fff;
    border-radius: 0.08rem;
    border: 1px solid #F82828;
  }

  .groupMask{
    width: 5.4rem;
  }
  .mask-top{
    margin-top: 0.62rem;
    font-size: 0.3rem;
    color: #333;
  }
  .mask-top p{
    line-height: 0.39rem;
  }
  .mask-bot{
    display: flex;
    justify-content: space-around;
    margin-top: 0.67rem;
    margin-bottom: 0.5rem;
  }
</style>

<style lang="less">
  .bindInviter{
    .weui-dialog {
      position: fixed;
      display: table;
      z-index: 5000;
      width: 80%;
      max-width: 340px;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      background-color: #FFFFFF;
      text-align: center;
      border-radius: 3px;
      overflow: auto;
    }
    .bindTop{
      /*width: 6rem;*/
      display: flex;
      .bind-l{
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.2rem;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .bind-r{
        max-width: 4rem;
        line-height: 0.39rem;
        font-size: 0.28rem;
        color: #333;
        text-align: left;
      }
    }
    .bindBottom{
      margin-top: 0.53rem;
      display: flex;
      font-size: 0.28rem;
      justify-content: space-between;
      .bind-yes{
        width: 1.72rem;
        height: 0.54rem;
        line-height: 0.54rem;
        border: 1px solid #F82828;
        color: #F82828;
        background: #fff;
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
      }
      .bind-no{
        width: 1.72rem;
        height: 0.54rem;
        line-height: 0.54rem;
        border: 1px solid #F82828;
        color: #fff;
        background: #F82828;
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
      }
    }
  }
</style>
