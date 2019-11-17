<!-- 供应商结算 -->
<template>
  <common-tpl class="supplier-wrap">
    <!-- 头部 -->
    <template slot="header">
      <!-- 统计 -->
      <div class="supplier-list">
        <div class="count-box">
          <div class="box-item">
            <p class="count">{{nfcReadCount | filterEmpty}} 元</p>
            <p>结算总金额</p>
          </div>
        </div>
        <div class="count-box">
          <div class="box-item">
            <p class="count">{{nfcVerifyCount | filterEmpty}} 元</p>
            <p>待结算金额</p>
          </div>
        </div>
        <div class="count-box">
          <div class="box-item">
            <p class="count">{{nfcVerifyCount | filterEmpty}} 元</p>
            <p>已结算金额</p>
          </div>
        </div>
      </div>

      <!-- 高级搜索 -->
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle" :textVisible="false">
        <div class="pos-r" slot="retailers">
          <el-form :model="formData" ref="formData" label-width="100px" class="demo-formData">
              <el-form-item>
                <el-select v-model="formData.orderStatusCopy" placeholder="选择供应商">
                  <el-option label="久零网" :value="1"></el-option>
                  <el-option label="跨境电商" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
        </div>
        <div class="pos-r" slot="search">
          <el-input placeholder="输入结算单号/供应商名称" v-model="condition" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" title="搜索" @click="searchHandle"></i>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="goodsNo" label="供应商"></el-table-column>
        <el-table-column prop="classify" label="订单数量"></el-table-column>
        <el-table-column prop="shopName" label="结算状态"></el-table-column>
        <el-table-column prop="goodsName" label="结算金额"></el-table-column>
        <el-table-column prop="goodsPrice" label="供应商手机"></el-table-column>
        <el-table-column prop="goodsPrice" label="结算方式"></el-table-column>
        <el-table-column prop="upSaleTime" label="结算生成时间" width="160">
          <template slot-scope="scope">{{scope.row.upSaleTime | filterDateDot}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="$router.push({path: '/admin/finance/supplier/details', query: {goodsId: scope.row.goodsId, readNum: scope.row.readNum, verifyNum: scope.row.verifyNum}})"><i class="icon el-icon-view"></i>详情</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="SettlementBefore(scope.row)"><i class="icon el-icon-edit"></i>结算</div>
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

      <!-- 供应商结算弹窗 -->
      <el-dialog title="供应商结算" :visible.sync="settlementVisible">
        <el-form :model="SettlementData">
          <div class="logistics-infor-wrap">
            <table>
              <tr>
                <td>结算金额</td>
                <td>{{SettlementData.SettleAmount}}</td>
              </tr>
              <tr>
                <td>供应商编号</td>
                <td>GY0001</td>
              </tr>
              <tr>
                <td>供应商名称</td>
                <td>久零网</td>
              </tr>
              <tr>
                <td>结算方式</td>
                <td>周期结算</td>
              </tr>
              <tr>
                <td>订单数</td>
                <td>6</td>
              </tr>
              <tr>
                <td>扣除金额</td>
                <td>
                  <el-form-item :label-width="formLabelWidth">
                    <el-input v-model="SettlementData.Deductions" auto-complete="off"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>实际结算金额</td>
                <td>{{SettlementData.SettleAmount - SettlementData.Deductions}} 元</td>
              </tr>
            </table>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="settlementVisible = false">取 消</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="settlementVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      confirmLoading: false,        // 确定loading
      nfcReadCount: null,           // nfc查询次数
      nfcVerifyCount: null,         // nfc验证次数
      highSearchClose: true,        // 高级搜索开/关
      settlementVisible: false,     // 结算弹窗
      dialogTableVisible: false,
      SettlementData: {
        SettleAmount: '1330',       // 结算金额
        Deductions: '',             // 结算金额
        AmountPayable: ''           // 结算金额
      },
      formLabelWidth: '120px',
      condition: '',
      formData: {
        name: '',                   // 商品名称
        upperLowerTime: [],         // 上下架时间
        platformAttributeValue: '',
        status: '',
        classify: '',
        classifySelectValue: ''     // 多选菜单结果
      },
      sortA: '',                    // 排序
      sortD: '',                    // 排序
      platformAttributeData: {      // 平台属性
        large: {                    // 大类
          id: '',
          name: ''
        },
        middle: {                   // 中类
          id: '',
          name: ''
        },
        small: {                    // 小类
          id: '',
          name: ''
        }
      },
      tableData: [],
      shopList: [],
      pageData: {                   // 分页
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
    this.$Utils.filterSearchData('/admin/goods/supplier/index', (res) => {
      this.formData = res
    })

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
        upSaleTimeEnd: this.formData.upperLowerTime[1] ? this.$Utils.filterDate(this.formData.upperLowerTime[1], 'YYYY-MM-DD') : ''
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

    /**
     * 结算前操作
     */
    SettlementBefore (row) {
      this.actionType = row.rechargeType === 1 ? 2 : 1
      this.settlementVisible = true
      this.examineData = row
    },

    /**
     * 结算成功操作
     */
    handleSuccess () {
      this.settlementVisible = false
      this.getListData()
    }
  }
}
</script>

<style scoped lang="less">
.supplier-wrap{
  .supplier-list{
    max-width: 100%;
    background: #fff;
    padding: 30px;
    box-sizing: border-box;


    .count-box{
      float: left;
      width: 33.33%;
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
  .supplier-list:after{
    content: '';
    display: block;
    clear: both;
  }
}
</style>

<style lang="less">
.supplier-wrap{
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
      /*border: */
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

  /*-------------供应商结算弹窗----------*/
  .el-dialog{
    width: 40%;
  }
  .el-dialog .el-dialog__body{
    .logistics-infor-wrap{

      table{
        width: 100%;
        border-collapse: collapse;

        tr{
          width: 100%;
          overflow: hidden;

          td{
            color: #666;
            height: 35px;
            line-height: 35px;
            border: 1px solid #ebeef5;
            padding: 10px;
            overflow: hidden;
          }

          td:nth-child(1){
            width: 150px;
            text-align: center;
            padding-right: 20px;
            background: #eef1f9;
          }

          td:nth-child(2){
            text-align: left;
            padding-left: 20px;

            .el-form-item__content{
              margin-left: 0 !important;
              width: 200px;
            }
          }
        }
      }
    }
  }
}
</style>
