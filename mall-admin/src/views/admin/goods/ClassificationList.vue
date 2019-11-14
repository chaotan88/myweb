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
          <v-tree ref="tree" :data="treeData" @node-click="nodeClick"/>
        </div>
        <div class="table-group">
          <el-table :data="tableData" height="600">
            <el-table-column prop="goodsType" label="分类名称"></el-table-column>
            <el-table-column label="分类层级">
              <template slot-scope="scope">
                <span>{{ scope.row.goodsTypeLevel | typeLevelFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上级分类">
              <template slot-scope="scope">
                <span>{{ scope.row.parentName ? scope.row.parentName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序"></el-table-column>
            <el-table-column label="操作" width="216">
              <template slot-scope="scope">
                <el-button type="text" @click="del(scope.row)">删除</el-button>
                <el-button type="text" @click="editClassification(scope.row)">编辑</el-button>
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
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        tableData: [],
        treeData: [{
          title: '我的商品分类',
          expanded: true,
          goodsTypeLevel: '0',
          children: []
        }],
        dialogVisible: false,
        promptDialogOneVisible: false,
        promptDialogTwoVisible: false,
        currentGoodsTypeLevel: null,
        currentPage: 1
      }
    },
    methods: {
      getGoodsTypeList: function () {
        // 获取树形结构(包括列表页数据)
        this.$http.get('/admin/goodsType/getGoodsTypeList')
        .then((res) => {
          if (res.data.res === 1) {
            var data = []
            res.data.list.forEach(level1 => { // level1 大类
              var object1 = {}
              object1.title = level1.goodsType
              object1.expanded = true
              object1.goodsTypeId = level1.goodsTypeId
              object1.goodsType = level1.goodsType
              object1.goodsTypeLevel = level1.goodsTypeLevel
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
                        title: level3.goodsType,
                        goodsTypeId: level3.goodsTypeId,
                        goodsType: level3.goodsType,
                        goodsTypeLevel: level3.goodsTypeLevel,
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
                    title: level2.goodsType,
                    expanded: true,
                    goodsTypeId: level2.goodsTypeId,
                    goodsType: level2.goodsType,
                    goodsTypeLevel: level2.goodsTypeLevel,
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
        this.currentGoodsTypeLevel = node.goodsTypeLevel
        selectedNode.goodsTypeId = node.goodsTypeId ? node.goodsTypeId : ''
        selectedNode.goodsTypeLevel = node.goodsTypeLevel
        selectedNode.goodsType = node.goodsType ? node.goodsType : ''
        selectedNode.parentId = node.parentId ? node.parentId : ''
        selectedNode.parentName = node.parentName ? node.parentName : ''
        localStorage.setItem(this.$global.SYSTEM + 'SelectedNode', JSON.stringify(selectedNode))
        // 2、把节点数据显示到右侧分类列表
        if (node.goodsTypeLevel !== '3') {
          if (node.goodsTypeLevel === '0') {
            parentId = 0
          } else {
            parentId = node.goodsTypeId
          }
          this.$http.post('/admin/goodsType/getGoodsTypeByParentId', this.qs.stringify({
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
        if (this.currentGoodsTypeLevel === null) {
          // 未选中树节点
          this.promptDialogOneVisible = true
        } else if (this.currentGoodsTypeLevel === '3') {
          // 选中小类节点
          this.promptDialogTwoVisible = true
        } else {
          // 选中其它节点
          this.$router.push('/admin/goods/classification/add-classification')
        }
      },
      del: function (item) {
        // 删除
        var classItemOfDel = {}  // 待删除的分类项
        classItemOfDel.goodsTypeLevel = item.goodsTypeLevel
        classItemOfDel.goodsTypeId = item.goodsTypeId
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
        this.$http.post('/admin/goodsType/delGoodsType', this.qs.stringify({
          goodsTypeLevel: classItemOfDel.goodsTypeLevel,
          goodsTypeId: classItemOfDel.goodsTypeId
        })).then((res) => {
          if (res.data.res === 1) {
            this.getGoodsTypeList() // 重新获取左侧分类列表
            this.tableData = []     // 把右侧表格列表清空
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
        classItemOfEdit.goodsTypeId = item.goodsTypeId
        classItemOfEdit.goodsType = item.goodsType
        classItemOfEdit.goodsTypeLevel = item.goodsTypeLevel
        classItemOfEdit.parentId = item.parentId
        classItemOfEdit.parentName = item.parentName
        classItemOfEdit.grandParentId = item.grandParentId
        classItemOfEdit.grandParentName = item.grandParentName
        classItemOfEdit.logo = item.logo
        classItemOfEdit.sort = item.sort
        localStorage.setItem(this.$global.SYSTEM + 'ClassItemOfEdit', JSON.stringify(classItemOfEdit))
        this.$router.push('/admin/goods/classification/edit-classification')
      }
    },
    mounted: function () {
      this.getGoodsTypeList()
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
      margin-top: 30px;
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
        text-align: right;
      }
    }
  }
</style>
