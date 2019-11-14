<template>
  <div class="add-goods-wrap">
    <div class="content-wrap">
      <div class="goods-form-wrap">
        <el-form :model="form">
          <span class="form-item-title">平台商品分类：</span>
          <el-form-item>
            <el-select v-model="form.platformTypeGrandParentId" placeholder="请选择商品大类" disabled>
              <el-option
                v-for="item in largeTypeOptions"
                :key="item.attributeTypeId"
                :label="item.attributeTypeName"
                :value="item.attributeTypeId">
              </el-option>
            </el-select>
            <span class="line">—</span>
            <el-select v-model="form.platformTypeParentId" placeholder="请选择商品中类" disabled>
              <el-option
                v-for="item in middleTypeOptions"
                :key="item.attributeTypeId"
                :label="item.attributeTypeName"
                :value="item.attributeTypeId">
              </el-option>
            </el-select>
            <span class="line">—</span>
            <el-select v-model="form.platformTypeId" placeholder="请选择商品小类" disabled>
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
              <el-checkbox-group v-model="selectedVal" disabled>
                <el-checkbox-button v-for="attrVal in attribute.attributeValList"  :label="attrVal" :key="attrVal.attributeValId">{{ attrVal.attributeVal }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="goods-form-wrap">
        <el-form :model="form">
          <el-row>
            <span class="form-item-title">商品名称：</span>
            <el-form-item class="input-group">
              <el-input v-model="form.goodsName" disabled></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <span class="form-item-title">商品编码：</span>
            <el-form-item class="input-group">
              <el-input v-model="form.goodsNo" disabled></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <span class="form-item-title">价格：</span>
            <el-form-item class="input-group">
              <el-input v-model="form.goodsPrice" disabled></el-input>
            </el-form-item>
          </el-row>
          <!-- 商品图片 -->
          <el-row style="position: relative;">
            <span class="form-item-title" style="position: absolute;">商品图片：</span>
            <el-form-item style="margin-left: 160px;">
              <el-upload
                :action="this.$api.MAIN_API + this.$api.UPLOAD_API"
                list-type="picture-card"
                :file-list="fileList"
                disabled>
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <p class="upload-advice">图片建议尺寸：500 * 500px ；建议大小：100KB以内</p>
          </el-row>
          <el-row>
            <span class="form-item-title">店铺商品分类：</span>
            <el-form-item>
              <el-select placeholder="请选择商品大类" v-model="form.goodTypeGrandParentId" disabled>
                <el-option
                  v-for="item in goodsLargeTypeOptions"
                  :key="item.goodsTypeId"
                  :label="item.goodsType"
                  :value="item.goodsTypeId">
                </el-option>
              </el-select>
              <span class="line">—</span>
              <el-select placeholder="请选择商品中类" v-model="form.goodTypeParentId" disabled>
                <el-option
                  v-for="item in goodsMiddleTypeOptions"
                  :key="item.goodsTypeId"
                  :label="item.goodsType"
                  :value="item.goodsTypeId">
                </el-option>
              </el-select>
              <span class="line">—</span>
              <el-select placeholder="请选择商品小类" v-model="form.goodTypeId" disabled>
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
                @ready="onEditorReady($event)">
              </quill-editor>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="shelf-status">
        <el-form :model="form">
          <span class="form-item-title">上架状态：</span>
          <el-form-item>
            <el-radio v-model="form.saleState" label="1" :disabled="form.saleState === '2'">上架</el-radio>
            <el-radio v-model="form.saleState" label="2" :disabled="form.saleState === '1'">下架</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <!-- <el-button @click="edit">编辑</el-button> -->
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
        fileList: [],
        editorOptions: editorOptions // 富文本编辑器的配置
      }
    },
    methods: {
      onEditorReady (quill) {
        quill.enable(false)
      },
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
            this.handleAttributeList()
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
        // 选择商品小类
        this.$http.post('/admin/attributeType/getAttributeTypeListByParentId', this.qs.stringify({
          parentId: value
        })).then((res) => {
          if (res.data.res === 1) {
            this.smallTypeOptions = res.data.list // res.data.list => 商品小类
          }
        })
      },
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
      handleAttributeList: function () {
        // 选择属性值
        var tempArr = []
        this.attributeList.forEach(attr => {
          if (attr.attributeValList) {
            attr.attributeValList.forEach((attrVal, index) => {
              if (attrVal.choice) {
                tempArr.push(attr.attributeValList[index])
              }
            })
          }
        })
        this.selectedVal = tempArr
      },
      handleFileList: function (fileListString) {
        // 处理图片数据
        var fileList = fileListString.split(',')
        var fileListFinal = []
        fileList.forEach(item => {
          var shortPath = item
          var longPath = this.$api.IMG_API + item
          fileListFinal.push({
            response: {
              obj: shortPath
            },
            url: longPath
          })
        })
        this.fileList = fileListFinal
      },
      cancel: function () {
        // 取消
        this.$router.go(-1)
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
