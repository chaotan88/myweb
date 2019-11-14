<template>
  <div class="setPassword">
    <ul>
      <li>
        <div></div>
        <input type="password" placeholder="请填写支付密码（限6个数字）" v-model="password" maxlength="6">
        <x-icon type="ios-close" size="23" v-if="password" @click="password = ''"></x-icon>
      </li>
      <li>
        <div></div>
        <input type="password" placeholder="确认支付密码（限6个数字）" v-model="confirmPassword" maxlength="6">
        <x-icon type="ios-close" size="23" v-if="confirmPassword" @click="confirmPassword = ''"></x-icon>
      </li>
    </ul>

    <div class="sub-btn-wrap">
      <div class="ta-c sub-btn active"  v-if="password && confirmPassword" @click="savePassword">保存</div>
      <div class="ta-c sub-btn" v-else>保存</div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        password: '',
        confirmPassword: '',
        passwordSte: false,
        isPayPasswordSte: null,
        confirmPasswordSte: false
      }
    },
    mounted () {
      this.isSetPaymentPassword()
    },
    methods: {
      /**
       * 获取是否设置支付密码
       */
      isSetPaymentPassword () {
        this.$http.get(this.api.isSetPaymentPassword).then((res) => {
          let resData = res.data
          if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
            this.isPayPasswordSte = resData.data
          }
        })
      },

      /**
       * 保存
      */
      savePassword () {
        var reg = /^\d+$/
        if (this.password.length < 6 || !reg.test(this.password)) {
          this.$vux.toast.text('支付密码为6位数字')
          return false
        }
        if (this.confirmPassword.length < 6 || !reg.test(this.confirmPassword)) {
          this.$vux.toast.text('确认支付密码为6位数字')
          return false
        } if (this.password !== this.confirmPassword) {
          this.$vux.toast.text('密码不一致')
          return false
        }
        this.$vux.loading.show({
          text: '正在保存...'
        })
        let url = this.isPayPasswordSte === 1 ? this.api.resetPayPassword : this.api.setPayPassword
        this.$http.post(url, {
          paymentPassword: this.password,
          subPaymentPassword: this.confirmPassword,
          id: JSON.parse(localStorage.getItem('integralUserInfo')).userId
        }).then((res) => {
          console.log(res)
          let resData = res.data
          this.$vux.toast.text(resData.msg)
          this.$router.push({path: '/home'})
          // if (resData.status === this.api.ERR_OK) {
          //   var urlPath = localStorage.getItem('setPawReturnPage')
          //   this.$router.push({path: urlPath})
          // }
        }).finally(() => {
          this.$vux.loading.hide()
        })
      }
    }
  }
</script>
<style scoped lang=less>
  .setPassword{
    padding: 0 .3rem;
    ul{
      li{
        display:flex;
        align-items: center;
        height: .84rem;
        border-bottom: 1px solid #dddddd;
        div{
          width: .2rem;
          height: .2rem;
          border: .02rem solid #999999;
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          &::after{
            content: '';
            width: .14rem;
            height: .02rem;
            background: #999999;
            display: block;
          }
        }
        input{
          color: #999999;
          font-size: .26rem;
          margin-left: .24rem;
          flex: 1;
          height: 100%;
          background: none;
        }
        .vux-x-icon{
          fill: #d4d4d4;
        }
      }
    }
  }
</style>
