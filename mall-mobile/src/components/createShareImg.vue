<template>
  <div>
    <!-- 分享内容 -->
    <div class="shareImageWrapper" :class="{'welfarew': shareData.alertTpye == 'welfarew'}">
      <div class="sharePop">
        <div class="sharePop-title" v-show="shareData.alertTpye == 'purchase'">
          <img src="../assets/images/action/share-img-title.png">
        </div>
        <div class="sharePop-title" v-show="shareData.alertTpye == 'welfarew'" style="background: #ffffff">
          <p >{{ shareData.goodsName | textInterception(30)}}</p>
        </div>
        <div class="sharePop-title" v-show="shareData.alertTpye == 'licheng'" style="background: #ffffff">
          <p >{{ shareData.goodsName | textInterception(30)}}</p>
        </div>
        <div class="pop-box" v-show="shareData.alertTpye == 'welfarew' || shareData.alertTpye == 'purchase'">
          <div class="sharePop-img">
            <img :src="shareData.activityImage | filterImgUrl">
          </div>
          <div class="sharePop-con">
            <div class="con-qrcode">
              <qrcode :value="shareData.codeUrl" type="img" class="ewm"></qrcode>
              <p>长按立即购买</p>
            </div>
            <div class="con-r" v-show="shareData.alertTpye == 'purchase'" >
              <div class="con-r-title" ><p>{{ shareData.goodsName | textInterception(30)}}</p></div>
              <div class="con-r-price" >
                <template v-if="shareData.whetherShare">
                  <div>¥{{shareData.goodsSharePrice | moneyFilter}}</div>
                  <div>¥{{shareData.goodsPrice | moneyFilter}}</div>
                </template>
                <template v-else>
                  <div>¥{{shareData.goodsPrice | moneyFilter}}</div>
                </template>
              </div>
              <ul >
                <li v-if="shareData.beInviterIfGetGoldPoints">
                  <div>赠</div>
                  <div>购买即送{{shareData.beInviterGetGoldPoints}}个芯豆</div>
                </li>
                <!-- <li>
                  <div>积</div>
                  <div>在线支付赠送{{shareData.canGetPoint}}消费积分</div>
                </li>
                <li v-if="shareData.whetherBlancePay === 1">
                  <div>余</div>
                  <div>可以用余额支付</div>
                </li> -->
              </ul>
            </div>
            <div class="con-r just" v-show="shareData.alertTpye == 'welfarew'" style="padding-top: .3rem;box-sizing: border-box">
              <div class="con-r-price">
                <div v-if="shareData.tabIndex ==0">
                  <div v-if="shareData.whetherLeaguePrice">
                    <i>￥</i>{{shareData.goodsLeaguePriceFormat}}
                    <span v-if="shareData.goodsLeaguePoints">
                    +{{shareData.goodsLeaguePoints}}
                    {{shareData.pageType | filterPointsTxt}}
                  </span>
                  </div>
                  <div v-else>
                    ￥{{shareData.goodsPrice}}
                  </div>
                </div>
                <div v-if="shareData.tabIndex ==1">
                  <div v-if="shareData.whetherBonusPrice">
                    <i>￥</i>{{shareData.goodsBonusPriceFormat}}
                    <span v-if="shareData.goodsBonusPoints">
                    +{{shareData.goodsBonusPoints}}
                    {{shareData.pageType | filterPointsTxt}}
                  </span>
                  </div>
                  <div v-else>
                    ￥{{shareData.goodsPrice}}
                  </div>
                </div>
                <div v-if="shareData.tabIndex ==2">
                  <div v-if="shareData.whetherGoldBeanPrice">
                    <i>￥</i>{{shareData.goodsGoldBeanPriceFormat}}
                    <span v-if="shareData.goodsGoldBeanNum">
                    +{{shareData.goodsGoldBeanNum}}
                    {{shareData.pageType | filterPointsTxt}}
                  </span>
                  </div>
                  <div v-else>
                    ￥{{shareData.goodsPrice}}
                  </div>
                </div>
              </div>
              <div class="old-price" style="" v-show="shareData.tabIndex ==0">{{(shareData.whetherLeaguePrice && shareData.goodsPrice) ? '￥' + shareData.goodsPrice : '' }}</div>
              <div class="old-price" style="" v-show="shareData.tabIndex ==1">{{(shareData.whetherBonusPrice && shareData.goodsPrice) ? '￥' + shareData.goodsPrice : '' }}</div>
              <div class="old-price" style="" v-show="shareData.tabIndex ==2">{{(shareData.whetherGoldBeanPrice && shareData.goodsPrice) ? '￥' + shareData.goodsPrice : '' }}</div>
            </div>
          </div>
        </div>



        <div class="pop-box" v-show="shareData.alertTpye == 'licheng'">
          <div class="sharePop-img">
            <img :src="shareData.mainImage | filterImgUrl">
          </div>
          <div class="sharePop-con">
            <div class="con-qrcode">
              <qrcode :value="shareData.codeUrl" type="img" class="ewm"></qrcode>
              <p>长按立即购买</p>
            </div>
            <div class="con-r" v-show="shareData.alertTpye == 'licheng'" >
              <!--<div class="con-r-title" ><p>{{ shareData.goodsName | textInterception(30)}}</p></div>-->
              <!--<p style="color: #999;font-size: 0.23rem;">购买<span style="color: #f97b3d;">1</span>件获赠<span style="color: #f97b3d;">{{shareData.purchaseNum}}</span>个名额</p>-->
              <div class="con-r-price" >
                <!--<template v-if="shareData.licheng">-->
                  <!--<div>¥{{shareData.goodsSharePrice | moneyFilter}}</div>-->
                  <!--<div>¥{{shareData.goodsPrice | moneyFilter}}</div>-->
                <!--</template>-->
                <!--<template v-else>-->
                  <!--<div>¥{{shareData.goodsPrice | moneyFilter}}</div>-->
                <!--</template>-->
                <template>
                  <div style="margin: 0.13rem 0 0.22rem 0;">¥{{shareData.purchasePrice | moneyFilter}}<b class="gaiBug">¥{{shareData.goodsPrice | moneyFilter}}</b></div>
                </template>
              </div>
              <!--<span class="wanOf"><b>赚</b>卖出，即赚{{shareData.grabTicketGive}}元</span>-->
              <div class="gainima">
                <span>赠送{{shareData.grabTicketGive}}批发券</span>
                <img :src="aaacreat"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分享生成图片弹窗 -->
    <div class="share-pop-img" v-if="show">
      <div class="pop-mask" @click="hide"></div>
      <div class="pop-dialog" >
        <x-icon type="ios-close-empty" size="30" @click="hide" class="red"></x-icon>
        <img :src="shareData.dataURL" class="main-img" :class="{'welfarew': shareData.alertTpye == 'welfarew'}">
        <div class="iconBox" v-if="shareData.zhuan > 0">
          <div class="icon">赚</div>
          <div class="text">分享赚{{shareData.zhuan}}元</div>
        </div>
        <div class="sharePop-tip">
          <img src="../assets/images/action/share-jianotu.png">
          <p>长按上图保存图片，或发送给朋友 </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * @shareData 分享展示的数据
 * @show是否显示生成的分享图片
