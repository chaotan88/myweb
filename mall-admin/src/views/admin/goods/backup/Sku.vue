<!-- sku -->
<template>
  <div class="sku-wrap">
    <el-form :model="formData" :rules="rules" ref="sku-form" label-width="180px">
      <template v-for="(item, index) in specList">
        <el-form-item :label="item.standardName + '：'" class="pos-r checkbox-item">
          <span class="el-icon-circle-close-outline cursor-p pos-a remove-btn" @click.prevent.stop="handleRemoveSpec(item, index)"></span>
          <el-checkbox-group class="d-ib" v-model="specSelectList[index].goodsStandarValList">
            <template v-for="(list, i) in item.goodsStandarValList">
              <el-checkbox class="va-t" :label="list" border :title="specDisabled && !specSelectList[index].goodsStandarValList.length ? '只允许选择两种规格属性组成SKU' : ''" :disabled="specDisabled && !specSelectList[index].goodsStandarValList.length" @change="specChange">{{list.standardValName}}
                <span class="el-icon-circle-close-outline pos-a close-btn" @click.prevent.stop="handleRemoveSpecVal(item.goodsStandarValList, list.id, i), handleRemoveSelectSpec(index, list.id)"></span>
              </el-checkbox>
            </template>
            <el-input style="width: 260px" maxlength="30" placeholder="新增规格值(限30个字符)" class="va-t" v-model="item.addValue">
              <template slot="append">
                <span class="cursor-p" @click="handleAddSpec(item)">添加</span>
              </template>
            </el-input>
          </el-checkbox-group>
        </el-form-item>
      </template>
      <el-form-item prop="skuLen">
        <el-button type="primary" @click="handleCreateAttributeBefore(2)">添加规格</el-button>
        <el-input v-model="formData.skuLen" class="d-n"></el-input>
      </el-form-item>
      
      <el-form-item>
        <table class="spec-table sku-table">
          <tr>
            <th width="100px" :class="{'vertical-line': index === 1}" v-for="(item, index) in skuTitle">{{item}}</th>
            <th class="vertical-line">条形码</th>
            <th class="vertical-line">当前库存</th>
            <th class="vertical-line" v-if="pageType !== 1">调整库存</th>
            <th class="vertical-line" v-if="pageType !== 1">实际库存</th>
            <th class="vertical-line"><div class="with-asterisk">进货价</div></th>
            <th class="vertical-line"><div class="with-asterisk">销售价</div></th>
            <!-- <th class="ta-l vertical-line"><el-checkbox :disabled="syncIndex === null" v-model="allSpecialSale" @change="specSaleStateChange"></el-checkbox>&nbsp;&nbsp;是否特卖</th> -->
            <!-- <th class="ta-l vertical-line"><el-checkbox :disabled="syncIndex === null" v-model="allExchange" @change="specIntegralStateChange"></el-checkbox>&nbsp;&nbsp;是否积分兑换</th> -->
            <th class="vertical-line">操作</th>
          </tr>
          <tr v-for="(item, index) in formData.specTableData" v-if="item.visible !== false">
            <template v-if="typeof item.standardValName !== 'string'">
              <td>{{item.standardValName[0]}}</td>
              <td>{{item.standardValName[1]}}</td>
              <!-- <td v-for="list in item.standardValName" v-if="item.standardValName">{{list}}</td> -->
            </template>
            <template v-else>
              <td v-if="item.standardValName">{{item.standardValName}}</td>
            </template>
            <!-- 条形码 -->
            <td class="pd-r">
              <el-form-item :prop="'specTableData.' + index + '.externalNo'">
                <el-input v-model="item.externalNo" placeholder="请输入条形码" maxlength="50"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('externalNo')">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <!-- 当前库存 -->
            <td :class="{'pd-r': pageType === 1}">
              <el-form-item :prop="'specTableData.' + index + '.currentGoodsNum'" :rules="ruleCurrentGoodsNum">
                <el-input v-model="item.currentGoodsNum" :disabled="pageType !== 1" @focus="updateGoodsData = item" @input="handleAddGoodsNum"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn" v-if="pageType === 1">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('currentGoodsNum')">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <!-- 调整库存 -->
            <td class="pd-r" v-if="pageType !== 1">
              <el-form-item :prop="'specTableData.' + index + '.updateGoodsNum'" :rules="ruleAdjustStock">
                <el-input v-model="item.updateGoodsNum" @focus="updateGoodsData = item" @input="handleUpdateGoodsNum"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('updateGoodsNum')">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <!-- 当前库存 -->
            <td v-if="pageType !== 1">
              <el-input v-model="item.goodsNum" disabled></el-input>
            </td>
            <!-- 进货价 -->
            <td class="pd-r">
              <el-form-item :prop="'specTableData.' + index + '.buyingPrice'" :rules="ruleBuyPrice">
                <el-input v-model="item.buyingPrice" @blur="inpBlur(index, 'buyingPrice')"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('buyingPrice')">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <!-- 销售价 -->
            <td class="pd-r">
              <el-form-item :prop="'specTableData.' + index + '.goodsPrice'" :rules="ruleSalePrice">
                <el-input v-model="item.goodsPrice" @blur="inpBlur(index, 'goodsPrice')"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('goodsPrice')">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <!-- <td class="pd-l pd-r">
              <el-checkbox class="pos-a" v-model="item.whetherSpecial" @change="specSaleListChange"></el-checkbox>
              <el-form-item :prop="'specTableData.' + index + '.goodsSpecialPrice'" :rules="rulePrice">
                <el-input v-model="item.goodsSpecialPrice" :disabled="!item.whetherSpecial" @blur="inpBlur(index, 'goodsSpecialPrice')"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('goodsSpecialPrice')">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <td class="pd-l pd-r">
              <el-checkbox class="pos-a" v-model="item.whetherPoints" @change="specIntegralListChange"></el-checkbox>
              <el-form-item :prop="'specTableData.' + index + '.points'" :rules="rulePoints">
                <el-input v-model="item.points" :disabled="!item.whetherPoints"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('points')">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td> -->
            <td width="80px">
              <el-button type="text" @click="handleClearSpec(item)">清空</el-button>
              <el-button type="text" @click="handleDisStatusChange(item)">{{parseInt(item.disStatus) === 1 ? '启用' : '禁用'}}</el-button>
            </td>
          </tr>
        </table>
      </el-form-item>
    </el-form>

    <el-dialog
      :title="addType === 1 ? '添加参数' : '添加规格'"
      :visible.sync="addAttributeVisible"
      width="400px">
        <el-form ref="add-attribute-form" :model="formData" :rules="rules" label-width="80px">
          <el-form-item :label="addType === 1 ? '参数名称' : '规格名称'" prop="createAttributeName">
            <el-input class="full-w" :placeholder="'请输入' + (addType === 1 ? '参数' : '规格') + '名称（30个字符内）'" maxlength="30" v-model="formData.createAttributeName"></el-input>
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
    
  </div>
