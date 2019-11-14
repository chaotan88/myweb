 <template>
   <div class="region-wrap">
     <div class="region-option">
       <div class="region-option-title">完善个人信息</div>
      <ul>
        <li @click="personalData.areaDisabled ? '' : showAddress = true">
          <div>地区</div>
          <div class="addName">{{addressName}}</div>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
         <li @click="personalData.cardNameDisabled ? '' : popShow = true">
          <div>证件类型</div>
          <div>{{personalData.cardType | IDStatusFilter}}</div>
         <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
          <div>真实姓名</div>
          <input type="text" placeholder="请输入真实姓名" v-model="personalData.cardName" :disabled="personalData.cardNameDisabled" maxlength="20">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
          <div>证件号码</div>
          <input type="text" placeholder="请输入证件号码" v-model="personalData.idCard" :disabled="personalData.idCardDisabled" @blur="inpBlur" @input="fillterCertificates">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
      </ul>
     </div>
     <div class="region-option">
       <div class="region-option-title">填写邀请人信息</div>
      <ul>
        <li>
          <div>邀请人ID</div>
          <input type="text" placeholder="请输入邀请人ID" v-model="InvitationData.beInvitationCode" :disabled="InvitationData.CodeDisabled " @input="inviterIdInp" maxlength="5">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
          <div>邀请人</div>
          <input type="text" disabled v-model="InvitationData.beCardName">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
      </ul>
     </div>
      <!--地址选择-->
      <group class="address">
        <x-address style="font-size: 0.26rem; display:none;" :show.sync="showAddress" :title="title" v-model="addressCode" :list="addressData" placeholder="请选择地址" @on-hide="selectArea"></x-address>
      </group>
      <!--提交按钮-->
      <div class="btn-box">
        <div class="submit-btn" @click="confirm">提交信息</div>
      </div>
      <!--选择证件类型弹窗-->
      <div v-transfer-dom>
        <popup v-model="popShow" position="bottom" max-height="50%">
          <div class="rePopBox">
            <!--标题-->
            <div class="title">请选择</div>
            <!--列表-->
            <ul>
              <li v-for="(v,index) in popData" @click="selectID(v.status)">{{ v.status | IDStatusFilter }}</li>
            </ul>
          </div>
        </popup>
      </div>
      <!--升级成功弹窗-->
      <x-dialog v-model="showDialog" :dialog-style="{'text-align': 'left', width: '5.2rem', 'max-width': '5.2rem','background': 'none', overflow: 'auto'}">
        <div class="upgrade-dialog">
          <img src="../../assets/images/my/upgrade.png">
          <div class="upgrade-btn" @click="upgradeTap">确定</div>
          <!-- <x-icon type="ios-close-outline" size="30" @click="showDialog = false"></x-icon> -->
        </div>
      </x-dialog>
   </div>
 </template>
 <script>
  import ChinaAddressV4Data from '../../assets/js/china_address_v4.json'
  import { Group, XAddress, TransferDom, Value2nameFilter as value2name, Popup, XDialog } from 'vux'
  import Utils from '../../assets/js/untils.js'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Group,
      XAddress,
      TransferDom,
      Popup,
      XDialog,
      Utils
    },
    data () {
      return {
        personalData: {},                           // 用户信息
        InvitationData: {                           // 邀请人信息
          bindStatus: '',
          beCardName: '',
          beInvitationCode: '',
          bePhone: ''
        },
        showCitySelect: false,                      // 是否显示城市选择
        flag: null,                                 // 身份证是否正确
        popData: [                                  // 证件类型
          {'status': '1', active: false},
          {'status': '2', active: false}
        ],
        showDialog: false,                          // 升级成功弹窗
        popShow: false,                            // 证件类型是否显示
        codeIdIsTrue: false,                       // 邀请人id是否正确
        registerStatus: null,                      // 是否积分系统注册状态
        isSetName: '',                             // 是否实名认证标识
        title: '地区',
        addressCode: [],                           // 省市区code集合
        addressName: '',                           // 省市区name集合
        addressData: ChinaAddressV4Data,
        showAddress: false
      }
    },
    mounted () {
      this.isSetName = this.$route.query.isSetName
      this.getPersonalInfo()        // 获取用户信息
      this.getRegisterStatus()
    },
    methods: {
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
       * 获取个人信息
      */
      getPersonalInfo () {
        this.$http.post(`${this.api.personalInfo}`, {
          id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId || ''
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          let resData = res.data.data
          // 用户基本信息
          this.personalData = resData.user
          // 邀请人信息
          this.InvitationData.bindStatus = resData.bindStatus
          this.InvitationData.beCardName = resData.beCardName
          this.InvitationData.beInvitationCode = resData.beInvitationCode
          this.InvitationData.bePhone = resData.bePhone
          // 城市code默认赋值
          this.addressCode = [resData.user.userProvinceCode, resData.user.userCityCode, resData.user.userZoneCode]
          var cityName = this.getName(this.addressCode).split(' ')
          this.addressName = cityName.toString().replace(/,/g, ' ')
          // 设置是否可输入或点击
          if (this.personalData.cardName) {
            this.$set(this.personalData, 'cardNameDisabled', true)
          } if (this.personalData.idCard) {
            this.$set(this.personalData, 'idCardDisabled', true)
          } if (this.personalData.userProvinceCode) {
            this.$set(this.personalData, 'areaDisabled', true)
          } if (this.InvitationData.beInvitationCode) {
            this.$set(this.InvitationData, 'CodeDisabled', true)
            this.codeIdIsTrue = true
          }
        })
      },
      /**
       * 地址选择赋值
      */
      selectArea (val) {
        if (val) {
          var cityName = this.getName(this.addressCode).split(' ')
          this.addressName = cityName.toString().replace(/,/g, ' ')
        }
      },
      /**
       * 通过code获取省市区名称
      */
      getName (value) {
        return value2name(value, ChinaAddressV4Data)
      },
      /**
       * 证件输入验证
      */
      inpBlur () {
        if (parseInt(this.personalData.cardType) === 1) {
          this.flag = Utils.filterIdCard(this.personalData.idCard)
        }
      },
      /**
       * 证件类型选择
      */
      selectID (v) {
        this.personalData.cardType = v
        this.popShow = false
      },
      /**
       * 邀请人id输入
      */
      inviterIdInp () {
        if (this.InvitationData.beInvitationCode.length >= 5) {
          this.checkInvCodeId((res) => {
            if (res.data.status !== this.api.ERR_OK) {
              this.$vux.toast.text(res.data.msg)
              this.codeIdIsTrue = false      // 邀请码是否正确
              return false
            } else {
              this.codeIdIsTrue = true      // 邀请码是否正确
              this.InvitationData.beCardName = res.data.data.beCardName
            }
          })
        } else {
          this.InvitationData.beCardName = ''
        }
      },
      /**
       * 检测邀请码ID是否正确
      */
      checkInvCodeId (fun) {
        if (!this.InvitationData.beInvitationCode.match(/^[A-Z]\d{4,}$/)) {
          this.$vux.toast.text('邀请码对应用户不存在')
          return false
        }
        this.$http.post(`${this.api.getInvitationInfo}`, {
          recommendCode: this.InvitationData.beInvitationCode
        }).then((res) => {
          fun(res)
        })
      },
      /**
       * 证件号过滤
      */
      fillterCertificates (e) {
        var value = event.target.value
        value = value.replace(/[^\w/]/ig, '')
        this.personalData.idCard = value
      },
      /**
       * 提交
      */
      confirm () {
        if (this.addressCode.filter(d => d).length <= 0) {
          this.$vux.toast.text('请选择地区')
          return false
        }
        if (!this.personalData.cardNameDisabled && !this.personalData.idCardDisabled) {
          if (!this.personalData.cardType) {
            this.$vux.toast.text('请选择证件类型')
            return false
          } if (!this.personalData.cardName) {
            this.$vux.toast.text('请输入真实姓名')
            return false
          } if (!this.personalData.idCard) {
            this.$vux.toast.text('请输入证件号')
            return false
          } if (this.flag === null) {
            this.flag = Utils.filterIdCard(this.personalData.idCard)
          } if (this.flag !== true && parseInt(this.personalData.cardType) === 1) {
            this.$vux.toast.text(this.flag)
            return false
          }
        } if (!this.InvitationData.CodeDisabled) {
          if (!this.InvitationData.beInvitationCode) {
            this.$vux.toast.text('请输入邀请码')
            return false
          }
        } if (!this.codeIdIsTrue) {
          this.$vux.toast.text('邀请码对应用户不存在')
          return false
        }
        this.$vux.loading.show({
          text: '数据提交中'
        })
        var cityName = this.getName(this.addressCode).split(' ')
        this.$http.post(`${this.api.upgradeSaveInfo}`, {
          id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId || '',
          userProvince: cityName[0] || '',
          userProvinceCode: this.addressCode[0] || '',
          userCity: cityName[1] || '',
          userCityCode: this.addressCode[1] || '',
          userZone: cityName[2] || '',
          userZoneCode: this.addressCode[2] || '',
          cardName: this.personalData.cardName,
          idCard: this.personalData.idCard,
          beInvitationCode: this.InvitationData.beInvitationCode,
          cardType: this.personalData.cardType
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.status === this.api.ERR_OK) {
            this.showDialog = true
          }
        }).finally(() => {
          this.$vux.loading.hide()
        })
      },
      /**
       * 升级成功弹窗确定
      */
      upgradeTap () {
        // if (parseInt(this.registerStatus) === 0) { // 是否注册积分系统的
        //   window.location.href = window.location.href.split('mshop')[0] + 'points/register'
        // } else {
        //   this.$router.history.go(-1)
        // }
        this.$router.history.go(-1)
      }
    }
  }
