<!-- 宣传助手 -->
<template>
  <common-tpl class="propaganda-wrap" footer>
    <template slot="header">
      <high-search :textVisible="false">
        <div slot="search">
          <span style="font-size: 16px; padding-right: 5px">素材名称 :</span>
          <el-select size="small" v-model="formData.currentSourceId" style="width: 100px;" class="input-auto-wrap" @change="materialListChange">
            <el-option :value="item.id" :label="item.sourceName" :key="item.id" v-for="item in materialListData"></el-option>
          </el-select>
          &nbsp;
          <span class="cursor-p va-m btn" style="min-width: 50px" title="编辑" @click="editSourceBefore(2)">
            <i class="el-icon-edit"></i>
          </span>
          &nbsp;
          <span class="cursor-p va-m btn" title="删除" @click="deleteSourceVisible = true">
            <i class="el-icon-delete"></i>
          </span>
        </div>

        <template slot="edit">
          <el-button @click="editSourceBefore(1)"><i class="el-icon-plus fw-b"></i> 添加素材</el-button>
        </template>
      </high-search>
    </template>

    <template slot="main">
      <el-form :model="formData" :rules="rules" ref="main-fom" label-width="110px">
        <div class="main-wrap pos-r">
          <!-- 素材类型 -->
          <div class="left-box pos-a">
            <img class="full-wrap" :src="formData.backgroundImg | filterImgUrl" v-if="formData.backgroundImg">
            <div class="material-service-box pos-a" :style="{background: !formData.backgroundImg ? 'rgba(0, 0, 0, .2)' : ''}">
              <h2>{{formData.currentSourceName}} <span>{{formData.currentSourceDesc}}</span></h2>
              <div class="material-list-box pos-r">
                <div class="material-list  pos-a" :style="{top: -iconPage * 290 + 'px'}" :class="{rectangle: formData.listNum === 2, irregularity : formData.listNum === 3, exclusive : formData.listNum === 4 || formData.listNum === 5}">
                  <thumbnail-component :size="90" :styles="{'margin-bottom': '50px'}" isRadio :radioIndex="currentIconIndex" :empty="false" :link="false" :list="sourceDetailList" move edit posDel showList :sortBefore="handleSortBefore" @edit="handleIconEditBefore" @delete="deleteBefore" @change="subactivityChange" @radio="sourceDetailChange">

                  <template slot="text" slot-scope="scope">
                    <div class="ta-c pos-a full-w icon-text-wrap">
                      <strong class="d-b truncate">{{scope.row.iconName}}</strong>
                      <p class="truncate">{{scope.row.subtitle}}</p>
                    </div>
                  </template>

                  <!-- 上传 -->
                  <upload-component slot="other" size="90" :class="{circle: formData.listNum === 1, rectangle: formData.listNum === 2, irregularity: formData.listNum === 3, exclusive : formData.listNum === 4 || formData.listNum === 5}" disabled @click="handleIconEditBefore" title="新增图标"></upload-component>
                  </thumbnail-component>
                </div>
              </div>
              <span class="cursor-p el-icon-caret-left label-tip label-tip-left pos-a" :title="iconPage !== 0 ? '上一页' : ''" :disabled="iconPage === 0" :class="{disabled: iconPage === 0}" @click="iconPageChange('minus')"></span>
              <span class="cursor-p el-icon-caret-right label-tip label-tip-right pos-a" :title="!filterNextBtn ? '下一页' : ''" :disabled="filterNextBtn" :class="{disabled: filterNextBtn}" @click="iconPageChange('plus')"></span>
            </div>
            <div class="ta-c full-w pos-a page-btn-wrap" style="color: #999; bottom: 2px;">
              <span class="d-ib cursor-p" :class="{active: index === iconPage}" v-for="(n, index) in (Math.ceil(sourceDetailList.length / (formData.listNum === 3 ? 6 : (this.formData.listNum === 4 ? 3 : 8))))" @click="iconPage = index"></span>
            </div>
          </div>

          <!-- 素材类型设置 -->
          <div class="right-box">

            <gray-title title="素材类型设置">
              <template slot="right">
                <el-form-item label="状态：" class="pos-a" style="top: 2px; right: 15px; width: 240px" label-width="100px">
                  <el-radio-group class="activity-status-radio" v-model="formData.activityStatus">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
            </gray-title>

            <div class="material-box">
              <el-form-item label="选择模版 ：">
                <div class="d-ib stencil-type" v-for="item in 5" :class="{active: formData.listNum === item}" @click="formData.listNum = item">
                  <span class="d-ib va-t" v-for="item in 8"></span>
                </div>
              </el-form-item>

              <el-form-item label="已关联主题 : ">
                <el-button size="small" type="primary" :key="item" v-for="item in 1" style="currsor: pointer;">社群分享</el-button>
              </el-form-item>

              <!-- <el-form-item label="单页数量 : ">
                <el-input v-model="formData.pageNum" placeholder="0-50的正整数"></el-input>
              </el-form-item> -->

              <el-form-item label="开启背景 : ">
                <el-radio-group v-model="formData.backgroundOpen">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="上传背景 ：">
                <thumbnail-component :empty="false" :styles="upload100" :link="false" del :auto-delete="true" :list="formData.backDetailImgs" @delete="handleDeleteBgImg">
                  <template slot="other">
                    <upload-component :styles="upload100" @success="uploadBackDetailsImgSuccess" v-if="!formData.backDetailImgs.length"></upload-component>
                    <div class="va-t d-ib" style="color: #f5a74a; line-height: 30px; padding: 18px 0 0 15px;">
                      建议尺寸：750 * 750px<br>建议大小：100KB以内
                    </div>
                  </template>
                </thumbnail-component>
              </el-form-item>
            </div>
          </div>
        </div>

        <!-- 配置内容 -->
        <template v-if='formData.currentIconId'>
          <br>
          <gray-title title="配置内容"></gray-title>
          <div class="allocation-box">
            <el-form-item label="关联类型：">
              <el-radio-group v-model="formData.relationType">
                <el-radio :label="0">文案信息</el-radio>
                <el-radio :label="1">链接</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="formData.relationType === 0">
             <!--  <el-form-item label="图片 ：">
                <thumbnail-component :empty="false" :styles="upload100" del :auto-delete="true" :list="formData.allocationDetailImgs" @delete="delAllocationDetailsImgSuccess">
                  <template slot="other">
                    <upload-component :styles="upload100" @success="uploadAllocationDetailsImgSuccess" v-if="!formData.allocationDetailImgs.length"></upload-component>
                    <div class="va-t d-ib" style="color: #f5a74a; line-height: 30px; padding: 18px 0 0 15px;">
                      建议尺寸：750 * 750px<br>建议大小：100KB以内
                    </div>
                  </template>
                </thumbnail-component>
              </el-form-item> -->
              <el-form-item label="文字 : ">
                <editor v-model="formData.words" @change="ueditorChange"></editor>
                <!-- <el-input type="textarea" v-model="formData.words" style="width: 300px;" maxlength="500" rows="5">
                </el-input> -->
                <!-- <span style="color: #999; margin-left: 5px;">({{formData.words.length}}/500)</span> -->
              </el-form-item>
            </template>

            <div v-if="formData.relationType === 1">
              <el-form-item label="链接类型：">
                <el-radio-group v-model="formData.linkType">
                  <el-radio :label="1">内部链接</el-radio>
                  <el-radio :label="0">外部链接</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="指定链接：" prop="relationLink" v-if="formData.linkType === 1">
                <el-input v-model="formData.relationLink" class="d-n"></el-input>
                <internal-link :initData="internalLinkData" @change="internalLinkChange" v-if="formData.linkType === 1"></internal-link>
              </el-form-item>

              <el-form-item label="指定链接：" prop="relationUrl" v-else>
                <el-input size="medium" placeholder='输入url地址，500个字符以内，格式"http://"' v-model="formData.relationUrl"></el-input>
              </el-form-item>
            </div>
          </div>
        </template>
      </el-form>
    </template>

    <!-- 弹窗部分 -->
    <template slot="other">
      <!-- 添加素材弹窗 -->
      <el-dialog :title="editSourceType === 1 ? '新增素材' : '编辑素材'" :visible.sync="editSourceVisible" width="500px">
        <el-form class="ta-l" style="padding-right: 40px;" :model="formData" :rules="rules" ref="source-dialog-form" label-width="120px">
          <el-form-item label="素材名称：" prop="dialogSourceName">
            <el-input placeholder="8个字符以内" maxlength="8" v-model="formData.dialogSourceName"></el-input>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input type="textarea" rows="3" placeholder="50个字符以内" maxlength="50" v-model="formData.dialogSourceDesc"></el-input>
          </el-form-item>
        </el-form>

        <br>
        <el-button size="medium" @click="editSourceVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="sourceLoading" @click="handleEditSource('source-dialog-form')">确定</el-button>
      </el-dialog>

      <!-- 删除素材弹窗 -->
      <el-dialog title="删除素材" :visible.sync="deleteSourceVisible" width="450px">
        <span class="ta-c">
          <el-table :data="tableData" ref="goods-table">
            <el-table-column label="序号" min-width="90">
              <template slot-scope="scope">{{scope.row.serial | filterEmpty}}</template>
            </el-table-column>
            <el-table-column label="关联内容" min-width="200">
              <template slot-scope="scope">{{scope.row.brandName | filterEmpty}}</template>
            </el-table-column>
            <template slot="empty">
              <no-data></no-data>
            </template>
          </el-table>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteSourceVisible = false">取 消</el-button>
          <el-button type="primary" :loading="deleteSourceLoading" @click="deleteSourceHandle()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加 || 编辑图标弹窗 -->
      <el-dialog :title="editIconType === 1 ? '添加图标' : '编辑图标'" :visible.sync="editIconVisible" width="500px">
        <el-form class="ta-l" style="padding-right: 40px;" :model="formData" :rules="rules" ref="icon-form" label-width="120px">
          <el-form-item label="图标名称：" prop="dialogIconName">
            <el-input placeholder="16个字符以内" maxlength="16" v-model="formData.dialogIconName"></el-input>
          </el-form-item>
          <el-form-item label="副标题：">
            <el-input placeholder="16个字符以内" maxlength="16" v-model="formData.dialogSubtitle"></el-input>
          </el-form-item>
          <el-form-item label="上传图标 ：">
            <thumbnail-component :empty="false" :styles="upload100" del :auto-delete="true" :list="formData.dialogIconList" @delete="deleteIconImgSuccess">
              <template slot="other">
                <upload-component :styles="upload100" @success="uploadIconImgSuccess" v-if="!formData.dialogIconList.length"></upload-component>
                <div class="va-t d-ib" style="color: #f5a74a; line-height: 30px; padding: 18px 0 0 15px;">
                  建议尺寸：100 * {{formData.listNum === 3 ? 200 : 100}}px<br>建议大小：50KB以内
                </div>
              </template>
            </thumbnail-component>
          </el-form-item>
        </el-form>

        <br>
        <el-button size="medium" @click="editIconVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="editIconLoading" @click="handleSaveIcon('icon-form')">确定</el-button>
      </el-dialog>

      <!-- 删除图标弹窗 -->
      <el-dialog title="删除图标" :visible.sync="deleteIconVisible" width="450px">
        <br>
        <span class="ta-c">确认是否删除图标？</span>
        <br>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteIconVisible = false">取 消</el-button>
          <el-button type="primary" :loading="deleteIconLoading" @click="handleDeleteIcon()">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <template slot="footer">
    <!-- :disabled="!formData.currentIconId" -->
      <el-button type="primary" :loading="saveLoading" :title="!formData.currentIconId ? '请选择图标' : ''" @click="handleSavePubic('main-fom')">保存</el-button>
    </template>
  </common-tpl>
