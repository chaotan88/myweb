<!-- 赠送记录 -->
<template>
  <common-tpl class="gift-record-wrap">
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle" :textVisible="false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入交易编号/手机号" v-model.trim="formData.orderNo" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <!-- <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
            <el-form-item label="会员姓名：" prop="userName">
              <el-input v-model.trim="formData.userName" placeholder="20个字符以内" maxlength="20" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员手机号：" prop="phone" clearable>
              <el-col :span="11">
                <el-input v-model.trim="formData.phone" placeholder="手机格式，限制11个字符" maxlength="11" clearable></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </div> -->
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main" v-loading="loading">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="交易编号">
          <template slot-scope="scope">{{scope.row.orderNo | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="会员手机">
          <template slot-scope="scope">{{scope.row.customerPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="交易时间">
          <template slot-scope="scope">{{scope.row.addTime | filterDate | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="交易类型">
          <template slot-scope="scope">{{scope.row.propertyType | filterTransactionype | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="交易内容">
          <template slot-scope="scope">{{scope.row.addSource | filterRuleTypeRecord | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="交易额">
          <template slot-scope="scope">{{scope.row.propertyAmount | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="账户结余">
          <template slot-scope="scope">{{scope.row.customerAmount | filterEmpty}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="detailsHandle(scope.row)"><i class="el-icon-view"></i> 详情</div>
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
      <!-- 详情 -->
      <el-dialog
        title="交易记录"
        :visible.sync="detailsVisible"
        width="30%">
        <span>
          <dl>
            <dt class="pos-a">交易编号：</dt>
            <dd>{{detailsData.orderNo | filterEmpty}}</dd>
          </dl>
          <dl>
            <dt class="pos-a">会员手机：</dt>
            <dd>{{detailsData.customerPhone | filterEmpty}}</dd>
          </dl>
          <dl>
            <dt class="pos-a">交易时间：</dt>
            <dd>{{detailsData.addTime | filterDate | filterEmpty}}</dd>
          </dl>
          <dl>
            <dt class="pos-a">账户结余：</dt>
            <dd>{{detailsData.customerAmount | filterMoney | filterEmpty}}</dd>
          </dl>
          <dl>
            <dt class="pos-a">交易类型：</dt>
            <dd>{{detailsData.propertyType | filterTransactionype  | filterEmpty}}</dd>
          </dl>
          <dl>
            <dt class="pos-a">交易额：</dt>
            <dd>{{detailsData.propertyAmount | filterMoney | filterEmpty}}</dd>
          </dl>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="detailsVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    // 验证手机
    let validatePhone = (rule, value, cb) => {
      let reg = /^1\d{0,10}$/gi
      if (value && !value.toString().match(reg)) return cb(new Error('手机格式错误'))
      cb()
    }

    return {
      loading: false,
      formData: {
        loading: false,
        orderNo: '',       // 高级搜索名称
        userName: '',      // 会员姓名
        phone: ''          // 会员手机号
      },
      detailsVisible: false,  // 详情弹窗
      detailsData: {},        // 详情数据
      rules: {
        phone: { validator: validatePhone, trigger: 'blur' }
      },
      tableData: [],
      copyFormData: {},     // 拷贝
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
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/operation/interactive/record', (res) => {
      this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },

  methods: {
    /**
     * 列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/shareTheme/getListByGoldBeanRuleLog', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        orderNo: this.formData.orderNo,                     // 交易编号
        userName: this.formData.userName,                   // 用户名称
        phone: this.formData.phone                          // 用户手机号
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.orderTableData = []
          this.pageData.total = 0
          return false
        }
        this.tableData = resData.data.list
        this.orderTableData = resData.data.list
        this.pageData.total = resData.data.total
      }).finally(() => {
        this.loading = false
      })
    },

    detailsHandle (row) {
      this.detailsVisible = true
      this.detailsData = row
      console.log('detailsData', this.detailsData)
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 重置表单
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
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


  /*----------------发货----------*/
  .el-dialog {
    .el-dialog__body {
      text-align: left;
      padding: 30px 40px;

      dl{
        dt{
          line-height: 35px;
          font-size: 16px;
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

  /* -------------------- { 确认支付 } -------------------- */
  .confirm-pay-dialog {
    h2 {
      font-size: 20px;
      margin-bottom: 30px;

      strong {
        color: red;
      }
    }

    .tips {
      color: #999;
      font-size: 14px;
      margin-top: 10px;
    }

    .confirm-pay-btns {
      padding-top: 50px;

      .el-button {
        margin: 0 20px;
      }
    }
  }

  .confirm-pay-dialog.max {
    .el-upload--picture-card {
      display: none;
    }
  }

  /* -------------------- { 查看物流 } -------------------- */
  .el-dialog {
    .el-dialog__header {
      text-align: left;
    }

    .logistics-msg-wrap {
      padding-left: 140px;

      .logistics-title {
        color: #feae34;
        font-size: 15px;
        margin-left: -56px;

        p {
          margin-bottom: 5px;
        }

        span {
          color: #999;
        }
      }

      .el-step.is-vertical:first-child {
        .el-step__icon {
          color: #fff;
          padding: 5px;
          background: #fe9a01;
        }

        .icon {
          fill: #fff;
        }
      }

      .phone-color {
        span {
          color: #feae34;
        }
      }

      .el-step__line {
        width: 1px;
        border-left: 1px dashed #dfdfdf;
        background: none;
      }

      .logistics-number {
        color: #feae34;
      }

      .el-step__main {
        position: relative;

        .el-step__title {
          line-height: 20px;
          font-weight: normal;
          font-size: 15px;
          position: absolute;
          left: -140px;
          top: -8px;

          strong {
            color: #666;
            margin-bottom: 3px;
          }

          p {
            color: #c0c4cc;
            font-size: 14px;
          }
        }

        .el-step__description {
          color: #c0c4cc;
          line-height: 30px;
          font-size: 15px;
          margin-top: -3px;
          padding-bottom: 30px;
        }

        .el-step__title {
          width: 100px;
          text-align: right;
        }
      }

      .el-step__icon.is-text {
        border: none;
      }

      .el-step__icon {
        color: #999;
        background: #d0d0d0;
        padding: 3px;
      }

      .icon {
        fill: #999;
      }
    }
  }
}

.search-wrap .high-search-down .btn-wrap {
  margin-top: 0;
}
</style>
