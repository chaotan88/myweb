<template>
  <div class="partnerPlan">

    <!--ban-->
    <div class="partnerPlan-ban pos-r">
      <div class="user-wrap pos-r">
        <div class="user-cen pos-r">
          <div class="user-label pos-a"></div>
          <div class="user-set" @click="$router.push('/setup')">
            <svg class="icon icon-shezhi va-m" aria-hidden="true">
                <use xlink:href="#icon-shezhi"></use>
            </svg>
          </div>
          <div class="user-face" @click="$router.push('/user')">
            <div class="user-face-img">
              <img :src="partnerData.ruleIcon | filterImgUrl" v-if="partnerData.ruleIcon && partnerData">
              <img src="../../assets/images/plan-portrait-def.png"  v-if="!partnerData.ruleIcon && partnerData">
            </div>
            <div class="grade-name">
              <div></div>
              <div class="rule-name"><span class="d-ib">{{partnerData.ruleName}}</span></div>
            </div>
            <p v-if="partnerData.agentRandStr !== ''">({{partnerData.agentProvince}}&nbsp;{{partnerData.agentCity}}&nbsp;{{partnerData.agentZone}})</p>
            <h3>我的ID号：{{userInfo.invicationCode | filterEmpty}}</h3>
          </div>
          <!--<div class="upgrade-wrap pos-r">-->
            <!--<div class="upgrade-left pos-a ta-c" @click="$router.push('/bankPriceRange')">-->
              <!--<svg class="icon icon-yufukuan va-m" aria-hidden="true">-->
                <!--<use xlink:href="#icon-yufukuan"></use>-->
              <!--</svg>-->
              <!--<span>预付升级</span>-->
            <!--</div>-->
            <!--<span class="line pos-a"></span>-->
            <!--<div class="upgrade-right pos-a ta-c" @click="handleUpgrad">-->
              <!--<svg class="icon icon-jinbi2 va-m" aria-hidden="true">-->
                <!--<use xlink:href="#icon-quyuweizhi"></use>-->
              <!--</svg>-->
              <!--<span>区域加盟</span>-->
            <!--</div>-->
            <!--&lt;!&ndash;<div class="upgrade-right pos-a ta-c" @click="$router.push('/myEarning')">&ndash;&gt;-->
              <!--&lt;!&ndash;<svg class="icon icon-jinbi2 va-m" aria-hidden="true">&ndash;&gt;-->
                <!--&lt;!&ndash;<use xlink:href="#icon-shouyizhuanhua"></use>&ndash;&gt;-->
              <!--&lt;!&ndash;</svg>&ndash;&gt;-->
              <!--&lt;!&ndash;<span>我的收益</span>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--</div>-->
        </div>
      </div>
    </div>

    <!--栏目类别-->
    <div class="partnerPlan-option">

      <ul>
        <!--<li>-->
          <!--<router-link to="/myEarning">-->
            <!--<div>-->
              <!--<img src="../../assets/images/plan-icon5.png" >-->
            <!--</div>-->
            <!--<div>我的收益</div>-->
          <!--</router-link>-->
        <!--</li>-->
        <li>
          <router-link to="/earningTable">
            <div>
              <img src="../../assets/images/reportForms.png" >
            </div>
            <div>业绩报表</div>
          </router-link>
        </li>
        <li>
          <router-link to="/myRecommend">
            <div>
              <img src="../../assets/images/plan-icon6.png" >
            </div>
            <div>我的推荐</div>
          </router-link>
        </li>
        <li>
        <router-link to="/myEarning">
        <div>
        <img src="../../assets/images/plan-icon5.png" >
        </div>
        <div>我的收益</div>
        </router-link>
        </li>
        <li>
          <router-link to="/partnerRecommended">
            <div>
              <img src="../../assets/images/plan-icon4.png" >
            </div>
            <div>推荐会员</div>
          </router-link>
        </li>
        <li>
          <router-link to="/incomeCalculator">
            <div>
              <img src="../../assets/images/plan-icon3.png" >
            </div>
            <div>收益计算</div>
          </router-link>
        </li>
        <li>
          <router-link to="/partneRules">
            <div>
              <img src="../../assets/images/plan-icon1.png" >
            </div>
            <div>会员规则</div>
          </router-link>
        </li>
      </ul>
    </div>

    <!--推荐消息-->
    <info-list :pageSize="5"></info-list>
    <!--  <div class="recommend-message">
      <ul>
        <li v-for="(item, index) in InfomationList" v-if="index < 5">
          <div>{{item.content}}</div>
          <div>{{item.infoTime | customTime}}</div>
        </li>
      </ul>
    </div> -->

    <!-- 弹窗 -->
    <!--<div>-->
      <!--<x-dialog v-model="showToast" class="dialog-demo ta-c">-->
        <!--<div class="welcome-close pos-r ta-r" @click="handleCloseToast">-->
          <!--<svg class="icon icon-guanbi va-m" aria-hidden="true">-->
            <!--<use xlink:href="#icon-guanbi"></use>-->
          <!--</svg>-->
        <!--</div>-->
        <!--<div class="dialog-title">-->
          <!--<div>充任意金额</div>-->
          <!--<div><span>享</span>更高收益</div>-->
        <!--</div>-->
        <!--<img src="../../assets/images/upgrade-am.png" class="img-animation">-->
        <!--<div class="upgrade-btn" @click="$router.push('/bankPriceRange')">-->
          <!--充值升级-->
          <!--<svg class="icon icon-jiantouxi va-m" aria-hidden="true">-->
            <!--<use xlink:href="#icon-jiantouxi"></use>-->
          <!--</svg>-->
        <!--</div>-->
        <!--&lt;!&ndash; <div class="alert-wrap pos-r">-->
          <!--<div class="alert-cen">-->
            <!--<h3 class="ta-c">升级成为高级会员，</h3>-->
            <!--<h4 class="ta-c">享受更高业务收益</h4>-->
            <!--<div class="upgrade-button ta-c pos-a" @click="$router.push('/partnerUpgrad')">马上升级</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="welcome-wrap pos-a ta-c">-->
          <!--<div class="welcome-bg pos-a"></div>-->
          <!--<div class="welcome-close pos-r ta-r" @click="handleCloseToast">-->
            <!--<svg class="icon icon-guanbi va-m" aria-hidden="true">-->
              <!--<use xlink:href="#icon-guanbi"></use>-->
            <!--</svg>-->
          <!--</div>-->
        <!--</div> &ndash;&gt;-->
        <!--&lt;!&ndash; <div @click="showToast=false">-->
          <!--<span class="vux-close"></span>-->
        <!--</div> &ndash;&gt;-->
      <!--</x-dialog>-->
    <!--</div>-->

    <!-- 蒙版 -->
    <!-- <div class="mark pos-a"></div> -->

    <!-- <div class="noNews">暂无消息</div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {XDialog} from 'vux'
