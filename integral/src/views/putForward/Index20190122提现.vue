<template>
  <div class="put-forward-wrap">
    <!-- 提现 -->
    <div class="forward-wrap pos-r" v-if="step === 1">
      <!--选择银行卡-->
      <div class="pick-card" @click="pickCardVisible = true" v-if="cardArr.length">
        <p class="d-ib">到账银行卡</p>
        <span>{{cardArr[curIndex].bankName}}（{{cardArr[curIndex].cardNo.slice(-4)}}）</span>
      </div>
      
      <!-- 可提现金额 -->
      <div class="putforward-box pos-r">
        <h3 class="ta-c">
          <strong class="d-ib">可提现金额：<span>{{presentBalance}}</span></strong>
        </h3>
        <div class="left fl-l ta-c">￥</div>
        <div class="center">
          <input type="text" ref="amountCash" placeholder="输入提现金额" v-model="amountCash" v-on:input ="inputFunc">
        </div>
        <div class="procedures pos-a procedures-red" v-if="amountCash > presentBalance">输入的金额超过可提现金额</div>
        <div class="procedures pos-a" v-else>额外扣除¥{{amountCash * WithdrawMes.withdrawalFees / 100}}手续费（费率{{WithdrawMes.withdrawalFees}}%）</div>
      </div>
      <!--提交按钮-->
      <div class="btn-box" v-if="step === 1">
        <div class="submit-btn" @click="confirm">提现</div>
      </div>
    </div>
    <!-- 提现成功 -->
    <div class="susses-wrap" v-else>
      <div class="susses-cen"></div>
      <h3 class="ta-c">申请成功，等待系统审核……</h3>
      <div class="btn-box">
          <div class="submit-btn" @click="goPage" v-if="step === 2">确定</div>
      </div>
    </div>
    
    <!--选择银行卡-底部弹框-->
    <div v-transfer-dom>
      <popup v-model="pickCardVisible" position="bottom" max-height="50%">
        <div class="card-list">
          <!--标题-->
          <div class="title">请选择到账银行卡</div>
          <!--列表-->
          <ul>
            <li v-for="(v,index) in cardArr" @click="selectCard(index)">
              <span>{{v.bankName}}（{{v.cardNo.slice(-4)}}）</span>
              <span class="card-icon">
                <icon type="success" v-if="curIndex === index"></icon>
                <icon type="circle" v-else></icon>
              </span>
            </li>
          </ul>
        </div>
      </popup>
    </div>

    <!--支付密码弹窗-->
    <div v-if="putforwardToast">
      <x-dialog v-model="putforwardToast">
        <div class="putforward-dialog-box">
          <div class="putforward-title">请输入支付密码</div>
          <div class="putforward-box">
            <span>提现金额</span>
            <span class="money">¥{{amountCash}}</span>
            <span>扣除¥{{amountCash * WithdrawMes.withdrawalFees / 100}}手续费（费率{{WithdrawMes.withdrawalFees}}%）,实际到账金额：¥{{amountCash - amountCash * WithdrawMes.withdrawalFees / 100}}</span>
          </div>
          <div class="putforward-card">
            到账银行卡 <span>{{cardArr[curIndex].bankName}}（{{cardArr[curIndex].cardNo.slice(-4)}}）</span>
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
  import {Popup, TransferDom, Icon, XDialog} from 'vux'
  import InputPassword from './../public/InputPassword'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Popup,
      Icon,
      XDialog,
      InputPassword
    },
    data () {
      return {
        personalData: {},           // 个人信息
        curIndex: 0,
        pickCardVisible: false,
        putforwardToast: false,
        password: '',
        clearFlag: true,
        presentBalance: 0,         // 可提现余额
        WithdrawMes: '',           // 提现比例及金额限制
        step: 1,                   // 提现步骤
        cardArr: [],              // 银行卡列表
        amountCash: ''           // 提现金额
      }
    },
    mounted () {
      this.getUserBalance()      // 获取可提现余额
      this.getSettleSet()        // 提现比例
      this.getCardList()          // 银行卡列表
      this.getPersonalInfo()
    },
    methods: {
      /**
       * 获取个人信息
      */
      getPersonalInfo () {
        this.$http.post(`${this.api.personalInfo}`, {
          id: JSON.parse(localStorage.getItem('integralUserInfo')).userId
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          let resData = res.data.data
          this.personalData = resData
        })
      },
      /**
       * 获取银行卡列表
       */
      getCardList () {
        this.$http.post(`${this.api.getCardList}`, {}).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.cardArr = res.data.data
        })
      },
      /**
       * 选择银行
      */
      selectCard (index) {
        this.curIndex = index
        this.pickCardVisible = false
      },
      /**
       * 获取可用余额
      */
      getUserBalance () {
        this.$http.post(this.api.getUserBalance).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.presentBalance = resData.data.cashPoints
          }
        })
      },
      /**
       * 提现比例
      */
      getSettleSet () {
        this.$http.post(this.api.getSettleSet).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.WithdrawMes = resData.data
          }
        })
      },
      /**
       * 金额输入
      */
      inputFunc () {
        if (this.amountCash > this.presentBalance) {
          var amountCashLen = this.amountCash.length
          this.$refs.amountCash.setAttribute('maxlength', amountCashLen)
        } else {
          this.$refs.amountCash.removeAttribute('maxlength')
        }
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
          let resData = res.data
          if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
            // 提现
            let withdrawalFees = this.amountCash * this.WithdrawMes.withdrawalFees / 100
            this.$vux.loading.show({
              text: '正在提交...'
            })
            this.$http.post(this.api.withdrawalApply, {
              bankName: this.cardArr[this.curIndex].bankName,
              cardholder: this.personalData.cardName,
              cardNum: this.cardArr[this.curIndex].cardNo,
              withdrawalAmount: this.amountCash,
              withdrawalFees: withdrawalFees
            }).then((res) => {
              let resData = res.data
              this.$vux.toast.text(res.data.msg)
              if (resData.status === this.api.ERR_OK) {
                this.step = 2
                this.putforwardToast = false
              }
            }).finally(() => {
              this.$vux.loading.hide()
            })
          } else {
            this.$vux.toast.text(resData.msg)
          }
        })
      },
      /**
       * 提交
      */
      confirm () {
        if (this.amountCash === '') {
          this.$vux.toast.text('请输入提现金额')
          return false
        } if (this.amountCash > this.presentBalance) {
          this.$vux.toast.text('可提现金额不足')
          return false
        } if (this.amountCash <= 0) {
          this.$vux.toast.text('提现金额不能为0')
          return false
        } if (this.amountCash < this.WithdrawMes.cashPointsLimit) {
          this.$vux.toast.text('最低提现金额为' + this.WithdrawMes.cashPointsLimit)
          return false
        }
        this.putforwardToast = true
      },
      /**
       * 返回到提现页面
      */
      goPage () {
        this.$router.replace('/myEarning')
      }
    }
  }
