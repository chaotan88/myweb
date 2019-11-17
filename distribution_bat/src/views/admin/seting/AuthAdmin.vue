<!-- 设置 - 管理员设置 -->
<template>
  <common-tpl class="seting-admin-wrap">
    <template slot="header">
      <high-search :textVisible="false">
        <template slot="edit">
          <el-button class="add-btn fl-r" @click="$router.push('/admin/seting/auth/admin/add')"><i class="el-icon-plus fw-b"></i> 新增用户</el-button>
        </template>
      </high-search>
    </template>
    
    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="loginName" label="账户名"></el-table-column>
        <el-table-column prop="tmpTime" label="上次登录">
          <template slot-scope="scope">
              {{scope.row.tmpTime | filterDate}}
          </template>
        </el-table-column>
        <el-table-column prop="loginAmount" label="登录次数"></el-table-column>
        <el-table-column prop="groupName" label="权限组"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.roleType === 1">超级管理员不可删除</template>
            <template v-else>
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click = "$router.push({path:'/admin/seting/auth/admin/edit', query: { id: scope.row.id }})"><i class="icon el-icon-edit"></i>编辑</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="handleDelete = true, deleteData = scope.row" class="orange"><i class="icon el-icon-delete"></i>删除</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>
        </el-table-column>
        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>
    
      <!-- 分页 -->
      <div class="ta-c common-bottom-wrap handleup-b">
        <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :total="pageData.total" @current-change="pageChange" v-if="pageData.total"></el-pagination>
      </div>
    </template>

     <!-- 删除键 -->
    <template slot="other">
      <el-dialog title="提示" :visible.sync="handleDelete" width="30%">
        <span>确定是否删除此账户？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleDelete = false">取 消</el-button>
        <el-button type="primary" :loading="deleteLoading" @click="deleteHandle">确 定</el-button>
        </span>
      </el-dialog>
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      deleteLoading: false,   // 删除loading
      rules: {
        region: [{ required: true, message: '请选择快递类型', trigger: 'change' }],
        number: [{ required: true, message: '请输入快递单号', trigger: 'change' }]
      },
      // 列表数据
      tableData: [],
      handleDelete: false,
      deleteData: {},         // 删除对象
      selectAdminFlag: false, // 是否选中超级管理员
      pageData: {
        pageSize: 10,         // 每页分页数
        currentPage: 1,       // 当前分页
        total: 0              // 总条数
      }
    }
  },
  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.$http.post('@ROOT_API/manageUserController/list', {
        pageNum: this.pageData.currentPage,    // 当前页
        pageSize: this.pageData.pageSize       // 每页条数
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
        this.tableData = resData.data.dataList
        this.pageData.total = resData.data.totalPages * this.pageData.pageSize        // 自定义好的列表总条数为0，需要传值给后台数据，循环后台传回来的数据
      })
    },

    /**
     * 2.删除
     */
    deleteHandle (done) {
      if (this.deleteData.roleType === 1) {
        this.$message({
          message: '超级管理员不可删除',
          type: 'error',
          duration: 1500
        })
        return false
      }
      this.deleteLoading = true
      this.$http.post('@ROOT_API/manageUserController/delete', {
        id: this.deleteData.id
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: resData.msg,
          type: 'success',
          duration: 1000
        })
        this.handleDelete = false
        this.getListData()
      }).finally(() => {
        this.deleteLoading = false
      })
    },

    /**
     * 分页操作
     */
    pageChange (page) {
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
.seting-admin-wrap{
  .add-btn{
    height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>

<style lang="less">
.order-index-wrap{
  /*----------------发货----------*/
  .el-dialog{
    .el-dialog__body{
      text-align: left;

      .order-info{
        padding: 0 20px;
        border-bottom: 1px solid #eee;
        span{
          height: 35px;
          line-height: 35px;
          padding-bottom: 20px;
        }
      }

      .order-express{
        padding: 20px 0 0 0;

        .number{
          width: 46%;
        }
      }
    }

    .el-dialog__footer{
      .el-button{
        border-radius: 3px;
        border-color: none;
      }
    }
  }
}

.search-wrap .high-search-down .btn-wrap{
  margin-top: 0;
}

</style>
