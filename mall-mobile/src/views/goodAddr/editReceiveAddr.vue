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
        <x-address style="font-size: 0.28rem;" @on-hide="logHide" @on-show="logShow" :title="title" v-model="addressCode" :list="addressData" @on-shadow-change="onShadowChange" placeholder="请选择地址" :show.sync="showAddress"></x-address>
      </group>
      <div class="addr-box">
        <span>详细地址</span>
        <textarea cols="30" rows="2" placeholder="门牌号或房间号（限50个字）" v-model="detailAddress"></textarea>
      </div>
    </div>
    <!--提交按钮-->
    <div class="submit-box">
      <div class="submit-btn" @click="receiveAddrAddFun">确认</div>
    </div>
  </div>
</template>

<script>
  import ChinaAddressV4Data from '../../assets/js/china_address_v4.json'
  import { Group, XAddress, XButton, Cell } from 'vux'
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
        addressCode: [],         // vux 省市区地址编码
        addressName: [],         // vux 省市区地址名称
        addressData: ChinaAddressV4Data,
        showAddress: false,
        receiveAddrDetailList: {}, // 商品详情列表
        receiptAddressId: '' // 地址id
      }
    },
    mounted: function () {
      this.receiveAddrDetailFun()
    },
    methods: {
      // 收货地址详情
      receiveAddrDetailFun () {
        this.$http.post(`${this.api.receiveAddrDetail}?receiptAddressId=${this.$route.query.receiptAddressId}`, {
        }).then((res) => {
          if (res.data.res === this.api.ERR_OK) {
            let receiveAddrDetailList = res.data.obj
            this.username = receiveAddrDetailList.name
            this.phone = receiveAddrDetailList.phone
            this.detailAddress = receiveAddrDetailList.address
            this.addressCode = [receiveAddrDetailList.provinceId, receiveAddrDetailList.cityId, receiveAddrDetailList.countyId]
            this.receiptAddressId = receiveAddrDetailList.receiptAddressId
          } else {
            this.$vux.toast.text(res.data.result)
          }
        })
      },
      // 收货地址编辑
      receiveAddrAddFun () {
        this.$http.post(this.api.addOrUpdateReceiptAddress, {
          'receiptAddressId': this.receiptAddressId,      // id编辑接口传此参数
          'provinceId': this.addressCode[0],   // 省id
          'provinceName': this.addressName[0], // 省份
          'cityId': this.addressCode[1],       // 城市id
          'cityName': this.addressName[1],     // 城市
          'countyId': this.addressCode[2],     // 县id
          'countyName': this.addressName[2],   // 县
          'name': this.username,               // 收货人名称
          'phone': this.phone,                 // 手机
          'address': this.detailAddress        // 详细地址
        }).then((res) => {
          if (res.data.res === this.api.ERR_OK) {
            this.$router.push('/receiveAddr')
          } else {
            this.$vux.toast.text(res.data.result)
          }
        })
      },
      // vux ids=编码 names=名称
      onShadowChange (ids, names) {
        this.addressCode = ids
        this.addressName = names
      },
      // vux 隐藏 true=确定
      logHide (v) {
      },
      // vux 显示
      logShow (str) {
      }
    }
  }
</script>

<style scoped lang=less>
  .addReceiveAddr {
    height: 100vh;
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
          background: none;
        }
      }
    }
    /*地区-地址*/
    .area-addr {
      background: #fff;
      margin-top:0.2rem;
      font-size: .28rem;
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
          font-size: .28rem;
          padding-top:0.1rem;
        }

      }
    }
    /*设置默认地址*/
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
