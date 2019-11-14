<template>
  <div>
    <x-dialog v-model="showToast" class="dialog-demo" hide-on-blur @on-hide="closeMask">
      <div class="cancelYoInfoTitle">提货</div>
      <div class="cancelAfer">确定要提货吗?</div>
      <div class="cancelFoot">
        <span @click="closeCover">取消</span>
        <span @click="toOrder(oderData)">确定</span>
      </div>
    </x-dialog>
  </div>
</template>

<script>
    import { XDialog, Alert } from 'vux'
    export default {
      name: 'cancelSale',
      props: ['listData', 'showExtract'],
      data () {
        return {
          maskCover: true,
          maskInfo: true,
          closeMaskCover: require('../../assets/images/shopLucky01/aaaaxxxxx.png'),
          showToast: this.showExtract,
          parmHangId: '',
          oderData: {}
        }
      },
      watch: {
        listData: {
          handler (curVal) {
            if (this.parmHangId !== curVal.hangId) {
              this.parmHangId = curVal.hangId
              this.oderData = curVal
              console.log(this.oderData)
            }
          },
          deep: true
        },
        showExtract (curVal) {
          this.showToast = curVal
        }
      },
      methods: {
        closeCover () {
          this.showToast = false
        },
        closeMask () {
          this.$emit('closeExtract', false)
        },
        /**
         * 提取商品
         */
        toOrder (v) {
          var parm = {
            skuId: v.skuId
          }
          this.$http.get(`${this.api.goodsSkuDetail}`, {
            params: parm
          }).then((res) => {
            if (res.data.status !== this.api.ERR_OK || !res) {
              this.$vux.toast.text(res.data.msg)
              return false
            } else {
              var resData = res.data.data
              console.log(resData, 'resData')
              resData.orderSource = 11
              resData.goodsNum = 1
              resData.skuId = v.skuId
              resData.shopId = 1
              resData.hangId = v.hangId
              resData.goodsPrice = 0
              resData.goodsId = parseInt(this.$route.query.goodsId)
              localStorage.setItem('confirmOrderInfo', JSON.stringify([resData]))
              localStorage.setItem('CONFIRM_ORDER_TYPE', resData.orderSource)
              setTimeout(() => {
                this.$router.replace({path: '/confirmOrder'})
              }, 100)
            }
          }).catch((res) => {
            console.log(res)
          })
        }
      },
      mounted: function () {
      },
      created () {
      },
      components: {
        XDialog,
        Alert
      }
    }
</script>

<style lang="less" scoped>
  .cancelYoInfoTitle{
    width: 100%;
    height: 0.74rem;
    line-height: 0.74rem;
    border-bottom: 1px solid #dccbcb;
    text-align: center;
    position: relative;
    img{
      width: 0.2rem;
      height: 0.2rem;
      position: absolute;
      right: .3rem;
      top: .1rem;
    }
  }
  .cancelAfer{
    margin-left: 0.23rem;
    font-size: 0.22rem;
    color: #575757;
    height: 0.46rem;
    line-height: 0.46rem;
    margin-bottom: 0.15rem;
    margin-top: 0.15rem;
  }
  .cancelList{
    display: flex;
    justify-content: space-around;
    .cancelList-nav{
      width: 1.82rem;
      height: 0.42rem;
      background: #bc8567;
      border-radius: 0.2rem;
      line-height: 0.42rem;
      text-align: center;
      color: #fff;
      font-size: 0.22rem;
    }
  }
  .cancelFoot{
    display: flex;
    justify-content: space-around;
    width: 5rem;
    margin: auto;
    margin-top: 0.4rem;
    margin-bottom: .32rem;
    span{
      padding: 0.12rem 0.55rem;
      border: 1px solid #8d8d8d;
      border-radius: 0.2rem;
      font-size: 0.25rem;
      display: inline-block;
    }
  }
</style>
<style>
  .weui-dialog{
    position: fixed;
    display: table;
    z-index: 5000;
    width: 80%;
    max-width: 7.5rem;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    /*background-color: #FFFFFF;*/
    text-align: center;
    border-radius: 0.2rem;
    overflow: hidden;
  }
</style>
