<!-- 升级套餐 - 新增/编辑 -->
<template>
  <common-tpl class="upgrade-index-wrap" footer>
    <template slot="main" >
      <el-form :model="formData" ref="formData" label-width="180px" v-loading="loading">

        <!-- 分区管理/宣传内容 -->
        <div class="commodity-details pos-r" >
          <gray-title title="分区设置" style="margin-bottom: 20px;"></gray-title>
          <el-form-item label=" 分区管理：" prop="themeName">
            <div class="pos-r partition-list-wrap">
              <div class="partition-list-box">
                <div class="item-list" :style="{width: groupList.length * 120 + 'px', 'margin-left': -columnPage * 120 * 5 + 'px'}">
                  <div class="pos-r item" v-for="(item, index) in groupList" >
                    <div class="partition-name ta-c" @click="changePartition(item)"  :class="{'border-left': index % 5 === 0, select: formData.goodsGroupId === item.groupId}" >{{item.groupName}}</div>
                    <div class="pos-a btn-group ta-c" @click.stop.prevent=""  :class="{select: formData.goodsGroupId === item.groupId && item.groupSort !== 0}">
                      <span class="cursor-p va-m btn" style="min-width: 50px" title="编辑" @click="handlePartitionBefore(item)">
                        <i class="el-icon-edit"></i>
                      </span>
                      <span class="cursor-p va-m btn" title="删除" @click.stop.prevent="handleDeletePartitionBefore(item)">
                        <i class="el-icon-delete"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <span class="el-icon-caret-left label-tip label-tip-left pos-a" :disabled="columnPage === 0" :class="{disabled: columnPage === 0}" @click="columnPageChange('minus')"></span>
              <span class="el-icon-caret-right label-tip label-tip-right pos-a" :disabled="columnPage >= groupList.length / 5 - 1" :class="{disabled: columnPage >= groupList.length / 5 - 1}" @click="columnPageChange('plus')"></span>
              <div class="add pos-a ta-c" @click="addVisible = true; addForm.groupStatus = 2 ;pageType = 1">
                <i class="el-icon-plus d-ib">&nbsp;&nbsp;新增分区</i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="宣传内容："prop="disseminateType" class="data-error ml-0" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
            <el-radio-group v-model="formData.disseminateType">
              <el-radio :label="1">广告位</el-radio>
              <el-radio :label="2">宣传素材</el-radio>
            </el-radio-group>
            <div style="margin-left: 60px;">
              <el-form-item prop="imgs"  v-if="formData.disseminateType === 1" :rules="[{required: true, type: 'array', message: '不能为空', trigger: 'change'}]">
                <thumbnail-component :empty="false" :styles="img100" :link="true" del :auto-delete="true" :list="formData.imgs" style="width: 100%;height: 100%;margin-left: 120px;" @change="deleteImg($event, formData.imgs)">
                  <template slot="other">
                    <upload-component :styles="img100" @success="uploadImgSuccess($event, formData.imgs)" v-if="formData.imgs.length === 0"></upload-component>
                    <div class="va-t d-ib" style="color: #f5a74a; line-height: 20px;padding:60px 0 0 20px">
                      <div>建议尺寸：750*1025px</div>
                      <div>建议大小：100KB以内</div>
                    </div>
                  </template>
                </thumbnail-component>
              </el-form-item>
              <el-form-item prop="buySourceId" v-if="formData.disseminateType === 2" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
                <el-select v-model="formData.buySourceId" placeholder="请选择" style="margin-left: 120px;">
                  <el-option v-for="item in materialListData" :label="item.sourceName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form-item>
