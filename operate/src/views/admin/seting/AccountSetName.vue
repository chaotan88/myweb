<template>
  <div class="set-name-wrap">
    <el-form inline :model="formData" :rules="rules" ref="form">
      <el-form-item label="登录名：" prop="name">
        <el-input placeholder="不允许纯数字，限6-20个字符" v-model="formData.name"></el-input>
      </el-form-item>
      <div class="ta-c btn-wrap">
        <el-button type="primary" @click="submitHandle('form')">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    var validateName = (rule, value, callback) => {
      if (!this.isEditPage) {
        if (!value) callback(new Error('请输入登录名!'))
        if (value.length < 6 || value.length > 20 || value.match(/^\d{6,20}$/ig)) callback(new Error('不允许纯数字，限6-20个字符!'))
        callback()
      }
      callback()
    }
    return {
      formData: {
        name: ''        // 登录名
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }]
      },
      userInfo: {}      // 用户信息
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
  },
  methods: {
    /**
     * 表单提交
     */
    submitHandle (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$http.post('@ROOT_API/ad/adUserAcountController/updateUserName', {
          id: this.userInfo.userId,
          userName: this.formData.name
        }).then((res) => {
          let resData = res.data
          if (resData.status !== '1') {
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
            duration: 1500
          })
          this.userInfo.userName = this.formData.name
          localStorage.setItem(this.$global.USER_INFO, JSON.stringify(this.userInfo))
          this.$store.commit(this.$global.USER_INFO, this.userInfo)
          this.$emit('success')
        })
      })
    }
  }
}
</script>

<style lang="less">
.set-name-wrap{
  padding: 30px 105px;

  .el-input__inner{
    width: 240px;
  }

  .btn-wrap{
    margin-top: 10px;
  }
}
</style>
