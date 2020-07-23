<template>
  <div class="device-setting"
    v-loading="loading"
    element-loading-text="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-form ref="ruleForm1" :rules="rules" :model="deviceInfo">
      <div class="first-row">
        <div class="col1">
          <div class="row1-col1">
            <div class="item1">
              <img-view src="phone1.png"/>
              <!-- <span>{{$t("device.phone1")}}</span> -->
              <el-input v-model="deviceInfo.familyCallTime1"
                :placeholder="`4${$t('common.characters')}`" minlength="3" maxlength="30"
                >
              </el-input>
              <tips title="Ringing time for first phone number of families, ringing time can be 1-99 seconds, default time is 20 seconds."></tips>
            </div>
            <div class="item2">
              <!-- <span>{{$t("device.phone2")}}</span> -->
              <img-view src="phone2.png"/>
              <el-input v-model="deviceInfo.familyCallTime2"
                :placeholder="`4${$t('common.characters')}`" minlength="3" maxlength="30"
                >
              </el-input>
              <tips title="Ringing time for second phone number of families, ringing time can be 1-99 seconds, default time is 20 seconds."></tips>
            </div>
            <div class="item3">
              <!-- <span>{{$t("device.phone3")}}</span> -->
              <img-view src="phone3.png"/>
              <el-input v-model="deviceInfo.familyCallTime3"
                :placeholder="`4${$t('common.characters')}`" minlength="3" maxlength="30"
                >
              </el-input>
              <tips title="PhonRinging time for third phone number of families, ringing time can be 1-99 seconds, default time is 20 seconds."></tips>
            </div>
          </div>
          <div class="row1-col1">
            <div class="item1">
              <img-view src="volume.png"/>
              <el-input v-model="deviceInfo.spkVol"
                :placeholder="`1~9${$t('common.positiveInteger')}`"
                >
              </el-input>
              <tips title="Volume of speaker"></tips>
            </div>
            <div class="item2">
              <img-view src="mic.png"/>
              <el-input v-model="deviceInfo.micVol"
                :placeholder="`1~9${$t('common.positiveInteger')}`"
                >
              </el-input>
              <tips title="Volume of microphone"></tips>
            </div>
          </div>
          <div class="row1-col1">
            <div class="radio-item">
              <img-view src="whiteList.png"/>
              <div class="white-list">
                <div class="radio1">
                  <el-radio v-model="deviceInfo.cid" :label="0">0</el-radio>
                  <el-radio v-model="deviceInfo.cid" :label="1">1</el-radio>
                  <tips title="Caller ID for residents"></tips>
                </div>
                <div class="radio2">
                  <el-radio v-model="deviceInfo.monitor" :label="0">0</el-radio>
                  <el-radio v-model="deviceInfo.monitor" :label="1">1</el-radio>
                  <tips title="Latching ability by residents"></tips>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col2">
          <div class="row1-col2">
            <div class="item1">
              <img-view src="loudongxiaoquguanliyuancaozuomima.png"/>
              <el-input v-model="deviceInfo.managerCode"
                :placeholder="`4${$t('common.characters')}`"
                minlength="4"
                maxlength="4"
                >
              </el-input>
              <tips title="Manager programming code"></tips>
            </div>
            <div class="item2">
              <img-view src="shebeiguanliyuancaozuomima.png"/>
              <el-input v-model="deviceInfo.engineersCode"
                :placeholder="`4${$t('common.characters')}`"
                minlength="4"
                maxlength="4"
                >
              </el-input>
              <tips title="Engineer programming code"></tips>
            </div>
          </div>
          <div class="row1-col2">
            <div class="item1">
              <img-view src="relayTriggerTime1.png"/>
              <el-input v-model="deviceInfo.relay1Time"
                :placeholder="`1~9999${$t('common.positiveInteger')}`"
                >
              </el-input>
              <tips title="Relay 1 trigger time"></tips>
            </div>
            <div class="item2">
              <img-view src="relayTriggerTime2.png"/>
              <el-input v-model="deviceInfo.relay2Time"
                :placeholder="`1~9999${$t('common.positiveInteger')}`"
                >
              </el-input>
              <tips title="Relay 2 trigger time"></tips>
            </div>
          </div>
          <div class="row1-col2">
            <div class="item1">
              <img-view src="localphoneNumber.png"/>
              <el-form-item prop="localNumber">
                <el-input v-model="deviceInfo.localNumber"
                  minlength="3" maxlength="30"
                  >
                </el-input>
              </el-form-item>
              <tips title="local phone number"></tips>
            </div>
            <div class="item2">
              <img-view src="jiaoduishijian.png"/>
              <el-input v-model="deviceInfo.msgIntervalDay"
                :placeholder="`4${$t('common.characters')}`"
                minlength="3"
                maxlength="30"
                >
              </el-input>
              <tips title="Activate auto SMS sending(to re-calibrate time every day)"></tips>
            </div>
          </div>
          <div class="row1-col2">
            <!-- <div class="item1">
              <img-view src="managerPhone.png"/>
              <el-input v-model="deviceInfo.managerCallTime"
                minlength="3"
                maxlength="30"
                >
              </el-input>
              <tips title="Manager phone numbe"></tips>
            </div> -->
            <div class="item2">
              <img-view src="ringingTimeManagerPhone.png"/>
              <el-input v-model="deviceInfo.managerCallTime"
                minlength="3"
                maxlength="30"
                >
              </el-input>
              <tips title="Ringing time for manager phone number"></tips>
            </div>
          </div>
        </div>
        <div class="col3" style="display: flex;">
          <div>
            <img src="../../../../../static/img/device/table1.png" style="width: 40px; height: 40px; margin-top: 213px;"/>
            <tips title="Auto relay trigger times" style="margin-left: 15px;"></tips>
            <img src="../../../../../static/img/device/btn1_2.png"
              style="width: 25px; height: 25px; margin-left: 8px; margin-top: 130px; cursor: pointer;"
              @click="delInpuData('table')"/>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%"
            class="setting-table"
            height="450">
            <el-table-column type="index" label="" width="25"></el-table-column>
            <el-table-column label="TRIG" width="45">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.trig" @change="changeRadio(scope.$index, 'trig')">
                  <el-radio label="1">{{''}}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="LATCH" width="55">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.latch" @change="changeRadio(scope.$index, 'latch')">
                  <el-radio label="1">{{''}}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="UNLATCH" width="65">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.unlatch" @change="changeRadio(scope.$index, 'unlatch')">
                  <el-radio label="1">{{''}}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label=""
              width="90">
              <template slot="header">
                <i class="iconfont el-icon-time"></i>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.time" minlength="4" maxlength="4"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Mo" min-width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.mo"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Tu" min-width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.tu"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="We" min-width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.we"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Th" min-width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.th"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Fr" min-width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.fr"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Sa" min-width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.sa"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Su" min-width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.su"></el-checkbox>
              </template>
            </el-table-column>
              <!-- <el-table-column label="TRIG  | LATCH  | UNLATCH" align="center" width="200">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.type">
                    <el-radio label="100">{{''}}</el-radio>
                    <el-radio label="010">{{''}}</el-radio>
                    <el-radio label="001">{{''}}</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
              <el-table-column :label="$t('device.time')" align="center">
                <el-table-column
                  prop="time"
                  label=""
                  width="100">
                  <template slot="header">
                    <i class="iconfont el-icon-time"></i>
                  </template>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.time" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column :label="$t('device.useTheDate')" align="center">
                <template slot-scope="scope">
                  <el-checkbox-group v-model="scope.row.checkedWeek" @change="rowWeekChange(scope.row, scope.$index)">
                    <el-checkbox v-for="week in weeks" :label="week.id" :key="week.id">{{week.label}}</el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-table-column> -->
            </el-table>
        </div>
      </div>
      <div class="second-row">
        <div class="col1">
          <div class="row1">
            <div class="item1">
              <img-view src="xinhaoqiangdu.png"/>
              <div class="top-label">1-31</div>
              <el-input v-model="deviceInfo.rssi"
                placeholder="1-31"
                readonly>
              </el-input>
              <tips title="rssi"></tips>
            </div>
            <div class="item2">
              <div class="top-label">3G/4G</div>
              <el-input v-model="deviceInfo.mode"
                placeholder="3G/4G"
                readonly>
              </el-input>
              <!-- <tips title="mode"></tips> -->
            </div>
          </div>
          <div class="row2">
            <img-view src="imei.png"/>
            <el-input v-model="deviceInfo.imei" readonly></el-input>
          </div>
          <div class="row3">
            <img-view src="apn.png"/>
            <el-input v-model="deviceInfo.apn" readonly></el-input>
          </div>
        </div>
        <div class="col2">
          <div class="row1">
            <div class="item1">
              <!-- <img-view src="welcome.png"/> -->
              <div style="color: #33719b; margin-right: 2px; width: 95px;">Welcome
                <el-checkbox v-model="isCenter">Centered</el-checkbox>
                <div style="display: flex;">
                  <i class="icon-font el-icon-zoom-in" style="margin: auto 0; cursor: pointer;"
                    title="preview" @click="previewDialog = true; setLCDWidth()"></i>
                  <tips title="LCD welcome interface, 64 characters in Max. # is not accepted."></tips>
                </div>
              </div>
              <el-tabs v-model="activeName" class="input-arr" type="card">
                <el-tab-pane label="LCD1" name="first">
                  <div class="input-arr1">
                    <el-input width="200" v-model="lcd1" maxlength='16'></el-input>
                    <el-input v-model="lcd2" maxlength='16'></el-input>
                    <el-input v-model="lcd3" maxlength='16'></el-input>
                    <el-input v-model="lcd4" maxlength='16'></el-input>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="LCD2" name="second">
                  <div class="input-arr2">
                    <el-input v-model="lcd5" maxlength='16'></el-input>
                    <el-input v-model="lcd6" maxlength='16'></el-input>
                    <el-input v-model="lcd7" maxlength='16'></el-input>
                    <el-input v-model="lcd8" maxlength='16'></el-input>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <!-- <el-input v-model="deviceInfo.welcome"
                :placeholder="$t('common.upto64Chart')"
                type="textarea"
                :rows="8"
                :cols="16"
                @change="welcomeChange()"
                >
              </el-input> -->
            </div>
          </div>
          <div class="row2">
            <!-- <img-view src="jiamixianshi.png"/> -->
            <div style="font-size: 27px; margin-right: 23px; color: #33719b;">***_</div>
            <el-radio v-model="deviceInfo.encryptDisp" :label="0">0</el-radio>
            <el-radio v-model="deviceInfo.encryptDisp" :label="1">1</el-radio>
            <tips title="Encryption display"></tips>
          </div>
        </div>
        <div class="col3">
          <!-- <img src="../../../../../static/img/device/allowedCallTime22.png"/> -->
          <div class="allowed-call-time">
            <div class="red-line"></div>
            <div class="red-line"></div>
            <img src="../../../../../static/img/device/call1.png"/>
            <div class="red-line"></div>
            <div class="red-line"></div>
            <div class="red-line"></div>
            <div class="red-line"></div>
            <div class="green-line">
              <div class="green-line"></div>
            </div>
            <div class="green-line"></div>
            <div class="green-line"></div>
            <div class="green-line"></div>
            <div class="green-line"></div>
            <div class="green-line"></div>
            <img src="../../../../../static/img/device/call2.png"/>
            <div class="green-line"></div>
            <div class="green-line"></div>
            <div class="green-line"></div>
            <div class="green-line"></div>
            <div class="green-line"></div>
            <div class="green-line">
              <div class="green-line"></div>
            </div>
            <div class="red-line"></div>
            <div class="red-line"></div>
            <div class="red-line"></div>
            <div class="red-line"></div>
            <img src="../../../../../static/img/device/call1.png"/>
            <div class="red-line"></div>
            <div class="red-line"></div>
          </div>
          <div class="row1">
            <el-input v-model="deviceInfo.doNotStartTime" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable class="left-input"></el-input>
            <el-input v-model="deviceInfo.doNotEndTime" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable class="right-input"></el-input>
          </div>
          <div class="row2">
            <tips title="Do not Disturb" style="line-height: 25px; margin-right: 15px;"></tips>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="week in weeks" :label="week.id" :key="week.id">{{week.label}}</el-checkbox>
            </el-checkbox-group>
            <img src="../../../../../static/img/device/btn1_2.png"
              style="width: 20px; height: 20px; cursor: pointer;"
              @click="delInpuData('week')"/>
          </div>
        </div>
      </div>
      <div class="buttons">
        <div class="buttons-container">
          <div  @click="restoreDefaultSetting()" title="Restore default settings" class="button_css_setting">
            <img src="../../../../../static/img/device/btn1_1.png"/>
            <img src="../../../../../static/img/device/btn1_2.png" style="margin: 0 -7px;"/>
            <img src="../../../../../static/img/device/btn11.png"/>
          </div>
          <!-- <div @click="syncData()" title="Synchro Data To Device">
            <img src="../../../../../static/img/device/push.png"/>
          </div> -->
          <!-- <div @click="importDialog = true">
            <img src="../../../../../static/img/device/btn31.png"/>
          </div> -->
          <div @click="save" title="Save" class="button_css_setting">
            <img src="../../../../../static/img/device/btn41.png"/>
          </div>
          <div @click="upgrade" title="Upgrade" class="button_css_setting">
            <img src="../../../../../static/img/device/btn21.png"/>
          </div>
          <!-- <div @click="syncDataToServe" title="Synchro Data To Server">
            <img src="../../../../../static/img/device/sync.png"/>
          </div> -->
        </div>
      </div>
    </el-form>
        <!-- 导入设备弹窗 -->
    <el-dialog
      :title="$t('menu.setting')"
      :visible.sync="importDialog"
      width="480px"
      center class="grant-pop"
      v-loading="loading"
      element-loading-text="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form :inline="true" class="demo-form-inline" label-width="120px">
        <el-form-item :label="$t('common.selectFile')">
          <!-- <el-input v-model="addItem.imei" placeholder="请选择文件" clearable></el-input> -->
          <UploadFile @success="uploadSuccess"></UploadFile>
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
    <el-dialog
      title="Preview"
      :visible.sync="previewDialog"
      width="480px"
      center class="grant-pop">
      <div class="led-item-container-left" v-if="!isCenter">
        <div class="led-item">
          <p class="title">LCD1</p>
            <p class="lcd-content" :style="{width: lcdWidth}">{{lcd1}}</p>
            <p class="lcd-content" :style="{width: lcdWidth}">{{lcd2}}</p>
            <p class="lcd-content" :style="{width: lcdWidth}">{{lcd3}}</p>
            <p class="lcd-content" :style="{width: lcdWidth}">{{lcd4}}</p>
        </div>
        <div class="led-item">
          <p class="title">LCD2</p>
          <p class="lcd-content" :style="{width: lcdWidth}">{{lcd5}}</p>
          <p class="lcd-content" :style="{width: lcdWidth}">{{lcd6}}</p>
          <p class="lcd-content" :style="{width: lcdWidth}">{{lcd7}}</p>
          <p class="lcd-content" :style="{width: lcdWidth}">{{lcd8}}</p>
        </div>
      </div>
      <div class="led-item-container" v-else>
        <div class="led-item">
          <p class="title">LCD1</p>
            <div class="lcd-content">
              <p>{{lcd1}}</p>
              <p>{{lcd2}}</p>
              <p>{{lcd3}}</p>
              <p>{{lcd4}}</p>
            </div>
        </div>
        <div class="led-item">
          <p class="title">LCD2</p>
            <div class="lcd-content">
              <p>{{lcd5}}</p>
              <p>{{lcd6}}</p>
              <p>{{lcd7}}</p>
              <p>{{lcd8}}</p>
            </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="previewDialog = false">{{$t('common.sure')}}</el-button>
      </span>
    </el-dialog>
    <Progress v-if="showProgress" :id="addressId" :syncType="3" @success="finished"></Progress>
  </div>
