// 全局变量
module.exports.global = {
  // 系统名称
  SYSTEM: 'mallAdmin',

  // 用户信息
  USER_INFO: 'mallAdminUserInfo',

  // 路由历史数据(最多存储3条路由访问记录，用于判断是否第二次访问当前页面)
  HISTORY_ROUTE: 'mallAdminHistoryRoute',

  // 路由历史数据(存储上一个页面路由 + 当前路由)
  PREV_ROUTE: 'mallAdminPrevRoute',

  // 存储本地条件名称
  FORM_DATA: 'mallAdminFormData',

  // 判断用户是否返回或前进操作
  POPSTATE: 'mallAdminPopstate',

  // 地址栏追加全局参数
  PARAMS: '?clientCode=4&versionNumber=v1.0&companyNo=PP008&belongSystem=6&token='
}

switch (process.env.NODE_ENV) {
  case 'production':
    module.exports.domain = { // 正式环境
      ROOT_API: 'https://120.77.210.28/behindshopadmin/shopAdmin/',
      ROOT_PUBLIC: 'https://120.77.210.28/behindshopadmin/',
      ROOT_IMG: 'https://120.77.210.28/'
      // ROOT_API: 'http://yxss.andes-mall.com/behindshopadmin/shopAdmin/',
      // ROOT_PUBLIC: 'http://yxss.andes-mall.com/behindshopadmin/',
      // ROOT_IMG: 'http://yxss.andes-mall.com/'
    }
    break
  case 'testing':
    module.exports.domain = { // 测试环境
      ROOT_API: 'https://120.77.210.28/behindshopadmin/shopAdmin/',
      ROOT_PUBLIC: 'https://120.77.210.28/behindshopadmin/',
      ROOT_IMG: 'https://120.77.210.28/'
    }
    break
  default:
    module.exports.domain = { // 开发环境

      // ROOT_API: 'https://120.77.210.28/behindshopadmin/shopAdmin/',
      // ROOT_PUBLIC: 'https://120.77.210.28/behindshopadmin/',
      // ROOT_IMG: 'https://120.77.210.28/'
      ROOT_API: 'http://yxss.andes-mall.com/behindshopadmin/shopAdmin/',
      ROOT_PUBLIC: 'http://yxss.andes-mall.com/behindshopadmin/',
      ROOT_IMG: 'http://yxss.andes-mall.com/'
    }
}
