<template>
  <div @load="load">
    <div class="comtoUpgrade-page">
      <!--头部分区 tab banner-->
      <div class="titleBanner">
        <tabBanner :type="11" @bannerBack="bannerBack"> </tabBanner>
      </div>
      <!--列表循环-->
      <div class="listBox">
        <div class="comtoUpgrade-list" v-for="(item, index) in listDate" :key="index">
          <div class="list-top">
<!--            商品图片-->
            <img :src="item.propagandaImage"/>
          </div>
          <div class="list-bottom">
            <p>{{ item.propagandaInfo}}</p>
<!--            商品名称-->
            <p>{{ item.goodsName}}</p>
            <div class="bot-flex">
              <div class="asd1">
                <div>￥{{item.upgradePackagePrice | moneyFilter}}</div>
                <div>
                  <img src="../../assets/images/comtoUpgrade/bul.png"/>
                  赠 {{item.sendGreenGemstoneNum }}
                </div>
              </div>
              <div class="asd2">
                <span @click="goDetail(item)">立即购买</span>
                <span @click="toShareImg(item)">分享赚</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部信息-->
      <div class="footer">
        <div class="comtoUpgrade-foot1" v-if="!isLogin">
          <div class="foot-img">
            <img :src="defaultImg">
          </div>
          <div class="foot-jd1">您尚未登录，请<span style="color: red" @click="login()"> 登录</span></div>
        </div>
        <div class="comtoUpgrade-foot2" v-if="isLogin">
          <div class="foot-Info">
            <div class="foot-img">
              <img :src="personalData.avatar|| imgDate[personalData.rank] || defaultImg">
            </div>
<!--            一星团长-->
            <div class="foot-text" >{{ personalData.rankName || 'ren'}}</div>
          </div>
          <div class="foot-jd2">
            <div>累计消费:<div class="cover1"><p class="cover2" :style="'width:' + pat + '%'"></p></div>{{ (personalData.userSumConsume) | numberToW}} / {{(personalData.nextRankAgentFees) | numberToW}}</div>
            <div>购买套餐即默认同意代言商规则条款<span @click="dyxy">《代言协议》</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="comtoUpgrade">
      <x-dialog v-model="show" class="dialog-demo" :hide-on-blur="true">
        <div class="dialog-text">
          <div class="close" @click="show = false">
            ✕
          </div>
          <div class="dialog-cent">
           <div v-html="text"></div>
          </div>

          <div class="bot" @click="show = false" style="margin-top: .2rem">
            确认
          </div>
        </div>
      </x-dialog>
      <x-dialog v-model="showImg" class="dialog-demo" :hide-on-blur="true">
        <div class="dialog-text">
          <div class="close" @click="showImg = false">
            ✕
          </div>
          <div class="dialog-cent" style="height: auto">
            <div class="title">完善头像信息</div>
            <div class="text">恭喜您已升级成为{{personalData.rankName}}</div>
            <div>  请完善您的头像信息 </div>
          </div>
          <div class="bot" style="margin-top: .2rem; position: relative" @click="goUserDetile()">
            上传头像
<!--            <form name="uploadMage" id="uploadMage" style="position:absolute;top: 0;left: 0;opacity: 0">-->
<!--              <input type="file" accept="image/*" name="file" @change="uploadImage('uploadMage')" >-->
<!--            </form>-->
          </div>
        </div>
      </x-dialog>
    </div>
    <div class="shar">
    <!--<ShareImgBycomto :sharData="sharData" :show="showByShar" @change="change"></ShareImgBycomto>-->
    </div>
    <upGradeShare :shareInfo="shareInfo" ref="shareTxtDialog" v-model="shareImgShow" :goodsImg="goodsImg"></upGradeShare>
  </div>
</template>

