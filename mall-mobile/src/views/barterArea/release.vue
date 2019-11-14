<template>
  <div>
    <div class="input-box">
      <input placeholder="请输入商品标题(30字以内)" v-model="fromDate.goodsTitle" max="30" :maxlength="maxlength"/>
    </div>
    <!--文本域-->
    <div class="textarea">
      <textarea class="textarea-box" placeholder="请详细描述宝贝" v-model="fromDate.description"></textarea>
    </div>
    <!--文件上传-->
    <form name="uploadCon" id="uploadCon" class="form">
      <div class="uploadImg">
        <ul>
          <li v-for="(ites, index) in commentImage">
            <img :src="ites | filterImgUrl">
            <div class="closeBox">
              <img src="../../assets/images/att/cloes.png" @click="delImage(index)" class="col">
            </div>

            <div class="index" v-if="index == 0">
              主图
            </div>
          </li>
          <li class="uploadBtn" v-if="commentImage.length < 5">
            <div class="uploadBtnBox"> </div>
            <input type="file" accept="image/*" name="file" @change="uploadImage('uploadCon')" >
            <p>照片</p>
          </li>
        </ul>
      </div>
      <div class="iconBox" v-if="fromDate.address">
        <span class="icon">
          <img src="../../assets/images/att/attAdress.png"/>
        </span>
        <span class="address">{{fromDate.address}}</span>
      </div>
    </form>
    <!--输入价格-->
    <div class="input-box">
      <input placeholder="请输入价格" type="number"  v-model="fromDate.goodsPrice" @change="priceFn()"/>
    </div>
    <!--请输入手机号-->
    <div class="input-box">
      <input placeholder="请输入手机号" type="number"   v-model="fromDate.phone"/>
    </div>
    <!--上传收款码-->
    <div class="input-box2">
      <div class="sk-l" v-show="!fromDate.payCodeUrl">上传收款码</div>
      <div class="sk-l"  v-show="fromDate.payCodeUrl">
        <img :src="fromDate.payCodeUrl"/>
        <div class="coles">
          <img src="../../assets/images/att/cloes.png" @click="fromDate.payCodeUrl = ''">
        </div>
      </div>
      <div class="sk-r">
        <form name="uploadPayCode" id="uploadPayCode">
          <input type="file" accept="image/*" name="file" @change="uploadImage('uploadPayCode')" >
        </form>
        <img :src="zxj"/>
      </div>
    </div>
    <!--上传微信二维码-->
    <div class="input-box2">
      <div class="sk-l" v-show="!fromDate.wxUrl">上传微信二维码</div>
      <div class="sk-l" v-show="fromDate.wxUrl">
        <img :src="fromDate.wxUrl"/>
        <div class="coles">
          <img src="../../assets/images/att/cloes.png" @click="fromDate.wxUrl = ''">
        </div>
      </div>
      <div class="sk-r">
        <form name="uploadWx" id="uploadWx">
          <input type="file" accept="image/*" name="file" @change="uploadImage('uploadWx')" >
        </form>
        <img :src="zxj"/>
      </div>
    </div>
    <div class="bot">
      <div class="submit" @click="addAttInfoList">
        {{textIndex === 0 ? '确认发布' : '保存'}}
      </div>
    </div>
    <baidu-map :center="center" :zoom="zoom"  @ready="handler">
    </baidu-map>
  </div>
</template>

