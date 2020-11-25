<template>
  <ul class="song-list">
    <li class="item" v-for="(item, index) in songs" :key="index">
      <div class="rank" v-if="isRankView">
        <span v-if="index<3" :class="`icon icon${index}`"></span>
        <span v-else class="text">{{index+1}}</span>
      </div>
      <div class="content" @click="selectSong(item, index)">
        <p class="name">{{ item.name }}</p>
        <p class="desc">{{ item.singer + "·" + item.album }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    isRankView:{
      type:Boolean,
      default:false
    }
  },
  computed:{
    rankIcon(){

    }
  },
  methods: {
    selectSong(item, index) {
      this.$emit("selectSong", item, index);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>