<!-- 套餐新增 & 编辑 -->
<template>
  <common-tpl class="manage-public-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

          <!-- 基本信息 -->
          <div class="box">
            <gray-title title="基本信息"></gray-title>
            <el-form-item label="套餐名称：" prop="ruleName">
              <el-input v-model="ruleForm.ruleName" placeholder="限50个字符,不含特殊字符"></el-input>
            </el-form-item>
            <el-form-item label="销售价：" prop="ruleName">
              <el-input v-model="ruleForm.ruleName" placeholder="精确到百分位,限10个字符"></el-input>
            </el-form-item>
            <el-form-item label="成本价：" prop="ruleName">
              <el-input v-model="ruleForm.ruleName" placeholder="精确到百分位,限10个字符"></el-input>
            </el-form-item>
            <el-form-item label="简要说明：" prop="ruleName">
              <el-input v-model="ruleForm.ruleName" placeholder="限50个字符,不含特殊字符"></el-input>
            </el-form-item>
            <el-form-item label="套餐主图：" prop="uploadFiles">
              <div class="package-cover-img">
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
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-input v-model="ruleForm.uploadFiles" class="d-n"></el-input>
                <span class="cue pos-a">（图片建议尺寸：300 * 150px ；建议大小：100KB以内）</span>
              </div>
              <div class="package-main-img">
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
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-input v-model="ruleForm.uploadFiles" class="d-n"></el-input>
                <span class="cue pos-a">（图片建议尺寸：300 * 300px ；建议大小：100KB以内）</span>
              </div>
            </el-form-item>
            <el-form-item label="详情描述：" prop="describe" class="pos-r">
              <div class="edit_container">
                <quill-editor 
                    v-model="content" 
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                </quill-editor>
                <button v-on:click="saveHtml">保存</button>
              </div> 
            </el-form-item>
          </div>

          <!-- 加入条件 -->
          <div class="box">
            <gray-title title="加入条件"></gray-title>
            <h2 class="fw-n title">说明：以下条件满足一个条件即可成为该等级，未设置则表示不开启该项规则</h2>
            <el-form-item label="代理费：" prop="agentFee">
              <el-input v-model="ruleForm.agentFee" placeholder="精确到百分位，限10个字符" @blur="inpBlur('agentFee')"></el-input><span class="recommendSpan">元</span>
            </el-form-item>
            <!-- <el-form-item label="购买商品满：" prop="buyGoods">
              <el-input v-model="ruleForm.buyGoods" placeholder="填写正整数，限20个字符"></el-input><span class="recommendSpan">元</span>
            </el-form-item> -->
            <el-form-item label="消费积分满：" prop="consume">
              <el-input v-model="ruleForm.consume" placeholder="填写正整数，限10个字符"></el-input><span class="recommendSpan">个积分</span>
            </el-form-item>
            <el-form-item label="直接推荐同级及同级以上满：" prop="recommend">
              <el-input v-model="ruleForm.recommend" placeholder="填写正整数，限10个字符"></el-input><span class="recommendSpan">人，升级到下一级</span>
            </el-form-item>
          </div>

          <!-- 获得内容 -->
          <div class="box">
            <gray-title title="获得内容"></gray-title>
            <el-form-item label="商城商品：" prop="goods">
              <el-input v-model="ruleForm.goods" placeholder="填写正整数，限10个字符" @blur="inpBlur"></el-input><span class="recommendSpan">元</span> <span class="spanColor">（以余额的形式返还到商城账户中）</span>
            </el-form-item>
            <el-form-item label="商城消费积分：" prop="bonusPoints">
              <el-input v-model="ruleForm.bonusPoints" placeholder="填写正整数，限10个字符"></el-input><span class="recommendSpan">个积分</span> <span class="spanColor">（只有通过缴纳代理费方式达到等级才生效）</span>
            </el-form-item>
            <el-form-item label="赠送商城消费积分：" prop="giftIntegral">
              <el-input v-model="ruleForm.giftIntegral" placeholder="填写正整数，限10个字符"></el-input><span class="recommendSpan">个积分</span> <span class="spanColor">（达到该等级额外赠送的商城消费积分）</span>
            </el-form-item>
          </div>

          <!-- 奖励规则 -->
          <div class="box">
            <gray-title title="奖励规则"></gray-title>
            <div class="award">
              <h2 class="fw-n recommend">推荐分佣：</h2>
              <el-form-item label="选择直接下级：" prop="subordinate">
                <el-select v-model="ruleForm.subordinate" placeholder="选择下级" @change="ruleChange" :disabled="pageType === 2">
                  <template v-for="ruleList in ruleAllData">
                    <el-option :label="ruleList.ruleName" :value="ruleList.ruleId"></el-option>
                  </template>
                </el-select>
                <span>
                  <span class="recommendSpan">奖励消费积分比例：{{currentSelectRule.consumePointRate | filterEmpty('%')}}</span>
                  <span class="recommendSpan">奖励通用积分比例：{{currentSelectRule.cashRate | filterEmpty('%')}}</span>
                  <span class="recommendSpan">商品收益：{{currentSelectRule.goodsProfitRate | filterEmpty('%')}}</span>
                </span>
              </el-form-item>
              <p>【直接推荐奖励】以下设置比例应大于或等于下级比例，如果没有下级则设置的等级为最初级</p>
              <el-form-item label="奖励消费积分比例：" prop="rewardConsume">
                <el-input v-model="ruleForm.rewardConsume" placeholder="0-100精确到百分位" @blur="inpBlur('rewardConsume')"></el-input><span class="recommendSpan">%</span><span class="spanColor">推荐用户获得消费积分 = 推荐金额 X 奖励消费积分比例</span>
              </el-form-item>
              <el-form-item label="奖励通用积分比例：" prop="rewardCash">
                <el-input v-model="ruleForm.rewardCash" placeholder="0-100精确到百分位" @blur="inpBlur('rewardCash')"></el-input><span class="recommendSpan">%</span><span class="spanColor">推荐用户获得通用积分 = 推荐金额 X 奖励通用积分比例</span>
              </el-form-item>
              <el-form-item label="奖励商品收益比例：" prop="rewardGoods">
                <el-input v-model="ruleForm.rewardGoods" placeholder="0-100精确到百分位" @blur="inpBlur('rewardGoods')"></el-input><span class="recommendSpan">%</span><span class="spanColor">商销售收益（以通用积分体现） = 所推荐供应商利润 X 奖励商品收益比例</span>
              </el-form-item>
              <el-form-item label="店补收益比例：" prop="shopProfitSubsidyRate">
                <el-input v-model="ruleForm.shopProfitSubsidyRate" placeholder="0-100精确到百分位" @blur="inpBlur('shopProfitSubsidyRate')"></el-input><span class="recommendSpan">%</span><span class="spanColor">推荐用户获得店补 = 推荐所获得消费积分 X 店补收益比例</span>
              </el-form-item>
              <p>【间接推荐奖励】根据选中的下级，获得得以下会员的差额分佣（级差分佣奖励=当前分佣比例-下级分佣比例）</p>
              <dl class="pos-r" v-if="gradationListData.length">
                <dt class="pos-a">
                  <span class="d-b ta-r">差额分佣级别：</span>
                  <span class="d-b ta-r">级差消费积分比例：</span>
                  <span class="d-b ta-r">级差通用积分比例：</span>
                  <span class="d-b ta-r">级差商品收益比例：</span>
                  <span class="d-b ta-r">店补收益比例：</span>
                </dt>
                <dd>
                  <table>
                    <tr>
                      <th :style="{width: 10 / gradationListData.length + '%'}" v-for="gradationList in gradationListData">{{gradationList.ruleName | filterEmpty}}</th>
                    </tr>
                    <tr>
                      <td v-for="gradationList in gradationListData">{{(ruleForm.rewardConsume - gradationList.consumePointRate) | filterEmpty('%')}}</td>
                    </tr>
                    <tr>
                      <td v-for="gradationList in gradationListData">{{(ruleForm.rewardCash - gradationList.cashRate) | filterEmpty('%')}}</td>
                    </tr>
                    <tr>
                      <td v-for="gradationList in gradationListData">{{(ruleForm.rewardGoods - gradationList.goodsProfitRate) | filterEmpty('%')}}</td>
                    </tr>
                    <tr>
                      <td v-for="gradationList in gradationListData">{{(ruleForm.rewardGoods - gradationList.goodsProfitRate) | filterEmpty('%')}}</td>
                    </tr>
                    <!-- <tr>
                      <th>服务中心</th>
                      <th>钻石会员</th>
                      <th>铂金会员</th>
                      <th>金卡会员</th>
                    </tr>
                    <tr>
                      <td>2.5%</td>
                      <td>5%</td>
                      <td>7.5%</td>
                      <td>10%</td>
                    </tr>
                    <tr>
                      <td>2.5%</td>
                      <td>5%</td>
                      <td>7.5%</td>
                      <td>10%</td>
                    </tr>
                    <tr>
                      <td>2.5%</td>
                      <td>5%</td>
                      <td>7.5%</td>
                      <td>10%</td>
                    </tr> -->
                  </table>
                </dd>
              </dl>
              <div class="rewardBonus pos-r">
                <el-form-item label="全球加权分红比例：" prop="rewardBonus">
                  <el-input v-model="ruleForm.rewardBonus" placeholder="0-100精确到百分位" @blur="inpBlur('rewardBonus')"></el-input><span class="recommendSpan pos-a">%</span>
                </el-form-item>
                <!-- <div class="rewardBonus-left"></div> -->
                <!-- <div class="rewardBonus-right">
                  <el-form-item label="核算周期：" prop="cycle">
                    <el-input v-model="ruleForm.cycle" class="cycle" placeholder="大于等于1的正整数" @blur="inpBlur('rewardBonus')"></el-input>
                    <span class="recommendSpan">天</span><span class="spanColor">推荐用户获得商品收益（以消费积分体现） = 推荐金额 X 奖励商品收益比例</span>
                  </el-form-item>
                </div> -->
              </div>
              <el-form-item label="办公场地补贴比例：" prop="rewardOffice">
                <el-input v-model="ruleForm.rewardOffice" placeholder="0-100精确到百分位" @blur="inpBlur('rewardOffice')"></el-input><span class="rewardOffice">
                <span class="recommendSpan">%</span></span><span class="spanColor">办公场地补贴（以消费积分体现） = 下级销售金额 X 办公场补贴比例</span>
              </el-form-item>
              <el-form-item label="芯片收益值：" prop="rewardChip">
                <el-input v-model="ruleForm.rewardChip" placeholder="填写整数，精确到百分位" @blur="inpBlur('rewardChip')"></el-input>
                <span class="spanColor">芯片销售收益（以通用积分体现）= 芯片收益值 X 芯片数量</span>
              </el-form-item>
              <div class="administration-wrap">
                <el-form-item label="管理奖比例：" prop="manageAwardRate" class="administration administration-l">
                  <el-input v-model="ruleForm.manageAwardRate" placeholder="填写整数，精确到百分位" @blur="inpBlur('manageAwardRate')"></el-input>
                  <span class="spanColor">%</span>
                </el-form-item>
               <!--  <el-form-item label="管理奖奖励级数：" prop="manageAwardNum" class="administration administration-r">
                  <el-input v-model="ruleForm.manageAwardNum" placeholder="填写0-10以内的整数" ></el-input>
                  <span class="spanColor">往上分几级</span>
                </el-form-item> -->
              </div>
              <el-form-item label="区域重消比例：" prop="areaRepeatRate">
                <el-input v-model="ruleForm.areaRepeatRate" placeholder="填写整数，精确到百分位" @blur="inpBlur('areaRepeatRate')"></el-input>
                <span class="spanColor">区域重销收益（以通用积分体现） = 所代理的区域下的利润 X 区域重消比例</span>
              </el-form-item>
              <!-- <el-form-item label="平级奖比例:" prop="levelingRate">
                <el-input v-model="ruleForm.levelingRate" placeholder="0-100精确到百分位" @blur="inpBlur('levelingRate')"></el-input><span class="recommendSpan">%</span></span><span class="spanColor">下级如果出现相同等级，平级奖=平级会员业绩 * 平级奖比例</span>
              </el-form-item>
              <el-form-item label="超越奖：" prop="beSurpassedRate">
                <el-input v-model="ruleForm.beSurpassedRate" placeholder="0-100精确到百分位" @blur="inpBlur('beSurpassedRate')"></el-input><span class="recommendSpan">%</span></span><span class="spanColor">直接推荐的会员超越了推荐人，超越奖=超越会员业绩 * 平级奖比例</span>
              </el-form-item> -->
            </div>
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
        desc: ''
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
      content: `<p>hello world</p>`,
      editorOption: {}
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
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.confirmLoading = true
        this.$http.post('@ROOT_API/rule/saveOrUpdateRule', {
          ruleId: this.ruleId,                                 // 否 long  分销规则Id，如果是【编辑】则需要当前Id，如果是【新增】则不需要传
          ruleName: this.ruleForm.ruleName,                    // 是 VARCHAR '分销规则名称' 不允许重复
          ruleIcon: this.ruleForm.uploadFiles,                 // 否 VARCHAR '分销规则图标'
          ruleDesc: this.ruleForm.describe,                    // 否 VARCHAR '分销规则说明'
          agentFee: this.ruleForm.agentFee || 0,               // 否 double  '代理费'
          consumePoint: this.ruleForm.consume,                 // 否 INT '消费积分（消费积分满x）'
          directRecommendPeer: this.ruleForm.recommend || 0,   // 否 INT '直接推荐同级个数'
          toGoodsMoney: this.ruleForm.goods || 0,              // 否 double  '获得商城商品（元）'
          toConsumePoint: this.ruleForm.bonusPoints || 0,      // 否 INT '获得商城消费积分（个 只有通过缴纳代理费方式达到等级）'
          giveConsumePoint: this.ruleForm.giftIntegral || 0,   // 否 INT '赠送商城消费积分（达到该等级额外赠送的商城消费积分）'
          directSub: this.ruleForm.subordinate,                // 是 INT '直接下级( 推荐分佣 选择直接下级)'
          consumePointRate: this.ruleForm.rewardConsume || 0,  // 否 double  '奖励消费积分比例'
          cashRate: this.ruleForm.rewardCash || 0,             // 否 double  '奖励通用积分比例'
          goodsProfitRate: this.ruleForm.rewardGoods || 0,     // 否 double  '奖励商品收益比例'
          shopProfitSubsidyRate: this.ruleForm.shopProfitSubsidyRate || 0,     // 否 double  '店铺分佣补贴'
          globalWeightRate: this.ruleForm.rewardBonus || 0,    // 否 double  '全球加权分红比例'
          officeRate: this.ruleForm.rewardOffice || 0,         // 否 double  '办公场地补贴比例'
          chipRate: this.ruleForm.rewardChip || 0,             // 否 double  '芯片收益值'
          areaRepeatRate: this.ruleForm.areaRepeatRate || 0,   // 否 double  '区域重消'
          levelingRate: this.ruleForm.levelingRate || 0,       // 否 double  '平级奖比例'
          beSurpassedRate: this.ruleForm.beSurpassedRate || 0, // 否 double  '超越奖'
          manageAwardRate: this.ruleForm.manageAwardRate || 0, // 否 double  '管理奖比例'
          manageAwardNum: this.ruleForm.manageAwardNum || 0    // 否 double  '管理奖奖励级数'
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
          // succese
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          setTimeout(() => {
            this.$router.push('/admin/distribution/rule')
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
    },
    onEditorReady (editor) {},
    onEditorBlur () {}, // 失去焦点事件
    onEditorFocus () {}, // 获得焦点事件
    onEditorChange () {}, // 内容改变事件
    saveHtml (event) {
      alert(this.content)
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
}
</style>
