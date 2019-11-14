<!-- 通用积分流水表 - 账户明细 -->
<template>
  <common-tpl class="cash-list-wrap" :footer="true">
    <!-- 主体 -->
    <template slot="main">
      <!-- 统计 -->
      <div class="statistics-cen">
        <dl class="ta-c fl-l cursor-p" @click="$router.push('/admin/order')">
          <dd class="d-ib va-m ta-l">
            <h3>
              <span>{{statisticsData.memberCount | filterEmpty}}</span>
            </h3>
            <h4>前日通用积分总额</h4>
          </dd>
        </dl>

        <dl class="ta-c fl-l cursor-p" @click="$router.push('/admin/order')">
          <dd class="d-ib va-m ta-l">
            <h3>
              <span>{{statisticsData.memberCount | filterEmpty}}</span>
            </h3>
            <h4>昨日通用积分收入</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p" @click="$router.push('/admin/order')">
          <dd class="d-ib va-m ta-l">
            <h3>
              <span>{{statisticsData.memberCount | filterEmpty}}</span>
            </h3>
            <h4>昨日通用积分支出</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p" @click="$router.push('/admin/order')">
          <dd class="d-ib va-m ta-l">
            <h3>
              <span>{{statisticsData.memberCount | filterEmpty}}</span>
            </h3>
            <h4>昨日通用积分结余</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p" @click="$router.push('/admin/order')">

          <dd class="d-ib va-m ta-l">
            <h3>
              <span>{{statisticsData.memberCount | filterEmpty}}</span>
            </h3>
            <h4>今日实时数据</h4>
          </dd>
        </dl>
      </div>

      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :textVisible="false">
        <div class="pos-r" slot="search">
          <div class="d-ib" style="width: 150px;">
            <el-select class="full-w" v-model="formData.topNum" placeholder="全部科目">
              <el-option label="Top10" value="ten"></el-option>
            </el-select>
          </div>
          &nbsp;
          <div class="d-ib pos-r" style="width: 380px;">

            <!-- 时间 -->
            <el-form ref="form" :rules="rules" :model="formData" label-position="right" class="search-form" label-width="100px">
              <el-form-item label="时间：" class="pos-r apply-date-wrap">
                <el-date-picker type="datetimerange" start-placeholder="年/月/日" end-placeholder="年/月/日" v-model.trim="formData.statisticsDate" clearable @change="statisticsDateChange"></el-date-picker>
              </el-form-item>
            </el-form>

          </div>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>

      <!-- 列表 -->
      <el-table border :data="tableData" style="width: 100%" max-height="525" ref="multipleTable" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="" label="商家姓名">
          <template slot-scope="scope">{{scope.row.transferName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="商家手机号" width="180">
          <template slot-scope="scope">{{scope.row.transferPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="商家ID号" width="180">
          <template slot-scope="scope">{{scope.row.transferInvitationCode | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="交易科目">
          <template slot-scope="scope">{{scope.row.transferPoints | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="交易单号">
          <template slot-scope="scope">{{scope.row.transferPointsSurplus | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="积分变动">
          <template slot-scope="scope">{{scope.row.beTransferName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="通用积分结余" width="180">
          <template slot-scope="scope">{{scope.row.beTransferPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="交易时间" width="180">
          <template slot-scope="scope">{{scope.row.createTime | filterDate}}</template>
        </el-table-column>
        <!-- 暂无数据 -->
        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>
    </template>

    <template slot="other">

    </template>

    <template slot="footer">
      <el-button type="" @click="$router.go(-1)">返 回</el-button>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        contentText: ''
      },
      statisticsData: {},     // 统计数据
      allSubjectData: {},     // 科目数据
      pageData: {             // 分页
        currentPage: 3,
        pageSize: 10,
        total: 10
      }
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))    // 获取用户信息

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/report/giftGiving', (res) => {
      this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    // this.getStatisticsData()   // 获取统计数据
    // this.getAllSubject()       // 获取科目全部数据
    // this.getListData()         // 获取列表数据
  },
  methods: {
    /**
     * 获取统计数据
     */
    getStatisticsData () {
      this.$http.post('@ROOT_API/memberManageController/getMemberStatisticsData', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        if (resData.data) {
          this.statisticsData = resData.data
        }
      })
    },

    /**
     * 获取科目全部数据
     */
    getAllSubject () {
      this.$http.post('@ROOT_API/', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.allSubjectData = resData.data
      })
    },

    /**
     * 时间改变
     */
    statisticsDateChange (value) {
      if (!value) this.onPickDate = ''
    },

    /**
     * 选择账户
     */
    accountChange () {
      this.allSelection = false
      this.getListData()
    },

    /**
     * 获取列表数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/'
        this.loading = true
      } else {
        url = ''
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }
      if (!type) {
        this.$http.post(url, data).then((res) => {
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
      } else {
        let filterParams = []
        for (let key in data) {
          filterParams.push(key + '=' + data[key])
        }
        window.open(this.$dm.ROOT_API + url + '?token=' + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
      }
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
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
.cash-list-wrap{

  /*-------------统计----------*/
  .statistics-cen{
    display: flex;
    justify-content: space-between;

    dl{
      width: 25%;
      height: 140px;
      padding-top: 40px;
      margin-right: 20px;
      margin-bottom: 20px;
      background: #c2e0fe url(../../../../assets/img/product-statistics-basic-bg.jpg);
      background-size: cover;
      border-radius: 5px;
      margin-right: 20px;
      box-sizing: border-box;

      dt, dd{
        height: 60px;
      }

      dt{
        width: 60px;
        height: 50px;
        line-height: 50px;
        margin-right: 5px;
        left: 0;

        .icon{
          fill: #fff;
          width: 100%;
          height: 100%;
        }
      }

      dd{
        top: 0;
        left: 0;
        color: #fff;

        h3{
          font-size: 30px;
          line-height: 35px;
        }

        h4{
          font-size: 16px;
        }
      }
    }

    dl:last-child{
      margin-right: 0;
    }
  }

}
</style>

<style lang="less">
.cash-list-wrap{

 /*------------高级搜索------*/
  .search-wrap{

    .search-head-wrap{
      padding: 0 !important;
      padding-bottom: 20px !important;
    }

    .el-form-item__label{
      position: absolute;
    }

    .el-form-item__content{
      left: 100px;
    }
  }
}
</style>
