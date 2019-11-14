<!-- 拼团 - 新增/编辑 -->
<template>
  <common-tpl class="luckybuy-index-wrap" footer>
    <template slot="main" >
      <el-form :model="formData" ref="formData" label-width="120px" v-loading="loading">
        <br>
        <activities-public></activities-public>
        <!-- 商品设置 -->
        <gray-title title="商品设置">
          <el-button v-if="formData.goodsGroupId === 1" slot="right" size="small" type="primary" round style="margin-top: -15px; right: 7px; top: 50%;" class="pos-a" @click="relationVisible = true"><i class="el-icon-plus"></i> 添加拼团商品</el-button>
        </gray-title>
        <br>
        <el-table border :data="formData.themeGoodsList" class="full-w">
          <el-table-column prop="" label="商品图片" min-width="80" fixed>
            <template slot-scope="scope">
              <thumbnail-component :list="[{url: scope.row.mainImage}]" :size="50"></thumbnail-component>
            </template>
          </el-table-column>
          <el-table-column prop="" label="商品编码" min-width="100" fixed>
            <template slot-scope="scope">
              <div style="padding-right: 10px">{{scope.row.goodsNo | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="品牌" min-width="100" fixed>
            <template slot-scope="scope">
              <div style="padding-right: 10px">{{scope.row.goodsNo | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="商品名称" min-width="200">
            <template slot-scope="scope">
              <div style="padding-right: 10px">{{scope.row.goodsName | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="销售价" min-width="120px">
            <template slot-scope="scope">
              <div>{{scope.row.goodsPrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="进货价" min-width="120px">
            <template slot-scope="scope">
              <div style="padding-right: 10px">{{scope.row.buyingPrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="拼团价" min-width="120px">
            <template slot-scope="scope">
              <div>{{scope.row.purchasePrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="利润率">
            <template slot-scope="scope">{{filterProfitMargin(scope.row) | filterEmpty('%')}}</template>
          </el-table-column>
          <el-table-column label="排序" min-width="120">
            <template slot-scope="scope">
              <div class="pos-r sort-wrap" style="padding-right: 20px;">
                <el-form-item class="d-ib margin-none" :prop="'themeGoodsList.' + scope.$index + '.sort'" :rules="ruleSort" label-width="0">
                  <el-input size="medium" min="0" maxlength="3" v-model="scope.row.sort" @change="contentChange" ></el-input>
                </el-form-item>
                <span style="width: 14px; height: 35px; position: absolute; right: 5px; top: 0px;">
                  <i class="pos-a el-icon el-icon-caret-top" :class="{'cursor-p': scope.$index !== 0}" @click="handleSortUp(scope.$index)" :disabled="scope.$index !== 0"></i>
                  <i class="pos-a el-icon el-icon-caret-bottom" style="bottom: 0;" :class="{'cursor-p': scope.$index !== formData.themeGoodsList.length - 1}" @click="handleSortDown(scope.$index)" :disabled="scope.$index !== formData.themeGoodsList.length - 1"></i>
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
                    <div @click="handleLink(scope.row, 'setting')"><i class="icon el-icon-setting"></i>设置</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="handleLink(scope.row, 'details')"><i class="icon el-icon-view"></i>详情</div>
                  </el-dropdown-item>
                  <el-dropdown-item >
                    <div @click="handleLink(scope.row, 'switch')"><i class="icon el-icon-view"></i>切换分区</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
          v-if="pageData.total"
        >
        </el-pagination>
      </el-form>
    </template>
    <template slot="other">
      <el-dialog title="切换分区" :visible.sync="switchVisible" width="500px" class="dialog-data">
        <el-form :model="rowData" label-width="120px" ref="" labelPosition="right">
          <el-form-item label="商品名称：" prop="goodsName" >
            {{rowData.goodsName}}
          </el-form-item>
          <el-form-item label="切换至分区：" class="" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
            <el-select v-model="rowData.goodsGroupId" placeholder="请选择">
              <el-option
                v-for="item in groupList"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="switchVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleSwitchDone">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 关联商品 -->
      <el-dialog title="关联商品" :visible.sync="relationVisible" width="1100px" @close="getListData">
        <!-- 关联商品组件 -->
        <relation-goods :relationId="parseInt(formData.id)" :relationType="3" relationUrl="shareTheme/getShareThemeGoodsPage" @change="relationDataChange" @add="addRelationData" @remove="removeRelationData"></relation-goods>
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">保存</el-button>
    </template>

  </common-tpl>
</template>

<script>
  import RelationGoods from '@/components/public/RelationGoods'
  import ActivitiesPublic from './ActivitiesPublic'
  import pagePaper from '@/mixins/ListPublicPage'
  export default {
    components: {RelationGoods, ActivitiesPublic},
    mixins: [pagePaper],
    data () {
      // 校验 0-1000正整数
      let validateInt = (rule, value, callback) => {
        if (value === '' || value === null) return callback(new Error('不能为空'))
        if (this.dialogType < 4 && value && (isNaN(value) || value < 0 || value > 1000 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限0-1000正整数'))
        if (this.dialogType > 3 && value && (isNaN(value) || value < -1000 || value > 1000)) return callback(new Error('限-1000-1000正整数'))
        callback()
      }
      // 校验排序
      let validateSort = (rule, value, callback) => {
        if (value && (isNaN(value) || value < 0 || value > 255 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制0~255正整数'))
        callback()
      }

      // 校验分区排序
      let validateGroupSort = (rule, value, callback) => {
        if (value && (isNaN(value) || value < 1 || value > 100 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制1~100正整数'))
        callback()
      }
      return {
        groupList: [],     // 分区数据
        columnPage: 0,     // 分区页码
        groupHasNum: '',   // 分区倗有的商品数量
        deleteDialogData: {},   // 删除分区前保存数据
        addForm: {   // 添加分区数据
          groupName: '',
          groupId: '',
          groupStatus: 2,
          groupSort: '',
          groupType: 8
        },
        loading: true,
        dialogTableVisible: false,
        confirmLoading: false,        // 确定loading
        pageType: 1,                  // 页面类型 [1、新增 2、编辑]
        moduleType: 1,                // 模块类型 [1、分享商品 2、芯豆专区 3、消费积分兑换区 4、联盟积分兑换区]
        isOperate: false,             // 判断是否是运营模块
        formData: {
          disseminateType: null,      // 主题状态
          buySourceId: '',            // 素材
          id: '',                     // 主题id
          themeType: 8,               // 主题类型
          goodsGroupId: 1,            // 分区ID  默认区： 1
          themeName: '',              // 品牌名称
          purchaseDes: '',            // 收益说明
          themeImage: '',             // ..
          themePresent: '-',          // ..
          themeBackdrop: '',          // ..
          sort: '',
          themeGoodsList: [],         // 商品列表
          imgs: []                    // 图片
        },
        img100: {width: '100px', height: '100px'}, // 图片大小
        disabled: {color: '#aaa', cursor: 'not-allowed'},
        form: {
          purchaseNumNow: '',
          purchaseNumTotal: '',
          grabNumNowSys: '',          // 系统
          grabNumNow: '',             // 用户
          updateNumber: '',
          date: []
        },
        ruleSort: [{validator: validateSort, trigger: 'blur'}],   // 商品排序
        groupSort: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {validator: validateGroupSort, trigger: 'blur'}
        ],  // 分区排序

        updateNumber: [{required: true, validator: validateInt, trigger: 'blur'}],
        copyFormData: {},              // 拷贝表单数据
        relationVisible: false,        // 关联商品弹窗
        relationListData: [],          // 关联数据
        tableData: [],                 // 列表
        materialListData: [],          // 素材列表
        dialogLoading: false,          // 弹窗loading
        deleteVisible: false,          // 取消分享弹窗
        switchVisible: false,          // 切换分区弹窗
        deletePartitionVisible: false, // 删除弹窗
        addVisible: false,             // 添加分区弹窗
        updateTimeVisible: false,      // 取消分享弹窗
        rowData: {},                   // 取消分享数据
        isEdited: false,               // 是否编辑
        dialogType: 1,                 // [1 2 3,4,5]
        pageData: {                    // 分页
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        userInfo: {}                   // 用户信息
      }
    },

    mounted () {
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData(['/admin/warehouse/setting/index', '/admin/warehouse/setting/edit', '/admin/warehouse/setting/details'], (res) => {
        this.formData = res
      })
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.getId()
      this.getMaterialListData()
      this.getListData()
    },

    methods: {

      /**
       * 获取素材列表
       */
      getMaterialListData () {
        this.$http.post('@ROOT_API/source/getSourceList', {
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
          this.materialListData = resData.data
        })
      },

      /**
       * 获取列表
       */
      getId () {
        this.$http.post('@ROOT_API/shareTheme/getList', {}).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              duration: 1500,
              type: 'error'
            })
            return false
          }
        })
      },

      updateNum (row) {
        this.rowData = row
        this.dialogTableVisible = true
      },

      /**
       * 获取详情数据
       */
      getListData () {
        this.loading = true
        this.$http.get('@ROOT_API/shareTheme/getDetail', {
          params: {
            themeId: this.formData.id,
            themeType: this.formData.themeType,
            goodsGroupId: this.formData.goodsGroupId,
            start: this.pageData.currentPage,
            pageSize: this.pageData.pageSize
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              duration: 1500,
              type: 'error'
            })
            this.pageData.total = 0
            return false
          }

          this.formData.themeGoodsList = []
          let results = resData.data
          localStorage.setItem(this.$global.SYSTEM + 'ShareThemeId', results.id)
          this.formData.purchaseDes = results.purchaseDes === null ? '' : results.purchaseDes
          this.formData.themeName = results.themeName
          this.formData.id = results.id
          this.formData.disseminateType = results.disseminateType
          this.formData.buySourceId = results.buySourceId
          this.formData.themeImage = results.themeImage
          if (results.themeImage) {
            this.formData.imgs = [{url: this.$Utils.filterImgUrl(results.themeImage), imageUrl: results.themeImage}]
          } else {
            this.formData.imgs = []
          }
          this.addRelationData(results.goodsListPage.list, true)
          this.groupList = results.groupListPage.list
          this.pageData.total = results.goodsListPage.total
          setTimeout(() => {
            this.isEdited = false
          }, 500)
        }).finally(() => {
          this.loading = false
        })
      },
      /**
       * 过滤利润率
       */
      filterProfitMargin (item) {
        let goodsPrice = item.goodsPrice && !isNaN(item.goodsPrice) ? parseFloat(item.goodsPrice) : 0
        if (goodsPrice === 0) return ''
        let buyingPrice = !isNaN(item.buyingPrice) ? parseFloat(item.buyingPrice) : ''
        let res = ((goodsPrice - buyingPrice) / goodsPrice * 100).toFixed(2)
        return res
      },

      /**
       * 接收关联数据
       */
      relationDataChange (results) {
        this.relationListData = results
        this.pageChange(1)
      },

      /**
       * 添加关联数据
       */
      addRelationData (results, type) {
        results.forEach((row) => {
         // console.log(row.ifEnable)
          if (type || !this.formData.themeGoodsList.length) {
            this.formData.themeGoodsList.push(row)
          } else {
           // row.ifEnable = (parseInt(row.ifEnable) === 1) ? !!true : !!false
          //  row.ifEnable = (parseInt(row.ifEnable) === true) ? !!true : !!false
            this.formData.themeGoodsList.unshift(row)
          }
        })
      },
      /**
       * 移除关联数据
       */
      removeRelationData (results) {
        results.forEach((row) => {
          this.formData.themeGoodsList.forEach((list, index) => {
            if (row.id === list.goodsId || row.id === list.id) this.formData.themeGoodsList.splice(index, 1)
          })
        })
      },

      /**
       * 提交表单验证
       */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          this.confirmLoading = true
          this.formData.disseminateType === 1 ? this.formData.buySourceId = '' : this.formData.disseminateType === 2 ? this.formData.themeImage = '' : ''
          this.$http.post('@ROOT_API/shareTheme/edit', this.formData).then((res) => {
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
          }).finally(() => {
            setTimeout(() => {
              this.confirmLoading = false
            }, 500)
          })
        })
      },

      /**
       * 向上移动
       */
      handleSortUp (index) {
        this.isEdited = true
        let temp = this.formData.themeGoodsList[index]
        let sort = temp.sort
        temp.sort = this.formData.themeGoodsList[index - 1].sort
        this.formData.themeGoodsList[index - 1].sort = sort
        this.$set(this.formData.themeGoodsList, index, this.formData.themeGoodsList[index - 1])
        this.$set(this.formData.themeGoodsList, index - 1, temp)
      },

      /**
       * 向下移动
       */
      handleSortDown (index) {
        this.isEdited = true
        let temp = this.formData.themeGoodsList[index]
        let sort = temp.sort
        temp.sort = this.formData.themeGoodsList[index + 1].sort
        this.formData.themeGoodsList[index + 1].sort = sort
        this.$set(this.formData.themeGoodsList, index, this.formData.themeGoodsList[index + 1])
        this.$set(this.formData.themeGoodsList, index + 1, temp)
      },

      /**
       * 内容改变
       */
      contentChange () {
        this.isEdited = true
      },

      /**
       * 跳转链接
       */
      handleLink (item, type) {
        if (this.isEdited) {
          this.$message({
            message: '内容已修改，请先保存',
            duration: 2000,
            type: 'error'
          })
          this.isEdited = false
          return false
        }
        if (type === 'setting') {
          let json = {
            ratio: this.formData.maidRatio,
            levels: this.formData.maidLevels
          }
          localStorage.setItem(this.$global.SYSTEM + 'OperationCommunitySetting', JSON.stringify(json))
          let url = '/admin/operation/extension/assemble/setting'
          this.$router.push({path: url, query: {id: item.id, goodsId: item.goodsId, type: this.formData.themeType}})
        } else if (type === 'switch') {
          this.switchVisible = true
          this.rowData = item
        } else {
          let url = '/admin/operation/extension/assemble/details'
          this.$router.push({path: url, query: {id: item.goodsId}})
        }
      },

      /**
       * 切换分区前操作
       */
      handleSwitchBefore (row) {
        this.switchVisible = true
        this.rowData = row
      },

      /**
       * 保存切换分区操作
       */
      handleSwitchDone () {
        this.dialogLoading = true
        this.$http.post('@ROOT_API/shareTheme/updateGoodsGroup', {
          id: this.rowData.id,
          goodsGroupId: this.rowData.goodsGroupId
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
          this.switchVisible = false
          this.getListData()
        }).finally(() => {
          this.dialogLoading = false
        })
      },

      filterEmpty (val) {
        return val === null ? '--' : val
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
          this.getListData()
          this.$router.push({query: {page: this.pageData.currentPage}})
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .luckybuy-index-wrap{
  }
</style>

<style lang="less">
  .luckybuy-index-wrap{

    .upload-wrap.max{
      .el-upload{
        display: none;
      }
    }

    .el-table{
      .cell{
        overflow: inherit;
      }
    }

    .el-form-item__error{
     /* left: 160px;*/
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
    .ml-0{
      .el-form-item__content{
        margin-left: 0 !important;
      }
    }

    .integral-wrap{

      .el-form-item__error{
        left: 295px !important;
      }
    }

    .data-error{
      .el-form-item__error{
        left: 120px !important;
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
    .dialog-data{
      .el-dialog {
        .el-dialog__body {
          text-align: left;
          .el-form{
            padding: 10px 30px;
            .el-form-item__content{
              display: flex;
              .el-radio-group{
                line-height: inherit;
              }
            }
            .el-form-item{
              /*margin-bottom: 10px;*/
            }
          }
        }
      }
    }
    .el-dialog{
      .el-form-item__error{
       /* left: 200px;*/
      }
    }
  }
</style>
