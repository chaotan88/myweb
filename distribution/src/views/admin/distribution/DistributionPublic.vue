<!-- 分销规则新增 & 编辑 -->
<template>
  <common-tpl class="manage-public-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

          <!-- 基本信息 -->
          <div class="box">
            <gray-title title="基本信息"></gray-title>
            <el-form-item label="推广大使身份：" prop="ruleName">
              <el-input v-model="ruleForm.ruleName" placeholder="限50个字符"></el-input>
            </el-form-item>
            <el-form-item label="身份类型：" prop="type">
              <el-select v-model="ruleForm.type" size="medium" class="year-box" placeholder="选择年份" clearable>
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in types"></el-option>
              </el-select>
              <el-radio-group v-model="ruleForm.level" v-if="ruleForm.type === '2'">
                <el-radio :label="1">区县级</el-radio>
                <el-radio :label="2">市级</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传图标：" prop="uploadFiles">
              <el-upload class="upload-picture fl-l pos-r"
                :class="{uploadHide: fileList.length === 1}"
                list-type="picture-card"
                :action="uploadUrl"
                :file-list="fileList"
                :limit="1"
                :on-exceed="exceedHandle"
                :before-upload="beforeAvatarUpload"
                :on-remove="removeHandle"
                :on-success="uploadSuccessHandle">
                <!-- <el-button class="pos-a" size="small" type="primary">{{ruleForm.faceUrl ? "修改图标" : "上传图标"}}</el-button> -->
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-input v-model="ruleForm.uploadFiles" class="d-n"></el-input>
              <span class="cue pos-a">（格式：png、jpg，150px*150px）</span>
            </el-form-item>
            <el-form-item label="规则说明：" prop="describe" class="pos-r">
              <el-input type="textarea" :rows="5" v-model="ruleForm.describe"></el-input>
              <span class="d-ib word-count">&nbsp;{{ruleForm.describe ? ruleForm.describe.length : 0}}/200</span>
            </el-form-item>
          </div>

          <!-- 推广大使要求 -->
          <div class="box">
            <gray-title title="推广大使要求"></gray-title>
            <el-form-item label="服务费：" prop="agentFee">
              <el-checkbox v-model="ruleForm.service1"></el-checkbox>
              <el-input v-model="ruleForm.agentFee" placeholder="精确到百分位，限10个字符" @blur="inpBlur('agentFee')"></el-input><span class="recommendSpan">元</span>
            </el-form-item>
            <el-form-item label="服务费：" prop="agentFee">
              <el-checkbox v-model="ruleForm.service2"></el-checkbox>
              <el-input v-model="ruleForm.agentFee" placeholder="精确到百分位，限10个字符" @blur="inpBlur('agentFee')"></el-input><span class="recommendSpan">元</span>
            </el-form-item>
            <el-form-item label="服务费：" prop="agentFee">
              <el-checkbox v-model="ruleForm.service3"></el-checkbox>
              <el-input v-model="ruleForm.agentFee" placeholder="精确到百分位，限10个字符" @blur="inpBlur('agentFee')"></el-input><span class="recommendSpan">元</span>
            </el-form-item>
            <el-form-item label="购买套餐满：" prop="consume">
              <el-input v-model="ruleForm.consume" placeholder="填写正整数，限10个字符"></el-input><span class="recommendSpan">元</span>
              <el-checkbox v-model="ruleForm.checkPackage">做为升级条件</el-checkbox>
            </el-form-item>
            <el-form-item label="推荐推广大使：" prop="recommend" class="last-form-item">
              <el-select v-model="ruleForm.memberLevel" size="medium" class="year-box"
                placeholder="选择会员等级" clearable>
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in memberLevels"></el-option>
              </el-select>
              <el-input v-model="ruleForm.recommend" placeholder="填写正整数，限10个字符"></el-input><span class="recommendSpan">人</span>
              <el-checkbox v-model="ruleForm.CheckMemberLevel">做为升级条件</el-checkbox>
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
    // 验证代销商品数量
    let validateNumber = (rule, value, callback) => {
      let reg = /^\d{0,10}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('只能输入10个字符以内的正整数'))
      callback()
    }

    // 验证代理费
    let validateAgentFee = (rule, value, callback) => {
      // if (!value && parseInt(value) !== 0) return callback('代理费不能为空')
      let reg = /^\d{0,7}\.\d{2}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('精确到百分位，限10个字符'))
      callback()
    }

    // 验证消费积分满
    let validateConsume = (rule, value, callback) => {
      if (!value && parseInt(value) !== 0) return callback(new Error('消费积分不能为空'))
      let reg = /^\d{0,10}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('只能输入10个字符以内的正整数'))
      callback()
    }

    // 直接推荐同级满
    let validateRecommend = (rule, value, callback) => {
      // if (!value) return callback('直接推荐同级人数不能为空')
      let reg = /^\d{0,10}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('只能输入10个字符以内的正整数'))
      callback()
    }

    // 选择直接下级
    let validateSubordinate = (rule, value, callback) => {
      if (!value) return callback(new Error('请选择直接下级'))
      callback()
    }

    // 验证核算周期
    let validateCycle = (rule, value, callback) => {
      let reg = /^\+?[1-9]\d*$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('只能输入大于1等于1的正整数'))
      callback()
    }

    // 验证商品描述
    let ruleNumber = (rule, value, callback) => {
      if (value && value.toString().length > 200) return callback(new Error('只能输入200个字符'))
      callback()
    }

    // 芯片收益值
    let validateChip = (rule, value, callback) => {
      let reg = /^(0|[1-9][0-9]*)+(.[0-9]{1,2})?$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('请输入整数，限2位小数'))
      callback()
    }

    // 验证管理奖奖励级数
    let validateInteger = (rule, value, callback) => {
      let reg = /^([0-9]|(1[0]))$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('只能输入0-10以内的正整数'))
      callback()
    }

    // 验证全球加权分红比例/办公场地补贴比例
    let validatePercent = (rule, value, callback) => {
      let reg = /^(0|[1-9]\d{0,2})\.\d{2}$/gi
      if ((value && parseFloat(value) > 100) || (value && !value.toString().match(reg))) return callback(new Error('请输入100以内的正确的分佣比例，只保留两位小数'))
      callback()
    }

    return {
      confirmLoading: false,    // 确定loading
      pageType: 1,              // 页面类型
      ruleForm: {
        // 基本信息
        ruleName: '',           // 会员身份
        describe: '',           // 规则说明
        description: '',
        uploadFiles: '',        // 图片相对路径
        // 加入条件
        agentFee: '',           // 代理费
        buyGoods: '',           // 购买商品数
        consume: '',            // 消费积分
        recommend: '',          // 推荐同级
        // 获得内容
        goods: '',              // 商城商品
        integral: '',           // 商城消费积分
        giftIntegral: '',       // 赠送商城消费积分
        subordinate: '',        // 下级
        // 奖励规则
        cycle: '',              // 核算周期
        rewardConsume: '',      // 奖励消费积分比例
        rewardCash: '',         // 奖励通用积分比例
        rewardGoods: '',        // 奖励商品收益比例
        shopProfitSubsidyRate: '', // 店补收益比例
        rewardBonus: '',        // 全球加权分红比例
        rewardOffice: '',       // 办公场地补贴比例
        rewardChip: '',         // 芯片销售收益
        areaRepeatRate: '',     // 区域重消
        levelingRate: '',       // 平级奖比例
        beSurpassedRate: '',    // 超越奖
        manageAwardRate: '',    // 管理奖比例
        manageAwardNum: '',     // 管理奖奖励级数
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        // type: '1',
        level: 1
      },
      fileList: [],             // 图片集合
      userInfo: {},             // 用户信息
      storeData: {},            // 商品id
      passVisible: false,       // 审核弹窗
      faceUrl: '',              // 上传图标地址
      isUploading: false,       // 上传中
      rules: {

        // 会员身份
        ruleName: [
          { required: true, message: '请输入合伙身份', trigger: 'blur' },
          { max: 50, message: '长度在50个字符', trigger: 'blur' }
        ],

        // 代理费
        agentFee: [{ validator: validateAgentFee, trigger: 'blur' }],

        // 上传图标
        uploadFiles: [{ required: true, message: '请上传图标', trigger: 'change' }],

        // 商品描述
        describe: [{ validator: ruleNumber, trigger: 'blur' }],

        // 购买商品数
        buyGoods: [{ validator: validateNumber, trigger: 'blur' }],

        // 消费积分
        consume: [{ required: true, validator: validateConsume, trigger: 'blur' }],

        // 商城商品
        goods: [{ validator: validateNumber, trigger: 'blur' }],

        // 商城消费积分
        bonusPoints: [{ validator: validateNumber, trigger: 'blur' }],

        // 赠送商城消费积分
        giftIntegral: [{ validator: validateNumber, trigger: 'blur' }],

        // 推荐同级
        recommend: [{ validator: validateRecommend, trigger: 'blur' }],

        // 下级
        subordinate: { required: true, validator: validateSubordinate, trigger: 'change' },

        // 奖励消费积分比例
        rewardConsume: [{ validator: validatePercent, trigger: 'blur' }],

        // 奖励通用积分比例
        rewardCash: [{ validator: validatePercent, trigger: 'blur' }],

        // 奖励商品收益比例
        rewardGoods: [{ validator: validatePercent, trigger: 'blur' }],

        // 店补收益比例
        shopProfitSubsidyRate: [{ validator: validatePercent, trigger: 'blur' }],

        // 全球加权分红比例
        rewardBonus: [{ validator: validatePercent, trigger: 'blur' }],

        // 核算周期
        cycle: [{ validator: validateCycle, trigger: 'blur' }],

        // 办公场地补贴比例
        rewardOffice: [{ validator: validatePercent, trigger: 'blur' }],

        // 芯片销售收益
        rewardChip: [{ validator: validateChip, trigger: 'blur' }],

        // 区域重消
        areaRepeatRate: [{ validator: validateChip, trigger: 'blur' }],

        // 平级奖比例
        levelingRate: [{ validator: validatePercent, trigger: 'blur' }],

        // 超越奖
        beSurpassedRate: [{ validator: validatePercent, trigger: 'blur' }],

        // 管理奖比例
        manageAwardRate: [{ validator: validatePercent, trigger: 'blur' }],

        // 管理奖奖励级数
        manageAwardNum: [{ validator: validateInteger, trigger: 'blur' }]
      },
      ruleId: '',               // 规则id
      rand: '',                 // 级数
      ruleAllData: [],          // 所有分销规则比例级数
      currentSelectRule: {
        consumePointRate: '',
        cashRate: '',
        goodsProfitRate: ''
      },    // 当前选择规则
      gradationListData: [],     // 级差列表
      types: [{ label: '普通身份', value: '1' }, { label: '区域身份', value: '2' }],
      memberLevels: [{ label: '普通会员', value: '1' }, { label: '初级合伙人', value: '2' },
      { label: 'VIP合伙人', value: '3' }, { label: '区域运营中心', value: '4' },
      { label: '市级运营中心', value: '5' }]
    }
  },
  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/admin/terminal?clientType=1&token=' + this.userInfo.token          // 上传图片
    }
  },
  mounted () {
    if (this.$route.path.match(/edit/gi)) this.pageType = 2
    this.ruleId = parseInt(this.$route.query.id)
    this.storeData = JSON.parse(localStorage.getItem('OPEN_STORE'))
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    if (this.ruleId) this.getDetailsData()
    this.getRuleAllSubs()
  },
  methods: {
    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/rule/getRuleDetail', {
        ruleId: this.ruleId
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
        this.ruleForm.ruleName = results.ruleName
        if (results.ruleIcon) {
          this.fileList.push({url: this.$Utils.filterImgUrl(results.ruleIcon)})  // 绝对路径
          this.ruleForm.uploadFiles = results.ruleIcon                     // 相对路径
        }
        this.ruleForm.describe = results.ruleDesc
        this.ruleForm.agentFee = results.agentFee
        if (this.ruleForm.agentFee !== '' || this.ruleForm.agentFee !== null) this.inpBlur('agentFee')
        this.ruleForm.consume = results.consumePoint
        this.ruleForm.recommend = results.directRecommendPeer
        this.ruleForm.goods = results.toGoodsMoney
        this.ruleForm.bonusPoints = results.toConsumePoint

        this.ruleForm.giftIntegral = results.giveConsumePoint // giveConsumePoint  否 INT '赠送商城消费积分（达到该等级额外赠送的商城消费积分）'
        // rand  否 TINYINT '当前级数'
        // directParent  是 INT '直接上级'
        this.ruleForm.subordinate = results.directSub // 是 INT '直接下级( 推荐分佣 选择直接下级)'
        this.ruleForm.rewardConsume = results.consumePointRate  // consumePointRate  是 double  '奖励消费积分比例'
        if (this.ruleForm.rewardConsume) this.inpBlur('rewardConsume')
        this.ruleForm.rewardCash = results.cashRate // cashRate  是 double  '奖励通用积分比例'
        if (this.ruleForm.rewardCash) this.inpBlur('rewardCash')
        this.ruleForm.rewardGoods = results.goodsProfitRate // goodsProfitRate 是 double  '奖励商品收益比例'
        if (this.ruleForm.rewardGoods) this.inpBlur('rewardGoods')
        this.ruleForm.shopProfitSubsidyRate = results.shopProfitSubsidyRate // goodsProfitRate 是 double  '奖励商品收益比例'
        if (this.ruleForm.shopProfitSubsidyRate) this.inpBlur('shopProfitSubsidyRate')
        this.ruleForm.rewardBonus = results.globalWeightRate
        if (this.ruleForm.rewardBonus) this.inpBlur('rewardBonus')
        this.ruleForm.rewardOffice = results.officeRate
        if (this.ruleForm.rewardOffice) this.inpBlur('rewardOffice')
        this.ruleForm.rewardChip = results.chipRate
        if (this.ruleForm.rewardChip) this.inpBlur('rewardChip')
        this.ruleForm.areaRepeatRate = results.areaRepeatRate
        if (this.ruleForm.areaRepeatRate) this.inpBlur('areaRepeatRate')
        this.ruleForm.levelingRate = results.levelingRate
        if (this.ruleForm.levelingRate) this.inpBlur('levelingRate')
        this.ruleForm.beSurpassedRate = results.beSurpassedRate
        if (this.ruleForm.beSurpassedRate) this.inpBlur('beSurpassedRate')
        this.ruleForm.manageAwardRate = results.manageAwardRate
        if (this.ruleForm.manageAwardRate) this.inpBlur('manageAwardRate')
        this.ruleForm.manageAwardNum = results.manageAwardNum
      })
    },

    /**
     * 获取所有分销规则比例级数
     */
    getRuleAllSubs () {
      this.$http.post('@ROOT_API/rule/getDisRuleAllSubs', {
        rand: this.rand
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
        this.ruleAllData = resData.data
        this.ruleId && this.ruleChange(this.ruleId)
      })
    },

    /**
     * 规则下拉选择
     */
    ruleChange (id) {
      this.currentSelectRule = this.ruleAllData.filter((row) => row.ruleId === id)[0]
      let level = this.currentSelectRule.rand
      this.gradationListData = []
      this.ruleAllData.forEach((row) => {
        if (row.rand < level) this.gradationListData.push(row)
      })
    },

    /**
     * 提交
     */
    submitForm (formName) {
      console.log(this.ruleForm)
      // this.$refs[formName].validate((valid) => {
      //   if (!valid) return false
      //   this.confirmLoading = true
      //   this.$http.post('@ROOT_API/rule/saveOrUpdateRule', {
      //     ruleId: this.ruleId,                                 // 否 long  分销规则Id，如果是【编辑】则需要当前Id，如果是【新增】则不需要传
      //     ruleName: this.ruleForm.ruleName,                    // 是 VARCHAR '分销规则名称' 不允许重复
      //     ruleIcon: this.ruleForm.uploadFiles,                 // 否 VARCHAR '分销规则图标'
      //     ruleDesc: this.ruleForm.describe,                    // 否 VARCHAR '分销规则说明'
      //     agentFee: this.ruleForm.agentFee || 0,               // 否 double  '代理费'
      //     consumePoint: this.ruleForm.consume,                 // 否 INT '消费积分（消费积分满x）'
      //     directRecommendPeer: this.ruleForm.recommend || 0,   // 否 INT '直接推荐同级个数'
      //     toGoodsMoney: this.ruleForm.goods || 0,              // 否 double  '获得商城商品（元）'
      //     toConsumePoint: this.ruleForm.bonusPoints || 0,      // 否 INT '获得商城消费积分（个 只有通过缴纳代理费方式达到等级）'
      //     giveConsumePoint: this.ruleForm.giftIntegral || 0,   // 否 INT '赠送商城消费积分（达到该等级额外赠送的商城消费积分）'
      //     directSub: this.ruleForm.subordinate,                // 是 INT '直接下级( 推荐分佣 选择直接下级)'
      //     consumePointRate: this.ruleForm.rewardConsume || 0,  // 否 double  '奖励消费积分比例'
      //     cashRate: this.ruleForm.rewardCash || 0,             // 否 double  '奖励通用积分比例'
      //     goodsProfitRate: this.ruleForm.rewardGoods || 0,     // 否 double  '奖励商品收益比例'
      //     shopProfitSubsidyRate: this.ruleForm.shopProfitSubsidyRate || 0,     // 否 double  '店铺分佣补贴'
      //     globalWeightRate: this.ruleForm.rewardBonus || 0,    // 否 double  '全球加权分红比例'
      //     officeRate: this.ruleForm.rewardOffice || 0,         // 否 double  '办公场地补贴比例'
      //     chipRate: this.ruleForm.rewardChip || 0,             // 否 double  '芯片收益值'
      //     areaRepeatRate: this.ruleForm.areaRepeatRate || 0,   // 否 double  '区域重消'
      //     levelingRate: this.ruleForm.levelingRate || 0,       // 否 double  '平级奖比例'
      //     beSurpassedRate: this.ruleForm.beSurpassedRate || 0, // 否 double  '超越奖'
      //     manageAwardRate: this.ruleForm.manageAwardRate || 0, // 否 double  '管理奖比例'
      //     manageAwardNum: this.ruleForm.manageAwardNum || 0    // 否 double  '管理奖奖励级数'
      //   }).then((res) => {
      //     let resData = res.data
      //     if (parseInt(resData.status) !== 1) {
      //       this.$message({
      //         message: resData.msg,
      //         type: 'error',
      //         duration: 1500
      //       })
      //       return false
      //     }
      //     // succese
      //     this.$message({
      //       message: resData.msg,
      //       type: 'success',
      //       duration: 1000
      //     })
      //     setTimeout(() => {
      //       this.$router.push('/admin/distribution/rule')
      //     }, 300)
      //   }).finally(() => {
      //     setTimeout(() => {
      //       this.confirmLoading = false
      //     }, 500)
      //   })
      // })
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
      this.fileList.push({url: this.$Utils.filterImgUrl(res.data)})  // 绝对路径
      this.ruleForm.uploadFiles = res.data                     // 相对路径
    },

    /**
     * 文件被移除
     */
    removeHandle (file, fileList) {
      this.ruleForm.uploadFiles = ''      // 移除的时候清空对象
      this.fileList = []
    }
  }
}
</script>

<style lang="less" scoped>
.manage-public-detail-wrap{

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
  }
}
</style>
<style lang="less">
.distribution-list-wrap {
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
}

.manage-public-detail-wrap{
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
        left: 200px;
        bottom: 0;
      }
      .el-radio-group {
        margin-left: 20px;
      }
      .el-checkbox {
        margin-right: 20px;
      }
    }
    .last-form-item {
      .el-select, .el-input, input {
        width: 150px;
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


  .el-textarea{
    width: 420px;
  }
}
</style>