</template>

<script>
import InternalLink from '@/components/public/InternalLink'
import Editor from '@/components/public/Editor'
export default {
  components: {InternalLink, Editor},
  data () {
    // 校验外部链接
    let validateRelationUrl = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入外部链接'))
      if (!value.toString().match(/^(https):\/\/.*/gi)) return callback(new Error('请输入正确的外部链接'))
      callback()
    }
    return {
      saveLoading: false,           // 保存loading
      sourceLoading: false,         // 新增素材确定loading
      editSourceVisible: false,     // 添加素材弹窗
      editSourceType: 1,            // 操作素材 [1、新增，2、编辑]
      editSourceData: {},           // 当前素材数据

      deleteSourceVisible: false,   // 删除素材弹窗
      deleteSourceLoading: false,   // 删除素材弹窗loading

      sourceDetailList: [],         // 图标列表数据
      editIconData: {},             // 编辑图标数据
      editIconType: 1,              // 图标弹窗类型 [1、新增，2、编辑]
      editIconLoading: false,       // 保存图标loading
      editIconVisible: false,       // 是否显示图标弹窗

      deleteIconLoading: false,     // 删除图标弹窗loading
      deleteIconVisible: false,     // 删除图标弹窗
      deleteIconData: {},           // 删除图标数据

      tableData: [{                 // 删除素材弹窗里的关联表格
        serial: '1',
        brandName: '社群分享'
      }, {
        serial: '2',
        brandName: '大转盘'
      }],

      currentIconIndex: '',         // 当前图标索引
      currentIconData: {},          // 当前图标数据
      iconPage: 0,                  // 当前图标页

      materialListData: [],         // 素材对象
      formData: {
        currentSourceId: '',        // 当前选中素材id
        currentSourceName: '',      // 当前选中素材名称
        currentSourceDesc: '',      // 当前选中素材描述

        currentIconId: '',          // 当前图标id

        materialIconImgs: [],       // 素材图标列表
        activityStatus: 1,          // 素材类型状态 [1、开启 0、关闭]
        listNum: 1,                 // 显示数量 [1、圆形8个，2、方形8个，3、方形六个]

        dialogSourceName: '',       // 素材弹窗 - 素材名称
        dialogSourceDesc: '',       // 素材弹窗 - 素材描述

        pageNum: '',                // 单页数量
        backgroundOpen: 0,          // 开启背景 [0、开启 1、关闭]
        backgroundImg: '',          // 上传背景图
        backDetailImgs: [],         // 上传背景列表
        relationType: 0,            // 关联类型 [0、文案信息 1、链接]
        sourceImage: '',            // 配置图片
        allocationDetailImgs: [],   // 配置图片列表
        words: '',                  // 文字描述
        linkType: 1,                // 关联类型 [ 0 外部链接 1内部链接]
        relationUrl: '',            // 指定链接 [0、开启 1、关闭]
        relationLink: '',           // 内部链接

        dialogIconName: '',         // 图标名称
        dialogSubtitle: '',         // 副标题
        dialogIconImg: '',          // 图标
        dialogIconList: []          // 图标列表
      },
      copyFormData: {},             // 拷贝表单数据
      maxSort: '',                  // 最大排序
      internalLinkData: {
        grandNode: '',          // 一级id
        parentNode: '',         // 二级id
        childNode: ''           // 三级id
      },
      copyInternalLinkData: {}, // 拷贝内部链接数据
      rules: {
        dialogSourceName: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
        dialogIconName: [{required: true, message: '请输入图标名称', trigger: 'blur'}],
        relationLink: [{required: true, message: '请选择指定链接', trigger: 'change'}],
        relationUrl: [{required: true, validator: validateRelationUrl, trigger: 'change'}]
      },
      upload100: {width: '98px', height: '98px'},
      pageData: {                   // 列表分页
        currentPage: 1,
        pageSize: 1000,
        total: 0
      }
    }
  },

  watch: {
    'formData.listNum' () {
      this.updateIconPage()
    }
  },

  computed: {
    filterNextBtn () {
      let len = this.formData.listNum === 3 ? 6 : (this.formData.listNum === 4 || this.formData.listNum === 5 ? 3 : 8)
      return this.iconPage >= (this.sourceDetailList.length + 1) / len - 1
    }
  },

  mounted () {
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.copyInternalLinkData = this.$Utils.deepCopy(this.internalLinkData)
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('operation/marketing/propaganda', (res) => {
      this.formData = res
    })

    this.getListData()
  },

  methods: {
     /**
     * 获取素材列表数据
     */
    getListData () {
      this.loading = true
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
        let results = resData.data
        if (results.length) {
          this.materialListData = results
          // 判断刷新页面上一次选中的素材
          if (this.formData.currentSourceId) {
            results.forEach((row) => {
              if (parseInt(row.id) === parseInt(this.formData.currentSourceId)) {
                this.materialListChange(row.id, true)
              }
            })
          } else {
            this.materialListChange(this.materialListData[0].id, true)
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },

     /**
     * 素材名称改变
     */
    materialListChange (id, flag) {
      if (!flag) this.resetSourceData()

      this.materialListData.forEach((row) => {
        if (parseInt(row.id) === parseInt(id)) {
          this.editSourceData = row

          this.formData.currentSourceId = parseInt(id)
          this.formData.currentSourceName = row.sourceName
          this.formData.currentSourceDesc = row.description

          this.formData.activityStatus = parseInt(row.sourceStatus)  // 素材状态 0 否 1 是
          this.formData.listNum = row.templateType || 1              // 模板类型
          this.formData.backgroundOpen = row.backgroundOpen || 0     // 背景是否开启 0 否 1 是

          this.formData.backDetailImgs = []

          this.formData.backgroundImg = row.backgroundImg       // 背景是否开启 0 否 1 是
          if (row.backgroundImg) this.$set(this.formData.backDetailImgs, 0, {url: this.$Utils.filterImgUrl(row.backgroundImg)})

          // 素材详情列表
          let sourceDetailList = row.sourceDetailList
          if (sourceDetailList && sourceDetailList.length) {
            // 初始化图标数据
            if (this.formData.currentIconId) {
              sourceDetailList.forEach((list, index) => {
                if (parseInt(list.id) === parseInt(this.formData.currentIconId)) this.sourceDetailChange(list, index)
              })
            } else {
              this.sourceDetailChange(sourceDetailList[0], 0)
            }

            // 排序最大值
            let sortArr = []
            row.sourceDetailList.forEach((list, i) => {
              if (list.icon) list.url = this.$Utils.filterImgUrl(list.icon)
              sortArr.push(list.sort)
            })
            this.maxSort = Math.max(...sortArr)
          } else {
            this.formData.currentIconId = ''
          }
          this.sourceDetailList = row.sourceDetailList || [] // 素材详情列表

          this.updateTemplateStyle()
        }
      })
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 获取图标详情数据
     */
    getSourceDetailsData (id, index) {
      if (!id) return false
      this.$http.post('@ROOT_API/source/getSourceDetailById', {
        id
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
        if (results.icon) results.url = this.$Utils.filterImgUrl(results.icon)
        this.$set(this.sourceDetailList, index, resData.data)
        this.updateTemplateStyle()
      })
    },

    /**
     * 更新模板3样式
     */
    updateTemplateStyle () {
      let flagIndex = 0
      this.sourceDetailList.forEach((row, index) => {
        row.customClass = ''
        if (index > 1) {
          if (flagIndex < 2) row.customClass = 'irregularity'
          flagIndex++
          if (flagIndex >= 6) flagIndex = 0
        }
      })
    },

    /**
     * 更新图标分页
     */
    updateIconPage () {
      // let len = this.formData.listNum === 3 ? 6 : 8
      let len = this.formData.listNum === 3 ? 6 : (this.formData.listNum === 4 ? 3 : 8)
      this.iconPage = parseInt(this.currentIconIndex / len)
    },

    /**
     * 重置素材数据
     */
    resetSourceData () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      this.internalLinkData = this.$Utils.deepCopy(this.copyInternalLinkData)
    },

     /**
     * 图标分页
     */
    iconPageChange (type) {
      // let len = this.formData.listNum === 3 ? 6 : 8
      let len = this.formData.listNum === 3 ? 6 : (this.formData.listNum === 4 || this.formData.listNum === 5 ? 3 : 8)
      if (type === 'plus') {
        if (this.iconPage >= (this.sourceDetailList.length + 1) / len - 1) return false
        this.iconPage++
      } else {
        if (this.iconPage === 0) return false
        this.iconPage--
      }
    },

    /**
     * 排序
     */
    handleSortBefore (type, index) {
      let sourceDetailList = []
      let temp = this.sourceDetailList[index]
      let sort = temp.sort
      let sortIndex = type === 'next' ? index + 1 : index - 1
      sourceDetailList.push(
        {
          id: this.sourceDetailList[sortIndex].id,
          sort: temp.sort
        },
        {
          id: temp.id,
          sort: this.sourceDetailList[sortIndex].sort
        },
        {
          id: this.sourceDetailList[sortIndex].id,
          sort: temp.sort
        }
      )
      type === 'next' ? sourceDetailList.pop() : sourceDetailList.shift()
      this.$http.post('@ROOT_API/source/updateSourceDetailSorts', {
        sourceDetailList
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
        temp.sort = this.sourceDetailList[sortIndex].sort
        this.sourceDetailList[sortIndex].sort = sort
        this.$set(this.sourceDetailList, index, this.sourceDetailList[sortIndex])
        this.$set(this.sourceDetailList, sortIndex, temp)
        this.updateIconIndex()
      })
    },

     /**
     * 新增/编辑素材前操作
     */
    editSourceBefore (type) {
      this.editSourceVisible = true
      this.editSourceType = type
      if (type === 1) {
        this.formData.dialogSourceName = ''
        this.formData.dialogSourceDesc = ''
      } else {
        this.materialListData.forEach((row) => {
          if (parseInt(row.id) === this.formData.currentSourceId) {
            this.formData.dialogSourceName = row.sourceName
            this.formData.dialogSourceDesc = row.description
          }
        })
      }
      this.$nextTick(() => {
        this.$refs['source-dialog-form'].clearValidate()
      })
    },

    /**
     * 新增/编辑素材
     */
    handleEditSource (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.sourceLoading = true
        this.handleSaveSourceAjax()
      })
    },

    /**
     * 保存素材接口调用
     */
    handleSaveSourceAjax (type) {
      this.$http.post('@ROOT_API/source/saveOrUpdateSource', {
        id: type === 'save' || this.editSourceType === 2 ? this.formData.currentSourceId : '',    // 否 int 素材id 新增时为空 ，编辑不能为空
        sourceName: type === 'save' ? this.formData.currentSourceName : this.formData.dialogSourceName, // 是 string  素材名称
        description: type === 'save' ? this.formData.currentSourceDesc : this.formData.dialogSourceDesc, // 否 string  描述
        templateType: type === 'save' ? this.formData.listNum : this.editSourceType === 2 ? this.editSourceData.templateType : 1,    // 否 int 模板类型 1 2 3
        pageNum: '',                            // 否 int 单页数量
        backgroundOpen: type === 'save' ? this.formData.backgroundOpen : this.editSourceType === 2 ? this.editSourceData.backgroundOpen : 1, // 否 int 背景是否开启 0 否 1 是
        backgroundImg: type === 'save' ? this.formData.backgroundImg : this.editSourceType === 2 ? this.editSourceData.backgroundImg : '',   // 否 string  背景图片
        sourceStatus: type === 'save' ? this.formData.activityStatus : this.editSourceType === 2 ? this.editSourceData.activityStatus : 1    // 否 int 素材状态 0 否 1 是
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
        }
        this.$message({
          message: resData.msg,
          type: 'success',
          duration: 1500
        })
        if (type !== 'save') {
          // 弹窗编辑时更新选中列表数据
          if (this.editSourceType === 2) {
            this.materialListData.forEach((row, index) => {
              if (parseInt(row.id) === this.formData.currentSourceId) {
                row.sourceName = this.formData.dialogSourceName
                row.description = this.formData.dialogSourceDesc
                this.materialListChange(this.formData.currentSourceId)
              }
            })
          } else {
            // 新增时追加数据
            if (this.materialListData.length) {
              this.materialListData.unshift(resData.data)
            } else {
              this.materialListData.push(resData.data)
            }
            this.updateTemplateStyle()
          }
          this.editSourceVisible = false
        }
      }).finally(() => {
        setTimeout(() => {
          this.sourceLoading = false
        }, 200)
      })
    },

    /**
     * 删除素材
     */
    deleteSourceHandle () {
      this.deleteSourceLoading = true
      this.$http.get('@ROOT_API/source/deleteSourceById', {
        params: {
          id: parseInt(this.formData.currentSourceId)
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
        // this.$message({
        //   message: resData.msg,
        //   type: 'success',
        //   duration: 1500
        // })
        // 移除选中数据
        this.materialListData.forEach((row, index) => {
          if (parseInt(row.id) === this.formData.currentSourceId) this.materialListData.splice(index, 1)
        })
        this.materialListChange(this.materialListData[0].id)
        this.deleteSourceVisible = false
      }).finally(() => {
        setTimeout(() => {
          this.deleteSourceLoading = false
        }, 200)
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
     * 编辑图标编辑前操作
     */
    handleIconEditBefore (item, index) {
      if (!item) { // 新增图标清空操作
        this.editIconType = 1
        this.formData.dialogIconName = ''
        this.formData.dialogSubtitle = ''
        this.formData.dialogIconImg = ''
        this.formData.dialogIconList = []
      } else { // 编辑图标
        this.editIconType = 2
        this.editIconData = item
        this.formData.dialogIconName = item.iconName
        this.formData.dialogSubtitle = item.subtitle
        this.formData.dialogIconImg = item.icon
        this.formData.dialogIconList = []
        if (item.icon) this.$set(this.formData.dialogIconList, 0, {url: this.$Utils.filterImgUrl(item.icon)})
      }
      this.editIconLoading = false
      this.editIconVisible = true
      this.$nextTick(() => {
        this.$refs['icon-form'].clearValidate()
      })
    },

    /**
     * 新增 || 编辑图标
     */
    handleSaveIcon (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.handleSaveIconAjax()
        // this.$router.go(0)
      })
    },

    /**
     * 删除图标前操作
     */
    deleteBefore (item, index) {
      this.deleteIconVisible = true
      this.deleteIconData = item
    },

    /**
     * 删除图标栏目
     */
    handleDeleteIcon () {
      this.deleteIconLoading = true
      this.$http.get('@ROOT_API/source/deleteSourceDetailById', {
        params: {
          id: this.deleteIconData.id
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
          duration: 1500
        })
        // 移除图标数据
        this.sourceDetailList.forEach((row, index) => {
          if (parseInt(row.id) === parseInt(this.deleteIconData.id)) {
            this.sourceDetailList.splice(index, 1)
            // 如果删除当前选中图标，默认选中第一个数据
            if (parseInt(row.id) === parseInt(this.formData.currentIconId) && this.sourceDetailList.length) this.sourceDetailChange(this.sourceDetailList[0], 0)
          }
        })
        this.updateTemplateStyle()
        if (!this.sourceDetailList.length) this.formData.currentIconId = ''
        this.deleteIconVisible = false
      }).finally(() => {
        setTimeout(() => {
          this.deleteIconLoading = false
        }, 200)
      })
    },

    /**
     * 图标切换
     */
    sourceDetailChange (item, index) {
      this.currentIconIndex = index
      console.log('item: ', item)
      this.currentIconData = this.$Utils.deepCopy(item)
      // let len = this.formData.listNum === 3 ? 6 : 8
      let len = this.formData.listNum === 3 ? 6 : (this.formData.listNum === 4 ? 3 : 8)
      this.iconPage = parseInt(this.currentIconIndex / len)
      this.formData.currentIconId = item.id             // 图标id

      // 清空数据
      this.formData.sourceImage = ''
      this.formData.relationLink = ''
      this.formData.relationUrl = ''
      this.formData.allocationDetailImgs = []
      // this.forData.relationType = ''
      this.formData.words = ''

      this.internalLinkData = this.$Utils.deepCopy(this.copyInternalLinkData)

      this.formData.relationType = parseInt(item.iconType) || 0 // icon关联类型 0 文案 1 链接
      if (this.formData.relationType === 0) {
        this.formData.words = item.words || ''
        this.formData.sourceImage = item.sourceImage
        if (item.sourceImage) this.$set(this.formData.allocationDetailImgs, 0, {url: this.$Utils.filterImgUrl(item.sourceImage)})
      } else {
        this.formData.linkType = item.linkType && parseInt(item.linkType) !== 0 ? parseInt(item.linkType) : 0 // 链接类型 0 外部链接 1内部链接

        if (parseInt(item.linkType) === 1) { // 内部链接
          this.internalLinkData.grandNode = parseInt(item.grandNode) || ''
          this.internalLinkData.parentNode = parseInt(item.parentNode) || ''
          this.internalLinkData.childNode = parseInt(item.childNode) || ''
        } else { // 外部链接
          this.formData.relationUrl = item.relateUrl        // 外部链接
        }
      }
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 更新图标索引
     */
    updateIconIndex () {
      this.sourceDetailList.forEach((row, index) => {
        if (parseInt(row.id) === parseInt(this.formData.currentIconId)) this.currentIconIndex = index
      })
    },

    /**
     * 背景图上传成功
     */
    uploadBackDetailsImgSuccess (url, index) {
      this.formData.backgroundImg = url
      this.$set(this.formData.backDetailImgs, 0, {url: this.$Utils.filterImgUrl(url)})
    },

    /**
     * 背景图删除成功
     */
    handleDeleteBgImg () {
      this.formData.backgroundImg = ''
    },

    /**
     * 配置图片删除成功
     */
    delAllocationDetailsImgSuccess (url, index) {
      this.formData.sourceImage = ''
      this.formData.allocationDetailImgs = []
    },

    /**
     * 配置图片上传成功
     */
    uploadAllocationDetailsImgSuccess (url, index) {
      this.formData.sourceImage = url
      this.$set(this.formData.allocationDetailImgs, 0, {url: this.$Utils.filterImgUrl(url), img: url})
    },

    /**
     * 素材图标上传成功
     */
    uploadImgDetailsImgSuccess (url, index) {
      this.$set(this.formData.materialIconImgs, 0, {url: this.$Utils.filterImgUrl(url), img: url})
    },

    /**
     * 图标删除成功
     */
    deleteIconImgSuccess (url, index) {
      this.formData.dialogIconImg = ''
      this.formData.dialogIconList = []
    },

    /**
     * 图标上传成功
     */
    uploadIconImgSuccess (url, index) {
      this.formData.dialogIconImg = url
      this.$set(this.formData.dialogIconList, 0, {url: this.$Utils.filterImgUrl(url)})
    },

    /**
     * 内部链接改变
     */
    internalLinkChange (results) {
      Object.assign(this.internalLinkData, results)
      this.formData.relationLink = results.relationUrl
    },

    /**
     * 编辑器内容改变
     */
    ueditorChange (value) {
      this.formData.words = value
    },

    /**
     * 提交表单
     */
    handleSavePubic (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.handleSaveSourceAjax('save')
        if (this.formData.currentIconId) this.handleSaveIconAjax('save')
      })
    },

    /**
     * 保存图标接口调用
     */
    handleSaveIconAjax (type) {
      if (type === 'save') {
        this.saveLoading = true
      } else {
        this.editIconLoading = true
      }
      let relateUrl = ''
      let sourceImage = ''
      let words = ''
      if (type === 'save') {
        relateUrl = this.formData.linkType === 1 ? this.formData.relationLink : this.formData.relationUrl
        if (this.formData.relationType === 0) {
          sourceImage = this.formData.sourceImage
          words = this.formData.words
        }
      } else {
        relateUrl = this.editIconData.relateUrl
        if (this.editIconType === 2 && parseInt(this.editIconData.iconType) === 0) {
          sourceImage = this.editIconData.sourceImage
          words = this.editIconData.words
        }
      }
      this.$http.post('@ROOT_API/source/saveOrUpdateSourceDetail', {
        id: type === 'save' ? this.formData.currentIconId : this.editIconType === 2 ? parseInt(this.editIconData.id) : '', // 否 int 素材详情id 新增时为空 ，编辑不能为空
        sourceId: this.formData.currentSourceId,          // 是 int 素材id
        iconName: type === 'save' ? this.currentIconData.iconName : this.formData.dialogIconName,           // 是 string  图标名称
        sort: type === 'save' ? this.currentIconData.sort : this.editIconType === 2 ? this.editIconData.sort : this.maxSort + 1,                       // 是 int 排序
        subtitle: type === 'save' ? this.currentIconData.subtitle : this.formData.dialogSubtitle,           // 否 string  副标题
        icon: type === 'save' ? this.currentIconData.icon : this.formData.dialogIconImg,                // 否 int icon路径
        iconType: type === 'save' ? this.formData.relationType : this.editIconType === 2 ? this.editIconData.iconType : '',             // 否 int icon关联类型 0 文案 1 链接
        sourceImage, // 否 string  文案关联的图片
        words,       // 否 string  文案信息
        linkType: type === 'save' ? this.formData.linkType : this.editIconType === 2 ? this.editIconData.linkType : '',                 // 否 int 链接类型 0 外部链接 1内部链接
        relateUrl, // 否 string  内部链接路径
        grandNode: type === 'save' ? this.internalLinkData.grandNode : this.editIconType === 2 ? this.editIconData.grandNode : '',       // 否 int 内部链接 一级节点
        parentNode: type === 'save' ? this.internalLinkData.parentNode : this.editIconType === 2 ? this.editIconData.parentNode : '',     // 否 int 内部链接 二级节点
        childNode: type === 'save' ? this.internalLinkData.childNode : this.editIconType === 2 ? this.editIconData.childNode : ''        // 否 int 内部链接 三级节点
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
        let results = resData.data
        // 更新图标数据
        results.url = this.$Utils.filterImgUrl(results.icon)
        if (type !== 'save' && this.editIconType === 1) {
          this.sourceDetailList.push(results)
          this.maxSort++
          if (this.sourceDetailList.length === 1) this.sourceDetailChange(this.sourceDetailList[0], 0)
        } else {
          this.sourceDetailList.forEach((row, index) => {
            if (parseInt(row.id) === parseInt(results.id)) {
              if (results.icon) results.url = this.$Utils.filterImgUrl(results.icon)
              this.$set(this.sourceDetailList, index, results)
              // 更新当前选中图标对象
              if (parseInt(row.id) === parseInt(this.currentIconData.id)) this.currentIconData = this.$Utils.deepCopy(results)
              console.log('this.currentIconData: ', this.currentIconData)
            }
          })
        }
        // if (type !== 'save') {
        //   if (this.editIconType === 1) {
        //     resData.data.url = this.$Utils.filterImgUrl(this.formData.dialogIconImg)
        //     this.sourceDetailList.push(resData.data)
        //     this.maxSort++
        //     if (this.sourceDetailList.length === 1) this.sourceDetailChange(this.sourceDetailList[0], 0)
        //   } else {
        //     this.sourceDetailList.forEach((row) => {
        //       if (parseInt(row.id) === parseInt(this.editIconData.id)) {
        //         row.iconName = this.formData.dialogIconName
        //         row.icon = this.formData.dialogIconImg
        //         row.url = ''
        //         if (this.formData.dialogIconImg) row.url = this.$Utils.filterImgUrl(this.formData.dialogIconImg)
        //         row.subtitle = this.formData.dialogSubtitle
        //       }
        //     })
        //   }
        // } else {
        //   this.sourceDetailList.forEach((row, index) => {
        //     if (parseInt(row.id) === parseInt(results.id)) this.$set(this.sourceDetailList, index, results)
        //   })
        //   // this.getSourceDetailsData(this.formData.currentIconId, this.currentIconIndex)
        // }
        this.editIconVisible = false
        this.updateTemplateStyle()
      }).finally(() => {
        setTimeout(() => {
          this.saveLoading = false
          this.editIconLoading = false
        }, 200)
      })
    }
  }
}
</script>

