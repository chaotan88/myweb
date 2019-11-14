<!-- 商品管理 - sku -->
<template>
  <common-tpl class="pos-r goods-manage-public" footer back>
    <!-- 头部 -->
    <template slot="header"></template>

    <!-- 主体内容 -->
    <template slot="main" class="goods-manage-public-box">

      <gray-title title="基本信息"></gray-title><br>

      <el-form :model="formData" :rules="rules" ref="formData" label-width="180px">
        <!-- <el-form-item label="商品类型: " prop="goodsType" class="commodity">
          <el-radio-group border v-model="formData.goodsType">
            <el-radio :label="1">普通商品</el-radio>
            <el-radio :label="2">芯片商品</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <!-- 商品类目 -->
        <el-form-item label="商品类目：" prop="platformAttributeValue" class="commodity">
          <el-dropdown trigger="click" placement="bottom-start">
            <div class="pos-r select-wrap" ref="el-platform-attribute">
              <el-input placeholder="请选择商品类目" class="pos-r" readonly v-model="formData.platformAttributeValue" clearable @change="platformAttributeClearable">
                <i class="pos-a el-icon-arrow-down el-icon--right" slot="suffix"></i>
              </el-input>
            </div>
            <el-dropdown-menu slot="dropdown">
              <platform-attribute :initData="platformAttributeData" @change="platformAttributeChange"></platform-attribute>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>

        <!-- 属性值 -->
        <template v-for="(item, index) in platformAttributeList" v-if="parseInt(item.attributeType) === 1">
          <el-form-item :label="item.attributeName + '：'" class="checkbox-item">
            <!-- <span class="el-icon-circle-close-outline pos-a cursor-p remove-group-btn" @click.prevent.stop="handleRemoveAttributeGroup(item, index)" v-if="parseInt(item.defineSelf) === 1"></span> -->

            <el-checkbox-group class="d-ib" v-model="platformAttributeSelectList[index].attributeValList">
              <template v-for="(list, i) in item.attributeValList">
                <el-checkbox :label="list.id" border>{{list.attributeVal}}
                  <!-- <span class="el-icon-circle-close-outline pos-a close-btn" v-if="parseInt(list.defineSelf) === 1" @click.prevent.stop="handleRemoveParams(item.attributeValList, i, list.id, index)"></span> -->
                </el-checkbox>
              </template>
              <!-- <el-input style="width: 250px" maxlength="30" placeholder="新增参数值" class="va-t" v-model="item.addValue">
                <template slot="append">
                  <span class="cursor-p" @click="handleAddAttribute(item)">添加</span>
                </template>
              </el-input> -->
            </el-checkbox-group>
          </el-form-item>
        </template>
        <!-- <el-form-item v-if="platformAttributeData.small.id">
          <el-button type="primary" @click="handleCreateAttributeBefore(1)">添加参数</el-button>
        </el-form-item> -->

        <!-- <template v-for="(item, index) in platformAttributeList">
          <el-form-item :label="item.attributeName + '：'" class="checkbox-item" :class="{'is-error': item.attributeType === 2 && platformAttributeSelectList[index].attributeValList[0].attributeVal.length > 20}">
            <template v-if="item.attributeType === 2">
              <el-input placeholder="20个字符以内" v-model="platformAttributeSelectList[index].attributeValList[0].attributeVal"></el-input>
              <div class="pos-a validate-tips el-form-item__error" style="margin-top: -20px;" v-if="platformAttributeSelectList[index].attributeValList[0].attributeVal.length > 20" >20个字符以内</div>
            </template>
            <template v-else>
              <el-checkbox-group v-model="platformAttributeSelectList[index].attributeValList">
                <template v-for="list in item.attributeValList">
                  <el-checkbox :label="list.id" border>{{list.attributeVal}}</el-checkbox>
                </template>
              </el-checkbox-group>
            </template>
          </el-form-item> 
        </template> -->

        <div class="commodity-details">
          <el-form-item label="品牌：">
            <el-select placeholder="请选择品牌" v-model="formData.brandId" clearable>
              <template v-for="item in brandListData">
                <el-option :label="item.brandName" :value="item.brandId"></el-option>
              </template>
            </el-select>
          </el-form-item>

          <el-form-item label="商品名称：" prop="name">
            <el-input v-model="formData.name" :readonly="parseInt(formData.goodsId) < 6531" placeholder="限100个字符" ></el-input>
          </el-form-item>

          <!-- <el-form-item label="商品分类：" prop="classifySelectValue" class="commodity">
            <el-dropdown trigger="click" placement="bottom-start">
              <div class="pos-r select-wrap" ref="el-goods-classify">
                <el-input placeholder="请选择商品分类" class="pos-r" readonly v-model="formData.classifySelectValue" clearable @clear="goodsClassifyData.small.id = null">
                  <i class="pos-a el-icon-arrow-down el-icon--right" slot="suffix"></i>
                </el-input>
              </div>
              <el-dropdown-menu slot="dropdown">
                <goods-classify :initData="goodsClassifyData" @change="classifySelectChange"></goods-classify>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item> -->

          <el-form-item label="商品主图：" prop="uploadMainFileList" class="picture">
            <div class="pos-r upload-wrap" :class="{max: formData.uploadMainFileList.length === 1}">
              <el-upload
                list-type="picture-card"
                :action="uploadUrl"
                :limit="1"
                :file-list="formData.uploadMainFileList"
                :on-exceed="exceedMainHandle"
                :before-upload="beforeAvatarUpload"
                :on-preview="pictureCardPreviewHandle"
                :on-success="uploadMainSuccessHandle"
                :on-remove="removeMainHandle">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <!-- <div class="pos-a goods-mian-img" v-if="formData.uploadMainFileList.length">商品主图</div> -->
              </el-upload>
              <div class="tips-text">
                <span class="el-icon-warning"></span>
                 图片建议尺寸：414 * 414px 建议大小：100KB以内
              </div>
              <div class="gray-text">共<strong class="fw-n">{{formData.uploadMainFileList.length}}</strong>张，还能上传<strong class="fw-n">{{1 - formData.uploadMainFileList.length}}</strong>张</div>
            </div>
            <el-dialog title="查看大图" :visible.sync="previewMainVisible">
              <img width="100%" :src="dialogMainImageUrl" alt="">
            </el-dialog>
          </el-form-item>

          <el-form-item label="商品图片：" prop="uploadFileList" class="picture">
            <div class="pos-r upload-wrap" :class="{max: formData.uploadFileList.length === 5}">
              <el-upload
                list-type="picture-card"
                :action="uploadUrl"
                :limit="5"
                :file-list="formData.uploadFileList"
                :on-exceed="exceedHandle"
                :before-upload="beforeAvatarUpload"
                :on-preview="pictureCardPreviewHandle"
                :on-success="uploadSuccessHandle"
                :on-remove="removeHandle">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <!-- <div class="pos-a goods-mian-img" v-if="formData.uploadFileList.length">商品主图</div> -->
              </el-upload>
              <div class="tips-text">
                <span class="el-icon-warning"></span>
                 图片建议尺寸：414 * 414px 建议大小：100KB以内
              </div>
              <div class="gray-text">共<strong class="fw-n">{{formData.uploadFileList.length}}</strong>张，还能上传<strong class="fw-n">{{5 - formData.uploadFileList.length}}</strong>张</div>
            </div>
            <el-dialog title="查看大图" :visible.sync="previewVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>

          <el-form-item label="商品视频：" class="video">
            <div class="pos-r upload-wrap" :class="{max: formData.uploadVideoUrl}">
              <el-upload
                v-if="!formData.uploadVideoUrl"
                list-type="picture-card"
                :action="uploadUrl"
                :limit="1"
                :on-exceed="exceedHandle"
                :before-upload="UploadVideoBefore"
                :on-success="handleUploadVideoSuccess"
                :on-remove="handleRemoveVideo">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="d-ib pos-r video-wrap" v-else>
                <div class="ta-c cursor-p pos-a mask-wrap" @click="formData.uploadVideoUrl = ''"><i class="el-icon-delete"></i></div>
                <video class="full-h" :src="formData.uploadVideoUrl | filterImgUrl" controls="controls">您的浏览器不支持 video 标签。</video>
              </div>
              <div class="gray-text">视频格式支持：avi、wma、rmvb、mp4</div>
            </div>
          </el-form-item>

          <gray-title title="规格设置"></gray-title>
          <br>
          <el-form-item>
            <el-radio-group v-model="formData.spec">
              <el-radio :label="0">统一规格</el-radio>
              <el-radio :label="1">多规格</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 同一规格 -->
          <div v-show="formData.spec === 0">
            <!-- <el-form-item label="是否特卖商品：" class="sale-wrap">
              <el-radio-group v-model="formData.isSale" class="pos-a">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
              <template v-if="formData.isSale === 1">
                <el-form-item prop="sale">
                  <el-input v-model="formData.sale" placeholder="请输入特卖价格" style="width: 280px" @blur="inpBlur('sale')"></el-input>
                </el-form-item>
              </template>
            </el-form-item> -->

            <el-form-item label="条形码：">
              <el-input v-model="formData.externalNo" placeholder="请输入条形码" maxlength="50"></el-input>
            </el-form-item>

            <el-form-item label="当前库存：" prop="stock">
              <el-input v-model="formData.stock" maxlength="10" placeholder="请输入当前库存"></el-input>
            </el-form-item>

            <el-form-item label="进货价：" prop="purchasePrice">
              <el-input v-model="formData.purchasePrice" placeholder="请输入价格" @blur="inpBlur('purchasePrice')"></el-input>
            </el-form-item>
            <el-form-item label="销售价：" prop="salePrice">
              <el-input v-model="formData.salePrice" placeholder="请输入价格" @blur="inpBlur('salePrice')"></el-input>
            </el-form-item>

            <!-- <el-form-item label="是否推荐商品：" prop="recommend">
              <el-radio-group v-model="formData.recommend">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item> -->

            <!-- <el-form-item label="是否支持积分兑换：" class="exchange-wrap">
              <el-radio-group v-model="formData.isExchange" class="pos-a">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
              <template v-if="formData.isExchange === 1">
                <el-form-item prop="exchange">
                  <el-input v-model="formData.exchange" placeholder="请输入兑换的积分数" style="width: 280px"></el-input>
                </el-form-item>
              </template>
            </el-form-item> -->
          </div>

          <!-- 多规格 -->
          <div v-show="formData.spec === 1">
            <!-- <el-form-item label="默认销售价：" prop="salePriceDefault">
              <el-input placeholder="请输入价格" @blur="inpBlur('salePriceDefault')" v-model="formData.salePriceDefault"></el-input>
            </el-form-item> -->
            <sku-wrap ref="sku-wrap" :goodsTypeId="parseInt(platformAttributeData.small.id)" :spec="formData.spec" :assignSkuData="assignSkuData" @validate="handleSkuValidate"></sku-wrap>
          </div>


          <gray-title title="其它信息"></gray-title><br>
          <!-- 编辑器 -->
          <el-form-item label="详情描述：" prop="details" class="full-w">
            <!-- 编辑器 -->
            <editor v-model="formData.editorText" @change="ueditorChange"></editor>
            <!-- <vue-ueditor-wrap v-if="ueditorVisible" ref="ueditor" v-model="formData.editorText" :config="editorConfig" @ready="editorReady" :init="editorInit"></vue-ueditor-wrap> -->
            <!-- <editor-wrap :initData="formData.editorText" @change="editorChange"></editor-wrap> -->
          </el-form-item>

          <!-- <el-form-item label="排序：" prop="sort">
            <el-input v-model="formData.sort" placeholder="0-99的整数，0的排序最高"></el-input>
          </el-form-item> -->

          <!-- <el-form-item label="运费设置：" prop="">
            <el-select v-model="formData.freight">
              <el-option label="包邮" :value="0"></el-option>
              <el-option label="到付" :value="1"></el-option>
            </el-select>
          </el-form-item> -->
        </div>
      </el-form>

      <div class="clear"></div>
    </template>

    <template slot="other">
      <el-dialog
        title="图片上传"
        :visible.sync="dialogVisible"
        width="30%">
        <el-upload
          :action="uploadUrl"
          :multiple="true"
          :file-list="uploadList"
          :on-remove="handleRemoveImg"
          :on-success="handleUploadSuccess"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePushImg">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="addType === 1 ? '添加参数' : '添加规格'"
        :visible.sync="addAttributeVisible"
        width="400px">
          <el-form ref="add-attribute-form" :model="formData" :rules="rules" label-width="80px">
            <el-form-item :label="addType === 1 ? '参数名称' : '规格名称'" prop="createAttributeName">
              <el-input class="full-w" :placeholder="'请输入' + (addType === 1 ? '参数' : '规格') + '名称（30个字符内）'" v-model="formData.createAttributeName"></el-input>
            </el-form-item>
            <el-form-item :label="addType === 1 ? '参数值' : '规格值'" prop="createAttributeValue">
              <el-input class="full-w" :placeholder="'请输入' + (addType === 1 ? '参数' : '规格') + '值（多个以英文逗号分隔）'" v-model="formData.createAttributeValue"></el-input>
            </el-form-item>
          </el-form>
        <span slot="footer">
          <el-button @click="addAttributeVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCreateAttribute('add-attribute-form')">保存</el-button>
        </span>
      </el-dialog>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" @click="submitForm('formData')">保存</el-button>
      <el-button type="primary" @click="submitForm('formData', 2)" v-if="pageType === 0 && pageStatus === 0">保存并继续</el-button>
      <el-button type="primary" @click="submitForm('formData', 3)">保存并提交审核</el-button>
    </template>
  </common-tpl>
