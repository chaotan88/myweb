<template>
  <div class="addGroupCard-wrap">
    <ul>
      <li>
        <h2>群名称</h2>
        <div>
          <input type="text" placeholder="请填写群名称" v-model="formData.groupName" maxlength="20">
        </div>
      </li>
      <li>
        <h2>群说明</h2>
        <div>
          <textarea placeholder="请填写群说明" v-model="formData.groupDescription"></textarea>
          <p class="txt-len">({{formData.groupDescription.length}}/{{formData.groupDescriptionLen}})</p>
        </div>
      </li>
    </ul>
    <form name="uploadForm" id="uploadForm">
      <div class="upload-title">上传群二维码</div>
      <div class="upload-img" v-if="formData.isShowUploadBtn">
        <input type="file" @change="uploadImage" accept="image/png,image/jpg" name="file" id="uploadFile">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zhaoxiangji"></use>
        </svg>
      </div>
    </form>
    <!-- 二维码展示 -->
    <div class="qrcode-list">
      <ul>
        <li v-for="(item, index) in formData.imgData">
          <x-icon type="ios-minus" size="30" @click="delImg(index)"></x-icon>
          <qrcode :value="item" type="img"></qrcode>
        </li>
      </ul>
    </div>
    <div class="addGroupCard-tip">请上传最新的微信群二维码</div>
    <div class="addGroupCard-btn" @click="preservateData">保存</div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import { Qrcode } from 'vux'
  export default {
    components: {
      Qrcode
    },
    data () {
      return {
        formData: {
          groupId: '',                     // 群id
          groupName: '',                   // 群名称
          groupDescription: '',            // 群说明
          groupDescriptionLen: 50,         // 群说明最大字符
          imgData: [],                     // 上传的图片
          imgDataLen: 1,                   // 上传的图片的个数限制
          isShowUploadBtn: true            // 是否显示上传按钮
        }
      }
    },
    mounted: function () {
      // 编辑页面获取详情数据
      if (this.$route.query.pageType === 'edit') {
        this.getGroupDetail()
      }
    },
    methods: {
      /**
       * 获取群名片详情
      */
      getGroupDetail () {
        this.$http.get(this.api.getGroupDetail, {
          params: {
            id: this.$route.query.id
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            return false
          }
          this.formData.groupId = resData.data.id
          this.formData.groupName = resData.data.groupName
          this.formData.groupDescription = resData.data.groupExplain
          if (resData.data.qrcodeImage) {
            this.formData.imgData.push(resData.data.qrcodeImage)
          }
          this.formData.isShowUploadBtn = resData.data.qrcodeImage ? !!false : !!true
        })
      },
      /**
       * 解析二维码
      */
      decoderQRCode (imgPath) {
        this.$http.get(this.api.decoderQRCode, {
          params: {
            imgPath: imgPath
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            this.$vux.toast.text('请上传正确的二维码')
            return false
          }
          this.formData.imgData.push(resData.data)
          if (this.formData.imgData.length >= this.formData.imgDataLen) {
            this.formData.isShowUploadBtn = false
          } else {
            this.formData.isShowUploadBtn = true
          }
        })
      },
      /**
       * 图片上传
      */
      uploadImage () {
        var token = JSON.parse(localStorage.getItem('bsbUserInfo')) ? JSON.parse(localStorage.getItem('bsbUserInfo')).token : ''
        this.uploadSte = false
        this.$vux.loading.show({
          text: '图片上传中'
        })
        $.ajax({
          url: this.api.uploadImg + '?token=' + token,
          type: 'post',
          cache: false,
          data: new FormData($('#uploadForm')[0]),
          processData: false,
          contentType: false
        }).done((res) => {
          this.$vux.loading.hide()
          let resData = res
          document.getElementById('uploadFile').value = ''        // 清空input值
          if (resData.status !== this.api.ERR_OK) {
            this.$vux.toast.text(resData.msg)
            return false
          }
          if (resData.data.match(/\.gif|png|jpg|jpeg/gi)) {
            this.decoderQRCode(resData.data)
          } else {
            this.$vux.toast.text('图片格式仅支持gif、png、jpg')
          }
        }).fail(() => {
          this.$vux.loading.hide()
        })
      },
      /**
       * 删除图片
      */
      delImg (index) {
        this.formData.imgData.splice(index, 1)
        this.formData.isShowUploadBtn = true
      },
      /**
       * 保存
      */
      preservateData () {
        if (!this.formData.groupName) {
          this.$vux.toast.text('请填写群名称')
          return false
        } if (!this.formData.groupDescription) {
          this.$vux.toast.text('请填写群说明')
          return false
        } if (this.formData.groupDescription.length > this.formData.groupDescriptionLen) {
          this.$vux.toast.text('群说明字符过长')
          return false
        } if (this.formData.imgData.length <= 0) {
          this.$vux.toast.text('请上传群二维码')
          return false
        }
        let resParma = {
          groupName: this.formData.groupName,
          groupExplain: this.formData.groupDescription,
          qrcodeImage: this.formData.imgData.toString()
        }
        let resUrl = ''
        // 编辑页面
        if (this.$route.query.pageType === 'edit') {
          resParma.id = this.formData.groupId
          resUrl = this.api.editGroup
        } else {
          resUrl = this.api.addGroup
        }
        this.$http.post(resUrl, resParma).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            return false
          }
          this.routerReplace({path: '/pullGroupTool/pullGroupAssistant'})
        })
      }
    }
  }
</script>
<style lang="less">
  .addGroupCard-wrap{
    padding: 0 .21rem;
    ul{
      li{
        h2{
          font-size: .28rem;
          color: #333333;
          line-height: .76rem;
          margin-left: .2rem;
        }
        div{
          height: auto;
          overflow: hidden;
          position: relative;
          input,textarea{
            width: 100%;
            height: .68rem;
            background: #f5f5f5;
            font-size: .24rem;
            border-radius: 4px;
            padding-left: .2rem;
            box-sizing: border-box;
          }
          textarea{
            height: 3.18rem;
            border: none;
            padding-top: .24rem;
            outline: none;
            resize: none;
          }
          .txt-len{
            position: absolute;
            right: .2rem;
            bottom: .2rem;
            font-size: .24rem;
            color: #666666;
          }
        }
      }
    }
    .upload-title{
      font-size: .28rem;
      color: #333333;
      padding: .3rem .4rem;
    }
    .upload-img{
      width: 1.36rem;
      height: 1rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: .34rem;
      margin-bottom: .1rem;
      position: relative;
      input{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      }
      span{
        font-size: .28rem;
        color: #747474;
      }
      svg{
        width: 1.36rem;
        height: 1rem;
        fill: #747474;
      }
    }
    .qrcode-list{
      margin: .3rem 0;
      ul{
        text-align: center;
        li{
          width: 2.1rem;
          height: 2.1rem;
          display: inline-table;
          position: relative;
          svg{
            width: .4rem;
            height: .4rem;
            fill: #f94242;
            position: absolute;
            top: -.23rem;
            right: -.23rem;
            z-index: 200;
          }
          img{
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 3px;
          }
        }
      }
    }
    .addGroupCard-tip{
      text-align: center;
      font-size: .2rem;
      color: #fa9d0a;
    }
    .addGroupCard-btn{
      width: 4.2rem;
      height: .68rem;
      margin: .76rem auto;
      background: url('../../../assets/images/operate/assistant-btn.png');
      background-size: 100% 100%;
      font-size: .24rem;
      color: #fff;
      text-align: center;
      line-height: .6rem;
    }
  }
</style>
