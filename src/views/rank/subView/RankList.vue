<template>
  <transition appear name="slide">
    <musicList :title="title" :data="rankList" :bgImg="bgImg" :isRankView="true"></musicList>
  </transition>
</template>

<script>
import musicList from "components/musicList/musicList.vue";
import { createSong, isValidSong, setSongsUrl } from "common/js/song.js";
import { getMusicList } from "api/rank.js";
import { ERR_OK } from "api/config";
import { mapGetters } from "vuex";
export default {
  components: {
    musicList,
  },
  data() {
    return {
      rankList: [],
    };
  },
  created() {
    this._getMusicList(this.getRankList.id);
  },
  computed: {
    ...mapGetters(["getRankList"]),
    title() {
      return this.getRankList.topTitle;
    },
    bgImg(){
        return this.rankList[0]?.image||this.getRankList.picUrl
    }
  },
  methods: {
    _getMusicList(id) {
      getMusicList(id).then((res) => {
        if (res.code === ERR_OK) {
          setSongsUrl(this._normalizeSongs(res.songlist)).then(res=>{
              this.rankList =res
          })
          
        }
      });
    },
    //将获得的歌曲数据弄成我们想要的样子
    _normalizeSongs(songList) {
      //暂存处理完的所有歌曲信息
      let temp = [];
      songList.forEach((musicData) => {
        const data = musicData.data
        //判断歌曲是否依然可播放
        if (isValidSong(data)) {
          //工厂模式制造歌曲
          temp.push(createSong(data));
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