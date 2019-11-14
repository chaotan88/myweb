<!-- 赠送记录 -->
<template>
  <common-tpl class="gift-record-wrap">
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-select v-model="formData.prizeType" placeholder="奖品类型" clearable @change="pageChange(1)">
            <el-option label="全部" value=""></el-option>
            <el-option label="消费积分" :value="1"></el-option>
            <el-option label="通用积分" :value="2"></el-option>
            <el-option label="余额" :value="4"></el-option>
            <el-option label="芯豆" :value="3"></el-option>
            <el-option label="礼品" :value="5"></el-option>
          </el-select>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="exportWinningRecord">导出中奖记录</el-button>
        </template>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main" v-loading="loading">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="用户手机号">
          <template slot-scope="scope">{{scope.row.userPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">{{scope.row.prizeType | filterPrizeType | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="奖品名称">
          <template slot-scope="scope">{{scope.row.prizeName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">{{scope.row.prizeNum | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="中奖时间">
          <template slot-scope="scope">{{scope.row.winTime.substring(0, scope.row.winTime.length -2)| filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="兑奖状态">
          <template slot-scope="scope">{{scope.row.cashStatus | filterCashStatus | filterEmpty}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <template v-if="scope.row.cashStatus === 0">
                  <el-dropdown-item>
                    <div @click="exchangeBefore(scope.row)"><i class="el-icon-view"></i> 兑换</div>
                  </el-dropdown-item>
                </template>
                <el-dropdown-item>
                  <div @click="seeHandle(scope.row)"><i class="el-icon-view"></i> 查看</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <!-- 暂无数据 -->
        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>

      <!-- 分页 -->
      <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total" @current-change="pageChange" v-if="pageData.total">
      </el-pagination>
    </template>

    <template slot="other">
      <!-- 兑换 -->
      <el-dialog
        title="兑换奖品"
        :visible.sync="exchangeVisible"
        width="450px">
        <el-form ref="formData" :model="formData" label-width="100px">
          <span>
            <el-form-item label="奖品类型：">{{exchangeData.prizeType | filterPrizeType | filterEmpty}}</el-form-item>
            <el-form-item label="奖品：">{{exchangeData.prizeName | filterEmpty}}</el-form-item>
            <el-form-item label="是否兑换：">
              <el-radio-group v-model="formData.cashStatus">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="说明：">
              <el-input type="textarea" rows="4" v-model="formData.cashExplain" maxlength="200"></el-input>
            </el-form-item>
          </span>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exchangeVisible = false">取 消</el-button>
          <el-button type="primary" @click="exchangeHandle()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 查看 -->
      <el-dialog
        title="兑换奖品"
        :visible.sync="seeVisible"
        width="20%">
        <span>
          <dl>
            <dt class="pos-a">奖品类型：</dt>
            <dd>{{detailsData.prizeType | filterPrizeType | filterEmpty}}</dd>
          </dl>
          <dl>
            <dt class="pos-a">奖品：</dt>
            <dd>{{detailsData.prizeName | filterEmpty}}</dd>
          </dl>
          <dl>
            <dt class="pos-a">状态：</dt>
            <dd>{{detailsData.cashStatus | filterCashStatus | filterEmpty}}</dd>
          </dl>
          <dl>
            <dt class="pos-a">操作时间：</dt>
            <dd>{{detailsData.cashTime | filterDate | filterEmpty}}</dd>
          </dl>
          <dl>
            <dt class="pos-a">说明：</dt>
            <dd>{{detailsData.cashExplain  | filterEmpty}}</dd>
          </dl>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="seeVisible = false">取 消</el-button>
          <el-button type="primary" @click="seeVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      turnId: '',
      formData: {
        prizeType: '',             // 奖品类型
        cashStatus: 1,            // 是否兑换
        cashExplain: '',          // 说明
        name: '11111',
        awardType: ''
      },
      options: [{
        value: '1',
        label: '消费积分'
      }, {
        value: '2',
        label: '通用积分'
      }, {
        value: '3',
        label: '余额'
      }, {
        value: '4',
        label: '芯豆'
      }, {
        value: '5',
        label: '礼品'
      }],
      exchangeVisible: false,  // 兑换弹窗
      seeVisible: false,       // 查看弹窗
      exchangeData: {},        // 兑换id
      detailsData: {},         // 详情数据id
      tableData: [],
      pageData: {           // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {}                  // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('operation/conversion/turntable/prize', (res) => {
      this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.turnId = this.$route.query.id
    this.getListData()
  },

  methods: {
    /**
     * 列表数据
     */
    getListData () {
      this.loading = true
      this.$http.get('@ROOT_API/turnWin/getTurnWinPage', {
        params: {
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          prizeType: this.formData.prizeType,
          turnId: this.turnId
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.pageData.total = 0
          return false
        }
        this.tableData = resData.data.list
        this.pageData.total = resData.data.total
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 查看详情
     */
    seeHandle (row) {
      this.$http.get('@ROOT_API/turnWin/getCashDetail', {
        params: {
          id: row.id
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
        }
        this.seeVisible = true
        this.detailsData = resData.data
        this.exchangeVisible = false
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 兑换前操作
     */
    exchangeBefore (row) {
      this.exchangeVisible = true
      this.formData.cashStatus = 1
      this.formData.cashExplain = ''
      this.exchangeData = row
    },

    /**
     * 兑换
     */
    exchangeHandle (row) {
      this.loading = true
      this.$http.post('@ROOT_API/turnWin/editCashDetail', {
        id: this.exchangeData.id,
        cashStatus: this.formData.cashStatus,
        cashExplain: this.formData.cashExplain
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
        }
        this.resData = resData.data
        this.exchangeVisible = false
        this.$message({
          message: resData.msg,
          type: 'success',
          duration: 1500
        })
        this.getListData()
      }).finally(() => {
        this.loading = false
      })
      console.log('row: ', row)
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
        this.$router.push({query: {page: this.pageData.currentPage, id: this.turnId}})
      }
    },
    /**
     * 导出中奖记录
     */
    exportWinningRecord () {
      let url = 'turnWin/exportTurnWin'
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + 'turnId=' + this.turnId + '&' + 'prizeType=' + this.formData.prizeType, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.gift-record-wrap {
  /*----------------搜索-----------*/
  .search-wrap {
    .el-form-item {
      .el-radio-group {
        div {
          margin-right: 20px;
        }
      }
    }

    .el-dropdown {
      width: 80px;
      top: 0;
      left: -80px;
    }
  }
}
</style>

<style lang="less">
.gift-record-wrap {

  .region-select-wrap{
    .el-input{
      width: auto !important;
    }
  }


  /*----------------兑换奖品/详情弹窗----------*/
  .el-dialog {
    .el-dialog__body {
      text-align: left;
      padding: 20px 40px 20px 20px;

      .el-form-item{
        margin-bottom: 0;

        .el-form-item__label{
          font-size: 14px;
        }
      }

      dl{
        dt{
          width: 100px;
          text-align: right;
          line-height: 35px;
          font-size: 14px;
        }
        dd{
          margin-left: 100px;
          line-height: 35px;
          font-size: 14px;
        }
      }
    }

    .el-dialog__footer {
      .el-button {
        border-radius: 3px;
        border-color: none;
      }
    }
  }

  .confirm-pay-dialog.max {
    .el-upload--picture-card {
      display: none;
    }
  }
}

.search-wrap .high-search-down .btn-wrap {
  margin-top: 0;
}
</style>
