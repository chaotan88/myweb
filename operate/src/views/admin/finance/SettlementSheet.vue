<!-- 供应商结算头部 -->
<template>
  <!-- 统计 -->
  <div class="settlement-count-table">
    <div class="count-box">
      <dl class="pos-r">
        <dd class="pos-a ta-c">
          <h3 class="fw-n">{{(initData.orderAmounts + initData.logisticAmounts) | filterMoney | filterEmpty('元')}}</h3>
          <h4 class="fw-n">结算总金额</h4>
        </dd>
        <dt>
          <div>
            <!-- <span class="d-ib">供应商名称：{{SettlementDetails.supplierName | filterEmpty}}</span> -->
            <template v-if="moduleType === 1">
              <span class="d-ib">结算单号：<strong>{{initData.orderAmounts | filterMoney | filterEmpty('元')}}</strong></span>
              <span class="d-ib">结算状态：已结算</span>
              <span class="d-ib">结算时间：<strong>{{initData.orderAmounts | filterMoney | filterEmpty('元')}}</strong></span>
              <!-- <span class="d-ib">结算状态：<strong>{{initData.orderAmounts | filterMoney | filterEmpty('元')}}</strong></span> -->
            </template>
          </div>
          <div>
            <span class="d-ib">订单数：<strong>{{initData.orderNum | filterEmpty('个')}}</strong></span>
            <span class="d-ib">共<strong>{{initData.goodsNum | filterEmpty}}</strong>个商品</span>
            <span class="d-ib">商品费用：<strong>{{initData.orderAmounts | filterMoney | filterEmpty('元')}}</strong></span>
            <span class="d-ib">共<strong>{{initData.logisticNum | filterEmpty}}</strong>笔物流，累计金额：<strong>{{initData.logisticAmounts | filterMoney | filterEmpty('元')}}</strong></span>
          </div>
        </dt>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    supplierId: {   // 供应商主键
      type: Number
    },
    settleFormId: { // 结算单主键
      type: Number
    },
    supplierName: { // 供应商名称
      type: String
    },
    orderIds: { // 订单主键集合
      type: Array
    }
  },
  data () {
    return {
      pageType: 2,               // 页面类型
      moduleType: 2,             // 模块
      settlementDetails: {},     // supplierId
      amountDetails: {},
      SettlementDetails: {},     // 供应商数据
      initData: {},
      isWatched: false           // 数据已更新
    }
  },

  watch: {
    supplierId (val) {
      if (val && !this.isWatched) {
        this.isWatched = true
        this.getListData()
      }
    },

    settleFormId (val) {
      if (val && !this.isWatched) {
        this.isWatched = true
        this.getListData()
      }
    },
    orderIds (val) {
      if (val && !this.isWatched) {
        this.isWatched = true
        this.getListData()
      }
    }
  },

  mounted () {
    // this.$nextTick(() => {
    //   this.getListData()
    // })
    this.SettlementDetails = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'SettlementDetails'))
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      console.log('this.settleFormId, this.orderIds', this.settleFormId, this.orderIds)
      this.$http.post('@ROOT_API/buySupplierSettleDetailController/getSupplierSettleListSumById', {
        supplierId: this.supplierId,        // 供应商主键
        settleFormId: this.settleFormId,    // 结算单主键
        orderIds: this.orderIds             // 订单主键集合
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.initData = resData.data
      })
    }
  }
}
</script>

<style scoped lang="less">
.settlement-count-table{
  max-width: 100%;
  background: #fff;
  padding: 30px;
  box-sizing: border-box;


  .count-box{
    float: left;
    width: 100%;
    text-align: left;
    overflow: hidden;

    dl{

      dd{
        height: 60px;
        padding: 20px 40px;
        border-right: 1px solid #e5e5e5;

        h3{
          color: #f95a5a;
        }

        h4{
          line-height: 40px;
        }
      }

      dt{
        padding-left: 180px;
        span{
          color: #6c6c6c;
          height: 45px;
          line-height: 45px;
          font-size: 14px;
          margin-left: 20px;
        }

        strong{
          color: #3c3c3c;
          margin: 0 3px;
        }
      }
    }
  }
}
.settlement-count-table:after{
  content: '';
  display: block;
  clear: both;
}
</style>

<style lang="less">
.finance-supplier-details{
  .select-wrap{

    .el-icon--right{
      line-height: 40px !important;
      right: 5px;
    }
  }
  .caret-wrapper{
    height: 14px;
    .ascending{
      top: -4px;
    }
    .descending{
      bottom: -4px;
    }
  }
}
</style>
