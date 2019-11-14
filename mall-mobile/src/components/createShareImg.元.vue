<template>
    <div class="shareImageWrapper">
      <div class="sharePop">
        <div class="sharePop-title">{{ shareData.goodsName | textInterception(50)}}</div>
        <div class="sharePop-img">
          <img :src="shareData.mainImage | filterImgUrl">
        </div>
        <div class="sharePop-con">
          <div class="con-qrcode">
            <qrcode :value="shareData.codeUrl" type="img" class="ewm"></qrcode>
            <p>长按立即购买</p>
          </div>
          <div class="con-r">
            <div class="con-r-price">
              <template v-if="shareData.whetherShare">
                <div>¥{{shareData.goodsSharePrice | moneyFilter}}</div>
                <div>¥{{shareData.goodsPrice | moneyFilter}}</div>
              </template>
              <template v-else>
                <div>¥{{shareData.goodsPrice | moneyFilter}}</div>
              </template>
            </div>
            <ul>
              <li v-if="shareData.beInviterIfGetGoldPoints">
                <div>惠</div>
                <div>立即购买赠送{{shareData.beInviterGetGoldPoints}}个金币</div>
              </li>
              <li>
                <div>积</div>
                <div>在线支付赠送{{shareData.canGetPoint}}消费积分</div>
              </li>
              <li v-if="shareData.whetherBlancePay === 1">
                <div>余</div>
                <div>可以用余额支付</div>
              </li>
            </ul>
          </div>
        </div>
      </div>  
    </div>
</template>
<script>
import { XDialog, Qrcode } from 'vux'           // 轮播图
export default {
  model: {
    prop: 'show',
    event: 'change'
  },
  props: ['shareData'],
  components: {
    XDialog,
    Qrcode
  }
}
</script>

<style lang=less>
  .shareImageWrapper{
    width: 6.6rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1;
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
                font-size: .26rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }

      }
    }
  }
</style>
