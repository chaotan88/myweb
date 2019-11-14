  <!-- 关联商品设置 -->
<template>
  <common-tpl class="operation-community-goods-setting" footer back>
    <template slot="main">
      <el-form :model="formData" ref="form" :rules="rules" label-width="160px">
        <gray-title>内容配置</gray-title>
        <br>
        <el-form-item label="商品名称:">{{SupperSetting.goodsName | filterEmpty}}</el-form-item>

        <gray-title>价格配置</gray-title>
        <!-- 统一规格 -->
        <template v-if="formData.multStandard === 1">
          <el-form-item label="进货价：">{{formData.buyingPrice | filterEmpty}}</el-form-item>
          <el-form-item label="销售价：">{{formData.goodsPrice | filterEmpty}}</el-form-item>
          <el-form-item label="分享价：" prop="goodsSharePrice">
            <el-input v-model="formData.goodsSharePrice"></el-input>
          </el-form-item>
          <el-form-item label="获得积分：" prop="points">
            <el-input v-model="formData.points"></el-input>
          </el-form-item>
          <el-form-item label="利润率：">{{filterUnifiedProfitMargin() | filterEmpty}}</el-form-item>
          <el-form-item label="兑换芯豆数量：" prop="goodsGoldBeanNum">
            <el-input v-model="formData.goodsGoldBeanNum"></el-input>
          </el-form-item>
        </template>

        <!-- 多规格 -->
        <template v-if="formData.multStandard === 2">
          <br>
          <el-form-item>
            <el-table border :data="formData.specTableData" class="el-sku-table">
              <el-table-column label="默认价格" width="80px" align="center">
                <template slot-scope="scope">
                  <el-radio v-model="defaultSkuId" :label="scope.row.id" :disabled="pageType === 2 || parseInt(scope.row.disStatus) === 1" :title="parseInt(scope.row.disStatus) === 1 ? '已被禁用，不能勾选' : ''"></el-radio>
                </template>
              </el-table-column>

              <el-table-column :label="item" min-width="100px" :key="index" v-for="(item, index) in skuTitleList">
                <template slot-scope="scope">
                  <template v-if="scope.row.goodsSkuValList.length">{{scope.row.goodsSkuValList[index].standardValName}}</template>
                </template>
              </el-table-column>

              <el-table-column label="条形码" min-width="120px">
                <template slot-scope="scope">{{scope.row.externalNo | filterEmpty}}</template>
              </el-table-column>

              <el-table-column label="当前库存" min-width="100px" :key="Math.random()">
                <template slot-scope="scope">{{scope.row.goodsNum | filterMoney}}</template>
              </el-table-column>

              <el-table-column label="进货价" min-width="100px">
                <template slot-scope="scope">{{scope.row.buyingPrice | filterMoney}}</template>
              </el-table-column>
               <el-table-column label="运营成本率（%）" width="180px" :key="Math.random()">
                <template slot-scope="scope">
                  <template v-if="pageType === 1">
                    <div class="pos-r" :class="{'pd-r': pageType === 1}">
                      <el-form-item label-width="0" :prop="'specTableData.' + scope.$index + '.goodsGroupOperateCostRate'" :rules="ruleGoodsOperatingCostRate">
                        <el-input size="medium" v-model.sync="scope.row.goodsGroupOperateCostRate" v-auto-price></el-input>
                      </el-form-item>
                      <span class="pos-a d-ib per-cent">%</span>
                    </div>
                  </template>
                  <template v-else>{{scope.row.ifGoodsGroupPrice ? scope.row.goodsGroupOperateCostRate : 0}}</template>
                </template>
              </el-table-column>
               <el-table-column label="税（%）" width="180px" :key="Math.random()">
                <template slot-scope="scope">
                  <template v-if="pageType === 1">
                    <div class="pos-r" :class="{'pd-r': pageType === 1}">
                      <el-form-item label-width="0" :prop="'specTableData.' + scope.$index + '.goodsGroupTaxRate'" :rules="ruleGoodsTaxRate">
                        <el-input size="medium" v-model="scope.row.goodsGroupTaxRate" v-auto-price></el-input>
                      </el-form-item>
                      <span class="pos-a d-ib per-cent">%</span>
                    </div>
                  </template>
                  <template v-else>{{scope.row.ifGoodsGroupPrice ? scope.row.goodsGroupPrice : 0}}</template>
                </template>
              </el-table-column>
              <el-table-column label="销售价" min-width="100px">
                <template slot-scope="scope">{{scope.row.goodsPrice | filterMoney}}</template>
              </el-table-column>

              <el-table-column label="拼团价" width="180px" :key="Math.random()">
                <template slot-scope="scope">
                  <template v-if="pageType === 1">
                    <div class="pos-r" :class="{'pd-r': pageType === 1}">
                      <el-form-item label-width="0" :prop="'specTableData.' + scope.$index + '.goodsGroupPrice'" :rules="ruleGoodsAssemblePrice">
                        <el-input size="medium" v-model="scope.row.goodsGroupPrice" v-auto-price></el-input>
                      </el-form-item>
                      <ali-icon icon="icon-jiantou3" :size="30" title="一键同步" class="cursor-p pos-a sync-btn" @click.native="handleSync('goodsGroupPrice', scope.$index)" v-if="scope.$index === 0"></ali-icon>
                    </div>
                  </template>
                  <template v-else>{{scope.row.ifGoodsGroupPrice ? scope.row.goodsGroupPrice : '否'}}</template>
                </template>
              </el-table-column>
              <el-table-column label="利润率（利润/成交价）" width="180px" :key="Math.random()" align="center">
                <template slot-scope="scope">{{filterProfitMargin(scope.row) | filterEmpty('%')}}</template>
              </el-table-column>

              <!-- 暂无数据 -->
              <template slot="empty">
                <no-data></no-data>
              </template>

            </el-table>
          </el-form-item>
        </template>

        <el-form-item label="拼团人数：" prop="groupNum">
          <template v-if="pageType === 1">
            <el-input v-model="formData.groupNum" placeholder="限2 - 10000000正整数"></el-input>
          </template>

          <template v-else>{{formData.remark}}</template>
        </el-form-item>

        <el-form-item label="拼团时间：" prop="groupTime">
          <el-input v-model="formData.groupTime" placeholder="限1 - 1000正整数"></el-input>
          <span style="color: #333">小时</span>
        </el-form-item>

        <el-form-item label="分享宣传文案：" prop="groupDisseminate">
          <template v-if="pageType === 1">
            <!-- <el-input v-model="formData.groupDisseminate" placeholder="限100个汉字以内" maxlength="100"></el-input> -->
            <el-select v-model="formData.groupDisseminate" filterable allow-create default-first-option automatic-dropdown clearable placeholder="请选择或输入分享宣传文案" @blur="Propaganda()">
              <el-option
                v-for="item in publicityCopy"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>

          <template v-else>{{formData.remark}}</template>
        </el-form-item>

        <el-form-item label="开团条件：" prop="groupLimit" class="group-lable-show">
          <el-radio-group v-model="formData.groupLimit">
            <el-radio :label="0">不限制</el-radio>
            <el-radio :label="1">每天可以开一团</el-radio>
            <el-radio :label="2">有进行中的不允许开团</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="初始已拼人数：" prop="groupNumInit">
          <template v-if="pageType === 1">
            <el-input v-model="formData.groupNumInit" maxlength="10" placeholder="限10个字符,大于等于0的正整数"></el-input>
          </template>

          <template v-else>{{formData.remark}}</template>
        </el-form-item>
  
        <el-form-item label="拼团状态：" prop="groupStatus" class="group-lable-show">
          <el-radio-group v-model="formData.groupStatus">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
        </el-form-item>


      </el-form>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit('form')" v-if="pageType === 1">保存</el-button>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    // 校验正整数
    let validateInt = (rule, value, callback) => {
      if (value && !value.toString().match(/^[1-9]{1}\d{0,19}$/gi)) return callback(new Error('非负整数，限20个字符'))
      callback()
    }

    // 校验团购价
    let validateAssemblePrice = (rule, value, callback) => {
      let num = rule.field.split('.')[1]
      if (value === '' || value === null || !value && this.formData.specTableData[num].whetherAssemble) return callback(new Error('请输入拼团价'))
      if (value) {
        if (value && (value <= 0 || !value.toString().match(/\d/gi))) return callback(new Error('请输入大于0的正确拼团价'))
        // if (!value.toString().match(/\d/gi)) return callback(new Error('请输入正确的数值'))
        if (this.formData.specTableData[num].buyingPrice > value) return callback(new Error('拼团价不能小于进货价'))
        if (this.formData.specTableData[num].goodsPrice < value) return callback(new Error('拼团价不能大于销售价'))
        callback()
      }
      callback()
    }

    // 校验运营成本率
    let validatePercentile = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入运营成本率'))
     // let reg = /^\d+\.\d{2}$/gi
      let reg = /^\d+(\.\d{0,2})?$/
      if (value && !value.toString().match(reg)) return callback(new Error('请输入正数,精确到百分位'))
      callback()
    }

    // 校验税率
    let validatetax = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入税率'))
      let reg = /^\d+(\.\d{0,2})?$/
      if (value && !value.toString().match(reg)) return callback(new Error('请输入正数,精确到百分位'))
      callback()
    }

    /**
     * 校验拼团
     */
    let validateAssemble = (rule, value, callback) => {
      if (value === '' || value === null) return callback(new Error('拼团人数不能为空'))
      if (value && (value < 2 || value > 10000000 || !value.toString().match(/^\d+$/gi))) return callback(new Error('输入2~10000000正整数'))
      callback()
    }

    /**
     * 校验拼团时间
     */
    let validateGroupTime = (rule, value, callback) => {
      if (value === '' || value === null) return callback(new Error('拼团时间不能为空'))
      if (value && (value < 1 || value > 1000 || !value.toString().match(/^\d+$/gi))) return callback(new Error('输入1~1000正整数'))
      callback()
    }

    /**
     * 校验初始已拼人数
     */
    let validateGroupNumInit = (rule, value, callback) => {
      if (!value && parseInt(value) !== 0) return callback(new Error('初始已拼人数不能为空'))
      if (value && !value.toString().match(/^\d*$/gi)) return callback(new Error('输入大于等于0的正整数'))
      callback()
    }
    // let validateGroupNumInit = (rule, value, callback) => {
    //   if (!value || value === null) return callback(new Error('初始已拼人数不能为空'))
    //   if (value && (value < 0 || !value.toString().match(/^\d+$/gi))) return callback(new Error('输入大于等于0的正整数'))
    //   callback()
    // }

    return {
      pageType: 1,            // 页面类型 [1、设置，2、详情]
      setType: 1,             // 设置类型 [1、推广拉新-社群运营， 2、互动运营设置-芯豆管理, 3、互动运营设置-拼团设置]
      submitLoading: false,   // 提交loading

      allSpecialSale: false,  // 是否特卖
      allGetPoint: false,     // 是否获得积分
      isAssemble: false,      // 判断是否是拼团模块
      SupperSetting: {},      // 商品详情

      formData: {
        // title: {},
        id: '',
        goodsId: '',
        activeImgList: [],          // 活动图片展示列表
        activeImg: '',              // 活动图片地址
        multStandard: 2,            // 商品规格 [1、统一规格，2、多规格]
        specTableData: [],          // sku列表
        defaultPrice: 0,            // 默认价
        goodsSharePrice: '',        // 分享价
        goodsGoldBeanNum: 0,        // 芯豆数量
        points: '',                 // 获得积分
        remark: '',                 // 说明
        buyingPrice: 100,           // 进货价
        goodsPrice: 200,            // 进货价
        themeName: '',              // 拼团主题
        groupNum: 2,               // 拼团人数
        groupTime: 1,              // 拼团时间（小时）
        ifAutoGroup: 1,             // 自动组团（0：关闭，1：开启）
        surplusTime: '',            // 剩余多少时间（分钟）自动拼团完成
        groupLimit: 0,              // 参团条件
        // groupDisseminate: '',       // 分享宣传文案
        groupNumInit: '',           // 初始拼团人数
        groupStatus: 1,             // 拼团状态
        groupDisseminate: ''        // 宣传文案
      },
      rules: {
        activeImg: [{required: true, message: '请上传图片', trigger: 'change'}],
        remark: [{required: true, message: '请填写说明', trigger: 'blur'}],
        groupNum: [{required: true, validator: validateAssemble, trigger: 'blur'}],   // 校验拼团人数
        groupTime: [{required: true, validator: validateGroupTime, trigger: 'blur'}],
        surplusTime: [{required: true, validator: validateInt, trigger: 'blur'}],
        groupDisseminate: [{required: true, message: '分享宣传文案不能为空', trigger: 'change'}],
        groupNumInit: [{required: true, validator: validateGroupNumInit, trigger: 'blur'}]
      },
      publicityCopy: [                // 循环宣传文案
        {
          value: '邀请好友一起凑团享免单',
          label: '邀请好友一起凑团享免单'
        }, {
          value: '分享拼团商品得实惠',
          label: '分享拼团商品得实惠'
        }, {
          value: '参加拼团享福利',
          label: '参加拼团享福利'
        }, {
          value: ' 邀请好友拼团享豪礼',
          label: ' 邀请好友拼团享豪礼'
        }, {
          value: '价格高？伙拼到免单',
          label: '价格高？伙拼到免单'
        }, {
          value: '分享拼团，领商品福利',
          label: '分享拼团，领商品福利'
        }, {
          value: '快来拼团商品领福利',
          label: '快来拼团商品领福利'
        }, {
          value: '限时福利，参团即送，我们等你！',
          label: '限时福利，参团即送，我们等你！'
        }, {
          value: '没事儿就来和我一起组团赚钱吧',
          label: '没事儿就来和我一起组团赚钱吧'
        }, {
          value: '挑选好货，免费拼单，拼完即止',
          label: '挑选好货，免费拼单，拼完即止'
        }, {
          value: ' 快来，这拼团价格（福利）是真的，我领到了！',
          label: ' 快来，这拼团价格（福利）是真的，我领到了！'
        }, {
          value: ' 福利来了，小伙伴们都在等你一起喔',
          label: ' 福利来了，小伙伴们都在等你一起喔'
        }
      ],
      ruleGoodsOperatingCostRate: [{validator: validatePercentile, trigger: 'blur'}],   // 校验运营成本率
      ruleGoodsTaxRate: [{validator: validatetax, trigger: 'blur'}],   // 校验税
      ruleGoodsAssemblePrice: [{validator: validateAssemblePrice, trigger: 'blur'}],   // 校验拼团价
      defaultSkuId: '',         // 默认sku id
      skuTitleList: [],         // sku标题
      userInfo: {}              // 用户信息
    }
  },

  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
    }
  },

  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs['form'].clearValidate()
      }, 150)
    })
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.formData.maidData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'OperationCommunitySetting'))
    this.SupperSetting = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'SupperSetting'))
    if (this.$route.path.match(/details/gi)) this.pageType = 2
    this.formData.id = this.$route.query.id
    this.formData.goodsId = this.$route.query.goodsId
    if (this.formData.id && this.formData.goodsId) this.getDetailsData()
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
          disabled: !this.formData.specTableData.length
        }
      })
    },

    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/shareTheme/getThemeGoodSettingDetail', {
        id: this.formData.id,           // 是 int 关联分享商品数据主键
        goodsId: this.formData.goodsId  // 是 int 商品主键
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
        if (results.activityImage) this.formData.activeImgList.push({url: this.$Utils.filterImgUrl(results.activityImage)})
        this.formData.activeImg = results.activityImage
        this.formData.remark = results.activityRemark || ''
        this.formData.groupNum = results.groupNum || ''
        this.formData.groupTime = results.groupTime || ''
        this.formData.surplusTime = results.surplusTime
        this.formData.goodsGroupPrice = results.goodsGroupPrice
        this.formData.groupNum = results.groupNum          // 拼团人数
        this.formData.ifAutoGroup = parseInt(results.ifAutoGroup) || 0   // 自动组团（0：关闭，1：开启）
        this.formData.groupTime = results.groupTime        // 拼团时间（小时）
        this.formData.surplusTime = results.surplusTime    // 剩余多少时间（分钟）自动拼团完成
        this.formData.groupDisseminate = results.groupDisseminate    // 宣传文案
        this.formData.groupLimit = results.groupLimit ? results.groupLimit : 0     // 开团条件
        this.formData.groupNumInit = results.groupNumInit    // 初始已拼人数
        this.formData.groupStatus = results.groupStatus === null ? 1 : results.groupStatus    // 拼团状态

        let filterDefaultSku = results.goodsSkuList.filter(row => row.whetherDefaultSku === 1)
        results.goodsSkuList.forEach((row, index) => {
          // 选中默认sku
          if (!this.defaultSkuId && parseInt(row.disStatus) === 0 && (!filterDefaultSku.length || (filterDefaultSku.length && parseInt(filterDefaultSku[0].disStatus) === 1) || row.whetherDefaultSku === 1)) this.defaultSkuId = row.id
          row.whetherShare = row.whetherShare === 1 ? !!true : !!false
          row.ifGoodsGroupPrice = row.ifGoodsGroupPrice === 1 ? !!true : !!false

          if (!row.whetherShare) this.allSharePrice = false
          if (!row.ifGoodsGroupPrice) this.allAssemblePrice = false
          if (!row.whetherGoldBeanPrice) this.allGoldBeanPrice = false
          if (!row.whetherBonusPrice) this.allBonusPrice = false
          if (!row.whetherLeaguePrice) this.allLeaguePrice = false

          if (index === 0) {
            row.goodsSkuValList.forEach((list) => {
              this.skuTitleList.push(list.standardName)
            })
          }
        })
        this.formData.specTableData = results.goodsSkuList
        this.goodsAssemblePriceListChange()    // 拼团价
      })
    },

    /*
     * 图片上传成功
     */
    uploadSuccessHandle (url) {
      this.formData.activeImgList.push({url: this.$Utils.filterImgUrl(url)})
      this.formData.activeImg = url
    },

    /**
     * 拼团价选择
     */
    goodsAssemblePriceListChange (obj) {
      let selectLen = 0
      let visibleLen = 0
      this.formData.specTableData.forEach((row) => {
        if (row.ifGoodsGroupPrice && row.disStatus === 0) selectLen++
        if (row.disStatus === 0) visibleLen++
      })
      this.allSharePrice = selectLen === visibleLen
      if (obj) this.$refs['form'].validateField(obj)
    },

    /**
     * 一键同步
     * @param  {[String]} key [需要同步的键]
     */
    handleSync (key, index) {
      let currentObj = this.formData.specTableData[index]
      if (isNaN(currentObj[key]) || currentObj[key] <= 0) return false
      let defVal = null
      this.formData.specTableData.forEach((row, index) => {
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
     * 计算统一规格利润率
     */
    filterUnifiedProfitMargin () {},

    /**
     * 计算利润率
     */
    filterProfitMargin (item) {
      let goodsPrice = item.goodsGroupPrice && !isNaN(item.goodsGroupPrice) ? parseFloat(item.goodsGroupPrice) : item.goodsPrice
      let res = (goodsPrice - item.buyingPrice) / goodsPrice * 100
      return (res !== -Infinity && !isNaN(res)) ? res.toFixed(2) : ''
    },

    /**
     * 判断值是否存在
     */
    filterValueExist (value, type) {
      let res = 0
      if (value && value.toString().match(/^[1-9]{1}\d{0,19}$/gi)) {
        res = type ? parseFloat(value) * 0.15 : parseFloat(value)
        if (this.formData.maidData.ratio !== '' && this.formData.maidData.levels !== '') {
          let ratio = this.formData.maidData.ratio / 100
          let levels = this.formData.maidData.levels
          let preCount = 0
          for (let i = 0; i < levels; i++) {
            if (!preCount) {
              preCount = (res * ratio)
            } else {
              preCount = (preCount * ratio)
            }
            res += preCount
          }
        }
      }
      return res
    },

    /**
     * 校验宣传文案
     */
    Propaganda () {
      console.log('Propaganda', this.formData.groupDisseminate)
    },

    /**
     * 提交数据
     */
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        let skuUpdateList = this.$Utils.deepCopy(this.formData.specTableData)
        skuUpdateList.forEach((row) => {
          row.whetherDefaultSku = 0
          if (parseInt(this.defaultSkuId) === parseInt(row.id)) row.whetherDefaultSku = 1
          row.skuId = row.id
          row.whetherShare = row.whetherShare ? 1 : 0
          row.ifGoodsGroupPrice = row.ifGoodsGroupPrice ? 1 : 0
          row.whetherGoldBeanPrice = row.whetherGoldBeanPrice ? 1 : 0
          row.whetherBonusPrice = row.whetherBonusPrice ? 1 : 0
          row.whetherLeaguePrice = row.whetherLeaguePrice ? 1 : 0
          row.whetherGoldBeanNum = row.whetherGoldBeanNum ? 1 : 0
          row.goodsGoldBeanNum = parseFloat(row.goodsGoldBeanNum) || 0
        })
        this.submitLoading = true
        this.$http.post('@ROOT_API/shareTheme/themeGoodSettingEdit', {
          id: parseInt(this.formData.id),           // 是 int 关联分享商品数据主键
          skuId: parseInt(this.defaultSkuId),
          goodsId: parseInt(this.formData.goodsId), // 是 int 商品主键
          themeType: 9,                                        // 是 主题类型
          activityImage: '-',   // 是 string  商品活动图片
          activityRemark: this.formData.remark,     // 是 string  商品活动说明
          beInviterGetGoldPoints: this.formData.goldCoin,
          skuUpdateList: skuUpdateList,                                        // 是 list  商品sku对象集合
          groupNum: parseFloat(this.formData.groupNum),                        // 否 int 拼团人数
          groupTime: parseFloat(this.formData.groupTime),                      // 否 int 拼团时间（小时）
          ifAutoGroup: this.formData.ifAutoGroup,                              // 否 int 自动组团（0：关闭，1：开启）
          surplusTime: parseFloat(this.formData.surplusTime),                  // 否 int 剩余多少时间（分钟）自动拼团完成
          groupLimit: this.formData.groupLimit,   // 参团条件（0：不限制、1：每天可以参与一次、2：有进行中的不允许参与）
          groupDisseminate: this.formData.groupDisseminate,                    // 否 int 分享宣传文案 ，themeType=9时必传
          groupNumInit: this.formData.groupNumInit,                            // 否 int 初始拼团人数 ，themeType=9时必传
          groupStatus: this.formData.groupStatus                               // 拼团状态（0：关闭、1：开启） ，themeType=9时必传
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
            duration: 2000
          })
          this.$router.back()
        }).finally(() => {
          this.submitLoading = false
        })
      })
    }
  }
}
</script>

