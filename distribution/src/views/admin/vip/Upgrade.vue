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
            <el-select v-model="detailsData.rankId" placeholder="请选择" @change="rankIdChange">
              <el-option
                v-for="item in detailsData.rankList"
                :key="item.rankId"
                :label="item.rankName"
                :value="item.rankId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item inline label='选择地区：' prop='address' class="address-wrap">
            <region-select :assignData="detailsData.region" @change="regionChange"></region-select>
          </el-form-item>
          <el-form-item label="服务费：">
            {{detailsData.upgradeAmount | filterEmpty}}
          </el-form-item>
          <el-form-item label="实际支付金额：">
            <el-input placeholder="输入整数,限20个字符" v-model="detailsData.amount"></el-input>
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
        rowData: {},            // 当前行信息
        pageData: {      // 分页数据
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        coverImgList: [],
        userInfo: {}
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
      // this.getListData()
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
          this.getListTableData()
          this.rankIdChange(this.detailsData.rankId)
        })
      },

      rankIdChange (val) {
        this.detailsData.rankList.forEach(item => {
          if (item.rankId === val) this.$set(this.detailsData, 'upgradeAmount', item.upgradeAmount)
        })
      },
      /**
       * 获取详情数据
       */
      getListTableData () {
        this.$http.get('@ROOT_API/buyMemberAccountManageController/getDeductionInfo', {params: {upgradeId: this.formData.upgradeId}}).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.detailsData.deductionAmountTotal = resData.data.deductionAmountTotal
          this.deductionList = resData.data.deductionList
        })
      },
      /**
       * 行内前操作
       */
      handleBefore (row, type) {
        this.rowData = row
        if (type === 'details') {
          this.$http.get('@ROOT_API/buyMemberAccountManageController/getDeductionDetailList', {
            params: {
              deductionId: this.rowData.deductionId
            }
          }).then((res) => {
            let resData = res.data
            if (parseInt(resData.status) !== 1) {
              this.$message({
                message: resData.msg,
                type: 'error',
                duration: 1500
              })
              this.tableData = []
              return false
            }
            this.infoVisible = true
            this.tableData = resData.data
          }).finally(() => {
            this.dialogLoading = false
          })
        } else {
          this.deleteVisible = true
        }
      },

      /**
       * 添加前操作
       */
      handleAddBefore () {
        this.formData.deductionAmount = ''
       // this.formData.phone = ''
        this.checkedRevenue = ''
        this.formData.imgs = []
        this.formKey = new Date().getTime()
        this.tableData = [{upgradeAmount: this.detailsData.upgradeAmount, deductionAmountTotal: this.detailsData.deductionAmountTotal}]
        this.$http.post('@ROOT_API//buyMemberAccountManageController/initDeductionInfo', {
          deductionType: this.formData.deductionType,
          userId: this.userId,
          phone: this.formData.phone
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
          if (this.formData.deductionType === 1) {
            this.cashPoints = resData.data.cashPoints
          } else {
            this.formData.deductionGoods = resData.data
            this.formData.deductionGoods.forEach(item => {
              this.$set(item, 'ifDeduction', false)
            })
          }
          this.addVisible = true
        }).finally(() => {
          this.dialogLoading = false
        })
      },
      /**
       * 删除操作
       */
      handleDelete () {
        this.$http.get('@ROOT_API/buyMemberAccountManageController/deleteDeductionInfo', {
          params: {deductionId: this.rowData.deductionId}
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
          this.deleteVisible = false
          this.getListTableData()
        }).finally(() => {
          this.dialogLoading = false
        })
      },
      /**
       * 商品图片上传成功
       */
      uploadImgSuccess (url, imgsList, type) {
        this.$set(this.formData, 'imgs', [{url: this.$Utils.filterImgUrl(url), img: url}])
      //  this.formKey = new Date().getTime()
        this.formData.deductionVoucher = url
      },
      /**
       * 商品图片删除
       */
      deleteImg (val, type) {
        this.formData.deductionVoucher = ''
      //  this.formKey = new Date().getTime()
      },
      /**
       * 打开添加弹框初始化数据
       */
      initData () {
        this.$nextTick(function () {
          // DOM 更新了
          this.resetForm('formData')
        })
        this.formData.deductionVoucher = ''
        this.formData.phone = ''
        this.formData.deductionType = 1
        this.formData.imgs = []
      },
      /**
       * 计算剩余通用积分
       */
      getIntegral (all) {
        let data = this.deductionList.filter(item => item.deductionType === 1)
        if (data.length) {
          let pointArr = data.map(item => item.deductionAmount)
          let deductionAmount = pointArr.reduce(function (prev, cur) {
            return prev + cur
          })
          return all - deductionAmount
        } else {
          return all
        }
      },
      /**
       * 获取已选择最大收益
       */
      getCheckedRevenue () {
        this.checkedRevenue = 0
        this.formData.deductionGoods.forEach(item => {
          if (item.ifDeduction) {
            this.checkedRevenue += parseInt(item.expectedProfit)
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].clearValidate()
      },
      deductionTypeChange () {
        this.formData.phone = ''
        this.handleAddBefore()
      },
      /**
       * 添加提交操作
       */
      submitFormData (formName) {
        this.$refs[formName].validate(valid => {
          if (!valid) return false
          this.submitLoading = true
          this.formData.userId = this.userId
          let total = this.formData.deductionType === 1 ? this.cashPoints : this.checkedRevenue
          let msg = this.formData.deductionType === 1 ? '不能大于剩余待扣金额和剩余通用积数' : '不能大于剩余待扣金额和预计最大收益'
          if (this.formData.deductionAmount > this.tableData[0].upgradeAmount - this.tableData[0].deductionAmountTotal || this.formData.deductionAmount > total) {
            this.$message({
              message: msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          let data = JSON.parse(JSON.stringify(this.formData))
          if (this.formData.deductionType === 2 || this.formData.deductionType === 3) {
            data.laveAmount = this.checkedRevenue ? this.checkedRevenue - data.deductionAmount : ''
            data.deductionGoods = data.deductionGoods.filter(item => item.ifDeduction === true)
            data.deductionGoods.forEach(item => {
              this.$delete(item, 'ifDeduction')
            })
          } else {
            data.deductionGoods = []
          }
          delete data.imgs
          this.$http.post('@ROOT_API/buyMemberAccountManageController/addDeductionInfo', data).then((res) => {
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
            this.deductionList = resData.data.deductionList
            this.detailsData.deductionAmountTotal = resData.data.deductionAmountTotal
            this.addVisible = false
          }).finally(() => {
            setTimeout(() => {
              this.submitLoading = false
            }, 1000)
          })
        })
      },
      /**
       * 提交操作
       */
      handleSubmit () {
        this.submitLoading = true
        this.$http.post('@ROOT_API//buyMemberAccountManageController/submitMemberUpgrade', {
          id: this.formData.upgradeId,
          rankId: this.detailsData.rankId
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

