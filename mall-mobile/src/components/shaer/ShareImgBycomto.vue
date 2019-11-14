<template>
  <div>
    <!-- 分享内容 -->
    <div class="shareImageWrapper" >
      <div class="sharePop">
        <div class="sharePop-title">
          <img />
        </div>
      </div>
      <div class="sharePop-cent">
        <div class="goodsName">
          <p>快来17.5元拼【爆卖1千万包】清风金装抽纸3层130抽婴儿...</p>
        </div>
        <div class="price-wrap" >
            <div class="normal-price">
              <span>
                <i>¥</i>
               1304
              </span>
              <div class="icon" >
                <i>
                  <img src="../../assets/images/comtoUpgrade/bul.png"/>
                </i>
                赠
                1000 +
              </div>
            </div>
            <!--<div class="spliceNumber" v-show="footerDate.luckyHasSnatchCount">-->
            <!--{{pageType == 9 ? '已抢购数量':'已批发数量'}}: {{footerDate.luckyHasSnatchCount}} 件-->
            <!--</div>-->
          </div>
      </div>
      <div class="bottom">
        <div class="botRight">
<!--          <div class="botText"><p>快来17.5元拼【爆卖1千万包】清风金装抽纸3层130抽婴儿...</p></div>-->
          <div class="botFree">
            <div class="item bot1">立减10元</div>
            <div class="item bot2">省80%</div>
          </div>
          <div class="monyeBox">
            <p><span class="price"> <span>¥</span> 33976</span> <span class="linePrice">¥ 33976</span> </p>
          </div>
        </div>
        <div class="botLeft">
          <div class="pop-box">
            <div class="con-qrcode">
              <qrcode value="www.baidu.com" type="img" class="ewm" :size="size"></qrcode>
              <p>扫码立享拼团价</p>
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
        <img  class="main-img" >
        <div class="bot">
          <!--<div class="tujian">-->
            <!--链接推荐: {{shareData.codeUrl}}-->
          <!--</div>-->
          <!--<div class="coy" v-bind:data-clipboard-text="shareData.codeUrl">-->
            <!--复制链接-->
          <!--</div>-->
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
import Clipboard from 'clipboard' // 复制
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
      aaacreat: '',
      size: 0
    }
  },
  mounted () {
    /**
     * 复制链接到粘贴板
     */
    const clipboard = new Clipboard('.coy')
    clipboard.on('success', (e) => {
      this.$vux.toast.show({
        text: '复制成功',
        type: 'text',
        position: 'middle'
      })
    })
    let fontSize = localStorage.getItem('fontSize')
    // 单位换算 1.1rem 换算成 px
    this.size = 1.4 * fontSize
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
    top: 1rem;
    left: 0rem;
    margin: auto;
    z-index: 1;
    background: white;
    box-sizing: border-box;
    padding: .2rem;
    .titel{
      text-align: center;
      font-size: .28rem;
      color: #999;

      .name{
        font-size: .36rem;
        font-weight: bold;
        line-height: .45rem;
        color: #000000;
      }
    }

    .sharePop{
      width: 6.11rem;
      max-height:3.25rem;
      min-height: 3.25rem;
      margin: auto;
      border: 1px dashed #999;
      overflow: hidden;
      margin-top: .2rem;
      margin-bottom: .2rem;
      img{
        max-width: 6.11rem;
        height: auto;
      }
    }

    .bottom{
      display: flex;
      flex-direction: row;
      .botLeft{
        margin-right: .2rem;
        .con-qrcode{
          font-size: .24rem;
          color: #999;
        }
      }

      .botRight{
        font-size: .28rem;
        color: #333333;

        .botText{
          width: 100%;
          height: .7rem;
          line-height: .35rem;
          overflow: hidden;
        }

        .botFree{
          display: flex;
          flex-direction: row;
          width: 2.86rem;
          justify-content:space-between;
          margin-top: .2rem;
          margin-bottom: .3rem;
          .item{
            background: white;
            box-sizing: border-box;
            font-size: .24rem;
            width: 1.43rem;
            line-height: .4rem;
            text-align: center;
          }
          .bot1{
            border-radius: .2rem 0px 0px 0px;
            background: #F82828;
            color: white;
          }
          .bot2{
            border-radius: 0px .2rem .2rem 0px;
            border: 1px solid #F82828;
            color: #F82828;
          }
        }

        .monyeBox{
          .price{
            font-size: .32rem;
            font-weight: bold;
            color: #F82828;
            span{
              font-size: .24rem;
              font-weight: normal;
            }
          }

          .linePrice{
            text-decoration: line-through;
            color: #999;
            font-size: .28rem;
            margin-left: .2rem;
          }
        }
      }
    }

    .price-wrap{
      position: relative;
      .normal-price{
        display: flex;
        align-items: center;
        span:nth-child(1){
          display: block;
          color:#f23030;
          font-size: 0.28rem;
          padding:0.2rem 0;
          font-weight: bold;
          margin-right: .2rem;
          i{
            font-size: .28rem;
            font-weight: bold;
          }
        }
        span:nth-child(2){
          display: block;
          margin-left: .15rem;
          color: #ccc;
          font-size: .24rem;
          text-decoration: line-through;
        }
        .icon{
          text-decoration:none;
          color: #f23030;
          margin-left: .1rem;
          font-size: .24rem;
          font-weight: bold;
          img{
            width: .3rem;
            height: .3rem;
            border-radius: .2rem;
          }
        }
      }
      .actiy-price{
        display: flex;
        align-items: center;
        margin-top: .1rem;
        .price-num{
          flex: 1;
          div:nth-child(1){
            display: flex;
            align-items: center;
            margin-bottom: .05rem;
            .num-tag{
              padding: .03rem .15rem;
              font-size: .24rem;
              background: #ccc;
              color: #fff;
              margin-right: .1rem;
            }
            .num-p{
              color: #f23030;
              font-size: .24rem;
            }
          }
          div:nth-child(2){
            color: #ccc;
            font-size: .24rem;
            text-decoration: line-through;
          }
        }
        .price-save{
          background: #f23030;
          color: #fff;
          height: .55rem;
          line-height: .55rem;
          padding: 0 .2rem;
          border-radius: 30px;
          font-size: .28rem;
        }
      }

      .spliceNumber{
        position: absolute;
        right: 0rem;
        top: .3rem;
        color: #999999;
        font-size: .24rem;
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
      .bot{
        width: 5.5rem;
        height: .9rem;
        font-size: .3rem;
        line-height: .5rem;
        background: black;
        color: white;
        margin: auto;
        border-radius: .5rem;
        position: relative;
        bottom: 1.8rem;
        left: .08rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .tujian{
          width: 4rem;
          height: .5rem;
          white-space:nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-left: .2rem;
          font-size: .24rem;
        }
        .coy{
          background: white;
          color: #03111d;
          border-radius: .3rem;
          font-size: .24rem;
          width: 1.5rem;
          height: .5rem;
          margin-right: .2rem;
        }
      }
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
