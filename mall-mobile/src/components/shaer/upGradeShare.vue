<template>
  <div>
    <!-- 分享内容 -->
    <div class="shareTxtDialog" id="shareTxtDialog">
      <img :src="goodsImg" alt="" class="bannerImg">
      <p class="info">{{shareInfo.propagandaInfo | textInterception(19)}}</p>
      <p class="detail">{{shareInfo.goodsName | textInterception(30)}}</p>
      <div>
        <span class="price">￥{{shareInfo.upgradePackagePrice | moneyFilter}}</span>
        <img src="../../assets/images/comtoUpgrade/bul.png" class="greengemImg">
        <span class="greengem">赠 {{shareInfo.sendGreenGemstoneNum }}</span>
      </div>
      <img src="../../assets/images/comtoUpgrade/coupon.png" class="couponImg">
      <div class="Qrcode">
        <qrcode :value="shareInfo.codeUrl" type="img" class="QrcodeImg" ></qrcode>
        <p>扫码立享优惠</p>
      </div>
    </div>
    <!-- 分享生成图片弹窗 -->
    <div v-if="show" >
      <div class="shareImageMask"></div>
      <div class="shareImageDialog">
        <img src="../../assets/images/comtoUpgrade/close.png" class="closeImg"  @click.prevent="hide">
        <img :src="shareInfo.dataURL" class="shareImgshow"/>
      </div>
    </div>
  </div>
</template>
<script>
import { XDialog, Qrcode } from 'vux'
export default {
  model: {
    prop: 'show',
    event: 'change'
  },
  props: ['shareInfo', 'show', 'goodsImg'],
  components: {
    XDialog,
    Qrcode
  },
  data () {
    return {
    }
  },
  mounted () {
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

<style lang="less">
  .shareImageMask{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0,0,0,.6);
    z-index: 100;
  }
  .shareTxtDialog, .shareImageDialog{
    position: fixed;
    max-width: 6.6rem;
    max-height: 7.96rem;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background-color: #FFFFFF;
    border-radius: 5px;
    text-align: left;
    z-index: 200;
    .closeImg{
      width: 0.52rem;
      height: 0.52rem;
      position: absolute;
      right: -0.24rem;
      top: -0.24rem;
    }
    .bannerImg{
      width: 6.12rem;
      height: 3.24rem;
      margin: 0 auto;
      display: block;
      margin-top: 0.5rem;
    }
    .couponImg{
      width: 4.55rem;
      height: 0.8rem;
      margin-top: 0.35rem;
      margin-left: 0.24rem;
    }
    .detail{
      margin-top: 0.14rem;
      margin-left: 0.24rem;
      font-size: 14px;
      height: .8rem;
      width: 6.2rem;
    }
    .info{
      width: 6.4rem;
      margin-top: 0.14rem;
      margin-left: 0.24rem;
    }
    .price{
      margin-top: 0.42rem;
      margin-left: 0.24rem;
      font-size: 15px;
      color: #e41019;
      display: inline-block;
      font-weight: bold;
    }
    .greengem{
      margin-left: 0.12rem;
      font-size: 15px;
    }
    .greengemImg{
      width: 11px;
      height: 15px;
      margin-left: 0.42rem;
    }
    .Qrcode{
      position: absolute;
      right: 0.25rem;
      bottom:0.4rem;
      .QrcodeImg img{
        width: 1rem!important;
        height: 1rem!important;
        left: 50%;
        margin-left: -0.5rem;
        position: absolute;
        bottom: 0.45rem;
      }
      p{
        font-size: 10px;
      }
    }
    .shareImgshow{
      max-width: 6.6rem;
      max-height: 7.96rem;
    }
  }
  .shareTxtDialog{
    left: -20rem;
  }
</style>
