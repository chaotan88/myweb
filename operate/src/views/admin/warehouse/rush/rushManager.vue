<!-- 幸运大转盘 - 抢购管理 -->
<template>
  <common-tpl class="rush-manager-wrap" >
    <template slot="main">
      <el-table border :data="tableData" class="full-w" v-loading="loading">
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
        <el-table-column prop="goodsPrice" label="销售价（元）"  min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.goodsPrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="purchasePrice" label="抢购价（元）"  min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.purchasePrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hasSaleAmount" label="已销售金额（元）" min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.hasSaleAmount | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="waitSaleAmount" label="待销售金额（元）"  min-width="120px">
          <template slot-scope="scope">
            <div>{{scope.row.waitSaleAmount | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseCouponTotal" label="产生批发券数" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.purchaseCouponTotal | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsGroupPrice" label="实际抢购数量" min-width="160px">
          <template slot-scope="scope">
            <!--<el-row type="flex" justify="" align="middle">-->
              <el-progress :percentage="getPercentGrab(scope.row)" color="rgba(255, 153, 0, 1)" :show-text="false" style="width: 80%;"></el-progress>
              <div style="margin-left: 10px;">{{scope.row.grabNumHas + '/' + scope.row.grabNumTotal}}</div>
            <!--</el-row>-->
          </template>
        </el-table-column>
<!--        <el-table-column prop="purchaseCouponTotal" label="累计系统抢购数" min-width="120">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.grabNumTotalSys | filterEmpty}}</div>
          </template>
        </el-table-column>-->
<!--        <el-table-column prop="goodsGroupPrice" label="已购名额基数">
          <template slot-scope="scope">
            <el-form-item label="已购名额基数：" :prop="remark">
              <el-input type="input" v-model="scope.row.remark" maxlength="3" placeholder="限0-100正整数"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="goodsGroupPrice" label="剩余名额上限">
          <template slot-scope="scope">
            <el-form-item label="已购名额基数：" :prop="remark">
              <el-input type="input" v-model="scope.row.remark" maxlength="3" placeholder="限0-100正整数"></el-input>
            </el-form-item>
          </template>
        </el-table-column>-->
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
                  <el-dropdown-item>
                    <div @click="handleLink(scope.row, 'record')" class="orange"><i class="icon el-icon-view"></i>抢购记录</div>
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
      confirmLoading: false,  // 确定loading
      loading: false,  // 确定loading

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
    this.formData.themeId = localStorage.getItem(this.$global.SYSTEM + 'ShareThemeId')
    this.getListData()
  },

  methods: {
    /**
     * 已抢购数量/累计抢购总数
     */
    getPercentGrab (row) {
      if (row.grabNumHas === 0 || row.grabNumHas === null || row.grabNumTotal === 0 || row.grabNumTotal === null) {
        return 0
      } else if (row.grabNumHas !== 0 && row.grabNumHas !== null && row.grabNumHas !== undefined && row.grabNumTotal !== 0 && row.grabNumTotal !== null && row.grabNumTotal !== undefined) {
        return row.grabNumHas / row.grabNumTotal * 100
      }
    },
    /**
     * 获取详情数据
     */
    getListData () {
      this.loading = true
      this.$http.get('@ROOT_API/grab/getGrabGoodsList', {
        params: {
          themeId: this.formData.themeId,
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
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
     * 跳转链接
     */
    handleLink (item, type) {
      localStorage.setItem(this.$global + 'LuckyBuyGoodsId', item.goodsId)
      if (type === 'record') {
        let url = '/admin/warehouse/rush/rushRecord'
        this.$router.push({path: url, query: {}})
      } else {
        let url = '/admin/warehouse/rush/rushDetail'
        this.$router.push({path: url, query: {}})
      }
    }
  }
}
</script>

<style lang='less'>
.rush-manager-wrap{

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
.rush-manager-wrap{

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
