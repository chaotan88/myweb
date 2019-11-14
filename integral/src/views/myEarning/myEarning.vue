<!-- 我的收益 -->
<template>
  <div class="my-earning">
    <!-- 积分 -->
    <div class="Integral pos-r">
      <dl class="pos-r">
        <dt class="pos-a ta-c">
          <h3>{{ProFitTotal.bonusPoints ? ProFitTotal.bonusPoints : 0}}<span>个</span></h3>
          <h4>可用消费积分</h4>
        </dt>
        <dd class="ta-c">
          <h3>{{ProFitTotal.cashPoints ? ProFitTotal.cashPoints : 0}}<span>个</span></h3>
          <h4>可用通用积分</h4>
          <!--<h5 class="ta-c">-->
            <!--<span class="d-ib" @click="putForward" ref="getMoney">转增</span>-->
          <!--</h5>-->
          <h5 class="ta-c">
            <span class="d-ib" @click="givingPoints">转赠</span>
            <!--<span class="d-ib" @click="putForward" ref="getMoney">提现</span>-->
          </h5>
        </dd>
      </dl>
      <div class="statistics-table" @click="$router.push('/earningTable')">
        <img src="../../assets/images/statistics.png" alt="">
        <span>查看收益报表</span>
      </div>
    </div>

    <!-- 收益明细 -->
    <div class="Profit pos-r">
      <div class="list-title">
        <h3>收益明细</h3>
      </div>
      <!--<div>-->
      <ul v-infinite-scroll="loadMoreData" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
        <li v-for="item in ProfitInfoList">
          <div>
            <p v-if="item.addSource === 17">成为{{item.ruleName}}</p>
            <p v-else>{{item.addSource | integralSourceFilter}}</p>
            {{item.invitationTime | formatDate(0)}}
          </div>
          <div>{{item.propertyType | integralTypeFilter}}</div>
          <div>{{item.propertyAmount}}</div>
        </li>
        <load-more tip="数据加载中" v-if="showLoading"></load-more>
      </ul>
      <!--</div>-->
      <!--无数据-->
      <no-data-component v-if="!ProfitInfoList.length"></no-data-component>
    </div>

  </div>
