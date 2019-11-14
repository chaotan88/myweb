<template>
  <div>
    <x-dialog v-model="showPhonePop" class="dialog-demo" hide-on-blur @on-hide="closeModifyPhone"  :dialog-style="{'text-align': 'left', width: '80%', 'max-width': '80%'}">
      <div class="look-phonepop">
        <!--标题-->
        <div class='look-phonepop-title'>
          <div v-if="nextSte">绑定新手机号</div>
          <div v-else>手机号验证</div>
          <x-icon type="ios-close-empty" size="30" @click.native="closeModifyPhone"></x-icon>
        </div>
        <!--内容-->
        <div>
          <div class='look-phonepop-list'>
            <img src="../../assets/images/phone.png">
            <input type="tel" maxlength="11" placeholder='绑定新手机号' v-model="newPhone" v-if="nextSte">
            <div v-else>{{phoneData}}</div>
          </div>
          <div class='look-phonepop-list'>
            <img src="../../assets/images/password.png">
            <input type="number" maxlength="11" placeholder='请输入验证码' v-model="codeVal">
            <div class="getCode" @click="getCode(getCodeType)" v-if="!getCodeNoTap">{{CodeText}}</div>
            <div class="getCode" v-else>{{CodeText}}</div>
          </div>
        </div>
        <x-button type="warn" class="modify-btn" @click.native="nextStep" v-if="!nextSte">下一步</x-button>
        <x-button type="warn" class="modify-btn" @click.native="saveData" v-else>保存</x-button>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import { XDialog, XButton } from 'vux'
  export default {
    props: {
      phoneData: ''
    },
    components: {
      XDialog,
      XButton
    },
    data () {
      return {
        showPhonePop: false,
        getCodeNoTap: false, // 获取验证码按钮是否允许点击
        Time: 60,
        timer: null,            // 定时器
        CodeText: '点击获取', // 验证码文字
        newPhone: '', // 新手机号
        getCodeType: 1, // 获取验证码类型 1 原手机号获取，2 新手机号获取 默认为1
        codeVal: '', // 输入的验证码的值
        requestCodeVal: '', // 接口获取的验证码
        nextSte: false // 是否显示下一步
      }
    },
    mounted () {
    },
    methods: {
      /**
       * 显示修改手机弹窗
      */
      showModifyPhone () {
        this.showPhonePop = true
      },
      /**
       * 关闭修改手机弹窗
      */
      closeModifyPhone () {
        clearInterval(this.timer)
        this.showPhonePop = false
        this.nextSte = false // 显示下一步为false
        this.getCodeType = 1 // 获取验证码类型为原手机获取
        this.codeVal = '' // 重置验证码
        this.Time = 60 // 重置倒计时时间
        this.getCodeNoTap = false // 重置是否可以点击
        this.CodeText = '点击获取' // 重置获取验证码文字
      },
      /**
       * 倒计时
      */
      CountDown () {
        if (this.Time > 0) {
          this.getCodeNoTap = true
          this.CodeText = this.Time + 's'
          --this.Time
        } else {
          clearInterval(this.timer)
          this.Time = 60
          this.getCodeNoTap = false
          this.CodeText = '重新获取'
        }
      },
      /**
       * 发送验证码
      */
      sendCode () {
        this.$http.post(`${this.api.getCode}`, {
          phone: this.getCodeType === 1 ? this.phoneData : this.newPhone,
          validPhoneFlag: this.getCodeType === 1 ? 0 : 1
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.status === this.api.ERR_OK) {
            if (res.data.data) {
              this.requestCodeVal = res.data.data
            }
            // 倒计时
            this.CountDown()
            this.timer = setInterval(() => {
              this.CountDown()
            }, 1000)
          }
        })
      },
      /**
       * 检测手机验证码是否一致
      */
      checkCode (fun) {
        this.$http.post(`${this.api.checkCode}`, {
          phone: this.getCodeType === 1 ? this.phoneData : this.newPhone,
          verifyCode: this.codeVal
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.status !== this.api.ERR_OK) return false
          fun()
        })
      },
      /**
       * 获取验证码
       * @types 获取验证码的类型 1原手机获取 2 新手机获取
      */
      getCode (types) {
        if (types === 1) {
          // 执行获取验证码接口  原手机号
        } if (types === 2) {
          if (this.newPhone === '') {
            this.$vux.toast.text('请输入手机号')
            return false
          } if (!this.newPhone.match(/^((1[0-9]{1})+\d{9})$/)) {
            this.$vux.toast.text('请输入正确的手机号')
            return false
          }
        }
        this.sendCode() // 发送验证码请求
      },
      /**
       * 下一步
      */
      nextStep () {
        if (!this.codeVal) {
          this.$vux.toast.text('请输入验证码')
          return false
        }
        this.checkCode(() => {
          clearInterval(this.timer) // 停止倒计时
          this.nextSte = true // 显示下一步为true
          this.getCodeType = 2 // 获取验证码类型为原手机获取
          this.newPhone = ''
          this.codeVal = '' // 重置验证码
          this.Time = 60 // 重置倒计时时间
          this.getCodeNoTap = false // 重置是否可以点击
          this.CodeText = '点击获取' // 重置获取验证码文字
        })
      },
      /**
       * 保存数据
      */
      saveData () {
        if (this.newPhone === '') {
          this.$vux.toast.text('请输入手机号')
          return false
        } if (!this.newPhone.match(/^((1[0-9]{1})+\d{9})$/)) {
          this.$vux.toast.text('请输入正确的手机号')
          return false
        } if (this.codeVal === '') {
          this.$vux.toast.text('请输入验证码')
          return false
        }
        this.$vux.loading.show({
          text: '正在保存...'
        })
        // 调用保存接口
        this.checkCode(() => {
          this.$http.post(`${this.api.modifyPhone}`, {
            id: JSON.parse(localStorage.getItem('integralUserInfo')).userId,
            phone: this.newPhone,
            verifyCode: this.codeVal
          }).then((res) => {
            if (res.data.status === this.api.ERR_OK) {
              this.closeModifyPhone() // 清空输入的参数
//              this.$parent.modifyPhoneData()
              this.$emit('success', this.newPhone)
            }
            this.$vux.toast.text(res.data.msg)
          }).finally(() => {
            this.$vux.loading.hide()
          })
        })
      }
    }
  }
