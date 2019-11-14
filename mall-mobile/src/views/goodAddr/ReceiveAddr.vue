<template>
    <div class="receiveAddr">
      <!--列表-->
      <swipeout>
        <swipeout-item transition-mode="follow" v-for="(v,index) in addrList" :key="index">
          <div slot="right-menu">
            <swipeout-button @click.native="delAdd(v)" type="primary"  style="background:#f23030;">删除</swipeout-button>
          </div>
          <!--内容-->
          <div slot="content" class="content" v-if="!isData">
              <div class="left" @click="goConfirmOrderFun(v)">
                <div class="top">
                  <span>{{v.name}}</span>
                  <span class="phone">{{v.phone}}</span>
                  <span v-if="v.defaultAddress">默认</span>
                </div>
                <div class="mid">
                  <p class="addr">{{v.province}} {{v.city}} {{v.zone}} {{v.address}}</p>
                </div>
                <div class="bot" @click.stop="setDefaultAdd(v)">
                  <check-icon :value="false" v-if="!v.defaultAddress">设置默认地址</check-icon>
                  <check-icon :value="true" v-else>设置默认地址</check-icon>
                </div>
              </div>
              <div class="right" @click.stop=" $router.push({name: 'editReceiveAddr', query: { id: v.id, types: 'edit', confirmOrder: confirmOrderSte }})">
                <img src="../../assets/images/nav/edit.png">
              </div>
          </div>
        </swipeout-item>
      </swipeout>

      <!--没有数据-->
      <div v-if="isData" class="isData">没有数据</div>

      <!--提交按钮-->
      <!--<div style="height:1.5rem"></div>-->
      <div class="submit-box">
        <div class="submit-btn" @click="$router.push({path: '/addReceiveAddr', query: { types: 'add', confirmOrder: confirmOrderSte }})">+ 添加地址</div>
      </div>
    </div>
</template>

<script>
  import { Swipeout, SwipeoutItem, SwipeoutButton, CheckIcon } from 'vux'
  export default {
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      CheckIcon
    },
    data () {
      return {
        demo1: false,
        addrList: [], // 收货地址列表
        isData: false,        // 是否有数据
        confirmOrderSte: '' // 是否是从确认订单页过来的
      }
    },
    mounted: function () {
      this.confirmOrderSte = this.$route.query.confirmOrder
      this.getAddList()
    },
    methods: {
      /**
       * 获取收货地址列表
      */
      getAddList () {
        this.$http.post(this.api.addList, {
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            if (resData.data.length > 0) {
              this.isData = false
            } else {
              this.isData = true
            }
            this.addrList = resData.data
          } else {
            this.isData = true
          }
        })
      },
      /**
       * 地址列表点击跳转判断
      */
      goConfirmOrderFun (v) {
        // 订单页跳转过来的
        if (this.confirmOrderSte) {
          localStorage.setItem('addressData', JSON.stringify(v))
          this.$router.push({name: 'confirmOrder', query: {addType: 'byAddList'}})
        }
        // if (this.confirmOrderSte) {
          // localStorage.setItem('addressData', JSON.stringify(v))
          // this.$router.push({name: 'confirmOrder', query: {addType: 'byAddList'}})
        // } else {
        //   this.$router.push({name: 'editReceiveAddr', query: { id: v.id, types: 'edit' }})
        // }
      },
      /**
       * 设置默认地址
      */
      setDefaultAdd (v) {
        if (this.addrList.length <= 1 || v.defaultAddress) return false
        this.$http.post(this.api.setDefaultAddress, {
          id: v.id
        }).then((res) => {
          let resData = res.data
          this.$vux.toast.text(resData.msg)
          if (resData.status === this.api.ERR_OK) {
            this.getAddList()
          }
        })
      },
      /**
       * 删除地址
      */
      delAdd (v) {
        this.$http.post(this.api.delAdd, {
          id: v.id
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.getAddList()
          }
          this.$vux.toast.text(resData.msg)
        })
      }
    }
  }
</script>

<style lang=less>
    .receiveAddr {
      .content{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding:0.3rem;
        .left{
          flex: 1;
          margin-right: .2rem;
          /* word-break: break-all;
          overflow: hidden;
          display: -webkit-box;
          display: -moz-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; */
          .top{
            display: flex;
            font-size: .26rem;
            align-items: center;
            span{
              display: block;
              margin-right: .3rem;
              &:nth-child(1){
                max-width: 2rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              &:nth-child(3){
                font-size:.22rem;
                color:#f23030;
                border:1px solid #f23030;
                border-radius:10px;
                padding:.02rem .08rem;
              }
            }
          }
          .mid{
            word-break: break-all;
            overflow: hidden;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: .28rem;
            margin: .3rem 0;
          }
          .bot{
            font-size: .26rem;
            color: #f23030;
            .vux-check-icon{
              .weui-icon{
                font-size: .4rem;
              }
              .weui-icon-success::before{
                color: red !important;
              }
              color: red !important;
              span{
                color: red !important;
              }
            }
          }
        }
        .center{
          flex: 1;
          .addr{
            line-height: 1.6em;
            color:#999;
            margin-top:0.1rem;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: .28rem;
          }
        }
        .right{
          width:0.5rem;
          text-align: right;
          justify-content:center;
          img{
            width: 0.35rem;
          }
        }
      }
      /*没有数据*/
      .isData{
        text-align: center;
        margin-top: 0.4rem;
      }
      /*提交按钮*/
      .submit-box{
        /* padding:0 0.3rem; */
        /*position: fixed;*/
        left: 0;
        right: 0;
        bottom: 0.4rem;
        position: relative;
        .submit-btn{
          width: 7.1rem;
          height: 0.8rem;
          line-height: 0.8rem;
          text-align: center;
          color:#fff;
          background: #f23030;
          border-radius: 0.1rem;
          font-size: 0.32rem;
          margin: 0 auto;
        }
      }
    }
</style>
<style lang="less">
  .vux-swipeout {
    width: 100%;
    overflow: hidden;
    min-height: 88vh;
  }
</style>
