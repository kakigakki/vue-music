<template>
  <div id="app">
    <m-header></m-header>
    <tabbar></tabbar>
    <router-view></router-view>
    <player></player>
  </div>
</template>


<script>
import MHeader from "components/m-header/m-header.vue";
import Tabbar from "components/tabbar/tabbar.vue";
import player from "components/player/player";
export default {
  components: {
    MHeader,
    Tabbar,
    player,
  },
};
</script>
<style lang="stylus"></style>
