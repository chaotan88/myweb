 <template>
   <div class="region-wrap">
     <div class="region-option">
       <div class="region-option-title">完善个人信息</div>
      <ul>
        <li @click="showAddress = true">
          <div>地区</div>
          <div class="addName">{{addressName}}</div>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
          <div>真实姓名</div>
          <input type="text" placeholder="请输入真实姓名">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
          <div>身份证</div>
          <input type="text" placeholder="请输入身份证">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
      </ul>
     </div>
     <div class="region-option">
       <div class="region-option-title">填写邀请人信息</div>
      <ul>
        <li>
          <div>邀请人ID</div>
          <input type="text" placeholder="请输入邀请人ID">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
        <li>
          <div>邀请人</div>
          <input type="text" disabled>
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
   </div>
 </template>
 <script>
  import ChinaAddressV4Data from '../../assets/js/china_address_v4.json'
  import { Group, XAddress, TransferDom, Value2nameFilter as value2name } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Group,
      XAddress,
      TransferDom
    },
    data () {
      return {
        registerStatus: null,    // 是否积分系统注册状态
        isSetName: '',           // 是否实名认证标识
        title: '地区',
        addressCode: [],         // 省市区code集合
        addressName: '',         // 省市区name集合
        addressData: ChinaAddressV4Data,
        showAddress: false
      }
    },
    mounted () {
      this.isSetName = this.$route.query.isSetName
      this.getRegisterStatus()
    },
    methods: {
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
       * 提交
      */
      confirm () {
        if (this.addressCode.length <= 0) {
          this.$vux.toast.text('请选择地区')
          return false
        }
        this.$vux.loading.show({
          text: '数据提交中'
        })
        var cityName = this.getName(this.addressCode).split(' ')
        this.$http.post(`${this.api.updatePersonalInfo}`, {
          id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId,
          userProvince: cityName[0] || '',
          userProvinceCode: this.addressCode[0] || '',
          userCity: cityName[1] || '',
          userCityCode: this.addressCode[1] || '',
          userZone: cityName[2] || '',
          userZoneCode: this.addressCode[2] || ''
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.status === this.api.ERR_OK) {
            if (!this.isSetName) {
              this.$router.push({path: '/realNameAuth', query: {types: 1, pageOrigin: 'region'}})
            } else {
              if (parseInt(this.registerStatus) === 0) { // 是否注册积分系统的
                window.location.href = window.location.href.split('mshop')[0] + 'points/register'
              } else {
                this.$router.history.go(-1)
              }
            }
          }
        }).finally(() => {
          this.$vux.loading.hide()
          // setTimeout(() => {
          //   this.noTap = true
          // }, 100)
        })
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
        border-bottom: 1px solid #eee;
        height: 0.96rem;
        font-size: .26rem;
        color: #333333;
        margin: 0 .2rem;
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
 </style>