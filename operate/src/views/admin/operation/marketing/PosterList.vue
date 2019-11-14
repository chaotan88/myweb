<!-- 拉群海报管理 -->
<template>
  <common-tpl class="gift-record-wrap">
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle" :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-input placeholder="请输入标题名称" v-model.trim="formData.title" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="$router.push('/admin/operation/marketing/poster/add')">新增海报</el-button>
        </template>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column label="海报标题">
          <template slot-scope="scope">{{scope.row.title | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="海报图片">
          <template slot-scope="scope">
            <!-- 缩略图 -->
            <thumbnail-component :list="[{url: scope.row.image}]" :size="40"></thumbnail-component>
          </template>
        </el-table-column>
        <el-table-column label="分享数">
          <template slot-scope="scope">{{scope.row.shareNum | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.delStatus == 0 ? true : false"
              @change="changeStatus($event,scope.row)">
            </el-switch>
            {{scope.row.delStatus === 0 ? '是' : '否'}}</template>
        </el-table-column>
        <el-table-column prop="endTime" label="更新时间" min-width="160">
          <template slot-scope="scope">{{scope.row.updateTime | filterDate}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleEdit(scope.row)"><i class="icon el-icon-edit"></i>编辑</div>
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
      <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total" @current-change="pageChange" v-if="pageData.total">
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
      loading: false,
      formData: {
        title: ''     // 高级搜索名称
      },
      tableData: [],
      pageData: {           // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {}                  // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('operation/marketing/poster', (res) => {
      this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },

  methods: {
    /**
     * 列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/poster/page', {
        title: this.formData.title,
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
    detailsHandle (row) {
      this.detailsData = row
      console.log('detailsData', this.detailsData)
    },
    /**
     * 列表内改变状态
     */
    changeStatus (val, row) {
      let delStatus = val === true ? 0 : 1
      this.$http.post('@ROOT_API/poster/editStatus', {
        id: row.id,
        delStatus: delStatus
      }).then((res) => {
        let results = res.data
        if (parseInt(results.status) !== 1) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.getListData()
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 编辑
     */
    handleEdit (row) {
      this.$router.push({
        path: '/admin/operation/marketing/poster/edit',
        query: {id: row.id}
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>

<style lang="less">

</style>
