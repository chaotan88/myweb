<template>
    <div>
      <div class="idPhone">
        <span>手机号</span>
        <input type="tel" placeholder="请输入转赠好友手机号" @focus="searchFriends" v-model="friendPhone" maxlength="11"/>
        <p style="width: 35%;height: 1rem;line-height: 1rem;text-align: right" v-if="hideF"></p>
        <p style="width: 35%;height: 1rem;line-height: 1rem;text-align: right" v-if="showF">{{friendsName | filterName}}<b>({{friendsCode}})</b></p>
      </div>
      <div class="givingPointsNum">
        <span>转赠积分</span>
        <div class="numPoints">
          <div class="inputBox">
            <b>￥</b>
            <input type="text" placeholder="请输入正整数" v-model="value" @focus="inputChange()" oninput = "value=value.replace(/[^\d]/g,'')"/>
            <x-icon type="ios-close" size="30" v-if="closeControl" @click="clearInput"></x-icon>
          </div>
          <p>可转赠积分：{{cashPoints || 0}}个</p>
        </div>
      </div>
      <div class="submitGiving" @click="checkBox"><button>转赠</button></div>

      <!--确认消息弹框-->
      <x-dialog v-model="showToast" class="register-confirm-wrap">
        <div class="register-confirm-box">
          <div class="confirm-header">
            <span class="fl-r" @click="showToast = false">×</span>
            <h3 class="ta-l">确认转赠会员信息</h3>
          </div>
          <div class="confirm-body">
            <p v-if="friendsName !== null" style="color: red;">请确认您的转赠信息，一旦确认将无法修改</p>
            <p v-if="friendsName === null" style="color: red;">此会员未实名，请确认身份后再转赠</p>
            <div>
              <dl>
                <dt>会员ID号</dt>
                <dd>{{friendsCode}}</dd>
              </dl>
              <dl>
                <dt>会员姓名</dt>
                <dd v-if="friendsName !== null">{{friendsName | filterName}}</dd>
                <dd v-if="friendsName === null" style="color: red;">未实名</dd>
              </dl>
              <dl>
                <dt>会员手机</dt>
                <dd>{{friendPhone | filterPhone}}</dd>
              </dl>
            </div>
          </div>
          <div class="confirm-footer">
            <div @click="showToast = false, edit()">修改转赠会员</div>
            <div @click="turnIntegral">确认转赠</div>
          </div>
        </div>
      </x-dialog>

      <!--支付密码弹窗-->
      <div v-if="putforwardToast">
        <x-dialog v-model="putforwardToast">
          <div class="putforward-dialog-box">
            <div class="putforward-title">请输入支付密码</div>
            <div class="putforward-box">
              <span>转赠积分</span>
              <span style="font-size: 0.7rem;color: #000;">{{value}}个</span>
            </div>
            <input-password :length="6"  @success="inputSuccess" v-model="password" :clearFlag="clearFlag"></input-password>
            <div class="pos-a close-btn" @click="putforwardToast = false">
              <span class="weui-icon weui_icon_cancel weui-icon-cancel"></span>
            </div>
          </div>
        </x-dialog>
      </div>
    </div>
</template>

