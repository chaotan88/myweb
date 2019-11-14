<!-- 弹窗 -->
<!-- 调用：充值、扣款、充值审核 -->
<template>
  <el-dialog :title="dialogTitle" :visible.sync="visible" width="850px" class="recharge-dialog-wrap" :before-close="HandleBeforeClose">
        
    <table class="ta-l full-w recharge-table">
      <tr>
        <th colspan="4" class="fw-n">会员信息</th>
      </tr>
      <tr>
        <td>会员姓名</td>
        <td>{{initData.customerName | filterEmpty}}</td>
        <td>手机号</td>
        <td>{{initData.customerPhone | filterEmpty}}</td>
      </tr>
    </table>

    <el-form label-position="right" label-width="220px" class="ta-l" :model="formData" :rules="rules" ref="form">

      <div class="form-item-group">
        <gray-title :title="mainTitle" class="ta-l"></gray-title>

        <!-- 充值 -->
        <el-form-item :label="balanceTitle" class="full-w" prop="rechargeBalance">
          <template v-if="pageType === 1">
            <template v-if="actionType === 1">
              <el-input-number placeholder="保留2位小数" class="d-ib" controls-position="right" v-model="formData.rechargeBalance"></el-input-number>　元
            </template>
            <template v-else>
              <el-input-number placeholder="请输入正数，允许保留两位小数" :max="100000000" class="d-ib" controls-position="right" v-model="formData.rechargeBalance"></el-input-number>　元
            </template>
          </template>
          <template v-if="pageType === 2">
            <strong>{{initData.amountOfMoney}}</strong>元
          </template>
          <span class="gray-text">（结余： <strong>
            <template v-if="pageType === 1">{{initData.balance | filterEmpty}}</template>
            <template v-else>{{formData.balance}}</template>
          </strong>元 ）</span>
        </el-form-item>
        <el-form-item :label="integralTitle" class="full-w" prop="rechargeIntegral">
          <template v-if="pageType === 1">
            <el-input-number placeholder="请输入正整数" :max="100000000" class="d-ib" controls-position="right" v-model="formData.rechargeIntegral"></el-input-number>　分
          </template>
          <template v-else>
            <strong>{{initData.consumePoints}}</strong>个
          </template>
          <span class="gray-text">（结余： <strong>
            <template v-if="pageType === 1">{{initData.bonusPoints | filterEmpty}}</template>
            <template v-else>{{formData.integralBalance | filterEmpty}}</template>
          </strong>个 ）</span>
        </el-form-item>

        <el-form-item label="扣款说明：" class="full-w" v-if="actionType === 2">
          <template v-if="pageType === 1">
            <el-input type="textarea" rows="3" style="width: 300px;" placeholder="请填写扣款说明，限50个字符" maxlength="50" v-model="formData.description"></el-input>
          </template>
          <template v-else>{{initData.descriptionSub | filterEmpty}}</template>
        </el-form-item>

        <el-form-item :label="voucherTitle" class="full-w" prop="voucherImgStr" :required="pageType === 1">
          <template v-if="pageType === 1">
            <el-upload
              :class="{'upload-max': formData.uploadFileList.length === 5}"
              list-type="picture-card"
              :action="uploadUrl"
              :limit="5"
              :file-list="formData.uploadFileList"
              :on-exceed="exceedHandle"
              :before-upload="beforeAvatarUpload"
              :on-preview="pictureCardPreviewHandle"
              :on-success="uploadSuccessHandle"
              :on-remove="removeHandle">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-input v-model="formData.voucherImgStr" class="d-n"></el-input>
          </template>
          <template v-else v-for="item in initData.paymentVoucher">
            <div class="d-ib thumbnail-wrap" title="查看">
              <a :href="item | filterImgUrl" target="_blank">
                <img :src="item | filterImgUrl" class="full-wrap">
              </a>
            </div>
          </template>
        </el-form-item>
      </div>

      <div class="form-item-group" v-if="pageType !== 1">
        <gray-title title="审核" class="ta-l"></gray-title>
        <el-form-item label=" " class="full-w" prop="examineMsg">
          <el-radio-group v-model="formData.examine">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">不通过</el-radio>
          </el-radio-group>
          <el-input type="textarea" :rows="4" placeholder="填写不通过原因（100个字符以内）" v-model="formData.examineMsg" class="d-b examine-msg" v-if="formData.examine === 3"></el-input>
        </el-form-item>
      </div>

    </el-form>

    <div class="btns-wrap">
      <el-button @click="$emit('close')">取消</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button type="primary" @click="handleRechargeBefore('form')">{{submitTitle}}</el-button>
    </div>

    <el-dialog title="输入密码" :visible.sync="passwordVisible" width="480px" :append-to-body="true">
      <br>
      <el-form :model="formData" :rules="rules" ref="passwordForm" label-width="90px" class="ta-l">
        <el-form-item prop="password">
          <el-input style="width: 260px;" type="password" placeholder="输入修改密码" v-model="formData.password"></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="passwordVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('passwordForm')" :loading="loading">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="800px" :append-to-body="true">
      <img class="full-w" :src="dialogImageUrl">
    </el-dialog>

  </el-dialog>