import infoList from './../infoList/infoList'    // 暂无数据
export default {
  components: {
    infoList,
    XDialog
  },
  data () {
    return {
      showToast: false,     // 弹窗
      partnerData: {},      // 合伙人数据
      maxRand: null,        // 等級最大值
      InfomationList: [],   // 消息通知
      pointData: '',        // 积分信息
      integralUpgradeState: '', // 弹窗数据
      userInfo: {}         // 用户信息
    }
  },

  computed: {
    ...mapState(['upgradeSte'])
  },

  watch: {
    upgradeSte: function () {
      // this.showToast = true
    },

    // 监听等级
    partnerData: {
      handler () {
        this.filterMaxRand()
      },
      deep: true
    },
    maxRand () {
      this.filterMaxRand()
    }
  },

  mounted: function () {
    this.userInfo = JSON.parse(localStorage.getItem('integralUserInfo'))
    // let integralUserInfo = JSON.parse(localStorage.getItem('integralUserInfo')) || {}
    if (this.userInfo && this.userInfo.token) {
      this.$store.dispatch('updateUpgradeSte', '1') // 更新vux中数据
    }
    this.getPartnerData()            // 合伙人数据
    // 升级弹窗
    this.integralUpgradeState = localStorage.getItem('integralUpgradeState')
    if (!this.integralUpgradeState) {
      this.getRulesList()
    }
    // console.log('partnerData', this.partnerData.rand)
  },

  methods: {
    /**
     * 获取会员升级数据
    */
    getPartnerData () {
      this.$http.post(this.api.getApplyInfoListByCustomerId).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          this.partnerData = resData.data
          // console.log(this.partnerData)
        }
      })
    },
    /**
     * 获取规则列表
    */
    getRulesList () {
      this.$http.post(this.api.getRuleList, {
      }).then((res) => {
        let resData = res.data
        if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
          this.maxRand = resData.data[resData.data.length - 1].rand
        }
      })
    },

    /**
     * 过滤是否最大值
     */
    filterMaxRand () {
      if (this.partnerData.rand && this.maxRand) {
        this.showToast = (parseInt(this.partnerData.rand) === parseInt(this.maxRand)) ? !!false : !!true
      }
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
        } else {
          this.$router.push('/myAppliy')
        }
      })
    },

    /**
     * 关闭弹窗
     */
    handleCloseToast () {
      localStorage.setItem('integralUpgradeState', true)
      this.showToast = false
    }
  }
}
</script>

