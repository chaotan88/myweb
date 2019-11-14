<template>
  <div class="realname-auth-wrap">
    <!--未认证-->
    <div class="unverified" v-if="types == 1">
      <ul>
        <li @click="popShow = true" class="id-type pos-r">
          <span>{{defaultVisible ? '选择证件类型' : cardTypeText}}</span>
        </li>
        <li>
          <input type="text" placeholder="请输入真实姓名" v-model="realName">
        </li>
        <li>
          <input type="text" placeholder="请输入证件号码" v-model="idCard" @blur="inpBlur">
        </li>
      </ul>
      <div class="sub-btn-wrap">
        <div class="ta-c sub-btn active" @click="authentica">实名认证</div>
      </div>
    </div>

    <!--已认证-->
    <div class="authenticated" v-if="types == 0">
      <div class="authenticated-user">
        <img src="../../assets/images/partnerPlan/plan-portrait-def2.png">
        <div>已实名</div>
      </div>
      <ul>
        <li><span>证件类型： </span>{{personalData.cardType | IDStatusFilter}}</li>
        <li><span>姓名： </span> {{personalData.cardName | filterName}}</li>
        <li><span>证件号： </span> {{personalData.idCard | filterID}}</li>
      </ul>
    </div>

    <!--选择证件类型弹窗-->
    <div v-transfer-dom>
      <popup v-model="popShow" position="bottom" max-height="50%" class="popbox-wrap">
        <div class="popBox">
          <!--标题-->
          <div class="title">请选择</div>
          <!--列表-->
          <ul>
            <li v-for="(v,index) in popData" @click="selectID(index)">{{ v.status | IDStatusFilter }}</li>
          </ul>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import {Popup, TransferDom} from 'vux'
  export default {
    data () {
      return {
        defaultVisible: true,
        popShow: false,
        types: 1,        // 0 已认证 1 未认证
        cardType: null,     // 证件类型
        cardTypeText: null,     // 证件类型
        realName: '',     // 真实姓名
        idCard: '',       // 身份证
        personalData: {},  // 用户信息
        popData: [{'status': '1', active: false}, {'status': '2', active: false}],  // 证件类型
        flag: null,
        aps: false
      }
    },
    directives: {
      TransferDom
    },
    components: {
      Popup
    },
    mounted: function () {
      this.types = parseInt(this.$route.query.types)
      if (this.types === 0) this.getPersonalInfo()
      if (this.types === 1) {
        this.aps = true
      }
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
       * 输入验证
      */
      selectID (v) {
        this.cardType = v + 1
        this.cardTypeText = v ? '护照' : '身份证（包含大陆、港澳台）'
        this.defaultVisible = false
        this.popShow = false
      },

      /**
       * 输入验证
      */
      inpBlur () {
        if (this.cardType === 1) {
          this.flag = this.$Utils.filterIdCard(this.idCard)
          // this.flag !== true && this.$vux.toast.text(this.flag)
        }
      },

      /**
       * 提交认证
      */
      authentica () {
        if (this.cardType === null) {
          this.$vux.toast.text('请选择证件类型')
          return false
        }
        if (this.realName === '') {
          this.$vux.toast.text('请输入真实姓名')
          return false
        }
        if (this.idCard === '') {
          this.$vux.toast.text('请输入证件号码')
          return false
        }
        if (this.flag === null) this.flag = this.$Utils.filterIdCard(this.idCard)
        if (this.flag !== true && parseInt(this.cardType) === 1) {
          this.$vux.toast.text(this.flag)
          return false
        }
        this.$vux.loading.show({
          text: '正在保存...'
        })
        this.$http.post(this.api.realAuthentication, {
          cardType: this.cardType,
          cardName: this.realName,
          idCard: this.idCard,
          id: JSON.parse(localStorage.getItem('integralUserInfo')).userId
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.$vux.toast.text('认证成功')
            // 用户从加盟信息页面跳过来的话就留在加盟信息页面
            if (parseInt(this.$route.query.ops) === 1) {
              this.$router.back()
              return false
            }
            // 用户从用户信息页面过来的话就留在用户信息页面
            if (this.aps === true) {
              console.log(1)
              this.$router.back()
              return false
            }
            // 调用接口(用户设置了支付密码，但没有绑卡，是直接跳绑卡页面)
            this.$http.get(`${this.api.ifPassword}`, {}).then((res) => {
              if (res.data.data === 1) {
                this.$router.push('/addPayChoose')
              } else {
                this.$router.push('/setup/sendCode')
              }
            })
            // this.$router.back()
          } else {
            this.$vux.toast.text(resData.msg)
          }
        }).finally(() => {
          this.$vux.loading.hide()
        })
      }
    }
  }
</script>
<style scoped lang=less>
  .realname-auth-wrap{
    height: calc(100vh);
    overflow-y: scroll;
    background: #eee;
    /**未认证**/
    .unverified{
      ul {
        li{
          background: #fff;
          height: 1.2rem;
          line-height: 1.2rem;
          color: #999999;
          border-bottom: .02rem solid #eeeeee;
          padding: 0 .35rem;
          input{
            width: 100%;
            height: 1.2rem;
            font-size: .3rem;
            /*color: #999999;*/
          }
        }
        .id-type:after{
          content: '';
          display: inline-block;
          height: 6px;
          width: 6px;
          border-width: 2px 2px 0 0;
          border-color: #C8C8CD;
          border-style: solid;
          -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
          transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
          position: absolute;
          top: 45%;
          right: .2rem;
        }
      }
      .unverified-btn{
        width: 6.72rem;
        height: .8rem;
        font-size: .26rem;
        color: #fff;
        border-radius: 6px;
        text-align: center;
        line-height: .8rem;
        margin: 0 auto;
        margin-bottom: .63rem;
        margin-top: .63rem;
        background: -webkit-linear-gradient(left, #f77574 , #ed3738); /* Safari 5.1 - 6.0 */
        background: linear-gradient(to right,#f77574 , #ed3738);
      }
    }
    /**已认证**/
    .authenticated{
      .authenticated-user{
        background: #fff;
        height: 2.6rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: .2rem;
        img{
          width:1.2rem;
          height:1.2rem;
          border:.05rem solid #96684d;
          border-radius: 1.2rem;
        }
        div{
          font-size: .28rem;
          color:#666666;
          margin-top: .1rem;
        }
      }
      ul {
        li{
          background: #fff;
          height: 1.1rem;
          line-height: 1.1rem;
          border-bottom: .02rem solid #eeeeee;
          padding: 0 .35rem;
          font-size: .28rem;
          color: #666666;

          span{
            display: inline-block;
            width: 1.5rem;
            text-align: right;
          }
        }
      }
    }

    .sub-btn-wrap{
      padding: 0 .3rem;
    }
  }

  .popBox{
    text-align: center;
    /*标题*/
    .title{
      height: .8rem;
      line-height: .8rem;
      background: #f9f9f9;
    }
    /*内容*/
    ul{
      background: #fff;
      li{
        height: 0.8rem;
        line-height: 0.8rem;
        border-bottom: 1px solid #eee;
      }
    }
  }
</style>
