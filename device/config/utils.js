if (process.env.NODE_ENV === 'production') {
  module.exports = {
    // 线上 域名 & API
    domain: {
      // ROOT_API: 'http://8.208.13.39:8083/efamily-institution/',
      // AROOT_API: 'http://8.208.13.39:8083/efamily-institution',
      // UPLOAD_API: 'http://8.208.13.39:8083/efamily-institution/',
      // ROOT_IMG: 'http://8.208.13.39'

      ROOT_API: 'http://120.79.45.3:8083/efamily-institution/',
      AROOT_API: 'http://120.79.45.3:8083/efamily-institution',
      UPLOAD_API: 'http://120.79.45.3:8083/efamily-institution/',
      ROOT_IMG: 'http://120.79.45.3'   // 图片地址
    }
  }
} else {
  module.exports = {
    // 测试 域名 & API
    domain: {
      ROOT_API: 'http://120.79.45.3:8083/efamily-institution/',
      AROOT_API: 'http://120.79.45.3:8083/efamily-institution',
      UPLOAD_API: 'http://120.79.45.3:8083/efamily-institution/',
      ROOT_IMG: 'http://120.79.45.3'   // 图片地址
      // ROOT_API: 'http://8.208.13.39/efamily-institution/',
      // AROOT_API: 'http://8.208.13.39/efamily-institution',
      // UPLOAD_API: 'http://8.208.13.39/efamily-institution/',
      // ROOT_IMG: 'http://8.208.13.39'
    }
  }
}


