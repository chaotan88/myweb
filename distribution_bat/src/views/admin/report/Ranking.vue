<!-- 业绩排名表 -->
<template>
  <common-tpl class="report-ranking-wrap" :footer="false">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search :textVisible="pageType === 1" @search="highSearch('form')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <div class="d-ib" style="width: 150px;">
            <el-select class="full-w" v-model="formData.topNum">
              <el-option label="Top10" value="ten"></el-option>
              <el-option label="Top50" value="fifty"></el-option>
              <el-option label="Top100" value="hundred"></el-option>
              <el-option label="Top200" value="twoHundred"></el-option>
              <el-option label="所有" value="all"></el-option>
            </el-select>
          </div>
          &nbsp;
          <div class="d-ib pos-r">
            <el-input placeholder="输入会员姓名/手机号" v-model.trim="formData.condition" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form ref="form" :rules="rules" :model="formData" label-position="right" class="search-form" label-width="110px">
            <el-form-item label="会员姓名：" prop="cardName">
              <el-input v-model.trim="formData.cardName" placeholder="20个字符以内" clearable maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="会员手机：" prop="phone">
              <el-input v-model.trim="formData.phone" placeholder="会员手机" clearable></el-input>
            </el-form-item>
            <el-form-item label="统计时间段：" class="pos-r apply-date-wrap">
              <el-date-picker type="datetimerange" start-placeholder="年/月/日" end-placeholder="年/月/日" v-model.trim="formData.statisticsDate" clearable :picker-options="pickerOptions0" @change="statisticsDateChange"></el-date-picker>
            </el-form-item>
            <el-form-item label="会员等级：">
              <el-select v-model="formData.disRuleId" placeholder="请选择会员等级" clearable>
                <template v-for="item in memberLevelList">
                  <el-option
                    :key="item.id"
                    :label="item.ruleName"
                    :value="item.id">
                  </el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="地区：" class="select-wrap">
              <region-select :key="regionKey" :initData="formData.region" @change="regionChange"></region-select>
            </el-form-item>
          </el-form>
          <div class="clear"></div>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>
    </template>

    <template slot="main" class="pos-r">
      <el-dropdown class="ta-c pos-a ranking-screen-data" disabled>
        <span class="cursor">
          <svg class="icon icon-fenlei sort-btn" aria-hidden="true">
            <use xlink:href="#icon-fenlei"></use>
          </svg>
        </span>
        <el-dropdown-menu slot="dropdown" class="report-ranking-dropdown-menu">
          <div class="dropdown-report-ranking-wrap">
            <div class="item">
              <h4 style="color: #333; font-size: 16px; height: 20px; font-weight: normal;">
                <el-checkbox @change="screeningAllChange">选择显示的字段</el-checkbox>
              </h4>
              <i class="nnderline"></i>
            </div>
            <el-checkbox-group v-model="formData.checkList">
              <div class="item">
                <h4 class="title">固定指标</h4>
                <div class="content ranking-screen-data-ash" v-for="item in checkListArr" v-if="item.default">
                  <el-checkbox :key="item.key" :label="item.key" disabled>{{item.value}}</el-checkbox>
                </div>
              </div>
              <i class="nnderline"></i>
              <div class="item">
                <h4 class="title">筛选指标</h4>
                <div class="content" v-for="item in checkListArr" v-if="!item.default">
                  <el-checkbox :key="item.key" :label="item.key" @change="screeningIndexChange">{{item.value}}</el-checkbox>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </el-dropdown-menu>
      </el-dropdown>

      <el-table :data="tableData" class="full-w" v-loading="loading" element-loading-text="加载中" fixed="left" :default-sort= "{prop: 'date', order: 'descending'}" @sort-change="sortHandle">
        <el-table-column type="index" label="序号" width="70" :index="indexMethod"></el-table-column>
        <el-table-column label="会员ID号" min-width="120" >
          <template slot-scope="scope">{{scope.row.invitationCode | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="会员姓名" min-width="120">
          <template slot-scope="scope">{{scope.row.cardName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="手机号" min-width="120" v-if="filterFieldVisible('phone')">
          <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="身份证号" min-width="120" v-if="filterFieldVisible('idCard')">
          <template slot-scope="scope">{{scope.row.idCard | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="地区" min-width="120" v-if="filterFieldVisible('region')">
          <template slot-scope="scope">{{scope.row.region | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="累计余额总额" min-width="140" prop="balanceTotal" sortable="custom" v-if="filterFieldVisible('balanceTotal')">
          <template slot-scope="scope">{{scope.row.balanceTotal | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="余额购物总额" min-width="140" prop="balanceBuy" sortable="custom" v-if="filterFieldVisible('balanceBuy')">
          <template slot-scope="scope">{{scope.row.balanceBuy | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="余额对账调整" min-width="140" prop="balanceRevise" sortable="custom" v-if="filterFieldVisible('balanceRevise')">
          <template slot-scope="scope">{{scope.row.balanceRevise | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="余额剩余总额" min-width="140" prop="sumBalance" sortable="custom" v-if="filterFieldVisible('sumBalance')">
          <template slot-scope="scope">{{scope.row.sumBalance | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="累计消费积分" min-width="140" prop="bonusPointsTotal" sortable="custom" v-if="filterFieldVisible('bonusPointsTotal')">
          <template slot-scope="scope">{{scope.row.bonusPointsTotal | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="消费积分兑换通证总数" min-width="180" prop="bonusPointsConvertBctc" sortable="custom" v-if="filterFieldVisible('bonusPointsConvertBctc')">
          <template slot-scope="scope">{{scope.row.bonusPointsConvertBctc | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="消费积分兑换通证总数" min-width="180" prop="bonusPointsConvertBctc" sortable="custom" v-if="filterFieldVisible('bonusPointsConvertBctc')">
          <template slot-scope="scope">{{scope.row.bonusPointsConvertBctc | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="消费积分对账调整" min-width="180" prop="bonusPointsRevise" sortable="custom" v-if="filterFieldVisible('bonusPointsRevise')">
          <template slot-scope="scope">{{scope.row.bonusPointsRevise | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="消费积分剩余" min-width="180" prop="sumBonusPoints" sortable="custom" v-if="filterFieldVisible('sumBonusPoints')">
          <template slot-scope="scope">{{scope.row.sumBonusPoints | filterMoney}}</template>
        </el-table-column>
         <el-table-column label="其他" min-width="130" prop="other" sortable="custom" v-if="filterFieldVisible('other')">
          <template slot-scope="scope">{{scope.row.other | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="消费赠送消费积分" min-width="160" prop="bonusPointsSend" sortable="custom" v-if="filterFieldVisible('bonusPointsSend')">
          <template slot-scope="scope">{{scope.row.bonusPointsSend | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="分佣获得消费积分" min-width="160" prop="bonusPointsCommission" sortable="custom" v-if="filterFieldVisible('bonusPointsCommission')">
          <template slot-scope="scope">{{scope.row.bonusPointsCommission | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="累计通用积分" min-width="140" prop="cashPointsTotal" sortable="custom" v-if="filterFieldVisible('cashPointsTotal')">
          <template slot-scope="scope">{{scope.row.cashPointsTotal | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="分享获得消费积分" min-width="160" prop="bonusPointsShare" sortable="custom" v-if="filterFieldVisible('bonusPointsShare')">
          <template slot-scope="scope">{{scope.row.bonusPointsShare | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="已提现通用积分" min-width="150" prop="hasWithdrawal" sortable="custom" v-if="filterFieldVisible('hasWithdrawal')">
          <template slot-scope="scope">{{scope.row.hasWithdrawal | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="通用积分兑换通证总数" min-width="180" prop="cashPointsConvertBctc" sortable="custom" v-if="filterFieldVisible('cashPointsConvertBctc')">
          <template slot-scope="scope">{{scope.row.cashPointsConvertBctc | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="通用积分兑换商品总数" min-width="180" prop="cashPointsConvertGoods" sortable="custom" v-if="filterFieldVisible('cashPointsConvertGoods')">
          <template slot-scope="scope">{{scope.row.cashPointsConvertGoods | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="通用积分剩余总数" min-width="160" prop="sumCashPoints" sortable="custom" v-if="filterFieldVisible('sumCashPoints')">
          <template slot-scope="scope">{{scope.row.sumCashPoints | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="通用积分对账调整" min-width="160" prop="cashPointsRevise" sortable="custom" v-if="filterFieldVisible('cashPointsRevise')">
          <template slot-scope="scope">{{scope.row.cashPointsRevise | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="分佣获得通用积分" min-width="160" prop="cashPointsCommission" sortable="custom" v-if="filterFieldVisible('cashPointsCommission')">
          <template slot-scope="scope">{{scope.row.cashPointsCommission | filterMoney}}</template>
        </el-table-column>
        <el-table-column label="分享获得通用积分" min-width="160" prop="cashPointsShare" sortable="custom" v-if="filterFieldVisible('cashPointsShare')">
          <template slot-scope="scope">{{scope.row.cashPointsShare | filterMoney}}</template>
        </el-table-column>
        <el-table-column fixed="right" prop="tag" label="" width="50"></el-table-column>

        <!-- 暂无数据 -->
        <template slot="empty">
          <no-data></no-data>
        </template>
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
  </common-tpl>
</template>

<script>
import RegionSelect from '@/components/utils/RegionSelect'
const balanceListDtat = ['累计余额总额', '环比', '余额购物总额', '环比', '余额剩余总额', '环比', '累计消费积分', '环比', '消费积分兑换通证总数', '环比']
export default{
  components: { RegionSelect },
  data () {
    // 会员姓名
    let validateCardName = (rule, value, callback) => {
      if (value && value.length > 20) return callback(new Error('20个字符以内'))
      callback()
    }

    // 验证手机
    let validatePhone = (rule, value, callback) => {
      if (!value) return callback()
      if ((value && value.match(/\D/g)) || (value.length >= 11 && !value.toString().match(/^1\d{10}$/gi))) return callback(new Error('手机号格式错误'))
      callback()
    }
    return {
      loading: false,         // 加载loading
      pageType: 1,            // 页面类型 [1、业绩表 2、业绩明细]
      firstDate: '',          // 统计时间开始
      endDate: '',            // 统计时间结束
      formData: {             // 表单数据
        topNum: '',           // 导出top
        condition: '',        // 会员姓名/手机号
        cardName: '',         // 会员姓名
        phone: '',            // 会员手机号
        firstDate: '',        // 统计时间开始
        endDate: '',          // 统计时间结束
        statisticsDate: [],   // 统计时间段
        disRuleId: '',        // 会员身份
        region: {
          province: {         // 省
            code: '',
            name: ''
          },
          city: {             // 市
            code: '',
            name: ''
          },
          area: {             // 区
            code: '',
            name: ''
          }
        },
        ranking: 1,           // 排名
        checkList: ['index', 'id', 'name'], // 过滤table显示
        sortName: '',         // 排序字段名称
        sort: ''              // 排序方式
      },
      checkListArr: [
        { key: 'index', value: '序号', default: true },
        { key: 'id', value: '会员ID号', default: true },
        { key: 'name', value: '会员姓名', default: true },
        { key: 'phone', value: '手机号', default: true },
        { key: 'cardNum', value: '身份证号', default: true },
        { key: 'region', value: '地区', default: true },
        { key: 'balanceTotal', value: '累计余额总额', default: true },
        { key: 'balanceRevise', value: '余额对账调整', default: true },
        { key: 'balanceBuy', value: '余额购物总额', default: true },
        { key: 'sumBalance', value: '余额剩余总额', default: true },
        { key: 'bonusPointsTotal', value: '累计消费积分', default: true },
        { key: 'bonusPointsSend', value: '消费赠送消费积分' },
        { key: 'bonusPointsCommission', value: '分佣获得消费积分' },
        { key: 'other', value: '其他' },
        { key: 'bonusPointsConvertBctc', value: '消费积分兑换通证总数', default: true },
        { key: 'bonusPointsConvertGoods', value: '消费积分兑换商品总数', default: true },
        { key: 'bonusPointsRevise', value: '消费积分对账调整', default: true },
        { key: 'sumBonusPoints', value: '消费积分剩余总数', default: true },
        { key: 'cashPointsTotal', value: '累计通用积分', default: true },
        { key: 'hasWithdrawal', value: '已提现通用积分' },
        { key: 'cashPointsConvertBctc', value: '通用积分兑换通证总数' },
        { key: 'cashPointsCommission', value: '分佣获得通用积分' },
        { key: 'cashPointsShare', value: '分享获得通用积分' },
        { key: 'cashPointsRevise', value: '通用积分对账调整' },
        { key: 'sumCashPoints', value: '通用积分剩余总数' }
      ],
      memberLevelList: [],            // 会员列表
      highSearchClose: true,          // 高级搜索开/关
      reflectData: {},                // 提现数据
      reflectVisible: false,          // 提现弹窗
      tableData: [],                  // 列表数据
      regionKey: '',                  // 省市区唯一标示符
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: balanceListDtat,
      isIndeterminate: true,
      pageData: {                     // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      all: 0,
      userInfo: {},            // 用户信息
      rules: {
        // 查询条件
        condition: { validator: validatePhone, trigger: 'blur' },
        // 会员姓名
        cardName: { validator: validateCardName, trigger: 'blur' },
        // 会员手机
        phone: { validator: validatePhone, trigger: 'blur' }
      },
      userId: '',                           // 用户id
      onPickDate: '',                       // 时间控件点击
      pickerOptions0: {                     // 限制时间
        onPick: ({ maxDate, minDate }) => {
          this.onPickDate = minDate
        },
        disabledDate: (time) => {
          if (this.onPickDate) {
            let date = this.onPickDate
            let y = date.getFullYear()
            let m = date.getMonth()
            let firstDay = new Date(y, m, 1)
            let lastDay = new Date(y, m + 2, 0)
            return time.getTime() < firstDay || time.getTime() > new Date(new Date() - 24 * 60 * 60 * 1000) || time.getTime() > lastDay
          } else {
            return time.getTime() > new Date(new Date() - 24 * 60 * 60 * 1000)
          }
        }
      }
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.userId = parseInt(this.$route.query.userId) || ''
    if (this.$route.path.match(/details/)) this.pageType = 2
    this.copyFormData = this.$Utils.deepCopy(this.formData)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admins/vip/account', (res) => {
      this.formData = res
    })
    if (this.$route.query.startTime) this.formData.statisticsDate[0] = this.$route.query.startTime
    if (this.$route.query.endTime) this.formData.statisticsDate[1] = this.$route.query.endTime
    this.copyCheckForm = this.$Utils.deepCopy(this.checkForm)
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.handleFilterDate()
    this.selectDefaultekey()    // 选择默认值
    this.getPartnerList()       // 获取会员列表
    this.getListData()
  },

  methods: {
    /**
     * 过滤table字段显示
     * @param  {[String || Array]} key [对应需要过滤的字段]
     */
    filterFieldVisible (key) {
      if (!key) return ''
      let res = false
      if (Array.isArray(key)) {
        key.forEach((item) => {
          if (this.formData.checkList.indexOf(item) !== -1) res = true
        })
      } else {
        if (this.formData.checkList.indexOf(key) !== -1) res = true
      }
      return res
    },

    /**
     * 过滤时间
     */
    handleFilterDate () {
      // 起始日期过滤
      let firstDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      this.firstDate = this.$Utils.filterDate(firstDate)

      let date = new Date()
      let day = new Date(date.getFullYear(), date.getMonth(), 0).getDate()
      let endDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, day)

      this.endDate = this.$Utils.filterDate(endDate.getTime() + (24 * 60 * 60 * 1000 - 1))
    },

    /**
     * 时间改变
     */
    statisticsDateChange (value) {
      if (!value) this.onPickDate = ''
    },

    /**
     * 获取列表数据
     * @param  {[type]} type [数据类型，type存在表示获取导出数据]
     */
    getListData (type) {
      let url = 'performanceRankReportManageController/exportPerformanceRankReportList'
      if (!type) {
        url = '@ROOT_API/performanceRankReportManageController/getPerformanceRankReportList'
        this.loading = true
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        condition: this.formData.condition,                        // 否 string  查询条件
        registerTimeStart: this.formData.statisticsDate[0] ? this.$Utils.filterDate(this.formData.statisticsDate[0]) : '',  // 否 date  开始时间
        registerTimeEnd: this.formData.statisticsDate[1] ? this.$Utils.filterDate(this.formData.statisticsDate[1]) : '',    // 否 date  结束时间
        cardName: this.formData.cardName,                          // 否 string  会员姓名
        phone: this.formData.phone,                                // 否 string  会员手机
        disRuleId: this.formData.disRuleId,                        // 否 string  会员等级
        userProvinceCode: this.formData.region.province.code,      // 否 string  省
        userCityCode: this.formData.region.city.code,              // 否 string  市
        userZoneCode: this.formData.region.area.code,              // 否 string  区
        sortName: this.formData.sortName,
        sort: this.formData.sort,
        topNum: this.formData.topNum
      }
      if (!type) {
        this.$http.post(url, data).then((res) => {
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
          let results = resData.data
          results.list.forEach((row) => {
            let region = []
            if (row.userProvince) region.push(row.userProvince)
            if (row.userCity) region.push(row.userCity)
            if (row.userZone) region.push(row.userZone)
            row.region = region.join(', ')
          })
          this.tableData = results.list
          this.pageData.total = results.total
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        for (let key in data) {
          filterParams.push(key + '=' + data[key])
        }
        window.open(this.$dm.ROOT_API + url + '?token=' + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
      }
    },

    /**
     * 获取会员数据
     */
    getPartnerList () {
      this.$http.post('@ROOT_API/settleManageController/getDisRuleList', {}).then((res) => {
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
        this.memberLevelList = resData.data
      })
    },

    /**
     * 过滤索引
     */
    indexMethod (index) {
      return (this.pageData.currentPage - 1) * this.pageData.pageSize + index + 1
    },

    /**
     * 筛选指标
     */
    screeningIndexChange () {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 选择默认值
     */
    selectDefaultekey () {
      this.$nextTick(() => {
        this.formData.checkList = []
        this.formData.checkList = [true]
        this.checkListArr.forEach((row) => {
          if (row.default) this.formData.checkList.push(row.key)
        })
      })
    },

    /**
     * 排序
     */
    sortHandle (data) {
      console.log('测试数据：', data, data.order, data.prop)
      this.formData.sortName = data.prop
      this.formData.sort = data.order === 'ascending' ? 'asc' : 'desc'
      this.getListData()
    },

    /**
     * 选择全选字段
     */
    screeningAllChange (value) {
      this.formData.checkList = []
      if (!value) {
        this.checkListArr.forEach((row) => {
          if (row.default) this.formData.checkList.push(row.key)
        })
      } else {
        this.checkListArr.forEach((row) => {
          this.formData.checkList.push(row.key)
        })
      }
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 省市区数据更新
     */
    regionChange (results) {
      this.formData.region = results
    },

    /**
     * 高级搜索
     */
    highSearch (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.highSearchClose = false
          return false
        }
        this.highSearchClose = true
        this.pageChange(1)
      })
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.getListData()
      this.pageChange(1)
    },

    /**
     * 清空重置搜索
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      this.regionKey = new Date().getTime()
      localStorage.removeItem(this.$global.FORM_DATA)
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
    },

    /**
     * 查看详情
     */
    handleViewDetails (item) {
      let startTime = this.formData.statisticsDate[0] ? this.$Utils.filterDate(this.formData.statisticsDate[0]) : this.firstDate
      let endTime = this.formData.statisticsDate[1] ? this.$Utils.filterDate(new Date(this.formData.statisticsDate[1]).getTime() + (24 * 60 * 60 * 1000 - 1)) : this.endDate
      this.$router.push({path: '/admin/report/list/details', query: {'userId': item.userId, startTime, endTime}})
    },

    handleCheckAllChange (val) {
      this.checkedCities = val ? balanceListDtat : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>

<style lang='less'>
.report-ranking-wrap{
  .search-wrap{

    .high-search-down{
      .el-input{
        width: 300px !important;
      }
      /*.el-date-editor{
        width: 140px !important;
      }*/
    }
  }

  .admin-common-tpl-main{
    position: relative;
  }
  .search-head-wrap{
    .high-search-down.active{
      .el-input{
        width: 350px !important;
      }
    }
  }

  .region-select-wrap{
    width: 300px;
    .el-select{
      width: 200px !important;

      .el-input{
        width:100% !important;
      }
    }
  }

  .el-table{
    .caret-wrapper{
      width: 0;
      height: 18px;
    }
    .sort-caret{

    }
    .sort-caret.ascending{
      top: -4px;
    }
    .sort-caret.descending{
      bottom: -2px;
    }

    .el-table__column-filter-trigger{
      line-height: 0;
    }
  }

  .el-date-editor{
    width: 300px !important;
  }

  .el-col-2{
    width: 6.3333%;
  }

  .ranking-screen-data{
    width: 50px;
    right: 30px;
    top: 40px;
    z-index: 30 !important;

    .sort-btn{
      width: 24px;
      height: 24px;
    }

    .icon{
      fill: #333;
    }

    .el-checkbox{
      padding: 5px 0;
    }
  }

  .ranking-screen-data:hover{
    .icon{
      fill: #2eaaf7;
    }
  }
}



.report-ranking-dropdown-menu{
  width: 230px;
  z-index: 100 !important;
}

.dropdown-report-ranking-wrap{
  max-height: 400px;
  padding: 0 20px;
  overflow-y: auto;

  .item{
    padding: 5px 0 !important;

    .title{
      color: #333;
      font-size: 14px;
      height: 35px;
      line-height: 35px;
      font-weight: normal;
    }

    .content{
      color: #6c6c6c;
      font-size: 12px;
      height:35px;
      line-height: 35px;
    }
  }
  .nnderline{
    display: inline-block;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #eee;
  }
}

.dropdown-report-ranking-wrap::-webkit-scrollbar{
  width: 6px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0);
}

.dropdown-report-ranking-wrap::-webkit-scrollbar-thumb{
  background: rgba(12, 39, 57, .3);
  border-radius: 10px;
}
</style>

