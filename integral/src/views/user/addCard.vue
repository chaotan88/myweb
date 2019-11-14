<template>
  <div class="add-card-wrap">
    <p class="msg-tip">*支行信息需输入完整，否则无法完成提现</p>
    <div class="msg-box">
      <div class="item-box">
        <p>持卡人</p>
        <span>{{personalData.cardName | filterName}}</span>
      </div>
      <div class="item-box">
        <p>证件号</p>
        <span>{{personalData.idCard | filterID}}</span>
      </div>
    </div>
    <div class="msg-box">
      <!-- <div class="item-box"> -->
        <!-- <p>所属地区</p> -->
        <group>
          <x-address style="font-size: 0.3rem;" :title="title" v-model="addressCode" :list="addressData" placeholder="请选择地址" @input="saveAddress"></x-address>
        </group>
      <!-- </div> -->
      <div class="item-box">
        <p>银行卡号</p>
        <input type="text" placeholder="请输入银行卡号" maxlength="28" v-model="formData.cardNo" @blur="inputBlur">
      </div>
      <div class="item-box">
        <p>开户银行</p>
        <input type="text" placeholder="请输入开户行信息" v-model="formData.bankName" maxlength="20">
      </div>
      <div class="item-box">
        <p>支行信息</p>
        <input type="text" placeholder="请输入完整的支行信息" v-model="formData.branchBankName" maxlength="50">
      </div>
      <div class="item-box">
        <p>预留手机</p>
        <input type="text" placeholder="请输入手机号" maxlength="11" v-model="formData.phone">
      </div>
    </div>
    <div class="submit-box">
      <div class="submit-btn" @click="cardInfoSubmit">保存</div>
    </div>
  </div>
</template>

<script>
import ChinaAddressV4Data from 'src/assets/json/china_address_v4.json'
import {Group, XAddress, Value2nameFilter as value2name} from 'vux'
import BIN from 'bankcardinfo'
export default {
  components: {
    Group,
    XAddress
  },
  data () {
    return {
      personalData: {},           // 个人信息
      addressCode: [], // 省市区code集合
      title: '所属地区',
      cityName: '',
      branchBankInfo: '',
      addressData: ChinaAddressV4Data,
      flag: false,          // 银行卡输入正确标志
      formData: {
        cardNo: '',
        bankName: '',
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        zone: '',
        zoneCode: '',
        branchBankName: '',
        registerName: '',
        cardType: '',
        phone: ''
      }
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
      })
    },
    /**
     * 地址选择
     */
    saveAddress (flag) {
      if (flag) {
        this.cityName = this.getName(this.addressCode).split(' ')
        this.formData.province = this.cityName[0]
        this.formData.provinceCode = this.addressCode[0]
        this.formData.city = this.cityName[1]
        this.formData.cityCode = this.addressCode[1]
        this.formData.zone = this.cityName[2]
        this.formData.zoneCode = this.addressCode[2]
      }
    },
    /**
     * 通过code获取省市区名称
     */
    getName (value) {
      return value2name(value, ChinaAddressV4Data)
    },
    /**
    * 输入银行卡号
    */
    inputBlur () {
      this.formData.bankName = ''
      this.identifyCard()
    },
    /**
    * 解析银行卡
    */
    cardInfoSubmit () {
      if (this.cityName === '') {
        this.$vux.toast.text('请选择所属地区')
        return false
      }
      this.identifyCard()
      if (!this.flag) {
        return false
      }
      if (this.formData.bankName === '') {
        this.$vux.toast.text('请输入开户行信息')
        return false
      }
      if (this.formData.branchBankName === '') {
        this.$vux.toast.text('请输入完整的支行信息')
        return false
      }
      if (this.formData.phone === '') {
        this.$vux.toast.text('请输入预留手机号')
        return false
      }
      if (!this.formData.phone.match(/1\d{10}/)) {
        this.$vux.toast.text('手机输入格式错误')
        return false
      }
      this.$vux.loading.show({
        text: '正在提交...'
      })
      this.$http.post(`${this.api.saveCard}`, this.formData).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) {
          this.$vux.toast.text(res.data.msg)
          return false
        }
        this.$vux.toast.text('添加银行卡成功！')
        if (parseInt(this.$route.query.cy) === 1) {
          this.$router.push('/user/index')
        } else if (parseInt(this.$route.query.cy) === 2) {
          this.$router.push('/putForward/index')
        }
      }).finally(() => {
        this.$vux.loading.hide()
      })
    },
    /**
      * 调取银行卡识别
      */
    identifyCard () {
      if (this.formData.cardNo === '') {
        this.$vux.toast.text('请输入银行卡号')
        return false
      }
      let reg = /^\d+$/
      // if (!this.formData.cardNo.match(/^\d{1,}$/)) {
      if (!reg.test(this.formData.cardNo)) {
        this.$vux.toast.text('银行卡号格式错误')
        return false
      }
      BIN.getBankBin(this.formData.cardNo)
        .then(data => {
          this.flag = true
          if (data.cardType === 'CC') {
            this.$vux.toast.text('不能添加信用卡类型！')
            return false
          }
          this.formData.bankName = data.bankName
          this.formData.cardType = data.cardType === 'DC' ? 1 : 2
        })
        .catch(err => {
          this.$vux.toast.text('请查验卡号输入是否正确')
          this.flag = false
          console.log('获取银行卡信息失败', err)
        })
    }
  }
}
</script>

<style scoped lang="less">
.add-card-wrap{
  height: 100vh;
  background: #eee;

  .msg-tip{
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: #FF0000;
    font-size: .28rem;
  }

  .msg-box{
    background: #fff;
    margin-bottom: .2rem;

    .item-box{
      height: 1rem;
      line-height: 1rem;
      border-bottom: 1px solid #ddd;
      padding: 0 15px;
      display: flex;
      p{
        display: inline-block;
        width: 1.4rem;
      }

      input{
        width: 5rem;
      }
    }
  }

  .submit-box{
    padding: .4rem .2rem;
    .submit-btn{
      height: 0.8rem;
      width: 100%;
      background: -webkit-gradient(linear, left top, right top, from(#7acde5), to(#5894de));
      text-align: center;
      line-height: 0.8rem;
      font-size: 0.32rem;
      color:#fff;
      border-radius: 0.1rem;
    }
  }
}
</style>
<style lang="less">
.add-card-wrap{
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

