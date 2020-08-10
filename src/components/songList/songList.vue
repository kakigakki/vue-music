<template>
  <ul class="song-list">
    <li class="item" v-for="(item, index) in songs" :key="index">
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

.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        no-wrap();
        color: $color-text;
      }

      .desc {
        no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>