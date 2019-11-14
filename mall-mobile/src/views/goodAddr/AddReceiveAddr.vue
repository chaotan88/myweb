<template>
    <div class="addReceiveAddr">
      <!--收货人-电话-->
      <ul class="user-phone">
        <li>
          <span>收货人</span>
          <input type="text" placeholder="姓名（限20个字）" v-model="username">
        </li>
        <li>
          <span>联系电话</span>
          <input type="text" placeholder="手机号码（限11个数字）" v-model="phone">
        </li>
      </ul>
      <!--地区-地址-->
      <div class="area-addr">
        <group>
          <x-address style="font-size: 0.28rem;" :title="title" v-model="addressCode" :list="addressData"  placeholder="请选择地址" :show.sync="showAddress"></x-address>
        </group>
        <div class="addr-box">
          <span>详细地址</span>
          <textarea cols="30" rows="2" placeholder="门牌号或房间号（限50个字）" v-model="detailAddress"></textarea>
        </div>
      </div>
      <!--默认收货地址-->
      <!-- <div class="default-add">
        <div>设为默认地址</div>
        <input type="checkbox" v-model="defaultAddress">
      </div> -->
      <!--提交按钮-->
      <div class="submit-box">
        <button class="submit-btn" @click="addAddr" id="submit-btn">确认</button>
      </div>
    </div>
</template>

<script>
  import ChinaAddressV4Data from '../../assets/js/china_address_v4.json'
  import { Group, XAddress, XButton, Cell, Value2nameFilter as value2name } from 'vux'
  export default {
    components: {
      Group,
      XAddress,
      XButton,
      Cell
    },
    data () {
      return {
        username: '',      // 用户名
        phone: '',         // 手机号码
        detailAddress: '', // 详细地址
        title: '所在地区',
        addressCode: [],         // 省市区code集合
        addressName: [],         // 省市区name集合
        addressData: ChinaAddressV4Data,
        showAddress: false,
        defaultAddress: false // 0 不是默认地址 1默认
      }
    },
    mounted: function () {
      if (this.$route.query.types === 'edit') {
        this.getAddDetail() // 如果是编辑 调取地址详情接口
      }
    },
    methods: {
      /**
       * 获取地址详情
      */
      getAddDetail () {
        this.$http.post(this.api.addDetail, {
          id: this.$route.query.id
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.username = resData.data.name
            this.phone = resData.data.phone
            this.detailAddress = resData.data.address
            this.addressCode = [resData.data.provinceCode, resData.data.cityCode, resData.data.zoneCode]
            this.defaultAddress = resData.data.defaultAddress ? 1 : 0
          }
        })
      },
      /**
       * 收货地址添加
      */
      addAddr () {
        let myreg = /^1\d{10}$/g
        if (this.username === '') {
          this.$vux.toast.text('请输入收货人姓名')
          return false
        } if (this.username.length > 20) {
          this.$vux.toast.text('收货人限20个字符')
          return false
        } if (this.phone === '') {
          this.$vux.toast.text('请输入手机号码')
          return false
        } if (!myreg.test(this.phone)) {
          this.$vux.toast.text('请输入正确的手机号')
          return false
        } if (this.addressCode.length <= 0) {
          this.$vux.toast.text('请选择所在区域')
          return false
        } if (this.detailAddress === '') {
          this.$vux.toast.text('收货详细地址')
          return false
        } if (this.detailAddress.length > 50) {
          this.$vux.toast.text('详细地址限50个字符')
          return false
        }
        document.getElementById('submit-btn').setAttribute('disabled', true)
        var obj = {}
        var resUrl = ''
        var cityName = this.getName(this.addressCode).split(' ')
        obj = {
          name: this.username,
          phone: this.phone,
          province: cityName[0],
          provinceCode: this.addressCode[0],
          city: cityName[1],
          cityCode: this.addressCode[1],
          zone: cityName[2],
          zoneCode: this.addressCode[2],
          address: this.detailAddress
        }
        if (this.$route.query.types === 'add') {
          resUrl = this.api.addAdd
        } if (this.$route.query.types === 'edit') {
          resUrl = this.api.editAdd
          obj.id = this.$route.query.id
        }
        this.$http.post(resUrl, obj).then((res) => {
          let resData = res.data
          this.$vux.toast.text(resData.msg)
          if (resData.status === this.api.ERR_OK) {
            this.$router.push({name: 'receiveAddr', query: {confirmOrder: this.$route.query.confirmOrder}})
          } else {
            document.getElementById('submit-btn').removeAttribute('disabled')
          }
        })
      },
      /**
       * 通过code获取省市区名称
      */
      getName (value) {
        return value2name(value, ChinaAddressV4Data)
      }
    }
  }
