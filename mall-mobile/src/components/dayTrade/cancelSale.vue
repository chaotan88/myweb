<template>
  <div>
    <x-dialog v-model="showToast" class="dialog-demo" hide-on-blur @on-hide="closeCover">
      <div class="cancelYoInfoTitle">取消售卖</div>
      <div class="cancelAfer">取消售卖后，退还以下内容</div>
      <div class="cancelList">
        <!--<div class="cancelList-nav">销售名额:<span>1</span>个</div>-->
        <div class="cancelList-nav">通用积分:<span>{{oderData.goodPayAmount}}</span>元</div>
        <div class="cancelList-nav">批发券:<span>{{oderData.goodPayCoupon}}</span></div>
      </div>
      <div class="cancelFoot">
        <span @click="closeCover">取消</span>
        <span @click="cancel">确定</span>
      </div>
    </x-dialog>
  </div>
</template>

<script>
    import { XDialog, Alert } from 'vux'
    export default {
      name: 'cancelSale',
      props: ['listData', 'showHadHall'],
      data () {
        return {
          maskCover: true,
          maskInfo: true,
          closeMaskCover: require('../../assets/images/shopLucky01/aaaaxxxxx.png'),
          showToast: this.showHadHall,
          parmHangId: '',
          oderData: '',
          update: false // 是否刷新父级列表
        }
      },
      watch: {
        // list 订单数据
        listData: {
          handler (curVal) {
            if (this.parmHangId !== curVal.hangId) {
              this.parmHangId = curVal.hangId
              this.oderData = curVal
              // console.log(this.oderData)
            }
          },
          deep: true
        },
        showHadHall (curVal) {
          this.showToast = curVal
        }
      },
      methods: {
        chooseTrue () {
          this.showToast = false
        },
        closeCover () {
          this.$emit('closeMask', {show: false, update: false})
        },
        /**
         * 取消挂售
         */
        cancel () {
          var parm = {
            hangId: this.parmHangId
          }
          // console.log(parm)
          this.$http.post(this.api.goodsPurchaseOrderCancel, parm).then((res) => {
            if (parseInt(res.data.status) === 1) {
              this.update = true
            } else {
              this.$vux.toast.text(res.data.msg)
            }
            this.closeMask()
          })
        },
        closeMask () {
          this.$emit('closeMask', {show: false, update: this.update, hangId: this.parmHangId, status: 7})
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
    flex-direction: row;
    flex-wrap: wrap;
    .cancelList-nav{
      width: 2.5rem;
      height: 0.42rem;
      background: #ab8d58;
      border-radius: 4px;
      line-height: 0.42rem;
      text-align: center;
      color: #fff;
      font-size: 0.22rem;
      margin: .2rem;
      margin-top: 0px;
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
      padding: 0.12rem 0.65rem;
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