<script>
    import { XDialog } from 'vux'
    import tabBanner from '../../components/Partition/banner'
    import upGradeShare from '../../components/shaer/upGradeShare.vue'
    import html2canvas from 'html2canvas'
    export default {
      name: 'comtoUpgrade',
      data () {
        return {
          text: '', // 代言协议
          sharData: {},
          showByShar: false,
          imgDate: {
            0: require('../../assets/images/groupImg/ph.png'), // 普通会员
            1: require('../../assets/images/groupImg/yt.png'), // 一星团长
            2: require('../../assets/images/groupImg/2t.png'), // 二星团长
            3: require('../../assets/images/groupImg/st.png')  // 三星团长
            // 4: require('../../assets/images/groupImg/yd.png'), // 一星代言人
            // 5: require('../../assets/images/groupImg/ypd.png'), // 银牌代言人
            // 6: require('../../assets/images/groupImg/jd.png') // 金牌代言人
          },
          defaultImg: require('../../assets/images/default-avatar.png'), // 默认头像
          showImg: false,
          personalData: {}, // 个人信息
          pat: 0, // 进度条占比
          isLogin: false, // 是否登陆
          show: false,
          listDate: [], // 套餐列表
          shareImgShow: false,
          goodsImg: '', // 分享商品图片
          shareInfo: {} // 分享数据
        }
      },
      mounted: function () {
      },
      methods: {
        load () {
          console.log('jiazai')
        },
        goUserDetile () {
          this.$router.push({path: '/personalInfor'})
        },
        /***
         * 组件返回分区id
         * @param item index
         * item  分区id
         */
        tabTap (item, index) {
          // console.log(item, index)
          this.tabMark = index
        },
        dyxy () {
          this.show = true
        },
        /***
         * 商品详情
         */
        goDetail (v) {
          this.$router.push({path: '/goodDetail', query: {goodsId: v.goodsId, pageType: 14}})
        },
        fxGet () {
        },
        /***
         * 组件返回分区id
         * @param res
         * goodsGroupId  分区id
         */
        bannerBack (res) {
          console.log(res)
          if (res.goodsGroupId) {
            this.goodsGroupId = res.goodsGroupId
            this.listDate = []
            this.getList()
          }
        },
        /***
         * 获取升级套餐列表
         */
        getList () {
          this.$http.post(`${this.api.getUpgradePackageGoodsList}`, {
            goodsGroupId: this.goodsGroupId
          }).then((res) => {
            if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
              return false
            }
            let resDate = res.data.data
            let list = resDate
            let resList = []
            for (let i in list) {
              let item = {
                goodsId: list[i].goodsId,                           // 商品Id
                skuId: list[i].skuId,                               // skuId
                propagandaImage: list[i].propagandaImage,           // 宣传图片
                goodsName: list[i].goodsName,                       // 商品名
                propagandaInfo: list[i].propagandaInfo,             // 宣传文案
                upgradePackagePrice: list[i].upgradePackagePrice,   // 套餐价格
                sendGreenGemstoneNum: list[i].sendGreenGemstoneNum  // 赠送绿宝
              }
              resList.push(item)
            }
            this.listDate = resList
            console.log(this.listDate)
          })
        },
        /***
         * 获取个人信息
         */
        getPersonalInfo () {
          this.$http.post(`${this.api.getUserRank}`, {
            id: this.bsbUserInfo ? this.bsbUserInfo.userId : ''
          }).then((res) => {
            if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
              this.isLogin = true
              this.personalData = res.data.data
              if (!this.personalData) {
                this.personalData = {}
                return
              }
              // 脏数据过滤
              if (!this.personalData.userSumConsume) { this.personalData.userSumConsume = 0 }
              if (!this.personalData.nextRankAgentFees) { this.personalData.nextRankAgentFees = 0 }
              // 计算进度条比例
              let p = this.personalData.userSumConsume / this.personalData.nextRankAgentFees
              //  等级到达代言商，未上传头像，提示上传头像
              if (this.personalData.rank >= 4 && !this.personalData.avatar) {
                this.showImg = true
              } else {
                this.showImg = false
              }
              if (p > 1) {
                this.pat = 100
              } else {
                this.pat = parseInt(p * 100)
              }
            } else if (parseInt(res.data.status) === 9997) {
              this.isLogin = false
            }
          })
        },
        /***
         * 登陆
         */
        login () {
          localStorage.setItem('REDIRECT_URL', this.$router.currentRoute.fullPath)           // 保存页面重定向url
          this.$router.replace({
            path: '/login',
            query: {redirect: this.$router.currentRoute.fullPath}
          })
        },
        /**
         * 图片上传
         */
        uploadImage (id) {
          this.uploadSte = false
          this.$vux.loading.show({
            text: '图片上传中'
          })
          // $('#uploadCon')[0]
          let dom = document.getElementById(id)
          var formData = new FormData(dom)
          this.$http.post(this.api.uploadImg, formData).then((res) => {
            let resData = res.data
            this.$vux.loading.hide()
            if (resData.status === this.api.ERR_OK) {
              this.addUserImg(resData.data)
            } else {
              this.$vux.toast.text(resData.msg)
            }
          }).catch(() => {
            this.$vux.loading.hide()
          })
        },
        /**
         * 跟新图片
         */
        addUserImg (url) {
          this.$http.post(this.api.saveAvatar, {
            avatar: url
          }).then((res) => {
            let resData = res.data
            this.$vux.loading.hide()
            if (resData.status === this.api.ERR_OK) {
              this.$vux.toast.text('上传头像成功')
              this.getPersonalInfo()
            } else {
              this.$vux.toast.text(resData.msg)
            }
          }).catch(() => {
            this.$vux.loading.hide()
          })
        },
        /**
         * 代言协议
         */
        getThemePresent () {
          this.$http.post(this.api.getThemePresent, {
          }).then((res) => {
            let resData = res.data
            this.$vux.loading.hide()
            if (resData.status === this.api.ERR_OK) {
              this.text = resData.data
            } else {
              this.$vux.toast.text(resData.msg)
            }
          }).catch(() => {
            this.$vux.loading.hide()
          })
        },
        /**
         * 分享
         */
        change () {

        },
        toShareImg (item) {
          // if (!this.isLogin) {
          //   this.login()
          //   return
          // }
          this.$vux.loading.show({
            text: '图片生成中...'
          })
          // alert(this.personalData.invitationCode, 'invitationCode')
          let shopId = this.$route.query.shopId ? this.$route.query.shopId : localStorage.getItem('shopId') ? localStorage.getItem('shopId') : 1
          let invitationCode = this.personalData.invitationCode || ''
          let codeUrl = window.location.href.match(/.*mshop/gi)[0] + '/goodDetail?goodsId=' + item.goodsId + '&shareInvitationCode=' + invitationCode + '&pageType=14&shopId=' + shopId
          this.shareInfo = item
          this.shareInfo.codeUrl = codeUrl
          let goodsImg = this.shareInfo.propagandaImage
          if (goodsImg && goodsImg.match(/http/gi) && goodsImg.indexOf('data:image') === -1) {
            this.getImageBase64ByUrl(goodsImg, (res) => {
              this.goodsImg = 'data:image/png;base64,' + res.data.data
              this.createImg()
            })
          } else {
            this.createImg()
          }
        },
        /**
         * 创建分享图片
         */
        createImg () {
          var dom = document.getElementById('shareTxtDialog')
          setTimeout(() => {
            html2canvas(dom, {
              backgroundColor: '#fff',
              logging: false
            }).then((canvas) => {
              this.$vux.loading.hide()
              let dataURL = canvas.toDataURL('image/png')
              this.shareInfo.dataURL = dataURL
              this.shareImgShow = true
            })
          }, 300)
        },
        /**
         * 图片转base64
         */
        getImageBase64ByUrl (url, fun) {
          this.$http.get(this.api.getImageBase64ByUrl, {
            params: {
              fileUrl: url
            }
          }).then((res) => {
            fun(res)
          })
        }
      },
      created () {
        this.getPersonalInfo()
        this.getThemePresent()
      },
      components: {
        XDialog,
        tabBanner,
        upGradeShare
      }
    }