<script>
  import { XButton, XDialog, XInput, Actionsheet } from 'vux'
  import InputPassword from './../public/InputPassword'
  export default {
    name: 'bankGivingPoints',
    data () {
      return {
        friendPhone: '',
        friendsName: null,
        friendsCode: null,
        friendsStatus: '',
        friendsId: '',
        value: '',
        closeControl: false,
        resData: '',
        hideF: true,
        showF: false,
        showToast: false,
        cashPoints: '',
        putforwardToast: false,
        clearFlag: true,
        password: ''
      }
    },
    components: {
      XButton,
      XDialog,
      XInput,
      Actionsheet,
      InputPassword
    },
    watch: {
      value () {
        if (this.value !== '') {
          this.closeControl = true
        }
      },
      friendPhone () {
        if (this.friendPhone.match(/^1\d{10}$/g)) {
          this.searchFriends()
          this.showF = true
          this.hideF = false
        } else {
          this.showF = false
          this.hideF = true
        }
      }
    },
    mounted () {
      this.getPartnerData()
    },
    methods: {
      inputChange () {
        let _that = this
        if (this.value !== '') {
          _that.closeControl = true
        }
      },
      clearInput () {
        this.value = ''
        this.closeControl = false
      },
      checkBox () {
        if (!this.friendPhone) {
          this.$vux.toast.text('请输入转赠手机号')
          return false
        } else if (!this.friendPhone.match(/^1\d{10}$/g)) {
          this.$vux.toast.text('请输入正确的手机号')
          return false
        } else if (this.value === '') {
          this.$vux.toast.text('请输入转赠积分')
          return false
        } else if (this.value > this.cashPoints) {
          this.$vux.toast.text('积分不足')
          return false
        } else if (this.friendPhone === JSON.parse(localStorage.getItem('integralUserInfo')).phone) {
          this.$vux.toast.text('不能转赠给自己')
          return false
        } else if (!this.resData[0]) {
          this.$vux.toast.text('账号不存在')
          this.hideF = true
          this.showF = false
          return false
        } else {
          this.showToast = true
        }
      },
      /**
       * 修改赠送会员
       */
      edit () {
        this.friendPhone = ''
        this.value = ''
      },
      /**
       * 确认转赠
       */
      turnIntegral () {
        this.putforwardToast = true
        this.showToast = false
      },
      /**
       * 密码输入完成
       */
      inputSuccess () {
        this.checkPassword()
      },
      /**
       * 校验支付密码是否正确
       */
      checkPassword () {
        this.$http.post(this.api.checkPassword, {
          id: JSON.parse(localStorage.getItem('integralUserInfo')).userId,
          paymentPassword: this.password
        }).then((res) => {
          if (res.data.status === '1') {
            this.$http.post(this.api.transferProperty, {
              beTransferUserId: this.friendsId,
              beTransferUserName: this.friendsName,
              beTransferUserPhone: this.friendPhone,
              beTransferInvitationCode: this.friendsCode,
              propertyAmount: this.value
            }).then((res) => {
              if (res.data.status === '1') {
                this.$router.push({path: '/bankGivingOk', query: {successNum: this.value}})
              }
            })
          } else {
            this.putforwardToast = false
            this.$vux.toast.text('您还未设置支付密码或密码错误!')
          }
        })
      },
      /**
       * 转赠搜索好友
       */
      searchFriends () {
        if (this.friendPhone.match(/^1\d{10}$/g)) {
          this.$http.get(this.api.getTransferUserByPhone, {
            params: {
              phone: this.friendPhone
            }
          }).then((res) => {
            console.log(res)
            this.resData = res.data.data
            if (this.resData[0]) {
              this.friendsName = this.resData[0].beTransferUserName
              this.friendsCode = this.resData[0].beTransferInvitationCode
              this.friendPhone = this.resData[0].beTransferUserPhone
              this.friendsStatus = this.resData[0].beTransferUserCardStatus
              this.friendsId = this.resData[0].beTransferUserId
            } else {
              this.$vux.toast.text('账号不存在')
              this.hideF = true
              this.showF = false
            }
          })
        }
      },
      /**
       * 获取会员升级数据
       */
      getPartnerData () {
        this.$http.post(this.api.getApplyInfoListByCustomerId).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.cashPoints = resData.data.cashPoints
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.idPhone{
  width: 100%;
  height: 1rem;
  background: #fff;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e4e4e4;
  span{
    display: block;
    width: 20%;
    height: 1rem;
    line-height: 1rem;
    margin-left: 0.2rem;
    font-size: 0.35rem;
  }
  input{
    width: 40%;
    height: 100%;
  }
}
  .givingPointsNum{
    width: 100%;
    height: 3rem;
    background: #fff;
    display: flex;
    span{
      display: block;
      width: 20%;
      height: 3rem;
      line-height: 3rem;
      margin-left: 0.2rem;
      font-size: 0.35rem;
    }
    .numPoints{
      width: 70%;
      height: 2.2rem;
      margin-top: 0.8rem;
      .inputBox{
        display: flex;
        align-items: center;
        background: #fff;
        border-bottom: 1px solid #e4e4e4;
        b{
          font-size: 0.5rem;
        }
        input{
          width: 100%;
          height: 1rem;
        }
      }
      P{
        margin-top: 0.2rem;
      }
    }
  }
  .submitGiving{
    width: 80%;
    height: 1rem;
    margin: 8% 10%;
    button{
      width: 100%;
      height: 100%;
      background: #ff9900;
      border: 0;
      -webkit-border-radius: 0.2rem;
      -moz-border-radius: 0.2rem;
      border-radius: 0.2rem;
      color: #fff;
    }
  }

.register-confirm-wrap{
  .weui-dialog{
    width: 100%;
    max-width: 6rem;
    border-radius: .1rem;
  }
}
/* -------------------- { 注册主体 } -------------------- */
.register-confirm-wrap{
  width: 100%;

  .register-confirm-box{
    /*padding: .2rem .3rem;*/
    border-radius: .05rem;

    .confirm-header{
      padding: .2rem .3rem;
      border-bottom: 1px solid #d9d9d9;

      span{
        font-size: .4rem;
        line-height: .44rem;
      }
    }

    .confirm-body{
      font-size: .2rem;
      margin: 0 .3rem;

      p{
        margin: .2rem 0;
        text-align: left;
        color: #f74d4d;
      }

      dl{
        display: flex;
        border: 1px solid #d9d9d9;
        height: .6rem;
        line-height: .6rem;

        dt{
          width: 40%;
          border-right: 1px solid #d9d9d9;
          background: #ebeef5;
        }

        dd{
          width: 60%;
          text-align: center;
        }

      }

      dl:nth-child(2) {
        border-top: 0;
        border-bottom: 0;
      }
    }

    .confirm-footer{
      display: flex;
      margin-top: .2rem;
      border-top: 1px solid #d9d9d9;

      div{
        width: 50%;
        /*color: #f74d4d;*/
        padding: .2rem 0;
        font-size: .24rem;
      }

      div:last-child{
        color: #fff;
        background: #f74d4d;
      }
    }
  }
}

  /*支付密码弹窗*/
.putforward-dialog-box{
  padding: .6rem;
  padding-top: .2rem;
  position: relative;

  .putforward-title{
    text-align: left;
    padding-bottom: .2rem;
    margin-bottom: .2rem;
    border-bottom: 1px solid #eee;
  }

  .putforward-box{
    padding-bottom: .1rem;
    span{
      display: block;
      font-size: .2rem;
    }
    .money{
      font-size: .6rem;
    }

    span:last-child{
      color: #aaa;
    }
  }
  .putforward-card{
    font-size: .2rem;
    text-align: left;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-bottom: .2rem;
    padding: .2rem;

    span{
      padding-left: .8rem;
      color: rgba(25, 158, 216, 0.819607843137255);
    }
  }

  .close-btn{
    right: .1rem;
    top: .1rem;
    .weui-icon-cancel{
      color: #aaa;
    }
  }
}
</style>