<style scoped lang="less">
.partnerPlan{
  height: calc(100vh);
  background: #f9f9f9;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  /**灰色**/
  .garyImg{
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
  }
  .partnerPlan-ban{
    height:8.48rem;
    background: url(../../assets/images/partnerPlan-ban.png) no-repeat 0 -0.75rem;
    background-size: 100% 100%;
    // background-color: #fff;
    position: relative;
    /**用户头像姓名**/
    .partnerPlan-ban-user{
      margin:0 auto;
      text-align: center;
      padding-top:.88rem;
      padding-left: .42rem;
      img{
        width:1.2rem;
        height:1.2rem;
        margin-left: 50%;
        margin-right: -0.32rem;
        border:.05rem solid #aec5df;
        border-radius: 1.2rem;
        display: block;
      }
      .grade-name{
        min-width: 2.25rem;
        max-width: 4rem;
        height: .44rem;
        line-height: .44rem;
        background: rgba(255, 255, 255, 0.54);
        border-radius: .22rem;
        display: inline-block;
        overflow: hidden;
        margin-top: .2rem;
        div:nth-child(1){
          width: .44rem;
          height: .44rem;
          border-radius: .22rem;
          background: url(../../assets/images/grade.png) no-repeat;
          background-size: .3rem .23rem;
          background-position: center center;
          background-color: #fff;
          float: left;
          margin-right: .23rem;
        }
        div:nth-child(2){
          font-size:.26rem;
          color:#2e639e;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          height: .44rem;
          line-height: .44rem;
          float: left;
          display: table-cell;
          text-align: center;
          vertical-align: middle;
        }
      }
    }
    /**积分个数**/
    ul {
      display:flex;
      justify-content: center;
      position: absolute;
      bottom: 1.76rem;
      width: 100%;
      li{
        display:flex;
        width:3.25rem;
        height: .83rem;
        background: rgba(37, 90, 146, 0.8);
        border: .04rem solid rgba(254, 204, 195, 0.38);
        border-radius: 5px;
        justify-content: center;
        align-items: center;
        padding: .03rem 0;
        &:first-child{
          margin-right: .2rem;
        }
        div:nth-child(1){
          img{
            width:.66rem;
            height:.66rem;
            margin-right: .16rem;
            display: block;
          }
        }
        div:nth-child(2){
          color: #fff;
          p{
            line-height: .3rem;
          }
          p:nth-child(1){
            font-size: .24rem;
            color: rgba(255, 255, 255, 0.7);
            margin-top: .03rem;
          }
          p:nth-child(2){
            font-size: .35rem;
            margin-top: .1rem;
          }
        }
      }
    }
  }
  /**选项**/
  .partnerPlan-option{
    height: auto;
    overflow: hidden;
    margin-top: -2.6rem;
    position: relative;
    z-index: 200;
    padding: 0 .41rem;
    ul{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li{
        width: 2.06rem;
        height: 2.06rem;
        border-radius: 9px;
        background: #fff;
        text-align: center;
        overflow: hidden;
        /*float: left;*/
        /*margin-right: .25rem;*/
        margin-bottom: .25rem;
        -webkit-box-shadow: 0 0 13px 0 rgba(154, 141, 141, 0.3);
        &:nth-child(3n){
          margin-right: 0;
        }
        a{
          display: block;
          padding-top: .27rem;
        }
        div:nth-child(1){
          width:1.06rem;
          height:1.07rem;
          margin: 0 auto;
          &:empty{
            background: #eee;
          }
          img{
            width:1.06rem;
            height:1.07rem;
            display: block;
          }
        }
        div:nth-child(2){
          font-size: .26rem;
          color: #666666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: .15rem;
        }
      }
    }
  }
  /**推荐消息**/
  .recommend-message{
    background: url(../../assets/images/recommend-message.png) no-repeat;
    background-size: .44rem .45rem;
    background-position: top left;
    background-color: #fff;
    margin: 0 .41rem;
    margin-bottom: .5rem;
    border-radius: 9px;
    -webkit-box-shadow: 0 0 14px 0 rgba(154, 141, 141, 0.3);
    .recommend-message-title{
      height: .87rem;
      line-height: .87rem;
      border-bottom: .02rem solid #eee;
      padding: 0 .4rem;
      color: #666666;
      font-size: .3rem;
    }
    ul{
      li{
        display: flex;
        margin-left: .4rem;
        padding-right: .14rem;
        font-size: .24rem;
        color: #999999;
        height: .78rem;
        line-height: .78rem;
        border-bottom: .02rem solid #eee;
        div:nth-child(1){
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: .4rem;
        }
      }
    }
  }
  .noNews{
    text-align: center;
    font-size: .28rem;
    margin: .5rem 0;
  }

  /*------------用户头像---------------*/
  .user-wrap{
    padding: 0.7rem .41rem;
    padding-bottom: 0;
    /*z-index: 668;*/

    .user-cen{
      height: 4.04rem;
      background: rgba(38, 66, 160, .65);
      left: 0;
      top: 0;
      padding: 0.6rem 0;
      padding-bottom: 0;
      border-radius: 0.1rem;

      .user-label{
        width: 1.3rem;
        height: 1.3rem;
        left: 0;
        top: 0;
        left: 0;
        top: 0;
        background: url("../../assets/images/home-icon1.png");
        background-size: cover;
      }

      .user-set{
        width: 1rem;
        height: 1rem;
        right: 0;
        top: 0;
        position: absolute;
        background-size: cover;
        text-align: center;
        line-height: 1rem;

        .icon{
          fill: #fff;
          width: 0.45rem;
          height: 0.45rem;
        }
      }

      .user-face{
        text-align: center;
        .user-face-img{
          width: .9rem;
          min-height: 1.3rem;
          margin:0 auto;
          img{
            width: .9rem;
          }
        }

        .rule-name{
          span{
            color: #fff;
            font-size: 0.3rem;
            width: 1.3rem;
            height: 0.4rem;
            line-height: 0.4rem;
            border: 1px solid #596eb6;
            border-radius: 30px;
            padding: 0.02rem 0.2rem;
            font-size: .28rem;
          }
        }
        p{
          margin-top: 0.1rem;
          font-size: 0.25rem;
          color: #a0acd5;
        }
        h3{
          color: #a0acd5;
          font-size: 0.25rem;
          height: 0.5rem;
          line-height: 0.5rem;
        }
      }

      .upgrade-wrap{
        width: 100%;
        height: 1.1rem;
        line-height: 1.14rem;
        color: #fff;
        background: rgba(36, 65, 151, .2);
        position: absolute !important;
        bottom: 0;

        .icon{
          fill: #fff;
          width: 0.45rem;
          height: 0.45rem;
        }

        span{
          color: #cbd3e2;
          font-size: 0.28rem;
        }

        .line{
          border: 1px solid rgba(246,246,246,0.2);
          height: 0.5rem;
          left: 50%;
          margin-top: 0.3rem;
        }
        .upgrade-left{
          position: absolute;
          width: 50%;

          .icon{
            width: 0.5rem;
            height: 0.5rem;
          }
        }

        .upgrade-right{
          width: 50%;
          right: 0;
          top: 0;
        }
      }
    }
  }
}
</style>

