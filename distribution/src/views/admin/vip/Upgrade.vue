<!-- 账户升级 -->
<template>
  <common-tpl class="vip-upgrade-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">

        <el-form :model="formData" class="" label-width="160px">
          <!-- 会员基本信息 -->
          <gray-title title="会员基本信息"></gray-title>
          <el-form-item label="会员手机：">
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
          <el-form-item label="升级金额：">
            {{detailsData.upgradeAmount | filterEmpty}}
          </el-form-item>

          <el-row type="flex" class="fw-n admin-gray-title" align="middle">
            <div>升级抵扣</div>
            <span style="margin-left: 20px;font-size: 16px;color: #4293e8;cursor: pointer;" class="" @click="handleAddBefore"><i class="el-icon-plus">&nbsp;添加抵扣</i></span>
          </el-row>
          <el-form-item label="累计抵扣金额：">
            {{detailsData.deductionAmountTotal | filterEmpty}}
          </el-form-item>
          <el-form-item label="" label-width="40px">
            <el-table :data="deductionList" style="width: 100%;margin-bottom: 60px;" v-loading="loading" element-loading-text="加载中">
              <el-table-column fixed prop="customerPhone" label="抵扣类型" min-width="120">
                <template slot-scope="scope">{{scope.row.deductionType | filterDeductionType}}</template>
              </el-table-column>
              <el-table-column prop="customerPhone" label="扣除账户手机" min-width="120">
                <template slot-scope="scope">{{scope.row.deductionUserPhone | filterEmpty}}</template>
              </el-table-column>
              <el-table-column prop="" label="抵扣售出金额" width="180">
                <template slot-scope="scope">{{scope.row.deductionSaleAmount | filterEmpty | filterMoney}}</template>
              </el-table-column>
              <el-table-column prop="ruleName" label="账户预计收益" min-width="120">
                <template slot-scope="scope">{{scope.row.expectedProfit | filterEmpty | filterMoney}}</template>
              </el-table-column>
              <el-table-column prop="region" label="实际抵扣金额" min-width="200">
                <template slot-scope="scope">{{scope.row.deductionAmount | filterEmpty | filterMoney}}</template>
              </el-table-column>
              <el-table-column prop="cardName" label="剩余未抵扣金额" min-width="120">
                <template slot-scope="scope">{{scope.row.laveAmount | filterEmpty | filterMoney}}</template>
              </el-table-column>
              <el-table-column prop="invitationName" label="操作" width="120">
                <template slot-scope="scope">
                  <el-dropdown class="d-b">
                    <div class="ta-c d-b el-dropdown-link">
                      <span class="d-b va-m">...</span>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="scope.row.deductionType !== 1">
                        <div @click="handleBefore(scope.row, 'details')"><i class="icon el-icon-view"></i>查看</div>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <div @click="handleBefore(scope.row, 'del')"><i class="icon el-icon-delete"></i>删除</div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
              <div slot="empty">
                <no-data></no-data>
              </div>
            </el-table>
          </el-form-item>

        </el-form>
      </div>
    </template>

    <template slot="other">
      <el-dialog title="删除抵扣" :visible.sync="deleteVisible" width="540px" @close="">
        <p>确认是否删除抵扣？</p><br/>
        <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">返 回</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleDelete">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="查看抵扣记录" :visible.sync="infoVisible" width="50%" @close="">
        <el-row type="flex" justify="space-between" style="margin-bottom: 20px;">
          <span>已选择预计收益：<span style="color: red;">{{rowData.expectedProfit}}</span></span>
          <span>抵扣金额：<span style="color: red;">{{rowData.deductionAmount}}</span></span>
          <span>剩余未抵扣收益：<span style="color: red;">{{rowData.laveAmount}}</span></span>
        </el-row>
        <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中" max-height="350">
          <el-table-column fixed prop="" label="待售商品" min-width="120">
            <template slot-scope="scope">{{scope.row.goodsName | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="" label="挂售金额" min-width="120">
            <template slot-scope="scope">{{scope.row.hangSellAmount | filterEmpty | filterMoney}}</template>
          </el-table-column>
          <el-table-column prop="" label="挂售时间" min-width="120">
            <template slot-scope="scope">{{scope.row.hangTime | filterDate}}</template>
          </el-table-column>
          <el-table-column prop="" label="预计收益" >
            <template slot-scope="scope">{{scope.row.expectedProfit | filterEmpty | filterMoney}}</template>
          </el-table-column>
          <el-table-column prop="" label="是否抵扣" >
            <template slot-scope="scope">{{scope.row.ifDeduction ? '是' : '否'}}</template>
          </el-table-column>
        </el-table>

        <el-form :model="formData" label-width="120px" v-if="rowData.deductionType === 3">
          <el-form-item label="上传抵扣凭证：">
            <thumbnail-component v-if="rowData.deductionType === 3" :empty="false" :styles="{width: '70px', height: '70px'}" :link="true"  :list="[{url: this.$Utils.filterImgUrl(rowData.deductionVoucher), img: rowData.deductionVoucher}]" style="width: 100%;height: 100%;" @change="deleteImg($event)">
            </thumbnail-component>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button type="" :loading="dialogLoading" @click="infoVisible = false">关 闭</el-button>
        </span>
      </el-dialog>

      <el-dialog title="添加抵扣" :visible.sync="addVisible" width="50%" @close="" class="add-dialog" @open="initData">
        <el-form :model="formData" class="" label-width="140px" ref="formData" :key="formKey">
          <el-form-item label="" label-width="20px">
            <el-table :data="tableData" style="width: 100%" >
              <el-table-column fixed prop="customerPhone" label="应抵扣金额" min-width="120">
                <template slot-scope="scope">{{scope.row.upgradeAmount | filterEmpty | filterMoney}}</template>
              </el-table-column>
              <el-table-column prop="customerPhone" label="已扣金额" min-width="120">
                <template slot-scope="scope">{{scope.row.deductionAmountTotal | filterEmpty | filterMoney}}</template>
              </el-table-column>
              <el-table-column prop="customerPhone" label="剩余待扣金额" min-width="120">
                <template slot-scope="scope">{{scope.row.upgradeAmount - scope.row.deductionAmountTotal | filterEmpty | filterMoney}}</template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="抵扣类型：">
            <el-radio-group v-model="formData.deductionType" @change="deductionTypeChange">
              <el-radio :label="1">账户通用积分抵扣</el-radio>
              <el-radio :label="2">账户买卖仓预计收益抵扣</el-radio>
              <el-radio :label="3">跨账户买卖仓预计收益抵扣</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="formData.deductionType === 1">
            <el-form-item label="剩余通用积分：">
              {{getIntegral(cashPoints) | filterEmpty('个')}}
            </el-form-item>
          </template>

          <el-form-item label="已选择预计收益：" v-if="formData.deductionType === 2">
            <span :class="{colorRed: checkedRevenue}">{{checkedRevenue | filterEmpty | filterMoney}}</span><span v-show="checkedRevenue">元</span>
          </el-form-item>

          <template v-if="formData.deductionType === 3">
            <el-row type="flex" justify="space-between" class="circle">
              <el-form-item label="" label-width="20px">
                <div class="">
                  <el-input v-model="formData.phone" placeholder="请输入会员手机号" @keyup.enter.native="handleAddBefore"></el-input>
                  <i class="ta-c pos-a el-icon-search" @click="handleAddBefore"></i>
                </div>
              </el-form-item>
              <el-form-item label="已选择预计收益：">
                <span :class="{colorRed: checkedRevenue}">{{checkedRevenue | filterEmpty | filterMoney}}</span><span v-show="checkedRevenue">元</span>
              </el-form-item>
            </el-row>
          </template>

          <template v-if="formData.deductionType !== 1">
            <el-form-item label="" label-width="20px">
              <el-table :data="formData.deductionGoods" style="width: 100%" max-height="250" v-loading="loading" element-loading-text="加载中">
                <el-table-column fixed prop="" label="待售商品" min-width="120">
                  <template slot-scope="scope">{{scope.row.goodsName | filterEmpty}}</template>
                </el-table-column>
                <el-table-column prop="" label="挂售金额" min-width="120">
                  <template slot-scope="scope">{{scope.row.hangSellAmount | filterEmpty | filterMoney}}</template>
                </el-table-column>
                <el-table-column prop="" label="挂售时间" min-width="120">
                  <template slot-scope="scope">{{scope.row.hangTime | filterDate}}</template>
                </el-table-column>
                <el-table-column prop="" label="预计收益" >
                  <template slot-scope="scope">{{scope.row.expectedProfit | filterEmpty | filterMoney}}</template>
                </el-table-column>
                <el-table-column prop="" label="是否抵扣" >
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.ifDeduction" @change="getCheckedRevenue"></el-checkbox>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </template>

          <el-form-item label="上传抵扣凭证：" v-if="formData.deductionType === 3" prop="imgs" :rules="{required: true, type: 'array', message: '不能为空'} ">
            <thumbnail-component :empty="false" :styles="{width: '70px', height: '70px'}" :link="true" del :auto-delete="true" :list="formData.imgs" style="width: 100%;height: 100%;" @change="deleteImg($event)">
              <template slot="other">
                <upload-component :styles="{width: '70px', height: '70px'}" @success="uploadImgSuccess"  v-if="formData.imgs.length === 0"></upload-component>
              </template>
            </thumbnail-component>
          </el-form-item>

          <el-form-item label="输入抵扣金额：" prop="deductionAmount" :rules="deductionAmount" style="margin-top: 20px;" :key="formKey">
            <el-input v-model.number="formData.deductionAmount" placeholder="0-100000正整数"></el-input>
          </el-form-item>

          <el-form-item label="剩余未抵扣收益：" v-if="formData.deductionType !== 1">
            {{checkedRevenue ? checkedRevenue - formData.deductionAmount : '' | filterEmpty('元')}}
            <span v-if="formData.deductionType !== 1" class="colorRed" style="margin-left: 20px;">该金额将以通用积分形式保留在被抵扣的账户中</span>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">关 闭</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="submitFormData('formData')">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" @click="handleSubmit()">提交审核</el-button>
    </template>
  </common-tpl>
</template>

<script>
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
        }
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
      }
    }
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

