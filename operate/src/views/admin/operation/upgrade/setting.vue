  <!-- 关联商品设置 -->
<template>
  <common-tpl class="operation-community-goods-setting" footer back>
    <template slot="main">
      <el-form :model="formData" ref="form" :rules="rules" label-width="160px">
        <gray-title>内容配置</gray-title>
        <br>
        <el-form-item label="商品名称:">{{settingData.goodsName | filterEmpty}}</el-form-item>

        <gray-title>价格配置</gray-title>
        <!-- 统一规格 -->
<!--        <template v-if="formData.multStandard === 1">
          <el-form-item label="进货价：">{{formData.buyingPrice | filterEmpty}}</el-form-item>
          <el-form-item label="销售价：">{{formData.goodsPrice | filterEmpty}}</el-form-item>
          <el-form-item label="分享价：" prop="goodsSharePrice">
            <el-input size="small" v-model="formData.goodsSharePrice"></el-input>
          </el-form-item>
          <el-form-item label="获得积分：" prop="points">
            <el-input size="small" v-model="formData.points"></el-input>
          </el-form-item>
          <el-form-item label="利润率：">{{filterUnifiedProfitMargin() | filterEmpty}}</el-form-item>
          <el-form-item label="兑换芯豆数量：" prop="goodsGoldBeanNum">
            <el-input size="small" v-model="formData.goodsGoldBeanNum"></el-input>
          </el-form-item>
        </template>-->

        <!-- 多规格 -->
        <template>
          <br>
          <el-form-item>
            <el-table border :data="formData.skuUpdateList" class="el-sku-table">
              <el-table-column label="默认规格" width="80px" align="center">
                <template slot-scope="scope">
                  <template v-if="formData.multStandard === 2">
                    <el-radio v-model="defaultSkuId" :label="scope.row.id" :disabled="pageType === 2 || parseInt(scope.row.disStatus) === 1" :title="parseInt(scope.row.disStatus) === 1 ? '已被禁用，不能勾选' : ''"></el-radio>
                  </template>
                  <template v-else>
                    统一规格
                  </template>
                </template>
              </el-table-column>

              <el-table-column :label="item" min-width="100px" :key="index" v-for="(item, index) in skuTitleList">
                <template slot-scope="scope">
                  <template v-if="scope.row.goodsSkuValList.length">{{scope.row.goodsSkuValList[index].standardValName}}</template>
                </template>
              </el-table-column>

<!--              <el-table-column label="条形码" min-width="120px">
                <template slot-scope="scope">{{scope.row.externalNo | filterEmpty}}</template>
              </el-table-column>-->

              <el-table-column label="当前库存" min-width="100px" :key="Math.random()">
                <template slot-scope="scope">{{scope.row.goodsNum | filterMoney}}</template>
              </el-table-column>

              <el-table-column label="进货价" min-width="100px">
                <template slot-scope="scope">{{scope.row.buyingPrice | filterMoney}}</template>
              </el-table-column>
              <el-table-column label="销售价" min-width="100px">
                <template slot-scope="scope">{{scope.row.goodsPrice | filterMoney}}</template>
              </el-table-column>

              <el-table-column label="套餐价" width="180px">
                <template slot-scope="scope">
                  <div class="pos-r" :class="{'pd-r': pageType === 1}">
                    <el-form-item label-width="0" :prop="'skuUpdateList.' + scope.$index + '.upgradePackagePrice'" :rules="ruleGoodsAssemblePrice">
                      <el-input size="small" v-model="scope.row.upgradePackagePrice" v-auto-price></el-input>
                    </el-form-item>
                    <ali-icon icon="icon-jiantou3" :size="30" title="一键同步" class="cursor-p pos-a sync-btn" @click.native="handleSync('upgradePackagePrice', scope.$index)" v-if="scope.$index === 0"></ali-icon>
                  </div>
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

        <el-form-item label="宣传图片：" prop="propagandaImage" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
          <thumbnail-component :empty="false" :styles="upload100" :link="true" del :auto-delete="true" :list="imageList" style="width: 100%;height: 100%;" @change="deleteImg($event, imageList)">
            <template slot="other">
              <el-input size="small" style="display: none" v-model="formData.propagandaImage"></el-input>
              <upload-component :styles="upload100" @success="uploadimageListuccess($event, imageList)" v-if="!imageList.length"></upload-component>
              <div class="va-t d-ib" style="color: #f5a74a; line-height: 30px; padding: 18px 0 0 15px;">
                <template>图片建议尺寸：414 * 414px ；建议大小：100KB以内</template>
              </div>
            </template>
          </thumbnail-component>
        </el-form-item>

        <el-form-item label="宣传文案：" prop="propagandaInfo">
          <template>
             <el-input size="small" v-model="formData.propagandaInfo" type="textarea" placeholder="限100个汉字以内" rows="4" maxlength="100"></el-input>
