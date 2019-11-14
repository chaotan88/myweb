<!-- 设置 - 管理员设置 -->
<template>
  <common-tpl class="seting-admin-wrap">
    <template slot="header">
      <high-search :textVisible="false">
        <template slot="edit">
          <el-button class="add-btn fl-r" @click="$router.push('/admin/seting/admin/add')"><i class="el-icon-plus fw-b"></i> 添加管理员</el-button>
        </template>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="loginName" label="登录名"></el-table-column>
        <el-table-column prop="tmpTime" label="上次登录">
          <template slot-scope="scope">{{scope.row.tmpTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="loginAmount" label="登录次数"></el-table-column>
        <el-table-column prop="groupName" label="权限组"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.roleType === 1 || scope.row.loginName === userInfo.loginName">超级管理员不可编辑</template>
            <template v-else>
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click = "$router.push({path:'/admin/seting/admin/edit', query: { id: scope.row.id }})"><i class="icon el-icon-edit"></i>编辑</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="handleDelete = true, deleteId = [scope.row.id]" class="orange"><i class="icon el-icon-delete"></i>删除</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>
        </el-table-column>
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

     <!-- 删除键 -->
    <template slot="other">
      <el-dialog title="提示" :visible.sync="handleDelete" width="30%">
        <span>确认是否删除权限组？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteHandle">确 定</el-button>
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
      deleteId: '',                     // 删除id
      selectAdminFlag: false,            // 是否选中超级管理员
      pageData: {                   // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {}
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.pageData.currentPage = parseInt(this.$route.query.page || 1)
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      // this.$router.push({query: {page: this.currentPage}})    // 地址栏追加当前分页（当你刷新的时候不会回到第一页）
      this.$http.post('@ROOT_API/admin/list', {
        pageNum: this.pageData.currentPage,    // 当前页
        pageSize: this.pageData.pageSize       // 每页条数
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.tableData = resData.data.dataList
        this.pageData.total = resData.data.totalPages * resData.data.pageSize  // 自定义好的列表总条数为0，需要传值给后台数据，循环后台传回来的数据
      })
    },

    /**
     * 2.删除
     */
    deleteHandle (done) {
      this.$http.post('@ROOT_API/admin/delete', {
        id: parseInt(this.deleteId) // this.deleteId.join(',')
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
          type: 'success'
        })
        this.handleDelete = false
        this.getListData()
      })
    },

    /**
     * 判断超级管理员不可选择
     */
    selectChange (row, item) {
      if (item.roleType === 1) {
        this.$message({
          message: '超级管理员不可编辑',
          type: 'error',
          duration: 1500
        })
        this.$refs.multipleTable.toggleRowSelection(item, false)
      }
    },

    handleSelectionChange (item) {
      this.deleteId = []
      item.forEach((row) => {
        this.deleteId.push(row.id)
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
    },

    editHandle (row) {
      console.log(row)
    },

    /**
     * 提交交货
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm (formName) {
      this.$refs[formName].resetFields()
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
