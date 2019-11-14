<!-- 手机号 -->
<template>
  <div class="setup-phone-wrap">
    <group>
      <cell title="手机号">{{userInfo.phone | filterPhone}}</cell>
    </group>

    <div class="sub-btn-wrap">
      <div class="ta-c sub-btn active" @click="showPhonePop">更换手机号</div>
      <div class="ta-c tips-text">一个手机号只能作为一个账号的登录名</div>
    </div>

    <!--修改手机号-->
    <modify-phone  ref="modifyPhone" :phoneData="userInfo.phone"></modify-phone>
    
  </div>
</template>

<script>
import {Group, Cell} from 'vux'
import modifyPhone from '../public/modifyPhone'
export default {
  components: {
    Group,
    Cell,
    modifyPhone
  },

  data () {
    return {
      userInfo: {}      // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
  },

  methods: {
    /**
     * 显示修改手机弹窗
    */
    showPhonePop () {
      this.$refs.modifyPhone.showModifyPhone()
    },
    /**
     * 更新手机号码
    */
    modifyPhoneData (phone) {
      this.userInfo.phone = phone
      localStorage.setItem('bsbUserInfo', JSON.stringify(this.userInfo))
      this.$router.back()
    }
  }
}
</script>

<style lang="less">
.setup-phone-wrap{
  .weui-cells{
    margin: 0;
    padding: .1rem 0;
    &::before{
      border: none;
    }
  }

  .vux-no-group-title{
    margin: 0;
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
