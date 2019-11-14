<!-- 套餐管理 -->
<template>
  <common-tpl class="operation-setmeal-wrap">
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
          <div class="pos-a classify-tree-t">
            套餐分组管理
            <el-input size="small" class="pos-a" placeholder="搜索套餐" style="width: 115px; right: 10px;" v-model="formData.classifyName" @change="handleSearchTree" clearable prefix-icon="el-icon-search"></el-input>
          </div>
          <div class="classify-tree-c">
            <el-tree
              class="el-tree-wrap"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              :default-expanded-keys="[formData.classifyId]"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="classify-tree"
              v-if="treeData[0].children.length">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="cursor-p" :class="{active: data.id === formData.classifyId}" @click="classifyNodeClick(data)">
                  {{ node.label }} 
                  <template v-if="data.level === 0">({{data.children.length}})</template>
                  <template v-if="data.level === 1">({{data.columnManageList.length}})</template>
                </span>
              </span>
            </el-tree>
          </div>
        </div>

        <!-- 列表 -->
        <el-table v-loading="loading" element-loading-text="加载中"
          border
          :data="tableData"
          style="width: 100%" max-height="525">
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
          <relation-goods :relationKey="relationKey" :relationId="relationData.id" :relationType="2" :setNum="formData.setmealType === 1 ? !!true : !! false" :setmealType="formData.setmealType" @change="relationDataChange"></relation-goods>
          <!-- <relation-public :relationKey="relationKey" :columnId="relationData.id" :setmealType="formData.setmealType" @change="relationDataChange"></relation-public> -->
        </div>
        <!-- <br>
        <br>
        <div class="button-wrap ta-c">
          <el-button @click="relationVisible = false">取消</el-button>
          <el-button type="primary" :loading="saveLoading" @click="saveHandle">{{saveLoading ? '关联中..' : '确定'}}</el-button>
        </div> -->
      </el-dialog>

    </template>
  </common-tpl>
</template>

<script>
import RelationGoods from '@/components/public/RelationGoods'
import RelationPublic from './RelationPublic'
export default {
  components: {RelationPublic, RelationGoods},

  data () {
    return {
      loading: false,             // loading
      treeData: [{
        id: 0,
        label: '我的套餐分组',
        expanded: true,
        selected: false,
        parentId: 0,
        level: 0,
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      formData: {
        classifyId: 0,            // 套餐id
        classifyName: '',         // 套餐名称
        setmealType: null         // 套餐类型 [1、固定套餐，2、自选套餐]
      },

      tableData: [],              // 列表数据
      deleteData: '',             // 删除对象
      currentClassify: '',        // 当前选择商品分类
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
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/operation/setmealManage/list', (res) => {
      this.formData = res
    })
    this.getListData()
  },
  methods: {
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
        if (this.treeData[0].children.length) {
          setTimeout(() => {
            if (this.formData.classifyId === 0) {
              this.currentClassify = this.treeData[0]
              this.tableData = this.treeData[0].children
            }
            this.handleSearchTree()
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 类目名称搜索
     */
    handleSearchTree () {
      this.$refs['classify-tree'].filter(this.formData.classifyName)
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 过滤节点显示
     */
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    /**
     * 遍历列表过滤数据
     */
    filterListData (lists, level, parentName = '') {
      lists.forEach((row, index) => {
        row.label = row.columnName
        row.parentName = parentName
        row.level = level
        if (row.columnManageList) row.children = row.columnManageList
        // 移除数据
        if (this.deleteData && this.deleteData.id === row.id) {
          lists.splice(index, 1)
          this.deleteData = ''
        }
        // 选中当前分类
        if (this.formData.classifyId === row.id) {
          this.currentClassify = row
          this.tableData = parseInt(row.level) === 2 || !row.columnManageList.length ? [row] : row.columnManageList
        }
        // 如果存在子集列表，递归操作
        if (row.columnManageList && row.columnManageList.length) this.filterListData(row.columnManageList, 2, row.columnName)
      })
      return lists
    },

    /**
     * 商品类目点击
     */
    classifyNodeClick (node) {
      this.tableData = !node.children || node.children.length === 0 ? [node] : node.children
      this.currentClassify = node
      this.formData.classifyId = node.id
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 跳转链接
     */
    pushLinkHandle (type, obj) {
      console.log('this.currentClassify: ', obj)
      let path = type === 'add' ? '/admin/operation/setmealManage/add' : '/admin/operation/setmealManage/edit'
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
      if (!this.currentClassify) {
        this.addVisible = true
        this.addTips = '请先选择左侧套餐分组架构树再新增！'
      } else if (this.currentClassify.level === 2) {
        this.addVisible = true
        this.addTips = '二级套餐不支持新增下级！'
      } else {
        this.pushLinkHandle('add', this.currentClassify)
      }
    },

    /**
     * 关联商品前操作
     */
    relationBeforeHandle (row) {
      this.relationKey = new Date().getTime()
      row.id = row.id.toString()
      row.id = parseInt(row.id)
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
        // 是否选中上级
        if (this.deleteData.level === 2 || !this.deleteData.columnManageList || !this.deleteData.columnManageList.length) {
          this.formData.classifyId = this.deleteData.parentId
        }
        let copyData = this.$Utils.deepCopy(this.treeData[0].children)
        this.treeData[0].children = []
        setTimeout(() => {
          this.treeData[0].children = this.filterListData(copyData, 1)
        }, 10)
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      })
    },

    /**
     * 接收关联数据
     */
    relationDataChange (results, deletes) {
      this.relationListData = results
      this.deleteListData = deletes
    },

    /**
     * 保存
     */
    saveHandle () {
      this.saveLoading = true
      let goodsColumnIds = []
      this.relationListData.forEach((row) => {
        goodsColumnIds.push({
          goodsColumnId: row.goodsColumnId,
          goodsId: row.id,
          goodsNum: row.goodsNum
        })
      })
      // let addGoodsColumnPieces = []
      // let updateGoodsColumnPieces = []
      // let deleteGoodsColumnPieces = []
      // this.relationListData.forEach((row) => {
      //   let json = {
      //     goodsColumnId: row.goodsColumnId,
      //     goodsId: row.id,
      //     goodsNum: row.goodsNum
      //   }
      //   if (row.action === 'edit') updateGoodsColumnPieces.push(json)
      //   if (row.action === 'add') addGoodsColumnPieces.push(json)
      // })
      // this.deleteListData.forEach((row) => {
      //   deleteGoodsColumnPieces.push({
      //     goodsColumnId: row.goodsColumnId,
      //     goodsId: row.id,
      //     goodsNum: row.goodsNum
      //   })
      // })
      this.$http.post('@ROOT_API/column/relateGoods', {
        id: this.relationData.id,
        operType: 2,
        goodsColumnIds
        // addGoodsColumnPieces,
        // updateGoodsColumnPieces,
        // deleteGoodsColumnPieces
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

<style lang="less">
.operation-setmeal-wrap{
  background: #fff;

  .common-table-wrap{
    min-height: 525px;
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

  /* -------------------- { 树列表 } -------------------- */
  .el-tree-wrap{
    font-size: 14px;
    .el-tree-node__content{
      cursor: default;
    }

    .custom-tree-node{

      span{
        border: 0;
        padding: 1px 5px;
      }
    }

    .active{
      color: #fff;
      background-color: #56ade8;
      border-radius: 3px;
    }
  }

}
</style>

<style lang="less">
.operation-setmeal-wrap{

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
