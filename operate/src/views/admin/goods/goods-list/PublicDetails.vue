<!-- 商品管理 - sku -->
<template>
  <common-tpl class="pos-r goods-manage-public" footer :collapse="true">
    <!-- 头部 -->
    <template slot="header"></template>

    <!-- 主体内容 -->
    <template slot="main" class="goods-manage-public-box">
      <a id="basicInfo"></a>
      <gray-title title="基本信息"></gray-title><br>

      <el-form :model="formData"  ref="formData" label-width="180px">
        <!-- <el-form-item label="商品类型: " prop="goodsType" class="commodity">
          <el-radio-group border v-model="formData.goodsType">
            <el-radio :label="1">普通商品</el-radio>
            <el-radio :label="2">芯片商品</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <!-- 商品新增 -->
        <el-form-item label="商品类目：" class="commodity">{{formData.platformAttributeValue}}</el-form-item>

        <el-form-item label="商品参数：">
          <template v-if="!platformAttributeListData.length">{{'' | filterEmpty}}</template>
          <template v-else>
            <dl class="goods-spec-wrap" v-for="item in platformAttributeListData" v-if="item.isSelected && item.attributeValList.length">
              <dt class="d-ib">{{item.attributeName}}：</dt>
              <dd class="d-ib">
                <template v-for="list in item.attributeValList">
                  <el-button size="mini" type="primary" style="cursor: default; margin-right: 10px; margin-bottom: 10px;" v-if="list.isSelected">{{list.attributeVal}}</el-button>
                </template>
              </dd>
            </dl>
          </template>
        </el-form-item>

        <!-- 属性值 -->
        <template v-for="(item, index) in platformAttributeList" v-if="parseInt(item.attributeType) === 1">
          <el-form-item :label="item.attributeName + '：'" class="checkbox-item">

            <el-checkbox-group class="d-ib" v-model="platformAttributeSelectList[index].attributeValList">
              <template v-for="(list, i) in item.attributeValList">
                <el-checkbox :label="list.id" border>{{list.attributeVal}}
                  <span class="el-icon-circle-close-outline pos-a close-btn" v-if="parseInt(list.defineSelf) === 1" @click.prevent.stop="handleRemoveParams(item.attributeValList, i, list.id, index)"></span>
                </el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
        </template>

        <div class="commodity-details">
          <el-form-item label="品牌：">{{formData.brandName | filterEmpty}}</el-form-item>

          <el-form-item label="供应商：">{{formData.supplierName | filterEmpty}}</el-form-item>

          <el-form-item label="商品名称：">{{formData.name}}</el-form-item>

          <el-form-item label="商品主图：" class="picture">
            <thumbnail-component :list="formData.uploadMainFileList" :empty="false" :link="true" :auto-delete="false" :styles="{width: '100px', height: '100px'}">
            </thumbnail-component>
            <!-- <template v-if="formData.uploadMainFileList.length">
              <a :href="formData.uploadMainFileList[0].imageUrl | filterImgUrl" target="_blank">
                <img class="cursor-p" width="100px" height="100px" :src="formData.uploadMainFileList[0].imageUrl | filterImgUrl">
              </a>
            </template>
            <template v-else>{{'' | filterEmpty}}</template>
            <el-dialog title="查看大图" :visible.sync="previewMainVisible">
              <img width="100%" :src="dialogMainImageUrl" alt="">
            </el-dialog> -->
          </el-form-item>

          <el-form-item label="商品图片：" class="picture">
            <thumbnail-component :drag="true" :empty="false" :link="true" :list="formData.uploadFileList" :auto-delete="false" move :styles="{width: '100px', height: '100px', 'margin-right': '10px'}">
            </thumbnail-component>
            <!-- <template v-if="formData.uploadFileList.length">
              <a style="margin-right: 10px;" :href="item.imageUrl | filterImgUrl" target="_blank" v-for="item in formData.uploadFileList">
                <img class="cursor-p" width="100px" height="100px" :src="item.imageUrl | filterImgUrl">
              </a>
            </template>
            <template v-else>{{'' | filterEmpty}}</template>
            <el-dialog title="查看大图" :visible.sync="previewVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog> -->
          </el-form-item>

          <el-form-item label="商品视频：" class="video">
            <template v-if="formData.uploadVideoUrl">
              <video class="full-h" :src="formData.uploadVideoUrl | filterImgUrl" controls="controls">您的浏览器不支持 video 标签。</video>
            </template>
            <template v-else>{{'' | filterEmpty}}</template>
          </el-form-item>
          <a id="specificationInfo"></a>

          <gray-title title="规格设置"></gray-title>
          <br>
          <el-form-item label="规格类型：">{{formData.spec === 0 ? '统一规格' : '多规格'}}</el-form-item>

          <!-- 同一规格 -->
          <div v-show="formData.spec === 0">

            <!--            <el-form-item label="条形码：">{{formData.externalNo | filterEmpty}}</el-form-item>

                        <el-form-item label="当前库存：">{{formData.stock}}</el-form-item>-->

            <!-- :required="formData.spec === 0 && formData.examine === 1" -->
            <el-form-item label="进货价：" prop="purchasePrice" style="margin-bottom: 20px;">{{formData.purchasePrice}}
            </el-form-item>
            <!-- :required="formData.spec === 0 && formData.examine === 1" -->
            <el-form-item label="销售价：" prop="salePrice" style="margin-bottom: 20px;">{{formData.salePrice}}
            </el-form-item>
            <el-form-item label="库存：" prop="goodsNum">{{formData.goodsNum}}
            </el-form-item>
            <el-form-item label="利润率：" prop="salePrice">
              {{getLiRunLi(formData)}}
            </el-form-item>
            <!--            <el-form-item label="余额购买：" prop="salePrice">
                          {{getLiRunLi(formData)}}
                        </el-form-item>-->
            <el-form-item label="获得积分：" class="exchange-wrap">
              <el-radio-group v-model="formData.whetherGetPoint" class="pos-a">
                <el-radio :label="0" :disabled="true">公式计算</el-radio>
                <el-radio :label="1" :disabled="true">自定义</el-radio>
              </el-radio-group>
              <el-form-item prop="consumeGetPoint" style="padding-left: 80px;">{{formData.consumeGetPoint}}</el-form-item>

              <!--   <template v-if="formData.whetherGetPoint === 1">
                   <el-form-item prop="consumeGetPoint" style="padding-left: 80px;">{{formData.consumeGetPoint}}</el-form-item>
                 </template>
                 <template v-else>
                   <el-form-item prop="consumeGetPoint" style="padding-left: 80px;">{{formData.culaPoint}}</el-form-item>
                 </template>-->
            </el-form-item>
            <el-form-item label="是否特卖商品：" class="sale-wrap">
              <el-radio-group v-model="formData.isSale" class="pos-a">
                <el-radio :label="0" :disabled="true">否</el-radio>
                <el-radio :label="1" :disabled="true">是</el-radio>
              </el-radio-group>
              <template v-if="formData.isSale === 1">{{formData.sale}}
              </template>
            </el-form-item>


          </div>

          <!-- 多规格 -->
          <div v-show="formData.spec === 1" class="guige-table">
            <template v-for="(item, index) in specList">
              <el-form-item :label="item.standardName + '：'" class="pos-r checkbox-item" v-if="item.isSelected">
                <div class="d-ib" style="line-height: 24px;">
                  <template v-if="list.isSelected" v-for="(list, i) in item.goodsStandarValList">
                    <el-button size="mini" style="cursor: default; margin-bottom: 10px;" type="primary" class="va-t" :label="list" border>{{list.standardValName}}
                    </el-button>
                  </template>
                </div>
              </el-form-item>
            </template>
            <el-form-item label="规格值：">
              <table class="sku-table">
                <tr>
                  <th>默认规格</th>
                  <th v-for="item in skuTitle">{{item}}</th>
                  <th>条形码</th>
                  <th>当前库存</th>
