<!-- 专区分佣管理 -->
<template>
  <common-tpl class="commission-index-wrap" footer>
    <template slot="header" class="search-wrap">
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-form :model="otherData" label-width="200px" ref="otherData">
        <gray-title title="收益测算" class="" style="background: #c1e0ff;"></gray-title>
        <section>
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td class="td-title">毛利润</td>
              <td class="td-title">运营成本</td>
              <td class="td-title">税收</td>
              <td class="td-title">直接分佣</td>
              <td class="td-title">间接分佣</td>
              <td class="td-title">盈利状况</td>
            </tr>
            <tr>
              <td>
                <el-form-item label="" prop="lirun" label-width="0" :rules="lirun">
                  <el-input v-model="otherData.lirun" @change="profitChange" maxLength="6" placeholder="限数字，6个字符" size="small" style="width: 100%;"></el-input>
                </el-form-item>
              </td>
              <td><span >{{otherData.chengben}}</span></td>
              <td><span >{{otherData.shuisou}}</span></td>
              <td><span >{{otherData.zhijie}}</span></td>
              <td><span >{{otherData.jianjie}}</span></td>
              <td><span >{{otherData.yingli}}</span></td>
            </tr>
          </table>
        </section>
      </el-form>
      <el-form :model="formData" label-width="200px" ref="formData" :rules="rules">
        <gray-title title="成本扣除" class="mb-20 mt-20"></gray-title>
        <el-form-item label="运营成本率：" prop="operateCostRate">
          <el-input v-model="formData.operateCostRate" placeholder="0-30数字，允许精确到百分位" maxLength="5" @change="operateCostRateChange"></el-input>
          <span class="mh-10">%</span>
          <span class="color-999">运营成本 = 毛利润（成交价-进货价）X 运营成本率</span>
        </el-form-item>
        <el-form-item label="税率：" prop="taxRate">
          <el-input v-model="formData.taxRate" placeholder="0-30数字，允许精确到百分位" maxLength="5" @change="taxRateChange"></el-input>
          <span class="mh-10">%</span>
          <span class="color-999">商品税收 = 毛利润（成交价-进货价）X 税率</span>
        </el-form-item>
        <gray-title title="成本扣除" class="mb-20"></gray-title>
        <el-form-item label="直接推荐分佣率：">
          <div class="flex">
            <el-checkbox v-model="formData.directFlag" class="mh-10" @change="zhijieCheckChange"></el-checkbox>
            <el-form-item label="" prop="directCommissionRate" class="" label-width="0" :rules="formData.directFlag ? rules.directCommissionRate : rules.directCommissionRate2">
              <el-input v-model="formData.directCommissionRate" placeholder="0-50数字，允许精确到百分位" maxLength="5" @change="zhijieChange"></el-input>
            </el-form-item>
            <span class="mh-10">%</span>
            <span class="color-999">直接推荐奖（通用积分） = 净利润（毛利润-运营成本-税）X 直接推荐分佣率</span>
          </div>
        </el-form-item>
        <el-form-item label="" class="" label-width="0">
          <div class="flex" style="margin-left: 67px;">
            <span class="mh-10">间接推荐分佣率：</span>
            <el-checkbox v-model="formData.indirectFlag" class="mh-10" @change="jianjieCheckChange"></el-checkbox>
            <el-form-item label="" prop="indirectCommissionRate" class="" label-width="0" :rules="formData.indirectFlag ? rules.indirectCommissionRate : rules.indirectCommissionRate2">
              <el-input v-model="formData.indirectCommissionRate" placeholder="0-60数字，允许精确到百分位" maxLength="5" @change=""></el-input>
            </el-form-item>
            <span class="mh-10">%</span>
            <span class="mh-10">间接级数：</span>
            <el-form-item label="" prop="indirectCount" class="" label-width="0" :rules="formData.indirectFlag ? rules.indirectCount : rules.indirectCount2">
              <el-input v-model="formData.indirectCount" placeholder="0-10正整数" maxLength="2" @change="" style="width: 110px;"></el-input>
            </el-form-item>
            <span class="mh-10">级</span>
            <div class="flex1 color-999" style="">
              <span>间接推荐奖 = 直接推荐奖 X 间接推荐分佣率 ^ 间接级数 / 2 ( <span style="color: red;">送消费积分和通用积分</span> )</span>
              <!--   <span>间接推荐奖 （通用积分）= 直接推荐奖X 间接推荐分佣率 ^ 间接级数</span>-->
            </div>
          </div>
        </el-form-item>
        <gray-title title="参与分佣区域" class="mb-20"></gray-title>
        <el-form-item label="选择参与专区：" prop="distributeArea">
          <el-checkbox-group v-model="formData.distributeArea"  class="" @change="" >
            <el-checkbox v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
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
      // ...
      let validateNumber = (rule, value, callback) => {
        if (value === '') return callback(new Error('不能为空'))
        if (value && (value < 0 || value > 10 || !value.toString().match(/^\d+$/gi))) return callback(new Error('请输入0-10正整数'))
        callback()
      }

      let validateNumberr = (rule, value, callback) => {
        //  if (value === '') return callback(new Error('不能为空'))   未勾选
        if (value && (value < 0 || value > 10 || !value.toString().match(/^\d+$/gi))) return callback(new Error('请输入0-10正整数'))
        callback()
      }

      let validateNumber1 = (rule, value, callback) => {
        // if (value === '') return callback(new Error('不能为空'))   未勾选
        if (value && (value < 0 || value > 30 || !value.toString().match(/^\d+(\.\d{0,2})?$/gi))) return callback(new Error('0-30数字，允许输入百分位'))
        callback()
      }

      let validateNumber2 = (rule, value, callback) => {
        if (value === '') return callback(new Error('不能为空'))
        if (value && (value < 0 || value > 50 || !value.toString().match(/^\d+(\.\d{0,2})?$/gi))) return callback(new Error('0-50数字，允许输入百分位'))
        callback()
      }

      let validateNumber22 = (rule, value, callback) => {
        //  if (value === '') return callback(new Error('不能为空'))    未勾选
        if (value && (value < 0 || value > 50 || !value.toString().match(/^\d+(\.\d{0,2})?$/gi))) return callback(new Error('0-50数字，允许输入百分位'))
        callback()
      }

      let validateNumber3 = (rule, value, callback) => {
        if (value === '') return callback(new Error('不能为空'))
        if (value && (value < 0 || value > 60 || !value.toString().match(/^\d+(\.\d{0,2})?$/gi))) return callback(new Error('0-60数字，允许输入百分位'))
        callback()
      }
      let validateNumber33 = (rule, value, callback) => {
        //  if (value === '') return callback(new Error('不能为空'))  未勾选
        if (value && (value < 0 || value > 60 || !value.toString().match(/^\d+(\.\d{0,2})?$/gi))) return callback(new Error('0-60数字，允许输入百分位'))
        callback()
      }

      let validateProfit = (rule, value, callback) => {
        //  if (value === '') return callback(new Error('不能为空'))
        if (value && (value < 0 || value > 999999 || !value.toString().match(/^\d+(\.\d{0,2})?$/gi))) return callback(new Error('限数字，6个字符'))
        callback()
      }

      return {
        loading: false,
        confirmLoading: false,
        formData: {
          directFlag: 1,
          indirectFlag: 1,
          operateCostRate: '',       // 运营成本率
          taxRate: '',
          directCommissionRate: '',
          indirectCommissionRate: '',
          indirectCount: '',
          distributeArea: ''         // 选择的专区
        },
        otherData: {
          lirun: 100,
          chengben: '',      // 运营成本
          shuisou: '',
          zhijie: '',
          jianjie: '',
          yingli: ''
        },
        options: [{
          value: '4',
          label: '消费积分区'
        }, {
          value: '5',
          label: '联盟积分区'
        }, {
          value: '3',
          label: '芯豆区'
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
        rules: {
          operateCostRate: { validator: validateNumber1, trigger: 'blur' },
          taxRate: {validator: validateNumber1, trigger: 'blur'},
          directCommissionRate: { validator: validateNumber2, trigger: 'blur' },
          indirectCommissionRate: { validator: validateNumber3, trigger: 'blur' },
          indirectCount: { validator: validateNumber, trigger: 'blur' },
          directCommissionRate2: { validator: validateNumber22, trigger: 'blur' },
          indirectCommissionRate2: { validator: validateNumber33, trigger: 'blur' },
          indirectCount2: { validator: validateNumberr, trigger: 'blur' }
        },
        lirun: { validator: validateProfit, trigger: 'blur' },
        copyFormData: {},             // 拷贝
        userInfo: {}                  // 用户信息
      }
    },

    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData('/admin/finance/commission/index', (res) => {
        this.formData = res
      })
      this.getListData()
    },

    methods: {
      /**
       * 获取列表数据
       * @param  {[type]} type [数据类型，type存在表示获取导出数据]
       */
      getListData (type) {
        this.$http.post('@ROOT_API/buyThemeCommissionRuleController/getBuyThemeCommissionRule').then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          let data = resData.data
          if (data.operateCostRate) data.operateCostRate = data.operateCostRate * 100
          if (data.taxRate) data.taxRate = data.taxRate * 100
          if (data.directCommissionRate) data.directCommissionRate = data.directCommissionRate * 100
          if (data.indirectCommissionRate) data.indirectCommissionRate = data.indirectCommissionRate * 100
          this.formData = data
          if (data.directFlag === 1) {
            this.formData.directFlag = true
          } else {
            this.formData.directFlag = false
          }

          if (data.indirectFlag === 1) {
            this.formData.indirectFlag = true
          } else {
            this.formData.indirectFlag = false
          }
          // this.formData.directFlag = resData.data.directFlag === 1 ? 'true' : false
          // this.formData.indirectFlag = resData.data.indirectFlag === 1 ? 'true' : false
          this.formData.distributeArea = this.formData.distributeArea.length === 0 ? [] : this.formData.distributeArea.split(',')
          this.profitChange()
        }).finally(() => {
          this.loading = false
        })
      },
      /**
       * 利润改变
       */
      profitChange (val) {
        if (this.otherData.lirun) {
          this.otherData.chengben = this.formData.operateCostRate ? this.otherData.lirun * (this.formData.operateCostRate * 0.01) : 0
          this.otherData.shuisou = this.formData.taxRate ? this.otherData.lirun * (this.formData.taxRate * 0.01) : 0
          this.otherData.chengben = (parseFloat(this.otherData.chengben)).toFixed(2)
          this.otherData.shuisou = (parseFloat(this.otherData.shuisou)).toFixed(2)
          this.zhijieChange()
          this.jianjieCal()
          this.yingliCal()
        } else {
          this.otherData.chengben = 0
          this.otherData.shuisou = 0
          this.otherData.zhijie = 0
          this.otherData.jianjie = 0
          this.otherData.yingli = 0
        }
      },
      /**
       * 运营成本率改变
       */
      operateCostRateChange (val) {
        if (val) {
          this.otherData.chengben = this.otherData.lirun ? val * (this.otherData.lirun * 0.01) : 0
          this.otherData.chengben = (parseFloat(this.otherData.chengben)).toFixed(2)
        } else {
          this.otherData.chengben = 0
        }
        this.yingliCal()
      },
      /**
       * 税率改变
       */
      taxRateChange (val) {
        if (val) {
          this.otherData.shuisou = this.otherData.lirun ? val * (this.otherData.lirun * 0.01) : 0
          this.otherData.shuisou = (parseFloat(this.otherData.shuisou)).toFixed(2)
        } else {
          this.otherData.shuisou = 0
        }
        this.yingliCal()
      },
      /**
       * 直接分佣率改变
       */
      zhijieChange (val) {
        if (this.formData.directCommissionRate && this.formData.directFlag) {
          this.otherData.zhijie = this.otherData.lirun ? (this.formData.directCommissionRate * 0.01) * (this.otherData.lirun - this.otherData.shuisou - this.otherData.chengben) : 0
          this.otherData.zhijie = (parseFloat(this.otherData.zhijie)).toFixed(2)
        } else {
          this.otherData.zhijie = 0
        }
        this.jianjieCal()
        this.yingliCal()
      },
      /**
       * 间接分佣率改变
       */
      jianjieChange (val) {
        this.jianjieCal()
        this.yingliCal()
      },
      /**
       * 间接级数改变
       */
      indirectCountChange (val) {
        this.jianjieCal()
        this.yingliCal()
      },
      /**
       * 直接选择改变
       */
      zhijieCheckChange (val) {
        this.zhijieChange()
        this.jianjieCal()
        this.yingliCal()
      },
      /**
       * 间接选择改变
       */
      jianjieCheckChange (val) {
        this.jianjieCal()
        this.yingliCal()
      },
      /**
       * 间接佣金计算
       */
      jianjieCal () {
        this.otherData.jianjie = 0
        if (this.otherData.lirun && this.formData.directFlag && this.formData.indirectFlag && this.formData.directCommissionRate && this.formData.indirectCommissionRate && this.formData.indirectCount > 0 && this.otherData.zhijie) {
          // ..
          for (var i = 0; i < this.formData.indirectCount; i++) {
            this.otherData.jianjie += this.otherData.zhijie * (Math.pow((this.formData.indirectCommissionRate * 0.01), i + 1))
            // console.log(i)
            // console.log(this.otherData.zhijie * Math.pow((this.formData.indirectCommissionRate * 0.01), i + 1))
          }
          let jianjie = (parseFloat(this.otherData.jianjie)).toFixed(2)
          this.$set(this.otherData, 'jianjie', jianjie)
          console.log(jianjie)
          this.yingliCal()
        } else {
          this.otherData.jianjie = 0
        }
      },
      /**
       * 盈利计算
       */
      yingliCal (val) {
        this.otherData.yingli = 0
        if (this.otherData.lirun) {
          this.otherData.yingli = this.otherData.lirun - this.otherData.chengben - this.otherData.shuisou - this.otherData.zhijie - this.otherData.jianjie
          this.otherData.yingli = (parseFloat(this.otherData.yingli)).toFixed(2)
        } else {
          this.otherData.yingli = 0
        }
      },
      /**
       * 提交表单
       */
      submitFormData (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // ...
            let data = JSON.parse(JSON.stringify(this.formData))
            data.distributeArea = data.distributeArea.length === 0 ? '' : data.distributeArea.join()
            data.directFlag = data.directFlag === true ? 1 : 0
            data.indirectFlag = data.indirectFlag === true ? 1 : 0
            if (data.operateCostRate === '') {
              data.operateCostRate = 0
            } else {
              data.operateCostRate = data.operateCostRate * 0.01
            }
            if (data.taxRate === '') {
              data.taxRate = 0
            } else {
              data.taxRate = data.taxRate * 0.01
            }
            if (data.directCommissionRate === '') {
              data.directCommissionRate = 0
            } else {
              data.directCommissionRate = data.directCommissionRate * 0.01
            }
            if (data.indirectCommissionRate === '') {
              data.indirectCommissionRate = 0
            } else {
              data.indirectCommissionRate = data.indirectCommissionRate * 0.01
            }
            if (data.indirectCount === '') data.indirectCount = 0
            // data.distributeArea = ''
            this.$http.post('@ROOT_API/buyThemeCommissionRuleController/updateThemeCommissionRule', data).then(res => {
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
              this.getListData()
            }).finally(() => {
              // this.confirmLoading = false
            })
          } else {
            return false
          }
        })
      }
    },
    watch: {
      'formData.indirectCommissionRate': {
        handler (val) {
          this.jianjieCal()
          this.yingliCal()
        }
      },
      'formData.indirectCount': {
        handler (val) {
          this.jianjieCal()
          this.yingliCal()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .commission-index-wrap {
    .el-input{
      width: 220px;
    }
    .mh-10{
      margin: 0 10px
    }
    .mb-20{
      margin-bottom: 20px;
    }
    .mt-20{
      margin-top: 20px;
    }
    .ml-20{
      margin-left: 20px;
    }
    .ml-10{
      margin-left: 10px;
    }
    .align-center{
      text-align: center;
    }
    .td-title{
      width:140px;
      background: #c1e0ff;
      text-align: center;
    }
    section{
      background: #c1e0ff;
      padding: 10px 20px 20px 20px;
    }
    table {
      border-top: 1px solid #56ade8;
      border-right: 1px solid #56ade8;
      width: 90%;
      /* margin: 0 0 20px 40px;*/
      tr{
        height: 40px;
        padding: 1px 1px 0 0 ;
      }
      td{
        margin: 0;
        background: white;
        line-height: 40px;
        text-align: center;
        border-bottom: 1px solid #56ade8;
        border-left: 1px solid #56ade8;
      }
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .color-999{
      color: #999999;
      font-size: 14px;
    }
    .flex{
      display: flex;
    }
    .flex1{
      flex: 1;
    }
  }
</style>

<style lang="less">
  .commission-index-wrap {
    .el-checkbox+.el-checkbox{
      margin-left: 0px;
    }
    .el-checkbox{
      margin: 0 30px 5px 0;
    }
  }
</style>
