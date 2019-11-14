<template>
  <div class="goodDetail">
    <!-- nfc信息 -->
    <div class="nfc-message" v-bind:class="showNfc ? 'nfc-message-show' : ''" @click="showNfc = false">
      <div class="nfc-message-img">
        <img src="../../assets/images/nfc.png" >
      </div>
      <div class="nfc-message-mes">
        <p>物联芯溯源防伪验证{{NfcMessage.verifyResult == true ? '通过 ' : NfcMessage.verifyResult == false ? '不通过' : '' }}</p>
        <p>云端动态验证码: {{NfcMessage.uid}}</p>
        <p>芯片已被: 验证{{NfcMessage.queryCount}}次</p>
        <!-- <p>芯片已被: 读取{{NfcMessage.readCount}}次/验证{{NfcMessage.queryCount}}次</p> -->
      </div>
    </div>

    <!-- headerbox -->
    <div class="detail-header-box" :class="showDetailHeader || showContainer === 2 ? 'transparent' : ''" id="detail-header-box">
      <!-- header -->
      <div class="detail-header" >
        <div class="detail-header-back" @click="$router.back()">
          <x-icon type="ios-arrow-left" size="20"></x-icon>
        </div>
        <div class="detail-header-blank" v-if="isWeiXin()"></div>
        <div class="detail-header-option">
          <ul>
            <li :class="headTabIndex == index ? 'active' : ''" @click="headTabChange(index, item.component)" v-for="(item, index) in headTabList">{{item.name}}</li>
          </ul>
        </div>
        <div class="detail-header-home" @click="$router.push('/')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhuye"></use>
          </svg>
        </div>
        <div class="detail-header-share" @click="showShareBg = true" v-if="isWeiXin()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-13"></use>
          </svg>
        </div>
      </div>

      <!-- 图文、参数 -->
      <div class="detail-paramer" v-if="showContainer === 1">
        <ul>
          <li :class="paramerTabIndex == index ? 'active' : ''" @click="paramerChange(index, item.component)" v-for="(item, index) in paramerTabList">{{item.name}}</li>
        </ul>
      </div>
    </div>
    <!-- 默认显示容器 -->
    <div v-show="showContainer === 1" class="baseInfo" id="baseInfo">
      <!-- 轮播图 -->
      <div class="swiper-wrap">
        <swiper :aspect-ratio="800/800" dots-position="center">
          <swiper-item class="swiper-demo-img" v-for="(item, index) in basicGoodsInfor.imageList" :key="index">
            <img :src="item.imageUrl | filterImgUrl">
          </swiper-item>
        </swiper>
        <div class="goodsDetailMask" v-if="nfcAdvData.isShow"><img :src="nfcAdvData.image | filterImgUrl"></div>
      </div>

      <!-- 基本信息 -->
      <div class="infor-box">
        <p class="infor-title">{{basicGoodsInfor.goodsName ? basicGoodsInfor.goodsName : '--'}}</p>
        <div class="price-wrap" v-if="!themeId && !isGroupId">
          <!--pageType === 1 普通; pageType === 2 星逗  判断福利区哪边到普通区-->
          <div class="normal-price" v-if="!pageType || (pageType === 1 ? !goodsPriceStock.welfarewZoneData.whetherBonusPrice : pageType === 2 ? !goodsPriceStock.welfarewZoneData.whetherLeaguePrice : pageType === 3 ? !goodsPriceStock.welfarewZoneData.whetherGoldBeanPrice : '')">
            <span><i>¥</i>{{goodsPriceStock.price ? goodsPriceStock.price : '0' | moneyFilter}}
              </span>
            <span v-if="goodsPriceStock.linePrice"><i>¥</i>{{goodsPriceStock.linePrice | moneyFilter}}</span>
          </div>
          <div v-if="pageType">
            <div class="actiy-price">
              <!-- 消费积分区 -->
              <template v-if="pageType == 1 && goodsPriceStock.welfarewZoneData.whetherBonusPrice">
                <div class="price-num">
                  <div>
                    <p class="num-tag" v-if="totalIntegral.bonusPoints < goodsPriceStock.welfarewZoneData.goodsBonusPoints">{{pageType | filterPointsTxt}}不足</p>
                    <p class="num-p">¥{{goodsPriceStock.welfarewZoneData.goodsBonusPrice}}
                      <span v-if="goodsPriceStock.welfarewZoneData.goodsBonusPoints">+{{goodsPriceStock.welfarewZoneData.goodsBonusPoints}}{{pageType | filterPointsTxt}}</span>
                    </p>
                  </div>
                  <div v-if="goodsPriceStock.welfarewZoneData.whetherBonusPrice">原价: {{goodsPriceStock.welfarewZoneData.goodsPrice}}元</div>
                </div>
                <!--{{(goodsPriceStock.welfarewZoneData.goodsPrice * 100 - goodsPriceStock.welfarewZoneData.goodsBonusPrice * 100) / 100}}-->
                <div class="price-save" v-show="goodsPriceStock.welfarewZoneData.goodsPrice - goodsPriceStock.welfarewZoneData.goodsBonusPrice > 0 ">省{{(goodsPriceStock.welfarewZoneData.goodsPrice * 100 - goodsPriceStock.welfarewZoneData.goodsBonusPrice * 100) / 100}}元</div>
              </template>

              <!-- 联盟区 -->
              <template v-if="pageType == 2 && goodsPriceStock.welfarewZoneData.whetherLeaguePrice">
                <div class="price-num">
                  <div>
                    <p class="num-tag" v-if="totalIntegral.leaguePoints < goodsPriceStock.welfarewZoneData.goodsLeaguePoints">{{pageType | filterPointsTxt}}不足</p>
                    <p class="num-p">¥{{goodsPriceStock.welfarewZoneData.goodsLeaguePrice}}
                      <span v-if="goodsPriceStock.welfarewZoneData.goodsLeaguePoints">+{{goodsPriceStock.welfarewZoneData.goodsLeaguePoints}}{{pageType | filterPointsTxt}}</span>
                    </p>
                  </div>
                  <div v-if="goodsPriceStock.welfarewZoneData.whetherLeaguePrice">原价: {{goodsPriceStock.welfarewZoneData.goodsPrice}}元</div>
                </div>
                <div class="price-save">省{{goodsPriceStock.welfarewZoneData.goodsPrice - goodsPriceStock.welfarewZoneData.goodsLeaguePrice}}元</div>
              </template>

              <!-- 芯豆区 -->
              <template v-if="pageType == 3 && goodsPriceStock.welfarewZoneData.whetherGoldBeanPrice">
                <div class="price-num">
                  <div>
                    <p class="num-tag" v-if="totalIntegral.goldPoints < goodsPriceStock.welfarewZoneData.goodsGoldBeanNum">{{pageType | filterPointsTxt}}不足</p>
                    <p class="num-p">¥{{goodsPriceStock.welfarewZoneData.goodsGoldBeanPrice}}
                      <span v-if="goodsPriceStock.welfarewZoneData.goodsGoldBeanNum">+{{goodsPriceStock.welfarewZoneData.goodsGoldBeanNum}}{{pageType | filterPointsTxt}}</span>
                    </p>
                  </div>
                  <div v-if="goodsPriceStock.welfarewZoneData.whetherGoldBeanPrice">原价: {{goodsPriceStock.welfarewZoneData.goodsPrice}}元</div>
                </div>
                <div class="price-save">省{{goodsPriceStock.welfarewZoneData.goodsPrice - goodsPriceStock.welfarewZoneData.goodsGoldBeanPrice}}元</div>
              </template>
            </div>
          </div>
        </div>
        <!--参与拼团-->
        <div class="price-wrap" v-if="isGroupId && (themeId || pageType == 12)">
          <div class="normal-price">
              <span><i>¥</i>{{goodsPriceStock.goodsGroupPrice ? goodsPriceStock.goodsGroupPrice : '0' | moneyFilter}}
              </span>
            <span v-if="goodsPriceStock.price"><i>¥</i>{{goodsPriceStock.price | moneyFilter}}</span>
          </div>
          <div class="spliceNumber">
            已拼{{number}}人
          </div>
        </div>
        <!--发起拼团-->
        <div class="price-wrap" v-if="(themeId || pageType == 12) && !isGroupId">
          <div class="normal-price">
              <span><i>¥</i>{{goodsPriceStock.goodsGroupPrice ? goodsPriceStock.goodsGroupPrice : '0' | moneyFilter}}
              </span>
            <span v-if="goodsPriceStock.price"><i>¥</i>{{goodsPriceStock.price | moneyFilter}}</span>
          </div>
          <div class="spliceNumber">
            已拼{{number}}人
          </div>
        </div>
        <!--买卖仓库-->
        <div class="price-wrap" v-if="pageType == 9 || pageType == 10">
          <div class="normal-price">
              <span>
                <i>¥</i>
                {{footerDate.purchasePrice ? footerDate.purchasePrice : goodsPriceStock.price | moneyFilter}}
              </span>
            <span v-if="goodsPriceStock.price && footerDate.purchasePrice && pageType == 9"><i>¥</i>{{goodsPriceStock.price | moneyFilter}}</span>
            <div class="icon" v-if="pageType == 10">
              +
              <i>
                <img src="../../assets/images/aaayouhuiquana.png"/>
              </i>
              {{footerDate.luckyAddPrice}}
            </div>
          </div>
          <!--<div class="spliceNumber" v-show="footerDate.luckyHasSnatchCount">-->
            <!--{{pageType == 9 ? '已抢购数量':'已批发数量'}}: {{footerDate.luckyHasSnatchCount}} 件-->
          <!--</div>-->
        </div>
        <div class="price-wrap" v-if="pageType == 14 ">
          <div class="normal-price">
              <span>
                <i>¥</i>
                {{footerDate.upgradePackagePrice ? footerDate.upgradePackagePrice : goodsPriceStock.upgradePackagePrice | moneyFilter}}
              </span>
            <div class="icon" v-if="pageType == 14 && goodsPriceStock.sendGreenGemstoneNum">
              +
              <i>
                <img src="../../assets/images/comtoUpgrade/bul.png"/>
              </i>
              赠
              {{goodsPriceStock.sendGreenGemstoneNum || 0}}
            </div>
          </div>
          <div >
            <span >原价：<i>¥</i > <span class="linPrice">{{goodsPriceStock.price | moneyFilter}}</span></span>
          </div>
          <!--<div class="spliceNumber" v-show="footerDate.luckyHasSnatchCount">-->
          <!--{{pageType == 9 ? '已抢购数量':'已批发数量'}}: {{footerDate.luckyHasSnatchCount}} 件-->
          <!--</div>-->
        </div>
      </div>

      <!--规格-->
      <div class="specs-box" @click="modalDialogfun(1)" v-if="pageType != 12">
        <div class="words-left">
          <i>选择: </i>
          <span class="defaultAttribute">
              <b v-for="(v,index) in defaultAttributeList">{{v}}</b>
            </span>
        </div>
        <div class="icon-right">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </div>
      </div>
      <!--普通拼团7 超级拼团12-->
      <div class="add-box" v-if="((themeId && !isGroupId) || pageType == 12) && groupList.length>0">
        <div class="title">小伙伴在拼单，可直接参与</div>
        <div class="tabel">
          <div class="cent" :style="'height'+swper+'px'">
            <swiper auto :height="swper+'px'" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false">
              <!--<swiper-item v-for="(item, index) in groupList" :key="index">-->

              <!--</swiper-item>-->
              <swiper-item v-for="(item, index) in groupList" :key="index">
                <div class="tableList"  v-for="(ite, index2) in item" :key="index2">
                  <div class="etime">
                    <p class="etimePhone">{{ite.userPhone | filterPhone}}</p>
                  </div>
                  <div class="etime">
                    <p>还差 <span class="number">{{ite.fewNum}}人</span> 拼成</p>
                    <p>剩余{{ite.D ? parseInt(ite.D) + ' 天 ': '' }}{{ ite.H + ':' + ite.T }}</p>
                  </div>
                  <div class="etime" style="text-align: right">
                    <div class="bot" @click="pageType ===12 ? bindCode(ite) : modalDialogfun(pageType, ite)"> 去拼单</div>
                  </div>
                </div>
              </swiper-item>
            </swiper>
          </div>
        </div>
      </div>
      <!--卖出赚多少列表 买卖仓 9抢购 10批发-->
      <div class="earn-Box" v-if="(pageType == 9 || pageType == 10) && userListByLuck.length > 0">
        <earn :listData="userListByLuck"></earn>
      </div>
      <!-- 说明 -->
      <div class="Explain" @click="showExplain" v-if="(pageType < 7 || pageType > 13) && !themeId">
        <div>说明: </div>
        <ul>
          <li v-if="cangetPoints">
            <p>积</p>
            <p>赠送{{cangetPoints}}积分</p>
          </li>
          <li v-if="goodsPriceStock.whetherBlancePay">
            <p>余</p>
            <p>余额支付</p>
          </li>
          <li v-if="goodsPriceStock.isPoints">
            <p>兑</p>
            <p>积分兑换</p>
          </li>
        </ul>
      </div>

      <!-- 品牌 -->
      <div class="brand" v-if="basicGoodsInfor.brandLogo || basicGoodsInfor.brand">
        <div>品牌: </div>
        <div>
          <img :src="basicGoodsInfor.brandLogo | filterImgUrl" v-if="basicGoodsInfor.brandLogo">
          <img src="../../assets/images/shopLogo.png" v-else>
          <span>{{basicGoodsInfor.brand}}</span>
        </div>
      </div>
