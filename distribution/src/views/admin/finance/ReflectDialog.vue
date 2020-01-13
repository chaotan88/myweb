<!-- 提现弹窗 -->
<template>
  <div class="recharge-dialog-wrap">
    <el-dialog :title="initData.dealWithStatus === 1 ? '提现申请' : '提现详情'" :visible.sync="visible" width="800px" :before-close="handleBeforeClose">
          
      <table class="ta-l recharge-table">
        <tr>
          <th colspan="4" class="fw-n">推广大使信息</th>
        </tr>
        <tr>
          <td>推广大使姓名</td>
          <td>{{initData.cardName | filterEmpty}}</td>
          <td>手机号</td>
          <td>{{initData.customerPhone | filterEmpty}}</td>
        </tr>
      </table>

      <el-form label-position="right" label-width="220px" class="ta-l" :model="formData" :rules="rules" ref="form">

        <div class="form-item-group">
          <gray-title title="提现信息" class="ta-l putforward-title"></gray-title>

          <el-form-item label="提现应付金额：">
            <strong>
              {{(parseFloat(initData.withdrawalAmount) - parseFloat(initData.withdrawalFees)) | filterMoney | filterEmpty('元')}}
              <span class="fw-n" style="color: #bbb; font-size: 14px;">（提现金额 - 提现手续费）</span>
            </strong>
          </el-form-item>

          <el-form-item label="提现金额：">
            <strong>{{initData.withdrawalAmount | filterMoney | filterEmpty('元')}}</strong>
          </el-form-item>

          <el-form-item label="提现手续费：">
            <strong>{{initData.withdrawalFees | filterMoney | filterEmpty('元')}}</strong>
          </el-form-item>

          <el-form-item label="提现方式：">
            <strong>{{initData.accountType | filterAccountType}}</strong>
          </el-form-item>

          <template v-if="initData.accountType === 1">
            <el-form-item label="开户行：">{{initData.bankName | filterEmpty}}</el-form-item>
            <el-form-item label="支行信息：">{{initData.branchBankName | filterEmpty}}</el-form-item>
            <el-form-item label="银行卡号：">{{initData.cardNum | filterEmpty}}</el-form-item>
            <el-form-item label="持卡人：">{{initData.cardholder | filterEmpty}}</el-form-item>
            <el-form-item label="风险评估：">
              <strong v-if="initData.cardStatus === 0" class="auth-success"><i class="iconfont el-icon-success"></i>已实名认证</strong>
              <strong v-else  class="auth-error"><i class="iconfont el-icon-error"></i>未实名认证</strong>
              <strong v-if="initData.cardName === initData.cardholder" class="auth-success"><i class="iconfont el-icon-success"></i>银行卡账户与实名一致</strong>
              <strong v-else  class="auth-error"><i class="iconfont el-icon-error"></i>银行卡账户与实名不一致</strong>
            </el-form-item>
          </template>
          <template v-else-if="initData.accountType === 2">
            <el-form-item label="姓名：">{{initData.customerName | filterEmpty}}</el-form-item>
            <el-form-item label="支付宝账号：">{{initData.alipayNum | filterEmpty}}</el-form-item>
            <el-form-item label="风险评估：">
              <strong v-if="initData.cardStatus === 0" class="auth-success"><i class="iconfont el-icon-success"></i>已实名认证</strong>
              <strong v-else  class="auth-error"><i class="iconfont el-icon-error"></i>未实名认证</strong>
              <strong v-if="initData.customerName === initData.cardName" class="auth-success"><i class="iconfont el-icon-success"></i>支付宝姓名与实名一致</strong>
              <strong v-else  class="auth-error"><i class="iconfont el-icon-error"></i>支付宝姓名与实名不一致</strong>
            </el-form-item>
          </template>
          <template v-else-if="initData.accountType === 3">
            <el-form-item label="微信昵称：">{{initData.wechatNickname | filterEmpty}}</el-form-item>
            <el-form-item label="openid：">{{initData.idCard | wechatOpenid}}</el-form-item>
            <el-form-item label="风险评估：">
              <strong v-if="initData.cardStatus === 0" class="auth-success"><i class="iconfont el-icon-success"></i>已实名认证</strong>
              <strong v-else  class="auth-error"><i class="iconfont el-icon-error"></i>未实名认证</strong>
            </el-form-item>
          </template>
        </div>

        <div class="form-item-group">
          <gray-title title="提现处理" class="ta-l putforward-title"></gray-title>
          <el-form-item label="状态：">
            <template>{{initData.dealWithStatus | filterDealWithStatus}}</template>
          </el-form-item>
          <el-form-item label="处理结果：">
            <template v-if="initData.dealWithStatus === 1">
              <el-radio-group v-model="formData.dealWithStatus">
                <el-radio :label="2">打款</el-radio>
                <el-radio :label="3">回退</el-radio>
              </el-radio-group>
            </template>
            <template v-else-if="initData.dealWithStatus === 4">{{initData.remark | filterEmpty}}</template>
            <template v-else>{{initData.dealWithStatus | filterDealWithStatus}}</template>
          </el-form-item>

          <template v-if="initData.accountType === 1 && formData.dealWithStatus === 2">
            <el-form-item label="上传流水号：" prop="paymentNo"
              :style="{padding: initData.dealWithStatus === 1 ? '10px 0' : ''}">
              <template v-if="initData.dealWithStatus === 1">
                <el-input placeholder="输入订单流水号" v-model="formData.paymentNo"></el-input>
              </template>
              <template v-else>{{initData.paymentNo | filterEmpty}}</template>
              <!-- <template v-else>{{initData}}</template> -->
            </el-form-item>

            <el-form-item :label="initData.dealWithStatus === 1 ? '上传打款凭证：' : '打款凭证：'" class="voucherImg">
              <template v-if="initData.dealWithStatus === 1">
                <el-upload
                  :class="{'upload-max': formData.uploadFileList.length === 1}"
                  list-type="picture-card"
                  :action="uploadUrl"
                  :limit="1"
                  :file-list="formData.uploadFileList"
                  :on-exceed="exceedHandle"
                  :before-upload="beforeAvatarUpload"
                  :on-preview="pictureCardPreviewHandle"
                  :on-success="uploadSuccessHandle"
                  :on-remove="removeHandle">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-input v-model="formData.voucherImg" class="d-n"></el-input>
              </template>
              <div class="thumbnail-wrap" v-else>
                <template v-if="initData.paymentVoucher">
                  <a :href="initData.paymentVoucher | filterImgUrl" target="_blank">
                    <img :src="initData.paymentVoucher | filterImgUrl" class="full-wrap">
                  </a>
                </template>
                <template v-else>{{'' | filterEmpty}}</template>
              </div>
            </el-form-item>
          </template>

          <template v-else-if="initData.accountType !== 1">
            <el-form-item label="流水号：" prop="paymentNo">
              <template v-if="formData.dealWithStatus === 4">
                <el-input placeholder="限20个字符" v-model="formData.paymentNo"></el-input>
              </template>
              <template v-else>未获取</template>
            </el-form-item>
            <el-form-item label="上传打款凭证：" class="voucherImg" v-if="initData.dealWithStatus === 4">
              <template  v-if="initData.dealWithStatus === 4">
                <el-upload
                  :class="{'upload-max': formData.uploadFileList.length === 1}"
                  list-type="picture-card"
                  :action="uploadUrl"
                  :limit="1"
                  :file-list="formData.uploadFileList"
                  :on-exceed="exceedHandle"
                  :before-upload="beforeAvatarUpload"
                  :on-preview="pictureCardPreviewHandle"
                  :on-success="uploadSuccessHandle"
                  :on-remove="removeHandle">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-input v-model="formData.voucherImg" class="d-n"></el-input>
              </template>
              <span style="color: red;">请通过线下核查打款结果后上传凭证，完成此次打款</span>
            </el-form-item>
            <el-form-item label="打款凭证：" prop="paymentVoucher"  v-else>
              <template>未获取</template>
            </el-form-item>
          </template>

          <template v-if="formData.dealWithStatus === 3">
            <el-form-item label="回退说明：" prop="description" :style="{padding: initData.dealWithStatus === 1 ? '10px 0' : ''}">
              <template v-if="initData.dealWithStatus === 3">{{initData.description}}</template>
              <template v-else>
                <el-input placeholder="限20个字符" v-model="formData.description"></el-input>
              </template>
            </el-form-item>
          </template>
        </div>

      </el-form>

      <div class="btns-wrap">
        <el-button :type="initData.dealWithStatus === 2 ? 'primary' : ''" @click="$emit('close')">{{initData.dealWithStatus === 1 ? '取消' : '关闭'}}</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="primary" @click="handlePayment('form')" :loading="loading" v-if="initData.dealWithStatus === 1">确定</el-button>
        <el-button type="primary" @click="handlePaymentRel('form')" :loading="loading" v-if="initData.dealWithStatus === 4">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="800px">
      <img class="full-wrap" :src="formData.voucherImg | filterImgUrl">
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
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
    // 流水号
    let validateStream = (rule, value, callback) => {
      if (value && value.length > 50) return callback(new Error('限50个字符以内'))
      callback()
    }

    // 回退
    let validateRegresses = (rule, value, callback) => {
      if (value && value.length > 50) return callback(new Error('限50个字符以内'))
      callback()
    }
    // 凭证图片
    let validateVoucherImg = (rule, value, callback) => {
      if (this.initData.dealWithStatus === 1 && !value) return callback(new Error('上传打款凭证'))
      callback()
    }

    return {
      loading: false,         // 加载中
      formData: {             // 表单数据
        balance: '',          // 可用余额
        rechargeBalance: '',  // 余额提现
        rechargeIntegral: '', // 消费积分提现
        integralBalance: '',  // 消费积分可用余额
        uploadFileList: [],   // 上传列表
        dealWithStatus: 2,    // 处理结果
        paymentNo: '',        // 流水号
        description: '',      // 回退
        voucherImg: '',       // 提现凭证
        reflect: 2,           // 审核
        reflectMsg: ''        // 审核不通过原因
      },
      rules: {
        paymentNo: [{validator: validateStream, trigger: 'blur'}],
        description: [{validator: validateRegresses, trigger: 'change'}],
        voucherImg: [{validator: validateVoucherImg, trigger: 'change'}]
      },
      dialogImageUrl: '',     // 预览图片地址
      dialogVisible: false,   // 预览显示弹窗
      fxUserInfo: {}   // 用户信息
    }
  },

  watch: {
    initData: {
      handler () {
        this.formData.paymentNo = ''
        this.formData.uploadFileList = []
        this.formData.voucherImg = ''
        this.formData.dealWithStatus = this.initData.dealWithStatus
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
     * 提现操作
     */
    handlePayment (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.loading = true
        this.$http.post('@ROOT_API/withdrawalManageController/payWithdrawal', {
          id: this.initData.id,
          paymentVoucher: this.formData.voucherImg,
          paymentNo: this.formData.paymentNo,
          dealWithStatus: this.formData.dealWithStatus,   // 打款状态 1： 待处理 2：已处理 3：回退
          description: this.formData.description          // 退回说明
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            // this.$message({
            //   message: resData.msg,
            //   type: 'error',
            //   duration: 1500
            // })
            this.$emit('error', resData.msg)
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
            this.loading = false
          }, 1000)
        })
      })
    },

    handlePaymentRel () {
      this.loading = true
      this.$http.post('@ROOT_API/withdrawalManageController/withdrawalUpdatePayException', {
        withdrawalId: this.initData.id,
        paymentVoucher: this.formData.voucherImg,
        paymentNo: this.formData.paymentNo
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$emit('error', resData.msg)
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
          this.loading = false
        }, 1000)
      })
    },
    /**
     * 弹窗关闭前操作
     */
    handleBeforeClose () {
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
      if (parseInt(res.status) !== 1) {
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
        this.formData.uploadFileList = []
        this.formData.voucherImg = ''
      }, 30)
    }
  }
}
</script>

<style lang="less" scoped>
.recharge-dialog-wrap{

  .admin-gray-title{
    margin-bottom: 0;
  }

  /* -------------------- { 提现弹窗用户信息 } -------------------- */
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
  .auth-error {
    color: #FF0000;
  }
  .auth-success {
    color: #009900 !important;
  }

}
</style>

<style lang="less">
.recharge-dialog-wrap{

  .el-dialog__body{
    padding: 30px !important;
    height: 500px;
    overflow: auto;
  }

  .upload-max{
    .el-upload--picture-card{
      display: none;
    }
  }
}
</style>