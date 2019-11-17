<!-- 共用详情页 -->
<template>
  <common-tpl class="manage-public-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">
        <gray-title title="会员信息" class="ta-l title"></gray-title>
        <table>
          <tr>
            <td>会员手机：</td>
            <td>{{detailsData.phone | filterEmpty}}</td>
          </tr>
          <tr>
            <td>会员身份：</td>
            <td>{{detailsData.currentIdentity}}</td>
          </tr>
          <tr>
            <td>证件类型：</td>
            <td>{{detailsData.cardType | filterCardType}}</td>
          </tr>
          <tr>
            <td>姓名：</td>
            <td>{{detailsData.cardName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>证件号：</td>
            <td>{{detailsData.idCard | filterEmpty}}</td>
          </tr>
          <tr>
            <td>性别：</td>
            <td>{{detailsData.sex}}</td>
          </tr>
          <tr>
            <td>地区：</td>
            <td>{{detailsData.userAddress | filterEmpty}}</td>
          </tr>
        </table>
        <gray-title title="升级信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>申请编号：</td>
            <td>{{detailsData.applyNo | filterEmpty}}</td>
          </tr>
          <tr>
            <td>申请成为：</td>
            <td>{{detailsData.applyIdentity | filterEmpty}}</td>
          </tr>
          <tr>
            <td>充值金额：</td>
            <td>{{detailsData.payAmount | filterMoney | filterEmpty('元')}}</td>
          </tr>
        </table>
        <gray-title title="支付信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>应付金额：</td>
            <td>{{detailsData.payAmount | filterMoney | filterEmpty('元')}}</td>
          </tr>
          <tr>
            <td>付款方式：</td>
            <td>{{detailsData.payType | filterPayType}}</td>
          </tr>
          <tr>
            <td>支付凭证：</td>
            <td>
              <template v-if="detailsData.paymentVoucher && detailsData.paymentVoucher.length">
                <div class="d-ib thumbnail-wrap" v-for="item in detailsData.paymentVoucher">
                  <a :href="item | filterImgUrl" target="_blank">
                    <img class="full-wrap" :src="item | filterImgUrl">
                  </a>
                </div>
              </template>
              <template v-else>{{'' | filterEmpty}}</template>
            </td>
          </tr>
          <tr>
            <td>支付状态：</td>
            <td>{{detailsData.payStatus | filterPayStatus(detailsData.payType)}}</td>
          </tr>
          <tr v-if="parseInt(detailsData.payStatus) === 2">
            <td>失败原因：</td>
            <td>{{detailsData.payAuditInfo | filterEmpty}}</td>
          </tr>
        </table>

        <gray-title title="邀请人信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>邀请人ID：</td>
            <td>{{detailsData.beInvitationCode | filterEmpty()}}</td>
          </tr>
          <tr>
            <td>邀请人姓名：</td>
            <td>{{detailsData.beCardName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>邀请人手机号：</td>
            <td>{{detailsData.bePhone | filterEmpty}}</td>
          </tr>
        </table>

        <gray-title title="开通信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>商城商品：</td>
            <td>{{detailsData.toGoodsMoney | filterMoney | filterEmpty('元')}}</td>
          </tr>
          <tr>
            <td>商城消费积分：</td>
            <td>{{detailsData.toConsumePoint | filterMoney | filterEmpty('个积分')}}</td>
          </tr>
        </table>
      </div>
    </template>

    <template slot="other">
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <!-- <template v-if="parseInt(detailsData.payStatus) === 1">
        <el-button type="primary" @click="passVisible = true">审核</el-button>
      </template> -->
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      // 审核结果
      formData: {
        checkResult: '2',       // 审核结果
        description: ''
      },
      applyId: '',              // 申请id
      detailsData: {},          // 详情数据
      fxUserInfo: {},           // 用户信息
      passVisible: false        // 审核弹窗
    }
  },
  mounted () {
    this.applyId = parseInt(this.$route.query.id) || ''
    this.fxUserInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.getDetails()
  },
  methods: {
    /**
     * 详情
     */
    getDetails () {
      this.$http.get('@ROOT_API/distributeApplyManage/applyInfo', {
        params: {
          applyId: this.applyId          // long  申请ID
        }
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
          if (results.paymentVoucher) {
            results.paymentVoucher = results.paymentVoucher.split(',')
          } else {
            results.paymentVoucher = []
          }
          this.detailsData = resData.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.manage-public-detail-wrap{
  
  .admin-gray-title{
    margin-bottom: 0;
  }

  .goods-common-details{

    .title{
    }

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
  }
}
</style>
<style lang="less">
.manage-public-detail-wrap{
  .el-dialog {
    .el-dialog__body {
      padding-bottom: 0;
    }
  }
}
</style>
