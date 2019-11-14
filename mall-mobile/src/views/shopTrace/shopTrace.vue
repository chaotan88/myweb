<template>
  <div>
   <div class="tabNav" ref="changeBg">
     <ul>
       <li v-for="(item, index) in liList" :key="index" @click="gotoAddress(index)" :class="{active: activeIndex == index}">{{item.liName}}</li>
     </ul>
   </div>
    <product-page v-if="proCon"></product-page>
    <company-page v-if="comCon"></company-page>
  </div>
</template>
<script>
  import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem } from 'vux'
  import productPage from '../../components/product_Z'
  import companyPage from '../../components/company_Z'
  export default {
    name: 'trace',
    components: {
      Tab,
      TabItem,
      Sticky,
      Divider,
      XButton,
      Swiper,
      SwiperItem,
      productPage,
      companyPage
    },
    data () {
      return {
        liList: [
          {
            liName: '产品溯源'
          },
          {
            liName: '企业溯源'
          }
        ],
        proCon: true,     // 产品溯源控制
        comCon: false,    // 企业溯源控制
        activeIndex: 0
      }
    },
    computed: {
    },
    mounted: function () {
      // this.postGoodsProductOriginsDetail()    // 商品产品溯源
      // this.getGoodsProductOriginsDetail()   // 商品企业溯源
    },
    methods: {
      gotoAddress (index) {
        // console.log(index)
        this.activeIndex = index
        if (this.activeIndex === 0) {
          this.$refs.changeBg.style.backgroundColor = '#618bf9'
          this.proCon = true
          this.comCon = false
        } else {
          this.$refs.changeBg.style.backgroundColor = '#feaf7f'
          this.comCon = true
          this.proCon = false
        }
      }
    },
    created () {
    }
  }
</script>
<style scoped lang=less>
.tabNav{
  width: 7.5rem;
  height: 0.88rem;
  display: flex;
  justify-content: center;
  background: #618bf9;
 ul{
   width: 7.5rem;
   height: 0.88rem;
   display: flex;
   li{
     width: 50%;
     height: 0.88rem;
     line-height: 0.88rem;
     text-align: center;
     color: #dbdbdb;
   }
 }
  .active{
    color: #fff;
  }
}
</style>

