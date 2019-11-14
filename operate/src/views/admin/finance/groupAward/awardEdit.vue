<!-- 专区分佣管理 - 分享分佣 - 编辑 -->
<template>
  <common-tpl class="finance-group-edit-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">

        <el-form :model="formData" :rules="rules" ref="formData" label-width="220px" class="demo-formData">

          <!-- 编辑等级 -->
          <div class="mb-20">
            <gray-title class="mb-20" title="编辑会员等级"></gray-title>
            <el-form-item label="级别名称：" prop="rankName">
              <el-input v-model="formData.rankName" placeholder="0-20个字符" maxlength="20"></el-input>
            </el-form-item>
          </div>

          <!-- 升级条件 -->
          <div class="mb-20">
            <gray-title class="mb-20" title="升级条件"></gray-title>
            <el-form-item label="拼团次数：" prop="groupNum">
              <el-row type="flex">
                <el-input v-model="formData.groupNum" placeholder="请输入0-1000000000整数" maxlength="10"></el-input><span class="ml-10">次</span>
                <el-form-item label="单团人数" prop="groupSingleNum" label-width="100px">
                  <el-input v-model.number="formData.groupSingleNum" placeholder="请输入0-1000000000整数" maxlength="10"></el-input><span class="ml-10">人</span>
                </el-form-item>
              </el-row>
            </el-form-item>
            <el-form-item label="粉丝数：" prop="fanNum">
              <el-input v-model="formData.fanNum" placeholder="请输入0-1000000000整数" maxlength="10"></el-input><span class="ml-10">个</span>
            </el-form-item>
            <el-form-item label="代理费：" prop="agentFees">
              <el-input v-model="formData.agentFees" placeholder="请输入0-1000000000整数" maxlength="10"></el-input><span class="ml-10">元</span>
            </el-form-item>
          </div>

          <!-- 拼团奖励 -->
          <div class="mb-20">
            <gray-title class="mb-20" title="拼团奖励"></gray-title>
            <el-form-item label="拼团权益：" prop="groupProfitRate">
              <el-input v-model="formData.groupProfitRate" placeholder="0-100的数字,允许精确到百分位"  maxlength="6"></el-input><span class="ml-10">%</span><span class="ml-10 color-999">注：发起拼团后，参与拼团会员的产生的商品纯利润按拼团权益百分比分给上级直推会员的奖励</span>
            </el-form-item>
            <el-form-item label="团推推：" prop="groupRecommendProfitRate">
              <el-input v-model="formData.groupRecommendProfitRate" placeholder="0-100的数字,允许精确到百分位"  maxlength="6"></el-input><span class="ml-10">%</span><span class="ml-10 color-999">注：直推奖，直推会员周期内拼团收益的百分点奖励给上级会员</span>
            </el-form-item>
             <el-form-item label="允许参与买卖仓次数/每期：" prop="grabNumEachIssue">
              <el-input v-model="formData.grabNumEachIssue" placeholder="请输入0-1000000000整数" maxlength="10"></el-input>
            </el-form-item>
          </div>


          <!-- 团队分佣 -->
          <div class="mb-20">
            <gray-title class="mb-20" title="团队分佣"></gray-title>
            <div class="award">
              <!-- <h2 class="fw-n recommend">推荐分佣：</h2> -->
              <el-form-item label="拼团分红：" prop="groupWeightProfitRate">
                <el-input v-model="formData.groupWeightProfitRate" placeholder="0-100的数字,允许精确到百分位"  maxlength="6"></el-input><span class="ml-10">%</span><span class="ml-10 color-999">注：除买卖仓及超级特惠专区以为所有区域产品净额的1%加权分红</span>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">提交</el-button>
    </template>

  </common-tpl>
</template>

