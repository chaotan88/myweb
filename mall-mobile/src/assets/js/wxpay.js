import wx from 'weixin-js-sdk'
export var wexinPay = function (data, buyType) {
  wx.config({
    debug: false,
    appId: data.appid,
    timestamp: data.timeStamp, // timestamp,
    nonceStr: data.nonce_str,
    signature: data.paySign,
    jsApiList: ['chooseWXPay']
  })
  wx.ready(function () {
    wx.checkJsApi({
      jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
      success: function (res) {
        // 以键值对的形式返回，可用的api值true，不可用为false
        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
      }
    })
    wx.chooseWXPay({
      timestamp: data.timeStamp, // timestamp,
      nonceStr: data.nonce_str,
      package: 'prepay_id=' + data.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: 'MD5',
      paySign: data.paySign,
      success: function (res) {
        window.location.href = window.location.href.match(/.*mshop/gi)[0] + '/paySuccess?buyType=' + buyType
      }
    })
  })
}
