<!-- 退款管理-详情页 -->
<template>
  <common-tpl class="management-details-wrap" :back="true">
    <template slot="main">
      <gray-title title="订单详情"></gray-title>
      <!-- 订单详情 -->
      <div class="order-detalis-wrap">
        <div class="order-line">
          <div class="d-ib red">
            <span>订单状态：{{formData.refundStatus | filterGoodsStatus}}</span>
            <span></span>
          </div>
          <div class="d-ib">
            <span>订单号: {{formData.refundOrderNo}}</span>
            <span></span>
          </div>
          <div class="d-ib">
            <span>申请时间: {{formData.refundApplyTime | filterDate}}</span>
            <span></span>
          </div>
        </div>
        <template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" :index="filterIndex" label="序号" width="60"></el-table-column>
            <el-table-column prop="goodsImage" label="主图">
              <template slot-scope="scope">
                <template v-if="!scope.row.goodsImage">{{scope.row.goodsImage | filterEmpty}}</template>
                <img :src="scope.row.goodsImage | filterImgUrl" v-else>
              </template>
            </el-table-column>
            <el-table-column prop="goodsNo" label="商品编码"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column prop="refundStatus" label="商品状态">
              <template slot-scope="scope">{{scope.row.refundStatus | filterGoodsStatus}}</template>
            </el-table-column>
            <el-table-column prop="goodsAttribute" label="规格"></el-table-column>
            <el-table-column prop="goodNum" label="数量">
              <template slot-scope="scope">{{scope.row.goodNum | filterEmpty}}</template>
            </el-table-column>
            <el-table-column prop="goodsPrice" label="单价">
              <template slot-scope="scope">{{scope.row.goodsPrice | filterMoney | filterEmpty('元')}}</template>
            </el-table-column>
            <el-table-column prop="refundFreightPrice" label="运费"></el-table-column>
            <el-table-column label="金额小计">
              <template slot-scope="scope">{{(scope.row.goodsTotalPrice + scope.row.refundFreightPrice) | filterMoney | filterEmpty('元')}}</template>
            </el-table-column>
            <el-table-column prop="refundApplyPrice" label="申请退款金额">
              <template slot-scope="scope">{{scope.row.refundApplyPrice | filterMoney | filterEmpty('元')}}</template>
            </el-table-column>
          </el-table>
        </template>
        <div class="order-box" v-if="parseInt(formData.refundStatus) === 1">
          <refund-dialog :orderMoney="orderMoney" :refundMoney="refundMoney" :refundOrderId="refundOrderId" :justInput="true" @change="refundValueChange"></refund-dialog>
        </div>
      </div>

      <!-- 退款信息 -->
      <div class="logistics-infor-wrap">
        <h2>退款信息</h2>
        <table>
          <tr>
            <td>收款人</td>
            <td>{{formData.customerName}}</td>
          </tr>
          <tr>
            <td>联系方式</td>
            <td>{{formData.customerPhone}}</td>
          </tr>
          <tr>
            <td>退款原因</td>
            <td>{{formData.refundReason | filterEmpty}}</td>
          </tr>
          <tr>
            <td>退款方式</td>
            <td>{{formData.payType | filterPayType}}</td>
          </tr>
          <tr>
            <td>备注说明</td>
            <td>{{formData.refundRemarks | filterEmpty}}</td>
          </tr>
        </table>`
      </div>

      <!-- 物流信息 -->`

      <div class="logistics-infor-wrap">
        <h2>物流信息</h2>
        <table>
          <tr>
            <td>发货物流</td>
            <td>{{formData.logisticsName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>发货物流单号</td>
            <td>{{formData.logisticsNo | filterEmpty}}</td>
          </tr>
        </table>
      </div>

    </template>

    <!-- 退款 -->
    <template slot="other">
      <el-dialog title="退款" :visible.sync="refundVisible" width="480px">
        <refund-dialog :orderMoney="orderMoney"
                       :payType="payType"
                       :refundMoney="refundMoney"
                       :refundOrderId="refundOrderId" @close="refundVisible = false" @success="refundSuccess"></refund-dialog>
      </el-dialog>
    </template>

    <template slot="footer">
      <!-- <el-button @click="$router.push('/admin/order/refund')">取消</el-button> -->
      <el-button type="primary" @click="refundVisible = true" v-if="parseInt(formData.refundStatus) === 1">退款</el-button>
    </template>
  </common-tpl>
</template>

<script>
import RefundDialog from './RefundDialog'
export default {
  components: {RefundDialog},
  data () {
    return {
      formData: {},

      // 列表数据
      tableData: [],
      refundVisible: false,                         // 退款
      payType: 0,                                   // 支付类型
      orderMoney: '0.00',                           // 订单金额
      refundMoney: '0.00',                           // 退款金额
      refundOrderId: null,                    // 退款订单ID

      // 分页操作
      pageData: {
        currentPage: 1,
        pageSize: 10,
        total: 50
      }
    }
  },
  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.refundOrderId = parseInt(this.$route.query.refundOrderId)
    this.getDetailsData()
  },
  methods: {
    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/refund/getRefundDetail', {
        refundOrderId: this.refundOrderId
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        // success...
        // this.$set(this.tableData, 0, resData.data)
        this.tableData.push(resData.data)
        this.formData = resData.data
        this.orderMoney = (this.formData.goodsTotalPrice + this.formData.refundFreightPrice).toString()
        this.refundMoney = this.formData.refundApplyPrice.toString()
        this.payType = parseInt(this.formData.payType)
      })
    },

    /**
     * 退款金额改变
     */
    refundValueChange (val) {
      this.refundMoney = val
    },

    /**
     * 提交退款
     */
    refundSuccess () {
      this.refundVisible = false
      this.$router.back()
    },

    /**
     * 过滤索引
     */
    filterIndex (index) {
      return parseInt((this.pageData.currentPage - 1) * 10) + index + 1
    }
  }
}
</script>

<style lang="less" scoped>
.management-details-wrap{
  h2{
    padding-left: 20px;
    font-size: 18px;
    font-weight: normal;
    width: 100px;
    color: #333;
    border-left: 3px solid #ccc;
    margin: 20px 0;

  }

  /*----------订单详情----------*/
  .order-detalis-wrap{
    .order-line{
      height: 45px;
      line-height: 45px;
      padding-left: 100px;

      span{
        margin-left: 20px;
      }

      .red{
        color: red;
      }
    }

    .order-box{
      border: 1px solid #eee;
      border-top: none;
      h3{
        font-size: 14px;
        font-weight: normal;
        border-bottom: 1px solid #eee;
        line-height: 35px;
        padding-right: 50px;
        padding: 20px;

        .el-input{
          width: 11%;
        }

        span{
          color: red;
        }
      }
    }

    .el-table{
      border: 1px solid #eee;
      border-bottom: none;
    }
  }

  /*----------物流信息----------*/
  .logistics-infor-wrap{
    h2{
      margin: 20px 0;
    }

    table{
      width: 100%;
      border-collapse: collapse;

      tr{
        width: 100%;
        overflow: hidden;
        td{
          color: #666;
          height: 35px;
          line-height: 35px;
          border: 1px solid #ebeef5;
          padding: 10px;
          overflow: hidden;
        }

        td:nth-child(1){
          width: 150px;
          text-align: right;
          padding-right: 20px;
          background: #eef1f9;
        }

        td:nth-child(2){
          padding-left: 20px;
        }
      }
    }
  }
}

</style>