*/
import { XDialog, Qrcode } from 'vux'           // 轮播图
export default {
  model: {
    prop: 'show',
    event: 'change'
  },
  props: ['shareData', 'show'],
  components: {
    XDialog,
    Qrcode
  },
  data () {
    return {
      aaacreat: require('../assets/images/aaacreat.png')
    }
  },
  methods: {
    /**
     * 关闭弹窗
    */
    hide () {
      this.$emit('change', false)
    }
  }
}
</script>

<style lang=less>
  .shareImageWrapper{
    width: 6.6rem;
    position: absolute;
    top: -20rem;
    left:-20rem;
    margin: auto;
    z-index: 1;
    .sharePop{
      width: 6.6rem;
      margin: 0 auto;
      padding-bottom: .25rem;
      box-sizing: border-box;
      /* background: #fff; */
      border-radius: 6px;
      .sharePop-title{
        img{
          width: 100%;
          height: 1.4rem;
          display: block;
        }

        p{
          text-indent: .2rem;
          padding-top: .2rem;
          padding-bottom: .2rem;
          max-height: 2.2em;
          width: 95%;
          margin: auto;
          overflow: hidden;
        }
      }
      .pop-box{
        height: auto;
        overflow: hidden;
        background: #fff;
      }
      .sharePop-img{
        width: 6.6rem;
        img{
          width: 6rem;
          height: 6rem;
          display: block;
          margin: 0 auto;
        }
      }
      .sharePop-con{
        display: flex;
        padding: 0 .3rem;
        margin-top: .15rem;
        background: #fff;
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
            margin: .2rem 0;
          }
        }
        .con-r{
          flex:1;
          overflow: hidden;
          .con-r-price{
            display: flex;
            align-items: center;
            /* border-bottom: .04rem solid #f2f0f0; */
            padding-bottom: .08rem;
            /*margin-bottom: .13rem;*/
            position: relative;
            div:nth-child(1){
              color: #f53d4b;
              font-size: .36rem;
              /* flex:1; */
            }
            div:nth-child(2){
              color: #999999;
              font-size: .28rem;
              text-decoration: line-through;
              margin-left: .2rem;
            }
            .gaiBug{
              font-size: 0.24rem;
              color: #928e8e;
              text-decoration: line-through;
            }
          }
          .wanOf{
            /*padding: 0.03rem 0.20rem;*/
            width: 2rem;
            height: 0.27rem;
            border: 1px solid #fc493c;
            border-bottom-left-radius: 0.4rem;
            border-bottom-right-radius: 0.2rem;
            border-top-right-radius: 0.2rem;
            color: #ed3842;
            text-align: center;
            font-size: 0.20rem;
            margin-top: 0.18rem;
            b{
              /*display: inline-block;*/
              /*width: 0.27rem;*/
              /*height: 0.27rem;*/
              background: #ed3842;
              color: #fff;
              height: 0.27rem;
              line-height: 0.27rem;
              text-align: center;
              padding-left: 0.15rem;
              padding-right: 0.15rem;
              border-bottom-left-radius: 0.4rem;
            }
          }
          .gainima{
            width: 100%;
            height: 1.21rem;
            position: relative;
            span{
              position: absolute;
              left: 0.7rem;
              top: 0.15rem;
              font-size: 0.35rem;
              color: #ffebd0;
            }
            img{
              width: 100%;
              height: 100%;
            }
          }
          .old-price{
            text-decoration: line-through;
            font-size: .28rem;
            color: #999;
          }
          .just{
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          ul{
            li{
              display: flex;
              align-items: center;
              height: .25rem;
              margin-bottom: .1rem;
              /* &:nth-child(2){
                div:nth-child(1){
                  background: #ef685d;
                }
              }
              &:nth-child(3){
                div:nth-child(1){
                  background: #f29189;
                }
              } */
              div:nth-child(1){
                width: .46rem;
                height: .28rem;
                background: #ea3346;
                border-bottom-left-radius: 10px;
                text-align: center;
                line-height: .28rem;
                color: #fff;
                font-size: .2rem;
              }
              div:nth-child(2){
                height: .24rem;
                line-height: .24rem;
                border: .02rem solid #ea3346;
                border-top-right-radius: 20px;
                border-bottom-right-radius: 20px;
                /* flex: 1; */
                color: #ed3842;
                font-size: .2rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 0 .1rem;
              }
            }
          }
        }

      }
    }
  }
  /* 分享弹窗图片 */
  .share-pop-img{
    .main-img{
      width: 100%;
    }
    .pop-mask{
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0,0,0,.6);
    }
    .pop-dialog{
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
      background-color: #fff;
      text-align: center;
      border-radius: 3px;
      max-width: 6.5rem;
      width: 100%;
      height: 50%;
      background-color: transparent;
      .red{
        background-color: #f29189;
        color: #ffffff;
        border-radius: 20px;
        position: absolute;
        right: -0.3rem;
        top: -0.3rem;
      }

      .iconBox{
        position: absolute;
        bottom: .5rem;
        right: 0px;
        display: flex;
        flex-direction: row;
        background: #f53d4b;
        padding: .05rem .2rem .05rem .2rem;
        border-radius: .3rem 0rem 0rem .3rem;
        .icon{
          width: .35rem;
          height: .35rem;
          border-radius: .35rem;
          font-size: .24rem;
          background: #f4a52a;
          color: white;
          text-align: center;
          line-height: .35rem;
          margin-right: .2rem;
        }

        .text{
          font-size: .24rem;
          color: white;
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
    }
  }
  .welfarew{
    border-radius: 6px;
  }

  .vux-x-icon {
    fill: #fff;
  }
</style>