<script>
    export default {
      name: 'release',
      data () {
        return {
          maxlength: 30,
          center: {lng: 0, lat: 0},
          zoom: 15,
          textIndex: 0, // 界面类型
          url: '',
          file: '',
          asd: '',
          commentImage: [],
          wxcode: '',
          paycode: '',
          zxj: require('../../assets/images/att/ATT_11.png'),
          fromDate: {
            goodsTitle: '', // 商品标题
            description: '', // 商品描述
            mainImage: '', // 主图
            goodsImageUrls: '', // 主图外其他图片
            address: '', // 发布地址
            goodsPrice: '', // 价格
            phone: '', // 手机号
            payCodeUrl: '', // 支付二维码
            wxUrl: '' // 微信二维码
          }
        }
      },
      created () {
        // if (window.navigator.geolocation) {
        //   navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, {
        //     enableHighAccuracy: true, // 是否获取更精确的位置
        //     timeout: 6000 // 请求超时时间,单位ms；
        //   })
        // } else {
        //   console.log('不支持')
        // }
      },
      mounted () {
        this.getPersonalInfo()
        if (this.$route.query.id) {
          this.textIndex = 1
          // 是否编辑过来
          this.url = this.api.updateAttInfo
          let parm = JSON.parse(localStorage.getItem('editData')) || {}
          let list = []
          if (parm.mainImage) {
            list.push(parm.mainImage)
          }
          if (parm.goodsImageUrls) {
            let mag = parm.goodsImageUrls.split(',')
            for (let i in mag) {
              list.push(mag[i])
            }
          }
          this.commentImage = list
          this.fromDate = {
            id: parm.id,
            goodsTitle: parm.goodsTitle, // 商品标题
            description: parm.description, // 商品描述
            mainImage: parm.mainImage, // 主图
            goodsImageUrls: parm.goodsImageUrls, // 主图外其他图片
            address: parm.address, // 发布地址
            goodsPrice: parm.goodsPrice, // 价格
            phone: parm.phone, // 手机号
            payCodeUrl: parm.payCodeUrl, // 支付二维码
            wxUrl: parm.wxUrl // 微信二维码
          }
        } else {
          // 发布
          this.textIndex = 0
          this.url = this.api.addAttInfoList
          // let address = localStorage.getItem('ADDRESS')
          // this.fromDate.address = address
        }
      },
      methods: {
        priceFn () {
          this.fromDate.goodsPrice = (parseInt(this.fromDate.goodsPrice * 100) / 100).toFixed(2)
        },
        handler ({BMap, map}) {
          this.ampFn(BMap, map)
        },
        ampFn (BMap, map) {
          // 定位对象
          this.geoc = new BMap.Geocoder()
          var geolocation = new BMap.Geolocation()
          geolocation.getCurrentPosition((r) => {
            if ((geolocation.getStatus() + '') === '0' && r.accuracy) {
              this.setLocation(r.point)
            }
          }, {enableHighAccuracy: true})
        },
        setLocation (point) {
          this.geoc.getLocation(point, (rs) => {
            var addComp = rs.addressComponents
            var result = addComp.province + addComp.city + addComp.district
            this.fromDate.address = result
          })
        },
        onSuccess (position) {
          var latitude = position.coords.latitude
          var longitude = position.coords.longitude
          alert(latitude, longitude)
          alert(position)
        },
        onError (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('您拒绝对获取地理位置的请求')
              break
            case error.POSITION_UNAVAILABLE:
              alert('位置信息是不可用的')
              break
            case error.TIMEOUT:
              alert('请求您的地理位置超时')
              break
            case error.UNKNOWN_ERROR:
              alert('未知错误')
              break
          }
        },
        /**
         * 获取个人信息
         */
        getPersonalInfo () {
          this.$http.post(`${this.api.personalInfo}`, {
            id: JSON.parse(localStorage.getItem('bsbUserInfo')).userId
          }).then((res) => {
            // console.log(res)
            if (res.data && res.data.status === '1') {
              let cardStatus = res.data.data.user.cardStatus
               // 取标识
              let bs = localStorage.getItem('bs') || ''
              if (cardStatus === 1) { // 未认证
                // 存标识   1
                if (bs) {
                  localStorage.removeItem('bs')
                  this.$router.back(-1)
                } else {
                  localStorage.setItem('bs', '1')
                  this.$router.replace({path: '/realNameAuth', query: {types: 1, pageOrigin: 'set'}})
                }
              }
            }
          })
        },
        /**
         * 发布
         */
        addAttInfoList () {
          this.fromDate.mainImage = ''
          this.fromDate.goodsImageUrls = ''
          for (let i = 0; i < this.commentImage.length; i++) {
            if (!this.commentImage[i]) return false
            if (i === 0) {
              this.fromDate.mainImage = this.commentImage[0]
            } else if (i === (this.commentImage.length - 1) && i > 0) {
              this.fromDate.goodsImageUrls += this.commentImage[i]
            } else {
              this.fromDate.goodsImageUrls += this.commentImage[i] + ','
            }
          }
          if (!this.fromDate.goodsTitle) {
            this.$vux.toast.text('请输入商品标题')
            return false
          } else if (this.fromDate.goodsTitle.length > 30) {
            this.$vux.toast.text('商品标题大于30字')
            return false
          }
          if (!this.fromDate.description) {
            this.$vux.toast.text('请输入商品描述')
            return false
          }
          if (!this.fromDate.mainImage) {
            this.$vux.toast.text('请上传商品主图')
            return false
          }
          if (!this.fromDate.goodsPrice) {
            this.$vux.toast.text('请输入商品价格')
            return false
          }
          if (!this.fromDate.phone) {
            this.$vux.toast.text('请输入手机号')
            return false
          } if (!this.fromDate.phone.match(/^1\d{10}$/g)) {
            this.$vux.toast.text('请输入正确的手机号')
            return false
          }
          if (!this.fromDate.payCodeUrl) {
            this.$vux.toast.text('请上传支付二维码')
            return false
          }
          if (!this.fromDate.wxUrl) {
            this.$vux.toast.text('请上传微信二维码')
            return false
          }
          this.$http.post(`${this.url}`, this.fromDate).then((res) => {
            let resData = res.data
            this.$vux.loading.hide()
            if (resData.status === this.api.ERR_OK) {
              this.$router.push({path: '/tradCenter'})
            } else {
              this.$vux.loading.show({
                text: resData.msg
              })
            }
          })
        },
        /**
         * 图片上传
         */
        uploadImage (id) {
          if (this.commentImage.length >= 5 && id === 'uploadCon') {
            this.$vux.loading.show({
              text: '最多上传5张图片'
            })
            return false
          }
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
              if (resData.data.match(/\.gif|png|jpg|jpeg/gi)) {
                if (id === 'uploadCon') {
                  this.commentImage.push(resData.data)
                }
                if (id === 'uploadPayCode') {
                  this.fromDate.payCodeUrl = resData.data
                }
                if (id === 'uploadWx') {
                  this.fromDate.wxUrl = resData.data
                }
              }
            } else {
            }
          }).catch(() => {
            this.$vux.loading.hide()
          })
        },
        /**
         * 删除图片
         * @index 商品列表的下标
         * @inds 每个商品列表 图片集合 -> 单个图片的下标
         */
        delImage (index) {
          this.commentImage.splice(index, 1)
        }
      }
    }
