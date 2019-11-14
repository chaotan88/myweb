<template>
  <div>
    <!-- 分享内容 -->
    <div class="shareImageWrapper" >
      <div class="sharePop">
        <div class="sharePop-title">
          <img :src="shareData.mainImage"/>
        </div>
        <div class="pop-box">
          <div class="con-qrcode">
            <p style="margin-bottom: .1rem">备注：扫码跳转到注册页面</p>
            <qrcode :value="shareData.codeUrl" type="img" class="ewm"></qrcode>
            <p style="margin-top: .1rem">(点击保存二维码)</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分享生成图片弹窗 -->
    <div class="share-pop-img" v-if="show">
      <div class="pop-mask" @click="hide"></div>
      <div class="pop-dialog" >
        <x-icon type="ios-close-empty" size="30" @click="hide" class="red"></x-icon>
        <img :src="shareData.dataURL" class="main-img">
        <div class="bot">
          <div class="tujian">
            链接推荐: {{shareData.codeUrl}}
          </div>
          <div class="coy" v-bind:data-clipboard-text="shareData.codeUrl">
            复制链接
          </div>
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
      aaacreat: ''
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
    left: -20rem;
    margin: auto;
    z-index: 1;
    .sharePop{
      width: 6.6rem;
      height: 7.9rem;
      margin: 0 auto;
      padding-bottom: .25rem;
      box-sizing: border-box;
      /* background: #fff; */
      border-radius: 6px;
      .sharePop-title{
        img{
          width: 100%;
          height: 8rem;
          display: block;
        }
      }
      .pop-box{
        height: auto;
        overflow: hidden;
        position: absolute;
        top: 30%;
        left: 50%;
        margin-left: -80px;
        margin-top: -75px;
        text-align: center;
        font-size: .24rem;
        color: #c09972;
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
