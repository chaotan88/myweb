<template>
  <div class="action-wrap">
    <template v-for="(item, index) in activityList">
      <template v-if="parseInt(item.activityType) === 1">
        <!-- 单区样式一 -->
        <div class="sty-o" v-if="parseInt(item.colShowNum) === 1">
          <div class="sty-title">
            <router-link :to="{path:'/singleActivityList',query: {id: item.id}}" v-if="item.columnType === 1">
              <img :src="item.columnLogo | filterImgUrl">
            </router-link>
            <a :href="item.relateUrl" v-else>
              <img :src="item.columnLogo | filterImgUrl">
            </a>
          </div>
          <ul v-if="item.columnType === 1">
            <li v-for="ite in item.columnGoodsList" @click="$router.push({path: '/goodDetail', query: {goodsId: ite.id}})">
              <div>
                <img :src="ite.mainImage | filterImgUrl">
              </div>
              <div class="lis-price">
                <div>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xin2"></use>
                  </svg>
                  <span>真芯价</span>
                </div>
                <div>¥{{ite.whetherSpecial && ite.goodsSpecialPrice ? ite.goodsSpecialPrice : ite.goodsPrice}}</div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 单区样式二 -->
        <div class="sty-t" v-if="parseInt(item.colShowNum) === 2">
          <div class="sty-title">
            <router-link :to="{path:'/singleActivityList',query: {id: item.id}}" v-if="item.columnType === 1">
              <img :src="item.columnLogo | filterImgUrl">
            </router-link>
            <a :href="item.relateUrl" v-else>
              <img :src="item.columnLogo | filterImgUrl">
            </a>
          </div>
          <ul v-if="item.columnType === 1">
            <li v-for="ite in item.columnGoodsList" @click="$router.push({path: '/goodDetail', query: {goodsId: ite.id}})">
              <div class="lis-img">
                <img :src="ite.mainImage | filterImgUrl">
              </div>
              <div class="lis-tit">{{ite.goodsName}}</div>
              <div class="lis-price">¥{{ite.whetherSpecial && ite.goodsSpecialPrice ? ite.goodsSpecialPrice : ite.goodsPrice}}</div>
            </li>
          </ul>
        </div>
        <!-- 单区样式三 -->
        <div class="sty-th" v-if="parseInt(item.colShowNum) === 3">
          <div class="sty-title">
            <router-link :to="{path:'/singleActivityList',query: {id: item.id}}" v-if="item.columnType === 1">
              <img :src="item.columnLogo | filterImgUrl">
            </router-link>
            <a :href="item.relateUrl" v-else>
              <img :src="item.columnLogo | filterImgUrl">
            </a>
          </div>
          <ul v-if="item.columnType === 1">
            <li v-for="ite in item.columnGoodsList" @click="$router.push({path:'/goodDetail', query: {goodsId: ite.id}})">
              <div class="list-box">
                <div class="list-img">
                  <img :src="ite.mainImage | filterImgUrl">
                </div>
                <div class="list-tit">{{ite.goodsName}}</div>
                <div class="list-bot">
                  <div>¥{{ite.whetherSpecial && ite.goodsSpecialPrice ? ite.goodsSpecialPrice : ite.goodsPrice}}</div>
                  <div>去看看</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 单区样式四 -->
        <div class="sty-f" v-if="parseInt(item.colShowNum) === 5">
          <div class="sty-title">
            <router-link :to="{path:'/singleActivityList',query: {id: item.id}}" v-if="item.columnType === 1">
              <img :src="item.columnLogo | filterImgUrl">
            </router-link>
            <a :href="item.relateUrl" v-else>
              <img :src="item.columnLogo | filterImgUrl">
            </a>
          </div>
          <ul v-if="item.columnType === 1">
            <li @click="$router.push({path:'/goodDetail', query: {goodsId: ite.id}})" v-for="(ite, index) in item.columnGoodsList" :key="index">
              <div class="list-box">
                <div v-for="(imgs, inde) in homeIcon"  v-if="inde === index%4">
                  <img :src="imgs.home_one" class="boximg">
                </div>
                <div class="list-boxLeft">
                  <div class="list5Name">{{ite.goodsName}}</div>
                  <div class="list5Pri" v-if="ite.whetherSpecial === 0">¥{{ite.goodsPrice}}</div>
                  <div class="list5Pri" v-if="ite.whetherSpecial === 1">¥{{ite.goodsSpecialPrice}}<span>¥{{ite.goodsPrice}}</span></div>
                  <div class="list5Buy" v-for="(imgs, inde) in homeIcon"  v-if="inde === index%4">
                    <span :style="{color:imgs.sizeColor}">点击购买</span><img :src="imgs.home_one_arr" class="imgX">
                  </div>
                </div>
                <div class="list-boxRight"><img :src="ite.mainImage | filterImgUrl"></div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 单区样式五 -->
        <div class="sty-five" v-if="parseInt(item.colShowNum) === 6">
          <div class="sty-title">
            <router-link :to="{path:'/singleActivityList',query: {id: item.id}}" v-if="item.columnType === 1">
              <img :src="item.columnLogo | filterImgUrl">
            </router-link>
            <a :href="item.relateUrl" v-else>
              <img :src="item.columnLogo | filterImgUrl">
            </a>
          </div>
          <!--<ul>-->
            <!--<li v-for="ite in item.columnGoodsList" @click="$router.push({path:'/goodDetail', query: {goodsId: ite.id}})">-->
              <!--<div class="list-box">-->
                <!--<img :src="ite.mainImage | filterImgUrl"/>-->
              <!--</div>-->
            <!--</li>-->
          <!--</ul>-->
        </div>
      </template>
      <template v-if="parseInt(item.activityType) === 2">
        <!-- 多区样式一 -->
        <div class="sty-grid">
          <!-- <div class="sty-title">
            <img src="//gw.alicdn.com/tfs/TB1Cb4CkOrpK1RjSZFhXXXSdXXa-1053-375.jpg_790x10000Q75.jpg_.webp">
          </div> -->
          <ul>
            <li v-for="ite in item.columnList">
              <router-link :to="{path:'/multiActivityList',query: {id: ite.id}}" v-if="ite.columnType === 1">
                <img :src="ite.columnLogo | filterImgUrl">
              </router-link>
              <a :href="ite.relateUrl" v-else>
                <img :src="ite.columnLogo | filterImgUrl">
              </a>
            </li>
          </ul>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activityList: [],                         // 活动数据
      homeIcon: [
        {
          home_one: require('../assets/images/homeNew/home_one_1(1).png'),
          home_one_arr: require('../assets/images/homeNew/home_one_arrow_1.png'),
          sizeColor: '#ffaf53'
        },
        {
          home_one: require('../assets/images/homeNew/home_one_2(1).png'),
          home_one_arr: require('../assets/images/homeNew/home_one_arrow_2.png'),
          sizeColor: '#62acee'
        },
        {
          home_one: require('../assets/images/homeNew/home_one_3(1).png'),
          home_one_arr: require('../assets/images/homeNew/home_one_arrow_3.png'),
          sizeColor: '#eb5665'
        },
        {
          home_one: require('../assets/images/homeNew/home_one_4(1).png'),
          home_one_arr: require('../assets/images/homeNew/home_one_arrow_4.png'),
          sizeColor: '#9a39ff'
        }
      ]
    }
  },
  mounted: function () {
    this.getActivityList()                     // 获取活动列表
  },
  methods: {
    /**
     * 获取活动列表
    */
    getActivityList () {
      this.$http.post(this.api.getActivityList, {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
          return false
        }
        this.activityList = resData.data
        // console.log(this.activityList)
      }).finally(() => {
      })
    }
  }
}
</script>
<style lang=less>
  .action-wrap{
    height: auto;
    overflow: hidden;
    /* 单区活动样式一 */
    .sty-o{
      margin-top: .17rem;
      background: #fff;
      .sty-title{
        img{
          width: 100%;
          display: block;
          /* height: 3rem; */
        }
      }
      ul{
        padding: 0 .15rem;
        margin-top: -1.1rem;
        position: relative;
        z-index: 200;
        height: auto;
        overflow: hidden;
        li{
          width: 2.26rem;
          height: 2.96rem;
          background: #fff;
          float: left;
          -webkit-box-shadow: 0 0 10px 0 rgba(154, 141, 141, 0.2);
          margin-right: .2rem;
          margin-bottom: .17rem;
          &:nth-child(3n){
            margin-right: 0;
          }
          img{
            width: 100%;
            height: 2.25rem;
          }
          .lis-price{
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: .05rem;
            div:nth-child(1){
              width: 1rem;
              height: .26rem;
              background: #de3d96;
              -webkit-transform: skew(-17deg);
              -moz-transform: skew(-17deg);
              -o-transform: skew(-17deg);
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              max-width: 2rem;
              svg{
                width: .1rem;
                height: .1rem;
                fill: #fff;
                -webkit-transform: skew(17deg);
                -moz-transform: skew(17deg);
                -o-transform: skew(17deg);
              }
              span{
                font-size:.16rem;
                color: #fff;
                -webkit-transform: skew(17deg);
                -moz-transform: skew(17deg);
                -o-transform: skew(17deg);
                display: inline-block;
                margin-left: .05rem;
              }
            }
            div:nth-child(2){
              font-size: .28rem;
              color: #292929;
              margin-left: .1rem;
              max-width: 1.5rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
    /* 单区活动样式二 */
    .sty-t{
      background: #fff;
      margin-top: .17rem;
      .sty-title{
        img{
          width: 100%;
          display: block;
          /* height: 2.64rem; */
        }
      }
      ul{
        height: auto;
        overflow: hidden;
        padding: 0 .26rem;
        li{
          width: 2.01rem;
          height: 3.5rem;
          margin-right: .4rem;
          margin-bottom: .2rem;
          text-align: center;
          position: relative;
          &:nth-child(3n){
            margin-right: 0;
          }
          float: left;
          .lis-img{
            width: 2rem;
            height: 2rem;
            img{
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .lis-price{
            font-size: .28rem;
            color: #ff075d;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: absolute;
            bottom: .2rem;
          }
          .lis-tit{
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: .24rem;
            color: #686767;
            margin: .2rem 0;
            text-align: left;
          }
        }
      }
    }
    /* 单区活动样式三 */
    .sty-th{
      margin-top: .17rem;
      .sty-title{
        img{
          width: 100%;
          display: block;
          /* height: 2.64rem; */
        }
      }
      ul{
        height: auto;
        overflow: hidden;
        padding: .14rem .09rem;
        li{
          height: 5.38rem;
          overflow: hidden;
          box-sizing: border-box;
          float: left;
          width: 50%;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          padding-bottom: .09rem;
          position: relative;
          &:nth-child(odd) {
            padding-right: .045rem;
          }
          &:nth-child(2n){
            padding-left: .045rem;
            border-right: none;
          }
          .list-box{
            height: 100%;
            background: #fff;
            padding: 0;
          }
          .list-img{
            width: 100%;
            height: 3.69rem;
            display: block;
            img{
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .list-tit{
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: .24rem;
            color: #909090;
            margin: .12rem .23rem;
          }
          .list-bot{
            display: flex;
            align-items: center;
            position: absolute;
            bottom: .23rem;
            width: auto;
            left: .23rem;
            right: .23rem;
            div:nth-child(1){
              flex: 1;
              font-size: .28rem;
              color: #ea5486;
            }
            div:nth-child(2){
              font-size: .2rem;
              color: #514f50;
              border: 1px solid #cccccc;
              border-radius: 4px;
              line-height: .3rem;
              padding: .06rem .2rem;

            }
          }
        }
      }
    }
    /* 单区活动样式四 */
    .sty-f{
      margin-top: .17rem;
      background: #fff;
      .sty-title{
        img{
          width: 100%;
          display: block;
          height: 2.5rem;
          /* height: 2.64rem; */
        }
      }
      ul{
        height: auto;
        overflow: hidden;
        padding: .14rem .09rem;
        li{
          margin-bottom: 0.2rem;
          .list-box{
            width: 100%;
            height: 3rem;
            border-radius: 0.3rem;
            position: relative;
            .boximg{
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 66;
            }
            .list-boxLeft{
              width: 4rem;
              height: 2.2rem;
              margin-top: 0.4rem;
              /*float: left;*/
              margin-left: 0.2rem;
              color: #fff;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 999;
              .list5Name{
                width: 4rem;
                height: 0.8rem;
                font-size: 0.28rem;
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-break: break-all;
                white-space: normal;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              .list5Pri{
                margin-top: 0.1rem;
                font-size: 0.5rem;
                span{
                  font-size: 0.3rem;
                  margin-left: 0.3rem;
                  text-decoration: line-through;
                }
              }
              .list5Buy{
                padding: 0.08rem 0.2rem;
                background: #fff;
                width: 1.5rem;
                border-radius: 0.4rem;
                margin-top: 0.15rem;
                color: #000;
                position: relative;
                span{
                  font-size: 0.25rem;
                }
                .imgX{
                  width: 0.18rem;
                  height: 0.25rem;
                  position: absolute;
                  right: 0.3rem;
                  top: 0.15rem;
                }
              }
            }
            .list-boxRight{
              width: 2.0rem;
              height: 2.2rem;
              margin-top: 0.4rem;
              margin-right: 0.4rem;
              position: absolute;
              top: 0;
              right: 0;
              z-index: 999;
              img{
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
    /*多去活动样式五*/
    .sty-five{
      /*margin-top: .17rem;*/
      background: #fff;
      .sty-title{
        /*padding: .14rem .09rem;*/
        /*height: 3.6rem;*/
        border-radius: 0.2rem;
        img{
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      ul{
        height: auto;
        overflow: hidden;
        padding: .14rem .09rem;
        li{
          /*margin-bottom: 0.2rem;*/
          .list-box{
            width: 100%;
            height: 3.4rem;
            border-radius: 0.2rem;
            position: relative;
            img{
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        }
      }
    }
    /* 多区活动样式三 */
    .sty-grid{
      background: #fff;
      margin-top: .17rem;
      .sty-title{
        img{
          width: 100%;
          display: block;
          /* height: 2.64rem; */
        }
      }
      ul{
        height: auto;
        overflow: hidden;
        padding-bottom: .26rem;
        li{
          width: 3.54rem;
          height: auto;
          float: left;
          margin-right: .1rem;
          margin-top: .1rem;
          &:first-child{
            /*width: 7.5rem;*/
            width: 7.18rem;
            margin-left: 0.14rem;
          }
          &:nth-child(2n){
            margin-left: .14rem;
          }
          &:nth-child(2n+1){
            margin-right: 0;
          }
          img{
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
    }
  }
</style>
