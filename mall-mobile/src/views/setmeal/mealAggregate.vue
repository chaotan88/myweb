<template>
  <div>
     <!--nav栏目-->
    <div class="optionalMeal-nav">
      <ul id="navBox">
        <li v-for="(item, index) in columnData" :class="index == navIndex ? 'active' : ''" @click="navTap($event, index, item)">
          <span>{{item.columnName}}</span>
        </li>
      </ul>
    </div>
    <!--自选套餐-->
    <optional-meal v-if="currentView == 2 && columnData.length > 0" :columnData="columnData" :navIndex="navIndex" ref="optionalMeal"></optional-meal>
    <!--固定套餐-->
    <fixed-meal v-if="currentView == 1 && columnData.length > 0" :columnData="columnData" :navIndex="navIndex"></fixed-meal>
  </div>
</template>
<script>
  import optionalMeal from './optionalMeal'       // 自选套餐
  import fixedMeal from './fixedMeal'             // 固定套餐
  export default {
    components: {
      optionalMeal,
      fixedMeal
    },
    data () {
      return {
        navIndex: 0,                              // nav索引
        columnData: [],                           // nav数据
        mealId: '',                    // 套餐id
        mealTypes: '',                 // 套餐类型 1 固定套餐 2 自选套餐
        currentView: 0                // 默认自选套餐
      }
    },
    mounted: function () {
      window.scrollTo(0, 0)
      this.mealTypes = localStorage.getItem('mealTypes')
      this.mealId = localStorage.getItem('mealId')
      // this.currentView = parseInt(val)
      this.getCoumData()          // 获取nav栏目数据
    },
    watch: {
      'mealTypes' (val) {
        this.currentView = parseInt(val)
      },
      'mealId' (val) {
        this.columnData.forEach((item, index) => {
          if (parseInt(item.id) === parseInt(this.mealId)) {
            this.navIndex = index
          }
        })
      }
    },
    methods: {
      /**
       * 获取nav栏目数据
      */
      getCoumData () {
        this.$http.get(`${this.api.allSetMealList}`, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          let resData = res.data
          if (res.data.status !== this.api.ERR_OK) {
            this.noData = true
            return false
          }
          resData.data = resData.data.filter((row) => row.columnResList && row.columnResList.length > 0)
          this.columnData = resData.data
          resData.data.forEach((item, index) => {
            if (parseInt(item.id) === parseInt(this.mealId)) {
              this.navIndex = index
            }
          })
        })
      },
      /**
       * nav点击
      */
      navTap (event, index, v) {
        this.navIndex = index    // 重置nav索引
        if (v.setmealType === 1) {   // 固定套餐
          this.mealTypes = 1
          localStorage.setItem('mealTypes', 1)
        } if (v.setmealType === 2) { // 自选套餐
          this.mealTypes = 2
          localStorage.setItem('mealTypes', 2)
        }
        this.mealId = v.id
        localStorage.setItem('mealId', v.id)     // 存储栏目id
        // nav滚动
        var move = 0
        var left = event.currentTarget.offsetLeft
        var elWidth = event.currentTarget.offsetWidth
        var width = (document.getElementById('navBox').clientWidth - elWidth) / 2
        if (left <= width) {
          move = 0
        } else {
          move = width - left
        }
        document.getElementById('navBox').scrollLeft = -move
      }
    }
  }
</script>

<style scoped lang="less">
  /**nav栏目**/
  .optionalMeal-nav{
    height: .78rem;
    background: linear-gradient(to right, #f05033, #fe8d33);
    ul{
      overflow: hidden;
      overflow-x: scroll;
      white-space: nowrap;
      line-height: .78rem;
      &::-webkit-scrollbar {
        height: 0px;
      }
      li{
        display: inline-block;
        margin: 0 .27rem;
        font-size: .28rem;
        color: rgba(255,255,255,0.7);
        position: relative;
        &.active{
          color: #fff;
          font-weight: bold;
          span{
            &::after{
              content: '';
              height: .06rem;
              background: #f6be99;
              display: block;
              position: absolute;
              left: 0;
              right: 0;
              margin: auto;
              bottom: .08rem;
              border-radius: 5px;
            }
          }
        }
      }
    }
  }
</style>
