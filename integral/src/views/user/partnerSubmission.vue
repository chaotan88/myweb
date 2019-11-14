<template>
  <div class="partnerSubmission">
    <div @click="$router.push({path: '/partnerUpgrad', query: { id: partnerData.id }})" class="modifyApply">修改申请</div>
    <table border="0" cellspacing="0" cellpadding="0">
      <tr>
        <th align="right" valign="middle">当前身份</th>
        <th align="left">
          <div>{{partnerData.currentIdentity}}</div>
        </th>
      </tr>
      <tr>
        <th align="right" valign="middle">姓名</th>
        <th align="left">
          <div>{{partnerData.cardName}}</div>
        </th>
      </tr>
      <tr>
        <th align="right" valign="middle">证件号</th>
        <th align="left">
          <div>{{partnerData.idCard}}</div>
        </th>
      </tr>
      <tr>
        <th align="right" valign="middle">性别</th>
        <th align="left">
          <div>{{partnerData.sex | sexStatusFilter}}</div>
        </th>
      </tr>
      <tr>
        <th align="right" valign="middle">代理地区</th>
        <th align="left">
          <div>{{partnerData.agentProvince}} {{partnerData.agentCity}} {{partnerData.agentZone}}</div>
        </th>
      </tr>
      <tr>
        <th align="right" valign="middle">升级合伙身份</th>
        <th align="left">
          <div>{{partnerData.applyIdentity}}</div>
        </th>
      </tr>
      <tr>
        <th align="right" valign="middle">代理金额</th>
        <th align="left">
          <div>{{partnerData.agentAmount}}</div>
        </th>
      </tr>
    </table>
    <!--底部-->
    <div class="partnerUpgrad-footer">
      <div class="partnerUpgrad-footer-money">应付金额: <span>¥{{partnerData.payAmount}}</span></div>
      <div class="partnerUpgrad-footer-btn"  @click="goPay">付款</div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        partnerData: ''             // 提交申请数据
      }
    },
    mounted: function () {
      this.partnerData = JSON.parse(localStorage.getItem('partnerData'))
      // console.log(JSON.stringify(this.partnerData, null, 4))
    },
    methods: {
      /**
       * 付款
      */
      goPay () {
        localStorage.setItem('payOrderNo', this.partnerData.applyNo)
        localStorage.setItem('orderType', 2)
        window.location.href = window.location.href.match(/.*points/gi)[0] + '/pay/orderPay?redirect=gopay&shopId=1'
      }
    }
  }
</script>
<style scoped lang=less>
  .partnerSubmission{
    .modifyApply{
      height: .8rem;
      padding: 0 .3rem;
      line-height: .8rem;
      text-align: right;
      font-size: .28rem;
      color: #3d74b3;
      border-bottom: 1px solid #eee;
    }
    table{
      width: 100%;
      tr{
        height: .8rem;
        font-size: .26rem;
        color: #666666;
        th{
          border-bottom: 1px solid #e7e9ee;
          vertical-align: middle;
          padding-right:.25rem;
          &:first-child{
            width: 1.6rem;
            background:#e2eff8;
            padding-left: .21rem;
          }
          &:nth-child(2){
            background: #eaf3fa;
            padding-left: .22rem;
            color: #999999;
            padding: .1rem 0 .1rem .47rem;
          }
          img{
            width:.74rem;
            height:.47rem;
            display:block;
          }
          .reason{
            color:#3276b4;
            margin-left:.2rem;
          }
        }
      }
    }
    .partnerUpgrad-footer{
      width: 7.5rem;
      height: .98rem;
      border-top: 1px solid #dddddd;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      z-index: 300;
      .partnerUpgrad-footer-money{
        color: #666666;
        margin-right: .21rem;
        font-size: .28rem;
        span{
          font-size: .34rem;
          color: #f23030;
        }
      }
      .partnerUpgrad-footer-btn{
        width: 1.9rem;
        height: .98rem;
        background: #f23030;
        color: #fff;
        font-size: .3rem;
        text-align: center;
        line-height: .98rem;
      }
    }
  }
</style>
