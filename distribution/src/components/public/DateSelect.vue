<template>
  <div class="date-select-tabs">
    <el-form label-position="right" label-width="10px">
      <div class="date-tabs">
        <span v-for="(dt, index) in dateTabs" :key="index" @click="dateTypeChange(dt)" :class="selectDateType === dt.value ? 'dt-active' : ''">{{dt.label}}</span>
      </div>
      <el-form-item class="pos-r apply-date-wrap">
        <el-date-picker v-model.trim="formData.statisticsDate"  type="daterange"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          clearable @change="handleFilterDate"
          v-if="selectDateType === 999"></el-date-picker>
          <div v-else>
            <span>{{formData.statisticsDate[0] | filterDate('YYYY-MM-DD')}}</span>
            -
            <span>{{formData.statisticsDate[1] | filterDate('YYYY-MM-DD')}}</span>
          </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  props: {
    dateTabs: {
      type: Array,
      default: () => ([
        { label: '近三个月', value: '3_month' },
        { label: '近半年', value: '6_month' },
        { label: '近一年', value: '12_month' },
        { label: '自定义', value: 999 }
      ])
    }
  },
  data () {
    return {
      formData: {
        statisticsDate: []
      },
      selectDateType: 3
    }
  },
  watch: {},
  mounted () {
    this.selectDateType = this.dateTabs[0]
    this.dateTypeChange(this.dateTabs[0])
  },
  methods: {
    dateTypeChange (item) {
      this.selectDateType = item.value
      var dt = new Date()
      switch (item.value) {
        case '3_month':
          dt.setMonth(dt.getMonth() - 3)
          break
        case '6_month':
          dt.setMonth(dt.getMonth() - 6)
          break
        case '12_month':
          dt.setMonth(dt.getMonth() - 12)
          break
        case '1_day':
          dt.setDate(dt.getDate() - 1)
          break
        case '7_day':
          dt.setDate(dt.getDate() - 7)
          break
        case '15_day':
          dt.setDate(dt.getDate() - 15)
          break
      }
      this.formData.statisticsDate = [dt, new Date()]
      this.dateChange()
    },
    /**
     * 过滤选择时间
     */
    handleFilterDate (data) {
      this.formData.statisticsDate[0] = this.$Utils.filterDate(data[0], 'YYYY-MM-DD')
      this.formData.statisticsDate[1] = this.$Utils.filterDate(data[1], 'YYYY-MM-DD')
      this.dateChange()
    },
    dateChange () {
      this.$emit('dateChange', this.formData.statisticsDate)
    }
  }
}
</script>

<style lang='less'>
  .date-select-tabs {
    background: #fff;
    padding: 10px;
    .el-form {
      display: flex;
      font-size: 13px;
      color: #333;
      background: #D6EBFF;
      line-height: 62px;
      padding-left: 10px;
      .date-tabs {
        span {
          display: inline-block;
          width: 63px;
          height: 38px;
          text-align: center;
          line-height: 38px;
          border: 1px solid rgba(193, 224, 255, 1);
          border-right: 0;
          cursor: pointer;
          background: #FFF;
        }
        span:last-child {
          border-right: 1px solid rgba(193, 224, 255, 1);
        }
        .dt-active {
          background: rgba(193, 224, 255, 1);
        }
      }
      .apply-date-wrap {
        margin-bottom: 0;
        .el-form-item__content {
          margin-top: 11px;
        }
      }
    }
  }
</style>