</script>

<style  lang=less>
    .addReceiveAddr {
      height: 100vh;
      font-size: .28rem;
      background: #eee;
      /*收货人-电话*/
      .user-phone{
        background: #fff;
        li{
          height: 0.8rem;
          line-height: 0.8rem;
          padding:0 0.3rem;
          border-bottom: 1px solid #eee;
          span{
            display: inline-block;
            width:1.5rem;
          }
          input{
            height: 0.8rem;
            background:none;
          }
        }
      }
      /*地区-地址*/
      .area-addr {
        background: #fff;
        margin-top:0.2rem;
        .area-box {
          height: 0.8rem;
          line-height: 0.8rem;
          display: flex;
          padding-right: 0.15rem;
          padding-left: 0.3rem;
          border-bottom: 1px solid #eee;
          .left {
            width: 1.5rem;
          }
          .center {
            flex: 1;
            color: #999;
          }
          .right {
            .vux-x-icon {
              fill: #999;
              margin-top:0.2rem;
            }
          }
        }
        .addr-box{
          padding-left: 0.3rem;
          padding-top:0.2rem;
          padding-bottom: 0.2rem;
          span{
            display: inline-block;
            width: 1.5rem;
            vertical-align: top;
            margin-top:0.1rem;
          }
          textarea{
            border:none;
            outline:none;
            resize:none;
            font-family: '微软雅黑';
            color:#999;
            padding-top:.1rem;
            font-size: .28rem;
          }

        }
      }
      /*设置默认地址*/
      .default-add{
        display: flex;
        display: -webkit-flex;
        height: .8rem;
        align-items: center;
        background: #fff;
        margin-top: .2rem;
        padding: 0 .3rem;
        div{
          flex: 1;
          -webkit-box-flex: 1;
        }
        input{
          width: .94rem;
          height: .48rem;
          position: relative;
          background-color: #dddddd;
          border-radius: 30px;
          background-clip: content-box;
          display: inline-block;
          -webkit-appearance: none;
          user-select: none;
          outline: none;
          transition: background-color ease 0.4s;
          -webkit-transition: background-color ease 0.4s;
          &:checked{
            background-color: #64bd63;
            transition: border-color 0.4s, background-color ease 0.4s;
            -webkit-transition: border-color 0.4s, background-color ease 0.4s;
          }
          &:checked::before{
            left: .48rem;
          }
          &::before{
            content: '';
            width: .4rem;
            height: .4rem;
            position: absolute;
            top: 0px;
            left: .03rem;
            bottom: 0;
            margin: auto;
            border-radius: 50%;
            background-color: #fff;
            transition: left 0.3s;
            -webkit-transition: left 0.3s;
          }
        }
      }
      .switch{
        font-size: 0.28rem;
      }
      /*提交*/
      .submit-box{
        padding:0 0.3rem;
        margin-top:0.8rem;
        .submit-btn{
          width: 100%;
          background: #f23030;
          height: 0.8rem;
          line-height: 0.8rem;
          text-align: center;
          font-size: 0.32rem;
          color:#fff;
          border-radius: 0.1rem;
          border:none;
          outline: none;
        }

      }
      .weui-label{
        font-size: 0.28rem;
      }
      .weui-cell_access{
        font-size: 0.28rem;
      }
    }
</style>
