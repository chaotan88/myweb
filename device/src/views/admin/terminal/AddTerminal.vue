<template>
  <!-- 终端-终端管理-添加终端 -->
  <div class="addTerminal-wrap">
    <el-form :model="formData" label-width="110px" label-position="left">
      <div class="formTop-wrap">
        <!-- 添加终端模块 第一行 -->
        <el-row class="first-row">
          <el-col :span="8" class="asterisk-wrap">
            <div class="asterisk">*</div>
            <el-form-item label="终端名：" class="asterisk-padding">
              <el-input v-model="formData.terminalName" placeholder="限20个字符，不含特殊字符" clearable @blur="checkTerminalName(formData.terminalName)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="asterisk-wrap">
            <div class="asterisk">*</div>
            <el-form-item label="应用场景：" class="asterisk-padding">
              <el-select v-model="formData.appScenario" placeholder="请选择" clearable @change="checkAppScenario(formData.appScenario)">
                <el-option
                  v-for="item in appScenarioOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 添加终端模块 第二行 -->
        <el-row class="second-row">
          <el-col :span="8" class="asterisk-wrap">
            <div class="asterisk">*</div>
            <el-form-item label="场景实拍：" class="asterisk-padding upload-content">
              <el-upload
                class="avatar-uploader"
                list-type="picture-card"
                :action="uploadUrl"
                :on-preview="handlePictureCardPreview"
                :before-upload="beforeAvatarUpload"
                :on-success="handleSuccess">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <div class="desc">说明：至少添加4张照片，图片大小不超过2M</div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 添加终端模块 第三行 -->
        <el-row class="third-row">
          <el-form-item label="位置：" class='region-select-item'>
            <region-select :assignData="regionData" @change="regionChange"></region-select>
            <!-- <el-select v-model="formData.provinceCode" placeholder="请选省份" @change="provinceChange">
              <el-option
                v-for="item in provinceData"
                :key="item.name"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
            <el-select v-model="formData.cityCode" placeholder="请选城市" @change="cityChange">
              <el-option
                v-for="item in cityData"
                :key="item.name"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
            <el-select v-model="formData.zoneCode" placeholder="请选择区" @change="zoneChange">
              <el-option
                v-for="item in zoneData"
                :key="item.name"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select> -->
            <div>
              <el-input v-model="formData.address" placeholder="请填写详细地址" class="detailedAddress" clearable></el-input>
            </div>
            <!-- 百度地图 -->
            <div class="baidu-map">
              <baidu-map
                class="map"
                :center="center"
                :scroll-wheel-zoom="true"
                :zoom="12">
              </baidu-map>
            </div>
          </el-form-item>
        </el-row>
        <!-- 添加终端模块 经纬度 -->
        <el-row class="forth-row">
          <el-form-item label="经纬度：" class="latitude-longitude-wrap">
            <el-input v-model="formData.longitude" placeholder="请填写经度"  clearable class="detailedAddress"></el-input>
            <el-input v-model="formData.latitude" placeholder="请填写纬度"  clearable class="detailedAddress"></el-input>
          </el-form-item>
        </el-row>
      </div>
      <div class="formBottom-wrap">
        <el-row class="formBottom-row-group">
          <div class="row-content">
            <el-col :span="8" class="asterisk-wrap">
              <div class="asterisk">*</div>
              <el-form-item label="注册码：" class="asterisk-padding">
                <el-input v-model="formData.terminalCoding" placeholder="限100个字，不含特殊字符" clearable @blur="checkTerminalCoding(formData.terminalCoding)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="asterisk-wrap">
              <div class="asterisk">*</div>
              <el-form-item label="应用系统：" class="asterisk-padding">
                <el-select v-model="formData.appOs" placeholder="选择操作系统" clearable @change="checkAppOs(formData.appOs)">
                  <el-option
                    v-for="item in appOsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="asterisk-wrap">
              <div class="asterisk">*</div>
              <el-form-item label="终端类型：" class="asterisk-padding">
                <el-select v-model="formData.terminalType" placeholder="选择终端类型" clearable @change="checkTerminalType(formData.terminalType)">
                  <el-option
                    v-for="item in terminalTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </div>
        </el-row>
        <el-row class="formBottom-row-group">
          <div class="row-content">
            <el-col :span="8">
              <el-form-item label="屏幕类型：">
                <el-select v-model="formData.screenSplit" placeholder="选择屏幕类型" clearable>
                  <el-option
                    v-for="item in screenSplitOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="屏幕款式：">
                <el-select v-model="formData.screenStyle" placeholder="选择屏幕款式" clearable>
                  <el-option
                    v-for="item in screenStyleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <div class="screen-select">
                  <el-radio v-model="formData.screenColumn" :label="1">一栏</el-radio>
                  <el-radio v-model="formData.screenColumn" :label="2">二栏</el-radio>
                  <el-radio v-model="formData.screenColumn" :label="3">三栏</el-radio>
                  <el-radio v-model="formData.screenColumn" :label="4">四栏</el-radio>
                  <el-radio v-model="formData.screenColumn" :label="5">五栏</el-radio>
                </div>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
        <el-row class="formBottom-row-group">
          <div class="row-content">
            <el-col :span="8">
              <el-form-item label="配对终端：">
                <el-input v-model="formData.terminalPair" placeholder="限50个字，不含特殊字符" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="负责人：">
                <el-input v-model="formData.contact" placeholder="限20个字，不含特殊字符" clearable @blur="checkContact(formData.contact)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话：">
                <el-input v-model="formData.phone" placeholder="请按手机格式填写（11位数字）" clearable @blur="checkPhone(formData.phone)"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
      </div>
    </el-form>
    <el-button class="confirm-button" @click="submitForm()">确认</el-button>
  </div>
