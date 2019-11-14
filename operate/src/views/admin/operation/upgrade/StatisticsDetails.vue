<!-- 超级拼图-拼团统计详情 -->
<template>
  <common-tpl class="hang-sale-detail-wrap" footer>

    <template slot="main">
      <div class="total-data">
        <div>
          <div>{{totalData.totalNum | filterEmpty}}</div>
          <div>发团总数</div>
        </div>
        <div>
          <div>{{totalData.processingNum | filterEmpty}}</div>
          <div>进行中</div>
        </div>
        <div class="line"></div>
        <div>
          <div>{{totalData.successNum | filterEmpty}}</div>
          <div>已拼成</div>
        </div>
        <div>
          <div>{{totalData.failNum | filterEmpty}}</div>
          <div>拼团失败</div>
        </div>
      </div>
      <template>
        <!-- 高级搜索组件 -->
        <high-search :textVisible = "false">
<!--          <div class="pos-r" slot="search">
            <el-input placeholder="请输入会员手机号" v-model.trim="formData.phone" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>-->
          <template slot="edit">
            <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
          </template>
        </high-search>
      </template>
      <el-table border :data="tableData" class="full-w">
        <el-table-column prop="phone" label="拼团单号" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.groupNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseNum" label="开团的商品名称" min-width="120px">
          <template slot-scope="scope">
            <div>{{formData.goodsName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseCoupon" label="开团人数" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.groupNum | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hangNumWait" label="当前参团人数" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.currentNum | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hangNumHas" label="开团状态" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.groupStatus | filterGroupStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hangAmountWait" label="开团时间" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.createTime | filterDate}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hangAmountHas" label="结束时间" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.endTime | filterDate}}</div>
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
                  <div @click="openMemberInfo(scope.row)" class="orange"><i class="icon el-icon-view"></i>参与会员</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <div slot="empty">
          <no-data></no-data>
        </div>
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
    </template>

    <template slot="other">

      <el-dialog title="参与会员" :visible.sync="memberVisible" max-width="560px" @close="">
        <el-row type="flex" align="middle" justify="space-around" style="width: 50%;margin: -10px 0 20px 0;padding: 10px;background: #99CCFF;border: 1px solid #99CCFF;border-radius: 30px">
          <span>拼团单号：{{rowData.groupNo | filterEmpty}}</span>
          <span>{{rowData.groupStatus | filterGroupStatus}}</span>
        </el-row>
        <el-table border :data="memberData" class="full-w" max-height="525">
          <el-table-column prop="" label="用户姓名" width="120">
            <template slot-scope="scope">
              <div>{{scope.row.cardName | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="用户手机号" min-width="120">
            <template slot-scope="scope">
              <div>{{scope.row.phone | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="用户ID" width="120">
            <template slot-scope="scope">
              <div>{{scope.row.invitationCode | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="与团长关系" min-width="140">
            <template slot-scope="scope">
              <div>{{scope.row.relation | filterRelation}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="参团时间" min-width="140">
            <template slot-scope="scope">
              <div>{{scope.row.createTime | filterDate}}</div>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
        <el-button @click="memberVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button  @click="goBack">返 回</el-button>
    </template>

  </common-tpl>
</template>

<script>
  import pagePaper from '@/mixins/ListPublicPage'
  export default {
    mixins: [pagePaper],
    data () {
      return {
        tableData: [],
        memberData: [],
        loading: false,  // 确定loading
        memberVisible: false,  // 参与会员弹窗
        formData: {
          goodsId: ''
        },
        copyFormData: {},       // 拷贝表单数据
        userInfo: {},           // 用户信息
        totalData: {},          // totalData
        rowData: {}             // 当前行数据
      }
    },

    computed: {

    },

    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData('warehouse/handSale/handSaleDetail', (res) => {
        this.formData = res
      })
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.formData.goodsId = localStorage.getItem(this.$global + 'StatisticsGoodsId')
      this.formData.goodsName = localStorage.getItem(this.$global + 'StatisticsGoodsName')
      this.getDetailsData()
      this.getListData()
    },

    methods: {
      goBack () {
        let url = '/admin/operation/extension/supper/assemble/statistics'
        this.$router.push({path: url, query: {}})
      },
      /**
       * 获取详情数据
       */
      getDetailsData () {
        this.$http.post('@ROOT_API/groupStatisticsController/getGroupStatic', {goodsId: this.formData.goodsId}).then((res) => {
          let results = res.data
          if (parseInt(results.status) !== 1) {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          if (results.data) {
            this.totalData = results.data
          }
        }).finally(() => {
          this.loading = false
        })
      },
      /**
       * 获取列表数据
       */
      getListData (type) {
        let url = ''
        if (!type) {
          url = '@ROOT_API/groupStatisticsController/getGroupList'
        } else {
          url = 'groupStatisticsController/exportGroupList'
        }
        let data = {
          goodsId: this.formData.goodsId,
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
        }
        if (!type) {
          this.loading = true
          this.$http.post(url, data).then((res) => {
            let results = res.data
            if (parseInt(results.status) !== 1) {
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1500
              })
              return false
            }
            let data = results.data
            this.pageData.total = data.total
            this.tableData = data.list
            // if (results.data !== null && results.data !== '') this.totalData = results.data
          }).finally(() => {
            this.loading = false
          })
        } else {
          let filterParams = []
          for (let key in data) {
            filterParams.push(key + '=' + data[key])
          }
          window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&goodsId=' + this.formData.goodsId)
        }
      },

      /**
       * 参与会员
       */
      openMemberInfo (row) {
        this.rowData = row
        this.$http.post('@ROOT_API/groupStatisticsController/getGroupDetailList', {
          groupId: row.groupId,
          headUserId: row.headUserId
        }).then((res) => {
          let results = res.data
          if (parseInt(results.status) !== 1) {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1500
            })
            this.tableData = []
            this.pageData.total = 0
            return false
          }
          this.memberVisible = true
          if (results.data) {
            this.memberData = results.data
          }
        }).finally(() => {
          this.loading = false
        })
        // ...
      }
    }
  }
</script>

<style lang='less' scoped>
  .hang-sale-detail-wrap{
    .total-data{
      display: flex;
      justify-content: space-around;
      padding: 20px 10px;
      background: rgba(153, 204, 255, 0.4);
      line-height: 3;
      margin-bottom: 20px;
      div{
        text-align: center;
      }
      .line{
        border-left: 1px solid #999;
        height: 96px;
        width: 0px;
      }
    }
  }
</style>

<style lang="less">
  .hang-sale-detail-wrap{
    .search-wrap{
      .search-head-wrap{
        padding: 0 0 20px 0!important;
      }
    }
  }
</style>
