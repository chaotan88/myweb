<!-- 提现设置 编辑 -->
<template>
  <common-tpl class="reflext-settings-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

          <div class="box">
            <gray-title title="提现设置"></gray-title>
            <el-form-item label="提现入口：" prop="conditionValue">
              <el-checkbox v-model="withdrawalWx" :true-label="1" :false-label="2">微信</el-checkbox>
              <el-checkbox v-model="withdrawalAli" :true-label="1" :false-label="2">支付宝</el-checkbox>
              <el-checkbox v-model="withdrawalBank" :true-label="1" :false-label="2">银行卡</el-checkbox>
            </el-form-item>
            <el-form-item label="提现周期：" prop="withdrawalCycle">
              <el-select v-model="ruleForm.withdrawalCycle" placeholder="选择提现周期">
                  <template v-for="(ruleList, index) in cycles">
                    <el-option :label="ruleList.ruleName" :value="ruleList.ruleId"></el-option>
                  </template>
                </el-select>
            </el-form-item>
            <el-form-item label="提现次数：" prop="cycleNumber">
              <el-input v-model="ruleForm.cycleNumber" placeholder="0或正整数,0表示不限制"></el-input>
              <span class="recommendSpan">次/周期</span>
            </el-form-item>
            <el-form-item label="提现手续费：" prop="conditionValue">
              <!-- <span class="recommendSpan">累计通用积分账户沉淀资金的</span> -->
              <el-input v-model="ruleForm.conditionValue" placeholder="0-100.00正数" @change="inpBlur('conditionValue')"></el-input>
              <span class="recommendSpan">% </span>
            </el-form-item>
            <el-form-item label="提现起始金额：" prop="withdrawalMinamount">
              <el-input v-model="ruleForm.withdrawalMinamount" placeholder="0-1000.00正数" @change="inpBlur('withdrawalMinamount')"></el-input>
              <span class="recommendSpan">元</span>
            </el-form-item>
            <!-- <el-form-item>
              <span class="recommendSpan setting-desc">
                1.指的是通用积分提现时，按设置的百分比计算出来当前账户可提现的通用积分，
              计算规则：当前账户可提现通用积分=当前账户通用积分结余-累计通用积分*设置的沉淀资金百分比(计算完后四舍五入，保留整数)；
              当计算出来的可提现通用积分大于‘0”时为可提现金额，可操作提现；当计算出来的可提现通用积分小于等于‘0”时不可操作提现，
              给出提现‘无可提现金额”
              </span>
            </el-form-item> -->
          </div>
        </el-form>
      </div>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('ruleForm')">提交</el-button>
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    let validateNumber = (rule, value, callback) => {
      let reg = /^\d{0,7}\.\d{2}$/gi
      if ((value && !value.toString().match(reg) || parseFloat(value) > 100)) return callback(new Error('只能输入0-100.00正数'))
      callback()
    }
    let validateWithdrawalMinamount = (rule, value, callback) => {
      let reg = /^\d{0,7}\.\d{2}$/gi
      if ((value && !value.toString().match(reg) || parseFloat(value) > 1000)) return callback(new Error('只能输入0-1000.00正数'))
      callback()
    }
    let validateCycleNumber = (rule, value, callback) => {
      let reg = /^\d{0,10}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('只能输入0或正整数'))
      callback()
    }
    return {
      confirmLoading: false,    // 确定loading
      ruleForm: {
        withdrawalCycle: '',
        cycleNumber: '',
        conditionValue: '',
        conditionType: 1
      },
      rules: {
        withdrawalCycle: [
          { required: true, message: '请选择提现周期', trigger: 'blur' }
        ],
        cycleNumber: [
          { required: true, message: '请输入提现次数', trigger: 'blur' },
          { validator: validateCycleNumber, trigger: 'blur' }
        ],
        conditionValue: [
          { required: true, message: '请输入提现手续费', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ],
        withdrawalMinamount: [
          { required: true, message: '请输入提现起始金额', trigger: 'blur' },
          { validator: validateWithdrawalMinamount, trigger: 'blur' }
        ]
      },
      cycles: [{
        ruleId: 1,
        ruleName: '每天'
      }, {
        ruleId: 2,
        ruleName: '每周'
      }, {
        ruleId: 3,
        ruleName: '每月'
      }],
      withdrawalWx: 2,
      withdrawalAli: 2,
      withdrawalBank: 2
    }
  },
  computed: {},
  mounted () {
    this.getDetailsData()
  },
  methods: {
    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/withdrawalManageController/getWithdrawalDetail', {
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
        this.ruleForm = resData.data
        this.withdrawalWx = this.ruleForm.withdrawalWx
        this.withdrawalAli = this.ruleForm.withdrawalAli
        this.withdrawalBank = this.ruleForm.withdrawalBank
        this.inpBlur('conditionValue')
        this.inpBlur('withdrawalMinamount')
      })
    },
    /**
     * 提交
     */
    submitForm (formName) {
      if (this.withdrawalWx !== 1 && this.withdrawalAli !== 1 && this.withdrawalBank !== 1) {
        this.$message({
          message: '请勾选提现入口',
          type: 'error',
          duration: 1500
        })
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.confirmLoading = true
        this.$http.post('@ROOT_API/withdrawalManageController/settingWithdrawal', {
          withdrawalCycle: this.ruleForm.withdrawalCycle,
          cycleNumber: this.ruleForm.cycleNumber,
          conditionType: this.ruleForm.conditionType,
          withdrawalMinamount: this.ruleForm.withdrawalMinamount,
          conditionValue: parseFloat(this.ruleForm.conditionValue),
          withdrawalWx: this.withdrawalWx,
          withdrawalAli: this.withdrawalAli,
          withdrawalBank: this.withdrawalBank
          // 'withdrawalCycle': 1,
          // 'withdrawalMinamount': 0.02,
          // 'cycleNumber': 0,
          // 'conditionValue': 4,
          // 'withdrawalWx': 0,
          // 'withdrawalAli': 0,
          // 'withdrawalBank': 0
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
          // succese
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          setTimeout(() => {
            this.$router.go(-1)
          }, 300)
        }).finally(() => {
          setTimeout(() => {
            this.confirmLoading = false
          }, 500)
        })
      })
    },
    inpBlur (type) {
      this.$Utils.blurAutoCompletion(this.ruleForm, type)
    }
  }
}
</script>

