<!-- 供应商结算详情 -->
<template>
  <common-tpl class="NFC-wrap">
    <!-- 头部 -->
    <template slot="header">
      <!-- 统计 -->
      <div class="NFC-count-table">
        <div class="count-box">
          <div class="box-item">
            <p class="count">供应商名称：{{amountData.total | filterMoney | filterEmpty('元')}}</p>
            <p>订单数：{{amountData.total | filterMoney | filterEmpty('元')}}</p>
            <p>商品费用：{{amountData.total | filterMoney | filterEmpty('元')}}</p>
          </div>
        </div>
        <div class="count-box">
          <div class="box-item">
            <p class="count">{{amountData.stay | filterMoney | filterEmpty('元')}}</p>
            <p>结算总金额</p>
          </div>
        </div>
      </div>

      <br/>

      <third-menu :visible="true">
        <template slot="main">
          <a class='d-ib ta-c cursor-p' :class="{active: pageType === 1}" @click="$router.push({path: '/admin/finance/supplier/details', query: {type: 'goods'}})">按商品显示</a>
          <a class='d-ib ta-c cursor-p' :class="{active: pageType === 2}" @click="$router.push({path: '/admin/finance/supplier/details', query: {type: 'order'}})">按订单显示</a>
        </template>
      </third-menu>
    </template>
    <!-- 主体 -->
    <template slot="main">
      <!-- <div class="block">
        <el-carousel :autoplay="false" arrow="always" trigger="click" height="150px">
          <el-carousel-item v-for="item in 2" :key="item">
            <h3 v-for="list in 4">
              <div class="listbox-wrap">
                <p>订单号：</p>
                <dl class="pos-r">
                  <dt class="pos-a ta-c va-m">
                    图片
                  </dt>
                  <dd class="">
                    <h4>订单金额：{{orderDeta.orderNo}}</h4>
                    <h4>时间：{{orderDeta.orderDeta}}</h4>
                  </dd>
                </dl>
                {{ list }}
              </div>
            </h3>
          </el-carousel-item>
        </el-carousel>
      </div> -->

      <!-- 按商品显示表格 -->
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" v-show="pageType === 1" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="mainImage" label="商品图片" class="good-img">
          <template slot-scope="scope">
            <img :src="scope.row.mainImage | filterImgUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="classify" label="品牌"></el-table-column>
        <el-table-column prop="shopName" label="商品编码"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column prop="goodsPrice" label="进货价（元）"></el-table-column>
        <el-table-column prop="goodsPrice" label="销售价（元）"></el-table-column>
        <el-table-column prop="goodsPrice" label="特卖价（元）"></el-table-column>
        <el-table-column prop="goodsPrice" label="利润率"></el-table-column>
        <el-table-column prop="goodsPrice" label="商品规格"></el-table-column>
        <el-table-column prop="goodsPrice" label="销售数量"></el-table-column>
        <el-table-column prop="goodsPrice" label="结算金额(元)"></el-table-column>
      </el-table>

      <!-- 按订单显示表格 -->
      <el-table :data="orderTableData" style="width: 100%" v-show="pageType === 2">
        <el-table-column prop="classify" label="订单编号"></el-table-column>
        <el-table-column prop="shopName" label="供应商"></el-table-column>
        <el-table-column prop="goodsName" label="订单状态"></el-table-column>
        <el-table-column prop="goodsPrice" label="买家姓名"></el-table-column>
        <el-table-column prop="goodsPrice" label="买家手机号"></el-table-column>
        <el-table-column prop="goodsPrice" label="支付状态"></el-table-column>
        <el-table-column prop="goodsPrice" label="支付方式"></el-table-column>
        <el-table-column prop="goodsPrice" label="实收款"></el-table-column>
        <el-table-column prop="goodsPrice" label="下单时间"></el-table-column>
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

    <template slot="footer">
      <el-button>默认按钮</el-button>
      <el-button>默认按钮</el-button>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      pageType: 1,          // 页面类型
      amountData: {
        total: '30000',     // 结算总金额
        stay: '111',        // 待结算金额
        already: '111'      // 已结算金额
      },
      formData: {
        name: '',                 // 商品名称
        upperLowerTime: [],       // 上下架时间
        platformAttributeValue: '',
        status: '',
        classify: '',
        classifySelectValue: ''   // 多选菜单结果
      },
      orderDeta: {
        orderNo: 'SO20180720272249740',
        orderDeta: '2018-07-20 16:09:19'
      },
      tableData: [],         // 商品显示表格
      orderTableData: [],    // 订单显示表格
      multipleSelection: [],
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
    console.log('$route: ', this.$route.path)
    this.copyPlatformAttributeData = this.$Utils.deepCopy(this.platformAttributeData)
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/goods/NFC/index', (res) => {
      this.formData = res
    })
    this.pageType = this.$route.query.type && this.$route.query.type.match(/goods/gi) ? 1 : 2
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
      // this.$router.push({query: {page: this.pageData.currentPage}})
      // localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      this.$http.post('@ROOT_API/goodsNfc/getGoodsNfcCountList', {
        start: this.pageData.currentPage,                   // 是 int 当前页
        pageSize: this.pageData.pageSize                    // 是 int 每页条数
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.orderTableData = []
          this.pageData.total = 0
          return false
        }
        resData.data.list.forEach((row) => {
          row.classify = row.grandParentName + '-' + row.parentName + '-' + row.attributeTypeName
        })
        this.tableData = resData.data.list
        this.orderTableData = resData.data.list
        this.pageData.total = resData.data.total
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 店铺列表
     */
    getShopList () {
      this.$http.post('@ROOT_API/shopManageController/getShopList', Object.assign({
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
        this.pageData.currentPage !== 1 && this.$router.push({query: {page: this.pageData.currentPage, id: this.shopId}})
      }
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped lang="less">
.NFC-wrap{
  .NFC-count-table{
    max-width: 100%;
    background: #fff;
    padding: 30px;
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

  .block{
    margin-bottom: 20px;
    /*border: 1px solid red;*/

    .el-carousel__container{
      height: auto !important;
    }

    .el-carousel__item is-active is-animating{
      transform: translateX(200px) scale(1);
    }
    .el-carousel__item h3 {
      color: #475669;
      width: 23%;
      float: left;
      margin-left: 23px;
      border: 1px solid #999;
      border-radius: 3px;
      font-size: 14px;
      opacity: 0.75;
      overflow: hidden;

      .listbox-wrap{
        p{
          width: 95%;
          height: 35px;
          line-height: 35px;
          margin: 0 auto;
          border-bottom: 1px solid #eee;
        }

        dl{
          padding: 10px;
          dt{
            width: 80px;
            height: 80px;
            border: 1px solid #999;
          }

          dd{
            padding-left: 100px;

            h4{
              height: 35px;
              line-height: 35px;
            }
          }
        }
      }
    }

    .el-carousel__item:nth-child(2n) {
      /*background-color: #99a9bf;*/
      .el-carousel__item h3 {
        width: 200px;
      }
    }
    
    .el-carousel__item:nth-child(2n+1) {
       /*background-color: #d3dce6;*/
    }
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

      .cell{

        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .search-wrap .retailers-wrap{
    .el-form-item{
      margin-bottom: 0;

      .el-form-item__content{
        margin-left: 0 !important;

        .el-input__inner{
          border-radius: 3px;
          height: 36px;
        }
      }
    }
  }
}
</style>
