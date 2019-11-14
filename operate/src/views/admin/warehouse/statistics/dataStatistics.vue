<!-- 幸运大转盘 - 数据统计 -->
<template>
  <common-tpl class="data-statistics-wrap" >
    <template slot="main">
      <!--买卖仓今日实时数据-->
      <div class="statistics-wrap real-time-data">
        <el-row class="data-title" type="flex" justify="space-between">
          <div class="pd-10">
            <span class="left-title">买卖仓今日实时数据</span>
            <span class="left-title-tips">数据每5分钟更新一次</span>
          </div>
          <el-select v-model="value" placeholder="所有商品">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-row>
        <el-row class="content">
          <el-col :span="6">
            <div>{{totalData.testData | filterEmpty}}</div>
            <div>销售量</div>
          </el-col>
          <el-col :span="6">
            <div>{{totalData.testData | filterEmpty}}</div>
            <div>销售额</div>
          </el-col>
          <el-col :span="6">
            <div>{{totalData.testData | filterEmpty}}</div>
            <div>抢购用户数</div>
          </el-col>
          <el-col :span="6">
            <div>{{totalData.testData | filterMoney}}</div>
            <div>提现金额</div>
          </el-col>
        </el-row>
      </div>
      <!--买卖仓交易数据-->
      <div class="statistics-wrap mt-30">
        <el-row class="data-title" type="flex" justify="space-between">
          <div class="pd-10">
            <span class="left-title">买卖仓交易数据</span>
          </div>
          <div>
            <el-select v-model="value" placeholder="所有商品">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" @click="">导出</el-button>
            <el-radio-group v-model="formData.testValue" @change="">
              <el-radio border :label="0">昨日</el-radio>
              <el-radio border :label="1">近7日</el-radio>
              <el-radio border :label="2">近30日</el-radio>
            </el-radio-group>
            <el-date-picker
              v-model="formData.testArr"
              type="daterange"
              range-separator="至"
              start-placeholder="年-月-日"
              end-placeholder="年-月-日"
              @change="">
            </el-date-picker>
          </div>
        </el-row>
        <section class="content pd-20">
          <!--买卖仓交易数据-->
          <div class="transaction-data">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>总注册用户数</td>
                <td>新增用户数</td>
                <td>抢购用户数</td>
              </tr>
              <tr>
                <td>111</td>
                <td>222</td>
                <td>333</td>
              </tr>
              <tr>
                <td>下单用户数</td>
                <td>抢购成功用户数</td>
                <td>重复抢购用户数</td>
              </tr>
              <tr>
                <td>111</td>
                <td>222</td>
                <td>333</td>
              </tr>
              <tr>
                <td>新用户抢购人数</td>
                <td>抢购量</td>
                <td>批发量</td>
              </tr>
              <tr>
                <td>111</td>
                <td>222</td>
                <td>333</td>
              </tr>
            </table>

            <div class="triangle-container">
              <!--<div class="triangle">
                <div class="div3"></div>
                <div class="div4"></div>
                <div class="div5"></div>
              </div>-->
              <div class="echart-wrap" style="height: 400px;width: 600px;z-index: 999;" ref="transactionChart" ></div>
              <div class="mt-30">
                <div class="parallelogram first">
                  <div class="parallelogram-first"></div>
                  <div class="tips">
                    <span>下单转化率</span><br/>
                    <span>11.89%</span>
                  </div>
                </div>
                <div  class="parallelogram second">
                  <div class="parallelogram-second"></div>
                  <div class="tips">
                    <span>支付转化率</span><br/>
                    <span>11.89%</span>
                  </div>
                </div>
                <div  class="parallelogram third">
                  <div class="parallelogram-third"></div>
                  <div class="tips">
                    <span>抢购转化率</span><br/>
                    <span>11.89%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--销售流水统计-->
          <div>
            <div class="left-inner-title">销售流水统计</div>
            <el-row type="flex" justify="space-between" class="pd-10">
              <el-col :span="12">
                <div class="" style="height: 400px;" ref="rushFlowCharts" ></div>
              </el-col>
              <el-col :span="12">
                <div class="" style="height: 400px;" ref="wholesaleFlowCharts" ></div>
              </el-col>
            </el-row>
          </div>
          <!--趋势分析-->
          <div class="mt-30">
            <div class="left-inner-title">趋势分析</div>
            <div class="ml-30">
              <el-radio-group v-model="radio3" class="mt-30">
                <el-radio-button value="1" label="抢购量"></el-radio-button>
                <el-radio-button value="2" label="批量发"></el-radio-button>
                <el-radio-button value="3" label="新增用户数"></el-radio-button>
                <el-radio-button value="4" label="活动用户数"></el-radio-button>
                <el-radio-button value="5" label="抢购成功率"></el-radio-button>
                <el-radio-button value="6" label="重复下单率"></el-radio-button>
              </el-radio-group>
              <div class="mt-30" style="height: 500px;" ref="trendAnalysisCharts" ></div>
            </div>
          </div>
        </section>
      </div>
      <!--买卖仓交易数据排行-->
      <div class="statistics-wrap mt-30">
        <el-row class="data-title" type="flex" justify="space-between">
          <div class="pd-10">
            <span class="left-title">买卖仓交易数据排行</span>
          </div>
          <div>
            <el-select v-model="value" placeholder="所有商品">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" @click="">导出</el-button>
            <el-radio-group v-model="formData.testValue" @change="">
              <el-radio border :label="0">昨日</el-radio>
              <el-radio border :label="1">近7日</el-radio>
              <el-radio border :label="2">近30日</el-radio>
            </el-radio-group>
            <el-date-picker
              v-model="formData.testArr"
              type="daterange"
              range-separator="至"
              start-placeholder="年-月-日"
              end-placeholder="年-月-日"
              @change="">
            </el-date-picker>
          </div>
        </el-row>
        <el-table border :data="tableData" class="full-w" v-loading="loading">
          <el-table-column prop="goodsNo" label="会员姓名" min-width="140">
            <template slot-scope="scope">
              <div class="truncate">{{scope.row.orderNo | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsNo" label="会员手机号" min-width="120">
            <template slot-scope="scope">
              <div class="truncate">{{scope.row.phone | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsGroupPrice" label="抢购数量" min-width="120px">
            <template slot-scope="scope">
              <div>{{scope.row.grabNum | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsGroupPrice" label="抢购金额" min-width="160px">
            <template slot-scope="scope">
              <div>{{scope.row.goodsPrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsGroupPrice" label="批发数量" min-width="120px">
            <template slot-scope="scope">
              <div>{{scope.row.grabNum | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsGroupPrice" label="批发金额" min-width="160px">
            <template slot-scope="scope">
              <div>{{scope.row.goodsPrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="剩余批发券额度" min-width="120px">
            <template slot-scope="scope">
              <div>{{scope.row.status | filterRushAdmin}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsGroupPrice" label="挂售数量" min-width="160px">
            <template slot-scope="scope">
              <div>{{scope.row.purchaseCoupon | filterEmpty}}</div>
            </template>
          </el-table-column><el-table-column prop="goodsGroupPrice" label="自提件数" min-width="160px">
            <template slot-scope="scope">
              <div>{{scope.row.purchaseCoupon | filterEmpty}}</div>
            </template>
          </el-table-column><el-table-column prop="goodsGroupPrice" label="已售出件数" min-width="160px">
            <template slot-scope="scope">
              <div>{{scope.row.purchaseCoupon | filterEmpty}}</div>
            </template>
          </el-table-column><el-table-column prop="goodsGroupPrice" label="已售出金额" min-width="160px">
            <template slot-scope="scope">
              <div>{{scope.row.purchaseCoupon | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column><el-table-column prop="goodsGroupPrice" label="到账收益" min-width="160px">
            <template slot-scope="scope">
              <div>{{scope.row.purchaseCoupon | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="统计时间" min-width="160">
            <template slot-scope="scope">
              <div class="truncate">{{scope.row.grabDate | filterDate}}</div>
            </template>
          </el-table-column>
          <div slot="empty">
            <no-data></no-data>
          </div>
        </el-table>
      </div>
      <!-- 分页 -->
    </template>

    <template slot="other">
    </template>

    <template slot="footer">
    </template>

  </common-tpl>
</template>

<script>
import pagePaper from '@/mixins/ListPublicPage'
const echarts = require('echarts')      // 引入echart插件
export default {
  mixins: [pagePaper],
  data () {
    return {
      tableData: [],
      loading: false,  // loading
      confirmLoading: false,  // 确定loading
      formData: {
        testValue: '',
        testArr: []
      },
      radio3: '抢购量',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      totalData: {
        testData: 132
      },
      appTitle: 5354354545,
      transactionGroupChart: [ // 三角图表
        {value: 60, name: '抢购'},
        {value: 40, name: '下单'},
        {value: 20, name: '支付'}
      ],
      titleData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      valueData: [820, 932, 901, 934, 1290, 1330, 1320],
      materialListData: [],   // 素材列表
      relationGoodsKey: '',   // 关联商品标识符
      buySourceId: '',        // 宣传素材，disseminateType=2时必填
      copyFormData: {},       // 拷贝表单数据
      userInfo: {},           // 用户信息
      assembleData: {}        // 拼团列表数据
    }
  },

  computed: {

  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.formData.themeId = localStorage.getItem(this.$global.SYSTEM + 'ShareThemeId')
    this.getListData()
    this.transactionChartData()
    this.createSaleFlowCharts('rushFlowCharts', '抢购流水统计')  // 生成抢购流水图表
    this.createSaleFlowCharts('wholesaleFlowCharts', '批发流水统计')  // 生成批发流水图表
    this.createTrendAnalysisCharts(this.titleData, this.valueData)  // 生成趋势分析图表
    // alert(this.$data)
  },

  methods: {
    /**
     * 生成趋势分析图表
     */
    createTrendAnalysisCharts (titleData, valueData) {
      let myChart = echarts.init(this.$refs.trendAnalysisCharts)
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        xAxis: {
          type: 'category',
          data: titleData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: valueData,
          type: 'line'
        }]
      })
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    /**
     * 生成销售流水图表
     */
    createSaleFlowCharts (chart, title) {
      let myChart = echarts.init(this.$refs[chart])
      myChart.setOption({
        color: ['#5DE482', '#56ADE8', '#E85553'],
        title: {
          text: title,
          // subtext: '虚构数据',
          left: 'center',
          top: 'bottom'
        },
        graphic: {   // 设置 环形图表标题
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: '总流水\n\n' + this.appTitle,
            textAlign: 'center',
            fill: '#000',
            fontSize: 20
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['55%', '75%'],
            labelLine: {
              normal: {
                length: 60,
                length2: 20
              }
            },
            label: {
              normal: {
                formatter: '{b|{b}}\n\n  {c|{c}}  {d}%  ',
            //    color: '#000000',
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                fontSize: 20,
                rich: {
                  b: {
             //       color: '#000000',
                    lineHeight: 12,
                    fontSize: 20,
                    align: 'center'
                  },
                  // abg: {
                  //     backgroundColor: '#333',
                  //     width: '100%',
                  //     align: 'right',
                  //     height: 22,
                  //     borderRadius: [4, 4, 0, 0]
                  // },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },

            data: [
              {value: 335, name: '直达'},
              {value: 310, name: '邮件营销'},
              {value: 510, name: '营销'}
            ]
          }
        ]
      })
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    /**
     * 生成三角图表
     */
    transactionChartData () {
      let myChart = echarts.init(this.$refs.transactionChart)
      myChart.setOption({
       // color: ['#ccc', '#ccc', '#ccc'],
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: 120,
            top: 0,
            bottom: 0,
            width: '80%',
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 60,
            minSize: '0%',
            maxSize: '70%',
            sort: 'descending',
            gap: 1,
            label: {
              show: true,
              position: 'inside',
              fontSize: '16'
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            data: this.transactionGroupChart
          }
        ]
      })
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    /**
     * 实际批发数量
     */
    getPercentHangGrab (row) {
      if (!row.hangNumHas || !row.hangGrabNum) {
        console.log('row.hangNumHas: ', row.hangNumHas)
        return 0
      } else if (row.hangGrabNum > row.hangNumHas) {
        return 100
      } else {
        return row.hangGrabNum / row.hangNumHas * 100
      }
    },

    /**
     * 获取详情数据
     */
    getListData () {
      this.loading = true
      this.$http.get('@ROOT_API/purchase/getPurchaseGoodsList', {
        params: {
          themeId: this.formData.themeId,
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
        }
      }).then((res) => {
        let results = res.data
        if (parseInt(results.status) !== 1) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.pageData.total = 0
          return false
        }
        let data = results.data
        this.tableData = data.list
        this.pageData.total = data.total
      }).finally(() => {
        this.loading = false
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
     * 跳转链接
     */
    handleLink (item, type) {
      localStorage.setItem(this.$global + 'LuckyBuyGoodsId', item.goodsId)
      if (type === 'record') {
        let url = '/admin/operation/extension/handSale/wholesaleRecord'
        this.$router.push({path: url, query: {}})
      } else {
        let url = '/admin/operation/extension/handSale/wholesaleDetail'
        this.$router.push({path: url, query: {}})
      }
    }
  }
}
</script>

<style lang='less'>
.data-statistics-wrap{
  .mt-20{
    margin-top: 20px;
  }
  .mt-30{
    margin-top: 30px;
  }
  .ml-30{
    margin-left: 30px;
  }
  .pd-10{
    padding: 10px;
  }
  .pd-20{
    padding: 20px;
  }
  .statistics-wrap{
    border: 1px solid #E4E4E4;
  }
  .data-title{
    background: #eef1f9;
    padding: 10px;
    border-bottom: 1px solid #E4E4E4;
    .left-title{
      font-weight: bold;
      font-size: 18px;
    }
    .left-title-tips{
      font-size: 12px;
      color: #999999;
    }
  }
  .left-inner-title{
    font-weight: bold;
    font-size: 18px;
    margin-left: 15px;
  }
  .real-time-data{
    .content{
      font-size: 18px;
      /*display: flex;
      justify-content: space-around;*/
    /*  padding: 20px 10px;*/
      /*background: rgba(153, 204, 255, 0.4);*/
      line-height: 3;
      div{
        text-align: center;
      }
      .el-col{
        border-right: 1px solid #E4E4E4;
      }
      div:last-child{
        border-right: none;
      }
      .line{
        border-left: 1px solid #E4E4E4;
        height: 96px;
        width: 0px;
      }
    }
  }
  .transaction-data{
    display: flex;
    justify-content: space-between;
    padding: 20px;
    table{
      border-top: 1px solid #E4E4E4;
      border-left: 1px solid #E4E4E4;
      tr:nth-child(odd){
        background: #eef1f9;
      }
      td{
        border-right: 1px solid #E4E4E4;
        border-bottom: 1px solid #E4E4E4;
        width: 240px;
        text-align: center;
        padding: 23px 0;
      }
    }
  }
  /*三角形图表样式*/
  .triangle-container{
    position: relative;
    display: flex;
    .tips{
      text-align: center;
    }
    div{
      box-sizing: border-box;
    }
    .triangle{
      z-index: 999;
    }
    .parallelogram+div{
      display: flex;
    }
    .div3::after{
      content: "抢购";
      display: block;
      clear: both;
      position: absolute;
      top: 50px;
      transform: translate(-50%);
    }
    .div4::after{
      content: "下单";
      display: block;
      clear: both;
      position: absolute;
      top: 150px;
      transform: translate(-50%);
    }
    .div5::after{
      content: "支付";
      display: block;
      clear: both;
      position: absolute;
      top: 250px;
      transform: translate(-50%);
    }
    .div3{
      width: 400px;
      height: 0;
      border-top: 400px solid #bcff35;
      border-left: 200px solid transparent;
      border-right: 200px solid transparent;
    }
    .div4{
      width: 300px;
      height: 0;
      border-top: 300px solid #d4ff62;
      border-left: 150px solid transparent;
      border-right: 150px solid transparent;
      margin-left: 50px;
      margin-top: -300px;
    }
    .div5{
      width: 200px;
      height: 0;
      border-top: 200px solid #f6ffc1;
      border-left: 100px solid transparent;
      border-right: 100px solid transparent;
      margin-left: 100px;
      margin-top: -200px;
    }
    .parallelogram.first{
      margin-left: -140px;
      margin-top: 65px;
      display: flex;
      align-items: center;
    }
    .parallelogram-first {
      width: 140px;
      height: 80px;
      border: 1px solid #cccccc;
      transform: skew(-20deg);
    }
    .parallelogram.second{
      margin-left: -180px;
      margin-top: 50px;
      display: flex;
      align-items: center;
    }
    .parallelogram-second {
      width: 140px;
      height: 80px;
      border: 1px solid #cccccc;
      transform: skew(-20deg);
    }
    .parallelogram.third{
      margin-left: -200px;
      margin-top: -235px;
      display: flex;
      align-items: center;
    }
    .parallelogram-third {
      width: 340px;
      height: 260px;
      border: 1px solid #cccccc;
      transform: skew(-20deg);
    }

    div span{
      margin-left: 40px;
    }
  }
}
</style>

<style lang="less">
.data-statistics-wrap{
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
</style>