</script>

<style scoped lang=less>
  .put-forward-wrap {
    /*-----------------提现-------------*/
    .forward-wrap{
      height: 100vh;
      background: #eee;
      /*表单*/
      .pick-card{
        height: 1.4rem;
        line-height: 1.4rem;
        padding: 0 .5rem;
        background: #fff;
        border-bottom: 1px solid #eee;
        font-size: .26rem;

        p{
          width: 1.6rem;
        }
        span{
          color: #3333CC;
          padding-left: .2rem;
        }
      }
      .pick-card:after{
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-width: 2px 2px 0 0;
        border-color: #C8C8CD;
        border-style: solid;
        transform: matrix(.71, .71, -.71, .71, 0, 0);
        -webkit-transform: matrix(.71, .71, -.71, .71, 0, 0);
        position: absolute;
        top: .6rem;
        /*right: 17px;*/
        right: 0.6rem;
      }

      /*----------------可提现金额--------------*/
      .putforward-box{
        height: 3rem;
        background: #fff;

        h3{
          height: 1rem;
          line-height: 1rem;
          strong{
            height: 0.5rem;
            line-height: 0.5rem;
            padding: 0 0.2rem;
            font-size: 0.28rem;
            background: #f8f8f8;
            border-radius: 30px;

            span{
              color: #ff3e3e;
            }
          }
        }
        .left{
          color: #333;
          height: 1.34rem;
          line-height: 1.34rem;
          font-size: 0.5rem;
          width:1.3rem;
        }

        .center{
          width: 90%;
          height: 1.34rem;
          line-height: 1.34rem;
          margin: 0 auto;
          flex: 1;
          border-bottom: 1px solid #eee;

          input{
            height: 0.4rem;
            line-height: 0.4rem;
            font-size: 0.38rem;
            margin-top: 0.35rem;
          }
        }

        .procedures{
          color: #999;
          height: 0.7rem;
          line-height: 0.7rem;
          font-size: 0.25rem;
          left: 0.5rem;
          &.procedures-red{
            color: red;
          }
        }
      }
    }

    /*--------------提现成功-----------*/
    .susses-wrap{
      width: 100%;
      .susses-cen{
        width: 3.5rem;
        height: 3.5rem;
        margin: 0 auto;
        margin-top: 2rem;
        background: url(../../assets/images/susses.png) no-repeat -0.3rem 0;
        background-size: cover;
      }
    }

    /*提交按钮*/
    .btn-box{
      margin-top:0.8rem;
      padding:0 0.3rem;

      .submit-btn{
        height: 0.8rem;
        width: 100%;
        background: -webkit-gradient(linear, left top, right top, from(#7acde5), to(#5894de));
        text-align: center;
        line-height: 0.8rem;
        font-size: 0.32rem;
        color:#fff;
        border-radius: 0.1rem;
      }
    }
  }
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

  /*选中样式*/
  .active{
    color:#f23030;
  }
</style>
<style lang="less">
.card-list{
  background: #fff;
  .title{
    padding: .1rem .4rem;
    background: #eee;
  }
  li{
    height: .8rem;
    line-height: .8rem;
    padding: 0 .2rem;
    border-top: 1px solid #eee;

    span{
      padding-left: .2rem;
    }
    .card-icon{
      float: right;
    }
  }
  .choised{
    background: #ddd;
  }
}
.weui-dialog{
  max-width: none !important;
}
</style>

