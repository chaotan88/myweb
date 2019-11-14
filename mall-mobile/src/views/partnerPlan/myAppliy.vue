<template>
  <div class="myAppliy">
    <div class="partnerUpgrad-tab">
      <ul>
        <li @click="$router.push('/partnerUpgrad')">合伙人升级</li>
        <li class="active">我的申请</li>
      </ul>
    </div>
    <!--列表-->
    <div class="myAppliy-list-box">
      <div class="myAppliy-list">
        <ul>
          <li @click="$router.push({path: '/myAppliyDetail', query: { id: item.id }})" v-for="(item, index) in applyData">
            <div class="myAppliy-title">
              <div>申请编号：{{item.applyNo}}</div>
              <div>{{item.applyTime | formatDate(0)}}</div>
            </div>
            <div class="myAppliy-con">
              <div>
                <p><span>申请成为：</span>{{item.applyIdentity}}</p>
                <p><span>应付金额：</span>{{item.payAmount}}</p>
                <p>
                  <span>付款方式：</span>
                  <span v-if="item.payType != ''">{{item.payType | payWayFilter}}</span>
                  <span v-else>未付款</span>
                </p>
              </div>
              <x-icon type="ios-arrow-right" size="30"></x-icon>
            </div>
            <div class="myAppliy-bot">
              <div class="myAppliy-bot-l">
                <div class="myAppliy-bot-ste">支付状态：{{item.payStatus | paySteFilter}}</div>  
                <div class="myAppliy-bot-reson" @click.stop="showReasonPop = true, payAuditInfo = item.payAuditInfo" v-if="item.payStatus == 2">原因</div> 
              </div>
              <div class="myAppliy-bot-r">
                <div class="myAppliy-bot-upload" @click.stop="$router.push({path: '/offlinePay', query: { orderNo: item.applyNo, orderType: 2 }})" v-if="item.payStatus == 2">重新上传凭证</div>  
                <div class="myAppliy-bot-upload" @click.stop="goPay(item)" v-if="item.payStatus == 0">去付款</div> 
              </div>
            </div>
          </li>
        </ul>
        <!--没数据-->
        <div v-if="noData" class="noData">暂无数据</div>
      </div>
    </div>
    <!--失败原因-->
    <x-dialog v-model="showReasonPop" class="dialog-demo" :hide-on-blur="true" :dialog-style="{'text-align': 'left', width: '80%', 'max-width': '7.5rem'}">
      <div class="fail-reason">
        <div class='fail-reason-title'>
          <div>支付失败原因</div>
          <x-icon type="ios-close-empty" size="30" @click.native="showReasonPop = false"></x-icon>
        </div>
        <div class='fail-reason-list'>
          <div>
            <span>{{payAuditInfo}} </span>
          </div>
        </div>
        <div  class='fail-reason-btn' @click="showReasonPop = false"> 确定 </div>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import { XDialog } from 'vux'
  export default {
    components: {
      XDialog
    },
    data () {
      return {
        applyData: [],              // 我的申请列表
        showReasonPop: false,       // 失败原因弹窗
        noData: false,              // 暂无数据
        payAuditInfo: ''            // 支付失败原因
      }
    },
    mounted: function () {
      this.getMyapplyData()
    },
    methods: {
      /**
       * 获取我的申请
      */
      getMyapplyData () {
        this.$http.post(this.api.getApplyList, {
        }).then((res) => {
          let resData = res.data
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          this.applyData = resData.data
          this.noData = resData.data.length > 0 ? 0 : 1
        })
      },
      /**
       * 去付款
      */
      goPay (v) {
        localStorage.setItem('payOrderNo', v.applyNo)
        localStorage.setItem('payOrderSzie', 1)
        localStorage.setItem('goodsIdsArr', v.id) // 存储商品id-付款页查询判断是否能用余额付款
        localStorage.setItem('orderType', 2)
        window.location.href = window.location.href.match(/.*mshop/gi)[0] + '/pay/orderPay?redirect=gopay&shopId=1'
      }
    }
    /**
     * 路由返回判断
    */
    // beforeRouteLeave (to, from, next) {
    //   next()
    //   this.$router.push('/partnerUpgrad')
    // }
  }