</template>

<script>
  import RegionSelect from './../../../components/utils/RegionSelect'
  import ChinaRegion from '../../../../assets/js/ChinaRegionData.js'
  export default {
    components: { RegionSelect },
    data () {
      return {
        token: '',
        labelPosition: 'right',
        formData: {
          terminalName: null,
          appScenario: null,
          province: '',
          provinceCode: null,
          city: '',
          cityCode: null,
          zone: '',
          zoneCode: null,
          address: '',
          terminalCoding: null,
          appOs: null,
          terminalType: null,
          screenSplit: null,
          screenStyle: null,
          screenColumn: null,
          terminalPair: null,
          contact: null,
          phone: null,
          adPositionAttachmentList: [],
          latitude: '', // 纬度
          longitude: '' // 经度
        },
        regionData: {
          province: {
            code: '',
            name: ''
          },
          city: {
            code: '',
            name: ''
          },
          area: {
            code: '',
            name: ''
          }
        },
        appScenarioOptions: [{
          value: 1,
          label: '机场'
        }, {
          value: 2,
          label: '高铁'
        }, {
          value: 3,
          label: '商场'
        }, {
          value: 4,
          label: '客运站'
        }],
        appOsOptions: [{
          value: 1,
          label: 'windows'
        }, {
          value: 2,
          label: 'android'
        }],
        terminalTypeOptions: [{
          value: 1,
          label: '普通终端'
        }],
        screenSplitOptions: [{
          value: 1,
          label: '横屏'
        }, {
          value: 2,
          label: '竖屏'
        }],
        screenStyleOptions: [{
          value: 1,
          label: '落地式'
        }, {
          value: 2,
          label: '橱窗式'
        }, {
          value: 3,
          label: '镜面式'
        }, {
          value: 4,
          label: '悬挂式'
        }],
        provinceData: [],
        cityData: [],
        zoneData: [],
        currentProvince: {},
        currentCityArray: [],
        currentCity: {},
        currentZoneArray: [],
        fileArray: [],
        dialogImageUrl: '',
        dialogVisible: false,
        validateGuardOfTerminalName: false,
        validateGuardOfAppScenario: false,
        validateGuardOfTerminalCoding: false,
        validateGuardOfAppOs: false,
        validateGuardOfTerminalType: false,
        validateGuardOfContact: false,
        validateGuardOfPhone: false
      }
    },
    computed: {
      center: function () {
        return (this.formData.province +
          this.formData.city +
          this.formData.zone)
//        return {
//          lng: parseFloat(this.formData.longitude),
//          lat: parseFloat(this.formData.latitude)
//        }
      },
      uploadUrl: function () {
        return `${this.$dm.ROOT_API}upload/uploadimg/admin/terminal?token=${this.token}&clientType=2`
      }
    },
    mounted () {
      let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
      this.token = adminInfo.token
      this.getAllProvince()
    },
    methods: {
      /**
       * 过滤省、市、县
       */
      getAllProvince () {
        ChinaRegion.forEach(item => {
          let o = {}
          o.name = item.name
          o.code = item.code
          this.provinceData.push(o)
        })
      },
      provinceChange (val) {
        this.cityData = []
        this.currentProvince = ChinaRegion.filter(item => val === item.code)[0]
        this.currentCityArray = this.currentProvince.children
        this.currentCityArray.forEach(item => {
          let o = {}
          o.name = item.name
          o.code = item.code
          this.cityData.push(o)
        })

        /**
         * 获取选中省的名字
         */
        let obj = {}
        obj = this.provinceData.find((item) => {
          return item.code === val
        })
        this.formData.province = obj.name
      },
      cityChange (val) {
        this.zoneData = []
        this.currentCity = this.currentCityArray.filter(item => val === item.code)[0]
        this.currentZoneArray = this.currentCity.children
        this.currentZoneArray.forEach(item => {
          let o = {}
          o.name = item.name
          o.code = item.code
          this.zoneData.push(o)
        })

        /**
         * 获取选中市的名字
         */
        let obj = {}
        obj = this.cityData.find((item) => {
          return item.code === val
        })
        this.formData.city = obj.name
      },
      zoneChange (val) {
        /**
         * 获取选中区/县的名字
         */
        let obj = {}
        obj = this.zoneData.find(item => {
          return item.code === val
        })
        this.formData.zone = obj.name
      },

      /**
       * 校验表单
       */
      checkTerminalName (value) {
        let pattern = /^[\u4e00-\u9fa5]{1,20}$/g
        if (!pattern.test(value)) {
          this.$message.error('终端名称填写不合法')
          this.validateGuardOfTerminalName = false
        } else {
          this.validateGuardOfTerminalName = true
        }
      },
      checkAppScenario (value) {
        if (!value) {
          this.$message.error('请选择应用场景')
          this.validateGuardOfAppScenario = false
        } else {
          this.validateGuardOfAppScenario = true
        }
      },
      checkTerminalCoding (value) {
        let pattern = /^[\u4e00-\u9fa5]{1,100}$/g
        if (!pattern.test(value)) {
          this.$message.error('注册码填写不合法')
          this.validateGuardOfTerminalCoding = false
        } else {
          this.validateGuardOfTerminalCoding = true
        }
      },
      checkAppOs (value) {
        if (!value) {
          this.$message.error('请选择应用系统')
          this.validateGuardOfAppOs = false
        } else {
          this.validateGuardOfAppOs = true
        }
      },
      checkTerminalType (value) {
        if (!value) {
          this.$message.error('请选择终端类型')
          this.validateGuardOfTerminalType = false
        } else {
          this.validateGuardOfTerminalType = true
        }
      },
      checkContact (value) {
        let pattern = /^[\u4e00-\u9fa5]{1,20}$/g
        if (!pattern.test(value)) {
          this.$message.error('负责人填写不合法')
          this.validateGuardOfContact = false
        } else {
          this.validateGuardOfContact = true
        }
      },
      checkPhone (value) {
        let pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/g
        if (!pattern.test(value)) {
          this.$message.error('电话填写不合法')
          this.validateGuardOfPhone = false
        } else {
          this.validateGuardOfPhone = true
        }
      },
      /**
       * 文件上传前的格式和大小校验
       */
      beforeAvatarUpload (file) {
        const pattern = /(gif|jpg|jpeg|png)$/ig
        const isLegalPhoto = pattern.test(file.type)
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isLegalPhoto) {
          this.$message.error('上传图片的格式不合法，请重新上传')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isLegalPhoto && isLt2M
      },
      /**
       * 文件上传成功的回调函数
       * @param response
       * @param file
       * @param fileList 文件列表
       */
      handleSuccess (response, file, fileList) {
        this.fileArray = []
        this.fileArray = fileList
      },

      /**
       * 文件预览
       */
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },

      handleFileList () {
        this.fileArray.forEach(item => {
          this.formData.adPositionAttachmentList.push({url: item.response.data})
        })
      },
      /**
       * 确认 - 提交表单
       */
      submitForm () {
        this.handleFileList()
        let terminalNameStatus = this.validateGuardOfTerminalName
        let appScenarioStatus = this.validateGuardOfAppScenario
        let terminalCodingStatus = this.validateGuardOfTerminalCoding
        let appOsStatus = this.validateGuardOfAppOs
        let terminalTypeStatus = this.validateGuardOfTerminalType
        let contactStatus = this.validateGuardOfContact
        let phoneStatus = this.validateGuardOfPhone
        if (terminalNameStatus && appScenarioStatus && terminalCodingStatus && appOsStatus && terminalTypeStatus && contactStatus && phoneStatus) {
          let data = this.formData
          this.$http.post('@ROOT_API/terminalManage/add', data)
            .then((res) => {
              if (res.data.status === '1') {
                this.$message.success(res.data.msg)
                this.$router.push('/admin/terminal/management/terminalList')
              } else {
                this.$message.error(res.data.msg)
              }
            })
        } else {
          this.$message.error('表单填写不准确，请重新填写。')
        }
      },

      /**
       * 选择省市区
       */
      regionChange (res) {
        this.formData.province = res.province.name
        this.formData.provinceCode = res.province.code
        this.formData.city = res.city.name
        this.formData.cityCode = res.city.code
        this.formData.zone = res.area.name
        this.formData.zoneCode = res.area.code
      }
    }
  }
