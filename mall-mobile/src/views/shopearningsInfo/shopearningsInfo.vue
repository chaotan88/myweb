<template>
  <div>
    <div v-html="list.purchaseDes" class="earningCss"></div>
  </div>
</template>
<script>
  export default {
    name: 'shopearningsInfo',
    directives: {
    },
    components: {
    },
    data () {
      return {
        list: []
      }
    },
    computed: {
    },
    mounted: function () {
      this.list = JSON.parse(localStorage.getItem('pulicData'))
    },
    methods: {
    },
    created () {
    }
  }
</script>
<style scoped>
.earningCss{
  width: 7.3rem;
  height: auto;
  overflow-x: hidden;
  margin: 0.1rem;
}
.earningCss >>> img{
  display: block;
  width: 100%;
  height: 4.5rem;
}
</style>

