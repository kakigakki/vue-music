<template>
  <transition name="slide" appear>
    <musicList
      :title="singer.name"
      :bg-img="singer.avatar"
      :data="singerSongs"
    ></musicList>
  </transition>
</template>

<script>
import musicList from "components/musicList/musicList.vue";
import { createSong, isValidSong, setSongsUrl } from "common/js/song.js";
import { getSingerSongList } from "api/singer.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      singerSongs: [],
    };
  },
  components: {
    musicList,
  },
  computed: {
    ...mapGetters({
      singer: "getSinger",
    }),
  },
  created() {
    this._getSingerSongs();
  },
  methods: {
    _getSingerSongs() {
      getSingerSongList(this.singer.id).then((res) => {
        if (res.code == 0) {
          //将获得的数据包装成需要的歌曲信息
          setSongsUrl(this._normalizeSongs(res.data.list)).then((res) => {
            this.singerSongs = res;
          });
        }
      });
    },
    //将获得的歌曲数据弄成我们想要的样子
    _normalizeSongs(songList) {
      //暂存处理完的所有歌曲信息
      let temp = [];
      songList.forEach((item) => {
        let { musicData } = item;
        //判断歌曲是否依然可播放
        if (isValidSong(musicData)) {
          //工厂模式制造歌曲
          temp.push(createSong(item.musicData));
        }
      });
      return temp;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>