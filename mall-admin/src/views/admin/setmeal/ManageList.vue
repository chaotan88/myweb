<!-- 套餐管理 -->
<template>
  <common-tpl :footer="false" class="classify-index-wrap">
    <!-- 头部 -->
    <template slot="header">
      <high-search :textVisible="false">
        <template slot="edit">
          <el-button @click="addHandle()"><i class="el-icon-plus fw-b"></i> 新增套餐</el-button>
        </template>
      </high-search>
    </template>

    <!-- 主体内容 -->
    <template slot="main">

      <div class="pos-r common-table-wrap">
        <!-- 分类菜单 -->
        <div class="pos-a classify-tree-wrap">
          <div class="pos-a classify-tree-t">套餐分组管理</div>
          <div class="classify-tree-c">
            <v-tree ref="tree" :data="treeData" @node-click="classifyNodeClick"/>
          </div>
        </div>

        <!-- 列表 -->
        <el-table v-loading="loading" element-loading-text="加载中"
          border
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="columnName"
            label="套餐分组名称">
          </el-table-column>
          <el-table-column
            prop="level"
            label="分组层级">
            <template slot-scope="scope">
              {{scope.row.level}}
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsSort"
            label="上级分组">
            <template slot-scope="scope">{{scope.row.parentName | filterEmpty}}</template>
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序">
            <template slot-scope="scope">
              <template v-if="parseInt(scope.row.sort) === 0">0</template>
              <template v-else>{{scope.row.sort | filterEmpty}}</template>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="60" class="edit">
            <template slot-scope="scope">
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="parseInt(scope.row.level) === 2">
                    <div @click="relationBeforeHandle(scope.row)"><i class="icon el-icon-sort"></i>关联商品</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="pushLinkHandle('edit', scope.row)"><i class="icon el-icon-edit"></i>编辑</div>
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

      </div>
    </template>

    <!-- 其它 -->
    <template slot="other">
      <!-- 新增分类未选择 或选择小类 弹窗提示 -->
      <el-dialog
        title="提示"
        :visible.sync="addVisible"
        width="480px">
        <span>{{addTips}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除提示 -->
      <el-dialog
        title="删除栏目"
        :visible.sync="deleteVisible"
        width="480px">
        确定是否删除套餐分组？
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteHandle">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 关联弹窗 -->
      <el-dialog title="关联商品" :visible.sync="relationVisible" width="1200px" class="dialog-relation">
        <div class="relation pos-r">
          <!-- 关联商品组件 -->
          <relation-public :relationKey="relationKey" :columnId="relationData.id" :setmealType="formData.setmealType" @change="relationChange"></relation-public>
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
import RelationPublic from './RelationPublic'
export default {
  components: {RelationPublic},

  data () {
    return {
      loading: false,             // loading
      treeData: [{
        id: 0,
        title: '我的套餐分组',
        expanded: true,
        selected: false,
        parentId: 0,
        goodsTypeLevel: 0,
        children: []
      }],

      formData: {
        setmealType: null         // 套餐类型 [1、固定套餐，2、自选套餐]
      },

      isReset: false,             // 是否重置数据
      tableData: [],              // 列表数据
      tableAllData: [],           // 所有列表数据
      deleteData: '',             // 删除对象
      currentGoodsClassify: '',   // 当前选择商品分类
      mallAdminSetmeal: '',       // 本地存储分类信息
      addTips: '',                // 新增弹窗提示信息
      addVisible: false,          // 新增弹窗

      relationKey: '',            // 关联key
      relationData: {},           // 关联商品信息
      relationVisible: false,     // 关联商品信息
      saveLoading: false,         // 保存时loading显示
      deleteListData: [],         // 接收删除列表数据

      deleteVisible: false,       // 删除弹窗
      pageData: {                 // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.init()
    this.getListData()
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      this.mallAdminSetmeal = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'Setmeal'))
      // 判断是否同一模块，带出历史记录
      let samePage = this.$Utils.filterSamePage(3) || this.$Utils.filterSameModule('/admin/setmeal/manage/list') || this.$Utils.filterSameModule('/admin/setmeal/manage/add') || this.$Utils.filterSameModule('/admin/setmeal/manage/edit')
      if (samePage) {
        this.pageData.currentPage = this.mallAdminSetmeal.page
      } else {
        this.mallAdminSetmeal = {id: 0, page: 1}
        localStorage.setItem(this.$global.SYSTEM + 'Setmeal', JSON.stringify(this.mallAdminSetmeal))
        this.isReset = true
      }
    },

    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/column/getSetMealList', {}).then((res) => {
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

        this.treeData[0].children = this.filterListData(results, 1)

        if (this.isReset === true || !this.mallAdminSetmeal || (this.mallAdminSetmeal && this.mallAdminSetmeal.id === 0)) {     // 默认数据
          this.treeData[0].selected = true
          this.mallAdminSetmeal = {}
          this.mallAdminSetmeal.id = 0
          this.mallAdminSetmeal.page = 1

          this.tableAllData = results

          this.currentGoodsClassify = this.treeData[0]
          this.filterTableData(results)
        } else {
          this.filterTableData()
        }
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 遍历列表过滤数据
     */
    filterListData (lists, level, parentName = '') {
      lists.forEach((row, index) => {
        row.expanded = true   // 是否展开菜单
        row.title = row.columnName
        row.parentName = parentName
        row.level = level
        if (row.columnManageList) row.children = row.columnManageList
        // 移除数据
        if (this.deleteData && this.deleteData.id === row.id) {
          if (parseInt(row.parentId) === 0) {
            this.treeData[0].selected = true
            this.currentGoodsClassify = this.treeData[0]
            this.tableAllData = this.treeData[0].children
          } else if (this.tableAllData.length === 1) {
            lists.selected = true
            this.currentGoodsClassify = level === 1 ? this.treeData[0] : lists
            this.tableAllData = lists
          }
          this.mallAdminSetmeal.id = this.deleteData.parentId
          localStorage.setItem(this.$global.SYSTEM + 'Setmeal', JSON.stringify(this.mallAdminSetmeal))
          lists.splice(index, 1)
          this.handleRemoveData()
        }
        if (this.mallAdminSetmeal && this.mallAdminSetmeal.id === row.id) {
          row.selected = true // 选中当前分类
          this.currentGoodsClassify = row
          this.tableAllData = parseInt(row.level) === 2 || !row.columnManageList.length ? [row] : row.columnManageList
          if (this.tableAllData.length === 1) {
            this.pageData.total = 1
            this.tableData = [row]
          } else {
            this.filterTableData()
          }
        }
        // 如果存在子集列表，递归操作
        if (row.columnManageList && row.columnManageList.length) this.filterListData(row.columnManageList, 2, row.columnName)
      })
      return lists
    },

    /**
     * 移除列表数据
     */
    handleRemoveData () {
      this.tableAllData.forEach((row, index) => {
        if (row.id === this.deleteData.id) this.tableAllData.splice(index, 1)
      })
      this.tableData.forEach((row, index) => {
        if (row.id === this.deleteData.id) this.tableData.splice(index, 1)
      })
      this.deleteData = ''
    },

    /**
     * 列表数据显示过滤
     */
    filterTableData (obj) {
      if (obj) this.tableAllData = obj
      this.pageData.total = this.tableAllData.length
      this.tableData = []
      this.tableAllData.forEach((row, index) => {
        if (index >= (this.mallAdminSetmeal.page - 1) * this.pageData.pageSize && index < this.mallAdminSetmeal.page * this.pageData.pageSize) {
          this.tableData.push(row)
        }
      })
      if (this.tableAllData.length <= this.pageData.currentPage * this.pageData.pageSize && this.pageData.currentPage > 1) {
        this.pageData.currentPage--
        this.mallAdminSetmeal.page--
        localStorage.setItem(this.$global.SYSTEM + 'Setmeal', JSON.stringify(this.mallAdminSetmeal))
      }
    },

    /**
     * 商品分类点击
     */
    classifyNodeClick (node) {
      this.tableAllData = !node.children || node.children.length === 0 ? [node] : node.children
      this.currentGoodsClassify = node
      this.pageData.currentPage = 1
      this.mallAdminSetmeal.page = 1
      localStorage.setItem(this.$global.SYSTEM + 'Setmeal', JSON.stringify({id: node.id, page: 1}))
      this.filterTableData()
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      this.pageData.currentPage = page
      this.mallAdminSetmeal.page = page
      localStorage.setItem(this.$global.SYSTEM + 'Setmeal', JSON.stringify(this.mallAdminSetmeal))
      this.filterTableData()
    },

    /**
     * 跳转链接
     */
    pushLinkHandle (type, obj) {
      console.log('this.currentGoodsClassify: ', obj)
      let path = type === 'add' ? '/admin/setmeal/manage/add' : '/admin/setmeal/manage/edit'
      let id = type === 'add' ? '' : obj.id
      setTimeout(() => {
        this.$router.push({
          path,
          query: {
            id,
            level: obj.level || 0,
            setmealType: obj.setmealType,
            parentId: parseInt(obj.level) === 0 ? 0 : type === 'add' ? obj.id : obj.parentId
          }
        })
      }, 100)
    },

    /**
     * 添加分类
     */
    addHandle () {
      if (!this.currentGoodsClassify) {
        this.addVisible = true
        this.addTips = '请先选择左侧套餐分组架构树再新增！'
      } else if (this.currentGoodsClassify.level === 2) {
        this.addVisible = true
        this.addTips = '二级套餐不支持新增下级！'
      } else {
        this.pushLinkHandle('add', this.currentGoodsClassify)
      }
    },

    /**
     * 关联商品前操作
     */
    relationBeforeHandle (row) {
      this.relationKey = new Date().getTime()
      row.id = row.id.toString()
      this.relationData = row
      this.relationVisible = true
      this.formData.setmealType = row.setmealType
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
      this.filterTableData()
      this.$http.get('@ROOT_API/column/delete', {
        params: {
          id: this.deleteData.id
        }
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
        this.filterListData(this.treeData[0].children, 1)
      })
    },

    /**
     * 接收关联数据
     */
    relationChange (results, deletes) {
      this.relationListData = results
      this.deleteListData = deletes
    },

    /**
     * 保存
     */
    saveHandle () {
      this.saveLoading = true
      let addGoodsColumnPieces = []
      let updateGoodsColumnPieces = []
      let deleteGoodsColumnPieces = []
      this.relationListData.forEach((row) => {
        let json = {
          goodsColumnId: row.goodsColumnId,
          goodsId: row.id,
          goodsNum: row.goodsNum
        }
        if (row.action === 'edit') updateGoodsColumnPieces.push(json)
        if (row.action === 'add') addGoodsColumnPieces.push(json)
      })
      this.deleteListData.forEach((row) => {
        deleteGoodsColumnPieces.push({
          goodsColumnId: row.goodsColumnId,
          goodsId: row.id,
          goodsNum: row.goodsNum
        })
      })
      this.$http.post('@ROOT_API/column/updateSetMeal', {
        id: this.relationData.id,
        operType: 2,
        addGoodsColumnPieces,
        updateGoodsColumnPieces,
        deleteGoodsColumnPieces
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
      }).finally(() => {
        this.saveLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.classify-index-wrap{
  background: #fff;

  .common-table-wrap{
    min-height: 400px;
    padding-left: 260px;

    .classify-tree-wrap, .classify-tree-t, .classify-tree-c{
      box-sizing: border-box;
    }

    .classify-tree-wrap{
      color: #666;
      width: 240px;
      height: 100%;
      padding-top: 48px;
      border: 1px solid #eee;
      left: 0;
      top: 0;
    }

    .classify-tree-t{
      color: #333;
      width: 100%;
      height: 48px;
      line-height: 48px;
      padding-left: 10px;
      background: #eef1f9;
      top: 0;
    }

    .classify-tree-c{
      height: 100%;
      overflow: auto;
      padding-top: 10px;
    }

    .classify-tree-c::-webkit-scrollbar{
      width: 8px;
      background-color: rgba(0, 0, 0, .03);
    }

    .classify-tree-c::-webkit-scrollbar-thumb{
      background: rgba(0, 0, 0, .3);
      border-radius: 10px;
    }
  }

}
</style>

<style lang="less">
.classify-index-wrap{

  .classify-tree-wrap{

    .node-selected{
      color: #fff;
      border: 0;
      padding-left: 5px;
      padding-right: 5px;
      background-color: #56ade8;
    }
  }
}
</style>
