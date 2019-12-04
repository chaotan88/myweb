<!-- 分销规则列表页 -->
<template>
  <common-tpl class="distribution-list-wrap" :footer="false">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入推广大使手机" v-model.trim="formData.phone" @keyup.enter.native="searchHandle">
          </el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <div style="margin-bottom: 20px;margin-top: -20px;" class="voucher-card-list">
        <div class="switch-wrap" style="display: flex; border-bottom: 1px solid #dddddd;">
          <div class="pos-r third-nav-wrap">
            <a :class="['d-ib', 'ta-c', currentTab === 1 ? 'active' : '']"
              @click="tabClick(1)">进行中</a>
            <a :class="['d-ib', 'ta-c', currentTab === 2 ? 'active' : '']"
              @click="tabClick(2)">回收站</a>
          </div>
          <div class="user-define-add-btn">
            <el-button @click="handleLink()">添加代金券</el-button>
          </div>
        </div>
        <div class="voucher-card-content">
          <div class="to-pre-icon"><i class="icon-font el-icon-caret-left" @click="toPre()"></i></div>
          <div class="voucher-items" v-if="voucherShowList.length > 0">
            <div v-for="(item, index) in voucherShowList" :key="index" :class="['voucher-item', selectIndex === index ? 'voucher-item-active': '']" @click="selectVoucher(item, index)">
              <img src="../../../assets/img/voucher-bg.png"/>
              <div class="item-amount">&yen;<span>{{item.amount}}</span></div>
              <div class="item-use">{{item.useType === 1 ? '抵扣现金' : ''}}</div>
              <div class="right">
                <div class="first-line">{{item.description}}
                  <i class="icon-font el-icon-video-pause" v-if="item.status === 2" @click="handleStopBefore(item)"></i>
                  <i class="icon-font el-icon-delete" @click="handleDeleteBefore(item)"
                    v-else-if="item.status === 1 || item.status == 4"></i>
                </div>
                <div class="second-line">
                  <span v-if="item.status === 2" class="opened">开启</span>
                  <span v-else-if="item.status === 1" class="closed">关闭</span>
                  <span v-else-if="item.status === 4" class="stoped">停止</span>
                  <span v-else-if="item.status === 3" class="stoped">已删除</span>
                  <span class="aging">时效：
                    <span v-if="item.duration === 1">15天</span>
                    <span v-if="item.duration === 2">一个月</span>
                    <span v-if="item.duration === 3">三个月</span>
                    <span v-if="item.duration === 4">半年</span>
                    <span v-if="item.duration === 5">一年</span>
                  </span>
                  <span v-if="item.status === 1">
                    <i class="icon-font el-icon-edit" @click="handleLink(item)"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else style="width: calc(100% - 100px);">
            <no-data></no-data>
          </div>
          <div class="to-next-icon"><i class="icon-font el-icon-caret-right" @click="toNext()"></i></div>
        </div>
      </div>

      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="phone" label="推广大使手机">
          <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="amount" label="代金券金额">
          <template slot-scope="scope">{{scope.row.amount | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="领取时间">
          <template slot-scope="scope">{{scope.row.createTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="nowTime" label="到期时间">
          <template slot-scope="scope">
            {{new Date(scope.row.nowTime - scope.row.effectiveEndTime) | filterDate}}
          </template>
        </el-table-column>
        <el-table-column prop="couponStatus" label="使用状态">
          <template slot-scope="scope">
            <template v-if="(scope.row.nowTime > scope.row.effectiveEndTime) && parseInt(scope.row.couponStatus) === 0">已过期</template>
            <template v-else-if="(scope.row.nowTime < scope.row.effectiveEndTime) && parseInt(scope.row.couponStatus) === 0">未使用</template>
            <template v-else-if="parseInt(scope.row.couponStatus) === 1">使用中</template>
            <template v-else-if="parseInt(scope.row.couponStatus) === 2">已使用</template>
            <template v-else>--</template>
          </template>
        </el-table-column>
        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        @current-change="pageChange"
        v-if="pageData.total">
      </el-pagination>
    </template>

    <template slot="other">
      <!-- 删除 -->
      <el-dialog title="删除代金券" :visible.sync="deleteVisible" width="480px">
        确认是否删除？
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="handleDelete">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <template slot="other">
      <!-- 停止 -->
      <el-dialog title="停止代金券" :visible.sync="stopVisible" width="480px">
        确定停止代金券发放？
        <span slot="footer" class="dialog-footer">
          <el-button @click="stopVisible = false">取 消</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="handleStop">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <template slot="other">
      <!-- 添加/编辑 -->
      <el-dialog class="dialog-left"
        :title="addDialogTitle"
        :visible.sync="addDialogVisible"
        width="580px">
        <div class="ta-l view-authinfo-wrap">
          <template>
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="right" label-width='120px'>
              <el-form-item inline label='赠送额度：' prop='amount'>
                <el-input class='inp-name' placeholder='精确到百分位,限10个字符' v-model="addForm.amount" @change="inpBlur('amount')"></el-input>
              </el-form-item>
              <el-form-item inline label='用途：' prop='useType' class="address-wrap">
                <el-select v-model="addForm.useType" size="medium" class="year-box"
                  placeholder="请选择">
                  <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in uses"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item inline label='有效时长：' prop='duration' class="address-wrap">
                <el-select v-model="addForm.duration" size="medium" class="year-box"
                  placeholder="请选择">
                  <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in validates"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item inline label='说明：' prop='description'>
                <el-input class='inp-name' placeholder='限20个字符,不含特殊字符' v-model="addForm.description"></el-input>
              </el-form-item>
              <el-form-item inline label='代金券状态：' prop='status'>
                <el-radio-group v-model="addForm.status">
                    <el-radio :label="2">开启</el-radio>
                    <el-radio :label="1">关闭</el-radio>
                  </el-radio-group>
              </el-form-item>
              <div class="ta-c btn-wrap">
                <!-- <el-button @click="$emit('close')">取消</el-button> -->
                <el-button type="primary" class='confirm-btn' @click="submitForm('addForm')">确定</el-button>
              </div>
            </el-form>
          </template>
          <!-- <div class="ta-c btn-wrap">
            <el-button type="primary" class='confirm-btn' @click="authDialogVisible = false">确定</el-button>
          </div> -->
        </div>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    let validateAmount = (rule, value, callback) => {
      let reg = /^\d{0,7}\.\d{2}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('精确到百分位，限10个字符'))
      callback()
    }
    return {
      confirmLoading: false,    // 确定loading
      highSearchClose: true,    // 高级搜索开/关
      tableData: [],            // 列表数据
      loading: false,           // 加载loading
      formData: {
        phone: ''
      },
      copyFormData: {},         // 拷贝数据
      deleteVisible: false,     // 删除弹框
      deleteData: {},           // 删除数据
      pageData: {               // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        amount: [
          { required: true, message: '请输入赠送额度', trigger: 'blur' },
          { validator: validateAmount, trigger: 'blur' }
        ],
        useType: [
          { required: true, message: '请选择用途', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '请选择有效时长', trigger: 'blur' }
        ],
        description: [
          { max: 20, message: '请选择代金券状态', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择代金券状态', trigger: 'blur' }
        ]
      },
      pageType: '1',
      voucherALLList: [],
      voucherShowList: [],
      start: 0,
      len: 3,
      stopVisible: false,
      stopData: {},
      addDialogTitle: '添加代金券',
      addDialogVisible: false,
      addDialogType: '',
      addForm: {},
      uses: [{ label: '抵扣现金', value: 1 }],
      validates: [
        { label: '15天', value: 1 }, { label: '一个月', value: 2 }, { label: '三个月', value: 3 },
        { label: '半年', value: 4 }, { label: '一年', value: 5 }
      ],
      currentTab: 1,
      selectIndex: ''
    }
  },
  mounted () {
    this.copyFormData = this.$Utils.deepCopy(this.formData)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/distribution/rule', (res) => {
      this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
    this.getVoucherList()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getVoucherList () {
      // this.loading = true
      this.$http.post('@ROOT_API/coupon/getCouponList', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        statusFalg: this.currentTab
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.pageData.total = 0
          return false
        }
        let results = resData.data
        this.voucherALLList = results.list
        this.getShowVoucherList()
      }).finally(() => {
        this.loading = false
      })
    },
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/coupon/getCouponUserList', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        phone: this.formData.phone
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.pageData.total = 0
          return false
        }
        let results = resData.data
        this.tableData = results.list
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 新增/编辑
     */
    handleLink (item) {
      if (item) {
        this.addDialogType = 'id'
        this.addForm = item
        this.addDialogTitle = '编辑代金券'
      } else {
        this.addDialogType = ''
        this.addForm = {
          amount: '',
          useType: '',
          duration: '',
          description: '',
          status: 2
        }
        this.addDialogTitle = '添加代金券'
      }
      this.addDialogVisible = true
      if (item) {
        this.inpBlur('amount')
      }
    },
    submitForm (formName) {
      let url = 'coupon/addCoupon'
      let params = {
        amount: this.addForm.amount,
        useType: this.addForm.useType,
        duration: this.addForm.duration,
        description: this.addForm.description,
        status: this.addForm.status
      }
      if (this.addForm.id) {
        url = 'coupon/updateCoupon'
        params.id = this.addForm.id
      }
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.confirmLoading = true
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
          this.addDialogVisible = false
          this.getVoucherList()
        }).finally(() => {
          setTimeout(() => {
            this.confirmLoading = false
          }, 500)
        })
      })
    },

    /**
     * 删除前操作
     */
    handleDeleteBefore (row) {
      this.deleteVisible = true
      this.deleteData = row
    },

    /**
     * 删除
    */
    handleDelete () {
      this.confirmLoading = true
      this.$http.post('@ROOT_API/coupon/deleteCoupon', {
        id: this.deleteData.id
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
        this.deleteVisible = false
        this.getVoucherList()
      }).finally(() => {
        setTimeout(() => {
          this.confirmLoading = false
        }, 1000)
      })
    },

    handleStopBefore (row) {
      this.stopVisible = true
      this.stopData = row
    },

    handleStop () {
      this.updateCouponStatus(this.stopData.id, 4)
    },
    updateCouponStatus (id, status) {
      if (!id || !status) return false
      this.$http.post('@ROOT_API/coupon/updateCouponStatus', {
        id: id,
        status: status
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
        this.stopVisible = false
        this.getVoucherList()
      }).finally(() => {
        setTimeout(() => {
          this.confirmLoading = false
        }, 500)
      })
    },
    /**
     * 分页操作
     */
    pageChange (page) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      if (this.pageData.currentPage === page) {
        this.getListData()
      } else {
        this.pageData.currentPage = page
        this.$router.push({query: {page: this.pageData.currentPage}})
      }
    },

    /**
     * 高级搜索
     */
    highSearch (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.highSearchClose = false
          return false
        }
        this.highSearchClose = true
        this.pageChange(1)
      })
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 自动补全百分位
     */
    inpBlur (type) {
      this.$Utils.blurAutoCompletion(this.addForm, type)
    },

    /**
     * 清空重置搜索
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
    },
    /**
     * 页面类型转换
     */
    pageTypeHandle (val) {
      if (val === '2') {
        this.voucherList = this.voucherALLList.filter(item => item.status === 4)
      } else {
        this.voucherList = this.voucherALLList.filter(item => item.status === 1 || item.status === 2 || item.status === 3)
      }
      this.start = 0
      this.getShowVoucherList()
      // this.$router.replace({path: this.$route.path, query: {type: val}})
    },
    getShowVoucherList () {
      this.voucherShowList = this.voucherALLList.slice(this.start * this.len, (this.start * this.len) + this.len)
    },
    toNext () {
      if (((this.start + 1) * this.len) < this.voucherALLList.length) {
        this.start += 1
        this.getShowVoucherList()
      } else {
        this.$message({
          type: 'info',
          message: '当前已是最后一页'
        })
      }
    },
    toPre () {
      if ((this.start > 0)) {
        this.start -= 1
        this.getShowVoucherList()
      } else {
        this.$message({
          type: 'info',
          message: '当前已是第一页'
        })
      }
    },
    tabClick (tab) {
      this.currentTab = tab
      this.getVoucherList()
    },
    selectVoucher (item, index) {
      this.selectIndex = index
      this.getListData()
    }
  }
}
</script>