<!--            <el-select v-model="formData.propagandaInfo" filterable allow-create default-first-option automatic-dropdown clearable placeholder="请选择或输入宣传文案" @blur="Propaganda()">
              <el-option
                v-for="item in publicityCopy"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>-->
          </template>
        </el-form-item>

        <el-form-item label="状态：" prop="upgradePackageStatus" :rules="[{required: true, message: '不能为空',trigger: 'change'}]">
          <el-radio-group v-model="formData.upgradePackageStatus">
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
   // let validateInt = (rule, value, callback) => {
   //   if (value && !value.toString().match(/^[1-9]{1}\d{0,19}$/gi)) return callback(new Error('非负整数，限20个字符'))
   //   callback()
   // }

    // 校验套餐价
    let validateAssemblePrice = (rule, value, callback) => {
      let num = rule.field.split('.')[1]
      if (value === '' || value === null || !value) return callback(new Error('请输入套餐价'))
      if (value) {
        if (value && (value <= 0 || !value.toString().match(/\d/gi))) return callback(new Error('请输入大于0的正确套餐价'))
        // if (!value.toString().match(/\d/gi)) return callback(new Error('请输入正确的数值'))
        if (this.formData.skuUpdateList[num].buyingPrice > value) return callback(new Error('套餐价不能小于进货价'))
      //  if (this.formData.skuUpdateList[num].goodsPrice < value) return callback(new Error('套餐价不能大于销售价'))
        callback()
      }
      callback()
    }

    return {
      pageType: 1,            // 页面类型 [1、设置，2、详情]
      submitLoading: false,   // 提交loading
      settingData: {},      // 商品详情
      formData: {
        id: '',
        goodsId: '',
        activityImage: '-',
        activityRemark: '',
        propagandaImage: '',       // 宣传图片
        multStandard: 2,            // 商品规格 [1、统一规格，2、多规格]
        skuUpdateList: [],          // sku列表
        upgradePackageStatus: 1,             // 状态
        propagandaInfo: ''        // 宣传文案
      },
      imageList: [],
      rules: {
        propagandaInfo: [{required: true, message: '宣传文案不能为空', trigger: 'change'}]
      },
      upload100: {width: '100px', height: '100px'},
      ruleGoodsAssemblePrice: [{validator: validateAssemblePrice, trigger: 'blur'}],   // 校验套餐价
      defaultSkuId: '',         // 默认sku id
      skuTitleList: [],         // sku标题
      userInfo: {}              // 用户信息
    }
  },

  computed: {
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.settingData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'settingData'))
    this.formData.id = this.$route.query.id
    this.formData.goodsId = this.$route.query.goodsId
    this.formData.themeType = this.$route.query.type
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
          disabled: !this.formData.skuUpdateList.length
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
        let filterDefaultSku = results.goodsSkuList.filter(row => row.whetherDefaultSku === 1)
        results.goodsSkuList.forEach((row, index) => {
          // 选中默认sku
          if (!this.defaultSkuId && parseInt(row.disStatus) === 0 && (!filterDefaultSku.length || (filterDefaultSku.length && parseInt(filterDefaultSku[0].disStatus) === 1) || row.whetherDefaultSku === 1)) this.defaultSkuId = row.id

          if (index === 0) {
            row.goodsSkuValList.forEach((list) => {
              this.skuTitleList.push(list.standardName)
            })
          }
        })
        this.formData.skuUpdateList = results.goodsSkuList
        this.formData.propagandaImage = results.propagandaImage
        this.formData.propagandaInfo = results.propagandaInfo
        this.formData.upgradePackageStatus = results.upgradePackageStatus

        if (results.propagandaImage) {
          this.imageList = [{url: this.$Utils.filterImgUrl(results.propagandaImage), imageUrl: results.propagandaImage}]
        } else {
          this.imageList = []
        }
       // this.goodsAssemblePriceListChange()    // 套餐价
      })
    },
    uploadimageListuccess (url, imgList) {
      imgList.push({url: this.$Utils.filterImgUrl(url), imageUrl: url})
      this.formData.propagandaImage = url
    },

    /**
     * 商品图片删除（除主图外，其他全部图片删除加调）
     */
    deleteImg (event, imgList) {
      imgList = event
      this.formData.propagandaImage = ''
    },

    /**
     * 套餐价选择
     */
    goodsAssemblePriceListChange (obj) {
      let selectLen = 0
      let visibleLen = 0
      this.formData.skuUpdateList.forEach((row) => {
        if (row.ifupgradePackagePrice && row.disStatus === 0) selectLen++
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
      let currentObj = this.formData.skuUpdateList[index]
      if (isNaN(currentObj[key]) || currentObj[key] <= 0) return false
      let defVal = null
      this.formData.skuUpdateList.forEach((row, index) => {
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
      let goodsPrice = item.upgradePackagePrice && !isNaN(item.upgradePackagePrice) ? parseFloat(item.upgradePackagePrice) : item.goodsPrice
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

    },

    /**
     * 提交数据
     */
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.submitLoading = true
        let data = this.$Utils.deepCopy(this.formData)
        data.skuUpdateList.forEach((row) => {
          row.whetherDefaultSku = 0
          if (parseInt(this.defaultSkuId) === parseInt(row.id)) row.whetherDefaultSku = 1
          this.$set(row, 'skuId', row.id)
        })
        data.skuId = parseInt(this.defaultSkuId)
        this.$http.post('@ROOT_API/shareTheme/themeGoodSettingEdit', data).then((res) => {
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
    .el-radio__label{
      display: none;
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
