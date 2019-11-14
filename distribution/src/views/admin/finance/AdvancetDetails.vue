<!-- 会员申请详情 -->
<template>
  <common-tpl class="manage-public-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <!-- 充值详情 -->
          <h2 class="title maggin-t">充值详情</h2>
          <table>
            <tr>
              <td>会员姓名：</td>
              <td>{{detailsData.cardName | filterEmpty}}</td>
            </tr>
            <tr>
              <td>会员手机：</td>
              <td>{{detailsData.phone | filterEmpty}}</td>
            </tr>
            <tr>
              <td>当前身份：</td>
              <td>{{detailsData.ruleName | filterEmpty}}</td>
            </tr>
            <tr>
              <td>充值金额：</td>
              <td>{{detailsData.amount | filterEmpty}} 元</td>
            </tr>
            <tr>
              <td>赠送消费积分：</td>
              <td>{{detailsData.bonusPoints | filterEmpty}} 个</td>
            </tr>
            <tr>
              <td>充值时间：</td>
              <td>{{detailsData.orderTime | filterDate}}</td>
            </tr>
            <tr>
              <td>充值方式：</td>
              <td>{{detailsData.payType | filterPayType}}</td>
            </tr>
            <tr>
              <td>第三方支付单号：</td>
              <td>{{detailsData.transactionId | filterEmpty}}</td>
            </tr>
          </table>
        </el-form>
      </div>
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    // 失败原因
    let validateRemark = (rule, value, callback) => {
      if (value && this.ruleForm.isOpen === 2 && value.length > 100) return callback(new Error('仅100个字符以内'))
      callback()
    }
    return {
      // 审核结果
      ruleForm: {
        isOpen: 1,               // 是否激活
        remark: ''               // 失败原因
      },
      rules: {
        // 失败原因
        remark: [{ validator: validateRemark, trigger: 'blur' }]
      },
      // 详情数据
      detailsData: {},
      applyId: '',               // 申请id
      type: 2,                   // 商品详情
      storeData: {},             // 商品id
      passVisible: false        // 审核弹窗
    }
  },
  mounted () {
    this.detailsData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'AdvancetDetails'))
    console.log('detailsData: ', this.detailsData)
  },
  methods: {
    /**
     * 激活账号
     */
    resourceHandle () {
      this.$http.post('@ROOT_API/distributeApplyManage/openApply', {
        applyId: this.applyId,
        isOpen: this.ruleForm.isOpen,
        openInfo: this.ruleForm.remark
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
        this.$message({
          message: resData.msg,
          type: 'success',
          duration: 1000
        })
        this.$router.back()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.manage-public-detail-wrap{

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
.manage-public-detail-wrap{
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

