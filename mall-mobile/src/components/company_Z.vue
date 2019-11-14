<template>
  <div>
    <!--企业基本信息-->
    <div class="companyInfo">
      <div class="companyInfo_left">企业基本信息</div>
      <div class="companyInfo_right">
        <div class="com_Info">生产商名称</div>
        <div class="com_Name">{{originsEnterpriseData.enterpriseName}}</div>
      </div>
    </div>
    <!--信息地址-->
    <div class="producerInfo">
      <ul>
        <li>
          <div class="pro_Add">生产商地址：</div>
          <div class="pro_detailAdd">{{originsEnterpriseData.province}}{{originsEnterpriseData.city}}{{originsEnterpriseData.zone}}{{originsEnterpriseData.enterpriseAddress}}</div>
        </li>
        <li>
          <div class="pro_Add">生产商电话：</div>
          <div class="pro_detailAdd">{{originsEnterpriseData.enterprisePhone}}</div>
        </li>
        <li>
          <div class="pro_Add">官网链接：</div>
          <div class="pro_detailAdd">{{originsEnterpriseData.website}}</div>
        </li>
      </ul>
      <div class="pro_indInfo">业务流转溯源</div>
    </div>

    <!--图片-->
    <div class="par_comImg">
        <div v-html="originsEnterpriseData.enterpriseSpotImg" class="boxImg"></div>
    </div>
  </div>
</template>
<script>
  import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem } from 'vux'
  export default {
    name: 'trace',
    components: {
      Tab,
      TabItem,
      Sticky,
      Divider,
      XButton,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        originsEnterpriseData: []
      }
    },
    computed: {
    },
    mounted: function () {
      this.getGoodsEnterpriseOriginsDetail()
    },
    methods: {
      getGoodsEnterpriseOriginsDetail () {
        this.$http.get(this.api.getGoodsEnterpriseOriginsDetail, {
          params: {
            goodsId: '7030'
          }
        }).then((res) => {
          // console.log(res)
          let resData = res.data
          if (resData.status === '1') {
            this.originsEnterpriseData = resData.data.originsEnterprise
          }
        })
      }
    }
  }
</script>
<style scoped lang=less>
/*企业基本信息*/
.companyInfo{
  width: 7.14rem;
  height: auto;
  /*padding: 0 0.18rem 0 0.18rem;*/
  margin-left: 0.18rem;
  border-radius: 0.2rem;
  margin-top: 0.23rem;
  display: flex;
  box-shadow:0px 4px 10px #f6f6f6;
  .companyInfo_left{
    width: 1.3rem;
    height: 1.22rem;
    background: #fcaa82;
    border-radius: 0.2rem;
    padding: 0.55rem 0.17rem 0 0.17rem;
    text-align: center;
    font-size: 0.28rem;
    color: #fff;
  }
  .companyInfo_right{
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .com_Info{
      color: #5b5b5b;
      font-size: 0.29rem;
      font-weight: 600;
    }
    .com_Name{
      color: #616161;
      font-size: 0.27rem;
    }
  }
}
/*信息地址*/
.producerInfo{
    width: 7.5rem;
    height: auto;
    margin-top: 0.5rem;
    ul{
      li{
        margin: 0.3rem 0 0 0;
        padding-bottom: 0.24rem;
        border-bottom: 1px solid #ebebeb;
        display: flex;
        .pro_Add{
          min-width: 1.6rem;
          font-size: 0.25rem;
          color: #a2a2a2;
          margin-left: 0.18rem;
        }
        .pro_detailAdd{
          flex: 1;
          font-size: 0.25rem;
          color: #616161;
        }
      }
    }
    .pro_indInfo{
      width: 7.14rem;
      height: 0.75rem;
      line-height: 0.75rem;
      text-align: center;
      margin: 0.42rem 0.18rem 0.17rem 0.18rem;
      border-radius: 0.2rem;
      color: #fff;
      background: linear-gradient(right, #feaf7f, #fb9d8a);
    }
  }

/*图片*/
.par_comImg{
  width: 7.14rem;
  height: auto;
  padding: 0 0.18rem 0 0.18rem;
}
</style>
<style scoped>
  /*.boxImg >>> p{*/
    /*color: red;*/
  /*}*/
  .boxImg >>> img{
    display: block;
    width: 100%;
    height: 100%;
    margin-top: 0.19rem;
  }
</style>
