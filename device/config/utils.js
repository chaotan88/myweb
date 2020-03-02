if (process.env.NODE_ENV === 'production') {
  module.exports = {
    // 线上 域名 & API
    domain: {
      ROOT_API: 'http://120.79.45.3:8083/efamily-institution/',
      AROOT_API: 'http://120.79.45.3:8083/efamily-institution',
      UPLOAD_API: 'http://120.79.45.3:8083/efamily-institution/',
      ROOT_IMG: 'http://120.79.45.3'
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
    }
  }
}


