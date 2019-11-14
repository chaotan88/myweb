<template>
    <div class="spliceSuccess-wap">
      <section class="banner">
         <div class="imgBox">
           <img :src="detail.mainImage"/>
         </div>
         <div class="preferential">
           <p class="title">限时拼团</p>
           <p class="cop">立省{{detail.pa}}%</p>
         </div>
         <div class="moneyBox">
           <p class="money">¥ {{detail.goodsPrice}}</p>
           <p class="moneNew"> <span class="unit">¥</span> <span>{{detail.goodsGroupPrice}}</span></p>
         </div>
       </section>
      <section class="add">
        <div class="bot" @click="share(detail)">
          <p > <span>邀请好友拼单</span><span class="time" style="margin-right: .1rem;margin-left: .1rem" v-show="detail.D">{{detail.D ? detail.D + '天' : ''}} </span> <span class="time">{{detail.H}} </span> : <span class="time"> {{detail.T}}</span> : <span class="time"> {{detail.S}}</span> <span>后结束</span> </p>
        </div>
        <p class="cop">分享到三个群后，拼成率高达98%</p>
      </section>
      <section class="order">
        <div class="orderChart">
          <div class="list">
            <div class="listName">商品名称</div>
            <div class="listText" style="text-align: right" @click="goChart('goodDetail')">{{detail.goodsName}}</div>
            <div class="listIcon">
              <x-icon type="ios-arrow-right" size="25"></x-icon>
            </div>
          </div>
          <div class="list">
            <div class="listName">拼单时间</div>
            <!--<span class="hours"> 15:00:48 </span>-->
            <div class="time"><span class="date">{{detail.times}}</span>    </div>
          </div>
          <div class="list" style="margin-bottom: .15rem">
            <div class="listName" style="padding-top: .3rem">拼单须知</div>
            <div class="listRuler">
              <div class="listImgBox">
                <img src="../../assets/images/spliceOder/list.png" height="46" width="444"/>
              </div>
              <div class="Setup">
                <div>
                  好友拼单
                </div>
                <div>
                  人满发货
                </div>
                <div>
                  人不满退货
                </div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="listChart" @click="goChart('orderDetail',detail.orderId)"> 详情 </div>
            <div class="listIcon">
              <x-icon type="ios-arrow-right" size="25"></x-icon>
            </div>
          </div>
          <div class="list">
            <div class="bot" @click="goChart('orderList')">
              进入我的订单列表
            </div>
          </div>
        </div>
      </section>
      <!--分享弹框-->
      <x-dialog v-model="showShare" class="dialog-demo" id="dialog-demo">
        <!--<div class="guideShare">-->
          <!--<img :src="shareTips" />-->
        <!--</div>-->
        <div  class="sharImgBox" >
          <!--分享l类容-->
          <div id="sharImg" style="padding-bottom: .1rem;padding-top: .1rem">
            <section class="banner">
              <div class="imgBox">
                <img :src="detail.activityImage"/>
              </div>
              <div class="preferential">
                <p class="title">限时拼团</p>
                <p class="cop">立省{{detail.pa}}%</p>
              </div>
              <div class="moneyBox">
                <p class="money">¥ {{detail.goodsPrice}}</p>
                <p class="moneNew"> <span class="unit">¥</span> <span>{{detail.goodsGroupPrice}}</span></p>
              </div>
            </section>
            <section class="textCent">
              <div class="qrCode">
                <qrcode :value="qrCode" type="img" :size="size"></qrcode>
              </div>
              <div class="textCop">
                <p>{{detail.goodsName}}</p>
                <p class="spliceText"> 拼团立减 <span class="red">{{detail.goodsPrice - detail.goodsGroupPrice}}</span> 元</p>
              </div>
            </section>
          </div>
          <!--分享展示-->
          <div class="sharImg">
            <img :src="imgUrl" />
          </div>
        </div>
        <div class="close" @click="close()">
          <span class="vux-close">
            x
          </span>
        </div>
        <div class="sharePop-tip">
          <img src="../../assets/images/action/share-jianotu.png">
          <p>长按上图保存图片，或发送给朋友</p>
        </div>
      </x-dialog>
    </div>
