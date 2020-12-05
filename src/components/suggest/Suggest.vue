<template>
  <scroll
    class="suggest"
    :pullup="true"
    @scrollToEnd="searchMore"
    ref="scroll"
    :beforeScroll="true"
    @beforeScroll="blurInput"
  >
    <div class="suggest-list">
      <ul>
        <li
          class="suggest-item"
          v-for="(item, index) in suggestList"
          :key="index"
          @click="enterDetail(item)"
        >
          <div class="icon">
            <span :class="getClsIcon(item)"></span>
          </div>
          <div class="name">
            <span class="text" v-html="getName(item)"></span>
          </div>
        </li>
      </ul>
      <loading v-show="hasMore" :size="0.7"></loading>
    </div>
    <noResult v-show="!hasMore && !suggestList.length"></noResult>
  </scroll>
</template>

<script>
import scroll from "components/scroll/myScroll";
import loading from "components/loading/loading";
import noResult from "components/noResult/NoResult";
import {
  createSong,
  isValidSong,
  setSongsUrl,
  filterSinger,
} from "common/js/song.js";
import { ERR_OK } from "api/config";
import { playerMixin } from "common/js/mixins.js";

import { search } from "api/search";

const PER_PAGE_COUNT = 20;
const SINGER_TYPE = "singerType";
export default {
  mixins: [playerMixin],
  components: {
    scroll,
    loading,
    noResult,
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
      hasMore: false,
    };
  },
  methods: {
    getClsIcon(item) {
      if (item.type === SINGER_TYPE) {
        return "icon-mine";
      }
      return "icon-music";
    },
    getName(item) {
      if (item.type === SINGER_TYPE) {
        return item.singername;
      }
      return `${item.name}-${item.singer}`;
    },
    searchMore() {
      if (this.hasMore) {
        search(this.hotKey, ++this.page, this.showSinger, PER_PAGE_COUNT).then(
          (res) => {
            if (res.code === ERR_OK) {
              this._nomalizeSuggestList(res.data).then((res2) => {
                this.suggestList.push(...res2);
                setTimeout(() => {
                  this._checkMore(res.data);
                }, 20);
              });
            }
          }
        );
      }
    },
    //进入歌手详情页点击事件
    enterDetail(singerOrSong) {
      this.$emit("enterItem", singerOrSong);
    },
    bottomPlayer() {
      if (this.$refs.scroll.style) {
        if (this.getPlaylist.length > 0) {
          this.$refs.scroll.style.height = calc(
            (100 % -this.MINI_PLAYER_HEIGHT) + "px"
          );
        } else {
          this.$refs.scroll.style.height = "100%";
        }
        this.$refs.scroll.refresh();
      }
    },
    blurInput() {
      this.$emit("blurInput");
    },
    _search() {
      this.page = 1;
      this.hasMore = true;
      //每次输入的时候，回到顶部
      this.$refs.scroll.scrollTo(0, 0);
      search(this.hotKey, this.page, this.showSinger, PER_PAGE_COUNT).then(
        (res) => {
          if (res.code === ERR_OK) {
            this._nomalizeSuggestList(res.data).then((res2) => {
              this.suggestList = res2;
              setTimeout(() => {
                this._checkMore(res.data);
              }, 20);
            });
          }
        }
      );
    },
    _checkMore(songs) {
      const song = songs.song;
      if (
        !song.list.length ||
        song.curnum + (song.curpage - 1) * PER_PAGE_COUNT >= song.totalnum
      ) {
        this.hasMore = false;
      } else {
        if (!this.$refs.scroll.scroll.hasVerticalScroll) {
          this.searchMore();
        }
      }
    },
    _nomalizeSuggestList(data) {
      let arr = [];
      if (data.zhida?.singername && this.page === 1) {
        arr.push({ ...data.zhida, ...{ type: SINGER_TYPE } });
      }
      let musicData = data.song.list;
      return setSongsUrl(this._normalizeSongs(musicData))
        .then((res) => {
          arr.push(...res);
          return arr;
        })
        .catch((err) => {
          console.log(err);
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
  watch: {
    hotKey(nVal) {
      if (nVal === "") return;
      this._search();
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