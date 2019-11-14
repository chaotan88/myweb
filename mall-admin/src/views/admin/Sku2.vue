<!-- sku -->
<template>
  <div class="sku-wrap">
    <el-form :model="formData" ref="sku-form" label-width="150px">
      <template v-for="(item, index) in specList">
        <el-form-item :label="item.standardName + '：'" class="checkbox-item">
          <el-checkbox-group class="d-ib" v-model="specSelectList[index].goodsStandarValList">
            <template v-for="(list, i) in item.goodsStandarValList">
              <el-checkbox class="va-t" :label="list" border :title="specDisabled && !specSelectList[index].goodsStandarValList.length ? '只允许选择两种规格属性组成SKU' : ''" :disabled="specDisabled && !specSelectList[index].goodsStandarValList.length" @change="specChange">{{list.standardValName}}
                <span class="el-icon-circle-close-outline pos-a close-btn" @click.prevent.stop="handleRemoveSpec(item.goodsStandarValList, list.id, i), handleRemoveSelectSpec(index, list.id)"></span>
              </el-checkbox>
            </template>
            <el-input style="width: 260px" maxlength="10" placeholder="新增规格值(限10个字符)" class="va-t" v-model="item.addValue">
              <template slot="append">
                <span class="cursor-p" @click="handleAddSpec(item)">添加</span>
              </template>
            </el-input>
          </el-checkbox-group>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="handleCreateAttributeBefore(2)">添加规格</el-button>
      </el-form-item>
      
      <el-form-item>
        <table class="spec-table sku-table">
          <tr>
            <th width="100px" v-for="item in skuTitle">{{item}}</th>
            <th><div class="with-asterisk">进货价</div></th>
            <th><div class="with-asterisk">销售价</div></th>
            <th>当前库存</th>
            <th>调整库存</th>
            <th>实际库存</th>
            <th class="ta-l"><el-checkbox :disabled="syncIndex === null" v-model="allSpecialSale" @change="specSaleStateChange"></el-checkbox>&nbsp;&nbsp;是否特卖</th>
            <th class="ta-l"><el-checkbox :disabled="syncIndex === null" v-model="allExchange" @change="specIntegralStateChange"></el-checkbox>&nbsp;&nbsp;是否积分兑换</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item, index) in formData.specTableData" v-if="item.visible !== false">
            <template v-if="typeof item.standardValName !== 'string'">
              <td v-for="list in item.standardValName" v-if="item.standardValName">{{list}}</td>
            </template>
            <template v-else>
              <td v-if="item.standardValName">{{item.standardValName}}</td>
            </template>
            <td class="pd-r">
              <el-form-item :prop="'specTableData.' + index + '.buyPrice'" :rules="ruleBuyPrice">
                <el-input v-model="item.buyPrice" :disabled="item.disabled" @blur="inpBlur(index, 'buyPrice')"></el-input>
              </el-form-item>
              <span title="一键同步">
                <svg class="icon icon-jiantou3 cursor-p pos-a" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('buyPrice')">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <td class="pd-r">
              <el-form-item :prop="'specTableData.' + index + '.salePrice'" :rules="ruleSalePrice">
                <el-input v-model="item.salePrice" :disabled="item.disabled" @blur="inpBlur(index, 'salePrice')"></el-input>
              </el-form-item>
              <span title="一键同步">
                <svg class="icon icon-jiantou3 cursor-p pos-a" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('salePrice')">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <td><el-input v-model="item.currentStock" disabled></el-input></td>
            <td class="pd-r">
              <el-form-item :prop="'specTableData.' + index + '.adjustStock'" :rules="ruleAdjustStock">
                <el-input v-model="item.adjustStock" :disabled="item.disabled"></el-input>
                <span title="一键同步">
                  <svg class="icon icon-jiantou3 cursor-p pos-a" aria-hidden="true" title="一键同步" v-if="index === syncIndex" @click="handleSync('adjustStock')">
                    <use xlink:href="#icon-jiantou3"></use>
                  </svg>
                </span>
              </el-form-item>
            </td>
            <td>
              <el-input v-model="item.actualStock" disabled></el-input>
            </td>
            <td class="pd-l pd-r">
              <el-checkbox class="pos-a" v-model="item.specialSale" @change="specSaleListChange"></el-checkbox>
              <el-input v-model="item.actualStock" :disabled="item.disabled"></el-input>
              <span title="一键同步">
                <svg class="icon icon-jiantou3 cursor-p pos-a" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('actualStock')">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <td class="pd-l pd-r">
              <el-checkbox class="pos-a" v-model="item.exchange" @change="specIntegralListChange"></el-checkbox>
              <el-input v-model="item.actualStock" :disabled="item.disabled"></el-input>
              <span title="一键同步">
                <svg class="icon icon-jiantou3 cursor-p pos-a" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('actualStock')">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <td width="80px">
              <el-button type="text" @click="handleClearSpec(item.id)">清空</el-button>
              <el-button type="text" @click="item.disabled = !item.disabled">{{item.disabled ? '启用' : '禁用'}}</el-button>
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
            <el-input class="full-w" :placeholder="'请输入' + addType === 1 ? '参数' : '规格' + '名称（10个字符以内）'" v-model="formData.createAttributeName"></el-input>
          </el-form-item>
          <el-form-item :label="addType === 1 ? '参数值' : '规格值'" prop="createAttributeValue">
            <el-input class="full-w" :placeholder="'请输入' + addType === 1 ? '参数' : '规格' + '值（多个以英文逗号分隔）'" v-model="formData.createAttributeValue"></el-input>
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
    // 根据商品分类id (商品小类)筛选规格列表
    goodsTypeId: {
      type: Number,
      default: null
    }
  },
  data () {
    // 进货价
    let validateBuyPrice = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入进货价'))
      callback()
    }
    // 销售价
    let validateSalePrice = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入销售价'))
      callback()
    }
    // 调整库存
    let validateAdjustStock = (rule, value, callback) => {
      if (value && !value.toString().match(/^(-|\+){1}\d+$/g)) return callback(new Error('请输入正确的数值'))
      callback()
    }

    // 参数 || 规格名称
    let validateCreateAttributeName = (rule, value, callback) => {
      if (!value) return callback(new Error(this.addType === 1 ? '请输入参数名称' : '请输入规格名称'))
      if (value.length > 10) return callback(new Error('10个字符以内'))
      callback()
    }

    // 参数 || 规格值
    let validateCreateAttributeValue = (rule, value, callback) => {
      if (!value) return callback(new Error(this.addType === 1 ? '请输入参数值' : '请输入规格值'))
      callback()
    }
    return {
      pageType: 1,                  // 页面类型 [1、新增，]
      formData: {
        createAttributeName: '',
        createAttributeValue: '',
        specTableData: []
      },
      rules: {
        // 添加参数
        createAttributeName: [{required: true, validator: validateCreateAttributeName, trigger: 'blur'}],
        createAttributeValue: [{required: true, validator: validateCreateAttributeValue, trigger: 'blur'}]
      },
      skuTitle: [],                 // sku标题
      specTableData: [],            // 规格表格数据
      specSelectList: [],           // 规格选择列表
      specList: [],                 // 规格列表
      specDisabled: false,          // 当规格选择2个时禁用其它选择
      allSpecialSale: false,        // 是否特卖
      allExchange: false,           // 是否积分兑换
      syncIndex: null,              // 一键同步索引值
      ruleBuyPrice: [{required: true, validator: validateBuyPrice, trigger: 'blur'}],
      ruleSalePrice: [{required: true, validator: validateSalePrice, trigger: 'blur'}],
      ruleAdjustStock: [{validator: validateAdjustStock, trigger: 'blur'}],
      addAttributeVisible: false,   // 添加参数
      addType: 1                    // 添加类型 [1、参数，2、规格]
    }
  },

  watch: {
    'goodsTypeId' () {
      this.getSpecList()
    }
  },

  mounted () {
    // setTimeout(() => {
    //   // 测试
    //   let tempName = ['颜色', '尺寸', '份量']
    //   let tempValue = ['黄色,红色,蓝色', 'S,M,L', '小,中,大']
    //   tempName.forEach((row, index) => {
    //     this.formData.createAttributeName = row
    //     this.formData.createAttributeValue = tempValue[index]
    //     this.handleCreateAttribute()
    //   })
    // }, 100)
  },

  methods: {
    /**
     * 获取规格列表
     */
    getSpecList () {
      this.$http.post('@ROOT_API/standard/getStandardByGoodsType', {
        goodsTypeId: this.goodsTypeId
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
        results.forEach((row) => {
          this.specSelectList.push({
            id: '',
            attributeType: 1,
            specName: row.standardName,
            goodsStandarValList: []
          })
        })
      })
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
        let standardValName = []
        let splitVal = this.formData.createAttributeValue.split(',')
        splitVal.forEach((row) => {
          if (row) standardValName.push(row)
        })
        this.$http.post('@ROOT_API/standard/saveStandard', {
          goodsTypeId: this.goodsTypeId,                    // 是 int 商品分类id (商品小类)
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
            id: '',
            attributeType: 1,
            specName: results.standardName,
            goodsStandarValList: []
          })
          this.addAttributeVisible = false
        })
      // let attributeValList = []
      // let splitValue = this.formData.createAttributeValue.split(',')
      // splitValue.forEach((row, index) => {
      //   if (row) {
      //     attributeValList.push({
      //       id: new Date().getTime() + index,
      //       attributeVal: row,
      //       standardValName: row
      //     })
      //   }
      // })
      // this.specList.push({
      //   id: new Date().getTime(),
      //   attributeType: 1,
      //   specName: this.formData.createAttributeName,
      //   goodsStandarValList: attributeValList
      // })
      // attributeValList.forEach((row) => {
      //   this.specSelectList.push({
      //     id: '',
      //     attributeType: 1,
      //     specName: this.formData.createAttributeName,
      //     goodsStandarValList: []
      //   })
      // })
      // this.addAttributeVisible = false
      })
    },

    /**
     * 新增规格值
     */
    handleAddSpec (obj) {
      if (!obj.addValue) return false
      obj.goodsStandarValList.push({
        id: new Date().getTime(),
        standardValName: obj.addValue
      })
      obj.addValue = ''
    },

    /**
     * 移除参数值
     */
    handleRemoveSpec (obj, id, index) {
      obj.splice(index, 1)
      this.formData.specTableData.forEach((row, i) => {
        if (row.id === id) this.formData.specTableData.splice(i, 1)
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
        console.log('row.goodsStandarValList.length: ', row.goodsStandarValList.length)
        if (row.goodsStandarValList.length !== 0) {
          // console.log('row.specName: ', row.specName)
          this.skuTitle.push(row.specName)
          return row
        }
      })
      this.specDisabled = this.skuTitle.length === 2 ? !!true : !!false
      let tableIds = []
      this.formData.specTableData.forEach((row) => {
        row.visible = false
        tableIds.push(row.id)
      })
      if (!filterSelect.length) return false
      let filterSpecGroup = filterSelect.length === 2 ? this.specGroup(filterSelect[0].goodsStandarValList, filterSelect[1].goodsStandarValList) : this.specGroup(filterSelect[0].goodsStandarValList)
      filterSpecGroup.forEach((row) => {
        if (tableIds.indexOf(row.id) < 0) {
          this.formData.specTableData.push({
            id: row.id,
            standardValName: row.standardValName,
            visible: true,
            disabled: false,
            buyPrice: '',       // 进货价
            salePrice: '',      // 销售价
            currentStock: '',   // 当前库存
            adjustStock: '',    // 调整库存
            actualStock: '',    // 实际库存
            specialSale: false, // 是否特卖
            exchange: false     // 是否积分兑换
          })
        } else {
          this.formData.specTableData.forEach((list) => {
            if (list.id === row.id) list.visible = true
          })
        }
      })
      this.formData.specTableData.forEach((row, index) => {
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
        first.forEach((row) => {
          second.forEach((list) => {
            result.push({
              id: row.id + '-' + list.id,
              standardValName: [row.standardValName, list.standardValName]
            })
          })
        })
      } else {
        first.forEach((row) => {
          result.push({
            id: row.id,
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
      this.formData.specTableData.forEach((row) => {
        if (row.visible) {
          if (defVal === null) defVal = row[key]
          row[key] = defVal
        }
      })
    },

    /**
     * 是否全选特卖
     */
    specSaleStateChange (value) {
      this.formData.specTableData.forEach((row) => {
        if (row.visible) row.specialSale = value
      })
    },

    /**
     * 是否全选积分兑换
     */
    specIntegralStateChange (value) {
      this.formData.specTableData.forEach((row) => {
        if (row.visible) row.exchange = value
      })
    },

    /**
     * 是否特卖列表状态改变
     */
    specSaleListChange () {
      let status = true
      this.formData.specTableData.forEach((row) => {
        if (row.visible && row.specialSale === false) status = false
      })
      this.allSpecialSale = status
    },

    /**
     * 是否积分列表状态改变
     */
    specIntegralListChange () {
      let status = true
      this.formData.specTableData.forEach((row) => {
        if (row.visible && row.exchange === false) status = false
      })
      this.allExchange = status
    },

    /**
     * 清除规格数据
     */
    handleClearSpec (id) {
      this.formData.specTableData.forEach((row) => {
        if (row.id.toString() === id.toString()) {
          row.buyPrice = ''
          row.salePrice = ''
          row.currentStock = ''
          row.adjustStock = ''
          row.actualStock = ''
        }
      })
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
      this.$refs['sku-form'].validate((valid) => {
        if (!valid) {
          this.$emit('validate', false)
          return false
        } else {
          this.$emit('validate', true)
          return true
        }
      })
    }
  }
}
</script>

<style lang="less">
.sku-wrap{

  .close-btn{
    color: #999;
    font-size: 16px;
    background: #fff;
    top: -5px;
    right: -5px;
    border-radius: 100%;
    display: none;
  }

  .close-btn:hover{
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
    width: 100%;
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
}
</style>
