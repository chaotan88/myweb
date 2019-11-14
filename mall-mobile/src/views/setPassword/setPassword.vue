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
    <div class="save-btn save-btn-tap"  v-if="password && confirmPassword" @click="savePassword">保存</div>
    <div class="save-btn save-btn-notap" v-else>保存</div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        password: '',
        confirmPassword: '',
        passwordSte: false,
        confirmPasswordSte: false,
        passwordType: ''
      }
    },
    mounted: function () {
      this.passwordType = localStorage.getItem('passwordType') // 是设置支付密码还是修改
    },
    methods: {
      /**
       * 保存
      */
      savePassword () {
        var reg = /^[0-9]+?[0-9]*$/
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
        var resUrl = ''
        var resParm = {
          paymentPassword: this.password,
          id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId
        }
        if (this.passwordType === 'edit') {
          resUrl = this.api.updatePaymentPassword
          resParm.subPaymentPassword = this.password
        } else {
          resUrl = this.api.setPayPassword
        }
        this.$http.post(resUrl, resParm).then((res) => {
          let resData = res.data
          this.$vux.toast.text(res.data.msg)
          if (resData.status === this.api.ERR_OK) {
            var urlPath = localStorage.getItem('setPawReturnPage')
            if (urlPath.indexOf('orderPay') > -1) {
              this.$router.replace({path: urlPath, query: {redirect: 'gopay'}})
            } else {
              this.$router.replace({path: '/my'})
            }
            setTimeout(() => {
              localStorage.removeItem('setPawReturnPage')
            }, 100)
          }
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
        }
        .vux-x-icon{
          fill: #d4d4d4;
        }
      }
    }
    .save-btn{
      height: .8rem;
      font-size: .26rem;
      color: #fff;
      border-radius: 6px;
      text-align: center;
      line-height: .8rem;
      margin-bottom: .52rem;
      margin-top: 3rem;
    }
    .save-btn-notap{
      background: #f9b6b6;
    }
    .save-btn-tap{
      background: -webkit-linear-gradient(left, #f77574 , #ed3738); /* Safari 5.1 - 6.0 */
      background: linear-gradient(to right,#f77574 , #ed3738);
    }
  }
</style>