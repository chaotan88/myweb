<template>
  <!-- 终端-申请终端-管理 -->
  <div class="device-assign">
    <div class="device-assign-wrap">
      <div class="list">
        <!-- 搜索 -->
        <div class="line">
          <el-form :inline="true" :model="searchData">
            <el-form-item>
              <el-input v-model="searchData.imei" :placeholder="$t('device.pleaseEnterIMEI')" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="search-btn" @click="pageNum = 1, findData()">
                <i class="el-icon-search"></i>
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="add-btn">
                  {{$t("device.batchAssign")}}
                </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 表格 -->
        <el-table :data="itemList">
          <el-table-column type="index" :label="$t('common.index')" width="80"></el-table-column>
          <el-table-column :label="$t('device.imeiNumber')" width="160">
            <template slot-scope="props">
              <p>{{ props.row.orderName }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.deviceModel')">
            <template slot-scope="props">
              <p>{{ props.row.screenStyle | selectFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.businessBatchNumber')" width="160">
            <template slot-scope="props">
              <p>{{ props.row.needAmount }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.systemBatchNumber')" width="200">
            <template slot-scope="props">
              <p>{{ props.row.applicant }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.inboundDate')" width="200">
          </el-table-column>
          <el-table-column :label="$t('device.batchAssign')">
          </el-table-column>
          <el-table-column prop="operation" :label="$t('common.operation')">
            <template slot-scope="props">
              <el-button class="detail-button">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="pagination-wrap" v-show="total">
      <el-pagination
        layout="prev, pager, next, jumper"
        :current-page.sync="pageNum"
        :page-count="total"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {pageMixin} from '@/mixin'
  
  export default {
    data () {
      return {
        token: '',
        applicationList: [],
        searchData: {
          orderName: null,
          applyStatus: null
        },
        type: 'all'
      }
    },
    mounted () {
      let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
      this.token = adminInfo.token
      this.findData()
    },
    methods: {
      findData () {
        this.itemList = [
          {orderName: 'qweqweq'}
        ]
        this.total = this.itemList.length
      }
    },
    mixins: [pageMixin],
    watch: {
      '$route' () {
        this.type = this.$route.name
      }
    }
  }
</script>

<style lang="less" scoped>
  .device-assign {
    .device-assign-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: rgb(255, 255, 255);
      box-shadow: 0 2px 9px 0.8px rgb(238, 241, 245);
      padding: 0 40px;
    }
  }
</style>
