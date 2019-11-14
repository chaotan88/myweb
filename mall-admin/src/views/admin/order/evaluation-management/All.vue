<template>
  <div class="evaluation-management-wrap">
    <div class="content-wrap">
      <!-- 搜索 -->
      <div class="search-module clear-float">
        <div class="search-wrap">
          <div class="search-group">
            <div class="search-left">
              <!-- <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
              <el-date-picker
                v-model="search.startTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <el-date-picker
                v-model="search.endTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="search-right">
              <el-select v-model="search.commentType" placeholder="选择评价类型" clearable>
                <el-option
                  v-for="item in evaluationTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model="search.goodsName" placeholder="商品名称/订单编号/客户手机号" clearable @clear="getCommentPage">
                <el-button slot="append" icon="el-icon-search" @click="getCommentPage"></el-button>
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-module">
        <el-table :data="tableData">
          <el-table-column prop="orderNo" label="订单编号"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column label="买家信息">
            <template slot-scope="scope">
              <span>{{ scope.row.customerName }}</span><br>
              <span>{{ scope.row.customerPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="commentType" label="评价类型">
            <template slot-scope="scope">
              <span>{{ scope.row.commentType | commentTypeFilter }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="评星">
            <template slot-scope="scope">
              <el-rate
                v-model="value5"
                disabled
                text-color="#ff9900">
              </el-rate>
            </template>
          </el-table-column> -->
          <el-table-column prop="commentContent" label="留言"></el-table-column>
          <el-table-column label="是否显示">
            <template slot-scope="scope">
              <span v-if="scope.row.isShow === '1'">是</span>
              <span v-if="scope.row.isShow === '2'">否</span>
              <el-switch
                v-model="scope.row.isShow === '1' ? true : false"
                @change="changeIsShow(scope.row.commentId, scope.row.isShow)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="216">
            <template slot-scope="scope">
              <el-button type="text" @click="viewOrderDetail(scope.row.commentId)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="pagination-module">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        evaluationTypeOptions: [{
          value: '1',
          label: '好评'
        }, {
          value: '2',
          label: '中评'
        }, {
          value: '3',
          label: '差评'
        }],
        search: {
          startTime: '',
          endTime: '',
          commentType: '',
          goodsName: '',
          pageNo: 1,       // 默认开始页码
          pageSize: 10    // 默认每页数量
        },
        tableData: [],
        currentPage: 1, // 当前页码
        total: 0       // 分页总数
      }
    },
    methods: {
      getCommentPage: function () {
        // 获取订单列表
        this.$http.post('/admin/comment/getCommentPage', this.qs.stringify(this.search))
        .then((res) => {
          if (res.data.res === 1) {
            this.tableData = res.data.obj.dataList // res.data.obj.dataList => 订单列表
            this.total = res.data.obj.total // res.data.obj.total => 分页总数
          } else if (res.data.res === 0) {
            this.tableData = []
            this.total = 0
          }
        })
      },
      viewOrderDetail: function (commentId) {
        // 获取订单详情
        this.$router.push(`/admin/order/evaluation-management/order-detail/${commentId}`)
      },
      changeIsShow: function (commentId, isShow) {
        // 改变是否显示
        isShow = isShow === '1' ? '2' : '1'
        this.$http.post('/admin/comment/openComment', this.qs.stringify({
          commentId: commentId,
          isShow: isShow
        })).then(res => {
          if (res.data.res === 1) {
            this.getCommentPage() // 重新获取列表
          }
        })
      },
      handleSizeChange: function (val) {
        // 每页数量改变
        this.search.pageNo = 1 // 初始化页码
        this.search.pageSize = val // 改变每页数量
        this.getCommentPage()
      },
      handleCurrentChange: function (val) {
        // 当前页码改变
        this.search.pageNo = val // 改变当前页码
        this.getCommentPage()
      }
    },
    mounted: function () {
      this.getCommentPage() // 获取订单列表
    }
  }
</script>

<style lang="less" scoped>
  .evaluation-management-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
      /* 搜索 */
      .search-module {
        /* 搜索框 */
        .search-wrap {
          .search-group {
            float: right;
          }
          .search-left {
            float: left;
            margin-right: 60px;
          }
          .search-right {
            float: right;
          }
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
  .evaluation-management-wrap {
    .content-wrap {
      /* 搜索 */
      .search-module {
        /* 搜索框 */
        .search-wrap {
          .el-select {
            .el-input {
              width: 118px;
            }
          }
          input {
            height: 36px;
            background-color: #f8f8f8;
            border-color: #c8d0da;
          }
          .el-date-editor {
            width: 180px;
          }
          .search-group {
            .search-right {
              .el-input {
                width: 200px;
              }
            }
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