<!--      <earnByUpLve v-if="pageType === 14"> </earnByUpLve>-->
      <!-- 评价 -->
      <div class="evaluate-main" v-if="!commentsNoData">
        <div class="evaluate-main-title">
          <div>用户评价({{commentsNum.totalNum}})</div>
          <div>{{(commentsNum.goodNum / commentsNum.totalNum * 100).toFixed(1)}}% 满意</div>
        </div>
        <ul>
          <li v-for="item in commentsList">
            <div class="evaluate-base">
              <div class="evaluate-base-portrait">
                <!-- <img src="http://passpay.andes-hub.com//file/shopadmin/source/201808/1533349297985.jpg"> -->
              </div>
              <div class="evaluate-base-name">{{item.phone | filterPhone}}</div>
              <div class="evaluate-base-score">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-haopingganxie"></use>
                </svg>
                <span>{{ item.commentType | commentsFilter}}</span>
              </div>
            </div>
            <div class="evaluate-con">{{item.commentContent}}</div>
          </li>
        </ul>
        <div class="evaluate-more" @click="headTabIndex = 1, showContainer = 2, headTabComponent = 'comments'">
          <span>查看更多</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sanjiaoright"></use>
          </svg>
        </div>
      </div>

      <!-- 商品介绍容器 -->
      <div class="tab-content" id="tab-content">
        <keep-alive>
          <component :basicGoodsInfor="basicGoodsInfor" :is="paramerTabComponent" ref="view"></component>
        </keep-alive>
      </div>
    </div>

    <!-- 参数、评价、售后容器 -->
    <div v-show="showContainer === 2">
      <div class="outer-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
        <keep-alive>
          <component :basicGoodsInfor="basicGoodsInfor" :is="headTabComponent" ref="view"></component>
        </keep-alive>
      </div>
    </div>

    <!-- 商品无货提示 -->
    <div class="noGoodsTip" v-if="noGoodSte">所选商品暂时无货，非常抱歉</div>

    <!-- 底部 -->
    <div class="footer-hei"></div>
    <!-- 福利区进入 -->
    <ul class="welfare-footer-box" :class="[{'welfare-footer-index':(typeNum==1)}]" v-if="pageType && pageType <= 3">
      <li class="fullBuy" :class="{'buyNoTap': noGoodSte}" @click="typeNum === 1 ? popConformBtn(3) : modalDialogfun(3)">全额购买</li>
      <li class="welfareBuy" :class="{'buyNoTap': noGoodSte || welfareBuySte}" @click="typeNum === 1 ? popConformBtn(4) : modalDialogfun(4)">{{pageType | filterbuyBtnTxt}}</li>
    </ul>
    <!-- 普通详情页显示 -->
    <ul class="footer-box" :class="[{'footer-index':(typeNum==1)}]"  v-if="!themeId && !pageType">
      <li class="left">
        <!--未收藏-->
        <div v-if="isCollectType == false" @click="joinCalCollect(1)">
          <!-- <img src="../../assets/images/Collection.png" @click="joinCalCollect(1)"> -->
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-aixin-ac-copy-copy"></use>
          </svg>
          <span>收藏</span>
        </div>
        <!--已收藏-->
        <div v-if="isCollectType == true" class="collect-box collect-box-active" @click="joinCalCollect(2)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-aixin-ac-copy"></use>
          </svg>
          <span>已收藏</span>
        </div>
        <div class="shopCart-box" @click="goShopCart()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gouwuche"></use>
          </svg>
          <span>购物车</span>
          <div  class="shopCartNum" v-if="carListNums > 0">{{carListNums}}</div>
        </div>
      </li>
      <!--点击属性选择直接加入购物车、购买-->
      <li class="right" :class="{'buyNoTap': noGoodSte}" @click="typeNum === 1 ? popConformBtn(3) : modalDialogfun(3)">立即购买</li>
      <li class="conter" :class="{'cartNoTap': noGoodSte}" @click="typeNum === 1 ? popConformBtn(2) : modalDialogfun(2)">加入购物车</li>
    </ul>
    <!-- 拼单情页显示 -->
    <ul class="footer-box footerBySplice" v-if="(themeId || pageType == 12) && !isGroupId">
      <li class="right" :class="{'buyNoTap': noGoodSte}" @click="typeNum === 1 ? popConformBtn(3) : modalDialogfun(3)" v-if="pageType != 12">
        <p>¥{{goodsPriceStock.price}}</p>
        <p class="name">单独购买</p>
      </li>
      <li class="conter" :class="{'cartNoTap': noGoodSte}" v-if="pageType != 12"  @click="modalDialogfun(12)">
        <p>¥{{goodsPriceStock.goodsGroupPrice || 0}}</p>
        <p class="name">发起拼团</p>
      </li>

      <li class="right free" :class="{'checkSperGroup': (checkSperGroup && !doningList[goodsId])}" v-if="pageType == 12" @click="clickFreeGroup(doningList[goodsId])">
        <p class="name" style="line-height: .7rem">{{ doningList[goodsId] ? '拼团中' : '免费开团'}} </p>
      </li>
      <li class="conter" v-if="pageType == 12" :class="{'cartNoTap': noGoodSte}" @click="bindCode()">
        <p>¥{{goodsPriceStock.goodsGroupPrice || 0}}</p>
        <p class="name">参与拼团</p>
      </li>
    </ul>
    <div class="earnByUpLveFooter footer-box" v-if="pageType === 14" @click="modalDialogfun(14)">
      <div class="bot"> 立即购买 </div>
    </div>
    <!-- 拼单情页显示 -->
    <ul class="footer-box footerBySpliceIn" v-if="themeId && isGroupId">
      <li class="right" :class="{'buyNoTap': noGoodSte}" >
        <p class="name">拼团立享 {{goodsPriceStock.goodsGroupPrice ? goodsPriceStock.price - goodsPriceStock.goodsGroupPrice : 0}} 元优惠</p>
      </li>
      <li class="conter" :class="{'cartNoTap': noGoodSte}" @click="modalDialogfun(7)">
        <p>¥{{goodsPriceStock.goodsGroupPrice}}</p>
        <p class="name">参与拼团</p>
      </li>
    </ul>
    <earnFootre v-if="pageType == 9 || pageType == 10" :footerDate="footerDate" @shoop="shoop" @active="activeFn" :myPurchaseCoupon="myPurchaseCoupon"></earnFootre>
    <!-- 说明弹窗 -->
    <div v-transfer-dom class="explain-pop-box">
      <popup height="70%" v-model="showExplainSte">
        <div class="explain-pop">
          <h2>说明</h2>
          <ul>
            <li>
              <div class="explain-pop-title">
                <p>积</p>
                <p>赠送积分</p>
              </div>
              <div class="explain-pop-con">一、根据真芯天下商城的业务形式，在使用现金支付的时候，商城会赠送一定数量的消费积分，消费积分可用于兑换商品或者兑换其他服务。现金支付（包括微信、支付宝、银联、线下支付）</div>
            </li>
            <li>
              <div class="explain-pop-title">
                <p>余</p>
                <p>可用余额支付</p>
              </div>
              <div class="explain-pop-con">二、“可用余额支付”是指商城内的部分指定商品可以支持余额支付购物，并不再产生积分。余额是用户充值的预购款。</div>
            </li>
            <li>
              <div class="explain-pop-title">
                <p>兑</p>
                <p>可用积分兑换</p>
              </div>
              <div class="explain-pop-con">三、“可用积分兑换”是指商城内的部分指定商品可以支持积分兑换，并不再产生积分。积分是在现金消费或者现金购买服务时产生的。</div>
            </li>
          </ul>
          <div class="explain-btn" @click="showExplainSte = false">关闭</div>
        </div>
      </popup>
    </div>

    <!-- 商品属性弹框 -->
    <div v-transfer-dom v-if="pageType != 9 && pageType != 10">
      <popup v-model="attributeType" position="bottom" height="75%" @on-hide="ClosePop">
        <div class="attributeType-box" style="border-top:1px solid #fff;">
          <div class="fixedBox">
            <!--商品说明-->
            <div class="goodInfor-box">
              <ul class="goodInfor-ul">
                <li class="left">
                  <img :src="basicGoodsInfor.mainImage | filterImgUrl" >
                </li>
                <li class="right">
                  <p>{{basicGoodsInfor.goodsName}}</p>
                  <!-- 正常商品 -->
                  <template v-if="!pageType || typeNum !== 4 || (pageType === 1 ? !goodsPriceStock.welfarewZoneData.whetherBonusPrice : pageType === 2 ? !goodsPriceStock.welfarewZoneData.whetherLeaguePrice : pageType === 3 ? !goodsPriceStock.welfarewZoneData.whetherGoldBeanPrice : '')">
                    <span class="price" v-if="pageType !== 14">¥{{(typeNum == 7 || typeNum == 13) ? goodsPriceStock.goodsGroupPrice : typeNum == 12 ? '0.01' : goodsPriceStock.price | moneyFilter}}</span>
                    <span class="price" v-if="pageType === 14">¥{{goodsPriceStock.upgradePackagePrice | moneyFilter}}</span>
                    <!--price-->
                  </template>
                  <!-- 福利专区 -->
                  <template v-if="typeNum === 4 && pageType">
                    <p class="price" v-if="pageType === 1 && goodsPriceStock.welfarewZoneData.whetherBonusPrice">
                      ¥{{goodsPriceStock.welfarewZoneData.goodsBonusPrice}}
                      <span v-if="goodsPriceStock.welfarewZoneData.goodsBonusPoints">
                        +{{goodsPriceStock.welfarewZoneData.goodsBonusPoints}}{{pageType | filterPointsTxt}}
                      </span>
                    </p>
                    <p class="price" v-if="pageType === 2 && goodsPriceStock.welfarewZoneData.whetherLeaguePrice">
                      ¥{{goodsPriceStock.welfarewZoneData.goodsLeaguePrice}}
                      <span v-if="goodsPriceStock.welfarewZoneData.goodsLeaguePoints">
                        +{{goodsPriceStock.welfarewZoneData.goodsLeaguePoints}}{{pageType | filterPointsTxt}}
                      </span>
                    </p>
                    <p class="price" v-if="pageType === 3 && goodsPriceStock.welfarewZoneData.whetherGoldBeanPrice">
                      ¥{{goodsPriceStock.welfarewZoneData.goodsGoldBeanPrice}}
                      <span v-if="goodsPriceStock.welfarewZoneData.goodsGoldBeanNum">
                        +{{goodsPriceStock.welfarewZoneData.goodsGoldBeanNum}}{{pageType | filterPointsTxt}}
                      </span>
                    </p>
                  </template>
                  <div class="exchangePoints" v-if="cangetPoints && typeNum !== 4 && pageType !== 14">
                    <div v-if="typeNum !=7 && pageType != 12">
                      <span>赠送</span>
                      <span><i>{{cangetPoints}}</i>积分</span>
                    </div>
                  </div>
                  <div class="exchangePoints" v-if="pageType === 14">
                    <div v-show="goodsPriceStock.sendGreenGemstoneNum">
                      <span>赠送</span>
                      <span><i>{{goodsPriceStock.sendGreenGemstoneNum || 0}}</i>绿宝</span>
                    </div>
                  </div>
                  <p class="title">库存{{goodsPriceStock.stock}}件</p>
                </li>
                <div class="del-box" @click="attributeType=false">
                  <x-icon type="ios-close-empty" size="30"></x-icon>
                </div>
              </ul>
            </div>
          </div>
          <div class="attrStyle" id="attrStyle">
            <!--尺码-颜色-->
            <div class="sizeColor-box">
              <div class="size-color" v-for="(v,index) in basicGoodsInfor.goodsStandardList" v-if="v.goodsStandarValList.length > 0">
                <span class="type">{{v.standardName}}</span>
                <ul class="options-ul clr">
                  <!--选择属性-->
                  <template>
                    <li :class="{'attributeActive': item.active, 'disabled': item.disabled}" v-for="(item,i) in v.goodsStandarValList" @click="item.disabled ? '' : selectedAttributeFun(v.goodsStandarValList, 2, item.id, item)">{{item.standardValName}}</li>
                  </template>
                </ul>
              </div>
            </div>
            <!--数量-->
            <ul class="num-box clr">
              <li class="left">数量</li>
              <li class="right">
                <com-cartcontrol  v-model="goodsNum" :max="goodsPriceStock.stock" v-if="this.pageType != 12"></com-cartcontrol>
                <com-cartcontrol  v-model="goodsNum" :max="1" :min="1" v-if="this.pageType == 12"></com-cartcontrol>
              </li>
            </ul>
          </div>
          <!--按钮-->
          <div class="btn" :class="{'buyNoTap': noGoodSte || welfareBuySte}" @click="popConformBtn(typeNum)" v-if="pageType && typeNum === 4">{{pageType | filterbuyBtnTxt}}</div>
          <div class="btn" @click="popConformBtn(typeNum)" v-else>确认</div>
        </div>
      </popup>
    </div>

    <skuByLucki v-if="pageType == 9 || pageType == 10" :skuOrderSource="skuOrderSource" :oderDate="skubasicGoodsInfor" :show = 'attributeType' @skuBack="skuBack" :activeTypeData="activeType"></skuByLucki>
    <!-- 浏览时间 -->
    <div class="browser-time">
      <x-circle
        :percent="browserPercent"
        :stroke-width="3"
        :stroke-color="'#f2726b'"
        :trail-width="3"
        :trail-color="'#fff'">
        <img src="../../assets/images/wallet/bean.png">
      </x-circle>
    </div>
    <!-- 赠送芯豆 -->
    <div class="giveBean" v-if="this.giveBeanSte">
      <div>恭喜您获得</div>
      <div>+{{beanGiveData}}</div>
    </div>

    <!-- 分享提示 -->
    <div class="share-box" v-if="showShareBg" @click="showShareBg = b">
      <img src="../../assets/images/share-tips.png">
    </div>
    <!--超级拼团提示-->
    <div class="suprShow">
      <x-dialog v-model="suprShow" class="suprShow">
        <x-icon type="ios-close-outline" style="fill:#fff;top: -0.8rem;position: absolute;left: 50%;margin-left: -0.3rem;" @click="suprShow = false"></x-icon>
        <div class="groupMask">
          <div class="mask-top">
            <p>您需要参与拼团后才能享受免费开团</p>
            <p>的机会并获取分佣喔~</p>
          </div>
          <div class="mask-bot">
            <div @click="suprShow = false">取消</div>
            <div @click="bindCode()">参与拼团</div>
          </div>
        </div>
      </x-dialog>
    </div>
    <!--邀请好友绑定邀请人的弹框-->
    <div class="bindInviter">
      <x-dialog v-model="isPayShow" class="dialog-demo">
        <x-icon type="ios-close-outline" style="fill:#fff;top: -0.8rem;position: absolute;left: 50%;margin-left: -0.3rem;" @click="isInviter(1)"></x-icon>
        <div style="padding: 0.5rem;">
          <div class="bindTop">
            <div class="bind-l"><img :src="cnayu"/></div>
            <div class="bind-r">{{ magError}}</div>
          </div>
          <div class="bindBottom">
            <div class="bind-yes" @click="isInviter(1)">取消</div>
            <div class="bind-no" @click="isInviter(2)">去付款</div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import { Swiper, XDialog, TransferDom, Popup, Icon, SwiperItem, XCircle } from 'vux'                     // 轮播图,底部弹框
  import goodInfor from '../../components/GoodInfor'                                                   // 商品介绍
  import specsParamer from '../../components/SpecsParamer'                                             // 规格参数
  import goodsTraceability from '../../components/goodsTraceability'                                   // 商品溯源
  import comments from '../../components/Comments'                                                     // 评价
  import salesService from '../../components/SalesService'                                             // 售后服务
  import comCartcontrol from '../../components/ComCartcontrol'                                         // 加减
  import { setTimeout } from 'timers'
  import earn from '../../components/goodsDetailCompont/earn'                                      // 幸运抢购 卖出赚多少列表
  import earnFootre from '../../components/goodsDetailCompont/footre'                              // 幸运抢购 底部购买
  import skuByLucki from '../../components/goodsDetailCompont/skubyLucki.vue'                      // 幸运抢购 sku
  import earnByUpLve from '../../components/goodsDetailCompont/byUpLve'                                      // 幸运抢购 卖出赚多少列表
  import { mapState } from 'vuex'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Swiper,
      SwiperItem,
      goodInfor,
      specsParamer,
      goodsTraceability,
      comments,
      salesService,
      TransferDom,
      Popup,
      Icon,
      XDialog,
      comCartcontrol,
      XCircle,
      earn,
      earnFootre,
      skuByLucki,
      earnByUpLve
    },
    data () {
      return {
        suprShow: false,                        // 超级拼团
        activeType: '',                      // 活动状态
        footerDate: '',                      // 组件传值 footerDate
        skubasicGoodsInfor: '',              // 组件传值 OrderDate
        skuOrderSource: '',                  // 组件传值 OrderSource
        swper: 80,
        number: 0,                          // 拼团多少件
        isGroupId: '',                      // 是否分享进入拼团
        user: {},                           // 用户信息
        groupDeailList: [],                 // 拼团id人员列表
        themeId: '',                        // 拼单活动id
        groupId: '',                        // 拼主id
        timer: '',                          // 定时器
        grouPage: {
          page: 1,
          pageSize: 20
        },
        groupList: [],
        showBean: true,
        headTabList: [
          {
            name: '商品',
            component: 'goodInfor'
          },
          {
            name: '评价',
            component: 'comments'
          },
          {
            name: '售后',
            component: 'salesService'
          }
        ],
        showContainer: 1,                         // 显示那个容器 默认显示商品 1 商品 2 其他容器
        headTabIndex: 0,                          // header tab索引
        headTabComponent: '',                     // header组件切换
        paramerTabList: [
          {
            name: '图文',
            component: 'goodInfor'
          },
          {
            name: '参数',
            component: 'specsParamer'
          }
        ],
        isLogin: false,                           // 是否登录
        pageType: '',                             // 页面展示类型 1 消费积分区 2 联盟积分区 3 芯豆区, 7拼团 9批发 10抢购 11批发提货 12超级拼团 14 超级拼团
        imgTxtTapNum: 0,                          // 图文点击次数
        paramerTapNum: 0,                         // 参数点击次数
        paramerTabIndex: 0,                       // 图文参数索引
        paramerTabComponent: 'goodInfor',         // 图文参数显示组件 默认goodInfor
        showDetailHeader: false,                  // 是否显示header
        goodsId: '',                              // 商品id
        defaultSkuId: '',                         // 默认skuId
        busy: false,
        swiperList: [],                           // 图片轮播
        basicGoodsInfor: {},                      // 基本信息
        currentView: 'goodInfor',                 // 商品介绍为默认组件
        attributeType: false,                     // 弹框的显示隐藏状态
        typeNum: '',                              // 商品下单类型(OrderSource) 规格=1 购物车=2 立即购买=3 发起拼单=7 幸运大抢购=9 12参发起超级拼团 13参加超级拼团 14 超级拼团
        goodSpecImg: '',                          // 商品规格图片
        defaultAttributeList: [],                 // 默认属性列表
        goodsNum: '',                              // 商品数量
        maxGoodsNum: '',                          // 最大数量
        shopCartNumType: false,                   // 购物车数量的显示隐藏状态
        isCollectType: false,                     // 是否收藏
        tabFixed: false,                          // 栏目是否固定
        tabTap: false,                            // 栏目是否点击
        columnHeight: 0,                          // 栏目距离顶部的距离
        carListNums: 0,                           // 购物车总列表中的数量
        selectArrt: [],                           // 选中的商品属性
        integral: {},                             // 用户积分
        NfcMessage: '',                           // nfc信息
        nfcAdvData: {},                           // nfc广告位
        showNfc: false,
        noGoodSte: false,                         // 无商品
        welfareBuySte: false,                     // 福利专区购买按钮是否可用
        goodsPriceStock: {                        // 价格库存信息
          price: 0,                               // 销售价
          linePrice: '',                          // 划线价
          stock: 0,                               // 库存
          points: 0,                              // 获得的积分
          isPoints: false,                        // 是否积分兑换
          whetherBlancePay: 0,                    // 是否余额支付
          welfarewZoneData: {},                   // 福利专区数据
          purchasePrice: '',                      // 采销价 / 抢购价格
          upgradePackagePrice: '',                 // 升级套餐价格
          sendGreenGemstoneNum: ''                 // 赠送绿宝
        },
        baseTop: 0,
        cangetPoints: 0,                          // 能获得多少积分
        totalIntegral: {},                        // 用户积分信息
        skuId: null,                              // 商品属性的skuId
        commentsNum: 0,                           // 评论数
        commentsNoData: false,                    // 评论是否有数据
        commentsList: [],                         // 评论列表
        showExplainSte: false,                    // 是否显示说明弹窗
        showShareBg: false,
        shareInvitationCode: '',                  // 通过分享进来的code
        browserPercent: 0,                        // 浏览网页的时间百分比
        giveBeanSte: false,                       // 是否显示赠送芯豆弹窗
        beanGiveData: 0,                          // 赠送的芯豆
        flag: true,
        userListByLuck: [],
        goodDetailByLuck: [],                    // 幸运大抢购
        myPurchaseCoupon: 0,                     // 我的批发券
        checkSperGroup: true,                   // 是否可以开团 未登录默认可以开团,登录后重置状态
        personalData: {},                        //  个人信息接口返回数据
        isPayShow: false,                        // 提示未付款
        magError: '',                            // 提示未付款提示语
        people: require('../../assets/images/groupBooking/people.png'),
        cnayu: require('../../assets/images/goodsDietail/canyu.png'),
        doningList: {}                           // 商品是否拼团种
      }
    },
    mounted: function () {
      var user = localStorage.getItem('bsbUserInfo') ? localStorage.getItem('bsbUserInfo') : ''
      if (user) {
        this.user = JSON.parse(user)
      }
//      console.log(this.user)
      this.defaultSkuId = this.$route.query.sid                                              // 获取默认skuId
      this.goodsId = parseInt(this.$route.query.goodsId)
      this.themeId = this.$route.query.themeId || ''                                       // 拼单id
      this.groupId = this.$route.query.groupId || ''                                       // 拼单主id
      this.isGroupId = this.$route.query.groupId || ''
      this.pageType = this.themeId ? 7 : parseInt(this.$route.query.pageType)                                   // 页面类型 (1 消费积分区 2 联盟积分区 3 芯豆区, 9批发 10抢购 )
      // 是否拼团  有拼主
      if (this.isGroupId) {
        this.groupChart()
      }
//      拼团 木有拼主
      if ((this.themeId || this.pageType === 12) && !this.isGroupId) {
//        console.log('获取拼团列表 已拼团人数')
        if (this.pageType === 12) {
          this.getSuperGroupIngList()
          this.getHasGroupPeople()
        } else {
          this.getGroupList()
        }
      }
      // 是否普通拼团
      if (this.themeId) {
        this.numberGet()
      }
      if (this.pageType === 9 || this.pageType === 10) {
        this.goodDetailByLuck = localStorage.getItem('goodDetailByLuck') ? JSON.parse(localStorage.getItem('goodDetailByLuck')) : {}
      }
      var baseInfo = document.getElementById('baseInfo')
      this.shareInvitationCode = localStorage.getItem('invitationCode')                       // 通过分享进来的code
      baseInfo.onscroll = () => {
        var s = baseInfo.scrollTop
        this.baseTop = s
        // 赠送芯豆计时
        if (this.flag && parseInt(this.isLogin) === 1) {
          if (this.browserPercent >= 100) {
            this.browserPercent = 0
            this.flag = false
            this.getGoldBeanNum()
          } else {
            this.browserPercent = this.browserPercent + 0.2
          }
        }
        if (this.showContainer === 1) {
          if (s > 100) {
            this.showDetailHeader = true
          } else {
            this.showDetailHeader = false
          }
        }
      }
      this.getAdvert()           // 获取广告位
      window.scrollTo(0, 0)      // 默认滚动条在顶部
      this.goodsDetailFun()      // 获取详情页信息
      this.getCommentStatic()    // 评论总数量
      this.goodsCommentsList()   // 评论列表
    },
    methods: {
      /**
       * 再次开团是否灰色
       */
      groupDoing (v) {
        this.$http.get(`${this.api.etSuperGroupingGoodsId}`, {
          params: {goodsId: this.goodsId}
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            var doning = {}
            for (let i in resData.data) {
              doning[resData.data[i]] = 1
            }
            this.doningList = doning
          }
        })
      },
      /**
       * 获取个人信息
       */
      getPersonalInfo (item) {
//        this.$http.post(`${this.api.personalInfo}`, {
//          id: this.bsbUserInfo ? this.bsbUserInfo.userId : ''
//        }).then((res) => {
//          // console.log(res)
//          this.personalData = res.data.data
//          if (res.data.status !== this.api.ERR_OK || !res) {
//            return false
//          }
//          if (!this.personalData.beInvitationCode) {
//            this.bindCodeShow = true
//          } else {
//            this.modalDialogfun(13, item)
//          }
//        })
        this.modalDialogfun(13, item)
      },
      /**
       * 参与超级拼团 是否绑定邀请人
       */
      bindCode (item) {
        if (this.suprShow) {
          this.suprShow = false
        }
        this.checkSperGroupInfo(0, item)
        // this.getPersonalInfo(item)
      },
      /**
       * 关闭邀请人弹框
       */
      isInviter (n) {
        // console.log(v)this.bindCodeShow = false
        this.isPayShow = false
        if (n === 2) {
          localStorage.setItem('goOrderState', '1')
          this.$router.push({name: 'orderList'})
        }
      },
      /**
       * 我的批发券
       */
      getMemberPurchaseCoupon (v) {
        this.$http.post(`${this.api.getMemberPurchaseCoupon}`, {}).then((res) => {
//        解决接口异步 组件传至问题
          v.luckyData.myPurchaseCoupon = res.data.data
          v.luckyData.isLogin = 1
          this.skubasicGoodsInfor = v
          this.footerDate = v.luckyData
        })
      },
      // 底部组件倒计时结束后 返回
      activeFn (res) {
//        console.log(res, 'res')
        if (res) {
          this.activeType = res
        }
      },
      // 买卖仓库 详情
      getGoodsInfo (item) {
        this.$http.post(`${this.api.getGoodsInfo}`, {
          goodsId: this.goodsId,
          skuId: this.skuId,
          flag: this.pageType === 10 ? 1 : 0   // flag: 1批发 0抢购
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            this.userListByLuck = resData.data.memberHasSellResList
            var laukData
            if (this.pageType === 9) {
              laukData = {
                luckyAddPrice: resData.data.grabTicketGive,                     // 券
                purchasePrice: resData.data.purchasePrice,                      // 采销价
                goodsPrice: resData.data.goodsPrice,                            // 划线价格
                luckyTodaySnatchCount: resData.data.todaySnatchCount,           // 当天抢购次数
                luckyPurchaseNumNow: resData.data.grabNumNow,                   // 商品当天名额数
                luckyPurchaseNumLimit: resData.data.grabNumLimit,               // 每人当天购买上限
                luckyHasSnatchCount: resData.data.hasSnatchCount,            // 已抢总次数次数
                luckyMemberHasSellResList: resData.data.memberHasGrabResList ? resData.data.memberHasGrabResList : resData.data.memberWaitSellResList.reverse(),   // 出售人列表 memberHasSellResList
                luckySysTime: resData.data.sysTime,                             // 系统时间
                luckyUserTodaySnatchCount: resData.data.userTodaySnatchCount, // 用户当天已抢购次数
                startDate: resData.data.grabStartDateNow > resData.data.grabStartDate ? resData.data.grabStartDateNow : resData.data.grabStartDate,   // 今天活动开抢时间 > 总活动结束时间
                endDate: resData.data.grabEndDateNow < resData.data.grabEndDate ? resData.data.grabEndDateNow : resData.data.grabEndDate,             // 今天活动结束时间 < 总活动结束时间
                memberWaitSellResList: resData.data.memberHasGrabResList ? resData.data.memberHasGrabResList : resData.data.memberWaitSellResList.reverse(),
                typeLucky: this.pageType,                                      // 9抢购 10批发
                grabStatus: resData.data.grabStatus,                           //  是否开启抢 0关闭 1开启 2代售
                progressColorWidth: resData.data.grabPercent || 0        // 进度条百分比
              }
              // 如果活动没开始 取 两个结束时间 取最大的 过滤掉当天结束时间始时间  (明天开枪 后天结束 过滤掉今天结束时间 取后天结束时间)
              if (resData.data.grabStartDate > resData.data.sysTime) {
                let H = this.timeFn(resData.data.grabStartDateNow, 1)
                let Y = this.timeFn(resData.data.grabStartDate)
                let HY = new Date(Y + ' ' + H).getTime()
                let Hen = this.timeFn(resData.data.grabEndDateNow, 1)
                let Yen = this.timeFn(resData.data.grabStartDate)
                let HYen = new Date(Yen + ' ' + Hen).getTime()
                if (resData.data.grabStartDate > HYen) {
                  let Ht = 60 * 60 * 24 * 1000 + HY
                  if (resData.data.grabStartDate > HY && resData.data.grabStartDate < HYen) {
                    Ht = 60 * 60 * 24 * 1000 + resData.data.grabStartDate
                  }
                  laukData.startDate = Ht
                } else if (resData.data.grabStartDate > HY && resData.data.grabStartDate < HYen) {
                  laukData.startDate = resData.data.grabStartDate
                } else if (resData.data.grabStartDate < HY) {
                  laukData.startDate = HY
                }
                laukData.endDate = HYen
              }
              this.footerDate = laukData
              // 合并商品详情接口信息(suk) 和 买卖仓接信息(抢购状态 )
              item.luckyData = laukData
              // 丢去sku子组件
              this.skubasicGoodsInfor = item
            }
            if (this.pageType === 10) {
              laukData = {
                luckyAddPrice: resData.data.purchaseTicketNeed,                 // 商品需要券
                purchasePrice: resData.data.purchaseBuyPrice,                   // 批发价格
                luckyTodaySnatchCount: resData.data.todayPurchaseCount,          // 当天批发次数
                luckyPurchaseNumNow: resData.data.purchaseNumNow,               // 商品当天名额数
                luckyPurchaseNumLimit: resData.data.purchaseNumLimit,           // 每人当天购买上限
                luckyHasSnatchCount: resData.data.hasPurchaseCount,              // 批发总次数次数
                luckyMemberHasSellResList: resData.data.memberHasSellResList,   // 出售人列表 memberHasSellResList
                luckyPurchaseNumTotal: resData.data.purchaseNumTotal,           // 该商品可获得名额总数
                luckySysTime: resData.data.sysTime,                             // 系统时间
                luckyUserTodaySnatchCount: resData.data.userTodayPurchaseCount, // 用户当天已抢购次数
                startDate: resData.data.purchaseStartDateNow > resData.data.purchaseStartDate ? resData.data.purchaseStartDateNow : resData.data.purchaseStartDate,   // 今天活动开抢时间 > 总活动结束时间
                endDate: resData.data.purchaseEndDateNow < resData.data.purchaseEndDate ? resData.data.purchaseEndDateNow : resData.data.purchaseEndDate,             // 今天活动结束时间 < 总活动结束时间
                memberWaitSellResList: resData.data.memberHasPurchaseResList ? resData.data.memberHasPurchaseResList : resData.data.memberWaitSellResList.reverse(),
                myPurchaseCoupon: this.myPurchaseCoupon,                       // 我的批发券
                typeLucky: this.pageType,                                      // 9抢购 10批发
                hangRebate: resData.data.hangRebate,                           // 利润
                isLogin: 0,                                                     // 是否登录: 默认未登录
                progressColorWidth: resData.data.purchasePercent || 0
              }
              if (resData.data.purchaseStartDate > resData.data.sysTime) {
                let H = this.timeFn(resData.data.purchaseStartDateNow, 1)
                let Y = this.timeFn(resData.data.purchaseStartDate)
                let HY = new Date(Y + ' ' + H).getTime()
                let Hen = this.timeFn(resData.data.purchaseEndDateNow, 1)
                let Yen = this.timeFn(resData.data.purchaseStartDate)
                let HYen = new Date(Yen + ' ' + Hen).getTime()
                if (resData.data.purchaseStartDate > HYen) {
                  let Ht = 60 * 60 * 24 * 1000 + HY
                  if (resData.data.purchaseStartDate > HY && resData.data.purchaseStartDate < HYen) {
                    Ht = 60 * 60 * 24 * 1000 + resData.data.purchaseStartDate
                  }
                  laukData.startDate = Ht
                } else if (resData.data.purchaseStartDate > HY && resData.data.purchaseStartDate < HYen) {
                  laukData.startDate = resData.data.purchaseStartDate
                } else if (resData.data.purchaseStartDate < HY) {
                  laukData.startDate = HY
                }
                laukData.endDate = HYen
              }
              // 合并商品详情接口信息(suk) 和 买卖仓接信息(抢购状态 )
              item.luckyData = laukData
//              查看是否登录
              this.checkLogin(() => {
//             以登录   获取买卖仓库批发券合并到item 再传入子组件
                this.getMemberPurchaseCoupon(item)
              }, () => {
//                未登录 item 传入子组件
                this.footerDate = laukData
                this.skubasicGoodsInfor = item
              })
            }
          }
        })
      },
      /**
       * 幸运大抢购sku组件关闭返回
       */
      skuBack (data) {
        this.attributeType = data
        if (!data) {
          this.typeNum = ''
        } else {
          this.skuOrderSource = this.skuOrderSource
        }
      },
      /**
       * 芯豆赠送
       */
      getGoldBeanNum () {
        this.$http.get(`${this.api.getGoldBeanNum}?ruleType=30`, {        // 29：签到、5：注册、23：分享商品、30、浏览商品、32、商品评价
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.beanGiveData = resData.data
            this.giveBeanSte = true
            setTimeout(() => {
              this.flag = true
            }, 300)
            setTimeout(() => {
              this.giveBeanSte = false
            }, 2000)
          } else {
            this.$vux.toast.text(resData.msg)
          }
        })
      },
      /**
       * 判断是否是微信浏览器
       */
      isWeiXin () {
        var ua = navigator.userAgent.toLowerCase()
        if (ua.indexOf('micromessenger') > -1) {
          return true
        } else {
          return false
        }
      },
      /**
       * header tab点击
       */
      headTabChange (index, component) {
        if (!this.showDetailHeader) return false
        this.headTabIndex = index
        if (index === 0) {   // 当商品选项点击时显示商品容器、其他则显示另一容器
          this.showContainer = 1
        } else {
          this.showContainer = 2
          this.headTabComponent = component
        }
      },
      /**
       * 滚动动画
       */
      scrollTop (number, time) {
        var baseInfo = document.getElementById('baseInfo')
        if (!time) {
          baseInfo.scrollTop = number
          return number
        }
        const spacingTime = 20                         // 设置循环的间隔时间  值越小消耗性能越高
        let spacingInex = time / spacingTime           // 计算循环的次数
        let nowTop = baseInfo.scrollTop                // 获取当前滚动条位置
        let everTop = (number - nowTop) / spacingInex  // 计算每次滑动的距离
        let scrollTimer = setInterval(() => {
          if (spacingInex > 0) {
            spacingInex--
            this.scrollTop(nowTop += everTop)
          } else {
            clearInterval(scrollTimer)                  // 清除计时器
          }
        }, spacingTime)
      },
      /**
       * 图文、参数切换
       */
      paramerChange (index, component) {
        if (!this.showDetailHeader) return false
        var fontSize = document.documentElement.style.fontSize
        fontSize = fontSize.substring(0, fontSize.length - 2)
        var baseInfo = document.getElementById('baseInfo')
        var H = document.getElementById('tab-content').offsetTop
        var bTop = H - document.getElementById('detail-header-box').offsetHeight - fontSize * 0.25
        this.paramerTabIndex = index
        this.paramerTabComponent = component
        setTimeout(() => {
          if (baseInfo.scrollTop < bTop) {
            this.scrollTop(bTop, 300)
          }
        }, 10)
      },
      /**
       * 显示说明弹窗
       */
      showExplain () {
        this.showExplainSte = true
      },
      /**
       * 获取评价数量
       */
      getCommentStatic () {
        this.$http.get(`${this.api.getCommentStatic}`, {
          params: {
            goodsId: this.goodsId
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            var totalNum = parseInt(resData.data.goodNum) + parseInt(resData.data.commonNum) + parseInt(resData.data.badNum) // 总数量
            this.$set(resData.data, 'totalNum', totalNum)
            this.commentsNum = resData.data
          }
        })
      },
      /**
       * 商品评价列表
       */
      goodsCommentsList () {
        this.$http.post(`${this.api.getComment}`, {
          start: 1,
          pageSize: 5,
          goodsId: this.goodsId,
          commentType: this.commentType ? this.commentType : ''
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            this.commentsNoData = true
            return false
          }
          this.commentsNoData = resData.data.list.length > 0 ? 0 : 1
          this.commentsList = resData.data.list
        })
      },
      /**
       * 获取nfc信息
       */
      getNfcMessage () {
        var obj = {
          location: '',
          uid: '***FA6895EJ97',
          readCount: '5',
          verifyResult: true,
          queryCount: '2'
        }
        this.$http.post(`${this.api.getNfcMessage}`, {
          chk: this.$route.query.chk ? this.$route.query.chk : '',
          goodsId: this.goodsId
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            if (res.data.data) {
              this.showNfc = true
              resData.data = JSON.parse(resData.data)
              resData.data.uid = this.$route.query.chk
              resData.data.uid = resData.data.uid ? '***' + resData.data.uid.substring(3) : ''
              this.NfcMessage = resData.data
            } else {
              this.NfcMessage = obj
            }
          } else {
            this.NfcMessage = obj
          }
          this.showNfc = true
        }).catch(() => {
          this.NfcMessage = obj
        })
      },
      /**
       * 获取广告
       */
      getAdvert () {
        this.$http.post(`${this.api.advertList}`, {
          start: 1,
          pageSize: 10,
          applicationTerminal: 1
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          let result = resData.data.list.filter((row) => parseInt(row.putLocation) === 6)
          if (result && result.length > 0) {
            this.nfcAdvData.isShow = result[0].isShow
            this.nfcAdvData.image = result[0].advertPositionDetailList[0].image
          }
        })
      },
      /**
       *页面滚动栏目固定
       */
      columnFixed () {
        var oDiv = document.getElementById('tab-title')
        var H = 0
        H = oDiv.offsetTop
        this.columnHeight = H
        window.onscroll = () => {
          var s = document.body.scrollTop || document.documentElement.scrollTop
          if (s > H) {
            this.tabFixed = true
          } else {
            this.tabFixed = false
          }
        }
      },
      /**
       * 检测是否登录
       */
      checkLogin (fun, err) {
        this.$http.get(`${this.api.ifLogin}`, {
        }).then((res) => {
          let resData = res.data
          this.isLogin = res.data
          if (parseInt(resData.data) !== parseInt(this.api.ERR_OK)) {
            err()
            return false
          }
          fun()
        })
      },
      /**
       * 福利购买按钮是否能点击
       */
      welfarewBuyJudge () {
        if (this.pageType === 1) {
          this.welfareBuySte = this.totalIntegral.bonusPoints < this.goodsPriceStock.welfarewZoneData.goodsBonusPoints || !this.goodsPriceStock.welfarewZoneData.whetherBonusPrice ? !!true : !!false
        } if (this.pageType === 2) {
          this.welfareBuySte = this.totalIntegral.leaguePoints < this.goodsPriceStock.welfarewZoneData.goodsLeaguePoints ||
          !this.goodsPriceStock.welfarewZoneData.whetherLeaguePrice ? !!true : !!false
        } if (this.pageType === 3) {
          this.welfareBuySte = this.totalIntegral.goldPoints < this.goodsPriceStock.welfarewZoneData.goodsGoldBeanNum || !this.goodsPriceStock.welfarewZoneData.whetherGoldBeanPrice ? !!true : !!false
        }
      },
      /**
       * 获取用户积分信息
       */
      getMemberPoints () {
        this.$http.get(`${this.api.getMemberPoints}`, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.totalIntegral = res.data.data
          this.welfarewBuyJudge()
        })
      },
      /**
       * 是否可以超级拼团
       */
      checkSperGroupInfo (v, item) {
        let param = {
          goodsId: this.goodsId,
          ifHeadUser: v,
          superGroupId: ''
        }
        if (this.$route.query.superGroupId && v === 0) {
          param.superGroupId = parseInt(this.$route.query.superGroupId)
        }
        if (item && v === 0) {
          param.superGroupId = item.superGroupId
        }
        this.$http.post(`${this.api.checkSperGroupInfo}`, param).then((res) => {
          if (res.data.data === 1) {
            this.suprShow = false
            let ordertype = v ? 12 : 13
            let parm = item || ''
            this.modalDialogfun(ordertype, parm)
          } else if (parseInt(res.data.status) === 9950) {
            this.suprShow = true
          } else if (parseInt(res.data.status) === 9951) {
            this.magError = res.data.msg
            this.isPayShow = true
          } else {
            this.$vux.toast.text(res.data.msg)
          }
        })
      },
      /**
       * 是否可以拼团
       */
      clickFreeGroup (isFree) {
        if (isFree) return
        this.checkSperGroupInfo(1)
      },
      /**
       * 商品详情
       */
      goodsDetailFun () {
        this.$http.post(`${this.api.goodsDetail}`, {
          id: this.goodsId,
          chk: this.$route.query.chk ? this.$route.query.chk : ''
        }).then((res) => {
          let resData = res.data
          let attrId = null
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.goodsId = resData.data.id          // 重新赋值goodsId
          // 获取nfc信息
          if (this.$route.query.chk) {
            this.getNfcMessage()
          }
          // 获取用户积分信息
          this.checkLogin(() => {
            this.getMemberPoints()
            // 获取是否能够发起超级拼团
            if (this.pageType === 12) {
              this.groupDoing()
            }
          }, () => {})
          // 初始化设置active属性
          if (resData.data.goodsStandardList.length > 0) {
            resData.data.goodsStandardList.forEach((item, index) => {
              item.goodsStandarValList.forEach((item, i) => {
                this.$set(item, 'active', false)    // 给每个选项添加'active'属性
              })
            })
          }
          // sku 列表id数据默认组合
          if (resData.data.goodsSkuList.length > 0) {
            resData.data.goodsSkuList.forEach((item, index) => {
              if (item.goodsSkuValList.length > 0) {
                // standardId集合
                var standardIdArr = []
                // standardValId集合
                var standardValIdArr = []
                if (item.whetherDefaultSku) {
                  this.defaultSkuId = item.id
                }
                item.goodsSkuValList.forEach((ite, ind) => {
                  standardIdArr.push(ite.standardId)
                  standardValIdArr.push(ite.standardValId)
                  this.$set(item, 'standardIdArr', standardIdArr)
                  this.$set(item, 'standardValIdArr', standardValIdArr)
                })
              }
            })
          }
          // 数据赋值
          this.basicGoodsInfor = resData.data
          // 打开时默认的attrid
          this.basicGoodsInfor.goodsStandardList.forEach((v, index) => {
            if (v.goodsStandarValList.length > 0) {
              // 默认进来的
              if (index === 0) {
                v.goodsStandarValList.forEach((ite) => {
                  let lenArr = []
                  let lenNoTapArr = []
                  this.basicGoodsInfor.goodsSkuList.forEach((its) => {
                    if (its.standardValIdArr.indexOf(ite.id) > -1) {
                      this.$set(ite, 'lenArr', lenArr.push(ite))
                    }
                    if (its.standardValIdArr.indexOf(ite.id) > -1 && (its.disStatus === 1 || !its.currentGoodsNum || its.currentGoodsNum <= 0)) {
                      this.$set(ite, 'lenNoTapArr', lenNoTapArr.push(ite))
                    }
                  })
                  if (ite.lenNoTapArr && ite.lenNoTapArr === ite.lenArr) {
                    this.$set(ite, 'disabled', true)
                  }
                })
                if (v.goodsStandarValList.filter((row) => row.lenArr !== row.lenNoTapArr).length > 0) {
                  attrId = v.goodsStandarValList.filter((row) => row.lenArr !== row.lenNoTapArr)[0].id          // 第一个属性的id
                }
              }
            }
          })
          if (this.defaultSkuId && this.basicGoodsInfor.goodsSkuList.filter((row) => parseInt(row.id) === parseInt(this.defaultSkuId)).length > 0) {
            this.getDefaultSku()     // 获取默认sku数据
          } else {
            // 判断所有商品是否都不可点击
            if (this.basicGoodsInfor.totalStock === 0) {
              this.goodsPriceStock.price = this.filterMinMoney(this.basicGoodsInfor.goodsSkuList)
              this.goodsPriceStock.linePrice = ''
              this.goodsPriceStock.goodsGroupPrice = this.filterMinMoneyByGroup(this.basicGoodsInfor.goodsSkuList)
              this.goodsPriceStock.stock = this.basicGoodsInfor.totalStock
              this.goodsPriceStock.points = ''
              this.goodsPriceStock.isPoints = false
              this.goodsPriceStock.whetherBlancePay = 0
              this.goodsPriceStock.upgradePackagePrice = ''
              this.goodsPriceStock.sendGreenGemstoneNum = ''
              this.welfarewZoneData = {}
              this.noGoodSte = true            // 无商品状态
              this.basicGoodsInfor.goodsStandardList.forEach((v, index) => {
                if (v.goodsStandarValList.length > 0) {
                  // 默认进来的
                  v.goodsStandarValList.forEach((ite) => {
                    this.$set(ite, 'disabled', true)
                  })
                }
              })
            } else {
              this.noGoodSte = false            // 无商品状态
              this.arrValCombinat(1, attrId, true)          // 属性值组合
            }
          }
          // 买卖仓
          if (this.pageType === 9 || this.pageType === 10) {
            this.getGoodsInfo(resData.data)
          }
          if (this.pageType === 10) {
//            console.log(this.goodDetailByLuck, 'this.pageType')
            this.skuOrderSource = 10
          }
          // 固定栏目
          this.$nextTick(() => {
            this.isCollected()  // 判断是否被收藏--需登录
            this.getCartNum()   // 获取购物车信息--需登录
          })
        })
      },
      /**
       * 时间戳解析
       */
      timeFn (time, type) {
        var Time = new Date(time)
        var data = {
          Y: Time.getFullYear(),
          M: Time.getMonth() + 1,
          D: Time.getDate(),
          H: Time.getHours(),
          T: Time.getMinutes(),
          S: Time.getSeconds()
        }
        if (data.H < 10) {
          data.H = '0' + data.H
        }
        if (data.T < 10) {
          data.T = '0' + data.T
        }
        if (data.S < 10) {
          data.S = '0' + data.S
        }
        if (data.M < 10) {
          data.M = '0' + data.M
        }
        if (data.D < 10) {
          data.D = '0' + data.D
        }
        if (type === 1) {
          return data.H + ':' + data.T + ':' + data.S
        } else if (type === 2) {
          return data.Y + '/' + data.M + '/' + data.D + ' ' + data.H + ':' + data.T + ':' + data.S
        } else {
          return data.Y + '/' + data.M + '/' + data.D
        }
      },
      /**
       * 能获得多少积分
       */
      getPointsByGoodsSku () {
        this.$http.get(`${this.api.getPointsByGoodsSku}`, {
          params: {
            skuId: this.skuId
          }
        }).then((res) => {
          let resData = res.data
          this.cangetPoints = resData.data
        })
      },
      /**
       * 默认选中sku
       */
      getDefaultSku () {
        if (this.defaultSkuId) {
          console.log(this.defaultSkuId, 'this.defaultSkuId')
          this.basicGoodsInfor.goodsSkuList.some((item) => {
            if (parseInt(item.id) === parseInt(this.defaultSkuId)) {
              this.goodsPriceStock = {
                price: (item.whetherSpecial && item.goodsSpecialPrice && this.pageType !== 14) ? item.goodsSpecialPrice : item.goodsPrice,
                linePrice: (item.whetherSpecial && item.goodsSpecialPrice && this.pageType !== 14) ? item.goodsPrice : '',
                stock: item.currentGoodsNum,
                points: item.points || 0,
                isPoints: item.whetherPoints ? !!true : !!false,
                whetherBlancePay: item.whetherBlancePay,
                welfarewZoneData: item,
                goodsGroupPrice: item.goodsGroupPrice,
                upgradePackagePrice: item.upgradePackagePrice || '',
                sendGreenGemstoneNum: item.sendGreenGemstoneNum || ''
              }
              this.skuId = item.id
              this.getPointsByGoodsSku()   // 计算能获得多少积分
              item.goodsSkuValList.forEach((ite, ind) => {
                this.basicGoodsInfor.goodsStandardList.forEach((ites, index) => {
                  ites.goodsStandarValList.forEach((v) => {
                    if (v.id === ite.standardValId) {
                      v.active = true
                      this.defaultAttributeList.push(v.standardValName)       // 选中属性值
                    }
                  })
                })
              })
            }
          })
        }
      },
      /**
       * 属性值组合
       * @types 1 默认进来选中 2 手动选中
       * @attrId 点击的第一个的id
       * @isActive  属性点击是 只有选中才执行
       */
      arrValCombinat (types, attrId, isActive) {
        let basicGoodsInfor = this.basicGoodsInfor
        let standardValIdArrs = []        // standardValId集合
        let overplus = []
        if (basicGoodsInfor.goodsStandardList.length > 0) {
          let defaultAttribute = []         // 默认值
          // 点击属性对应的属性
          basicGoodsInfor.goodsSkuList.forEach((item, ind) => {
            // 不是组合属性
            if (basicGoodsInfor.goodsStandardList.length <= 1) {
              overplus.push(item)
            } else {   // 是组合属性
              if (item.standardValIdArr.indexOf(attrId) > -1) {
                overplus.push(item)
              }
            }
          })
          // 属性设置是否可点击、获取选中值
          let arrEl = []
          basicGoodsInfor.goodsStandardList.forEach((v, index) => {
            if (v.goodsStandarValList.length > 0) {
              v.goodsStandarValList.forEach((ats, ind) => {
                if (overplus.length > 0) {
                  overplus.forEach((el) => {
                    // 不是组合属性
                    if (basicGoodsInfor.goodsStandardList.length <= 1) {
                      arrEl = el.standardValIdArr[0]
                    } else { // 是组合属性
                      var index = el.standardValIdArr.indexOf(attrId)
                      arrEl = el.standardValIdArr[el.standardValIdArr.length - 1 - index]
                    }
                    if (JSON.parse(ats.id) === JSON.parse(arrEl)) {
                      if (isActive && (el.disStatus === 1 || !el.currentGoodsNum || el.currentGoodsNum <= 0)) {
                        this.$set(ats, 'disabled', true)
                      } else {
                        if (basicGoodsInfor.goodsStandardList.length > 1) {
                          this.$set(ats, 'disabled', false)
                        }
                      }
                    }
                  })
                } else {
                  this.$set(ats, 'disabled', false)
                }
              })
              if (v.goodsStandarValList.filter((row) => !row.disabled).length > 0) {
                if (types === 1) {
                  v.goodsStandarValList.filter((row) => !row.disabled)[0].active = true                                // 第一个属性默认选中状态
                  standardValIdArrs.push(v.goodsStandarValList.filter((row) => !row.disabled)[0].id)                   // 选中的id集合
                  defaultAttribute.push(v.goodsStandarValList.filter((row) => !row.disabled)[0].standardValName)       // 选中属性值
                } else {
                  if (v.goodsStandarValList.filter((row) => row.active).length > 0) {
                    standardValIdArrs.push(v.goodsStandarValList.filter((row) => row.active)[0].id)                      // 选中的id集合
                    defaultAttribute.push(v.goodsStandarValList.filter((row) => row.active)[0].standardValName)       // 选中属性值
                  }
                }
              }
            }
          })
          if (types === 1) {
            if (standardValIdArrs[1]) {
              this.arrValCombinat(2, standardValIdArrs[1], true)          // 属性值组合
            }
          }
          // 获取选中的个数
          let activeLen = []
          this.basicGoodsInfor.goodsStandardList.forEach((item) => {
            item.goodsStandarValList.forEach((ite) => {
              if (ite.active) {
                activeLen.push(ite)
              }
            })
          })
          // 取出默认选中的属性对应的库存、价格
          basicGoodsInfor.goodsSkuList.forEach((item, index) => {
//            console.log(item, 'item')
            if (item.goodsSkuValList.length > 0) {
              let len = this.basicGoodsInfor.goodsStandardList.length
              if (activeLen.length === len) {
                if (item.standardValIdArr.toString() === standardValIdArrs.toString()) {
                  this.goodsPriceStock = {
                    price: (item.whetherSpecial && item.goodsSpecialPrice && this.pageType !== 14) ? item.goodsSpecialPrice : item.goodsPrice,
                    linePrice: (item.whetherSpecial && item.goodsSpecialPrice && this.pageType !== 14) ? item.goodsPrice : '',
                    stock: item.currentGoodsNum,
                    points: item.points || 0,
                    isPoints: item.whetherPoints ? !!true : !!false,
                    whetherBlancePay: item.whetherBlancePay,
                    welfarewZoneData: item,
                    goodsGroupPrice: item.goodsGroupPrice,
                    upgradePackagePrice: item.upgradePackagePrice || '',
                    sendGreenGemstoneNum: item.sendGreenGemstoneNum || ''
                  }
                  this.skuId = item.id
                  this.welfarewBuyJudge()      // 福利购买按钮是否能点击
                  this.getPointsByGoodsSku()   // 计算能获得多少积分
                }
              } else {
                this.goodsPriceStock = {
                  price: this.filterMinMoney(basicGoodsInfor.goodsSkuList),
                  linePrice: '',
                  stock: basicGoodsInfor.totalStock,
                  points: '',
                  isPoints: false,
                  whetherBlancePay: 0,
                  welfarewZoneData: {},
                  goodsGroupPrice: basicGoodsInfor.goodsSkuList[0].goodsGroupPrice,
                  upgradePackagePrice: item.upgradePackagePrice || '',
                  sendGreenGemstoneNum: item.sendGreenGemstoneNum || ''
                }
                this.skuId = basicGoodsInfor.id
                this.cangetPoints = 0
              }
            }
          })
          // 循环sku list通过standardValIdArr找到对应的库存、价格等
          this.defaultAttributeList = defaultAttribute
        } else {
          // basicGoodsInfor.goodsSkuList[0]
//          console.log(basicGoodsInfor.goodsSkuList[0], 'item')
          let bPrice = basicGoodsInfor
          this.goodsPriceStock = {
            price: (bPrice.whetherSpecial && bPrice.goodsSpecialPrice && this.pageType !== 14) ? bPrice.goodsSpecialPrice : bPrice.goodsPrice,
            linePrice: bPrice.whetherSpecial && bPrice.goodsSpecialPrice ? bPrice.goodsPrice : '',
            stock: basicGoodsInfor.totalStock,
            points: basicGoodsInfor.goodsSkuList[0].points,
            isPoints: basicGoodsInfor.goodsSkuList[0].whetherPoints ? !!true : !!false,
            whetherBlancePay: basicGoodsInfor.goodsSkuList[0].whetherBlancePay,
            welfarewZoneData: bPrice.goodsSkuList[0],
            goodsGroupPrice: basicGoodsInfor.goodsSkuList[0].goodsGroupPrice,
            upgradePackagePrice: basicGoodsInfor.goodsSkuList[0].upgradePackagePrice || '',
            sendGreenGemstoneNum: basicGoodsInfor.goodsSkuList[0].sendGreenGemstoneNum || ''
          }
          this.skuId = basicGoodsInfor.goodsSkuList[0].id
          this.welfarewBuyJudge()      // 福利购买按钮是否能点击
          this.getPointsByGoodsSku()   // 计算能获得多少积分
        }
//        console.log(this.skuId, 'this.skuId')
      },
      /**
       * 商品过滤最小价格
       */
      filterMinMoney (v) {
        if (!v || v.length <= 0) return false
        let skuPriceArr = []
        v.forEach((el) => {
          (el.whetherSpecial && this.pageType !== 14) ? skuPriceArr.push(el.goodsSpecialPrice) : skuPriceArr.push(el.goodsPrice)
        })
        return Math.min.apply(Math, skuPriceArr)
      },
      /**
       * 商品过滤最小价格
       */
      filterMinMoneyByGroup (v) {
        if (!v || v.length <= 0) return false
        let skuPriceArr = []
        v.forEach((el) => {
          skuPriceArr.push(el.goodsGroupPrice)
        })
        return Math.min.apply(Math, skuPriceArr)
      },
      /**
       * 属性选择
       */
      selectedAttributeFun (arr, types, attrId, item) {
        // 清空当前属性组
        arr.forEach((v, index) => {
          if (v.id !== item.id) {
            this.$set(v, 'active', false)
          }
        })
        // 选中当前属性
        item.active = !item.active
        this.$set(item, 'active', item.active)
        this.arrValCombinat(2, attrId, item.active)
      },
      /**
       * 动态组件切换
       */
      tabContents (data) {
        this.currentView = data
      },
      /**
       * 显示属性弹窗
       * @v 规格1 购物车2 普通购买3 福利专区购买4 发起拼团 7 发起超级拼团 12 参加超级拼团13
       */
      modalDialogfun (v, etmi) {
        if ((v !== 1 && this.noGoodSte) || (this.pageType && this.welfareBuySte && v === 4)) {
          return false
        }
        if (parseInt(this.basicGoodsInfor.saleStatus) === 2) {
          this.$vux.toast.text('商品已下架或删除')
          return false
        }
        this.typeNum = v
//         9抢购 10批发
        if (this.pageType === 9 || this.typeNum === 10) {
          this.typeNum = this.pageType
        }
//        普通拼团7 发起超级拼团12 参加超级拼团13
        if (this.typeNum === 7 || this.typeNum === 12 || this.typeNum === 13) {
          if (this.typeNum === 12 || this.typeNum === 13) {
//            是可以参团
            this.suprShow = false
          }
          // 是否列表点击
          if (etmi) {
//           过滤空列表
            if (etmi.fewNum <= 0) {
              this.$vux.toast.text('该拼团人员以满')
              return false
            }
            // 取出普通拼团列表 或者超级拼团列表 id
            this.groupId = etmi.id || etmi.superGroupId
            // 从超级列表点击过滤 (pageType == 12 && superGroupId) => typeNum(13)
            if (etmi.superGroupId) {
              this.typeNum = 13
            }
          } else {
//            不是列表点击
            this.groupId = this.$route.query.groupId || this.$route.query.superGroupId || ''
//            console.log(this.groupId)
          }
          this.skuOrderSource = this.typeNum
        }
        if (this.pageType === 9 || this.pageType === 10) {
          this.skuOrderSource = this.pageType
        }
        this.attributeType = true
        document.getElementsByTagName('body')[0].style.cssText = 'position:fixed;overflow:hidden;left:0;right:0;margin:auto;'
      },
      /**
       * 幸运大抢购
       * @v 规格1 购物车2 普通购买3 福利专区购买4 发起拼团 5
       */
      shoop (data) {
        this.modalDialogfun(data)
      },
      /**
       * 关闭弹窗
       */
      ClosePop () {
        this.attributeType = false
        document.getElementsByTagName('body')[0].style.cssText = ''
        this.typeNum = ''
      },
      /**
       * 数量
       */
      clickGogroup (etmi) {
        if (!this.isGroupId) {
          this.groupChart()
        }
      },
      countFun (v) {
        this.goodsNum = this.goodsNum
      },
      /**
       * 判断库存是否够
       */
      judgeGoodsStock (fun) {
        var obj = {}
        var arr = []
        obj = {
          goodsNum: this.goodsNum,
          skuId: this.skuId
        }
        arr.push(obj)
        this.$http.post(`${this.api.judgeGoodsStock}`, arr).then((res) => {
          if (res.data.status !== this.api.ERR_OK) {
            this.$vux.toast.text(res.data.msg)
            return false
          }
          fun()
        })
      },
      /**
       * 弹窗确定按钮
       * @typeNum 2 加入购物车 3 普通确认订单  福利专区确认订单4  7普通拼团 9买卖仓抢购 10批发 11批发提货 12 超级拼团 13参加超级拼团
       */
      popConformBtn (typeNum) {
//        console.log(typeNum)
        if (this.noGoodSte || (this.pageType && this.welfareBuySte && parseInt(typeNum) === 4)) {
          return false
        }
        this.typeNum = typeNum
        let basicGoodsInfor = this.basicGoodsInfor
        // 没有属性
        if (basicGoodsInfor.goodsStandardList.length <= 0) {
          this.skuId = basicGoodsInfor.goodsSkuList[0].id        // 获取选中的skuId
        } else {    // 有属性
          let activeLen = []
          basicGoodsInfor.goodsStandardList.forEach((item) => {
            item.goodsStandarValList.forEach((ite) => {
              if (ite.active) {
                activeLen.push(ite.id)
              }
            })
          })
          let len = basicGoodsInfor.goodsStandardList.length
          if (activeLen.length === len) {
            basicGoodsInfor.goodsSkuList.forEach((item, index) => {
              if (item.standardValIdArr.toString() === activeLen.toString()) {
                this.skuId = item.id                  // 获取选中的skuId
              }
            })
          } else {
            this.$vux.toast.text('请选择属性')
            return false
          }
        }
        // 判断库存
        this.judgeGoodsStock(() => {
          if (typeNum === 2) {
            this.joinCart()
          }
          // 拼团
          if (typeNum === 7 || typeNum === 12 || typeNum === 13 || typeNum === 14 || typeNum === 3 || typeNum === 4) {
            this.confirmOrder()
          }
          if (typeNum === 1) {
            this.attributeType = false
          }
        })
      },
      /**
       * 加入购物车
       */
      joinCart () {
        // 选中属性拼接
        if (this.basicGoodsInfor.goodsStandardList) {
          // var obj = {}
          this.selectArrt = []
          var goodsAttribute = []
          var goodsAttributeIds = []
          this.basicGoodsInfor.goodsStandardList.forEach((ite) => {
            ite.goodsStandarValList.forEach((item) => {
              if (item.active) {
                goodsAttribute.push(ite.standardName + ': ' + item.standardValName)
                goodsAttributeIds.push(item.id)
                // obj = {
                //   goodsAttributeId: ite.id,
                //   goodsAttributeValId: item.id
                // }
                // this.selectArrt.push(obj)
              }
            })
          })
        }
        this.$http.post(`${this.api.addGoodsToShopCart}`, {
          goodsId: this.goodsId,
          goodsNum: this.goodsNum,
          skuId: this.skuId,
          shopId: this.basicGoodsInfor.shopId,
          goodsAttribute: goodsAttribute.toString(),
          goodsAttributeIds: goodsAttributeIds.toString()
          // shopCartAttributeList: this.selectArrt
        }).then((res) => {
          let resData = res.data
          this.$vux.toast.text(resData.msg)
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.attributeType = false
          this.getCartNum()
        })
      },
      /**
       * 获取购物车数量
       */
      getCartNum () {
        this.$http.post(`${this.api.getShopCartList}?noLogin=true`, {
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.carListNums = resData.data.total < 100 ? resData.data.total : '99+'
        })
      },
      /**
       * 跳转购物车页面
       */
      goShopCart () {
        this.$http.post(`${this.api.getShopCartList}`, {
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) {
            this.$router.push({path: '/login', query: {redirect: this.$route.fullPath}})
            return false
          }
          this.$router.push('/shopCart')
        })
      },
      /**
       * 是否被收藏
       */
      isCollected () {
        this.$http.post(`${this.api.isCollect}?noLogin=true`, {
          goodsId: this.goodsId,
          shopId: this.basicGoodsInfor.shopId
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.isCollectType = res.data.data.isCollect
        })
      },
      /**
       * 加入、取消收藏
       * @num 1 加入收藏 2取消收藏
       */
      joinCalCollect (num) {
        var collectUrl = null // 添加收藏，取消收藏 url
        if (num === 1) {
          collectUrl = this.api.addCollect
        } else {
          collectUrl = this.api.cancelCollect
        }
        this.$http.post(collectUrl, {
          goodsId: this.goodsId,
          shopId: this.basicGoodsInfor.shopId
        }).then((res) => {
          this.$vux.toast.text(res.data.msg)
          if (res.data.status !== this.api.ERR_OK || !res) return false
          this.isCollected()
        })
      },
      /**
       * 确认订单
       */
      confirmOrder () {
        // 属性拼接
        let goodsAttribute = []
        if (this.basicGoodsInfor.goodsStandardList.length > 0) {
          var obj = {}
          var arr = []
          this.basicGoodsInfor.goodsStandardList.forEach((ite) => {
            ite.goodsStandarValList.forEach((item) => {
              if (item.active) {
                goodsAttribute.push(ite.standardName + ': ' + item.standardValName)
                obj = {
                  attributeId: ite.attributeId,
                  attributeName: ite.attributeName,
                  attributeValId: item.attributeValId,
                  attributeValName: item.attributeVal
                }
                arr.push(obj)
              }
            })
          })
        }
        // 立即购买 请求
        this.$http.post(`${this.api.getBuySoon}`, {
          goodsId: this.goodsId,
          goodsNum: this.goodsNum,
          skuId: this.skuId,
          goodsAttribute: goodsAttribute.toString()
        }).then((res) => {
          if (res.data.status === this.api.ERR_OK) {
            this.$vux.toast.text('确认成功')
            let resData = res.data.data
            // 拼接属性id
            if (resData.goodsAttriBySoonList && resData.goodsAttriBySoonList.length > 0) {
              var attributeId = []
              var attributeValId = []
              var orderAttributeRequest = [] // 订单属性集合
              var arrtObj = {}
              resData.goodsAttriBySoonList.forEach((item) => {
                attributeId.push(item.attributeId)
                attributeValId.push(item.attributeValId)
                arrtObj = {
                  attributeId: item.attributeId,
                  attributeValId: item.attributeValId
                }
                orderAttributeRequest.push(arrtObj)
              })
              resData.attributeId = attributeId.toString()
              resData.attributeValId = attributeValId.toString()
            }
            resData.skuId = this.skuId
            resData.brand = this.basicGoodsInfor.brand
            resData.brandLogo = this.basicGoodsInfor.brandLogo
            resData.whetherBlancePay = this.goodsPriceStock.whetherBlancePay
            resData.storageName = this.basicGoodsInfor.storageName
            resData.canGetPoints = this.cangetPoints
            resData.shopId = this.basicGoodsInfor.shopId
            resData.shopName = this.basicGoodsInfor.shopName

            // 1:普通购物，2:分享订单,3:芯豆兑换,4:消费积分购买,5:联盟积分购买,6:一元购,7:拼团，
            // 8:限时抢购 9买卖仓库抢购 10 批发 11批发提货 12 超级拼团发起 13超级拼团参加
            if (this.typeNum === 4) {
              resData.orderSource = this.pageType === 1 ? 4 : this.pageType === 2 ? 5 : this.pageType === 3 ? 3 : 1
              localStorage.setItem('CONFIRM_ORDER_TYPE', resData.orderSource)
              if (this.pageType === 1 && this.goodsPriceStock.welfarewZoneData.whetherBonusPrice) {
                resData.goodsPrice = this.goodsPriceStock.welfarewZoneData.goodsBonusPrice
                resData.typePonts = this.goodsPriceStock.welfarewZoneData.goodsBonusPoints
              } else if (this.pageType === 2 && this.goodsPriceStock.welfarewZoneData.whetherLeaguePrice) {
                resData.goodsPrice = this.goodsPriceStock.welfarewZoneData.goodsLeaguePrice
                resData.typePonts = this.goodsPriceStock.welfarewZoneData.goodsLeaguePoints
              } else if (this.pageType === 3 && this.goodsPriceStock.welfarewZoneData.whetherGoldBeanPrice) {
                resData.goodsPrice = this.goodsPriceStock.welfarewZoneData.goodsGoldBeanPrice
                resData.typePonts = this.goodsPriceStock.welfarewZoneData.goodsGoldBeanNum
              } else {
                resData.goodsPrice = resData.whetherSpecial && resData.goodsSpecialPrice ? resData.goodsSpecialPrice : resData.goodsPrice
              }
            } else if (this.typeNum === 7) { // 拼团
              resData.orderSource = 7
              resData.themeId = parseInt(this.themeId)
              resData.ifHeadUser = this.groupId ? 0 : 1
              resData.groupId = resData.ifHeadUser ? null : parseInt(this.groupId)
              resData.canGetPoints = 0
              resData.whetherBlancePay = 0
//              console.log(resData)
              resData.goodsGroupPrice = this.goodsPriceStock.goodsGroupPrice
              localStorage.setItem('CONFIRM_ORDER_TYPE', 7)
            } else if (this.pageType === 12) { // 超级拼团
              resData.orderSource = this.typeNum
              resData.ifHeadUser = this.typeNum === 12 ? 1 : 0
              resData.groupId = resData.ifHeadUser ? null : parseInt(this.groupId)
              resData.canGetPoints = 0
              resData.whetherBlancePay = 0
              resData.goodsGroupPrice = this.goodsPriceStock.goodsGroupPrice
              localStorage.setItem('CONFIRM_ORDER_TYPE', resData.orderSource)
            } else if (this.pageType === 14) {
              // 升级套餐
              resData.sendGreenGemstoneNum = this.goodsPriceStock.sendGreenGemstoneNum
              resData.goodsPrice = this.goodsPriceStock.upgradePackagePrice
              resData.orderSource = this.typeNum
              localStorage.setItem('CONFIRM_ORDER_TYPE', resData.orderSource)
            } else {  // 普通购物
              resData.orderSource = 1
              localStorage.setItem('CONFIRM_ORDER_TYPE', 7)
            }
            resData.shareInvitationCode = this.shareInvitationCode                         // 推荐分享进来的code
            resData.orderAttributeRequest = orderAttributeRequest                          // 订单属性集合
            localStorage.setItem('confirmOrderInfo', JSON.stringify([resData]))            // 存储确认订单页所需数据
            setTimeout(() => {
              if (resData.orderSource === 12) {
                this.$router.replace({path: '/groupFree', query: {skuId: this.skuId}})
              } else {
                this.$router.replace({path: '/confirmOrder'})
              }
            }, 100)
          } else {
            this.$vux.toast.text(res.data.msg)
          }
        })
      },
      /**
       * 评论加载更多
       */
      loadMore () {
        if (this.headTabComponent !== 'comments') return false
        this.$refs.view.loadMore()
      },
      /**
       * 拼团列表
       */
      getGroupList () {
        this.$http.post(`${this.api.getGroupList}`, {
          start: this.grouPage.page,
          pageSize: this.grouPage.pageSize,
          themeId: parseInt(this.$route.query.themeId),
          goodsId: parseInt(this.$route.query.goodsId)
        }).then((res) => {
          this.GroupIngListFn(res)
        })
      },
      /**
       * 超级拼团列表
       */
      getSuperGroupIngList () {
        this.$http.post(`${this.api.getSuperGroupIngList}`, {
          start: this.grouPage.page,
          pageSize: this.grouPage.pageSize,
          goodsId: this.goodsId
        }).then((res) => {
          res.data.data.currentTime = res.data.data.systemTime
          this.GroupIngListFn(res)
        })
      },
      GroupIngListFn (res) {
        var resData = res.data
        if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
          var listData = resData.data.list
          for (let i in listData) {
            var time = listData[i].endTime - resData.data.currentTime
            var resTime = this.timeOutFn(time)
            listData[i].D = parseInt(resTime.D)
            listData[i].H = resTime.H
            listData[i].T = resTime.T
            listData[i].S = resTime.S
            listData[i].time = time
          }
          this.groupList = []
          var colomns = 2
          var dataArr = listData
          if (dataArr.length < 2) {
            this.swper = 40
          }
          for (var i = 0, len = dataArr.length; i < len; i += colomns) {
            this.groupList.push(dataArr.slice(i, i + colomns))
          }
        }
      },
      /**
       * 拼团id详情
       */
      groupChart () {
        this.$http.get(`${this.api.getGroupJoin}`, {
          params: {
            themeId: this.themeId,
            groupId: this.groupId
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            this.groupDeailList = resData.groupDeailList
            var list = JSON.stringify(resData.groupDeailList)
            var phone = parseInt(this.user.phone)
            if (list.indexOf(phone) > -1) {
              this.$vux.toast.text('您已在该拼团')
              return false
            }
            this.groupId = resData.groupId
            this.attributeType = true
            document.getElementsByTagName('body')[0].style.cssText = 'position:fixed;overflow:hidden;left:0;right:0;margin:auto;'
          }
        })
      },
      /**
       * 倒计时
       */
      timeOutFn (time) {
        if (time <= 0) {
          return {D: 0, H: '00', T: '00', S: '00'}
        }
        var D = parseInt(time / 86400000)                                // 天
        var H = parseInt((time % 86400000) / 3600000)                   // 小时
        var T = parseInt(((time % 86400000) % 3600000) / 60000)           // 小时
        var S = parseInt((((time % 86400000) % 3600000) % 60000) / 1000)  // 秒
        if (H < 10) {
          H = '0' + H
        }
        if (T < 10) {
          T = '0' + T
        }
        if (S < 10) {
          S = '0' + S
        }
        var res = {D, H, T, S}
        return res
      },
      /**
       * 拼团多件
       */
      numberGet () {
        this.$http.get(`${this.api.countGroupNum}`, {
          params: {
            themeId: this.themeId,
            goodsId: this.goodsId
          }
        }).then((res) => {
          var resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            this.number = resData.data || 0
          }
        })
      },
      /**
       * 超级拼团多件
       */
      getHasGroupPeople () {
        this.$http.get(`${this.api.getHasGroupPeople}`, {
          params: {
            goodsId: this.goodsId
          }
        }).then((res) => {
          var resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            this.number = resData.data || 0
          }
        })
      }
    },
    beforeRouteLeave (to, from, next) {
      this.ClosePop()
      next()
    },
    beforeDestroy () {
      // 清除定时器
      // clearInterval(this.timer)
    },
    destroyed () {
      // 清除定时器
      // clearInterval(this.timer)
    },
    computed: {
      ...mapState(['active'])
    }
  }
