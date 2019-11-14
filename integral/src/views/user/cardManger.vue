<template>
  <div>
    <div class="manger-card-wrap">
      <no-data-component v-if="!cardArr.length"></no-data-component>

      <div>
        <div v-for="(item, index) in cardArr" class="item-box" v-if="item.accountType === 1"
        @touchstart="showDeleteButton(index)"
        :style="{ background: 'linear-gradient(-45deg,' + backgrundGradient[index = index <= 3 ? index : index % 4].after + ',' + backgrundGradient[index = index <= 3 ? index : index % 4].front + ')'}">
          <p>
            {{item.bankName}}
            <span class="fast-pay">快捷<span class="pay" :style="{color: backgrundGradient[index = index <= 3 ? index : index % 4].after}">支付</span></span>
          </p>
          <p class="card-type">{{item.cardType | cardTypeFilter}}</p>
          <p>{{item.cardNo | cardNoFilter}}</p>
        </div>
      </div>

      <div class="add-card">
        <div class="add-btn" @click="getPersonalInfo">添加银行卡</div>
      </div>
    </div>

    <!--支付密码弹窗-->
    <div v-if="showToast">
      <x-dialog v-model="showToast">
        <div class="manger-card-dialog-box">
          <div class="title">请验证支付密码确认本人操作</div>
          <input-password :length="6"  @success="inputSuccess" v-model="password" :clearFlag="clearFlag"></input-password>
          <div class="pos-a close-btn" @click="showToast = false">
            <span class="weui-icon weui_icon_cancel weui-icon-cancel"></span>
          </div>
        </div>
      </x-dialog>
    </div>

    <x-dialog v-model="confirmVisible">
      <div class="manger-card-dialog-box del-card-box">
        <div class="ta-l title-head">解绑银行卡</div>
        <div class="title">确认将该银行卡解除绑定吗？</div>
        <div class="confirm-box">
          <p @click="confirmVisible = false">取消</p>
          <p class="confirmBtn" @click="delConfirm">确认</p>
        </div>
        <div class="pos-a close-btn" @click="confirmVisible = false">
          <span class="weui-icon weui_icon_cancel weui-icon-cancel"></span>
        </div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import noDataComponent from './../public/noData'    // 暂无数据
