<!-- 套餐新增 & 编辑 -->
<template>
  <common-tpl class="package-public-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

          <!-- 基本信息 -->
          <div class="box">
            <gray-title title="基本信息"></gray-title>
            <el-form-item label="套餐名称：" prop="setMealName">
              <el-input v-model="ruleForm.setMealName" placeholder="限50个字符,不含特殊字符"></el-input>
            </el-form-item>
            <el-form-item label="销售价：" prop="setMealPrice">
              <el-input v-model="ruleForm.setMealPrice" placeholder="精确到百分位,限10个字符"
                @change="mealPriceChange"></el-input>
            </el-form-item>
            <el-form-item label="成本价：" prop="setMealCostPrice">
              <el-input v-model="ruleForm.setMealCostPrice" placeholder="精确到百分位,限10个字符" @change="inpBlur('setMealCostPrice')"></el-input>
            </el-form-item>
            <el-form-item label="简要说明：" prop="simpleDescription">
              <el-input v-model="ruleForm.simpleDescription" placeholder="限50个字符,不含特殊字符"></el-input>
            </el-form-item>
            <el-form-item label="套餐主图：" prop="uploadFiles" style="padding-bottom: 50px;">
              <div style="display: flex;">
                <div class="package-cover-img">
                <el-upload class="upload-picture pos-r"
                  :class="{uploadHide: coverImgList.length === 1}"
                  list-type="picture-card"
                  :action="uploadUrl"
                  :file-list="coverImgList"
                  :limit="1"
                  :on-exceed="exceedHandle"
                  :before-upload="beforeAvatarUpload"
                  :on-remove="removeHandle"
                  :on-success="uploadSuccessHandle">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <!-- <div class="el-upload__text">列表封面图片</div> -->
                </el-upload>
                <div class="upload-tips">（图片建议尺寸：300 * 150px ；建议大小：100KB以内）</div>
              </div>
              <div class="package-main-img">
                <el-upload class="upload-picture pos-r"
                  :class="{uploadHide: mainImgList.length === 3}"
                  list-type="picture-card"
                  :action="uploadUrl"
                  :file-list="mainImgList"
                  :limit="3"
                  :on-exceed="exceedHandleMain"
                  :before-upload="beforeAvatarUpload"
                  :on-remove="removeHandleMain"
                  :on-success="uploadSuccessHandleMain">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <!-- <div class="el-upload__text">上传主图</div> -->
                </el-upload>
                <span class="upload-tips-right">（图片建议尺寸：300 * 300px ；建议大小：100KB以内）</span>
              </div>
              </div>
            </el-form-item>
            <!-- <el-form-item label="套餐主图：" prop="uploadFiles">
              <div class="package-main-img">
                <el-upload class="upload-picture fl-l pos-r"
                  :class="{uploadHide: mainImgList.length === 3}"
                  list-type="picture-card"
                  :action="uploadUrl"
                  :file-list="mainImgList"
                  :limit="3"
                  :on-exceed="exceedHandleMain"
                  :before-upload="beforeAvatarUpload"
                  :on-remove="removeHandle"
                  :on-success="uploadSuccessHandle">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="el-upload__text">上传主图</div>
                </el-upload>
                <span class="cue pos-a">（图片建议尺寸：300 * 300px ；建议大小：100KB以内）</span>
              </div>
            </el-form-item> -->
            <el-form-item label="详情描述：" prop="textDescription" class="pos-r">
              <div class="edit_container">
                <!-- <quill-editor 
                    v-model="content" 
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                </quill-editor> -->
                <vue-ueditor-wrap v-model="ruleForm.textDescription" :config="myConfig"></vue-ueditor-wrap>
              </div> 
            </el-form-item>
            <el-form-item label="套餐状态：" prop="setMealStatus">
              <el-radio-group v-model="ruleForm.setMealStatus">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="2">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="item-online">
              <el-form-item label="订购数量 ：" prop="whetherNumberLimit">
              <el-radio-group v-model="ruleForm.whetherNumberLimit">
                <el-radio :label="1">不限</el-radio>
                <el-radio :label="2">限制</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="订购数量 ：" prop="numberLimit" v-if="ruleForm.whetherNumberLimit === 2">
              <el-input v-model="ruleForm.numberLimit" placeholder="输入1-100正整数">
              </el-input>&nbsp;/ 人
            </el-form-item>
            </div>
            <el-form-item label="套餐类型 ：" prop="commissionType" @change="changeAmount">
              <el-radio-group v-model="ruleForm.commissionType">
                <el-radio :label="1">礼包分佣</el-radio>
                <el-radio :label="2">提货分佣</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="订购要求 ：" prop="whetherNeetGift" v-if="ruleForm.commissionType === 2">
              <el-checkbox v-model="ruleForm.whetherNeetGift" :true-label="1" :false-label="2"></el-checkbox>
              优先购买礼包套餐，才能购买此套餐
              <el-select v-model="ruleForm.neetGiftMealId" size="medium" class="year-box"
                placeholder="选择礼包套餐">
                <el-option :label="item.setMealName" :value="item.id" :key="index" v-for="(item, index) in packages"></el-option>
              </el-select>
            </el-form-item>
          </div>

          <!-- 分佣配置 -->
          <div class="box">
            <gray-title title="分佣配置"></gray-title>
            <el-form-item label="已配置金额：">
              <div><span class="red-cnt">{{ruleForm.configurationMoney || 0}}</span> 元,剩余 
                <span class="red-cnt">{{(ruleForm.setMealPrice - ruleForm.configurationMoney) || 0}}</span> 元</div>
            </el-form-item>
            <div v-if="ruleForm.commissionType === 1">
              <el-form-item label="推荐奖：" prop="giftRecommendReward">
                <el-input v-model="ruleForm.giftRecommendReward" placeholder="精确到百分位，限10个字符" @change="changeAmount"></el-input>
              </el-form-item>
              <el-form-item label="大使管理奖：" prop="giftRecommendRankReward">
                <el-input v-model="ruleForm.giftRecommendRankReward" placeholder="精确到百分位，限10个字符" @change="changeAmount"></el-input>
                <span class="recommendSpan">元/人</span>
              </el-form-item>
              <el-form-item label="区域级管理奖：" prop="giftManageAreaReward">
                <div style="margin-bottom: 10px;">
                  <span class="readonly-text">区县运营中心</span>
                  <el-input v-model="ruleForm.giftManageAreaReward" placeholder="精确到百分位，限10个字符" @change="changeAmount"></el-input>
                  <span class="recommendSpan">元/人</span>
                </div>
                <div>
                  <span class="readonly-text">市级运营中心</span>
                  <el-input v-model="ruleForm.giftManageCityReward" placeholder="精确到百分位，限10个字符" @change="changeAmount"></el-input>
                  <span class="recommendSpan">元/人</span>
                </div>
              </el-form-item>
              <el-form-item label="跨区管理奖：" prop="giftManageCrossReward">
                <span class="readonly-text">市级运营中心</span>
                <el-input v-model="ruleForm.giftManageCrossReward" placeholder="精确到百分位，限10个字符" @change="changeAmount"></el-input>
                <span class="recommendSpan">元/人</span>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item label="大使提货奖：" prop="pickReward">
                <el-input v-model="ruleForm.pickReward" placeholder="精确到百分位，限10个字符" @change="changeAmount"></el-input>
                <span class="recommendSpan">元/人</span>
              </el-form-item>
              <el-form-item label="运营提货奖：" prop="pickAreaReward">
                <div style="margin-bottom: 10px;">
                  <span class="readonly-text">区县运营中心</span>
                  <el-input v-model="ruleForm.pickAreaReward" placeholder="精确到百分位，限10个字符" @change="changeAmount"></el-input>
                </div>
                <div>
                  <span class="readonly-text">市级运营中心</span>
                  <el-input v-model="ruleForm.pickCityReward" placeholder="精确到百分位，限10个字符" @change="changeAmount"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="跨区提货奖：" prop="pickCrossReward">
                <span class="readonly-text">市级运营中心</span>
                <el-input v-model="ruleForm.pickCrossReward" placeholder="精确到百分位，限10个字符" @change="changeAmount"></el-input>
              </el-form-item>
            </div>
          </div>

          <!-- 代金券配置 -->
          <div class="box">
            <gray-title title="代金券配置"></gray-title>
            <el-form-item label="赠送：" prop="couponHandsel">
              <el-select v-model="ruleForm.couponHandsel" size="medium" class="year-box"
                placeholder="选择代金券">
                <el-option :label="item.description" :value="item.id" :key="index" v-for="(item, index) in vouchers"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="抵扣：" prop="couponDeduction">
              <el-select v-model="ruleForm.couponDeduction" size="medium" class="year-box"
                placeholder="选择代金券">
                <el-option :label="item.description" :value="item.id" :key="index" v-for="(item, index) in couponList"></el-option>
              </el-select>
            </el-form-item>
          </div>

        </el-form>
      </div>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('ruleForm')">提交</el-button>
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    let validateNumber = (rule, value, callback) => {
      let reg = /^\d{0,10}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('只能输入10个字符以内的正整数'))
      callback()
    }
    let validateWhetherNumberLimit = (rule, value, callback) => {
      let reg = /^\d{0,10}$/gi
      if ((value && !value.toString().match(reg)) || value > 100) return callback(new Error('只能输入0-100以内的正整数'))
      callback()
    }
    // 验证销售价格
    let validateSetMealPrice = (rule, value, callback) => {
      let reg = /^\d{0,7}\.\d{2}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('精确到百分位，限10个字符'))
      callback()
    }
    return {
      confirmLoading: false,    // 确定loading
      pageType: 1,              // 页面类型
      ruleForm: {
        setMealName: '',
        setMealPrice: '',
        setMealCostPrice: '',
        simpleDescription: '',
        uploadFiles: '',
        textDescription: '',
        setMealStatus: 1,
        whetherNumberLimit: 1,
        numberLimit: '',
        commissionType: 1,
        whetherNeetGift: 2,
        neetGiftMealId: '',
        configurationMoney: 0,
        giftRecommendReward: '',
        giftRecommendRankReward: '',
        giftManageAreaReward: '',
        giftManageCityReward: '',
        giftManageCrossReward: '',
        pickReward: '',
        pickAreaReward: '',
        pickCityReward: '',
        pickCrossReward: '',
        couponHandsel: '',
        couponDeduction: '',
        appendImageUri: '',
        mainImageUrl: ''

      },
      coverImgList: [],
      mainImgList: [],
      userInfo: {},             // 用户信息
      rules: {
        setMealName: [
          { required: true, message: '请输入套餐名称', trigger: 'blur' },
          { max: 50, message: '长度在50个字符', trigger: 'blur' }
        ],
        setMealPrice: [
          { required: true, message: '请输入销售价', trigger: 'blur' },
          { validator: validateSetMealPrice, trigger: 'blur' }
        ],
        setMealCostPrice: [
          { required: true, message: '请输入成本价', trigger: 'blur' },
          { validator: validateSetMealPrice, trigger: 'blur' }
        ],
        simpleDescription: [
          { max: 50, message: '长度在50个字符', trigger: 'blur' }
        ],
        uploadFiles: [{ required: true, message: '请上传图标', trigger: 'change' }],
        textDescription: [{ required: true, message: '请输入详细名称', trigger: 'blur' }],
        setMealStatus: [{ required: true, message: '请选择套餐开启状态', trigger: 'blur' }],
        whetherNumberLimit: [{ required: true, message: '请选择是否限制订购数量', trigger: 'blur' }],
        numberLimit: [
          { required: true, message: '请输入订购数量', trigger: 'blur' },
          { validator: validateWhetherNumberLimit, trigger: 'blur' }
        ],
        commissionType: [{ required: true, message: '请选择套餐类型', trigger: 'blur' }],
        // whetherNeetGift: [{ required: true, message: '请选择礼包套餐', trigger: 'blur' }],
        giftRecommendReward: [{ validator: validateNumber, trigger: 'blur' }],
        giftRecommendRankReward: [{ validator: validateNumber, trigger: 'blur' }],
        giftManageAreaReward: [{ validator: validateNumber, trigger: 'blur' }],
        giftManageCityReward: [{ validator: validateNumber, trigger: 'blur' }],
        giftManageCrossReward: [{ validator: validateNumber, trigger: 'blur' }],
        pickReward: [{ validator: validateNumber, trigger: 'blur' }],
        pickAreaReward: [{ validator: validateNumber, trigger: 'blur' }],
        pickCityReward: [{ validator: validateNumber, trigger: 'blur' }],
        pickCrossReward: [{ validator: validateNumber, trigger: 'blur' }]
      },
      mealId: '',
      content: `<p>hello world</p>`,
      editorOption: {},
      vouchers: [], // 赠送代金券，不限金额
      couponList: [], // 抵扣金额 只显示小于或等于套餐销售价的代金券
      packages: [],
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 180,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: 'http://35.201.165.105:8000/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/lzwl-distribute/static/ueditor/'
      }
    }
  },
  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/admin/terminal?clientType=1&token=' + this.userInfo.token          // 上传图片
    },
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    if (this.$route.path.match(/edit/gi)) this.pageType = 2
    this.mealId = parseInt(this.$route.query.id)
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    if (this.mealId) this.getDetailsData()
    this.initSelectData()
  },
  methods: {
    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.get(`@ROOT_API/meal/getSetMeal?mealId=${this.mealId}`, {
        mealId: this.mealId
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
        this.ruleForm.setMealName = results.setMealName
        this.ruleForm.setMealPrice = results.setMealPrice
        this.ruleForm.setMealCostPrice = results.setMealCostPrice
        this.ruleForm.simpleDescription = results.simpleDescription
        this.ruleForm.textDescription = results.textDescription
        this.ruleForm.setMealStatus = results.setMealStatus
        this.ruleForm.whetherNumberLimit = results.whetherNumberLimit
        this.ruleForm.numberLimit = results.numberLimit
        this.ruleForm.commissionType = results.commissionType
        this.ruleForm.whetherNeetGift = results.whetherNeetGift
        this.ruleForm.neetGiftMealId = results.neetGiftMealId
        this.ruleForm.configurationMoney = results.configurationMoney || 0
        this.ruleForm.giftRecommendReward = results.giftRecommendReward
        this.ruleForm.giftRecommendRankReward = results.giftRecommendRankReward
        this.ruleForm.giftManageAreaReward = results.giftManageAreaReward
        this.ruleForm.giftManageCityReward = results.giftManageCityReward
        this.ruleForm.giftManageCrossReward = results.giftManageCrossReward
        this.ruleForm.pickReward = results.pickReward
        this.ruleForm.pickAreaReward = results.pickAreaReward
        this.ruleForm.pickCityReward = results.pickCityReward
        this.ruleForm.pickCrossReward = results.pickCrossReward
        this.ruleForm.couponHandsel = results.couponHandsel
        this.ruleForm.couponDeduction = results.couponDeduction
        let coverImgListArr = results.mainImageUrl.split(',')
        this.ruleForm.mainImageUrl = results.mainImageUrl
        coverImgListArr.forEach((img) => {
          this.coverImgList.push({
            url: img
          })
        })
        this.inpBlur('setMealPrice')
        this.inpBlur('setMealCostPrice')
        let mainImgListArr = results.appendImageUri.split(',')
        mainImgListArr.forEach((img) => {
          this.mainImgList.push({
            url: img
          })
        })
        this.ruleForm.appendImageUri = results.appendImageUri
        this.ruleForm.uploadFiles = results.appendImageUri
      })
    },

    /**
     * 提交
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.confirmLoading = true
        let params = {
          setMealName: this.ruleForm.setMealName,
          setMealPrice: this.ruleForm.setMealPrice || 0,
          setMealCostPrice: this.ruleForm.setMealCostPrice || 0,
          simpleDescription: this.ruleForm.simpleDescription,
          mainImageUrl: this.ruleForm.mainImageUrl, // 主图
          appendImageUri: this.ruleForm.appendImageUri, // 附件图
          textDescription: this.ruleForm.textDescription,
          setMealStatus: this.ruleForm.setMealStatus,
          whetherNumberLimit: this.ruleForm.whetherNumberLimit,
          numberLimit: this.ruleForm.numberLimit || 0,
          commissionType: this.ruleForm.commissionType,
          whetherNeetGift: this.ruleForm.whetherNeetGift,
          neetGiftMealId: this.ruleForm.neetGiftMealId,
          configurationMoney: this.ruleForm.configurationMoney || 0,
          giftRecommendReward: this.ruleForm.giftRecommendReward || 0,
          giftRecommendRankReward: this.ruleForm.giftRecommendRankReward || 0,
          giftManageAreaReward: this.ruleForm.giftManageAreaReward || 0,
          giftManageCityReward: this.ruleForm.giftManageCityReward || 0,
          giftManageCrossReward: this.ruleForm.giftManageCrossReward || 0,
          pickReward: this.ruleForm.pickReward || 0,
          pickAreaReward: this.ruleForm.pickAreaReward || 0,
          pickCityReward: this.ruleForm.pickCityReward || 0,
          pickCrossReward: this.ruleForm.pickCrossReward || 0,
          couponHandsel: this.ruleForm.couponHandsel,
          couponDeduction: this.ruleForm.couponDeduction
        }
        let url = 'meal/addSetMeal'
        if (this.mealId) {
          params.id = this.mealId
          url = 'meal/updateSetMeal'
        }
        this.$http.post(`@ROOT_API/${url}`, params).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          // succese
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          setTimeout(() => {
            this.$router.push('/admin/business/package')
          }, 300)
        }).finally(() => {
          setTimeout(() => {
            this.confirmLoading = false
          }, 500)
        })
      })
    },

    /**
     * 自动补全百分位
     */
    inpBlur (type) {
      this.$Utils.blurAutoCompletion(this.ruleForm, type)
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
    exceedHandleMain () {
      this.$message({
        message: '最多只能上传3个图标',
        type: 'error'
      })
    },

    /**
     * 文件上传成功
     */
    uploadSuccessHandle (res) {
      if (res.status !== '1') {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.coverImgList.push({url: this.$Utils.filterImgUrl(res.data)})  // 绝对路径
      this.ruleForm.mainImageUrl = res.data                     // 相对路径
    },

    /**
     * 文件被移除
     */
    removeHandle (file, fileList) {
      this.ruleForm.mainImageUrl = ''      // 移除的时候清空对象
      this.coverImgList = []
    },
    /**
     * 文件上传成功
     */
    uploadSuccessHandleMain (res) {
      if (res.status !== '1') {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.mainImgList.push({url: this.$Utils.filterImgUrl(res.data)})  // 绝对路径
      this.ruleForm.appendImageUri = this.mainImgList.map(img => img.url).join(',')                     // 相对路径
      this.ruleForm.uploadFiles = this.mainImgList.map(img => img.url).join(',')
    },

    /**
     * 文件被移除
     */
    removeHandleMain (file, fileList) {
      this.mainImgList = this.mainImgList.filter((img) => {
        return img.url !== file.url
      })
      this.ruleForm.appendImageUri = this.mainImgList.join(',')
    },
    initSelectData () {
      // 订购要求选择的套餐
      this.$http.get('@ROOT_API/meal/getSetMealNeetGiftList', {}).then((res) => {
        let { data } = res.data
        if (!data) data = []
        this.packages = data
      })
      // 代金券列表
      this.$http.post('@ROOT_API/coupon/getCouponList', {
        start: 1,
        pageSize: 999,
        statusFalg: '1'
      }).then((res) => {
        let { list } = res.data.data
        if (!list) list = []
        this.vouchers = list
        this.getCouponList()
      })
    },
    getCouponList () {
      if (!this.ruleForm.setMealPrice) {
        this.couponList = []
      } else {
        this.couponList = this.vouchers.filter(vou => vou.amount <= parseFloat(this.ruleForm.setMealPrice))
      }
    },
    mealPriceChange () {
      this.inpBlur('setMealPrice')
      this.getCouponList()
      this.changeAmount()
    },
    changeAmount () {
      let configurationMoney = 0
      let keys = []
      if (this.ruleForm.commissionType === 1) {
        keys = ['giftRecommendReward', 'giftRecommendRankReward', 'giftManageAreaReward', 'giftManageCityReward', 'giftManageCrossReward']
      } else {
        keys = ['pickReward', 'pickAreaReward', 'pickCityReward', 'pickCrossReward']
      }
      keys.forEach((key) => {
        let data = parseFloat(this.ruleForm[key])
        if (!isNaN(data)) configurationMoney += data
      })
      this.ruleForm.configurationMoney = configurationMoney
    }
  }
}
</script>

<style lang="less" scoped>
.package-public-detail-wrap{

  .goods-common-details{

    .box{
      margin-bottom: 20px;
      border-bottom: 1px solid #f1f4f7;

      .uploading{
        width: 75px;
        height: 75px;
        line-height: 70px;
        border: 1px solid #ccc;

        .tips{
          color: #999;
          font-size: 12px;
        }
      }

      .upload-demo{
        .el-button--primary{
          bottom: 0;
          left: 0;
        }

        li{
          display: none;
        }
      }

      .title{
        height: 35px;
        line-height:35px;
        padding: 10px 20px;
        font-size: 14px;
        border-left:1px solid #f1f4f7;
        border-right:1px solid #f1f4f7;
      }

      .spanColor{
        color: #999;
        margin-left: 10px;
      }

      .recommend{
        height: 45px;
        line-height: 45px;
        padding: 0 20px;
        font-size: 14px;
      }

      .rewardBonus{
        .rewardBonus-left{
          width: 40%;
          .el-form-item{
            border-right: none;
          }
        }

        .rewardBonus-right{
          padding-left: 40%;
          .el-form-item{
            border-left: none;
          }
        }
      }

      p{
        height: 45px;
        line-height: 45px;
        padding: 0 20px;
        border: 1px solid #f1f4f7;
        border-bottom:none;
      }

      dl{
        dt, dd{
          padding: 10px;
        }

        dt{
          color: #606266;
          width: 160px;
          font-size: 14px;
          top: 0;
          left: 0;

          span{
            height: 45px;
            line-height: 45px;
          }
        }

        dd{
          padding-left: 180px;
          border: 1px solid #f1f4f7;
          border-bottom: none;

          table{
            /*width: 90%;*/
            /*margin: 20px;*/
            box-sizing: border-box;

            th{
              height: 45px;
              line-height: 45px;
              font-size: 16px;
              font-weight: normal;
              background: #eee;
            }

            td{
              height: 43px;
              line-height: 43px;
              padding: 0;
              text-align: center;
              border: 1px solid #f1f4f7;
              border-bottom: none;
            }
          }
        }
      }

      .cycle{
        width: 200px;
      }

      .word-count{
        left: 380px;
        top: 45px;
      }
    }

    .maggin-t{
      margin-top: 0;
    }

    .admin-gray-title{
      margin-bottom: 0;
    }

    table{
      width: 100%;
      border: 1px solid #f1f4f7;
      border-collapse: collapse;
      margin-bottom: 20px;

      td{
        height: 35px;
        line-height: 35px;
        border-bottom: 1px solid #f1f4f7;
        font-size: 15px;
        padding: 20px;

        .recommendSpan{
          color: #999;
        }
      }

      td:nth-child(odd) {
        color: #666;
        width: 200px;
        text-align: center;
      }

      td:nth-child(even) {
        color: #333;
      }
    }

    .pictrue-wrap{
      font-size: 0;

      .list{
        width: 80px;
        height: 80px;
        border: 1px solid #33719b;
        margin-right: 20px;
        overflow: hidden;
        border-radius: 5px;

        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .edit_container {
      height: 400px;
      .quill-editor {
        height: 200px;
      }
      .edui-editor {
        z-index: 1;
      }
    }
  }
}
</style>
<style lang="less">
.package-public-detail-wrap{
  .el-dialog {
    .el-dialog__body {
      padding-bottom: 0;
    }
  }

  .el-form{
    
    .el-form-item{
      /*float: left;*/
      border: 1px solid #f1f4f7;
      border-bottom: none;
      padding: 20px;
      margin-bottom: 0;

      .el-form-item__label{
        width: 200px !important;
      }

      .recommendSpan{
        margin-left: 10px;
      }

      .el-input{
        width: 220px;
      }
      .el-form-item__content{
        margin-left: 200px !important;
      }

      .cue{
        color: #999;
        // left: 200px;
        bottom: 0;
      }
    }

    .administration-wrap{
      width: 100%;
      overflow: hidden;
      border: 1px solid #f1f4f7;
      border-bottom: none;
      .administration{
        float: left;
        border: none;
        .el-form-item__content{
          margin-left: 200px !important;
        }

        .el-form-item__error{
          left: 0;
        }
      }

      .administration-l{
        width: 32%;
      }
    }
  }

  .uploadHide{
    height: 148px;
    width: 148px;

    .el-upload-list__item{
      width: 148px;
      height: 148px;
    }
    .el-upload{
      display: none;
    }
  }

  .el-textarea{
    width: 420px;
  }
  .package-cover-img, .package-main-img {
    .uploadHide {
      width: auto;
      height: 100px;
    }
    .el-upload--picture-card {
      width: 100px;
      height: 100px;
      line-height: 110px;
      .el-upload__text {
        position: absolute;
        top: 25px;
        font-size: 8px;
        width: 100%;
        text-align: center;
      }
    }
    .upload-tips {
      width: 170px;
      line-height: 20px;
      top: 100px;
      left: -30px;
      font-size: 8px;
    }
    .upload-tips-right {
      width: 200px;
      line-height: 20px;
      top: 100px;
      left: 140px;
      font-size: 8px;
    }
    .el-upload-list__item {
      width: 100px;
      height: 100px;
      line-height: 110px;
    }
  }
  .package-cover-img {
    padding-right: 20px;
    height: 100px;
    border-right: 1px dashed #999;
    text-align: center;
  }
  .package-main-img {
    height: 100px;
    margin-left: 50px;
  }
  .edui-editor {
    z-index: 1 !important;
  }
}
</style>
