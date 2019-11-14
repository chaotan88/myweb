<template>
  <div class="maker-box">
    <div class="maker-top">
      <div class="maker-top-lef">
        <img :src="integralInfo.conUrl | filterImgUrl">
      </div>
      <div class="maker-top-rig">
        <div class="Level">{{integralInfo.rankName}}</div>
        <img src="../../assets/images/maker/integral.png">
        <div class="maker-num">
          <ul>
            <li v-for="item in integralInfo.bonusPointsArr">{{item}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="maker-btn">
      <div @click="$router.push('/integral')">
        <span>积分记录</span>
      </div>
      <div @click="createShop(integralInfo)">
        <span>{{integralInfo.hasShop | hasShopFilter }}</span>
        <!-- <img src="../../assets/images/maker/btn1.png" > -->
      </div>
    </div>
    <div class="Privileges"><img src="../../assets/images/maker/Privileges.png"></div>
    <ul class="maker-list">
      <li v-for="(item, index) in customerLevel">
        <div class="maker-list-l">
          <img :src="item.conUrl | filterImgUrl">
        </div>
        <div class="maker-list-r">
          <div class="maker-list-r-top">
            <span v-bind:style="{ color: Color[index = index <= 4 ? index : index % 5]}">{{item.rankName}}</span>
            <span v-bind:style="{ background: Color[index = index <= 4 ? index : index % 5]}">{{item.points}}积分</span>
          </div>
          <div class="maker-list-r-bot">{{item.description}}</div>
        </div>
        <div class="lock" v-if="integralInfo.bonusPoints < item.points"></div>
      </li>
    </ul>
  </div>
</template>
<script>
  import Vue from 'vue'
  export default {
    data () {
      return {
        integralInfo: '', // 总积分
        customerLevel: '', // 创客等级列表
        Color: ['#9ad84a', '#3cdbdd', '#fe6564', '#26a2ff', '#7543e5'] // 颜色
      }
    },
    mounted: function () {
      this.getMemberPoints() // 获取总积分
      this.getMemberRuleDetailList() // 获取创客等级
    },
    methods: {
      /**
       * 获取总积分
      */
      getMemberPoints () {
        // let token = localStorage.getItem('bsbUserInfo') ? JSON.parse(localStorage.getItem('bsbUserInfo')).token : ''
        this.$http.get(`${this.api.getMemberPoints}`, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          var resData = res.data.data
          var bonusPointsArr = ''
          bonusPointsArr = resData.bonusPoints ? resData.bonusPoints.toString().split('') : [0]
          Vue.set(resData, 'bonusPointsArr', bonusPointsArr)
          this.integralInfo = resData
        })
      },
      /**
       * 获取创客等级
      */
      getMemberRuleDetailList () {
        this.$http.get(`${this.api.getMemberRuleDetailList}`).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          var resData = res.data.data
          this.customerLevel = resData
        })
      },
      /**
       * 是否具备开店条件
      */
      createShop (v) {
        // 具备开店条件
        if (v.applyStatus === 1) {
          if (v.hasShop === 1) { // 有店铺
            this.$router.push('/storeAudit')
          } else { // 没有店铺
            this.$router.push('/freeShop')
          }
        } else { // 不具备开店条件
          this.$vux.toast.text('暂时无法开店，快去赚取积分')
          return false
        }
      }
    }
  }
</script>

