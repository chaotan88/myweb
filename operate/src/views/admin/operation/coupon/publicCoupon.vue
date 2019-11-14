<!-- 社群运营 - 拼团/促销转化 - 限时特卖 -->
<template>
  <common-tpl class="assemble-Index-wrap" footer back>
    <template slot="main">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="152px">
         <gray-title :title="pageType === 1 ? '新增优惠券' : '编辑优惠券'"></gray-title>

        <!-- 主题设置 -->
        <div class="commodity-details pos-r">
          <el-form-item label="优惠券标题：" prop="couponTitle">
            <el-input v-model="formData.couponTitle" placeholder="限20个字符以内" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="优惠券副标题：" prop="couponSubtitle">
            <el-input v-model="formData.couponSubtitle" placeholder="限20个字符以内" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="优惠券类型：">
            <el-radio-group v-model="formData.couponType" @change="Eliminate">
              <el-radio :label="1" >代金券</el-radio>
              <el-radio :label="2" >折扣券</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="formData.couponType === 1">
            <el-form-item label="减免金额：" prop="reductionAmountRule">
              <el-input v-model.sync="formData.reductionAmountRule" v-auto-price placeholder="允许保留2位小数" maxlength="10" :isfirest="isfirest" ></el-input>
              <span class="classifier">元</span>
            </el-form-item>
            <el-form-item label="使用条件：" prop="consumptionAmountRuled">
              <span style="padding-right: 15px; color: #606266">消费金额满</span><el-input v-model.sync="formData.consumptionAmountRuled" placeholder="允许保留2位小数" maxlength="50" v-auto-price style="width: 315px;"></el-input>
              <span class="classifier">元</span>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="折扣额度：" prop="discountAmountRule">
              <el-input v-model="formData.discountAmountRule" placeholder="只允许输入1-9.9之间的数字，保留一位小数" maxlength="10"></el-input><span class="classifier">折</span>
            </el-form-item>
            <el-form-item label="使用条件：" prop="conditionSelection">
              <div>
                <!-- {{formData.ifConsumptionAmountRule}} -->
                <el-checkbox v-model="formData.ifConsumptionAmountRule" class="d-ib">消费金额满</el-checkbox>
                <div class="d-ib">
                  <el-input v-model="formData.consumptionAmountRulez" placeholder="允许保留2位小数" maxlength="50"  v-auto-price style="width: 290px;margin-left: 10px;"></el-input>
                  <span class="classifier">元</span>
                </div>
              </div>
              <div style="margin: 22px 0 0 160px">
                <!-- {{formData.ifGoodsNumRule}} -->
                <el-checkbox v-model="formData.ifGoodsNumRule" class="d-ib">购买商品满</el-checkbox>
                <div class="d-ib">
                  <el-input v-model="formData.goodsNumRule" placeholder="只允许输入正整数" maxlength="10"  style="width: 290px;margin-left: 10px;"></el-input>
                  <span class="classifier">件</span>
                </div>
              </div>
            </el-form-item>
          </template>
          <el-form-item label="总库存：" prop="couponTotal">
            <el-input v-model="formData.couponTotal" placeholder="只允许输入正整数" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="会员限领：">
            <el-radio-group v-model="formData.memberLimit">
              <el-radio :label="0">不限会员</el-radio>
              <el-radio :label="1">只允许新人领取</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="限领张数：" prop="amountLimit">
            <el-input v-model="formData.amountLimit" placeholder="限50个字符以内" maxlength="10"></el-input>
            <span class="classifier">张</span>
          </el-form-item>
          <el-form-item label="生效时间：">
            <el-radio-group v-model="formData.effectiveTimeType">
              <el-radio :label="0">固定时间</el-radio>
              <el-radio :label="1">领券后生效</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="formData.effectiveTimeType === 0">
            <el-form-item class="pos-r apply-date-wrap" prop="activitysDate">
              <div class="block"><span class="demonstration"></span>
                <span style="padding-left: 160px;"></span><el-date-picker v-model="formData.activitysDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </div>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item prop="effectiveNum">
              <span style="padding: 0 10px 0 160px">领券后</span><el-input v-model="formData.effectiveNum" placeholder="限50个字符以内" maxlength="50" style="width: 300px;"></el-input>
              天有效
            </el-form-item>
          </template>
          <el-form-item label="是否开启：">
            <el-radio-group v-model="formData.ifEnable">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <br>

        <!-- 商品设置 -->
       <!--  <gray-title title="添加商品">
          <el-button slot="right" size="small" type="primary" round style="margin-top: -15px; right: 7px; top: 50%;" class="pos-a" @click="relationVisible = true"><i class="el-icon-plus"></i><template>{{'添加商品'}}</template></el-button>
        </gray-title> -->
        <!-- <el-form-item label="适用商品：">
          <el-radio-group v-model="formData.apply">
            <el-radio :label="0">全部商品参与</el-radio>
            <el-radio :label="1">指定商品参与</el-radio>
            <el-radio :label="2">指定商品不参与</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <br>
        <!-- <template v-if="formData.apply !== 1">
          <el-table border :data="formData.goodsList" class="full-w">
            <el-table-column prop="mainImage" label="商品图片" min-width="100">
              <template slot-scope="scope">
                <thumbnail-component :list="[{url: scope.row.mainImage}]" :size="50"></thumbnail-component>
              </template>
            </el-table-column>
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
            <el-table-column prop="" label="利润率">
              <template slot-scope="scope">{{filterProfitMargin(scope.row) | filterEmpty('%')}}</template>
            </el-table-column>
          </el-table>
        </template> -->
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

       <!-- 关联商品 -->
      <el-dialog title="关联商品" :visible.sync="relationVisible" width="1100px">
        <!-- 关联商品组件 -->
        <relation-goods :key="relationGoodsKey" :relationId="parseInt(formData.themeId)" :relationType="5" relationUrl="shareTheme/getShareThemeGoodsPage" @change="relationDataChange" @add="addRelationData" @remove="removeRelationData"></relation-goods>
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">提交</el-button>
    </template>
  </common-tpl>
