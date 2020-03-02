/* eslint-disable*/
exports.install = function (Vue, options) {
  // 1.应用场景
  Vue.prototype.appScenarioFun = function (v) {
    if (v) {
      let statusArr = ['机场', '高铁', '商场', '客运站']
      return statusArr[v - 1]
    }
  }
  // 2.屏幕款式
  Vue.prototype.screenStypeFun = function (v) {
    if (v) {
      let statusArr = ['落地式（60寸）', '橱窗式（60寸）', '镜面式（60寸）', '悬挂式（32寸）']
      return statusArr[v - 1]
    }
  }

  // 3.横竖屏-点选框
  Vue.prototype.screenSplitFun = function (v) {
    if (v) {
      let statusArr = ['横屏', '竖屏']
      return statusArr[v - 1]
    }
  }
  // 横竖屏-点选框 (下标)
  Vue.prototype.screenSplitIndexFun = function (v) {
    if (v) {
      let statusArr = ['横屏', '竖屏']
      return statusArr.indexOf(v) + 1
    }
  }

  // 4.屏幕栏数-点选框
  Vue.prototype.screenColumnFun = function (v) {
    if (v) {
      let statusArr = ['一栏', '二栏', '三栏', '四栏', '五栏']
      return statusArr[v - 1]
    }
  }
  // 屏幕栏数-点选框 (下标)
  Vue.prototype.screenColumnIndexFun = function (v) {
    if (v) {
      let statusArr = ['一栏', '二栏', '三栏', '四栏', '五栏']
      return statusArr.indexOf(v) + 1
    }
  }

  // 5.是否上架-点选框
  Vue.prototype.isshelvesFun = function (v) {
    if (v) {
      let statusArr = ['是', '否']
      return statusArr[v - 1]
    }
  }

  // 5.查账状态-点选框
  Vue.prototype.auditStatusFun = function (v) {
    if (v) {
      let statusArr = ['待查账', '核查已到账', '核查未到账']
      return statusArr.indexOf(v) + 1
    }
  }

  // 5.合同状态-点选框
  Vue.prototype.contractStatusFun = function (v) {
    if (v) {
      let statusArr = ['待审核', '审核通过', '审核不通过', '已签署']
      return statusArr.indexOf(v) + 1
    }
  }
  Vue.prototype.setCookie = function (name, value) {
    var Days = 30
    var exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
    document.cookie = name + '='+ escape (value) + ';expires=' + exp.toGMTString()
  }
  Vue.prototype.getCookie = function (name) {
    var arr, reg=new RegExp('(^| )'+name+'=([^;]*)(;|$)')
    if(arr=document.cookie.match(reg))
    return unescape(arr[2])
    else
    return null
  }
  Vue.prototype.delCookie = function (name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = this.getCookie(name)
    if(cval!=null)
    document.cookie= name + '='+cval+';expires='+exp.toGMTString()
  }
}
