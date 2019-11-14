<template>
  <div class="activityList-warp" :style="{backgroundColor:activityInfoList.backgroundColor}">
    <!-- banner -->
    <div class="activityList-ban">
      <img :src="activityInfoList.mainImage | filterImgUrl">
    </div>
    <template v-for="(item, index) in activityInfoList.columnList" v-if="!noDataSte">
      <!-- 列表样式一 -->
      <div class="list-sty  list-sty-o" v-if="(index + 1 ) % 2 != 0 && item.columnGoodsList.length > 0">
        <div class="list-title">
          <span>{{item.columnName}}</span>
        </div>
        <div class="list-describe">{{item.description}}</div>
        <ul>
          <li v-for="ite in item.columnGoodsList">
            <div class="list-li-img">
              <img :src="ite.mainImage | filterImgUrl">
            </div>
            <div class="list-li-title">{{ite.goodsName}}</div>
            <div class="list-li-price"><span>¥</span>{{ite.whetherSpecial && ite.goodsSpecialPrice ? ite.goodsSpecialPrice : ite.goodsPrice}}</div>
            <div class="list-li-btn" @click="$router.push({path:'/goodDetail', query: {goodsId: ite.id}})" v-if="!InvitationCode">立即抢购</div>
            <div class="list-li-btn" @click="$router.push({path:'/goodDetail', query: {goodsId: ite.id, shareInvitationCode: InvitationCode}})" v-if="InvitationCode || InvitationCode !== ''">立即抢购</div>
          </li>
        </ul>
      </div>
      <!-- 列表样式二 -->
      <div class="list-sty list-sty-tw" v-if="(index + 1 ) % 2 == 0 && item.columnGoodsList.length > 0">
        <div class="list-title">
          <span>{{item.columnName}}</span>
        </div>
        <div class="list-describe">{{item.description}}</div>
        <ul>
          <li v-for="(ite, ind) in item.columnGoodsList" :class="(ind + 1) % 2 == 0 ? 'evenNum' : ''">
            <div class="list-li-img">
               <img :src="ite.mainImage | filterImgUrl">
            </div>
            <div class="list-li-con">
              <div class="con-title">{{ite.goodsName}}</div>
              <div class="con-price">
                <div>
                  <p>¥</p>
                  <p>活动价</p>
                </div>
                <div>{{ite.whetherSpecial && ite.goodsSpecialPrice ? ite.goodsSpecialPrice : ite.goodsPrice}}</div>
              </div>
              <div class="con-btn" @click="$router.push({path:'/goodDetail', query: {goodsId: ite.id}})" v-if="!InvitationCode">立即抢购</div>
              <div class="con-btn" @click="$router.push({path:'/goodDetail', query: {goodsId: ite.id, shareInvitationCode: InvitationCode}})" v-if="InvitationCode || InvitationCode !== ''">立即抢购</div>
            </div>
          </li>
        </ul>
      </div>
    </template>
    <!-- 暂无数据 -->
    <no-data v-if="noDataSte"></no-data>
  </div>
