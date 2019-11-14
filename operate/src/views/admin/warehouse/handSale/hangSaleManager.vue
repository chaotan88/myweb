<!-- 幸运大转盘 - 挂售管理 -->
<template>
  <common-tpl class="hang-sale-manager-wrap"  >
    <template slot="main">
      <el-table border :data="tableData" class="full-w" v-loading="loading" >
        <el-table-column prop="mainImage" label="商品图片" min-width="100">
          <template slot-scope="scope">
            <thumbnail-component :list="[{url: scope.row.mainImage}]" :size="50"></thumbnail-component>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNo" label="商品编码" min-width="100">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="200">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsPrice" label="抢购价（元）"  min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.purchasePrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="wholesalePrice" label="批发价（元）"  min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.wholesalePrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="待挂售数量" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.hangNumWait | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="已挂售数量" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.hangNumHas | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="待销售金额" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.hangAmountWait | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="已销售金额" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.hangAmountHas | filterEmpty}}</div>
          </template>
        </el-table-column>
        <template>
          <el-table-column fixed="right" label="操作" width="60">
            <template slot-scope="scope">
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="handleLink(scope.row, 'details')"><i class="icon el-icon-view"></i>详情</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>

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
    </template>

    <template slot="footer">
     <!-- <el-button type="primary" :loading="confirmLoading" @click="submitFormData('formData')">确 定</el-button>-->
    </template>

  </common-tpl>
</template>

<script>
import pagePaper from '@/mixins/ListPublicPage'
export default {
  mixins: [pagePaper],
  data () {
    // 校验正整数
    let validateInt = (rule, value, callback) => {
      if (value && (isNaN(value) || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('请输入正数'))
      callback()
    }
    return {
      tableData: [],
      loading: false,  // loading
      confirmLoading: false,  // 确定loading
      formData: {
        themeId: ''
      },
      materialListData: [],   // 素材列表
      relationGoodsKey: '',   // 关联商品标识符
      buySourceId: '',        // 宣传素材，disseminateType=2时必填
      rules: {
        ticketNum: [{required: true, validator: validateInt, trigger: 'blur'}]
      },
      copyFormData: {},       // 拷贝表单数据
      userInfo: {},           // 用户信息
      assembleData: {}        // 拼团列表数据
    }
  },

  computed: {

  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.formData.themeId = localStorage.getItem(this.$global.SYSTEM + 'ShareThemeId')
    this.getListData()
  },

  methods: {
    /**
     * 得到列表
     */
    getListData () {
      this.loading = true
      this.$http.get('@ROOT_API/purchase/getHangGoodsList', {
        params: {
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          themeId: this.formData.themeId
        }
      }).then((res) => {
        let results = res.data
        if (parseInt(results.status) !== 1) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.pageData.total = 0
          return false
        }
        let data = results.data
        this.tableData = data.list
        this.pageData.total = data.total
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
    },

    /**
     * 跳转链接
     */
    handleLink (item, type) {
      localStorage.setItem(this.$global + 'LuckyBuyGoodsId', item.goodsId)
      if (type === 'details') {
        let url = '/admin/warehouse/handSale/handSaleDetail'
        this.$router.push({path: url, query: {}})
      }
    }
  }
}
</script>

<style lang='less'>
.hang-sale-manager-wrap{
  .search-head-wrap{
    padding: 0 30px 20px 30px !important;
  }

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
.hang-sale-manager-wrap{

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
