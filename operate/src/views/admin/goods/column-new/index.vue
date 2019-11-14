<!-- 栏目管理 -->
<template>
  <common-tpl class="pos-r culumn-new-index" footer>
    <template slot="main">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm ta-l">
        <div class="column-list-wrap pos-r">
          <div class="column-list-box">
            <div class="column-list" :style="{width: formData.columnList.length * 110 + 'px', 'margin-left': -columnPage * 110 * 5 + 'px'}">
              <thumbnail-component :size="100" isRadio :radioIndex="currentColumnIndex" :empty="false" :link="false" :list="formData.columnList" move edit posDel :sortBefore="handleSortBefore" @edit="columnEditBefore" @delete="deleteBefore" @change="subactivityChange" @radio="columnChange">
                <template slot="text" slot-scope="scope">
                  <div class="ta-c d-b truncate pos-a full-w icon-text-wrap">{{scope.row.columnName}}</div>
                </template>
              </thumbnail-component>
            </div>
          </div>
          <span class="el-icon-caret-left label-tip label-tip-left pos-a" :disabled="columnPage === 0" :class="{disabled: columnPage === 0}" @click="columnPageChange('minus')"></span>
          <span class="el-icon-caret-right label-tip label-tip-right pos-a" :disabled="columnPage >= formData.columnList.length / 5 - 1" :class="{disabled: columnPage >= formData.columnList.length / 5 - 1}" @click="columnPageChange('plus')"></span>
          <dl class="add pos-a" @click="columnEditBefore(false)">
            <dt class="full-w ta-c pos-a"><h3 class="el-icon-plus d-ib"></h3></dt>
            <dd class="full-w ta-c pos-a">新增栏目</dd>
          </dl>
        </div>

        <el-form-item label="栏目类型：">
          <el-radio-group v-model="formData.relationType" @change="relationTypeChange">
            <el-radio border size="medium" :label="1">关联商品</el-radio>
            <el-radio border size="medium" :label="2">关联地址</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="formData.relationType === 2">
          <el-form-item label="链接类型：">
            <el-radio-group v-model="formData.linkType">
              <el-radio :label="1">内部链接</el-radio>
              <el-radio :label="0">外部链接</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 内部链接 -->
          <el-form-item label="指定链接：" prop="relationLink" v-if="formData.linkType === 1">
            <el-input v-model="formData.relationLink" class="d-n"></el-input>
            <internal-link :initData="internalLinkData" v-if="formData.linkType === 1" @change="internalLinkChange"></internal-link>
          </el-form-item>

          <!-- 外部链接 -->
          <el-form-item label="指定链接：" prop="relationUrl" v-else>
            <el-input class="input-link" size="medium" placeholder='输入url地址，500个字符以内，格式"http://"' v-model="formData.relationUrl"></el-input>
          </el-form-item>
        </template>

        <template v-if="formData.relationType === 1">
          <el-form-item label="栏目主图：">
            <thumbnail-component :empty="false" :styles="upload100" :link="false" del :auto-delete="true" :list="formData.activityDetailImgs">
              <template slot="other">
                <upload-component :styles="upload100" @success="uploadDetailsImgSuccess" v-if="!formData.activityDetailImgs.length"></upload-component>
                <div class="va-t d-ib" style="color: #f5a74a; line-height: 30px; padding: 18px 0 0 15px;">
                  建议尺寸：360 * 120px<br>建议大小：100KB以内
                </div>
              </template>
            </thumbnail-component>
          </el-form-item>
          <gray-title class="title" title="商品设置">
            <span class="pos-a" style="top: 5px; right: 4px;" slot="right">
              <el-button size="small" round @click="handleRelationBefore">关联栏目商品</el-button>
              <el-button size="small" round :disabled="!tableSelectRes.length" @click="handleCancelGoodsBefore(false)">取消栏目商品</el-button>
            </span>
          </gray-title>
          <br>

          <el-table :data="formData.goodsList" ref="goods-table" v-loading="columnLoading" element-loading-text="加载中" @row-click="tableRowSelect" @select-all="handleTableSelect" @selection-change="handleTableSelect">
            <el-table-column label="" width="40" type="selection"></el-table-column>
            <el-table-column label="商品图片" min-width="90">
              <template slot-scope="scope">
                <thumbnail-component :styles="{width: '50px', height: '50px'}" :list="[{url: $Utils.filterImgUrl(scope.row.mainImage)}]"></thumbnail-component>
              </template>
            </el-table-column>
            <el-table-column label="品牌" min-width="160">
              <template slot-scope="scope">{{scope.row.brandName | filterEmpty}}</template>
            </el-table-column>
            <el-table-column label="商品编码" min-width="160">
              <template slot-scope="scope">{{scope.row.goodsNo | filterEmpty}}</template>
            </el-table-column>
            <el-table-column label="商品名称" min-width="210">
              <template slot-scope="scope">{{scope.row.goodsName | filterEmpty}}</template>
            </el-table-column>
            <el-table-column label="销售价（元）" min-width="120">
              <template slot-scope="scope">{{scope.row.goodsPrice | filterEmpty}}</template>
            </el-table-column>
            <el-table-column label="进货价（元）" min-width="120">
              <template slot-scope="scope">{{scope.row.buyingPrice | filterEmpty}}</template>
            </el-table-column>
            <el-table-column label="利润率（利润/销售价）" min-width="180">
              <template slot-scope="scope">
                <template v-if="scope.row.goodsPrice && scope.row.buyingPrice">
                  {{((scope.row.goodsPrice - scope.row.buyingPrice) / scope.row.goodsPrice * 100).toFixed(2) | filterEmpty('%')}}
                </template>
                <template v-else>{{'' | filterEmpty}}</template>
              </template>
            </el-table-column>

            <el-table-column label="排序" min-width="110">
              <template slot-scope="scope">
                <div class="pos-r sort-wrap" style="padding-right: 25px;">
                  <el-form-item class="d-ib mb-0 full-w" :prop="'goodsList.' + scope.$index + '.sort'" :rules="ruleNum" label-width="0">
                    <el-input size="medium" min="0" maxlength="9" v-model="scope.row.sort" @blur="handleBlurSort(scope.row)" @change="contentChange"></el-input>
                  </el-form-item>
                  <span style="width: 14px; height: 35px; position: absolute; right: 5px; top: 0px;">
                    <i class="pos-a el-icon el-icon-caret-top" :class="{'cursor-p': scope.$index !== 0, disabled: scope.$index === 0}" @click="handleSortGoods(scope.$index, 'up')" :disabled="scope.$index === 0"></i>
                    <i class="pos-a el-icon el-icon-caret-bottom" style="bottom: 0;" :class="{'cursor-p': scope.$index !== formData.goodsList.length - 1, disabled: scope.$index === formData.goodsList.length - 1}" @click="handleSortGoods(scope.$index, 'down')" :disabled="scope.$index === formData.goodsList.length - 1"></i>
                  </span>
                </div>
              </template>
            </el-table-column>

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
                      <div @click="handleCancelGoodsBefore(scope.row)" class="orange"><i class="icon el-icon-delete"></i>取消</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <template slot="empty">
              <no-data></no-data>
            </template>
          </el-table>
          <br>
        </template>
      </el-form>
    </template>

    <template slot="other">
      <el-dialog title="关联商品" :visible.sync="relationVisible" width="1100px">
        <relation-goods :key="relationGoodsKey" :relationId="formData.columnId" @add="handleAddGoods" @remove="handleRemoveGoods"></relation-goods>
      </el-dialog>

      <!-- 栏目新增/编辑弹窗 -->
      <el-dialog :title="formData.dialogType === 1 ? '新增栏目' : '编辑栏目'" :visible.sync="publicVisible" class="column-public ta-l" width="460px">
        <el-form :model="formData" :rules="rules" ref="dialog-public-form" label-width="100px" class="demo-ruleForm ta-l">
          <el-form-item label="栏目名称：" prop="dialogColumnName">
            <el-input v-model="formData.dialogColumnName" maxlength="16" placeholder="16个字符以内"></el-input>
          </el-form-item>

          <el-form-item label="栏目图标：" class="pos-r" prop="dialogColumnLogo">
            <thumbnail-component :drag="true" :empty="false" :list="[{url: formData.dialogColumnLogo}]" del size="100" :styles="{'margin-right': '10px'}" @edit="publicVisible = true" @delete="dialogDeleteColumnLogo">
              <upload-component slot="other" :size="100" @success="handleColumnImgUploadSuccess" v-if="!formData.dialogColumnLogo"></upload-component>
            </thumbnail-component>
            <span class="pos-a column-icon" style="margin-top: -20px; top: 50%;">建议尺寸：100 * 100px 建议大小：100KB以内</span>
            <el-input v-model="formData.dialogColumnLogo" class="d-n"></el-input>
          </el-form-item>

          <el-form-item label="栏目排序：" prop="dialogColumnSort">
            <el-input v-model="formData.dialogColumnSort" placeholder="0-255的整数，0的排序最高" maxlength="3"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-radio v-model="formData.dialogColumnStatus" :label="1">开启</el-radio>
            <el-radio v-model="formData.dialogColumnStatus" :label="0">关闭</el-radio>
          </el-form-item>
       </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="publicVisible = false">取 消</el-button>
          <el-button type="primary" @click="publicHandle('dialog-public-form', 'dialog')" :loading="dialogLoading">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 删除栏目 -->
      <el-dialog title="删除栏目" :visible.sync="deleteVisible" width="450px">
        <span class="ta-c">确认是否删除栏目？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteHandle()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 取消商品 -->
      <el-dialog title="取消商品" :visible.sync="cancelVisible" width="420px">
        <br><div>确定是否取消商品？</div><br>

        <br>
        <el-button size="medium" @click="cancelVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="cancelLoading" @click="handleCancelGoods">确定</el-button>
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button type="primary" @click="preservationHanle('formData', 'save')" :loading="loading">保存</el-button>
    </template>
  </common-tpl>
