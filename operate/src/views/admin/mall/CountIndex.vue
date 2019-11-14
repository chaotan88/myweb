<template>
  <common-tpl class="count-index-wrap">
    <!-- 头部 -->
    <template slot="header">
      <!-- 统计 -->
      <div class="classify-count-table">
        <table width="100%">
          <tr>
            <td><h2>{{totalTurnover || '0.00'}}</h2></td>
            <td><h2>{{totalOrder || 0}}</h2></td>
          </tr>
          <tr>
            <td>总营收（元）</td>
            <td>订单数</td>
          </tr>
        </table>
      </div>

      <!-- 高级搜索 -->
      <high-search @search="highSearch('formData')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入订单号/会员手机" v-model.trim="condition" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form ref="formData" :model="formData" label-width="180px" class="search-form">
            <el-form-item label="订单金额：" label-width="120px" class="form-item">
              <el-form-item prop="orderMoney1">
                <el-input placeholder="输入订单金额" v-model.trim="formData.orderAmountStart"></el-input>
              </el-form-item>
              <span class="fl-l" style="padding: 0 4px;">-</span>
              <el-form-item prop="orderMoney2">
                <el-input placeholder="输入订单金额" v-model.trim="formData.orderAmountEnd"></el-input>
              </el-form-item>
            </el-form-item>
            <!--<el-form-item label="消费用户（会员手机）：" prop="phone">-->
              <!--<el-input v-model="formData.phone" placeholder="请输入手机号"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="消费时间：" prop="time" label-width="120px" class="form-item">
              <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="请选择日期" v-model="formData.orderTimeStart"></el-date-picker>
              </el-form-item>
              <span class="fl-l" style="padding: 0 4px;">-</span>
              <el-form-item prop="date2">
                <el-date-picker type="date" placeholder="请选择日期" v-model="formData.orderTimeEnd"></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-form>
          <div class="clear"></div>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" class="main-table" style="width: 100%">
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="orderAmount" label="订单金额（元）"></el-table-column>
        <el-table-column prop="memberPhone" label="消费用户（会员手机）"></el-table-column>
        <el-table-column prop="orderTime" label="消费时间">
          <template slot-scope="scope">{{scope.row.orderTime | filterDate}}</template>
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

    <!-- 底部 -->
    <template slot="footer">
      <el-button @click="$router.back()">返回</el-button>
    </template>

    <template slot="other">
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        totalTurnover: '0.00',  // 总营收
        totalOrder: 0,          // 订单数
        highSearchClose: true,  // 高级搜索开/管
        // 搜索表格数据
        formData: {
          orderTimeStart: '',
          orderTimeEnd: '',
          orderAmountStart: '',
          orderAmountEnd: ''
        },
        condition: '',
        shopId: null,
        copyFormData: '',
        // 列表数据
        tableData: [],
        pageData: {             // 分页
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    mounted () {
      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData('/admin/mall/authentication/count/index', (res) => {
        this.formData = res
      })
      this.shopId = this.$route.query.id
      this.pageData.currentPage = this.$route.query.page && parseInt(this.$route.query.page) || 1
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      this.getListData(this.shopId)
      this.getOrderData(this.shopId)
    },
    methods: {
      /**
       * 获取列表数据
       */
      getListData () {
        this.formData.orderTimeStart = this.$Utils.filterDate(this.formData.orderTimeStart)
        this.formData.orderTimeEnd = this.$Utils.filterDate(this.formData.orderTimeEnd)
        // this.pageData.currentPage !== 1 && this.$router.push({query: {page: this.pageData.currentPage, id: this.shopId}})
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
        this.$http.post('@ROOT_API/shopManageController/shopStaticDataList', Object.assign({
          shopId: this.shopId,
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          condition: this.condition
        }, this.formData)).then(res => {
          let resData = res.data
          if (resData.status !== '1') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            if (resData.data === null) this.tableData = []
            return false
          }
          // 分页数
          this.pageData.total = resData.data.total
          this.tableData = resData.data.list
        })
      },

      /**
       * 获取总营收和订单数
       */
      getOrderData (id) {
        this.$http.post('@ROOT_API/shopManageController/shopStaticData', {
          shopId: id
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
          this.totalTurnover = resData.data.data.totalTurnover
          this.totalOrder = resData.data.data.totalOrder
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
          this.pageData.currentPage = 1
          this.getListData()
        })
      },

      /**
       * 搜索
       */
      searchHandle () {
        this.pageData.currentPage = 1
        this.pageChange(1)
      },

      /**
       * 清空
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
          this.pageData.currentPage !== 1 && this.$router.push({query: {page: this.pageData.currentPage, id: this.shopId}})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .count-index-wrap {

    .search-form{

      .el-form-item{
        /*width: 50%;*/
        float: left;

        .el-input, .el-date, .el-date-editor{
          width: 280px;
        }

        .time-type-wrap{
          width: 100px;
          padding-right: 10px;
          box-sizing: border-box;
          left: -100px;
        }
      }

      .form-item{
        margin-right: 100px;
      }
    }

    .classify-count-table {
      padding: 10px 0;
      background: #fff;
      margin-bottom: 20px;

      table {
        border-collapse: collapse;
        text-align: center;

        tr:first-child td {
          padding-top: 30px;
        }

        tr:last-child td {
          padding-bottom: 30px;
        }

        td {
          width: 50%;
          padding: 5px 0;
        }

        td:first-child {
          border-right: 1px solid #6c6c6c;
        }
      }
    }

    position: relative;

    .main-table th:last-child,.main-table td:last-child {
      border: none;
    }

  }

</style>
