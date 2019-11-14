<template>
  <div class="logistics-list-wrap">
    <div class="content-wrap">
      <!-- 搜索 -->
      <div class="search-module clear-float">
        <div class="function-button-wrap">
          <el-button class="function-button" @click="addLogistics">添加物流</el-button>
        </div>
        <div class="search-wrap">
          <el-input v-model="logisticsName" placeholder="请输入物流名称" clearable @clear="getLogisticsPage">
            <el-button slot="append" icon="el-icon-search" @click="getLogisticsPage"></el-button>
          </el-input>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-module">
        <el-table :data="tableData">
          <el-table-column prop="logisticsName" label="物流名称" width="190"></el-table-column>
          <el-table-column prop="logisticsCost" label="物流费用(元)"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span>{{ scope.row.status | logisticsStatusFilter }}</span>
              <!-- <el-switch
                active-color="#13ce66">
              </el-switch> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="216">
            <template slot-scope="scope">
              <el-button type="text" @click="editLogistics(scope.row.logisticsId)">编辑</el-button>
              <el-button type="text" @click="deleteLogistics(scope.row.logisticsId)">删除</el-button>
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
      title="删除物流"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定是否删除物流信息？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        logisticsName: '',
        tableData: [],
        currentPage: 1,
        dialogVisible: false
      }
    },
    methods: {
      getLogisticsPage: function () {
        // 获取物流列表
        this.$http.post('/admin/logistics/getLogisticsPage', this.qs.stringify({
          logisticsName: this.logisticsName
        })).then((res) => {
          if (res.data.res === 1) {
            this.tableData = res.data.obj.dataList
          }
        })
      },
      addLogistics: function () {
        // 添加物流
        this.$router.push('/admin/setting/logistics-setting/add-logistics')
      },
      editLogistics: function (logisticsId) {
        // 编辑物流
        this.$router.push(`/admin/setting/logistics-setting/edit-logistics/${logisticsId}`)
      },
      deleteLogistics: function (logisticsId) {
        // 删除物流
        this.dialogVisible = true
        localStorage.setItem(this.$global.SYSTEM + 'LogisticsId', logisticsId)
      },
      cancel: function () {
        // 删除-取消
        this.dialogVisible = false
        localStorage.removeItem(this.$global.SYSTEM + 'LogisticsId')
      },
      confirm: function () {
        // 删除-确定
        var logisticsId = localStorage.getItem(this.$global.SYSTEM + 'LogisticsId')
        this.$http.post('/admin/logistics/updateOrDeleteLogisticsById', this.qs.stringify({
          logisticsId: logisticsId,
          delState: '1'
        })).then((res) => {
          if (res.data.res === 1) {
            this.getLogisticsPage() // 重新获取物流列表
          }
        })
        localStorage.removeItem(this.$global.SYSTEM + 'LogisticsId')
        this.dialogVisible = false
      }
    },
    mounted: function () {
      this.getLogisticsPage()
    }
  }
</script>

<style lang="less" scoped>
  .logistics-list-wrap {
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
  .logistics-list-wrap {
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
  }
</style>
