<!--新增 || 编辑拉群海报-->
<template>
  <common-tpl class="poster-data-wrap" footer >
    <template slot="header"></template>

    <!-- 表单数据 -->
    <template slot="main">
      <template class="">
        <el-form :model="formData" ref="formData"  label-width="140px">
          <el-form-item label="海报标题：" prop="title" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]" style="width: 450px;">
            <el-input v-model="formData.title" placeholder="限50个字符" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="海报图片：" prop="imgs" :rules="[{required: true, type: 'array', message: '请上传图片', trigger: 'change'}]">
            <thumbnail-component :empty="false" :styles="img100" :link="false" del :auto-delete="true" :list="formData.imgs" style="width: 100%;height: 100%;" @change="deleteImg">
              <template slot="other">
                <upload-component :styles="img100" @success="uploadImgSuccess($event, formData.imgs)" v-if="!formData.imgs[0] || !formData.imgs[0].url"></upload-component>
                <div class="va-t d-ib" style="color: #f5a74a; line-height: 20px;padding:60px 0 0 20px">
                  <template>建议尺寸：500 * 500px<br>建议大小：100KB以内</template>
                </div>
              </template>
            </thumbnail-component>
          </el-form-item>
          <el-form-item label="是否开启：" prop="delStatus" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]" >
            <el-radio-group v-model="formData.delStatus">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button  @click="$router.go(-1)">返 回</el-button>
      <el-button  type="primary" @click="submitFormData('formData')">确 定</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        img100: {width: '100px', height: '100px'}, // 图片大小
        formData: {
          imgs: [],
          title: '',
          status: 1,
          image: '',
          delStatus: 0
        },
        pageType: 1, // 1-添加页面，2-编辑页面
        id: ''    // 编辑海报id
      }
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    mounted () {
      if (this.$route.path.match(/edit/gi)) {
        this.pageType = 2
        this.id = this.$route.query.id
        this.getInfoData()
      }
    },
    methods: {
      test () {},
      /**
       * 获取海报数据信息（仅编辑时调用）
       */
      getInfoData () {
        this.$http.get('@ROOT_API/poster/getDetail', {
          params: {
            detailId: this.id
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
          }
          let data = results.data
          // ...图片处理
          this.formData = data
          this.formData.delStatus = parseInt(this.formData.delStatus)
          this.$set(this.formData, 'imgs', [{url: this.$Utils.filterImgUrl(data.image), img: data.image}])
        })
      },
      /**
       * 上传图片成功
       */
      uploadImgSuccess (url, imgsList) {
        this.$set(imgsList, 0, {url: this.$Utils.filterImgUrl(url), img: url})
        this.formData.image = url
      },
      /**
       * 删除图片操作后对应清空 url
       */
      deleteImg (item, row, index) {
        this.formData.image = ''
      },
      /**
       * 提交海报设置数据
       * @param formName 海报设置表单数据
       */
      submitFormData (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = this.pageType === 1 ? '@ROOT_API/poster/add' : '@ROOT_API/poster/edit'
            let paramsData = {
              title: this.formData.title,
              image: this.formData.image,
              delStatus: parseInt(this.formData.delStatus)
            }
            if (this.pageType === 2) paramsData.id = this.id
            this.$http.post(url, paramsData
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
              this.$message({
                message: '成功',
                type: 'success',
                duration: 1500
              })
              this.$router.push('/admin/operation/marketing/poster')
            }).finally(() => {
              // this.loading = false
            })
            // ...
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="less" scope>

</style>
<style lang="less">
 

</style>

