<template>
  <div class="main" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <div id="topBox">
      <div class="trta-headData" >
        <img :src="back"/>
        <div class="home_img">
          <img :src="jd" v-if="userData.rank == 8"/>
          <img :src="ypd" v-if="userData.rank == 7"/>
          <img :src="ph" v-if="userData.rank == 0"/>
          <img :src="yd" v-if="userData.rank == 4"/>
          <img :src="yt" v-if="userData.rank == 1"/>
          <img :src="erdai" v-if="userData.rank == 5"/>
          <img :src="ertuan" v-if="userData.rank == 2"/>
          <img :src="sd" v-if="userData.rank == 6"/>
          <img :src="st" v-if="userData.rank == 3"/>
        </div>
        <div class="uuInfo">
          <div class="moneyInfo">
            <div>{{userData.arrivedBonus || 0}}</div>
            <div>已到账金额 (元)</div>
          </div>
          <div class="white-line"></div>
          <div class="moneyInfo">
            <div>{{userData.expectedBonus || 0}}</div>
            <div>预计到账 (元)</div>
          </div>
        </div>
      </div>
      <div class="trta-height">
        <div class="trta-i">
          <div>{{userData.groupTotalNum || 0}}</div>
          <div>总发团数</div>
        </div>
        <div class="trta-line"></div>
        <div class="trta-i">
          <div>{{userData.groupIngNum || 0}}</div>
          <div>拼团中</div>
        </div>
        <div class="trta-line"></div>
        <div class="trta-i">
          <div>{{userData.groupSuccessNum || 0}}</div>
          <div>拼团成功</div>
        </div>
        <div class="trta-line"></div>
        <div class="trta-i">
          <div>{{userData.groupFailedNum || 0}}</div>
          <div>拼团失败</div>
        </div>
      </div>
    </div>

    <!--列表-->
    <div class="navBox" v-show="isNav">
      <div class="nav" :class="{'fixed': isNav}">
        <div class="item" v-for="(item, index) in navList" :key="index" :class="{'active': item.id == checkId}">
          <span @click="getDate(item)">{{item.text}}</span>
        </div>
      </div>
    </div>
    <div class="listBox" >
      <div class="list2"  v-for="(item, index) in groupListData" :key="index" @click="groupDetail(item)">
        <!--列表top-->
        <div class="listTitle">
          <!--列表top左-->
          <div class="topLeft" v-if="item.status === 1">
            剩余<span v-html="timeOutFn(item.timeOut)"></span>结束
          </div>
          <div class="topLeft" v-if="item.status === 2">
            <span class="groupBookingIcon"> <img src="../../assets/images/groupBooking/success@2x.png"/> </span> <span style="color: #60C940">拼团成功</span>
          </div>
          <div class="topLeft" v-if="item.status === 3">
              <span class="groupBookingIcon">
                <img src="../../assets/images/groupBooking/error@2x.png"/>
              </span>
            <span>拼团失败</span>
          </div>
          <!--列表top右-->
          <div class="topRight">
            <p>已获得拼团奖励 <span>{{item.arrivedBonus}}</span> 元</p>
          </div>
        </div>
        <!--列表主体-->
        <div class="listCent">
          <!--拼团图片-->
          <div class="leftImg">
            <img :src="item.mainImage"/>
          </div>
          <!--拼商品标题 团长团员图片-->
          <div class="rightText">
            <div class="textTitle">{{item.goodsName}}</div>
            <!--团长团员图片-->
            <div class="textImg">
              <div class="imgBoxCmmander">
                <img :src="tz"/>
                <div>团长</div>
              </div>
              <div class="imgBox">
                <div class="list" v-for="(imgLi, index3) in item.imgList" :key="index3">
                  <img :src="imgLi.img"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--列表底部-->
        <div class="listBottom">
          <div class="botLeft">
            <p v-if="item.status === 1">还差<span>{{item.fewNum}}</span>人,赶快召集小伙伴拼团吧~</p>
            <p v-if="item.status === 2">恭喜,您已免费获得该商品!</p>
            <p v-if="item.status === 3">亲,继续加油哦~</p>
          </div>
          <div class="botRight">
            <div class="bot" v-if="item.status === 1" @click.stop="goInvite(item, $event)">邀请好友</div>
            <div class="bot" v-if="item.status === 2 || (item.status === 3 && item.resurrectionNum >= resurrectionNum)" @click.stop="goGroup(item, $event)">
              再次开团
            </div>
