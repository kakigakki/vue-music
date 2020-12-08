<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchBox
        :hotKey="trimedHot"
        @searchSongs="searchSongs"
        ref="searchBox"
      ></searchBox>
    </div>
    <div class="shortcut-wrapper" v-show="!hot" ref="shortcut">
      <scroll class="shortcut" ref="scroll">
        <div>
          <div class="hot-key">
            <div class="title">Trending</div>
            <ul>
              <li
                v-for="(item, index) in hotKey"
                v-html="item.k"
                :key="index"
                class="item"
                @click="selectHotkey(item.k)"
              ></li>
            </ul>
          </div>
          <div class="search-history">
            <div class="title">
              <div class="text">History</div>
              <span class="clear" @click="deleteAllHistory">
                <i class="icon-clear"></i>
              </span>
            </div>
            <historyList
              :searches="getHistory"
              @selectOne="selectHotkey"
              @deleteOne="deleteOneHistory"
            ></historyList>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="hot">
      <suggest
        @blurInput="blurInput"
        :hotKey="hot"
        @enterItem="enterItem"
      ></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import searchBox from "components/searchBox/SearchBox";
import suggest from "components/suggest/Suggest";
import historyList from "components/history-list/HistoryList";
import scroll from "components/scroll/myScroll";
import { getItem } from "common/js/cache.js";
import { playerMixin } from "common/js/mixins.js";
import { getHotKey, search } from "api/search";
import { Singer } from "common/js/singer.js";
import { ERR_OK } from "api/config";
import { mapMutations, mapActions, mapGetters } from "vuex";
const SINGER_TYPE = "singerType";
export default {
  mixins: [playerMixin],
  components: {
    searchBox,
    suggest,
    historyList,
    scroll,
  },
  data() {
    return {
      hotKey: [],
      hot: "",
    };
  },
  computed: {
    ...mapGetters(["getHistory"]),
    trimedHot() {
      if (this.hot) {
        return this.hot.trim();
      }
    },
    shortcutList() {
      return this.hotKey.concat(this.getHistory);
    },
  },
  watch: {
    hot(nVal) {
      if (!nVal) {
        //下轮渲染时，刷新scroll,保证v-if从false到true后，也能滚动
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      }
    },
  },
  created() {
    this._getHotKey();
  },
  methods: {
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          //只取前面10个
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    selectHotkey(item) {
      this.hot = item;
    },
    searchSongs(query) {
      this.hot = query;
    },
    enterItem(item) {
      //将搜索框的记录添加localStorage和Vuex中
      this.hot && this.saveOne(this.hot);

      if (item.type === SINGER_TYPE) {
        const singer = new Singer(item.singermid, item.singername);
        this.$router.push({
          path: `/search/${singer.id}`,
        });
        //将singer存进vuex,方便详情页使用
        this._setSinger(singer);
      } else {
        this.addToPlaylist(item);
      }
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    deleteOneHistory(item) {
      this.deleteOne(item);
    },
    deleteAllHistory() {
      this.deleteAll();
    },
    bottomPlayer() {
      if (this.getPlaylist.length > 0) {
        this.$refs.shortcut.style.bottom = this.MINI_PLAYER_HEIGHT + "px";
      } else {
        this.$refs.shortcut.style.bottom = "0";
      }
      this.$refs.scroll.refresh();
    },
    ...mapMutations({
      _setSinger: "SET_SINGER",
    }),
    ...mapActions(["addToPlaylist", "saveOne", "deleteOne", "deleteAll"]),
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-large-x;
          color: $color-theme;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-large-x;
          color: $color-theme;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