</template>

<script>
export default {
  props: {
    // sku列表 (编辑)
    assignSkuData: {
      type: Array,
      default: []
    },
    // 根据商品分类id (商品小类)筛选规格列表
    goodsTypeId: {
      type: Number,
      default: null
    },
    spec: {
      type: Number,
      default: 0
    }
  },
  data () {
    // 条形码
    let validateExternalNo = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z]{0,30}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('限数字字母，30个字符长度'))
      callback()
    }

    // 进货价
    let validateBuyPrice = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入进货价'))
      if (value && value <= 0) return callback(new Error('必须是大于0的数字'))
      if (value && !value.toString().match(/^\d+\.\d{2}$/g)) return callback(new Error('请输入正确的数值'))
      callback()
    }

    // 销售价
    let validateSalePrice = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入销售价'))
      if (value && value <= 0) return callback(new Error('必须是大于0的数字'))
      if (value && !value.toString().match(/^\d+\.\d{2}$/g)) return callback(new Error('请输入正确的数值'))
      callback()
    }

    // 当前库存
    let validateNum = (rule, value, callback) => {
      if (value && !value.toString().match(/^[-]?\d+$/g)) return callback(new Error('请输入正确的数值'))
      callback()
    }

    // 积分兑换
    let validatePoints = (rule, value, callback) => {
      let num = parseInt(rule.field.split('.')[1])
      if (this.formData.specTableData[num].whetherPoints && !value) return callback(new Error('请输入积分兑换价格'))
      if (value && !value.toString().match(/^\d+$/g)) return callback(new Error('请输入正确的数值'))
      callback()
    }

    // 价格
    let validatePrice = (rule, value, callback) => {
      let num = parseInt(rule.field.split('.')[1])
      if (this.formData.specTableData[num].whetherSpecial && !value) return callback(new Error('请输入特卖价格'))
      if (value && !value.toString().match(/^\d+\.\d{2}$/g)) return callback(new Error('请输入正确的数值'))
      callback()
    }

    // 调整库存
    let validateAdjustStock = (rule, value, callback) => {
      if (value && !value.toString().match(/^[-]?\d+$/g)) return callback(new Error('请输入正确的数值'))
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

    // sku长度
    let validateSkuLen = (rule, value, callback) => {
      if (this.spec === 1 && !value) return callback(new Error(this.specList.length ? '请选择规格' : '规格不能为空'))
      callback()
    }
    return {
      isInit: false,                // 初始化完成
      pageType: 2,                  // 页面类型 [1、新增，2、编辑]
      formData: {
        createAttributeName: '',
        createAttributeValue: '',
        skuLen: null,               // sku长度
        specTableData: []
      },
      rules: {
        // 添加参数
        createAttributeName: [{required: true, validator: validateCreateAttributeName, trigger: 'blur'}],
        createAttributeValue: [{required: true, validator: validateCreateAttributeValue, trigger: 'blur'}],
        skuLen: [{validator: validateSkuLen, trigger: 'change'}]
      },
      skuTitle: [],                 // sku标题
      specSelectList: [],           // 规格选择列表
      specList: [],                 // 规格列表
      specDisabled: false,          // 当规格选择2个时禁用其它选择
      allSpecialSale: false,        // 是否特卖
      allExchange: false,           // 是否积分兑换
      syncIndex: null,              // 一键同步索引值
      ruleExternalNo: [{validator: validateExternalNo, trigger: 'blur'}],
      ruleBuyPrice: [{required: true, validator: validateBuyPrice, trigger: 'blur'}],
      ruleSalePrice: [{required: true, validator: validateSalePrice, trigger: 'blur'}],
      ruleCurrentGoodsNum: [{required: true, validator: validateNum, trigger: 'blur'}],
      ruleAdjustStock: [{validator: validateAdjustStock, trigger: 'blur'}],
      rulePoints: [{validator: validatePoints, trigger: 'blur'}],
      rulePrice: [{validator: validatePrice, trigger: 'blur'}],
      addAttributeVisible: false,   // 添加参数
      addType: 1,                   // 添加类型 [1、参数，2、规格]
      goodsId: '',                  // 商品id
      updateGoodsData: {},          // 当前调整库存数据
      editSpecSelectList: [],       // 编辑商品初始化保存第一次sku选择规格
      editGoodsTypeId: null         // 编辑商品初始化保存第一次传入小类id
    }
  },

  watch: {
    'goodsTypeId' (value) {
      if (!value) return false
      if (this.pageType === 2 && this.isInit === true) {
        if (value === this.editGoodsTypeId) {
          this.getEditSpecList()
        } else {
          this.getSpecList()
        }
      }
      if (this.pageType === 1 && value !== this.editGoodsTypeId) this.getSpecList()
    },

    'assignSkuData': {
      handler (value) {
        if (!value || !value.length) return false
        this.formData.specTableData = []
        value.forEach((row) => {
          let groupId = []
          let standardValName = []
          if (row.goodsSkuValList && row.goodsSkuValList.length) {
            row.goodsSkuValList.forEach((list) => {
              groupId.push(list.standardValId)
              standardValName.push(list.standardValName)
            })
          }
          this.formData.specTableData.push({
            id: row.id,
            groupId: groupId.length ? groupId.join('-') : row.id,
            standardValName: standardValName.length === 1 ? standardValName[0] : standardValName,
            visible: true,                        // 是否在列表显示
            disStatus: row.disStatus,             // 0启用 1禁用
            buyingPrice: row.buyingPrice,         // 进货价
            goodsPrice: row.goodsPrice,           // 销售价
            currentGoodsNum: row.currentGoodsNum, // 当前库存
            updateGoodsNum: null,                 // 调整库存
            goodsNum: row.goodsNum,               // 实际库存
            whetherSpecial: parseInt(row.whetherSpecial) === 1 ? !!true : !!false,  // 是否特卖
            goodsSpecialPrice: row.goodsSpecialPrice,                               // 特卖价格
            whetherPoints: parseInt(row.whetherPoints) === 1 ? !!true : !!false,    // 是否积分兑换
            points: row.points,                   // 兑换该商品所需积分
            goodsSkuValList: row.goodsSkuValList, // sku值集合,
            externalNo: row.externalNo            // 条形码
          })
        })
        this.specChange()
      },
      deep: true
    }
  },

  mounted () {
    this.pageType = this.$route.path.match(/add/gi) ? 1 : 2
    this.goodsId = parseInt(this.$route.query.id)
    if (this.goodsId) this.getEditSpecList()
    setTimeout(() => {
      this.isInit = true
      this.editGoodsTypeId = this.$Utils.deepCopy(this.goodsTypeId)
    }, 500)
  },

  methods: {
    /**
     * 获取规格列表
     */
    getSpecList () {
      this.$http.post('@ROOT_API/standard/getStandardByGoodsType', {
        attributeTypeId: this.goodsTypeId
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
        this.specList = results
        this.specSelectList = []
        results.forEach((row) => {
          this.specSelectList.push({
            id: row.id,
            standardName: row.standardName,
            goodsStandarValList: []
          })
        })
        this.specChange()
      })
    },

    /**
     * 查询所有规格列表  ( 2019-3-1 改为post请求 )
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
        this.specList = results
        this.specSelectList = []
        results.forEach((row, index) => {
          let goodsStandarValList = []
          if (row.goodsStandarValList && row.goodsStandarValList.length) {
            row.goodsStandarValList.forEach((list) => {
              if (list.isSelected === true) {
                goodsStandarValList.push(list)
              }
            })
          }
          this.specSelectList.push({
            id: row.id,
            standardName: row.standardName,
            goodsStandarValList
          })
        })
        this.syncIndex = 0
        // this.specSaleListChange()
        // this.specIntegralListChange()
        this.specChange()
      })
    },

    /**
     * 创建参数前操作
     */
    handleCreateAttributeBefore (type) {
      if (!this.goodsTypeId) {
        this.$message({
          message: '请选择商品分类',
          duration: 1500,
          type: 'error'
        })
        return false
      }
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
        let standardValName = []
        let splitVal = this.formData.createAttributeValue.split(',')
        splitVal.forEach((row) => {
          if (row) standardValName.push(row)
        })
        this.$http.post('@ROOT_API/standard/saveStandard', {
          attributeTypeId: this.goodsTypeId,                // 是 int 商品分类id (商品小类)
          standardName: this.formData.createAttributeName,  // 是 string  规格名称
          standardValName: standardValName.join(',')        // 是 String  规格值 多个规格英文逗号分开
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
          this.specList.push(results)
          this.specSelectList.push({
            id: results.id,
            attributeType: 1,
            standardName: results.standardName,
            goodsStandarValList: []
          })
          this.addAttributeVisible = false
        })
      })
    },

    /**
     * 新增规格值
     */
    handleAddSpec (obj) {
      if (!obj.addValue) return false
      this.$http.post('@ROOT_API/standard/saveStandardVal', {
        standardId: obj.id,             // 是 int 商品分类id (商品小类)
        standardValName: obj.addValue   // 是 string  规格名称
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
        obj.addValue = ''
        obj.goodsStandarValList.push({
          id: resData.data.id,
          standardValName: resData.data.standardValName
        })
        // this.specSelectList.unshift({
        //   goodsStandarValList: []
        // })
      })
    },

    /**
     * 移除参数
     */
    handleRemoveSpec (obj, index) {
      this.$http.get('@ROOT_API/standard/delStandardById', {
        params: {
          standardId: obj.id
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
        this.$message({
          message: resData.msg,
          duration: 1000,
          type: 'success'
        })
        this.specList.splice(index, 1)
        this.specSelectList.splice(index, 1)
        this.specChange()
      })
    },

    /**
     * 移除参数值
     */
    handleRemoveSpecVal (obj, id, index) {
      this.$http.get('@ROOT_API/standard/delStandardValById', {
        params: {
          standardValId: id
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
        this.$message({
          message: resData.msg,
          duration: 1000,
          type: 'success'
        })
        obj.splice(index, 1)
        this.formData.specTableData.forEach((row, i) => {
          if (row.id === id) this.formData.specTableData.splice(i, 1)
        })
      })
    },

    /**
     * 移除已选择规格值
     */
    handleRemoveSelectSpec (index, id) {
      this.specSelectList[index].goodsStandarValList.forEach((row, i) => {
        if (row.id.toString() === id.toString()) this.specSelectList[index].goodsStandarValList.splice(i, 1)
      })
      this.specChange()
    },

    /**
     * 规格选择
     */
    specChange () {
      this.syncIndex = null
      this.skuTitle = []
      // 过滤单选或组合选择
      let filterSelect = this.specSelectList.filter((row) => {
        if (row.goodsStandarValList.length !== 0) {
          this.skuTitle.push(row.standardName)
          return row
        }
      })
      this.formData.skuLen = filterSelect.length
      this.specDisabled = this.skuTitle.length === 2 ? !!true : !!false
      let tableIds = []
      this.formData.specTableData.map((row, index) => {
        row.visible = false
        tableIds.push(row.groupId)
      })
      if (!filterSelect.length) return false
      let filterSpecGroup = filterSelect.length === 2 ? this.specGroup(filterSelect[0].goodsStandarValList, filterSelect[1].goodsStandarValList) : this.specGroup(filterSelect[0].goodsStandarValList)
      filterSpecGroup.forEach((row) => {
        if (tableIds.indexOf(row.groupId.toString()) === -1) {
          this.formData.specTableData.push({
            id: row.id,
            groupId: row.groupId,
            standardValName: row.standardValName,
            visible: true,          // 是否在列表显示
            disStatus: 0,           // 0启用 1禁用
            buyingPrice: '',        // 进货价
            goodsPrice: '',         // 销售价
            externalNo: '',         // 条形码
            currentGoodsNum: 0,     // 当前库存
            updateGoodsNum: '',     // 调整库存
            goodsNum: 0,            // 实际库存
            whetherSpecial: false,  // 是否特卖
            goodsSpecialPrice: '',  // 特卖价格
            whetherPoints: false,   // 是否积分兑换
            points: ''              // 兑换该商品所需积分
          })
        } else {
          this.formData.specTableData.forEach((list) => {
            if (list.groupId.toString() === row.groupId.toString()) list.visible = true
          })
        }
      })
      this.formData.specTableData.forEach((row, index) => {
        this.inpBlur(index, 'goodsSpecialPrice')
        this.inpBlur(index, 'buyingPrice')
        this.inpBlur(index, 'goodsPrice')
        // this.$Utils.blurAutoCompletion(row, 'goodsSpecialPrice')
        if (row.visible && this.syncIndex === null) this.syncIndex = index
      })
      this.specSaleListChange()
      this.specIntegralListChange()
    },

    /**
     * 规格组合
     */
    specGroup (first, second) {
      let result = []
      if (second) {
        second.forEach((row) => {
          first.forEach((list) => {
            result.push({
              id: '',
              groupId: list.id + '-' + row.id,
              standardValName: [list.standardValName, row.standardValName]
            })
          })
        })
      } else {
        first.forEach((row) => {
          result.push({
            id: '',
            groupId: row.id,
            standardValName: row.standardValName
          })
        })
      }
      return result
    },

    /**
    * 价格输入框自动补全价格
    */
    inpBlur (index, obj) {
      this.$Utils.blurAutoCompletion(this.formData.specTableData[index], obj)
    },

    /**
     * 一键同步
     * @param  {[String]} key [需要同步的键]
     */
    handleSync (key) {
      let defVal = null
      this.formData.specTableData.forEach((row, index) => {
        if (row.visible) {
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
          this.$refs['sku-form'].clearValidate('specTableData.' + index + '.' + key)
        }
      })
      this.$refs['sku-form'].clearValidate(key)
    },

    /**
     * 新增时当前库存关联实际库存
     */
    handleAddGoodsNum (value) {
      if (!value || isNaN(value)) return false
      this.updateGoodsData.goodsNum = value
    },

    /**
     * 调整库存
     */
    handleUpdateGoodsNum (value) {
      if (!value || isNaN(value)) {
        this.updateGoodsData.goodsNum = this.updateGoodsData.currentGoodsNum
        return false
      }
      let currentGoodsNum = parseInt(this.updateGoodsData.currentGoodsNum)
      this.updateGoodsData.goodsNum = currentGoodsNum ? currentGoodsNum + parseInt(value) : parseInt(value)
    },

    /**
     * 是否全选特卖
     */
    specSaleStateChange (value) {
      this.formData.specTableData.forEach((row) => {
        if (row.visible) row.whetherSpecial = value
      })
    },

    /**
     * 是否全选积分兑换
     */
    specIntegralStateChange (value) {
      this.formData.specTableData.forEach((row) => {
        if (row.visible) row.whetherPoints = value
      })
    },

    /**
     * 是否特卖列表状态改变
     */
    specSaleListChange () {
      let status = true
      this.formData.specTableData.forEach((row) => {
        if (row.visible && row.whetherSpecial === false) status = false
      })
      this.allSpecialSale = status
    },

    /**
     * 是否积分列表状态改变
     */
    specIntegralListChange (value) {
      let status = true
      this.formData.specTableData.forEach((row) => {
        if (row.visible && row.whetherPoints === false) status = false
      })
      this.allExchange = status
    },

    /**
     * 清除规格数据
     */
    handleClearSpec (obj) {
      this.formData.specTableData.forEach((row) => {
        if (row.groupId.toString() === obj.groupId.toString()) {
          row.buyingPrice = ''
          row.goodsPrice = ''
          row.externalNo = ''
          row.currentGoodsNum = ''
          row.updateGoodsNum = ''
          row.goodsNum = ''
          row.goodsSpecialPrice = ''
          row.points = ''
        }
      })
    },

    /**
     * sku状态 禁用 || 启用
     */
    handleDisStatusChange (obj) {
      obj.disStatus = parseInt(obj.disStatus) === 1 ? 0 : 1
    },

    /**
     * 禁用规格数据
     */
    handleDisabledSpec (id) {
      this.formData.specTableData.forEach((row) => {
        if (row.id.toString() === id.toString()) row.disabled = true
      })
    },

    /**
     * 校验表单
     */
    handleValidateForm () {
      let filterSelect = this.specSelectList.filter((row) => row.goodsStandarValList.length !== 0)
      this.formData.skuLen = filterSelect.length || null
      this.$refs['sku-form'].validate((valid) => {
        if (!valid) {
          this.$emit('validate', false)
          return false
        } else {
          let results = []
          this.formData.specTableData.forEach((row) => {
            if (row.visible) {
              // 过滤关联id
              let goodsSkuValList = []
              let splitId = row.groupId.toString().split('-')
              splitId.forEach((standardValId, i) => {
                goodsSkuValList.push({
                  id: row.goodsSkuValList ? row.goodsSkuValList[i].id : '',
                  standardId: filterSelect[i].id,
                  standardValId
                })
              })
              // 组合结果集
              results.push({
                id: this.pageType === 2 ? row.id : '',
                buyingPrice: row.buyingPrice,
                goodsPrice: row.goodsPrice,
                currentGoodsNum: row.currentGoodsNum ? row.currentGoodsNum : 0,
                updateGoodsNum: row.updateGoodsNum ? row.updateGoodsNum : 0,
                goodsNum: row.goodsNum ? row.goodsNum : 0,
                disStatus: row.disStatus,
                whetherSpecial: row.whetherSpecial ? 1 : 0,
                goodsSpecialPrice: row.goodsSpecialPrice,
                whetherPoints: row.whetherPoints ? 1 : 0,
                points: row.points,
                goodsSkuValList: row.goodsSkuValList ? row.goodsSkuValList : goodsSkuValList,
                externalNo: row.externalNo
              })
            }
          })
          // console.log('results: ', results)
          // this.$emit('validate', false)
          this.$emit('validate', true, results)
          return true
        }
      })
    }
  }
}
</script>

<style lang="less">
.sku-wrap{

  .close-btn, .remove-btn{
    color: #999;
    font-size: 16px;
    background: #fff;
    border-radius: 100%;
  }

  .remove-btn{
    left: -30px;
  }

  .close-btn{
    top: -5px;
    right: -5px;
    display: none;
  }

  .close-btn:hover, .remove-btn:hover{
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

  /* -------------------- { sku table } -------------------- */
  .sku-table{
    min-width: 700px;
    max-width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    .el-form-item{
      margin-bottom: 0;
    }

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

    td.pd-l{
      padding-left: 35px;
    }

    td.pd-r{
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

  .vertical-line::before{
    color: #999;
    content: ' ';
    width: 1px;
    height: 16px;
    display: inline-block;
    margin-right: 5px;
    margin-top: -8px;
    background: #999;
    position: absolute;
    left: 0;
    top: 50%;
  }
}
</style>
