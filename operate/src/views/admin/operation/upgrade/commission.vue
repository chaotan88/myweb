<!-- 分佣设置 -->
<template>
  <common-tpl class="commission-data-wrap" footer>

    <!--  -->
    <template slot="main">
      <el-form :model="formData" ref="formData" label-width="180px">
        <el-form-item label="套餐收益比例：" prop="advocateProfitRate" :rules="publicRules">
          <el-row type="flex">
            <el-input v-model="formData.advocateProfitRate" style="width: 140px;"></el-input>
            <span style="margin:0 10px;">%</span>
            <span style="color: #ccc;">推荐用户购买套餐后上级获得的收益，套餐收益=套餐金额 X 套餐收益比例</span>
          </el-row>
        </el-form-item>
        <el-form-item label="绿宝收益比列：" prop="greenGemstoneRate" :rules="publicRules">
          <el-row type="flex">
            <el-input v-model="formData.greenGemstoneRate" style="width: 140px;"></el-input>
            <span style="margin: 0 10px">%</span>
            <span style="color: #ccc;">用户购买套餐获得的绿宝，绿宝收益=套餐金额 X 绿宝收益比例</span>
          </el-row>
        </el-form-item>
        <el-form-item label="代言协议：" prop="themePresent" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
          <editor v-model="formData.themePresent" @change="editorChanget" img-icon = 'none'></editor>
        </el-form-item>
      </el-form>
    </template>
    <template slot="other">
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" :loading="loading" @click="submitFormData('formData')">确 定</el-button>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    let validateInt = (rule, value, callback) => {
      if (!value && value !== 0) return callback(new Error('不能为空'))
      if (value && (isNaN(value) || value < 0 || value > 100 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制0~100正整数'))
      callback()
    }
    return {
      loading: false,  // loading
      formData: {
        themePresent: '',              // ..
        greenGemstoneRate: '',
        advocateProfitRate: ''
      },
      publicRules: [{required: true, validator: validateInt, trigger: 'blur'}],   // ..
      details: {},      // 详情数据
      userInfo: {}      // 用户信息
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    // 判断是否同一模块，带出搜索记录
    this.getDetails()
  },
  methods: {
    /**
     * 配置详情
     */
    getDetails () {
      this.$http.get('@ROOT_API/shareTheme/getBasicSetting?themeType=11').then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        if (!resData.data) return false
        this.formData = resData.data
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 提交内容配置
     */
    submitFormData (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.loading = true
        this.$http.post('@ROOT_API/shareTheme/updateBasicSetting', this.formData).then((res) => {
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
          this.getDetails()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    /**
     * 编辑器内容改变
     */
    editorChanget (value) {
      this.formData.themePresent = value
    }
  }
}
</script>

<style lang="less" scoped>
.commission-data-wrap{


}
</style>
<style lang="less">
.commission-data-wrap{
.el-input{
  width: 400px;
}

.theme-name{
  .el-form-item__error{
    left: 90px;
  }
}
}
</style>
