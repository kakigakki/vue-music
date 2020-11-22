<template>
  <transition appear name="slide">
    <musicList :title="title" :bgImg="bgImage" :data="songsList"></musicList>
  </transition>
</template>

<script>
import musicList from "components/musicList/musicList.vue";
import { createSong, isValidSong, setSongsUrl } from "common/js/song.js";
import { getSongList } from "api/recommend.js";
import { mapGetters } from "vuex";
export default {
  components: {
    musicList,
  },
  created() {
      if(!this.getDisc.dissid){
          this.$router.push({
              path:"/recommend"
          })
      }
    this._getDiscSongs();
  },
  data() {
    return {
      songsList: [],
    };
  },
  methods: {
    _getDiscSongs() {
      getSongList(this.getDisc.dissid).then((res) => {
        if (res.code === 0) {
          //将获得的数据包装成需要的歌曲信息
          console.log(res.cdlist[0].songlist);
          setSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((res) => {
            this.songsList = res;
            console.log(this.songsList);
          });
        }
      });
    },
    //将获得的歌曲数据弄成我们想要的样子
    _normalizeSongs(songList) {
      //暂存处理完的所有歌曲信息
      let temp = [];
      songList.forEach((musicData) => {
        //判断歌曲是否依然可播放
        if (isValidSong(musicData)) {
          //工厂模式制造歌曲
          temp.push(createSong(musicData));
        }
      });
      return temp;
    },
  },
  computed: {
    ...mapGetters(["getDisc"]),
    title() {
      return this.getDisc.dissname;
    },
    bgImage() {
      return this.getDisc.imgurl;
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