if (process.env.NODE_ENV === 'production') {
  module.exports = {
    // 线上 域名 & API
    domain: {
      // ROOT_API: 'http://ystadmin.linkedfarm.cn/admin/admin/',
      ROOT_API: 'http://120.79.46.116:8080/jtz-app/',
      AROOT_API: '',
      UPLOAD_API: '',
      ROOT_IMG: ''
    }
  }
} else {
  module.exports = {
    // 测试 域名 & API
    domain: {
      // ROOT_API: 'http://192.168.8.41:89/admin/',//yanhai
      // ROOT_API: 'http://192.168.8.87:8080/admin/',//yanglei
      // ROOT_API: 'http://192.168.8.68:8889/admin/',//本地
      // ROOT_API: 'http://192.168.8.93:8080/admin/admin/',//xubinling
      ROOT_API: 'http://120.79.46.116:8080/jtz-app/',//测试环境
      // ROOT_API: 'http://ystadmin.linkedfarm.cn/admin/admin/', //正式环境
      // ROOT_API: 'http://192.168.8.33:8082/admin/',//yy
      // ROOT_API: 'http://192.168.8.137:8081/buyb2c-admin/',
      AROOT_API: '',
      UPLOAD_API: '',
      ROOT_IMG: ''
    }
  }
}
