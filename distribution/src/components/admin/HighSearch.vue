<!-- 高级搜索组件 -->
<template>
  <div class="pos-r search-wrap">
    <div class="pos-r search-head-wrap">
      <div class="d-ib custom search-inp">
        <slot name="search"></slot>
      </div>
      <div class="d-ib high-search-btn" @click="visible = !visible" v-if="textVisible"><i class="el-icon-sort"></i> 高级搜索</div>
      <div class="d-ib fl-r search-edit-wrap">
        <slot name="edit"></slot>
      </div>
    </div>
    <div class="pos-a high-search-down" :class="{active: !visible}">
      <div class="search-main">
        <slot name="main"></slot>
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="searchHandle">搜索</el-button>
        <el-button @click="visible = !visible">取消</el-button>
        <slot name="btn"></slot>
      </div>
    </div>
    <transition name="fade">
      <!-- <div class="pos-f high-search-mask" :class="{active: !visible}" v-if="!visible"></div> -->
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    textVisible: {
      type: Boolean,
      default: true
    },
    close: {                // 是否下拉
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      visible: true         // 显示高级搜索按钮
    }
  },
  mounted () {
    if (this.close === false) this.visible = false
  },
  methods: {
    /**
     * 搜索
     */
    searchHandle () {
      setTimeout(() => {
        if (this.close === true) this.visible = !this.visible
      }, 50)
      this.$emit('search')
    }
  }
}
</script>

<style lang="less" scoped>
.search-wrap{
  background: #fff;
  z-index: 90;

  .search-head-wrap{
    height: 36px;
    padding: 30px 30px 0 30px;
    z-index: 3;
  }

  .high-search-btn{
    color: #666;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    margin-left: 15px;
    cursor: pointer;
  }

  .high-search-btn:hover{
    color: #2eaaf7;
  }

  .search-edit-wrap{
    font-size: 15px;

    .el-button{
      height: 36px;
      line-height: 34px;
      padding-top: 0;
      padding-bottom: 0;
      overflow: hidden;
    }
  }

  .high-search-down{
    width: 100%;
    padding: 30px;
    overflow: hidden;
    background: #fff;
    left: 0;
    top: 0;
    z-index: 1;
    box-sizing: border-box;
    transition: .3s ease-in-out;
    box-shadow: 0 6px 4px rgba(0, 0, 0, .05);
    transform: scale(1, 0);
    transform-origin: center top 0px;

    .btn-wrap{
      padding-top: 50px;
      clear: both;

      .el-button{
        width: 100px;
        height: 36px;
        line-height: 36px;
        padding: 0;
      }
    }
  }

  .high-search-down.active{
    transform: scale(1, 1);
    z-index: 1000;
  }

  .high-search-mask{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    left: 0;
    top: 0;
    z-index: 2;
    display: none;
  }

  .high-search-mask.active{
    display: block;
    background: rgba(0, 0, 0, 0);
  }

  /* -------------------- { 清空 } -------------------- */
  .reset-btn{
    color: #888;
    width: 120px;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    text-align: center;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    margin-left: 6px;
  }

  .reset-btn:hover{
    color: #333;
    background: #fcfcfc;
  }
}
</style>

<style lang="less">
.search-wrap{
  .search-head-wrap{
    .el-button, .el-input__inner{
      border-radius: 20px;
    }

    .search-edit-wrap{
      .el-button, .el-button .el-input__inner{
        color: #2eaaf7;
        border-color: #2eaaf7;
      }

      .el-button.is-disabled, .el-button .el-input__inner.is-disabled{
        color: #bbb;
        border-color: #e5e5e5;
      }
    }
    
    .search-inp.custom{
      .el-form-item__content{
        margin-left: 0 !important;
      }

      .el-input__inner{
        height: 36px;
        line-height: 36px;
        padding-right: 30px;
      }

      .el-icon-search{
        color: #999;
        width: 34px;
        line-height: 36px;
        font-size: 18px;
        cursor: pointer;
        right: 0;
        top: 0;
      }

      .el-icon-search:hover{
        color: #56ade8;
      }
    }
  }

  .high-search-down{
    .el-form-item{
      width: 50%;
      float: left;

      .el-input{
        width: 300px;
      }

      .el-form-item__content{
        height: 40px;
      }

      .el-col{
        .el-form-item, .el-form-item__content, .el-input, .el-select{
          width: 100%;
        }        
      }
    }
  }
}
</style>
