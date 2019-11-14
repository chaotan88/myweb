<!-- 收益报表 -->
<template>
  <div class="earning-table-wrap">
    <!-- 头部 -->
    <div class="table-header">
      <!-- 年份 -->
      <div class="year-chioce pos-r">
        <span>{{curText}}</span>
      </div>
      <!-- 时间段 -->
      <div class="month-chioce pos-r" @click="datepickHandle">
        <span class="month-text">时间段</span>
        <span class="arrow-down pos-a"></span>
      </div>
    </div>

    <el-table :data="mergeTableData" style="width: 100%" height="100%">
      <el-table-column fixed prop="date" label="序号" width="50">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column fixed prop="invitationCode" label="ID" width="70">
      </el-table-column>
      <el-table-column label="直推（个人+旗下）累计">
        <el-table-column
          prop="totalBonusPoints"
          label="消费积分"
          width="80">
        </el-table-column>
        <el-table-column
          prop="totalCashPoints"
          label="通用积分"
          width="80">
        </el-table-column>
        <el-table-column
          prop="totalPoints"
          label="合计"
          width="80">
        </el-table-column>
      </el-table-column>

      <el-table-column v-for="(month, index) in monthArr" :label="month + '月新增'" :key="index">
        <template>
          <el-table-column
            :prop="'totalBonusPoints' + month"
            label="消费积分"
            width="80">
          </el-table-column>
          <el-table-column
            :prop="'totalCashPoints' + month"
            label="通用积分"
            width="80">
          </el-table-column>
          <el-table-column
            :prop="'totalPoints' + month"
            label="合计"
            width="80">
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>

    <!--时间选择-底部弹框-->
    <div v-transfer-dom>
      <popup v-model="selectVisible" position="bottom">
        <div class="time-wrap">
          <!--标题-->
          <div class="title">
            <span @click="selectVisible = false">取消</span>
            <span class="fl-r" @click="getTableList">确认</span>
          </div>
          <div class="time-box">
            <input type="text" placeholder="开始时间" :class="{active: isActive1}" v-model="monthStart" readonly unselectable="on" @click="inpFocus(1), this.blur()">
            至
            <input type="text" placeholder="结束时间" :class="{active: isActive2}" v-model="monthEnd" readonly unselectable="on" @click="inpFocus(2), this.blur()">
          </div>
          <div class="del-icon fl-r" @click="inpClear">
            <img src="../../assets/images/delete.png" alt="">
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Table, TableColumn } from 'element-ui'
import {TransferDom, Popup, Datetime} from 'vux'
Vue.use(Table)
Vue.use(TableColumn)
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup,
    Datetime
  },
  data () {
    return {
      monthStart: '01',
      monthEnd: '06',
      curYear: '',
      curText: '',
      isActive1: false,
      isActive2: false,
      selectVisible: false,
      monthArr: [],
      newTableData: [],                     // 将后台数据转成数组
      mergeTableData: [],                   // 数据整合后的数据
      tableData: {}
    }
  },
  mounted () {
    this.getCurDate()
    this.getTableList()
  },
  methods: {
    /**
     * 选择确认
     */
    getTableList () {
      if (!this.monthStart || !this.monthEnd) {
        this.$vux.toast.text('日期选择不完整')
        return false
      }
      this.$http.post(this.api.getUserPoints, {
        monthStart: this.monthStart,
        monthEnd: this.monthEnd
      }).then(res => {
        let resData = res.data
        if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
          this.$vux.toast.text(resData.msg)
          this.tableData = {}
          return false
        }
        this.tableData = resData.data
        this.mergeData(this.tableData)
        if (this.monthStart.split('-')[1] === this.monthEnd.split('-')[1]) {
          this.curText = (this.monthStart.split('-')[0] + '年' + this.monthStart.split('-')[1] + '月') || (this.monthEnd.split('-')[0] + '年' + this.monthEnd.split('-')[1] + '月')
        } else {
          this.curText = (this.monthStart.split('-')[0] + '年' + this.monthStart.split('-')[1] + '月') + '~' + (this.monthEnd.split('-')[0] + '年' + this.monthEnd.split('-')[1] + '月')
        }
      })
      this.selectVisible = false
    },
    /**
     * 数据整合
     */
    mergeData (arr) {
      this.newTableData = []
      this.monthArr = []
      for (let key in arr) {
        this.newTableData.push({
          invitationCode: key,
          data: arr[key]
        })
      }
      if (this.newTableData.length) {
        this.newTableData[0].data.map(item => {
          this.monthArr.push(item.month.split('-')[1])
        })
      }
      this.mergeTableData = []
      for (let key in arr) {
        let obj = {}
        let obj2 = {}
        let totalCashPoints = 0
        let totalBonusPoints = 0
        let totalPoints = 0
        obj.invitationCode = key
        arr[key].map(item => {
          totalBonusPoints += item.totalBonusPoints
          totalCashPoints += item.totalCashPoints
          totalPoints += item.totalPoints
          obj2['totalBonusPoints'] = totalBonusPoints
          obj2['totalCashPoints'] = totalCashPoints
          obj2['totalPoints'] = totalPoints
          let month = item.month.split('-')[1]
          obj['totalBonusPoints' + month] = item.totalBonusPoints
          obj['totalCashPoints' + month] = item.totalCashPoints
          obj['totalPoints' + month] = item.totalPoints
        })
        this.mergeTableData.push(Object.assign(obj2, obj))
      }
    },
    /**
     * 时间选择
     */
    getCurDate () {
      let now = new Date()
      this.curYear = now.getFullYear()
      this.curMonth = now.getMonth() + 1
      this.curMonth = this.curMonth > 9 ? this.curMonth : '0' + this.curMonth
      this.monthEnd = this.curYear + '-' + this.curMonth
      if (parseInt(this.curMonth) > 6) {
        this.monthStart = this.curYear + '-0' + (this.curMonth - 5)
        this.curText = this.curYear + '年0' + (this.curMonth - 5) + '月' + '~' + this.curYear + '年' + this.curMonth + '月'
      } else {
        if (this.curMonth > 2) {
          this.monthStart = this.curYear - 1 + '-' + (this.curMonth + 7)
          this.curText = this.curYear - 1 + '年' + (this.curMonth + 7) + this.curYear + '年0' + this.curMonth + '月'
        } else {
          this.monthStart = this.curYear - 1 + '-0' + (this.curMonth + 7)
          this.curText = this.curYear - 1 + '年0' + (this.curMonth + 7) + this.curYear + '年0' + this.curMonth + '月'
        }
      }
    },
    /**
     * 时间选择
     */
    inpFocus (key) {
      let _this = this
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        format: 'YYYY-MM',
        value: '2018-01',
        onConfirm (val) {
          if (key === 1) {
            if (_this.monthEnd && _this.monthEnd < val) {
              _this.monthStart = ''
              _this.$vux.toast.text('开始日期需小于结束日期')
            } else {
              _this.monthStart = val
            }
            _this.isActive1 = true
          } else {
            if (_this.monthStart && _this.monthStart > val) {
              _this.monthEnd = ''
              _this.$vux.toast.text('结束日期需大于开始日期')
            } else {
              _this.monthEnd = val
            }
            _this.isActive2 = true
          }
        }
      })
    },
    /**
     * 清空时间
     */
    datepickHandle () {
      this.selectVisible = true
      this.monthStart = ''
      this.monthEnd = ''
      this.isActive1 = false
      this.isActive2 = false
    },
    /**
     * 清空时间
     */
    inpClear () {
      this.monthStart = ''
      this.monthEnd = ''
      this.isActive1 = false
      this.isActive2 = false
    }
  }
}
</script>

