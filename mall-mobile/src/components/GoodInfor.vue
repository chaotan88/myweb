<template>
    <div>
      <template v-if="basicGoodsInfor">
        <div class="goodInfor-video" v-if="basicGoodsInfor.goodsVideoUrl">
          <video :src="basicGoodsInfor.goodsVideoUrl | filterImgUrl" controls>您的手机不支持video</video>
        </div>
        <div class="goodInfor" v-html="basicGoodsInfor.remark" v-if="basicGoodsInfor.remark"></div>
        <!--无数据-->
        <div class="noData" v-if="!basicGoodsInfor.remark && !basicGoodsInfor.goodsVideoUrl">暂无内容</div>
      </template>
    </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    props: ['basicGoodsInfor'],
    data () {
      return {
      }
    },
    mounted () {
      this.$nextTick(() => {
        $('.goodInfor').find('img').css({'max-width': '7rem', 'vertical-align': 'top'})
      })
    },
    updated () {
      $('.goodInfor').find('img').css({'max-width': '7rem', 'vertical-align': 'top'})
    },
    methods: {}
  }
</script>

<style scoped lang=less>
    .noData{
      font-size: .28rem;
      text-align: center;
      margin-top: 1.5rem;
    }
    .goodInfor-video{
      padding:0 .3rem;
      height: 4rem;
      overflow: hidden;
      video{
        width: 100%;
        height: 4rem;
        background: #ccc;
      }
    }
    .goodInfor {
      padding:0.3rem 0.3rem 1rem 0.3rem;
      line-height: 1.6em;
      font-size: .28rem;
      overflow-x: hidden;
      word-break: break-all;
      img{
        width: 100%;
      }
    }
</style>
