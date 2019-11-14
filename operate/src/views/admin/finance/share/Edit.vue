<!-- 专区分佣管理 - 分享分佣 - 编辑 -->
<template>
  <common-tpl class="share-public-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

          <!-- 编辑等级 -->
          <div class="box">
            <gray-title title="编辑等级"></gray-title>
            <el-form-item label="级别名称：" prop="rankName">
              <el-input v-model="ruleForm.rankName" placeholder="0-20个字符" maxlength="20"></el-input>
            </el-form-item>
          </div>

          <!-- 升级条件 -->
          <div class="box">
            <gray-title title="升级条件"></gray-title>
            <el-form-item label="业绩要求：" prop="performanceDemand">
              <el-input v-model="ruleForm.performanceDemand" placeholder="20个字符,限数字" maxlength="20" :disabled="ruleForm.id ===1"></el-input><span class="recommendSpan">元</span> <span class="spanColor">注：大于等于业绩，买卖仓业绩=自身买卖仓订单+伞下会员买卖仓订单累计</span>
            </el-form-item>
            <el-form-item label="推荐同级数：" prop="recommendCount">
              <el-input v-model="ruleForm.recommendCount" placeholder="0-20正整数" maxlength="2"></el-input><span class="recommendSpan">个</span> <span class="spanColor">注：直接推荐同级满同级个数，升级到下一个级别</span>
            </el-form-item>
          </div>

          <!-- 直推分佣 -->
          <div class="box">
            <gray-title title="直推分佣"></gray-title>
            <el-form-item label="分享奖比例：" prop="directRate">
              <el-input v-model="ruleForm.directRate" placeholder="0-100的数字,允许精确到百分位" v-auto-price maxlength="6" :disabled="ruleForm.id === 2 || ruleForm.id === 3 || ruleForm.id === 4 || ruleForm.id === 5"></el-input><span class="recommendSpan">%</span><span class="spanColor">注：买卖仓分享奖=直接推荐下级买卖仓订单 X 直推荐比例</span>
            </el-form-item>
            <el-form-item label="分享收益比例：" prop="directProfitRate">
              <el-input v-model="ruleForm.directProfitRate" placeholder="0-100的数字,允许精确到百分位" v-auto-price maxlength="6"></el-input><span class="recommendSpan">%</span><span class="spanColor"><span class="red">分享收益</span> =直推下级收益 ( <span class="red">团队分佣 + 买卖仓分享奖励</span>) X 分享收益比例^级别数</span>
            </el-form-item>
            <!-- <el-form-item label="分佣级数：" prop="commissionLevel">
              <el-input v-model="ruleForm.commissionLevel" placeholder="0-6正整数" maxlength="2"></el-input><span class="recommendSpan">级</span> <span class="spanColor">注：直接收益按照分佣级别进行层级分佣</span>
            </el-form-item> -->
          </div>
          

          <!-- 团队分佣 -->
          <div class="box">
            <gray-title title="团队分佣"></gray-title>
            <div class="award">
              <!-- <h2 class="fw-n recommend">推荐分佣：</h2> -->
              <el-form-item label="分佣比例：" prop="commissionRate">
                <el-input v-model="ruleForm.commissionRate" placeholder="0-100的数字,允许精确到百分位" v-auto-price maxlength="6"></el-input><span class="recommendSpan">%</span><span class="spanColor">注：团队分佣奖=团队伞下业绩（不含自身消费） X 分佣比例，存在级差分佣</span>
              </el-form-item>
              <el-form-item label="全球分红比例：" prop="globalWeightRate">
                <el-input v-model="ruleForm.globalWeightRate" placeholder="0-100的数字,允许精确到百分位" v-auto-price maxlength="6"></el-input><span class="recommendSpan">%</span><span class="spanColor">注：<span class="red">全球分红</span>=（总业绩 X 全球分红比例）/全球合伙人数</span>
              </el-form-item>
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
    // 验证20个字符,限正整数
    let validateNumber = (rule, value, callback) => {
      if (value === '') return callback(new Error('不能为空'))
      let reg = /^\d{0,20}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('只能输入20以内的正整数'))
      callback()
    }

    // 验证0-6正整数
    let validateSix = (rule, value, callback) => {
      if (value === '') return callback(new Error('不能为空'))
      let reg = /^[0-9]\d{0,6}$/gi
      if ((value && parseFloat(value) > 6) || (value && !value.toString().match(reg))) return callback(new Error('请输入6以内的正整数'))
      callback()
    }

    // 验证0-20正整数
    let validateTwenty = (rule, value, callback) => {
      if (value === '') return callback(new Error('不能为空'))
      let reg = /^[0-9]\d{0,20}$/gi
      if ((value && parseFloat(value) > 20) || (value && !value.toString().match(reg))) return callback(new Error('请输入20以内的正整数'))
      callback()
    }

    // 验证100以内的正确的分佣比例比例
    let validatePercent = (rule, value, callback) => {
      if (value === '') return callback(new Error('不能为空'))
      let reg = /^(\d|[1-9]\d|100)(\.\d{1,2})?$/gi
      if ((value && parseFloat(value) > 100) || (value && !value.toString().match(reg))) return callback(new Error('请输入100以内的正确的分佣比例，只保留两位小数'))
      callback()
    }

    return {
      confirmLoading: false,    // 确定loading
      pageType: 1,              // 页面类型
      ruleForm: {
        // 基本信息
        rankName: '',          // 级别名称
        performanceDemand: '',  // 业绩要求
        recommendCount: '',     // 推荐同级数
        directRate: '',         // 直推奖比例
        directProfitRate: '',   // 直推收益比例
        commissionLevel: '',    // 分佣级数
        commissionRate: '',     // 分佣比例
        globalWeightRate: '',   // 全球分红比例

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
      listDetails: {},          // 列表详情
      storeData: {},            // 商品id
      passVisible: false,       // 审核弹窗
      faceUrl: '',              // 上传图标地址
      isUploading: false,       // 上传中
      rules: {

        // 级别名称
        rankName: [{ required: true, message: '请输入级别名称', trigger: 'blur' }],

        // 业绩要求
        performanceDemand: [{ required: true, validator: validateNumber, trigger: 'blur' }],

        // 推荐同级数
        recommendCount: [{ required: true, validator: validateTwenty, trigger: 'blur' }],

        // 直推奖比例
        directRate: [{ required: true, validator: validatePercent, trigger: 'blur' }],

        // 直推收益比例
        directProfitRate: [{ required: true, validator: validatePercent, trigger: 'blur' }],

        // 分佣级数
        commissionLevel: [{ required: true, validator: validateSix, trigger: 'blur' }],

        // 分佣比例
        commissionRate: [{ required: true, validator: validatePercent, trigger: 'blur' }],

        // 全球分红比例
        globalWeightRate: [{ required: true, validator: validatePercent, trigger: 'blur' }]
      },
      ruleId: '',               // 规则id
      rand: '',                 // 级数
      ruleAllData: [],          // 所有分销规则比例级数
      currentSelectRule: {
        consumePointRate: '',
        cashRate: '',
        goodsProfitRate: ''
      },    // 当前选择规则
      gradationListData: []     // 级差列表
    }
  },

  mounted () {
    if (this.$route.path.match(/edit/gi)) this.pageType = 2
    this.id = parseInt(this.$route.query.id)
    this.storeData = JSON.parse(localStorage.getItem('OPEN_STORE'))
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.listDetails = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'listDetails'))
    this.getDetailsData()
  },
  methods: {
    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.ruleForm.id = this.listDetails.id
      this.ruleForm.rankName = this.listDetails.rankName
      this.ruleForm.levelName = this.listDetails.rankName
      this.ruleForm.performanceDemand = this.listDetails.performanceDemand
      this.ruleForm.recommendCount = this.listDetails.recommendCount
      this.ruleForm.directRate = this.listDetails.directRate
      this.ruleForm.directProfitRate = this.listDetails.directProfitRate
      this.ruleForm.commissionLevel = this.listDetails.commissionLevel
      this.ruleForm.commissionRate = this.listDetails.commissionRate
      this.ruleForm.globalWeightRate = this.listDetails.globalWeightRate

      this.inpBlur('directRate')
      this.inpBlur('directProfitRate')
      this.inpBlur('commissionRate')
      this.inpBlur('globalWeightRate')
    },

    /**
     * 提交
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.confirmLoading = true
        this.$http.post('@ROOT_API/buyShareCommissionSetController/updateShareCommissionSet', {
          id: this.id,           //  是 int id
          rankName: this.ruleForm.rankName,                     // 是 string  级别名称
          performanceDemand: this.ruleForm.performanceDemand,     // 是 decimal 业绩要求
          recommendCount: this.ruleForm.recommendCount,           // 是 int 推荐同级数
          directRate: this.ruleForm.directRate || 0,              // 是 decimal 直推奖比例
          directProfitRate: this.ruleForm.directProfitRate || 0,  // 是 decimal 直推收益比例
          commissionLevel: this.ruleForm.commissionLevel,         // 是 int 分佣级数
          commissionRate: this.ruleForm.commissionRate || 0,      // 是 decimal 分佣比例
          globalWeightRate: this.ruleForm.globalWeightRate || 0   // 是 decimal 全球分红比例
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
            this.$router.push('/admin/finance/commission/share/index')
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
    }
  }
}
</script>

<style lang="less" scoped>
.share-public-wrap{

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

        .red{
          color: red;
          padding: 0 5px;
        }
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
.share-public-wrap{
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
        width: 230px;
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
