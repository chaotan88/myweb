<!-- 控制台首页 -->
<template>
  <div class="console-index-wrap">
    <div class="statistics-wrap head">

      <div class="statistics-cen">
        <dl class="pos-r" @click="$router.push('')">
          <dt class="d-ib va-t"><img class="va-t" src="./assets/img/statistics-icon-01.png"></dt>
          <dd class="d-ib va-t ta-l">
            <p class="pos-r">今日订单总数</p>
            <strong class="pos-r">{{supplierOrderNumStaticData.todayOrderNum | filterEmpty}}</strong>
            <img class="pos-a trend-img" src="./assets/img/statistics-trend-01.png">
            <div class="pos-a line"></div>
          </dd>
        </dl>
        <dl class="pos-r" @click="$router.push('')">
          <dt class="d-ib va-t"><img class="va-t" src="./assets/img/statistics-icon-02.png"></dt>
          <dd class="d-ib va-t ta-l">
            <p class="pos-r">今日销售额</p>
            <strong class="pos-r">¥{{supplierOrderSalesStaticData.todaySales | filterMoney | filterEmpty}}</strong>
            <img class="pos-a trend-img" src="./assets/img/statistics-trend-02.png">
            <div class="pos-a line"></div>
          </dd>
        </dl>
        <dl class="pos-r" @click="$router.push('')">
          <dt class="d-ib va-t"><img class="va-t" src="./assets/img/statistics-icon-03.png"></dt>
          <dd class="d-ib va-t ta-l">
            <p class="pos-r">近7日销售总额</p>
            <strong class="pos-r">¥{{supplierOrderSalesStaticData.last7DaySales | filterMoney | filterEmpty}}</strong>
            <img class="pos-a trend-img" src="./assets/img/statistics-trend-03.png">
            <div class="pos-a line"></div>
          </dd>
        </dl>
        <dl class="pos-r" @click="$router.push('')">
          <dt class="d-ib va-t"><img class="va-t" src="./assets/img/statistics-icon-04.png"></dt>
          <dd class="d-ib va-t ta-l">
            <p class="pos-r">近30日销售总额</p>
            <strong class="pos-r">¥{{supplierOrderSalesStaticData.last30DaySales | filterMoney | filterEmpty}}</strong>
            <img class="pos-a trend-img" src="./assets/img/statistics-trend-04.png">
            <div class="pos-a line"></div>
          </dd>
        </dl>
      </div>
    </div>

    <div class="statistics-num-wrap">
      <div class="pos-r main">
        <div class="d-ib fw-b pos-a title-text">待处理</div>
        <dl class="fl-l cursor-p pos-r" @click="$router.push('/admin/order/self/delivery')">
          <dt class="d-b pos-a"><img src="./assets/img/statistics-num-01.png"></dt>
          <dd>
            <strong>{{supplierOrderNumStaticData.waitSendGoods}}</strong>
            <p>待发货</p>
          </dd>
        </dl>
        <dl class="fl-l cursor-p pos-r" @click="$router.push('/admin/order/self/payment')">
          <dt class="d-b pos-a"><img src="./assets/img/statistics-num-02.png"></dt>
          <dd>
            <strong>{{supplierOrderNumStaticData.waitPayNum}}</strong>
            <p>待支付</p>
          </dd>
        </dl>
        <dl class="fl-l cursor-p pos-r" @click="$router.push('/admin/order/self/receipt')">
          <dt class="d-b pos-a"><img src="./assets/img/statistics-num-03.png"></dt>
          <dd>
            <strong>{{supplierOrderNumStaticData.waitReceiveGoods}}</strong>
            <p>待收货</p>
          </dd>
        </dl>
        <dl class="fl-l cursor-p pos-r" @click="$router.push('/admin/finance/balance/wait')">
          <dt class="d-b pos-a"><img src="./assets/img/statistics-num-04.png"></dt>
          <dd>
            <strong>{{supplierOrderNumStaticData.waitSettleNum}}</strong>
            <p>待结算</p>
          </dd>
        </dl>
      </div>
      <div class="pos-r main">
        <div class="d-ib fw-b pos-a title-text">商品总览</div>
        <dl class="fl-l cursor-p pos-r" @click="$router.push('/admin/goods/manage')">
          <dt class="d-b pos-a"><img src="./assets/img/statistics-num-05.png"></dt>
          <dd>
            <strong>{{supplierGoodsStaticData.saleCurrentDownTotal}}</strong>
            <p>今日下架商品</p>
          </dd>
        </dl>
        <dl class="fl-l cursor-p pos-r" @click="$router.push('/admin/goods/manage')">
          <dt class="d-b pos-a"><img src="./assets/img/statistics-num-06.png"></dt>
          <dd>
            <strong>{{supplierGoodsStaticData.saleDownTotal}}</strong>
            <p>总下架商品</p>
          </dd>
        </dl>
        <dl class="fl-l cursor-p pos-r" @click="$router.push('/admin/goods/manage')">
          <dt class="d-b pos-a"><img src="./assets/img/statistics-num-07.png"></dt>
          <dd>
            <strong>{{supplierGoodsStaticData.saleUpTotal}}</strong>
            <p>已上架商品</p>
          </dd>
        </dl>
        <dl class="fl-l cursor-p pos-r" @click="$router.push('/admin/goods/manage')">
          <dt class="d-b pos-a"><img src="./assets/img/statistics-num-08.png"></dt>
          <dd>
            <strong>{{supplierGoodsStaticData.goodsTotal}}</strong>
            <p>总商品数</p>
          </dd>
        </dl>
      </div>
    </div>

    <!-- 订单统计 -->
    <div class="pos-r charts-wrap">
      <div class="d-ib fw-b pos-a title-text">订单统计</div>
      <div class="charts-top">
        <dl class="fl-l blue">
          <dt class="d-ib">本月订单总数</dt>
          <dd class="d-ib vm-t">
            <strong>{{supplierOrderNumStaticData.thisMonthOrderNum | filterMoney}}</strong>
            <span class="d-ib pos-r"><i class="d-ib pos-a icon up"></i>
            <template v-if="supplierOrderNumStaticData.lastMonthOrderNum > 0 && (parseFloat(supplierOrderNumStaticData.thisMonthOrderNum) - parseFloat(supplierOrderNumStaticData.lastMonthOrderNum))">
              {{((parseFloat(supplierOrderNumStaticData.thisMonthOrderNum) - parseFloat(supplierOrderNumStaticData.lastMonthOrderNum)) / parseFloat(supplierOrderNumStaticData.lastMonthOrderNum) * 100) | numToFixed}}}
            </template>
            <template v-else>--</template>
            %　环比</span>
          </dd>
        </dl>
        <dl class="fl-l red">
          <dt class="d-ib">本周订单总数</dt>
          <dd class="d-ib">
            <strong>{{supplierOrderNumStaticData.thisWeekOrderNum | filterMoney}}</strong>
            <span class="d-ib pos-r"><i class="d-ib pos-a icon" :class="{up: supplierOrderNumStaticData.thisWeekOrderNum >supplierOrderNumStaticData.lastWeekOrderNum, down: supplierOrderNumStaticData.thisWeekOrderNum < supplierOrderNumStaticData.lastWeekOrderNum}"></i>
            <template v-if="supplierOrderNumStaticData.lastWeekOrderNum > 0 && (parseFloat(supplierOrderNumStaticData.thisWeekOrderNum) - parseFloat(supplierOrderNumStaticData.lastWeekOrderNum))">
              {{((parseFloat(supplierOrderNumStaticData.thisWeekOrderNum) - parseFloat(supplierOrderNumStaticData.lastWeekOrderNum)) / parseFloat(supplierOrderNumStaticData.lastWeekOrderNum) * 100) | numToFixed}}
            </template>
            <template v-else>--</template>
            %　环比
            </span>
          </dd>
        </dl>
      </div>
      <div class="ta-c condition">
        <div class="fl-l" style="color: #999;">近{{formData.orderDateNum}}日订单统计(单位：个)</div>
        <el-radio-group v-model="formData.orderDateType" @change="orderDateChange">
          <el-radio border :label="1">近7日</el-radio>
          <el-radio border :label="2">近30日</el-radio>
        </el-radio-group>
        <dl class="fl-r">
          <dt class="d-ib">选择时间：</dt>
          <dd class="d-ib">
            <el-date-picker
              v-model="formData.orderDateValue"
              type="daterange"
              range-separator="至"
              start-placeholder="年-月-日"
              end-placeholder="年-月-日"
              @change="orderDatePickerChange">
            </el-date-picker>
          </dd>
        </dl>
      </div>
      <div class="box-cen">
        <div class="box-c">
          <div class="full-w echart-wrap" ref="orderChart"  v-if="statisticsOrderGraphData.length"></div>
          <no-data style="padding-top: 150px;" v-else></no-data>
        </div>
      </div>
    </div>

    <!-- 销售统计 -->
    <div class="pos-r charts-wrap">
      <div class="d-ib fw-b pos-a title-text">销售统计</div>
      <div class="charts-top">
        <dl class="fl-l blue">
          <dt class="d-ib">本月销售额</dt>
          <dd class="d-ib vm-t">
            <strong>{{supplierOrderSalesStaticData.thisMonthSales | filterMoney}}</strong>
            <span class="d-ib pos-r"><i class="d-ib pos-a icon up"></i>
            <template v-if="supplierOrderNumStaticData.lastMonthSales > 0 && (parseFloat(supplierOrderNumStaticData.thisMonthSales) - parseFloat(supplierOrderNumStaticData.lastMonthSales))">
              {{((parseFloat(supplierOrderNumStaticData.thisMonthSales) - parseFloat(supplierOrderNumStaticData.lastMonthSales)) / parseFloat(supplierOrderNumStaticData.lastMonthSales) * 100) | numToFixed}}}
            </template>
            <template v-else>--</template>
            %　环比</span>
          </dd>
        </dl>
        <dl class="fl-l red">
          <dt class="d-ib">本周销售额</dt>
          <dd class="d-ib">
            <strong>{{supplierOrderSalesStaticData.thisWeekSales | filterMoney}}</strong>
            <span class="d-ib pos-r"><i class="d-ib pos-a icon" :class="{up: supplierOrderSalesStaticData.thisWeekSales > supplierOrderSalesStaticData.lastWeekSales, down: supplierOrderSalesStaticData.thisWeekSales < supplierOrderSalesStaticData.lastWeekSales}"></i>
            <template v-if="supplierOrderSalesStaticData.lastWeekSales > 0 && (supplierOrderSalesStaticData.thisWeekSales - supplierOrderSalesStaticData.lastWeekSales)">
              {{((supplierOrderSalesStaticData.thisWeekSales - supplierOrderSalesStaticData.lastWeekSales) / supplierOrderSalesStaticData.lastWeekSales * 100) | numToFixed}}
            </template>
            <template v-else>--</template>
            %　环比
            </span>
          </dd>
        </dl>
      </div>
      <div class="ta-c condition">
        <div class="fl-l" style="color: #999;">近{{formData.salesDateNum}}日销额统计(单位：元)</div>
        <el-radio-group v-model="formData.salesDateType" @change="salesDateChange">
          <el-radio border :label="1">近7日</el-radio>
          <el-radio border :label="2">近30日</el-radio>
        </el-radio-group>
        <dl class="fl-r">
          <dt class="d-ib">选择时间：</dt>
          <dd class="d-ib">
            <el-date-picker
              v-model="formData.salesDateValue"
              type="daterange"
              range-separator="至"
              start-placeholder="年-月-日"
              end-placeholder="年-月-日"
              @change="salesDatePickerChange">
            </el-date-picker>
          </dd>
        </dl>
      </div>
      <div class="box-cen">
        <div class="box-c">
          <div class="full-w echart-wrap" ref="salesChart" v-if="statisticsSalesGraphData.length"></div>
          <no-data style="padding-top: 150px;" v-else></no-data>
        </div>
      </div>
    </div>

    <br>
    <br>

    <!-- 近30天订单统计 -->
    <!-- <div class="box-wrap">
      <div class="box-cen fl-l">
        <div class="box-c">
          <h2>近30天订单</h2>
          <ul>
            <li class="ta-c fl-l cursor-p" @click="$router.push('/admin/order/self/delivery')">
              <span class="d-b">
                <img src="../../../assets/img/home-box01.png">
              </span>
              <h3 class="d-b">
                <span v-if="recentOrderStatisticsData.waitSendGoods">{{recentOrderStatisticsData.waitSendGoods | filterEmpty}}</span>
                <template v-else>{{'' | filterEmpty}}</template>
              </h3>
              <strong class="d-b">待发货</strong>
            </li>
            <li class="ta-c fl-l cursor-p" @click="$router.push('/admin/order/self/receipt')">
              <span class="d-b">
                <img src="../../../assets/img/home-box02.png">
              </span>
              <h3 class="d-b">
                <span v-if="recentOrderStatisticsData.waitReceiveGoods">{{recentOrderStatisticsData.waitReceiveGoods | filterEmpty}}</span>
                <template v-else>{{'' | filterEmpty}}</template>
              </h3>
              <strong class="d-b">待收货</strong>
            </li>
            <li class="ta-c fl-l cursor-p" @click="$router.push('/admin/order/self/evaluate')">
              <span class="d-b">
                <img src="../../../assets/img/home-box03.png">
              </span>
              <h3 class="d-b">
                <span  v-if="recentOrderStatisticsData.finished">{{recentOrderStatisticsData.finished | filterEmpty}}</span>
                <template v-else>{{'' | filterEmpty}}</template>
              </h3>
              <strong class="d-b">已完成</strong>
            </li>
          </ul>
          <div class="clear"></div>
        </div>
      </div> -->

      <!-- 近半年会员增长状况 -->
      <!-- <div class="box-cen fl-l">
        <div class="box-c pos-r">
          <h2>近半年会员增长状况</h2>
          <div class="echart-wrap" ref="vipEchart" v-show="vipIncreaseData.length"></div>
          <no-data style="padding-top: 170px;" v-if="!vipIncreaseData.length"></no-data>
        </div>
      </div> -->

      <!-- 最新通知 -->
      <!-- <div class="box-cen fl-l">
        <div class="box-c">
          <h2>最新通知</h2>
          <div class="latest-notice-wrap">
            <div class="pos-r notice-list" v-for="item in listData">
              <span class="d-ib truncate text">{{item.messageContent}}</span>
              <span class="d-ib pos-a time">{{item.operateTime}}</span>
            </div>
          </div>

          <div class="ta-c common-bottom-wrap handleup-b">
            <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :total="pageData.total" @current-change="pageChange" v-if="pageData.total"></el-pagination>
          </div>
        </div>
      </div> -->

      <!-- 快捷入口-->
      <!-- <div class="box-cen fl-l">
        <div class="box-c">
          <h2>快捷入口</h2>
          <div class="statistics-wrap">
            <div class="statistics-cen quick">
              <div class="ta-c fl-l cursor-p list-wrap" v-for="item in quickLinks" @click="$router.replace(item.url)">
                <dl>
                  <dt class="d-ib ta-c va-m pos-r">
                    <svg class="va-m icon" :class="item.icon" aria-hidden="true">
                      <use :xlink:href="'#' + item.icon"></use>
                    </svg>
                  </dt>
                  <dd class="d-ib va-t">{{item.title}}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div> -->

    </div>
  </div>
