<template>
  <div class="partnerPlan">
    <!--ban-->
    <div class="partnerPlan-ban">
      <div class="partnerPlan-ban-user">
        <img src="../../assets/images/partnerPlan/plan-portrait-def.png" >
        <div class="grade-name">
          <div></div>
          <div>{{partnerData.ruleName}}</div>
        </div>
      </div>
      <ul>
        <li>
          <div>
            <img src="../../assets/images/partnerPlan/cons-integral.png" >
          </div>
          <div>
            <p>推荐获得消费积分</p>
            <p>
              <span v-if="pointData.bonusPoints > 10000">{{pointData.bonusPoints / 10000}}万个</span>
              <span v-else>{{pointData.bonusPoints}}个</span>
            </p>
          </div>
        </li>
        <li>
          <div>
            <img src="../../assets/images/partnerPlan/cash-integral.png" >
          </div>
          <div>
            <p>推荐获得通用积分</p>
            <p>
              <span v-if="pointData.cashPoints > 10000">{{pointData.cashPoints / 10000}}万个</span>
              <span v-else>{{pointData.cashPoints}}个</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <!--栏目类别-->
    <div class="partnerPlan-option">
      <ul>
        <li @click="$router.push('/partneRules')">
          <div>
            <img src="../../assets/images/partnerPlan/plan-icon1.png" >
          </div>
          <div>合伙规则</div>
        </li>
        <li @click="$router.push('/partnerUpgrad')">
          <div>
            <img src="../../assets/images/partnerPlan/plan-icon2.png" >
          </div>
          <div>合伙人升级</div>
        </li>
        <li  @click="$router.push('/partnerRecommended')">
          <div>
            <img src="../../assets/images/partnerPlan/plan-icon4.png" >
          </div>
          <div>推荐合伙人</div>
        </li>
        <li class="garyImg">
          <div>
            <img src="../../assets/images/partnerPlan/plan-icon3.png" >
          </div>
          <div>收益计算器</div>
        </li>
        <li class="garyImg">
          <div>
            <img src="../../assets/images/partnerPlan/plan-icon5.png" >
          </div>
          <div>我的收益</div>
        </li>
        <li class="garyImg">
          <div>
            <img src="../../assets/images/partnerPlan/plan-icon6.png" >
          </div>
          <div>我的推荐</div>
        </li>
      </ul>
    </div>
    <!--推荐消息-->
    <div class="recommend-message">
      <!-- <ul>
        <li v-for="item in 3">
          <div>张三推荐了李四，您获得了100的通用积分</div>
          <div>2018/05/20</div>
        </li>
      </ul> -->
    </div>
    <!-- <div class="noNews">暂无消息</div> -->
  </div>
</template>
<script>
  export default {
    data () {
      return {
        partnerData: '',        // 合伙人数据
        pointData: ''           // 积分信息
      }
    },
    mounted: function () {
      this.getPartnerData()
      this.getPointData()
    },
    methods: {
      /**
       * 获取合伙人升级数据
      */
      getPartnerData () {
        this.$http.post(this.api.getApplyInfoListByCustomerId).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.partnerData = resData.data
          }
        })
      },
      /**
       * 获取数据
      */
      getPointData () {
        this.$http.get(`${this.api.getMemberPoints}`, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.pointData = resData.data
          }
        })
      }
    }
  }
</script>
<style scoped lang=less>
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
      background: url(../../assets/images/partnerPlan/partnerPlan-ban.jpg) no-repeat;
      background-size: 100% 100%;
      background-color: #eee;
      position: relative;
      /**用户头像姓名**/
      .partnerPlan-ban-user{
        margin:0 auto;
        text-align: left;
        padding-top:.88rem;
        padding-left: .42rem;
        img{
          width:1.2rem;
          height:1.2rem;
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
            background: url(../../assets/images/partnerPlan/grade.png) no-repeat;
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
      margin-top: -1.02rem;
      position: relative;
      z-index: 200;
      padding: 0 .41rem;
      ul{
        li{
          width: 2.06rem;
          height: 2.06rem;
          border-radius: 9px;
          background: #fff;
          text-align: center;
          overflow: hidden;
          float: left;
          margin-right: .25rem;
          margin-bottom: .25rem;
          -webkit-box-shadow: 0 0 13px 0 rgba(154, 141, 141, 0.3);
          &:nth-child(3n){
            margin-right: 0;
          }
          div:nth-child(1){
            width:1.06rem;
            height:1.07rem;
            margin: 0 auto;
            margin-top: .27rem;
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
      background: url(../../assets/images/partnerPlan/recommend-message.png) no-repeat;
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
  }
</style>