<template>
  <div>
    <!--nfc-->
    <div class="nfcInfo">
      <p class="title01">NFC防伪溯源信息</p>
      <div class="visitorNum">
        <div class="sumNum">
          <p>总访问</p>
          <p>{{originsNfcData.readNumTotalx}}次</p>
        </div>
        <div class="sumCheck">
          <p>总验证</p>
          <p>{{originsNfcData.verifyNumTotalx}}次</p>
        </div>
        <div class="sumVisit">
          <div class="sumVisit-top">商品访问：<span>{{originsNfcData.readNumx}}次</span></div>
          <div class="sumVisit-bottom">商品验证：<span>{{originsNfcData.verifyNumx}}次</span></div>
        </div>
      </div>
    </div>
    <!--区块链详情-->
    <div class="bitInfo">
      <p class="title02">区块链溯源信息</p>
      <div class="pro_mean">
        <div class="pro_tip">交易哈希</div>
        <div class="pro_num">{{originsBaseInfoData.transactionHash}}</div>
      </div>
      <div class="pro_Time">
        <div class="pro_Time-left">
          <p>发生时间</p>
          <p>{{originsBaseInfoData.happenTime | publicTime}}</p>
        </div>
        <div class="pro_Time-right">
          <p>提交时间</p>
          <p>{{originsBaseInfoData.submitTime | publicTime}}</p>
        </div>
      </div>
      <div class="pro_Code">
        <p>产品编号</p>
        <p>{{originsBaseInfoData.productCode}}</p>
      </div>
      <div class="pro_haxi">
        <p>业务哈希</p>
        <div class="haxi_txt">{{originsBaseInfoData.businessHash}}</div>
      </div>
    </div>
    <!--banner图-->
    <div class="bannerInfo">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(ite, ind) in originsBlockListData" :key="ind" class="bannerSli">
          <a>
            <p class="decTitle">描述信息</p>
            <p class="dectime">发生时间：{{ite.happenTime | publicTime}}</p>
            <p class="decInfo">事件描述：{{ite.eventDesc}}</p>
          </a>
        </swiper-slide>
      </swiper>
    </div>
    <!--所在区块-->
    <div class="areaInfo">
      <p class="title03">所在区块</p>
      <div class="areaList">
        <div class="areaList_left">
          <p>区块哈希</p>
          <div class="area_h">{{originsBaseInfoData.blockHash}}</div>
        </div>
        <div class="areaList_right">
          <div class="areaList_rightTop">
            <p>区块高度</p>
            <p>{{originsBaseInfoData.blockHeight}}</p>
          </div>
          <div class="areaList_rightBottom">
            <p>生成时间</p>
            <p>{{originsBaseInfoData.generateTime | publicTime}}</p>
          </div>
        </div>
      </div>
      <div class="area_Z">业务流转溯源</div>
    </div>

    <!--节点信息-->
    <div class="nodeInfo">
      <div v-for="(items, index) in originsBusinessListData" :key="index">
        <div class="node_title">{{items.originsName}}</div>
        <div v-for="(ites, inds) in items.originsInfoDetailList" v-if="ites.infoType === 2">
          <div class="node_mintitle">{{ites.infoContent}}</div>
          <div v-for="(ad, ink) in ites.imagesList" :key="ink" class="node_minImg" v-if="ites.infoType === 2">
            <img :src="ad"/>
          </div>
          <div v-if="ites.infoType !== 2" class="infoTypeNo2">{{ites.originsContent}}</div>
        </div>
        <div v-for="(ites, inds) in items.originsInfoDetailList" v-if="ites.infoType !== 2" class="flexCss">
          <div class="node_mintitle">{{ites.infoContent}}</div>
          <div v-for="(ad, ink) in ites.imagesList" :key="ink" class="node_minImg" v-if="ites.infoType === 2">
            <img :src="ad"/>
          </div>
          <div v-if="ites.infoType !== 2" class="infoTypeNo2">{{ites.originsContent}}</div>
        </div>
      </div>
    </div>

    <!--最新访问记录-->
    <div class="newInfo">
      <p class="title07">最新访问记录</p>
      <ul>
        <li v-for="(item, index) in originsAccessLogListData" :key="index">
          <p>发生时间：<span>{{item.happenTime | publicTime}}</span></p>
          <p>IP地址：<span>{{item.ipAdress}}</span></p>
          <p>地区：<span>{{item.region}}</span></p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem } from 'vux'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import swipcss from 'swiper/dist/css/swiper.css'
  export default {
    name: 'trace',
    components: {
      Tab,
      TabItem,
      Sticky,
      Divider,
      XButton,
      Swiper,
      SwiperItem,
      swiper,
      swiperSlide,
      swipcss
    },
    data () {
      return {
        swiperOption: {
          // notNextTick: true,
          // loop: true,
          // initialSlide: 0,
          // autoplay: 1000,
          // slidesPerView: 'auto',
          // spaceBetween: 20,
          // speed: 800,
          // 左右点击
          prevButton: '.swiper-button-prev',
          nextButton: '.swiper-button-next'
        },
        originsBlockListData: [
          {
            happenTime: '2018-09-21',
            eventDesc: '事件描述'
          },
          {
            happenTime: '2018-09-21',
            eventDesc: '事件描述'
          }
        ],
        originsNfcData: [],           // 防伪溯源信息
        originsBaseInfoData: [],      // 哈希信息
        originsBusinessListData: [],  // 节点信息
        originsAccessLogListData: []  // 最新访问记录
      }
    },
    computed: {
    },
    mounted: function () {
      this.getGoodsProductOriginsDetail()
    },
    created () {
    },
    methods: {
      getGoodsProductOriginsDetail () {
        this.$http.post(this.api.getGoodsProductOriginsDetail, {
          goodsId: '7030',
          ipAdress: '113.89.150.226'
        }).then((res) => {
          let resData = res.data
          if (resData.status === '1') {
            // console.log(resData)
            this.originsNfcData = resData.data.originsNfc
            this.originsBaseInfoData = resData.data.originsBaseInfo
            this.originsBlockListData = resData.data.originsBlockList
            this.originsBusinessListData = resData.data.originsBusinessList
            // console.log(this.originsBusinessListData)
            this.originsAccessLogListData = resData.data.originsAccessLogList
          }
        })
      }
    },
    watch: {
      // shareData (newVal, oldVal) {
      //   // console.log(newVal, oldVal)
      // }
    }
  }
