<!-- 统计总数据组件 -->
<template>
  <div class="statistics-basic-wrap">
    <div class="items">
      <dl class="pos-r">
        <dt class="d-b pos-a"> 
        </dt>
        <dd>
          <strong class="fw-n d-b">{{statisticalData.memberNum | filterEmpty}}</strong>
          <p>会员总数</p>
        </dd>
      </dl>
    </div>
    <div class="items">
      <dl class="pos-r">
        <dt class="d-b pos-a dt2"></dt>
        <dd>
          <strong class="fw-n d-b">{{statisticalData.agentNum | filterEmpty}}</strong>
          <p>总营业额</p>
        </dd>
      </dl>
    </div>
    <div class="items">
      <dl class="pos-r">
        <dt class="d-b pos-a dt3"></dt>
        <dd>
          <strong class="fw-n d-b">{{statisticalData.orderAmount | filterEmpty}}</strong>
          <p>会员申请人数</p>
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
        memberNum: 0,
        agentNum: 0,
        orderAmount: 0
      }                                // 统计数据
    }
  },

  mounted () {
  },

  methods: {
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

  .items{
    width: 33.33%;
    height: 100%;
    margin-right: 20px;
    overflow: hidden;
    background: url(../../assets/img/product-statistics-basic-bg.jpg) no-repeat center center;
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
        background-image: url(../../assets/img/product-statistics-basic-ico.png);
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