<template>
  <div class="update-phone-wrap">
     <template v-if="curStep === 1">
      <el-form :model="verifiData" :rules="rules" ref="verifiPhone" label-position="right" label-width='100px'>
        <!--手机号码默认无时-->
        <template>
          <el-form-item inline label='旧邮箱：' prop='email'>
            <el-input ref='email' placeholder='按邮箱格式填写' v-model="verifiData.email"></el-input>
          </el-form-item>
          <el-form-item inline label='验证码：' prop='code'>
            <template>
              <el-input class='inp-code' placeholder='输入6位数验证码' v-model="verifiData.code"></el-input>
              <el-button class='ta-c pos-a get-code-btn' v-if="initSendCode" @click='sendNewCodeHandle(verifiData.email)'>获得验证码</el-button>
              <el-button class='ta-c pos-a' disabled v-else>{{sendCodeNum}}s后重新获取</el-button>
            </template>
          </el-form-item>
        </template>
        <div class="ta-c next-btn-wrap">
          <el-button type="primary" @click="submitNextForm('verifiPhone')">下一步</el-button>
        </div>
      </el-form>
    </template>
    <template v-else>
      <el-form :model="verifiData" :rules="rules" ref="verifiPhone2" label-position="right" label-width='100px'>
        <el-form-item inline label='新邮箱：' prop='newEmail'>
          <el-input ref='newEmail' placeholder='按邮箱格式填写' v-model="verifiData.newEmail"></el-input>
        </el-form-item>
        <el-form-item inline label='验证码：' prop='newCode'>
          <el-input class='inp-code' placeholder='输入6位数验证码' v-model="verifiData.newCode"></el-input>
          <el-button class='ta-c pos-a get-code-btn' v-if="initSendCode" @click='sendNewCodeHandle(verifiData.newEmail)'>获得验证码</el-button>
          <el-button class='ta-c pos-a' disabled v-else>{{sendCodeNum}}s后重新获取</el-button>
        </el-form-item>
        <div class="ta-c next-btn-wrap">
          <el-button type="primary" @click="submitForm('verifiPhone2')">确定</el-button>
          <!-- <el-button type="primary" @click="submitForm('verifiPhone')">确定</el-button> -->
        </div>
      </el-form>
    </template>
  </div>
</template>

<script>
export default {
  props: ['phone'],
  data () {
    // 校验手机号格式是否正确
    // let validatePhone = (rule, value, callback) => {
    //   if (!value) return callback(new Error('请输入您要修改的手机号码'))
    //   let rePhone = /^1\d{10}$/
    //   if (value.length !== 11 || !rePhone.test(value)) return callback(new Error('请输入正确的手机号'))
    //   callback()
    // }
    return {
      initSendCode: true,           // 是否发送验证码
      curStep: 1,                   // 当前步骤
      verifiData: {                 // 验证手机
        email: '',
        code: '',                   // 验证码
        newPhone: '',               // 新手机
        newCode: ''                 // 新验证码
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '验证码为6位数', trigger: 'blur' }
        ],
        newEmail: [{ required: true, type: 'email', trigger: 'blur' }],
        newCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '验证码为6位数', trigger: 'blur' }
        ]
      },
      timer: null,                  // 定时器
      sendCodeNum: 60,              // 倒计时秒数
      userInfo: {}                  // 用户信息
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
  },
  methods: {
    /**
     * 倒计时
     */
    countDownHandle () {
      this.timer = setInterval(() => {
        this.sendCodeNum--
        if (this.sendCodeNum === 0) {
          clearInterval(this.timer)
          this.sendCodeNum = 60
          this.initSendCode = true
        }
      }, 1000)
    },

    /**
     * 发送验证码
     */
    sendCodeHandle (value) {
      // ajax发送验证码...
      this.$http.post('@ROOT_API/login/getVerifyCodeForForgetPassword', {
        phone: this.phone
      }).then((res) => {
        if (res.data.status === '1') {
          this.initSendCode = false
          this.countDownHandle()
        } else {
          this.$message({message: res.data.msg, type: 'error', duration: 2000})
        }
      })
      .catch(() => {
        this.$message({message: '获取验证码失败', type: 'error', duration: 2000})
      })
    },

    /**
     * 第二步发送新验证码
     */
    sendNewCodeHandle (value) {
      // let inpPhone = this.$refs.newPhone.$el.children[0]
      // let rePhone = /^1\d{10}$/
      // if (!value || value.length !== 11 || !rePhone.test(value)) {
      //   inpPhone.focus()
      //   inpPhone.blur()
      //   inpPhone.focus()
      //   return false
      // }
      // 发送验证码
      this.$http.post('@ROOT_API/login/sendEmailCode', {
        email: value,
        type: '5'
      }).then((res) => {
        if (res.data.status === '1') {
          this.initSendCode = false
          this.countDownHandle()
        } else {
          this.$message({message: res.data.msg, type: 'error', duration: 2000})
        }
      })
      .catch(() => {
        this.$message({message: '获取验证码失败', type: 'error', duration: 2000})
      })
    },
    /**
     * 下一步 - 验证手机号
     */
    submitNextForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        clearInterval(this.timer) // 停止倒计时
        this.sendCodeNum = 60
        this.$http.post('@ROOT_API/login/checkEmailVerifyCode', {
          email: this.verifiData.email, // this.userInfo.phone
          type: '4',
          verifyCode: this.verifiData.code
        }).then((res) => {
         // console.log(res)
          if (res.data.status === '1') {
            this.curStep = 2
            this.sendCodeNum = 60
            this.initSendCode = true
          } else {
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    /**
     * 提交表单
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        // ajax ...
        this.$http.post('@ROOT_API/login/replaceEmail', {
          email: this.verifiData.newEmail,
          verifyCode: this.verifiData.newCode
        }).then((res) => {
          this.$message({
            type: 'success',
            message: 'success'
          })
        })
        // this.$http.post('@ROOT_API/login/checkEmailVerifyCode', {
        //   email: this.verifiData.newEmail, // this.userInfo.phone
        //   type: '4',
        //   verifyCode: this.verifiData.newCode
        // }).then((res) => {
        //   if (res.data.status === '1') {
        //     this.$http.post('@ROOT_API/login/replaceEmail', {
        //       id: this.userInfo.userId,
        //       email: this.verifiData.newEmail,
        //       verifyCode: this.verifiData.newCode
        //     }).then((res) => {
        //     })
        //   } else {
        //     this.$message.error(res.data.msg)
        //   }
        // })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.update-phone-wrap{
  padding: 0 70px;

  .next-btn-wrap{
    padding-top: 10px;

    .el-button{
      border: 0;
      font-size: 16px;
      padding-top: 10px;
      padding-bottom: 10px;
      background: #33719b;
    }
  }
}
</style>

<style lang='less'>
.update-phone-wrap{

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

        .phone{
          color: #999;
        }

        .inp-code{
          width: 180px;
        }

        .el-button{
          width: 110px;
          height: 40px;
          padding: 0;
          right: 0;
          top: 0;
        }
      }
    }
  }
}
</style>
