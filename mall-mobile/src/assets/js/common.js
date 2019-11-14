(function (doc, win) {
  var docEl = doc.documentElement
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  var recalc = function () {
    var clientWidth = docEl.clientWidth > 750 ? 750 : docEl.clientWidth <= 320 ? 320 : docEl.clientWidth
    if (!clientWidth) return
    // alert(clientWidth, 'clientWidth')
    docEl.style.fontSize = (clientWidth / 750 * 100).toFixed(2) + 'px'
    let fontSize = parseInt(100 * (clientWidth / 750))
    localStorage.setItem('fontSize', fontSize)
    correctPx()
  }
  var correctPx = function () {
    var docEl = document.documentElement
    var clientWidth = docEl.clientWidth > 750 ? 750 : docEl.clientWidth <= 320 ? 320 : docEl.clientWidth
    var div = document.createElement('div')
    div.style.width = '1.4rem'
    div.style.height = '0'
    document.body.appendChild(div)
    var ideal = 140 * clientWidth / 750
    var rmd = (div.clientWidth / ideal)
    if (rmd > 1.2 || rmd < 0.8) {
      docEl.style.fontSize = 100 * (clientWidth / 750) / rmd + 'px'
      document.body.removeChild(div)
    }
  }
  recalc()
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
})(document, window)
// (function (D) {
//   let self = {}
//   self.resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
//   self.Html = D.getElementsByTagName('html')[0]
//   self.widthProportion = function () {
//     var p = Number(((D.body && D.body.clientWidth) || self.Html.offsetWidth) / 750).toFixed(3)
//     return p > 1.067 ? 1.067 : p < 0.444 ? 0.444 : p
//   }
//   self.changePage = function () {
//     self.Html.setAttribute('style', 'font-size:' + self.widthProportion() * 100 + 'px')
//     self.correctPx()
//   }
//   self.correctPx = function () {
//     var docEl = document.documentElement
//     var clientWidth = docEl.clientWidth
//     if (!clientWidth || clientWidth > 768) return
//     var div = document.createElement('div')
//     div.style.width = '1.4rem'
//     div.style.height = '0'
//     document.body.appendChild(div)
//     var ideal = 140 * clientWidth / 720
//     var rmd = (div.clientWidth / ideal)
//     console.log(rmd, 'rmd')
//     if (rmd > 1.2 || rmd < 0.8) {
//       docEl.style.fontSize = 100 * (clientWidth / 720) / rmd + 'px'
//       document.body.removeChild(div)
//     }
//   }
//   self.changePage()
//   if (!document.addEventListener) return
//   window.addEventListener(self.resizeEvt, self.changePage, false)
//   document.addEventListener('DOMContentLoaded', self.changePage, false)
// })(document)
