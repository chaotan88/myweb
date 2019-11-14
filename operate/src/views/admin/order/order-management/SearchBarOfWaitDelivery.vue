<template>
  <div class="search-module clear-float">
    <div class="search-wrap">
      <div class="search-group">
        <div class="search-left">
          <el-date-picker
            v-model="search.startTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <el-date-picker
            v-model="search.endTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="search-right">
          <el-select v-model="search.payType" placeholder="选择支付方式" clearable>
            <el-option
              v-for="item in orderSelectOptions.payMethods"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="search.customerPhone" placeholder="订单编号/客户手机号" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getOrderPage"></el-button>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderSelectOptions from '@/assets/json/orderSelectOptions'
export default {
  data: function () {
    return {
      orderSelectOptions: orderSelectOptions,
      search: {
        startTime: '',  // 开始时间
        endTime: '',    // 结束时间
        payType: '',    // 支付方式
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
      .search-left {
        float: left;
        margin-right: 60px;
      }
      .search-right {
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
      .el-date-editor {
        width: 180px;
      }
      .search-group {
        .search-right {
          .el-input {
            width: 200px;
          }
        }
      }
    }
  }
</style>
