// import $ from 'jquery'

var toolbarOptions = [
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
  ['link', 'image', 'video']
]

var handlers = {
  'image': function () {
    // var self = this
    // console.log(this)
    var fileInput = this.container.querySelector('input.ql-image[type=file]')
    if (fileInput == null) {
      fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon')
      fileInput.classList.add('ql-image')
      fileInput.addEventListener('change', function () {
        if (fileInput.files != null && fileInput.files[0] != null) {
          var formData = new FormData()
          formData.append('file', fileInput.files[0])
          // $.ajax({
          //   url: 'http://b2c.andes-hub.com/behind/upload/uploadimg/goods/image',
          //   type: 'POST',
          //   cache: false,
          //   data: formData,
          //   processData: false,
          //   contentType: false
          // })
          // .done(function (res) {
          //   var range = self.quill.getSelection(true)
          //   self.quill.insertEmbed(range.index, 'image', 'http://b2c.andes-hub.com' + res.obj)
          //   self.quill.setSelection(range.index + 1)
          // })
          // .fail(function (res) {})
        }
      })
      this.container.appendChild(fileInput)
    }
    fileInput.click()
  }
}

export var editorOptions = {
  modules: {
    toolbar: {
      container: toolbarOptions,
      handlers: handlers
    }
  }
}
