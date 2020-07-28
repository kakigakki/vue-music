<template>
  <div class="singer">
    <listView :singers="singers"></listView>
  </div>
</template>

<script>
import listView from "components/listView/listView";
import { getSingerList } from "api/singer.js";
import { Singer } from "common/js/singer.js";
const HOT_NAME = "热门";
const HOT_LENGTH = 10;
export default {
  components: {
    listView,
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
      let hot = [];
      let res = [];
      for (const key in map) {
        if (map[key].title == HOT_NAME) {
          hot.push(map[key]);
        } else if (/[A-z]/.test(key[0])) {
          res.push(map[key]);
        }
      }
      return hot.concat(
        res.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      );
    },
  },
};
</script>

<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>