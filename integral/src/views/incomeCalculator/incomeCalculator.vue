<template>
  <div class="partner-recommended-wrap">
    <div class="partner-recommended-box">
      <!-- 用户信息 -->
      <dl class="user-wrap" :class="{default: !currentLevelData.ruleIcon}">
        <dt>
          <img v-if="currentLevelData.ruleIcon" :src="currentLevelData.ruleIcon | filterImgUrl">
          <img v-else src="../../assets/images/recommend-user.png">
        </dt>
        <dd>
          <x-icon type="ios-arrow-down" class="icon-red" size="0.2rem"></x-icon>
          <!-- 请选择身份 -->
          <select v-model="levelId" @change="ruleNameChange">
            <option value="">选择推荐人身份</option>
            <template v-for="item in levelListData">
              <option :label="item.ruleName" :value="item.id">{{item.ruleName}}</option>
            </template>
          </select>
        </dd>
      </dl>
      <!-- 代理费 -->
      <div class="profit-wrap agency-fee" v-if="currentLevelData.agentFee || currentLevelData.directRecommendPeer">
        <div class="title">
          成为条件
          <span class="point point-l"></span>
          <span class="point point-r"></span>
        </div>
        <div class="profit-cen">
          <table>
            <tr v-if="currentLevelData.agentFee">
              <td>消费金额<div class="line"><span></span></div></td>
              <td>
                <span>{{currentLevelData.agentFee | filterEmpty('元')}}</span>
              </td>
            </tr>
            <tr v-if="currentLevelData.consumePoint">
              <td>消费积分<div class="line"><span></span></div></td>
              <td>{{currentLevelData.consumePoint | filterEmpty('个')}}</td>
            </tr>
            <tr v-if="currentLevelData.directRecommendPeer">
              <td>推荐{{currentLevelData.ruleName}}<div class="line"><span></span></div></td>
              <td>{{currentLevelData.directRecommendPeer | filterEmpty('人 升级')}}</td>
            </tr>
          </table>
        </div>
      </div>
      <!-- 获取内容 -->
      <div class="profit-wrap get-content" v-if="currentLevelData.toGoodsMoney || currentLevelData.giveConsumePoint">
        <div class="title">
          获取内容
          <span class="point point-l"></span>
          <span class="point point-r"></span>
        </div>
        <div class="profit-cen">
          <table>
            <tr v-if="currentLevelData.toGoodsMoney">
              <td>获得商品<div class="line"><span></span></div></td>
              <td>
                <span>{{currentLevelData.toGoodsMoney | filterEmpty('元')}}</span>
              </td>
            </tr>
            <tr v-if="currentLevelData.toConsumePoint">
              <td>获得消费积分<div class="line"><span></span></div></td>
              <td>{{currentLevelData.toConsumePoint | filterEmpty('个')}}</td>
            </tr>
            <tr v-if="currentLevelData.giveConsumePoint">
              <td>赠送消费积分<div class="line"><span></span></div></td>
              <td>{{currentLevelData.giveConsumePoint | filterEmpty('个')}}</td>
            </tr>
          </table>
        </div>
      </div>
      <!-- 奖励方式 -->
      <div class="profit-wrap reward-method">
        <div class="title">
          推荐分销商计算奖励
          <span class="point point-l"></span>
          <span class="point point-r"></span>
        </div>
        <div class="profit-cen">
          <div class="reward-box">
            <div>
              <p>我可以推荐的人</p>
            </div>
            <div @click="addRecommend">
              <p>添加推荐</p>
            </div>
          </div>
          <ul v-if="myRecommend.length">
            <li class="reward-head">
              <div>推荐方式</div>
              <div>推荐人身份</div>
              <div>推荐人数</div>
              <div>操作</div>
            </li>
            <li v-for="(item, index) in myRecommend">
              <div>{{item.recommendType | recommendTypeFilter}}</div>
              <div>{{item.recommendRuleName}}</div>
              <div>{{item.recommendNum}}</div>
              <div class="handle-del" @click="handleDel(index)"><p>-</p></div>
            </li>
          </ul>
          <no-data-component v-if="!myRecommend.length"></no-data-component>
        </div>
      </div>

      <!-- 其他 -->
      <x-dialog v-model="showToast" class="recommend-wrap">
        <div class="recommend-box">
          <div class="type-box" :class="{active: recommondType === 1}" @click="chooseRecommend">
            <span>直接推荐</span>
            <img src="../../assets/images/checked.png" alt="">
          </div>
          <div class="type-box" :class="{active: recommondType === 2}" @click="chooseInrecommend">
            <span>间接推荐</span>
            <img src="../../assets/images/checked.png" alt="">
          </div>
        </div>
        <div class="recommend-box">
          <div class="recommend-label">推荐身份</div>
          <div class="pos-r recommend-content">
            <x-icon type="ios-arrow-down" class="pos-a select-icon" size="0.2rem"></x-icon>
            <select v-model="recommendId" @change="recommendChange">
              <option value="">选择推荐人身份</option>
              <template v-for="item in levelListData">
                <option :label="item.ruleName" :value="item.id">{{item.ruleName}}</option>
              </template>
            </select>
          </div>
        </div>
        <div class="recommend-box">
          <div class="recommend-label">推荐人数</div>
          <div class="pos-r recommend-content">
            <input type="text" v-model="directRecPeople">
          </div>
        </div>
        <div class="recommend-bottom">
          <div @click="showToast = false">取消</div>
          <div @click="handleConfirm">确认</div>
        </div>
      </x-dialog>
      <div class="clear"></div>
    </div>

    <!-- 底部 -->
    <!--<div class="calculation-footer-hei"></div>-->
    <div class="calculation-footer">
      <div class="calculation-footer-l">
        <p>
          <span>消费积分：</span>
          <span>
            <template v-if="calculateRes.consumeIntegral && calculateRes.consumeIntegral !== 0">0~{{calculateRes.consumeIntegral | numToFixed}}个</template>
            <template v-else>0个</template>
          </span>
        </p>
        <p>
          <span>通用积分：</span>
          <span>
            <template v-if="calculateRes.cashIntegral && calculateRes.cashIntegral !== 0">0~{{calculateRes.cashIntegral | numToFixed}}个</template>
            <template v-else>0个</template>
          </span>
        </p>
      </div>
      <div class="calculation-footer-r" @click="handleCalculate">马上计算</div>
    </div>
  </div>
