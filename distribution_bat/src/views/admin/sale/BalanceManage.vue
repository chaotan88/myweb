<!-- 共用详情页 -->
<template>
  <common-tpl class="balance-manage-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="balance-manage-list">
        <gray-title title="会员信息" class="ta-l" style="margin-bottom: 0;"></gray-title>
        <table>
          <tr>
            <td>会员手机：</td>
            <td>{{detailsData.customerPhone | filterEmpty}}</td>
          </tr>
          <tr>
            <td>姓名：</td>
            <td>{{detailsData.cardName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>身份证：</td>
            <td>{{detailsData.idCard | filterEmpty}}</td>
          </tr>
          <tr>
            <td>性别：</td>
            <td>{{detailsData.sex | filterSex}}</td>
          </tr>
          <tr>
            <td>地区：</td>
            <td>
              {{detailsData.userProvince}}
              {{detailsData.userCity}}
              {{detailsData.userZone}}
            </td>
          </tr>
          <tr>
            <td>首锁推荐人：</td>
            <td>{{detailsData.invitationName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>会员身份：</td>
            <td>{{detailsData.disRuleName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>注册时间：</td>
            <td>{{detailsData.registerTime | filterDate}}</td>
          </tr>
        </table>
        <gray-title title="账户结余" class="ta-l" style="margin-bottom: 0;"></gray-title>
        <table>
          <tr>
            <td>账户余额结余：</td>
            <td>{{detailsData.balance | filterMoney | filterEmpty('元')}}</td>
          </tr>
          <tr>
            <td>消费积分结余：</td>
            <td>{{detailsData.bonusPoints | filterMoney | filterEmpty('个')}}</td>
          </tr>
          <tr>
            <td>通用积分结余：</td>
            <td>{{detailsData.cashPoints | filterEmpty('个')}}</td>
          </tr>
          <tr>
            <td>服务积分结余：</td>
            <td>{{detailsData.servicePoints | filterEmpty('个')}}</td>
          </tr>
        </table>
        <gray-title title="结算累计" class="ta-l"></gray-title>
        <table class="balance-table">
          <tr>
            <th>收益来源</th>
            <th>通用积分累计（个）</th>
            <th>消费积分累计（个）</th>
            <th>服务积分累计（个）</th>
            <th>操作</th>
          </tr>
          <!-- <tr v-for="(item, index) in sourceTypes">
            <td>{{item.title}}</td>
            <td>{{filterCashOrBonus(item.addSource, 'cash')}}</td>
            <td>{{item.addSource === ruleListData.cash[index - 1]}}</td>
            <td>{{filterCashOrBonus(item.addSource, '')}}</td>
            <td><span @click="settlementBefore()" v-if="index === sourceTypes.length - 1">结算</span></td>
          </tr> -->
          <template v-if="ruleListData.cash">
            <tr v-for="index in ruleListData.cash.length">
              <td v-if="ruleListData.cash && ruleListData.cash[index - 1]">{{ruleListData.cash[index - 1].addSource | filterAddSource}}</td>
             <!--  <td>{{ruleListData.cash[index - 1].cashPointsSum | filterMoney}}</td>
              <td>{{ruleListData.bonus[index - 1].bonusPointsSum | filterMoney}}</td> -->
              <td>
                <template v-if="ruleListData.cash && ruleListData.cash[index - 1]">{{ruleListData.cash[index - 1].cashPointsSum | filterMoney}}</template>
                <template v-else>{{'' | filterEmpty}}</template>
              </td>
              <td>
                <template v-if="ruleListData.bonus && ruleListData.bonus[index - 1]">{{ruleListData.bonus[index - 1].bonusPointsSum | filterMoney}}</template>
                <template v-else>{{'' | filterEmpty}}</template>
              </td>
              <td>
                <template v-if="ruleListData.service && ruleListData.service[index - 1]">{{ruleListData.service[index - 1].servicePointsSum | filterMoney}}</template>
                <template v-else>{{'' | filterEmpty}}</template>
              </td>
              <td><span @click="settlementBefore()" v-if="index === ruleListData.cash.length">结算</span></td>
            </tr>
          </template>
        </table>
        <no-data v-if="!ruleListData.cash || !ruleListData.cash.length"></no-data>
      </div>
    </template>

    <template slot="other">
      <!-- 芯片销售收益 -->
      <el-dialog title="结算芯片销售收益" :visible.sync="settlementVisible" width="600px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
          <div class="chip-earn ta-l">
            <el-form-item label="会员手机：">{{detailsData.customerPhone | filterEmpty}}</el-form-item>
            <el-form-item label="会员身份：">{{detailsData.disRuleName | filterEmpty}}</el-form-item>
            <el-form-item label="芯片收益值：">{{detailsData.chipRate | filterEmpty('个')}}</el-form-item>
            <el-form-item label="销售数量：" prop="number">
              <el-input v-model="ruleForm.number" placeholder="输入正整数"></el-input>
              <span>个</span>
            </el-form-item>
            <el-form-item label="上传图标：" prop="uploadFiles">
              <el-upload class="fl-l pos-r" 
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
            </el-form-item>
            <el-form-item label="结算通用积分：">{{(detailsData.chipRate * ruleForm.number) | numToFixed}}</el-form-item>
          </div>
          <el-button @click="settlementVisible = false">取 消</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="settlementHadnle('ruleForm')">确 定</el-button>
        </el-form>
      </el-dialog>
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    // 验证销售数量
    let validateNumber = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入销售数量'))
      let reg = /^[0-9]*$/gi
      if (!value.toString().match(reg)) return callback('请输入正确的销售数量')
      callback()
    }
    return {
      confirmLoading: false,    // 确定loading
      // 审核结果
      formData: {
        checkResult: '2',        // 审核结果
        description: ''
      },
      detailsData: {},          // 详情数据
      ruleListData: [],         // 结算累计
      uploadFiles: '',          // 图片相对路径
      fileList: [],             // 图片集合
      fxUserInfo: {},           // 用户信息
      storeData: {},            // 商品id
      passVisible: false,       // 审核弹窗
      faceUrl: '',              // 上传图标地址
      isUploading: false,       // 上传中
      ruleForm: {
        number: ''
      },
      rules: {
        number: [{ required: true, validator: validateNumber, trigger: 'blur' }],

        // 上传图标
        uploadFiles: [{ required: true, message: '请上传图标', trigger: 'change' }]
      },
      sourceTypes: [
        {
          addSource: 10,
          title: '分销派送'
        },
        {
          addSource: 12,
          title: '商品收益'
        },
        {
          addSource: 11,
          title: '全球加权分红'
        },
        {
          addSource: 13,
          title: '办公场地补贴'
        },
        {
          addSource: 14,
          title: '芯片销售收益'
        }
      ],
      settlementVisible: false     // 芯片销售收益弹窗
    }
  },

  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/admin/terminal?clientType=1&token=' + this.fxUserInfo.token          // 上传图片
    }
  },

  mounted () {
    this.storeData = JSON.parse(localStorage.getItem('OPEN_STORE'))
    this.fxUserInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.detailsData = JSON.parse(localStorage.getItem('distributionBalanceManageData')) || {}
    this.getListData()
  },

  methods: {
    /**
    * 获取列表数据
    */
    getListData () {
      this.$http.post('@ROOT_API/settleManageController/getSettlement', {
        customerId: this.detailsData.customerId
      }).then(res => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.ruleListData = resData.data
      })
    },

    /**
     * 提交结算前操作
     */
    settlementBefore (item) {
      this.settlementVisible = true
      this.settlementData = item
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
      this.ruleForm.uploadFiles = res.data          // 相对路径
    },

    /**
     * 文件被移除
     */
    removeHandle (file, fileList) {
      this.ruleForm.uploadFiles = ''      // 移除的时候清空对象
      this.fileList = []
    },

    /**
     * 过滤显示
     */
    filterCashOrBonus (key, type) {
      let res = '--'
      if (!this.ruleListData.cash && !this.ruleListData.bonus) return res
      let filterObj = ''
      if (type === 'cash' && this.ruleListData.cash) {
        filterObj = this.ruleListData.cash.filter((row) => parseInt(row.addSource) === parseInt(key))
        if (filterObj[0]) res = filterObj[0].cashPointsSum
      } else {
        if (this.ruleListData.bonus) filterObj = this.ruleListData.bonus.filter((row) => row.addSource === key)
        if (filterObj[0]) res = filterObj[0].bonusPointsSum
      }
      return res
    },

    /**
     * 提交结算
     */
    settlementHadnle (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.confirmLoading = true
        this.$http.post('@ROOT_API/settleManageController/chipProfit', {
          accountId: this.detailsData.id,
          settleCashPoints: Math.round(this.detailsData.chipRate * this.ruleForm.number),
          paymentVoucher: this.ruleForm.uploadFiles
        }).then(res => {
          let resData = res.data
          if (resData.status !== '1') {
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
          this.ruleForm.number = ''
          this.fileList = []
          this.ruleForm.uploadFiles = ''
          this.settlementVisible = false
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

<style lang="less" scoped>
.balance-manage-wrap{

  .balance-manage-list{

    table{
      width: 100%;
      border: 1px;
      border-collapse: collapse;
      margin-bottom: 20px;

      td{
        font-size: 14px;
        padding: 10px;
        border: 1px solid #eee;
      }

      td:nth-child(odd) {
        width: 160px;
        text-align: right;
        border-right: none;
      }

      td:nth-child(even) {
        // color: #999;
        border-left: none;
      }

    }

    .balance-table{
      width: 100%;
      
      tr{
        th{
          font-weight: normal;
          line-height: 45px;
          background: #eee;
        }
        td{
          width: 200px;
          text-align: center;
          border: 1px solid #eee;
        }
      }
      
      tr:last-child{
        td:last-child{
          span{
            color: #56ADE8;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.balance-manage-wrap{

  .uploadHide{
    height: 70px;
    width: 70px;

    .el-upload-list__item{
      width: 70px;
      height: 70px;
    }
    .el-upload{
      display: none;
    }

    .el-upload-list__item:first-child{
      margin-top: 0;
    }
  }
  .el-dialog {

    .el-dialog__body {

      .chip-earn{
        border: 1px solid #eee;
        border-bottom: none;
        margin-bottom: 20px;

        .el-form-item{
          padding: 20px 0;
          margin-bottom: 0;
          border-bottom: 1px solid #eee;

          .el-input{
            width: 200px;
          }
        }
      }
      
      .el-upload{
        width: 70px;
        height: 70px;
        line-height: 70px;
      }

      .el-upload-list--picture-card .el-upload-list__item{
        width: 70px;
        height: 70px;
        margin-bottom: 0;
      }
    }
  }
}
</style>
