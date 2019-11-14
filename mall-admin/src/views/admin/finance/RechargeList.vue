<!-- 财务首页 -->
<template>
  <common-tpl class="finance-list-wrap">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search :textVisible="false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入会员姓名/手机号" v-model.trim="formData.searchText" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
      </high-search>
    </template>

    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column fixed prop="customerName" label="会员姓名">
          <template slot-scope="scope">{{scope.row.customerName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="手机号">
          <template slot-scope="scope">{{scope.row.customerPhone | filterEmpty}}</template>
        </el-table-column>

        <template v-if="pageType === 1">
          <el-table-column prop="bonusPoints" label="消费积分（个）"></el-table-column>
          <el-table-column prop="cashPoints" label="通用积分（个）">
            <template slot-scope="scope">{{scope.row.cashPoints | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="balance" label="余额（元）">
            <template slot-scope="scope">{{scope.row.balance | filterEmpty}}</template>
          </el-table-column>
        </template>

        <template v-if="pageType !== 1">
          <el-table-column prop="consumePoints" :label="pageType === 3 ? '消费积分扣除（个）' : '消费积分充值（个）'">
            <template slot-scope="scope">
              <template v-if="scope.row.consumePoints">{{pageType === 3 ? '-' : '+'}}{{scope.row.consumePoints}}</template>
              <template v-else>{{scope.row.consumePoints | filterEmpty}}</template>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="cashPoints" label="通用积分充值（个）">
            <template slot-scope="scope">
              <template v-if="scope.row.cashPoints">{{pageType === 3 ? '-' : '+'}}{{scope.row.cashPoints}}</template>
              <template v-else>{{scope.row.cashPoints | filterEmpty}}</template>
            </template>
          </el-table-column> -->
          <el-table-column prop="amountOfMoney" :label="pageType === 3 ? '余额扣除（元）' : '余额充值（元）'">
            <template slot-scope="scope">
              <template v-if="scope.row.amountOfMoney">{{pageType === 3 ? '-' : '+'}}{{scope.row.amountOfMoney}}</template>
              <template v-else>{{scope.row.amountOfMoney | filterEmpty}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="amountOfMoney" :label="pageType === 3 ? '扣款时间' : '充值时间'">
            <template slot-scope="scope">{{scope.row.addTime | filterDate}}</template>
          </el-table-column>
          <el-table-column prop="auditStatus" label="审核状态">
            <template slot-scope="scope">{{scope.row.auditStatus | filterAuditStatus}}</template>
          </el-table-column>
          <el-table-column prop="auditorName" label="审核人">
            <template slot-scope="scope">{{scope.row.auditorName | filterEmpty}}</template>
          </el-table-column>
        </template>
          

        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="pageType !== 1">
                  <div @click="handleViewDetails(scope.row)"><i class="icon el-icon-view"></i>详情</div>
                </el-dropdown-item>
                <template v-else>
                  <el-dropdown-item>
                    <div @click="handleRechargeBefore(scope.row, 1)"><i class="icon el-icon-circle-check-outline"></i>充值</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="handleRechargeBefore(scope.row, 2)"><i class="icon el-icon-sold-out"></i>扣款</div>
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

    <template slot="other">
      
      <recharge-dialog :visible="rechargeVisible" :actionType="actionType" :initData="rechargeData" @close="rechargeVisible = false" @success="handleRechargeSuccess"></recharge-dialog>

    </template>
  </common-tpl>
</template>

<script>
import RechargeDialog from './RechargeDialog'

export default{
  components: {RechargeDialog},
  data () {
    return {
      loading: false,         // loading
      pageType: 1,            // 页面类型 [1、充值列表 2、充值记录]
      actionType: 1,          // 操作类型 [1、充值，2、扣款]
      formData: {             // 表单数据
        searchText: ''        // 会员姓名/手机号
      },
      rechargeData: {},       // 充值数据
      rechargeVisible: false, // 充值弹窗
      tableData: [],          // 列表数据
      pageData: {             // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  mounted () {
    if (this.$route.path.match(/record/gi)) this.pageType = 2
    if (this.$route.path.match(/chargebacks/gi)) this.pageType = 3

    this.$Utils.filterSearchData('/admin/finance/recharge', (res) => {
      this.formData = res
    })
    // 获取tab标签类型
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/finance/recharge', (res) => {
      if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },

  methods: {
    /**
     * 获取账户列表数据
     */
    getListData () {
      this.loading = true
      let url = this.pageType === 1 ? '@ROOT_API/memberAccountController/getMemberAccountList' : '@ROOT_API/accountRechargeController/getRechargeList'
      this.$http.post(url, {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        condition: this.formData.searchText,
        rechargeType: this.pageType === 3 ? 1 : 2,
        auditStatus: this.$route.path.match(/recharge/gi) ? '' : this.pageType
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
        let results = resData.data
        this.tableData = results.list
        results.list.forEach((row) => {
          if (row.paymentVoucher) row.paymentVoucher = row.paymentVoucher.split(',')
        })
        this.pageData.total = results.total
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
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
        this.$router.push({query: {page: this.pageData.currentPage}})
      }
    },

    /**
     * 充值前操作
     */
    handleRechargeBefore (row, type) {
      this.actionType = type
      this.rechargeVisible = true
      this.rechargeData = row
    },

    /**
     * 充值成功
     */
    handleRechargeSuccess () {
      this.rechargeVisible = false
      this.getListData()
    },

    /**
     * 查看详情
     */
    handleViewDetails (row) {
      if (!row) return false
      localStorage.setItem(this.$global.SYSTEM + 'RechargeDetails', JSON.stringify(row))
      setTimeout(() => {
        this.$router.push({path: '/admin/finance/recharge/details', query: {'customerId': row.customerId}})
      }, 30)
    }
  }
}
</script>

<style lang='less' scoped>
.finance-list-wrap{

  

}
</style>