<!--          <gray-title title="基础设置" style="margin: 20px 0"></gray-title>
          <el-row type="flex">
            <div>
              <el-form-item label="购买套餐赠送绿宝比例：" prop="greenGemstoneRate" :rules="publicRules">
                <el-row type="flex">
                  <el-input v-model="formData.greenGemstoneRate" style="width: 140px;"></el-input>
                  <span style="margin-left: 10px;">%</span>
                </el-row>
              </el-form-item>
              <el-form-item label="推荐代言商分佣比例：" prop="advocateProfitRate" :rules="publicRules">
                <el-row type="flex">
                  <el-input v-model="formData.advocateProfitRate" style="width: 140px;"></el-input>
                  <span style="margin-left: 10px;">%</span>
                </el-row>
              </el-form-item>
            </div>
            <el-form-item label="代言协议内容配置：" prop="themePresent" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
              <editor v-model="formData.themePresent" @change="editorChanget" img-icon = 'none'></editor>
            </el-form-item>
          </el-row>-->
        </div>
        <br>
        <!-- 商品设置 -->
        <gray-title title="商品设置">
          <template v-if="formData.goodsGroupSort === 0">
            <el-button slot="right" size="small" type="primary" round class="fl-r" @click="relationVisible = true" style="margin-left: 20px;"><i class="el-icon-plus" ></i> 添加套餐商品</el-button>
          </template>
          <el-button style="margin-left: 20px;" slot="right" size="small" type="primary" :disabled="!tableSelectionData.length" round class="fl-r" @click="batchStateVisible = true"><i class=""></i> 批量更改状态</el-button>
          <el-button slot="right" size="small" type="primary" :disabled="!tableSelectionData.length" round class="fl-r" @click="batchSwitchVisible = true"><i class=""></i> 批量切换分区</el-button>
        </gray-title>
        <br>
        <el-table border :data="formData.themeGoodsList" class="full-w" @select="handleSelectGoods" @select-all="handleSelectGoods">
          <el-table-column type="selection" width="55"></el-table-column>
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
              <div style="padding-right: 10px">{{scope.row.brandName | filterEmpty}}</div>
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
          <el-table-column prop="" label="套餐价" min-width="120px">
            <template slot-scope="scope">
              <div>{{scope.row.upgradePackagePrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="利润率">
            <template slot-scope="scope">{{filterProfitMargin(scope.row) | filterEmpty('%')}}</template>
          </el-table-column>
          <el-table-column prop="" label="状态" min-width="120px">
            <template slot-scope="scope">
              <div>{{scope.row.upgradePackageStatus === 1 ? '开启' : '关闭'}}</div>
            </template>
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
                    <div @click="handleLink(scope.row, 'switch')"><i class="icon el-icon-sort"></i>切换分区</div>
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
      <!-- 删除分区 -->
      <el-dialog title="删除分区" :visible.sync="deletePartitionVisible" width="540px" @close="">
        <p v-if="groupHasNum === 0">确认是否删除“{{deleteDialogData.groupName}}”？</p>
        <p v-else>该区存在商品不允许删除！请将商品移除后进行操作。</p>
        <span slot="footer" class="dialog-footer">
        <el-button @click="deletePartitionVisible = false">{{groupHasNum === 0 ? '取 消' : '返 回'}}</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleDeletePartition" v-if="groupHasNum === 0">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="pageType === 1 ? '添加分区' : '编辑分区'" :visible.sync="addVisible" width="600px" class="dialog-data" @open="" @close="resetForm('addForm')">
        <el-form :model="addForm" label-width="120px" ref="addForm" labelPosition="right">
          <el-form-item label="分区名称：" prop="groupName" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
            <el-input v-model="addForm.groupName" placeholder="限6个字符" maxLength="6"></el-input>
          </el-form-item>
          <el-form-item label="分区状态：" class="" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
            <el-radio-group v-model="addForm.groupStatus">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序：" prop="groupSort" :rules="groupSort">
            <el-input v-model="addForm.groupSort" placeholder="限1-100正整数" maxLength="3"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handlePartition('addForm')">确 定</el-button>
        </span>
      </el-dialog>

       <!-- 关联商品 -->
      <el-dialog title="关联商品" :visible.sync="relationVisible" width="1100px">
        <!-- 关联商品组件 -->
        <relation-goods :relationId="parseInt(formData.id)" :relationType="3" relationUrl="shareTheme/getShareThemeGoodsPage" @change="relationDataChange" @add="addRelationData" @remove="removeRelationData"></relation-goods>
      </el-dialog>

      <!-- 切换分区 -->
      <el-form :model="rowData" label-width="120px" ref="" labelPosition="right">
        <el-dialog title="切换分区" :visible.sync="switchVisible" width="500px" class="dialog-data">
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
          <span slot="footer" class="dialog-footer">
            <el-button @click="switchVisible = false">取 消</el-button>
            <el-button type="primary" :loading="dialogLoading" @click="handleSwitchDone">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 批量切换分区 -->
        <el-dialog title="批量切换分区" :visible.sync="batchSwitchVisible" width="500px" class="dialog-data">
          <span class="d-b ta-c" style="margin: 0 0 20px 0">您将调整选中的{{tableSelectionData.length}}个商品分区为：</span>
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
          <span slot="footer" class="dialog-footer">
            <el-button @click="batchSwitchVisible = false">取 消</el-button>
            <el-button type="primary" :loading="dialogLoading" @click="handleSwitchDone">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 批量更改状态 -->
        <el-dialog title="批量更改状态" :visible.sync="batchStateVisible" width="500px" class="dialog-data dialog-state">
          <span class="d-b ta-c" style="margin: 0 0 20px 0">您将调整选中的{{tableSelectionData.length}}个商品状态为：</span>
          <el-radio-group v-model="rowData.groupStatus" class="ta-c">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
          <span slot="footer" class="dialog-footer">
            <el-button @click="batchStateVisible = false">取 消</el-button>
            <el-button type="primary" :loading="dialogLoading" @click="updateSuperGroupStatus">确 定</el-button>
          </span>
        </el-dialog>
      </el-form>
    </template>

    <template slot="footer">
      <el-button  @click="$router.push('/admin/operation/extension/list')">返回</el-button>
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">保存</el-button>
    </template>

  </common-tpl>
</template>

<script>
  import RelationGoods from '@/components/public/RelationGoods'
  import pagePaper from '@/mixins/ListPublicPage'
  export default {
    components: {RelationGoods},
    mixins: [pagePaper],
    data () {
      // 校验分区排序
      let validateGroupSort = (rule, value, callback) => {
        if (value && (isNaN(value) || value < 1 || value > 100 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制1~100正整数'))
        callback()
      }

      let validateInt = (rule, value, callback) => {
        if (!value && value !== 0) return callback(new Error('不能为空'))
        if (value && (isNaN(value) || value < 1 || value > 100 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制1~100正整数'))
        callback()
      }

      // 校验排序
      let validateSort = (rule, value, callback) => {
        if (value && (isNaN(value) || value < 0 || value > 255 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制0~255正整数'))
        callback()
      }
      return {
        confirmLoading: false,
        groupList: [],              // 分区数据
        groupRowData: {},           // 当前分区数据
        columnPage: 0,              // 分区页码
        groupHasNum: '',            // 分区倗有的商品数量
        deleteDialogData: {},       // 删除分区前保存数据
        addForm: {                  // 添加分区数据
          groupName: '',
          groupId: '',
          groupStatus: 2,
          groupSort: '',
          groupType: 11
        },
        loading: true,
        dialogTableVisible: false,
        pageType: 1,                      // 页面类型 [1、新增 2、编辑]
        formData: {
          disseminateType: null,          // 主题状态
          buySourceId: '',                // 素材
          id: '',                         // 主题id
          themeType: 11,                   // 主题类型
          goodsGroupId: '',               // 分区ID  默认区： 1
          goodsGroupSort: '',             // 排序
          themeImage: '',                 // ..
          themePresent: '',              // ..
          themeBackdrop: '',              // ..
          sort: '',
          greenGemstoneRate: '',
          advocateProfitRate: '',
          themeGoodsList: [],             // 商品列表
          imgs: []                        // 图片
        },
        img100: {width: '100px', height: '100px'},          // 图片大小
        disabled: {color: '#aaa', cursor: 'not-allowed'},
        form: {
          purchaseNumNow: '',
          purchaseNumTotal: '',
          grabNumNowSys: '',            // 系统
          grabNumNow: '',               // 用户
          updateNumber: '',
          date: []
        },
        tableSelectionData: [],       // 多选结果集合
        groupSort: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {validator: validateGroupSort, trigger: 'blur'}
        ],
        ruleSort: [{validator: validateSort, trigger: 'blur'}],   // 商品排序
        publicRules: [{required: true, validator: validateInt, trigger: 'blur'}],   // ..
        relationVisible: false,           // 关联商品弹窗
        relationListData: [],             // 关联数据
        materialListData: [],             // 素材列表
        dialogLoading: false,             // 删除分区弹窗loading
        deletePartitionVisible: false,    // 删除分区弹窗
        addVisible: false,                // 添加分区弹窗
        switchVisible: false,             // 切换分区弹窗
        batchSwitchVisible: false,        // 批量切换分区弹窗
        batchStateVisible: false,         // 批量更改状态弹窗
        rowData: {},                      // 取消分享数据
        isEdited: false,                  // 是否编辑
        dialogType: 1,                    // [1 2 3,4,5]
        userInfo: {}                      // 用户信息
      }
    },

    watch: {
      formData: {
        handler (val) {
          this.$emit('change', val)
        },
        deep: true
      }
    },

    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData(['admin/operation/extension/upgrade/index', '/admin/operation/extension/upgrade/setting', '/admin/operation/extension/upgrade/details'], (res) => {
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

          if (results.groupListPage) this.formData.goodsGroupId = this.formData.goodsGroupId || results.groupListPage.list.length && results.groupListPage.list[0].groupId
          if (results.groupListPage) this.formData.goodsGroupSort = this.formData.goodsGroupSort || results.groupListPage.list.length && results.groupListPage.list[0].groupSort

          localStorage.setItem(this.$global.SYSTEM + 'ShareThemeId', results.id)
          this.formData.purchaseDes = results.purchaseDes === null ? '' : results.purchaseDes
          this.formData.themeName = results.themeName
          this.formData.id = parseInt(results.id)
          this.formData.disseminateType = results.disseminateType || 1
          this.formData.buySourceId = results.buySourceId && parseInt(results.buySourceId)
          this.formData.themeImage = results.themeImage
          this.formData.greenGemstoneRate = results.greenGemstoneRate
          this.formData.advocateProfitRate = results.advocateProfitRate
          this.formData.themePresent = results.themePresent
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

      uploadImgSuccess (url, imgList) {
        imgList.push({url: this.$Utils.filterImgUrl(url), imageUrl: url})
        this.formData.themeImage = url
      },

      /**
       * 商品图片删除（除主图外，其他全部图片删除加调）
       */
      deleteImg (event, imgList) {
        imgList = event
      },

      /**
       * 删除分区前操作
       */
      handleDeletePartitionBefore (row) {
        this.deleteDialogData = row
        this.$http.get('@ROOT_API/shareTheme/getGroupGoodsNum', {
          params: {
            groupId: row.groupId
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
          this.groupHasNum = resData.data
          this.deletePartitionVisible = true
        }).finally(() => {
          this.addVisible = false
        })
      },

      /**
       * 删除分区操作
       */
      handleDeletePartition (row) {
        this.$http.post('@ROOT_API/shareThemeGoodsGroup/deleteGoodsGroup', {
          groupId: this.deleteDialogData.groupId
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
          this.deletePartitionVisible = false
          if (row.groupId === this.formData.goodsGroupId) this.formData.goodsGroupId = this.groupList.length && this.groupList[0].groupId
          this.getListData()
        }).finally(() => {
          this.addVisible = false
        })
      },

      /**
       * 编辑分区前操作
       */
      handlePartitionBefore (row) {
        this.pageType = 2
        this.addVisible = true
        this.addForm = row
        this.$http.get('@ROOT_API/shareThemeGoodsGroup/getDetail', {params: {
          groupId: this.addForm.groupId
        }}).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.addVisible = true
          this.addForm = resData.data
        }).finally(() => {
          // this.addVisible = false
        })
      },

      /**
       * 保存分区操作
       */
      handlePartition (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          this.dialogLoading = true
          let url = this.pageType === 1 ? '@ROOT_API/shareThemeGoodsGroup/add' : '@ROOT_API/shareThemeGoodsGroup/edit'
          this.$http.post(url, {
            groupId: this.addForm.groupId ? this.addForm.groupId : '',
            groupName: this.addForm.groupName,
            groupStatus: this.addForm.groupStatus,
            groupType: this.addForm.groupType,
            groupSort: this.addForm.groupSort
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
            this.addVisible = false
            this.getListData()
          }).finally(() => {
            this.dialogLoading = false
          })
        })
      },

      /**
       * 编辑器内容改变
       */
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },

       /**
       * 内容改变
       */
      contentChange () {
        this.isEdited = true
      },

      /**
       * 分区分页
       */
      columnPageChange (type) {
        if (type === 'plus') {
          if (this.columnPage >= this.groupList.length / 5 - 1) return false
          this.columnPage++
        } else {
          if (this.columnPage === 0) return false
          this.columnPage--
        }
      },
      /**
       * 选择分区
       */
      changePartition (item) {
        this.tableSelectionData = []
        this.groupRowData = item
        this.formData.goodsGroupId = item.groupId
        this.formData.goodsGroupSort = item.groupSort
        // this.getListData()
        this.pageChange()
      },

       /**
       * 过滤利润率
       */
      filterProfitMargin (item) {
        let goodsPrice = item.upgradePackagePrice && !isNaN(item.upgradePackagePrice) ? parseFloat(item.upgradePackagePrice) : item.goodsPrice
        let res = (goodsPrice - item.buyingPrice) / goodsPrice * 100
        return (res !== -Infinity && !isNaN(res)) ? res.toFixed(2) : ''
      },

      /**
       * 接收关联数据
       */
      relationDataChange (results) {
        this.relationListData = results
        this.pageChange()
      },

      /**
       * 添加关联数据
       */
      addRelationData (results, type) {
        results.forEach((row, index) => {
          if (type || !this.formData.themeGoodsList.length) {
            this.formData.themeGoodsList.push(row)
            row.sort = parseInt(row.sort) || 0
          } else {
            this.formData.themeGoodsList.unshift(row)
            row.sort = parseInt(row.sort) || 0
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
     * table多选
     */
      handleSelectGoods (selection, row) {
        this.tableSelectionData = selection
        console.log('selection: ', selection)
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
        let idList = []
        this.tableSelectionData.forEach((item) => {
          idList.push(item.id)
        })
        this.$http.post('@ROOT_API/shareTheme/updateGoodsGroup', {
          id: this.rowData.id,
          idList: idList,
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
          this.tableSelectionData = []
          this.switchVisible = false
          this.batchSwitchVisible = false
          this.getListData()
        }).finally(() => {
          this.dialogLoading = false
        })
      },
      /**
       * 编辑器内容改变
       */
      editorChanget (value) {
        this.formData.themePresent = value
      },

      /**
       * 保存批量更新操作
       */
      updateSuperGroupStatus () {
        this.dialogLoading = true
        let idList = []
        this.tableSelectionData.forEach((item) => {
          idList.push(item.id)
        })
        this.$http.post('@ROOT_API/shareTheme/updateSuperGroupStatus', {
          idList: idList,
          groupStatus: this.rowData.groupStatus
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
          this.tableSelectionData = []
          this.batchStateVisible = false
          this.getListData()
        }).finally(() => {
          this.dialogLoading = false
        })
      },

      /**
       * 跳转链接
       */
      handleLink (item, type) {
        if (type === 'setting') {
          localStorage.setItem(this.$global.SYSTEM + 'settingData', JSON.stringify(item))
          localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
          let url = '/admin/operation/extension/upgrade/setting'
          this.$router.push({path: url, query: {id: item.id, goodsId: item.goodsId, type: this.formData.themeType}})
        } else if (type === 'switch') {
          localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
          this.switchVisible = true
          this.rowData = item
        } else {
          let url = '/admin/operation/extension/upgrade/details'
          this.$router.push({path: url, query: {id: item.goodsId}})
        }
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
  .upgrade-index-wrap{

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
    /*----------------------------------------------------------------------------------------------------------------*/
    .border-left{
      border-left: 1px solid #d9d9d9;
    }
    .partition-list-wrap{
      max-width: 760px;
      height: 42px;
      padding: 0 40px;
      /*margin-bottom: 20px;*/
     /* border: 1px solid #eee;*/
      .partition-list-box{
        max-width: 600px;
        overflow: hidden;
        height: 84px;

        .item-list{
          display: flex;
          box-sizing: border-box;
          .item:hover .btn-group {
            display: block;
            /*visibility: visible;*/
          }
          .item:first-child{
            .btn-group{
              display: none;
            }
          }
          .item:hover{
            background: #98D7FF;
          }
          .partition-name{
            width: 120px;
            cursor: pointer;
            border-bottom: 1px solid #d9d9d9;
            border-right: 1px solid #d9d9d9;
            border-top: 1px solid #d9d9d9;
            box-sizing: border-box;
            &.select{
              border: 1px solid #98D7FF;
              border-bottom: 1px solid #d9d9d9;
              /*overflow: hidden;*/
              vertical-align: top;
              background: #98D7FF;
              /*box-shadow: 0 0 15px rgba(0, 160, 233, .3);*/
            }
            &:hover{
              border: 1px solid #98D7FF;
              border-bottom: 1px solid #d9d9d9;
              /*overflow: hidden;*/
              vertical-align: top;
              background: #98D7FF;
              /*box-shadow: 0 0 15px rgba(0, 160, 233, .3);*/
            }
          }
          .btn-group{
            border-bottom: 1px solid #d9d9d9!important;
            border-right: 1px solid #d9d9d9!important;
            width: 100%;
            line-height: 30px;
            left: -1px;
            background: #98D7FF;
            display: none;
            /*visibility: hidden;*/
            .btn{
            /*  color: #fff;*/
              width: 24px;
              height: 24px;
              line-height: 24px;
              font-size: 18px;
              margin: 0 5px;
            }

            .btn.disabled{
              color: #aaa;
              cursor: not-allowed;
            }
          }
        }
      }

      .add{
        width: 120px;
        border: 1px solid #d9d9d9;
        right: 50px;
        top: 0px;
        cursor: pointer;
      }
      .label-tip{
        color: #56ade8;
        width: 50px;
        font-size: 42px;
        margin-top: -35px;
        top: 35px;
        cursor: pointer;
      }

      .label-tip.disabled{
        color: #c1e0ff;
        cursor: not-allowed;
      }

      .label-tip-left{
        left: 0px;
      }

      .label-tip-right{
        right: 0px !important;
      }
    }
  }
</style>

<style lang="less">
  .upgrade-index-wrap{

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

    .dialog-state{
      .el-dialog__body{
        text-align: center !important;
      }
    }
    .edui-editor{
      height: 280px;
    }
  }
</style>
