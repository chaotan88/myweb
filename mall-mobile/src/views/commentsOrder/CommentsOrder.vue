<template>
    <div class="commentsOrder">
      <!--评论列表-->
      <div class="wrap" v-for="(v,index) in goodsInfo">
        <!--订单信息-->
        <ul class="orderInfor-box">
          <li class="left">
            <img :src="v.goodsImage | filterImgUrl">
          </li>
          <li class="right">
            <p class="title">{{v.goodsName}}</p>
            <span class="attribute">{{v.goodsAttribute}}</span>
          </li>
        </ul>
        <!--评论-->
        <div class="comments">
          <!--评价标题-->
          <div class="commentsTitle-box clr">
            <div class="left">评分</div>
            <ul class="right" v-for="(ite, ind) in startList">
              <li @click="startTap(index, ind, ite.value)">
                <template  v-if="v.checked == ind">
                  <img src="../../assets/images/my/c-flowers.png">
                  <span class="black">{{ite.name}}</span>
                </template>
                <template v-else>
                  <img src="../../assets/images/my/flowers.png">
                  <span>{{ite.name}}</span>
                </template>
              </li>
            </ul>
          </div>
          <!--文本域-->
          <div class="textarea">
            <textarea class="textarea-box" v-model="v.commentContent" placeholder="请说说它的优点与美中不足的地方吧"></textarea>
            <div>{{v.commentContent.length}}/100</div>
          </div>
          <!--文件上传-->
          <form name="uploadCon" :id="'uploadCon' + index">
            <div class="uploadImg">
              <ul>
                <li v-for="(ites, inds) in v.commentImage">
                  <img :src="ites | filterImgUrl">
                  <img src="../../assets/images/nav/delImg.png" @click="delImage(index, inds)">
                </li>
                <li class="uploadBtn">
                  <input type="file" accept="image/png,image/jpg" name="file" @change="uploadImage(index)" :id="'uploadFile' + index">
                </li>
              </ul>
            </div>
          </form>

        </div>
      </div>
      <!-- 赠送芯豆 -->
      <div class="giveBean" v-if="this.giveBeanSte">
       <div>恭喜您获得</div>
       <div>+{{beanGiveData}}</div>
      </div>
      <!--提交按钮-->
      <div style="height:1.3rem"></div>
      <div class="submit-box">
        <div class="submit-btn" @click="confirmComments">提交</div>
      </div>
    </div>
</template>

