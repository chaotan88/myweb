<!-- 结算设置 -->
<template>
  <common-tpl class="business-set-wrap" :footer="true">
    <template slot="main">
      <gray-title title="店补结算设置"></gray-title>
      <!--<div class="relation pos-r">-->
      <el-form ref="lelForm" :model="levelFormData" :rules="rules" label-width="140px" class="level-form-box">
        <el-form-item label="参与结算等级 :">
          <template>
            <el-checkbox-group v-model="levelFormData.disRuleIds">
              <template v-for="item in levelData">
                <el-checkbox :label="item.id">{{item.ruleName}}</el-checkbox>
              </template>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="分配比例 :" prop="disRate">
          <template>
            <el-input placeholder="保留两位小数" size="mini" v-model="levelFormData.disRate" @blur="inpBlur('disRate')"></el-input>
            <div class="pos-a percent-text">
              <span>%</span>
              <span>注：店补=平台当月产生的总积分（消费积分+通用积分）X 分配比例 / 选中用户当前等级个数</span>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div class="level-form-box">
        <dl>
          <dt>结算方式 :</dt>
          <dd class="pos-r">
            <el-button disabled size="mini">按月结算</el-button>
            <div class="pos-a settle-text">
              <span>注：每月1号零时根据选择用户，产生结算结果</span>
            </div>
          </dd>
        </dl>
      </div>
    </template>

    <template slot="footer">
      <!-- <el-button type="primary" @click="onSubmit('form')">保存</el-button> -->
      <el-button type="primary" @click="settleSave('lelForm')">保存</el-button>
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
        levelFormData: {
          disRuleIds: [],
          disRate: null
        },
        setData: {},                  // 设置数据
        isChecked: false,
        resultsId: {},              // id
        rules: {
          disRate: [{required: true, validator: validatePoundage, trigger: 'blur'}]
        }
      }
    },

    mounted () {
      this.getLevelList()
      this.getSettleData()
    },

    methods: {
      /**
       * 获取等级
       */
      getLevelList () {
        this.$http.post('@ROOT_API/profitController/getRuleList', {}).then((res) => {
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
          this.levelData = results
        })
      },

      /**
       * 获取结算数据
       */
      getSettleData () {
        this.$http.post('@ROOT_API/profitController/getShopSubsidySet', {}).then((res) => {
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
          this.levelFormData.disRate = results.disRate
          results.disRuleIds.split(',').map(item => {
            this.levelFormData.disRuleIds.push(parseInt(item))
          })
          this.resultsId = results.id
          console.log('resultsData: ', this.resultsId)
          this.inpBlur('disRate')
        })
      },

      /**
       * 自动补全两位小数
       */
      inpBlur (obj) {
        this.$Utils.blurAutoCompletion(this.levelFormData, obj)
      },

      /**
       * 提交结算店补设置
       */
      settleSave (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          this.$http.post('@ROOT_API/profitController/addOrUpdateShopSubsidySet', {
            disRuleIds: this.levelFormData.disRuleIds.join(','),
            disRate: this.levelFormData.disRate,
            id: this.resultsId
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
