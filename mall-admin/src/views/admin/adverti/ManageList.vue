<!-- 广告位设置 - 移动端 & PC端 -->
<template>
  <common-tpl :footer="false" class="adverti-public-wrap">
    <!-- 主体内容 -->
    <template slot="main">
      <el-table v-loading="loading" element-loading-text="加载中"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column prop="applicationTerminal" label="应用端" width="150">
          <template slot-scope="scope">
            {{scope.row.applicationTerminal | filterAppType}}
          </template>
        </el-table-column>
        <el-table-column prop="putLocation" label="投放位置">
          <template slot-scope="scope">
            <template v-if="parseInt(scope.row.applicationTerminal) === 1">{{scope.row.putLocation | filterMobilePutLocation}}</template>
            <template v-else>{{scope.row.putLocation | filterPcPutLocation}}</template>
          </template>
        </el-table-column>
        <el-table-column prop="advertPositionDetailList" label="广告位图片">
          <template slot-scope="scope">
            <div class="thumbnail-wrap d-ib" v-for="item in scope.row.advertPositionDetailList">
              <img :src="item.image | filterImgUrl">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="isShow" label="是否启用">
          <template slot-scope="scope">
            {{scope.row.isShow ? '是' : '否'}}
            <el-switch
              v-model="scope.row.isShow"
              active-color="#56ade8"
              inactive-color="#ccc"
              @change="statusChange(scope.row)">
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
                  <div @click="$router.push({path: '/admin/adverti/manage/edit', query: {id: scope.row.id}})"><i class="icon el-icon-edit"></i>管理</div>
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
      <el-pagination background layout="prev, pager, next" v-if="pageData.total"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        @current-change="pageChange">
      </el-pagination>
    </template>

    <!-- 底部 -->
    <template slot="footer"></template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      loading: false,     // loading
      pageType: 1,        // 当前页面 [1、移动端，2、PC端]
      // 列表数据
      tableData: [],
      pageData: {         // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.pageType = this.$route.path.match(/pc/gi) ? 2 : 1
    this.pageData.currentPage = this.$route.query.page || 1
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$router.push({query: {page: this.pageData.currentPage}})
      this.$http.post('@ROOT_API/advertPosition/list', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        applicationTerminal: this.pageType
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
        this.tableData = resData.data.list
        this.tableData.forEach((item) => {
          item.isShow = item.isShow ? !!true : !!false
        })
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 分页操作
     */
    pageChange () {},

    /**
     * 是否启用
     */
    statusChange (row) {
      this.$http.post('@ROOT_API/advertPosition/changeShowStatus', {
        id: row.id,
        isShow: row.isShow ? 1 : 0
      })
    }
  }
}
</script>

<style lang="less" scoped>
.adverti-public-wrap{
  .thumbnail-wrap{
    width: 50px;
    height: 50px;
    margin-right: 10px;

    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
