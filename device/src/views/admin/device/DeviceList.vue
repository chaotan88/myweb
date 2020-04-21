<template>
  <!-- 终端-申请终端-管理 -->
  <div class="application">
    <div class="application-wrap">
      <div class="list">
        <!-- 搜索 -->
        <div class="line">
          <el-form :inline="true" :model="searchData">
            <el-form-item>
              <el-input v-model="searchData.imei" :placeholder="$t('device.pleaseEnterIMEI')" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="search-btn" @click="pageNum = 1, findData()">
                <i class="el-icon-search"></i>
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="add-btn" @click="openBindDialog">
               {{$t("device.addNewDevice")}}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 表格 -->
        <el-table :data="itemList">
          <el-table-column type="index" :label="$t('common.index')" width="100"></el-table-column>
          <el-table-column :label="$t('device.imeiNumber')" width="180">
            <template slot-scope="props">
              <p>{{ props.row.imei}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.deviceName')" width="180">
            <template slot-scope="props">
              <p>{{ props.row.name}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.deviceModel')" width="150">
            <template slot-scope="props">
              <p>{{ props.row.type === 1 ? 'Device' : '' }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.businessBatchNumber')" width="180">
            <template slot-scope="props">
              <p>{{ props.row.businessNo }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.systemBatchNumber')" width="150">
            <template slot-scope="props">
              <p>{{ props.row.systemNo }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.inboundDate')" width="200">
            <template slot-scope="props">
              <p>{{ props.row.warehousingTime | dateFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.describeInfo')" width="150">
            <template slot-scope="props">
              <p>{{ props.row.describeInfo }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="operation" :label="$t('common.operation')" min-width="250">
            <template slot-scope="props">
              <!-- <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{$t('common.operation')}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="`1_${props.$index}`">
                    {{$t('device.remove')}}
                  </el-dropdown-item>
                  <el-dropdown-item :command="`2_${props.$index}`">
                    {{$t('menu.setting')}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
              <el-button class="detail-button" @click="remove(props.row, 2)">{{$t('device.remove')}}</el-button>
              <el-button class="detail-button" @click="settingDevice(props.row.id)">{{$t('menu.setting')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新增设备弹窗 -->
    <el-dialog
      :title="$t('device.addNewDevice')"
      :visible.sync="addDialog"
      width="480px"
      center class="grant-pop">
      <el-form :inline="true" class="demo-form-inline" label-width="130px">
        <el-form-item :label="$t('device.deviceName')" required>
          <el-input :placeholder="$t('device.deviceName')" v-model="name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.imeiNumber')" required>
          <el-input :placeholder="$t('device.pleaseEnterIMEI')" v-model="imei"></el-input>
          <!-- <el-autocomplete
            v-model="imei"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
            value="id"
            value-key="imei"
          ></el-autocomplete> -->
        </el-form-item>
        <el-form-item :label="$t('device.describeInfo')" required>
          <el-input :placeholder="$t('device.describeInfo')" v-model="describeInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">{{$t("common.cancel")}}</el-button>
        <el-button type="primary" @click="bind">{{$t("common.sure")}}</el-button>
      </span>
    </el-dialog>
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
    <ISVIP v-if="isShowVip" @close="isShowVip = false"></ISVIP>
  </div>
</template>

<script>
  import {pageMixin} from '@/mixin'
  import ISVIP from '@/views/public/IsVip.vue'
  
  export default {
    data () {
      return {
        token: '',
        applicationList: [],
        searchData: {
          imei: ''
        },
        imei: '',
        name: '',
        describeInfo: '',
        bindDevice: {},
        addDialog: false,
        importDialog: false,
        addItem: {
          imei: '',
          type: 'Device',
          businessNo: '',
          systemNo: '',
          remark: ''
        },
        isShowVip: false
      }
    },
    components: {
      ISVIP
    },
    mounted () {
      let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
      this.token = adminInfo.token
      this.findData()
    },
    methods: {
      findData () {
        this.$http.post('@ROOT_API/dfDevice/getDfDevicePage', {
          start: this.pageNum,
          pageSize: this.pageSize,
          imei: this.searchData.imei
        }).then((res) => {
          this.itemList = res.data.data.list
          this.total = res.data.data.total
        })
      },
      add () {
        let params = [{
          imei: this.addItem.imei,
          type: 1,
          businessNo: this.addItem.businessNo,
          systemNo: this.addItem.systemNo,
          remark: this.addItem.remark,
          password: this.addItem.password
        }]
        this.$http.post('@ROOT_API/dfDevice/saveOrUpdateDfDeviceList', params).then((res) => {
          if (res.data.status === '1') {
            this.$message({
              type: 'success',
              message: 'Success'
            })
            this.findData()
            this.addDialog = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
          }
        })
      },
      bind () {
        if (!this.imei) {
          this.$message({
            type: 'error',
            message: 'Please input imei'
          })
          return false
        }
        this.$http.post('@ROOT_API/dfDevice/addDeviceForUser', {
          imei: this.imei,
          name: this.name,
          describeInfo: this.describeInfo
        }).then((res) => {
          if (res.data.status === '1') {
            this.$message({
              type: 'success',
              message: 'Success'
            })
            this.findData()
            this.addDialog = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
          }
        })
      },
      remove (item) {
        if (!item.imei) return false
        this.$confirm(this.$t('common.areYouSure'), 'title', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancle',
          type: 'warning'
        }).then(() => {
          this.$http.post('@ROOT_API/dfDevice/delDeviceForUser', {
            imei: item.imei
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
        })
      },
      updateDevice (id, type) {
        if (!id) return false
        this.$http.post('@ROOT_API/dfDevice/updateBatchUseStatus', {
          ids: id,
          useStatus: type
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
      },
      settingDevice (id) {
        // this.$isBindDevice(id).then((res) => {
        //   if (res.data.status === '1') {
        //     this.$router.push(`/admin/device/deviceList/deviceSetting/${id}`)
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
          // }
        this.$router.push(`/admin/device/deviceList/deviceSetting/${id}`)
        // })
      },
      importData () {},
      downloadTemplate () {
        window.open('../../../../assets/template/device.xlsx')
      },
      querySearchAsync (queryString, cb) {
        this.$http.post('@ROOT_API/dfDevice/getDfDevicePage', {
          start: 1,
          pageSize: 99,
          imei: this.imei
        }).then((res) => {
          if (res.data.data.list) {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              cb(res.data.data.list)
            }, 3000 * Math.random())
          }
        })
      },
      handleSelect (item) {
        this.bindDevice = item
      },
      openBindDialog () {
        if (!this.$isVip()) {
          this.isShowVip = true
        } else {
          this.imei = ''
          this.name = ''
          this.describeInfo = ''
          this.addDialog = true
        }
      },
      handleCommand (item) {
        let arr = item.split('_')
        let data = this.itemList[arr[1]]
        if (arr[0] === '1') {
          this.remove(data, 2)
        } else if (arr[0] === '2') {
          this.settingDevice(data.id)
        }
      }
    },
    mixins: [pageMixin]
  }
</script>

<style lang="less" scoped>
  .application {
    .application-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: rgb(255, 255, 255);
      box-shadow: 0 2px 9px 0.8px rgb(238, 241, 245);
      padding: 0 40px;
    }
    .download-template {
      cursor: pointer;
      line-height: 36px;
      font-size: #367299;
    }
  }
</style>
<style lang="less">
.application {
  .application-wrap {
    .list .line .el-form .el-form-item .el-form-item__content .el-input input {
      width: 300px;
    }
  }
}
</style>

