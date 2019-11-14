<template>
  <div class="com-login-wrap">
    <x-dialog v-model="dialogShow" class="dialog-demo" hide-on-blur>
      <div class="login-dialog">
        <ul>
          <li >
            <div>
              <input type="text" placeholder="请输入邀请码" v-model="formData.beInvitationCode">
            </div>
          </li>
        </ul>
        <div class="login-btn" @click="bindRecommend()">提交信息</div>
        <div class="close" @click="hide(false)">
          <span class="vux-close">
            x
          </span>
        </div>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import { XDialog } from 'vux'
  export default {
    components: {
      XDialog
    },
    props: ['show'],
    data () {
      return {
        dialogShow: this.show,     // 弹框显示
        formData: {
          beInvitationCode: ''     // 邀请码
        },
        noTap: true,               // 防止多次提交
        user: {                    // 用户信息
          invitationCode: ''       // 推荐码
        }
      }
    },
    methods: {
      /**
       * 关闭弹窗
      */
      hide (isShare) {
        console.log(isShare)
        this.$emit('changeShareData', {open: false, isShare: isShare})
      },
      /**
       * 提交邀请码
       */
      bindRecommend () {
        if (!this.noTap) { return false }
        if (!this.formData.beInvitationCode) {
          this.$vux.toast.text('请填写邀请码')
          return false
        }
        this.noTap = false
        this.$http.post(`${this.api.bandRecommendRelation}`, {
          beInvitationCode: this.formData.beInvitationCode,
          invitationCode: this.user.invitationCode
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) {
            this.$vux.toast.text(res.data.msg)
            return false
          } else {
            this.$vux.toast.text('信息提交成功')
            this.hide(true)
          }
        })
      }
    },
    watch: {
      show (curVal, oldVal) {
        console.log(curVal, oldVal)
        this.dialogShow = curVal
        var user = localStorage.getItem('bsbUserInfo') ? localStorage.getItem('bsbUserInfo') : ''
        if (user) {
          this.user = JSON.parse(user)
        }
      }
    }
  }
</script>
<style lang="less">
  .com-login-wrap {
    .weui-dialog{
      overflow: visible;
      max-width: 7rem;
    }
  }
</style>
<style lang="less">
  .com-login-wrap{
    .login-mask{
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0,0,0,.5);
    }
    .login-dialog{
      position: relative;
      display: table;
      width: 100%;
      max-width: 7rem;
      margin: auto;
      background-color: #fff;
      text-align: center;
      border-radius: 3px;
      max-width: 7rem;
      width: 100%;

      ul{
        li{
          display: flex;
          align-items: center;
          height: .9rem;
          font-size: .28rem;
          color: #808080;
          border-bottom: 1px solid #eee;
          padding: 0 .2rem;
          div:nth-child(1){
            flex: 1;
          }
          input{
            width: 100%;
            height: 100%;
            background: none;
          }
          .getCode{
            text-align: center;
            padding: .1rem .15rem;
            font-size: .24rem;
            border: none;
            border: 1px solid #e7e7e7;
            border-radius: 3px;
            background: #f8f8f8;
          }
        }
      }

      .login-btn{
        width: 90%;
        height: .75rem;
        background: #ee3d3f;
        text-align: center;
        color: #fff;
        margin: 0 auto;
        line-height: .75rem;
        margin-top: .5rem;
        margin-bottom: .5rem;
        font-size: .28rem;
        border-radius: 5px;
      }

      .close{
        position: absolute;
        top: -0.4rem;
        right: 0rem;
        width: .6rem;
        height: .6rem;
        text-align: center;
        line-height: .55rem;
        border-radius: .3rem;
        background: #999999;
        color: white;
      }
    }
  }
</style>