<script>
  import Vue from 'vue'
  import $ from 'jquery'
  export default {
    data () {
      return {
        giveBeanSte: false,             // 赠送芯豆弹窗
        beanGiveData: 0,                // 赠送芯豆个数
        uploadSte: false,
        goodsInfo: {},                  // 订单信息
        startList: [
          {
            name: '好评',
            value: 1
          },
          {
            name: '中评',
            value: 2
          },
          {
            name: '差评',
            value: 3
          }
        ] // 星星
      }
    },
    mounted: function () {
      var goodsInfo = JSON.parse(localStorage.getItem('addEvaluateInfo'))
      goodsInfo.forEach((item) => {
        Vue.set(item, 'commentContent', '')               // 设置评论字段
        Vue.set(item, 'commentType', '1')                 // 设置星星的值
        Vue.set(item, 'checked', '0')                     // 设置星星的下标
        Vue.set(item, 'commentImage', [])                 // 设置图片集合
      })
      this.goodsInfo = goodsInfo
    },
    methods: {
      /**
       * 星星点击
       * @index 商品列表的下标
       * @ind 每个列表里 星星的下标
       * @startval 每个列表里 星星的值
      */
      startTap (index, ind, startval) {
        console.log(index, ind)
        this.goodsInfo[index].checked = ind
        this.goodsInfo[index].commentType = startval
      },
      /**
       * 图片上传
      */
      uploadImage (index) {
        this.uploadSte = false
        this.$vux.loading.show({
          text: '图片上传中'
        })
        $.ajax({
          url: this.api.uploadImg + '?token=' + JSON.parse(localStorage.getItem('bsbUserInfo')).token,
          type: 'post',
          cache: false,
          data: new FormData($('#uploadCon' + index)[0]),
          processData: false,
          contentType: false
        }).done((res) => {
          this.uploadSte = true
          var resData = res
          document.getElementById('uploadFile' + index).value = ''
          this.$vux.loading.hide()
          if (resData.status === this.api.ERR_OK) {
            if (resData.data.match(/\.gif|png|jpg/gi)) {
              this.goodsInfo[index].commentImage.push(resData.data)
            }
          }
        }).fail(() => {
          this.$vux.loading.hide()
        })
      },
      /**
       * 删除图片
       * @index 商品列表的下标
       * @inds 每个商品列表 图片集合 -> 单个图片的下标
      */
      delImage (index, inds) {
        this.goodsInfo[index].commentImage.splice(inds, 1)
        document.getElementById('uploadFile' + index).value = ''
      },
      /**
       * 芯豆赠送
      */
      getGoldBeanNum () {
        this.$http.get(`${this.api.getGoldBeanNum}?ruleType=32`, {        // 29：签到、5：注册、23：分享商品、30、浏览商品、32、商品评价
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.beanGiveData = resData.data
            this.giveBeanSte = true
          }
        })
      },
      /**
       * 提交评论
      */
      confirmComments () {
        var flag = true
        var obj = {}
        var arr = []
        this.goodsInfo.forEach((item) => {
          if (item.commentContent.length > 0) {
            if (item.commentContent.length > 100) {
              this.$vux.toast.text('评论最多100字符')
              flag = false
            }
          }
          obj = {
            goodsId: item.goodsId,
            goodsAttribute: item.goodsAttribute,
            commentType: item.commentType,
            commentContent: item.commentContent,
            commentImage: item.commentImage.toString(),
            orderDetailId: item.orderDetailId
          }
          arr.push(obj)
        })
        if (!flag) return false
        this.$http.post(`${this.api.addComment}`, {
          commentList: arr
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            // this.$vux.toast.text('提交评论成功')
            this.getGoldBeanNum()
            setTimeout(() => {
              this.$router.back()
            }, 1000)
          } else {
            this.$vux.toast.text(resData.msg)
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
    .commentsOrder {
      height: 100vh;
      background: #eee;
      /*评论列表*/
      .wrap{
        margin-bottom: 0.2rem;
        height: auto;
        overflow: hidden;
        background: #fff;
        /*订单信息*/
        .orderInfor-box{
          display: flex;
          padding:0.2rem 0.3rem;
          background: #fff;
          margin-bottom: 0.2rem;
          .left{
            width:1.6rem;
            height: 1.6rem;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .right{
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            margin-left: 0.2rem;
            .title{
              line-height: 1.6em;
            }
            .attribute{
              color:#999;
              margin-top:0.2rem;
              font-size: 0.24rem;
            }
          }
        }
        /*评论*/
        .comments{
          background: #fff;
          /*评价标题*/
          .commentsTitle-box{
            height: 0.8rem;
            line-height: 0.8rem;
            background: #fff;
            padding:0 0.3rem;
            border-bottom: 1px solid #eee;
            .left{
              float: left;
            }
            .right{
              float: left;
              display: flex;
              li{
                flex:1;
                display: flex;
                align-items: center;
                margin-left: 0.6rem;
                img{
                  width: 0.4rem;
                }
                span{
                  color:#999;
                  margin-left: 0.1rem;
                }
                .checked{
                  color:#333;
                }
              }
            }
          }
          /*文本域*/
          .textarea{
            height: 2rem;
            padding:0.3rem;
            position: relative;
            .textarea-box{
              width: 100%;
              height: 100%;
              font-family: 微软雅黑;
              border:none;
              outline:none;
              resize:none;
              color:#999;
              font-size: .28rem;
            }
            div{
              position: absolute;
              right: .4rem;
              bottom: .4rem;
              color: #ccc;
            }
          }
          /*文件上传*/
          .uploadImg {
            padding: 0 .38rem;
            height: auto;
            ul{
              li{
                float: left;
                width: 1.6rem;
                height: 1.6rem;
                border: 1px solid #bcd0de;
                margin-right: 0.3rem;
                margin-bottom: 0.3rem;
                position: relative;
                .uploadBtn{
                  width: 1.6rem;
                  height: 1.6rem;
                  border: 1px dashed #bcd0de;
                  background: url("../../assets/images/uploadBtn.png") no-repeat;
                  background-size: .59rem .59rem;
                  background-position:center center;
                  position: relative;
                }
              }
              li img:first-child{
                width: 100%;
                height: 100%;
              }
              li img:nth-child(2){
                width: .34rem;
                height: .34rem;
                position: absolute;
                top: -.09rem;
                right: -.11rem;
              }
              li.uploadBtn{
                width: 1.6rem;
                height: 1.6rem;
                border: 1px dashed #bcd0de;
                background: url("../../assets/images/uploadBtn.png") no-repeat;
                background-size: .59rem .59rem;
                background-position:center center;
                position: relative;
              }
              li.uploadBtn input{
                width: 1.6rem;
                height: 1.6rem;
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
              }
            }
          }


        }
      }
      /*提交按钮*/
      .submit-box{
        padding:0 0.3rem;
        position: fixed;
        left: 0;
        bottom:0.5rem;
        right: 0;
        .submit-btn{
          height: 0.8rem;
          width: 100%;
          line-height: 0.8rem;
          text-align: center;
          background: #f23030;
          color:#fff;
          font-size: 0.32rem;
          border-radius: 0.1rem;
        }
      }
      /* 赠送芯豆 */
      .giveBean{
        min-height: 3.7rem;
        position: fixed;
        display: table;
        z-index: 5000;
        width: 30%;
        max-width: 5rem;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        text-align: center;
        border-radius: 6px;
        overflow: hidden;
        background: url('../../assets/images/product_get_dou_bg.png') no-repeat;
        background-color: rgba(0,0,0,0.5);
        background-size: 2.2rem 2.23rem;
        background-position: center bottom;
        div:nth-child(1){
          color: #fff;
          margin-top: .3rem;
          margin-bottom: .5rem;
        }
        div:nth-child(2){
          color: #f0d629;
        }
      }

    }
</style>
