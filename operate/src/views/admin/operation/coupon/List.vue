<!-- 优惠券页面 -->
<template>
  <common-tpl class="coupon-index-wrap" footer>
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search :textVisible = "false">
        <div class="pos-r" slot="search">
          <div class="d-ib" style="margin-right: 5px;">
            <el-select v-model="formData.couponType" placeholder="优惠券类型" clearable @change="couponChange">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="d-ib pos-r">
            <el-input placeholder="输入优惠券名称" v-model.trim="formData.couponTitle" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
        </div>
        <div slot="edit">
          <el-button  @click="$router.push({path: '/admin/operation/conversion/coupon/add'})">新增优惠券</el-button>
        </div>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column fixed prop="couponTitle" label="优惠券名称" min-width="180">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.couponTitle | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="优惠券类型" min-width="110">
          <template slot-scope="scope">{{scope.row.couponType | filterCouponType}}</template>
        </el-table-column>
        <el-table-column prop="cardName" label="总库存" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.couponTotal | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="每人限领" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.amountLimit | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="是否开启" min-width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.ifEnable"
              active-color="#56ade8"
              inactive-color="#ccc"
              @change="statusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="orderTime" label="开始时间" width="170">
          <template slot-scope="scope">{{scope.row.effectiveStartTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="payTime" label="截止时间" width="170">
          <template slot-scope="scope">{{scope.row.effectiveEndTime | filterDate}}</template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleLink(scope.row)"><i class="icon el-icon-edit"></i>编辑</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <!-- </template> -->

        <!-- 暂无数据 -->
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

    <template slot="footer">
      <el-button  @click="$router.push({path: '/admin/operation/conversion/list'})">返 回</el-button>
    </template>
    <template slot="other">
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,              // loading
        pageType: '',                // 页面类型［''、全部，0、进行中，1、已结束］
        tableData: [],               // ...
        formData: {
          couponTitle: '',               // 订单编号
          couponType: ''                  // 优惠券id
        },
        options: [{
          value: 1,
          label: '代金券'
        }, {
          value: 2,
          label: '折扣券'
        }],
        pageData: {                   // 分页数据
          currentPage: 1,
          pageSize: 10,
          total: 0
        },

        userInfo: {}                 // 用户信息
      }
    },

    computed: {
    },

    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      let matchPath = this.$route.path.match(/all|ongoing|ended/gi)
      if (matchPath) {
        switch (matchPath[0]) {
          case 'all':
            this.pageType = ''
            break
          case 'ongoing':
            this.pageType = 0
            break
          case 'ended':
            this.pageType = 1
            break
        }
      }
      // 获取tab标签类型
      let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
      localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)
      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData('/admin/operate/operation/conversion/coupon', (res) => {
        if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
      })
      this.getListData()
    },

    methods: {
      /**
       * 获取列表数据
       */
      getListData () {
        this.loading = true
        this.$http.post('@ROOT_API/coupon/page', {
          couponType: this.formData.couponType,
          couponTitle: this.formData.couponTitle,
          ifEnable: this.pageType,
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
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
          this.tableData.forEach(item => {
            item.ifEnable = item.ifEnable === 0 ? !!true : false
          })
          this.pageData.total = data.total
        }).finally(() => {
          this.loading = false
        })
      },
      /**
       * 优惠券选择
       */
      couponChange (value) {
        this.formData.couponType = value
        this.pageChange(1)
      },

      /**
       * 搜索
       */
      searchHandle () {
        this.pageChange(1)
      },
      /**
       * 状态改变
       */
      statusChange (item) {
        this.$http.post('@ROOT_API/coupon/editEnableCoupon', {
          id: item.id,
          ifEnable: item.ifEnable === true ? 0 : 1
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.getListData()
        })
      },

      /**
       * 跳转链接
       */
      handleLink (item) {
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
        let url = '/admin/operation/conversion/coupon/edit'
        this.$router.push({path: url, query: {id: item.id}})
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
          this.$router.push({query: {page: this.pageData.currentPage}})
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
