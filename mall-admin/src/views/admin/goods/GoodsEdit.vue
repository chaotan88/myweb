<template>
  <!-- 商品-商品管理-添加商品 -->
  <div class="add-goods-wrap">
    <div class="content-wrap">
      <div class="goods-form-wrap">
        <el-form :model="form">
          <span class="form-item-title">平台商品分类：</span>
          <el-form-item>
            <el-select v-model="form.platformTypeGrandParentId" placeholder="请选择商品大类" @change="selectLargeType">
              <el-option
                v-for="item in largeTypeOptions"
                :key="item.attributeTypeId"
                :label="item.attributeTypeName"
                :value="item.attributeTypeId">
              </el-option>
            </el-select>
            <span class="line">—</span>
            <el-select v-model="form.platformTypeParentId" placeholder="请选择商品中类" @change="selectMiddleType">
              <el-option
                v-for="item in middleTypeOptions"
                :key="item.attributeTypeId"
                :label="item.attributeTypeName"
                :value="item.attributeTypeId">
              </el-option>
            </el-select>
            <span class="line">—</span>
            <el-select v-model="form.platformTypeId" placeholder="请选择商品小类" @change="selectSmallType">
              <el-option
                v-for="item in smallTypeOptions"
                :key="item.attributeTypeId"
                :label="item.attributeTypeName"
                :value="item.attributeTypeId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="goods-form-wrap">
        <el-form>
          <el-row v-for="attribute in attributeList" :key="attribute.attributeId">
            <span class="form-item-title">{{ attribute.attributeName }}：</span>
            <el-form-item>
              <el-checkbox-group v-model="selectedVal" v-if="attribute.attributeType === '1'">
                <el-checkbox-button v-for="attrVal in attribute.attributeValList"  :label="attrVal" :key="attrVal.attributeValId">{{ attrVal.attributeVal }}</el-checkbox-button>
              </el-checkbox-group>
              <!-- <el-input v-model="input" placeholder="请输入内容" v-if="attribute.attributeType === '2'"></el-input> -->
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="goods-form-wrap">
        <el-form :model="form" :rules="rules" ref="addGoodsForm">
          <el-row>
            <span class="form-item-title">商品名称：</span>
            <el-form-item class="input-group" prop="goodsName">
              <el-input v-model="form.goodsName"></el-input>
            </el-form-item>
          </el-row>
          <!-- <el-row>
            <span class="form-item-title">商品编码：</span>
            <el-form-item class="input-group" prop="goodsNo">
              <el-input v-model="form.goodsNo"></el-input>
            </el-form-item>
          </el-row> -->
          <el-row>
            <span class="form-item-title">价格：</span>
            <el-form-item class="input-group" prop="goodsPrice">
              <el-input v-model="form.goodsPrice"></el-input>
            </el-form-item>
          </el-row>
          <!-- 商品图片 -->
          <el-row style="position: relative;">
            <span class="form-item-title" style="position: absolute;">商品图片：</span>
            <el-form-item style="margin-left: 160px;">
              <el-upload
                :action="this.$api.MAIN_API + this.$api.UPLOAD_API"
                :on-success="uploadSuccess"
                :on-error="uploadErr"
                :on-remove="photoRemove"
                list-type="picture-card"
                :file-list="fileList">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <p class="upload-advice">图片建议尺寸：500 * 500px ；建议大小：100KB以内</p>
          </el-row>
          <el-row>
            <span class="form-item-title">店铺商品分类：</span>
            <el-form-item>
              <el-select placeholder="请选择商品大类" v-model="form.goodTypeGrandParentId" @change="selectGoodsLargeType">
                <el-option
                  v-for="item in goodsLargeTypeOptions"
                  :key="item.goodsTypeId"
                  :label="item.goodsType"
                  :value="item.goodsTypeId">
                </el-option>
              </el-select>
              <span class="line">—</span>
              <el-select placeholder="请选择商品中类" v-model="form.goodTypeParentId" @change="selectGoodsMiddleType">
                <el-option
                  v-for="item in goodsMiddleTypeOptions"
                  :key="item.goodsTypeId"
                  :label="item.goodsType"
                  :value="item.goodsTypeId">
                </el-option>
              </el-select>
              <span class="line">—</span>
              <el-select placeholder="请选择商品小类" v-model="form.goodTypeId">
                <el-option
                  v-for="item in goodsSmallTypeOptions"
                  :key="item.goodsTypeId"
                  :label="item.goodsType"
                  :value="item.goodsTypeId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <span class="form-item-title">详细描述：</span>
            <el-form-item>
              <quill-editor
                id="quill-editor"
                v-model="form.goodsDetail"
                :options="editorOptions"
                @ready="onEditorReady($event)"
                @focus="onEditorFocus($event)">
              </quill-editor>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="shelf-status">
        <el-form :model="form">
          <span class="form-item-title">上架状态：</span>
          <el-form-item>
            <el-radio v-model="form.saleState" label="1">上架</el-radio>
            <el-radio v-model="form.saleState" label="2">下架</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { editorOptions } from '@/assets/js/vue-quill-editor-config'
  export default {
    data: function () {
      return {
        goodsId: '',
        form: {}, // 商品详情
        attributeList: [],  //  商品属性值列表
        largeTypeOptions: [],   // 保存平台商品大类
        middleTypeOptions: [],  // 保存平台商品中类
        smallTypeOptions: [],   // 保存平台商品小类
        goodsLargeTypeOptions: [],  // 保存店铺商品大类
        goodsMiddleTypeOptions: [], // 保存店铺商品中类
        goodsSmallTypeOptions: [],  // 保存店铺商品小类
        selectedVal: [],  // 选中的属性值
        originalAttrList: [], // 原商品属性值列表
        newAttrList: [], // 新商品属性值列表
        deletedAttrList: [], // 删除的属性的列表
        addedAttrList: [], // 新增的属性的列表
        fileList: [],
        editorOptions: editorOptions, // 富文本编辑器的配置
        rules: {
          goodsName: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { pattern: /[\u4e00-\u9fa5\w]{1,50}/g, message: '商品名称限50个字，不含特殊字符', trigger: 'blur' }
          ],
          goodsNo: [
            { required: true, message: '请输入商品编码', trigger: 'blur' },
            { pattern: /\d{1,20}/g, message: '商品编码限20位数字', trigger: 'blur' }
          ],
          goodsPrice: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
            { pattern: /\d{1,20}\.\d{2}/g, message: '商品价格限20位数字，保留两位小数', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      onEditorReady (quill) {
        quill.enable(false)
      },
      onEditorFocus (quill) {
        quill.enable(true)
      },
      // ------------------------------- 1、获取商品详情 --------------------------- //
      // ------------------------------- 1.1、获取平台商品分类 --------------------------- //
      getGoodsById: function () {
        // 获取商品详情
        this.$http.post('/admin/goods/getGoodsById', this.qs.stringify({
          goodsId: this.goodsId
        })).then((res) => {
          if (res.data.res === 1) {
            this.form = res.data.obj.goods
            this.attributeList = res.data.obj.attributeVo
            this.getLargeType()
            this.getGoodsType()
            this.handleGetAttributeList()
            this.handleFileList(res.data.obj.goods.goodsImageUrls)
          }
        })
      },
      getLargeType: function () {
        // 获取平台商品大类
        this.$http.post('/admin/attributeType/getAttributeTypeListByParentId', this.qs.stringify({
          parentId: 0
        })).then((res) => {
          if (res.data.res === 1) {
            this.largeTypeOptions = res.data.list // res.data.list => 商品大类
            this.getMiddleType(this.form.platformTypeGrandParentId)
          }
        })
      },
      getMiddleType: function (value) {
        // 获取平台商品中类
        this.$http.post('/admin/attributeType/getAttributeTypeListByParentId', this.qs.stringify({
          parentId: value
        })).then((res) => {
          if (res.data.res === 1) {
            this.middleTypeOptions = res.data.list // res.data.list => 商品中类
            this.getSmallType(this.form.platformTypeParentId)
          }
        })
      },
      getSmallType: function (value) {
        // 获取平台商品小类
        this.$http.post('/admin/attributeType/getAttributeTypeListByParentId', this.qs.stringify({
          parentId: value
        })).then((res) => {
          if (res.data.res === 1) {
            this.smallTypeOptions = res.data.list // res.data.list => 商品小类
          }
        })
      },
      // ------------------------------- 1.2、获取店铺商品分类 --------------------------- //
      getGoodsType: function () {
        // 获取店铺商品大类
        this.$http.post('/admin/goodsType/getGoodsTypeByParentId', this.qs.stringify({
          parentId: 0
        })).then((res) => {
          if (res.data.res === 1) {
            this.goodsLargeTypeOptions = res.data.list // res.data.list => 店铺商品大类
            this.getGoodsMiddleType(this.form.goodTypeGrandParentId)
          }
        })
      },
      getGoodsMiddleType: function (value) {
        // 获取店铺商品中类
        this.$http.post('/admin/goodsType/getGoodsTypeByParentId', this.qs.stringify({
          parentId: value
        })).then((res) => {
          if (res.data.res === 1) {
            this.goodsMiddleTypeOptions = res.data.list // res.data.list => 店铺商品中类
            this.getGoodsSmallType(this.form.goodTypeParentId)
          }
        })
      },
      getGoodsSmallType: function (value) {
        this.$http.post('/admin/goodsType/getGoodsTypeByParentId', this.qs.stringify({
          parentId: value
        })).then((res) => {
          if (res.data.res === 1) {
            this.goodsSmallTypeOptions = res.data.list // res.data.list => 店铺商品小类
          }
        })
      },
      // ------------------------------- 1.3、处理商品属性值列表 --------------------------- //
      handleGetAttributeList: function () {
        // 选择属性值
        var tempArr = []
        this.attributeList.forEach(outerAttr => {
          if (outerAttr.attributeValList) {
            outerAttr.attributeValList.forEach((innerAttr, index) => {
              if (innerAttr.choice) {
                tempArr.push(outerAttr.attributeValList[index])
              }
            })
          }
        })
        this.selectedVal = tempArr
        this.originalAttrList = tempArr
      },
      // ------------------------------- 1.4、处理图片 --------------------------- //
      handleFileList: function (fileList) {
        // 处理图片数据
        var shortPath
        var longPath
        var newFileList = []
        fileList = fileList.split(',')
        fileList.forEach(item => {
          shortPath = item
          longPath = this.$api.IMG_API + item
          newFileList.push({
            response: {
              obj: shortPath
            },
            url: longPath
          })
        })
        this.fileList = newFileList
      },
      // ------------------------------- 2、编辑商品详情 --------------------------- //
      // ------------------------------- 2.1、编辑平台商品分类 --------------------------- //
      selectLargeType: function (value) {
        // 选择商品大类
        this.$http.post('/admin/attributeType/getAttributeTypeListByParentId', this.qs.stringify({
          parentId: value
        })).then((res) => {
          if (res.data.res === 1) {
            this.middleTypeOptions = res.data.list // res.data.list => 商品中类
            this.form.platformTypeParentId = '' // 清除商品中类选择框中的残留值
            this.form.platformTypeId = '' // 清除商品小类选择框中的残留值
          } else {
            this.$message.error(res.data.result)
          }
        })
      },
      selectMiddleType: function (value) {
        // 选择商品中类
        this.$http.post('/admin/attributeType/getAttributeTypeListByParentId', this.qs.stringify({
          parentId: value
        })).then((res) => {
          if (res.data.res === 1) {
            this.smallTypeOptions = res.data.list // res.data.list => 商品小类
            this.form.platformTypeId = '' // 清除商品小类选择框中的残留值
          } else {
            this.$message.error(res.data.result)
          }
        })
      },
      selectSmallType: function (value) {
        // 选择商品小类
        this.$http.post('/admin/attributeType/getAttributeListByType', this.qs.stringify({
          attributeTypeId: value
        })).then((res) => {
          if (res.data.res === 1) {
            this.attributeList = res.data.list // res.data.list => 商品属性值
            this.showAttributeList = true
          } else {
            this.$message.error(res.data.result)
          }
        })
      },
      // ------------------------------- 编辑商品属性值列表 --------------------------- //
      handleAttributeList: function () {
        // 选择属性值
        function compareTwoArr (arr1, arr2) {
          var arr = []
          var i, j, bool
          for (i = 0; i < arr1.length; i++) {
            for (j = 0; j < arr2.length; j++) {
              if (arr1[i].attributeValId === arr2[j].attributeValId) {
                bool = false
                break
              } else {
                bool = i
              }
            }
            if (bool !== false) arr.push(arr1[bool])
          }
          return arr
        }
        this.newAttrList = this.selectedVal.concat()
        this.deletedAttrList = compareTwoArr(this.originalAttrList, this.newAttrList)
        // this.addedAttrList = compareTwoArr(this.newAttrList, this.originalAttrList)

        this.deletedAttrList.forEach(item => {
          item.deleteStatus = true
          this.newAttrList.push(item)
        })

        var attributeList = []
        this.newAttrList.forEach(select => {
          var isExist = false
          attributeList.forEach(attr => {
            if (attr.attributeId === select.attributeId) {
              isExist = true
              attr.goodsAttributeValList = attr.goodsAttributeValList || []
              if (select.deleteStatus) {
                attr.goodsAttributeValList.push({
                  goodsAttributeValId: select.goodsAttributeValId,
                  goodsAttributeVal: ''
                })
              } else {
                if (select.goodsAttributeValId) {
                  attr.goodsAttributeValList.push({
                    goodsAttributeVal: select.attributeVal,
                    attributeValId: select.attributeValId,
                    goodsAttributeValId: select.goodsAttributeValId
                  })
                } else {
                  attr.goodsAttributeValList.push({
                    goodsAttributeVal: select.attributeVal,
                    attributeValId: select.attributeValId
                  })
                }
              }
              return false
            }
          })
          if (!isExist) {
            var object = {}
            this.attributeList.forEach(item => {
              if (item.attributeId === select.attributeId) {
                object['goodsAttributeId'] = item.goodsAttributeId
                object['attributeId'] = item.attributeId
                object['goodsAttributeName'] = item.attributeName
                object['goodsAttributeType'] = item.attributeType
                object['goodsAttributeValList'] = []
                if (select.deleteStatus) {
                  object['goodsAttributeValList'].push({
                    goodsAttributeValId: select.goodsAttributeValId,
                    goodsAttributeVal: ''
                  })
                } else {
                  if (select.goodsAttributeValId) {
                    object['goodsAttributeValList'].push({
                      goodsAttributeVal: select.attributeVal,
                      attributeValId: select.attributeValId,
                      goodsAttributeValId: select.goodsAttributeValId
                    })
                  } else {
                    object['goodsAttributeValList'].push({
                      goodsAttributeVal: select.attributeVal,
                      attributeValId: select.attributeValId
                    })
                  }
                }
              }
            })
            attributeList.push(object)
          }
        })
        return attributeList
      },
      // ------------------------------- 编辑上传图片 --------------------------- //
      uploadSuccess: function (res, file, fileList) {
        // 图片上传成功
        var goodsImageUrls = []
        fileList.forEach(item => {
          goodsImageUrls.push(item.response.obj)
        })
        this.form.goodsImageUrls = goodsImageUrls.toString()
        this.form.mainImage = goodsImageUrls[0]
      },
      uploadErr: function () {
        // 图片上传失败
        this.$message.error('图片上传失败，请重新上传')
      },
      photoRemove: function (file, fileList) {
        // 移除图片
        var filePath = file.response.obj
        this.$http.post('/upload/removeFile', this.qs.stringify({
          filePath: filePath
        }))
        .then(res => {
          if (res.data.res === 1) {
            // this.$message.success('删除图片成功')
            var goodsImageUrls = []
            fileList.forEach(item => {
              goodsImageUrls.push(item.response.obj)
            })
            this.form.goodsImageUrls = goodsImageUrls.toString()
            this.form.mainImage = goodsImageUrls[0]
          } else if (res.data.res === 0) {
            this.$message.error('删除图片失败')
          }
        })
      },
      // ------------------------------- 编辑店铺商品分类 --------------------------- //
      selectGoodsLargeType: function (value) {
        // 店铺商品大类改变
        this.$http.post('/admin/goodsType/getGoodsTypeByParentId', this.qs.stringify({
          parentId: value
        })).then((res) => {
          if (res.data.res === 1) {
            this.goodsMiddleTypeOptions = res.data.list // res.data.list => 店铺商品中类
          } else {
            this.$message.error(res.data.result)
          }
        })
      },
      selectGoodsMiddleType (value) {
        // 店铺商品中类改变
        this.$http.post('/admin/goodsType/getGoodsTypeByParentId', this.qs.stringify({
          parentId: value
        })).then((res) => {
          if (res.data.res === 1) {
            this.goodsSmallTypeOptions = res.data.list // res.data.list => 店铺商品小类
          } else {
            this.$message.error(res.data.result)
          }
        })
      },
      // ------------------------------- 3、验证表单的操作 --------------------------- //
      validateForm: function () {
        // 校验提交的表单
        var goodsProps = [
          {
            name: 'platformTypeGrandParentId',
            desc: '平台商品大类'
          },
          {
            name: 'platformTypeParentId',
            desc: '平台商品中类'
          },
          {
            name: 'platformTypeId',
            desc: '平台商品小类'
          },
          {
            name: 'goodsAttributeList',
            desc: '商品属性'
          },
          {
            name: 'goodTypeGrandParentId',
            desc: '店铺商品大类'
          },
          {
            name: 'goodTypeParentId',
            desc: '店铺商品中类'
          },
          {
            name: 'goodTypeId',
            desc: '店铺商品小类'
          }
        ]
        var message = ''
        var isPass = true
        for (var i = 0; i < goodsProps.length; i++) {
          if (!this.form[goodsProps[i].name] || this.form[goodsProps[i].name].length === 0) {
            message = goodsProps[i].desc
            isPass = false
            break
          }
        }
        if (!isPass) {
          this.$message.error(message + '没有选择')
        }
        return isPass
      },
      // ------------------------------- 4、取消和确认的操作 --------------------------- //
      cancel: function () {
        // 取消
        this.$router.go(-1)
      },
      confirm: function () {
        // 确定
        this.form.goodsAttributeList = this.handleAttributeList()
        this.form.isChang = 1
        if (this.validateForm()) {
          this.$http.post('/admin/goods/updateGoods', this.form)
          .then((res) => {
            if (res.data.res === 1) {
              this.$message.success('编辑商品成功')
              this.$router.go(-1)
            } else {
              this.$message.error('编辑商品失败')
            }
          })
        } else {
          this.$message.error('编辑商品失败')
        }
      }
    },
    mounted: function () {
      this.goodsId = this.$route.params.goodsId  // 获取商品ID
      this.getGoodsById()
    }
  }
</script>

<style lang="less" scoped>
  .add-goods-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
      .form-item-title {
        display: inline-block;
        width: 120px;
        text-align: right;
        font-size: 14px;
        color: rgb(102, 102, 102);
        margin-right: 16px;
      }
      .goods-form-wrap {
        background-color: rgb(245, 245, 245);
        border-radius: 4px;
        .input-group {
          width: 300px;
        }
        .upload-advice {
          font-size: 14px;
          color: rgb(153, 153, 153);
          margin-left: 140px;
          padding: 10px 0;
        }
      }
      .goods-form-wrap:first-child {
        line-height: 60px;
        margin-bottom: 10px;
      }
      .goods-form-wrap+.goods-form-wrap {
        padding-bottom: 64px;
        margin-bottom: 10px;
      }
      .shelf-status {
        line-height: 68px;
        border-bottom: 1px solid rgb(242, 242, 242);
        margin-bottom: 18px;
      }
      #quill-editor {
        width: 800px;
        height: 300px;
      }
    }
  }
</style>

<style lang="less">
  .add-goods-wrap {
    .content-wrap {
      .el-form {
        .el-row {
          padding-top: 40px;
        }
        .el-form-item {
          display: inline-block;
          margin-bottom: 0;
        }
      }
      .el-button {
        width: 120px;
        padding: 0;
        height: 40px;
        background-color: rgb(242, 242, 242);
        border-color: rgb(204, 204, 204);
        color: rgb(51, 51, 51);
        border-radius: 0;
        margin-right: 12px;
      }
      .el-checkbox-group {
        position: relative;
        top: -4px;
        .el-checkbox-button {
          margin-right: 18px;
          .el-checkbox-button__inner {
            min-width: 70px;
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            border-radius: 14px;
            border: 1px solid #dcdfe6;
            color: rgb(51, 51, 51);
          }
          .el-checkbox-button__inner:hover {
            color: rgb(51, 51, 51);
          }
        }
        .el-checkbox-button.is-checked .el-checkbox-button__inner {
          background-color: rgb(202, 0, 16);
          color: rgb(255, 255, 255);
          box-shadow: none;
        }
      }
    }
  }
</style>
