<template>
  <div class="realNameAuth">
    <!--未认证-->
    <div class="unverified" v-if="types == 1">
      <ul>
        <li @click="popShow = true">
          <div v-if="cardType">{{cardType | IDStatusFilter}}</div>
          <div v-else>请选择证件类型</div>
         <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
          <input type="text" placeholder="请输入真实姓名" v-model="realName">
        </li>
        <li>
          <input type="text" placeholder="请输入证件号码" v-model="idCard" @blur="inpBlur">
        </li>
      </ul>
      <div class="unverified-btn" @click="authentica">实名认证</div>
    </div>
    <!--已认证-->
    <div class="authenticated" v-if="types == 0">
      <div class="authenticated-user">
        <img src="../../assets/images/partnerPlan/plan-portrait-def2.png" >
        <div>已实名</div>
      </div>
      <ul>
        <li><span>证件类型：</span><span>{{personalData.cardType == 1 ? '身份证' : '护照'}}</span></li>
        <li><span>姓名：</span><span>{{personalData.cardName | filterName}}</span></li>
        <li><span>证件号：</span><span>{{personalData.idCard | filterCard}}</span></li>
      </ul>
    </div>
    <!--选择证件类型弹窗-->
    <div v-transfer-dom>
      <popup v-model="popShow" position="bottom" max-height="50%">
        <div class="popBox">
          <!--标题-->
          <div class="title">请选择</div>
          <!--列表-->
          <ul>
            <li v-for="(v,index) in popData" @click="selectID(v.status)">{{ v.status | IDStatusFilter }}</li>
          </ul>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import Utils from '../../assets/js/untils.js'
  import {Popup, TransferDom} from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Popup,
      Utils
    },
    data () {
      return {
        registerStatus: null,                  // 是否积分系统注册状态
        personalData: '', // 用户信息
        pageOrigin: '',  // 页面来源
        types: '', // 0 已认证 1 未认证
        realName: '', // 真实姓名
        idCard: '',    // 身份证
        flag: null,      // 身份证是否正确
        popShow: false,  // 证件类型是否显示
        cardType: '',   // 证件类型选择的值
        popData: [{'status': '1', active: false}, {'status': '2', active: false}] // 证件类型
      }
    },
    mounted: function () {
      this.types = this.$route.query.types
      this.pageOrigin = this.$route.query.pageOrigin
      this.getPersonalInfo()
      this.getRegisterStatus()
    },
    methods: {
      /**
       * 证件类型选择
      */
      selectID (v) {
        this.cardType = v
        this.popShow = false
        // this.idCard = ''
      },
      /**
       * 证件输入验证
      */
      inpBlur () {
        if (parseInt(this.cardType) === 1) {
          this.flag = Utils.filterIdCard(this.idCard)
        }
      },
      /**
       * 获取个人信息
      */
      getPersonalInfo () {
        this.$http.post(`${this.api.personalInfo}`, {
          id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          let resData = res.data.data
          this.personalData = resData.user
        })
      },
      /**
       * 判断用户是否在系统中注册
      */
      getRegisterStatus () {
        this.$http.get(`${this.api.getRegisterStatus}`, {
          params: {
            belongSystem: 5
          }
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.registerStatus = resData.data
        })
      },
      /**
       * 提交认证
      */
      authentica () {
        if (!this.cardType) {
          this.$vux.toast.text('请选择证件类型')
          return false
        }
        if (this.realName === '') {
          this.$vux.toast.text('请输入真实姓名')
          return false
        } if (this.idCard === '') {
          this.$vux.toast.text('请输入证件号')
          return false
        } if (this.flag === null) {
          this.flag = Utils.filterIdCard(this.idCard)
        }
        if (this.flag !== true && parseInt(this.cardType) === 1) {
          this.$vux.toast.text(this.flag)
          return false
        }
        this.$http.post(this.api.realAuthentication, {
          cardName: this.realName,
          idCard: this.idCard,
          id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId,
          cardType: this.cardType
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.$vux.toast.text('认证成功')
            if (this.pageOrigin === 'set') { // 个人信息设置页面进来的
              this.$router.back()
            } else { // 升级弹窗点击未认证进来的
              if (parseInt(this.registerStatus) === 0) { // 是否注册积分系统的
                window.location.href = window.location.href.split('mshop')[0] + 'points/register'
              } else {
                if (this.pageOrigin === 'region') { // 地区页面进来的
                  this.$router.history.go(-2)
                } else {
                  this.$router.back()
                }
              }
            }
          } else {
            this.$vux.toast.text(resData.msg)
          }
        })
      }
    }
  }
</script>
<style lang=less>
  .realNameAuth{
    height: calc(100vh);
    overflow-y: scroll;
    background: #eee;
    /**未认证**/
    .unverified{
      ul {
        li{
          background: #fff;
          height: .88rem;
          border-bottom: .02rem solid #eeeeee;
          padding: 0 .35rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: .24rem;
          color: #999999;
          input{
            width: 100%;
            height: .88rem;
            font-size: .24rem;
            color: #999999;
          }
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
          height: .88rem;
          line-height: .88rem;
          border-bottom: .02rem solid #eeeeee;
          padding-right:.35rem;
          font-size: .24rem;
          color: #666666;
          span{
            display: inline-block;
          }
          span:nth-child(1){
            width: 1.6rem;
            text-align: right;
          }
        }
      }    
    }
  }
  /**证件类型弹窗**/
  .popBox{
    text-align: center;
    position: relative;
    z-index: 5000;
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