<template>
  <div>
    <div v-if="haveData" :class="kaiqiId === 1 ? 'operateAssistant-wrap' : 'new-operateAssistant-wrap'">
      <div class="operateAssistant-title">
        <div>{{sourceName}}</div>
        <div>{{description}}</div>
      </div>
      <!-- 选项 样式一:sty-o 样式二:sty-tw -->
      <swiper :aspect-ratio="300/800" :show-dots = 'false' ref="cateSwiper" @on-get-height="ParCatyUpdateHeight">
        <swiper-item class="swiper-demo-img" v-for="(ite, ind) in shopList" :key="ind">
          <!--跳转外链-->
          <template v-for="(item, index) in ite">
            <div v-if="templateType === 1">
              <div v-if="item.iconType === 0" @click="getData(item)" class="itemListOne">
                <a>
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 0"  class="itemListOne">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 1"  class="itemListOne">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
            </div>

            <div v-if="templateType === 2">
              <div v-if="item.iconType === 0" @click="getData(item)" class="itemListTwo">
                <a>
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 0"  class="itemListTwo">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 1"  class="itemListTwo">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
            </div>

            <div v-if="templateType === 3">
              <div v-if="item.iconType === 0" @click="getData(item)" class="itemListThree" :class="{'itemListThree3': index === 2,'itemListThree4': index === 3,}">
                <a>
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 0"  class="itemListThree" :class="{'itemListThree3': index === 2,'itemListThree4': index === 3,}">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 1"  class="itemListThree" :class="{'itemListThree3': index === 2,'itemListThree4': index === 3,}">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
            </div>
            </div>

            <div v-if="templateType === 4">
              <div v-if="item.iconType === 0" @click="getData(item)" class="itemListFour">
                <a>
                  <img :src="item.icon"/>
                  <div class="wocao">
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 0" class="itemListFour">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="wocao">
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 1" class="itemListFour">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="wocao">
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </div>
                </a>
              </div>
            </div>
          </template>
        </swiper-item>
      </swiper>
    </div>
    <!--文案弹框-->
    <div class="show-toast-wrap11">
      <x-dialog v-model="showToast" class="dialog-demo">
        <x-icon type="ios-close-outline" style="fill:#fff;top: -0.8rem;position: absolute;left: 50%;margin-left: -0.3rem;" @click="iosClose"></x-icon>
        <div class="show-toast-text11" v-html="maskItem.words"></div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import { Swiper, SwiperItem, GroupTitle, XButton, Divider, XDialog, Icon } from 'vux'
  export default {
    name: 'operateAssistant',
    data () {
      return {
        assistantList: [],
        shopList: [],
        pageNum: '',
        linkType: '',
        buySourceId: '',
        sourceName: '',
        description: '',
        maskItem: '',
        haveData: true,
        kaiqiId: '',
        templateType: null,
        showToast: false
      }
    },
    components: {
      Swiper,
      SwiperItem,
      GroupTitle,
      XButton,
      Divider,
      XDialog,
      Icon
    },
    mounted: function () {
      this.getShareMes()
    },
    methods: {
      /**
       * 获取分享页面配置信息
       */
      getShareMes () {
        this.$http.get(this.api.getShareMes, {}).then((res) => {
          // console.log(res)
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          else {
            this.buySourceId = resData.data.buySourceId
            /**
             * 获取素材列表
             */
            this.$http.post(this.api.getSourceList, {id: this.buySourceId}).then((res) => {
              let resData = res.data.data
              if (resData === null) {
                this.haveData = false
              }
              // console.log(resData)
              this.pageNum = resData.pageNum
              this.sourceName = resData.sourceName
              this.description = resData.description
              this.kaiqiId = resData.backgroundOpen
              // console.log(this.kaiqiId)
              this.templateType = resData.templateType
              console.log(this.templateType)
              this.ParCatyUpdateHeight()
              resData.sourceDetailList.forEach((item) => {
                // console.log(item)
              })
              let result = []
              for (var i = 0, len = resData.sourceDetailList.length; i < len; i += this.pageNum) {
                result.push(resData.sourceDetailList.slice(i, i + this.pageNum))
              }
              this.shopList = result
              // console.log(this.shopList)
            })
          }
        })
      },
      ParCatyUpdateHeight () {
        if (this.templateType === 4) {
          this.$nextTick(() => {
            this.$refs.cateSwiper.xheight = '65px'
            // document.getElementsByClassName('operateAssistant-wrap-lucky').style.marginTop = '-163px'
          })
        } else if (this.templateType === 3 || this.templateType === 2 || this.templateType === 1) {
          this.$nextTick(() => {
            this.$refs.cateSwiper.xheight = '260px'
          })
        }
      },
      /**
       * 文案的话就出现弹框
       */
      getData (item) {
        // console.log(item)
        this.maskItem = item
        this.showToast = true
        // console.log(this.maskItem)
      },
      /**
       * 关闭弹窗
       */
      iosClose () {
        this.showToast = false
      }
    }
  }
