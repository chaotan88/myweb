<template>
  <!-- 家庭用户管理 -->
  <div class="home-user-manage">
    <div class="home-user-manage-wrap">
      <div class="list">
        <!-- 搜索 -->
        <div class="line">
          <el-form :inline="true" :model="searchData">
            <el-form-item>
              <el-input v-model="searchData.phone" :placeholder="$t('device.pleaseEnterRoomOrNumber')" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="search-btn" @click="pageNum = 1, findData()">
                <i class="el-icon-search"></i>
              </el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-button class="add-btn" @click="exportExcel">
                  {{$t("common.export")}}
                </el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="add-btn" @click="importDialog = true">
                  {{$t("common.input")}}
                </el-button>
            </el-form-item> -->
            <el-form-item>
              <el-button class="add-btn"  @click="add">
                  {{$t("common.new")}}
                </el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="add-btn"  @click="clear">
                  {{$t("common.clear")}}
                </el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-button class="add-btn"  @click="onlyClearDevice">
                  {{$t("device.onlyClearDevice")}}
                </el-button>
            </el-form-item> -->
            <!-- <el-form-item>
              <div  @click="syncDataByDevice" title="Synchro Data To Device" class="icon-button-css">
                <img src="../../../../../static/img/device/push.png"/>
              </div>
            </el-form-item> -->
            <!-- <el-form-item>
              <div  @click="syncDataToServer" title="Synchro Data To Server" class="icon-button-css">
                <img src="../../../../../static/img/device/sync.png"/>
              </div>
            </el-form-item> -->
          </el-form>
        </div>
        <div class="location-info">
          <div>
            <span class="apartmentName"><span class="label">{{$t('device.apartmentName')}}</span>：<span>{{addressInfo.apartmentName}}</span></span>
            <span class="apartmentName"><span class="label">{{$t('device.apartmentManager')}}</span>：<span>{{addressInfo.apartmentManager}}</span></span>
            <span class="apartmentManager"><span class="label">{{$t('device.deviceName')}}</span>：<span>{{deviceInfo.name}}</span></span>
          </div>
          <div>
            <span class="apartmentPhone"><span class="label">{{$t('device.apartmentPhone')}}</span>：
            <span :title="`${addressInfo.apartmentPhone1},${addressInfo.apartmentPhone2},${addressInfo.apartmentPhone3}`" v-if="addressInfo.apartmentPhone1">
              {{addressInfo.apartmentPhone1}}...</span></span>
            <span class="apartmentPhone"><span class="label">{{$t('device.addressDetail')}}</span>：<span>{{addressInfo.address}}</span></span>
            <span class="apartmentManager"><span class="label">{{$t('device.imeiNumber')}}</span>：<span>{{addressInfo.imei}}</span></span>
          </div>
        </div>
          
        <!-- 表格 -->
        <el-table :data="itemList">
          <el-table-column type="index" :title="$t('common.index')" width="50">
            <template slot="header">
              <div>
                <img src="../../../../../static/img/home/order.png"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.roomNumber')" min-width="60">
            <template slot="header">
              <div>
                <img src="../../../../../static/img/home/homeNo.png"/>
              </div>
            </template>
            <template slot-scope="props">
              <p>{{ props.row.roomNumber }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.hostName')">
            <template slot="header">
              <div>
                <img src="../../../../../static/img/home/homeName.png"/>
              </div>
            </template>
            <template slot-scope="props">
              <p>{{ props.row.hostName }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.phone1')" show-overflow-tooltip min-width="160">
            <template slot="header">
              <div>
                <img src="../../../../../static/img/home/phone1.png"/>
              </div>
            </template>
            <template slot-scope="props">
              <p>{{ props.row.phone1 }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.phone2')" show-overflow-tooltip min-width="160">
            <template slot="header">
              <div>
                <img src="../../../../../static/img/home/phone2.png"/>
              </div>
            </template>
            <template slot-scope="props">
              <p>{{ props.row.phone2 }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.phone3')" show-overflow-tooltip min-width="160">
            <template slot="header">
              <div>
                <img src="../../../../../static/img/home/phone3.png"/>
              </div>
            </template>
            <template slot-scope="props">
              <p>{{ props.row.phone3 }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.code')" show-overflow-tooltip>
            <template slot="header">
              <div>
                <img src="../../../../../static/img/home/number.png"/>
              </div>
            </template>
            <template slot-scope="props">
              <p>{{ props.row.code }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.card1')">
            <template slot="header">
              <div>
                <img src="../../../../../static/img/home/card1.png" style="width: 50px; height: 50px;"/>
              </div>
            </template>
            <template slot-scope="props">
              <p>{{ props.row.card1 }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.card2')">
            <template slot="header">
              <div>
                <img src="../../../../../static/img/home/card2.png" style="width: 50px; height: 50px;"/>
              </div>
            </template>
            <template slot-scope="props">
              <p>{{ props.row.card2 }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.card3')">
            <template slot="header">
              <div>
                <img src="../../../../../static/img/home/card3.png" style="width: 30px; height: 30px;"/>
              </div>
            </template>
            <template slot-scope="props">
              <p>{{ props.row.card3 }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="operation" :title="$t('common.operation')" min-width="220">
            <template slot-scope="props">
              <el-button class="detail-button" @click="deleteHomeUser(props.row)">{{$t('common.delete')}}</el-button>
              <!-- <div>
                <img src="../../../../../static/img/home/del.png" @click="deleteHomeUser(props.row)"
                  title="Delete"
                  style="width: 20px; height: 20px; cursor: pointer;"/>
              </div> -->
              <el-button class="detail-button" @click="update(props.row)">{{$t('common.update')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="pagination-wrap" v-show="total">
      <el-pagination
        layout="prev, pager, next, jumper"
        :current-page.sync="pageNum"
        :page-count="pageSize"
        :total="total"
        @current-change="changePage">
      </el-pagination>
    </div>
    <!--新增、修改家庭用户弹框-->
    <el-dialog
      :title="id ? $t('common.update'): $t('common.new')"
      :visible.sync="updateDialog"
      width="30%"
      center class="grant-pop"
      v-loading="loading"
      element-loading-text="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
     <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
      <ul>
        <li>
          <el-form-item :label="$t('device.roomNumber')" prop="roomNumber" v-if="id">
            <el-input v-model="ruleForm.roomNumber" readonly></el-input>
          </el-form-item>
          <el-form-item :label="$t('device.roomNumber')" prop="roomNumber" v-else>
            <el-input v-model="ruleForm.roomNumber" :placeholder="`1-5${$t('common.characters')}`" minlength="1" maxlength="5"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.hostName')" prop="hostName" >
            <el-input v-model="ruleForm.hostName" :placeholder="`1-14${$t('common.characters')}`" minlength="1" maxlength="14"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.phone1')" prop="phone1" >
            <el-input v-model="ruleForm.phone1" :placeholder="`3-30${$t('common.characters')}`" minlength="3" maxlength="30"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.phone2')" prop="phone2" >
            <el-input v-model="ruleForm.phone2" :placeholder="`3-30${$t('common.characters')}`" minlength="3" maxlength="30"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.phone3')" prop="phone3" >
            <el-input v-model="ruleForm.phone3" :placeholder="`3-30${$t('common.characters')}`" minlength="3" maxlength="30"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.keypadPIN')" prop="code" >
            <el-input v-model="ruleForm.code" :placeholder="`6${$t('common.characters')}`" minlength="6" maxlength="6"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.card1')" prop="card1" >
            <el-input v-model="ruleForm.card1" :placeholder="`10${$t('common.characters')}`" minlength="10" maxlength="10"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.card2')" prop="card2" >
            <el-input v-model="ruleForm.card2" :placeholder="`10${$t('common.characters')}`" minlength="10" maxlength="10"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.card3')" prop="card3" >
            <el-input v-model="ruleForm.card3" :placeholder="`10${$t('common.characters')}`" minlength="10" maxlength="10"></el-input>
          </el-form-item>
        </li>
      </ul>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateDialog = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t('common.save')}}</el-button>
      </span>
    </el-dialog>

    <!-- 导入设备弹窗 -->
    <el-dialog
      :title="$t('common.input')"
      :visible.sync="importDialog"
      width="480px"
      center class="grant-pop">
      <el-form :inline="true" class="demo-form-inline" label-width="120px">
        <el-form-item :label="$t('common.selectFile')">
          <!-- <el-input v-model="addItem.imei" placeholder="请选择文件" clearable></el-input> -->
          <UploadFile @success="uploadSuccess" module="family"></UploadFile>
        </el-form-item>
        <!-- <span @click="downloadTemplate" class="download-template">下载模板</span>
        <el-form-item>
        导入前请先下载导入模块，请按导入模版格式导入。
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialog = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="upload">{{$t('common.sure')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {pageMixin} from '@/mixin'
  import UploadFile from '@/components/utils/UploadFile.vue'
  
  export default {
    data () {
      const checkCode = (rule, value, callback) => {
        if (!value) {
          return callback()
        }
        setTimeout(() => {
          if (isNaN(parseFloat(value))) {
            callback(new Error(this.$t('common.pleaseSelectNumber')))
          } else {
            if (value.toString().length !== 6) {
              callback(new Error(`6${this.$t('common.characters')}`))
            } else {
              callback()
            }
          }
        }, 1000)
      }
      let validateHomePhone = (rule, value, callback) => {
        let reg = /^[0-9/+][0-9/*]*$/g
        if ((value && !value.toString().match(reg))) return callback(new Error('Phone Invalid'))
        callback()
      }
      return {
        token: '',
        imei: '',
        id: '',
        addressId: '',
        applicationList: [],
        importDialog: false,
        filePath: '',
        searchData: {
          phone: null
        },
        updateDialog: false,
        type: 'all',
        ruleForm: {
          imei: '',
          code: '',
          roomNumber: '',
          hostName: '',
          phone1: '',
          phone2: '',
          phone3: '',
          card1: '',
          card2: '',
          card3: ''
        },
        rules: {
          roomNumber: [
            { required: true, trigger: 'blur' },
            { min: 1, max: 5, trigger: 'blur', message: `1-5${this.$t('common.characters')}` }
          ],
          hostName: [
            { required: true, trigger: 'blur' },
            { min: 1, max: 14, trigger: 'blur', message: `1-14${this.$t('common.characters')}` }
          ],
          code: [
            // { required: true, trigger: 'blur' },
            // { min: 4, max: 4, trigger: 'blur', message: `4${this.$t('common.characters')}` },
            { validator: checkCode, trigger: 'blur' }
          ],
          phone1: [
            // { required: true, trigger: 'blur' },
            { min: 3, max: 30, trigger: 'blur', message: `3-30${this.$t('common.characters')}` },
            { validator: validateHomePhone, trigger: 'blur' }
          ],
          phone2: [
            // { required: true, trigger: 'blur' },
            { min: 3, max: 30, trigger: 'blur', message: `3-30${this.$t('common.characters')}` },
            { validator: validateHomePhone, trigger: 'blur' }
          ],
          phone3: [
            // { required: true, trigger: 'blur' },
            { min: 3, max: 30, trigger: 'blur', message: `3-30${this.$t('common.characters')}` },
            { validator: validateHomePhone, trigger: 'blur' }
          ],
          card1: [
            // { required: true, trigger: 'blur' },
            { len: 10, trigger: 'blur', message: `10${this.$t('common.characters')}` }
          ],
          card2: [
            // { required: true, trigger: 'blur' },
            { len: 10, trigger: 'blur', message: `10${this.$t('common.characters')}` }
          ],
          card3: [
            // { required: true, trigger: 'blur' },
            { len: 10, trigger: 'blur', message: `10${this.$t('common.characters')}` }
          ]
        },
        loading: false,
        addressInfo: {},
        deviceInfo: {}
      }
    },
    mounted () {
      this.addressId = this.$route.params.id.split('@')[0]
      this.addressInfo = JSON.parse(sessionStorage.getItem('setVistorLocation'))
      if (this.addressInfo.imei) {
        this.getDeviceInfo()
      }
      this.findData()
    },
    methods: {
      findData () {
        this.$http.post('@ROOT_API/dfDeviceFamily/getDfDeviceFamilyPage', {
          start: this.pageNum,
          pageSize: this.pageSize,
          addressId: this.addressId,
          phone: this.searchData.phone
        }).then((res) => {
          this.itemList = res.data.data.list
          this.total = res.data.data.total
        })
      },
      getDeviceInfo () {
        this.$http.post('@ROOT_API/dfDevice/getDfDevicePage', {
          start: 1,
          pageSize: 2,
          imei: this.addressInfo.imei
        }).then((res) => {
          let { data, status } = res.data
          if (status === '1') {
            let { list } = data
            let [item] = list
            this.deviceInfo = item
          }
        })
      },
      deleteHomeUser (row) {
        this.checkDevice(() => {
          this.$confirm(this.$t('common.deleteHomeUserSure'), 'title', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancle',
            type: 'warning'
          }).then(() => {
            row.isDeleted = 1
            this.$http.post('@ROOT_API/dfDeviceFamily/deleteBatchDfDeviceFamily', {
              ids: row.id
            }).then((res) => {
              if (res.data.status === '1') {
                this.$message({
                  type: 'success',
                  message: 'Success'
                })
                this.findData()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg || this.$t('common.errorMsg')
                })
              }
            })
          }).catch(() => {})
        })
      },
      update (row) {
        this.id = row.id
        this.getDetail()
      },
      add () {
        this.ruleForm = {}
        this.id = ''
        this.updateDialog = true
      },
      /**
       * 表单验证
      */
      submitForm (formName) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.id) {
              this.updateItem()
            } else {
              this.addItem()
            }
          } else {
            this.loading = false
            return false
          }
        })
      },
      /**
       *修改家庭用户
      */
      updateItem () {
        this.loading = true
        this.checkDevice(() => {
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              let params = {
                id: this.ruleForm.id,
                addressId: this.addressId,
                code: this.ruleForm.code,
                roomNumber: this.ruleForm.roomNumber,
                hostName: this.ruleForm.hostName,
                phone1: this.ruleForm.phone1,
                phone2: this.ruleForm.phone2,
                phone3: this.ruleForm.phone3,
                card1: this.ruleForm.card1,
                card2: this.ruleForm.card2,
                card3: this.ruleForm.card3
              }
              this.$http.post('@ROOT_API/dfDeviceFamily/saveOrUpdateDfDeviceFamily', params).then((res) => {
                if (res.data.status === '1') {
                  this.$message.success('Success')
                  this.updateDialog = false
                  this.findData()
                } else {
                  this.$message.error(res.data.msg || this.$t('common.errorMsg'))
                }
                this.loading = false
              })
            } else {
              console.log('error submit!!')
              this.loading = false
              return false
            }
          })
        })
      },
      addItem () {
        this.loading = true
        this.checkDevice(() => {
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              let saveList = []
              saveList.push({
                addressId: this.addressId,
                roomNumber: this.ruleForm.roomNumber,
                hostName: this.ruleForm.hostName,
                code: this.ruleForm.code,
                phone1: this.ruleForm.phone1,
                phone2: this.ruleForm.phone2,
                phone3: this.ruleForm.phone3,
                card1: this.ruleForm.card1,
                card2: this.ruleForm.card2,
                card3: this.ruleForm.card3
              })
              this.$http.post('@ROOT_API/dfDeviceFamily/saveOrUpdateDfDeviceFamilyList', saveList).then((res) => {
                if (res.data.status === '1') {
                  this.$message.success('Success')
                  this.updateDialog = false
                  this.findData()
                } else {
                  this.$message.error(res.data.msg || this.$t('common.errorMsg'))
                }
                this.loading = false
              })
            } else {
              console.log('error submit!!')
              this.loading = false
              return false
            }
          })
        })
      },
      clear () {
        this.$confirm(this.$t('common.clearHomeUserSure'), 'title', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancle',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.post('@ROOT_API/dfDeviceFamily/clearDfDeviceFamily', {
            addressId: this.addressId
          }).then((res) => {
            if (res.data.status === '1') {
              this.$message({
                type: 'success',
                message: 'Success'
              })
              this.findData()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg || this.$t('common.errorMsg')
              })
            }
            this.loading = false
          })
        }).catch(() => { this.loading = false })
      },
      onlyClearDevice () {
        this.$confirm(this.$t('common.areYouSure'), 'title', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancle',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.post('@ROOT_API/dfDeviceFamily/synchronizedClearDfDeviceFamily', {
            addressId: this.addressId
          }).then((res) => {
            if (res.data.status === '1') {
              this.$message({
                type: 'success',
                message: 'Success'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg || this.$t('common.errorMsg')
              })
            }
            this.loading = false
          })
        }).catch(() => { this.loading = false })
      },
      syncDataByDevice () {
        this.$confirm(this.$t('common.areYouSure'), 'title', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancle',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.post('@ROOT_API/dfDeviceFamily/synchronizedDfDeviceFamily', {
            addressId: this.addressId
          }).then((res) => {
            if (res.data.status === '1') {
              this.$message({
                type: 'success',
                message: 'Success'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg || this.$t('common.errorMsg')
              })
            }
            this.loading = false
          })
        }).catch(() => { this.loading = false })
      },
      syncDataToServer () {
        this.$confirm(this.$t('common.areYouSure'), 'title', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancle',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.post('@ROOT_API/dfDeviceFamily/pushFetchFamily', {
            addressId: this.addressId
          }).then((res) => {
            if (res.data.status === '1') {
              this.$message({
                type: 'success',
                message: 'Success'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg || this.$t('common.errorMsg')
              })
            }
            this.loading = false
          })
        }).catch(() => { this.loading = false })
      },
      getDetail () {
        this.$http.post('@ROOT_API/dfDeviceFamily/getDfDeviceFamily', {
          id: this.id
        }).then((res) => {
          if (res.data.status === '1') {
            this.ruleForm = res.data.data
            this.updateDialog = true
          } else {
            this.$message.error(res.data.msg || this.$t('common.errorMsg'))
          }
        })
      },
      exportExcel () {
        let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo')) || {}
        let url = `http://120.79.45.3:8083/efamily-institution/dfDeviceVisitor/exportDeviceFamilyList?token=${adminInfo.token ? adminInfo.token : ''}&belongSystem=3&addressId=${this.addressId}`
        window.open(url)
      },
      checkDevice (cb) {
        if (cb) cb()
        // this.$isBindDevice(this.id).then((res) => {
        //   if (res.data.status === '1') {
        //     if (cb) cb()
        //   } else if (res.data.status === '100') {
        //     this.$message({
        //       type: 'error',
        //       message: this.$t('common.networkNotLinked')
        //     })
        //   } else if (res.data.status === '101') {
        //     this.$message({
        //       type: 'error',
        //       message: this.$t('common.deviceNotLoggedIn')
        //     })
        //   } else {
        //     this.$message({
        //       type: 'error',
        //       message: this.$t('common.deviceConnectionIsAbnormal')
        //     })
        //   }
        // })
      },
      upload () {
        this.$http.post(`@ROOT_API/upload/submitFile?module=family&filePath=${this.filePath}&deviceId=${this.addressId}`, {
          module: 'family',
          filePath: this.filePath,
          addressId: this.addressId
        }).then((res) => {
          if (res.data.status === '1') {
            this.$message.success('Success')
            this.importDialog = false
            this.findData()
          } else {
            this.$message.error(res.data.msg || this.$t('common.errorMsg'))
          }
        })
      },
      uploadSuccess (filePath) {
        this.filePath = filePath
      }
    },
    mixins: [pageMixin],
    watch: {
      '$route' () {
        this.type = this.$route.name
      }
    },
    components: { UploadFile }
  }
</script>

<style lang="less" scoped>
  .home-user-manage {
    .home-user-manage-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: rgb(255, 255, 255);
      box-shadow: 0 2px 9px 0.8px rgb(238, 241, 245);
      padding: 0 40px;
    }
    .el-table {
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
</style>


