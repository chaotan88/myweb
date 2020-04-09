<template>
  <!-- <div class="device-setting"
    v-loading="loading"
    element-loading-text="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="device-setting-warp">
      <div class="device-setting-header">
        <div class="base-info">
          <div class="base-info-left">
            <div style="display: flex; line-height: 50px;">
              <div style="display: flex; line-height: 50px; margin-right: 100px;">
                <img-view src="network.png"/>{{deviceInfo.mode}}
              </div>
              <div style="display: flex; line-height: 50px;">
                <img-view src="xinhaoqiangdu.png"/>{{deviceInfo.rssi}}
              </div>
            </div>
            <div class="long-div">
              <img-view src="imei.png"/>{{deviceInfo.imei}}
            </div>
            <div class="apn-info">
              <img-view src="apn.png"/><el-input v-model="deviceInfo.apn" placeholder="APN" clearable></el-input>
            </div>
          </div>
          <div class="base-info-right">
            <div style="margin-bottom: 20px;">
              <img-view src="welcome.png"/>
              <el-input v-model="deviceInfo.welcome" :placeholder="$t('common.upto64Chart')" clearable></el-input>
            </div>
            <div>
              <img-view src="jiamixianshi.png"/>
              <el-radio v-model="deviceInfo.encryptDisp" :label="0">{{$t("device.no")}}</el-radio>
              <el-radio v-model="deviceInfo.encryptDisp" :label="1">{{$t("device.yes")}}</el-radio>
            </div>
          </div>
        </div>
      </div>
      <div class="common-setting">
        <p class="common-label">{{$t('common.publicParameterConfiguration')}}</p>
        <div class="common-form">
          <div class="form-row">
            <div>
              <span :title="$t('device.operationPassword')">{{$t("device.operationPassword")}}</span>
              <el-input v-model="deviceInfo.managerCode" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
            </div>
            <div class="second-col">
              <span :title="$t('device.buildingOperation')">{{$t("device.buildingOperation")}}</span>
              <el-input v-model="deviceInfo.engineersCode" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
            </div>
          </div>
          <div class="form-row">
            <div>
              <span :title="$t('device.deviceHornVolume')">{{$t("device.deviceHornVolume")}}</span>
              <el-input v-model="deviceInfo.spkVol" :placeholder="`1~9${$t('common.positiveInteger')}`" clearable></el-input>
            </div>
            <div class="second-col">
              <span :title="$t('device.MICVolume')">{{$t("device.MICVolume")}}</span>
              <el-input v-model="deviceInfo.micVol" :placeholder="`1~9${$t('common.positiveInteger')}`" clearable></el-input>
            </div>
          </div>
          <div class="form-row">
            <div>
              <span :title="$t('device.relayTriggerTime1')">{{$t("device.relayTriggerTime1")}}</span>
              <el-input v-model="deviceInfo.relay1Time" :placeholder="`1~9999${$t('common.positiveInteger')}`" clearable></el-input>
            </div>
            <div class="second-col">
              <span :title="$t('device.relayTriggerTime2')">{{$t("device.relayTriggerTime2")}}</span>
              <el-input v-model="deviceInfo.relay2Time" :placeholder="`1~9999${$t('common.positiveInteger')}`" clearable></el-input>
            </div>
          </div>
          <div class="form-row">
            <div class="radio-item">
              <span :title="$t('device.whiteListSwitch')">{{$t("device.whiteListSwitch")}}</span>
              <el-radio v-model="deviceInfo.cid" :label="0">{{$t("device.no")}}</el-radio>
              <el-radio v-model="deviceInfo.cid" :label="1">{{$t("device.yes")}}</el-radio>
            </div>
            <div class="radio-item second-col">
              <span :title="$t('device.monitorModeSwitch')">{{$t("device.monitorModeSwitch")}}</span>
              <el-radio v-model="deviceInfo.monitor" :label="0">{{$t("device.no")}}</el-radio>
              <el-radio v-model="deviceInfo.monitor" :label="1">{{$t("device.yes")}}</el-radio>
            </div>
          </div>
          <div class="form-row">
            <div>
              <span :title="$t('device.localPhoneNumber')">{{$t("device.localPhoneNumber")}}</span>
              <el-input v-model="deviceInfo.localNumber" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
            </div>
            <div class="second-col">
              <span :title="$t('device.equipmentTime')">{{$t("device.equipmentTime")}}</span>
              <el-input v-model="deviceInfo.msgIntervalDay" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
            </div>
          </div>
          <div class="form-row">
            <div>
              <span :title="$t('device.equipmentAdministrator')">{{$t("device.equipmentAdministrator")}}</span>
              <el-input v-model="deviceInfo.managerCallTime" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
            </div>
            <div class="second-col">
              <span title="Ring time for manager">Ring time for manager</span>
              <el-input v-model="deviceInfo.msgIntervalDay" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
            </div>
          </div>
        </div>
        <div class="call-duration-for-home-users">
          <p class="call-label">{{$t("device.callDurationForHomeUsers")}}</p>
          <div class="form-row">
            <div>
              <span>{{$t("device.phone1")}}</span>
              <el-input v-model="deviceInfo.familyCallTime1" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
            </div>
            <div class="second-col">
              <span>{{$t("device.phone2")}}</span>
              <el-input v-model="deviceInfo.familyCallTime2" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
            </div>
          </div>
          <div class="form-row">
            <div>
              <span>{{$t("device.phone3")}}</span>
              <el-input v-model="deviceInfo.familyCallTime3" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
            </div>
          </div>
        </div>
        <div class="call-duration-for-home-users">
          <div class="form-row time-range">
            <span :title="$t('device.permittedCallPeriod')">{{$t("device.permittedCallPeriod")}}</span>
              <el-input v-model="deviceInfo.doNotStartTime" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable class="left-input"></el-input>~
              <el-input v-model="deviceInfo.doNotEndTime" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable class="right-input"></el-input>
          </div>
          <div class="check-box-css">
            <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >{{$t('common.selectAll')}}</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="week in weeks" :label="week.id" :key="week.id">{{week.label}}</el-checkbox>
          </el-checkbox-group>
          </div>
        </div>
        <div class="auto-door">
          <p class="auto-door-label">{{$t("device.automaticDoorOpeningSetting")}}</p>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column :label="$t('device.type')" align="center" width="300">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.type">
                  <el-radio label="100">TRIG</el-radio>
                  <el-radio label="010">LATCH</el-radio>
                  <el-radio label="001">UNLATCH</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column :label="$t('device.time')" align="center">
              <el-table-column
                prop="time"
                label=""
                width="150">
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
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="save-box">
      <el-button type="primary" @click="importDialog = true">{{$t('common.input')}}</el-button>
      <el-button type="primary" @click="save">{{$t('common.save')}}</el-button>
      <el-button type="primary" @click="save('default')">{{$t('common.restoreSefaultSettings')}}</el-button>
      <el-button type="primary" @click="syncData()">{{$t('device.syncDataByDevice')}}</el-button>
    </div>
    <div class="device-status">
      {{$t('common.deviceStatus')}}：
      <span v-if="deviceNetStatus === 1">{{$t('common.networkNotLinked')}}</span>
      <span v-else-if="deviceNetStatus === 2">{{$t('common.deviceNotLoggedIn')}}</span>
      <span v-else-if="deviceNetStatus === 3">{{$t('common.deviceConnectionIsAbnormal')}}</span>
      <span v-else-if="deviceNetStatus === 4" class="status-success">{{$t('common.deviceLinkSuccess')}}</span>
      <span v-else>{{$t('common.unkonw')}}</span>
    </div>

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
          <UploadFile @success="uploadSuccess"></UploadFile>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialog = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="upload">{{$t('common.sure')}}</el-button>
      </span>
    </el-dialog>
  </div> -->
  <div class="device-setting"
    v-loading="loading"
    element-loading-text="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="device-setting-warp">
      <div class="device-setting-header">
        <div class="base-info">
          <div class="base-info-row1">
            <div style="display: flex; line-height: 50px; margin-right: 100px;">
              <img-view src="network.png"/>{{deviceInfo.mode}}
            </div>
            <div style="display: flex; line-height: 50px;">
              <img-view src="xinhaoqiangdu.png"/>{{deviceInfo.rssi}}
            </div>
            <div style="display: flex; line-height: 50px;">
              <img-view src="imei.png"/>{{deviceInfo.imei}}
            </div>
          </div>
          <div class="base-info-row2">
            <div class="apn-info">
              <img-view src="apn.png"/><el-input v-model="deviceInfo.apn" placeholder="APN" clearable></el-input>
            </div>
            <div class="welcome">
              <img-view src="welcome.png"/>
              <el-input v-model="deviceInfo.welcome" :placeholder="$t('common.upto64Chart')" clearable></el-input>
            </div>
            <div class="jiamixianshi">
              <img-view src="jiamixianshi.png"/>
              <el-radio v-model="deviceInfo.encryptDisp" :label="0">{{$t("device.no")}}</el-radio>
              <el-radio v-model="deviceInfo.encryptDisp" :label="1">{{$t("device.yes")}}</el-radio>
            </div>
            <!-- <div class="address">
              <span>{{$t("device.address")}}</span>
              <el-input v-model="baseInfo.welcomeToLanguage" placeholder="限64个字符内" clearable></el-input>
            </div> -->
          </div>
        </div>
      </div>
      <div class="common-setting">
        <p class="common-label">{{$t('common.publicParameterConfiguration')}}</p>
        <div class="common-form">
          <div class="form-row">
            <div>
              <img-view src="loudongxiaoquguanliyuancaozuomima.png" title="Manager programming code"/>
              <el-input v-model="deviceInfo.managerCode" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
            </div>
            <div class="second-col" title="Engineer programming code">
              <img-view src="shebeiguanliyuancaozuomima.png"/>
              <el-input v-model="deviceInfo.engineersCode" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable></el-input>
            </div>
          </div>
          <div class="form-row">
            <div>
              <img-view src="volume.png" title="Volume of speaker"/>
              <el-input v-model="deviceInfo.spkVol" :placeholder="`1~9${$t('common.positiveInteger')}`" clearable></el-input>
            </div>
            <div class="second-col" title="Volume of microphone">
              <img-view src="mic.png"/>
              <el-input v-model="deviceInfo.micVol" :placeholder="`1~9${$t('common.positiveInteger')}`" clearable></el-input>
            </div>
          </div>
          <div class="form-row">
            <div>
              <img-view src="relayTriggerTime1.png" title="Relay 1 trigger time"/>
              <el-input v-model="deviceInfo.relay1Time" :placeholder="`1~9999${$t('common.positiveInteger')}`" clearable></el-input>
            </div>
            <div class="second-col">
              <img-view src="relayTriggerTime2.png" title="Relay 2 trigger time"/>
              <el-input v-model="deviceInfo.relay2Time" :placeholder="`1~9999${$t('common.positiveInteger')}`" clearable></el-input>
            </div>
          </div>
          <div class="form-row">
            <div class="radio-item">
              <img-view src="whiteList.png" title="Caller ID for residents"/>
              <el-radio v-model="deviceInfo.cid" :label="0">{{$t("device.no")}}</el-radio>
              <el-radio v-model="deviceInfo.cid" :label="1">{{$t("device.yes")}}</el-radio>
            </div>
            <div class="radio-item second-col">
              <img-view src="whiteList.png" title="Latching ability by residents"/>
              <el-radio v-model="deviceInfo.monitor" :label="0">{{$t("device.no")}}</el-radio>
              <el-radio v-model="deviceInfo.monitor" :label="1">{{$t("device.yes")}}</el-radio>
            </div>
          </div>
          <div class="form-row">
            <div>
              <img-view src="localphoneNumber.png"/>
              <el-input v-model="deviceInfo.localNumber" minlength="3" maxlength="30" clearable></el-input>
            </div>
            <div class="second-col">
              <img-view src="jiaoduishijian.png"/>
              <el-input v-model="deviceInfo.msgIntervalDay" :placeholder="`4${$t('common.characters')}`" minlength="3" maxlength="30" clearable></el-input>
            </div>
          </div>
          <div class="form-row">
            <div>
              <img-view src="managerPhone.png"/>
              <el-input v-model="deviceInfo.managerCallTime" :placeholder="`4${$t('common.characters')}`" minlength="3" maxlength="30" clearable></el-input>
            </div>
            <div class="second-col">
              <img-view src="ringTimeForManager.png"/>
              <el-input v-model="deviceInfo.ringTimeForManager" minlength="3" maxlength="30" clearable></el-input>
            </div>
          </div>
        </div>
        <div class="call-duration-for-home-users">
          <p class="call-label">{{$t("device.callDurationForHomeUsers")}}</p>
          <div class="form-row">
            <div>
              <img-view src="phone1.png"/>
              <el-input v-model="deviceInfo.familyCallTime1" :placeholder="`4${$t('common.characters')}`" minlength="3" maxlength="30" clearable></el-input>
            </div>
            <div class="second-col">
              <img-view src="phone2.png"/>
              <el-input v-model="deviceInfo.familyCallTime2" :placeholder="`4${$t('common.characters')}`" minlength="3" maxlength="30" clearable></el-input>
            </div>
          </div>
          <div class="form-row">
            <div>
              <img-view src="phone3.png"/>
              <el-input v-model="deviceInfo.familyCallTime3" :placeholder="`4${$t('common.characters')}`" minlength="3" maxlength="30" clearable></el-input>
            </div>
          </div>
        </div>
        <div class="call-duration-for-home-users">
          <div class="form-row time-range">
            <img-view src="allowedCallTime.png" width="200"/>
              <el-input v-model="deviceInfo.doNotStartTime" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable class="left-input"></el-input>~
              <el-input v-model="deviceInfo.doNotEndTime" :placeholder="`4${$t('common.characters')}`" minlength="4" maxlength="4" clearable class="right-input"></el-input>
          </div>
          <div class="check-box-css">
            <!-- <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >{{$t('common.selectAll')}}</el-checkbox> -->
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="week in weeks" :label="week.id" :key="week.id">{{week.label}}</el-checkbox>
          </el-checkbox-group>
          </div>
        </div>
        <div class="auto-door">
          <p class="auto-door-label">{{$t("device.automaticDoorOpeningSetting")}}</p>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column :label="$t('device.type')" align="center" width="300">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.type">
                  <el-radio label="100">TRIG</el-radio>
                  <el-radio label="010">LATCH</el-radio>
                  <el-radio label="001">UNLATCH</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column :label="$t('device.time')" align="center">
              <el-table-column
                prop="time"
                label=""
                width="150">
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
                <!-- <el-checkbox
                  :indeterminate="scope.row.isIndeterminate"
                  v-model="scope.row.checkAll"
                  @change="rowCheckAll(scope.row, scope.$index)"
                >全选</el-checkbox>
                <div style="margin: 15px 0;"></div> -->
                <el-checkbox-group v-model="scope.row.checkedWeek" @change="rowWeekChange(scope.row, scope.$index)">
                  <el-checkbox v-for="week in weeks" :label="week.id" :key="week.id">{{week.label}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <!-- <el-table-column>
              <template slot="header">
                <i class="iconfont el-icon-plus" @click="addItem"></i>
              </template>
              <template slot-scope="scope">
                <i class="iconfont el-icon-minus" v-if="scope.$index === 0"></i>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </div>
    </div>
    <div class="save-box">
      <el-button type="primary" @click="importDialog = true">{{$t('common.input')}}</el-button>
      <el-button type="primary" @click="save">{{$t('common.save')}}</el-button>
      <el-button type="primary" @click="save('default')">{{$t('common.restoreSefaultSettings')}}</el-button>
      <el-button type="primary" @click="syncData()">{{$t('device.syncDataByDevice')}}</el-button>
      <!-- <el-button type='primary'>设备版本升级</el-button> -->
    </div>
    <div class="device-status">
      {{$t('common.deviceStatus')}}：
      <!-- <span v-if="deviceNetStatus === 1">{{$t('common.networkNotLinked')}}</span>
      <span v-else-if="deviceNetStatus === 2">{{$t('common.deviceNotLoggedIn')}}</span>
      <span v-else-if="deviceNetStatus === 3">{{$t('common.deviceConnectionIsAbnormal')}}</span>
      <span v-else-if="deviceNetStatus === 4" class="status-success">{{$t('common.deviceLinkSuccess')}}</span>
      <span v-else>{{$t('common.unkonw')}}</span> -->
      <span v-if="deviceNetStatus === 4" class="status-success">{{$t('common.deviceLinkSuccess')}}</span>
      <span v-else>{{$t('common.deviceNotLinked')}}</span>
    </div>

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
  </div>
</template>

<script>
  import UploadFile from '@/components/utils/UploadFile.vue'
  import ImgView from '@/components/utils/ImgView.vue'
  const weekOptions = [{ id: 1, label: 'Mo' }, { id: 2, label: 'Tu' }, { id: 3, label: 'We' },
    { id: 4, label: 'Th' }, { id: 5, label: 'Fr' }, { id: 6, label: 'Sa' }, { id: 7, label: 'Su' }]
  export default {
    data () {
      return {
        id: '',
        deviceInfo: {},
        checkAll: false,
        checkedCities: [],
        weeks: weekOptions,
        isIndeterminate: true,
        tableData: [
          {
            type: '100',
            checkedWeek: []
          },
          {
            type: '100',
            checkedWeek: []
          },
          {
            type: '100',
            checkedWeek: []
          },
          {
            type: '010',
            checkedWeek: []
          },
          {
            type: '010',
            checkedWeek: []
          },
          {
            type: '010',
            checkedWeek: []
          },
          {
            type: '001',
            checkedWeek: []
          },
          {
            type: '001',
            checkedWeek: []
          },
          {
            type: '001',
            checkedWeek: []
          }
        ],
        startTime: '',
        endTime: '',
        deviceNetStatus: 0,
        importDialog: false,
        fileAddress: '',
        loading: false
      }
    },
    mounted () {
      this.id = this.$route.params.id
      this.checkDevice(() => {
        this.findData()
      })
      this.findData()
    },
    methods: {
      findData () {
        this.$http.post('@ROOT_API/dfDeviceSettings/getDfDeviceSettings', {
          deviceId: this.id
        }).then((res) => {
          this.deviceInfo = res.data.data || {}
          this.deviceInfo.encryptDisp = res.data.data.encryptDisp || 0
          this.deviceInfo.cid = res.data.data.cid || 0
          this.deviceInfo.monitor = res.data.data.monitor || 0
          this.setDoNotWeek()
          this.setAutoRelatTrig()
          // this.startTime = this.setTime(this.deviceInfo.doNotStartTime)
          // this.endTime = this.setTime(this.deviceInfo.doNotEndTime)
        })
      },
      setTime (val) {
        return (!val || val.length < 4) ? val : `${val.substring(0, 2)}:${val.substring(2, 2)}`
      },
      handleCheckAllChange (val) {
        this.checkedCities = val ? weekOptions : []
        this.isIndeterminate = false
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
      rowCheckAll (row, index) {},
      rowWeekChange (row, index) {},
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
            'welcome': 'welcome to beijin!',
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
            'doNotDisturb': '1010#1200#1110001',
            'doNotStartTime': '0010',
            'doNotEndTime': '1200',
            'doNotWeek': '1110001',
            'autoRelayTrig': '100'
          }
        } else {
          params = {
            deviceId: this.id,
            id: this.deviceInfo.id,
            imei: this.deviceInfo.imei,
            rssi: this.deviceInfo.rssi,
            mode: this.deviceInfo.mode,
            apn: this.deviceInfo.apn,
            welcome: this.deviceInfo.welcome,
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
              this.$router.go(-1)
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
      getDoNotDisturb () {
        return `${this.deviceInfo.doNotStartTime}#${this.deviceInfo.doNotEndTime}#${this.getDoNotWeek()}`
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
        let filterTable = this.tableData.filter(data => data.type && data.time && data.checkedWeek.length > 0)
        return filterTable.map(data => `${data.type}#${data.time}#${this.getDoNotWeekForRow(data.checkedWeek)}`).join('_')
      },
      getDoNotWeekForRow (weeks) {
        if (!weeks || weeks.length === 0) return ''
        let str = ''
        for (let i = 1; i < 8; i++) {
          if (weeks.indexOf(i) !== -1) {
            str += `1`
          } else {
            str += '0'
          }
        }
        return str
      },
      setAutoRelatTrig () {
        let newData = []
        let trigArr = this.deviceInfo.autoRelayTrig.split('_')
        trigArr.forEach(trig => {
          newData.push({
            type: trig.split('#')[0] || '100',
            time: trig.split('#')[1],
            checkedWeek: this.getRowWeek(trig.split('#')[2])
          })
        })
        let len = newData.length
        for (let i = 0; i < 9 - len; i++) {
          newData.push({
            type: '100',
            checkedWeek: []
          })
        }
        this.tableData = newData
      },
      getRowWeek (weekStr) {
        if (!weekStr) return []
        let weekArr = []
        for (let i = 0; i < 7; i++) {
          if (weekStr[i] === '1') {
            weekArr.push(i + 1)
          }
        }
        return weekArr
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
      }
    },
    components: { UploadFile, ImgView }
  }
</script>

<style lang='less' scoped>
.device-setting {
  .device-setting-header {
    background: #fff;
    padding: 20px;
    position: relative;
    .base-info {
      .base-info-row1, .base-info-row2 {
        display: flex;
        justify-content: space-between;
        padding-right: 200px;
        .apn-info, .welcome, .jiamixianshi {
          display: flex;
          line-height: 50px;
          label {
            line-height: 50px;
          }
        }
      }
      // .base-info-left {
      //   width: 480px;
      //   .long-div {
      //     overflow: hidden;
      //     text-overflow:ellipsis;
      //     white-space: nowrap;
      //     display: flex;
      //     line-height: 50px;
      //   }
      //   div {
      //     margin: 10px;
      //     span:nth-child(1) {
      //       color: #333333;
      //       display: inline-block;
      //       width: 200px;
      //     }
      //     span:nth-child(2) {
      //       margin-left: 100px;
      //     }
      //   }
      //   .nameOfapartment {
      //     display: flex;
      //     span {
      //       width: 160px;
      //       line-height: 56px;
      //     }
      //   }
      //   .apn-info {
      //     display: flex;
      //     .el-input {
      //       width: 200px;
      //     }
      //   }
      // }
      // .base-info-right {
      //   margin-left: 100px;
      //   div {
      //     display: flex;
      //     span {
      //       width: 100px;
      //       line-height: 36px;
      //       overflow: hidden;
      //       text-overflow: ellipsis;
      //       white-space: nowrap;
      //       margin-right: 20px;
      //     }
      //     label {
      //       line-height: 36px;
      //     }
      //   }
      //   .address {
      //     display: flex;
      //   }
      // }
    }
    // .base-info:after {
    //   content: '';
    //   width: 1px;
    //   height: 50%;
    //   background: #eee;
    //   position: absolute;
    //   top: 25px;
    // }
  }
  .common-setting {
    background: #fff;
    margin-top: 20px;
    padding: 20px;
    .common-label {
      margin-bottom: 10px;
      border-left: 5px solid #33719b;
      padding-left: 10px;
    }
    .common-form {
      padding: 20px;
      border-bottom: 1px dashed #eee;
    }
    .form-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-right: 200px;
      .second-col {
        margin-left: 100px;
      }
      .radio-item {
        width: 275px;
      }
      div {
        display: flex;
        span {
          width: 260px;
          line-height: 36px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 20px;
        }
      }
      .radio-item {
        span {
          width: 160px;
        }
        label {
          line-height: 36px;
        }
      }
    }
    .call-duration-for-home-users {
      padding: 20px;
      border-bottom: 1px dashed #eee;
      .call-label {
        margin-left: -20px;
        margin-bottom: 20px;
      }
      .time-range {
        justify-content: start;
        span {
          width: 115px;
          line-height: 36px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 20px;
        }
        .el-input {
          width: 130px !important;
        }
        .left-input {
          // margin-left: 50px;
          margin-right: 12px;
        }
        .right-input {
          margin-left: 12px;
        }
        .el-checkbox {
          margin-right: 20px;
          line-height: 36px;
        }
      }
      .check-box-css {
        margin-left: 20px;
        display: flex;
        margin-left: 210px;
      }
    }
    .auto-door {
      padding: 20px;
      .auto-door-label {
        margin: 0 0 10px -20px;
      }
    }
    .el-table {
      .el-date-editor {
        width: 120px;
      }
    }
  }
  .save-box {
    margin-top: 30px;
  }
  .device-status {
    position: absolute;
    top: 10px;
    left: 20px;
    margin-bottom: 10px;
    font-size: 12px;
    span {
      color: red;
    }
    .status-success {
      color: green;
    }
  }
}
</style>
<style lang='less'>
// .device-setting {
//   .auto-door {
//     .el-table {
//       .el-table__row {
//         .el-radio__label {
//           display: none;
//         }
//       }
//     }
//   } 
// }
.device-setting {
  .el-checkbox {
    margin-right: 10px;
  }
}
</style>