</script>
<style lang="less">
  .operateAssistant-wrap{
    height: auto;
    overflow: hidden;
    margin: 0 .2rem;
    background:#fff;
    border-radius: 5px;
    box-shadow: 0 0 10px 0 hsla(0,6%,58%,.6);
    -webkit-box-shadow: 0 0 10px 0 hsla(0,6%,58%,.4);
    margin-top: -4rem;
    position: relative;
    z-index: 10;
    .operateAssistant-title{
      padding: 0 .48rem;
      height: .9rem;
      display: flex;
      align-items: center;
      border-bottom: .02rem solid #f9f9f9;
      margin-bottom: .3rem;
      div:nth-child(1){
        padding: .05rem .12rem;
        background: #ee594f;
        color: #fff;
        font-size: .28rem;
        border-radius: 6px;
        margin-right: .19rem;
        /*min-width: 2.5rem;*/
        text-align: center;
      }
      div:nth-child(2){
        flex: 1;
        font-size: .26rem;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .itemListOne{
      width: 25%;
      height:2.2rem;
      background: #fff;
      float: left;
      text-align: center;
      margin-bottom: 0.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      a{
        display: block;
        width: 80%;
        margin: 0 10%;
        text-align: center;
        img{
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
        }
        .itemName{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.28rem;
        }
        .itemSubtitle{
          font-size: 0.26rem;
          height: 0.8rem;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 0.4rem;
        }
      }
    }
    .itemListTwo{
      width: 25%;
      height:2.2rem;
      background: #fff;
      float: left;
      text-align: center;
      margin-bottom: 0.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      a{
        display: block;
        width: 80%;
        margin: 0 10%;
        text-align: center;
        img{
          width: 1rem;
          height: 1rem;
          border-radius: 0.2rem;
        }
        .itemName{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.28rem;
        }
        .itemSubtitle{
          font-size: 0.26rem;
          height: 0.8rem;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 0.4rem;
        }
      }
    }
    .itemListThree{
      width: 25%;
      height:2.2rem;
      background: #fff;
      float: left;
      text-align: center;
      margin-bottom: 0.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      a{
        display: block;
        width: 80%;
        margin: 0 10%;
        text-align: center;
        img{
          width: 1rem;
          height: 1rem;
          border-radius: 0.15rem;
        }
        .itemName{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.28rem;
        }
        .itemSubtitle{
          font-size: 0.26rem;
          height: 0.8rem;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 0.4rem;
        }
      }
      &:nth-of-type(3){
        width: 50%;
        height:2.2rem;
        background: #fff;
        float: left;
        text-align: center;
        margin-bottom: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        a{
          display: block;
          width: 90%;
          margin: 0 5%;
          text-align: center;
          img{
            width: 3rem;
            height: 1rem;
            border-radius: 0.15rem;
          }
          .itemName{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.28rem;
          }
          .itemSubtitle{
            font-size: 0.26rem;
            height: 0.8rem;
            white-space: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 0.4rem;
          }
        }
      }
      &:nth-of-type(4){
        width: 50%;
        height:2.2rem;
        background: #fff;
        float: left;
        text-align: center;
        margin-bottom: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        a{
          display: block;
          width: 90%;
          margin: 0 5%;
          text-align: center;
          img{
            width: 3rem;
            height: 1rem;
            border-radius: 0.15rem;
          }
          .itemName{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.28rem;
          }
          .itemSubtitle{
            font-size: 0.26rem;
            height: 0.8rem;
            white-space: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 0.4rem;
          }
        }
      }
    }
    .itemListThree3{
      width: 50%;
      height:2.2rem;
      background: #fff;
      float: left;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      a{
        display: block;
        width: 90%;
        margin: 0 5%;
        text-align: center;
        img{
          /*width: 3rem;*/
          width: auto;
          max-width: 100%;
          height: 1rem;
          border-radius: 0.15rem;
        }
        .itemName{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.28rem;
        }
        .itemSubtitle{
          font-size: 0.26rem;
          height: 0.8rem;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 0.4rem;
        }
      }
    }
    .itemListThree4{
      width: 50%;
      height:2.2rem;
      background: #fff;
      float: left;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      a{
        display: block;
        width: 90%;
        margin: 0 5%;
        text-align: center;
        img{
          /*width: 3rem;*/
          width: auto;
          max-width: 100%;
          height: 1rem;
          border-radius: 0.15rem;
        }
        .itemName{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.28rem;
        }
        .itemSubtitle{
          font-size: 0.26rem;
          height: 0.8rem;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 0.4rem;
        }
      }
    }
    .itemListFour{
      width: 1.86rem;
      float: left;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 0.25rem;
      a{
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: space-around;
        border-radius: 0.1rem;
        border: 1px solid #fffff8;
        padding: 0.12rem;
        min-height: 0.62rem;
        img{
          width: 0.36rem;
          height: 0.42rem;
        }
        .wocao{
          .itemName{
            width: 1.2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.24rem;
          }
          .itemSubtitle{
            width: 1.2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.16rem;
          }
        }
      }
    }
  }

  .new-operateAssistant-wrap{
    height: auto;
    overflow: hidden;
    margin: 0 .2rem;
    background:#fff;
    border-radius: 5px;
    box-shadow: 0 0 10px 0 hsla(0,6%,58%,.6);
    -webkit-box-shadow: 0 0 10px 0 hsla(0,6%,58%,.4);
    /*margin-top: -3rem;*/
    position: relative;
    z-index: 10;
    .operateAssistant-title{
      padding: 0 .48rem;
      height: .9rem;
      display: flex;
      align-items: center;
      border-bottom: .02rem solid #f9f9f9;
      /*margin-bottom: .3rem;*/
      div:nth-child(1){
        padding: .05rem .12rem;
        background: #ee594f;
        color: #fff;
        font-size: .28rem;
        border-radius: 6px;
        margin-right: .19rem;
        /*min-width: 2.5rem;*/
        text-align: center;
      }
      div:nth-child(2){
        flex: 1;
        font-size: .26rem;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .itemListOne{
      width: 25%;
      height:2.2rem;
      background: #fff;
      float: left;
      text-align: center;
      margin-bottom: 0.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      a{
        display: block;
        width: 80%;
        margin: 0 10%;
        text-align: center;
        img{
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
        }
        .itemName{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.28rem;
        }
        .itemSubtitle{
          font-size: 0.26rem;
          height: 0.8rem;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 0.4rem;
        }
      }
    }
    .itemListTwo{
      width: 25%;
      height:2.2rem;
      background: #fff;
      float: left;
      text-align: center;
      margin-bottom: 0.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      a{
        display: block;
        width: 80%;
        margin: 0 10%;
        text-align: center;
        img{
          width: 1rem;
          height: 1rem;
          border-radius: 0.2rem;
        }
        .itemName{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.28rem;
        }
        .itemSubtitle{
          font-size: 0.26rem;
          height: 0.8rem;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 0.4rem;
        }
      }
    }
    .itemListThree{
      width: 25%;
      height:2.2rem;
      background: #fff;
      float: left;
      text-align: center;
      margin-bottom: 0.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      a{
        display: block;
        width: 80%;
        margin: 0 10%;
        text-align: center;
        img{
          width: 1rem;
          height: 1rem;
          border-radius: 0.15rem;
        }
        .itemName{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.28rem;
        }
        .itemSubtitle{
          font-size: 0.26rem;
          height: 0.8rem;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 0.4rem;
        }
      }
      &:nth-of-type(3){
        width: 50%;
        height:2.2rem;
        background: #fff;
        float: left;
        text-align: center;
        margin-bottom: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        a{
          display: block;
          width: 90%;
          margin: 0 5%;
          text-align: center;
          img{
            width: 3rem;
            height: 1rem;
            border-radius: 0.15rem;
          }
          .itemName{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.28rem;
          }
          .itemSubtitle{
            font-size: 0.26rem;
            height: 0.8rem;
            white-space: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 0.4rem;
          }
        }
      }
      &:nth-of-type(4){
        width: 50%;
        height:2.2rem;
        background: #fff;
        float: left;
        text-align: center;
        margin-bottom: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        a{
          display: block;
          width: 90%;
          margin: 0 5%;
          text-align: center;
          img{
            width: 3rem;
            height: 1rem;
            border-radius: 0.15rem;
          }
          .itemName{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.28rem;
          }
          .itemSubtitle{
            font-size: 0.26rem;
            height: 0.8rem;
            white-space: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 0.4rem;
          }
        }
      }
    }
    .itemListThree3{
    width: 50%;
    height:2.2rem;
    background: #fff;
    float: left;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    a{
      display: block;
      width: 90%;
      margin: 0 5%;
      text-align: center;
      img{
        width: auto;
        max-width: 100%;
        height: 1rem;
        border-radius: 0.15rem;
      }
      .itemName{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.28rem;
      }
      .itemSubtitle{
        font-size: 0.26rem;
        height: 0.8rem;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 0.4rem;
      }
    }
  }
    .itemListThree4{
      width: 50%;
      height:2.2rem;
      background: #fff;
      float: left;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      a{
        display: block;
        width: 90%;
        margin: 0 5%;
        text-align: center;
        img{
          width: auto;
          max-width: 100%;
          height: 1rem;
          border-radius: 0.15rem;
        }
        .itemName{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.28rem;
        }
        .itemSubtitle{
          font-size: 0.26rem;
          height: 0.8rem;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 0.4rem;
        }
      }
    }
    .itemListFour{
      width: 1.86rem;
      float: left;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 0.25rem;
      a{
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: space-around;
        border-radius: 0.1rem;
        border: 1px solid #fffff8;
        padding: 0.12rem;
        min-height: 0.62rem;
        img{
          width: 0.36rem;
          height: 0.42rem;
        }
        .wocao{
          .itemName{
            width: 1.2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.24rem;
          }
          .itemSubtitle{
            width: 1.2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.16rem;
          }
        }
      }
    }
  }
</style>
<style>
  .show-toast-text11{
    padding: 0.2rem;
    max-height: 8rem;
    overflow-x: hidden;
    overflow-y: scroll;
    max-width: 5.6rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .show-toast-text11 p{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .show-toast-text11 p img{
    width: 100%;
    display: block;
  }
  .weui-dialog {
    position: fixed;
    display: table;
    z-index: 5000;
    width: 80%;
    max-width: 300px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background-color: #FFFFFF;
    text-align: center;
    overflow: auto;
    border-radius: 0.2rem;
  }
</style>
