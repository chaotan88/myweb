<!-- 店补结算-列表 -->
<template>
  <common-tpl class="shop-settlement-list-wrap pos-r">
    <!-- 主体 -->
    <template slot="main">
      <el-button class="pos-a settle-btn" @click="totalSettle">结 算</el-button>
      <div class="search-wrap">
        <el-select v-model="formData.memberType" size="medium" placeholder="选择会员类型" @change="selectMember">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常会员" :value="1"></el-option>
          <el-option label="特批会员" :value="2"></el-option>
        </el-select>
        <el-select v-model="formData.curYear" size="medium" class="year-box" placeholder="选择年份" @change="selectYear">
          <template v-for="item in yearArr">
            <el-option :label="item + '年'" :value="item"></el-option>
          </template>
        </el-select>
        <el-radio-group v-model="formData.curMonth" size="medium" @change="selectMonth">
          <template v-for="(item, index) in monthArr">
            <el-radio-button :label="index">{{item}}</el-radio-button>
          </template>
        </el-radio-group>
      </div>
      <el-table border :data="tableData" ref="multipleTable" style="width: 100%" v-loading="loading" element-loading-text="加载中" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          :selectable="selectable"
          :reserve-selection="true"
          :rowKey='1'
          width="55">
        </el-table-column>
        <el-table-column prop="phone" label="会员手机">
          <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="currentIdentity" label="合伙身份">
          <template slot-scope="scope">{{scope.row.disRuleName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="applyTime" label="积分生成时间" width="180">
          <template slot-scope="scope">{{scope.row.addTime | filterDate | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="disStatus" label="结算状态">
          <template slot-scope="scope">{{scope.row.disStatus | filterDisStatus  | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="payAmount" label="结算消费积分（个）">
          <template slot-scope="scope">{{scope.row.profit | filterEmpty}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item v-if="parseInt(scope.row.disStatus) === 3">
                  <div @click="handleExamineBefore(scope.row)"><i class="icon el-icon-edit"></i>审核</div>
                </el-dropdown-item> -->
                <el-dropdown-item v-if="parseInt(scope.row.disStatus) === 1">
                  <div @click="singleSettle(scope.row)"><i class="icon el-icon-view"></i>结算</div>
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
      <!-- 结算弹框 -->
      <el-dialog title="结算确认" :visible.sync="detailsVisible" width="500px" class="settle-box">
        <div class="settle-content">
          <p>将为选中会员分配消费积分</p>
          <p>共计：<span>{{settleNum | filterEmpty}}个</span></p>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="settleConfirm">确认分配</el-button>
          <el-button type="" :loading="confirmLoading" @click="settleCancel">取消</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
  import PaymentExamine from './PaymentExamine'
  export default {
    components: {PaymentExamine},
    data () {
      return {
        confirmLoading: false,    // 确定loading
        monthArr: ['全年', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        yearArr: [],
        loading: false,           // loading
        highSearchClose: true,    // 高级搜索开/关
        // pageType: null,           // 页面类型［null/全部，1／付款审核中，2／已审核］
        // 列表数据
        tableData: [{
          phone: '1361125581',
          disRuleName: '115544'
        }],
        formData: {
          disStatus: 2,           // 类型[1 待结算 2 已结算]
          memberType: '',          // 类型[1 正常会员 2 特批会员]
          curYear: '',
          curMonth: '0',
          curMonthDay: '',        // 当前月天数
          timeStart: '',          // 组合后起始时间
          timeEnd: '',
          selIdArr: []                 // 选中的结算项id
        },
        selArr: [],
        detailsVisible: false,
        singleSelArr: [],                 // 选中的结算项
        settleNum: '',              // 结算数额
        copyCheckForm: {},           // 拷贝数据
        copyFormData: '',
        examineData: {},             // 审核数据
        examineVisible: false,       // 审核弹框
        pageData: {                  // 分页
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        userInfo: {}              // 用户信息
      }
    },
    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      let pathType = this.$route.path.match(/all|await|already/gi)[0]
      switch (pathType) {
        case 'all':
          this.formData.disStatus = ''
          break
        case 'await':
          this.formData.disStatus = 1
          break
        case 'already':
          this.formData.disStatus = 2
          break
      }
      this.copyFormData = this.$Utils.deepCopy(this.formData)

      // 获取tab标签类型
      let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType')
      localStorage.setItem(this.$global.SYSTEM + 'PageType', this.formData.disStatus)

      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData('/admin/sale/balance/', (res) => {
        if (getPagetype !== '' && parseInt(getPagetype) === this.formData.disStatus || getPagetype === this.formData.disStatus) this.formData = res
      })

      this.copyCheckForm = this.$Utils.deepCopy(this.checkForm)

      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.initYearArr()
      this.getCurDate()
      this.getListData()
    },
    methods: {
      /**
       * 获取列表数据
       */
      getListData () {
        this.loading = true
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
        this.$http.post('@ROOT_API/buyShareCommissionSetController/getShareCommissionSet', {
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          disStatus: this.formData.disStatus,
          memberType: this.formData.memberType,           // 否 Sting 会员姓名
          year: this.formData.curMonth ? '' : this.formData.curYear,
          timeStart: this.formData.timeStart,             // 开始时间
          timeEnd: this.formData.timeEnd                  // 结束时间
        }).then((res) => {
          let resData = res.data
          if (resData.status !== '1') {
            if (resData.status !== '9998') {
              this.$message({
                message: resData.msg,
                type: 'error',
                duration: 1500
              })
            }
            this.tableData = []
            this.pageData.total = 0
            return false
          }
          // success...
          // 分页数
          this.pageData.total = resData.data.total
          // 列表数据
          this.tableData = resData.data.list
          console.log(this.formData.selIdArr)
          if (this.formData.selIdArr.length) {
            console.log(this.formData.selIdArr)
            let _this = this
            this.tableData.map(row => {
              if (_this.formData.selIdArr.indexOf(row.id) !== -1) {
                setTimeout(() => {
                  this.$refs.multipleTable.toggleRowSelection(row, true)
                })
              }
            })
          }
        }).finally(() => {
          this.loading = false
        })
      },
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },

      /**
       * 当前行是否可选
       */
      selectable (row, index) {
        return row.disStatus === 1 ? !!true : !!false
      },

      /**
       * 获取当前年和月
       */
      getCurDate () {
        let now = new Date()
        this.formData.curYear = now.getFullYear()
      },

      /**
       * 初始化年
       */
      initYearArr () {
        let year = 2017
        for (let i = 0; i < 15; i++) {
          this.yearArr.push(year++)
        }
      },

      /**
       * 选择会员类型
       */
      selectMember (val) {
        this.getListData()
      },

      /**
       * 选择年
       */
      selectYear () {
        this.formData.curMonth = 0
        this.formData.timeStart = ''
        this.formData.timeEnd = ''
        this.getListData()
      },

      /**
       * 选择月
       */
      selectMonth (val) {
        let day = this.$Utils.getDaysInMonth(this.formData.curYear, val)
        if (parseInt(val) !== 0) {
          this.formData.timeStart = this.formData.curYear + '-' + val + '-' + '01'
          this.formData.timeEnd = this.formData.curYear + '-' + val + '-' + day
        } else {
          this.formData.timeStart = ''
          this.formData.timeEnd = ''
        }
        this.getListData()
      },

      /**
       * 选择结算对象
       */
      handleSelectionChange (val) {
        this.selArr = val
        this.formData.selIdArr = []
        val.map(item => {
          this.formData.selIdArr.push(item.id)
        })
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      },

      /**
       * 多选结算
       */
      totalSettle () {
        this.settleNum = 0
        this.selArr.length && this.selArr.map(item => {
          this.settleNum += item.profit
        })
        this.detailsVisible = true
      },

      /**
       * 单选结算
       */
      singleSettle (val) {
        this.settleNum = val.profit
        this.singleSelArr.push(val)
        this.detailsVisible = true
      },

      /**
       * 结算--取消
       */
      settleCancel () {
        this.singleSelArr = []
        this.detailsVisible = false
      },

      /**
       * 结算--确认
       */
      settleConfirm () {
        this.confirmLoading = true
        this.$http.post('@ROOT_API/profitController/settleShopSunsidy', {
          list: this.singleSelArr.length ? this.singleSelArr : this.selArr
        }).then((res) => {
          let resData = res.data
          if (resData.status !== '1') {
            if (resData.status !== '9998') {
              this.$message({
                message: resData.msg,
                type: 'error',
                duration: 1500
              })
            }
            return false
          }
          // success...
          if (this.singleSelArr.length && this.selArr.length) {
            this.selArr.map((item, index) => {
              if (item.id === this.singleSelArr[0].id) {
                this.selArr.splice(index, 1)
                this.formData.selIdArr.map((row, ind) => {
                  row.id === item.id && this.formData.selIdArr.splice(ind, 1)
                })
              }
            })
          }
          this.getListData()
          this.detailsVisible = false
        }).finally(() => {
          setTimeout(() => {
            this.confirmLoading = false
          }, 1000)
        })
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
          this.$router.push({query: {page: this.pageData.currentPage}})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .shop-settlement-list-wrap{

    .settle-btn {
      top: -34px;
      right: 0;
      width: 102px;
      height: 36px;
      border-radius: 18px;
      border: solid 1px #2eaaf7;
      /*font-family: MicrosoftYaHei;*/
      font-size: 14px;
      color: #2eaaf7;
      cursor: default;
      z-index: 10;
    }

    .search-wrap{
      margin-bottom: 15px;
      .el-select{
        width: 180px;
      }

      .year-box.el-select{
        width: 120px;
      }

      .el-radio-group{
        vertical-align: top;
      }
    }

    .admin-gray-title{
      margin-bottom: 0;
    }

    .search-form{

      .apply-fee, .apply-time{
        .el-input{
          width: 100%;
        }
      }
    }
    .settle-box{
      .settle-content{
        p:first-child{
          margin-top: 10px;
        }
        p{
          margin-bottom: 10px;
        }
        span{
          color: #fcad30;
        }
      }
    }
  }
</style>

<style lang="less">
  .shop-settlement-list-wrap{
    .search-head-wrap{
      .el-input__inner{
        width: 250px;
      }
    }

    .apply-date-wrap{
      .el-col-5{
        width: 130px;
      }

      .el-col-2{
        width: 41px;
      }

      .el-input--prefix{
        .el-input__inner{
          padding-right: 15px;
        }
      }
    }

    .apply-fee-label{
      .el-form-item__content{
        margin-left: 27px !important;
      }
    }
  }
</style>
