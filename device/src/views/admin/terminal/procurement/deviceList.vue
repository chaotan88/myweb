<template>
  <!-- 终端-申请终端-管理 -->
  <div class="device-list">
    <div class="device-list-wrap">
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
              <el-button class="add-btn" @click="addLocation">
                  {{$t("device.addLocation")}}
                </el-button>
            </el-form-item>
            <el-form-item class="img-item">
              <img src="../../../../../static/img/listview2.png" v-if="showListView" @click="showListView = !showListView" title="List View"/>
              <img src="../../../../../static/img/listview.png" v-else  @click="showListView = !showListView" title="List View"/>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="itemList" v-if="!showListView">
          <!-- <el-table-column type="index" :label="$t('common.index')" width="90"></el-table-column> -->
          <el-table-column :label="$t('device.apartmentName')" show-overflow-tooltip min-width="125">
            <template slot-scope="props">
              <p>{{props.row.apartmentName}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.apartmentPhone')" min-width="180" show-overflow-tooltip>
            <template slot-scope="props">
              <p>{{getPhoneStr(props.row)}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.apartmentManager')" width="120">
            <template slot-scope="props">
              <p>{{props.row.apartmentManager}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.doorNumber')" width="119">
            <template slot-scope="props">
              <p>{{ props.row.doorNumber }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.bindStatus')" width="120">
            <template slot-scope="props">
              <p>{{ props.row.bindStatus === 1 ? 'binded' : 'unbind' }}</p>
            </template>
          </el-table-column>
           <el-table-column :label="$t('device.imeiNumber')" width="135" show-overflow-tooltip>
            <template slot-scope="props">
              <p>{{ props.row.imei }}</p>
            </template>
          </el-table-column>
           <el-table-column :label="$t('device.deviceName')" width="135" show-overflow-tooltip>
            <template slot-scope="props">
              <p>{{ props.row.name }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.addressDetail')" show-overflow-tooltip width="150">
            <template slot-scope="props">
              <p>{{ props.row.address }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="operation" :label="$t('common.operation')" min-width="220">
            <template slot-scope="props">
              <el-button class="detail-button" @click="cloneDevice(props.row)">{{$t('common.clone')}}</el-button>
              <el-button class="detail-button" @click="setVistor(props.row, 'homeUserManage')" v-if="props.row.bindStatus === 1">
                {{$t('device.visitorManage')}}
              </el-button>
              <el-button class="detail-button" @click="updateItem(props.row, 'bind')" v-if="props.row.bindStatus !== 1">
                {{$t('device.bidingIntercom')}}
              </el-button>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="`2_${props.$index}`">
                    {{$t('common.update')}}
                  </el-dropdown-item>
                  <el-dropdown-item :command="`10_${props.$index}`" v-if="props.row.bindStatus === 1">
                    {{$t('device.switchDevice')}}
                  </el-dropdown-item>
                  <el-dropdown-item :command="`11_${props.$index}`" v-if="props.row.bindStatus === 1">
                    {{$t('device.unbind')}}
                  </el-dropdown-item>
                  <el-dropdown-item :command="`12_${props.$index}`" v-if="props.row.bindStatus === 1">
                    {{$t('device.openDoor1')}}
                  </el-dropdown-item>
                  <el-dropdown-item :command="`13_${props.$index}`" v-if="props.row.bindStatus === 1">
                    {{$t('device.openDoor2')}}
                  </el-dropdown-item>
                  <el-dropdown-item :command="`1_${props.$index}`">
                    {{$t('common.delete')}}
                  </el-dropdown-item>
                  <!-- <el-dropdown-item :command="`4_${props.$index}`" v-if="props.row.bindStatus === 1">
                    {{$t('device.visitorManage')}}
                  </el-dropdown-item> -->
                  <!-- <el-dropdown-item :command="`5_${props.$index}`">
                    {{$t('common.clone')}}
                  </el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="card-items">
          <el-card :body-style="{ padding: '0px' }" v-for="(item, index) in itemList" :key="index" shadow="hover">
            <img :src="`${$dm.ROOT_IMG}${item.addressImage}`"
              v-if="item.addressImage"
              class="image">
            <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1944103286,2743934266&fm=26&gp=0.jpg"
              v-else
              class="image">
            <div style="padding: 14px;">
              <div>{{item.apartmentName}}</div>
              <div><span>{{$t('device.apartmentManager')}}： </span>{{item.apartmentManager}} - {{item.apartmentPhone}}</div>
              <div><span>{{$t('device.addressDetail')}}： </span>{{item.address}}</div>
              <div><span>{{$t('device.imeiNumber')}}： </span>{{item.imei}}</div>
              <div class="bottom clearfix bottom-buttons">
                <span :style="{color: item.bindStatus === 1 ? '#67c23a' : '#909399', lineHeight: '40px'}">{{item.bindStatus === 1 ? 'binded' : 'unbind'}}</span>
              </div>
              <div class="button-container">
                  <!--已绑定 家庭、访客、参数、编辑  1delete  2update 3bind 4family 5 vistor 6unbing 7detail 8setting 9clone-->
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'" @click="handleCommand(`4_${index}`)" v-if="item.bindStatus === 1">
                      {{$t('common.family')}}
                  </el-button>
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'" @click="handleCommand(`5_${index}`)" v-if="item.bindStatus === 1">
                      {{$t('common.visitor')}}
                  </el-button>
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'" @click="handleCommand(`8_${index}`)" v-if="item.bindStatus === 1">
                      {{$t('menu.setting')}}
                  </el-button>
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'" @click="handleCommand(`3_${index}`)" v-if="item.bindStatus !== 1">
                      {{$t('common.bind')}}
                  </el-button>
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'" @click="handleCommand(`2_${index}`)">
                      {{$t('common.update')}}
                  </el-button>
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'" @click="handleCommand(`9_${index}`)" v-if="item.bindStatus !== 1">
                      {{$t('common.clone')}}
                  </el-button>
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'" @click="handleCommand(`7_${index}`)" v-if="item.bindStatus !== 1">
                      {{$t('common.detail')}}
                  </el-button>

                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'"
                    @click="handleCommand(`9_${index}`)" v-if="item.bindStatus === 1">
                      {{$t('common.clone')}}
                  </el-button>
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'"
                    @click="handleCommand(`1_${index}`)">
                      {{$t('common.delete')}}
                  </el-button>
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'"
                    @click="handleCommand(`10_${index}`)" v-if="item.bindStatus === 1">
                      {{$t('device.switchDevice')}}
                  </el-button>
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'"
                    @click="handleCommand(`11_${index}`)" v-if="item.bindStatus === 1">
                      {{$t('device.unbind')}}
                  </el-button>
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'"
                    @click="handleCommand(`12_${index}`)" v-if="item.bindStatus === 1">
                      {{$t('device.openDoor1')}}
                  </el-button>
                  <el-button :class="$i18n.locale === 'zh' ? 'detail-button' : 'detail-button-en'"
                    @click="handleCommand(`13_${index}`)" v-if="item.bindStatus === 1">
                      {{$t('device.openDoor2')}}
                  </el-button>
                  <!-- <el-dropdown @command="handleCommand" style="line-height: 40px;">
                    <span class="el-dropdown-link">
                      <i class="el-icon-arrow-down el-icon-more" style="font-size: 26px;"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                       <el-dropdown-item :command="`9_${index}`" v-if="item.bindStatus === 1">
                        {{$t('common.clone')}}
                      </el-dropdown-item>
                      <el-dropdown-item :command="`1_${index}`">
                        {{$t('common.delete')}}
                      </el-dropdown-item>
                      <el-dropdown-item :command="`10_${index}`" v-if="item.bindStatus === 1">
                        {{$t('device.switchDevice')}}
                      </el-dropdown-item>
                      <el-dropdown-item :command="`11_${index}`" v-if="item.bindStatus === 1">
                        {{$t('device.unbind')}}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown> -->
                </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="pagination-wrap" v-show="total">
      <el-pagination
        layout="prev, pager, next, jumper"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        :total="total"
        @current-change="changePage">
      </el-pagination>
    </div>
    <!--设置弹框-->
    <el-dialog
      :title="$t('common.pleaseInputPassword')"
      :visible.sync="settingDialogShow"
      width="30%"
      :before-close="handleClose">
      <div class="setting-input-password">
        <input v-model="password.one" maxlength="1" type="password" ref="password1" @keyup="passWordChange(2)"/>
        <input  v-model="password.two" maxlength="1" type="password" ref="password2" @keyup="passWordChange(3)"/>
        <input  v-model="password.three" maxlength="1" type="password" ref="password3" @keyup="passWordChange(4)"/>
        <input  v-model="password.four" maxlength="1" type="password" ref="password4"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingDialogShow = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="passwordSubmit">{{$t('common.sure')}}</el-button>
      </span>
    </el-dialog>
    <!-- 新增、编辑地址弹窗 -->
    <el-dialog
      :title="updateId ? $t('common.update'): $t('common.new')"
      :visible.sync="addDialog"
      width="40%"
      top="5vh"
      center class="grant-pop"
      v-loading="loading"
      element-loading-text="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form :model="ruleForm" :rules="addRules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
        <el-form-item :label="$t('device.apartmentName')" prop="apartmentName">
          <el-input v-model="ruleForm.apartmentName" :placeholder="$t('device.apartmentName')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.country')" prop="country">
          <el-select v-model="ruleForm.country" filterable :placeholder="$t('common.pleaseSelect')">
            <el-option
                v-for="item in countrys"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="$t('device.provincecityarea')">
          <RegionSelect @change="reginChange" :assignData="assignData"></RegionSelect>
        </el-form-item> -->
        <el-form-item :label="$t('device.addressDetail')" prop="address">
          <el-input v-model="ruleForm.address" :placeholder="$t('device.addressDetail')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.longitude')" prop="longitude">
          <el-input v-model="ruleForm.longitude" :placeholder="$t('device.longitude')" clearable></el-input>
        </el-form-item>
        <p class="show-long-latitu" @click="toBaidu">{{$t('common.dotknowLaAndLo')}}</p>
        <el-form-item :label="$t('device.latitude')" prop="latitude">
          <el-input v-model="ruleForm.latitude" :placeholder="$t('device.latitude')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.apartmentManager')" prop="apartmentManager">
          <el-input v-model="ruleForm.apartmentManager" :placeholder="$t('device.apartmentManager')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.apartmentPhone')" prop="apartmentPhone1">
          <div style="display: flex;">
            <el-input v-model="ruleForm.apartmentPhone1" :placeholder="`${$t('device.apartmentPhone')}1`" clearable style="margin-right: 5px;"></el-input>
            <el-input v-model="ruleForm.apartmentPhone2" :placeholder="`${$t('device.apartmentPhone')}2`" clearable style="margin-right: 5px;"></el-input>
            <el-input v-model="ruleForm.apartmentPhone3" :placeholder="`${$t('device.apartmentPhone')}3`" clearable></el-input>
          </div>
        </el-form-item>
        <el-form-item :label="$t('device.doorNumber')" prop="doorNumber">
          <el-input v-model="ruleForm.doorNumber" :placeholder="$t('device.doorNumber')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.uploadFile')+' (350*220)'">
          <uploadFile @success="uploadSuccess"></uploadFile>
          <img :src="`${$dm.ROOT_IMG}${ruleForm.addressImage}`" v-if="ruleForm.addressImage" style="width:120px; height:120px;"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateItem(ruleForm, 'add')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 地址绑定设备弹窗 -->
    <el-dialog
      :title="$t('device.bidingIntercom')"
      :visible.sync="bindDialog"
      width="480px"
      center class="grant-pop">
      <el-dialog
        width="30%"
        title="Select IMEI"
        :visible.sync="selectImeiShow"
        class="select-imei"
        append-to-body>
        <el-table :data="imeiList" border>
          <el-table-column type="radio" width="120" :label="$t('common.select')">
            <template slot-scope="props">
              <el-radio v-model="props.row.isCkeck" label="" @change="selectImei(props.row)"></el-radio>
              <!-- <i class="iconfont radio-class" @click="selectImei(props.row)"></i> -->
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.imeiNumber')">
            <template slot-scope="props">
              <p>{{ props.row.imei}}</p>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogShow = true">{{$t('device.addNewDevice')}}</el-button>
      </span>
      </el-dialog>
      <el-form :model="bingForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm bind-form">
        <el-form-item :label="$t('device.imeiNumber')">
          <!-- <el-autocomplete
            v-model="imei"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
            value="id"
            value-key="imei"
          ></el-autocomplete> -->
          <el-input :placeholder="`${$t('common.pleaseSelect')} IMEI`" v-model="imei" clearable></el-input>
          <span @click="clickShowImei">Select IMEI</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindDialog = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="bindDeviceSubmit">{{$t('common.sure')}}</el-button>
      </span>
    </el-dialog>
    <!-- 地址更换设备弹窗 -->
    <el-dialog
      :title="$t('device.bidingIntercom')"
      :visible.sync="switchDialog"
      width="480px"
      center class="grant-pop">
      <el-dialog
        width="30%"
        title="Select IMEI"
        :visible.sync="selectImeiShow"
        class="select-imei"
        append-to-body>
        <el-table :data="imeiList" border>
          <el-table-column type="radio" width="120" :label="$t('common.select')">
            <template slot-scope="props">
              <el-radio v-model="props.row.isCkeck" label="" @change="selectImei(props.row)"></el-radio>
              <!-- <i class="iconfont radio-class" @click="selectImei(props.row)"></i> -->
            </template>
          </el-table-column>
          <el-table-column :label="$t('device.imeiNumber')">
            <template slot-scope="props">
              <p>{{ props.row.imei}}</p>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogShow = true">{{$t('device.addNewDevice')}}</el-button>
      </span>
      </el-dialog>
      <el-form :model="bingForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm bind-form">
        <el-form-item :label="$t('device.imeiNumber')">
          <!-- <el-autocomplete
            v-model="imei"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
            value="id"
            value-key="imei"
          ></el-autocomplete> -->
          <el-input :placeholder="`${$t('common.pleaseSelect')} IMEI`" v-model="imei" clearable></el-input>
          <span @click="clickShowImei">Select IMEI</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="switchDialog = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="swictchDeviceSubmit">{{$t('common.sure')}}</el-button>
      </span>
    </el-dialog>
    <ISVIP v-if="isShowVip" @close="isShowVip = false"></ISVIP>

    <!-- 新增设备弹窗 -->
    <el-dialog
      :title="$t('device.addNewDevice')"
      :visible.sync="addDialogShow"
      width="480px"
      center class="grant-pop">
      <el-form :inline="true" class="demo-form-inline" label-width="130px">
        <el-form-item :label="$t('device.deviceName')" required>
          <el-input :placeholder="$t('device.deviceName')" v-model="addName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.imeiNumber')" required>
          <el-input :placeholder="$t('device.pleaseEnterIMEI')" v-model="addImei"></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.describeInfo')" required>
          <el-input :placeholder="$t('device.describeInfo')" v-model="addDescribeInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogShow = false">{{$t("common.cancel")}}</el-button>
        <el-button type="primary" @click="addImeiSubmit">{{$t("common.sure")}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {pageMixin} from '@/mixin'
  import RegionSelect from '@/components/utils/RegionSelect'
  import ISVIP from '@/views/public/IsVip.vue'
  import uploadFile from '@/components/utils/UploadComponent.vue'
  import {countrys} from '../../../../assets/data.json'

  export default {
    data () {
      let validateHomePhone = (rule, value, callback) => {
        let reg = /^[0-9/+][0-9/*]*$/g
        if ((value && !value.toString().match(reg))) return callback(new Error('Phone Invalid'))
        callback()
      }
      return {
        token: '',
        searchData: {
          orderName: null,
          applyStatus: null
        },
        settingDialogShow: false,
        addDialog: false,
        bindDialog: false,
        switchDialog: false,
        password: {
          one: '',
          two: '',
          three: '',
          four: ''
        },
        settingItem: {},
        pageSize: 3,
        deviceList: [],
        updateId: '',
        ruleForm: {},
        bingForm: {},
        addRules: {
          apartmentName: [{ required: true, trigger: 'blur' }],
          country: [{ required: true, trigger: 'blur' }],
          address: [{ required: true, trigger: 'blur' }],
          apartmentManager: [{ required: true, trigger: 'blur' }],
          apartmentPhone1: [
            { required: true, trigger: 'blur' },
            { validator: validateHomePhone, trigger: 'blur' }
          ],
          apartmentPhone2: [
            { validator: validateHomePhone, trigger: 'blur' }
          ],
          apartmentPhone3: [
            { validator: validateHomePhone, trigger: 'blur' }
          ],
          doorNumber: [{ required: true, trigger: 'blur' }],
          longitude: [{ required: true, trigger: 'blur' }],
          latitude: [{ required: true, trigger: 'blur' }]
        },
        rules: {},
        bindItem: {},
        selectDevice: '',
        apartmentList: [],
        imei: '',
        bindDevice: {},
        reginSelect: {},
        assignData: {province: {}, city: {}, area: {}},
        selectImeiShow: false,
        imeiList: [],
        isShowVip: false,
        showListView: true,
        loading: false,
        countrys: [],
        swictchItem: {},
        addDialogShow: false,
        addImei: '',
        addName: '',
        addDescribeInfo: ''
      }
    },
    mounted () {
      let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
      this.token = adminInfo.token
      this.getSelectData()
      this.findData()
      this.countrys = countrys
    },
    methods: {
      findData () {
        this.$http.post('@ROOT_API/dfAddress/getDfAddressPage', {
          start: this.pageNum,
          pageSize: this.pageSize
        }).then((res) => {
          this.itemList = res.data.data.list
          this.total = res.data.data.total
          // let { list } = res.data.data
          // list = list.concat(list)
          // list = list.concat(list)
          // this.itemList = list
        })
        // let i = 0
        // let newData = []
        // while (true) {
        //   i++
        //   if (i > 8) break
        //   newData.push({
        //     imeiNumber: '23553534543',
        //     deviceModel: '门禁设备',
        //     name: '中设广场',
        //     concatNumber: '0755-34543345',
        //     location: '广东省深圳市罗湖区中设广场'
        //   })
        // }
        // this.itemList = newData
        // this.total = this.itemList.length
      },
      setVistor (item, path) {
        // this.password = {
        //   one: '',
        //   two: '',
        //   three: '',
        //   four: ''
        // }
        this.settingItem = item
        // this.settingDialogShow = true
        // setTimeout(() => {
        //   this.passWordChange(1)
        // })
        this.checkDevice(() => {
          sessionStorage.setItem('setVistorLocation', JSON.stringify(this.settingItem))
          this.$router.push({
            path: `/admin/device/manage/${path}/${this.settingItem.id}@${this.settingItem.deviceId}`
          })
        })
      },
      handleClose () {
        this.settingDialogShow = false
      },
      passwordSubmit () {
        let password = `${this.password.one}${this.password.two}${this.password.three}${this.password.four}`
        if (!password) {
          this.$message({
            type: 'error',
            message: this.$t('common.pleaseInputPassword')
          })
          return false
        }
        if (password !== '1234') {
          this.$message({
            type: 'error',
            message: this.$t('common.passwordError')
          })
          return false
        }
        this.checkDevice(() => {
          sessionStorage.setItem('setVistorLocation', JSON.stringify(this.settingItem))
          this.$router.push(`/admin/device/manage/homeUserManage/${this.settingItem.id}`)
        })
        // sessionStorage.setItem('setVistorLocation', JSON.stringify(this.settingItem))
        // this.$router.push(`/admin/device/manage/homeUserManage/${this.settingItem.id}`)
      },
      update (row) {
        this.updateId = row.id
        this.ruleForm = Object.assign({}, row)
        this.setRegionData()
        this.addDialog = true
      },
      updateItem (row, type) {
        let params = {}
        if (type === 'bind' && row.bindStatus !== 1) {
          // 绑定设备
          this.bindItem = row
          this.selectDevice = ''
          this.imei = ''
          this.bindDialog = true
        } else if (type === 'bind' && row.bindStatus === 1) {
          // 解绑
          params = Object.assign({}, row)
          params.bindStatus = 0
          this.updateOrAdd(params).then((res) => {
            if (res.data.status === '1') {
              this.$message.success('解除绑定成功')
              this.findData()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg || this.$t('common.errorMsg')
              })
            }
          })
        } else if (type === 'add') {
          this.updateOrAdd(this.ruleForm).then((res) => {
            if (res.data.status === '1') {
              this.$message.success('添加成功')
              this.findData()
              this.addDialog = false
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg || this.$t('common.errorMsg')
              })
            }
          })
        } else if (type === 'update') {
          this.updateOrAdd(Object.assign({
            id: this.updateId
          }, this.ruleForm)).then((res) => {
            if (res.data.status === '1') {
              this.$message.success('修改成功')
              this.findData()
              this.addDialog = false
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg || this.$t('common.errorMsg')
              })
            }
          })
        }
      },
      addLocation () {
        if (this.$isVip()) {
          this.updateId = ''
          this.ruleForm = {
            // addressImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
          }
          this.addDialog = true
        } else {
          this.isShowVip = true
        }
      },
      getSelectData () {
        this.$http.post('@ROOT_API/dfDevice/getDfDevicePage', {
          start: 1,
          pageSize: 9999
        }).then((res) => {
          this.deviceList = res.data.data.list
        })
      },
      updateOrAdd (params) {
        this.loading = true
        return new Promise((resolve, reject) => {
          this.$http.post('@ROOT_API/dfAddress/saveOrUpdateDfAddress', Object.assign({}, params)).then((res) => {
            resolve(res)
            this.loading = false
          })
        })
      },
      deleteSubmit (row) {
        this.$http.post('@ROOT_API/dfAddress/deleteBatchDfAddress', {
          ids: row.id
        }).then((res) => {
          if (res.data.status === '1') {
            this.$message.success('删除成功')
            this.findData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
          }
        })
      },
      bindDeviceSubmit () {
        let params = {}
        params.deviceId = this.bindDevice.id
        params.id = this.bindItem.id
        this.$http.post('@ROOT_API/dfAddress/bindDeviceForDfAddress', params).then((res) => {
          if (res.data.status === '1') {
            this.$message.success('绑定成功')
            this.bindDialog = false
            this.findData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
          }
        })
      },
      reginChange (select) {
        this.reginSelect = select
      },
      querySearchAsync (queryString, cb) {
        this.$http.post('@ROOT_API/dfDevice/getDfDevicePage', {
          start: 1,
          pageSize: 99
        }).then((res) => {
          if (res.data.data.list) {
            this.imeiList = res.data.data.list
            // clearTimeout(this.timeout)
            // this.timeout = setTimeout(() => {
            //   cb(res.data.data.list)
            // }, 3000 * Math.random())
          }
        })
      },
      handleSelect (item) {
        this.bindDevice = item
      },
      cloneDevice (row) {
        this.$http.post('@ROOT_API/dfAddress/cloneDfAddress', { id: row.id }).then((res) => {
          if (res.data.status === '1') {
            // this.$message.success('克隆成功')
            // this.findData()
            this.ruleForm = Object.assign({}, res.data.data)
            delete this.ruleForm['id']
            this.setRegionData()
            this.addDialog = true
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
          }
        })
      },
      swictchDeviceSubmit (row) {
        this.$http.post('@ROOT_API/dfAddress/switchDeviceForDfAddress', {
          id: this.swictchItem.id,
          deviceId: this.bindDevice.id
        }).then((res) => {
          if (res.data.status === '1') {
            this.$message({
              type: 'success',
              message: 'success'
            })
            this.switchDialog = false
            this.findData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
          }
        })
      },
      unbindItem (row) {
        this.$http.post('@ROOT_API/dfAddress/unbindDeviceForDfAddress', { id: row.id }).then((res) => {
          if (res.data.status === '1') {
            this.$message({
              type: 'success',
              message: 'success'
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
      handleCommand (item) {
        let arr = item.split('_')
        let data = this.itemList[arr[1]]
        if (arr[0] === '1') {
          this.deleteItem(data)
        } else if (arr[0] === '2') {
          this.update(data, 'update')
        } else if (arr[0] === '3') {
          this.updateItem(data, 'bind')
        } else if (arr[0] === '4') {
          this.setVistor(data, 'homeUserManage')
        } else if (arr[0] === '5') {
          this.setVistor(data, 'vistorManage')
        } else if (arr[0] === '9') {
          this.cloneDevice(data)
        } else if (arr[0] === '8') {
          // this.$router.push(`/admin/device/deviceList/deviceSetting/${data.deviceId}`)
          this.$router.push(`/admin/device/manage/deviceSetting/${data.id}@${data.deviceId}`)
        } else if (arr[0] === '10') {
          this.swictchItem = data
          this.switchDialog = true
        } else if (arr[0] === '11') {
          this.unbindItem(data)
        } else if (arr[0] === '12') {
          this.OpenDoor(data, '1')
        } else if (arr[0] === '13') {
          this.OpenDoor(data, '2')
        }
      },
      OpenDoor (row, type) {
        this.$http.post('@ROOT_API/dfAddress/openDoor', { id: row.id, relay: type }).then((res) => {
          if (res.data.status === '1') {
            this.$message({
              type: 'success',
              message: 'success'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
          }
        })
      },
      getRegionData () {
        return {
          country: '中国',
          countryCode: '001',
          province: this.reginSelect.province ? this.reginSelect.province.name : '',
          provinceCode: this.reginSelect.province ? this.reginSelect.province.code : '',
          city: this.reginSelect.city ? this.reginSelect.city.name : '',
          cityCode: this.reginSelect.city ? this.reginSelect.city.code : '',
          zone: this.reginSelect.area ? this.reginSelect.area.name : '',
          zoneCode: this.reginSelect.area ? this.reginSelect.area.code : ''
        }
      },
      setRegionData () {
        this.assignData = {
          province: {
            code: this.ruleForm.provinceCode,
            name: this.ruleForm.province
          },
          city: {
            code: this.ruleForm.cityCode,
            name: this.ruleForm.city
          },
          area: {
            code: this.ruleForm.zoneCode,
            name: this.ruleForm.zone
          }
        }
      },
      addImeiSubmit () {
        if (!this.addImei) {
          this.$message({
            type: 'error',
            message: 'Please input imei'
          })
          return false
        }
        this.$http.post('@ROOT_API/dfDevice/addDeviceForUser', {
          imei: this.addImei,
          name: this.addName,
          describeInfo: this.addDescribeInfo
        }).then((res) => {
          if (res.data.status === '1') {
            this.$message({
              type: 'success',
              message: 'Success'
            })
            this.addDialogShow = false
            this.querySearchAsync()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
          }
        })
      },
      clickShowImei () {
        this.selectImeiShow = true
        this.querySearchAsync()
      },
      selectImei (row) {
        this.imei = row.imei
        this.bindDevice = row
        this.selectImeiShow = false
      },
      toBaidu () {
        window.open('http://api.map.baidu.com/lbsapi/getpoint/index.html')
      },
      passWordChange (num) {
        this.$refs[`password${num}`].focus()
      },
      checkDevice (cb) {
        this.$isBindDevice(this.id).then((res) => {
          if (res.data.status === '1') {
            if (cb) cb()
          } else if (res.data.status === '100') {
            this.$message({
              type: 'error',
              message: this.$t('common.networkNotLinked')
            })
          } else if (res.data.status === '101') {
            this.$message({
              type: 'error',
              message: this.$t('common.deviceNotLoggedIn')
            })
          } else {
            this.$message({
              type: 'error',
              message: this.$t('common.deviceConnectionIsAbnormal')
            })
          }
        })
      },
      uploadSuccess (file) {
        this.ruleForm.addressImage = file
      },
      getPhoneStr (row) {
        let arr = []
        if (row.apartmentPhone1) arr.push(row.apartmentPhone1)
        if (row.apartmentPhone2) arr.push(row.apartmentPhone2)
        if (row.apartmentPhone3) arr.push(row.apartmentPhone3)
        return arr.join(';')
      }
    },
    mixins: [pageMixin],
    components: { RegionSelect, ISVIP, uploadFile }
  }
</script>

<style lang="less">
  .select-imei {
    .el-dialog__body {
      padding: 10px 20px 20px 20px;
    }
    .iconfont {
      font-size: 20px;
      cursor: pointer;
    }
    .iconfont:hover {
      color: #409eff;
    }
  }
  .radio-class:after {
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #fff;
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%) scale(0);
    transition: transform .15s ease-in;
  }
  .bottom-buttons {
    display: flex;
    justify-content: space-between;
  }
</style>
<style lang="less" scoped>
  .device-list {
    .device-list-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: rgb(255, 255, 255);
      box-shadow: 0 2px 9px 0.8px rgb(238, 241, 245);
      padding: 0 40px;
      .list {
        .item-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .device-item {
            width: 23%;
            height: 200px;
            border: 1px solid #eeeeee;
            margin-bottom: 20px;
            padding-top: 15px;
            div {
              margin-bottom: 10px;
              margin-left: 15px;
              display: flex;
              .d-label {
                font-size: 16px;
                color: #1abc9c;
                font-size: 16px;
                color: #1abc9c;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100px;
              }
              .d-value {
                font-size: 14px;
                color: #000000;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            p {
              float: right;
              margin-right: 20px;
              .d-button {
                background: #1abc9c;
                color: #ffffff;
                height: 20px;
                font-size: 14px;
                padding: 3px;
                border-radius: 3px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    /* 按钮样式 */
    .el-button:hover {
      background-color: rgb(255, 255, 255);
    }
    .setting-input-password {
      display: flex;
      justify-content: space-between;
      padding-left: 20px;
      input {
        width: 30px;
        height: 40px;
        margin-right: 20px;
        padding-left: 15px;
      }
    }
    .detail-button {
      padding: 12px 10px !important;
      margin-bottom: 10px;
      margin-left: 0 !important;
      margin-right: 10px;
    }
    // .detail-button:nth-child(6) {
    //   margin-left: 0px;
    // }
    .detail-button-en {
      padding: 12px 3px !important;
      margin-bottom: 10px;
      margin-left: 0 !important;
      margin-right: 10px;
    }
    .el-icon-more {
      margin-left: 10px;
    }
    .bind-form {
      .el-input {
        width: 60%;
      }
      span {
        margin-left: 10px;
        color: #409eff;
        font-size: 14px;
        cursor: pointer;
      }
      span:hover {
        color: #1989fa;
      }
    }
    .show-long-latitu {
      margin-left: 160px;
      margin-bottom: 10px;
      margin-top: -10px;
      color: #409eff;
      cursor: pointer;
    }
    .show-long-latitu:hover {
      color: #409eff;
    }
    // .el-form-item  {
    //   margin-bottom: 12px;
    // }
    .img-item {
      float: right;
      margin-top: 10px;
      cursor: pointer;
    }
    .card-items {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 20px;
      .el-card {
        margin-right: 20px;
        width: ~'calc((100% - 70px)/ 3)';
        margin-bottom: 20px;
        img {
          width: 100%;
          height: 220px;
        }
      }
      // .button-container {
      //   float: right;
      // }
    }
  }
</style>
