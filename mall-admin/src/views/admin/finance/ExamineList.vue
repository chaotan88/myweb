<!-- 充值审核 -->
<template>
  <common-tpl class="finance-index-wrap">
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
        <el-table-column prop="customerName" label="会员姓名">
          <template slot-scope="scope">{{scope.row.customerName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="手机号">
          <template slot-scope="scope">{{scope.row.customerPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="amountOfMoney" label="余额（元）">
          <template slot-scope="scope">
            <template v-if="scope.row.amountOfMoney">{{scope.row.rechargeType === 1 ? '-' : '+'}}{{scope.row.amountOfMoney | filterEmpty}}</template>
            <template v-else>{{scope.row.amountOfMoney | filterEmpty}}</template>
          </template>
        </el-table-column>
        <el-table-column prop="consumePoints" label="消费积分（元）">
          <template slot-scope="scope">
            <template v-if="scope.row.consumePoints">{{scope.row.rechargeType === 1 ? '-' : '+'}}{{scope.row.consumePoints | filterEmpty}}</template>
            <template v-else>{{scope.row.consumePoints | filterEmpty}}</template>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="amountOfMoney" label="充值账户">
          <template slot-scope="scope">{{scope.row.amountOfMoney | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="amountOfMoney" label="充值额度">
          <template slot-scope="scope">{{scope.row.amountOfMoney | filterEmpty}}</template>
        </el-table-column> -->
        <el-table-column prop="rechargeUserName" label="申请人">
          <template slot-scope="scope">{{scope.row.rechargeUserName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="addTime" label="申请时间">
          <template slot-scope="scope">{{scope.row.addTime | filterDate}}</template>
        </el-table-column>
        
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="parseInt(scope.row.auditStatus) === 1 || pageType === 1">
                  <div @click="handleExamineBefore(scope.row)"><i class="icon el-icon-edit"></i>审核</div>
                </el-dropdown-item>
                <el-dropdown-item v-else>
                  <div @click="handleViewDetails(scope.row)"><i class="icon el-icon-view"></i>详情</div>
                </el-dropdown-item>
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

      <examine-dialog :visible="examineVisible" :pageType="2" :actionType="actionType" :initData="examineData" @close="examineVisible = false" @success="handleSuccess"></examine-dialog>

    </template>
  </common-tpl>
</template>

<script>
import ExamineDialog from './RechargeDialog'

export default{
  components: {ExamineDialog},
  data () {
    return {
      loading: false,         // loading
      pageType: 1,            // 页面类型 [1、待审核 2、审核通过 3、审核不通过]
      actionType: 1,          // 操作类型 [1、充值，2、扣款]
      formData: {             // 表单数据
        searchText: ''        // 会员姓名/手机号
      },
      examineData: {},        // 充值数据
      examineVisible: false,  // 充值弹窗
      tableData: [],          // 列表数据
      pageData: {             // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  mounted () {
    let matchPath = this.$route.path.match(/all|index|pass|reject/gi)[0]
    switch (matchPath) {
      case 'all':
        this.pageType = 0
        break
      case 'index':
        this.pageType = 1
        break
      case 'pass':
        this.pageType = 2
        break
      case 'reject':
        this.pageType = 3
        break
    }
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    // 获取tab标签类型
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/finance/examine', (res) => {
      if (getPagetype !== '' && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
    })
    this.getListData()
  },

  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/accountRechargeController/getRechargeList', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        rechargeType: '',       // 是 int 类型 1.扣除 2.充值
        auditStatus: this.pageType ? this.pageType : '',
        condition: this.formData.searchText
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
     * 审核前操作
     */
    handleExamineBefore (row) {
      this.actionType = row.rechargeType === 1 ? 2 : 1
      this.examineVisible = true
      this.examineData = row
    },

    /**
     * 成功操作
     */
    handleSuccess () {
      this.examineVisible = false
      this.getListData()
    },

    /**
     * 查看详情
     */
    handleViewDetails (row) {
      if (!row) return false
      localStorage.setItem(this.$global.SYSTEM + 'RechargeDetails', JSON.stringify(row))
      setTimeout(() => {
        this.$router.push({path: '/admin/finance/examine/details', query: {'customerId': row.customerId}})
      }, 30)
    }
  }
}
</script>

<style lang='less' scoped>
.finance-index-wrap{

  /* -------------------- { 充值弹窗用户信息 } -------------------- */
  .recharge-table{
    border-collapse: collapse;
    border: 1px solid #ebeef5;
    margin-bottom: 30px;

    th, td{
      padding: 0 15px;
    }

    th{
      width: 25%;
      height: 40px;
      background: #eef1f9;
    }

    td{
      border-left: 1px solid #ebeef5;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }

  /* -------------------- { 充值弹窗表单 } -------------------- */
  .el-form{
    border: 1px solid #ebeef5;
    margin-bottom: 30px;

    .el-form-item{
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 15px;
      margin-bottom: 15px;

      .el-input{
        width: 200px;
        margin-right: 10px;
      }
    }

    .el-form-item:last-child{
      border-bottom: 0;
      margin-bottom: 0;
    }
  }

  .gray-text{
    color: #bbb;
    font-size: 14px;

    strong{
      color: red;
      font-size: 18px;
    }
  }

}
</style>
