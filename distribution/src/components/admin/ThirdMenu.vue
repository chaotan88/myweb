<!-- 三级菜单 -->
<template>
  <div class="third-layout">
    <div class="pos-r third-nav-wrap" v-if="$route.meta.thirdMenu !== false">
      <slot name="main"></slot>
    </div>
    <router-view></router-view>
  </div>  
</template>
