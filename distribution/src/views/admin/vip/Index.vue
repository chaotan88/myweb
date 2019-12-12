<!-- 会员列表 -->
<template>
  <common-tpl class="order-index-wrap vip-index-wrap">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <el-input v-model.trim="formData.condition" placeholder="输入推广大使手机号/姓名" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main" class="senior">
          <el-form ref="form" :rules="rules" :model="formData" label-position="right" label-width="140px" class="search-form">
            <el-form-item label="推广大使姓名：" prop="cardName">
              <el-input v-model.trim="formData.cardName" placeholder="20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="推广大使手机：" prop="customerPhone">
              <el-input v-model.trim="formData.customerPhone" placeholder="手机格式，限11个字符" clearable></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idCard">
              <el-input v-model.trim="formData.idCard" placeholder="仅限输入数字和字母，20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="实名认证：">
              <el-select v-model="formData.cardStatus" placeholder="选择身份认证" style="width: 300px;">
                <el-option label="未认证" value="1"></el-option>
                <el-option label="已认证" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份等级：">
              <el-select v-model="formData.disRuleId" placeholder="选择身份等级" style="width: 300px;">
                <template v-for="item in identityLevelData">
                  <el-option :value="item.id" :label="item.ruleName"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="级别产生方式：">
              <el-select v-model="formData.memberType" size="medium" placeholder="选择会员类型">
                <el-option label="全部" value=""></el-option>
                <el-option label="在线升级" :value="1"></el-option>
                <el-option label="手动升级" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="首锁推荐人：">
              <el-input v-model.trim="formData.invitationName" placeholder="输入推荐人姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="注册时间：" class="pos-r apply-date-wrap">
              <el-col :span="5">
                <el-date-picker type="date" placeholder="年 / 月 / 日" v-model="formData.registerTimeStart" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line ta-c" :span="2">至</el-col>
              <el-col :span="5">
                <el-date-picker type="date" placeholder="年 / 月 / 日" v-model="formData.registerTimeEnd" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="clear"></div>
        </div>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="customerPhone" label="推广大使手机" min-width="120">
          <template slot-scope="scope">{{scope.row.customerPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="ruleName" label="当前身份" min-width="120">
          <template slot-scope="scope">{{scope.row.ruleName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="memberType" label="级别产生方式" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.memberType == 2">手动升级</span>
            <!-- <span v-else-if="scope.row.memberType == 2"></span> -->
            <span v-else>在线升级</span>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="所属地区" min-width="200">
          <template slot-scope="scope">{{scope.row.region | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" width="180"></el-table-column>
        <el-table-column prop="invitationName" label="首锁推荐人" width="120">
          <template slot-scope="scope">{{scope.row.invitationName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" width="180">
          <template slot-scope="scope">{{scope.row.lastLoginTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="cardName" label="身份认证" min-width="120">
          <template slot-scope="scope">{{scope.row.cardStatus | filterCardStatus}}</template>
        </el-table-column>       
        
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="handleBefore(scope.row, 'edit')"><i class="icon el-icon-edit"></i>修改信息</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="handleBefore(scope.row, 'details')"><i class="icon el-icon-view"></i>详情</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.ifUpgrade === 1 && scope.row.rank !== 8 && scope.row.ruleId !== 1">
                    <div @click="handleUpgradeBefore(scope.row)"><i class="icon el-icon-view"></i>账户升级</div>
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
      <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total" @current-change="pageChange" v-if="pageData.total">
      </el-pagination>
    </template>
  </common-tpl>
</template>

<script>
import {filterSex, filterDate} from '@/filters'

export default {
  data () {
    // 会员姓名
    let validateCardName = (rule, value, callback) => {
      if (value && value.length > 20) return callback(new Error('20个字符以内'))
      callback()
    }

    // 验证手机
    let validatePhone = (rule, value, callback) => {
      if ((value && value.match(/\D/g)) || (value && value.length >= 11 && !value.match(/^1\d{10}$/gi))) return callback(new Error('手机号格式错误'))
      callback()
    }

    // 身份证号
    let validateIdCard = (rule, value, callback) => {
      if (value && !value.toString().match(/^[0-9a-zA-Z]{0,20}$/g)) return callback(new Error('仅限输入数字和字母，20个字符以内'))
      callback()
    }

    // 应付金额
    let validateAgent = (rule, value, callback) => {
      if (value && !value.match(/^[0-9]{1,8}([.][0-9]{1,2})?$/gi)) return callback(new Error('请输入正确的代理费，限10个字符'))
      callback()
    }
    return {
      loading: false,           // 加载loading
      highSearchClose: true,    // 高级搜索开/关
      copyFormData: '',         // 清空搜索
      formData: {
        condition: '',          // 查询条件
        cardName: '',           // 会员姓名
        customerPhone: '',      // 会员手机
        idCard: '',             // 身份证号
        cardStatus: '',         // 身份认证 0 认证 1未认证
        identityLevel: '',      // 身份等级
        invitationName: '',     // 首锁推荐人
        registerTimeStart: '',  // 申请时间起始值
        registerTimeEnd: ''     // 申请时间结束值
      },
      identityLevelData: [],    // 身份等级列表
      fxVipDatails: {},         // 详情信息
      tableData: [],            // 列表数据
      pageData: {               // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        // 会员姓名
        cardName: { validator: validateCardName, trigger: 'blur' },
        // 会员手机
        customerPhone: { validator: validatePhone, trigger: 'blur' },
        // 身份证号
        idCard: { validator: validateIdCard, trigger: 'blur' },

        // 代理费低
        agentLowness: { validator: validateAgent, trigger: 'blur' },

        // 代理费高
        agentHigh: { validator: validateAgent, trigger: 'blur' }
      },
      userInfo: {}
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/finance/reflect', (res) => {
      this.formData = res
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
        url = '@ROOT_API/buyMemberAccountManageController/getMemberList'
        this.loading = true
      } else {
        url = 'buyMemberAccountManageController/exportMemberList'
      }
      let data = {
        start: type ? 1 : this.pageData.currentPage,    // 当前页
        pageSize: type ? this.pageData.total : this.pageData.pageSize,    // 每页条数
        condition: this.formData.condition,             // 查询条件
        customerPhone: this.formData.customerPhone,     // 会员手机
        cardName: this.formData.cardName,               // 会员姓名
        memberType: this.formData.memberType,            // 会员类型
        idCard: this.formData.idCard,                   // 否 Sting 身份证号
        invitationName: this.formData.invitationName,   // 首锁推荐人
        cardStatus: this.formData.cardStatus,           // 身份认证 0 认证 1未认证
        disRuleId: this.formData.disRuleId,         // 否 int 身份等级
        registerTimeStart: this.formData.registerTimeStart ? this.$Utils.filterDate(this.formData.registerTimeStart, 'YYYY-MM-DD') : '', // 申请时间起始值
        registerTimeEnd: this.formData.registerTimeEnd ? this.$Utils.filterDate(this.formData.registerTimeEnd, 'YYYY-MM-DD') : ''        // 申请时间结束值
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
            this.pageData.total = 0
            this.tableData = []
            return false
          }
          let results = resData.data
          // 过滤数据显示
          results.list.forEach((row) => {
            let regionArr = []
            if (row.userProvince) regionArr.push(row.userProvince)
            if (row.userCity) regionArr.push(row.userCity)
            if (row.userZone) regionArr.push(row.userZone)
            row.region = regionArr.join(' , ')

            row.registerTime = filterDate(row.registerTime)
            row.sex = filterSex(row.sex)
          })
          this.pageData.total = resData.data.total
          this.tableData = resData.data.list
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
      this.pageChange(1)
    },

    /**
     * 清空重置搜索
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      localStorage.removeItem(this.$global.FORM_DATA)
    },

    /**
     * 自动补全百分位
     */
    inpBlur (type) {
      this.$Utils.blurAutoCompletion(this.formData, type)
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
     * 查看详情 或 修改信息前操作
     */
    handleBefore (item, type) {
      localStorage.setItem(this.$global.SYSTEM + 'VipDatails', JSON.stringify(item))
      this.$router.push('/admin/vip/center/' + type)
    },

    /**
     * 账户升级前操作
     */
    handleUpgradeBefore (row) {
      this.$router.push({
        path: '/admin/vip/center/upgrade',
        query: {userId: row.customerId}
      })
    //  localStorage.setItem(this.$global.SYSTEM + 'VipDatails', JSON.stringify(row))
    }
  }
}
</script>

<style lang="less" scoped>
.vip-index-wrap{
  .w50{
    width: 50%;
    .el-form-item{
      width: 100%;
      .el-form-item__content{
        margin-left: 0 !important;
      }
    }

    .agent{
      .el-form-item__content{
        margin-left: 0 !important;
        /*margin-right: 140px;*/
      }
    }
  }
  .vip-search-wrap{
    width: 20%;
    padding-bottom: 20px;
  }

  .common-table-wrap{
    padding: 0;
    .el-table{
      border: 1px solid #ebeef5;
      border-bottom: none;
    }
  }
}
</style>
<style lang="less">
.vip-index-wrap{

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

  /*-----------搜索框----------*/
  .vip-search-wrap{
    width: 25%;
    padding-bottom: 20px;

    .el-input__inner{
      border-radius: 30px;
    }

    span{
      right: 20px;
      top: 12px;
      cursor:pointer
    }

    span:hover{
      color: #409EFF;
    }
  }

  .agent{
    .el-form-item__content{
      margin-left: 0 !important;
      /*margin-right: 140px;*/
    }
  }

  .senior-item{
    .el-form-item{
      width: 100%;
    }

    .el-form-item__content{
      margin-left: 0 !important;
    }

    .el-date-editor.el-input__inner{
      width: 100%;
    }
  }

  .el-form-item{
    width: 50%;
    float: left;

    .w100{
      .el-form-item__content{
        margin-left: 0 !important;
      }

      .el-input{
        width: 100%;
      }
    }

    .el-select{
      width: 100%;
    }
  }
}
</style>
