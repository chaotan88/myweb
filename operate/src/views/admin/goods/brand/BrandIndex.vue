<template>
  <common-tpl class="brand-wrap" :footer="false">
    <!-- 头部 -->
    <template slot="header">

      <!-- 高级搜索 -->
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle" :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入品牌名称" v-model.trim="formData.brandName" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div slot="edit">
          <el-button @click="$router.push('/admin/goods/brand/add')"><i class="el-icon-plus fw-b"></i> 新增品牌</el-button>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="brandCode" label="品牌编码">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.brandCode | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌名称">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.brandName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="addName" label="创建人">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.addName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="创建时间">
          <template slot-scope="scope">{{scope.row.addTime | filterDateDot}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="$router.push({path: '/admin/goods/brand/edit', query: {id: scope.row.id, readNum: scope.row.readNum, verifyNum: scope.row.verifyNum}})"><i class="icon el-icon-edit"></i>编辑</div>
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
      condition: '',
      formData: {
        brandName: ''         // 商品名称
      },
      tableData: [],
      pageData: {             // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
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
      // localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      this.$http.post('@ROOT_API/brand/getBrandPage', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        brandName: this.formData.brandName
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
        this.$router.push({query: {page: this.pageData.currentPage, id: this.shopId}})
      }
    }
  }
}
</script>

<style scoped lang="less">
.NFC-wrap{
  .brand-count-table{
    max-width: 100%;
    padding: 30px;
    margin-bottom: 20px;
    background: #fff;
    box-sizing: border-box;


    .count-box{
      float: left;
      width: 50%;
      text-align: center;

      .box-item{
        height: 120px;
        margin-right: 10px;
        background: #c2e0fe;
        font-size: 14px;
        overflow: hidden;
        overflow: hidden;

        .count{
          font-size: 24px;
          margin: 30px 0 0;
        }
      }
    }
    .count-box:last-child{
      .box-item{
        margin-right: 0;
        margin-left: 10px;
      }
    }
  }
  .NFC-count-table:after{
    content: '';
    display: block;
    clear: both;
  }
}
</style>

<style lang="less">
.NFC-wrap{
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
  .el-table_1_column_1{

  }
}
</style>
