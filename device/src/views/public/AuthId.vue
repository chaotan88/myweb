<template>
  <div class="auth-id-wrap">
    <el-form :model="formData" :rules="rules" ref="verifiForm" label-position="right" label-width='110px'>
      <el-form-item inline label='姓　　名：' prop='name'>
        <el-input placeholder='输入真实姓名' v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item inline label='身份证号：' prop='idNumber'>
        <el-input placeholder='身份证号(15-18位)' v-model="formData.idNumber"></el-input>
      </el-form-item>
      <div class="ta-c btn-wrap">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" class='confirm-btn' @click="submitForm('verifiForm')">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    // 校验手机号
    let validateIdNum = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入身份证号'))
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (!regIdNo.test(value)) return callback(new Error('身份证号填写有误'))
      callback()
    }
    return {
      formData: {                 // 表单数据
        name: '',                 // 姓名
        idNumber: ''              // 身份证号
      },
      rules: {
        name: [{ required: true, message: '输入真实姓名', trigger: 'blur' }],
        idNumber: [{ required: true, validator: validateIdNum, trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
  },
  methods: {
    /**
     * 提交表单
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        // ajax ...
        this.$http.post('@ROOT_API/cooperationUserController/validCard', {
          id: this.userInfo.userId,
          idCard: this.formData.idNumber,
          cardName: this.formData.name
        }).then((res) => {
          if (!res) return false
          let resData = res.data
          if (resData.status !== '1') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          // 44088119940330181x
          console.log('resData: ', resData)
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          // 关闭弹窗
          setTimeout(() => {
            this.$emit('close')
          }, 500)
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.auth-id-wrap{
  padding: 0 70px;

  .btn-wrap{
    padding-top: 20px;

    .el-button{
      width: 120px;
      height: 38px;
      font-size: 16px;
      padding: 0;
      margin: 0 20px;
    }

    .confirm-btn{
      border-color: #33719b;
      background: #33719b;
    }
  }
}
</style>

<style lang='less'>
.auth-id-wrap{

  .el-form{

    .el-form-item{
      margin-bottom: 20px;

      .el-form-item__label{
        font-size: 16px;
        text-align: right;
        padding-left: 0;
      }

      .el-form-item__content{
        font-size: 16px;

        .el-button{
          width: 110px;
          height: 38px;
          padding: 0;
          right: 0;
          top: 0;
        }
      }
    }
  }
}
</style>
