<!-- 批发管理 - 详情 -->
<template>
  <common-tpl class="wholesale-detail-wrap" footer>

    <template slot="main">
      <div class="total-data">
        <div>
          <div>{{totalData.purchaseAmountTotal | filterEmpty}}</div>
          <div>批发总金额（元）</div>
        </div>
        <div>
          <div>{{totalData.waitSaleAmountTotal | filterEmpty}}</div>
          <div>待销售总金额</div>
        </div>
        <div>
          <div>{{totalData.hasSaleAmountTotal | filterEmpty}}</div>
          <div>已销售总金额（元）</div>
        </div>
        <div class="line"></div>
        <div>
          <div>{{totalData.hasPurchaseNum | filterEmpty}}</div>
          <div>已批发数量（个）</div>
        </div>
        <div>
          <div>{{totalData.waitSaleNum | filterEmpty}}</div>
          <div>待销售数量（个）</div>
        </div>
        <div>
          <div>{{totalData.hasSaleNum | filterEmpty}}</div>
          <div>已销售数量（个）</div>
        </div>
      </div>
      <template>
        <!-- 高级搜索组件 -->
        <high-search :textVisible = "false">
          <div class="pos-r" slot="search">
            <el-input placeholder="请输入会员手机号" v-model.trim="formData.phone" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
          <template slot="edit">
            <el-button :disabled="!tableData.length" @click="exportData">导出</el-button>
          </template>
        </high-search>

      </template>
      <el-table border :data="tableData" class="full-w">
        <el-table-column prop="phone" label="会员手机号" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.phone | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseAmount" label="批发总金额（元）"  min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.purchaseAmount | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="waitSaleAmount" label="待销售总金额（元）" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.waitSaleAmount | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hasSaleAmount" label="已销售总金额（元）" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.hasSaleAmount | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hasSaleAmount" label="已到账收益" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.hasAccount | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hasSaleAmount" label="未到账收益" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.waitAccount | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hasSaleAmount" label="剩余批发券" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.purchaseCoupon | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
            <template slot-scope="scope">
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="handleLink(scope.row)" class="orange"><i class="icon el-icon-view"></i>批发记录</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        <div slot="empty">
          <no-data></no-data>
        </div>
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

    <template slot="other">
    </template>

    <template slot="footer">
      <el-button  @click="goBack">返 回</el-button>
    </template>

  </common-tpl>
</template>

<script>
import pagePaper from '@/mixins/ListPublicPage'
export default {
  mixins: [pagePaper],
  data () {
    return {
      tableData: [],
      confirmLoading: false,  // 确定loading
      formData: {
        goodsId: '',
        phone: ''
      },
      totalData: {
        purchaseAmountTotal: 0,
        waitSaleAmountTotal: 0,
        hasSaleAmountTotal: 0,
        hasPurchaseNum: 0,
        waitSaleNum: 0,
        hasSaleNum: 0
      },
      copyFormData: {},       // 拷贝表单数据
      userInfo: {},           // 用户信息
      assembleData: {}        // 拼团列表数据
    }
  },

  computed: {

  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('warehouse/wholesale/wholesaleDetail', (res) => {
      this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.formData.goodsId = localStorage.getItem(this.$global + 'LuckyBuyGoodsId')
    this.getListData()
    this.getTotalData()
  },

  methods: {
    goBack () {
      let url = '/admin/warehouse/wholesale/index'
      this.$router.push({path: url, query: {}})
    },
    /**
     * 获取详情数据
     */
    getListData () {
      this.$http.get('@ROOT_API/purchase/getPurchaseDetailList', {
        params: {
          goodsId: this.formData.goodsId,
          phone: this.formData.phone,
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
     * 获取total数据
     */
    getTotalData () {
      this.$http.get('@ROOT_API/purchase/getPurchaseDetail', {
        params: {
          goodsId: this.formData.goodsId
        }
      }).then((res) => {
        let results = res.data
        if (parseInt(results.status) !== 1) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        if (results.data !== null && results.data !== '') this.totalData = results.data
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 导出记录
     */
    exportData () {
      let url = 'purchase/exportPurchaseDetail'
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + 'goodsId=' + this.formData.goodsId + '&phone=' + this.formData.phone, '_blank')
    },
    /**
     * 跳转链接
     */
    handleLink (item, type) {
      localStorage.setItem(this.$global + 'LuckyBuyUserPhone', item.phone)
      let url = '/admin/warehouse/wholesale/wholesaleDetailRecord'
      this.$router.push({path: url, query: {}})
    }
  }
}
</script>

<style lang='less' scoped>
.wholesale-detail-wrap{
  .total-data{
    display: flex;
    justify-content: space-around;
    padding: 20px 10px;
    background: rgba(153, 204, 255, 0.4);
    line-height: 3;
    margin-bottom: 20px;
    div{
      text-align: center;
    }
    .line{
      border-left: 1px solid #999;
      height: 96px;
      width: 0px;
    }
  }
}
</style>

<style lang="less">
.wholesale-detail-wrap{
  .search-wrap{
    .search-head-wrap{
      padding: 0 0 20px 0!important;
    }
  }
}
</style>
