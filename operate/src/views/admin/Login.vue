<!-- 登录 -->
<template>
  <div class="pos-a login-wrap">
    <div class="login-center">
      <div class="login-cen">
        <h1><img class="d-b" src="../../assets/img/login-logo.png"></h1>
        <h2 class="fw-n ta-c">中腾运营管理系统</h2>
        <el-form ref="form" :model="formData" :rules="rules">
          <el-form-item class="pos-r" label="账户名：" prop="userName">
            <el-input v-model.trim="formData.userName" @keyup.enter.native="login('form')"></el-input>
          </el-form-item>
          <el-form-item class="pos-r" label="密　码：" prop="password">
            <el-input type="password" v-model.trim="formData.password" @keyup.enter.native="login('form')"></el-input>
          </el-form-item>
          <el-button type="primary" class="full-w" @click="login('form')">登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        formData: {
          userName: '',         // 用户名
          password: ''          // 密码
        },
        rules: {
          userName: [{required: true, message: '账户名不能为空', trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
        }
      }
    },
    methods: {
      login (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          // 登录
          this.$http.post('@ROOT_PUBLIC/login/login', {
            phone: this.formData.userName,
            password: this.formData.password
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
            localStorage.setItem(this.$global.USER_INFO, JSON.stringify(resData.data))
            setTimeout(() => {
              this.$router.push('/admin')
            }, 500)
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.login-wrap{
  width: 100%;
  height: 100%;
  padding: 45px 50px 100px 50px;
  background-image: url("../../assets/img/login-bg1.png");
  background-size: cover;
  overflow: hidden;
  box-sizing: border-box;

  .login-cen{
    padding: 35px 30px 50px 30px;
    margin-left: -180px;
    margin-top: -190px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 6px;

    h1{

      img{
        height: 40px;
        margin: 0 auto;
      }
    }

    h2{
      font-size: 15px;
      margin-top: 5px;
      margin-bottom: 30px;
    }

    .login-input{
      width: 310px;
      height: 40px;
      padding: 0 20px;
      line-height: 40px;
      border: 1px solid #d1d4db ;
      margin: 30px 0 0 0;
      box-sizing: border-box;
      border-radius: 3px;

      span{
        width: 60px;
        font-size: 16px;
      }

      .inp-text{
        color: #333;
        font-size: 16px;
        box-sizing:border-box;
        border: none;
      }
    }
    input:focus{
      outline: none;
    }


    .inp-text::-webkit-input-placeholder { /* WebKit browsers */
      color:#33719b;
    }
    .inp-text:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color:#33719b;
    }
    .inp-text::-moz-placeholder { /* Mozilla Firefox 19+ */
      color:#33719b;
    }
    .inp-text:-ms-input-placeholder { /* Internet Explorer 10+ */
      color:#33719b;
    }

    .inp-sub{
      width: 100%;
      height: 40px;
      margin-top: 60px;
      background:#33719b;
      color: white;
      font-size: 18px;
      font-weight: inherit;
      border: none;
      cursor: pointer;
      border-radius: 5px;
    }
    .inp-sub:hover{
      background:#3b81b1;
      color: white;
    }
  }
}
</style>

<style lang="less">
.login-wrap{
  .el-form{
    width: 310px;

    .el-form-item__label{
      color: #999;
      padding-right: 0;
      position: absolute;
      left: 10px;
      top: 0;
      z-index: 5;
    }

    .el-form-item__label:before{
      content: '';
    }

    .el-input__inner{
      padding-left: 75px;
    }
  }

  .el-button{
    margin-top: 20px;
  }
}
</style>
