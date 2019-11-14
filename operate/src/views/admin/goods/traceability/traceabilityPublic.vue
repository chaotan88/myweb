<!--新增 || 编辑溯源-->
<template>
  <common-tpl class="good-traceability-wrap" footer>
    <template slot="header">
    </template>

    <!-- 表单数据 -->
    <template slot="main">
      <gray-title :title="title"></gray-title><br>
      <el-form :model="formData" ref="formData"  label-width="0">
        <el-form-item label="信息名称：" prop="originsName" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]" label-width="140px" >
          <el-input v-model="formData.originsName" placeholder="限20个字符" maxlength="20" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="信息说明：" prop="originsDesc" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]" label-width="140px"  >
          <el-input v-model="formData.originsDesc" type="textarea" placeholder="限50个字符" maxlength="50" :autosize="{ minRows: 4, maxRows: 4}" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort" :rules="ruleSort" label-width="140px"  >
          <el-input v-model="formData.sort"  placeholder="限0-255正整数" maxlength="3" style="width: 400px;"></el-input>
        </el-form-item>
        <el-table border :data="formData.originsDetailList" style="width: 100%" v-loading="loading" element-loading-text="加载中">
          <el-table-column prop="awardoriginsName" label="内容名称" min-width="180" >
            <template slot-scope="scope">
              <el-form-item label="" :prop="'originsDetailList.' + scope.$index + '.infoContent'" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
                <el-input  v-model="scope.row.infoContent"  placeholder="限20个字符，不含特殊字符" maxLength="20" ></el-input>
              </el-form-item>
<!--              <el-form-item label="" :prop="'originsDetailList.' + scope.$index + '.infoContent'" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]" v-if="scope.row.infoType === 1">
                <el-input  v-model="scope.row.infoContent" type="textarea"  placeholder="限1000个字符，不含特殊字符" maxLength="1000" :autosize="{ minRows: 4, maxRows: 4}" ></el-input>
              </el-form-item>
              <el-form-item :prop="'originsDetailList.' + scope.$index + '.imgs'" :rules="[{required: true, type: 'array', message: '请上传图片', trigger: 'change'}]" v-if="scope.row.infoType === 2">
                <thumbnail-component :empty="false" :styles="img60" :link="false" del :auto-delete="true" :list="scope.row.imgs" style="width: 100%;height: 100%;" @change="deleteImg($event, scope.row, scope.$index)">
                  <template slot="other">
                    <upload-component :styles="img60" @success="uploadImgSuccess($event, scope.row.imgs, scope.$index)" v-if="scope.row.imgs.length < 15"></upload-component>
                  </template>
                </thumbnail-component>
              </el-form-item>-->
            </template>
          </el-table-column>
          <el-table-column prop="" label="信息类型" min-width="140" >
            <template slot-scope="scope">
              <el-form-item :prop="'originsDetailList.' + scope.$index + '.infoType'" required>
                <el-select v-model="scope.row.infoType" placeholder="请选择" @change="">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="" label="是否必填" min-width="120">
            <template slot-scope="scope">
              <el-form-item :prop="'originsDetailList.' + scope.$index + '.ifRequired'" required>
                <el-radio-group v-model="scope.row.ifRequired">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="" label="备注" min-width="140" >
            <template slot-scope="scope">
              <el-form-item :prop="'originsDetailList.' + scope.$index + '.description'" >
                <el-input  v-model="scope.row.description"  placeholder="限20个字符，不含特殊字符" maxLength="20" ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="排序" min-width="80">
            <template slot-scope="scope">
              <div class="pos-r sort-wrap" style="padding-right: 20px;">
                <el-form-item class="d-ib margin-none" :prop="'originsDetailList.' + scope.$index + '.sort'" :rules="ruleSort">
                  <el-input maxlength="3" size="medium" v-model="scope.row.sort" ></el-input>
                </el-form-item>
