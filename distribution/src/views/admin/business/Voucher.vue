<!-- 分销规则列表页 -->
<template>
  <common-tpl class="distribution-list-wrap" :footer="false">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入推广大使手机" v-model.trim="formData.ruleName" @keyup.enter.native="searchHandle">
          </el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <div style="margin-bottom: 20px;margin-top: -20px;" class="voucher-card-list">
        <div class="switch-wrap ">
          <el-radio-group v-model="pageType" @change="pageTypeHandle">
            <el-radio-button label="1">进行中</el-radio-button>
            <el-radio-button label="2">回收站</el-radio-button>
          </el-radio-group>
          <el-button @click="handleLink()" style="float: right;">添加代金券</el-button>
        </div>
        <div class="voucher-card-content">
          <div class="to-pre-icon"><i class="icon-font el-icon-caret-left" @click="toPre()"></i></div>
          <div class="voucher-items">
            <div v-for="(item, index) in voucherShowList" :key="index" class="voucher-item">
              <img src="../../../assets/img/voucher-bg.png"/>
              <div class="item-amount">&yen;<span>{{item.amount}}</span></div>
              <div class="item-use">{{item.use === 1 ? '抵扣现金' : ''}}</div>
              <div class="right">
                <div class="first-line">可用于订购套餐使用
                  <i class="icon-font el-icon-video-pause" v-if="item.status === 1" @click="handleStopBefore(item)"></i>
                  <i class="icon-font el-icon-delete" @click="handleDeleteBefore(item)" v-else></i>
                </div>
                <div class="second-line">
                  <span v-if="item.status === 1" class="opened">开启</span>
                  <span v-else-if="item.status === 2" class="closed">关闭</span>
                  <span v-else-if="item.status === 3" class="stoped">停止</span>
                  <span v-else-if="item.status === 4" class="stoped">已删除</span>
                  <span class="aging">时效：{{item.aging}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="to-next-icon"><i class="icon-font el-icon-caret-right" @click="toNext()"></i></div>
        </div>
      </div>

      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="ruleName" label="推广大使手机">
          <template slot-scope="scope">{{scope.row.ruleName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="agentFee" label="代金券金额">
          <template slot-scope="scope">{{scope.row.agentFee | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="consumePointRate" label="领取时间">
          <template slot-scope="scope">{{scope.row.consumePointRate | filterEmpty('%')}}</template>
        </el-table-column>
        <el-table-column prop="cashRate" label="到期时间">
          <template slot-scope="scope">{{scope.row.cashRate | filterEmpty('%')}}</template>
        </el-table-column>
        <el-table-column prop="directSubName" label="使用状态">
          <template slot-scope="scope">
            <template v-if="parseInt(scope.row.rand) === 0">{{'' | filterEmpty}}</template>
            <template v-else>{{scope.row.directSubName | filterEmpty}}</template>
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
          <template v-if="addDialogType === 'id'">
            <el-form :model="addForm" :rules="rules" ref="verifiForm" label-position="right" label-width='120px'>
              <el-form-item inline label='赠送额度：' prop='name'>
                <el-input class='inp-name' placeholder='精确到百分位,限10个字符' v-model="addForm.name"></el-input>
              </el-form-item>
              <el-form-item inline label='用途：' prop='address' class="address-wrap">
                <el-select v-model="addForm.used" size="medium" class="year-box"
                  placeholder="请选择">
                  <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in uses"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item inline label='有效时长：' prop='address' class="address-wrap">
                <el-select v-model="addForm.validate" size="medium" class="year-box"
                  placeholder="请选择">
                  <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in validates"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item inline label='说明：' prop='name'>
                <el-input class='inp-name' placeholder='限20个字符,不含特殊字符' v-model="addForm.remark"></el-input>
              </el-form-item>
              <el-form-item inline label='代金券状态：' prop='name'>
                <el-radio-group v-model="addForm.memberType">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="2">关闭</el-radio>
                  </el-radio-group>
              </el-form-item>
              <div class="ta-c btn-wrap">
                <!-- <el-button @click="$emit('close')">取消</el-button>
                <el-button type="primary" class='confirm-btn' @click="submitForm('verifiForm')">确定</el-button> -->
              </div>
            </el-form>
          </template>
          <template v-else>
            <!-- <dl class="pos-r">
              <dt class="ta-r pos-a">企业名称：</dt>
              <dd>{{this.formData.company}}</dd>
            </dl>
            <dl class="pos-r">
              <dt class="ta-r pos-a">企业所在地：</dt>
              <dd>
                {{userAllInfo.companyProvince}}
                {{userAllInfo.companyCity}}
                {{userAllInfo.companyZone}}
                {{userAllInfo.address}}
              </dd>
            </dl>
            <dl class="pos-r">
              <dt class="ta-r pos-a">营业执照：</dt>
              <dd>
                <a :href="userAllInfo.companyLicense | filterImgUrl" target="_blank" title="查看">
                  <img :src="userAllInfo.companyLicense | filterImgUrl">
                </a>
              </dd>
            </dl> -->
          </template>
          <div class="ta-c btn-wrap">
            <el-button type="primary" class='confirm-btn' @click="authDialogVisible = false">确定</el-button>
          </div>
        </div>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    // 代理费
    let validateAgent = (rule, value, callback) => {
      let reg = /^[0-9]{1,8}([.][0-9]{1,2})?$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('请输入10个字符以内的代理费，限2位小数'))
      callback()
    }
    return {
      confirmLoading: false,    // 确定loading
      highSearchClose: true,    // 高级搜索开/关
      tableData: [],            // 列表数据
      loading: false,           // 加载loading
      formData: {
        ruleName: '',           // 规则名称
        agentLowness: '',       // 价格低
        agentHigh: ''           // 价格高
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
        // 代理费低
        agentLowness: { validator: validateAgent, trigger: 'blur' },

        // 代理费高
        agentHigh: { validator: validateAgent, trigger: 'blur' }
      },
      pageType: '1',
      voucherALLList: [{ id: 1, amount: 3000, use: 1, desc: '可用于订购套餐使用', status: 1, aging: '一年' },
      { id: 2, amount: 3000, use: 1, desc: '可用于订购套餐使用2', status: 2, aging: '一年' },
      { id: 3, amount: 6000, use: 1, desc: '可用于订购套餐使用', status: 3, aging: '15天' },
      { id: 4, amount: 6000, use: 1, desc: '可用于订购套餐使用', status: 1, aging: '15天' },
      { id: 5, amount: 3000, use: 1, desc: '可用于订购套餐使用', status: 2, aging: '15天' },
      { id: 6, amount: 3000, use: 1, desc: '可用于订购套餐使用', status: 3, aging: '15天' },
      { id: 7, amount: 6000, use: 1, desc: '可用于订购套餐使用', status: 1, aging: '15天' },
      { id: 5, amount: 3000, use: 1, desc: '可用于订购套餐使用', status: 4, aging: '15天' },
      { id: 6, amount: 3000, use: 1, desc: '可用于订购套餐使用', status: 4, aging: '15天' },
      { id: 7, amount: 6000, use: 1, desc: '可用于订购套餐使用', status: 4, aging: '15天' }],
      voucherList: [{ id: 1, amount: 3000, use: 1, desc: '可用于订购套餐使用', status: 1, aging: '一年' },
      { id: 2, amount: 3000, use: 1, desc: '可用于订购套餐使用2', status: 2, aging: '一年' },
      { id: 3, amount: 6000, use: 1, desc: '可用于订购套餐使用', status: 3, aging: '15天' },
      { id: 4, amount: 6000, use: 1, desc: '可用于订购套餐使用', status: 1, aging: '15天' },
      { id: 5, amount: 3000, use: 1, desc: '可用于订购套餐使用', status: 2, aging: '15天' },
      { id: 6, amount: 3000, use: 1, desc: '可用于订购套餐使用', status: 3, aging: '15天' },
      { id: 7, amount: 6000, use: 1, desc: '可用于订购套餐使用', status: 1, aging: '15天' }],
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
      ]
    }
  },
  mounted () {
    this.copyFormData = this.$Utils.deepCopy(this.formData)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/distribution/rule', (res) => {
      this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    // this.getListData()
    this.getShowVoucherList()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/rule/getRuleList', {
        start: this.pageData.currentPage,             // 是 int 开始时间
        pageSize: this.pageData.pageSize,             // 是 int 开始时间
        agentAmountMin: this.formData.agentLowness,   // 否 double  代理金额最小值
        agentAmountMax: this.formData.agentHigh,      // 否 double  代理金额最大值
        ruleName: this.formData.ruleName               // 否 string  规则名称
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
        // results.list.forEach((row, index) => {
        //   if (index < results.list.length - 1) row.subordinate = results.list[index + 1].ruleName
        // })
        this.tableData = results.list
        this.pageData.total = results.total
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
        this.addForm = {}
        this.addDialogTitle = '添加代金券'
      }
      this.addDialogVisible = true
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
      this.$http.post('@ROOT_API/rule/deleteRule', {
        ruleId: this.deleteData.ruleId
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
        this.getListData()
        // this.tableData.map((item, index) => {
        //   if (this.deleteData.ruleId === item.ruleId) {
        //     this.tableData.splice(index, 1)
        //     return
        //   }
        // })
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

    handleStop () {},
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
      this.$Utils.blurAutoCompletion(this.formData, type)
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
      this.voucherShowList = this.voucherList.slice(this.start * this.len, (this.start * this.len) + this.len)
    },
    toNext () {
      if (((this.start + 1) * this.len) < this.voucherList.length) {
        this.start += 1
        this.getShowVoucherList()
      } else {
        console.log('没有下一页')
      }
    },
    toPre () {
      if ((this.start > 0)) {
        this.start -= 1
        this.getShowVoucherList()
      } else {
        console.log('当前已经是第一页')
      }
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
            border: 3px solid #C1E0FF;
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
              }
            }
          }
          .voucher-item:nth-child(3) {
            margin-right: 0;
          }
        }
      }
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