</script>

<style scoped lang=less>
  /**nfc信息**/
  .nfc-message{
    opacity: 0;
    z-index: -1;
    width: 7.5rem;
    padding: .23rem .3rem;
    background: rgba(0,0,0,0.6);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
    z-index: -1;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    font-size: .26rem;
    color: #fff;
    box-sizing:border-box;
    -webkit-box-sizing: border-box;
    .nfc-message-img{
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      -webkit-border-radius: 50%;
      margin-right: .2rem;
      &:empty{
        background: #eee;
      }
      img{
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        -webkit-border-radius: 50%;
      }
    }
    .nfc-message-mes{
      flex: 1;
      p{
        margin-bottom: .12rem;
        font-weight:normal;
        word-break:break-all;
      }
    }
  }
  .nfc-message-show{
    opacity: 1;
    z-index: 5000;
    -webkit-transition: opacity 400ms;
    transition: opacity 400ms;
  }
  .vux-popup-dialog{
    overflow-y:initial;
  }
  /**header**/
  .detail-header-box{
    width: 7.5rem;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 4000;
    .detail-header{
      height: 1rem;
      display: flex;
      align-items: center;
      padding: 0 .23rem;
      transition: background-color ease .3s;
      /* transition: border-color 0.01s; */
      border-bottom: 1px solid transparent;
      position: relative;
      z-index: 300;
      /* padding-bottom: .04rem; */
      .detail-header-back,.detail-header-home,.detail-header-share,.detail-header-blank{
        width: .6rem;
        height: .6rem;
        background: rgba(0,0,0,0.3);
        border-radius: .39rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color ease .3s;
        svg{
          width: .45rem;
          height: .45rem;
          fill: #fff;
        }
      }
      .detail-header-home{
        svg{
          width: .42rem;
          height: .42rem;
        }
      }
      .detail-header-blank{
        background: none;
        margin-left: .32rem;
      }
      .detail-header-share{
        margin-left: .32rem;
        svg{
          width: .35rem;
          height: .35rem;
          fill: #fff;
        }
      }
      .detail-header-option{
        flex: 1;
        margin: 0 5%;
        opacity: 0;
        transition: opacity ease .3s;
        ul{
          display: flex;
          align-items: center;
          li{
            height: 1rem;
            line-height: 1rem;
            flex: 1;
            text-align: center;
            font-size: .28rem;
            color: #9b9b9b;
            position: relative;
            border-bottom: 2px solid  transparent;
            &.active{
              color: #a88d53;
              border-bottom: 2px solid #a88d53;
            }
          }
        }
      }
    }
    .detail-paramer{
      opacity: 0;
      transition: opacity ease .3s;
      border-bottom: 1px solid#e5e5e5;
      ul{
        display: flex;
        background: #fff;
        height: 0.9rem;
        padding: 0 20%;
        li{
          flex: 1;
          line-height: 0.9rem;
          text-align: center;
          color: #9b9b9b;
          font-size: .28rem;
          &.active{
            color: #a88d53;
          }
        }
      }
    }
  }
  .detail-header-box.transparent{
    .detail-header{
      background: #fff;
      box-shadow: 0 1px 0 rgba(0,0,0,.05), 0 0.5px 0 rgba(0,0,0,.09);
      -webkit-box-shadow: 0 1px 0 rgba(0,0,0,.05), 0 0.5px 0 rgba(0,0,0,.09);
      /* border-bottom: 1px solid#e5e5e5; */
    }
    .detail-header-back,.detail-header-home,.detail-header-share,.detail-header-blank{
      background: none;
      svg{
        fill: #8c8c8c;
      }
    }
    .detail-header-option,.detail-paramer{
      opacity: 1;
    }
  }
  .goodDetail {
    height: calc(100vh);
    overflow: hidden;
    .baseInfo{
      height: calc(~"100vh - 1rem - 1px");
      padding-bottom: .5rem;
      box-sizing: border-box;
      overflow-y: scroll;
    }
    /*基本信息*/
    .infor-box{
      padding: 0.2rem 0.3rem;
      min-height: 1.2rem;
      border-bottom: .25rem solid #f8f8f8;
      .infor-title{
        font-size: 0.29rem;
        color:#333;
        line-height: 1.6em;
        display: -webkit-box;
        display: -moz-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .price-wrap{
        position: relative;
        .normal-price{
          display: flex;
          align-items: center;
          span:nth-child(1){
            display: block;
            color:#f23030;
            font-size: 0.4rem;
            padding:0.2rem 0;
            i{
              font-size: .28rem;
            }
          }
          span:nth-child(2){
            display: block;
            margin-left: .15rem;
            color: #ccc;
            font-size: .24rem;
            text-decoration: line-through;
          }
          .icon{
            text-decoration:none;
            color: #f23030;
            margin-left: .1rem;
            img{
              width: .3rem;
              height: .3rem;
              border-radius: .2rem;
            }
          }
        }
        .actiy-price{
          display: flex;
          align-items: center;
          margin-top: .1rem;
          .price-num{
            flex: 1;
            div:nth-child(1){
              display: flex;
              align-items: center;
              margin-bottom: .05rem;
              .num-tag{
                padding: .03rem .15rem;
                font-size: .24rem;
                background: #ccc;
                color: #fff;
                margin-right: .1rem;
              }
              .num-p{
                color: #f23030;
                font-size: .24rem;
              }
            }
            div:nth-child(2){
              color: #ccc;
              font-size: .24rem;
              text-decoration: line-through;
            }
          }
          .price-save{
            background: #f23030;
            color: #fff;
            height: .55rem;
            line-height: .55rem;
            padding: 0 .2rem;
            border-radius: 30px;
            font-size: .28rem;
          }
        }

        .spliceNumber{
          position: absolute;
          right: 0rem;
          top: .3rem;
          color: #999999;
          font-size: .24rem;
        }
        .linPrice{
          text-decoration: line-through;
        }
      }

      .integral-tip{
        font-size: .26rem;
        color: #999999;
      }
      li{
        flex: 1;
      }

    }
    /* 品牌 */
    .brand{
      display:flex;
      padding: 0 .3rem;
      font-size: .28rem;
      align-items: center;
      height: .8rem;
      border-bottom: .25rem solid #f8f8f8;
      div:nth-child(1){
        color: #999;
        margin-right: .32rem;
      }
      div:nth-child(2){
        display: flex;
        align-items: center;
        img{
          width: .35rem;
          /* height: .5rem; */
          display: block;
          margin-right: .2rem;
        }
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }
    }
    .shopGetPoint{
      padding: .2rem .3rem;
      font-size: .28rem;
      color: #999999;
      border-bottom: 1px solid #eee;
      div{
        height: .4rem;
        line-height: .4rem;
        border: 1px solid #f23030;
        border-radius: 5px;
        display: inline-flex;
        font-size: .26rem;
        color: #f23030;
        align-items: center;
        overflow: hidden;
        span:nth-child(1){
          height: 100%;
          background: #f23030;
          color: #fff;
          font-size: .24rem;
          padding: 0 .08rem;
        }
        span:nth-child(2){
          display: flex;
          align-items: center;
          padding: 0 .1rem;
          i{
            max-width: 5rem;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .interval{
      height: 0.2rem;
      background: #eee;
    }
    /*规格*/
    .specs-box{
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.28rem;
      padding-left: 0.3rem;
      padding-right: 0.15rem;
      border-bottom: .25rem solid #f8f8f8;
      .words-left{
        float: left;
        position: relative;
        height:100%;
        i{
          color:#999;
          display: inline-block;
          height: 0.8rem;
          line-height: 0.8rem;
          position: absolute;
          top:0;
          left: 0;
        }
        .defaultAttribute{
          display: inline-block;
          width: 5.5rem;
          height: 0.8rem;
          color:#333;
          margin-left: 0.7rem;
          overflow: hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
          b{
            margin-left: 0.1rem;
          }
        }
      }
      .icon-right{
        float: right;
        position: relative;
        .vux-x-icon-ios-arrow-right {
          fill: #999;
          position: absolute;
          right: 0;
          top:0.2rem;
        }
      }
    }
    &:after{
      display: block;
      content: ".";
      height: 0;
      line-height: 0;
      clear: both;
      visibility: hidden;
    }
    /*参团*/
    .add-box{
      width: 100%;
      border-bottom: .25rem solid #f8f8f8;

      .title{
        color: #999;
        border-bottom: 1px solid #f0f0f0;
        line-height: .6rem;
        height: .6rem;
        padding-left: .3rem;
        padding-right: .3rem;
        font-size: .28rem;
      }

      .tabel{

        .cent{
          width: 100%;
          box-sizing: border-box;
          padding: .2rem .3rem .2rem .3rem;
          /*overflow-y: scroll;*/
          .tableList{
            display: flex;
            flex-direction: row;
            margin-bottom: .2rem;

            .etime{
              font-size: .24rem;
              color: #7d7a7a;
              width: 33.33%;
              text-align: center;

              .etimePhone{
                text-align: left;
                line-height: .7rem;
                height: .7rem;
              }

              .number{
                color: #f22839;
              }
            }

            .bot{
              display: inline-block;
              width: 1.28rem;
              height: .5rem;
              text-align: center;
              line-height: .5rem;
              background: #f22839;
              color: #fff;
              border-radius: 4px;
            }
          }
        }
      }
    }
    /* 说明 */
    .Explain{
      display: flex;
      align-items: center;
      height: auto;
      overflow: hidden;
      background: #fff;
      border-bottom: .25rem solid #f8f8f8;
      font-size: .28rem;
      padding:.2rem .1rem 0 0.3rem;
      div:nth-child(1){
        color: #999;
        margin-bottom: .2rem;
        margin-right: .32rem;
      }
      ul{
        flex:1;
        align-items: center;
        li{
          float: left;
          margin-right: .35rem;
          margin-bottom: .2rem;
          p{
            display: inline-block;
            vertical-align: middle;
            &:nth-child(1){
              background: #fe002e;
              border-radius: 6px;
              color: #fff;
              font-size:.24rem;
              padding: .06rem .12rem;
            }
            &:nth-child(2){
              margin-left: .1rem;
            }
          }
        }
      }
    }
    /* 主页评价 */
    .evaluate-main{
      padding: 0 .3rem;
      .evaluate-main-title{
        height: 1.15rem;
        align-items: center;
        display: flex;
        font-size: .28rem;
        div:nth-child(1){
          flex: 1;
          color: #292929;
          font-weight: 400;
        }
        div:nth-child(2){
          color: #a88d53;
        }
      }
      ul{
        height: 2.87rem;
        overflow: hidden;
        overflow-x: scroll;
        white-space: nowrap;
        &::-webkit-scrollbar {
          height: 0px;
        }
        li{
          height: 2.03rem;
          display: inline-table;
          width: 5rem;
          background: #f8f8f8;
          border:1px solid #e2e2e2;
          border-radius: 5px;
          padding: .4rem .33rem;
          margin-right: .8rem;
          &:last-child{
            margin-right: 0;
          }
          .evaluate-base{
            display: flex;
            align-items: center;
            .evaluate-base-portrait{
              width: .87rem;
              height: .87rem;
              border-radius: 50%;
              margin-right: .19rem;
              background: #a88d53;
              img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            .evaluate-base-name{
              color: #292929;
              font-size: .28rem;
              margin-right: .1rem;
            }
            .evaluate-base-score{
              border: 1px solid #a88d53;
              border-radius: 4px;
              display: flex;
              align-items: center;
              padding: .05rem .12rem;
              svg{
                width: .32rem;
                height: .34rem;
                fill:#a88d53;
                margin-right: .1rem;
              }
              span{
                color: #a88d53;
                font-size: .26rem;
              }
            }
          }
          .evaluate-con{
            color: #292929;
            font-size: .26rem;
            margin-top: .3rem;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            white-space: normal;
          }
        }
      }
      .evaluate-more{
        display: flex;
        align-items: center;
        justify-content: center;
        margin: .42rem 0;
        svg{
          width: .3rem;
          height: .3rem;
          fill: #9b7e52;
        }
        span{
          display: block;
          color: #9b7e52;
          font-size: .28rem;
        }
      }
    }

    /* tab切换 */
    .tabFixedClass{
      position: fixed;
      top:0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 3000;
    }
    .tabFixedHei{
      height: 0.9rem;;
    }
    .tab-title{
      display:flex;
      width:7.5rem;
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 14px;
      border-bottom: 1px solid #eee;
      background: #fff;
      li {
        width: 7.5rem;
        flex: 1;
        text-align: center;
        font-size: .28rem;
      }
      .active{
        color:#f23030;
      }
    }
    /* 内容区 */
    .tab-content{
      width: 100%;
      /* height: 100%; */
      min-height: calc(~"100vh - 1rem - 3px - 0.9rem - 1rem - 0.8rem ");
      /* position: relative;
      overflow-y: scroll; */
    }
    .noGoodsTip{
      width: 7.5rem;
      display: flex;
      height: .43rem;
      justify-content: center;
      align-items: center;
      background: #fdf8ed;
      color: #ffaf30;
      font-size: .26rem;
      text-align: center;
      position: fixed;
      bottom: 1rem;
      left: 0;
      right: 0;
      margin: auto;
    }
    /* 参数、评价、售后容器 */
    .outer-wrap{
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      height: calc(~"100vh - 1rem - 10px - 1rem ");
      margin-top: 1rem;
      position: relative;
      overflow-y: scroll;
    }
    /* 底部 */
    .footer-hei{
      height: 1rem;
    }
    .footer-box{
      width: 7.5rem;
      margin:auto;
      display:flex;
      align-items: center;
      height: 1rem;
      font-size: 0.28rem;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background: #fff;
      border-top:1px solid #eee;
      li {
        flex: 1;
        text-align: center;
      }
      .left{
        display: flex;
        div{
          flex: 1;
          width: 1.05rem;
          font-size: 0.2rem;
          color:#999;
          position: relative;
          /* border-right: 1px solid #eee; */
          &:last-child{
            border-right: none;
          }
          svg{
            width: 0.45rem;
            height: 0.45rem;
            display: block;
            margin: 0 auto;
            margin-top: .1rem;
          }
          span{
            /* margin-top: .05rem; */
            display: block;
          }
        }
        /*收藏夹*/
        .collect-box{
          /* border-right: 1px solid #eee; */
          /*字体图标*/
          .shopCartIcon,.shopCartIconChecked{
            position: absolute;
            left: 0.4rem;
            top:0.05rem;
          }
        }
        .collect-box-active{
          span{
            color: #fe002e;
          }
        }
        /*购物车*/
        .shopCart-box{
          position: relative;
          svg{
            transform: scaleX(-1);
            -webkit-transform: scaleX(-1);
          }
          .shopCartNum{
            position: absolute;
            top:0rem;
            right: 0.15rem;
            width: 0.3rem;
            height: 0.3rem;
            background: #f23030;
            color:#fff;
            border-radius: 0.3rem;
            text-align: center;
            line-height: 0.3rem;
            font-size: 0.2rem;
            padding: 1px;
          }
        }
      }
      .conter{
        background: #a88d53;
        color:#fff;
        font-size: 0.28rem;
        height: .7rem;
        line-height: .7rem;
        border-radius: 30px;
      }
      .right{
        background: #f23030;
        color:#fff;
        font-size: 0.28rem;
        height: .7rem;
        line-height: .7rem;
        border-radius: 30px;
        margin-right: .14rem;
      }
      .cartNoTap{
        background: #c1c1c1;
      }
      .buyNoTap{
        background: #999999;
      }
    }
     /* 套餐升级 */
    .earnByUpLveFooter{

      .bot{
        width: 100%;
        height: 1rem;
        background: #f23030;
        text-align: center;
        font-size: .32rem;
        color: white;
        line-height: 1rem;
      }
    }
    .footer-index{
      z-index: 600;
    }
    .footerBySplice{
      .conter{
        padding-top: .2rem;
        background: #f23030;
        color:#fff;
        font-size: 0.28rem;
        height: 1rem;
        line-height: .3rem;
        border-radius: 0px;
      }
      .right{
        padding-top: .2rem;
        background: #a88d53;
        color:#fff;
        font-size: 0.28rem;
        height: 1rem;
        line-height: .3rem;
        border-radius: 0px;
        margin-right: .0rem;
      }
      .free{
        background: #999;
        color: #fff;
      }
      .checkSperGroup{
        background: #F98B38;
        color: #fff;
      }
      .erorrGroup{

      }
      .name{
        font-size: .28rem;
      }
    }

    .footerBySpliceIn{
      .conter{
        padding-top: .2rem;
        background: #f23030;
        color:#fff;
        font-size: 0.28rem;
        height: 1rem;
        line-height: .3rem;
        border-radius: 0px;
      }
      .right{
        padding-top: .2rem;
        background: #fff;
        color:#999;
        font-size: 0.28rem;
        height: 1rem;
        line-height: .7rem;
        border-radius: 0px;
        margin-right: .0rem;
        border-top: 1px solid #f4f4f4;
      }
      .name{
        font-size: .30rem;
      }
    }
    /* 福利区底部 */
    .welfare-footer-box{
      width: 7.5rem;
      padding: 0 .2rem;
      box-sizing: border-box;
      margin: auto;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      height: 1rem;
      font-size: 0.28rem;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background: #fff;
      border-top: 1px solid #eee;
      &.welfare-footer-index{
        z-index: 600;
      }
      li{
        flex:1;
        height: .7rem;
        text-align: center;
        line-height: .7rem;
        columns: #fff;
        font-size: .28rem;
        color: #fff;
        border-radius: 5px;
        &.fullBuy{
          background: #f23030;
          margin-right: .2rem;
        }
        &.welfareBuy{
          background: #a88d53;
        }
        &.buyNoTap{
          background: #999999;
        }
      }
    }
  }

  /* 弹框 */
  .vux-popup-dialog{
    background: #fff;
    left: 0;
    right: 0;
    margin: auto;
    max-width: 7.5rem;
  }
  .swiper-wrap{
    background: #eee;
    position: relative;
    img{
      width: 100%;
      height: 100%;
    }
    .goodsDetailMask{
      position: absolute;
      bottom: 0;
      left: 0;
      img{
        display: block;
      }
    }
  }
  .vux-swiper-desc{
    background: red;
  }
  .attributeType-box{
    background: #fff;
    .fixedBox{
      width: 100%;
      /* position: fixed; */
      left: 0;
      z-index: 501;
      background: #fff;
      /*商品说明*/
      .goodInfor-box{
        padding-left:0.3rem;
        border-bottom: 1px solid #eee;
        .goodInfor-ul{
          display: flex;
          width: 100%;
          .left{
            width:1.6rem;
            height: 1.6rem;
            position: relative;
            img{
              width: 100%;
              height: 100%;
              /* position: absolute;
              top:-0.3rem;
              left: 0; */
              margin-top: -0.3rem;
              border-radius: 0.10rem;
            }
          }
          .right{
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            margin-left: 0.2rem;
            padding-right: 0.3rem;
            overflow: hidden;
            p{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .title{
              font-size: 0.2rem;
              color:#999;
              /* margin-top:0.1rem; */
            }
            .price{
              color:#f23030;
              font-size: 0.26rem;
              margin-top:0.18rem;
              margin-bottom: .03rem;
            }
            .exchangePoints{
              color:#ff9700;
              font-size: .24rem;
              position: absolute;
              right: .62rem;
              margin-top: .18rem;
              div{
                height: .3rem;
                line-height: .3rem;
                border: 1px solid #f23030;
                border-radius: 10px;
                display: -webkit-inline-box;
                display: -ms-inline-flexbox;
                display: inline-flex;
                font-size: .24rem;
                color: #f23030;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                overflow: hidden;
                span:nth-child(1){
                  height: 100%;
                  background: #f23030;
                  color: #fff;
                  font-size: .24rem;
                  border-top-left-radius: 8px;
                  border-bottom-left-radius: 8px;
                  padding: 0 .08rem;
                  display: flex;
                  align-items: center;
                  vertical-align: middle;
                }
                span:nth-child(2){
                  padding: 0 .08rem;
                  display: flex;
                  align-items: center;
                  i{
                    max-width: 2rem;
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                }
              }
            }
          }
          /*删除按钮*/
          .del-box{
            .vux-x-icon-ios-close-empty {
              fill: #999;
            }
          }
        }
      }
    }
    ::-webkit-scrollbar{width:0px}
    .attrStyle{
      width: 100%;
      border: none;
      position: absolute;
      top: 1.6rem;
      bottom:1rem;
      overflow-y: scroll;
    }
    /*尺码-颜色*/
    .sizeColor-box{
      padding-left: 0.3rem;
      /* margin-top: 1.6rem; */
      .size-color{
        border-bottom: 1px solid #eee;
        .type{
          display: inline-block;
          padding:0.3rem 0 0.3rem 0.3rem;
          font-size: 0.28rem;
        }
        .options-ul{
          li{
            min-width: 1.5rem;
            min-height: 0.5rem;
            text-align: center;
            line-height: 0.5rem;
            border-radius: 0.5rem;
            background: #eee;
            float: left;
            margin-left: 0.3rem;
            margin-bottom: 0.3rem;
            padding:0 0.2rem;
            font-size: .24rem;
          }
          .textAttribute{
            width: auto;
            text-align: left;
            padding:0 0.4rem;
          }
          .attributeActive{
            background: #f23030;
            color:#fff;
          }
          .disabled{
            background: #f5f5f5;
            color: #cfcfcf;
          }
        }
      }
    }
    /*数量*/
    .num-box{
      height: 1.7rem;
      padding:0.3rem;
      .left{
        float: left;
        font-size: .28rem;
      }
      .right{
        float: right;
      }
    }
    /*按钮*/
    .btn{
      width: 100%;
      max-width: 7.5rem;
      height: .8rem;
      line-height: .8rem;
      text-align: center;
      font-size: 0.32rem;
      background: #f23030;
      color:#fff;
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 0;
      z-index: 999999;
      &.buyNoTap{
        background: #ccc;
      }
    }
  }
  /* 字体图标 */
  .shopCartIcon {
    fill: #999;
  }
  .shopCartIconChecked {
    fill: red;
  }
  /* 说明弹窗 */
  .explain-pop-box{
    .vux-popup-dialog{
      background: #fff;
      left: 0;
      right: 0;
      margin: auto;
      max-width: 7.5rem;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      padding: 0 .44rem;
      box-sizing: border-box;
    }
    .explain-pop{
      h2{
        font-size: .3rem;
        color: #fe002e;
        text-align: center;
        line-height: 1.2rem;
      }
      ul{
        position: absolute;
        top: 1.2rem;
        left: .44rem;
        right: .44rem;
        margin: auto;
        bottom: 1.2rem;
        overflow-y: scroll;
        li{
          margin-bottom: .6rem;
          .explain-pop-title{
            display: flex;
            align-items: center;
            p:nth-child(1){
              background: #fe002e;
              border-radius: 6px;
              color: #fff;
              font-size: .24rem;
              padding: .04rem .12rem;
            }
            p:nth-child(2){
              margin-left: .1rem;
              font-size:.28rem;
              color: #454545;
              margin-left: .2rem;
            }
          }
          .explain-pop-con{
            color: #454545;
            font-size: .28rem;
            margin-top: .22rem;
          }
        }
      }
      .explain-btn{
        height: .86rem;
        line-height: .86rem;
        color: #fff;
        text-align: center;
        border-radius: 30px;
        background: #fe002e;
        position: absolute;
        bottom: .34rem;
        left: .44rem;
        right: .44rem;
        margin: auto;
      }
    }
  }
  /* 分享弹窗 */
  .share-box{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0,0,0,0.5);
    width: 7.5rem;
    text-align: right;
    z-index: 4800;
    img{
      width: 60%;
    }
  }
  /* 浏览时间 */
  .browser-time{
    position: fixed;
    right: 0;
    bottom: 2rem;
    width: .65rem;
    height: .65rem;
    border-radius: 50%;
    background: #e7e7e7;
    z-index: 300;
    .vux-circle{
      width: .55rem;
      height: .55rem;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      img{
        width: .26rem;
        height: .27rem;
      }
    }
  }
  /* 赠送芯豆 */
  .giveBean{
    min-height: 3.7rem;
    position: fixed;
    display: table;
    z-index: 5000;
    width: 30%;
    max-width: 5rem;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    text-align: center;
    border-radius: 6px;
    overflow: hidden;
    background: url('../../assets/images/product_get_dou_bg.png') no-repeat;
    background-color: rgba(0,0,0,0.5);
    background-size: 2.2rem 2.23rem;
    background-position: center bottom;
    div:nth-child(1){
      color: #fff;
      margin-top: .3rem;
      margin-bottom: .5rem;
    }
    div:nth-child(2){
      color: #f0d629;
    }

    .text-scroll{
      height: 1.8rem;
    }
  }


</style>
<style>
  .weui-dialog {
    position: fixed;
    display: table;
    z-index: 5000;
    width: 72%;
    max-width: 300px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background-color: #FFFFFF;
    text-align: center;
    border-radius: 5px;
    overflow: auto;
  }
  .groupMask{
    width: 5.4rem;
  }
  .mask-top{
    margin-top: 0.62rem;
    font-size: 0.3rem;
    color: #333;
  }
  .mask-top p{
    line-height: 0.39rem;
  }
  .mask-bot{
    display: flex;
    justify-content: space-around;
    margin-top: 0.67rem;
    margin-bottom: 0.5rem;
  }
  .mask-bot div:nth-of-type(1){
    width: 1.72rem;
    height: 0.54rem;
    line-height: 0.54rem;
    background: #fff;
    color: #F82828;
    border-radius: 0.08rem;
    border: 1px solid #F82828;
  }
  .mask-bot div:nth-of-type(2){
    width: 1.72rem;
    height: 0.54rem;
    line-height: 0.54rem;
    background: #F82828;
    color: #fff;
    border-radius: 0.08rem;
    border: 1px solid #F82828;
  }
</style>

<style lang="less">
  .bindInviter{
    .weui-dialog {
      position: fixed;
      display: table;
      z-index: 5000;
      width: 80%;
      max-width: 340px;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      background-color: #FFFFFF;
      text-align: center;
      border-radius: 3px;
      overflow: auto;
    }
    .bindTop{
      /*width: 6rem;*/
      display: flex;
    .bind-l{
      width: 0.75rem;
      height: 0.75rem;
      margin-right: 0.2rem;
    img{
      width: 100%;
      height: 100%;
    }
    }
    .bind-r{
      max-width: 4rem;
      line-height: 0.39rem;
      font-size: 0.28rem;
      color: #333;
      text-align: left;
    }
    }
    .bindBottom{
      margin-top: 0.53rem;
      display: flex;
      font-size: 0.28rem;
      justify-content: space-between;
    .bind-yes{
      width: 1.72rem;
      height: 0.54rem;
      line-height: 0.54rem;
      border: 1px solid #F82828;
      color: #F82828;
      background: #fff;
      -webkit-border-radius: 0.1rem;
      -moz-border-radius: 0.1rem;
      border-radius: 0.1rem;
    }
    .bind-no{
      width: 1.72rem;
      height: 0.54rem;
      line-height: 0.54rem;
      border: 1px solid #F82828;
      color: #fff;
      background: #F82828;
      -webkit-border-radius: 0.1rem;
      -moz-border-radius: 0.1rem;
      border-radius: 0.1rem;
    }
    }
  }
</style>
