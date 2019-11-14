<!-- 开店申请 -->
<template>
  <common-tpl class="manage-index-wrap" :footer="false">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入店铺名称" v-model.trim=formData.condition @keyup.enter.native="searchHandle">
          </el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form ref="form" :rules="rules" :model="formData" label-position="right" label-width="100px" class="search-form">
            <el-form-item label="会员手机" prop="account">
              <el-input v-model.trim="formData.account" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
            <el-form-item label="申请时间" class="pos-r">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择开始时间" v-model="formData.applyTimeStart" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line ta-c" :span="2">至</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择结束时间" v-model="formData.applyTimeEnd" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="主营业务">
              <div class="select-opts">
                <select-opts :id="formData.attributeTypeId" @change="attributeSelect"></select-opts>
              </div>
            </el-form-item>
          </el-form>
          <div class="clear"></div>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="shopName" label="店铺名称"></el-table-column>
        <el-table-column prop="shopType" label="店铺类型">
          <template slot-scope="scope">{{scope.row.shopType | filterShopType}}</template>
        </el-table-column>
        <el-table-column prop="account" label="会员手机号"></el-table-column>
        <el-table-column prop="rankName" label="创客等级"></el-table-column>
        <el-table-column prop="points" label="积分数">
          <template slot-scope="scope">{{scope.row.points || 0}}</template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="180">
          <template slot-scope="scope">{{scope.row.applyTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="contactName" label="联系人"></el-table-column>
        <el-table-column prop="contactPhone" label="联系方式"></el-table-column>
        <el-table-column prop="shopStatus" label="审核状态">
          <template slot-scope="scope">{{scope.row.shopStatus | filterGoodsStatus}}</template>
        </el-table-column>
        <el-table-column prop="attributeTypeName" label="主营业务"></el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="saveHandle(scope.row)"><i class="icon" :class="{'el-icon-edit': parseInt(scope.row.shopStatus) === 1, 'el-icon-view': parseInt(scope.row.shopStatus) !== 1}"></i>{{parseInt(scope.row.shopStatus) === 1 ? '审核' : '详情'}}</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div v-if="scope.row.shopStatus === '3'" @click="handleReject(scope.row)"><i class="icon el-icon-info"></i>不通过原因</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
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
      <!-- 不通过原因提示 -->
      <el-dialog title="不通过原因" :visible.sync="rejectVisible" width="480px">
        {{ rejectReasion }}
        <span slot="footer" class="dialog-footer">
          <el-button @click="rejectVisible = false">取 消</el-button>
          <el-button type="primary" @click="rejectVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    // 验证手机
    let validatePhone = (rule, value, callback) => {
      if (!value) callback(new Error('请输入手机号'))
      let reg = /^1\d{10}$/gi
      if (!value.toString().match(reg)) callback(new Error('手机号格式错误'))
      callback()
    }
    return {
      highSearchClose: true,    // 高级搜索开/关
      pageType: '',             // 页面类型［null/全部，1／待审核，2／审核通过，3／审核驳回］
      // 列表数据
      tableData: [],
      formData: {
        account: '',
        applyTimeStart: '',
        applyTimeEnd: '',
        attributeTypeId: null,  // 主营业务id
        condition: ''
      },
      copyFormData: '',
      rejectVisible: false,     // 不通过原因弹框
      rejectReasion: '申请信息不符合要求',          // 不通过原因
      rejectId: '',             // 不通过id
      pageData: {               // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        // 会员手机
        tel: { validator: validatePhone, trigger: 'blur' },
        // 会员身份
        connection: { validator: validatePhone, trigger: 'blur' }
      }
    }
  },
  mounted () {
    if (this.$route.path.match(/wait/gi)) {
      this.pageType = 1
    } else if (this.$route.path.match(/pass/gi)) {
      this.pageType = 2
    } else if (this.$route.path.match(/reject/gi)) {
      this.pageType = 3
    }

    // 获取tab标签类型
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType')
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/mall/manage/index', (res) => {
      if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
    })

    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.tableData.map((row) => {
      row.status = this.pageType
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.formData.applyTimeStart = this.$Utils.filterDate(this.formData.applyTimeStart)
      this.formData.applyTimeEnd = this.$Utils.filterDate(this.formData.applyTimeEnd)
      // this.$router.push({query: {page: this.pageData.currentPage}})
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      this.$http.post('@ROOT_API/shopManageController/getShopList', Object.assign({
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        isAudit: this.pageType
      }, this.formData)).then((res) => {
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
      })
    },

    /**
     * 点击审核/详情存储本地列表
     */
    saveHandle (item) {
      localStorage.setItem('OPEN_STORE', JSON.stringify(item))
      item.shopStatus === '1' ? this.$router.push('/admin/mall/manage/check') : this.$router.push('/admin/mall/manage/details')
    },

    /**
     * 高级搜索时间类型选择
     */
    commandHandle (command) {
      this.formData.timeType = command
      this.formData.timeTypeMsg = parseInt(command) === 1 ? '新增时间' : '上下架时间'
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
     * 主营业务select
     */
    attributeSelect (val) {
      this.formData.attributeTypeId = val ? parseInt(val.id) : null
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
        this.pageData.currentPage = 1
        this.pageChange(1)
      })
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageData.currentPage = 1
      this.getListData()
    },

    /**
     * 清空重置搜索
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      localStorage.removeItem(this.$global.FORM_DATA)
    },

    /**
     * 不通过原因
     */
    handleReject (row) {
      this.rejectVisible = true
      this.rejectReasion = row.description
    }
  }
}
</script>

<style lang="less" scoped>
.manage-index-wrap{

  .search-form{

    .select-opts{
      width: 440px;
    }

    .el-form-item{
      width: 50%;
      float: left;

      .el-input, .el-select, .el-date-editor{
        width: 440px;
      }

      .time-type-wrap{
        width: 100px;
        padding-right: 10px;
        box-sizing: border-box;
        left: -100px;
      }
    }
  }
  .admin-common-main{
    padding-top: 20px;
  }
}
</style>
<style lang="less">
.manage-index-wrap{
  .el-form-item__content{
    width: 440px;
  }
}
</style>

