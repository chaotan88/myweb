<template>
  <div>
    <div class="pagePay">
      <div class="payTitle"><p>选择线下支付方式</p></div>
      <ul class="payWay">
        <li v-for="(item, index) in payListData">
          <p style="display: flex;align-items: center"><img :src="item.img"/><span>{{item.title}}</span></p>
          <p style="margin-top: 0.2rem;"><x-icon type="ios-arrow-right" size="20"></x-icon></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'bankPay',
      data () {
        return {
          payListData: [
            {
              img: require('../../assets/images/delete.png'),
              title: '刷卡支付'
            }, {
              img: require('../../assets/images/delete.png'),
              title: '转账'
            }, {
              img: require('../../assets/images/delete.png'),
              title: '现金'
            }
          ]
        }
      },
      components: {
      },
      mounted () {
      },
      methods: {
      }
    }
</script>

<style lang="less" scoped>
  .pagePay{
    width: 100%;
    height: 100vh;
    background: #fff;
    .payTitle{
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      background: #fff;
      color: #000;
      font-size: 0.3rem;
      p{
        margin-left: 0.2rem;
        font-weight: 600;
        font-family: '微软雅黑';
      }
  }
    .payWay{
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      border-top: 0.15rem solid #f7f7f7;
      li{
        width: 94%;
        height: 1rem;
        line-height: 1rem;
        padding: 0 3%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        border-bottom: 1px solid #f7f7f7;
        span{
          margin-left: 0.3rem;
        }
        img{
          width: 0.5rem;
          height: 0.5rem;
        }
      }
    }
  }
</style>
