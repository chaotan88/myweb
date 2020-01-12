<!-- 共用详情页 -->
<template>
  <common-tpl class="account-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">
        <gray-title title="推广大使信息" class="ta-l title"></gray-title>
        <table>
          <tr>
            <td>推广大使手机：</td>
            <td>{{detailsData.orderStatus | filterOrderStatus}}</td>
          </tr>
          <tr>
            <td>级别产生方式：</td>
            <td>{{detailsData.orderNo | filterEmpty}}</td>
          </tr>
          <tr>
            <td>当前身份：</td>
            <td>{{detailsData.orderTime | filterDate}}</td>
          </tr>
          <tr>
            <td>证件类型：</td>
            <td>{{detailsData.payTime | filterDate}}</td>
          </tr>
          <tr>
            <td>姓名：</td>
            <td>{{detailsData.payTime | filterDate}}</td>
          </tr>
          <tr>
            <td>证件号：</td>
            <td>{{detailsData.payTime | filterDate}}</td>
          </tr>
          <tr>
            <td>地区：</td>
            <td>{{detailsData.payTime | filterDate}}</td>
          </tr>
        </table>

        <gray-title title="账户信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>当前账户余额：</td>
            <td>{{detailsData.cardName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>累计佣金：</td>
            <td>{{detailsData.phone | filterEmpty}}</td>
          </tr>
          <tr>
            <td>已提现金额：</td>
            <td>{{detailsData.phone | filterEmpty}}</td>
          </tr>
        </table>
        <gray-title title="支付宝绑定信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>支付宝姓名  ：</td>
            <td v-if="detailsData.orderStatus === 2 && pageType !== 1">
              <el-input v-model="formData.customerName" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>支付宝账号：</td>
            <td v-if="detailsData.orderStatus === 2 && pageType !== 1">
              <el-input v-model="formData.customerPhone" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerPhone | filterEmpty}}</td>
          </tr>
        </table>
        <gray-title title="微信绑定信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>微信头像  ：</td>
            <td v-if="detailsData.orderStatus === 2 && pageType !== 1">
              <el-input v-model="formData.customerName" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>微信昵称：</td>
            <td v-if="detailsData.orderStatus === 2 && pageType !== 1">
              <el-input v-model="formData.customerPhone" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerPhone | filterEmpty}}</td>
          </tr>
          <tr>
            <td>openid：</td>
            <td v-if="detailsData.orderStatus === 2 && pageType !== 1">
              <el-input v-model="formData.customerPhone" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerPhone | filterEmpty}}</td>
          </tr>
        </table>
        <gray-title title="银行卡信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>持卡人：</td>
            <td v-if="detailsData.orderStatus === 2 && pageType !== 1">
              <el-input v-model="formData.customerName" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>所属地区：</td>
            <td v-if="detailsData.orderStatus === 2 && pageType !== 1">
              <el-input v-model="formData.customerPhone" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerPhone | filterEmpty}}</td>
          </tr>
          <tr>
            <td>开户银行：</td>
            <td v-if="detailsData.orderStatus === 2 && pageType !== 1">
              <el-input v-model="formData.customerPhone" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerPhone | filterEmpty}}</td>
          </tr>
          <tr>
            <td>支行信息：</td>
            <td v-if="detailsData.orderStatus === 2 && pageType !== 1">
              <el-input v-model="formData.customerName" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>银行卡号：</td>
            <td v-if="detailsData.orderStatus === 2 && pageType !== 1">
              <el-input v-model="formData.customerPhone" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerPhone | filterEmpty}}</td>
          </tr>
          <tr>
            <td>预留手机：</td>
            <td v-if="detailsData.orderStatus === 2 && pageType !== 1">
              <el-input v-model="formData.customerPhone" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerPhone | filterEmpty}}</td>
          </tr>
        </table>

      </div>
    </template>


    <!-- 底部 -->
    <template slot="footer">
      <template v-if="parseInt(detailsData.orderStatus) === 2 && pageType !== 1">
        <el-button type="primary" @click="sendOrder">返回</el-button>
      </template>
    </template>
  </common-tpl>
</template>

<script>
import RegionSelect from '@/components/utils/RegionSelect'

