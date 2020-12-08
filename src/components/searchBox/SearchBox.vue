<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" v-model="query" ref="input" />
    <i class="icon-dismiss" @click="clear" v-show="query.length"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from "common/js/util.js";
import { mapActions } from "vuex";
export default {
  props: {
    hotKey: {
      type: String,
      default: "",
    },
  },
  created() {
    this.$watch(
      "query",
      debounce((nVal, oVal) => {
        this.$emit("searchSongs", nVal);
      }, 300)
    );
  },
  data() {
    return {
      query: "",
    };
  },
  watch: {
    hotKey(nVal) {
      this.query = nVal;
    },
  },
  methods: {
    clear() {
      this.query = "";
    },
    blur() {
      this.$refs.input.blur();
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;

  .icon-search {
    font-size: 24px;
    color: $color-theme;
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .icon-dismiss {
    font-size: 16px;
    color: $color-theme;
  }
}
</style>