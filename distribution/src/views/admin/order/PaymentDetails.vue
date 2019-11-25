<!-- 共用详情页 -->
<template>
  <common-tpl class="manage-public-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">
        <gray-title title="订单信息" class="ta-l title"></gray-title>
        <table>
          <tr>
            <td>订单状态：</td>
            <td>{{detailsData.phone | filterEmpty}}</td>
          </tr>
          <tr>
            <td>订单号：</td>
            <td>{{detailsData.currentIdentity}}</td>
          </tr>
          <tr>
            <td>下单时间：</td>
            <td>{{detailsData.cardType | filterCardType}}</td>
          </tr>
          <tr>
            <td>支付时间：</td>
            <td>{{detailsData.cardName | filterEmpty}}</td>
          </tr>
        </table>

        <el-table border :data="tableData" style="width: 100%" :summary-method="getSummaries" show-summary>
          <el-table-column
            prop="id"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column prop="applyNo" label="主图">
            <template slot-scope="scope">{{scope.row.cardName | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="applyTime" label="套餐编码" width="180">
            <template slot-scope="scope">{{scope.row.applyTime | filterDate}}</template>
          </el-table-column>
          <el-table-column prop="phone" label="套餐名称" min-width="120">
            <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="currentIdentity" label="套餐状态">
            <template slot-scope="scope">{{scope.row.currentIdentity | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="orderIdentity" label="套餐价">
            <template slot-scope="scope">{{scope.row.orderIdentity | filterEmpty}}</template>
          </el-table-column>
          <div slot="empty">
            <no-data></no-data>
          </div>
        </el-table>

        <gray-title title="买家信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>买家姓名：</td>
            <td>{{detailsData.applyNo | filterEmpty}}</td>
          </tr>
          <tr>
            <td>买家手机号：</td>
            <td>{{detailsData.orderIdentity | filterEmpty}}</td>
          </tr>
        </table>
        <gray-title title="物流信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>收件人：</td>
            <td>{{detailsData.payAmount | filterEmpty}}</td>
          </tr>
          <tr>
            <td>联系方式：</td>
            <td>{{detailsData.payType | filterEmpty}}</td>
          </tr>
          <tr>
            <td>收件人地址：</td>
            <td>{{detailsData.payStatus | filterPayStatus(detailsData.payType)}}</td>
          </tr>
          <tr v-if="parseInt(detailsData.payStatus) === 2">
            <td>发货时间：</td>
            <td>{{detailsData.payAuditInfo | filterEmpty}}</td>
          </tr>
          <tr>
            <td>快递类型：</td>
            <td>{{detailsData.payStatus | filterPayStatus(detailsData.payType)}}</td>
          </tr>
          <tr v-if="parseInt(detailsData.payStatus) === 2">
            <td>物流单号：</td>
            <td>{{detailsData.payAuditInfo | filterEmpty}}</td>
          </tr>
        </table>

      </div>
    </template>

    <template slot="other">
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <!-- <template v-if="parseInt(detailsData.payStatus) === 1">
        <el-button type="primary" @click="passVisible = true">审核</el-button>
      </template> -->
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      // 审核结果
      formData: {
        checkResult: '2',       // 审核结果
        description: ''
      },
      orderId: '',              // 申请id
      detailsData: {},          // 详情数据
      fxUserInfo: {},           // 用户信息
      passVisible: false,        // 审核弹窗
      tableData: [{}]
    }
  },
  mounted () {
    this.orderId = parseInt(this.$route.query.id) || ''
    this.fxUserInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.getDetails()
  },
  methods: {
    /**
     * 详情
     */
    getDetails () {
      this.$http.get('@ROOT_API/meal/getSetMealOrderDetails', {
        params: {
          orderId: this.orderId          // long  申请ID
        }
      }).then(res => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        let results = resData.data
        if (results) {
          if (results.paymentVoucher) {
            results.paymentVoucher = results.paymentVoucher.split(',')
          } else {
            results.paymentVoucher = []
          }
          this.detailsData = resData.data
        }
      })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index < 4) return ''
        if (index === 4) {
          sums[index] = '实收金额合计:'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    }
  }
}
</script>

<style lang="less" scoped>
.manage-public-detail-wrap{
  
  .admin-gray-title{
    margin-bottom: 0;
  }

  .goods-common-details{

    .title{
    }

    table{
      width: 100%;
      border: 1px;
      border-collapse: collapse;
      margin-bottom: 20px;

      td{
        font-size: 14px;
        padding: 10px;
        border: 1px solid #eee;
      }

      td:nth-child(odd) {
        width: 160px;
        text-align: right;
        border-right: none;
      }

      td:nth-child(even) {
        color: #999;
        border-left: none;
      }

    }

    .thumbnail-wrap{
      width: 100px;
      height: 100px;
      margin-right: 10px;
    }

    .pictrue-wrap{
      font-size: 0;

      .list{
        width: 80px;
        height: 80px;
        border: 1px solid #33719b;
        margin-right: 20px;
        overflow: hidden;
        border-radius: 5px;

        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .el-table {
    margin-bottom: 20px;
  }
}
</style>
<style lang="less">
.manage-public-detail-wrap{
  .el-dialog {
    .el-dialog__body {
      padding-bottom: 0;
    }
  }
}
</style>
