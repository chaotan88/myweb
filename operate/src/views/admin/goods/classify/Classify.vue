<!-- 商品类目 -->
<template>
  <common-tpl class="classify-index-wrap">
    <!-- 头部 -->
    <template slot="header">
      <high-search :textVisible="false">
        <template slot="edit">
          <el-button @click="addHandle()"><i class="el-icon-plus fw-b"></i> 新增类目</el-button>
        </template>
      </high-search>
    </template>

    <!-- 主体内容 -->
    <template slot="main">

      <div class="pos-r common-table-wrap">
        <!-- 类目菜单 -->
        <div class="pos-a classify-tree-wrap">
          <div class="pos-a classify-tree-t">类目管理</div>
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
            prop="goodsType"
            label="分类名称">
          </el-table-column>
          <el-table-column
            prop="goodsTypeLevel"
            label="分类层级">
            <template slot-scope="scope">
              {{scope.row.goodsTypeLevel | filterGoodsTypeLevel}}
            </template>
          </el-table-column>
          <el-table-column
            prop="sort"
            label="上级分类">
            <template slot-scope="scope">
              {{!scope.row.parentId || parseInt(scope.row.parentId) === 0 ? '--' : scope.row.parentName}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="60" class="edit">
            <template slot-scope="scope">
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
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
      <!-- 新增类目未选择 或选择小类 弹窗提示 -->
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
        title="删除类目"
        :visible.sync="deleteVisible"
        width="480px">
        确定是否删除类目？
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" :loading="deleteLoading" @click="deleteHandle">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
import Vue from 'vue'
import VTree from 'vue-tree-halower'
Vue.use(VTree)
export default {
  data () {
    return {
      loading: false,            // loading
      deleteLoading: false,      // 删除loading
      treeData: [{
        id: 0,
        title: '我的商品类目',
        expanded: true,
        selected: false,
        parentId: 0,
        goodsTypeLevel: 0,
        children: []
      }],

      isReset: false,             // 是否重置数据
      tableData: [],              // 列表数据
      tableAllData: [],           // 所有列表数据
      deleteData: '',             // 删除对象
      currentGoodsClassify: '',   // 当前选择商品类目
      mallAdminGoodsClassify: '', // 本地存储类目信息
      addTips: '',                // 新增弹窗提示信息
      addVisible: false,          // 新增弹窗
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
      this.mallAdminGoodsClassify = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'GoodsClassify'))
      // 判断是否同一模块，带出历史记录
      let samePage = this.$Utils.filterSamePage(3) || this.$Utils.filterSameModule('/admin/goods/classify')
      if (samePage) {
        this.pageData.currentPage = this.mallAdminGoodsClassify.page
      } else {
        this.mallAdminGoodsClassify = {id: 0, page: 1}
        localStorage.setItem(this.$global.SYSTEM + 'GoodsClassify', JSON.stringify(this.mallAdminGoodsClassify))
        this.isReset = true
      }
    },

    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/attributeType/getAttributeTypeList').then((res) => {
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

        this.treeData[0].children = this.filterListData(results)

        if (this.isReset === true || !this.mallAdminGoodsClassify || (this.mallAdminGoodsClassify && this.mallAdminGoodsClassify.id === 0)) {     // 默认数据
          this.treeData[0].selected = true
          this.mallAdminGoodsClassify = {}
          this.mallAdminGoodsClassify.id = 0
          this.mallAdminGoodsClassify.page = 1

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
    filterListData (lists) {
      lists.forEach((row, index) => {
        row.expanded = true   // 是否展开菜单
        row.title = row.goodsType
        row.children = row.attributeTypeChildList
        // 移除数据
        if (this.deleteData && this.deleteData.id === row.id) {
          lists.splice(index, 1)
          this.deleteData = ''
        }
        if (this.mallAdminGoodsClassify && this.mallAdminGoodsClassify.id === row.id) {
          row.selected = true // 选中当前类目
          this.currentGoodsClassify = row
          this.tableAllData = parseInt(row.goodsTypeLevel) === 3 || !row.attributeTypeChildList.length ? [row] : row.attributeTypeChildList
          if (this.tableAllData.length === 1) {
            this.pageData.total = 1
            this.tableData = [row]
          } else {
            this.filterTableData()
          }
        }
        // 如果存在子集列表，递归操作
        if (row.attributeTypeChildList && row.attributeTypeChildList.length) this.filterListData(row.attributeTypeChildList)
      })
      return lists
    },

    /**
     * 列表数据显示过滤
     */
    filterTableData (obj) {
      if (obj) this.tableAllData = obj
      this.pageData.total = this.tableAllData.length
      this.tableData = []
      this.tableAllData.forEach((row, index) => {
        if (index >= (this.mallAdminGoodsClassify.page - 1) * this.pageData.pageSize && index < this.mallAdminGoodsClassify.page * this.pageData.pageSize) {
          this.tableData.push(row)
        }
      })
    },

    /**
     * 商品类目点击
     */
    classifyNodeClick (node) {
      this.tableAllData = !node.children || node.children.length === 0 ? [node] : node.children
      this.currentGoodsClassify = node
      this.pageData.currentPage = 1
      this.mallAdminGoodsClassify.page = 1
      localStorage.setItem(this.$global.SYSTEM + 'GoodsClassify', JSON.stringify({id: node.id, page: 1}))
      this.filterTableData()
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      this.pageData.currentPage = page
      this.mallAdminGoodsClassify.page = page
      localStorage.setItem(this.$global.SYSTEM + 'GoodsClassify', JSON.stringify(this.mallAdminGoodsClassify))
      this.filterTableData()
    },

    /**
     * 跳转链接
     */
    pushLinkHandle (type, obj) {
      let path = type === 'add' ? '/admin/goods/classify/add' : '/admin/goods/classify/edit'
      let id = type === 'add' ? '' : obj.id
      setTimeout(() => {
        this.$router.push({
          path,
          query: {
            id,
            goodsTypeLevel: type === 'add' ? parseInt(obj.goodsTypeLevel) + 1 : parseInt(obj.goodsTypeLevel),
            parentId: parseInt(obj.goodsTypeLevel) === 0 ? 0 : type === 'add' ? obj.id : obj.parentId
          }
        })
      }, 100)
    },

    /**
     * 添加类目
     */
    addHandle () {
      if (!this.currentGoodsClassify) {
        this.addVisible = true
        this.addTips = '请先选择左侧类目架构树再新增商品类目！'
      } else if (this.currentGoodsClassify.goodsTypeLevel === 3) {
        this.addVisible = true
        this.addTips = '商品小类不支持新增下级类目！'
      } else {
        this.pushLinkHandle('add', this.currentGoodsClassify)
      }
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
      this.deleteLoading = true
      this.$http.post('@ROOT_API/goodsType/deleteBuyGoodsType', {
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
        this.tableAllData.forEach((row, index) => {
          if (row.id === this.deleteData.id) this.tableAllData.splice(index, 1)
        })
        this.tableData.forEach((row, index) => {
          if (row.id === this.deleteData.id) this.tableData.splice(index, 1)
        })
        if (this.tableAllData.length <= this.pageData.currentPage * this.pageData.pageSize && this.pageData.currentPage > 1) {
          this.pageData.currentPage--
          this.mallAdminGoodsClassify.page--
        }
        this.mallAdminGoodsClassify.id = this.deleteData.parentId

        this.filterListData(this.treeData[0].children)
        this.filterTableData()
        localStorage.setItem(this.$global.SYSTEM + 'GoodsClassify', JSON.stringify(this.mallAdminGoodsClassify))
      }).finally(() => {
        this.deleteLoading = false
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
