<!-- 供应商结算 -->
<template>
  <common-tpl class="finance-supplier-details" footer back>
    <!-- 头部 -->
    <template slot="header">
      <supplier-tip :supplierId="supplierId"></supplier-tip>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <!-- 统计 -->

      <!-- 表格部分 -->
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" @click="toggleSelection(row)"></el-table-column>
        <el-table-column prop="orderNo" label="订单编号" min-width="150">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.supplierName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderStatus | filterOrderStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="买家姓名">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.customerName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="买家手机号">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.customerPhone | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="支付状态">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.payStatus | filterPayStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.payType | filterPayType}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderTotalAmount" label="实收款">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderTotalAmount | filterMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderTime" label="下单时间" min-width="150">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderTime | filterDate}}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleDetails(scope.row)"><i class="icon el-icon-edit"></i>详情</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <el-table-column slot="empty">
          <no-data></no-data>
        </el-table-column>
      </el-table>

      <div v-if="pageData.total">
        <!-- 分页 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="pageData.currentPage"
          :page-size="pageData.pageSize"
          :total="pageData.total"
          @current-change="pageChange"
          v-if="pageData.total">
        </el-pagination>
      </div>
    </template>

    <template slot="footer">
      <el-button type="primary"  @click="SettlementHandle()" :disabled="!settlementIds.length">生成结算单</el-button>
    </template>
  </common-tpl>
</template>

<script>
import SupplierTip from './SettlementSheet'
export default {
  components: {SupplierTip},
  data () {
    return {
      pageType: 1,                    // 页面类型
      formData: {
        name: '',                     // 商品名称
        classifySelectValue: ''       // 多选菜单结果
      },
      tableData: [],                  // 商品显示表格
      settlementIds: [],              // 结算选择
      pageData: {                     // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      supplierId: null,
      settlementGoodsData: {},         // 订单id
      settlementDetails: {}            // supplierId
    }
  },
  mounted () {
    this.supplierId = parseInt(this.$route.query.supplierId)
    console.log('this.supplierId: ', this.supplierId)
    this.settlementDetails = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'SettlementDetails'))
    this.pageType = this.$route.query.type && this.$route.query.type.match(/goods/gi) ? 1 : 2
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/buySupplierSettleDetailController/getSupplierSettleDetailList', {
        supplierId: this.supplierId,
        settleFormId: '',
        start: this.pageData.currentPage,   // 是 int 当前页
        pageSize: this.pageData.pageSize,   // 是 int 每页条数
        flag: 1
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.orderTableData = []
          this.pageData.total = 0
          return false
        }
        this.tableData = resData.data.list
        this.orderTableData = resData.data.list
        this.pageData.total = resData.data.total
        localStorage.setItem(this.$global.SYSTEM + 'settlementGoodsData', JSON.stringify(this.settlementGoodsData))
        console.log('this.settlementGoodsData: ', this.settlementGoodsData)
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 查看详情
     */
    handleDetails (row) {
      if (!row) return false
      localStorage.setItem(this.$global.SYSTEM + 'RechargeDetails', JSON.stringify(row))
      setTimeout(() => {
        this.$router.push({path: '/admin/finance/supplier/record/order/details', query: {'id': row.orderId}})
      }, 30)
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      this.pageData.currentPage = page
      this.$router.push({query: {supplierId: this.supplierId, page: this.pageData.currentPage}})
      this.getListData()
    },

    /**
     * 多选操作
     */
    handleSelectionChange (val) {
      this.settlementIds = val
    },

    /**
     * 生成结算单
     */
    SettlementHandle (row) {
      let aggregateId = []
      this.settlementIds.forEach((item) => {
        aggregateId.push(item.orderId)
      })
      this.$http.post('@ROOT_API/buySupplierSettleFormController/createSettleForm', {
        start: this.pageData.currentPage,                   // 当前页
        pageSize: this.pageData.pageSize,                   // 每页条数
        orderIds: aggregateId,                              // 选择的订单id集合
        settleId: this.settlementDetails.id,                // 主表id
        supplierId: this.supplierId                         // 供应商id
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
        let results = resData.data
        localStorage.setItem(this.$global.SYSTEM + 'SettlementGoodsData', JSON.stringify(results))
        this.$router.push({path: '/admin/finance/supplier/record/single'})
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.finance-supplier-details{

  .admin-common-tpl-header{
    margin-bottom: 20px !important;
  }

  .statistics-text{
    line-height: 28px;
    padding-top: 20px;

    span{
      margin-right: 20px;
    }

    strong{
      color: #d50000;
      font-size: 18px;
    }
  }
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

  .el-table{
    tr{
      td:first-child{
        width: 80px;
        height: 80px;

        img{
          width: 80px;
          height: 80px;
        }
      }

      .cell{

        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .search-wrap .retailers-wrap{
    .el-form-item{
      margin-bottom: 0;

      .el-form-item__content{
        margin-left: 0 !important;

        .el-input__inner{
          border-radius: 3px;
          height: 36px;
        }
      }
    }
  }

  .admin-common-tpl-header{
    margin-bottom: 20px !important;
  }

}
</style>
