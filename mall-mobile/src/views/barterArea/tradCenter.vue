<template>
  <div class="barterPage">
    <div class="header-nav-wrap">
      <div class="mycaozuo" v-for="(item, index) in headNav" :key="index" @click="tabTap(item, index)" :class="morenIndex === index ? 'morenIndexCss': ''">{{item.name}}</div>
    </div>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
      <!--收藏-->
      <div v-show="morenIndex === 0" style="margin: 1rem 0 1.3rem 0;">
        <div class="myshoucang" v-for="(item, index) in getAttCollectListData" :key="index" v-if="getAttCollectListData.length > 0">
          <div class="list-user-wrap">
            <div style="display: flex;">
              <!--<div class="list-user-img"><img :src="item.goodsImageUrls"/></div>-->
              <div class="list-user-area">
                <p v-if="item.phone">{{item.phone | phoneSubstringTop}}</p>
                <p v-if="item.address">发布于{{item.address}}</p>
              </div>
            </div>
            <div class="list-user-telcc">￥{{item.goodsPrice | moneyFilter}}</div>
          </div>
          <div class="list-user-info">{{item.goodsTitle}}</div>
          <div class="list-user-nav">
            <ul>
              <li><img :src="item.mainImage"/></li>
              <li v-for="(itm, ind) in item.goodsImageUrls" v-if="ind <= 2 && itm.length > 0"><img :src="itm"/></li>
            </ul>
          </div>
          <div class="list-user-uuid">
            <p>{{item.publishTime | formatDate(1)}}发布</p>
            <!--<p><span>{{item.viewCount}}</span>人浏览</p>-->
            <p><span>{{item.collectCount}}</span>人收藏</p>
          </div>
          <div class="list-user-foot">
            <div class="quxiao" @click="goQuxiao(item, index)">取消收藏</div>
            <div class="chakan" @click="goDetail(item, index)">查看详情</div>
          </div>
        </div>
        <div v-if="getAttCollectListData.length === 0" class="noDataLenght">暂无收藏记录</div>
      </div>
      <!--发布-->
      <div v-show="morenIndex === 1" style="margin-top: 1rem;">
        <div class="myfabu" v-for="(ite, ind) in getUserAttInfoListData" :key="ind" v-if="getUserAttInfoListData.length > 0">
          <div class="fabu-top">
            <div><img :src="ite.mainImage"/></div>
            <div>
              <p class="p-title">{{ite.goodsTitle}}</p>
              <p class="p-price">￥{{ite.goodsPrice | moneyFilter}}</p>
            </div>
            <div v-if="ite.auditStatus === 1">审核中</div>
            <div v-if="ite.auditStatus === 3">审核不通过</div>
            <!--<div v-if="ite.auditStatus === 2 && ite.goodsStatus === 1">已上架</div>-->
            <div v-if="ite.auditStatus === 2 && ite.goodsStatus === 2">已下架</div>
          </div>
          <div class="fabu-uuid">
            <p>{{ite.publishTime | formatDate(1)}}&nbsp;&nbsp;发布</p>
            <!--<p><span>{{ite.viewCount}}</span>人浏览</p>-->
            <p><span>{{ite.collectCount}}</span>人收藏</p>
          </div>
          <div class="fabu-foot">
            <div class="foot-right">
              <div class="quxiao" v-if="ite.auditStatus === 2 && ite.goodsStatus === 1" @click="showG(ite, ind)">下架</div>
              <div class="quxiao" v-if="ite.auditStatus === 2 && ite.goodsStatus === 2">已下架</div>
              <div class="chakan" @click="goEdit(ite, ind)">编辑</div>
            </div>
          </div>
        </div>
        <div v-if="noData" class="noDataLenght">{{textList[morenIndex]}}</div>
        <load-more :tip="loadingTitle" v-if="showLoading"></load-more>
      </div>
    </div>
    <x-dialog v-model="show" class="dialog-demo">
      <div class="xiajia-box">
        <p>确认是否下架</p>
        <div class="qd-btn">
          <div @click="hideShow">否</div>
          <div @click="soldOut" >是</div>
        </div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
  import { LoadMore, XDialog } from 'vux'
  export default {
    name: 'barterArea',
    data () {
      return {
        cuv: false,
        show: false,
        xjId: null,
        attId: null,
        morenIndex: 0,
        loadingTitle: '数据加载中',
        showLoading: false,                       // 是否显示加载loading
        busy: false,
        noData: false,                           // 无数据状态
        start: 1,                                // 当前页
        pageSize: 5,                             // 每页显示几条
        totalPage: 0,                            // 总页数
        headNav: [
          {
            name: '我收藏的'
          },
          {
            name: '我发布的'
          }
        ],
        textList: ['暂无收藏物品', '暂无发布记录'],
        ewm: require('../../assets/images/att/fkm.png'),
        getAttCollectListData: [], // 我的收藏列表
        getUserAttInfoListData: [] // 我的发布列表
      }
    },
    mounted () {
      this.getInvitationCode()
      let bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
      if (bsbUserInfo && bsbUserInfo.token) {
        this.getPersonalInfo()
        // 默认 收藏
        this.getAttCollectListData = []
        this.getUserAttInfoListData = []
        this.getAttCollectList()
      }
      this.checkLogin(() => {
        this.getPersonalInfo()
        // 默认 收藏
        this.getAttCollectListData = []
        this.getUserAttInfoListData = []
        this.getAttCollectList()
      }, () => {
        var isLogin = localStorage.getItem('ISLGOIN') || ''
        if (isLogin) {
          localStorage.removeItem('ISLGOIN')
          this.$router.replace({path: '/barterArea'})
        } else {
          localStorage.setItem('REDIRECT_URL', this.$router.currentRoute.fullPath)           // 保存页面重定向url
          localStorage.setItem('ISLGOIN', '1')
          this.$router.replace({path: '/login?attCode=' + 'A0001', query: this.$router.currentRoute.fullPath})
        }
      })
    },
    methods: {
      /**
       * 检测是否登录
       */
      checkLogin (fun, err) {
        this.$http.get(`${this.api.ifLogin}`, {
        }).then((res) => {
          let resData = res.data
          this.isLogin = res.data
          if (parseInt(resData.data) !== parseInt(this.api.ERR_OK)) {
            err()
            return false
          }
          fun()
        })
      },
      /**
       * Att\获取邀请码
       */
      getInvitationCode () {
        this.$http.post(`${this.api.getInvitationCode}`, {
        }).then((res) => {
          if (res.data.status === '1') {
            this.attId = res.data.data
            localStorage.setItem('attId', this.attId)
            // console.log(this.attId, 11111)
          }
        })
      },
      /**
       * 分页
       */
      loadMore () {
        this.showLoading = true
        if (!this.cuv) { return false } else {
          this.cuv = false
        }
        if (parseInt(this.start) > parseInt(this.totalPage)) {
          this.showLoading = false
          return
        }
        if (this.morenIndex === 0) {
          this.getAttCollectList()
        } else {
          this.getUserAttInfoList(2)
        }
      },
      tabTap (item, index) {
        this.cuv = false
        if (this.morenIndex === index) {
          return false
        }
        this.morenIndex = index
        this.start = 1
        window.scrollTo(0, 0)
        if (index === 0) {
          this.getAttCollectListData = []
          this.getAttCollectList()
        } else if (this.morenIndex === 1) {
          this.getUserAttInfoListData = []
          this.getUserAttInfoList()
        }
      },
      goDetail (item, index) {
        this.$router.push({path: '/barterDetails', query: {path: 2}})
        localStorage.setItem('detailData', JSON.stringify(item))
      },
      /**
       * 获取个人信息
       */
      getPersonalInfo () {
        this.$http.post(`${this.api.personalInfo}`, {
          id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId
        }).then((res) => {
          // console.log(res)
          if (res.data && res.data.status === '1') {
            let cardStatus = res.data.data.user.cardStatus
            if (cardStatus === 1) { // 未认证
              // 取标识
              let bs = localStorage.getItem('bs') || ''
              if (cardStatus === 1) { // 未认证
                // 存标识   1
                if (bs) {
                  localStorage.removeItem('bs')
                  this.$router.replace({path: '/barterArea'})
                } else {
                  localStorage.setItem('bs', '1')
                  this.$router.replace({path: '/realNameAuth', query: {types: 1, pageOrigin: 'set'}})
                }
              }
            }
          }
        })
      },
      /**
       * 我的收藏列表
       */
      getAttCollectList () {
        this.$http.post(`${this.api.getAttCollectList}`, {
          start: this.start,
          pageSize: this.pageSize
        }).then((res) => {
          this.cuv = true
          this.showLoading = false
          if (res.data && res.data.status === '1') {
            let resDate = res.data.data.list || []
            // console.log(this.getAttCollectListData)
            for (let i in resDate) {
              resDate[i].goodsImageUrls = resDate[i].goodsImageUrls.split(',')
            }
            this.getAttCollectListData = this.getAttCollectListData.concat(resDate)
            this.noData = this.getAttCollectListData.length > 0 ? 0 : 1
            this.start = this.start + 1 // 当前页数
            this.totalPage = res.data.data.pages // 总页数
          }
        })
      },
      /**
       * 我的发布列表
       */
      getUserAttInfoList (v) {
        this.$http.post(`${this.api.getUserAttInfoList}`, {
          start: this.start,
          pageSize: this.pageSize
        }).then((res) => {
          this.cuv = true
          this.showLoading = false
          if (res.data && res.data.status === '1') {
            let resDate = res.data.data.list || []
            console.log(resDate)
            console.log(this.getUserAttInfoListData)
            this.getUserAttInfoListData = this.getUserAttInfoListData.concat(resDate)
            this.noData = this.getUserAttInfoListData.length > 0 ? 0 : 1
            this.start = this.start + 1 // 当前页数
            this.totalPage = res.data.data.pages // 总页数
            // console.log(this.getUserAttInfoListData)
          }
        })
      },
      /**
       * 取消收藏
       */
      goQuxiao (v, i) {
        this.$http.post(`${this.api.updateCollectStatus}`, {
          attInfoId: v.attInfoId
        }).then((res) => {
          if (res.data && res.data.status === '1') {
            this.$vux.toast.text(res.data.msg)
            this.start = 1
            this.getAttCollectListData = []
            this.getAttCollectList()
          }
        })
      },
      /**
       * 下架
       */
      soldOut () {
        this.$http.post(`${this.api.updateGoodsStarus}`, {
          id: this.xjId
        }).then((res) => {
          if (res.data && res.data.status === '1') {
            this.$vux.toast.text(res.data.msg)
            this.show = false
            this.start = 1
            this.getUserAttInfoListData = []
            this.getUserAttInfoList('3')
          }
        })
      },
      hideShow () {
        this.show = false
      },
      showG (n, y) {
        this.xjId = n.id
        console.log(this.xjId)
        this.show = true
      },
      goEdit (n, y) {
        localStorage.setItem('editData', JSON.stringify((n)))
        this.$router.push({path: '/release', query: {id: n.id}})
      }
    },
    components: {
      LoadMore,
      XDialog
    }
  }
