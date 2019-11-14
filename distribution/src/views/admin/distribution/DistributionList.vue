<!-- 分销规则列表页 -->
<template>
  <common-tpl class="distribution-list-wrap" :footer="false">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入身份名称" v-model.trim="formData.ruleName" @keyup.enter.native="searchHandle">
          </el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form ref="form" :rules="rules" :model="formData" label-position="right" label-width="100px" class="search-form">
            <el-form-item label="会员身份：">
              <el-input v-model.trim="formData.ruleName" placeholder="身份名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="代理费：">
              <el-col :span="11">
                <el-form-item prop="agentLowness" class="fl-l">
                  <el-input v-model.trim="formData.agentLowness" @blur="inpBlur('agentLowness')" placeholder="精确到百分位，限10个字符" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col class="ta-c fl-l" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="agentHigh" class="agent fl-l">
                  <el-input v-model.trim="formData.agentHigh" @blur="inpBlur('agentHigh')" placeholder="精确到百分位，限10个字符" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="clear"></div>
        </div>
        <!-- <div slot="edit">
          <template>
            <el-button @click="handleLink()"><i class="el-icon-plus fw-b"></i>创建身份</el-button>
          </template>
        </div> -->
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="ruleName" label="会员身份" width="120px">
          <template slot-scope="scope">{{scope.row.ruleName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="agentFee" label="代理费(元)" width="120px">
          <template slot-scope="scope">{{scope.row.agentFee | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="consumePointRate" label="直接推荐比例（消费积分）" width="230px">
          <template slot-scope="scope">{{scope.row.consumePointRate | filterEmpty('%')}}</template>
        </el-table-column>
        <el-table-column prop="cashRate" label="直接推荐比例（通用积分）" width="230px">
          <template slot-scope="scope">{{scope.row.cashRate | filterEmpty('%')}}</template>
        </el-table-column>
        <el-table-column prop="directSubName" label="下级名称" min-width="100">
          <template slot-scope="scope">
            <template v-if="parseInt(scope.row.rand) === 0">{{'' | filterEmpty}}</template>
            <template v-else>{{scope.row.directSubName | filterEmpty}}</template>
          </template>
        </el-table-column>
        <el-table-column prop="rand" label="级数">
          <template slot-scope="scope">{{scope.row.rand}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b" v-if="parseInt(scope.row.rand) !== 0">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleLink(scope.row)"><i class="icon el-icon-edit"></i>编辑</div>
                </el-dropdown-item>
                <el-dropdown-item>
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
      <el-dialog title="删除分销规则" :visible.sync="deleteVisible" width="480px">
        确认是否删除？
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="handleDelete">确 定</el-button>
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
      this.$http.post('@ROOT_API/rule/getRuleList', {
        start: this.pageData.currentPage,             // 是 int 开始时间
        pageSize: this.pageData.pageSize,             // 是 int 开始时间
        agentAmountMin: this.formData.agentLowness,   // 否 double  代理金额最小值
        agentAmountMax: this.formData.agentHigh,      // 否 double  代理金额最大值
        ruleName: this.formData.ruleName               // 否 string  规则名称
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
        // results.list.forEach((row, index) => {
        //   if (index < results.list.length - 1) row.subordinate = results.list[index + 1].ruleName
        // })
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
        this.$router.push('/admin/distribution/rule/add')
      } else {
        localStorage.setItem('MANAGER_STORE', JSON.stringify(item))
        this.$router.push({path: '/admin/distribution/rule/edit', query: {id: item.ruleId}})
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
      this.$http.post('@ROOT_API/rule/deleteRule', {
        ruleId: this.deleteData.ruleId
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
        // this.tableData.map((item, index) => {
        //   if (this.deleteData.ruleId === item.ruleId) {
        //     this.tableData.splice(index, 1)
        //     return
        //   }
        // })
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