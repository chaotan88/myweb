// 全局变量
module.exports.global = {
  // 系统名称
  SYSTEM: 'operate',

  // 用户信息
  USER_INFO: 'operateUserInfo',

  // 路由历史数据(最多存储3条路由访问记录，用于判断是否第二次访问当前页面)
  HISTORY_ROUTE: 'operateHistoryRoute',

  // 路由历史数据(存储上一个页面路由 + 当前路由)
  PREV_ROUTE: 'operatePrevRoute',

  // 存储本地搜索条件名称
  FORM_DATA: 'operateFormData',

  // 判断用户是否返回或前进操作
  POPSTATE: 'operatePopstate',

  // 地址栏追加全局参数
  PARAMS: '?clientCode=4&versionNumber=v1.0&companyNo=PP008&belongSystem=7&token='
}

switch (process.env.NODE_ENV) {
  case 'production':
    module.exports.domain = { // 正式环境
      ROOT_API: 'https://120.77.210.28/behindshopadmin/shopAdmin/',
      ROOT_PUBLIC: 'https://120.77.210.28/behindshopadmin/',
      ROOT_IMG: 'https://120.77.210.28/'
    }
    break
  case 'testing':
    module.exports.domain = { // 测试环境

 //     新测试环境：
 //   域名 test.zxtx315.com
 //   上传账号：andes
 //   密码：baishibei123
 //   ip: 120.78.199.90   端口：22

      ROOT_API: 'https://120.77.210.28/behindshopadmin/shopAdmin/',
      ROOT_PUBLIC: 'https://120.77.210.28/behindshopadmin/',
      ROOT_IMG: 'https://120.77.210.28/'
    }
    break
  case 'uat':
    module.exports.domain = { // uat

      ROOT_API: 'https://120.77.210.28/behindshopadmin/shopAdmin/',    // 测试服-后
      ROOT_PUBLIC: 'https://120.77.210.28/behindshopadmin/',           // 测试服 - 登录
      ROOT_IMG: 'https://120.77.210.28/',
    }
    break
  default:
    module.exports.domain = { // 开发环境

      // ROOT_API: 'http://192.168.1.124:9999/passpay-shop-admin/shopAdmin/',     // 龙江
      // ROOT_PUBLIC: 'http://192.168.1.124:9999/passpay-shop-admin/',            // 龙江

      // ROOT_API: 'http://192.168.1.133:9093/passpay-shop-admin/shopAdmin/',     // 少杰
      // ROOT_PUBLIC: 'http://192.168.1.133:9093/passpay-shop-admin/',            // 少杰

      // ROOT_API: 'http://192.168.1.123:8087/passpay-shop-admin/shopAdmin/',     // 李纳
      // ROOT_PUBLIC: 'http://192.168.1.123:8087/passpay-shop-admin/',            // 李纳

       // ROOT_API: 'http://192.168.1.116:8202/passpay-shop-admin/shopAdmin/',    // 徐鹏
       // ROOT_PUBLIC: 'http://192.168.1.116:8202/passpay-shop-admin/',           // 徐鹏

      // ROOT_API: 'http://192.168.1.75:8180/passpay-shop-admin/shopAdmin/',      // 谢凯
      // ROOT_PUBLIC: 'http://192.168.1.75:8180/passpay-shop-admin/',             // 谢凯

      // ROOT_API: 'http://192.168.1.135:8080/passpay-shop-admin/shopAdmin/',     // 强哥
      // ROOT_PUBLIC: 'http://192.168.1.135:8080/passpay-shop-admin/',            // 强哥
      //
      //
       ROOT_API: 'http://192.168.1.116:8202/passpay-shop-admin/shopAdmin/',     // 强哥
       ROOT_PUBLIC: 'http://192.168.1.116:8202/passpay-shop-admin/shopAdmin/',            // 强哥
      ROOT_API: 'http://192.168.1.176:8180/passpay-shop-admin/shopAdmin/',      // 谢凯
      ROOT_PUBLIC: 'http://192.168.1.176:8180/passpay-shop-admin/',             // 谢凯


      ROOT_API: 'https://120.77.210.28/behindshopadmin/shopAdmin/',    // 测试服-后
      ROOT_PUBLIC: 'https://120.77.210.28/behindshopadmin/',           // 测试服 - 登录
      ROOT_IMG: 'http://120.77.210.28/',

      ROOT_API: 'http://120.77.210.28/behindshopadmin/shopAdmin/',     // 测试服
      ROOT_PUBLIC: 'http://120.77.210.28/behindshopadmin/',            // 测试服 - 登录
      ROOT_IMG: 'http://192.168.1.116:8202/passpay-shop-admin/',

      // ROOT_API: 'http://www.e2w-p.com/behindsho//padmin/shopAdmin/',            // uat
      // ROOT_PUBLIC: 'http://www.e2w-p.com/behindshopadmin/',                     // uat - 登录
      // ROOT_IMG: 'http://www.e2w-p.com/'

    }
}
