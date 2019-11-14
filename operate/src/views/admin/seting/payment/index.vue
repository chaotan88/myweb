<!-- 支付设置 -->
<template>
  <common-tpl class="setting-payment-wrap" footer>
    <!-- 头部 -->
    <template slot="header">
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-form label-position="right" :model="formData"  ref="formData" label-width="" :rules="rules">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr style="height:146px">
            <td class="td-padding td-title">余额支付：</td>
            <td class="td-padding">
              <el-row type="flex" align="middle">
                <el-radio-group v-model="formData.balancePayStatus">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
                <el-row v-if="formData.balancePayStatus === 1" class="flex1" type="flex" align="middle">
                  <span>支持购买</span>
                  <el-form-item label="" prop="balancePayArea">
                    <el-checkbox-group v-model="formData.balancePayArea"  class="ml-20 flex1" @change="payAreaChange">
                      <el-checkbox v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-row>
                <!--   <el-row type="flex" align=""  style="flex: 1;flex-direction: column;" v-if="formData.balancePayStatus === 1">
                     <span class="ml-80 mb-20">
                        <el-form-item label="" prop="profitRate" class="first-form-item">
                          <span>利润率（成交价/销售价） >=</span>
                          <el-input v-model.number="formData.profitRate" placeholder="0-100000000正整数，0为不限" maxLength="9" style="width: 100px;" ></el-input>
                          <span>%</span>
                        </el-form-item>
                     </span>
                   </el-row>-->
              </el-row>
            </td>
          </tr>
          <tr>
            <td class="td-padding td-title">通用积分支付：</td>
            <td class="td-padding">
              <el-row type="flex" align="middle">
                <el-radio-group v-model="formData.cashPointsPayStatus">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
                <el-row v-if="formData.cashPointsPayStatus === 1" class="" type="flex" align="middle">
                  <span>交易限额</span>
                  <el-form-item label="" prop="cashPointsAmount">
                    <el-input v-model.number="formData.cashPointsAmount" placeholder="0-100000000正整数，0为不限" maxLength="9"></el-input>
                    <span class="color-999">超过交易额或未开启，前端支付页面不显示</span>
                  </el-form-item>
                </el-row>
                <el-form-item label="" prop="cashPointPayArea" class="flex1" v-if="formData.cashPointsPayStatus === 1">
                  <el-checkbox-group v-model="formData.cashPointPayArea"  class="ml-20 flex1" @change="payAreaChange">
                    <el-checkbox v-for="item in cashPointPayList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-row>
            </td>
          </tr>
          <tr>
            <td class="td-padding td-title">微信支付：</td>
            <td class="td-padding">
              <el-row type="flex" align="middle">
                <el-radio-group v-model="formData.wxPayStatus">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
                <el-row v-if="formData.wxPayStatus === 1" class="flex1" type="flex" align="middle">
                  <span>交易限额</span>
                  <el-form-item label="" prop="wxPayAmount">
                    <el-input v-model.number="formData.wxPayAmount" placeholder="0-100000000正整数，0为不限" maxLength="9"></el-input>
                    <span class="color-999">超过交易额或未开启，前端支付页面不显示</span>
                  </el-form-item>
                </el-row>
              </el-row>
            </td>
          </tr>
          <tr>
            <td class="td-padding td-title">支付宝支付：</td>
            <td class="td-padding">
              <el-row type="flex" align="middle">
                <el-radio-group v-model="formData.aliPayStatus">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
                <el-row v-if="formData.aliPayStatus === 1" class="flex1" type="flex" align="middle">
                  <span>交易限额</span>
                  <el-form-item label="" prop="aliPayAmount">
                    <el-input v-model.number="formData.aliPayAmount" placeholder="0-100000000正整数，0为不限" maxLength="9"></el-input>
                    <span class="color-999">超过交易额或未开启，前端支付页面不显示</span>
                  </el-form-item>
                </el-row>
              </el-row>
            </td>
          </tr>
          <tr>
            <td class="td-padding td-title">银联支付：</td>
            <td class="td-padding">
              <el-row type="flex" align="middle">
                <el-radio-group v-model="formData.chinapayPayStatus">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
                <el-row v-if="formData.chinapayPayStatus === 1" class="flex1" type="flex" align="middle">
                  <span>交易限额</span>
                  <el-form-item label="" prop="chinapayPayAmount">
                    <el-input v-model.number="formData.chinapayPayAmount" placeholder="0-100000000正整数，0为不限" maxLength="9"></el-input>
                    <span class="color-999">超过交易额或未开启，前端支付页面不显示</span>
                  </el-form-item>
                </el-row>
              </el-row>
            </td>
          </tr>
          <tr>
            <td class="td-padding td-title">线下支付：</td>
            <td class="td-padding">
              <el-row type="flex" align="middle">
                <el-radio-group v-model="formData.offlinePayStatus">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
                <el-row v-if="formData.offlinePayStatus === 1" class="flex1" type="flex" align="middle">
                  <span>交易限额</span>
                  <el-form-item label="" prop="offlineMinPayAmount" :rules="offlineMinPayAmount">
                    <el-input v-model.number="formData.offlineMinPayAmount" placeholder="0-100000000正整数，0为不限" maxLength="9"></el-input>
                  </el-form-item>
                  <span>至</span>
                  <el-form-item label="" prop="offlinePayAmount" :rules="formData.offlineMinPayAmount === 0 ? [] : rules.offlinePayAmount">
                    <el-input v-model.number="formData.offlinePayAmount" placeholder="0-100000000正整数，0为不限" maxLength="9"></el-input>
                  </el-form-item>
                  <span class="color-999">超过交易额或未开启，前端支付页面不显示</span>
                </el-row>
              </el-row>
            </td>
          </tr>
        </table>
      </el-form>
    </template>

    <template slot="other">
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitFormData('formData')">确 定</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      let validateNumber = (rule, value, callback) => {
        if (value === '') return callback(new Error('请输入交易限额'))
        if (value && value < 0) return callback(new Error('必须是大于0的数字'))
        if (value && !value.toString().match(/^\d+$/g)) return callback(new Error('请输入正确的数值'))
        callback()
      }
      let validateProfitRate = (rule, value, callback) => {
        if (value === '') return callback(new Error('请输入利润率'))
        if (value && value <= 0) return callback(new Error('必须是大于0的数字'))
        if (value && !value.toString().match(/^\d+(\.\d{0,2})?$/g)) return callback(new Error('请输入正确的数值'))
        callback()
      }
      return {
        loading: false,                          // loading
        confirmLoading: false,                  // loading
        formData: {
          balancePayArea: [],       // 支持购买
          cashPointPayArea: [],       // 支持购买 通用积分
          balancePayStatus: 1,     // 是否开启余额支付
          // profitRate: 0,           // 利润率
          cashPointsPayStatus: 1,  // 积分支付
          cashPointsAmount: 0,
          wxPayStatus: 1,          // 微信支付
          wxPayAmount: 0,
          aliPayStatus: 1,          // 支付宝
          aliPayAmount: 0,
          chinapayPayStatus: 1,     // 银联
          chinapayPayAmount: 0,
          offlinePayStatus: 1,     // 线下
          offlinePayAmount: 0,
          offlineMinPayAmount: 0,
          checkedList: []
        },
        options: [{
          value: '1',
          label: '普通区(分类、栏目)'
        }, {
          value: '2',
          label: '社群分享'
        }, {
          value: '3',
          label: '芯豆区'
        }, {
          value: '4',
          label: '消费积分区'
        }, {
          value: '5',
          label: '联盟积分区'
        }, {
          value: '6',
          label: '一元抢购'
        }, {
          value: '7',
          label: '拼团'
        }, {
          value: '8',
          label: '限时抢购'
        }],
        cashPointPayList: [
          {
            value: '1',
            label: '普通区(分类、栏目)'
          }, {
            value: '2',
            label: '社群分享'
          }, {
            value: '3',
            label: '芯豆区'
          }, {
            value: '4',
            label: '消费积分区'
          }, {
            value: '5',
            label: '联盟积分区'
          }, {
            value: '6',
            label: '一元抢购'
          }, {
            value: '7',
            label: '拼团'
          }, {
            value: '8',
            label: '限时抢购'
          }, {
            value: '9',
            label: '买卖仓抢购'
          }, {
            value: '10',
            label: '买卖仓批发'
          }, {
            value: '12',
            label: '超级拼团团长'
          }, {
            value: '13',
            label: '超级拼团团员'
          }, {
            value: '14',
            label: '升级套餐'
          }
        ],
        rules: {
          profitRate: [{required: true, validator: validateProfitRate, trigger: 'blur'}],
          cashPointsAmount: [{required: true, validator: validateNumber, trigger: 'blur'}],
          wxPayAmount: [{required: true, validator: validateNumber, trigger: 'blur'}],
          chinapayPayAmount: [{required: true, validator: validateNumber, trigger: 'blur'}],
          offlinePayAmount: [{required: true, validator: validateNumber, trigger: 'blur'}],
          aliPayAmount: [{required: true, validator: validateNumber, trigger: 'blur'}],
          balancePayArea: [{ type: 'array', required: true, message: '请至少选择一个购买区域', trigger: 'change' }]
        },
        offlineMinPayAmount: [{required: true, validator: validateNumber, trigger: 'blur'}],
        pageData: {                 // 分页
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.getFormData()
    },
    methods: {
      /**
       * 获取列表数据
       */
      getFormData () {
        this.loading = true
        this.$http.get('@ROOT_API/paySetting/getPaySetting').then((res) => {
          let results = res.data
          if (parseInt(results.status) !== 1) {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.formData = results.data
          this.formData.balancePayArea = !this.formData.balancePayArea ? [] : this.formData.balancePayArea.split(',')
          this.formData.cashPointPayArea = !this.formData.cashPointPayArea ? [] : this.formData.cashPointPayArea.split(',')
        }).finally(() => {
          this.loading = false
        })
      },
      payAreaChange (val) {
        // alert(val)
        // this.formData.balancePayArea = [5]
      },
      /**
       * 提交表单
       */
      submitFormData (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // ...
            let data = JSON.parse(JSON.stringify(this.formData))
            data.balancePayArea = data.balancePayArea.length === 0 ? '' : data.balancePayArea.join()
            data.cashPointPayArea = data.cashPointPayArea.length === 0 ? '' : data.cashPointPayArea.join()
            if (this.formData.offlinePayAmount === '') this.formData.offlinePayAmount = 0
            if (this.formData.offlineMinPayAmount > this.formData.offlinePayAmount) {
              this.$message({
                message: '请输入正确的线下支付交易额范围',
                type: 'error',
                duration: 1500
              })
            } else {
              this.$http.post('@ROOT_API/paySetting/updatePaySetting', data).then(res => {
                let results = res.data
                if (parseInt(results.status) !== 1) {
                  this.$message({
                    message: results.msg,
                    type: 'error',
                    duration: 1500
                  })
                  return false
                }
                this.$message({
                  message: results.msg,
                  type: 'success',
                  duration: 1500
                })
                this.getFormData()
              }).finally(() => {
                // this.loading = false
              })
            }
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .setting-payment-wrap{

  }
</style>

<style lang="less">
  .setting-payment-wrap {
    .el-radio-group {
      margin-right: 30px;
    }
    .el-input{
      width: 200px;
      padding: 0 10px;
    }
    .el-form {
      .el-form-item__error {
        left: 10px;
      }
      .first-form-item {
        .el-form-item__error {
          left: 200px;
          top: 100%;
        }
      }
      /*    border: 1px solid #eff2f6;
          border-bottom: 0;*/

      /*    .el-form-item {
            border-bottom: 1px solid #eff2f6;
            margin-bottom: 0;

            .el-form-item__label {
              font-size: 14px;
              border-right: 1px solid #eef1f5;
              padding: 15px 30px 15px 0;
              background: #f8f8f8;
            }
            .el-form-item__content {
              padding: 15px 0 0 30px;
              .el-form-item__error {
                left: 275px;
                top: 75%;
              }
              !*&:first-child(el-form-item__error){
                left: 400px;
              }*!
            }
          }
          .first-form-item{
            .el-form-item__label {
              line-height: 100px;
            }
            .el-form-item__content{
              padding-top: 22px;
            }
          }*/
      .el-form-item {
        margin-bottom: 0;
      }
      .el-checkbox+.el-checkbox{
        margin-left: 0px;
      }
      .el-checkbox{
        margin: 0 30px 5px 0;
      }
    }
    .ml-20{
      margin-left: 20px;
    }
    .mb-20{
      margin-bottom: 20px;
    }
    .ml-80{
      margin-left: 80px;
    }
    .mt-10{
      margin-top: 10px;
    }
    .td-title{
      background: #f8f8f8;
    }
    .td-padding{
      font-size: 14px;
      padding: 20px 10px;
      border-bottom: 1px solid #dcdfe6;
      border-left: 1px solid #dcdfe6;
    }
    .td-title{
      width:140px;
      text-align: center;
    }
    .td-bg{
      background: #EEF1F9;
    }
    table {
      border: 1px solid #dcdfe6;
      border-left: none;
      border-bottom: none;
      width: 100%;
      margin: 0;
      tr{
        height: 81px;
      }
    }
    .flex1{
      flex: 1;
    }
    .color-999{
      color: #999999;
      font-size: 14px;
    }
  }
</style>
