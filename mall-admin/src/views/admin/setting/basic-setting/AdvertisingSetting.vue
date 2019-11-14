<template>
  <div class="advertising-setting-wrap">
    <div class="content-wrap">
      <!-- 搜索 -->
      <!-- <div class="search-module clear-float">
        <div class="function-button-wrap">
          <el-button class="function-button" @click="addAdvertising">添加广告位</el-button>
        </div>
      </div> -->
      <!-- 表格 -->
      <div class="table-module">
        <el-table :data="tableData">
          <el-table-column prop="advertName" label="广告位名称"></el-table-column>
          <el-table-column label="广告位图片">
            <template slot-scope="scope">
              <span>图片</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editAdvertising">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        tableData: []
      }
    },
    methods: {
      getAdvertPosition: function () {
        // 获取广告位
        this.$http.post('/admin/advert/getAdvertPosition', this.qs.stringify({
          advertPositionId: 1
        }))
        .then(res => {
          if (res.data.res === 1) {
            this.tableData.push(res.data.obj)
          }
        })
      },
      editAdvertising: function () {
        // 编辑广告位
        this.$router.push('/admin/setting/basic-setting/edit-advertising')
      }
    },
    mounted: function () {
      this.getAdvertPosition()
    }
  }
</script>

<style lang="less" scoped>
  .advertising-setting-wrap {
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
  .advertising-setting-wrap {
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
