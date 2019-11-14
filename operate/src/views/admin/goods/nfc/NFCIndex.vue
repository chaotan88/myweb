<template>
  <common-tpl class="NFC-wrap" :footer="false">
    <!-- 头部 -->
    <template slot="header">
      <!-- 统计 -->
      <div class="NFC-count-table">
        <div class="count-box">
          <div class="box-item">
            <p class="count">{{nfcReadCount | filterEmpty}}</p>
            <p>NFC总读取次数</p>
          </div>

        </div>
        <div class="count-box">
          <div class="box-item">
            <p class="count">{{nfcVerifyCount | filterEmpty}}</p>
            <p>NFC总验证次数</p>
          </div>
        </div>
      </div>

      <!-- 高级搜索 -->
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入店铺名称/商品名称/商品编码" style="width: 260px;" v-model="condition" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" title="搜索" @click="searchHandle"></i>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm('form')">清空</div>

        <div slot="main">
          <el-form ref="form" :model="formData" label-position="right" label-width="100px" class="search-form">
            <el-form-item label="商品名称">
              <el-input v-model="formData.name" placeholder="请输入商品名称" clearable></el-input>
            </el-form-item>

            <el-form-item label="上下架状态">
              <el-select v-model="formData.status" placeholder="选择上下架状态" clearable>
                <el-option label="已上架" value="1"></el-option>
                <el-option label="已下架" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="商品分类: " prop="platformAttributeValue" class="commodity">
              <el-dropdown trigger="click" placement="bottom-start">
                <div class="pos-r select-wrap" ref="el-platform-attribute">
                  <el-input placeholder="请选择分类" class="pos-r" readonly v-model="formData.platformAttributeValue" clearable @change="platformAttributeClearable" clearable>
                    <i class="pos-a el-icon-arrow-down el-icon--right" slot="suffix"></i>
                  </el-input>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <platform-attribute :initData="platformAttributeData" @change="platformAttributeChange"></platform-attribute>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>

            <el-form-item label="上下架时间">
              <el-date-picker
                clearable
                v-model="formData.upperLowerTime"
                type="daterange"
                range-separator="至"
                start-placeholder="2018-1-22"
                end-placeholder="2018-1-23">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="供应商名称">
              <supplier-select text=" " :id="formData.supplierId" @change="supplierChange"></supplier-select>
            </el-form-item>
            <div class="clear"></div>
          </el-form>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%" @sort-change="sortChange">
        <el-table-column prop="mainImage" label="缩略图" class="good-img">
          <template slot-scope="scope">
            <img :src="scope.row.mainImage | filterImgUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="goodsNo" label="商品编码" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="classify" label="类目" min-width="180">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.classify | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="shopName" label="供应商名称" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.shopName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="260">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsPrice" label="单价（元）" sortable="custom">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsPrice | filterMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="saleStatus" label="上架状态" min-width="100">
          <template slot-scope="scope">{{scope.row.saleStatus | filterSaleStatus}}</template>
        </el-table-column>
        <el-table-column prop="upSaleTime" label="上/下架时间" sortable="custom" width="160">
          <template slot-scope="scope">{{scope.row.upSaleTime | filterDateDot}}</template>
        </el-table-column>
        <el-table-column prop="readNum" label="读取次数" sortable="custom" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.readNum | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="verifyNum" label="验证次数" sortable="custom" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.verifyNum | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="$router.push({path: '/admin/goods/NFC/detail', query: {id: scope.row.goodsId, readNum: scope.row.readNum, verifyNum: scope.row.verifyNum}})"><i class="icon el-icon-view"></i>详情</div>
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
      nfcReadCount: null,       // nfc查询次数
      nfcVerifyCount: null,       // nfc验证次数
      highSearchClose: true,    // 高级搜索开/关
      condition: '',
      formData: {
        supplierId: null,           // 供应商id
        name: '',                 // 商品名称
        upperLowerTime: [],       // 上下架时间
        platformAttributeValue: '',
        status: '',
        classify: '',
        classifySelectValue: ''   // 多选菜单结果
      },
      sortA: '',                   // 排序
      sortD: '',                   // 排序
      platformAttributeData: {  // 平台属性
        large: {            // 大类
          id: '',
          name: ''
        },
        middle: {           // 中类
          id: '',
          name: ''
        },
        small: {            // 小类
          id: '',
          name: ''
        }
      },
      tableData: [],
      shopList: [],
      pageData: {             // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      copyPlatformAttributeData: null
    }
  },
  mounted () {
    this.copyPlatformAttributeData = this.$Utils.deepCopy(this.platformAttributeData)
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/goods/NFC/index', (res) => {
      this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getReadCount()
    this.getVerifyCount()
    this.getShopList()
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$router.push({query: {page: this.pageData.currentPage}})
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      this.$http.post('@ROOT_API/goodsNfc/getGoodsNfcCountList', {
        start: this.pageData.currentPage,                   // 是 int 当前页
        pageSize: this.pageData.pageSize,                   // 是 int 每页条数
        goodsName: this.formData.name,                      // 否 String  商品名称
        condition: this.condition,
        sortA: this.sortA,
        sortD: this.sortD,
        shopId: this.formData.shopId,
        attributeTypeId: this.platformAttributeData.small.id,        // 否 int 商品分类id 小类
        parentId: this.platformAttributeData.middle.id,              // 否 int 商品分类id 中类
        grandParentId: this.platformAttributeData.large.id,          // 否 int 商品分类id 大类
        // 否 int 上下架状态 1 上架 2 下架
        saleStatus: this.formData.status ? parseInt(this.formData.status) : '',
        // 审核状态 0 未审核 1 审核通过 2 审核不通过
        reviewStatus: this.pageStatus,
        // 商品上架开始时间
        upSaleTimeBegin: this.formData.upperLowerTime[0] ? this.$Utils.filterDate(this.formData.upperLowerTime[0], 'YYYY-MM-DD') : '',
        // 商品上下架时间
        upSaleTimeEnd: this.formData.upperLowerTime[1] ? this.$Utils.filterDate(this.formData.upperLowerTime[1], 'YYYY-MM-DD') : '',
        supplierId: this.formData.supplierId
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
        resData.data.list.forEach((row) => {
          row.classify = row.grandParentName + '-' + row.parentName + '-' + row.attributeTypeName
        })
        this.tableData = resData.data.list
        this.pageData.total = resData.data.total
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 店铺列表
     */
    getShopList () {
      this.$http.post('@ROOT_API/shopManageController/getHomeShopList', Object.assign({
        start: 1,
        pageSize: 100000,
        isAudit: 2
      }, this.formData)).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          if (resData.status !== '9998') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
          }
          this.shopList = []
          return false
        }
        // success...
        // 列表数据
        this.shopList = resData.data.list
      })
    },

    /**
     * 查询NFC总读取次数
     */
    getReadCount () {
      this.$http.get('@ROOT_API/goodsNfc/getGoodsNfcReadNum', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.nfcReadCount = resData.data
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 查询NFC总验证次数
     */
    getVerifyCount () {
      this.$http.get('@ROOT_API/goodsNfc/getGoodsNfcVerifyNum', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.nfcVerifyCount = resData.data
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 平台属性改变
     */
    platformAttributeClearable (val) {
      this.platformAttributeData = this.$Utils.deepCopy(this.copyPlatformAttributeData)
      // this.platformAttributeList = []
    },

    /**
     * 平台属性选择
     */
    platformAttributeChange (results) {
      this.platformAttributeData = results
      let arr = []
      if (results.large.name) arr.push(results.large.name)
      if (results.middle.name) arr.push(results.middle.name)
      if (results.small.name) arr.push(results.small.name)
      this.formData.platformAttributeValue = arr.join(' / ')
      if (results.small.id || results.small.name) this.$Utils.triggerEvent(this.$refs['el-platform-attribute'])
      this.getAttributeById(results.small.id)
    },

    /**
     * 排序
     */
    sortChange (row) {
      this.sortA = ''
      this.sortD = ''
      if (row.prop === 'goodsPrice') {
        if (row.order === 'ascending') {
          this.sortA = 1
        } else {
          this.sortD = 1
        }
      } else if (row.prop === 'upSaleTime') {
        if (row.order === 'ascending') {
          this.sortA = 2
        } else {
          this.sortD = 2
        }
      } else if (row.prop === 'readNum') {
        if (row.order === 'ascending') {
          this.sortA = 3
        } else {
          this.sortD = 3
        }
      } else if (row.prop === 'verifyNum') {
        if (row.order === 'ascending') {
          this.sortA = 4
        } else {
          this.sortD = 4
        }
      }
      console.log(this.sortA)
      console.log(this.sortD)
      this.getListData()
    },

    /**
     * 供应商选择
     */
    supplierChange (value) {
      this.formData.supplierId = value
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageData.currentPage = 1
      this.getListData()
    },

    /**
     * 清空
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
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
  .NFC-count-table{
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
