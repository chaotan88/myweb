<template>
  <div class="exchangeZone-warp">
    <!-- banner -->
    <div class="exchangeZone-ban">
      <img src="../../assets/images/action/action-list-ban.jpg">
    </div>
   <!-- 已兑换列表 -->
    <div class="exchanged">
      <div class="exchanged-title">
        <img src="../../assets/images/wallet/exchange-title-bg.png">
        <span>TA们都获得了福利</span>
        <img src="../../assets/images/wallet/exchange-title-bg.png">
      </div>
      <div class="exchanged-list">
        <div class="list-title">
          <div>做任务，集芯豆，得福利</div>    
        </div>      
        <ul>
          <li v-for="(item, index) in 2" :class="index % 2 === 0 ? 'yellow' : 'gray'">
            <div class="list-img">
              <img src="//img14.360buyimg.com/n7/jfs/t1/1756/21/12341/105905/5bd2e43eE600ae536/d009104affabd75c.png!q70.webp">
            </div>
            <div class="list-phone">
              <p>1364****1243</p>
              <p>使用芯豆购买</p>
            </div>
            <div class="list-pre" :class="index % 2 === 0 ? 'red' : 'violet'">
              <span>最高省200</span>
              <img src="../../assets/images/wallet/bean.png">
            </div>
          </li>
        </ul>
      </div>  
    </div> 
    <!-- 列表 -->
    <div class="goods-list">
      <div class="exchanged-title">
        <img src="../../assets/images/wallet/exchange-title-bg.png">
        <span>芯豆购物为您省，省，省！</span>
        <img src="../../assets/images/wallet/exchange-title-bg.png">
      </div>
      <ul>
        <li v-for="(item, index) in 3" :class="(index + 1)%2 == 0 ? 'evenNum' : ''">
          <div class="list-con">
            <p class="con-title">欧曼思亲爱的泰迪曲奇饼干（综合...</p>
            <p class="con-tag">
              <span>获</span>
              <span>1000消费积分</span>
            </p>
            <p class="con-bean">1000芯豆享福利价:</p>
            <p class="con-price"><i>￥</i>399<span>/600</span></p>
            <p class="con-btn">立即购买</p>
          </div>
          <div class="list-img">
            <img src="http://www.zxtx315.com//file/shopadmin/source/201809/1538011552539.jpg">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  mounted: function () {
  }
}
</script>
<style lang="less">
.exchangeZone-warp{
  height: calc(100vh);
  background: #4b0176;
  overflow-y: scroll;
  /* banner */
  .exchangeZone-ban{
    img{
      width: 100%;
      display: block;
    }
  }
  /* 公共title */
  .exchanged-title{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: .4rem 0;
      span{
        font-size: .36rem;
        color: #fff;
        display: inline-block;
        max-width: 4.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0 .1rem;
      }
      img{
        width: .79rem;
        height: .2rem;
        display: block;
        &:last-child{
          transform: rotate(180deg);
        }
      }
    }
  /* 已兑换列表 */
  .exchanged{
    .exchanged-list{
      height: auto;
      overflow: hidden;
      margin: 0 .2rem;
      position: relative;
      z-index: 300;
      .list-title{
        height: .65rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background: linear-gradient(90deg, #cd41f8, #e46492, #f8813c);
        color: #fff;
        font-size: .26rem;
        padding: 0 .3rem;
      }
      ul{
        height: auto;
        overflow: hidden;
        background: #fff;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        li{
          display: flex;
          align-items: center;
          height: 1.36rem;
          padding: 0 .2rem;
          margin-bottom: .06rem;
          &.yellow{
            background: #fcf8d2;
          }
          &.gray{
            background: #f9f9f9;
          }
          .list-img{
            width: .9rem;
            height: .9rem;
            margin-right: .2rem;
            img{
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .list-phone{
            flex: 1;
            color: #8a353c;
            p:nth-child(1){
              font-size: .3rem;
            }
            p:nth-child(2){
              font-size: .26rem;            
            }
          }
          .list-pre{
            display: flex;
            align-items: center;
            height: .7rem;
            border-radius: 30px;
            color: #fff;
            font-size: .26rem;
            padding: 0 .2rem;
            img{
              width: .31rem;
              height: .31rem;
              display: block;
              margin-left: .1rem;
            }
            &.red{
              background: linear-gradient(90deg, #f7a83a, #f85921);
            }
            &.violet{
              background: linear-gradient(90deg, #dd43fc, #7337fe);
            }          
          }
        }
      }
    }
  }
  /* 商品列表 */
  .goods-list{
    margin: 0 .2rem;
    ul{
      li{
        height: 3.81rem;
        border-radius: 6px;
        padding: .4rem .35rem;
        box-sizing: border-box;
        background: -webkit-radial-gradient(top left, #6d45e4,#c426b9);
        position: relative;
        margin-bottom: .34rem;
        display: flex;
        align-items: center;  
        &.evenNum{
          -webkit-flex-flow: row-reverse wrap;
          flex-flow: row-reverse wrap;
          .list-con{
            margin-left: .38rem;
          }
        }
        &::after{
          width: 100%;
          content: '';
          display: block;
          height: .55rem;
          background: rgba(0,0,0,0.3);
          position: absolute;
          bottom: 0;
          left: 0;
        }
        .list-con{
          flex: 1;
          margin-right: .38rem;
          position: static;
          z-index: 100;
          .con-title{
            font-size: .36rem;
            color: #fff;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .con-tag{
            span:nth-child(1){
              font-size: .18rem;
              color: #fff;
              background: #e72d84;
              border-radius: 50%;
              width: .3rem;
              height: .3rem;
              display: inline-block;
              text-align: center;
            }
            span:nth-child(2){
              font-size: .2rem;
              color: #fff;              
            }
          }
          .con-bean{
            font-size: .24rem;
            color: #391560;
            height: .36rem;
            line-height: .36rem;
            padding: 0 .1rem;
            display: table;
            background: linear-gradient(90deg, #deaf99, #fff, #deaf99);
            margin-top: .1rem;
          }
          .con-price{
            background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#fff), to(#d3bf82));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: .7rem;
            i{
              font-size: .3rem;
              color: #f9ffd9;
            }
            span{
              font-size: .3rem;
            }
          }
          .con-btn{
            width: 2.37rem;
            height: .55rem;
            border-radius: 5px;
            text-align: center;
            line-height: .55rem;
            font-size: .28rem;
            color: #bd0401;
            background: -webkit-linear-gradient(top, #fef7e7, #efceb3); 
          }

        }
        .list-img{
          width: 2.45rem;
          height: 3.08rem;
          position: static;
          z-index: 100;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>

