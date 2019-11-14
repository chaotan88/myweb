<!--详情-->
<template>
  <common-tpl class="offline-detail-wrap" footer>
    <template slot="header">
    </template>

    <!-- 表单数据 -->
    <template slot="main">
      <template>
        <el-form :model="formData"   label-width="180px" class="mb-20">
          <gray-title title="会员信息"></gray-title>
          <el-form-item label="会员手机：" prop="">{{formData.phone | filterEmpty}}</el-form-item>
          <el-form-item label="当前身份：" prop="">{{formData.ruleName | filterEmpty}}</el-form-item>
          <el-form-item label="姓名：" prop="">{{formData.cardName | filterEmpty}}</el-form-item>
<!--          <el-form-item label="身份证：" prop="turnRule" >{{formData.endTime | filterEmpty}}</el-form-item>
          <el-form-item label="性别：" prop="turnRule" >{{formData.endTime | filterEmpty}}</el-form-item>
          <el-form-item label="地区：" prop="turnRule" >{{formData.endTime | filterEmpty}}</el-form-item>-->
          <gray-title title="支付信息" class="mb-20"></gray-title>
          <el-form-item label="支付金额：" prop="" >{{formData.amount | filterEmpty}}</el-form-item>
          <el-form-item label="支付时间：" prop="" >{{formData.payTime | filterDate | filterEmpty}}</el-form-item>
<!--          <el-form-item label="参考号：" prop="turnRule" >{{formData.endTime | filterEmpty}}</el-form-item>
          <el-form-item label="银行卡号后四位：" prop="turnRule" >{{formData.endTime | filterEmpty}}</el-form-item>-->
          <el-form-item label="付款凭证：" prop="" >
            <template v-if="formData.paymentVoucher">
              <a :href="formData.paymentVoucher | filterImgUrl" target="_blank" >
                <img class="preview-wrap" style="width: 70px; height: 70px;" :src="formData.paymentVoucher | filterImgUrl">
              </a>
            </template>
            <template v-else>--</template>
          </el-form-item>
          <!--<el-form-item label="线下支付类型：" prop="turnRule" >{{formData.endTime | filterEmpty}}</el-form-item>-->
        <!--  <el-form-item label="审核类型：" prop="turnRule" >{{formData.endTime | filterEmpty}}</el-form-item>-->
          <el-form-item label="审核状态：" prop="" >{{formData.auditStatus | filterEmpty}}</el-form-item>
          <el-form-item label="审核失败原因：" prop="" v-if="formData.auditStatus === '审核不通过'">{{formData.payAuditInfo | filterEmpty}}</el-form-item>
        </el-form>
      </template>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button  @click="$router.go(-1)" >返 回</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        formData: {}     // 表单数据
      }
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    mounted () {
      this.formData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'rechargeDetails'))
      console.log(this.formData)
    },
    methods: {
    }
  }
</script>

<style lang="less" scope>
  .offline-detail-wrap{
    .mb-20{
      margin-bottom: 20px;
    }
  }
</style>
<style lang="less">
  .offline-detail-wrap{
    .el-form-item{
      margin-bottom: 0;
    }
  }
</style>