<style lang="less" scoped>
.reflext-settings-wrap{
  .goods-common-details{

    .box{
      margin-bottom: 20px;
      border-bottom: 1px solid #f1f4f7;


      .title{
        height: 35px;
        line-height:35px;
        padding: 10px 20px;
        font-size: 14px;
        border-left:1px solid #f1f4f7;
        border-right:1px solid #f1f4f7;
      }


      p{
        height: 45px;
        line-height: 45px;
        padding: 0 20px;
        border: 1px solid #f1f4f7;
        border-bottom:none;
      }

      dl{
        dt, dd{
          padding: 10px;
        }

        dt{
          color: #606266;
          width: 160px;
          font-size: 14px;
          top: 0;
          left: 0;

          span{
            height: 45px;
            line-height: 45px;
          }
        }

        dd{
          padding-left: 180px;
          border: 1px solid #f1f4f7;
          border-bottom: none;

          table{
            /*width: 90%;*/
            /*margin: 20px;*/
            box-sizing: border-box;

            th{
              height: 45px;
              line-height: 45px;
              font-size: 16px;
              font-weight: normal;
              background: #eee;
            }

            td{
              height: 43px;
              line-height: 43px;
              padding: 0;
              text-align: center;
              border: 1px solid #f1f4f7;
              border-bottom: none;
            }
          }
        }
      }

      .cycle{
        width: 200px;
      }

      .word-count{
        left: 380px;
        top: 45px;
      }
    }

    .maggin-t{
      margin-top: 0;
    }

    .admin-gray-title{
      margin-bottom: 0;
    }
  }
  .setting-desc {
    color: red;
  }
}
</style>
<style lang="less">
.reflext-settings-wrap{
  .el-dialog {
    .el-dialog__body {
      padding-bottom: 0;
    }
  }

  .el-form{
    .el-form-item{
      /*float: left;*/
      // border: 1px solid #f1f4f7;
      border-bottom: none;
      padding: 10px;
      margin-bottom: 0;

      .el-form-item__label{
        width: 200px !important;
      }

      .recommendSpan{
        margin-left: 10px;
      }

      .el-input{
        width: 220px;
      }
      .el-form-item__content{
        margin-left: 200px !important;
      }

      .cue{
        color: #999;
        left: 200px;
        bottom: 0;
      }
    }

    .administration-wrap{
      width: 100%;
      overflow: hidden;
      border: 1px solid #f1f4f7;
      border-bottom: none;
      .administration{
        float: left;
        border: none;
        .el-form-item__content{
          margin-left: 200px !important;
        }

        .el-form-item__error{
          left: 0;
        }
      }

      .administration-l{
        width: 32%;
      }
    }
  }
  .el-textarea{
    width: 420px;
  }
}
</style>
