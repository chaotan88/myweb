<!-- 供应商结算首页 -->
<template>
  <common-tpl class="supplier-wrap">
    <!-- 头部 -->
    <template slot="header">
      <!-- 统计 -->
      <div class="supplier-list">
        <div class="count-box">
          <div class="box-item">
            <p class="count">{{statisticsData.waitSettleMoneySUM + statisticsData.hasSettleMoneySUM  | filterMoney | filterEmpty('元')}}</p>
            <p>结算总金额</p>
          </div>
        </div>
        <div class="count-box">
          <div class="box-item">
            <p class="count">{{statisticsData.waitSettleMoneySUM | filterMoney | filterEmpty('元')}}</p>
            <p>待结算金额</p>
          </div>
        </div>
        <div class="count-box">
          <div class="box-item">
            <p class="count">{{statisticsData.hasSettleMoneySUM | filterMoney | filterEmpty('元')}}</p>
            <p>已结算金额</p>
          </div>
        </div>
      </div>

      <!-- 高级搜索 -->
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle" :textVisible="false">
        <div class="pos-r" slot="search">
          <!-- 选择供应商 -->
          <div class="d-ib pos-r">
            <el-input placeholder="供应商名称" v-model.trim="formData.condition" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" title="搜索" @click="searchHandle"></i>
          </div>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="supplierName" label="供应商" min-width="180">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.supplierName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="waitSettleOrderNum" label="待结算订单数" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.waitSettleOrderNum | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="waitSettleMoney" label="待结算金额（元）" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.waitSettleMoney | filterMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hasSettleOrderNum" label="已结算订单数" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.hasSettleOrderNum || 0}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hasSettleMoney" label="已结算金额（元）" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.hasSettleMoney | filterMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="contactPhone" label="供应商手机" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.contactPhone | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="settleMethod" label="结算方式" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.settleMethod | filterSettlement}}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleSettlement(scope.row)"><i class="icon el-icon-edit"></i>结算</div>
                  <!-- <div @click="$router.push({path: '/admin/finance/supplier/details', query: {supplierId: scope.row.supplierId}})"><i class="icon el-icon-edit"></i>结算</div> -->
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        @current-change="pageChange"
        v-if="pageData.total">
      </el-pagination>
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      statisticsData: {
        totalAmount: '',            // 结算总金额
        waitSettleMoneySUM: '',     // 待结算金额
        hasSettleMoneySUM: ''       // 已结算金额
      },
      supplierNameData: {},         // 供应商名称
      formLabelWidth: '120px',
      formData: {
        name: '',                   // 商品名称
        condition: '',              // 供应商名称
        classifySelectValue: ''     // 多选菜单结果
      },                   // 排序
      tableData: [],
      shopList: [],
      pageData: {                  // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
    this.statistics()
  },
  methods: {

    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/buySupplierSettleController/getSupplierSettleList', {
        start: this.pageData.currentPage,          // 是 int 当前页
        pageSize: this.pageData.pageSize,          // 是 int 每页条数
        condition: this.formData.condition        // 查询条件
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.pageData.total = 0
          return false
        }
        this.tableData = resData.data.list
        this.pageData.total = resData.data.total
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 获取结算统计
     */
    statistics () {
      this.$http.get('@ROOT_API/buySupplierSettleController/getSettleMoneySUM', {
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          return false
        }
        this.statisticsData = resData.data
        localStorage.setItem(this.$global.SYSTEM + 'statisticsData', JSON.stringify(this.statisticsData))
      })
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageData.currentPage = 1
      this.getListData()
    },

    /**
     * 清空
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
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
        this.$router.push({query: {page: this.pageData.currentPage, id: this.shopId}})
      }
    },

    /**
     * 结算成功操作
     */
    handleSettlement (row) {
      if (!row) return false
      localStorage.setItem(this.$global.SYSTEM + 'SettlementDetails', JSON.stringify(row))
      this.statistics()
      setTimeout(() => {
        this.$router.push({path: '/admin/finance/supplier/details', query: {'supplierId': row.supplierId}})
      }, 30)
    }
  }
}
</script>

<style scoped lang="less">
.supplier-wrap{
  .supplier-list{
    max-width: 100%;
    background: #fff;
    padding: 30px 30px 0 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;


    .count-box{
      width: 33.33%;
      text-align: center;

      .box-item{
        color: #fff;
        height: 120px;
        font-size: 14px;
        padding: 10px 0;
        overflow: hidden;
        background: #c2e0fe url(../../../assets/img/statistics-bg.jpg);
        background-size: cover;
        border-radius: 10px;

        .count{
          font-size: 24px;
          margin: 30px 0 0;
        }
      }
    }
    .count-box:nth-child(1) {
      .box-item{
        margin-right: 10px;
      }
    }
    .count-box:nth-child(2) {
      .box-item{
        margin: 0 5px;
      }
    }
    .count-box:nth-child(3) {
      .box-item{
        margin-left: 10px;
      }
    }
  }
  .supplier-list:after{
    content: '';
    display: block;
    clear: both;
  }
}
</style>

<style lang="less">
.supplier-wrap{
  .select-wrap{

    .el-icon--right{
      line-height: 40px !important;
      right: 5px;
    }
  }
  .caret-wrapper{
    height: 14px;
    .ascending{
      top: -4px;
    }
    .descending{
      bottom: -4px;
    }
  }

  .el-table{
    tr{
      /*border: */
      td:first-child{
        width: 80px;
        height: 80px;

        img{
          width: 80px;
          height: 80px;
        }
      }
    }
  }
  .search-inp.custom{
    .retailers-wrap{
      margin-right: 10px;

      .el-form-item{
        margin-bottom: 0;

        .el-form-item__content{
          margin-left: 0 !important;

          .el-input__inner{
            border-radius: 3px;
            height: 36px;
          }
        }
      }
    }

    .el-input{
      .el-input__inner{
        width: 220px;
      }
    }
  }

  /*-------------供应商结算弹窗----------*/
  .el-dialog{
    width: 40%;
  }
  .el-dialog .el-dialog__body{
    .logistics-infor-wrap{

      table{
        width: 100%;
        border-collapse: collapse;

        tr{
          width: 100%;
          overflow: hidden;

          td{
            color: #666;
            height: 35px;
            line-height: 35px;
            border: 1px solid #ebeef5;
            padding: 10px;
            overflow: hidden;
          }

          td:nth-child(1){
            width: 150px;
            text-align: center;
            padding-right: 20px;
            background: #eef1f9;
          }

          td:nth-child(2){
            text-align: left;
            padding-left: 20px;

            .el-form-item__content{
              margin-left: 0 !important;
              width: 200px;
            }
          }
        }
      }
    }
  }
}
</style>
