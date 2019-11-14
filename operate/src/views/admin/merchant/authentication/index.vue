<!-- 商户认证 -->
<template>
  <common-tpl class="shop-settlement-list-wrap pos-r">
    <!-- 主体 -->
    <template slot="main">
      <div class="search-wrap">
        <div class="d-ib search-cont" style="margin-right: 20px; margin-bottom: 10px;">
          <div class="d-ib pos-r " style="width: 250px;">
            <el-input placeholder="输入会员手机号" v-model.trim="formData.userPhone"></el-input>
            <i class="ta-c pos-a el-icon-search" style="cursor:pointer" title="搜索" @click="searchHandle"></i>
          </div>
        </div>
      </div>
      <el-table border :data="tableData"  ref="multipleTable" style="width: 100%" v-loading="loading" element-loading-text="加载中" fixed="left">
        <el-table-column prop="userPhone" label="认证申请编号">
          <template slot-scope="scope">{{scope.row.applyNo | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="userPhone" label="申请时间">
          <template slot-scope="scope">{{scope.row.applyTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="totalPerformance" label="会员姓名" sortable="1">
          <template slot-scope="scope">{{scope.row.userName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="rankName" label="会员手机号">
          <template slot-scope="scope">{{scope.row.userPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="审核状态" width="180">
          <template slot-scope="scope">{{scope.row.status | filterShopStatus}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.status === 1">
                  <div @click="handleLink('audit', scope.row)"><i class="icon el-icon-edit"></i>审核</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status === 2 || scope.row.status === 3">
                  <div @click="handleLink('view', scope.row)"><i class="icon el-icon-view"></i>查看详情</div>
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
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        tableData: [
        ],
        formData: {
          userPhone: ''               // 会员姓名/手机号
        },
        pageData: {                 // 分页
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        status: 1,
        userInfo: {}              // 用户信息
      }
    },

    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      let pathType = this.$route.path.match(/index|waitcheck|checkin|checkout/gi)[0]
      switch (pathType) {
        case 'index':
          this.status = 0
          break
        case 'waitcheck':
          this.status = 1
          break
        case 'checkin':
          this.status = 2
          break
        case 'checkout':
          this.status = 3
          break
      }

      // 获取tab标签类型
      let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType')
      localStorage.setItem(this.$global.SYSTEM + 'PageType', this.status)

      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData('/admin/merchant/authentication', (res) => {
        if (getPagetype !== '' && parseInt(getPagetype) === this.status || getPagetype === this.status) this.formData = res
      })
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.getListData()               // 得到列表数据
    },
    methods: {

      /**
       * 获取列表数据
       */
      getListData () {
        this.$http.get('@ROOT_API/merchant/getMerchantCaList', {
          params: {
            userPhone: this.formData.userPhone,
            status: this.status,
            pageSize: this.pageData.pageSize,
            start: this.pageData.currentPage
          }
        }
        ).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.tableData = resData.data.list
          this.pageData.total = resData.data.total
        })
      },
      /**
       * 搜索
       */
      searchHandle () {
        this.pageChange(1)
      },
      /**
       * 跳转链接
       */
      handleLink (type, item) {
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
        if (type === 'audit') {
          let url = '/admin/merchant/authentication/check'
          this.$router.push({path: url, query: {id: item.id}})
        } else {
          let url = '/admin/merchant/authentication/detail'
          this.$router.push({path: url, query: {id: item.id}})
        }
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
  .shop-settlement-list-wrap{
    .statistics-basic-wrap{
      /*height: 140px;*/
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      .items{
        width: 33.33%;
        height: 100%;
        margin-right: 25px;
        overflow: hidden;
        /*background: #c2e0fe url(../../../../assets/img/statistics-bg.jpg);*/
        background-size: cover;
        border-radius: 5px;

        dl{
          color: #fff;
          margin-top: 45px;
          margin-left: 20%;
          padding-left: 85px;

          dt{
            width: 70px;
            height: 60px;
            /*background-image: url(../../../assets/img/statistics-bg.jpg);*/
            background-repeat: no-repeat;
            left: 0;
            top: 0;
          }

          .dt2{
            background-position: -70px 0;
          }

          .dt3{
            background-position: -140px 0;
          }

          dd{
            strong{
              height: 28px;
              line-height: 28px;
              font-size: 28px;
              margin-bottom: 12px;
            }
          }
        }
      }

      .items:last-child{
        margin-right: 0;
      }
    }
    .search-wrap{
      margin-bottom: 15px;
      .el-select{
        width: 180px;
      }

      .year-box.el-select{
        width: 120px;
      }

      .el-radio-group{
        vertical-align: top;
      }
    }

    .admin-gray-title{
      margin-bottom: 0;
    }

    .search-form{

      .apply-fee, .apply-time{
        .el-input{
          width: 100%;
        }
      }
    }
    .settle-box{
      .settle-content{
        p:first-child{
          margin-top: 10px;
        }
        p{
          margin-bottom: 10px;
        }
        span{
          color: #fcad30;
        }
      }
    }
  }
</style>

<style lang="less">
  .shop-settlement-list-wrap{
    .search-head-wrap{
      .el-input__inner{
        width: 250px;
      }
    }

    .apply-date-wrap{
      .el-col-5{
        width: 130px;
      }

      .el-col-2{
        width: 41px;
      }

      .el-input--prefix{
        .el-input__inner{
          padding-right: 15px;
        }
      }
    }

    /*----------全部/待结算/已结算切换页----------*/
    .switch-wrap{
      .settle-btn {
        width: 102px;
        height: 36px;
        border-radius: 18px;
        border: solid 1px #2eaaf7;
        font-size: 14px;
        color: #2eaaf7;
        z-index: 10;
      }

      .el-radio-group{
        border-radius: 0;

        .apply-fee-label{
          .el-form-item__content{
            margin-left: 27px !important;
          }

          .el-radio-button:first-child .el-radio-button__inner{
            border-left: none;
          }
        }

        .el-radio-button__orig-radio:checked+.el-radio-button__inner{
          color: #409EFF;
          background: none;
          border: none;
          border-top: 2px solid #409EFF;
          border-right: 1px solid #dcdfe6;
          border-radius: 0;
        }

        .el-radio-button__inner{
          box-shadow: none;
        }

        .is-active{
          border-left: none;
        }
      }
    }

    .el-radio-button--medium .el-radio-button__inner{
      padding: 10px;
    }

    .search-cont{
      .el-input__inner{
        height: 36px;
        border-radius: 30px !important;
      }

      .el-icon-search{
        right: 13px;
        top: 10px;
      }
    }

    .el-table{
      .caret-wrapper{
        width: 0;
        height: 14px;
      }
      .sort-caret{

      }
      .sort-caret.ascending{
        top: -5px;
      }
      .sort-caret.descending{
        bottom: -3px;
      }

      .el-table__column-filter-trigger{
        line-height: 0;
      }
    }

    .active{
      color: red;
    }
  }
</style>
