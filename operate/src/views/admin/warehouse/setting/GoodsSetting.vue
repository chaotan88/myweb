<!-- 关联商品设置 -->
<template>
  <common-tpl class="operation-luckyBuy-goods-setting" footer>
    <template slot="main">
      <el-form :model="formData" ref="formData" :rules="rules" label-width="160px" :key="keyValue" >
        <div class="fixed-bg"></div>
        <div style="">
          <div  class="fixed-content">
            <gray-title style="background: #a8cef9;">价格配置</gray-title>
            <!--&lt;!&ndash; 统一规格 &ndash;&gt;
            <template v-if="formData.multStandard === 1">
              <el-form-item label="统一规格："></el-form-item>
              <el-form-item label="进货价："> {{formData.skuUpdateList[0].buyingPrice | filterEmpty }} </el-form-item>
              <el-form-item label="销售价："> {{formData.skuUpdateList[0].goodsPrice | filterEmpty }} </el-form-item>
              <el-form-item label="抢购价："  prop="skupurchasePrice">
                <el-checkbox v-model="formData.skupurchasePrice"></el-checkbox>
                <el-input v-model="formData.skupurchasePrice" ></el-input>
              </el-form-item>
              <el-form-item label="需批发券："> {{formData.skuUpdateList[0].goodsPrice | filterEmpty }} </el-form-item>
              <el-form-item label="获批发券："> {{formData.skuUpdateList[0].goodsPrice | filterEmpty }} </el-form-item>
              <el-form-item label="出售返额："> {{formData.skuUpdateList[0].goodsPrice | filterEmpty }} </el-form-item>
              &lt;!&ndash;  <el-form-item label="获得积分：" prop="points">
                  <el-input v-model="formData.points"></el-input>
                </el-form-item>
                <el-form-item label="利润率：">{{filterUnifiedProfitMargin() | filterEmpty}}</el-form-item>
                <el-form-item label="兑换芯豆数量：" prop="goodsGoldBeanNum">
                  <el-input v-model="formData.goodsGoldBeanNum"></el-input>
                </el-form-item>&ndash;&gt;
            </template>-->
            <section>
              <el-form-item label-width="40px">
                <el-table border :data="formData.skuUpdateList" class="el-sku-table" max-height="180">
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
                  <el-table-column label="进货价" min-width="100px">
                    <template slot-scope="scope">{{scope.row.buyingPrice | filterMoney}}</template>
                  </el-table-column>
                  <el-table-column label="销售价" min-width="100px">
                    <template slot-scope="scope">{{scope.row.goodsPrice | filterMoney}}</template>
                  </el-table-column>
                  <el-table-column label="抢购价" min-width="100px"  prop="allPurchasePrice">
                  <!--<el-table-column label="抢购价" min-width="100px"  prop="allPurchasePrice" :render-header="pageType === 1 ? renderHeader : ''">-->
                    <template slot-scope="scope">
                      <template v-if="pageType === 1">
