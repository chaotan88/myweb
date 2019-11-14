<!-- 转赠管理 -->
<template>
  <common-tpl class="finance-gift-list">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle" :textVisible = "false">
        <div class="pos-r" slot="search">
          <div class="d-ib pos-r">
            <el-input placeholder="输入会员姓名/手机号/ID号" v-model.trim="formData.contentText" @keyup.enter.native="searchHandle" style="width: 220px;"></el-input>
            <i class="ta-c pos-a el-icon-search" title="搜索" @click="searchHandle"></i>
          </div>
        </div>
        <template slot="edit">
          <el-button @click="exportData" :disabled="!tableData.length"><i class=""></i>导出</el-button>
        </template>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <!-- 列表 -->
      <el-table border :data="tableData" style="width: 100%" max-height="525" ref="multipleTable" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="" label="转赠人姓名">
          <template slot-scope="scope">{{scope.row.transferName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="转赠人手机" width="180">
          <template slot-scope="scope">{{scope.row.transferPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="转赠人ID号" width="180">
          <template slot-scope="scope">{{scope.row.transferInvitationCode | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="转赠通用积分（个）">
          <template slot-scope="scope">{{scope.row.transferPoints | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="通用积分结余（个）">
          <template slot-scope="scope">{{scope.row.transferPointsSurplus | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="被转赠人姓名">
          <template slot-scope="scope">{{scope.row.beTransferName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="被转赠人手机号" width="180">
          <template slot-scope="scope">{{scope.row.beTransferPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="被转赠人ID号">
          <template slot-scope="scope">{{scope.row.beTransferInvitationCode | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="转赠时间" width="180">
          <template slot-scope="scope">{{scope.row.createTime | filterDate}}</template>
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

    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      loading: false,                 // loading
      tableData: [{
        name: 111
      }],
      formData: {
        contentText: ''
      },
      pageData: {             // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    // 获取tab标签类型
    // let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageStatus)
    // localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageStatus)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/finance/giftGiving', (res) => {
      this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/pointsTransfer/getPointsTransferDetail', {
        contentText: this.formData.contentText,
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
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 导出
     */
    exportData () {
      let url = 'pointsTransfer/exportPointsTransferGroup'
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + 'contentText=' + this.formData.contentText, '_blank')
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
    }
  }
}
</script>

<style lang="less" scoped>
.finance-gift-list{

  
}
</style>

<style lang="less">
.finance-gift-list{
 
}
</style>
