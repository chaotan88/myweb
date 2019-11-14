<template>
  <div class="my-earning">
    <!-- 积分 -->
    <div class="Integral">
      <ul>
        <li>
          <div>43535人</div>
          <div>累计消费积分</div>
        </li>
        <li>
          <div>43535人</div>
          <div>累计通用积分</div>
        </li>
      </ul>
    </div>
    <!-- 收益 -->
    <div class="Profit">
      <div class="title">
        收益
        <span class="point point-l"></span>
        <span class="point point-r"></span>
      </div>
      <ul>
        <li class="list-title">
          <div>日期</div>
          <div>收益类型</div>
          <div>值</div>
        </li>
        <li v-for="item in 10">
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
    font-family: 'microsoft yahei';
    height: 100%;
    padding:0 .4rem;
    background: #2f639d url(/static/img/recommend-bg.8f98002.jpg) no-repeat center top;
    background-size: 100%;
    min-height: calc(100vh);
    overflow-y: scroll;
    .Integral{
      width: 6.68rem;
      height: 1.86rem;
      background: url(../../assets/images/partnerPlan/myEarning.png) no-repeat;
      background-size: 100%;
      margin-top: .4rem;
      ul{
        height: 1.86rem;
        display: flex;
        align-items: center;
        li{
          flex: 1;
          text-align: center;
          color: #fff;
          div:nth-child(1) {
            font-size: .49rem;
          }
          div:nth-child(2) {
            font-size: .26rem;
            margin-top: .05rem;
          }
        }
      }
    }
    .Profit{
      background: #fff;
      margin-top: .3rem;
      margin-bottom: .5rem;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      .title{
        color: #fff;
        height: .8rem;
        line-height: .8rem;
        font-size: .38rem;
        text-align: center;
        letter-spacing: 0.03rem;
        background: #3c74b2 url(../../assets/images/partnerPlan/title-violet-bg.png) no-repeat center top;
        background-size: 100%;
        position: relative;
        text-shadow: 0 0 .1rem rgba(0, 0, 0, .2);
        .point{
          width: 0.24rem;
          height: 0.24rem;
          background: #34679e;
          position: absolute;
          bottom: -0.10rem;
          border-radius: 100%;
        }
        .point-l{
          left: -0.12rem;
        }
        .point-r{
          background: #3d73ad;
          right: -0.12rem;
        }
      }
      ul {
        li{
          height: .88rem;
          display: flex;
          align-items: center;
          border-bottom: .02rem solid #ececec;
          &:last-child{
            border-bottom:none;
          }
          &.list-title{
            color: #333333;
            font-size: .26rem;
            height: .75rem;
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
              color: #3d74b3;
            }
          }
        }
      }
    }
  }
</style>