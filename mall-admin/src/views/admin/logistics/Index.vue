<!-- 物理设置-首页 -->
<template>
  <common-tpl class="manage-wrap" :footer="false">

    <!-- 高级搜索组件 -->
    <template slot="header">
      <high-search :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入物流名称" v-model.trim="formData.logisticsName" @keyup.enter.native="searchHandle">
          </el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div slot="edit">
          <el-button plain @click="$router.push('/admin/logistics/seting/add')"><i class="el-icon-plus fw-b"></i> 添加物流</el-button>
        </div>
      </high-search>
    </template>

    <!-- 表格部分 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="logisticsName" label="物流名称"></el-table-column>
        <el-table-column prop="" label="收费类型">
          <template slot-scope="scope">{{scope.row.logisticsType | filterLogisticsType}}</template>
        </el-table-column>
        <el-table-column prop="logisticsCost" label="物流费用(元)"></el-table-column>
        <el-table-column prop="isEnabled" label="状态" fixed="right">
          <template slot-scope="scope">
            {{scope.row.isEnabled ? '开启' : '关闭'}}
            <el-switch
            	v-model="scope.row.isEnabled"
              active-color="#56ade8"
              inactive-color="#ccc"
              @change="handleSwitch(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="editTipsHandle(scope.row)"><i class="icon el-icon-edit"></i>编辑</div>
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
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        @current-change="pageChange"
        v-if="pageData.total">
      </el-pagination>

      <!-- 操作弹窗 -->
      <el-dialog title="提示" :visible.sync="editTipsVisible" width="480px">
        <span>{{editTips}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editTipsVisible = false">取 消</el-button>
          <el-button type="primary" @click="editTipsVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除弹窗 -->
      <el-dialog title="删除物流" :visible.sync="deleteVisible" width="30%">
        <span>{{deleteTips}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDelete">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
import ClassifyData from '@/assets/js/ClassifyData'
// import Function from '@/assets/js/Function'
export default {
  data () {
    return {
      loading: false,           // loading
      deleteTipsVisible: false, // 删除前提示
      deleteVisible: false,     // 删除弹窗
      deleteTips: false,        // 删除提示文案
      deleteItem: {},           // 删除对象
      editTipsVisible: false,   // 编辑弹窗
      editTips: '',             // 操作提示

      // 列表数据
      tableData: [],
      formData: {
        logisticsName: '',        // 物流名称
        status: ''
      },
      pageData: {             // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      shopId: null,         // 物流id
      statusData: {}         // 上下架对象
    }
  },
  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.shopId = this.$route.query.shopId

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/logistics/seting', (res) => {
      this.formData = res
    })

    this.getListData()
    this.multipleMenuData = ClassifyData
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/logistics/list', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        logisticsName: this.formData.logisticsName
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
        this.tableData = resData.data.list
        this.tableData.map(item => {
          item.isEnabled = item.isEnabled === 1 ? !!true : !!false
        })
        this.pageData.total = resData.data.total
      }).finally(() => {
        this.loading = false
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
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 搜索
     */
    handleSwitch (row) {
      this.$http.post('@ROOT_API/logistics/changeStatus', {
        id: row.id,
        isEnabled: row.isEnabled ? 1 : 0
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
      })
    },

    /**
     * 编辑前提示
     */
    editTipsHandle (item) {
      if (item.isEnabled) {
        this.editTips = '先停用再操作编辑'
        this.editTipsVisible = true
      } else {
        this.$router.push({path: '/admin/logistics/seting/edit', query: {id: item.id}})
      }
    },

    /**
     * 删除前提示
     */
    deleteTipsHandle (item) {
      if (item.isEnabled) {
        this.deleteTips = '先停用再操作删除'
      } else {
        this.deleteTips = '确定是否删除物流信息？'
      }
      this.deleteVisible = true
      this.deleteItem = item
    },

    /**
     * 删除操作
     */
    handleDelete () {
      if (this.deleteItem.isEnabled) {
        this.deleteVisible = false
        return
      } else {
        this.$http.post('@ROOT_API/logistics/delete', {
          id: this.deleteItem.id
        }).then(res => {
          let resData = res.data
          if (resData.status !== '1') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1500
          })
          this.deleteVisible = false
          this.getListData()
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.manage-wrap{

  /*--------搜索框样式------*/
	.search{
		width: 15%;
		margin: 0 0 20px 0;
		.el-input{
			border-radius: 30px;

		}
		.el-input__inner{
			border-radius: 30px;
		}

		i{
			right: 10px;
			top: 10px;
		}
	}

  /*--------表单样式--------*/
  .search-form{

    .el-form-item{
      width: 50%;
      float: left;

      .el-input, .el-select, .el-date-editor{
        width: 280px;
      }

      .time-type-wrap{
        width: 100px;
        padding-right: 10px;
        box-sizing: border-box;
        left: -100px;
      }
    }
  }

  /*-----------删除弹窗----------*/

  .el-dialog{
    .el-dialog__footer{
      padding-bottom: 0;
    }
  }
}
</style>

<style lang="less">
.manage-wrap{
  .el-dialog .el-dialog__footer{
    padding: 20px;
    border-top: 1px solid #ebeef5;
  }
}
</style>