</template>

<script>
  import UploadFile from '@/components/utils/UploadFile.vue'
  import ImgView from '@/components/utils/ImgView.vue'
  import Tips from '@/components/utils/Tips.vue'
  import Progress from '@/components/utils/Progress.vue'

  const weekOptions = [{ id: 1, label: 'Mo' }, { id: 2, label: 'Tu' }, { id: 3, label: 'We' },
    { id: 4, label: 'Th' }, { id: 5, label: 'Fr' }, { id: 6, label: 'Sa' }, { id: 7, label: 'Su' }]
  export default {
    data () {
      let validateVistorPhone = (rule, value, callback) => {
        let reg = /^[0-9/+][0-9]*$/g
        if ((value && !value.toString().match(reg))) return callback(new Error('Phone Invalid'))
        callback()
      }
      return {
        id: '',
        deviceInfo: {},
        checkAll: false,
        checkedCities: [],
        weeks: weekOptions,
        isIndeterminate: true,
        tableData: [],
        startTime: '',
        endTime: '',
        deviceNetStatus: 0,
        importDialog: false,
        fileAddress: '',
        loading: false,
        rules: {
          localNumber: [
            { validator: validateVistorPhone, trigger: 'blur' }
          ]
        },
        previewDialog: false,
        led1Arr: ['', '', '', ''],
        led2Arr: ['', '', '', ''],
        led1: '',
        led2: '',
        isLeft: true,
        led1Lineheight: 'unset',
        led2Lineheight: 'unset',
        isCenter: true,
        lcd1: '',
        lcd2: '',
        lcd3: '',
        lcd4: '',
        lcd5: '',
        lcd6: '',
        lcd7: '',
        lcd8: '',
        lcdWidth: '150px',
        activeName: 'first',
        showProgress: false,
        addressId: ''
      }
    },
    mounted () {
      if (this.$route.params.id.indexOf('@') !== -1) {
        this.id = this.$route.params.id.split('@')[1]
        this.addressId = this.$route.params.id.split('@')[0]
      } else {
        this.id = this.$route.params.id
      }
      this.findData()
    },
    methods: {
      findData () {
        this.loading = true
        this.$http.post('@ROOT_API/dfDeviceSettings/getDfDeviceSettings', {
          deviceId: this.id
        }).then((res) => {
          this.deviceInfo = res.data.data || {}
          this.deviceInfo.encryptDisp = res.data.data.encryptDisp || 0
          this.deviceInfo.cid = res.data.data.cid || 0
          this.deviceInfo.monitor = res.data.data.monitor || 0
          this.setDoNotWeek()
          this.setAutoRelatTrig()
          this.loading = false
          this.setLcdStr()
          this.welcomeChange()
          // this.startTime = this.setTime(this.deviceInfo.doNotStartTime)
          // this.endTime = this.setTime(this.deviceInfo.doNotEndTime)
        })
      },
      setTime (val) {
        return (!val || val.length < 4) ? val : `${val.substring(0, 2)}:${val.substring(2, 2)}`
      },
      handleCheckedCitiesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.weeks.length
        this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.weeks.length
      },
      addItem () {
        this.tableData.push({ type: '100', checkedWeek: [] })
      },
      save (type) {
        this.loading = true
        let params = {}
        if (type === 'default') {
          params = {
            'deviceId': this.id,
            id: this.deviceInfo.id,
            imei: this.deviceInfo.imei,
            'version': '1',
            'rssi': '1',
            'mode': '4G',
            'apn': 'APN',
            'welcome': '',
            'encryptDisp': 0,
            'cid': 0,
            'monitor': 0,
            'engineersCode': '9999',
            'managerCode': '5555',
            'spkVol': 5,
            'micVol': 5,
            'relay1Time': 2,
            'relay2Time': 2,
            'localNumber': '13400002222',
            'msgIntervalDay': 30,
            'familyCallTime1': 20,
            'familyCallTime2': 20,
            'familyCallTime3': 20,
            'managerCallTime': 60,
            'autoRelayTrig': '001#1200#0000000_001#1200#0000000_001#1200#0000000_001#1200#0000000_001#1200#0000000_001#1200#0000000_001#1200#0000000_001#1200#0000000_001#1200#0000000',
            'doNotStartTime': '0010',
            'doNotEndTime': '1200',
            'doNotWeek': '1110001',
            'doNotDisturb': '0010#1200#1110001'
          }
        } else {
          params = {
            deviceId: this.id,
            id: this.deviceInfo.id,
            imei: this.deviceInfo.imei,
            rssi: this.deviceInfo.rssi,
            mode: this.deviceInfo.mode,
            apn: this.deviceInfo.apn,
            // welcome: this.deviceInfo.welcome,
            welcome: this.getWelcomeStr(),
            encryptDisp: this.deviceInfo.encryptDisp,
            cid: this.deviceInfo.cid,
            monitor: this.deviceInfo.monitor,
            engineersCode: this.deviceInfo.engineersCode,
            managerCode: this.deviceInfo.managerCode,
            spkVol: this.deviceInfo.spkVol,
            micVol: this.deviceInfo.micVol,
            relay1Time: this.deviceInfo.relay1Time,
            relay2Time: this.deviceInfo.relay2Time,
            localNumber: this.deviceInfo.localNumber,
            msgIntervalDay: this.deviceInfo.msgIntervalDay,
            familyCallTime1: this.deviceInfo.familyCallTime1,
            familyCallTime2: this.deviceInfo.familyCallTime2,
            familyCallTime3: this.deviceInfo.familyCallTime3,
            managerCallTime: this.deviceInfo.managerCallTime,
            doNotDisturb: this.getDoNotDisturb(),
            doNotStartTime: this.deviceInfo.doNotStartTime,
            doNotEndTime: this.deviceInfo.doNotEndTime,
            doNotWeek: this.getDoNotWeek(),
            autoRelayTrig: this.getAutoRelayTrig()
          }
        }
        this.checkDevice(() => {
          this.$http.post('@ROOT_API/dfDeviceSettings/saveOrUpdateDfDeviceSettings', params).then((res) => {
            if (res.data.status === '1') {
              this.$message.success('Success')
              // this.$router.go(-1)
            } else {
              this.$message.error(res.data.msg || this.$t('common.errorMsg'))
            }
            this.loading = false
          }, () => (this.loading = false))
        })
        // this.$http.post('@ROOT_API/dfDeviceSettings/saveOrUpdateDfDeviceSettings', params).then((res) => {
        //   if (res.data.status === '1') {
        //     this.$message.success('Success')
        //     this.$router.go(-1)
        //   } else {
        //     this.$message.error(res.data.msg)
        //   }
        // })
      },
      restoreDefaultSetting () {
        this.checkDevice(() => {
          this.$http.post('@ROOT_API/dfDeviceSettings/recoveryDeviceDefaultSettings', { deviceId: this.id }).then((res) => {
            if (res.data.status === '1') {
              this.$message.success('Success')
            } else {
              this.$message.error(res.data.msg || this.$t('common.errorMsg'))
            }
            this.loading = false
            this.findData()
          }, () => (this.loading = false))
        })
      },
      getDoNotDisturb () {
        return `${this.deviceInfo.doNotStartTime}#${this.deviceInfo.time || ''}#${this.getDoNotWeek()}`
      },
      getDoNotWeek () {
        let str = ''
        for (let i = 1; i < 8; i++) {
          if (this.checkedCities.indexOf(i) !== -1) {
            str += `1`
          } else {
            str += '0'
          }
        }
        return str
      },
      getAutoRelayTrig () {
        return this.tableData.map(data => `${this.getType(data)}#${data.time}#${this.getDoNotWeekForRow(data)}`).join('_')
      },
      getDoNotWeekForRow (data) {
        const weeks = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']
        let str = ''
        weeks.forEach(we => {
          str += data[we] ? '1' : '0'
        })
        return str
      },
      getType (data) {
        if (data.trig === '1') return '100'
        else if (data.latch === '1') return '010'
        else return '001'
      },
      delInpuData (type) {
        if (type === 'table') {
          this.tableData.forEach(da => {
            da.trig = '1'
            da.latch = '0'
            da.unlatch = '0'
            da.time = ''
            da.mo = false
            da.tu = false
            da.we = false
            da.th = false
            da.fr = false
            da.sa = false
            da.su = false
          })
        } else if (type === 'week') {
          this.deviceInfo.doNotStartTime = ''
          this.deviceInfo.doNotEndTime = ''
          this.checkedCities = []
        }
      },
      setAutoRelatTrig () {
        let newData = []
        let trigArr = this.deviceInfo.autoRelayTrig.split('_')
        trigArr.forEach(trig => {
          if (trig) {
            let tarr = trig.split('#')
            const mapping = {
              trig: '100',
              latch: '010',
              unlatch: '001'
            }
            newData.push({
              trig: tarr[0] === mapping.trig ? '1' : 0,
              latch: tarr[0] === mapping.latch ? '1' : 0,
              unlatch: tarr[0] === mapping.unlatch ? '1' : 0,
              time: tarr[1],
              mo: tarr[2][0] === '1',
              tu: tarr[2][1] === '1',
              we: tarr[2][2] === '1',
              th: tarr[2][3] === '1',
              fr: tarr[2][4] === '1',
              sa: tarr[2][5] === '1',
              su: tarr[2][6] === '1'
            })
          }
        })
        let len = newData.length
        for (let i = 0; i < 9 - len; i++) {
          newData.push({
            trig: '1',
            latch: 0,
            unlatch: '',
            time: '',
            mo: false,
            tu: false,
            we: false,
            th: false,
            fr: false,
            sa: false,
            su: false
          })
        }
        this.tableData = newData
      },
      setDoNotWeek () {
        let currentWeeks = this.deviceInfo.doNotWeek
        let newChecked = []
        for (let i = 0; i < 7; i++) {
          if (currentWeeks[i] === '1') {
            newChecked.push(i + 1)
          }
        }
        this.checkedCities = newChecked
      },
      checkDevice (cb) {
        if (cb) cb()
        // this.$isBindDevice(this.id).then((res) => {
        //   if (res.data.status === '1') {
        //     this.deviceNetStatus = 4
        //     if (cb) cb()
        //   } else if (res.data.status === '100') {
        //     this.deviceNetStatus = 1
        //     this.$message({
        //       type: 'error',
        //       message: this.$t('common.networkNotLinked')
        //     })
        //     this.loading = false
        //   } else if (res.data.status === '101') {
        //     this.deviceNetStatus = 2
        //     this.$message({
        //       type: 'error',
        //       message: this.$t('common.deviceNotLoggedIn')
        //     })
        //     this.loading = false
        //   } else {
        //     this.deviceNetStatus = 3
        //     this.$message({
        //       type: 'error',
        //       message: this.$t('common.deviceConnectionIsAbnormal')
        //     })
        //     this.loading = false
        //   }
        // })
      },
      syncData () {
        this.$confirm(this.$t('common.areYouSure'), 'title', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancle',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.post('@ROOT_API/dfDeviceSettings/synchronizedDfDeviceSettings', {
            id: this.deviceInfo.id
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
      syncDataToServe () {
        this.$confirm(this.$t('common.areYouSure'), 'title', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancle',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.post('@ROOT_API/dfDeviceSettings/pushFetchDeviceSettings', {
            id: this.deviceInfo.id
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
      upload () {
        this.loading = true
        this.$http.post(`@ROOT_API/upload/submitFile?module=setting&filePath=${this.fileAddress}&deviceId=${this.id}`, {
          module: 'setting',
          filePath: this.fileAddress,
          deviceId: this.id
        }).then((res) => {
          if (res.data.status === '1') {
            this.$message.success('Success')
            this.$router.go(-1)
          } else {
            this.$message.error(res.data.msg || this.$t('common.errorMsg'))
          }
          this.loading = false
        })
      },
      uploadSuccess (fileAddress, fileName) {
        this.fileAddress = fileAddress
        this.fileName = fileName
      },
      changeRadio (index, type) {
        const radios = ['trig', 'latch', 'unlatch']
        let item = this.tableData[index]
        radios.forEach(ra => {
          if (ra !== type) {
            item[ra] = 0
          }
        })
        this.$set(this.tableData, index, item)
      },
      welcomeChange () {
        let arr = this.deviceInfo.welcome.split('\n')
        this.led1Arr = arr.slice(0, 4)
        if (arr.length > 4) {
          this.led2Arr = arr.slice(4, 8)
        } else {
          this.led2Arr = []
        }
        this.setSpace()
      },
      setSpace () {
        // const setSpaceFun = (key) => {
        //   this[key][3] = ''
          // for (let i = 0; i <= 4 - this[key].length; i++) {
          //   this[key].push('')
          // }
        // }
        const setLongs = (key) => {
          for (let i = 0; i < this[key].length; i++) {
            let item = this[key][i]
            if (item && item.toString().length > 16) {
              this.$set(this[key], i, item.substr(0, 16))
            }
          }
        }
        const setIsLeft = () => {
          if (this.led1Arr.length > 0) {
            let [item] = this.led1Arr
            if (item.substr(0, 1) === '=') {
              this.isLeft = false
              this.$set(this.led1Arr, 0, item.replace('=', ''))
            } else {
              this.isLeft = true
            }
          }
        }
        // if (this.led1Arr.length < 4) {
        //   setSpaceFun('led1Arr')
        // }
        // if (this.led2Arr.length < 4) {
        //   setSpaceFun('led2Arr')
        // }
        setLongs('led1Arr')
        setLongs('led2Arr')
        setIsLeft()
        if (!this.isLeft) {
          const lineHeights = [1, 60, 35, 23, 18]
          this.led1Lineheight = `${lineHeights[this.led1Arr.length]}px`
          this.led2Lineheight = `${lineHeights[this.led2Arr.length]}px`
        }
        this.led1 = this.led1Arr.join('</br>')
        this.led2 = this.led2Arr.join('</br>')
      },
      setLcdStr () {
        let arr = this.deviceInfo.welcome.split('/')
        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            this[`lcd${i + 1}`] = arr[i].replace('=', '')
          } else {
            this[`lcd${i + 1}`] = arr[i]
          }
          this.isCenter = arr[0].indexOf('=') !== -1
        }
      },
      getWelcomeStr () {
        let ledArr = []
        // if (this.isCenter) {
        //   if (this.lcd1) ledArr.push(this.lcd1)
        //   if (this.lcd2) ledArr.push(this.lcd2)
        //   if (this.lcd3) ledArr.push(this.lcd3)
        //   if (this.lcd4) ledArr.push(this.lcd4)
        // } else {
        ledArr.push(this.lcd1 || '')
        ledArr.push(this.lcd2 || '')
        ledArr.push(this.lcd3 || '')
        ledArr.push(this.lcd4 || '')
        ledArr.push(this.lcd5 || '')
        ledArr.push(this.lcd6 || '')
        ledArr.push(this.lcd7 || '')
        ledArr.push(this.lcd8 || '')
        // }
        return this.isCenter ? `=${ledArr.join('/')}/` : `${ledArr.join('/')}/`
      },
      setLCDWidth () {
        const getStrWidth = (str) => {
          let el = document.createElement('div')
          el.innerHTML = str
          el.style.fontSize = '16px'
          el.style.float = 'left'
          el.style.position = 'absolute'
          document.body.appendChild(el)
          let wd = el.clientWidth
          el.remove()
          return wd
        }
        const arr = [
          getStrWidth(this.lcd1),
          getStrWidth(this.lcd2),
          getStrWidth(this.lcd3),
          getStrWidth(this.lcd4),
          getStrWidth(this.lcd5),
          getStrWidth(this.lcd6),
          getStrWidth(this.lcd7),
          getStrWidth(this.lcd8),
          getStrWidth('ssssssssssssssss')
        ]
        const getMax = (pre, next) => {
          return Math.max(pre, next)
        }
        let max = arr.reduce(getMax)
        this.lcdWidth = `${max + 2}px`
        console.log(arr, this.lcdWidth)
      },
      upgrade () {
        this.$confirm(this.$t('common.areYouSure'), 'title', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancle',
          type: 'warning'
        }).then(() => {
          this.$http.post('@ROOT_API/dfDeviceSettings/upgradeDeviceVersion', {
            deviceId: this.id
          }).then((res) => {
          })
          this.showProgress = true
        })
      },
      finished (val) {
        if (parseInt(val) === 2) {
          this.$message({
            type: 'success',
            message: 'Success'
          })
        } else if (parseInt(val) === 3) {
          this.$message({
            type: 'error',
            message: 'Synchronization failed'
          })
        } else if (parseInt(val) === 4) {
          this.$message({
            type: 'error',
            message: 'Synchronization timeout'
          })
        }
        this.showProgress = false
      }
    },
    components: { UploadFile, ImgView, Tips, Progress }
  }
