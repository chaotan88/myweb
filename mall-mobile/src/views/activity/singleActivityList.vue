<template>
  <div class="activityList-warp">
    <!-- banner -->
    <div class="activityList-ban">
      <img :src="mainImage | filterImgUrl">
    </div>
    <!-- 默认主题 -->
    <template v-if="parseInt(themeConfig) === 0">
      <div class="theme-def" v-if="!noDataSte && activityInfoList.length > 0" :style="{backgroundColor:bgColorMa}">
        <ul>
          <li v-for="item in activityInfoList">
            <div class="list-li-img">
              <img :src="item.mainImage | filterImgUrl">
            </div>
            <div class="list-li-title">{{item.goodsName}}</div>
            <div class="list-li-price"><span>￥</span>{{item.whetherSpecial && item.goodsSpecialPrice ? item.goodsSpecialPrice : item.goodsPrice}}</div>
            <div class="list-li-btn" @click="$router.push({path:'/goodDetail', query: {goodsId: item.id}})" :style="{backgroundColor:bgColorMa}" v-if="!InvitationCode">立即抢购</div>
            <div class="list-li-btn" @click="$router.push({path:'/goodDetail', query: {goodsId: item.id, shareInvitationCode: InvitationCode}})" :style="{backgroundColor:bgColorMa}" v-if="InvitationCode || InvitationCode !== ''">立即抢购</div>
          </li>
        </ul>
      </div>
    </template>
    <!-- 双十一主题 -->
    <template v-if="parseInt(themeConfig) === 1">
      <div class="theme-one" v-if="!noDataSte && activityInfoList.length > 0" :style="{backgroundColor:bgColorMa}">
        <div class="theme-con">
          <div class="con-title">
            <span>{{columnName}}</span>
          </div>
          <ul>
            <li v-for="item in activityInfoList">
              <div class="con-li-img">
                <img :src="item.mainImage | filterImgUrl">
              </div>
              <div class="con-li-title">{{item.goodsName}}</div>
              <div class="con-li-price"><span>￥</span>{{item.whetherSpecial && item.goodsSpecialPrice ? item.goodsSpecialPrice : item.goodsPrice}}</div>
              <div class="con-li-btn" @click="$router.push({path:'/goodDetail', query: {goodsId: item.id}})" v-if="!InvitationCode">立即抢购</div>
              <div class="con-li-btn" @click="$router.push({path:'/goodDetail', query: {goodsId: item.id, shareInvitationCode: InvitationCode}})" v-if="InvitationCode || InvitationCode !== ''">立即抢购</div>
            </li>
          </ul>
        </div>
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
        mainImage: '',                           // 主图
        columnName: '',                          // 单区名称
        themeConfig: '',                         // 主题配置
        activityInfoList: [],                     // 活动数据
        bgColorMa: '',                            // 背景颜色变化
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
          // console.log(resData)
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            this.noDataSte = true
            return false
          }
          this.noDataSte = resData.data.columnList.length > 0 && resData.data.columnList[0].columnGoodsList.length > 0 ? !!false : !!true
          this.mainImage = resData.data.mainImage
          if (resData.data.columnList.length > 0) {
            this.activityInfoList = resData.data.columnList[0].columnGoodsList
          }
          this.columnName = resData.data.columnName
          this.themeConfig = resData.data.themeConfig
          // console.log(this.themeConfig)
          this.bgColorMa = resData.data.backgroundColor
          // console.log(this.bgColorMa)
        }).finally(() => {
        })
      }
    }
  }
</script>
<style lang="less">
  .activityList-warp{
    background: #fff;
    .activityList-ban{
      // min-height: 2rem;
      img{
        width: 100%;
        // min-height: 2rem;
        display: block;
      }
    }
    /* 列表默认样式 */
    .theme-def{
      background: #5e8667;
      border-radius: 10px;
      margin-top: -.2rem;
      position: relative;
      z-index: 300;
      padding: .25rem .2rem;
      ul{
        height: auto;
        overflow: hidden;
        li{
          float: left;
          width: 2.3rem;
          height: 3.86rem;
          background: #fff;
          margin-right: .1rem;
          margin-bottom: .1rem;
          text-align: center;
          border-radius: 4px;
          position: relative;
          &:nth-child(3n){
            margin-right: 0;
          }
          .list-li-img{
            width: 1.33rem;
            height: 1.33rem;
            margin: 0 auto;
            img{
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .list-li-title{
            font-size: .24rem;
            color: #666666;
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            margin-top: .3rem;
            padding: 0 .1rem;
          }
          .list-li-price{
            color: #f54455;
            font-size: .4rem;
            // margin: .1rem 0;
            position: absolute;
            bottom: .88rem;
            left: 0;
            right: 0;
            margin: 0 auto;
            span{
              font-size: .24rem;
            }
          }
          .list-li-btn{
            width: 1.36rem;
            height: .4rem;
            border-radius: 30px;
            text-align: center;
            line-height: .4rem;
            font-size: .2rem;
            color: #fff5b0;
            background:#5f8868;
            position: absolute;
            bottom: .32rem;
            left: 0;
            right: 0;
            margin: 0 auto;
          }
        }
      }
    }
    /* 双十一样式 */
    .theme-one{
      background: #5f32eb;
      padding: .25rem 0;
      .theme-con{
        height: auto;
        overflow: hidden;
        background: #fff;
        margin: 0 .2rem;
        border-radius: 6px;
        padding: .6rem .2rem .35rem .2rem;
        .con-title{
          width: 100%;
          height: 1.29rem;
          text-align: center;
          background: url('../../assets/images/action/activity-list-title.png') no-repeat;
          background-size: 100% 1.29rem;
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
            .con-li-img{
              width: 2rem;
              height: 2rem;
              img{
                width: 100%;
                height: 100%;
                display: block;
              }
            }
            .con-li-title{
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
            .con-li-price{
              color: #f54455;
              font-size: .4rem;
              position: absolute;
              bottom: .5rem;
              left: 0;
              right: 0;
              text-align: center;
              margin: .1rem auto;
            }
            .con-li-btn{
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
    }

  }
</style>

