<!-- 提现弹窗 -->
<template>
  <div class="transaction-dialog-wrap">
    <el-dialog title="交易记录" :visible.sync="visible" width="800px" :before-close="handleBeforeClose">

      <el-form label-position="right" label-width="220px" class="ta-l" :model="formData" ref="form">

        <div class="form-item-group">
          <gray-title title="交易信息" class="ta-l putforward-title"></gray-title>

          <el-form-item label="交易编号：">
            <strong>
              {{initData.orderNo| filterEmpty}}
              <span class="fw-n" style="color: #bbb; font-size: 14px;"></span>
            </strong>
          </el-form-item>

          <el-form-item label="推广大使手机：">
            <strong>{{initData.phone | filterEmpty}}</strong>
          </el-form-item>

          <el-form-item label="推广大使身份：">
            <strong>{{initData.ruleName | filterEmpty}}</strong>
          </el-form-item>
          <template>
            <el-form-item label="交易时间：">{{initData.addTime | filterDate}}</el-form-item>
            <el-form-item label="交易类型：">
              <span v-if="parseFloat(initData.propertyType) === 1">微信</span>
              <span v-else-if="parseFloat(initData.propertyType) === 2">支付宝</span>
              <span v-else>--</span>
            </el-form-item>
            <el-form-item label="支付宝订单号：" v-if="otherData.payType === '2'">{{otherData.transactionId | filterEmpty}}</el-form-item>
            <el-form-item label="微信支付订单号：" v-if="otherData.payType === '1'">{{otherData.transactionId | filterEmpty}}</el-form-item>
            <el-form-item label="交易内容：">{{initData.addSource | filterAddSource}}</el-form-item>
            <el-form-item label="交易额：">{{initData.businessAmount | filterMoney}}</el-form-item>
            <!-- <el-form-item label="交易状态：">{{initData.cardholder | filterEmpty}}</el-form-item> -->
            <el-form-item label="交易科目：">{{initData.businessType | filterBusinessType}}</el-form-item>
            <el-form-item label="交易属性：">{{initData.businessAttr | filterBusinessAttr}}</el-form-item>
          </template>
        </div>
      </el-form>

      <div class="btns-wrap">
        <el-button :type="initData.dealWithStatus === 2 ? 'primary' : ''" @click="$emit('close')">{{initData.dealWithStatus === 1 ? '取消' : '关闭'}}</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    initData: Object,
    visible: {          // 弹窗是否可见
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      loading: false,         // 加载中
      formData: {             // 表单数据
        balance: '',          // 可用余额
        transactionBalance: '',  // 余额提现
        transactionIntegral: '', // 消费积分提现
        integralBalance: '',  // 消费积分可用余额
        uploadFileList: [],   // 上传列表
        dealWithStatus: 2,    // 处理结果
        paymentNo: '',        // 流水号
        description: '',      // 回退
        voucherImg: '',       // 提现凭证
        reflect: 2,           // 审核
        reflectMsg: ''        // 审核不通过原因
      },
      dialogImageUrl: '',     // 预览图片地址
      dialogVisible: false,   // 预览显示弹窗
      fxUserInfo: {},   // 用户信息
      otherData: {}
    }
  },

  watch: {
    initData: {
      handler () {
        this.formData.paymentNo = ''
        this.formData.uploadFileList = []
        this.formData.voucherImg = ''
        this.formData.dealWithStatus = this.initData.dealWithStatus
        this.getDetails()
      },
      deep: true
    }
  },

  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source?clientType=1&token=' + this.fxUserInfo.token
    }
  },

  mounted () {
    this.fxUserInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
  },

  methods: {

    /**
     * 弹窗关闭前操作
     */
    handleBeforeClose () {
      this.$emit('close')
    },
    getDetails () {
      this.$http.get('@ROOT_PUBLIC/buyBusinessAccount/getBusinessAccountExtraDetails', {
        params: { orderNo: this.initData.orderNo }
      }).then((res) => {
        let { data } = res.data
        if (!data) data = {}
        this.otherData = data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.transaction-dialog-wrap{

  .admin-gray-title{
    margin-bottom: 0;
  }

  /* -------------------- { 提现弹窗用户信息 } -------------------- */
  .transaction-table{
    border-collapse: collapse;
    border: 1px solid #ebeef5;
    margin-bottom: 20px;

    th, td{
      padding: 0 15px;
    }

    th{
      width: 25%;
      height: 40px;
      background: #eef1f9;
    }

    td{
      border-left: 1px solid #ebeef5;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }

  /* -------------------- { 提现弹窗表单 } -------------------- */
  .el-form{

    .form-item-group{
      border: 1px solid #ebeef5;
      margin-bottom: 20px;
    }
    .putforward-title{
      font-size: 16px;
    }

    .el-form-item{
      border-bottom: 1px solid #ebeef5;
      /*padding-top: 15px;*/
      /*padding-bottom: 15px;*/
      margin-bottom: 0;

      .el-input{
        width: 200px;
        margin-right: 10px;
      }
    }

    .el-form-item:last-child{
      border-bottom: 0;
      margin-bottom: 0;
      padding-top: 15px;
      padding-bottom: 15px;
    }

    .reflect-msg{
      width: 360px;
      margin-bottom: 10px;
    }
  }

  .thumbnail-wrap{
    width: 100px;
    height: 100px;
  }

  .gray-text{
    color: #bbb;
    font-size: 14px;
  }

  strong{
    color: red;
    font-size: 18px;
  }

}
</style>

<style lang="less">
.transaction-dialog-wrap{

  .el-dialog__body{
    padding: 30px !important;
  }

  .upload-max{
    .el-upload--picture-card{
      display: none;
    }
  }
}
</style>