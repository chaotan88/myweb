<template>
    <div class="spliceOder-wap">
       <section class="bannerBox">
         <div class="banner">
           <!--../../assets/images/spliceOder/banner.png-->
           <img :src="chart.themeImage"/>
         </div>
       </section>
      <section class="special">
        <!---->
        <div class="list" v-show="first.goodsId">
           <div class="imgBox">
             <!--../../assets/images/spliceOder/goodsSpecial.png-->
             <img :src="first.activityImage" />
           </div>
           <div class="textBox">
             <div class="titleBox">
               <p>{{first.goodsName}}</p>
             </div>
             <div class="moneyBox">
               <div class="money">
                 <p><span style="font-size: .24rem">拼团价</span><span class="unit">￥</span><span class="number">{{first.goodsGroupPrice || '0.00'}}</span> <span class="bot">{{first.groupNum || 0 }}人团</span></p>
               </div>
               <div class="goSplice">
                 <div>
                  <p>{{first.groupPeople}}人已拼团 </p>
                 </div>
                 <div class="bot" @click="goPage('goodDetail', first)">
                   立即拼
                 </div>
               </div>
               <!--<div class="activ" >-->
                 <!--获得 {{first.canGetPoint || 0}} 消费积分-->
                 <!--<svg class="icon">-->
                   <!--<polygon points="0,0 0,9 9,0" style="fill:#9251d2;stroke:#9251d2;stroke-width:1" />-->
                 <!--</svg>-->
               <!--</div>-->
             </div>
           </div>
         </div>
        <p v-show="!first.goodsId" style="font-size: .28rem;text-align: center;width: 100%">
           {{err.masg}}
        </p>
      </section>
      <section class="goodsList">
        <div class="list" v-for="(etim, index) in list" :key="index">
          <div class="imgBox">
            <!--../../assets/images/spliceOder/goods.png-->
            <img :src="etim.activityImage" />
          </div>
          <div class="textBox">
            <div class="titleBox">
              <p>{{etim.goodsName}}</p>
            </div>
            <div class="moneyBox">
              <div class="money">
                <p><span class="unit">￥</span><span class="number">{{etim.goodsGroupPrice  || '0.00'}}</span> <span class="bot">{{etim.groupNum || 0 }}人团</span></p>
                <p class="original"> <span>买单价</span><span>￥ {{etim.goodsPrice}}</span></p>
              </div>
              <div class="goSplice">
                <div class="bot" @click="goPage('goodDetail', etim)">
                  去拼团
                </div>
                <p>
                  {{etim.groupPeople}}人已拼团
                </p>
              </div>
              <!--<div class="activ" >-->
                <!--获得 {{etim.canGetPoint || 0}} 消费积分-->
                <!--<svg class="icon">-->
                  <!--<polygon points="0,0 0,9 9,0" style="fill:#9251d2;stroke:#9251d2;stroke-width:1" />-->
                <!--</svg>-->
              <!--</div>-->
            </div>
          </div>
        </div>
      </section>
      <section class="alertBack" v-show="chart.status == 2">
        <div class="imgBack" @click="back()">
          <img src="../../assets/images/spliceOder/alet.png"/></div>
      </section>
    </div>
</template>

<script>
  export default {
    components: {},

    data () {
      return {
        first: {},
        list: [],
        chart: {
          id: ''
        },
        err: {
          masg: ''
        }
      }
    },

    mounted () {
      this.getGroupList()
    },

    methods: {
      getGroupList () {
        this.$http.get(`${this.api.getGroupDetailBySplice}`, {
          params: {
            id: this.$route.query.Id
          }
        }).then((res) => {
          var resData = res.data
          this.list = []
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            this.chart.id = resData.data.id
            this.chart = {
              id: resData.data.id,
              themeImage: resData.data.themeImage,
              themeBackdrop: resData.data.themeBackdrop,
              status: resData.data.status
            }
            var listData = resData.data.goodsList
            console.log(listData, 'listData')
            // 过滤空数据
            if (listData.length > 0) {
              // 特卖位
              for (let i in listData) {
                if (parseInt(i) === 0) {
                  this.first = listData[i]
                } else {
                  // 非特卖位
                  this.list.push(listData[i])
                }
              }
            }
          } else {
            this.err.masg = resData.msg
          }
        })
      },
      goPage (path, list) {
        this.$router.push({name: path, query: {goodsId: list.goodsId, themeId: this.chart.id}})
      },
      back () {
        this.$router.back()
      }
    }
  }
