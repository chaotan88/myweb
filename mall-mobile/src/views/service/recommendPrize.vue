<template>
  <div>
    <!-- 分享内容 -->
    <div class="sharePop-box" ref="imageWrapper">
      <div class="sharePop">
        <div class="sharePop-title">{{ shareCon.goodsName | textInterception(50)}}</div>
        <div class="sharePop-img">
          <img :src="shareCon.mainImage | filterImgUrl">
        </div>
        <div class="sharePop-con">
          <div class="con-qrcode">
            <!-- <img src="http://img.atobo.com/ProductImg/EWM/UWeb/8/1/3/5/373/8135373/1.gif"> -->
            <qrcode :value="codeUrl" type="img" class="ewm"></qrcode>
            <p>长按立即购买</p>
          </div>
          <div class="con-r">
            <div class="con-r-price">
              <div>¥{{shareCon.goodsMinPrice}}</div>
              <div>¥{{shareCon.goodsMaxPrice}}</div>
            </div>
            <ul>
              <li>
                <div>惠</div>
                <div>立即购买赠送{{shareCon.beinviteProfitNum}}{{shareCon.beInviteProfitType | propertyTypeFilter(true)}}</div>
              </li>
              <li>
                <div>积</div>
                <div>在线支付赠送{{shareCon.canGetPoint}}积分</div>
              </li>
              <li v-if="shareCon.whetherBlancePay === 1">
                <div>余</div>
                <div>可以用余额支付</div>
              </li>
            </ul>
          </div>
        </div>
      </div>  
    </div> 
    <div class="recommendPrize-wrap">
      <div class="recommendPrize-ban">
        <img :src="shareConfigData.themeImage" v-if="shareConfigData.themeImage">
        <img src="../../assets/images/action/action-ban.jpg" v-if="shareConfigData && !shareConfigData.themeImage">
      </div>
      <!-- 6大优势 -->
      <swiper height="1.25rem" :show-dots="false" :auto="true" :loop="true" class="advantage" v-if="!noDataSte && groupRemoedList.length > 0">
        <swiper-item class="swiper-demo-img">
          <ul>
            <li>
              <img src="../../assets/images/action/advantage-1.png">
              <img src="../../assets/images/action/advantage-2.png">
            </li>
          </ul>
        </swiper-item>
        <swiper-item class="swiper-demo-img">
          <ul>
            <li>
              <img src="../../assets/images/action/advantage-3.png">
              <img src="../../assets/images/action/advantage-4.png">
            </li>
          </ul>
        </swiper-item>
        <swiper-item class="swiper-demo-img">
          <ul>
            <li>
              <img src="../../assets/images/action/advantage-5.png">
              <img src="../../assets/images/action/advantage-6.png">
            </li>
          </ul>
        </swiper-item>
      </swiper>
      <template v-if="!noDataSte && groupRemoedList.length > 0">
        <img src="../../assets/images/action/action-04.png" class="title-style-o">
        <!-- 列表样式一 -->
        <div class="list-slide">
          <div class="list-slide-l" @click="goSwiper(1)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zuojiantou"></use>
            </svg>
          </div>
          <div class="list-slide-option">
            <!-- <div class="list-slide-bg">
              <img src="../../assets/images/action/list-slide-bg.png">
            </div> -->
            <swiper height="2.6rem" :show-dots="false" :auto="false" class="flashSale-con-option" v-model="listSlideIndex" @on-index-change="slideChange">
              <swiper-item class="swiper-demo-img" v-for="(item, index) in groupRemoedList" :key="index">
                <ul>
                  <li v-for="(ite, ind) in item">
                    <div class="slide-mainImg">
                      <img :src="ite.mainImage | filterImgUrl">
                    </div>
                    <div class="slide-btn" @click="toImage(ite.id)">
                      <img src="../../assets/images/action/list-slide-share.png">
                    </div>
                  </li>
                </ul>
              </swiper-item>
            </swiper>
          </div>
          <div class="list-slide-r" @click="goSwiper(2)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-youjiantou1"></use>
            </svg>
          </div>
        </div>
        <!-- 列表样式二 -->
        <div class="list-lr">
          <div class="list-lr-title">
            <img src="../../assets/images/action/action-05.png">
          </div>
          <ul>
            <template v-for="(item, index) in remoedList" v-if="index < 3">
              <li class="r-alignment"  v-if="index % 2 !== 0">
                <div class="lr-r">
                  <img :src="item.mainImage | filterImgUrl" class="main-img">
                  <img src="../../assets/images/action/list-slide-bg.png" class="img-bg">
                </div>
                <div class="lr-l">
                  <div class="lr-l-title">
                    <p>{{item.goodsName}}</p>
                  </div>
                  <div class="lr-l-price">
                    <p>分享价:<i>￥</i>{{item.goodsMinPrice }}</p>
                    <p>分享可得：</p>
                    <p>{{item.inviteProfitNum}}<i>{{item.inviteProfitType | propertyTypeFilter(true)}}</i></p>
                  </div>
                  <div class="lr-l-btn" @click="toImage(item.id)">
                    <img src="../../assets/images/action/lr-share.png">
                  </div>
                </div>
              </li>
              <li class="l-alignment" v-else>
                <div class="lr-l">
                  <div class="lr-l-title">
                    <p>{{item.goodsName}}</p>
                  </div>
                  <div class="lr-l-price">
                    <p>分享价:<i>￥</i>{{item.goodsMinPrice }}</p>
                    <p>分享可得：</p>
                    <p>{{item.inviteProfitNum}}<i>{{item.inviteProfitType | propertyTypeFilter(true)}}</i></p>
                  </div>
                  <div class="lr-l-btn" @click="toImage(item.id)">
                    <img src="../../assets/images/action/lr-share.png">
                  </div>
                </div>
                <div class="lr-r">
                  <img :src="item.mainImage | filterImgUrl" class="main-img">
                  <img src="../../assets/images/action/list-slide-bg.png" class="img-bg">
                </div>
              </li>
            </template>
          </ul>
        </div>
        <!-- 列表样式三 -->
        <div class="list-lis">
          <div class="list-lis-title">
            <img src="../../assets/images/action/action-06.png">
          </div>
          <ul>
            <li v-for="(item, index) in remoedList" v-if="index > 2">
              <div class="lis-img">
                <img :src="item.mainImage | filterImgUrl">
              </div>
              <div class="lis-con">
                <div class="lis-title">{{item.goodsName}}</div>
                <div class="lis-price">
                  <p><i>¥</i>{{item.goodsMinPrice }}</p>
                  <p>赠送{{item.inviteProfitNum}}{{item.inviteProfitType | propertyTypeFilter(true)}}</p>
                </div>
                <div class="lis-btn" @click="toImage(item.id)">立即分享</div>
              </div>
            </li>
          </ul>
        </div>
      </template>
      <!-- 暂无数据 -->
      <no-data v-if="noDataSte"></no-data>
      <!-- 分享说明按钮 -->
      <div class="share-ins-btn" @click="showIns = true">
        <span>分享说明</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zuojiantou"></use>
        </svg>
      </div>
      <!-- 分享说明内容 -->
      <div class="share-ins-con">
        <x-dialog v-model="showIns" :hide-on-blur="true">
          <div class="con-title">
            <img src="../../assets/images/action/share-ins-bg.png">
            <span>推荐好友 享受双重大礼</span>
            <img src="../../assets/images/action/share-ins-bg.png">
          </div>
          <ul>
            <li>
              <!-- <div>
                <p></p>
                <p>一次邀请  永久收益</p>
              </div> -->
              <div>{{shareConfigData.themePresent}}</div>
            </li>
          </ul>
          <div class="con-title">
            <img src="../../assets/images/action/share-ins-bg2.png">
            <span>真芯天下</span>
            <img src="../../assets/images/action/share-ins-bg2.png">
          </div>
        </x-dialog>
      </div>
      <!-- 分享弹窗 -->
      <div class="share-pop-img">
        <x-dialog v-model="showToast" class="dialog-demo" :hide-on-blur="true" :dialog-style="{'max-width': '6.5rem', width: '100%', height: '50%', 'background-color': 'transparent'}">
          <img :src="dataURL" class="main-img">
          <div class="sharePop-tip">
            <img src="../../assets/images/action/share-jianotu.png">
            <p>长按上图保存图片，或发送给朋友</p>
          </div> 
        </x-dialog> 
      </div>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import { Swiper, SwiperItem, XDialog, Qrcode } from 'vux' // 轮播图
