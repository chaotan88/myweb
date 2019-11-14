<template>
  <div class="members-list-wrap">
    <div class="content-wrap">
      <!-- 搜索 -->
      <div class="search-module clear-float">
        <div class="function-button-wrap"></div>
        <div class="search-wrap">
          <el-input v-model="phone" placeholder="请输入会员姓名/手机号" clearable @clear="getUserPage">
            <el-button slot="append" icon="el-icon-search" @click="getUserPage"></el-button>
          </el-input>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-module">
        <el-table :data="tableData">
          <el-table-column prop="name" label="会员姓名" width="190"></el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              <span>{{ scope.row.sex | sexFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column label="注册时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | dateFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所在地">
            <template slot-scope="scope">
              <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.county}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="updateTime" label="最后登录时间"></el-table-column> -->
          <el-table-column label="操作" width="216">
            <template slot-scope="scope">
              <el-button type="text" @click="viewMemberDetail(scope.row.userId)">查看</el-button>
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
        :page-size="pageSize"
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
        phone: '',
        tableData: [],
        currentPage: 1, // 当前页码
        pageNo: 1,       // 默认开始页码
        pageSize: 10,    // 默认每页数量
        total: 0       // 分页总数
      }
    },
    methods: {
      getUserPage: function () {
        // 获取会员列表
        this.$http.post('/admin/user/getUserPage', this.qs.stringify({
          phone: this.phone,
          pageSize: this.pageSize,
          pageNo: this.pageNo
        })).then((res) => {
          if (res.data.res === 1) {
            this.tableData = res.data.obj.dataList // res.dsta.obj.dataList => 会员列表
            this.total = res.data.obj.total // 总页数
          } else {
            this.tableData = []
          }
        })
      },
      handleSizeChange: function (val) {
        // pageSize 改变
        this.pageNo = 1 // 初始化页码
        this.pageSize = val // 改变每页数量
        this.getUserPage() // 获取会员列表
      },
      handleCurrentChange: function (val) {
        // currentPage 改变
        this.pageNo = val // 改变当前页码
        this.getUserPage() // 获取会员列表
      },
      viewMemberDetail: function (userId) {
        // 查看会员详情
        this.$router.push(`/admin/members/members-center/member-detail/${userId}`)
      }
    },
    mounted: function () {
      this.getUserPage()
    }
  }
</script>

<style lang="less" scoped>
  .members-list-wrap {
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
  .members-list-wrap {
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
