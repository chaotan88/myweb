<template>
  <div class="news-details">
    <div class="title1">详细内容</div>
    <div class="title">{{newsInfo.title}}</div>
    <div class="date">时间：{{newsInfo.date}}&nbsp;&nbsp;作者：贝斯特商旅【原创】&nbsp;&nbsp;</div>
    <div class="tags"><p>国际机票预定公司</p><p>国际商务头等机票预定</p><P>国际机票预定</P></div>
    <div class="content" v-html="newsInfo.content">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newsInfo: {}
    };
  },
  methods: {},
  mounted() {
    this.newsInfo = JSON.parse(sessionStorage.getItem('news-info'))
    console.log(this.newsInfo)
  }
};
</script>

<style lang="less" scoped>
.news-details {
  margin: 80px;
  margin-top: 40px;
  border: 1px solid #999;
  padding: 20px;
  .title1 {
    margin: -20px;
    color: #0001CC;
    border-bottom: 2px solid #0001CC;
    height: 35px;
    line-height: 35px;
    padding-left: 20px;
    position: relative;
  }
  .title1:before {
    content: '';
    width: 2px;
    height: 18px;
    background: #0001CC;
    position: absolute;
    top: 10px;
    left: 15px;
  }
  .title {
    margin-top: 40px;
    font-size: 18px;
    color: #666;
    text-align: center;
  }
  .date {
    color: #545454;
    font-size: 12px;
    text-align: center;
    margin: 20px 0;
  }
  .tags {
    display: flex;
    p {
      font-size: 12px;
      color: #444;
      border-width: 1px;
      border-style: solid;
      margin: 0 6px 6px 0;
      padding: 0 5px;
      line-height: 20px;
      height: 20px;
    }
  }
  .content {
    line-height: 1.75;
    font-size: 16px;
    color: #545454;
    text-indent: 2em;
  }
}
</style>