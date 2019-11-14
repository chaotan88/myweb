<!-- 属性分类 -->
<template>
  <common-tpl :footer="false" class="property-classify-wrap">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search :textVisible="false">
        <template slot="edit">
          <el-button @click="addHandle()"><i class="el-icon-plus fw-b"></i> 新增分类</el-button>
        </template>
      </high-search>
    </template>

    <!-- 主体内容 -->
    <template slot="main">

      <div class="pos-r common-table-wrap">
        <!-- 分类菜单 -->
        <div class="pos-a classify-tree-wrap">
          <div class="pos-a classify-tree-t">分类管理</div>
          <div class="classify-tree-c">
            <v-tree ref="tree" :data="treeData" @node-click="classifyNodeClick"/>
          </div>
        </div>

        <!-- 列表 -->
        <el-table border :data="tableData" style="width: 100%" max-height="580">
          <el-table-column prop="attributeTypeName" label="分类名称"></el-table-column>
          <el-table-column prop="attributeTypeLevel" label="分类层级">
            <template slot-scope="scope">{{scope.row.attributeTypeLevel | filterGoodsTypeLevel}}</template>
          </el-table-column>
          <el-table-column prop="sort" label="上级分类">
            <template slot-scope="scope">
              {{!scope.row.parentId || parseInt(scope.row.parentId) === 0 ? '--' : scope.row.parentName}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="70">
            <template slot-scope="scope">
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="scope.row.attributeTypeLevel === 3">
                    <div @click="relationBeforeHandle(scope.row)" size="small"><i class="icon el-icon-sort"></i>关联商品属性</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="pushLinkHandle('edit', scope.row)" size="small"><i class="icon el-icon-edit"></i>编辑</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="deleteBeforeHandle(scope.row)" size="small"><i class="icon el-icon-delete"></i>删除</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
      </div>
    </template>

    <!-- 其它 -->
    <template slot="other">
      <!-- 新增分类未选择弹窗提示 -->
      <el-dialog
        title="提示"
        :visible.sync="addVisible"
        width="480px">
        <span>{{ tipMessage }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除提示 -->
      <el-dialog
        title="删除分类"
        :visible.sync="deleteVisible"
        width="480px">
        确定是否删除分类？
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteHandle">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 关联商品属性 -->
      <el-dialog :visible.sync="relationVisible" class="classify-associate-box">
        <!-- 添加商品属性 -->
        <div class="table-left fl-l">
          <h3>添加商品属性</h3>
          <el-table ref="multipleTable" max-height="400" :data="listLeftData" @selection-change="selectLeftHandle" tooltip-effect="dark" class="ta-l full-w">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="attributeName" label="属性名称" width="100"></el-table-column>
            <el-table-column prop="remark" label="备注">
              <template slot-scope="scope">{{scope.row.remark ? scope.row.remark : '--'}}</template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <!-- <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total" @current-change="pageChange" v-if="pageData.total">
          </el-pagination> -->
        </div>

        <!-- 添加/移除商品按钮 -->
        <div class="relation-buttom fl-l pos-a">
          <el-button @click="moveToRightHandle" :disabled="!listLeftRes.length"><span class="fl-l d-b">添加<span class="el-icon-arrow-right"></span></span></el-button>
          <el-button @click="moveLeftHandle" :disabled="!listRightRes.length"><span class="el-icon-arrow-left fl-l d-b">移除</span></el-button>
        </div>

        <!-- 已添加商品 -->
        <div class="table-right fl-r">
          <h3>已加入的商品属性</h3>
          <el-table ref="multipleTable" max-height="400" :data="listRightData" tooltip-effect="dark" class="full-w ta-l" @selection-change="selectRightHandle">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="attributeName" label="属性名称" width="100"></el-table-column>
            <el-table-column prop="remark" label="备注">
              <template slot-scope="scope">{{scope.row.remark ? scope.row.remark : '--'}}</template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <!-- <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total" @current-change="pageChange" v-if="pageData.total">
          </el-pagination> -->
        </div>
        <div class="clear"></div>

        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="relationVisible = false">取 消</el-button>
          <el-button type="primary" @click="relationHandle">确 定</el-button>
        </span> -->
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
      treeData: [{
        id: 0,
        title: '我的商品分类',
        expanded: true,
        parentId: 0,
        goodsTypeLevel: '0',
        children: []
      }],
      tableData: [],              // 列表数据
      isClassify: true,           // 是否可以进行分类
      currentClassify: '',        // 当前分类
      currentClassifySave: '',        // 当前分类保存
      addVisible: false,          // 新增弹窗提示
      tipMessage: '请先选择左侧分类架构树再新增商品分类！',        // 新增提示内容
      deleteData: {},             // 删除数据
      deleteVisible: false,       // 删除弹窗
      relationVisible: false,  // 关联窗口显示/隐藏

      ajaxLeftFlag: false,        // 左边加载标识
      listLeftData: [],           // 左边列表数据
      listLeftRes: [],            // 左边选中结果
      leftsearch: '',             // 关联商品库搜索

      ajaxRightFlag: false,       // 右边加载标识
      listRightData: [],          // 右边列表数据
      listRightRes: [],           // 右边选中结果
      rightsearch: '',            // 关联商品搜索

      relationData: {},           // 关联数据

      multipleSelection: [],
      pageData: {               // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  watch: {
    /**
     * 关联商品左边列表数据更新
     */
    ajaxLeftFlag (val) {
      if (val === true && this.listRightData.length) {
        this.filterListData()
        this.ajaxLeftFlag = false
      }
    },

    /**
     * 关联商品右边列表数据更新
     */
    ajaxRightFlag (val) {
      if (val === true && this.listLeftData.length) {
        this.filterListData()
        this.ajaxLeftFlag = false
      }
    }
  },

  mounted () {
    let router = JSON.parse(localStorage.getItem('prevRoute'))
    if (router[0].match('/admin/mall/property/') && !router[0].match('/admin/mall/property/index')) {
      this.currentClassifySave = JSON.parse(localStorage.getItem('currentClassify')) || null
    } else {
      localStorage.getItem('currentClassify') && localStorage.removeItem('currentClassify')
    }
    this.getListData()
  },

  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
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
        let data = []
        // 过滤列表数据
        if (this.currentClassifySave) {
          if (parseInt(this.currentClassifySave.level) === 0) this.treeData[0].selected = true
        } else {
          this.treeData[0].selected = true
          this.tableData = this.$Utils.deepCopy(resData.data)
        }
        resData.data.forEach((level1) => {      // 大类
          if (this.currentClassifySave && this.currentClassifySave.id === level1.id) {
            level1.selected = true
            this.tableData = this.$Utils.deepCopy(level1.attributeTypeChildList)
            this.currentClassify = level1
          }
          level1.title = level1.attributeTypeName
          level1.expanded = true
          if (level1.attributeTypeChildList) {
            level1.children = level1.attributeTypeChildList
            level1.title = level1.attributeTypeName
            level1.attributeTypeChildList.forEach(level2 => {      // 中类
              if (this.currentClassifySave && this.currentClassifySave.id === level2.id) {
                level2.selected = true
                this.tableData = this.$Utils.deepCopy(level2.attributeTypeChildList)
                this.currentClassify = level2
              }
              var level3Arr = []
              level2.expanded = true
              if (level2.attributeTypeChildList) {
                level2.children = level2.attributeTypeChildList
                level2.title = level2.attributeTypeName
                level2.attributeTypeChildList.forEach(level3 => {      // 小类
                  if (this.currentClassifySave && this.currentClassifySave.id === level3.id) {
                    level3.selected = true
                    this.tableData = [level3]
                    this.currentClassify = level3
                  }
                  level3.expanded = false
                  level3.title = level3.attributeTypeName
                  level3Arr.push(level3)
                })
              }
            })
          }
          data.push(level1)
        })
        this.treeData[0].children = data
      })
    },

    /**
     * 过滤列表数据
     */
    filterListData () {
      this.listRightData.forEach((row) => {
        this.listLeftData.forEach((list, index) => {
          if (row.attributeId === list.id) {
            this.listLeftData.splice(index, 1)
          }
        })
      })
    },

    /**
     * 关联商品属性
     */
    relationBeforeHandle (row) {
      this.relationData = row
      this.relationVisible = true
      this.getLeftListData()
      this.getRightListData()
      this.filterListData()

      this.listLeftData = []
      this.listLeftRes = []
      this.listRightData = []
      this.listRightRes = []
    },

    /**
     * 关联属性
     */
    relationHandle () {},

    /**
     * 获取左边数据
     */
    getLeftListData () {
      this.$http.post('@ROOT_API/attribute/getAttributeList', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.listLeftData = []
          return false
        }
        this.listLeftData = resData.data
        this.ajaxLeftFlag = true
      })
    },

    /**
     * 获取右边数据
     */
    getRightListData () {
      this.$http.post('@ROOT_API/attributeType/getAttrTypeRelationAtrribute', {
        attributeTypeId: this.relationData.id
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.listRightData = []
          return false
        }
        this.listRightData = resData.data
        this.ajaxRightFlag = true
      })
    },

    /**
     * 商品分类点击
     */
    classifyNodeClick (node) {
      this.tableData = !node.children || node.children.length === 0 ? [node] : node.children
      this.currentClassify = node
      if (node.expanded) {
        this.isClassify = false
        this.tipMessage = '请先选择左侧分类架构树再新增商品分类！'
      } else {
        this.isClassify = true
        this.tipMessage = '商品小类不支持新增下级分类！'
      }
      localStorage.setItem('currentClassify', JSON.stringify({level: node.attributeTypeLevel, id: node.id, page: 1}))
    },

    /**
     * 跳转链接
     */
    pushLinkHandle (type, obj) {
      let path = type === 'add' ? '/admin/mall/property/classifyAdd' : '/admin/mall/property/classifyEdit'
      let id = type === 'add' ? '' : obj.id
      this.$router.push({
        path,
        query: {
          id,
          attributeTypeLevel: type === 'add' ? parseInt(obj.attributeTypeLevel) + 1 : parseInt(obj.attributeTypeLevel),
          // attributeTypeLevel: obj.attributeTypeLevel ? parseInt(obj.attributeTypeLevel) + 1 : 0,
          parentId: parseInt(obj.attributeTypeLevel) === 0 ? 0 : type === 'add' ? obj.id : obj.parentId
        }
      })
    },

    /**
     * 添加分类
     */
    addHandle () {
      if (this.currentClassify === '') {
        this.addVisible = true
        this.tipMessage = '请先选择左侧分类架构树再新增商品分类！'
      } else if (this.currentClassify.attributeTypeLevel === 3) {
        this.addVisible = true
        this.tipMessage = '商品小类不支持新增下级分类！'
      } else {
        this.pushLinkHandle('add', this.currentClassify)
      }
    },

    /**
     * 删除前操作
     */
    deleteBeforeHandle (row) {
      this.deleteData = row
      this.deleteVisible = true
    },

    /**
     * 删除操作
     */
    deleteHandle (row) {
      this.$http.post('@ROOT_API/attributeType/deleteBuyAttributeType', {
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
        this.tableData.map((item, index) => {
          item.id === this.deleteData.id && this.tableData.splice(index, 1)
        })
      })
    },

    /**
     * 左边选择
     */
    selectLeftHandle (val) {
      this.listLeftRes = val
    },

    /**
     * 移动到右边关联事件
     */
    moveToRightHandle () {
      let attributeTypeAttributeRequestList = []
      this.listLeftRes.forEach((row) => {
        attributeTypeAttributeRequestList.push({
          id: '',
          attributeId: row.id
        })
      })
      this.$http.post('@ROOT_API/attributeType/saveAttrTypeRelationAtrribute', {
        attributeTypeId: this.relationData.id,
        attributeTypeAttributeRequestList
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
        this.listLeftRes.forEach((row) => {
          row.attributeId = row.id
          this.listRightData.push(row)
        })
        this.listLeftRes.forEach((list) => {
          this.listLeftData.forEach((row, index) => {
            if (row.id === list.id) {
              this.listLeftData.splice(index, 1)
            }
          })
        })
        this.listLeftRes = []
      })
    },

    /**
     * 右边选择
     */
    selectRightHandle (val) {
      this.listRightRes = val
    },

    /**
     * 移动到右边选择关联事件
     */
    moveLeftHandle () {
      let attributeTypeAttributeRequestList = []
      this.listRightRes.forEach((row) => {
        attributeTypeAttributeRequestList.push({
          id: row.id,
          attributeId: row.attributeId
        })
      })
      this.$http.post('@ROOT_API/attributeType/deleteAttriTypeRelationAttribute', {
        attributeTypeAttributeRequestList
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
        this.listRightRes.forEach((row) => {
          this.listLeftData.push(row)
        })
        this.listRightRes.forEach((list) => {
          this.listRightData.forEach((row, index) => {
            if (row.id === list.id) {
              this.listRightData.splice(index, 1)
            }
          })
        })
        this.listRightRes = []
      })
      // this.listRightRes.forEach((row) => {
      //   this.listLeftData.push(row)
      // })
      // this.listRightRes.forEach((list) => {
      //   this.listRightData.forEach((row, index) => {
      //     if (row.id === list.id) {
      //       this.listRightData.splice(index, 1)
      //     }
      //   })
      // })
      // this.listRightRes = []
    }
  }
}
</script>

<style lang="less" scoped>
.property-classify-wrap{
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

  .table-left, .table-right{
    width: 340px;

    .el-table{
      border: 1px solid #ebeef5;
    }
  }

  .table-left::before, .table-right::before{
    .el-table{
      background: none !important;
    }
  }

  .classify-associate-box {

    h3 {
      font-size: 18px;
      font-weight: normal;
      text-align: left;
      margin-bottom: 10px;

    }
    .relation-buttom {
      width: 140px;
      top: 50%;
      left: 50%;
      margin-top: -40px;
      margin-left: -90px;
      padding: 0 20px;

      .el-button {
        font-size: 16px;
        padding: 10px 20px;
        margin: 0;
        margin-bottom: 30px;
      }
    }
  }

}
</style>

<style lang="less">
.property-classify-wrap{

  .classify-associate-box {

    .el-dialog__body{
      padding: 30px;
    }

    .el-dialog__header {
      border-bottom: none;
    }
  }

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
