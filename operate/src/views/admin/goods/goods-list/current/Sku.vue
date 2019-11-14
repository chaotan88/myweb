<!-- sku -->
<template>
  <div class="sku-wrap">
    <el-form :model="formData" :rules="rules" ref="sku-form" label-width="180px">
      <template v-for="(item, index) in specList">
        <el-form-item :label="item.standardName + '：'" class="pos-r checkbox-item" v-if="item.isSelected">
          <div class="d-ib" v-model="specSelectList[index].goodsStandarValList" style="line-height: 24px;">
            <template v-if="list.isSelected" v-for="(list, i) in item.goodsStandarValList">
              <el-button size="mini" style="cursor: default; margin-bottom: 10px;" type="primary" class="va-t" :label="list" border>{{list.standardValName}}
              </el-button>
            </template>
          </div>
        </el-form-item>
      </template>

      <el-form-item>
        <!-- <div class="custom-table-wrap sku-table">
          <el-table :data="formData.specTableData">
            <el-table-column label="默认规格" width="80" align="center">
              <template slot-scope="scope">
                <div class="ta-c">
                  <el-radio v-model="defaultSkuId" :label="scope.row.id"></el-radio>
                </div>
              </template>
            </el-table-column>
            <template v-for="(item, index) in skuTitle">
              <el-table-column :label="skuTitle[index]" min-width="120">
                <template slot-scope="scope">
                  <template v-if="typeof scope.row.standardValName !== 'string'">{{scope.row.standardValName[index]}}</template>
                  <template v-else>{{scope.row.standardValName}}</template>
                </template>
              </el-table-column>
            </template>
            <el-table-column label="条形码" min-width="120">
              <template slot-scope="scope">{{scope.row.externalNo | filterEmpty}}</template>
            </el-table-column>
            <el-table-column label="当前库存" min-width="120">
              <template slot-scope="scope">{{scope.row.goodsNum | filterMoney}}</template>
            </el-table-column>
            <el-table-column label="进货价" width="160">
              <template slot-scope="scope">
                <div class="pos-r pd-r">
                  <el-form-item :prop="'specTableData.' + scope.$index + '.buyingPrice'" :rules="ruleBuyPrice">
                    <el-input v-model="scope.row.buyingPrice" :disabled="examine === 2" @blur="inpBlur(scope.$index, 'buyingPrice')"></el-input>
                  </el-form-item>
                  <span title="一键同步" class="pos-a sync-btn">
                    <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="scope.$index === syncIndex" @click="handleSync('buyingPrice', scope.$index)">
                      <use xlink:href="#icon-jiantou3"></use>
                    </svg>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="销售价" width="160">
              <template slot-scope="scope">
                <div class="pos-r pd-r">
                  <el-form-item :prop="'specTableData.' + scope.$index + '.goodsPrice'" :rules="ruleBuyPrice">
                    <el-input v-model="scope.row.goodsPrice" :disabled="examine === 2" @blur="inpBlur(scope.$index, 'goodsPrice')"></el-input>
                  </el-form-item>
                  <span title="一键同步" class="pos-a sync-btn">
                    <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="scope.$index === syncIndex" @click="handleSync('goodsPrice', scope.$index)">
                      <use xlink:href="#icon-jiantou3"></use>
                    </svg>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="利润率（利润/销售价）" min-width="180" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.goodsPrice && scope.row.buyingPrice">{{((parseFloat(scope.row.goodsPrice) - parseFloat(scope.row.buyingPrice)) / parseFloat(scope.row.goodsPrice) * 100).toFixed(2)}}%</template>
                <template v-else>{{'' | filterEmpty}}</template>
              </template>
            </el-table-column>
            <el-table-column label="是否特卖" width="180" type="allSpecialSale" :render-header="renderHeader" cell-class-name="no-border">
              <template slot-scope="scope">
                <div class="pos-r pd-l pd-r">
                  <el-checkbox class="pos-a" v-model="scope.row.whetherSpecial" :disabled="examine === 2" @change="specSaleListChange('specTableData.' + scope.$index + '.goodsSpecialPrice')"></el-checkbox>
                  <el-form-item :prop="'specTableData.' + scope.$index + '.goodsSpecialPrice'" :rules="rulePrice">
                    <el-input v-model="scope.row.goodsSpecialPrice" :disabled="examine === 2 || !scope.row.whetherSpecial"  @blur="inpBlur(scope.$index, 'goodsSpecialPrice')"></el-input>
                  </el-form-item>
                  <span title="一键同步" class="pos-a sync-btn">
                    <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="scope.$index === syncIndex" @click="handleSync('goodsSpecialPrice', scope.$index)">
                      <use xlink:href="#icon-jiantou3"></use>
                    </svg>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="获得积分" width="180">
              <template slot-scope="scope">
                <div class="pos-r pd-l pd-r">
                  <el-checkbox class="pos-a" v-model="scope.row.whetherSpecial" :disabled="examine === 2" @change="specSaleListChange('specTableData.' + scope.$index + '.goodsSpecialPrice')"></el-checkbox>
                  <el-form-item :prop="'specTableData.' + scope.$index + '.goodsSpecialPrice'" :rules="rulePrice">
                    <el-input v-model="scope.row.goodsSpecialPrice" :disabled="examine === 2 || !scope.row.whetherSpecial"  @blur="inpBlur(scope.$index, 'goodsSpecialPrice')"></el-input>
                  </el-form-item>
                  <span title="一键同步" class="pos-a sync-btn">
                    <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="scope.$index === syncIndex" @click="handleSync('goodsSpecialPrice', scope.$index)">
                      <use xlink:href="#icon-jiantou3"></use>
                    </svg>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="handleClearSpec(scope.row)">清空</el-button>
                <el-button type="text" :disabled="parseInt(defaultSkuId) === parseInt(scope.row.id)" @click="handleDisStatusChange(scope.row)" v-if="formData.specTableData.length > 1">{{parseInt(scope.row.disStatus) === 1 ? '启用' : '禁用'}}</el-button>
              </template>
            </el-table-column>

            <template slot="empty">
              <no-data></no-data>
            </template>
          </el-table>
        </div>

        <br>
        <br> -->

        <table class="spec-table sku-table">
          <tr>
            <th class="ta-c" width="60px">默认规格</th>
            <th :class="{'vertical-line': index === 1}" v-for="(item, index) in skuTitle" width="120px">{{item}}</th>
            <th class="vertical-line" width="140px"><div>条形码</div></th>
            <th class="vertical-line ta-c" width="80px">当前库存</th>
            <th class="vertical-line" width="120px" v-if="pageType !== 1">调整库存</th>
            <th class="vertical-line" width="120px" v-if="pageType !== 1">实际库存</th>
            <th class="vertical-line" width="120px"><div class="with-asterisk">进货价</div></th>
            <th class="vertical-line" width="120px"><div class="with-asterisk">销售价</div></th>
            <th class="vertical-line" width="100px">利润率</th>
            <!-- <th class="vertical-line">条形码</th>-->
            <!-- <th class="ta-l vertical-line" width="150px"><el-checkbox :disabled="examine === 2 || syncIndex === null" v-model="allSpecialSale" @change="specSaleStateChange"></el-checkbox>&nbsp;&nbsp;是否特卖</th>
             <th class="ta-l vertical-line" width="150px"><el-checkbox :disabled="examine === 2 || syncIndex === null" v-model="allExchange" @change="specIntegralStateChange"></el-checkbox>&nbsp;&nbsp;积分兑换</th>
             <th class="ta-l vertical-line" width="150px"><el-checkbox :disabled="examine === 2 || syncIndex === null" v-model="allIntegral" @change="specGetIntegralStateChange"></el-checkbox>&nbsp;&nbsp;获得积分</th>
             -->
            <th class="ta-l vertical-line" width="150px">
              <el-select v-model="formData.getIntegral" style="padding: 0;height: 30px;line-height: 30px;" @change="integralChange">
                <el-option label="按公式获得积分" :value="0"></el-option>
                <el-option label="自定义获得积分" :value="1"></el-option>
              </el-select>
            </th>
            <th class="ta-l vertical-line" width="150px"><el-checkbox :disabled="examine === 2 || syncIndex === null" v-model="allSpecialSale" @change="specSaleStateChange"></el-checkbox>&nbsp;&nbsp;是否特卖</th>
            <!--<th class="vertical-line">操作</th>-->
          </tr>
          <tr v-for="(item, index) in formData.specTableData" v-if="item.visible !== false">
            <td class="ta-c default-sku-radio">
              <el-radio v-model="defaultSkuId" :label="item.id" ></el-radio>
             <!-- <el-radio v-model="defaultSkuId" :label="item.id" :disabled="parseInt(item.disStatus) === 1" :title="parseInt(item.disStatus) === 1 ? '已被禁用，不能勾选' : ''"></el-radio>-->
            </td>
            <template v-if="typeof item.standardValName !== 'string'">
              <td>{{item.standardValName[0]}}</td>
              <td>{{item.standardValName[1]}}</td>
              <!-- <td v-for="list in item.standardValName" v-if="item.standardValName">{{list}}</td> -->
            </template>
            <template v-else>
              <td v-if="item.standardValName">{{item.standardValName}}</td>
            </template>
            <!-- 条形吗 -->
            <td class="pd-r" >
              <el-form-item :prop="'specTableData.' + index + '.externalNo'" :rules="ruleExternalNo">
                <el-input v-model="item.externalNo" @blur="inpBlur(index, 'buyingPrice')"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === 0" @click="handleSync('externalNo', index)">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <!-- 当前库存 -->
            <td class="ta-c">{{item.goodsNum}}</td>
            <!-- 调整库存 -->
            <td class="pd-r" v-if="pageType !== 1">
              <el-form-item :prop="'specTableData.' + index + '.updateGoodsNum'" :rules="ruleAdjustStock">
                <el-input v-model="item.updateGoodsNum" @focus="updateGoodsData = item" @input="handleUpdateGoodsNum"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('updateGoodsNum', index)">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <td class="ta-c" v-if="pageType !== 1">
             <span>{{item.goodsNum}}</span>
              <!--<el-input v-model="item.goodsNum" disabled></el-input>-->
            </td>
            <!-- 进货价 -->
            <td class="pd-r">
              <el-form-item :prop="'specTableData.' + index + '.buyingPrice'" :rules="ruleBuyPrice">
                <el-input v-model="item.buyingPrice" :disabled="examine === 2"  @change="getIntegralPoint($event,formData.specTableData)" @blur="inpBlur(index, 'buyingPrice')"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('buyingPrice', index)">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <!-- 销售价 -->
            <td class="pd-r">
              <el-form-item :prop="'specTableData.' + index + '.goodsPrice'" :rules="ruleSalePrice">
                <el-input v-model="item.goodsPrice" :disabled="examine === 2"  @change="getIntegralPoint($event,formData.specTableData)" @blur="inpBlur(index, 'goodsPrice')"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('goodsPrice', index)">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <!-- 利润利 -->
            <td class="ta-c">
              <span>{{getLiRunLi(item)}}</span>
              <!-- <template v-if="item.whetherSpecial">{{((item.goodsSpecialPrice - item.buyingPrice) / item.goodsSpecialPrice) | numToFixed | filterEmpty('%')}}</template> -->
              <!-- <template v-else>{{((item.goodsPrice - item.buyingPrice) / item.goodsPrice) | numToFixed | filterEmpty('%')}}</template> -->
              <!--              <template v-if="item.goodsPrice > 0 && item.buyingPrice > 0 && item.whetherSpecial === false">{{((parseFloat(item.goodsPrice) - parseFloat(item.buyingPrice)) / parseFloat(item.goodsPrice) * 100).toFixed(2)}}%</template>
                            <template v-else-if="item.goodsSpecialPrice > 0 && item.buyingPrice > 0 && item.whetherSpecial === true">{{((parseFloat(item.goodsSpecialPrice) - parseFloat(item.buyingPrice)) / parseFloat(item.goodsPrice) * 100).toFixed(2)}}%</template>
                            <template v-else>{{'' | filterEmpty}}</template>-->
            </td>
            <!-- 获得积分 -->
            <td class="pd-l pd-r ">
              <span v-if="formData.getIntegral === 0">{{item.culaPoint}}</span>
              <!-- <el-checkbox class="pos-a" v-model="item.whetherGetPoint" @change="specGetIntegralListChange"></el-checkbox>-->
              <el-form-item :prop="'specTableData.' + index + '.consumeGetPoint'" :rules="ruleGetPoint" v-if="formData.getIntegral === 1">
                <el-input v-model="item.consumeGetPoint" :disabled="!item.whetherGetPoint" style=""></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn " v-if="formData.getIntegral === 1">
                  <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('consumeGetPoint', index)">
                    <use xlink:href="#icon-jiantou3"></use>
                  </svg>
                </span>
            </td>
            <!-- 条形码 -->
            <!-- <td class="pd-r">{{item.externalNo}}</td> -->
            <!-- 特卖 -->
            <td class="pd-l pd-r">
              <el-checkbox class="pos-a" v-model="item.whetherSpecial" :disabled="examine === 2" @change="specSaleListChange('specTableData.' + index + '.goodsSpecialPrice')"></el-checkbox>
              <el-form-item :prop="'specTableData.' + index + '.goodsSpecialPrice'" :rules="rulePrice">
                <el-input v-model="item.goodsSpecialPrice" :disabled="examine === 2 || !item.whetherSpecial"   @change="getIntegralPoint($event,formData.specTableData)" @blur="inpBlur(index, 'goodsSpecialPrice')"></el-input>
              </el-form-item>
              <span title="一键同步" class="pos-a sync-btn">
                <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('goodsSpecialPrice', index)">
                  <use xlink:href="#icon-jiantou3"></use>
                </svg>
              </span>
            </td>
            <!-- 积分兑换 -->
            <!-- <td class="pd-l pd-r">
               <el-checkbox class="pos-a" v-model="item.whetherPoints" @change="specIntegralListChange"></el-checkbox>
               <el-form-item :prop="'specTableData.' + index + '.points'" :rules="rulePoints">
                 <el-input v-model="item.points" :disabled="!item.whetherPoints"></el-input>
               </el-form-item>
               <span title="一键同步" class="pos-a sync-btn">
                 <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" v-if="index === syncIndex" @click="handleSync('points', index)">
                   <use xlink:href="#icon-jiantou3"></use>
                 </svg>
               </span>
             </td>-->