<!--            <div class="botErorr" v-if="item.status === 2 || (item.status === 3 && item.resurrectionNum > 4)" @click.stop="goGroup(item, $event)">再次开团</div> -->
            <div class="bot" v-if="item.status === 3 && item.resurrectionNum < resurrectionNum" @click.stop="groupDetail(item)">复活拼团</div>
          </div>
        </div>
      </div>
    </div>
    <!--排序-->
    <to-top class="topFixed" v-if="isNav"></to-top>
    <!--生成cancas图片-->
    <create-share-group-img :shareData="shareCon" ref="imageWrapper" v-model="showToast"></create-share-group-img>
    <!--邀请好友绑定邀请人的弹框-->
    <div class="bindInviter">
      <x-dialog v-model="maskShow" class="dialog-demo">
        <x-icon type="ios-close-outline" style="fill:#fff;top: -0.8rem;position: absolute;left: 50%;margin-left: -0.3rem;" @click="isInviter(3)"></x-icon>
        <div style="padding: 0.5rem;">
          <div class="bindTop">
            <div class="bind-l"><img :src="people"/></div>
            <div class="bind-r">您尚未绑定邀请人，需绑定后才能获得邀请奖励。是否绑定？</div>
          </div>
          <div class="bindBottom">
            <div class="bind-yes" @click="isInviter(1)">不绑定</div>
            <div class="bind-no" @click="isInviter(2)">立即绑定</div>
          </div>
        </div>
      </x-dialog>
    </div>
    <load-more tip="数据加载中" v-if="showLoading"></load-more>
  </div>
