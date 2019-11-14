let baseUrl, imgUrl, pageUrl, paySuccessUrl
if (process.env.NODE_ENV === 'production') {
  if (process.env.type === 'testing') {                       // 测试环境
    baseUrl = 'https://passpay.andes-hub.com/behindshop/'
    imgUrl = 'https://passpay.andes-hub.com/'
    pageUrl = 'https://passpay.andes-hub.com/mshop'
    paySuccessUrl = 'passpay.andes-hub.com'
  } else {                                                    // 正式环境
    baseUrl = 'https://120.77.210.28/behindshop/'
    imgUrl = 'https://120.77.210.28/'
    pageUrl = 'https://120.77.210.28/mshop'
    paySuccessUrl = '120.77.210.28'
  }
} else {                                                      // 本地环境
  imgUrl = 'http://passpay.andes-hub.com/'
  pageUrl = 'http://192.168.8.127:8088/mshop'
  paySuccessUrl = 'passpay.andes-hub.com'
  baseUrl = 'https://passpay.andes-hub.com/behindshop/'
  /**
   * 上面是本地测试环境与商家演示环境的切换
   * */
  // baseUrl = 'http://192.168.1.133:8084/passpay-shop/'      // 黄少杰
  // baseUrl = 'http://192.168.8.164:8088/passpay-shop/'      // 李娜
  // baseUrl = 'http://192.168.8.181:9998/passpay-shop/'      // 夏龙江
  // baseUrl = 'http://192.168.8.37:8080/passpay-shop/'       // 刘永强
  // baseUrl = 'http://192.168.1.116:9080/passpay-shop/'      // 徐鹏
  // baseUrl = 'http://192.168.1.243:8280/passpay-shop/'      // 谢凯
}
export default{
  appid: 'wx29ed774e4f21daca',                // 微信支付appid百世贝
  // appid: 'wx81be76626393fc6e',             // 微信支付appid农业
  imgUrl: imgUrl,                             // 图片地址
  pageUrl: pageUrl,                           // 域名地址
  paySuccessUrl: paySuccessUrl,               // 支付成功跳转域名
  ERR_OK: '1',                                // 请求成功状态码
  allLogin: 'clientName=bigTurn',          // 联合登陆标示
  register: `${baseUrl}login/register`,                                                                                              // 注册
  resetPassword: `${baseUrl}login/resetPassword`,                                                                                    // 重置密码
  updatePass: `${baseUrl}personalInfoController/updatePass`,                                                                         // 修改密码
  checkInvitCode: `${baseUrl}login/getInvitationInfo`,                                                                               // 校验注册邀请码
  checkPassword: `${baseUrl}personalInfoController/checkPaymentPassword`,                                                            // 校验支付密码
  login: `${baseUrl}login/login`,                                                                                                    // 登录
  logout: `${baseUrl}login/logout`,                                                                                                  // 退出登录
  ifLogin: `${baseUrl}login/ifLogin`,                                                                                                 // 判断用户是否登录
  checkPhoneExist: `${baseUrl}login/checkPhoneExist`,                                                                                // 判断手机号是否存在
  advertList: `${baseUrl}advertPosition/list`,                                                                                       // 获取首页广告(轮播图、栅格)
  getAllColumnList: `${baseUrl}column/allColumnList`,                                                                                // 获取首页栏目及栏目列表
  getShopList: `${baseUrl}/shopManageController/getHomeShopList`,                                                                    // 获取首页推荐商家列表
  getActivityList: `${baseUrl}activity/getActivityList`,                                                                             // 首页活动列表
  getActivityInfoList: `${baseUrl}activity/getActivityInfoList`,                                                                     // 首页活动详情
  getNfcMessage: `${baseUrl}webservice/nfc/check`,                                                                                   // 获取nfc信息
  goodsDetail: `${baseUrl}shop/goods/getGoodsDetail`,                                                                                // 商品详情
  getPointsByGoodsSku: `${baseUrl}column/getPointsByGoodsSku`,                                                                       //  根据商品SKU计算能获得的积分
  getPointsByShareGoodsSku: `${baseUrl}column/getPointsByShareGoodsSku`,                                                             //   根据分享的商品SKU计算能获得的积分
  judgeGoodsStock: `${baseUrl}shop/order/judgeGoodsStock`,                                                                           // 判断商品是否有足够的库存
  getBuySoon: `${baseUrl}shop/goods/getBuySoon`,                                                                                     // 商品详情立即购买
  getComment: `${baseUrl}shop/commentController/getComment`,                                                                         // 商品详情页评价列表
  getCommentStatic: `${baseUrl}shop/commentController/getCommentStatic`,                                                             // 商品详情页评价好中差数量
  addCollect: `${baseUrl}shop/collection/add`,                                                                                       // 添加收藏
  cancelCollect: `${baseUrl}shop/collection/cancelCollect`,                                                                          // 取消收藏、
  isCollect: `${baseUrl}shop/collection/isCollect`,                                                                                  // 判断当前商品是否被收藏
  collectionList: `${baseUrl}shop/collection/list`,                                                                                  // 收藏夹列表
  addGoodsToShopCart: `${baseUrl}shop/shopCart/saveShopCart`,                                                                        // 加入购物车
  saveShopCartList: `${baseUrl}shop/shopCart/saveShopCartList`,                                                                      // 批量加入购物车批量加入购物车
  goodsTypeLeft: `${baseUrl}shop/goods/getAttributeTypeListByParentId`,                                                              // 获取分类左侧大类
  goodsTypeRight: `${baseUrl}shop/goods/getChildTypeByAttrParentType`,                                                               // 获取分类右侧中类及小类
  getGoodsListBySerch: `${baseUrl}shop/goods/getGoodsListByName`,                                                                    // 通过公共搜索点击获取商品列表
  getGoodsListByClass: `${baseUrl}shop/goods/getGoodsList`,                                                                          // 通过分类中小类点击获取商品列表
  getGoodsListByColumn: `${baseUrl}column/getGoodsListByColumnId`,                                                                   // 通过首页栏目点击获取商品列表
  getSetmealGoodsListByColumnId: `${baseUrl}column/getSetmealGoodsListByColumnId`,                                                   // 套餐获取列表
  getShopCartList: `${baseUrl}shop/shopCart/getShopCartList`,                                                                        // 购物车列表
  shopCartDel: `${baseUrl}shop/shopCart/deleteShopCart`,                                                                             // 购物车删除
  getOrderSettlement: `${baseUrl}shop/shopCart/getOrderSettlement`,                                                                  // 购物车下单
  moveGoodsToCollection: `${baseUrl}shop/shopCart/moveGoodsToCollection`,                                                            // 购物车移入收藏夹
  updateGoodsNumToShopCart: `${baseUrl}shop/shopCart/updateShopCartGoodsNum`,                                                        // 更新购物车数量
  getCode: `${baseUrl}personalInfoController/getValidWord`,                                                                          // 获取验证码
  checkCode: `${baseUrl}personalInfoController/checkVerifyCode`,                                                                     // 检测验证码是否一致
  modifyPhone: `${baseUrl}shop/personalInfoManageController/updatePhone`,                                                            // 修改手机号码
  getContent: `${baseUrl}cotentController/getContent`,                                                                               // 协议和售后服务
  personalInfo: `${baseUrl}shop/personalInfoManageController/viewPersonalInfo`,                                                      // 获取个人信息
  getRegisterStatus: `${baseUrl}personalInfoController/getRegisterStatus`,                                                           // 判断用户是否在系统中注册
  userIfNeedUpgrade: `${baseUrl}personalInfoController/userIfNeedUpgrade`,                                                           // 用户是否满足升级条件
  addList: `${baseUrl}shop/addressController/getAddressList`,                                                                        // 收货地址列表
  delAdd: `${baseUrl}shop/addressController/deleteAddress`,                                                                          // 删除地址
  addAdd: `${baseUrl}shop/addressController/addAddress`,                                                                             // 添加地址
  editAdd: `${baseUrl}shop/addressController/updateAddress`,                                                                         // 编辑地址
  addDetail: `${baseUrl}shop/addressController/getAddress`,                                                                          // 收货地址详情
  setDefaultAddress: `${baseUrl}shop/addressController/setDefaultAddress`,                                                           // 设置默认地址
  updatePersonalInfo: `${baseUrl}shop/personalInfoManageController/updatePersonalInfo`,                                              // 修改个人信息
  getOrderList: `${baseUrl}shop/order/getOrderList`,                                                                                 // 获取订单列表
  cancleOrder: `${baseUrl}shop/order/cancleOrder`,                                                                                   // 取消订单
  deleteOrder: `${baseUrl}shop/order/deleteOrder`,                                                                                   // 删除订单
  getOrderDetail: `${baseUrl}shop/order/getOrderDetail`,                                                                             // 订单详情
  confirmRecieveGood: `${baseUrl}shop/order/confirmRecieveGoods`,                                                                    // 确认收货
  getMemberPoints: `${baseUrl}shop/memberAccountController/getMemberAccount`,                                                        // 获取积分信息
  calculateGoodsPoints: `${baseUrl}shop/order/calculateGoodsPoints`,                                                                 // 计算能得到多少积分
  uploadImg: `${baseUrl}shop/upload/uploadimg/mobileFile/image`,                                                                     // 图片上传
  addComment: `${baseUrl}shop/commentController/addComment`,                                                                         // 订单提交评论
  getCanRefundOrderList: `${baseUrl}shop/refundOrderController/getCanRefundOrderList`,                                               // 申请退款列表
  refundOrder: `${baseUrl}shop/refundOrderController/refundOrder`,                                                                   // 申请退款
  isLastRefundGoods: `${baseUrl}shop/refundOrderController/isLastRefundGoods`,                                                       // 申请退款时判断是否是最后一件商品
  getRefundOrderList: `${baseUrl}shop/refundOrderController/getRefundOrderList`,                                                     // 售后记录
  updateRefundOrderState: `${baseUrl}shop/refundOrderController/updateRefundOrderState`,                                             // 撤销申请
  getDefaultAddress: `${baseUrl}shop/addressController/getDefaultAddress`,                                                           // 获取默认收货地址
  getShop: `${baseUrl}shop/shopController/getShop`,                                                                                  // 获取免邮价格
  getShopFreeShipList: `${baseUrl}shop/shopController/getShopFreeShippingList`,                                                      // 根据店铺ID集合查询店铺免邮信息
  getLogisticsList: `${baseUrl}shop/logistics/list`,                                                                                 // 获取物流列表
  addOrder: `${baseUrl}shop/order/addOrder`,                                                                                         // 提交订单
  getOrderAmount: `${baseUrl}shop/order/getOrderAmount`,                                                                             // 获取订单总金额
  getMainOrderAmount: `${baseUrl}shop/order/getMainOrderAmount`,                                                                     // 获取订单总金额--一次提交多订单
  getMemberRuleDetailList: `${baseUrl}makerPrivilegeController/getMemberRuleDetailList`,                                             // 获取创客等级
  getMemberPointsDetailList: `${baseUrl}shop/memberAccountDetailController/getMemberPointsDetailList`,                               // 获取积分列表
  getOrderStatusStatic: `${baseUrl}shop/order/getOrderStatusStatic`,                                                                 // 获取各状态订单数
  getAttributeList: `${baseUrl}shop/shopController/getAttributeList`,                                                                // 获取主营业务
  applyShop: `${baseUrl}shop/shopController/applyShop`,                                                                              // 创建店铺
  getMemberShopStatus: `${baseUrl}shop/memberAccountController/getMemberShopStatus`,                                                 // 获取店铺审核状态
  wxPay: `${baseUrl}wxPay/pay`,                                                                                                      // 微信支付
  aliPay: `${baseUrl}aliPay/pay`,                                                                                                    // 支付宝支付
  unionPay: `${baseUrl}chinapayPay/payByB2C`,                                                                                        // 银联支付
  paySetting: `${baseUrl}paySetting/getPaySetting`,                                                                                  // 各种支付配置信息
  mainWxPay: `${baseUrl}wxPay/mainOrderPay`,                                                                                         // 微信支付多订单
  mainAliPay: `${baseUrl}aliPay/mainOrderPay`,                                                                                       // 支付宝支付多订单
  offlinePay: `${baseUrl}offlinePay/pay`,                                                                                            // 线下支付
  getPointsTotal: `${baseUrl}shop/bonuspoints/getPointsTotal`,                                                                       // 我的积分-总积分
  getPointsList: `${baseUrl}shop/bonuspoints/getPointsList`,                                                                         // 我的积分-积分列表
  isSetPayPassword: `${baseUrl}balancePay/isSetPaymentPassword`,                                                                     // 判断是否设置了交易密码
  // setPayPassword: `${baseUrl}shop/accountSetController/setOrUpdatePaymentPassword`,                                               // 设置交易密码
  setPayPassword: `${baseUrl}personalInfoController/setPaymentPassword`,                                                             // 设置交易密码
  updatePaymentPassword: `${baseUrl}personalInfoController/updatePaymentPassword`,                                                   // 修改交易密码
  balancePay: `${baseUrl}balancePay/pay`,                                                                                            // 余额支付
  integralPay: `${baseUrl}cashPointsPay/pay`,                                                                                        // 通用积分支付
  judgeIfSetmeat: `${baseUrl}shop/order/judgeIfSetmeat`,                                                                             // 判断是否存在套餐商品
  getWhetherBlancePayBySkus: `${baseUrl}shop/goods/getWhetherBlancePayBySkus`,                                                       // 是否支持余额支付
  getWhetherBlancePayByShareSku: `${baseUrl}shop/goods/getWhetherBlancePayByShareSku`,                                               // 被分享商品是否支持余额支付
  getApplyInfoListByCustomerId: `${baseUrl}shop/apply/getApplyInfoListByCustomerId`,                                                 // 获取合伙人升级数据
  getRuleList: `${baseUrl}shop/apply/getRuleList`,                                                                                   // 获取合伙人规则
  modifyPersonMe: `${baseUrl}personalInfoController/saveUser`,                                                                       // 修改性别和地区
  addApply: `${baseUrl}shop/apply/addApply`,                                                                                         // 提交申请
  realAuthentication: `${baseUrl}personalInfoController/validCard`,                                                                  // 实名认证
  getApplyList: `${baseUrl}shop/apply/getApplyList`,                                                                                 // 我的申请
  getApplyDetail: `${baseUrl}shop/apply/getApplyDetailById`,                                                                         // 我的申请详情
  recommendPartner: `${baseUrl}shop/apply/recommendPartner`,                                                                         // 推荐合伙人
  allSetMealList: `${baseUrl}column/allSetMealList`,                                                                                 // 套餐列表
  getSetMealSet: `${baseUrl}column/getSetMealSet`,                                                                                   // 套餐规则
  getNextDisRulelPoint: `${baseUrl}shop/disRuleController/getNextDisRulelPoint`,                                                     //  获取用户下一级积分
  getLogisticsMes: `${baseUrl}shop/logistics/logisticsTracesDetail`,                                                                 //  订单物流轨迹信息
  getInvitationInfo: `${baseUrl}login/getInvitationInfo`,                                                                            //  查询邀请人信息
  bandRecommendRelation: `${baseUrl}login/bindRecommendRelation`,                                                                    //  绑定邀请人接口
  upgradeSaveInfo: `${baseUrl}personalInfoController/saveUserInfo`,                                                                  //  升级保存用户基本信息
  getAppVersion: `${baseUrl}login/getAppVersion`,                                                                                    //  获取app版本信息
  getMeetingList: `${baseUrl}shop/meetingManage/getMeetingList`,                                                                     //  会议列表
  getTicketOrderList: `${baseUrl}shop/meetingManage/getTicketOrderList`,                                                             //  我的门票列表
  getMeetingDetail: `${baseUrl}shop/meetingManage/getMeetingDetail`,                                                                 //  获取会议详情
  addTicketsOrder: `${baseUrl}shop/meetingManage/addOrder`,                                                                          //  添加购票订单
  getMeetingOrderDetail: `${baseUrl}shop/meetingManage/getMeetingOrderDetail`,                                                       //  会议订单详情
  getShareThemeGoodsPage: `${baseUrl}shareTheme/getShareThemeGoodsPage`,                                                             //  推荐商品
  getShareMes: `${baseUrl}shareTheme/getDetail`,                                                                                     //  推荐信息
  immediatelyShare: `${baseUrl}shareTheme/immediatelyShare`,                                                                         //  立即分享
  getMetOrderDetailByTicketNo: `${baseUrl}shop/meetingManage/getMeetingOrderDetailByTicketNo`,                                       //  根据票号获取会议订单详情
  getSysDictionaryList: `${baseUrl}dictionary/getSysDictionaryList`,                                                                 //  积分来源数据字典
  getImageBase64ByUrl: `${baseUrl}mobileImg/upload/getImageBase64ByUrl`,                                                             //  根据图片URL转Base64
  getShareGoodsDetail: `${baseUrl}shop/goods/getShareGoodsDetail`,                                                                   //  被分享的商品详情
  getWhetherShareGoods: `${baseUrl}shop/goods/getWhetherShareGoods`,                                                                 //  商品是否是分享商品
  getGroupPage: `${baseUrl}shop/poster/getGroupPage`,                                                                                //  群名片列表
  getWelfareList: `${baseUrl}shareTheme/getGoldBeanGoodsPage`,                                                                       //  福利专区商品列表
  getPosterPage: `${baseUrl}shop/poster/getPosterPage`,                                                                              //  海报列表
  addGroup: `${baseUrl}shop/poster/addGroup`,                                                                                        //  新增群名片
  editGroup: `${baseUrl}shop/poster/editGroup`,                                                                                      //  编辑群名片
  getGroupDetail: `${baseUrl}shop/poster/getGroupDetail`,                                                                            //  群名片详情
  deleteGroup: `${baseUrl}shop/poster/deleteGroup`,                                                                                  //  删除群名片
  addshareLog: `${baseUrl}shop/poster/addshareLog`,                                                                                  //  保存分享记录
  decoderQRCode: `${baseUrl}shop/poster/decoderQRCode`,                                                                              //  解析二维码
  getXinRules: `${baseUrl}shareTheme/getGoldBeanRuleInfo`,                                                                           //  芯豆规则信息
  getXinGoodsList: `${baseUrl}shareTheme/getBuyGoldBeanGoods`,                                                                       //  芯豆购买的商品
  getGoldBeanNum: `${baseUrl}shareTheme/getGoldBeanNum`,                                                                             //  芯豆赠送
  startLottery: `${baseUrl}turn/startLottery`,                                                                                       //  大转盘抽奖
  getTurnDetail: `${baseUrl}turn/getTurnDetail`,                                                                                     //  大转盘详情
  getTurnWinPage: `${baseUrl}turn/getTurnWinPage`,                                                                                   //  我的奖品
  getSourceList: `${baseUrl}source/getSourceList`,                                                                                   //  素材列表
  getBaseInfoList: `${baseUrl}baseinfo/getBaseInfoList`,                                                                              //  首页基础设置
  getGroupDetailBySplice: `${baseUrl}group/getGroupDetail`,                                                                          //  拼团列表
  getGroupList: `${baseUrl}group/getGroupList`,                                                                                      //  商品拼团团主列表
  getGroupJoin: `${baseUrl}group/getGroupJoin`,                                                                                      //  参与拼团详情
  countGroupNum: `${baseUrl}group/countGroupNum`,                                                                                    //  拼单人
  getLevelOneInviterProfit: `${baseUrl}shop/order/getLevelOneInviterProfit`,                                                         //  分享赚多少钱
  getGoodsProductOriginsDetail: `${baseUrl}shop/goods/getGoodsProductOriginsDetail`,                                                 //  商品产品溯源
  getGoodsEnterpriseOriginsDetail: `${baseUrl}shop/goods/getGoodsEnterpriseOriginsDetail`,                                           //  商品企业溯源
  getGoodsPurchaseList: `${baseUrl}goodsGrabController/getGoodsGrabList`,                                                            //  抢购列表
  getGoodsPurchaseStatisticsData: `${baseUrl}shop/goodsPurchaseController/getGoodsPurchaseStatisticsData`,                           //  我的营业额统计
  getGoodsInfo: `${baseUrl}goodsPurchaseController/getGoodsInfo`,                                                                    //  根据商品id获取商品信息
  getGoodsPurchaseListpf: `${baseUrl}goodsPurchaseController/getGoodsPurchaseList`,                                                  //  批发列表
  getSalesQuotaData: `${baseUrl}shop/goodsPurchaseController/getMemberSalesData`,                                                    //  销售商品统计
  getGoodsBuyUserId: `${baseUrl}shop/goodsPurchaseController/getGoodsBuyUserId`,                                                     //  销售商品列表
  getPurchaseDes: `${baseUrl}goodsPurchaseController/getPurchaseDes`,                                                                //  收益说明及主题
  cancleGoodsSalse: `${baseUrl}goodsPurchaseController/cancleGoodsSalse`,                                                            //  取消售卖
  getMemberPurchaseCoupon: `${baseUrl}shop/goodsPurchaseController/getMemberPurchaseCoupon`,                                         //  我的批发券
  goodsHangPage: `${baseUrl}shop/goodsHang/goodsHangPage`,                                                                           //  挂售管理列表
  goodsSkuDetail: `${baseUrl}shop/goodsHang/goodsSkuDetail`,                                                                         //  提货订单确认页面商品信息
  getGoodsPurchaseOrderPayDetail: `${baseUrl}shop/goodsHang/getGoodsPurchaseOrderPayDetail`,                                         //  该商品支付金额
  goodsPurchaseOrderCancel: `${baseUrl}shop/goodsHang/goodsPurchaseOrderCancel`,                                                     //  取消挂售
  goodsPurchaseDelete: `${baseUrl}shop/goodsHang/goodsPurchaseDelete`,                                                               //  删除已挂售数据
  getGoodsGroupList: `${baseUrl}goodsPurchaseController/getGoodsGroupList`,                                                          //  获取活动商品分区列表
  getGoodsGroupDetail: `${baseUrl}goodsPurchaseController/getGoodsGroupDetail`,                                                      //  获取活动商品分区详情
  addAttInfoList: `${baseUrl}shop/buyAttInfoController/addAttInfoList`,                                                              //  发布商品
  getAttInfoList: `${baseUrl}buyAttInfoController/getAttInfoList`,                                                                   //  ATT易货区列表
  attCollect: `${baseUrl}shop/buyAttInfoController/attCollect`,                                                                      //  收藏商品
  updateCollectStatus: `${baseUrl}shop/buyAttInfoController/updateCollectStatus`,                                                    //  取消收藏
  validCard: `${baseUrl}shop/buyAttInfoController/validCard`,                                                                        //  身份认证
  getUserAttInfoList: `${baseUrl}shop/buyAttInfoController/getUserAttInfoList`,                                                      //  我发布的列表
  updateAttInfo: `${baseUrl}shop/buyAttInfoController/updateAttInfo`,                                                                //  编辑发布信息
  updateGoodsStarus: `${baseUrl}shop/buyAttInfoController/updateGoodsStarus`,                                                        //  下架
  getAttCollectList: `${baseUrl}shop/buyAttInfoController/getAttCollectList`,                                                        //  收藏列表
  getInvitationCode: `${baseUrl}buyAttInfoController/getInvitationCode`,                                                             //  ATT获取邀请码
  saveMerchant: `${baseUrl}shop/upgradePackageLogin/saveMerchant`,                                                                    //  商户认证上传
  getMerchant: `${baseUrl}shop/upgradePackageLogin/getMerchant`                                                                       //  获取商户认证状态
}
