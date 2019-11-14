 <template>
   <div class="region-wrap">
      <ul>
        <li @click="showAddress = true">
          <div>地区</div>
          <div>{{addressName}}</div>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </li>
      </ul>
      <!--地址选择-->
      <group class="address">
        <x-address style="font-size: 0.26rem; display:none;" :show.sync="showAddress" :title="title" v-model="addressCode" :list="addressData" placeholder="请选择地址" @on-hide="selectArea"></x-address>
      </group>
      <!--提交按钮-->
      <div class="btn-box">
        <div class="submit-btn" @click="confirm">下一步</div>
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
   ul{
     li{
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;
      height: 0.8rem;
      font-size: .26rem;
      color: #333333;
      padding: 0 .2rem;
      div:nth-child(1){
        flex:1;
        color: #333333;
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
 </style>