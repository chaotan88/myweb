<template>
  <div class="classification-list-wrap">
    <div class="content-wrap">
      <!-- 搜索 -->
      <div class="search-module clear-float">
        <div class="function-button-wrap">
          <el-button class="function-button" @click="addClassification">新增分类</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-module clear-float">
        <div class="table-group">
          <v-tree ref='tree' :data='treeData' @node-click="nodeClick"/>
        </div>
        <div class="table-group">
          <el-table :data="tableData" height="600">
            <el-table-column prop="attributeTypeName" label="分类名称"></el-table-column>
            <el-table-column label="分类层级">
              <template slot-scope="scope">
                <span>{{ scope.row.attributeTypeLevel | typeLevelFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上级分类">
              <template slot-scope="scope">
                <span>{{ scope.row.parentName ? scope.row.parentName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="216">
              <template slot-scope="scope">
                <el-button type="text" @click="del(scope.row)">删除</el-button>
                <el-button type="text" @click="editClassification(scope.row)">编辑</el-button>
                <el-button type="text" v-if="scope.row.attributeTypeLevel === '3'" @click="relateAttribute(scope.row.attributeTypeId)">关联属性</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <!-- <div class="pagination-module">
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div> -->
    <!-- 删除弹窗 -->
    <el-dialog
      title="删除分类"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定是否删除分类？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 提示弹窗1 -->
    <el-dialog
      title="提示"
      :visible.sync="promptDialogOneVisible"
      width="30%">
      <span>请先选择左侧分类架构树再新增商品分类！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptDialogOneVisible = false">取 消</el-button>
        <el-button type="primary" @click="promptDialogOneVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 提示弹窗2 -->
    <el-dialog
      title="提示"
      :visible.sync="promptDialogTwoVisible"
      width="30%">
      <span>商品小类不支持新增下级分类！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptDialogTwoVisible = false">取 消</el-button>
        <el-button type="primary" @click="promptDialogTwoVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关联属性弹窗 -->
    <el-dialog
      :visible.sync="relateGoodsDialogVisible"
      width="52%">
      <div class="table-group-wrap clear-float">
        <div class="table-group">
          <span class="table-title">添加商品属性</span>
          <div class="table-search-wrap clear-float">
            <!-- <el-input v-model="goodsNameLeft" placeholder="商品编号/商品名称"></el-input> -->
          </div>
          <div class="table-wrap">
            <el-table :data="tableDataLeft" height="300" @select="selectLeftGoods" @select-all="selectLeftGoods">
              <el-table-column type="selection"></el-table-column>
              <el-table-column label="分类名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.attributeName }}<span v-if="scope.row.remarks">({{ scope.row.remarks }})</span></span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="goodsName" label="商品名称"></el-table-column> -->
            </el-table>
          </div>
        </div>
        <div class="transfer">
          <i class="el-icon-back" title="添加" @click="add"></i>
          <i class="el-icon-back" title="移除" @click="remove"></i>
        </div>
        <div class="table-group">
          <span class="table-title">已加入的商品属性</span>
          <div class="table-search-wrap clear-float">
            <!-- <el-input v-model="goodsNameRight" placeholder="商品编号/商品名称"></el-input> -->
          </div>
          <div class="table-wrap">
            <el-table :data="tableDataRight" height="300" @select="selectRightGoods" @select-all="selectRightGoods">
              <el-table-column type="selection"></el-table-column>
              <el-table-column label="分类名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.attributeName }}<span v-if="scope.row.remarks">({{ scope.row.remarks }})</span></span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="goodsName" label="商品名称"></el-table-column> -->
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRelate">取 消</el-button>
        <el-button type="primary" @click="confirmRelate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        attributeTypeId: '',
        tableData: [],
        currentPage: 1,
        treeData: [{
          title: '我的商品分类',
          expanded: true,
          attributeTypeLevel: '0',
          children: []
        }],
        dialogVisible: false,
        promptDialogOneVisible: false,
        promptDialogTwoVisible: false,
        currentAttributeTypeLevel: null,
        // ----------------------------------------------- //
        tableDataLeft: [],  // 左边栏属性数据
        tableDataRight: [], // 右边栏属性数据
        tableDataRightCopy: [], // 右边栏商品数据
        goodsNameLeft: '',
        goodsNameRight: '',
        selectedRowLeft: [],  // 左边栏选中的数据
        selectedRowRight: [], // 右边栏选中的数据
        selectedRowCopy: [],  // 拷贝的数组
        relateGoodsDialogVisible: false
      }
    },
    methods: {
      getAttributeTypeList: function () {
        // 获取树形结构(包括列表页数据)
        this.$http.get('/admin/attributeType/getAttributeTypeList')
        .then((res) => {
          if (res.data.res === 1) {
            var data = []
            res.data.list.forEach(level1 => { // level1 大类
              var object1 = {}
              object1.title = level1.attributeTypeName
              object1.expanded = true
              object1.attributeTypeId = level1.attributeTypeId
              object1.attributeTypeName = level1.attributeTypeName
              object1.attributeTypeLevel = level1.attributeTypeLevel
              object1.parentId = level1.parentId
              object1.parentName = level1.parentName
              object1.grandParentId = level1.grandParentId
              object1.grandParentName = level1.grandParentName
              object1.logo = level1.logo
              object1.sort = level1.sort
              if (level1.childList) {
                level1.childList.forEach(level2 => {  // level2 中类
                  var level3Arr = []
                  object1.children = object1.children || []
                  if (level2.childList) {
                    level2.childList.forEach(level3 => {  // level3 小类
                      level3Arr.push({
                        title: level3.attributeTypeName,
                        attributeTypeId: level3.attributeTypeId,
                        attributeTypeName: level3.attributeTypeName,
                        attributeTypeLevel: level3.attributeTypeLevel,
                        parentId: level3.parentId,
                        parentName: level3.parentName,
                        grandParentId: level3.grandParentId,
                        grandParentName: level3.grandParentName,
                        logo: level3.logo,
                        sort: level3.sort
                      })
                    })
                  }
                  object1.children.push({
                    title: level2.attributeTypeName,
                    expanded: true,
                    attributeTypeId: level2.attributeTypeId,
                    attributeTypeName: level2.attributeTypeName,
                    attributeTypeLevel: level2.attributeTypeLevel,
                    parentId: level2.parentId,
                    parentName: level2.parentName,
                    grandParentId: level2.grandParentId,
                    grandParentName: level2.grandParentName,
                    logo: level2.logo,
                    sort: level2.sort,
                    children: level3Arr
                  })
                })
              }
              data.push(object1)
            })
            // console.log(data)
            this.treeData[0].children = data
          } else {
            this.treeData[0].children = []
          }
        })
      },
      nodeClick: function (node) {
        // 单击节点触发的事件
        // 1、把选中的节点保存到localStorage中
        var selectedNode = {}
        var parentId
        this.currentAttributeTypeLevel = node.attributeTypeLevel
        selectedNode.attributeTypeId = node.attributeTypeId ? node.attributeTypeId : ''
        selectedNode.attributeTypeLevel = node.attributeTypeLevel
        selectedNode.attributeTypeName = node.attributeTypeName ? node.attributeTypeName : ''
        selectedNode.parentId = node.parentId ? node.parentId : ''
        selectedNode.parentName = node.parentName ? node.parentName : ''
        localStorage.setItem(this.$global.SYSTEM + 'SelectedNode', JSON.stringify(selectedNode))
        // 2、把节点数据显示到右侧分类列表
        if (node.attributeTypeLevel !== '3') {
          if (node.attributeTypeLevel === '0') {
            parentId = 0
          } else {
            parentId = node.attributeTypeId
          }
          this.$http.post('/admin/attributeType/getAttributeTypeListByParentId', this.qs.stringify({
            parentId: parentId
          })).then((res) => {
            if (res.data.res === 1) {
              this.tableData = res.data.list
            }
          })
        } else {
          var tempArr = []
          tempArr.push(node)
          this.tableData = tempArr
        }
      },
      addClassification: function () {
        // 新增分类
        if (this.currentAttributeTypeLevel === null) {
          // 未选中树节点
          this.promptDialogOneVisible = true
        } else if (this.currentAttributeTypeLevel === '3') {
          // 选中小类节点
          this.promptDialogTwoVisible = true
        } else {
          // 选中其它节点
          this.$router.push('/admin/setting/attribute-setting/add-classification')
        }
      },
      del: function (item) {
        // 删除
        var classItemOfDel = {}  // 待删除的分类项
        classItemOfDel.attributeTypeLevel = item.attributeTypeLevel
        classItemOfDel.attributeTypeId = item.attributeTypeId
        localStorage.setItem(this.$global.SYSTEM + 'ClassItemOfDel', JSON.stringify(classItemOfDel))
        this.dialogVisible = true
      },
      cancel: function () {
        // 取消
        localStorage.removeItem(this.$global.SYSTEM + 'ClassItemOfDel')
        this.dialogVisible = false
      },
      confirm: function () {
        // 确定
        var classItemOfDel = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'ClassItemOfDel'))
        this.$http.post('/admin/attributeType/delAttributeType', this.qs.stringify({
          attributeTypeLevel: classItemOfDel.attributeTypeLevel,
          attributeTypeId: classItemOfDel.attributeTypeId
        })).then((res) => {
          if (res.data.res === 1) {
            this.getAttributeTypeList() // 重新获取左侧分类列表
            this.tableData = []         // 把右侧表格列表清空
          } else if (res.data.res === 99) {
            this.dialogVisible = false
            this.$message.error(res.data.result)
          }
        })
        localStorage.removeItem(this.$global.SYSTEM + 'ClassItemOfDel')
        this.dialogVisible = false
      },
      editClassification: function (item) {
        // 编辑分类
        var classItemOfEdit = {}  // 待编辑的分类项
        classItemOfEdit.attributeTypeId = item.attributeTypeId
        classItemOfEdit.attributeTypeName = item.attributeTypeName
        classItemOfEdit.attributeTypeLevel = item.attributeTypeLevel
        classItemOfEdit.parentId = item.parentId
        classItemOfEdit.parentName = item.parentName
        classItemOfEdit.grandParentId = item.grandParentId
        classItemOfEdit.grandParentName = item.grandParentName
        classItemOfEdit.logo = item.logo
        classItemOfEdit.sort = item.sort
        localStorage.setItem(this.$global.SYSTEM + 'ClassItemOfEdit', JSON.stringify(classItemOfEdit))
        this.$router.push('/admin/setting/attribute-setting/edit-classification')
      },
      // --------------------------------------------------------- //
      getAttributeListLeft: function (attributeTypeId) {
        // 查询左边的商品属性
        this.$http.post('/admin/attributeType/getAttributeListLeft', this.qs.stringify({
          attributeTypeId: attributeTypeId
        })).then((res) => {
          if (res.data.res === 1) {
            this.tableDataLeft = res.data.list  // res.data.list => 左边栏
          } else if (res.data.res === 0) {
            this.tableDataLeft = []
          }
        })
      },
      getAttributeListRight: function (attributeTypeId) {
        // 查询右边的商品属性
        this.$http.post('/admin/attributeType/getAttributeListRight', this.qs.stringify({
          attributeTypeId: attributeTypeId
        })).then((res) => {
          if (res.data.res === 1) {
            this.tableDataRight = res.data.list // res.data.list => 右边栏
            this.tableDataRightCopy = res.data.list.concat()
            // if (res.data.list) {
            //   this.tableDataRight = res.data.list // res.data.list => 右边栏
            //   this.tableDataRightCopy = res.data.list.concat()
            // }
          } else if (res.data.res === 0) {
            this.tableDataRight = []
          }
        })
      },
      relateAttribute: function (attributeTypeId) {
        // 关联属性
        this.attributeTypeId = attributeTypeId
        this.relateGoodsDialogVisible = true
        this.getAttributeListLeft(attributeTypeId)
        this.getAttributeListRight(attributeTypeId)
      },
      selectLeftGoods: function (selection, row) {
        // 选择左边栏属性
        // 1、把左边栏选中的项保存起来
        this.selectedRowLeft = selection
        this.selectedRowCopy = []
        this.selectedRowCopy = this.selectedRowLeft.concat()  // 深拷贝数组
      },
      add: function () {
        // 添加
        // 2、从左边栏数组中删除选中的项
        this.selectedRowLeft.forEach((item) => {
          var index = this.tableDataLeft.indexOf(item)
          if (index !== -1) {
            this.tableDataLeft.splice(index, 1)
          }
        })
        // 3、把选中的项保存到右边栏数组中
        this.selectedRowCopy.forEach((item) => {
          this.tableDataRight.push(item)
        })
      },
      selectRightGoods: function (selection, row) {
        // 选择右边栏属性
        this.selectedRowRight = selection
        this.selectedRowCopy = []
        this.selectedRowCopy = this.selectedRowRight.concat()
      },
      remove: function () {
        // 移除
        this.selectedRowRight.forEach((item) => {
          var index = this.tableDataRight.indexOf(item)
          if (index !== -1) {
            this.tableDataRight.splice(index, 1)
          }
        })
        this.selectedRowCopy.forEach((item) => {
          this.tableDataLeft.push(item)
        })
      },
      handleTableList: function () {
        // 处理右边栏列表数据
        var list = []
        this.tableDataRightCopy.forEach(copyItem => {
          var isExist = false
          this.tableDataRight.forEach(item => {
            if (copyItem.attributeId === item.attributeId) {
              isExist = true
            }
          })
          if (!isExist) {
            list.push({
              attributeName: '',
              attributeTypeAttributeId: copyItem.attributeTypeAttributeId
            })
          }
        })
        this.tableDataRight.forEach(item => {
          item.attributeTypeId = this.attributeTypeId
          list.push(item)
        })
        return list
      },
      cancelRelate: function () {
        // 取消关联
        this.relateGoodsDialogVisible = false
      },
      confirmRelate: function () {
        // 确定关联
        var list = this.handleTableList()
        this.$http.post('/admin/attributeType/addAttributeToType', list)
        .then(res => {
          if (res.data.res === 1) {
            this.$message.success('关联属性成功')
          } else {
            this.$message.error('关联属性失败')
          }
        })
        this.relateGoodsDialogVisible = false
      }
    },
    mounted: function () {
      this.getAttributeTypeList()
    }
  }
