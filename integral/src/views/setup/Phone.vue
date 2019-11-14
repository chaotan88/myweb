<!-- 手机号 -->
<template>
  <div class="setup-phone-wrap">
    <group>
      <cell title="手机号">{{userInfo.phone | filterPhone}}</cell>
    </group>

    <div class="sub-btn-wrap">
      <div class="ta-c sub-btn active" @click="showModify">更换手机号</div>
      <div class="ta-c tips-text">一个手机号只能作为一个账号的登录名</div>
    </div>

    <modify-phone ref="modifyPhone" :phoneData="userInfo.phone" @success="success"></modify-phone>
  </div>
</template>

<script>
import {Group, Cell} from 'vux'
import ModifyPhone from '../public/modifyPhone.vue'

export default {
  components: {
    Group,
    Cell,
    ModifyPhone
  },

  data () {
    return {
      userInfo: {}      // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('integralUserInfo'))
  },

  methods: {
    /**
     * 显示弹窗
     */
    showModify () {
      this.$refs.modifyPhone.showModifyPhone()
    },
    /**
     * 退出登录
     */
    handleLogout () {
      localStorage.removeItem('integralUserInfo')
      this.$vux.toast.text('登录成功')
      this.$router.push('/login')
    },
    /**
     * 保存
     */
    success (val) {
      this.userInfo.phone = val
      localStorage.setItem('integralUserInfo', JSON.stringify(this.userInfo))
    }
  }
}
</script>

<style lang="less">
.setup-phone-wrap{
  .weui-cells{
    margin: 0;
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
      background:  linear-gradient(left, #d3edf6, #c9ddf4);
      border-radius: .45rem;
      box-shadow: 0 3px 7px rgba(88, 148, 222, .1);
    }

    .sub-btn.active{
      background:  linear-gradient(left, #7acde5, #5894de);
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
