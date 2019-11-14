module.exports = {

  /**
   * 校验身份证
   */
  filterIdCard (idcard) {
    var Errors = [
      true,
      // '验证通过!',
      '身份证号码位数不对!',
      '身份证号码出生日期超出范围或含有非法字符!',
      '身份证号码校验错误，请查验后重新输入！',
      '身份证地区非法!'
    ]
    var area = {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外'
    }
    // var retflag = false
    var Y, JYM
    var S, M, ereg
    var idcardArray = []
    idcardArray = idcard.split('')
    // 地区检验
    if (area[parseInt(idcard.substr(0, 2))] === null) return Errors[4]
    // 身份号码位数及格式检验
    switch (idcard.length) {
      case 15:
        if (((((parseInt(idcard.substr(6, 2)) + 1900) % 4) === 0) || ((((parseInt(idcard.substr(6, 2)) + 1900) % 100) === 0) && ((parseInt(idcard.substr(6, 2)) + 1900) % 4) === 0))) {
          ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/ // 测试出生日期的合法性
        } else {
          ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/ // 测试出生日期的合法性
        }
        if (ereg.test(idcard)) {
          return Errors[0]
        } else {
          return Errors[2]
        }
      case 18:
        // 18位身份号码检测
        // 出生日期的合法性检查
        // 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
        // 润年合法性验证: /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/
        // 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
        // 平年合法性验证:/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/
        if ((parseInt(idcard.substr(6, 4)) % 4) === 0 || ((parseInt(idcard.substr(6, 4)) % 100) === 0 && (parseInt(idcard.substr(6, 4)) % 4) === 0)) {
          ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/ // 闰年出生日期的合法性正则表达式
        } else {
          ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/ // 平年出生日期的合法性正则表达式
        }
        if (ereg.test(idcard)) { // 测试出生日期的合法性
          // 计算校验位
          S = (parseInt(idcardArray[0]) + parseInt(idcardArray[10])) * 7 + (parseInt(idcardArray[1]) + parseInt(idcardArray[11])) * 9 + (parseInt(idcardArray[2]) + parseInt(idcardArray[12])) * 10 + (parseInt(idcardArray[3]) + parseInt(idcardArray[13])) * 5 + (parseInt(idcardArray[4]) + parseInt(idcardArray[14])) * 8 + (parseInt(idcardArray[5]) + parseInt(idcardArray[15])) * 4 + (parseInt(idcardArray[6]) + parseInt(idcardArray[16])) * 2 + parseInt(idcardArray[7]) * 1 + parseInt(idcardArray[8]) * 6 + parseInt(idcardArray[9]) * 3
          Y = S % 11
          M = 'F'
          JYM = '10X98765432'
          M = JYM.substr(Y, 1) // 判断校验位
          if (M === idcardArray[17]) {
            return Errors[0] // 检测ID的校验位
          } else {
            return Errors[3]
          }
        } else {
          return Errors[2]
        }
      case 8:
        return this.IsHKID(idcard)
      case 10:
        return this.isTWID(idcard)
      default:
        // console.log('Errors: ', Errors[1])
        return Errors[1]
    }
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
  }
}
