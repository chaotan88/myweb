<!-- 专区分佣-买卖仓分佣-分享收益/团队分佣/全球分红列表 -->
<template>
  <common-tpl class="shop-settlement-list-wrap pos-r">
    <!-- 主体 -->
    <template slot="main">
      <div class="statistics-basic-wrap" slot="header">
        <div class="items">
          <dl class="pos-r">
            <dt class="d-b pos-a">
            </dt>
            <dd>
              <strong class="fw-n d-b">{{statisticalData.orderTotal | filterEmpty}}</strong>
              <p>订单总额</p>
            </dd>
          </dl>
        </div>
        <div class="items">
          <dl class="pos-r">
            <dt class="d-b pos-a dt2"></dt>
            <dd>
              <strong class="fw-n d-b">{{statisticalData.directProfitTotal || statisticalData.commissionTotal || statisticalData.globalWeightTotal | filterEmpty}}</strong>
              <template v-if="formData.disStatus === 1">
                <p>产生分享收益总金额</p>
              </template>
              <template v-if="formData.disStatus === 2">
                <p>产生团队分佣总金额</p>
              </template>
              <template v-if="formData.disStatus === 3">
                <p>全球分红总金额</p>
              </template>
            </dd>
          </dl>
        </div>
        <div class="items">
          <dl class="pos-r">
            <dt class="d-b pos-a dt3"></dt>
            <dd>
              <strong class="fw-n d-b">{{statisticalData.userTotal | filterEmpty}}</strong>
              <p>享受收益总用户数</p>
            </dd>
          </dl>
        </div>
      </div>
      <div style="margin-bottom: 20px" class="switch-wrap">
        <el-radio-group v-model="formData.status" @change="subTypehandle">
          <el-radio-button label="-1">全部</el-radio-button>
          <el-radio-button label="0">待结算</el-radio-button>
          <el-radio-button label="1">已结算</el-radio-button>
          <el-radio-button label="2">已冻结</el-radio-button>
        </el-radio-group>
      </div>
      <div class="search-wrap">
        <div class="d-ib search-cont" style="margin-right: 20px; margin-bottom: 10px;">
          <el-select v-model="formData.memberType" size="medium" placeholder="选择会员类型" @change="selectMember">
            <template v-for="item in subType">
              <el-option :label="item.rankName" :value="item.rank"></el-option>
            </template>
          </el-select>
          <span class="d-ib" style="font-size: 14px; color: #666; margin-left: 10px;">搜索 : </span>
          <div class="d-ib pos-r " style="width: 250px;">
            <el-input placeholder="输入会员姓名/手机号" v-model.trim="formData.phone"></el-input>
            <i class="ta-c pos-a el-icon-search" style="cursor:pointer" title="搜索" @click="searchHandle"></i>
          </div>
        </div>
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
        <el-button class="settle-btn fl-r" style="padding: 10px 20px; border-radius: 30px;" :disabled="!selArr.length" @click="totalSettle(1)">结 算</el-button>
        <el-button class="settle-btn fl-r" style="padding: 10px 20px; margin-right: 5px; border-radius: 30px;" :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
      </div>
      <el-table border :data="tableData"  ref="multipleTable" style="width: 100%" v-loading="loading" element-loading-text="加载中" @selection-change="handleSelectionChange" fixed="left" :default-sort= "sort" @sort-change="sortHandle">
        <el-table-column
          type="selection"
          :selectable="selectable"
          :reserve-selection="true"
          :rowKey='1'
          width="55">
        </el-table-column>
        <el-table-column prop="phone" label="会员姓名">
          <template slot-scope="scope">{{scope.row.userName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="phone" label="会员手机">
          <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="totalPerformance" label="团队业绩" sortable="1">
          <template slot-scope="scope">{{scope.row.totalPerformance | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="rankName" label="级别名称">
          <template slot-scope="scope">{{scope.row.rankName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="生成日期" width="180">
          <template slot-scope="scope">{{scope.row.createTime | filterDate | filterEmpty}}</template>
        </el-table-column>
        <template v-if="formData.disStatus === 1">
          <el-table-column prop="directProfitStatus" label="结算状态">
            <template slot-scope="scope"><span :class="{active: scope.row.directProfitStatus === 2}">{{scope.row.directProfitStatus | filtercommissionStatus  | filterEmpty}}</span>
            </template>
          </el-table-column>
        </template>
        <template v-if="formData.disStatus === 2">
          <el-table-column prop="commissionStatus" label="结算状态">
            <template slot-scope="scope"><span :class="{active: scope.row.commissionStatus === 2}">{{scope.row.commissionStatus | filtercommissionStatus  | filterEmpty}}</span></template>
          </el-table-column>
        </template>
        <template v-if="formData.disStatus === 3">
          <el-table-column prop="globalWeightStatus" label="结算状态">
            <template slot-scope="scope"><span :class="{active: scope.row.globalWeightStatus === 2}">{{scope.row.globalWeightStatus | filtercommissionStatus  | filterEmpty}}</span></template>
          </el-table-column>
        </template>
        <!-- <el-table-column label="结算状态" :key="" v-if="formData.disStatus === " v-for=" in 3" sortable="1">
          <template slot-scope="scope">{{filterSettlement(scope.row) | filtercommissionStatus | filterEmpty}}</template>
        </el-table-column>
 -->
        <el-table-column label="通用积分" :key="n" v-if="formData.disStatus === n" v-for="n in 3" sortable="2">
          <template slot-scope="scope">{{filterIntegral(scope.row) | filterEmpty}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="parseInt(scope.row.directProfitStatus) === 0 || parseInt(scope.row.commissionStatus) === 0 || parseInt(scope.row.globalWeightStatus) === 0">
                  <div @click="totalSettle(2, scope.row)"><i class="icon el-icon-view"></i>结算</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="parseInt(scope.row.directProfitStatus) === 0 || parseInt(scope.row.commissionStatus) === 0 || parseInt(scope.row.globalWeightStatus) === 0">
                  <div @click="frozenBefore(scope.row)"><i class="icon el-icon-rank"></i>冻结</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="parseInt(scope.row.directProfitStatus) === 2 || parseInt(scope.row.commissionStatus) === 2 || parseInt(scope.row.globalWeightStatus) === 2">
                  <div @click="frozenBefore(scope.row)"><i class="icon el-icon-rank"></i>取消冻结</div>
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
          <p>将为选中会员分配通用积分</p>
          <p>共计：<span>{{settleNum | filterEmpty}}个</span></p>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="" :loading="confirmLoading" @click="cancelHandle">取消</el-button>
          <el-button type="primary" @click="settleConfirm">确定</el-button>
        </span>
      </el-dialog>

      <!-- 冻结弹框 -->
      <el-dialog :title="frozenDetails.commissionStatus === 0 || frozenDetails.directProfitStatus === 0 || frozenDetails.globalWeightStatus === 0 ? '冻结' : '取消冻结'" :visible.sync="frozenVisible" width="500px" class="settle-box">
        <div class="settle-content">
          <p>确定是否{{frozenDetails.commissionStatus === 0 || frozenDetails.directProfitStatus === 0 || frozenDetails.globalWeightStatus === 0 ? '冻结' : '取消冻结'}}, {{frozenDetails.userName | filterEmpty}} ({{frozenDetails.phone | filterEmpty}})</p>
          <p>产生于：{{frozenDetails.createTime | filterDate | filterEmpty}}的奖金<span> {{frozenDetails.directProfit || frozenDetails.commission || frozenDetails.globalWeight | filterEmpty}} </span>通用积分</p>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="" :loading="confirmLoading" @click="frozenVisible = false">取消</el-button>
          <el-button type="primary" @click="frozenHandle()">确定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        confirmLoading: false,    // 确定loading
        monthArr: ['全年', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        yearArr: [],
        loading: false,            // loading
        statisticalData: {},       // 统计数据
        highSearchClose: true,     // 高级搜索开/关
        // pageType: null,         // 页面类型［null/全部，1／付款审核中，2／已审核］
        // 列表数据
        isActive: true,            // 绑定结算冻结状态样式
        tableData: [],
        sort: {
          prop: '',
          order: ''
        },                  // 排序
        subType: {},               // 扥用等级
        formData: {
          disStatus: 0,            // 页面类型[]
          status: -1,              // 结算状态(-1: 全部, 0:待结算、1：已结算)
          phone: '',               // 会员姓名/手机号
          sortVar: '',             // 排序字段（1：团队业绩、2：通用积分）
          sortType: '',            // 排序类型（0：升序、1：降序）
          memberType: '',          // 类型[1 正常会员 2 特批会员]
          curYear: '',
          curMonth: '0',
          curMonthDay: '',         // 当前月天数
          timeStart: '',           // 组合后起始时间
          timeEnd: '',
          selIdArr: []             // 选中的结算项id
        },
        selArr: [],
        actionType: 1,             // 操作类型, [1、多选，2、单条数据]
        singleSelArr: [],           // 选中的结算项
        selArrIds: [],              // 选中的结算项id
        detailsVisible: false,
        settleNum: '',              // 结算数额
        frozenVisible: false,       // 冻结弹窗
        frozenDetails: {},          // 冻结数据
        copyCheckForm: {},          // 拷贝数据
        copyFormData: '',
        examineData: {},            // 审核数据
        examineVisible: false,      // 审核弹框
        pageData: {                 // 分页
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        userInfo: {}              // 用户信息
      }
    },

    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      let pathType = this.$route.path.match(/massPushing|representInterests|greenShare|globallyShare|specialShare/gi)[0]
      switch (pathType) {
        case 'massPushing':
          this.formData.disStatus = 1
          break
        case 'representInterests':
          this.formData.disStatus = 2
          break
        case 'greenShare':
          this.formData.disStatus = 3
          break
        case 'globallyShare':
          this.formData.disStatus = 4
          break
        case 'specialShare':
          this.formData.disStatus = 5
          break
      }
      this.copyFormData = this.$Utils.deepCopy(this.formData)

      // 获取tab标签类型
      let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType')
      localStorage.setItem(this.$global.SYSTEM + 'PageType', this.formData.disStatus)

      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData('/admin/finance/commission/vipRules/', (res) => {
        if (getPagetype !== '' && parseInt(getPagetype) === this.formData.disStatus || getPagetype === this.formData.disStatus) this.formData = res
      })

      this.copyCheckForm = this.$Utils.deepCopy(this.checkForm)

      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.formData.curMonth = parseInt(this.formData.curMonth) || 0

      this.getSettleData()             // 获取结算数据
      // this.getPreMonthDay()            // 获取当前年和月
      this.initYearArr()               // 初始化年月
      if (!this.formData.curYear) this.formData.curYear = new Date().getFullYear()
      this.getCommissionLevelList()    // 获取分佣等级列表
      this.getListData()               // 得到列表数据
    },
    methods: {

      /**
       * 获取结算数据
       */
      getSettleData () {
        this.$http.get('@ROOT_API/commission/getCommission', {
          params: {
            type: this.formData.disStatus,
            year: this.formData.curYear,    // 否 int 年份
            month: this.formData.curMonth   // 否 int 月份（0：全年、1-12：一月-十二月）
          }
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
          this.statisticalData = resData.data
        })
      },

      /**
       * 获取分佣等级列表
       */
      getCommissionLevelList () {
        this.$http.get('@ROOT_API/commission/getCommissionLevelList', {}).then((res) => {
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
          this.subType = resData.data
        })
      },

      /**
       * 获取列表数据
       */
      getListData (type) {
        let url = 'commission/exportCommissionList'
        if (!type) {
          url = '@ROOT_API/commission/getCommissionList'
          this.loading = true
        }
        let data = {
          params: {
            type: this.formData.disStatus,         // （1：分享收益、2：团队分佣、3：全球分红）
            status: this.formData.status === -1 ? '' : this.formData.status,          // (0:待结算、1：已结算)
            userType: this.formData.memberType,    // 否 int 会员类型
            year: this.formData.curYear,    // 否 int 年份
            month: this.formData.curMonth,         // 否 int 月份（0：全年、1-12：一月-十二月）
            phone: this.formData.phone,            // 会员姓名/手机号
            sortVar: this.formData.sortVar,        // 排序字段（1：团队业绩、2：通用积分）
            // sortVar: 1,        // 排序字段（1：团队业绩、2：通用积分）
            sortType: this.formData.sortType,      // 排序类型（0：升序、1：降序）
            start: this.pageData.currentPage,
            pageSize: this.pageData.pageSize
          }
        }
        if (!type) {
          this.$http.get(url, data).then((res) => {
            let resData = res.data
            if (parseInt(resData.status) !== 1) {
              this.$message({
                message: resData.msg,
                type: 'error',
                duration: 1500
              })
              return false
            }
            this.pageData.total = resData.data.total
            // 列表数据
            this.tableData = resData.data.list
          }).finally(() => {
            this.loading = false
          })
        } else {
          let filterParams = []
          for (let key in data.params) {
            filterParams.push(key + '=' + data.params[key])
          }
          window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
        }
      },

      /**
       * 过滤结算状态
       */
      // filterSettlement (row) {
      //   let res = ''
      //   switch (this.formData.disStatus) {
      //     case 1:
      //       res = row.directProfitStatus
      //       break
      //     case 2:
      //       res = row.commissionStatus
      //       break
      //     case 3:
      //       res = row.globalWeightStatus
      //       break
      //   }
      //   return res
      // },

      /**
       * 过滤通用积分
       */
      filterIntegral (row) {
        let res = ''
        switch (this.formData.disStatus) {
          case 1:
            res = row.directProfit
            break
          case 2:
            res = row.commission
            break
          case 3:
            res = row.globalWeight
            break
        }
        return res
      },

      /**
       * 排序
       */
      sortHandle (data) {
        this.formData.sortVar = data.prop === 'totalPerformance' ? 1 : 2
        this.$refs.multipleTable.clearSelection()
        console.log('this.formData.sortVar: ', this.formData.sortVar)
        this.formData.sortType = data.order === 'ascending' ? 0 : 1
        this.getListData()
      },

      /**
       * 当前行是否可选
       */
      selectable (row, index) {
        return row.directProfitStatus || row.commissionStatus || row.globalWeightStatus === 1 ? !!false : !!true
      },

      /**
       * 初始化年
       */
      initYearArr () {
        let year = new Date().getFullYear()
        for (let i = 0; i < 15; i++) {
          this.yearArr.push(year++)
        }
      },

      /**
       * 冻结前操作
       */
      frozenBefore (row) {
        this.frozenDetails = row
        this.frozenVisible = true
        console.log('this.frozenDetails: ', this.frozenDetails)
      },

      /**
       * 冻结操作
       */
      frozenHandle () {
        this.confirmLoading = true
        this.$http.post('@ROOT_API/commission/updateFrozenStatus', {
          type: this.formData.disStatus,
          id: this.frozenDetails.id,
          status: this.frozenDetails.commissionStatus === 0 || this.frozenDetails.directProfitStatus === 0 || this.frozenDetails.globalWeightStatus === 0 ? 1 : 2
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
          this.$message({
            message: '提交成功',
            type: 'success',
            duration: 1500
          })
          this.frozenVisible = false
          this.getListData()
        }).finally(() => {
          setTimeout(() => {
            this.confirmLoading = false
          }, 1000)
        })
      },

      /**
       * 选择结算类型
       */
      subTypehandle (val) {
        console.log(val)
        this.$refs.multipleTable.clearSelection()
        this.getListData()
      },

      /**
       * 搜索
       */
      searchHandle () {
        this.$refs.multipleTable.clearSelection()
        this.pageData.currentPage = 1
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
        this.getListData()
      },

      /**
       * 选择会员类型
       */
      selectMember (val) {
        this.$refs.multipleTable.clearSelection()
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
        this.getListData()
      },

      /**
       * 选择年
       */
      selectYear () {
        this.formData.curMonth = 0
        this.$refs.multipleTable.clearSelection()
        this.formData.timeStart = ''
        this.formData.timeEnd = ''
        this.pageChange(1)
      },

      /**
       * 选择月
       */
      selectMonth (val) {
        console.log(val)
        let day = this.$Utils.getDaysInMonth(this.formData.curYear, val)
        this.$refs.multipleTable.clearSelection()
        if (parseInt(val) !== 0) {
          this.formData.timeStart = this.formData.curYear + '-' + val + '-' + '01'
          this.formData.timeEnd = this.formData.curYear + '-' + val + '-' + day
        } else {
          this.formData.timeStart = ''
          this.formData.timeEnd = ''
        }
        this.pageChange(1)
      },

      /**
       * 取消结算
       */
      cancelHandle () {
        this.selArrIds = []
        this.detailsVisible = false
      },

      /**
       * 选择结算对象
       */
      handleSelectionChange (val) {
        this.selArr = val
      },

      /**
       * 结算弹窗
       */
      totalSettle (type, arr) {
        this.selArrIds = []
        this.actionType = type
        let filterArr = type === 1 ? this.selArr : [arr]

        this.settleNum = 0
        filterArr.forEach(row => {
          this.selArrIds.push(row.id)
          switch (this.formData.disStatus) {
            case 1:
              this.settleNum += parseFloat(row.directProfit)
              break
            case 2:
              this.settleNum += parseFloat(row.commission)
              break
            case 3:
              this.settleNum += parseFloat(row.globalWeight)
              break
          }
        })
        this.detailsVisible = true
      },

      /**
       * 结算--确认
       */
      settleConfirm () {
        this.confirmLoading = true
        this.$http.post('@ROOT_API/commission/updateStatus', {
          type: this.formData.disStatus,
          ids: this.selArrIds
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
          this.$refs.multipleTable.clearSelection()
          this.detailsVisible = false
          this.getListData()
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
          this.getSettleData()
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
    .statistics-basic-wrap{
      height: 140px;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      .items{
        width: 33.33%;
        height: 100%;
        margin-right: 25px;
        overflow: hidden;
        background: #c2e0fe url(../../../../assets/img/statistics-bg.jpg);
        background-size: cover;
        border-radius: 5px;

        dl{
          color: #fff;
          margin-top: 45px;
          margin-left: 20%;
          padding-left: 85px;

          dt{
            width: 70px;
            height: 60px;
            /*background-image: url(../../../assets/img/statistics-bg.jpg);*/
            background-repeat: no-repeat;
            left: 0;
            top: 0;
          }

          .dt2{
            background-position: -70px 0;
          }

          .dt3{
            background-position: -140px 0;
          }

          dd{
            strong{
              height: 28px;
              line-height: 28px;
              font-size: 28px;
              margin-bottom: 12px;
            }
          }
        }
      }

      .items:last-child{
        margin-right: 0;
      }
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

    /*----------全部/待结算/已结算切换页----------*/
    .switch-wrap{
      .settle-btn {
        width: 102px;
        height: 36px;
        border-radius: 18px;
        border: solid 1px #2eaaf7;
        font-size: 14px;
        color: #2eaaf7;
        z-index: 10;
      }

      .el-radio-group{
        border-radius: 0;

        .apply-fee-label{
          .el-form-item__content{
            margin-left: 27px !important;
          }

          .el-radio-button:first-child .el-radio-button__inner{
            border-left: none;
          }
        }

        .el-radio-button__orig-radio:checked+.el-radio-button__inner{
          color: #409EFF;
          background: none;
          border: none;
          border-top: 2px solid #409EFF;
          border-right: 1px solid #dcdfe6;
          border-radius: 0;
        }

        .el-radio-button__inner{
          box-shadow: none;
        }

        .is-active{
          border-left: none;
        }
      }
    }

    .el-radio-button--medium .el-radio-button__inner{
      padding: 10px;
    }

    .search-cont{
      .el-input__inner{
        height: 36px;
        border-radius: 30px !important;
      }

      .el-icon-search{
        right: 13px;
        top: 10px;
      }
    }

    .el-table{
      .caret-wrapper{
        width: 0;
        height: 14px;
      }
      .sort-caret{

      }
      .sort-caret.ascending{
        top: -5px;
      }
      .sort-caret.descending{
        bottom: -3px;
      }

      .el-table__column-filter-trigger{
        line-height: 0;
      }
    }

    .active{
      color: red;
    }
  }
</style>
