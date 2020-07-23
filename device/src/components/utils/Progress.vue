<!-- 进度条 -->
<template>
  <div class="progress-container">
    <div class="progress-bg"></div>
    <el-progress type="circle" :percentage="num"></el-progress>
  </div>
</template>

<script>
export default {
  data () {
    return {
      num: 0,
      interval: false
    }
  },
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
    syncType: {
      type: [Number, String],
      default: ''
    }
  },
  mounted () {
    this.getSyncDataSpeed()
  },
  methods: {
    getSyncDataSpeed () {
      const getSpeed = () => {
        this.$http.post('@ROOT_API/dfAddress/getSyncDataSpeed', {
          id: this.id,
          syncType: this.syncType
        }).then((res) => {
          if (res.data.status !== '1') {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
            clearInterval(this.interval)
            this.$emit('success', '')
          } else {
            let { syscDataStatus } = res.data
            if (parseInt(syscDataStatus) === 1) {
              if (this.num < 90) this.num += 10
            } else {
              clearInterval(this.interval)
              this.$emit('success', syscDataStatus)
            }
          }
        })
      }
      getSpeed()
      this.interval = setInterval(() => {
        getSpeed()
      }, 10000)
    }
  }
}
</script>

<style lang="less">
.progress-container {
  position: absolute;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.8);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity .3s;
  .el-progress {
    margin-top: 30%;
    margin-left: calc(50% - 63px);
  }
}
</style>
