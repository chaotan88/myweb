<template>
  <div class="verifyingPhone">
    <img src="../../assets/images/verifyingPhone.png" >
    <div class="verifyingPhone-txt">发送<span>验证码</span>到您的手机号</div>
    <div class="verifyingPhone-phone">{{ urserPhone.substr(0,3) + "*****" + urserPhone.substr(8)}}</div>
    <div class="verifyingPhone-btn" @click="sendCode(1)">发送验证码</div>
    <!--验证码弹窗-->
    <div v-if="showCodePop">
      <x-dialog  v-model="showCodePop"  :hide-on-blur="true" :dialog-style="{'text-align': 'left', width: '80%', 'max-width': '7.5rem'}">
        <div class="CodePop">
          <div class="CodePop-title">
            <span>我们已发送验证码到您的手机</span>
            <x-icon type="ios-close-empty" size="30" @click.native="closeCodePop"></x-icon>
          </div>
          <div class="CodePop-phone">{{ urserPhone.substr(0,3) + "*****" + urserPhone.substr(8)}}</div>
          <div class="CodePop-tip">请查看短信并输入验证码</div>
          <codeComponent  v-model="code"  @confirmEvent="confirmEvent"></codeComponent>
          <div class="CodePop-getcode" @click="sendCode(2)" v-if="!getCodeNoTap">{{CodeText}}</div>
          <div class="CodePop-getcode"  v-else>{{CodeText}}</div>
        </div>
      </x-dialog>
    </div>
    <!-- <keyboardComponent></keyboardComponent> -->
  </div>
</template>
<script>
  import { XDialog } from 'vux'
  import codeComponent from '../../components/codeComponent'
  export default {
    components: {
      XDialog,
      codeComponent
    },
    data () {
      return {
        Time: 60,                            // 倒计时时间
        getCodeNoTap: false,                 // 获取验证码按钮是否允许点击
        CodeText: '重发验证码',              // 验证码文字
        timer: null,                        // 定时器
        code: '',                           // 验证码
        showCodePop: false,
        urserPhone: ''                      // 用户手机
      }
    },
    mounted: function () {
      this.getUrserPhone()
    },
    methods: {
      /**
       * 获取用户手机号码
      */
      getUrserPhone () {
        this.$http.post(`${this.api.personalInfo}`, {
          id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.urserPhone = res.data.data.user.phone
        })
      },
      /**
       * 发送验证码
      */
      sendCode (num) {
        this.$http.post(`${this.api.getCode}`, {
          phone: this.urserPhone
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.status === this.api.ERR_OK) {
            this.showCodePop = true
            if (num === 2) {
              this.timer = setInterval(() => {
                this.CountDown()
              }, 1000)
            }
          }
        })
      },
      /**
       * 检测手机验证码是否一致
      */
      checkCode (fun) {
        this.$http.post(`${this.api.checkCode}`, {
          phone: this.urserPhone,
          verifyCode: this.code
        }).then((res) => {
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.$vux.toast.text(res.data.msg)
            return false
          }
          fun()
        })
      },
      /**
       * 倒计时
      */
      CountDown () {
        if (this.Time > 0) {
          this.getCodeNoTap = true
          this.CodeText = this.Time + 's后重发验证码'
          --this.Time
        } else {
          clearInterval(this.timer)
          this.Time = 60
          this.getCodeNoTap = false
          this.CodeText = '重发验证码'
        }
      },
      /**
       * 关闭弹窗
      */
      closeCodePop () {
        this.showCodePop = false
        clearInterval(this.timer)
      },
      /**
        *输入完成
      */
      confirmEvent () {
        this.checkCode(() => {
          this.closeCodePop()
          this.$router.push({path: '/setPassword'})
        })
      }
    }
  }
</script>
<style scoped lang=less>
  .verifyingPhone{
    text-align: center;
    img{
      width: 1.86rem;
      height: 1.96rem;
      margin-top: 1.25rem;
    }
    .verifyingPhone-txt{
      color: #333333;
      font-size: .28rem;
      margin-top: .75rem;
      span{
        color: #f95a58;
      }
    }
    .verifyingPhone-phone{
      color:#f95a58;
      font-size: .24rem;
      margin-top: .29rem;
    }
    .verifyingPhone-btn{
      width: 6.9rem;
      height: .8rem;
      font-size: .26rem;
      color: #fff;
      border-radius: 6px;
      background: -webkit-linear-gradient(left, #f77574 , #ed3738);
      background: linear-gradient(to right,#f77574 , #ed3738);
      text-align: center;
      margin: 0 auto;
      line-height: .8rem;
      margin-top: .52rem;
      margin-bottom: .52rem;
    }
    .CodePop{
      .CodePop-title{
        height: .97rem;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        padding:  0 .36rem;
        font-size: .28rem;
        span{
          display: block;
          flex: 1;
        }
        .vux-x-icon{
          fill: #9d9d9d;
        }
      }
      .CodePop-phone{
        color: #f95a58;
        font-size: .24rem;
        text-align: center;
        margin-top: .3rem;
        margin-bottom: .23rem;
      }
      .CodePop-tip{
        color: #666666;
        font-size: .28rem;
        margin-bottom: .25rem;
        text-align: center;
      }
      .CodePop-getcode{
        color: #7585a5;
        font-size: .24rem;
        text-align: center;
        margin: .3rem 0;
      }
    }
  }
</style>