<!--                        <div class="pos-r pd-l">
                          <el-checkbox class="pos-a" v-model="scope.row.ifPurchasePrice" @change="switchPublicChange('skuUpdateList.' + scope.$index + '.purchasePrice', 'ifPurchasePrice', 'allPurchasePrice', scope.row)"></el-checkbox>
                          <el-form-item :prop="'skuUpdateList.' + scope.$index + '.purchasePrice'" :rules="scope.row.ifPurchasePrice ? purchasePrice : purchasePriceNo">
                            <el-input size="medium" v-model="scope.row.purchasePrice" @change="purchaseChange(scope.row)" :disabled="!scope.row.ifPurchasePrice || formData.grabStatus === 1" maxlength="9" v-auto-price></el-input>
                          </el-form-item>
                        </div>-->
                        <div class="purchase-price">
                          <el-form-item :prop="'skuUpdateList.' + scope.$index + '.purchasePrice'" :rules="purchasePrice">
                            <el-input size="small" v-model="scope.row.purchasePrice" @change="purchaseChange(scope.row)" :disabled="formData.grabStatus === 1" maxlength="9" v-auto-price></el-input>
                          </el-form-item>
                        </div>
                      </template>
                      <template v-else>{{scope.row.purchasePrice | filterMoney}}</template>
                    </template>
                  </el-table-column>
                  <el-table-column label="批发价" min-width="100px">
                    <template slot-scope="scope">{{getWholesale(scope.row)}}</template>
                  </el-table-column>
                  <el-table-column label="需批发券" min-width="100px" >
                    <template slot-scope="scope">{{getWholesaleVolume(scope.row)}}</template>
                  </el-table-column>
                  <el-table-column label="获批发券" min-width="100px" >
                    <template slot-scope="scope">{{getDoWholesaleVolume(scope.row)}}</template>
                  </el-table-column>
                  <el-table-column label="出售返额" min-width="100px" >
                    <template slot-scope="scope">{{getReflux(scope.row)}}</template>
                  </el-table-column>
                  <el-table-column label="当前库存" min-width="100px" >
                    <template slot-scope="scope">{{scope.row.goodsNum | filterMoney}}</template>
                  </el-table-column>
                  <el-table-column label="利润率（利润/成交总额）" width="200px"  align="center">
                    <template slot-scope="scope">{{getProfitMargin(scope.row)}}</template>
                  </el-table-column>

                  <!-- 暂无数据 -->
                  <template slot="empty">
                    <no-data></no-data>
                  </template>

                </el-table>
              </el-form-item>
            </section>
          </div>
          <div style="margin-top: 220px;">
            <!--<gray-title class="mb-20" id="rushInfo">抢购配置</gray-title>-->
            <!--<gray-title class="mb-20" id="wholesaleInfo">批发配置</gray-title>-->
            <!--gray-title class="mb-20" id="saleInfo">挂售配置</gray-title>-->
            <el-tabs v-model="formData.configType" type="card" @tab-click="getDetailsData">
              <el-tab-pane label="抢购配置" name="1">
                <div v-if="formData.configType === '1'">
                  <el-form-item label=" 获批发券比例：" prop="grabTicketGiveRate">
                    <el-row type="flex">
                      <el-input type="input" v-model="formData.grabTicketGiveRate" maxlength="4" @change="getDoWholesaleVolume" placeholder="限0-1000正整数" :disabled="formData.grabStatus === 1"></el-input>
                      <span style="margin-left: 10px; color: #999999;">%</span>
                      <span style="margin-left: 10px; color: #999999;">获批发券 =  抢购价 X 获批发券比例，小数末尾取整</span>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="当天抢购数：" prop="grabNumNow">
 <!--                   <el-row type="flex">
                      <el-form-item label="" prop="grabNumNowSys">
                        <el-input type="input" v-model="formData.grabNumNowSys" maxlength="4" placeholder="限0-1000正整数" :disabled="formData.grabStatus === 1" style="width: 200px;">
                          <template slot="prepend">系统</template>
                        </el-input>
                        <span class="ml-10">个</span>
                      </el-form-item>
                      <el-form-item label="" prop="grabNumNow" class="ml-10">
                        <el-input type="input" v-model="formData.grabNumNow" maxlength="4" placeholder="限0-1000正整数" :disabled="formData.grabStatus === 1" style="width: 200px;">
                          <template slot="prepend">用户</template>
                        </el-input>
                        <span class="ml-10">个</span>
                      </el-form-item>
                      &lt;!&ndash;  <span style="margin-left: 10px;">个</span>&ndash;&gt;
                      <span style="margin-left: 10px; color: #999999;">当天商品允许最高的抢购数量，当没有用户抢购数量时，默认都是系统数量</span>
                    </el-row>-->

                    <el-input type="input" v-model="formData.grabNumNow" maxlength="4" placeholder="限0-1000正整数" :disabled="formData.grabStatus === 1" style="">
                    </el-input>
                    <span class="ml-10">个</span>
                    <span style="margin-left: 10px; color: #999999;">当天商品允许最高的抢购数量，当没有用户抢购数量时，默认都是系统数量</span>
                  </el-form-item>
                  <el-form-item label="单人当天抢购数："  prop="grabNumLimit">
                    <el-row type="flex">
                      <el-input type="input" v-model="formData.grabNumLimit" maxlength="4" placeholder="限0-1000正整数" :disabled="formData.grabStatus === 1"></el-input>
                      <span style="margin-left: 10px;">个 / 人</span>
                      <span style="margin-left: 10px; color: #999999;">单个用户当天可以抢购的最高数量</span>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="抢购状态" prop="grabStatus" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
                    <el-radio-group v-model="formData.grabStatus" >
                      <el-radio :label="2">待售</el-radio>
                      <el-radio :label="1">开启</el-radio>
                      <el-radio :label="0">关闭</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="抢购时间："  prop="rushDateArr" :rules="[{required: true, message: '不能为空',type: 'array', trigger: 'blur'}]" style="margin-top: 40px;">
                    <el-date-picker type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至"  v-model="formData.rushDateArr" clearable @change="getRushDate"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="当天抢购时间："  prop="rushTimeArr" :rules="[{required: true, message: '不能为空',type: 'array', trigger: 'blur'}]" style="margin-top: 40px;">
                    <el-time-picker is-range  v-model="formData.rushTimeArr" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" @change="getRushTime" style="width: 400px;"></el-time-picker>
                  </el-form-item>
                 <!-- <el-form-item label="抢购限制" prop="grabLimit" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
                    <el-radio-group v-model="formData.grabLimit" >
                      <el-radio :label="0">不限制</el-radio>
                      <el-radio :label="1">一个账号一次</el-radio>
                      <el-radio :label="2">出售后才允许抢</el-radio>
                    </el-radio-group>
                    <el-form-item label=""  prop="grabNumLimit">
                      <el-row type="flex">
                        <el-input type="input" v-model="formData.grabNumLimit" maxlength="4" placeholder="限0-1000正整数" :disabled="formData.grabStatus === 1"></el-input>
                        <span style="margin-left: 10px;">个 / 人</span>
                        <span style="margin-left: 10px; color: #999999;">单个用户当天可以抢购的最高数量</span>
                      </el-row>
                    </el-form-item>
                  </el-form-item>-->
                </div>
              </el-tab-pane>

              <el-tab-pane label="批发配置" name="2">
                <div v-if="formData.configType === '2'">
                  <el-form-item label=" 批发价比例：" prop="purchaseBuyPriceRate">
                    <el-row type="flex">
                      <el-input type="input" v-model="formData.purchaseBuyPriceRate" maxlength="3" placeholder="限0-100正整数" @change="purchaseBuyPriceRateChange" :disabled="formData.purchaseStatus === 1"></el-input>
                      <span style="margin-left: 10px; color: #999999;">%</span>
                      <span style="margin-left: 10px; color: #999999;">批发价 =  抢购价 X 批发价比例</span>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="需批发券比例：" prop="purchaseTicketNeedRate">
                    <el-row type="flex">
                      <el-input type="input" v-model="formData.purchaseTicketNeedRate" maxlength="4" placeholder="限0-1000正整数" @change="purchaseBuyPriceRateChange" :disabled="formData.purchaseStatus === 1"></el-input>
                      <span style="margin-left: 10px; color: #999999;">%</span>
                      <span style="margin-left: 10px; color: #999999;">需批发券 =  抢购价 X 需批发券比例</span>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="批发总数：" prop="purchaseNumTotal">
                    <el-row type="flex">
                      <el-input type="input" v-model="formData.purchaseNumTotal" maxlength="7" placeholder="限0-1000000正整数" :disabled="formData.purchaseStatus === 1"></el-input>
                      <span style="margin-left: 10px; color: #999999;">本次活动最高允许的批发数量</span>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="当天批发数："  prop="purchaseNumNow">
                    <el-row type="flex">
                      <el-input type="input" v-model="formData.purchaseNumNow" maxlength="7" placeholder="限0-1000000正整数" :disabled="formData.purchaseStatus === 1"></el-input>
                      <span style="margin-left: 10px;">个</span>
                      <span style="margin-left: 10px; color: #999999;">当天商品允许最高的批发数量</span>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="单人当天批发数："  prop="purchaseNumLimit">
                    <el-row type="flex">
                      <el-input type="input" v-model="formData.purchaseNumLimit" maxlength="4" placeholder="限0-1000正整数" :disabled="formData.purchaseStatus === 1"></el-input>
                      <span style="margin-left: 10px;">个 / 人</span>
                      <span style="margin-left: 10px; color: #999999;">单个用户当天可以批发的最高数量</span>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="批发状态：" prop="purchaseStatus" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
                    <el-radio-group v-model="formData.purchaseStatus" >
                      <el-radio :label="1">开启</el-radio>
                      <el-radio :label="0">关闭</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="批发时间："  prop="wholesaleDateArr" :rules="[{required: true, message: '不能为空',type: 'array', trigger: 'blur'}]" style="margin-top: 40px;">
                    <el-date-picker type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至"  v-model="formData.wholesaleDateArr" clearable @change="getWholesaleDate"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="批发抢购时间："  prop="wholesaleTimeArr" :rules="[{required: true, message: '不能为空',type: 'array', trigger: 'blur'}]" style="margin-top: 40px;">
                    <el-time-picker is-range  v-model="formData.wholesaleTimeArr" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" @change="getWholesaleTime" style="width: 400px;"></el-time-picker>
                  </el-form-item>
                </div>
              </el-tab-pane>

              <el-tab-pane label="挂售配置" name="3">
                <div v-if="formData.configType === '3'">
                  <el-form-item label="挂售时间：" prop="" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
                    <el-row type="flex" align="middle">
                      <!--                <el-radio-group v-model="formData.hangTimeType" :disabled="formData.purchaseStatus === 1" style="line-height: 40px;margin-top: 5px;">
                                        <el-radio :label="0">立即挂售</el-radio>
                                        <el-radio :label="1">自定义</el-radio>
                                      </el-radio-group>-->
                      <el-row type="flex" align="middle"  class="" >
                        <el-form-item label="" prop="hangTime" >
                          <el-input maxLength="2" v-model="formData.hangTime" class="" placeholder="限0-20正整数" :disabled="formData.purchaseStatus === 1"></el-input>
                          <span style="margin-left: 10px;">天</span>
                          <span style="margin-left: 60px; color: #999999;">到达挂售时间后，自动挂售</span>
                        </el-form-item>
                      </el-row>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="返额比例：" prop="hangRebateRate">
                    <el-row type="flex">
                      <el-input type="input"  v-model="formData.hangRebateRate" maxlength="3" @change="purchaseBuyPriceRateChange" placeholder="限0-100正整数" ></el-input>
                      <span style="margin-left: 10px; color: #999999;">%</span>
                      <span style="margin-left: 10px; color: #999999;">返额 = 抢购价 X 返额比例，用户下单付款即返佣，返佣后以通用积分体现</span>
                    </el-row>
                  </el-form-item>
               <!--   <el-form-item label="自动提货时间：" prop="hangAutoCarryStatus" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
                    <el-row type="flex" align="middle">
                      <el-radio-group v-model="formData.hangAutoCarryStatus" style="line-height: 40px;margin-top: 5px;">
                        <el-radio :label="1">开启</el-radio>
                        <el-radio :label="0">关闭</el-radio>
                      </el-radio-group>
                      <el-row type="flex" align="middle" style="margin-left: 20px; flex: 1;" class="" v-show="formData.hangAutoCarryStatus === 1">
                        <el-form-item label="" prop="hangAutoCarryTime" >
                          <el-input type="input"  v-model="formData.hangAutoCarryTime" maxlength="3" @change="" placeholder="限0-100正整数" styloe="margin-left: 20px"></el-input>
                          <span style="margin-left: 10px; color: #999999;">天</span>
                          <span style="margin-left: 10px; color: #999999;">到达自动提货时间未售出，自动生成提货订单</span>
                        </el-form-item>
                      </el-row>
                    </el-row>
                  </el-form-item>-->
                  <el-form-item label="预计售出时间：" prop="hangEstimatedSellTime" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
                    <el-row type="flex">
                      <el-select v-model="formData.hangEstimatedSellTime" placeholder="请选择">
                        <el-option key="1" label="7-10天"  value="7-10天"></el-option>
                        <el-option key="2" label="15-20天" value="15-20天"></el-option>
                        <el-option key="3" label="20-25天" value="20-25天"></el-option>
                      </el-select>