</template>
<script>
import noData from '../../components/noData'                        // 暂无数据
export default {
  components: {
    noData
  },
  data () {
    return {
      noDataSte: false,                        // 暂无数据
      activityInfoList: [],                     // 活动数据
      InvitationCode: ''                        // 分享的Code
    }
  },
  // 分享
  created () {
    let InvitationCode = this.$route.query.shareInvitationCode || ''
    if (InvitationCode || InvitationCode !== '') {
      this.InvitationCode = InvitationCode
      // console.log(this.InvitationCode)
    } else {
    }
  },
  mounted: function () {
    this.getActivityInfoList()                 // 获取活动列表
  },
  methods: {
    /**
     * 获取活动列表
    */
    getActivityInfoList () {
      this.$http.post(this.api.getActivityInfoList, {
        id: this.$route.query.id
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
          this.noDataSte = true
          return false
        }
        let arr = []
        if (resData.data.columnList.length > 0) {
          resData.data.columnList.forEach((item) => {
            if (item.columnGoodsList.length > 0) {
              arr.push(item)
            }
          })
          this.noDataSte = arr.length > 0 ? !!false : !!true
        } else {
          this.noDataSte = true
        }
        this.activityInfoList = resData.data
        // console.log(this.activityInfoList)
      }).finally(() => {
      })
    }
  }
}
</script>
<style lang="less">
.activityList-warp{
  height: calc(100vh);
  /*background: #5f32eb;*/
  overflow-y: scroll;
  .noDataTip{
    color: #fff;
  }
  .activityList-ban{
    min-height: 2rem;
    img{
      width: 100%;
      min-height: 2rem;
      display: block;
    }
  }
  /* 列表公共样式 */
  .list-sty{
    height: auto;
    overflow: hidden;
    background: #fff;
    margin: 0 .2rem;
    border-radius: 6px;
    padding: .6rem .2rem 0 .2rem;
    margin-bottom: .35rem;
    .list-title{
      width: 100%;
      height: 1.29rem;
      text-align: center;
      background: url('../../assets/images/action/activity-list-title.png') no-repeat;
      background-size:  100% 1.29rem;
      span{
        max-width: 3.45rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        line-height: .65rem;
        color: #fff;
        font-size: .4rem;
      }
    }
    .list-describe{
      text-align: center;
      font-size: .2rem;
      color: #9d43f3;
      max-width: 3rem;
      margin: 0 auto;
      margin-top: -.13rem;
      display: -webkit-box;
      display: -moz-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
  /* 列表样式一 */
  .list-sty-o{
    ul{
      margin-top: .4rem;
      height: auto;
      overflow: hidden;
      li{
        float: left;
        width: 2rem;
        height: 4rem;
        margin-right: .35rem;
        margin-bottom: .35rem;
        text-align: center;
        position: relative;
        &:nth-child(3n){
          margin-right: 0;
        }
        .list-li-img{
          width: 2rem;
          height: 2rem;
          img{
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .list-li-title{
          font-size: .2rem;
          color: #9741f1;
          display: -webkit-box;
          display: -moz-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          margin-top: .15rem;
        }
        .list-li-price{
          color: #f54455;
          font-size: .4rem;
          position: absolute;
          bottom: .5rem;
          left: 0;
          right: 0;
          text-align: center;
          margin: .1rem auto;
          span{
            font-size: .24rem;
          }
        }
        .list-li-btn{
          width: 1.22rem;
          height: .4rem;
          border-radius: 30px;
          text-align: center;
          line-height: .4rem;
          font-size: .2rem;
          color: #fff;
          background: linear-gradient(#f55640, #f64158);
          background: -webkit-linear-gradient(#f55640, #f64158);
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }
  }
  /* 列表样式二 */
  .list-sty-tw{
    padding: .6rem .1rem 0 .1rem;
    ul{
      margin-top: .4rem;
      height: auto;
      overflow: hidden;
      li{
        display: flex;
        align-items: center;
        padding: .46rem 0;
        background: url('../../assets/images/action/activity-list-line.png') no-repeat;
        background-position: center bottom;
        background-size: 100% .06rem;
        &:last-child{
          background: none;
        }
        &.evenNum{
          -webkit-flex-flow: row-reverse wrap;
          flex-flow: row-reverse wrap;
          .list-li-img{
            margin-left: .2rem;
          }
        }
        .list-li-img{
          width: 3.35rem;
          height: 3.35rem;
          margin-right: .2rem;
          img{
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .list-li-con{
          flex: 1;
          .con-title{
            font-size: .28rem;
            color: #5423bc;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            margin-top: .15rem;
            font-weight: bold;
          }
          .con-price{
            display: flex;
            align-items: center;
            margin-top: .3rem;
            div:nth-child(1){
              margin-right: .15rem;
              p{
                text-align: right;
                font-size: .24rem;
                color: #f54455;
                line-height: .28rem;
                &:nth-child(1){
                  font-weight: bold;
                }
              }
            }
            div:nth-child(2){
              font-size: .4rem;
              color: #f54455;
            }
          }
          .con-btn{
            width: 1.22rem;
            height: .4rem;
            border-radius: 30px;
            text-align: center;
            line-height: .4rem;
            font-size: .2rem;
            color: #fff;
            background: linear-gradient(#f55640, #f64158);
            background: -webkit-linear-gradient(#f55640, #f64158);
            margin-top: .1rem;
          }
        }
      }
    }
  }
}
</style>

