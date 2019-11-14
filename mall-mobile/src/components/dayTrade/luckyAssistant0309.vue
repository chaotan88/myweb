<template>
  <div>
    <div v-if="haveData" :class="kaiqiId === 1 ? 'operateAssistant-wrap-lucky' : 'operateAssistant-nowrap-lucky'">
      <!--<div class="operateAssistant-title">-->
        <!--<div>{{sourceName}}</div>-->
        <!--<div>{{description}}</div>-->
      <!--</div>-->
      <!-- 选项 样式一:sty-o 样式二:sty-tw -->
      <div class="operateAssistant-swiper">
        <swiper :aspect-ratio="9/16" :show-dots="false" ref="cateSwiper" @on-get-height="ParCatyUpdateHeight">
          <swiper-item class="swiper-demo-img" v-for="(ite, ind) in shopList" :key="ind">
            <!--跳转外链,内链,显示弹框的判断,	iconType:0文案,1 链接   linkType:0外部链接,1内部链接-->
            <template v-for="(item, index) in ite">
              <!--第一种类型-->
              <div v-if="templateType === 1">
                <div v-if="item.iconType === 0 && item.linkType !== null & item.linkType !== 0" @click="getData(item),maskPage = true,maskOperate = true" class="itemListOne">
                  <a>
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 0 && item.linkType === 0" @click="getData(item),maskPage = true,maskOperate = true" class="itemListOne">
                  <a>
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 0 && item.linkType === null" @click="getData(item),maskPage = true,maskOperate = true" class="itemListOne">
                  <a>
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 1 && item.linkType === null" @click="getData(item),maskPage = true,maskOperate = true" class="itemListOne">
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
                <div v-if="item.iconType === null && item.linkType === null" @click="getData(item),maskPage = true,maskOperate = true" class="itemListOne">
                  <a>
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
              </div>

              <!--第二种类型-->
              <div v-if="templateType === 2">
                <div v-if="item.iconType === 0 && item.linkType !== null & item.linkType !== 0" @click="getData(item),maskPage = true,maskOperate = true" class="itemListTwo">
                  <a>
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 0 && item.linkType === 0" @click="getData(item),maskPage = true,maskOperate = true" class="itemListTwo">
                  <a>
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 0 && item.linkType === null" @click="getData(item),maskPage = true,maskOperate = true" class="itemListTwo">
                  <a>
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
                <div v-if="item.iconType === 1 && item.linkType === null" @click="getData(item),maskPage = true,maskOperate = true" class="itemListTwo">
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
                <div v-if="item.iconType === null && item.linkType === null" @click="getData(item),maskPage = true,maskOperate = true" class="itemListTwo">
                  <a>
                    <img :src="item.icon"/>
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </a>
                </div>
              </div>

              <!--第三种类型-->
              <div v-if="item.iconType === 0 && templateType === 3 && item.linkType !== null & item.linkType !== 0" @click="getData(item),maskPage = true,maskOperate = true" class="itemListThree">
                <a>
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === 0 && item.linkType === 0 && templateType === 3" @click="getData(item),maskPage = true,maskOperate = true" class="itemListThree">
                <a>
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === 0 && item.linkType === null && templateType === 3" @click="getData(item),maskPage = true,maskOperate = true" class="itemListThree">
                <a>
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === null && templateType === 3" @click="getData(item),maskPage = true,maskOperate = true" class="itemListThree">
                <a>
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 0 && templateType === 3" class="itemListThree">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 1 && templateType === 3" class="itemListThree">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>
              <div v-if="item.iconType === null && item.linkType === null && templateType === 3" @click="getData(item),maskPage = true,maskOperate = true" class="itemListThree">
                <a>
                  <img :src="item.icon"/>
                  <div class="itemName">{{item.iconName}}</div>
                  <div class="itemSubtitle">{{item.subtitle}}</div>
                </a>
              </div>

              <!--第四种类型-->
              <div v-if="item.iconType === 0 && templateType === 4 && item.linkType !== null & item.linkType !== 0" @click="getData(item),maskPage = true,maskOperate = true" class="itemListFour">
                <a>
                  <img :src="item.icon"/>
                  <div class="wocao">
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </div>
                </a>
              </div>
              <div v-if="item.iconType === 0 && item.linkType === 0 && templateType === 4" @click="getData(item),maskPage = true,maskOperate = true" class="itemListFour">
                <a>
                  <img :src="item.icon"/>
                  <div class="wocao">
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </div>
                </a>
              </div>
              <div v-if="item.iconType === 0 && item.linkType === null && templateType === 4" @click="getData(item),maskPage = true,maskOperate = true" class="itemListFour">
                <a>
                  <img :src="item.icon"/>
                  <div class="wocao">
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === null && templateType === 4" @click="getData(item),maskPage = true,maskOperate = true" class="itemListFour">
                <a>
                  <img :src="item.icon"/>
                  <div class="wocao">
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 0 && templateType === 4" class="itemListFour">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="wocao">
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </div>
                </a>
              </div>
              <div v-if="item.iconType === 1 && item.linkType === 1 && templateType === 4" class="itemListFour">
                <a :href="item.relateUrl">
                  <img :src="item.icon"/>
                  <div class="wocao">
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </div>
                </a>
              </div>
              <div v-if="item.iconType === null && item.linkType === null && templateType === 4" @click="getData(item),maskPage = true,maskOperate = true" class="itemListFour">
                <a>
                  <img :src="item.icon"/>
                  <div class="wocao">
                    <div class="itemName">{{item.iconName}}</div>
                    <div class="itemSubtitle">{{item.subtitle}}</div>
                  </div>
                </a>
              </div>
            </template>
          </swiper-item>
        </swiper>
      </div>
    </div>
    <!--文案弹框-->
    <div class="maskPage" v-if="maskPage"></div>
    <div class="maskOperate" v-if="maskOperate" @click="closeIcon">
      <icon type="cancel"></icon>
      <div class="maskCenter">
        <div class="maskCenterText" v-html="maskItem.words"></div>
      </div>
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
        showToast: true,
        buySourceId: '',
        sourceName: '',
        description: '',
        maskPage: false,
        maskOperate: false,
        maskItem: '',
        haveData: true,
        kaiqiId: '',
        templateType: null
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
        let data1 = JSON.parse(localStorage.getItem('pulicData'))  // data1是接口getPurchaseDes储存的数据
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
      },
      ParCatyUpdateHeight () {
        if (this.templateType === 4) {
          this.$nextTick(() => {
            this.$refs.cateSwiper.xheight = '72px'
            // document.getElementsByClassName('operateAssistant-wrap-lucky').style.marginTop = '-163px'
          })
        } else if (this.templateType === 3 || this.templateType === 2 || this.templateType === 1) {
          this.$nextTick(() => {
            this.$refs.cateSwiper.xheight = '220px'
          })
        }
      },
      /**
       * 关闭弹窗
       */
      closeIcon () {
        this.maskPage = false
        this.maskOperate = false
      },
      getData (item) {
        // console.log(item)
        this.maskItem = item
        // console.log(this.maskItem)
      }
    }
  }
