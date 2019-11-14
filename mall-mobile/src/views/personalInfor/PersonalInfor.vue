<template>
    <div class="personalInfor">
      <!--表单-->
      <ul class="input-box">
        <li>
          <div class="left">头像</div>
          <div class="center">
            <img :src="headImg" v-if="headImg">
            <img src="../../assets/images/tcsj/info_03.jpg" v-if="!headImg" />
          </div>
          <form name="headImg" id="headImg">
            <input type="file" accept="image/*" name="file" @change="uploadImage('headImg')" class="headImg">
          </form>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li @click="showPhonePop">
          <div class="left">账号(手机号)</div>
          <div class="center" v-if="personalData.user">{{ personalData.user.phone }}</div>
          <!-- <div class="right" @click="showPhonePop">修改</div> -->
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <!--生日-->
        <!-- <group>
          <datetime style="font-size: 0.3rem;" :title="stitle" v-model="personalData.birthday" :min-year=1900 :max-year=2020></datetime>
        </group> -->
        <!--地址-->
        <group>
          <x-address style="font-size: 0.3rem;" :title="title" v-model="addressCode" :list="addressData" placeholder="请选择地址" @on-hide="selectArea"></x-address>
        </group>
        <!--性别-->
        <li @click="sexShow=true">
          <div class="left">性别</div>
          <div class="center" v-if="personalData.user">{{ personalData.user.sex | sexStatusFilter }}</div>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
          <div class="left">实名认证</div>
          <div class="center" @click="goAuthenticationPage(personalData.user.cardStatus)" v-if="personalData.user">{{ personalData.user.cardStatus| idcardIsPassFilter}}</div>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li @click="personalData.bindStatus == 0 ? $router.push('/bindInviter') : ''">
          <div class="left">绑定邀请人</div>
          <div class="center">
            {{personalData.beInvitationCode}}
            <span v-if="personalData.beCardName">({{personalData.beCardName}})</span>
          </div>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li  v-if="personalData.merchantCaStatus >= 0"  @click="goComtoMerchant(personalData.merchantCaStatus)">
          <div class="left">商户认证</div>
          <div class="center">{{merchant[personalData.merchantCaStatus]}}</div>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
      </ul>
      <!--提交按钮-->
      <!-- <div class="btn-box">
        <div class="submit-btn" @click="confirm">保存</div>
      </div> -->
      <!--修改手机号-->
      <modify-phone  ref="modifyPhone" :phoneData="personalData.user.phone" v-if="personalData.user"></modify-phone>
      <!--性别-底部弹框-->
      <div v-transfer-dom>
        <popup v-model="sexShow" position="bottom" max-height="50%">
          <div class="sexBox">
            <!--标题-->
            <div class="title">请选择</div>
            <!--列表-->
            <ul>
              <li  v-for="(v,index) in sexData" @click="selectSex(index)">{{ v.status | sexStatusFilter }}</li>
            </ul>
          </div>
        </popup>
      </div>
    </div>
</template>

<script>
  import ChinaAddressV4Data from '../../assets/js/china_address_v4.json'
  import { Group, XAddress, XButton, Cell, TransferDom, Popup, Datetime, Value2nameFilter as value2name } from 'vux'
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
        stitle: '生日',
        birthdayVal: '',
        personalData: {},    // 个人资料
        title: '地区',
        addressCode: [],         // 省市区code集合
        addressData: ChinaAddressV4Data,
        showAddress: false,
        sexShow: false,            // 性别底部弹框的显示隐藏
        sexData: [{'status': '0', active: false}, {'status': '1', active: false}, {'status': '2', active: false}], // 性别数据模拟
        birthdayShow: false,        // 生日底部弹框的显示隐藏
        headImg: '',
        merchant: ['未认证', '待审核', '审核成功', '审核失败'] // 商户认证状态
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
          id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          let resData = res.data.data
          this.personalData = resData
          if (this.personalData.user.avatar) {
            this.headImg = this.personalData.user.avatar
          }
          this.personalData.sex = !this.personalData.sex ? 0 : this.personalData.sex
          this.addressCode = [resData.user.userProvinceCode, resData.user.userCityCode, resData.user.userZoneCode]
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
      modifyPhoneData (phone) {
        var userInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
        userInfo.phone = phone
        localStorage.setItem('bsbUserInfo', JSON.stringify(userInfo))
        this.getPersonalInfo()
      },
      /**
       * 性别选择
      */
      selectSex (v) {
        this.personalData.user.sex = v
        this.sexShow = false
        this.confirm()
      },
      /**
       * 地区选择
      */
      selectArea (val) {
        if (val) {
          this.confirm()
        }
      },
      /**
       * 通过code获取省市区名称
      */
      getName (value) {
        return value2name(value, ChinaAddressV4Data)
      },
      /**
       * 跳转认证页面
      */
      goAuthenticationPage (val) {
        this.$router.push({path: '/realNameAuth', query: {types: val, pageOrigin: 'set'}})
      },
      /**
       * 跳转商户认证页面
      */
      goComtoMerchant (val) {
        this.$router.push({path: '/comtoMerchant', query: {status: val}})
      },
      /**
       * 提交
      */
      confirm () {
        var cityName = this.getName(this.addressCode).split(' ')
        this.$http.post(`${this.api.updatePersonalInfo}`, {
          id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId,
          cardName: this.personalData.cardName,
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
          // if (res.data.status === this.api.ERR_OK) {
          //   this.$router.push('/my')
          // }
        })
      },
      /**
       * 图片上传
       */
      uploadImage (id) {
        this.$vux.loading.show({
          text: '图片上传中'
        })
        let dom = document.getElementById(id)
        let formData = new FormData(dom)
        this.$http.post(this.api.uploadImg, formData).then((res) => {
          let resData = res.data
          this.$vux.loading.hide()
          if (resData.status === this.api.ERR_OK) {
            if (resData.data.match(/\.gif|png|jpg|jpeg/gi)) {
              this.headImg = resData.data
              this.addUserImg(resData.data)
            }
          } else {
          }
        }).catch(() => {
          this.$vux.loading.hide()
        })
      },
      /**
       * 跟新图片
       */
      addUserImg (url) {
        this.$http.post(this.api.saveAvatar, {
          avatar: url
        }).then((res) => {
          let resData = res.data
          this.$vux.loading.hide()
          if (resData.status === this.api.ERR_OK) {
            this.$vux.toast.text('上传头像成功')
            // this.getPersonalInfo()
          } else {
            this.$vux.toast.text(resData.msg)
          }
        }).catch(() => {
          this.$vux.loading.hide()
        })
      }
    }
  }