</template>
<script>
  import { LoadMore, XDialog, Loading } from 'vux'
  import groupFooter from '../../components/groupBooking/groupFooter'
  import createShareGroupImg from '../../components/groupBooking/createShareGroupImg'
  import html2canvas from 'html2canvas'
  import toTop from '../../components/groupBooking/goTop'
  import $ from 'jquery'
  export default {
    name: 'groupTrta',
    components: {
      createShareGroupImg,
      groupFooter,
      toTop,
      LoadMore,
      XDialog,
      Loading
    },
    data () {
      return {
        resurrectionNum: 3,          // 可以复活次数
        timer: '',                   //  定时器
        personalData: {},            // 绑定邀请人信息
        showToast: false,
        cathy: '',
        shareCon: {},                // 生成图片信息
        maskShow: false,
        back: require('../../assets/images/groupImg/back.png'),
        testing06: require('../../assets/images/groupBooking/testing_06.png'),
        people: require('../../assets/images/groupBooking/people.png'),
        jd: require('../../assets/images/groupImg/jd.png'), // 金牌代言人
        ypd: require('../../assets/images/groupImg/ypd.png'), // 银牌代言人
        ph: require('../../assets/images/groupImg/ph.png'), // 普通会员
        yd: require('../../assets/images/groupImg/yd.png'), // 一星代言人
        yt: require('../../assets/images/groupImg/yt.png'), // 一星团长
        erdai: require('../../assets/images/groupImg/2d.png'), // 二星代言人
        ertuan: require('../../assets/images/groupImg/2t.png'), // 二星团长
        sd: require('../../assets/images/groupImg/sd.png'), // 三星代言人
        st: require('../../assets/images/groupImg/st.png'), // 三星团长
        tz: require('../../assets/images/groupImg/tz.png'), // 团长
        tzmx: require('../../assets/images/groupImg/tzmx.png'), // 团长名下
        fmx: require('../../assets/images/groupImg/fmx.png'), // 非团长名下
        dfk: require('../../assets/images/groupImg/dfk.png'), // 待付款
        deft: require('../../assets/images/groupImg/deflt.png'), // 默认加号
        gd: require('../../assets/images/groupImg/gd.png'), // 更多
        isNav: false,
        checkId: 0, // 选中navId
        navList: [
          {text: '总发团数', id: 0},
          {text: '拼团中', id: 1},
          {text: '拼团成功', id: 2},
          {text: '拼团失败', id: 3}
        ],
        doningList: {},  // 平团中商品
        userData: [],   // 用户拼团信息的数据
        groupListData: [], // 总发团数的数据
        timeC: 0,             // 线上时间-本机时间 差
        start: 1,             // 分页 当前页面
        pageSize: 10,         // 分页 页面大小
        goodsGroupId: '',    // 分区id
        busy: '',            // 防止多次刷新接口
        domTop: 0,          // 导航栏出现高
        showLoading: false  // 接口请求数据刷新蔗层
      }
    },
    mounted: function () {
      this.getGroupCampList(this.checkId)
      this.getPersonalInfo()
      window.addEventListener('scroll', this.handleScroll)
      let bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
      if (bsbUserInfo && bsbUserInfo.token) {
        this.getGroupCampInfo()
      } else {
        localStorage.setItem('REDIRECT_URL', this.$route.fullPath)
        this.$router.push('/login')
      }
    },
    methods: {
      // 滚动条事件
      handleScroll () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        var domTop = document.getElementById('topBox').offsetHeight
//        console.log(document.getElementById('topBox'), 'domTop')
        this.domTop = domTop
        // 按钮漂浮
        if (scrollTop >= domTop) {
          this.isNav = true
        } else {
          this.isNav = false
        }
      },
      // 分页
      loadMore () {
        this.busy = true // 加载状态
        if (!this.showLoading) {
          this.showLoading = true
          if (parseInt(this.start) > parseInt(this.totalPage)) {
            this.showLoading = false
            return
          }
        }
        // console.log('分頁')
        this.start = this.start + 1 // 当前页数
        this.getGroupCampList() // 分页数据
      },
      /**
       * nav切换
       */
      getDate (v) {
        this.checkId = v.id
        // clearInterval(this.timer)
        console.log(this.domTop)
        scrollTo(this.domTop, this.domTop)
        this.start = 1
        this.groupListData = []
        this.getGroupCampList(this.checkId)
      },
      /**
       * 邀请好友
       */
      goInvite (item, e) {
        this.cathy = item
        e.preventDefault()
        if (!this.personalData.beInvitationCode) {
          this.maskShow = true
        } else {
          let v = this.cathy
          // console.log(v)
          this.toImage(v)
        }
      },
      /**
       * 关闭邀请人弹框
       */
      isInviter (n) {
        let v = this.cathy
        // console.log(v)
        if (n === 1) {
          this.maskShow = false
          this.toImage(v)
        }
        if (n === 2) {
          this.$router.push({name: 'bindInviter'})
        }
        if (n === 3) {
          this.maskShow = false
        }
      },
      /**
       * 再次开团是否灰色
       */
      groupDoing (v) {
        this.$http.get(`${this.api.etSuperGroupingGoodsId}`, {
          params: {goodsId: 0}
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            var doning = {}
            for (let i in resData.data) {
              doning[resData.data[i]] = 1
            }
            console.log(doning)
            this.doningList = doning
          }
        })
      },
      /**
       * 继续开团
       */
      goGroup (v, e, stop) {
        e.preventDefault()
        if (stop) return
        this.$router.push({path: '/goodDetail', query: {goodsId: v.goodsId, pageType: 12}})
      },
      /**
       * 拼团详情
       */
      groupDetail (v) {
        this.$router.push({path: '/groupDoing', query: {superGroupId: v.superGroupId}})
      },
      /**
       * 团营信息
       * */
      getGroupCampInfo () {
        this.$http.get(`${this.api.getGroupCampInfo}`, {}).then((res) => {
          if (res.data.status === '1') {
            this.userData = res.data.data
            // console.log(this.userData)
          }
        })
      },
      /**
       * 团营列表
       * */
      getGroupCampList (v) {
        // console.log(v) ${this.api.getGroupCampList}
        this.$vux.loading.show({
          text: '数据加载中...'
        })
        this.$http.post(`${this.api.getGroupCampList}`, {
          status: this.checkId, // 0：总发团数、1：拼团中、2：拼团成功、3：拼团失败
          start: this.start,
          pageSize: this.pageSize
        }).then((res) => {
          this.busy = false // 重置busy状态
          this.showLoading = false
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          if (res.data.status === '1') {
            let list = res.data.data.list || []
            this.$vux.loading.hide()
            // console.log(this.groupListData)
            list.forEach((item, index) => {
              // console.log(item, index)
              this.$set(item, 'timeOut', '')
              let time = item.endTime - item.systemTime  // 开始时间与结束时间的时间差
              if (time) {
                this.$set(item, 'timeOut', time)
              }
              if (index === 0) {
                this.timeC = item.systemTime - new Date().getTime()
              }
              // console.log(time)
              // 解析拼团人员列表
              let list = []
              let lenght = (item.groupNum - 1 > 5) ? 5 : (item.groupNum - 1)
              for (let i = 0; i < lenght; i++) {
                let itm = {
                  img: !item.superGroupDeailList[i] ? this.deft : (item.superGroupDeailList[i].ifPay === 0) ? this.dfk : (item.superGroupDeailList[i].ifAccounted === 1) ? this.tzmx : this.fmx
                }
                if ((item.groupNum - 1) > 5 && (i === (lenght - 1))) {
                  itm.img = this.gd
                }
                list.push(itm)
              }
              this.$set(item, 'imgList', list)
            })
            // 处理分页
            this.noData = res.data.data.list.length > 0 ? !!false : !!true
//            拼接数据
            this.groupListData = this.groupListData.concat(list)
            this.totalPage = Math.ceil(res.data.data.total / res.data.data.pageSize)
            this.timeOutFnRefresh()
          }
        })
      },
      /****
       * 定时刷新列表定时器
       * ****/
      timeOutFnRefresh () {
        // console.log('执行')
        if (this.timer) {
          return
        }
        this.timer = setInterval(() => {
          var time = this.timeC + new Date().getTime()
          for (let i in this.groupListData) {
            if (this.groupListData[i].timeOut > 0) {
              this.groupListData[i].timeOut = this.groupListData[i].endTime - time
              if (this.groupListData[i].timeOut <= 0) {
//                刷新接口
                this.start = 1
                this.groupListData = []
                this.getGroupCampList(this.checkId)
                return false
              }
            }
          }
        }, 1000)
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
      getBase64Image (img) {
        var canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        var ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        var dataURL = canvas.toDataURL()
        console.log(dataURL)
        return dataURL
      },
      getCanvasBase64 (img, fn) {
        var image = new Image()
        // 至关重要 解决跨域问题
        image.crossOrigin = ''
        image.src = img
        // 至关重要
        var deferred = $.Deferred()
        if (img) {
          image.onload = function (res) {
            deferred.resolve(this.getBase64Image(image)) // 将base64传给done上传处理
          }
          return deferred.promise()
        }
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
        // console.log(v)
        this.$vux.loading.show({
          text: '图片生成中...'
        })
        let shopId = this.$route.query.shopId ? this.$route.query.shopId : localStorage.getItem('shopId') ? localStorage.getItem('shopId') : 1
        let codeUrl = window.location.href.match(/.*mshop/gi)[0] + '/groupAdd?superGroupId=' + v.superGroupId + '&shareInvitationCode=' + this.personalData.invitationCode + '&fromType=1&shopId=' + shopId
        this.shareCon = v
        // console.log(this.shareCon)
        this.shareCon.codeUrl = codeUrl
        this.shareCon.alertTpye = 'group'
        if (v.mainImage && v.mainImage.match(/http/gi) && v.mainImage.indexOf('data:image') === -1) {
          this.getImageBase64ByUrl(v.mainImage, (res) => {
            console.log(res, 'res')
            this.shareCon.mainImage = 'data:image/png;base64,' + res.data.data
            this.createImg()
          })
          // this.getCanvasBase64(v.mainImage).then((base64) => { console.log('方式二》》》》》》》》》', base64) })
        } else {
          this.createImg()
        }
      }
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)   // 离开页面清除（移除）滚轮滚动事件
    },
    beforeDestroy () {
      // 清除定时器
      clearInterval(this.timer)
    }
  }
