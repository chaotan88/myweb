<!-- 权限组 -->
<template>
  <common-tpl class="seting-admin-wrap">
    <template slot="header">
      <high-search :textVisible="false">
        <template slot="edit">
          <el-button class="add-btn fl-r" @click="$router.push('/admin/seting/authgroup/add')"><i class="el-icon-plus fw-b"></i> 新增权限组</el-button>
        </template>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="groupName" label="权限组"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.groupType === 1">超级权限组不可删除</template>
            <template v-else>
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click = "$router.push({path:'/admin/seting/authgroup/edit', query: {id: scope.row.id}})"><i class="icon el-icon-edit"></i>编辑</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="handleDelete = true, deleteData = scope.row" class="orange"><i class="icon el-icon-delete"></i>删除</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="ta-c common-bottom-wrap handleup-b">
        <el-pagination background layout="prev, pager, next" :current-page="currentPage" v-if="listTotal" :total="listTotal" @current-change="pageChange"></el-pagination>
      </div>
    </template>

     <!-- 删除键 -->
    <template slot="other">
      <el-dialog title="提示" :visible.sync="handleDelete" width="30%">
        <span>确认是否删除？</span>
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
    // 商品编码
    // let validateCode = (rule, value, callback) => {
    //   if (!value) callback(new Error('请输入商品编码'))
    //   let reg = /^[A-Za-z0-9]+$/gi
    //   if (value.length > 20 || !value.toString().match(reg)) callback(new Error('限20位数字或字母'))
    //   callback()
    // }
    return {
      deleteLoading: false,                        // 删除loading
      formData: {
        timeTypeMsg: '下单时间',                   // 搜索
        name: '张三',                              // 发货人姓名
        phone: '13613088572',                      // 发货人电话
        adress: '深圳市南山区科苑路科兴科学园A栋', // 发货人地址
        region: '',                                // 快递类型
        number: '',                                // 快递单号
        type: [],
        value6: ''
      },
      rules: {
        region: [{ required: true, message: '请选择快递类型', trigger: 'change' }],
        number: [{ required: true, message: '请输入快递单号', trigger: 'change' }]
        // number: [{ required: true, validator: validateCode, trigger: 'change' }]
      },
      // 列表数据
      tableData: [],
      handleDelete: false,
      deleteData: {},         // 删除对象
      selectAdminFlag: false, // 是否选中超级权限
      pageSize: 10,          // 每页分页数
      currentPage: 1,        // 当前分页
      listTotal: 0,          // 总条数
      userInfo: {}
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },
  methods: {
    /**
    * 获取列表数据
    */
    getListData () {
      // this.$router.push({query: {page: this.currentPage}})    // 地址栏追加当前分页（当你刷新的时候不会回到第一页）
      this.$http.post('@ROOT_API/auth/list', {
        id: this.userInfo.userId,              // 当前登录人id
        pageNum: this.currentPage,    // 当前页
        pageSize: this.pageSize       // 每页条数
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1 && parseInt(resData.status) !== 9998) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.listTotal = 0
          this.tableData = []
          return false
        }
        this.listTotal = resData.data.totalPages * this.pageSize        // 自定义好的列表总条数为0，需要传值给后台数据，循环后台传回来的数据
        this.tableData = resData.data.dataList
      })
    },

    // 2.删除
    deleteHandle (done) {
      if (this.deleteData.groupType === 1) {
        this.$message({
          message: '超级权限组不可删除',
          type: 'error',
          duration: 1500
        })
        return false
      }
      this.deleteLoading = true
      this.$http.post('@ROOT_API/auth/delete', {
        ids: this.deleteData.id
      }).then((res) => {
        if (res.data.status === '0') {
          this.handleDelete = false
          this.$message({
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return false
        }
        if (res.data.status !== '1') {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: res.data.msg,
          type: 'success'
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
    margin-bottom: 20px;
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