</template>

<script>
import Editor from '@/components/public/Editor'
// import VueUeditorWrap from 'vue-ueditor-wrap'
import SkuWrap from './Sku'
export default {
  components: {
    Editor,
    // VueUeditorWrap,
    SkuWrap
  },
  data () {
    // 商品编码
    let validateCode = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入商品编码'))
      let reg = /^[A-Za-z0-9]+$/gi
      if (value.length > 20 || !value.toString().match(reg)) return callback(new Error('限20位数字或字母'))
      callback()
    }

    // 商品名称
    let validateName = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入商品名称'))
      if (value.length > 100) return callback(new Error('限100个字符'))
      callback()
    }

    /**
     * 销售价
     */
    let validatePrice = (rule, value, callback) => {
      if (this.formData.spec === 0) {
        if (!value) return callback(new Error('请输入价格'))
        if (value <= 0 || isNaN(value)) return callback(new Error('必须是大于0的数字'))
        if (!value.toString().match(/^\d+\.\d{2}$/gi)) return callback(new Error('精确到百分位'))
        // if (this.formData.isSale === 1) this.$refs['formData'].validateField('sale')
        callback()
      }
      callback()
    }

    /**
     * 默认销售价
     */
    let validatePriceDefault = (rule, value, callback) => {
      if (this.formData.spec === 1) {
        if (!value) return callback(new Error('请输入价格'))
        if (value < 0 || isNaN(value)) return callback(new Error('精确到百分位(0-100数字)'))
        if (!value.toString().match(/^\d+\.\d{2}$/gi)) return callback(new Error('精确到百分位'))
        // if (this.formData.isSale === 1) this.$refs['formData'].validateField('sale')
        callback()
      }
      callback()
    }

    // 特卖价格
    let validateSale = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入特卖价格'))
      if (value < 0 || isNaN(value) || !value.toString().match(/^\d+\.\d{2}$/gi)) return callback(new Error('必须大于等于0的数字'))
      if (parseFloat(value) > parseFloat(this.formData.salePrice)) return callback(new Error('特卖价格不得大于销售价'))
      callback()
    }

    // 积分兑换
    let validateExchange = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入兑换的积分数'))
      if (value < 0 || isNaN(value) || !value.toString().match(/^\d+$/gi)) return callback(new Error('必须是大于等于0的正整数'))
      callback()
    }

    // 属性分类
    let validateText = (rule, value, callback) => {
      if (value && value.length > 20) return callback(new Error('20个字符以内'))
      callback()
    }

    // 排序
    let validateSort = (rule, value, callback) => {
      if (!value && parseInt(value) !== 0) return callback()
      let reg = /^\d{1,2}$/gi
      if (value < 0 || isNaN(value) || value >= 100 || !value.toString().match(reg)) return callback(new Error('限0-99的整数，0的排序最高'))
      callback()
    }

    // 条形码
    let validateExternalNo = (rule, value, callback) => {
      if (this.formData.spec === 0) {
        let reg = /^[0-9a-zA-Z]{0,30}$/gi
        if (value && !value.toString().match(reg)) return callback(new Error('限数字字母，30个字符长度'))
        callback()
      }
      callback()
    }

    // 参数 || 规格名称
    let validateCreateAttributeName = (rule, value, callback) => {
      if (!value) return callback(new Error(this.addType === 1 ? '请输入参数名称' : '请输入规格名称'))
      if (value.length > 30) return callback(new Error('30个字符以内'))
      callback()
    }

    // 参数 || 规格值
    let validateCreateAttributeValue = (rule, value, callback) => {
      if (!value) return callback(new Error(this.addType === 1 ? '请输入参数值' : '请输入规格值'))
      let splitVal = value.split(',')
      let flag = true
      splitVal.forEach((row) => {
        if (row.length > 30) flag = false
      })
      if (!flag) return callback(new Error('单个值限制30个字符以内'))
      callback()
    }

    // 正整数
    let validateInt = (rule, value, callback) => {
      if (this.formData.spec === 0) {
        if (rule.required && !value && parseInt(value) !== 0) return callback(new Error(rule.msg))
        if (value && !value.toString().match(/^\d{1,10}$/gi)) return callback(new Error('必须是大于等于0的正整数'))
        callback()
      }
      callback()
    }

    return {
      pageType: 0,                  // 页面类型［0、商品管理，1、商品审核］
      pageStatus: '',               // 商品管理:［0、待审核，1、审核通过，2、审核驳回］;   商品审核:［0、待审核，1、审核通过，2、审核不通过］
      detailsData: {},              // 详情数据
      addAttributeVisible: false,   // 添加参数
      addType: 1,                   // 添加类型 [1、参数，2、规格]
      formData: {
        goodsId: '',                // 商品id
        goodsType: 1,               // 商品类型
        platformAttributeValue: '', // 属性分类
        classifySelectValue: '',    // 商品分类结果
        brandId: '',                // 品牌
        name: '',                   // 商品名称
        code: '',                   // 商品编码
        purchasePrice: '',          // 进货价
        salePrice: '',              // 销售价
        salePriceDefault: '',       // 默认销售价
        isSale: 0,                  // 是否特卖
        sale: '',                   // 特卖价格
        isExchange: 0,              // 是否积分兑换
        exchange: '',               // 积分兑换分数
        fileList: [],               // 默认显示图片列表
        uploadMainFileList: [],     // 上传商品主图列表
        uploadFileList: [],         // 上传图片列表
        uploadVideoUrl: '',         // 视频地址
        editorText: '',             // 商品详情/编辑器内容
        recommend: 0,               // 推荐
        sort: '',                   // 排序
        spec: 0,                    // 商品规格 [0、统一规格，1、多规格]
        stock: '',                  // 库存
        createAttributeName: '',    // 参数名称
        createAttributeValue: '',   // 参数值
        skuResults: [],             // sku结果集
        skuId: '',                  // sku编辑时id
        externalNo: '',             // 条形码
        freight: 0,                 // 运费设置
        keyWords: ''                // 关键词
      },
      brandListData: [],            // 品牌列表数据
      dialogMainImageUrl: '',       // 商品主图路径
      dialogImageUrl: '',           // 上传图片路径
      previewMainVisible: false,    // 商品主图预览弹窗
      previewVisible: false,        // 预览弹窗
      validatorText: [{validator: validateText, trigger: 'blur'}],
      rules: {
        // 商品类型
        goodsType: [{ required: true, message: '请选择商品类型', trigger: 'change' }],
        // 属性
        platformAttributeValue: [{ required: true, message: '请选择属性', trigger: 'change' }],
        // 品牌
        brandId: [{ required: true, message: '请选择品牌', trigger: 'change' }],
        // 商品名称
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        // 商品分类
        classifySelectValue: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        // 商品编码
        code: [{ required: true, validator: validateCode, trigger: 'change' }],
        // 进货价
        purchasePrice: [{ required: true, validator: validatePrice, trigger: 'blur' }],
        // 默认销售价
        salePriceDefault: [{ required: true, validator: validatePriceDefault, trigger: 'blur' }],
        // 销售价
        salePrice: [{ required: true, validator: validatePrice, trigger: 'blur' }],
        // 特卖价格
        sale: [{ required: true, validator: validateSale, trigger: 'blur' }],
        // 积分兑换
        exchange: [{ required: true, validator: validateExchange, trigger: 'blur' }],
        // 商品主图
        uploadMainFileList: [{ required: true, message: '请上传商品主图', trigger: 'change' }],
        // 图片
        uploadFileList: [{ required: true, message: '请上传图片', trigger: 'change' }],
        // 详情
        editorText: [{ required: true, message: '请描述详情', trigger: 'change' }],
        // 排序
        sort: [{validator: validateSort, trigger: 'blur'}],
        // 条形码
        externalNo: [{validator: validateExternalNo, trigger: 'blur'}],
        // 库存
        stock: [{ required: true, validator: validateInt, msg: '请输入当前库存', trigger: 'blur' }],

        // 添加参数
        createAttributeName: [{required: true, validator: validateCreateAttributeName, trigger: 'blur'}],
        createAttributeValue: [{required: true, validator: validateCreateAttributeValue, trigger: 'blur'}]
      },
      platformAttributeData: {  // 平台属性
        large: {            // 大类
          id: '',
          name: ''
        },
        middle: {           // 中类
          id: '',
          name: ''
        },
        small: {            // 小类
          id: '',
          name: ''
        }
      },
      copyPlatformAttributeData: {},    // 拷贝平台属性
      platformAttributeList: [],        // 平台小类属性值
      platformAttributeSelectList: [],  // 平台小类属性值选择
      goodsClassifyData: {  // 商品分类菜单
        large: {            // 大类
          id: '',
          name: ''
        },
        middle: {           // 中类
          id: '',
          name: ''
        },
        small: {            // 小类
          id: null,
          name: ''
        }
      },
      editorConfig: {
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: './static/UEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 500,
        // 初始容器宽度
        initialFrameWidth: '100%'
      },
      uploadList: [],           // 上传列表
      dialogVisible: false,     // 上传图片弹窗
      editorObj: null,          // 存储editor对象
      skuTitle: [],             // sku标题
      specTableData: [],        // 规格表格数据
      specSelectList: [],       // 规格选择列表
      // specSelectList: [{specValList: []}],       // 规格选择列表
      specList: [],             // 规格列表
      specDisabled: false,      // 当规格选择2个时禁用其它选择
      // specList: [{specName: 'ces', specValList: [], specVal: ''}],             // 规格列表
      userInfo: {},             // 用户信息
      skuValidate: false,       // sku组件校验结果
      assignSkuData: [],        // sku列表数据
      ueditorVisible: false     // 是否显示编辑器
    }
  },
  computed: {
    /**
     * 上传地址
     */
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source?clientType=1&token=' + this.userInfo.token
    }
  },
  mounted () {
    this.copyPlatformAttributeData = this.$Utils.deepCopy(this.platformAttributeData)
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    if (this.$route.path.match(/add/gi)) this.pageStatus = 0
    if (this.$route.path.match(/edit/gi)) {
      this.formData.goodsId = parseInt(this.$route.query.id) || ''
      this.getDetailsData()
    }
    if (this.pageStatus === 0) this.ueditorVisible = true
    this.getBrandListData()
    this.$refs['formData'].resetFields()
  },
  methods: {
    /**
     * 获取详情
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/goods/getGoodsDetail', {
        id: this.formData.goodsId
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
        let detailsData = resData.data
        // 属性分类
        this.platformAttributeData = {
          large: {
            id: detailsData.platformTypeGrandParentId,
            name: detailsData.platformTypeGrandParentName
          },
          middle: {
            id: detailsData.platformTypeParentId,
            name: detailsData.platformTypeParentName
          },
          small: {
            id: detailsData.platformTypeId,
            name: detailsData.platformTypeName
          }
        }
        this.formData.platformAttributeValue = [detailsData.platformTypeGrandParentName, detailsData.platformTypeParentName, detailsData.platformTypeName].join(' / ')                 // 属性分类
        // 商品分类
        this.goodsClassifyData = {  // 商品分类菜单
          large: {            // 大类
            id: detailsData.goodTypeGrandParentId,
            name: detailsData.goodTypeGrandParentName
          },
          middle: {           // 中类
            id: detailsData.goodTypeParentId,
            name: detailsData.goodTypeParentName
          },
          small: {            // 小类
            id: detailsData.goodTypeId,
            name: detailsData.goodTypeName
          }
        }
        this.formData.classifySelectValue = [detailsData.goodTypeGrandParentName, detailsData.goodTypeParentName, detailsData.goodTypeName].join(' / ')                    // 商品分类结果

        this.getAttributeData(detailsData.id)

        this.formData.name = detailsData.goodsName                    // 商品名称
        this.formData.code = detailsData.goodsNo                      // 商品编码

        // 统一规格
        if (detailsData.multStandard === 0) {
          let skuObj = detailsData.goodsSkuList[0]

          this.formData.skuId = skuObj.id

          this.formData.purchasePrice = skuObj.buyingPrice         // 进货价

          this.formData.salePrice = skuObj.goodsPrice              // 销售价

          this.formData.isSale = skuObj.whetherSpecial             // 是否特卖
          this.formData.sale = skuObj.goodsSpecialPrice            // 特卖价格

          this.formData.stock = skuObj.goodsNum

          this.formData.isExchange = skuObj.whetherPoints          // 积分兑换
          this.formData.exchange = skuObj.points                   // 积分

          this.formData.externalNo = skuObj.externalNo
        } else {
          this.formData.salePriceDefault = detailsData.goodsPrice
        }

        this.inpBlur('purchasePrice')
        this.inpBlur('salePrice')
        this.inpBlur('salePriceDefault')
        this.inpBlur('sale')

        // if (parseInt(this.formData.isExchange) === 1) this.inpBlur('exchange')
        detailsData.imageList.forEach((row) => {                      // 默认显示图片列表
          row.url = this.$Utils.filterImgUrl(row.imageUrl)
          row.imageUrl = row.imageUrl.replace(new RegExp(this.$dm.ROOT_IMG), '')
        })
        if (detailsData.goodsVideoUrl) this.formData.uploadVideoUrl = detailsData.goodsVideoUrl
        this.formData.uploadMainFileList.push({url: this.$Utils.filterImgUrl(detailsData.mainImage), imageUrl: detailsData.mainImage})
        this.formData.uploadFileList = detailsData.imageList          // 上传图片列表
        this.formData.editorText = detailsData.remark                 // 商品详情/编辑器内容
        this.formData.recommend = detailsData.whetherRecommend        // 推荐
        this.formData.sort = detailsData.goodsSort                    // 排序
        this.formData.spec = detailsData.multStandard
        this.assignSkuData = detailsData.goodsSkuList || []
        this.formData.brandId = detailsData.brandId
        this.formData.keyWords = detailsData.keyWords
      }).finally(() => {
        setTimeout(() => {
          this.ueditorVisible = true
        }, 300)
      })
    },

    /**
     * 获取品牌列表
     */
    getBrandListData () {
      this.$http.post('@ROOT_API/goods/getSupplierBrandList', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.brandListData = resData.data
      })
    },

    /**
     * 编辑器内容改变
     */
    ueditorChange (value) {
      this.formData.editorText = value
    },

    /**
     * 编辑器内容改变
     */
    editorChange (data) {
      this.formData.editorText = data.html
    },

    /**
     * 平台属性改变
     */
    platformAttributeClearable (val) {
      this.platformAttributeData = this.$Utils.deepCopy(this.copyPlatformAttributeData)
      this.platformAttributeList = []
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
     * 根据商品id查询平台属性及属性值
     */
    getAttributeData (id) {
      this.$http.post('@ROOT_API/goods/getAttributeValByTypeByGoodsId', {
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
        this.platformAttributeList = resData.data
        resData.data.forEach((row) => {
          let tempObj = {
            id: row.id,
            attributeType: row.attributeType,
            attributeValList: []
          }
          row.attributeValList.forEach((list) => {
            if (list.isSelected) tempObj.attributeValList.push(list.id)
          })
          this.platformAttributeSelectList.push(tempObj)
        })
      })
    },

    /**
     * 商品分类选择
     */
    classifySelectChange (results) {
      this.goodsClassifyData = results
      let arr = []
      if (results.large.name) arr.push(results.large.name)
      if (results.middle.name) arr.push(results.middle.name)
      if (results.small.name) arr.push(results.small.name)
      this.formData.classifySelectValue = arr.join(' / ')
      if (results.small.id || results.small.name) this.$Utils.triggerEvent(this.$refs['el-goods-classify'])
    },

    /**
     * 创建参数前操作
     */
    handleCreateAttributeBefore (type) {
      if (type) this.addType = type
      this.addAttributeVisible = true
      this.formData.createAttributeName = ''
      this.formData.createAttributeValue = ''
    },

    /**
     * 创建参数
     */
    handleCreateAttribute (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        let attributeValList = []
        // 过滤输入值
        let splitValue = this.formData.createAttributeValue.split(',')
        splitValue.forEach((row, index) => {
          if (row) {
            attributeValList.push({
              attributeVal: row
            })
          }
        })
        this.$http.post('@ROOT_API/attribute/saveOrUpdateAttribute', {
          attributeTypeId: this.platformAttributeData.small.id,    // 是 int 平台分类id （小类）
          attributeType: 1,              // 是 int 参数类型 1 复选框 2文本框
          attributeName: this.formData.createAttributeName,        // 是 string  参数名称
          attributeValList               // 是 list  参数值集合
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
          let results = resData.data
          results.defineSelf = 1
          this.platformAttributeList.push(results)
          this.platformAttributeSelectList.push({
            id: results.id,
            attributeType: results.attributeType,
            attributeValList: []
          })
          this.addAttributeVisible = false
        })
      })
    },

    /**
     * 新增参数值
     */
    handleAddAttribute (obj) {
      if (!obj.addValue) return false
      this.$http.post('@ROOT_API/attribute/saveAttributeVal', {
        attributeId: obj.id,          // 是 int 参数id
        attributeVal: obj.addValue          // 是 string  参数值
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
        obj.attributeValList.push({
          id: resData.data.id,
          defineSelf: 1,
          attributeVal: obj.addValue
        })
        obj.addValue = ''
      })
    },

    /**
     * 新增规格值
     */
    handleAddSpec (obj) {
      if (!obj.addValue) return false
      obj.specValList.push({
        id: new Date().getTime(),
        specVal: obj.addValue
      })
      obj.addValue = ''
    },

    /**
     * 移除参数值
     */
    handleRemoveParams (obj, index, id, parentIndex) {
      this.$http.post('@ROOT_API/attribute/deleteAttributeValById', {
        id
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
          duration: 1000,
          type: 'success'
        })
        obj.splice(index, 1)
        // 移除已选择值
        let platformAttributeObj = this.platformAttributeSelectList[parentIndex].attributeValList
        let len = platformAttributeObj.indexOf(id)
        if (len !== -1) platformAttributeObj.splice(len, 1)
      })
    },

    /**
     * 移除主营类目组
     */
    handleRemoveAttributeGroup (item, index) {
      this.$http.post('@ROOT_API/attribute/deleteAttributeById', {
        id: item.id,
        attributeTypeId: this.platformAttributeData.small.id
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
          duration: 1000,
          type: 'success'
        })
        this.platformAttributeList.splice(index, 1)
      })
    },

    /**
     * 文件上传前的格式和大小校验
     */
    beforeAvatarUpload (file) {
      const pattern = /(jpg|jpeg|png)$/ig
      const isLegalPhoto = pattern.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLegalPhoto) {
        this.$message.error('上传图片的格式不合法，请重新上传')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLegalPhoto && isLt2M
    },

    /**
     * 视频上传前的格式校验
     */
    UploadVideoBefore (file) {
      // const pattern = /(video|mp4|avi|wmv|rmvb|mpe?g|rmvb|wma)/gi
      const pattern = /mp4/gi
      const isLegalVideo = pattern.test(file.type)

      if (!isLegalVideo) {
        this.$message.error('上传视频的格式不合法，请重新上传')
      }
      return isLegalVideo
    },

    /**
     * 上传视频
     */
    handleUploadVideoSuccess (res) {
      if (parseInt(res.status) !== 1) {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.uploadVideoUrl = res.data
    },

    /**
     * 移除视频
     */
    handleRemoveVideo () {
      this.formData.uploadVideoUrl = ''
    },

    /**
     * 上传数量超过最大限制数量
     */
    exceedMainHandle (files, fileList) {
      this.$message({
        message: '最多只能上传1张主图',
        type: 'error'
      })
    },

    /**
     * 上传数量超过最大限制数量
     */
    exceedHandle (files, fileList) {
      this.$message({
        message: '最多只能上传5张图片',
        type: 'error'
      })
    },

    /*
     * 文件上传成功
     */
    uploadMainSuccessHandle (res) {
      if (res.status !== '1') {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.uploadMainFileList.push({
        id: '',
        url: this.$Utils.filterImgUrl(res.data),
        imageUrl: res.data
      })
    },

    /*
     * 文件上传成功
     */
    uploadSuccessHandle (res) {
      if (res.status !== '1') {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.uploadFileList.push({
        id: '',
        url: this.$Utils.filterImgUrl(res.data),
        imageUrl: res.data
      })
    },

    /**
     * 文件被移除
     */
    removeMainHandle (file, fileList) {
      this.formData.uploadMainFileList = []
    },

    /**
     * 文件被移除
     */
    removeHandle (file, fileList) {
      this.formData.uploadFileList = []
      fileList.forEach((row) => {
        this.formData.uploadFileList.push({
          id: row.id,
          url: this.$Utils.filterImgUrl(row.imageUrl),
          imageUrl: row.imageUrl
        })
      })
    },

    /**
     * 文件预览
     */
    pictureCardPreviewHandle (file) {
      this.dialogImageUrl = file.url
      this.previewVisible = true
    },

    // 5、 你可以在ready方法中拿到editorInstance实例,之后的所有API就和官方的实例一样了,Just Do What You Want! http://fex.baidu.com/ueditor/#api-common
    editorReady (editorInstance) {
      this.editorObj = editorInstance
    },

    // 7. 结合init方法,自定义按钮
    editorInit () {
      setTimeout(() => {
        this.$refs['ueditor'].registerButton({
          name: 'upload',
          icon: require('@/../static/UEditor/img/upload.png'),
          tip: '上传图片',
          handler: (editor, name) => {
            this.dialogVisible = true
          }
        })
      })
    },

    /**
     * 移除图片
     */
    handleRemoveImg (file, fileList) {
      this.uploadList = []
      fileList.forEach((row) => {
        this.uploadList.push({
          url: row.url
        })
      })
    },

    /**
     * 上传成功操作
     */
    handleUploadSuccess (res, file, fileList) {
      setTimeout(() => {
        if (parseInt(res.status) !== 1) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1000
          })
          return false
        }
        this.uploadList.push({
          url: this.$Utils.filterImgUrl(res.data)
        })
      }, 30)
    },

    /**
     * 将图片插入编辑器
     */
    handlePushImg () {
      let res = ''
      this.uploadList.forEach((row) => {
        res += ('<img src="' + row.url + '"/>')
      })
      this.editorObj.execCommand('inserthtml', res)
      this.dialogVisible = false
      this.uploadList = []
    },

    /**
    * 价格输入框自动补全价格
    */
    inpBlur (obj) {
      this.$Utils.blurAutoCompletion(this.formData, obj)
    },

    /**
     * 校验sku组件表单
     */
    handleSkuValidate (value, results) {
      this.skuValidate = value
      if (results) this.formData.skuResults = results
    },

    /**
     * 表单提交
     * @param  {[String]} formName [表单对象]
     * @param  {[Boolean]} type     [2、确认并继续]
     */
    submitForm (formName, type) {
      // if (this.formData.spec === 0) {
      //   this.formData.skuResults = [
      //     {
      //       id: this.formData.skuId,
      //       buyingPrice: this.formData.purchasePrice,
      //       goodsPrice: this.formData.salePrice,
      //       whetherSpecial: this.formData.isSale,
      //       goodsSpecialPrice: this.formData.sale,
      //       goodsNum: this.formData.stock,
      //       whetherPoints: this.formData.isExchange,
      //       points: this.formData.exchange,
      //       goodsSkuValList: [],
      //       externalNo: this.formData.externalNo
      //     }
      //   ]
      // }
      // console.log('this.formData.skuResults: ', this.formData.skuResults)
      if (this.formData.spec === 1) this.$refs['sku-wrap'].handleValidateForm()
      setTimeout(() => {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          if (this.formData.spec === 1 && !this.skuValidate) return false
          let attributeRequestList = []
          this.platformAttributeSelectList.forEach((row) => {
            if (row.attributeValList.length) {
              let obj = this.$Utils.deepCopy(row)
              let arr = obj.attributeValList
              obj.attributeValList = []
              arr.forEach((list) => {
                obj.attributeValList.push({id: list})
              })
              attributeRequestList.push(obj)
            }
          })
          let goodsImageRequestList = []
          this.formData.uploadFileList.forEach((row, index) => {
            goodsImageRequestList.push({
              id: parseInt(row.id),
              sortId: index,
              imageType: index === 0 ? 1 : 2,
              imageUrl: row.imageUrl
            })
          })
          if (this.formData.spec === 0) {
            this.formData.skuResults = [
              {
                id: this.formData.skuId,
                buyingPrice: !isNaN(this.formData.purchasePrice) && this.formData.purchasePrice > 0 ? this.formData.purchasePrice : 0.01,
                goodsPrice: !isNaN(this.formData.salePrice) && this.formData.salePrice > 0 ? this.formData.salePrice : 0.01,
                whetherSpecial: this.formData.isSale,
                goodsSpecialPrice: this.formData.isSale === 1 && !isNaN(this.formData.sale) && this.formData.sale > 0 ? this.formData.sale : 0.01,
                goodsNum: this.formData.stock,
                whetherPoints: this.formData.isExchange,
                points: this.formData.exchange,
                goodsSkuValList: [],
                externalNo: this.formData.externalNo
              }
            ]
          }
          // 获取所有价格过滤最低价及最高价
          let goodsPriceList = []
          this.formData.skuResults.forEach((row) => {
            let price = row.whetherSpecial === 1 ? row.goodsSpecialPrice : row.goodsPrice
            goodsPriceList.push(price)
          })
          if (!this.formData.skuResults.length) {
            this.$message({
              message: '参数有误',
              duration: 1500,
              type: 'error'
            })
            return false
          }
          this.$http.post('@ROOT_API/goods/saveOrUpdateGoods', {
            id: this.formData.goodsId,
            goodsName: this.formData.name,
            goodTypeId: parseInt(this.goodsClassifyData.small.id),
            goodTypeParentId: parseInt(this.goodsClassifyData.middle.id),
            goodTypeGrandParentId: parseInt(this.goodsClassifyData.large.id),
            platformTypeId: parseInt(this.platformAttributeData.small.id),
            platformTypeParentId: parseInt(this.platformAttributeData.middle.id),
            platformTypeGrandParentId: parseInt(this.platformAttributeData.large.id),
            goodsPrice: this.formData.spec === 1 ? this.formData.salePriceDefault : this.formData.salePrice,
            // buyingPrice: this.formData.spec === 0 ? this.formData.purchasePrice : '',
            goodsNo: this.formData.code,
            // whetherPoints: this.formData.isExchange,
            // points: parseInt(this.formData.exchange),
            // whetherSpecial: this.formData.isSale,
            // goodsSpecialPrice: this.formData.spec === 0 && this.formData.isSale === 1 ? this.formData.sale : '',
            remark: this.formData.editorText,
            keyWords: this.formData.keyWords,
            attributeRequestList,
            goodsImageRequestList,
            goodsSort: this.formData.sort === '' ? 0 : this.formData.sort,
            goodsVideoUrl: this.formData.uploadVideoUrl,
            whetherRecommend: parseInt(this.formData.recommend),
            mainImage: this.formData.uploadMainFileList[0].imageUrl,
            multStandard: this.formData.spec,
            // stock: this.formData.spec === 0 ? this.formData.stock : '',
            goodsSkuList: this.formData.skuResults,
            brandId: this.formData.brandId,   // 是 int 品牌id
            goodsMinPrice: Math.min(...goodsPriceList), // 否 int 商品最低价格
            goodsMaxPrice: Math.max(...goodsPriceList)  // 否 int 商品最高价格
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
            // 保存并继续 || 保存并提交审核
            if (type) {
              if (type === 2) {
                this.$router.go(0)
              } else if (type === 3) {
                this.handleBatchExamine(resData.data)
              } else {
                this.$router.back()
              }
            } else {
              this.$router.back()
            }
          })
        })
      }, 200)
    },

    /**
     * 批量提交审核
     */
    handleBatchExamine (ids) {
      if (!ids) return false
      this.$http.get('@ROOT_API/goods/submitBatchGoodsReviewStatus', {
        params: {
          ids
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
        this.$router.back()
      })
    }
  }
}
</script>

