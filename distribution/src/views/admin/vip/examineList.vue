<!-- 会员列表 -->
<template>
  <common-tpl class="order-index-wrap vip-index-wrap">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :close="highSearchClose" :textVisible="false">
        <div class="pos-r" slot="search">
          <el-input v-model.trim="formData.phone" placeholder="输入申请人手机号" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column fixed prop="customerPhone" label="申请编号" min-width="170">
          <template slot-scope="scope">{{scope.row.upgradeNo}}</template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="会员手机" min-width="120">
          <template slot-scope="scope">{{scope.row.userPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="申请日期" width="180">
          <template slot-scope="scope">{{scope.row.upgradeTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="ruleName" label="当前会员身份" min-width="120">
          <template slot-scope="scope">{{scope.row.currentRankName | filterEmpty }}</template>
        </el-table-column>
        <el-table-column prop="region" label="申请成为" min-width="120">
          <template slot-scope="scope">{{scope.row.rankName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="cardName" label="升级金额（元）" min-width="120">
          <template slot-scope="scope">{{scope.row.upgradeAmount | filterMoney | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="invitationName" label="抵扣金额" width="120">
          <template slot-scope="scope">{{scope.row.deductionAmount | filterMoney | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="inviterInvitationCode" label="审核状态" width="120">
          <template slot-scope="scope">{{scope.row.dealWithStatus | filterDealWith}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <template v-if="scope.row.dealWithStatus !== 1">
                    <el-dropdown-item>
                      <div @click="handleBefore(scope.row)"><i class="icon el-icon-view"></i>详情</div>
                    </el-dropdown-item>
                  </template>
                  <template v-else>
                    <el-dropdown-item>
                      <div @click="handleBefore(scope.row)"><i class="icon el-icon-edit-outline"></i>审核</div>
                    </el-dropdown-item>
                  </template>
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

export default {
  data () {
    return {
      loading: false,           // 加载loading
      pageType: '',            // 页面类型 [0、全部 1、待处理 2、已处理 3、回退]
      highSearchClose: true,    // 高级搜索开/关
      copyFormData: '',         // 清空搜索
      formData: {
        dealWithStatus: '',      // 申请状态
        phone: ''                // 申请人手机号
      },
      identityLevelData: [],    // 身份等级列表
      fxVipDatails: {},         // 详情信息
      tableData: [],            // 列表数据
      pageData: {               // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {}              // 用户信息
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.formData.dealWithStatus = this.$route.meta.dealWithStatus
    let pathType = this.$route.path.match(/index|stay|adopt|regression/gi)[0]
    switch (pathType) {
      case 'index':
        this.pageType = ''
        break
      case 'stay':
        this.pageType = 1
        break
      case 'adopt':
        this.pageType = 2
        break
      case 'regression':
        this.pageType = 3
        break
    }
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/finance/reflect', (res) => {
      if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     * @param  {[type]} type [数据类型，type存在表示获取导出数据]
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/buyMemberAccountManageController/getUpgradeList'
        this.loading = true
      } else {
        url = 'distributeApplyManage/exportPayAuditList'
      }
      let data = {
        dealWithStatus: this.pageType,           // 否 int 审核状态（1：待审核 2：审核通过 3：已打回 ）
        phone: this.formData.phone,                // 否 string  申请编号
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
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
          this.pageData.total = results.total
          results.list.forEach((row) => {
            row.paymentVoucher = row.paymentVoucher ? row.paymentVoucher.split(',') : row.paymentVoucher ? [row.paymentVoucher] : []
          })
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
    // getListData () {
    //   this.loading = true
    //   var parm = {
    //     start: this.pageData.currentPage,
    //     pageSize: this.pageData.pageSize
    //   }
    //   if (this.formData.dealWithStatus) {
    //     parm.dealWithStatus = this.formData.dealWithStatus       // 审核状态（1：待审核 2：审核通过 3：已打回 ）
    //   }
    //   if (this.formData.phone) {
    //     parm.phone = this.formData.phone      // 申请编号
    //   }
    //   this.$http.post('@ROOT_API/buyMemberAccountManageController/getUpgradeList', parm
    //   ).then((res) => {
    //     let resData = res.data
    //     if (parseInt(resData.status) !== 1) {
    //       this.$message({
    //         message: resData.msg,
    //         type: 'error',
    //         duration: 1500
    //       })
    //       this.tableData = []
    //       this.pageData.total = 0
    //       return false
    //     }
    //     let results = resData.data
    //     this.tableData = results.list
    //     results.list.forEach((row) => {
    //       if (row.paymentVoucher) row.paymentVoucher = row.paymentVoucher.split(',')
    //     })
    //     this.pageData.total = results.total
    //   }).finally(() => {
    //     this.loading = false
    //   })
    // },

    /**
     * 查看详情 或 修改信息前操作
     */
    handleBefore (item) {
      this.$router.push({path: '/admin/vip/upgrade/audit/details', query: {upgradeId: item.upgradeId}})
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
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
