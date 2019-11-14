<!-- 社群运营 - 拼团/促销转化 - 限时特卖 -->
<template>
  <common-tpl class="assemble-Index-wrap" footer back>
    <template slot="main">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="152px">
         <gray-title title="主题设置"></gray-title>

        <!-- 主题设置 -->
        <div class="commodity-details pos-r">
          <el-form-item :label="this.flashType === 1 ? '拼团主题' : '活动名称'" prop="themeName">
            <el-input v-model="formData.themeName" placeholder="限50个字符以内" maxlength="50"></el-input>
          </el-form-item>
          <template v-if="this.flashType === 2">
            <el-form-item label="活动副标题">
              <el-input v-model="formData.introduce" placeholder="限30个字符以内" maxlength="30"></el-input>
            </el-form-item>
          </template>
          <template v-if="this.flashType === 1">
            <el-form-item label="广告位图片" prop="themeImgList" class="full-w picture">
              <thumbnail-component :empty="false" :list="formData.themeImgList" del :auto-delete="true" :styles="{width: '100px', height: '100px'}">
                <template slot="other">
                  <upload-component :styles="{width: '100px', height: '100px'}" @success="uploadSuccessHandle" v-if="!formData.themeImgList.length"></upload-component>
                  <div class="pos-a tips">
                    <p>建议尺寸：100 * 100px</p>
                    <p>建议大小：100KB以内</p>
                  </div>
                </template> 
              </thumbnail-component>
            </el-form-item>
            <el-form-item label="拼团介绍" prop="introduce" class="introduce pos-r">
              <el-input type="textarea" :rows="6" maxlength="500" v-model="formData.introduce"></el-input>
              <span class="d-ib pos-a word-count">({{formData.introduce ? formData.introduce.length : 0}}/500)</span>
            </el-form-item>
           <el-form-item label="主题背景" prop="themeBgList" class="full-w picture">
              <thumbnail-component :empty="false" :list="formData.themeBgList" del :auto-delete="true" :styles="{width: '100px', height: '100px'}">
                <template slot="other">
                  <upload-component :styles="{width: '100px', height: '100px'}" @success="uploadThemeHandle" v-if="!formData.themeBgList.length"></upload-component>
                  <div class="pos-a tips">
                    <p>建议尺寸：100 * 100px</p>
                    <p>建议大小：100KB以内</p>
                  </div>
                </template>
              </thumbnail-component>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="formData.status">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="2">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-if="flashType === 2">
            <el-form-item label="活动时间：" class="pos-r apply-date-wrap" prop="activitysDate">
              <div class="block"><span class="demonstration"></span>
                <el-date-picker v-model="formData.activitysDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item style="padding-left: 162px" class="activity-time">
              <!-- <el-checkbox-group v-model="formData.cycle">
                <el-checkbox label="按周期重复" name="type"></el-checkbox>
              </el-checkbox-group> -->
              <div>
                <el-radio :label="8" v-model="formData.resource" @change="cycleChange">每天</el-radio>
                &nbsp;&nbsp;
                &nbsp;&nbsp;
                <el-time-picker size="small" v-model="formData.dailyTime" is-range start-placeholder="开始时间" end-placeholder="结束时间" :clearable="false" :disabled="formData.resource !== 8"></el-time-picker>
              </div>
              <div class="week-time">
                <el-radio :label="9" class="fl-l" v-model="formData.resource" @change="cycleChange">每周</el-radio>
                <el-checkbox-group v-model="formData.week" :min="1" class="fl-l" @change="weekChange">
                  <el-checkbox :label="parseInt(key.charAt(3))" :disabled="formData.resource !== 9" v-for="(week, key) in weekJson">{{week}}</el-checkbox>
                </el-checkbox-group>
                &nbsp;&nbsp;
                <el-time-picker size="small" v-model="formData.dailyTime" is-range start-placeholder="开始时间" end-placeholder="结束时间" :disabled="formData.resource !== 9" :clearable="false"></el-time-picker>
              </div>
             <!--  <template v-if="formData.cycle === true" style="padding-left: 162px">
              </template> -->
            </el-form-item>
           <!--  <el-form-item label="限购：" prop="restrictNum" class="limit-wrap">
              <span class="limit">每个用户限购</span>
              <el-input v-model="formData.restrictNum" placeholder="限6个字符以内" maxlength="6" class="limit-input"></el-input>
              <span class="limit">件</span>
            </el-form-item> -->
            <el-form-item label="是否启用">
              <el-radio-group v-model="formData.ifEnable">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </div>
        <br>
        <!-- :disabled="!listRightRes.length" -->

        <!-- 商品设置 -->
        <gray-title title="商品设置">
          <el-button slot="right" size="small" type="primary" round style="margin-top: -15px; right: 7px; top: 50%;" class="pos-a" @click="relationVisible = true" :disabled="assembleType !== 2"><i class="el-icon-plus"></i> <template v-if="assembleType !== 2">
          {{'添加拼团商品'}}</template><template v-else>{{'添加商品'}}</template></el-button>
        </gray-title>
        <br>
        <el-table border :data="formData.goodsList" class="full-w">
          <el-table-column prop="mainImage" label="商品图片" min-width="100">
            <template slot-scope="scope">
              <thumbnail-component :list="[{url: scope.row.mainImage}]" :size="50"></thumbnail-component>
            </template>
          </el-table-column>
          <template v-if="flashType === 1">
            <el-table-column prop="brandName" label="品牌" min-width="120">
              <template slot-scope="scope">
                <div class="truncate">{{scope.row.brandName | filterEmpty}}</div>
              </template>
            </el-table-column>
          </template>
          <el-table-column prop="goodsNo" label="商品编码">
            <template slot-scope="scope">
              <div class="truncate">{{scope.row.goodsNo | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称" >
            <template slot-scope="scope">
              <div class="truncate">{{scope.row.goodsName | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="buyingPrice" label="进货价（元）">
            <template slot-scope="scope">
              <div class="truncate">{{scope.row.buyingPrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsPrice" label="销售价（元）">
            <template slot-scope="scope">
              <div>{{scope.row.goodsPrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <template v-if="flashType === 1">
            <el-table-column prop="goodsGroupPrice" label="拼团价（元）">
              <template slot-scope="scope">
                <div>{{scope.row.goodsGroupPrice | filterMoney | filterEmpty}}</div>
              </template>
            </el-table-column>
          </template>
          <el-table-column prop="" label="利润率">
            <template slot-scope="scope">{{filterProfitMargin(scope.row) | filterEmpty('%')}}</template>
          </el-table-column>
         <!--  <template v-if="this.flashType === 2">
            <el-table-column label="是否必抢">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status == 1 ? true : false"
                  @change="changeStatus($event,scope.row)">
                </el-switch>
                {{scope.row.status === 1 ? '是' : '否'}}</template>
            </el-table-column>
          </template> -->
          <template v-if="flashType === 2">
            <el-table-column prop="" label="设置秒杀价">
              <template slot-scope="scope">
                <span class="batch d-ib" @click="batchSetupBefore(scope.row)">设置秒杀价</span>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="排序" min-width="60">
            <template slot-scope="scope">
              <div class="pos-r sort-wrap" style="padding-right: 20px;">
                <el-form-item class="d-ib" :prop="'goodsList.' + scope.$index + '.sort'" :rules="ruleSort">
                  <el-input size="medium" min="0" maxlength="3" v-model="scope.row.sort" @change="contentChange"></el-input>
                </el-form-item>
                <span style="width: 14px; height: 35px; position: absolute; right: 5px; top: 0px;">
                  <i class="pos-a el-icon el-icon-caret-top" :class="{'cursor-p': scope.$index !== 0}" @click="handleSortUp(scope.$index)" :disabled="scope.$index !== 0"></i>
                  <i class="pos-a el-icon el-icon-caret-bottom" style="bottom: 0;" :class="{'cursor-p': scope.$index !== formData.goodsList.length - 1}" @click="handleSortDown(scope.$index)" :disabled="scope.$index !== formData.goodsList.length - 1"></i>
                </span>
              </div>
            </template>
          </el-table-column>
          <template v-if="flashType === 1">
            <el-table-column fixed="right" label="操作" width="60">
              <template slot-scope="scope">
                <el-dropdown class="d-b">
                  <div class="ta-c d-b el-dropdown-link">
                    <span class="d-b va-m">...</span>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="assembleType === 2">
                      <el-dropdown-item>
                        <div @click="handleLink(scope.row, 'setting')"><i class="icon el-icon-setting"></i>设置</div>
                      </el-dropdown-item>
                    </template>
                    <el-dropdown-item>
                      <div @click="handleLink(scope.row, 'details')"><i class="icon el-icon-view"></i>详情</div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="handleDeleteBefore(scope.row)" class="orange"><i class="icon el-icon-delete"></i>取消</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div slot="empty">
          <no-data></no-data>
        </div>
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

      </el-form>
    </template>

    <template slot="other">
      <el-dialog title="取消分享" :visible.sync="deleteVisible" width="480px">
        <br>
        <span>{{'取消拼团分享？'}}</span>
        <br>
        <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" :loading="deleteLoading" @click="handleDelete">确 定</el-button>
        </span>
      </el-dialog>

       <!-- 关联商品 -->
      <el-dialog title="关联商品" :visible.sync="relationVisible" width="1100px">
        <!-- 关联商品组件 -->
        <relation-goods :key="relationGoodsKey" :relationId="parseInt(formData.themeId)" :relationType="5" relationUrl="shareTheme/getShareThemeGoodsPage" @change="relationDataChange" @add="addRelationData" @remove="removeRelationData"></relation-goods>
      </el-dialog>

      <!-- 设置秒杀价 -->
      <el-dialog title="设置秒杀价" :visible.sync="setUpVisible" class="dialog-set-up" :key="Math.random()">
        <el-form :model="formData" :rules="rules" ref="form-dialog" label-width="152px">
          <!-- 高级搜索组件 -->
          <high-search @search="searchHandle" :textVisible = "false">
            <span slot="edit" class="goods-code">商品编码 : {{currentGoods.goodsNo}}</span>
            <div class="pos-r" slot="search">
              <el-input placeholder="输入SKU编码/规格值" v-model.trim="formData.search" @keyup.enter.native="searchHandle"></el-input>
              <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
            </div>
          </high-search>
          <el-table border :data="formData.goodsSkuList" class="el-sku-table">
            <el-table-column label="默认规格" width="80px" align="center">
              <template slot-scope="scope">
                <el-radio v-model="defaultSkuId" :label="scope.row.id" class="di-n"></el-radio>
              </template>
            </el-table-column>

            <el-table-column :label="item" min-width="100px" :key="index" v-for="(item, index) in skuTitleList">
              <template slot-scope="scope">
                <template v-if="scope.row.goodsSkuValList.length">{{scope.row.goodsSkuValList[index].standardValName}}</template>
              </template>
            </el-table-column>

            <el-table-column label="SKU编码" min-width="150px">
              <template slot-scope="scope">{{scope.row.skuNo | filterEmpty}}</template>
            </el-table-column>
            <el-table-column label="实际库存" min-width="100px">
              <template slot-scope="scope">{{scope.row.goodsNum | filterEmpty}}</template>
            </el-table-column>
            <el-table-column label="进货价" min-width="100px">
              <template slot-scope="scope">{{scope.row.buyingPrice | filterMoney}}</template>
            </el-table-column>
            <el-table-column label="销售价" min-width="100px">
              <template slot-scope="scope">{{scope.row.goodsPrice | filterMoney}}</template>
            </el-table-column>
            <el-table-column label="利润率（利润/成交价）" width="100px" :key="Math.random()" align="center">
              <template slot-scope="scope">{{filterProfitMargin(scope.row) | filterEmpty('%')}}</template>
            </el-table-column>

            <el-table-column label="设置秒杀价" width="180px" :key="Math.random()">
              <template slot-scope="scope">
                <template v-if="pageType === 1">
                  <div class="pos-r" :class="{'pd-l': pageType === 1, 'pd-r': pageType === 1}">
                    <el-form-item label-width="0" :prop="'goodsSkuList.' + scope.$index + '.goodsFlashSalePrice'" :rules="goodsFlashSalePrice"  style="width: 80%; float: left;">
                      <el-input size="medium" v-model="scope.row.goodsFlashSalePrice" v-auto-price></el-input>
                    </el-form-item>
                    <ali-icon icon="icon-jiantou3" :size="30" title="一键同步" class="cursor-p pos-a sync-btn" @click.native="handleSync('goodsFlashSalePrice', scope.$index)" v-if="scope.$index === 0"></ali-icon>
                  </div>
                </template>
                <template v-else>{{scope.row.ifGoodsFlashSalePrice ? scope.row.goodsFlashSalePrice : '否'}}</template>
              </template>
            </el-table-column>


            <el-table-column label="设置限购件数" width="180px" :key="Math.random()">
              <template slot-scope="scope">
                <template v-if="pageType === 1">
                  <div class="pos-r" :class="{'pd-r': pageType === 1}">
                    <el-form-item label-width="0" :prop="'goodsSkuList.' + scope.$index + '.limitBuyNum'" :rules="ruleGoodsAssemblePrice"  style="width: 80%; float: left;">
                      <el-input size="medium" v-model="scope.row.limitBuyNum" maxlength="6"></el-input>
                    </el-form-item>
                    <ali-icon icon="icon-jiantou3" :size="30" title="一键同步" class="cursor-p pos-a sync-btn" @click.native="handleSync('limitBuyNum', scope.$index)" v-if="scope.$index === 0"></ali-icon>
                  </div>
                </template>
                <template v-else>{{scope.row.ifGoodsGroupPrice ? scope.row.limitBuyNum : '否'}}</template>
              </template>
            </el-table-column>

            <!-- 暂无数据 -->
            <template slot="empty">
              <no-data></no-data>
            </template>
          </el-table>

          <el-button @click="setUpVisible = false">取 消</el-button>
          <el-button type="primary" :loading="deleteLoading" @click="handleSale('form-dialog')">确 定</el-button>
        </el-form>
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">保存</el-button>
    </template>
  </common-tpl>
</template>

<script>
import RelationGoods from '@/components/public/RelationGoods'
import RegionSelect from '@/components/utils/RegionSelect'
export default {
  components: {RegionSelect, RelationGoods},
  data () {
    // 校验正整数
    let validateInt = (rule, value, callback) => {
      if (value && (isNaN(value) || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('请输入正数'))
      callback()
    }

    // 校验排序
    let validateSort = (rule, value, callback) => {
      if (value && (isNaN(value) || value < 0 || value > 255)) return callback(new Error('限制0~255正整数'))
      callback()
    }

    // 校验分佣比例
    let validatMmaidRatio = (rule, value, callback) => {
      if (value) {
        if (isNaN(value) || value > 100) return callback(new Error('0-100数字，可精确到百分位'))
        callback()
      }
      callback()
    }

    // 校验分佣级数
    let validatMmaidLevels = (rule, value, callback) => {
      if (value) {
        if (isNaN(value) || value < 0 || value > 10 || !value.toString().match(/^\d{0,2}$/gi)) return callback(new Error('0-10的正整数'))
      }
      callback()
    }

    // 校验限购
    let validateLimit = (rule, value, callback) => {
      if (!value && parseInt(value) !== 0) return callback(new Error('限购不能为空'))
      if (isNaN(value) || !value.toString().match(/^\d{0,6}$/gi)) return callback(new Error('请输入正整数'))
      callback()
    }

    // 校验特卖价
    let validateSpecialOfferPrice = (rule, value, callback) => {
      let num = rule.field.split('.')[1]
      if (!value) return callback(new Error('请输入秒杀价'))
      if (value) {
        if (!value.toString().match(/^\d/gi)) return callback(new Error('请输入正确的数值'))
        // if (!value.toString().match(/^\d+\.\d{2}$/gi)) return callback(new Error('请输入正确价格'))
        if (this.formData.goodsSkuList[num].goodsPrice < value) return callback(new Error('分享价不能大于销售价'))
        callback()
      }
      callback()
    }

    return {
      confirmLoading: false,      // 确定loading
      pageType: 1,                // 页面类型 [1、新增 2、编辑]
      flashType: 1,               // 页面类型 [1, 拼团 2, 限时特卖]
      setUpVisible: false,         // 设置弹窗
      setUpListData: [
        {name: '11111'}
      ],          // 设置特卖价表单
      assembleType: '',           // 拼团状态
      firstDate: '',              // 时间开始
      endDate: '',                // 时间结束
      formData: {
        themeId: '',              // 主题id
        id: '',                   // id
        themeType: 1,             // 主题类型
        themeName: '',            // 品牌名称
        disseminateType: 1,       // 宣传内容 [0,广告位 1,宣传素材]
        materialName: '',         // 素材名称
        materialId: '',           // 素材id
        status: 1,
        themeImgList: [],         // 上传广告位图片列表
        themeImg: '',             // 上传广告位图片地址
        themeBgList: [],          // 上传主题列表
        themeBg: '',              // 上传主题背景地址
        introduce: '',            // 分享介绍

        // 限时特卖
        activitysDate: [],        // 活动时间
        // activityStarts: '',    // 活动时间开始
        // activityEnds: '',      // 活动时间结束
        cycle: true,              // 按周期重复
        resource: 8,              // 选择周期
        dailyTime: [],            // 每天开始
        week: [],                 // 周期重复
        restrictNum: '',          // 限购
        ifEnable: 1,              // 是否启用
        sort: '',
        goodsList: [],            // 商品列表
        maidRatio: '',            // 分佣比例
        maidLevels: '',           // 分佣级别
        requirement: [],          // 参与要求
        goodsSkuList: []          // sku列表
      },
      copyWeek: [],
      weekJson: {
        key1: '周一',
        key2: '周二',
        key3: '周三',
        key4: '周四',
        key5: '周五',
        key6: '周六',
        key0: '周日'
      },
      materialListData: [],       // 素材列表
      relationGoodsKey: '',       // 关联商品标识符
      buySourceId: '',            // 宣传素材，disseminateType=2时必填
      rules: {
        // 栏目名称
        themeName: [{ required: true, message: '请输入分享主题', trigger: 'blur' }],
        // 广告位图片
        themeImgList: [{ required: true, type: 'array', message: '请上传广告位图片', trigger: 'change' }],
        // 分享介绍
        introduce: [{ required: true, message: '请输入分享介绍', trigger: 'blur' }],
        // 主题背景
        themeBgList: [{ required: true, type: 'array', message: '请上传主题背景', trigger: 'change' }],
        // 邀请人收益
        ticketNum: [{required: true, validator: validateInt, trigger: 'blur'}],
        activitysDate: [{ type: 'array', required: true, message: '请选择日期', trigger: 'change' }],
        restrictNum: [{required: true, validator: validateLimit, trigger: 'change'}],    // 校验限购
        maidRatio: [{validator: validatMmaidRatio, trigger: 'blur'}],
        maidLevels: [{validator: validatMmaidLevels, trigger: 'blur'}]
      },
      ruleGoodsAssemblePrice: [{validator: validateLimit, trigger: 'blur'}],        // 限购
      goodsFlashSalePrice: [{validator: validateSpecialOfferPrice, trigger: 'blur'}],    // 校验秒杀价
      ruleSort: [{validator: validateSort, trigger: 'blur'}],
      copyFormData: {},       // 拷贝表单数据
      relationVisible: false, // 关联商品弹窗
      relationListData: [],   // 关联数据
      tableData: [],          // 列表
      deleteLoading: false,   // 弹窗loading
      deleteVisible: false,   // 取消分享弹窗
      deleteData: {},         // 取消分享数据
      // getIdByInitData: {},    // 新增拼团id
      onPickDate: '',         // 时间控件点击,
      skuTitleList: [],       // sku标题
      defaultSkuId: '',       // 默认sku
      currentGoods: {},       // 当前操作商品对象
      detailsData: {},        // 现实特卖详情数据
      pageData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      isEdited: false,        // 是否编辑
      userInfo: {},           // 用户信息
      assembleData: {}        // 拼团列表数据
    }
  },

  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
    }
  },

  mounted () {
    // this.formData.themeType = parseInt(this.$route.query.type) || 5
    this.formData.themeType = parseInt(this.$route.query.type)
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.formData.id = parseInt(this.$route.query.id) || ''
    this.assembleType = parseInt(this.$route.query.status) || 2
    this.formData.status = parseInt(this.$route.query.status) || 2
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.assembleData = JSON.parse(localStorage.getItem(this.assembleData))
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    if (this.formData.id) this.formData.themeId = this.formData.id
    if (this.formData.id) this.getDetailsData()
    let matchPath = this.$route.path.match(/assemble|flash/gi)
    if (matchPath) {
      switch (matchPath[0]) {
        case 'assemble':
          this.flashType = 1   // 拼团
          break
        case 'flash':
          this.flashType = 2   // 限时特卖
          break
      }
    }
    if (this.$route.query.themeId) this.formData.themeId = this.$route.query.themeId

    // 设置开始时间 & 结束时间
    let today = this.$Utils.filterDate(new Date(), 'YYYY-MM-DD')
    let endTime = (today + '-23-59-59').split('-')
    this.formData.dailyTime = [new Date(...today.split('-')), new Date(...endTime)]
  },

  methods: {
       /**
     * table标题
     */
    renderHeader (h, { column, $index }) {
      return h('el-checkbox', {
        props: {
          value: this[column.property]
        },
        attrs: {
          disabled: !this.formData.goodsSkuList.length
        },
        on: {
          change: (value) => {
            this[column.property] = value
            this.formData.goodsSkuList.forEach((row, index) => {
              switch (column.property) {
                case 'allSharePrice':       // 设置秒杀价
                  row.whetherShare = value
                  this.$refs['form'].validateField('goodsSkuList.' + index + '.goodsFlashSalePrice')
                  break
                case 'allAssemblePrice':     // 限购件数
                  row.whetherAssemble = value
                  this.$refs['form'].validateField('goodsSkuList.' + index + '.limitBuyNum')
                  break
              }
            })
          }
        }
      }, [
        h('span', column.label)
      ])
    },

    /**
     * 初始化数据
     */
    init () {
      this.formData.themeImgList = []
      this.formData.themeBgList = []
      this.formData.goodsList = []
    },

    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.get('@ROOT_API/shareTheme/getDetail', {
        params: {
          themeId: this.formData.id,
          themeType: this.formData.themeType,
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize
        }
      }).then((res) => {
        this.detailsData = res.data.data.goodsListPage.list
        this.detailsData.forEach((row) => {
          this.detailsData.ifGoodsFlashSalePrice = row.ifGoodsFlashSalePrice
        })
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }

        this.init()
        let results = resData.data
        this.formData.themeName = results.themeName
        this.formData.disseminateType = results.disseminateType
        this.formData.materialName = results.buySourceId
        if (results.themeImage) {
          this.formData.themeImgList.push({url: this.$Utils.filterImgUrl(results.themeImage)})
          this.formData.themeImg = results.themeImage
        }
        this.formData.introduce = results.themePresent
        this.formData.maidRatio = results.distributeRate ? results.distributeRate * 100 : ''
        this.inpBlur('maidRatio')
        this.formData.maidLevels = results.distributeLevel
        if (results.themeBackdrop) {
          this.formData.themeBgList.push({url: this.$Utils.filterImgUrl(results.themeBackdrop)})
          this.formData.themeBg = results.themeBackdrop
        }
        this.formData.requirement = results.requireDisRuleIds && results.requireDisRuleIds.indexOf(',') !== -1 ? results.requireDisRuleIds.split(',') : [results.requireDisRuleIds]
        this.addRelationData(results.goodsListPage.list, true)

        // 限时特卖
        this.formData.restrictNum = results.restrictNum       // 限购
        this.formData.ifEnable = results.ifEnable             // 是否启用
        this.formData.activitysDate = [this.$Utils.filterDate(results.startDate), this.$Utils.filterDate(results.endDate)]  // 活动时间
        // this.formData.dailyTime = [this.$Utils.filterDate(new Date(results.repeatStartTime), 'HH:mm:ss'), this.$Utils.filterDate(new Date(results.repeatEndTime), 'HH:mm:ss')]
        let today = this.$Utils.filterDate(new Date(), 'YYYY-MM-DD') + ' '
        this.formData.dailyTime = [this.$Utils.filterDate(today + results.repeatStartTime), this.$Utils.filterDate(today + results.repeatEndTime)]

        if (results.repeatDays && parseInt(results.repeatDays) !== 8) {
          this.formData.resource = 9
          this.formData.week = results.repeatDays.split(',').map(row => parseInt(row))
          this.copyWeek = this.$Utils.deepCopy(this.formData.week)
        }
        this.pageData.total = results.goodsListPage.total

        setTimeout(() => {
          this.isEdited = false
        }, 500)
      })
    },

    /**
     * 周期选择
     */
    cycleChange (value) {
      if (value === 8) {
        this.formData.week = []
      } else {
        this.formData.week = !this.copyWeek.length ? [1, 2, 3, 4, 5, 6, 0] : this.$Utils.deepCopy(this.copyWeek)
      }
    },

    /**
     * 周选择
     */
    weekChange () {
      this.copyWeek = this.$Utils.deepCopy(this.formData.week)
    },

    /**
     * 时间改变
     */
    statisticsDateChange (value) {
      if (!value) this.onPickDate = ''
    },

    /**
     * 过滤利润率
     */
    filterProfitMargin (item) {
      // let goodsPrice = item.goodsPrice && !isNaN(item.goodsPrice) ? parseFloat(item.goodsPrice) : 0
      let goodsPrice = item.goodsPrice
      let buyingPrice = !isNaN(item.buyingPrice) ? parseFloat(item.buyingPrice) : ''
      if (item.goodsGroupPrice > 0 && !isNaN(item.goodsGroupPrice)) {
        goodsPrice = item.goodsGroupPrice
      } else if (item.goodsFlashSalePrice > 0 && !isNaN(item.goodsFlashSalePrice)) {
        goodsPrice = item.goodsFlashSalePrice     // 商品限时秒杀价
      }
      // console.log('item: ', item, goodsPrice)
      if (!goodsPrice || isNaN(goodsPrice)) return ''
      let res = ((goodsPrice - buyingPrice) / goodsPrice * 100).toFixed(2)   // (销售价 - 进货价 )/ 销售价
      return res
    },

    /**
     * 接收关联数据
     */
    relationDataChange (results) {
      this.relationListData = results
    },

     /**
     * 添加关联数据
     */
    addRelationData (results, type) {
      results.forEach((row) => {
        row.inviteProfitType = row.inviteProfitType || 1
        row.inviteProfitNum = row.inviteProfitNum || 0
        row.beInviteProfitType = row.beInviteProfitType || 1
        row.beinviteProfitNum = row.beinviteProfitNum || 0
        row.sort = parseInt(row.sort) || 0
        if (type || !this.formData.goodsList.length) {
          this.formData.goodsList.push(row)
        } else {
          this.formData.goodsList.unshift(row)
        }
      })
    },

    /**
     * 移除关联数据
     */
    removeRelationData (results) {
      results.forEach((row) => {
        this.formData.goodsList.forEach((list, index) => {
          if (row.id === list.goodsId || row.id === list.id) this.formData.goodsList.splice(index, 1)
        })
      })
    },

    /**
    * 价格输入框自动补全价格
    */
    inpBlur (obj) {
      this.$Utils.blurAutoCompletion(this.formData, obj)
    },

    /*
     * 广告位图片上传成功
     */
    uploadSuccessHandle (url) {
      this.formData.themeImgList.push({url: this.$Utils.filterImgUrl(url)})
      this.formData.themeImg = url
    },

    /*
     * 主题背景上传成功
     */
    uploadThemeHandle (url) {
      this.formData.themeBgList.push({url: this.$Utils.filterImgUrl(url)})
      this.formData.themeBg = url
    },

    /**
     * 提交表单
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.formData.goodsList.forEach((row) => {
          row.inviteProfitNum = row.inviteProfitNum || 0
          row.beinviteProfitNum = row.beinviteProfitNum || 0
          row.sort = parseInt(row.sort) || 0
        })
        let requireDisRuleIds = this.formData.requirement.filter(row => row !== '' && row !== null)
        this.confirmLoading = true
        this.$http.post('@ROOT_API/shareTheme/edit', {
          id: this.formData.themeId,                 // 是 int 主题主键
          themeName: this.formData.themeName,        // 是 string 分享主题
          themeImage: this.formData.themeImg,        // 是 string 广告位图片
          themePresent: this.formData.introduce,     // 是 string 分享介绍，themeType=7、8时传 "-"
          distributeRate: '',                        // 否 double  分佣比例
          distributeLevel: '',                       // 否 int 分佣级数
          themeBackdrop: this.formData.themeBg,      // 是 string 主题背景，themeType=7、8时传 "-"
          requireDisRuleIds: requireDisRuleIds.length ? requireDisRuleIds.join(',') : '',   // 否 string  允许参与用户分享等级ID，逗号隔开
          themeType: this.formData.themeType,        // 是 int 活动类型 1：分享商品、2：芯豆专区、3：消费积分、4：联盟积分、5：拼团 7：限时特卖、8：采消专区
          status: this.formData.status,              // 否 int 活动状态（1：开启、2：关闭
          disseminateTypeateType: '',                // 否 int 宣传内容（1：广告位 2：宣传素材）
          buySourceId: '',                           // 否 int 宣传素材，disseminateType=2时必填
          startDate: this.formData.activitysDate.length ? new Date(this.formData.activitysDate[0]).getTime() : '', // 否 date  开始日期，themeType=7时必填
          endDate: this.formData.activitysDate.length ? new Date(this.formData.activitysDate[1]).getTime() : '',   // 否 date  结束日期，themeType=7时必填
          repeatDays: this.formData.resource === 8 ? this.formData.resource : this.formData.week.join(','),                     // 否 string  按周期重复（格式按','拼接；null:不重复、 0,1,2,3,4,5,6：每周七-周六重复、 8：每天重复）
          repeatStartTime: this.formData.dailyTime.length ? new Date(this.formData.dailyTime[0]).getTime() : '',                       // 否 date  按周期重复开始时间，themeType=7&reperatDays!=null时必填
          repeatEndTime: this.formData.dailyTime.length ? new Date(this.formData.dailyTime[1]).getTime() : '',                         // 否 date  按周期重复结束时间，themeType=7&reperatDays!=null时必填
          restrictNum: this.formData.restrictNum,    // 否 int 限购件数，themeType=7时必填
          ifEnable: this.formData.ifEnable,          // 否 int 是否启用（0：否、1：是），themeType=7、8时必填
          purchaseDes: '',                           // 否 string  收益说明，themeType=8时必填
          themeGoodsList: this.formData.goodsList    // 是 list  关联商品集合对象
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === 9930) {
            this.$message({
              message: '存在部分商品为设置拼团规则，设置完成后才能开启',
              type: 'error',
              duration: 1500
            })
            return false
          } else if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          } else {
            this.$message({
              message: resData.msg,
              type: 'success',
              duration: 1000
            })
          }
          this.$router.back()
        }).finally(() => {
          setTimeout(() => {
            this.confirmLoading = false
          }, 500)
        })
      })
    },

    /**
     * 一键同步
     * @param  {[String]} key [需要同步的键]
     */
    handleSync (key, index) {
      let currentObj = this.formData.goodsSkuList[index]
      if (isNaN(currentObj[key]) || currentObj[key] <= 0) return false
      let defVal = null
      this.formData.goodsSkuList.forEach((row, index) => {
        if (defVal === null) defVal = row[key]
        if (defVal) {
          row[key] = defVal
          if (key === 'updateGoodsNum') {
            let currentGoodsNum = parseFloat(row.currentGoodsNum) || 0
            row.goodsNum = currentGoodsNum + parseFloat(defVal)
          }
          if (key === 'currentGoodsNum') {
            let updateGoodsNum = parseFloat(row.updateGoodsNum) || 0
            row.goodsNum = updateGoodsNum + parseFloat(defVal)
          }
        }
      })
    },

    /**
     * 向上移动
     */
    handleSortUp (index) {
      this.isEdited = true
      let temp = this.formData.goodsList[index]
      let sort = temp.sort
      temp.sort = this.formData.goodsList[index - 1].sort
      this.formData.goodsList[index - 1].sort = sort
      this.$set(this.formData.goodsList, index, this.formData.goodsList[index - 1])
      this.$set(this.formData.goodsList, index - 1, temp)
    },

    /**
     * 向下移动
     */
    handleSortDown (index) {
      this.isEdited = true
      let temp = this.formData.goodsList[index]
      let sort = temp.sort
      temp.sort = this.formData.goodsList[index + 1].sort
      this.formData.goodsList[index + 1].sort = sort
      this.$set(this.formData.goodsList, index, this.formData.goodsList[index + 1])
      this.$set(this.formData.goodsList, index + 1, temp)
    },

    /**
     * 内容改变
     */
    contentChange () {
      this.isEdited = true
    },

    /**
     * 设置特卖价前操作
     */
    batchSetupBefore (row) {
      this.currentGoods = row
      this.$http.post('@ROOT_API/shareTheme/getThemeGoodSettingDetail', {
        id: row.id,
        goodsId: row.goodsId
      }).then((res) => {
        let results = res.data
        if (parseInt(results.status) !== 1) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.setUpVisible = true
        this.formData.goodsSkuList = results.data.goodsSkuList
        this.skuTitleList = []
        this.formData.goodsSkuList.forEach((row, index) => {
          if (row.whetherDefaultSku) {
            this.defaultSkuId = row.id
          }
          if (index === 0 && row.goodsSkuValList) {
            row.goodsSkuValList.forEach((list) => {
              this.skuTitleList.push(list.standardName)
            })
          }
        })
      })
    },

    /**
     * 设置特卖价
     */
    handleSale (saleName) {
      console.log('this.$refs[saleName]: ', this.$refs[saleName])
      this.$refs[saleName].validate((valid) => {
        if (!valid) return false
        let skuUpdateList = []
        this.formData.goodsSkuList.forEach((row) => {
          row.skuId = row.id
          row.whetherDefaultSku = row.id === this.defaultSkuId ? 1 : 0
          skuUpdateList.push(row)
        })
        this.$http.post('@ROOT_API/shareTheme/themeGoodSettingEdit', {
          id: this.formData.id,
          goodsId: this.currentGoods.id,
          themeType: 7,
          activityImage: '',
          activityRemark: '',
          skuUpdateList
        }).then((res) => {
          let results = res.data
          if (parseInt(results.status) !== 1) {
            this.$message({
              message: results.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.$message({
            message: results.msg,
            type: 'success',
            duration: 1500
          })
          this.setUpVisible = false
          this.getDetailsData()
        })
      })
    },

    /**
     * 设置特卖价
     */
    dateChange (id) {
      this.formData.currentDate = this.formData.dateList.filter(row => row.id === id)[0]
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
      } else {
        let url = '/admin/operation/extension/assemble/details'
        this.$router.push({path: url, query: {id: item.goodsId}})
      }
    },

    /**
     * 列表内改变状态
     */
    changeStatus (val, row) {
      let status = val === true ? 1 : 2
      this.$http.post('@ROOT_API/group/changeStatus', {
        id: row.id,
        status: status
      }).then((res) => {
        let results = res.data
        if (parseInt(results.status) !== 1) {
          this.$message({
            message: results.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.getListData()
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 取消分享前操作
     */
    handleDeleteBefore (row) {
      this.deleteVisible = true
      this.deleteData = row
    },

    /**
     * 取消分享
     */
    handleDelete () {
      this.deleteLoading = true
      this.$http.get('@ROOT_API/shareTheme/deleteShareThemeGoodsisJoinStatus', {
        params: {
          ids: this.deleteData.id
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
        this.formData.goodsList.forEach((row, index) => {
          if (this.deleteData.goodsId === row.goodsId) this.formData.goodsList.splice(index, 1)
        })
        this.deleteVisible = false
      }).finally(() => {
        setTimeout(() => {
          this.deleteLoading = false
        }, 500)
      })
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      if (this.pageData.currentPage === page) {
        this.getListData()
        this.getDetailsData()
      } else {
        this.pageData.currentPage = page
        this.$router.push({query: {page: this.pageData.currentPage, type: this.formData.themeType, id: this.formData.id}})
      }
    }
  }
}
</script>

<style lang='less' scoped>
.assemble-Index-wrap{

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
}
</style>

<style lang="less">
.assemble-Index-wrap{

  .upload-wrap.max{
    .el-upload{
      display: none;
    }
  }

  .dialog-set-up{
    .el-form-item__error{
      left: 0;
    }
  }

  .el-table{
    margin-bottom: 20px;
    .cell{
      overflow: inherit;
    }
    .thumbnail-component-wrap{
      margin-left: 20px;
    }

    .batch{
      color: #33719b;
      cursor:pointer;
    }
  }

  .el-form-item__error{
    left: 160px;
  }

  .el-form-item__label{
    margin-right: 10px;
  }

  .el-date-editor--time{
    width: 150px !important;
    margin-left: 20px;
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
  
  /*-----------限时特卖 - 周期时间------------*/
  .activity-time{

    .week-time{
      height: 40px;
      line-height: 40px;
      margin-top: 10px;

      .el-radio{
        height: 40px;
        line-height: 40px;
        margin-right: 20px;
      }
      .el-checkbox__inner{
        width: 0;
        height: 0;
        display: none;
      }

      .el-checkbox{
        margin-left: 10px;
      }

      .el-checkbox__label{
        padding: 5px 12px;
        background: #eee;
        border-radius: 5px;
      }

      .el-checkbox__input.is-checked+.el-checkbox__label{
        color: #fff;
        background: #409EFF;
      }
    }
  }

  .di-n{
    .el-radio__label{
      display: none !important;
    }
  }

  .limit-wrap{
    .el-form-item__error{
      left: 260px !important;
    }
    .limit{
      color: #999;
    }

    .limit-input{
      width: 150px !important;
      margin: 0 10px;
    }
  }

  .el-form-item__content{
    margin-left: 0 !important;
  }

  .block{
    .el-input__inner{
      width: 400px;
    }
  }
  .el-range-editor--small.el-input__inner{
    width: 320px;
  }

  .integral-wrap{
    
    .el-form-item__error{
      left: 295px !important;
    }
  }

  .data-error{
    .el-form-item__error{
      left: 0 !important;
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

  .thumbnail-component-wrap{
    margin-left: 162px;
  }

  .search-head-wrap{
    padding: 0 0 20px 0 !important;
    .search-inp{
      margin-bottom: 20px;
      float: right;
    }

    .search-edit-wrap{
      float: left !important;
    }
  }
}
</style>
