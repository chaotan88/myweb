<!-- 会员账户表 -->
<template>
  <common-tpl class="vip-account-wrap" :footer="false">
    <!-- 统计 -->
    <template slot="header">
      <div class="statistics-cen">
        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-huiyuanzongshu" aria-hidden="true">
              <use xlink:href="#icon-huiyuanzongshu"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>
              <span>{{statisticsData.memberCount | filterEmpty}}</span>
            </h3>
            <h4>会员总数</h4>
          </dd>
        </dl>

        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-jinrixinzengdingdanjine" aria-hidden="true">
              <use xlink:href="#icon-jinrixinzengdingdanjine"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>
              <template v-if="formData.accountType === 'balance'">
                <span>{{statisticsData.balanceTotal | filterEmpty}}</span>
              </template>
              <template v-if="formData.accountType === 'bonus'">
                <span>{{statisticsData.bonusPointsTotal | filterEmpty}}</span>
              </template>
              <template v-if="formData.accountType === 'cash'">
                <span>{{statisticsData.cashPointsTotal | filterEmpty}}</span>
              </template>
            </h3>
            <template v-if="formData.accountType === 'balance'">
              <h4>累计余额总额</h4>
            </template>
            <template v-if="formData.accountType === 'bonus'">
              <h4>累计消费积分</h4>
            </template>
            <template v-if="formData.accountType === 'cash'">
              <h4>累计通用积分</h4>
            </template>
          </dd>
        </dl>

        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-dingdanzongjine" aria-hidden="true">
              <use xlink:href="#icon-dingdanzongjine"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>
              <template v-if="formData.accountType === 'balance'">
                <span>{{statisticsData.balanceBuy | filterEmpty}}</span>
              </template>
              <template v-if="formData.accountType === 'bonus'">
                <span>{{statisticsData.bonusPointsConvertGoods | filterEmpty}}</span>
              </template>
              <template v-if="formData.accountType === 'cash'">
                <span>{{statisticsData.hasWithdrawal | filterEmpty}}</span>
              </template>
            </h3>
            <template v-if="formData.accountType === 'balance'">
              <h4>余额购物额</h4>
            </template>
            <template v-if="formData.accountType === 'bonus'">
              <h4>消费积分兑换商品总数</h4>
            </template>
            <template v-if="formData.accountType === 'cash'">
              <h4>已提现通用积分总数</h4>
            </template>
          </dd>
        </dl>

        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-dingdanzongjine" aria-hidden="true">
              <use xlink:href="#icon-dingdanzongjine"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>
              <template v-if="formData.accountType === 'balance'">
                <span>{{statisticsData.balanceRevise | filterEmpty}}</span>
              </template>
              <template v-if="formData.accountType === 'bonus'">
                <span>{{statisticsData.bonusPointsConvertGoods | filterEmpty}}</span>
              </template>
              <template v-if="formData.accountType === 'cash'">
                <span>{{statisticsData.cashPointsConvertBctc | filterEmpty}}</span>
              </template>
            </h3>
            <template v-if="formData.accountType === 'balance'">
              <h4>对账调整</h4>
            </template>
            <template v-if="formData.accountType === 'bonus'">
              <h4>消费积分兑换通证总数</h4>
            </template>
            <template v-if="formData.accountType === 'cash'">
              <h4>通用积分兑换通证总数</h4>
            </template>
          </dd>
        </dl>

        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-yueshengyuzonge" aria-hidden="true">
              <use xlink:href="#icon-yueshengyuzonge"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>
              <template v-if="formData.accountType === 'balance'">
                <span>{{statisticsData.sumBalance | filterEmpty}}</span>
              </template>
              <template v-if="formData.accountType === 'bonus'">
                <span>{{statisticsData.bonusPointsRevise | filterEmpty}}</span>
              </template>
              <template v-if="formData.accountType === 'cash'">
                <span>{{statisticsData.cashPointsRevise | filterEmpty}}</span>
              </template>
              <!-- <template v-else>{{'' | filterEmpty}}</template> -->
            </h3>
            <template v-if="formData.accountType === 'balance'">
              <h4>余额剩余总额</h4>
            </template>
            <template v-if="formData.accountType === 'bonus'">
              <h4>对账调整</h4>
            </template>
            <template v-if="formData.accountType === 'cash'">
              <h4>对账调整</h4>
            </template>
          </dd>
        </dl>

        <template v-if="formData.accountType === 'bonus' || formData.accountType === 'cash'">
          <dl class="ta-c fl-l">
            <dt class="d-ib va-m">
              <svg class="icon icon-yueshengyuzonge" aria-hidden="true">
                <use xlink:href="#icon-yueshengyuzonge"></use>
              </svg>
            </dt>
            <dd class="d-ib va-m ta-l">
              <h3>
                <template v-if="formData.accountType === 'bonus'">
                  <span>{{statisticsData.sumBonusPoints | filterEmpty}}</span>
                </template>
                <template v-if="formData.accountType === 'cash'">
                  <span>{{statisticsData.sumCashPoints | filterEmpty}}</span>
                </template>
              </h3>
              <template v-if="formData.accountType === 'bonus'">
                <h4>消费积分剩余总数</h4>
              </template>
              <template v-if="formData.accountType === 'cash'">
                <h4>通用积分剩余总数</h4>
              </template>
            </dd>
          </dl>
        </template>
      </div>

      <high-search :textVisible="false">
        <div slot="search">
          <el-select placeholder="请选择账户" v-model="formData.accountType" @change="accountChange">
            <el-option label="余额账户" value="balance"></el-option>
            <el-option label="消费积分账户" value="bonus"></el-option>
            <el-option label="通用积分账户" value="cash"></el-option>
          </el-select>
        </div>

        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>
    </template>

    <!-- 表单 -->
    <div slot="main" class="pos-r">
      <el-dropdown class="pos-a ranking-screen-data">
        <span class="el-dropdown-link">
          <svg class="icon icon-fenlei sort-btn" aria-hidden="true">
            <use xlink:href="#icon-fenlei"></use>
          </svg>
        <!-- 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> -->
        </span>
        <el-dropdown-menu slot="dropdown" class="report-ranking-dropdown-menu">
          <div class="dropdown-ranking-wrap">
            <div class="item">
              <el-checkbox v-model="allSelection" @change="screeningAllChange">
                <h4 style="color: #333;font-size: 16px; height:35px; font-weight: normal;">选择显示的字段</h4>
              </el-checkbox>
              <i class="nnderline"></i>
            </div>
            <el-checkbox-group v-model="formData.checkList">
              <div class="item">
                <div class="content ranking-screen-data-ash">
                  <el-checkbox label="vipLevel" checked disabled>会员等级</el-checkbox>
                </div>
                <div class="content ranking-screen-data-ash">
                  <el-checkbox label="vipNum" checked disabled>会员数量</el-checkbox>
                </div>
                <i class="nnderline"></i>
              </div>

              <div class="item">
                <h4 class="title">{{tips[formData.accountType].title}}</h4>
                <div class="content ranking-screen-data-ash" v-for="item in sevenDays[formData.accountType]" v-if="item.default">
                  <el-checkbox :label="defaultChecked" checked disabled>{{item.value}}</el-checkbox>
                </div>
              </div>

              <i class="nnderline"></i>
              <div class="item">
                <h4 class="title" >近七天</h4>
                <div class="content" v-for="item in sevenDays[formData.accountType]">
                  <el-checkbox :label="item.key" :checked="item.default">{{item.value}}</el-checkbox>
                </div>
              </div>
              <div class="item">
                <h4 class="title">近30天</h4>
                <div class="content" v-for="item in thirtyDays[formData.accountType]">
                  <el-checkbox :label="item.key" :checked="item.default">{{item.value}}</el-checkbox>
                </div>
              </div>
              <div class="item">
                <h4 class="title">近90天</h4>
                <div class="content" v-for="item in ninetyDays[formData.accountType]">
                  <el-checkbox :label="item.key" :checked="item.default">{{item.value}}</el-checkbox>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="table-wrap">
        <!-- v-loading="loading" -->
        <el-table :data="tableData" style="width: 100%" element-loading-text="加载中" v-loading="loading">
          <el-table-column prop="" label="会员等级" min-width="130">
            <template slot-scope="scope">
              <template v-if="!scope.row.disRuleId">总计</template>
              <template v-else>{{scope.row.disRuleName | filterEmpty}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="" label="会员总数" min-width="130">
            <template slot-scope="scope">{{scope.row.memberTotal | filterMoney | filterEmpty}}</template>
          </el-table-column>

          <!-- 余额(元) -->
          <el-table-column prop="" :label="tips[formData.accountType].title">

            <!-- 余额账户 -->
            <template v-if="formData.accountType === 'balance'">
              <el-table-column prop="" label="累计余额总额" min-width="150">
                <template slot-scope="scope">{{scope.row.balanceTotal | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="余额购物总额" min-width="150">
                <template slot-scope="scope">{{scope.row.balanceBuy | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="150">
                <template slot-scope="scope">{{scope.row.balanceRevise | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="余额剩余总额" min-width="150">
                <template slot-scope="scope">{{scope.row.sumBalance | filterMoney | filterEmpty}}</template>
              </el-table-column>
            </template>

            <!-- 消费积分账户 -->
            <template v-if="formData.accountType === 'bonus'">
              <el-table-column prop="" label="累计消费积分" min-width="180">
                <template slot-scope="scope">{{scope.row.bonusPointsTotal | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分兑换商品总数" min-width="200">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertGoods | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分兑换通证总数" min-width="180">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertBctc | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="150">
                <template slot-scope="scope">{{scope.row.bonusPointsRevise | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分剩余总额" min-width="180">
                <template slot-scope="scope">{{scope.row.sumBonusPoints | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费赠送消费积分" min-width="180">
                <template slot-scope="scope">{{scope.row.bonusPointsSend | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="分佣获得消费积分" min-width="180">
                <template slot-scope="scope">{{scope.row.bonusPointsCommission | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="分享获得消费积分" min-width="180">
                <template slot-scope="scope">{{scope.row.bonusPointsShare | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="其他" min-width="180">
                <template slot-scope="scope">{{scope.row.other | filterMoney | filterEmpty}}</template>
              </el-table-column>
            </template>

            <!-- 通用积分账户 -->
            <template v-if="formData.accountType === 'cash'">
              <el-table-column prop="" label="累计通用积分" min-width="150">
                <template slot-scope="scope">{{scope.row.cashPointsTotal | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="已提现通用积分" min-width="150">
                <template slot-scope="scope">{{scope.row.hasWithdrawal | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分兑换通证总数" min-width="200">
                <template slot-scope="scope">{{scope.row.cashPointsConvertBctc | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="150">
                <template slot-scope="scope">{{scope.row.cashPointsRevise | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分剩余总额" min-width="150">
                <template slot-scope="scope">{{scope.row.sumCashPoints | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分兑换商品总数" min-width="200">
                <template slot-scope="scope">{{scope.row.cashPointsConvertGoods | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="分享获得通用积分" min-width="150">
                <template slot-scope="scope">{{scope.row.cashPointsShare | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="分佣获得通用积分" min-width="150">
                <template slot-scope="scope">{{scope.row.cashPointsCommission | filterMoney | filterEmpty}}</template>
              </el-table-column>
            </template>
          </el-table-column>

          <!-- 近七天 -->
          <el-table-column prop="" label="近七天" v-if="filterFieldVisible(['totalBalance7', 'totalBalance7Ratio', 'totalShopping7', 'totalShopping7Ratio', 'surplusBalance7', 'surplusBalance7Ratio', 'consume7', 'consumeRatio', 'consumeGoods7', 'consumeGoodsRatio', 'consumeThrough7', 'consumeThrough7Ratio', 'consumeSurplus7', 'consumeSurplus7Ratio', 'consumeGive7', 'consumeGive7Ratio', 'consumeMaid7', 'consumeMaid7Ratio', 'consumeShare7', 'consumeShare7Ratio', 'consumeOther7', 'consumeOther7Ratio', 'currency7', 'currency7Ratio', 'currencyPresented7', 'currencyPresented7Ratio', 'currencyThrough7', 'currencyThrough7Ratio', 'currencySurplus7', 'currencySurplus7sRatio', 'currencyCommodity7', 'currencyCommodity7Ratio', 'currencyShare7', 'currencyShare7Ratio', 'currencyMaid7', 'totalReconciliation7', 'totalReconciliation7Ratio', 'totalSurplusBalance7', 'totalSurplusBalance7Ratio', 'consumeReconciliation7', 'consumeReconciliationRatio', 'currencyMaid7Ratio', 'currencyReconciliation7', 'currencyReconciliation7Ratio'])">

            <!-- 余额账户 -->
            <template v-if="formData.accountType === 'balance'">
              <el-table-column prop="" label="累计余额总额" min-width="150" v-if="filterFieldVisible('totalBalance7')">
                <template slot-scope="scope">{{scope.row.balanceTotalSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('totalBalance7Ratio')">
                <template slot-scope="scope">{{scope.row.balanceTotalRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="余额购物总额" min-width="150" v-if="filterFieldVisible('totalSurplusBalance7')">
                <template slot-scope="scope">{{scope.row.balanceBuySeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('totalSurplusBalance7Ratio')">
                <template slot-scope="scope">{{scope.row.balanceBuyRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="150" v-if="filterFieldVisible('totalReconciliation7')">
                <template slot-scope="scope">{{scope.row.balanceReviseSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
               <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('totalReconciliation7Ratio')">
                <template slot-scope="scope">{{scope.row.balanceReviseRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="余额剩余总额" min-width="150" v-if="filterFieldVisible('totalShopping7')">
                <template slot-scope="scope">{{scope.row.sumBalanceSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
               <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('totalShopping7Ratio')">
                <template slot-scope="scope">{{scope.row.sumBalanceRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
            </template>

            <!-- 消费积分账户 -->
            <template v-if="formData.accountType === 'bonus'">
              <el-table-column prop="" label="累计消费积分" min-width="180" v-if="filterFieldVisible('consume7')">
                <template slot-scope="scope">{{scope.row.bonusPointsTotalSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeRatio')">
                <template slot-scope="scope">{{scope.row.bonusPointsTotalRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分兑换商品总数" min-width="200" v-if="filterFieldVisible('consumeGoods7')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertGoodsSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeGoodsRatio')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertGoodsRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分兑换通证总数" min-width="200" v-if="filterFieldVisible('consumeThrough7')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertBctcSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeThrough7Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertBctcRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="180" v-if="filterFieldVisible('consumeReconciliation7')">
                <template slot-scope="scope">{{scope.row.bonusPointsReviseSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeReconciliationRatio')">
                <template slot-scope="scope">{{scope.row.bonusPointsReviseRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分剩余总额" min-width="180" v-if="filterFieldVisible('consumeSurplus7')">
                <template slot-scope="scope">{{scope.row.sumBonusPointsSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeSurplus7Ratio')">
                <template slot-scope="scope">{{scope.row.sumBonusPointsRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费赠送消费积分" min-width="180" v-if="filterFieldVisible('consumeGive7')">
                <template slot-scope="scope">{{scope.row.bonusPointsSendSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeGive7Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsSendRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分佣获得消费积分" min-width="180" v-if="filterFieldVisible('consumeMaid7')">
                <template slot-scope="scope">{{scope.row.bonusPointsCommissionSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeMaid7Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsCommissionRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分享获得消费积分" min-width="180" v-if="filterFieldVisible('consumeShare7')">
                <template slot-scope="scope">{{scope.row.bonusPointsShareSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeShare7Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsShareRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="其他" min-width="180" v-if="filterFieldVisible('consumeOther7')">
                <template slot-scope="scope">{{scope.row.otherSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeOther7Ratio')">
                <template slot-scope="scope">{{scope.row.otherRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
            </template>

            <!-- 通用积分账户 -->
            <template v-if="formData.accountType === 'cash'">
              <el-table-column prop="" label="累计通用积分" min-width="150" v-if="filterFieldVisible('currency7')">
                <template slot-scope="scope">{{scope.row.cashPointsTotalSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currency7Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsTotalRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="已提现通用积分" min-width="150" v-if="filterFieldVisible('currencyPresented7')">
                <template slot-scope="scope">{{scope.row.hasWithdrawalSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyPresented7Ratio')">
                <template slot-scope="scope">{{scope.row.hasWithdrawalRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分兑换通证总数" min-width="200" v-if="filterFieldVisible('currencyThrough7')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertBctcSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyThrough7Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertBctcRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="150" v-if="filterFieldVisible('currencyReconciliation7')">
                <template slot-scope="scope">{{scope.row.cashPointsReviseSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyReconciliation7Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsReviseRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分剩余总额" min-width="200" v-if="filterFieldVisible('currencySurplus7')">
                <template slot-scope="scope">{{scope.row.sumCashPointsSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencySurplus7sRatio')">
                <template slot-scope="scope">{{scope.row.sumCashPointsRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分兑换商品总数" min-width="200" v-if="filterFieldVisible('currencyCommodity7')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertGoodsSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyCommodity7Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertGoodsRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分享获得通用积分" min-width="150" v-if="filterFieldVisible('currencyShare7')">
                <template slot-scope="scope">{{scope.row.cashPointsShareSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyShare7Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsShareRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分佣获得通用积分" min-width="150" v-if="filterFieldVisible('currencyMaid7')">
                <template slot-scope="scope">{{scope.row.cashPointsCommissionSeven | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyMaid7Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsCommissionRingRateSeven | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
            </template>
          </el-table-column>

          <!-- 近30天 -->
          <el-table-column prop="" label="近30天" v-if="filterFieldVisible(['totalBalance30', 'totalBalance30Ratio', 'totalShopping30', 'totalShopping30Ratio', 'surplusBalance30', 'surplusBalance30Ratio', 'consume30', 'consumeRatio', 'consumeGoods30', 'consumeGoodsRatio', 'consumeThrough30', 'consumeThrough30Ratio', 'consumeSurplus30', 'consumeSurplus30Ratio', 'consumeGive30', 'consumeGive30Ratio', 'consumeMaid30', 'consumeMaid30Ratio', 'consumeShare30', 'consumeShare30Ratio', 'consumeOther30', 'consumeOther30Ratio', 'currency30', 'currency30Ratio', 'currencyPresented30', 'currencyPresented30Ratio', 'currencyThrough30', 'currencyThrough30Ratio', 'currencySurplus30', 'currencySurplus30sRatio', 'currencyCommodity30', 'currencyCommodity30Ratio', 'currencyShare30', 'currencyShare30Ratio', 'currencyMaid30', 'currencyMaid30Ratio', 'totalReconciliation30', 'totalReconciliation30Ratio', 'consumeReconciliation30', 'consumeReconciliation30Ratio', 'currencyReconciliation30', 'currencyReconciliation30Ratio'])">
           <!-- 余额账户 -->
            <template v-if="formData.accountType === 'balance'">
              <el-table-column prop="" label="累计余额总额" min-width="150" v-if="filterFieldVisible('totalBalance30')">
                <template slot-scope="scope">{{scope.row.balanceTotalThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('totalBalance30Ratio')">
                <template slot-scope="scope">{{scope.row.balanceTotalRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="余额购物总额" min-width="150" v-if="filterFieldVisible('surplusBalance30')">
                <template slot-scope="scope">{{scope.row.balanceBuyThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('surplusBalance30Ratio')">
                <template slot-scope="scope">{{scope.row.balanceBuyRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="150" v-if="filterFieldVisible('totalReconciliation30')">
                <template slot-scope="scope">{{scope.row.balanceReviseThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
               <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('totalReconciliation30Ratio')">
                <template slot-scope="scope">{{scope.row.balanceReviseRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="余额剩余总额" min-width="150" v-if="filterFieldVisible('totalShopping30')">
                <template slot-scope="scope">{{scope.row.sumBalanceThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
               <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('totalShopping30Ratio')">
                <template slot-scope="scope">{{scope.row.sumBalanceRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
            </template>

            <!-- 消费积分账户 -->
            <template v-if="formData.accountType === 'bonus'">
              <el-table-column prop="" label="累计消费积分" min-width="180" v-if="filterFieldVisible('consume30')">
                <template slot-scope="scope">{{scope.row.bonusPointsTotalThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeRatio')">
                <template slot-scope="scope">{{scope.row.bonusPointsTotalRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分兑换商品总数" min-width="180" v-if="filterFieldVisible('consumeGoods30')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertGoodsThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeGoodsRatio')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertGoodsRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分兑换通证总数" min-width="200" v-if="filterFieldVisible('consumeThrough30')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertBctcThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeThrough30Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertBctcRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="180" v-if="filterFieldVisible('consumeReconciliation30')">
                <template slot-scope="scope">{{scope.row.bonusPointsReviseThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeReconciliation30Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsReviseRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分剩余总额" min-width="180" v-if="filterFieldVisible('consumeSurplus30')">
                <template slot-scope="scope">{{scope.row.sumBonusPointsThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeSurplus30Ratio')">
                <template slot-scope="scope">{{scope.row.sumBonusPointsRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费赠送消费积分" min-width="180" v-if="filterFieldVisible('consumeGive30')">
                <template slot-scope="scope">{{scope.row.bonusPointsSendThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeGive30Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsSendRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分佣获得消费积分" min-width="180" v-if="filterFieldVisible('consumeMaid30')">
                <template slot-scope="scope">{{scope.row.bonusPointsCommissionThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeMaid30Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsCommissionRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分享获得消费积分" min-width="180" v-if="filterFieldVisible('consumeShare30')">
                <template slot-scope="scope">{{scope.row.bonusPointsShareThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeShare30Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsShareRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="其他" min-width="180" v-if="filterFieldVisible('consumeOther30')">
                <template slot-scope="scope">{{scope.row.otherThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeOther30Ratio')">
                <template slot-scope="scope">{{scope.row.otherRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
            </template>

            <!-- 通用积分账户 -->
            <template v-if="formData.accountType === 'cash'">
              <el-table-column prop="" label="累计通用积分" min-width="150" v-if="filterFieldVisible('currency30')">
                <template slot-scope="scope">{{scope.row.cashPointsTotalThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currency30Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsTotalRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="已提现通用积分" min-width="150" v-if="filterFieldVisible('currencyPresented30')">
                <template slot-scope="scope">{{scope.row.hasWithdrawalThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyPresented30Ratio')">
                <template slot-scope="scope">{{scope.row.hasWithdrawalRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分兑换通证总数" min-width="200" v-if="filterFieldVisible('currencyThrough30')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertBctcThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyThrough30Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertBctcRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="150" v-if="filterFieldVisible('currencyReconciliation30')">
                <template slot-scope="scope">{{scope.row.cashPointsReviseThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyReconciliation30Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsReviseRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分剩余总额" min-width="200" v-if="filterFieldVisible('currencySurplus30')">
                <template slot-scope="scope">{{scope.row.sumCashPointsThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencySurplus30sRatio')">
                <template slot-scope="scope">{{scope.row.sumCashPointsRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分兑换商品总数" min-width="200" v-if="filterFieldVisible('currencyCommodity30')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertGoodsThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyCommodity30Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertGoodsRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分享获得通用积分" min-width="200" v-if="filterFieldVisible('currencyShare30')">
                <template slot-scope="scope">{{scope.row.cashPointsShareThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyShare30Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsShareRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分佣获得通用积分" min-width="200" v-if="filterFieldVisible('currencyMaid30')">
                <template slot-scope="scope">{{scope.row.cashPointsCommissionThirty | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyMaid30Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsCommissionRingRateThirty | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
            </template>
          </el-table-column>

          <!-- 近90天 -->
          <el-table-column prop="" label="近90天" v-if="filterFieldVisible(['totalBalance90', 'totalBalance90Ratio', 'totalShopping90', 'totalShopping90Ratio', 'surplusBalance90', 'surplusBalance90Ratio', 'consume90', 'consumeRatio', 'consumeGoods90', 'consumeGoodsRatio', 'consumeThrough90', 'consumeThrough90Ratio', 'consumeSurplus90', 'consumeSurplus90Ratio', 'consumeGive90', 'consumeGive90Ratio', 'consumeMaid90', 'consumeMaid90Ratio', 'consumeShare90', 'consumeShare90Ratio', 'consumeOther90', 'consumeOther90Ratio', 'currency90', 'currency90Ratio', 'currencyPresented90', 'currencyPresented90Ratio', 'currencyThrough90', 'currencyThrough90Ratio', 'currencySurplus90', 'currencySurplus90Ratio', 'currencyCommodity90', 'currencyCommodity90Ratio', 'currencyShare90', 'currencyShare90Ratio', 'currencyMaid90', 'currencyMaid90Ratio', 'totalReconciliation90', 'totalReconciliation90Ratio', 'consumeReconciliation90', 'consumeReconciliation90Ratio', 'currencyReconciliation90', 'currencyReconciliation90Ratio'])">
            <!-- 余额账户 -->
            <template v-if="formData.accountType === 'balance'">
              <el-table-column prop="" label="累计余额总额" min-width="150" v-if="filterFieldVisible('totalBalance90')">
                <template slot-scope="scope">{{scope.row.balanceTotalNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('totalBalance90Ratio')">
                <template slot-scope="scope">{{scope.row.balanceTotalRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="余额购物总额" min-width="150" v-if="filterFieldVisible('surplusBalance90')">
                <template slot-scope="scope">{{scope.row.balanceBuyNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('surplusBalance90Ratio')">
                <template slot-scope="scope">{{scope.row.balanceBuyRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="150" v-if="filterFieldVisible('totalReconciliation90')">
                <template slot-scope="scope">{{scope.row.balanceReviseNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
               <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('totalReconciliation90Ratio')">
                <template slot-scope="scope">{{scope.row.balanceReviseRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="余额剩余总额" min-width="150" v-if="filterFieldVisible('totalShopping90')">
                <template slot-scope="scope">{{scope.row.sumBalanceNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
               <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('totalShopping90Ratio')">
                <template slot-scope="scope">{{scope.row.sumBalanceRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
            </template>

            <!-- 消费积分账户 -->
            <template v-if="formData.accountType === 'bonus'">
              <el-table-column prop="" label="累计消费积分" min-width="180" v-if="filterFieldVisible('consume90')">
                <template slot-scope="scope">{{scope.row.bonusPointsTotalNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeRatio')">
                <template slot-scope="scope">{{scope.row.bonusPointsTotalRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分兑换商品总数" min-width="200" v-if="filterFieldVisible('consumeGoods90')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertGoodsNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeGoodsRatio')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertGoodsRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分兑换通证总数" min-width="200" v-if="filterFieldVisible('consumeThrough90')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertBctcNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeThrough90Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsConvertBctcRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="180" v-if="filterFieldVisible('consumeReconciliation90')">
                <template slot-scope="scope">{{scope.row.bonusPointsReviseNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeReconciliation90Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsReviseRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费积分剩余总额" min-width="200" v-if="filterFieldVisible('consumeSurplus90')">
                <template slot-scope="scope">{{scope.row.sumBonusPointsNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeSurplus90Ratio')">
                <template slot-scope="scope">{{scope.row.sumBonusPointsRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="消费赠送消费积分" min-width="200" v-if="filterFieldVisible('consumeGive90')">
                <template slot-scope="scope">{{scope.row.bonusPointsSendNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeGive90Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsSendRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分佣获得消费积分" min-width="200" v-if="filterFieldVisible('consumeMaid90')">
                <template slot-scope="scope">{{scope.row.bonusPointsCommissionNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeMaid90Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsCommissionRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分享获得消费积分" min-width="200" v-if="filterFieldVisible('consumeShare90')">
                <template slot-scope="scope">{{scope.row.bonusPointsShareNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeShare90Ratio')">
                <template slot-scope="scope">{{scope.row.bonusPointsShareRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="其他" min-width="180" v-if="filterFieldVisible('consumeOther90')">
                <template slot-scope="scope">{{scope.row.otherNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="180" v-if="filterFieldVisible('consumeOther90Ratio')">
                <template slot-scope="scope">{{scope.row.otherRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
            </template>

            <!-- 通用积分账户 -->
            <template v-if="formData.accountType === 'cash'">
              <el-table-column prop="" label="累计通用积分" min-width="150" v-if="filterFieldVisible('currency90')">
                <template slot-scope="scope">{{scope.row.cashPointsTotalNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currency90Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsTotalRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="已提现通用积分" min-width="150" v-if="filterFieldVisible('currencyPresented90')">
                <template slot-scope="scope">{{scope.row.hasWithdrawalNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyPresented90Ratio')">
                <template slot-scope="scope">{{scope.row.hasWithdrawalRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分兑换通证总数" min-width="200" v-if="filterFieldVisible('currencyThrough90')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertBctcNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyThrough90Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertBctcRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="对账调整" min-width="150" v-if="filterFieldVisible('currencyReconciliation90')">
                <template slot-scope="scope">{{scope.row.cashPointsReviseNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyReconciliation90Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsReviseRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分剩余总额" min-width="200" v-if="filterFieldVisible('currencySurplus90')">
                <template slot-scope="scope">{{scope.row.sumCashPointsNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencySurplus90Ratio')">
                <template slot-scope="scope">{{scope.row.sumCashPointsRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="通用积分兑换商品总数" min-width="200" v-if="filterFieldVisible('currencyCommodity90')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertGoodsNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyCommodity90Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsConvertGoodsRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分享获得通用积分" min-width="200" v-if="filterFieldVisible('currencyShare90')">
                <template slot-scope="scope">{{scope.row.cashPointsShareNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyShare90Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsShareRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
              <el-table-column prop="" label="分佣获得通用积分" min-width="200" v-if="filterFieldVisible('currencyMaid90')">
                <template slot-scope="scope">{{scope.row.cashPointsCommissionNinety | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="环比" min-width="150" v-if="filterFieldVisible('currencyMaid90Ratio')">
                <template slot-scope="scope">{{scope.row.cashPointsCommissionRingRateNinety | filterMoney | filterEmpty('%')}}</template>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="50"></el-table-column>

          <!-- 暂无数据 -->
          <template slot="empty">
            <no-data></no-data>
          </template>
        </el-table>
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
    </div>
  </common-tpl>
</template>

<script>
// import BalanceData from './data/balance'
// import BonusData from './data/bonus'
// import CashData from './data/cash'

export default{
  data () {
    return {
      formData: {
        accountType: 'balance',   // 账户类型
        checkList: []     // 过滤table字段显示
      },
      tips: {
        balance: {
          title: '余额'
        },
        bonus: {
          title: '消费积分'
        },
        cash: {
          title: '通用积分'
        }
      },
      tableData: [],
      allSelection: false,    // 全选
      defaultChecked: true,
      statisticsData: {},
      vipStatisticsData: {},
      userInfo: {},           // 用户数据
      loading: false,
      pageData: {                     // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },

      // 七天
      sevenDays: {
        // 余额账户
        balance: [
          { key: 'totalBalance7', value: '累计余额总额', default: true },
          { key: 'totalBalance7Ratio', value: '环比' },
          { key: 'totalShopping7', value: '余额购物总额', default: true },
          { key: 'totalShopping7Ratio', value: '环比' },
          { key: 'totalReconciliation7', value: '对账调整', default: true },
          { key: 'totalReconciliation7Ratio', value: '环比' },
          { key: 'totalSurplusBalance7', value: '累计余额总额', default: true },
          { key: 'totalSurplusBalance7Ratio', value: '环比' }
        ],

        // 消费积分账户
        bonus: [
          { key: 'consume7', value: '累计消费积分', default: true },
          { key: 'consumeRatio', value: '环比' },
          { key: 'consumeGoods7', value: '消费积分兑换商品总数', default: true },
          { key: 'consumeGoodsRatio', value: '环比' },
          { key: 'consumeThrough7', value: '消费积分兑换通证总数', default: true },
          { key: 'consumeThrough7Ratio', value: '环比' },
          { key: 'consumeReconciliation7', value: '对账调整', default: true },
          { key: 'consumeReconciliationRatio', value: '环比' },
          { key: 'consumeSurplus7', value: '消费积分剩余总额', default: true },
          { key: 'consumeSurplus7Ratio', value: '环比' },
          { key: 'consumeGive7', value: '消费赠送消费积分', default: true },
          { key: 'consumeGive7Ratio', value: '环比' },
          { key: 'consumeMaid7', value: '分佣获得消费积积分', default: true },
          { key: 'consumeMaid7Ratio', value: '环比' },
          { key: 'consumeShare7', value: '分享获得消费积分', default: true },
          { key: 'consumeShare7Ratio', value: '环比' },
          { key: 'consumeOther7', value: '其他', default: true },
          { key: 'consumeOther7Ratio', value: '环比' }
        ],

        // 通用积分账户
        cash: [
          { key: 'currency7', value: '累计通用积分', default: true },
          { key: 'currency7Ratio', value: '环比' },
          { key: 'currencyPresented7', value: '已提现通用积分', default: true },
          { key: 'currencyPresented7Ratio', value: '环比' },
          { key: 'currencyThrough7', value: '通用积分兑换通证总数', default: true },
          { key: 'currencyThrough7Ratio', value: '环比' },
          { key: 'currencyReconciliation7', value: '对账调整', default: true },
          { key: 'currencyReconciliation7Ratio', value: '环比' },
          { key: 'currencySurplus7', value: '通用积分剩余总额', default: true },
          { key: 'currencySurplus7sRatio', value: '环比' },
          { key: 'currencyCommodity7', value: '通用积分兑换商品总数', default: true },
          { key: 'currencyCommodity7Ratio', value: '环比' },
          { key: 'currencyShare7', value: '分享获得通用积分', default: true },
          { key: 'currencyShare7Ratio', value: '环比' },
          { key: 'currencyMaid7', value: '分佣获得通用积分', default: true },
          { key: 'currencyMaid7Ratio', value: '环比' }
        ]
      },

      // 30天
      thirtyDays: {
        // 余额账户
        balance: [
          { key: 'totalBalance30', value: '累计余额总额', default: true },
          { key: 'totalBalance30Ratio', value: '环比' },
          { key: 'totalShopping30', value: '余额购物总额', default: true },
          { key: 'totalShopping30Ratio', value: '环比' },
          { key: 'totalReconciliation30', value: '对账调整', default: true },
          { key: 'totalReconciliation30Ratio', value: '环比' },
          { key: 'surplusBalance30', value: '累计余额总额', default: true },
          { key: 'surplusBalance30Ratio', value: '环比' }
        ],

        // 消费积分账户
        bonus: [
          { key: 'consume30', value: '累计消费积分', default: true },
          { key: 'consumeRatio', value: '环比' },
          { key: 'consumeGoods30', value: '消费积分兑换商品总数', default: true },
          { key: 'consumeGoodsRatio', value: '环比' },
          { key: 'consumeThrough30', value: '消费积分兑换通证总数', default: true },
          { key: 'consumeThrough30Ratio', value: '环比' },
          { key: 'consumeReconciliation30', value: '对账调整', default: true },
          { key: 'consumeReconciliation30Ratio', value: '环比' },
          { key: 'consumeSurplus30', value: '消费积分剩余总额', default: true },
          { key: 'consumeSurplus30Ratio', value: '环比' },
          { key: 'consumeGive30', value: '消费赠送消费积分', default: true },
          { key: 'consumeGive30Ratio', value: '环比' },
          { key: 'consumeMaid30', value: '分佣获得消费积积分', default: true },
          { key: 'consumeMaid30Ratio', value: '环比' },
          { key: 'consumeShare30', value: '分享获得消费积分', default: true },
          { key: 'consumeShare30Ratio', value: '环比' },
          { key: 'consumeOther30', value: '其他', default: true },
          { key: 'consumeOther30Ratio', value: '环比' }
        ],

        // 通用积分账户
        cash: [
          { key: 'currency30', value: '累计通用积分', default: true },
          { key: 'currency30Ratio', value: '环比' },
          { key: 'currencyPresented30', value: '已提现通用积分', default: true },
          { key: 'currencyPresented30Ratio', value: '环比' },
          { key: 'currencyThrough30', value: '通用积分兑换通证总数', default: true },
          { key: 'currencyThrough30Ratio', value: '环比' },
          { key: 'currencyReconciliation30', value: '对账调整', default: true },
          { key: 'currencyReconciliation30Ratio', value: '环比' },
          { key: 'currencySurplus30', value: '通用积分剩余总额', default: true },
          { key: 'currencySurplus30sRatio', value: '环比' },
          { key: 'currencyCommodity30', value: '通用积分兑换商品总数', default: true },
          { key: 'currencyCommodity30Ratio', value: '环比' },
          { key: 'currencyShare30', value: '分享获得通用积分', default: true },
          { key: 'currencyShare30Ratio', value: '环比' },
          { key: 'currencyMaid30', value: '分佣获得通用积分', default: true },
          { key: 'currencyMaid30Ratio', value: '环比' }
        ]
      },

      // 90天
      ninetyDays: {
        // 余额账户
        balance: [
          { key: 'totalBalance90', value: '累计余额总额', default: true },
          { key: 'totalBalance90Ratio', value: '环比' },
          { key: 'totalShopping90', value: '余额购物总额', default: true },
          { key: 'totalShopping90Ratio', value: '环比' },
          { key: 'totalReconciliation90', value: '对账调整', default: true },
          { key: 'totalReconciliation90Ratio', value: '环比' },
          { key: 'surplusBalance90', value: '累计余额总额', default: true },
          { key: 'surplusBalance90Ratio', value: '环比' }
        ],

        // 消费积分账户
        bonus: [
          { key: 'consume90', value: '累计消费积分', default: true },
          { key: 'consumeRatio', value: '环比' },
          { key: 'consumeGoods90', value: '消费积分兑换商品总数', default: true },
          { key: 'consumeGoodsRatio', value: '环比' },
          { key: 'consumeThrough90', value: '消费积分兑换通证总数', default: true },
          { key: 'consumeThrough90Ratio', value: '环比' },
          { key: 'consumeReconciliation90', value: '对账调整', default: true },
          { key: 'consumeReconciliation90Ratio', value: '环比' },
          { key: 'consumeSurplus90', value: '消费积分剩余总额', default: true },
          { key: 'consumeSurplus90Ratio', value: '环比' },
          { key: 'consumeGive90', value: '消费赠送消费积分', default: true },
          { key: 'consumeGive90Ratio', value: '环比' },
          { key: 'consumeMaid90', value: '分佣获得消费积积分', default: true },
          { key: 'consumeMaid90Ratio', value: '环比' },
          { key: 'consumeShare90', value: '分享获得消费积分', default: true },
          { key: 'consumeShare90Ratio', value: '环比' },
          { key: 'consumeOther90', value: '其他', default: true },
          { key: 'consumeOther90Ratio', value: '环比' }
        ],

        // 通用积分账户
        cash: [
          { key: 'currency90', value: '累计通用积分', default: true },
          { key: 'currency90Ratio', value: '环比' },
          { key: 'currencyPresented90', value: '已提现通用积分', default: true },
          { key: 'currencyPresented90Ratio', value: '环比' },
          { key: 'currencyThrough90', value: '通用积分兑换通证总数', default: true },
          { key: 'currencyThrough90Ratio', value: '环比' },
          { key: 'currencyReconciliation90', value: '对帐调整', default: true },
          { key: 'currencyReconciliation90Ratio', value: '环比' },
          { key: 'currencySurplus90', value: '通用积分剩余总额', default: true },
          { key: 'currencySurplus90Ratio', value: '环比' },
          { key: 'currencyCommodity90', value: '通用积分兑换商品总数', default: true },
          { key: 'currencyCommodity90Ratio', value: '环比' },
          { key: 'currencyShare90', value: '分享获得通用积分', default: true },
          { key: 'currencyShare90Ratio', value: '环比' },
          { key: 'currencyMaid90', value: '分佣获得通用积分', default: true },
          { key: 'currencyMaid90Ratio', value: '环比' }
        ]
      },

      checkListArr: [

        // 余额账户
        { key: 'id', value: '会员ID号', default: true },
        { key: 'vipLevel', value: '会员等级', default: true },
        { key: 'vipNum', value: '会员总数', default: true },
        { key: 'totalBalance', value: '累计余额总额' },
        { key: 'totalShopping', value: '余额购物总额' },
        { key: 'surplusBalance', value: '累计余额总额' },

        // 消费积分账户
        { key: 'balance', value: '累计消费积分', default: true },
        { key: 'balanceGoods', value: '消费积分兑换商品总数', default: true },
        { key: 'balanceThrough', value: '消费积分兑换通证总数', default: true },
        { key: 'balanceSurplus', value: '消费积分剩余总额', default: true },
        { key: 'balanceGive', value: '消费赠送消费积分', default: true },
        { key: 'balanceMaid', value: '分佣获得消费积积分', default: true },
        { key: 'balanceShare', value: '分享获得消费积分', default: true },
        { key: 'balanceOther', value: '其他', default: true },

        // 通用积分账户
        { key: 'balanceCurrency', value: '累计通用积分', default: true },
        { key: 'balanceCurrencyPresented', value: '已提现通用积分', default: true },
        { key: 'balanceCurrencyThrough', value: '通用积分兑换通证总数', default: true },
        { key: 'balanceCurrencySurplus', value: '通用积分剩余总额', default: true },
        { key: 'balanceCurrencyCommodity', value: '通用积分兑换商品总数', default: true },
        { key: 'balanceCurrencyShare', value: '分享获得通用积分', default: true },
        { key: 'balanceCurrencyMaid', value: '分佣获得通用积分', default: true }
      ]
    }
  },

  mounted () {
    // 判断是否同一模块，带出搜索记录
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.$Utils.filterSearchData('/admin/report/vip/account', (res) => {
      this.formData = res
    })
    this.getStatisticsData()
    this.getListData()
    this.selectDefaultekey()
  },

  methods: {
    /**
     * 过滤table字段显示
     * @param  {[String || Array]} key [对应需要过滤的字段]
     */
    filterFieldVisible (key) {
      if (!key) return ''
      let res = false
      if (Array.isArray(key)) {
        key.forEach((item) => {
          // if (this.formData.checkList === true) console.log('this.formData.checkList: ', this.formData.checkList.length, item)
          if (this.formData.checkList.length && this.formData.checkList.indexOf(item) !== -1) res = true
        })
      } else {
        if (this.formData.checkList.indexOf(key) !== -1) res = true
      }
      return res
    },

    /**
     * 获取统计数据
     */
    getStatisticsData () {
      this.$http.post('@ROOT_API/memberManageController/getMemberStatisticsData', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.statisticsData = resData.data
      })
    },

    /**
     * 获取列表数据
     */
    // getListData (type) {
    //   let url = 'ROOT_API/memberManageController/getMemberData'
    //   if (!type) {
    //     url = '@ROOT_API/memberManageController/getMemberData'
    //     this.loading = true
    //   } else if (this.formData.accountType === 'balance') {
    //     url = 'memberManageController/exportMemberBalanceDataList'
    //   } else if (this.formData.accountType === 'bonus') {
    //     url = 'memberManageController/exportMemberBonusPointsDataList'
    //   } if (this.formData.accountType === 'cash') {
    //     url = 'memberManageController/exportMemberCashPointsDataList'
    //   }
    //   let data = {
    //     flag: this.formData.accountType
    //   }
    //   if (!type) {
    //     this.$http.post(url, data).then((res) => {
    //       let resData = res.data
    //       if (parseInt(resData.status) !== 1) {
    //         this.$message({
    //           message: resData.msg,
    //           type: 'error',
    //           duration: 1500
    //         })
    //         this.tableData = []
    //         this.pageData.total = 0
    //         return false
    //       }
    //       let results = resData.data
    //       results.list.forEach((row) => {
    //         let region = []
    //         if (row.userProvince) region.push(row.userProvince)
    //         if (row.userCity) region.push(row.userCity)
    //         if (row.userZone) region.push(row.userZone)
    //         row.region = region.join(', ')
    //       })
    //       this.tableData = results.list
    //       this.pageData.total = results.total
    //     }).finally(() => {
    //       this.loading = false
    //     })
    //   } else {
    //     let filterParams = []
    //     for (let key in data) {
    //       filterParams.push(key + '=' + data[key])
    //     }
    //     window.open(this.$dm.ROOT_API + url + '?token=' + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
    //   }
    // },
    getListData (type) {
      this.tableData = []
      let url = ''
      if (!type) {
        url = '@ROOT_API/memberManageController/getMemberData'
        this.loading = true
      } else if (this.formData.accountType === 'balance') {
        url = 'memberManageController/exportMemberBalanceDataList'
      } else if (this.formData.accountType === 'bonus') {
        url = 'memberManageController/exportMemberBonusPointsDataList'
      } else if (this.formData.accountType === 'cash') {
        url = 'memberManageController/exportMemberCashPointsDataList'
      }
      if (!type) {
        this.$http.post(url, {
          flag: this.formData.accountType
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
          this.tableData = resData.data
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        // for (let key in data) {
        //   filterParams.push(key + '=' + data[key])
        // }
        window.open(this.$dm.ROOT_API + url + '?token=' + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
        this.$router.go(0)
      }
    },

    /**
     * 选择默认值
     */
    selectDefaultekey () {
      this.$nextTick(() => {
        this.formData.checkList = []
        this.formData.checkList = [true]
        this.checkListArr.forEach((row) => {
          if (row.default) this.formData.checkList.push(row.key)
        })
        this.sevenDays[this.formData.accountType].forEach((row) => {
          if (row.default) this.formData.checkList.push(row.key)
        })
        this.thirtyDays[this.formData.accountType].forEach((row) => {
          if (row.default) this.formData.checkList.push(row.key)
        })
        this.ninetyDays[this.formData.accountType].forEach((row) => {
          if (row.default) this.formData.checkList.push(row.key)
        })
      })
    },

    /**
     * 选择账户
     */
    accountChange () {
      this.allSelection = false
      this.selectDefaultekey()
      this.getListData()
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    screeningAllChange (value) {
      this.formData.checkList = [true]
      if (!value) {
        this.checkListArr.forEach((row) => {
          if (row.default) this.formData.checkList.push(row.key)
        })
        this.sevenDays[this.formData.accountType].forEach((row) => {
          if (row.default) this.formData.checkList.push(row.key)
        })
        this.thirtyDays[this.formData.accountType].forEach((row) => {
          if (row.default) this.formData.checkList.push(row.key)
        })
        this.ninetyDays[this.formData.accountType].forEach((row) => {
          if (row.default) this.formData.checkList.push(row.key)
        })
      } else {
        this.checkListArr.forEach((row) => {
          this.formData.checkList.push(row.key)
        })
        this.sevenDays[this.formData.accountType].forEach((row) => {
          this.formData.checkList.push(row.key)
        })
        this.thirtyDays[this.formData.accountType].forEach((row) => {
          this.formData.checkList.push(row.key)
        })
        this.ninetyDays[this.formData.accountType].forEach((row) => {
          this.formData.checkList.push(row.key)
        })
      }
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      if (this.pageData.currentPage === page) {
        this.getListData()
      } else {
        this.pageData.currentPage = page
        this.$router.push({query: {userId: this.userId, page: this.pageData.currentPage}})
      }
    }
  }
}
</script>
<style lang="less">
.vip-account-wrap{
  /*-------------统计----------*/
  .statistics-cen{
    display: flex;
    justify-content: space-between;

    dl{
      width: 25%;
      height: 140px;
      padding-top: 40px;
      margin-right: 20px;
      margin-bottom: 20px;
      background: #c2e0fe url(../../../assets/img/product-statistics-basic-bg.jpg);
      background-size: cover;
      border-radius: 5px;
      margin-right: 20px;
      box-sizing: border-box;

      dt, dd{
        height: 60px;
      }
      
      dt{
        width: 60px;
        height: 50px;
        line-height: 50px;
        margin-right: 5px;
        left: 0;

        .icon{
          fill: #fff;
          width: 100%;
          height: 100%;
        }
      }

      dd{
        top: 0;
        left: 0;
        color: #fff;

        h3{
          font-size: 30px;
          line-height: 35px;
        }

        h4{
          font-size: 16px;
        }
      }
    }

    /*dl:nth-child(2){
      background: #7c55ca;
    }

    dl:nth-child(3){
      background: #e46737;
    }*/

    dl:last-child{
      /*background: #f39817;*/
      margin-right: 0;
    }
  }

  /*------------表单-----------*/
  .table-wrap{}

  .ranking-screen-data{
    right: 12px;
    top: 35px;
    z-index: 20 !important;

    .sort-btn{
      width: 24px;
      height: 24px;
    }

    .icon{
      fill: #333;
    }

    .el-checkbox{
      padding: 5px 0;
    }
  }

  .ranking-screen-data:hover{
    .icon{
      fill: #2eaaf7;
    }
  }
}

.el-dropdown-menu{
  z-index: 100 !important;
}

.dropdown-ranking-wrap{
  max-height: 400px;
  padding: 0 20px;
  overflow-y: auto;

  .item{
    padding: 5px 0 !important;

    .title{
      color: #333;
      font-size: 14px;
      height: 35px;
      line-height: 35px;
      font-weight: normal;
    }

    .content{
      color: #6c6c6c;
      font-size: 12px;
      height:35px;
      line-height: 35px;
    }
  }

  .nnderline{
    display: inline-block;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #eee;
  }
}

.dropdown-ranking-wrap::-webkit-scrollbar{
  width: 6px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0);
}

.dropdown-ranking-wrap::-webkit-scrollbar-thumb{
  background: rgba(12, 39, 57, .3);
  border-radius: 10px;
}
</style>