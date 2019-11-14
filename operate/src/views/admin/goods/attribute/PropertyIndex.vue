<!-- 商品参数 -->
<template>
  <common-tpl class="property-index-wrap">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search :textVisible="false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入参数名称" v-model.trim="formData.attributeName" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div slot="edit">
          <template>
            <el-button @click="handleAddBefore"><i class="el-icon-plus fw-b"></i> 新增参数</el-button>
          </template>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <div style="min-height: 400px; max-height: 525px; padding-left: 260px; padding-bottom: 60px; overflow: hidden;" class="pos-r full-h">
        <!-- 商品分类 -->
        <div class="pos-a" style="width: 240px; height: 100%; max-height: 525px; left: 0; top: 0;">
          <goods-attribute :defaultId="formData.classifyId" @change="goodsAttributeChange"></goods-attribute>
        </div>

        <el-table border :data="tableData" class="full-w" max-height="525" v-loading="paramsLoading" element-loading-text="加载中">
          <el-table-column prop="attributeName" label="参数名称" width="200px">
            <template slot-scope="scope">{{scope.row.attributeName | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="attributeType" label="参数类型" width="200px">
            <template slot-scope="scope">{{scope.row.attributeType | filterAttributeType}}</template>
          </el-table-column>
          <el-table-column prop="attributeValList" label="参数值名称">
            <template slot-scope="scope">
              <template v-if="scope.row.attributeType === 2">--</template>
              <div class="truncate" v-else>
                <template v-for="(item, index) in scope.row.attributeValList">{{index !== 0 ? ',' : ''}} {{item.attributeVal}}</template>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注">
            <template slot-scope="scope">{{scope.row.remark | filterEmpty}}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="70">
            <template slot-scope="scope">
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div type="text" @click="$router.push({path: '/admin/goods/property/edit', query: {id: scope.row.id, levelId: formData.classifyId, level: formData.classifyLevel}})"><i class="icon el-icon-edit"></i>编辑</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="deleteBeforeHandle(scope.row)"><i class="icon el-icon-delete"></i>删除</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>

          <!-- 暂无数据 -->
          <template slot="empty">
            <no-data></no-data>
          </template>
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
      </div>
    </template>

    <template slot="other">
      <!-- 删除参数 -->
      <el-dialog
        title="删除参数"
        :visible.sync="deleteVisible"
        width="480px">
        是否删除参数？
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" :loading="deleteLoading" @click="deleteHandle()">确 定</el-button>
        </span>
      </el-dialog>
    </template>

  </common-tpl>
</template>

<script>
import GoodsAttribute from '@/components/public/GoodsAttribute'
export default {
  components: { GoodsAttribute },

  data () {
    return {
      deleteLoading: false, // 删除loading
      paramsLoading: false, // 参数loading
      tableData: [],        // 列表数据
      formData: {
        attributeName: '',  // 参数类型
        classifyName: '',   // 分类名称
        classifyId: 0,      // 选中分类Id
        classifyLevel: 0    // 选中分类等级
      },
      deleteData: {},       // 删除对象
      deleteVisible: false, // 删除弹窗
      pageData: {           // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData(['/admin/goods/property/index', '/admin/goods/property/add', '/admin/goods/property/edit'], (res) => {
      this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
  },
  methods: {
    /**
     * 获取小类参数
     */
    getListData () {
      this.paramsLoading = true
      this.$http.post('@ROOT_API/attribute/getAttributeListPage', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        attributeTypeId: this.formData.classifyId,
        attributeName: this.formData.attributeName
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
        let results = resData.data
        this.tableData = results.list
        this.pageData.total = results.total
        console.log('this.pageData.total: ', this.pageData.total)
      }).finally(() => {
        this.paramsLoading = false
      })
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      this.pageData.currentPage = page
      this.$router.push({query: {page: this.pageData.currentPage}})
      this.getListData()
    },

    /**
     * 新增参数
     */
    handleAddBefore () {
      if (!this.formData.classifyLevel || parseInt(this.formData.classifyLevel) !== 3) {
        this.$message({
          message: '请选择三级分类',
          duration: 2000,
          type: 'error'
        })
        return false
      }
      this.$router.push({path: '/admin/goods/property/add', query: {levelId: this.formData.classifyId, level: this.formData.classifyLevel}})
    },

    /**
     * 分类选择
     */
    goodsAttributeChange (results, currentData) {
      this.formData.classifyLevel = currentData.attributeTypeLevel || 0
      Object.assign(this.formData, results)
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      // 获取参数值
      if (parseInt(this.formData.classifyLevel) === 3) this.getListData()
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageData.currentPage = 1
      this.pageChange(1)
    },

    /**
     * 删除前操作
     */
    deleteBeforeHandle (row) {
      this.deleteData = row
      this.deleteVisible = true
    },

    /**
     * 删除参数
     */
    deleteHandle () {
      this.deleteLoading = true
      this.$http.post('@ROOT_API/attribute/deleteAttributeById', {
        id: this.deleteData.id
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
        this.$message({
          message: resData.msg,
          type: 'success',
          duration: 1000
        })
        this.tableData.map((item, index) => {
          item.id === this.deleteData.id && this.tableData.splice(index, 1)
        })
        this.deleteVisible = false
      }).finally(() => {
        this.deleteLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.property-index-wrap{

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

  .admin-common-main{
    padding-top: 20px;
  }
}
</style>
