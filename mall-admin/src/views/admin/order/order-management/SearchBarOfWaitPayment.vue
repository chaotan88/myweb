<template>
  <div class="search-module clear-float">
    <div class="search-wrap">
      <div class="search-group">
        <el-date-picker
          v-model="search.startTime"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-date-picker
          v-model="search.endTime"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-input v-model="search.customerPhone" placeholder="订单编号/客户手机号" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getOrderPage"></el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      search: {
        startTime: '',  // 开始时间
        endTime: '',    // 结束时间
        customerPhone: '' // 客户手机号或订单编号
      }
    }
  },
  methods: {
    getOrderPage: function () {
      // 获取订单列表
      this.$emit('transferSearchData', this.search)
    }
  }
}
</script>

<style lang="less" scoped>
  /* 搜索 */
  .search-module {
    /* 搜索框 */
    .search-wrap {
      .search-group {
        float: right;
      }
    }
  }
</style>

<style lang="less">
  /* 搜索 */
  .search-module {
    /* 搜索框 */
    .search-wrap {
      .el-select {
        .el-input {
          width: 118px;
        }
      }
      input {
        height: 36px;
        background-color: #f8f8f8;
        border-color: #c8d0da;
      }
      .search-group {
        .el-date-editor.el-input {
          width: 180px;
        }
        .el-input {
          width: 240px;
        }
      }
    }
  }
</style>