</script>

<style scoped lang="less">
  .bot{
    width: 100%;
    padding: 0.2rem;
    box-sizing: border-box;
    margin-top: .4rem;
    margin-bottom: .4rem;
    .submit{
      width: 90%;
      background: #f19736;
      margin: auto;
      padding: .2rem;
      border-radius: .3rem;
      line-height: .6rem;
      text-align: center;
      font-size: .3rem;
      color: white;
    }
  }
.textarea{
  padding: 0.2rem;
  position: relative;
  height: 2rem;
  .textarea-box{
    width: 100%;
    height: 2rem;
    font-family: 微软雅黑;
    border: none;
    outline: none;
    resize: none;
    color: #333;
    font-size: .28rem;
  }
}
.form{
  border-bottom: 1px solid #d1d1d1;
  box-sizing: border-box;
  padding: .2rem .2rem 0 .2rem;

  .iconBox{
    display: flex;
    flex-direction: row;
    .icon{
      margin-right: .1rem;
      width: .40rem;
      height: .60rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      img{
        width: .37rem;
        height: .38rem;
      }
    }
    .address{
      font-size: .28rem;
      color: #999;
      line-height: .70rem;
    }
  }

}
  .input-box{
    width: 7.5rem;
    line-height: 1.18rem;
    border-bottom: 1px solid #d1d1d1;
    input{
      margin-left: 0.23rem;
      color: #333;
      font-size: 0.26rem;
      height: 1rem;
      min-width: 6rem;
    }
  }
  .input-box2{
    width: 7.1rem;
    height: 1.18rem;
    line-height: 1.18rem;
    padding: 0 0.2rem;
    border-bottom: 1px solid #d1d1d1;
    justify-content: space-between;
    align-items: center;
    display: flex;
    .sk-l{
      width: 6rem;
      color: #d1d1d1;
      font-size: 0.26rem;
      height: 0.87rem;
      position: relative;
      img{
        width: 0.87rem;
        height: 0.87rem;
      }

      .coles{
        width: .25rem;
        height: .25rem;
        position: absolute;
        top: -.09rem;
        left: -.11rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: rgb(242,215,82);
        border-radius: .16rem;
        img{
          width: .10rem;
          height: .11rem;
        }
      }
    }
    .sk-r{
      width: 1rem;
      height: 0.87rem;
      position: relative;
      img{
        width: 1rem;
        height: 100%;
      }
      input{
        width: 1.5rem;
        height: 0.87rem;
        position: absolute;
        left: -.5rem;
        top: 0;
        opacity: 0;
      }
    }
  }
/*文件上传*/
.uploadImg {
  height: auto;
  ul{
    display: flex;
    flex-direction: row;
    justify-content: left;
    flex-wrap: wrap;
    li{
      width: 1.4rem;
      height: 1.4rem;
      border: 1px solid #bcd0de;
      margin-right: 0.3rem;
      margin-bottom: 0.3rem;
      position: relative;
      .uploadBtn{
        width: 1.4rem;
        height: 1.4rem;
        border: 1px dashed #bcd0de;
        background: url("../../assets/images/uploadBtn.png") no-repeat;
        background-size: .59rem .59rem;
        background-position:top center;
        position: relative;
      }
      .index{
        background: rgb(242,215,82);
        font-size: .16rem;
        position: absolute;
        bottom: .09rem;
        left: .11rem;
        color: #333;
        border-radius: 8px ;
        padding-left: .1rem;
        padding-right: .1rem;
      }
    }
    li img:first-child{
      width: 100%;
      height: 100%;
    }
    .closeBox {
      width: .25rem;
      height: .25rem;
      position: absolute;
      top: -.09rem;
      left: -.11rem;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background: rgb(242,215,82);
      border-radius: .16rem;
      img.col{
        width: .10rem;
        height: .11rem;
      }
    }
    li.uploadBtn{
      width: 1.4rem;
      height: 1.4rem;
      border: 1px dashed #bcd0de;
      background-size: .59rem .59rem;
      position: relative;
      p{
        width: 100%;
        font-size: .28rem;
        text-align: center;
      }
      .uploadBtnBox{
        width: 1.2rem;
        height: .79rem;
        margin: auto;
        margin-top: .1rem;
        background: url("../../assets/images/uploadBtn.png") no-repeat;
        background-size: .59rem .59rem;
        background-position: top center;
      }
    }
    li.uploadBtn input{
      width: 1.4rem;
      height: 1.4rem;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
}
</style>
