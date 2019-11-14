<template>
  <div>
    <div class="zfbHeader">*只允许绑定本人用户的支付宝账号!</div>
    <div class="authenticated">
      <ul>
        <li><span>用户实名： </span> {{personalData.cardName | filterName}}</li>
        <li><span>证件号： </span> {{personalData.idCard | filterID}}</li>
        <li>
          <span>*支付宝账号： </span><input type="text" placeholder="请输入完整的支付宝账号" v-model="value"  class="changeColor"/>
        </li>
      </ul>
    </div>
    <div class="saveInfo" @click="saveAlipay">保存</div>
  </div>
</template>

<script>
    export default {
      name: 'addAlipay',
      data () {
        return {
          personalData: {},  // 用户信息
          aliPhone: '',
          value: ''
        }
      },
      components: {
      },
      watch: {
        value () {
        }
      },
      mounted () {
        this.getPersonalInfo()
      },
      methods: {
        /**
         * 获取个人信息
         */
        getPersonalInfo () {
          this.$http.post(`${this.api.personalInfo}`, {
            id: JSON.parse(localStorage.getItem('integralUserInfo')).userId
          }).then((res) => {
            if (res.data.status !== this.api.ERR_OK || !res) return false
            let resData = res.data.data
            this.personalData = resData
            console.log(this.personalData)
            if (this.personalData.alipayNum && this.personalData.alipayNum !== null) {
              this.value = this.personalData.alipayNum
            }
          })
        },
        /**
         * 隐藏手机号中间4位
         */
        filterPhone (val) {
          const abc = '--'
          if (!val) return abc
          return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        },
        inputChange () {
        },
        /**
         * 保存支付宝
         */
        saveAlipay () {
          console.log(this.value)
          console.log(this.personalData.alipayNum)
          // this.personalData.alipayNum === null是判断新用户第一次注册支付宝alipayNum字段为空的情况
          if (this.value === '') {
            this.$vux.toast.text('请输入支付宝账号')
            return false
          } else if (!this.value.match(/^1[34578]\d{9}$/g) && this.value.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/g)) {
            if (this.personalData.alipayNum === null) {
            } else if (this.value === this.personalData.alipayNum) {
              this.$vux.toast.text('当前支付宝账号在系统中已存在')
              return false
            }
          } else if (this.value.match(/^1[34578]\d{9}$/g) && !this.value.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/g)) {
            if (this.personalData.alipayNum === null) {
            } else if (this.value === this.personalData.alipayNum) {
              this.$vux.toast.text('当前支付宝账号在系统中已存在')
              return false
            }
          } else if (!this.value.match(/^1[34578]\d{9}$/g) && !this.value.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/g)) {
            this.$vux.toast.text('请输入正确的手机号或邮箱')
            return false
            // if (this.personalData.alipayNum !== null) {
            //   if (this.value === this.personalData.alipayNum) {
            //     this.$vux.toast.text('手机号或邮箱已存在')
            //     return false
            //   } else if (this.personalData.alipayNum) {
            //     this.$vux.toast.text('请输入正确的手机号或邮箱')
            //     return false
            //   }
            // }
          }
          this.$http.post(`${this.api.saveAlipay}`, {
            alipayNum: this.value
          }).then((res) => {
            console.log(res)
            if (res.data.status === '1') {
              let qf = this.$route.query.qf
              if (qf === 1) {
                this.$router.replace('/user/index')
              } else if (qf === 2) {
                this.$router.replace('/putForward/index')
              } else if (qf === 3) {
                this.$router.replace('/putForward/index')
              }
              this.$vux.toast.text('绑定支付宝账号成功')
            } else {
              this.$vux.toast.text('当前支付宝账号在系统中已存在')
            }
          })
        }
      }
    }
</script>

<style lang="less" scoped>
  .zfbHeader{
    height: 0.8rem;
    background: #ccc;
    line-height: 0.8rem;
    color: red;
    text-align: center;
    font-size: 0.3rem;
  }
  /**已认证**/
  .authenticated{
    ul {
      li{
        background: #fff;
        height: 1.1rem;
        line-height: 1.1rem;
        border-bottom: .02rem solid #eeeeee;
        padding: 0 .35rem;
        font-size: .28rem;
        color: #666666;

        span{
          display: inline-block;
          width: 2rem;
          text-align: right;
        }
      }
    }
    .changeColor{
      width: 4rem;
      color: #666;
    }
  }
  .saveInfo{
    width: 6.5rem;
    height: 1rem;
    line-height: 1rem;
    color: #fff;
    text-align: center;
    background: orange;
    margin: 0.5rem;
    -webkit-border-radius: 0.2rem;
    -moz-border-radius: 0.2rem;
    border-radius: 0.2rem;
  }
</style>
