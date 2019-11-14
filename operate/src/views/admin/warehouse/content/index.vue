<!-- 内容配置 -->
<template>
  <common-tpl class="content-data-wrap" footer>

    <!--  -->
    <template slot="main">
      <el-form :model="formData" ref="formData" label-position="right">
        <el-form-item label="主题名称：" prop="themeName" :rules="[{required: true, message: '不能为空', trigger: 'change'}]" class="theme-name">
          <el-input v-model="formData.themeName" placeholder='限50个字符' maxLength="50"></el-input>
        </el-form-item>
        <el-form-item label="收益说明：" prop="purchaseDes" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
          <el-row></el-row>
          <editor v-model="formData.purchaseDes" @change="editorChange"></editor>
        </el-form-item>
        <el-form-item label="店铺条款：" prop="agreement" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
          <editor v-model="formData.agreement" @change="editorChanget"></editor>
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
    return {
      loading: false,  // loading
      formData: {
        id: '',         // 主题id
        themeName: '',  // 主题名称
        purchaseDes: '', // 收益说明
        agreement: ''   // 店铺条款
      },
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
      this.$http.get('@ROOT_API/shareTheme/getShareThemeContent', {
        params: {
          themeType: 8
        }
      }).then((res) => {
        let resData = res.data
        this.formData.id = resData.data.id || ''
        this.formData.themeName = resData.data.themeName || ''
        this.formData.purchaseDes = resData.data.purchaseDes || ''
        this.formData.agreement = resData.data.agreement || ''
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.details = res.data
        console.log('this.details: ', this.details)
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
        this.$http.post('@ROOT_API/shareTheme/updateShareThemeContent', {
          id: this.formData.id,
          themeName: this.formData.themeName,
          purchaseDes: this.formData.purchaseDes,
          agreement: this.formData.agreement
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
          this.getDetails()
        }).finally(() => {
          this.loading = false
        })
      })
    },

    /**
     * 编辑器内容改变
     */
    editorChange (value) {
      this.formData.purchaseDes = value
    },
    /**
     * 编辑器内容改变
     */
    editorChanget (value) {
      this.formData.agreement = value
    }
  }
}
</script>

<style lang="less" scoped>
.content-data-wrap{


}
</style>
<style lang="less">
.content-data-wrap{
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
