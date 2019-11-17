<!-- 结算管理 - 结算记录 -->
<template>
  <common-tpl class="balacne-record-wrap">

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="addSource" label="交易内容">
          <template slot-scope="scope">{{scope.row.addSource | filterAddSource}}</template>
        </el-table-column>
        <el-table-column prop="propertyType" label="交易类型">
          <template slot-scope="scope">{{scope.row.propertyType | filterIntegralType}}</template>
        </el-table-column>
        <el-table-column prop="propertyAmount" label="结算额度">
          <template slot-scope="scope">{{scope.row.propertyAmount | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="addTime" label="结算时间">
          <template slot-scope="scope">{{scope.row.addTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="currentAmount" label="账户结余">
          <template slot-scope="scope">{{scope.row.currentAmount | filterMoney}}</template>
        </el-table-column>
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
      loading: false,           // 加载loading
      highSearchClose: true,    // 高级搜索开/关
      pageType: '',             // 页面类型［默认全部，10／分销派送，12／商品收益, 11／全球加权分红，13／办公场地补贴, 14／芯片销售收益］
      tableData: [],            // 列表数据
      customerid: '',           // 用户id
      pageData: {               // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    let pathType = this.$route.path.match(/all|recommend|earning|share|site-subsidy|chip|store/gi)[0]
    switch (pathType) {
      case 'all':
        this.pageType = ''   // 全部
        break
      case 'recommend':
        this.pageType = 10   // 分销派送
        break
      case 'earning':
        this.pageType = 12   // 商品收益
        break
      case 'share':
        this.pageType = 11   // 全球加权分红
        break
      case 'site-subsidy':
        this.pageType = 13   // 办公场地补贴
        break
      case 'chip':
        this.pageType = 14   // 芯片销售收益
        break
      case 'store':
        this.pageType = 19   // 店补
        break
    }
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.customerId = parseInt(localStorage.getItem(this.$global.SYSTEM + 'SaleCustomerId'))
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/settleManageController/getSettleLogList', {
        start: this.pageData.currentPage,     // 是 string  当前页
        pageSize: this.pageData.pageSize,     // 是 string  每页条数
        condition: '',                        // 否 string  手机号
        propertyType: '',                     // 否 int 交易类型 （1：消费积分，2：通用积分，3：金额）
        customerPhone: '',                    // 否 string 会员手机
        customerId: this.customerId,          // 是 string 会员id
        addSource: this.pageType              // 否 int 交易内容 1：购买商品，2：销售商品，3：推荐用户,4：支出积分，5：注册获取积分，6：每日登录获取积分，7：退回积分，8：充值 9：支出余额 10：分销派送 11：全球加权分红 12：商品收益 13：办公场地补贴 14：芯片销售收益
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1 && parseInt(resData.status) !== 9998) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.pageData.total = 0
          return false
        }
        this.pageData.total = resData.data.total
        this.tableData = resData.data.list
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      // localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      if (this.pageData.currentPage === page) {
        this.getListData()
      } else {
        this.pageData.currentPage = page
        this.$router.push({query: {page: this.pageData.currentPage}})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.balacne-record-wrap{}
</style>

