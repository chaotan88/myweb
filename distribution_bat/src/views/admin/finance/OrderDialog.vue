<!-- 审核弹窗 -->
<template>
  <el-dialog title="订单线下支付审核" :visible.sync="visible" width="650px" class="examine-dialog-wrap" :before-close="HandleBeforeClose">
        
    <table class="ta-l full-w recharge-table">
      <tr>
        <th colspan="4" class="fw-n">买家信息</th>
      </tr>
      <tr>
        <td>买家姓名</td>
        <td>{{initData.customerName | filterEmpty}}</td>
        <td>买家手机号</td>
        <td>{{initData.customerPhone | filterEmpty}}</td>
      </tr>
    </table>

    <el-form label-position="right" label-width="190px" class="ta-l" :model="formData" :rules="rules" ref="form">

      <div class="form-item-group">
        <gray-title title="支付信息" class="ta-l"></gray-title>
        <el-form-item label="确认是否线下支付金额：" class="full-w" prop="rechargeBalance">
          <strong>{{initData.orderTotalAmount | filterEmpty}}</strong> 元
        </el-form-item>
        <el-form-item label="支付凭证：" label-width="110px" class="full-w" prop="rechargeIntegral">
          <template v-if="initData.paymentVoucher && initData.paymentVoucher.length">
            <a :href="item | filterImgUrl" target="_blank" v-for="item in initData.paymentVoucher">
              <img class="preview-wrap" :src="item | filterImgUrl">
            </a>
          </template>
          <template v-else>--</template>
        </el-form-item>
      </div>

      <gray-title title="审核" class="ta-l"></gray-title>
      <el-form-item label-width="30px" class="full-w examine-msg-wrap" prop="examineMsg">
        <el-radio-group v-model="formData.examine">
          <el-radio :label="2">通过</el-radio>
          <el-radio :label="5">不通过</el-radio>
        </el-radio-group>
        <el-input type="textarea" :rows="4" placeholder="填写不通过原因（100个字符以内）" v-model="formData.examineMsg" class="d-b examine-msg" v-if="formData.examine === 5"></el-input>
      </el-form-item>

    </el-form>

    <br>

    <div class="ta-c btns-wrap">
      <el-button @click="$emit('close')">取消</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button type="primary" :loading="confirmLoading" @click="handleExamine('form')">确定</el-button>
    </div>

  </el-dialog>
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
      confirmLoading: false,  // 确定loading
      formData: {             // 表单数据
        balance: '',          // 可用余额
        rechargeBalance: '',  // 余额充值
        rechargeIntegral: '', // 消费积分充值
        integralBalance: '',  // 消费积分可用余额
        uploadFileList: [],   // 上传列表
        voucherImg: '',       // 充值凭证
        examine: 2,           // 审核
        examineMsg: '',       // 审核不通过原因
        password: ''          // 修改密码
      },
      copyFormData: {},       // 拷贝搜索条件
      rules: {
        // rechargeBalance: [{compareField: 'rechargeIntegral', validator: validateRechargePublic, trigger: 'blur'}],
        // rechargeIntegral: [{compareField: 'rechargeBalance', validator: validateRechargePublic, trigger: 'blur'}],
        // voucherImg: [{validator: validateVoucherImg, trigger: 'change'}],
        examineMsg: [{max: 100, message: '填写不通过原因（100个字符以内）', trigger: 'blur'}],
        password: [{required: true, min: 1, message: '请输入密码', trigger: 'blur'}]
      },
      dialogImageUrl: '',     // 预览图片地址
      dialogVisible: '',      // 预览显示弹窗
      passwordVisible: false, // 修改密码显示弹窗
      userInfo: {}            // 用户信息
    }
  },

  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source?clientType=1&token=' + this.userInfo.token
    }
  },

  mounted () {
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
  },

  methods: {
    /**
     * 充值 || 审核 操作
     */
    handleRechargeBefore (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.passwordVisible = true
      })
    },

    /**
     * 获取用户信息
     */
    getMemberInfo () {
      this.$http.post('@ROOT_API/accountRechargeController/getMemberInfo', {
        customerId: this.initData.customerId
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
        this.formData.balance = resData.data.balance
        this.formData.integralBalance = resData.data.bonusPoints
      })
    },

    /**
     * 审核
     */
    handleExamine (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.confirmLoading = true
        this.$http.post('@ROOT_API/order/offlinePayAudit', {
          ordreNo: this.initData.orderNo,              // 是 string  订单编号
          paymentVoucher: this.initData.paymentVoucher.join(','),       // 是 string  支付凭证URL
          payStatus: this.formData.examine             // 是 int 1 未付款 2已付款 3已退款 4付款审核中 5支付失败
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
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          this.$emit('success')
        }).finally(() => {
          setTimeout(() => {
            this.confirmLoading = false
          }, 1000)
        })
      })
    },

    /**
     * 充值 || 审核 操作
     */
    handleSubmit () {
      this.loading = true
      // let url = '@ROOT_API/accountRechargeController/auditRecharge'
      // this.$http.post(url, {
      //   id: this.initData.id,
      //   customerId: this.initData.customerId,
      //   customerName: this.initData.customerName,
      //   customerPhone: this.initData.customerPhone,
      //   amountOfMoney: this.pageType === 2 ? this.initData.amountOfMoney : this.formData.rechargeBalance,     // 余额充值
      //   consumePoints: this.pageType === 2 ? this.initData.consumePoints : this.formData.rechargeIntegral,    // 消费积分充值
      //   paymentVoucher: this.formData.voucherImg,        // 支付凭证
      //   auditStatus: this.formData.examine,              // 审核状态
      //   description: this.formData.examineMsg,           // 不通过原因
      //   managerPassword: this.formData.password          // 密码校验
      // }).then((res) => {
      //   this.loading = false
      //   let resData = res.data
      //   if (parseInt(resData.status) !== 1) {
      //     this.$message({
      //       message: resData.msg,
      //       type: 'error',
      //       duration: 1500
      //     })
      //     return false
      //   }
      //   this.$message({
      //     message: resData.msg,
      //     type: 'success',
      //     duration: 1000
      //   })
      //   setTimeout(() => {
      //     this.$refs['form'].resetFields()
      //     this.formData = this.$Utils.deepCopy(this.copyFormData)
      //     this.dialogImageUrl = ''
      //     this.formData.password = ''
      //     this.passwordVisible = false
      //     this.$emit('success')
      //   }, 100)
      // })
    },

    /**
     * 弹窗关闭前操作
     */
    HandleBeforeClose () {
      this.$emit('close')
    },

    /**
     * 文件上传前的格式和大小校验
     */
    beforeAvatarUpload (file) {
      const pattern = /(jpg|jpeg|png)$/ig
      const isLegalPhoto = pattern.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLegalPhoto) {
        this.$message.error('上传图片的格式不合法，请重新上传')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLegalPhoto && isLt2M
    },

    /**
     * 上传数量超过最大限制数量
     */
    exceedHandle (files, fileList) {
      this.$message({
        message: '最多只能上传1个图标',
        type: 'error'
      })
    },

    /*
     * 文件上传成功
     */
    uploadSuccessHandle (res) {
      if (res.status !== '1') {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.uploadFileList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.formData.voucherImg = res.data
    },

    /**
     * 文件预览
     */
    pictureCardPreviewHandle (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    /**
     * 文件被移除
     */
    removeHandle (file, fileList) {
      setTimeout(() => {
        this.formData.advertPositionDetailList[this.uploadIndex].image = ''
        this.imgLength--
      }, 30)
    }
  }
}
</script>

<style lang="less" scoped>
.examine-dialog-wrap{

  /* -------------------- { 充值弹窗用户信息 } -------------------- */
  .recharge-table{
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

  /* -------------------- { 充值弹窗表单 } -------------------- */
  .el-form{

    .examine-msg-wrap{
      border: 1px solid #ebeef5 !important;
      border-top: 0 !important;
      margin-left: 0 !important;
      padding-bottom: 50px;
    }

    .form-item-group{
      border: 1px solid #ebeef5;
      margin-bottom: 20px;
    }

    .el-form-item{
      border-bottom: 1px solid #ebeef5;
      padding-top: 15px;
      padding-bottom: 15px;
      margin-bottom: 0;

      .el-input{
        width: 200px;
        margin-right: 10px;
      }
    }

    .el-form-item:last-child{
      border-bottom: 0;
      margin-bottom: 0;
    }

    .examine-msg{
      width: 530px;
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
.examine-dialog-wrap{

  .el-dialog__body{
    padding: 30px !important;
  }

  .preview-wrap{
    width: 100px;
    height: 100px;
    border: 1px solid #ebeef5;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .upload-max{
    .el-upload--picture-card{
      display: none;
    }
  }
}
</style>