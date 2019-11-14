<template>
  <div class="partnerUpgrad">
    <!--tabBar-->
    <div class="partnerUpgrad-tab">
      <ul>
        <li class="active">合伙人升级</li>
        <li @click="$router.push('/myAppliy')">我的申请</li>
      </ul>
    </div>
    <!--表单-->
    <div class="partnerUpgrad-form">
      <ul>
        <li>
          <div>当前身份</div>
          <div>{{partnerData.ruleName ? partnerData.ruleName : '无身份'}}</div>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
          <div>实名认证*</div>
          <div @click="goAuthenticationPage(partnerData.cardStatus)">{{partnerData.cardStatus | idcardAuthFilter}}</div>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li @click="sexShow = true">
          <div>性别*</div>
          <div>
            <span>{{partnerData.sex | sexStatusFilter}}</span>
          </div>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
        <group class="address">
          <x-address style="font-size: 0.26rem; padding:0" title="地区*" v-model="addressCode" :list="addressData" placeholder="请选择地址" @on-hide="this.selectArea"></x-address>
        </group>
        <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        
        <li>
          <!-- <div>选择升级合伙身份*</div>
          <div>未选择</div> -->
          <!-- <PopupPicker :data='identityData' title="选择升级合伙身份*" @on-change="onChange" v-model="selectIdentityData" :show-name="true" placeholder="未选择"></PopupPicker> -->
          <div>选择升级合伙身份*</div>
          <div v-if="isHighest">您已达最高等级，无需继续升级</div>
          <select @change="identChange(identSelected)" v-model="identSelected" v-else>
            <option disabled value="">未选择</option>
            <template v-for="(item,index) in prtnerIdentity">
              <option v-bind:value="item">{{item.ruleName}}</option>
            </template>
          </select>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
          <div>升级金额 *</div>
          <input  type="number" disabled :value="identSelected.agentFee">
          <div>元</div>
        </li>
      </ul>
    </div>
    <!--底部-->
    <div class="partnerUpgrad-footer" v-if="!isHighest">
      <div class="partnerUpgrad-footer-money">支付金额: <span>¥{{identSelected.agentFee ? identSelected.agentFee : 0}}</span></div>
      <div class="partnerUpgrad-footer-btn"  @click="addApply">提交申请</div>
    </div>
    <!--性别-底部弹框-->
    <div>
      <popup v-model="sexShow" position="bottom" max-height="50%">
        <div class="sexBox">
          <!--标题-->
          <div class="title">请选择</div>
          <!--列表-->
          <ul>
            <li  v-for="(v,index) in sexData" @click="selectSex(v)">{{ v.name }}</li>
          </ul>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import ChinaAddressV4Data from '../../assets/js/china_address_v4.json'
  import { Group, XAddress, Value2nameFilter as value2name, Popup, PopupPicker } from 'vux'
  export default {
    components: {
      Group,
      XAddress,
      Popup,
      PopupPicker
    },
    data () {
      return {
        partnerData: {},                                                       // 合伙人升级数据
        prtnerIdentity: [],                                                    // 合伙人身份数据
        identSelected: '',                                                     // 合伙人身份选中
        addressCode: [],                                                      // 省市区code集合
        addressData: ChinaAddressV4Data,
        sexShow: false,                                                       // 性别底部弹框的显示隐藏
        sexData: [{'status': '0', active: false, name: '保密'}, {'status': '1', active: false, name: '男'}, {'status': '2', active: false, name: '女'}], // 性别数据模拟
        sexSelected: '',
        isHighest: false      // 是否是最高级
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        this.getPartnerData()     // 合伙人升级数据
      })
    },
    methods: {
      /**
       * 通过code获取省市区名称
      */
      getName (value) {
        return value2name(value, ChinaAddressV4Data)
      },
      /**
       * 修改性别、城市更新个人信息
       * @ num 1 修改性别 2 修改地区
      */
      modifyPersonMessage (num) {
        var cityName = this.getName(this.addressCode).split(' ')
        let obj = {}
        if (num === 1) {
          obj = {
            id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId,
            sex: this.partnerData.sex || 0
          }
        } if (num === 2) {
          obj = {
            id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId,
            userProvince: cityName[0] || '',
            userProvinceCode: this.addressCode[0] || '',
            userCity: cityName[1] || '',
            userCityCode: this.addressCode[1] || '',
            userZone: cityName[2] || '',
            userZoneCode: this.addressCode[2] || ''
          }
        }
        this.$http.post(`${this.api.modifyPersonMe}`, obj).then((res) => {
          //
        })
      },
      /**
       * 性别选择
      */
      selectSex (v) {
        this.partnerData.sex = v.status
        this.sexShow = false
        this.modifyPersonMessage(1)
      },
      /**
       * 地区选择
      */
      selectArea () {
        this.modifyPersonMessage(2)
      },
      /**
       * 获取合伙人升级数据
      */
      getPartnerData () {
        this.$http.post(this.api.getApplyInfoListByCustomerId).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.partnerData = resData.data
            this.addressCode = [resData.data.userProvinceCode, resData.data.userCityCode, resData.data.userZoneCode]
            this.getPartnerIdentity() // 合伙人身份数据
          }
        })
      },
      /**
       * 获取合伙人身份
      */
      getPartnerIdentity () {
        this.$http.post(this.api.getRuleList).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.prtnerIdentity = resData.data.filter((row) => row.rand > this.partnerData.rand && row.agentFee)
            this.isHighest = this.prtnerIdentity.length > 0 ? 0 : 1
          }
        })
      },
      /**
       * 合伙人身份选择
      */
      identChange (val) {
        this.identSelected = val
      },
      /**
       * 跳转认证页面
      */
      goAuthenticationPage (val) {
        if (val === 1) {
          this.$router.push({path: '/realNameAuth', query: {types: 1}})
        }
      },
      /**
       * 提交申请
      */
      addApply () {
        if (this.partnerData.sex === '') {
          this.$vux.toast.text('请选择性别')
          return false
        } if (this.partnerData.cardStatus === '' || this.partnerData.cardStatus === 1) {
          this.$vux.toast.text('请先实名认证')
          return false
        } if (this.addressCode.length <= 0) {
          this.$vux.toast.text('请选择地区')
          return false
        } if (!this.identSelected) {
          this.$vux.toast.text('请选择合伙人身份')
          return false
        } if (!this.identSelected.agentFee) {
          this.$vux.toast.text('请重新选择合伙人身份')
          return false
        }
        this.$http.post(this.api.addApply, {
          id: this.$route.query.id ? this.$route.query.id : '',
          currentIdentity: this.partnerData.ruleName,
          currentIdentityId: this.partnerData.disRuleId,
          applyIdentity: this.identSelected.ruleName,
          applyIdentityId: this.identSelected.id,
          agentAmount: this.identSelected.agentFee,
          payAmount: this.identSelected.agentFee,
          payType: '',
          payStatus: '',
          payVoucher: ''
        }).then((res) => {
          let resData = res.data
          this.$vux.toast.text(resData.msg)
          if (resData.status === this.api.ERR_OK) {
            localStorage.setItem('partnerData', JSON.stringify(resData.data))
            this.$router.push('/partnerSubmission')
          }
        })
      }
    }
  }
