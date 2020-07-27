<template>
  <div class="single">
    <liveView></liveView>
  </div>
</template>

<script>
import liveView from "components/liveView/liveView";
import { getSingerList } from "api/singer.js";
import { Singer } from "common/js/singer.js";
const HOT_NAME = "热门";
const HOT_LENGTH = 10;
export default {
  components: {
    liveView,
  },
  data() {
    return {
      singers: [],
    };
  },
  created() {
    this._getSinger();
  },
  methods: {
    _getSinger() {
      getSingerList().then((res) => {
        this.singers = this._normalizeSingers(res.data.list);
        console.log(this.singers);
      });
    },
    _normalizeSingers(singers) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: [],
        },
      };
      for (let i = 0; i < singers.length; i++) {
        if (i < HOT_LENGTH) {
          map.hot.items.push(
            new Singer(singers[i].Fsinger_mid, singers[i].Fsinger_name)
          );
        } else {
          const key = singers[i].Findex;
          const singer = new Singer(
            singers[i].Fsinger_mid,
            singers[i].Fsinger_name
          );
          if (map[key]) {
            map[key].items.push(singer);
          } else {
            map[key] = {
              title: key,
              items: [singer],
            };
          }
        }
      }
      return Object.entries(map).filter((x) => /[A-z]/.test(x[0]));
    },
  },
};
</script>

<style lang="stylus" scoped></style>