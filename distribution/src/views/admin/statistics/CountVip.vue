<!-- 统计 - 会员统计列表 -->
<template>
  <common-tpl class="count-vip">
    <template slot="main">
      <!-- 统计会员总数据 -->
      <statistics-component></statistics-component>

      <!-- 统计数据 -->
      <div class="statistics-data-wrap">

        <!-- 产品收益分布 -->
        <div class="pos-a piechart-wrap">
          <title-public title="产品收益分布"></title-public>
          <div class="common-shadow-wrap piechart-cen">
            <template v-if="profitPieChartData.length">
              <div class="piechart-chart" ref="piechart"></div>
            </template>
            <div class="ta-c no-data-wrap" v-else>
              <svg class="icon icon-no-data" aria-hidden="true">
                <use xlink:href="#icon-no-data"></use>
              </svg>
              <p>暂无数据！</p>
            </div>
          </div>
        </div>

        <!-- 近半年会员增长状况 -->
        <div class="statistics-data-cen">
          <title-public title="近半年会员增长状况"></title-public>
          <div class="pos-r statistics-data-c">
            <div class="echart" ref="statisticsEchart"></div>
          </div>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
          <el-table-column prop="phone" label="会员手机">
            <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="currentIdentity" label="当前身份" width="120">
            <template slot-scope="scope">{{scope.row.currentIdentity | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="adress" label="所属地区">
            <template slot-scope="scope">{{scope.row.adress | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="applyTime" label="注册时间">
            <template slot-scope="scope">{{scope.row.applyTime | filterDate}}</template>
          </el-table-column>
          <el-table-column prop="recommend" label="首锁推荐人">
            <template slot-scope="scope">{{scope.row.recommend | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="endlyTime" label="最后登录时间">
            <template slot-scope="scope">{{scope.row.endlyTime | filterDate}}</template>
          </el-table-column>
          <el-table-column prop="authentication" label="身份认证">
            <template slot-scope="scope">{{scope.row.authentication | filterAuthentication}}</template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="ta-c">
          <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total"@current-change="pageChange" v-if="pageData.total">
          </el-pagination>
        </div>
      </div>
    </template>
  </common-tpl>
</template>

<script>
  import StatisticsComponent from '../../../components/admin/Statistics'
  export default {
    components: {StatisticsComponent},
    data () {
      return {
        loading: false,           // 加载loading
        profitPieChartData: [],   // 产品收益分布
        tableData: [{
          phone: '13576738373',                // 会员手机
          currentIdentity: '县区代理商',       // 当前身份
          adress: '广东省,深圳市,南山区',      // 所属地区
          applyTime: '2018.9.3 6:53:00',       // 注册时间
          recommend: '张三',                   // 首锁推荐人
          endlyTime: '2018.9.3 6:53:00',       // 最后登录时间
          authentication: '未认证'             // 身份认证
        }, {
          phone: '13576738373',                // 会员手机
          currentIdentity: '县区代理商',       // 当前身份
          adress: '广东省,深圳市,南山区',      // 所属地区
          applyTime: '2018.9.3 6:53:00',       // 注册时间
          recommend: '张三',                   // 首锁推荐人
          endlyTime: '2018.9.3 6:53:00',       // 最后登录时间
          authentication: '未认证'             // 身份认证
        }, {
          phone: '13576738373',                // 会员手机
          currentIdentity: '县区代理商',       // 当前身份
          adress: '广东省,深圳市,南山区',      // 所属地区
          applyTime: '2018.9.3 6:53:00',       // 注册时间
          recommend: '张三',                   // 首锁推荐人
          endlyTime: '2018.9.3 6:53:00',       // 最后登录时间
          authentication: '未认证'             // 身份认证
        }, {
          phone: '13576738373',                // 会员手机
          currentIdentity: '县区代理商',       // 当前身份
          adress: '广东省,深圳市,南山区',      // 所属地区
          applyTime: '2018.9.3 6:53:00',       // 注册时间
          recommend: '张三',                   // 首锁推荐人
          endlyTime: '2018.9.3 6:53:00',       // 最后登录时间
          authentication: '未认证'             // 身份认证
        }],
        pageData: {                          // 分页
          currentPage: 1,
          pageSize: 10,
          total: 20
        }
      }
    },
    mounted () {
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.getListData()
    },
    methods: {
      /**
       * 获取列表数据
       */
      getListData () {
        this.loading = true
        this.$router.push({query: {page: this.pageData.currentPage}})
        this.$http.post('@ROOT_API/distributeApplyManage/applyList', {
          start: this.pageData.currentPage,                 // 当前页数
          pageSize: this.pageData.pageSize,                 // 当前页数量
          phone: this.pageData.phone,                       // 会员手机
          currentIdentity: this.formData.currentIdentity,   // 当前身份
          adress: this.formData.adress,                     // 所属地区
          applyTime: this.formData.applyTime,               // 注册时间
          recommend: this.formData.recommend,               // 首锁推荐人
          endlyTime: this.formData.endlyTime,               // 最后登录时间
          authentication: this.formData.authentication      // 身份认证
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
          // 分页数
          this.pageData.total = resData.data.total
          // 列表数据
          this.tableData = resData.data.list
        }).finally(() => {
          this.loading = false
        })
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

<style lang="less">
.count-vip{
  /* -------------------- { 统计数据 } -------------------- */
  .statistics-data-wrap{
    margin-top: 10px;
    padding-left: 50%;
    margin-left: 10px;

    .piechart-cen, .statistics-data-c{
      height: 295px;
      background: #fff;
      border-radius: 5px;
    }

    /* -------------------- { 产品收益分布 } -------------------- */
    .piechart-wrap{
      width: 45%;
      left: 70px;
      border: 1px solid #eee;
      margin-right: 20px;

      .piechart-cen{

        .piechart-chart{
          width: 100%;
          height: 100%;
        }
      }

      .no-data-wrap{
        color: #999;
        font-size: 15px;
        padding: 90px 0;
      }
    }

    .statistics-data-cen{
      border: 1px solid #eee;
      .statistics-data-c{
        box-sizing: border-box;

        .echart{
          width: 100%;
          height: 100%;
        }
        
        .gradient-wrap{
          width: 100px;
          padding-top: 65px;
          right: 30px;
          top: 0;

          .gradient-line{
            color: #fff;
            width: 100%;
            height: 22px;
            line-height: 22px;
            font-size: 12px;
            margin-bottom: 20px;
            border-radius: 11px;
          }

          .gradient-line:last-child{
            margin-top: 10px;
          }
        }

        .gradient-province{
          background: linear-gradient(to right, #9ae86d, #98eae3);
        }

        .gradient-city{
          background: linear-gradient(to right, #21e2ae, #08afe9);
        }

        .gradient-area{
          background: linear-gradient(to right, #fe8795, #f1f374);
        }

        .gradient-child{
          background: linear-gradient(to right, #d881f1, #707cff);
        }

      }
    }
  }

  /*---------------------表格数据---------------------------*/

  .table-box{
    margin-top: 20px;
    padding-bottom: 40px;
    background: #fff;

    .el-pagination{
      margin-top: 20px;
    }
  }
}

</style>