</script>

<style  lang=less>
  .personalInfor {
      height: 100vh;
      background: #eee;
      /*表单*/
      .input-box{
        background: #fff;
        .vux-no-group-title{
          margin-top: 0;
          &::before{
            border: none;
          }
          .vux-cell-value{
            font-size: .28rem;
            margin-right: .18rem;
          }
        }
        li{
          height: 0.8rem;
          line-height: 0.8rem;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items:center;
          padding-left: 0.3rem;
          padding-right: 0.1rem;
          .left{
            width:2.1rem;
          }
          .center{
            flex: 1;
            text-align: right;
            font-size: .28rem;
            color: #999;
            img{
              width: 0.53rem;
              height: 0.53rem;
              margin-top: 0.3rem;
              border-radius: 15px;
              border: 1px solid #fff;
            }
          }
          .vux-x-icon {
            fill: #999;
            margin-left: .2rem;
          }
        }
        li:first-child{
          /* padding-right: 0.25rem; */
          .right{
            color:#999;
          }
        }
      }
      /*提交按钮*/
      .btn-box{
        margin-top:0.8rem;
        padding:0 0.3rem;
        .submit-btn{
          height: 0.8rem;
          width: 100%;
          background: #f23030;
          text-align: center;
          line-height: 0.8rem;
          font-size: 0.32rem;
          color:#fff;
          border-radius: 0.1rem;
        }
      }

    }
  /*生日-底部弹框*/
  .sexBox{
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
  /*选中样式*/
  .active{
    color:#f23030;
  }
  /*手机号码验证-弹框*/
  .phoneCodeLayer{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 7.5rem;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
    .centent{
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
      .titleBox{
        height: 0.8rem;
        line-height: 0.8rem;
        border-bottom: 1px solid #eee;
        padding:0 0.1rem 0 0.3rem;
        .left{
          float: left;
        }
        .right{
          float: right;
          margin-top:0.15rem;
        }
      }
      /*表单*/
      .inputBox{
        padding:0 0.3rem;
        margin-bottom: 0.5rem;
        .input-box{
          li{
            position: relative;
            img{
              width: 0.25rem;
              height: 0.35rem;
              display: block;
              position: absolute;
              left: 0;
              bottom:0.25rem;
            }
            input{
              font-size: 0.28rem;
              margin-left: 0.4rem;
              width: 1.5rem;
              border:none;
            }
            .pwdInput{
              width:1.5rem;
            }
            .code{
              display: block;
              height: 0.5rem;
              line-height: 0.5rem;
              position: absolute;
              right: 0.5rem;
              bottom: 0.1rem;
              border-left:1px solid #eee;
              color:#ed3738;
              padding-left: 0.2rem;
              font-size: 0.24rem;
            }
          }
          .phone{
            width: 4.4rem;
            input{
              width: 5rem;
            }
          }
        }
      }
      /*按钮*/
      .btnBox{
        width: 2rem;
        height: 0.6rem;
        border:1px solid #999;
        margin:0 auto;
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
  .displayShow{
    display: none;
  }
  .headImg {
    position: absolute;
    right: 0;
    top: 0;
    height: 44px;
    opacity: 0;
  }
</style>