</script>
<style scoped lang=less>
.weui-dialog{
  text-align: left;
}
.look-phonepop{
  width: 100%;
  height: 4.2rem;
  background: #fff;
  border-radius: 8rpx;
  .look-phonepop-title{
    display: flex;
    height: .7rem;
    font-size: .28rem;
    border-bottom: 1px solid #eee;
    padding: 0 .3rem;
    align-items:center;
    div:first-child{
      flex: 1;
    }
    span{
      font-size: .5rem;
      color: #999;
    }
  }
  .look-phonepop-list{
    display: flex;
    align-items: center;
    padding: 0 .3rem;
    height: .9rem;
    border-bottom: 1px solid #eee;
    font-size: .28rem;
    color: #808080;
    img{
      width: 0.25rem;
      margin-right: .17rem;
    }
    input{
      height: .9rem;
      flex: 1;
      display: block;
      font-size: .28rem;
    }
    .getCode{
      width: 1.2rem;
      text-align: center;
      padding:.1rem 0;
      font-size: .24rem;
      border: none;
      border: 1px solid #e7e7e7;
      border-radius: 3px;
      background: #f8f8f8;
    }
  }
  .modify-btn{
    width: 90%;
    height: .75rem;
    background:  linear-gradient(left, #7acde5, #5894de);
    line-height: .75rem;
    margin-top: .5rem;
    font-size: .3rem;
    box-shadow: 0 3px 7px rgba(88, 148, 222, .1);
  }
}
</style>
