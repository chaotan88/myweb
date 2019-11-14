<sku ref="sku" :skuData="basicGoodsInfor" :btnData="btnData"  v-model="isSshow" value="2" min="5" max="10" @valChange="change" @skuSelected="skuSelected" @handleConfirm="handleConfirm" disabled="true" disableInput="true"></sku>

btnData : {
  btnNum: 1,      显示几个按钮  (默认一个)
  btnTxt: ['确定', '']      每个按钮的文字 
}

1、skuData 所需的基本数据
2、isSshow 是否显示弹窗
3、value  输入框的默认值
4、min    输入框的最小值
5、max    输入框的最大值
7、disabled  禁用所有数字计步器
8、disableInput 禁用数字计步器input输入
9、valChange   输入框值改变 返回值val valChange(val)
10、skuSelected  sku选择完毕后的回调 skuSelected(val)要触发子组件一个方法  this.$refs.sku.selectedRes(resData.data)
11、handleConfirm 底部按钮回调handleConfirm(val)