<!--                <el-form-item class="d-ib margin-none" :prop="'originsDetailList.' + scope.$index + '.sort'" :rules="ruleSort">
                  <el-input maxlength="3" size="medium" v-model="scope.row.sort" @blur="rowBlur(scope.row)"></el-input>
                </el-form-item>
                <span style="width: 14px; height: 35px; position: absolute; right: 5px; top: 20px;">
                  <i class="pos-a el-icon el-icon-caret-top" :class="{'cursor-p': scope.$index !== 0}" @click="handleSortUp(scope.$index)" :disabled="scope.$index !== 0"></i>
                  <i class="pos-a el-icon el-icon-caret-bottom" style="bottom: 0;" :class="{'cursor-p': scope.$index !== formData.originsDetailList.length - 1}" @click="handleSortDown(scope.$index)" :disabled="scope.$index !== formData.originsDetailList.length - 1"></i>
                </span>-->
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-tooltip content="添加一行"  effect="dark" placement="bottom" v-if="scope.$index === 0">
                <i @click="handleAdd(formData.originsDetailList, scope.$index)" class="icon el-icon-plus"></i>
              </el-tooltip>
              <el-tooltip content="删除"  effect="dark" placement="bottom" v-if="scope.$index !== 0">
                <i @click="handleDelete(formData.originsDetailList, scope.$index)" class="icon el-icon-minus"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </template>

    <template slot="other">
      <el-dialog title="保存提示" :visible.sync="visible" width="480px">
        <span style="color: red;">保存编辑后原相关的设置商品需要重新编辑，确认是否修改？？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary"  @click="submitFormData('formData')">确 定</el-button>
        </span>
      </el-dialog>
    </template>
    <!-- 底部 -->
    <template slot="footer">
      <el-button  @click="back" >返 回</el-button>
      <el-button type="primary" :loading="confirmLoading" @click="submitFormData('formData')">确 定</el-button>
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
      // 校验排序
      let validateSort = (rule, value, callback) => {
        if (value === '' || value === null) return callback(new Error('不能为空'))
        if (value && (isNaN(value) || value < 0 || value > 255 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制0~255正整数'))
        callback()
      }
      return {
        loading: false,
        visible: false,
        confirmLoading: false,
        options: [{
          value: 0,
          label: '单行文本框'
        }, {
          value: 1,
          label: '多行文本框'
        }, {
          value: 2,
          label: '图片上传'
        }],
        formData: {
          originsName: '',
          originsDesc: '',
          sort: '',
          originsDetailList: [
            {
              ifRequired: 0,
              infoContent: '',
              description: '',
              infoType: 0,
              sort: 0
            }
          ]
        },
        rules: {
          // prizeoriginsNameInt: [
          //   { validator: validatePrizeoriginsName, trigger: 'change', required: true }
          // ],
          sort: [{required: true, validator: validateSort, trigger: 'blur'}]
        },
        ruleSort: [{required: true, validator: validateSort, trigger: 'blur'}],
        img60: {width: '60px', height: '60px'}, // 图片大小
        pageType: 1, // 1-添加活动页面，2-编辑活动页面
        title: '新增溯源信息',
        id: ''    // 编辑id
      }
    },
    beforeRouteEnter (to, from, next) {
      // alert(from.path)
      next()
    },
    mounted () {
      this.id = this.$route.query.levelId
      if (this.$route.path.match(/edit/gi)) {
        this.pageType = 2
        this.title = '编辑溯源信息'
        this.getDataInfo()
      }
      // this.formData.level = parseInt(query.level)
      this.formData.attributeTypeId = this.id
     // if (this.formData.level !== 3) return false
    },
    methods: {
      test () {
      },
      /**
       * 更改排序
       */
      handleUpdateSort (list) {
        if (!list) return false
        this.$http.post('@ROOT_API/origins/updateOriginsDetailSort', {
          originsDetailRequestList: list
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              duration: 1500,
              type: 'error'
            })
            return false
          }
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'success'
          })
        })
      },
      /**
       * 修改分类排序
       */
      rowBlur (row) {
        if (!row.sort || isNaN(row.sort) || row.sort < 0) return false
        let list = [{
          id: row.id,
          sort: row.sort
        }]
        this.handleUpdateSort(list)
      },
      /**
       * 向上移动
       */
      handleSortUp (index) {
        if (index === 0) return false
        let temp = this.formData.originsDetailList[index]
        let sort = temp.sort

        // 排序操作
        let arr = [
          {
            id: temp.id,
            sort: this.formData.originsDetailList[index - 1].sort
          },
          {
            id: this.formData.originsDetailList[index - 1].id,
            sort: temp.sort
          }
        ]
        if (temp.sort === this.formData.originsDetailList[index - 1].sort) arr.pop()
        this.handleUpdateSort(arr)

        // 移动位置
        temp.sort = this.formData.originsDetailList[index - 1].sort
        this.formData.originsDetailList[index - 1].sort = sort
        this.$set(this.formData.originsDetailList, index, this.formData.originsDetailList[index - 1])
        this.$set(this.formData.originsDetailList, index - 1, temp)
      },

      /**
       * 向下移动
       */
      handleSortDown (index) {
        if (index === this.formData.originsDetailList.length - 1) return false
        let temp = this.formData.originsDetailList[index]
        let sort = temp.sort

        // 排序操作
        let arr = [
          {
            id: this.formData.originsDetailList[index + 1].id,
            sort: temp.sort
          },
          {
            id: temp.id,
            sort: this.formData.originsDetailList[index + 1].sort
          }
        ]
        if (temp.sort === this.formData.originsDetailList[index + 1].sort) arr.pop()
        this.handleUpdateSort(arr)

        // 移动位置
        temp.sort = this.formData.originsDetailList[index + 1].sort
        this.formData.originsDetailList[index + 1].sort = sort
        this.$set(this.formData.originsDetailList, index, this.formData.originsDetailList[index + 1])
        this.$set(this.formData.originsDetailList, index + 1, temp)
      },
      /**
       * 获取活动数据信息（仅编辑活动时调用）
       */
      getDataInfo () {
        this.loading = true
        this.$http.post('@ROOT_API/origins/getOriginsInfo', {
          id: this.id
        }).then((res) => {
          let results = res.data
          if (parseInt(results.status) !== 1) {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.formData = results.data
         // this.formData.originsDetailList.forEach((item) => {
         //   if (item.infoType === 2 && item.infoContent !== null) {
         //     item.imgs = [{url: this.$Utils.filterImgUrl(item.infoContent), img: item.infoContent}]
         //   } else {
         //    // item.imgs = []
         //     this.$set(item, 'imgs', [])
         //   }
         // })
        }).finally(() => {
          this.loading = false
        })
      },
      /**
       * 商品图片上传成功
       */
      uploadImgSuccess (url, imgList, index) {
        imgList.push({url: this.$Utils.filterImgUrl(url), imageUrl: url})
       // this.formData.originsDetailList[index].infoContent = url
        this.$set(this.formData.originsDetailList[index], 'infoContent', url)
      },
      /**
       * 商品图片删除
       */
      deleteImg (event, imgList, index) {
        imgList = event
       // this.formData.originsDetailList[index].infoContent = ''
        this.$set(this.formData.originsDetailList[index], 'infoContent', '')
      },
      /**
       * 增加一行
       */
      handleAdd (data, index) {
        data.push({
          ifRequired: 0,
          infoContent: '',
          description: '',
          infoType: 0,
          sort: 0
        })
      },
      /**
       * 删除一行
       */
      handleDelete (data, index) {
        data.splice(index, 1)
      },
      submitBefore () {
        this.pageType === 1 ? this.submitFormData('formData') : this.visible = true
      },
      /**
       * 提交参与设置数据
       */
      submitFormData (formoriginsName) {
        this.$refs[formoriginsName].validate((valid) => {
          if (valid) {
           // this.formData.originsDetailList.forEach((item, index) => {
           //   this.$set(item, 'sort', index)
           // })
            if (this.pageType === 1 || this.visible === true) {
              this.$http.post('@ROOT_API/origins/saveOrUpdateOrigins', this.formData).then((res) => {
                let results = res.data
                if (parseInt(results.status) !== 1) {
                  this.$message({
                    message: results.msg,
                    type: 'error',
                    duration: 1500
                  })
                  return false
                }
                this.$message({
                  message: results.msg,
                  type: 'success',
                  duration: 1500
                })
                // this.$router.go(-1)
                this.back()
              }).finally(() => {
                this.loading = false
              })
            } else {
              this.visible = true
            }
          }
        })
      },
      back () {
        this.$router.push({
          path: '/admin/goods/traceability/list',
          query: {page: 1}
        })
      }
    }
  }
</script>

<style lang="less" scope>
.good-traceability-wrap{
  .icon{
    cursor: pointer;
  }
}
</style>
<style lang="less">
.good-traceability-wrap{
  .el-table{
    .el-form-item{
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
}
</style>