</template>

<script>
const echarts = require('echarts')      // 引入echart插件
export default{
  data () {
    return {
      orderStatisticsData: {            // 订单统计数据
        todayOrderAmount: '',
        totalOrderAmount: ''
      },
      vipStatisticsData: {              // 会员统计数据
        todayNewMember: '',
        totalMember: ''
      },
      recentOrderStatisticsData: {      // 近30天订单统计数据
        finished: '',
        waitReceiveGoods: '',
        waitSendGoods: ''
      },
      listData: [],                     // 列表数据
      quickLinks: [
        {
          title: '商品管理',
          icon: 'icon-shangpinguanli',
          url: '/admin/goods/manage/'
        },
        {
          title: '订单管理',
          icon: 'icon-benbanzushengchandingdanguanli',
          url: '/admin/order/self/'
        },
        {
          title: '栏目管理',
          icon: 'icon-lanmu-console',
          url: '/admin/column/manage'
        },
        {
          title: '会员中心',
          icon: 'icon-huiyuan',
          url: '/admin/vip/center/'
        }
      ],
      vipIncreaseData: [],        // 近半年会员增长状况
      formData: {
        orderDateType: 1,         // 订单统计选择时间类型
        orderDateValue: [],       // 订单统计时间区间
        orderDateNum: 7,          // 订单统计天数
        salesDateType: 1,         // 销售额统计选择时间类型
        salesDateValue: [],       // 销售额统计时间区间
        salesDateNum: 7           // 销售额统计天数
      },
      pageData: {
        currentPage: 1,           // 当前分页
        pageSize: 5,              // 显示条数，不写的话默认为10
        total: 0                  // 列表总条数
      },
      supplierGoodsStaticData: {},      // 商品数量统计
      supplierOrderNumStaticData: {},   // 订单数统计
      supplierOrderSalesStaticData: {}, // 销售额统计
      statisticsOrderGraphData: [],     // 订单图表统计数据
      statisticsSalesGraphData: []      // 销售额图表统计数据
    }
  },

  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    // this.getOrderVipStatistics()
    // this.getListData()
    // this.getVipIncreaseData()
    // this.initChart()
    this.getStatisticsData()
    this.getGoodsStatisticsData()                     // 获取统计数据
    this.getSupplierOrderGraphData('order')           // 获取订单统计图表数据
    this.getSupplierOrderGraphData('sales')           // 获取销售统计图表数据
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatisticsData () {
      this.$http.get('@ROOT_API/supplierHomepage/getSupplierStaticData', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        let results = resData.data
        this.supplierOrderNumStaticData = results.supplierOrderNumStaticData
        this.supplierOrderSalesStaticData = results.supplierOrderSalesStaticData
      })
    },

    /**
     * 获取统计数据
     */
    getGoodsStatisticsData () {
      this.$http.post('@ROOT_API/supplierHomepage/getGoodsStaticData', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.supplierGoodsStaticData = resData.data[0]
      })
    },

    /**
     * 获取订单日期的前几天
    */
    getFutureDate (days, beginTime) {
      var myDate = null
      if (beginTime) {
        myDate = new Date(beginTime)  // 获取开始日期
      } else {
        myDate = new Date()           // 获取开始日期
      }
      var dateTemp = ''
      var dataArr = []
      for (var i = 0; i < days; i++) {
        var Month = myDate.getMonth() + 1        // 月
        var day = myDate.getDate()               // 日
        Month = Month < 10 ? '0' + Month : Month
        day = day < 10 ? '0' + day : day
        dateTemp = Month + '/' + day             // 整条数据
        myDate.setDate(day - 1)     // 设置日期
        dataArr.push(dateTemp)
      }
      return dataArr.reverse()
    },
    /**
     * 获取图表统计数据
     */
    getSupplierOrderGraphData (type) {
      let beginTime = ''
      let endTime = ''
      if (type === 'order') {
        if (this.formData.orderDateValue && this.formData.orderDateValue.length) {
          beginTime = new Date(this.formData.orderDateValue[0]).getTime()
          endTime = new Date(this.formData.orderDateValue[1]).getTime()
        } else {
          let beforeDate = new Date()
          if (this.formData.orderDateType === 1) {
            beforeDate.setDate(beforeDate.getDate() - 7)
          } else {
            beforeDate.setMonth(beforeDate.getMonth() - 1)
          }
          beginTime = new Date(beforeDate).getTime()
          endTime = new Date().getTime()
        }
      } else {
        if (this.formData.salesDateValue && this.formData.salesDateValue.length) {
          beginTime = new Date(this.formData.salesDateValue[0]).getTime()
          endTime = new Date(this.formData.salesDateValue[1]).getTime()
        } else {
          let beforeDate = new Date()
          if (this.formData.salesDateType === 1) {
            beforeDate.setDate(beforeDate.getDate() - 7)
          } else {
            beforeDate.setMonth(beforeDate.getMonth() - 1)
          }
          beginTime = new Date(beforeDate).getTime()
          endTime = new Date().getTime()
        }
      }

      this.$http.post('@ROOT_API/supplierHomepage/getSupplierOrderGraphStaticData', {
        beginTime,
        endTime
      }).then((res) => {
        let resData = res.data
        // resData.data = [{
        //   orderDate: '2018-09-24',
        //   sales: 102.00,
        //   orderNum: 2
        // }]
        if (type === 'order') {
          this.statisticsOrderGraphData = []
        } else {
          this.statisticsSalesGraphData = []
        }
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        if (resData.data.length) {
          // 订单统计
          if (type === 'order') {
            let month = this.getFutureDate(this.formData.orderDateNum, endTime)
            this.statisticsOrderGraphData = resData.data
            let values = []
            for (let i = 0; i < this.formData.orderDateNum; i++) {
              values[i] = ''
            }
            month.forEach((ite, index) => {
              this.statisticsOrderGraphData.forEach((row) => {
                if (row.orderDate.indexOf('-') > -1) {
                  let orderDate = row.orderDate.split('-')
                  let mothData = ite.split('/')
                  if (mothData[0] === orderDate[1] && mothData[1] === orderDate[2]) {
                    values[index] = row.orderNum
                  }
                }
              })
            })
            setTimeout(() => {
              this.createChart('orderChart', month, values, '订单统计')
            }, 50)
          } else {
            let month = this.getFutureDate(this.formData.salesDateNum, endTime)
            this.statisticsSalesGraphData = resData.data
            let values = []
            for (let i = 0; i < this.formData.salesDateNum; i++) {
              values[i] = ''
            }
            month.forEach((ite, index) => {
              this.statisticsSalesGraphData.forEach((row) => {
                if (row.orderDate.indexOf('-') > -1) {
                  let orderDate = row.orderDate.split('-')
                  let mothData = ite.split('/')
                  if (mothData[0] === orderDate[1] && mothData[1] === orderDate[2]) {
                    values[index] = row.sales
                  }
                }
              })
            })
            setTimeout(() => {
              this.createChart('salesChart', month, values, '销售统计')
            }, 50)
          }
        }
      })
    },

    /**
     * 订单统计时间类型改变
     */
    orderDateChange (value) {
      this.formData.orderDateValue = []
      this.formData.orderDateNum = value === 1 ? 7 : 30
      this.getSupplierOrderGraphData('order')
    },

    /**
     * 订单统计时间选择
     */
    orderDatePickerChange (value) {
      if (value && value.length) {
        this.formData.orderDateType = ''
        let days = new Date(value[1]).getTime() - new Date(value[0]).getTime()
        this.formData.orderDateNum = parseInt(days / (1000 * 60 * 60 * 24)) + 1
      } else {
        this.formData.orderDateType = 1
      }
      this.getSupplierOrderGraphData('order')
    },

    /**
     * 销售额统计时间类型改变
     */
    salesDateChange (value) {
      this.formData.salesDateValue = []
      this.formData.salesDateNum = value === 1 ? 7 : 30
      this.getSupplierOrderGraphData('sales')
    },

    /**
     * 销售额统计时间选择
     */
    salesDatePickerChange (value) {
      if (value && value.length) {
        this.formData.salesDateType = ''
        let days = new Date(value[1]).getTime() - new Date(value[0]).getTime()
        this.formData.salesDateNum = parseInt(days / (1000 * 60 * 60 * 24)) + 1
      } else {
        this.formData.salesDateType = 1
      }
      this.getSupplierOrderGraphData('sales')
    },

    /**
     * 获取订单和会员统计
     */
    getOrderVipStatistics () {
      this.$http.get('@ROOT_API/homepage/getStaticData', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          // this.$message({
          //   message: resData.msg,
          //   type: 'error',
          //   duration: 1500
          // })
          return false
        }
        this.orderStatisticsData = resData.data.orderStaticData
        this.vipStatisticsData = resData.data.memberStaticData
        this.recentOrderStatisticsData = resData.data.latest30daysOrder
      })
    },

    /**
     * 近半年会员增长情况
     */
    getVipIncreaseData () {
      this.$http.get('@ROOT_API/homepage/getLatestHalfYearMemberStatic').then((res) => {
        let resData = res.data
        if (parseInt(resData.status) === 9999) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        if (parseInt(resData.status) !== 1) {
          // this.$message({
          //   message: resData.msg,
          //   type: 'error',
          //   duration: 1500
          // })
          return false
        }
        let months = []
        let values = []
        for (let i = 0; i < 12; i++) {
          months[i] = ''
          values[i] = ''
        }
        resData.data.forEach((row) => {
          months[row.monthNum] = row.monthNum + '月'
          values[row.monthNum] = row.monthNum
        })
        this.vipIncreaseData = resData.data
        setTimeout(() => {
          this.createChart(months, values)
        }, 50)
      })
    },

    /**
     * 统计图
    */
    createChart (elEchart, months, values, name) {
      if (!this.$refs[elEchart]) return false
      let myChart = echarts.init(this.$refs[elEchart])
      myChart.setOption({
        tooltip: {
          // trigger: 'axis'
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          // splitLine: {
          //   show: false
          // },
          type: 'category',
          boundaryGap: false,
          data: months
          // data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
          type: 'value',
          lineStyle: {
            normal: {
              width: 1
            }
          }
        },
        series: [
          {
            name: name,
            type: 'line',
            stack: '总量',
            symbolSize: 10,
            // symbol: 'circle',
            smooth: true,
            // showSymbol: false,
            animationDelay: 0,
            animationDuration: 1000,
            // hoverAnimation: false,
            lineStyle: {
              normal: {
                width: 2,
                shadowColor: '#fff',
                shadowBlur: 2,
                shadowOffsetY: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(77, 149, 219, 1, [{
                  offset: 0,
                  color: 'rgba(77, 149, 219, 0.2)'
                }, {
                  offset: 0.8,
                  color: 'rgba(77, 149, 219, 0.2)'
                }], false)
              }
            },
            itemStyle: {
              normal: {
                color: '#4d95db',
                borderColor: '#4d95db',
                borderWidth: 3
              }
            },
            data: values
          }
        ]
      })
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },

    /**
     * 获取最新通知
     */
    getListData () {
      this.$router.push({query: {page: this.pageData.currentPage}})    // 地址栏追加当前分页（当你刷新的时候不会回到第一页）
      this.$http.post('@ROOT_API/homepage/getlatestNotice', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          // this.$message({
          //   message: resData.msg,
          //   type: 'error',
          //   duration: 1500
          // })
          return false
        }
        this.listData = resData.data.list
        this.pageData.total = resData.data.total        // 自定义好的列表总条数为0，需要传值给后台数据，循环后台传回来的数据
      })
    },

    /**
     * 分页改变
     */
    pageChange (page) {             // 执行当页面分页改变时候的方法
      this.pageData.currentPage = page       // 重置当前分页
      this.getListData()            // 获取列表数据
    }
  }
}
</script>

