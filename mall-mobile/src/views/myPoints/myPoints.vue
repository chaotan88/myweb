<template>
  <div class="myPoints" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <div class="myPoints-bg-box">
      <div class="myPoints-bg">
        <div class="myPoints-t">
          <div class="myPoints-flex">
            <div class="myPoints-flex-l"><img src='../../assets/images/points.png'></div>
            <div class="myPoints-flex-r">
              <div>可消费积分</div>
              <div>{{totalIntegral.canConsumepointsTotal}}分</div>
            </div>
          </div>
          <div class="myPoints-code" @click="showCode">
            <div>
              <img src='../../assets/images/qrcode.png'>
              <x-icon type="ios-arrow-right" size="35"></x-icon>
            </div>
            <div>推荐赚积分</div>
          </div>
        </div>
        <div class="total-points"><span>累计总积分：{{totalIntegral.pointsTotal}}分</span></div>
      </div>
    </div>
    <!--积分信息标题-->
    <div class="integral-mess-box" id="integral-mess-box" :class="tabFixed ? 'tabFixedClass' : ''">
      <div class="integral-record">积分记录</div>
      <div class="integral-tab">
        <ul>
          <template v-for="(item, index) in tabBarData">
            <li :class="tabBarIndex == index ? 'active' : ''" @click="tabBar(index)">{{item}}</li>
          </template>
        </ul>
      </div>
    </div>
    <div v-bind:class="tabFixed ? 'tabFixedHei' : ''"></div>
    <!--列表-->
    <ul class="integral-list" v-if="!noData">
      <li class="integral-list-title">
        <div>日期</div>
        <div>来源</div>
        <div>积分</div>
      </li>
      <li v-for="item in pointsList">
        <div>{{item.invitationTime | formatDate(0)}}</div>
        <div>{{item.addSource | integralSourceFilter}}</div>
        <div>{{item.propertyAmount}}</div>
      </li>
    </ul>
    <!--loading-->
    <load-more :tip="loadingTitle" v-if="showLoading"></load-more>
    <!--内容-无数据-->
    <div v-if="noData" class="noDataContent-box"> 
      <div>暂无积分</div>     
    </div>
    <!--二维码-->
    <x-dialog  v-model="showQrcode"  :hide-on-blur="true" :dialog-style="{'text-align': 'left', width: '90%','max-height': '98%', 'max-width': '7.5rem','overflow-y': 'scroll'}">
      <div class="show-code-close" @click="showQrcode = false">
        <x-icon type="ios-close-empty" size="30"></x-icon>
      </div>
      <!-- <span>{{totalIntegral.recommendPoints}}</span> -->
      <div class="show-code-title">推荐好友注册可获得{{totalIntegral.recommendPoints}}积分</div>
      <div class="show-code-ewm">
        <qrcode :value="codeUrl" type="img" class="ewm"></qrcode>
        <p>二维码推荐</p>
        <!-- <a @click="saveImg" id="saveBtn">点击保存二维码</a> -->
      </div>
      <div class="extension-link">
        <div>链接推荐: {{codeUrl}}</div>
        <div class="copyBtn" v-bind:data-clipboard-text="codeUrl">复制链接</div>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import { XDialog, Qrcode, LoadMore } from 'vux'
  import Clipboard from 'clipboard' // 复制
  export default {
    components: {
      XDialog,
      Qrcode,
      LoadMore
    },
    data () {
      return {
        personalData: {},                      // 用户信息
        tabFixed: false,                       // 栏目是否固定
        showQrcode: false,                     // 显示二维码
        tabBarIndex: 0,
        totalIntegral: 0,                      // 总积分
        tabBarData: ['收入', '支出'],
        pointsType: 1,                         // 积分类型：1 收入 ，2 支出
        codeUrl: '',                           // 二维码链接
        pointsList: [],                        // 积分列表
        loadingTitle: '数据加载中',
        noData: true,                          // 列表是否有数据
        showLoading: false,                    // 是否显示加载loading
        busy: false,
        cover: false,                         // 是否是点击
        start: 1,                             // 当前页
        pageSize: 15,                         // 每页显示几条
        totalPage: 0                          // 总页数
      }
    },
    mounted: function () {
      this.getPersonalInfo()                 // 获取用户信息
      this.columnFixed()                     // 固定积分栏目
      this.getPointsTotal()                  // 获取总积分
      this.getPointsList()                   // 获取积分列表
      /**
       * 复制链接到粘贴板
       */
      const clipboard = new Clipboard('.copyBtn')
      clipboard.on('success', (e) => {
        this.$vux.toast.show({
          text: '复制成功',
          type: 'text',
          position: 'middle'
        })
      })
    },
    methods: {
      /**
       * 获取个人信息
      */
      getPersonalInfo () {
        this.$http.post(`${this.api.personalInfo}`, {
          id: JSON.parse(localStorage.getItem('bsbUserInfo')) ? JSON.parse(localStorage.getItem('bsbUserInfo')).userId : ''
        }).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          let resData = res.data.data
          this.personalData = resData
        })
      },
      /**
       * 显示二维码弹窗
      */
      showCode () {
        if (parseInt(this.personalData.bindStatus) === 0) {
          this.$router.push('/bindInviter')
        } else {
          this.showQrcode = true
        }
      },
      /**
       *页面滚动栏目固定
      */
      columnFixed () {
        var oDiv = document.getElementById('integral-mess-box')
        var H = 0
        H = oDiv.offsetTop
        this.columnHeight = H
        window.onscroll = () => {
          var s = document.body.scrollTop || document.documentElement.scrollTop
          if (s > H) {
            this.tabFixed = true
          } else {
            this.tabFixed = false
          }
        }
      },
      /**
       * tab切换
      */
      tabBar (index) {
        this.tabBarIndex = index
        this.pointsType = index + 1
        this.start = 1
        this.cover = true
        this.showLoading = false
        this.getPointsList()
      },
      /**
       * 获取积分信息
      */
      getPointsTotal () {
        this.$http.post(`${this.api.getPointsTotal}`).then((res) => {
          if (res.data.status !== this.api.ERR_OK || !res) return false
          let resData = res.data.data
          this.totalIntegral = resData
          // 拼接二维码url
          var codeUrl = window.location.href.match(/.*mshop/gi)[0] + '/index?invitationCode=' + resData.invitationCode
          this.codeUrl = codeUrl
        })
      },
      /**
       * 获取积分列表
      */
      getPointsList () {
        this.$http.post(this.api.getPointsList, {
          pointsType: this.pointsType,
          start: this.start,
          pageSize: this.pageSize
        }).then((res) => {
          this.busy = false // 重置busy状态
          this.showLoading = false
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          let resData = res.data.data
          // resData.list = resData.list.filter((row) => row.propertyAmount > 0)
          if (resData.list.length > 0) {
            resData.list.forEach((item) => {
              if (item.propertyAmount.toString().indexOf('-') > -1) {
                item.propertyAmount = item.propertyAmount
              } else {
                item.propertyAmount = '+' + item.propertyAmount
              }
            })
          }
          // resData.points = resData.points.indexOf('-') > -1 ? resData.points : '+' + resData.points
          this.noData = resData.list.length > 0 ? 0 : 1
          this.pointsList = this.cover ? resData.list : this.pointsList.concat(resData.list)
          this.start = this.start + 1 // 当前页数
          this.totalPage = resData.pages
        })
      },
      /**
       * 分页
      */
      loadMore () {
        this.cover = false
        this.busy = true // 加载状态
        if (!this.showLoading) {
          this.showLoading = true
          if (parseInt(this.start) > parseInt(this.totalPage)) {
            this.showLoading = false
            return
          }
        }
        this.getPointsList() // 分页数据
      }
    }
  }
