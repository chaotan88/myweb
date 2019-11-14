<template>
  <div class="search-module">
    <div class="search-wrap clear-float">
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
      </div>
      <div class="search-group">
        <el-select v-model="search.orderState" placeholder="选择订单状态" clearable>
          <el-option
            v-for="item in orderSelectOptions.orderStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="search.payState" placeholder="选择支付状态" clearable>
          <el-option
            v-for="item in orderSelectOptions.payStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
        orderState: '', // 订单状态
        payType: '',    // 支付方式
        payState: '',   // 支付状态
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
  .search-module {
    /* 搜索框 */
    .search-wrap {
      .search-group:first-child {
        float: left;
      }
      .search-group+.search-group {
        float: right;
      }
    }
    .clear-float::after {
      content: '';
      display: block;
      clear: both;
    }
  }
</style>

<style lang="less">
  .search-module {
    /* 搜索框 */
    .search-wrap {
      .el-select {
        .el-input {
          width: 140px;
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
      .search-group+.search-group {
        > .el-input {
          width: 240px;
        }
      }
    }
  }
</style>