</script>

<style lang='less' scoped>
@borderColor: #999;
.device-setting {
    background: #fff;
    padding: 20px;
  .first-row {
    display: flex;
    .col1 {
      .row1-col1 {
        width: 150px;
        border: 1px solid @borderColor;
        padding: 10px;
        margin-bottom: 10px;
        .item1, .item2, .item3 {
          display: flex;
        }
        .radio-item {
          display: flex;
          .white-list {
            margin-left: -10px;
            .radio1, .radio2 {
              display: flex;
              .el-radio {
                margin-right: 3px !important;
                .el-radio__input {
                  margin-right: 3px !important;
                }
              }
              .tips-container {
                line-height: 20px;
              }
            }
            .radio1 {
              margin-bottom: 10px;
            }
          }
        }
      }
    }
    .col2 {
      margin-left: 10px;
      .row1-col2 {
        width: 250px;
        border: 1px solid @borderColor;
        padding: 10px;
        margin-bottom: 10px;
        .item1, .item2 {
          display: flex;
          // input {
          //   padding: 2px;
          // }
        }
      }
    }
    .col3 {
      padding: 10px;
      border: 1px solid @borderColor;
      margin-left: 10px;
      height: 446px;
      width: ~'calc(100% - 475px)';
    }
  }
  .second-row {
    display: flex;
    .col1, .col2, .col3 {
      margin-right: 10px;
      border: 1px solid @borderColor;
      .row1 {
        display: flex;
        .item1, .item2 {
          display: flex;
          position: relative;
          padding-top: 20px;
          .top-label {
            position: absolute;
            top: 3px;
            left: 90px;
            font-size: 12px;
          }
        }
        .item2 {
          margin-right: 10px;
          .top-label {
            left: 40px;
          }
        }
      }
      .row2, .row3 {
        display: flex;
        margin-right: 10px;
      }
    }
    .col1 {
      width: 270px;
    }
    .col2 {
      .row1 {
        margin: 0 10px;
      }
      .row2 {
        margin: 0 10px;
        label {
          line-height: 50px;
        }
        .tips-container {
          line-height: 50px;
        }
      }
    }
    .col3 {
      padding: 10px;
      margin-right: 0;
      width: calc(100% - 600px);
      img {
        width: 100%;
      }
      .row1 {
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-around;
        padding: 0px 7%;
        .left-input, .right-input {
          width: 150px;
        }
        .left-input {
          margin-top: -10px;
        }
        .right-input {
          margin-top: -10px;
        }
      }
      .allowed-call-time {
        display: flex;
        img {
          width: 50px;
          height: 50px;
          margin-right: 11px;
        }
        .red-line, .green-line {
          width: 5px;
          height: 5px;
          // margin-right: 8px;
          margin: 0 auto;
          // margin-right: calc(~"100% /30");;
          margin-top: 20px;
        }
        .red-line {
          background: red;
        }
        .green-line {
          background: green;
        }
      }
    }
  }
  .buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    .buttons-container {
      display: flex;
      .button_css_setting {
        height: 30px;
        width: 100px;
        background: #999;
        text-align: center;
        cursor: pointer;
        margin-right: 20px;
        img {
          height: 30px;
        }
      }
    }
  }
}
</style>
<style lang="less">
.device-setting {
    .el-checkbox {
    margin-right: 26px;
  }
  .first-row {
    .col2 {
      .row1-col2 {
        .item1, .item2 {
          // input {
          //   padding: 2px;
          // }
        }
      }
    }
  }
  .el-tabs__header  {
    margin: 0;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #FFF;
    background: rgb(51, 113, 155);
    color: #fff;
  }
}
.setting-table {
  th>.cell {
    padding-left: 0;
    padding-right: 0;
    font-size: 11px;
  }
  td, th {
    padding: 0;
  }
  .el-input__inner {
    height: 30px;
  }
  .el-table__row td{
    padding: 6px 0;
  }
  .el-table__header .cell {
    padding: 3px 0;
  }
  .cell {
    text-overflow: unset;
  }
}
.led-item-container-left {
  .led-item {
    text-align: center;
    .title {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .lcd-content {
    background: #eee;
    width: 120px;
    height: 20px;
    padding: 5px 0;
    margin: 5px 0;
    font-size: 16px;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
  }
}
.led-item-container {
  width: fit-content;
  margin: auto;
  .led-item {
    margin-bottom: 20px;
    .title {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    .lcd-content {
      background: #eee;
      min-width: 140px;
      height: 80px;
      padding: 5px 0;
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      p {
        margin: auto;
      }
    }
  }
}
.input-arr {
  .input-arr1, .input-arr2 {
    display: grid;
    padding: 3px;
  }
  .input-arr1 {
    border: 1px solid #999;
  }
  .input-arr2 {
    border: 1px solid #999;
  }
  input, .el-input {
    width: 200px;
    margin-bottom: 5px;
  }
}
</style>

