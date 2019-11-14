<template>
  <div class="css-wrap">
    <div class="shbox sh-down-lr">
      <!-- p{CSS 伪元素制作阴影效果}*10 -->
      <p>CSS 伪元素制作阴影效果1</p>
      <p>CSS 伪元素制作阴影效果2</p>
      <p>CSS 伪元素制作阴影效果3</p>
      <p>CSS 伪元素制作阴影效果4</p>
      <p>CSS 伪元素制作阴影效果5</p>
      <p>CSS 伪元素制作阴影效果6</p>
      <p>CSS 伪元素制作阴影效果7</p>
      <p>CSS 伪元素制作阴影效果8</p>
      <p>CSS 伪元素制作阴影效果9</p>
      <p>CSS 伪元素制作阴影效果10</p>
    </div>

    <div class="pos-f footer-wrap">
      <span class="footer-icon shop-cart"></span>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    let json = {
      name: 'test',
      title: '正在测试console打印'
    }
    console.log(JSON.stringify(json))
  }
}
</script>

<style lang="less" scoped>
.css-wrap{
  padding: 100px 500px;
  background: #f5f5f5;
  position: relative;
  z-index: 0;

  .shbox{ 
    background:#fff; 
    padding:10px; 
    width:90%; 
    margin:40px auto; 
    height:auto; 
    margin:40px auto; 
  }

  .sh-down-lr{
    position:relative;
  } 

  .sh-down-lr:before,.sh-down-lr:after{ 
    z-index: -1; 
    position: absolute; 
    content: ""; 
    bottom: 15px; 
    left: 10px; 
    width: 50%; 
    top: 80%; 
    max-width:300px; 
    background: #fff;
    -webkit-box-shadow: 0 15px 10px #777; 
    -moz-box-shadow: 0 15px 10px #777; 
    box-shadow: 0 15px 10px #777; 
    -webkit-transform: rotate(-3deg); 
    -moz-transform: rotate(-3deg); 
    -o-transform: rotate(-3deg); 
    -ms-transform: rotate(-3deg); 
    transform: rotate(-3deg); 
  }

  .sh-down-lr:after{ 
    -webkit-transform: rotate(3deg); 
    -moz-transform: rotate(3deg); 
    -o-transform: rotate(3deg); 
    -ms-transform: rotate(3deg); 
    transform: rotate(3deg); 
    right:10px; 
    left:auto; 
  }

  .footer-wrap{
    width: 100%;
    height: 40px;

    .footer-icon{
      width: 25%;
      height: 100%;
    }
  }
}
</style>