</script>

<style lang="less" scopde>
  .classification-list-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
      /* 搜索 */
      .search-module {
        /* 功能按钮 */
        .function-button-wrap {
          float: left;
          .function-button {
            width: 100px;
            height: 36px;
            font-size: 14px;
            color: #33719b;
            border: 1px solid #33719b;
            background-color: #d0dee8;
          }
        }
        /* 搜索框 */
        .search-wrap {
          float: right;
        }
      }
      /* 表格 */
      .table-module {
        margin-top: 20px;
        height: 600px;
        .table-group:first-child {
          width: 25%;
          height: 100%;
          float: left;
          border: 2px dashed rgb(204, 204, 204);
          border-radius: 4px;
          overflow-y: scroll;
          box-sizing: border-box;
        }
        .table-group:last-child {
          width: 72%;
          float: right;
        }
      }
    }
    /* 分页器 */
    .pagination-module {
      margin: 30px 40px 0;
      padding-left: 50%;
    }
    /* 清除浮动类 */
    .clear-float::after {
      content: '';
      display: block;
      clear: both;
    }
  }
</style>

<style lang="less">
  .classification-list-wrap {
    .content-wrap {
      /* 搜索 */
      .search-module {
        /* 功能按钮 */
        .function-button-wrap {
          .el-button {
            padding: 0;
          }
          .el-button + .el-button {
            margin-left: 4px;
          }
        }
        /* 搜索框 */
        .search-wrap {
          .el-select {
            .el-input {
              width: 118px;
            }
          }
          > .el-input {
            width: 240px;
          }
          input {
            height: 36px;
            background-color: #f8f8f8;
            border-color: #c8d0da;
          }
        }
      }
      /* 表格 */
      .table-module {
        .el-table {
          border: 1px solid #eef1f5;
          border-bottom: 0;
          .el-table__header-wrapper, .el-table__body-wrapper {
            table {
              th, td {
                padding: 0;
                height: 60px;
                text-align: center;
                font-size: 14px;
              }
            }
          }
          .el-table__header-wrapper {
            table {
              th {
                background-color: #f8f8f8;
                color: #333;
              }
            }
          }
          .el-table__body-wrapper {
            table {
              td {
                color: #666;
                button {
                  color: #666;
                }
              }
            }
          }
        }
      }
    }
    /* 分页器 */
    .pagination-module {
      .el-pagination {
        padding: 0;
      }
    }
    .el-dialog {
      width: 50%;
      .el-dialog_body {
        padding: 0;
      }
      .table-group-wrap {
        // width: 810px;
        height: 383px;
        // margin-top: 20px;
        // margin-left: 30px;
        .table-group {
          width: 42%;
          border: 1px dashed rgb(218, 218, 218);
          border-radius: 4px;
          background-color: rgb(245, 245, 245);
          float: left;
          .table-title {
            margin-left: 20px;
          }
          .table-search-wrap {
            margin-top: 10px;
            margin-right: 30px;
            .el-input {
              width: 170px;
              float: right;
            }
          }
          .table-wrap {
            margin-top: 10px;
          }
        }
        .transfer {
          float: left;
          width: 15%;
          height: 100%;
          position: relative;
          .el-icon-back {
            font-size: 60px;
            color: rgb(153, 153, 153);
            position: absolute;
            left: 20px;
            cursor: pointer;
          }
          .el-icon-back:first-child {
            transform: rotate(180deg);
            top: 56px;
          }
          .el-icon-back:last-child {
            bottom: 56px;
          }
        }
      }
    }
  }
</style>