</script>

<style scoped lang="less">
.comtoUpgrade-page{
  width: 7.5rem;
  min-height: 100vh;
  padding-bottom: 1rem;
  background: #1d1d1d;
  .comtoUpgrade-nav{
    height: 0.6rem;
    background: #000;
    display: flex;
    line-height: 0.6rem;
    overflow-y: scroll;
    .item-tab{
      padding-left: .4rem;
      padding-right: .4rem;
      font-size: .28rem;
      color: #ffffff;
    }
    .tabMarkCss{
      color: #ffffff;
    }
  }
  .comtoUpgrade-banner{
    width: 7.5rem;
    height: 3.75rem;
    background: #564c43;
  }
  .comtoUpgrade-choose{
    width: 7.5rem;
    height: 1.85rem;
    background: #f95a58;
  }
  .comtoUpgrade-list{
    margin: 0.19rem 0.32rem 0.19rem 0.32rem;
    background: #ffffff;
    -webkit-border-radius: 0.15rem;
    -moz-border-radius: 0.15rem;
    border-radius: 0.15rem;
    .list-top{
      width: 100%;
      height: 3.14rem;
      img{
        width: 100%;
        height: 100%;
        border-top-left-radius: 0.15rem;
        border-top-right-radius: 0.15rem;
      }
    }
    .list-bottom{
      padding: 0.18rem;
      p{
        width: 6.5rem;
        line-height: 0.4rem;
       &:nth-of-type(1) {
         font-size: 0.28rem;
         color: #303030;
         overflow: hidden;
         text-overflow:ellipsis;
         line-height: 0.4rem;
         white-space: normal;
         display: -webkit-box;
         -webkit-line-clamp: 1;
         -webkit-box-orient: vertical;
         word-break: break-all;
       }
        &:nth-of-type(2) {
          /*width: 5rem;*/
          font-size: 0.25rem;
          color: #626262;
          overflow: hidden;
          text-overflow:ellipsis;
          line-height: 0.4rem;
          white-space: normal;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
      }
      .bot-flex{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.18rem;
        .asd1{
          div{
            &:nth-of-type(1) {
              color: #242424;
              font-size: 0.24rem;
              font-weight: 600;
            }
            &:nth-of-type(2) {
              color: #242424;
              font-size: 0.21rem;
              display: flex;
              align-items: center;
              margin-top: 0.05rem;
              img{
                width: 0.17rem;
                height: 0.30rem;
                margin-right: 0.1rem;
              }
            }
          }
        }
        .asd2{
          display: flex;
          span{
            padding: 0.1rem 0.2rem;
            background: #e41019;
            color: #ffffff;
            margin-left: 0.16rem;
            -webkit-border-radius: 0.15rem;
            -moz-border-radius: 0.15rem;
            border-radius: 0.15rem;
          }
        }
      }
    }
  }
  .comtoUpgrade-foot1{
    width: 7.5rem;
    height: 1rem;
    background: #ffffff;
    position: fixed;
    left: 0rem;
    bottom: 0rem;
    display: flex;
    align-items: center;
    .foot-img{
      width: 0.74rem;
      height: 0.74rem;
      border-radius: 50%;
      background: #adadad;
      margin-left: 0.48rem;
      margin-right: 0.2rem;
      img{
        width: 0.74rem;
        height: 0.74rem;
        border-radius: .5rem;
      }
    }
    .foot-jd1{
      font-size: 0.22rem;
      color: #727272;

    }
  }
  .comtoUpgrade-foot2{
    width: 7.5rem;
    height: 1rem;
    background: #ffffff;
    position: fixed;
    left: 0rem;
    bottom: 0rem;
    display: flex;
    align-items: center;
    .foot-Info{
      width: 0.98rem;
      height: 0.86rem;
      margin-left: 0.48rem;
      margin-right: 0.2rem;
      .foot-img{
        width: 0.74rem;
        height: 0.74rem;
        border-radius: 50%;
        background: #adadad;
        margin-left: 0.12rem;

        img{
          width: 0.74rem;
          height: 0.74rem;
          border-radius: .5rem;
        }
      }
      .foot-text{
        width: 0.98rem;
        height: 0.25rem;
        line-height: 0.25rem;
        font-size: 0.16rem;
        color: #ffffff;
        background: #eec87e;
        text-align: center;
        position: relative;
        top: -0.12rem;
        -webkit-border-radius: 0.2rem;
        -moz-border-radius: 0.2rem;
        border-radius: 0.2rem;
      }
    }
    .foot-jd2{
      font-size: 0.22rem;
      color: #727272;
      div{
        &:nth-of-type(1) {
          display: flex;
          align-items: center;
          .cover1{
            width: 3rem;
            height: 0.16rem;
            background: #ffe8bb;
            -webkit-border-radius: 0.2rem;
            -moz-border-radius: 0.2rem;
            border-radius: 0.2rem;
            position: relative;
            margin: 0 0.1rem;
            .cover2{
              width: 2.4rem;
              height: 0.16rem;
              position: absolute;
              left: 0;
              top: 0;
              background: #caa256;
              -webkit-border-radius: 0.2rem;
              -moz-border-radius: 0.2rem;
              border-radius: 0.2rem;
            }
          }
        }
        &:nth-of-type(2) {
          span{
            color: #e41019;
          }
        }
      }
    }
  }
}
  .dialog-text{
    padding: 0.48rem;
    position: relative;
    .close{
      color: white;
      line-height: .4rem;
      font-size: .24rem;
      text-align: center;
      position: absolute;
      width: .4rem;
      height: .4rem;
      top: -.15rem;
      right: -.15rem;
      background: red;
      border-radius: .2rem;
    }
    .dialog-cent{
      width: 5.4rem;
      height: 6.50rem;
      overflow-y: scroll;
      overflow-x: visible;
    }

    .bot{
      width: 5.4rem;
      height: .86rem;
      background: #e41019;
      text-align: center;
      color: white;
      font-size: .28rem;
      line-height: .86rem;
    }
  }
</style>
<style lang="less">
  .comtoUpgrade {
    .weui-dialog{
      max-width: 90%;
      width: 6.37rem;
      overflow: visible;

      p{
        width: 100%;
        max-width: 6rem;
        word-wrap: break-word;
      }
    }
  }
</style>
