<!-- 订单管理 -->
<template>
  <common-tpl class="operation-order-index-wrap" footer back>
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle">
        <div class="pos-r" slot="retailers">
          
        </div>
        <div class="pos-r" slot="search">
          <div class="d-ib pos-r">
            <el-input placeholder="输入订单编号" v-model.trim="formData.orderNo" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
        </div>
        <div slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData">
            <el-form-item label="订单编号: ">
              <el-input placeholder="请输入订单编号" v-model.trim="formData.orderNo" clearable></el-input>
            </el-form-item>
            <el-form-item label="买家手机号: " prop="phone">
              <el-col :span="11">
                <el-input v-model.trim="formData.phone" placeholder="请输入手机号" maxlength="11" clearable></el-input>
              </el-col>
            </el-form-item>
            <!-- <el-form-item label="会议名称：">
              <el-input v-model.trim="formData.meetingName" placeholder="请输入会议名称" clearable></el-input>
            </el-form-item> -->
            <el-form-item label="下单时间: ">
              <el-date-picker type="datetimerange" start-placeholder="选择开始时间" end-placeholder="选择结束时间" v-model="formData.orderDate"></el-date-picker>
              <!-- <el-col :span="11"> -->
              <!-- </el-col> -->
              <!-- <el-col class="line ta-c" :span="2">至</el-col>
              <el-col :span="11">
                <el-date-picker type="datetime" placeholder="选择结束时间" v-model="formData.endTime" style="width: 100%;"></el-date-picker>
              </el-col> -->
            </el-form-item>
            <el-form-item label="购买会员：">
              <el-input v-model.trim="formData.cardName" placeholder="请输入买家姓名" clearable></el-input>
            </el-form-item>
            <!-- <template>
              <el-form-item label="支付状态">
                <el-radio-group v-model="formData.payStatus">
                  <template v-for="item in payStatusList">
                    <div class="d-ib" @click="handlePayStatus(item)">
                      <el-radio :label="item.label" :key="item.label">{{item.text}}</el-radio>
                    </div>
                  </template>
                </el-radio-group>
              </el-form-item>
            </template> -->
            <template>
              <el-form-item label="支付方式">
                <el-radio-group v-model="formData.payType">
                  <template v-for="item in payTypeList">
                    <div class="d-ib" @click="handlePayType(item)">
                      <el-radio :label="item.label" :key="item.label">{{item.text}}</el-radio>
                    </div>
                  </template>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="orderNo" label="订单编号" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="supplierName" label="会议名称" width="150" v-if="formData.orderType !== 2">
          <template slot-scope="scope">{{scope.row.meetingName | filterEmpty}}</template>
        </el-table-column> -->
        <el-table-column prop="supplierName" label="购买会员" width="150" v-if="formData.orderType !== 2">
          <template slot-scope="scope">{{scope.row.userName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="phone" label="买家手机号">
          <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="payStatus" label="支付状态">
          <template slot-scope="scope">{{scope.row.payStatus | filterPayStatus}}</template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式">
          <template slot-scope="scope">{{scope.row.payType | filterPayType}}</template>
        </el-table-column>
        <el-table-column label="门票售价">
          <template slot-scope="scope">{{scope.row.ticketPrice | filterMoney | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="购买数量">
          <template slot-scope="scope">{{scope.row.ticketNum | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="实收金额">
          <template slot-scope="scope">{{scope.row.totalAmount | filterMoney | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="orderTime" label="下单时间" width="170">
          <template slot-scope="scope">{{scope.row.orderTime | filterDate}}</template>
        </el-table-column>
        
        <!-- <template v-if="formData.orderType === 1"> -->
          <el-table-column fixed="right" label="操作" width="60">
            <template slot-scope="scope">
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="$router.push({path: '/admin/operation/ticket/order/details', query: {id: scope.row.id}})"><i class="icon el-icon-view"></i>详情</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        <!-- </template> -->

        <!-- 暂无数据 -->
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

  </common-tpl>
</template>

<script>
export default {
  data () {
    // 验证手机
    let validatePhone = (rule, value, cb) => {
      let reg = /^\d{0,11}$/gi
      if (value && !value.toString().match(reg)) return cb(new Error('手机格式错误'))
      cb()
    }
    return {
      loading: false,       // loading
      pageType: '',         // 页面类型［''、全部，1、待付款，2、待发货，3、待收货，4、待评价，5、已完成，6、平台关闭，7、取消订单］
      orderId: '',          // 订单id
      formData: {
        orderNo: '',        // 会议名称/订单编号
        phone: '',  // 买家手机号
        meetingName: '',    // 会议名称
        orderDate: [],      // 下单时间
        startTime: '',      // 开始时间
        endTime: '',        // 结束时间
        cardName: '',            // 购买会员
        payStatus: '',      // 支付状态
        payType: ''         // 支付方式
      },
      rules: {
        phone: { validator: validatePhone, trigger: 'blur' }
      },

      payStatusList: [
        {label: 2, text: '已支付'},
        {label: 1, text: '未支付'}
        // ,
        // {label: 3, text: '已退款'}
      ],
      payTypeList: [
        {label: 2, text: '支付宝支付'},
        {label: 1, text: '微信支付'}
        // ,
        // {label: 3, text: '线下支付'},
        // {label: 4, text: '余额支付'}
      ],
      tableData: [],                // 列表数据
      copyFormData: {},             // 拷贝数据
      tableSelectionData: [],       // 多选结果集合

      pageData: {                   // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },

      userInfo: {}                 // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.orderId = parseInt(this.$route.query.id)
    this.pageData.currentPage = parseInt(this.$route.query.page)
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/operation/ticket/order', (res) => {
      this.formData = res
    })
    if (this.orderId) this.getListData()
  },

  methods: {
    /**
     * 获取列表数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        this.loading = true
        url = '@ROOT_API/meetingTicketOrder/getMeetingTicketOrderPage'
      } else {
        url = 'meetingTicketOrder/exportMeetingTicketOrderList'
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        mettingId: this.orderId,                 // 是 int 票务主键
        orderNo: this.formData.orderNo,          // 否 string  订单编号
        phone: this.formData.phone,              // 否 string  会员手机号
        meetingName: this.formData.meetingName,  // 否 string  会议名称
        userName: this.formData.cardName,        // 否 string  会员名称
        payStatus: this.formData.payStatus,      // 否 int 支付状态
        orderTimeStart: this.formData.orderDate.length ? this.$Utils.filterDate(this.formData.orderDate[0]) : '', // 否 datetime  下单开始时间
        orderTimeEnd: this.formData.orderDate.length ? this.$Utils.filterDate(this.formData.orderDate[1]) : '',   // 否 datetime  下单结束时间
        payType: this.formData.payType           // 是 int 支付方式
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
          this.pageData.total = results.total
          this.tableData = results.list
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        for (let key in data) {
          filterParams.push(key + '=' + data[key])
        }
        window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
      }
    },

    /**
     * 支付状态选择
     */
    handlePayStatus (val) {
      this.formData.payStatus = this.formData.payStatus === val ? '' : val
    },

    /**
     * 支付方式选择
     */
    handlePayType (val) {
      this.formData.payType = this.formData.payType === val ? '' : val
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * table多选
     */
    handleSelectGoods (selection, row) {
      this.tableSelectionData = selection
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
        this.$router.push({query: {id: this.$route.query.id, page: this.pageData.currentPage}})
      }
    },

    /**
     * 重置表单
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      localStorage.removeItem(this.$global.FORM_DATA)
    }
  }
}
</script>

<style lang="less" scoped>
.operation-order-index-wrap{

  /*----------------搜索-----------*/
  .search-wrap{
    .el-form-item{
      .el-radio-group{
        div{
          margin-right: 20px;
        }
      }
    }

    .el-dropdown{
      width: 80px;
      top: 0;
      left: -80px;
    }
  }

}
</style>

<style lang="less">
.operation-order-index-wrap{

  .confirm-pay-dialog.max{
    .el-upload--picture-card{
      display: none;
    }
  }

  .retailers-wrap{
    padding-right: 10px;
    .el-form-item{
      width: 200px;
      margin-bottom: 0 !importants;

      .el-form-item__content{
        margin-left: 0 !important;
      }

      .el-input--suffix .el-input__inner{
        width: 100%;
        border-radius: 30px;
      }
    }
  }

  .high-search-down .btn-wrap{
    margin-top: 0;
  }
}

.search-wrap .high-search-down .btn-wrap{
  margin-top: 0;
}

</style>
