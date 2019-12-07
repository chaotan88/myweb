<!-- 登录 -->
<template>
  <div class="full-wrap pos-a admin-login-wrap">
    <div class="pos-a login-cen">
      <h1 class="ta-c"><img src="../../assets/img/login-logo.png"></h1>
      <h2 class="fw-n ta-c">渠道管理系统</h2>
      <el-form :model="formData" :rules="rules" ref="form" class="form-wrap">
        <el-form-item label="账户名：" class="pos-r" prop="userName">
          <el-input v-model="formData.userName" @keyup.enter.native="loginHandle('form')"></el-input>
        </el-form-item>
        <el-form-item label="密　码：" class="pos-r" prop="password">
          <el-input type="password" v-model="formData.password" @keyup.enter.native="loginHandle('form')"></el-input>
        </el-form-item>
        <el-button type="primary" class="full-w" :loading="loading" @click="loginHandle('form')">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        loading: false,       // 加载中
        formData: {
          userName: '',       // 账户名
          password: ''        // 密码
        },
        rules: {
          userName: {required: true, message: '请输入账户名', trigger: 'blur'},
          password: {required: true, message: '请输入密码', trigger: 'blur'}
        }
      }
    },

    mounted () {
      localStorage.removeItem(this.$global.SYSTEM + 'MenuList')
    },

    methods: {
      /**
       * 登录
       */
      loginHandle (formName) {
        // localStorage.setItem(this.$global.USER_INFO, {})
        // this.$router.push('/admin')
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          this.loading = true
          this.$http.post('@ROOT_PUBLIC/login/login', {
            phone: this.formData.userName,
            password: this.formData.password
          }).then((res) => {
            let resData = res.data
            if (parseInt(resData.status) !== 1) {
              this.$message({
                message: resData.msg,
                duration: 1500,
                type: 'error'
              })
              return false
            }
            this.$message({
              message: resData.msg,
              duration: 1000,
              type: 'success'
            })
            localStorage.setItem(this.$global.USER_INFO, JSON.stringify(resData.data))
            this.$router.push('/admin')
          }).finally(() => {
            setTimeout(() => {
              this.loading = false
            }, 1000)
          })
        })
      }
    }
  }
</script>

<style lang="less">
.admin-login-wrap{
  overflow: hidden;
  background: url("../../assets/img/login-bg.png") no-repeat center;
  background-size: cover;
  box-sizing: border-box;

  .login-cen{
    padding: 35px 30px 50px 30px;
    margin-left: -180px;
    margin-top: -190px;
    background: #fff;
    top: 50%;
    left: 50%;
    border-radius: 6px;

    h1{
      img{
        height: 40px;
      }
    }

    h2{
      font-size: 15px;
      margin-top: 5px;
      margin-bottom: 30px;
    }

    .form-wrap{
      width: 310px;

      .el-form-item{
        margin-bottom: 30px;
      }

      .el-form-item__label{
        padding-right: 0;
        position: absolute;
        left: 15px;
        z-index: 99;
      }

      .el-form-item__label:before{
        content: '';
      }

      .el-input__inner{
        padding-left: 75px;
        box-sizing: border-box;
      }

      .el-button{
        margin-top: 20px;
      }
    }
  }
}
</style>
