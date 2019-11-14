<template>
  <div>
    <div v-if="haveData" :class="kaiqiId === 1 ? 'operateAssistant-wrap-lucky' : 'operateAssistant-nowrap-lucky'" :style="{backgroundColor: templateType === 5 ? '#1d1d1d' : '#fff'}">
      <div class="operateAssistant-title" v-if="templateType === 1 || templateType === 2 || templateType === 3 || templateType === 4">
        <div>{{sourceName}}</div>
        <div>{{description}}</div>
      </div>
      <div class="operateAssistant-title111" v-if="templateType === 5">
        <div style="text-align: center;padding-top: 0.2rem;">{{sourceName}}</div>
        <img src="../../../src/assets/images/other/linea.png" style="width: 5.66rem;margin-left: 0.8rem;"/>
      </div>
      <img src="../../../src/assets/images/other/left.png" style="position: absolute;width: 0.5rem;height: 1.5rem;top: 0.6rem;right: 0.32rem;" v-if="templateType === 5"/>
      <img src="../../../src/assets/images/other/right.png" style="position: absolute;width: 0.5rem;height: 1.5rem;top: 0.6rem;left: 0.38rem;" v-if="templateType === 5"/>
      <!-- 选项 样式一:sty-o 样式二:sty-tw -->
      <div class="operateAssistant-swiper" :class="{'bannerCSS': templateType === 5}">
        <swiper :aspect-ratio="9/16" :show-dots="false" ref="cateSwiper" @on-get-height="ParCatyUpdateHeight">
          <swiper-item class="swiper-demo-img" v-for="(ite, ind) in shopList" :key="ind">
            <!--跳转外链,内链,显示弹框的判断,	iconType:0文案,1 链接   linkType:0外部链接,1内部链接-->
            <!--特别说明:iconType===0的时候，只显示文案弹框；iconType===1的时候，会区分链接跳转(外部链接和内部链接)-->
            <template v-for="(item, index) in ite">
              <!--第一种类型-->
              <div v-if="templateType === 1">
                <div v-if="item.iconType === 0" @click="getData(item)" class="itemListOne">
                  <a>
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 1 && item.linkType === 0" class="itemListOne">
                  <a :href="item.relateUrl">
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 1 && item.linkType === 1" class="itemListOne">
                  <a :href="item.relateUrl">
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
              </div>

              <!--第二种类型-->
              <div v-if="templateType === 2">
                <div v-if="item.iconType === 0" @click="getData(item)" class="itemListTwo">
                  <a>
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 1 && item.linkType === 0" class="itemListTwo">
                  <a :href="item.relateUrl">
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 1 && item.linkType === 1" class="itemListTwo">
                  <a :href="item.relateUrl">
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
              </div>

              <!--第三种类型-->
              <div v-if="templateType === 3">
                <div v-if="item.iconType === 0" @click="getData(item)" class="itemListThree" :class="{'itemListThree3': index === 2,'itemListThree4': index === 3,}">
                  <a>
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 1 && item.linkType === 0" class="itemListThree" :class="{'itemListThree3': index === 2,'itemListThree4': index === 3,}">
                  <a :href="item.relateUrl">
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 1 && item.linkType === 1" class="itemListThree" :class="{'itemListThree3': index === 2,'itemListThree4': index === 3,}">
                  <a :href="item.relateUrl">
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
              </div>

              <!--第四种类型-->
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

              <!--第无种类型-->
              <div v-if="templateType === 5">
                <div v-if="item.iconType === 0" @click="getData(item)" class="itemListFive">
                  <a>
                    <div class="wocao">
                      <div class="itemName">{{item.iconName}}</div>
                      <div class="itemSubtitle">{{item.subtitle}}</div>
                    </div>
                  </a>
                </div>
                <div v-if="item.iconType === 1 && item.linkType === 0" class="itemListFive">
                  <a :href="item.relateUrl">
                    <div class="wocao">
                      <div class="itemName">{{item.iconName}}</div>
                      <div class="itemSubtitle">{{item.subtitle}}</div>
                    </div>
                  </a>
                </div>
                <div v-if="item.iconType === 1 && item.linkType === 1" class="itemListFive">
                  <a :href="item.relateUrl">
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
    </div>
    <!--文案弹框-->
    <div class="show-toast-wrap">
      <x-dialog v-model="showToast" class="dialog-demo">
        <x-icon type="ios-close-outline" style="fill:#fff;top: -0.8rem;position: absolute;left: 50%;margin-left: -0.3rem;" @click="iosClose"></x-icon>
        <div class="show-toast-text" v-html="maskItem.words"></div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import { Swiper, SwiperItem, GroupTitle, XButton, Divider, XDialog, Icon } from 'vux'
  import $ from 'jquery'
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
    props: [
      'goodsGroupId',
      'flyData'
    ],
    components: {
      Swiper,
      SwiperItem,
      GroupTitle,
      XButton,
      Divider,
      XDialog,
      Icon
    },
    watch: {
      goodsGroupId (value) {
        // console.log(value)
      },
      flyData (value) {
        this.newData()
        // console.log(this.flyData)
      }
    },
    mounted: function () {
      // this.getPurchaseDes()
      this.newData()
    },
    methods: {
      newData () {
        let data1 = JSON.parse(localStorage.getItem('pulicData')) || {} // data1是接口getPurchaseDes储存的数据
        // console.log(data1)
        this.buySourceId = data1.buySourceId
        let data2 = this.flyData   // data2是接口getSourceList储存的数据
        // console.log(data2)
        if (data2 === null) {
          this.haveData = false
        }
        this.pageNum = data2.pageNum
        this.sourceName = data2.sourceName
        this.description = data2.description
        this.kaiqiId = data2.backgroundOpen
        this.templateType = data2.templateType
        // console.log(this.templateType)
        this.ParCatyUpdateHeight()
        data2.sourceDetailList.forEach((item) => {
          // console.log(item)
        })
        let result = []
        for (var i = 0, len = data2.sourceDetailList.length; i < len; i += this.pageNum) {
          result.push(data2.sourceDetailList.slice(i, i + this.pageNum))
          // console.log(result)
        }
        this.shopList = result
        // console.log(this.shopList)
      },
      ParCatyUpdateHeight () {
        if (this.templateType === 4 || this.templateType === 5) {
          this.$nextTick(() => {
            this.$refs.cateSwiper.xheight = '50px'
            $('.operateAssistant-wrap-lucky').css({'margin-top': -50 + 'px'})
          })
        } else if (this.templateType === 3 || this.templateType === 2 || this.templateType === 1) {
          this.$nextTick(() => {
            this.$refs.cateSwiper.xheight = '220px'
          })
        }
      },
      getData (item) {
        this.maskItem = item
        this.showToast = true
        // console.log(this.maskItem)
      },
      iosClose () {
        this.showToast = false
      }
    }
  }
