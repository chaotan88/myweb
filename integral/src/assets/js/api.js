let baseUrl, imgUrl, pageUrl, paySuccessUrl
if (process.env.NODE_ENV === 'production') { // 线上环境
  // 测试环境
  if (process.env.type === 'testing') {
    baseUrl = 'https://120.77.210.28/behindpoints/'
    imgUrl = 'https://120.77.210.28/'
    pageUrl = 'https://120.77.210.28/points'
    paySuccessUrl = '120.77.210.28'
  // 正式环境
  } else {
    baseUrl = 'https://120.77.210.28/behindpoints/'
    imgUrl = 'https://120.77.210.28/'
    pageUrl = 'https://120.77.210.28/points'
    paySuccessUrl = '120.77.210.28'
  }
} else { // 本地环境
  imgUrl = 'http://120.77.210.28/'
  pageUrl = 'http://120.77.210.28/points'
  paySuccessUrl = '120.77.210.28'
  // baseUrl = 'http://192.168.8.125:9097/passpay-points/'     // 少杰
  // baseUrl = 'http://192.168.1.123:8092/passpay-points/'     // 李娜
  // baseUrl = 'http://192.168.1.124:8080/passpay-points/'     // 龙江
  // baseUrl = 'http://192.168.1.68:8080/passpay-points/'     // 强哥
  // baseUrl = 'http://192.168.1.75:8480/passpay-points/'     // 谢凯
  baseUrl = 'http://120.77.210.28/behindpoints/'   // 测试
}
export default{
  imgUrl: imgUrl,                                                                          // 图片地址
  pageUrl: pageUrl,                                                                        // 域名地址
  baseUrl: baseUrl,                                                                        // 域名地址
  paySuccessUrl: paySuccessUrl,                                                            // 支付成功跳转域名
  ERR_OK: '1',                                                                             // 请求成功状态码
  getCode: `${baseUrl}accountSetController/getValidWord`,                                  // 获取验证码
  checkCode: `${baseUrl}accountSetController/checkVerifyCode`,                             // 检测验证码是否一致
  modifyPhone: `${baseUrl}accountSetController/updatePhone`,                               // 修改手机号码
  register: `${baseUrl}login/register`,                                                    // 注册
  resetPassword: `${baseUrl}login/resetPassword`,                                          // 重置密码
  login: `${baseUrl}login/login`,                                                          // 登录
  logout: `${baseUrl}login/logout`,                                                        // 退出登录
  getContent: `${baseUrl}cotentController/getContent`,                                     // 协议和售后服务
  getOrderAmount: `${baseUrl}points/apply/getOrderAmount`, // 获取订单总金额
  wxPay: `${baseUrl}wxPay/pay`,                                                            // 微信支付
  aliPay: `${baseUrl}aliPay/pay`,                                                          // 支付宝支付
  mainWxPay: `${baseUrl}wxPay/mainOrderPay`,                                               // 微信支付多订单
  mainAliPay: `${baseUrl}aliPay/mainOrderPay`,                                             // 支付宝支付多订单
  offlinePay: `${baseUrl}offlinePay/pay`,                                                  // 线下支付
  updateApplyPayVoucher: `${baseUrl}points/apply/updateApplyPayVoucher`,                   // 重新上传凭证
  uploadImg: `${baseUrl}shop/upload/uploadimg/mobileFile/image`,                           // 图片上传
  isSetPayPassword: `${baseUrl}offlinePay/isSetPaymentPassword`, // 判断是否设置了交易密码
  setPayPassword: `${baseUrl}accountSetController/setPaymentPassword`,                     // 设置交易密码
  resetPayPassword: `${baseUrl}accountSetController/updatePaymentPassword`,                // 重置交易密码
  isRegister: `${baseUrl}login/checkPhoneExist`,                                           // 判断是否重复注册
  balancePay: `${baseUrl}offlinePay/pay`, // 余额支付
  getMemberPoints: `${baseUrl}points/memberAccountController/getMemberAccount`,            // 获取积分信息
  updatePass: `${baseUrl}accountSetController/updatePass`,                                 // 修改密码
  updatePhone: `${baseUrl}accountSetController/updatePhone`,                               // 修改手机号码
  personalInfo: `${baseUrl}accountSetController/viewUser`,                                 // 获取用户信息
  updatePersonalInfo: `${baseUrl}accountSetController/saveUser`,                           // 保存用户信息
  judgeIfSetmeat: `${baseUrl}points/order/judgeIfSetmeat`,                                 // 判断是否存在套餐商品
  getApplyInfoListByCustomerId: `${baseUrl}points/apply/getApplyInfoListByCustomerId`,     // 获取合伙人升级数据
  getRuleList: `${baseUrl}points/apply/getRuleList`,                                       // 获取合伙人规则
  modifyPersonMe: `${baseUrl}accountSetController/saveUser`,                               // 修改性别和地区
  getApplyStatus: `${baseUrl}points/apply/getApplyStatus`,                                 // 获取升级状态
  addApply: `${baseUrl}points/apply/addApply`,                                             // 提交申请
  realAuthentication: `${baseUrl}accountSetController/validCard`,                          // 实名认证
  getApplyList: `${baseUrl}points/apply/getApplyList`,                                     // 我的申请
  getApplyDetail: `${baseUrl}points/apply/getApplyDetailById`,                             // 我的申请详情
  recommendPartner: `${baseUrl}points/apply/recommendPartner`,                             // 推荐合伙人
  getInfomationList: `${baseUrl}points/info/getInfomationList`,                            // 消息列表
  getProFitTotal: `${baseUrl}points/profit/getProFitTotal`,                                // 我的收益统计
  getProfitInfoList: `${baseUrl}points/profit/getProfitInfoList`,                          // 我的收益列表
  isSetPaymentPassword: `${baseUrl}offlinePay/isSetPaymentPassword`, // 是否设置了交易密码
  withdrawalApply: `${baseUrl}points/disWithdrawalManageController/withdrawalApply`,       // 提现申请
  getUserBalance: `${baseUrl}points/disWithdrawalManageController/getUserBalance`,         // 我的余额
  getSettleSet: `${baseUrl}points/disWithdrawalManageController/getSettleSet`,             // 提现比例
  checkPassword: `${baseUrl}accountSetController/checkPaymentPassword`,                    // 校验支付密码
  checkInvitCode: `${baseUrl}login/getInvitationInfo`,                                      // 校验支付密码
  saveCard: `${baseUrl}points/card/saveCard`,                                               // 保存银行卡
  getCardList: `${baseUrl}points/card/getCardList`,                                         // 获取银行卡
  delCard: `${baseUrl}points/card/delCard`,                                                 // 删除银行卡
  getUserPoints: `${baseUrl}points/disPointsReportManageController/getUserPoints`,           // 查询报表
  recharge: `${baseUrl}points/rechargeController/recharge`,                                 // 提交充值订单
  rechargeWxPay: `${baseUrl}rechargeWxPay/pay`,                                              // 微信支付
  rechargeAliPay: `${baseUrl}rechargeAliPay/pay`,                                            // 阿里支付
  rechargeCashPay: `${baseUrl}rechargeCashPay/pay`,                                           // 通用积分支付
  rechargeOfflinePay: `${baseUrl}rechargeOfflinePay/pay`,                                           // 线下支付
  getRechargeRuleList: `${baseUrl}points/rechargeController/getRechargeRuleList`,            // 获取充值规则列表
  getSysDictionaryList: `${baseUrl}points/dictionary/getSysDictionaryList`,                  //  积分来源数据字典
  getOrderStaus: `${baseUrl}points/order/getOrderPayStaus`,
  getTransferUserByPhone: `${baseUrl}points/transfer/getTransferUserByPhone`,                 //  转赠搜索好友
  transferProperty: `${baseUrl}points/transfer/transferProperty`,                             //  转赠资产
  getRechareProperty: `${baseUrl}points/apply/getRechareProperty`,                               //  获取需要充值的资产数量
  ifPassword: `${baseUrl}offlinePay/isSetPaymentPassword`,                                       // 判断是否设置支付密码
  saveAlipay: `${baseUrl}points/card/saveAlipay`,                                                 // 保存支付宝
  updateAlipay: `${baseUrl}points/card/updateAlipay`                                                 // 修改支付宝
}
