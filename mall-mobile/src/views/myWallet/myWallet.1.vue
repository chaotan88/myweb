<template>
  <div class="myWallet">
    <!--banner-->
    <div class="myWallet-banner">
      <div class="myWallet-banner-money">¥{{walletData.balance}}</div>
      <div class="myWallet-banner-txt">可用余额</div>
    </div>
    <!--integral类别-->
    <div class="integral-type">
      <ul>
        <li>
          <div>消费积分</div>
          <div>{{walletData.bonusPoints}}个</div>
        </li>
        <li>
          <div>通用积分</div>
          <div>{{walletData.cashPoints}}个</div>
        </li>
      </ul>
    </div>
    <!--栏目-->
    <div class="myWallet-column">
      <ul>
        <li @click="$router.push('/myPoints')">
          <a href="javascript:">
            <img src="../../assets/images/my/wallet-icon1.png" >
            <div>我的积分</div>
            <x-icon type="ios-arrow-right" size="20"></x-icon>
          </a>
        </li>
        <li @click="$router.push('/partnerPlan')">
          <a href="javascript:">
            <img src="../../assets/images/my/wallet-icon3.png" >
            <div>合伙人计划</div>
            <x-icon type="ios-arrow-right" size="20"></x-icon>
          </a>
        </li>
        <li>
          <a href="http://www.passpaygg.com/setmeal/%E5%A5%97%E9%A4%90%E5%8C%BA.html">
            <img src="../../assets/images/my/wallet-icon2.png" >
            <div>套餐专区</div>
            <x-icon type="ios-arrow-right" size="20"></x-icon>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        walletData: '' // 余额及积分数据
      }
    },
    mounted: function () {
      this.getData()  // 获取数据
    },
    methods: {
      /**
       * 获取数据
      */
      getData () {
        this.$http.get(`${this.api.getMemberPoints}`, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.walletData = resData.data
          }
        })
      }
    }
  }
</script>
<style scoped lang=less>
  .myWallet{
    height: calc(100vh);
    overflow-y: scroll;
    background: #efefef;
    .myWallet-banner{
      height: 2.88rem;
      padding: .3rem  0 .2rem 0;
      background: -webkit-linear-gradient(left, #b59171 , #cfb8a3); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(right,#b59171 , #cfb8a3); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(right, #b59171 , #cfb8a3); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right,#b59171 , #cfb8a3);
      text-align: center;
      color: #fff;
      .myWallet-banner-money{
        font-size: .68rem;
        margin-top: .3rem;
      }
      .myWallet-banner-txt{
        font-size: .28rem;
        margin-top: .2rem;
      }
    }
    /**积分类别**/
    .integral-type{
      width: 6.9rem;
      height: 1.7rem;
      background: #fff;
      border-radius: 6px;
      margin: 0 auto;
      margin-top: -.88rem;
      -webkit-box-shadow: 0 0 35px 0 rgba(154, 141, 141, 0.4);
      ul{
        height: 1.7rem;
        display: flex;
        align-items: center;
        li{
          height: 1.27rem;
          flex: 1;
          text-align: center;
          overflow: hidden;
          &:first-child{
            border-right: 1px dashed #d4d4d4;
          }
          div{
            font-size: .28rem;
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:nth-child(1){
              margin-top: .2rem;
            }
            &:nth-child(2){
              color: #999999;
              margin-top: .2rem;
            }
          }
        }
      }
    }
    /**栏目**/
    .myWallet-column{
      width: 6.9rem;
      margin: 0 auto;
      background: #fff;
      margin-top: .3rem;
      border-radius: 6px;
      ul{
        li{
          display: flex;
          position: relative;
          height: .96rem;
          &:last-child{
            a{
              border-bottom: none;
            }
          }
          a {
            display: flex;
            flex: 1;
            margin: 0 .25rem;
            align-items: center;
            height: .96rem;
            color: #333333;
            font-size: .28rem;
            border-bottom: 1px dashed #d4d4d4;
            img{
              width: .5rem;
            }
            div{
              flex: 1;
              margin-left: .25rem;
            }
            .vux-x-icon{
              fill: #cccccc;
            }
          }
          &:not(:last-child)::before{
            content: '';
            width:.13rem;
            height:.26rem; 
            background: #ededee;  
            position: absolute;
            left: 0;   
            bottom: -.13rem;  
            border-radius:0 .13rem .13rem 0; /* 左上、右上、右下、左下 */
          }
          &:not(:last-child)::after{
            content: '';
            width:.13rem;
            height:.26rem; 
            background: #ededee;  
            position: absolute;
            right: 0;   
            bottom: -.13rem;  
            border-radius: .13rem 0  0 .13rem; /* 左上、右上、右下、左下 */
          }
        }
      }
    }
  }
</style>