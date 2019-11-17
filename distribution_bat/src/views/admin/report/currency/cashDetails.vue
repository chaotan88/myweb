<!-- 账户流水表详情 -->
<template>
  <common-tpl class="account-details-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">
        <el-form :model="detailsData" label-width="100px" class="demo-ruleForm">
          <!-- 充值详情 -->
          <h2 class="title maggin-t">充值详情</h2>
          <table>
            <tr>
              <td>会员姓名：</td>
              <td>{{detailsData.customerName | filterEmpty}}</td>
            </tr>
            <tr>
              <td>会员手机：</td>
              <td>{{detailsData.customerPhone | filterEmpty}}</td>
            </tr>
            <tr>
              <td>会员ID：</td>
              <td>{{detailsData.invitationCode | filterEmpty}}</td>
            </tr>
            <tr>
              <td>交易科目：</td>
              <td>{{detailsData.addSource | filterSource}}</td>
            </tr>
            <tr>
              <td>交易单号：</td>
              <td>{{detailsData.orderNo | filterEmpty}}</td>
            <tr>
              <td>第三方支付单号：</td>
              <td>{{detailsData.outOrderNo | filterEmpty}}</td>
            </tr>
            <tr>
              <td>交易方式：</td>
              <td>{{detailsData.payType === 2 ? '支付宝' : detailsData.payType === 1 ? '微信' : '--'}}</td>
            </tr>
            <tr>
              <td>交易金额：</td>
              <td>{{detailsData.propertyAmount | filterMoney}}</td>
            </tr>
            <tr>
              <td>交易时间：</td>
              <td>{{detailsData.transactionTime | filterDate}}</td>
            </tr>
          </table>
        </el-form>
      </div>
    </template>

    <template slot="footer">
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      detailsData: {}
    }
  },
  mounted () {
    this.detailsData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'detailsData'))
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.account-details-wrap{

  .goods-common-details{

    .title{
      height: 50px;
      line-height:50px;
      font-size: 16px;
      margin: 20px;
    }

    .maggin-t{
      margin-top: 0;
    }

    table{
      width: 100%;
      border: 1px solid #f1f4f7;
      border-collapse: collapse;
      margin-bottom: 20px;

      td{
        /*height: 50px;*/
        border: 1px solid #f1f4f7;
        font-size: 15px;
        padding: 20px;
      }

      td:nth-child(odd) {
        color: #666;
        width: 200px;
        text-align: right;
        background: #f8f8f8;
      }

      td:nth-child(even) {
        color: #333;
      }

    }

    .thumbnail-wrap{
      width: 100px;
      height: 100px;
      margin-right: 10px;
    }

    .pictrue-wrap{
      font-size: 0;

      .list{
        width: 80px;
        height: 80px;
        border: 1px solid #33719b;
        margin-right: 20px;
        overflow: hidden;
        border-radius: 5px;

        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
<style lang="less">
.account-details-wrap{
  .el-form-item{
    margin-bottom: 0;
  }

  .resource{
    .el-form-item__content{
      margin-left: 0 !important;
    }
  }
}
</style>

