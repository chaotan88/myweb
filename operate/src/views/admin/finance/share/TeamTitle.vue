<!-- 专区分佣-买卖仓分佣-分享收益/团队分佣/全球分红统计 -->
<template>
  <div class="statistics-basic-wrap">
    <div class="items">
      <dl class="pos-r">
        <dt class="d-b pos-a">
        </dt>
        <dd>
          <strong class="fw-n d-b">{{statisticalData.orderTotal | filterEmpty}}</strong>
          <p>订单总额</p>
        </dd>
      </dl>
    </div>
    <div class="items">
      <dl class="pos-r">
        <dt class="d-b pos-a dt2"></dt>
        <dd>
          <strong class="fw-n d-b">{{statisticalData.directProfitTotal || statisticalData.commissionTotal || statisticalData.globalWeightTotal | filterEmpty}}</strong>
          <template v-if="disStatus === 1">
            <p>产生分享收益总金额</p>
          </template>
          <template v-if="disStatus === 2">
            <p>产生团队分佣总金额</p>
          </template>
          <template v-if="disStatus === 3">
            <p>全球分红总金额</p>
          </template>
        </dd>
      </dl>
    </div>
    <div class="items">
      <dl class="pos-r">
        <dt class="d-b pos-a dt3"></dt>
        <dd>
          <strong class="fw-n d-b">{{statisticalData.userTotal | filterEmpty}}</strong>
          <p>享受收益总用户数</p>
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default{
  data () {
    return {
      statisticalData: {              // 统计数据
        all: 0,
        hasDis: 0,
        waitDis: 0
      },
      disStatus: ''                   // 页面类型
    }
  },

  mounted () {
    let pathType = this.$route.path.match(/profit|team|bonus/gi)[0]
    switch (pathType) {
      case 'profit':
        this.disStatus = 1
        break
      case 'team':
        this.disStatus = 2
        break
      case 'bonus':
        this.disStatus = 3
        break
    }
    this.getSettleData()
  },

  methods: {
    /**
     * 获取结算数据
     */
    getSettleData () {
      this.$http.get('@ROOT_API/commission/getCommission', {
        params: {
          type: this.disStatus
        }
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          if (resData.status !== '9998') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
          }
          return false
        }
        // success...
        this.statisticalData = resData.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
/* -------------------- { 统计总数据 } -------------------- */
.statistics-basic-wrap{
  height: 140px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .items{
    width: 33.33%;
    height: 100%;
    margin-right: 25px;
    overflow: hidden;
    background: #c2e0fe url(../../../../assets/img/statistics-bg.jpg);
    background-size: cover;
    border-radius: 5px;

    dl{
      color: #fff;
      margin-top: 45px;
      margin-left: 20%;
      padding-left: 85px;

      dt{
        width: 70px;
        height: 60px;
        /*background-image: url(../../../assets/img/statistics-bg.jpg);*/
        background-repeat: no-repeat;
        left: 0;
        top: 0;
      }

      .dt2{
        background-position: -70px 0;
      }

      .dt3{
        background-position: -140px 0;
      }

      dd{
        strong{
          height: 28px;
          line-height: 28px;
          font-size: 28px;
          margin-bottom: 12px;
        }
      }
    }
  }

  .items:last-child{
    margin-right: 0;
  }
}

</style>