</script>

<style scoped lang="less">
  .barterPage{
    width: 7.5rem;
    height: 100vh;
    overflow-y: scroll;
    background: #f3f3f3;
    .header-nav-wrap{
      width: 7.5rem;
      height: 1rem;
      line-height: 1rem;
      display: flex;
      background: #e6e6e6;
      color: #888888;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 999;
      .mycaozuo{
        width: 3.75rem;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
      }
    }
    .myshoucang{
      margin-bottom: 0.24rem;
      background: #ffffff;
      /*height: 5.3rem;*/
      padding-left: 0.2rem;
      padding-top: 0.24rem;
      .list-user-wrap{
        width: 100%;
        height: 0.88rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .list-user-img{
          width: 0.88rem;
          height: 0.88rem;
          border-radius: 50%;
          img{
            width: 0.88rem;
            height: 0.88rem;
            border-radius: 50%;
          }
        }
        .list-user-area{
          font-size: 0.22rem;
          margin-left: 0.1rem;
          p{
            height: 0.42rem;
            line-height: 0.42rem;
          }
          p:nth-of-type(1) {
            color: #333333;
            font-size: 0.3rem;
          }
          p:nth-of-type(2) {
            color: #8f8f8f;
          }
        }
        .list-user-telcc{
          /*width: 1.95rem;*/
          height: 0.75rem;
          line-height: 0.75rem;
          text-align: center;
          font-weight: 700;
          color: #ff191d;
          font-size: 0.3rem;
          margin-right: 0.2rem;
          img{
            width: 0.4rem;
            height: 0.4rem;
            -webkit-border-radius: 0.15rem;
            -moz-border-radius: 0.15rem;
            border-radius: 0.15rem;
            margin-right: 0.17rem;
          }
        }
      }
      .list-user-info{
        margin: 0.4rem 0.3rem;
        color: #191919;
        font-size: 0.26rem;
      }
      .list-user-nav{
        margin-left: 0.18rem;
        ul{
          display: flex;
          li{
            width: 1.5rem;
            height: 1.3rem;
            margin-right: 0.24rem;
            img{
              width: 1.5rem;
              height: 1.3rem;
            }
          }
        }
      }
      .list-user-uuid{
        display: flex;
        color: #8f8f8f;
        font-size: 0.18rem;
        margin: 0.2rem 0 0.42rem 0.18rem;
        padding-right: 0.36rem;
        align-items: center;
        justify-content: space-between;
        font-size: 0.23rem;
        p{
          span{
            color: #5785d9;
          }
        }
      }
      .list-user-foot{
        width: 6.8rem;
        margin-left: 0.18rem;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 0.22rem;
        padding-bottom: 0.2rem;
        .quxiao{
          width: 1.6rem;
          height: 0.6rem;
          line-height: 0.6rem;
          text-align: center;
          color: #f1973a;
          background: #fff;
          border: 1px solid #f1973a;
          margin-left: 3rem;
          -webkit-border-radius: 0.18rem;
          -moz-border-radius: 0.18rem;
          border-radius: 0.18rem;
        }
        .chakan{
          width: 1.6rem;
          height: 0.6rem;
          line-height: 0.6rem;
          text-align: center;
          color: #ffffff;
          background: #f1973a;
          border: 1px solid #f1973a;
          margin-left: 0.5rem;
          -webkit-border-radius: 0.18rem;
          -moz-border-radius: 0.18rem;
          border-radius: 0.18rem;
        }
      }
    }
    .myfabu{
      margin-bottom: 0.24rem;
      background: #ffffff;
      padding-left: 0.2rem;
      padding-top: 0.24rem;
      .fabu-top{
        display: flex;
        align-items: center;
        /*justify-content: space-between;*/
        div:nth-of-type(1) {
          width: 1.5rem;
          height: 1.3rem;
          color: #000000;
          img{
            width: 1.5rem;
            height: 1.3rem;
          }
        }
        div:nth-of-type(2) {
          width: 4rem;
          height: 1.3rem;
          margin-left: .2rem;
          p{
            height: 0.6rem;
          }
          .p-title{
            font-size: 0.27rem;
            color: #191919;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            margin-top: 0.07rem;
          }
          .p-price{
            color: #ff191d;
            font-size: 0.3rem;
          }
        }
        div:nth-of-type(3) {
          /*right: 0.1rem;*/
          margin-left: 0.1rem;
          position: relative;
          color: #268cf2;
          transform: rotate(45deg);
        }
      }
      .fabu-uuid{
        display: flex;
        color: #8f8f8f;
        font-size: 0.18rem;
        margin: 0.27rem 0 0.22rem 0.18rem;
        padding-right: 0.36rem;
        align-items: center;
        justify-content: space-between;
        font-size: 0.23rem;
        p{
          span{
            color: #5785d9;
          }
        }
      }
      .fabu-foot{
        width: 6.8rem;
        margin-left: 0.18rem;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 0.22rem;
        padding-bottom: 0.3rem;
        .foot-right{
          width: 4rem;
          margin-left: 3rem;
          .quxiao{
            width: 1.6rem;
            height: 0.6rem;
            line-height: 0.6rem;
            text-align: center;
            color: #f1973a;
            background: #fff;
            border: 1px solid #f1973a;
            -webkit-border-radius: 0.18rem;
            -moz-border-radius: 0.18rem;
            border-radius: 0.18rem;
            float: left;
          }
          .chakan{
            width: 1.6rem;
            height: 0.6rem;
            line-height: 0.6rem;
            text-align: center;
            color: #ffffff;
            background: #f1973a;
            border: 1px solid #f1973a;
            margin-left: 0.5rem;
            -webkit-border-radius: 0.18rem;
            -moz-border-radius: 0.18rem;
            border-radius: 0.18rem;
            float: right;
          }
        }
      }
    }
  }
  .morenIndexCss{
    background: #f19736;
    color: #ffffff;
  }
  .noDataLenght{
    text-align: center;
    padding-top: 3.2rem;
    font-size: 0.28rem;
  }
.xiajia-box{
  padding: 1rem 0 0rem 0;
}
  .qd-btn{
    display: flex;
    /*padding: 0 1rem;*/
    margin-top: 0.5rem;
    border-top: 1px solid #d5d5d6;
    height: 0.8rem;
    div:nth-of-type(1) {
      width: 50%;
      height: 0.8rem;
      line-height: 0.8rem;
      border-right: 1px solid #ddd;
    }
    div:nth-of-type(2) {
      width: 50%;
      height: 0.8rem;
      line-height: 0.8rem;
    }
  }
</style>
<style>
  .weui-dialog {
    position: fixed;
    display: table;
    z-index: 5000;
    width: 80%;
    max-width: 300px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background-color: #FFFFFF;
    text-align: center;
    overflow: hidden;
    border-radius: 0.1rem;
  }
  .weui-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
  }
</style>
