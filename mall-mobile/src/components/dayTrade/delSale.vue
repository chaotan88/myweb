<template>
  <div>
    <x-dialog v-model="showToast" class="dialog-demo" hide-on-blur @on-hide="closeCover">
      <div class="cancelYoInfoTitle">删除<img :src="closeMaskCover" @click="closeCover"/></div>
      <div class="cancelAfer">是否删除该条挂售记录</div>
      <div class="cancelFoot">
        <span @click="closeCover">取消</span>
        <span @click="chooseTrue">确定</span>
      </div>
    </x-dialog>
  </div>
</template>

<script>
    import { XDialog, Alert } from 'vux'
    export default {
      name: 'cancelSale',
      props: ['listData', 'showDel'],
      data () {
        return {
          maskCover: true,
          maskInfo: true,
          closeMaskCover: require('../../assets/images/shopLucky01/aaaaxxxxx.png'),
          showToast: this.showDel,
          parmHangId: '',
          update: false, // 是否刷新父级列表
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
        showDel (curVal) {
          this.showToast = curVal
        }
      },
      methods: {
        // 确定按钮
        chooseTrue () {
          var parm = {
            hangId: this.parmHangId
          }
          console.log(parm)
          this.$http.post(this.api.goodsPurchaseDelete, parm).then((res) => {
            console.log(res)
            if (parseInt(res.data.status) === 1) {
              this.update = true
            } else {
              this.$vux.toast.text(res.data.msg)
            }
            this.closeMask()
          })
        },
        closeCover () {
          this.$emit('closeRecord', {show: false, update: false})
        },
        closeMask () {
          this.$emit('closeRecord', {show: false, update: this.update, hangId: this.parmHangId})
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
