<template>
  <div class="column-list-wrap">
    <div class="content-wrap">
      <!-- 搜索 -->
      <div class="search-module clear-float">
        <div class="function-button-wrap">
          <el-button class="function-button" @click="addColumn">添加栏目</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-module">
        <el-table :data="tableData">
          <el-table-column prop="columnName" label="栏目名称"></el-table-column>
          <!-- <el-table-column label="栏目开始时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | dateFrm }}</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="栏目结束时间">
            <template slot-scope="scope">
              <span>{{ scope.row.updateTime | dateFrm }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="是否推荐首页">
            <template slot-scope="scope">
              <span>{{ scope.row.isRecommendIndex | recommendIndexFilter }}</span>
              <el-switch
                @change="changeIsRecommendIndex(scope.row.columnId, scope.row.isRecommendIndex)"
                v-model="scope.row.isRecommendIndex === '1' ? true : false">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteColumn(scope.row.columnId)">删除</el-button>
              <el-button type="text" @click="editColumn(scope.row.columnId)">编辑</el-button>
              <el-button type="text" @click="relateGoods(scope.row.columnId)">关联商品</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      title="删除栏目"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定是否删除栏目（商品不会删除）？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关联商品弹窗 -->
    <el-dialog
      :visible.sync="relateGoodsDialogVisible"
      width="52%">
      <div class="table-group-wrap clear-float">
        <div class="table-group">
          <div class="table-search-wrap clear-float">
            <span class="table-title">未添加</span>
            <el-input v-model="goodsNameLeft" placeholder="商品编号/商品名称" clearable @clear="getColumnGoodsPageLeft">
              <el-button slot="append" icon="el-icon-search" @click="getColumnGoodsPageLeft"></el-button>
            </el-input>
          </div>
          <div class="table-wrap">
            <el-table :data="tableDataLeft" height="300" @select="selectLeftGoods" @select-all="selectLeftGoods">
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop="goodsNo" label="商品编码"></el-table-column>
              <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            </el-table>
            <el-pagination
              small
              layout="prev, pager, next"
              :page-size="pageSize"
              :total="totalDataLeft"
              @current-change="leftCurrentPageChange">
            </el-pagination>
          </div>
        </div>
        <div class="transfer">
          <i class="el-icon-back" title="添加" @click="add"></i>
          <i class="el-icon-back" title="移除" @click="remove"></i>
        </div>
        <div class="table-group">
          <div class="table-search-wrap clear-float">
            <span class="table-title">已添加</span>
            <el-input v-model="goodsNameRight" placeholder="商品编号/商品名称" disabled>
              <el-button slot="append" icon="el-icon-search" disabled></el-button>
            </el-input>
          </div>
          <div class="table-wrap">
            <el-table :data="tableDataRight" height="300" @select="selectRightGoods" @select-all="selectRightGoods">
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop="goodsNo" label="商品编码"></el-table-column>
              <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            </el-table>
            <el-pagination
              small
              layout="prev, pager, next"
              :page-size="pageSize"
              :total="totalDataRight"
              @current-change="rightCurrentPageChange">
            </el-pagination>
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
    data () {
      return {
        columnId: '',
        tableData: [],    // 栏目列表
        tableDataLeft: [],  // 左边栏商品数据
        tableDataRight: [], // 右边栏商品数据
        tableDataRightCopy: [], // 右边栏商品数据
        goodsNameLeft: '',
        goodsNameRight: '',
        selectedRowLeft: [],  // 左边栏选中的数据
        selectedRowRight: [], // 右边栏选中的数据
        selectedRowCopy: [],  // 拷贝的数组
        dialogVisible: false,
        relateGoodsDialogVisible: false,
        pageNoLeft: 1,
        totalDataLeft: 0,
        pageNoRight: 1,
        totalDataRight: 0,
        pageSize: 5
      }
    },

    mounted () {
      this.getColumnPage()
    },

    methods: {
      getColumnPage () {
        // 获取栏目列表
        this.$http.post('/admin/column/getColumnPage', this.qs.stringify({
          pageSize: 1000
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.tableData = res.data.obj.dataList // res.data.obj.dataList => 栏目列表
          } else if (res.data.res === 0) {
            this.tableData = []
          }
        })
      },

      getColumnGoodsPageLeft () {
        // 关联商品左边栏查询
        this.$http.post('/admin/column/getColumnGoodsPageLeft', this.qs.stringify({
          goodsName: this.goodsNameLeft,
          columnId: this.columnId,
          pageNo: this.pageNoLeft,
          pageSize: this.pageSize
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.tableDataLeft = res.data.obj.dataList  // res.data.obj.dataList => 左边栏
            this.totalDataLeft = res.data.obj.total
          } else if (res.data.res === 0) {
            this.tableDataLeft = []
            this.totalDataLeft = 0
          }
        })
      },

      leftCurrentPageChange (currentPage) {
        // 左侧页码改变
        this.pageNoLeft = currentPage
        this.getColumnGoodsPageLeft()
      },

      getColumnGoodsPageRight () {
        // 关联商品右边栏查询
        this.$http.post('/admin/column/getColumnGoodsPageRight', this.qs.stringify({
          columnId: this.columnId,
          pageNo: this.pageNoRight,
          pageSize: this.pageSize
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.tableDataRight = res.data.obj.dataList // 右边栏
            this.tableDataRightCopy = res.data.obj.dataList.concat()
            this.totalDataRight = res.data.obj.total
            // if (res.data.obj.dataList) {
            //   this.tableDataRight = res.data.obj.dataList // 右边栏
            //   this.tableDataRightCopy = res.data.obj.dataList.concat()
            // } else if (res.data.res === 0) {
            //   this.tableDataLeft = []
            // }
          } else if (res.data.res === 0) {
            this.tableDataRight = []
            this.totalDataRight = 0
          }
        })
      },

      rightCurrentPageChange (currentPage) {
        // 右侧页码改变
        this.pageNoRight = currentPage
        this.getColumnGoodsPageRight()
      },

      selectLeftGoods (selection, row) {
        // 选择左边栏商品
        // 1、把左边栏选中的项保存起来
        this.selectedRowLeft = selection
        this.selectedRowCopy = []
        this.selectedRowCopy = this.selectedRowLeft.concat()  // 深拷贝数组
      },

      add () {
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

      selectRightGoods (selection, row) {
        // 选择右边栏商品
        this.selectedRowRight = selection
        this.selectedRowCopy = []
        this.selectedRowCopy = this.selectedRowRight.concat()
      },

      remove () {
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

      addColumn () {
        // 添加栏目
        this.$router.push('/admin/column/management/add-column')
      },

      editColumn (columnId) {
        // 编辑栏目
        this.$router.push(`/admin/column/management/edit-column/${columnId}`)
      },

      deleteColumn (columnId) {
        // 删除栏目
        localStorage.setItem(this.$global.SYSTEM + 'ColumnId', columnId)
        this.dialogVisible = true
      },

      cancel () {
        // 删除-取消
        this.dialogVisible = false
        localStorage.removeItem(this.$global.SYSTEM + 'ColumnId')
      },

      confirm () {
        // 删除-确定
        var columnId = localStorage.getItem(this.$global.SYSTEM + 'ColumnId')
        this.$http.post('/admin/column/update', {
          columnId: columnId,
          delState: 1
        }).then((res) => {
          if (res.data.res === 1) {
            this.getColumnPage()  // 重新获取栏目列表
          }
        })
        this.dialogVisible = false
      },

      changeIsRecommendIndex (columnId, isRecommendIndex) {
        // 改变栏目是否推荐到首页
        isRecommendIndex = isRecommendIndex === '1' ? '2' : '1'
        this.$http.post('/admin/column/update', {
          columnId: columnId,
          isRecommendIndex: isRecommendIndex
        })
        .then(res => {
          if (res.data.res === 1) {
            this.getColumnPage()
          }
        })
      },

      relateGoods (columnId) {
        // 关联商品
        this.columnId = columnId
        this.relateGoodsDialogVisible = true
        this.getColumnGoodsPageLeft()
        this.getColumnGoodsPageRight()
      },

      handleTableList () {
        // 处理右边栏列表数据
        var list = []
        this.tableDataRightCopy.forEach(copyItem => {
          var isExist = false
          this.tableDataRight.forEach(item => {
            if (copyItem.goodsId === item.goodsId) {
              isExist = true
            }
          })
          if (!isExist) {
            list.push({
              goodsName: '',
              columnGoodsId: copyItem.columnGoodsId
            })
          }
        })
        this.tableDataRight.forEach(item => {
          item.columnId = this.columnId
          list.push(item)
        })
        return list
      },
      cancelRelate () {
        // 取消关联
        this.relateGoodsDialogVisible = false
      },
      confirmRelate () {
        // 确定关联
        var list = this.handleTableList()
        this.$http.post('/admin/column/addColumnGoods', list)
        .then(res => {
          if (res.data.res === 1) {
            this.$message.success('关联商品成功')
          } else {
            this.$message.error('关联商品失败')
          }
        })
        this.relateGoodsDialogVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .column-list-wrap {
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
      }
    }
    /* 分页器 */
    .pagination-module {
      margin-top: 30px;
      text-align: center;
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
  .column-list-wrap {
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
        // margin-left: 50px;
        .table-group {
          width: 42%;
          border: 1px dashed rgb(218, 218, 218);
          border-radius: 4px;
          background-color: rgb(245, 245, 245);
          float: left;
          height: 100%;
          .table-title {
            margin-left: 20px;
            font-size: 20px;
            position: relative;
            top: 8px;
          }
          .table-search-wrap {
            margin-top: 10px;
            margin-right: 30px;
            .el-input {
              width: 210px;
              float: right;
            }
          }
          .table-wrap {
            margin-top: 10px;
            tbody td {
              padding: 0;
            }
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
