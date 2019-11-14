<template>
  <div class="luckyDay">
    <div class="luckyBg" :style="{backgroundImage: 'url(' + luckyBg + ')', backgroundSize:'100% 100%'}">

    </div>
    <div class="luckyNav">
      <div class="luckyBgTitle">
        <div class="icon">
          <img src="../../assets/images/shopLucky/money.png"/></div>
        <div class="my_turnover">
          <div v-if="this.userToken">￥{{countData.turnover || '0.00'}}</div>
          <div v-if="!this.userToken">--</div>
          <div>我的营业额(元)</div>
        </div>
        <div class="my_earnings" @click="$router.push('/shopearningsInfo')">
          <span>收益说明</span>
        </div>
      </div>
      <ul>
        <li>
          <div class="lucky_dec" v-if="this.userToken">{{countData.alreadyAccounted || '0.00'}}</div>
          <div class="lucky_dec" v-if="!this.userToken">--</div>
          <div class="lucky_num">已到账收益(元)</div>
        </li>
        <li>
          <div class="lucky_dec" v-if="this.userToken">{{countData.expectedReturn || '0.00'}}</div>
          <div class="lucky_dec" v-if="!this.userToken">--</div>
          <div class="lucky_num">未到账收益</div>
        </li>
        <!--<li>-->
        <!--<div class="lucky_dec">1000.00</div>-->
        <!--<div class="lucky_num">累计收益</div>-->
        <!--</li>-->
      </ul>
    </div>
  </div>
</template>

<script>
    export default {
      components: {},
      data () {
        return {
          luckyBg: require('../../assets/images/shopLucky/back.png'),
          countData: {},            // 大抢购页面接收数据数据
          userToken: ''
        }
      },

      mounted () {
        this.userToken = JSON.parse(localStorage.getItem('bsbUserInfo'))
        // 查看收益要登录才行
        if (this.userToken && this.userToken.token) {
          this.getGoodsPurchaseStatisticsData()
        } else {
        }
      },

      methods: {
        /****
         * 获取统计的数据
         * ****/
        getGoodsPurchaseStatisticsData () {
          this.$http.post(`${this.api.getGoodsPurchaseStatisticsData}`, {}).then((res) => {
            this.countData = res.data.data || {}
            // console.log(this.countData)
          })
        }
      }
    }
</script>

<style lang="less" scoped>
  .luckyDay{
    width: 7.5rem;
    height: 4.2rem;
    .luckyBg{
      width: 7.5rem;
      height: 2.70rem;
    }
    .luckyNav{
      color: white;
      width: 7.1rem;
      height: 2.70rem;
      margin: 0 0.2rem;
      background:linear-gradient(to right, #af7b5e, #f2ccaf);
      position: relative;
      top: -1.7rem;
      border-radius: 0.2rem;
      box-shadow: 0 0 10px #feeceb;

      .luckyBgTitle{
        display: flex;
        justify-content: space-between;
        margin: 0 0.2rem;
        padding-top: 0.2rem;
        .icon{
          flex: 1;
          width: 1rem;
          height:.99rem;
          img{
            width: 1rem;
            height:.99rem;
          }
        }
        .my_turnover{
          flex: 3;
          color: #fff;

          div:nth-child(2){
            font-size: 0.3rem;
          }
          div:nth-child(1){
            font-size: 0.44rem;
            font-weight: 700;
          }
        }
        .my_earnings{
          margin: 0.3rem 0;
          padding: 2px 4px;
          left: .4rem;
          font-size: .24rem;
          background: #bc8567;
          color: #fff;
          height: 0.4rem;
          width: 1.2rem;
          line-height: 0.4rem;
          border-radius: .3rem;
          text-align: center;
          span{
            position: relative;
          }
          .icon{
            width: 0.4rem;
            height: 0.4rem;
          }
        }
      }

      ul{
        display: flex;
        li{
          /*width: 33.33%;*/
          width: 50%;
          height: 0.8rem;
          text-align: center;
          margin-top: 0.4rem;
          border-right: 1px solid #ffffff;
          .lucky_dec{

            font-size: 0.28rem;
            position: relative;
            top: 0rem;
            font-weight: 600;
          }
          .lucky_num{
            padding-top: .1rem;
            font-size: 0.22rem;
            font-weight: 700;
          }
        }
        li:last-child{
          border-right: 0;
          border: 0px none;
        }
      }
    }
  }
</style>