</script>
<style  lang=less>
  .partnerUpgrad{
    .partnerUpgrad-tab{
      width: 7.5rem;
      height:1.41rem;
      display:flex;
      align-items:center;
      background:#fff;
      border-bottom:.3rem solid #eeeeee;
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      margin: auto;
      z-index: 300;
      ul{
        display:flex;
        width:7.07rem;
        height:.87rem;
        border:1px solid #3d74b3;
        margin:0 auto;
        line-height:.87rem;
        border-radius:5px;
        li{
          flex:1;
          text-align:center;
          color:#3d74b3;
          font-size:.28rem;
          &.active{
            background:#3d74b3;
            color:#fff;
          }
        }
      }
    }
    /**表单**/
    .partnerUpgrad-form{
      padding: 0 .3rem;
      /* height: calc(~"100vh - 1.71rem - 0.98rem - 1px"); */
      overflow-y: scroll;
      margin-top: 1.71rem;
      margin-bottom: 1.1rem;
      ul{
        li{
          display:flex;
          align-items:center;
          height:.99rem;
          border-bottom:1px solid #dddddd;
          font-size: .26rem;
          color: #999999;
          div:nth-child(1){
            flex:1;
            color: #333333;
          }
          .vux-x-icon{
            fill: #9e9e9e;
            margin-left: .1rem;
          }
          input{
            width: 1.7rem;
            height: .44rem;
            border: 1px solid #bdbdbd;
            background: #f0f0f0;
            font-size: .26rem;
            border-radius: 4px;
            margin-right: .18rem;
            text-align: center;
          }
          select{
            appearance:none;
            -moz-appearance:none;
            -webkit-appearance:none;
            flex: 1;
            height: 100%;
            background: none;
            border: none;
            direction: rtl;
            font-size: .26rem;
            color: #999999;
            outline:none;
          }
        }
        .address{
          .vux-no-group-title{
            margin-top: 0 !important;
          }
        }
        .weui-cell{
          padding: 0;
          height: .99rem;
        }
        .vux-cell-box:before{
          border-top: none;
        }
        .weui-cells:before{
          border-top: none;
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
      }
    }
    .partnerUpgrad-footer{
      width: 7.5rem;
      height: .98rem;
      border-top: 1px solid #dddddd;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      z-index: 300;
      .partnerUpgrad-footer-money{
        color: #666666;
        margin-right: .21rem;
        font-size: .28rem;
        span{
          font-size: .34rem;
          color: #f23030;
        }
      }
      .partnerUpgrad-footer-btn{
        width: 1.9rem;
        height: .98rem;
        background: #f23030;
        color: #fff;
        font-size: .3rem;
        text-align: center;
        line-height: .98rem;
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
  }
</style>