<template>
  <scroll
    class="listview"
    :probeType="3"
    :listenScroll="true"
    @scroll="listenScroll"
    ref="scroll"
  >
    <div ref="list">
      <ul class="list-group" v-for="(item, index) in singers" :key="index">
        <div class="list-group-title">
          {{ item.title }}
        </div>
        <div
          class="list-group-item"
          v-for="(singer, index) in item.items"
          :key="index"
          @click="enterDetail(singer)"
        >
          <img v-lazy="singer.avatar" alt="avatar" class="avatar" />
          <p class="name">{{ singer.name }}</p>
        </div>
      </ul>
    </div>
    <ul
      class="list-shortcut"
      @touchstart="touchstart"
      @touchmove.stop.prevent="touchmove"
      v-show="titleWord.length"
    >
      <li
        class="item"
        v-for="(item, index) in titleWord"
        :key="index"
        :class="{ current: currentIndex === index }"
      >
        {{ item[0] }}
      </li>
    </ul>
    <div
      class="list-fixed"
      ref="fixedTitle"
      v-show="singers.length && currentIndex != -1"
    >
      <p class="fixed-title">
        {{ titleWord[currentIndex] }}
      </p>
    </div>
    <div class="loading-container" v-show="!singers.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import scroll from "components/scroll/myScroll";
import loading from "components/loading/loading";
const TITLE_HEIGHT = 30;
const WORD_HEIGHT = 18;
export default {
  components: {
    scroll,
    loading,
  },
  props: {
    singers: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      scrollY: 0, //滚动距离
      currentIndex: 0, //当前所在索引
      diff: 0, //当前索引区域内,顶部到滚动title的距离
    };
  },
  computed: {
    //获取当前所有歌手的首字母表
    titleWord() {
      return this.singers.map((a) => a.title);
    },
  },
  methods: {
    //监听滚动事件
    listenScroll(pos) {
      //因为pos.y是负值,所以转为正值,方便使用
      this.scrollY = -pos.y;
    },
    touchstart(e) {
      //点击时坐标
      this.touch.startY = e.touches[0].clientY;
      //获取点击到第几个
      this.touch.startIndex = this.titleWord.indexOf(
        e.touches[0].target.innerText
      );
      if (this.touch.startIndex >= 0) {
        this.currentIndex = this.touch.startIndex;
      }
      this._scrollTo(this.currentIndex);
    },
    touchmove(e) {
      this.touch.movedY = e.touches[0].clientY;
      const distance = this.touch.movedY - this.touch.startY;
      const delta = (distance / WORD_HEIGHT) | 0;
      const anchorIndex = this.touch.startIndex + delta;
      this._scrollTo(anchorIndex);
    },
    enterDetail(singer) {
      this.$emit("enterDetail", singer);
    },
    //计算每块分区列表的内容的高度
    _calculateHeights() {
      this.heights = [];
      const list = this.$refs.list.children;
      this.heights.push(list[0].clientHeight);
      for (let i = 1; i < list.length; i++) {
        this.heights.push(this.heights[i - 1] + list[i].clientHeight);
      }
    },
    _scrollTo(index) {
      if (index == 0) {
        this.$refs.scroll.scrollTo(0, 0, 0);
      } else {
        this.$refs.scroll.scrollTo(0, -this.heights[index - 1], 0);
      }
    },
    refresh(){
      this.$refs.scroll.refresh()
    }
  },
  created() {
    //不需要响应式的数据在这边创建
    this.heights = [];
    this.touch = {};
  },
  watch: {
    singers() {
      //值改变后,等下一轮事件循环,再计算新的高度
      setTimeout(() => {
        this._calculateHeights();
      }, 20);
    },
    scrollY(nVal) {
      /* 屏幕滑动时快捷字母栏跟着滑动 */
      if (nVal < 0) {
        //不显示固定栏
        this.currentIndex = -1;
      } else if (nVal < this.heights[0]) {
        this.currentIndex = 0;
      } else {
        for (let i = 1; i < this.heights.length; i++) {
          if (nVal >= this.heights[i - 1] && nVal < this.heights[i]) {
            this.currentIndex = i;
          }
        }
      }
      //计算滚动title与固定title之间的距离差,然后监视
      this.diff = this.heights[this.currentIndex] - nVal;
    },
    diff(nVal) {
      //小于等于30让固定title进行偏移
      if (nVal <= TITLE_HEIGHT) {
        this.$refs.fixedTitle.style.transform = `translateY(-${
          TITLE_HEIGHT - nVal
        }px)`;
      } else {
        this.$refs.fixedTitle.style = "";
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 27px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0px;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>