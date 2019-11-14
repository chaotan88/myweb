<template>
  <div class="partneRules">
    <div class="partneRules-title">
      <div><img src="../../assets/images/plan-portrait-def.png" ></div>
      <div>开启您的会员之旅 </div>
    </div>
    <!--列表-->
    <div class="partneRules-list">
      <ul>
        <li v-for="(item, index) in rulesList">
          <!--圆圈-->
          <div class="circular" :style="{ background: Color[index = index <= 3 ? index : index % 4]}"></div>
          <!--头像介绍部分-->
          <div class="partneRules-introduce" :style="{ background: 'linear-gradient(-45deg,' + backgrundGradient[index = index <= 3 ? index : index % 4].after + ',' + backgrundGradient[index = index <= 3 ? index : index % 4].front + ')'}">
            <!--三角形-->
            <div class="partneRules-introduce-triangle" :style="{ 'border-right-color': backgrundGradient[index = index <= 3 ? index : index % 4].front}"></div>
            <div class="partneRules-introduce-l">
              <img :src="item.ruleIcon" v-if="item.ruleIcon">
              <img src="../../assets/images/defaultImg.png" v-else>
              <div>{{item.ruleName}}</div>
            </div>
            <div class="partneRules-introduce-r">{{item.ruleDesc}}</div>
          </div>
          <!--价格部分-->
          <div class="partneRules-price">
            <div class="partneRules-price-option">
              <h2>成为条件</h2>
              <table border="1" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="right" valign="middle">代理费</td>
                  <td align="left">
                    <div>
                      <span v-if="item.agentFee> 1000000">{{item.agentFee / 10000}}万元</span>
                      <span v-else>{{item.agentFee ? item.agentFee : 0}}元</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="right" valign="middle">消费积分满</td>
                  <td align="left">
                    <div>{{item.consumePoint ? item.consumePoint : 0}}个</div>
                  </td>
                </tr>
                <tr>
                  <td align="right" valign="middle">直接推荐同级</td>
                  <td align="left">
                    <div>{{item.directRecommendPeer ? item.directRecommendPeer : 0}}人</div>
                  </td>
                </tr>
              </table>
            </div>
            <div class="partneRules-price-option">
              <h2>获取内容</h2>
              <table border="1" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="right" valign="middle">获得商品</td>
                  <td align="left">
                    <div>
                      <span v-if="item.toGoodsMoney> 1000000">{{item.toGoodsMoney / 10000}}万元</span>
                      <span v-else>{{item.toGoodsMoney ? item.toGoodsMoney : 0}}元</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="right" valign="middle">获得消费积分</td>
                  <td align="left">
                    <div>
                      <span v-if="item.toConsumePoint> 1000000">{{item.toConsumePoint / 10000}}万个</span>
                      <span v-else>{{item.toConsumePoint ? item.toConsumePoint : 0}}个</span>                      
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="right" valign="middle">赠送消费积分</td>
                  <td align="left">
                    <div>
                      <span v-if="item.giveConsumePoint> 1000000">{{item.giveConsumePoint / 10000}}万个</span>
                      <span v-else>{{item.giveConsumePoint ? item.giveConsumePoint : 0}}个</span>
                    </div>
                  </td>
                </tr> 
              </table>
            </div>
          </div>
          <!--奖励方式-->
          <div class="partneRules-reward">
             <h2>奖励方式</h2>
             <table border="1" cellspacing="0" cellpadding="0">
              <tr>
                <td align="right" valign="middle">直接推荐收益</td>
                <td>
                  <div>
                    通用积分：
                    <span v-if="item.cashRate">{{item.cashRate}}%</span>
                    <span v-else>--</span>
                  </div>
                  <div>
                    消费积分：
                    <span v-if="item.consumePointRate">{{item.consumePointRate}}%</span>
                    <span v-else>--</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="right" valign="middle">间接推荐收益</td>
                <td align="left">
                  <div>通用积分：{{item.indirectCashRateMin}}-{{item.indirectCashRateMax}}%</div>
                  <div>消费积分：{{item.indirectConsumePointRateMin}}-{{item.indirectConsumePointRateMax}}%</div>
                </td>
              </tr>
              <tr>
                <td align="right" valign="middle">全球加权分红</td>
                <td align="left">
                  <div>
                    <span v-if="item.globalWeightRate">{{item.globalWeightRate}}%</span>
                    <span v-else>--</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="right" valign="middle">办公场地补贴</td>
                <td align="left">
                  <div>
                    <span v-if="item.officeRate">{{item.officeRate}}%</span>
                    <span v-else>--</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="right" valign="middle">商品收益</td>
                <td align="left">
                  <span v-if="item.goodsProfitRate">{{item.goodsProfitRate}}%</span>
                  <span v-else>--</span>
                </td>
              </tr>
              <tr>
                <td align="right" valign="middle">芯片销售收益</td>
                <td align="left">
                  <div>{{item.chipRate}} *数量</div>
                </td>
              </tr>
            </table>
          </div>
        </li>
      </ul>
    </div>
    <!--底部-->
    <div class="partneRules-footer">
      <div class="garyImg">收益计算器</div>
      <div @click="$router.push('/partnerUpgrad')">会员升级</div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        rulesList: [],                                        // 规则列表
        Color: ['#f85965', '#ae65e6', '#fca648', '#83cf3f'], // 定义颜色
        backgrundGradient: [{
          front: '#fa7057',
          after: '#f95943'
        }, {
          front: '#cb70ee',
          after: '#7c53d9'
        }, {
          front: '#ffd174',
          after: '#f98324'
        }, {
          front: '#abe74f',
          after: '#67bf34'
        }] // 渐变背景色
      }
    },
    mounted: function () {
      this.getRulesList()   // 获取规则列表
    },
    methods: {
      /**
       * 获取规则列表
      */
      getRulesList () {
        this.$http.post(this.api.getRuleList, {
        }).then((res) => {
          let resData = res.data
          if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
            this.rulesList = resData.data
          }
        })
      }
    }
  }
