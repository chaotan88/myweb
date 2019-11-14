<template>
  <div class="spliceOder-wap">
    <div v-if="detail.goodsId">
      <section class="goodsList">
        <div class="list">
          <div class="imgBox">
            <img :src="detail.mainImage" />
          </div>
          <div class="textBox">
            <div class="titleBox">
              <p>{{detail.goodsName}}</p>
            </div>
            <div class="moneyBox">
              <div class="money">
                <p></p>
                <p class="cop"> <span> {{groupDeailList.length}}人拼单 </span>  <span></span> <span class="">● 已拼{{detail.countNum}}人</span> </p>
                <p> <span class="unit">￥</span> <span class="number"> {{detail.goodsGroupPrice}} </span> <span class="originalNumber original">￥ {{detail.goodsPrice}}</span> </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="addBox">
        <div class="add">
          <div class="title">
            <p class="timeOut" v-show="detail.time>0 && detail.fewNum"> <span >仅剩{{detail.fewNum | fewNumFn}}个名额， </span>{{detail.D ? detail.D + '天': ''}} {{detail.H + ' : ' + detail.T + ' : ' + detail.S}} 后结束</p>
            <p class="timeOut" v-show="detail.time<=0"> 该拼团已结束</p>
            <p class="timeOut" v-show="detail.fewNum<=0"> 人员已满</p>
          </div>
          <div class="bot" @click="goChart(groupId, detail.time, detail.fewNum)">
            {{ detail.fewNum <= 0 ? '我来发起拼单' : '我也参与'}}
          </div>
          <div class="addMain" :style="'height:' + height + ';transition: height 1s;'">
            <div class="etime" v-for="(etim, index) in groupDeailList" :key="index">
              <div class="botByEtime">
                {{etim.ifHeadUser | ifHeadUser}}
              </div>
              <div class="textCop" >
                {{etim.userPhone | phoneSubstring }}
              </div>
            </div>
          </div>
          <p class="seeAll" v-show="groupDeailList.length > 3" @click="numberH()">
            查看更多参团人员
          </p>
        </div>
      </section>
      <section class="tabel" v-show="groupList.length>0">
        <div class="more">
          <p class="moreTitle"> 或参加别人的拼单 </p>
        </div>
        <div class="cent">
          <div class="tableList" v-for="(etim, index) in groupList">
            <div class="etime">
              <p class="etimePhone">{{etim.userPhone | phoneSubstringTop}}</p>
            </div>
            <div class="etime">
              <p>还差 <span class="number">{{etim.fewNum}}人</span> 拼成</p>
              <p>{{etim.D ? etim.D + '天': ''}} {{etim.H + ' : ' + etim.T + ' : ' + etim.S}} 后结束</p>
            </div>
            <div class="etime" style="text-align: right">
              <div class="bot" @click="goChart(etim.id, etim.time, etim.fewNum)"> 去拼单</div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div v-show="!detail.goodsId" style="line-height: 5rem;text-align: center;color: #999">
      找不到此拼团了
    </div>
  </div>
</template>

<script>
  import { LoadMore } from 'vux'
  export default {
    components: {
      LoadMore
    },
    created () {
      this.param = {
        orderNo: this.$route.query.orderNo
      }
    },
    data () {
      return {
        height: '1rem',
        grouPage: {
          page: 1,
          pageSize: 1000
        },
        timer: null,             // 定时器
        detail: {},              // 商品详情
        groupDeailList: [],       // 拼团人员详情
        groupList: []
      }
    },

    mounted () {
      this.getGroupJoin()
    },

    methods: {
      // 计算高度
      numberH () {
        if (this.groupList.length > 3) {
          this.height = Math.ceil(this.groupList.length / 3) * 0.7 + 'rem'
        }
      },
//    -参与详情
      getGroupJoin () {
        this.$http.get(`${this.api.getGroupJoin}`, {
          params: this.param
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            var resD = resData.data
            var time = resD.endTime - resD.currentTime
            var timeD = this.timeOutFn(time)
            this.goodsId = resD.goodsId || ''
            this.themeId = resD.themeId || ''
            this.groupId = resD.groupId || ''
            var dat = {
              goodsId: resD.goodsId,                   // 商品id
              goodsName: resD.goodsName,               // 商品名称
              goodsPrice: resD.goodsPrice,             // 商品价格
              goodsGroupPrice: resD.goodsGroupPrice,   // 拼团价格
              activityImage: resD.activityImage,       // 图片
              mainImage: resD.mainImage,
              groupNum: resD.groupNum,                 // 开团人数
              countNum: resD.countNum,                 // 拼团件数
              fewNum: resD.fewNum,                     // 剩余人数
              endTime: resD.endTime,                   // 结束时间
              currentTime: resD.currentTime,           // 服务器当前时间
              time: time,                              // 剩余时间戳
              D: timeD.D,                              // 剩余天
              H: timeD.H,                              // 剩余小时
              T: timeD.T,                              // 剩余分钟
              S: timeD.S                               // 剩余秒
            }
            this.detail = dat
            this.groupDeailList = resD.groupDeailList
            this.getGroupList()
          } else if (parseInt(resData.status) === 9931) {
            this.$router.push({name: 'goodDetail', query: {goodsId: resData.data.goodsId}})
          }
        })
      },
      /**
       * 倒计时
       */
      timeOutFn (time) {
        if (time <= 0) {
          return {D: 0, H: '00', T: '00', S: '00'}
        }
        var D = parseInt(time / 86400000)                                // 天
        var H = parseInt((time % 86400000) / 3600000)                   // 小时
        var T = parseInt(((time % 86400000) % 3600000) / 60000)           // 小时
        var S = parseInt((((time % 86400000) % 3600000) % 60000) / 1000)  // 秒

        if (H < 10) {
          H = '0' + H
        }
        if (T < 10) {
          T = '0' + T
        }
        if (S < 10) {
          S = '0' + S
        }
        var res = {D, H, T, S}
        return res
      },
      /**
       * 界面统一执行定时器
       */
      timeO () {
        this.timer = setInterval(() => {
          if (this.detail.time <= 0) {
            this.detail.time = 0
          } else {
            this.detail.time = this.detail.time - 1000
          }
          var timeB = this.timeOutFn(this.detail.time)
          this.detail.D = timeB.D
          this.detail.T = timeB.T
          this.detail.H = timeB.H
          this.detail.S = timeB.S
          for (let i in this.groupList) {
            if (this.groupList[i].time <= 0) {
              this.groupList[i].time = 0
            } else {
              this.groupList[i].time = this.groupList[i].time - 1000
            }
            var resTime = this.timeOutFn(this.groupList[i].time)
            this.groupList[i].D = resTime.D
            this.groupList[i].H = resTime.H
            this.groupList[i].T = resTime.T
            this.groupList[i].S = resTime.S
          }
        }, 1000)
      },
      /**
       * 拼团列表
       */
      getGroupList () {
        this.$http.post(`${this.api.getGroupList}`, {
          start: this.grouPage.page,
          pageSize: this.grouPage.pageSize,
          themeId: this.themeId,
          goodsId: this.goodsId
        }).then((res) => {
          var resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            var listData = resData.data.list
            for (let i in listData) {
              var time = listData[i].endTime - resData.data.currentTime
              var resTime = this.timeOutFn(time)
              listData[i].D = resTime.D
              listData[i].H = resTime.H
              listData[i].T = resTime.T
              listData[i].S = resTime.S
              listData[i].time = time
            }
            this.groupList = listData
            this.timeO()
          }
        })
      },
      /**
       * 去拼团
       */
      goChart (groupId, time, fewNum) {
        if (time <= 0) {
          this.$vux.toast.text('该拼已经结束')
          return false
        }
        if (fewNum) {
          this.$router.push({name: 'goodDetail', query: {goodsId: this.goodsId, themeId: this.themeId, groupId: groupId}})
        } else {
          this.$router.push({name: 'goodDetail', query: {goodsId: this.goodsId, themeId: this.themeId}})
        }
      }
    },
    beforeDestroy () {
      // 清除定时器
      clearInterval(this.timer)
    }
  }