<style lang="less">
.earning-table-wrap{
  height: 100vh;
  padding-top: 1rem;
  box-sizing: border-box;
  background: #eee;

  .table-header{
    position: absolute;
    top: .2rem;
    left: 0;
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    background: #fff;
    font-size: .26rem;
    display: flex;
    z-index: 20;
    .year-chioce{
      width: 65%;
      text-align: center;
      color: #666;
    }
    .month-chioce{
      position: relative;
      width: 1.4rem;
      padding: 0 .4rem 0 .1rem;
      margin-right: .2rem;
      text-align: right;

      span{
        color: #666;
        display: inline-block;
      }
    }
    .month-chioce::before{
      content: '';
      width: .04rem;
      height: .5rem;
      background: #eee;
      display: block;
      position: absolute;
      left: 0;
      bottom: 0;
      top: 0;
      margin: auto;
    }
    .arrow-down{
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -.15rem;
      width: .18rem;
      height: .18rem;
      box-sizing: border-box;
      overflow: hidden;
      border-width: 1px 1px 0 0;
      border-color: #666;
      border-style: solid;
      // background: linear-gradient(225deg,#f00 50%, transparent 50%);
      transform: rotate(135deg);
    }


  }
  .modelVisible{
    display: block;
  }

  table{
    div{
      text-align: center;
    }
  }
  .el-table--scrollable-x .el-table__body-wrapper::-webkit-scrollbar {
    height: 0;
  }
  .el-table{
    thead{
      th{
        color: #fff;
        background: #539af5;
      }
    }
  }
}
.time-wrap{
  height: 100vh;

  .title{
    height: 1rem;
    line-height: 1rem;
    padding: 0 .3rem;
    color: #539af5;
  }

  .time-box{
    padding: 0 .3rem;
    input{
      color: #539af5;
      text-align: center;
      background-color: #eee;
      border-bottom: 1px solid #aaa;
    }
    .active{
      border-bottom: 1px solid #539af5;
    }
  }
  .del-icon{
    margin-top: .2rem;
    margin-right: .3rem;
    img{
      width: .38rem;
      height: .38rem;
    }
    // background: url('../../assets/images/delete.png') no-repeat;
  }
}
</style>

