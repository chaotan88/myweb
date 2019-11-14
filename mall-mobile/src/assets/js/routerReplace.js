function GetQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2]); return null
}
let shopId = GetQueryString('shopId') ? GetQueryString('shopId') : localStorage.getItem('shopId') ? localStorage.getItem('shopId') : 1
export var routerReplace = function (data) {
  if (data.hasOwnProperty('query')) {
    if (!data.query.hasOwnProperty('shopId') || !data.query.shopId) {
      data.query.shopId = shopId
    }
  } else {
    data.query = {shopId: shopId}
  }
  this.$router.replace(data)
}