<style lang="less">
.operation-community-goods-setting{
  .el-form-item{
    margin-bottom: 20px;

    .el-input, .el-textarea{
      width: 380px;
    }
  }

  .profit-wrap{
    border-top: 1px solid #eee;
    padding-top: 20px;
  }

  .el-form-item.nesting-wrap{
    .el-checkbox{
      width: 85px;
    }

    .el-input{
      width: 265px;
    }

    .tips-text{
      color: #999;
      padding-left: 15px;
      /*font-size: 12px;*/
    }
  }

  .per-cent{
    right: 10px;
    top: 8px;

  }

  /* -------------------- { element sku table } -------------------- */
  .el-sku-table{
    td{
      .cell{
        overflow: inherit;
      }

      .el-form-item{
        margin-bottom: 0;
        .el-form-item__error{
          z-index: 99;
          padding-top: 0;
        }
      }
    }


    .el-input{
      width: 100%;
    }

    th, td{
      position: relative;
    }

    th{
      color: #909399;
      height: 40px;
      text-align: left;
      background: #eef1f9;
    }

    td{
      padding: 10px 0;
    }

    .pd-l{
      padding-left: 35px;
    }

    .pd-r{
      padding-right: 30px;
    }

    .sync-btn{
      fill: #2eaaf7;
      width: 30px;
      height: 30px;
      margin-top: -15px;
      right: 0;
      top: 50%;
    }
  }

  /* -------------------- { sku table } -------------------- */
  .sku-table{
    min-width: 700px;
    max-width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    th, td{
      position: relative;
    }

    .el-form-item{
      margin-bottom: 0;
    }

    .el-input{
      width: 100%;
    }

    th, td{
      text-align: left;
      padding: 0 10px;
      border: 1px solid #ebeef5;
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
    }

    .pd-l{
      padding-left: 35px;
    }

    .pd-r{
      padding-right: 30px;
    }

    .sync-btn{
      fill: #2eaaf7;
      width: 30px;
      height: 30px;
      margin-top: -15px;
      right: 0;
      top: 50%;
    }
  }
}
</style>

<style lang="less">
.operation-community-goods-setting{

  .upload-wrap.max{
    .el-upload{
      display: none !important;
    }
  }

  .profit-wrap{
    .el-form-item__error{
      left: 90px;
    }
  }

  .el-form-item__error{
    white-space: nowrap;
  }

  .el-radio__label{
    display: none;
  }

  .el-checkbox.pos-a{
    width: 14px;
    height: 14px;
    margin-top: -7px;
    left: 10px;
    top: 50%;

    .el-checkbox__input{
      vertical-align: top !important;
    }
  }

  .group-lable-show{
    .el-form-item__content{
      .el-radio__label{
        display: inline-block;
      }

      .grouping-atomatic{
        color: #999;
        margin-left: 20px;

        .el-input{
          width: 180px;
          margin: 0 10px;
        }

        .el-form-item__error{
          left: 205px;
        }

        span{
          color: #f5a74a;
        }
      }
    }
  }

}
</style>
