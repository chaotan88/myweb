<template>
  <common-tpl class="operation-ticket-public-wrap" footer back>
    <template slot="main">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="150px">
        <gray-title title="基本信息设置"></gray-title>
        <!-- 添加栏目 -->
        <div class="commodity-details pos-r">
          <el-form-item label="会议名称: " prop="meetingName">
            <el-input v-model="formData.meetingName" placeholder="限50个字符以内" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="主图: " prop="meetingImgList" class="picture">
            <div class="pos-r upload-wrap" :class="{max: formData.meetingImgList.length === 1}">
              <el-upload
                list-type="picture-card"
                :action="uploadUrl"
                :limit="1"
                :file-list="formData.meetingImgList"
                :on-exceed="exceedHandle"
                :before-upload="beforeAvatarUpload"
                :on-preview="pictureCardPreviewHandle"
                :on-success="uploadSuccessHandle"
                :on-remove="removeHandle">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="pos-a" style="margin-left: 160px; margin-top: -10px; top: 50%;"><span class="el-icon-warning"></span> 建议尺寸：500 * 500px</span>
            </div>
          </el-form-item>
          <el-form-item label="会议时间：" required prop="meetingDate">
            <el-col :span="7">
              <el-date-picker type="datetimerange" start-placeholder="年 / 月 / 日" end-placeholder="年 / 月 / 日" class="full-w" clearable v-model="formData.meetingDate"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="会议说明：" prop="editorText">
            <editor v-model="formData.editorText" @change="ueditorChange"></editor>
            <!-- <vue-ueditor-wrap ref="ueditor" v-model="formData.editorText" :config="editorConfig" @ready="editorReady" :init="editorInit"></vue-ueditor-wrap> -->
          </el-form-item>
          <el-form-item label="所在地：" required prop="address">
            <region-select :initData="formData.region" @change="regionChange"></region-select>
          </el-form-item>
          <el-form-item label="详细地址：" prop="contactsAddress">
            <el-input placeholder="限50个字符" maxlength="50" v-model="formData.contactsAddress"></el-input>
            <!-- :center="formData.mapAddress" -->
            <!-- <bm-local-search :keyword="formData.contactsAddress" :auto-viewport="true" location="深圳市"></bm-local-search> -->
            <!-- <bm-view class="map"></bm-view> -->
          </el-form-item>
          <el-form-item label="获取经纬度：">
            <baidu-map
              class="baidu-map"
              ak="xOEq2wUHZjsgNQzZIw4FxDRBmMr88Luu"
              :center="center"
              :scroll-wheel-zoom="true"
              :zoom="15"
              @click="getMapInfo"
              @ready="handleMapReady">
              <bm-marker :position="center"></bm-marker>
              <bm-control>
                <!-- 地图搜索 -->
                <bm-auto-complete v-model="formData.lngLatValue">
                  <el-input placeholder="输入地区名称查找" maxlength="50" v-model.sync="formData.lngLatValue" clearable style="width: 390px; margin: 10px;"></el-input>
                </bm-auto-complete>
                <bm-local-search :keyword="formData.lngLatValue" :auto-viewport="true" class="d-n"></bm-local-search>
              </bm-control>
            </baidu-map>
            <!-- <el-input v-model="formData.lngLatValue" :disabled="true" readonly class="d-n"></el-input> -->
          </el-form-item>
          <el-form-item label="经纬度：">
            <div class="lng-lat-bg">
              经度：{{center.lng | filterEmpty}}
              &nbsp;&nbsp;
              纬度：{{center.lat | filterEmpty}}
            </div>
          </el-form-item>
        </div>

        <gray-title title="规则设置"></gray-title>
        <div class="commodity-details pos-r">
          <el-form-item label="门票售价：" prop="ticketPrice">
            <el-input @blur="inpBlur('ticketPrice')" placeholder="输入正数，可精确到百分位" maxlength="15" v-model="formData.ticketPrice"></el-input>
            <span>&nbsp;元</span>
          </el-form-item>
          <el-form-item label="售票时间：" required prop="sellDate">
            <el-col :span="7">
              <el-date-picker type="datetimerange" start-placeholder="年 / 月 / 日" end-placeholder="年 / 月 / 日" class="full-w" clearable v-model="formData.sellDate"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="门票数量：" prop="totalTicketNum">
            <el-input placeholder="正整数，限6个字符以内" maxlength="6" v-model="formData.totalTicketNum"></el-input>
          </el-form-item>
          <el-form-item label="客服电话：">
            <el-input placeholder="限20个字符以内" maxlength="20" v-model="formData.followupPhone"></el-input>
          </el-form-item>
          <el-form-item label="获得积分类型：" prop="integral" class="integral-wrap">
            <el-select v-model="formData.integralType" placeholder="请选择是否获得积分" class="integral-select">
              <el-option label="服务积分" :value="4"></el-option>
              <el-option label="消费积分" :value="1"></el-option>
            </el-select>
            <el-input class="integral" placeholder="请输入积分值，限10个字符以内" maxlength="10" v-model="formData.integral"></el-input>
          </el-form-item>
          <!-- <el-form-item label="是否分佣：">
            <el-radio-group v-model="formData.maid">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="状态：">
            <el-radio-group v-model="formData.state">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="入场券主图：" prop="ticketImgList" class="picture" style="margin-bottom: 0;">
            <div class="pos-r upload-wrap" :class="{max: formData.ticketImgList.length === 1}">
              <el-upload
                list-type="picture-card"
                :action="uploadUrl"
                :limit="1"
                :file-list="formData.ticketImgList"
                :on-exceed="exceedHandle"
                :before-upload="beforeAvatarUpload"
                :on-preview="handleTicketPreview"
                :on-success="handleTicketUploadSuccess"
                :on-remove="handleTicketRemove">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span><span class="el-icon-warning"></span> 建议尺寸：1104 * 436</span>
            </div>
          </el-form-item>
          <el-form-item label="排序：" prop="sort">
            <el-input placeholder="输入0~255数字" maxlength="3" v-model="formData.sort"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </template>

    <template slot="other">
      <el-dialog title="图标预览" :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl">
      </el-dialog>

      <!-- 编辑器上传图片 -->
      <el-dialog
        title="图片上传"
        :visible.sync="editorUploadVisible"
        width="30%">
        <el-upload
          :action="uploadUrl"
          :multiple="true"
          :file-list="editorUploadList"
          :on-remove="handleRemoveImg"
          :on-success="handleUploadSuccess"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editorUploadVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePushImg">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">保存</el-button>
    </template>

  </common-tpl>