</script>
 <style lang=less>
 .region-wrap{
   width: 7.5rem;
   .region-option{
    .region-option-title{
      height: .6rem;
      line-height: .6rem;
      background: #eeeeee;
      font-size: .24rem;
      color: #9c9c9c;
      padding: 0 .2rem;
    }
    ul{
      li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        height: 0.96rem;
        font-size: .26rem;
        color: #333333;
        margin: 0 .2rem;
        div:nth-child(2){
          flex:1;
          text-align: right;
          color: #999999;
        }
        input{
          text-align: right;
          flex: 1;
          height: 100%;
          background: none;
          color: #999999;
        }
        div:nth-child(1){
          color: #333333;
        }
        .addName{
          flex: 1;
          text-align: right;
          color: #999999;
        }
        .address{
          .vux-no-group-title{
            margin-top: 0 !important;
          }
        }
        .vux-cell-box:before{
          border-top: none;
        }
        .weui-cells:before{
          border-top: none;
        }
        .vux-no-group-title{
          margin-top: 0;
        }
        .weui-cells:after{
          border-bottom: none;
        }
        .weui-cell_access .weui-cell__ft{
          padding-right: 0;
        }
        .weui-cell_access .weui-cell__ft:after{
          border: none;
        }
        .vux-x-icon{
          fill: #999;
          margin-left: .2rem;
        }
      }
    }
   }
  /*提交按钮*/
  .btn-box{
    margin-top:0.8rem;
    padding:0 0.3rem;
    .submit-btn{
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
 }
 /**证件类型弹窗**/
  .rePopBox{
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
  /**升级成功弹窗**/
  .upgrade-dialog{
    width: 5.2rem;
    margin: 0 auto;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background: #fff;
    position: relative;
    img{
      width: 4.12rem;
      display: block;
      margin: 0 auto;
      padding-top: .3rem;
    }
    .upgrade-btn{
      width: 100%;
     height: .9rem;
     text-align: center;
     line-height: .9rem;
     background: #fe9a01;
     color: #fff;
     border-bottom-left-radius: 8px;
     border-bottom-right-radius: 8px;
    }
    .vux-x-icon{
      width: .68rem;
      height: .68rem;
      fill: #bfbfbf;
      position: absolute;
      right: 0;
      top: -1.1rem;
    }
  }
 </style>