</template>

<script>
import RelationGoods from '@/components/public/RelationGoods'
import InternalLink from '@/components/public/InternalLink'
export default{

  components: {
    RelationGoods,
    InternalLink
  },

  data () {
    let validateSort = (rule, value, callback) => {
      if (!value && parseInt(value) !== 0) return callback(new Error('请输入栏目排序'))
      if (value && (value < 0 || value > 255 || !value.toString().match(/^\d{0,3}$/gi))) return callback(new Error('输入0~255数字'))
      callback()
    }

    // 校验正整数
    let validateInt = (rule, value, callback) => {
      if (value && (isNaN(value) || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('请输入正数'))
      callback()
    }

    // 校验外部链接
    let validateRelationUrl = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入外部链接'))
      if (!value.toString().match(/^(https):\/\/.*/gi)) return callback(new Error('请输入正确的外部链接'))
      callback()
    }
    return {
      dialogLoading: false,         // 弹窗loading
      loading: false,               // 保存loading
      columnType: 1,                // 1、新增页面   2、编辑页面
      columnPage: 0,                // 当前栏目页
      currentColumnIndex: 0,        // 当前栏目索引
      currentColumnData: {},        // 当前栏目数据
      formData: {
        columnId: 0,                // 栏目id
        columnList: [],             // 栏目列表数据
        uploadMainFileList: [],     // 上传栏目列表
        relationType: 2,            // 栏目类型

        activityDetailImgs: [],     // 栏目主图

        dialogEditData: {},         // 弹窗栏目数据
        dialogEditIndex: '',        // 弹窗栏目索引
        dialogType: 1,              // 弹窗类型 [1、新增 2、编辑]
        dialogColumnName: '',       // 弹窗栏目名称
        dialogColumnLogo: '',       // 弹窗栏目logo
        dialogColumnSort: 0,        // 栏目排序
        dialogColumnStatus: 1,      // 状态

        goodsList: [],
        linkType: 1,                // 链接类型 [0 外部链接 1内部链接]
        relationLink: '',           // 内部链接
        relationUrl: '',            // 指定链接
        activityId: 0,              // 活动id
        subactivityId: '',          // 子活动id
        activityListData: [],       // 活动主图列表

        goodsSort: 1,
        type: 1,
        ifSetmeat: 1
      },
      internalLinkData: {
        grandNode: '',              // 一级id
        parentNode: '',             // 二级id
        childNode: ''               // 三级id
      },
      details: '',                  // 详情
      deleteColumnId: '',           // 栏目id
      formLabelWidth: '120px',
      publicVisible: false,         // 新增/编辑弹窗
      deleteVisible: false,         // 删除弹窗
      relationVisible: false,       // 关联商品弹窗
      cancelVisible: false,         // 取消关联商品
      cancelLoading: false,         // 取消关联商品
      tableSelectRes: '',
      columnLoading: false,         // lan
      relationGoodsKey: '',         // 关联商品标识符
      activityLists: [],            // 活动列表
      // 矩形尺寸
      upload100: {width: '98px', height: '98px'},
      upload145: {width: '145px', height: '80px'},
      currentSubactivityList: {},   // 当前子活动列表
      pageData: {                   // 列表分页
        currentPage: 1,
        pageSize: 1000,
        total: 0
      },
      rules: {
        dialogColumnName: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        dialogColumnLogo: [{ required: true, message: '请上传栏目图标', trigger: 'blur' }],
        dialogColumnSort: [{required: true, validator: validateSort, trigger: 'blur'}],
        relationLink: [{required: true, message: '请选择指定链接', trigger: 'change'}],
        relationUrl: [{required: true, validator: validateRelationUrl, trigger: 'change'}]
      },
      ruleNum: [{validator: validateInt, trigger: 'blur'}]
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/goods/column-new/index', (res) => {
      this.formData = res
    })
    this.getListData()
  },

  methods: {
    /**
     * 获取栏目列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/column/list', {
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
        let results = resData.data
        results.list.forEach((row) => {
          row.url = this.$Utils.filterImgUrl(row.columnLogo)
        })
        this.formData.columnList = results.list

        // 初始化选中数据
        if (results.list.length) {
          if (this.formData.columnId) {
            results.list.forEach((row, index) => {
              if (row.id === this.formData.columnId) this.columnChange(row, index)
            })
          } else {
            this.columnChange(results.list[0], 0)
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 栏目切换
     */
    columnChange (item, index) {
      this.currentColumnIndex = index
      this.currentColumnData = item
      this.columnPage = parseInt(this.currentColumnIndex / 5)
      this.formData.columnId = item.id                  // 栏目id
      this.formData.relationType = item.columnType      // 栏目类型（1 关联商品，2 关联地址）
      this.formData.linkType = item.linkType === null ? 1 : parseInt(item.linkType)  // 链接类型 0 外部链接 1内部链接

      // 清空数据
      this.internalLinkData.grandNode = ''
      this.internalLinkData.parentNode = ''
      this.internalLinkData.childNode = ''
      this.formData.relationUrl = ''

      if (this.formData.linkType === 1) {              // 内部链接
        this.internalLinkData.grandNode = item.grandNode ? parseInt(item.grandNode) : ''
        this.internalLinkData.parentNode = item.parentNode ? parseInt(item.parentNode) : ''
        this.internalLinkData.childNode = item.childNode ? parseInt(item.childNode) : ''
      } else {              // 外部链接
        this.formData.relationUrl = item.relateUrl       // 外部链接
      }
      this.formData.activityDetailImgs = []              // 栏目主图
      if (item.mainImage) this.$set(this.formData.activityDetailImgs, 0, {url: this.$Utils.filterImgUrl(item.mainImage)})
      this.getColumnData()
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 获取栏目详情数据
     */
    getColumnDetailsData (id) {
      if (!id) return false
      this.$http.get('@ROOT_API/column/info', {
        params: {
          id
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
        let results = resData.data
        if (results.columnLogo) results.url = this.$Utils.filterImgUrl(results.columnLogo)
        this.formData.columnList.forEach((row, index) => {
          if (parseInt(row.id) === parseInt(id)) this.$set(this.formData.columnList, index, results)
        })
      })
    },

    /**
     * 更新图标索引
     */
    updateColumnIndex () {
      this.formData.columnList.forEach((row, index) => {
        if (parseInt(row.id) === parseInt(this.formData.columnId)) this.currentColumnIndex = index
      })
    },

    /**
     * 排序
     */
    handleSortBefore (type, index) {
      let goodsColumnList = []
      let temp = this.formData.columnList[index]
      let sort = temp.sort
      let sortIndex = type === 'next' ? index + 1 : index - 1
      goodsColumnList.push(
        {
          goodsColumnId: this.formData.columnList[sortIndex].id,
          sort: temp.sort
        },
        {
          goodsColumnId: temp.id,
          sort: this.formData.columnList[sortIndex].sort
        },
        {
          goodsColumnId: this.formData.columnList[sortIndex].id,
          sort: temp.sort
        }
      )
      type === 'next' ? goodsColumnList.pop() : goodsColumnList.shift()
      this.$http.post('@ROOT_API/column/updateColumnSort', {
        goodsColumnList
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
          duration: 1500
        })
        temp.sort = this.formData.columnList[sortIndex].sort
        this.formData.columnList[sortIndex].sort = sort
        this.$set(this.formData.columnList, index, this.formData.columnList[sortIndex])
        this.$set(this.formData.columnList, sortIndex, temp)
        this.updateColumnIndex()
      })
    },

    /**
     * 栏目列表图片上传成功
     */
    handleColumnImgUploadSuccess (url) {
      this.formData.dialogColumnLogo = url
    },
    /**
     * 栏目分页
     */
    columnPageChange (type) {
      if (type === 'plus') {
        if (this.columnPage >= this.formData.columnList.length / 5 - 1) return false
        this.columnPage++
      } else {
        if (this.columnPage === 0) return false
        this.columnPage--
      }
    },

    /**
     * 栏目编辑前操作
     */
    columnEditBefore (item, index) {
      this.formData.dialogColumnName = ''
      this.formData.dialogColumnLogo = ''
      this.formData.dialogColumnSort = ''
      this.publicVisible = true
      if (!item) {
        this.formData.dialogType = 1
        this.dialogEditIndex = ''
        return false
      } else {
        this.dialogEditIndex = index
      }
      this.dialogEditData = item
      this.formData.dialogType = 2
      this.formData.dialogColumnName = item.columnName
      this.formData.dialogColumnLogo = item.columnLogo
      this.formData.dialogColumnSort = item.sort
      this.formData.dialogColumnStatus = item.activityStatus && parseInt(item.activityStatus) !== 0 ? 1 : 0
    },

    /**
     * 新增/编辑
     */
    publicHandle (formName, type) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.handleSubmitPublic(type)
      })
    },

    /**
     * 新增/编辑 公共
     */
    handleSubmitPublic (type) {
      let url = ''
      if (type === 'save') {  // 页面保存
        this.loading = true
        url = '@ROOT_API/column/update'
      } else {                // 弹窗保存
        this.dialogLoading = true
        url = this.formData.dialogType === 1 ? '@ROOT_API/column/add' : '@ROOT_API/column/update'
      }
      let goodsColumnIds = []
      this.formData.goodsList.forEach((row) => {
        goodsColumnIds.push({
          goodsColumnId: row.goodsColumnId,
          goodsId: row.id,
          goodsNum: row.goodsNum,
          sort: row.sort
        })
      })
      let mainImage = ''
      let relateUrl = ''
      if (type === 'save') {
        if (this.formData.activityDetailImgs[0] && this.formData.activityDetailImgs[0].img) mainImage = this.formData.activityDetailImgs[0].img
        relateUrl = this.formData.linkType === 1 ? this.formData.relationLink : this.formData.relationUrl
      } else if (this.formData.dialogType === 2) {   // 编辑状态
        mainImage = this.dialogEditData.mainImage
        relateUrl = this.dialogEditData.relateUrl
      }
      console.log('this.currentColumnData: ', this.currentColumnData)
      this.$http.post(url, {
        id: type === 'save' ? this.formData.columnId : this.formData.dialogType === 2 ? this.dialogEditData.id : '',   // 栏目ID
        type: 0,                                      // 是 int 类型 0 : 栏目，1 : 套餐
        columnName: type === 'save' ? this.currentColumnData.columnName : this.formData.dialogColumnName,   // 是 String  栏目名称
        sort: type === 'save' ? this.currentColumnData.sort : this.formData.dialogColumnSort,         // 是 int 栏目排序
        activityStatus: type === 'save' ? this.currentColumnData.activityStatus : this.formData.dialogColumnStatus, // 是 激活状态 0:未激活，1已激活
        goodsSort: this.formData.goodsSort,           // 是 String  商品默认排序(1、上架时间降序，2、商品价格降序，3、商品价格升序）
        columnLogo: type === 'save' ? this.currentColumnData.columnLogo : this.formData.dialogColumnLogo,   // 是 String  栏目图标
        isRecommendIndex: 1,                          // 是 int 是否推荐到首页： 0 ：否 1：是
        ifSetmeat: 0,                                 // 是 int 是否是套餐栏目： 0 ：否 1：是
        columnType: type === 'save' ? this.formData.relationType : this.formData.dialogType === 2 ? this.dialogEditData.columnType : 1,  // 是 栏目类型  栏目类型（1 关联商品，2 关联地址）
        linkType: type === 'save' ? this.formData.linkType : this.formData.dialogType === 2 ? this.dialogEditData.linkType : '',
        relateUrl,
        goodsColumnIds,                               // 是 Array 栏目所关联的商品ID集合
        mainImage,
        grandNode: (type === 'save' || this.formData.dialogType === 2) && this.formData.linkType === 1 ? this.internalLinkData.grandNode : '',
        parentNode: (type === 'save' || this.formData.dialogType === 2) && this.formData.linkType === 1 ? this.internalLinkData.parentNode : '',
        childNode: (type === 'save' || this.formData.dialogType === 2) && this.formData.linkType === 1 ? this.internalLinkData.childNode : ''
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
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
        this.publicVisible = false
        let results = resData.data
        // 新增追加列表数据
        if (type !== 'save' && this.formData.dialogType === 1) {
          this.formData.columnList.push(results)
          this.$set(this.formData.columnList, this.formData.columnList.length, results)
          // this.formData.columnList.push(results)
          // let flag = false
          // this.formData.columnList.forEach((row, index) => {
            // if (!flag && row.sort >= this.formData.dialogColumnSort) {
            //   flag = true
            //   if (index === 0) {
            //     this.formData.columnList.unshift(resData.data)
            //   } else {
            //     this.$set(this.formData.columnList, index - 1, resData.data)
            //   }
            // }
          // })
        } else {
          if (results.columnLogo) results.url = this.$Utils.filterImgUrl(results.columnLogo)
          let id = type === 'save' ? this.formData.columnId : this.dialogEditData.id
          this.formData.columnList.forEach((row, index) => {
            if (parseInt(row.id) === parseInt(id)) this.$set(this.formData.columnList, index, results)
          })
          // 更新图标数据
          // this.getColumnDetailsData(id)
        }
      }).finally(() => {
        setTimeout(() => {
          this.dialogLoading = false
          this.loading = false
          this.getListData()
          // this.$router.go(0)
        }, 500)
      })
    },

    /**
     * 弹窗删除栏目logo
     */
    dialogDeleteColumnLogo (item, index) {
      this.formData.dialogColumnLogo = ''
    },

     /**
     * 删除前操作
     */
    deleteBefore (item, index) {
      this.deleteVisible = true
      this.deleteColumnId = item
    },

    /**
     * 删除栏目
     */
    deleteHandle () {
      this.$http.get('@ROOT_API/column/delete', {
        params: {
          id: this.deleteColumnId.id
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
        this.deleteVisible = false
      }).finally(() => {
        this.columnLoading = false
        this.getListData()
      })
    },

    /**
     * 商品排序
     */
    handleSortGoods (index, type) {
      if (!type || type === 'up' && index === 0 || type === 'down' && index === this.formData.goodsList.length - 1) return false
      let temp = this.formData.goodsList[index]
      let sortIndex = type === 'up' ? index - 1 : index + 1
      let goodsColumnList = []
      if (type === 'down') {
        goodsColumnList.push(
          {
            goodsColumnId: this.formData.goodsList[sortIndex].goodsColumnId,
            goodsId: this.formData.goodsList[sortIndex].goodsId,
            sort: temp.sort || 0
          },
          {
            goodsColumnId: temp.goodsColumnId,
            goodsId: temp.goodsId,
            sort: this.formData.goodsList[sortIndex].sort || 0
          }
        )
      } else {
        goodsColumnList.push(
          {
            goodsColumnId: temp.goodsColumnId,
            goodsId: temp.goodsId,
            sort: this.formData.goodsList[sortIndex].sort || 0
          },
          {
            goodsColumnId: this.formData.goodsList[sortIndex].goodsColumnId,
            goodsId: this.formData.goodsList[sortIndex].goodsId,
            sort: temp.sort || 0
          }
        )
      }
      this.$http.post('@ROOT_API/column/updateColumnGoodsSort', {
        goodsColumnList
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: resData.msg,
          duration: 1500,
          type: 'success'
        })
        let sort = temp.sort
        temp.sort = this.formData.goodsList[sortIndex].sort
        this.formData.goodsList[sortIndex].sort = sort
        this.$set(this.formData.goodsList, index, this.formData.goodsList[sortIndex])
        this.$set(this.formData.goodsList, sortIndex, temp)
      })
    },

    /**
     * 跳转链接
     */
    handleLink (item) {
      this.$router.push({path: '/admin/goods/activity/details', query: {id: item.goodsId}})
    },

    /**
     * 内容改变
     */
    contentChange () {
      this.isEdited = true
    },

    /**
     * 关联类型选择
     */
    relationTypeChange (value) {
      this.activityLists.forEach((row) => {
        if (row.id === this.formData.activityId && row.columnManageList) {
          row.columnManageList.forEach((list) => {
            if (list.id === this.formData.subactivityId) {
              list.columnType = value
            }
          })
        }
      })
    },

    /**
     * 追加关联商品
     */
    handleAddGoods (data) {
      data.forEach((row) => {
        if (this.formData.goodsList.length) {
          this.formData.goodsList.unshift(row)
        } else {
          this.formData.goodsList.push(row)
        }
      })
    },

    /**
     * 移除关联商品
     */
    handleRemoveGoods (data) {
      data.forEach((row) => {
        this.formData.goodsList.forEach((list, index) => {
          if (row.id === list.id) this.formData.goodsList.splice(index, 1)
        })
      })
    },

    /**
     * 活动列表排序接口调用
     */
    handleSortActivityAjax () {
      this.$http.post('@ROOT_API/column/updateColumnGoodsSort', {
      })
    },

    /**
     * 获取栏目关联商品列表
     */
    getColumnData () {
      if (!this.formData.columnId) return false
      this.columnLoading = true
      this.$http.post('@ROOT_API/column/columnGoodsList', {
        columnId: this.formData.columnId,  // 是 int 栏目ID
        supplierId: '',    // 否 int 供应商Id
        searchText: '',    // 否 String  商品编号/商品名称
        whetherPoints: ''  // 否 int 是否支持积分兑换(0 : 否，1 ：是)
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
        let results = resData.data
        this.formData.goodsList = results
      }).finally(() => {
        this.columnLoading = false
      })
    },

    /**
     * 失去焦点排序
     */
    handleBlurSort (item) {
      if (!item.sort || isNaN(item.sort) || item.sort < 0) return false
      this.$http.post('@ROOT_API/column/updateColumnGoodsSort', {
        goodsColumnList: [
          {
            goodsColumnId: item.goodsColumnId,  // 是 int 栏目商品ID
            goodsId: item.goodsId,              // 是 int 商品Id
            sort: item.sort                     // 是 int 排序id
          }
        ]
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: resData.msg,
          duration: 1500,
          type: 'success'
        })
      })
    },

    /**
     * 子列表改变
     */
    subactivityChange (arr, index) {
      if (!arr.length) {
        this.formData.activityListData.forEach((row) => {
          if (row.sort === index) {
            row.url = ''
            row.columnLogo = ''
            row.img = ''
          }
        })
      }
    },

    /**
     * 详情主图上传成功
     */
    uploadDetailsImgSuccess (url, index) {
      this.$set(this.formData.activityDetailImgs, 0, {url: this.$Utils.filterImgUrl(url), img: url})
    },

    /**
     * 关联前操作
     */
    handleRelationBefore (row) {
      this.relationVisible = true
      this.relationGoodsKey = new Date().getTime()
    },

    /**
     * 取消分享前操作
     */
    handleCancelGoodsBefore (row) {
      this.cancelVisible = true
      this.cancelData = row ? [row] : this.tableSelectRes
    },

    /**
     * 取消分享
     */
    handleCancelGoods () {
      let ids = this.cancelData.map(row => row.id)
      this.cancelLoading = true
      this.$http.get('@ROOT_API/column/delColGoods', {
        params: {
          ids: ids.join(',')
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: resData.msg,
          duration: 1500,
          type: 'success'
        })
        this.cancelData.forEach((row) => {
          this.formData.goodsList.forEach((list, index) => {
            if (row.id === list.id) this.formData.goodsList.splice(index, 1)
          })
        })
        this.cancelVisible = false
      }).finally(() => {
        setTimeout(() => {
          this.cancelLoading = false
        }, 500)
      })
    },

    /**
     * table复选
     */
    handleTableSelect (val) {
      this.tableSelectRes = val
    },

    /**
     * 单行选择
     */
    tableRowSelect (row) {
      this.$refs['goods-table'].toggleRowSelection(row)
    },

     /**
     * 内部链接改变
     */
    internalLinkChange (results) {
      Object.assign(this.internalLinkData, results)
      this.formData.relationLink = results.relationUrl
    },

    /**
     * 提交表单
     */
    preservationHanle (formName, type) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.handleSubmitPublic(type)
      })
    }
  }
}
</script>

