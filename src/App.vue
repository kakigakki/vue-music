<template>
  <div id="app">
    <m-header></m-header>
    <tabbar></tabbar>
    <router-view></router-view>
  </div>
</template>


<script>
import MHeader from "components/m-header/m-header.vue";
import Tabbar from "components/tabbar/tabbar.vue";
export default {
  components: {
    MHeader,
    Tabbar
  }
};
</script>
<style lang="stylus"></style>
