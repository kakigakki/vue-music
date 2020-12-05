<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <template>
        <div>
          <div class="slider-wrapper" v-if="sliderItem.length">
            <slider>
              <div v-for="item in sliderItem" :key="item.id">
                <a
                  :href="[
                    'https://y.qq.com/n/yqq/album/' +
                      item.jump_info.url +
                      '.html',
                  ]"
                >
                  <img @load="imgLoad" :src="item.pic_info.url" />
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list">
            <p class="list-title">Popular Soundtrack</p>
            <ul>
              <li
                v-for="(item, index) in discList"
                :key="index"
                class="item"
                @click="selectSong(item)"
              >
                <span class="icon">
                  <img v-lazy="item.imgurl" alt="cover" />
                </span>
                <div class="text">
                  <p class="name" v-html="item.creator.name"></p>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { ERR_OK } from "api/config.js";
import { getSlider, getSongList, getDiscList } from "api/recommend.js";
import slider from "components/slider/slider";
import scroll from "components/scroll/myScroll";
import loading from "components/loading/loading";
import { playerMixin } from "common/js/mixins.js";
import { mapMutations } from "vuex";
export default {
  mixins: [playerMixin],
  data() {
    return {
      sliderItem: [],
      discList: [],
    };
  },
  computed: {},
  components: {
    slider,
    scroll,
    loading,
  },
  created() {
    this._getSlider();
    this._getDiscList();
  },
  methods: {
    imgLoad() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
    _getSlider() {
      getSlider().then((res) => {
        if (res.code == ERR_OK) this.sliderItem = res.focus.data.content;
      });
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    bottomPlayer() {
      if (this.getPlaylist.length > 0) {
        this.$refs.recommend.style.bottom = this.MINI_PLAYER_HEIGHT + "px";
      } else {
        this.$refs.recommend.style.bottom = 0;
      }
      this.$refs.scroll.refresh();
    },
    selectSong(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`,
      });
      this._setDiscSongs(item);
    },
    ...mapMutations({
      _setDiscSongs: "SET_DISC",
    }),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-large;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;

          img {
            width: 60px;
            height: 60px;
          }
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
            no-wrap();
          }

          .desc {
            color: $color-text-d;
            no-wrap();
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }

    .recommend-bottom {
      text-align: center;
      color: $color-text-d;
      font-size: $font-size-medium;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>