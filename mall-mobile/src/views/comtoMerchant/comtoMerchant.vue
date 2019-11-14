<template>
  <div>
    <div class="comtoMerchant-page">
      <p>拍照时请确保图片清晰、边框完整、光线均匀</p>
      <p class="description" :class="{'red': status === 3, 'green': status === 2, 'gray': status === 1}">{{reason}}</p>
      <div class="id-cord-f margin30">
          <img :src="cardFront" class="uploadImg" v-if="cardFront"/>
          <div class="update">
            <img src="../../assets/images/tcsj/info_07.png"/>
            <!-- 图片上传form -->
            <form name="cardFront" id="cardFront"  v-if="status != 1 &&  status != 2">
              <input type="file" accept="image/*" name="file" @change="uploadImage('cardFront')" class="uploadImg">
            </form>
            <!-- 点击重新上传form -->
            <form name="recardFront" id="recardFront"  v-if="cardFront && (status != 1 &&  status != 2)">
              <input type="file" accept="image/*" name="file"  @change="uploadImage('recardFront')"  class="reuploadImg">
              <p class="uploadImg-tips" >点击重新上传</p>
            </form>
            <p class="pm30">上传法人身份证正面照片</p>
          </div>
          
      </div>
      <div class="id-cord-r margin30">
        <img :src="cardBack" class="uploadImg" v-if="cardBack"/>
        <div class="update">
          <img src="../../assets/images/tcsj/info_07.png"/>
          <p class="pm30">上传法人身份证反面照片</p>
          <!-- 图片上传form -->
          <form name="cardBack" id="cardBack"  v-if="status != 1 &&  status != 2">
            <input type="file" accept="image/*" name="file" @change="uploadImage('cardBack')"  class="uploadImg">
          </form>
          <!-- 点击重新上传form -->
          <form name="recardBack" id="recardBack" v-if="cardBack && (status != 1 &&  status != 2)">
            <input type="file" accept="image/*" name="file"  @change="uploadImage('recardBack')"  class="reuploadImg">
            <p class="uploadImg-tips" >点击重新上传</p>
          </form>
        </div>
      </div>
      <div class="id-cord-b margin30">
        <img :src="businessLicense" class="uploadImg" v-if="businessLicense"/>
        <div class="update">
          <img src="../../assets/images/tcsj/info_07.png"/>
          <p class="pm30">上传营业执照照片</p>
          <!-- 图片上传form -->
          <form name="businessLicense" id="businessLicense"  v-if="status != 1 &&  status != 2">
            <input type="file" accept="image/*" name="file" @change="uploadImage('businessLicense')"  class="uploadImg">
          </form>
          <!-- 点击重新上传form -->
          <form name="rebusinessLicense" id="rebusinessLicense" v-if="businessLicense && (status != 1 &&  status != 2)">
            <input type="file" accept="image/*" name="file"  @change="uploadImage('rebusinessLicense')"  class="reuploadImg">
            <p class="uploadImg-tips" >点击重新上传</p>
          </form>
        </div>
      </div>
      <div class="footRz" @click="submit" v-if="!btnGray" >商户认证</div>
      <div class="footRz gray" v-if="btnGray">商户认证</div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'comtoMerchant',
      data () {
        return {
          cardFront: '', // 身份证正面
          cardBack: '', // 身份证反面
          businessLicense: '', // 营业许可证
          reason: '', // 审核文案
          btnGray: false, // 按钮置灰
          status: '' // 审核状态(1：待审核、2：审核通过、3：审核不通过)
        }
      },
      mounted () {
        this.status = this.$route.query.status // 取未认证状态
        console.log(`${this.status}`)
        this.getMerchantStatus()
      },
      methods: {
        /**
         * 获取商户认证状态
         */
        getMerchantStatus () {
          this.$http.post(`${this.api.getMerchant}`, {}).then((res) => {
            if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
              let resData = res.data
              if (resData.data) {
                this.cardFront = resData.data.cardFront
                this.cardBack = resData.data.cardBack
                this.businessLicense = resData.data.businessLicense
                // 认证状态 审核状态(1：待审核、2：审核通过、3：审核不通过)
                this.status = resData.data.status
                console.log(`${this.status}`)
                switch (this.status) {
                  case 1:
                    this.reason = '您的申请已提交，请耐心等待审核结果'
                    this.btnGray = true
                    break
                  case 2:
                    this.reason = '商户认证已通过审核'
                    this.btnGray = true
                    break
                  case 3:
                    this.reason = resData.data.description
                    this.btnGray = true
                    break
                  default:
                    this.btnGray = false
                }
              }
            } else {
              return false
            }
          })
        },
        /**
         * 图片上传
         */
        uploadImage (id) {
          if (this.status === 3) { // 审核不通过时，点击重新上传点亮提交按钮
            this.btnGray = false
          }
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
                if (id === 'cardFront' || id === 'recardFront') {
                  this.cardFront = resData.data
                }
                if (id === 'cardBack' || id === 'recardBack') {
                  this.cardBack = resData.data
                  console.log(this.cardBack)
                }
                if (id === 'businessLicense' || id === 'rebusinessLicense') {
                  this.businessLicense = resData.data
                }
              }
            } else {
            }
          }).catch(() => {
            this.$vux.loading.hide()
          })
        },
        /**
         * 商户认证上传
         */
        submit () {
          if (!this.cardFront || !this.cardBack || !this.businessLicense) {
            this.$vux.toast.show({
              text: '信息不完整',
              type: 'cancel'
            })
            return
          }
          this.$http.post(`${this.api.saveMerchant}`, {
            cardFront: this.cardFront,
            cardBack: this.cardBack,
            businessLicense: this.businessLicense
          }).then((res) => {
            if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
              this.$vux.toast.show({
                text: '上传成功',
                type: 'success'
              })
              this.getMerchantStatus()
            } else {
              return false
            }
          })
        }
      }
    }
