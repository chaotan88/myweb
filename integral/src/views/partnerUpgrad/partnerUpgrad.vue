<template>
  <div class="partnerUpgrad">
    <!--tabBar-->
    <!-- <div class="partnerUpgrad-tab">
      <ul>
        <li class="active">会员升级</li>
        <li @click="$router.push('/myAppliy')">我的申请</li>
      </ul>
    </div> -->
    <!--表单-->
    <div class="partnerUpgrad-form">
      <ul>
        <li>
          <div>当前身份</div>
          <div>{{partnerData.ruleName ? partnerData.ruleName : '无身份'}}</div>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li @click="goAuthenticationPage(partnerData.cardStatus)">
          <div>实名认证*</div>
          <div>
            {{partnerData.cardStatus | idcardAuthFilter}}
            <span v-if="partnerData.cardStatus === 0">({{partnerData.cardName}})</span>
          </div>
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
            <x-address title="期望代理区域*" v-model="addressCode" :list="addressData" placeholder="请选择地址" @on-hide="this.selectArea"></x-address>
          </group>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>

        <li>
          <!-- <div>选择升级合伙身份*</div>
          <div>未选择</div> -->
          <!-- <PopupPicker :data='identityData' title="选择升级合伙身份*" @on-change="onChange" v-model="selectIdentityData" :show-name="true" placeholder="未选择"></PopupPicker> -->
          <div class="difference pos-a">选择加盟身份*</div>
          <div class="pos-a highest" v-if="isHighest">您已达最高等级，无需继续升级</div>
          <select @change="identChange(identSelected)" v-model="identSelected" v-else>
            <option disabled value="">未选择</option>
            <template v-for="(item,index) in prtnerIdentity">
              <option v-bind:value="item" v-if="item.ruleName && item.agentFee >= 160000">{{item.ruleName}}</option>
            </template>
          </select>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
          <div>升级金额 *</div>
          {{identSelected.agentFee | filterEmpty('元')}}
          <!-- <input  type="number" disabled :value="identSelected.agentFee"> -->
          <!-- <div> 元</div> -->
        </li>
      </ul>
    </div>
    <!--底部-->
    <div class="partnerUpgrad-footer" v-if="!isHighest">
      <div class="partnerUpgrad-footer-money">支付金额: <span>￥{{identSelected.agentFee ? identSelected.agentFee : 0}}</span></div>
      <div class="partnerUpgrad-footer-btn unclick" v-if="status==='2'">提交申请</div>
      <div class="partnerUpgrad-footer-btn"  @click="addApply" v-else>提交申请</div>
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
  import { Group, XAddress, ChinaAddressV4Data, Value2nameFilter as value2name, Popup, PopupPicker } from 'vux'
  export default {
    components: {
      Group,
      XAddress,
      Popup,
      PopupPicker
    },
    data () {
      return {
        partnerData: {},                                                       // 会员升级数据
        prtnerIdentity: [],                                                    // 会员身份数据
        identSelected: '',                                                     // 会员身份选中
        addressCode: [],                                                      // 省市区code集合
        addressData: ChinaAddressV4Data,
        sexShow: false,                                                       // 性别底部弹框的显示隐藏
        sexData: [{'status': '0', active: false, name: '保密'}, {'status': '1', active: false, name: '男'}, {'status': '2', active: false, name: '女'}], // 性别数据模拟
        sexSelected: '',
        isHighest: false,      // 是否是最高级
        status: '',
        cityName: []
      }
    },
    mounted: function () {
      this.status = this.$route.query.status
      this.$nextTick(() => {
        this.getPartnerData()     // 会员升级数据
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
        let obj = {}
        if (num === 1) {
          obj = {
            id: JSON.parse(localStorage.getItem('integralUserInfo')).userId,
            sex: this.partnerData.sex || 0
          }
          this.$http.post(`${this.api.modifyPersonMe}`, obj).then((res) => {
            //
          })
        }
        if (num === 2) {
          this.cityName = this.getName(this.addressCode).split(' ')
        }
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
       * 获取会员升级数据(个人身份信息)
       */
      getPartnerData () {
        this.$http.post(this.api.getApplyInfoListByCustomerId).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.partnerData = resData.data
            this.addressCode = [resData.data.userProvinceCode, resData.data.userCityCode, resData.data.userZoneCode]
            this.cityName = this.getName(this.addressCode).split(' ')
            // console.log(this.addressCode)
            // console.log(this.cityName)
            this.getPartnerIdentity() // 会员身份数据
          }
        })
      },
      /**
       * 获取会员升级身份列表
       */
      getPartnerIdentity () {
        this.$http.post(this.api.getRuleList).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.prtnerIdentity = resData.data.filter((row) => row.rand > this.partnerData.rand && row.agentFee)
            this.isHighest = this.prtnerIdentity.length > 0 ? 0 : 1
            this.$route.query.id && this.getApplyDetail()
          }
        })
      },
      /**
       * 会员身份选择
       */
      identChange (val) {
        this.identSelected = val
      },
      /**
       * 跳转认证页面
       */
      goAuthenticationPage (val) {
        if (val === 1 || val === null) {
          // ops判断是从本页面跳转过去认证，认证成功就返回本页面
          this.$router.push({path: '/user/certification', query: {types: 1, ops: 1}})
        } else {
          this.$router.push({path: '/user/certification', query: {types: 0}})
        }
      },

      /**
       * 获取申请详情（升级到下一等级的信息）
       */
      getApplyDetail () {
        this.$http.post(this.api.getApplyDetail, {
          id: this.$route.query.id
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.prtnerIdentity.map(item => {
              this.identSelected = item
            })
          }
        })
      },

      /**
       * 提交申请
       */
      addApply () {
        if (this.partnerData.cardStatus === '' || this.partnerData.cardStatus === 1) {
          this.$vux.toast.text('请先实名认证')
          return false
        }
        if (this.partnerData.sex === null) {
          this.$vux.toast.text('请选择性别')
          return false
        }
        if (this.addressCode.length && !this.addressCode[0]) {
          this.$vux.toast.text('请选择地区')
          return false
        }
        if (!this.identSelected) {
          this.$vux.toast.text('请选择会员身份')
          return false
        }
        if (!this.identSelected.agentFee) {
          this.$vux.toast.text('请重新选择会员身份')
          return false
        }
        this.$vux.loading.show({
          text: '正在提交...'
        })
        console.log(this.addressCode)
        console.log(this.cityName)
        console.log(this.identSelected.ruleName)
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
          payVoucher: '',
          agentProvince: this.cityName[0] || '',
          agentProvinceCode: this.addressCode[0] || '',
          agentCity: this.cityName[1] || '',
          agentCityCode: this.addressCode[1] || '',
          agentZone: this.cityName[2] || '',
          agentZoneCode: this.addressCode[2] || ''
        }).then((res) => {
          console.log(res)
          let resData = res.data
          this.$vux.toast.text(resData.msg)
          if (resData.status === this.api.ERR_OK) {
            localStorage.setItem('partnerData', JSON.stringify(resData.data))
            this.$router.push('/user/partnerSubmission')
          }
        }).finally(() => {
          this.$vux.loading.hide()
        })
      }
    }
  }
</script>
<style  lang=less>
  .partnerUpgrad{
    background: #fff;
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
      /*margin-top: 1.71rem;*/
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

          .difference{
            flex:1.5 !important;
          }

          .highest{
            right: 0.3rem;
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
          &:last-child{
            border-bottom:none;
          }
        }
        .address{
          .vux-no-group-title{
            margin-top: 0 !important;
            background: none;
          }
          .weui-cell{
            font-size: 0.26rem;
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
      .unclick{
        background: #999;
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
