<template>
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
            <!-- <el-form-item>
              <el-button class="add-btn" @click="addDialog = true">
               {{$t("device.newDeviceInbuond")}}
              </el-button>
            </el-form-item> -->
            <!-- <el-form-item>
              <el-button class="add-btn" @click="importDialog = true">
                  {{$t("common.input")}}
                </el-button>
            </el-form-item> -->
            <el-form-item>
              <el-button class="add-btn" @click="addDialogShow = true">
                  {{$t("common.new")}}
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
          <!-- <el-table-column :label="$t('device.deviceModel')" width="150">
            <template slot-scope="props">
              <p>{{ props.row.type === 1 ? '门禁设备' : '' }}</p>
            </template>
          </el-table-column> -->
          <el-table-column :label="$t('device.businessBatchNumber')" width="190">
            <template slot-scope="props">
              <p>{{ props.row.businessNo }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.systemBatchNumber')" width="180">
            <template slot-scope="props">
              <p>{{ props.row.systemNo }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.inboundDate')" width="150">
            <template slot-scope="props">
              <p>{{ props.row.warehousingTime }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="operation" :label="$t('common.operation')" min-width="120">
            <template slot-scope="props">
              <el-button class="detail-button" @click="updateDevice(props.row.id, 2)"
                v-if="props.row.useStatus === 1">Disable</el-button>
              <el-button class="detail-button" @click="updateDevice(props.row.id, 1)"
                v-else>Enable</el-button>
              <!-- <el-button class="detail-button" @click="settingDevice(props.row.id)">设置</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新增设备弹窗 -->
    <el-dialog
      :title="$t('device.newDeviceInbuond')"
      :visible.sync="addDialog"
      width="480px"
      center class="grant-pop">
      <el-form :inline="true" class="demo-form-inline" label-width="120px">
        <el-form-item :label="$t('device.imeiNumber')">
          <el-input v-model="addItem.imei" :placeholder="$t('device.pleaseEnterIMEI')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.deviceModel')">
          <el-input v-model="addItem.type" :placeholder="$t('device.deviceModel')" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.password')">
          <el-input v-model="addItem.password" :placeholder="$t('common.password')" type="password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.businessBatchNumber')">
          <el-input v-model="addItem.businessNo" :placeholder="$t('device.businessBatchNumber')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.systemBatchNumber')">
          <el-input v-model="addItem.systemNo" :placeholder="$t('device.systemBatchNumber')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.remark')">
          <el-input v-model="addItem.remark" :placeholder="$t('common.remark')" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">{{$t("common.cancel")}}</el-button>
        <el-button type="primary" @click="add">{{$t("common.sure")}}</el-button>
      </span>
    </el-dialog>
    <!-- 导入设备弹窗 -->
    <el-dialog
      :title="$t('device.newDeviceInbuond')"
      :visible.sync="importDialog"
      width="480px"
      center class="grant-pop">
      <el-form :inline="true" class="demo-form-inline" label-width="120px">
        <el-form-item :label="$t('common.selectFile')">
          <!-- <el-input v-model="addItem.imei" placeholder="请选择文件" clearable></el-input> -->
          <UploadFile @success="uploadSuccess" module="warehousing"></UploadFile>
        </el-form-item>
        <!-- <span @click="downloadTemplate" class="download-template">下载模板</span>
        <el-form-item>
        导入前请先下载导入模块，请按导入模版格式导入。
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialog = false">{{$t("common.cancel")}}</el-button>
        <el-button type="primary" @click="upload">{{$t("common.sure")}}</el-button>
      </span>
    </el-dialog>
    <!-- 分页器 -->
    <!--手工填写添加设备-->
    <el-dialog
      :title="$t('device.newDeviceInbuond')"
      :visible.sync="addDialogShow"
      width="60%"
      center class="grant-pop">
      <el-table :data="addList">
        <el-table-column type="index" :label="$t('common.index')" width="150"></el-table-column>
        <el-table-column :label="$t('device.imeiNumber')" min-width="160">
          <template slot-scope="props">
            <el-input v-model="props.row.imei"></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('common.password')" width="160">
          <template slot-scope="props">
            <el-input v-model="props.row.password" maxlength="4" show-word-limit @change="changePassword(props.$index)"></el-input>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('device.businessBatchNumber')" min-width="160">
          <template slot-scope="props">
            <el-input v-model="props.row.businessNo"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('device.systemBatchNumber')" min-width="200">
          <template slot-scope="props">
            <el-input v-model="props.row.systemNo"></el-input>
          </template>
        </el-table-column>>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogShow = false">{{$t("common.cancel")}}</el-button>
        <el-button type="primary" @click="add">{{$t("common.sure")}}</el-button>
      </span>
    </el-dialog>
    <!--手工填写添加设备-->
    <div class="pagination-wrap" v-show="total">
      <el-pagination
        layout="prev, pager, next, jumper"
        :current-page.sync="pageNum"
        :page-count="pageSize"
        :total="total"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {pageMixin} from '@/mixin'
  import UploadFile from '@/components/utils/UploadFile.vue'
  
  export default {
    data () {
      return {
        token: '',
        applicationList: [],
        searchData: {
          imei: ''
        },
        addDialog: false,
        importDialog: false,
        addItem: {
          imei: '',
          type: '门禁设备',
          businessNo: '',
          systemNo: '',
          remark: ''
        },
        addDialogShow: false,
        addList: [
          {type: 1, imei: '', password: '9999', businessNo: '', systemNo: ''},
          {type: 1, imei: '', password: '9999', businessNo: '', systemNo: ''},
          {type: 1, imei: '', password: '9999', businessNo: '', systemNo: ''},
          {type: 1, imei: '', password: '9999', businessNo: '', systemNo: ''},
          {type: 1, imei: '', password: '9999', businessNo: '', systemNo: ''}
        ],
        filePath: ''
      }
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
        let params = this.addList.filter(data => data.imei && data.password && data.businessNo && data.systemNo)
        if (!params || params.length === 0) {
          this.$message({
            type: 'error',
            message: this.$t('common.hasOneItem')
          })
          return false
        }
        // let params = [{
        //   imei: this.addItem.imei,
        //   type: 1,
        //   businessNo: this.addItem.businessNo,
        //   systemNo: this.addItem.systemNo,
        //   remark: this.addItem.remark,
        //   password: this.addItem.password
        // }]
        this.$http.post('@ROOT_API/dfDevice/saveOrUpdateDfDeviceList', params).then((res) => {
          if (res.data.status === '1') {
            this.$message({
              type: 'success',
              message: 'Success'
            })
            this.findData()
            this.addDialogShow = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
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
              type: 'success',
              message: res.data.msg
            })
          }
        })
      },
      settingDevice (id) {
        this.$router.push(`/admin/device/application/deviceSetting/${id}`)
      },
      importData () {},
      downloadTemplate () {
        window.open('../../../../assets/template/device.xlsx')
      },
      changePassword (index) {
        let item = this.addList[index]
        let password = item.password
        if (Number.isNaN(parseFloat(password))) {
          this.$message({
            type: 'error',
            message: this.$t('common.isNumber')
          })
          item.password = ''
        }
        this.$set(this.addList, index, item)
      },
      upload () {
        this.$http.post(`@ROOT_API/upload/submitFile?module=warehousing&filePath=${this.filePath}&deviceId=${this.addressId}`, {
          module: 'warehousing',
          filePath: this.filePath
        }).then((res) => {
          if (res.data.status === '1') {
            this.$message.success('Success')
            this.findData()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      uploadSuccess (filePath) {
        this.filePath = filePath
      }
    },
    mixins: [pageMixin],
    components: { UploadFile }
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

