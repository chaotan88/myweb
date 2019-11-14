<!--新增 || 编辑大转盘活动-->
<template>
  <common-tpl class="turntable-data-wrap" footer>
    <template slot="header" class="stage-wrap">
    </template>

    <!-- 表单数据 -->
    <template slot="main">
      <template>
        <ul class="stage-content">
          <el-col :span="6" v-for="(item,index) in liList" :key="index" class="stage-item"   :class="{ 'stage-active': stage >= (index+1) }">
           <!-- <li @click="stage = index+1">{{item}}</li>-->
            <li>{{item}}</li>
          </el-col>
        </ul>
      </template>
     <el-row type="flex">
       <img src="../../../../assets/img/admin-operation-turntable.png" alt="" width="300px" height="400px" v-if="stage === 1">
       <el-form :model="formData" ref="formData"  :label-width="stage === 2 ? '0px' : '140px'" :rules="rules" class="activity-form-item">
         <div v-if="stage === 1" :key="formKey">
           <el-form-item label="活动名称：" prop="turnName" >
             <el-input v-model="formData.turnName" placeholder="限50个字符" maxlength="50" style="width: 200px;"></el-input>
           </el-form-item>
           <el-form-item label="活动时间：" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
             <el-row type="flex">
               <el-form-item prop="beginTime" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
                 <el-date-picker type="datetime" placeholder="选择开始时间" v-model="formData.beginTime" style="width: 100%;"></el-date-picker>
               </el-form-item>
               <span style="padding: 0 20px;">至</span>
               <el-form-item prop="endTime" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
                 <el-date-picker type="datetime" placeholder="选择结束时间" v-model="formData.endTime" style="width: 100%;"></el-date-picker>
               </el-form-item>
             </el-row>
           </el-form-item>
           <el-form-item label="活动状态：" prop="status" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
             <el-radio-group v-model="formData.status">
               <el-radio :label="1">未开始</el-radio>
               <el-radio :label="0">立即开始</el-radio>
             </el-radio-group>
           </el-form-item>
           <el-form-item label="活动规则：" prop="turnRule" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
             <el-input v-model="formData.turnRule" type="textarea" placeholder="规则" :autosize="{ minRows: 6, maxRows: 8}" maxLength="500"></el-input>
             <span style="color: #999; margin-left: 5px;">({{formData.turnRule.length}}/500)</span>
           </el-form-item>
         </div>
         <div v-if="stage === 2" :key="formKey">
           <el-table border :data="formData.turnPrizeRequestList" style="width: 100%" v-loading="loading" element-loading-text="加载中">
             <el-table-column prop="awardName" label="奖项" min-width="100"></el-table-column>
             <el-table-column prop="" label="奖项说明" min-width="180">
               <template slot-scope="scope">
                 <el-form-item :prop="'turnPrizeRequestList.' + scope.$index + '.awardExplain'" :rules="{required: true, message: '不为能空', trigger: 'change'}">
                   <el-input v-model="scope.row.awardExplain"  placeholder="限100个字符以内" maxLength="100"></el-input>
                 </el-form-item>
               </template>
             </el-table-column>
             <el-table-column prop="awardName" label="奖品名称" min-width="280" align="left">
               <template slot-scope="scope">
                 <el-row>
                   <el-col :span="scope.$index !== 7 ? 6 : 24" :class="{'align-center' : scope.$index === 7 }">
                     <el-form-item :prop="'turnPrizeRequestList.' + scope.$index + '.imgs'" :rules="[]">
                       <thumbnail-component :empty="false" :styles="img60" :link="false" del :auto-delete="true" :list="scope.row.imgs" style="width: 100%;height: 100%;" @change="deleteImg($event, scope.row, scope.$index)">
                         <template slot="other">
                           <upload-component :styles="img60" @success="uploadImgSuccess($event, scope.row.imgs, scope.$index)" v-if="!scope.row.imgs[0] || !scope.row.imgs[0].url"></upload-component>
                         </template>
                       </thumbnail-component>
                     </el-form-item>
                     <el-checkbox v-model="scope.row.imageIsShow">是否显示</el-checkbox>
                   </el-col>
                   <el-col :span="17" :offset="1" v-if="scope.$index !== 7" >
                     <el-col :span="10">
                       <el-form-item :prop="'turnPrizeRequestList.' + scope.$index + '.prizeType'" :rules="[{required: true, message: '不为能空', trigger: 'change'}]">
                         <el-select v-model="scope.row.prizeType" placeholder="请选择" :clearable="false">
                           <el-option
                             v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                       </el-form-item>
                     </el-col>
                     <el-col :span="12" :offset="1">
                       <el-form-item :prop="'turnPrizeRequestList.' + scope.$index + '.prizeName'" :rules="scope.row.prizeType === 5 ? rules.prizeNameString : rules.prizeNameInt">
                         <el-input v-model="scope.row.prizeName"  :placeholder="scope.row.prizeType === 5 ? '请输入0-16个字符' : '0-1000000正整数'" :maxLength="scope.row.prizeType === 5 ? 16 : 7"></el-input>
                       </el-form-item>
                       <div class="align-left">以上内容，将大转盘上显示</div>
                     </el-col>
                   </el-col>
                 </el-row>
               </template>
             </el-table-column>
             <el-table-column prop="" label="奖品数量" width="180" >
               <template slot-scope="scope">
                 <el-form-item :prop="'turnPrizeRequestList.' + scope.$index + '.prizeNum'" :rules="rules.prizeNum" v-if="scope.$index !== 7" >
                   <el-input v-model="scope.row.prizeNum"  placeholder="0-20000正整数"  maxLength="5"></el-input>
                 </el-form-item>
               </template>
             </el-table-column>
             <el-table-column prop="" label="中奖几率%" width="180">
               <template slot-scope="scope">
                 <el-form-item :prop="'turnPrizeRequestList.' + scope.$index + '.prizeOdds'" :rules="rules.prizeOdds">
                   <el-input  v-model="scope.row.prizeOdds"  placeholder="0-100的数字，允许输入百分比" maxLength="6" @blur="inpBlur(scope.$index, 'prizeOdds')"></el-input>
                 </el-form-item>
               </template>
             </el-table-column>
             <el-table-column prop="" label="每天最多派发" width="180" >
               <template slot-scope="scope">
                 <el-form-item :prop="'turnPrizeRequestList.' + scope.$index + '.maxNum'" :rules="rules.maxNum" v-if="scope.$index !== 7">
                   <el-input  v-model="scope.row.maxNum"  placeholder="0-20000正整数" maxLength="5" ></el-input>
                 </el-form-item>
               </template>
             </el-table-column>
             <el-table-column fixed="right" label="操作" width="100">
               <template slot-scope="scope">
                 <el-dropdown class="d-b">
                   <div class="ta-c d-b el-dropdown-link">
                     <span class="d-b va-m">...</span>
                   </div>
                   <el-dropdown-menu slot="dropdown">
                     <el-dropdown-item>
                       <div @click="clearRowData(scope.$index)"><i class="icon "></i>重置</div>
                     </el-dropdown-item>
                   </el-dropdown-menu>
                 </el-dropdown>
               </template>
             </el-table-column>
           </el-table>
         </div>
         <div v-if="stage === 3" :key="formKey">
           <el-form-item label="参与次数：" prop="timesType" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
             <el-radio-group v-model="formData.timesType" @change="changeJoinType">
               <el-radio :label="1">一天一次</el-radio>
               <el-radio :label="2">一天两次</el-radio>
               <el-radio :label="3">一天三次</el-radio>
               <el-radio :label="4">
                 <span>每天可参与</span>
                 <el-input v-model.number="formData.canJoinNum" min="0"  class="pd-h" style="width: 200px;"></el-input>
                 <span>次</span>
               </el-radio>
             </el-radio-group>
           </el-form-item>
           <el-form-item label="活动最多参与人数：" prop="joinSumPeople" v-if="1==2">
             <el-input v-model.number="formData.joinSumPeople"  style="width: 200px;"  maxLength="9"></el-input>
             <span class="pd-h">次</span>
           </el-form-item>
           <el-form-item label="活动最多参与人数：" prop="joinSumPeople" >
             <el-input v-model.number="formData.joinSumPeople"  style="width: 200px;"  maxLength="9"></el-input>
             <span class="pd-h">次</span>
           </el-form-item>
         </div>
         <div v-if="stage === 4" :key="formKey">
           <el-row class="mb-25">您已成功创建该活动！</el-row>
           <el-row class="mb-25">
             <img :src="formData.qrcodeImage" alt="">
           </el-row>
           <el-row class="" type="flex" align="middle">
             <span>链接地址：</span>
             <input class="el-input__inner" type="text" v-model="formData.linkUrl" id="lineUrl" readonly style="width: 300px;">
             <el-button type="primary"  @click="copyLink('lineUrl')" class="ml-30">复制地址</el-button>
           </el-row>
         </div>
       </el-form>
     </el-row>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button  @click="$router.go(-1)" v-if="stage === 4 || stage === 1">返 回</el-button>
      <el-button type="primary" @click="stage--" v-if="stage !== 4 && stage !== 1">上一步</el-button>
      <el-button type="primary" :loading="confirmLoading" @click="submitformData('formData')" v-if="stage !== 4">下一步</el-button>
    </template>
  </common-tpl>
