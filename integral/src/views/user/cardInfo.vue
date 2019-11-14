<template>
  <div class="pos-r card-info-wrap">
    <div class="card-info ta-c">
      <p>{{cardInfo.bankName}} {{cardInfo.cardType | cardTypeFilter}}</p>
      <p>{{cardInfo.cardNo | cardNoFilter}}</p>
    </div>

    <div class="pos-a edit-btn" @click="cardInfoVisible = true">编辑</div>
    
    <!--选择银行卡-底部弹框-->
    <div v-transfer-dom>
      <popup v-model="cardInfoVisible" position="bottom" max-height="50%">
        <div class="card-box">
          <div class="title">接触绑定</div>
          <div @click="cardInfoVisible = false">取消</div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import {TransferDom, Popup} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup
  },
  data () {
    return {
      cardInfoVisible: false,
      cardInfo: {}
    }
  },
  mounted () {
    this.cardInfo = JSON.parse(localStorage.getItem('curCardInfo'))
  }
}
</script>

<style scoped lang="less">
.card-info-wrap{
  height: 100vh;
  background: #eee;
  padding-top: .2rem;

  .card-info{
    width: 4rem;
    margin: .2rem auto;
    padding: .4rem;
  }

  .edit-btn{
    top: 0;
    right: 0;
  }
}
.card-box {
  text-align: center;
  background: #fff;

  div{
    height: .8rem;
    line-height: .8rem;
  }
  .title{
    border-bottom: 1px solid #eee;
  }
}
</style>