</script>

<style scoped lang="less">
.comtoMerchant-page {
  color: #000;
  padding: 0.3rem;
  min-height: 100vh;
  background: #f1f1f1;
  .description{
    margin-top: 5px;
  }
  .description.red {
    color: red
  }
  .description.green {
    color: green
  }
  .description.gray {
    color: gray
  }
  p{
    font-size: 0.26rem;
    color: #464646;
    text-align: center;
  }
  .id-cord-f{
    width: 6.9rem;
    height: 3.52rem;
    border: 1px dashed #808080;
    position: relative;
  }
  .id-cord-r{
    width: 6.9rem;
    height: 3.52rem;
    border: 1px dashed #808080;
    position: relative;
  }
  .id-cord-b{
    width: 6.9rem;
    height: 3.52rem;
    border: 1px dashed #808080;
    position: relative;
  }
  .margin30{
    margin-top: 0.3rem;
  }
  .uploadImg{
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .uploadImg-tips{
    position: absolute;
    color: #ccc;
    background: #000;
    opacity: 0.7;
    text-align: center;
    width: 100%;
    height: 35px;
    line-height: 35px;
    border-radius: 5px;
    bottom: 0;
    left: 0;
  }
  .update{
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 1.6rem;
    .pm30{
      margin-top: 0.3rem;
      color: #acacac;
    }
    .uploadImg{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
    .reuploadImg{
      width: 100%;
      height: 0.5rem;
      position: absolute;
      left: 0;
      top: 3rem;
      opacity: 0;
      z-index: 10;
    }
  }
  .footRz{
    width: 6.75rem;
    height: 0.87rem;
    line-height: 0.87rem;
    text-align: center;
    color: #ffffff;
    font-size: 0.32rem;
    margin-left: 0.07rem;
    background: #ff3232;
    margin-top: 0.44rem;
    &.gray {
      background: #ccc;
      color: #fff;
    }
  }
}
</style>