</script>

<style lang="less" scoped>
  .spliceOder-wap{
    min-height: 13.34rem;
    background-color: #f0f0f0;
    position: relative;
    .bannerBox{

      .banner{
        width: 100%;
        height: 4.26rem;
        overflow: hidden;

        img{

          width: 100%;
          height: auto;
        }
      }
    }

    .special{
      position: relative;
      margin-bottom: .4rem;
      height: .2rem;
      .back{
        width: 7.5rem;
        margin: auto;
        height: auto;
        max-height: 2.4rem;
      }

      .list{
        padding-left: .2rem;
        position: absolute;
        top: -3rem;
        width: 7rem;
        height: 3.4rem;
        left: 50%;
        margin-left: -3.5rem;
        border-radius: 6px;

        .imgBox{
          width: 2.4rem;
          height: 3rem;
          overflow: hidden;
        }

        .textBox{
          width: 3.91rem;

          .titleBox{
            width: 3.91rem;
            font-size: .34rem;
            min-height: .74rem;
          }

          .moneyBox {
            display: block;
            position: relative;
            margin-top: .6rem;

            .money{
              .unit{
                font-size: .36rem;
              }

              .number{
                font-size: .36rem;
                color: #d61e5a;
                line-height: .6rem;
              }
            }

            .goSplice{
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              margin-top: .2rem;
              p{
                font-size: .28rem;
                line-height: .60rem;
              }
            }

            .activ{
              position: absolute;
              top: -.6rem;
              left: 0rem;
            }
          }
        }
      }
    }
    .goodsList{
      padding-bottom: .8rem;
    }
    .list{
      display: flex;
      flex-direction: row;
      padding: .2rem .2rem .2rem .4rem;
      box-sizing: border-box;
      background: #ffffff;
      margin-bottom: .2rem;

      .imgBox{
        width: 2rem;
        height: 2.4rem;
        margin-right: .2rem;
        overflow: hidden;
        img{
          width: 100%;
          height: auto;
        }
      }

      .textBox{
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .titleBox{
          width: 4.6rem;
          font-size: .28rem;
          min-height: .74rem;
        }

        .moneyBox{
          margin-top: .7rem;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          position: relative;

          .money{
            .unit{
              font-size: .24rem;
              color: #d61e5a;
            }

            .number{
              font-size: .40rem;
              color: #d61e5a;
              line-height: .6rem;
            }

            .bot{
              font-size: .24rem;
              color: #d61e5a;
              border: 1px solid #d61e5a;
              line-height: .36rem;
              display: inline-block;
              height: .36rem;
              position: relative;
              top: -.07rem;
              padding: 0rem .1rem 0rem .1rem;
              border-radius: 3px;
            }

            .original{
              font-size: .24rem;
              color: #a7a4a5;
              text-decoration: line-through;
            }
          }

          .goSplice{

            .bot{
              width: 1.6rem;
              height: .56rem;
              color: white;
              background: red;
              background: linear-gradient(to right, #914fd5, #d069cc);
              text-align: center;
              font-size: .3rem;
              border-radius: 5px;
              line-height: .56rem;
            }

            p{
              font-size: .24rem;
              padding-top: .04rem;
              color: #a7a4a5;
              text-align: right;
            }
          }

          .activ{
            position: absolute;
            top: -.6rem;
            left: 0rem;
            background: linear-gradient(to right, #914fd5, #d069cc);
            color: white;
            padding: 1px .17rem 1px .17rem;
            border-radius: 4px 4px 4px 0px;
            font-size: .24rem;

            .icon{
              width: 9px;
              height: 9px;
              position: absolute;
              bottom: -8px;
              left: 0px;
            }
          }
        }
      }
    }

    .alertBack{
      position: fixed;
      width: 100%;
      height: 100%;
      display: flex;
      top: 0px;
      left: 0px;
      background: rgba(0,0,0,.59);
      justify-content: center;
      align-items: center;
      z-index: 1000;
      .imgBack{
        width: 4.46rem;
        height: 4.44rem;

        img{
          width: 4.46rem;
          height: 4.44rem;
        }
      }
    }
  }
</style>