</script>

<style scoped lang="less">
  * {
    box-sizing: border-box;
    font-size: 16px;
    color: rgb(51, 51, 51);
  }
  .addTerminal-wrap {
    width: 1558px;
    height: auto;
    border-radius: 10px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0 21.6px 2.4px rgb(226, 226, 226);
    padding: 48px 268px 44px 0;
    /* 星号的布局样式 */
    .asterisk-wrap {
      position: relative;
      .asterisk {
        position: absolute;
        height: 36px;
        line-height: 36px;
        color: rgb(245, 167, 57);
      }
      .asterisk-padding {
        padding-left: 10px;
      }
    }
    /* 表单上半部分的样式 */
    .formTop-wrap {
      padding-left: 57px;
      /* 添加终端模块 第一行样式 */
      .first-row {
        height: 36px;
        margin-bottom: 59px;
        > div {
          height: 100%;
        }
        .el-input {
          width: 250px;
        }

      }
      /* 添加终端模块 第二行样式 */
      .second-row {
        .desc {
          margin: 19px 0 39px 0;
          color: rgb(114, 114, 114);
        }
      }
      /* 添加终端模块 第三行样式 */
      .third-row {
        .detailedAddress {
          width: 430px;
          height: 36px;
          margin: 19px 0 40px 0;
        }
        .baidu-map {
          width: 720px;
          height: 420px;
          border: 1px solid #ddd;
          .map {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    /* 表单下半部分的样式 */
    .formBottom-wrap {
      margin: 28px 0 0 30px;
      border: 1px solid rgb(238, 238, 238);
      .formBottom-row-group {
        width: 1260px;
        height: 100px;
        position: relative;
        .row-content {
          height: 36px;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          padding-left: 42px;
          .el-col:nth-of-type(1) {
            .el-input {
              width: 250px;
              height: 36px;
            }
          }
        }
      }
      .formBottom-row-group:nth-of-type(2) {
        .screen-select {
          float: right;
        }
      }
    }
    .confirm-button {
      display: block;
      /*width: 151px;
      height: 54px;*/
      width: 70px;
      height: 36px;
      border-radius: 4px;
      padding: 0;
      /*border: 1px solid rgb(51, 113, 155);*/
      border: 0;
      background-color: rgb(51, 113, 155);
      font-size: 16px;
      color: rgb(255, 255, 255);
      margin: 37px 0 0 144px;
    }
  }
</style>

<style lang="less">
  .addTerminal-wrap {
    .region-select-item{
      .el-form-item__content{
        width: 370px !important;
      }
    }
    /* 表单上半部分样式 */
    .formTop-wrap {
      .second-row {
        .upload-content .el-form-item__content {
          width: 1000px;
        }
      }
      .third-row {
        .el-select {
          margin-right: 16px;
        }
      }
      .forth-row {
        .el-form-item__content {
          width: 430px;
          .el-input:nth-of-type(1) {
            margin: 10px 0;
          }
        }
      }
    }
    /* 表单下半部分样式 */
    .formBottom-wrap {
      .formBottom-row-group:nth-of-type(1) {
        .el-select .el-input, .el-input {
          margin-left: -9px;
        }
      }
      .formBottom-row-group:nth-of-type(1), .formBottom-row-group:nth-of-type(2) {
        border-bottom: 1px solid rgb(238, 238, 238);
        .el-select {
          .el-input {
            width: 150px;
            height: 36px;
          }
        }
      }
      .formBottom-row-group:nth-of-type(3) {
        .el-input {
          width: 250px;
          height: 36px;
        }
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .avatar-uploader {
      height: 130px;
    }
    .avatar-uploader .el-upload {
      /*width: 130px;
      height: 130px;*/
      border-radius: 6px;
      background-color: rgb(248, 248, 248);
      border: 1px solid rgb(200, 208, 218);
      box-shadow: 0 0 5px 0 rgba(51, 113, 155, 0.32);
      position: relative;
      cursor: pointer;
      overflow: hidden;
    }
    .avatar-uploader-icon {
      width: 70px;
      height: 70px;
      line-height: 70px;
      text-align: center;
      font-size: 70px;
      color: rgb(200, 208, 218);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
    .el-form-item__label {
      font-size: 16px;
      color: rgb(51, 51, 51)
    }
    .el-select > .el-input {
      width: 130px;
      font-size: 16px;
    }
    .el-button:hover, .el-button:active {
      border-color: rgb(51, 113, 155);
    }
  }
</style>

