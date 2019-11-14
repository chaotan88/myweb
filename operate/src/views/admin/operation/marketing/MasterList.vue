<!-- 建群人管理 -->
<template>
  <common-tpl class="opertion-marketing-index-wrap">
    <template slot="header" class="search-wrap">
       <!-- 高级搜索组件 -->
      <high-search @search="searchHandle" :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入会员姓名/手机号" v-model.trim="formData.searchText" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="userName" label="会员姓名" min-width="120">
          <template slot-scope="scope"><div class="truncate">{{scope.row.userName | filterEmpty}}</div></template>
        </el-table-column>
        <el-table-column prop="phone" label="会员手机号" min-width="120">
          <template slot-scope="scope"><div class="truncate">{{scope.row.phone | filterEmpty}}</div></template>
        </el-table-column>
        <el-table-column prop="invitationCode" label="会员ID号" min-width="120">
          <template slot-scope="scope"><div class="truncate">{{scope.row.invitationCode | filterEmpty}}</div></template>
        </el-table-column>
       <el-table-column prop="groupNum" label="建群数量" min-width="120">
          <template slot-scope="scope"><div class="truncate">{{scope.row.groupNum | filterEmpty}}</div></template>
        </el-table-column>
        <el-table-column prop="shareNum" label="分享次数" min-width="120">
          <template slot-scope="scope"><div class="truncate">{{scope.row.shareNum | filterEmpty}}</div></template>
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
      loading: false,   // loading
      formData: {
        searchText: ''  // 搜索
      },
      tableData: [],    // 列表数据
      pageData: {       // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('operation/marketing/master', (res) => {
      this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },

  methods: {
    /**
     * 获取列表数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/poster/getListPagePosterGroup'
      } else {
        url = 'poster/exportPosterGroup'
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        contentText: this.formData.searchText
      }
      if (!type) {
        this.loading = true
        this.$http.post(url, data).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            this.pageData.total = 0
            this.tableData = []
            return false
          }
          this.pageData.total = resData.data.total
          resData.data.list.forEach((row) => {
            let regionArr = []
            if (row.province) regionArr.push(row.province)
            if (row.city) regionArr.push(row.city)
            if (row.zone) regionArr.push(row.zone)
            row.region = regionArr.join(', ')
          })
          this.tableData = resData.data.list
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
    }
  }
}
</script>

<style lang="less" scoped></style>
