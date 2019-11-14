<!-- 专区分佣管理-拼团奖励 -->
<template>
  <common-tpl class="finance-group-award-wrap" :footer="false">

    <!-- 表单 -->
    <template slot="main">
      <div class="table-wrap">
        <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
          <el-table-column prop="levelName" label="级别名称">
            <template slot-scope="scope">{{scope.row.rankName | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="" label="升级条件">
            <el-table-column prop="" label="完成拼团数">
              <template slot-scope="scope">
                {{scope.row.groupNum | filterEmptyWithZero}}
              </template>
            </el-table-column>
            <el-table-column prop="" label="粉丝数">
              <template slot-scope="scope">
                {{scope.row.fanNum | filterEmptyWithZero}}
              </template>
            </el-table-column>
            <el-table-column prop="" label="代理费">
              <template slot-scope="scope">
                {{scope.row.agentFees | filterMoney}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="" label="拼团奖励">
            <el-table-column prop="" label="拼团权益">
              <template slot-scope="scope">
                {{scope.row.groupProfitRate | filterEmpty('%')}}
              </template>
            </el-table-column>
            <el-table-column prop="" label="团推推">
              <template slot-scope="scope">
                {{scope.row.groupRecommendProfitRate | filterEmpty('%')}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="" label="拼团分红">
            <template slot-scope="scope">
              {{scope.row.groupWeightProfitRate | filterEmpty('%')}}
            </template>
          </el-table-column>
          <el-table-column prop="" label="参与买卖仓次数/每期">
            <template slot-scope="scope">
              {{scope.row.grabNumEachIssue | filterEmptyWithZero}}
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="60">
            <template slot-scope="scope">
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="handleDetails(scope.row)"><i class="icon el-icon-edit"></i> 编辑</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>

          <!-- 暂无数据 -->
          <template slot="empty">
            <no-data></no-data>
          </template>
        </el-table>
      </div>
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
    </template>
  </common-tpl>
</template>

<script>
  export default{
    data () {
      return {
        loading: false,           // 列表loading
        statisticsData: {},       // 统计数据
        formLabelWidth: '120px',
        formData: {},             // 编辑数据
        tableData: [],            // 表格数据
        listDetails: {},          // 列表详情
        pageData: {               // 分页数据
          currentPage: 1,
          pageSize: 10,
          total: 10
        },
        userInfo: {}
      }
    },
    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.getListData()
    },

    methods: {
      /**
       * 得到列表数据
       */
      getListData () {
        this.$http.get('@ROOT_API/buyGroupCommissionSetController/getGroupRankSet', {}).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.tableData = resData.data
        })
      },

      /**
       * 得到列表详情
       */
      handleDetails (row) {
        if (!row) return false
        localStorage.setItem(this.$global.SYSTEM + 'RowDetails', JSON.stringify(row))
        setTimeout(() => {
          this.$router.push({path: '/admin/finance/commission/groupAward/edit', query: {}})
        }, 30)
      },

      /**
       * 分页操作
       */
      pageChange (page) {
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
        if (this.pageData.currentPage === page) {
          this.getListData()
        } else {
          this.pageData.currentPage = page
          this.$router.push({query: {userId: this.userId, page: this.pageData.currentPage}})
        }
      }
    }
  }
</script>
<style lang="less">
  .finance-group-award-wrap{

    /*------------表单-----------*/
    .table-wrap{
      .el-table .cell{
        padding-left: 0 !important;
        text-align: center !important;
        border-left: none !important;
      }
    }

    .edit-popup-wrap{
      overflow: auto;
      .edit-popup-box{
        width: 50%;
        /*padding-left: 10px;*/
        float: left;

        .el-form-item{
          position: relative;
        }

        .el-input{
          width: 80%;
        }

        h2{
          font-size: 14px;
          border-left: 2px solid red;
          padding-left: 10px;
          text-align: left;
          margin-left: 25px;
        }
      }
    }
  }
</style>
