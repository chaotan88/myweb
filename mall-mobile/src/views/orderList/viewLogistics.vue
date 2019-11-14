<template>
  <div class="viewLogistics-wrap">
    <div class="viewLogistics-title">
      <img src="../../assets/images/logistics/logistics-title.png">
      <span>物流信息</span>
    </div>
    <!--物流公司编号-->
    <div class="viewLogistics-ms">
      <h2 v-if="logisticsCompany">{{logisticsCompany}}</h2>
      <div v-if="logisticsNo">运单号  {{logisticsNo}}</div>
    </div>
    <!--暂无物流信息-->
    <div class="noLogistics" v-if="noLogisticsMes">{{noLogisticsMes}}</div>
    <!--物流状态-->
    <ul v-else>
      <li v-for="(item, index) in LogisticsMes">
        <div class="viewLogistics-tim">
          <p>{{item.date}}</p>
          <p>{{item.second}}</p>
        </div>
        <div class="viewLogistics-state noScale" v-if="index==LogisticsMes.length - 1">
          <img src="../../assets/images/logistics/logistics-start.png">
        </div>
        <div class="viewLogistics-state noScale state-end" v-else-if="index==0">到</div>
        <div class="viewLogistics-state" v-else></div>
        <div class="viewLogistics-mes" v-html="item.acceptStation"></div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        logisticsCompany: '',        // 物流公司
        logisticsNo: '',             // 物流编号
        noLogisticsMes: '',          // 暂无物流信息提示
        LogisticsMes: []             // 物流信息
      }
    },
    mounted: function () {
      this.getLogisticsMes()              // 获取物流信息
    },
    methods: {
      /**
       * 位数不足两位0补位
      */
      cmplement (val) {
        return val < 10 ? '0' + val : val
      },
      /**
       * 获取物流信息
      */
      getLogisticsMes () {
        this.$http.get(`${this.api.getLogisticsMes}`, {
          params: {
            orderId: this.$route.query.orderId
          }
        }).then((res) => {
          let resData = res.data
          this.logisticsCompany = resData.data.logisticsName
          this.logisticsNo = resData.data.logisticsNumber
          if (resData.status !== this.api.ERR_OK) {
            this.noLogisticsMes = resData.msg
            return false
          }
          if (resData.data.lists) {
            resData.data.lists.forEach(item => {
              // var mat = /((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}))?/g
              var t = item.acceptStation.match(/(\d+[-]?\d+)+/g)
              if (t && t.length > 0) {
                t.forEach(ite => {
                  var str = '<a href="tel: ' + ite + '">' + ite + '</a>'
                  item.acceptStation = item.acceptStation.replace(ite, str)
                })
              }
              var d = new Date(item.acceptTime)
              var dformat = [ this.cmplement(d.getMonth() + 1), this.cmplement(d.getDate()) ].join('-')
              var second = [this.cmplement(d.getHours()), this.cmplement(d.getMinutes())].join(':')
              this.$set(item, 'date', dformat)
              this.$set(item, 'second', second)
            })
            this.LogisticsMes = resData.data.lists.reverse()
          } else {
            this.noLogisticsMes = '暂无物流信息'
          }
        })
      }
    }
  }
</script>
<style  lang=less>
  .viewLogistics-wrap{
    padding: 0 .2rem;
    /**标题**/
    .viewLogistics-title{
      display: flex;
      align-items: center;
      height: .63rem;
      border-bottom: 1px solid #efefef;
      margin-top: .3rem;
      img{
        width: .4rem;
        height: .4rem;
        margin-left: .23rem;
      }
      span{
        font-size: .28rem;
        color:#666666;
        margin-left: .1rem;
      }
    }
    /**物流公司及编号**/
    .viewLogistics-ms{
      margin: .32rem .23rem 1rem .23rem;
      h2{
        color:#666666;
        font-size: .26rem;
        font-weight: bold;
      }
      div{
        color:#999999;
        font-size: .24rem;
        margin-top: .05rem;
      }
    }
    /**暂无物流**/
    .noLogistics{
      font-size: .28rem;
      color: #999999;
      text-align: center;
      margin: 20% 0;
    }
    /**物流信息**/
    ul{
      position: relative;
      margin: .65rem 0;
      &::before{
        content: '';
        display: block;
        border: 1px dashed #dfdfdf;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 1.47rem;
      }
      li{
        display: flex;
        padding: 0 .35rem;
        margin-bottom: .9rem;
        .viewLogistics-tim{
          margin-right: .18rem;
          color: #999999;
          font-size: .26rem;
          text-align: right;
          p:nth-child(2){
            font-size: .2rem;
          }
        }
        .viewLogistics-state{
          position: absolute;
          left: 1.26rem;
          background: #d0d0d0;
          border-radius: 50%;
          width: .44rem;
          height: .44rem;
          transform: scale(0.67);
          -webkit-transform: scale(0.67);
          -moz-transform: scale(0.67);
          -ms-transform: scale(0.67);
          -o-transform: scale(0.67);
          &.noScale{
            transform: scale(0);
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            -ms-transform: scale(1);
            -o-transform: scale(1);
            text-align: center;
            line-height: .44rem;
            img{
              width: .28rem;
              height: .28rem;
            }
          }
          &.state-end{
            font-size: .24rem;
            color: #fff;
            background: #fe9a01;
          }
        }
        .viewLogistics-mes{
          font-size: .24rem;
          color: #999999;
          flex: 1;
          word-break: break-all;
          position: absolute;
          left: 2.01rem;
          a{
            color: #fe9a01;
          }
        }
      }
    }
  }
</style>