</script>
<style scoped lang=less>
  .myAppliy{
    .partnerUpgrad-tab{
      height:1.41rem;
      display:flex;
      align-items:center;
      background:#fff;
      ul{
        display:flex;
        width:7.07rem;
        height:.87rem;
        border:1px solid #3d74b3;
        margin:0 auto;
        line-height:.87rem;
        border-radius:5px;
        li{
          flex:1;
          text-align:center;
          color:#3d74b3;
          font-size:.28rem;
          &.active{
            background:#3d74b3;
            color:#fff;
          }
        }
      }
    }
    /**列表**/
    .myAppliy-list-box{
      height: calc(~"100vh - 1.71rem");
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .myAppliy-list{
        height: auto;
        overflow: hidden;
        ul{
          li{
            border-top: .3rem solid #eeeeee;
            border-bottom: 1px solid #eee;
            .myAppliy-title{
              display:flex;
              height: .71rem;
              align-items: center;
              padding: 0 .3rem;
              border-bottom: 1px solid #eeeeee;
              font-size: .26rem;
              div:nth-child(1){
                color: #333333;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-right: .35rem;
              }
              div:nth-child(2){
                color: #999999;
              }
            }
            .myAppliy-con{
              display: flex;
              align-items: center;
              margin-left: .4rem;
              margin-right: .3rem;
              padding-top: .25rem;
              border-bottom: 1px solid #eeeeee;
              div{
                flex: 1;
                p{
                  font-size: .24rem;
                  color: #666666;
                  margin-bottom: .25rem;
                  span{
                    color: #999999;
                  }
                }
              }
              .vux-x-icon {
                fill: #b7b7b7;
              }
            }
            .myAppliy-bot{
              display:flex;
              height: 1.02rem;
              align-items: center;
              padding: 0 .3rem;
              .myAppliy-bot-l{
                flex: 1;
                .myAppliy-bot-ste{
                  color: #333333;
                  font-size: .24rem;
                  display: inline-block;
                }
                .myAppliy-bot-reson{
                  color: #f95a58;
                  font-size: .24rem;    
                  margin-left: .35rem;
                  display: inline-block;
                }
              }
              .myAppliy-bot-r{
                .myAppliy-bot-upload{
                  color: #353535;
                  font-size: .26rem; 
                  width: 2.04rem;
                  height: .58rem; 
                  text-align: center;
                  line-height: .58rem;
                  border: 1px solid #b9b9b9;
                  border-radius:  5px;    
                }                
              }
            }
          }
        }
      }
    }
    .noData{
      text-align: center;
      font-size: .28rem;
      color: #999999;
      margin-top: 20%;
    }
    /**失败原因弹窗**/
    .fail-reason{
      width: 100%;
      height: 4.5rem;
      background: #fff;
      border-radius: 8rpx;
      .fail-reason-title{
        display: flex;
        height: .7rem;
        font-size: .28rem;
        border-bottom: 1px solid #eee;
        padding: 0 .3rem;
        align-items:center;
        div:first-child{
          flex: 1;
        }
      }
      .fail-reason-list{
        height: auto;
        overflow: hidden;
        border-bottom: 1px solid #eee;
        div{
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: .28rem;
          padding: .3rem;
          text-align: center;
          height: 1.8rem;
          overflow-y: scroll;
        }
      }
      .fail-reason-btn{
        width: 2rem;
        height: .6rem;
        display: block;
        margin: 0 auto;
        border: 1px solid #eee;
        border-radius: rpx;
        text-align: center;
        line-height: .6rem;
        font-size: .28rem;
        margin-top: .4rem;
      }
    }
  }
</style>