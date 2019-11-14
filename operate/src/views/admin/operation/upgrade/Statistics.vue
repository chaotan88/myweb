<!-- 超级拼图-拼团统计列表 -->
<template>
  <common-tpl class="suppper-assemble-index-wrap" :footer="false">

    <!-- 列表 -->
    <template slot="main">
      <el-table border :data="tableData" class="full-w">
        <el-table-column prop="mainImage" label="商品图片" min-width="100">
          <template slot-scope="scope">
            <thumbnail-component :list="[{url: scope.row.mainImage}]" :size="50"></thumbnail-component>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.brandName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNo" label="商品编码">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" >
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="buyingPrice" label="进货价（元）">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.buyingPrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsPrice" label="销售价（元）">
          <template slot-scope="scope">
            <div>{{scope.row.goodsPrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsGroupPrice" label="拼团价（元）">
          <template slot-scope="scope">
            <div>{{scope.row.goodsGroupPrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="利润率">
          <template slot-scope="scope">{{scope.row.profiRate | filterEmpty('%')}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleLink(scope.row, 'details')"><i class="icon el-icon-view"></i>详情</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        background layout="prev, pager, next"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        @current-change="pageChange"
        v-if="pageData.total"
      >
      </el-pagination>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      loading: false,  // loading
      formData: {
      },
      tableData: [],   // 列表数据
      pageData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {}     // 用户信息
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/operation/extension/supper/assemble/statistics', (res) => {
      this.formData = res
    })
    this.getListData()
  },
  methods: {
    /**
     * 得到列表
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/groupStatisticsController/getGroupGoodsList', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }).then((res) => {
        let results = res.data
        if (parseInt(results.status) !== 1) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.pageData.total = 0
          return false
        }
        let data = results.data
        this.tableData = data.list
        this.pageData.total = data.total
      }).finally(() => {
        this.loading = false
      })
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
     * 查看详情
     */
    handleLink (row) {
      if (!row) return false
      localStorage.setItem(this.$global + 'StatisticsGoodsId', row.goodsId)
      localStorage.setItem(this.$global + 'StatisticsGoodsName', row.goodsName)
      setTimeout(() => {
        this.$router.push({
          path: '/admin/operation/extension/supper/assemble/statistics-details',
          query: {}
        })
      }, 200)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
<style lang="less">
</style>