<style lang="less">
.propaganda-wrap{

  .el-form-item::after, .el-form-item__content::after{
    clear: inherit;
  }

  /* -------------------- { 侧边栏 } -------------------- */
  .main-wrap{
    min-height: 500px;
    padding-left:520px;
    left: 0;
    top: 0;

    /*------- 素材服务 ------- */
    .left-box{
      width: 505px;
      height: 500px;
      left: 0;
      top: 0;
      background: #eee;
      border: 1px solid #eee;

      .material-service-box{
        margin: 10px;
        padding: 30px 30px 0 30px;
        border: 1px solid rgba(255, 255, 255, .3);
        background: rgba(0, 0, 0, .6);
        bottom: 15px;
        border-radius: 5px;

        h2{
          color: #fff;
          font-weight: normal;
          font-size: 16px;
          line-height: 35px;
          padding-left: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, .8);

          span{
            color: #eee;
            font-size: 12px;
          }
        }

        .material-list-box{
          width: 420px;
          height: 290px;
          padding: 17px;
          margin-top: 10px;
          overflow: hidden;
          box-sizing: border-box;

          .material-list{

            .thumbnail-component-wrap{
              overflow: hidden;
            }

            .list-wrap{
              border-color: rgba(255, 255, 255, .2);
              cursor: pointer;
              margin: 5px;
              border-radius: 100%;

              a{
                overflow: hidden;
                border-radius: 100%;
              }

              /* -------------------- { 图标标题及描述 } -------------------- */
              .icon-text-wrap{
                color: #fff;
                height: 50px;
                font-size: 14px;
                left: 0;
                top: 100%;

                strong{
                  padding: 6px 0 3px 0;
                }

                p{
                  color: rgba(255, 255, 255, .8);
                  font-size: 13px;
                }
              }
            }

            .list-wrap.radioed{
              border-color: rgba(0, 160, 233, .8);
            }

            /* -------------------- { 圆角矩形 } -------------------- */
            &.rectangle{
              .list-wrap{
                border-radius: 15px;

                a{
                  border-radius: 15px;
                }
              }
            }

            /* -------------------- { 不规则 } -------------------- */
            &.irregularity{
              .list-wrap{
                border-radius: 15px;

                a{
                  border-radius: 15px;
                }

                &.irregularity{
                  width: 190px !important;
                }
              }
            }

            /* -------------------- { 买卖仓专属 } -------------------- */
            &.exclusive{
              .list-wrap{
                width: 120px !important;
                height: 290px;
                margin-top: 78px !important;
                margin-bottom: 122px !important;
                border-radius: 15px;

                a{
                  border-radius: 15px;
                }
              }
            }
          }
        }

        .upload-component-wrap{
          margin-top: 5px;
          margin-left: 5px;

          &.circle{
            .el-upload{
              border-radius: 100%;
            }
          }

          &.rectangle, &.irregularity{
            .el-upload{
              border-radius: 20px;
            }
          }

          &.exclusive{
            .el-upload{
              width: 120px;

              .el-icon-plus{
                margin-left: 0;
              }
            }
            margin-top: 78px;
          }
        }


        .label-tip{
          color: rgba(255, 255, 255, .8);
          width: 30px;
          font-size: 30px;
          margin-top: 20px;
          top: 50%;
        }

        .label-tip.disabled{
          color: rgba(255, 255, 255, .3);
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

      .page-btn-wrap{
        span{
          width: 10px;
          height: 10px;
          margin: 0 3px;
          background: #ccc;
          border-radius: 5px;

          &.active{
            width: 18px;
            background: #ee4938;
          }
        }
      }
    }

    /* -------------------- { 素材类型设置 } -------------------- */
    .material-box{
      margin: 20px;

      /*选择模块*/
      .stencil-type{
        width: 90px;
        height: 38px;
        line-height: 22px;
        border: 1px solid #999;
        padding: 7px 0;
        margin-right: 20px;
        overflow: hidden;

        span{
          width: 14px;
          height: 14px;
          border: 1px solid #999;
          margin-left: 5px;
          margin-bottom: 7px;
        }

        &:nth-child(1){
          span{
            border-radius: 100%;
          }
        }

        &:nth-child(2), &:nth-child(3){
          span{
            border-radius: 4px;
          }
        }

        &:nth-child(3){
          span:nth-child(3), span:nth-child(4){
            width: 34px;
          }
        }
        &:nth-child(4){
          span{
            margin-top: 8px;
            width: 21px;
            height: 15px;
            margin-top: 12px;
            margin-bottom: 20px;
            border-radius: 4px;
          }
        }
        &:nth-child(5){
          span{
            margin-top: 8px;
            width: 21px;
            height: 15px;
            margin-top: 12px;
            margin-bottom: 20px;
            border-radius: 4px;
          }
        }
      }

      .stencil-type.active{
        border: 1px solid rgba(0, 160, 233, 0.8);

        span{
          border: 1px solid rgba(0, 160, 233, 0.8);
        }
      }

      .el-input{
        width: 300px;
      }
    }


  }
  /*-------------------- { 配置内容 } --------------------*/
  .allocation-box{
    padding: 20px 0;

    .el-textarea{
      width: 300px;
    }

    .el-input{
      width: 400px;
    }
  }

  .el-form-item__content{
    /*width: 1000px;*/
  }
}
</style>