</script>
<style scoped lang=less>
  .main{
    min-height: 140vh;
    background: #f1f2f5;
  }

  .trta-height{
    width: 100vh - .4rem;
    max-width: 7.1rem;
    margin: 0 0.2rem;
    height: 1.7rem;
    background: #ffffff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    top: -0.1rem;
    .trta-i{
      text-align: center;
      div{
        &:nth-of-type(1) {
          font-size: 0.4rem;
          color: #666666;
        }
        &:nth-of-type(2) {
          font-size: 0.24rem;
          color: #999999;
        }
      }
    }
    .trta-line{
      width: 1px;
      height: 0.4rem;
      background: #999999;
    }
  }
  /*头部数据统计*/
  .trta-headData{
    margin: auto;
    position: relative;
    width: 100%;
    max-width: 7.5rem;
    height: 3.3rem;
    top:0;
    z-index: 11;
    content: '';
    background: #ffffff;
    border-bottom-left-radius: 8.6rem .5rem;
    border-bottom-right-radius: 8.6rem .5rem;
    img{
      width: 100%;
      max-width: 7.5rem;
      height: 3.3rem;
      position: absolute;
      left: 0;
      top: 0;
    }
    .home_img{
      width: 1.36rem;
      height: 1.18rem;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      position: absolute;
      left: 3.2rem;
      top: 0.2rem;
      img{
        width: 1.36rem;
        height: 1.18rem;
        display: inline-block;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
      }
    }
    .uuInfo{
      width: 100vh - .4rem;
      max-width: 7.1rem;
      height: 1.4rem;
      position: absolute;
      bottom: 0.1rem;
      left: 0.2rem;
      display: flex;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .moneyInfo{
        text-align: center;
        color: #fff;
        div{
          &:nth-of-type(1) {
            font-size: 0.48rem;
            font-weight: 600;
            height: 0.39rem;
            line-height: 0.39rem;
          }
          &:nth-of-type(2) {
            font-size: 0.24rem;
            height: 0.35rem;
            line-height: 0.35rem;
            margin-top: 0.16rem;
          }
        }
      }
      .white-line{
        width: 1px;
        height: 0.48rem;
        background: #fff;
      }
    }
    .home_top_cent{
      width: 100vh - .4rem;
      max-width: 7.1rem;
      height: 2.9rem;
      position: absolute;
      left: 50%;
      bottom: -1.5rem;
      margin-left: -3.6rem;
      background: rgb(250,250,250);
      border-radius:4px;
      .home_title{
        width: 100%;
        height: 1.4rem;
        border-bottom-left-radius:  8.6rem .4rem;
        border-bottom-right-radius:  8.6rem .4rem;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        /*background:linear-gradient(left,#d4b172,#f0d49f);*/
        display: flex;
        flex-direction: row;
        justify-content: center;
        box-sizing: border-box;
        .item{
          width: 3rem;
          text-align: center;
          font-size: .24rem;
          color: #f5ead6;
          p{
            line-height: .6rem;
            font-size: .28rem;
            padding-top: .2rem;
            font-weight: bold;
          }
        }
        .solid{
          line-height: 1.4rem;
          color: #f5ead6;
          font-size: .3rem;
          width: .5rem;
          text-align: center;
        }
        .leftBorder{
          border-right: 1px solid #e1e1e1;
        }
      }

      .homeNav{
        width: 100%;
        height: 1.4rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        box-sizing: border-box;

        .item{
          width: 1.45rem;
          text-align: center;
          font-size: .24rem;
          color: #999;
          p{
            line-height: .6rem;
            font-size: .28rem;
            padding-top: .2rem;
            font-weight: bold;
            color: #666666;
          }
        }
        .solid{
          line-height: 1.4rem;
          color: #e0e0e0;
          font-size: .3rem;
          width: .3rem;
          text-align: center;
        }
      }
    }
  }
  /*nav 导航*/
  .navBox{
    height: .79rem;
    width: 100%;
    max-width: 7.5rem;
    margin-bottom: .2rem;
    margin-top: .2rem;
    .nav{
      display: flex;
      flex-direction: row;
      width: 100%;
      height: .79rem;
      background: white;
      line-height: .79rem;
      color: #999999;
      .item{
        flex: 1;
        text-align: center;
      }

      .active{
        color: #F82828;

        span{
          border-bottom: 2px solid #F82828;
          padding-bottom: .2rem;
        }
      }
    }

    .fixed{
      position: fixed;
      top: 0px;
      left: 0px;
      box-shadow: 0px 4px 15px #999;
      z-index: 5000;
    }
  }
  /*列表*/
  .listBox{
    margin: auto;
    padding-bottom: .4rem;
    width: 100%;
    /*列表*/
    .list2{
      width: 100vh - .4rem;
      max-width: 7.1rem;
      margin: auto;
      margin-bottom: .2rem;
      height: 4.3rem;
      box-sizing: border-box;
      background: white;
      border-radius: 4px;
      padding: .2rem;

      /*列表top*/
      .listTitle{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: .24rem;
        height: .44rem;
        line-height: .44rem;

        .groupBookingIcon{
          width: .24rem;
          height: .24rem;
          line-height: .24rem;
          img{
            width: .24rem;
            height: .24rem;
          }
        }
        .topLeft{
          /*flex: 1;*/
          color: #f82828;
          text-align: left;
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
        .topRight{
          flex: 1;
          color: #666666;
          text-align: right;
          span{
            color: #f82828;
          }
        }
      }
      /*列表主体*/
      .listCent{
        margin-top: .2rem;
        border-top: 1px solid #ebebeb;
        border-bottom: 1px solid #ebebeb;
        box-sizing: border-box;
        padding:.2rem .0rem;
        height: 2.6rem;
        display: flex;
        flex-direction: row;
        /*<!--拼团图片-->*/
        .leftImg{
          width: 2.2rem;
          height: 2.2rem;
          margin-right: .2rem;
          img{
            max-width: 2.2rem;
            min-height: 2.2rem;
          }
        }
        .rightText{
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .textTitle{
            max-width: 4.25rem;
            max-height: .7rem;
            overflow: hidden;
            font-size: .28rem;
          }
          .textImg{
            width: 100%;
            display: flex;
            flex-direction: row;
            .imgBoxCmmander{
              width: .78rem;
              height: .77rem;
              margin-right: .1rem;
              img{
                width: .6rem;
                height: .6rem;
                margin: 0 0.09rem;
              }
              div{
                height: 0.28rem;
                /*line-height: 0.28rem;*/
                text-align: center;
                font-size: 0.2rem;
                background: #F82828;
                color: #fff;
                -webkit-border-radius: 0.2rem;
                -moz-border-radius: 0.2rem;
                border-radius: 0.2rem;
                position: relative;
                top: -0.2rem;
              }
            }
            .imgBox{
              display: flex;
              flex-direction: row;
              max-width: 3.36rem;
              .list{
                width: .6rem;
                height: .6rem;
                margin-right: .1rem;
              }
              img{
                width: .6rem;
                height: .6rem;
              }
            }
          }
        }
      }
      /*列表底部*/
      .listBottom{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-top: .15rem;
        .botLeft{
          color: #999999;
          font-size: .28rem;
          text-align: left;
          line-height: .55rem;

          span{
            color: #f82828;
          }
        }

        .botRight{
          width: 1.85rem;
          height: .55rem;
          line-height: .55rem;
          font-size: .28rem;
          .bot{
            background: #f82828;
            border-radius: 6px;
            text-align: center;
            color: white;
          }
          .botErorr{
            background: #999;
            border-radius: 6px;
            text-align: center;
            color: white;
          }
        }
      }
    }
  }
  .topFixed{
    position: fixed;
    right: 0;
    bottom: 3.54rem;
  }
</style>
<style lang="less">
  .topLeft{
    .count-b{
      background: #fff;
      padding: 0.045rem 0.07rem;
      -webkit-border-radius: 0.1rem;
      -moz-border-radius: 0.1rem;
      border-radius: 0.1rem;
      margin: 0 0.07rem;
      font-size: 0.24rem;
      border: 1px solid #F82828;
    }
    .count-a{
      font-size: 0.24rem;
    }
  }
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