</script>
<style scoped lang=less>
  .partneRules{
    min-height: calc(100vh);
    background: #3d74b3;
    padding-top: .59rem;
    box-sizing: border-box;
    padding-bottom: 1.2rem;
    .partneRules-title{
      width: 4.5rem;
      height: .64rem;
      line-height: .64rem;
      background: #2a5e94;
      border-radius: .32rem;
      display: block;
      overflow: hidden;
      margin-left: .09rem;
      div:nth-child(1){
        img{
          width: .56rem;
          height: .56rem;
          float: left;
          margin-right: .25rem; 
          border: .04rem solid #9bb4cd;
          border-radius: .56rem;
        }
      }
      div:nth-child(2){
        font-size: .32rem;
        color:#ffffff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;          
      }
    }
    /**列表**/
    .partneRules-list{
      ul{
        height: auto;
        overflow: hidden;
        position: relative;
        padding-left: .8rem;
        &::before{
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #6c8fb6;
          left: .4rem;
        }
        li{
          width: 6.29rem;
          margin-top: .42rem;
          position: relative;
          padding-left: .08rem;
          &:last-child{
            margin-bottom: .42rem;
          }
          .circular{
            width: .24rem;
            height: .24rem;
            background: #f85965;
            border: .05rem solid #fff;
            -webkit-box-shadow: 0 0 0 .04rem rgba(255, 255, 255, 0.5);   
            display: block;
            border-radius: .24rem;
            position: absolute;
            left: -.56rem;
            top: .88rem;
          }
          /**介绍部分**/
          .partneRules-introduce{
            height: 2.12rem;
            border-top-left-radius: 7px;
            border-top-right-radius: 7px;
            display: flex;
            align-items: center;
            position: relative;
            .partneRules-introduce-triangle{
              width: 0;
              height: 0;
              border: .16rem solid transparent;
              border-right-width: .21rem;
              border-right-style: solid;
              position: absolute;
              top: .9rem;
              left: -.36rem;
            }
            .partneRules-introduce-l{
              padding-left: .36rem;
              padding-right: .42rem;
              text-align: center;
              img{
                width:1rem;
                display: block;
                margin: 0 auto;
              }
              div{
                color: #fff;
                font-size: .24rem;
                height: .34rem;
                line-height: .34rem;
                padding: 0 .2rem;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 6px;
                margin-top: .05rem;
              }
            }
            .partneRules-introduce-r{
              flex: 1;
              color: #fff;
              font-size: .24rem;
              padding-right: .4rem;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 5;
            }
          }
          /**表格通用**/
          table{
            margin: 0 auto;
            tr{
              border-top: 2px solid #f5f5f5;
              td{
                padding: .2rem 0;
                max-width: 3.1rem;
              }
              td:nth-child(1){
                vertical-align: middle;
                padding-right: .55rem;
                color: #666666;
                font-size: .24rem;
              }
              td:nth-child(2){
                color: #666666;
                font-size: .24rem;
                div{
                  margin-bottom: .1rem;
                  &:last-child{
                    margin-bottom: 0;
                  }
                }
              }
            }
          }
          /**价格部分**/
          .partneRules-price{
            background: #fff;
            height: auto;
            overflow: hidden;
            display: flex;
            border-bottom: 2px solid #f5f5f5;
            .partneRules-price-option{
              flex: 1;
              text-align: center;
              &:first-child{
                border-right: 2px solid #f5f5f5;
              }
              h2{
                color: #333333;
                font-size: .28rem;
                font-weight: bold;
                text-align: center;
                padding: .25rem 0;
              }
              tr{
                td:nth-child(1){
                  vertical-align: middle;
                  padding-right: .35rem;
                  color: #666666;
                  font-size: .24rem;
                }
              }
            }
          }
          /**奖励方式**/
          .partneRules-reward{
            background: #fff;
            border-bottom-left-radius: 7px;
            border-bottom-right-radius: 7px;
            h2{
              color: #333333;
              font-size: .28rem;
              font-weight: bold;
              text-align: center;
              padding: .25rem 0;
            }
          }
        }
      }
    }
    /**底部**/
    .partneRules-footer{
      display: flex;
      justify-content: center;
      height: .8rem;
      position: fixed;
      bottom: 0;
      width: 7.5rem;
      left: 0;
      right: 0;
      margin: auto;
      background: rgba(42,94,148,0.8);
      padding: .2rem 0;
      div{
        width: 3rem;
        height: .8rem;
        text-align: center;
        line-height: .8rem;
        font-size: .3rem;
        color: #fff;
        border-radius: 6px;
        -webkit-border-radius:6px;
        &:first-child{
          margin-right: .26rem;
          background: -webkit-linear-gradient(left, #f67171 , #ed3537);
          background: linear-gradient(to right,#f67171 , #ed3537);
        }
        &:nth-child(2){
          background: -webkit-linear-gradient(left, #ffd174 , #f98324);
          background: linear-gradient(to right,#ffd174 , #f98324);
        }
      }
      .garyImg{
        filter: grayscale(100%);
        -webkit-filter: grayscale(100%);
      }
    }
  }
</style>