const {
  global,
  domain
} = require('../../config/utils')
const dateFns = require('date-fns')

module.exports = {
  /**
   * 判断是否同一模块，带出搜索记录
   * @param  {[type]}   str      [路由模块]
   * @param  {[type]}   number   [匹配路由记录条数，非必填]
   * @param  {Function} callback [回调]
   */
 // filterSearchData (str, number, callback) {
 //   if (!str) return false
 //   let resolve = null
 //   let isQuery = null
 //   // 第二个参数为函数时设置为回调
 //   if (typeof number === 'function') {
 //     resolve = number
 //     isQuery = 3
 //   } else {
 //     resolve = callback
 //     isQuery = number
 //   }
 //   if (this.filterSamePage(isQuery) || this.filterSameModule(str)) {
 //     let getCondition = JSON.parse(localStorage.getItem(global.FORM_DATA))
 //     if (getCondition && resolve) resolve(getCondition)
 //   } else {
 //     localStorage.removeItem(global.FORM_DATA)
 //   }
 // },

  /**
   * 判断是否同一模块，带出搜索记录
   * @param  {[type]}   urls     [路由模块]
   * @param  {[type]}   number   [匹配路由记录条数，非必填]
   * @param  {Function} callback [回调]
   */
  filterSearchData (urls, number, callback) {
    if (!urls) return false
    let resolve = null
    let isQuery = null
    // 第二个参数为函数时设置为回调
    if (typeof number === 'function') {
      resolve = number
      isQuery = 3
    } else {
      resolve = callback
      isQuery = number
    }
    let filterSameModule = false
    // 过滤路由模块单个或多个
    if (Array.isArray(urls)) {
      urls.forEach((row) => {
        if (this.filterSameModule(row)) filterSameModule = true
      })
    } else {
      filterSameModule = this.filterSameModule(urls)
    }
    if (filterSameModule || this.filterSamePage(isQuery)) {
      let getCondition = JSON.parse(localStorage.getItem(global.FORM_DATA))
      if (getCondition && resolve) resolve(getCondition)
    } else {
      localStorage.removeItem(global.FORM_DATA)
    }
  },

  /**
   * 判断是否相同页面
   */
  filterSamePage (number) {
    let historyRoute = JSON.parse(localStorage.getItem(global.HISTORY_ROUTE)) || []
    let res = false
    if (parseInt(number) === 2 && historyRoute[historyRoute.length - 1].path === historyRoute[historyRoute.length - 2].path) {
      res = true
    } else if (parseInt(number) === 3 && historyRoute[0].path === historyRoute[1].path && historyRoute[1].path === historyRoute[2].path) {
      res = true
    }
    if (!res) localStorage.removeItem(global.FORM_DATA)
    return res
  },

  /**
   * 判断是否相同模块
   */
  filterSameModule (str) {
    let prevRoute = JSON.parse(localStorage.getItem(global.PREV_ROUTE)) || []
    let res = prevRoute.length === 2 && prevRoute[0].path.match(new RegExp(str, 'gi')) ? !!true : !!false
    return res
  },

  /**
   * 导出列表数据到Excel
   */
  exportTableToExcel (fieldName, tableData) {
    let uri = 'data:application/vnd.ms-excel;base64,'
    let template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
      'xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>' +
      '<x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>' +
      '</x:ExcelWorkbook></xml><![endif]-->' +
      ' <style type="text/css">' +
      'table th {' +
      'width: 180px;' +
      'height: 30px;' +
      'text-align: center;' +
      'border-left: 1px solid #e5e5e5;' +
      'padding: 0 20px' +
      'background-color: #eee;' +
      'color: #333;' +
      ' }' +
      'table td {' +
      'height: 30px;' +
      'text-align: center;' +
      'color: #333;' +
      ' }' +
      '</style>' +
      '</head><body ><table class="excelTable"> ' + this.createExcelTable(fieldName, tableData) + ' </table></body></html>'
    let ctx = {
      worksheet: '下载模版' || 'Worksheet',
      table: template
    }
    window.location.href = uri + this.base64(this.excelTableFormat(template, ctx))
  },

  /**
   * 获取当前月份多少天
   */
  getDaysInMonth (year, month) {
    month = parseInt(month, 10)  // parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
    var temp = new Date(year, month, 0)
    return temp.getDate()
  },

  /**
   * base64转码
   */
  base64 (s) {
    return window.btoa(unescape(encodeURIComponent(s)))
  },

  /**
   * 格式table数据
   */
  excelTableFormat (s, c) {
    return s.replace(/{(\w+)}/g,
      function (m, p) {
        return c[p]
      })
  },

  /**
   * 创建表格数据
   */
  createExcelTable (tableFieldName, tableData) {
    if (!tableFieldName.length || !tableData.length) return false
    let thGroup = ''
    let tdGroup = ''
    tableFieldName.forEach((row) => {
      thGroup += ('<th>' + row.title + '</th>')
    })
    tableData.forEach((row) => {
      tdGroup += '<tr>'
      tableFieldName.forEach((list) => {
        tdGroup += ('<td>' + row[list.key] + '</td>')
      })
      tdGroup += '</tr>'
    })
    let res = '<tr>' + thGroup + '</tr>' + tdGroup
    return res
  },

  /**
   * 校验身份证
   */
  // filterIdCard (idcard) {
  //   var Errors = [
  //     true,
  //     // '验证通过!',
  //     '身份证号码位数不对!',
  //     '身份证号码出生日期超出范围或含有非法字符!',
  //     '身份证号码校验错误，请查验后重新输入！',
  //     '身份证地区非法!'
  //   ]
  //   var area = {
  //     11: '北京',
  //     12: '天津',
  //     13: '河北',
  //     14: '山西',
  //     15: '内蒙古',
  //     21: '辽宁',
  //     22: '吉林',
  //     23: '黑龙江',
  //     31: '上海',
  //     32: '江苏',
  //     33: '浙江',
  //     34: '安徽',
  //     35: '福建',
  //     36: '江西',
  //     37: '山东',
  //     41: '河南',
  //     42: '湖北',
  //     43: '湖南',
  //     44: '广东',
  //     45: '广西',
  //     46: '海南',
  //     50: '重庆',
  //     51: '四川',
  //     52: '贵州',
  //     53: '云南',
  //     54: '西藏',
  //     61: '陕西',
  //     62: '甘肃',
  //     63: '青海',
  //     64: '宁夏',
  //     65: '新疆',
  //     71: '台湾',
  //     81: '香港',
  //     82: '澳门',
  //     91: '国外'
  //   }
  //   // var retflag = false
  //   var Y, JYM
  //   var S, M, ereg
  //   var idcardArray = []
  //   idcardArray = idcard.split('')
  //   // 地区检验
  //   if (area[parseInt(idcard.substr(0, 2))] === null) return Errors[4]
  //   // 身份号码位数及格式检验
  //   switch (idcard.length) {
  //     case 15:
  //       if (((((parseInt(idcard.substr(6, 2)) + 1900) % 4) === 0) || ((((parseInt(idcard.substr(6, 2)) + 1900) % 100) === 0) && ((parseInt(idcard.substr(6, 2)) + 1900) % 4) === 0))) {
  //         ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/ // 测试出生日期的合法性
  //       } else {
  //         ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/ // 测试出生日期的合法性
  //       }
  //       if (ereg.test(idcard)) {
  //         return Errors[0]
  //       } else {
  //         return Errors[2]
  //       }
  //     case 18:
  //       // 18位身份号码检测
  //       // 出生日期的合法性检查
  //       // 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
  //       // 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
  //       if ((parseInt(idcard.substr(6, 4)) % 4) === 0 || ((parseInt(idcard.substr(6, 4)) % 100) === 0 && (parseInt(idcard.substr(6, 4)) % 4) === 0)) {
  //         ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/ // 闰年出生日期的合法性正则表达式
  //       } else {
  //         ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/ // 平年出生日期的合法性正则表达式
  //       }
  //       console.log('18 test idcard: ', ereg.test(idcard))
  //       if (ereg.test(idcard)) { // 测试出生日期的合法性
  //         console.log('test idcard: ', idcard)
  //         // 计算校验位
  //         S = (parseInt(idcardArray[0]) + parseInt(idcardArray[10])) * 7 + (parseInt(idcardArray[1]) + parseInt(idcardArray[11])) * 9 + (parseInt(idcardArray[2]) + parseInt(idcardArray[12])) * 10 + (parseInt(idcardArray[3]) + parseInt(idcardArray[13])) * 5 + (parseInt(idcardArray[4]) + parseInt(idcardArray[14])) * 8 + (parseInt(idcardArray[5]) + parseInt(idcardArray[15])) * 4 + (parseInt(idcardArray[6]) + parseInt(idcardArray[16])) * 2 + parseInt(idcardArray[7]) * 1 + parseInt(idcardArray[8]) * 6 + parseInt(idcardArray[9]) * 3
  //         Y = S % 11
  //         M = 'F'
  //         JYM = '10X98765432'
  //         M = JYM.substr(Y, 1) // 判断校验位
  //         if (M === idcardArray[17]) {
  //           console.log('if idcard: ', idcard, Errors[0])
  //           return Errors[0] // 检测ID的校验位
  //         } else {
  //           console.log('else idcard: ', idcard, Errors[3])
  //           return Errors[3]
  //         }
  //       } else {
  //         return Errors[2]
  //       }
  //     case 8:
  //       return this.IsHKID(idcard)
  //     case 10:
  //       return this.isTWID(idcard)
  //     default:
  //       // console.log('Errors: ', Errors[1])
  //       return Errors[1]
  //   }
  // },

  filterIdCard (idcard) {
    return this.IdCardValidate(idcard)
  },

  IdCardValidate (idCard) {
    idCard = idCard.replace(/ /g, '')
    if (idCard.length !== 15 && idCard.length !== 18) return false
    console.log('idCard: ', idCard)
    if (idCard.length === 15) {
      return this.isValidityBrithBy15IdCard(idCard)
    } else if (idCard.length === 18) {
      var aIdCard = idCard.split('')
      if (this.isValidityBrithBy18IdCard(idCard) && this.isTrueValidateCodeBy18IdCard(aIdCard)) {
        return true
      } else {
        return false
      }
    }
    return true
  },

  // 判断身份证号18位时最后一位是否正确
  isTrueValidateCodeBy18IdCard (aIdCard) {
    var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // ⾝身份证验证位值.10代表X
    var yinzi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1] // 加权因⼦子
    var sum = 0
    if (aIdCard[17].toLowerCase() === 'x') {
      aIdCard[17] = 10
    }
    for (var i = 0; i < 17; i++) {
      sum += yinzi[i] * aIdCard[i]
    }
    var valCodePosition = sum % 11
    if (parseInt(aIdCard[17]) === ValideCode[valCodePosition]) {
      return true
    } else {
      return false
    }
  },

  isValidityBrithBy18IdCard (idCard18) {
    var year = idCard18.substring(6, 10)
    var month = idCard18.substring(10, 12)
    var day = idCard18.substring(12, 14)
    var tempDate = new Date()
    tempDate.setYear(year)
    tempDate.setMonth(parseInt(month, 10) - 1)
    tempDate.setDate(parseInt(day, 10))
    if (tempDate.getFullYear() !== parseInt(year, 10) || tempDate.getMonth() !== parseInt(month, 10) - 1 || tempDate.getDate() !== parseInt(day, 10)) {
      return true
    } else {
      return true
    }
  },

  isValidityBrithBy15IdCard (idCard15) {
    let ereg = ''
    if (((((parseInt(idCard15.substr(6, 2)) + 1900) % 4) === 0) || ((((parseInt(idCard15.substr(6, 2)) + 1900) % 100) === 0) && ((parseInt(idCard15.substr(6, 2)) + 1900) % 4) === 0))) {
      ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/ // 测试出生日期的合法性
    } else {
      ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/ // 测试出生日期的合法性
    }
    if (ereg.test(idCard15)) {
      return true
    } else {
      return false
    }
    // var year = idCard15.substring(6, 8)
    // var month = idCard15.substring(8, 10)
    // var day = idCard15.substring(10, 12)
    // var tempDate = new Date()
    // tempDate.setYear(year)
    // tempDate.setMonth(parseInt(month, 10) - 1)
    // tempDate.setDate(parseInt(day, 10))
    // if (tempDate.getYear() !== parseInt(year, 10) || tempDate.getMonth() !== parseInt(month, 10) - 1 || tempDate.getDate() !== parseInt(day, 10)) {
    //   return true
    // } else {
    //   return true
    // }
  },

  /**
   * 港澳身份证
   */
  IsHKID (str) {
    var strValidChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    // basic check length
    if (str.length < 8) return '身份证号码位数不对'
    // handling bracket
    if (str.charAt(str.length - 3) === '(' && str.charAt(str.length - 1) === ')') {
      str = str.substring(0, str.length - 3) + str.charAt(str.length - 2)
    }
    // convert to upper case
    str = str.toUpperCase()
    // regular expression to check pattern and split
    var hkidPat = /^([A-Z]{1,2})([0-9]{6})([A0-9])$/
    var matchArray = str.match(hkidPat)
    // not match, return false
    if (matchArray === null) return '身份证号码校验错误，请查验后重新输入！'
    // the character part, numeric part and check digit part
    var charPart = matchArray[1]
    var numPart = matchArray[2]
    var checkDigit = matchArray[3]
    // calculate the checksum for character part
    var checkSum = 0
    if (charPart.length === 2) {
      checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)))
      checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)))
    } else {
      checkSum += 9 * 36
      checkSum += 8 * (10 + strValidChars.indexOf(charPart))
    }
    // calculate the checksum for numeric part
    for (var i = 0, j = 7; i < numPart.length; i++, j--) {
      checkSum += j * numPart.charAt(i)
    }
    // verify the check digit
    var remaining = checkSum % 11
    var verify = remaining === 0 ? 0 : 11 - remaining
    // console.log('ereg', verify === parseInt(checkDigit))
    return verify === parseInt(checkDigit) || (verify === 10 && checkDigit === 'A')
  },

  /**
   * 台湾身份证
   */
  isTWID (idNo) {
    // if (idNo === null || idNo === '') return JSON.parse('{"respCode": "9", "respDesc": "空值"}')
    // if (idNo.length !== 10) return JSON.parse('{"respCode": "8", "respDesc": "國民身分證統一編號長度不正確"}')
    var errMsg = '身份证号码校验错误，请查验后重新输入！'
    var eng = idNo.substring(0, 1)
    var num = idNo.substring(1, 10)
    var sex = parseInt(idNo.substring(1, 2))
    eng = eng.toUpperCase()
    // 判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
    var regNum = /^[0-9]+.?[0-9]*/
    var regEng = /^[A-Za-z]+$/
    if (!regNum.test(num)) return errMsg
    if (sex !== 1 && sex !== 2) return errMsg
    if (!regEng.test(eng)) return errMsg
    // var key=['A', 'B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','X','Y','W','Z','I','O']
    var key = 'ABCDEFGHJKLMNPQRSTUVXYWZIO'
    var value = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35']
    var pos = key.indexOf(eng)
    if (pos === -1) return errMsg
    var x1 = value[pos].substring(0, 1)
    var x2 = value[pos].substring(1, 2)
    var y = parseInt(x1) + 9 * parseInt(x2) + 8 * parseInt(num.substring(0, 1)) + 7 * parseInt(num.substring(1, 2)) + 6 * parseInt(num.substring(2, 3)) + 5 * parseInt(num.substring(3, 4)) + 4 * parseInt(num.substring(4, 5)) + 3 * parseInt(num.substring(5, 6)) + 2 * parseInt(num.substring(6, 7)) + parseInt(num.substring(7, 8))
    var checkResult = y % 10
    if ((10 - checkResult) === parseInt(num.substring(8, 9))) {
      return true
    } else {
      if (checkResult === 10 && num.substring(8, 9) === 0) {
        // 若取余之后的结果为0，那么末尾的数为0
        return true
      } else {
        return errMsg
        // return JSON.parse('{"respCode": "1", "respDesc": "身份证号码校验错误，请查验后重新输入！"}')
      }
    }
  },

  /**
   * 过滤图片显示
   */
  filterImgUrl (val) {
    if (!val) return ''
    let res = val.match(/http/gi) ? val : domain.ROOT_IMG + val
    return res
  },

  /**
   * 深拷贝
   */
  deepCopy (o) {
    if (o instanceof Array) {
      let n = []
      for (let i = 0; i < o.length; ++i) {
        n[i] = this.deepCopy(o[i])
      }
      return n
    } else if (o instanceof Object) {
      let n = {}
      for (let i in o) {
        n[i] = this.deepCopy(o[i])
      }
      return n
    } else {
      return o
    }
  },

  /**
   * 数字自动补全小数点后两位
   */
  numberAutoCompletion (number) {
    if (!number && parseInt(number) !== 0) return ''
    let val = number.toString()
    if (val.indexOf('.') === -1) {
      val += '.00'
    } else {
      let splitRight = val.split('.')[1]
      if (splitRight.length === 0) {
        val += '00'
      }
      if (splitRight.length === 1) {
        val += '0'
      }
    }
    return val
  },

  /**
   * 自动补全小数点后两位
   */
  blurAutoCompletion (vm, obj) {
    if (!obj || !vm[obj] || isNaN(vm[obj])) return ''
    let val = vm[obj].toString()
    if (val.indexOf('.') === -1) {
      vm[obj] += '.00'
    } else {
      let splitRight = val.split('.')[1]
      if (splitRight.length === 0) {
        vm[obj] += '00'
      }
      if (splitRight.length === 1) {
        vm[obj] += '0'
      }
    }
  },

  /**
   * 补全结束时间，精确到23:59:59
   */
  completionEndDate (value) {
    if (!value) return ''
    let res = dateFns.format(new Date(value).getTime() + (24 * 60 * 60 * 1000 - 1), 'YYYY-MM-DD HH:mm:ss')
    return res
  },

  /**
   * 时间过滤器
   */
  filterDate (value, type) {
    if (!value) return ''
    let filterType = type || 'YYYY-MM-DD HH:mm:ss'
    return dateFns.format(value, filterType)
  },

  /**
   * 自动触发元素点击事件
   */
  triggerEvent (obj) {
    if (!obj) return ''
    if (document.all) {
      obj.click()
    } else {
      // 创建一个事件对象，就好像你绑定事件回调函数里获得的那个事件对象一样
      let myEvent = document.createEvent('Event')
      // 初始化这个事件对象，为它提高需要的“特性”
      myEvent.initEvent('click', true, true)
      // 按照常见的方式绑定对该事件的监听，这里的 element 可以是任何一个元素，你懂的
      obj.addEventListener('click', () => {})
      // 然后这样触发它
      obj.dispatchEvent(myEvent)
    }
  }
}
