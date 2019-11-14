<!-- 批发管理 - 批发记录  -->
<template>
  <common-tpl class="wholesale-record-wrap"  footer>
    <template  slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search :textVisible = "false">
        <template v-if="pageType === 1">\
          <div class="pos-r" slot="search">
            <el-input placeholder="请输入会员手机号" v-model.trim="formData.phone" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
        </template>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>
    </template>
    <template slot="main">
      <el-table border :data="tableData" class="full-w" v-loading="loading">
        <el-table-column prop="orderNo" label="批发订单编号" min-width="140">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="批发会员手机号" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.phone | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseDate" label="批发时间" min-width="160">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.purchaseDate | filterDate}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="批发商品名称" min-width="160">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="wholesalePrice" label="批发价（元）" min-width="140">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.wholesalePrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseNum" label="批发数量" min-width="140">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.purchaseNum | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="purchasePrice" label="抢购价（元）" min-width="160px">
          <template slot-scope="scope">
            <div>{{scope.row.purchasePrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="批发状态" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.status | filterwWoleSaleType}}</div>
          </template>
        </el-table-column>
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
      <el-dialog title="1373773884获得的名额" :visible.sync="dialogTableVisible">
        <el-table :data="datadata">
          <el-table-column property="name" label="订单号" width="150"></el-table-column>
          <el-table-column property="name" label="名额编号" width="200"></el-table-column>
          <el-table-column property="name" label="是否被抢购"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button  @click="goBack">返 回</el-button>
    </template>

  </common-tpl>
</template>

<script>
import pagePaper from '@/mixins/ListPublicPage'
export default {
  mixins: [pagePaper],
  data () {
    return {
      tableData: [],
      datadata: [{name: 1}],
      dialogTableVisible: false,
      confirmLoading: false,  // 确定loading
      loading: false,  // 确定loading
      formData: {
        goodsId: '',
        phone: ''
      },
      copyFormData: {},       // 拷贝表单数据
      userInfo: {},           // 用户信息
      pageType: 1,            // [ 抢购记录：1 详情-抢购记录：2 ]
      assembleData: {}        // 拼团列表数据
    }
  },

  computed: {

  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    // 判断是否同一模块，带出搜索记录
    if (this.$route.path.match(/wholesaleDetailRecord/gi)) {
      this.pageType = 2
      this.formData.phone = localStorage.getItem(this.$global + 'LuckyBuyUserPhone')
    } else {
      this.$Utils.filterSearchData('warehouse/wholesale/wholesaleRecord', (res) => {
        this.formData = res
      })
    }
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.formData.goodsId = localStorage.getItem(this.$global + 'LuckyBuyGoodsId')
    this.getListData()
  },

  methods: {
    goBack () {
      let url = this.pageType === 2 ? '/admin/warehouse/wholesale/wholesaleDetail' : '/admin/warehouse/wholesale/index'
      this.$router.push({path: url, query: {}})
    },
    /**
     * 获取详情数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/purchase/getPurchaseLogList'
      } else {
        url = 'purchase/exportPurchaseLog'
      }
      let data = {
        params: {
          goodsId: this.formData.goodsId,
          phone: this.formData.phone,
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
        }
      }
      if (!type) {
        this.loading = true
        this.$http.get(url, data).then((res) => {
          console.log('url: ', url)
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            this.pageData.total = 0
            this.tableData = []
            return false
          }
          let data = resData.data
          this.tableData = data.list
          this.pageData.total = data.total
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        for (let key in data) {
          filterParams.push(key + '=' + data[key])
        }
        window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + filterParams.join('&') + '&' + 'phone=' + this.formData.phone + '&' + 'goodsId=' + this.formData.goodsId, '_blank')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.wholesale-record-wrap{

  .commodity-details, .relation-public-wrap{
    border-top: 0;
    padding-top: 20px;
  }
  .commodity-details{
    overflow: hidden;

    .el-form-item{

      .tips{
        color: #f5a74a;
        width: 200px;
        height: 60px;
        line-height: 30px;
        margin-top: -30px;
        left: 280px;
        top: 50%;
      }

       .limit{
        color: #999;
      }

      .limit-input{
        width: 300px !important;
        margin: 0 10px;
      }

    }
    .introduce{

      .word-count{
        color: #999;
        left: 570px;
        bottom: -8px;
      }
    }

    .el-form-item{
      .el-select, .el-input, .region-select-wrap, .el-textarea{
        width: 400px;
      }
    }
    .data{
      overflow: hidden;
    }

    /*----------itme图片---------*/
    .picture{
      .el-form-item__content{
        height: 150px;
        border: 1px solid #c8d0da;
      }

      span{
        color: #f5a74a;
        margin-left: 80px;
      }
    }
  }
}
</style>

<style lang="less">
.wholesale-record-wrap{

  .upload-wrap.max{
    .el-upload{
      display: none;
    }
  }

  .el-table{
    .cell{
      overflow: inherit;
    }
    .thumbnail-component-wrap{
      margin-left: 20px;
    }
  }

  .el-form-item__error{
    left: 160px;
  }

  .el-form-item__label{
    margin-right: 10px;
  }

  .el-radio__input.is-checked .el-radio__inner{
    border-color: #409EFF;
    background: #409EFF;
  }

  .el-input-group__append{
    font-size: 14px;
    cursor: pointer;

    span:hover{
      color: #409EFF;
    }
  }

  .el-form-item__content{
    margin-left: 0 !important;
  }

  .integral-wrap{

    .el-form-item__error{
      left: 295px !important;
    }
  }

  .data-error{
    .el-form-item__error{
      left: 0 !important;
    }
  }

  .el-table{
    .sort-wrap{
      .el-icon{
        color: #ccc;
      }

      .el-icon.cursor-p{
        color: #666;
      }

      .el-icon.cursor-p:hover{
        color: #2eaaf7;
      }
      .el-form-item{
        margin-bottom: 0;

        .el-form-item__error{
          left: 0;
        }
      }
    }
    .el-dropdown-link{

      span{
        line-height: 0px;
      }
    }
  }

  .thumbnail-component-wrap{
    margin-left: 162px;
  }
}
</style>