</template>

<script>
import { XDialog } from 'vux'
import noDataComponent from './../public/noData'    // 暂无数据
export default {
  data () {
    return {
      levelId: '',                                 // 等级id
      levelListData: [],                           // 等级列表
      myRecommend: [
        // {recommendType: 1, recommendRuleName: '铂金会员', recommendNum: 2, agentFee: 10, consumePoint: 10},
        // {recommendType: 2, recommendRuleName: '钻石会员', recommendNum: 2, agentFee: 10, consumePoint: 10},
        // {recommendType: 2, recommendRuleName: '钻石会员', recommendNum: 2, agentFee: 10, consumePoint: 10}
      ],                            // 推荐列表
      currentLevelData: {},                        // 当前等级
      recommendId: '',                             // 直接推荐id
      recommendData: {},                           // 当前选择直接推荐数据
      recommondType: 0,                         // 推荐方式
      directRecPeople: '',                         // 推荐人数
      showToast: false,                                // 添加推荐人
      isActive: null,
      calculateRes: {
        consumeIntegral: null,                       // 计算消费积分
        cashIntegral: null                          // 计算通用积分
      }
    }
  },

  components: {
    XDialog,
    noDataComponent
  },

  mounted () {
    this.getListData()
  },

  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.$http.post(this.api.getRuleList, {}).then((res) => {
        let resData = res.data
        if (resData.status !== this.api.ERR_OK) {
          this.$vux.toast.text(resData.msg)
          return false
        }
        this.levelListData = resData.data
        this.recommendChange()
      })
    },

    /**
     * 等级切换
     */
    ruleNameChange () {
      this.levelListData.map(row => {
        if (row.id === this.levelId) {
          this.currentLevelData = row
          return false
        }
      })
    },

    /**
     * 选择直接
     */
    chooseRecommend () {
      this.recommondType = 1
    },

    /**
     * 选择间接
     */
    chooseInrecommend () {
      this.recommondType = 2
    },

    /**
     * 直接推荐切换
     */
    recommendChange () {
      let filterRes = this.levelListData.filter((row) => row.id === this.recommendId)
      this.recommendData = filterRes.length ? filterRes[0] : {}
    },

    /**
     * 添加推荐
     */
    addRecommend () {
      if (this.levelId === '') {
        this.$vux.toast.text('请选择您当前的推荐身份')
        return false
      }
      this.showToast = true
      this.recommondType = 0
      this.recommendId = ''
      this.recommendData = {}
      this.directRecPeople = ''
    },

    /**
     * 删除操作
     */
    handleDel (index) {
      this.myRecommend.splice(index, 1)
    },

    /**
     * 确认添加
     */
    handleConfirm () {
      let reg = /^[1-9]\d*$/
      if (this.recommondType === 0) {
        this.$vux.toast.text('请选择推荐类型')
        return false
      } else if (JSON.stringify(this.recommendData) === '{}') {
        this.$vux.toast.text('请选择推荐身份')
        return false
      } else if (!this.directRecPeople) {
        this.$vux.toast.text('请填写推荐人数')
        return false
      } else if (!this.directRecPeople.match(reg)) {
        this.$vux.toast.text('填写人数格式错误')
        return false
      }
      let obj = {}
      obj.recommendType = this.recommondType
      obj.recommendRuleName = this.recommendData.ruleName
      obj.agentFee = this.recommendData.agentFee
      obj.consumePoint = this.recommendData.consumePoint
      obj.recommendNum = this.directRecPeople
      this.myRecommend.push(obj)
      this.showToast = false
    },

    /**
     * 计算
     */
    handleCalculate () {
      this.calculateRes.cashIntegral = 0
      this.calculateRes.consumeIntegral = 0
      if (this.levelId === '') {
        this.$vux.toast.text('请选择您当前的推荐身份')
        return false
      } else if (!this.myRecommend.length) {
        this.$vux.toast.text('请添加推荐人')
        return false
      } else {
        this.myRecommend.map(item => {
          this.calculateRes.cashIntegral += item.agentFee * item.recommendNum * this.currentLevelData.cashRate / 100
          this.calculateRes.consumeIntegral += item.consumePoint * item.recommendNum * this.currentLevelData.consumePointRate / 100
        })
        this.calculateRes.cashIntegral = Math.round(this.calculateRes.cashIntegral)
        this.calculateRes.consumeIntegral = Math.round(this.calculateRes.consumeIntegral)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.partner-recommended-wrap{
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: 'microsoft yahei';
  height: calc(100vh);
  /*overflow: hidden;*/
  padding: .9rem 0.4rem 0 0.4rem;
  background: #2f639d url(../../assets/images/recommend-bg.jpg) no-repeat center top;
  background-size: 100%;

  box-sizing: border-box;
  .partner-recommended-box{
    height: calc(~"100vh - 1.3rem - 0.9rem");
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  /* -------------------- { 用户信息 } -------------------- */

  .user-wrap{
    margin-bottom: .65rem;
    text-align: center;
    dt{
      width: 1rem;
      height: 1rem;
      display: block;
      margin: 0 auto .2rem auto;
      border-radius: 100%;
      box-sizing: border-box;

      img{
        // width: 100%;
        height: 100%;
      }
    }

    dd{
      color: #2e639e;
      height: .44rem;
      line-height: .44rem;
      display: inline-block;
      padding: 0 .4rem 0 .6rem;
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
        font-size: 0.3rem;

        option{
          height: .5rem;
          padding: 0 .1rem;
        }
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

  .user-wrap.default{
    dt{
      border: 0.04rem solid rgba(255, 255, 255, .5);
      overflow: hidden;
    }
  }

  /* -------------------- { 代理费、获取内容、奖励方式 } -------------------- */
  .profit-wrap{
    overflow: hidden;
    background: #fff;
    border-radius: .08rem;
    margin-top: .3rem;
    margin-bottom: .3rem;
    .title{
      color: #fff;
      height: .8rem;
      line-height: .8rem;
      font-size: .34rem;
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
        background: #3c74b2 url(../../assets/images/title-red-bg.png) no-repeat center top;
        background-size: 100% 100%;
      }
    }
    &.get-content{
      .title{
        background: #3c74b2 url(../../assets/images/title-violet-bg.png) no-repeat center top;
        background-size: 100% 100%;
      }
    }
    &.reward-method{
      .title{
        background: #3c74b2 url(../../assets/images/title-green-bg.png) no-repeat center top;
        background-size: 100% 100%;
      }

      .reward-head{
        background: #f4f6f8;
      }

      .reward-method-title{
        height: 1rem;
        text-align: center;

        h3{
          display: flex;
          align-items: center;
          padding-top: .2rem;

          span{
            padding: 0 .1rem;
            font-weight: bold;
          }

          &:before{
            content: '';
            flex: 1;
            height: 1px;
            background: #cdcdcf;
          }

          &:after{
            content: '';
            flex: 1;
            height: 1px;
            background: #cdcdcf;
          }
        }
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
          font-size: 0.25rem;
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

      .reward-box{
        display: flex;
        font-size: .24rem;
        padding-top: .2rem;

        div{
          p{
            padding: .1rem .2rem;
            font-weight: bold;
          }
        }

        div{
          width: 65%;
        }

        div:last-child{
          width: 30%;
          text-align: center;
          cursor: default;

          p{
            color: #fff;
            background: #f74d4d;
            border-radius: .05rem;
          }
        }
      }

      ul{
        width: 100%;
        border: 1px solid #ebebeb;
        border-radius: .05rem;
        margin: .3rem 0;

        li{
          display: flex;
          align-items: center;
          height: .88rem;
          font-size: 0.26rem;
          border-bottom: .02rem solid #ececec;

          div{
            text-align: center;
            width: 30%;
          }

          div:last-child{
            flex-shrink: 1;
            width: 1rem;
          }

          .handle-del{

            p{
              width: .3rem;
              height: .3rem;
              line-height: .28rem;
              margin: 0 auto;
              color: #fff;
              background: #f74d4d;
              border-radius: 50%;
            }

          }
        }

        li:last-child{
          border-bottom: none;
        }
      }
    }

    .recommend-calculat-option{
      padding: .54rem .58rem;
      padding-top: .1rem;

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

          .select-icon{
            fill: #f74d4d;
            width: .36rem;
            height: .36rem;
            line-height: .36rem;
            right: .1rem;
            top: .08rem;
          }

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
            box-sizing: border-box;
            option{
              color: #666666;
            }
          }
          input{
            width: 100%;
            height: .44rem;
            border: 1px solid #f74d4d;
            border-radius: 30px;
            font-size: .26rem;
            padding-left: .32rem;
            box-sizing: border-box;
          }
        }
      }
    }
  }
  /* -------------------- { 推荐计算 } -------------------- */
  .recommend-calculat{

  }

  /* -------------------- { 其他 } -------------------- */
  .recommend-wrap{
    width: 100%;

    .recommend-box{
      display: flex;
      margin: 0 .34rem;
      border-bottom: 1px dotted #d9d9d9;

      div{
        position: relative;
        width: 2.4rem;
        height: .7rem;
        line-height: .7rem;
        margin: .3rem .27rem;
        text-align: left;

        img{
          position: absolute;
          width: .4rem;
          right: 0;
          bottom: 0;
          display: none;
        }

        select{
          width: 100%;
          height: .64rem;
          appearance:none;
          -moz-appearance:none;
          -webkit-appearance:none;
          outline: none;
          border: none;
          border: 1px solid #d9d9d9;
          border-radius: .08rem;
          font-size: .26rem;
          padding-left: .32rem;
          /*color: #d9d9d9;*/
          background: none;
          box-sizing: border-box;
          z-index: 10;
          option{
            color: #666666;
          }
        }

        .select-icon{
          fill: #d9d9d9;
          width: .36rem;
          height: .36rem;
          line-height: .36rem;
          right: .1rem;
          top: .16rem;
          z-index: 5;
        }
      }

      .type-box{
        border: 1px solid #d9d9d9;
        border-radius: .07rem;
        text-align: center;
      }

      .recommend-label{
        width: 2rem;
      }

      .recommend-content{
        width: 100%;

        input{
          width: 100%;
          height: .64rem;
          appearance:none;
          -moz-appearance:none;
          -webkit-appearance:none;
          outline: none;
          border: none;
          border: 1px solid #d9d9d9;
          border-radius: .08rem;
          font-size: .26rem;
          padding-left: .3rem;
          /*color: #d9d9d9;*/
          background: none;
          box-sizing: border-box;
        }
      }

      .active{
        border: 1px solid #f74d4d;

        img{
          display: block;
        }
      }
    }

    .recommend-bottom{
      display: flex;
      margin-top: .5rem;
      box-shadow: 0.02rem -0.03rem 0.03rem #eee;

      div{
        width: 50%;
        height: 1rem;
        line-height: 1rem;
        color: #fff;
        background: #f74d4d;
        font-weight: bold;
      }

      div:first-child{
        color: #f74d4d;
        background: #fff;
      }
    }
  }

  /* -------------------- { 底部计算 } -------------------- */
  .calculation-footer-hei{
    height: 1rem;
  }
  .calculation-footer{
    width: 7.5rem;
    height: 1.3rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: #fff;
    display: flex;
    align-items: center;
    /*border-top: 1px solid #eee;*/
    box-shadow: 0 -0.02rem 0.05rem #eee;
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
      height: 1.3rem;
      line-height: 1.3rem;
      text-align: center;
      /*border-top-right-radius: 8px;*/
      background: #f23030;
      color: #fff;
      font-size: .32rem;
    }
  }
}
</style>
<style lang="less">
  .recommend-wrap{
    .weui-dialog{
      width: 100%;
      max-width: 6.7rem;
    }
  }
</style>

