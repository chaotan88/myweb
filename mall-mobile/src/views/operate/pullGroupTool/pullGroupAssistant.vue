<template>
  <div class="pullGroupAssistant-wrap">
    <!-- 分享海报内容 -->
    <div id="posterConWrap" class="posterConWrap" v-if="groupList.length > 0">
      <img :src="selectedPoster" class="img-poster">
      <qrcode :value="shareSingCode" type="img" class="img-qrcode"></qrcode>
    </div>
    <div class="wrap-con">
      <template v-if="groupList.length > 0">
        <!-- 分享选项 -->
        <div class="share" :class="backgrundGradientClass[activeIndex = activeIndex < 3 ? activeIndex : activeIndex % 3]"> 
          <swipers :options="groupSwiperOption" class="share-option">
            <swiper-slides v-for="(item,index) in groupList" class="share-slide" :key="index">
              <div class="slide-con">

                <svg class="icon addGroup" aria-hidden="true" @click="$router.push('/pullGroupTool/addGroupCard')">
                  <use xlink:href="#icon-zengjia"></use>
                </svg>

                <div class="con-tag">
                  <span>{{item.groupName}}</span>
                </div>
                 
                <h2 v-if="item.timeDifference <= 7">该二维码七天内({{item.endDate}}前)有效</h2>
                <h2 v-else>二维码失效, <span @click="$router.push({path:'/pullGroupTool/addGroupCard', query: {pageType: 'edit', id: item.id}})">前往替换</span>
                </h2>
   
                <div class="con-code" @click="isShowPop = true, groupMsg = {id: item.id, index: index}">
                  <div class="code-img">
                    <div class="img-mask" v-if="item.timeDifference > 7"></div>
                    <div class="img-img">
                      <qrcode :value="item.qrcodeImage" type="img"></qrcode>
                    </div>
                  </div>
                  <p class="con-code-edit">【点击编辑或删除】</p>
                </div>

                <div class="con-img">
                  <img src="../../../assets/images/operate/share-img2.png" v-if="(index+1) % 2 == 0">
                  <img src="../../../assets/images/operate/share-img1.png" v-else>
                </div>

                <div class="con-btn" :class="backgrundGradientClass[index = index < 3 ? index : index % 3]" @click="item.timeDifference <= 7 ? immediateShare(item.qrcodeImage) : $router.push({path:'/pullGroupTool/addGroupCard', query: {pageType: 'edit', id: item.id}})">
                  {{item.timeDifference <= 7 ? '立即分享' : '替换二维码'}}
                </div>

                <div class="con-corebean">{{item.groupExplain}}</div>

              </div>
            </swiper-slides>
          </swipers>
        </div>
        <!-- 二维码长按弹窗 -->
        <div class="qr-code-pop" v-if="isShowPop">
          <div class="pop-mask" @click="isShowPop = false"></div>
          <ul>
            <li class="edit" @click="$router.push({path: '/pullGroupTool/addGroupCard', query: {pageType: 'edit', id: groupMsg.id}})">编辑</li>
            <li class="delete" @click="delGroupCard">删除</li>
          </ul>
        </div>
        <!-- 选择海报 -->
        <div class="chose-poster-mask " :class="{'mask-show':showPosterSte}" @click="showPosterSte = false"></div>
        <div class="chose-poster" :class="{'showPot':showPosterSte}">
          <x-icon type="ios-close-outline" size="30" @click="showPosterSte = false" v-if="showPosterSte"></x-icon>
          <div class="poster-title">
            <img src="../../../assets/images/operate/poster-title.png">
          </div>
          <swipers :options="posterSwiperOption" class="poster-option">
            <swiper-slides v-for="(item,index) in posterList" class="poster-slide" :key="index">
              <div class="slide-con">
                <img :src="item.image" class="img-poster">
                <!-- <qrcode :value="shareSingCode" type="img" class="img-qrcode"></qrcode> -->
              </div>
            </swiper-slides>
          </swipers>
          <div class="poster-btn" @click="createImg">立即分享</div>
        </div>
        <!-- 生成海报弹窗 -->
        <div class="share-pop-img">
          <x-dialog v-model="showPoster" class="dialog-demo" :hide-on-blur="true" :dialog-style="{'max-width': '6.5rem', width: '100%', height: '50%', 'background-color': 'transparent'}">
            <img :src="createdPosterImg" class="main-img">
            <div class="sharePop-tip">
              <img src="../../../assets/images/action/share-jianotu.png">
              <p>长按上图保存图片，或发送给朋友</p>
            </div> 
          </x-dialog> 
        </div>
      </template>
      <!-- 助手功能 -->
      <div class="assistant">
        <div class="pullGroupAssistant-tit">
          <img src="../../../assets/images/operate/assistant-title.png">
          <span>助手功能说明</span>
          <img src="../../../assets/images/operate/assistant-title.png">
        </div>
        <ul>
          <li>1、<span></span>创建微信群名片</li> 
          <li>2、<span></span>群数据分析</li>
          <li>3、<span></span>裂变拉新</li>
          <li>4、<span></span>多活动一键分享</li>
          <li>5、<span></span>专享私人客服</li>
        </ul>
        <div class="pullGroupAssistant-btn" @click="createGroupCard" v-if="groupList.length <= 0">立即创建群名片</div>
        <div class="pullGroupAssistant-tip">更多功能等你来了解</div>
      </div>
      <!-- 活动推荐 -->
      <!-- <div class="activity-recom">
        <div class="pullGroupAssistant-tit">
          <img src="../../../assets/images/operate/assistant-title.png">
          <span>活动推荐</span>
          <img src="../../../assets/images/operate/assistant-title.png">
        </div>
        <ul>
          <li>
            <span>抽奖</span>
          </li>
          <li>
            <span>一元夺宝</span>
          </li>
          <li @click="$router.push('/sharePurchase')">
            <span>社群分享</span>
          </li>
        </ul>
      </div> -->
    </div>
  </div>
