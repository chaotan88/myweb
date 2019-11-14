  /**
   * request请求封装
   * @url 接口网址
   * @resmethod 请求的方式  OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
   * @data 要传的数据对象
   * @return {Promise}    promise 返回promise供后续操作
  */
  $http (url, resmethod, data) {
    var promise = new Promise((resolve, reject) => {
      // 网络请求
      wx.request({
        url: url,
        data: data,
        method: resmethod,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: (res) => { // 服务器返回数据
          var pages = getCurrentPages()    // 获取加载的页面
          console.log(pages[pages.length - 1].route) // 当前页面的路由
          // wx.navigateTo({
          //   url: '/pages/login/login',
          // })
          if (res.data.res == 1) {
            resolve(res)
          } else { // 返回错误提示信息
            reject(res.data.msg)
          }
        },
        error: function (e) {

          wx.showToast({ title: e.data.result, icon: 'none', duration: 2000})
          // reject(e.data.result)
        }
      })
    })
    return promise
  },