<!--            <td width="80px">
              <el-button type="text" @click="handleClearSpec(item)">清空</el-button>
              <el-button type="text" :disabled="parseInt(defaultSkuId) === parseInt(item.id)" @click="handleDisStatusChange(item)" v-if="formData.specTableData.length > 1">{{parseInt(item.disStatus) === 1 ? '启用' : '禁用'}}</el-button>
            </td>-->
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
      },
      // 审核状态 [1、通过，2、不通过]
      examine: {
        type: Number,
        default: 1
      }
    },
    data () {
      // 进货价
      let validateBuyPrice = (rule, value, callback) => {
        if (this.examine === 1) {
          if (!value) return callback(new Error('请输入进货价'))
          if (value && value <= 0) return callback(new Error('必须是大于0的数字'))
          if (value && !value.toString().match(/^\d+\.\d{2}$/g)) return callback(new Error('请输入正确的数值'))
          callback()
        }
        callback()
      }

      // 销售价
      let validateSalePrice = (rule, value, callback) => {
        if (this.examine === 1) {
          if (!value) return callback(new Error('请输入销售价'))
          if (value && value <= 0) return callback(new Error('必须是大于0的数字'))
          if (value && !value.toString().match(/^\d+\.\d{2}$/g)) return callback(new Error('请输入正确的数值'))
          callback()
        }
        callback()
      }

      // 当前库存
      let validateNum = (rule, value, callback) => {
        if (value && !value.toString().match(/^\d+$/g)) return callback(new Error('请输入正确的数值'))
        callback()
      }

      // 积分兑换
      let validatePoints = (rule, value, callback) => {
        let num = parseInt(rule.field.split('.')[1])
        if (this.formData.specTableData[num].whetherPoints && !value) return callback(new Error('请输入积分兑换价格'))
        if (value && !value.toString().match(/^\d+$/g)) return callback(new Error('请输入正确的数值'))
        callback()
      }

      // 获得积分
      let validateGetPoint = (rule, value, callback) => {
        let num = parseInt(rule.field.split('.')[1])
        if (this.formData.specTableData[num].whetherGetPoint && !value) return callback(new Error('请输入获得积分数'))
        if (value && !value.toString().match(/^\d+$/g)) return callback(new Error('请输入正确的数值'))
        callback()
      }

      // 价格
      let validatePrice = (rule, value, callback) => {
        let num = parseInt(rule.field.split('.')[1])
        if (this.examine === 1 && this.formData.specTableData[num].whetherSpecial) {
          if (!value) return callback(new Error('请输入特卖价格'))
          if (isNaN(value) || value <= 0) return callback(new Error('必须是大于0的数字'))
          if (!value.toString().match(/^\d+\.\d{2}$/g)) return callback(new Error('请输入正确的数值'))
          callback()
        }
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

      // 条形码
      let validateExternalNo = (rule, value, callback) => {
        let reg = /^[0-9a-zA-Z]{0,30}$/gi
        if (value && !value.toString().match(reg)) return callback(new Error('限数字字母，30个字符长度'))
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
          getIntegral: 1,              // 获取积分方式：自定义默认
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
        allIntegral: false,           // 获得积分
        syncIndex: null,              // 一键同步索引值
        ruleBuyPrice: [{required: true, validator: validateBuyPrice, trigger: 'blur'}],
        ruleSalePrice: [{required: true, validator: validateSalePrice, trigger: 'blur'}],
        ruleCurrentGoodsNum: [{required: true, validator: validateNum, trigger: 'blur'}],
        ruleAdjustStock: [{validator: validateAdjustStock, trigger: 'blur'}],
        ruleExternalNo: [{validator: validateExternalNo, trigger: 'blur'}],
        rulePoints: [{validator: validatePoints, trigger: 'blur'}],
        ruleGetPoint: [{validator: validateGetPoint, trigger: 'blur'}],
        rulePrice: [{validator: validatePrice, trigger: 'blur'}],
        addAttributeVisible: false,   // 添加参数
        addType: 1,                   // 添加类型 [1、参数，2、规格]
        goodsId: '',                  // 商品id
        updateGoodsData: {},          // 当前调整库存数据
        editSpecSelectList: [],       // 编辑商品初始化保存第一次sku选择规格
        editGoodsTypeId: null,        // 编辑商品初始化保存第一次传入小类id
        defaultSkuId: ''              // 默认skuId
      }
    },

    watch: {
      'goodsTypeId' (value) {
        if (!value) return false
        this.getEditSpecList()
        // if (this.pageType === 2 && this.isInit === true) {
        //   if (value === this.editGoodsTypeId) {
        //     this.getEditSpecList()
        //   } else {
        //     alert(111)
        //     this.getSpecList()
        //   }
        //  }
        // if (this.pageType === 1 && value !== this.editGoodsTypeId) this.getSpecList()
      },

      'assignSkuData': {
        handler (value) {
          if (!value || !value.length) return false
          this.formData.specTableData = []
          this.formData.getIntegral = value[0].whetherGetPoint
          let filterDefaultSku = value.filter(row => parseInt(row.whetherDefaultSku) === 1)
          value.forEach((row) => {
            let groupId = []
            let standardValName = []
            if (row.goodsSkuValList && row.goodsSkuValList.length) {
              row.goodsSkuValList.forEach((list) => {
                groupId.push(list.standardValId)
                standardValName.push(list.standardValName)
              })
            }
            // 选中默认sku
            if (!this.defaultSkuId && parseInt(row.disStatus) === 0 && (!filterDefaultSku.length || (filterDefaultSku.length && parseInt(filterDefaultSku[0].disStatus) === 1) || row.whetherDefaultSku === 1)) this.defaultSkuId = row.id
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
              whetherDefaultSku: row.whetherDefaultSku,  // 默认sku
              goodsNum: row.goodsNum,               // 实际库存
              whetherSpecial: parseInt(row.whetherSpecial) === 1 ? !!true : !!false,    // 是否特卖
              goodsSpecialPrice: row.goodsSpecialPrice,                                 // 特卖价格
             // whetherPoints: parseInt(row.whetherPoints) === 1 ? !!true : !!false,      // 是否积分兑换
            //  whetherGetPoint: parseInt(row.whetherGetPoint) === 1 ? !!true : !!false,  // 是否获得积分
              whetherGetPoint: parseInt(row.whetherGetPoint), // 是否获得积分
              points: row.points,                   // 兑换该商品所需积分
              consumeGetPoint: row.consumeGetPoint, // 获得积分
              goodsSkuValList: row.goodsSkuValList, // sku值集合,
              externalNo: row.externalNo            // 条形码
            })
          })
          this.getIntegralPoint('111', this.formData.specTableData)
          this.specChange()
        },
        deep: true
      },

      'examine' (value) {
        if (value === 2) this.$refs['sku-form'].clearValidate()
      }
    },

    mounted () {
      this.pageType = this.$route.path.match(/add/gi) ? 1 : 2
      this.goodsId = parseInt(this.$route.query.id)
      if (this.goodsId) this.getEditSpecList()
      this.getAssignSkuData()
      setTimeout(() => {
        this.isInit = true
        this.editGoodsTypeId = this.$Utils.deepCopy(this.goodsTypeId)
      }, 500)
    },

    methods: {
      /**
       * 获取sku列表
       */
      getAssignSkuData () {
        let value = this.assignSkuData
        if (!value || !value.length) return false
        this.formData.specTableData = []
        this.formData.getIntegral = value[0].whetherGetPoint
        let filterDefaultSku = value.filter(row => parseInt(row.whetherDefaultSku) === 1)
        value.forEach((row) => {
          let groupId = []
          let standardValName = []
          if (row.goodsSkuValList && row.goodsSkuValList.length) {
            row.goodsSkuValList.forEach((list) => {
              groupId.push(list.standardValId)
              standardValName.push(list.standardValName)
            })
          }
          // 选中默认sku
          if (!this.defaultSkuId && parseInt(row.disStatus) === 0 && (!filterDefaultSku.length || (filterDefaultSku.length && parseInt(filterDefaultSku[0].disStatus) === 1) || row.whetherDefaultSku === 1)) this.defaultSkuId = row.id
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
            whetherDefaultSku: row.whetherDefaultSku,  // 默认sku
            goodsNum: row.goodsNum,               // 实际库存
            whetherSpecial: parseInt(row.whetherSpecial) === 1 ? !!true : !!false,    // 是否特卖
            goodsSpecialPrice: row.goodsSpecialPrice,                                 // 特卖价格
            // whetherPoints: parseInt(row.whetherPoints) === 1 ? !!true : !!false,      // 是否积分兑换
            //  whetherGetPoint: parseInt(row.whetherGetPoint) === 1 ? !!true : !!false,  // 是否获得积分
            whetherGetPoint: parseInt(row.whetherGetPoint), // 是否获得积分
            points: row.points,                   // 兑换该商品所需积分
            consumeGetPoint: row.consumeGetPoint, // 获得积分
            goodsSkuValList: row.goodsSkuValList, // sku值集合,
            externalNo: row.externalNo            // 条形码
          })
        })
        this.getIntegralPoint('111', this.formData.specTableData)
        this.specChange()
      },
      /**
       * 自定义标题
       */
      renderHeader (h, { column, $index }) {
        return h('el-checkbox', {
          props: {
            value: this[column.type]
          },
          attrs: {
            disabled: this.isDisabled
          },
          on: {
            change: (value) => {
              this[column.type] = value
              this.tableData.forEach((row) => {
                switch (this[column.type]) {
                  case 'allSpecialSale':
                    row.whetherSpecial = value
                    break
                  case 'allGetPoint':
                    row.whetherGetPoint = value
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
       * 查询所有规格列表
       */
      getEditSpecList () {
        this.$http.post('@ROOT_API/standard/getStandardByGoodsId', {goodsId: this.goodsId}).then((res) => {
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
            attributeTypeId: this.goodsTypeId,                    // 是 int 商品分类id (商品小类)
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
              points: '',              // 兑换该商品所需积分
              whetherGetPoint: this.formData.getIntegral       //   获得积分方式
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
        this.specGetIntegralListChange()
        this.getIntegralPoint('111', this.formData.specTableData)
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
      handleSync (key, index) {
        let currentObj = this.formData.specTableData[index]
        //  if (!currentVal || isNaN(currentVal)) {
        if (!currentObj[key]) {
          return false
        }
       // if (isNaN(currentObj[key]) || currentObj[key] <= 0) return false
        if (this.examine === 2) return false
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
        this.getIntegralPoint('111', this.formData.specTableData)
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
        let flag = data.every(item => {
          if (item.whetherSpecial === 1) {
            return item.goodsSpecialPrice > 0 && item.buyingPrice > 0 && item.goodsPrice > 0
          } else {
            return item.buyingPrice > 0 && item.goodsPrice > 0
          }
        })
        if (this.formData.getIntegral === 0 && !isNaN(type) && flag === true) {
          this.$http.post('@ROOT_API/goods/getBuySkuGetPointByParam', {
            goodsSkuList: data
          }).then((res) => {
            let resData = res.data
            if (parseInt(resData.status) === 1) {
              list.forEach((item, index) => {
                this.$set(item, 'culaPoint', '')
                resData.data.forEach((itemm, index) => {
                  if (item.id === itemm.id) {
                    item.culaPoint = itemm.consumeGetPoint
                  }
                })
              })
            }
          }).finally(() => {
          })
        }
      },
      /**
       * 是否全选特卖
       */
      specSaleStateChange (value) {
        this.formData.specTableData.forEach((row) => {
          if (row.visible) row.whetherSpecial = value
        })
        this.getIntegralPoint('111', this.formData.specTableData)
      },

      /**
       * 修改自定义积分
       */
      integralChange (value) {
        this.formData.specTableData.forEach((row) => {
          if (row.visible) row.whetherGetPoint = value
          // if (row.visible) row.consumeGetPoint = ''
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
       * 是否获得积分
       */
      specGetIntegralStateChange (value) {
        this.formData.specTableData.forEach((row) => {
          if (row.visible) row.whetherGetPoint = value
        })
      },

      /**
       * 是否特卖列表状态改变
       */
      specSaleListChange (obj) {
        let status = true
        this.formData.specTableData.forEach((row) => {
          if (row.visible && row.whetherSpecial === false) status = false
        })
        this.allSpecialSale = status
        this.$refs['sku-form'].clearValidate(obj)
        this.getIntegralPoint('111', this.formData.specTableData)
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
       * 获得积分列表状态改变
       */
      specGetIntegralListChange (value) {
        let status = true
        this.formData.specTableData.forEach((row) => {
          if (row.visible && row.whetherGetPoint === false) status = false
        })
        this.allIntegral = status
      },

      /**
       * 清除规格数据
       */
      handleClearSpec (obj) {
        this.formData.specTableData.forEach((row) => {
          if (row.groupId.toString() === obj.groupId.toString()) {
            row.buyingPrice = ''
            row.goodsPrice = ''
            // row.externalNo = ''
            row.currentGoodsNum = ''
            row.updateGoodsNum = ''
            // row.goodsNum = ''
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
                // sku折扣
                let discount = row.whetherSpecial ? (row.buyingPrice / row.goodsSpecialPrice * 10).toFixed(2) : (row.buyingPrice / row.goodsPrice * 10).toFixed(2)
                // 组合结果集
                results.push({
                  id: this.pageType === 2 ? row.id : '',
                  buyingPrice: !isNaN(row.buyingPrice) && row.buyingPrice > 0 ? row.buyingPrice : 0.01,
                  goodsPrice: !isNaN(row.goodsPrice) && row.goodsPrice > 0 ? row.goodsPrice : 0.01,
                  currentGoodsNum: row.currentGoodsNum || 0,
                  updateGoodsNum: row.updateGoodsNum || 0,
                  whetherDefaultSku: this.defaultSkuId === row.id ? 1 : 0,
                  goodsNum: row.goodsNum || 0,
                  disStatus: row.disStatus,
                  discount,
                  whetherSpecial: row.whetherSpecial ? 1 : 0,
                  goodsSpecialPrice: !isNaN(row.goodsSpecialPrice) && row.goodsSpecialPrice > 0 ? row.goodsSpecialPrice : 0.01,
                  whetherPoints: row.whetherPoints ? 1 : 0,
                  points: row.points,
                  whetherGetPoint: row.whetherGetPoint ? 1 : 0, // 是否获得积分
                  consumeGetPoint: row.consumeGetPoint,         // 获得积分
                  goodsSkuValList: row.goodsSkuValList ? row.goodsSkuValList : goodsSkuValList,
                  externalNo: row.externalNo
                })
              }
            })
            this.$emit('validate', true, results)
            return true
          }
        })
      },
      /**
       * 获取利润率
       */
      getLiRunLi (item) {
        if (item.goodsSpecialPrice > 0 && item.buyingPrice > 0 && item.whetherSpecial === true) {
          return ((parseFloat(item.goodsSpecialPrice) - parseFloat(item.buyingPrice)) / parseFloat(item.goodsSpecialPrice) * 100).toFixed(2) + '%'
        } else if (item.goodsPrice > 0 && item.buyingPrice > 0 && item.whetherSpecial === false) {
          return ((parseFloat(item.goodsPrice) - parseFloat(item.buyingPrice)) / parseFloat(item.goodsPrice) * 100).toFixed(2) + '%'
        } else {
          return '--'
        }
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
    .spec-table.sku-table{
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

      .default-sku-radio{
        .el-radio__label{
          display: none;
        }
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

    .custom-table-wrap.sku-table{
      table{
        border-collapse: collapse;

        th:nth-child(1){
          border-left: 0;
        }

        .el-checkbox.pos-a{
          width: 14px;
          height: 14px;
          margin-top: -7px;
          left: 0;
          top: 50%;

          .el-checkbox__input{
            vertical-align: top;
          }
        }
      }

      td{
        .cell{
          padding: 0 10px;
          margin: 0;
        }
      }

      .pd-l{
        padding-left: 25px;
      }

      .pd-r{
        padding-right: 20px;
      }

      td{
        padding: 10px 0;
        border: 1px solid #ebeef5;
      }

      .el-radio__label{
        display: none;
      }

      .sync-btn{
        fill: #2eaaf7;
        width: 30px;
        height: 30px;
        margin-top: -15px;
        right: -10px;
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