<style lang='less'>
.console-index-wrap{

  .title-text{
    color: #333;
    padding: 5px 15px;
    background: #f0f0f0;
    top: -17px;
    left: 15px;
    border-radius: 5px;
  }

  /* -------------------- { 头部统计 } -------------------- */
  .statistics-wrap.head{
    margin-bottom: 40px;

    .statistics-cen{
      display: flex;
      justify-content: space-between;

      dl{
        width: 25%;
        border-bottom: 5px solid #dcdcdc;
        padding: 35px 0;
        background: #fff;
        margin-right: 20px;
        box-sizing: border-box;
        border-radius: 10px;
        z-index: 1;
        
        dt{
          width: 60px;
          margin-left: 20px;

          .icon{
            fill: #fff;
            width: 100%;
            height: 100%;
          }
        }

        dd{
          p{
            color: #999;
            font-size: 15px;
            z-index: 5;
          }

          strong{
            color: #666;
            font-size: 20px;
            font-weight: normal;
            z-index: 5;
          }

          .trend-img{
            right: 30px;
            top: 35px;
            z-index: 0;
          }
        }

        .line{
          width: 100%;
          height: 10px;
          background: #fff;
          bottom: 0;
          left: 0;
          z-index: 5;
          border-radius: 0 0 8px 8px;
        }
      }

      dl::after{
        content: ' ';
        width: 75%;
        height: 10px;
        display: block;
        position: absolute;
        bottom: -5px;
        left: 0;
        border-radius: 0 10px 10px 10px;
        z-index: 0;
      }

      dl:nth-child(1)::after{
        background: linear-gradient(left, #d4f247, #46f246);
      }

      dl:nth-child(2)::after{
        background: linear-gradient(left, #f57266, #8a47ee);
      }

      dl:nth-child(3)::after{
        background: linear-gradient(left, #fadc18, #e9a745);
      }
  
      dl:last-child{
        margin-right: 0;
      }

      dl:last-child::after{
        background: linear-gradient(left, #628ef6, #4d4ff2);
      }

    }
  }

  /* -------------------- { 订单及商品数量统计 } -------------------- */
  .statistics-num-wrap{
    display: flex;
    justify-content: space-between;

    .main{
      width: 50%;
      padding: 45px 0 40px 0;
      background: #f8f8f8;
      border-radius: 8px;

      dl{
        width: 25%;
        border-left: 1px solid #eee;
        padding-left: 60px;
        box-sizing: border-box;

        dt{
          width: 24px;
          height: 28px;
          margin-top: -14px;
          left: 20px;
          top: 50%;
        }

        dd{
          strong{
            color: #666;
            font-size: 20px;
          }

          p{
            color: #999;
          }
        }
      }

      dl:nth-child(2){
        border-left: 0;
      }
    }

    .main:first-child{
      margin-right: 10px;
    }

    .main:last-child{
      margin-left: 10px;
    }
  }

  /* -------------------- { 统计图 } -------------------- */
  .charts-wrap{
    margin-top: 40px;

    .charts-top{
      height: 24px;
      line-height: 24px;
      border-bottom: 1px solid #eee;
      padding: 15px 10px 15px 120px;
      background: #fff;
      border-radius: 8px 8px 0 0;

      dl{
        width: 50%;

        dt{
          color: #666;
          margin-right: 15px;
        }

        dd{
          span{
            margin-left: 15px;
            padding: 0 10px 0 30px;
            border-radius: 20px;
          }

          .icon{
            width: 20px;
            height: 24px;
            margin-right: 10px;
            left: 8px;
          }
        }
      }

      dl.blue{
        dd{
          color: #27c5e6;

          span{
            background: #ceedf5;

            .icon.up{
              background: url(./assets/img/trend-up-blue.png) no-repeat center;
            }
            .icon.down{
              background: url(./assets/img/trend-down-blue.png) no-repeat center;
            }
          }
        }
      }

      dl.red{
        dd{
          color: #f36c9f;

          span{
            background: #f7d9e4;

            .icon.up{
              background: url(./assets/img/trend-up-red.png) no-repeat center;
            }
            .icon.down{
              background: url(./assets/img/trend-down-red.png) no-repeat center;
            }
          }
        }
      }
    }

    /* -------------------- { 查询条件 } -------------------- */
    .condition{
      line-height: 40px;
      padding: 15px 30px;
      background: #fff;

      .el-radio{
        margin: 0 10px;
        border-radius: 20px;
        .el-radio__input{
          display: none;
        }
      }
      .el-radio.is-checked{
        background: linear-gradient(left, #2fe2d8, #24b9ec);
        .el-radio__label{
          color: #fff !important;
        }
      }
    }

    /*-------中间主体--------*/
    .box-cen{
      width: 100%;
      height: 420px;
      box-sizing: border-box;

      .box-c{
        height: 100%;
        background: #fff;
        border-radius: 5px;
      }

      .echart-wrap{
        height: 440px;
        margin: 0 20px;
      }

      h2{
        color: #333;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        padding-left: 30px;
        border-bottom: 1px solid #f0f0f0;
      }

      li{
        width: 33.33%;
        margin: 150px 0 110px 0;
        padding: 0 10px;
        box-sizing: border-box;

        h3{
          color: #40a42a;
          font-size: 44px;
          line-height: 90px;
        }

        strong{
          color: #c8c8c8;
          font-size: 16px;
        }

        img{
          max-width: 100%;
        }
      }

      li:nth-child(2){
        h3{
          color: #7c55ca;
        }
      }

      li:nth-child(3){
        h3{
          color: #e46737;
        }
      }

      /*--------最新通知-------*/
      .latest-notice-wrap{
        padding: 30px;

        .notice-list{
          height: 56px;
          line-height: 56px;
          border: 1px solid #ddd;
          margin-top: -1px;
          padding-right: 140px;
          z-index: 1;
          box-sizing: border-box;

          .text{
            padding: 0 15px;
          }

          .time{
            width: 95px;
            padding: 0 10px;
            right: 0;
            top: 0;
          }
        }

        .notice-list:hover{
          border-color: #33719b;
          z-index: 5;
        }
      }

      /*-------快捷入口---------*/
      .statistics-wrap{
        padding: 30px;
        margin: 0;
        .quick{
          display: block !important;
          overflow: hidden;

          .list-wrap{
            width: 50%;
            margin-bottom: 20px;
            box-sizing: border-box;
          }

          dl{
            width: 100%;
            height: 150px;
            border: 1px solid #ddd;
            margin-bottom: 0;
            background: none;
            border-radius: 3px;

            dt, dd{
              height: 50px;
              line-height: 50px;
            }

            dt{
              .icon{
                width: 100%;
                height: 100%;
              }

              .icon-shangpinguanli{
                fill: red;
              }

              .icon-benbanzushengchandingdanguanli{
                fill: red;
                width: 50px;
                height: 40px;
              }

              .icon-huiyuan{
                fill: #e46737;
              }
            }

            dd{
              color: #666;
              font-size: 16px;
            }
          }

          .list-wrap:nth-child(odd){
            padding-right: 10px;
          }

          .list-wrap:nth-child(even){
            padding-left: 10px;
          }

          .list-wrap:hover{
            dd{
              color: #333;
            }
          }
        }
      }
    }

  }
}

@media screen and (max-width: 1200px) {
  .console-index-wrap{

    .statistics-wrap{
      dl{
        dt{
          width: 50px !important;
          height: 40px !important;
        }

        dd{
          h3{
            font-size: 26px !important;
          }
        }
      }
    }

    .box-wrap{

      .box-cen{
        li{
          h3{
            font-size: 40px;
          }
        }
      }
    }
  }
}
</style>
