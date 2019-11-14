let baseUrl
if (process.env.NODE_ENV === 'production') {
  if (process.env.type === 'testing') {                       // 测试环境
    baseUrl = 'https://120.77.210.28/behindshop/'
    // baseUrl = 'www.e2w-p.com/behindshop/'
  } else {                                                    // 正式环境
    baseUrl = 'https://120.77.210.28/behindshop/'
  }
} else {
  // baseUrl = 'http://192.168.1.133:8084/passpay-shop/'      // 少杰
  // baseUrl = 'http://192.168.1.123:8088/passpay-shop/'      // 李娜
  // baseUrl = 'http://192.168.8.181:9998/passpay-shop/'      // 龙江
  // baseUrl = 'http://192.168.8.37:8080/passpay-shop/'       // 强哥
  // baseUrl = 'http://192.168.1.116:8200/passpay-shop/'      // 烤山鸡
  // baseUrl = 'http://192.168.1.75:8280/passpay-shop/'      // 谢凯
  // baseUrl = 'http://192.168.1.116:9080/passpay-shop/'      // 徐鹏
  baseUrl = 'https://120.77.210.28/behindshop/'       // 测试环境
  // baseUrl = 'http://192.168.1.75:8280/passpay-shop/'      // 谢凯
  // baseUrl = 'www.e2w-p.com/behindshop/'               // 上家演示环境
  // baseUrl = ' http://192.168.8.164:8088/passpay-shop/'   // 李娜
}
export default{
  purchaseOrder: `${baseUrl}shop/purchaseOrder/addOrder`,
  getSuperGroupGoodsList: `${baseUrl}supergroup/getSuperGroupGoodsList`,  // 拼团商品列表
  getSuperGroupIngList: `${baseUrl}supergroup/getSuperGroupIngList`,      // 拼团中列表
  getStartGroupInfo: `${baseUrl}supergroup/getStartGroupInfo`,            // 开团信息
  getSuperGroupDetail: `${baseUrl}supergroup/getSuperGroupDetail`,        // 拼团详情
  getGroupJoinInfo: `${baseUrl}supergroup/getGroupJoinInfo`,              // 参与拼团
  getHasGroupPeople: `${baseUrl}supergroup/getHasGroupPeople`,            // 已拼人数
  getGroupCampInfo: `${baseUrl}supergroup/getGroupCampInfo`,               // 团营信息
  getGroupCampList: `${baseUrl}supergroup/getGroupCampList`,               // 团营列表
  checkSperGroupInfo: `${baseUrl}supergroup/checkSperGroupInfo`,           // 校验能否开团
  couponPageList: `${baseUrl}shop/coupon/pageList`,                        // 优惠券列表
  resurrectionGroup: `${baseUrl}supergroup/resurrectionGroup`,            // 复活拼团
  etSuperGroupingGoodsId: `${baseUrl}supergroup/getSuperGroupingGoodsId`,
  getUserRank: `${baseUrl}shop/upgradePackageLogin/getUserRank`,
  etUpgradePackageGoodsGroupList: `${baseUrl}upgradePackageNoLogin/getUpgradePackageGoodsGroupList`, // 获取升级套餐专区
  getUpgradePackageGoodsList: `${baseUrl}upgradePackageNoLogin/getUpgradePackageGoodsList`, // 升级套餐商品列表
  saveAvatar: `${baseUrl}shop/upgradePackageLogin/saveAvatar`, // 头像上传
  getThemePresent: `${baseUrl}shop/upgradePackageLogin/getThemePresent` // 代言协议
}
