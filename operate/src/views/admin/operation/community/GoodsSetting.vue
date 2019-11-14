  <!-- 关联商品设置 -->
<template>
  <common-tpl class="operation-community-goods-setting" footer back>
    <template slot="main">
      <el-form :model="formData" ref="form" :rules="rules" label-width="160px">
        <gray-title>内容配置</gray-title>
        <br>
        <!-- <el-form-item label="拼团主题：" prop="themeName">
          <el-input v-model="formData.themeName"></el-input>
        </el-form-item>
 -->
        <el-form-item :label="this.setType === 3 ? '列表主图： ' : '活动图片：'"  :prop="pageType === 1 ? 'activeImg' : ''">
          <thumbnail-component :size="100" del :auto-delete="true" @change="handleDelActiveImg" :list="formData.activeImgList" :empty="false">
            <template slot="other">
              <upload-component :size="100" @success="uploadSuccessHandle" v-if="!formData.activeImgList.length"></upload-component>
              <div class="pos-a" style="color: #f5a74a; line-height: 30px; margin-left: 140px; margin-top: -30px; top: 50%;">
                建议尺寸：500 * 500px<br>建议大小：100KB以内
              </div>
            </template>
          </thumbnail-component>
          <el-input v-model="formData.activeImg" class="d-n"></el-input>
        </el-form-item>

        <el-form-item :label="this.setType === 3 ? '列表说明：' : '说明：'" :prop="pageType === 1 ? 'remark' : ''">
          <template v-if="pageType === 1">
            <el-input type="textarea" :rows="5" v-model="formData.remark" maxlength="500"></el-input>
            <span style="color: #999; margin-left: 10px;">{{formData.remark.length}}/500</span>
          </template>

          <template v-else>{{formData.remark}}</template>
        </el-form-item>

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
              <el-table-column label="销售价" min-width="100px">
                <template slot-scope="scope">{{scope.row.goodsPrice | filterMoney}}</template>
              </el-table-column>

              <el-table-column label="分享价" width="180px" prop="allSharePrice" :render-header="renderHeader" v-if="exchangeType === 1">
                <template slot-scope="scope">
                  <template v-if="pageType === 1">
                    <div class="pos-r" :class="{'pd-l': pageType === 1, 'pd-r': pageType === 1}">
                      <el-checkbox class="pos-a" style="left: 10px;" v-model="scope.row.whetherShare" @change="goodsSharePriceListChange('specTableData.' + scope.$index + '.goodsSharePrice')"></el-checkbox>
                      <el-form-item label-width="0" :prop="'specTableData.' + scope.$index + '.goodsSharePrice'" :rules="ruleGoodsSharePrice">
                        <el-input size="medium" v-model="scope.row.goodsSharePrice" :disabled="!scope.row.whetherShare" v-auto-price></el-input>
                      </el-form-item>
                      <ali-icon icon="icon-jiantou3" :size="30" title="一键同步" class="cursor-p pos-a sync-btn" @click.native="handleSync('goodsSharePrice', scope.$index)" v-if="scope.$index === 0"></ali-icon>
                    </div>
                  </template>
                  <template v-else>{{scope.row.whetherShare ? scope.row.goodsSharePrice : '否'}}</template>
                </template>
              </el-table-column>

              <el-table-column label="拼团价" width="180px" :key="Math.random()" v-if="exchangeType === 5">
                <template slot-scope="scope">
                  <template v-if="pageType === 1">
                    <div class="pos-r" :class="{'pd-r': pageType === 1}">
                    <!--   <el-checkbox class="pos-a" style="left: 10px;" v-model="scope.row.ifGoodsGroupPrice" @change="goodsAssemblePriceListChange('specTableData.' + scope.$index + '.goodsGroupPrice')"></el-checkbox> -->
                      <el-form-item label-width="0" :prop="'specTableData.' + scope.$index + '.goodsGroupPrice'" :rules="ruleGoodsAssemblePrice">
                        <el-input size="medium" v-model="scope.row.goodsGroupPrice" v-auto-price></el-input>
                      </el-form-item>
                      <ali-icon icon="icon-jiantou3" :size="30" title="一键同步" class="cursor-p pos-a sync-btn" @click.native="handleSync('goodsGroupPrice', scope.$index)" v-if="scope.$index === 0"></ali-icon>
                    </div>
                  </template>
                  <template v-else>{{scope.row.ifGoodsGroupPrice ? scope.row.goodsGroupPrice : '否'}}</template>
                </template>
              </el-table-column>

              <!-- <el-table-column label="福利价" width="160px" :key="Math.random()" prop="allWelfarePrice" :render-header="renderHeader" v-if="setupType === 2">
                <template slot-scope="scope">
                  <template v-if="pageType === 1">
                    <div class="pos-r" :class="{'pd-l': pageType === 1, 'pd-r': pageType === 1}">
                      <el-checkbox class="pos-a" v-model="scope.row.whetherGoldBeanPrice" @change="goodsGoldBeanPriceListChange('specTableData.' + scope.$index + '.goodsGoldBeanPrice')"></el-checkbox>
                      <el-form-item label-width="0" :prop="'specTableData.' + scope.$index + '.goodsGoldBeanPrice'" :rules="ruleGoodsGoldBeanPrice">
                        <el-input size="medium" v-model="scope.row.goodsGoldBeanPrice" :disabled="!scope.row.whetherGoldBeanPrice" @blur="inpBlur(scope.row)"></el-input>
                      </el-form-item>
                      <ali-icon icon="icon-jiantou3" :size="30" title="一键同步" class="cursor-p pos-a sync-btn" @click.native="handleSync('goodsGoldBeanPrice', scope.$index)" v-if="scope.$index === 0"></ali-icon>
                    </div>
                  </template>
                  <template v-else>{{scope.row.whetherGoldBeanPrice ? scope.row.goodsSharePrice : '否'}}</template>
                </template>
              </el-table-column>

              <el-table-column label="兑换芯豆数量" width="160px" :key="Math.random()" prop="allBeanPrice" :render-header="renderHeader" v-if="setupType === 2">
                <template slot-scope="scope">
                  <template v-if="pageType === 1">
                    <div class="pos-r" :class="{'pd-l': pageType === 1, 'pd-r': pageType === 1}">
                      <el-checkbox class="pos-a" v-model="scope.row.whetherGoldBeanNum" @change="goodsBeanPriceListChange('specTableData.' + scope.$index + '.goodsGoldBeanNum')"></el-checkbox>
                      <el-form-item label-width="0" :prop="'specTableData.' + scope.$index + '.goodsGoldBeanNum'" :rules="ruleGoodsGoldBeanNum">
                        <el-input v-model="scope.row.goodsGoldBeanNum" :disabled="!scope.row.whetherGoldBeanNum" @blur="inpBlur(scope.row)"></el-input>
                      </el-form-item>
                      <ali-icon icon="icon-jiantou3" :size="30" title="一键同步" class="cursor-p pos-a sync-btn" @click.native="handleSync('goodsGoldBeanNum', scope.$index)" v-if="scope.$index === 0"></ali-icon>
                    </div>
                  </template>
                  <template v-else>{{scope.row.whetherGoldBeanNum ? scope.row.goodsGoldBeanNum : '否'}}</template>
                </template>
              </el-table-column> -->
              
              <el-table-column label="芯豆价" min-width="100px" :key="Math.random()" prop="allGoldBeanPrice" :render-header="renderHeader" v-if="exchangeType === 2">
                <template slot-scope="scope">
                  <div class="pos-r pd-l">
                    <el-checkbox class="pos-a" v-model="scope.row.whetherGoldBeanPrice" @change="switchPublicChange('specTableData.' + scope.$index + '.goodsGoldBeanPrice', 'whetherGoldBeanPrice', 'allGoldBeanPrice')"></el-checkbox>
                    <el-form-item :prop="'specTableData.' + scope.$index + '.goodsGoldBeanPrice'" :rules="ruleGoldBeanPrice">
                      <el-input size="medium" v-model="scope.row.goodsGoldBeanPrice" :disabled="!scope.row.whetherGoldBeanPrice" maxlength="9" v-auto-price></el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="组合芯豆数" min-width="80px" :key="Math.random()" v-if="exchangeType === 2">
                <template slot-scope="scope">
                  <el-form-item :prop="'specTableData.' + scope.$index + '.goodsGoldBeanNum'" :rules="ruleGoodsGoldBeanNum">
                    <el-input size="medium" v-model="scope.row.goodsGoldBeanNum" maxlength="9"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="消费积分价" width="170px" :key="Math.random()" prop="allBonusPrice" :render-header="renderHeader" v-if="exchangeType === 3">
                <template slot-scope="scope">
                  <div class="pos-r pd-l">
                    <el-checkbox class="pos-a" v-model="scope.row.whetherBonusPrice" @change="switchPublicChange('specTableData.' + scope.$index + '.goodsBonusPrice', 'whetherBonusPrice', 'allBonusPrice')"></el-checkbox>
                    <el-form-item :prop="'specTableData.' + scope.$index + '.goodsBonusPrice'" :rules="ruleGoodsBonusPrice">
                      <el-input size="medium" v-model="scope.row.goodsBonusPrice" :disabled="!scope.row.whetherBonusPrice" v-auto-price></el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="组合消费积分数" width="140px" :key="Math.random()" v-if="exchangeType === 3">
                <template slot-scope="scope">
                  <el-form-item :prop="'specTableData.' + scope.$index + '.goodsBonusPoints'" :rules="ruleGoodsBonusPoints">
                    <el-input size="medium" v-model="scope.row.goodsBonusPoints" maxlength="9"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="联盟积分价" width="170px" :key="Math.random()" prop="allLeaguePrice" :render-header="renderHeader" v-if="exchangeType === 4">
                <template slot-scope="scope">
                  <div class="pos-r pd-l">
                    <el-checkbox class="pos-a" v-model="scope.row.whetherLeaguePrice" @change="switchPublicChange('specTableData.' + scope.$index + '.goodsLeaguePrice', 'whetherLeaguePrice', 'allLeaguePrice')"></el-checkbox>
                    <el-form-item :prop="'specTableData.' + scope.$index + '.goodsLeaguePrice'" :rules="ruleGoodsLeaguePrice">
                      <el-input size="medium" v-model="scope.row.goodsLeaguePrice" :disabled="!scope.row.whetherLeaguePrice" v-auto-price></el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="组合联盟积分数" width="140px" :key="Math.random()" v-if="exchangeType === 4">
                <template slot-scope="scope">
                  <el-form-item :prop="'specTableData.' + scope.$index + '.goodsLeaguePoints'" :rules="ruleGoodsLeaguePoints">
                    <el-input size="medium" v-model="scope.row.goodsLeaguePoints" maxlength="9"></el-input>
                  </el-form-item>
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

            <!-- <br>

            <table class="sku-table">
              <tr>
                <th class="ta-c" width="60">默认价格</th>
                <th v-for="item in skuTitleList">{{item}}</th>
                <th>进货价</th>
                <th>销售价</th>
                <template v-if="setupType === 1">
                  <th width="100px" :class="{'pd-l': pageType === 1}">
                    <el-checkbox class="pos-a" v-model="allSharePrice" :disabled="!formData.specTableData.length" @change="allSharePriceChange" v-if="pageType === 1"></el-checkbox>分享价
                  </th>
                </template>
                <template v-else>
                  <th width="100px" :class="{'pd-l': pageType === 1}">
                    <el-checkbox class="pos-a" v-model="allWelfarePrice" :disabled="!formData.specTableData.length" @change="allWelfarePriceChange" v-if="pageType === 1"></el-checkbox>福利价
                  </th>
                  <th width="100px" :class="{'pd-l': pageType === 1}">
                    <el-checkbox class="pos-a" v-model="allBeanPrice" :disabled="!formData.specTableData.length" @change="allBeanPriceChange" v-if="pageType === 1"></el-checkbox>兑换芯豆数量
                  </th>
                </template>
                <th>当前库存</th>
                <th>利润率（利润/成交价）</th>
                <th>是否特卖</th>
              </tr>
              <tr v-for="(item, index) in formData.specTableData" v-if="parseInt(item.disStatus) !== 1">
                <td class="ta-c">
                  <el-radio v-model="defaultSkuId" :label="item.id" :disabled="pageType === 2 || parseInt(item.disStatus) === 1" :title="parseInt(item.disStatus) === 1 ? '已被禁用，不能勾选' : ''"></el-radio>
                </td>
                <td v-for="list in item.goodsSkuValList">{{list.standardValName}}</td>
                <td>{{item.buyingPrice | filterMoney}}</td>
                <td>{{item.goodsPrice | filterMoney}}</td>
                <td :class="{'pd-l': pageType === 1, 'pd-r': pageType === 1}" v-if="setupType === 1">
                  <template v-if="pageType === 1">
                    <el-checkbox class="pos-a" v-model="item.whetherShare" @change="goodsSharePriceListChange('specTableData.' + index + '.goodsSharePrice')"></el-checkbox>
                    <el-form-item label-width="0" :prop="'specTableData.' + index + '.goodsSharePrice'" :rules="ruleGoodsSharePrice">
                      <el-input v-model="item.goodsSharePrice" @blur="inpBlur(item)"></el-input>
                    </el-form-item>
                    <span title="一键同步" class="pos-a sync-btn" v-if="index === 0">
                      <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" @click="handleSync('goodsSharePrice', index)">
                        <use xlink:href="#icon-jiantou3"></use>
                      </svg>
                    </span>
                  </template>
                  <template v-else>{{item.whetherShare ? item.goodsSharePrice : '否'}}</template>
                </td>
                <td :class="{'pd-l': pageType === 1, 'pd-r': pageType === 1}" v-if="setupType === 2">
                  <template v-if="pageType === 1">
                    <el-checkbox class="pos-a" v-model="item.whetherGoldBeanPrice" @change="goodsGoldBeanPriceListChange('specTableData.' + index + '.goodsGoldBeanPrice')"></el-checkbox>
                    <el-form-item label-width="0" :prop="'specTableData.' + index + '.goodsGoldBeanPrice'" :rules="ruleGoodsGoldBeanPrice">
                      <el-input v-model="item.goodsGoldBeanPrice" @blur="inpBlur(item)"></el-input>
                    </el-form-item>
                    <span title="一键同步" class="pos-a sync-btn" v-if="index === 0">
                      <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" @click="handleSync('goodsSharePrice', index)">
                        <use xlink:href="#icon-jiantou3"></use>
                      </svg>
                    </span>
                  </template>
                  <template v-else>{{item.whetherGoldBeanPrice ? item.goodsSharePrice : '否'}}</template>
                </td>
                <td :class="{'pd-l': pageType === 1, 'pd-r': pageType === 1}" v-if="setupType === 2">
                  <template v-if="pageType === 1">
                    <el-checkbox class="pos-a" v-model="item.whetherGoldBeanNum" @change="goodsBeanPriceListChange('specTableData.' + index + '.goodsGoldBeanNum')"></el-checkbox>
                    <el-form-item label-width="0" :prop="'specTableData.' + index + '.goodsGoldBeanNum'" :rules="ruleGoodsGoldBeanNum">
                      <el-input v-model="item.goodsGoldBeanNum" @blur="inpBlur(item)"></el-input>
                    </el-form-item>
                    <span title="一键同步" class="pos-a sync-btn" v-if="index === 0">
                      <svg class="icon icon-jiantou3 cursor-p full-wrap" aria-hidden="true" @click="handleSync('goodsGoldBeanNum', index)">
                        <use xlink:href="#icon-jiantou3"></use>
                      </svg>
                    </span>
                  </template>
                  <template v-else>{{item.whetherGoldBeanNum ? item.goodsGoldBeanNum : '否'}}</template>
                </td>
                <td>{{item.goodsNum | filterMoney}}</td>
                <td>{{filterProfitMargin(item) | filterEmpty('%')}}</td>
                <td>{{'' | filterEmpty}}</td>
              </tr>
            </table> -->
          </el-form-item>
        </template>

        <template v-if="exchangeType === 1">
          <div class="profit-wrap">
            <el-form-item label='一级邀请人收益：' class="mb-0">
              <el-form-item label='' label-width="0" class="nesting-wrap" prop="levelOneConsumption" :rules="ruleValidateInt">
                <el-checkbox v-model="formData.isLevelOneConsumption" :disabled="pageType === 2">消费积分</el-checkbox>
                <el-input placeholder="非负整数，限6个字符" maxlength="6" v-model.trim="formData.levelOneConsumption" :readonly="pageType === 2"></el-input>
                <span class="tips-text">一个消费积分按一元的成本计算</span>
              </el-form-item>
              <el-form-item label='' label-width="0" class="nesting-wrap" prop="levelOneCurrency" :rules="ruleValidateInt">
                <el-checkbox v-model="formData.isLevelOneCurrency" :disabled="pageType === 2">通用积分</el-checkbox>
                <el-input placeholder="非负整数，限6个字符" maxlength="6" v-model.trim="formData.levelOneCurrency" :readonly="pageType === 2"></el-input>
                <span class="tips-text">一个通用积分按一元的成本计算</span>
              </el-form-item>
              <el-form-item label='' label-width="0" class="nesting-wrap" prop="levelOneBalance" :rules="ruleValidateInt">
                <el-checkbox v-model="formData.isLevelOneBalance" :disabled="pageType === 2">余额</el-checkbox>
                <el-input placeholder="非负整数，限6个字符" maxlength="6" v-model.trim="formData.levelOneBalance" :readonly="pageType === 2"></el-input>
                <span class="tips-text">一个余额按0.15元的成本计算</span>
              </el-form-item>
            </el-form-item>
          </div>

          <div class="profit-wrap">
            <el-form-item label='被邀请人收益：'>
              <el-form-item label="" label-width="0" class="nesting-wrap" prop="goldCoin" :rules="ruleValidateInt">
                <el-checkbox v-model="formData.isGoldCoin" :disabled="pageType === 2">芯豆</el-checkbox>
                <el-input placeholder="非负整数，限6个字符" maxlength="6" v-model.trim="formData.goldCoin" :readonly="pageType === 2"></el-input>
                <!-- <span class="tips-text">暂时不参与成本核算</span> -->
              </el-form-item>
            </el-form-item>
          </div>
        </template>

        <template v-if="this.setType === 3">
          <el-form-item label="拼团人数：" prop="groupNum">
            <template v-if="pageType === 1">
              <el-input v-model="formData.groupNum" placeholder="限0-10000000正整数"></el-input>
            </template>

            <template v-else>{{formData.remark}}</template>
          </el-form-item>

          <el-form-item label="拼团时间：" prop="groupTime">
            <el-input v-model="formData.groupTime" placeholder="限0-1000正整数"></el-input>
          </el-form-item>

          <el-form-item label="自动组团：" prop="ifAutoGroup" class="group-lable-show">
            <el-radio-group v-model="formData.ifAutoGroup">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
            <template v-if="formData.ifAutoGroup === 1">
              <div class="grouping-atomatic d-ib">
                当差 <el-input v-model="formData.surplusTime" placeholder="非负整数，限20个字符"></el-input> <span>min</span> 自动拼团完成订单
              </div>
            </template>
          </el-form-item>
        </template>


      </el-form>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit('form')" v-if="pageType === 1">提交</el-button>
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

    // 校验分享价
    let validateSharePrice = (rule, value, callback) => {
      let num = rule.field.split('.')[1]
      if (!value && this.formData.specTableData[num].whetherShare) return callback(new Error('请输入分享价'))
      if (value) {
        if (!value.toString().match(/\d/gi)) return callback(new Error('请输入正确的数值'))
        if (this.formData.specTableData[num].goodsPrice < value) return callback(new Error('分享价不能大于销售价'))
        callback()
      }
      callback()
    }

    // 校验团购价
    let validateAssemblePrice = (rule, value, callback) => {
      let num = rule.field.split('.')[1]
      if (!value && this.formData.specTableData[num].whetherAssemble) return callback(new Error('请输入  分享价'))
      if (value) {
        if (!value.toString().match(/\d/gi)) return callback(new Error('请输入正确的数值'))
        if (this.formData.specTableData[num].goodsPrice < value) return callback(new Error('分享价不能大于销售价'))
        callback()
      }
      callback()
    }

    // 校验福利价
    let validateGoldBeanPrice = (rule, value, callback) => {
      let num = rule.field.split('.')[1]
      if (!value && this.formData.specTableData[num].whetherGoldBeanPrice) return callback(new Error('请输入福利价'))
      if (value) {
        if (!value.toString().match(/\d/gi)) return callback(new Error('请输入正确的数值'))
        if (this.formData.specTableData[num].goodsPrice < value) return callback(new Error('福利价不能大于销售价'))
        callback()
      }
      callback()
    }

    // 校验芯豆数量
    // let validateGoldBeanNum = (rule, value, callback) => {
    //   // let num = rule.field.split('.')[1]
    //   // if (!value && this.formData.specTableData[num].whetherGoldBeanNum) return callback(new Error('请输入组合芯豆数'))
    //   if (value && !value.toString().match(/\d/gi)) return callback(new Error('请输入正整数'))
    //   callback()
    // }

    /**
     * 校验正整数
     */
    let validateTablePrice = (rule, value, callback) => {
      let num = rule.field.split('.')[1]
      if (!value && rule.whether && this.formData.specTableData[num][rule.whether]) return callback(new Error('请输入价格'))
      if (value) {
        if (value <= 0) return callback(new Error('价格必须大于0'))
        if (isNaN(value) || !value.toString().match(/^\d+\.\d{2}$/gi)) return callback(new Error('请输入正确价格'))
        callback()
      }
      callback()
    }

    /**
     * 校验正整数
     */
    let validateNumber = (rule, value, callback) => {
      if (value && !value.toString().match(/^[1-9]?\d+$/gi)) return callback(new Error('请输入正整数'))
      callback()
    }

    /**
     * 校验拼团
     */
    let validateAssemble = (rule, value, callback) => {
      if (value === '') return callback(new Error('拼团人数不能为空'))
      if (value && (value < 0 || value > 10000000 || !value.toString().match(/^\d+$/gi))) return callback(new Error('输入0~10000000正整数'))
      callback()
    }

    /**
     * 校验拼团时间
     */
    let validateGroupTime = (rule, value, callback) => {
      if (value === '') return callback(new Error('拼团时间不能为空'))
      if (value && (value < 0 || value > 1000 || !value.toString().match(/^\d+$/gi))) return callback(new Error('输入0~1000正整数'))
      callback()
    }

    return {
      pageType: 1,            // 页面类型 [1、设置，2、详情]
      setupType: 1,           // 设置类型 [1、推广拉新-社群运营， 2、互动运营设置-芯豆管理, 3、互动运营设置-拼团设置]
      setType: 1,             // 设置类型 [1、推广拉新-社群运营， 2、互动运营设置-芯豆管理, 3、互动运营设置-拼团设置]
      exchangeType: 1,        // 兑换类型
      submitLoading: false,   // 提交loading

      allSpecialSale: false,  // 是否特卖
      allGetPoint: false,     // 是否获得积分
      isAssemble: false,      // 判断是否是拼团模块

      formData: {
        // title: {},
        id: '',
        goodsId: '',
        activeImgList: [],    // 活动图片展示列表
        activeImg: '',        // 活动图片地址
        multStandard: 2,      // 商品规格 [1、统一规格，2、多规格]
        specTableData: [],    // sku列表
        defaultPrice: 0,      // 默认价
        goodsSharePrice: '',  // 分享价
        goodsGoldBeanNum: 0,  // 芯豆数量
        points: '',           // 获得积分
        remark: '',           // 说明
        buyingPrice: 100,     // 进货价
        goodsPrice: 200,      // 进货价
        levelOneConsumption: '',    // 一级消费积分
        isLevelOneConsumption: '',  // 是否获得一级消费积分
        levelOneCurrency: '',       // 一级通用积分
        isLevelOneCurrency: '',     // 是否获得一级通用积分
        levelOneBalance: '',        // 一级余额
        isLevelOneBalance: '',      // 是否获得一级余额
        goldCoin: '',               // 芯豆
        isGoldCoin: '',             // 是否获得芯豆
        maidData: {},               // 分佣比例及等级
        themeName: '',              // 拼团主题
        groupNum: '',               // 拼团人数
        groupTime: '',              // 拼团时间（小时）
        ifAutoGroup: 1,             // 自动组团（0：关闭，1：开启）
        surplusTime: ''             // 剩余多少时间（分钟）自动拼团完成
      },
      rules: {
        activeImg: [{required: true, message: '请上传图片', trigger: 'change'}],
        remark: [{required: true, message: '请填写说明', trigger: 'blur'}],
        groupNum: [{required: true, validator: validateAssemble, trigger: 'blur'}],
        groupTime: [{required: true, validator: validateGroupTime, trigger: 'blur'}],
        surplusTime: [{required: true, validator: validateInt, trigger: 'blur'}]
      },
      ruleGoodsSharePrice: [{validator: validateSharePrice, trigger: 'blur'}],
      ruleGoodsAssemblePrice: [{validator: validateAssemblePrice, trigger: 'blur'}],   // 拼团价
      ruleGoodsGoldBeanPrice: [{validator: validateGoldBeanPrice, trigger: 'blur'}],

      ruleGoldBeanPrice: [{whether: 'whetherGoldBeanPrice', validator: validateTablePrice, trigger: 'blur'}],
      ruleGoodsGoldBeanNum: [{validator: validateNumber, trigger: 'blur'}],

      ruleGoodsBonusPrice: [{whether: 'whetherBonusPrice', validator: validateTablePrice, trigger: 'blur'}],
      ruleGoodsBonusPoints: [{validator: validateNumber, trigger: 'blur'}],

      ruleGoodsLeaguePrice: [{whether: 'whetherLeaguePrice', validator: validateTablePrice, trigger: 'blur'}],
      ruleGoodsLeaguePoints: [{validator: validateNumber, trigger: 'blur'}],

      ruleValidateInt: [{validator: validateInt, trigger: 'blur'}],
      allSharePrice: true,      // 分享价全选
      allAssemblePrice: true,      // 分享价全选
      allWelfarePrice: false,   // 福利价全选
      allBeanPrice: false,      // 兑换芯豆数量全选
      allGoldBeanPrice: true,   // 芯豆价全选
      allBonusPrice: true,      // 消费积分价全选
      allLeaguePrice: true,     // 联盟积分价全选
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
    if (this.$route.path.match(/details/gi)) this.pageType = 2
    this.formData.id = this.$route.query.id
    this.formData.goodsId = this.$route.query.goodsId
    if (this.formData.id && this.formData.goodsId) this.getDetailsData()
    let matchPath = this.$route.path.match(/community|exchange|assemble/gi)
    if (matchPath) {
      switch (matchPath[0]) {
        case 'community':
          this.setType = 1   // 社区运营
          break
        case 'exchange':
          this.setType = 2   // 芯豆管理
          break
        case 'assemble':
          this.setType = 3   // 拼图
          break
      }
    }
    if (this.$route.query.type) this.exchangeType = parseInt(this.$route.query.type)
    // if (this.$route.path.match(/interactive\/exchange\/setting/gi)) this.setupType = 2
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
        },
        on: {
          change: (value) => {
            this[column.property] = value
            this.formData.specTableData.forEach((row, index) => {
              switch (column.property) {
                case 'allSpecialSale':
                  row.whetherSpecial = value
                  break
                case 'allWelfarePrice':
                  row.whetherGoldBeanPrice = value
                  break
                case 'allSharePrice':
                  row.whetherShare = value
                  this.$refs['form'].validateField('specTableData.' + index + '.goodsSharePrice')
                  break
                case 'allAssemblePrice':     // 拼图价
                  row.whetherAssemble = value
                  this.$refs['form'].validateField('specTableData.' + index + '.goodsSharePrice')
                  break
                case 'allGoldBeanPrice':
                  row.whetherGoldBeanPrice = value
                  this.$refs['form'].validateField('specTableData.' + index + '.goodsGoldBeanPrice')
                  break
                case 'allBeanPrice':
                  row.whetherGoldBeanNum = value
                  break
                case 'allBonusPrice':
                  row.whetherBonusPrice = value
                  this.$refs['form'].validateField('specTableData.' + index + '.goodsBonusPrice')
                  break
                case 'allLeaguePrice':
                  row.whetherLeaguePrice = value
                  this.$refs['form'].validateField('specTableData.' + index + '.goodsLeaguePrice')
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

        let filterDefaultSku = results.goodsSkuList.filter(row => row.whetherDefaultSku === 1)
        results.goodsSkuList.forEach((row, index) => {
          // 选中默认sku
          if (!this.defaultSkuId && parseInt(row.disStatus) === 0 && (!filterDefaultSku.length || (filterDefaultSku.length && parseInt(filterDefaultSku[0].disStatus) === 1) || row.whetherDefaultSku === 1)) this.defaultSkuId = row.id
          row.whetherShare = row.whetherShare === 1 ? !!true : !!false
          row.ifGoodsGroupPrice = row.ifGoodsGroupPrice === 1 ? !!true : !!false
          row.whetherGoldBeanNum = row.whetherGoldBeanNum === 1 ? !!true : !!false
          row.whetherGoldBeanPrice = row.whetherGoldBeanPrice === 1 ? !!true : !!false
          row.whetherBonusPrice = row.whetherBonusPrice === 1 ? !!true : !!false
          row.whetherLeaguePrice = row.whetherLeaguePrice === 1 ? !!true : !!false

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

        this.formData.levelOneConsumption = results.oneGetBonusPoints         // 一级消费积分
        this.formData.isLevelOneConsumption = parseInt(results.oneIfGetBonusPoints) ? !!true : !!false     // 是否获得一级消费积分
        this.formData.levelOneCurrency = results.oneGetCashPoints             // 一级通用积分
        this.formData.isLevelOneCurrency = parseInt(results.oneIfGetCashPoints) ? !!true : !!false         // 是否获得一级通用积分
        this.formData.levelOneBalance = results.oneGetBalance                 // 一级余额
        this.formData.isLevelOneBalance = parseInt(results.oneIfGetBalance) ? !!true : !!false             // 是否获得一级余额
        this.formData.goldCoin = results.beInviterGetGoldPoints               // 芯豆
        this.formData.isGoldCoin = parseInt(results.beInviterIfGetGoldPoints) ? !!true : !!false           // 是否获得芯豆

        this.goodsGoldBeanPriceListChange()
        this.goodsSharePriceListChange()
        this.goodsAssemblePriceListChange()    // 拼团价
        this.goodsBeanPriceListChange()
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
     * 删除图片成功
     */
    handleDelActiveImg () {
      this.formData.activeImg = ''
    },

    /**
    * 价格输入框自动补全价格
    */
    inpBlur (obj) {
      this.$Utils.blurAutoCompletion(this.formData, obj)
    },

    /**
     * 分享价全选
     */
    allSharePriceChange (value) {
      this.formData.specTableData.forEach((row) => {
        if (parseInt(row.disStatus) !== 1) row.whetherShare = value
      })
    },

    /**
     * 福利价全选
     */
    allWelfarePriceChange (value) {
      this.formData.specTableData.forEach((row) => {
        if (parseInt(row.disStatus) !== 1) row.whetherGoldBeanPrice = value
      })
    },

    /**
     * 分享价选择
     */
    goodsSharePriceListChange (obj) {
      let selectLen = 0
      let visibleLen = 0
      this.formData.specTableData.forEach((row) => {
        if (row.whetherShare && row.disStatus === 0) selectLen++
        if (row.disStatus === 0) visibleLen++
      })
      this.allSharePrice = selectLen === visibleLen
      if (obj) this.$refs['form'].validateField(obj)
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
     * 福利价选择
     */
    goodsGoldBeanPriceListChange (obj) {
      let selectLen = 0
      let visibleLen = 0
      this.formData.specTableData.forEach((row) => {
        if (row.whetherGoldBeanPrice && row.disStatus === 0) selectLen++
        if (row.disStatus === 0) visibleLen++
      })
      this.allWelfarePrice = selectLen === visibleLen
      if (obj) this.$refs['form'].validateField(obj)
    },

    /**
     * 状态切换
     */
    switchPublicChange (obj, whether, allSelect) {
      let selectLen = 0
      let visibleLen = 0
      this.formData.specTableData.forEach((row) => {
        if (whether && row[whether] && row.disStatus === 0) selectLen++
        if (row.disStatus === 0) visibleLen++
      })
      if (allSelect) this[allSelect] = selectLen === visibleLen
      if (obj) this.$refs['form'].validateField(obj)
    },

    /**
     * 消费积分价选择
     */
    goodsBonusPriceChange (obj) {
      let selectLen = 0
      let visibleLen = 0
      this.formData.specTableData.forEach((row) => {
        if (row.whetherGoldBeanPrice && row.disStatus === 0) selectLen++
        if (row.disStatus === 0) visibleLen++
      })
      this.allWelfarePrice = selectLen === visibleLen
      if (obj) this.$refs['form'].validateField(obj)
    },

    /**
     * 兑换芯豆数量全选
     */
    allBeanPriceChange (value) {
      this.formData.specTableData.forEach((row) => {
        if (parseInt(row.disStatus) !== 1) row.whetherGoldBeanNum = value
      })
    },

    /**
     * 兑换芯豆选择
     */
    goodsBeanPriceListChange (obj) {
      let selectLen = 0
      let visibleLen = 0
      this.formData.specTableData.forEach((row) => {
        if (row.whetherGoldBeanNum && row.disStatus === 0) selectLen++
        if (row.disStatus === 0) visibleLen++
      })
      this.allBeanPrice = selectLen === visibleLen
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
      // 推广拉新
      let goodsPrice = this.exchangeType === 1 && item.whetherShare ? (item.goodsSharePrice || 0) : parseFloat(item.goodsPrice)
      // 判断是否芯豆管理
      switch (this.exchangeType) {
        case 2:
          if (item.goodsGoldBeanPrice > 0 && !isNaN(item.goodsGoldBeanPrice)) goodsPrice = item.goodsGoldBeanPrice
          break
        case 3:
          if (item.goodsBonusPrice > 0 && !isNaN(item.goodsBonusPrice)) goodsPrice = item.goodsBonusPrice
          break
        case 4:
          if (item.goodsLeaguePrice > 0 && !isNaN(item.goodsLeaguePrice)) goodsPrice = item.goodsLeaguePrice
          break
        case 5:
          if (item.goodsGroupPrice > 0 && !isNaN(item.goodsGroupPrice)) goodsPrice = item.goodsGroupPrice
          break
      }
      console.log('filterProfitMargin: ', goodsPrice)
      let cost = 0
      if (this.formData.isLevelOneConsumption) cost += this.filterValueExist(this.formData.levelOneConsumption)
      if (this.formData.isLevelOneCurrency) cost += this.filterValueExist(this.formData.levelOneCurrency)
      if (this.formData.isLevelOneBalance) cost += this.filterValueExist(this.formData.levelOneBalance, true)
      // 暂时不参与成本核算
      // if (this.formData.isGoldCoin) cost += this.filterValueExist(this.formData.goldCoin)
      let res = (goodsPrice - (item.buyingPrice + cost)) / goodsPrice * 100
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
      // return value && value.toString().match(/^[1-9]{1}\d{0,19}$/gi) ? (type ? parseFloat(value) * 0.15 : parseFloat(value)) : 0
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
          row.goodsBonusPoints = parseFloat(row.goodsBonusPoints) || 0
          row.goodsLeaguePoints = parseFloat(row.goodsLeaguePoints) || 0
          row.goodsGoldBeanPrice = parseFloat(row.goodsGoldBeanPrice) || 0
          // if (parseInt(row.disStatus) === 1) {
          //   row.whetherShare = row.goodsSharePrice ? 1 : 0
          //   row.whetherGoldBeanPrice = row.goodsGoldBeanPrice ? 1 : 0
          //   row.whetherGoldBeanNum = row.goodsGoldBeanNum ? 1 : 0
          // } else {
          //   row.whetherShare = row.whetherShare ? 1 : 0
          //   row.whetherGoldBeanPrice = row.whetherGoldBeanPrice ? 1 : 0
          //   row.whetherGoldBeanNum = row.whetherGoldBeanNum ? 1 : 0
          // }
        })
        this.submitLoading = true
        this.$http.post('@ROOT_API/shareTheme/themeGoodSettingEdit', {
          id: parseInt(this.formData.id),           // 是 int 关联分享商品数据主键
          skuId: parseInt(this.defaultSkuId),
          goodsId: parseInt(this.formData.goodsId), // 是 int 商品主键
          activityImage: this.formData.activeImg,   // 是 string  商品活动图片
          activityRemark: this.formData.remark,     // 是 string  商品活动说明
          oneIfGetBonusPoints: this.formData.isLevelOneConsumption ? 1 : 0,    // 否 int 一级邀请人能否获得消费积分（0：否，1：是）
          oneGetBonusPoints: this.formData.levelOneConsumption,                // 否 int 一级邀请人获得消费积分数
          oneIfGetCashPoints: this.formData.isLevelOneCurrency ? 1 : 0,        // 否 int 一级邀请人能否获得通用积分（0：否，1：是）
          oneGetCashPoints: this.formData.levelOneCurrency,                    // 否 int 一级邀请人获得通用积分数
          oneIfGetBalance: this.formData.isLevelOneBalance ? 1 : 0,            // 否 int 一级邀请人能否获得余额（0：否，1：是）
          oneGetBalance: parseFloat(this.formData.levelOneBalance),            // 否 double  一级邀请人获得余额数
          beInviterIfGetGoldPoints: this.formData.isGoldCoin ? 1 : 0,          // 否 int 被邀请人能否获得芯豆（0：否，1：是）
          beInviterGetGoldPoints: this.formData.goldCoin,
          skuUpdateList: skuUpdateList,                                        // 是 list  商品sku对象集合
          themeType: this.exchangeType,                                        // 是 主题类型
          groupNum: parseFloat(this.formData.groupNum),                        // 否 int 拼团人数
          groupTime: parseFloat(this.formData.groupTime),                      // 否 int 拼团时间（小时）
          ifAutoGroup: this.formData.ifAutoGroup,                              // 否 int 自动组团（0：关闭，1：开启）
          surplusTime: parseFloat(this.formData.surplusTime)                   // 否 int 剩余多少时间（分钟）自动拼团完成
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
