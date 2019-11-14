<template>
  <div class="myCoupons" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <div class="topBox">
      <div class="top">
        <div class="item" v-for="(ite, ind) in itemList" :key="ind" @click="actTap(ite, ind)">
          <span :class="defaultIndex === ind ? 'actCss': ''">{{ite.names}}</span>
        </div>
      </div>
    </div>
    <div class="listBox-unused" v-show="defaultIndex === 0">
      <div class="list" v-for="(item, index) in couponList" :key="index" v-if="couponList.length > 0">
        <div class="ListLeft">
          <div class="imgBox">
            <img src="../../assets/images/my/coupons/listBack@2x.png" />
          </div>
          <div class="textBox">
            <p class="textTitle">{{item.couponTitle}}</p>
            <p class="money">{{item.couponSubtitle}}</p>
            <p class="time">有效期: {{item.nowTime | formatDate(0)}}~{{item.effectiveEndTime | formatDate(0)}}</p>
          </div>
        </div>
        <div class="listRight">
          <p>
            立即使用
          </p>
        </div>
      </div>
      <div class="nolist" v-if="couponList.length === 0"><img :src="noquan"/></div>
    </div>
    <div class="listBox-used" v-show="defaultIndex === 1">
      <div class="nolist"><img :src="noquan"/></div>
    </div>
    <load-more tip="数据加载中" v-if="showLoading"></load-more>
  </div>
</template>

<script>
  import {Loading, LoadMore} from 'vux'
  export default {
    components: {
      Loading,
      LoadMore
    },
    data () {
      return {
        couponList: [],
        defaultIndex: 0,
        noquan: require('../../assets/images/groupImg/noqunaa.png'),
        itemList: [
          {
            names: '未使用',
            id: 0
          },
          {
            names: '已使用',
            id: 2
          }
        ],
        couponStatus: 0,
        busy: false,
        showLoading: false,                   // 是否显示加载loading
        noData: false,                         // 列表是否有数据
        start: 1,                             // 当前页数
        pageSize: 10,                         // 每页显示10条
        totalPage: 0                          // 总页数
      }
    },
    mounted: function () {
      let bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
      if (bsbUserInfo && bsbUserInfo.token) {
        this.couponPageList()
      } else {
        localStorage.setItem('REDIRECT_URL', this.$route.fullPath)
        this.$router.push('/login')
      }
    },
    methods: {
      loadMore () {
        this.busy = true // 加载状态
        if (!this.showLoading) {
          this.showLoading = true
          if (parseInt(this.start) > parseInt(this.totalPage)) {
            this.showLoading = false
            return
          }
        }
        console.log('分頁')
        this.start = this.start + 1 // 当前页数
        this.couponPageList() // 分页数据
      },
      /**
       * 优惠券列表
       */
      couponPageList () {
        this.$vux.loading.show({
          text: 'Loading'
        })
        this.$http.post(this.api.couponPageList, {
          couponStatus: this.couponStatus,
          start: this.start,
          pageSize: this.pageSize
        }).then((res) => {
          // console.log(res)
          let resData = res.data
          this.$vux.loading.hide()
          this.busy = false // 重置busy状态
          this.showLoading = false
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          if (res.data.status === '1') {
            var list = res.data.data.list
            this.noData = list > 0 ? !!false : !!true
            this.couponList = this.couponList.concat(list)
            this.totalPage = Math.ceil(resData.data.total / resData.data.pageSize)
          }
        })
      },
      actTap (ite, ind) {
        this.defaultIndex = ind
        this.couponStatus = ite.id
        this.start = 1
        this.couponList = []
        this.couponPageList()
      }
    }
  }
</script>

<style scoped lang=less>
  .topBox{
    width: 100%;
    height: .75rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 5000;
    .top {
      width: 100%;
      max-width: 7.5rem;
      height: .75rem;
      display: flex;
      flex-direction: row;
      border-top: 1px solid #e1e1e1;
      background: white;
      .item{
        flex: 1;
        text-align: center;
        span{
          display: inline-block;
          line-height: .75rem;
          padding-left: .2rem;
          padding-right: .2rem;
        }
      }
      .active{
        color: #F82828;

        span{
          line-height: .73rem;
          border-bottom: 2px solid #F82828;
        }
      }
    }
  }
  .listBox-unused{
    width: 100%;
    height: 100vh;
    background-color: #F1F2F5;
    box-sizing: border-box;
    padding: .2rem;
    padding-top: .97rem;
    .list{
      width: 100%;
      height: 1.8rem;
      background: white;
      padding: .2rem;
      box-sizing: border-box;
      font-size: .28rem;
      display: flex;
      flex-direction: row;
      margin-bottom: .2rem;
      .ListLeft{
        width: 5rem;
        position: relative;
        .imgBox{
          width: 5rem;
          height: 1.8rem;
          position: absolute;
          top: -.2rem;
          left: -.2rem;
          z-index: 0;
          img{
            width: 5rem;
          }
        }
        .textBox{
          width: 4.8rem;
          height: 1.4rem;
          position: absolute;
          top: 0px;
          left: 0px;
          z-index: 2;
          color: white;
          font-size: .24rem;
          line-height: .45rem;
          .textTitle{
            font-size: .32rem;
            font-weight: bolder;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .money{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }

      .listRight{
        line-height: 1.4rem;
        text-align: center;
        font-size: .28rem;
        font-weight: bolder;
        color: #999999;
        p{
          font-weight: bolder;
        }
      }
    }
  }
  .listBox-used{
    width: 100%;
    height: 100vh;
    background-color: #F1F2F5;
    box-sizing: border-box;
    padding: .2rem;
    padding-top: .97rem;
  }
  .nolist{
    width: 3.65rem;
    height: 3.88rem;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -1.825rem;
    margin-top: -1.94rem;
    img{
      width: 3.65rem;
      height: auto;
    }
  }
  .actCss{
    border-bottom: 2px solid #f82828;
    color: #f82828;
  }
</style>