</template>
<style lang="less">
  .spliceSuccess-wap{
    .dialog-demo{
      .weui-dialog{
        max-width: 90%;
        width: 90%;
        overflow: visible;
        box-sizing: border-box;
        padding: .2rem .1rem .2rem .1rem;
      }
    }
  }
</style>

<script>
  import { XDialog, Qrcode } from 'vux'
  import shareTips from '../../assets/images/share-tips.png'
  import html2canvas from 'html2canvas'
  export default {
    components: {
      XDialog,
      Qrcode
    },

    data () {
      return {
        imgUrl: '',
        showShare: false,          // 分享弹框
        param: {                   //  拼团详情参数
          orderNo: ''              //  订单id
        },
        goodsId: '',               // 拼团商品id
        themeId: '',               // 活动id
        groupId: '',               // 拼团id
        detail: {},                // 拼团详情
        shareTips: shareTips,      // 分享指引
        qrCode: '',
        size: 95
      }
    },

    created () {
      this.param = {
        orderNo: this.$route.query.orderNo
      }
      var lur = window.location.href
      this.qrCode = lur.replace('spliceSuccess', 'participate')
      console.log(this.qrCode)
    },

    mounted () {
      var from = this.$route.query.from || ''
      let shar = localStorage.getItem('isShar') || ''
      // 查看是否分享 如果是分享页面直接跳到参与详情
      if (from === 'web') {
        // 如果是点击要请好友按钮 页面地址变换的情况留在本页面
        if (shar === 'group') {
          this.showShare = true
        } else {
        // 浏览器直接进入 并带了分享表示 from = web  直接跳到参与详情
          localStorage.removeItem('isShar')  // 删除邀请按钮点击表示
          this.$router.push({name: 'participate', query: {orderNo: this.$route.query.orderNo}})
        }
      } else {
        // 不是分享进入盖页面 并且没有点击邀请好友按钮
        if (shar === 'group') {
          // 界面重置
          this.showShare = false
          localStorage.removeItem('isShar')
        }
      }
      this.getGroupJoin()
    },

    methods: {
      getGroupJoin () {
        this.$http.get(`${this.api.getGroupJoin}`, {
          params: this.param
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            var resD = resData.data
            var time = resD.endTime - resD.currentTime
            var timeD = this.timeOutFn(time)
            this.goodsId = resD.goodsId || ''
            this.themeId = resD.themeId || ''
            this.groupId = resD.groupId || ''
            var times = this.timeFn(resD.orderTime)
            //       (   销售价格     减     拼团价格    )   除以     销售价格   成 100%
            var pa = (resD.goodsPrice - resD.goodsGroupPrice) / resD.goodsPrice * 100
            console.log(pa, 'pa')
            var dat = {
              goodsId: resD.goodsId,                   // 商品id
              goodsName: resD.goodsName,               // 商品名称
              goodsPrice: resD.goodsPrice,             // 商品价格
              goodsGroupPrice: resD.goodsGroupPrice,   // 拼团价格
              activityImage: resD.activityImage,       // 图片
              mainImage: resD.mainImage,
              groupNum: resD.groupNum,                 // 开团人数
              countNum: resD.countNum,                 // 拼团件数
              fewNum: resD.fewNum,                     // 剩余人数
              endTime: resD.endTime,                   // 结束时间
              currentTime: resD.currentTime,           // 服务器当前时间
              time: time,                              // 剩余时间戳
              D: timeD.D,                              // 剩余天
              H: timeD.H,                              // 剩余小时
              T: timeD.T,                              // 剩余分钟
              S: timeD.S,                              // 剩余秒
              times: times,                             // 订单时间
              pa: parseInt(pa),
              orderId: resD.orderId
            }
            this.detail = dat
            this.timeO()
          }
        })
      },
      /**
       * 倒计时
       */
      timeOutFn (time) {
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
      /**
       * 界面统一执行定时器
       */
      timeO () {
        this.timer = setInterval(() => {
          if (this.detail.time <= 0) {
            this.detail.time = 0
          } else {
            this.detail.time = this.detail.time - 1000
          }
          var timeB = this.timeOutFn(this.detail.time)
          this.detail.D = timeB.D
          this.detail.T = timeB.T
          this.detail.H = timeB.H
          this.detail.S = timeB.S
        }, 1000)
      },
      /**
       * 时间戳解析
       */
      timeFn (time) {
        var Time = new Date(time)
        console.log(time)
        var data = {
          Y: Time.getFullYear(),
          M: Time.getMonth() + 1,
          D: Time.getDate(),
          H: Time.getHours(),
          T: Time.getMinutes(),
          S: Time.getSeconds()
        }
        console.log(Time)
        var list = Object.keys(data)
        console.log(list)
        if (data.H < 10) {
          data.H = '0' + data.H
        }
        if (data.T < 10) {
          data.T = '0' + data.T
        }
        if (data.S < 10) {
          data.S = '0' + data.S
        }
        if (data.M < 10) {
          data.M = '0' + data.M
        }
        if (data.D < 10) {
          data.D = '0' + data.D
        }
        return data.Y + '/' + data.M + '/' + data.D + ' ' + data.H + ':' + data.T + ':' + data.S
      },
      /**
       * 分享按钮
       */
      share (v) {
        // 标记点击邀请好友
//        localStorage.setItem('isShar', 'group')
//        // 分享链接地址变化 地址加入 from = web标示
//        this.$router.push({name: 'spliceSuccess', query: {orderNo: this.$route.query.orderNo, from: 'web'}})
        this.showShare = true
        if (v.activityImage && v.activityImage.match(/http/gi) && v.activityImage.indexOf('data:image') === -1) {
          this.getImageBase64ByUrl(v.activityImage, (res) => {
            this.detail.activityImage = 'data:image/png;base64,' + res.data.data
            this.createImg()
          })
        } else {
          this.createImg()
        }

        console.log(this.detail)
      },
      /**
       * 分享关闭
       */
      close () {
//        // 删除邀请标示
//        localStorage.removeItem('isShar')
//        // 还原地址
//        this.$router.push({name: 'spliceSuccess', query: {orderNo: this.$route.query.orderNo}})
        this.showShare = false
      },
      /**
       * 生成二维码
       */
      useqrcode () {

//        var canvas = document.getElementById('qrCode')
//        QRCode.toCanvas(canvas, 'http://www.baidu.com', function (error) {
//          if (error) console.error(error)
//          console.log('success!')
//        })
      },
      /**
       * 路由跳转
       */
      goChart (name, id) {
        if (name === 'orderList') {
          localStorage.setItem('goOrderState', 10)
          this.$router.push({name: name})
        }
        if (name === 'orderDetail') {
          this.$router.push({name: name, query: {orderId: id}})
        }
        if (name === 'goodDetail') {
          this.$router.push({name: name, query: {goodsId: this.goodsId, themeId: this.themeId}})
        }
      },
      /**
       * 解析路径
       */
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
       * 生成图片
       */
      createImg () {
        setTimeout(() => {
          var dom = document.getElementById('sharImg')
          html2canvas(dom, {
            backgroundColor: '#fff',
            logging: false
          }).then((canvas) => {
            let dataURL = canvas.toDataURL('image/png')
            this.imgUrl = dataURL
          })
        }, 600)
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
      }
    },

    beforeDestroy () {
      // 清除定时器
      clearInterval(this.timer)
    }
  }