</template>

<script>
  import UploadComponent from '@/components/public/UploadComponent'
  import ThumbnailComponent from '@/components/public/ThumbnailComponent'

  export default {
    components: {
      UploadComponent,
      ThumbnailComponent
    },
    data () {
      /**
       * 校验所需要兑换币
       */
      let validatePrizeName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'))
        } else if (value && (value <= 0 || value > 1000000 || (!value.toString().match(/^\d+$/g)))) {
          return callback(new Error('请输入0-1000000正整数'))
        } else {
          callback()
        }
      }
      /**
       * 校验中奖机率
       */
      let validatePrizeOdds = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('不能为空'))
        } else if (value && (value < 0 || value > 100 || (!value.toString().match(/^\d+(\.\d{0,2})?$/)))) {
          return callback(new Error('0-100的整数，允许百分位'))
        } else {
          callback()
        }
      }
      /**
       * 校验奖品数量，每天最多派发
       */
      let validatePublic = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('不能为空'))
        } else if (value && (value < 0 || value > 20000 || (!value.toString().match(/^\d+$/g)))) {
          return callback(new Error('请输入0-20000的整数'))
        } else {
          callback()
        }
      }
      /**
       * 校验
       */
      let checkNumber = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'))
        } else if (value && (value <= 0 || (!value.toString().match(/^\d+$/g)))) {
          return callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }
      /**
       * 校验大转盘名称不能为空，且不能以只有空格
       */
      let checkTurnName = (rule, value, callback) => {
        if (!value.trim()) {
          return callback(new Error('不能为空'))
        } else {
          callback()
        }
      }
      return {
        formKey: '',
        options: [{value: 1, label: '消费积分'},
          {value: 2, label: '通用积分'},
          {value: 3, label: '芯豆'},
          {value: 4, label: '余额'},
          {value: 5, label: '礼品'}],
        stage: 1,  // 新增、编辑活动阶段1,2,3,4
        confirmLoading: false,
        loading: false,
        // 奖品图片是否显示(0：不显示、1：显示)
        formData: {
          // 活动设置表单数据
          turnName: '',
          beginTime: '',
          endTime: '',
          status: 1,      // （1:未开始、2:开始、3:停止、4:重新开始）
          turnRule: '',
          // 参与设置表单数据
          timesType: 1,
          canJoinNum: 1,
          joinSumPeople: '',
          // 活动完成阶段数据
          linkUrl: '',
          qrcodeImage: '',
          // 奖品设置数据
          turnPrizeRequestList: [{awardName: '一等奖', imgs: [], awardNum: 1, awardExplain: '', prizeName: '', imageIsShow: false, prizeType: 1, prizeNum: '', maxNum: '', prizeOdds: ''},
            {awardName: '二等奖', imgs: [], awardNum: 2, awardExplain: '', prizeName: '', imageIsShow: false, prizeType: 1, prizeNum: '', maxNum: '', prizeOdds: ''},
            {awardName: '三等奖', imgs: [], awardNum: 3, awardExplain: '', prizeName: '', imageIsShow: false, prizeType: 1, prizeNum: '', maxNum: '', prizeOdds: ''},
            {awardName: '四等奖', imgs: [], awardNum: 4, awardExplain: '', prizeName: '', imageIsShow: false, prizeType: 1, prizeNum: '', maxNum: '', prizeOdds: ''},
            {awardName: '五等奖', imgs: [], awardNum: 5, awardExplain: '', prizeName: '', imageIsShow: false, prizeType: 1, prizeNum: '', maxNum: '', prizeOdds: ''},
            {awardName: '六等奖', imgs: [], awardNum: 6, awardExplain: '', prizeName: '', imageIsShow: false, prizeType: 1, prizeNum: '', maxNum: '', prizeOdds: ''},
            {awardName: '七等奖', imgs: [], awardNum: 7, awardExplain: '', prizeName: '', imageIsShow: false, prizeType: 1, prizeNum: '', maxNum: '', prizeOdds: ''},
            {awardName: '谢谢参与！', imgs: [], awardNum: 8, awardExplain: '', prizeName: '谢谢参与', imageIsShow: false, prizeType: 0, prizeNum: 0, maxNum: 0, prizeOdds: ''}]
        },
        rules: {
          turnName: [
            { validator: checkTurnName, trigger: 'change', required: true }
          ],
          prizeNameInt: [
            { validator: validatePrizeName, trigger: 'change', required: true }
          ],
          prizeNameString: [
            { message: '不能为空', trigger: 'change', required: true }
          ],
          prizeNum: [
            { validator: validatePublic, trigger: 'change', required: true }
          ],
          maxNum: [
            { validator: validatePublic, trigger: 'change', required: true }
          ],
          prizeOdds: [
            { validator: validatePrizeOdds, trigger: 'change', required: true }
          ],
          joinSumPeople: [
            {required: true, validator: checkNumber, trigger: 'blur'}
          ]
        },
        img60: {width: '60px', height: '60px'}, // 图片大小
        liList: ['参加活动', '奖品设置', '参与设置', '完成'],  // 活动阶段名
        formDataRules: {
          joinSumPeople: [
            {required: true, validator: checkNumber, trigger: 'blur'}
          ]
        },
        // },
        pageType: 1, // 1-添加活动页面，2-编辑活动页面
        activityId: ''    // 编辑活动id
      }
    },
    beforeRouteEnter (to, from, next) {
      // alert(from.path)
      next()
    },
    mounted () {
      this.stage = 1
      if (this.$route.path.match(/edit/gi)) {
        this.pageType = 2
        this.activityId = this.$route.query.id
        this.getActivityData()
      }
    },
    methods: {
      test () {},
      /**
       * 获取活动数据信息（仅编辑活动时调用）
       */
      getActivityData () {
        this.loading = true
        this.$http.get('@ROOT_API/turn/getTurnDetail', {
          params: {
            id: this.activityId
          }}
        ).then((res) => {
          let results = res.data
          if (parseInt(results.status) !== 1) {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1500
            })
            return false
            // ...
          }
          let data = results.data
          let vm = this
          vm.formData = data
          vm.formData.turnPrizeRequestList.forEach((item, index) => {
            vm.$set(item, 'imgs', [{url: item.prizeImage, img: item.prizeImage}])
            let imageIsShow = item.imageIsShow === 1 ? !false : false
            vm.$set(item, 'imageIsShow', imageIsShow)
            vm.inpBlur(index, 'prizeOdds')
          })
         // let timesType = 0 < data.canJoinNum < 4 ? data.canJoinNum : data.canJoinNum >= 4 ? 4 : ''
          let timesType = 0
          if (data.canJoinNum > 0 && data.canJoinNum < 4) {
            timesType = data.canJoinNum
          } else if (data.canJoinNum >= 4 || data.canJoinNum === 0) {
            timesType = 4
          } else {
            timesType = 0
          }
          vm.$set(vm.formData, 'timesType', timesType)
        }).finally(() => {
          this.loading = false
        })
        // ....
      },
      validateTime () {
        if (this.formData.beginTime !== '' && this.formData.endTime !== '') {
          if (this.formData.beginTime > this.formData.endTime) {
            this.$message({
              message: '活动结束时间必须大于开始时间！',
              type: 'warning',
              duration: 1500
            })
            return false
          }
          this.stage++
          this.formKey = new Date().getTime()
          // ....
        }
      },
      /**
       * 上传图片成功
       */
      uploadImgSuccess (url, imgsList, index) {
        this.$set(imgsList, 0, {url: this.$Utils.filterImgUrl(url), img: url})
        this.$set(this.formData.turnPrizeRequestList[index], 'prizeImage', url)
        console.log(this.formData.turnPrizeRequestList)
      },
      /**
       * 删除图片操作后对应清空 图片的url 属性prizeImage
       */
      deleteImg (item, row, index) {
        this.formData.turnPrizeRequestList[index].prizeImage = ''
        console.log(this.formData.turnPrizeRequestList)
      },
      /**
       * 每天参与次数变更后
       */
      changeJoinType (val) {
        this.formData.canJoinNum = val !== 4 ? val : ''
      },
      /**
       * 奖品设置单行清空操作
       * @param index 当前行索引
       */
      clearRowData (index) {
        this.formData.turnPrizeRequestList[index].awardExplain = ''
        this.formData.turnPrizeRequestList[index].prizeName = ''
        this.formData.turnPrizeRequestList[index].prizeType = ''
        this.formData.turnPrizeRequestList[index].prizeNum = ''
        this.formData.turnPrizeRequestList[index].joinSumPeople = ''
        this.formData.turnPrizeRequestList[index].prizeOdds = ''
        this.formData.turnPrizeRequestList[index].maxNum = ''
        this.formData.turnPrizeRequestList[index].prizeImage = ''
        this.formData.turnPrizeRequestList[index].imageIsShow = false
        this.formData.turnPrizeRequestList[index].imgs = []
        this.$message({
          message: '重置成功！',
          type: 'success',
          duration: 1500
        })
        // ...
      },
      /**
       * 提交参与设置数据
       */
      submitformData (formName) {
        let url = this.pageType === 1 ? '@ROOT_API/turn/addTurn' : '@ROOT_API/turn/editTurn'
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.stage === 1) {
              this.validateTime()
            } else if (this.stage === 2) {
              this.stage++
              this.formKey = new Date().getTime()
            } else if (this.stage === 3) {
              if (this.formData.timesType === 4 && this.formData.canJoinNum === '') {
                this.$message({
                  message: '请填写每天参与次数！',
                  type: 'warning',
                  duration: 1500
                })
                return false
              } else {
                // this.formData.beginTime = this.$Utils.filterDate(this.formData.beginTime)
                // this.formData.endTime = this.$Utils.filterDate(this.formData.endTime)
                this.formData.id = this.pageType === 2 ? this.activityId : ''
                let vm = this
                vm.formData.turnPrizeRequestList.forEach((item) => {
                  let imageIsShow = item.imageIsShow === true ? 1 : 0
                  vm.$set(item, 'imageIsShow', imageIsShow)
                })
                this.formData.imageIsShow = this.formData.imageIsShow === true ? 1 : 0
                let canJoinNum = this.formData.timesType !== 4 ? this.formData.timesType : this.formData.canJoinNum
                this.$http.post(url, {
                  id: this.formData.id,
                  status: this.formData.status,
                  turnName: this.formData.turnName,
                  beginTime: this.formData.beginTime,
                  endTime: this.formData.endTime,
                  turnRule: this.formData.turnRule,
                  joinSumPeople: this.formData.joinSumPeople,
                  canJoinNum: canJoinNum,
                  turnPrizeRequestList: this.formData.turnPrizeRequestList
                }).then((res) => {
                  let results = res.data
                  if (parseInt(results.status) !== 1) {
                    this.$message({
                      message: res.msg,
                      type: 'error',
                      duration: 1500
                    })
                    return false
                    // ...
                  }
                  this.formData.qrcodeImage = results.data.qrcodeImage
                  this.formData.linkUrl = results.data.linkUrl
                  this.stage = 4
                }).finally(() => {
                  this.loading = false
                })
              }
            }
          } else {
            return false
          }
        })
      },
       /**
       * 复制粘贴内容
       * @param val 粘贴内容的id
       */
      copyLink (val) {
        if (val) {
          let url = document.getElementById(val)
          url.select()
          document.execCommand('copy')
          this.$message({
            message: '复制地址成功',
            type: 'success'
          })
        }
      },
      /**
       * 价格输入框自动补全价格
       */
      inpBlur (index, obj) {
        this.$Utils.blurAutoCompletion(this.formData.turnPrizeRequestList[index], obj)
      }
    }
  }