</template>

<script>
import Editor from '@/components/public/Editor'
// import VueUeditorWrap from 'vue-ueditor-wrap'
import RegionSelect from '@/components/utils/RegionSelect'
import {BaiduMap, BmMarker, BmControl, BmAutoComplete, BmLocalSearch, BmInfoWindow} from 'vue-baidu-map'
export default {
  components: {Editor, RegionSelect, BaiduMap, BmMarker, BmControl, BmAutoComplete, BmLocalSearch, BmInfoWindow},
  data () {
    // 校验正整数
    let validateInt = (rule, value, callback) => {
      if (!value && parseInt(value) !== 0) return callback(new Error('请输入门票数量'))
      if (value && !value.toString().match(/^\d*$/gi)) return callback(new Error('请输入正整数'))
      callback()
    }

    // 校验积分
    let validateIntegral = (rule, value, callback) => {
      if (value && !value.toString().match(/^\d*$/gi)) return callback(new Error('请输入正整数'))
      callback()
    }

    // 校验金额
    let validateMoney = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入门票售价'))
      let reg = /^\d+\.\d{2}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('请输入正数,精确到百分位'))
      callback()
    }

    // 校验0~255正整数
    // let validateSort = (rule, value, callback) => {
    //   if (!value) return callback(new Error('请输入排序值'))
    //   if (value < 0 || value > 255 || !value.toString().match(/^\d{0,3}$/gi)) return callback(new Error('输入0~255数字'))
    //   callback()
    // }

    let validateSort = (rule, value, callback) => {
      // if (!value) return callback(new Error('请输入排序值'))
      if (value && (value < 0 || value > 255 || !value.toString().match(/^\d{0,3}$/gi))) return callback(new Error('输入0~255数字'))
      callback()
    }

    // 校验手机号
    // let validatePhone = (rule, value, callback) => {
    //   if (value && !value.toString().match(/^1\d{10}$/gi)) return callback(new Error('手机格式错误'))
    //   callback()
    // }
    return {
      confirmLoading: false,        // 确定loading
      pageType: 1,                  // 页面类型 [1、新增 2、编辑]
      formData: {
        id: '',                     // 会议id
        brandId: '',                // 品牌id
        meetingName: '',            // 品牌名称
        meetingImgList: [],         // 上传logo列表
        meetingImg: '',             // 上传logo地址
        editorText: '',             // 会议说明
        columnMainImgFileList: [],  // 栏目主图地址
        columnMainImg: '',
        meetingDate: [],            // 会议时间
        resource: '',
        region: {
          province: {          // 省
            code: '',
            name: ''
          },
          city: {              // 市
            code: '',
            name: ''
          },
          area: {              // 区
            code: '',
            name: ''
          }
        },
        address: [],
        lngLatValue: '',       // 经纬度
        contactsAddress: '',   // 详细地址
        mapAddress: '',        // 地图显示地址
        ticketPrice: '',       // 门票售价
        sellDate: [],          // 售票时间
        totalTicketNum: '',    // 门票数量
        integralType: 1,       // 积分类型
        integral: '',          // 积分值
        maid: 1,               // 是否分佣
        state: 1,              // 是否状态
        ticketImgList: [],     // 入场券主图列表
        ticketImg: ''          // 入场券主图
      },
      editorConfig: {
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: './static/UEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 500,
        // 初始容器宽度
        initialFrameWidth: '100%'
      },
      editorUploadVisible: false,         // 编辑器上传图片弹窗
      editorObj: null,                    // 编辑器对象
      editorUploadList: [],               // 编辑器上传图片列表
      dialogImageUrl: '',                 // 上传图片路径
      dialogVisible: false,               // 上传
      pageData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        // 栏目名称
        meetingName: [{ required: true, message: '请输入会议名称', trigger: 'blur' }],
        // 图片
        meetingImgList: [{ required: true, type: 'array', message: '请上传主图', trigger: 'change' }],
        // 会议时间
        meetingDate: [{ type: 'array', required: true, message: '请选择会议时间', trigger: 'change' }],
        // 会议说明
        editorText: [{required: true, message: '请填写会议说明', trigger: 'change'}],
        // 经纬度
        // lngLatValue: [{required: true, message: '请点击地图获取经纬度', trigger: 'change'}],
        address: [{required: true, message: '请选择所在地', trigger: 'change'}],
        // 详细地址
        contactsAddress: [{required: true, message: '请输入详细地址', trigger: 'blur'}],
        // 售票时间
        sellDate: [{ type: 'array', required: true, message: '请选择售票时间', trigger: 'change' }],
        // 门票售价
        ticketPrice: [{required: true, validator: validateMoney, trigger: 'blur'}],
        // 门票数量
        totalTicketNum: [{required: true, validator: validateInt, trigger: 'blur'}],
        // 客服电话
        // followupPhone: [{ required: true, message: '请输入客服电话', trigger: 'blur' }],
        // 校验积分规则
        integral: [{validator: validateIntegral, trigger: 'blur'}],
        // 排序
        sort: [{validator: validateSort, trigger: 'blur'}]
      },

      center: {
        lng: 114.059809,
        lat: 22.545426
      },
      zoom: 19,
      show: true,

      userInfo: {}             // 用户信息
    }
  },
  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.formData.id = parseInt(this.$route.query.id) || ''
    this.pageType = this.$route.path.match(/add/gi) ? 1 : 2
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.pageType === 2) this.getDetailsData()
      }, 200)
    })
  },
  methods: {
    // 5、 你可以在ready方法中拿到editorInstance实例,之后的所有API就和官方的实例一样了,Just Do What You Want! http://fex.baidu.com/ueditor/#api-common
    editorReady (editorInstance) {
      this.editorObj = editorInstance
    },

    // 7. 结合init方法,自定义按钮
    editorInit () {
      this.$nextTick(() => {
        this.$refs['ueditor'].registerButton({
          name: 'upload',
          icon: require('@/../static/UEditor/img/upload.png'),
          tip: '上传图片',
          handler: (editor, name) => {
            this.editorUploadVisible = true
          }
        })
      })
    },

    /**
     * 移除图片
     */
    handleRemoveImg (file, fileList) {
      this.uploadList = []
      fileList.forEach((row) => {
        this.uploadList.push({
          url: row.url
        })
      })
    },

    /**
     * 上传成功操作
     */
    handleUploadSuccess (res, file, fileList) {
      setTimeout(() => {
        if (parseInt(res.status) !== 1) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1000
          })
          return false
        }
        this.uploadList.push({
          url: this.$Utils.filterImgUrl(res.data)
        })
      }, 30)
    },

    /**
     * 将图片插入编辑器
     */
    handlePushImg () {
      let res = ''
      this.editorUploadList.forEach((row) => {
        res += ('<img src="' + row.url + '"/>')
      })
      this.editorObj.execCommand('inserthtml', res)
      this.editorUploadVisible = false
      this.editorUploadList = []
    },

    /**
     * 获取详情
     */
    getDetailsData () {
      this.$http.get('@ROOT_API/meeting/getMeetingDetail', {
        params: {
          meetingId: this.formData.id
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        let results = resData.data
        this.formData.id = results.id
        this.formData.meetingName = results.meetingName
        if (results.mainImage) {
          this.formData.meetingImgList.push({url: this.$Utils.filterImgUrl(results.mainImage)})
          this.formData.meetingImg = results.mainImage
        }
        this.formData.meetingDate.push(results.beginTime, results.endTime)
        this.formData.editorText = results.description
        this.formData.region.province.code = results.provinceCode
        this.formData.region.province.name = results.province
        this.formData.region.city.code = results.cityCode
        this.formData.region.city.name = results.city
        this.formData.region.area.code = results.zoneCode
        this.formData.region.area.name = results.zone

        this.formData.address = []
        if (results.province) this.formData.address.push(results.province.name)
        if (results.city) this.formData.address.push(results.city.name)
        if (results.area) this.formData.address.push(results.area.name)

        this.formData.contactsAddress = results.address
        this.center.lng = results.longitude
        this.center.lat = results.latitude
        this.formData.lngLatValue = results.anchorPoint

        this.formData.ticketPrice = results.ticketPrice
        this.inpBlur('ticketPrice')
        this.formData.sellDate.push(results.saleTicketBeginTime, results.saleTicketEndTime)
        this.formData.totalTicketNum = results.totalTicketNum
        this.formData.followupPhone = results.servicePhone
        this.formData.integral = results.getPointNum
        this.formData.integralType = results.getPointType
        this.formData.state = results.ticketStatus
        if (results.ticketMainImage) {
          this.formData.ticketImgList.push({url: this.$Utils.filterImgUrl(results.ticketMainImage)})
          this.formData.ticketImg = results.ticketMainImage
        }
        this.formData.sort = results.sort
      })
    },

    /**
     * 编辑器内容改变
     */
    ueditorChange (value) {
      this.formData.editorText = value
    },

    /**
    * 文件上传前的格式和大小校验
    */
    beforeAvatarUpload (file) {
      const pattern = /(jpg|jpeg|png)$/ig
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
     * 上传数量超过最大限制数量
     */
    exceedHandle (files, fileList) {
      this.$message({
        message: '最多只能上传1个图标',
        type: 'error'
      })
    },

    /*
     * 图片上传成功
     */
    uploadSuccessHandle (res) {
      if (parseInt(res.status) !== 1) {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.meetingImgList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.formData.meetingImg = res.data
    },

    /**
     * 图片预览
     */
    pictureCardPreviewHandle (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    /**
     * 图片被移除
     */
    removeHandle (file, fileList) {
      this.formData.meetingImg = ''
      this.formData.meetingImgList = []
    },

    /**
     * 栏目主图预览
     */
    handleMainImgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    /*
     * 栏目主图上传成功
     */
    handleUploadImgSuccess (res) {
      if (parseInt(res.status) !== 1) {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.columnMainImgFileList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.formData.columnMainImg = res.data
    },

    /**
     * 移除栏目主图
     */
    handleRemoveColumnImg (file, fileList) {
      this.formData.columnMainImgFileList = []
      this.formData.columnMainImg = ''
    },

    /**
     * 入场券主图预览
     */
    handleTicketPreview (file) {
      window.open(file.url, '_blank')
    },

    /**
     * 入场券主图上传成功
     */
    handleTicketUploadSuccess (res) {
      if (parseInt(res.status) !== 1) {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.ticketImgList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.formData.ticketImg = res.data
    },

    /**
     * 入场券主图移除
     */
    handleTicketRemove () {
      this.formData.ticketImgList = []
      this.formData.ticketImg = ''
    },

    /**
     * 省市区数据更新
     */
    regionChange (results) {
      this.formData.region = results
      // this.formData.mapAddress = [results.province.name, results.city.name, results.area.name, this.formData.contactsAddress].join(',')
      this.formData.address = []
      if (results.province.name) this.formData.address.push(results.province.name)
      if (results.city.name) this.formData.address.push(results.city.name)
      if (results.area.name) this.formData.address.push(results.area.name)
    },

    /**
     * 详细地址改变
     */
    // contactsAddressChange (value) {
    //   this.formData.mapAddress = []
    //   let arr = []
    //   if (this.formData.region.province.name) arr.push(this.formData.region.province.name)
    //   if (this.formData.region.city.name) arr.push(this.formData.region.city.name)
    //   if (this.formData.region.area.name) arr.push(this.formData.region.area.name)
    //   arr.push(value)
    //   this.formData.mapAddress = arr.join(',')
    // },

    /**
     * 自动补全两位小数
     */
    inpBlur (key) {
      this.$Utils.blurAutoCompletion(this.formData, key)
    },

    /**
     * 地图初始化
     */
    handleMapReady ({BMap, map}) {
      // this.center.lng = 114.059809
      // this.center.lat = 22.545426
      // this.zoom = 19
    },

    /**
     * 点击经纬度
     */
    getMapInfo (e) {
      if (e.bb && e.bb.z && e.bb.z.title) {
        this.formData.contactsAddress = e.bb.z.title
      }
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
      // this.formData.lngLatValue = e.point.lat + ', ' + e.point.lng
    },

    /**
     * 提交表单验证
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.confirmLoading = true
        let url = this.pageType === 1 ? '@ROOT_API/meeting/addMeeting' : '@ROOT_API/meeting/editMeeting'
        this.$http.post(url, {
          id: this.formData.id,                           // 是 int 票务主键
          meetingName: this.formData.meetingName,         // 否 string  会议名称
          mainImage: this.formData.meetingImg,             // 否 string  会议主图
          beginTime: this.formData.meetingDate[0],        // 否 date  会议开始时间
          endTime: this.formData.meetingDate[1],          // 否 date  会议结束时间
          description: this.formData.editorText,          // 否 string  会议说明
          province: this.formData.region.province.name,   // 否 string  省
          provinceCode: this.formData.region.province.code, // 否 string  -
          city: this.formData.region.city.name,           // 否 string  市
          cityCode: this.formData.region.city.code,       // 否 string  -
          zone: this.formData.region.area.name,           // 否 string  区
          zoneCode: this.formData.region.area.code,       // 否 string  -
          address: this.formData.contactsAddress,         // 否 string  位置
          longitude: this.center.lng,                     // 否 string  经度
          latitude: this.center.lat,                      // 否 string  纬度
          ticketPrice: this.formData.ticketPrice,         // 否 double  门票售价
          saleTicketBeginTime: this.formData.sellDate[0], // 否 date  售票开始时间
          saleTicketEndTime: this.formData.sellDate[1],   // 否 date  售票结束时间
          totalTicketNum: this.formData.totalTicketNum,   // 否 int 门票数量
          servicePhone: this.formData.followupPhone,      // 否 string  客服电话
          getPointType: this.formData.integralType,       // 否 int 4：服务积分 1：消费积分
          getPointNum: this.formData.integral,            // 否 int 能获得的积分数
          ticketStatus: this.formData.state,              // 否 int 门票状态（0：关闭，1：开启）
          ticketMainImage: this.formData.ticketImg,       // 否 string 入场券主图
          sort: this.formData.sort || 0,                  // 否 int 排序
          anchorPoint: this.formData.lngLatValue          // 经纬度值
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          this.$router.back()
        }).finally(() => {
          setTimeout(() => {
            this.confirmLoading = false
          }, 1000)
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.operation-ticket-public-wrap{

  .button-wrap{
    margin-left: 0;
    height: 40px;
  }

  .baidu-map{
    width: 600px;
    height: 500px;
  }

  .lng-lat-bg{
    color: #888;
    width: 400px;
    padding-left: 20px;
    background: #f5f5f5;
    box-sizing: border-box;
  }

  .commodity-details, .relation-public-wrap{
    border-top: 0;
    margin-bottom: 20px;
    padding-top: 20px;
  }

  .el-form{
    padding-top: 30px;
  }

  .commodity-details{
    overflow: hidden;

    .el-form-item{

      .el-col-7{
        width: 400px;
      }

      .el-select{
        width: 240px !important;
      }

      .integral-select{
        width: 130px !important;
      }

      .el-input{
        width: 400px;
      }

      .integral{
        width: 250px !important;
        margin-left: 15px;

        .el-form-item__error{
          left: 150px !important;
        }
      }
    }

    .el-form-item{
      .el-select, .el-input, .region-select-wrap{
        width: 400px;
      }
    }
    .data{
      overflow: hidden;
    }

    /*----------itme图片---------*/
    .picture{
      .el-form-item__content{
        height: 150px;
        border: 1px solid #c8d0da;
      }

      span{
        color: #f5a74a;
      }
    }
  }
}
</style>

<style lang="less">
.operation-ticket-public-wrap{

  .upload-wrap.max{
    .el-upload{
      display: none;
    }
  }

  .upload-wrap{
    .el-upload-list{
      display: inline-block;
      height: 150px;
    }
  }

  .edui-default.edui-editor{
    z-index: 99 !important;

    .edui-toolbar.edui-default{
      line-height: 20px;
    }
  }

  .column-item{
    .el-radio{
      margin-right: 10px;
      .el-radio__input{
        display: none;
      }
    }

    .el-radio.is-checked{
      background: #2eaaf7;

      .el-radio__label{
        color: #fff !important;
      }
    }
  }

  .el-radio__input.is-checked .el-radio__inner{
    border-color: #409EFF;
    background: #409EFF;
  }

  .el-input-group__append{
    font-size: 14px;
    cursor: pointer;

    span:hover{
      color: #409EFF;
    }
  }

  .integral-wrap{
    
    .el-form-item__error{
      left: 150px !important;
    }
  }

  .data-error{
    .el-form-item__error{
      left: 0 !important;
    }
  }
}
</style>
