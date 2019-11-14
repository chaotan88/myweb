<!-- 订单管理 -->
<template>
  <common-tpl class="barter-index-wrap">
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search :textVisible = "false">
        <div class="pos-r" slot="search">
          <div class="d-ib pos-r">
            <el-input placeholder="输入商品名称或商品编码" v-model.trim="formData.condition" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
        </div>
        <div slot="edit">
          <template v-if="pageType === 1">
            <el-button :disabled="!sels.length" @click="handleBefore(3, '确定审核不通过以下商品？')">批量审核不通过</el-button>
            <el-button :disabled="!sels.length" @click="handleBefore(2, '确定审核通过以下商品？')">批量审核通过</el-button>
          </template>
        </div>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中" @select="handleSelectGoods" @select-all="handleSelectGoods">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="mainImage" label="商品主图" width="100">
          <template slot-scope="scope">
            <div class="">
              <img :src="scope.row.mainImage | filterImgUrl" class="" style="width: 70px;height: 70px;">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNo" label="商品编码" min-width="100"></el-table-column>
        <el-table-column prop="goodsTitle" label="商品标题" min-width="200"></el-table-column>
        <el-table-column prop="goodsPrice" label="价格（元）" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsPrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" min-width="120">
          <template slot-scope="scope">{{scope.row.auditStatus === 1 ? '待审核' : scope.row.auditStatus === 2 ? '审核通过' : scope.row.auditStatus === 3 ? '审核不通过' : '--'}}</template>
        </el-table-column>
        <el-table-column prop="goodsStatus" label="状态" width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus === 2">
              <el-switch
                v-model="scope.row.goodsStatus"
                active-color="#56ade8"
                inactive-color="#ccc"
                @change="statusChange(scope.row)"
              >
              </el-switch>
              {{scope.row.goodsStatus === true ? '上架' : '下架'}}
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="160">
          <template slot-scope="scope">{{scope.row.publishTime | filterDate}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.auditStatus === 1">
                  <div @click="handleLink(scope.row, 'audit')"><i class="icon el-icon-edit"></i>审核</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.auditStatus !== 1">
                  <div @click="handleLink(scope.row, 'detail')"><i class="icon el-icon-view"></i>详情</div>
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

    <template slot="other">
      <!-- 审核 -->
      <el-dialog
        title="审核商品" :visible.sync="dialogVisible" width="500px" class="ta-c">
        <span>{{content}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </template>

  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,              // loading
        dialogVisible: false,
        pageType: '',                // 页面类型［
        formData: {
          condition: ''               // 订单编号
        },
        tableData: [],                // 列表数据
        copyFormData: {},             // 拷贝数据
        sels: [],       // 多选结果集合

        pageData: {                   // 分页数据
          currentPage: 1,
          pageSize: 10,
          total: 0
        },

        userInfo: {},                 // 用户信息
        type: '',
        content: ''
      }
    },

    computed: {
      uploadUrl () {
        return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
      }
    },

    // watch: {
    //   '$route' () {
    //     this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    //     this.getListData()
    //   }
    // },

    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      let matchPath = this.$route.path.match(/all|wait|pass|reject/gi)
      if (matchPath) {
        switch (matchPath[0]) {
          case 'all':
            this.pageType = ''
            break
          case 'wait':
            this.pageType = 1
            break
          case 'pass':
            this.pageType = 2
            break
          case 'reject':
            this.pageType = 3
            break
        }
      }
      // 获取tab标签类型
      let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
      localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)

      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData('/admin/operation/interactive/barter', (res) => {
        if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
      })
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      // 获取tab标签类型
   //   let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
   //   localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)
      this.getListData()
    },

    methods: {
      /**
       * 获取列表数据
       * @param  {[type]} type [数据类型，type存在表示获取导出数据]
       */
      getListData (type) {
        this.$http.post('@ROOT_API/buyAttInfoController/getAttInfoList', {
          condition: this.formData.condition,
          auditStatus: this.pageType,
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
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
          resData.data.list.forEach((row) => {
            row.goodsStatus = (parseInt(row.goodsStatus) === 1) ? !!true : !!false
          })
          this.tableData = resData.data.list
          this.pageData.total = resData.data.total
        }).finally(() => {
          this.loading = false
        })
      },
      handleBefore (type, msg) {
        this.type = type
        this.content = msg
        this.dialogVisible = true
      },
      /**
       * table多选
       */
      handleSelectGoods (selection, row) {
        this.sels = selection
      },
      /**
       * 商品审核
       */
      submit (type) {
        let ids = this.sels.map(item => item.id)
        this.$http.post('@ROOT_API/buyAttInfoController/auditAttInfo', {
          attInfoIds: ids,
          auditStatus: this.type
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
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          this.dialogVisible = false
          this.getListData()
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
      },

      /**
       * 行内操作-跳转页面
       */
      handleLink (row, type) {
        localStorage.setItem(this.$global + 'RowData', JSON.stringify(row))
        if (type === 'audit') {
          let url = '/admin/operation/interactive/barter/audit'
          this.$router.push({path: url, query: {}})
        } else {
          let url = '/admin/operation/interactive/barter/detail'
          this.$router.push({path: url, query: {}})
        }
      },
      /**
       * 状态改变
       */
      statusChange (item) {
        this.$http.post('@ROOT_API/buyAttInfoController/updateGoodsStarus', {
          id: item.id,
          goodsStatus: item.goodsStatus === true ? 1 : 2
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
       * 搜索
       */
      searchHandle () {
        this.pageChange(1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .barter-index-wrap{

    /*----------------搜索-----------*/
    .search-wrap{
      .el-form-item{
        .el-radio-group{
          div{
            margin-right: 20px;
            line-height: 50px;
          }
        }
      }

      .el-dropdown{
        width: 80px;
        top: 0;
        left: -80px;
      }
    }

  }
</style>

<style lang="less">
  .barter-index-wrap{

  }

  .search-wrap .high-search-down .btn-wrap{
    margin-top: 0;
  }

</style>
