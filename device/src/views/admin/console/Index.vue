<template>
  <div class="admin-console-box">
    <!--统计金额、数量-->
    <div class="admin-console-num">
      <ul>
        <li class="green">
          <img src="../../../../static/img/Hico1.png">
          <div>
            <p>{{StaticData.deviceTotal}}</p>
            <p :title="$t('console.inboundLabel')">{{$t("console.inboundLabel")}}</p>
          </div>
        </li>
        <li class="Purple">
          <img src="../../../../static/img/Hico2.png">
          <div>
            <p>{{StaticData.useDeviceTotal}}</p>
            <p :title="$t('console.enableLabel')">{{$t("console.enableLabel")}}</p>
          </div>
        </li>
        <li class="red">
          <img src="../../../../static/img/Hico3.png">
          <div>
            <p>{{StaticData.userTotal}}</p>
            <p :title="$t('console.totalLabel')">{{$t("console.totalLabel")}}</p>
          </div>
        </li>
        <li class="orange">
          <img src="../../../../static/img/Hico4.png">
          <div>
            <p>{{StaticData.userPayTotal}}</p>
            <p :title="$t('console.payLabel')">{{$t("console.payLabel")}}</p>
          </div>
        </li>
      </ul>
    </div>
    <!--中间内容-->
    <div class="midd-con">
      <div class="midd-title">{{$t("console.enableDeviceCount")}}</div>
      <div class="midd-content">
        <div class="midd-left">
          <div class="sales">
            <p class="label">{{$t("console.enableAsThisMonth")}}</p>
            <p class="count">{{StaticData.deviceMonthTotal}}</p>
            <p :class="StaticData.deviceComparedMonthFlag == 1 ? 'add' : 'less'">
              <span>{{`${StaticData.deviceComparedMonth}%`}}</span>
              <span>{{$t("console.ratioWithLashMonth")}}</span>
            </p>
          </div>
          <div class="sales">
            <p class="label">{{$t("console.endbleAsThisWeek")}}</p>
            <p class="count">{{StaticData.deviceWeekTotal}}</p>
            <p :class="StaticData.deviceComparedWeekFlag == 1 ? 'add' : 'less'">
              <span>{{`${StaticData.deviceComparedWeek}%`}}</span>
              <span>{{$t("console.ratioWithLastWeek")}}</span>
            </p>
          </div>
        </div>
        <div class="midd-right">
          <!-- <div class="map-search-toobar">
            <el-input :placeholder="$t('common.pleaseAddress')" v-model="address"></el-input>
            <el-button type="primary" @click="getAddress">{{$t('common.search')}}</el-button>
          </div> -->
          <!-- <div class="baidu-map">
            <baidu-map
              class="map"
              :center="center"
              :scroll-wheel-zoom="true"
              :zoom="10">
              <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
              <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
              <bm-marker v-for="(address, index) in addressList"
                :key="index"
                :position="{lng: address.longitude, lat: address.latitude}"
                  :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
                <bm-label :content="address.apartmentName" :labelStyle="{color: 'red', fontSize : '14px'}"
                  :offset="{width: -35, height: -40}"/>
              </bm-marker>
            </baidu-map>
          </div> -->
          <el-table :data="addressList" height="400">
          <el-table-column type="index" :label="$t('common.index')" width="90"></el-table-column>
          <el-table-column label="IMEI">
            <template slot-scope="props">
              <p>{{props.row.imei}}</p>
            </template>
          </el-table-column>
          <el-table-column label="Country">
            <template slot-scope="props">
              <p>{{props.row.country}}</p>
            </template>
          </el-table-column>
          <el-table-column label="Address">
            <template slot-scope="props">
              <p>{{props.row.address}}</p>
            </template>
          </el-table-column>
          <el-table-column label="Apartment Name">
            <template slot-scope="props">
              <p>{{ props.row.apartmentName}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.endTime')" width="100" v-if="currentCard === '2'">
            <template slot-scope="props">
              <p>{{ props.row.endTime }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.startTime')" width="100" v-if="currentCard === '2'">
            <template slot-scope="props">
              <p>{{ props.row.startTime }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.theEffectiveTime')" width="100" v-if="currentCard === '3'">
            <template slot-scope="props">
              <p>{{ props.row.temporaryOpenHrs }} h</p>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
    </div>
    <!--底部内容-->
    <div class="bom-con">
      <div class="order-chart">
        <div class="title">{{$t("console.billOfPaymentStatistics")}}</div>
        <div class="content">
          <div class="left">
            <div class="sales">
              <p class="label">{{$t("console.salesOfThisMonth")}}</p>
              <p class="count">{{StaticData.orderMonthTotal}}</p>
              <p :class="StaticData.orderComparedMonthFlag == 1 ? 'add' : 'less'">
                <span>{{`${StaticData.orderComparedMonth}%`}}</span>
                <span>{{$t("console.ratioWithLashMonth")}}</span>
              </p>
            </div>
            <div class="sales">
              <p class="label">{{$t("console.totalOrderOfThisWeek")}}</p>
              <p class="count">{{StaticData.orderWeekTotal}}</p>
              <p :class="StaticData.orderComparedWeekFlag == 1 ? 'add' : 'less'">
                <span>{{`${StaticData.orderComparedWeek}%`}}</span>
                <span>{{$t("console.ratioWithLastWeek")}}</span>
              </p>
            </div>
          </div>
          <div class="right">
            <div class="title-and-date">
              <div class="right-title">{{$t("console.dataStatistics")}}</div>
              <div>
                <span
                  :class="['button', orderDateType === 'week' ? 'button-checked' : '']"
                  @click="changeDate('week')"
                >{{$t("console.nearlySevenDay")}}</span>
                <span
                  :class="['button', orderDateType === 'month' ? 'button-checked' : '']"
                  @click="changeDate('month')"
                >{{$t("console.nearlyThirdDay")}}</span>
                <el-date-picker
                  v-model="orderDate"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="start date"
                  end-placeholder="end date"
                  @change="orderDateChange"
                ></el-date-picker>
              </div>
            </div>
            <div id="sales-chart" style="height: 200px;width:900px;"></div>
          </div>
        </div>
      </div>

      <div class="order-chart">
        <div class="title">{{$t("console.saleStatistics")}}</div>
        <div class="content">
          <div class="left">
            <div class="sales">
              <p class="label">{{$t("console.salesOfThisMonth")}}</p>
              <p class="count">{{StaticData.salesMonthTota}}</p>
              <p :class="StaticData.salesComparedMonthFlag == 1 ? 'add' : 'less'">
                <span>{{`${StaticData.salesComparedMonth}%`}}</span>
                <span>{{$t("console.ratioWithLashMonth")}}</span>
              </p>
            </div>
            <div class="sales">
              <p class="label">{{$t("console.salesOfThisWeek")}}</p>
              <p class="count">{{StaticData.salesWeekTotal}}</p>
              <p :class="StaticData.salesComparedWeekFlag == 1 ? 'add' : 'less'">
                <span>{{`${StaticData.salesComparedWeek}%`}}</span>
                <span>{{$t("console.ratioWithLastWeek")}}</span>
              </p>
            </div>
          </div>
          <div class="right">
            <div class="title-and-date">
              <div class="right-title">{{$t("console.dataStatistics")}}</div>
              <div>
                <span
                  :class="['button', saleDateType === 'week' ? 'button-checked' : '']"
                  @click="changeDateBySales('week')"
                >{{$t("console.nearlySevenDay")}}</span>
                <span
                  :class="['button', saleDateType === 'month' ? 'button-checked' : '']"
                  @click="changeDateBySales('month')"
                >{{$t("console.nearlyThirdDay")}}</span>
                <el-date-picker
                  v-model="saleDate"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="start date"
                  end-placeholder="end date"
                  @change="saleDateChange"
                ></el-date-picker>
              </div>
            </div>
            <div id="recharge-chart" style="height: 200px;width:900px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderRes: null,
      cityData: [], // 过滤后的城市数据
      Operation: [], // 运营趋势数据
      equipmentNum: ['', '', '', '', '', ''], // 设备铺设数量
      RepairData: '', // 设备维修
      StaticData: {}, // 终端状态统计
      distributionNum: [], // 设备分布情况
      newsList: [], // 最新消息
      pageNum: 1, // 最新通知当前页数
      pageSize: 11, // 每页显示几条通知
      totalPages: 0, // 总页数
      // orderCount: {
      //   month: 255000,
      //   week: 50000,
      //   lastMonth: 10.32,
      //   monthComp: 'add',
      //   lastWeek: 10.33,
      //   weekComp: 'less',
      //   title: '近7日订单',
      //   dateChecked: ''
      // },
      // saleCount: {
      //   month: 255000,
      //   week: 50000,
      //   lastMonth: 10.32,
      //   monthComp: 'add',
      //   lastWeek: 10.33,
      //   weekComp: 'less',
      //   title: '近7日销额统计',
      //   dateChecked: ''
      // },
      orderDateType: 'month',
      saleDateType: 'month',
      orderDate: [],
      saleDate: [],
      center: '广东省深圳市',
      address: '广东省深圳市',
      addressList: []
    }
  },
  mounted () {
    let dates = this.timeForMat(30)
    this.orderDate = [dates.t2, dates.t1]
    this.saleDate = [dates.t2, dates.t1]
    this.getDeviceAndOrderStatic() // 获取统计数据
    this.getDeviceOrderForm() // 获取订单数据
    this.getDeviceSalseForm() // 获取销售数据
    this.getAddressPage()
  },
  methods: {
    getDeviceAndOrderStatic () {
      this.$http.post('@ROOT_API/dfDevice/getDeviceAndOrderStatic', {
        start: this.pageNum,
        pageSize: this.pageSize,
        phone: this.condition
      }).then((res) => {
        if (res.data.data) {
          this.StaticData = res.data.data
        }
      })
    },
    getDeviceOrderForm () {
      let startTime = ''
      let endTime = ''
      if (this.orderDate && this.orderDate.length > 1) {
        startTime = `${this.formatDate(this.orderDate[0], 'yyyy-MM-dd')} 00:00:00`
        endTime = `${this.formatDate(this.orderDate[1], 'yyyy-MM-dd')} 23:59:59`
      }
      this.$http.post('@ROOT_API/dfDeviceOrder/getDeviceOrderForm', {
        startTime: startTime,
        endTime: endTime
      }).then((res) => {
        if (res.data.data) {
          this.buildEcharts(res.data.data, 'recharge-chart')
        }
      })
    },
    getDeviceSalseForm () {
      let startTime = ''
      let endTime = ''
      if (this.saleDate && this.saleDate.length > 1) {
        startTime = `${this.formatDate(this.saleDate[0], 'yyyy-MM-dd')} 00:00:00`
        endTime = `${this.formatDate(this.saleDate[1], 'yyyy-MM-dd')} 23:59:59`
      }
      this.$http.post('@ROOT_API/dfDeviceOrder/getDeviceSalseForm', {
        startTime: startTime,
        endTime: endTime
      }).then((res) => {
        if (res.data.data) {
          this.buildEcharts(res.data.data, 'sales-chart')
        }
      })
    },
    getAddressPage () {
      this.$http.post('@ROOT_API/dfAddress/getDfAddressPage', {
        start: 1,
        pageSize: 9999
      }).then((res) => {
        this.addressList = res.data.data.list
        console.log(this.addressList)
      })
    },
    /**
     *数组排序
    */
    ArrSort (name) {
      return function (o, p) {
        var a, b
        if (typeof o === 'object' && typeof p === 'object' && o && p) {
          a = o[name]
          b = p[name]
          if (a === b) {
            return 0
          }
          if (typeof a === typeof b) {
            return a < b ? -1 : 1
          }
          return typeof a < typeof b ? -1 : 1
        } else {
          // throw ('error')
        }
      }
    },
    buildEcharts (data, id) {
      let chart = this.$echarts.init(document.getElementById(id))
      // let orderChart = this.$echarts.init(
      //   document.getElementById('recharge-chart')
      // )
      // let salesChart = this.$echarts.init(
      //   document.getElementById('sales-chart')
      // )

      let xData = []
      let yData = []
      data.forEach((da) => {
        xData.push(da.intDate)
        yData.push(id === 'recharge-chart' ? da.orderNumber : da.salesAmount)
      })
      let option = {
        grid: {
          x: 50,
          y: 20,
          x2: 30,
          y2: 40
        },
        tooltip: {
          trigger: 'item'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false, // B9DDFF
          color: '#D5E7F8',
          data: xData,
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true
          },
          axisLine: {
            show: false
          }
          // show: false
        },
        series: [
          {
            data: yData,
            type: 'line',
            color: '#1890FF',
            areaStyle: {
              normal: {
                color: '#B9DDFF'
              }
            },
            itemStyle: {
              normal: {
                color: '#1890FF',
                lineStyle: {
                  color: '#1890FF'
                }
              }
            }
          }
        ]
      }
      chart.setOption(option)
    },
    changeDate (type) {
      if (type) {
        this.orderDateType = type
        let days = 7
        if (type === 'month') {
          days = 30
        }
        let dates = this.timeForMat(days)
        this.orderDate = [dates.t2, dates.t1]
      } else this.orderDateType = ''
      this.orderDateChange()
    },
    changeDateBySales (type) {
      if (type) {
        this.saleDateType = type
        let days = 7
        if (type === 'month') {
          days = 30
        }
        let dates = this.timeForMat(days)
        this.saleDate = [dates.t2, dates.t1]
      } else this.saleDateType = ''
      this.saleDateChange()
    },
    orderDateChange () {
      this.getDeviceOrderForm()
    },
    saleDateChange () {
      this.getDeviceSalseForm()
    },
    // formatDate (val) {
    //   // 格式化时间
    //   let start = new Date(val)
    //   let y = start.getFullYear()
    //   let m = (start.getMonth() + 1) > 10 ? (start.getMonth() + 1) : '0' + (start.getMonth() + 1)
    //   let d = start.getDate() > 10 ? start.getDate() : '0' + start.getDate()
    //   return y + '-' + m + '-' + d
    // },
    // mistiming (sDate1, sDate2) {
    //   // 计算开始和结束的时间差
    //   let aDate, oDate1, oDate2, iDays
    //   aDate = sDate1.split('-')
    //   oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    //   aDate = sDate2.split('-')
    //   oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    //   iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
    //   return iDays + 1
    // },
    // countDate (start, end) {
    //   // 判断开始和结束之间的时间差是否在90天内
    //   let days = this.mistiming(start, end)
    //   let stateT = days > 90 ? Boolean(0) : Boolean(1)
    //   return {
    //     state: stateT,
    //     day: days
    //   }
    // },
    timeForMat (count) {
      // 拼接时间
      let time1 = new Date()
      // time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
      let Y1 = time1.getFullYear()
      let M1 = ((time1.getMonth() + 1) > 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
      let D1 = (time1.getDate() > 10 ? time1.getDate() : '0' + time1.getDate())
      let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
      let time2 = new Date()
      time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
      let Y2 = time2.getFullYear()
      let M2 = ((time2.getMonth() + 1) > 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
      let D2 = (time2.getDate() > 10 ? time2.getDate() : '0' + time2.getDate())
      let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
      return {
        t1: timer1,
        t2: timer2
      }
    },
    formatDate (date, fmt) {
      if (!date) {
        return ''
      }
      if (typeof date === 'string') {
        return date
      } else if (typeof date === 'number') {
        date = new Date(date)
      }
      let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
      return fmt
    },
    getAddress () {
      if (this.address) this.center = this.address
    }
  }
}
</script>

<style lang="less" scoped>
  .admin-console-box{
    height: 100%;
    overflow: hidden;
    min-width: 1200px;
    .admin-console-num{
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 44px;
      ul{
        width: 100%;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-box;
        li{
          display: -webkit-box;
          display: -moz-box;
          display: -ms-box;
          -webkit-box-flex: 1;
          -ms-box-flex: 1;
          -moz-box-flex: 1;
          height: 170px;
          margin-right: 20px;
          color: #fff;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          -ms-border-radius: 5px;
          -webkit-box-align: center;
          -moz-box-align: center;
          -ms-box-align: center;
          box-align: center;    
          padding-left: 5%;
          box-sizing:border-box;
          min-width: 200px;      
          &.green{
            background: #40a42a;
          }
          &.Purple{
            background: #7c55ca;
          }
          &.red{
            background: #e46737;
          }
          &.orange{
            background: #f39817;
          }
          img{
            width: 46px;
            height: 63px;
            margin-right: 12px;
            vertical-align: inherit;
            display: block;
          }
          div{
            display: inline-block;
            // margin-top:10px;
            text-align: left;
            font-size: 22px;
            color:#fff;
            font-weight: normal;
            p:nth-child(2){
              color:#fff;
              font-size: 16px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 140px;
            }
          }
        }
      }
    }
    .operation-trend{
      background: #fff;
      width: 49%;
      margin-right: 20px;
      float: left;
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      .EchartOne{
        width: 95%;
        height: 420px;
        background: #cccccc;
        margin-left: 20px;
      }
    }
    .describe-tit{
      width: auto;
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding-left: 30px;
      border-bottom: 2px solid #f0f0f0;
      .describe-tit-l{
        font-size: 16px;
        color: #333333;
        display: inline-block;
        float: left;
        // &::before{
        //   content: '';
        //   border-left: 4px solid #32719a;
        //   vertical-align: middle;
        //   padding-right: 10px;
        // }
      }
      ul{
        float: right;
        li{
          display: inline-block;
          margin-right: 20px;
          &:nth-child(1) div{
            background: -webkit-linear-gradient(left, #d881f1 , #707cff); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(right,#d881f1 , #707cff); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(right, #d881f1 , #707cff); /* Firefox 3.6 - 15 */
            background: linear-gradient(to right,#d881f1 , #707cff);
          }
          &:nth-child(2) div{
            background: -webkit-linear-gradient(left, #ff7789 , #f3e368); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(right, #ff7789 , #f3e368); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(right,  #ff7789 , #f3e368); /* Firefox 3.6 - 15 */
            background: linear-gradient(to right, #ff7789 , #f3e368);
          }
          &:nth-child(3) div{
            background: -webkit-linear-gradient(left, #21e2ae , #08afe9); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(right,#21e2ae , #08afe9); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(right, #21e2ae , #08afe9); /* Firefox 3.6 - 15 */
            background: linear-gradient(to right,#21e2ae , #08afe9);
          }
          div{
            width: 70px;
            height: 16px;
            display: inline-block;
            vertical-align: middle;

          }
          p{
            display: inline-block;
            vertical-align: middle;
            color: #333333;
            font-size: 14px;
            margin-left: 10px;
          }
        }
      }

    }
    .midd-con {
      height: 500px;
      background: #ffffff;
      margin-bottom: 40px;
      .midd-title {
        border-bottom: 2px solid #eeeeee;
        padding: 20px;
      }
      .midd-content {
        display: flex;
        height: 440px;
        .midd-left {
          width: 200px;
          border-right: 1px solid #eeeeee;
          .sales {
            margin-bottom: 20px;
            text-align: center;
            margin-top: 80px;
            .label {
              color: #999999;
              margin-bottom: 5px;
            }
            .less {
              color: red;
              margin-top: 5px;
            }
            .less::before {
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid red;
              content: "";
              position: relative;
              width: 0;
              top: 14px;
              left: -6px;
            }
            .add {
              color: green;
              margin-top: 5px;
            }
            .add::before {
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-bottom: 5px solid green;
              content: "";
              position: relative;
              width: 0;
              top: -11px;
              left: -6px;
            }
          }
        }
        .midd-right {
          width: ~'calc(100% - 200px)';
        }
      }
    }
    .bom-con {
      .order-chart {
        // height: 260px;
        background: #ffffff;
        margin-top: 20px;
        border: 1px solid #99999942;
        border-radius: 4px;
        .title {
          height: 40px;
          line-height: 40px;
          padding-left: 20px;
          border-bottom: 1px solid #eeeeee;
        }
        .content {
          display: flex;
          justify-content: space-between;
          padding: 0px 20px;
          .left {
            flex: 1;
            padding-top: 20px;
            text-align: center;
            border-right: 1px solid #eeeeee;
            .sales {
              margin-bottom: 20px;
              .label {
                color: #999999;
                margin-bottom: 5px;
              }
              .less {
                color: red;
                margin-top: 5px;
              }
              .less::before {
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid red;
                content: "";
                position: relative;
                width: 0;
                top: 14px;
                left: -6px;
              }
              .add {
                color: green;
                margin-top: 5px;
              }
              .add::before {
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 5px solid green;
                content: "";
                position: relative;
                width: 0;
                top: -11px;
                left: -6px;
              }
            }
          }
          .right {
            flex: 3;
            padding-top: 10px;
            .title-and-date {
              display: flex;
              justify-content: space-between;
              .right-title {
                margin-left: 50px;
              }
              .button {
                margin-right: 20px;
                cursor: pointer;
              }
              .button-checked {
                color: green;
              }
            }
          }
        }
      }
    }
    .map-search-toobar {
      .el-input {
        width: 200px;
        margin: 10px;
      }
    }
    .baidu-map {
      width: ~'calc(100% - 40px)';
      height: 380px;
      border: 1px solid #ddd;
      margin-left: 10px;
      .map {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