import InputPassword from './../public/InputPassword'
import {XDialog} from 'vux'
export default {
  components: {
    InputPassword,
    XDialog,
    noDataComponent
  },
  data () {
    return {
      cardArr: [],                         // 银行卡列表
      curId: '',                            // 删除当前银行卡id
      backgrundGradient: [{
        front: '#3cad7e',
        after: '#a8e785',
        visible: false
      }, {
        front: '#dd4e70',
        after: '#ff9b81',
        visible: false
      }, {
        front: '#414150',
        after: '#5e5e76',
        visible: false
      }, {
        front: '#53507a',
        after: '#ac85e7',
        visible: false
      }],                                  // 渐变背景色
      Loop: null,
      clearFlag: true,
      showToast: false,
      confirmVisible: false,
      isPayPasswordSte: null              // 是否设置交易密码 0：未设置， 1：已设置
    }
  },
  mounted () {
    this.isSetPaymentPassword()            // 是否设置了支付密码
    this.getCardList()
  },
  methods: {
    /**
     * 获取银行卡列表
     */
    getCardList () {
      this.$http.post(`${this.api.getCardList}`, {}).then((res) => {
        console.log(res)
        if (res.data.status !== this.api.ERR_OK || !res) return false
        this.cardArr = res.data.data
      })
    },
    /**
     * 跳转至银行卡详情
     */
    toCardInfo (index) {
      localStorage.setItem('curCardInfo', JSON.stringify(this.cardArr[index]))
      this.$router.push('/user/cardInfo')
    },
    /**
     * 添加银行卡
     */
    getPersonalInfo (index) {
      this.$http.post(`${this.api.personalInfo}`, {
        id: JSON.parse(localStorage.getItem('integralUserInfo')).userId
      }).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) return false
        let resData = res.data.data
        this.personalData = resData
        if (!this.personalData.cardName) {
          this.$router.push({path: '/user/certification', query: {types: 1}})
          return
        }
        this.addCard()
      })
    },
    /**
     * 长按事件
     */
    showDeleteButton (index) {
      this.curId = index
      clearInterval(this.Loop)
      this.Loop = setTimeout(() => {
        this.confirmVisible = true
      }, 1000)
    },
    clearLoop () {
      clearInterval(this.Loop)
    },
    /**
     * 删除
     */
    delConfirm () {
      this.$http.get(this.api.delCard, {
        params: {
          id: this.cardArr[this.curId].id
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
          this.confirmVisible = false
          this.getCardList()
        }
      })
    },
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
     * 添加银行卡
    */
    addCard () {
      if (this.isPayPasswordSte === null) {
        this.$vux.toast.text('登录过期，请重新登录！')
        return false
      }
      if (this.isPayPasswordSte === 0) {
        localStorage.setItem('setPawReturnPage', '/user/cardManger')       // 设置支付密码完成后要跳转的页面
        this.$router.push('/setup/sendCode')
      } if (this.isPayPasswordSte === 1) {
        this.showToast = true
        this.password = ''
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
          // console.log(parseInt(this.$route.query.bk))
          if (parseInt(this.$route.query.bk) === 1) {
            this.$router.replace({path: '/user/addCard', query: {cy: 1}})
          } else if (parseInt(this.$route.query.bk) === 2) {
            this.$router.replace({path: '/user/addCard', query: {cy: 2}})
          }
        } else {
          this.$vux.toast.text(resData.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.manger-card-wrap{
  height: 100vh;
  background: #eee;
  padding: .2rem;

  .item-box{
    width: 6.4rem;
    height: 1.8rem;
    margin: 0 auto .3rem;
    padding: .3rem .2rem .3rem .36rem;
    border-radius: .2rem .2rem 0 0;

    p{
      color: #fff;
      font-weight: 600;
      letter-spacing: 5px;
      margin-bottom: .1rem;

      .fast-pay{
        font-size: .22rem;
        font-style: italic;
        letter-spacing: 1px;

        .pay{
          // color: transparent;
          transform: skewX(-45deg);
          // background: #fff;
          position: relative;
        }
        .pay:before{
            content: '';
            position: absolute;
            top: 0;
            right: -2px;
            bottom: 0;
            left: 2px;
            background-color: #fff;
            transform: skewX(-15deg);
            z-index: -1;
        }
      }
    }

    .card-type{
      display: inline-block;
      width: 1.5rem;
      text-align: center;
      font-size: .26rem;
      border: 1px solid #fff;
      border-radius: .2rem;
      font-weight: normal;
      margin-bottom: .16rem;
      opacity: .5;
    }
  }

  .add-card{
    padding: .4rem .2rem;
    .add-btn{
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
</style>
<style lang="less">
  .weui-dialog{
    max-width: none !important;
  }

  /*-------------支付密码弹窗------------*/
  .manger-card-dialog-box{
    padding: .6rem;
    position: relative;

    .title{
      padding-bottom: .5rem;
    }

    .confirm-box{
      text-align: center;
      p{
        float: left;
        width: 50%;
        height: .7rem;
        line-height: .7rem;
        border-top: 1px solid #eee;
        color: #5894de;
        // box-sizing: border-box;
      }
      .confirmBtn{
        color: #fff;
        background: -webkit-gradient(linear, left top, right top, from(#7acde5), to(#5894de));
      }
    }
    .confirm-box:after{
      content: '';
      display: table;
      clear: both;
    }

    .close-btn{
      right: .1rem;
      top: .1rem;
      .weui-icon-cancel{
        color: #aaa;
      }
    }
  }
  .del-card-box{
    padding: 0;

    .title-head{
      margin: .2rem .3rem;
      padding-bottom: .2rem;
      border-bottom: 1px dashed #e6e6e6;
    }
    .title{
      color: #feaf3f;
    }
    .close-btn{
      top: 0 !important;
    }
  }
</style>

