<!-- 分销规则列表页 -->
<template>
  <common-tpl class="distribution-list-wrap" :footer="false">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle" :textVisible = "false">
        <div class="pos-r" slot="search">
          <div class="d-ib pos-r">
            <el-input placeholder="输入套餐名称" v-model.trim="formData.contentText" @keyup.enter.native="searchHandle" style="width: 220px;"></el-input>
            <i class="ta-c pos-a el-icon-search" title="搜索" @click="searchHandle"></i>
          </div>
        </div>
        <template slot="edit">
          <el-button @click="handleLink()"><i class=""></i>添加套餐</el-button>
        </template>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="setMealNumber" label="套餐编号" width="220px">
          <template slot-scope="scope">{{scope.row.setMealNumber | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200px">
          <template slot-scope="scope">{{scope.row.createTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="setMealName" label="套餐名称" width="230px">
          <template slot-scope="scope">{{scope.row.setMealName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="setMealPrice" label="销售价" width="120px">
          <template slot-scope="scope">{{scope.row.setMealPrice | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="commissionType" label="分佣类型" min-width="100">
          <template slot-scope="scope">
            <template v-if="parseInt(scope.row.commissionType) === 1">礼包分佣</template>
            <template v-else>提货分佣</template>
          </template>
        </el-table-column>
        <el-table-column prop="configurationMoney" label="已配置金额">
          <template slot-scope="scope">{{scope.row.configurationMoney}}</template>
        </el-table-column>
        <el-table-column prop="setMealStatus" label="套餐状态">
          <template slot-scope="scope">
            <template v-if="parseInt(scope.row.setMealStatus) === 1">开启</template>
            <template v-else>关闭</template>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b" v-if="parseInt(scope.row.rand) !== 0">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.setMealStatus === 1">
                  <div @click="handleCloseBefore(scope.row)"><i class="icon el-icon-edit"></i>关闭</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.setMealStatus === 2">
                  <div @click="handleLink(scope.row)"><i class="icon el-icon-circle-close"></i>编辑</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.setMealStatus === 2">
                  <div @click="handleDeleteBefore(scope.row)"><i class="icon el-icon-delete"></i>删除</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
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

    <template slot="other">
      <!-- 删除 -->
      <el-dialog title="删除套餐" :visible.sync="deleteVisible" width="480px">
        确认是否删除？
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="handleDelete">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 关闭 -->
      <el-dialog title="关闭套餐" :visible.sync="closeVisible" width="480px">
        确定是否关闭此套餐？
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeVisible = false">取 消</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="handleClose">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    // 代理费
    let validateAgent = (rule, value, callback) => {
      let reg = /^[0-9]{1,8}([.][0-9]{1,2})?$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('请输入10个字符以内的代理费，限2位小数'))
      callback()
    }
    return {
      confirmLoading: false,    // 确定loading
      highSearchClose: true,    // 高级搜索开/关
      tableData: [],            // 列表数据
      loading: false,           // 加载loading
      formData: {
        ruleName: '',           // 规则名称
        agentLowness: '',       // 价格低
        agentHigh: ''           // 价格高
      },
      copyFormData: {},         // 拷贝数据
      deleteVisible: false,     // 删除弹框
      deleteData: {},           // 删除数据
      closeVisible: false,
      closeData: {},
      pageData: {               // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        // 代理费低
        agentLowness: { validator: validateAgent, trigger: 'blur' },

        // 代理费高
        agentHigh: { validator: validateAgent, trigger: 'blur' }
      }
    }
  },
  mounted () {
    this.copyFormData = this.$Utils.deepCopy(this.formData)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/distribution/rule', (res) => {
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
      this.$http.post('@ROOT_API/meal/getSetMealList', {
        start: this.pageData.currentPage,             // 是 int 开始时间
        pageSize: this.pageData.pageSize,             // 是 int 开始时间
        setMealName: this.formData.contentText
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
        let results = resData.data
        results.list.forEach((row, index) => {
          if (index < 3) row.status = '1'
          else row.status = '0'
        })
        this.tableData = results.list
        this.pageData.total = results.total
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 新增/编辑
     */
    handleLink (item) {
      if (!item) {
        this.$router.push('/admin/business/package/add')
      } else {
        localStorage.setItem('MANAGER_STORE', JSON.stringify(item))
        this.$router.push({path: '/admin/business/package/edit', query: {id: item.id}})
      }
    },

    /**
     * 删除前操作
     */
    handleDeleteBefore (row) {
      this.deleteVisible = true
      this.deleteData = row
    },

    /**
     * 删除
    */
    handleDelete () {
      this.confirmLoading = true
      this.$http.post('@ROOT_API/meal/deleteSetMeal', {
        id: this.deleteData.id
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.$message({
          message: resData.msg,
          type: 'success',
          duration: 1000
        })
        this.deleteVisible = false
        this.getListData()
      }).finally(() => {
        setTimeout(() => {
          this.confirmLoading = false
        }, 1000)
      })
    },

    /**
     * 关闭前操作
     */
    handleCloseBefore (row) {
      this.closeVisible = true
      this.closeData = row
    },

    /**
     * 关闭
    */
    handleClose () {
      this.confirmLoading = true
      this.$http.post('@ROOT_API/meal/closeSetMeal', {
        id: this.closeData.id
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.$message({
          message: resData.msg,
          type: 'success',
          duration: 1000
        })
        this.closeVisible = false
        this.getListData()
      }).finally(() => {
        setTimeout(() => {
          this.confirmLoading = false
        }, 1000)
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
     * 高级搜索
     */
    highSearch (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.highSearchClose = false
          return false
        }
        this.highSearchClose = true
        this.pageChange(1)
      })
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 自动补全百分位
     */
    inpBlur (type) {
      this.$Utils.blurAutoCompletion(this.formData, type)
    },

    /**
     * 清空重置搜索
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
    }
  }
}
</script>

<style lang="less" scoped>
.distribution-list-wrap{

  .search-form{
    .el-form-item{

      .time-type-wrap{
        width: 100px;
        padding-right: 10px;
        box-sizing: border-box;
        left: -100px;
      }
    }
  }
  .admin-common-main{
    padding-top: 20px;
  }
}
</style>
<style lang="less">
.distribution-list-wrap{
  .search-form{
    .agent{
      .el-form-item__content{
        margin-left: 0 !important;
        margin-right: 100px;
      }
    }
  }
}
</style>