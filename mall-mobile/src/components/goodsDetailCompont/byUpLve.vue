<template>
    <div class="earnWap">
      <!--卖出赚多少钱-->
      <div class="earn-box">
<!--        <div class="title">TA们都赚翻了</div>-->
        <div class="tabel">
          <div class="cent" :style="'height'+swper+'px'">
            <swiper auto :height="swper+'px'" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false">
              <!--<swiper-item v-for="(item, index) in groupList" :key="index">-->

              <!--</swiper-item>-->
              <swiper-item >
                <div class="tableList" >
                  <div class="etime">
                    <div class="imgBox">
                      <img src="">
                      <div class="text">
                        金牌代言人
                      </div>
                    </div>
                  </div>
                  <div class="etime" >
                    <p >高端大气，千万不要错过！代言商品，我还赚了200万元 </p>
                  </div>
                </div>
              </swiper-item>
              <swiper-item >
                <div class="tableList" >
                  <div class="etime">
                    <div class="imgBox">
                      <img src="">
                      <div class="text">
                        金牌代言人
                      </div>
                    </div>
                  </div>
                  <div class="etime" >
                    <p >高端大气，千万不要错过！代言商品，我还赚了200万元 </p>
                  </div>
                </div>
              </swiper-item>
              <swiper-item >
                <div class="tableList" >
                  <div class="etime">
                    <div class="imgBox">
                      <img src="">
                      <div class="text">
                        金牌代言人
                      </div>
                    </div>
                  </div>
                  <div class="etime" >
                    <p >高端大气，千万不要错过！代言商品，我还赚了200万元 </p>
                  </div>
                </div>
              </swiper-item>
            </swiper>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  import { Swiper, SwiperItem } from 'vux'
  export default {
    components: {
      Swiper,
      SwiperItem
    },
    props: ['listData'],
    data () {
      return {
        swper: 55,
        list: []
      }
    },

    mounted () {
      this.list = this.listData
      let fontSize = localStorage.getItem('fontSize')
      // 单位换算 1.1rem 换算成 px
      this.swper = 1.1 * fontSize
    },

    methods: {
      listCheng (data) {
        // var dataArr = data
        // var list = []
        // var colomns = 3
        // if (dataArr.length >= 3) {
        //   this.swper = 90
        // }
        // if (dataArr.length === 2) {
        //   this.swper = 60
        // }
        // for (var i = 0, len = dataArr.length; i < len; i += colomns) {
        //   list.push(dataArr.slice(i, i + colomns))
        // }
        // return list
      }
    },
    watch: {
      // list 订单数据
      listData: {
        handler (curVal) {
          this.list = []
        },
        deep: true
      }
    }
  }
</script>

<style lang="less" scoped>
  .earnWap{
    /*参团*/
    .earn-box{
      width: 100%;
      border-bottom: .25rem solid #f8f8f8;

      .title{
        color: #999;
        line-height: .6rem;
        height: .6rem;
        padding-left: .3rem;
        padding-right: .3rem;
        font-size: .28rem;
      }

      .tabel{

        .cent{
          width: 100%;
          box-sizing: border-box;
          padding: .2rem .3rem .2rem .1rem;
          /*overflow-y: scroll;*/
          .tableList{
            display: flex;
            flex-direction: row;
            border-top: 1px solid #f9f9f9;
            .etime{
              font-size: .24rem;
              color: #7d7a7a;
              text-align: left;

              .imgBox{
                width: 1.1rem;
                height: 1.1rem;
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                img{
                  width: .8rem;
                  height: .8rem;
                  border-radius: .4rem;
                  border: 1px solid #e1e1e1;
                }
                .text{
                  position: absolute;
                  width: 100%;
                  bottom: 2px;
                  border-radius: .2rem;
                  height: .4rem;
                  line-height: .4rem;
                  color: white;
                  background: linear-gradient(top left ,#f3cf84, #d5a25a);
                  font-size: .24rem;
                  text-align: center;
                }
              }
              .etimePhone{
                text-align: left;
                line-height: .55rem;
                height: .55rem;
              }

              .number{
                color: #f22839;
              }

              p{
                line-height: .6rem;
                height: .6rem;
              }
            }

            .bot{
              display: inline-block;
              width: 1.28rem;
              height: .5rem;
              text-align: center;
              line-height: .5rem;
              background: #f22839;
              color: #fff;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }

</style>