</script>

<style lang="less" scoped>
  .spliceSuccess-wap{
     padding-top: .4rem;
    .banner{
      width: 7.15rem;
      height: 4.44rem;
      margin: auto;
      box-sizing: border-box;
      padding: .2rem .2rem .2rem .2rem;
      border: 1px solid #fdf1f2;
      box-shadow: 0 0 10px #fdf1f2;
      border-radius: 6px;
      position: relative;

      .imgBox{
        width: 3.77rem;
        height: 3.77rem;
        overflow: hidden;
        img{
          width: 3.77rem;
          height: auto;
        }
      }

      .preferential{
        width: 2.01rem;
        height: 1.68rem;
        position: absolute;
        right: .4rem;
        top: 0rem;
        background: #fee6e9;
        border-radius: 0rem 0rem 1rem 1rem;
        text-align: center;

        .title{
          padding-top: .3rem;
          font-size: .32rem;
          color: #f12a3c;
          font-weight: bold;
        }

        .cop{
          font-size: .32rem;
          color: #f12a3c;
        }
      }

      .moneyBox{
        position: absolute;
        width: 2.01rem;
        right: .4rem;
        bottom: .4rem;

        .money{
          font-size: .32rem;
          color: #666666;
          text-decoration: line-through;
          text-align: center;
        }

        .moneNew{
          font-size: .4rem;
          color: #ed3842;
          text-align: center;
          font-weight: bolder;
          .unit{
            font-weight: normal;
            font-size: .32rem;
          }
        }
      }
    }

    .add{
      padding: .4rem .2rem .2rem .2rem;

      .bot{
        width: 6.3rem;
        height: .9rem;
        background: #ff0000;
        border-radius: .45rem;
        color: white;
        text-align: center;
        line-height: .9rem;
        margin: auto;

        .time{
          padding: 2px 2px 2px 2px;
          background-color: white;
          color: #ff0000;
          font-size: .24rem;
          font-weight: bolder;
          border-radius: 4px;
        }
      }

      .cop{
        width: 100%;
        text-align: center;
        color: #333333;
        font-size: .24rem;
        padding-top: .2rem;
      }
    }

    .order{
      width: 100%;
      background: #f4f4f4;
      padding-top: .2rem;

      .orderChart{
        width: 100%;
        .list{
          display: flex;
          flex-direction: row;
          position: relative;
          background: white;
          line-height: .5rem;
          justify-content: space-between;
          padding: .2rem .15rem .2rem 0rem;
          margin-bottom: .05rem;

          .listName{
            color: #999999;
            width: 1.4rem;
            height: .5rem;
            text-align: center;
          }

          .listText{
            width: 5.35rem;
            height: .5rem;
            overflow: hidden;
          }

          .listIcon{
            line-height: .5rem;
          }

          .listChart{
            text-align: right;
            width: 6.89rem;
          }

          .listRuler{
            display: flex;
            width: 4.44rem;
            flex-direction: column;

            img{
              width: 4.44rem;
              height: auto;
            }

            .Setup{
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              font-size: .24rem;
              color: #999999;
            }
          }
        }

        .bot{
          width:6.4rem ;
          height: .8rem;
          margin: auto;
          text-align: center;
          border-radius: .4rem;
          border: 1px solid #999999;
          color: #666666;
          line-height: .8rem;
          font-size: .28rem;
          margin-top: .4rem;
          margin-bottom: .4rem;
        }
      }
    }

    .dialog-demo{
      padding-bottom: .2rem;
      .guideShare{
        position: fixed;
        width: 100%;
        height: 4rem;
        top: 0px;
        right: 0px;
        img{
          position: absolute;
          right: 0rem;
          top: 0rem;
          width: 3.4rem;
          height: 2.4rem;
          margin: auto;
        }
      }
      .banner{
        width: 6.11rem;
        height: 4.2rem;

        .preferential{
          right: .2rem;
        }

        .moneyBox{
          right: .2rem;
        }
        .imgBox{
          width: 3.55rem;
          height: 3.77rem;
          overflow: hidden;
          img{
            width: 3.55rem;
            height: auto;
          }
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

      .textCent{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: .3rem;
        padding-right: 0rem;
        .qrCode{
          width: 95px;
          height: 95px;
          margin-left: .1rem;
          background: #999999;
          box-sizing: border-box;
          margin-left: .3rem;
          img{
            width: 1.73rem;
            height: 1.73rem;
          }
        }

        .textCop{
          width: 4.1rem;
          text-align: left;
          font-size: .28rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .spliceText{
            font-size: .24rem;
            color: #999999;
          }

          .red{
            color: #ed3842;
          }
        }
      }

      .sharImgBox{
        width: 6.5rem;
        position: relative;
      }
      .sharImg{
        position: absolute;
        left: 0px;
        top: 0px;
        background: #ffffff;
        img{
          width: 100%;
          height: auto;
        }
      }

      .sharePop-tip{
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
        right: -.1rem;
        bottom: -0.8rem;
        img{
          width: .4rem;
          height: .36rem;
          margin-right: .2rem;
          margin-top: -.2rem;
        }
        p{
          font-size: .24rem;
          color: #fff;
        }
      }
    }
  }
</style>
