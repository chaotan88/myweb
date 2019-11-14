<template>
  <div>
    <div class="list-user-wrap111">
      <div class="list-user-info">
        <!--<div class="list-user-img"><img :src="detailData.goodsImageUrls"/></div>-->
        <div class="list-user-area">
          <p v-if="detailData.phone">{{detailData.phone | phoneSubstringTop}}</p>
          <p><span v-if="detailData.address">发布于</span>{{detailData.address}}</p>
        </div>
      </div>
      <div class="list-user-ewm" @click="skmMask">
        <img :src="fkm"/>
      </div>
    </div>
    <div class="list-user-detail">
      <div class="detail-title">￥{{detailData.goodsPrice}}</div>
      <div class="detail-txt">{{detailData.description}}</div>
      <div class="detail-img">
        <div><img :src="detailData.mainImage"/></div>
        <div v-for="(item, index) in detailData.goodsImageUrls" :key="index" class="otherImg" v-if="detailData.goodsImageUrls.length > 0"><img :src="item"/></div>
      </div>
      <div class="detail-uuid">
        <p>{{detailData.publishTime | formatDate(1)}}发布</p>
        <!--<p><span>{{detailData.viewCount}}</span>人浏览</p>-->
        <p><span>{{detailData.collectCount}}</span>人收藏</p>
      </div>
    </div>
    <div class="list-user-foot">
      <div class="foot-cz1">
        <img :src="collect" v-if="isCollect" @click="joinCalCollect"/>
        <img :src="nocollect" v-if="!isCollect" @click="joinCalCollect"/>
        <span v-if="isCollect" @click="joinCalCollect" style="color: #b2121c;">已收藏</span>
        <span v-if="!isCollect" @click="joinCalCollect">收藏</span>
      </div>
      <div class="foot-cz1" @click="skmMask">
        <img :src="att10"/>
        收款码
      </div>
      <div class="foot-cz1" @click="jhyMask">
        <img :src="att5"/>
        加好友
      </div>
      <div class="foot-cz2" v-if="detailData.goodsStatus === 1" @click="callPhone">
        <a v-if="!bsbUserInfo">
          <img :src="att7"/>
          拨打电话
        </a>
        <a :href="'tel:' + detailData.phone" v-if="bsbUserInfo">
          <img :src="att7"/>
          拨打电话
        </a>
      </div>
      <div class="foot-cz3" v-if="detailData.goodsStatus === 2">
        已下架
      </div>
    </div>
    <x-dialog v-model="showToast1" class="dialog-demo" :hide-on-blur="true">
      <div style="width: 100%;height: 7rem;"><img :src="detailData.payCodeUrl" style="width:100%;"/></div>
    </x-dialog>
    <x-dialog v-model="showToast2" class="dialog-demo" :hide-on-blur="true">
      <div style="width: 100%;height: 7rem;"><img :src="detailData.wxUrl" style="width: 100%;"/></div>
    </x-dialog>
  </div>
</template>

<script>
    import { XDialog } from 'vux'
    export default {
      name: 'barterDetails',
      data () {
        return {
          bsbUserInfo: null,
          isCollect: false,
          showToast1: false,
          showToast2: false,
          detailData: [],
          nocollect: require('../../assets/images/att/ATT_03.png'),
          att5: require('../../assets/images/att/ATT_05.png'),
          att7: require('../../assets/images/att/ATT_07.png'),
          att10: require('../../assets/images/att/ATT_10.png'),
          collect: require('../../assets/images/att/colloect.png'),
          fkm: require('../../assets/images/att/fkm.png')
        }
      },
      mounted () {
        this.detailData = JSON.parse(localStorage.getItem('detailData'))
        console.log(this.detailData)
        window.scrollTo(0, 0)
        /***
         * 坑啊，后端没做用户是否收藏与否，要前端判断，APP居然妥协了，卧槽卧槽
         * **/
        if (this.detailData.collectStatus === 1) {
          this.isCollect = true
        } else {
          this.isCollect = false
        }
      },
      components: {
        XDialog
      },
      methods: {
        /***
         * 去收藏
         * **/
        joinCalCollect () {
          this.bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
          if (this.bsbUserInfo && this.bsbUserInfo.token) {
          } else {
            localStorage.setItem('REDIRECT_URL', '/barterDetails')
            this.$router.push({
              path: '/login?attCode=' + 'A0001',
              query: {redirect: '/barterDetails'}
            })
          }
          if (this.$route.query.path === 1) {
            if (this.isCollect) {
              this.isCollect = !this.isCollect
              this.$http.post(`${this.api.updateCollectStatus}`, {
                attInfoId: this.detailData.id
              }).then((res) => {
                if (res.data && res.data.status === '1') {
                  this.$vux.toast.text(res.data.msg)
                } else {
                  this.$vux.toast.text(res.data.msg)
                }
              })
            } else {
              this.isCollect = !this.isCollect
              this.$http.post(`${this.api.attCollect}`, {
                attInfoId: this.detailData.id
              }).then((res) => {
                if (res.data && res.data.status === '1') {
                  this.$vux.toast.text(res.data.msg)
                } else {
                  this.$vux.toast.text(res.data.msg)
                }
              })
            }
          } else if (this.$route.query.path === 2) {
            if (this.isCollect) {
              this.isCollect = !this.isCollect
              this.$http.post(`${this.api.updateCollectStatus}`, {
                attInfoId: this.detailData.attInfoId
              }).then((res) => {
                if (res.data && res.data.status === '1') {
                  this.$vux.toast.text(res.data.msg)
                } else {
                  this.$vux.toast.text(res.data.msg)
                }
              })
            } else {
              this.isCollect = !this.isCollect
              this.$http.post(`${this.api.attCollect}`, {
                attInfoId: this.detailData.attInfoId
              }).then((res) => {
                if (res.data && res.data.status === '1') {
                  this.$vux.toast.text(res.data.msg)
                } else {
                  this.$vux.toast.text(res.data.msg)
                }
              })
            }
          } else {
            if (this.isCollect) {
              this.isCollect = !this.isCollect
              this.$http.post(`${this.api.updateCollectStatus}`, {
                attInfoId: this.detailData.id
              }).then((res) => {
                if (res.data && res.data.status === '1') {
                  this.$vux.toast.text(res.data.msg)
                } else {
                  this.$vux.toast.text(res.data.msg)
                }
              })
            } else {
              this.isCollect = !this.isCollect
              this.$http.post(`${this.api.attCollect}`, {
                attInfoId: this.detailData.id
              }).then((res) => {
                if (res.data && res.data.status === '1') {
                  this.$vux.toast.text(res.data.msg)
                } else {
                  this.$vux.toast.text(res.data.msg)
                }
              })
            }
          }
        },
        callPhone () {
          this.bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
          if (this.bsbUserInfo && this.bsbUserInfo.token) {
          } else {
            localStorage.setItem('REDIRECT_URL', '/barterDetails')
            this.$router.push({
              path: '/login?attCode=' + 'A0001',
              query: {redirect: '/barterDetails'}
            })
          }
        },
        /***
         * 遮罩层的显示与隐藏
         * **/
        skmMask () {
          this.showToast1 = true
        },
        jhyMask () {
          this.showToast2 = true
        }
      }
    }
