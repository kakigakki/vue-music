<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back" />
    </div>
    <div class="title">
      {{ title }}
    </div>
    <div class="bg-image" :style="{ backgroundImage: getBgImg }" ref="bg">
      <div class="play-wrapper" v-show="showPlayBtn && data.length">
        <div class="play">
          <i class="icon-play"></i>
          <p class="text">随机播放全部</p>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 做一个背景层,当歌单列表滚动到图片上时,用这个背景层来遮住 -->
    <div class="bg-layer" ref="layer"></div>
    <scroll
      class="list"
      ref="scrollList"
      :listenScroll="true"
      :probeType="3"
      @scroll="listenScroll"
    >
      <div class="song-list-wrapper">
        <songList :songs="data"></songList>
      </div>

      <div class="loading-container" v-show="!data.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from "components/scroll/myScroll";
import songList from "components/songList/songList";
import loading from "components/loading/loading";
import { prefixStyle } from "common/js/dom";

const TITLE_HEIGHT = 40;
const transform = prefixStyle("transform");
const filter = prefixStyle("filter");
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    bgImg: {
      type: String,
      default: "",
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      scrollY: 0,
      showPlayBtn: true,
    };
  },
  computed: {
    //拼接图片地址
    getBgImg() {
      return `url(${this.bgImg})`;
    },
  },
  mounted() {
    this.bgClientHeight = this.$refs.bg.clientHeight;
    this.layerMaxHeight = this.bgClientHeight - TITLE_HEIGHT;
    this.$refs.scrollList.$el.style.top = this.bgClientHeight + "px";
  },
  components: {
    scroll,
    songList,
    loading,
  },
  methods: {
    listenScroll(pos) {
      this.scrollY = -pos.y;
    },
    back() {
      this.$router.back();
    },
  },
  watch: {
    scrollY(nVal) {
      const shrinkRatio = 1 + -nVal / this.bgClientHeight;
      const blurRation = 3 * (nVal / this.bgClientHeight);
      //当滚动距离小于layer的最大高度时,逐渐增加layer的高度
      if (nVal < this.layerMaxHeight && nVal > 0) {
        this.$refs.bg.style.zIndex = "0";
        this.$refs.bg.style.paddingTop = "70%";
        this.$refs.bg.style.height = "0";
        this.showPlayBtn = true;
        this.$refs.layer.style[transform] = `translate3d(0,${-nVal + "px"},0)`;
        this.$refs.bg.style[filter] = `blur(${blurRation}px)`;
      } else {
        if (nVal < 0) {
          //当往前滚动时,滚动距离为负数时,layer的高度逐渐缩小,图片放大
          this.$refs.bg.style[transform] = `scale(${shrinkRatio})`;
        }
        if (nVal >= this.layerMaxHeight) {
          //当到达layer的最大高度时,背景图片置顶,图片缩小为title的大小
          this.$refs.bg.style.paddingTop = "0";
          this.$refs.bg.style.height = TITLE_HEIGHT + "px";
          this.$refs.bg.style[filter] = "";
          this.showPlayBtn = false;
        }
        this.$refs.bg.style.zIndex = "10";
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>