</script>
<style scoped lang=less>
  /*nfc*/
  .nfcInfo{
    width: 7.14rem;
    height: auto;
    padding: 0 0.18rem 0 0.18rem;
    .title01{
      margin-top: 0.35rem;
      margin-bottom: 0.2rem;
      color: #626262;
      font-size: 0.3rem;
      font-weight: 600;
    }
    .visitorNum{
      width: 100%;
      height: 1.8rem;
      display: flex;
      justify-content: space-around;
      .sumNum{
        width: 2.1rem;
        height: 1.8rem;
        background: linear-gradient(right, #4084fe, #4f88fc);
        border-radius: 0.2rem;
        text-align: center;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        p:first-child{
          color: #fff;
        }
        p:last-child{
          color: #ffec50;
        }
      }
      .sumCheck{
        width: 2rem;
        height: 1.8rem;
        background: linear-gradient(right, #5a89fa, #7890f5);
        border-radius: 0.2rem;
        text-align: center;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        p:first-child{
          color: #fff;
        }
        p:last-child{
          color: #ffec50;
        }
      }
      .sumVisit{
        width: 2.9rem;
        height: 1.8rem;
        .sumVisit-top{
          width: 2.9rem;
          height: 0.88rem;
          background: linear-gradient(right, #b067e9, #c682e2);
          border-radius: 0.2rem;
          line-height: 0.88rem;
          text-align: center;
          color: #fff;
          span{
            color: #ffec50;
          }
        }
        .sumVisit-bottom{
          width: 2.9rem;
          height: 0.88rem;
          background: linear-gradient(right, #f99490, #fdab82);
          border-radius: 0.2rem;
          margin-top: 0.04rem;
          line-height: 0.88rem;
          text-align: center;
          color: #fff;
          span{
            color: #ffec50;
          }
        }
      }
    }
  }
  /*bitInfo*/
  .bitInfo{
    width: 7.14rem;
    height: auto;
    padding: 0 0.18rem 0 0.18rem;
    .title02{
      margin-top: 0.35rem;
      margin-bottom: 0.2rem;
      color: #626262;
      font-size: 0.3rem;
      font-weight: 600;
    }
    .pro_mean{
      display: flex;
      .pro_tip{
        width: 0.7rem;
        min-height: 0.7rem;
        color: #5088fc;
        font-size: 0.29rem;
        margin-right: 0.29rem;
      }
      .pro_num{
        flex: 1;
        height: 0.8rem;
        white-space: normal;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        line-height: 0.4rem;
        color: #618bf9;
      }
    }
    .pro_Time{
      display: flex;
      justify-content: space-between;
      margin-top: 0.33rem;
      .pro_Time-left{
        p:first-child{
          font-size: 0.24rem;
          color: #a8a8a8;
        }
        p:last-child{
          font-size: 0.25rem;
          color: #616161;
          margin-top: 0.3rem;
        }
      }
      .pro_Time-right{
        p:first-child{
          font-size: 0.24rem;
          color: #a8a8a8;
        }
        p:last-child{
          font-size: 0.25rem;
          color: #616161;
          margin-top: 0.3rem;
        }
      }
    }
    .pro_Code{
      margin-top: 0.44rem;
      p:first-child{
        font-size: 0.24rem;
        color: #a8a8a8;
      }
      p:last-child{
        font-size: 0.25rem;
        color: #616161;
        margin-top: 0.3rem;
      }
    }
    .pro_haxi{
      margin: 0.44rem 0;
      p:first-child{
        font-size: 0.24rem;
        color: #a8a8a8;
      }
      .haxi_txt{
        font-size: 0.25rem;
        color: #616161;
        margin-top: 0.3rem;
        width: 100%;
        white-space: normal;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        color: #5e8bf9;
      }
    }
  }

  /*bannerInfo*/
  .bannerInfo{
    height: 1.7rem;
    width: 7.14rem;
    padding: 0.26rem 0.18rem 0.26rem 0.18rem;
    background: #eaeaea;
    .swiper-slide{
      width: 76%!important;
      background: linear-gradient(right, #4285fe, #7b91f4);
      padding: 0 6% 0 2%;
    }
    .bannerSli{
      border-radius: 0.1rem;
      color: #fff;
      .decTitle{
        color: #fff;
        font-weight: 600;
        font-size: 0.28rem;
        margin-top: 0.17rem;
        text-align: center;
      }
      .dectime, .decInfo{
        color: #fff;
        font-size: 0.2rem;
        margin-top: 0.17rem;
        margin-left: 0.18rem;
      }
      .decInfo{
        margin-bottom: 0.17rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  /*所在区块*/
  .areaInfo{
    width: 7.14rem;
    height: auto;
    padding: 0 0.18rem 0 0.18rem;
    margin-bottom: 0.2rem;
    .title03{
      margin-top: 0.35rem;
      margin-bottom: 0.2rem;
      color: #626262;
      font-size: 0.3rem;
      font-weight: 600;
    }
    .areaList{
      width: 100%;
      height: 2.48rem;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.38rem;
      .areaList_left{
        width: 4.83rem;
        height: 2.48rem;
        background: linear-gradient(right, #5689fb, #728ff6);
        border-radius: 0.2rem;
        text-align: center;
        p{
          margin-top: 0.45rem;
          font-size: 0.29rem;
          color: #fff;
          font-weight: 600;
        }
        .area_h{
          width: 4.3rem;
          font-size: 0.2rem;
          margin-left: 0.32rem;
          margin-top: 0.23rem;
          line-height: 0.31rem;
          color: #fff;
          white-space: normal;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
      }
      .areaList_right{
        width: 2.22rem;
        height: 2.48rem;
        border-radius: 0.2rem;
        color: #fff;
        .areaList_rightTop{
          width: 2.22rem;
          height: 1rem;
          background:linear-gradient(to bottom right,#d08dde, #b067e9);
          border-radius: 0.2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .areaList_rightBottom{
          width: 2.22rem;
          height: 1.39rem;
          background:linear-gradient(to bottom right,#fdac82, #f99391);
          border-radius: 0.2rem;
          margin-top: 0.08rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
      }
    }
    .area_Z{
      background: linear-gradient(top, #4d87fc,#7490f5);
      padding: 0.2rem 0 0.2rem 0.1rem;
      border-radius: 0.2rem;
      color: #fff;
    }
  }
  /*节点信息*/
  .nodeInfo{
    width: 7.14rem;
    height: auto;
    padding: 0 0.18rem 0 0.18rem;
    .node_title{
      margin-top: 0.35rem;
      margin-bottom: 0.2rem;
      color: #626262;
      font-size: 0.3rem;
      font-weight: 600;
    }
    .flexCss{
      display: flex;
      justify-content: space-between;
    }
    .node_mintitle{
      font-size: 0.28rem;
      color: #a2a2a2;
    }
    .infoTypeNo2{
      color: #616161;
      max-width: 3rem;
      white-space: normal;
      overflow: hidden;
      display: -webkit-box;
      /*-webkit-line-clamp: 3;*/
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
    .node_minImg{
      width: 100%;
      height: auto;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  /*最新访问记录*/
  .newInfo{
    /*width: 7.5rem;*/
    height: auto;
    padding: 0 0.18rem 0 0.18rem;
    .title07{
      margin-top: 0.35rem;
      margin-bottom: 0.2rem;
      color: #626262;
      font-size: 0.3rem;
      font-weight: 600;
    }
    ul{
      li{
        background: #f8f8f8;
        border-bottom: 0.05rem solid #fff;
        padding-left: 0.19rem;
        p:first-child{
          padding-top: 0.24rem;
          font-size: 0.24rem;
          color: #a2a2a2;
          span{
            font-size: 0.28rem;
            color: #616161;
          }
        }
        p:nth-of-type(2){
          margin-top: 0.24rem;
          font-size: 0.24rem;
          color: #a2a2a2;
          span{
            font-size: 0.28rem;
            color: #616161;
          }
        }
        p:nth-of-type(3){
          margin: 0.24rem 0 0.27rem 0;
          font-size: 0.24rem;
          color: #a2a2a2;
          span{
            font-size: 0.28rem;
            color: #616161;
          }
        }
      }
    }
  }
</style>

