<template>
  <div>
    <div class="down-load">
      <div class="down-ban">
        <h2 class="down-title">真芯天下商城</h2>
        <div class="down-tip"><span>全球商品溯源 无假货 商城</span></div>
        <ul>
          <li @click="downLoad(1)">
            <img src="../../assets/images/down/ios-logo.png">
            <div>iPhone版下载</div>
          </li>
          <li @click="downLoad(2)">
            <img src="../../assets/images/down/android-logo.png">
            <div>Andriod版下载</div>
          </li>
        </ul>
      </div>
      <div class="down-con">
        <div>
          <qrcode :value="codeUrl" type="img" class="ewm"></qrcode>
        </div>
        <div class="down-con-tip">
          <p>扫描二维码下载</p>
          <p>商城app</p>
        </div>
      </div>
    </div>
    <div class="isAndroidMask" v-if="isAndroidPhone">
      <img :src="ydImg"/>
    </div>
  </div>
</template>
<script>
  import { Qrcode } from 'vux'
  export default {
    components: {
      Qrcode
    },
    data () {
      return {
        codeUrl: '',                           // 二维码链接
        latestVersion: '',                      // app版本号信息
        ydImg: require('../../assets/images/down/yindao_Down.png'),   // 安卓图片
        isAndroidPhone: false                  // 安卓微信中的控制
      }
    },
    mounted: function () {
      this.getAppVersion()    // 获取app版本号信息
      this.codeUrl = window.location.href.match(/.*mshop/gi)[0] + '/downLoad'
      // 安卓手机在微信内置浏览器中
      let u = navigator.userAgent
      // let app = navigator.appVersion
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
      if (isAndroid) {
        var ua = navigator.userAgent.toLowerCase()
        var isWeixin = ua.indexOf('micromessenger') !== -1
        if (isWeixin) {
          this.isAndroidPhone = true
        } else {
          this.isAndroidPhone = false
        }
      }
    },
    methods: {
      /**
       * 获取app版本号信息
      */
      getAppVersion () {
        this.$http.get(`${this.api.getAppVersion}`, {
          parmars: {
            systemType: 1
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.latestVersion = resData.data.latestVersion
          }
        })
      },
      /**
       * 下载
       * @val 1 ios 2 Android   http://oss-app-package.oss-cn-shenzhen.aliyuncs.com/
       * https://oss-app-package.oss-cn-shenzhen.aliyuncs.com/android/zxtx_wangye_v2.9.4.apk
      */
      downLoad (val) {
        if (val === 1) {
          window.location.href = 'https://itunes.apple.com/us/app/真芯天下商城/id1401882906?l=zh&ls=1&mt=8'
        } else if (val === 2) {
          var latestVersion = this.latestVersion.split('#')[0]
          window.location.href = 'https://oss-app-package.oss-cn-shenzhen.aliyuncs.com/android/zxtx_wangye_' + latestVersion + '.apk'
        }
      }
    }
  }
</script>

<style lang="less">
.down-load{
  width: 7.5rem;
  min-height: calc(100vh);
  background: #fff;
  overflow-y: scroll;
  z-index: 999;
  .down-ban{
    position: relative;
    height: 6.68rem;
    background: url('../../assets/images/down/downLoadBan.png') no-repeat;
    background-color: #ff3538;
    background-size: 100% 100%;
    .down-title{
      color: #fff;
      font-size: .58rem;
      text-align: center;
      padding-top: .9rem;
      padding-bottom: .19rem;
    }
    .down-tip{
      font-size: .28rem;
      color: rgba(255,255,255,0.8);
      align-items: center;
      justify-content: center;
      display: flex;
      margin: 0 .6rem;
      &::before{
        content: '';
        height: 1px;
        background:rgba(255,255,255,0.8);
        display: block;
        flex: 1;
      }
      &::after{
        content: '';
        height: 1px;
        background: rgba(255,255,255,0.8);
        display: block;
        flex: 1;
      }
      span{
        padding: 0 .17rem;
      }
    }


    ul{
      margin-top: .95rem;
      li{
        width: 4.3rem;
        height: 1.06rem;
        display: flex;
        border: .02rem solid #ffd7d7;
        border-radius: 12px;
        margin: 0 auto;
        margin-bottom: .5rem;
        align-items: center;
        color: #fff;
        font-size: .34rem;
        background: rgba(255,255,255,0.1);
        img{
          width: .83rem;
          height: .83rem;
          margin-left: .48rem;
          margin-right: .28rem;
        }
      }
    }
  }
  .down-con{
    width: 7.5rem;
    padding-top: 1.3rem;
    padding-bottom: .6rem;
    .ewm{
      width: 2.32rem;
      height: 2.32rem;
      margin: 0 auto;
      img{
        width: 100% !important;
        height: 100% !important;
      }
    }
    .down-con-tip{
      text-align: center;
      color: #333333;
      font-size: .24rem;
      margin-top: .25rem;
    }
  }
}
  .isAndroidMask{
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.7);
    position: fixed;
    left: 0;top: 0;
    img{
      width: 5rem;
      height: 1.8rem;
      float: right;
      position: relative;
      right: 0.6rem;
      top: 0.3rem;
    }
  }
</style>