</script>
<style lang="less">
/******背景整体上移*******/
.operateAssistant-wrap-lucky{
  height: auto;
  padding: 0 .2rem;
  background: #fff;
  /*border-radius: 5px;*/
  margin-top: -3.6rem;
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
      color: #fff;
      font-size: .28rem;
      border-radius: 6px;
      margin-right: .19rem;
      text-align: center;
      background: #ec4c43;
      padding: 0.1rem 0.2rem;
    }
    div:nth-child(2){
      flex: 1;
      font-size: .26rem;
      color: #000;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  operateAssistant-title111{
    padding: 0 .48rem;
    height: .9rem;
    display: flex;
    align-items: center;
    border-bottom: .02rem solid #f9f9f9;
    margin-bottom: .3rem;
    justify-content: center;
    .fiveCss{
      text-align: center;
      color: #fff;
      font-size: .28rem;
      /*background: #000;*/
    }
  }
  .operateAssistant-swiper{
    overflow: hidden;
    /*border-radius: 8px;*/
    /*box-shadow:0px 4px 8px #f1f1f1;*/
    padding-top: .3rem;
    padding-bottom: .1rem;
    margin-bottom: .2rem;
    .itemListOne{
      width: 25%;
      height:2.2rem;
      float: left;
      text-align: center;
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
      float: left;
      text-align: center;
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
      float: left;
      text-align: center;
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
    .itemListFive{
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
        /*border: 1px solid #fffff8;*/
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
}
/***不要背景整体上移******/
.operateAssistant-nowrap-lucky{
  height: auto;
  overflow: hidden;
  margin: 0 .2rem;
  /*border-radius: 5px;*/
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
      color: #fff;
      font-size: .28rem;
      border-radius: 6px;
      margin-right: .19rem;
      text-align: center;
      background: #ec4c43;
      padding: 0.1rem 0.2rem;
    }
    div:nth-child(2){
      flex: 1;
      font-size: .26rem;
      color: #000;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  operateAssistant-title111{
    padding: 0 .48rem;
    height: .9rem;
    display: flex;
    align-items: center;
    border-bottom: .02rem solid #f9f9f9;
    margin-bottom: .3rem;
    justify-content: center;
    .fiveCss{
      text-align: center;
      color: #fff;
      font-size: .28rem;
      /*background: #000;*/
    }
  }
  .operateAssistant-swiper{
    .itemListOne{
      width: 25%;
      height:2.2rem;
      float: left;
      text-align: center;
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
      float: left;
      text-align: center;
      /*margin-bottom: 0.2rem;*/
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
      float: left;
      text-align: center;
      /*margin-bottom: 0.2rem;*/
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
        float: left;
        text-align: center;
        /*margin-bottom: 0.2rem;*/
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
        float: left;
        text-align: center;
        /*margin-bottom: 0.2rem;*/
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
        background: #8a0c0f;
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
            color: #ffffff;
          }
          .itemSubtitle{
            width: 1.2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.16rem;
            color: #f1e9e9;
          }
        }
      }
    }
    .itemListFive{
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
        background: #8a0c0f;
        border-radius: 0.1rem;
        /*border: 1px solid #fffff8;*/
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
            color: #ffffff;
          }
          .itemSubtitle{
            width: 1.2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.16rem;
            color: #f1e9e9;
          }
        }
      }
    }
  }
}
</style>
<style>
.show-toast-text{
  padding: 0.2rem;
  max-height: 8rem;
  overflow-x: hidden;
  overflow-y: scroll;
  max-width: 5.6rem;
  /*text-overflow: ellipsis;*/
  /*white-space: nowrap;*/
}
.show-toast-text p{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.show-toast-text p img{
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
<style>
  .bannerCSS{
    background: #1d1d1d;
    /*background: linear-gradient(to right,#1d1d1d,#1d1d1d);*/
  }
</style>