<style lang="less">
.partnerPlan{

/*------------弹窗样式---------------*/
  .weui-dialog{
    width: 100%;
    max-width: 6rem;
    height: 7.99rem;
    /*top: 3.8rem;*/
    background-color: none;
    border-radius: 10px;
    overflow: visible;
    background: none;
    background: url('../../assets/images/points.png') no-repeat;
    background-size: 100%;
    /**弹窗新**/
    img{
      width:5.98rem;
    }
    .dialog-title{
      margin-top: 2.6rem;
      color:#fff;
      font-size: .4rem;
      div{
        line-height: .6rem;
      }
      div:nth-child(2){
        margin-left: -.5rem;
      }
      span{
        color:#fed930;
        font-size:.5rem;
        margin-right:.1rem;
      }
    }
    .welcome-close{
      position: absolute !important;
      right: 0;
      top: 0rem;
      z-index: 669;
      .icon{
        fill: #fff;
        width: 1.1rem;
        height: 1.1rem;
      }
    }
    .img-animation{
      width:3.06rem;
      height: 3.2rem;
      -webkit-animation: 0.7s am infinite alternate;
      margin-top: -.2rem;
    }
     @-webkit-keyframes am{
      0%{opacity:0.85}
      50%{opacity:0;}
      100%{opacity: 0.85;}
      }
    .upgrade-btn{
      width:3.52rem;
      height:.63rem;
      line-height:.63rem;
      background:#ffff00;
      border-radius:40px;
      color:#d51604;
      position: absolute;
      bottom: .38rem;
      left: 0;
      right: 0;
      margin: auto;
      svg{
        fill:#ea0315;
        width:.3rem;
        height:.3rem;
        margin-left: .65rem;
        position: absolute;
        right:.35rem;
        top:0;
        bottom:0;
        margin:auto;
      }
    }





    .welcome-wrap{
      width: 100%;
      height: 3.7rem;
      left: 0;
      top: -1.6rem;
      z-index: 667;

      .welcome-bg{
        width: 3.5rem;
        height: 3.7rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        top: -0.5rem;
        background: url(../../assets/images/welcome.png) no-repeat -1rem 0;
        background-size: cover;
      }

      .welcome-close{
        right: 0;
        top: 0.3rem;
        z-index: 669;
        .icon{
          fill: #fff;
          width: 1.1rem;
          height: 1.1rem;
        }
      }
    }

    .alert-wrap{
      background: #fff;
      z-index: 666;
      border-radius: 10px;
      .alert-cen{
        height: 4rem;
        h3{
          color: #f4ae52;
          font-size: 0.34rem;
          padding-top: 1.5rem;
          line-height: 0.6rem;
        }
        h4{
          color: #666666;
          font-size: 0.3rem;
          line-height: 0.6rem;
        }

        .upgrade-button{
          color: #fff;
          height: 0.95rem;
          line-height: 0.95rem;
          font-size: 0.34rem;
          width: 100%;
          bottom: -0.01rem;
          background: #fe9a01;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }
  }
}
</style>
