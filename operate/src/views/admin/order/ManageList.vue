<!-- 订单管理 -->
<template>
  <common-tpl class="order-index-wrap">
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle">
        <div class="pos-r" slot="search">
          <div class="d-ib" style="margin-right: 5px;">
            <supplier-select text="" :id="formData.supplierId" @change="supplierChange"></supplier-select>
          </div>
          <div class="d-ib pos-r">
            <el-input placeholder="输入订单编号" v-model.trim="formData.orderNo" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
        </div>
        <div slot="edit">
          <template v-if="deliveryPageType === 1">
            <el-button :disabled="!tableData.length" @click="$router.push({path: '/admin/order/self/delivery/bulk', query: {id: 11}})">批量发货</el-button>
          </template>
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData">
            <el-form-item label="订单编号">
              <el-input placeholder="请输入订单编号" v-model.trim="formData.orderNo" clearable></el-input>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-col :span="11">
                <el-date-picker type="datetime" placeholder="选择开始时间" v-model="formData.startTime" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line ta-c" :span="2">至</el-col>
              <el-col :span="11">
                <el-date-picker type="datetime" placeholder="选择结束时间" v-model="formData.endTime" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="买家姓名">
              <el-input v-model.trim="formData.cardName" placeholder="请输入买家姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="买家手机号" prop="customerPhone">
              <el-col :span="11">
                <el-input v-model.trim="formData.customerPhone" placeholder="请输入手机号" maxlength="11" clearable></el-input>
              </el-col>
            </el-form-item>
            <template v-if="!isFinanceExamine">
              <el-form-item label="订单状态">
                <el-select v-model="formData.orderStatusCopy" placeholder="请选择订单状态" clearable>
                  <el-option label="待付款" :value="1"></el-option>
                  <el-option label="待发货" :value="2"></el-option>
                  <el-option label="待收货" :value="3"></el-option>
                  <el-option label="待评价" :value="4"></el-option>
                  <el-option label="已完成" :value="5"></el-option>
                  <el-option label="已关闭" :value="6"></el-option>
                  <el-option label="已取消" :value="7"></el-option>
                  <el-option label="已退款" :value="9"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <!-- <el-form-item label="供应商名称">
              <supplier-select text="" :id="formData.supplierId" @change="supplierChange"></supplier-select>
            </el-form-item> -->
            <template v-if="pageType === '' && !isFinanceExamine">
              <el-form-item label="支付状态">
                <el-radio-group v-model="formData.payStatus">
                  <template v-for="item in payStatusList">
                    <div class="d-ib" @click="handlePayStatus(item)">
                      <el-radio :label="item.label" :key="item.label">{{item.text}}</el-radio>
                    </div>
                  </template>
                </el-radio-group>
              </el-form-item>
            </template>
            <template v-if="!isFinanceExamine">
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
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中" @select="handleSelectGoods" @select-all="handleSelectGoods">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="orderNo" label="订单编号" min-width="180">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" min-width="150" v-if="formData.orderType !== 2">
          <template slot-scope="scope">{{scope.row.supplierName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="shopName" label="店铺名称" v-if="formData.orderType === 2"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" min-width="100">
          <template slot-scope="scope">{{scope.row.orderStatus | filterOrderStatus | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="cardName" label="买家姓名" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.cardName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="买家手机号" min-width="120"></el-table-column>
        <el-table-column prop="payStatus" label="支付状态" min-width="120">
          <template slot-scope="scope">{{scope.row.payStatus | filterPayStatus | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" min-width="120">
          <template slot-scope="scope">
            {{scope.row.payType | filterPayType | filterEmpty}}
          </template>
        </el-table-column>
        <el-table-column label="实收款" width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.orderStatus === 1">--</template>
            <template v-else>
              <div>¥{{scope.row.orderTotalAmount}}</div>
              <div>含运费：{{scope.row.logisticsAmount}}</div>
            </template>
          </template>
        </el-table-column>

        <el-table-column prop="whetherUsePoints" label="消费积分兑换" width="120" v-if="isFinanceExamine">
          <template slot-scope="scope">{{scope.row.whetherUsePoints | filterWhetherUsePoints}}</template>
        </el-table-column>
        <el-table-column prop="usedPoints" label="实收消费积分" width="120" v-if="isFinanceExamine">
          <template slot-scope="scope">{{scope.row.usedPoints || 0}}</template>
        </el-table-column>
        <el-table-column prop="orderTime" label="下单时间" width="170">
          <template slot-scope="scope">{{scope.row.orderTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="payTime" label="支付时间" width="170">
          <template slot-scope="scope">{{scope.row.payTime | filterDate}}</template>
        </el-table-column>

        <!-- <template v-if="formData.orderType === 1"> -->
          <el-table-column fixed="right" label="操作" width="60">
            <template slot-scope="scope">
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="isFinanceExamine && scope.row.orderStatus === 1 && scope.row.payStatus !== 5">
                    <div @click="handleExamine(scope.row)"><i class="icon el-icon-edit"></i>审核</div>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item v-if="scope.row.payType === 3 && scope.row.orderStatus < 2 && !isFinanceExamine">
                    <div @click="confirmPayTips(scope.row)"><i class="icon el-icon-circle-check-outline"></i>确认支付</div>
                  </el-dropdown-item> -->
                  <el-dropdown-item v-if="scope.row.orderStatus === 0 || scope.row.orderStatus === 2 && !isFinanceExamine">
                    <div @click="$router.push({path: $route.path.match(/supply/gi) ? '/admin/order/supply/details' : '/admin/order/self/details', query: {id: scope.row.orderId}})"><i class="icon el-icon-sold-out"></i>发货</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.orderStatus === 3 && !isFinanceExamine">
                    <div v-loading='loading' @click="logisticsBeforeHandle(scope.row)"><i class="icon el-icon-location-outline"></i>查看物流</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.orderStatus === 2 || scope.row.orderStatus === 3 && !isFinanceExamine">
                    <div @click="$router.push({path: '/admin/order/self/modify', query: {id: scope.row.orderId}})"><i class="icon el-icon-tickets"></i>修改订单</div>
                  </el-dropdown-item>
                <!--  <el-dropdown-item v-if="scope.row.orderStatus === 2 && scope.row.orderSource !== 2 || scope.row.orderStatus === 3 && !isFinanceExamine && scope.row.orderSource !== 2 ">
                    <div @click="cancelBefore(scope.row)"><i class="icon el-icon-tickets"></i>取消订单</div>
                  </el-dropdown-item>-->
<!--                   <el-dropdown-item v-if="scope.row.orderStatus === 2 && scope.row.orderSource !== 2 && scope.row.orderSource !== 9 || scope.row.orderStatus === 3 && scope.row.orderSource !== 2 && scope.row.orderSource !== 9 && !isFinanceExamine">
                    <div @click="cancelBefore(scope.row)"><i class="icon el-icon-tickets"></i>取消订单</div>
                  </el-dropdown-item>-->
                  <template v-if="!isFinanceExamine">
                    <el-dropdown-item>
                      <div @click="$router.push({path: $route.path.match(/supply/gi) ? '/admin/order/supply/details' : '/admin/order/self/details', query: {id: scope.row.orderId}})"><i class="icon el-icon-view"></i>详情</div>
                    </el-dropdown-item>
                  </template>
                  <template v-else>
                    <el-dropdown-item v-if="scope.row.payStatus > 1 && scope.row.payStatus !== 4 || scope.row.orderStatus !== 1 && pageType !== 4">
                      <div @click="$router.push({path: '/admin/finance/order/details', query: {id: scope.row.orderId}})">
                        <i class="icon el-icon-view"></i>详情
                      </div>
                    </el-dropdown-item>
                  </template>
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

    <template slot="other">
      <!-- 确认支付 -->
      <el-dialog title="确认支付" :visible.sync="confirmPayVisible" width="600px">
        <div class="ta-c confirm-pay-dialog" :class="{max: uploadFileList.length}">
          <h2 class="fw-n">确认是否线下支付金额：<strong>{{confirmPayData.orderTotalAmount | filterEmpty}}</strong> 元</h2>
          <el-upload
            list-type="picture-card"
            :action="uploadUrl"
            :limit="1"
            :file-list="uploadFileList"
            :on-exceed="exceedHandle"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePreview"
            :on-success="uploadSuccessHandle"
            :on-remove="removeHandle">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="tips">上传凭证（图片格式：jpg、png）</p>
          <div class="confirm-pay-btns">
            <el-button @click="confirmPayVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmPay">确定</el-button>
          </div>
        </div>
      </el-dialog>

      <order-dialog :visible="financeExamineVisible" :initData="financeExamineData" @close="financeExamineVisible = false" @success="handleExamineSuccess"></order-dialog>

      <!-- 支付凭证预览 -->
      <el-dialog title="支付凭证预览" :visible.sync="confirmPayViewVisible" width="800px">
        <img :src="confirmPayUrl | filterImgUrl" class="full-wrap">
      </el-dialog>

      <!-- 物流信息 -->
      <el-dialog title="物流信息" :visible.sync="logisticsVisible" width="600px">
        <div class="logistics-msg-wrap">
          <div class="logistics-title">
            <p><span>物流公司：</span>{{logisticsInfo.logisticsCompany | filterEmpty}}</p>
            <p><span>物流单号：</span>{{logisticsInfo.logisticsNumber | filterEmpty}}</p>
          </div>
          <el-steps direction="vertical">
            <template v-for="(item, index) in logisticsInfo.list">
              <el-step>
                <template slot="title">
                  <strong class="d-ib">{{item.acceptTime | filterDate('MM-DD')}}</strong>
                  <p>{{item.acceptTime | filterDate('HH:mm')}}</p>
                </template>
                <template slot="icon">
                  <svg class="icon va-m" :class="{'icon-dao': index === 0, 'icon-feiji': index === logisticsInfo.list.length - 1}" aria-hidden="true">
                    <use xlink:href="#icon-dao" v-if="index === 0"></use>
                    <use xlink:href="#icon-feiji" v-if="index === logisticsInfo.list.length - 1"></use>
                  </svg>
                </template>
                <template slot="description">
                  <p v-html="item.acceptStation" class="phone-color"></p>
                </template>
              </el-step>
            </template>
          </el-steps>
          <br>
        </div>

        <!-- 暂无数据 -->
        <template v-if="!logisticsInfo.list.length">
          <no-data>暂无物流信息~</no-data>
          <br>
        </template>

        <div class="ta-c">
          <el-button type="primary" @click="logisticsVisible = false">确定</el-button>
        </div>
      </el-dialog>

      <!-- 取消订单 -->
      <el-dialog
        title="取消订单" :visible.sync="cancelVisible" width="500px" class="ta-c">
        <span>确定是否取消订单？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelVisible = false">取 消</el-button>
          <el-button type="primary" @click="cancelHandle">确 定</el-button>
        </span>
      </el-dialog>
    </template>

  </common-tpl>
</template>

<script>
import OrderDialog from '../finance/OrderDialog'
export default {
  components: {OrderDialog},
  data () {
    // 验证手机
    let validatePhone = (rule, value, cb) => {
      let reg = /^\d{0,11}$/gi
      if (value && !value.toString().match(reg)) return cb(new Error('手机格式错误'))
      cb()
    }
    return {
      loading: false,              // loading
      pageType: '',                // 页面类型［''、全部，1、待付款，2、待发货，3、待收货，4、待评价，5、已完成，6、平台关闭，7、取消订单］
      supplierData: [],            // 供应商列表
      formData: {
        orderNo: '',               // 订单编号
        supplierId: null,          // 供应商id
        startTime: '',             // 开始时间
        endTime: '',               // 结束时间
        orderStatusCopy: null,     // 订单状态
        orderType: 1,              // 订单类型
        cardName: '',              // 买家姓名
        customerPhone: '',         // 买家手机号
        payStatus: '',             // 支付状态
        payType: ''                // 支付方式
      },
      orderPageType: 1,            // 订单类型 [1、自营，2、供应]
      rules: {
        customerPhone: { validator: validatePhone, trigger: 'blur' }
      },

      payStatusList: [
        {label: 2, text: '已支付'},
        {label: 1, text: '未支付'}
        // ,
        // {label: 3, text: '已退款'}
      ],
      payTypeList: [
        {label: 2, text: '支付宝支付'},
        {label: 1, text: '微信支付'},
        {label: 3, text: '线下支付'},
        {label: 4, text: '余额支付'},
        {label: 5, text: '通用积分'},
        {label: 6, text: '银联支付'},
        {label: 7, text: '买卖仓提货'}
      ],
      confirmPayVisible: false,     // 确认支付弹窗
      confirmPayData: {},           // 确认支付数据
      uploadFileList: [],           // 确认支付凭证列表
      confirmPayUrl: '',            // 确认支付凭证
      confirmPayViewVisible: false, // 预览
      tableData: [],                // 列表数据
      copyFormData: {},             // 拷贝数据
      tableSelectionData: [],       // 多选结果集合
      deliverVisible: false,        // 发货弹窗
      cancelVisible: false,         // 取消订单弹窗
      cancelData: {},               // 取消订单数据
      deliveryPageType: '',         // 待发货路由

      pageData: {                   // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },

      userInfo: {},                 // 用户信息
      isFinanceExamine: false,      // 是否是财务模块 - 订单审核
      financeExamineVisible: false, // 财务模块 - 订单审核弹窗
      financeExamineData: {},       // 财务模块 - 订单审核数据
      logisticsVisible: false,      // 物流信息弹窗
      logisticsData: {},            // 物流id
      logisticsInfo: {              // 物流数据
        logisticsCompany: '',
        logisticsNumber: '',
        list: []
      }
    }
  },

  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
    }
  },

  // watch: {
  //   '$route' () {
  //     this.pageData.currentPage = parseInt(this.$route.query.page) || 1
  //     this.getListData()
  //   }
  // },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    // 财务模块 - 订单审核
    if (this.$route.path.match(/admin\/finance/gi)) {
      this.isFinanceExamine = true
      let matchPath = this.$route.path.match(/examine|pass|reject/gi)
      if (matchPath) {
        switch (matchPath[0]) {
          case 'examine':
            this.pageType = 4
            break
          case 'pass':
            this.pageType = 2
            break
          case 'reject':
            this.pageType = 5
            break
        }
      }
    } else {
      let matchPath = this.$route.path.match(/payment|delivery|receipt|evaluate|complete/gi)
      if (matchPath) {
        switch (matchPath[0]) {
          case 'payment':
            this.pageType = 1
            break
          case 'delivery':
            this.pageType = 2
            break
          case 'receipt':
            this.pageType = 3
            break
          case 'evaluate':
            this.pageType = 4
            break
          case 'complete':
            this.pageType = 5
            break
        }
      }
      this.formData.payStatus = ''
      this.orderPageType = this.$route.path.match(/self/gi) ? 1 : 2
      this.deliveryPageType = this.$route.path.match(/delivery/gi) ? 1 : 2
      console.log('deliveryPageType: ', this.deliveryPageType)
    }
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    // 获取tab标签类型
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)
    // 判断是否同一模块，带出搜索记录
    // if (this.$Utils.filterSamePage() || this.$Utils.filterSameModule('/admin/order/self')) {}
    // this.$Utils.filterSearchData('/admin/order/self', 3, (res) => {
    //   if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
    // })
    if (this.$route.path.match(/supply/gi)) this.formData.orderType = 2
    if (this.formData.orderType === 2) {
      if (this.$Utils.filterSamePage(3) || this.$Utils.filterSameModule('/admin/order/supply')) {
        if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) {
          let res = JSON.parse(localStorage.getItem(this.$global.FORM_DATA))
          if (res) this.formData = res
        }
      }
    } else {
      if (this.isFinanceExamine) {
        this.$Utils.filterSearchData('/admin/finance/order', 3, (res) => {
          if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
        })
      } else {
        this.$Utils.filterSearchData('/admin/order/self', 3, (res) => {
          if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
        })
      }
    }
    this.getListData()
  },

  methods: {
    /**
     * 获取列表数据
     * @param  {[type]} type [数据类型，type存在表示获取导出数据]
     */
    getListData (type) {
      let payStatus = ''
      let orderStatus = ''
      let url = null
      if (!this.isFinanceExamine) {
        url = '@ROOT_API/order/getOrderList'
        if (this.pageType === '') {
          payStatus = this.formData.payStatus
        } else if (this.pageType === 1) {
          payStatus = ''
        } else {
          payStatus = ''
        }
        if (this.formData.orderStatusCopy) {
          orderStatus = this.formData.orderStatusCopy
        } else if (this.pageType === '') {
          orderStatus = ''
        } else {
          orderStatus = this.pageType
        }
      } else {
        orderStatus = ''
        payStatus = this.pageType
        // payStatus = this.formData.payStatus
        url = '@ROOT_API/order/getOfflineCheckOrderList'
      }
      if (type) {
        url = 'order/exportOrderList'
      } else {
        this.loading = true
      }
      let orderIds = this.tableSelectionData.map(row => row.orderId) || []
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        startTime: this.$Utils.filterDate(this.formData.startTime),
        endTime: this.$Utils.filterDate(this.formData.endTime),
        orderStatus,
        // orderStatus: this.formData.orderStatusCopy ? this.formData.orderStatusCopy : this.pageType === 0 ? '' : this.pageType,          //  订单状态 1待付款 2 待发货 3 待收货 4 待评价 5已完成 6平台关闭 7 取消订单
        payType: this.isFinanceExamine ? 3 : this.formData.payType,     // 是 string  支付方式 1 微信 2 支付宝 3 线下支付
        payStatus,      // 是 string  支付状态 1 未付款 2已付款 3已退款
        customerPhone: this.formData.customerPhone,   // 是 string  客户手机号
        cardName: this.formData.cardName,             // 是 string  客户名称
        orderNo: this.formData.orderNo,               // 是 string  订单编号
        orderType: !this.isFinanceExamine ? this.formData.orderType : '',           // 是 Integer 订单类型：1 自营订单，2 供应订单
        supplierId: this.formData.supplierId === null ? '' : this.formData.supplierId,
        orderIds: orderIds.join(',')
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
          if (!results.list.length) {
            this.tableData = []
            this.pageData.total = 0
            return false
          }
          results.list.forEach((row) => {
            row.paymentVoucher = (row.paymentVoucher && row.paymentVoucher.indexOf(',') !== -1) ? row.paymentVoucher.split(',') : row.paymentVoucher ? [row.paymentVoucher] : ''
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
        window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
      }
    },

    /**
     * table多选
     */
    handleSelectGoods (selection, row) {
      this.tableSelectionData = selection
    },

    /**
     * 供应商选择
     */
    supplierChange (value) {
      this.formData.supplierId = value
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
    },

    /**
     * 财务模块 - 订单审核
     */
    handleExamine (row) {
      this.financeExamineVisible = true
      this.financeExamineData = row
    },

    /**
     * 财务模块 - 订单审核成功
     */
    handleExamineSuccess () {
      this.financeExamineVisible = false
      this.getListData()
    },

    /**
     * 确认支付前操作
     */
    confirmPayTips (row) {
      this.confirmPayData = row
      this.confirmPayVisible = true
    },

    /**
     * 确认支付
     */
    confirmPay () {
      this.$http.post('@ROOT_API/order/offlinePayAudit', {
        ordreNo: this.confirmPayData.orderNo,
        paymentVoucher: this.confirmPayUrl
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.$message({
          message: resData.msg,
          type: 'success',
          duration: 1000
        })
        setTimeout(() => {
          this.confirmPayVisible = false
          this.confirmPayUrl = ''
          this.confirmPayData = ''
          this.getListData()
        }, 500)
      })
    },
    /**
     * 取消订单前操作
     */
    cancelBefore (row) {
      this.cancelData = row
      this.cancelVisible = true
    },

    /**
     * 取消订单
     */
    cancelHandle () {
      this.$http.get('@ROOT_API/order/refund', {
        params: {
          orderNo: this.cancelData.orderNo
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.$message({
          message: resData.msg,
          type: 'success',
          duration: 1000
        })
        setTimeout(() => {
          this.cancelVisible = false
          this.getListData()
        }, 500)
      })
    },

    /**
     * 物流信息
     */
    logisticsBeforeHandle (row) {
      this.logisticsVisible = true
      this.logisticsData = row
      this.logisticsInfo.list = []
      this.loading = true
      this.$http.get('@ROOT_API/orderLogistics/logisticsTracesDetail', {
        params: {
          orderId: this.logisticsData.orderId
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1 && parseInt(resData.status) !== 0) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        // if (parseInt(resData.status) === 0) return false
        this.logisticsInfo.logisticsCompany = resData.map.logisticsName
        this.logisticsInfo.logisticsNumber = resData.map.detailNumber
        resData.data.forEach(item => {
          let phone = item.acceptStation.match(/(\d+[-]?\d+)+/g)
          if (phone && phone.length > 0) {
            phone.forEach(ite => {
              let PhoneColor = '<span>' + ite + '</span>'
              item.acceptStation = item.acceptStation.replace(ite, PhoneColor)
            })
          }
        })
        this.logisticsInfo.list = resData.data.reverse() || []
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 预览
     */
    handlePreview () {
      this.confirmPayViewVisible = true
    },

    /**
     * 文件上传前的格式和大小校验
     */
    beforeAvatarUpload (file) {
      const pattern = /(jpg|jpeg|png)$/ig
      const isLegalPhoto = pattern.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLegalPhoto) {
        this.$message.error('上传图片的格式不正确，请重新上传')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLegalPhoto && isLt2M
    },

    /**
     * 上传数量超过最大限制数量
     */
    exceedHandle (files, fileList) {
      this.$message({
        message: '最多只能上传1个凭证',
        type: 'error'
      })
    },

    /*
     * 文件上传成功
     */
    uploadSuccessHandle (res) {
      if (res.status !== '1') {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.uploadFileList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.confirmPayUrl = res.data
    },

    /**
     * 文件被移除
     */
    removeHandle (file, fileList) {
      this.uploadFileList = []
      this.confirmPayUrl = ''
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
     * 高级搜索时间类型选择
     */
    commandHandle (command) {
      this.formData.timeType = command
      this.formData.timeTypeMsg = parseInt(command) === 1 ? '新增时间' : '上下架时间'
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
      localStorage.removeItem(this.$global.FORM_DATA)
      if (this.orderPageType === 2) this.formData.orderType = 2
    }
  }
}
</script>

<style lang="less" scoped>
.order-index-wrap{

  /*----------------搜索-----------*/
  .search-wrap{
    .el-form-item{
      .el-radio-group{
        div{
          margin-right: 20px;
          line-height: 50px;
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
.order-index-wrap{
  /*----------------发货----------*/
  .el-dialog{
    .el-dialog__body{
      text-align: left;

      .order-info{
        padding: 0 20px;
        border-bottom: 1px solid #eee;
        span{
          height: 35px;
          line-height: 35px;
          padding-bottom: 20px;
        }
      }

      .order-express{
        padding: 20px 0 0 0;

        .number{
          width: 46%;
        }
      }
    }

    .el-dialog__footer{
      .el-button{
        border-radius: 3px;
        border-color: none;
      }
    }
  }

  /* -------------------- { 确认支付 } -------------------- */
  .confirm-pay-dialog{
    h2{
      font-size: 20px;
      margin-bottom: 30px;

      strong{
        color: red;
      }
    }

    .tips{
      color: #999;
      font-size: 14px;
      margin-top: 10px;
    }

    .confirm-pay-btns{
      padding-top: 50px;

      .el-button{
        margin: 0 20px;
      }
    }
  }

  .confirm-pay-dialog.max{
    .el-upload--picture-card{
      display: none;
    }
  }

  /* -------------------- { 查看物流 } -------------------- */
  .el-dialog{
    .el-dialog__header{
      text-align: left;
    }

    .logistics-msg-wrap{
      padding-left: 140px;

      .logistics-title{
        color: #feae34;
        font-size: 15px;
        margin-left: -56px;

        p{
          margin-bottom: 5px;
        }

        span{
          color: #999;
        }
      }

      .el-step.is-vertical:first-child{
        .el-step__icon{
          color: #fff;
          padding: 5px;
          background: #fe9a01;
        }

        .icon{
          fill: #fff;
        }
      }

      .phone-color{
        span{
          color: #feae34;
        }
      }

      .el-step__line{
        width: 1px;
        border-left: 1px dashed #dfdfdf;
        background: none;
      }

      .logistics-number{
        color: #feae34;
      }

      .el-step__main{
        position: relative;


        .el-step__title{
          line-height: 20px;
          font-weight: normal;
          font-size: 15px;
          position: absolute;
          left: -140px;
          top: -8px;

          strong{
            color: #666;
            margin-bottom: 3px;
          }

          p{
            color: #c0c4cc;
            font-size: 14px;
          }
        }

        .el-step__description{
          color: #c0c4cc;
          line-height: 30px;
          font-size: 15px;
          margin-top: -3px;
          padding-bottom: 30px;
        }

        .el-step__title{
          width: 100px;
          text-align: right;
        }
      }

      .el-step__icon.is-text{
        border: none;
      }

      .el-step__icon{
        color: #999;
        background: #d0d0d0;
        padding: 3px;
      }

      .icon{
        fill: #999;
      }
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