</script>

<style scoped lang="less">
  .list-user-wrap111{
    width: 100%;
    height: 1.45rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f4f4f4;
    .list-user-info{
      display: flex;
      align-items: center;
      .list-user-img{
        width: 0.88rem;
        height: 0.88rem;
        border-radius: 50%;
        margin-left: 0.2rem;
        img{
          width: 0.88rem;
          height: 0.88rem;
          border-radius: 50%;
        }
      }
      .list-user-area{
        font-size: 0.22rem;
        margin-left: 0.1rem;
        p{
          height: 0.42rem;
          line-height: 0.42rem;
        }
        p:nth-of-type(1) {
          color: #333333;
          font-size: 0.3rem;
        }
        p:nth-of-type(2) {
          color: #8f8f8f;
        }
      }
    }
    .list-user-ewm{
      width: 1.42rem;
      height: 1.5rem;
      img{
        width: 1.42rem;
        height: 100%;
      }
    }
  }
  .list-user-detail{
    padding: 0.17rem 0.2rem 1.18rem 0.2rem;
    .detail-title{
      font-size: 0.3rem;
      color: #ff191d;
      font-weight: 700;
    }
    .detail-txt{
      margin-top: 0.12rem;
      max-width: 6.8rem;
      white-space: normal;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
      height: 0.7rem;
      color: #191919;
      font-size: 0.26rem;
    }
    .detail-img{
      width: 7.1rem;
      margin-top: 0.22rem;
      div:nth-of-type(1) {
        width: 7.1rem;
        /*height: 6.6rem;*/
        img{
          width: 7.1rem;
          height: 100%;
        }
      }
      .otherImg{
        width: 7.1rem;
        /*height: 6.6rem;*/
        margin-top: 0.2rem;
        img{
          width: 7.1rem;
          /*height: 100%;*/
        }
      }
    }
    .detail-uuid{
      display: flex;
      color: #8f8f8f;
      font-size: 0.18rem;
      margin: 0.2rem 0 0.42rem 0.18rem;
      padding-right: 0.36rem;
      align-items: center;
      justify-content: space-between;
      font-size: 0.23rem;
      p{
        span{
          color: #5785d9;
        }
      }
    }
  }
  .list-user-foot{
    width: 7.1rem;
    height: 1rem;
    line-height: 1rem;
    background: #ffffff;
    box-shadow: 0px -2px 10px #efefef;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    padding: 0 0.2rem;
    justify-content: space-between;
    align-items: center;
    .foot-cz1{
      display: flex;
      align-items: center;
      font-size: 0.26rem;
      img{
        width: 0.3rem;
        height: 0.3rem;
        margin-right: 0.1rem;
      }
    }
    .foot-cz2{
      a{
        display: block;
        width: 1.53rem;
        height: 0.57rem;
        line-height: 0.57rem;
        display: flex;
        align-items: center;
        color: #ffffff;
        font-size: 0.18rem;
        border: 2px solid #ff6d16;
        background: #ff191d;
        -webkit-border-radius: 0.15rem;
        -moz-border-radius: 0.15rem;
        border-radius: 0.15rem;
        justify-content: space-around;
      }
      img{
        width: 0.3rem;
        height: 0.3rem;
        /*margin-right: 0.1rem;*/
      }
    }
    .foot-cz3{
      width: 1.55rem;
      height: 0.57rem;
      line-height: 0.57rem;
      text-align: center;
      background: #bdbdbd;
      color: #ffffff;
      font-size: 0.18rem;
      -webkit-border-radius: 0.15rem;
      -moz-border-radius: 0.15rem;
      border-radius: 0.15rem;
    }
  }
</style>
<style>
  .weui-dialog {
    position: fixed;
    display: table;
    z-index: 5000;
    width: 93%;
    max-width: 350px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background-color: #FFFFFF;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
  }
</style>
