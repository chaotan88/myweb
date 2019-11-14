<template>
  <div class="partner-recommended-wrap">
    <!-- 用户信息 -->
    <dl class="user-wrap">
      <dt><img :src="recommendData.ruleIcon | filterImgUrl" v-if="recommendData.ruleIcon"></dt>
      <dd><x-icon type="ios-arrow-down" class="icon-red" size="0.2rem"></x-icon>{{recommendData.ruleName}}</dd>
    </dl>

    <!-- 收益 -->
    <div class="profit-wrap">
      <div class="title">
        推荐好友成交可获得
        <span class="point point-l"></span>
        <span class="point point-r"></span>
      </div>
      <div class="profit-cen">
        <table>
          <tr>
            <td>直接推荐收益<div class="line"><span></span></div></td>
            <td>
              <div>
                 通用积分：
                <span v-if="recommendData.cashRate">{{recommendData.cashRate}}%</span>
                <span v-else>--</span>
              </div>
              <div>
                 消费积分：
                  <span v-if="recommendData.consumePointRate">{{recommendData.consumePointRate}}%</span>
                  <span v-else>--</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>间接推荐收益<div class="line"><span></span></div></td>
            <td>
              <div>通用积分：{{recommendData.indirectCashRateMin}}-{{recommendData.indirectCashRateMax}}%</div>
              <div>消费积分：{{recommendData.indirectConsumePointRateMin}}-{{recommendData.indirectConsumePointRateMax}}%</div>
            </td>
          </tr>
          <tr>
            <td>加权现金分红<div class="line"><span></span></div></td>
            <td>
              <span v-if="recommendData.globalWeightRate">{{recommendData.globalWeightRate}}%</span>
              <span v-else>--</span>
            </td>
          </tr>
          <tr>
            <td>办公场地补贴<div class="line"><span></span></div></td>
            <td>
              <span v-if="recommendData.officeRate">{{recommendData.officeRate}}%</span>
              <span v-else>--</span>
            </td>
          </tr>
          <tr>
            <td>商品收益<div class="line"><span></span></div></td>
            <td>
              <span v-if="recommendData.goodsProfitRate">{{recommendData.goodsProfitRate}}%</span>
              <span v-else>--</span>
            </td>
          </tr>
          <tr>
            <td>芯片销售收益<div class="line"><span></span></div></td>
            <td>{{recommendData.chipRate}} *数量</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- 推荐二维码 -->
    <div class="code-wrap">
      <div class="show-code-ewm">
        <qrcode :value="codeUrl" type="img" class="ewm"></qrcode>
        <p>二维码推荐</p>
        <!-- <a @click="SaveAs5(codeUrl)" id="saveBtn">点击保存二维码</a> -->
      </div>
      <div class="extension-link">
        <div>链接推荐: {{codeUrl}}</div>
        <div class="copyBtn" v-bind:data-clipboard-text="codeUrl">复制链接</div>
      </div>
    </div>

    <div class="share-btn" @click="shareVisible = true">分享给好友</div>

    <div class="share-tips-wrap" @click="shareVisible = false" v-if="shareVisible"></div>

  </div>
</template>

<script>
import {Qrcode} from 'vux'
import Clipboard from 'clipboard' // 复制
export default {
  components: {Qrcode},

  data () {
    return {
      recommendData: '',      // 推荐合伙人数据
      shareVisible: false,    // 分享提示
      codeUrl: ''             // 二维码链接
    }
  },

  mounted () {
    /**
     * 复制链接到粘贴板
     */
    const clipboard = new Clipboard('.copyBtn')
    clipboard.on('success', (e) => {
      this.$vux.toast.show({
        text: '复制成功',
        type: 'text',
        position: 'middle'
      })
    })
    this.getRecommend()
  },

  methods: {
    /**
     * 获取合伙推荐人
     */
    getRecommend () {
      this.$http.post(this.api.recommendPartner).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          this.recommendData = resData.data
          // 拼接二维码url
          var codeUrl = window.location.href.match(/.*mshop/gi)[0] + '/partneRules?invitationCode=' + resData.data.extensionLink
          this.codeUrl = codeUrl
        }
      })
    }
  }
}
</script>