<style lang='less' scoped>
.goods-manage-public{

  .el-form-item{
    position: relative;
    box-sizing: border-box;

    .el-select, .el-input{
      width: 400px;
    }

    .upload-wrap{

      .goods-mian-img{
        color: #fff;
        width: 148px;
        height: 30px;
        line-height: 30px;
        background: rgba(0, 0, 0, .5);
        left: 0;
        top: 118px;
      }
    }

    .video-wrap{
      height: 200px;
      line-height: 200px;

      .mask-wrap{
        width: 36px;
        height: 36px;
        line-height: 36px;
        background: red;
        right: 0;
        top: 0;
        display: none;
        z-index: 99;

        i{
          color: #fff;
          font-size: 16px;
        }
      }
    }

    .video-wrap:hover{
      .mask-wrap{
        display: block;
      }        
    }

    .spec-table{
      .el-input{
        width: auto;
      }
    }

    .close-btn, .remove-group-btn{
      color: #999;
      font-size: 16px;
      background: #fff;
      border-radius: 100%;
    }

    .remove-group-btn{
      left: -28px;
    }

    .close-btn{
      display: none;
      top: -5px;
      right: -5px;
    }

    .close-btn:hover, .remove-group-btn:hover{
      color: #fff;
      background: red;
    }

    .el-checkbox.is-bordered{
      margin-left: 0;
      margin-right: 30px;

      .el-checkbox__input{
        display: none !important;
      }
    }

    .el-checkbox.is-bordered:hover{
      .close-btn{
        display: block;
      }
    }
    
    .el-dropdown{
      width: 100%;
    }
  }

  .tips-text{
    color: orange;
  }

  .gray-text{
    color: #999;
    line-height: 20px !important;

    strong{
      color: orange;
      padding: 0 3px;
    }
  }

  .sku-table{
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    th, td{
      text-align: left;
      padding: 0 10px;
      position: relative;
    }

    th{
      color: #909399;
      height: 40px;
      text-align: left;
      background: #eef1f9;
    }

    td{
      padding: 10px;
      border-bottom: 1px solid #ebeef5;
    }

    td.pd-l{
      padding-left: 35px;
    }

    td.pd-r{
      padding-right: 30px;
    }

    svg.icon{
      fill: #2eaaf7;
      width: 30px;
      height: 30px;
      margin-top: -15px;
      right: 0;
      top: 50%;
    }
  }

  .edit-btn-wrap{
    width: 100px;
    right: -100px;
    top: 1px;
  }

  .select-wrap{
    width: 400px;
    height: 36px;
    line-height: 36px;

    .el-icon-arrow-down{
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-top: -10px;
      top: 50%;
      right: 0;
    }
  }
  
  .goods-manage-public-box{
    padding: 20px;
    overflow: hidden;
    border: 1px solid #f4f4f4;

    .commodity-details{
      width: 100%;
      padding-top: 30px;
      border-top: 1px solid #f0f0f0;
      overflow: hidden;

      /*--------商品分类-----------*/
      .commodity{
        .el-button{
          color: #56ade8;
          padding: 10px;
          margin-left: 10px;
          border:1px solid #56ade8;
          background-color: #fff !important;
        }
      }

      .picture{
        .el-form-item__content{
          height: 150px;
          border: 1px solid #c8d0da;
        }

        span{
          color: #f5a74a;
        }
      }

      .button-wrap{
        left: 0;
        bottom: -80px;
      }

      .el-form-item:nth-child(even){
        float: right;
      }
    }
  }
}
</style>

