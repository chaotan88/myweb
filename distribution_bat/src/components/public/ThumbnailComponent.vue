<!-- 缩略图组件 -->
<template>
  <div class="thumbnail-component-wrap" :class="{active: actived === true}" ref="thumbnail-component-wrap" @click.stop="$emit('click')">
    <template v-if="list.length">
      <div :class="[listClass, item.customClass, {radio: isRadio, radioed: isRadio && radioIndex === index}]"  v-for="(item, index) in list" v-if="item && (custom || item.url || showList)" ref="drag-list" :style="customStyle" @click="$emit('radio', item, index)">
        <template v-if="!custom">
          <!-- :style="{width: customStyle.width, height: customStyle.height}" -->
          <a class="d-b pos-r full-wrap" :class="{'cursor-p': link === true}" :href="filterLink(item.url)" target="_blank" :title="item.url && link && !view ? '查看大图' : ''">
            <span class="full-wrap pos-a view-wrap" v-if="view && !move">
              <i class="pos-a el-icon-view"></i>
            </span>

            <template v-if="item.url">
              <!-- 居中显示 -->
              <img class="pos-a" :src="item.url | filterImgUrl" v-position-center v-if="positionCenter">
              <!-- 宽高100%显示 -->
              <img class="full-wrap" :src="item.url | filterImgUrl" v-else>
            </template>

            <!-- 默认空白图 -->
            <i class="pos-a el-icon-picture empty-img" v-else></i>
          </a>
          <span class="ta-c pos-a cursor-p btn-del el-icon-remove" title="删除" @click.stop="handleDelete(item, index)" v-if="posDel"></span>

          <div class="ta-c pos-a btns-wrap" @click.stop.prevent="" v-if="!custom">
            <span class="cursor-p va-m btn" style="min-width: 50px" title="上移" :class="{disabled: index === 0}" @click.stop.prevent="handleSort('prev', index)" v-if="move">
              <i class="el-icon-caret-left"></i>
            </span>
            <span class="cursor-p va-m btn" style="min-width: 50px" title="查看" @click.stop.prevent="handleView(item.url)" v-if="!link && view">
              <i class="el-icon-view"></i>
            </span>
            <span class="cursor-p va-m btn" title="删除" @click.stop.prevent="handleDelete(item, index)" v-if="del">
              <i class="el-icon-delete"></i>
            </span>
            <span class="cursor-p va-m btn" style="min-width: 50px" title="编辑" @click.stop.prevent="$emit('edit', item, index)" v-if="edit">
              <i class="el-icon-edit"></i>
            </span>
            <span class="cursor-p va-m btn" style="min-width: 50px" title="下移" :class="{disabled: index === list.length - 1}" @click.stop.prevent="handleSort('next', index)" v-if="move">
              <i class="el-icon-caret-right"></i>
            </span>
          </div>
        </template>

        <slot name="custom" v-else></slot>

        <slot name="text" :row="item"></slot>

        <!-- <slot name="scope" :data="item"></slot> -->

      </div>
    </template>

    <template v-if="!list.length && empty">{{'' | filterEmpty}}</template>

    <slot name="other"></slot>
  </div>
</template>

