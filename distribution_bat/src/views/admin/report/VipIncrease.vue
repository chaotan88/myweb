<!-- 会员增长表 -->
<template>
  <common-tpl class="vip-increase-wrap" :footer="false">
    <!-- 统计 -->
    <template slot="header">
      <div class="statistics-cen">
        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-huiyuanzongshu" aria-hidden="true">
              <use xlink:href="#icon-huiyuanzongshu"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>
              <span v-if="statisticsData.memberTotal">{{statisticsData.memberTotal | filterEmpty}}</span>
              <template v-else>--</template>
            </h3>
            <h4>会员总数</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-tian1" aria-hidden="true">
              <use xlink:href="#icon-tian1"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>{{statisticsData.memberGrowSeven || 0}}</h3>
            <h4>近7天新增</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-tian2" aria-hidden="true">
              <use xlink:href="#icon-tian2"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>{{statisticsData.memberGrowThirty || 0}}</h3>
            <h4>近30天新增</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-tian" aria-hidden="true">
              <use xlink:href="#icon-tian"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>{{statisticsData.memberGrowNinety || 0}}</h3>
            <h4>近90天新增</h4>
          </dd>
        </dl>
      </div>

      <high-search :textVisible="false">
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>
    </template>

    <!-- 表单 -->
    <template slot="main">
      <div class="table-wrap">
        <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
          <el-table-column prop="disRuleName" label="会员等级">
            <template slot-scope="scope">
              <template v-if="!scope.row.disRuleId">总计</template>
              <template v-else>{{scope.row.disRuleName | filterEmpty}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="" label="会员总数">
            <template slot-scope="scope">
              <template>{{scope.row.memberTotal | filterEmpty}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="" label="近7天">
            <el-table-column prop="" label="新增会员数">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.memberGrowSeven}}</template>
                <template v-else>{{scope.row.memberGrowSeven | filterEmpty}}</template>
              </template>
            </el-table-column>
            <el-table-column prop="" label="环比">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.memberGrowSevenRingRate | filterEmpty('%')}}</template>
                <template v-else>{{scope.row.memberGrowSevenRingRate | filterEmpty('%')}}</template>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="" label="近30天">
            <el-table-column prop="" label="新增会员数">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.memberGrowThirty}}</template>
                <template v-else>{{scope.row.memberGrowThirty | filterEmpty}}</template>
              </template>
            </el-table-column>
            <el-table-column prop="" label="环比">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.memberGrowThirtyRingRate | filterEmpty('%')}}</template>
                <template v-else>{{scope.row.memberGrowThirtyRingRate | filterEmpty('%')}}</template>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="" label="近90天">
            <el-table-column prop="" label="新增会员数">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.memberGrowNinety}}</template>
                <template v-else>{{scope.row.memberGrowNinety | filterEmpty}}</template>
              </template>
            </el-table-column>
            <el-table-column prop="" label="环比">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.memberGrowNinetyRingRate | filterEmpty('%')}}</template>
                <template v-else>{{scope.row.memberGrowNinetyRingRate | filterEmpty('%')}}</template>
              </template>
            </el-table-column>
          </el-table-column>

          <!-- 暂无数据 -->
          <template slot="empty">
            <no-data></no-data>
          </template>
        </el-table>
      </div>
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
export default{
  data () {
    return {
      loading: false,           // 列表loading
      statisticsData: {},       // 统计数据
      tableData: [],            // 表格数据
      pageData: {               // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      userInfo: {}
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.getStatisticsData()
    this.getListData()
  },

  methods: {
    /**
     * 获取统计数据
     */
    getStatisticsData () {
      this.$http.post('@ROOT_API/memberGrowManageController/getMemberGrowTotal', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.statisticsData = resData.data
      })
    },

    /**
     * 获取列表数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/memberGrowManageController/getMemberGrowList'
        this.loading = true
      } else {
        url = 'memberGrowManageController/exportMemberGrowList'
      }
      if (!type) {
        this.$http.post(url, {
          timeout: 5000
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
          this.tableData = resData.data
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        window.open(this.$dm.ROOT_API + url + '?token=' + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
        this.$router.go(0)
      }
    },

    /**
     * 过滤表格字段显示
     */
    filterTableField (id, arr) {
      // return arr.filter((row) => row.disRuleId === id)[0] || ''
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
        this.$router.push({query: {userId: this.userId, page: this.pageData.currentPage}})
      }
    }
  }
}
</script>
<style lang="less">
.vip-increase-wrap{
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
      background: #c2e0fe url(../../../assets/img/product-statistics-basic-bg.jpg) ;
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

    /*dl:nth-child(2){
      background: #7c55ca;
    }

    dl:nth-child(3){
      background: #e46737;
    }*/

    dl:last-child{
      /*background: #f39817;*/
      margin-right: 0;
    }
  }

  /*------------表单-----------*/
  .table-wrap{

  }
}
</style>