<script>
  export default {
    data () {
      // 验证20个字符,限正整数
      let validateNumber = (rule, value, callback) => {
        if (value === '' || value === null) return callback(new Error('不能为空'))
        let reg = /^\d+$/gi
        if (value && (value < 0 || value > 1000000000 || !value.toString().match(reg))) return callback(new Error('请输入0-1000000000整数'))
        callback()
      }

      // 验证10个字符,限正整数 可为空
      let validateNumberWithVoid = (rule, value, callback) => {
        let reg = /^\d+$/gi
        if (value && (value < 0 || value > 1000000000 || !value.toString().match(reg))) return callback(new Error('请输入0-1000000000整数'))
        callback()
      }

      // 验证0-10正整数
    //  let validateSix = (rule, value, callback) => {
    //    if (value === '' || value === null) return callback(new Error('不能为空'))
    //    let reg = /^[0-9]\d{0,10}$/gi
    //    if ((value && parseFloat(value) > 10) || (value && !value.toString().match(reg))) return callback(new Error('请输入10以内的正整数'))
    //    callback()
    //  }

   //  // 验证0-20正整数
   //   let validateTwenty = (rule, value, callback) => {
   //     if (value === '' || value === null) return callback(new Error('不能为空'))
   //     let reg = /^\d+$/gi
   //     if (value && (value < 0 || value > 10000000000000000000 || !value.toString().match(reg))) return callback(new Error('20个字符，大于等于0的数字'))
   //     callback()
   //   }

      // 验证100以内的正确的分佣比例比例
      let validatePercent = (rule, value, callback) => {
        if (value === '' || value === null) return callback(new Error('不能为空'))
        let reg = /^\d+(\.\d{0,2})?$/gi
        if ((value && parseFloat(value) > 100) || (value && !value.toString().match(reg))) return callback(new Error('请输入100以内的正确数值，只保留两位小数'))
        callback()
      }

      return {
        confirmLoading: false,    // 确定loading
        formData: {
          // 基本信息
          rankName: '',                   // 级别名称
          fanNum: '',                     // 粉丝数
          agentFees: '',                  // 代理费
          groupProfitRate: '',            // 拼团权益
          groupNum: '',                   // 拼团次数
          groupSingleNum: '',             // 单团人数
          groupWeightProfitRate: '',      // 拼团分红
          grabNumEachIssue: '',           // 允许参与买卖仓次数/每期
          groupRecommendProfitRate: ''    // 团推推
        },
        rules: {

          // 级别名称
          rankName: [{ required: true, message: '请输入级别名称', trigger: 'blur' }],

          // 。。
          fanNum: [{ required: false, validator: validateNumberWithVoid, trigger: 'blur' }],
          // 。。
          groupSingleNum: [{ required: true, validator: validateNumber, trigger: 'blur' }],
          // 。。
          groupNum: [{ required: true, validator: validateNumber, trigger: 'blur' }],

          // 。。
          agentFees: [{ required: false, validator: validateNumberWithVoid, trigger: 'blur' }],

          // 。。
          groupProfitRate: [{ required: true, validator: validatePercent, trigger: 'blur' }],

          // 。。
          grabNumEachIssue: [{ required: true, validator: validateNumber, trigger: 'blur' }],

          // 。。
          groupWeightProfitRate: [{ required: true, validator: validatePercent, trigger: 'blur' }],

          // 。。
          groupRecommendProfitRate: [{ required: true, validator: validatePercent, trigger: 'blur' }]
        }
      }
    },

    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.formData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'RowDetails'))
    },
    methods: {
      /**
       * 提交
       */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          this.confirmLoading = true
          this.$http.post('@ROOT_API/buyGroupCommissionSetController/updateGroupRankSet', {
            id: this.formData.id,
            rankName: this.formData.rankName,                   // 级别名称
            fanNum: !this.formData.fanNum ? 0 : parseInt(this.formData.fanNum),                     // 粉丝数
            agentFees: !this.formData.agentFees ? 0 : parseInt(this.formData.agentFees),                  // 代理费
            groupProfitRate: parseFloat(this.formData.groupProfitRate),            // 拼团权益
            groupNum: parseInt(this.formData.groupNum),                   // 拼团次数
            groupSingleNum: parseInt(this.formData.groupSingleNum),             // 单团人数
            groupWeightProfitRate: parseFloat(this.formData.groupWeightProfitRate),      // 拼团分红
            grabNumEachIssue: parseInt(this.formData.grabNumEachIssue),           // 允许参与买卖仓次数/每期
            groupRecommendProfitRate: parseFloat(this.formData.groupRecommendProfitRate)    // 团推推
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
              this.$router.push('/admin/finance/commission/groupAward/index')
            }, 300)
          }).finally(() => {
            setTimeout(() => {
              this.confirmLoading = false
            }, 500)
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .finance-group-edit-wrap{
    .mb-20{
      margin-bottom: 20px;
    }
    .ml-10{
      margin-left: 10px ;
    }
    .color-999{
      color: #999999;
    }
    .el-input{
      width: 320px;
    }

  }
</style>
<style lang="less">
  .finance-group-edit-wrap{

  }
</style>
