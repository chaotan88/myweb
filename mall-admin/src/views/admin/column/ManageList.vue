<!-- 栏目管理 -->
<template>
  <common-tpl :footer="false" class="manage-wrap column-wrap">

    <!-- 头部 -->
    <template slot="header">
      <high-search :textVisible="false">
        <template slot="edit">
          <el-button @click = "$router.push({path:'/admin/column/manage/add'})"><i class="el-icon-plus fw-b"></i> 添加栏目</el-button>
        </template>
      </high-search>
    </template>

    <template slot="main">
      <!-- 列表 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中"> 
        <el-table-column prop="columnType" label="栏目类型">
          <template slot-scope="scope">{{scope.row.columnType | filterColumnType}}</template>
        </el-table-column>
        <el-table-column prop="columnName" label="栏目名称"></el-table-column>
        <el-table-column prop="" label="是否套餐专区">
          <template slot-scope="scope">
            {{scope.row.ifSetmeat | filterIfSetmeat}}
          </template>
        </el-table-column>
        <el-table-column prop="isRecommendIndex" label="商品是否推荐首页">
          <template slot-scope="scope">
            {{scope.row.isRecommendIndex | filterRecommendIndexStatus}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="province" label="首页显示商品数"></el-table-column> -->
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="parseInt(scope.row.columnType) === 1">
                    <div @click="relationBeforeHandle(scope.row)"><i class="icon el-icon-sort"></i>关联商品</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="$router.push({path: '/admin/column/manage/edit', query: {id: scope.row.id}})"><i class="icon el-icon-edit"></i>编辑</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="deleteBeforeHandle(scope.row)"><i class="icon el-icon-delete"></i>删除</div>
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
      <!-- 删除弹窗 -->
      <el-dialog title="删除栏目" :visible.sync="deleteVisible" width="30%">
        <span>确定是否删除栏目（栏目下商品不会删除）？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteHandle">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 关联弹窗 -->
      <el-dialog title="关联商品" :visible.sync="relationVisible" width="1100px" class="dialog-relation">
        <div class="relation pos-r">
          <!-- 关联商品组件 -->
          <relation-public :relationKey="relationKey" :columnId="relationData.id" @change="relationChange"></relation-public>
        </div>
        <div class="button-wrap ta-c">
          <el-button @click="relationVisible = false">取消</el-button>
          <el-button type="primary" :loading="saveLoading" @click="saveHandle">{{saveLoading ? '关联中..' : '确定'}}</el-button>
        </div>
      </el-dialog>
    </template>

  </common-tpl>
</template>

<script>
// import RelationPublic from './RelationPublic'
import RelationPublic from '../setmeal/RelationPublic'
export default {
  components: {RelationPublic},
  data () {
    return {
      loading: false,           // loading
      tableData: [],            // 列表数据
      deleteVisible: false,     // 删除弹窗
      pageData: {               // 主体列表分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      relationVisible: false,   // 关联弹窗
      relationKey: '',          // 关联商品唯一key
      relationData: {},         // 关联商品信息
      relationListData: [],     // 接收关联数据
      saveLoading: false        // 保存时loading显示
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
      this.loading = true
      this.$http.post('@ROOT_API/column/list', {
        start: this.pageData.currentPage,
        pageSize: 10
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
        this.tableData = resData.data.list
        this.pageData.total = resData.data.total
      }).finally(() => {
        this.loading = false
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

    /**
     * 删除操作
     */
    deleteBeforeHandle (row) {
      this.deleteData = row
      this.deleteVisible = true
    },

    /**
     * 删除操作
     */
    deleteHandle () {
      this.$http.get('@ROOT_API/column/delete', {
        params: {
          id: this.deleteData.id
        }
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
      })
    },

    /**
     * 关联商品前操作
     */
    relationBeforeHandle (row) {
      this.relationKey = new Date().getTime()
      row.id = row.id.toString()
      this.relationData = row
      this.relationVisible = true
    },

    /**
     * 接收关联数据
     */
    relationChange (results) {
      this.relationListData = results
    },

    /**
     * 保存
     */
    saveHandle () {
      this.saveLoading = true
      let goodIds = []
      this.relationListData.forEach((row) => {
        goodIds.push(row.id)
      })
      this.$http.post('@ROOT_API/column/relateGoods', {
        id: this.relationData.id,
        goodIds
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
        this.relationVisible = false
        this.saveLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.column-wrap{

  /*-----------表单-------------*/
  .el-table{
    text-align: left;
    border: 1px solid #ebeef5;
    border-bottom: none;
  }

  /*-----------删除弹窗----------*/
  .el-dialog{
    .el-dialog__footer{
      padding-bottom: 0;
      border-top: 1px solid #ebeef5;
    }
  }
  
  /*------按钮-----------*/
  .button-wrap{
    .el-button{
      margin: 0 20px;
    }
  }
}
</style>