<style lang="less">
.goods-manage-public{

  .el-dialog .el-dialog__body{
    text-align: left !important;
  }

  .edui-default.edui-editor{
    z-index: 99 !important;

    .edui-toolbar.edui-default{
      line-height: 20px;
    }
  }

  .el-form-item{
    .el-checkbox.is-bordered{
      margin: 0 30px 20px 0;

      .el-checkbox__input{
        display: none !important;
      }
    }
  }

  .checkbox-item{
    margin-bottom: 0 !important;

    .el-input{
      margin-bottom: 20px;
    }
  }

  .el-form-item.sale-wrap, .el-form-item.exchange-wrap{
    .el-form-item__content{
      padding-left: 120px;
    }

    .el-radio-group{
      left: 0;
      top: 13px;
    }

    .el-form-item{
      width: 100%;
      padding-right: 0;

      .el-form-item__content{
        padding-left: 0;
        margin-left: 0 !important;
      }
    }
  }

  .el-radio__input.is-checked .el-radio__inner{
    border-color: #409EFF;
    background: #409EFF;
  }

  .upload-wrap.max{
    .el-upload{
      display: none !important;
    }
  }

  th{
    padding: 0;
  }

  .sku-table{
    .el-checkbox.pos-a{
      width: 14px;
      height: 14px;
      margin-top: -7px;
      left: 10px;
      top: 50%;

      .el-checkbox__input{
        vertical-align: top;
      }
    }
  }
}
</style>