<style lang="less" scoped>
.distribution-list-wrap{
  .search-form{
    .el-form-item{

      .time-type-wrap{
        width: 100px;
        padding-right: 10px;
        box-sizing: border-box;
        left: -100px;
      }
    }
  }
  .admin-common-main{
    padding-top: 20px;
    .voucher-card-list {
      .voucher-card-content {
        display: flex;
        margin-top: 10px;
        .to-pre-icon, .to-next-icon {
          width: 50px;
          line-height: 80px;
          font-size: 36px;
          color: #409EFF;
          i {
            cursor: pointer;
          }
        }
        .voucher-items {
          display: flex;
          width: calc(100% - 100px);
          .voucher-item {
            width: 32%;
            // border: 3px solid #C1E0FF;
            background: #F2F2F2;
            margin-right: 20px;
            position: relative;
            display: flex;
            justify-content: space-between;
            .item-amount {
              position: absolute;
              top: 25px;
              left: 30px;
              font-size: 22px;
              color: #fff;
            }
            .item-use {
              position: absolute;
              top: 50px;
              left: 30px;
              color: #fff;
              font-size: 16px;
            }
            .right {
              font-size: 14px;
              padding: 10px 0;
              width: 170px;
              .first-line {
                i {
                  float: right;
                  margin-left: 7px;
                  margin-right: 10px;
                  font-size: 23px;
                  cursor: pointer;
                }
              }
              .second-line {
                margin-top: 10px;
                .opened {
                  background: #66CC33;
                  color: #fff;
                  font-size: 12px;
                  text-align: center;
                  padding: 2px 4px;
                  border-radius: 2px;
                }
                .closed, .stoped {
                  background: #999;
                  color: #fff;
                  font-size: 12px;
                  text-align: center;
                  padding: 2px 4px;
                  border-radius: 2px;
                }
                span:nth-child(3) {
                  float: right;
                  margin-right: 15px;
                  cursor: pointer;
                }
              }
            }
          }
          .voucher-item:nth-child(3) {
            margin-right: 0;
          }
          .voucher-item-active {
            border: 3px solid #C1E0FF;
          }
        }
      }
    }
  }
  .third-nav-wrap {
    a {
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
.distribution-list-wrap{
  .search-form{
    .agent{
      .el-form-item__content{
        margin-left: 0 !important;
        margin-right: 100px;
      }
    }
  }
}
</style>