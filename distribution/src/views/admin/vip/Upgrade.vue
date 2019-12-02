<!-- 账户升级 -->
<template>
  <common-tpl class="vip-upgrade-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">

        <el-form :model="formData" class="" label-width="160px">
          <!-- 会员基本信息 -->
          <gray-title title="会员基本信息"></gray-title>
          <el-form-item label="推广大使手机：">
            {{detailsData.userPhone | filterEmpty}}
          </el-form-item>
          <el-form-item label="姓名：">
            {{detailsData.userName | filterEmpty}}
          </el-form-item>
          <el-form-item label="当前身份：">
            {{detailsData.rankName | filterEmpty}}
          </el-form-item>

          <gray-title title="升级内容"></gray-title>
          <el-form-item label="升级成为：">
            <el-select v-model="formData.rankId" placeholder="请选择" @change="rankIdChange">
              <el-option
                v-for="item in detailsData.rankList"
                :key="item.ruleId"
                :label="item.ruleName"
                :value="item.ruleId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item inline label='选择地区：' prop='address' class="address-wrap">
            <region-select :assignData="detailsData.region" @change="regionChange"
              v-if="formData.rankId === 4 || formData.rankId === 5" :showArea="showArea"></region-select>
            <span v-else>--</span>
          </el-form-item>
          <el-form-item label="服务费：">
            {{detailsData.upgradeAmount | filterEmpty}}
          </el-form-item>
          <el-form-item label="实际支付金额：">
            <el-input placeholder="输入整数,限20个字符" v-model="detailsData.realPayAmount"></el-input>
          </el-form-item>
          
          <el-form-item label="上传凭证：">
            <el-upload class="upload-picture fl-l pos-r"
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
            </el-upload>
          </el-form-item>

        </el-form>
      </div>
    </template>
    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" @click="handleSubmit()">提交审核</el-button>
    </template>
  </common-tpl>
</template>

<script>
  import RegionSelect from '@/components/utils/RegionSelect'

  export default {
    data () {
     //  校验0-100000
      let validateInt = (rule, value, callback) => {
        if (!value) return callback(new Error('不能为空'))
        if (value && (isNaN(value) || value < 0 || value > 100000 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制0~100000正整数'))
        callback()
      }
      return {
        loading: false,
        submitLoading: false,   // 确定loading
        pageType: 1,            // 页面类型 [1、详情，2、编辑]
        formData: {
          rankId: '',
          deductionType: 1,           // 抵扣类型
          upgradeId: '',              // 升级表id
          userId: '',                 // 上页面id
          deductionAmount: '',        // 抵扣金额
          deductionVoucher: '',       // 凭证
          deductionGoods: [],          // tableData
          imgs: []                     // 上传凭证
        },
        deductionAmount: [{required: true, validator: validateInt, trigger: 'blur'}],
        userId: '',                     // 上页面的id
        checkedRevenue: '',             // 已选择预计收益
        cashPoints: '',                 // cashPoints
        formKey: '',                    // formKey
        tableData: [],
        deductionList: [],
        dialogLoading: false,   // 弹窗loading
        deleteVisible: false,   // 取消分享弹窗
        infoVisible: false,     // 弹窗
        addVisible: false,      // 弹窗
        detailsData: {},        // 详情信息
        region: {
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
        rowData: {},            // 当前行信息
        pageData: {      // 分页数据
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        coverImgList: [],
        userInfo: {},
        showArea: false
      }
    },
    computed: {
      uploadUrl () {
        return this.$dm.ROOT_API + 'upload/uploadimg/admin/terminal?clientType=1&token=' + this.userInfo.token          // 上传图片
      }
    },
    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      this.userId = parseInt(this.$route.query.userId) || ''
      this.getListData()
    },

    methods: {
      /**
       * 获取详情数据
       */
      getListData () {
        this.$http.get('@ROOT_API/buyMemberAccountManageController/getUpgradeDetail', {params: {userId: this.userId}}).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.detailsData = resData.data
          this.detailsData.rankId = this.detailsData.rankList[0].rankId
          this.formData.upgradeId = resData.data.upgradeId
          this.rankIdChange(this.detailsData.rankId)
        })
      },

      rankIdChange (val) {
        this.detailsData.rankList.forEach(item => {
          if (item.rand === val) this.$set(this.detailsData, 'upgradeAmount', item.ruleDesc)
        })
        if (this.formData.rankId === 5) {
          this.showArea = false
        } else if (this.formData.rankId === 4) {
          this.showArea = true
        }
      },
      /**
       * 提交操作
       */
      handleSubmit () {
        this.submitLoading = true
        let params = {
          upgradeId: this.formData.upgradeId,
          rankId: this.formData.rankId,
          // upgradeAmount: '',
          paymentVoucher: this.ruleForm.uploadFiles,
          serviceAmount: this.detailsData.upgradeAmount,
          realPayAmount: this.detailsData.realPayAmount,
          agentZone: this.detailsData.region.area.name,
          agentZoneCode: this.detailsData.region.area.code,
          agentCity: this.detailsData.region.city.name,
          agentCityCode: this.detailsData.region.city.code,
          agentProvince: this.detailsData.region.province.name,
          agentProvinceCode: this.detailsData.province.area.code,
          userName: this.detailsData.userName,
          userPhone: this.detailsData.userPhone
        }
        this.detailsData.rankList.forEach(item => {
          if (item.rand === this.formData.rankId) {
            params.rankName = item.ruleName
          }
        })
        if (this.formData.rankId === 1 || this.formData.rankId === 2 || this.formData.rankId === 3) {
          params.agentRand = 1
        } else if (this.formData.rankId === 4) {
          params.agentRand = 2
        } else if (this.formData.rankId === 5) {
          params.agentRand = 3
        }
        this.$http.post('@ROOT_API/buyMemberAccountManageController/submitMemberUpgrade', params).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.$router.back()
        }).finally(() => {
          setTimeout(() => {
            this.submitLoading = false
          }, 1000)
        })
      },
      regionChange (results) {
        this.detailsData.region = results
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
    },
    components: { RegionSelect }
  }
</script>

<style lang="less" scoped>
  .vip-upgrade-wrap{
    .colorRed{
      color: red;
    }
    .admin-gray-title{
      margin-bottom: 0
    }

    .el-select, .el-input{
      width: 260px !important;
    }
  }
</style>
<style lang="less">
  .vip-upgrade-wrap{
    .circle{
      .el-input__inner{
        height: 36px;
        line-height: 36px;
        padding-right: 30px;
        border-radius: 50px;
      }
    }

    .el-icon-search{
      color: #999;
      width: 34px;
      line-height: 36px;
      font-size: 18px;
      cursor: pointer;
      right: 0;
      top: 0;
    }

    .el-icon-search:hover{
      color: #56ade8;
    }
    .region-select-wrap{
      display:inline !important;
      .el-select{
        width: 260px !important;
      }
    }
    .el-dialog {
      .el-dialog__body {
        padding-bottom: 0;
      }
    }
    .add-dialog .el-dialog .el-dialog__body {
      text-align: left;
    }

    .thumbnail-component-wrap{
      text-align: left;

    }
    .el-form-item{
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
</style>

