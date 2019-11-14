<!-- 提现密码 -->
<template>
  <div class="my-earning">

    <!-- 积分 -->
    <div class="Integral pos-r">
      <dl class="pos-r">
        <dt class="pos-a ta-c">
          <h3>43535</h3>
          <h4>
            <svg class="icon icon-yue va-m" aria-hidden="true">
              <use xlink:href="#icon-yue"></use>
            </svg>
            累计消费积分
          </h4>
        </dt>
        <dd class="ta-c">
          <h3>43535<span>个</span></h3>
          <h4>
            <svg class="icon icon-jifen va-m" aria-hidden="true">
              <use xlink:href="#icon-jifen"></use>
            </svg>
            累计通用积分
          </h4>
        </dd>
      </dl>
    </div>

    <!-- 交易记录 -->
    <div class="Profit pos-r">
      <ul>
        <li class="list-title">
          <h3>交易记录</h3>
        </li>
        <li v-for="item in 10">
          <div>余额消费</div>
          <div>2017-05-01 15:00</div>
          <div>消费积分</div>
          <div>+234</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped lang=less>
  .my-earning{
    background: #eee;
    padding-bottom: 0.3rem;

    /*------------头部积分样式-------------*/
    .Integral{
      width: 100%;
      height: 3.5rem;
      background: url(../../assets/images/wallet-bg.png) no-repeat;
      background-size: cover;
     
      dl{
        bottom: -1.3rem;

        h3{
          color: #fcdcd4;
          font-weight: bold;
          letter-spacing:2px;
          font-size: 0.35rem;

          span{
            font-size: 0.23rem;
          }
        }
        h4{
          color: #dbe6fd;
          letter-spacing:2px;
          font-size: 0.24rem;

          .icon{
            fill: #fff;
            width: 0.5rem;
            height: 0.5rem;
          }
        }
        dt{
          width: 50%;
          left:0;
          border-right: 1px solid #f9a286;
        }

        dd{
          padding-left: 50%;
          height: 1.3rem;
        }

      }
    }

    /*-------------交易记录----------------*/
    .Profit{
      width: 95%;
      margin: 0 auto;
      top: -0.5rem;
      background: #fff;
      border-radius: 5px;
     
      ul {
        li{
          height: .88rem;
          display: flex;
          align-items: center;
          font-size: 0.26rem;
          border-bottom: .02rem solid #ececec;
          &:last-child{
            border-bottom:none;
          }
          &.list-title{
            color: #333333;
            font-size: .26rem;
            height: .75rem;

            h3{
              color: #333;
              font-size: 0.3rem;
              height: 0.9rem;
              line-height: 0.9rem;
              padding-left: 0.5rem;
            }
          }
          div{
            flex: 1;
            text-align: center;
            color:#666666;
            font-size: .24rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 .05rem;
            &:nth-child(3){
              color: #c8a86c;
            }
          }
        }
      }
    }
  }
</style>