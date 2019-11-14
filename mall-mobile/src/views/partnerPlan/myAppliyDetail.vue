<template>
  <div class="myAppliyDetail">
    <!--订单详情-->
    <div class="myAppliyDetail-option">
      <div class="myAppliyDetail-option-title">
          <div>订单详情</div>
          <div></div>
      </div>
      <table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="right">当前身份</td>
          <td>{{applyDetaData.currentIdentity}}</td>
        </tr>
        <tr>
          <td align="right">姓名</td>
          <td>{{applyDetaData.cardName}}</td>
        </tr>
        <tr>
          <td align="right">身份证</td>
          <td>{{applyDetaData.idCard}}</td>
        </tr>
        <tr>
          <td align="right">性别</td>
          <td>
            <span>{{applyDetaData.sex | sexStatusFilter}}</span>
          </td>
        </tr>
        <tr>
          <td align="right">地区</td>
          <td>
            {{applyDetaData.userProvince}}
            {{applyDetaData.userCity}}
            {{applyDetaData.userZone}}
          </td>
        </tr>
      </table>
    </div>
    <div class="myAppliyDetail-option">
      <div class="myAppliyDetail-option-title">
          <div>升级信息</div>
          <div></div>
      </div>
      <table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="right">申请成为</td>
          <td>{{applyDetaData.applyIdentity}}</td>
        </tr>
        <tr>
          <td align="right">代理金额</td>
          <td>{{applyDetaData.agentAmount}}元</td>
        </tr>
      </table>
    </div>
    <div class="myAppliyDetail-option">
      <div class="myAppliyDetail-option-title">
        <div>支付信息</div>
      </div>
      <table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="right">应付金额</td>
          <td>{{applyDetaData.payAmount}}元</td>
        </tr>
        <tr>
          <td align="right">付款方式</td>
          <td>{{applyDetaData.payType | payWayFilter}}</td>
        </tr>
        <tr>
          <td align="right">付款凭证</td>
          <td>
            <template v-for="item in applyDetaData.paymentVoucher">
              <a :href="imgUrl + item">
                <img :src="item | filterImgUrl">
              </a>
            </template>
          </td>
        </tr>
        <tr>
          <td align="right">支付状态</td>
          <td>
            <span>{{applyDetaData.payStatus | paySteFilter}}</span>
            <span @click.stop="showReasonPop = true" class="reason"  v-if="applyDetaData.payAuditStatus == 3">原因</span>
          </td>
        </tr>
      </table>
    </div>
    <div class="myAppliyDetail-option">
      <div class="myAppliyDetail-option-title">
        <div>开通信息</div>
        <div></div>
      </div>
      <table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="right">商城商品</td>
          <td>{{applyDetaData.toGoodsMoney}}元</td>
        </tr>
        <tr>
          <td align="right">商城消费积分</td>
          <td>{{applyDetaData.toConsumePoint}}个积分</td>
        </tr>
        <tr>
          <td align="right">是否开通</td>
          <td>{{applyDetaData.isOpen | idcardIsPassFilter}}</td>
        </tr>
      </table>
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
            <span>{{applyDetaData.payAuditInfo}} </span>
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
        applyDetaData: '',         // 详情数据
        showReasonPop: false       // 失败原因弹窗
      }
    },
    mounted: function () {
      this.getApplyDetail()
    },
    methods: {
      /**
       * 获取我的申请详情
      */
      getApplyDetail () {
        this.$http.post(this.api.getApplyDetail, {
          id: this.$route.query.id
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.applyDetaData = resData.data
            if (this.applyDetaData.paymentVoucher) {
              this.applyDetaData.paymentVoucher = this.applyDetaData.paymentVoucher.split(',')
            }
          }
        })
      }
    }
  }
</script>
<style  lang=less>
  .myAppliyDetail{
    padding-bottom:1rem;
    border-top: .2rem solid #eeeeee;
    .myAppliyDetail-option{
      border-bottom: .2rem solid #eeeeee;      
      .myAppliyDetail-option-title{
        line-height:.8rem;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-box;
        -webkit-box-align: center;
        -moz-box-align: center;
        -ms-box-align: center;
        font-size: .3rem;
        color: #333333;
        padding: 0 .34rem;
        border-bottom: 1px solid #dddddd;
      }  
      table{
        padding: 0 .17rem;
        width: 90%;
        margin: 0 auto;
        tr{
          height: .8rem;
          font-size: .26rem;
          color: #666666;
          border-bottom: 1px solid #e7e9ee;
          &:last-child{
            border-bottom: none;
          }
          td{
            vertical-align: middle;
            padding-right:.25rem;
            &:first-child{
              width: 1.6rem;
              padding-left: .21rem;
              color: #999999;
            }
            &:nth-child(2){
              padding-left: .22rem;
              color: #666666;
              padding: .1rem 0 .1rem .47rem;
            }
            a{
              float: left;
              margin-left: .1rem;
            }
            img{
              width:.74rem;
              height:.47rem;
              display:block;
            }
            .reason{
              color:#3276b4;
              margin-left:.2rem;
            }
          }
        }
      }
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