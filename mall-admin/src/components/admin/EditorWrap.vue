<template>
  <quill-editor class="quill-editor-wrap" :options="editorOptions" v-model="editorText" @change="onEditorChange($event)"></quill-editor>
</template>

<script>
export default {
  props: {
    initData: {       // 初始化数据
      type: String,
      default: ''
    }
  },

  data () {
    let _this = this

    let toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{'header': 1}, {'header': 2}],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],
      [{'indent': '-1'}, {'indent': '+1'}],
      [{'direction': 'rtl'}],
      [{'size': ['small', false, 'large', 'huge']}],
      [{'header': [1, 2, 3, 4, 5, 6, false]}],
      [{'color': []}, {'background': []}],
      [{'font': []}],
      [{'align': []}],
      ['clean'],
      ['link', 'image']
      // ['link', 'image', 'video']
    ]

    let handlers = {
      image () {
        let self = this
        let fileInput = self.container.querySelector('input.ql-image[type=file]')
        if (fileInput == null) {
          fileInput = document.createElement('input')
          fileInput.setAttribute('type', 'file')
          fileInput.setAttribute('multiple', 'multiple')
          fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon')
          fileInput.classList.add('ql-image')
          fileInput.addEventListener('change', function () {
            let fileGroup = fileInput.files
            if (fileGroup.length) {
              for (let i = 0; i < fileGroup.length; i++) {
                if (!fileGroup[i]) return false
                let formData = new FormData()
                formData.append('file', fileGroup[i])
                let config = { headers: {'Content-Type': 'multipart/form-data'} }
                _this.$http.post('@ROOT_API/upload/uploadimg/shopadmin/source', formData, config).then((res) => {
                  let resData = res.data
                  if (parseInt(resData.status) !== 1) {
                    _this.$message({
                      message: resData.msg,
                      type: 'error',
                      duration: 1500
                    })
                    return false
                  }
                  let range = self.quill.getSelection(true)
                  self.quill.insertEmbed(range.index, 'image', _this.$Utils.filterImgUrl(resData.data))
                  self.quill.setSelection(range.index + 1)
                  fileInput.value = ''
                })
              }
            }
          })
          this.container.appendChild(fileInput)
        }
        fileInput.click()
      }
    }

    return {
      editorText: '',     // 编辑器内容
      editorOptions: {    // 富文本编辑器的配置
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: handlers
          }
        }
      }
    }
  },

  watch: {
    'initData' () {
      this.editorText = this.initData
    }
  },

  mounted () {
    this.editorText = this.initData
  },

  methods: {
    /**
     * 编辑器内容改变
     */
    onEditorChange (data) {
      this.$emit('change', data)
    }
  }
}
</script>

<style lang="less" scoped></style>
