// 全局变量
module.exports.global = {
  // 系统名称
  SYSTEM: 'distribution',

  // 用户信息
  USER_INFO: 'distributionUserInfo',

  // 路由历史数据(最多存储3条路由访问记录，用于判断是否第二次访问当前页面)
  HISTORY_ROUTE: 'distributionHistoryRoute',

  // 路由历史数据(存储上一个页面路由 + 当前路由)
  PREV_ROUTE: 'distributionPrevRoute',

  // 存储本地搜索条件名称
  FORM_DATA: 'distributionFormData',

  // 判断用户是否返回或前进操作
  POPSTATE: 'distributionPopstate',

  // 地址栏追加全局参数
  PARAMS: '?clientCode=4&versionNumber=v1.0&companyNo=PP008&belongSystem=8&token='
}

switch (process.env.NODE_ENV) {
  case 'production':
    module.exports.domain = { // 正式环境
      //ROOT_API: 'https://120.77.210.28/behinddistribute/distribute/',
      //ROOT_PUBLIC: 'https://120.77.210.28/behinddistribute/',
	   ROOT_API: 'http://passpay.andes-hub.com/behinddistribute/distribute/',    // 测试服
	 ROOT_PUBLIC: 'http://passpay.andes-hub.com/behinddistribute/',
      ROOT_IMG: 'https://120.77.210.28/'
    }
    break
  case 'testing':
    module.exports.domain = { // 测试环境
      //ROOT_API: 'https://120.77.210.28/behinddistribute/distribute/',    // 测试服
      //ROOT_PUBLIC: 'https://120.77.210.28/behinddistribute/',            // 测试服 - 登录
	  ROOT_API: 'http://passpay.andes-hub.com/behinddistribute/distribute/',    // 测试服
	 ROOT_PUBLIC: 'http://passpay.andes-hub.com/behinddistribute/',            // 测试服 - 登录
      ROOT_IMG: 'https://120.77.210.28/',
    }
    break
  default:
    module.exports.domain = { // 开发环境
      // ROOT_API: 'http://192.168.1.75:8380/passpay-distribute/distribute/',    // 凯哥
      // ROOT_PUBLIC: 'http://192.168.1.75:8380/passpay-distribute/',            // 凯哥

      // ROOT_API: 'http://192.168.1.124:8180/passpay-distribute/distribute/',    // 龙江
      // ROOT_PUBLIC: 'http://192.168.1.124:8180/passpay-distribute/',            // 龙江

      // ROOT_API: 'http://192.168.8.125:9096/passpay-distribute/distribute/',    // 少杰
      // ROOT_PUBLIC: 'http://192.168.8.125:9096/passpay-distribute/',            // 少杰

      //  ROOT_API: 'http://192.168.1.123:8089/passpay-distribute/distribute/',      // 李纳
      //  ROOT_PUBLIC: 'http://192.168.1.123:8089/passpay-distribute/',              // 李纳

      // ROOT_API: 'http://192.168.1.116:8502/passpay-distribute/distribute/',      // 李纳
      // ROOT_PUBLIC: 'http://192.168.1.116:8502/passpay-distribute/',              // 李纳

      // ROOT_API: 'http://192.168.1.68:8080/passpay-distribute/distribute/',     // 强哥
      // ROOT_PUBLIC: 'http://192.168.1.68:8080/passpay-distribute/',             // 强哥

    ROOT_API: 'http://passpay.andes-hub.com/behinddistribute/distribute/',    // 测试服
    ROOT_PUBLIC: 'http://passpay.andes-hub.com/behinddistribute/',            // 测试服 - 登录
      // ROOT_IMG: 'http://120.76.250.165/'
    }
}
