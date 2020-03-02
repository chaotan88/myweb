<template>
  <div class="account-edit">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
      <ul>
        <li>
          <el-form-item :label="$t('common.password')" prop="pasword1" >
            <el-input type="password" v-model="ruleForm.pasword1" :placeholder="`6-20${$t('common.characters')}`"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('common.newPassword')" prop="pasword2" >
            <el-input type="password" v-model="ruleForm.pasword2" :placeholder="`6-20${$t('common.characters')}`"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('common.confirmNewPassword')" prop="pasword3" >
            <el-input type="password" v-model="ruleForm.pasword3" :placeholder="`6-20${$t('common.characters')}`"></el-input>
          </el-form-item>
        </li>
      </ul>
    </el-form>
    <div class="save-box">
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.pasword2) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          pasword1: '',
          pasword2: '',
          pasword3: ''
        },
        rules: {
          pasword1: [
            { required: true, message: '请输入原密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20个字符', trigger: 'blur' }
          ],
          pasword2: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20个字符', trigger: 'blur' }
          ],
          pasword3: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      /**
       * 表单验证
      */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updatePwd()
          } else {
            return false
          }
        })
      },
      /**
       *修改密码
      */
      updatePwd () {
        this.$http.post('@ROOT_API/login/resetPassword', {
          id: JSON.parse(localStorage.getItem('deviceAdminInfo')).userId,
          password: this.ruleForm.pasword1,
          confirmPwd: this.ruleForm.pasword2,
          subNewPassword: this.ruleForm.pasword3
        }).then((res) => {
          if (res.data.status === '1') {
            localStorage.clear()
            this.$message({
              message: '修改密码成功',
              type: 'success',
              duration: 500
            })
            setTimeout(() => {
              this.$router.push('/login')
            }, 500)
          } else {
            this.$message.error(res.data.msg || this.$t('common.errorMsg'))
          }
        })
      }
    }
  }
</script>
<style lang='less' scoped>
  .account-edit{
    .save-box{
      text-align: center;
      margin-top: 30px;
      .el-button--primary{
        padding: 10px 30px;
      }
    }
    ul{
      background: #fff;
      padding: 40px;
      border-radius: 4px;
      -moz-border-radius: 4px;
      -ms-border-radius: 4px;
      -o-border-radius: 4px;
      -webkit-border-radius: 4px;
      font-size: 15px;
      color: #7a7a7a;
      li{
        height: 36px;
        line-height: 36px;
        margin-bottom: 33px;
        .el-input{
          width: 419px;
          height: 36px;
        }
      }
    }
  }
</style>