<!--                  <th>调整库存</th>
                  <th>实际库存</th>-->
                  <th>进货价</th>
                  <th>销售价</th>
                  <th>利润率</th>
                  <th>
                    <template v-if="parseInt(formData.getIntegral) === 1">自定义积分</template>
                    <template v-else>按公式获得积分</template>
                  </th>
                  <th>是否特卖</th>
                </tr>
                <tr v-for="item in goodsSkuList" v-if="goodsSkuList.length">
                  <td class="ta-c default-sku-radio">
                    <el-radio v-model="defaultSkuId" :label="item.id" :disabled="true" ></el-radio>
                  </td>
                  <td v-for="list in item.valueList">{{list}}</td>
                  <td>{{item.externalNo}}</td>
<!--                  <td>{{item.currentGoodsNum}}</td>
                  <td>{{item.updateGoodsNum}}</td>-->
                  <td>{{item.goodsNum}}</td>
                  <td>{{item.buyingPrice}}</td>
                  <td>{{item.goodsPrice}}</td>
                  <td>
                    <template v-if="item.goodsPrice && item.buyingPrice && item.whetherSpecial === 0">{{((parseFloat(item.goodsPrice) - parseFloat(item.buyingPrice)) / parseFloat(item.goodsPrice) * 100).toFixed(2)}}%</template>
                    <template v-else-if="item.goodsSpecialPrice && item.buyingPrice && item.whetherSpecial === 1">{{((parseFloat(item.goodsSpecialPrice) - parseFloat(item.buyingPrice)) / parseFloat(item.goodsSpecialPrice) * 100).toFixed(2)}}%</template>
                    <template v-else>{{'' | filterEmpty}}</template>
                  </td>
                  <td>
                    <template>{{item.consumeGetPoint | filterEmpty}}</template>
                    <!--<template v-if="parseInt(item.whetherGetPoint) === 1">{{item.consumeGetPoint | filterEmpty}}</template>
                    <template v-else></template>-->
                  <td>
                    <template v-if="parseInt(item.whetherSpecial) === 1">{{item.goodsSpecialPrice | filterMoney | filterEmpty}}</template>
                    <template v-else>否</template>
                  </td>
                </tr>
                <tr v-else>
                  <td colspan="10">
                    <no-data></no-data>
                  </td>
                </tr>
              </table>
            </el-form-item>
          </div>

          <a id="otherInfo"></a>

          <gray-title title="其它信息"></gray-title><br>
          <!-- 编辑器 -->
          <el-form-item label="详情描述：" prop="details" class="full-w">
            <template v-if="!formData.editorText">{{'' | filterEmpty}}</template>
            <div v-html="formData.editorText" v-else></div>
            <!-- 编辑器 -->
            <!-- <vue-ueditor-wrap v-if="ueditorVisible" ref="ueditor" v-model="formData.editorText" :config="editorConfig" @ready="editorReady" :init="editorInit"></vue-ueditor-wrap> -->
            <!-- <editor-wrap :initData="formData.editorText" @change="editorChange"></editor-wrap> -->
          </el-form-item>

          <a id="productInfo"></a>
          <gray-title title="产品溯源信息"></gray-title><br>
          <section class="ml-40 info-table" >
            <div class="sub-title">区块溯源</div>
            <div class="" style="margin-left: 40px;">
              <span >基本信息</span>
              <table border="0" cellspacing="0" cellpadding="0" class="mt-20 div-tr">
                <tr >
                  <td class="td-padding td-title">交易哈希：</td>
                  <td class="td-padding color-5494EC">{{formData.originsInfo.transactionHash}}</td>
                </tr>
                <tr >
                  <td class="td-padding td-title">发生时间：</td>
                  <td class="td-padding color-5494EC">{{$Utils.filterDate(formData.originsInfo.happenTime)}}</td>
                </tr>
                <tr >
                  <td class="td-padding td-title">提交时间：</td>
                  <td class="td-padding color-5494EC">{{$Utils.filterDate(formData.originsInfo.submitTime)}}</td>
                </tr>
                <tr >
                  <td class="td-padding td-title">产品编号：</td>
                  <td class="td-padding color-5494EC">{{formData.originsInfo.productCode}}</td>
                </tr>
                <tr >
                  <td class="td-padding td-title">业务哈希：</td>
                  <td class="td-padding color-5494EC">{{formData.originsInfo.businessHash}}</td>
                </tr>
              </table>

              <div class="mb-20" v-if="formData.originsBlockRequestList.length > 0">描述信息</div>
              <table border="0" cellspacing="0" cellpadding="0" v-for="(item, index) in formData.originsBlockRequestList" v-if="formData.originsBlockRequestList.length > 0"  :key="index" class="mt-20 div-tr">
                <tr >
                  <td class="td-padding td-title">发生时间：</td>
                  <td class="td-padding color-5494EC">{{$Utils.filterDate(item.happenTime)}}</td>
                </tr>
                <tr>
                  <td class="td-padding td-title">事件描述：</td>
                  <td class="td-padding color-5494EC">{{item.eventDesc}}</td>
                </tr>
              </table>
              <div class="ml-20" v-else>{{'' | filterEmpty}}</div>

              <span v-if="formData.originsInfo">所在区块</span>
              <table border="0" cellspacing="0" cellpadding="0" v-if="formData.originsInfo" class="mt-20 div-tr">
                <tr >
                  <td class="td-padding td-title">区块哈希：</td>
                  <td class="td-padding color-5494EC">{{formData.originsInfo.blockHash}}</td>
                </tr>
                <tr >
                  <td class="td-padding td-title">区块高度：</td>
                  <td class="td-padding color-5494EC">{{formData.originsInfo.blockHeight}}</td>
                </tr>
                <tr >
                  <td class="td-padding td-title">生成时间：</td>
                  <td class="td-padding color-5494EC">{{$Utils.filterDate(formData.originsInfo.generateTime)}}</td>
                </tr>
              </table>
            </div>

            <div class="sub-title mt-20" v-if="formData.originsListData.length > 0">业务流转溯源</div>
            <div class="" style="margin-left: 40px;">
              <div v-for="(item, index) in formData.originsListData" :key="index" class="mt-20 mb-20">
                <div style="margin-bottom: 20px;">{{item.originsName}}</div>
                <table border="0" cellspacing="0" cellpadding="0" class="div-tr"  style="margin: 0;">
                  <tr v-for="(itemChild, indexChild) in item.originsDetailList" :key="indexChild">
                    <td class="td-padding td-title">{{itemChild.infoContent + '：'}}</td>
                    <td class="td-padding color-5494EC">
                      <span v-if="itemChild.infoType !== 2">{{itemChild.originsContent}}</span>
                      <thumbnail-component v-if="itemChild.infoType === 2" :empty="false" :styles="img100" :link="true"  :list="itemChild.goodsOriginsImageList" style="width: 100%;height: 100%;" >
                      </thumbnail-component>
                    </td>
                  </tr>
                </table>
              </div>

              <span v-if="formData.originsIpList.length > 0">最新访问记录</span>
              <table border="0" cellspacing="0" cellpadding="0" class="mt-20 div-tr" v-if="formData.originsIpList.length > 0">
                <tbody style="max-height:300px;width:100%;display:block;overflow-y:auto;">
                <tr style="display: flex">
                  <td class="td-padding td-title" style="width: 33.33%;">序号：</td>
                  <td class="td-padding td-title" style="width: 33.33%;">发生时间</td>
                  <td class="td-padding td-title" style="width: 33.33%;">IP地址</td>
                </tr>
                <tr v-for="(item, index) in formData.originsIpList" :key="index" style="display: flex">
                  <td class="td-padding color-5494EC align-center" style="width: 33.33%;">{{index+1}}</td>
                  <td class="td-padding color-5494EC align-center" style="width: 33.33%;">{{$Utils.filterDate(formData.originsInfo.happenTime)}}</td>
                  <td class="td-padding color-5494EC align-center" style="width: 33.33%;">{{item.ipAdress}}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <div class="sub-title mt-20">企业基本信息</div>
            <div class="" style="margin-left: 40px;">
              <table border="0" cellspacing="0" cellpadding="0" class="mt-20 div-tr">
                <tr >
                  <td class="td-padding td-title">生产商名称：</td>
                  <td class="td-padding color-5494EC">{{formData.enterpriseName}}</td>
                </tr>
                <tr >
                  <td class="td-padding td-title">生产商地址：</td>
                  <td class="td-padding color-5494EC">{{formData.enterpriseAddress}}</td>
                </tr>
                <tr >
                  <td class="td-padding td-title">生产商电话：</td>
                  <td class="td-padding color-5494EC">{{formData.enterprisePhone}}</td>
                </tr>
                <tr >
                  <td class="td-padding td-title">官网链接：</td>
                  <td class="td-padding color-5494EC">{{formData.website}}</td>
                </tr>
              </table>

              <table border="0" cellspacing="0" cellpadding="0" v-if="formData.enterpriseSpotImg" class="mt-20 div-tr">
                <tr >
                  <td class="td-padding td-title">企业实地信息</td>
                </tr>
                <tr >
                  <td class="td-padding td-content">
                    <template v-if="!formData.enterpriseSpotImg">{{'' | filterEmpty}}</template>
                    <div v-html="formData.enterpriseSpotImg" v-else></div>
                  </td>
                </tr>
              </table>
            </div>
          </section>

          <!-- <el-form-item label="排序：">{{formData.sort}}</el-form-item> -->
          <!-- <el-form-item label="运费设置：">{{formData.freight === 0 ? '包邮' : '到付'}}</el-form-item> -->

          <el-form-item label="关 键 词：">{{formData.keyWords}}
          </el-form-item>

        </div>
      </el-form>
      <div class="clear"></div>
    </template>

    <template slot="other">


      <!--目录指引-->
      <div class="catalog-info">
        <a v-for="(item,index) in liList" :key="index" :class="{ 'active': item.name === catalogName}" @click="scrollTo(item.name, item.url)">
          {{item.name}}
        </a>
      </div>

    </template>

    <!-- 折叠 -->
    <template slot="collapse">
      <el-form label-width="120px" class="examine-results-form">
        <el-form-item label="审核结果：">
          <el-radio-group v-model="formData.examine" >
            <el-radio :label="1" :disabled="true">审核通过</el-radio>
            <el-radio :label="2" :disabled="true">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="formData.examine === 1" >
          <el-form-item label="是否上架：" >
            <el-radio-group v-model="formData.goodsState">
              <el-radio :label="1" :disabled="true">是</el-radio>
              <el-radio :label="0" :disabled="true">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否推荐商品：" >
            <el-radio-group v-model="formData.recommend" >
              <el-radio :label="1" :disabled="true">是</el-radio>
              <el-radio :label="0" :disabled="true">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item label="不通过原因：" v-if="formData.examine === 2">{{formData.examineErrMsg}}
        </el-form-item>
      </el-form>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button @click="$router.back()">返 回</el-button>
      <!--
            <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">提交审核</el-button>
      -->
    </template>
  </common-tpl>
