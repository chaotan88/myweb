<template>
  <div>
    <!-- 分享内容 -->
    <div class="shareImageWrapper" :class="{'welfarew': shareData.alertTpye == 'group'}">
      <div class="sharePop">
        <div class="sharePop-title" v-show="shareData.alertTpye == 'group'" style="background: #ffffff">
          <div>{{shareData.groupDisseminate | textInterception(12)}}</div>
          <div>限时拼团|<span>{{shareData.endTime | publicTimeNoYear}}</span>结束</div>
          <div>新人注册立赠拼团优惠券</div>
        </div>
        <div class="pop-box" v-show="shareData.alertTpye == 'group'">
          <div class="sharePop-img">
            <img :src="shareData.mainImage | filterImgUrl">
          </div>
          <div class="sharePop-con">
            <div class="con-qrcode">
              <qrcode :value="shareData.codeUrl" type="img" class="ewm"></qrcode>
              <p>长按立即购买</p>
            </div>
            <div class="con-info" v-show="shareData.alertTpye == 'group'" >
              <div class="groupText">
                {{shareData.goodsName | textInterception(26)}}
              </div>
              <div class="wanOf">
                <div>立减<span>{{shareData.goodsPrice - shareData.goodsGroupPrice}}</span>元</div>
                <div>省<span>{{parseInt(((shareData.goodsPrice - shareData.goodsGroupPrice) / shareData.goodsPrice * 100))}} %</span></div>
              </div>
              <div class="showOf">
                ¥{{shareData.goodsGroupPrice | moneyFilter}}
                <div class="hide-p">¥{{shareData.goodsPrice | moneyFilter}}</div>
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
        <img :src="shareData.dataURL" class="main-img" :class="{'welfarew': shareData.alertTpye == 'group'}">
        <div class="iconBox" v-if="shareData.zhuan > 0">
          <div class="icon">赚</div>
          <div class="text">分享赚{{shareData.zhuan}}元</div>
        </div>
        <div class="sharePop-tip">
          <img src="../../assets/images/action/share-jianotu.png">
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
      aaacreat: require('../../assets/images/aaacreat.png')
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
        div{
          text-indent: .2rem;
          width: 95%;
          margin: auto;
          overflow: hidden;
          text-align: center;
          &:nth-of-type(1) {
            font-size: 0.36rem;
            color: #000;
            font-weight: 600;
            padding: 0.13rem 0 0.2rem 0;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          &:nth-of-type(2) {
            padding: 0 0.2rem 0.1rem 0.2rem;
          }
          &:nth-of-type(3) {
            min-width: 2.8rem;
            max-width: 3.4rem;
            -webkit-border-radius: 0.16rem;
            -moz-border-radius: 0.16rem;
            border-radius: 0.16rem;
            background: #f82828;
            font-size: 0.2rem;
            color: #fff;
            text-align: center;
            padding: 0 0.1rem 0 0;
          }
        }
      }
      .pop-box{
        height: auto;
        overflow: hidden;
        background: #fff;
      }
      .sharePop-img{
        width: 6.6rem;
        margin-top: 0.1rem;
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
        .con-info{
          flex:1;
          .groupText{
            width: 4rem;
            height: 0.8rem;
            line-height: 0.4rem;
            color: #333;
            font-size: 0.28rem;
            padding-right: 0.1rem;
            overflow: hidden;
          }
          .wanOf{
            width: 2.65rem;
            height: 0.36rem;
            border: 1px solid #fc493c;
            border-bottom-left-radius: 0.4rem;
            border-bottom-right-radius: 0.2rem;
            border-top-right-radius: 0.2rem;
            color: #ed3842;
            text-align: center;
            font-size: 0.20rem;
            display: flex;
            margin-top: .15rem;
            div{
              &:nth-of-type(1) {
                width: 1.43rem;
                height: 0.36rem;
                line-height: 0.36rem;
                background: red;
                color: #fff;
                border-bottom-left-radius: 0.4rem;
              }
              &:nth-of-type(2) {
                width: 1.22rem;
                height: 0.36rem;
                line-height: 0.36rem;
              }
            }
          }
          .showOf{
            margin-top: 0.2rem;
            color: #F82828;
            font-size: 0.42rem;
            display: flex;
            align-items: center;
            .hide-p{
              font-size: 0.24rem;
              color: #666;
              text-decoration: line-through;
              margin-left: 0.1rem;
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
