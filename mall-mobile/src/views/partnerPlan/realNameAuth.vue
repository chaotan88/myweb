<template>
  <div class="realNameAuth">
    <!--未认证-->
    <div class="unverified" v-if="types == 1">
      <ul>
        <li>
          <input type="text" placeholder="请输入真实姓名" v-model="realName">
        </li>
        <li>
          <input type="text" placeholder="请输入身份证" v-model="idCard">
        </li>
      </ul>
      <div class="unverified-btn" @click="authentica">实名认证</div>
    </div>
    <!--已认证-->
    <div class="authenticated" v-if="types == 0">
      <div class="authenticated-user">
        <img src="../../assets/images/partnerPlan/plan-portrait-def2.png" >
        <div>已实名</div>
      </div>
      <ul>
        <li>姓名： 李**</li>
        <li>身份证： 42***************16</li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        types: '', // 0 已认证 1 未认证
        realName: '', // 真实姓名
        idCard: ''    // 身份证
      }
    },
    mounted: function () {
      this.types = this.$route.query.types
    },
    methods: {
      /**
       * 提交认证
      */
      authentica () {
        var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (this.realName === '') {
          this.$vux.toast.text('请输入真实姓名')
          return false
        } if (this.idCard === '') {
          this.$vux.toast.text('请输入身份证')
          return false
        } if (!regIdNo.test(this.idCard)) {
          this.$vux.toast.text('请输入正确身份证')
          return false
        }
        this.$http.post(this.api.realAuthentication, {
          cardName: this.realName,
          idCard: this.idCard,
          id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.$vux.toast.text('认证成功')
            this.$router.push('/partnerUpgrad')
          }
        })
      }
    }
  }
</script>
<style scoped lang=less>
  .realNameAuth{
    height: calc(100vh);
    overflow-y: scroll;
    background: #eee;
    /**未认证**/
    .unverified{
      ul {
        li{
          background: #fff;
          height: .88rem;
          border-bottom: .02rem solid #eeeeee;
          padding: 0 .35rem;
          input{
            width: 100%;
            height: .88rem;
            font-size: .24rem;
            color: #999999;
          }
        }
      }
      .unverified-btn{
        width: 6.72rem;
        height: .8rem;
        font-size: .26rem;
        color: #fff;
        border-radius: 6px;
        text-align: center;
        line-height: .8rem;
        margin: 0 auto;
        margin-bottom: .63rem;
        margin-top: .63rem;
        background: -webkit-linear-gradient(left, #f77574 , #ed3738); /* Safari 5.1 - 6.0 */
        background: linear-gradient(to right,#f77574 , #ed3738);
      }
    }
    /**已认证**/
    .authenticated{
      .authenticated-user{
        background: #fff;
        height: 2.6rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: .2rem;
        img{
          width:1.2rem;
          height:1.2rem;
          border:.05rem solid #96684d;
          border-radius: 1.2rem;
        }
        div{
          font-size: .28rem;
          color:#666666;
          margin-top: .1rem;
        }
      }  
      ul {
        li{
          background: #fff;
          height: .88rem;
          line-height: .88rem;
          border-bottom: .02rem solid #eeeeee;
          padding: 0 .35rem;
          font-size: .24rem;
          color: #666666;
        }
      }    
    }
  }
</style>