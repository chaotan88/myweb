<!-- 会员中心 -->
<template>
  <common-tpl class="order-index-wrap vip-index-wrap" :footer="false">
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle" :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入会员姓名/手机号" v-model.trim="formData.searchText" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column fixed prop="cardName" label="会员姓名">
          <template slot-scope="scope">{{scope.row.cardName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            {{scope.row.sex | filterSex}}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="registerTime" label="注册时间">
          <template slot-scope="scope">{{scope.row.registerTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="address" label="所在地">
          <template slot-scope="scope">{{scope.row.region | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间">
          <template slot-scope="scope">{{scope.row.lastLoginTime | filterDate}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="viewDetailsHandle(scope.row)"><i class="icon el-icon-view"></i>详情</div>
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
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      loading: false,        // loading
      formData: {
        searchText: ''       // 会员姓名/手机号
      },
      tableData: [],         // 列表数据
      pageData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/vip/center/', (res) => {
      this.formData = res
    })
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/member/getMemberList', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        queryCondition: this.formData.searchText
      }).then((res) => {
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
     * 查看详情
     */
    viewDetailsHandle (row) {
      if (!row) return false
      localStorage.setItem(this.$global.SYSTEM + 'VipDetails', JSON.stringify(row))
      setTimeout(() => {
        this.$router.push('/admin/vip/center/details')
      }, 200)
    }
  }
}
</script>

<style lang="less" scoped>
.vip-index-wrap{

  .vip-search-wrap{
    width: 20%;
    padding-bottom: 20px;
  }

  .common-table-wrap{
    padding: 0;
    .el-table{
      border: 1px solid #ebeef5;
      border-bottom: none;
    }
  }
}
</style>
<style lang="less">
.vip-index-wrap{

  /*-----------搜索框----------*/
  .vip-search-wrap{
    width: 25%;
    padding-bottom: 20px;

    .el-input__inner{
      border-radius: 30px;
    }

    span{
      right: 20px;
      top: 12px;
      cursor:pointer
    }

    span:hover{
      color: #409EFF;
    }
  }
}
</style>