</template>

<script>
import RelationGoods from '@/components/public/RelationGoods'
import RegionSelect from '@/components/utils/RegionSelect'
export default {
  components: {RegionSelect, RelationGoods},
  data () {
    // 校验减免金额
    let validatMoney = (rule, value, callback) => {
      if (!value || value === null) return callback(new Error('请输入金额'))
      let reg = /^\d+\.\d{2}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('请输入正数,精确到百分位'))
      callback()
    }

    // 校验折扣额度
    let validatdiscountAmountRule = (rule, value, callback) => {
      if (value === '' || value === null) return callback(new Error('请输入折扣额度'))
      let reg = /^(?=0\.[1-9]|[1-9]\.\d).{3}$|^([1-9])$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('请输入1~9.9之间的正数,允许保留一位小数'))
      callback()
    }

    // 校验正整数
    let validateInt = (rule, value, callback) => {
      if (!value && parseInt(value) !== 0) return callback(new Error('请输入数量'))
      if (value && !value.toString().match(/^\d*$/gi)) return callback(new Error('请输入正整数'))
      callback()
    }

    // 验证多选
    let validatCheckbox = (rule, value, callback) => {
      let reg = /^\d+\.\d{2}$/gi
      if (!this.formData.ifConsumptionAmountRule && !this.formData.ifGoodsNumRule) return callback(new Error('必须选择一个'))
      if (this.formData.ifConsumptionAmountRule && !this.formData.consumptionAmountRulez) return callback(new Error('选中了消费金额未填写消费金额'))
      if (this.formData.ifConsumptionAmountRule && !this.formData.consumptionAmountRulez.toString().match(reg)) return callback(new Error('请输入正数,允许输入百分位'))
      if (this.formData.ifGoodsNumRule && !this.formData.goodsNumRule) return callback(new Error('选中了购买商品未填写商品数量'))
      if (this.formData.ifGoodsNumRule && !this.formData.goodsNumRule.toString().match(/^\d*$/gi)) return callback(new Error('请填写整数'))
      callback()
    }

    return {
      isfirest: true,             // 第一次加载自定义指令
      confirmLoading: false,      // 确定loading
      pageType: 1,                // 页面类型 [1、新增 2、编辑]         // 设置特卖价表单
      firstDate: '',              // 时间开始
      endDate: '',                // 时间结束
      formData: {
        themeId: 10,              // 主题id
        id: '',                   // id

        couponTitle: '',              // 是 string 优惠券标题
        couponSubtitle: '',           // 是 string 优惠券副标题
        couponType: 1,                // 是 int 优惠券类型（1：代金券 2：折扣券）
        couponTotal: '',              // 是 int 总库存
        memberLimit: 0,               // 否 int 会员限领（0：不限会员 1：只允许新人领取）
        amountLimit: '',              // 是 int 限领张数
        effectiveTimeType: 0,         // 是 int 生效时间（0：固定时间 1：领券后生效）
        activitysDate: [],            // 活动时间
        effectiveNum: '',             // 是 int 领券后xx天有效（effectiveTimeType=1时必填）
        ifEnable: 1,                  // 否 int 是否开启（0：是 1：否）
        reductionAmountRule: '',      // 否 double 减免金额（couponType=1时必填）
        consumptionAmountRuled: '',   // 否 double 消费金额 满 （couponType=1/2时必填）
        consumptionAmountRulez: '',   // 否 double 消费金额 满 （couponType=1/2时必填）
        discountAmountRule: '',       // 否 double 折扣额度（couponType=2时必填）
        goodsNumRule: '',             // 否 int 商品数量（couponType=2时必填）
        ifConsumptionAmountRule: '',  // 否 int 是否启用 消费金额 满 （0：是 1 ：否）（couponType=2时必填）
        ifGoodsNumRule: '',           // 否 int 是否启用 商品数量（0：是 1 ：否）（couponType=2时必填）

        themeType: 1,             // 主题类型
        goodsSkuList: []          // sku列表
      },
      copyWeek: [],
      materialListData: [],       // 素材列表
      relationGoodsKey: '',       // 关联商品标识符
      buySourceId: '',            // 宣传素材，disseminateType=2时必填
      rules: {
        // 栏目名称
        couponTitle: [{ required: true, message: '请输入优惠券标题', trigger: 'blur' }],                  // 优惠券标题
        couponSubtitle: [{ required: true, message: '优惠券副标题', trigger: 'blur' }],                   // 优惠券副标题
        reductionAmountRule: [{ required: true, validator: validatMoney, trigger: 'blur' }],              // 减免金额
        condition: [{required: true, validator: validatMoney, trigger: 'blur'}],                          // 使用条件[代金券]
        discountAmountRule: [{ required: true, validator: validatdiscountAmountRule, trigger: 'blur' }],  // 折扣额度
        consumptionAmountRuled: [{ required: true, validator: validatMoney, trigger: 'change' }],          // 使用条件[折扣劵]
        conditionSelection: [{ required: true, validator: validatCheckbox, trigger: 'change' }],          // 使用条件[折扣劵]
        couponTotal: [{required: true, validator: validateInt, trigger: 'blur'}],                         // 总库存
        amountLimit: [{required: true, validator: validateInt, trigger: 'blur'}],                         // 限领张数
        activitysDate: [{ type: 'array', required: true, message: '请选择日期', trigger: 'change' }]      // 固定时间
      },
      copyFormData: {},       // 拷贝表单数据
      relationVisible: false, // 关联商品弹窗
      relationListData: [],   // 关联数据
      tableData: [],          // 列表
      onPickDate: '',         // 时间控件点击,
      skuTitleList: [],       // sku标题
      defaultSkuId: '',       // 默认sku
      currentGoods: {},       // 当前操作商品对象
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
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.pageType = this.$route.path.match(/add/gi) ? 1 : 2
    console.log('this.pageType: ', this.pageType)
    this.formData.id = parseInt(this.$route.query.id) || ''
    this.assembleType = parseInt(this.$route.query.status) || 2
    this.formData.status = parseInt(this.$route.query.status) || 2
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.assembleData = JSON.parse(localStorage.getItem(this.assembleData))
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    if (this.formData.id) this.formData.themeId = this.formData.id
    if (this.formData.id) this.getDetailsData()
    console.log('this.formData.id: ', this.formData.id)
    if (this.$route.query.themeId) this.formData.themeId = this.$route.query.themeId

    // 设置开始时间 & 结束时间
    let today = this.$Utils.filterDate(new Date(), 'YYYY-MM-DD')
    let endTime = (today + '-23-59-59').split('-')
    this.formData.dailyTime = [new Date(...today.split('-')), new Date(...endTime)]
  },

  methods: {

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
      this.$http.get('@ROOT_API/coupon/getDetail', {
        params: {
          couponId: this.formData.id
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
        this.init()
        let results = resData.data
        // console.log('results: ', results)
        this.formData.couponTitle = results.couponTitle                         // 优惠券标题
        this.formData.couponSubtitle = results.couponSubtitle                   // 优惠券副标题
        this.formData.couponType = results.couponType                           // 优惠券类型（1：代金券 2：折扣券）
        this.formData.couponTotal = results.couponTotal                         // 总库存
        this.formData.memberLimit = results.memberLimit                         // 会员限领（0：不限会员 1：只允许新人领取）
        this.formData.amountLimit = results.amountLimit                         // 限领张数
        this.formData.effectiveTimeType = results.effectiveTimeType             // 生效时间（0：固定时间 1：领券后生效）
        this.formData.effectiveNum = results.effectiveNum                       // 领券后xx天有效（effectiveTimeType=1时必填）
        this.formData.ifConsumptionAmountRule = results.ifConsumptionAmountRule === 0 ? !!true : !!false  // 是否启用 消费金额 满 （0：是 1 ：否）（couponType=2时必填）
        this.formData.ifGoodsNumRule = parseInt(results.ifGoodsNumRule) === 0 ? !!true : !!false                    // 是否启用 商品满（0：是 1 ：否）（couponType=2时必填）
        this.formData.ifEnable = results.ifEnable                               // 是否开启（0：是 1：否）
        this.formData.reductionAmountRule = results.reductionAmountRule         // 减免金额（couponType=1时必填）
        this.formData.consumptionAmountRulez = results.consumptionAmountRulez   // 折扣劵消费金额 满 （couponType=1/2时必填）
        this.formData.consumptionAmountRuled = results.consumptionAmountRuled   // 代金券消费金额 满 （couponType=1/2时必填）
        this.formData.discountAmountRule = results.discountAmountRule           // 折扣额度（couponType=2时必填）
        this.formData.goodsNumRule = results.goodsNumRule                       // 购买商品满（couponType=2时必填）
        this.formData.activitysDate = [this.$Utils.filterDate(results.effectiveStartTime), this.$Utils.filterDate(results.effectiveEndTime)]  // 固定时间
      //  console.log('results.ifConsumptionAmountRule: ', results.ifConsumptionAmountRule)
     //   console.log('results.ifGoodsNumRule: ', results.ifGoodsNumRule)

     //   this.inpBlur(this.formData, 'consumptionAmountRuled')
     //   this.inpBlur(this.formData, 'reductionAmountRule')
        setTimeout(() => {
          this.isEdited = false
        }, 500)
      })
    },

    /**
     * 价格输入框自动补全价格
     */
    inpBlur (vm, obj) {
      this.$Utils.blurAutoCompletion(vm, obj)
    },

    /**
     * 代金券、折扣劵选择
     */
    Eliminate (value) {
      if (this.formData.couponType === 1) {
        this.formData.reductionAmountRule = ''          // 减免金额（couponType=1时必填）
        this.formData.discountAmountRule = ''           // 折扣额度
        this.formData.ifConsumptionAmountRule = false   // 是否启用 消费金额 满 （0：是 1 ：否）（couponType=2时必填）
        this.formData.consumptionAmountRulez = ''       // 消费金额 满 （couponType=1/2时必填）
        this.formData.ifGoodsNumRule = false            // 是否启用 商品满（0：是 1 ：否）（couponType=2时必填）
        this.formData.goodsNumRule = ''                 // 购买商品满（couponType=2时必填）
      } else {
        this.formData.discountAmountRule = ''           // 折扣额度
        this.formData.reductionAmountRule = ''          // 减免金额（couponType=1时必填）
        this.formData.consumptionAmountRuled = ''       // 消费金额 满 （couponType=1/2时必填）
      }
      this.isfirest = false                            // 切换后, 自定义指令不是初次加载, 不需立即补全两位小数
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

   //  /**
   //  * 价格输入框自动补全价格
   //  */
   //  inpBlur (obj) {
   //    this.$Utils.blurAutoCompletion(this.formData, obj)
   //  },

    /**
     * 提交表单
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.dialogLoading = true
        let url = this.pageType === 1 ? '@ROOT_API/coupon/add' : '@ROOT_API/coupon/edit'
        this.$http.post(url, {
          id: this.pageType === 1 ? '' : this.formData.id,
          couponTitle: this.formData.couponTitle,                                    // 是 string 优惠券标题
          couponSubtitle: this.formData.couponSubtitle,                              // 是 string 优惠券副标题
          couponType: this.formData.couponType,                                      // 是 int 优惠券类型（1：代金券 2：折扣券）
          couponTotal: parseFloat(this.formData.couponTotal),                        // 是 int 总库存
          memberLimit: this.formData.memberLimit,                                    // 否 int 会员限领（0：不限会员 1：只允许新人领取）
          amountLimit: this.formData.amountLimit,                                    // 是 int 限领张数
          effectiveTimeType: this.formData.effectiveTimeType,                        // 是 int 生效时间（0：固定时间 1：领券后生效）
          effectiveStartTime: this.formData.activitysDate.length ? new Date(this.formData.activitysDate[0]).getTime() : '', // 否 date
          effectiveEndTime: this.formData.activitysDate.length ? new Date(this.formData.activitysDate[1]).getTime() : '',   // 否 date
          effectiveNum: this.formData.effectiveNum,                                  // 是 int 领券后xx天有效（effectiveTimeType=1时必填）
          ifEnable: this.formData.ifEnable,                                          // 否 int 是否开启（0：是 1：否）
          reductionAmountRule: parseFloat(this.formData.reductionAmountRule),        // 否 double 减免金额（couponType=1时必填）
          consumptionAmountRulez: parseFloat(this.formData.consumptionAmountRulez),  // 否 double 消费金额 满 （couponType=1/2时必填）
          consumptionAmountRuled: parseFloat(this.formData.consumptionAmountRuled),  // 否 double 消费金额 满 （couponType=1/2时必填）
          discountAmountRule: this.formData.discountAmountRule,                      // 否 double 折扣额度（couponType=2时必填）
          goodsNumRule: parseInt(this.formData.goodsNumRule),                        // 否 int 商品数量（couponType=2时必填）
          ifConsumptionAmountRule: this.formData.ifConsumptionAmountRule ? 0 : 1,    // 否 int 是否启用 消费金额 满 （0：是 1 ：否）（couponType=2时必填）
          ifGoodsNumRule: this.formData.ifGoodsNumRule ? 0 : 1                       // 否 int 是否启用 商品数量（0：是 1 ：否）（couponType=2时必填）
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
          this.$router.push('/admin/operation/conversion/coupon/all')
        }).finally(() => {
          this.dialogLoading = false
        })
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

  .classifier{
    margin-left: 10px;
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

  .el-checkbox+.el-checkbox{
    margin-left: 160px;
    margin-top: 20px;
  }
}
</style>