</script>

<style lang="less" scope>
.turntable-data-wrap{
  .stage-content {
    margin-bottom: 25px;
    height: 40px;
      .stage-item {
        text-align: center;
   /*     padding: 0px 80px;
        width: 80px;*/
        line-height: 40px;
        background: #BDCEE8;
        display: inline-block;
        color: #fff;
        position: relative;
       /* cursor: pointer;*/
        &:after {
          content: '';
          display: block;
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
          border-left: 20px solid #BDCEE8;
          position: absolute;
          right: -18px;
          top: 0;
          z-index: 10;
        }
        &:before {
          content: '';
          display: block;
          border-top: 20px solid #BDCEE8;
          border-bottom: 20px solid #BDCEE8;
          border-left: 20px solid #ffffff;
          position: absolute;
          left: 0px;
          top: 0;
        }
        &:first-child {
          border-radius: 4px 0 0 4px;  // 圆角
        }
        &:last-child{
          border-radius: 0px 4px 4px 0px;  // 圆角
        }
        &:first-child:before { //-
          display: none;
        }
        &:last-child:after { //-
          display: none;
        }
      }
    .stage-active {
      background-color: #5494EC; //
    }
    .stage-active:after {
      border-left-color: #5494EC; //
    }
    .stage-active:before {
      content: '';
      display: block;
      border-top: 20px solid #5494EC;  //
      border-bottom: 20px solid #5494EC; //
      border-left: 20px solid #ffffff;
      position: absolute;
      left: 0px;
      top: 0;
    }
  }

  .align-center{
    text-align: center;
    .el-form-item__error{
      position: relative!important;
    }

  }
  .align-left{
    text-align: left;
  }

  /*-------------------  添加活动  -----------------------*/
  .activity-form-item{
    flex: 1;
    .el-input__inner{
     /* width: 280px;*/
    }
  }
  /*-------------------  奖品设置  -----------------------*/
   .el-textarea__inner{
     width: 360px;
   }
    /*-----------------  参与设置  -----------------------*/
  .stage-third{
    pd-h{
      padding: 0 10px;
    }
  }
  .mb-25{
    margin-bottom: 25px;
  }
  .ml-30{
    margin-left: 30px;
  }
}
</style>
<style lang="less">
  /*-------------------  奖品名称title内容居左  -------------*/
  .has-gutter{
    .el-table_1_column_3{
      div{
        text-align: left;
      }
    }
  }
  .formData{
    .el-form-item{
      margin-bottom: 20px;
      margin-top: 10px;
    }
  }
</style>