</template>
<script>
import noDataComponent from './../public/noData'    // 暂无数据
import InputPassword from './../public/InputPassword'
import {Group, Cell, XDialog, LoadMore} from 'vux'
export default{
  components: {
    noDataComponent,
    InputPassword,
    Group,
    Cell,
    XDialog,
    LoadMore
  },
  data () {
    return {
      cardArr: [],
      busy: false,
      clearFlag: true,
      showLoading: false,                // 是否显示加载loading
      noData: false,                     // 暂无数据
      password: '',                      // 密码
      showToast: false,                  // 支付密码弹窗
      isPayPasswordSte: '',              // 是否设置交易密码 0：未设置， 1：已设置
      personalData: {},                  // 用户信息
      ProFitTotal: {},                   // 我的收益统计
      ProfitInfoList: [],                // 我的收益列表
      start: 1,                          // 当前页
      pageSize: 10,                       // 每页显示几条
      totalPage: 0,                       // 总页数
      ifReal: '',                        // 是否实名的判断  0 已认证 1 未认证
      ifPwd: ''                         // 是否设置了支付密码  0 未设置 1 已设置
    }
  },
  mounted () {
    this.ifPassword()
    this.getPersonalInfo()
    this.getProFitTotal()                  // 我的收益统计
    this.getProfitInfoList()               // 我的收益列表
    this.getCardList()
  },

  methods: {
    /**
     * 获取银行卡列表
     */
    getCardList () {
      this.$http.post(`${this.api.getCardList}`, {}).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) return false
        this.cardArr = res.data.data
        console.log(this.cardArr)
      })
    },
    /**
     * 我的收益统计
    */
    getProFitTotal () {
      this.$http.post(this.api.getProFitTotal).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
          this.ProFitTotal = resData.data
        }
      })
    },
    /**
     * 我的收益列表
    */
    getProfitInfoList () {
      this.$http.post(this.api.getProfitInfoList, {
        start: this.start,
        pageSize: this.pageSize
      }).then((res) => {
        let resData = res.data
        this.busy = false // 重置busy状态
        this.showLoading = false
        if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
          // this.noData = true
          return false
        }
        let results = resData.data
        let filterData = results.list
        this.ProfitInfoList = this.ProfitInfoList.concat(filterData)
        this.ProfitInfoList.map(item => {
          item.propertyAmount = item.propertyAmount.toString().indexOf('-') !== -1 ? item.propertyAmount : item.propertyAmount.toString().indexOf('+') !== -1 ? item.propertyAmount : ('+' + item.propertyAmount)
        })
        // this.noData = results.list.length > 0 ? 0 : 1
        this.start = this.start + 1 // 当前页数
        this.totalPage = results.pages
      })
    },
    /**
     * 分页
    */
    loadMoreData () {
      this.busy = true // 加载状态
      if (!this.showLoading) {
        this.showLoading = true
        if (this.start > this.totalPage) {
          this.showLoading = false
          return
        }
      }
      this.getProfitInfoList() // 分页数据
    },
    /**
     * 获取个人信息
     */
    getPersonalInfo () {
      this.$http.post(`${this.api.personalInfo}`, {
        id: JSON.parse(localStorage.getItem('integralUserInfo')).userId
      }).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) return false
        let resData = res.data.data
        this.ifReal = resData.cardStatus
      })
    },
    /**
     * 提现
    */
    putForward () {
      console.log(this.ifReal)
      console.log(this.ifPwd)
      // console.log(this.cardArr.length)
      // ifReal  0 已认证 1 未认证
      // ifPwd   0 未设置 1 已设置
      if (this.ifReal === 1 && this.ifPwd === 0) { // 未认证，未设置支付密码
        this.$router.push({path: '/user/certification', query: {types: this.ifReal}})
      }
      if (this.ifReal === 1 && this.ifPwd === 1) { // 未认证，已设置支付密码(商城过来)
        this.$router.push({path: '/user/certification', query: {types: this.ifReal}})
      }
      if (this.ifReal === 0 && this.ifPwd === 0) { // 已认证，未设置支付密码
        this.$router.push('/setup/sendCode')
      }
      if (this.ifReal === 0 && this.ifPwd === 1 && this.cardArr.length === 0) { // 已认证，已设置支付密码(但是用户没有绑定提现账户)
        this.$router.push('/addPayChoose')
      }
      if (this.ifReal === 0 && this.ifPwd === 1 && this.cardArr.length) { // 已认证，已设置支付密码(用户至少绑定一种提现账户)
        this.$router.push('/putForward')
      }
      // localStorage.setItem('REDIRECT_URL', this.$route.fullPath)           // 保存页面重定向url
      // this.$router.push('/login')
      // if (this.cardArr.length) {
      //   this.$router.push('/putForward')
      // } else {
      //   this.$router.push('/user/cardManger')
      // }
    },
    /**
     * 判断是否设置了支付密码
     */
    ifPassword () {
      this.$http.get(`${this.api.ifPassword}`, {}).then((res) => {
        this.ifPwd = res.data.data
      })
    },
    /**
     * 转增
     */
    givingPoints () {
      this.$router.push('/bankGivingPoints')
    }
  }
}
</script>
<style scoped lang=less>
  .my-earning{
    height: calc(100vh);
    background: #eee;
    padding-bottom: 0.3rem;
    box-sizing: border-box;
    overflow: hidden;

    /*------------头部积分样式-------------*/
    .Integral{
      width: 100%;
      height: 4.5rem;
      background: url(../../assets/images/my-recommend-bg.png) no-repeat;
      background-size: cover;
      dl{
        bottom: -1rem;

        h3{
          color: #fff;
          height: 0.8rem;
          line-height: 0.8rem;
          letter-spacing:2px;
          font-size: 0.6rem;

          span{
            font-size: 0.23rem;
          }
        }
        h4{
          color: #dbe6fd;
          height: 0.4rem;
          line-height: 0.4rem;
          letter-spacing:2px;
          font-size: 0.24rem;
        }

        h5{
          padding: 0.1rem 0;
          span{
            color: #fff;
            width: 1.3rem;
            padding: 0.07rem 0.2rem;
            font-size: 0.24rem;
            background: #5d84f5;
            border: 1px solid #749bf6;
            border-radius: 3px;
          }
        }

        dt{
          width: 50%;
          left:0;
          border-right: 1px solid #94abf8;
        }

        dd{
          padding-left: 50%;
          height: 1.3rem;
        }

      }
      .statistics-table{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        color: #fff;
        background: url('../../assets/images/statistics-bg.jpg') no-repeat;
        background-size: cover;
        padding-left: .2rem;
        z-index: 10;
        img{
          display: inline-block;
          width: .44rem;
          height: .37rem;
          margin-top: .01rem;
        }
      }
      .statistics-table::after{
        content: '';
        display: inline-block;
        height: 6px;
        width: 6px;
        border-width: 2px 2px 0 0;
        border-color: #C8C8CD;
        border-style: solid;
        -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        position: absolute;
        top: 45%;
        right: 17px;
      }
    }

    /*-------------收益分布----------------*/
    .my-earning-statistics{
      width: 95%;
      height: 5rem;
      margin: 0 auto;
      top: -0.7rem;
      background: #fff;
      border-radius: 5px;
      .statistics-cen{
        h3{
          color: #333;
          font-size: 0.3rem;
          height: 0.9rem;
          line-height: 0.9rem;
          padding-left: 0.5rem;
          border-bottom: 1px solid #ededed;
        }

      }
    }
    /*------------------------------------------------------------------------*/
    .Profit{
      width: 95%;
      height: calc(~"100vh - 4.3rem");
      overflow-y: auto;
      background: #fff;
      border-radius: 9px;
      margin: 0 auto;
      margin-top: 0.3rem;
      -webkit-box-shadow: 0 0 20px 0 hsla(0,6%,58%,0.3);
      .list-title{
        color: #333333;
        font-size: .26rem;
        height: .9rem;
        border-bottom: .02rem solid #ececec;
        h3{
          color: #333;
          font-size: 0.3rem;
          height: 0.9rem;
          line-height: 0.9rem;
          padding-left: 0.5rem;
          span{
            font-size: .26rem;
          }
        }
      }
      ul {
        width: 100%;
        position: absolute;
        top: .9rem;
        bottom: .5rem;
        overflow-y: scroll;
        li{
          height: .88rem;
          display: flex;
          align-items: center;
          font-size: 0.26rem;
          border-bottom: .02rem solid #ececec;
          padding: 0 .2rem;
          &:last-child{
            /* border-bottom:none; */
          }
          &.list-title{
            color: #333333;
            font-size: .26rem;
            height: .75rem;
          }
          div{
            flex: 1;
            text-align: center;
            color:#666666;
            font-size: .24rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 .05rem;
            &:nth-child(3){
              color: #c8a86c;
            }
          }
        }
      }
    }
    /*-------------支付密码弹窗------------*/
    .dialog-main{
      padding: 30px;

      .title{
        padding-bottom: .5rem;
      }

      .close-btn{
        right: .1rem;
        top: .2rem;
        .weui-icon-cancel{
          color: #aaa;
        }
      }
    }
  }
</style>