export default {
  data () {
    return {
      confirmLoading: false,
      formData: {
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        logisticsName: '',
        logisticsNo: '',
        logisticsNumber: '',
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
        }
      },
      addForm: {
        logisticsNo: '',
        logisticsNumber: ''
      },
      uses: [],
      rules: {
        logisticsNo: [
          { required: true, message: '请选择快递类型', trigger: 'blur' }
        ],
        logisticsNumber: [
          { required: true, message: '请输入快递单号', trigger: 'blur' },
          { max: 50, message: '物流单号限50个字符', trigger: 'blur' }
        ]
      },
      orderId: '',              // 申请id
      detailsData: {},          // 详情数据
      fxUserInfo: {},           // 用户信息
      passVisible: false,        // 发货弹窗
      tableData: [],
      logisticsList: [],
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
      pageType: ''
    }
  },
  mounted () {
    this.orderId = parseInt(this.$route.query.id) || ''
    this.pageType = this.$route.query.pageType
    this.fxUserInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.getLogisticsCompanylist()
    this.getDetails()
  },
  methods: {
    /**
     * 详情
     */
    getDetails () {
      this.$http.get('@ROOT_API/meal/getSetMealOrderDetails', {
        params: {
          orderId: this.orderId          // long  申请ID
        }
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
        let results = resData.data
        if (results) {
          this.tableData = []
          this.tableData.push({
            mainImageUrl: results.mainImageUrl,
            setMealNumber: results.setMealNumber,
            setMealName: results.setMealName,
            setMealStatus: results.setMealStatus,
            setMealPrice: results.setMealPrice
          })
          this.detailsData = results
          this.formData.customerName = results.customerName
          this.formData.customerPhone = results.customerPhone
          this.region.province = {
            code: results.provinceCode,
            name: results.province
          }
          this.region.city = {
            code: results.cityCode,
            name: results.city
          }
          this.region.area = {
            code: results.zoneCode,
            name: results.zone
          }
          // this.formData.region = {
          //   province: {
          //     code: results.provinceCode,
          //     name: results.province
          //   },
          //   city: {
          //     code: results.cityCode,
          //     name: results.city
          //   },
          //   area: {
          //     code: results.zoneCode,
          //     name: results.zone
          //   }
          // }
          console.log(this.formData.region)
          this.formData.customerAddress = results.address
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.confirmLoading = true
        let logistics = this.logisticsList.filter(logi => logi.logisticsNo === this.addForm.logisticsNo)
        if (!logistics || logistics.length === 0) logistics = [{}]
        let params = {
          orderId: this.detailsData.orderId,
          customerName: this.formData.customerName,
          customerPhone: this.formData.customerPhone,
          addressId: this.detailsData.addressId,
          province: this.formData.region.province.name,
          provinceCode: this.formData.region.province.code,
          city: this.formData.region.city.name,
          cityCode: this.formData.region.city.code,
          zone: this.formData.region.area.name,
          zoneCode: this.formData.region.area.code,
          address: this.formData.customerAddress,
          logisticsNo: logistics[0].logisticsNo,
          logisticsName: logistics[0].logisticsName,
          logisticsNumber: this.addForm.logisticsNumber
        }
        this.submitLoading = true
        this.$http.post('@ROOT_API/meal/updateSetMealOrderShip', params).then((res) => {
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
          this.dialogVisible = false
          this.$router.back()
        }).finally(() => {
          setTimeout(() => {
            this.submitLoading = false
          }, 1000)
        })
      })
    },
    getSummaries (param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index < 4) return ''
        if (index === 4) {
          sums[index] = '实收金额合计:'
          return
        }
        // const values = data.map(item => Number(item[column.property]))
        if (this.detailsData.orderAmount) {
          sums[index] = `${this.detailsData.orderAmount} 元`
        } else {
          sums[index] = 'N/A'
        }
        // if (!values.every(value => isNaN(value))) {
        //   sums[index] = values.reduce((prev, curr) => {
        //     const value = Number(curr)
        //     if (!isNaN(value)) {
        //       return prev + curr
        //     } else {
        //       return prev
        //     }
        //   }, 0)
        //   sums[index] += ' 元'
        // } else {
        //   sums[index] = 'N/A'
        // }
      })
      return sums
    },
    getLogisticsCompanylist () {
      this.$http.get('@ROOT_API/meal/getLogisticsCompanylist', {}).then(res => {
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
        this.logisticsList = results || []
      })
    },
    regionChange (results) {
      this.formData.region = results
    },
    sendOrder () {
      this.addForm.logisticsNo = this.formData.logisticsNo
      this.addForm.logisticsNumber = this.formData.logisticsNumber
      this.passVisible = true
    },
    getCustomerDetailAddress () {
      return `${this.formData.region.province.name}
        ${this.formData.region.city.name}${this.formData.region.area.name}
          ${this.formData.customerAddress}`
    }
  },
  components: { RegionSelect }
}
</script>

<style lang="less" scoped>
.account-detail-wrap{
  
  .admin-gray-title{
    margin-bottom: 0;
  }

  .goods-common-details{

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
        color: #999;
        border-left: none;
      }

    }

    .thumbnail-wrap{
      width: 100px;
      height: 100px;
      margin-right: 10px;
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
    .el-input {
      width: 200px;
    }
  }
  .el-table {
    margin-bottom: 20px;
  }
}
</style>
<style lang="less">
.account-detail-wrap{
  .el-dialog {
    .el-dialog__body {
      padding-bottom: 0;
      .btn-wrap {
        padding-bottom: 20px;
      }
    }
    .customer-info {
      margin-left: 35px;
      font-size: 12px;
      line-height: 20px;
    }
  }
  .region-select-wrap {
    justify-content: flex-start !important;
    .el-select, .el-input, input {
      width: 150px !important;
    }
  }
}
</style>
