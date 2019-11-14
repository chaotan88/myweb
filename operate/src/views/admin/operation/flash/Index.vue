<!-- 促销转化 - 限时特卖 -->
<template>
  <common-tpl class="assemble-wrap">
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle" :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-input placeholder="请输入活动名称" v-model.trim="formData.themeName" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <template slot="edit">
           <el-button @click="addFlashHandle">新增限时特卖</el-button>
        </template>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">

        <el-table-column label="活动名称" >
          <template slot-scope="scope">{{scope.row.themeName | filterEmpty}}</template>
        </el-table-column>
        
        <el-table-column label="活动时间">
          <template slot-scope="scope">{{scope.row.startDate | filterDate}} - {{scope.row.endDate | filterDate}}</template>
        </el-table-column>

        <el-table-column label="活动状态" width="150">
          <template slot-scope="scope">{{scope.row.status | filterActivityState}}</template>
        </el-table-column>

        <el-table-column label="是否启用" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.ifEnable == 1 ? true : false"
              @change="changeStatus($event,scope.row)">
            </el-switch>
            {{scope.row.ifEnable === 1 ? '是' : '否'}}</template>
        </el-table-column>

        <el-table-column label="创建人" width="150">
          <template slot-scope="scope">{{scope.row.creatorName | filterEmpty}}</template>
        </el-table-column>

        <el-table-column label="创建时间" width="330">
          <template slot-scope="scope">{{scope.row.createTime | filterDate}}</template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleEdit(scope.row)"><i class="icon el-icon-edit"></i>编辑</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="deleteTipsHandle(scope.row)"><i class="icon el-icon-delete"></i>删除</div>
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
       <!-- 删除提示 -->
      <el-dialog
        title="删除活动"
        :visible.sync="deleteVisible"
        width="480px">
        确定是否删除活动？
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteHandle">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      deleteVisible: false,  // 删除弹窗
      pageType: 0,            // 0-全部，1-未开始，2-进行中，3-已结束
      formData: {
        themeName: ''        // 高级搜索名称
      },
      tableData: [],
      getIdByInitData: {},   // 新增id
      pageData: {            // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {}           // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('operation/marketing/poster', (res) => {
      this.formData = res
    })
    switch (this.$route.path.match(/index|not|way|end/gi)[0]) {
      case 'index':
        this.pageType = ''
        break
      case 'not':
        this.pageType = 0
        break
      case 'way':
        this.pageType = 1
        break
      case 'end':
        this.pageType = 2
        break
    }
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    // 获取tab标签类型
    this.getListData()
  },

  methods: {
    /**
     * 列表数据
     */
    getListData () {
      this.loading = true
      this.$http.get('@ROOT_API/shareTheme/getFlashSaleList', {
        params: {
          status: this.pageType,             //  否 int 活动状态（0：未开始、1：进行中、2：已结束）
          themeName: this.formData.themeName,
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
        }
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
     * 列表内改变状态
     */
    changeStatus (val, row) {
      let ifStatus = val === true ? 1 : 0
      this.$http.post('@ROOT_API/shareTheme/changeEnableStatus', {
        id: row.id,
        ifStatus: ifStatus
      }).then((res) => {
        let results = res.data
        if (parseInt(results.status) !== 1) {
          this.$message({
            message: results.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.$message({
          message: results.msg,
          type: 'success',
          duration: 1500
        })
        this.getListData()
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 添加限时特卖
     */
    addFlashHandle () {
      this.$http.post('@ROOT_API/shareTheme/getIdByInit', {
        themeType: 7
      }).then((res) => {
        console.log('themeType: ', this.themeType)
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        let results = resData.data
        console.log('themeType: ', this.themeType)
        if (results) {
          this.$router.push({path: '/admin/operation/conversion/flash/add', query: {themeId: results, type: 7}})
        }
      })
    },
    /**
     * 编辑
     */
    handleEdit (row) {
      this.$router.push({
        path: '/admin/operation/conversion/flash/edit',
        query: {id: row.id, type: 7}
      })
    },
    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 删除前操作
     */
    deleteTipsHandle (item) {
      this.deleteVisible = true
      this.deleteData = item
    },

    /**
     * 删除
     */
    deleteHandle () {
      this.$http.post('@ROOT_API/shareTheme/deleteTheme', {
        id: this.deleteData.id
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: resData.msg,
          duration: 1000,
          type: 'success'
        })
        this.deleteVisible = false
        this.getListData()
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>

<style lang="less">

</style>
