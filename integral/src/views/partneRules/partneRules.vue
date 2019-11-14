<template>
  <div class="partneRules">
    <div class="partneRules-title">
      <div><img src="../../assets/images/plan-portrait-def.png" ></div>
      <div>开启您的会员升级之旅 </div>
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
              <img :src="item.ruleIcon | filterImgUrl" v-if="item.ruleIcon">
              <img src="../../assets/images/defaultImg.png" v-else>
              <div>{{item.ruleName}}</div>
            </div>
            <div class="partneRules-introduce-r">{{item.ruleDesc}}</div>
          </div>

          <!--成为条件-->
          <div class="partneRules-reward bor-rad">
            <h2>成为条件</h2>
            <table border="1" cellspacing="0" cellpadding="0">
              <tr v-if="item.agentFee">
                <td align="right" valign="middle">消费金额</td>
                <td><span v-if="item.agentFee">{{item.agentFee | filterEmpty('元')}}</span></td>
              </tr>
              <tr v-if="item.toConsumePoint">
                <td align="right" valign="middle">消费积分</td>
                <td align="left">{{item.toConsumePoint | filterEmpty('元')}}</td>
              </tr>
              <tr v-if="item.directRecommendPeer">
                <td align="right" valign="middle">推荐{{item.ruleName}}</td>
                <td align="left">
                  <div>
                    <span v-if="item.directRecommendPeer">{{item.directRecommendPeer | filterEmpty('人 升级')}}</span>
                    <span v-else>--</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!--获取内容-->
          <div class="partneRules-reward">
            <h2>获取内容</h2>
            <table border="1" cellspacing="0" cellpadding="0">
              <tr v-if="item.toGoodsMoney">
                <td align="right" valign="middle">获得商品</td>
                <td>
                  <div>
                    <span v-if="item.toGoodsMoney">{{item.toGoodsMoney | filterEmpty('元')}}</span>
                    <span v-else>--</span>
                  </div>
                </td>
              </tr>
              <tr v-if="item.toConsumePoint">
                <td align="right" valign="middle">消费积分</td>
                <td align="left">{{item.toConsumePoint | filterEmpty('分')}}</td>
              </tr>
            </table>
          </div>

          <!-- 获得收益 -->
          <div class="gain-income">
            <h2 class="ta-c" @click="backgrundGradient[index].visible = !backgrundGradient[index].visible">
              获得收益
              <svg class="icon icon-xiala2 va-m" aria-hidden="true" v-if="!backgrundGradient[index].visible">
                <use xlink:href="#icon-xiala2"></use>
              </svg>
              <svg class="icon icon-shangla2 va-m" aria-hidden="true" v-if="backgrundGradient[index].visible">
                <use xlink:href="#icon-shangla2"></use>
              </svg>
            </h2>
            <div class="calculator ta-l pos-r" v-if="backgrundGradient[index].visible">您所获得的奖励可通过查看<span class="d-ib pos-a" @click="$router.push('/incomeCalculator')">收益计算器</span></div>
          </div>
        </li>
      </ul>
    </div>
    <!--底部-->
    <div class="partneRules-footer">
      <div @click="$router.push('/incomeCalculator')">收益计算器</div>
      <div @click="handleUpgrad">会员升级</div>
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
          after: '#f95943',
          visible: false
        }, {
          front: '#cb70ee',
          after: '#7c53d9',
          visible: false
        }, {
          front: '#ffd174',
          after: '#f98324',
          visible: false
        }, {
          front: '#abe74f',
          after: '#67bf34',
          visible: false
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
      },

      /**
       * 点击升级
       */
      handleUpgrad () {
        this.$http.post(this.api.getApplyStatus, {
        }).then((res) => {
          // $router.push('/partnerUpgrad')
          // Integer status;//1 可以新增加； 2可以修改  ；3只能查看
          // Long applyId;//可以修改的申请ID(等于 2的时候不为空)
          let resData = res.data.data
          if (parseInt(resData.status) === 1) {
            this.$router.push('/partnerUpgrad')
          } else if (parseInt(resData.status) === 2) {
            this.$router.push({path: '/partnerUpgrad', query: {id: resData.applyId}})
            // this.$router.push({path: '/partnerUpgrad', query: {id: resData.applyId, status: resData.status}})
          } else {
            this.$router.push('/myAppliy')
          }
        })
      },
      /**
       * 下拉收益计算器
       */
      show () {
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
              width: 2rem;
              padding-left: .30rem;
              padding-right: .35rem;
              text-align: center;
              overflow: hidden;
              /*border: 1px solid red;*/
              img{
                max-width:1rem;
                min-height: 1rem;
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
              font-size: .28rem;
              padding-right: .30rem;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 5;
            }
          }

          /**奖励方式**/
          .bor-rad{
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
          }

          /*---------------------------成为条件/获取内容------------------*/
          .partneRules-reward{
            background: #fff;
            h2{
              color: #333333;
              font-size: .35rem;
              font-weight: bold;
              text-align: center;
              padding: .25rem 0;
            }

            /**表格通用**/
            table{
              width: 80%;
              margin: 0 auto;
              tr{
                width: 80%;
                border-top: 1px solid #f5f5f5;
                td{
                  width: 50%;
                  padding: .2rem 0;
                  /*max-width: 3.1rem;*/
                }
                td:nth-child(1){
                  vertical-align: middle;
                  padding-right: .2rem;
                  color: #666666;
                  font-size: .3rem;
                  div{
                    padding: 0 0.2rem;
                  }
                }
                td:nth-child(2){
                  color: #666666;
                  font-size: .3rem;
                  padding-left: .2rem;
                  div{
                    margin-bottom: .1rem;
                    width: 1.2rem;
                    &:last-child{
                      margin-bottom: 0;
                    }
                  }
                }
              }
            }
          }

          .gain-income{
            background: #fff;
            border-bottom-left-radius: 7px;
            border-bottom-right-radius: 7px;
            h2{
              color: #2c6097;
              font-size: 0.26rem;
              height: 0.8rem;
              line-height: 0.8rem;
              border-top: 1px solid #eee;

              .icon{
                fill: #2c6097;
                width: 0.25rem;
                height: 0.25rem;
              }

              .icon-shangla2{
                margin-top: -0.1rem;
              }
            }

            .calculator{
              font-size: 0.28rem;
              /*display: none;*/
              height: 0.8rem;
              line-height: 0.8rem;
              padding: 0 0.5rem;
              border-top: 1px solid #eee;

              span{
                color: #fff;
                /*width: 1.2rem;*/
                height: 0.45rem;
                right: 0.3rem;
                top: 0.15rem;
                font-size: 0.28rem;
                padding: 0.05rem 0.2rem;
                line-height: 0.45rem;
                border-radius: 3px;
                background: -webkit-linear-gradient(left, #ffd174 , #f98324);
                background: linear-gradient(to right,#ffd174 , #f98324);
              }
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
    }

    .garyImg{
      filter: grayscale(100%);
      -webkit-filter: grayscale(100%);
    }
  }
</style>
