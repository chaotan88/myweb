<!-- 统计总数据组件 -->
<template>
  <div class="statistics-basic-wrap">
    <div class="items">
      <dl class="pos-r">
        <dt class="d-b pos-a"> 
        </dt>
        <dd>
          <strong class="fw-n d-b">{{statisticalData.memberCount | filterEmpty}}</strong>
          <p>推广大使总数</p>
        </dd>
      </dl>
    </div>
    <div class="items">
      <dl class="pos-r">
        <dt class="d-b pos-a dt2"></dt>
        <dd>
          <strong class="fw-n d-b">{{statisticalData.setMealPriceSum | filterEmpty}}</strong>
          <p>总营业额</p>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default{
  data () {
    return {}
  },
  props: {
    statisticalData: {
      type: Object,
      default: () => ({
        memberCount: 0,
        setMealPriceSum: 0
      })
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
    width: 50%;
    height: 100%;
    margin-right: 20px;
    overflow: hidden;
    background: url(../../assets/img/product-statistics-basic-bg.jpg) no-repeat center center;
    background-size: cover;
    border-radius: 5px;

    dl{
      color: #fff;
      margin-top: 45px;
      margin-left: 30%;
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