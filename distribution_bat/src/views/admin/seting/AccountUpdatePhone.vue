<template>
  <div class="ta-l update-phone-wrap">
    <template v-if="curStep === 1">
      <el-form :model="verifiData" :rules="rules" ref="verifiPhone" label-position="right" label-width='100px'>
        <!-- <el-form-item inline label='手机号：'>
          <span class="phone">{{userInfo.phone | filterPhone}}</span>
        </el-form-item> -->
        <el-form-item inline label='手机号：' :required="!userInfo.phone" prop="phone">
          <span class="phone" v-if="userInfo.phone">{{userInfo.phone | filterPhone}}</span>
          <el-input class='inp-phone' placeholder='请输入手机号' v-model="verifiData.phone" v-else></el-input>
        </el-form-item>
        <el-form-item inline label='验证码：' prop='code'>
          <el-input class='inp-code' placeholder='输入4位数验证码' v-model="verifiData.code"></el-input>
          <el-button class='ta-c pos-a get-code-btn' v-if="initSendCode" @click="sendCodeHandle('verifiPhone')">获得验证码</el-button>
          <el-button class='ta-c pos-a' disabled v-else>{{sendCodeNum}}s后重新获取</el-button>
        </el-form-item>
        <div class="ta-c next-btn-wrap">
          <el-button type="primary" @click="submitNextForm('verifiPhone')">下一步</el-button>
        </div>
      </el-form>
    </template>
    <template v-else>
      <el-form :model="verifiData" :rules="rules" ref="verifiPhone" label-position="right" label-width='100px'>
        <el-form-item inline label='手机号：' prop='newPhone'>
          <el-input ref='newPhone' placeholder='按手机格式填写（11位数字）' v-model="verifiData.newPhone"></el-input>
        </el-form-item>
        <el-form-item inline label='验证码：' prop='newCode'>
          <el-input class='inp-code' placeholder='输入4位数验证码' v-model="verifiData.newCode"></el-input>
          <el-button class='ta-c pos-a get-code-btn' v-if="initSendCode" @click="sendNewCodeHandle('verifiPhone')">获得验证码</el-button>
          <el-button class='ta-c pos-a' disabled v-else>{{sendCodeNum}}s后重新获取</el-button>
        </el-form-item>
        <div class="ta-c next-btn-wrap">
          <el-button type="primary" @click="submitForm('verifiPhone')">确定</el-button>
        </div>
      </el-form>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    // 校验手机号格式是否正确
    let validatePhone = (rule, value, callback) => {
      if (!this.userInfo.phone && !value) return callback(new Error('请输入您的手机号码'))
      if (value && !value.match(/^1\d{10}$/gi)) return callback(new Error('请输入正确的手机号'))
      callback()
    }

    // 校验新手机号格式是否正确
    let validateNewPhone = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入您要修改的手机号码'))
      let rePhone = /^1\d{10}$/
      if (!rePhone.test(value)) return callback(new Error('请输入正确的手机号'))
      callback()
    }
    return {
      initSendCode: true,   // 是否发送验证码
      curStep: 1,           // 当前步骤
      verifiData: {         // 验证手机
        code: '',           // 验证码
        phone: '',          // 手机号
        newPhone: '',       // 新手机
        newCode: ''         // 新验证码
      },
      rules: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码为4位数', trigger: 'blur' }
        ],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        newPhone: [{ required: true, validator: validateNewPhone, trigger: 'blur' }],
        newCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码为4位数', trigger: 'blur' }
        ]
      },
      timer: null,          // 定时器
      sendCodeNum: 60,      // 倒计时秒数
      userInfo: {} // 用户信息
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO)) || {}
    if (!this.userInfo.phone) this.curStep = 2
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
    sendCodeHandle (formName) {
      if (!this.userInfo.phone) {
        this.$refs[formName].validateField('phone', (valid) => {
          if (valid) return false
          this.getCodeHandle()
        })
      } else {
        this.getCodeHandle()
      }
    },

    /**
     * 获取验证码
     */
    getCodeHandle () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.$http.post('@ROOT_API/accountSetController/getValidWord', {
        phone: this.userInfo.phone ? this.userInfo.phone : this.verifiData.phone
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
        this.initSendCode = false
        this.countDownHandle()
      })
    },

    /**
     * 下一步 - 验证手机号
     */
    submitNextForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$http.post('@ROOT_API/accountSetController/checkVerifyCode', {
          phone: this.userInfo.phone,
          verifyCode: this.verifiData.code
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
          this.curStep = 2
          this.sendCodeNum = 60
          this.initSendCode = true
        })
      })
    },

    /**
     * 第二步发送新验证码
     */
    sendNewCodeHandle (formName) {
      this.$refs[formName].validateField('newPhone', (valid) => {
        if (valid) return false
        this.$http.post('@ROOT_API/accountSetController/getValidWord', {
          phone: this.verifiData.newPhone,
          validPhoneFlag: 1
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
          this.initSendCode = false
          this.countDownHandle()
        })
      })
    },

    /**
     * 提交表单
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$http.post('@ROOT_API/accountSetController/checkVerifyCode', {
          phone: this.verifiData.newPhone,
          verifyCode: this.verifiData.newCode
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
          this.curStep = 2
          this.sendCodeNum = 60
          this.initSendCode = true
          // ajax ...
          this.$http.post('@ROOT_API/accountSetController/updatePhone', {
            id: this.userInfo.userId,
            phone: this.verifiData.newPhone,
            verifyCode: this.verifiData.newCode
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
              duration: 1000
            })
            setTimeout(() => {
              this.$emit('close')
              this.$emit('success', this.verifiData.newPhone)
            }, 500)
          })
        })
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