</script>
<style lang="less">
/******背景整体上移*******/
.operateAssistant-wrap-lucky{
  height: auto;
  margin: 0 .2rem;
  background: #fff;
  border-radius: 5px;
  margin-top: -2rem;
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
    }
    div:nth-child(2){
      flex: 1;
      font-size: .26rem;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .operateAssistant-swiper{
    overflow: hidden;
    border-radius: 8px;
    box-shadow:0px 4px 8px #d1d1d1;
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
}
/***不要背景整体上移******/
.operateAssistant-nowrap-lucky{
  height: auto;
  overflow: hidden;
  margin: 0 .2rem;
  border-radius: 5px;
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
    }
    div:nth-child(2){
      flex: 1;
      font-size: .26rem;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  }
}
/******轮播优化,弹出遮罩层优化*****/
.dialog-demo {
  .weui-dialog{
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    height: 350px;
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
.weui-icon-cancel{
  color: #fff!important;
  font-size: 22px;
  position: relative;
  top: -0.7rem;
  left: 2.6rem;
  z-index: 1000;
}
.maskOperate{
  width: 80%;
  margin: 0 10%;
  max-height: 10rem;
  background: #fff;
  position: fixed;
  top: 1.5rem;
  left: 0;
  z-index: 999;
  border-radius: 0.2rem;
  .maskCenter{
    width: 90%;
    height: 90%;
    margin: 5%;
    .maskCenterImg{
      width: 100%;
      height: 3rem;
      border-radius: 0.2rem;
      img{
        width: 100%;
        height: 100%;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
        border-radius: 0.2rem;
      }
    }
  }
  .maskCenterText{
    margin-top: 0.5rem;
    /*color: #f9936d;*/
    max-height: 8rem;
    /*text-indent:2em;*/
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 0.25rem;
    overflow-y: scroll;
    p{
      width: 100%;
      img{
        width: 100%;
        /*height: 4.5rem;*/
        display: block;
      }
    }
  }
}
.maskPage{
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
}
</style>

