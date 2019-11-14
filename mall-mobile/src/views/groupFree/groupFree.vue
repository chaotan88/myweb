<template>
  <div>
    <div class="groupFree-wrap">
      <div class="groupInfo">
        <div class="group-top">
          <div class="group-img">
            <img :src="greeData.mainImage | filterImgUrl"/>
          </div>
          <div class="group-text">
            <div>{{greeData.goodsName}}</div>
            <div><span>{{greeData.groupNum}}</span>人拼单,已拼<span>{{greeData.hasGroupPeople}}</span>件</div>
            <div><span>￥0.01</span><span>￥{{greeData.goodsGroupPrice}}</span></div>
          </div>
        </div>
        <div class="group-line"></div>
        <div class="group-title">拼团成功获得</div>
        <div class="group-prizes">
          <div>
            <img :src="group01"/>
            <p>免费获得商品</p>
          </div>
          <div><img :src="group07"/></div>
          <div>
            <img :src="group02"/>
            <p>预计最大收益: <span>{{greeData.expectedReturn}}</span>元</p>
          </div>
        </div>
      </div>
      <div class="groupControl">
        <group>
          <x-switch title="是否在平台显示" v-model="value" @on-change="changeValue"></x-switch>
        </group>
      </div>
      <div class="groupPeople">
        <div class="group-remain">还差<span>{{greeData.groupNum - 1}}</span>人</div>
        <div class="group-head">
<!--          <div class="head-first">-->
<!--            <div>-->
<!--              <img :src="group03"/>-->
<!--            </div>-->
<!--            <div>团长</div>-->
<!--          </div>-->
          <div class="head-next" v-for="(item, index) in userList"><img :src="item.img"/></div>
        </div>
        <div class="group-dough" @click="goGroupSuccess">立即开团</div></div>
      </div>
  </div>
</template>
<script>
  import { XSwitch, Group, Cell } from 'vux'
  export default {
    name: 'groupFree',
    components: {
      XSwitch,
      Group,
      Cell
    },
    data () {
      return {
        title: '是否在平台显示',
        value: false,
        greeData: {},
        group01: require('../../assets/images/groupBooking/group01.png'),
        group02: require('../../assets/images/groupBooking/group02.png'),
        group03: require('../../assets/images/groupImg/tz.png'),
        group04: require('../../assets/images/groupImg/deflt.png'),
        group05: require('../../assets/images/groupImg/gd.png'),
        group06: require('../../assets/images/groupBooking/group06.png'),
        group07: require('../../assets/images/groupBooking/add1.png'),
        group08: require('../../assets/images/groupBooking/add2.png'),
        oderData: '',
        userList: []
      }
    },
    mounted: function () {
      this.getStartGroupInfo()
    },
    created () {
      this.oderData = JSON.parse(localStorage.getItem('confirmOrderInfo') || '{}')
    },
    methods: {
      changeValue (val) {
//        console.log(val)
      },
      goGroupSuccess () {
        this.oderData[0].isTerraceShow = this.value
        localStorage.setItem('confirmOrderInfo', JSON.stringify(this.oderData))
        this.routerReplace({path: '/confirmOrder'})
      },
      /**
       *获取开团信息
       * */
      getStartGroupInfo () {
        this.$http.get(`${this.api.getStartGroupInfo}`, {
          params: {
            skuId: this.$route.query.skuId
          }
        }).then((res) => {
          // console.log(res)
          if (res.data.status === '1') {
            this.greeData = res.data.data
            this.userList = []
            let line = (res.data.data.groupNum - 1) > 5 ? 5 : res.data.data.groupNum - 1
            for (let i = 0; i < line; i++) {
              // groupNum大于7个, 最后一个图片是group05 其它是 group04
              let pu = ((i === line - 1) && (res.data.data.groupNum >= 7)) ? {img: this.group05} : {img: this.group04}
              this.userList.push(pu)
            }
          }
        })
      }
    }
  }
