<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchBox :hotKey="hot" @searchSongs="searchSongs"></searchBox>
    </div>
    <div class="shortcut-wrapper" v-show="!hot">
      <div class="shortcut">
        <div class="hot-key">
          <div class="title">热门搜索</div>
          <ul>
            <li
              v-for="(item, index) in hotKey"
              v-html="item.k"
              :key="index"
              class="item"
              @click="selectHotkey(item)"
            ></li>
          </ul>
        </div>
        <div class="search-history">
          <div class="title">搜索历史</div>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="hot">
      <suggest :hotKey="hot" @enterItem="enterItem"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import searchBox from "components/searchBox/SearchBox";
import suggest from "components/suggest/Suggest";
import { getHotKey, search } from "api/search";
import { Singer } from "common/js/singer.js";
import { ERR_OK } from "api/config";
import { mapMutations, mapActions } from "vuex";
const SINGER_TYPE = "singerType";
export default {
  components: {
    searchBox,
    suggest,
  },
  data() {
    return {
      hotKey: [],
      hot: "",
    };
  },
  created() {
    this._getHotKey();
  },
  methods: {
    _getHotKey() {
      getHotKey().then((res) => {
        console.log(res);
        if (res.code === ERR_OK) {
          //只取前面10个
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    selectHotkey(item) {
      this.hot = item.k;
    },
    searchSongs(query) {
      this.hot = query;
    },
    enterItem(item) {
      if (item.type === SINGER_TYPE) {
        const singer = new Singer(item.singermid, item.singername);
        this.$router.push({
          path: `/search/${singer.id}`,
        });
        //将singer存进vuex,方便详情页使用
        this._setSinger(singer);
      } else {
        console.log(item);
        this.addToPlaylist(item)
      }
    },
    ...mapMutations({
      _setSinger: "SET_SINGER",
    }),
    ...mapActions(["addToPlaylist"]),
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
          font-size: $font-size-medium;
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
          font-size: $font-size-medium;
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
