<!-- 头部 -->
<template>
  <div class="pos-a header-layout-wrap">
    <div class="fl-l ta-c logo-wrap">
      <img src="../../assets/img/admin-logo.png">
    </div>
    <div class="fl-r user-info-wrap">
      <dl class="d-ib">
        <dt class="va-m d-ib"><img src="../../assets/img/user-face01.png"></dt>
        <dd class="va-m d-ib">您好：
          <a class="cursor-p" @click="$router.push('/admin/seting/basics/index')">{{userInfo.loginName | filterEmpty}}</a>
          &nbsp;&nbsp;
          <span class="cursor-p" @click="dialogVisible = true">修改密码</span>
        </dd>
      </dl>
      <div class="d-ib va-m link-wrap">
        <!-- <a @click="$router.push('/index')">商城首页</a> -->
        <a @click="logout">安全退出</a>
      </div>
    </div>

    <el-dialog width="500px" :append-to-body="true" title="修改密码" :visible.sync="dialogVisible">
      <el-form :model="formData" :rules="rules" ref="form" label-width="120px" style="padding: 0 20px;">
        <el-form-item label="原　密　码：" prop="originalPwd">
          <el-input type='password' v-model="formData.originalPwd" placeholder='6-20位字符'></el-input>
        </el-form-item>
        <el-form-item label="新　密　码：" prop="newPwd">
          <el-input type='password' v-model="formData.newPwd" placeholder='6-20位字符'></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="confirmPwd">
          <el-input type='password' v-model="formData.confirmPwd" placeholder='6-20位字符'></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm('form')">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var validatePwd = (rule, value, callback) => {
      if (!value) callback(new Error('请输入密码!'))
      if (value.length < 6 || value.length > 20) callback(new Error('6-20位字符'))
      callback()
    }
    var validateConfirmPwd = (rule, value, callback) => {
      if (!value) callback(new Error('请再次输入密码'))
      if (value.length < 6 || value.length > 20) callback(new Error('6-20位字符'))
      if (value !== this.formData.newPwd) callback(new Error('两次输入密码不一致!'))
      callback()
    }
    return {
      loading: false,         // loading加载
      dialogVisible: false,   // 弹窗
      formData: {
        originalPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      copyFormData: {},       // 清空操作
      rules: {
        originalPwd: [{ required: true, validator: validatePwd, trigger: 'blur' }],
        newPwd: [{ required: true, validator: validatePwd, trigger: 'blur' }],
        confirmPwd: [{ required: true, validator: validateConfirmPwd, trigger: 'blur' }]
      },
      userInfo: {}
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)
  },

  methods: {
    /**
     * 安全退出
     */
    logout () {
      localStorage.removeItem(this.$global.USER_INFO)
      this.$message({
        message: '退出成功',
        type: 'success',
        duration: 500
      })
      setTimeout(() => {
        this.$router.replace('/login')
      }, 500)
    },

    /**
     * 提交表单
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.loading = true
        this.$http.post('@ROOT_API/accountSetController/updatePass', {
          id: this.userInfo.userId,
          password: this.formData.originalPwd,
          newPassword: this.formData.newPwd,
          subNewPassword: this.formData.confirmPwd
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
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          this.dialogVisible = false
          setTimeout(() => {
            this.$router.push('/admin/seting/basics/index')
            this.formData = this.$Utils.deepCopy(this.copyFormData)
          }, 500)
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.header-layout-wrap{
  width: 100%;
  height: 80px;
  background: #0c2739;
  left: 0;
  top: 0;
  z-index: 100;

  .logo-wrap{
    width: 210px;
    height: 100%;
    padding: 20px 0;
    /*background: #0a1f2e;*/
    box-sizing: border-box;

    img{
      height: 100%;
    }
  }

  .user-info-wrap{
    font-size: 14px;
    padding-right: 20px;

    dl{
      color: #fff;
      padding: 15px 0;

      dt{
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 100%;

        img{
          width: 100%;
          height: 100%;
        }
      }

      a{
        color: #fff;
      }
    }

    .link-wrap{
      margin: 0 10px;

      a{
        color: #fff;
        margin-left: 15px;
        cursor: pointer;
      }
    }
  }
}
</style>