import noData from '../../components/noData'    // 暂无数据
export default {
  components: {
    Swiper,
    SwiperItem,
    XDialog,
    Qrcode,
    noData
  },
  data () {
    return {
      noDataSte: false,
      shareCon: {},             // 点击分享返回的内容
      remoedList: [],           // 推荐列表
      groupRemoedList: [],      // 分组后的推荐列表
      shareConfigData: '',      // 分享配置信息
      listSlideIndex: 0,
      dataURL: '',
      showToast: false,
      showIns: false,
      codeUrl: '',
      advantage: [             // 6大优势
        ['../../assets/images/action/advantage-1.png', '../../assets/images/action/advantage-2.png'],
        ['../../assets/images/action/advantage-3.png', '../../assets/images/action/advantage-4.png'],
        ['../../assets/images/action/advantage-5.png', '../../assets/images/action/advantage-6.png']
      ]
    }
  },
  mounted: function () {
    this.getShareMes()         // 分享配置信息
    this.getRemoedList()       // 推荐列表
  },
  methods: {
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
      this.$http.post(this.api.getShareThemeGoodsPage, {
        start: 1,
        pageSize: 10000
      }).then((res) => {
        let resData = res.data
        var groupRemoedListArr = []
        if (resData.status !== this.api.ERR_OK || !res) return false
        this.remoedList = resData.data.list
        this.noDataSte = resData.data.list.length > 0 ? !!false : !!true
        // 数据分组
        for (var j = 0, leng = this.remoedList.length; j < leng; j += 3) {
          groupRemoedListArr.push(this.remoedList.slice(j, j + 3))
        }
        this.groupRemoedList = groupRemoedListArr
      })
    },
    /**
     * 滑动回调
    */
    slideChange (index) {
      this.listSlideIndex = index
    },
    /**
     * 上一页下一页
    */
    goSwiper (type) {
      if (type === 1) {
        if (this.listSlideIndex > 0) {
          this.listSlideIndex--
        }
      } else {
        if (this.listSlideIndex + 1 < this.groupRemoedList.length) {
          this.listSlideIndex++
        }
      }
    },
    /**
     * 生成图片
    */
    toImage (id) {
      this.$vux.loading.show({
        text: '图片生成中...'
      })
      this.$http.get(this.api.immediatelyShare, {
        params: {
          goodsId: id
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== parseInt(this.api.ERR_OK) || !res) {
          this.$vux.loading.hide()
          this.$vux.toast.text(resData.msg)
          return false
        } else {
          this.shareCon = resData.data
          let shopId = this.$route.query.shopId ? this.$route.query.shopId : localStorage.getItem('shopId') ? localStorage.getItem('shopId') : 1
          this.codeUrl = window.location.href.match(/.*mshop/gi)[0] + '/goodDetail?goodsId=' + id + '&shareInvitationCode=' + resData.data.invitationCode + '&shopId=' + shopId
          // 生成图片
          setTimeout(() => {
            html2canvas(this.$refs.imageWrapper, {
              backgroundColor: null,
              logging: false
            }).then((canvas) => {
              this.$vux.loading.hide()
              let dataURL = canvas.toDataURL('image/png')
              this.dataURL = dataURL
              this.showToast = true
            })
          }, 100)
        }
      }).catch(() => {
        this.$vux.toast.text('生成失败')
        this.$vux.loading.hide()
      })
    }
  }
}
</script>
<style lang=less>
  /* 分享弹窗内容 */
  .sharePop-box{
    width: 6.6rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1;
  }
  .sharePop{
    width: 6.6rem;
    margin: 0 auto;
    padding: .25rem 0;
    box-sizing: border-box;
    background: #fff;
    border-radius: 6px;
    .sharePop-title{
      font-size: .26rem;
      color: #4c4b4a;
      /* display: -webkit-box;
      display: -moz-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; */
      margin-bottom: .3rem;
      padding: 0 .3rem;
    }
    .sharePop-img{
      width: 6.6rem;
      img{
        width: 100%;
        height:5.2rem;
      }
    }
    .sharePop-con{
      display: flex;
      padding: 0 .3rem;
      margin-top: .15rem;
      .con-qrcode{
        text-align: center;
        margin-right: .46rem;
        .ewm{
          width: 1.75rem;
          height: 1.75rem;
          img{
            width: 100% !important;
            height: 100% !important;
          }
        }
        p{
          font-size: .24rem;
          color: #585252;
          margin-top: .2rem;
        }
      }
      .con-r{
        flex:1;
        overflow: hidden;
        .con-r-price{
          display: flex;
          border-bottom: .04rem solid #f2f0f0;
          padding-bottom: .1rem;
          margin-bottom: .13rem;
          div:nth-child(1){
            color: #f53d4b;
            font-size: .36rem;
            flex:1;
          }
          div:nth-child(2){
            color: #f43644;
            font-size: .3rem;
            text-decoration: line-through;              
          }
        }
        ul{
          li{
            display: flex;
            align-items: center;
            margin-bottom: .1rem;
            &:nth-child(1){
              div:nth-child(1){
                background: #f4a52a;         
              }
            }
            &:nth-child(2){
              div:nth-child(1){
                background: #ef685d;         
              }
            }
            &:nth-child(3){
              div:nth-child(1){
                background: #f29189;         
              }
            }
            div:nth-child(1){
              width: .46rem;
              height: .46rem;
              border-radius: 50%;
              text-align: center;
              line-height: .46rem;
              color: #fff;
              font-size: .24rem;
              margin-right: .15rem;
            }
            div:nth-child(2){
              flex: 1;
              color: #585252;
              font-size: .28rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }

    }
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
  .share-pop-img{
    .main-img{
      width: 100%;
    }
  }
  .weui-dialog{
    overflow: unset;
  }
  .recommendPrize-wrap{
    height: calc(100vh);
    background-color: #c6282d;
    background: url('../../assets/images/action/action-bg.png') repeat-y;
    overflow-y: auto;
    position: relative;
    z-index: 100;
    .recommendPrize-ban{
      min-height: 6rem;
      img{
        width: 100%;
        min-height: 6rem;
      }
    }
    .title-style-o{
      width: 100%;
      margin-top: .51rem;
      margin-bottom: .37rem;
    }


    /* 6大优势 */
    .advantage{
      padding: 0 .46rem;
      ul{
        li{
          display: flex;
          justify-content: space-between;
          img{
            width: 3.14rem;
            height: 1.24rem;
          }
        }
      }
    }




    /* 滑动样式 */
    .list-slide{
      width: 7.5rem;
      height: 2.6rem;
      position: relative;
      .list-slide-l{
        position: absolute;
        left: .15rem;
        top: .55rem;
      }
      .list-slide-r{
        position: absolute;
        right: .15rem;
        top: .55rem;
      }
      .list-slide-l,.list-slide-r{
        width: .4rem;
        height: .4rem;
        z-index: 300;
        svg{
          width: .4rem;
          height: .4rem;
          fill: #fff;
        }
      }
      .list-slide-option{
        background: url('../../assets/images/action/list-slide-bg.png') no-repeat;
        background-size: 100% 1rem;
        background-position: 0 1.4rem;
        width: 7.08rem;
        height: 2.51rem;
        margin: 0 auto;
        position: relative;
        margin-bottom: .7rem;
        .flashSale-con-option{
          width: 92%;
          margin: 0 auto;
        }
        .list-slide-bg{
          width: 100%;
          height: .62rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
        ul{
          display: flex;
          li{
            flex: 1;
            text-align: center;
            img{
              width: 100%;
              height: 100%;;
            }
            .slide-mainImg{
              width: 1.61rem;
              height: 1.57rem;
              margin: 0 auto;
            }
            .slide-btn{
              width: 2.08rem;
              height: .46rem;
              margin: 0 auto;
              margin-top: .52rem;
            }
          }
        }
      }
    }
    /* 左右对齐样式 */
    .list-lr{
      margin-top: .7rem;
      .list-lr-title{
        width: 7.5rem;
        img{
          width: 100%;
        }
      }
      ul {
        li{
          display: flex;
          padding: .55rem;
          &.l-alignment{
            .lr-l{
              text-align: left;
              margin-right: .2rem;
              flex:1;
            }
          }
          &.r-alignment{
            .lr-l{
              text-align: right;
              margin-left: .2rem;
              flex:0.9;
            }            
          }
          .lr-l{
            .lr-l-title{
              margin-bottom: .25rem;
              p{
                color: #fff;
                font-size: .36rem;
                max-width: 3rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .lr-l-price{
              p:nth-child(1){
                color: #f9cf83;
                font-size: .24rem;
                i{
                  font-size: .2rem;
                }
              }
              p:nth-child(2){
                color: #f9cf83;
                font-size: .36rem; 
                line-height: .4rem;   
                margin: .05rem 0;         
              }
              p:nth-child(3){
                font-size: .48rem; 
                color: #f9cf83;
                line-height: .4rem;
                i{
                  font-size: .24rem;
                }               
              }
            }
            .lr-l-btn{
              margin-top: .12rem;
              display: inline-block;
              img{
                width: 2.07rem;
                height: .56rem;
                display: block;
              }
            }
          }
          .lr-r{
            width: 3.23rem;
            height: 3.2rem;
            .main-img{
              width: 2.69rem;
              height: 2.83rem;
              display: block;
              margin: 0 auto;
            }
            .img-bg{
              width: 3.23rem;
              height: .46rem;
              display: block;
            }
          }
        }
      }
    }
    /* 列表样式 */
    .list-lis{
      height: auto;
      overflow: hidden;
      .list-lis-title{
        width: 100%;
        img{
          width: 100%;
        }
      }
      ul{
        margin-top: .25rem;
        padding: 0 .49rem;
        li{
          float: left;
          width: 2.99rem;
          /* height: 4.95rem; */
          margin-right: .4rem;
          border: .04rem solid #fae4b3;
          margin-bottom: .38rem;
          box-sizing: border-box;
          border-bottom: none;
          &:nth-child(2n){
            margin-right: 0;
          }
          .lis-img{
            width: 2.5rem;
            height: 2.5rem;
            margin: 0 auto;
            /* padding: .1rem 0; */
            img{
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .lis-con{
            height: 2.25rem;
            box-sizing: border-box;
            background:-webkit-linear-gradient(left,#fae5b5,#fff7d6,#fae5b5);
            padding: .2rem;
            padding-bottom: 0;
            position: relative;
            .lis-title{
              color: #c62322;
              font-size: .26rem;
              display: -webkit-box;
              display: -moz-box;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
            .lis-price{
              display: flex;
              align-items: center;
              margin-top: .15rem;
              p:nth-child(1){
                color: #c62227;
                flex: 1;
                font-size: .3rem;
                i{
                  font-size: .24rem;
                }
              }
              p:nth-child(2){
                color: #c62227;
                font-size: .22rem;              
              }
            }
            .lis-btn{
              width: 2.15rem;
              height: .45rem;
              border: .03rem solid #fbe3c1;
              background: #cb272c;
              text-align: center;
              line-height: .45rem;
              border-radius: 40px;
              font-size: .26rem;
              color: #fae7be;
              margin: 0 auto;
              margin-top: .13rem;
              position: absolute;
              left: 0;
              right: 0;
              bottom: .2rem;
            }
          }
        }
      }
    }
    /* 分享说明 */
    .share-ins-btn{
      width: .53rem;
      height: 1.98rem;
      background: #fbe3c1;
      position: fixed;
      right: 0;
      top: 30%;
      z-index: 30;
      text-align: center;
      color: #51080e;
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
        border: .03rem solid #fbe3c1;
        box-sizing: border-box; 
        background: #da3a46;
        border-radius: 0px;
        padding: .2rem .25rem;
        box-sizing: border-box;
        text-align: left;
        .con-title{
          display: flex;
          justify-content: center;
          align-items: center;
          span{
            display: inline-block;
            margin: 0 .1rem;
            color: #fbe3c1;
            font-size: .36rem;
          }
          img{
            /* width: 1.49rem; */
            height: .16rem;
            &:nth-child(3){
              transform: rotate(-180deg);
              -webkit-transform: rotate(-180deg);
            }
          }
        }
        ul{
          margin-top: .4rem;
          max-height: 4rem;
          overflow: hidden;
          overflow-y: scroll;
          li{
            div:nth-child(1){
              color: #fbe3c1;
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
            div:nth-child(2){
              font-size: .28rem;
              color: #fff;
              margin: .3rem 0;
            }
          }
        }
      }
    }
    .noDataTip{
      color: #fff;
    }
  }
</style>