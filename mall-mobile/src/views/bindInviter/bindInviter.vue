<template>
  <div class="bindInviter-wrap">
    <ul>
      <li>
        <div>邀请人ID</div>
        <input type="text" placeholder="请输入邀请人ID" v-model="formData.InviterId" @input="inviterIdInp" maxlength="5">
        <template v-if="formData.InviterId">
          <x-icon type="ios-close" size="0.35rem" class="icon-close" @click="formData.InviterId = null, formData.InviterName = null, formData.InviterPhone = null"></x-icon>
        </template>
        <template v-else>
          <x-icon type="ios-arrow-right" size="20" class="icon-right"></x-icon>
        </template>
      </li>
      <li>
        <div>邀请人</div>
        <span>{{formData.InviterName}}</span>
      </li>
      <li>
        <div>邀请人手机号</div>
        <span>{{formData.InviterPhone}}</span>
      </li>
    </ul>
    <div class="btn" @click="bindTap">绑定</div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        formData: {
          InviterId: null,             // 邀请人id
          InviterName: '',                  // 邀请人姓名
          InviterPhone: ''           // 邀请人手机
        }
      }
    },
    mounted: function () {
    },
    methods: {
      /**
       * input输入
      */
      inviterIdInp () {
        if (this.formData.InviterId.length >= 5) {
          this.checkInvCodeId((res) => {
            if (res.data.status !== this.api.ERR_OK) {
              this.$vux.toast.text(res.data.msg)
              return false
            } else {
              this.formData.InviterName = res.data.data.beCardName
              this.formData.InviterPhone = res.data.data.bePhone
            }
          })
        } else {
          this.formData.InviterName = ''
          this.formData.InviterPhone = ''
        }
      },
      /**
       * 检测邀请码ID是否正确
      */
      checkInvCodeId (fun) {
        if (!this.formData.InviterId.match(/^[A-Z]\d{4,}$/)) {
          this.$vux.toast.text('邀请码对应用户不存在')
          return false
        }
        this.$http.post(`${this.api.getInvitationInfo}`, {
          recommendCode: this.formData.InviterId
        }).then((res) => {
          fun(res)
        })
      },
      /**
       * 绑定按钮提交
      */
      bindTap () {
        if (!this.formData.InviterId) {
          this.$vux.toast.text('请输入邀请码')
          return false
        }
        this.checkInvCodeId((res) => {
          if (res.data.status !== this.api.ERR_OK) {
            this.$vux.toast.text(res.data.msg)
            return false
          } else {
            // 提交
            this.$http.post(`${this.api.bandRecommendRelation}`, {
              invitationCode: this.formData.InviterId,
              recommendCode: this.formData.InviterId
            }).then((res) => {
              this.$vux.toast.text(res.data.msg)
              if (res.data.status !== this.api.ERR_OK) {
                return false
              }
              this.$router.back()
            })
          }
        })
      }
    }
  }
</script>
<style scoped lang=less>
  .bindInviter-wrap{
    ul{
      li{
        display: flex;
        align-items: center;
        height: .96rem;
        border-bottom: 1px solid #dddddd;
        margin: 0 .28rem;
        color: #999999;
        font-size: .28rem;
        div:nth-child(1){
          font-size: .26rem;
          min-width: 2.26rem;
          color: #333333;
        }
        input{
          height: 100%;
          background: none;
          font-size: .28rem;
          color: #999999;
        }
        input, span{
          display: block;
          flex: 1;
        }
        .icon-right{
          fill: #cccccc;
          width: .44rem;
          height: .44rem;
        }
        .icon-close{
          fill: #cccccc;
          width: .44rem;
          height: .44rem;
        }
      }
    }
    .btn{
      margin: .9rem .4rem;
      text-align: center;
      color:#fff;
      height: .9rem;
      line-height: .9rem;
      font-size: 0.3rem;
      background:#f9b7b7;
      border-radius: .45rem;
      background: -webkit-gradient(linear, left top, right top, from(#f77574), to(#ed3638));
      background: linear-gradient(90deg, #f77574, #ed3638);
      -webkit-background: -webkit-gradient(linear, left top, right top, from(#f77574), to(#ed3638));
    }
  }
</style>