</script>
<style scoped lang=less>
  .groupFree-wrap{
    width: 100%;
    max-width: 7.5rem;
    min-height: 100vh;
    background: #f1f2f5;
    overflow: hidden;
    .groupInfo{
      width: 6.62rem;
      margin: 0.2rem;
      padding: 0.32rem 0.24rem;
      -webkit-border-radius: 0.1rem;
      -moz-border-radius: 0.1rem;
      border-radius: 0.1rem;
      background: #fff;
      .group-top{
        display: flex;
        height: 2.18rem;
        .group-img{
          width: 1.92rem;
          height: 2.18rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .group-text{
          width: 3.93rem;
          height: 2.18rem;
          margin-left: 0.74rem;
          div{
            &:nth-of-type(1) {
              white-space: normal;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              font-size: 0.28rem;
              color: #333;
              line-height: 0.35rem;
            }
            &:nth-of-type(2) {
              width: 2.33rem;
              height: 0.3rem;
              /*line-height: 0.3rem;*/
              background: #F98B38;
              -webkit-border-radius: 0.06rem;
              -moz-border-radius: 0.06rem;
              border-radius: 0.06rem;
              color: #ffffff;
              font-size: 0.2rem;
              text-align: center;
              margin-top: 0.21rem;
            }
            &:nth-of-type(3) {
              margin-top: 0.65rem;
              span{
                line-height: 0.39rem;
                &:nth-of-type(1) {
                  font-size: 0.32rem;
                  color: #F82828;
                  font-weight: 600;
                }
                &:nth-of-type(2) {
                  font-size: 0.26rem;
                  color: #999999;
                  text-decoration: line-through;
                }
              }
            }
          }
        }
      }
      .group-line{
        width: 6.3rem;
        height: 0.02rem;
        background: #B5B5B5;
        margin: 0.15rem 0.155rem 0.38rem 0.155rem;
      }
      .group-title{
        color: #F82828;
        font-size: 0.3rem;
        text-align: center;
        margin-bottom: 0.34rem;
      }
      .group-prizes{
        display: flex;
        justify-content: center;
        color: #F82828;
        font-size: 0.24rem;
        font-weight: lighter;
        align-items: center;
        div{
          &:nth-of-type(1) {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            img{
              width: 0.58rem;
              height: 0.58rem;
            }
            p{
              margin-top: 0.17rem;
            }
          }
          &:nth-of-type(2) {
            width: 0.24rem;
            height: 0.24rem;
            margin: 0 0.45rem 0 0.59rem;
            font-weight: 700;
            img{
              width: 0.24rem;
              height: 0.24rem;
              display: block;
            }
          }
          &:nth-of-type(3) {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            img{
              width: 0.58rem;
              height: 0.58rem;
            }
            p{
              margin-top: 0.17rem;
            }
          }
        }
      }
    }
    .groupPeople{
      width: 7.1rem;
      height: 3.55rem;
      margin: 0 0.2rem;
      -webkit-border-radius: 0.1rem;
      -moz-border-radius: 0.1rem;
      border-radius: 0.1rem;
      background: #fff;
      .group-remain{
        text-align: center;
        color: #333333;
        font-size: 0.28rem;
        font-weight: 600;
        margin-bottom: 0.52rem;
        padding-top: 0.29rem;
        span{
          color: #F82828;
        }
      }
      .group-head{
        display: flex;
        margin: 0 0.44rem;
        justify-content: space-around;
        .head-first{
          width: 0.98rem;
          height: 1.06rem;
          div{
            &:nth-of-type(1) {
              width: 0.82rem;
              height: 0.82rem;
              margin: 0 0.08rem;
              -webkit-border-radius: 50%;
              -moz-border-radius: 50%;
              border-radius: 50%;
              img{
                width: 100%;
                height: 100%;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                border-radius: 50%;
              }
            }
            &:nth-of-type(2) {
              /*height: 0.35rem;*/
              /*line-height: 0.35rem;*/
              text-align: center;
              background: #F82828;
              color: #fff;
              -webkit-border-radius: 0.6rem;
              -moz-border-radius: 0.6rem;
              border-radius: 0.6rem;
              position: relative;
              top: -0.11rem;
              font-size: 0.24rem;
            }
          }
        }
        .head-next{
          width: 0.82rem;
          height: 0.82rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .head-last{
          width: 0.82rem;
          height: 0.82rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .group-dough{
        width: 6rem;
        height: 0.78rem;
        line-height: 0.78rem;
        text-align: center;
        color: #fff;
        font-size: 0.3rem;
        background: #F82828;
        margin-left: 0.51rem;
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
        margin-top: 0.23rem;
      }
    }
    .groupControl{
      width: 7.1rem;
      height: 0.86rem;
      line-height: 0.86rem;
      margin: 0.2rem;
      -webkit-border-radius: 0.1rem;
      -moz-border-radius: 0.1rem;
      border-radius: 0.1rem;
      background: #fff;
    }
  }
</style>
<style>
  .weui-switch{
    /*border-color: #f82828!important;*/
    background-color: #f82828!important;
  }
  .weui-switch:checked{
    border-color: #f82828!important;
  }
</style>
