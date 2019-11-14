<template>
    <div class="header">
      <div class="back" v-GoBack></div>
      <div class="tit">{{headerData}}</div>
      <div class="right">
        <i class="fa fa-circle" aria-hidden="true"></i>
        <i class="fa fa-circle" aria-hidden="true"></i>
        <i class="fa fa-circle" aria-hidden="true"></i>
      </div>
    </div>
</template>
<script>
  export default {
    props: ['headerData']
  }
</script>
<style scoped lang="less">
.header{
  width:100%;
  max-width: 7.5rem;
  text-align: center;
  height: .9rem;
  line-height: .9rem;
  background: #03111d;
  color: #fff;
  font-size: .28rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 3000;
  .back{
    width: .9rem;
    height: .9rem;
    font-size: .26rem;
    position: absolute;
    left: 0;
    &::before{
      content: "";
      width: .2rem;
      height: .2rem;
      border: 1px solid #ffffff;
      border-width: 1px 0 0 1px;
      -webkit-transform: rotate(315deg);
      transform: rotate(315deg);
      top: 8px;
      left: 7px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin:auto;
    }
  }
  .tit{
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 5rem;
    margin: auto;
  }
  .right{
    width: .9rem;
    height: .9rem;
    font-size: .24rem;
    position:absolute;
    right: 0;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-box;
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-box-align: center;
    -webkit-box-pack: center;
    i{
      display:block;
      margin: 0px 3px;
      width: 6px;
      height: 6px;
      border-radius: 100%;
      background: #ffffff;
    }
  }
}
</style>