<style lang="less">
.culumn-new-index{
  /*------------------{ 栏目管理列表 }----------------*/
  .column-list-wrap{
    max-width: 650px;
    height: 140px;
    padding: 0 50px;
    margin-bottom: 20px;
    border: 1px solid #eee;

    .list-wrap{
      margin-right: 10px;
      padding-bottom: 30px !important;
    }

    .column-list-box{
      max-width: 550px;
      padding: 20px 0;
      overflow: hidden;

      .icon-text-wrap{
        color: #666;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        left: 0;
      }
    }

    .column-box{
      padding: 10px;
    }

    .column-box.active{
      box-shadow: 0 0 15px rgba(0, 160, 233, .3);
    }

    .add{
      width: 100px;
      height: 100px;
      border: 1px solid #eee;
      right: 50px;
      top: 20px;
      cursor: pointer;

      dt{
        color: #999;
        font-size: 22px;
        top: 28%;
      }

      dd{
        color: #999;
        bottom: 15px;
      }
    }

    .label-tip{
      color: #666;
      width: 50px;
      font-size: 52px;
      margin-top: -25px;
      top: 50%;
    }

    .label-tip.disabled{
      color: #ccc;
      cursor: not-allowed;
    }

    .label-tip-left{
      left: 0;
    }

    .label-tip-right{
      right: 0 !important;
    }

    .el-icon-caret-right{
    }

  }
  .input-link{
    width: 400px;
  }

  /*------------------{ 新增/编辑弹窗样式 }----------------*/
  .column-public{

    .el-dialog__body{
      padding-bottom: 0;
      .column-icon{
        color: #f5a74a;
        width: 160px;
        height: 44px;
        left: 125px;
        bottom: 0;
        line-height: 20px;
      }

    }
  }


}
</style>