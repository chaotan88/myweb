<template>
    <div>
      <div class="salesService" v-if="serviceCon.length > 0">
        <div v-for="(item, index) in serviceCon" :key="index" v-html="item.content">
        </div>
      </div>
      <!--无数据-->
      <div class="noData" v-else>暂无内容</div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        serviceCon: '' // 售后服务的内容
      }
    },
    mounted: function () {
      this.getService() // 售后服务
    },
    methods: {
      /**
       * 售后服务
      */
      getService () {
        this.$http.post(this.api.getContent, {
          type: 2
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.serviceCon = res.data.data
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
    .noData{
      font-size: .28rem;
      text-align: center;
      margin-top: 1.5rem;
    }
    .salesService {
      padding:0.3rem 0.3rem 1rem 0.3rem;
      line-height: 1.6em;
      font-size: .28rem;

      img {
        max-width: 7.5rem;
      }
    }
</style>
<style  lang=less>

  .salesService {
    padding:0.3rem 0.3rem 1rem 0.3rem;
    line-height: 1.6em;
    font-size: .28rem;

    img {
      max-width: 6.9rem;
    }
  }
</style>
