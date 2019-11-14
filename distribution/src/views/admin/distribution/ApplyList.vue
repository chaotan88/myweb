<!-- 会员申请列表页 -->
<template>
  <common-tpl class="apply-list-wrap" :footer="false">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入会员姓名/手机号/身份证号" v-model.trim="formData.condition" @keyup.enter.native="searchHandle">
          </el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <template slot="edit">
          <div class="d-ib sort-type-wrap">
            排序方式：
            <el-select style="margin-right: 15px;" v-model="formData.sortType" @change="searchHandle">
              <el-option label="按照注册日期" :value="1"></el-option>
              <el-option label="按照申请日期" :value="2"></el-option>
            </el-select>
          </div>
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form ref="form" :rules="rules" :model="formData" label-position="right" label-width="140px" class="search-form">
            <el-form-item label="会员姓名：" prop="cardName">
              <el-input v-model.trim="formData.cardName" placeholder="20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员手机：" prop="phone">
              <el-input v-model.trim="formData.phone" placeholder="手机格式，限11个字符" clearable></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idCard">
              <el-input v-model.trim="formData.idCard" placeholder="仅限输入数字和字母，20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="第三方支付单号：" prop="payNo">
              <el-input v-model.trim="formData.payNo" placeholder="仅限输入数字和字母，20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="申请身份等级：">
              <el-select v-model="formData.identityLevel" clearable>
                <template v-for="item in identityLevelData">
                  <el-option :value="item.id" :label="item.ruleName"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="激活状态：" v-if="pageType === ''">
              <el-select v-model="formData.isOpen" placeholder="选择状态" clearable>
                <el-option label="已激活" :value="1"></el-option>
                <el-option label="待激活" :value="0"></el-option>
                <el-option label="激活失败" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="付款方式：">
              <el-select v-model="formData.payType" placeholder="选择付款方式" clearable>
                <el-option label="微信支付" value="1"></el-option>
                <el-option label="支付宝支付" value="2"></el-option>
                <el-option label="线下支付" value="3"></el-option>
                <el-option label="余额支付" value="4"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="支付状态：" v-if="pageType === ''">
              <el-select v-model="formData.payStatus" placeholder="选择支付状态" clearable>
                <el-option label="未支付" :value="0"></el-option>
                <el-option label="已支付" :value="1"></el-option>
                <el-option label="支付失败" :value="2"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="申请日期：" class="pos-r apply-date-wrap">
              <el-col :span="5">
                <el-date-picker type="date" placeholder="年/月/日" v-model="formData.applyTimeStart" style="width: 100%;" clearable></el-date-picker>
              </el-col>
              <el-col class="line ta-c" :span="2">至</el-col>
              <el-col :span="5">
                <el-date-picker type="date" placeholder="年/月/日" v-model="formData.applyTimeEnd" style="width: 100%;" clearable></el-date-picker>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="clear"></div>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="applyNo" label="会员姓名" width="150">
          <template slot-scope="scope">{{scope.row.cardName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="phone" label="会员手机" width="120">
          <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="currentIdentity" label="当前会员身份" width="120">
          <template slot-scope="scope">{{scope.row.currentIdentity | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="applyIdentity" label="申请成为身份" width="200">
          <template slot-scope="scope">{{scope.row.applyIdentity | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="beCardName" label="邀请人姓名" width="120">
          <template slot-scope="scope">{{scope.row.beCardName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="beInvitationCode" label="邀请人ID" width="120">
          <template slot-scope="scope">{{scope.row.beInvitationCode | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="payAmount" label="应付金额（元）" width="120">
          <template slot-scope="scope">{{scope.row.payAmount | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="payType" label="付款方式" width="120">
          <template slot-scope="scope">{{scope.row.payType | filterPayType}}</template>
        </el-table-column>
        <el-table-column prop="payStatus" label="支付状态" width="120">
          <template slot-scope="scope">{{scope.row.payStatus | filterPayStatus(scope.row.payType)}}</template>
        </el-table-column>
        <el-table-column prop="isOpen" label="激活状态" width="120">
          <template slot-scope="scope">{{scope.row.isOpen | filterOpen}}</template>
        </el-table-column>
        <el-table-column prop="shopType" label="申请日期" width="180">
          <template slot-scope="scope">{{scope.row.applyTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册日期" width="180">
          <template slot-scope="scope">{{scope.row.registerTime | filterDate}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="parseInt(scope.row.isOpen) === 0 && parseInt(scope.row.payStatus) === 1">
                  <div @click="activateBefore(scope.row)"><i class="icon el-icon-sort"></i>激活</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="$router.push({path: '/admin/distribution/apply/details', query:{id: scope.row.id}})"><i class="icon el-icon-view"></i>详情</div>
                  <!-- <div @click="handleViewDetails(row)"><i class="icon el-icon-view"></i>详情</div> -->
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <!-- 暂无数据 -->
        <div slot="empty"><no-data></no-data></div>
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
      <!-- 激活账户 -->
      <el-dialog title="激活账户" :visible.sync="activateVisible" width="700" :key="regionSelectKey">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <gray-title title="邀请人信息" class="ta-l"></gray-title>
          <table>
            <tr>
              <td>邀请人ID号：</td>
              <td>{{applyData.beInvitationCode | filterEmpty}}</td>
            </tr>
            <tr>
              <td>邀请人姓名：</td>
              <td>{{applyData.beCardName | filterEmpty}}</td>
            </tr>
            <tr>
              <td>邀请人身份：</td>
              <td>{{applyData.beRuleName | filterEmpty}}</td>
            </tr>
            <tr>
              <td>邀请人手机：</td>
              <td>{{applyData.bePhone | filterEmpty}}</td>
            </tr>
          </table>

          <br/>

          <gray-title title="升级信息" class="ta-l"></gray-title>
          <table>
            <tr>
              <td>代理级别：</td>
              <td>
                <el-form-item prop="agentRandStr" class="activate">
                  <el-radio-group v-model="ruleForm.agentRandStr">
                    <el-radio :label="1">市级代理</el-radio>
                    <el-radio :label="2">地区代理</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
              <tr>
                <td></td>
                <td>
                  <el-form-item class="select-wrap">
                    <region-select :initData="region" @change="regionChange" :ifArea="ruleForm.agentRandStr === 1 ? !!false : !!true"></region-select>
                  </el-form-item>
                </td>
              </tr>
              <!-- <tr v-if="ruleForm.agentRandStr === 2">
                <td></td>
                <td>
                  <el-form-item class="select-wrap">
                    <region-select :assignData="region" @change="regionChange"></region-select>
                  </el-form-item>
                </td>
              </tr> -->
            </tr>
            <tr>
              <td>商城商品：</td>
              <td>{{applyData.toGoodsMoney | filterMoney | filterEmpty('元')}}</td>
            </tr>
            <tr>
              <td>商城消费积分：</td>
              <td>{{applyData.toConsumePoint | filterEmpty('个积分')}}</td>
            </tr>
            <tr>
              <td>是否激活：</td>
              <td>
                <el-form-item prop="activate" class="activate">
                  <el-radio-group v-model="ruleForm.activate">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
              <tr v-if="ruleForm.activate === 2">
                <td></td>
                <td>
                  <el-form-item prop="remark">
                    <el-input type="textarea" maxlength="100" rows="5" style="width: 590px" placeholder="填写失败原因" v-model="ruleForm.remark"></el-input>
                    <span>{{ruleForm.remark.length}}/100</span>
                  </el-form-item>
                </td>
              </tr>
            </tr>
            <template v-if="parentListData.length">
            <!-- <template> -->
              <tr>
                <td style="border-bottom: 0;" class="red">激活提醒：</td>
                <td style="border-bottom: 0;">该用户存在以下，上级属于<span class="red">消费会员</span>，确认是否优先激活上级？</td>
              </tr>
              <tr>
                <td colspan="2">
                  <table class="ta-c info-table">
                    <tr>
                      <th>ID</th>
                      <th>身份</th>
                      <th>姓名</th>
                      <th>手机号</th>
                      <th>升级申请</th>
                    </tr>
                    <tr v-for="item in parentListData">
                      <td>{{item.invitationCode}}</td>
                      <td>{{item.ruleName}}</td>
                      <td>{{item.cardName}}</td>
                      <td>{{item.phone}}</td>
                      <td>
                        <template v-if="item.applyId">
                          <!-- 线下支付 -->
                          <el-button type="text" @click="handleExamineBefore(item)" v-if="parseInt(item.payStatus) === 3">审核</el-button>
                          <el-button type="text" @click="handleView(item)" v-if="parseInt(item.payStatus) === 1">查看</el-button>
                        </template>
                        <template v-else>{{'' | filterEmpty}}</template>
                      </td>
                    </tr>
                  </table>
                  <!-- <el-table width="100%">
                    <el-table-column></el-table-column>
                  </el-table> -->
                </td>
              </tr>
            </template>
          </table>
          <el-form-item prop="activate" class="activate">
            <el-button @click="activateVisible = false">取 消</el-button>
            <el-button type="primary" :loading="activateLoading" @click="activateHandle('ruleForm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 付款审核 -->
      <payment-examine :visible="examineVisible" :examineData="examineData" @close="examineVisible = false" @error="handleExamineError" @success="handleExamineSuccess"></payment-examine>
    </template>

  </common-tpl>
</template>

<script>
import PaymentExamine from '../sale/PaymentExamine'
import RegionSelect from '@/components/utils/RegionSelect'

export default {
  components: {PaymentExamine, RegionSelect},
  data () {
    // 会员姓名
    let validateCardName = (rule, value, callback) => {
      if (value && value.length > 20) return callback(new Error('20个字符以内'))
      callback()
    }

    // 验证手机
    let validatePhone = (rule, value, callback) => {
      let reg = /^1\d{10}$/gi
      if ((value && value.toString().match(/\D/)) || (value.length === 11 && !value.toString().match(reg))) return callback(new Error('手机号格式错误'))
      callback()
    }

    // 身份证号
    let validateIdCard = (rule, value, callback) => {
      if (value && !value.toString().match(/^[0-9a-zA-Z]{0,20}$/g)) return callback(new Error('仅限输入数字和字母，20个字符以内'))
      callback()
    }

    // 失败原因
    let validateRemark = (rule, value, callback) => {
      if (value && this.ruleForm.activate === 2 && value.length > 100) return callback(new Error('仅100个字符以内'))
      callback()
    }

    return {
      loading: false,           // 加载中
      activateLoading: false,   // 激活账户loading
      highSearchClose: true,    // 高级搜索开/关
      pageType: '',             // 页面类型
      tableData: [],            // 列表数据
      formData: {
        condition: '',          // 申请编号
        cardName: '',           // 会员姓名
        phone: '',              // 会员手机
        idCard: '',             // 身份证号
        payNo: '',              // 第三方支付单号
        identityLevel: '',      // 身份等级
        applyTimeStart: '',     // 申请开始时间
        applyTimeEnd: '',       // 申请结束时间
        payStatus: '',          // 支付状态
        payType: '',            // 付款方式
        payAuditStatus: '',     // 支付状态
        agentRandStr: '',       // 代理级别
        isOpen: '',             // 是否激活
        sortType: 1             // 排序方式
      },
      region: {
        province: {                     // 省
          code: '',
          name: ''
        },
        city: {                         // 市
          code: '',
          name: ''
        },
        area: {                         // 区
          code: '',
          name: ''
        }
        // ,
        // originalPwd: '',                // 原密码
        // newPwd: '',                     // 新密码
        // confirmPwd: ''                  // 确认新密码
      },
      regionSelectKey: '',      // 省市区
      copyFormData: {},         // 拷贝表单数据
      ruleForm: {
        agentRandStr: 1,        // 代理级别
        activate: 1,            // 是否激活账号
        remark: ''              // 不通过原因
      },
      identityLevelData: [],    // 身份等级列表
      activateVisible: false,   // 是否激活账号弹窗
      activateData: {},         // 激活列表数据
      applyData: {},            // 储存申请数据
      applyId: '',              // 申请id
      pageData: {               // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      formDataList: {},
      rules: {
        // 会员姓名
        cardName: [{ validator: validateCardName, trigger: 'blur' }],
        // 会员手机
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        // 身份证号
        idCard: [{ validator: validateIdCard, trigger: 'blur' }],
        // 第三方支付单号
        payNo: [{ validator: validateIdCard, trigger: 'blur' }],
        // 会员身份
        connection: [{ validator: validatePhone, trigger: 'blur' }],
        // 失败原因
        remark: [{ validator: validateRemark, trigger: 'blur' }]
      },
      userInfo: {},             // 用户信息
      parentListData: [],       // 获得上级所有消费会员
      examineData: {},          // 审核数据
      examineVisible: false     // 审核弹框
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    let pathType = this.$route.path.match(/all|notopen|pass|reject/gi)[0]
    switch (pathType) {
      case 'all':
        this.pageType = ''
        break
      case 'notopen':
        this.pageType = 0
        break
      case 'pass':
        this.pageType = 1
        break
      case 'reject':
        this.pageType = 2
        break
    }

    // 获取tab标签类型
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/distribution/apply', (res) => {
      if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
    this.getPartnerList()
  },
  methods: {
    /**
     * 获取列表数据
     * @param  {[type]} type [数据类型，type存在表示获取导出数据]
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/distributeApplyManage/applyList'
        this.loading = true
      } else {
        url = 'distributeApplyManage/exportApplyList'
      }
      let data = {
        start: type ? 1 : this.pageData.currentPage,      // 是 int 当前页
        pageSize: type ? this.pageData.total : this.pageData.pageSize,    // 是 int 每页条数
        sortType: this.formData.sortType,                 // 排序方式
        condition: this.formData.condition,               // 否 Sting 会员姓名、手机号、身份证号
        cardName: this.formData.cardName,                 // 否 Sting 会员姓名
        phone: this.formData.phone,                       // 否 String  电话号码
        idCard: this.formData.idCard,                     // 否 Sting 身份证号
        transactionId: this.formData.payNo,               // 否 Sting 第三方支付单号
        applyIdentityId: this.formData.identityLevel,     // 否 int 申请身份等级
        applyTimeBeign: this.formData.applyTimeStart ? this.$Utils.filterDate(this.formData.applyTimeStart, 'YYYY-MM-DD') : '',      // 否 String  申请时间起始值
        applyTimeEnd: this.formData.applyTimeEnd ? this.$Utils.filterDate(this.formData.applyTimeEnd, 'YYYY-MM-DD') : '',        // 否 String  申请时间结束值
        payType: this.formData.payType,                   // 支付方式
        payStatus: 1,                                     // 否 String  支付状态（0:未支付，1：已支付）
        isOpen: this.pageType !== '' ? parseInt(this.pageType) : this.formData.isOpen    // 否 String  是否激活（0未，1已激活）
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
          // 分页数
          this.pageData.total = results.total
          // 列表数据
          this.tableData = results.list
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
          return false
        }
        this.identityLevelData = resData.data
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
    },

    /**
     * 激活账号前操作
     */
    activateBefore (item) {
      if (item) this.activateData = item
      this.region.province.name = ''
      this.region.province.code = ''
      this.region.city.name = ''
      this.region.city.code = ''
      this.region.area.name = ''
      this.region.area.code = ''
      this.regionSelectKey = Math.random()
      this.activateVisible = true
      this.applyId = this.activateData.id
      this.customerId = this.activateData.customerId
      this.getUserInfo()
      this.getParentList()
    },

    /**
     * 获取申请信息
     */
    getUserInfo () {
      this.$http.get('@ROOT_API/distributeApplyManage/applyInfo', {
        params: {
          applyId: this.applyId
        }
      }).then(res => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        let results = resData.data
        this.applyData = results
        this.region.province.name = results.agentProvince
        this.region.province.code = results.agentProvinceCode
        this.region.city.name = results.agentCity
        this.region.city.code = results.agentCityCode
        this.region.area.name = results.agentZone
        this.region.area.code = results.agentZoneCode
      })
    },

    /**
     * 获取上级列表数据
     */
    getParentList () {
      this.$http.get('@ROOT_API/distributeApplyManage/getFrontsConsumerMemberList', {
        params: {
          userId: this.customerId
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
        resData.data.forEach((row) => {
          row.paymentVoucher = row.paymentVoucher ? row.paymentVoucher.split(',') : row.paymentVoucher ? [row.paymentVoucher] : []
        })
        this.parentListData = resData.data
      })
    },

     /**
     * 查看详情
     */
    // handleViewDetails (row) {
    //   console.log('row: ', row)
    //   if (!row) return false
    //   localStorage.setItem(this.$global.SYSTEM + 'detailsData', JSON.stringify(row))
    //   console.log('row: ', row)
    //   setTimeout(() => {
    //     this.$router.push({path: '/admin/distribution/apply/details', query: {'id': row.id}})
    //   }, 30)
    // },

    /**
     * 审核前操作
     */
    handleExamineBefore (item) {
      this.examineVisible = true
      item.id = item.applyId
      item.customerId = item.userId
      this.examineData = item
    },

    /**
     * 审核失败
     */
    handleExamineError () {
      this.examineVisible = false
      this.activateBefore()
    },

    /**
     * 审核成功
     */
    handleExamineSuccess () {
      this.examineVisible = false
      this.activateBefore(this.examineData)
    },

    /**
     * 查看用户
     */
    handleView (item) {
      this.applyId = item.applyId
      this.customerId = item.userId
      this.getUserInfo()
      this.getParentList()
    },

    /**
     * 激活账号
     */
    activateHandle (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.activateLoading = true
        this.$http.post('@ROOT_API/distributeApplyManage/openApply', {
          applyId: this.applyId,
          isOpen: this.ruleForm.activate,
          openInfo: this.ruleForm.remark,
          agentRand: this.ruleForm.agentRandStr,                   // 否 int （1 市代理，2 区代理）
          agentProvince: this.region.province.name,       // 否 Sting 代理省
          agentProvinceCode: this.region.province.code,   // 否 Sting 代理省编码
          agentCity: this.region.city.name,               // 否 Sting 代理市
          agentCityCode: this.region.city.code,           // 否 Sting 代理市编码
          agentZone: this.region.area.name,               // 否 Sting 代理区
          agentZoneCode: this.region.area.code            // 否 Sting 代理区编码
        }).then(res => {
          let resData = res.data
          if (resData.status !== '1') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.$message({
            message: '提交成功',
            type: 'success',
            duration: 1500
          })
          this.activateVisible = false
          this.getListData()
        }).finally(() => {
          setTimeout(() => {
            this.activateLoading = false
          }, 1000)
        })
      })
    },

    /**
     * 自动补全百分位
     */
    inpBlur (type) {
      this.$Utils.blurAutoCompletion(this.formData, type)
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
     * 省市区数据更新
     */
    regionChange (results) {
      this.region = results
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 清空重置搜索
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      localStorage.removeItem(this.$global.FORM_DATA)
    }
  }
}
</script>

<style lang="less" scoped>
.apply-list-wrap{

  .admin-common-main{
    padding-top: 20px;
  }

  .admin-gray-title{
    margin-bottom: 0;
  }

  .red{
    color: red;
  }
}
</style>

<style lang="less">
.apply-list-wrap{

  .search-head-wrap{
    .el-input__inner{
      width: 250px;
    }

    .sort-type-wrap{
      .el-input__inner{
        width: 150px;
      }
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

  .agent{
    .el-form-item__content{
      margin-left: 0 !important;
    }
  }

  /*----------是否激活弹窗样式-----------*/
  .el-dialog{
    table{
      width: 100%;
      font-size: 15px;
      border-collapse:collapse;
      border: 1px solid #eee;
      margin-bottom: 20px;

      td{
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #eee;
      }

      td:first-child{
        width: 120px;
        text-align: right;
      }
    }

    .el-form-item{
      margin-bottom: 0;
      .el-form-item__content{
        line-height: 20px;
        margin-left: 0 !important;
      }
    }

    .info-table{
      th{
        height: 40px;
        border-bottom: 1px solid #eee;
        background: #eef1f9;
      }

      td{
        text-align: center !important;
        border-left: 1px solid #eee;
      }
    }
  }
}
</style>

