<template>
  <div class="classification">
    <!--搜索-->
    <div class="search-wrap">
      <serch-header serchType="goSerchPage"></serch-header>
    </div>
    <!--主体-->
    <div class='content-box'>
      <!--左侧-->
      <div class='content-left'>
        <ul>
          <li :class="tabBarIndex == index ? 'active' : ''" v-for="(item, index) in goodsTypeLeftData" @click="getRightData(index, item)">{{item.attributeTypeName}}</li>
        </ul>
      </div>
      <!--右侧-->
      <div class='content-right'>
        <div  class="banner" v-if="bannerImg">
          <img :src="bannerImg | filterImgUrl">
        </div>
        <div class="right-box" v-for="(item, index) in goodsTypeRightData" v-if="item.attributeTypeChildList && item.attributeTypeChildList.length > 0">
          <p class="title">{{item.attributeTypeName}}</p>
          <ol>
            <li v-for="(item,index) in item.attributeTypeChildList" @click="$router.push({path: '/goodList', query: { searchType: 3, goodTypeId:item.id }})">
              <div>
                <img :src="item.logo | filterImgUrl" >
              </div>
              <p>{{item.attributeTypeName}}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  // import Vue from 'vue'
  import serchHeader from '../../components/serchHeader' // 搜索

  export default {
    components: {
      serchHeader
    },
    data () {
      return {
        goodsTypeLeftData: [], // 左侧大类
        goodsTypeRightData: [], // 右侧中类及小类
        tabBarIndex: 0, // 左侧栏目选中状态
        bannerImg: '' // 一级图片
      }
    },
    mounted: function () {
      this.getGoodsTypeLeft() // 获取左侧类别
    },
    methods: {
      /**
       * 获取左侧大类
      */
      getGoodsTypeLeft () {
        this.$http.post(`${this.api.goodsTypeLeft}`, {
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          if (resData.data.length > 0) {
            this.bannerImg = resData.data[0].logo
            this.goodsTypeLeftData = resData.data
            this.getGoodsTypeRight(resData.data[0].id)
          }
        })
      },
      /**
       * 获取右侧大类
      */
      getGoodsTypeRight (parentId) {
        this.$http.post(`${this.api.goodsTypeRight}`, {
          parentId: parentId
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.goodsTypeRightData = resData.data
        })
      },
      /**
       * 根据左侧大类获取右侧类别
      */
      getRightData (index, item) {
        this.tabBarIndex = index
        this.bannerImg = item.logo
        this.getGoodsTypeRight(item.id)
      }
    }
  }
</script>

<style scoped lang=less>
  .classification {
    .search-wrap{
      /* border-bottom: 1px solid #ddd; */
    }
    .content-box{
      width: 7.5rem;
      display: flex;
      position: absolute;
      top: 1.05rem;
      bottom: .88rem;
      overflow: hidden;
      /*左侧*/
      .content-left{
        overflow-y:scroll;
        flex: 0 0 1.8rem;
        width: 1.8rem;
        background: #f6f6f6;
        &::-webkit-scrollbar {
          display: none;
        }
        ul{
          li{
            height: 0.9rem;
            text-align: center;
            line-height: 0.9rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333333;
            font-size: .26rem;
            position: relative;
            padding: 0 .1rem;
            /*选中效果*/
            &.active{
              background: #fff;
              color:#f23030;
              &::before{
                content: '';
                width: .07rem;
                height: .28rem;
                background: #f74d4d;
                display: block;
                position: absolute;
                left: 0;
                bottom: 0;
                top: 0;
                margin: auto;
              }
            }
          }
        }
      }
      /*右侧*/
      .content-right{
        overflow-y:scroll;
        flex: 1;
        padding:0.2rem;
        &::-webkit-scrollbar {
          display: none;
        }
        .banner{
          width:100%;
          height: 1.8rem;
          background: #eee;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .right-box{
          .title{
            padding-top: .39rem;
            padding-bottom: .21rem;
            color:#333333;
            font-size: .24rem;
          }
          ol{
            padding: 0 .07rem;
            height: 100%;
            overflow: hidden;
            -webkit-box-shadow: 10px 0 50px 0 rgba(0, 0, 0, 0.05);
            /* padding-left: 0.3rem; */
            li{
              float: left;
              width:32.8%;
              /* padding-right:0.2rem; */
              text-align: center;
              margin-top:0.1rem;
              margin-bottom: 0.3rem;
              text-align: center;
              /* margin:0.1rem 0.4rem 0.2rem 0rem; */
              &:last-child{

              }
              div{
                width:1.1rem;
                height:1.1rem;
                margin: auto;
                /* background: #eee; */
                img{
                  width:1.1rem;
                  height:1.1rem;
                }
              }
              p{
                font-size: 0.22rem;
                margin-top:0.2rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #333333;
              }
            }
          }
          &:after{
            display: block;
            content: ".";
            height: 0;
            line-height: 0;
            clear: both;
            visibility: hidden;
          }
        }
      }
    }
  }
</style>
