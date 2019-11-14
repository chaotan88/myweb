<template>
  <div class="refund-dialog" :class="{special: justInput}">
    <template v-if="!justInput">
      <el-radio-group v-model="formData.refundType" class="ta-l d-b">
        <el-radio class="d-b" :label="1">退回原账户</el-radio>
      </el-radio-group>
      <div class="ta-l money">订单金额：￥{{orderMoney}}</div>
    </template>
    <div class="order-express" :class="{special: justInput, 'ta-r': justInput}">
      <el-form :model="formData" :rules="rules" ref="formData" inline label-width="70px">
        <el-form-item label="退款金额" prop="refundAmount">
          <el-input v-model="formData.refundAmount" class="number" @blur="inpBlur"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="ta-c dialog-footer" v-if="!justInput">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submitForm('formData')">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {                // 显示弹窗
      type: Boolean,
      default: false
    },
    payType: Number,          // 支付方式
    orderMoney: String,       // 退款金额
    refundMoney: String,      // 退款金额
    refundOrderId: Number,    // 退款订单ID
    justInput: {              // 只显示输入框
      type: Boolean,
      default: false
    }
  },
  data () {
    // 退款弹窗-退款金额验证
    let validateNumber = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入退款金额'))
      if (isNaN(value) || value < 0) return callback(new Error('请输入大于0的数字'))
      if (parseFloat(value) > parseFloat(this.orderMoney)) return callback(new Error('退款金额不能大于订单金额'))
      callback()
    }

    return {
      formData: {
        refundType: 1,          // 退款方式
        refundAmount: ''        // 退款金额
      },
      refundUrl: '',            // 退款url
      rules: {
        refundAmount: [{ validator: validateNumber, trigger: 'blur' }]
      }
    }
  },
  watch: {
    refundMoney (val) {
      this.formData.refundAmount = val
    },
    payType (val) {
      this.payType = val
    }
  },
  mounted () {
    this.formData.refundAmount = this.refundMoney
    this.refundUrl = parseInt(this.payType) === 1 ? 'wxPay/refundPay' : parseInt(this.payType === 2) ? 'aliPay/refundPay' : ''
  },
  methods: {
    /**
     * input 失去焦点自动补全
     */
    inpBlur () {
      this.$Utils.blurAutoCompletion(this.formData, 'refundAmount')
      this.$emit('change', this.formData.refundAmount)
    },

    /**
     * 提交退款
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        // ajax ...
        if (this.refundUrl === '') return false
        this.$http.post('@ROOT_API/' + this.refundUrl, {
          refundOrderId: this.refundOrderId,
          refundPrice: this.formData.refundAmount,
          totalPrice: this.orderMoney
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
        })
      })
    }
  }
}
</script>

<style lang="less">
.refund-dialog{
  padding: 0 40px;
  /* -------------------- { 退款 } -------------------- */
  .el-form-item{
    margin-bottom: 0;
  }

  .el-radio-group{
    margin-bottom: 10px;
  }

  .el-radio{
    height: 35px;
    line-height: 35px;
    font-size: 18px;
    font-weight: bold;
  }

  .money{
    font-size: 14px;
    margin: 10px 0;
  }

  .order-express{
    .number{
      width: 280px;
    }
  }

  .order-express.special{
    padding: 20px 0 0 0;
  }

  .dialog-footer{
    padding-top: 50px;

    .el-button{
      margin: 0 20px;
    }
  }
}

.refund-dialog.special{
  padding-bottom: 20px;
}
</style>