</template>

<script>
export default {
  props: {
    initData: Object,
    visible: {          // 弹窗是否可见
      type: Boolean,
      default: false
    },
    actionType: {
      type: Number,
      default: 1
    },
    pageType: {
      type: Number,
      default: 1
    }
  },

  data () {
    // 充值
    let validateRechargePublic = (rule, value, callback) => {
      if (value && value < 0) {
        if (rule.field === 'rechargeBalance') {
          return callback(new Error('请输入正数，允许保留两位小数'))
        } else {
          return callback(new Error('请输入正整数'))
        }
      }
      if (this.pageType === 1 && !value && !this.formData.rechargeIntegral && !this.formData.rechargeBalance) return callback(new Error('金额或消费积分至少填一个'))
      if (this.actionType === 2) {
        if (rule.field === 'rechargeBalance' && Math.abs(this.formData.rechargeBalance) > parseInt(this.initData.balance) || rule.field === 'rechargeIntegral' && Math.abs(this.formData.rechargeIntegral) > parseInt(this.initData.bonusPoints)) return callback(new Error('扣除值不能大于当前余额'))
      }
      this.$refs['form'].clearValidate('rechargeIntegral')
      this.$refs['form'].clearValidate('rechargeBalance')
      callback()
    }

    // 支付凭证
    let validateVoucherImg = (rule, value, callback) => {
      console.log('validateVoucherImg: ', value)
      if (this.pageType === 1 && !value) return callback(new Error('请上传凭证'))
      callback()
    }
    return {
      loading: false,         // 加载中
      dialogTitle: '',        // 弹窗标题
      mainTitle: '',          // 主标题
      balanceTitle: '',       // 余额标题
      integralTitle: '',      // 积分标题
      voucherTitle: '',       // 凭证标题
      submitTitle: '',        // 提交标题
      formData: {             // 表单数据
        balance: '',          // 可用余额
        rechargeBalance: '',  // 余额充值
        rechargeIntegral: '', // 消费积分充值
        integralBalance: '',  // 消费积分可用余额
        uploadFileList: [],   // 上传列表
        voucherImg: [],       // 充值凭证
        voucherImgStr: '',    // 拼接充值凭证
        examine: 2,           // 审核
        examineMsg: '',       // 审核不通过原因
        password: '',         // 修改密码
        description: ''       // 扣款说明
      },
      copyFormData: {},       // 拷贝搜索条件
      rules: {
        rechargeBalance: [{compareField: 'rechargeIntegral', validator: validateRechargePublic, trigger: 'blur'}],
        rechargeIntegral: [{compareField: 'rechargeBalance', validator: validateRechargePublic, trigger: 'blur'}],
        voucherImgStr: [{validator: validateVoucherImg, trigger: 'change'}],
        examineMsg: [{max: 100, message: '填写不通过原因（100个字符以内）', trigger: 'blur'}],
        password: [{required: true, min: 1, message: '请输入密码', trigger: 'blur'}]
      },
      dialogImageUrl: '',     // 预览图片地址
      dialogVisible: false,   // 预览显示弹窗
      passwordVisible: false, // 修改密码显示弹窗
      userInfo: {}            // 用户信息
    }
  },

  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source?clientType=1&token=' + this.userInfo.token
    }
  },

  watch: {
    'visible' () {
      this.init()
      if (this.visible === true && this.pageType === 2) this.getMemberInfo()
    }
  },

  mounted () {
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.init()
  },

  methods: {
    /**
     * 初始化
     */
    init () {
      if (this.$refs['form']) this.$refs['form'].resetFields()
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      this.formData.rechargeBalance = ''
      this.formData.rechargeIntegral = ''
      this.formData.description = ''
      // pageType === 1 ? '账户充值' : '充值审核'
      if (this.actionType === 1) {
        this.mainTitle = '充值信息'
        this.balanceTitle = '余额充值：'
        this.integralTitle = '消费积分充值：'
        this.dialogTitle = this.pageType === 1 ? '账户充值' : '充值审核'
        this.voucherTitle = this.pageType === 1 ? '上传充值凭证：' : '充值凭证：'
        this.submitTitle = this.pageType === 1 ? '充值' : '确定'
      } else {
        this.mainTitle = '扣款信息'
        this.balanceTitle = '余额扣除：'
        this.integralTitle = '消费积分扣除：'
        this.dialogTitle = this.pageType === 1 ? '账户扣款' : '扣款审核'
        this.voucherTitle = this.pageType === 1 ? '上传扣款凭证：' : '扣款凭证：'
        this.submitTitle = this.pageType === 1 ? '扣款' : '确定'
      }
    },
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
     * 充值 || 审核 操作
     */
    handleSubmit () {
      this.loading = true
      let url = this.pageType === 2 ? '@ROOT_API/accountRechargeController/auditRecharge' : '@ROOT_API/accountRechargeController/recharge'
      let amountOfMoney = 0
      let consumePoints = 0
      if (this.pageType === 2) {
        amountOfMoney = this.initData.amountOfMoney || 0
        consumePoints = this.initData.consumePoints || 0
      } else {
        amountOfMoney = this.formData.rechargeBalance || 0
        consumePoints = this.formData.rechargeIntegral || 0
      }
      this.$http.post(url, {
        id: this.pageType === 2 ? this.initData.id : '',
        customerId: this.initData.customerId,
        customerName: this.initData.customerName,
        customerPhone: this.initData.customerPhone,
        amountOfMoney,                                        // 余额充值
        consumePoints,                                        // 消费积分充值
        paymentVoucher: this.formData.voucherImg.join(','),   // 支付凭证
        auditStatus: this.formData.examine,                   // 审核状态
        description: this.formData.examineMsg,                // 不通过原因
        managerPassword: this.formData.password,              // 密码校验
        descriptionSub: this.formData.description,            // 扣款说明
        rechargeType: this.actionType === 1 ? 2 : 1           // 是 int 类型 1.扣除 2.充值
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
        setTimeout(() => {
          this.$refs['form'].resetFields()
          this.formData = this.$Utils.deepCopy(this.copyFormData)
          this.dialogImageUrl = ''
          this.formData.password = ''
          this.passwordVisible = false
          this.$emit('success')
        }, 50)
      }).finally(() => {
        setTimeout(() => {
          this.loading = false
        }, 2000)
      })
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
      if (parseInt(res.status) !== 1) {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.uploadFileList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.formData.voucherImg.push(res.data)
      this.formData.voucherImgStr = this.formData.voucherImg.join(',')
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
      this.formData.uploadFileList = []
      this.formData.voucherImg = []
      fileList.forEach((row) => {
        this.formData.voucherImg.push(row.url)
        this.formData.uploadFileList.push({
          id: row.id,
          url: this.$Utils.filterImgUrl(row.url)
        })
      })
      this.formData.voucherImgStr = this.formData.voucherImg.join(',')
    }
  }
}
</script>

<style lang="less" scoped>
.recharge-dialog-wrap{

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
      width: 360px;
      margin-bottom: 10px;
    }
  }

  .thumbnail-wrap{
    width: 100px;
    height: 100px;
    border: 1px solid #ebeef5;
    margin-right: 10px;
    margin-bottom: 10px;
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
.recharge-dialog-wrap{

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