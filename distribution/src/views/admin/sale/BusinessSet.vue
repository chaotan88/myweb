<!-- 结算设置 -->
<template>
  <common-tpl class="business-set-wrap" :footer="true">
    <template slot="main">
      <gray-title title="结算周期设置"></gray-title>
      <el-form ref="form" :model="formData" :rules="rules" label-width="140px" class="settle-data">
        <el-form-item label="推荐反佣：">
          <el-select v-model="formData.recommend">
            <el-option label="实时" :value="1"></el-option>
            <el-option label="3天" :value="2"></el-option>
            <el-option label="7天" :value="3"></el-option>
            <el-option label="15天" :value="4"></el-option>
            <el-option label="一个月" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="全球加权分红比例核算周期：">
         <el-select v-model="formData.cycle">
           <el-option label="3天" :value="1"></el-option>
           <el-option label="7天" :value="2"></el-option>
           <el-option label="15天" :value="3"></el-option>
           <el-option label="一个月" :value="4"></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="办公场地补贴比例：">
         <el-select v-model="formData.subsidy">
           <el-option label="3天" :value="1"></el-option>
           <el-option label="7天" :value="2"></el-option>
           <el-option label="15天" :value="3"></el-option>
           <el-option label="一个月" :value="4"></el-option>
         </el-select>
       </el-form-item>-->
        <el-form-item label="商品收益：">
          <el-select v-model="formData.profit">
            <el-option label="3天" :value="1"></el-option>
            <el-option label="7天" :value="2"></el-option>
            <el-option label="15天" :value="3"></el-option>
            <el-option label="一个月" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="通用积分大于多少可提现：" v-model="formData.putforward">
          <el-select v-model="formData.putforward">
            <el-option label="100个" :value="1"></el-option>
            <el-option label="1000个" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提现手续费：" prop="poundage">
         <el-input placeholder="保留两位小数" v-model="formData.poundage" @blur="inpBlur('poundage')"></el-input> %
        </el-form-item>-->
      </el-form>
    </template>

    <template slot="footer">
      <el-button type="primary" @click="onSubmit('form')">保存</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      let validatePoundage = (rule, value, callback) => {
        if (!value) return callback(new Error('提现手续费不能为空'))
        if (!value.toString().match(/^\d+\.\d{2}$/)) return callback(new Error('提现手续费格式不正确'))
        callback()
      }

      return {
        levelData: [],
        setData: {},                  // 设置数据
        formData: {
          id: '',                     // id
          recommend: 1,               // 推荐反佣
          cycle: 1,                   // 全球加权分红比例核算周期
          subsidy: 1,                 // 办公场地补贴比例
          profit: 1,                  // 商品收益
          putforward: '',             // 通用积分大于多少可提现
          poundage: ''                // 提现手续费
        },
        rules: {
          poundage: [{required: true, validator: validatePoundage, trigger: 'blur'}]
        }
      }
    },

    mounted () {
      this.getSetData()
    },

    methods: {
      /**
       * 获取设置数据
       */
      getSetData () {
        this.$http.post('@ROOT_API/settleSetManageController/getSettleSet', {}).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          let results = resData.data
          this.formData.id = results.id
          this.formData.recommend = results.recommendBackPeriod
          this.formData.cycle = results.globalWeightPeriod
          this.formData.subsidy = results.officeSubsidyPeriod
          this.formData.profit = results.goodsProfitPeriod
          this.formData.putforward = results.cashPointsLimit
          this.formData.poundage = results.withdrawalFees
          this.inpBlur('poundage')
        })
      },

      /**
       * 自动补全两位小数
       */
      inpBlur (obj) {
        this.$Utils.blurAutoCompletion(this.formData, obj)
      },

      /**
       * 提交结算周期设置
       */
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          this.$http.post('@ROOT_API/settleSetManageController/addOrUpdateSettleSet', {
            id: this.formData.id,                            // 否 int 修改时必填
            recommendBackPeriod: this.formData.recommend,    // 是 int 推荐返佣周期 1：实时 2：3天 3：7天 4：15天 5：一个月
            globalWeightPeriod: this.formData.cycle,         // 是 int 全球加权分红周期 1：3天 2：7天 3：15天 4：一个月
            officeSubsidyPeriod: this.formData.subsidy,      // 是 int 办公场地补贴周期 1：3天 2：7天 3：15天 4：一个月
            goodsProfitPeriod: this.formData.profit,         // 是 int 商品收益周期 1：3天 2：7天 3：15天 4：一个月
            cashPointsLimit: this.formData.putforward,       // 是 int 通用积分大于多少可提现 1：大于100 2：大于1000
            withdrawalFees: this.formData.poundage           // 是 bigdecimal  提现手续费
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
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .business-set-wrap{
    .settle-data{
      .el-select, .el-input{
        width: 100%;
      }
    }

    .level-form-box{

      .el-input{
        width: 110px;
      }
      .percent-text{
        top: 4px;
        left: 120px;
        span:last-child{
          padding-left: 20px;
          color: #f39817;
        }
      }
      dl{
        padding-top: 20px;
        font-size: 14px;
        dt{
          width: 124px;
          text-align: right;
          display: inline-block;
          margin-right: 14px;
        }
        dd{
          width: 80%;
          display: inline-block;
          .el-button{
            width: 110px;
          }
          .settle-text{
            top: 4px;
            left: 155px;
            span:last-child{
              color: #f39817;
            }
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .business-set-wrap{
    .settle-data{
      .el-form-item{
        /*display: inline-block;*/
        width: 40%;
      }
    }
  }
</style>
