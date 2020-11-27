<template>
  <scroll class="suggest">
    <div class="suggest-list">
      <ul>
        <li class="suggest-item" v-for="(item,index) in suggestList" :key="index">
          <div class="icon">
              <span :class="getClsIcon(item)"></span>
          </div>
          <div class="name">
              <span class="text" v-html="getName(item)"></span>
          </div>
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import scroll from "components/scroll/myScroll";
import { createSong, isValidSong, setSongsUrl } from "common/js/song.js";
import { ERR_OK } from "api/config";

import { search } from "api/search";

const PER_PAGE = 20;
const SINGER_TYPE = "singerType";
export default {
  components: {
    scroll,
  },
  props: {
    hotKey: {
      type: String,
      default: "",
    },
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      page: 1,
      suggestList: [],
    };
  },
  created(){
      console.log(1);
  },
  methods: {
      getClsIcon(item){
          if(item.type===SINGER_TYPE){
              return "icon-mine"
          }
          return "icon-music"
      },
      getName(item){
          if(item.type===SINGER_TYPE){
              return item.singername
          }
          return item.name
      },
    _search(query) {
      this.page = 1;
      search(query, this.page, this.showSinger, PER_PAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.suggestList = this._nomalizeSuggestList(res.data);
        }  
      });
    },
    _nomalizeSuggestList(data) {
      let arr = [];
      if (data.zhida?.singername && this.page === 1) {
        arr.push({...data.zhida,...{type: SINGER_TYPE} });
      }
      let musicData = data.song.list;
      setSongsUrl(this._normalizeSongs(musicData)).then((res) => {
        arr.push(...res)
      });
      return arr;
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
  watch: {
    hotKey(nVal) {
     console.log(11);
      if (nVal === "") return;
      this._search(nVal);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>