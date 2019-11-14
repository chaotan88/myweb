<!-- 密码设置 -->
<template>
  <div class="setup-password-wrap">
    <group>
      <cell title="重置登录密码" link="/resetPassword"></cell>
      <div @click="resetPassword">
        <cell is-link title="重置支付密码" v-if="isPayPasswordSte !== '' && isPayPasswordSte === 1"></cell>
        <cell is-link title="设置支付密码" v-else></cell>
      </div>
    </group>
    <div v-if="showToast">
      <x-dialog v-model="showToast">
        <div style="padding: 1rem .3rem;" class="dialog-main">
          <div class="title">请验证支付密码确认本人操作</div>
          <input-password :length="6" @success="inputSuccess" v-model="formData.password"></input-password>
          <div class="forgetPwd" @click="forgetPwd">忘记支付密码</div>
          <div class="pos-a close-btn" @click="showToast = false, formData.password = ''">
            <span class="weui-icon weui_icon_cancel weui-icon-cancel"></span>
          </div>
        </div>
      </x-dialog>
    </div>
    <div class="sub-btn-wrap">
      <div class="ta-c sub-btn active" @click="$router.back()">返回</div>
    </div>
    
  </div>
</template>

<script>
import InputPassword from './../public/InputPassword'
import {Group, Cell, XDialog} from 'vux'

export default {
  components: {
    InputPassword,
    Group,
    Cell,
    XDialog
  },

  data () {
    return {
      formData: {
        password: ''               // 密码
      },
      isPayPasswordSte: '',        // 是否设置密码状态
      showToast: false,            // 显示弹窗
      userInfo: {}                 // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('integralUserInfo'))
    this.isSetPaymentPassword()
  },

  methods: {
    /**
     * 获取是否设置支付密码
    */
    isSetPaymentPassword () {
      this.$http.get(this.api.isSetPayPassword).then((res) => {
        let resData = res.data
        if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
          this.isPayPasswordSte = resData.data
        }
      })
    },

    /**
     * 重置支付密码
     */
    resetPassword () {
      if (this.isPayPasswordSte === 0) {
        localStorage.setItem('setPawReturnPage', '/password')       // 设置支付密码完成后要跳转的页面
        localStorage.setItem('passwordType', 'set')                 // 是设置还是修改
        this.$router.push('/verifyingPhone')
      } if (this.isPayPasswordSte === 1) {
        this.showToast = true
      }
    },
    /**
     * 校验支付密码是否正确
    */
    checkPassword () {
      this.$http.post(this.api.checkPassword, {
        id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId,
        paymentPassword: this.formData.password
      }).then((res) => {
        let resData = res.data
        if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
          localStorage.setItem('setPawReturnPage', this.$route.fullPath)       // 设置支付密码完成后要跳转的页面
          localStorage.setItem('passwordType', 'edit')                         // 是设置还是修改
          this.$router.push('/setPassword')
        } else {
          this.formData.password = ''
          this.$vux.toast.text(resData.msg)
        }
      })
    },

    /**
     * 输入支付密码
     */
    inputSuccess () {
      this.checkPassword()
    },
    /**
     * 忘记支付密码
     */
    forgetPwd () {
      localStorage.setItem('setPawReturnPage', this.$route.fullPath)       // 设置支付密码完成后要跳转的页面
      localStorage.setItem('passwordType', 'edit')                        // 是设置还是修改
      this.$router.push('/verifyingPhone')
    }
  }
}
</script>

<style lang="less">
.setup-password-wrap{
  .weui-cells{
    margin: 0;
    .weui-cell{
      &::before{
        border: none;
      }
    }
  }

  .weui-cell{
    border-top: .01rem solid #ececec;
    padding: 15px;
  }

  .vux-no-group-title{
    margin: 0;
  }

  .dialog-main{
    padding: 30px;

    .title{
      padding-bottom: .5rem;
    }

    .close-btn{
      right: .1rem;
      top: .2rem;

      .weui-icon-cancel{
        color: #aaa;
      }
    }
  }
  .forgetPwd{
    text-align: center;
    font-size: 14px;
    margin-top: 10px;
    color: #3ba5d2;
  }

  /* -------------------- { 提交按钮 } -------------------- */
  .sub-btn-wrap{
    padding: 0 .4rem;

    .sub-btn{
      color:#fff;
      width: 100%;
      height: .9rem;
      line-height: .9rem;
      font-size: 0.28rem;
      margin-top: 0.9rem;
      background:  linear-gradient(left, #f77574, #ed3638);
      border-radius: .45rem;
      box-shadow: 0 3px 7px rgba(88, 148, 222, .1);
    }

    .sub-btn.active{
      background:  linear-gradient(left, #f77574, #ed3638);
    }

    span{
      color: #333;
      margin-top: .3rem;
    }
  }

  .tips-text{
    color: #aaa;
    font-size: .24rem;
    margin-bottom: .4rem;
    margin-top: .4rem;
    padding: 0 .2rem;
  }
}
</style>
