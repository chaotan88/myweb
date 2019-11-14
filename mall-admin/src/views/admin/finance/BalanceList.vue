<!-- 结算管理 -->
<template>
  <common-tpl class="finance-balance-wrap">
    <template slot="header">
      <div class="statistics-wrap">
        <div class="ta-c list">
          <h2><strong>{{(statisticsData.waitSettleMoney + statisticsData.hasSettleMoney) | filterMoney}}</strong>{{(statisticsData.waitSettleMoney + statisticsData.hasSettleMoney) ? '元' : '--'}}</h2>
          <p>结算总金额</p>
        </div>
        <div class="ta-c list">
          <h2><strong>{{statisticsData.waitSettleMoney | filterMoney}}</strong>{{statisticsData.waitSettleMoney ? '元' : '--'}}</h2>
          <p>待结算金额</p>
        </div>
        <div class="ta-c list">
          <h2><strong>{{statisticsData.hasSettleMoney | filterMoney}}</strong>{{statisticsData.hasSettleMoney ? '元' : '--'}}</h2>
          <p>已结算金额</p>
        </div>
      </div>

      <!-- 高级搜索组件 -->
      <high-search :textVisible="false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入结算单号" v-model.trim="formData.searchText" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </div>
      </high-search>
    </template>

    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column label="结算单号">
          <template slot-scope="scope">{{scope.row.settleFormNo | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="结算金额">
          <template slot-scope="scope">{{scope.row.settleMoney | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="结算状态">
          <template slot-scope="scope">{{scope.row.settleStatus | filterSettleStatus}}</template>
        </el-table-column>
        <el-table-column label="结算方式">
          <template slot-scope="scope">{{scope.row.settleMethod | filterSettlement}}</template>
        </el-table-column>
        <el-table-column label="结算时间">
          <template slot-scope="scope">{{scope.row.settleTime | filterDate}}</template>
        </el-table-column>
        
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleView(scope.row)"><i class="icon el-icon-view"></i>查看明细</div>
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

  </common-tpl>
</template>

<script>
export default{
  data () {
    return {
      loading: false,         // loading
      formData: {
        searchText: ''        // 会员姓名/手机号
      },
      tableData: [],          // 列表数据
      statisticsData: {},     // 统计数据
      pageData: {             // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {},           // 用户信息
      settleFormId: ''        // 结算单id
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO)) || {}
    this.settleFormId = parseInt(this.$route.query.id) || ''
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/finance/balance/record', (res) => {
      this.formData = res
    })
    this.getStatisticsData()
    if (this.settleFormId) {
      this.getOrderListData()
    } else {
      this.getListData()
    }
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatisticsData () {
      this.$http.get('@ROOT_API/buySupplierSettleController/getSupplierSettleById', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.statisticsData = resData.data || {}
      })
    },

    /**
     * 获取列表数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        this.loading = true
        url = '@ROOT_API/buySupplierSettleFormController/getSupplierSettleFormList'
      } else {
        url = 'order/exportOrderList'
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        settleFormNo: this.formData.searchText
      }
      if (!type) {
        this.$http.get(url, {
          params: data
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
          this.pageData.total = results.total
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        for (let key in data) {
          filterParams.push(key + '=' + data[key])
        }
        window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
      }
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
     * 查看明细
     */
    handleView (row) {
      localStorage.setItem(this.$global.SYSTEM + 'BalanceRecordDetails', JSON.stringify(row))
      setTimeout(() => {
        this.$router.push({path: '/admin/finance/balance/record/list', query: {id: row.id}})
      }, 30)
    }
  }
}
</script>

<style lang='less'>
.finance-balance-wrap{

  /* -------------------- { 统计 } -------------------- */
  .statistics-wrap{
    padding: 30px 30px 0 30px;
    background: #fff;
    display: flex;

    .list{
      color: #fff;
      width: 33.33%;
      padding: 40px 0;
      overflow: hidden;
      background: url(../../../assets/img/statistics-bg.jpg) no-repeat center center;
      background-size: cover;
      box-sizing: border-box;
      border-radius: 5px;

      h2{
        font-size: 16px;
        font-weight: normal;

        strong{
          font-size: 22px;
          margin-right: 5px;
        }
      }
    }

    .list:first-child{
      margin-right: 20px;
    }

    .list:last-child{
      margin-left: 20px;
    }
  }

  /* -------------------- { 高级搜索 } -------------------- */
  .search-head-wrap{
    .el-input__inner{
      width: 210px;
    }
  }
}
</style>
