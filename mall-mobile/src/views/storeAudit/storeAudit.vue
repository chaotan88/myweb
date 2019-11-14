<template>
  <div class="store-audit">
    <ul>
      <li>
        <div class="store-audit-l"><img src="../../assets/images/maker/examine1.png"></div>
        <div class="store-audit-r">
          <p>1.创建店铺</p>
          <p>{{shopStatus.createTime | formatDate(1)}}</p>
        </div>
      </li>
       <li>
        <div class="store-audit-l">
          <img src="../../assets/images/maker/examine2.png">
          <!-- <img src="../../assets/images/maker/examine2-gray.png"> -->
        </div>
        <div class="store-audit-r">
          <p>2.提交审核</p>
          <p>{{shopStatus.reviewTime | formatDate(1)}}</p>
        </div>
      </li>
       <li>
        <div class="store-audit-l">
          <img src="../../assets/images/maker/examine3.png" v-if="shopStatus.shopStatus &&shopStatus.shopStatus!=1">
          <img src="../../assets/images/maker/examine3-gray.png" v-else>
          </div>
        <div class="store-audit-r">
          <p :class="shopStatus.shopStatus == 1 ? 'stepGray' : ''">3.平台审核</p>
          <!-- <p>2018-01-06 17:09:35</p> -->
        </div>
      </li>
       <li>
        <div>
          <img src="../../assets/images/maker/examine4.png" v-if="shopStatus.shopStatus && shopStatus.shopStatus!=1">
          <img src="../../assets/images/maker/examine4-gray.png" v-else>
        </div>
        <div class="store-audit-r">
          <p :class="shopStatus.shopStatus == 1 ? 'stepGray' : ''">
            4.审核状态
            <span v-if="shopStatus.shopStatus && shopStatus.shopStatus!=1">: {{shopStatus.shopStatus | shopSteFilter}}</span>
          </p>
          <!-- <p>2018-01-06 17:09:35</p> -->
          <div class="exam-state" v-if="shopStatus.shopStatus && shopStatus.shopStatus!=1">
            <div class="pass" v-if="shopStatus.shopStatus == 3">
              原因：  {{shopStatus.description}}
            </div>
            <div class="adopt" v-if="shopStatus.shopStatus == 2">
              <div>网店域名: {{shopStatus.shopDomain}}</div>
            </div>
            </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        shopStatus: {} // 审核状态
      }
    },
    mounted: function () {
      this.getMemberShopStatus() // 获取审核状态
    },
    methods: {
      /**
       * 获取总积分
      */
      getMemberShopStatus () {
        this.$http.post(`${this.api.getMemberShopStatus}`, {
          token: JSON.parse(localStorage.getItem('bsbUserInfo')).token || ''
        }).then((res) => {
          if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
            this.shopStatus = res.data.data
          }
        })
      }
    }
  }
</script>
<style scoped lang=less>
  .store-audit{
    min-height: calc(100vh);
    background: url('../../assets/images/maker/Shop-bg.jpg') no-repeat;
    background-color: #194c80;
    background-size:100% auto;
    ul{
      padding:1.8rem 0 .8rem .9rem;
      li{
        display: flex;
        &:nth-child(1) img{
          width: 1.68rem;
          height: 1.68rem;
        }
        &:nth-child(2) img{
          width: 1.47rem;
          height: 1.10rem;
        }
        &:nth-child(3) img{
          width: 1.55rem;
          height: 1.48rem;
        }
        &:nth-child(4) img{
          width: 1.53rem;
          height: .8rem;
        }
        .store-audit-l{
          &::after{
            content: '';
            width: .7rem;
            height: 1.26rem;
            display: block;
            background: url('../../assets/images/maker/arrow.png') no-repeat;
            background-size:100% 100%;
            margin-left: .4rem;
          }
        }
        .store-audit-r{
          margin-left: .2rem;
          margin-top:.25rem;
          p:nth-child(1){
            color: #fff100;
            font-size: .28rem;
            &.stepGray{
              color: #ccc;
            }
            span{
              color:#fff;
            }
          }
          p:nth-child(2){
            font-size: .24rem;
            color: #fff100;
            padding: .05rem .19rem;
            border:1px solid #fff100;
            border-radius: 20px;
            -webkit-border-radius: 20px;
            margin-top:.2rem;   
            &:empty{
              display: none;
            }       
          }
          .exam-state{
            color: #fff100;
            font-size: .24rem;
            word-break: break-all;
            margin-top:.2rem;
            .pass{
              padding: 0.05rem .19rem;
              border-radius: 20px;
              -webkit-border-radius: 20px;
              border:1px solid #fff100;
            }
            .adopt{
              border:1px solid #fff100;
              border-radius: 20px;
              -webkit-border-radius: 20px;
              padding: 5px .25rem;
              max-width: 3.45rem;
              div{
                margin-bottom: .1rem;
              }
            }
          }
        }
      }
    }
  }
</style>
