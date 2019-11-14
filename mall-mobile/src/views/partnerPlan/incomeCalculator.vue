<template>
  <div class="partner-recommended-wrap">
    <!-- 用户信息 -->
    <dl class="user-wrap">
      <dt><img src="../../assets/images/partnerPlan/recommend-user.png"></dt>
      <dd>
        <x-icon type="ios-arrow-down" class="icon-red" size="0.2rem"></x-icon>
        <!-- 请选择身份 -->
        <select>
          <option>推荐人类别</option>
          <option>推荐人类别22222</option>
        </select>
        </dd>
    </dl>
    <!-- 代理费 -->
    <div class="profit-wrap agency-fee">
      <div class="title">
        代理费
        <span class="point point-l"></span>
        <span class="point point-r"></span>
      </div>
      <div class="profit-cen">
        <table>
          <tr>
            <td>代理费<div class="line"><span></span></div></td>
            <td>
              <span>--元</span>
            </td>
          </tr>
          <tr>
            <td>购物金额<div class="line"><span></span></div></td>
            <td>--元</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 获取内容 -->
    <div class="profit-wrap get-content">
      <div class="title">
        获取内容
        <span class="point point-l"></span>
        <span class="point point-r"></span>
      </div>
      <div class="profit-cen">
        <table>
          <tr>
            <td>获得商品<div class="line"><span></span></div></td>
            <td>
              <span>--元</span>
            </td>
          </tr>
          <tr>
            <td>赠送消费积分<div class="line"><span></span></div></td>
            <td>--元</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 奖励方式 -->
    <div class="profit-wrap reward-method">
      <div class="title">
        奖励方式
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
                <span>1%</span>
              </div>
              <div>
                 消费积分：
                  <span>10%</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>间接推荐收益<div class="line"><span></span></div></td>
            <td>
              <div>通用积分：1-2%</div>
              <div>消费积分：1-25%</div>
            </td>
          </tr>
          <tr>
            <td>加权现金分红<div class="line"><span></span></div></td>
            <td>
              <span>55%</span>
            </td>
          </tr>
          <tr>
            <td>办公场地补贴<div class="line"><span></span></div></td>
            <td>
              <span>41%</span>
            </td>
          </tr>
          <tr>
            <td>商品收益<div class="line"><span></span></div></td>
            <td>
              <span>20%</span>
            </td>
          </tr>
          <tr>
            <td>芯片销售收益<div class="line"><span></span></div></td>
            <td>10*数量</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 推荐计算 -->
    <div class="recommend-calculat">
      <ul>
        <template v-for="(item, index) in tabBar">
          <li :class="tabBarIndex == index ? 'active' : ''" @click="tabTap(index)">{{item}}</li>
        </template>
      </ul>
      
      <div class="recommend-calculat-option">
        <dl>
          <dt>推荐人级别</dt>
          <dd>
            <select>
              <option>推荐人类别</option>
              <option>推荐人类别22222</option>
            </select>
          </dd>
        </dl>
        <dl>
          <dt>推荐消费金额</dt>
          <dd>
            <input type="number" min="1">
          </dd>
        </dl>
        <dl>
          <dt>推荐人数

          </dt>
          <dd>
            <input type="number" min="1">
          </dd>
        </dl>
      </div>
    </div>
    <!-- 底部 -->
    <div class="calculation-footer-hei"></div>
    <div class="calculation-footer">
      <div class="calculation-footer-l">
        <p>
          <span>消费积分：</span>
          <span>343.00</span>
        </p>
        <p>
          <span>消费积分：</span>
          <span>343.00</span>
        </p>
      </div>
      <div class="calculation-footer-r">马上计算</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabBar: ['直接推荐', '间接推荐', '组合推荐'],               // tab数据
      tabBarIndex: 0                                            // tab索引
    }
  },

  mounted () {
  },

  methods: {
    /**
     * tab点击
    */
    tabTap (index) {
      this.tabBarIndex = index
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
  min-height: calc(100vh);
  box-sizing: border-box;
  overflow-y: scroll;
  /* -------------------- { 用户信息 } -------------------- */
  .user-wrap{
    margin-bottom: .65rem;    
    dt{
      width: 1rem;
      height: 1rem;
      display: block;
      border: 0.04rem solid rgba(255, 255, 255, .5);
      overflow: hidden;
      margin-bottom: .2rem;
      border-radius: 100%;
      box-sizing: border-box;

      img{
        width: 100%;
        height: 100%;
      }
    }

    dd{
      color: #2e639e;
      height: .44rem;
      line-height: .44rem;
      display: inline-block;
      padding: 0 0rem 0 .8rem;
      background: rgba(255, 255, 255, .55);
      position: relative;
      border-radius: .5rem;
      font-size: .28rem;
      max-width: 2rem;
      overflow: hidden;
      select{
        appearance:none;
        -moz-appearance:none;
        -webkit-appearance:none;
        outline: none;
        border: none;
        background: none;
        color: #2e639e;
      }

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

  /* -------------------- { 代理费、获取内容、奖励方式 } -------------------- */
  .profit-wrap{
    overflow: hidden;
    background: #fff;
    border-radius: .08rem;
    margin-top: .3rem;
    .title{
      color: #fff;
      height: .8rem;
      line-height: .8rem;
      font-size: .38rem;
      text-align: center;
      letter-spacing: 0.03rem;
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
    &.agency-fee{
      .title{
        background: #3c74b2 url(../../assets/images/partnerPlan/title-red-bg.png) no-repeat center top;
        background-size: 100% 100%;
      }
    }
    &.get-content{
      .title{
        background: #3c74b2 url(../../assets/images/partnerPlan/title-violet-bg.png) no-repeat center top;
        background-size: 100% 100%;
      }
    }
    &.reward-method{
      .title{
        background: #3c74b2 url(../../assets/images/partnerPlan/title-green-bg.png) no-repeat center top;
        background-size: 100% 100%;
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
  /* -------------------- { 推荐计算 } -------------------- */
  .recommend-calculat{
    height: 100%;
    overflow: hidden;
    background: #fff;
    border-radius: .08rem;
    margin-top: .3rem;
    margin-bottom: .6rem;
    ul {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 1.1rem;
      border-bottom: .02rem solid #eeeeee;
      padding: 0 .4rem;
      li{
        text-align: center;
        width: 1.67rem;
        height: .5rem;
        line-height: .5rem;
        border:1px solid #d4d4d4;
        border-radius: .5rem;
        color: #666666;
        font-size: .26rem;
        &.active{
          color: #fff;
          border: none;
          background: -webkit-linear-gradient(left, #fa755b , #f95943);
          background: linear-gradient(to right,#fa755b , #f95943);
        }
      }
    }
    .recommend-calculat-option{
      padding: .54rem .58rem;
      dl{
        display: flex;
        align-items: center;
        margin-bottom: .3rem;
        &:last-child{
          margin-bottom: 0;
        }
        dt{
          min-width: 2.34rem;
          color: #666666;
          font-size: .24rem;
        }
        dd{
          flex: 1;
          select{
            width: 100%;
            height: .44rem;
            appearance:none;
            -moz-appearance:none;
            -webkit-appearance:none;
            outline: none;
            border: none;
            border: 1px solid #f74d4d;
            border-radius: 30px;
            font-size: .26rem;
            padding-left: .32rem;
            color: #f74d4d;
            background: none;
            option{
              color: #666666;
            }
          }
          input{
            height: .44rem;
            border: 1px solid #f74d4d;
            border-radius: 30px;
            font-size: .26rem;
            padding-left: .1rem;
          }
        }
      }
    }
  }
  /* -------------------- { 底部计算 } -------------------- */
  .calculation-footer-hei{
    height: 1rem;
  }
  .calculation-footer{
    height: 1rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: #fff;
    display: flex;
    align-items: center;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    .calculation-footer-l{
      padding-left: .4rem;
      flex:1;
      color: #666666;
      font-size: .24rem;
      p{
        &:nth-child(2){
          margin-top: .1rem;
        }
        span:nth-child(2){
          color:#f23030;
          font-size: .28rem;
        }
      }
    }
    .calculation-footer-r{
      width: 1.89rem;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      border-top-right-radius: 8px;
      background: #f23030;
      color: #fff;
      font-size: .32rem;
    }
  }
}
</style>

