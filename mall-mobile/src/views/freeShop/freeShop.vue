<template>
  <div class="freeShop">
    <ul>
      <li>
        <input type="text" placeholder="店铺名称" v-model="formData.shopName">
      </li>
      <li>
        <input type="text" placeholder="联系人" v-model="formData.Contacts">
      </li>
      <li>
        <input type="tel" placeholder="联系方式" maxlength="11" v-model="formData.Phone">
      </li>
      <li>
        <div @click="showPop = true">
          <span>{{formData.selectBussData ? formData.selectBussData.attributeTypeName : '主营业务' }}</span>
        </div>
      </li>
    </ul>
    <!--主营业务弹窗-->
    <popup position="bottom" max-height="6rem" v-model="showPop">
      <div class="distribution-mode">
        <div class='distribution-mode-title' @click="showPop = false">
          <div>取消</div>
          <div>确定</div>
        </div>
        <div class='distribution-mode-list-box'>
          <div class='distribution-mode-list' v-for="(item, index) in attributeList" @click="selectBuss(item, index)">
            <div>{{item.attributeTypeName}}</div>
            <icon type="success-no-circle" v-if="selectBussDataIndex == index"></icon>
          </div>
        </div>
      </div>
    </popup>
    <x-button type="warn" class="btn" @click.native="conformForm">提交</x-button>
  </div>
</template>
<script>
  import { PopupPicker, Picker, XButton, Group, Popup, Icon } from 'vux'
  export default {
    components: {
      PopupPicker,
      Picker,
      XButton,
      Group,
      Popup,
      Icon
    },
    data () {
      return {
        showPop: false,
        attributeList: [], // 主营业务
        formData: {
          shopName: '',
          Contacts: '',
          Phone: '',
          selectBussData: ''
        },
        selectBussDataIndex: null // 选取的主营业务
      }
    },
    mounted: function () {
      this.getBusiness()
    },
    methods: {
      /**
       * 获取主营业务
      */
      getBusiness () {
        this.$http.post(this.api.getAttributeList).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.attributeList = resData.data
        })
      },
      /**
       * 选取主营业务
      */
      selectBuss (item, index) {
        this.formData.selectBussData = {
          attributeTypeId: item.id,
          attributeTypeName: item.attributeTypeName
        }
        this.selectBussDataIndex = index
        this.showPop = false
      },
      /**
       * 提交表单
      */
      conformForm () {
        if (this.formData.shopName === '') {
          this.$vux.toast.text('请输入店铺名称')
          return
        } else if (this.formData.Contacts === '') {
          this.$vux.toast.text('请输入联系人')
          return
        } else if (this.formData.Phone === '') {
          this.$vux.toast.text('请输入联系方式')
          return
        } else if (!this.formData.Phone.match(/^1\d{10}$/g)) {
          this.$vux.toast.text('请输入正确的手机号')
          return
        } else if (!this.formData.selectBussData) {
          this.$vux.toast.text('请选择主营业务')
          return
        }
        this.$http.post(this.api.applyShop, {
          shopName: this.formData.shopName,
          contactName: this.formData.Contacts,
          contactPhone: this.formData.Phone,
          attributeTypeId: this.formData.selectBussData.attributeTypeId,
          attributeTypeName: this.formData.selectBussData.attributeTypeName
        }).then((res) => {
          let resData = res.data
          this.$vux.toast.text(resData.msg)
          if (resData.status === this.api.ERR_OK) {
            this.$router.replace({path: '/makerPlan'})
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
  .freeShop{
    ul{
      li{
        width: 100%;
        height: .9rem;
        margin: 0 auto;
        input,.pick, div{
          width: 100%;
          height: .9rem;
          line-height: .9rem;
          border-bottom: 1px solid #eee;
          font-size: .28rem;
          padding-left: .2rem;
          box-sizing: border-box;
          color: #757575;
        }
        input:focus{
          background: #f6f5f5;
        }
        .pick{
          display: none;
        }
      }
    }
    .btn{
      width: 90%;
      margin: 0 auto;
      margin-top:1rem;
    }
    .distribution-mode{
      height: 100%;
      position: relative;
    .distribution-mode-title{
      height: .8rem;
      background: #fbf9fe;
      display: flex;
      font-size: .28rem;
      align-items: center;
      justify-content: flex-end;
      padding: 0 .3rem;
    }
    .distribution-mode-title div{
      margin-left: .3rem;
    }
    .distribution-mode-list-box{
      width: 100%;
      overflow-y: scroll;
      background: #fff;
      max-height: calc(6rem - 0.8rem)
    }
    .distribution-mode-list{
      display: flex;
      height: .8rem;
      align-items: center;
      border-bottom: 1px solid #eee;
      font-size: .28rem;
      padding: 0 .3rem;
      .weui-icon{
        font-size: .28rem;
        color: #E64340;
      }
    }
    .distribution-mode-list div:nth-child(1){
      flex: 1;
    }
  }
}
</style>