</template>

<script>
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import SkuWrap from './Sku'
  export default {
    components: {
      VueUeditorWrap,
      SkuWrap
    },
    data () {
      return {
        img100: {width: '100px', height: '100px'}, // 图片大小
        liList: [{name: '基本信息', url: '#basicInfo'}, {name: '规格设置', url: '#specificationInfo'}, {name: '其它信息', url: '#otherInfo'}, {name: '产品溯源信息', url: '#productInfo'}],
        catalogName: '基本信息',       // 当前目录名称
        confirmLoading: false,        // 确认loading
        pageType: 0,                  // 页面类型［0、商品管理，1、商品审核］
        pageStatus: '',               // 商品管理:［0、待审核，1、审核通过，2、审核驳回］;   商品审核:［0、待审核，1、审核通过，2、审核不通过］
        detailsData: {},              // 详情数据
        addAttributeVisible: false,   // 添加参数
        addType: 1,                   // 添加类型 [1、参数，2、规格]
        defaultSkuId: '',             // 默认sku
        goodsSkuList: [],             // sku
        formData: {
          getIntegral: '',
          originsListData: [],              // 溯源信息集合
          originsIpList: [],                // 最新访问记录
          originsBlockRequestList: [],      // 区块溯源集合
          originsInfo: {
            transactionHash: '',
            happenTime: '',
            submitTime: '',
            productCode: '',
            businessHash: '',
            blockHash: '',
            blockHeight: '',
            generateTime: ''
          },                     // 区块溯源集合-基本信息
          enterpriseName: '',                  // 生产商名称
          enterpriseAddress: '',               // 地址
          enterprisePhone: '',                 // 电话
          website: '',                         // 网址
          enterpriseSpotImg: '',               // 实地信息
          platformTypeId: '',                         // 商品分类id
          // ...
          goodsId: '',                // 商品id
          goodsType: 1,               // 商品类型
          platformAttributeValue: '', // 属性分类
          classifySelectValue: '',    // 商品分类结果
          brandId: '',                // 品牌id
          brandName: '',              // 品牌名称
          supplierName: '',           // 供应商
          name: '',                   // 商品名称
          code: '',                   // 商品编码
          purchasePrice: '',          // 进货价
          salePrice: '',              // 销售价
          goodsNum: '',              // 库存
          salePriceDefault: '',       // 默认销售价
          isSale: 0,                  // 是否特卖
          sale: '',                   // 特卖价格
          isExchange: 0,              // 是否积分兑换
          exchange: '',               // 积分兑换分数
          whetherGetPoint: 0,         // 是否获得积分
          consumeGetPoint: 0,             // 获得积分数
          culaPoint: 0,                // 按公式获得积分
          fileList: [],               // 默认显示图片列表
          uploadMainFileList: [],     // 上传商品主图列表
          uploadFileList: [],         // 上传图片列表
          uploadVideoUrl: '',         // 视频地址
          editorText: '',             // 商品详情/编辑器内容
          recommend: 1,               // 推荐
          sort: '',                   // 排序
          spec: 0,                    // 商品规格 [0、统一规格，1、多规格]
          stock: '',                  // 库存
          createAttributeName: '',    // 参数名称
          createAttributeValue: '',   // 参数值
          discount: '',               // 成本平均折扣
          skuResults: [],             // sku结果集
          skuId: '',                  // sku编辑时id
          externalNo: '',             // 条形码
          freight: '',                // 运费设置
          examine: 1,                 // 审核结果
          examineErrMsg: '',          // 审核不通过原因
          goodsState: 1,              // 是否上架
          keyWords: ''                // 关键词
        },
        dialogMainImageUrl: '',       // 商品主图路径
        dialogImageUrl: '',           // 上传图片路径
        previewMainVisible: false,    // 商品主图预览弹窗
        previewVisible: false,        // 预览弹窗
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
        platformAttributeListData: [],    // 平台选中列表数据
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
        skuTitle: [],             // sku标题
        specTableData: [],        // 规格表格数据
        specSelectList: [],       // 规格选择列表
        // specSelectList: [{specValList: []}],       // 规格选择列表
        specList: [],             // 规格列表
        // specList: [{specName: 'ces', specValList: [], specVal: ''}],             // 规格列表
        userInfo: {},             // 用户信息
        assignSkuData: []        // sku列表数据
      }
    },
    computed: {},
    mounted () {
      this.copyPlatformAttributeData = this.$Utils.deepCopy(this.platformAttributeData)
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.formData.goodsId = parseInt(this.$route.query.id) || ''
      this.formData.platformTypeId = parseInt(this.$route.query.platformTypeId) || ''
      this.getDetailsData()
      // this.getOriginsListByParam()    // 获取溯源信息
      this.getEditSpecList()          // 获取规格信息
      this.$refs['formData'].resetFields()
    },
    methods: {
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
      getIntegralPoint (type, list) {
        let data = []
        list.forEach(item => {
          data.push({
            id: item.id,
            whetherGetPoint: item.whetherGetPoint,
            whetherSpecial: item.whetherSpecial === true ? 1 : 0,
            goodsSpecialPrice: parseFloat(item.goodsSpecialPrice),
            buyingPrice: parseFloat(item.buyingPrice),
            goodsPrice: parseFloat(item.goodsPrice)
          })
        })
        if (type === 0) {
          this.$http.post('@ROOT_API/goods/getBuySkuGetPointByParam', {
            goodsSkuList: data
          }).then((res) => {
            let resData = res.data
            if (parseInt(resData.status) !== 1) {
              return false
            }
            list.forEach(item => {
              this.$set(item, 'culaPoint', '')
              resData.data.forEach(itemm => {
                if (item.id === itemm.id) {
                  item.culaPoint = itemm.consumeGetPoint
                }
              })
            })
          }).finally(() => {
          })
        }
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
          this.getOriginsListByParam(detailsData.platformTypeId)    // 获取溯源信息

          this.formData.brandId = detailsData.brandId                   // 品牌名称
          this.formData.brandName = detailsData.brandName               // 品牌名称
          this.formData.supplierName = detailsData.supplierName         // 供应商
          this.formData.name = detailsData.goodsName                    // 商品名称
          this.formData.code = detailsData.goodsNo                      // 商品编码
          this.goodsSkuList = detailsData.goodsSkuList
          this.getIntegralPoint(this.goodsSkuList[0].whetherGetPoint, this.goodsSkuList)
          // 统一规格
          if (detailsData.multStandard === 0) {
            let skuObj = this.goodsSkuList[0]

            this.formData.skuId = skuObj.id

            this.formData.purchasePrice = skuObj.buyingPrice         // 进货价

            this.formData.salePrice = skuObj.goodsPrice              // 销售价
            this.formData.goodsNum = skuObj.goodsNum              // 库存

            this.formData.isSale = skuObj.whetherSpecial             // 是否特卖
            this.formData.sale = skuObj.goodsSpecialPrice            // 特卖价格

            this.formData.stock = skuObj.goodsNum

            this.formData.isExchange = skuObj.whetherPoints          // 积分兑换
            this.formData.exchange = skuObj.points                   // 积分

            this.formData.externalNo = skuObj.externalNo

            this.formData.whetherGetPoint = skuObj.whetherGetPoint
            this.formData.consumeGetPoint = skuObj.consumeGetPoint
            this.formData.culaPoint = skuObj.culaPoint
          } else {
            this.formData.getIntegral = this.goodsSkuList[0].whetherGetPoint
            this.getIntegralPoint(this.formData.getIntegral, this.goodsSkuList)
            let filterDefaultSku = this.goodsSkuList.filter(row => parseInt(row.whetherDefaultSku) === 1)
            this.goodsSkuList.forEach((row, index) => {
              row.valueList = []
              row.goodsSkuValList.forEach((list) => {
                row.valueList.push(list.standardValName)
                if (index === 0) this.skuTitle.push(list.standardName)
              })
              // 选中默认sku
              if (!this.defaultSkuId && parseInt(row.disStatus) === 0 && (!filterDefaultSku.length || (filterDefaultSku.length && parseInt(filterDefaultSku[0].disStatus) === 1) || row.whetherDefaultSku === 1)) this.defaultSkuId = row.id
              this.inpBlur(row, 'buyingPrice')
              this.inpBlur(row, 'goodsPrice')
            })
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
          if (detailsData.mainImage) this.formData.uploadMainFileList.push({url: this.$Utils.filterImgUrl(detailsData.mainImage), imageUrl: detailsData.mainImage})
          this.formData.uploadFileList = detailsData.imageList          // 上传图片列表
          this.formData.editorText = detailsData.remark                 // 商品详情/编辑器内容
          this.formData.recommend = detailsData.whetherRecommend        // 推荐
          this.formData.sort = detailsData.goodsSort                    // 排序
          this.formData.spec = detailsData.multStandard
          this.assignSkuData = detailsData.goodsSkuList || []

          this.formData.keyWords = detailsData.keyWords || ''
          this.formData.originsBlockRequestList = detailsData.originsBlockList        //  区块溯源集合
          if (detailsData.originsInfo !== null && detailsData.originsInfo !== '') this.formData.originsInfo = detailsData.originsInfo        //  区块溯源--基本信息
          this.formData.originsIpList = detailsData.originsIpList        //  溯源信息--最新访问记录

          //  企业信息
          if (detailsData.origisnEnterprise !== null && detailsData.origisnEnterprise !== '') {
            this.formData.enterpriseName = detailsData.origisnEnterprise.enterpriseName
            this.formData.enterprisePhone = detailsData.origisnEnterprise.enterprisePhone
            this.formData.website = detailsData.origisnEnterprise.website
            this.formData.enterpriseSpotImg = detailsData.origisnEnterprise.enterpriseSpotImg
            this.formData.enterpriseAddress = detailsData.origisnEnterprise.province + detailsData.origisnEnterprise.city + detailsData.origisnEnterprise.zone + detailsData.origisnEnterprise.enterpriseAddress
          }
        }).finally(() => {
          setTimeout(() => {
            this.ueditorVisible = true
          }, 300)
        })
      },
      /**
       * 价格输入框自动补全价格
       */
      inpBlur (obj) {
        this.$Utils.blurAutoCompletion(this.formData, obj)
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
          // this.platformAttributeList = resData.data
          // resData.data.forEach((row) => {
          //   let tempObj = {
          //     id: row.id,
          //     attributeType: row.attributeType,
          //     attributeValList: []
          //   }
          //   row.attributeValList.forEach((list) => {
          //     if (list.isSelected) tempObj.attributeValList.push(list.id)
          //   })
          //   this.platformAttributeSelectList.push(tempObj)
          // })
          let flag = false
          resData.data.forEach((row) => {
            row.attributeValList.forEach((list) => {
              if (list.isSelected) {
                row.isSelected = true
                flag = true
              }
            })
          })
          this.platformAttributeListData = flag === true ? resData.data : []
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

      // -------------------------------------------------   以下方法新功能新增   ----------------------------------------
      /**
       * 锚链接跳转,不更改路由
       */
      scrollTo (name, url) {
        document.querySelector(url).scrollIntoView(true)
        this.catalogName = name
      },
      /**
       * 获取商品溯源信息
       */
      getOriginsListByParam (value) {
        this.$http.post('@ROOT_API/goods/getOriginsListByParam', {
          attributeTypeId: value,
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
       * 查询所有规格列表  ( 2019-3-4 改为post请求 )
       */
      getEditSpecList () {
        this.$http.post('@ROOT_API/standard/getStandardByGoodsId', {
          goodsId: this.goodsId
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
          results.forEach((row) => {
            if (row.goodsStandarValList && row.goodsStandarValList.length) {
              row.goodsStandarValList.forEach((list) => {
                if (list.isSelected) row.isSelected = true
              })
            }
          })
          this.specList = results
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  .goods-manage-public{
    .guige-table{
      table{
        width: 100%;
        border: 1px solid #f1f4f7;
        border-collapse: collapse;
        margin-bottom: 20px;
        th{
          text-align: center;
        }
        td{
          border-bottom: 1px solid #f1f4f7;
          font-size: 15px;
          padding: 20px 10px;
          text-align: center;
        }
        td:nth-child(even) {
          color: #333;
        }
      }
    }
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
    .mr-20{
      margin-right: 20px;
    }
    /*-------------------------目录指引-------------------------*/
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
    .td-content{
      width: 100%;
    }
    .td-padding{
      font-size: 14px;
      padding: 10px 10px;
      border-bottom: 1px solid #dcdfe6;
      border-left: 1px solid #dcdfe6;
    }
    .td-title{
      text-align: center;
      width:140px;
      background: #c1e0ff;
    }
    .color-5494EC{
      color: #5494EC;
    }
    .align-center{
      text-align: center;
    }
    .flex{
      display: flex;
    }
    .info-table{
      .div-tr {
        border: 1px solid #dcdfe6;
        border-left: none;
        border-bottom: none;
        width: 80%;
        margin-bottom: 20px;
      }
    }
    // ----------------------------------------------------------------以上为新添加样式-----------------------------------
    .el-form-item{
      margin-bottom: 10px;
      position: relative;
      box-sizing: border-box;

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

      .el-input{
        width: 400px;
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
      border: 1px solid #ccc;
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

    /* -------------------- { 底部审核结果表单 } -------------------- */
    .examine-results-form{
      padding-bottom: 10px;
      .el-form-item{
        margin-bottom: 5px;
      }
    }

    /*.examine-results-form.visible{
      height: auto;
    }*/
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

    .default-sku-radio{
      .el-radio__label{
        display: none;
      }
    }
  }
</style>
