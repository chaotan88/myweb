<!-- 评价管理-首页 -->
<template>
  <common-tpl class="manage-wrap" :footer="false">
     <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入订单编号" v-model.trim="formData.orderNo" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
      </high-search>
    </template>
    <template slot="main">

      <!-- 表单 -->
      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column prop="customerName" label="买家姓名">
          <template slot-scope="scope">{{scope.row.customerName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="买家手机号">
          <template slot-scope="scope">{{scope.row.customerPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="commentType" label="评价类型">
          <template slot-scope="scope">
            {{scope.row.commentType | filterEvaluateStatus}}
          </template>
        </el-table-column>
        <el-table-column prop="commentContent" label="留言" >
          <template slot-scope="scope">{{scope.row.commentContent | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="isShow" label="是否显示" fixed="right">
          <template slot-scope="scope">
            {{scope.row.isShow ? '是' : '否'}}
            <el-switch
            	v-model="scope.row.isShow"
              active-color="#56ade8"
              @change="handleSwitch(scope.row)"
              inactive-color="#ccc">
            </el-switch>
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
                  <div @click="handleDetails(scope.row)"><i class="icon el-icon-view"></i>详情</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
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
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      loading: false,         // loading
      pageType: 0,            // 0-全部，1-好评，2-中评，3-差评
      // 列表数据
      tableData: [],
      formData: {
        orderNo: ''
      },
      pageData: {             // 分页
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      statusData: {}         // 上下架对象
    }
  },
  mounted () {
    switch (this.$route.path.match(/index|praise|center|difference/gi)[0]) {
      case 'index':
        this.pageType = 0
        break
      case 'praise':
        this.pageType = 1
        break
      case 'center':
        this.pageType = 2
        break
      case 'difference':
        this.pageType = 3
        break
    }
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    // 获取tab标签类型
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/order/evaluate/', (res) => {
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
      this.$http.post('@ROOT_API/comment/list', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        commentType: parseInt(this.pageType),
        orderNo: this.formData.orderNo
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        // success...
        this.tableData = resData.data.list
        this.tableData.map(item => {
          item.isShow = item.isShow === 1 ? !!true : !!false
        })
        this.pageData.total = resData.data.total
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 改变状态
     */
    handleSwitch (item) {
      this.$http.post('@ROOT_API/comment/changeShowStatus', {
        id: item.id,
        isShow: item.isShow ? 1 : 0
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        // success...
      })
    },

    /**
     * 详情
     */
    handleDetails (item) {
      localStorage.setItem(this.$global.SYSTEM + 'CommonDetails', JSON.stringify(item))
      this.$router.push('/admin/order/evaluate/details')
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
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    }
  }
}
</script>

<style lang="less" scoped>
.manage-wrap{
	.search{
		width: 15%;
		margin: 20px 30px;
		.el-input{
			border-radius: 30px;

		}
		.el-input__inner{
			border-radius: 30px;
		}

		i{
			right: 10px;
			top: 10px;
		}
	}
  .search-form{

    .el-form-item{
      width: 50%;
      float: left;

      .el-input, .el-select, .el-date-editor{
        width: 280px;
      }

      .time-type-wrap{
        width: 100px;
        padding-right: 10px;
        box-sizing: border-box;
        left: -100px;
      }
    }
  }

  .admin-common-main{
    padding-top: 20px;
  }

  .select-wrap{
    height: 36px;
    line-height: 36px;

    .el-icon-arrow-down{
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-top: -10px;
      top: 50%;
      right: 0;
    }
  }
}
</style>

