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
        { label: '近三个月', value: 3 },
        { label: '近半年', value: 6 },
        { label: '近一年', value: 12 },
        { label: '自定义', value: 999 }
      ])
    }
  },
  data () {
    return {
      formData: {
        statisticsDate: [new Date().setMonth(new Date().getMonth() - 3), new Date()]
      },
      selectDateType: 3
    }
  },
  watch: {},
  mounted () {
    this.dateChange()
  },
  methods: {
    dateTypeChange (item) {
      this.selectDateType = item.value
      var dt = new Date()
      switch (item.value) {
        case 3:
          dt.setMonth(dt.getMonth() - 3)
          break
        case 6:
          dt.setMonth(dt.getMonth() - 6)
          break
        case 12:
          dt.setMonth(dt.getMonth() - 12)
          break
      }
      this.formData.statisticsDate = [dt, new Date()]
    },
    /**
     * 过滤选择时间
     */
    handleFilterDate (data) {
      this.formData.statisticsDate[0] = this.$Utils.filterDate(data[0], 'YYYY-MM-DD')
      this.formData.statisticsDate[1] = this.$Utils.filterDate(data[1], 'YYYY-MM-DD')
    },
    dateChange () {
      this.$emit('dateChange', this.formData.statisticsDate)
    }
  }
}
</script>

<style lang='less' scoped>
  .date-select-tabs {
    .el-form {
      display: flex;
      font-size: 13px;
      color: #333;
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
        }
        span:last-child {
          border-right: 1px solid rgba(193, 224, 255, 1);
        }
        .dt-active {
          background: rgba(193, 224, 255, 1);
        }
      }
    }
  }
</style>
