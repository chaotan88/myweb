<!-- 商品管理 - sku -->
<template>
  <common-tpl class="pos-r goods-manage-public" footer back :collapse="false">
    <!-- 头部 -->
    <template slot="header"></template>

    <!-- 主体内容 -->
    <template slot="main" class="goods-manage-public-box" ref="a">

      <a id="basicInfo"></a>
      <gray-title title="基本信息"></gray-title><br>
      <div style="min-height: 400px; max-height: 525px; padding-left: 260px; padding-bottom: 60px; overflow: hidden;margin: 0 0 20px 0;" class="pos-r full-h">
        <!-- 商品分类 -->
        <div class="pos-a" style="width: 240px; height: 100%; max-height: 525px; left: 0; top: 0;">
          <goods-attribute :defaultId="platformTypeId" @change="goodsAttributeChange"></goods-attribute>
        </div>
<!--        <gray-title title="商品参数：">
          <div>sfsd</div>
        </gray-title><br>-->
        <div class="fw-n pos-r admin-gray-title">
          <div><span style="color: red;">*</span>商品参数：</div>
        </div>
        <div class="params-data">
          <!-- 属性值 -->
          <div class="params-content"  v-for="(item,index) in platformAttributeList" :key="index" v-if="parseInt(item.attributeType) === 1">
            <div style="margin: 20px 0;width: 120px;text-align: right;">{{item.attributeName + '：'}}</div>
            <el-checkbox-group class="d-ib" v-model="platformAttributeSelectList[index].attributeValList" style="margin: 20px;flex: 1;">
              <template v-for="(list, i) in item.attributeValList">
                <el-checkbox :label="list.id">{{list.attributeVal}}</el-checkbox>
              </template>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <el-form :model="formData" :rules="rules" ref="formData" label-width="180px">

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
            <thumbnail-component :drag="true" :empty="false" :list="formData.uploadFileList" :link="true" :auto-delete="true" move del :styles="{width: '148px', height: '148px', 'margin-right': '10px'}">
              <template slot="other">
                <upload-component :styles="{width: '148px', height: '148px'}" @success="uploadImgSuccess($event, formData.uploadFileList)" v-if="formData.uploadFileList.length < 5"></upload-component>
                <div class="va-t d-ib" style="color: #f5a74a; line-height: 20px;padding:60px 0 0 20px">
                  <template>图片建议尺寸：414 * 414px 建议大小：100KB以内</template>
                  <div class="gray-text">共<strong class="fw-n">{{formData.uploadFileList.length}}</strong>张，还能上传<strong class="fw-n">{{5 - formData.uploadFileList.length}}</strong>张</div>
                </div>
              </template>
            </thumbnail-component>
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

          <a id="specificationInfo"></a>
          <gray-title title="规格设置"></gray-title>
          <br>
          <el-form-item>
            <el-radio-group v-model="formData.spec">
              <el-radio :label="0">统一规格</el-radio>
              <el-radio :label="1">多规格</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 同一规格 -->
          <div v-if="formData.spec === 0">
            <el-form-item label="条形码：" prop="externalNo">
              <el-input v-model="formData.externalNo" placeholder="请输入条形码" ></el-input>
            </el-form-item>
            <el-form-item label="库存：" prop="goodsNum">
              <el-input v-model="formData.goodsNum" placeholder="请输入库存" ></el-input>
            </el-form-item>
            <el-form-item label="进货价：" prop="purchasePrice">
              <el-input v-model="formData.purchasePrice" placeholder="请输入价格" @change="getIntegralPoint" @blur="inpBlur('purchasePrice')"></el-input>
            </el-form-item>
            <el-form-item label="销售价：" prop="salePrice">
              <el-input v-model="formData.salePrice" placeholder="请输入价格" @change="getIntegralPoint" @blur="inpBlur('salePrice')"></el-input>
            </el-form-item>
            <!--<el-form-item label="利润率：">
              {{getLiRunLi(formData)}}
            </el-form-item>
            <el-form-item label="获得积分：" class="exchange-wrap">
              <el-radio-group v-model="formData.whetherGetPoint" class="pos-a" @change="getIntegralPoint">
                <el-radio :label="0">公式计算</el-radio>
                <el-radio :label="1">自定义</el-radio>
              </el-radio-group>
              <template v-if="formData.whetherGetPoint === 1">
                <el-form-item prop="consumeGetPoint" style="padding-left: 80px;">
                  <el-input v-model="formData.consumeGetPoint" placeholder="请输入正数" style="width: 280px"></el-input>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item prop="culaPoint" style="padding-left: 80px;">
                  <el-input v-model="formData.culaPoint" readonly style="width: 280px"></el-input>
                </el-form-item>
              </template>
            </el-form-item>
            <el-form-item label="是否特卖商品：" class="sale-wrap">
              <el-radio-group v-model="formData.isSale" class="pos-a" @change="getIntegralPoint">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
              <template v-if="formData.isSale === 1">
                <el-form-item prop="sale">
                  <el-input v-model="formData.sale" placeholder="请输入正数" @change="getIntegralPoint" style="width: 280px" @blur="inpBlur('sale')"></el-input>
                </el-form-item>
              </template>
            </el-form-item>-->
          </div>

          <!-- 多规格 -->
          <div v-show="formData.spec === 1">
            <sku-wrap ref="sku-wrap" :level="formData.goodsTypeLevel" :supplierId="this.formData.supplierNewId" :goodsTypeId="parseInt(platformAttributeData.small.id)" :spec="formData.spec" :assignSkuData="assignSkuData" @validate="handleSkuValidate"></sku-wrap>
          </div>

          <a id="otherInfo"></a>
          <gray-title title="其它信息"></gray-title><br>
          <!-- 编辑器 -->
          <el-form-item label="详情描述：" prop="details" class="full-w">
            <editor v-model="formData.editorText" @change="ueditorChange" ref="deitor-first"></editor>
          </el-form-item>
          <el-form-item label="关键字：" prop="keyWords" >
            <el-input type="textarea" v-model="formData.keyWords" rows="6" style="width: 400px; min-height: 150px;" placeholder="200个字符以内，多个关键字以#分隔" maxLength="200"></el-input>
            <span style="color: #999; margin-left: 5px;">({{formData.keyWords.length}}/200)</span>
          </el-form-item>

          <a id="productInfo"></a>
          <gray-title title="产品溯源信息"></gray-title><br>
          <section class="ml-40">
            <div class="sub-title">区块溯源</div>
            <el-row type="flex" class="sub-info " v-for="(item, index) in formData.originsBlockRequestList" style="padding-top: 10px;">
              <el-col :span="10">
                <el-form-item label="" prop="happenTime" class="flex" :rules="[]" label-width="-10px">
                  <el-row type="flex" justify="">
                    <div style="word-wrap: normal;width: 70px;">发生时间：</div>
                    <el-date-picker type="datetime" placeholder="选择时间" v-model="item.happenTime" style="width: 220px;margin-right: 40px;"></el-date-picker>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="" prop="eventDesc" class="ml-40 flex" :rules="[]" label-width="-10px">
                  <el-row type="flex" justify="center">
                    <div style="word-wrap: normal;width: 70px;">事件描述：</div>
                    <el-input  type="textarea" v-model="item.eventDesc"  placeholder="限500个字符" maxLength="500" :autosize="{minRows: '2', maxRows: '6'}" style="width: 300px;"></el-input>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="" prop="" class="ml-40 flex" :rules="[]" label-width="100px">
                  <el-tooltip content="添加一行"  effect="dark" placement="bottom" v-if="index === 0">
                    <i @click="handleAdd(formData.originsBlockRequestList, index)" class="icon el-icon-plus" style="padding: 6px;background: white;"></i>
                  </el-tooltip>
                  <el-tooltip content="删除"  effect="dark" placement="bottom" v-if="index !== 0">
                    <i @click="handleDelete(formData.originsBlockRequestList, index)" class="icon el-icon-minus" style="padding: 6px;background: white;"></i>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="sub-title mt-20" v-if="formData.originsListData.length > 0">业务流转溯源</div>
            <table border="0" cellspacing="0" cellpadding="0" v-for="(item, index) in formData.originsListData" :key="index" class="mt-20">
              <tr>
                <td class="td-padding td-bg" colspan="2" >{{item.originsName}}</td>
              </tr>
              <tr v-for="(itemChild, indexChild) in item.originsDetailList" :key="indexChild">
                <td class="td-padding td-title"><span style="color: red;" v-if="itemChild.ifRequired === 1">*</span>{{itemChild.infoContent + '：'}}</td>
         <!--       <td class="td-padding td-title">
                  <el-form-item :label="itemChild.infoContent + '：'"  label-width="0" style="margin-bottom: 0;" :required="itemChild.ifRequired === 1 ? true : false">
                  </el-form-item>
                </td>-->
                <td class="td-padding">
                  <el-form-item label="" :prop="'originsListData.' + index + '.originsDetailList.' + indexChild + '.originsContent'" v-if="itemChild.infoType !== 2" class="" label-width="0" style="margin-bottom: 0;" :rules="itemChild.ifRequired === 1 ? {required: true, message: '不能为空', trigger: 'change'} : []">
                    <el-input v-if="itemChild.infoType === 0" v-model="itemChild.originsContent" placeholder="限50个字符，不含其他字符" maxLength="50"></el-input>
                    <el-input v-if="itemChild.infoType === 1" v-model="itemChild.originsContent" type="textarea" placeholder="限1000个字符，不含其他字符" maxLength="1000"></el-input>
                  </el-form-item>
                  <el-form-item label="" :prop="'originsListData.' + index + '.originsDetailList.' + indexChild + '.goodsOriginsImageRequestLists'" v-if="itemChild.infoType === 2" class="" label-width="0" style="margin-bottom: 0;" :rules="itemChild.ifRequired === 1 ? {required: true, message: '不能为空',type: 'array',  trigger: 'change'} : []">
                    <thumbnail-component :empty="false" :styles="img100" :link="false" del :auto-delete="true" :list="itemChild.goodsOriginsImageRequestLists" style="width: 100%;height: 100%;" @change="deleteImg($event, itemChild.goodsOriginsImageRequestLists)">
                      <template slot="other">
                        <upload-component :styles="img100" @success="uploadOriginsImgSuccess($event, itemChild.goodsOriginsImageRequestLists, itemChild)" v-if="itemChild.goodsOriginsImageRequestLists.length < 15"></upload-component>
                      </template>
                    </thumbnail-component>
                  </el-form-item>
                </td>
              </tr>
            </table>
            <div class="sub-title mt-20">企业基本信息</div>
            <el-form-item label="生产商名称：" prop="enterpriseName" >
              <el-input v-model="formData.enterpriseName" maxLength="50" style="width: 400px;" placeholder="50个字符以内，不含特殊字符" ></el-input>
            </el-form-item>
            <el-form-item label="生产商地址："  prop="address" >
              <el-row>
                <el-col :span="12">
                  <region-select :initData="formData.region" @change="regionChange" ref="regionAll"></region-select>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" prop="enterpriseAddress"  class="ml-10">
                    <el-input placeholder="限50个字符" maxlength="50" v-model="formData.enterpriseAddress"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="生产商电话：" prop="enterprisePhone" >
              <el-input v-model="formData.enterprisePhone"  maxLength="50" style="width: 400px;" placeholder="50个字符以内，不含特殊字符" ></el-input>
            </el-form-item>
            <el-form-item label="官网链接：" prop="website" >
              <el-input v-model="formData.website"  maxLength="50" style="width: 400px;" placeholder="50个字符以内（格式http://）" ></el-input>
            </el-form-item>
            <el-form-item label="企业实地信息：" prop="details" class="full-w">
              <editor v-model="formData.enterpriseSpotImg" @change="ueditorChange2" ref="deitor-second"></editor>
            </el-form-item>
          </section>
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

      <!--目录指引-->
      <div class="catalog-info">
        <a v-for="(item,index) in liList" :key="index" :class="{ 'active': item.name === catalogName}" @click="scrollTo(item.name, item.url)">
          {{item.name}}
        </a>
      </div>

    </template>

    <!-- 折叠 -->
  <!--  <template slot="collapse">
      <el-form :model="formData">
        <el-form-item label="审核状态：" prop="reviewStatus">
          <el-radio-group v-model="formData.reviewStatus">
            <el-radio :label="3">未提交审核</el-radio>
            <el-radio :label="0">待审核</el-radio>
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="2">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架：" prop="saleStatus">
          <el-radio-group v-model="formData.saleStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推荐商品：" prop="whetherRecommend">
          <el-radio-group v-model="formData.whetherRecommend">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        &lt;!&ndash;<el-form-item label="发货区域限制：" prop="fahou">
          <el-radio-group v-model="formData.fahou">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <template v-if="formData.fahou === 1">
            <table border="0" cellspacing="0" cellpadding="0" class="mt-20" style="width:400px" >
              <tr >
                <td class=" td-bg " colspan="2"  style="display: flex;justify-content: space-around">
                  <span>省份</span>
                  <span>市区</span>
                </td>
                &lt;!&ndash;  <td class=" td-bg">市区</td>&ndash;&gt;
                <td class="align-center td-bg">操作</td>
              </tr>
              <tr v-for="(item, index) in formData.listlist" :key="index">
                <td class="td-padding flex" colspan="2" >
                  <region-select :initData="formData.region1" @change="regionPartChange" areaIsShow="none" ref="regionPart"></region-select>
                </td>
                <td class="td-padding">
                  <el-tooltip content="添加一行"  effect="dark" placement="bottom" v-if="index === 0">
                    <i @click="handleAdd(formData.listlist, index)" class="icon el-icon-plus" style="padding: 6px;background: white;"></i>
                  </el-tooltip>
                  <el-tooltip content="删除"  effect="dark" placement="bottom" v-if="index !== 0">
                    <i @click="handleDelete(formData.listlist, index)" class="icon el-icon-minus" style="padding: 6px;background: white;"></i>
                  </el-tooltip>
                </td>
              </tr>
            </table>
          </template>
        </el-form-item>&ndash;&gt;
      </el-form>
    </template>-->

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" @click="submitForm('formData')">保存</el-button>
      <el-button type="primary" @click="submitForm('formData', 2)" v-if="pageStatus === 0">保存并继续</el-button>
      <el-button type="primary" @click="submitForm('formData', 3)" style="width: 140px;">保存并提交审核</el-button>
    </template>
  </common-tpl>
