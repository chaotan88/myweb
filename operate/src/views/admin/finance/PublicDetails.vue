<template>
  <common-tpl class="finance-public-details" footer back>
    <template slot="main">

      <gray-title title="会员信息"></gray-title>
      <table class="admin-gray-table">
        <tr>
          <td>会员姓名：</td>
          <td>{{detailsData.customerName | filterEmpty}}</td>
          <td>手机号：</td>
          <td>{{detailsData.customerPhone | filterEmpty}}</td>
        </tr>
        <tr>
          <td>可用余额：</td>
          <td>{{detailsData.balance | filterMoney | filterEmpty('元')}}</td>
          <td>通用积分：</td>
          <td>{{detailsData.cashPoints | filterMoney | filterEmpty('元')}}</td>
        </tr>
        <tr>
          <td>消费积分：</td>
          <td colspan="3">{{detailsData.bonusPoints | filterMoney | filterEmpty('个')}}</td>
        </tr>
      </table>

      <template v-if="rechargeDetails.rechargeType === 2">
        <gray-title title="充值信息"></gray-title>
        <table class="admin-gray-table">
          <template v-if="rechargeDetails">
            <tr>
              <td>余额充值：</td>
              <td>{{rechargeDetails.amountOfMoney | filterMoney | filterEmpty('元')}}</td>
              <td>消费积分充值：</td>
              <td>{{rechargeDetails.consumePoints | filterEmpty('个')}}</td>
            </tr>
            <tr>
              <td>充值凭证：</td>
              <td>
                <template v-if="rechargeDetails.paymentVoucher" v-for="item in rechargeDetails.paymentVoucher">
                  <div class="ta-c d-ib pos-r cursor-p thumbnail-wrap" @click="handlePreview(item)">
                    <span class="full-wrap pos-a"><i class="el-icon-circle-plus-outline"></i></span>
                    <img :src="item | filterImgUrl" class="full-wrap">
                  </div>
                </template>
                <template v-else>{{rechargeDetails.paymentVoucher | filterEmpty}}</template>
              </td>
              <td>充值人：</td>
              <td>{{rechargeDetails.rechargeUserName}}</td>
            </tr>
            <tr>
              <td>充值时间：</td>
              <td colspan="3">{{rechargeDetails.addTime | filterDate}}</td>
            </tr>
          </template>
          <tr v-else>
            <td><no-data style="padding: 50px;"></no-data></td>
          </tr>
        </table>
      </template>

      <template v-if="rechargeDetails.rechargeType === 1">
        <gray-title :title="rechargeDetails.rechargeType === 1 ? '扣款信息' : '充值信息'"></gray-title>
        <table class="admin-gray-table">
          <template v-if="rechargeDetails">
            <tr>
              <td>余额扣除：</td>
              <td>{{rechargeDetails.amountOfMoney | filterMoney | filterEmpty('元')}}</td>
              <td>消费积分扣除：</td>
              <td>{{rechargeDetails.consumePoints | filterEmpty('个')}}</td>
            </tr>
            <tr>
              <td>扣款凭证：</td>
              <td>
                <template v-if="rechargeDetails.paymentVoucher" v-for="item in rechargeDetails.paymentVoucher">
                  <div class="ta-c d-ib pos-r cursor-p thumbnail-wrap" @click="handlePreview(item)">
                    <span class="full-wrap pos-a"><i class="el-icon-circle-plus-outline"></i></span>
                    <img :src="item | filterImgUrl" class="full-wrap">
                  </div>
                </template>
                <template v-else>{{rechargeDetails.paymentVoucher | filterEmpty}}</template>
              </td>
              <td>扣款人：</td>
              <td>{{rechargeDetails.rechargeUserName}}</td>
            </tr>
            <tr>
              <td>扣款说明：</td>
              <td>{{rechargeDetails.descriptionSub | filterEmpty}}</td>
              <td>扣款时间：</td>
              <td>{{rechargeDetails.addTime | filterDate}}</td>
            </tr>
          </template>
          <tr v-else>
            <td><no-data style="padding: 50px;"></no-data></td>
          </tr>
        </table>
      </template>

      <gray-title title="审核信息"></gray-title>
      <table class="admin-gray-table">
        <tr>
          <td>审核状态：</td>
          <td>{{rechargeDetails.auditStatus | filterAuditStatus}}</td>
          <td>审核人：</td>
          <td>{{rechargeDetails.auditorName | filterEmpty}}</td>
        </tr>
        <tr>
          <td>审核时间：</td>
          <td :colspan="parseInt(rechargeDetails.auditStatus) === 3 ? 0 : 3">{{rechargeDetails.auditTime | filterDate}}</td>
          <template v-if="parseInt(rechargeDetails.auditStatus) === 3">
            <td>不通过原因：</td>
            <td><pre>{{rechargeDetails.description | filterEmpty}}</pre></td>
          </template>
        </tr>
      </table>

    </template>

    <template slot="other">
      <el-dialog title="预览凭证" :visible.sync="thumbnailVisible">
        <img :src="previewImgUrl | filterImgUrl" class="full-wrap">
      </el-dialog>
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      customerId: '',             // 用户id
      rechargeDetails: {},        // 充值信息
      detailsData: {},            // 详情数据
      previewImgUrl: '',          // 缩略图地址
      thumbnailVisible: false     // 缩略图弹窗显示
    }
  },

  mounted () {
    this.rechargeDetails = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'RechargeDetails'))
    this.customerId = parseInt(this.$route.query.customerId)
    this.getMemberInfo()
  },

  methods: {
    /**
     * 获取用户信息
     */
    getMemberInfo () {
      this.$http.post('@ROOT_API/accountRechargeController/getMemberInfo', {
        customerId: this.customerId
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.detailsData = resData.data
      })
    },

    /**
     * 图片预览
     */
    handlePreview (url) {
      this.previewImgUrl = url
      this.thumbnailVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.finance-public-details{

  td{
    vertical-align: top;
  }

  .thumbnail-wrap{
    width: 100px;
    height: 100px;
    line-height: 100px;
    border: 1px solid #ebeef5;
    margin-right: 10px;
    margin-bottom: 10px;

    span{
      color: #fff;
      font-size: 20px;
      background: rgba(0, 0, 0, .5);
      display: none;
    }
  }

  .thumbnail-wrap:hover{
    span{
      display: block;
    }
  }
}
</style>
