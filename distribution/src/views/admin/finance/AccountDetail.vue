<!-- 共用详情页 -->
<template>
  <common-tpl class="account-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">
        <gray-title title="推广大使信息" class="ta-l title"></gray-title>
        <table>
          <tr>
            <td>推广大使手机：</td>
            <td>{{detailData.phone | filterEmpty}}</td>
          </tr>
          <tr>
            <td>级别产生方式：</td>
            <td>{{detailData.memberType | filterEmpty}}</td>
          </tr>
          <tr>
            <td>当前身份：</td>
            <td>{{detailData.disRuleName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>证件类型：</td>
            <td v-if="detailData.cardType === 1">身份证</td>
            <td v-else-if="detailData.cardType === 2">护照</td>
            <td v-else>--</td>
          </tr>
          <tr>
            <td>姓名：</td>
            <td>{{detailData.cardName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>证件号：</td>
            <td>{{detailData.idCard  | filterEmpty}}</td>
          </tr>
          <tr>
            <td>地区：</td>
            <td>{{detailData.userAddress  | filterEmpty}}</td>
          </tr>
        </table>

        <gray-title title="账户信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>当前账户余额：</td>
            <td>{{detailData.cashPoints | filterMoney}}</td>
          </tr>
          <tr>
            <td>累计佣金：</td>
            <td>{{detailData.cashPointsTotal | filterMoney}}</td>
          </tr>
          <tr>
            <td>已提现金额：</td>
            <td>{{detailData.withdrawalAmount  | filterMoney}}</td>
          </tr>
        </table>
        <gray-title title="支付宝绑定信息" class="ta-l"></gray-title>
        <table  v-if="detailsData.ifSetAlipay === 1">
          <tr>
            <td>支付宝姓名  ：</td>
            <td>{{detailsData.cardName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>支付宝账号：</td>
            <td>{{detailsData.alipayNum | filterEmpty}}</td>
          </tr>
        </table>
        <table v-else>
          <tr>
            <td>未绑定</td>
            <td></td>
          </tr>
        </table>
        <gray-title title="微信绑定信息" class="ta-l"></gray-title>
        <table v-if="detailsData.ifSetWechat === 1">
          <tr>
            <td>微信头像  ：</td>
            <td>
              <img :src="detailsData.wechatHeadimgurl | filterImgUrl" style="width: 100px; height: 100px;">
            </td>
          </tr>
          <tr>
            <td>微信昵称：</td>
            <td>{{detailsData.wechatNickname | filterEmpty}}</td>
          </tr>
          <tr>
            <td>openid：</td>
            <td>{{detailsData.wechatOpenid | filterEmpty}}</td>
          </tr>
        </table>
        <table v-else>
          <tr>
            <td>未绑定</td>
            <td></td>
          </tr>
        </table>
        <gray-title title="银行卡信息" class="ta-l"></gray-title>
        <table v-for="(bank, index) in detailsData.bankCardList" :key="index">
          <tr>
            <td>持卡人：</td>
            <td>{{detailsData.cardName | filterEmpty}}</td>
            <td>所属地区：</td>
            <td>{{bank.province + bank.city + bank.zone | filterEmpty}}</td>
            <td>开户银行：</td>
            <td>{{bank.bankName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>支行信息：</td>
            <td>{{bank.branchBankName | filterEmpty}}</td>
            <td>银行卡号：</td>
            <td>{{bank.cardNo | filterEmpty}}</td>
            <td>预留手机：</td>
            <td>{{bank.phone | filterEmpty}}</td>
          </tr>
        </table>
        <table v-if="!detailsData.bankCardList || detailsData.bankCardList.length === 0">
          <tr>
            <td>未绑定</td>
            <td></td>
          </tr>
        </table>
      </div>
    </template>


    <!-- 底部 -->
    <template slot="footer">
    </template>
  </common-tpl>
</template>

<script>

export default {
  data () {
    return {
      confirmLoading: false,
      detailsData: {
        bankCardList: []
      },
      detailData: {},
      customerId: ''
    }
  },
  mounted () {
    this.customerId = parseInt(this.$route.params.customerId) || ''
    this.detailData = JSON.parse(localStorage.getItem('account-info'))
    this.getDetails()
  },
  methods: {
    /**
     * 详情
     */
    getDetails () {
      this.$http.post('@ROOT_API/buyMemberAccountManageController/getAccountDetail', {
        customerId: this.customerId
      }).then(res => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        let results = resData.data
        if (results) {
          this.detailsData = results
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.account-detail-wrap{
  
  .admin-gray-title{
    margin-bottom: 0;
  }

  .goods-common-details{

    table{
      width: 100%;
      border: 1px;
      border-collapse: collapse;
      margin-bottom: 20px;

      td{
        font-size: 14px;
        padding: 10px;
        border: 1px solid #eee;
      }

      td:nth-child(odd) {
        width: 160px;
        text-align: right;
        border-right: none;
      }

      td:nth-child(even) {
        color: #999;
        border-left: none;
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
    .el-input {
      width: 200px;
    }
  }
  .el-table {
    margin-bottom: 20px;
  }
}
</style>
<style lang="less">
.account-detail-wrap{
  .el-dialog {
    .el-dialog__body {
      padding-bottom: 0;
      .btn-wrap {
        padding-bottom: 20px;
      }
    }
    .customer-info {
      margin-left: 35px;
      font-size: 12px;
      line-height: 20px;
    }
  }
  .region-select-wrap {
    justify-content: flex-start !important;
    .el-select, .el-input, input {
      width: 150px !important;
    }
  }
}
</style>
