<!-- 付款审核弹窗 -->
<template>
  <el-dialog title="付款审核" :visible.sync="visible" width="600px" class="payment-examine-dialog" :before-close="beforeClose">
    <div class="pay-check ta-l">
      <gray-title title="邀请人信息"></gray-title>
      <el-form label-width="120px">
        <el-form-item label="邀请人ID号：">{{inviteData.beInvitationCode | filterEmpty}}</el-form-item>
        <el-form-item label="邀请人姓名：">{{inviteData.beCardName | filterEmpty}}</el-form-item>
        <el-form-item label="邀请人手机：">{{inviteData.bePhone | filterEmpty}}</el-form-item>
      </el-form>
    </div>

    <br/>

    <div class="pay-check ta-l">
      <gray-title title="升级信息"></gray-title>
      <el-form :model="formData" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="应付金额：">{{examineData.payAmount | filterMoney | filterEmpty('元')}}</el-form-item>
        <el-form-item label="付款方式：">{{examineData.payType | filterPayType}}</el-form-item>
        <el-form-item label="支付状态：">{{examineData.payStatus | filterPayStatus(examineData.payType)}}</el-form-item>
        <el-form-item label="付款凭证：">
          <div class="d-ib ta-c pos-r payment-voucher-wrap" v-for="item in examineData.paymentVoucher" v-if="examineData.paymentVoucher">
            <span class="pos-a mask-wrap">
              <a :href="item | filterImgUrl" target="_blank">
                <i class="cursor-p el-icon-zoom-in"></i>
              </a>
            </span>
            <img class="full-wrap" :src="item | filterImgUrl">
          </div>
          <template v-else>{{'' | filterEmpty}}</template>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="formData.checkResult" label="核查结果：" class="fl-l">
            <el-radio :label="1">支付成功</el-radio>
            <el-radio :label="2">支付失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.checkResult === 2" prop="failDiscription">
          <el-input type="textarea" maxlength="100" :rows="3" placeholder="填写失败原因" v-model="formData.failDiscription"></el-input>
          <span class="d-ib pos-a word-count">{{formData.failDiscription.length}}/100</span>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" :loading="confirmLoading" @click="handleExamine('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {          // 是否弹窗
      type: Boolean,
      default: false
    },
    examineData: Object // 升级信息
  },

  data () {
    // 验证支付失败描述
    let ruleNumber = (rule, value, callback) => {
      if (value && value.length > 100) return callback('只能输入100个字符')
      callback()
    }
    return {
      confirmLoading: false,    // 确定loading
      formData: {
        checkResult: 1,
        failDiscription: ''
      },
      rules: {
        // 验证支付失败描述
        failDiscription: { validator: ruleNumber, trigger: 'blur' }
      },
      inviteData: {}      // 邀请人信息
    }
  },

  watch: {
    'visible' (val) {
      if (val === true) {
        this.formData.checkResult = 1
        this.formData.failDiscription = ''
        this.getInviteInfo()
      }
    }
  },

  methods: {
    /**
     * 获取邀请人信息
     */
    getInviteInfo () {
      this.$http.get('@ROOT_API/distributeApplyManage/applyInfo', {
        params: {
          applyId: this.examineData.id
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
        this.inviteData = resData.data
      })
    },

    /**
     * 关闭前操作
     */
    beforeClose () {
      this.$emit('close')
    },

    /**
     * 审核操作
     */
    handleExamine (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.confirmLoading = true
        this.$http.post('@ROOT_API/distributeApplyManage/payAudit', {
          applyId: this.examineData.id,                // 是 int 申请ID
          payStatus: this.formData.checkResult,
          // payAuditStatus: this.formData.checkResult,   // 是 int 支付审核状态（1未审核，2审核通过，3审核不通过）
          payAuditInfo: this.formData.failDiscription  // 否 Sting 审核不通过原因
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
          // this.$emit('close')
          // if (this.formData.checkResult === 2) {
          //   this.$emit('success')
          // } else {
          //   this.$emit('error')
          // }
        }).finally(() => {
          setTimeout(() => {
            this.confirmLoading = false
          }, 1000)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pay-check{
  font-size: 14px;
  border: 1px solid #eee;
  border-bottom: none;

  .admin-gray-title{
    margin-bottom: 0;
  }

  .el-textarea{
    width: 300px;
  }

  .el-form-item{
    border-bottom: 1px solid #eee;
    margin-bottom: 0;
    padding: 10px 20px;
  }

  .word-count{
    right: 40px;
    bottom: -10px;
  }

  .payment-voucher-wrap{
    width: 100px;
    height: 100px;
    line-height: 100px;
    border: 1px solid #eee;
    margin-right: 10px;
    margin-bottom: 10px;

    .mask-wrap{
      color: #fff;
      width: 100%;
      height: 100%;
      font-size: 20px;
      background: rgba(0, 0, 0, .5);
      display: none;

      i{
        color: #fff;
      }
    }
  }

  .payment-voucher-wrap:hover{
    .mask-wrap{
      display: block;
    }
  }
}
</style>

<style lang="less">
.payment-examine-dialog{
  .el-form-item__content{
    line-height: 40px !important;
  }
}
</style>