</template>

<script>
import Editor from '@/components/public/Editor'
import GoodsAttribute from '@/components/public/GoodsAttribute'
// import VueUeditorWrap from 'vue-ueditor-wrap'
import SkuWrap from './Sku'
export default {
  components: {
    Editor,
    GoodsAttribute,
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
    // 库存
    let validateGoodsNum = (rule, value, callback) => {
      if (!value && value !== 0) return callback(new Error('请输入库存'))
      if (value < 0 || isNaN(value) || !value.toString().match(/^\d+$/gi)) return callback(new Error('必须是大于等于0的正整数'))
      callback()
    }

    // 自定义获得积分
    let validateConsumeGetPoint = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入积分'))
      if (value < 0 || isNaN(value) || value > 10000000 || !value.toString().match(/^\d+$/gi)) return callback(new Error('必须是0-1000000整数'))
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
      // ...start--------------------------------------------------------以下为新增属性-------------------------------
      platformTypeId: 0,           // 当前商品小类
      paramsList: [{name: '李宁', list: [111, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333, 222, 333]}, {name: '李宁', list: [111, 222, 333]}, {name: '李宁', list: [111, 222, 333]}],
      catalogName: '基本信息',       // 当前目录名称
      paramsArr: [],
      liList: [{name: '基本信息', url: '#basicInfo'}, {name: '规格设置', url: '#specificationInfo'}, {name: '其它信息', url: '#otherInfo'}, {name: '产品溯源信息', url: '#productInfo'}],
      img100: {width: '100px', height: '100px'}, // 图片大小
      formData: {
        // ...start--------------------------------------------------------以下为新增属性-------------------------------
        goodsTypeLevel: 0,                // 分类等级
        supplierNewId: null,          // 供应商ID
        region: {
          province: {          // 省
            code: '',
            name: ''
          },
          city: {              // 市
            code: '',
            name: ''
          },
          area: {              // 区
            code: '',
            name: ''
          }
        },
        region1: {
          province: {          // 省
            code: '',
            name: ''
          },
          city: {              // 市
            code: '',
            name: ''
          },
          area: {              // 区
            code: '',
            name: ''
          }
        },
        address: [],                // 校验地址是否已填写
        listlist: [{happenTime: '', eventDesc: ''}],
        logisticsInfoImgs: [],      // 物流信息图片集合
        productMadeImgs: [],        // 原料产地图片集合
        processImg: [],             // 加工过程图片集合
        dealerInfoImg: [],          // 经销商信息图片集合
        customDeclarationImg: [],   // 通关单图片集合
        reviewStatus: 0,            // 审核状态
        saleStatus: 2,              // 是否上架
        whetherRecommend: 0,        // 是否推荐商品
        productBatch: '',           // 生产批次
        recordTime: '',             // 记录时间
        whetherGetPoint: 0,         // 获得积分
        consumeGetPoint: '',        // 获得积分: 自定义
        fahou: 1,                         // 发货区域限制
        originsListData: [],              // 溯源信息集合
        originsBlockRequestList: [],      // 区块溯源集合
        enterpriseId: '',                 // 溯源企业信息 id
        enterpriseName: '',                  // 省份
        province: '',                        // 省份代码
        provinceCode: '',                    // 城市
        city: '',                            // 城市代码
        cityCode: '',                        // 地区
        zone: '',                            // 地区代码
        zoneCode: '',                        // 详细地址
        enterpriseAddress: '',               // 生产商名称
        enterprisePhone: '',                 // 电话
        website: '',                         // 网址
        enterpriseSpotImg: '',               // 实地信息
        // ..end.-------------------------------------------------------------------------------------------------------
        goodsId: '',                // 商品id
        goodsType: 1,               // 商品类型
        platformAttributeValue: '', // 属性分类
        classifySelectValue: '',    // 商品分类结果
        brandId: '',                // 品牌
        name: '',                   // 商品名称
        code: '',                   // 商品编码
        purchasePrice: '',          // 进货价
        salePrice: '',              // 销售价
        goodsNum: '',               // 库存
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
        // 库存
        goodsNum: [{ required: true, validator: validateGoodsNum, trigger: 'blur' }],
        // 自定义积分
        consumeGetPoint: [{ required: true, validator: validateConsumeGetPoint, trigger: 'blur' }],
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
  created () {
    // window.addEventListener('scroll', this.onScroll(), true)
    // this.$nextTick(function () {
    //  console.log(this.$refs.a)
    //  let dom = document.getElementsByClassName('admin-child-main')[0]
    //  dom.addEventListener('scroll',
    //    this.onScroll
    //  , true)
    // })
  },
  mounted () {
    this.copyPlatformAttributeData = this.$Utils.deepCopy(this.platformAttributeData)
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    if (this.$route.path.match(/add/gi)) {
      this.pageStatus = 0
      this.formData.originsBlockRequestList = [{id: '', happenTime: '', eventDesc: ''}]
    }
    this.getBrandListData()
    if (this.$route.path.match(/edit/gi)) {
      this.formData.goodsId = parseInt(this.$route.query.id) || ''
      this.getDetailsData()
      this.getOriginsListByParam()   // 获取对应溯源信息
    }
    if (this.pageStatus === 0) this.ueditorVisible = true
    this.$refs['formData'].resetFields()
  },
  methods: {
    onScroll () {
      // console.log('正在滚动中。。。。')
      // let scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // console.log(scrolled)
     // let second = document.querySelector(this.liList[1].url).scrollTop
     // console.log(second)
      // if (scrolled >= 1063) {
      //   this.catalogName = '基本信息'
      // } else if (scrolled < 1063 && scrolled >= 586) {
      //   this.catalogName = '规格设置'
      // } else {
      //   this.catalogName = '其它信息'
      // }
    },
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
        if (detailsData.multStandard === 0 && detailsData.goodsSkuList.length > 0) {
          let skuObj = detailsData.goodsSkuList[0]

          this.formData.skuId = skuObj.id

          this.formData.purchasePrice = skuObj.buyingPrice         // 进货价

          this.formData.salePrice = skuObj.goodsPrice              // 销售价
          this.formData.externalNo = skuObj.externalNo              // 条形码

          this.formData.goodsNum = skuObj.goodsNum              // 库存

        //  this.formData.isSale = skuObj.whetherSpecial             // 是否特卖
        //  this.formData.sale = skuObj.goodsSpecialPrice            // 特卖价格
          this.formData.stock = skuObj.goodsNum

        //  this.formData.isExchange = skuObj.whetherPoints          // 积分兑换
        //  this.formData.exchange = skuObj.points                   // 积分

        //  this.formData.whetherGetPoint = skuObj.whetherGetPoint             // 获得积分
        //  this.formData.consumeGetPoint = skuObj.consumeGetPoint             // 获得积分 :自定义

          this.formData.externalNo = skuObj.externalNo

          this.getIntegralPoint()
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
        this.formData.whetherRecommend = detailsData.whetherRecommend        // 推荐
        this.formData.sort = detailsData.goodsSort                    // 排序
        this.formData.spec = detailsData.multStandard
        this.assignSkuData = detailsData.goodsSkuList || []
        this.formData.brandId = detailsData.brandId
        this.formData.keyWords = detailsData.keyWords
        this.platformTypeId = detailsData.platformTypeId                            // 查询商品信息后获取当前商品小类id
       // this.formData.supplierNewId = detailsData.supplierNewId                                   // 供应商id
       // this.getBrandListData(detailsData.supplierNewId)
        if (detailsData.platformTypeGrandParentId) {                                 // 是否为第三分类
          this.formData.goodsTypeLevel = 3
        } else {
          this.formData.goodsTypeLevel = 0
        }
        this.formData.saleStatus = detailsData.saleStatus                           //  是否上架
       // this.formData.reviewStatus = detailsData.reviewStatus                       //  审核状态
        if (detailsData.originsBlockList.length === 0) {
          this.formData.originsBlockRequestList = [{id: '', happenTime: '', eventDesc: ''}]
        } else {
          this.formData.originsBlockRequestList = detailsData.originsBlockList        //  区块溯源集合
        }
        //  企业信息
        if (detailsData.origisnEnterprise !== null && detailsData.origisnEnterprise !== '') {
          this.formData.enterpriseId = detailsData.origisnEnterprise.id
          this.formData.enterpriseName = detailsData.origisnEnterprise.enterpriseName
          this.formData.enterpriseAddress = detailsData.origisnEnterprise.enterpriseAddress
          this.formData.enterprisePhone = detailsData.origisnEnterprise.enterprisePhone
          this.formData.website = detailsData.origisnEnterprise.website
          this.formData.enterpriseSpotImg = detailsData.origisnEnterprise.enterpriseSpotImg === null ? '' : detailsData.origisnEnterprise.enterpriseSpotImg
          this.formData.region.province.name = detailsData.origisnEnterprise.province
          this.formData.region.province.code = detailsData.origisnEnterprise.provinceCode
          this.formData.region.city.name = detailsData.origisnEnterprise.city
          this.formData.region.city.code = detailsData.origisnEnterprise.cityCode
          this.formData.region.area.name = detailsData.origisnEnterprise.zone
          this.formData.region.area.code = detailsData.origisnEnterprise.zoneCode
          this.formData.address.push(detailsData.origisnEnterprise.province.name)
          this.formData.address.push(detailsData.origisnEnterprise.city.name)
          this.formData.address.push(detailsData.origisnEnterprise.zone.name)
        } else {
          this.formData.address = []
        }
        //  this.formData.productBatch = detailsData.productBatch                       //  生产批次
        //  this.formData.recordTime = detailsData.recordTime ? this.$Utils.filterDate(detailsData.recordTime) : ''                           //  记录时间
      }).finally(() => {
        setTimeout(() => {
          this.ueditorVisible = true
        }, 300)
      })
    },

    /**
     * 获取品牌列表
     */
    getBrandListData (val) {
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
     * 编辑器内容改变  (实地信息)
     */
    ueditorChange2 (value) {
      this.formData.enterpriseSpotImg = value
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
    //  alert(2)
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
     // console.log(this.formData.uploadMainFileList)
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
      this.dialogMainImageUrl = file.url
      this.previewMainVisible = true
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
            //  whetherSpecial: this.formData.isSale,
            //  goodsSpecialPrice: this.formData.isSale === 1 && !isNaN(this.formData.sale) && this.formData.sale > 0 ? this.formData.sale : 0.01,
            //  goodsNum: this.formData.stock,
             // whetherPoints: this.formData.isExchange,
             // points: this.formData.exchange,
              goodsSkuValList: [],
              externalNo: this.formData.externalNo,
            //  whetherGetPoint: this.formData.whetherGetPoint,   // 获得积分
            //  consumeGetPoint: this.formData.consumeGetPoint,
              goodsNum: this.formData.goodsNum                  // 库存

            }
          ]
        }
        // 获取所有价格过滤最低价及最高价
        let goodsPriceList = []
        this.formData.skuResults.forEach((row) => {
          let price = row.whetherSpecial === 1 ? row.goodsSpecialPrice : row.goodsPrice
          goodsPriceList.push(price)
        })
        // 增加溯源信息
        let goodsOriginsRequests = []
        this.formData.originsListData.forEach(item => {
          item.originsDetailList.forEach(itemm => {
            goodsOriginsRequests = goodsOriginsRequests.concat(itemm)
          })
        })

        // 增加溯源企业信息
        let originsEnterpriseRequest = {
          id: this.formData.enterpriseId,
          enterpriseName: this.formData.enterpriseName,
          province: this.formData.region.province.name,
          provinceCode: this.formData.region.province.code,
          city: this.formData.region.city.name,
          cityCode: this.formData.region.city.code,
          zone: this.formData.region.area.name,
          zoneCode: this.formData.region.area.code,
          enterpriseAddress: this.formData.enterpriseAddress,
          enterprisePhone: this.formData.enterprisePhone,
          website: this.formData.website,
          enterpriseSpotImg: this.formData.enterpriseSpotImg
        }
        if (this.formData.goodsTypeLevel !== 3) {
          this.$message({
            message: '请选择商品三级分类',
            type: 'error',
            duration: 1500
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

          // whetherRecommend: parseInt(this.formData.whetherRecommend),      // 是否特卖
          saleStatus: parseInt(this.formData.saleStatus),                  // 是否上架
          reviewStatus: parseInt(this.formData.reviewStatus),              // 审核状态
          supplierNewId: this.formData.supplierNewId === '' ? null : this.formData.supplierNewId,                          // 供应商id
        //  productBatch: parseInt(this.formData.productBatch),              // 生产批次
        //  recordTime: this.$Utils.filterDate(this.formData.recordTime),    // 生产批次
          originsBlockObj: {
            originsBlockRequestList: this.formData.originsBlockRequestList                       // 增加溯源区块信息
          },
          goodsOriginsObj: {                                                                     // 增加溯源信息
            goodsOriginsRequests: goodsOriginsRequests
          },
          originsEnterpriseRequest: originsEnterpriseRequest,                      // 增加企业信息
          // ...
          remark: this.formData.editorText,
          keyWords: this.formData.keyWords,
          attributeRequestList,
          goodsImageRequestList,
          goodsSort: this.formData.sort === '' ? 0 : this.formData.sort,
          goodsVideoUrl: this.formData.uploadVideoUrl,
          whetherRecommend: parseInt(this.formData.whetherRecommend),       // 是否特卖
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
    },
    // -------------------------------------------------   以下方法新功能新增   ----------------------------------------
    /**
     * 分类选择
     */
    attributeChange (value) {
      this.formData.platformAttributeValue = value
    },
    /**
     * 商品图片上传成功（除主图外，其他全部图片上传成功加调）
     */
    uploadImgSuccess (url, imgList) {
      imgList.push({url: this.$Utils.filterImgUrl(url), imageUrl: url})
    },
    /**
     * 商品图片上传成功（溯源图片）
     */
    uploadOriginsImgSuccess (url, imgList, item) {
      imgList.push({
        url: this.$Utils.filterImgUrl(url),
        imageUrl: url,
        id: '',
        goodsId: this.formData.goodsId,
        goodsOriginsId: item.id,
        originsDetailId: item.originsDetailId,
        infoType: item.infoType,
        originsImage: url
      })
    },
    /**
     * 商品图片删除（除主图外，其他全部图片删除加调）
     */
    deleteImg (event, imgList) {
      imgList = event
    },
    /**
     * 分类选择
     */
    goodsAttributeChange (data, currentData) {
      let results = {
        large: {
          id: currentData.grandParentId,
          name: currentData.grandParentName
        },
        middle: {
          id: currentData.parentId,
          name: currentData.parentName
        },
        small: {
          id: currentData.id,
          name: currentData.label
        }
      }
      this.platformAttributeData = results
      this.platformTypeId = currentData.id
      this.formData.goodsTypeLevel = currentData.attributeTypeLevel
      this.getAttributeById(currentData.id)
      this.getOriginsListByParam()     // 获取对应溯源信息
    },
    /**
     * 锚链接跳转,不更改路由
     */
    scrollTo (name, url) {
      document.querySelector(url).scrollIntoView(true)
      this.catalogName = name
    },
    /**
     * 增加一行
     */
    handleAdd (data, index) {
      data.push({
        eventDesc: '',
        happenTime: ''
      })
    },
    /**
     * 删除一行
     */
    handleDelete (data, index) {
      data.splice(index, 1)
    },
    /**
     * 省市区数据更新
     */
    regionChange (results) {
      this.formData.region = results
      // this.formData.mapAddress = [results.province.name, results.city.name, results.area.name, this.formData.contactsAddress].join(',')
      this.formData.address = []
      if (results.province.name) this.formData.address.push(results.province.name)
      if (results.city.name) this.formData.address.push(results.city.name)
      if (results.area.name) this.formData.address.push(results.area.name)
      this.formData.address = this.formData.address.length === 3 ? this.formData.address : []
    },
    /**
     * 省市区数据更新 (发货区域限制)
     */
    regionPartChange (results) {
      this.formData.region1 = results
      // this.formData.mapAddress = [results.province.name, results.city.name, results.area.name, this.formData.contactsAddress].join(',')
      this.formData.address = []
      if (results.province.name) this.formData.address.push(results.province.name)
      if (results.city.name) this.formData.address.push(results.city.name)
      if (results.area.name) this.formData.address.push(results.area.name)
    },
    /**
     * 获取商品溯源信息
     */
    getOriginsListByParam () {
      this.$http.post('@ROOT_API/goods/getOriginsListByParam', {
        attributeTypeId: this.platformTypeId,
        goodsId: this.formData.goodsId
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
        this.formData.originsListData = resData.data
        this.formData.originsListData.forEach(item => {
          // ...
          item.originsDetailList.forEach(itemm => {
            if (itemm.goodsOriginsImageList === null) itemm.goodsOriginsImageList = []
            if (itemm.goodsOriginsImageList !== null) {
              if (itemm.goodsOriginsImageList.length > 0) {
                itemm.goodsOriginsImageList.forEach(itemmm => {
                  this.$set(itemmm, 'url', this.$Utils.filterImgUrl(itemmm.originsImage))
                  this.$set(itemmm, 'imageUrl', itemmm.originsImage)
                })
              }
            }
            this.$set(itemm, 'goodsOriginsImageRequestLists', itemm.goodsOriginsImageList)
            this.$set(itemm, 'originsDetailId', itemm.id)
            this.$set(itemm, 'id', item.goodsOriginsId)
            this.$delete(itemm, 'goodsOriginsId')
            this.$delete(itemm, 'goodsOriginsImageList')
          })
        })
        // data.forEach(item => {
        //   // ...
        // })
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 获取利润率
     */
    getLiRunLi (item) {
      if (item.sale > 0 && item.purchasePrice > 0 && item.isSale === 1) {
        return ((parseFloat(item.sale) - parseFloat(item.purchasePrice)) / parseFloat(item.sale) * 100).toFixed(2) + '%'
      } else if (item.salePrice > 0 && item.purchasePrice > 0 && item.isSale === 0) {
        return ((parseFloat(item.salePrice) - parseFloat(item.purchasePrice)) / parseFloat(item.salePrice) * 100).toFixed(2) + '%'
      } else {
        return '--'
      }
    },
    /**
     * 按公式计算积分数
     */
    getIntegralPoint () {
      let data = []
      data.push({
        id: this.formData.skuId,
        whetherGetPoint: this.formData.whetherGetPoint,
        whetherSpecial: this.formData.isSale === true ? 1 : 0,
        goodsSpecialPrice: parseFloat(this.formData.sale),
        buyingPrice: parseFloat(this.formData.purchasePrice),
        goodsPrice: parseFloat(this.formData.salePrice)
      })
      let flag = data.every(item => {
        if (item.whetherSpecial === 1) {
          return item.goodsSpecialPrice > 0 && item.buyingPrice > 0 && item.goodsPrice > 0
        } else {
          return item.buyingPrice > 0 && item.goodsPrice > 0
        }
      })
      if (this.formData.whetherGetPoint === 0 && flag === true) {
        this.$http.post('@ROOT_API/goods/getBuySkuGetPointByParam', {
          goodsSkuList: data
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === 1) {
            this.formData.culaPoint = resData.data[0].consumeGetPoint
          }
        }).finally(() => {
        })
      }
    },
    /**
     * 滚动触发锚链接点击事件
     */
    triggerScrollToFun () {
      let windowTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
     // console.log(windowTop)
     // console.log('正在滚动中......')
      let vm = this
      this.liList.forEach((item, index, arr) => {
        let dom = document.getElementById(item.url.substring(1))
        let scrollTop = dom.offsetTop
      //  console.log(scrollTop)
        vm.$set(item, 'scrollTop', scrollTop)
      //  console.log(index > 0 && (item.scrollTop > windowTop > arr[index - 1]))
        if (index === 0 && windowTop < item.scrollTop) {
          vm.catalogName = item.name
        } else if (index > 0 && (item.scrollTop > windowTop > arr[index - 1])) {
          vm.catalogName = item.name
        }
      })
      // document.querySelector().scrollIntoView(true)
    }
  }
}
</script>

<style lang='less' scoped>
.goods-manage-public{
  height: auto;
  /*------目录指引-----*/
  .catalog-info{
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 999;
    font-size: 14px;
    a{
      display: block;
      padding: 10px 25px;
      background: rgb(214,235,255);
      margin-bottom: 5px;
      text-align: center;
      cursor: pointer;
    }
    .active{
      background: #ffffcc;
    }
  }
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
  .flex{
    display: flex;
  }
  .el-table{
    margin: 0;
  }
}
</style>

<style lang="less">
.goods-manage-public{
  .ml-20{
    margin-left: 20px;
  }
  .ml-10{
    margin-left: 10px;
  }
  .ml-40{
    margin-let: 40px;
  }
  .mb-20{
    margin-bottom: 20px;
  }
  .mt-20{
    margin-top: 20px;
  }
  .align-center{
    text-align: center;
  }
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
  .td-padding{
    padding: 20px 10px;
    border-bottom: 1px solid #dcdfe6;
    border-left: 1px solid #dcdfe6;
  }
  .td-title{
    width:140px;
  }
  .td-bg{
    background: #EEF1F9;
  }
  table {
    border: 1px solid #dcdfe6;
    border-left: none;
    border-bottom: none;
    width: 90%;
    margin: 0 0 0 20px;
  }
  .params-data::-webkit-scrollbar{
    width: 6px;
    background-color: transparent;
  }
  .params-data::-webkit-scrollbar-thumb{
    background: rgba(12, 39, 57, 0.3);
    border-radius: 10px;
  }
  .sub-info{
    width: 90%;
    background: rgba(242, 242, 242, 1);
    padding: 10px 0 0 20px;
    border-bottom: 1px solid #dcdfe6;
    margin: 0 0 0 20px;
    .el-form-item{
      margin-bottom: 10px;
    }
  }
  .flex{
    display: flex;
    align-items: center;
  }
  .sub-title{
    border-left: 5px solid #ccc;
    margin-left: 10px;
    margin-bottom: 10px;
    padding-left: 10px;
  }
  .params-data{
    max-height: 465px;
    overflow-y: auto;
    .params-content{
      display: flex;
      flex-direction: row;
    }
    .el-checkbox+.el-checkbox{
      margin-left: 0px;
    }
    .el-checkbox{
      margin: 0 30px 5px 0;
    }
  }
  .large-btn{
    min-width: 150px;
  }
  .region-select-wrap .el-select{
    width: 33.33%;
  }
}
</style>
