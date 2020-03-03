<template>
  <!-- 家庭用户管理 -->
  <div class="vistor-manage">
    <div class="vistor-manage-wrap">
      <div class="list">
        <!--卡片-->
        <div class="head-cards">
          <div v-for="card in cards" :key="card.id"
            :class="currentCard === card.id ? 'card_selectes' : ''" @click="changeCard(card.id)">
            <p>{{totals[`total${card.id}`]}}{{$t('common.group')}}</p>
            <p>{{$t(card.name)}}</p>
          </div>
        </div>
        <!-- 搜索 -->
        <div class="line" style="margin-top: 0;">
          <el-form :inline="true" :model="searchData">
            <el-form-item>
              <el-input v-model="searchData.imei" :placeholder="$t('device.pleaseEnterKeyOrNumber')" clearable></el-input>
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
              <el-button class="add-btn" @click="addVistor">
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
            </el-form-item>
            <el-form-item>
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
            <span class="apartmentManager"><span class="label">{{$t('device.deviceName')}}</span>：<span></span></span>
          </div>
          <div>
            <span class="apartmentPhone"><span class="label">{{$t('device.apartmentPhone')}}</span>：<span>{{addressInfo.apartmentPhone}}</span></span>
            <span class="apartmentPhone"><span class="label">{{$t('device.addressDetail')}}</span>：<span>{{addressInfo.address}}</span></span>
            <span class="apartmentManager"><span class="label">{{$t('device.imeiNumber')}}</span>：<span>{{addressInfo.imei}}</span></span>
          </div>
        </div>
        <!-- 表格 -->
        <el-table :data="itemList">
          <el-table-column type="index" :label="$t('common.index')" width="90"></el-table-column>
          <el-table-column :label="$t('device.accessType')" width="130">
            <template slot-scope="props">
              <p v-if="props.row.accountType === 1">code</p>
              <p v-else-if="props.row.accountType === 2">phone</p>
              <p v-else-if="props.row.accountType === 3">card</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.keyPhoneCardNumbe')" width="180">
            <template slot-scope="props">
              <p v-if="props.row.accountType === 1">{{props.row.code}}</p>
              <p v-else-if="props.row.accountType === 2">{{props.row.phone}}</p>
              <p v-else-if="props.row.accountType === 3">{{props.row.card}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('log.relay')" width="90" v-if="currentCard === '1'">
            <template slot-scope="props">
              <p>{{ props.row.relay === 1 ? 'relay1' : 'relay2' }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.theEffectiveTime')" width="150" v-if="currentCard === '1'">
            <template slot-scope="props">
              <p v-if="props.row.accountType === 1">{{ props.row.delaySec }}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.useTheDate')" width="180" v-if="currentCard === '2'">
            <template slot-scope="props">
              <p>{{getWeekStr(props.row.week)}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.endTime')" width="100" v-if="currentCard === '2'">
            <template slot-scope="props">
              <p>{{ props.row.endTime }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.startTime')" width="100" v-if="currentCard === '2'">
            <template slot-scope="props">
              <p>{{ props.row.startTime }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.theEffectiveTime')" width="100" v-if="currentCard === '3'">
            <template slot-scope="props">
              <p>{{ props.row.temporaryOpenHrs }} h</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.AddModifyTime')" width="180">
            <template slot-scope="props">
              <p>{{ (props.row.updateTime || props.row.createTime) | dateFilter('YYYY-MM-DD HH:mm:ss')}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="operation" :label="$t('common.operation')">
            <template slot-scope="props">
              <el-button class="detail-button" @click="deleteItem(props.row)">{{$t('common.delete')}}</el-button>
              <el-button class="detail-button" @click="updateItem(props.row)">{{$t('common.update')}}</el-button>
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
    <!--新增、修改访客用户弹框 1:永久, 2:限时 ,3:临时-->
    <el-dialog
      :title="updateId ? $t('common.update'): $t('common.new')"
      :visible.sync="updateDialog"
      width="700px"
      center class="grant-pop"
      v-loading="loading"
      element-loading-text="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="200px" class="demo-ruleForm" v-if="currentCard === '1'">
        <ul>
          <li>
            <el-form-item :label="$t('device.accessType')" prop="accountType" >
              <el-select v-model="ruleForm1.accountType">
                  <el-option
                  v-for="item in vistorTypes"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                  </el-option>
              </el-select>
            </el-form-item>
          </li>
          <li>
            <el-form-item :label="$t('common.password')" prop="code" v-if="ruleForm1.accountType === 1">
              <el-input v-model="ruleForm1.code" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.phone')" prop="phone" v-else-if="ruleForm1.accountType === 2">
              <el-input v-model="ruleForm1.phone" :placeholder="`3-20${$t('common.characters')}`" minlength="3" maxlength="14"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.cardNo')" prop="card" v-if="ruleForm1.accountType === 3">
              <el-input v-model="ruleForm1.card" :placeholder="`3-20${$t('common.characters')}`" minlength="3" maxlength="20"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item :label="$t('log.relay')" prop="relay">
              <el-select v-model="ruleForm1.relay" :placeholder="$t('common.pleaseSelect')">
                <el-option
                v-for="item in relays"
                :key="item.id"
                :label="item.label"
                :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </li>
          <li v-if="ruleForm1.relay && ruleForm1.accountType === 1">
            <el-form-item :label="$t('common.relayTriggerTime')" prop="delaySec" >
              <el-input v-model="ruleForm1.delaySec" :placeholder="$t('common.timeIsNumber')"></el-input>
            </el-form-item>
          </li>
        </ul>
      </el-form>

      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="150px" class="demo-ruleForm" v-else-if="currentCard === '2'">
        <ul>
          <li>
            <el-form-item :label="$t('device.accessType')" prop="accountType">
              <el-select v-model="ruleForm2.accountType">
                <el-option v-for="item in vistorTypes" :key="item.id" :label="item.label" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </li>
          <li>
            <el-form-item :label="$t('common.password')" prop="code" v-if="ruleForm2.accountType === 1">
              <el-input v-model="ruleForm2.code" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.phone')" prop="phone" v-else-if="ruleForm2.accountType === 2">
              <el-input v-model="ruleForm2.phone" :placeholder="`3-20${$t('common.characters')}`" minlength="3" maxlength="14"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.cardNo')" prop="card" v-if="ruleForm2.accountType === 3">
              <el-input v-model="ruleForm2.card" :placeholder="`3-20${$t('common.characters')}`" minlength="3" maxlength="20"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item :label="$t('common.allowedUseTime')" prop="startTime" class="date-range">
              <el-input v-model="ruleForm2.startTime"
                :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" style="width: 200px;"></el-input>
              <!-- <el-time-select
                v-model="ruleForm2.startTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00'
                }"
                :placeholder="$t('common.selectTime')"
              ></el-time-select> -->
              ~
              <!-- <el-time-select
                v-model="ruleForm2.endTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00'
                }"
                :placeholder="$t('common.selectTime')"
              ></el-time-select> -->
              <el-input v-model="ruleForm2.endTime"
                :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4"  style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item  label="" prop="week" class="date-week">
              <!-- <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox> -->
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkWeek" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="week in weekOptions" :label="week" :key="week.id">{{week}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </li>
        </ul>
      </el-form>
      <el-form :model="ruleForm3" :rules="rules3" ref="ruleForm3" label-width="200px" class="demo-ruleForm" v-else-if="currentCard === '3'">
        <ul>
          <li>
            <el-form-item :label="$t('device.accessType')" prop="accountType" >
              <el-select v-model="ruleForm3.accountType">
                  <el-option
                  v-for="item in vistorTypes"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                  </el-option>
              </el-select>
            </el-form-item>
          </li>
          <li>
            <el-form-item :label="$t('common.password')" prop="code" v-if="ruleForm3.accountType === 1">
              <el-input v-model="ruleForm3.code" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.phone')" prop="phone" v-else-if="ruleForm3.accountType === 2">
              <el-input v-model="ruleForm3.phone" :placeholder="`3-20${$t('common.characters')}`" minlength="3" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.cardNo')" prop="card" v-if="ruleForm3.accountType === 3">
              <el-input v-model="ruleForm3.card" :placeholder="`3-20${$t('common.characters')}`" minlength="3" maxlength="20"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item :label="$t('common.validTime')" prop="temporaryOpenHrs" >
              <el-input v-model.number="ruleForm3.temporaryOpenHrs"></el-input>
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
          <UploadFile @success="uploadSuccess" module="visitor"></UploadFile>
        </el-form-item>
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

  // const weeks = [{ id: 1, label: 'Mo' }, { id: 2, label: 'Tu' }, { id: 3, label: 'We' },
  //   { id: 4, label: 'Th' }, { id: 5, label: 'Fr' }, { id: 6, label: 'Sa' }, { id: 7, label: 'Su' }]
  const weeks = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  export default {
    data () {
      const checkCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.$t('common.passwordIsRequired')))
        }
        setTimeout(() => {
          if (isNaN(parseFloat(value))) {
            callback(new Error(this.$t('common.pleaseSelectNumber')))
          } else {
            if (value.toString().length !== 4) {
              callback(new Error(`4${this.$t('common.characters')}`))
            } else {
              callback()
            }
          }
        }, 1000)
      }
      let validateVistorPhone = (rule, value, callback) => {
        let reg = /^[0-9/+][0-9]*$/g
        if ((value && !value.toString().match(reg))) return callback(new Error('Phone Invalid'))
        callback()
      }
      return {
        token: '',
        imei: '',
        addressId: '',
        deviceId: '',
        deviceItem: {},
        applicationList: [],
        searchData: {
          orderName: null,
          applyStatus: null
        },
        type: 'all',
        cards: [
          {
            id: '1',
            name: 'device.permanentVisitors'
          },
          {
            id: '2',
            name: 'device.limitVistors'
          }, {
            id: '3',
            name: 'device.temporaryVistors'
          }
        ],
        totals: {
          total1: 0,
          total2: 0,
          total3: 0
        },
        currentCard: '1',
        updateDialog: false,
        ruleForm1: {
          accountType: 1,
          code: '',
          phone: '',
          card: '',
          relay: '',
          delaySec: ''
        },
        ruleForm2: {
          accountType: 1,
          code: '',
          phone: '',
          card: '',
          startTime: '',
          endTime: '',
          week: ''
        },
        ruleForm3: {
          accountType: 1,
          code: '',
          phone: '',
          card: '',
          relay: '',
          temporaryOpenHrs: ''
        },
        rules1: {
          accountType: [{ required: true, trigger: 'blur' }],
          code: [
            { required: true, trigger: 'blur' },
            { validator: checkCode, trigger: 'blur' }
          ],
          phone: [
            { required: true, trigger: 'blur' },
            { min: 3, max: 20, trigger: 'blur', message: `3-14${this.$t('common.characters')}` },
            { validator: validateVistorPhone, trigger: 'blur' }
          ],
          card: [
            { required: true, trigger: 'blur' },
            { min: 3, max: 20, trigger: 'blur', message: `3-20${this.$t('common.characters')}` }
          ],
          relay: [{ required: true, trigger: 'blur' }],
          delaySec: [
            { required: true, message: `${this.$t('common.timeIsNumber')}`, trigger: 'blur' }
          ]
        },
        rules2: {
          accountType: [{ required: true, trigger: 'blur' }],
          code: [
            { required: true, trigger: 'blur' },
            { validator: checkCode, trigger: 'blur' }
          ],
          phone: [
            { required: true, trigger: 'blur' },
            { min: 3, max: 20, trigger: 'blur', message: `3-14${this.$t('common.characters')}` },
            { validator: validateVistorPhone, trigger: 'blur' }
          ],
          card: [
            { required: true, trigger: 'blur' },
            { min: 3, max: 20, trigger: 'blur', message: `3-20${this.$t('common.characters')}` }
          ],
          startTime: [{ required: true, trigger: 'blur' }],
          week: [
            { required: true, trigger: 'blur' }
          ]
        },
        rules3: {
          accountType: [{ required: true, trigger: 'blur' }],
          code: [
            { required: true, trigger: 'blur' },
            { validator: checkCode, trigger: 'blur' }
          ],
          phone: [
            { required: true, trigger: 'blur' },
            { min: 3, max: 20, trigger: 'blur', message: `3-14${this.$t('common.characters')}` },
            { validator: validateVistorPhone, trigger: 'blur' }
          ],
          card: [
            { required: true, trigger: 'blur' },
            { min: 3, max: 20, trigger: 'blur', message: `3-20${this.$t('common.characters')}` }
          ],
          temporaryOpenHrs: [{ required: true, message: `${this.$t('common.timeIsNumber')}`, trigger: 'blur' }]
        },
        vistorTypes: [{ id: 1, label: 'code' }, { id: 2, label: 'phone' }, { id: 3, label: 'card' }],
        relays: [{ id: 1, label: 'relay1' }, { id: 2, label: 'relay2' }],
        updateId: '',
        isIndeterminate: true,
        checkAll: false,
        weekOptions: weeks,
        checkWeek: [],
        importDialog: false,
        filePath: '',
        loading: false,
        addressInfo: {}
      }
    },
    mounted () {
      let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
      this.token = adminInfo.token
      this.addressId = this.$route.params.id.split('@')[0]
      this.deviceItem = JSON.parse(sessionStorage.getItem('setVistorLocation'))
      this.addressInfo = JSON.parse(sessionStorage.getItem('setVistorLocation'))
      this.getVisitorDateTypeGroupData()
      this.findData()
    },
    methods: {
      findData () {
        this.$http.post('@ROOT_API/dfDeviceVisitor/getDfDeviceVisitorPage', {
          start: this.pageNum,
          pageSize: this.pageSize,
          addressId: this.addressId,
          dateType: this.currentCard
        }).then((res) => {
          this.itemList = res.data.data.list
          this.total = res.data.data.total
        })
      },
      getVisitorDateTypeGroupData () {
        this.$http.post('@ROOT_API/dfDeviceVisitor/getVisitorDateTypeGroupData', {
          addressId: this.addressId
        }).then((res) => {
          if (res.data) {
            this.totals.total1 = res.data.data.permanentVisitorsNumber || 0
            this.totals.total2 = res.data.data.limitVisitorsNumber || 0
            this.totals.total3 = res.data.data.temporaryVisitorsNumber || 0
          }
        })
      },
      changeCard (id) {
        this.currentCard = id
        this.findData()
      },
      addVistor () {
        this.updateId = ''
        if (this.currentCard === '1') {
          this.ruleForm1 = {
            accountType: 1,
            code: '',
            phone: '',
            card: '',
            relay: '',
            delaySec: ''
          }
        } else if (this.currentCard === '2') {
          this.ruleForm2 = {
            accountType: 1,
            code: '',
            phone: '',
            card: '',
            startTime: '',
            endTime: '',
            week: ''
          }
          this.checkWeek = []
        } else if (this.currentCard === '3') {
          this.ruleForm3 = {
            accountType: 1,
            code: '',
            phone: '',
            card: '',
            relay: '',
            temporaryOpenHrs: ''
          }
        }
        this.updateDialog = true
        // let routeName = ''
        // if (this.currentCard === '1') routeName = 'addpermanentVisitors'
        // else if (this.currentCard === '2') routeName = 'addlimitVisitors'
        // else if (this.currentCard === '3') routeName = 'addtemporaryVistors'
        // this.$router.push({path: `/admin/device/manage/vistorManage/${routeName}`})
      },
      updateItem (row) {
        if (row.dateType === 1 && this.currentCard === '1') {
          this.updateId = row.id
          this.ruleForm1 = Object.assign({}, row)
          this.updateDialog = true
        } else if (row.dateType === 2 && this.currentCard === '2') {
          this.updateId = row.id
          this.ruleForm2 = Object.assign({}, row)
          // this.checkWeek = row.week.split(',')
          const week = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
          this.checkWeek = week.filter((we, index) => row.week[index] === '1')
          // row.week.split(',').forEach((we) => {
          //   if (this.checkWeek.indexOf(Number(we) === -1)) {
          //     this.checkWeek.push(Number(we))
          //   }
          // })
          console.log(this.checkWeek)
          this.updateDialog = true
        } else if (row.dateType === 3 && this.currentCard === '3') {
          this.ruleForm3 = Object.assign({}, row)
          this.updateDialog = true
        }
      },
      submitForm () {
        this.loading = true
        this.checkDevice(() => {
          let baseParams = {
            // imei: this.imei,
            addressId: this.addressId,
            sort: 1
          }
          if (this.updateId) baseParams.id = this.updateId
          let saveList = []
          if (this.currentCard === '1') {
            baseParams = Object.assign(baseParams, this.ruleForm1)
            baseParams.dateType = 1
          } else if (this.currentCard === '2') {
            baseParams = Object.assign(baseParams, this.ruleForm2)
            baseParams.dateType = 2
            // baseParams.week = this.checkWeek.join(',')
            let weekStr = weeks.map((we) => {
              if (this.checkWeek.indexOf(we) !== -1) return '1'
              return '0'
            })
            baseParams.week = weekStr.join('')
          } else if (this.currentCard === '3') {
            baseParams = Object.assign(baseParams, this.ruleForm3)
            baseParams.dateType = 3
          }
          saveList.push(baseParams)
          this.$http.post('@ROOT_API/dfDeviceVisitor/saveOrUpdateDfDeviceVisitorList', saveList).then((res) => {
            if (res.data.status === '1') {
              this.$message.success('Success')
              this.updateDialog = false
              this.findData()
              this.getVisitorDateTypeGroupData()
            } else {
              this.$message.error(res.data.msg || this.$t('common.errorMsg'))
            }
            this.loading = false
          })
        })
      },
      clear () {
        this.$confirm(this.$t('common.clearVistorrSure'), 'title', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancle',
          type: 'warning'
        }).then(() => {
          this.$http.post('@ROOT_API/dfDeviceVisitor/clearDfDeviceVisitor', {
            addressId: this.addressId,
            dateType: parseFloat(this.currentCard),
            accountType: ''
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
      },
      onlyClearDevice () {
        this.$confirm(this.$t('common.areYouSure'), 'title', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancle',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.post('@ROOT_API/dfDeviceVisitor/synchronizedClearDfDeviceVisitor', {
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
          this.$http.post('@ROOT_API/dfDeviceVisitor/synchronizedDfDeviceVisitorToDevice', {
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
          this.$http.post('@ROOT_API/dfDeviceVisitor/pushFetchVisitor', {
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
      deleteSubmit (row) {
        this.checkDevice(() => {
          let params = {
            ids: row.id
          }
          this.$http.post('@ROOT_API/dfDeviceVisitor/deleteBatchDfDeviceVisitor', params).then((res) => {
            if (res.data.status === '1') {
              this.$message.success('Success')
              this.findData()
              this.getVisitorDateTypeGroupData()
            } else {
              this.$message.error(res.data.msg || this.$t('common.errorMsg'))
            }
          })
        })
      },
      handleCheckAllChange (val) {
        this.checkWeek = val ? weeks : []
        this.checkWeek = this.checkWeek.map(we => we.id)
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.weekOptions.length
        this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.checkWeek.length
      },
      getWeekStr (ids) {
        if (!ids) return ''
        // const week = ['一', '二', '三', '四', '五', '六', '日']
        // if (ids.split(',') === 7) return '全部'
        // let str = ids.split(',').map(id => week[id]).join('、')
        // return `周${str}`
        const week = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
        let arr = week.map((we, index) => ids[index] === '1' ? we : '')
        return arr.join(' ')
      },
      exportExcel () {
        let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo')) || {}
        let url = `http://120.79.45.3:8083/efamily-institution/dfDeviceVisitor/exportDfDeviceVisitor?token=${adminInfo.token ? adminInfo.token : ''}&belongSystem=3&addressId=${this.addressId}`
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
        //     this.loading = false
        //   } else if (res.data.status === '101') {
        //     this.$message({
        //       type: 'error',
        //       message: this.$t('common.deviceNotLoggedIn')
        //     })
        //     this.loading = false
        //   } else {
        //     this.$message({
        //       type: 'error',
        //       message: this.$t('common.deviceConnectionIsAbnormal')
        //     })
        //     this.loading = false
        //   }
        // })
      },
      upload () {
        this.$http.post(`@ROOT_API/upload/submitFile?module=visitor&filePath=${this.filePath}&deviceId=${this.addressId}`, {
          module: 'visitor',
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
  .vistor-manage {
    .vistor-manage-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: rgb(255, 255, 255);
      box-shadow: 0 2px 9px 0.8px rgb(238, 241, 245);
      padding: 0 40px;
      .head-cards {
        display: flex;
        padding-top: 20px;
        div {
          width: 33%;
          height: 80px;
          margin-right: 40px;
          color: #333333;
          background: #C6EEE7;
          cursor: pointer;
          p {
            text-align: center;
          }
          p:nth-child(1) {
            margin-top: 20px;
          }
        }
        .card_selectes {
          background: #53CDB5
        }
      }
    }
  }
</style>
<style lang="less">
.date-week {

}
</style>
