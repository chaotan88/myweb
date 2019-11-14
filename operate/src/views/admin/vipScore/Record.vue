<!-- 积分记录 -->
<template>
  <common-tpl class="record-detail-wrap">
    <!-- 头部 -->
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch" :textVisible="false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入会员姓名/会员手机" v-model.trim="formData.condition" @keyup.enter.native="highSearch"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="highSearch"></i>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form ref="formData" :model="formData" :rules="rules" label-position="right" label-width="100px" class="search-form">
            <el-form-item label="积分类型">
              <el-select v-model="formData.classify" clearable placeholder="选择积分类型" clearable>
                <el-option label="购买商品" value="1"></el-option>
                <el-option label="销售商品" value="2"></el-option>
                <el-option label="推荐用户" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消费时间：" prop="time">
              <el-form-item prop="date1" class="inner-item">
                <el-date-picker type="date" placeholder="请选择日期" v-model="formData.date1"></el-date-picker>
              </el-form-item>
              <span class="fl-l" style="padding: 0 4px;">-</span>
              <el-form-item prop="date2" class="inner-item">
                <el-date-picker type="date" placeholder="请选择日期" v-model="formData.date2"></el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="会员身份" prop="vipLevel">
              <el-select v-model="formData.vipLevel" clearable placeholder="选择会员身份" clearable>
                <template v-for="item in vipLevels">
                  <el-option :label="item.label" :value="item.value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="积分数：">
              <el-form-item prop="score1" class="inner-item">
                <el-input placeholder="输入积分数" v-model="formData.score1"></el-input>
              </el-form-item>
              <span class="fl-l" style="padding: 0 4px;">-</span>
              <el-form-item prop="score2" class="inner-item">
                <el-input placeholder="输入积分数" v-model="formData.score2"></el-input>
              </el-form-item>
            </el-form-item>
          </el-form>
          <div class="clear"></div>
        </div>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="addSource" label="积分类型" min-width="100">
          <template slot-scope="scope">
            {{scope.row.propertyType | filterSourceType}}
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="会员姓名" min-width="100">
          <template slot-scope="scope">
            {{scope.row.customerName | filterEmpty}}
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="会员手机" min-width="120"></el-table-column>
        <el-table-column prop="rankName" label="会员身份" min-width="100">
          <template slot-scope="scope">
            {{scope.row.rankName | filterEmpty}}
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="获得时间" min-width="160">
          <template slot-scope="scope">
            {{scope.row.addTime | filterDate}}
          </template>
        </el-table-column>
        <el-table-column prop="addBonusPoints" label="积分数"></el-table-column>
      </el-table>

       <!-- 分页 -->
      <div class="common-bottom-wrap handleup-b">
       <el-pagination background layout="prev, pager, next" :current-page="currentPage" :total="listTotal" @current-change="pageChange"
       v-if="listTotal"
       ></el-pagination>
      </div>
    </template>

    <!-- 底部 -->
    <!--  <template slot="footer">
      <el-button @click="$router.back()">返回</el-button>
    </template> -->
  </common-tpl>
</template>

<script>
export default {
  data () {
    // 积分验证
    let validateScore = (rule, value, callback) => {
      if (value && (value < 0 || isNaN(value))) return callback(new Error('仅限数字'))
      callback()
    }
    return {
      formData: {
        vipLevel: '',
        date1: '',
        date2: '',
        score1: '',
        score2: '',
        classify: '',
        condition: ''
      },
      rules: {
        score1: [{ validator: validateScore, trigger: 'blur' }],
        score2: [{ validator: validateScore, trigger: 'blur' }]
      },
      // 列表数据
      tableData: [],
      vipLevels: [],
      copyFormData: '',        // 深拷贝
      pageSize: 10,           // 每页分页数
      currentPage: 1,         // 当前分页
      listTotal: 0           // 总条数
    }
  },
  mounted () {
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.$router.push({query: {page: this.currentPage}})    // 地址栏追加当前分页（当你刷新的时候不会回到第一页）
      this.$http.post('@ROOT_API/shopPointsController/getShopPointsDetailList', {
        condition: this.formData.condition,      // 查询条件
        start: this.currentPage,          // 当前页
        pageSize: this.pageSize             // 每页条数
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1' && resData.status !== '9998') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.listTotal = 0
          return false
        }
        this.tableData = resData.data.list
        this.listTotal = resData.data.total        // 自定义好的列表总条数为0，需要传值给后台数据，循环后台传回来的数据
        // success...
      })
    },

    /**
     * 高级搜索
     */
    highSearch () {
      this.currentPage = 1
      this.getListData()
    },

    /**
     * 清空
     */
    resetForm (fieldName) {
      // this.$refs[fieldName].resetFields()
      this.formData = this.$Utils.deepCopy(this.copyFormData)
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      this.currentPage = page
      this.getListData()
    }
  }
}
</script>

<style lang="less" scoped>
.record-detail-wrap{

  /*----------------搜索-----------*/

  .search-form{

    .el-form-item{
      width: 400px;
      float: left;

      .inner-item{
        width: 280px;
      }

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

    .el-form-item:nth-child(even) {
      width: 800px;
    }
  }
}
</style>

<style lang="less">

.search-wrap .high-search-down .btn-wrap{
  margin-top: 0;
}

</style>
