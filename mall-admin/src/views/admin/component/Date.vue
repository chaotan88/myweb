<template>
  <common-tpl class="date-wrap">
    <template slot="header">
      <el-button type="primary">滚动</el-button>
    </template>
    <template slot="main">
      <el-date-picker type="daterange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :picker-options="pickerOptions"
        :default-value="timeDefaultShow"
        v-model="chooseTime">
    </el-date-picker>
    </template>
  </common-tpl>
</template>

<script>
import Utils from '@/global/function'
export default {
  data () {
    return {
      chooseTime: '',
      timeDefaultShow: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() + (60 * 60 * 1000)
          // return time.getTime() < Date.now() + (24 * 60 * 60 * 1000) || time.getTime() > (Date.now() + (30 * 24 * 60 * 60 * 1000))
        }
      }
    }
  },
  created () {
    this.timeDefaultShow = new Date()
    this.timeDefaultShow.setMonth(new Date().getMonth() - 1)
  },
  mounted () {
    Utils.scroll(this.$refs.wrap)
  }
}
</script>

<style lang="less" scoped>
.scroll-wrap{

  .scroll-cen{
    height: 240px;
    overflow-y: scroll;
  }
}
</style>