<script>
export default {
  props: {
    list: {   // 列表
      type: Array,
      default: []
    },

    styles: { // 样式
      type: Object
    },

    size: { // 大小
      type: [String, Number]
    },

    drag: {   // 是否拖拽
      type: Boolean,
      default: false
    },

    view: {   // 是否显示查看按钮
      type: Boolean,
      default: false
    },

    link: {   // 是否点击图片跳转链接
      type: Boolean,
      default: true
    },

    move: {   // 是否显示移动按钮
      type: Boolean,
      default: false
    },

    edit: {   // 是否显示编辑按钮
      type: Boolean,
      default: false
    },

    del: {   // 是否显示删除按钮
      type: Boolean,
      default: false
    },

    posDel: { // 是否右上角显示删除按钮
      type: Boolean,
      default: false
    },

    empty: { // 是否显示为空
      type: Boolean,
      default: true
    },

    autoDelete: { // 子组件删除列表
      type: Boolean,
      default: false
    },

    actived: { // 是否选中
      type: Boolean,
      default: false
    },

    custom: { // 自定义内容
      type: Boolean,
      default: false
    },

    index: Number, // 索引标示符

    positionCenter: { // 图片居中
      type: Boolean,
      default: false
    },

    isRadio: { // 是否单选
      type: Boolean,
      default: false
    },

    radioIndex: {
      type: [Number, String],
      default: 0
    },

    showList: { // 图片地址不存在时显示列表
      type: Boolean,
      default: false
    },

    sortBefore: { // 排序前操作
      type: Function
    }
  },

  data () {
    return {
      listClass: 'list-wrap',
      customStyle: {
        width: '120px',
        height: '120px'
      }
    }
  },

  watch: {
    'list': {
      handler () {
        this.init()
      },
      deep: true
    },

    'size' () {
      this.initSzie()
    },

    'styles' (value) {
      Object.assign(this.customStyle, this.styles)
    }
  },

  directives: {
    /**
     * 图片居中显示
     */
    'position-center': {
      inserted (el, binding, vnode) {
        setTimeout(() => {
          let parentNode = el.parentNode
          let parentWidth = parseInt(parentNode.style.width)
          let parentHeight = parseInt(parentNode.style.height)
          setTimeout(() => {
            el.style.position = 'absolute'
            if (el.width === el.height) {
              el.style.width = '100%'
              el.style.height = '100%'
            } else if (el.width > el.height) {
              el.style.width = 'auto'
              el.style.height = '100%'
              el.style.left = -((el.width - parentWidth) / 2) + 'px'
              setTimeout(() => {
                el.style.left = -((el.width - parentWidth) / 2) + 'px'
                setTimeout(() => {
                  el.style.left = -((el.width - parentWidth) / 2) + 'px'
                }, 30)
              }, 20)
            } else if (el.width < el.height) {
              el.style.width = '100%'
              el.style.height = 'auto'
              el.style.top = -((el.height - parentHeight) / 2) + 'px'
              setTimeout(() => {
                el.style.top = -((el.height - parentHeight) / 2) + 'px'
                setTimeout(() => {
                  el.style.top = -((el.height - parentHeight) / 2) + 'px'
                }, 30)
              }, 20)
            }
          }, 100)
        }, 200)
      },
      update (el, binding, vnode) {
        setTimeout(() => {
          let parentNode = el.parentNode
          let parentWidth = parseInt(parentNode.style.width)
          let parentHeight = parseInt(parentNode.style.height)
          el.style.position = 'absolute'
          if (el.width === el.height) {
            el.style.width = '100%'
            el.style.height = '100%'
          } else if (el.width > el.height) {
            el.style.width = 'auto'
            el.style.height = '100%'
            el.style.left = -((el.width - parentWidth) / 2) + 'px'
            setTimeout(() => {
              el.style.left = -((el.width - parentWidth) / 2) + 'px'
              setTimeout(() => {
                el.style.left = -((el.width - parentWidth) / 2) + 'px'
              }, 30)
            }, 20)
          } else if (el.width < el.height) {
            el.style.width = '100%'
            el.style.height = 'auto'
            el.style.top = -((el.height - parentHeight) / 2) + 'px'
            setTimeout(() => {
              el.style.top = -((el.height - parentHeight) / 2) + 'px'
              setTimeout(() => {
                el.style.top = -((el.height - parentHeight) / 2) + 'px'
              }, 30)
            }, 20)
          }
        }, 100)
      }
    }
  },

  mounted () {
    Object.assign(this.customStyle, this.styles)
    this.initSzie()
    this.init()
  },

  methods: {
    /**
     * 大小初始化
     */
    initSzie () {
      if (!this.size && parseInt(this.size) !== 0) return false
      let sizeUnit = parseInt(this.size) + 'px'
      this.customStyle.width = sizeUnit
      this.customStyle.height = sizeUnit
    },

    /**
     * 初始化
     */
    init () {
      this.$nextTick(() => {
        if (this.drag && this.$refs['drag-list']) {
          setTimeout(() => {
            this.$refs['drag-list'].forEach((obj, index) => {
              this.handleDrag(obj, index)
            })
          }, 30)
        }
      })
    },

    /**
     * 过滤链接
     */
    filterLink (url) {
      if (this.link && url) {
        return this.$Utils.filterImgUrl(url)
      } else {
        return false
      }
    },

    /**
     * 拖拽操作
     */
    handleDrag (obj, index) {
      obj.onmousedown = (ev) => {
        let e = ev || event

        let x = e.clientX - obj.offsetLeft
        let y = e.clientY - obj.offsetTop

        let createDiv = document.createElement('div')
        createDiv.innerHTML = obj.innerHTML
        createDiv.className = this.listClass + ' copy-list'
        createDiv.style.left = obj.offsetLeft + 'px'
        createDiv.style.zIndex = 1
        createDiv.style.top = obj.offsetTop + 'px'
        createDiv.style.position = 'absolute'
        for (let key in this.customStyle) {
          createDiv.style[key] = this.customStyle[key]
        }

        this.$refs['thumbnail-component-wrap'].appendChild(createDiv)
        setTimeout(() => {
          createDiv.style.zIndex = 10
        }, 150)

        if (obj.setCapture) {
          obj.setCapture()
        } else if (window.captureEvents) {
          window.captureEvents(e.mousemove || e.mouseup)
        }

        document.onmousemove = (ev) => {
          let e = ev || event
          let l = e.clientX - x
          let t = e.clientY - y

          this.$refs['drag-list'].forEach((row) => {
            row.className = this.listClass
            if (obj === row) return false
            if (this.filterCollision(createDiv, row)) {
              row.className = this.listClass + ' active'
            }
          })

          createDiv.style.left = l + 'px'
          createDiv.style.top = t + 'px'
        }

        document.onmouseup = (ev) => {
          this.$refs['thumbnail-component-wrap'].removeChild(createDiv)

          this.$refs['drag-list'].forEach((row, i) => {
            if (row.className && row.className.match(/active/gi)) {
              let temp = this.list[index]
              this.$set(this.list, index, this.list[i])
              this.$set(this.list, i, temp)
            }
            row.className = this.listClass
          })

          if (obj.releaseCapture) {
            obj.releaseCapture()
          } else if (window.captureEvents) {
            window.captureEvents(e.mousemove || e.mouseup)
          }

          document.onmousemove = null
          document.onmouseup = null
          return false
        }
        return false
      }
    },

    /**
     * 检测碰撞
     */
    filterCollision (obj1, obj2) {
      var l1 = obj1.offsetLeft
      var r1 = obj1.offsetLeft + obj1.offsetWidth / 2
      var t1 = obj1.offsetTop
      var b1 = obj1.offsetTop + obj1.offsetHeight / 2

      var l2 = obj2.offsetLeft
      var r2 = obj2.offsetLeft + obj2.offsetWidth / 2
      var t2 = obj2.offsetTop
      var b2 = obj2.offsetTop + obj2.offsetHeight / 2

      if (r1 < l2 || l1 > r2 || b1 < t2 || t1 > b2) {
        return false
      } else {
        return true
      }
    },

    /**
     * 排序
     */
    handleSort (type, index) {
      if (type === 'prev' && index === 0 || type === 'next' && index === this.list.length - 1) return false
      if (this.sortBefore) { // 传递父组件手动排序
        return this.sortBefore(type, index)
      } else { // 子组件自动排序
        let temp = this.list[index]
        let sortIndex = type === 'next' ? index + 1 : index - 1
        this.$set(this.list, index, this.list[sortIndex])
        this.$set(this.list, sortIndex, temp)
        this.$emit('change', this.list, type, index)
      }
    },

    /**
     * 点击按钮查看大图
     */
    handleView (url) {
      window.open(url, 'target')
    },

    /**
     * 删除
     */
    handleDelete (item, index) {
      // 是否子组件删除列表
      if (this.autoDelete) {
        this.list.splice(index, 1)
        this.$emit('change', this.list, this.index)
        this.$emit('delete', item, index)
      } else {
        this.$emit('delete', item, index)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.thumbnail-component-wrap{
  &.select{
    border: 1px solid #fff;
    padding: 8px;
    cursor: pointer;
    border-radius: 6px;
    box-sizing: border-box;
  }

  &.active{
    border: 1px solid rgba(0, 160, 233, .8);
    overflow: hidden;
    vertical-align: top;
    box-shadow: 0 0 15px rgba(0, 160, 233, .3);
  }

  .list-wrap{
    text-align: center;
    font-size: 0;
    vertical-align: top;
    display: inline-block;
    border: 1px solid #fff;
    position: relative;
    z-index: 5;
    box-sizing: border-box;

    .empty-img{
      color: rgba(0, 0, 0, .2);
      font-size: 40px;
      margin-top: -20px;
      margin-left: -20px;
      top: 50%;
      left: 50%;
    }

    .btn-del{
      color: red;
      font-size: 20px;
      right: -8px;
      top: -8px;
      display: none;
    }

    a{
      overflow: hidden;
    }

    img{
      max-width: inherit;
      left: 0;
    }

    &.active{
      border: 1px solid rgba(0, 0, 0, .05);
      box-shadow: 3px 3px 15px rgba(0, 0, 0, .2)
    }

    &.radio{
      padding: 10px;
    }

    &.radio.radioed{
      border: 1px solid rgba(0, 160, 233, .8);
      box-shadow: 0 0 15px rgba(0, 160, 233, .3);
      border-radius: 8px;
    }

    .view-wrap{
      color: #fff;
      font-size: 18px;
      background: rgba(0, 0, 0, .4);
      display: none;

      i{
        width: 30px;
        height: 30px;
        line-height: 30px;
        margin-left: -15px;
        margin-top: -15px;
        left: 50%;
        top: 50%;
      }
    }

    .btns-wrap{
      width: 100%;
      line-height: 30px;
      background: rgba(0, 0, 0, .4);
      left: 0;
      bottom: 0;
      z-index: 5;
      display: none;

      .btn{
        color: #fff;
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 18px;
        margin: 0 5px;
      }

      .btn.disabled{
        color: #aaa;
        cursor: not-allowed;
      }
    }

    &:hover{
      .view-wrap, .btns-wrap, .btn-del{
        display: block;
      }
    }
  }

  .copy-list{
    overflow: hidden;
    .btns-wrap{
      display: none !important;
    }
  }
}
</style>
