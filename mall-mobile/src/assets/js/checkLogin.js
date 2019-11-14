import axios from 'axios'                                            // axios
import router from '../../.././src/router'
import api from './api'                                             // 配置api接口文件
/**
 * 检查是否登录
*/
export var checkLogin = function () {
  return new Promise((resolve, reject) => {
    axios.get(api.ifLogin, {
    }).then((res) => {
      let resData = res.data
      if (parseInt(resData.data) !== parseInt(this.api.ERR_OK)) {
        localStorage.setItem('REDIRECT_URL', router.currentRoute.fullPath)           // 保存页面重定向url
        router.replace({
          path: '/login'
        })
        return false
      }
      resolve(res)
    })
  })
}