</script>

<style lang="less" scoped>
  .spliceOder-wap{
    min-height: 13.34rem;
    background-color: #fff;

    .list{
      display: flex;
      flex-direction: row;
      padding: .4rem .2rem .2rem .2rem;
      box-sizing: border-box;
      background: #ffffff;

      .imgBox{
        width: 2.2rem;
        height: 2.7rem;
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
        }

        .moneyBox{
          margin-top: .65rem;

          .money{
            .cop{
              color: #999999;
              font-size: .24rem;
              padding-bottom: .1rem;
            }
            .unit{
              font-size: .32rem;
              color: #d61e5a;
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
              text-decoration: line-through;
            }
            .number{
              font-size: .5rem;
              color: #d61e5a;
              line-height: .6rem;
            }

            .originalNumber{
              font-size: .32rem;
              color: #666666;
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

            }
          }
        }
      }
    }

    .addBox{
      border-top: 1px solid #f4f4f4;
      padding: .2rem .2rem .2rem .2rem;

      .title{
        width: 100%;
        text-align: center;

        p{
          font-size: .28rem;
        }
      }

      .bot{
        width: 6.34rem;
        height: .92rem;
        border-radius: .46rem;
        background: #fb0c12;
        margin: auto;
        margin-top: .2rem;
        color: white;
        font-size: .28rem;
        text-align: center;
        line-height: .92rem;
      }

      .addMain{
        display: flex;
        flex-direction: row;
        width: 6rem;
        margin: auto;
        flex-wrap: wrap;
        overflow-y: hidden;

       .etime{
         width: 2rem;
         text-align: center;

         .botByEtime{
           width: 1rem;
           height: .4rem;
           line-height: .4rem;
           margin: auto;
           background: #ffb400;
           font-size: .24rem;
           border-radius: 4px;
           color: white;
           margin-top: .2rem;
           margin-bottom: .05rem;
         }

         .textCop{
           width: 100%;
           text-align: center;
           color: #666666;
           font-size: .24rem;
         }
       }
      }
    }

    .seeAll{
      text-align: center;
      color: #666666;
      font-size: .24rem;
      padding-top: .2rem;
    }

    .tabel{
      width: 6.98rem;
      margin: auto;
      box-sizing: border-box;
      padding: .1rem .3rem .3rem .3rem;
      background: #fde6e8;

      .more{
        width: 100%;
        color: #f7777d;
        margin-top: .4rem;
        border-top: 1px solid #f7777d;

        p{
          font-size: .28rem;
          width: 2.44rem;
          height: .35rem;
          margin: auto;
          position: relative;
          top: -0.22rem;
          background: #fde6e8;
          text-align: center;
        }
      }

      .cent{
        overflow-y: scroll;
        height: 4rem;
        .tableList{
          display: flex;
          flex-direction: row;
          margin-bottom: .2rem;
          justify-content: space-between;
          .etime{
            font-size: .24rem;
            color: #7d7a7a;
            text-align: center;

            .etimePhone{
              text-align: left;
              line-height: .7rem;
              height: .7rem;
            }

            .number{
              color: #f22839;
            }
          }

          .bot{
            display: inline-block;
            width: 1.28rem;
            height: .5rem;
            text-align: center;
            line-height: .5rem;
            border: solid 1px #f22839;
            color: #f22839;
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>
