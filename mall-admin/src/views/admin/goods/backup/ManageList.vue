<!-- 商品管理 -->
<template>
  <common-tpl class="goods-manage-list-wrap">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入商品名称/商品编码" v-model.trim="formData.name" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" title="搜索" @click="searchHandle"></i>
        </div>
        <template slot="edit">
          <el-button :disabled="!selectionRes.length" @click="handleBatchExamine" v-if="pageStatus === 3">批量提交审核</el-button>
          <template v-if="pageType === 0 && pageStatus === 1">
            <el-button @click="batchHandle(2)">批量下架</el-button>
            <!-- <el-button @click="batchHandle(1)">批量上架</el-button> -->
          </template>
          <template v-if="pageType === 1 && pageStatus === 0">
            <el-button @click="batchExamineHandle(2)">审核不通过</el-button>
            <el-button @click="batchExamineHandle(1)">审核通过</el-button>
          </template>

          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>

          <!-- <el-dropdown>
            <el-button>
              导入<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><div @click="$router.push('/admin/goods/manage/import-data')">导入商品基础资料</div></el-dropdown-item>
              <el-dropdown-item><div @click="$router.push('/admin/goods/manage/import-img')">导入商品图片</div></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

          <template v-if="pageType === 0">
            <el-button @click="$router.push('/admin/goods/manage/add')"><i class="el-icon-plus fw-b"></i> 新增</el-button>
          </template>
        </template>

        <div class="reset-btn" slot="btn" @click="resetForm('form')">清空</div>

        <div slot="main">
          <el-form ref="form" :model="formData" label-position="right" label-width="100px" class="search-form">
            <el-form-item label="关键词：">
              <el-input v-model.trim="formData.name" placeholder="请输入商品名称/商品编码"></el-input>
            </el-form-item>
            <el-form-item label="新增时间：">
              <el-date-picker
                v-model="formData.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="年 / 月 / 日"
                end-placeholder="年 / 月 / 日">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="上下架时间：">
              <el-date-picker
                v-model="formData.upperLowerTime"
                type="daterange"
                range-separator="至"
                start-placeholder="年 / 月 / 日"
                end-placeholder="年 / 月 / 日">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="上下架状态：">
              <el-select v-model="formData.status" placeholder="选择上下架状态">
                <el-option label="已上架" value="1"></el-option>
                <el-option label="已下架" value="2"></el-option>
              </el-select>
            </el-form-item>

            <!-- 商品类目 -->
            <el-form-item label="商品类目：" class="commodity">
              <el-dropdown trigger="click" placement="bottom-start">
                <div class="pos-r select-wrap" ref="el-platform-attribute">
                  <el-input placeholder="请选择商品类目" class="pos-r" readonly v-model="formData.platformAttributeValue" clearable @change="platformAttributeClearable">
                    <i class="pos-a el-icon-arrow-down el-icon--right" slot="suffix"></i>
                  </el-input>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <platform-attribute :initData="formData.platformAttributeData" @change="platformAttributeChange"></platform-attribute>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
            <!-- <el-form-item label="商品类目">
              <el-dropdown trigger="click" placement="bottom-start">
                <div class="pos-r classify-wrap" ref="dropdownLink">
                  <el-input placeholder="请选择商品分类" class="pos-r" readonly v-model.trim="formData.classifySelectValue" @change="classifyChange" clearable>
                    <i class="pos-a el-icon-arrow-down el-icon--right" slot="suffix"></i>
                  </el-input>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <goods-classify :initData="multipleMenu" @change="classifySelectChange"></goods-classify>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item> -->
            <div class="clear"></div>
          </el-form>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%"
        ref="multipleTable"
        v-loading="loading" element-loading-text="加载中"
        @select="selectionChange"
        @select-all="selectionChange">
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column prop="pictrue" label="商品图片" min-width="60">
          <template slot-scope="scope">
            <div class="thumbnail-wrap">
              <img :src="scope.row.mainImage | filterImgUrl" class="full-wrap">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNo" label="商品编码" min-width="100"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="300"></el-table-column>
        <!-- <el-table-column prop="goodsPrice" label="单价（元）" width="120">
          <template slot-scope="scope">
            多规格
            <template v-if="scope.row.multStandard === 1">{{scope.row.goodsPrice}}</template>
            <template v-if="scope.row.multStandard === 0 && scope.row.goodsSkuList">{{scope.row.goodsSkuList[0].whetherSpecial === 1 ? scope.row.goodsSkuList[0].goodsSpecialPrice : scope.row.goodsSkuList[0].goodsPrice}}</template>
          </template>
        </el-table-column> -->
        <el-table-column prop="reviewStatus" label="SKU库存" width="100">
          <template slot-scope="scope">
            <div class="ta-c" style="color: #56ade8; font-size: 20px; padding-right: 10px">
              <i class="el-icon el-icon-edit cursor-p" title="调整库存" @click="handleAdjustmentSkuBefore(scope.row)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="reviewStatus" label="审核状态" width="120">
          <template slot-scope="scope">{{scope.row.reviewStatus | filterGoodsReviewStatus}}</template>
        </el-table-column>
        <el-table-column prop="saleStatus" label="上架状态" width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.reviewStatus === 0 || scope.row.reviewStatus === 2 || scope.row.reviewStatus === 3 || pageStatus === 2">--</template>

            <template v-if="scope.row.reviewStatus === 1">
              {{scope.row.saleStatus | filterSaleStatus}}
              <el-switch
                v-model="scope.row.saleStatus"
                active-color="#56ade8"
                inactive-color="#ccc"
                @change="statusChange(scope.row)"
                v-show="scope.row.saleStatus === true">
              </el-switch>
              <!-- v-if="pageType !== 1" -->
            </template>

            <!-- <template v-if="scope.row.reviewStatus === 2 && pageStatus !== 2">{{scope.row.saleStatus | filterSaleStatus}}</template> -->

          </template>
        </el-table-column>
        <el-table-column prop="time" label="上/下架时间" width="160">
          <template slot-scope="scope">
            {{scope.row.upSaleTime | filterDate('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="goodsSort" label="排序" width="160">
          <template slot-scope="scope">
            {{scope.row.goodsSort | filterEmpty}}
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <!-- 商品管理 -->
                <template v-if="pageType === 0">
                  <template v-if="!scope.row.saleStatus && scope.row.reviewStatus !== 0">
                    <el-dropdown-item>
                      <div @click="$router.push({path: '/admin/goods/manage/edit', query: {id: scope.row.id}})"><i class="icon el-icon-edit"></i>编辑</div>
                    </el-dropdown-item>
                    <!-- <el-dropdown-item>
                      <div @click="copyHandle(scope.row)"><i class="icon el-icon-edit"></i>复制</div>
                    </el-dropdown-item> -->
                    <el-dropdown-item>
                      <div @click="deleteBeforeHandle(scope.row)" v-if="!scope.row.saleStatus"><i class="icon el-icon-delete"></i>删除</div>
                    </el-dropdown-item>
                  </template>
                  <el-dropdown-item>
                    <div @click="$router.push({path: '/admin/goods/manage/details', query: {id: scope.row.id}})"><i class="icon el-icon-view"></i>详情</div>
                  </el-dropdown-item>
                </template>

                <!-- 商品审核 -->
                <template v-else>
                  <el-dropdown-item>
                    <div @click="$router.push({path: '/admin/goods/examine/details', query: {id: scope.row.id}})"><i class="icon" :class="{'el-icon-view': pageStatus === 1, 'el-icon-edit': pageStatus === 0}"></i>{{pageStatus === 0 ? '审核' : '详情'}}</div>
                  </el-dropdown-item>
                </template>
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
      <!-- 调整库存 -->
      <el-dialog
        title="调整库存"
        :visible.sync="adjustmentSkuVisible"
        width="860px">
        <div class="adjustment-sku-wrap">
          <el-form :model="adjustmentSkuData" ref="sku-form">
            <div class="ta-l pos-r adjustment-sku-search">
              <span class="goods-no">商品编码：{{adjustmentSkuData.goodsNo}}</span>
              <el-input size="medium" class="d-ib fl-r pos-r" style="width: auto;" placeholder="输入SKU编码/规格值" v-model="skuSearchText" @keyup.enter.native="handleSkuSearch(skuSearchText)"></el-input>
              <i class="cursor-p pos-a el-icon el-icon-search" @click="handleSkuSearch(skuSearchText)"></i>
            </div>
            <table class="adjustment-sku-table">
              <tr>
                <th>SKU编码</th>
                <template v-if="adjustmentSkuData && adjustmentSkuData.goodsSkuList && adjustmentSkuData.goodsSkuList[0]">
                  <th v-for="item in adjustmentSkuData.goodsSkuList[0].goodsSkuValList">{{item.standardName}}</th>
                </template>
                <th>当前库存</th>
                <th>调整库存</th>
                <th>实际库存</th>
                <th>操作</th>
              </tr>
              <tr v-if="item.visible" v-for="(item, index) in adjustmentSkuData.goodsSkuList">
                <td>{{item.skuNo | filterEmpty}}</td>
                <td v-for="list in item.goodsSkuValList">{{list.standardValName | filterEmpty}}</td>
                <td><el-input size="medium" disabled v-model="item.currentGoodsNum"></el-input></td>
                <td class="pos-r pd-r">
                  <el-form-item :prop="'goodsSkuList.' + index + '.updateGoodsNum'" :rules="ruleUpdateGoodsNum">
                    <el-input size="medium" v-model="item.updateGoodsNum" @focus="updateGoodsData = item" @input="handleUpdateGoodsNum"></el-input>
                  </el-form-item>
                  <span title="一键同步" class="pos-a sync-btn">
                    <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('updateGoodsNum')">
                      <use xlink:href="#icon-jiantou3"></use>
                    </svg>
                  </span>
                </td>
                <td><el-input size="medium" disabled v-model="item.goodsNum"></el-input></td>
                <td>
                  <span class="cursor-p btn" @click="handleClearSpec(item)">清空</span>
                  <template v-if="parseInt(adjustmentSkuData.multStandard) === 1">
                    &nbsp;&nbsp;
                    <span class="cursor-p btn" @click="handleDisStatusChange(item)">{{item.disStatus === 1 ? '启用' : '禁用'}}</span>
                  </template>
                </td>
              </tr>
              <tr v-if="!skuListFlag">
                <td colspan="10">
                  <no-data></no-data>
                </td>
              </tr>
            </table>
          </el-form>

        </div>
        <el-button size="medium" @click="adjustmentSkuVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleUpdateSku" :loading="adjustmentSkuLoading">确定</el-button>
      </el-dialog>

      <!-- 删除提示 -->
      <el-dialog
        title="删除商品"
        :visible.sync="deleteVisible"
        width="480px">
        确定是否删除商品？
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
    let validateUpdateGoodsNum = (rule, value, callback) => {
      if (value && !value.toString().match(/^[-]?\d+$/gi)) return callback(new Error('请输入正确的数值'))
      callback()
    }

    return {
      loading: false,                 // loading
      pageType: 0,                    // 页面类型［0、商品管理，1、商品审核］
      pageStatus: 0,                  // 商品管理:［0、待审核，1、审核通过，2、审核驳回］;   商品审核:［0、待审核，1、审核通过，2、审核不通过］
      multipleMenu: {                 // 多选菜单
        large: {                      // 大类
          id: '',
          name: ''
        },
        middle: {                     // 中类
          id: '',
          name: ''
        },
        small: {                      // 小类
          id: '',
          name: ''
        }
      },
      copyMultipleMenu: {},           // 拷贝多选菜单
      copyPlatformAttributeData: {},  // 拷贝平台属性
      platformAttributeList: [],      // 平台小类属性值
      tableData: [],                  // 列表数据
      formData: {
        name: '',                     // 商品名称
        createTime: [],               // 新增时间
        upperLowerTime: [],           // 上下架时间
        timeType: '',                 // 时间类型
        timeTypeMsg: '新增时间',
        status: '',
        classify: '',
        classifySelectValue: '',      // 多选菜单结果
        platformAttributeValue: '',   // 属性分类
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
        }
      },
      copyFormData: {},               // 拷贝数据
      deleteVisible: false,           // 删除弹窗
      deleteData: '',                 // 删除id
      pageData: {                     // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      selectionRes: [],               // 多选结果

      skuSearchText: '',              // sku搜索关键词
      adjustmentSkuVisible: false,    // 调整库存弹窗
      adjustmentSkuLoading: false,    // 调整库存加载中
      adjustmentSkuData: {},          // 调整库存选择数据
      skuListFlag: true,              // 是否显示暂无数据
      syncIndex: 0,                   // 一键同步索引值

      ruleUpdateGoodsNum: [{validator: validateUpdateGoodsNum, trigger: 'blur'}],

      updateGoodsData: {},            // 当前调整库存数据

      userInfo: {}                    // 用户信息
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    // this.copyPlatformAttributeData = this.$Utils.deepCopy(this.platformAttributeData)
    this.copyMultipleMenu = this.$Utils.deepCopy(this.multipleMenu)
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    // 商品审核
    if (this.$route.path.match(/examine/gi)) this.pageType = 1
    // 状态 [0 未审核 1 审核通过 2 审核不通过]
    let matchPath = this.$route.path.match(/all|wait|pass|reject|unsubmit/gi)[0]
    switch (matchPath) {
      case 'all':
        this.pageStatus = -2
        break
      case 'wait':
        this.pageStatus = 0
        break
      case 'pass':
        this.pageStatus = 1
        break
      case 'reject':
        this.pageStatus = 2
        break
      case 'unsubmit':
        this.pageStatus = 3
        break
    }
    // 获取tab标签类型
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageStatus)
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageStatus)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/goods/manage', (res) => {
      if (getPagetype && parseInt(getPagetype) === this.pageStatus || getPagetype === this.pageStatus) this.formData = res
    })
    this.$Utils.filterSearchData('/admin/goods/examine', (res) => {
      if (getPagetype && parseInt(getPagetype) === this.pageStatus || getPagetype === this.pageStatus) this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/goods/getGoodsList'
      } else {
        url = 'goodsExcel/getGoodsListSupplierByExcel'
      }
      // this.selectionRes.map(row => row.id)
      let data = {
        start: this.pageData.currentPage,                   // 是 int 当前页
        pageSize: this.pageData.pageSize,                   // 是 int 每页条数
        goodsName: this.formData.name,                      // 否 String  商品名称
        condition: this.formData.name,
        platformTypeId: this.formData.platformAttributeData.small.id,             // 否 int 商品分类id 小类
        platformTypeParentId: this.formData.platformAttributeData.middle.id,      // 否 int 商品分类id 中类
        platformTypeGrandParentId: this.formData.platformAttributeData.large.id,  // 否 int 商品分类id 大类
        timeType: parseInt(this.formData.timeType),         // 否 int 时间类型 1 新增商品时间 2 商品上下架时间
        // 否 int 开始时间
        createTimeBegin: this.formData.createTime ? this.$Utils.filterDate(this.formData.createTime[0]) : '',
        // 否 int 结束时间
        createTimeEnd: this.formData.createTime ? this.$Utils.completionEndDate(this.formData.createTime[1]) : '',
        // 否 int 上下架状态 1 上架 2 下架
        saleStatus: this.formData.status ? parseInt(this.formData.status) : '',
        // 审核状态 0 未审核 1 审核通过 2 审核不通过
        reviewStatus: this.pageStatus,
        // 商品上架开始时间
        upSaleTimeBegin: this.formData.upperLowerTime ? this.$Utils.filterDate(this.formData.upperLowerTime[0]) : '',
        // 商品上下架时间
        upSaleTimeEnd: this.formData.upperLowerTime ? this.$Utils.completionEndDate(this.formData.upperLowerTime[1]) : ''
      }
      if (!type) {
        this.loading = true
        this.$http.post(url, data).then((res) => {
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
            row.saleStatus = (parseInt(row.saleStatus) === 1) ? !!true : !!false
          })
          this.tableData = resData.data.list
          this.pageData.total = resData.data.total
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        for (let key in data) {
          filterParams.push(key + '=' + data[key])
        }
        window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
      }
    },

    /**
     * 过滤
     */
    filterSelection (row, index) {
      if (row.reviewStatus === 3) {
        return 1
      } else {
        return 0
      }
    },

    /**
     * 多级菜单选择
     */
    classifySelectChange (results) {
      this.multipleMenu = results
      let arr = []
      if (results.large.name) arr.push(results.large.name)
      if (results.middle.name) arr.push(results.middle.name)
      if (results.small.name) arr.push(results.small.name)
      this.formData.classifySelectValue = arr.join(' / ')
      if (results.small.id || results.small.name) this.$Utils.triggerEvent(this.$refs.dropdownLink)
    },

    /**
     * 分类改变
     */
    classifyChange (val) {
      this.multipleMenu = this.$Utils.deepCopy(this.copyMultipleMenu)
    },

    /**
     * 平台属性改变
     */
    platformAttributeClearable (val) {
      this.formData.platformAttributeData = this.$Utils.deepCopy(this.copyPlatformAttributeData)
      this.platformAttributeList = []
    },

    /**
     * 平台属性选择
     */
    platformAttributeChange (results) {
      this.formData.platformAttributeData = results
      let arr = []
      if (results.large.name) arr.push(results.large.name)
      if (results.middle.name) arr.push(results.middle.name)
      if (results.small.name) arr.push(results.small.name)
      this.formData.platformAttributeValue = arr.join(' / ')
      if (results.small.id || results.small.name) this.$Utils.triggerEvent(this.$refs['el-platform-attribute'])
      // this.getAttributeById(results.small.id)
    },

    /**
     * 根据平台小类查询属性及值（新增商品）
     */
    getAttributeById (attributeTypeId) {
      this.$http.post('@ROOT_API/goods/getAttributeValByType', {
        attributeTypeId
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.platformAttributeList = []
          return false
        }
        this.platformAttributeList = resData.data
        resData.data.forEach((row) => {
          this.platformAttributeSelectList.push({
            id: row.id,
            attributeType: row.attributeType,
            attributeValList: []
          })
        })
      })
    },

    /**
     * 高级搜索时间类型选择
     */
    commandHandle (command) {
      this.formData.timeType = command
      this.formData.timeTypeMsg = parseInt(command) === 1 ? '新增时间' : '上下架时间'
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 清空重置搜索
     */
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      this.multipleMenu = this.$Utils.deepCopy(this.copyMultipleMenu)
      localStorage.removeItem(this.$global.FORM_DATA)
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
     * table 多选
     */
    selectionChange (selection, row) {
      this.selectionRes = selection
    },

    /**
     * 批量上下架
     */
    batchHandle (type) {
      if (!type) return false
      if (!this.selectionRes.length) {
        this.$message({
          message: '请选择需要' + (type === 1 ? '上架' : '下架') + '的商品',
          type: 'error',
          duration: 1500
        })
        return false
      }
      let ids = []
      this.selectionRes.forEach((row) => {
        ids.push(row.id)
      })
      this.$http.get('@ROOT_API/goods/updateBatchGoodsUpOrDown', {
        params: {
          ids: ids.join(','),       // 是 int 商品id串，英文逗号分隔
          saleStatus: type                        // 是 int 上下架状态 1 上架 2下架
        }
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
        // success...
        this.$message({
          message: resData.msg,
          duration: 1000,
          type: 'success'
        })
        this.selectionRes = []
        this.getListData()
      })
    },

    /**
     * 批量通过/不通过
     * @param  {[类型]} type [1、审核通过，2、审核不通过]
     */
    batchExamineHandle (type) {
      if (!type) return false
      let text = ''
      if (type === 1) {
        text = '审核通过'
      } else {
        text = '审核不通过'
      }
      if (!this.selectionRes.length) {
        this.$message({
          message: '请选择需要' + text + '的商品',
          type: 'error',
          duration: 1500
        })
        return false
      }
      let ids = []
      this.selectionRes.forEach((row) => {
        ids.push(row.id)
      })
      this.$http.get('@ROOT_API/goods/updateBatchGoodsReviewStatus', {
        params: {
          ids: ids.join(','),       // 是 int 商品id串，英文逗号分隔
          reviewStatus: type
        }
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
        this.selectionRes = []
        this.getListData()
      })
    },

    /**
     * 批量提交审核
     */
    handleBatchExamine () {
      let ids = this.selectionRes.map(row => row.id)
      this.$http.get('@ROOT_API/goods/submitBatchGoodsReviewStatus', {
        params: {
          ids: ids.join(',')
        }
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
        this.selectionRes = []
        this.getListData()
      })
    },

    /**
     * 搜索sku编码或规格值
     */
    handleSkuSearch (value) {
      this.skuListFlag = false
      this.syncIndex = null
      this.adjustmentSkuData.goodsSkuList.forEach((row, index) => {
        row.visible = false
        if (row.skuNo.toString().match(new RegExp(value, 'gi'))) {
          row.visible = true
          this.skuListFlag = true
        }
        if (row.goodsSkuValList.length) {
          row.goodsSkuValList.forEach((list) => {
            if (list.standardValName.toString().match(new RegExp(value, 'gi'))) {
              row.visible = true
              this.skuListFlag = true
            }
          })
        }
        if (row.visible && this.syncIndex === null) this.syncIndex = index
      })
    },

    /**
     * 调整库存前操作
     */
    handleAdjustmentSkuBefore (row) {
      this.adjustmentSkuVisible = true
      this.skuListFlag = true
      this.skuSearchText = ''
      // this.skuListData = []
      this.adjustmentSkuData = {}
      // 过滤数据
      row.goodsSkuList.forEach((list) => {
        list.updateGoodsNum = ''
        list.visible = true
      })
      this.adjustmentSkuData = this.$Utils.deepCopy(row)
      // this.skuListData = this.$Utils.deepCopy(row.goodsSkuList)
    },

    /**
     * 调整库存
     */
    handleUpdateGoodsNum (value) {
      if (!value || !value.toString().match(/^[-]?\d+$/gi)) {
        this.updateGoodsData.goodsNum = this.updateGoodsData.currentGoodsNum
        return false
      }
      let currentGoodsNum = parseInt(this.updateGoodsData.currentGoodsNum)
      this.updateGoodsData.goodsNum = currentGoodsNum ? currentGoodsNum + parseInt(value) : parseInt(value)
    },

    /**
     * 一键同步
     * @param  {[String]} key [需要同步的键]
     */
    handleSync (key) {
      let currentVal = this.adjustmentSkuData.goodsSkuList[this.syncIndex][key]
      if (!currentVal || isNaN(currentVal)) {
        return false
      }
      let defVal = null
      this.adjustmentSkuData.goodsSkuList.forEach((row) => {
        if (row.visible) {
          if (defVal === null) defVal = row[key]
          if (defVal) {
            row[key] = defVal
            if (key === 'updateGoodsNum') {
              let currentGoodsNum = parseFloat(row.currentGoodsNum) || 0
              row.goodsNum = currentGoodsNum + parseFloat(defVal)
            }
          }
        }
      })
      this.$refs['sku-form'].clearValidate(key)
    },

    /**
     * 清除规格数据
     */
    handleClearSpec (obj) {
      obj.currentGoodsNum = 0
      obj.updateGoodsNum = 0
      obj.goodsNum = 0
    },

    /**
     * sku状态 禁用 || 启用
     */
    handleDisStatusChange (obj) {
      obj.disStatus = obj.disStatus ? 0 : 1
    },

    /**
     * 状态改变
     */
    statusChange (item) {
      this.$http.post('@ROOT_API/goods/updateGoodsUpOrDown', {
        id: item.id,
        saleStatus: item.saleStatus === true ? 1 : 2
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
     * 复制（新增一条下架状态数据）
     */
    copyHandle (row) {
      this.$http.post('@ROOT_API/goods/copyGoods', {
        id: row.id
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
        this.getListData()
      })
    },

    /**
     * 删除提示
     */
    deleteBeforeHandle (row) {
      this.deleteVisible = true
      this.deleteData = row
    },

    /**
     * 删除操作
     */
    deleteHandle () {
      this.$http.post('@ROOT_API/goods/deleteGoodsById', {
        id: this.deleteData.id
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
        this.deleteVisible = false
        this.getListData()
      })
    },

    /**
     * 调整库存
     */
    handleUpdateSku () {
      this.$refs['sku-form'].validate((valid) => {
        if (!valid) return false
        this.adjustmentSkuLoading = true
        let goodsSkuNumList = []
        this.adjustmentSkuData.goodsSkuList.forEach((row) => {
          goodsSkuNumList.push({
            id: row.id,
            currentGoodsNum: row.currentGoodsNum,
            updateGoodsNum: row.updateGoodsNum,
            goodsNum: row.goodsNum,
            disStatus: parseInt(this.adjustmentSkuData.multStandard) === 1 ? row.disStatus : 0
          })
        })
        this.$http.post('@ROOT_API/goods/updateSkuNum', {goodsSkuNumList}).then((res) => {
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
          this.adjustmentSkuLoading = false
          this.adjustmentSkuVisible = false
          this.getListData()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.goods-manage-list-wrap{

  .search-wrap{
    .search-edit-wrap{
      .el-dropdown{
        height: 36px;
        line-height: 36px;
        vertical-align: -2px;
        margin: 0 5px;

        .el-button{
          height: 100%;
          margin-top: 1px;
        }
      }
    }
  }

  .thumbnail-wrap{
    width: 50px;
    height: 50px;
  }
}
</style>

<style lang="less">
.goods-manage-list-wrap{
  .select-wrap{
    z-index: 2001 !important;
    .el-icon--right{
      line-height: 40px;
      right: 5px;
    }
  }

  /* -------------------- { 调整库存 } -------------------- */
  .adjustment-sku-wrap{
    margin-bottom: 30px;

    .el-form-item{
      margin-bottom: 0;

      .el-form-item__error{
        width: 100%;
      }
    }

    .adjustment-sku-search{
      height: 36px;
      line-height: 36px;
      margin-bottom: 20px;

      .el-icon-search{
        color: #999;
        margin-top: -8px;
        right: 10px;
        top: 50%;
      }

      .el-icon-search:hover{
        color: #56ade8;
      }
    }

    .adjustment-sku-table{
      width: 100%;
      border: 1px solid #ebeef5;
      border-collapse: collapse;

      th, td{
        text-align: center;
        font-size: 15px;
        border: 1px solid #ebeef5;
        padding: 0 10px;
      }

      th{
        height: 40px;
        font-weight: normal;
        background: #eef1f9;
      }

      td{
        padding: 10px 0;
        .el-input__inner{
          width: 100px;
          text-align: center;
        }

        .btn{
          color: #409eff;
          font-size: 14px;
        }
      }

      td.pd-l{
        padding-left: 35px;
      }

      td.pd-r{
        padding-right: 15px;
      }

      .sync-btn{
        fill: #2eaaf7;
        width: 30px;
        height: 30px;
        margin-top: -15px;
        right: 0;
        top: 50%;
      }

    }
  }
}
</style>