</template>
<script>
  import html2canvas from 'html2canvas'
  import { TransferDom, Popup, Confirm, Qrcode, XDialog } from 'vux'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import swipcss from 'swiper/dist/css/swiper.css'
  export default {
    directives: {
      TransferDom
    },
    components: {
      swipers: swiper,
      swiperSlides: swiperSlide,
      swipcss,
      Popup,
      TransferDom,
      Confirm,
      Qrcode,
      XDialog
    },
    data () {
      let swiperOption = {
        autoplay: false,
        autoplayDisableOnInteraction: false,
        slidesPerView: 'auto',
        initialSlide: 0,
        centeredSlides: true,
        watchSlidesProgress: true,
        onProgress: function (swiper) {
          for (var i = 0; i < swiper.slides.length; i++) {
            var slide = swiper.slides[i]
            var progress = slide.progress
            var es = slide.style
            es.opacity = 1 - Math.min(Math.abs(progress / 2), 1)
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0px, 0, ' + (-Math.abs(progress * 160)) + 'px)'
          }
        },
        onSetTransition: function (swiper, speed) {
          for (var i = 0; i < swiper.slides.length; i++) {
            var es = swiper.slides[i].style
            es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms'
          }
        }
      }
      return {
        posterIndex: 0,
        pageType: '',                                                 // 页面类型
        activeIndex: '',                                              // 群名片当前索引
        posetrActiveIndex: '',                                        // 海报选择当前索引
        groupList: [],                                                // 群名片列表
        posterList: [],                                               // 海报列表
        createdPosterImg: '',                                         // 生成的海报图片
        selectedPoster: '',                                           // 选择后的海报图片
        isShowPop: false,                                             // 是否显示编辑弹窗
        showPosterSte: false,                                         // 是否显示选择海报弹窗
        shareSingCode: '',                                            // 当前分享选项的二维码
        backgrundGradientClass: ['red', 'blure', 'lightRed'],         // 顔色切换数组
        groupSwiperOption: {
          ...swiperOption,
          onInit: (swiper) => {
            this.activeIndex = swiper.activeIndex
          },
          onTransitionEnd: (swiper) => {
            this.activeIndex = swiper.activeIndex
          }
        },                                                            // 群名片轮播配置
        posterSwiperOption: {
          ...swiperOption,
          onInit: (swiper) => {
            this.posetrActiveIndex = swiper.activeIndex
          },
          onTransitionEnd: (swiper) => {
            this.posetrActiveIndex = swiper.activeIndex
          }
        },                        // 海报轮播配置
        showPoster: false                                             // 生成海报弹窗
      }
    },
    mounted: function () {
      this.pageType = this.$route.query.pageType    // 页面类型pageType=ed 编辑或新增群名片页面跳转进来的
      this.getGroupPage()                         // 群名片列表
      this.getPosterPage()                        // 海报列表
    },
    methods: {
      /**
       * 获取当前日期后7天
      */
      getFutureDate (days, beginTime) {
        var myDate = null
        if (beginTime) {
          myDate = new Date(beginTime)  // 获取开始日期
        } else {
          myDate = new Date()           // 获取开始日期
        }
        var dateTemp = ''
        var dataArr = []
        for (var i = 0; i <= days; i++) {
          var Month = myDate.getMonth() + 1                // 月
          var day = myDate.getDate()                       // 日
          Month = Month < 10 ? '0' + Month : Month
          day = day < 10 ? '0' + day : day
          dateTemp = Month + '月' + day + '日'             // 整条数据
          dataArr.push(dateTemp)
          myDate.setDate(day + 1)                         // 设置日期
        }
        return dataArr.reverse()
      },
      /**
       * 海报列表
      */
      getPosterPage () {
        this.$http.post(this.api.getPosterPage, {
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            return false
          }
          this.posterList = resData.data
        })
      },
      /**
       * 群名片列表
      */
      getGroupPage () {
        this.$http.post(this.api.getGroupPage, {
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            return false
          }
          this.groupList = resData.data
          this.groupList.forEach((item) => {
            var time = ((new Date().getTime() - new Date(item.qrcodeTime).getTime()) / (1000 * 60 * 60 * 24))
            this.$set(item, 'timeDifference', time)                                                // 天数差
            this.$set(item, 'endDate', this.getFutureDate(7, item.qrcodeTime)[0])                  // 结束日期
          })
        })
      },
      /**
       * 立即分享
      */
      immediateShare (code) {
        this.checkLogin().then((res) => {
          this.shareSingCode = code
          if (this.posterList.length > 0) {
            this.showPosterSte = true
          } else {
            this.$vux.toast.text('请先上传海报')
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
            fileUrl: url
          }
        }).then((res) => {
          fun(res)
        })
      },
      /**
       * 生成图片
      */
      createImg (v) {
        this.$vux.loading.show({
          text: '海报生成中...'
        })
        this.getImageBase64ByUrl(this.posterList[this.posetrActiveIndex].image, (res) => {
          this.selectedPoster = 'data:image/png;base64,' + res.data.data
          html2canvas(document.getElementById('posterConWrap'), {
            backgroundColor: null,
            logging: false
          }).then((canvas) => {
            this.$vux.loading.hide()
            let dataURL = canvas.toDataURL('image/png')
            this.createdPosterImg = dataURL
            this.showPoster = true
          })
        })
      },
      /**
       * 创建群名片
      */
      createGroupCard () {
        this.checkLogin().then((res) => {
          this.$router.push('/pullGroupTool/addGroupCard')
        })
      },
      /**
       * 删除群名片
      */
      delGroupCard () {
        let that = this
        this.$vux.confirm.show({
          title: '提示',
          content: '确定删除群名片?',
          onConfirm () {
            that.$http.post(that.api.deleteGroup, {
              id: that.groupMsg.id
            }).then((res) => {
              let resData = res.data
              that.$vux.toast.text(resData.msg)
              if (parseInt(resData.status) !== parseInt(that.api.ERR_OK)) {
                return false
              }
              that.isShowPop = false
              that.groupList.splice(that.groupMsg.index, 1)
            })
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .pullGroupAssistant-wrap{
    .wrap-con{
      position: relative;
      z-index: 300;
      min-height: calc(100vh);
      background: #fff;
    }
    /* 分享 */
    .share{
      height: 8.35rem;
      // background: #f94d1a;
      padding-top: .57rem;
      transition: all 0.2s;
      &.red{
        background:linear-gradient(135deg, #fe2c18, #fd561b);
        transition: all 0.2s;
      }
      &.blure{
        background:linear-gradient(135deg, #2145fc, #2c7efa);
        transition: all 0.2s;
      }
      &.lightRed{
        background:linear-gradient(135deg, #fd5d05, #ff860d);
        transition: all 0.2s;
      }
      .share-option{
        height: 7.8rem;
        width:100%;	
        -webkit-perspective: 1200px;
        -moz-perspective: 1200px;
        -ms-perspective: 1200px;
        perspective: 1200px;
        .swiper-wrapper{
          -webkit-transform-style: preserve-3d;
          -moz-transform-style: preserve-3d;
          -ms-transform-style: preserve-3d;
          transform-style: preserve-3d;
          .share-slide{
            width: 6.7rem;
            .slide-con{
              width: 6rem;
              height: 100%;
              overflow: hidden;
              background: #fff;
              margin:0 auto;
              display:block;
              border-radius: 6px;
              position: relative;
              .addGroup{
                position: absolute;
                top: .12rem;
                right: .2rem;
                width: .36rem;
                height: .36rem;
                z-index: 300;
                fill: #fff;             
              }
              .con-tag{
                width: 100%;
                height: .61rem;
                background: -webkit-gradient(linear, left top, right top, from(#fbac4e), to(#edd611));
                background-size: 100% 100%;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                text-align: center;
                font-size: .26rem;
                color: #fff;
                span{
                  max-width: 75%;
                  margin: 0 auto;
                  display: block;
                  line-height: .61rem;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
              h2{
                font-size: .24rem;
                color: #333333;
                text-align: center;
                margin: .75rem 0 .3rem 0;
                display: block;
                span{
                  text-decoration: underline;
                }
              }
              .con-code{
                width: 2.47rem;
                height: auto;
                overflow: hidden;                
                margin: 0 auto;
                .code-img{
                  width: 100%;
                  height: 2.47rem;
                  position: relative;
                  .img-mask{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 300;
                    background: rgba(255,255,255,0.8)
                  }
                  .img-img{
                    width: 100%;
                    height: 100%;
                    img{
                      width: 100% !important;
                      height: 100% !important;
                      display: block;
                    }
                  }
                }
              }
              .con-code-edit{
                font-size: .24rem;
                color: #666666;
                margin-top: .1rem;
                text-align: center;
              }
              .con-img{
                width: 3.33rem;
                height: 1.8rem;              
                margin: 0 auto;
                margin-top: .25rem;
                margin-bottom: .25rem;
                img{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
              .con-btn{
                width: 4.1rem;
                height: .7rem;
                margin: 0 auto;
                font-size: .24rem;
                color: #fff;
                text-align: center;
                line-height: .65rem;
                &.red{
                  background: url('../../../assets/images/operate/assistant-btn.png') no-repeat;
                  background-size: 100% 100%;
                }
                &.blure{
                  background: url('../../../assets/images/operate/assistant-btn2.png') no-repeat;
                  background-size: 100% 100%;
                }
                &.lightRed{
                  background: url('../../../assets/images/operate/assistant-btn3.png') no-repeat;
                  background-size: 100% 100%;
                }
              }
              .con-corebean{
                font-size: .2rem;
                color: #666666;
                text-align: center;
                max-width: 85%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 0 auto;
                margin-top: .1rem;
              }
            }
          }
        }
      }
    }
    /* 二维码长按弹窗 */
    .qr-code-pop{
      transition: all .3s;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
      .pop-mask{
        width: 7.5rem;
        height: 100%;
        background: rgba(0,0,0,0.5);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 4000;
        transition: all .3s;
      }
      ul{
        position: relative;
        z-index: 4001;
        li{
          width: 3.13rem;
          height: .68rem;
          text-align: center;
          line-height: .68rem;
          border-radius: 35px;
          font-size: .28rem;
          margin-bottom: .3rem;
        }
        .edit{
          background: #ff5733;
          color: #fff;
        }
        .delete{
          background: #fff;
          color: #ff5733;
        }
      }
    }
    /* 分享海报内容 */
    .posterConWrap{
      width: 4.7rem;
      height: 6.5rem;
      background: #fff;
      // background: #224bfa;
      border-radius: 5px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 1;
      .img-poster{
        width: 100%;
        height: 100%;
        display: block;
        position: absolute;
        top:0;
        left: 0;
        border-radius: 6px;
      }
      .img-qrcode{
        width: 1.06rem;
        height: 1.06rem;
        display: block;
        position: absolute;
        bottom: .56rem;
        left: .4rem;
        z-index: 200;
        img{
          width: 100% !important;
          height: 100% !important;
          display: block;
        }
      }
      // &.red{
      //   background-image:linear-gradient(135deg, #fe2c18, #fd561b);
      // }
      // &.blure{
      //   background-image:linear-gradient(135deg, #2145fc, #2c7efa);
      // }
      // &.lightRed{
      //   background-image:linear-gradient(135deg, #fd5d05, #ff860d);
      // }
      // h2{
      //   text-align: center;
      //   font-size: .28rem;
      //   color: #fff;
      //   padding: .29rem 0 .17rem 0;
      // }
      // .posterConWrap-con{
      //   width: 4.1rem;
      //   height: 4.79rem;
      //   border-radius: 5px;
      //   margin: 0 auto;
        // .con-title{
        //   background: #ffffff;
        //   padding: .18rem .2rem .1rem .2rem;
        //   border-top-left-radius: 5px;
        //   border-top-right-radius: 5px;
        //   p{
        //     margin-bottom: .1rem;
        //   }
        //   p:nth-child(1){
        //     font-size: .24rem;
        //     color: #333333;
        //   }
        //   p:nth-child(2){
        //     font-size: .2rem;
        //     color: #999999;            
        //   }
        // }
        // .con-img{
        //   width: 100%;
        //   height: 4rem;
        //   position: relative;
        //   .img-poster{
        //     width: 100%;
        //     height: 100%;
        //     display: block;
        //     position: absolute;
        //     top:0;
        //     left: 0;
        //   }
        //   .img-qrcode{
        //     width: 1.06rem;
        //     height: 1.06rem;
        //     display: block;
        //     position: absolute;
        //     bottom: .1rem;
        //     left: .1rem;
        //     z-index: 200;
        //   }
        // }
        // .con-tip{
        //   text-align: center;
        //   font-size: .2rem;
        //   color: #fff;
        //   margin-top: .1rem;
        // }
    }
    /* 选择海报 */
    .chose-poster-mask{
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      tap-highlight-color: rgba(0,0,0,0);
      z-index: 300;
      transition: all .5s;
      &.mask-show{
        transition: all .5s;
        display: block;
      }
    }
    .chose-poster{
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 7.5rem;
      z-index: 4000;
      background: #fff;
      transform: translate3d(0, 100%, 0);
      -webkit-transform: translate3d(0, 100%, 0);
      transition: all 0.3s;
      height: 8.5rem;
      &.showPot{
        transform: translate3d(0, 0%, 0);
        -webkit-transform: translate3d(0, 0%, 0);
      }
      svg{
        width: .58rem;
        height: .58rem;
        fill: #fff;
        position: absolute;
        left: 0;
        right: 0;
        top: -.9rem;
        margin: 0 auto;
      }
      .poster-title{
        width: 4.35rem;
        height: .4rem;
        margin: 0 auto;
        padding: .45rem 0;
        img{
          width: 100%;
          height: .4rem;
        }
      }
      .poster-btn{
        text-align: center;
        font-size: .26rem;
        margin: .3rem;
        color: #fa3b20;
        width: 4.1rem;
        height: .7rem;
        margin: 0 auto;
        font-size: .24rem;
        color: #fff;
        text-align: center;
        line-height: .65rem;
        background: url('../../../assets/images/operate/assistant-btn.png') no-repeat;
        background-size: 100% 100%;
        margin-top: .25rem;
      }
      .poster-option{
        width:100%;	
        height: 5.98rem;
        -webkit-perspective: 1200px;
        -moz-perspective: 1200px;
        -ms-perspective: 1200px;
        perspective: 1200px;
        .swiper-wrapper{
          -webkit-transform-style: preserve-3d;
          -moz-transform-style: preserve-3d;
          -ms-transform-style: preserve-3d;
          transform-style: preserve-3d;
          .poster-slide{
            width: 5.5rem;
            .slide-con{
              width: 4.7rem;
              height: 100%;
              overflow: hidden;
              background: #fff;
              margin:0 auto;
              display:block;
              border-radius: 5px;
              position: relative;
              border: 1px solid #eee;
              box-sizing: border-box;
              .img-poster{
                width: 100%;
                height: 100%;
                display: block;
                position: absolute;
                top:0;
                left: 0;
                border-radius: 6px;
              }
              .img-qrcode{
                width: 1.06rem;
                height: 1.06rem;
                display: block;
                position: absolute;
                bottom: .56rem;
                left: .4rem;
                z-index: 200;
                img{
                  width: 100% !important;
                  height: 100% !important;
                  display: block;
                }
              }
            }
          }
        }
      }      
    }
    /* 生成海报弹窗 */
    .share-pop-img{
      position: relative;
      z-index: 30000;
      .main-img{
        width: 100%;
      }
      .sharePop-tip{
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
        right: 0;
        bottom: -0.5rem;
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
      .weui-dialog{
        overflow: unset;
      }
    }
    /* 标题 */
    .pullGroupAssistant-tit{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: .4rem 0 .6rem 0;
      img{
        width: .54rem;
        height: .24rem;
        display: block;
        &:nth-child(3){
          transform: rotate(180deg);
          -webkit-transform: rotate(180deg);
        }
      }
      span{
        margin: 0 .1rem;
        font-size: .36rem;
        color: #fa3b20;
      }
    }
    /* 助手功能 */
    .assistant{
      height: auto;
      overflow: hidden;
      // border-bottom: .18rem solid #ededed;
      padding-bottom: .3rem;
      ul{
        // padding: 0 .71rem;
        width: 100%;
        height: auto;
        overflow: hidden;
        padding: 0 .5rem;
        box-sizing: border-box;
        // display: inline-table;
        li{
          display: inline-table;
          text-align: left;
          min-width: 2.82rem;
          height: .54rem;
          line-height: .54rem;
          border-radius: 30px;
          font-size: .24rem;
          color: #666666;
          margin-bottom: .34rem;
          margin-right: .39rem;
          &:nth-child(2n){
            margin-right: 0;
          }
          span{
            width: .33rem;
            height: .29rem;
            display: inline-block;
            content: '';
            background:transparent url('../../../assets/images/operate/assistant-sprite.png') 0 0 no-repeat;
            background-size: 3.22rem .29rem;
            // margin-left: .36rem;
            margin-right: .1rem;
            vertical-align: sub;
          }
          &:nth-child(2){
            span{
              background-position: -.53rem 0rem;
            }
          }
          &:nth-child(3){
            span{
              background-position: -.99rem 0rem;
            }
          }
          &:nth-child(4){
            span{
              background-position: -1.43rem 0rem;
            }
          }
          &:nth-child(5){
            span{
              background-position: -1.87rem 0rem;
            }
          }
        }
      }
      // 按钮
      .pullGroupAssistant-btn{
        width: 4.14rem;
        height: .68rem;
        margin: .22rem auto;
        background: url('../../../assets/images/operate/assistant-btn.png');
        background-size: 100% 100%;
        font-size: .24rem;
        color: #fff;
        text-align: center;
        line-height: .6rem;
      }
      .pullGroupAssistant-tip{
        text-align: center;
        font-size: .24rem;
        color: #fa3b20;
      }
    }
    /* 活动推荐 */
    .activity-recom{
      ul{
        padding: 0 .2rem;
        li{
          float: left;
          width: 2.22rem;
          height: 2.64rem;
          margin-right: .22rem;
          margin-bottom: .22rem;
          text-align: center;
          color: #fff;
          span{
            margin-top: 1.9rem;
            font-size: .28rem;
            display: block;
          } 
          &:nth-child(3n){
            margin-right: 0;
          }
          &:nth-child(1){
            background: url('../../../assets/images/operate/luck-draw.png') no-repeat;
            background-size: 100% 100%;
          }
          &:nth-child(2){
            background: url('../../../assets/images/operate/win-treasure.png') no-repeat;
            background-size: 100% 100%;
          }
          &:nth-child(3){
            background: url('../../../assets/images/operate/community-share.png') no-repeat;
            background-size: 100% 100%;
          }
        }
      }

    }
  }
</style>
