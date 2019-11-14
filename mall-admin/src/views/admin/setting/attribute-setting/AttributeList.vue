<template>
  <div class="attribute-list-wrap">
    <div class="content-wrap">
      <!-- 搜索 -->
      <div class="search-module clear-float">
        <div class="function-button-wrap">
          <el-button class="function-button" @click="addAttribute">新增属性</el-button>
        </div>
        <div class="search-wrap">
          <el-input v-model="attributeName" placeholder="属性名称" clearable @clear="getAttributePage">
            <el-button slot="append" icon="el-icon-search" @click="getAttributePage"></el-button>
          </el-input>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-module">
        <el-table :data="tableData">
          <el-table-column label="属性名称">
            <template slot-scope="scope">
              <span>{{ scope.row.attributeName }}<span v-if="scope.row.remarks">({{ scope.row.remarks }})</span></span>
            </template>
          </el-table-column>
          <el-table-column label="属性类型">
            <template slot-scope="scope">
              <span>{{ scope.row.attributeType | attributeTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="scope">
              <span v-if="scope.row.attributeType === '1'">{{ scope.row.attributeValStr }}</span>
              <span v-if="scope.row.attributeType === '2'">--</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="216">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteAttribute(scope.row.attributeId, scope.row.attributeType)">删除</el-button>
              <el-button type="text" @click="editAttribute(scope.row.attributeId)">编辑</el-button>
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
      title="删除分类"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定是否删除属性？</span>
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
        attributeName: '',
        value: '',
        tableData: [],
        value2: true,
        currentPage: 1,
        dialogVisible: false
      }
    },
    methods: {
      getAttributePage: function () {
        // 获取属性列表
        this.$http.post('/admin/attribute/getAttributePage', this.qs.stringify({
          attributeName: this.attributeName,
          pageSize: 1000
        })).then((res) => {
          if (res.data.res === 1) {
            this.tableData = res.data.obj.dataList // 属性列表
          }
        })
      },
      addAttribute: function () {
        // 添加属性
        this.$router.push('/admin/setting/attribute-setting/add-attribute')
      },
      deleteAttribute: function (attributeId, attributeType) {
        // 删除属性
        this.dialogVisible = true
        localStorage.setItem(this.$global.SYSTEM + 'Attribute', JSON.stringify({
          attributeId: attributeId,
          attributeType: attributeType
        }))
      },
      cancel: function () {
        // 删除-取消
        this.dialogVisible = false
        localStorage.removeItem(this.$global.SYSTEM + 'Attribute')
      },
      confirm: function () {
        // 删除-确定
        var attribute = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'Attribute'))
        this.$http.post('/admin/attribute/delAttribute', this.qs.stringify({
          attributeId: attribute.attributeId,
          attributeType: attribute.attributeType
        })).then((res) => {
          if (res.data.res === 1) {
            this.getAttributePage() // 重新获取属性列表
          }
        })
        localStorage.removeItem(this.$global.SYSTEM + 'Attribute')
        this.dialogVisible = false
      },
      editAttribute: function (attributeId) {
        // 编辑属性
        this.$router.push(`/admin/setting/attribute-setting/edit-attribute/${attributeId}`)
      }
    },
    mounted: function () {
      this.getAttributePage()
    }
  }
</script>

<style lang="less" scoped>
  .attribute-list-wrap {
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
  .attribute-list-wrap {
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
                padding: 5px 0;
                // height: 60px;
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