<!--                      <span style="margin-left: 10px; color: red;">挂售成功短信：</span>
                      <span style="margin-left: 10px; color: #999999;">您批发的“XXXX”商品已经挂售成功，正等待抢购中，预计“XXX天”可以售出，分享小伙伴一起抢批，售出加速喔！</span>
               -->     </el-row>
                  </el-form-item>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>


      </el-form>

      <!--目录指引-->
<!--      <div class="catalog-info">
        <a v-for="(item,index) in liList" :key="index" :class="{ 'active': item.name === catalogName}" @click="scrollTo(item.name, item.url)">
          {{item.name}}
        </a>
      </div>-->
    </template>

    <template slot="footer">
      <el-button  @click="$router.go(-1)">返 回</el-button>

      <el-button type="primary" :loading="submitLoading" @click="handleSubmit('formData')" v-if="pageType === 1">提交</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      // 校验0-20正整数  必填
      let validateHangTime = (rule, value, callback) => {
        if ((value === '' || value === null)) return callback(new Error('不能为空'))
        if (value && (value < 0 || value > 20 || !value.toString().match(/^\d+$/gi))) return callback(new Error('限0-20正整数'))
        callback()
      }
      // 校验正整数  必填
      let validateInt = (rule, value, callback) => {
        if (value === '' || value === null) return callback(new Error('不能为空'))
        if (value && (value < 0 || !value.toString().match(/^\d+(\.\d{0,2})?$/gi))) return callback(new Error('请填写正数'))
        callback()
      }
      // 校验正整数 非必填
      let validateInt1 = (rule, value, callback) => {
        if (value && (value < 0 || !value.toString().match(/^\d+(\.\d{0,2})?$/gi))) return callback(new Error('请填写正数'))
        callback()
      }

      // 校验0-100正整数
      let validateNumber1 = (rule, value, callback) => {
        if (value === '' || value === null) return callback(new Error('不能为空'))
        if (value && (value < 0 || value > 100 || !value.toString().match(/^\d+$/gi))) return callback(new Error('请输入0-100正整数'))
        callback()
      }

      // 校验0-100正整数
      let validateHangAutoCarryTime = (rule, value, callback) => {
        if ((parseInt(this.formData.hangAutoCarryStatus) === 1) && (value === '' || value === null)) return callback(new Error('不能为空'))
        if (parseInt(this.formData.hangAutoCarryStatus) === 1 && value && (value < 0 || value > 100 || !value.toString().match(/^\d+$/gi))) return callback(new Error('请输入0-100正整数'))
        callback()
      }

      // 校验0-1000正整数
      let validateNumber2 = (rule, value, callback) => {
        if (value === '' || value === null) return callback(new Error('不能为空'))
        if (value && (value < 0 || value > 1000 || !value.toString().match(/^\d+$/gi))) return callback(new Error('请输入0-1000正整数'))
        callback()
      }

      // 校验0-1000000正整数
      let validateNumber3 = (rule, value, callback) => {
        if (value === '' || value === null) return callback(new Error('不能为空'))
        if (value && (value < 0 || value > 1000000 || !value.toString().match(/^\d+$/gi))) return callback(new Error('请输入0-1000000正整数'))
        callback()
      }

      return {
        pageType: 1,            // 页面类型 [1、设置，2、详情]
        submitLoading: false,   // 提交loading
        allSpecialSale: false,  // 是否特卖
        allGetPoint: false,     // 是否获得积分
        purchaseNum1: '',
        purchasePrice1: '',
        formData: {
          configType: '1', // 当前区块【批发，抢购，挂售】
          activityImage: '',
          activityRemark: '',
          id: '',
          goodsId: '',
          grabTicketGiveRate: '',
          grabNumNow: '',       // 用户
        //  grabNumNowSys: '',    // 系统
          grabNumLimit: '',
          grabEndDate: '',
          grabStatus: '',
          grabLimit: '',
          hangTime: '',            //   挂售时间
       // hangTimeType: '',        // 挂售时间类型 中间变量
       //   hangAutoCarryTime: '',   // 自动提货时间
          hangEstimatedSellTime: '',            // 预计售出时间
          hangAutoCarryStatus: '',
          purchaseBuyPriceRate: '',
          purchaseTicketNeedRate: '',
          purchaseNumTotal: '',
          purchaseNumNow: '',
          purchaseNumLimit: '',
          purchaseStatus: '',
          purchaseStartDate: '',
          purchaseEndDate: '',
          hangRebateRate: '',
          multStandard: 2,       // 商品规格 [1、统一规格，2、多规格]
          skuUpdateList: [],     // sku列表
          rushDateArr: [],           // 活动时间
          wholesaleDateArr: [],           // 批发时间
          rushTimeArr: [],            // 当天活动时间
          wholesaleTimeArr: []            // 当天活动批发时间
        },
        rules: {
          purchaseRate: [{required: true, validator: validateNumber1, trigger: 'blur'}],
          grabTicketGiveRate: [{required: true, validator: validateNumber2, trigger: 'blur'}],
          grabNumNow: [{required: true, validator: validateNumber2, trigger: 'blur'}],     // 用户
          grabNumNowSys: [{required: true, validator: validateNumber2, trigger: 'blur'}],  // 系统
          grabNumLimit: [{required: true, validator: validateNumber2, trigger: 'blur'}],
          purchaseBuyPriceRate: [{required: true, validator: validateNumber1, trigger: 'blur'}],
          purchaseTicketNeedRate: [{required: true, validator: validateNumber2, trigger: 'blur'}],
          purchaseNumTotal: [{required: true, validator: validateNumber3, trigger: 'blur'}],
          purchaseNumNow: [{required: true, validator: validateNumber3, trigger: 'blur'}],
          purchaseNumLimit: [{required: true, validator: validateNumber2, trigger: 'blur'}],
          hangRebateRate: [{required: true, validator: validateNumber1, trigger: 'blur'}],
          hangAutoCarryTime: [{required: true, validator: validateHangAutoCarryTime, trigger: 'blur'}],
          hangTime: [{required: true, validator: validateHangTime, trigger: 'blur'}]
        },
        purchasePrice: [{validator: validateInt, trigger: 'blur'}],
        purchasePriceNo: [{validator: validateInt1, trigger: 'blur'}],
        allPurchasePrice: true,    // 抢购价全选
        defaultSkuId: '',         // 默认sku id
        keyValue: '',             // key值
        skuTitleList: [],         // sku标题
        catalogName: '抢购配置',       // 当前目录名称
        liList: [{name: '抢购配置', url: '#rushInfo'}, {name: '批发配置', url: '#wholesaleInfo'}, {name: '挂售配置', url: '#saleInfo'}],
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
          this.$refs['formData'].clearValidate()
        }, 150)
      })
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      if (this.$route.path.match(/settingDetail/gi)) this.pageType = 2
      this.formData.id = this.$route.query.id
      this.formData.goodsId = this.$route.query.goodsId
      this.formData.themeType = this.$route.query.type
      if (this.formData.id && this.formData.goodsId) this.getDetailsData()
    },

    methods: {
      /**
       * 锚链接跳转,不更改路由
       */
      scrollTo (name, url) {
        document.querySelector(url).scrollIntoView(true)
        let dom = document.getElementsByClassName('admin-child-main')[0]
        if (name === '抢购配置') dom.scrollTop = 0
       // if (name === '批发配置') dom.scrollTop = '500px'
        this.catalogName = name
      },
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
          },
          on: {
            change: (value) => {
              this[column.property] = value
              this.formData.skuUpdateList.forEach((row, index) => {
                switch (column.property) {
                  case 'allPurchasePrice':
                    row.ifPurchasePrice = value
                    this.$refs['formData'].validateField('skuUpdateList.' + index + '.purchasePrice')
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
       * 获取详情数据
       */
      getDetailsData () {
        this.$http.post('@ROOT_API/shareTheme/getThemeGoodSettingDetail', {
          id: this.formData.id           // 是 int 关联分享商品数据主键
        //  goodsId: this.formData.goodsId  // 是 int 商品主键
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
          // ..
          if (results.grabStartDate !== null && results.grabStartDate !== '' && results.grabEndDate !== null && results.grabEndDate !== '') {
            this.formData.rushDateArr = [this.$Utils.filterDate(results.grabStartDate), this.$Utils.filterDate(results.grabEndDate)]
          } else {
            this.formData.rushDateArr = []
          }

          if (results.purchaseStartDate !== null && results.purchaseStartDate !== '' && results.purchaseEndDate !== null && results.purchaseEndDate !== '') {
            this.formData.wholesaleDateArr = [this.$Utils.filterDate(results.purchaseStartDate), this.$Utils.filterDate(results.purchaseEndDate)]
          } else {
            this.formData.wholesaleDateArr = []
          }

          if (results.grabStartDateNow !== null && results.grabStartDateNow !== '' && results.grabEndDateNow !== null && results.grabEndDateNow !== '') {
            let s = '2018-12-12 ' + results.grabStartDateNow
            let e = '2018-12-12 ' + results.grabEndDateNow
            this.formData.rushTimeArr = [s, e]
          } else {
            this.formData.rushTimeArr = ''
          }

          if (results.purchaseStartDateNow !== null && results.purchaseStartDateNow !== '' && results.purchaseEndDateNow !== null && results.purchaseEndDateNow !== '') {
            let s = '2018-12-12 ' + results.purchaseStartDateNow
            let e = '2018-12-12 ' + results.purchaseEndDateNow
            this.formData.wholesaleTimeArr = [s, e]
          } else {
            this.formData.wholesaleTimeArr = ''
          }

          //   if (results.startDate !== null && results.startDate !== '' && results.endDate !== null && results.endDate !== '') {
          //     let startDateNow = new Date(2018, 12, results.startDateNow.substring(0, 1), results.startDateNow.substring(3, 4), results.startDateNow.substring(6, 7))
          //     let endDateNow = new Date(2018, 12, results.endDateNow.substring(0, 1), results.endDateNow.substring(3, 4), results.endDateNow.substring(6, 7))
          //     this.formData.rushTimeArr = [startDateNow, endDateNow]
          //   } else {
          //     this.formData.rushTimeArr = ['', '']
          //   }
          // ///
          // if (results.startDateNow !== null && results.startDateNow !== '') {
          //  //  let s = results.startDateNow.replace(':', '')
          //   this.formData.startDateNow = new Date(2018, 12, results.startDateNow.substring(0, 1), results.startDateNow.substring(3, 4), results.startDateNow.substring(6, 7))
          // } else {
          //   this.formData.startDateNow = ''
          // }

          //   if (results.endDateNow !== null && results.endDateNow !== '') {
          //     this.formData.endDateNow = new Date(2018, 12, results.endDateNow.substring(0, 1), results.endDateNow.substring(3, 4), results.endDateNow.substring(6, 7))
          //   } else {
          //     this.formData.endDateNow = ''
          //   }
          this.formData.grabTicketGiveRate = results.grabTicketGiveRate
          this.formData.grabNumNow = results.grabNumNow
          this.formData.grabNumNowSys = results.grabNumNowSys
          this.formData.grabNumLimit = results.grabNumLimit
          this.formData.grabStartDate = results.grabStartDate
          this.formData.grabEndDate = results.grabEndDate
          this.formData.grabStatus = results.grabStatus
          this.formData.purchaseBuyPriceRate = results.purchaseBuyPriceRate
          this.formData.purchaseTicketNeedRate = results.purchaseTicketNeedRate
          this.formData.purchaseNumTotal = results.purchaseNumTotal
          this.formData.purchaseNumNow = results.purchaseNumNow
          this.formData.purchaseNumLimit = results.purchaseNumLimit
          this.formData.purchaseStatus = results.purchaseStatus
          this.formData.purchaseStartDate = results.purchaseStartDate
          this.formData.purchaseEndDate = results.purchaseEndDate
          this.formData.grabStartDateNow = results.grabStartDateNow
          this.formData.grabEndDateNow = results.grabEndDateNow
          this.formData.purchaseStartDateNow = results.purchaseStartDateNow
          this.formData.purchaseEndDateNow = results.purchaseEndDateNow
          this.formData.hangRebateRate = results.hangRebateRate
          this.formData.hangAutoCarryStatus = 0
        //  this.formData.hangAutoCarryTime = results.hangAutoCarryTime  // 自动提货时间
        //  this.formData.hangEstimatedSellTime = results.hangEstimatedSellTime      // 预计售出时间
         // 3-15 版本自动提货不上--------
        // if (results.hangAutoCarryStatus) {
        //   this.formData.hangAutoCarryStatus = results.hangAutoCarryStatus
        // } else {
        //   this.formData.hangAutoCarryStatus = 0
        // }
          if (results.hangTime !== null) {     // 挂售时间
            this.formData.hangTime = results.hangTime
          } else {
            this.formData.hangTime = 1
          }
          if (results.hangEstimatedSellTime !== null) {     // 自动提货时间
            this.formData.hangEstimatedSellTime = results.hangEstimatedSellTime
          } else {
            this.formData.hangEstimatedSellTime = '7-10天'
          }
          if (results.grabLimit) {
            this.formData.grabLimit = results.grabLimit
          } else {
            this.formData.grabLimit = 0
          }
          let filterDefaultSku = results.goodsSkuList.filter(row => row.whetherDefaultSku === 1)
          results.goodsSkuList.forEach((row, index) => {
            row.ifPurchasePrice = 1
          //  row.ifPurchasePrice = row.ifPurchasePrice === 1 ? !!true : !!false
            // 选中默认sku
            if (!this.defaultSkuId && parseInt(row.disStatus) === 0 && (!filterDefaultSku.length || (filterDefaultSku.length && parseInt(filterDefaultSku[0].disStatus) === 1) || row.whetherDefaultSku === 1)) this.defaultSkuId = row.id
           // if (!row.ifPurchasePrice) this.allPurchasePrice = false

            if (index === 0) {
              row.goodsSkuValList.forEach((list) => {
                this.skuTitleList.push(list.standardName)
              })
            }
          })
          this.formData.skuUpdateList = results.goodsSkuList
          this.purchaseBuyPriceRateChange()
          if (this.formData.skuUpdateList.length === 1) {
            this.formData.multStandard = 1
            this.formData.skupurchasePrice = this.formData.skuUpdateList[0].purchasePrice
            this.keyValue = new Date().getTime()
          }
        })
      },
      /**
       * 价格输入框自动补全价格
       */
      inpBlur (obj) {
        this.$Utils.blurAutoCompletion(this.formData, obj)
      },
      /**
       * 批发价比例改变(联动相关数据)
       */
      purchaseBuyPriceRateChange () {
        this.formData.skuUpdateList.forEach(item => {
          this.getWholesale(item)
          this.getWholesaleVolume(item)
          this.getDoWholesaleVolume(item)
          this.getReflux(item)
          this.getProfitMargin(item)
        })
      },

      /**
       * 状态切换
       */
      switchPublicChange (obj, whether, allSelect, row) {
        let selectLen = 0
        let visibleLen = 0
        this.formData.skuUpdateList.forEach((row) => {
          if (whether && row[whether] && row.disStatus === 0) selectLen++
          if (row.disStatus === 0) visibleLen++
        })
        if (allSelect) this[allSelect] = selectLen === visibleLen
        if (obj) this.$refs['formData'].validateField(obj)
      //  if (row.ifPurchasePrice === false) this.$refs['formData'].clearValidate('purchasePrice')
        this.getWholesale(row)
        this.getWholesaleVolume(row)
        this.getDoWholesaleVolume(row)
        this.getReflux(row)
        this.getProfitMargin(row)
      },
      /**
       * 抢购价改变
       */
      purchaseChange (row) {
        this.getWholesale(row)
        this.getWholesaleVolume(row)
        this.getDoWholesaleVolume(row)
        this.getReflux(row)
        this.getProfitMargin(row)
      },
      /**
       * 一键同步
       * @param  {[String]} key [需要同步的键]
       */
      handleSync (key, index) {
      //  console.log('handleSync: ', key, index)
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
       * 计算利润率
       */
      getProfitMargin (item) {
        if (item.purchasePrice > 0 && item.buyingPrice > 0 && this.formData.purchaseBuyPriceRate > 0 && this.formData.hangRebateRate > 0) {
          let reflux = (parseFloat(item.purchasePrice) * parseInt(this.formData.hangRebateRate) * 0.01).toFixed(2)
          let wholesale = (parseFloat(item.purchasePrice) * parseInt(this.formData.purchaseBuyPriceRate) * 0.01).toFixed(2)
          let totalTurnover = parseFloat(wholesale) + parseFloat(item.purchasePrice)
          let profit = totalTurnover - item.buyingPrice - reflux
         // console.log(reflux)
         // console.log(wholesale)
         // console.log(totalTurnover)
         // console.log(profit)
          return ((profit / totalTurnover) * 100).toFixed(2) + '%'
        } else {
          return '--'
        }
       // if (item.purchasePrice > 0 && item.buyingPrice > 0 && this.formData.purchaseBuyPriceRate > 0 && this.formData.hangRebateRate > 0 && item.ifPurchasePrice === true) {
       //   let reflux = (parseFloat(item.purchasePrice) * parseInt(this.formData.hangRebateRate) * 0.01)
       //   let totalTurnover = parseFloat(reflux + item.purchasePrice)
       //   let profit = totalTurnover - reflux - item.buyingPrice
       //   return ((profit / totalTurnover) * 100).toFixed(2) + '%'
       // } else if (item.goodsPrice > 0 && item.buyingPrice > 0 && this.formData.purchaseBuyPriceRate > 0 && this.formData.hangRebateRate > 0 && item.ifPurchasePrice === false) {
       //   let reflux = (parseFloat(item.goodsPrice) * parseInt(this.formData.hangRebateRate) * 0.01)
       //   let totalTurnover = parseFloat(reflux + item.goodsPrice)
       //   let profit = totalTurnover - reflux - item.buyingPrice
       //   return ((profit / totalTurnover) * 100).toFixed(2) + '%'
       // } else {
       //   return '--'
       // }
      },
      /**
       * 计算批发价
       */
      getWholesale (item) {
        if (item.purchasePrice > 0 && this.formData.purchaseBuyPriceRate > 0) {
          return (parseFloat(item.purchasePrice) * parseInt(this.formData.purchaseBuyPriceRate) * 0.01).toFixed(2)
        } else {
          return '--'
        }
       // if (item.purchasePrice > 0 && item.ifPurchasePrice === true && this.formData.purchaseBuyPriceRate > 0) {
       //   return (parseFloat(item.purchasePrice) * parseInt(this.formData.purchaseBuyPriceRate) * 0.01)
       // } else if (item.goodsPrice > 0 && item.ifPurchasePrice === false && this.formData.purchaseBuyPriceRate > 0) {
       //   return (parseFloat(item.goodsPrice) * parseInt(this.formData.purchaseBuyPriceRate) * 0.01)
       // } else {
       //   return '--'
       // }
      },
      /**
       * 计算需批发券
       */
      getWholesaleVolume (item) {
        if (item.purchasePrice > 0 && this.formData.purchaseTicketNeedRate > 0) {
          return parseInt(parseFloat(item.purchasePrice) * parseInt(this.formData.purchaseTicketNeedRate) * 0.01)
        } else {
          return '--'
        }
      //  if (item.purchasePrice > 0 && item.ifPurchasePrice === true && this.formData.purchaseTicketNeedRate > 0) {
      //    return parseInt(parseFloat(item.purchasePrice) * parseInt(this.formData.purchaseTicketNeedRate) * 0.01)
      //  } else if (item.goodsPrice > 0 && item.ifPurchasePrice === false && this.formData.purchaseTicketNeedRate > 0) {
      //    return parseInt(parseFloat(item.goodsPrice) * parseInt(this.formData.purchaseTicketNeedRate) * 0.01)
      //  } else {
      //    return '--'
      //  }
      },
      /**
       * 计算获批发券
       */
      getDoWholesaleVolume (item) {
        if (item.purchasePrice > 0 && this.formData.grabTicketGiveRate > 0) {
          return parseInt(parseFloat(item.purchasePrice) * parseInt(this.formData.grabTicketGiveRate) * 0.01)
        } else {
          return '--'
        }
       // if (item.purchasePrice > 0 && item.ifPurchasePrice === true && this.formData.grabTicketGiveRate > 0) {
       //   return parseInt(parseFloat(item.purchasePrice) * parseInt(this.formData.grabTicketGiveRate) * 0.01)
       // } else if (item.goodsPrice > 0 && item.ifPurchasePrice === false && this.formData.grabTicketGiveRate > 0) {
       //   return parseInt(parseFloat(item.goodsPrice) * parseInt(this.formData.grabTicketGiveRate) * 0.01)
       // } else {
       //   return '--'
       // }
      },
      /**
       * 计算出售返额
       */
      getReflux (item) {
        if (item.purchasePrice > 0 && this.formData.hangRebateRate > 0) {
          return (parseFloat(item.purchasePrice) * parseInt(this.formData.hangRebateRate) * 0.01).toFixed(2)
        } else {
          return '--'
        }
       // if (item.purchasePrice > 0 && item.ifPurchasePrice === true && this.formData.hangRebateRate > 0) {
       //   return (parseFloat(item.purchasePrice) * parseInt(this.formData.hangRebateRate) * 0.01)
       // } else if (item.goodsPrice > 0 && item.ifPurchasePrice === false && this.formData.hangRebateRate > 0) {
       //   return (parseFloat(item.goodsPrice) * parseInt(this.formData.hangRebateRate) * 0.01)
       // } else {
       //   return '--'
       // }
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
             // console.log('res: ', res)
            }
          }
        }
        // if (type) console.log('filterValueExist res: ', res)
        return res
        // return value && value.toString().match(/^[1-9]{1}\d{0,19}$/gi) ? (type ? parseFloat(value) * 0.15 : parseFloat(value)) : 0
      },
      /**
       * 日期选择抢购
       */
      getRushDate (val) {
        if (val) {
          this.formData.grabStartDate = val[0].getTime()
          this.formData.grabEndDate = val[1].getTime()
        }
      },
      /**
       * 日期选择批发
       */
      getWholesaleDate (val) {
        if (val) {
          this.formData.purchaseStartDate = val[0].getTime()
          this.formData.purchaseEndDate = val[1].getTime()
        }
      },
      /**
       * 时间选择抢购
       */
      getRushTime (val) {
        if (val) {
          this.formData.grabStartDateNow = this.$Utils.filterDate(val[0]).substring(11)
          this.formData.grabEndDateNow = this.$Utils.filterDate(val[1]).substring(11)
        }
        // this.formData.endDateNow = this.$Utils.filterDate(val[1]).substring(11)
      },
      /**
       * 时间选择批发
       */
      getWholesaleTime (val) {
        if (val) {
          this.formData.purchaseStartDateNow = this.$Utils.filterDate(val[0]).substring(11)
          this.formData.purchaseEndDateNow = this.$Utils.filterDate(val[1]).substring(11)
        }
        // this.formData.endDateNow = this.$Utils.filterDate(val[1]).substring(11)
      },
      /**
       * 时间选择
       */
      getTime1 (val) {
        this.formData.startDateNow = this.$Utils.filterDate(val).substring(11)
        // this.formData.startDateNow = this.$Utils.filterDate(val[0]).substring(11)
        // this.formData.endDateNow = this.$Utils.filterDate(val[1]).substring(11)
      },
      /**
       * 提交数据
       */
      handleSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          let data = this.$Utils.deepCopy(this.formData)
          data.skuUpdateList.forEach((row) => {
            row.whetherDefaultSku = 0
            if (parseInt(this.defaultSkuId) === parseInt(row.id)) row.whetherDefaultSku = 1
            // this.formData.purchasePrice = parseInt(this.formData.skupurchasePrice)
           // row.ifPurchasePrice = row.ifPurchasePrice === true ? 1 : 0
            // row.purchasePrice = parseFloat(row.purchasePrice)
            this.$set(row, 'skuId', row.id)
          })
          data.skuId = parseInt(this.defaultSkuId)
          // data.startDateNow = this.$Utils.filterDate(data.rushTimeArr.startDateNow).substring(11)
          // data.endDateNow = this.$Utils.filterDate(data.rushTimeArr.endDateNow).substring(11)
          //  delete data.rushDateArr
         // this.formData.hangTime === 1 ? this.hangTime = 1 : ''
          delete data.rushDateArr
          delete data.wholesaleDateArr
          delete data.rushTimeArr
          delete data.wholesaleTimeArr
          //  delete data.skupurchasePrice
          //  if (this.formData.multStandard === 1) data.skuUpdateList[0].purchasePrice = parseInt(this.formData.skupurchasePrice)
          this.submitLoading = true
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
           // this.$router.back()
            this.getDetailsData()
          }).finally(() => {
            this.submitLoading = false
          })
          //  let currentDate = new Date()
          //  if (currentDate > data.grabStartDate || currentDate > data.grabEndDate || currentDate > data.purchaseEndDate || currentDate > data.purchaseStartDate) {
          //    this.$message({
          //      message: '抢购时间或批发时间均不能小于今天',
          //      type: 'error',
          //      duration: 1500
          //    })
          //  } else {
          //  }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .ml-20{
    margin-left: 20px;
  }
  .ml-10{
    margin-left: 10px;
  }
  .operation-luckyBuy-goods-setting{
    .el-form-item{
     /* margin-bottom: 20px;*/

      .el-input, .el-textarea{
        width: 360px;
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

    /* -------------------- { element sku table } -------------------- */
    .el-sku-table{
      max-height: 360px;
      .el-table{
        height: 100px;
        overflow: scroll
      }
      td{
        .cell{
          overflow: inherit;
        }

        .el-form-item{
          margin-bottom: 18px;
          padding-top: 10px;
      /*    .el-form-item__error{
            z-index: 99;
            padding-top: 0;
          }*/
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
  }
</style>

<style lang="less">
  .operation-luckyBuy-goods-setting{
    .mb-20{
      margin-bottom: 20px;
    }
    .fixed-bg{
      background: #a8cef9;
      position: fixed;
      z-index: 888;
      top: 140px;
      right: 46px;
      left: 250px;
      min-height: 240px;
      max-height: 240px;
/*      opacity: 0.5;*/
    }
    .fixed-content{
      position: fixed;
      z-index: 999;
      top: 140px;
      right: 46px;
      left: 250px;
      min-height: 240px;
      max-height: 240px;
      section{
        padding: 10px 20px 0px;
      }
    }
    /*------目录指引-----*/
    .catalog-info{
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 999;
      font-size: 14px;
      a{
        display: block;
        padding: 10px 30px;
        background: rgb(214,235,255);
        margin-bottom: 5px;
        text-align: center;
        cursor: pointer;
      }
      .active{
        background: #ffffcc;
      }
    }
    .upload-wrap.max{
      .el-upload{
        display: none !important;
      }
    }

    .esp-form-item{
      .el-form-item__error{
        left: 155px!important;
      }
    }

    .el-form-item__error{
      white-space: nowrap;
    }
    table{
      .el-radio__label{
        display: none;
      }
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

  }
</style>
