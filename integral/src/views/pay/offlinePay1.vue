<template>
  <div class="offlinePay">
    <div>
      <p class="offlinePay-title">线下支付银行</p>
      <div class="offlinePay-mesage">
        <div class="offlinePay-mesage-title">收款账户</div>
        <div>账户名称：深圳中腾云企科技有限公司</div>
        <div>开户行：招商银行股份有限公司深圳滨河时代支行</div>
        <div>银行账号：7559 2242 0810 501</div>
      </div>
      <ul class="offlinePay-voucher" v-if="voucherImg.length > 0">
        <li v-for="(item, index) in voucherImg">
          <img :src="item | filterImgUrl">
          <x-icon type="ios-minus" size=".5rem" @click="delImg(index)"></x-icon>
        </li>
      </ul>
      <div class="offlinePay-upload" v-if="noUpload">
        <form name="uploadCon" id="uploadCon" ref="uploadCon">
          <input type="file" @change="uploadImage" accept="image/png,image/jpg" name="file">
          <div class="offlinePay-upload-btn">
            <img src="../../assets/images/upload-voucher.png" >
            <div>上传付款凭证</div>
          </div>
        </form>
      </div>
    </div>
    <div class="offlinePay-btn" @click="subconfirm">提交付款信息审核</div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        uploadState: false,
        orderType: '',             // 2 线下支付 3 重新提交凭证
        orderNo: '',               // 订单编号
        noUpload: true,            // 是否允许上传
        voucherImg: [],             // 凭证图片
        rechargeNo: '',
        amount: ''
      }
    },
    mounted: function () {
      this.rechargeNo = JSON.parse(localStorage.getItem('rechargeData')).rechargeNo
      this.amount = JSON.parse(localStorage.getItem('rechargeData')).amount
      this.orderType = this.$route.query.orderType
      this.orderNo = this.$route.query.orderNo
    },
    methods: {
      /**
       * 图片上传
      */
      uploadImage () {
        this.$vux.loading.show({
          text: '图片加载中...'
        })
        let formData = new FormData(this.$refs.uploadCon)
        let config = {headers: {'Content-Type': 'multipart/form-data'}}
        this.$http.post(this.api.uploadImg + '?token=' + JSON.parse(localStorage.getItem('integralUserInfo')).token, formData, config).then(res => {
          this.uploadState = true
          var resData = res.data
          if (resData.status === this.api.ERR_OK) {
            if (resData.data.match(/\.gif|png|jpg|jpeg/gi)) {
              this.voucherImg.push(resData.data)
            } else {
              this.$vux.toast.text('图片格式仅支持gif、png、jpg')
            }
            if (this.voucherImg.length >= 5) {
              this.noUpload = false
            } else {
              this.noUpload = true
            }
          }
        }).finally(() => {
          this.$vux.loading.hide()
        })
      },
      /**
       * 删除图片
      */
      delImg (index) {
        this.voucherImg.splice(index, 1)
        // this.$refs.imgUpload.value = ''
        this.noUpload = true
      },
      /**
       * 线下支付
      */
      submissionAudit () {
        if (this.voucherImg.length <= 0) {
          this.$vux.toast.text('请上传凭证')
          return false
        }
        this.$vux.loading.show({
          text: '正在提交...'
        })
        // this.$http.get(this.api.offlinePay, {
        //   params: {
        //     orderNo: this.orderNo,
        //     paymentVoucher: this.voucherImg.toString(),
        //     orderType: this.orderType
        //   }
        // }).then((res) => {
        //   let resData = res.data
        //   this.$vux.toast.text(resData.msg)
        //   if (resData.status === this.api.ERR_OK) {
        //     this.$router.replace({path: '/pay/paySuccess', query: {offlinePay: 1}})
        //   }
        // }).finally(() => {
        //   this.$vux.loading.hide()
        // })
        this.$http.get(this.api.rechargeOfflinePay, {
          params: {
            rechargeNo: this.rechargeNo,
            paymentVoucher: this.voucherImg.toString()
          }
        }).then((res) => {
          let resData = res.data
          this.$vux.toast.text(resData.msg)
          if (resData.status === this.api.ERR_OK) {
            this.$router.push({path: '/offlineSuccess', query: {ssc: this.amount}})
          }
        }).finally(() => {
          this.$vux.loading.hide()
        })
      },
      /**
       * 重新上传凭证
      */
      uploadVoucher () {
        if (!this.uploadState) {
          this.$vux.toast.text('请等待图片上传完成')
          return
        }
        if (this.voucherImg <= 0) {
          this.$vux.toast.text('请上传凭证')
          return false
        }
        this.$http.post(this.api.updateApplyPayVoucher, {
          id: this.$route.query.orderId,
          paymentVoucher: this.voucherImg.toString()
        }).then((res) => {
          let resData = res.data
          this.$vux.toast.text(resData.msg)
          if (resData.status === this.api.ERR_OK) {
            this.$router.replace('/myAppliy')
          }
        })
      },
      /**
       * 按钮点击
      */
      subconfirm () {
        this.submissionAudit()
        if (parseInt(this.orderType) === 2) {
          this.submissionAudit()
        } else if (parseInt(this.orderType) === 3) {
          this.uploadVoucher()
        }
      }
    }
  }
</script>

<style scoped lang=less>
  .offlinePay{
    height: calc(100vh);
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    background: #efefef;
    overflow-y: scroll;
    padding: 0 .31rem;
    .offlinePay-title{
      color: #333333;
      font-size: .24rem;
      padding: .23rem 0 .26rem 0;
    }
    .offlinePay-mesage{
      background: -webkit-linear-gradient(left, #b59171 , #cfb8a3); /* Safari 5.1 - 6.0 */
      background: linear-gradient(to right,#b59171 , #cfb8a3);
      border-radius: 6px;
      padding: .3rem;
      div{
        color: #fff;
        font-size: .24rem;
        margin-bottom: .2rem;
        word-break: break-all;
      }
      .offlinePay-mesage-title{
        font-size: .28rem;
      }
    }
    .offlinePay-upload{
      height: 1.65rem;
      background: #FFF;
      border: 1px dashed #adadad;
      margin-top: .5rem;
      border-radius: 6px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      input{
        height: 1.65rem;
        width: 100%;
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
      }
      .offlinePay-upload-btn{
        text-align: center;
        img{
          width: .72rem;
          height: .58rem;
          display: inline-block;
          text-align: center;
        }
        div{
          color: #333333;
          font-size: .26rem;
          margin-top: .15rem;
        }

      }
    }
    .offlinePay-voucher{
      padding-top: .5rem;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      li{
        margin-right: .4rem;
        margin-bottom: .4rem;
        width: 1.4rem;
        height: 1.4rem;
        position: relative;
        &:nth-child(4n){
          margin-right: 0;
        }
        img{
          width: 100%;
          height: 100%;
        }
        .vux-x-icon{
          fill: #f95943;
          position: absolute;
          right: -.2rem;
          top: -.2rem;
        }
      }
    }
    .offlinePay-btn{
      height: .9rem;
      font-size: .26rem;
      color: #fff;
      border-radius: .45rem;
      background: -webkit-gradient(linear, left top, right top, from(#7acde5), to(#5894de));
      background: linear-gradient(left, #7acde5, #5894de);
      /*background: -webkit-linear-gradient(left, #f77574 , #ed3738); !* Safari 5.1 - 6.0 *!*/
      /*background: linear-gradient(to right,#f77574 , #ed3738);*/
      text-align: center;
      line-height: .9rem;
      margin-bottom: .52rem;
      margin-top: .52rem;
    }
  }
</style>
