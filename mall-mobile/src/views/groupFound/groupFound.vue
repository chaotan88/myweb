<template>
  <div>
    <div class="found-wrap">
      <div class="xin-list" @click="goNewPage(1)">
        <div class="xin-logo">
          <div><img :src="zhenxin"/></div>
          <div>买卖仓</div>
        </div>
        <div class="xin-title">真芯买卖仓好买卖，一买一卖赚不停</div>
        <div class="xin-img"><img :src="shopSale"/></div>
        <div class="xin-end">买卖仓，你的私人网络仓库</div>
      </div>
      <div class="xin-list" @click="goNewPage(2)">
        <div class="xin-logo">
          <div><img :src="zhenxin"/></div>
          <div>海外购</div>
        </div>
        <div class="xin-title">海外购上线啦!足不出户逛遍世界好货</div>
        <div class="xin-img"><img :src="overseaShop"/></div>
        <div class="xin-end">不用漂洋过海，省时省心“购国际”！</div>
      </div>
      <div class="xin-list" @click="goNewPage(3)">
        <div class="xin-logo">
          <div><img :src="zhenxin"/></div>
          <div>芯品速递</div>
        </div>
        <div class="xin-title">新品速递&nbsp;为你寻觅春季美物</div>
        <div class="xin-img"><img :src="newWay"/></div>
        <div class="xin-end">就要喜新厌旧，就要另觅新欢，快来感受“新欢”的味道</div>
      </div>
      <div class="xin-list" @click="goNewPage(4)">
        <div class="xin-logo">
          <div><img :src="zhenxin"/></div>
          <div>店主专区</div>
        </div>
        <div class="xin-title">店主专区: &nbsp;我的地盘我做主</div>
        <div class="xin-img"><img :src="homerArea"/></div>
        <div class="xin-end">进入时尚部落，你就是时尚领主</div>
      </div>
    </div>
  </div>
</template>
<script>
  import groupFooter from '../../components/groupBooking/groupFooter'
  export default {
    name: 'groupFound',
    components: {
      groupFooter
    },
    data () {
      return {
        zhenxin: require('../../assets/images/groupBooking/zhenxin.png'), // 真芯图标
        homerArea: require('../../assets/images/groupImg/homerArea.png'), // 店主专区
        overseaShop: require('../../assets/images/groupImg/overseaShop.png'), // 海外购
        newWay: require('../../assets/images/groupImg/newWay.png'), // 芯品速递
        shopSale: require('../../assets/images/groupImg/shopSale.png') // 买卖仓
      }
    },
    mounted: function () {
    },
    methods: {
      jump (parm) {
        var url = parm.path
        let query = parm.query || ''
        if (query) {
          url += '?'
          for (let i in query) {
            url += i + '=' + query[i] + '&'
          }
        }
        var flag
        if (window.android) {
          flag = window.android.jumpMshop ? !window.android.jumpMshop(url) : true
        } else if (window.webkit) {
          flag = window.webkit.messageHandlers.jumpMshop ? !window.confirm('mshopjs_jump_' + url) : true
        } else {
          flag = true
        }
        if (flag) {
          this.$router.push(parm)
        }
      },
      /***
       * 跳转新页面
       * **/
      goNewPage (n) {
        if (n === 1) {
          this.jump({path: '/shopLuckyStrike'}) // 买卖仓
        } else if (n === 2) {
          this.jump({path: '/singleActivityList', query: {id: 449}}) // 海外购449
        } else if (n === 3) {
          this.jump({path: '/multiActivityList', query: {id: 475}})  // 芯品速递475
        } else {
          this.jump({path: '/sharePurchase'}) // 店主专区
        }
      }
    }
  }
</script>
<style scoped lang=less>
  .found-wrap{
    width: 100%;
    max-width: 10rem;
    box-sizing: border-box;
    min-height: 100vh;
    background: #f4f4f4;
    overflow: hidden;
    .xin-list{
      width: 100%;
      box-sizing: border-box;
      padding: 0 0.3rem;
      background: #fff;
      margin: 0.16rem 0;
      .xin-logo{
        height: 0.56rem;
        line-height: 0.56rem;
        display: flex;
        padding-top: 0.27rem;
        div{
          &:nth-of-type(1) {
            width: 0.56rem;
            height: 0.56rem;
            img{
              width: 100%;
              height: 100%;
            }
          }
          &:nth-of-type(2) {
            color: #353535;
            font-size: 0.26rem;
            margin-left: 0.12rem;
          }
        }
      }
      .xin-title{
        color: #353535;
        font-size: 0.35rem;
        font-weight: 500;
        margin: 0.29rem 0 0.27rem 0;
      }
      .xin-img{
        width: 100%;
        max-width: 10rem;
        box-sizing: border-box;
        height: 3.7rem;
        border-radius: 0.1rem;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .xin-end{
        color: #a6a6a6;
        font-size: 0.26rem;
        margin-top: 0.26rem;
        padding-bottom: 0.36rem;
      }
    }
  }
</style>

