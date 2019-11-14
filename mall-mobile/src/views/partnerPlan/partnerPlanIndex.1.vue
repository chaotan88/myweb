<template>
  <div class="partnerPlan">
    <!--ban-->
    <div class="partnerPlan-ban">
      <div class="partnerPlan-ban-user">
        <img src="../../assets/images/partnerPlan/plan-portrait-def.png" >
        <div>消费会员</div>
      </div>
      <ul>
        <li>
          <div>
            <img src="../../assets/images/partnerPlan/cons-integral.png" >
          </div>
          <div>
            <p>43535 个</p>
            <p>推荐获得消费积分</p>
          </div>
        </li>
        <li>
          <div>
            <img src="../../assets/images/partnerPlan/cash-integral.png" >
          </div>
          <div>
            <p>43535 个</p>
            <p>推荐获得通用积分</p>
          </div>
        </li>
      </ul>
    </div>
    <!--栏目类别-->
    <div class="partnerPlan-option">
      <ul>
        <li>
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
        <li>
          <div>
            <img src="../../assets/images/partnerPlan/plan-icon3.png" >
          </div>
          <div>收益计算器</div>
        </li>
        <li>
          <div>
            <img src="../../assets/images/partnerPlan/plan-icon4.png" >
          </div>
          <div>推荐合伙人</div>
        </li>
        <li>
          <div>
            <img src="../../assets/images/partnerPlan/plan-icon5.png" >
          </div>
          <div>我的收益</div>
        </li>
        <li>
          <div>
            <img src="../../assets/images/partnerPlan/plan-icon6.png" >
          </div>
          <div>我的推荐</div>
        </li>
      </ul>
    </div>
    <!--推荐消息-->
    <div class="recommend-message">
      <div class="recommend-message-title">推荐消息</div>
      <ul>
        <li v-for="item in 10">
          <div>张三推荐了李四，您获得了100的通用积分</div>
          <div>2018年05月20日</div>
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
    },
    methods: {
    }
  }
</script>
<style scoped lang=less>
  .partnerPlan{
    .partnerPlan-ban{
      height:4rem;
      background: url(../../assets/images/partnerPlan/partnerPlan-ban.png) no-repeat;
      background-size: 100% 100%;
      background-color: #eee;
      position: relative;
      /**用户头像姓名**/
      .partnerPlan-ban-user{
        margin:0 auto;
        text-align: center;
        padding-top:.45rem;
        img{
          width:1.2rem;
          height:1.2rem;
          border:.05rem solid #96684d;
          border-radius: 1.2rem;
        }
        div{
          font-size: .26rem;
          color:#ffffff;
          margin-top: .1rem;
        }
      }
      /**积分个数**/
      ul {
        display:flex;
        position: absolute;
        bottom: .24rem;
        width: 100%;
        li{
          display:flex;
          flex:1;
          justify-content: center;
          align-items: center;
          padding: .1rem 0;
          &:first-child{
            border-right: 1px dashed #fff;
          }
          div:nth-child(1){
            img{
              width:.5rem;
              height:.5rem;
              margin-right: .16rem;
              display: block;
            }
          }
          div:nth-child(2){
            color: #fff;
            p:nth-child(1){
              font-size: .28rem;
            }
            p:nth-child(2){
              font-size: .24rem;   
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
      padding-top:.35rem;
      border-top: .3rem solid #eee;
      border-bottom: .3rem solid #eee;
      ul{
        li{
          width: 25%;
          text-align: center;
          overflow: hidden;
          float: left;
          margin-bottom: .35rem;
          div:nth-child(1){
            width:.8rem;
            height: .8rem;
            margin: 0 auto;
            &:empty{
              background: #eee;
            }
            img{
              width:.8rem;
              height: .8rem;
              display: block;
            }
          }
          div:nth-child(2){
            font-size: .26rem;
            color: #666666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: .05rem;
          }
        }
      }
    }
    /**推荐消息**/
    .recommend-message{
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
          padding: 0 .4rem;
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
  }
</style>