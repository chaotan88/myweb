<template>
  <div>
    <div class="dot"></div>
    <div class="pulse1"></div>
    <div class="pulse2"></div>
    <div class="pulse3"></div>
  </div>
</template>

<script>
    export default {
      name: 'smallCircle'
    }
</script>

<style scoped>
  @keyframes warn1 {
    0% {
      transform: scale(0);
      opacity: 0.0;
    }
    25% {
      transform: scale(0);
      opacity: 0.1;
    }
    50% {
      transform: scale(0.1);
      opacity: 0.3;
    }
    75% {
      transform: scale(0.5);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 0.0;
    }
  }
  @keyframes warn2 {
    0% {
      transform: scale(0);
      opacity: 0.0;
    }
    25% {
      transform: scale(0);
      opacity: 0.1;
    }
    50% {
      transform: scale(0.1);
      opacity: 0.3;
    }
    75% {
      transform: scale(0.5);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 0.0;
    }
  }
  @keyframes warn3 {
    0% {
      transform: scale(0);
      opacity: 0.0;
    }
    25% {
      transform: scale(0);
      opacity: 0.1;
    }
    50% {
      transform: scale(0.1);
      opacity: 0.3;
    }
    75% {
      transform: scale(0.5);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 0.0;
    }
  }
  @-webkit-keyframes warn {
    0% {
      -webkit-transform: scale(0);
      opacity: 0.0;
    }
    25% {
      -webkit-transform: scale(0);
      opacity: 0.1;
    }
    50% {
      -webkit-transform: scale(0.1);
      opacity: 0.3;
    }
    75% {
      -webkit-transform: scale(0.5);
      opacity: 0.5;
    }
    100% {
      -webkit-transform: scale(1);
      opacity: 0.0;
    }
  }
  /* 保持大小不变的小圆圈  */
  .dot {
    position: absolute;
    width: 6px;
    height: 6px;
    left: 15px;
    top: 15px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border: 2px solid #fff;
    border-radius: 20px;
    z-index: 2;
    background: #fff;
  }
  /* 产生动画（向外扩散变大）的圆圈  */
  .pulse1 {
    position: absolute;
    width: 24px;
    height: 24px;
    left: 2px;
    top: 2px;
    border: 6px solid #905e60;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
    border-radius: 30px;
    z-index: 1;
    opacity: 0;
    -webkit-animation: warn1 2s ease-out;
    -moz-animation: warn1 2s ease-out;
    animation: warn1 2s ease-out;
    -webkit-animation-iteration-count: infinite;
    -moz-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }
  .pulse2 {
    position: absolute;
    width: 24px;
    height: 24px;
    left: 2px;
    top: 2px;
    border: 6px solid #905e60;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
    border-radius: 30px;
    z-index: 1;
    opacity: 0;
    -webkit-animation: warn2 2.5s ease-out;
    -moz-animation: warn2 2.5s ease-out;
    animation: warn2 2.5s ease-out;
    -webkit-animation-iteration-count: infinite;
    -moz-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }
  .pulse3 {
    position: absolute;
    width: 24px;
    height: 24px;
    left: 2px;
    top: 2px;
    border: 6px solid #905e60;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
    border-radius: 30px;
    z-index: 1;
    opacity: 0;
    -webkit-animation: warn3 3s ease-out;
    -moz-animation: warn3 3s ease-out;
    animation: warn3 3s ease-out;
    -webkit-animation-iteration-count: infinite;
    -moz-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }
</style>
