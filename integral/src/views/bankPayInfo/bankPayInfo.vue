<template>
    <div>
      <div class="pagebankPayInfo">
        <div class="bankImg">
         <img :src="bankImg"/>
        </div>
        <div class="payInfoTitle">
          <p>请填写支付信息</p>
          <div class="lastFourNum">
            <div><span>*</span>银行卡后四位</div>
            <input placeholder="请填写银行卡后四位"/>
          </div>
          <div class="reference">
            <div><span>*</span>参考号</div>
            <input placeholder="请填写刷卡小票上的参考号"/>
          </div>
          <div class="confirm">
            <div><span>*</span>确认参考号</div>
            <input placeholder="确认参考号"/>
          </div>
          <div class="paymentTime">
            <div><span>*</span>支付时间</div>
            <datetime v-model="minuteListValue" format="YYYY-MM-DD HH:mm" :minute-list="['00', '15', '30', '45']" style="color: #757575;"></datetime>
          </div>
        </div>
        <div class="upload">
          <input type="file" accept="image/png,image/jpg" name="file" id="uploadFile">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiangji"></use>
          </svg>
          <p>上传支付流程</p>
        </div>
        <div class="submit">
          <button>提交付款信息审核</button>
        </div>
      </div>
    </div>
</template>

<script>
  import { XInput, Datetime, Group, XButton } from 'vux'
  export default {
    name: 'bankPayInfo',
    data () {
      return {
        bankImg: require('../../assets/images/my-recommend-bg.png'),
        minuteListValue: '年/月/日',
        format: 'YYYY-MM-DD HH:mm'
      }
    },
    components: {
      XInput,
      Datetime,
      Group,
      XButton
    },
    mounted () {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
  .pagebankPayInfo{
    width: 100%;
    height: 100vh;
    background: #fff;
    .bankImg{
      width: 96%;
      padding: 3% 2%;
      /*height: 4.5rem;*/
      img{
        display: block;
        width: 100%;
        height: 3.5rem;
        border-radius: 0.2rem;
      }
    }
    .payInfoTitle{
      border-top: 0.25rem solid #f7f7f7;
      p{
        width: 96%;
        height: 1rem;
        line-height: 1rem;
        padding: 0 2%;
        border-bottom: 2px solid #f7f7f7;
      }
      .lastFourNum{
        width: 96%;
        height: 1.2rem;
        background: #fff;
        padding: 0 2%;
        border-bottom: 2px solid #f7f7f7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
          margin-right: 0.1rem;
          color: #ffc094;
        }
        input{
          width: 62%;
          padding-left: 3%;
          height: 0.8rem;
          line-height: 0.8rem;
          background: #f5f5f5;
          border-radius: 0.1rem;
        }
      }
      .reference{
        width: 96%;
        height: 1.2rem;
        background: #fff;
        padding: 0 2%;
        border-bottom: 2px solid #f7f7f7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
          margin-right: 0.1rem;
          color: #ffc094;
        }
        input{
          width: 62%;
          padding-left: 3%;
          height: 0.8rem;
          line-height: 0.8rem;
          background: #f5f5f5;
          border-radius: 0.1rem;
        }
      }
      .confirm{
        width: 96%;
        height: 1.2rem;
        background: #fff;
        padding: 0 2%;
        border-bottom: 2px solid #f7f7f7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
          margin-right: 0.1rem;
          color: #ffc094;
        }
        input{
          width: 62%;
          padding-left: 3%;
          height: 0.8rem;
          line-height: 0.8rem;
          background: #f5f5f5;
          border-radius: 0.1rem;
        }
      }
       .paymentTime{
         width: 96%;
         height: 1.2rem;
         background: #fff;
         padding: 0 2%;
         border-bottom: 2px solid #f7f7f7;
         display: flex;
         justify-content: space-between;
         align-items: center;
         span{
           margin-right: 0.1rem;
           color: #ffc094;
         }
         .vux-datetime{
           width: 62%;
           padding-left: 3%;
           height: 0.8rem!important;
           line-height: 0.8rem;
           background: #f7f7f7;
           border-radius: 0.1rem;
         }
         .weui-cell{
           padding-top: 0!important;
           padding-bottom: 0!important;
         }
         .vux-cell-value{
           padding-left: 0.2rem!important;
         }
       }
    }
    .upload{
      width: 70%;
      height: 1rem;
      margin: 0 15%;
      border-radius: 0.5rem;
      margin-top: 0.3rem;
      position: relative;
      border: 1px solid #ccc;
      input{
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      p{
        height: 1rem;
        line-height: 1rem;
        position: absolute;
        top: 0;
        left: 20%;
      }
      .icon{
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        top: 0.18rem;
        left: 60%;
      }
    }
    .submit{
      width: 70%;
      height: 1rem;
      margin: 0 15%;
      margin-top: 0.3rem;
      position: relative;
      button{
        width: 100%;
        height: 100%;
        background: #5684f5;
        border: 0!important;
        border-radius: 0.5rem;
        color: #fff;
      }
    }
  }
</style>
