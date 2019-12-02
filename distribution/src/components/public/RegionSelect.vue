<!-- 省市区组件 -->
<!-- 
初始化数据格式
:initData = {
  province: {
    code: '',
    name: ''
  },
  city: {
    code: '',
    name: ''
  },
  area: {
    code: '',
    name: ''
  }
}
-->
<template>
  <div class="region-select-wrap">
    <el-select v-model="province" placeholder="请选择省" @change="provinceChange" clearable>
      <template v-for="item in provinceData">
        <el-option
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </template>
    </el-select>
    <el-select v-model="city" placeholder="请选择市" @change="cityChange" clearable>
      <template v-for="item in cityData">
        <el-option
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </template>
    </el-select>
    <el-select v-model="area" placeholder="请选择区" @change="areaChange" clearable v-show="showArea">
      <template v-for="item in areaData">
        <el-option
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </template>
    </el-select>
  </div>
</template>

<script>
import RegionData from '@/assets/js/ChinaRegionData.js'

export default {
  props: {
    initData: {
      type: Object,
      default () {
        return {
          province: {
            code: '',
            name: ''
          },
          city: {
            code: '',
            name: ''
          },
          area: {
            code: '',
            name: ''
          }
        }
      }
    },
    showArea: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      province: '',
      city: '',
      area: '',
      select: {
        province: {                   // 省
          code: '',
          name: ''
        },
        city: {                       // 市
          code: '',
          name: ''
        },
        area: {                       // 区
          code: '',
          name: ''
        }
      },
      provinceData: [],               // 省数据集合
      cityData: [],                   // 市数据集合
      areaData: [],                   // 区数据集合

      currentProvince: [],            // 当前省份数据
      currentCity: [],                // 当前市数据
      filterWatch: false,             // 是否watch更新一次
      isInit: true                    // 初始化状态
    }
  },
  watch: {
    'initData': {
      handler () {
        if (!this.filterWatch) this.init()
        this.filterWatch = true
      },
      deep: true
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.$on('init', () => {
    //     setTimeout(() => {
    //       this.init()
    //     }, 30)
    //   })
    // })
    this.init()
    this.isInit = false
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      this.province = this.initData.province.code
      this.city = this.initData.city.code
      this.area = this.initData.area.code
      // 省级数据过滤
      if (!this.provinceData.length) {
        RegionData.filter((row) => {
          this.provinceData.push({ code: row.code, name: row.name })
        })
      }
      if (this.initData.province.code) {
        this.provinceChange(this.province)
        if (this.initData.city.code) {
          this.cityChange(this.initData.city.code)
          this.city = this.initData.city.code
          if (this.initData.area.code) {
            this.areaChange(this.initData.area.code)
            this.area = this.initData.area.code
          }
        }
      }
    },

    /**
     * 省级选择
     */
    provinceChange (value) {
      if (!this.isInit) {
        this.city = ''
        this.area = ''
      }
      this.cityData = []
      this.areaData = []
      this.currentCity = []
      this.select.city = {
        code: '',
        name: ''
      }
      this.select.area = {
        code: '',
        name: ''
      }
      if (value) {
        this.currentProvince = RegionData.filter((row) => row.code === value)[0]
        this.cityData = this.currentProvince.children
        this.select.province.code = this.currentProvince.code
        this.select.province.name = this.currentProvince.name
      } else {
        this.select.province.code = ''
        this.select.province.name = ''
      }

      this.updateSelect()
    },

    /**
     * 市选择
     */
    cityChange (value) {
      if (!this.isInit) this.area = ''
      this.areaData = []
      this.select.area = {
        code: '',
        name: ''
      }
      if (value) {
        this.currentCity = this.cityData.filter((row) => row.code === value)[0]
        this.areaData = this.currentCity.children

        this.select.city = {
          code: this.currentCity.code,
          name: this.currentCity.name
        }
      } else {
        this.select.city = {
          code: '',
          name: ''
        }
      }

      this.updateSelect()
    },

    /**
     * 区选择
     */
    areaChange (value) {
      let currentArea = this.currentCity.children.filter((row) => row.code === value)[0]
      if (value) {
        this.select.area = {
          code: currentArea.code,
          name: currentArea.name
        }
      } else {
        this.select.area = {
          code: '',
          name: ''
        }
      }
      this.updateSelect()
    },

    /**
     * 向父级触发选择更新
     */
    updateSelect () {
      this.$emit('change', this.select)
    }
  }
}
</script>

<style lang='less' scoped>
.region-select-wrap{
  display: flex;
  justify-content: space-between; 
  .el-select{
    width: 33.33%;
    padding-right: 10px;
  }

  .el-select:last-child{
    padding-right: 0;
  }
}
</style>
