<!-- 店铺管理 -->
<template>
  <common-tpl :footer="false" class="classify-index-wrap">
    <!-- 头部 -->
    <template slot="header">
      <high-search :textVisible="false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入店铺名称" v-model.trim="formData.condition"  maxLength="50" @keyup.enter.native="searchHandle">
          </el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div slot="edit">
          <template>
            <el-button @click="handleEdit()"><i class="el-icon-plus fw-b"></i> 创建店铺</el-button>
          </template>
        </div>
      </high-search>
    </template>

    <!-- 主体内容 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%">
        <!-- <el-table-column prop="shopDomain" label="二维码">
          <template slot-scope="scope">
            <div :id="'table' + scope.$index"></div>
          </template>
        </el-table-column> -->
        <el-table-column prop="shopName" label="商城名称" width="240"></el-table-column>
        <el-table-column prop="shopGenre" label="商城类型">
          <template slot-scope="scope">{{scope.row.shopGenre | filterShopType}}</template>
        </el-table-column>
        <el-table-column prop="contactName" label="联系人"></el-table-column>
        <el-table-column prop="contactPhone" label="联系方式"></el-table-column>
        <el-table-column prop="attributeTypeName" label="主营业务"></el-table-column>
        <el-table-column prop="totalRevenue" label="总营收（元）"></el-table-column>
        <!--<el-table-column prop="profit" label="利润总额（元）"></el-table-column>-->
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <template>
                  <!-- <el-dropdown-item>
                    <div><i class="icon el-icon-view"></i>部署商场</div>
                  </el-dropdown-item> -->
                  <el-dropdown-item>
                    <div @click="handleEdit(scope.row, scope.row.shopId)"><i class="icon el-icon-edit"></i>编辑</div>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item>
                    <div @click="deleteTipsHandle(scope.row.shopId)"><i class="icon el-icon-delete"></i>删除</div>
                  </el-dropdown-item> -->
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        ref="pagination"
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
      <!-- 删除提示 -->
      <el-dialog
        title="删除店铺"
        :visible.sync="deleteVisible"
        width="480px">
        确定是否删除店铺？
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteHandle()">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      // 列表数据
      tableData: [{
        contactPhone: '12388888845678911'
      }],
      pageData: {                // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      formData: {
        condition: ''             // 查询字段
      },
      deleteId: null,             // 删除店铺
      currentClassify: '',        // 当前分类
      addVisible: false,          // 新增弹窗提示
      deleteVisible: false,       // 删除弹窗
      userInfo: {}                // 用户信息
    }
  },
  mounted () {
    // 判断是否同一模块，带出搜索记录
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.$Utils.filterSearchData(['/admin/authentication/center/index', '/admin/authentication/center/edit'], (res) => {
      this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getTabelData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getTabelData () {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      this.$http.get('@ROOT_API/shopManageController/getShopList', {
        params: {
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          condition: this.formData.condition
        }
      }).then(res => {
        let resData = res.data
        if (resData.status !== '1') {
          if (resData.status !== '9998') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
          }
          // this.tableData = []
          // this.pageData.total = 0
          return false
        }
        // 分页数
        this.pageData.total = resData.data.total
        this.pages = resData.data.pages
        // 列表数据
        this.tableData = resData.data.list
      })
    },

    /**
     * 删除店铺前操作提示
     */
    deleteTipsHandle (id) {
      this.deleteVisible = true
      this.deleteId = id
    },

    /**
     * 删除店铺
     */
    handleEdit (item, id) {
      if (!item) {
        this.$router.push('/admin/authentication/center/add')
      } else {
        localStorage.setItem('MANAGER_STORE', JSON.stringify(item))
        this.$router.push({path: '/admin/authentication/center/edit', query: {id}})
      }
    },

    /**
     * 删除操作
     */
    deleteHandle () {
      this.$http.post('@ROOT_API/shopManageController/deleteShop', {
        shopId: this.deleteId
      }).then(res => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.tableData.map((item, index) => {
          item.shopId === this.deleteId && this.tableData.splice(index, 1)
        })
        this.deleteVisible = false
      })
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageData.currentPage = 1
      this.pageChange(1)
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      if (this.pageData.currentPage === page) {
        this.getTabelData()
      } else {
        this.pageData.currentPage = page
        this.$router.push({query: {page: this.pageData.currentPage}})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.classify-index-wrap{
  background: #fff;
}
</style>
<style lang="less">
.classify-index-wrap{
  .el-table{
    .el-table__row{
      /*height: 125px;*/

      /*td:first-child {
        height: 90px;

        div{
          width: 100px;
          height: 90px;
        }
      }*/
    }
  }
}
</style>