<style lang="less">
.partner-recommended-wrap{
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: 'microsoft yahei';
  height: 100%;
  padding: .9rem 0.4rem 0 0.4rem;
  background: #2f639d url(../../assets/images/partnerPlan/recommend-bg.jpg) no-repeat center top;
  background-size: 100%;

  /* -------------------- { 用户信息 } -------------------- */
  .user-wrap{
    margin-bottom: .65rem;

    dt{
      width: 1rem;
      min-height: 1rem;
      display: block;
      // border: 0.04rem solid rgba(255, 255, 255, .5);
      overflow: hidden;
      margin-bottom: .2rem;
      // border-radius: 100%;
      box-sizing: border-box;

      img{
        width: 100%;
      }
    }

    dd{
      color: #2e639e;
      height: .44rem;
      line-height: .44rem;
      display: inline-block;
      padding: 0 .5rem 0 .8rem;
      background: rgba(255, 255, 255, .55);
      position: relative;
      border-radius: .5rem;
      font-size: .28rem;

      svg{
        fill: #2f649e;
        width: .44rem;
        height: 100%;
        line-height: .44rem;
        text-align: center;
        display: block;
        background: #fff;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 100%;
      }
    }
  }

  /* -------------------- { 收益 } -------------------- */
  .profit-wrap{
    overflow: hidden;
    background: #fff;
    border-radius: .08rem;

    .title{
      color: #fff;
      height: .8rem;
      line-height: .8rem;
      font-size: .38rem;
      text-align: center;
      letter-spacing: 0.03rem;
      background: #3c74b2 url(../../assets/images/partnerPlan/title-green-bg.png) no-repeat center top;
      background-size: 100%;
      position: relative;
      text-shadow: 0 0 .1rem rgba(0, 0, 0, .2);

      .point{
        width: 0.24rem;
        height: 0.24rem;
        background: #2e6299;
        position: absolute;
        bottom: -0.10rem;
        border-radius: 100%;
      }

      .point-l{
        left: -0.12rem;
      }

      .point-r{
        background: #376da9;
        right: -0.12rem;
      }
    }

    table{
      width: 100%;
      font-size: .24rem;
      text-align: center;
      position: relative;

      tr{
        td{
          width: 50%;
          vertical-align: middle;
          border-bottom: 1px solid #eee;
          padding-top: .2rem;
          padding-bottom: .2rem;
          position: relative;
        }

        td:nth-child(odd) {
          color: #999;
        }

        td:nth-child(even) {
          div:first-child{
            padding-bottom: .1rem;
          }

          div:last-child{
            padding-top: .1rem;
          }
        }
      }

      tr:last-child{
        td{
          border-bottom: 0;
        }
      }

      .line{
        width: 1px;
        height: 100%;
        padding: .2rem 0;
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;

        span{
          width: 100%;
          height: 100%;
          display: block;
          background: #eee;
        }
      }
    }

    .profit-cen{
      padding: 0 .44rem;
    }
  }

  /* -------------------- { 二维码 } -------------------- */
  .code-wrap{
    padding: .4rem;
    margin-top: .3rem;
    background: #fff;
    border-radius: .08rem;

    .show-code-ewm{
      padding: .3rem;
      background: #f3f3f3; 
      border-radius: .06rem;
      
      .ewm{
        padding: .2rem;
        background: #fff;

        img{
          width: 100% !important;
          height: auto !important;
        }
      }

      p{
        color: #666666;
        font-size: .26rem;
        text-align: center;
        margin-top: .2rem;
      }
    }

    .extension-link{
      margin: .1rem 0 0 0;
      height: .6rem;
      background: #f3f3f3;
      border-radius: .3rem;
      -webkit-border-radius: .3rem;
      display: -webkit-box;
      display: -moz-box;
      display: -ms-box;
      position: relative;

      div:nth-child(1){
        width: 3.5rem;
        word-break: break-all;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: .24rem;
        color: #9c9c9c;
        line-height: .6rem;
        padding-left: .22rem;
      }

      div:nth-child(2){
        color: #fff;
        height: .6rem;
        text-align: center;
        line-height: .6rem;
        font-size: .24rem;
        padding: 0 .4rem;
        background: linear-gradient(left, #fa8e71, #f95943);
        position: absolute;
        right: 0;
        top:0;
        border-radius: .3rem;
        -webkit-border-radius: .3rem;
      }
    }
  }


  /* -------------------- { 分享 } -------------------- */
  .share-btn{
    color: #fff;
    height: .8rem;
    line-height: .8rem;
    font-size: .34rem;
    text-align: center;
    letter-spacing: .02rem;
    margin: .35rem 0 .5rem 0;
    background: linear-gradient(left, #f77675, #ed3436);
    border-radius: .08rem;
  }

  .share-tips-wrap{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .65) url(../../assets/images/share-tips.png) no-repeat right top;
    background-size: 50%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
  }
}
</style>

