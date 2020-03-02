<template>
  <!-- 终端-终端采购-采购清单 -->
  <div class="detail-wrap">
    <div class="content-wrap">
      <!-- 采购总量统计 -->
      <div class="purchase-statistic-wrap">
        <!-- 标题 -->
        <div class="title-wrap">
          <span>采购总量统计</span>
        </div>
        <!-- 表格 -->
        <el-table :data="topTableData">
          <el-table-column label="屏幕款式">
            <template slot-scope="props">
              <p>{{ props.row.screenStyle | selectFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column label="尺寸（寸）">
            <template slot-scope="props">
              <p>{{ props.row.screenSize | selectFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column label="屏幕宽高（cm）">
            <template slot-scope="props">
              <p>{{ props.row.screenWideHigh | selectFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column label="当前设备总数">
            <template slot-scope="props">
              <p>{{ props.row.stockCount }}</p>
            </template>
          </el-table-column>
          <el-table-column label="待采购数量">
            <template slot-scope="props">
              <p>{{ props.row.waitForpurchase }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 采购管理 -->
      <div class="purchase-management-wrap">
        <!-- 标题 -->
        <div class="title-wrap">
          <span>采购管理</span>
        </div>
        <!-- 搜索 -->
        <div class="search-wrap">
          <el-form :inline="true" :model="searchData">
            <el-form-item>
              <el-select v-model="searchData.purchaseStatus" placeholder="请选择采购状态" clearable>
                <el-option label="待采购" :value="1"></el-option>
                <el-option label="采购中" :value="3"></el-option>
                <el-option label="已采购" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间">
              <el-date-picker type="date" v-model="searchData.beginTime" value-format="yyyy-MM-dd" placeholder="开始时间" clearable></el-date-picker>
              <span class="cut-line"></span>
              <el-date-picker type="date" v-model="searchData.endTime" value-format="yyyy-MM-dd" placeholder="结束时间" clearable></el-date-picker>
            </el-form-item>
            <el-button class="search-btn" icon="el-icon-search" @click="currentPage = 1,searchData.pageNum = 1, searchData.pageNum = 1, getPurchaseManagementList()"></el-button>
          </el-form>
          <el-button class="add-purchase-button" @click="addPurchaseOrderPre">
            <i class="el-icon-plus"></i>
            添加采购清单
          </el-button>
        </div>
        <!-- 表格 -->
        <el-table :data="purchaseManagementList">
          <el-table-column label="采购单名称">
            <template slot-scope="props">
              <p>{{ props.row.orderName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="申请人">
            <template slot-scope="props">
              <p>{{ props.row.creatorName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="屏幕款式">
            <template slot-scope="props">
              <p>{{ props.row.screenStyle | selectFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column label="尺寸(寸)">
            <template slot-scope="props">
              <p>{{ props.row.screenSize | selectFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column label="屏幕宽高(cm)">
            <template slot-scope="props">
              <p>{{ props.row.screenWideHigh | selectFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column label="需采购数量(台)">
            <template slot-scope="props">
              <p>{{ props.row.needAmount }}</p>
            </template>
          </el-table-column>
          <el-table-column label="已采购数量(台)">
            <template slot-scope="props">
              <p>{{ props.row.alreadyAmount }}</p>
            </template>
          </el-table-column>
          <el-table-column label="采购单生成时间">
            <template slot-scope="props">
              <p>{{ props.row.auditTime | dateFilter('YYYY-MM-DD HH:mm:ss')}}</p>
            </template>
          </el-table-column>
          <el-table-column label="采购状态">
            <template slot-scope="props">
              <p>{{ props.row.purchaseStatus | purchaseStatusFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="props">
              <span v-if="props.row.purchaseStatus === 2">-/-</span>
              <el-button v-if="props.row.purchaseStatus !== 4 && props.row.purchaseStatus !== 2" @click="finishPurchase(props.row.id)" class="finish-purchase-button button-group">完成采购</el-button>
              <el-button v-if="props.row.purchaseStatus === 4" @click="purchaseDetail(props.row.id)" class="purchase-detail-button button-group">采购详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <!--<div class="pagination-wrap" v-show="total">
          <span @click="toHomePage">首页</span>
          <span @click="toPrePage">上一页</span>
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            :page-count="total"
            @current-change="changePage">
          </el-pagination>
          <span @click="toNextPage">下一页</span>
          <span @click="toEndPage">末页</span>
        </div>-->
      </div>
    </div>
    <!-- 分页器 -->
    <div class="pagination-wrap" v-show="total">
      <!--<span @click="toHomePage">首页</span>
      <span @click="toPrePage">上一页</span>-->
      <el-pagination
        layout="prev, pager, next, jumper"
        :current-page.sync="searchData.pageNum"
        :page-count="total"
        @current-change="changePage">
      </el-pagination>
      <!--<span @click="toNextPage">下一页</span>
      <span @click="toEndPage">末页</span>-->
    </div>
    <!-- 添加采购清单弹窗 -->
    <el-form :model="applicantForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
      <el-dialog title="添加采购清单" :visible.sync="addPurchaseOrderDialogVisible" class="addpurchase-popup">
        <div class="dialog-body_column baseForm">
          <el-form-item label="采购单名称" prop="orderName" label-position="left">
            <el-input v-model="applicantForm.orderName" placeholder="限40个字符以内，不含特殊字符" clearable></el-input>
          </el-form-item>
        </div>
        <div class="dialog-body_column baseForm">
          <el-form-item label="申请人" prop="applicant" label-position="left">
            <el-input v-model="applicantForm.applicant" placeholder="请输入申请人姓名（20个字符以内）" clearable></el-input>
          </el-form-item>
        </div>
        <div class="dialog-body_column">
          <span class="column-title"><i>*</i>选择款式规格</span>
          <div class="select-wrap">
            <div class="select-header">
              <span class="screenstyle-title">屏幕款式</span>
              <span class="screensize-title">屏幕尺寸</span>
              <span class="screencolumn-title">栏数</span>
              <span class="screenwidthheight-title">屏幕宽高</span>
              <span class="needamount-title">数量</span>
            </div>
            <div class="select-body" v-for="(item, index) in applicantForm.adminTerminalOrderStyleList" :key="index">
             <el-form-item label-width= "0px" :prop="'adminTerminalOrderStyleList.' + index + '.screenStyle'"  :rules="{required: true,message: screenSize.length > 0 ? '请选择屏幕款式' : '请在设备属性管理中，添加屏幕款式值才能选择', trigger: 'change'}">
                <el-select v-model="item.screenStyle" clearable>
                  <!-- <el-option label="落地式" :value="1"></el-option>
                  <el-option label="橱窗式" :value="2"></el-option>
                  <el-option label="镜面式" :value="3"></el-option>
                  <el-option label="悬挂式" :value="4"></el-option> -->
                   <el-option
                        v-for="item in screenStyle"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width= "0px" :prop="'adminTerminalOrderStyleList.' + index + '.screenSize'"  :rules="{required: true, message: screenSize.length > 0 ? '请选择屏幕尺寸' : '请在设备属性管理中，添加屏幕尺寸值才能选择', trigger: 'change'}">
                <el-select v-model="item.screenSize" clearable>
                  <!-- <el-option label="50寸" :value="1"></el-option>
                  <el-option label="60寸" :value="2"></el-option> -->
                   <el-option
                        v-for="item in screenSize"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width= "0px" :prop="'adminTerminalOrderStyleList.' + index + '.screenColumn'"  :rules="{required: true, message: screenNum.length > 0 ? '请选择屏幕栏数' : '请在设备属性管理中，添加屏幕栏数值才能选择', trigger: 'change'}">
                <el-select v-model="item.screenColumn" clearable>
                  <!-- <el-option label="一栏" :value="1"></el-option>
                  <el-option label="二栏" :value="2"></el-option>
                  <el-option label="三栏" :value="3"></el-option>
                  <el-option label="四栏" :value="4"></el-option>
                  <el-option label="五栏" :value="5"></el-option> -->
                  <el-option
                    v-for="item in screenNum"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width= "0px" :prop="'adminTerminalOrderStyleList.' + index + '.screenWideHigh'"  :rules="{required: true, message: screenWidHeight.length > 0 ? '请选择屏幕宽高' : '请在设备属性管理中，添加屏幕宽高值才能选择', trigger: 'change'}">
                <el-select v-model="item.screenWideHigh" clearable>
                    <el-option
                        v-for="item in screenWidHeight"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  <!-- <el-option label="74.8 * 132.9" :value="1"></el-option>
                  <el-option label="132.9 * 74.8" :value="2"></el-option> -->
                </el-select>
              </el-form-item>
              <el-form-item label-width= "0px" :prop="'adminTerminalOrderStyleList.' + index + '.needAmount'"  :rules="[{required: true, validator: validate3, trigger: 'blur'}]">
                <el-input v-model.number="item.needAmount" placeholder="请输入整数（1-1000）" type="text"></el-input>
              </el-form-item>
              <button class="minus-one" @click="removeDomain(item)" v-if="index>0"></button>
              <button class="plus-one" @click="addDomain" v-if="index<=0"></button>
            </div>

          </div>
          <div class="button-group">
            <button class="confirm-button" @click="addPurchaseOrder('ruleForm')">确定</button>
            <button class="cancel-button" @click="addPurchaseOrderDialogVisible = false">取消</button>
          </div>
        </div>
      </el-dialog>
    </el-form>
    <!-- 完成采购弹窗 -->
    <el-dialog title="完成采购" :visible.sync="finishPurchaseDialogVisible" class="finishpurchase-popup">
      <div class="dialog-body_column">
        <span class="prompt-info">确认已完成以下设备的采购</span>
      </div>
      <div class="dialog-body_column">
        <el-table :data="finishPurchaseOrder">
          <el-table-column label="款式">
            <template slot-scope="props">
              <p>{{ props.row.screenStyle | selectFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column label="屏幕尺寸">
            <template slot-scope="props">
              <p>{{ props.row.screenSize | selectFilter}}</p>
            </template>
          </el-table-column>
          <el-table-column label="屏幕宽高">
            <template slot-scope="props">
              <p>{{ props.row.screenWideHigh | selectFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column label="需采购数量（台）">
            <template slot-scope="props">
              <p>{{ props.row.needAmount }}</p>
            </template>
          </el-table-column>
          <el-table-column label="已采购数量">
            <template slot-scope="props">
              <p>{{ props.row.alreadyAmount }}</p>
            </template>
          </el-table-column>
          <el-table-column label="剩余采购量">
            <template slot-scope="props">
              <p>{{ props.row.needAmount - props.row.alreadyAmount }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="dialog-body_column">
        <span class="column-title">输入采购量</span>
        <span class="colon-sign">:</span>
        <el-input v-model.number="alreadyAmount" placeholder="输入正整数" clearable></el-input>
        <span class="prompt-msg">小于或等于剩余采购量</span>
      </div>
      <div class="button-group">
        <button class="confirm-button" @click="confirmFinishPurchase()">确定</button>
        <button class="cancel-button" @click="finishPurchaseDialogVisible = false">取消</button>
      </div>
    </el-dialog>
    <!-- 采购详情弹窗 -->
    <el-dialog title="采购详情" :visible.sync="purchaseDetailDialogVisible" class="purchasedetail-popup">
      <div class="dialog-body_column">
        <span class="prompt-info">确认已完成以下设备的采购</span>
      </div>
      <div class="dialog-body_column">
        <el-table :data="finishPurchaseOrder">
          <el-table-column label="款式">
            <template slot-scope="props">
              <p>{{ props.row.screenStyle | selectFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column label="屏幕尺寸">
            <template slot-scope="props">
              <p>{{ props.row.screenSize | selectFilter}}</p>
            </template>
          </el-table-column>
          <el-table-column label="屏幕宽高">
            <template slot-scope="props">
              <p>{{ props.row.screenWideHigh | selectFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column label="需采购数量(台)">
            <template slot-scope="props">
              <p>{{ props.row.needAmount }}</p>
            </template>
          </el-table-column>
          <el-table-column label="已采购数量(台)">
            <template slot-scope="props">
              <p>{{ props.row.alreadyAmount }}</p>
            </template>
          </el-table-column>
          <el-table-column label="剩余采购量">
            <template slot-scope="props">
              <p>{{ props.row.needAmount - props.row.alreadyAmount }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="button-group">
        <button class="confirm-button" @click="purchaseDetailDialogVisible = false">确定</button>
        <button class="cancel-button" @click="purchaseDetailDialogVisible = false">取消</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      var validate1 = (rule, value, callback) => {
        var pattern = /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im
        if (!value) return callback(new Error('请填写采购单名称'))
        if (pattern.test(value)) return callback(new Error('采购单名称40字符以内,不含特殊字符'))
        if (value.length > 40) return callback(new Error('采购单名称40字符以内'))
        callback()
      }
      var validate2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请填写申请人'))
          return false
        } if (value.length > 20) {
          callback(new Error('申请人20字符以内'))
          return false
        } else {
          callback()
        }
      }
      var validate3 = (rule, value, callback) => {
        var re = /^[0-9]+$/
        if (!value) {
          callback(new Error('请输入数量'))
          return false
        } if (!re.test(value)) {
          callback(new Error('数量为正整数'))
          return false
        } if (value > 1000) {
          callback(new Error('数量为(1-1000)'))
          return false
        } else {
          callback()
        }
      }
      return {
        token: '',
        topTableData: [],
        purchaseManagementList: [],
        searchData: {
          purchaseStatus: null,
          beginTime: null,
          endTime: null,
          pageNum: 1,
          pageSize: 10
        },
        applicantForm: {
          isManager: 1,
          orderName: null,
          applicant: null,
          adminTerminalOrderStyleList: [
            {
              screenStyle: null,
              screenSize: null,
              screenColumn: null,
              screenWideHigh: null,
              needAmount: null
            }
          ]
        },
        validate3: validate3,
        rules: {
          orderName: [
            { required: true, validator: validate1, trigger: 'blur' }
          ],
          applicant: [
            { required: true, validator: validate2, trigger: 'blur' }
          ],
          screenStyle: [
            { required: true, message: '请选择应用系统', trigger: 'change' }
          ]
        },
        orderDetail: null,
        alreadyAmount: null,
        addPurchaseOrderDialogVisible: false,
        finishPurchaseDialogVisible: false,
        purchaseDetailDialogVisible: false,
        finishPurchaseOrder: [],
        currentPage: 1,
        total: null,
        validateGuardOfOrderName: false,
        validateGuardOfApplicant: false,
        validateGuardOfScreenStyle: false,
        validateGuardOfScreenSize: false,
        validateGuardOfScreenColumn: false,
        validateGuardOfScreenWideHigh: false,
        validateGuardOfNeedAmount: false,
        screenStyle: '',
        screenSize: '',
        screenNum: '',
        screenWidHeight: ''
      }
    },
    filters: {
      screenSize: function (value) {
        let statusArr = ['50寸', '60寸']
        return statusArr[value - 1]
      },
      screenWideHighFilter: function (value) {
        let statusArr = ['74.8 * 132.9', '132.9 * 74.8']
        return statusArr[value - 1]
      }
    },
    mounted () {
      this.searchData.pageNum = parseInt(this.$route.query.page) || 1
      /**
       * 获取下拉属性
      */
      this.screenStyle = JSON.parse(localStorage.getItem('screenStyle'))
      this.screenSize = JSON.parse(localStorage.getItem('screenSize'))
      this.screenNum = JSON.parse(localStorage.getItem('screenNum'))
      this.screenWidHeight = JSON.parse(localStorage.getItem('screenWidHeight'))

      let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
      this.token = adminInfo.token
      this.getStaticDataByScreenStype()
      this.getPurchaseManagementList()
    },
    methods: {
      /**
       * 1.终端-终端采购-采购清单-采购总量统计
       */
      getStaticDataByScreenStype () {
        this.$http.get('@ROOT_API/terminalOrderManage/getPurchaseStaticDataByScreenStyle')
          .then((res) => {
            if (res.data.status === '1') {
              this.topTableData = res.data.data
            } else {
              this.$message.error(res.data.msg || $t('common.errorMsg'))
            }
          })
      },

      /**
       * 2.终端-终端采购-采购清单-采购管理列表
       */
      getPurchaseManagementList () {
        this.$router.push({query: {page: this.searchData.pageNum}})
        let data = this.searchData
        this.$http.post('@ROOT_API/terminalOrderManage/orderStylelist', data)
          .then((res) => {
            if (res.data.status === '1') {
              this.purchaseManagementList = res.data.data.list
              this.total = Math.ceil(res.data.data.total / this.searchData.pageSize)
            } else {
              this.$message.error(res.data.msg)
            }
          })
      },

      /**
       * 3.添加采购清单
       */
      addDomain () {
        this.applicantForm.adminTerminalOrderStyleList.push({
          screenStyle: null,
          screenSize: null,
          screenColumn: null,
          screenWideHigh: null,
          needAmount: null
        })
      },
      removeDomain (item) {
        let index = this.applicantForm.adminTerminalOrderStyleList.indexOf(item)
        if (index !== -1) {
          this.applicantForm.adminTerminalOrderStyleList.splice(index, 1)
        }
      },
      addPurchaseOrderPre () {
        this.addPurchaseOrderDialogVisible = true
        this.applicantForm = {
          isManager: 1,
          orderName: null,
          applicant: null,
          adminTerminalOrderStyleList: [
            {
              screenStyle: null,
              screenSize: null,
              screenColumn: null,
              screenWideHigh: null,
              needAmount: null
            }
          ]
        }
        this.validateGuardOfOrderName = false
        this.validateGuardOfApplicant = false
        this.validateGuardOfScreenStyle = false
        this.validateGuardOfScreenSize = false
        this.validateGuardOfScreenColumn = false
        this.validateGuardOfScreenWideHigh = false
        this.validateGuardOfNeedAmount = false
      },
      addPurchaseOrder (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = this.applicantForm
            this.$http.post('@ROOT_API/terminalOrderManage/add', data)
              .then((res) => {
                if (res.data.status === '1') {
                  this.$message.success(res.data.msg)
                  this.getPurchaseManagementList()
                } else {
                  this.$message.error(res.data.msg)
                }
              })
            this.addPurchaseOrderDialogVisible = false
          } else {
            return false
          }
        })
      },

      /**
       * 4.完成采购
       */
      getOrderDetail (id) {
        this.finishPurchaseOrder = []
        this.purchaseManagementList.forEach(item => {
          if (item.id === id) {
            this.finishPurchaseOrder.push(item)
          }
        })
      },
      finishPurchase (orderId) {
        this.finishPurchaseDialogVisible = true
        this.alreadyAmount = null
        localStorage.setItem('id', orderId)
        this.getOrderDetail(orderId)
      },
      confirmFinishPurchase () {
        let id = parseInt(localStorage.getItem('id'))
        let orderNeedAmount = this.finishPurchaseOrder[0].needAmount
        let orderAlreadyAmount = this.finishPurchaseOrder[0].alreadyAmount
        let alreadyAmount = this.alreadyAmount
        let pattern = /^[1-9]\d*$/g
        if (!pattern.test(alreadyAmount)) {
          this.$message.error('输入的数字不合法，请重新输入。')
        } else if (alreadyAmount > (orderNeedAmount - orderAlreadyAmount)) {
          this.$message.error('您输入的采购量需要小于或等于剩余采购量')
        } else {
          this.$http.post('@ROOT_API/terminalOrderManage/finish', {
            'id': id,
            'alreadyAmount': alreadyAmount
          }).then((res) => {
            if (res.data.status === '1') {
              this.$message.success(res.data.msg)
              this.getPurchaseManagementList()
            } else {
              this.$message.error(res.data.msg)
            }
          })
          this.finishPurchaseDialogVisible = false
          localStorage.removeItem('id')
        }
      },

      /**
       * 5.采购详情
       */
      purchaseDetail (orderId) {
        this.purchaseDetailDialogVisible = true
        this.getOrderDetail(orderId)
      },

      /**
       * 6.分页
       */
      changePage (val) {
        this.searchData.pageNum = val
        this.getPurchaseManagementList()
      },
      toHomePage () {
        this.currentPage = 1
      },
      toEndPage () {
        this.currentPage = this.total
      },
      toPrePage () {
        this.currentPage = --this.searchData.pageNum
      },
      toNextPage () {
        this.currentPage = ++this.searchData.pageNum
      }
    }
  }
</script>

<style lang="less" scoped>
  .detail-wrap {
    .content-wrap {
      height: 100%;
      padding: 0 40px;
      border-radius: 4px;
      background-color: rgb(255, 255, 255);
      box-shadow: 0 2px 9px 0.8px rgb(238, 241, 245);
      overflow: hidden;
      .purchase-statistic-wrap, .purchase-management-wrap {
        .title-wrap {
          font-size: 16px;
          color: rgb(51, 51, 51);
        }
        .title-wrap::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 18px;
          margin-right: 10px;
          background-color: rgb(51, 113, 155);
          position: relative;
          top: 3px;
        }
      }
      /* 采购总量统计 */
      .purchase-statistic-wrap {
        margin-top: 50px;
      }
      /* 采购管理 */
      .purchase-management-wrap {
        margin-top: 60px;
        height: 100%;
        /* 搜索 */
        .search-wrap {
          margin-top: 22px;
        }
        /* 分页器 */
        /*.pagination-wrap {
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          color: rgb(102, 102, 102);
          position: absolute;
          bottom: -70px;
          left: 0;
          right: 0;
          margin: auto;
          span {
            display: inline-block;
            width: 60px;
            height: 30px;
            line-height: 30px;
            background-color: rgb(255, 255, 255);
            border: 1px solid rgb(221, 221, 221);
            box-sizing: border-box;
            cursor: pointer;
            font-size: 14px;
            color: rgb(102, 102, 102);
          }
          span:first-child {
            margin-right: 6px;
          }
          span:last-child {
            margin-left: 6px;
          }
        }*/
      }
    }
  }
</style>

<style lang="less">
  .detail-wrap {
    .baseForm{
      .el-form-item{
        margin-bottom:0;
      }
    }
    /* 表格 */
    .purchase-statistic-wrap, .purchase-management-wrap {
      .el-table {
        margin-top: 20px;
        border: 1px solid rgb(221, 221, 221);
        border-bottom: 0;
        .el-table__header-wrapper {
          table th {
            height: 60px;
            background-color: rgb(248, 248, 248);
            .cell {
              text-align: center;
              font-size: 14px;
              color: rgb(51, 51, 51);
            }
          }
        }
        .el-table__body-wrapper {
          table td {
            height: 60px;
            background-color: rgb(255, 255, 255);
            .cell {
              text-align: center;
              font-size: 14px;
              color: rgb(102, 102, 102);
            }
          }
        }
        td {
          padding: 0;
        }
      }
    }
    /* 采购管理 */
    .purchase-management-wrap {
      /* 搜索 */
      .search-wrap {
        .el-form {
          float: left;
          .el-form-item {
            margin: 0;
            /* 下拉框 */
            .el-select {
              .el-input {
                width: 190px;
                height: 36px;
                input {
                  height: inherit;
                  border-radius: 4px;
                  background-color: rgb(248, 248, 248);
                  border: 1px solid rgb(221, 221, 221);
                }
              }
            }
            /* 日期选择 */
            .el-date-editor {
              width: 156px;
              height: 36px;
              input {
                height: inherit;
                border-radius: 4px;
                background-color: rgb(255, 255, 255);
                border: 1px solid rgb(221, 221, 221);
              }
            }
            /* 分割线 */
            .cut-line {
              display: inline-block;
              width: 19px;
              height: 1px;
              background-color: rgb(221, 221, 221);
              position: relative;
              top: -4px;
            }
          }
          .el-form-item:nth-of-type(1) {
            margin-right: 20px;
          }
          /* 搜索按钮 */
          .search-btn {
            width: 70px;
            height: 36px;
            font-size: 20px;
            padding: 0;
            position: relative;
            top: 2px;
            margin-left: 18px;
            .el-icon-search {
              position: relative;
              left: -2px;
            }
          }
          .el-button:focus, .el-button:hover {
            color: rgb(51, 113, 155);
            border-color: rgb(51, 113, 155);
            background-color: transparent;
          }
        }
        /* 添加采购单按钮 */
        .add-purchase-button {
          float: right;
          width: 130px;
          height: 36px;
          line-height: 36px;
          padding: 0;
          font-size: 14px;
          color: rgb(51, 113, 155);
          .el-icon-plus {
            color: rgb(51, 113, 155);
          }
        }
      }
      .search-wrap::after {
        content: '';
        display: block;
        clear: both;
      }
      /* 表格 */
      .el-table {
        margin-top: 40px;
        margin-bottom: 64px;
        /* 完成采购按钮 */
        .finish-purchase-button {
          color: rgb(121, 212, 11);
          border-color: rgb(121, 212, 11);
        }
        /* 采购详情按钮 */
        .purchase-detail-button {
          color: rgb(255, 149, 1);
          border-color: rgb(255, 149, 1);
        }
        .button-group {
          padding: 4px 10px;
          font-size: 14px;
          border-radius: 4px;
        }
      }
      /* 分页器 */
      /*.pagination-wrap {
        .el-pagination {
          display: inline-block;
          padding: 0;
          button {
            display: none;
          }
        }
      }*/
    }
    /* 添加采购清单弹窗 */
    .addpurchase-popup {
      .el-dialog {
        width: 870px;
        border-radius: 4px;
        .el-dialog__header {
          text-align: center;
          padding: 18px 15px;
          border-bottom: 1px solid rgb(240, 240, 240);
        }
        .el-dialog__body {
          padding: 0 0 136px 52px;
          .dialog-body_column {
            padding-top: 20px;
            .el-form-item__label{
              text-align:left;
            }
            .column-title {
              font-size: 16px;
              color: rgb(51, 51, 51);
              i{
                  color:#f56c6c;
                  margin-right:4px;
                  font-style:normal;
              }
            }
            .el-input {
              width: 280px;
              height: 30px;
              border-radius: 4px;
              input {
                height: inherit;
                background-color: rgb(248, 248, 248);
                border: 1px solid rgb(192, 192, 192);
              }
            }
          }
          .dialog-body_column:nth-of-type(1) {
            .el-input {
              // margin-left: 34px;
            }
          }
          .dialog-body_column:nth-of-type(2) {
            .el-input {
              // margin-left: 66px;
            }
          }
          .dialog-body_column:nth-of-type(3) {
            padding-top: 40px;
            .select-wrap {
              margin-top: 12px;
              position: relative;
              .select-header {
                padding-bottom: 8px;
                span {
                  font-size: 14px;
                  color: rgb(102, 102, 102);
                }
                .screenstyle-title {
                  margin-right: 112px;
                }
                .screensize-title {
                  margin-right: 50px;
                }
                .screencolumn-title {
                  margin-right: 78px;
                }
                .screenwidthheight-title {
                  margin-right: 90px;
                }
              }
              .select-body {
                min-height: 30px;
                // padding-bottom: 10px;
                .el-form-item {
                  margin-right: 6px;
                  .el-input {
                    height: 30px;
                    border-radius: 4px;
                    input {
                      height: inherit;
                      background-color: rgb(248, 248, 248);
                      border: 1px solid rgb(221, 221, 221);
                    }
                  }
                }
                .el-input {
                  width: 160px;
                }
                .el-form-item:nth-of-type(1) {
                  .el-input {
                    width: 160px;
                  }
                }
                .el-form-item:nth-of-type(2) {
                  .el-input {
                    width: 100px;
                  }
                }
                .el-form-item:nth-of-type(3) {
                  .el-input {
                    width: 100px;
                  }
                }
                .el-form-item:nth-of-type(4) {
                  .el-input {
                    width: 140px;
                  }
                }
                > .el-input {
                  width: 160px;
                }
                > div {
                  position: relative;
                  top: -10px;
                }
                button {
                  outline: none;
                  display: inline-block;
                  padding: 0;
                  border: 0;
                  cursor: pointer;
                }
                .minus-one {
                  width: 60px;
                  height: 30px;
                  background-color: rgb(255, 255, 255);
                  background-image: url(../../../../../static/img/shanchu.png);
                  background-size: 100% 100%;
                  margin-top:-5px;
                }
              }
              > button {
                outline: none;
                display: inline-block;
                padding: 0;
                border: 0;
                cursor: pointer;
              }
              .plus-one {
                width: 60px;
                height: 30px;
                background-color: rgb(255, 255, 255);
                background-image: url(../../../../../static/img/tianjia.png);
                background-size: 100% 100%;
                // position: absolute;
                // top: 27px;
                // right: 53px;
                z-index: 100;
                margin-top:-5px;
              }
            }
          }
          .dialog-body_column::before {
            // content: '*';
            // display: inline-block;
            // font-size: 14px;
            // color: rgb(255, 149, 1);
            // position: relative;
            // top: 2px;
            // right: 10px;
          }
        }
        .button-group {
          position: absolute;
          bottom: 40px;
          left: 0;
          right: 0;
          margin: auto;
          button {
            display: block;
            width: 100px;
            height: 36px;
            border-radius: 4px;
            float: left;
            padding: 0;
            cursor: pointer;
            margin-left: 78px;
            border: 1px solid rgb(51, 113, 155);
            background-color: rgb(255, 255, 255);
            font-size: 16px;
            color: rgb(51, 113, 155);
            outline: 0;
          }
          .confirm-button {
            margin-left: 286px;
            background-color: rgb(51, 113, 155);
            color: rgb(255, 255, 255);
          }
        }
      }
    }
    /* 完成采购弹窗 采购详情弹窗 */
    .finishpurchase-popup, .purchasedetail-popup {
      .el-dialog {
        width:770px;
        height: auto;
        border-radius: 4px;
        padding-bottom: 184px;
        .el-dialog__header {
          text-align: center;
          padding: 18px 15px;
          border-bottom: 1px solid rgb(240, 240, 240);
        }
        .el-dialog__body {
          padding: 0 36px;
          .dialog-body_column {
            padding-top: 20px;
            .prompt-info {
              display: block;
              font-size: 16px;
              color: rgb(51, 51, 51);
            }
            .el-table {
              border: 1px solid rgb(221, 221, 221);
              border-bottom: 0;
              .el-table__header-wrapper {
                table tr {
                  th {
                    height: 40px;
                    padding: 0;
                    background-color: rgb(248, 248, 248);
                    .cell {
                      text-align: center;
                      font-size: 14px;
                      color: rgb(51, 51, 51);
                    }
                  }
                }
              }
              .el-table__body-wrapper {
                table tr {
                  td {
                    height: 40px;
                    padding: 0;
                    background-color: rgb(255, 255, 255);
                    .cell {
                      text-align: center;
                      font-size: 14px;
                      color: rgb(102, 102, 102);
                    }
                  }
                }
              }
            }
          }
          .button-group {
            position: absolute;
            bottom: 30px;
            left: 0;
            right: 0;
            margin: auto;
            button {
              display: block;
              width: 100px;
              height: 36px;
              border-radius: 4px;
              float: left;
              padding: 0;
              cursor: pointer;
              margin-left: 40px;
              border: 1px solid rgb(51, 113, 155);
              background-color: rgb(255, 255, 255);
              font-size: 16px;
              color: rgb(51, 113, 155);
              outline: 0;
            }
            .confirm-button {
              margin-left: 275px;
              background-color: rgb(51, 113, 155);
              color: rgb(255, 255, 255);
            }
          }
        }
      }
    }
    /* 完成采购弹窗 */
    .finishpurchase-popup {
      .el-dialog {
        padding-bottom: 130px;
        .el-dialog__body {
          .dialog-body_column:nth-of-type(3) {
            .column-title {
              font-size: 14px;
              color: rgb(51, 51, 51);
            }
            .colon-sign {
              margin: 0 4px;
            }
            .el-input {
              width: 180px;
              height: 30px;
              input {
                height: inherit;
                background-color: rgb(248, 248, 248);
                border: 1px solid rgb(221, 221, 221);
              }
            }
            .prompt-msg {
              font-size: 14px;
              color: rgb(153, 153, 153);
            }
          }
        }
      }
    }
  }
</style>