<style scoped lang=less>
@font-face {
  font-family: 'yuweijmedium';
  src: url('../../assets/css/font/_-webfont.woff2') format('woff2'),
        url('../../assets/css/font/_-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
.maker-box{
  min-height: calc(100vh);
  background: url('../../assets/images/maker/maker.jpg') no-repeat;
  background-color: #194c80;
  background-size:100% auto;
  .maker-top{
    display: flex;
    justify-content: center;
    padding-top: 1.56rem;
    .maker-top-lef{
      width: 1.69rem;
      height: 2.33rem;
      margin-right: .3rem;
      /* background: url('../../assets/images/g.png') no-repeat;
      background-size: 2.02rem 1.75rem; */
      background-position: center bottom;
      position: relative;
      img{
        width: 1.52rem;
        height: 1.83rem;
        /* position: absolute;
        top:0;
        right: .07rem; */
        margin: 0 auto;
        display: block;
      }
      div{
        position: absolute;
        left: 0;
        right: 0;
        bottom: .1rem;
        text-align: center;
        font-size: .24rem;
        color:#d4ce35;
        font-weight: bold;
      }
    }
    .maker-top-rig{
      /* margin-top: .45rem; */
      .Level{
        background: #fff100;
        display: inline-block;
        font-size: .24rem;
        padding: 0px .2rem;
        border-radius: 30px;
        margin-bottom: .2rem;
      }
      img{
        width: 2.04rem;
        height: .64rem;
        display: block;
        margin-bottom: .2rem;
      }
    }
  }
  .maker-btn{
    display: flex;
    justify-content: center;
    margin-top: .53rem;
    div{
      width: 1.63rem;
      height: .54rem;
      margin-left: .48rem;
      text-align: center;
      line-height: .5rem;
      color: #fff;
      font-size: .24rem;
      text-shadow: 2px 2px 4px #000;
      -webkit-text-shadow: 2px 2px 4px #000;
      &:nth-child(1){
        background: url('../../assets/images/maker/btn2.png') no-repeat;
        background-size: 100% 100%;
      }
      &:nth-child(2){
        background: url('../../assets/images/maker/btn1.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    img{
      width: 1.63rem;
      height: .54rem;
      display: block;
    }
  }
  .Privileges{
    width: 7.5rem;
    text-align: center;
    margin-top: .67rem;
    img{
      width: 3.66rem;
      height: 1.48rem;
    }
  }
  .maker-num{
    ul{
      display: flex;
      /* justify-content: center; */
      li{
        width: .3rem;
        height: .46rem;
        background: #213f5d;
        border-radius: 5px;
        text-align: center;
        line-height: .46rem;
        color: #fff100;
        float: left;
        margin-left: .08rem;
        padding:0 .05rem;
        font-family: 'yuweijmedium';
        font-size: .5rem;
      }
    }
  }
  .maker-list{
    height: 100%;
    width: 7.1rem;
    margin: 0 auto;
    margin-top: .63rem;
    &:empty{
      margin-top: 0;
    }
    li{
      display: flex;
      background: #fff;
      border-radius: 20px;
      height: 1.86rem;
      padding-right: .25rem;
      margin-bottom: .3rem;
      position: relative;
      .lock{
        width: .7rem;
        height: .7rem;
        background:url('../../assets/images/maker/makerLock.png') no-repeat;
        background-size: .36rem .36rem;
        background-position: center;
        background-color: #af7751;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 30px;
        position: absolute;
        right: 0;
        top:0;
      }
      .maker-list-l{
        width: 1.67rem;
        /* height: 1.25rem; */
        text-align: center;
        margin-right: .15rem;
        display: flex;
        align-items: center;
        img{
          width: 80%;
          height: 1.25rem;
          display: block;
          margin-left: .15rem;
        }
      }
      .maker-list-r{
        flex: 1;
        height: 1.86rem;
        position: relative;
        .maker-list-r-top{
          font-size: .24rem;
          margin-top: .3rem;
          span{
            display: inline-block;
            font-weight: bold;
            &:nth-child(2){
              min-width: 1.2rem;
              height: .34rem;
              border-radius: 4px;
              text-align: center;
              line-height: .34rem;
              color: #fff;
              margin-left: .1rem;
              padding: 0 .1rem;
              font-weight: normal;
            }
          }
        }
        .maker-list-r-bot{
          color: #6c6c6c;
          font-size: .24rem;
          display: -webkit-box;
          display: -moz-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          position: absolute;
          left: 0;
          bottom: .3rem;
        }
      }
    }
  }
}
</style>
