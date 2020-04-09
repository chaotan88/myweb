<template>
  <div class="update-phone-wrap">
     <template v-if="curStep === 1">
      <el-form :model="verifiData" :rules="rules" ref="verifiPhone" label-position="right" label-width='130px'>
        <!--手机号码默认无时-->
        <template>
          <el-form-item inline label='Old Email：' prop='email'>
            <el-input ref='email' placeholder='Mailbox format' v-model="verifiData.email"></el-input>
          </el-form-item>
          <el-form-item inline label='Verifi Code：' prop='code'>
            <template>
              <el-input class='inp-code' placeholder='6 digit number' v-model="verifiData.code"></el-input>
              <el-button class='ta-c pos-a get-code-btn' v-if="initSendCode" @click="sendNewCodeHandle(verifiData.email, 'verifiPhone', '1')">Get Code</el-button>
              <el-button class='ta-c pos-a' disabled v-else>Regain for {{sendCodeNum}}s</el-button>
            </template>
          </el-form-item>
        </template>
        <div class="ta-c next-btn-wrap">
          <el-button type="primary" @click="submitNextForm('verifiPhone')">Next</el-button>
        </div>
      </el-form>
    </template>
    <template v-else>
      <el-form :model="verifiData" :rules="rules" ref="verifiPhone2" label-position="right" label-width='130px'>
        <el-form-item inline label='new Email：' prop='newEmail'>
          <el-input ref='newEmail' placeholder='Mailbox format' v-model="verifiData.newEmail"></el-input>
        </el-form-item>
        <el-form-item inline label='Verifi Code：' prop='newCode'>
          <el-input class='inp-code' placeholder='6 digit number' v-model="verifiData.newCode"></el-input>
          <el-button class='ta-c pos-a get-code-btn' v-if="initSendCode" @click="sendNewCodeHandle(verifiData.newEmail, 'verifiPhone2', '2')">Get Code</el-button>
          <el-button class='ta-c pos-a' disabled v-else>Regain for {{sendCodeNum}}s</el-button>
        </el-form-item>
        <div class="ta-c next-btn-wrap">
          <el-button type="primary" @click="submitForm('verifiPhone2')">Ok</el-button>
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
          { required: true, message: 'email is required', trigger: 'blur' }
        ],
        code: [
          { required: true, message: 'Verifi Code is required', trigger: 'blur' }
        ],
        newEmail: [{ required: true, type: 'email', trigger: 'blur' }],
        newCode: [
          { required: true, message: 'Verifi Code is required', trigger: 'blur' }
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
     * 第二步发送新验证码
     */
    sendNewCodeHandle (value, formName, type) {
      this.$refs[formName].validate((valid) => {
        this.$http.post('@ROOT_API/login/sendEmailCode', {
          email: value,
          type: '5'
        }).then((res) => {
          if (res.data.status === '1') {
            this.initSendCode = false
            this.countDownHandle()
            let message = 'Success'
            if (type === '1') {
              message = 'Please check email for 6-digit verification code'
            }
            this.$message({message: message, type: 'success', duration: 0, showClose: true})
          } else {
            this.$message({message: res.data.msg, type: 'error', duration: 2000})
          }
        })
        .catch(() => {
          this.$message({message: 'File', type: 'error', duration: 2000})
        })
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
          width: 140px;
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
