<template>
  <div class="user-index-wrap">
    <!--表单-->
    <ul class="input-box">
      <li @click="$router.push('/setup/phone')">
        <div class="left">账号（手机号）</div>
        <div class="center">
          <p>{{personalData.phone | filterPhone}}</p>
          <!-- <input type="text" placeholder="" value="userInfo.phone" disabled> -->
        </div>
      </li>

      <!--地址-->
      <group>
        <x-address style="font-size: 0.3rem;" :title="title" v-model="addressCode" :list="addressData" placeholder="请选择地址" @on-hide="saveAddress"></x-address>
      </group>

      <!-- 性别 -->
      <group>
        <div @click="sexShow=true">
          <cell is-link title="性别">{{ personalData.sex | sexStatusFilter}}</cell>
        </div>
      </group>

      <!-- 实名认证 -->
      <group>
        <cell is-link title="实名认证" :link="'/user/certification?types=' + personalData.cardStatus">{{personalData.cardStatus !== undefined ? personalData.cardStatus ? '去认证' : personalData.cardName + '（已实名）' : '去认证'}}</cell>
      </group>
    </ul>

    <!-- 银行卡 -->
    <div class="add-card" :class="{active: cardActive}" @click="addCard">
      <p>银行卡</p>
    </div>

    <!--支付宝-->
    <div class="add-zfb"  @click="addZfb">
      <div>支付宝收款账号</div>
      <div class="zfbzh">
        <div class="showCon">{{personalData.ifSetAlipay === 1 ? '已设置' : '未设置'}}</div>
        <div class="knowMore"></div>
      </div>
    </div>

    <!-- <div class="sub-btn-wrap">
          <div class="ta-c sub-btn active" @click="confirm">确认</div>
        </div> -->

    <!--修改手机号-->
    <modify-phone ref="modifyPhone" :phoneData="personalData.phone"></modify-phone>
    <!--性别-底部弹框-->
    <div v-transfer-dom>
      <popup v-model="sexShow" position="bottom" max-height="50%">
        <div class="sexBox">
          <!--标题-->
          <div class="title">请选择</div>
          <!--列表-->
          <ul>
            <li v-for="(v,index) in sexData" @click="selectSex(index)">{{ v.status | sexStatusFilter }}</li>
          </ul>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import ChinaAddressV4Data from 'src/assets/json/china_address_v4.json'
  import {
    Group,
    XAddress,
    XButton,
    Cell,
    TransferDom,
    Popup,
    Datetime,
    Value2nameFilter as value2name
  } from 'vux'
  import modifyPhone from '../public/modifyPhone'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Group,
      XAddress,
      XButton,
      Cell,
      TransferDom,
      Datetime,
      Popup,
      modifyPhone
    },
    data () {
      return {
        cardActive: false,
        stitle: '生日',
        birthdayVal: '',
        personalData: {}, // 个人资料
        title: '所在地',
        addressCode: [], // 省市区code集合
        addressData: ChinaAddressV4Data,
        showAddress: false,
        sexShow: false, // 性别底部弹框的显示隐藏
        sexData: [{
          'status': '0',
          active: false
        }, {
          'status': '1',
          active: false
        }, {
          'status': '2',
          active: false
        }], // 性别数据模拟
        birthdayShow: false // 生日底部弹框的显示隐藏
      }
    },
    mounted () {
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
          console.log(this.personalData)
          this.addressCode = [resData.userProvinceCode, resData.userCityCode, resData.userZoneCode]
        })
      },

      /**
       * 显示修改手机弹窗
       */
      showPhonePop () {
        this.$refs.modifyPhone.showModifyPhone()
      },
      /**
       * 更新手机号码
       */
      modifyPhoneData () {
        this.getPersonalInfo()
      },
      /**
       * 地址选择
       */
      saveAddress (flag) {
        flag && this.confirm()
      },
      /**
       * 性别选择
       */
      selectSex (v) {
        this.personalData.sex = v
        this.sexShow = false
        this.confirm()
      },
      /**
       * 通过code获取省市区名称
       */
      getName (value) {
        return value2name(value, ChinaAddressV4Data)
      },
      /**
       * 提交
       */
      addCard () {
        this.cardActive = true
        // this.$router.push('/user/cardManger')
        this.$router.push({path: '/user/cardManger', query: {bk: 1}})
        setTimeout(() => {
          this.cardActive = false
        }, 50)
      },
      /***
       * 提交
       * **/
      addZfb () {
        if (this.personalData.cardName) {
          // this.$router.push('/addAlipay')
          this.$router.replace({path: '/addAlipay', query: {qf: 1}})
        } else {
          // this.$router.push('/RealNameAuth')
          this.$router.push({path: '/user/certification', query: {types: this.personalData.cardStatus}})
        }
      },
      /**
       * 提交
       */
      confirm () {
        var cityName = this.getName(this.addressCode).split(' ')
        // console.log(cityName)
        this.$http.post(`${this.api.updatePersonalInfo}`, {
          id: JSON.parse(localStorage.getItem('integralUserInfo')).userId,
          userName: this.personalData.userName,
          sex: this.personalData.sex || 0,
          userProvince: cityName[0] || '',
          userProvinceCode: this.addressCode[0] || '',
          userCity: cityName[1] || '',
          userCityCode: this.addressCode[1] || '',
          userZone: cityName[2] || '',
          userZoneCode: this.addressCode[2] || '',
          birthday: this.personalData.birthday || ''
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .user-index-wrap {
    height: 100vh;
    background: #eee;
    /*表单*/
    .input-box {
      background: #fff;
      li {
        height: 1.1rem;
        line-height: 1.1rem;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        display: flex;
        padding-left: 0.3rem;
        padding-right: 0.1rem;
        .left {
          width: 50%;
        }
        .center {
          width: 50%;
          p {
            float: right;
            color: #999;
          }
        }
        .right {
          width: 1rem;
          text-align: right;
          .vux-x-icon {
            fill: #999;
            margin-top: 0.15rem;
          }
        }
      }
      li:first-child {
        padding-right: 0.25rem;
        .right {
          color: #999;
        }
      }
    }
    .sub-btn-wrap {
      padding: 0 .3rem;
    }

    /*添加银行卡*/
    .add-card{
      margin-top: .2rem;
      padding: 15px 15px;
      background: #fff;
      position: relative;

      p:after{
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
        right: 17px;
      }
    }
    /*添加支付宝*/
    .add-zfb{
      padding: 15px 15px;
      background: #fff;
      position: relative;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      .zfbzh{
        display: flex;
        .showCon{
          margin-right: 17px;
          color: #999999;
        }
        .knowMore{
          height: 6px;
          width: 6px;
          border-width: 2px 2px 0 0;
          border-color: #C8C8CD;
          border-style: solid;
          -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
          transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
          position: absolute;
          top: 45%;
          right: 17px;
        }
      }
    }
    .add-card.active{
      color: #333;
      background: #eee;
    }
  }


  /*生日-底部弹框*/

  .sexBox {
    text-align: center;
    /*标题*/
    .title {
      height: .8rem;
      line-height: .8rem;
      background: #f9f9f9;
    }
    /*内容*/
    ul {
      background: #fff;
      li {
        height: 0.8rem;
        line-height: 0.8rem;
        border-bottom: 1px solid #eee;
      }
    }
  }


  /*选中样式*/

  .active {
    color: #f23030;
  }


  /*手机号码验证-弹框*/

  .phoneCodeLayer {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 7.5rem;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
    .centent {
      width: 5.63rem;
      height: 4rem;
      background: #fff;
      border-radius: 4px;
      -webkit-border-radius: 4px;
      position: fixed;
      z-index: 300;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      overflow-y: auto;
      /*标题*/
      .titleBox {
        height: 0.8rem;
        line-height: 0.8rem;
        border-bottom: 1px solid #eee;
        padding: 0 0.1rem 0 0.3rem;
        .left {
          float: left;
        }
        .right {
          float: right;
          margin-top: 0.15rem;
        }
      }
      /*表单*/
      .inputBox {
        padding: 0 0.3rem;
        margin-bottom: 0.5rem;
        .input-box {
          li {
            position: relative;
            img {
              width: 0.25rem;
              height: 0.35rem;
              display: block;
              position: absolute;
              left: 0;
              bottom: 0.25rem;
            }
            input {
              font-size: 0.28rem;
              margin-left: 0.4rem;
              width: 1.5rem;
              border: none;
            }
            .pwdInput {
              width: 1.5rem;
            }
            .code {
              display: block;
              height: 0.5rem;
              line-height: 0.5rem;
              position: absolute;
              right: 0.5rem;
              bottom: 0.1rem;
              border-left: 1px solid #eee;
              color: #ed3738;
              padding-left: 0.2rem;
              font-size: 0.24rem;
            }
          }
          .phone {
            width: 4.4rem;
            input {
              width: 5rem;
            }
          }
        }
      }
      /*按钮*/
      .btnBox {
        width: 2rem;
        height: 0.6rem;
        border: 1px solid #999;
        margin: 0 auto;
        text-align: center;
        line-height: 0.6rem;
        font-size: 0.24rem;
      }
    }
  }


  /*字体图标*/

  .vux-x-icon {
    fill: #999;
  }


  /*显示隐藏*/

  .displayShow {
    display: none;
  }
</style>

<style lang="less">
  .user-index-wrap {
    .weui-cells,
    li {
      height: 1.1rem;
      font-size: .3rem;
      margin-top: -.02rem;
      .weui-cell {
        padding-top: .4rem !important;
      }
    }
  }
</style>
