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
      // ROOT_API: 'https://www.lzmalls.cn/lzwlbehinddistribute/distribute/',    // 测试服
      // ROOT_PUBLIC: 'https://www.lzmalls.cn/lzwlbehinddistribute/',            // 测试服 - 登录
      // ROOT_IMG: 'https://www.lzmalls.cn/'
      ROOT_API: 'http://120.76.250.165/lzwlbehinddistribute/distribute/',    // 测试服
      ROOT_PUBLIC: 'http://120.76.250.165/lzwlbehinddistribute/',            // 测试服 - 登录
      ROOT_IMG: 'http://120.76.250.165/',
    }
    break
  case 'testing':
    module.exports.domain = { // 测试环境
      ROOT_API: 'http://120.76.250.165/lzwlbehinddistribute/distribute/',    // 测试服
      ROOT_PUBLIC: 'http://120.76.250.165/lzwlbehinddistribute/',            // 测试服 - 登录
      ROOT_IMG: 'http://120.76.250.165/',
    }
    break
  default:
    module.exports.domain = { // 开发环境
      ROOT_API: 'http://120.76.250.165/lzwlbehinddistribute/distribute/',    // 测试服
      ROOT_PUBLIC: 'http://120.76.250.165/lzwlbehinddistribute/',            // 测试服 - 登录
      ROOT_IMG: 'http://120.76.250.165/'
  }
}
