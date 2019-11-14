import Vue from 'vue'

import HighSearch from '@/components/admin/HighSearch'                // 后台高级搜索
import ThirdMenu from '@/components/admin/ThirdMenu'                  // 三级菜单
import CommonTpl from '@/components/admin/CommonTpl'                  // 后台公共模板
import PlatformAttribute from '@/components/admin/PlatformAttribute'  // 商品分类
import GoodsClassify from '@/components/admin/GoodsClassify'          // 商品分类
import EditDropdown from '@/components/admin/EditDropdown'            // table编辑下拉
import EditorWrap from '@/components/admin/EditorWrap'                // 富文本编辑器
import NoData from '@/components/admin/NoData'                        // 暂无数据
import GrayTitle from '@/components/admin/GrayTitle'                  // 后台灰色标题
import ThumbnailComponent from '@/components/public/ThumbnailComponent' // 缩略图组件
import UploadComponent from '@/components/public/UploadComponent'       // 上传组件
import AliIcon from '@/components/public/AliIcon'       // 阿里图标组件
import RegionSelect from '@/components/public/RegionSelect'              // 省市区组件

Vue.extend({
  template: HighSearch
})
Vue.component('high-search', HighSearch)

Vue.extend({
  template: ThirdMenu
})
Vue.component('third-menu', ThirdMenu)

Vue.extend({
  template: CommonTpl
})
Vue.component('common-tpl', CommonTpl)

Vue.extend({
  template: PlatformAttribute
})
Vue.component('platform-attribute', PlatformAttribute)

Vue.extend({
  template: GoodsClassify
})
Vue.component('goods-classify', GoodsClassify)

Vue.extend({
  template: EditDropdown
})
Vue.component('edit-dropdown', EditDropdown)

Vue.extend({
  template: EditorWrap
})
Vue.component('editor-wrap', EditorWrap)

Vue.extend({
  template: NoData
})
Vue.component('no-data', NoData)

Vue.extend({
  template: GrayTitle
})
Vue.component('gray-title', GrayTitle)

Vue.extend({
  template: ThumbnailComponent
})
Vue.component('thumbnail-component', ThumbnailComponent)

Vue.extend({
  template: UploadComponent
})
Vue.component('upload-component', UploadComponent)

Vue.extend({
  template: AliIcon
})
Vue.component('ali-icon', AliIcon)

Vue.extend({
  template: RegionSelect
})
Vue.component('region-select', RegionSelect)