</script>

<style  lang=less>
  .myPoints{
    .myPoints-bg-box{
      padding: .3rem .2rem;
      background: #fff;
      border-bottom: .3rem solid #eeeeee;
      .myPoints-bg{
        width: 7.1rem;
        height: 3.7rem;
        margin: 0 auto;
        padding: .46rem .39rem;
        box-sizing:border-box;
        background: url('../../assets/images/my/point-bg.png') no-repeat;
        background-size: 100% 100%;
        .myPoints-t{
          display: flex;
          .myPoints-flex{
            display:flex;
            flex: 1;
            .myPoints-flex-l{
              width: 1.16rem;
              height: .81rem;
              margin-right: .2rem;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .myPoints-flex-r{
              color: #fff;
              font-size: .4rem;
              div:nth-child(1){
                font-size:.24rem;
                margin-bottom: .1rem;
              }
            }
          }
          .myPoints-code{
            img{
              width: .95rem;
              height: .95rem;
              vertical-align: sub;
            }
            .vux-x-icon{
              fill: #fff;
            }
            div:nth-child(2) {
              color: #fff;
              font-size: .24rem;
              margin-top: .2rem;
            }
          }
        }
        .total-points{
          font-size: .24rem;
          color: #fff;
          text-align: center;
          margin-top: 1rem;;
          span{
            padding: .09rem .2rem;
            background: rgba(196,174,163,0.35);
            border-radius: 30px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            display: inline-block;
            max-width: 6rem;
          }
        }
      }
    }
    .tabFixedClass{
        position: fixed;
        top:0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 3000;
      }
    .tabFixedHei{
      height: 1.53rem;
    }
    .integral-mess-box{
      height:  1.53rem;
      background: #fff;
    }
    .integral-record{
      height: .84rem;
      border-bottom: 1px solid #dddddd;
      text-align: center;
      line-height: .84rem;
      color: #333333;
      font-size: .3rem;
      background: #fff;
    }
    .integral-tab{
      ul {
        display: flex;
        height: .69rem;
        align-items: center;
        li{
          height: .69rem;
          line-height: .69rem;
          flex: 1;
          text-align: center;
          color: #666666;
          font-size: .28rem;
          position: relative;
          &.active{
            color: #f95a58;
            &::before{
              content: '';
              width: 1.06rem;
              height: .04rem;
              background: #f95a58;
              display: block;
              position: absolute;
              left: 0;
              right: 0;
              margin: auto;
              top: 0;
            }
          }
        }
      }
    }
    .integral-list{
      /* min-height: calc(~"100vh - 0.84rem - 1px - .69rem"); */
      margin: .17rem;
      border: 1px solid #eeeeee;
      li{
        display: flex;
        height: .69rem;
        border-bottom: 1px solid #eeeeee;
        align-items: center;
        color: #666666;
        &.integral-list-title{
          background: #f6eeee;
          height: .49rem;
          color: #999999;
          border-bottom: none;
          font-size: .24rem;
          div:nth-child(3) {
            color: #999999;
          }
        }
        &:last-child{
          border-bottom: none;
        }
        div{
          flex: 1;
          text-align: center;
          font-size: .24rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 .1rem;
          &:nth-child(3) {
            color: #f95a58;
          }
        }
      }
    }
    /**弹窗**/
    .show-code-close{
      height: .8rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 .2rem;
      .vux-x-icon{
        fill: #666;
      }
    }
    .show-code-title{
      text-align: center;
      color: #333333;
      font-size: .36rem;
      margin-bottom: .34rem;
      span{
        color: #f95a58;
      }
    }
    .show-code-ewm{
      background: #f3f3f3; 
      padding: .3rem;
      margin: 0 .42rem;
      border-radius: 6px;
      .ewm{
        background: #fff;
        padding: .2rem;
        img{
          width: 100% !important;
          height: 5.1rem !important;
        }
      }
      p{
        color: #666666;
        font-size: .26rem;
        text-align: center;
        margin-top: .2rem;
      }
    }
    .extension-link{
      margin: .1rem .42rem .41rem .42rem;
      height: .6rem;
      background: #f3f3f3;
      border-radius: 30px;
      -webkit-border-radius: 30px;
      display: -webkit-box;
      display: -moz-box;
      display: -ms-box;
      position: relative;
      div:nth-child(1){
        width: 3.5rem;
        word-break: break-all;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: .24rem;
        color: #9c9c9c;
        line-height: .6rem;
        padding-left: .22rem;
      }
      div:nth-child(2){
        width: 1.95rem;
        height: .6rem;
        text-align: center;
        line-height: .6rem;
        border-radius: 30px;
        -webkit-border-radius: 30px;
        color: #fff;
        font-size: .24rem;
        position: absolute;
        right: 0;
        top:0;
        background: #f95a58;
      }
    }
     /*内容-无数据*/
    .noDataContent-box{
      text-align: center;
      margin-top:2rem;
      color:#999;
    }
  }

</style>