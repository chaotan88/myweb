<!-- 店补结算-tab分页 -->
<template>
  <div class="statistics-basic-wrap">
    <div class="items">
      <dl class="pos-r">
        <dt class="d-b pos-a">
        </dt>
        <dd>
          <strong class="fw-n d-b">{{statisticalData.all | filterEmpty}}</strong>
          <p>结算消费积分总额</p>
        </dd>
      </dl>
    </div>
    <div class="items">
      <dl class="pos-r">
        <dt class="d-b pos-a dt2"></dt>
        <dd>
          <strong class="fw-n d-b">{{statisticalData.waitDis | filterEmpty}}</strong>
          <p>待结算消费积分</p>
        </dd>
      </dl>
    </div>
    <div class="items">
      <dl class="pos-r">
        <dt class="d-b pos-a dt3"></dt>
        <dd>
          <strong class="fw-n d-b">{{statisticalData.hasDis | filterEmpty}}</strong>
          <p>已结算消费积分</p>
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default{
  data () {
    return {
      statisticalData: {
        all: 0,
        hasDis: 0,
        waitDis: 0
      }                                // 统计数据
    }
  },

  mounted () {
    this.getSettleData()
  },

  methods: {
    /**
     * 获取结算数据
     */
    getSettleData () {
      this.$http.post('@ROOT_API/profitController/getSumProfit', {}).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          if (resData.status !== '9998') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
          }
          this.statisticalData.all = ''
          this.statisticalData.hasDis = ''
          this.statisticalData.waitDis = ''
          return false
        }
        // success...
        let results = resData.data
        this.statisticalData.all = results.all
        this.statisticalData.hasDis = results.hasDis
        this.statisticalData.waitDis = results.waitDis
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
    background: url(../../../assets/img/product-statistics-basic-bg.jpg) no-repeat center center;
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
        background-image: url(../../../assets/img/product-statistics-basic-ico.png);
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
