<!-- 结算记录列表 -->
<template>
  <common-tpl class="finance-settlement-record">
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="settleFormNo" label="结算单号" min-width="150">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.settleFormNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="订单数量" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderNum | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="settleStatus" label="结算状态" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.settleStatus | filterSettlementState}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="settleMoney" label="结算金额" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.realSettleMoney | filterMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="supplierPhone" label="供应商手机" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.supplierPhone | filterEmpty}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="settleMethod" label="结算方式">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.settleMethod | filterSettlement}}</div>
          </template>
        </el-table-column> -->
        <el-table-column prop="settleTime" label="结算时间" min-width="150">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.settleTime | filterDateDot}}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <template v-if="scope.row.settleStatus === 2">
                  <el-dropdown-item>
                    <div @click="handleDetails(scope.row)"><i class="icon el-icon-view"></i> 详情</div>
                  </el-dropdown-item>
                </template>
                <template v-if="scope.row.settleStatus === 1">
                  <el-dropdown-item>
                    <div @click="handleSettlement(scope.row)"><i class="el-icon-edit-outline"></i> 继续结算 </div>
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <!-- 暂无数据 -->
        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>

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
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      statisticsData: {
        totalAmount: '',            // 结算总金额
        waitSettleMoneySUM: '',     // 待结算金额
        hasSettleMoneySUM: ''       // 已结算金额
      },
      tableData: [],      // 列表数据
      pageData: {         // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.statistics()
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$router.push({query: {page: this.pageData.currentPage}})
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      this.$http.get('@ROOT_API/buySupplierSettleFormController/getSupplierSettleFormList', {
        params: {
          start: this.pageData.currentPage,                   // 是 int 当前页
          pageSize: this.pageData.pageSize                    // 是 int 每页条数
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.pageData.total = 0
          return false
        }
        this.tableData = resData.data.list
        this.pageData.total = resData.data.total
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 查看详情
     */
    handleDetails (row) {
      if (!row) return false
      localStorage.setItem(this.$global.SYSTEM + 'goodListDetails', JSON.stringify(row))
      setTimeout(() => {
        this.$router.push({path: '/admin/finance/supplier/record/details', query: {'id': row.id}})
      }, 30)
    },

    /**
     * 获取结算统计
     */
    statistics () {
      this.$http.get('@ROOT_API/buySupplierSettleController/getSettleMoneySUM', {
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          return false
        }
        this.statisticsData = resData.data
        localStorage.setItem(this.$global.SYSTEM + 'statisticsData', JSON.stringify(this.statisticsData))
      })
    },

    /**
     * 继续结算
     */
    handleSettlement (row) {
      setTimeout(() => {
        row.supplierSettleFormId = row.id
        localStorage.setItem(this.$global.SYSTEM + 'SettlementGoodsData', JSON.stringify(row))
        this.$router.push('/admin/finance/supplier/record/continue')
      }, 30)
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      if (this.pageData.currentPage === page) {
        this.getListData()
      } else {
        this.pageData.currentPage = page
        this.$router.push({query: {page: this.pageData.currentPage, id: this.id}})
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
