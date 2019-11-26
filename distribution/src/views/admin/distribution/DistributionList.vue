<!-- 分销规则列表页 -->
<template>
  <common-tpl class="distribution-list-wrap" :footer="true">
    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="ruleIcon" label="级别图标">
          <template slot-scope="scope">
            <div @click="beforeUploadClick(scope.$index)">
              <el-upload class="upload-picture fl-l pos-r"
                :class="{uploadHide: scope.row.ruleIconList && scope.row.ruleIconList.length === 1}"
                list-type="picture-card"
                :action="uploadUrl"
                :file-list="scope.row.ruleIconList"
                :limit="5"
                :on-exceed="exceedHandle"
                :before-upload="beforeAvatarUpload"
                :on-remove="removeHandle"
                :on-success="uploadSuccessHandle"
                @trigger="trigger(index)">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rankName" label="推广大使身份">
          <template slot-scope="scope">
            <i class="required-icon-on-table"></i>
            <el-input v-model="scope.row.rankName" clearable placeholder="限20个字符" @change="colChange('rankName', scope.$index)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="identityType" label="身份类型">
          <template slot-scope="scope">
            <span v-if="scope.row.identityType === 1">普通身份</span>
            <span v-else-if="scope.row.identityType === 2">区域身份</span>
            <span v-else-if="scope.row.identityType === 3">市级身份</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="setMealAmount" label="购买套餐满">
          <template slot-scope="scope">
            <i class="required-icon-on-table" v-if="scope.row.rand === 2"></i>
            <el-input v-if="scope.row.rand === 2" v-model="scope.row.setMealAmount" clearable placeholder="限20个字符" @change="colChange('setMealAmount', scope.$index)"></el-input>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="needIdentityAmount" label="推荐推广大使数">
          <template slot-scope="scope">
            <i class="required-icon-on-table" v-if="scope.row.rand === 3"></i>
            <el-input v-if="scope.row.rand === 3" v-model="scope.row.needIdentityAmount" clearable placeholder="0-100正整数" @change="colChange('needIdentityAmount', scope.$index)"></el-input>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="feeDescription" label="服务费（万元）">
          <template slot-scope="scope">
            <i class="required-icon-on-table" v-if="scope.row.rand === 4 || scope.row.rand === 5"></i>
            <el-input v-if="scope.row.rand === 4 || scope.row.rand === 5"
              v-model="scope.row.feeDescription" clearable  placeholder="限20个字符"  @change="colChange('rankName', scope.$index)"></el-input>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b" v-if="parseInt(scope.row.rand) !== 0">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleLink(scope.row)"><i class="icon el-icon-edit"></i>编辑</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column> -->
        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>
    </template>

    <template slot="other">
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
        <div class="message-content">
          <div v-for="(msg, index) in errorArr" :key="index">{{msg}}</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </template>
    <template slot="footer">
      <el-button type="primary" @click="handleSubmit()">保存</el-button>
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
        rankName: '',           // 规则名称
        agentLowness: '',       // 价格低
        agentHigh: ''           // 价格高
      },
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
      userInfo: {},
      uploadIndex: 0,
      dialogVisible: false,
      errorArr: []
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/distribution/rule', (res) => {
      this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.get('@ROOT_API/envoyRank/getMemberEnvoyRankList', {}).then((res) => {
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
        this.tableData = resData.data
        this.tableData.forEach((da) => {
          if (da.ruleIcon) {
            da['ruleIconList'] = [
              { url: da.ruleIcon }
            ]
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit () {
      let saveData = []
      this.errorArr = []
      this.tableData.forEach((da, index) => {
        if (!da.rankName) {
          this.errorArr.push(`第${index + 1}行推广大使身份为空！`)
        }
        if (da.rand === 1) {
          saveData.push({
            id: da.id,
            rand: da.rand,
            rankName: da.rankName,
            ruleIcon: da.ruleIcon,
            ruleName: da.rankName
          })
        } else if (da.rand === 2) {
          saveData.push({
            id: da.id,
            rand: da.rand,
            rankName: da.rankName,
            ruleIcon: da.ruleIcon,
            setMealAmount: parseFloat(da.setMealAmount),
            ruleName: da.rankName
          })
          if (!da.setMealAmount) {
            this.errorArr.push(`第${index + 1}行购买套餐额为空！`)
          }
          if (isNaN(parseFloat(da.setMealAmount))) {
            this.errorArr.push(`第${index + 1}行购买套餐额只能是大于0的数字！`)
          }
        } else if (da.rand === 3) {
          saveData.push({
            id: da.id,
            rand: da.rand,
            rankName: da.rankName,
            ruleIcon: da.ruleIcon,
            needIdentityAmount: parseFloat(da.needIdentityAmount),
            ruleName: da.rankName
          })
          if (!da.needIdentityAmount) {
            this.errorArr.push(`第${index + 1}行推荐推广大使数为空！`)
          }
          if (isNaN(parseFloat(da.needIdentityAmount))) {
            this.errorArr.push(`第${index + 1}行推荐推广大使数只能是0-100正整数！`)
          }
        } else if (da.rand === 4 || da.rand === 5) {
          saveData.push({
            id: da.id,
            rand: da.rand,
            rankName: da.rankName,
            ruleIcon: da.ruleIcon,
            feeDescription: da.feeDescription,
            ruleName: da.rankName
          })
          if (!da.feeDescription) {
            this.errorArr.push(`第${index + 1}行服务费为空！`)
          }
        }
      })
      if (this.errorArr.length > 0) {
        this.dialogVisible = true
        return false
      }
      this.$http.post('@ROOT_API/envoyRank/updateMemberEnvoyRank', saveData).then((res) => {
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
      }).finally(() => {
        setTimeout(() => {
          this.submitLoading = false
        }, 1000)
      })
    },
    /**
     * 自动补全百分位
     */
    inpBlur (type) {
      this.$Utils.blurAutoCompletion(this.formData, type)
    },
    /**
     * 文件上传前的格式和大小校验
     */
    beforeAvatarUpload (file) {
      const pattern = /(jpg|jpeg|png)$/ig
      const isLegalPhoto = pattern.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLegalPhoto) {
        this.$message.error('上传图片的格式不合法，请重新上传')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLegalPhoto && isLt2M
    },

    /**
     * 上传数量超过最大限制数量
     */
    exceedHandle (files, fileList) {
      this.$message({
        message: '最多只能上传1个图标',
        type: 'error'
      })
    },

    /**
     * 文件上传成功
     */
    uploadSuccessHandle (res) {
      if (res.status !== '1') {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      let item = this.tableData[this.uploadIndex]
      if (!item) return false
      let ruleIconList = []
      ruleIconList.push({url: this.$Utils.filterImgUrl(res.data)})
      item['ruleIconList'] = ruleIconList
      item['ruleIcon'] = res.data
      this.$set(this.tableData, item, this.uploadIndex)
      console.log(this.tableData)
    },

    /**
     * 文件被移除
     */
    removeHandle (file, fileList) {
      let item = this.tableData[this.uploadIndex]
      let ruleIconList = []
      item['ruleIconList'] = ruleIconList
      item['ruleIcon'] = ''
      this.$set(this.tableData, item, this.uploadIndex)
      console.log(this.tableData)
    },
    beforeUploadClick (index) {
      this.uploadIndex = index
    },
    colChange (col, index) {
      let item = this.tableData[index]
      if (col === 'setMealAmount') {
        if (isNaN(parseFloat(item[col])) || item[col] < 0) {
          item[col] = ''
        }
        if (item[col].length > 20) {
          item[col] = ''
        }
      } else if (col === 'needIdentityAmount') {
        if (isNaN(parseFloat(item[col])) || item[col] < 0 || item[col] > 100) {
          item[col] = ''
        }
      } else if (item[col].length > 20) {
        item[col] = ''
      }
      this.$set(this.tableData, item, index)
    }
  },
  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/admin/terminal?clientType=1&token=' + this.userInfo.token          // 上传图片
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
  .el-upload--picture-card{
    width: 80px;
    height: 80px;
    line-height: 95px;
  }
  .uploadHide{
    height: 80px;
    width: 80px;

    .el-upload-list__item{
      width: 80px;
      height: 80px;
    }
    .el-upload{
      display: none;
    }
  }
  .el-table td {
    border-left: 1px solid #ebeef5;
  }
  .el-table td:first-child {
    border-left: 0;
}
}
</style>